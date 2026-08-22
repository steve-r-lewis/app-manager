# Technical Specification Document

**Component:** `resolveOrPrompt` (Shared Settings Resolution Helper)
**File:** `~/app/resolvers/settingsResolver.ts` *(new file, new top-level directory — see §1.2)*
**Project:** `app-manager`
**Language:** TypeScript (Node.js runtime)

*Fourth and final Phase 2 component specification (Implementation Roadmap §7). Depends on the `ConfigService` settings extensions and `LLMService` fallback chain specified separately.*

---

## Part 1: Operational & Design Specification

### 1. Component Overview

#### 1.1 Purpose

Implements the prompt-and-persist behavior from `app-manager-command-specs.md` §10.7: given a settings key, return its resolved value if one exists anywhere in the tier chain or has a safe built-in default; otherwise, in an interactive session, prompt for it and persist the answer; in a headless session, fail with an actionable error instead of hanging.

#### 1.2 A Placement Decision, Not Just a File Path

This does not fit cleanly into any existing top-level directory, and that's worth resolving explicitly rather than forcing it somewhere for convenience:

- **Not `app/services/`** — every existing service (`configService`, `llmService`, `githubService`, `fileService`, `processService`, `loggerService`) is deliberately UI-agnostic; none of them import `@clack/prompts`. This helper's entire reason for existing is to prompt the user, so putting it in `services/` would break a consistent, load-bearing convention across the whole service layer.
- **Not `app/commands/`** — it isn't a command itself; it's a small library many different commands, across every domain, call into.
- **Not `app/modes/`** — `headlessMode.ts`/`interactiveMode.ts` handle top-level dispatch and menu construction, a different concern from a single per-setting resolution call made from deep inside an individual command's execution logic.

**Decision:** a new top-level directory, `app/resolvers/`, holding this one file for now. It sits alongside `services`/`scanners`/`strategies`/`templates`/`orchestrators`/`modes`/`commands` as a small, honestly-named seventh category — a UI-aware bridge between the settings layer and commands — rather than being quietly misfiled into one of the existing six.

### 2. Architecture & Patterns

#### 2.1 Design Patterns

| Pattern | Usage |
|---|---|
| **Facade** | Gives every calling command one call (`resolveOrPrompt`) instead of each command re-implementing "check settings, check default, maybe prompt, maybe persist" independently. |
| **Strategy (via `promptConfig`)** | The actual prompt shown varies per setting (plain text vs. the `checkAvailability()`-driven select for `llm.*` keys) — the caller supplies which, this function supplies the surrounding resolve/persist logic. |

#### 2.2 State Management

Stateless — a pure function (aside from its calls into `configService`, which owns all actual state).

#### 2.3 Complexity Assessment

**Rating:** Medium. Not because any individual branch is complex, but because there are several genuinely distinct paths (found → default → prompt-interactive → fail-headless) each with different persistence behavior, and getting the *order* of these checks right is the entire value of centralizing this logic in one place instead of leaving each command to reimplement it slightly differently.

### 3. Dependency Graph

#### 3.1 Internal Dependencies

| Dependency | Purpose |
|---|---|
| `../services/configService.js` | `resolve()`, `setSetting()` |
| `../services/llmService.js` | `checkAvailability()` — needed specifically for building the `llm.*` select-menu prompt |

#### 3.2 External Dependencies

| Library | Usage |
|---|---|
| `@clack/prompts` | `text()`, `select()`, `isCancel()` — the actual prompting |

#### 3.3 Coupling Analysis

**Coupling Level:** Medium-High, deliberately — this is the one component in the whole settings design that's allowed to be coupled to both the settings layer and the UI layer, precisely so that no command-level file needs to be coupled to both itself.

### 4. Data Types & Interfaces

#### 4.1 Built-In Defaults Table (Code, Not Just Documentation)

The table in the command specs (§10.3) needs a concrete in-code representation, since `resolveOrPrompt` has to look up "does this key have a safe default" programmatically:

```ts
const BUILT_IN_DEFAULTS: Partial<SettingsValueMap> = {
	'llm.enabled': true,
	'github.defaultVisibility': 'private',
	'github.defaultBranch': 'main'
};
```
Every `SettingsKey` **not** present in this object is treated as "no safe default — must resolve via settings or prompt," per the same table.

#### 4.2 Prompt Configuration Type

```ts
export type PromptConfig =
	| { kind: 'text'; message: string; placeholder?: string }
	| { kind: 'provider-select'; message: string }; // drives the checkAvailability()-based menu, §5.4
```

#### 4.3 Public API

```ts
export async function resolveOrPrompt<K extends SettingsKey>(
	key: K,
	options: {
		promptConfig: PromptConfig;
		persistSection: SettingsFileSectionName; // where a prompted answer gets written
		headlessFallbackMessage?: string;         // optional override for the thrown error text
	}
): Promise<SettingsValueMap[K]>;
```

Notably, this **always** resolves to a real value or throws — it never returns `undefined`, unlike `configService.resolve()` itself. That's the entire point of this function existing as a separate layer on top of `resolve()`.

### 5. Functional Logic Specification

#### 5.1 Overall Flow

1. `const existing = configService.resolve(key);` — if defined, return it immediately. No prompt, no write, no further logic.
2. If undefined: check `BUILT_IN_DEFAULTS[key]`. If present, return it — again, no prompt, no write.
3. If undefined and no built-in default: branch on whether the current session is interactive (see §5.2 for how this is determined) —
   - **Headless:** throw `new Error(options.headlessFallbackMessage ?? \`Missing required setting '${key}'. Run: am app-config set ${key} <value>\`)`.
   - **Interactive:** run the prompt described by `options.promptConfig` (§5.3–5.4), then call `configService.setSetting(key, answer, options.persistSection)`, then return `answer`.

#### 5.2 Determining Interactive vs. Headless

**Design decision, not assumed:** this function does not re-derive "are we headless" itself — it accepts it implicitly via which code path calls it. In practice, `resolveOrPrompt` should only ever be called from within a command's interactive branch to begin with; a command's own headless branch should check `configService.resolve(key)` directly (or call `resolveOrPrompt` but expect it to always take the headless-throw path, never the prompt path, since a real terminal prompt cannot be shown in a headless run regardless of what this function does). To make this concrete and avoid ambiguity: **`resolveOrPrompt` takes an explicit `isHeadless: boolean` parameter** (added to the options object in §4.3, omitted above for brevity — corrected here) rather than trying to detect it internally via `process.stdin.isTTY` or similar, since every calling command already knows its own mode (it's threaded through every command's `execute(targetRoot, options)` already, per the existing `options.force`/`--yes` conventions seen throughout the command specs).

**Corrected signature:**
```ts
export async function resolveOrPrompt<K extends SettingsKey>(
	key: K,
	options: {
		isHeadless: boolean;
		promptConfig: PromptConfig;
		persistSection: SettingsFileSectionName;
		headlessFallbackMessage?: string;
	}
): Promise<SettingsValueMap[K]>;
```

#### 5.3 Text Prompt Path (`promptConfig.kind === 'text'`)

**Logic Flow:**
1. `const answer = await text({ message: promptConfig.message, placeholder: promptConfig.placeholder });`
2. If `isCancel(answer)`, throw a clear cancellation error (`'Setup cancelled — no value provided for ${key}.'`) rather than persisting an empty/garbage value.
3. Otherwise, proceed to persistence as in §5.1 step 3.

#### 5.4 Provider-Select Prompt Path (`promptConfig.kind === 'provider-select'`)

**Logic Flow:**
1. Call `llmService.checkAvailability()`.
2. Build `select()` options from the result: label format `${status.available ? '✅' : '⚠️'} ${status.name}${status.available ? '' : ` (${status.reason})`}` — showing every registry provider, available or not, so the user can see *why* an option is greyed-out-in-spirit rather than it simply being absent from the list.
3. `const answer = await select({ message: promptConfig.message, options: [...] });`
4. If `isCancel(answer)`, same cancellation handling as §5.3.
5. Proceed to persistence.

**Explicit non-requirement:** this path does not prevent the user from selecting an *unavailable* provider (missing API key) — that's a legitimate choice (e.g. "I'll set the key later") and the resolution chain in `LLMService.resolveActiveProvider()` already handles an unavailable configured-default gracefully by falling through to fallback/any-available/none. Blocking the selection here would just be a second, redundant place enforcing the same constraint.

#### 5.5 Author/GitHub Fallback-Before-Prompt

Per the command specs' settings table (§10.3), `author.name`/`author.email` should attempt a **git-identity lookup before prompting**, not go straight to a blank prompt. This is implemented as one additional check inserted between step 2 and step 3 of §5.1, specific to those two keys only:

```ts
if (key === 'author.name' || key === 'author.email') {
	const gitStatus = await githubService.getStatus(targetRoot); // needs targetRoot threaded through — see note below
	// resolve git user.name/user.email via a small githubService addition or direct simple-git call
	// if found, treat it exactly like a built-in default (§5.1 step 2) — return it, no prompt
}
```
**Open implementation detail, not fully resolved by this spec:** `githubService` currently has no method exposing the local git config's `user.name`/`user.email` values directly (`getStatus()` returns branch/dirty/staged/ahead/behind — not identity). This needs either a small new `githubService.getLocalIdentity(cwd): Promise<{ name?: string; email?: string }>` method (a natural, small addition — `simple-git`'s `getConfig('user.name')`/`getConfig('user.email')`, mirroring how `initRepo()` already calls `git.addConfig` for the same two keys in the opposite direction) or equivalent. Flagging this explicitly rather than hand-waving it, since it's a real, small piece of missing functionality this helper depends on that wasn't caught until writing this spec.

---

## Part 2: Appendix — Testing Reference

### 1. Mocking Strategy

| Dependency | Mock Target | Behavior |
|---|---|---|
| `configService` | `resolve`, `setSetting` | Standard configurable mocks. |
| `llmService` | `checkAvailability` | Fixed test data, several provider availability combinations. |
| `@clack/prompts` | `text`, `select`, `isCancel` | Standard pattern already established across this codebase's other command tests (`p.text`/`p.select`/`p.isCancel` mocking is already exercised in the existing `commitCommand`/`pushCommand` specs — reuse that same approach here rather than inventing a new one). |
| `githubService` | `getLocalIdentity` (new, per §5.5) | Configurable to return a found identity, a partial one (name only, no email), or nothing. |

### 2. Test Scenarios

| ID | Scenario | Setup | Expected Outcome |
|---|---|---|---|
| RP-01 | Value already resolvable | `configService.resolve` returns a value | Returned immediately; `text`/`select` never called; `setSetting` never called |
| RP-02 | Value unresolvable, has a built-in default | `resolve` → `undefined`; key is `github.defaultBranch` | Returns `'main'`; no prompt, no write |
| RP-03 | Value unresolvable, no default, headless | `resolve` → `undefined`; key is `github.defaultOrg`; `isHeadless: true` | Throws, message includes `am app-config set github.defaultOrg` |
| RP-04 | Value unresolvable, no default, interactive, text prompt | `resolve` → `undefined`; `text()` returns `'my-org'` | `configService.setSetting` called with `('github.defaultOrg', 'my-org', persistSection)`; returns `'my-org'` |
| RP-05 | User cancels the prompt | `text()`/`select()` resolves to the cancel symbol; `isCancel` returns `true` | Throws a cancellation-specific error; `setSetting` **not** called |
| RP-06 | Provider-select prompt, mixed availability | `checkAvailability()` returns 3 providers, 1 available | `select()` called with all 3 as options, labels reflecting availability per §5.4's format |
| RP-07 | `author.name`, git identity found | `getLocalIdentity` returns `{ name: 'Steve Lewis' }` | Returned directly; `text()` never called |
| RP-08 | `author.name`, git identity not found | `getLocalIdentity` returns `{}` | Falls through to the normal text-prompt path |

### 3. Test Data Requirements

Reuses the `LLMProviderStatus[]` fixture shape already established in the `llmService` fallback-chain spec's test data — no new fixture format needed for RP-06.

---

## Final Architectural Notes

- §5.5 surfaced a genuinely missing piece of `githubService` functionality (`getLocalIdentity`) that none of the prior specs anticipated — worth adding as a small addendum to the `githubService` spec rather than inventing it silently inside this file, since it's a `githubService`-shaped capability (wraps `simple-git`), not something that belongs in a UI-layer helper.
- This is the last of the four Phase 2 components. Per the roadmap, Phase 3 (`app-config` command) can now be specified in full, since every service capability it depends on (`configService`'s extensions, `llmService`'s `checkAvailability`, and this helper) is now specified in build-ready detail.
