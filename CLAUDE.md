# app-manager — Project Notes for Claude

## What this is
A Node/TypeScript CLI tool for managing a Nuxt 4 monorepo (root app + `layers/`
sub-packages). It automates layer scaffolding, git operations across many repos,
file-header/naming validation, and LLM-assisted docs/commit-message generation.

## Commands
- Build: `pnpm build` (runs `tsc`) — always run this after any changes to code files
  and treat a non-zero exit as the task not being done yet.
- Test (single file): `pnpm vitest run tests/unit/services/<file>.test.ts`
  — always scope to the file being worked on for now (see Testing
  conventions below for why).
- Package manager: pnpm. Don't suggest npm/yarn equivalents.

## Working style
- **Always run the build (and relevant tests) after making a change to code files, 
  before saying a task is complete.** Don't assume a fix compiles — verify it.
- Before creating or editing any file, check its *actual* current location and
  content first (`ls`/read the file) rather than assuming a path from memory
  or from a doc — this codebase has been through a folder restructure and
  several docs/specs are stale relative to the real tree. Including this file
  if it ever goes stale.
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

## Known outstanding items (don't silently "fix" without flagging)

## Actions outstanding — To-Do list

## Testing conventions
- Vitest, with `vi.mock` used to isolate services from `fs`, `simple-git`,
  `fetch`, and `@clack/prompts`.
- Follow existing test file structure/naming under `tests/unit/` when adding
  new suites.
