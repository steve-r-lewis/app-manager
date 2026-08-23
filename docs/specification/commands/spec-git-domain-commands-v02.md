# Technical Specification Document

**Component:** Git Domain — Nine Commands (Consolidated per Command Specs §1.1–1.3)
**Files:** `~/app/commands/git/*.ts`
**Project:** `app-manager`
**Language:** TypeScript (Node.js runtime)

*Phase 4 (Implementation Roadmap §7). Three commands already have working implementations (`syncCommand`, `pushCommand`, `commitCommand`) — this document is explicit throughout about what's unchanged, what's extended, and what's genuinely new, rather than re-specifying working code from scratch.*

---

## 1. Shared Context

### 1.1 New Type Additions to `gitTypes.ts`

```ts
// Extended — new fields for the Scoped Sync orchestrator (§2)
export interface GitSyncOptions {
	force?: boolean;     // existing — headless: skip UI prompts, raw stdio
	all?: boolean;        // new — Global scope: root + all submodules
	rootOnly?: boolean;   // new — root repo only, skip submodules
	current?: boolean;    // new — Local scope: sync only cwd's own repo
}

// New — git.pushAll's per-repo discovery result
export interface GitRepoAheadStatus {
	name: string;   // display label, e.g. "ROOT (App)" or "Layer: auth"
	path: string;
	ahead: number;
	branch: string;
}

// New — git.deleteRemoteRepos
export interface GitDeleteRepoOptions {
	repo?: string;    // "owner/name" or bare "name"
	confirm?: string; // must equal "DELETE" (case-insensitive)
	org?: string;     // explicit override; falls back to configService.resolve('github.defaultOrg') if omitted
}

// New — git.initLayers
export interface GitInitLayersOptions {
	force?: boolean; // skip confirmation prompt (CI mode)
}
```

**Note on `GitCommitOptions.availableLLMs`:** this field already exists in the type (anticipating the legacy `manageCommits` multi-provider-selection menu) but is **superseded, not used, by the rebuilt `git.commit`** (§4) — the Phase 2 `llmService.resolveActiveProvider()` fallback chain now handles provider selection automatically via settings, making a per-commit "which provider?" prompt unnecessary. Left in the type for now (no destructive change to committed data/types), same treatment as `repositoryRegistry.json`'s vestigial `githubOrg` field from the Phase 2 `githubService` spec — a second instance of the same pattern, worth recognizing as a pattern rather than a one-off.

### 1.2 One New Service Method Required: `githubService.getTrackedPaths()`

Checked against the full, current `githubService.ts` (Phase 2 spec) and confirmed: **no existing method can answer "is this path already tracked by the root repo's git index."** This is a hard requirement for `git.addSubmodules` (§7) — without it, there's no way to distinguish an untracked layer folder (a genuine candidate for `submodule add`) from one that's already committed as a plain directory (which `submodule add` would corrupt).

**Specified in full in `spec-githubService-createRepo.md` §5.7**, added there as an addendum (same treatment as `getLocalIdentity` before it) rather than left living only as inline logic in this document. Signature: `getTrackedPaths(cwd: string): Promise<Set<string>>`, wrapping `git ls-files --stage` and splitting each line on its last tab character.

Add to `IGithubService`. No new type needed beyond the return type itself (`Set<string>`, not worth a named interface for one primitive).

### 1.3 Confirmed: No New Service Method Needed for `git.pushAll`'s Status Check

`GitStatusResult` already has `ahead?: number; behind?: number;`, and `githubService.getStatus(cwd)` already populates both from `simple-git`'s real status object. `pushAll`'s per-repo discovery (§6) calls this existing method directly — no new addition required, unlike the roadmap's original assumption that a dedicated `scanForUnpushed()` method might be needed.

### 1.4 Confirmed: No New Service Method Needed for Root-vs-Layer Context Detection

`git.sync`'s orchestration (§2) needs to know whether `cwd` is the monorepo root or a layer subdirectory. Resolved with the simplest possible check rather than a new capability: `await fileService.exists(path.join(cwd, '.gitmodules'))` — a monorepo root has this file (from having submodules registered); a layer directory does not. Uses `fileService.exists()`, already present, directly in the command — no new service method warranted for a single boolean file-existence check.

---

## 2. `git.sync` — Sync Orchestrator

**Status:** Rebuilt. Today's `SyncCommand` (`syncCommand.ts`) *is* the Global-scope logic — it becomes the new `git.syncReposAll` (§3) unchanged, and this file becomes purely the scope-resolving orchestrator sitting in front of it.

### 2.1 Functional Logic

1. **Context detection** (§1.4): `const isRoot = await fileService.exists(path.join(targetRoot, '.gitmodules'));`
2. **Scope resolution:**
   - `options.all` → Global.
   - `options.rootOnly` → Root Only.
   - `options.current` → Local.
   - No flag, `isRoot === true`, interactive → prompt the three-way menu ("Full Sync (Root + All Submodules)" / "Root Only" / "Select Specific Layers...").
   - No flag, `isRoot === true`, headless → default to Global (safe default, matches today's only behavior, preserving headless backward compatibility for anyone already scripting `am git sync --force` expecting a full sync).
   - No flag, `isRoot === false` (inside a layer) → **always** Local, interactively or headlessly, without prompting — least-surprise: running `sync` from inside a layer syncs that layer.
3. **Dispatch:** Global → call `git.syncReposAll`'s underlying logic (§3) directly against `targetRoot`; Root Only → call `githubService.pull(targetRoot, silent)` (the new Phase 4 §1 addition, root-only, no submodule step) — **note:** "Root Only" and "Local scope run from the root" resolve to the exact same underlying call; they're only different *menu labels* for the same operation, not different code paths; Local → call `git.syncRepo`'s underlying logic (§3.2) against `targetRoot`; Selective → `multiselect` over discovered layer directories, then loop `git.syncRepo`'s logic per selection.
4. **Drift warning (per the original dev-proposal doc):** when Local or Selective scope is chosen interactively from the root, print one line noting the monorepo-drift risk described in that proposal, before proceeding — advisory only, does not block.

### 2.2 Test Scenarios

| ID | Scenario | Expected Outcome |
|---|---|---|
| GS-01 | At root, interactive, no flags | Three-way menu shown |
| GS-02 | At root, headless, no flags | Defaults to Global — proves backward compatibility with today's only behavior |
| GS-03 | Inside a layer, no flags, either mode | Local scope chosen automatically, no prompt |
| GS-04 | `--current` from root | Local scope against `targetRoot` itself, not a layer |
| GS-05 | Interactive, Local or Selective chosen from root | Drift warning line printed before proceeding |

---

## 3. `git.syncReposAll` — Global Scope Worker

**Status:** This **is** today's working `SyncCommand` implementation, unchanged, relocated to back this role rather than being the top-level command itself. Every existing behavior — `options.force` for headless raw-stdio mode vs. interactive silent+spinner mode, calling `githubService.syncRepo(targetRoot, silent)` (root pull + `git submoduleUpdate(['--init', '--recursive'])`) — carries over exactly as-is. No functional changes; this section exists in this document only to state clearly that nothing here needs re-specifying, and that `git.sync` (§2) is now what dispatches to it rather than users invoking it directly by this name in the common case.

### 3.1 `git.syncRepo` — Local Scope Worker (New)

**Status:** Genuinely new — no prior implementation. Backs both "Root Only" and "Local"/"Selective" dispatch from §2.

**Functional Logic:** Thin wrapper — `await githubService.pull(cwd, silent);` (the Phase 2 `githubService.pull()` addition), then report success/failure for that one repo, using the identical spinner/raw-stdio split as `syncReposAll` for UI consistency. **Explicitly does not call `submoduleUpdate`.**

**Test Scenarios:**

| ID | Scenario | Expected Outcome |
|---|---|---|
| SR-01 | Successful pull | `githubService.pull` called with resolved `cwd`; success logged |
| SR-02 | Pull fails (network, conflict) | Error caught and logged; does not crash the orchestrator if called as part of a Selective-scope loop |

---

## 4. `git.commit` — Smart Commit (AI)

**Status:** Extended. Today's `CommitCommand` implementation is the starting point; this section specifies exactly what changes and why, referencing the real, current code directly rather than restating the parts that don't change.

### 4.1 What Stays Exactly the Same

Phase 1 (status check, stage-all-on-confirm), the manual-entry fallback path (`p.text()`, non-empty validation), and the final `githubService.createCommit(targetRoot, message)` call are **unchanged** from the current implementation.

### 4.2 What Changes

1. **Availability check before offering AI at all (new):** immediately before today's `"Generate commit message with AI?"` confirm prompt, check `llmService.isAvailable()` (Phase 2). If `false`, **skip the confirm prompt entirely** and go straight to manual entry, with one log line (`AI unavailable — no configured or reachable provider. Enter a commit message manually.`) — replacing today's behavior of asking a question that would always fail, with a proactive check that removes a guaranteed-dead-end interaction.
2. **Diff sanitization (new, absorbed from the legacy `manageCommits` spec):** between retrieving the staged diff (`githubService.getStagedDiff()`, unchanged) and sending it to the LLM, call `llmService.sanitizeContext(diff)` (already implemented in Phase 2's review of `llmService.ts` — confirmed to exist, 4000-char default, head+tail truncation) before constructing the generation prompt.
3. **Inline-editable review (changed, absorbed from `manageCommits`):** today's binary accept/reject `confirm()` on the AI-generated message is replaced with a `p.text()` prompt **pre-filled with the generated message as its `initialValue`** — pressing Enter accepts it unmodified, typing replaces it. This removes the current "reject → fall through to a second, separate blank manual-entry prompt" two-step in favor of one prompt that's always editable.

### 4.3 Test Scenarios (New/Changed Behavior Only)

| ID | Scenario | Expected Outcome |
|---|---|---|
| GC-01 | AI unavailable | `llmService.isAvailable()` returns `false`; "Generate with AI?" confirm never shown; goes straight to the manual `text()` prompt |
| GC-02 | AI available, diff longer than the sanitize threshold | `sanitizeContext()` called on the diff before `llmService.generate()`; the *sanitized* string is what gets sent, verified by asserting on `generate()`'s call argument |
| GC-03 | AI generates a message, user accepts unmodified | `text()` called with `initialValue` equal to the generated message; user presses Enter (mocked as returning the same string); `createCommit` called with that exact message |
| GC-04 | AI generates a message, user edits it | `text()` mocked to return a different string than `initialValue`; `createCommit` called with the *edited* string |

---

## 5. `git.push` — Push to Remote(s)

**Status:** Unchanged. Confirmed against the current, working `PushCommand` implementation — multiselect remotes, per-remote error isolation, `--remote` headless override — every part of this already matches the command specs' §4.5 description exactly. Nothing in Phase 2/3's work changes anything this command does. No new spec content needed; included here only for completeness of the domain listing.

---

## 6. `git.pushAll` — Mass Push (Monorepo-Wide)

**Status:** New.

### 6.1 Functional Logic

1. **Discovery:** `const rootStatus = await githubService.getStatus(targetRoot);` — if `rootStatus.ahead > 0`, add `{ name: 'ROOT (App)', path: targetRoot, ahead: rootStatus.ahead, branch: rootStatus.branch }` to the queue (using the confirmed-sufficient existing `GitStatusResult`, §1.3 — no new method).
2. Scan `layers/*`: for each subdirectory containing a `.git` folder, call `githubService.getStatus(layerPath)` the same way; add to the queue if `ahead > 0`.
3. If the queue is empty, log success and exit.
4. Report the queue (name / commits ahead / branch per row), then `confirm()` (or `options.force` to skip, for CI).
5. Push loop: `githubService.push(item.path)` per queue item, **with per-item error isolation** — one failure recorded, loop continues.
6. Final summary: successes and failures reported separately.

### 6.2 Test Scenarios

| ID | Scenario | Expected Outcome |
|---|---|---|
| PA-01 | Root and two layers all ahead | All three pushed; summary lists three successes |
| PA-02 | Nothing ahead anywhere | Success logged immediately, no confirm prompt shown, no pushes attempted |
| PA-03 | One layer's push fails (e.g. auth) | That failure recorded in the summary; the other queue items still get pushed |
| PA-04 | `layers/` doesn't exist at all | Root still checked normally; no crash from the missing directory |

---

## 7. `git.addSubmodules` — Link Untracked Layers as Submodules

**Status:** New. Depends on §1.2's new `getTrackedPaths()` method — this command cannot be correctly implemented without it.

### 7.1 Functional Logic

1. Validate `targetRoot` is a repo and `layers/` exists (warn + exit on either failing).
2. `const tracked = await githubService.getTrackedPaths(targetRoot);` (§1.2).
3. Scan `layers/*` subdirectories: for each, check it's a git repo (`.git` folder present) **and** its relative path is **not** in `tracked`. For each surviving candidate, call `githubService.getRemotes(layerPath)` (existing) and look for one named `origin`; candidates without one are skipped with a warning (`submodule add` requires a URL).
4. `multiselect` over the remaining eligible candidates, labeled `${name} (${originUrl})`.
5. For each selected, `githubService.addSubmodule({ cwd: targetRoot, url, path: relativePath })` (existing method, confirmed adequate) — per-item error isolation, continuing past individual failures.
6. Remind the user to commit the resulting `.gitmodules`/index changes.

### 7.2 Test Scenarios

| ID | Scenario | Expected Outcome |
|---|---|---|
| AS-01 | One eligible candidate with `origin` | Appears in the multiselect; selecting it calls `addSubmodule` with the correct url/path |
| AS-02 | Candidate already tracked (`getTrackedPaths` includes its path) | Excluded from candidates entirely — not shown, not warned about |
| AS-03 | Candidate is a git repo but has no `origin` remote | Excluded, with a warning naming it specifically |
| AS-04 | Zero eligible candidates | Logs info and exits — `multiselect` never shown |
| AS-05 | `addSubmodule` fails for one of several selections | That failure logged; remaining selections still processed |

---

## 8. `git.initLayers` — Initialize Git in Uninitialized Layers

**Status:** New, narrower scope than the original legacy spec anticipated — now that `nuxt.createLayer` self-initializes new layers with their own git repo (command specs §5.1), this command's role is specifically for layers that appeared *without* going through `createLayer` (manually copied in, extracted from an old monolith, etc.).

### 8.1 Functional Logic

1. Validate `layers/` exists (warn + exit if not).
2. Scan for subdirectories lacking a `.git` folder.
3. If none found, log success (`All layers are already initialized`) and exit.
4. Unless `options.force`, confirm the list with the user.
5. Loop: `githubService.initRepo({ cwd: layerPath })` (existing method — already handles default-branch naming; no `userName`/`userEmail` passed here, since these are independent layer repos, not necessarily authored under the same identity as the root) — per-item error isolation.

### 8.2 Test Scenarios

| ID | Scenario | Expected Outcome |
|---|---|---|
| IL-01 | One uninitialized layer, confirmed | `initRepo` called once with that layer's path |
| IL-02 | `--force` | Confirmation skipped entirely |
| IL-03 | All layers already initialized | Success logged, `initRepo` never called |
| IL-04 | `initRepo` fails for one of several | Logged; loop continues to the next layer |

---

## 9. `git.deleteRemoteRepos` — Delete Remote Repository

**Status:** New. Close to pure wiring, as anticipated in the original command specs — every service capability it needs already exists post-Phase 2/3.

### 9.1 Functional Logic

1. **Target resolution:**
   - `options.repo` (headless): parse `owner/name` or bare `name`. If bare, resolve owner via `options.org` (explicit override) → `configService.resolve('github.defaultOrg')` → (only if genuinely nothing resolves) prompt interactively for an org, since this is a destructive operation that should never silently guess. **This replaces the hardcoded `'steve-r-lewis'` fallback** the legacy spec carried — there is no hardcoded personal fallback anywhere in this version.
   - No `options.repo` (interactive): `githubService.listRemoteRepos(resolvedOrg)` (existing), `select()` menu showing name + public/private.
2. **Confirmation:** `options.confirm` if provided (headless) must equal `'DELETE'` (case-insensitive); otherwise prompt via `text()` requiring the same.
3. **Execution:** `githubService.deleteRemoteRepo(owner, repo)` (existing) — mismatched confirmation logs a warning and aborts without calling the API.

### 9.2 Test Scenarios

| ID | Scenario | Expected Outcome |
|---|---|---|
| DR-01 | Headless, bare name, org resolved from settings | `configService.resolve('github.defaultOrg')` consulted; `deleteRemoteRepo` called with that org |
| DR-02 | Headless, bare name, no org anywhere (settings unset, no `--org`) | Interactive org prompt shown even in an otherwise-headless flow — **the one deliberate exception** to "headless never prompts," since guessing an owner for a destructive delete is worse than asking once |
| DR-03 | Wrong confirmation string | `deleteRemoteRepo` never called; warning logged |
| DR-04 | Correct confirmation, API failure | Error from `deleteRemoteRepo` surfaced, not swallowed |

---

## Final Architectural Notes

- This is the first Phase 4+ document where a *previous* phase's design decision (Phase 2's LLM fallback chain) directly **retires** a feature that was already represented in the type system (`GitCommitOptions.availableLLMs`) before this document was ever written — worth noting as a second confirmed instance of "settings supersede an older mechanism," the same shape as the Phase 2 `githubOrg` finding, suggesting this is a recurring pattern in this codebase's evolution rather than a one-off.
- §1.2's `getTrackedPaths()` is the only new service-layer capability this entire domain needed — everything else in Git domain consolidation was buildable against Phase 1–3's existing surface, which is a good sign for how load-bearing that foundational work actually was.
- Per the roadmap, **Phase 5 is next** — template completions (`pnpmWorkspaceTemplate`, `envTemplate`, `vitestConfigTemplate`, and others currently `TODO`), which block Phase 6 (`app.setup`, `nuxt.createLayer`'s standalone requirement) from being specifiable in the same build-ready detail achieved here.
