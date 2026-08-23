# Technical Specification Document

**Component:** `docs.run` and `quality.run` — Two Commands
**Files:** `~/app/commands/docs/runDocs.ts`, `~/app/commands/quality/runQuality.ts`
**Project:** `app-manager`
**Language:** TypeScript (Node.js runtime)

*Phase 8 (Implementation Roadmap §7) — the last undone phase of the original nine. Confirmed both files are still genuinely empty (25 lines, no exported content) before writing this, unlike the Phase 5 templates that turned out to be misleadingly labeled.*

---

## 1. Shared Context

### 1.1 A Real Semantic Gap: `processService.spawn()` vs. the Legacy `runScript()` Helper

Both commands' legacy specs describe a `runScript(cmd, args, cwd): Promise<void>` helper that **rejects** on a non-zero exit code (`"Resolves if code is 0; Rejects with Error if code is non-zero"`). Checked `processService.spawn()`'s actual implementation directly (`spec-processService.md` §5.2): it **always resolves** on the child process's `close` event — a non-zero `exitCode` is reported in the resolved `ProcessResult`, not surfaced as a rejection. Only a genuine spawn failure (`child.on('error')`, e.g. the binary doesn't exist) rejects.

This isn't a bug in `processService.spawn()` — resolving with the result regardless of exit code is the more generally useful behavior for a shared primitive (some callers legitimately want to inspect a non-zero exit without an exception unwinding their control flow). But `docs.run` and `quality.run` both specifically want the old `runScript()` reject-on-failure convenience, and building that check independently into both commands would just be the same duplication problem `detectPackageManager()` was built to eliminate in Phase 6, recurring at the exit-code-checking layer instead of the package-manager-detection layer.

### 1.2 New — `processService.spawnChecked()`, Addendum

**Origin:** surfaced while specifying this phase — the same "needs a genuine capability the base method doesn't provide" pattern as every other addendum in this project (`getLocalIdentity`, `getTrackedPaths`, `addRemote`, `getFileDiff`, `deleteDir`, `listFilesRecursive`). Added to `processService`, not to either command file, so any future command with the same "run this and fail loudly if it didn't work" need doesn't reinvent it a third time.

```ts
// Addendum to processService.ts — specify in spec-processService.md as §5.4
public async spawnChecked(command: string, args: string[], options: ProcessExecuteOptions = {}): Promise<ProcessResult> {
	const result = await this.spawn(command, args, options);
	if (result.exitCode !== 0) {
		throw new Error(`Command failed with exit code ${result.exitCode}: ${command} ${args.join(' ')}`);
	}
	return result;
}
```

Both commands in this document call `spawnChecked()`, never bare `spawn()` — restoring the legacy `runScript()` behavior as a one-line wrapper rather than each command independently checking `result.exitCode`.

### 1.3 Confirmed: No New Capability Needed for VitePress/Vitest Detection

Both commands' "does this project have X" checks (`vitepress` in `docs.run`, `vitest`/`lint`/`typecheck` scripts in `quality.run`) read `package.json` via `fileService.read()` — already established, no new method needed. Package-manager detection for both uses `processService.detectPackageManager()` (Phase 6) — also already established.

---

## 2. `docs.run` — Run Documentation Tooling

### 2.1 Functional Logic

1. `const toolPM = processService.detectPackageManager(toolRoot);`
2. Read `targetRoot/package.json` via `fileService.read()`; check `dependencies`/`devDependencies` for a `vitepress` key. If present, `const projectPM = processService.detectPackageManager(targetRoot);` and `hasProjectDocs = true`.
3. Build the menu: "Start App Manager Docs" (tool) always present; if `hasProjectDocs`, also "Start/Build/Preview Project Docs"; "Go Back" always last.
4. On selection, construct `[command, args]`:
   - **npm:** `['npx', ['vitepress', verb]]`
   - **pnpm/yarn/bun:** `[pm, ['vitepress', verb]]` — these package managers can invoke a locally-installed binary directly without an `npx`-equivalent prefix.
5. `await processService.spawnChecked(command, args, { cwd: isToolDocs ? toolRoot : targetRoot });` (§1.2) — catches both a failed spawn (bad binary) and a non-zero exit (VitePress itself failed) as the same caught error, logged as `Docs command failed`, matching the legacy spec's message.

### 2.2 Test Scenarios

| ID | Scenario | Expected Outcome |
|---|---|---|
| DR-01 | Target has no `vitepress` dependency | Menu shows only "Start App Manager Docs" and "Go Back" |
| DR-02 | Target has `vitepress`, PM is npm | Command constructed as `npx vitepress dev` (or `build`/`preview`) |
| DR-03 | Target has `vitepress`, PM is pnpm | Command constructed as `pnpm vitepress dev`, no `npx`/`exec` prefix |
| DR-04 | VitePress itself exits non-zero | Caught via `spawnChecked()`'s thrown error, logged as a failure — **not** silently reported as success, which is exactly the gap that would exist if this command had been built against bare `spawn()` instead |
| DR-05 | Binary genuinely not found (spawn error) | Also caught by the same `spawnChecked()` call site — one error-handling path covers both failure modes |

---

## 3. `quality.run` — Run Quality Checks

### 3.1 Functional Logic

1. Prompt for scope: `target` or `tool`. Exit on cancel.
2. `const activeRoot = scope === 'target' ? targetRoot : toolRoot;` `const pm = processService.detectPackageManager(activeRoot);`
3. Read `activeRoot/package.json` via `fileService.read()`. Check `scripts` for `lint`/`test`/`typecheck` keys; check dependencies for `vitest`. Malformed or missing `package.json` is treated as "nothing found" (no scripts, no vitest) rather than an error — matching the legacy spec's forgiving posture here.
4. Build the menu dynamically from whatever was found; add `vitest:ui` only if `vitest` is present. If nothing at all was found, warn and exit — never show an empty menu.
5. Execute the chosen action:
   - `lint`/`typecheck`/`test` (standard `package.json` scripts): `processService.spawnChecked(pm, ['run', scriptName], { cwd: activeRoot });`
   - `vitest`/`vitest:ui`: same npm-vs-other-PM distinction as `docs.run` — `['npx', ['vitest', ...(ui ? ['--ui'] : [])]]` for npm, `[pm, ['vitest', ...]]` otherwise.

### 3.2 Test Scenarios

| ID | Scenario | Expected Outcome |
|---|---|---|
| QR-01 | `package.json` has `lint`/`test` scripts, no `vitest` dependency | Menu offers Lint/Test but not `vitest:ui` |
| QR-02 | `vitest` present in devDependencies | `vitest:ui` option appears |
| QR-03 | Neither scripts nor `vitest` present | Warned and exited, no menu shown |
| QR-04 | Malformed `package.json` | Treated as "nothing found," not as an error — same warn-and-exit outcome as QR-03, not a crash |
| QR-05 | Chosen script exits non-zero | Caught via `spawnChecked()`, logged as a failure |

---

## Final Architectural Notes

- §1.2's `spawnChecked()` is a small addition, but it closes a real gap between what these two commands' legacy specs expected and what the actual `processService.spawn()` provides — without it, both commands would have silently reported VitePress/vitest/lint failures as successes, since a non-zero exit code alone doesn't reject `spawn()`'s promise.
- This document, plus this addendum to `spec-processService.md`, **completes Phase 8** — the last undone phase of the original nine-phase sequence. **Phase 9** (JSX/TSX scanner/strategy/orchestrator support) remains exactly where it was left: deliberately deferred, architectural home reserved, not scheduled until the now-complete Phases 1–8 are implemented and stable.
