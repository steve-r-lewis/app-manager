# Technical Specification Document

**Component:** `LLMService` (Fallback Chain Extension)
**File:** `~/app/services/llmService.ts`
**Related Types:** `~/app/types/services/llmServiceTypes.ts`
**Project:** `app-manager`
**Language:** TypeScript (Node.js runtime)

*Second of the Phase 2 component specifications (Implementation Roadmap §7).*

---

## Part 1: Operational & Design Specification

### 1. Component Overview

#### 1.1 Purpose

Extends the existing `LLMService` with an explicit availability check and a multi-step fallback chain for selecting an active provider, replacing the current single-attempt, env-var-only `initializeDefault()` behavior. Implements the resolution described in `app-manager-command-specs.md` §10.8.

#### 1.2 Role in System

Consumed by every AI-touching command (`git.commit`, `nuxt.createLayer`, `nuxt.extractDocs`, `utils.autoDoc`, `utils.autoVersion`, `utils.validateHeaders`) to check `isAvailable()` **before** attempting generation, replacing each command's current "try AI, catch failure, fall back" pattern with a proactive check plus the same safety-net catch as before.

### 2. Architecture & Patterns

#### 2.1 Design Patterns

| Pattern | Usage |
|---|---|
| **Chain of Responsibility (new)** | `resolveActiveProvider()` tries default → fallback → any-available → none, in order, stopping at the first success. |
| **Singleton (existing, unchanged)** | One `llmService` instance, as today. |

#### 2.2 State Management

No new persistent state beyond the existing `activeConfig: LLMProviderConfig | null`. The fallback chain's job is to decide what `activeConfig` *should* be and call the existing `configure()` to set it — `chat()`'s existing `if (!this.activeConfig) throw` guard is untouched.

#### 2.3 Complexity Assessment

**Rating:** Low. The chain itself is a short, linear sequence of checks against already-existing data (`checkAvailability()`, `configService.resolve()`). The one piece of real complexity is a **lifecycle/sequencing concern**, not a logic concern — see §5.3.

### 3. Dependency Graph

#### 3.1 Internal Dependencies (New)

| Dependency | Purpose |
|---|---|
| `./configService.js` (`configService` singleton) | `resolve('llm.defaultProvider')`, `resolve('llm.fallbackProvider')`, `resolve('llm.enabled')` — the new settings-backed source of provider preference, supplementing (not replacing) the existing `API_MODEL_DEFAULT` env var path. |

Everything else (`registryData`, `logger`, existing types) is unchanged from the current file.

#### 3.2 Coupling Analysis

**New coupling:** `LLMService` now depends on `configService` having already run `loadSettings()` before `resolveActiveProvider()` is called meaningfully. This is a real, load-order-sensitive dependency — addressed explicitly in §5.3, not left implicit.

### 4. Data Types & Interfaces

#### 4.1 Public API & Return Types (New Methods)

| Method | Signature | Notes |
|---|---|---|
| `isAvailable` | `(): boolean` | New. Pure, synchronous — reads `configService.resolve('llm.enabled')` and `checkAvailability()` (both already synchronous), no I/O of its own. |
| `resolveActiveProvider` | `(): LLMProviderConfig \| null` | New. Synchronous. Has the side effect of calling `this.configure(id)` on success (see §5.2), matching `configure()`'s existing synchronous, side-effecting nature. |

No new types required — both methods operate entirely on the existing `LLMProviderConfig`/`LLMProviderStatus` shapes already defined in `llmServiceTypes.ts`.

### 5. Functional Logic Specification

#### 5.1 `isAvailable(): boolean`

**Logic Flow:**
1. Read `configService.resolve('llm.enabled')`. If it resolves to `false` explicitly, return `false` immediately — this is the one setting with a real, non-`null` schema default (`true`), so `resolve()` returning `undefined` here should be treated as "on" (no explicit opt-out configured), not as "off." Concretely: `if (configService.resolve('llm.enabled') === false) return false;`.
2. Otherwise, call the existing `checkAvailability()` and return `true` if **any** entry in the returned array has `available: true`, `false` if the array is empty of available entries.

**Side Effects:** None.

**Error Handling:** None required — both underlying calls are already safe, synchronous, non-throwing (`checkAvailability()` only reads `process.env`, per the existing implementation).

#### 5.2 `resolveActiveProvider(): LLMProviderConfig | null`

**Logic Flow:**
1. If `isAvailable()` (§5.1) is `false`, return `null` immediately — no point running the chain if AI is switched off entirely.
2. **Step 1 — configured default:** read `configService.resolve('llm.defaultProvider')`. If defined, find that record in `this.registry.records`. If found **and** its `apiKeyEnv` is actually set in `process.env` (i.e., it would pass `checkAvailability()`), call `this.configure(id)` and return `this.activeConfig`.
3. **Step 2 — configured fallback:** same check against `configService.resolve('llm.fallbackProvider')`.
4. **Step 3 — any available:** call `checkAvailability()`, take the first entry with `available: true`, `configure()` it, return it.
5. **Step 4 — none:** return `null`.

**Explicit note on backward compatibility:** the existing `initializeDefault()` (constructor-time, `API_MODEL_DEFAULT` env var) is **left in place, unchanged** — it still runs at construction time and may already have set `activeConfig` before `resolveActiveProvider()` is ever called. `resolveActiveProvider()` does not check "is something already configured" before running its own chain — it always runs the full chain and **overwrites** `activeConfig` with whatever it finds (including `null`, if nothing is available, which would clear a previously-set `activeConfig`). This is a deliberate design choice: `resolveActiveProvider()`'s settings-backed result is meant to take precedence over the older, purely-env-var-driven default, since the whole point of the settings layer is that it's the officially-configured preference, not a legacy fallback. See §5.3 for exactly when this method must be called for that precedence to actually hold in practice.

**Side Effects:** Calls `this.configure()`, mutating `this.activeConfig`, on success.

**Error Handling:** `this.configure()` throws if given an unrecognized provider id — this can't actually happen here, since step 2/3 only ever call `configure()` with an id already confirmed to exist in `this.registry.records` by the lookup in the same step. No try/catch needed around those calls.

#### 5.3 Lifecycle / Call-Order Requirement (Not a Code Change — a Sequencing Fact to Get Right)

**This is the one thing in this spec that isn't a logic problem but a real bug risk if missed.** `llmService` is a module-level singleton (`export const llmService = new LLMService();`), constructed — and therefore `initializeDefault()` run — at **import time**, before `main()` in `index.ts` ever runs. `configService` is likewise constructed at import time, but its settings are not populated until `configService.loadSettings(toolRoot, targetRoot)` — an **async** method — is explicitly awaited, later, inside `main()`.

This means: if anything tried to call `resolveActiveProvider()` from inside `LLMService`'s own constructor (mirroring how `initializeDefault()` already runs there), it would run *before* `configService.loadSettings()` has completed, and every `configService.resolve()` call inside it would return `undefined` — silently making the entire settings-based chain a no-op, every single run, in a way that would be very easy to not notice (the older `API_MODEL_DEFAULT` env var path would keep working, masking the fact that the new chain never actually did anything).

**Required fix — not inside this file, but in `index.ts`'s `main()`:** `resolveActiveProvider()` must be called explicitly, once, **after** `await configService.loadSettings(toolRoot, targetRoot)` completes and **before** command dispatch (`runHeadless`/`runInteractive`). This is a small addition to `main()`'s existing sequence, not a change to `LLMService` itself — flagged here because the ordering requirement originates from this component's design and would otherwise be an easy detail to lose between this spec and `index.ts`'s own (separate) spec.

---

## Part 2: Appendix — Testing Reference

### 1. Mocking Strategy

| Dependency | Mock Target | Behavior |
|---|---|---|
| `configService` | `resolve` | Configurable per test to return a specific provider id, `undefined`, or `false` (for `llm.enabled`). |
| `process.env` | Relevant `apiKeyEnv` values from the registry (e.g. `API_KEY_CLAUDE`) | Set/unset per test to control `checkAvailability()`'s real output — no need to mock `checkAvailability()` itself, since it's a pure function of `process.env` and the static registry, both easy to control directly in a test. |

### 2. Test Scenarios

| ID | Scenario | Setup | Expected Outcome |
|---|---|---|---|
| RA-01 | Default provider configured and available | `resolve('llm.defaultProvider')` → `'claude'`; `API_KEY_CLAUDE` set | Returns the Claude config; `activeConfig` set to it |
| RA-02 | Default configured but its key is missing | `resolve('llm.defaultProvider')` → `'claude'`; `API_KEY_CLAUDE` unset; `resolve('llm.fallbackProvider')` → `'gemini'`; `API_KEY_GEMINI` set | Returns Gemini config — proves step 1 correctly rejects an unusable default rather than returning it anyway |
| RA-03 | Neither default nor fallback configured, but something else is available | `resolve('llm.defaultProvider'/'llm.fallbackProvider')` both `undefined`; `API_KEY_OLLAMA` set, nothing else | Returns the Ollama config — proves step 3 ("any available") is reached correctly |
| RA-04 | Nothing available at all | No `apiKeyEnv` set for any registry record | Returns `null` |
| RA-05 | `llm.enabled` explicitly `false` | `resolve('llm.enabled')` → `false`; a valid default is otherwise configured and available | Returns `null` without even checking the default — proves the kill switch short-circuits before step 1 |
| RA-06 | `llm.enabled` unset (not explicitly set either way) | `resolve('llm.enabled')` → `undefined`; a valid default is configured and available | Returns the resolved provider normally — proves `undefined` is treated as "on," per §5.1 |
| IA-01 | `isAvailable()` alone, nothing configured anywhere, nothing available | All `resolve()` calls `undefined`, no `apiKeyEnv` set | Returns `false` |
| IA-02 | `isAvailable()` alone, no default configured but one provider happens to have its key set | `resolve('llm.defaultProvider')` → `undefined`; `API_KEY_GROK` set | Returns `true` — `isAvailable()` only asks "is *anything* usable," not "is the *configured* one usable" |

### 3. Test Data Requirements

Reuses the existing `llmRegistry.json` (post-move to `app-manager/llmRegistry.json`) as real test data rather than a separate fixture, given it's static, versioned data already checked into the repo — no need to construct a parallel mock registry for these scenarios.

---

## Final Architectural Notes

- §5.3's sequencing requirement is the single most important thing in this spec — a correct implementation of `resolveActiveProvider()` that's never actually called at the right time in `main()` is functionally identical to not having built it at all, and would fail silently (falling back to the old env-var behavior) rather than loudly.
- `initializeDefault()` is intentionally left unmodified. Removing it in favor of always relying on `resolveActiveProvider()` alone was considered and rejected for this spec — `initializeDefault()` gives a working default for any code path that might run before `main()`'s settings-loading sequence completes (unlikely today, but not something to foreclose without a specific reason), at zero cost since `resolveActiveProvider()` unconditionally overwrites its result anyway once called.
