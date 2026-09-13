# Technical Specification Document

**Component:** `app-config` Domain — Four Commands
**Files:** `~/app/commands/app-config/listCommand.ts`, `getCommand.ts`, `setCommand.ts`, `unsetCommand.ts` *(new directory)*
**Project:** `app-manager`
**Language:** TypeScript (Node.js runtime)

*Phase 3 (Implementation Roadmap §7) — first real consumer of every Phase 2 component. Written as one document since the four commands share most of their design rather than as four near-duplicate files.*

---

## 0. Mapping to the Existing Command Architecture

Every existing domain (`git`, `nuxt`, `utils`, ...) registers one `BaseCommand` subclass per action, keyed as `domain.name` (`git.commit`, `git.push`, etc.) — there is no existing precedent for one file handling multiple sub-actions internally. Following that established convention rather than introducing a new one: **`app-config` is implemented as four separate `BaseCommand` subclasses**, registered as `app-config.list`, `app-config.get`, `app-config.set`, `app-config.unset`, living in a new `app/commands/app-config/` folder — matching the existing `app/commands/<domain>/<action>.ts` pattern exactly.

`am app-config` with no further argument uses the same domain-menu mechanism every other domain already gets for free from `commandRegistry.getByDomain('app-config')` — no special-cased menu-building code is needed for this domain specifically.

---

## 1. Shared Context (Applies to All Four Commands)

### 1.1 Small Addendum Surfaced Here: `configService.getRawSections()`

Writing `app-config.list`'s spec (§2) surfaced a need not anticipated in the Phase 2 `ConfigService` spec: displaying a soft warning when a section is populated somewhere it conventionally shouldn't be (per command specs §10.4 — e.g. `project-shared` populated inside the *tool*-root file) requires access to the **raw, per-file** parsed settings, not just `resolve()`'s already-merged view. Adding one small introspection method to `ConfigService`, for this purpose only (never used by resolution logic itself):

```ts
public getRawSections(): { tool: AppSettingsFile | null; project: AppSettingsFile | null } {
	return { tool: this.toolSettings, project: this.projectSettings };
}
```

Flagged explicitly as an addendum to the earlier spec rather than folded in silently, consistent with how a small `githubService` gap (`getLocalIdentity`) was surfaced the same way while specifying `resolveOrPrompt`.

### 1.2 Shared Provider-Select Prompt Logic

`app-config.set`'s interactive flow for `llm.defaultProvider`/`llm.fallbackProvider` needs the exact same `checkAvailability()`-driven select menu already specified for `resolveOrPrompt` (§5.4 of that spec). Rather than duplicating that menu-building logic in two places, it's extracted into one exported function in `app/resolvers/settingsResolver.ts`:

```ts
export function buildProviderSelectOptions(): Array<{ value: string; label: string }>;
```

Both `resolveOrPrompt` and `AppConfigSetCommand` (§4) import and call this — one place defines what the provider list looks like, everywhere it's shown stays in sync automatically.

### 1.3 Value Validation & Coercion Table

CLI arguments always arrive as raw strings; each `SettingsKey` needs its own parse/validate step before being handed to `configService.setSetting()`, which expects an already-correctly-typed value. This table is the single source of truth for that step, used by `app-config.set` (§4) and referenced by any future command that might accept a raw settings value from a flag:

| Key | Validation | Coercion |
|---|---|---|
| `author.name` | Non-empty after trim | `string` as-is |
| `author.email` | Non-empty after trim; must contain `@` (simple sanity check, not full RFC validation) | `string` as-is |
| `llm.defaultProvider`, `llm.fallbackProvider` | Case-insensitive match against a real `id` in `llmRegistry.json`'s `records`; reject otherwise | Normalized to the registry's exact-case `id` |
| `llm.enabled` | Must be exactly `'true'` or `'false'` (case-insensitive) | `boolean` |
| `github.defaultOrg` | Non-empty after trim | `string` as-is |
| `github.defaultVisibility` | Must be exactly `'public'` or `'private'` (case-insensitive) | Normalized to lowercase |
| `github.defaultBranch` | Non-empty after trim | `string` as-is |

**Rejection message for `llm.*` keys** includes both the full valid-id list and a simple "closest match" suggestion — not fuzzy string matching via a library, just a cheap heuristic (case-insensitive `startsWith` match, or exact match after stripping non-alphanumeric characters) sufficient to catch the common case of a near-miss typo (e.g. `claud` → suggest `claude`) without pulling in a dependency for it.

### 1.4 Common Metadata

| Command | ID | Label |
|---|---|---|
| List | `app-config.list` | `📋 List Settings` |
| Get | `app-config.get` | `🔍 Get Setting` |
| Set | `app-config.set` | `✏️ Set Setting` |
| Unset | `app-config.unset` | `🗑️ Unset Setting` |

All four: `isEnabled()` always returns `true` — unlike git-domain commands, app-config has no repository or file-existence precondition; it's always meaningful to run.

---

## 2. `app-config.list`

### 2.1 Purpose

Print every known `SettingsKey`'s effective value and where it resolved from — the primary "why is it this value" transparency tool for the whole two-file model.

### 2.2 CLI Usage

```
am app-config list
```

No arguments, no flags — always shows everything, headless or interactive (the display is a static report either way; there's no elaboration step this command needs from a prompt).

### 2.3 Dependency Graph

| Dependency | Purpose |
|---|---|
| `configService.resolve()`, `getSettingSource()`, `getRawSections()` (§1.1) | Per-key resolved value + source; raw file contents for the misplaced-section warning |
| `llmService.checkAvailability()` | The "Available LLM Providers" section of the output |
| `BUILT_IN_DEFAULTS` (exported from `settingsResolver.ts`, per the `resolveOrPrompt` spec §4.1) | Distinguishing "resolved from a file" from "using the built-in default" in the display |

### 2.4 Functional Logic

**For each `SettingsKey` (grouped by prefix — `author.*`, `llm.*`, `github.*`):**
1. `const value = configService.resolve(key);`
2. `const source = configService.getSettingSource(key);`
3. Display logic:
   - `source !== 'unset'` → show `value` with `[${source}]` annotation.
   - `source === 'unset'` and `key in BUILT_IN_DEFAULTS` → show `BUILT_IN_DEFAULTS[key]` with a `(default)` annotation, visually distinguished from an actual resolved-from-file value (e.g. dimmed text, or a different bracket style — `(default)` vs `[project-shared]`).
   - `source === 'unset'` and no built-in default → show `(not set)`.

**Misplaced-section warning (§1.1):** after the main table, call `getRawSections()`; if `tool.project-shared` or `tool.project-local` is non-empty, or `project['app-manager']` is non-empty, print one soft warning line per occurrence (e.g. `⚠ Found 'project-shared' settings in the tool-level file — this section is conventionally only used in a project's own settings.json.`). This is advisory only — it does not block or alter resolution, per the original design decision that this stays a soft hint, not enforcement.

**Available LLM Providers section:** call `llmService.checkAvailability()`, print each provider's name and availability (`✅`/`⚠️` + reason if unavailable) — implementing the "unified view without unified storage" approach agreed on when the registry-merge question was discussed.

### 2.5 Test Scenarios

| ID | Scenario | Expected Outcome |
|---|---|---|
| L-01 | Nothing configured anywhere | Every key shows either its built-in default with `(default)`, or `(not set)` for the five keys with no default |
| L-02 | Mixed sources | Each key's displayed source annotation matches exactly what `getSettingSource()` returns for it |
| L-03 | Tool file has a populated `project-shared` section | Warning line printed, resolution output itself unaffected |
| L-04 | No warning case | Every section populated only in its conventional location → zero warning lines printed |
| L-05 | Provider availability display | Matches `checkAvailability()`'s output exactly, one line per registry record |

---

## 3. `app-config.get`

### 3.1 Purpose

Resolve and display a single named setting.

### 3.2 CLI Usage

```
am app-config get <key>
am app-config get                 # interactive: select from a grouped key list, then behaves as above
```

### 3.3 Functional Logic

1. Resolve `key` from the first positional argument, or via an interactive grouped `select()` (Author / LLM / GitHub categories, then the specific key) if omitted.
2. Validate `key` is a real `SettingsKey` — if not (typo, headless), print the list of valid keys and exit with a non-zero status rather than a silent no-op.
3. Same resolution + display logic as one row of `app-config.list` (§2.4) — reusing that per-key display function rather than reimplementing it.

### 3.4 Test Scenarios

| ID | Scenario | Expected Outcome |
|---|---|---|
| G-01 | Valid key, headless | Same output format as one row of `list` |
| G-02 | Invalid key, headless | Non-zero exit, valid-keys list printed |
| G-03 | No key given, interactive | Grouped select shown; selecting one produces the same output as G-01 |

---

## 4. `app-config.set`

### 4.1 Purpose

Explicitly write a setting to a specific tier, with validation.

### 4.2 CLI Usage

```
am app-config set <key> <value> [--tool]
am app-config set                              # fully interactive: select key, then appropriate prompt for value
```

### 4.3 Functional Logic

1. Resolve `key`/`value` from positional args, or interactively (grouped select for key, then either a `text()` prompt or — for `llm.defaultProvider`/`fallbackProvider` specifically — the shared `buildProviderSelectOptions()` menu from §1.2, so the experience matches `resolveOrPrompt`'s lazy-prompt path exactly).
2. Run the value through §1.3's validation/coercion table. On failure: print the specific reason (including the closest-match suggestion for `llm.*` keys) and exit without writing anything.
3. Determine target section: `options.tool` (the `--tool` flag) → `'app-manager'`; otherwise → `'project-shared'` (never `'project-local'` from this command — per the original design decision, that section is populated only via the automatic lazy-prompt flow, keeping its provenance clear).
4. `await configService.setSetting(key, coercedValue, section);`
5. Confirm success, echoing back the key, value, and section written to.

### 4.4 Test Scenarios

| ID | Scenario | Expected Outcome |
|---|---|---|
| S-01 | Valid key/value, headless, no `--tool` | `setSetting` called with section `'project-shared'` |
| S-02 | Valid key/value, headless, `--tool` | `setSetting` called with section `'app-manager'` |
| S-03 | Invalid `llm.defaultProvider` value, close typo | Rejected; error includes a suggested valid id |
| S-04 | Invalid `llm.enabled` value (not `'true'`/`'false'`) | Rejected before any `setSetting` call |
| S-05 | Interactive, `llm.defaultProvider` selected | `buildProviderSelectOptions()`'s menu shown, not a plain text prompt |
| S-06 | `setSetting` itself rejects/throws (disk write failure) | Error surfaced to the user; no false "success" message printed |

---

## 5. `app-config.unset`

### 5.1 Purpose

Remove a previously-set value at a specific section, letting resolution fall through to the next one.

### 5.2 CLI Usage

```
am app-config unset <key> [--tool] [--personal]
```

**New flag not present on `set`:** `--personal`, targeting `'project-local'`. Asymmetric by design — `set` never writes directly to `'project-local'` (only the lazy-prompt flow populates it, keeping provenance clear), but a user should still be able to **remove** an auto-persisted personal value by hand without needing to go through a prompt flow again. Default (no flag): `'project-shared'`. `--tool`: `'app-manager'`.

### 5.3 Functional Logic

1. Resolve `key` and target section from flags (default `'project-shared'`; `--tool` → `'app-manager'`; `--personal` → `'project-local'`; `--tool`+`--personal` together is invalid — reject with a clear error rather than silently picking one).
2. `await configService.unsetSetting(key, section);`
3. Confirm success. If the key had no value at that section to begin with, `unsetSetting` is a documented no-op (per its Phase 2 spec) — still report this clearly (e.g. "Nothing to remove — `llm.fallbackProvider` was not set in project-local") rather than a generic success message that implies something changed.

### 5.4 Test Scenarios

| ID | Scenario | Expected Outcome |
|---|---|---|
| U-01 | Unset a value that exists in `project-shared` | `unsetSetting` called with that section; subsequent `resolve()` falls through correctly |
| U-02 | `--personal` flag | Targets `'project-local'` |
| U-03 | Both `--tool` and `--personal` given | Rejected before calling `unsetSetting` |
| U-04 | Key not set at the target section | No-op reported clearly, not as a generic success |

---

## Final Architectural Notes

- This is the first command spec in the whole plan that consumes every Phase 2 component simultaneously (`configService`, `llmService`, and — indirectly, via the shared `buildProviderSelectOptions` — the `resolvers` layer) without needing any new service capability of its own beyond the one small `getRawSections()` addendum in §1.1. That's a reasonable checkpoint: if these four commands work end-to-end against real Phase 2 code, the foundation is validated before Phase 4 (Git domain) builds further on top of it.
- Per the roadmap's phase ordering, **Phase 4 is next** — the Git domain consolidation (`git.sync`/`syncRepo`/`syncReposAll`, `git.push`/`pushAll`, `git.commit` absorbing `manageCommits`, `git.addSubmodules`, `git.initLayers`, `git.deleteRemoteRepos`). `git.deleteRemoteRepos` specifically will be the first command outside app-config itself to call `configService.resolve('github.defaultOrg')` in practice, per its own spec in the command-specs document.
