# Technical Specification Document

**Component:** `ProcessService`
**File:** `~/app/services/processService.ts`
**Related Types:** `~/app/types/services/processServiceTypes.ts`
**Project:** `app-manager`
**Language:** TypeScript (Node.js runtime)

*Standalone spec created retroactively, matching the treatment already given to `ConfigService`, `LLMService`, `GithubService`, and `FileService`. Documents the service's two pre-existing methods, confirmed directly against the real source, plus two additions: `detectPackageManager` (first identified while consolidating the duplicated lockfile-detection logic across `app.run`, `nuxt.manageEnv`, and `app.setup` — Phase 6) and `spawnChecked` (first identified while specifying `docs.run`/`quality.run` — Phase 8).*

---

## Part 1: Operational & Design Specification

### 1. Component Overview

#### 1.1 Purpose

Wraps `node:child_process` behind a small, Promise-based, standardized-result API, so no command in this codebase calls `exec`/`spawn` directly. Confirmed as a genuinely-enforced convention: today's `app.run` (pre-Phase-6) is the one place that still called `execSync` directly, and that direct call is exactly what Phase 6 replaced with `processService.spawn()` — this service's whole reason for existing is to be the one place process execution happens.

#### 1.2 Role in System

**Architectural Role:** Infrastructure / Process Execution Layer.

**System Context:** Every lifecycle action in `app.run` (dev/build/preview/postinstall/install), `nuxt.manageEnv`'s reinstall step, and `app.setup`'s install step (all Phase 6) go through this service's `spawn()`. `docs.run`/`quality.run` (Phase 8, not yet built) are the two remaining commands whose legacy specs each independently hand-rolled an equivalent of both this service's execution wrapper and its new package-manager detection — the exact duplication this service's `detectPackageManager()` (§5.3) exists to eliminate once they're built.

### 2. Architecture & Patterns

#### 2.1 Design Patterns

| Pattern | Usage |
|---|---|
| **Facade** | Hides `child_process`'s callback-based `exec`/`spawn` APIs behind two `async`/`await`-friendly methods with a single, standardized `ProcessResult` shape. |
| **Singleton** | One `processService` instance, consistent with every other service. |
| **Strategy (implicit, `execute` vs. `spawn`)** | Two methods for two different execution needs — captured output (`execute`) vs. live/inherited terminal I/O (`spawn`) — rather than one method with a mode flag, so the choice is visible at the call site rather than buried in an option. |

#### 2.2 State Management

**Statefulness:** Stateless — no instance state, identical posture to `FileService` and every other service in this codebase.

#### 2.3 Complexity Assessment

**Rating:** Low. Both existing methods are short, linear Promise wrappers around a single `child_process` call. The one piece of real subtlety, worth calling attention to because it's easy to miss on a casual read, is `spawn()`'s signal-vs-exit-code handling (§5.2) — a process killed by a signal is deliberately **not** collapsed into a misleading exit code of `0`.

### 3. Dependency Graph

#### 3.1 Internal Dependencies

| Dependency | Purpose |
|---|---|
| `./loggerService.js` (`logger`) | Debug-level logging of the command being run, suppressible per-call via `options.silent`. |

#### 3.2 External Dependencies

| Library | Usage |
|---|---|
| `node:child_process` (`exec`, `spawn`) | The actual process execution — `execute()` uses `exec` (shell-based, captures output as strings); `spawn()` uses `spawn` (optionally shell-based, `stdio: 'inherit'` by default). |
| `node:fs` (new, synchronous — see §5.3) | Not currently imported by this file. `detectPackageManager()` requires adding a plain, synchronous `import fs from 'node:fs';` (or `{ existsSync }`), since this new method is deliberately synchronous while every existing method in this file is `async` — the one new external dependency this spec introduces. |

#### 3.3 Coupling Analysis

**Coupling Level:** Low — depends only on `logger` and Node's own built-ins, no coupling to any other service in this codebase.

### 4. Data Types & Interfaces

#### 4.1 `IProcessService` (Existing, Extended)

```ts
export interface IProcessService {
	execute(command: string, options?: ProcessExecuteOptions): Promise<ProcessResult>;
	spawn(command: string, args: string[], options?: ProcessExecuteOptions): Promise<ProcessResult>;
	// New — added by this spec, §5.3
	detectPackageManager(cwd: string): ProcessPackageManager;
	// New — added by Phase 8's addendum, §5.4
	spawnChecked(command: string, args: string[], options?: ProcessExecuteOptions): Promise<ProcessResult>;
}
```

**Reuses the existing `ProcessPackageManager` type** (`'npm' | 'pnpm' | 'yarn' | 'bun'`, already defined in `processServiceTypes.ts` before this spec was written) as `detectPackageManager()`'s return type — the type file's own description already stated this service's domain "includes defining supported package managers," meaning this addition completes an intention the types file had already declared rather than introducing a new concept. The version of this method first sketched while specifying `nuxt.createLayer`/`app.setup` (Phase 6) used an inline `'bun' | 'pnpm' | 'yarn' | 'npm'` union instead of this named type — corrected here, and that correction should be treated as applying retroactively to every call site in the Phase 6 document, none of which need their own wording changed since none of them spelled out the inline union themselves.

#### 4.2 `ProcessExecuteOptions`/`ProcessResult` — Existing, Unchanged

```ts
export interface ProcessExecuteOptions {
	cwd?: string;
	env?: Record<string, string>;
	silent?: boolean;
	timeout?: number;
	shell?: boolean | string;
}

export interface ProcessResult {
	stdout: string;
	stderr: string;
	exitCode: number;
	signal?: NodeJS.Signals | null;
}
```

### 5. Functional Logic Specification

#### 5.1 `execute(command, options?)` — Existing, Unchanged

Shell-based (`child_process.exec`), captures `stdout`/`stderr` as trimmed strings. **Explicitly refuses `options.shell === false`** — `exec` is inherently shell-based and cannot honor a no-shell guarantee, so this method throws immediately rather than silently ignoring the option, per this file's own revision history recording that decision. Any process error maps to a numeric `exitCode` (falling back to `1` if the OS-reported code isn't numeric) and captures `signal` if one terminated the process.

**Not used by anything specified so far in this project** — every current consumer (`app.run`, `nuxt.manageEnv`, `app.setup`) needs live/inherited output (§ Phase 6's §1.4 decision), which is `spawn()`'s job, not `execute()`'s. `execute()` remains available for a future need to programmatically parse captured command output, but has no current caller.

#### 5.2 `spawn(command, args, options?)` — Existing, Unchanged

`child_process.spawn`, `stdio: 'inherit'` — output goes directly to the parent process's terminal, preserving colors, progress bars, and interactivity (this is why every lifecycle action in `app.run` uses this method, not `execute()`). Shell usage defaults to `true` only on Windows (`process.platform === 'win32'`) and `false` elsewhere unless explicitly overridden — a deliberate security-hardening default, per this file's own revision history, rather than blanket shell usage everywhere.

**The one subtlety worth restating explicitly:** on the child process's `close` event, if `code === null` **and** a `signal` is present, this method resolves with `exitCode: 1` (not `0`) — a process killed by `SIGTERM`/`SIGINT`/a timeout is not a successful completion, and collapsing that into a `0` exit code (which an earlier version of this file's own revision history records as a real, fixed bug) would silently misreport a killed process as having succeeded.

#### 5.3 `detectPackageManager(cwd: string): ProcessPackageManager` — New, Addendum

**Origin:** surfaced while consolidating package-manager detection for `app.run`'s lifecycle extension (`spec-nuxt-domain-app-setup.md` §1.3) — the same seven-line lockfile-priority check existed independently in the pre-Phase-6 `app.run` implementation and in the (not-yet-built) legacy specs for `docs.run`/`quality.run`/`nuxt.manageEnv`. Consolidated once here, into the service that already owns "how do I run commands."

```ts
public detectPackageManager(cwd: string): ProcessPackageManager {
	if (fs.existsSync(path.join(cwd, 'bun.lockb'))) return 'bun';
	if (fs.existsSync(path.join(cwd, 'pnpm-lock.yaml'))) return 'pnpm';
	if (fs.existsSync(path.join(cwd, 'yarn.lock'))) return 'yarn';
	return 'npm';
}
```

**Deliberately synchronous — the one considered exception to "every method in this file is `async`."** Every other method here wraps a genuinely asynchronous child-process operation; this one is four `fs.existsSync` calls, fast enough that wrapping it in a `Promise` would add ceremony without benefit. Every call site across every phase document that uses this method (`app.run`, `nuxt.manageEnv`, `app.setup`) calls it without `await`, consistent with this being a real, intentional design choice rather than an oversight — worth stating plainly here since a reviewer skimming "every method returns a Promise" as a house rule could otherwise flag this as a bug.

**Side Effects:** None — read-only filesystem checks.

**Error Handling:** None needed — `fs.existsSync` never throws (it returns `false` for any path it can't stat, including permission-denied cases), so there is no failure mode for this method to handle.

#### 5.4 `spawnChecked(command, args, options?): Promise<ProcessResult>` — New, Addendum

**Origin:** surfaced while specifying `docs.run`/`quality.run` (`spec-docs-quality-commands.md` §1.1–1.2) — both commands' legacy specs describe a `runScript()` helper that **rejects on a non-zero exit code**, but `spawn()` (§5.2) always resolves on the child's `close` event regardless of exit code, only rejecting on a genuine spawn failure. Rather than have both commands independently check `result.exitCode` after every call, this thin wrapper restores the reject-on-failure convenience as a single, reusable method.

```ts
public async spawnChecked(command: string, args: string[], options: ProcessExecuteOptions = {}): Promise<ProcessResult> {
	const result = await this.spawn(command, args, options);
	if (result.exitCode !== 0) {
		throw new Error(`Command failed with exit code ${result.exitCode}: ${command} ${args.join(' ')}`);
	}
	return result;
}
```

**Deliberately does not replace `spawn()` as the primary method** — `app.run`'s lifecycle actions (Phase 6) call bare `spawn()` directly and handle their own success/failure reporting per-action (§ Phase 6), while `docs.run`/`quality.run` want the simpler "just throw if it didn't work" behavior. Both are legitimate; `spawnChecked()` is additive, not a deprecation of `spawn()`.

**Side Effects:** Identical to `spawn()`, since it delegates entirely to it.

**Error Handling:** Throws on non-zero exit (new) or propagates a genuine spawn error unchanged (existing `spawn()` behavior) — the caller cannot distinguish which of the two occurred from the exception alone, which is acceptable for `docs.run`/`quality.run`'s use case (both log the same generic "command failed" message regardless of which failure mode occurred).

---

## Part 2: Appendix — Testing Reference

### 1. Mocking Strategy

| Dependency | Mock Target | Behavior |
|---|---|---|
| `node:child_process` | `exec`, `spawn` | Standard callback-invoking mocks for `execute()`/`spawn()` — this file's own detailed revision history (recording specific prior fixes to `execute()`'s `shell: false` handling and `spawn()`'s signal handling) implies an existing, established test suite already covers both methods' current behavior; not re-specified here. |
| `node:fs` (new) | `existsSync` | Configurable per test to simulate the presence of each of the four recognized lockfiles, and the absence of all four (npm fallback). |

### 2. Test Scenarios (New Method Only)

| ID | Scenario | Expected Outcome |
|---|---|---|
| PM-01 | `bun.lockb` present | Returns `'bun'` |
| PM-02 | `pnpm-lock.yaml` present (no `bun.lockb`) | Returns `'pnpm'` |
| PM-03 | `yarn.lock` present (neither of the above) | Returns `'yarn'` |
| PM-04 | None of the three present | Returns `'npm'` — the fallback |
| PM-05 | Multiple lockfiles present simultaneously (e.g. both `bun.lockb` and `yarn.lock` — an inconsistent but real-world-possible state) | Returns `'bun'` — confirms the priority order (bun → pnpm → yarn → npm) is checked in that exact sequence, not by some other precedence |
| SC-01 | `spawnChecked()`, underlying `spawn()` resolves with `exitCode: 0` | Resolves normally, returning the same `ProcessResult` |
| SC-02 | `spawnChecked()`, underlying `spawn()` resolves with a non-zero `exitCode` | Throws, message includes the exit code and the command/args that were run |
| SC-03 | `spawnChecked()`, underlying `spawn()` itself rejects (spawn error) | Propagates the original rejection unchanged — not re-wrapped into the exit-code error message |

### 3. Test Data Requirements

No fixture files needed beyond `fs.existsSync`'s mocked return value per path — this method's entire behavior is four boolean checks, requiring no realistic file *contents*, only realistic file *presence*.

---

## Final Architectural Notes

- This is the smallest of the five service specs by original method count, which is itself worth noting: `ProcessService`'s two pre-existing methods were already narrowly scoped and correctly separated (captured vs. inherited output) before this exercise began, and both additions (`detectPackageManager`, `spawnChecked`) slot in cleanly without touching either of them.
- §4.1's `ProcessPackageManager` reuse is a small, satisfying find — the types file had already declared an intention ("defining supported package managers") that no method had yet fulfilled, and this addition is the first thing in this codebase to actually use that type for its originally-stated purpose.
- §5.4's `spawnChecked()` closes the last gap found across the entire nine-phase plan — a mismatch between what `docs.run`/`quality.run`'s legacy specs expected (reject-on-failure) and what the base `spawn()` primitive actually provides (always resolves, reports exit code in the result). With this addendum in place, **every phase of the original roadmap has now been specified.**
