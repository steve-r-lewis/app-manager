# Technical Specification Document

**Component:** `ConfigService` (Settings Extension)
**File:** `~/app/services/configService.ts`
**Related Types:** `~/app/types/services/configServiceTypes.ts`
**Project:** `app-manager`
**Language:** TypeScript (Node.js runtime)

*This is the first of the Phase 2 component specifications (Implementation Roadmap §7), drafted as the template to validate format/detail level before the remaining ~40 documents are produced.*

---

## Part 1: Operational & Design Specification

### 1. Component Overview

#### 1.1 Purpose

Extends the existing `ConfigService` — currently limited to in-memory, per-invocation runtime state (`cwd`, `gitUser`, `flags`) — with **persisted, two-file settings** as specified in `app-manager-command-specs.md` §10. Adds the ability to load, resolve (with tiered precedence), write, and remove named settings values, backed by two on-disk JSON files rather than purely in-memory defaults.

#### 1.2 Role in System

**Architectural Role:** Application Infrastructure / Configuration Resolution Layer.

**System Context:**
- Consumed directly by the `app-config` command (list/get/set/unset).
- Consumed indirectly, via the new `resolveOrPrompt` helper (a separate component, not specified in this document), by every command needing a persisted setting: `git.commit`, `git.deleteRemoteRepos`, `nuxt.createLayer`, `nuxt.extractDocs`, `utils.autoDoc`, `utils.autoVersion`, `utils.validateHeaders`, `app.setup`, and `headerTemplate.ts`.
- Remains a singleton, consistent with the existing `ConfigService` export pattern and every other service in this codebase.

### 2. Architecture & Patterns

#### 2.1 Design Patterns

| Pattern | Usage |
|---|---|
| **Singleton (existing, unchanged)** | One `configService` instance for the process lifetime. |
| **Repository (new)** | The two settings files are treated as a small, precedence-ordered repository of named values, abstracted behind `resolve`/`setSetting`/`unsetSetting` — callers never touch file paths or JSON shape directly. |
| **Fail-Soft Loading (new)** | A settings file that exists but fails schema validation does not crash the application — it is treated as empty, with a logged warning. See §5.1. |

#### 2.2 State Management

**Statefulness:** Stateful, extended.

New private state, held in memory after `loadSettings()` runs:
```ts
private toolSettings: AppSettingsFile | null = null;
private projectSettings: AppSettingsFile | null = null;
```
Both are re-parsed, validated `AppSettingsFile` objects (or `null` if the corresponding file doesn't exist / failed validation). `resolve()`, `getSettingSource()` read from these in memory; `setSetting()`/`unsetSetting()` update the in-memory copy immediately after a successful disk write, so a `set` followed by a `get` in the same process reflects the change without re-reading from disk.

#### 2.3 Complexity Assessment

**Rating:** Low–Medium.

Each new public method is individually simple (linear precedence checks, or a read-mutate-write sequence). The complexity is concentrated in getting the file-existence / schema-validation / three-way fallback logic right in `loadSettings()` and in the surgical-write behavior of `setSetting()`/`unsetSetting()` (§5.4–5.5), both of which have several distinct branches that need explicit test coverage (Part 2).

### 3. Dependency Graph

#### 3.1 Internal Dependencies

| Dependency | Purpose |
|---|---|
| `./fileService.js` (`fileService` singleton) | All file I/O — `read()` for loading (with schema validation built into the call), `update()`/`write()` for persisting. No direct `fs` calls in `ConfigService` itself, consistent with every other service in this codebase delegating file I/O to `fileService`. |
| `../types/services/configServiceTypes.js` | `AppSettingsFileSchema`, `SettingsSectionSchema`, `SettingsKey`, `SettingsValueMap` (all new — §4). |
| `./loggerService.js` (`logger` singleton) | Warnings on schema-validation failure (fail-soft loading), info logging on writes. |

#### 3.2 External Dependencies

| Library | Usage |
|---|---|
| `zod` | Schema definition and runtime validation (already the established pattern in this file via `GitUserConfigSchema`/`AppConfigFlagsSchema`). |
| `node:path` | Constructing `<root>/app-manager/settings.json` paths. |

**Explicitly not a dependency:** `jsonc-parser` is not imported directly here — surgical JSON editing stays encapsulated inside `fileService.update()`, which `ConfigService` calls rather than duplicating.

#### 3.3 Coupling Analysis

**Coupling Level:** Low–Medium, unchanged in character from the existing file.

`ConfigService` depends on `fileService`'s existing public API only (`read`, `update`, `write`) — no new capability is required from `fileService` itself for this component. This was verified directly against `fileService.ts`'s current implementation rather than assumed; see §5.4 for the one real constraint this surfaced (`update()` only patches **top-level** keys per call, which shapes the write strategy below).

### 4. Data Types & Interfaces

#### 4.1 New Schemas (`configServiceTypes.ts`)

```ts
export const AuthorSettingsSchema = z.object({
	name: z.string().nullable().default(null),
	email: z.string().nullable().default(null)
}).partial();

export const LlmSettingsSchema = z.object({
	defaultProvider: z.string().nullable().default(null),
	fallbackProvider: z.string().nullable().default(null),
	enabled: z.boolean().default(true)
}).partial();

export const GithubSettingsSchema = z.object({
	defaultOrg: z.string().nullable().default(null),
	defaultVisibility: z.enum(['public', 'private']).default('private'),
	defaultBranch: z.string().default('main')
}).partial();

export const SettingsSectionSchema = z.object({
	author: AuthorSettingsSchema.default({}),
	llm: LlmSettingsSchema.default({}),
	github: GithubSettingsSchema.default({})
}).partial();

export const AppSettingsFileSchema = z.object({
	metadataEntity: z.object({
		description: z.string(),
		targetFile: z.string(),
		currentVersion: z.string(),
		createdAt: z.string(),
		revisionHistory: z.array(z.object({
			schemaVersion: z.string(),
			archivedAt: z.string(),
			revisionNote: z.string()
		}))
	}),
	'app-manager': SettingsSectionSchema.default({}),
	'project-shared': SettingsSectionSchema.default({}),
	'project-local': SettingsSectionSchema.default({})
});

export type AppSettingsFile = z.infer<typeof AppSettingsFileSchema>;
export type SettingsSection = z.infer<typeof SettingsSectionSchema>;
export type SettingsFileSectionName = 'app-manager' | 'project-shared' | 'project-local';
```

Every field uses `.default(...)`, deliberately — a hand-edited or partially-generated settings file that omits entire sections must still parse successfully rather than fail validation for missing-but-optional data. This matches the resilience posture `fileService.read()` already expects from its schema-validated callers.

**Note on `jsonTemplate.ts`:** checked as a candidate for generating this envelope and found to be the wrong shape — it produces a `development`/`production` lifecycle + `metadataContent`/`records` structure for a different, data-catalog-style purpose, not the flat shape `llmRegistry.json`/`repositoryRegistry.json` (and now `settings.json`) actually use. `ConfigService` constructs its own `metadataEntity` block directly (§5.4) rather than reusing that template.

#### 4.2 New Public Type: The Settings Key Map

```ts
export interface SettingsValueMap {
	'author.name': string | null;
	'author.email': string | null;
	'llm.defaultProvider': string | null;
	'llm.fallbackProvider': string | null;
	'llm.enabled': boolean;
	'github.defaultOrg': string | null;
	'github.defaultVisibility': 'public' | 'private';
	'github.defaultBranch': string;
}
export type SettingsKey = keyof SettingsValueMap;
```

This is a deliberate design choice over accepting an arbitrary `string` key: every caller of `resolve()`/`setSetting()` across every future command gets full compile-time checking and autocomplete on both the key name and its value type, with zero `any`. Adding a new setting later means adding one line here — the resolution logic in §5.2 is generic over this map and requires no changes.

#### 4.3 Public API & Return Types

| Method | Signature | Notes |
|---|---|---|
| `loadSettings` | `(toolRoot: string, targetRoot: string) => Promise<void>` | New. Called once, from `index.ts`'s `main()`. |
| `resolve` | `<K extends SettingsKey>(key: K) => SettingsValueMap[K] \| undefined` | New. Pure, synchronous, no I/O. |
| `setSetting` | `<K extends SettingsKey>(key: K, value: SettingsValueMap[K], section: SettingsFileSectionName) => Promise<void>` | New. Async — performs a disk write. |
| `unsetSetting` | `(key: SettingsKey, section: SettingsFileSectionName) => Promise<void>` | New. Async. |
| `getSettingSource` | `(key: SettingsKey) => SettingsFileSectionName \| 'unset'` | New. Pure, synchronous. |
| `init`, `reset`, `getConfig`, `setGitUser`, `setFlag`, `isVerbose` | *(unchanged)* | Existing runtime-state methods, untouched by this extension — settings and runtime config (`cwd`/`gitUser`/`flags`) remain conceptually separate, per the distinction drawn in the original settings design discussion. |

**Type Safety Observations:** No `any` introduced. `resolve`'s generic return type (`SettingsValueMap[K] | undefined`) is the one place `undefined` is a meaningful, expected return (key genuinely unset anywhere) rather than an error state — every caller must handle it, which is exactly what forces `resolveOrPrompt` (the separate consuming component) to exist rather than callers silently assuming a value is always present.

### 5. Functional Logic Specification

#### 5.1 `loadSettings(toolRoot: string, targetRoot: string): Promise<void>`

**Logic Flow:**
1. Compute `toolPath = path.join(toolRoot, 'app-manager', 'settings.json')` and `projectPath = path.join(targetRoot, 'app-manager', 'settings.json')`.
2. For each path independently, call `fileService.read(path, AppSettingsFileSchema)`.
3. **Three possible outcomes per file, handled distinctly:**
   - File doesn't exist → `fileService.read()` returns `null` (confirmed against `fileService`'s actual `readText`/`read` implementation, which returns `null` on `ENOENT` before ever attempting schema validation). Store `null` in the corresponding `this.toolSettings`/`this.projectSettings` slot — this is the normal "nothing configured yet" state, not an error.
   - File exists and is valid → `fileService.read()` returns the validated `AppSettingsFile`. Store it directly.
   - File exists but fails schema validation → `fileService.read()` **throws** (confirmed: `read()`'s schema branch throws `Schema validation failed for ${filePath}` on a failed `safeParse`, rather than returning `null`). **This must be caught here**, not allowed to propagate — log a warning via `logger.warn` naming the file and reason, then store `null` for that slot, so a single corrupted settings file degrades to "nothing configured" rather than crashing every subsequent command invocation.
4. Each of the two reads is wrapped in its own independent `try/catch` — a corrupt tool file must not prevent the project file from loading, and vice versa.

**Side Effects:** Populates `this.toolSettings`/`this.projectSettings`. Two file reads.

**Error Handling:** As above — the only error state this method can itself produce (as opposed to catching) is an `fs` permission error surfacing through `fileService.readText()`, which `fileService` itself already escalates (rethrows) rather than swallowing; this method does not add further handling for that case and lets it propagate, consistent with `fileService`'s own posture on permission errors.

#### 5.2 `resolve<K extends SettingsKey>(key: K): SettingsValueMap[K] | undefined`

**Logic Flow:**
1. Split `key` on `.` into `[section, field]` (e.g. `'llm.defaultProvider'` → `['llm', 'defaultProvider']`).
2. Check `this.projectSettings?.['project-local']?.[section]?.[field]` — if defined and not `null`... **note:** several fields are typed `string | null` where `null` is itself a meaningful "explicitly present but empty" schema default, not "absent." Resolution must distinguish **key absent from the object** (fall through to the next section) from **key present with value `null`** (per the settings table in the command specs, every nullable field has no safe built-in default and is meant to trigger prompt-and-persist — so a stored `null` should be treated the same as "not found here," continuing the fallback chain, not returned as a final answer of `null`). Concretely: skip a section's value for a given key if it is `undefined` **or** `null`; only a genuinely set, non-null value short-circuits the chain. Boolean/string-with-real-default fields (`llm.enabled`, `github.defaultVisibility`, `github.defaultBranch`) don't have this ambiguity since their schema defaults are real usable values, not `null`.
3. Repeat against `this.projectSettings?.['project-shared']?.[section]?.[field]`.
4. Repeat against `this.toolSettings?.['app-manager']?.[section]?.[field]`.
5. If none matched, return `undefined` — resolution to a built-in code default or a prompt is explicitly **not** this method's job; that's `resolveOrPrompt`'s responsibility (a separate component), keeping this method a pure, small lookup.

**Side Effects:** None.

**Error Handling:** None required — every access is against already-validated, already-defaulted (`.default(...)`) schema output, so no property access can throw; a key genuinely absent everywhere simply falls through every check and returns `undefined`.

#### 5.3 `getSettingSource(key: SettingsKey): SettingsFileSectionName | 'unset'`

**Logic Flow:** Identical traversal order to `resolve()` (§5.2), but returns the **name of the section it was found in** instead of the value, or the literal string `'unset'` if no section had a non-null value for it. Implemented by sharing the same internal traversal helper as `resolve()` (a private method, e.g. `findSection(key): SettingsFileSectionName | null`), so the precedence order can never drift between the two methods — this was a deliberate implementation choice to prevent `app-config list`'s "where did this come from" reporting from ever silently disagreeing with what `resolve()` itself actually returns.

#### 5.4 `setSetting<K extends SettingsKey>(key: K, value: SettingsValueMap[K], section: SettingsFileSectionName): Promise<void>`

**Logic Flow:**
1. Determine target file: `section === 'app-manager'` → the tool-root file; `'project-shared'`/`'project-local'` → the project-root file.
2. Split `key` into `[fieldGroup, fieldName]` (e.g. `['author', 'name']`).
3. Read the target file's **current full parsed state** — reuse `this.toolSettings`/`this.projectSettings` if already loaded (it will be, since `loadSettings()` runs before any command executes), rather than re-reading from disk.
4. **If the file doesn't exist yet at all** (in-memory slot is `null`): construct a fresh, complete `AppSettingsFile` object — all three top-level sections present as empty objects except the one being set, plus a freshly-built `metadataEntity` block (`description: 'App Manager settings'`, `targetFile` set to the actual path, `currentVersion: '1.0.0'`, `createdAt: new Date().toISOString()`, `revisionHistory` with one entry noting initial creation) — then call `fileService.write(path, fullObject)` (a full write is correct and unavoidable here; there is nothing yet to surgically patch).
5. **If the file already exists:** take the in-memory section object for the target `section`, set `[fieldGroup][fieldName] = value` on a **shallow-cloned copy** (never mutate the cached in-memory object directly before the disk write succeeds — see Error Handling below), then call `fileService.update(path, { [section]: mutatedSectionObject })`.
   - **This specific call shape is a direct consequence of `fileService.update()`'s actual, verified behavior:** it applies `jsonc-parser`'s `modify()` once per **top-level key** of the object passed to it. Passing `{ [section]: mutatedSectionObject }` means exactly one top-level key (`'app-manager'`, `'project-shared'`, or `'project-local'`) is surgically replaced in place — every other top-level key in the file (`metadataEntity`, and the other two sections) is left untouched, comments and formatting preserved. Passing a dotted key like `{ 'app-manager.author.name': value }` would **not** work — `fileService.update()` has no path-splitting logic and would attempt to set a literal top-level key named `"app-manager.author.name"`, which is not what's wanted. This was verified against `fileService.ts`'s real implementation before this method was designed, not assumed.
6. On successful write, update `this.toolSettings`/`this.projectSettings` in memory to match, so a subsequent `resolve()` call in the same process sees the change immediately without a disk round-trip.

**Side Effects:** One disk write (full or surgical, per step 4/5); updates in-memory state.

**Error Handling:** If `fileService.write()`/`update()` throws, the in-memory state is **not** updated (step 6 is skipped) — the in-memory settings and on-disk settings must never be allowed to disagree, so a failed write leaves the previous in-memory state intact rather than optimistically updating first. The error propagates to the caller (`app-config set`, or `resolveOrPrompt`'s persist step) to report.

#### 5.5 `unsetSetting(key: SettingsKey, section: SettingsFileSectionName): Promise<void>`

**Logic Flow:** Shares nearly all of `setSetting`'s logic (§5.4) — the only difference is step 5's mutation: instead of assigning a new value, delete the field from the cloned section object (or reset it to its schema default, which for every nullable field is `null` — functionally equivalent to "unset" per §5.2's resolution semantics, since a stored `null` is already treated as "not found here"). The same `fileService.update(path, { [section]: mutatedSectionObject })` call persists it.

**Edge Case:** Calling `unsetSetting` for a section/key where the file doesn't exist yet, or the value was already unset, is a safe no-op — there's nothing to remove, and this method should not throw or create a file purely to record an absence.

---

## Part 2: Appendix — Testing Reference

### 1. Mocking Strategy

| Dependency | Mock Target | Behavior |
|---|---|---|
| `fileService` | `read`, `write`, `update` | `read`: configurable to return `null` (missing file), a valid `AppSettingsFile` (happy path), or to throw (schema validation failure — the specific error message format from `fileService.ts`'s real implementation should be used in the mock, not a generic error, so the catch-and-warn logic in §5.1 is tested against realistic input). `write`/`update`: spies, resolving successfully by default; individually configurable to reject, to test §5.4's "don't update in-memory state on write failure" behavior. |
| `loggerService` | `warn` | Spy — assert called with a message identifying the specific file on schema-validation failure. |

### 2. Test Scenarios

#### 2.1 `loadSettings`

| ID | Scenario | Mock Setup | Expected Outcome |
|---|---|---|---|
| LS-01 | Both files missing (first-ever run) | `fileService.read` returns `null` for both paths | `toolSettings`/`projectSettings` both set to `null`; no warning logged |
| LS-02 | Both files present and valid | `fileService.read` returns valid `AppSettingsFile` objects for both | Both stored as-is |
| LS-03 | Tool file corrupt, project file valid | `fileService.read` throws for tool path, returns valid data for project path | `toolSettings` = `null` + warning logged; `projectSettings` populated normally; **no exception propagates out of `loadSettings`** |
| LS-04 | Project file corrupt, tool file valid | Inverse of LS-03 | Inverse of LS-03 — proves the two reads are independently isolated, not just "first one wins" |

#### 2.2 `resolve`

| ID | Scenario | Setup | Expected Outcome |
|---|---|---|---|
| R-01 | Value set only in `project-local` | `project-local.llm.defaultProvider = 'claude'`, all else empty | Returns `'claude'` |
| R-02 | Value set in both `project-shared` and `app-manager` (tool) | `project-shared.github.defaultOrg = 'org-a'`, `app-manager.github.defaultOrg = 'org-b'` | Returns `'org-a'` — proves project beats tool |
| R-03 | Value set only at tool tier | `app-manager.author.name = 'Steve'`, both project sections empty | Returns `'Steve'` |
| R-04 | Key genuinely unset everywhere | All three sections empty for the key | Returns `undefined` |
| R-05 | Key present but explicitly `null` in a higher-precedence section, real value in a lower one | `project-local.author.name = null`, `app-manager.author.name = 'Steve'` | Returns `'Steve'` — proves stored `null` is treated as "not found here," not as a final answer, per §5.2 step 2 |
| R-06 | `llm.enabled` unset everywhere | All sections empty | Returns `undefined` (not `true`) — proves `resolve()` does **not** apply the schema's built-in default; that's `resolveOrPrompt`'s job, not this method's |

#### 2.3 `getSettingSource`

| ID | Scenario | Expected Outcome |
|---|---|---|
| GS-01 | Same setup as R-02 | Returns `'project-shared'` |
| GS-02 | Same setup as R-04 | Returns `'unset'` |

#### 2.4 `setSetting`

| ID | Scenario | Mock Setup | Expected Outcome |
|---|---|---|---|
| SS-01 | File doesn't exist yet, setting `app-manager` section | In-memory `toolSettings` is `null` | `fileService.write` called (not `update`) with a full, valid `AppSettingsFile` object containing a freshly-constructed `metadataEntity` and the one populated section |
| SS-02 | File exists, setting a field in `project-shared` | In-memory `projectSettings` populated | `fileService.update` called with exactly `{ 'project-shared': <mutated object> }` — assert no other top-level key is present in the call argument |
| SS-03 | Write fails | `fileService.update` rejects | In-memory state is **unchanged** after the call — assert a subsequent `resolve()` still returns the pre-write value |
| SS-04 | Successful write | `fileService.update` resolves | In-memory state updated; a subsequent `resolve()` in the same test returns the new value without any further mock read |

#### 2.5 `unsetSetting`

| ID | Scenario | Expected Outcome |
|---|---|---|
| US-01 | Key currently set, then unset | `fileService.update` called with the field removed/reset to `null`; subsequent `resolve()` for that key falls through to the next section (or `undefined`) |
| US-02 | Key already unset, called anyway | No-op — `fileService.update`/`write` **not** called at all |

### 3. Test Data Requirements

**Sample valid `AppSettingsFile` (tool root):**
```json
{
  "metadataEntity": {
    "description": "App Manager settings",
    "targetFile": "~/app-manager/settings.json",
    "currentVersion": "1.0.0",
    "createdAt": "2026-01-01T00:00:00.000Z",
    "revisionHistory": [
      { "schemaVersion": "1.0.0", "archivedAt": "2026-01-01T00:00:00.000Z", "revisionNote": "Initial creation" }
    ]
  },
  "app-manager": {
    "author": { "name": "Steve Lewis", "email": "steve@example.com" },
    "llm": { "defaultProvider": "claude", "fallbackProvider": "gemini", "enabled": true },
    "github": { "defaultOrg": "steve-r-lewis", "defaultVisibility": "private", "defaultBranch": "main" }
  },
  "project-shared": {},
  "project-local": {}
}
```

**Sample valid `AppSettingsFile` (project root), for R-02/R-05:**
```json
{
  "metadataEntity": { "...": "as above, targetFile differs" },
  "app-manager": {},
  "project-shared": {
    "github": { "defaultOrg": "org-a" }
  },
  "project-local": {
    "author": { "name": null }
  }
}
```

**Simulated schema-validation-failure input (for LS-03/LS-04):** any object missing the required `metadataEntity` block entirely, or with `github.defaultVisibility` set to a value outside the `'public' | 'private'` enum — either is sufficient to trigger `AppSettingsFileSchema`'s `safeParse` failure inside the mocked `fileService.read()`.

---

## Final Architectural Notes

- This spec deliberately does **not** cover `resolveOrPrompt` (the prompt-and-persist helper) — that's a separate component (UI-layer, depends on `@clack/prompts`), specified independently, consuming `resolve`/`setSetting` as documented here.
- The one real design decision this spec resolves that wasn't obvious from the requirements-level discussion alone: `fileService.update()`'s top-level-key-only patching behavior means `setSetting`/`unsetSetting` must always read-mutate-write a whole *section* object, never attempt a deeper dotted-path surgical edit directly. This was found by reading `fileService.ts`'s actual implementation, not assumed — worth flagging as the kind of fact this format is specifically meant to surface before implementation starts, not during it.
- Future enhancement, not required for Phase 2: extending `fileService.update()` itself to accept nested path arrays (mirroring `jsonc-parser`'s own `modify(text, path: (string|number)[], ...)` signature) would let `setSetting` do a truly field-level surgical edit instead of a section-level one. Not necessary now — auto-generated settings files have no hand-authored comments inside individual sections to lose — but worth remembering if that ever changes.
