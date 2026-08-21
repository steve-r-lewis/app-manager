# app-manager — Project Notes for Claude

## What this is
A Node/TypeScript CLI tool for managing a Nuxt 4 monorepo (root app + `layers/`
sub-packages). It automates layer scaffolding, git operations across many repos,
file-header/naming validation, and LLM-assisted docs/commit-message generation.

## Commands
- Build: `pnpm build` (runs `tsc`) — always run this after any change and treat
  a non-zero exit as the task not being done yet.
- Test: `pnpm vitest` (Vitest) — verify the exact script name against
  `package.json` if this doesn't work; confirm and update this file once known.
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
- `loggerService`: secret redaction currently only scrubs the `message`
  argument on console output, not `...args` — a real gap, not yet fixed.
  Also: `init()` registers a `process.on('exit', ...)` listener with no
  guard against duplicate registration on repeated calls.
  `_cleanupOldLogs()` has no test coverage yet.
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
