# App Manager — Pre-Implementation Command Specifications

*Purpose: a build-ready spec for every command on your roadmap, written against the real, current state of `app/services`, `app/templates`, and `app/strategies` — not the aspirational legacy docs. Where your list creates a naming or scope conflict, it's flagged and resolved explicitly below rather than silently picked. Two commands not on your original list (`nuxt.addFile`, and a clarified lifecycle for `nuxt.createLayer`) are proposed to cover the two extensions you described.*

---

## 0. Spec Template

Every command below follows this shape:

- **ID / File** — registry ID and source path
- **Status** — New build / Extends existing spec / Consolidates multiple files / Needs your decision
- **Purpose** — one or two sentences
- **CLI Usage** — headless invocation + interactive entry point
- **Options** — flags table
- **Preconditions (`isEnabled`)** — when the command should even appear/run
- **Behavior** — numbered execution flow
- **Consumes** — which services/templates/strategies it should call (per the Part II architecture audit)
- **Side Effects** — what it writes/deletes/pushes
- **Error Handling** — failure modes and how they should be handled
- **Open Questions** — only where a decision from you is genuinely needed
- **Relationship to Other Commands** — supersedes / depends on / overlaps with

---

## 1. Conflicts in Your List — Resolved Before Writing Specs

Your list carries forward several file names from the old legacy/spec pass that describe **overlapping or superseded operations**. Building all of them as separate, competing implementations would recreate the exact "two philosophies for one operation" problem flagged in the architectural appraisal. Here's how each is resolved, and every spec below is written against these resolutions.

### 1.1 Git Sync trio: `syncCommand.ts` / `syncRepo.ts` / `syncReposAll.ts`
**Resolution: adopt the "Scoped Sync" proposal already on file** (`syncCommand_DevelopmentProposals.md`). These three files stop being competing implementations and become one coherent feature:
- `syncReposAll.ts` → the **Global** scope worker (root pull + recursive submodule update) — this is what today's `syncCommand` already does.
- `syncRepo.ts` → the **Local** scope worker (pull only the repo at the current working directory — root *or* an individual submodule, whichever `cwd` resolves to).
- `syncCommand.ts` → the **orchestrator**. It detects context (are we at the monorepo root, or inside a layer?), resolves a scope from flags or an interactive menu, and dispatches to whichever worker applies.

### 1.2 Git Push trio: `pushCommand.ts` / `pushToRemote.ts` / `pushAll.ts`
**Resolution:**
- `pushCommand.ts` → the **orchestrator + single-repo push**, keeping the current multi-remote `multiselect` capability. This absorbs `pushToRemote.ts` entirely — `pushToRemote` was the older, simpler single-remote version and its logic is now just the default path through `pushCommand` when only one remote exists. **`pushToRemote.ts` should not be built as a separate file** — retire it, or keep it only as an unexported internal helper if you want the fallback logic named separately.
- `pushAll.ts` → a genuinely distinct feature: **discovery across the whole monorepo** (root + every layer), not a single-repo push. Keeps its own file.

### 1.3 Git Commit duo: `commitCommand.ts` / `manageCommits.ts`
**Resolution:** `manageCommits.ts` was the legacy, richer version (multi-LLM-provider selection, diff sanitization/truncation, inline-editable AI review). `commitCommand.ts` is the current, simplified version. **These should not both exist as separate commands** — that would mean two "smart commit" entries in the same menu doing almost the same thing. `commitCommand.ts` is specified below to **absorb the useful richer behavior** from `manageCommits` (diff sanitization, inline edit) while keeping the simpler single-LLM flow, since you don't currently have a documented need for multi-provider selection. `manageCommits.ts` is retired.

### 1.4 `app.run`'s new lifecycle sub-actions vs. `nuxt.manageEnv`
Your expanded `App Clean` / `App Empty` / `App Reinitialise` overlap directly with `nuxt.manageEnv`'s already-planned scope (clean caches, reinstall deps, "Reset" = clean + reinstall). Building both independently is exactly the risk flagged in the appraisal.

**Resolution:** `app.run`'s lifecycle actions and `nuxt.manageEnv` should share one underlying implementation rather than duplicating file-deletion logic in two places. Concretely:
- `nuxt.manageEnv` owns the actual **mechanics** of cleaning/reinstalling (target directory lists, `fs.rmSync` calls, package-manager detection/install).
- `app.run`'s `Clean` / `Empty` / `Reinitialise` sub-actions become **thin, opinionated presets** that call into the same underlying clean/install logic with a fixed target list, rather than re-implementing it.
- Practically: extract the current `executeClean(targetRoot, dirs)` / `executeInstall(targetRoot)` helpers out of `manageEnv.ts` into a shared location (e.g. a new `environmentService`, or exported functions from `manageEnv.ts` that `runApp.ts` imports) so there is exactly one deletion routine and one install routine in the codebase.
- Scope split: `App Clean` = caches only (`.nuxt`, `.output`, `.cache`). `App Empty` = everything `Clean` removes **plus** `node_modules`, `dist`, and lockfiles (`pnpm-lock.yaml`, etc. — this is new; `manageEnv`'s original spec never removed lockfiles, and doing so is a meaningfully more destructive operation that should have its own confirmation copy, not just reuse `manageEnv`'s existing confirm prompt wording).

### 1.5 `app.setup` — "provision an existing checkout" vs. "scaffold a brand-new project"
The original `setupApp.ts` spec (from the legacy docs) describes **provisioning a checkout that already exists**: create `.env` from `.env.example`, install deps, sync submodules, write VS Code settings. Your new description — "similar to `nuxi create` but specific to my idealised layer based architecture" — describes **generating a brand-new project from nothing**: no existing directory, no existing `package.json`, no existing git history.

**These are different operations and should not both live under one command named ambiguously.** Resolution used below: `app.setup` is redefined as the **new-project scaffolder** ("nuxi create, but yours"), since that's what you described wanting. The old "provision an existing checkout" behavior (`.env` from example, install, submodule sync, VS Code settings) is folded into `app.run`'s **Initialise** sub-action instead, since "make an already-checked-out repo ready to develop in" is really what `App Initialise` should mean beyond just `pnpm install`.

### 1.6 New capability needed: `nuxt.addFile`
Not on your original list, but described directly: "a function that could add specific files, e.g. `netlify.toml`." This needs its own command rather than being bolted onto `createLayer` or `manageEnv`, because it's a general "add an optional, named config file to an existing project" operation, usable at any point in a project's life — not just at creation time. Specified in full below (§5.3).

### 1.7 `nuxt.createLayer`'s new scope: standalone project + own git repo + later "extend"
This is the largest change to any single command on your list. Fully addressed in §5.1, including the one open question I can't resolve for you: **what "extend that layer as development continues" is supposed to mean operationally.** I've proposed an interpretation; you should confirm or correct it before this gets built, since it changes what `nuxt.createLayer` needs to hand back to the user and what (if anything) a follow-up command needs to do.

### 1.8 New service capability required: `githubService.createRepo()`
Good news first: your `githubService` is further along than the legacy docs suggested — `initRepo`, `cloneRepo`, `addSubmodule`, `listRemoteRepos`, and `deleteRemoteRepo` all already exist and work. The one method the extended `createLayer` needs that **doesn't** exist yet is **remote repo creation** (calling the GitHub API to create a new empty repository under your account/org, so a freshly scaffolded standalone layer has somewhere to push to). This is called out as a dependency in §5.1 rather than assumed.

---

## 2. App Domain

### 2.1 `app.run` — Run Application (Lifecycle Orchestrator)

**File:** `app/commands/app/runApp.ts`
**Status:** Major extension of existing implementation (currently a generic `package.json` script runner; becomes a curated lifecycle menu with the generic runner retained as a fallback).

**Purpose:** Single entry point for every stage of an application's local lifecycle — from first checkout to nuking the environment and starting over — plus the existing generic "run any script" capability for anything not covered by a named preset.

**CLI Usage:**
```
am app run                    # interactive menu of lifecycle actions
am app run dev                # headless: run a specific named action
am app run <scriptName>       # headless: fall back to generic script runner if <scriptName> isn't a preset
```

**Options:**
| Flag | Meaning |
|---|---|
| `--script <name>` | (existing) run an arbitrary `package.json` script directly, bypassing the menu |
| `--yes` | skip confirmation prompts on destructive presets (`Empty`, `Reinitialise`) |

**Preconditions:** `package.json` exists in `targetRoot` (existing check, unchanged).

**Behavior — the eight sub-actions:**

1. **Initialise** — `pnpm install` (or detected PM equivalent) **plus** the "make a fresh checkout ready to develop" steps absorbed from the old `setupApp.ts` spec: copy `.env.example` → `.env` if missing and warn to fill in real keys; prompt to sync git submodules if `layers/` contains any; generate recommended VS Code `settings.json` if one doesn't already exist. This is the "first thing you run after cloning" action.
2. **Post Installation** — runs the `postinstall` script if one exists in `package.json`; if none exists, this option should either not appear in the interactive menu or clearly report "no postinstall script defined" rather than erroring.
3. **Run Locally** — `pnpm run dev` via the existing detected-package-manager execution path (this is exactly today's generic runner, pointed at a fixed script name instead of a picked one).
4. **Build** — `pnpm run build`, same execution mechanism.
5. **Preview** — `pnpm run preview`, same execution mechanism. Should validate a `build` output exists first (or just let the underlying script fail naturally and surface its error — your call, but pick one so behavior is predictable).
6. **Clean** — delegates to the shared clean routine (§1.4) with a fixed target list of **cache-only** directories: `.nuxt`, `.output`, `.cache`. No confirmation required (non-destructive to source/deps).
7. **Empty** — delegates to the shared clean routine with the **full** target list: everything `Clean` removes, plus `node_modules`, `dist`, and all recognized lockfiles (`pnpm-lock.yaml`, `yarn.lock`, `package-lock.json`, `bun.lockb`). **Requires explicit confirmation** (default `false`), with prompt copy that names what's being deleted, since this is materially more destructive than existing `manageEnv` clean behavior.
8. **Reinitialise** — runs `Empty` → `Initialise` (specifically the `pnpm install` portion, not necessarily re-running the `.env`/VS Code steps if they'd just be no-ops on a still-existing repo) → `Build`, in sequence, aborting the chain if any step fails.
9. **(Fallback) Generic script runner** — today's existing behavior (list all `package.json` scripts, let the user pick or pass one positionally) remains available for anything not covered by 1–8.

**Consumes:** `processService` (script execution, replacing raw `execSync` — see §8), `fileService` (`.env` copy, VS Code settings write), shared clean/install routine from §1.4, `loggerService`.

**Side Effects:** Runs arbitrary `package.json` scripts (inherits stdio); deletes directories/files (Clean/Empty); writes `.env` and `.vscode/settings.json` (Initialise).

**Error Handling:** Non-zero script exit → the existing `Script "${name}" failed execution.` pattern, applied uniformly to all named presets, not just the generic runner. `Empty`/`Reinitialise` failures mid-chain must stop the chain and report which step failed — don't silently continue to `Build` after a failed `Initialise`.

**Relationship to Other Commands:** Supersedes the "provision an existing checkout" half of the old `setupApp.ts` spec (folded into `Initialise`, §1.5). Shares deletion/install mechanics with `nuxt.manageEnv` (§1.4) — implement that shared code once.

---

### 2.2 `app.setup` — Create New Application

**File:** `app/commands/app/setupApp.ts`
**Status:** Redefined scope — this is now the "nuxi create, but for your layered architecture" scaffolder (§1.5), not the legacy checkout-provisioning behavior.

**Purpose:** Generate a brand-new, empty-directory Nuxt 4 **root** project pre-configured for your layer-based monorepo architecture — the thing you'd run once, at the very start of a new product, before any layers exist.

**CLI Usage:**
```
am app setup                       # interactive: prompts for project name/location
am app setup my-new-app --path ./  # headless
```

**Options:**
| Flag | Meaning |
|---|---|
| `--path <dir>` | target directory to create the project in (default: cwd) |
| `--name <name>` | project name, used in `package.json` and generated docs |
| `--git` | initialize a git repository in the new project (default: true) |
| `--install` | run `pnpm install` immediately after scaffolding (default: prompt) |

**Preconditions:** Target directory must not already contain a `package.json` (refuse to scaffold over an existing project — direct the user to `app.run` → `Initialise` instead if one exists).

**Behavior:**
1. Resolve project name/path (options or interactive prompts).
2. Create the target directory if it doesn't exist.
3. Generate the root project file set using the **already-implemented `root` mode** of the project templates: `packageJsonTemplate` (root mode), `tsconfigTemplate` (root mode), `nuxtConfigTemplate`, `rootConfigTemplate`, `gitignoreTemplate` ("Fortress" profile), `pnpmWorkspaceTemplate` (currently a stub — needs implementing, see §8), plus `.env` (via the currently-stub `envTemplate`, also needs implementing), `.editorconfig` (stub), `.npmrc` (stub), `.nuxtrc` (stub).
4. Create an empty `layers/` directory (so `git.initLayers`/`nuxt.createLayer` have somewhere to work later) and a `.gitmodules` placeholder (via the currently-stub `gitmodulesTemplate`) if `--git` is set.
5. If `--git`, call `githubService.initRepo()` (already implemented) to initialize the repo and make an initial commit of the scaffolded files.
6. If `--install` (or confirmed interactively), run `pnpm install` via `processService`.
7. Print a "what's next" summary pointing at `nuxt.createLayer` for adding the first layer.

**Consumes:** `fileService`, the **project-mode** template set (§8 lists which are currently stubs that block this command), `githubService.initRepo()`, `processService`.

**Side Effects:** Creates a new directory tree; optionally initializes git and makes a commit; optionally installs dependencies.

**Error Handling:** Refuse and exit cleanly if the target already has a `package.json`. Directory-creation/write failures should abort the whole scaffold rather than leaving a half-written project — consider writing to a temp location and moving into place atomically, or at minimum clearly reporting exactly which files were and weren't written if a failure occurs partway through.

**Open Questions:**
- Should `app.setup` also prompt to create the *first* layer immediately (chaining into `nuxt.createLayer`), or should that always be a separate, deliberate follow-up command? Recommend: separate follow-up, keep `app.setup` focused on the root shell only.

**Relationship to Other Commands:** Natural precursor to `nuxt.createLayer`. Does **not** cover the old "provision an existing checkout" use case — that's now `app.run` → `Initialise` (§2.1).

---

## 3. Docs Domain

### 3.1 `docs.run` — Run Documentation Tooling

**File:** `app/commands/docs/runDocs.ts`
**Status:** New build, following the existing legacy spec closely (no scope changes requested).

**Purpose:** Interactive orchestrator for *running* documentation tooling (VitePress dev/build/preview) — for both the App Manager tool's own docs and, if detected, the target project's docs. Distinct from `nuxt.extractDocs`, which *generates* documentation content rather than serving/building it.

**CLI Usage:**
```
am docs run                      # interactive menu only — no headless mode specified in legacy spec
```

**Preconditions:** None — always available, but menu contents adapt based on whether VitePress is found in the target project's `package.json`.

**Behavior:**
1. Detect package manager for both `toolRoot` and `targetRoot` independently (lockfile-priority check — see §8 for the shared-helper note).
2. Inspect `targetRoot/package.json` dependencies/devDependencies for `vitepress`.
3. Build a menu: always show "Start App Manager Docs" (tool root); if VitePress detected in target, also show "Start/Build/Preview Project Docs"; always show "Go Back".
4. On selection, run the corresponding `vitepress <dev|build|preview>` command in the correct root, via `npx` if the resolved PM is npm, or the direct binary otherwise.

**Consumes:** `processService` (should replace the legacy spec's raw `child_process.spawn` usage), shared package-manager-detection helper (§8).

**Side Effects:** Spawns a long-running dev server (`dev`) or a one-shot build/preview process; no file mutations beyond what VitePress itself produces.

**Error Handling:** Non-zero exit or spawn error → catch and log via `loggerService`, without a stack trace dump (per the legacy spec's existing behavior of message-only logging — worth deciding if that's still desired or if verbose mode should show more).

**Relationship to Other Commands:** Complements `nuxt.extractDocs` (which produces the Markdown content this command would then let you preview/build/serve).

---

## 4. Git Domain

### 4.1 `git.sync` — Sync Orchestrator

**File:** `app/commands/git/syncCommand.ts`
**Status:** Rebuilt as the scope-resolving orchestrator per §1.1 (Scoped Sync).

**Purpose:** Entry point for all sync operations. Determines *what* should be synced (root only, current directory only, everything, or a user-picked subset) and dispatches to `syncReposAll`/`syncRepo`.

**CLI Usage:**
```
am git sync                 # interactive: prompts for scope if ambiguous
am git sync --all           # headless: full sync (root + all submodules)
am git sync --root-only     # headless: root repo only, skip submodules
am git sync --force         # headless flag, retained from current implementation (raw stdio, no spinner UI)
```

**Options:**
| Flag | Meaning |
|---|---|
| `--all` | Global scope: root + recursive submodule update |
| `--root-only` | Root repo only |
| `--current` | Local scope: sync only the repo at `cwd` (root or a specific layer, whichever applies) |
| `--force` | headless mode — raw stdio streaming, no spinner/intro/outro |

**Preconditions:** `githubService.getStatus(targetRoot)` resolves with a defined branch (existing check).

**Behavior:**
1. Determine context: is `cwd` the monorepo root, or inside a layer? (needs a new `githubService`/`fileService` helper — see §8.)
2. Resolve scope from flags if provided; otherwise, if at root, prompt the "Full Sync / Root Only / Select Specific Layers..." menu from the dev-proposal doc; if inside a layer, default straight to Local scope without prompting (least-surprise: a `sync` run from inside a layer should sync that layer, not silently do something global).
3. Dispatch: Global → `syncReposAll`; Root Only or Local → `syncRepo` against the resolved target; Selective → `syncRepo` looped over the user's multi-selected layers.
4. Wrap dispatch in the existing headless/interactive UI split (`--force` → raw output, no spinner; else → spinner-wrapped, silent git stdio).

**Consumes:** `syncRepo`, `syncReposAll`, `githubService`, `loggerService`.

**Side Effects:** None directly — all mutation happens in the dispatched workers.

**Error Handling:** Propagate/log per the existing pattern; the orchestrator itself shouldn't swallow errors from its workers differently than the workers already do.

**Open Questions:** Confirm the "Monorepo Drift" risk noted in the original dev-proposal doc is an acceptable tradeoff for you — Local/Selective scopes mean a layer can end up ahead of what the root's submodule pointer expects. Recommend the interactive menu surface a one-line warning about this when Local/Selective is chosen, not just silently allow it.

**Relationship to Other Commands:** Orchestrates `syncRepo` (§4.2) and `syncReposAll` (§4.3).

---

### 4.2 `git.syncRepo` — Sync Single Repository (Local Scope)

**File:** `app/commands/git/syncRepo.ts`
**Status:** New build — the "Local" scope worker from the Scoped Sync split.

**Purpose:** Pull the latest changes for exactly one repository — whichever one `cwd` (or an explicit path) resolves to — without touching submodules. This is the piece that doesn't exist in any prior version of the codebase; today's `syncCommand` only knows how to do the full recursive sync.

**CLI Usage:** Not directly user-facing as a headless command — invoked internally by `git.sync`. (Decide whether to also expose it directly, e.g. `am git sync-repo`, for scripting convenience; not required by anything you've described.)

**Behavior:**
1. Resolve target path (defaults to `cwd`).
2. Run a plain `git pull` against that path only via `githubService` — this needs a new, narrower method (see §8: `githubService.pull(cwd, silent)`, distinct from the existing `syncRepo(cwd, silent)` which already does the full root+submodule sequence and would need renaming/splitting to avoid a naming collision with this new file).
3. Report success/failure for that one repo.

**Consumes:** New `githubService.pull()` method (§8).

**Side Effects:** `git pull` on one directory.

**Error Handling:** Standard catch/log; propagate failure up to the `git.sync` orchestrator so it can decide whether to continue (if called in a Selective-scope loop) or abort.

**Relationship to Other Commands:** Building block for `git.sync` (§4.1); also the natural per-item worker inside a future Selective-scope loop.

---

### 4.3 `git.syncReposAll` — Sync Root + All Submodules (Global Scope)

**File:** `app/commands/git/syncReposAll.ts`
**Status:** This is what today's `syncCommand`/`githubService.syncRepo()` already implements — renamed/relocated to its own file as the Global-scope worker, so `syncCommand.ts` itself becomes purely the orchestrator.

**Purpose:** The "deep sync" — pull the root repo, then `git submodule update --init --recursive`. Exactly current behavior, just no longer conflated with the orchestration/scope-selection logic.

**Behavior:** Unchanged from today's implementation: `githubService.syncRepo(targetRoot, silent)` → root pull → submodule update, with headless (raw stdio) vs. interactive (silent + spinner) modes preserved exactly as they work today.

**Consumes:** `githubService.syncRepo()` (existing method, unchanged).

**Relationship to Other Commands:** Dispatched to by `git.sync` (§4.1) when Global scope is selected. This is functionally identical to what exists today — the only change is that it's no longer the *only* option, and it's invoked rather than being the command itself.

---

### 4.4 `git.commit` — Smart Commit (AI)

**File:** `app/commands/git/commitCommand.ts`
**Status:** Extends current implementation with the useful parts of `manageCommits` absorbed in (§1.3). `manageCommits.ts` is retired — do not build it separately.

**Purpose:** Stage, generate a message for (optionally via AI), and create a git commit — a single, well-featured commit workflow rather than two competing ones.

**CLI Usage:** Unchanged from today: `am git commit`, `am git commit -m "message"`.

**Behavior (extends existing 3-phase flow):**
1. **Status & Staging** — unchanged: clean → exit; dirty & unstaged → confirm-then-stage-all.
2. **Message generation** — extended:
   - `options.message` still short-circuits everything.
   - AI path: retrieve staged diff → **sanitize/truncate to a fixed character budget before sending to the LLM** (absorbed from `manageCommits` — this protects against oversized diffs blowing context/cost; needs a small `llmService.sanitizeContext()` or equivalent helper, currently not confirmed to exist — see §8).
   - Review step: **allow inline editing** of the AI-generated message rather than only accept/reject (absorbed from `manageCommits` — present the generated text pre-filled in a `p.text()` prompt so the user can tweak rather than fully rewrite).
   - Manual fallback: unchanged.
3. **Execution** — unchanged: `githubService.createCommit()`.

**Consumes:** `githubService`, `llmService` (extended with a diff-sanitization helper if one doesn't already exist).

**Error Handling:** Unchanged pattern — AI failures fall back to manual, never crash the flow.

**Open Questions:** Do you want the multi-LLM-provider selection menu from `manageCommits` (`options.availableLLMs`), or is single-provider (current `llmService` behavior) sufficient? Not built into this spec since you haven't indicated a need for multiple providers — flag if that changes.

**Relationship to Other Commands:** Fully replaces `manageCommits.ts` — do not implement that file.

---

### 4.5 `git.push` — Push to Remote(s)

**File:** `app/commands/git/pushCommand.ts`
**Status:** Unchanged from current implementation; absorbs `pushToRemote.ts` per §1.2 (do not build that file separately).

**Purpose:** Push the current branch to one or more selected remotes.

**Behavior:** Exactly as currently implemented — fetch remotes, multiselect (or `--remote` flag), resolve branch, push to each selected remote with per-remote error isolation. No changes requested.

**Relationship to Other Commands:** Supersedes `pushToRemote.ts`. Distinct from `pushAll` (§4.6), which operates across the whole monorepo rather than one repo's remotes.

---

### 4.6 `git.pushAll` — Mass Push (Monorepo-Wide)

**File:** `app/commands/git/pushAll.ts`
**Status:** New build, following the existing legacy spec closely.

**Purpose:** Scan the root repo **and** every layer under `layers/` for unpushed local commits, report them, and push all in one confirmed batch.

**CLI Usage:**
```
am git pushAll
```

**Behavior:**
1. **Discovery:** check root's `git status().ahead`; scan `layers/*`, checking each for `.git` presence and `ahead` count via a shared helper (`getRepoStatus(repoPath, name)` — returns a `RepoStatus` or `null`, swallowing errors from non-repo directories).
2. **Report:** if nothing is ahead, log success and exit. Otherwise list each ahead repo with commit count and branch.
3. **Confirm**, then push each in the queue independently with **per-repo error isolation** (one failure doesn't stop the batch).
4. **Summary:** report successes and failures separately.

**Consumes:** `githubService` (needs a `status`/`ahead`-count method usable per-directory — confirm this exists or extend `getStatus()` to expose `ahead`), `fileService` for directory scanning.

**Side Effects:** Pushes to remote for potentially many repositories in one run.

**Error Handling:** Per-repo isolation is the core requirement here — a network blip on layer 3 of 10 must not prevent layers 4–10 from being attempted.

**Relationship to Other Commands:** Complements `git.push` (§4.5) — that command pushes *one* repo to *multiple remotes*; this command pushes *multiple repos* to their respective single upstream.

---

### 4.7 `git.addSubmodules` — Link Untracked Layers as Submodules

**File:** `app/commands/git/addSubmodules.ts`
**Status:** New build, following the existing legacy spec closely. **Also now the mechanism that fulfills the "extend a layer" workflow from `nuxt.createLayer` — see §5.1.**

**Purpose:** Scan `layers/` for local git repositories that exist on disk but aren't yet tracked as submodules of the root, and convert eligible ones into real `git submodule add` entries.

**CLI Usage:**
```
am git addSubmodules
```

**Behavior:**
1. Validate root is a repo and `layers/` exists.
2. Build the "already tracked" set via `git ls-files --stage`.
3. Scan `layers/` subdirectories: must be a git repo, must not already be tracked, must have an `origin` remote (hard requirement for `submodule add`) — skip/warn on any that fail the `origin` check.
4. `multiselect` UI over eligible candidates (`LayerName (RemoteURL)`).
5. For each selected, `githubService.addSubmodule()` (**already implemented** — confirm its exact signature matches what's needed here) against the root.
6. Remind the user to commit the resulting `.gitmodules`/root changes.

**Consumes:** `githubService.addSubmodule()` (existing), `fileService` for directory scanning.

**Relationship to Other Commands:** This is the command that completes the loop described in §5.1 — a standalone layer created by `nuxt.createLayer` gets pulled into a consuming app's monorepo via this command, not via a separate "extend" command.

---

### 4.8 `git.initLayers` — Initialize Git in Uninitialized Layers

**File:** `app/commands/git/initLayers.ts`
**Status:** New build, following the existing legacy spec closely.

**Purpose:** Scan `layers/` for subdirectories lacking a `.git` folder and run `git init` in each — for layers that were created as plain folders rather than via `nuxt.createLayer` (which, per §5.1, now creates its own repo automatically, making this command's role narrower than originally scoped but still needed for manually-added or legacy layer folders).

**Behavior:** Unchanged from legacy spec — validate `layers/` exists, scan for `.git`-less candidates, confirm (or `--force` to skip), loop `githubService.initRepo()` per candidate with per-item error isolation.

**Consumes:** `githubService.initRepo()` (existing method — this command becomes a much thinner wrapper than the legacy spec assumed, since `initRepo` already handles default branch naming and git config).

**Relationship to Other Commands:** Narrower in scope now that `nuxt.createLayer` self-initializes new layers (§5.1) — this command exists for the "layer folder appeared without going through `createLayer`" case (manual copy, extracted from an old monolith, etc.).

---

### 4.9 `git.deleteRemoteRepos` — Delete Remote Repository

**File:** `app/commands/git/deleteRemoteRepos.ts`
**Status:** New build, following the existing legacy spec, with one correction: **do not hardcode a personal GitHub org fallback** (flagged in the architectural appraisal). Use `configService`'s already-planned git-identity resolution instead.

**Purpose:** Permanently delete a remote GitHub repository, gated behind a hard confirmation.

**CLI Usage:**
```
am git deleteRemoteRepos --repo owner/name --confirm DELETE   # headless
am git deleteRemoteRepos                                       # interactive
```

**Behavior:**
1. Resolve target: `--repo` (parsed `owner/name` or bare `name`, defaulting the owner to the **current git user/org resolved via `configService`**, not a hardcoded string) or an interactive `select` over `githubService.listRemoteRepos()` (**already implemented**).
2. Require the literal string `DELETE` typed by the user (or `--confirm DELETE` headlessly) before proceeding.
3. Call `githubService.deleteRemoteRepo(owner, repo)` (**already implemented**).

**Consumes:** `githubService.listRemoteRepos()`, `githubService.deleteRemoteRepo()` (both existing), `configService` for identity resolution.

**Error Handling:** Mismatched confirmation → warn and abort without calling the API. API failure → catch and log.

**Relationship to Other Commands:** None of the "dangerous" flag needs extra machinery beyond what already exists in `githubService` — this is close to a pure wiring exercise.

---

## 5. Nuxt Domain

### 5.1 `nuxt.createLayer` — Create New Nuxt Layer (Standalone Project)

**File:** `app/commands/nuxt/createLayer.ts`
**Status:** Substantially re-scoped from the legacy spec per your description. This is the most significant change in this whole document.

**Purpose:** Scaffold a new Nuxt 4 layer as a **fully standalone, independently developable Nuxt 4 project with its own git repository** — not just a folder of config files dropped into the parent monorepo's `layers/` directory. The layer must be usable and testable entirely on its own, before it's ever linked into a consuming application.

**CLI Usage:**
```
am nuxt createLayer                          # interactive
am nuxt createLayer my-layer --purpose "..." # headless
```

**Options:**
| Flag | Meaning |
|---|---|
| `--path <dir>` | where to create the standalone project (default: prompt; **not** automatically inside the current monorepo's `layers/` — see behavior below) |
| `--purpose <text>` | short description, used in AI-generated README/JSDoc content |
| `--remote` | create a remote GitHub repository and push immediately (default: prompt) |
| `--remote-name <name>` | override the remote repo name (default: layer name) |

**Preconditions:** None at the command level — this command explicitly should **not** require running from inside an existing monorepo, since the whole point is standalone development.

**Behavior:**
1. Resolve layer name and purpose (options or interactive prompts, same normalization as the legacy spec — trim/lowercase).
2. Resolve target path: **prompt for a location outside the current project** if run from inside a monorepo (default suggestion: a sibling directory, e.g. `../<layer-name>`), or accept `--path` directly. Refuse if the target already exists and is non-empty.
3. **Scaffold a genuine standalone Nuxt 4 project** at that path, not just the current layer-mode file set. This means going beyond the currently-implemented `layer/` template set (`packageJsonTemplate`, `tsconfigTemplate`, `gitignoreTemplate`, `nuxtConfigTemplate` — all already support a `'layer'` mode) to also include enough of the **project-mode** scaffolding for the layer to run independently: its own `vitestConfigTemplate`/`vitestSetupTemplate` (currently stubs, needed here), its own `.editorconfig`/`.npmrc`/`.nuxtrc` if you want full parity with a "real" project, and critically **a runnable dev server** — meaning `package.json` here needs `nuxt` itself as a dependency (not just as a peer/layer dependency), which is a different `package.json` shape than the current `'layer'` mode template produces (that mode is designed to be *consumed by* a root project, not run standalone).
4. AI-generate `README.md` content and JSDoc description via `llmService`, same fallback-on-failure behavior as the legacy spec.
5. **Initialize git:** `githubService.initRepo({ cwd: targetPath, userName, userEmail })` (existing method) — make an initial commit of the scaffolded files.
6. **If `--remote` (or confirmed interactively):** create a remote repository and push. **This requires a new `githubService.createRepo()` method that does not currently exist** (see §8) — calling the GitHub API to create an empty remote repo under the resolved owner, then `git remote add origin <url>` + `githubService.push()`.
7. Report the standalone project's path (and remote URL, if created) back to the user, along with a pointer to `git.addSubmodules` for when they're ready to consume it from an actual application.
8. Run `pnpm install` in the new standalone project (prompt or `--install` flag, consistent with `app.setup`'s pattern).

**Consumes:** Layer-mode templates (existing) **extended with enough project-mode scaffolding to be independently runnable** (§8 lists exactly which currently-stub templates block this), `llmService`, `githubService.initRepo()` (existing) + `githubService.createRepo()` (**new — see §8**), `githubService.push()` (existing), `processService` for install.

**Side Effects:** Creates an entirely new directory tree and git repository, potentially outside the current project entirely; optionally creates a remote GitHub repository and pushes to it.

**Error Handling:** Same fallback-on-AI-failure pattern as the legacy spec. Remote creation failure should not roll back the already-successful local scaffold/init — report the local repo as usable and the remote step as failed separately, so the user isn't left with nothing after a network blip.

**Open Question — what does "extend that layer as development continues" mean?**

You described wanting to "extend that layer as development continues," distinct from creating it. I can see two genuinely different things you might mean, and the command design differs depending on which:

- **(A) "Extend" = bring an existing standalone layer into a consuming application.** In this reading, no new command is needed at all — this is exactly what `git.addSubmodules` (§4.7) already does: point it at a consuming app's monorepo, and it discovers the standalone layer (once cloned or placed under that app's `layers/` directory) and links it as a submodule. **This is the interpretation this spec assumes**, since it requires no new machinery beyond what's already planned.
- **(B) "Extend" = continue adding features to the standalone layer itself, independent of any consuming app.** If this is what you meant, then no special App Manager command is needed at all — it's just normal development in a normal git repo (`git.commit`, `git.push`, `app.run` → `dev`, all already work against any project, standalone or not, since none of those commands assume they're running inside a monorepo).

**Please confirm which of these (or if it's genuinely a third thing) before this command is built** — interpretation (A) means `createLayer`'s job ends at "produce a working standalone repo," with everything else handled by existing commands; interpretation (B) means the same thing, just with no linking step ever required if a layer stays standalone forever. Either way, **no new "extend" command appears to be needed** — but confirm that's actually true for your workflow before treating this as settled.

**Relationship to Other Commands:** Precursor to `git.addSubmodules` (§4.7) for linking into a consumer. Overlaps conceptually with `app.setup` (§2.2) in that both scaffold a new standalone Nuxt project from templates — worth checking during implementation whether they can share a common "scaffold a runnable Nuxt project at path X" helper rather than duplicating that logic, given how similar steps 3–4 and 8 here are to `app.setup`'s steps 3 and 6.

---

### 5.2 `nuxt.addFile` — Add Optional Project File

**File:** `app/commands/nuxt/addFile.ts` *(new file, not on your original list — added to cover the capability you described)*
**Status:** New command, new template category.

**Purpose:** Add a named, optional configuration file (deployment configs, CI configs, etc. — e.g. `netlify.toml`) to an existing project or layer, on demand, at any point after creation. This is deliberately generic rather than "a netlify command" — the goal is a small, extensible registry of file templates, of which `netlify.toml` is the first entry.

**CLI Usage:**
```
am nuxt addFile netlify.toml         # headless: add a specific known file by name
am nuxt addFile                      # interactive: pick from available file templates
```

**Options:**
| Flag | Meaning |
|---|---|
| `--force` | overwrite if the file already exists (default: refuse and warn) |

**Behavior:**
1. Load a registry of available "addable files" — each entry maps a display name / filename to a template generator function and a short description (e.g. `netlify.toml` → "Netlify deployment config for static/SSR hosting").
2. If a name is given headlessly, look it up directly; if not found, list available options and exit. If interactive, present a `select` menu built from the registry.
3. Check if the target file already exists in `targetRoot`; refuse unless `--force`.
4. Generate content via the matched template function and write it.
5. Log success, and where relevant, a short note on next steps (e.g. for `netlify.toml`, a reminder to set the build command/publish directory if the template can't infer them).

**Consumes:** A **new template category** under `app/templates/` — e.g. `app/templates/deployment/netlifyTomlTemplate.ts` — following the exact same "pure function returning a string" pattern as every other template. `fileService` for the existence check and write.

**Side Effects:** Writes one new file to the project root (or wherever the registry entry specifies — not every addable file is necessarily a root-level file).

**Error Handling:** Existing-file collision without `--force` → warn and abort, don't silently overwrite.

**Open Questions:**
- What's the initial registry beyond `netlify.toml`? Worth deciding up front so the registry/dispatch mechanism is built to the right shape (e.g. do you also want `vercel.json`, a `Dockerfile`, GitHub Actions workflow files? Each is the same pattern, just a different template function — cheap to add once the mechanism exists, but useful to know the intended range before the registry's data shape is finalized).
- Does this ever need to target a *specific layer* rather than always the current `targetRoot`? Your original mention didn't specify, but if `netlify.toml`-style files are sometimes layer-specific (e.g. each layer deploys independently as its own preview site, consistent with the standalone-layer model in §5.1), the command needs a `--target <layer-name>` option and layer-resolution logic. Recommend confirming before building, since it affects the command's argument shape.

**Relationship to Other Commands:** Independent of everything else — a pure, additive scaffolding utility. Natural companion to `nuxt.createLayer` (§5.1) if layers do end up needing their own deployment configs per the open question above.

---

### 5.3 `nuxt.extractDocs` — Generate Layer Documentation Report

**File:** `app/commands/nuxt/extractDocs.ts`
**Status:** New build, following the existing legacy spec, with a recommended implementation change.

**Purpose:** Scan `layers/`, aggregate selected file types, and produce a consolidated Markdown documentation report — AI-summarizing source files along the way.

**CLI Usage:**
```
am nuxt extractDocs
```

**Behavior:** Unchanged in outward behavior from the legacy spec: validate `layers/` exists, `multiselect` for which file patterns to include, scan/process/dedupe files per layer in parallel, assemble a Markdown report with a table of contents, write to `docs/reports/layer-report-<timestamp>.md`.

**Recommended implementation change:** the legacy spec's own `scanFiles`/`processFile` helpers duplicate what `codeService.inspect()` + the Strategies layer already do generically per file type. **Build this command against `codeService` instead of reimplementing file-type dispatch from scratch** — call `codeService.inspect(filePath)` to get documentable blocks per file, and reuse `getStrategyForFile()`'s extension-based dispatch rather than this command's own type-checking `if` chain. This is a direct instance of the "use the stack you already built" recommendation from the architectural appraisal, and this command is one of the best candidates to prove that stack out end-to-end.

**Consumes:** `codeService` (recommended, replacing bespoke logic), `llmService` (for the per-file AI summary), `fileService`.

**Side Effects:** Writes one new Markdown report file per run.

**Relationship to Other Commands:** First recommended real consumer of the Strategies/`codeService` stack (Part II of the architecture document) — building this one against the existing infrastructure rather than around it would validate that the stack actually works before `utils.autoDoc`/`utils.validateHeaders` (which need it even more directly) get built.

---

### 5.4 `nuxt.manageEnv` — Manage Environment (Clean / Reinstall)

**File:** `app/commands/nuxt/manageEnv.ts`
**Status:** New build, scope clarified against `app.run`'s new Clean/Empty/Reinitialise actions (§1.4).

**Purpose:** Own the actual mechanics of cleaning build artifacts and reinstalling dependencies — consumed both directly (interactive menu: Clean / Reinstall / Reset / Back) and indirectly by `app.run`'s lifecycle presets.

**CLI Usage:**
```
am nuxt manageEnv                    # interactive menu
am nuxt manageEnv --clean            # headless
am nuxt manageEnv --reinstall        # headless
```

**Behavior:** Unchanged from the legacy spec's core mechanics (`executeClean(targetRoot, dirs)`, `executeInstall(targetRoot)`), but these two functions should now be **exported and reused by `app.run`** (§2.1) rather than being private to this file, per the consolidation decision in §1.4.

**Consumes:** `processService` (package manager detection + install execution), `fileService`/`fs` for deletion.

**Relationship to Other Commands:** Shares its core deletion/install logic with `app.run`'s Clean/Empty/Reinitialise presets (§2.1) — implement once, export from here, import there.

---

## 6. Quality Domain

### 6.1 `quality.run` — Run Quality Checks

**File:** `app/commands/quality/runQuality.ts`
**Status:** New build, following the existing legacy spec closely.

**Purpose:** Dynamically detect available quality scripts (lint/test/typecheck) and Vitest presence in a target project (or the tool itself), and offer an interactive menu to run them.

**CLI Usage:**
```
am quality run
```

**Behavior:** Unchanged from legacy spec — prompt for scope (`target`/`tool`), detect package manager, inspect `package.json` scripts + `vitest` dependency, build a dynamic menu, execute the chosen script.

**Consumes:** `processService` (should replace the legacy spec's raw `spawn` usage — see §8), shared package-manager-detection helper (see §8, same duplication issue as `docs.run`).

**Relationship to Other Commands:** Shares its `detectPM`/script-execution pattern with `docs.run` (§3.1) — both should be built against the same extracted helper rather than each hand-rolling it again.

---

## 7. Utils Domain

### 7.1 `utils.addContributor` — Add Contributor to `package.json`

**File:** `app/commands/utils/addContributor.ts`
**Status:** New build, following the existing legacy spec closely.

**Purpose:** Add a `{ name, email, url }` entry to the `contributors` array in `package.json`.

**Behavior:** Unchanged from legacy spec — validate `package.json` exists, resolve name/email/url from options or prompts (with the headless-heuristic that skips the URL prompt if name+email were both supplied via flags), duplicate-check by email, write back.

**Recommended implementation change:** use `fileService`'s JSONC-aware read/write (already implemented, non-destructive) rather than raw `JSON.parse`/`fs.writeFileSync`, so existing formatting/comments in `package.json` survive the edit. This directly fixes the "implicit `any`" type-safety gap the legacy spec flagged, since `fileService`'s smart-read returns schema-enforced types rather than raw `JSON.parse` output.

**Consumes:** `fileService` (recommended), `loggerService` (replacing the legacy spec's mixed `console.log`/`logger` usage — pick one, use `loggerService` throughout).

---

### 7.2 `utils.autoDoc` — Auto-Generate Missing JSDoc

**File:** `app/commands/utils/autoDoc.ts`
**Status:** New build — **strongly recommend building this against `codeService` rather than the legacy spec's bespoke TS-only regex walk.**

**Purpose:** Find undocumented exports across the codebase and use the LLM to generate and inject JSDoc comments.

**Recommended behavior (revised from legacy spec):**
1. Walk the target tree (existing `walk()` helper pattern is fine to keep for file discovery, or use `fileService` directory listing).
2. For each file, resolve its strategy via `getStrategyForFile()` and call `codeService.inspect(filePath)` to get documentable blocks — **this replaces the legacy spec's TS-specific regex/`isDocumented()` logic entirely**, and gets CSS/HTML/JSON/Vue support "for free" since every strategy already implements `findDocumentableBlocks()`.
3. Confirm with the user before proceeding, same as legacy spec.
4. For each undocumented block, call `codeService.generateDocFor(filePath, blockName)` — **this single existing method already does the LLM-prompt-construction, generation, and injection** that the legacy spec describes building from scratch, including the bottom-up-injection-order concern (verify `codeService`/the relevant strategy's `injectFunctionDoc` handles multiple injections per file safely — if it doesn't yet, that's a small fix inside `codeService`, not a reason to reimplement injection ordering here).
5. Guard the final write step with a try/catch — the legacy spec explicitly flagged this as unguarded; fix it here rather than carrying the bug forward.

**Consumes:** `codeService` (primary consumer role — see Part II of the architecture doc; this is the #1 candidate to prove that layer works end to end), `fileService`.

**Relationship to Other Commands:** Alongside `nuxt.extractDocs` (§5.3), this is where the "built but unconsumed" Strategies stack should get its first real caller.

---

### 7.3 `utils.autoVersion` — Auto-Increment File Versions

**File:** `app/commands/utils/autoVersion.ts`
**Status:** New build, following the legacy spec's semantics, with a recommended reuse of existing strategy logic.

**Purpose:** Analyze git diffs on modified `.ts`/`.vue` files, use the LLM to determine a Major/Minor/Patch increment, and update each file's `@version` header tag and revision-history block.

**Behavior:** Unchanged core semantics from legacy spec — find modified files via git diff, confirm with user, per file: verify `@version`/`@notes` tags exist (skip if not), get the file's diff, ask the LLM for `{ increment, note }` (default to Patch on AI failure), compute new version, update header + append history entry, write back.

**Recommended implementation change:** use `TypescriptStrategy.parseMetadata()` (**already implemented**) to read the current `@version`/`@author` values instead of the legacy spec's own bespoke regex — this is exactly the method that already exists for this purpose.

**Fix carried over from the appraisal:** guard the final `fs.writeFileSync`/`fileService.write()` call in a try/catch — this was explicitly flagged as unguarded in the legacy spec and should not be carried forward as-is.

**Consumes:** `githubService` (diff retrieval), `TypescriptStrategy.parseMetadata()` (recommended), `llmService`, `fileService`.

---

### 7.4 `utils.cleanLogs` — Clean Test Artifacts

**File:** `app/commands/utils/cleanLogs.ts`
**Status:** New build, following the existing legacy spec closely — no scope changes requested.

**Purpose:** Delete temporary test-run artifacts: log files under `app_manager/logs/test/` and mock fixture directories (`mock-*` prefix) under `tests/fixtures/`.

**Behavior:** Unchanged from legacy spec — scan both target paths, skip cleanly if either doesn't exist, exit silently with no prompt if nothing found, otherwise display counts and require confirmation (default `false`) before deleting.

**Recommended implementation change:** the legacy spec hardcodes both target paths. Consider making these configurable (via `configService`) rather than baked in, especially since `app.run`'s new `Empty` action (§2.1) needs a *different*, larger target list — having both driven by config rather than separate hardcoded lists in two files reduces future drift.

**Consumes:** `fileService`, `configService` (recommended, for configurable target paths).

---

### 7.5 `utils.validateHeaders` — Validate & Fix File Headers

**File:** `app/commands/utils/validateHeaders.ts`
**Status:** New build — **this is the command where the header-mutation philosophy conflict (flagged in the architectural appraisal) must be resolved before writing code, not discovered afterward.**

**Purpose:** Enforce the project's file-header convention (`@project`/`@file`/`@author`/`@version`/`@notes`) and validate `package.json` naming against folder structure, with interactive/AI-assisted repair for mismatches.

**The conflict, restated:** the legacy spec describes **field-level patching** — update just the `@project` tag, just sync `@version` to the latest history entry, append a new `@author` if missing, without touching anything else in the header. The existing, already-implemented `injectHeader()` method on every Strategy does **whole-block replacement** — strip the entire existing header, splice in a completely new one.

**Resolution required before building:** pick one.
- **Option A — Field-level patching (matches legacy spec exactly).** Requires writing new, header-specific regex/patch logic in `validateHeaders.ts` itself, **not** reusing `injectHeader()`. This preserves fields the tool doesn't know about (if you ever add custom tags) but means this command doesn't benefit from the Strategies layer at all for its core operation.
- **Option B — Whole-block replacement via existing `injectHeader()`.** Simpler, reuses existing tested code, but means *every* header field gets regenerated on every run (including `@createDate`/`@createTime`, which are meant to reflect original creation, not last-validated time) — this would need `injectHeader()` extended to accept "preserve these specific fields from the existing header" parameters, which it doesn't currently support.

**Recommendation: Option A**, specifically because `@createDate`/`@createTime` are semantically "when this file was first created" and must never be overwritten by a validation pass — whole-block replacement is fundamentally the wrong operation for this command, regardless of code-reuse convenience. Build `validateHeaders.ts` with its own targeted field-patching logic, and treat `injectHeader()` as reserved for actual "generate this file's header for the first time" scenarios (like `nuxt.createLayer` and `app.setup`'s scaffolding steps).

**Behavior (assuming Option A):**
1. Get current git user via `githubService`/`configService`.
2. Walk the tree; for each `package.json`, validate name against folder-derived expectation; on mismatch, present Auto/Manual/AI/Skip choice (AI path via `llmService`).
3. For every other source file: sync `@project`, sync `@file` path, append missing `@author`, sync `@version` to the latest revision-history entry — **only touching these specific fields**, leaving everything else (including `@createDate`/`@createTime`) untouched.
4. Only write the file if an actual change was detected.
5. Log a summary count.

**Documented, intentional limitation carried forward:** only *existing* `@project` tags get corrected — a file missing the tag entirely does not get one added. Confirm this is still acceptable scope, or decide whether "add missing tags" should be in scope now that you're building this for real rather than speculatively.

**Consumes:** `githubService`/`configService` (git identity), `llmService` (AI-assisted `package.json` naming), `fileService`. Deliberately **not** `injectHeader()` per the resolution above.

---

## 8. New / Extended Infrastructure Required Before These Specs Can Be Fully Implemented

Consolidated from every "Consumes" section above — these are gaps between what these specs need and what currently exists in `app/services` and `app/templates`.

| Gap | Needed by | Notes |
|---|---|---|
| `githubService.createRepo()` | `nuxt.createLayer` (§5.1) | Does not exist yet. `initRepo`, `cloneRepo`, `addSubmodule`, `listRemoteRepos`, `deleteRemoteRepo` all already exist — this is the one missing piece for remote repo creation via the GitHub API. |
| `githubService.pull()` (narrow, single-repo, no submodule step) | `git.syncRepo` (§4.2) | Existing `syncRepo()` method already does root+submodule together and should be relocated/renamed to back `syncReposAll` (§4.3) instead, to free up a plain single-repo `pull()` for the new Local-scope worker. |
| Context detection: "is `cwd` the monorepo root or inside a layer?" | `git.sync` (§4.1) | Not currently exposed by any service — needs a small new helper, likely on `githubService` or `fileService` (e.g. check for a `.gitmodules` file at a resolved root vs. being nested under a `layers/` path). |
| Diff sanitization/truncation helper | `git.commit` (§4.4) | Referenced in the legacy `manageCommits` spec (`llm.sanitizeContext`) — confirm whether `llmService` already does this internally, or add it explicitly. |
| Shared clean/install routine, extracted and exported | `app.run` (§2.1), `nuxt.manageEnv` (§5.4) | Currently would be private to `manageEnv.ts` per the legacy spec — needs exporting so `app.run` can reuse it rather than duplicating deletion logic. |
| Shared `detectPM`/script-execution helper | `docs.run` (§3.1), `quality.run` (§6.1) | Both legacy specs hand-roll an identical `detectPM` + raw `spawn` wrapper — this duplication was flagged in the original architectural appraisal and should be extracted into `processService` once, now that two real commands need it. |
| New template category: deployment/CI file templates | `nuxt.addFile` (§5.2) | New — `netlify.toml` as the first entry in a small, extensible registry. |
| Project-mode template completions: `pnpmWorkspaceTemplate`, `envTemplate`, `editorconfigTemplate`, `npmrcTemplate`, `nuxtrcTemplate`, `gitmodulesTemplate`, `vitestConfigTemplate`, `vitestSetupTemplate` | `app.setup` (§2.2), `nuxt.createLayer`'s standalone-runnability requirement (§5.1) | All currently `TODO` stubs per the Part II architecture audit — both `app.setup` and the extended `nuxt.createLayer` depend on several of these being implemented, not just the already-complete subset (`packageJsonTemplate`, `tsconfigTemplate`, `gitignoreTemplate`, `nuxtConfigTemplate`, `rootConfigTemplate`). |
| `injectHeader()` extended with field-preservation, **or** deliberately not used by `validateHeaders` | `utils.validateHeaders` (§7.5) | Resolved above as: don't extend it, build separate field-level patch logic instead. Listed here as a reminder that this decision has a concrete downstream effect on `injectHeader()`'s future scope — it should remain a "first-time header generation" tool, not grow patch semantics it wasn't designed for. |
| Configurable clean/artifact target paths | `utils.cleanLogs` (§7.4) | Currently hardcoded in the legacy spec; recommended to move to `configService` given `app.run`'s `Empty` action (§2.1) needs an overlapping-but-different target list. |
| Persisted settings layer + LLM fallback resolution chain | `app-config` domain, and every AI-touching command | See §14 in full — this is the single largest new piece of infrastructure in this document, since `configService` currently has zero persistence and `llmService` has no fallback logic beyond a single env-var-driven default. |

---

## 9. Summary Table

| Command | Status | Key Change from Original List |
|---|---|---|
| `app.run` | Major extension | Becomes 9-action lifecycle menu (was: generic script picker only) |
| `app.setup` | Redefined scope | Now "new project scaffolder," not "provision existing checkout" |
| `docs.run` | New build | No scope change |
| `git.sync` | Rebuilt | Becomes scope-resolving orchestrator over `syncRepo`/`syncReposAll` |
| `git.syncRepo` | New build | New Local-scope worker (didn't exist before) |
| `git.syncReposAll` | Relocated | This is today's full-sync logic, unchanged, just renamed/relocated |
| `git.commit` | Extended | Absorbs `manageCommits`'s diff-sanitization + inline-edit |
| `git.manageCommits` | **Retired** | Do not build — fully absorbed into `git.commit` |
| `git.push` | Unchanged | Absorbs `pushToRemote` |
| `git.pushToRemote` | **Retired** | Do not build — fully absorbed into `git.push` |
| `git.pushAll` | New build | No scope change |
| `git.addSubmodules` | New build | Now also the mechanism for "extending" a layer into a consumer app |
| `git.initLayers` | New build | Narrower role now that `createLayer` self-initializes |
| `git.deleteRemoteRepos` | New build | Drop hardcoded org fallback, use `configService` |
| `nuxt.createLayer` | **Major re-scope** | Standalone Nuxt 4 project + own git repo + optional remote |
| `nuxt.addFile` | **New command** | Not on original list — covers the `netlify.toml`-style requirement |
| `nuxt.extractDocs` | New build | Recommended to consume `codeService` instead of bespoke logic |
| `nuxt.manageEnv` | New build | Shares mechanics with `app.run`'s Clean/Empty |
| `quality.run` | New build | No scope change |
| `utils.addContributor` | New build | Recommend `fileService` JSONC read/write over raw `JSON.parse` |
| `utils.autoDoc` | New build | Recommend building against `codeService`, not bespoke TS regex |
| `utils.autoVersion` | New build | Recommend reusing `TypescriptStrategy.parseMetadata()` |
| `utils.cleanLogs` | New build | Recommend configurable paths |
| `utils.validateHeaders` | New build | **Explicit decision needed and made**: field-level patch, not `injectHeader()` |
| `app-config` | **New domain** | Not on original list — two-file (tool + project), section-based persisted settings, replacing several hardcoded values across the app; see §10 |

---

## 10. App-Config Domain — Application & Project Settings

**Status:** New domain, not on your original list — added to cover the settings/configuration requirement discussed separately. This section is genuinely infrastructure-of-infrastructure: several command specs above (§4.4 `git.commit`, §4.9 `git.deleteRemoteRepos`, §5.1 `nuxt.createLayer`, §5.3 `nuxt.extractDocs`, §7.2 `utils.autoDoc`, §7.3 `utils.autoVersion`, §7.5 `utils.validateHeaders`) depend on the resolution mechanism specified here, even though they're numbered earlier in this document.

### 10.1 Confirmed Conceptual Model (Revised: Two Files, One Folder Convention)

*Revised from the original three-file proposal after discussion — see §10.2 for the reasoning.*

- **Tool root** — `<toolRoot>/app-manager/settings.json` (folder renamed from the generic `config/` to `app-manager/`, now also home to `llmRegistry.json` and `repositoryRegistry.json` side by side): holds whoever is operating App Manager's own personal defaults, under a single `app-manager: {}` key. Populated once, used as the fallback baseline for every project subsequently worked on.
- **Project root** — `<targetRoot>/.app-manager/settings.json` (dot-prefixed, since it lives inside someone else's project and shouldn't clutter their visible file listing): holds this specific project's settings, under two keys in the **same file** — `project-shared: {}` and `project-local: {}`.
- Both files share **one schema** with all three top-level keys always present (`app-manager`, `project-shared`, `project-local`) for structural consistency — by convention, the tool file only ever meaningfully populates `app-manager`, and the project file only ever meaningfully populates `project-shared`/`project-local`. This means `app-config`'s code never has to branch on which kind of file it's reading, and leaves room for a genuinely cross-cutting setting later without a schema migration.
- **Resolution precedence** (most specific wins): `project-local` → `project-shared` → `app-manager` (tool) → built-in default → prompt-and-persist (writes to `project-shared` by default; `llm.*` prompts specifically write to `project-local` — see §10.3's table for which settings prompt at all).
- When App Manager is run from inside its own repository (developing the tool itself), `toolRoot` and `targetRoot` are the same directory — no special-casing needed, the resolver just reads both files and they happen to live in the same repo.
- **Headless mode:** if a setting with no safe built-in default is missing everywhere and the session is non-interactive, fail fast with an error naming the exact `app-config set <key> <value>` command needed — never block a CI run waiting on a prompt that can't be answered.

### 10.2 Why Two Files Instead of Three (and Why the Registries Stay Separate)

**On merging `project-shared`/`project-local` into one file:** the original three-file proposal split these to stop a personal preference (e.g. `llm.defaultProvider`) from being forced onto teammates by a commit. On reflection, that protection is already provided by the resolution chain itself, not by file separation — `llmService.resolveActiveProvider()` (§10.8) checks `checkAvailability()` before ever using a configured value, so if one developer commits a provider preference another developer can't satisfy (missing API key), the chain silently skips it and falls through. Nothing in this settings taxonomy is a genuine secret either — API keys were never going to live here regardless (they stay in env vars, referenced by name via `apiKeyEnv`, exactly as `llmRegistry.json` already does it). Given that, splitting the file was solving a problem the availability check already solves. One `settings.json` per root, two named keys inside the project one, is the simpler and equally safe design.

**On merging `llmRegistry.json`/`repositoryRegistry.json` into `settings.json`:** recommended against, and kept as two separate files, deliberately co-located in the same `app-manager/` folder rather than merged into one document. The reasoning: registries and settings are different *kinds* of data, not just different files by convention. Registries are a catalog of integrations — how to technically talk to each provider/host (base URLs, response-mapping paths, timeouts) — and they change when App Manager itself gains or fixes support for a service; both registries already carry their own independent `revisionHistory` tracking exactly that kind of change (e.g. "Added `mapping` field for generic response parsing"). Settings are the values chosen *from* that catalog by a specific user or project, changing on every `app-config set`. Merging them means every preference write touches the same file as the full provider catalog, and blurs a genuinely useful mental model (registry = the menu, settings = what you ordered from it) for no real reduction in duplication — `llm.defaultProvider` is just an id string; it was never going to duplicate the registry's contents either way.

If the underlying goal is "see everything about App Manager's config in one glance," that's solved more directly by extending `app-config list` to *display* registry contents alongside resolved settings (e.g. show each provider's availability next to `llm.defaultProvider`'s resolved value) — a unified view without unified storage. Worth building regardless of the storage question.

### 10.3 Full Settings Scope (everything "clearly in scope" + everything "recommended," confirmed)

| Setting | Safe built-in default? | Prompt-and-persist if unset? | Notes |
|---|---|---|---|
| `author.name` | No | Yes | Fall back through git `user.name` (via `githubService`) *before* prompting — a detected git identity is a better first guess than an empty prompt. Replaces the hardcoded `'Steve R Lewis'` default in `headerTemplate.ts`. |
| `author.email` | No | Yes | Same git-email fallback-before-prompt pattern. |
| `llm.defaultProvider` | No | Yes | Prompt must be a `select` menu built from `llmService.checkAvailability()` + the registry's `label` fields — showing which providers are actually usable right now (have their key env var set), not a blind text input asking the user to recall a provider id from memory. |
| `llm.fallbackProvider` | No | Yes — but only prompted lazily, the first time AI is genuinely needed and the default is unavailable, not proactively during initial setup (plenty of users will never need a fallback). |
| `llm.enabled` | Yes (`true`) | No | Blunt global on/off switch; unset simply means "on." |
| `github.defaultOrg` | No | Yes | Needed by `nuxt.createLayer`'s remote-creation step (§5.1) and `git.deleteRemoteRepos`' owner resolution (§4.9) — replaces the hardcoded `'steve-r-lewis'` fallback flagged in the architectural appraisal. |
| `github.defaultVisibility` | Yes (`private`) | No | Safer default; no reason to force a prompt for this. |
| `github.defaultBranch` | Yes (`'main'`) | No | Matches `githubService.initRepo()`'s existing default parameter exactly — this setting just makes that default overridable without a code change. |

### 10.4 Persisted Settings Schema

New `AppSettingsFileSchema` (Zod), following the exact validation pattern already established by `GitUserConfigSchema`/`AppConfigFlagsSchema` in `configServiceTypes.ts`. The JSON envelope matches the `metadataEntity` format already used by `llmRegistry.json`/`repositoryRegistry.json` — and per `JsonStrategy`'s own docstring, that envelope shape is **already a recognized schema** in this codebase's file-handling layer, so both settings files get CST-preserving surgical edits (comments, formatting, key order all survive a `set`/`unset` call) essentially for free. One schema, one shape, used identically by both files:

```json
// <toolRoot>/app-manager/settings.json
{
  "metadataEntity": {
    "description": "App Manager settings",
    "targetFile": "~/app-manager/settings.json",
    "currentVersion": "1.0.0",
    "createdAt": "...",
    "revisionHistory": [ ... ]
  },
  "app-manager": {
    "author": { "name": null, "email": null },
    "llm": { "defaultProvider": null, "fallbackProvider": null, "enabled": true },
    "github": { "defaultOrg": null, "defaultVisibility": "private", "defaultBranch": "main" }
  },
  "project-shared": {},
  "project-local": {}
}
```

```json
// <targetRoot>/.app-manager/settings.json
{
  "metadataEntity": {
    "description": "App Manager settings",
    "targetFile": "~/.app-manager/settings.json",
    "currentVersion": "1.0.0",
    "createdAt": "...",
    "revisionHistory": [ ... ]
  },
  "app-manager": {},
  "project-shared": {
    "github": { "defaultOrg": null, "defaultVisibility": "private", "defaultBranch": "main" }
  },
  "project-local": {
    "author": { "name": null, "email": null },
    "llm": { "defaultProvider": null, "fallbackProvider": null, "enabled": true }
  }
}
```

By convention, populated sections stay confined to the relevant key for each file's location — `app-config list` (§10.5) can print a soft warning if it ever finds a populated `project-shared`/`project-local` section in the tool-root file, or vice versa, as a lightweight "this looks like it's in the wrong place" hint without hard-enforcing it in the schema itself.

### 10.5 `app-config` Command

**Domain:** `app-config` — top-level, distinct from `app`, since it configures App Manager itself rather than acting on whatever project you're currently standing in.

**CLI Usage:**
```
am app-config                                # interactive: grouped settings menu (Author / LLM / GitHub)
am app-config list                           # headless: print every resolved setting + its source tier
am app-config get <key>                      # e.g. am app-config get llm.defaultProvider
am app-config set <key> <value> [--tool]     # writes to project tier (shared) by default; --tool writes to tool tier
am app-config unset <key> [--tool]           # remove an override at the given tier, fall through to the next
```

**Behavior:**
- `list` / interactive menu: group by category, and for each key show both the effective value **and which tier it resolved from** (tool default / project shared / project personal / built-in / unset) — this "why is it this value" transparency is the main thing that makes a two-tier (or three-file) model usable day to day rather than confusing.
- `get <key>`: same resolution + source reporting, single key.
- `set <key> <value>`: validates against `AppSettingsFileSchema` — `llm.defaultProvider`/`fallbackProvider` must match a real registry id, rejected with a clear message (and, ideally, a "closest match" suggestion) if not. Writes into the project file's `project-shared` section by default; `--tool` writes into the tool file's `app-manager` section instead. No direct flag for writing to `project-local` in v1 — that section is populated only via the automatic prompt-and-persist flow for `llm.*` keys; add an explicit `--personal` flag later if hand-editing it directly turns out to be wanted.
- `unset <key>`: removes the key from the specified section, letting resolution fall through to the next one.

**Consumes:** The `configService` extensions in §10.6, `llmService.checkAvailability()` (existing), `githubService` (git-identity fallback-before-prompt for `author.*`).

### 10.6 `configService` Extensions Required

This is the substantive work — `app-config` the command is a thin UI layer over these:

- **`loadSettings(toolRoot, targetRoot)`** — called once from `index.ts`'s `main()`, immediately after `configService.init(toolRoot)` and before command dispatch. Reads `<toolRoot>/app-manager/settings.json` and `<targetRoot>/.app-manager/settings.json` (whichever exist), validates each against `AppSettingsFileSchema`, merges with the precedence from §10.1, and holds the merged result in memory for the session.
- **`resolve<T>(key): T | undefined`** — pure, synchronous lookup against the already-merged in-memory settings. No I/O, no prompting — this is the first thing the shared resolver helper (§10.7) calls.
- **`setSetting(key, value, section: 'app-manager' | 'project-shared' | 'project-local')`** — writes into the correct file and section (creating the file, and the `app-manager`/`.app-manager` directory, if either doesn't exist yet), re-validates, updates the in-memory merged view. `'app-manager'` always targets the tool-root file; the other two always target the project-root file.
- **`unsetSetting(key, section)`** — inverse of the above.
- **`getSettingSource(key): 'app-manager' | 'project-shared' | 'project-local' | 'default' | 'unset'`** — backs `app-config list`'s "where did this come from" reporting.

### 10.7 Shared Resolver Helper (consumed by every command needing a persisted setting)

A small shared function, not a service — the prompt-and-persist behavior is UI-layer (needs `@clack/prompts`), and `configService` itself should stay UI-agnostic, consistent with every other service in this app:

```
resolveOrPrompt(key, { promptConfig, persistTier }): Promise<T>
```
1. Call `configService.resolve(key)`. If defined, return it.
2. If undefined: check for a built-in default (§10.3 table). If one exists, return it — no prompt, no write.
3. If undefined and no built-in default exists: if headless, throw a clear error naming the exact `app-config set` command to run. If interactive, run the prompt described by `promptConfig` (plain text for `author.*`/`github.defaultOrg`, the `checkAvailability()`-driven select for `llm.*`), call `configService.setSetting(key, answer, persistTier)`, then return the answer.

Every command listed in §10.9 below should call this helper instead of reading `process.env` directly or relying on a hardcoded default in its own code.

### 10.8 LLM Availability & Fallback Chain

Ties back to the "how does the app handle no available LLM" question, made concrete against the real persisted settings rather than left as an unspecified gap:

- **`llmService.isAvailable(): boolean`** — true only if `llm.enabled` resolves to `true` **and** at least one provider (default, fallback, or any other registry entry) passes `checkAvailability()`.
- **`llmService.resolveActiveProvider(): LLMProviderConfig | null`** — implements a four-step chain: (1) try `configService.resolve('llm.defaultProvider')`, if its key is set use it; (2) else try `configService.resolve('llm.fallbackProvider')`; (3) else try any provider `checkAvailability()` reports as available, in registry order; (4) else return `null`. This replaces `initializeDefault()`'s current single-attempt, env-var-only behavior, while remaining backward compatible with `API_MODEL_DEFAULT` as one more fallback source if you want to keep supporting it.

### 10.9 Commands That Must Be Updated to Consume This

Every command below should check `llmService.isAvailable()` **before** attempting generation, and go straight to its manual/non-AI path with one consistent log message if false — this replaces each command's current "try AI, catch failure, fall back" pattern with a proactive check *plus* the same safety-net catch as before (belt and suspenders, not a replacement), removing the guaranteed-to-fail first attempt in the common case of AI simply not being configured at all.

| Command | What it should resolve via §10.7 instead of a hardcoded/env value |
|---|---|
| `git.commit` (§4.4) | `llmService.isAvailable()` check before the AI-message-generation prompt |
| `git.deleteRemoteRepos` (§4.9) | `github.defaultOrg` for owner resolution (replaces the hardcoded org fallback flagged in the architectural appraisal) |
| `nuxt.createLayer` (§5.1) | `author.name`/`author.email` for generated file headers; `github.defaultOrg` and `github.defaultVisibility` for the new remote repo; `llmService.isAvailable()` before AI README/JSDoc generation |
| `nuxt.extractDocs` (§5.3) | `llmService.isAvailable()` before per-file AI summarization |
| `utils.autoDoc` (§7.2) | `llmService.isAvailable()` before attempting any JSDoc generation |
| `utils.autoVersion` (§7.3) | `llmService.isAvailable()` before requesting an increment analysis (fall back to a safe default increment, same as today, if unavailable) |
| `utils.validateHeaders` (§7.5) | `author.name` for newly-appended `@author` entries; `llmService.isAvailable()` before the AI-assisted `package.json` naming path |
| `app.setup` (§2.2) | `author.name`, `github.defaultOrg`, `github.defaultVisibility`, `github.defaultBranch` for the scaffolded project's initial git setup |
| `headerTemplate.ts` (Part II, §10.5 of the architecture document) | `author.name`/`author.email`, replacing its hardcoded default parameter directly |
