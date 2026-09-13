# Technical Specification Document

**Component:** Utils Domain — Five Commands
**Files:** `~/app/commands/utils/*.ts`
**Project:** `app-manager`
**Language:** TypeScript (Node.js runtime)

*Phase 7 (Implementation Roadmap §7) — final phase of the original plan. Three of these five commands (`autoDoc`, `autoVersion`, `validateHeaders`) are the second and third real consumers of the `codeService`/Strategies stack, after `nuxt.extractDocs` in Phase 6.*

---

## 1. Shared Context

### 1.1 One New Service Method, One Correction to the Roadmap's Own Assumption

**New — `githubService.getFileDiff()`:** checked directly, `githubService` only has `getStagedDiff(cwd)` (`git diff ['--cached']`, no path filtering). `utils.autoVersion` needs the **unstaged, per-file** diff for whichever specific files are modified — a genuinely different operation, not a variant reachable from the existing method. **Specified in full in `spec-githubService-createRepo.md` §5.9**, added there as an addendum, following the same pattern as `getLocalIdentity`/`getTrackedPaths`/`addRemote` before it.

```ts
public async getFileDiff(cwd: string, filePath: string, staged: boolean = false): Promise<string> {
	const args = staged ? ['--cached', filePath] : [filePath];
	const diff = await this.git(cwd).diff(args);
	logger.debug(`Retrieved diff for ${filePath} (${diff.length} chars)`);
	return diff;
}
```
Defaults to unstaged, matching the semantics of `GitStatusResult.modified` (§1.2), which is what `autoVersion` iterates over.

**Correction:** the roadmap stated `fileService.listFilesRecursive()` (built in Phase 6) "will also be needed by `utils.autoDoc`/`utils.autoVersion`/`utils.validateHeaders`." Checked each command's actual discovery mechanism against its own legacy spec and found this is only true for **two of the three**:

| Command | Discovery mechanism | Needs `listFilesRecursive()`? |
|---|---|---|
| `utils.autoDoc` | Full directory walk (its own `walk()` helper in the legacy spec) | **Yes** |
| `utils.autoVersion` | Git-diff-based — only files `simple-git` reports as modified | **No** — uses `GitStatusResult.modified` (§1.2), an existing field, not a tree walk at all |
| `utils.validateHeaders` | Full directory walk (its own `walk()` helper, matching `autoDoc`'s pattern) | **Yes** |

Worth stating precisely rather than carrying the roadmap's blanket claim forward unchecked — building `autoVersion` around a tree-walk it doesn't use would have been a real, if minor, design error.

### 1.2 Confirmed: No New Method Needed for `autoVersion`'s File Discovery

`GitStatusResult` (already defined) has `modified: string[]`, and `githubService.getStatus(cwd)` already populates it from `simple-git`'s real status object — confirmed in Phase 4's review of the same interface for `git.pushAll`. `autoVersion` filters this array to `.ts`/`.vue` extensions itself; no service change required.

### 1.3 Confirmed: `injectFunctionDoc()` Is Already Safe for Multiple Sequential Injections

The roadmap flagged this as something to "verify and fix if needed" before `utils.autoDoc` could be built safely. Re-examined the real implementation directly: `injectFunctionDoc(content, functionName, docBlock)` re-splits `content` into lines and re-searches for `functionName` **by name, against whatever `content` it's given** — it does not operate against a cached numeric index computed earlier. This means it is **already correct for chained, sequential calls** — `content = injectFunctionDoc(content, name1, doc1); content = injectFunctionDoc(content, name2, doc2);` — with no special bottom-up ordering required, because each call re-locates its target fresh against the current state of the string, which already reflects every prior injection.

**The one thing this does require of the caller** (`utils.autoDoc`, §2): each call's *output* must become the next call's *input*. A bug would only be introduced if a command instead computed injection content for every candidate against the **original, unmodified** file content and tried to apply them independently — that pattern would genuinely need bottom-up ordering to avoid corrupting later positions. §2.2 specifies the correct chained pattern explicitly, precisely to rule this out.

### 1.4 Confirmed: `validateHeaders` Uses Field-Level Patching, Not `injectHeader()`

Restating the standing decision made when this command was first specified, now confirmed unchanged by everything built since: `@createDate`/`@createTime` must never be overwritten by a validation pass, and `injectHeader()`'s whole-block-replace behavior is fundamentally the wrong operation for that reason — not a matter of code reuse convenience. `utils.validateHeaders` (§4) implements its own targeted field-patch logic, reusing `TypescriptStrategy.parseMetadata()` (already implemented, extracts `@version`/`@author`) for *reading*, but not `injectHeader()` for *writing*.

---

## 2. `utils.autoDoc` — Auto-Generate Missing JSDoc

**Status:** New. Built against `codeService` per the standing recommendation, not the legacy spec's bespoke TS-only regex walk.

### 2.1 Functional Logic

1. `const files = await fileService.listFilesRecursive(targetRoot, { extensions: ['.ts', '.js', '.vue'], exclude: ['node_modules', '.git', '.nuxt'] });` (§1.1).
2. For each file: `const blocks = await codeService.inspect(filePath);` then filter to `blocks.filter(b => !b.hasDoc)`.
3. If no undocumented blocks found anywhere, log success and exit. Otherwise confirm with the user before proceeding (unchanged from legacy spec's posture).
4. **Per file with undocumented blocks — the chained-call pattern from §1.3, made explicit:**
   ```ts
   let content = await fileService.readText(filePath);
   for (const block of undocumentedBlocksInThisFile) {
       const jsDoc = await llmService.generate(promptFor(block));
       content = strategy.injectFunctionDoc(content, block.name, jsDoc); // chains from previous iteration's output
   }
   await fileService.write(filePath, content);
   ```
   Order of iteration over blocks **within a file does not matter** for correctness (§1.3) — unlike the legacy spec's own bottom-up requirement, which was a property of *its* index-based splicing approach, not an inherent constraint of the problem itself.
5. **AI availability gate (Phase 2/4/6 pattern applied here too):** if `!llmService.isAvailable()`, skip the entire generation step for that file — log once that AI is unavailable and no docs will be generated this run, rather than attempting and failing per-block.
6. **Per-candidate failure isolation preserved from the legacy spec:** if `llmService.generate()` throws, or the response doesn't look like a real JSDoc block (`starts with /**`, `ends with */`), skip that one candidate and continue — don't abort the whole file over one bad generation.
7. **Fix the legacy spec's known bug:** the final `fileService.write(filePath, content)` call is wrapped in its own `try/catch`, logging and continuing to the next file on failure — the legacy spec left this specific write unguarded (flagged explicitly in the original architecture audit as a real gap), and this spec does not carry that forward.

### 2.2 Test Scenarios

| ID | Scenario | Expected Outcome |
|---|---|---|
| AD-01 | File with three undocumented exports | `injectFunctionDoc` called three times, each chaining from the previous call's return value — verified by asserting the second call's `content` argument already contains the first call's injected doc |
| AD-02 | AI unavailable | No `generate()`/`injectFunctionDoc()` calls at all for any file; one clear log message |
| AD-03 | One candidate's AI response is malformed (no `/**`/`*/`) | That candidate skipped; other candidates in the same file still processed and written |
| AD-04 | `fileService.write()` fails for one file | Logged, loop continues to the next file — confirms the previously-unguarded write is now caught |
| AD-05 | `.vue` file with an undocumented `<script setup>` export | Routed through `VueStrategy` via `getStrategyForFile()`, confirming the fix works uniformly across every supported extension, not just `.ts` |

---

## 3. `utils.autoVersion` — Auto-Increment File Versions

**Status:** New. Uses `TypescriptStrategy.parseMetadata()` (existing) instead of bespoke regex, per the standing recommendation, and the new `getFileDiff()` (§1.1) for diff retrieval.

### 3.1 Functional Logic

1. `const status = await githubService.getStatus(targetRoot);` then filter `status.modified` to `.ts`/`.vue` extensions (§1.2 — no tree walk).
2. If none, log info and exit.
3. Confirm with the user before proceeding.
4. Per file:
   - `const content = await fileService.readText(filePath);`
   - `const { version, author } = strategy.parseMetadata(content);` — reusing the existing method rather than the legacy spec's own regex, per §1.3 of the original roadmap's recommendation for this command.
   - Skip the file if `version` is undefined (no `@version` tag present — this file doesn't follow the header convention this command depends on).
   - `const diff = await githubService.getFileDiff(targetRoot, filePath);` (§1.1).
   - Send to `llmService.generate()` requesting `{ increment: 'Major'|'Minor'|'Patch', note: string }`, **gated on `llmService.isAvailable()`** — if unavailable, or if the call throws/returns malformed JSON, default to `'Patch'` (unchanged fallback behavior from the legacy spec, now reached via a proactive check as well as the existing try/catch safety net).
   - Compute the new version via `incrementVersion()` (unchanged logic from the legacy spec — string-based, fails safe on malformed input).
   - String-replace the `@version` tag and append the history entry.
   - `await fileService.write(filePath, newContent);` — **wrapped in try/catch**, same fix as §2.1 step 7, correcting the same known gap the legacy spec left in this command too.
5. Log the total count of files updated.

### 3.2 Test Scenarios

| ID | Scenario | Expected Outcome |
|---|---|---|
| AV-01 | No modified `.ts`/`.vue` files | Exits immediately, no confirmation prompt shown |
| AV-02 | Modified file missing `@version` tag | Skipped, not treated as an error |
| AV-03 | AI unavailable | Every eligible file defaults to `Patch`, `llmService.generate()` never called |
| AV-04 | AI returns malformed JSON | Same `Patch` fallback, via the existing catch rather than the new proactive gate |
| AV-05 | `fileService.write()` fails for one file | Logged, loop continues — confirms the write is now guarded |

---

## 4. `utils.validateHeaders` — Validate & Fix File Headers

**Status:** New. The most complex command in this domain, per the standing field-level-patch decision (§1.4).

### 4.1 Functional Logic

1. `const identity = await githubService.getLocalIdentity(targetRoot);` (Phase 2 addition) — replaces the legacy spec's own `getGitAuthor()` helper, since this is exactly what that method already provides.
2. `const files = await fileService.listFilesRecursive(targetRoot, { extensions: [...EXTENSIONS], exclude: [...EXCLUDE_DIRS] });` plus every `package.json` found (§1.1).
3. **For each `package.json`:** validate its `name` against the folder-derived expected name. On mismatch, present the Auto/Manual/AI/Skip choice — the AI path gated on `llmService.isAvailable()` (skip straight to Manual if unavailable, rather than offering a choice that would fail); on **AI**, call `llmService.generate()` for a suggested name/description, parse the JSON response, apply via `fileService.write()` (whole-file write is correct here — `package.json` naming is a top-level field change, not a header-block patch, so this doesn't touch the field-vs-whole-block distinction from §1.4 at all).
4. **For every other source file** — the field-level patch logic (§1.4), unchanged in scope from the original design:
   - Sync `@project` tag to current folder structure — **only if the tag already exists** (the legacy spec's documented limitation, carried forward deliberately, not a bug: a file missing the tag entirely does not get one added by this command).
   - Sync `@file` tag to the correct relative path.
   - **Author handling:** if no `@author` exists, add one using `identity.name` (from step 1) with a creation timestamp; if one exists but `identity.name` isn't listed, append it.
   - **Version handling:** scan the file's own revision-history comments for the highest `V(\d.\d.\d)` entry, sync the top-level `@version` tag to match it — the tag is treated as *derived from* the history log, not the other way around, exactly as originally specified.
   - Only write the file if an actual change was detected.
5. Log a summary count.

### 4.2 Test Scenarios

| ID | Scenario | Expected Outcome |
|---|---|---|
| VH-01 | `package.json` name mismatch, AI unavailable | Manual prompt shown directly; AI option not offered |
| VH-02 | Source file missing `@project` entirely | Tag **not** added — confirms the documented limitation is preserved, not silently "fixed" into different behavior |
| VH-03 | `@version` is `1.0.0`, history shows `V2.0.0` | `@version` updated to `2.0.0` |
| VH-04 | New author (per `getLocalIdentity`) not yet in `@author` list | Appended, existing entries untouched |
| VH-05 | File with no changes needed | Not written at all — confirms the "only write if changed" guard |
| VH-06 | `identity.name`/`identity.email` both absent (per Phase 2's `getLocalIdentity` partial-identity case) | Author-handling steps degrade gracefully — no crash from a missing name, file simply isn't touched for that specific field |

---

## 5. `utils.addContributor` — Add Contributor to `package.json`

**Status:** New. Recommended fix from the original design: use `fileService`'s JSONC-aware read/write instead of raw `JSON.parse`.

### 5.1 Functional Logic

Unchanged in outward behavior from the original design — resolve name/email/url from options or prompts (URL prompt skipped if both name and email arrived via flags, the existing headless heuristic), duplicate-check by email, push and write. **Implementation correction:** `const pkg = await fileService.read(pkgPath);` / `await fileService.write(pkgPath, updatedPkg);` replace the legacy spec's raw `JSON.parse`/`fs.writeFileSync`, directly fixing the "`pkg` is implicitly `any`" type-safety gap the original architecture audit flagged, and giving the edit comment/formatting preservation `fileService.update()` provides (though a full `write()` is acceptable here too, since `package.json`'s `contributors` array is a top-level key `update()` could target directly if surgical preservation is wanted — either is correct; `write()` is simpler and sufficient given `package.json` files in this project don't carry hand-authored comments).

### 5.2 Test Scenarios

| ID | Scenario | Expected Outcome |
|---|---|---|
| AC-01 | Standard add | `fileService.read`/`write` called, not raw `fs`/`JSON.parse` |
| AC-02 | Duplicate email | Warned, no write attempted |
| AC-03 | `package.json` missing entirely | `fileService.read` returns `null`; clear error, no crash |

---

## 6. `utils.cleanLogs` — Clean Test Artifacts

**Status:** New. Two confirmed fixes to the original design: the `app-manager` path rename (Phase 5 convention) and using the Phase 6 `fileService.deleteDir()` instead of raw `fs.rmSync`.

### 6.1 Functional Logic

Unchanged in outward behavior — scan `app-manager/logs/test/` (**renamed from `app_manager/logs/test/`**, per the Phase 5 directory convention — this command's own hardcoded path needed the identical fix already applied to the gitignore templates and `vitestConfigTemplate`) and `tests/fixtures/` (unchanged path, outside the `app-manager/` restructure's scope) for `mock-*`-prefixed entries; if both empty, exit without prompting; otherwise confirm (default `false`) then delete via `fileService.deleteDir()` (§ Phase 6) rather than raw `fs.rmSync`, consistent with every other command in this codebase routing file I/O through `fileService`.

**Recommended, not required:** the original design's hardcoded path strings could move to `configService` for configurability, given `app.run`'s `Empty` action (Phase 6) already needs an overlapping-but-different target list — flagged as worth doing but not blocking, since nothing currently depends on these paths being configurable rather than fixed.

### 6.2 Test Scenarios

| ID | Scenario | Expected Outcome |
|---|---|---|
| CL-01 | Both directories have matching entries | Confirmation shown with correct counts; `deleteDir` called per entry on confirm |
| CL-02 | Neither directory has anything | Exits silently, no confirmation prompt |
| CL-03 | Path check uses `app-manager/test-logs`, not `app_manager/logs/test` | Confirms the rename was actually applied, not just documented |

---

## Final Architectural Notes

- §1.3's finding is the most valuable thing in this document: a risk the roadmap explicitly flagged as needing verification-and-possibly-a-fix turned out, on actually reading the code, to need no fix at all — `injectFunctionDoc()`'s search-by-name design was already correct for the use case. This is worth remembering symmetrically alongside every phase where checking *did* surface a real gap (`getTrackedPaths`, `deleteDir`, `getFileDiff` in this very document) — the discipline of verifying against real code cuts both ways, confirming safety as often as it finds bugs, and both outcomes are worth having on record rather than only the ones that found problems.
- §1.1's correction (only two of three commands need `listFilesRecursive()`) is a small thing, but it's exactly the kind of imprecision that compounds if left unchecked — a command built around a dependency it doesn't actually have would have been harmless here, but the pattern of "restate the roadmap's claims without re-verifying them" is the same failure mode that produced the Phase 5 false-stub-classification problem, just lower-stakes this time.
- **This closes Phases 1–7 of the originally-planned nine-phase sequence** — not the whole plan. Two items remain: **Phase 8** (`docs.run`/`quality.run`, depending on the `processService.detectPackageManager()` consolidation delivered in Phase 6) has not been started, and **Phase 9** (JSX/TSX scanner/strategy/orchestrator support) remains deferred and unscheduled by original design, not by omission. These are two different states — Phase 8 is simply not yet done; Phase 9 is deliberately not-yet-scheduled — and worth keeping distinct rather than treating both as "the same kind of not done."
