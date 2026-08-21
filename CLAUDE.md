# app-manager — Project Notes for Claude

## What this is
A Node/TypeScript CLI tool for managing a Nuxt 4 monorepo (root app + `layers/`
sub-packages). It automates layer scaffolding, git operations across many repos,
file-header/naming validation, and LLM-assisted docs/commit-message generation.

## Commands
- Build: `pnpm build` (runs `tsc`) — always run this after any change and treat
  a non-zero exit as the task not being done yet.
- Test (single file): `pnpm vitest run tests/unit/services/<file>.test.ts`
  — always scope to the file being worked on for now (see Testing
  conventions below for why).
- Package manager: pnpm. Don't suggest npm/yarn equivalents.

## Working style
- **Always run the build (and relevant tests) after making a change, before
  saying a task is complete.** Don't assume a fix compiles — verify it.
- Before creating or editing any file, check its *actual* current location and
  content first (`ls`/read the file) rather than assuming a path from memory
  or from a doc — this codebase has been through a folder restructure and
  several docs/specs are stale relative to the real tree. Trust the filesystem
  over prior descriptions, including this file if it ever goes stale.
- Relative import depth matters a lot here — verify folder depth for any new
  or moved file rather than copying an import path from a sibling file,
  since sibling files have been wrong in exactly this way before.
- Don't trust a code read alone to confirm something is fixed — run the
  relevant test and confirm it actually passes before reporting a task done.

## File header convention
Every source file starts with this block (see any existing file for reference):
```
/**
 * ================================================================================
 *
 * @project:    app-manager
 * @file:       ~/path/from/repo/root.ts
 * @version:    x.y.z
 * @createDate: YYYY Mon DD
 * @createTime: HH:MM
 * @author:     Steve R Lewis
 *
 * ================================================================================
 *
 * @description:
 * ...
 *
 * ================================================================================
 *
 * @notes: Revision History
 *
 * Vx.y.z, YYYYMMDD
 * ...
 *
 * ================================================================================
 */
```
Keep this format on any new file, and add a new revision-history entry
(don't overwrite old ones) whenever an existing file is meaningfully changed.

## Development order (current phase)
We are working through the codebase bottom-up by dependency, service by
service, fully test-driven (TDD: write a failing test first, then implement),
before moving on to the next component category:

1. **Foundation services** (no/minimal internal deps): `loggerService` →
   `configService` → `processService` → `fileService`
2. **Second-tier services**: `llmService`, `githubService`, scanners,
   `codeService`, templates
3. **Orchestrators** (`strategies/`, `orchestrators/`)
4. **Commands / navigation / app layer** — last, once everything below it is
   fully built and tested.

Do not jump ahead to commands/navigation work until the current layer is
signed off as complete and tested.

## Known outstanding items (don't silently "fix" without flagging)
- `loggerService`: `_cleanupOldLogs()` still has no test coverage — it's a
  destructive operation (`fsp.unlink` on files older than 14 days), so lock
  it down with tests before trusting it further.
- `loggerService`: `box()` never writes to the log file, unlike every other
  log method — this needs an explicit decision (should it log to file or
  not?), then a test asserting whichever way is chosen, so it can't
  silently drift.
  (Resolved and tested as of commit 9cdceb8: secret redaction now covers
  `...args`, not just `message`; `init()` now guards against duplicate
  `exit` listener registration via `_exitListenerRegistered`.)
- `app/scanners/javascript/javascriptScanner.ts` and
  `app/scanners/typescript/typescriptScanner.ts` are currently duplicate
  files (both export a class of the same name), as are
  `app/strategies/javascript/javascriptStrategy.ts` and
  `app/strategies/typescript/typescriptStrategy.ts`. This is a known,
  unresolved question — flag before deleting either side rather than
  assuming which one is canonical.
- `ICodeStrategy` (in `app/types/services/codeServiceTypes.ts`) was already
  trimmed to drop `scan`/`patch`/`generate`, which no concrete strategy
  implements. Don't re-add them without a concrete reason — they were
  removed because they were dead/unimplemented, not by accident.
- There's also a legacy PowerShell toolset under `utilities/` — unclear
  whether it's still active or being phased out. Ask before touching it.

## Testing conventions
- Vitest, with `vi.mock` used to isolate services from `fs`, `simple-git`,
  `fetch`, and `@clack/prompts`.
- Follow existing test file structure/naming under `tests/unit/` when adding
  new suites.
- **The full test suite currently has pre-existing failures unrelated to
  whatever service is under review.** Until the full suite is fixed as its
  own dedicated task, scope test runs to the specific file being worked on,
  e.g. `pnpm vitest run tests/unit/services/loggerService.test.ts`, rather
  than running the whole suite. Don't report unrelated failures as new
  problems introduced by the current change — check whether they pre-date it.
