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
- If tests reveal existing code already behaves correctly, don't change it
  just to feel productive — add the missing coverage and say so.
- For any change bigger than a straightforward gap-fill (new methods, new
  contracts, anything touching how a service is used elsewhere), do a
  read-only investigation pass first — report findings and open design
  questions — before writing any implementation. Confirm the design before
  implementing.
- If implementing a fix reveals it changes a public interface/contract
  (not just an internal detail), stop and confirm before proceeding, even
  mid-task — don't silently widen scope. Check whether any current callers
  exist before assuming a contract change is safe.
- When a review finds several issues, not every one needs a fix — some are
  fine to leave as documented, deliberate non-issues (e.g. cosmetic/dead
  code with no real impact). Don't "fix" something just because it's on
  the list.
- When an interactive selection/checklist prompt is used to scope a task,
  double check the summary against what was actually agreed before
  accepting it as done — selections don't always land as intended, and
  scope can creep in without anyone deciding it should.

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

1. **Foundation services** (no/minimal internal deps):
   - ✅ `loggerService` — DONE. Full test coverage (20/20 passing), including
     secret redaction on args, duplicate exit-listener guard, box() now logs
     to file consistently with other methods, and _cleanupOldLogs() coverage.
   - ✅ `configService` — DONE for this pass (13/13 passing). AppConfigSchema
     now actually validates in getDefaults() (constructor + reset()); setFlag
     validates key + value via AppConfigFlagsSchema instead of writing
     blindly; duplicate/orphaned header block cleaned up.
     **Deliberately deferred, not forgotten** — see "Known outstanding
     items" below for the cwd-goes-live decision and why it's deferred.
   - ✅ `processService` — DONE (18/18 passing). spawn()'s signal-killed
     processes no longer report as success (was silently resolving code
     null as 0); ProcessResult gained an optional `signal` field, populated
     by both execute() and spawn(); spawn()'s return type changed from
     Promise<number> to Promise<ProcessResult> (confirmed safe — no
     existing callers); execute() now rejects on explicit `shell: false`
     instead of silently ignoring it; coverage gaps filled for cwd/env/
     timeout/silent option paths on both methods.
   - ✅ `fileService` — DONE (28/28 passing). write() no longer corrupts
     non-.json object content (was keying JSON.stringify off file
     extension instead of typeof content); atomicWrite()'s temp filename
     hardened with pid + random suffix; delete() now rethrows any
     non-ENOENT error consistently with readText(); update()'s fallback
     now logs via this.logger.warn instead of calling consola directly;
     real .jsonc support added via a new isJsonFile() helper, wired into
     read() and update() (update() preserves comments via jsonc-parser's
     modify()/applyEdits()); allowTrailingComma: true also enabled on
     parse() (folded in during the .jsonc task rather than as its own
     separate decision — accepted as low-risk, see note below). Full
     coverage added for every remaining untested path across all six
     methods (read/readText/write/update/exists/delete) — confirmed every
     new test passed immediately against existing behavior with zero
     implementation changes needed.

**Foundation tier complete** (loggerService, configService, processService,
fileService) — all fully test-driven, reviewed, and signed off.

2. **Second-tier services** (current phase):
   - 👉 **`llmService` — up next.**
   - `githubService`
   - scanners
   - `codeService`
   - templates
3. **Orchestrators** (`strategies/`, `orchestrators/`)
4. **Commands / navigation / app layer** — last, once everything below it is
   fully built and tested.

Do not jump ahead to commands/navigation work until the current layer is
signed off as complete and tested.

## Known outstanding items (don't silently "fix" without flagging)
- **configService's `cwd` field is currently dead weight — confirmed by
  investigation, not assumed.** It's set once (`process.cwd()` in
  `getDefaults()`) and never read by any production code. The codebase
  already handles the "operating directory" concept a completely different
  way: `app/index.ts` captures `process.cwd()` as `targetRoot` at bootstrap
  and threads it as an explicit parameter through `runHeadless`/
  `runInteractive` down into command handlers (`runApp.ts`, `processService`,
  `githubService` all take an explicit `cwd`/`targetRoot` param from their
  caller instead). Only `toolRoot` (where app-manager itself is installed)
  currently flows through configService.
  **Decision: do NOT build `setCwd()` speculatively.** Wait until the
  commands/navigation phase actually needs it, so the design (path
  validation: must-exist vs. well-formed-absolute-path-only; relative-path
  resolution) is driven by a real caller instead of guessed. When that
  phase starts, revisit this note first — the investigation is already
  done, don't redo it.
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
