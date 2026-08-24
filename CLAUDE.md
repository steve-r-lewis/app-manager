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
   - **`licenseService` — added 2026-08-24, elevated priority, build right after
     `llmService` (ahead of `githubService`/scanners/`codeService`/templates).**
     Full build-ready spec already written:
     `docs/specification/architecture/services/spec-services-licenseService-v01.md`.
     OSI-catalog-driven LICENSE creation/change/delete for both the root project
     and standalone layers — verbatim-only text resolution (curated templates →
     cached OSI text → link-only fallback, never LLM-paraphrased), `package.json`
     sync including the `SEE LICENSE IN LICENSE` fallback for entries with no
     `spdx_id`. Moved ahead of the rest of this tier because the design work is
     already done and de-risked: a real sample response from
     `https://opensource.org/api/license` and a real captured
     `opensource.org/license/mit` HTML page (see To-Do list below) resolved every
     open question the spec had. Nothing about this item is still blocked on
     investigation — it's ready to build test-first like everything else in this
     phase.
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

## Actions outstanding — To-Do list
*Living list, added 2026-08-24 during license-management design work. Update or
check items off as they're resolved rather than deleting them silently, same
spirit as the file-header revision-history convention above — if something
here turns out already fine, say so and remove it, don't just quietly drop it.*

**Bugs to fix (found, not yet fixed):**
- `app/templates/license/mitLicenseTemplate.ts`'s GPLv3 branch double-prefixes
  the copyright line (`authorLine` already starts with `Copyright (C)`, then
  gets `Copyright (C) ` prepended again) — generated GPLv3 LICENSE text reads
  `"Copyright (C) Copyright (C) <year> ..."`. Flagged in
  `spec-templates-license-v01.md` §2 a while ago; never actually fixed in code.
- That same file's header comment still says `@file: ~/app/templates/licenseTemplate.ts`
  — stale from before the folder restructure; doesn't match its real path
  (`app/templates/license/mitLicenseTemplate.ts`).
- `tests/unit/templates/license/licenseTemplate.test.ts` imports
  `../../../app/templates/licenseTemplate.js` with an explicit
  `@ts-ignore - Module does not exist yet` — that path has never existed.
  The test cannot currently be exercising the real implementation correctly.
- No `LICENSE` file exists at the repo root, despite `package.json` declaring
  `"license": "MIT"`.

**Infrastructure gaps blocking more than one planned feature:**
- The tiered settings-persistence layer (`app-config` domain's `settings.json`,
  `app-manager-command-specs-v02.md` §10) doesn't exist — real `configService.ts`
  today is only `{ cwd, gitUser, flags }` in memory, no disk persistence at all.
  Two specced features depend on it: the Settings domain
  (`spec-settings-domain-commands-v01.md`) and `licenseService`'s
  `license.defaultType` (`spec-services-licenseService-v01.md` §1.7).
- `codeService` doesn't exist yet — blocks `nuxt.config`'s Add/Delete actions
  (deliberately deferred, not designed — see
  `spec-settings-domain-commands-v01.md`'s Final Architectural Notes).

**`licenseService` — implementation outstanding (spec complete):**
- Build `licenseService.ts` per `spec-services-licenseService-v01.md`:
  `syncCatalog`, `listLicenses`, `resolveText`, `createLicense`, `changeLicense`,
  `deleteLicense`.
- Build the `config/licenseRegistry.json` cache (mirrors `llmRegistry.json`/
  `repositoryRegistry.json`'s existing pattern).
- HTML extraction (spec §4) is now unblocked — a real `opensource.org/license/mit`
  page was captured 2026-08-24 and confirms two reliably-IDed elements:
  `<div id="separator">` (copyright placeholder, literal `<YEAR>`/
  `<COPYRIGHT HOLDER>` tokens when a copyright line applies at all — absent for
  licenses that shouldn't get one, which resolves §3.1's "how do we know not to
  add a header" question without a hardcoded exceptions list) and
  `<div id="LicenseText">` (verbatim body, `<p>` tags, HTML-entity-encoded).
  Spec §3.1/§4 should be updated from "cannot be finalized" to this confirmed
  structure before implementation starts.
- Still unconfirmed: whether `GET /api/license` paginates the full catalog or
  returns everything in one response (spec §1.1) — check against a real full
  fetch once network access allows it.
- Minor data-shape note: the official API announcement's own worked example
  (`gpl-3-0`) omits `spdx_id` and `approved` entirely, while the live sample
  fetched directly for this design (`curl`, `cddl-1-1`, etc.) has both. Don't
  assume either field is always present — code defensively for both "empty
  string" and "field missing" on `spdx_id`, and treat a missing `approved` as
  unknown rather than assuming `false`.
- **Do not delete the 8 curated hand-authored license templates yet** — asked
  directly, answered 2026-08-24: they're currently the *only* working
  LICENSE-generation path; `licenseService` is still spec-only, no code exists.
  Build the OSI-driven path first, verify it (including a check against the
  current curated output once the double-`Copyright (C)` bug above is fixed),
  and only retire the curated tier once that's proven working — keeping both
  permanently would recreate the "two competing implementations of one
  operation" problem already resolved elsewhere in this codebase (the git
  sync/push/commit consolidations).

**Open design decisions (need your input before implementing):**
- `nuxt.createLayer`'s "extend that layer" meaning — assumed to be (A) bring
  it into a consuming app via `git.addSubmodules`, never explicitly confirmed
  vs. (B) just keep developing it standalone (`app-manager-command-specs-v02.md`
  §5.1).
- Layer-development workflow: developing layers in-place inside the calling
  app vs. always-standalone-then-linked — still being thought through (raised
  during the `licenseService` design conversation, not yet resolved).
- `settings.templates`'s "is a fourth generic template registry wanted" beyond
  license/deployment/AI-doc — open, `spec-settings-domain-commands-v01.md` §5.
- AI-doc registry's initial entry set beyond CLAUDE.md/GEMINI.md/AGENTS.md —
  open, `spec-ai-domain-commands-v01.md` §1.1.
- `javascriptScanner.ts`/`typescriptScanner.ts` (and the matching Strategy pair)
  duplicate-file question — still unresolved, see "Known outstanding items" above.

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
