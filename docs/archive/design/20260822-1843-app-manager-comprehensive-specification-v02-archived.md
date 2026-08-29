> **Status:** Archived
>
> This document is no longer part of the active specification tree.
> Its contents are being retained for historical reference and
> documentation reconciliation.

# App Manager — Comprehensive Specification

*Synthesized from `/docs/developers/specifications/app/` (24 documents, ~336KB) AND a direct source-code audit of `/app/services`, `/app/scanners`, `/app/strategies`, `/app/templates`, `/app/orchestrators`, and `/app/commands`.*

This document has two parts:

- **Part I — Commands & Documented Specifications.** What the project's own written specs say about the CLI's command surface (`am app/git/nuxt/quality/docs/utils ...`), reconciled against what's actually implemented.
- **Part II — The Five-Layer Code-Intelligence Architecture.** A from-source-code account of `services`, `scanners`, `strategies`, `templates`, and `orchestrators` — the internal engine that (mostly) sits *underneath* the commands in Part I — including exactly which commands do and don't consume it today.

Read together, these two parts describe the same underlying reality from two directions: Part I is "what the user-facing tool is supposed to do," Part II is "what internal machinery exists to do it." The throughline in both parts is the same: **a small, working core surrounded by a much larger, well-designed, but largely unwired body of supporting code.**

---

# PART I — Commands & Documented Specifications

## 0. How to Read This Part

The `docs/developers/specifications` directory is **AI-generated reverse-engineering documentation**, produced by feeding source files (including many `.ts.old` legacy files that no longer exist in `app/commands/`) to an LLM and asking it to produce a formal spec + test strategy. Several important caveats apply throughout:

- **The docs describe more than what's in the live codebase.** Many specs analyze `*.ts.old` "legacy" implementations that are richer than the current stub files in `app/commands/`. These represent **intended/previous functionality**, not necessarily what ships today.
- **Files often contain multiple concatenated spec revisions.** Individual `.md` files frequently include 2–3 different analysis passes (e.g., a formal tech-spec, then a "Feature" user-story doc, then a "Function Analysis" doc) glued together, sometimes with slight signature or behavior discrepancies between them.
- **Documented gaps and regressions are called out explicitly** in "Gap Analysis" sections — these compare the current lean implementation to the richer legacy version and flag lost functionality.
- Where the docs disagree with the actual working code (confirmed by reading `app/commands/*.ts` directly), this is noted below.

---

## 1. System Overview

**App Manager** is a domain-driven CLI tool for orchestrating Nuxt 4 monorepos. Architecturally, it is built around:

- **`BaseCommand`** — abstract class all commands extend (`execute()`, optional `isEnabled()`)
- **`CommandRegistry`** — in-memory singleton mapping `domain.name` → command instance, used by both headless CLI dispatch and interactive TUI menu construction
- **`index.ts`** — bootstrapper that registers commands and dispatches to `runHeadless` or `runInteractive` based on `process.argv`

Five command domains are specified: **App**, **Git**, **Nuxt**, **Quality**, **Docs**, plus a general **Utils** domain.

### 1.1 Cross-Cutting Architectural Findings (repeated in nearly every spec)

| Theme | Finding |
|---|---|
| **Dependency Injection** | None used anywhere. All commands import `logger`, `githubService`, `llmService`, etc. as module-level singletons rather than receiving them via constructor injection. Every spec flags this as a testability/coupling risk. |
| **Error typing** | Pervasive use of `catch (error: any)` instead of `unknown` + type guards. Flagged as a strictness violation in nearly every spec. |
| **State management** | Every command is stateless — all logic operates on `targetRoot` + `options` passed into `execute()`. |
| **UI library** | `@clack/prompts` is the universal interactive UI library (`intro`, `outro`, `select`, `multiselect`, `confirm`, `text`, `spinner`, `isCancel`). `picocolors` is used for terminal styling; `consola` appears in some legacy files as a logging alternative to the newer `loggerService`. |
| **Git operations** | `simple-git` is the standard library for programmatic git operations in the richer/legacy specs; the current live `commitCommand.ts`/`pushCommand.ts`/`syncCommand.ts` instead delegate to a `githubService` abstraction. |
| **Headless/Interactive duality** | Nearly every command supports both a flag-driven headless mode (for CI/CD) and a prompt-driven interactive mode, with the interactive path typically wrapping the headless logic in spinners/intros/outros. |

---

## 2. Core Infrastructure

### 2.1 `index.ts` (Bootstrapper)

- **Role:** Entry point / orchestrator bridging Node's `process` to the app's command logic.
- **Patterns:** Singleton/module pattern (services imported as instances), Command pattern (registers concrete command classes), implicit Strategy pattern (headless vs. interactive dispatch).
- **Behavior:**
  1. On module load, registers concrete commands into `commandRegistry` (spec shows `CommitCommand`, `PushCommand`, `SyncCommand` explicitly registered at this layer).
  2. `main(targetRoot, toolRoot)`: calls `logger.init(targetRoot)` and `configService.init(toolRoot)`, slices `process.argv` from index 2, and dispatches to `runHeadless(targetRoot, args)` if args exist, else `runInteractive(targetRoot)`.
  3. Bootstrap block computes `targetRoot` (cwd) and `toolRoot` (one directory above the script), invokes `main`, and wraps it in `.catch()` that logs a fatal error and calls `process.exit(1)`.
- **Coupling risk:** Adding a new command requires editing this file directly (concrete imports, no plugin/auto-discovery mechanism).
- **Recommended refactors (per spec):** Inject commands via a loader instead of hardcoding instantiation; accept `args: string[]` as a parameter to `main()` instead of reading `process.argv` directly, to make it pure/testable.

### 2.2 `BaseCommand`

Abstract base class. Contract:

```ts
abstract class BaseCommand {
  constructor(public readonly metadata: CommandMetadata) {}
  abstract execute(targetRoot: string, options: CommandOptions, ...args: string[]): Promise<void>;
  async isEnabled(targetRoot: string): Promise<boolean> { return true; } // overridable
}
```

`CommandMetadata` shape (implied): `{ id: string; domain: string; name: string; hidden?: boolean }`.

- Fully immutable (`readonly metadata`), no internal state beyond that.
- `isEnabled()` defaults to `true`; subclasses override it to gate availability (e.g., "only show `git push` if inside a git repo").

### 2.3 `CommandRegistry`

Singleton in-memory catalog (`Map<string, BaseCommand>`), keyed by command ID.

| Method | Behavior |
|---|---|
| `register(command)` | Inserts into map; logs a warning via `logger.warn` if the ID already exists (overwrite is allowed, not blocked). |
| `get(domain, name)` | Linear scan for a command matching both domain and name; returns `undefined` if not found. |
| `getByDomain(domain)` | Filters by domain **and excludes `hidden: true` commands** — this is the method the TUI menu builder uses. |
| `getDomains()` | Extracts unique `domain` values via a `Set`, returns them alphabetically sorted. |
| `getAll()` | Returns every registered command with no filtering (including hidden ones) — presumably used by headless dispatch, which doesn't care about menu visibility. |

No reset/clear capability exists (relevant for test isolation), no defensive validation of malformed metadata, no DI container.

---

## 3. App Domain (`am app ...`)

### 3.1 `RunAppCommand` / `runApp` (**implemented in current code**)

- **ID:** `app.run` — **Label:** "🚀 Run App Script"
- **Purpose:** Executes a `package.json` script using the auto-detected package manager.
- **`isEnabled`:** `true` only if `package.json` exists in `targetRoot`.
- **Execution flow:**
  1. Validate `package.json` exists (throw if not).
  2. Parse `scripts` object; warn and return if empty.
  3. Resolve `scriptName` from positional arg, `options.script`, or an interactive `p.select()` menu listing all scripts with their command strings.
  4. Validate the chosen script exists.
  5. **Detect package manager** by lockfile presence, in priority order: `bun.lockb` → bun, `pnpm-lock.yaml` → pnpm, `yarn.lock` → yarn, else npm.
  6. Build `${pm} run ${scriptName}` and execute via `execSync` with `stdio: 'inherit'` (preserves TTY interactivity, e.g., for a live dev server) and `cwd: targetRoot`.
  7. Non-zero exit is caught and rethrown as `Script "${scriptName}" failed execution.`
- **Discrepancy note:** The spec claims a "V1.1.0" revision changed the return type to `Promise<number>` to expose exit codes, but the actual code has no return statement and resolves `void` — a documented doc/code mismatch.

### 3.2 `setupApp` (**stub in current code — this describes planned/legacy behavior**)

- **Purpose:** "Zero-to-Hero" fresh-environment provisioning command.
- **Dependencies (legacy):** `fs`, `path`, `@clack/prompts`, `consola`, `picocolors`, `processService`, `syncRepos`.
- **Planned flow:**
  1. Intro banner + spinner.
  2. **`.env` setup:** if missing, check for `.env.example`; if found, prompt to copy it and warn the user to fill in real API keys; if no example exists, warn and skip.
  3. **Dependency install:** prompt "Install dependencies now?"; on yes, detect package manager and run install; on failure, log and abort early (skipping remaining steps).
  4. **Git sync:** prompt "Initialize & Sync Git Submodules?"; on yes, calls `syncRepos(targetRoot)`.
  5. **VS Code config:** only if `.vscode/settings.json` doesn't already exist (never overwrites user prefs) — prompts to generate recommended settings (ESLint format-on-save, `*.css` → postcss association, `typescript.tsdk` pointing at local TS).
  6. Outro message.
- **Note:** Return type is implicitly `Promise<void>` but not declared explicitly in the legacy source — flagged as a strictness gap.

---

## 4. Git Domain (`am git ...`)

This is the most fully-specified domain, with the richest set of legacy behaviors documented against a much thinner current implementation.

### 4.1 `SyncCommand` / `git.sync` (**implemented**)

- **Label:** "🔄 Sync Repo" — pulls latest changes from remote.
- **`isEnabled`:** true if `githubService.getStatus()` resolves with a defined `branch`.
- **Dual mode:**
  - **Headless** (`options.force` truthy): calls `githubService.syncRepo(targetRoot, false)` — the `false` disables "silent" stdio suppression, so raw git output streams straight to the terminal (useful for CI logs). No intro/outro/spinner UI.
  - **Interactive** (default): spinner-wrapped call to `githubService.syncRepo(targetRoot, true)` (silent mode, to avoid breaking the spinner rendering), with success/failure spinner states.
- **Legacy/full spec (`syncRepos`) describes a two-step "deep sync":**
  1. `git.pull()` on the root repo.
  2. `git.submoduleUpdate(['--init', '--recursive'])` to bring all submodules ("layers") into sync too.
  - **Gap Analysis note:** the spec explicitly flags that the *current* `githubService.syncRepo` implementation must be verified to actually perform the submodule step — this was called out as a requirement, not a confirmed fact.
- **Output streaming (headless):** legacy spec describes attaching `simple-git`'s `.outputHandler` to pipe child-process stdout/stderr directly to the parent, so CI systems see real-time progress bars and errors.
- **Development Proposal on file (`syncCommand_DevelopmentProposals.md`):** a design discussion (not yet implemented) proposing a **"Scoped Sync"** feature:
  - Three scopes: **Global** (root + all submodules, current default), **Local** (only the repo at `cwd`), **Selective** (interactive multi-select of which layers to sync).
  - New flags proposed: `--all` (current behavior), `--root-only`.
  - Pros: speed/bandwidth savings in large monorepos, respects "current working directory" expectations, avoids unrelated merge conflicts.
  - Cons/risk: **"Monorepo Drift"** — if a layer is synced ahead of what the root's submodule pointer expects, the tree becomes inconsistent. TUI complexity increases (needs a scope-selection menu). Ambiguity about default behavior at root vs. inside a submodule.
  - **Recommendation in the doc:** keep full sync as the safe v1.0 default; treat scoped sync as a documented fast-follow, not a v1.0 requirement.

### 4.2 `PushCommand` / `git.push` (**implemented**)

- **Label:** "⬆️ Push to Remote."
- **`isEnabled`:** true if the repo has at least one configured remote.
- **Current implementation:**
  1. Fetch remotes via `githubService.getRemotes()`; warn and abort if none.
  2. Determine target remote(s): `options.remote` if provided, else an interactive `p.multiselect()` (supports **pushing to multiple remotes at once**, e.g., `origin` + `backup` — this multi-remote capability is explicitly called out in the spec as functionality that must not be lost from the legacy version).
  3. Determine branch: `options.branch` or current branch via `githubService.getStatus()`.
  4. Push to each selected remote independently, with per-remote spinner + success/failure reporting (one failure doesn't abort the others).
- **Legacy `pushToRemote` (simpler, single-remote) spec:** just runs `git.push()` against the current upstream, warns "No remotes configured" and aborts if none exist, and on failure suggests the user may need to set upstream manually. This is described as a *regression in simplicity* relative to the multiselect version that the live `PushCommand` restores.
- **Error handling caveat:** command swallows all errors after logging (`logger.error`), meaning the process exit code may remain `0` even on push failure — flagged as a design risk for CI usage, since failed pushes wouldn't fail the pipeline.

### 4.3 `CommitCommand` / `git.commit` (**implemented — "Smart Commit (AI)"**)

- **Label:** "📝 Smart Commit (AI)."
- **`isEnabled`:** true if `githubService.getStatus()` returns a valid `branch`.
- **Execution (3 phases):**
  1. **Status & Staging:** if clean, log success and exit. If dirty with nothing staged, prompt "Stage ALL changes?" — abort on decline; on accept, calls `githubService.createCommit(targetRoot, 'temp', ['.'])` as a workaround to trigger a `git add .` (the spec flags this as confusingly named, since `createCommit` implies an actual commit rather than a staging op).
  2. **Message generation:**
     - Uses `options.message` if supplied.
     - Otherwise prompts "Generate commit message with AI?" → if yes, pulls the staged diff via `getStagedDiff`; if diff is empty, warns and falls back to manual entry; otherwise sends the diff to `llmService.generate()` with a Conventional-Commits-style prompt, shows the result for user approval, and falls back to manual text entry if rejected or if the AI call throws.
     - Manual fallback: `p.text()` prompt, validated non-empty.
  3. **Execution:** spinner-wrapped `githubService.createCommit(targetRoot, message)`.
- **Legacy `manageCommits` spec** (richer, `simple-git`-based) adds detail not present in the live simplified version:
  - Supports an explicit **AI vs. Manual choice menu** (rather than a yes/no AI toggle), gated on `options.availableLLMs` (an array of provider objects with `available` flags) — implying a multi-provider LLM selection UI that isn't present in the live code.
  - Diff is **sanitized/truncated to 6000 chars** before being sent to the LLM (`llm.sanitizeContext`) — not mentioned in the live spec, worth confirming whether the current `llmService.generate()` does this internally.
  - Review step allows **inline editing** of the AI-generated message (press Enter to accept, or type to override) rather than only a binary accept/reject.

### 4.4 Commands specified but **not yet implemented** (stubs only in current code)

These are documented in detail as if implemented (legacy `.ts.old` analysis) but the live `app/commands/git/*.ts` files for these are 25-line empty stubs. Treat everything below as a **design spec for future work**, not current behavior.

#### `addSubmodules` — `git.addSubmodules`
- **Goal:** Scan a `layers/` directory for local git repos not yet tracked as submodules of root, and convert eligible ones into official `git submodule add` entries.
- **Rules for candidacy:** (1) must be a git repo, (2) must NOT already appear in `git ls-files --stage` (i.e., not already tracked), (3) must have an `origin` remote configured (hard requirement for `submodule add`).
- **Flow:** validate root is a repo & `layers/` exists → scan & build candidate list (skip/warn on repos lacking `origin`) → `multiselect` UI (`LayerName (RemoteURL)` labels) → for each selected, run `git submodule add <url> <path>`, continuing past individual failures → remind user to commit the root's `.gitmodules` changes.
- **Proposed new file:** `app/commands/git/addSubmodulesCommand.ts`; service dependency: a `githubService.getUntrackedSubmodules()` method (not yet specified as existing).

#### `initLayers` — `git.initLayers`
- **Goal:** Scan `layers/` for subdirectories lacking a `.git` folder and run `git init` in each.
- **Flow:** validate `layers/` exists (warn+exit if not) → scan for uninitialized candidates → if none, log success and exit → if any, log the list and (unless `--force`) prompt for confirmation → spinner-wrapped loop calling `simpleGit(path).init()` per candidate, continuing past individual failures → completion log.
- **Headless mode:** `--force` skips the confirmation prompt entirely (CI-friendly).
- **Proposed new file:** `app/commands/git/initLayersCommand.ts`; needs a `fileService`/`githubService.isGitRepo(path)` helper.

#### `pushAll` — `git.pushAll` ("Mass Push")
- **Goal:** Scan the root repo *and* every `layers/*` submodule for unpushed local commits (`git status().ahead > 0`), report them, and push all in one confirmed batch operation.
- **Helper `getRepoStatus(repoPath, name)`:** wraps `simple-git` status check; returns a `RepoStatus { name, path, ahead, branch }` object if ahead of remote, else `null` (errors are also swallowed to `null`, so invalid/non-git directories are silently skipped).
- **Flow:** discovery phase (root + all valid layer subdirectories) → if nothing is ahead, log success and exit → else display a per-repo report (name / commits ahead / branch) → confirm → push loop with **per-repo error isolation** (one failure doesn't stop the batch) → final summary of successes and failures.
- **Proposed new file:** `app/commands/git/pushAllCommand.ts`; service dependency: `githubService.scanForUnpushed(root): Promise<RepoStatus[]>`.

#### `deleteRemoteRepos` — `git.delete` ("Dangerous" — flagged in README)
- **Goal:** Permanently delete a remote GitHub repository via the API, with a hard safety confirmation gate.
- **Target resolution:**
  - Headless: `--repo` accepts `owner/name` or bare `name` (falls back to `process.env.GITHUB_ORG`, defaulting further to a hardcoded `'steve-r-lewis'` if the env var is unset — this hardcoded fallback is flagged as a code smell/personal-account leakage in the spec).
  - Interactive: fetches the account's repo list via `github.listRepos()`, presents a `select` menu showing name + public/private status.
- **Safety confirmation:** requires the literal string `"DELETE"` to be typed (`--confirm` flag in headless mode, or a `text()` prompt interactively). Case-insensitive comparison in the legacy logic despite the prompt implying strict uppercase — flagged as a minor inconsistency, and the spec explicitly recommends keeping the "type DELETE" pattern as a standard cloud-CLI safety convention.
- **Execution:** `github.deleteRepo(owner, name)`, wrapped in try/catch with error logging on failure; mismatched confirmation logs a warning and aborts without calling the API.
- **Proposed new file / service need:** requires `githubService.listRepos()` and `githubService.deleteRepo()` to exist.

---

## 5. Nuxt Domain (`am nuxt ...`) — **all stubs in current code**

All three Nuxt commands are specified in detail against legacy `.ts.old` sources but are 25-line empty stubs in the live repository.

### 5.1 `createLayer`
- **Goal:** Scaffold a new Nuxt layer under `layers/`, using AI to generate metadata (README content, JSDoc header, `package.json` description).
- **Flow:**
  1. Headless (`options.name` provided) vs. interactive (prompts for layer name, normalized to lowercase/trimmed; aborts if the target directory already exists).
  2. Prompts for a "purpose" string if not supplied, defaulting to `"Utility layer for ${layerName}"`.
  3. Calls `llm.generate()` requesting a JSON blob with `readme`, `jsdoc`, and `pkgJson` keys; extracts JSON via regex (`/\{[\s\S]*\}/`) and parses it; **falls back silently to hardcoded defaults** if the AI call or JSON parse fails.
  4. Word-wraps the AI-generated JSDoc description to ~75 chars per line; generates timestamp metadata (en-GB locale).
  5. Writes: `package.json` (with AI description), `tsconfig.json` (extends root config), `.gitignore`, `LICENSE` (hardcoded MIT text), `README.md` (AI content), `nuxt.config.ts` (with generated JSDoc header).
- **Code smell noted in spec:** hardcoded author name ("Steve R Lewis") and license type baked directly into scaffolded output — increases coupling to a specific individual/org rather than being configurable.
- **Part II cross-reference:** this is exactly the workflow the **Templates layer** (§9) exists to serve — `packageJsonTemplate`, `tsconfigTemplate`, `gitignoreTemplate`, `mitLicenseTemplate`, `readmeTemplate`, `nuxtConfigTemplate` for layers already exist and are fully implemented in `app/templates/`. `createLayer` is the natural consumer of that layer, but as of this audit **does not call it** (see §12).

### 5.2 `extractDocs`
- **Goal:** Generate a consolidated Markdown documentation report by scanning `layers/`, aggregating selected file types, and AI-summarizing source code files.
- **Helper `scanFiles(dir, extension, fileList)`:** recursive directory walk, skipping `node_modules`/`.git`, matching by extension or exact filename (`*` = all).
- **Helper `processFile(filePath, layerPath)`:** type-specific extraction strategy —
  - `package.json` → extracts and blockquotes the `description` field (or "(Invalid JSON)" on parse failure).
  - `.md` → first 20 lines, `"... (truncated)"` if longer.
  - `.ts`/`.js`/`.vue` → sends the first 2000 chars to `llm.generate()` for an AI summary (prefixed `**AI Summary:**`); on failure returns a failure message rather than throwing.
  - anything else → `"(Binary or unsupported file type)"`.
- **Main flow:** validate `layers/` exists → `multiselect` prompt for which file patterns to include → for each layer subdirectory, scan matching files, dedupe, and process them in parallel (`Promise.all`) → assemble a Markdown doc with a table of contents → write to `docs/reports/layer-report-<timestamp>.md`.
- **Part II cross-reference:** this spec's own `scanFiles`/`processFile` helpers are a hand-rolled, ad-hoc duplicate of what `codeService.inspect()` + the **Strategies layer** (§10) already do more generically (`findDocumentableBlocks` per file type). A future implementation could delegate to `codeService` instead of reimplementing file-type dispatch locally.

### 5.3 `manageEnv`
- **Goal:** Environment hygiene tool — clean build artifacts and/or reinstall dependencies, for both a single project and (via "Reset") a combined clean+reinstall cycle.
- **`EnvOptions`:** `{ clean?: boolean; reinstall?: boolean; force?: boolean }`.
- **Headless mode:** if `options.clean` and/or `options.reinstall` are set, executes immediately without prompts (returns early — both can theoretically be requested together, though the spec's flow description handles them as independent branches rather than combined).
- **Interactive mode:** `select` menu → **Clean** (multiselect specific target dirs from a hardcoded list: `node_modules`, `.nuxt`, `.output`, `dist`, `.cache`), **Reinstall** (direct), **Reset** (confirm → full clean of all targets, then reinstall), **Back**.
- **`executeClean(targetRoot, dirs)`:** iterates given dirs, `fs.rmSync({ recursive: true, force: true })` on any that exist; per-directory error isolation (logs and continues).
- **`executeInstall(targetRoot)`:** detects package manager via `processService.detectPackageManager`, then runs `install` via `processService.run`.
- **Tech-debt note:** `consola` is imported but unused in favor of the newer `loggerService` — dead import flagged by the spec.

---

## 6. Docs Domain (`am docs ...`) — **stub in current code**

### 6.1 `runDocs`
- **Goal:** Interactive orchestrator for documentation *tooling* itself (VitePress dev/build/preview) — distinct from `nuxt extractDocs`, which *generates* content. This command *runs* the docs site.
- **Dual-context awareness:** distinguishes between docs for the App Manager tool itself (`toolRoot`) and docs for the user's target Nuxt project (`targetRoot`), only offering target-project doc commands if VitePress is detected in the target's `package.json` dependencies.
- **`detectPM(root)` helper:** same lockfile-priority logic pattern used elsewhere (`pnpm-lock.yaml` → pnpm, `yarn.lock` → yarn, `bun.lockb` → bun, else npm) — this exact helper (and `runQuality`'s identical version) is a candidate for extraction into a shared service, since it's duplicated verbatim across at least two spec'd modules.
- **`runScript(cmd, args, cwd)` helper:** wraps `child_process.spawn` with `stdio: 'inherit'`, resolving on exit code 0 and rejecting otherwise (or on spawn error).
- **Menu construction:** always offers "Start App Manager Docs" (tool root); conditionally adds "Start/Build/Preview Project Docs" if the target has VitePress; always offers "Go Back".
- **Execution:** maps the selected menu key to a `vitepress <dev|build|preview>` invocation, using `npx` if the resolved package manager is npm, or the direct binary otherwise (e.g. `pnpm vitepress dev`).

---

## 7. Quality Domain (`am quality ...`) — **stub in current code**

### 7.1 `runQuality`
- **Goal:** Dynamically detect available quality scripts (lint/test/typecheck) plus Vitest presence in a target project, and offer an interactive menu to run them.
- **`detectPM`/`runScript` helpers:** identical pattern/implementation to the ones described in `runDocs` above (again flagged as duplicated logic — the spec explicitly notes this is a good candidate for a shared internal service).
- **Flow:**
  1. Prompt user to choose scope: `target` (the Nuxt project) or `tool` (App Manager itself). Exits on cancel.
  2. Resolve `activeRoot` accordingly and detect its package manager.
  3. Read the resolved `package.json`; check `scripts` for `lint`, `test`, `typecheck` keys, and check dependencies for `vitest` (enabling a `vitest:ui` menu option if present). Missing or malformed `package.json` is handled silently (empty scripts assumed).
  4. Build a dynamic menu from whatever capabilities were detected; if nothing is found, warn and exit rather than showing an empty menu.
  5. Execute the chosen script via `runScript`; `vitest`/`vitest:ui` actions use `npx` if the detected PM is npm.

---

## 8. Utils Domain (`am utils ...`) — **all stubs in current code**

### 8.1 `addContributor`
- **Goal:** Add a `{ name, email, url }` entry to the `contributors` array in `package.json`.
- **Flow:** validate `package.json` exists → resolve `name`/`email` from options or interactive `text()` prompts (abort on cancel at either step) → for `url`, a **heuristic**: if both `name` and `email` were supplied via CLI options (implying headless/scripted use), the URL prompt is skipped entirely and defaults to an empty string; otherwise it's prompted for interactively → read/parse `package.json`, initialize `contributors` array if absent → **duplicate check by email** (warns and aborts if the email already exists) → push and write back → success log.
- **Code quality notes:** mixed use of a custom `logger` service and raw `console.log` debug statements; `pkg` is implicitly `any` from `JSON.parse`, and the new contributor object is explicitly cast to `any` — both flagged as type-safety gaps.

### 8.2 `autoDoc`
- **Goal:** Scan a codebase for undocumented exports (functions/consts/classes/types) and use an LLM to generate and inject JSDoc comments.
- **`walk(dir, fileList)`:** recursive traversal, skipping a configured `SKIP_DIRS` list (e.g. `node_modules`), matching a `TARGET_EXTS` list while explicitly excluding `.d.ts` files.
- **`isDocumented(content, matchIndex)`:** looks at the 500 characters immediately preceding an export match and checks whether that (trimmed) substring ends in `*/` — a heuristic for "this export already has a preceding block comment."
- **Main flow:**
  1. Walk the tree, regex-match exports (`RX_EXPORT`), filter to undocumented ones, and capture a 300-char context snippet per candidate.
  2. If none found, log success and exit; otherwise confirm with the user before proceeding.
  3. **Critical implementation detail:** within each file, candidates are processed **bottom-up (descending index order)** so that injecting text at a later position in the file doesn't invalidate the character indices of earlier, not-yet-processed candidates.
  4. For each candidate, prompt the LLM with the name + snippet, sanitize backticks from the response, and validate it looks like a real JSDoc block (`starts with /**`, `ends with */`) before injecting it — bad AI responses are simply skipped rather than injected.
  5. Write the modified file back to disk.
- **Error handling gap explicitly flagged:** per-candidate LLM/injection failures are caught and logged as warnings (processing continues), but the actual `fs.writeFileSync` call is described as sitting **outside** any try/catch in the source, meaning a permissions error on write would crash the whole process rather than being caught gracefully.
- **Part II cross-reference:** this command's entire job — "find undocumented exports, call the LLM, inject the result" — is *precisely* what `codeService.inspect()` + `codeService.generateDocFor()` already implement generically via the **Strategies layer** (§10), reusing `findDocumentableBlocks()`/`injectFunctionDoc()` per file type instead of a TS-only regex walk. This spec'd `autoDoc` predates or duplicates that generic mechanism rather than building on it.

### 8.3 `autoVersion`
- **Goal:** Automate semantic version bumping based on AI analysis of git diffs, using a specific structured file-header format (`@version`, `@notes`/Revision History block) as the mutation target — this is the exact header format visible on every file in the actual `app/commands` and `app/services` source tree, confirming this spec directly informed the project's own file-header convention.
- **`incrementVersion(version, type)`:** strips a leading `v`/`V`, splits on `.`, validates 3 numeric parts (fails safe by returning the original string if malformed), then increments Major (resets minor+patch to 0), Minor (resets patch to 0), or Patch, and rejoins.
- **Main flow:**
  1. Use `simple-git` to find modified `.ts`/`.vue` files; exit early if none.
  2. Confirm with the user before proceeding.
  3. Per file: read content, verify it has both `@version` and `@notes` tags (skip files missing this metadata format entirely — the tool cannot operate on files that don't follow this specific header convention), extract the file-specific git diff, and send it to `llm.generate()` requesting a JSON response of `{ increment: 'Major'|'Minor'|'Patch', note: string }`.
  4. **Fallback on AI failure:** if the LLM call throws or returns malformed JSON, default to a `Patch` increment rather than failing the whole file.
  5. Compute the new version string, build a timestamped history entry, string-replace both the version tag and append the history entry, and write back to disk.
- **Error handling gap (same pattern as `autoDoc`):** file *read* and the LLM call are wrapped in try/catch (failures there are caught and the file is skipped), but `fs.writeFileSync` for the final write appears **outside** any try/catch in the reviewed source — an unhandled write failure would propagate and crash that file's processing rather than being caught and logged.
- **Part II cross-reference:** `TypescriptStrategy.parseMetadata()` (§10.4) already extracts `@version`/`@author` via regex — a real `autoVersion` implementation would naturally reuse that instead of its own bespoke regex against the header block.

### 8.4 `cleanLogs`
- **Goal:** Workspace hygiene tool that deletes temporary test-run artifacts: log files under `app_manager/logs/test/` and mock fixture directories (anything prefixed `mock-`) under `tests/fixtures/`.
- **Flow:** resolve both target paths → scan each (skip cleanly if a directory doesn't exist) → if the combined count of matched items is zero, log info and exit **without prompting** → otherwise display counts and require a `confirm()` (defaulting to `false` as a safety measure) before any deletion → spinner-wrapped deletion loop (`fs.rmSync` with `force: true` for log files, `recursive: true, force: true` for fixture directories) → success or per-error logging.
- **Hardcoded path coupling:** both target directory names are hardcoded rather than configurable, flagged as brittle if the project structure changes.

### 8.5 `validateHeaders`
- **Goal:** The most complex Utils command specified — enforces the project's custom file-header convention (the same `@project`/`@file`/`@author`/`@version`/`@notes` block visible throughout the actual codebase) and validates `package.json` naming against the monorepo folder structure, with interactive/AI-assisted repair options.
- **`walk(dir, fileList)`:** recursive scan excluding a configured `EXCLUDE_DIRS` list, collecting files matching a configured `EXTENSIONS` list plus any `package.json` found.
- **`processSourceFile(filePath, targetRoot, gitAuthor)`:** for each source file —
  - Updates the `@project` tag to match the current folder structure.
  - Updates the `@file` tag to the correct relative path.
  - **Author handling:** if no `@author` block exists, creates one with a creation timestamp; if one exists but the current git user isn't listed, appends them — implying multi-author tracking per file.
  - **Version handling:** scans the file's own revision-history comments for the highest `V(\d.\d.\d)` entry and syncs the top-level `@version` tag to match it (i.e., the top tag is treated as derived/computed from the history log, not the other way around).
  - Only overwrites the file if an actual change was detected.
- **`validatePackageManifest(filePath, targetRoot)`:** validates a `package.json`'s `name` field against the expected name derived from its folder location; returns `null` if fine, or a `['MISMATCH_NAME', expected, current]` tuple if not, or `['Invalid JSON']` on parse failure.
- **Main `validateHeaders(targetRoot)` flow:**
  1. Fetch the current git user via `simple-git` (`getGitAuthor`).
  2. Walk the tree; for each `package.json`, run the manifest check — on mismatch, pause the spinner and present an interactive choice: **Auto** (rename to the folder-derived expected name), **Manual** (prompt for a name), **AI** (call `llm.generate()` for a suggested name + description, parse the JSON response, and apply it), or **Skip**.
  3. For every other source file, run `processSourceFile`.
  4. Log a summary count of files updated.
- **Documented logic limitation:** the code only *updates existing* `@project` tags — if a file is missing the tag entirely, the tool does **not** add it (only pre-existing tags get corrected/synced). This is called out explicitly as a test scenario ("Tag is not added — code only updates existing tags"), i.e., a known scope limitation rather than a bug.
- **Part II cross-reference:** `injectHeader()` on every Strategy (§10) already implements "detect existing header, remove it, splice in a new one" — this spec's bespoke tag-by-tag regex mutation is a different (and more surgical, field-level) approach than the strategies' current "replace the whole header block" approach. If `validateHeaders` is ever built, reconciling these two header-mutation approaches (whole-block replace vs. tag-level patch) is a design decision worth making explicitly rather than by accident.

---

## 9. Consolidated Gap Analysis: Spec vs. Live Code (Commands)

| Domain | Command | Spec Richness | Live Code State |
|---|---|---|---|
| App | `run` | Matches spec closely (one doc/code discrepancy on return type) | ✅ Implemented |
| App | `setup` | Full legacy spec exists | ❌ Stub |
| Git | `sync` | Spec + a "scoped sync" design proposal for future work | ✅ Implemented (basic sync only; scoped sync not built) |
| Git | `push` | Spec confirms multi-remote push is preserved in current code | ✅ Implemented |
| Git | `commit` | Legacy spec describes richer multi-LLM-provider flow than live code | ✅ Implemented (simplified vs. legacy) |
| Git | `addSubmodules`, `initLayers`, `pushAll`, `deleteRemoteRepos` | Full legacy specs exist, describing entire features | ❌ Stubs |
| Nuxt | `createLayer`, `extractDocs`, `manageEnv` | Full legacy specs exist | ❌ Stubs |
| Docs | `runDocs` | Full legacy spec exists | ❌ Stub |
| Quality | `runQuality` | Full legacy spec exists | ❌ Stub |
| Utils | all 5 commands | Full legacy specs exist for all | ❌ Stubs |

**Bottom line (Part I):** The specification set describes a fully-realized, feature-complete monorepo management tool with AI-assisted scaffolding, documentation generation, header/version enforcement, and comprehensive git orchestration. The **live codebase currently implements only four commands** (`app.run`, `git.sync`, `git.push`, `git.commit`), each in a somewhat leaner form than the legacy/spec'd version it's based on. Everything else in Part I should be read as **design intent and prior-art reference material** for future implementation work, not as a description of current runtime behavior.

---

# PART II — The Five-Layer Code-Intelligence Architecture

While Part I covers the CLI's *command surface*, this part covers a distinct, parallel body of code that lives underneath and beside it: `app/services`, `app/scanners`, `app/strategies`, `app/templates`, and `app/orchestrators`. Unlike Part I, this section is based on **directly reading the actual current source files**, not on AI-generated legacy specs — so what follows describes what genuinely exists in the repository today, including its version history as recorded in each file's own header (several files show `V1.1.0`/`V1.2.0`/`V3.1.0`+ revisions dated as recently as `20260820`, indicating this stack has had real, iterative maintenance).

## 10. Layer-by-Layer Breakdown

### 10.1 Services (`app/services/`) — the foundation

General-purpose utilities everything else is built on top of. Each wraps one external concern behind a clean API:

| Service | Role | Status |
|---|---|---|
| `fileService` | **"Central File I/O Orchestrator" (strict async).** Smart-reads/writes files; auto-detects and parses JSONC; uses `jsonc-parser` for **non-destructive, AST-based JSON updates** (i.e., can edit one field of a JSON file without reformatting the whole thing or losing comments). Fully async/non-blocking, with schema-enforced type guarantees on read. | Implemented |
| `githubService` | High-level abstraction over Git version control, built on `simple-git`. Documented features: repo initialization (with safe branch naming), submodule management for monorepo layers, atomic stage+commit operations, integrated audit logging. This is what `SyncCommand`/`PushCommand`/`CommitCommand` (Part I §4.1–4.3) call into. | Implemented |
| `llmService` | Unified interface to AI providers (OpenAI initially, extensible to others/Anthropic). Abstracts the HTTP request/response handling, supports a "JSON mode" for structured output, with error handling and logging built in. Consumed by `CommitCommand`'s AI message generation and (per Part I) by every stub command that promises AI assistance (`createLayer`, `autoDoc`, `autoVersion`, `validateHeaders`, `extractDocs`). | Implemented |
| `loggerService` | Centralizes all application console output. Currently a thin wrapper around the standard Console API, explicitly designed to be swappable for `consola`/`chalk` later without touching call sites elsewhere in the app. | Implemented |
| `processService` | Promise-based wrapper around Node's `child_process`, standardizing results into `{ exitCode, stdout, stderr }` objects. Handles environment variable merging, working-directory control, output trimming, and integrates with the logger for debug visibility. This is the natural target for the `detectPM`/`runScript` duplication flagged in Part I §6–7 (`runDocs`/`runQuality` both hand-roll their own spawn wrapper instead of using this). | Implemented |
| `configService` | The application's single source of truth for runtime state: current working directory, user identity (pulled from git config), and feature flags (verbose mode, dry-run mode). Initialized once at bootstrap by `index.ts` (Part I §2.1). | Implemented |
| `codeService` | **The coordinator for the Strategies layer** — see §10.5 below for full detail. | Implemented |
| `characterStreamService` | Stub only (`TODO: Create description here`) — no implementation yet, purpose currently unknown from the codebase. | Stub |

### 10.2 Scanners (`app/scanners/`) — tokenizers

Hand-rolled **lexers**, one per language: TypeScript, CSS, HTML, JSON. All extend a shared `BaseScanner<TTokenType>` abstract class.

**`BaseScanner`** provides the generic mechanics any tokenizer needs, entirely language-agnostic ("dumb" by design, per its own header comment):
- A single-pass character cursor with `advance()`/`peek()`/`check()`/`match()` — the last two support lookahead without consuming, `match()` consumes only on a successful match.
- Line/column tracking with correct **CRLF/LF normalization** (a `\r\n` pair is treated as one newline, advancing line/column exactly once).
- Character classification helpers: `isWhitespace`, `isDigit`, `isAlpha`, `isAlphaNumeric`.
- `consumeWhile`/`consumeUntil`/`consumeUntilSequence` — declarative "keep advancing until X" helpers used to implement most concrete scanning logic.
- A `token()` factory that slices the exact source substring between a start and end `SourceLocation`, so tokens always carry their own precise text.
- `currentLocation()`/`reset()` — allows a scanner to snapshot its cursor and rewind, useful for speculative lookahead in more complex grammars.

Each **concrete scanner** implements `scan(): Token<T>[]` by walking the source once and classifying characters into a flat token stream (no AST is built — that's a strategy's job, not a scanner's):

| Scanner | What it tokenizes | Notable engineering detail |
|---|---|---|
| `TypescriptScanner` | Structural blocks (`{`/`}`), punctuation, string/template literals, line/block comments, operators (including multi-char `=>`, `==`, `&&`, etc.), identifiers vs. reserved keywords, and numbers. | Implements a real **"regex vs. division" disambiguation** (`isRegexStart`) by inspecting the last significant token — e.g. a `/` after `)` or `]` is division, but after a keyword, operator, or `{` it starts a regex literal. This is a classic lexer edge case (the "regex trap") and it's handled correctly here, including regex character-class (`[...]`) tracking so a `/` inside `[...]` doesn't prematurely end the literal. |
| `CssScanner` | Selectors, block boundaries, properties; per its own docstring, provides the tokenization foundation for both `CssStrategy` and the `<style>` portion of a future Vue orchestrator extension. | Documented as handling nested at-rules (`@media`, SCSS/Less nesting) via the same `BlockStart`/`BlockEnd` token types the TS scanner uses. |
| `HtmlScanner` | Tags, attributes, text nodes, comments. | Explicitly handles **"raw text" elements** (`<script>`, `<style>`, `<textarea>`) where content must be treated as opaque text rather than parsed as nested markup — a real and easy-to-get-wrong HTML tokenization edge case. |
| `JsonScanner` | Objects, arrays, properties, strings (with escapes), numbers. | Supports **JSONC** (comments in JSON), which is required for files like `tsconfig.json`. Documented as the foundation for `JsonStrategy` to make precise edits without destroying formatting or comments. |

### 10.3 Strategies (`app/strategies/`) — the Strategy pattern, one implementation per file type

Each strategy implements a shared interface, `ICodeStrategy`, with (at minimum) four methods:

```ts
interface ICodeStrategy {
  parseMetadata(content: string): CodeFileMetadata;
  injectHeader(content: string, header: string): string;
  findDocumentableBlocks(content: string): CodeBlock[];
  injectFunctionDoc(content: string, functionName: string, docBlock: string): string;
}
```

`baseStrategy.ts` is not a base *class* here but a small **registry/factory**: it instantiates one singleton per strategy, maps file extensions to them, and exposes `getStrategyForFile(filePath): ICodeStrategy` (throws on an unsupported extension). This is the single lookup point every consumer uses — nobody imports a concrete strategy class directly except the registry itself (and `VueStrategy`, which composes `TypescriptStrategy` — see §10.4).

| Strategy | Extension(s) | Implementation approach | Notable detail |
|---|---|---|---|
| `TypescriptStrategy` | `.ts` | **Regex-based**, not scanner-based (see the important gap noted in §10.6). `parseMetadata` extracts `@version`/`@author` via regex, tolerant of messy whitespace/tabs/alignment asterisks. `injectHeader` detects and preserves a leading shebang line (`#!...`), strips any existing top-level JSDoc block, and reconstructs `shebang + newHeader + code`. `findDocumentableBlocks` regex-matches `export [default/async] const/function/class/interface Name`, checks the preceding non-blank line for a closing `*/` to determine `hasDoc`, and normalizes `const` → `variable` block type. `injectFunctionDoc` finds the target export by name, matches its indentation, and splices an indented doc block immediately above it. | This is the "reference" strategy every other strategy either extends or is validated against. |
| `JavascriptStrategy` | `.js` | Extends `TypescriptStrategy` with **zero overrides today**. | Explicitly documented as an intentional **extension point**, not dead code: it exists so `.js` files can diverge from TS behavior later (e.g. flagging `interface`/`type`/`enum` as invalid in plain JS, or handling `.jsx`/`.mjs` differently) without ever having to touch `TypescriptStrategy` itself. Per the file's own revision history, `.js` used to just resolve to the *same* `TypescriptStrategy` instance as `.ts`; this class was split out specifically to create that future extension seam. |
| `CssStrategy` | `.css` | Regex-based, structurally similar to the TS strategy but for CSS syntax/comments. | — |
| `HtmlStrategy` | `.html` | Regex-based, HTML-specific. | — |
| `JsonStrategy` | `.json` | **The one exception to "regex-based everywhere":** uses `jsonc-parser`'s `parse`/`modify`/`applyEdits` to work against a genuine **Concrete Syntax Tree (CST)**, not a basic `JSON.parse` AST. This means it can make "surgical edits" — preserving comments, exact formatting (tabs vs. spaces), and key ordering — rather than round-tripping through `JSON.stringify` and losing all of that. Also documented as detecting a custom "`metadataEntity`" schema (this project's own App Manager metadata format) with a fallback to plain `package.json`-style JSON. | The most technically sophisticated of the "flat" strategies — genuinely closer to production-grade tooling (this is essentially the same CST-preserving technique VS Code itself uses for JSON settings edits). |

### 10.4 Orchestrators (`app/orchestrators/`) — composition for composite file formats

Only one orchestrator exists: **`VueStrategy`** (despite the folder being named `orchestrators`, the class itself implements `ICodeStrategy` and is registered in `baseStrategy.ts`'s map exactly like every other strategy — it's not a structurally distinct concept from the registry's point of view, just a *composed* one internally).

A `.vue` Single File Component isn't one language — it's HTML-like wrapper markup around one or more embedded blocks (`<template>`, `<script>`/`<script setup>`, `<style>`). Rather than reimplementing TS parsing from scratch, `VueStrategy`:

1. **`extractScript(content)`** — regex-matches `<script setup ...>...</script>` first (modern Vue 3 Composition API), falling back to a plain `<script ...>...</script>` match (legacy Options API). Returns the extracted text plus its starting line number (for later offset correction) and the matched tag itself.
2. **Delegates entirely to a private `TypescriptStrategy` instance** for every operation — `parseMetadata`, `injectHeader`, `findDocumentableBlocks`, `injectFunctionDoc` all extract the script block, hand it to the composed `tsStrategy`, then re-splice the (possibly modified) result back into the original `<script>...</script>` region of the full file content.
3. **Line-number correction:** `findDocumentableBlocks` explicitly adjusts every returned block's `startLine`/`endLine` by adding the script block's own starting line offset — so downstream consumers see correct line numbers relative to the whole `.vue` file, not just the extracted script fragment.
4. **Graceful fallback:** if no `<script>` block is found at all, `injectHeader` falls back to prepending the header directly to the top of the file content.

This is a clean instance of the **Decorator/Delegation pattern** layered on top of the Strategy pattern: `VueStrategy` adds no new parsing logic of its own for code intelligence — it's purely an adapter that finds the relevant sub-region of a composite file format and hands it to an existing strategy, then reassembles the result. (Per the file's own revision history, it was originally created under `app/orchestrators/vue/vueOrchestrator.ts` and there's a noted intent to relocate it to `app/strategies/vue/vueStrategy.ts` to match every other strategy's folder convention — as of this audit that move has not yet happened, which is why `orchestrators/` currently exists as a one-file outlier directory.)

**Note on scope:** the CSS scanner's docstring mentions it's meant to eventually back "the style-block portion of the VueStrategy" and the HTML scanner's docstring likewise mentions "the template portion of the VueStrategy" — implying the *intended* end-state is for `VueStrategy` to also parse and manipulate the `<template>` and `<style>` blocks of a `.vue` file, using the CSS/HTML scanners for those regions the same way it currently uses `TypescriptStrategy` for the `<script>` region. **This is not implemented yet** — today's `VueStrategy` only touches `<script>`/`<script setup>`; `<template>` and `<style>` blocks are left completely untouched by every method.

### 10.5 Templates (`app/templates/`) — file scaffolding, not parsing

Pure string-generating functions: given a params object, return a complete file's text content. No reading, no parsing, no mutation of existing files — templates only ever produce brand-new content. Organized by:

- **`blocks/headerTemplate.ts`** — `getHeaderBlock(params: HeaderParams): string`. This is, notably, **the literal function that generates the exact JSDoc-style header block** (`@project`/`@file`/`@version`/`@createDate`/`@createTime`/`@author`/`@description`/`@notes` Revision History) seen atop every single source file examined throughout this entire audit — `index.ts`, every command, every service, every scanner, every strategy. It computes the current date/time in the project's specific formats (`en-US` short month, zero-padded day/hour/minute) and defaults `author` to `'Steve R Lewis'` and `version` to `'1.0.0'` if not supplied. In effect, this one function *is* the project's own house style — everything else in the repo was almost certainly generated by literally calling this template (or by an AI assistant told to match its output).
- **`languages/`** — generic, framework-agnostic generators: `jsonTemplate.ts` (a structured metadata-JSON generator with auto-populated dates/versioning), `readmeTemplate.ts` (adapts content based on whether the target is a project root or a layer), `typescriptTemplate.ts` (**stub — `TODO`**).
- **`license/mitLicenseTemplate.ts`** — generates LICENSE text, supporting distinct profiles for different licensing needs (documented as handling at least an MIT/permissive path).
- **`frameworks/nuxt/`** — the largest subtree (124KB), split into:
  - **`layer/`** (for scaffolding an individual Nuxt layer under `layers/`): `gitignoreTemplate`, `nuxtConfigTemplate`, `packageJsonTemplate`, `tsconfigTemplate` — all fully implemented.
  - **`project/`** (for scaffolding the monorepo root itself): a much larger set, with a genuine mix of implemented and stub files —

    | Implemented | Stub (`TODO`) |
    |---|---|
    | `gitignoreTemplate` | `appConfigTemplate` |
    | `nuxtConfigTemplate` | `editorconfigTemplate` |
    | `packageJsonTemplate` | `envTemplate` |
    | `rootConfigTemplate` | `gitmodulesTemplate` |
    | `tsconfigTemplate` | `npmrcTemplate` |
    | `vueComponentTemplate` | `nuxtrcTemplate` |
    |  | `pnpmWorkspaceTemplate` |
    |  | `vitestConfigTemplate` |
    |  | `vitestSetupTemplate` |

    Two design details worth calling out from the implemented ones: `packageJsonTemplate` and `tsconfigTemplate` both use a **discriminated-union approach** (`'root' | 'layer'` mode) to generate two structurally different outputs from one function depending on context, rather than having entirely separate root/layer template files; and `gitignoreTemplate` documents two distinct "security profiles" — a defensive/comprehensive "Fortress" mode for the root vs. presumably a lighter mode for individual layers.
  - **`components/vueComponentTemplate.ts`** and **`content/contentConfigTemplate.ts`** — component scaffolding (implemented) and Nuxt Content config scaffolding (stub), respectively.

**This mirrors the exact same "some real, mostly stubs" pattern found in Part I's command audit** — of roughly 24 template files, about 11 are fully implemented and the rest are 25-line `TODO` placeholders, almost exactly the same ratio as the 4-implemented-out-of-25 commands finding, just less extreme. This strongly suggests templates and commands were scaffolded together in passes, with implementation depth varying by how far each specific file got before development moved on.

## 11. How the Five Layers Interoperate

```
Templates      →  produce brand-new file content from scratch (scaffolding)
                            │
Scanners       →  tokenize existing file content into a Token[] stream
  (built, but currently bypassed by every Strategy except JsonStrategy,
   which uses jsonc-parser instead of JsonScanner directly)
                            │
Strategies     →  parse/manipulate EXISTING file content, keyed by extension,
                   via a shared ICodeStrategy interface + baseStrategy.ts registry
                            │
Orchestrators  →  compose multiple Strategies for multi-region composite
                   file formats (currently: VueStrategy, composing
                   TypescriptStrategy for the <script> region)
                            │
                   all consumed via  →  codeService
                            │
Services       →  the substrate everything above sits on: fileService for
                   I/O, llmService for AI calls, loggerService for output,
                   githubService/processService/configService for everything
                   else the commands themselves need directly
```

**The relationship is not a strict pipeline** — it's better understood as two separate concerns sharing one coordinator:

- **Creating new files** → `Templates` (called directly, no Strategy/Scanner involvement at all — a template just returns a string that gets written to disk by `fileService`).
- **Modifying existing files** → `Strategies` (optionally composed via an `Orchestrator` for multi-region formats), coordinated through `codeService`, which itself leans on `fileService` for I/O and `llmService` when AI-generated content needs to be produced before injection.
- **Scanners sit conceptually below Strategies** as the "correct" way to tokenize source text for parsing, but as of this audit **only `JsonStrategy` gets equivalent CST-level rigor**, and it achieves that via the third-party `jsonc-parser` library rather than the project's own `JsonScanner`. The TS/CSS/HTML scanners are fully built, tested-looking, self-contained tokenizers with **zero current callers outside their own directory** — every corresponding strategy (`TypescriptStrategy`, `CssStrategy`, `HtmlStrategy`) instead uses plain regex against raw text.

### 11.1 `codeService` — the single coordinator

`codeService` is the one class that actually ties Strategies (and, transitively, Orchestrators) together into usable operations, and it's the only consumer of `getStrategyForFile()` anywhere in the codebase:

| Method | What it does |
|---|---|
| `inspect(filePath)` | Reads the file via `fileService`, resolves the right strategy, returns `findDocumentableBlocks()` — i.e., "what in this file lacks documentation?" |
| `updateHeader(filePath, newHeader)` | Reads the file, resolves the strategy, calls `injectHeader()`, writes the result back via `fileService`, logs success. |
| `generateDocFor(filePath, functionName)` | Reads the file, resolves the strategy, finds the named block via `findDocumentableBlocks()`, builds an LLM prompt from its signature, calls `llmService.generate()`, then calls the strategy's `injectFunctionDoc()` to splice the AI-written doc back in and writes the file. |

Per `codeService`'s own revision history, a recent fix (`V3.1.0`) had to add missing `await`s throughout because `fileService.read()`/`.write()` are asynchronous — the file's changelog explicitly flags that **any external caller of `inspect()` or `updateHeader()` will need to add `await` at the call site**, which is a strong, self-documented signal that this service has been iterated on with real engineering discipline even though (per §12 below) it currently has no external callers at all.

## 12. How the Finished Commands Actually Consume This Stack (or Don't)

This is the most important finding of Part II, and it directly extends the Part I gap analysis (§9): **tracing every import in `app/commands/` shows that `codeService` — and therefore every Strategy, every Orchestrator, and by extension the entire Scanner layer — is never imported by any command file, live or stub.** Templates are likewise never imported outside their own directory tree.

Concretely:

- The four **working** commands (`app.run`, `git.sync`, `git.push`, `git.commit`) only touch `loggerService`, `githubService`, and `llmService`. None of them read or write source files in a way that would need a Strategy, and none of them scaffold new files in a way that would need a Template.
- The **stub** commands most obviously designed to need this stack — and this is confirmed by cross-referencing Part I's own specs against what actually exists in `app/templates`/`app/strategies` — are:

| Stub command (Part I) | Layer it should consume | What already exists and is ready to be wired in |
|---|---|---|
| `nuxt createLayer` | **Templates** | `packageJsonTemplate`, `tsconfigTemplate`, `gitignoreTemplate` (layer variants), `mitLicenseTemplate`, `readmeTemplate`, `nuxtConfigTemplate` — every file this command's spec says it needs to write already has a working generator function. |
| `utils validateHeaders` | **Strategies**, via `codeService.updateHeader()` | `injectHeader()` on every strategy already does "detect + strip existing header, splice in new one." (Note the design tension flagged in §8.5: the spec describes *tag-level* patching, while the strategies do *whole-block* replacement — these would need to be reconciled, not just wired together.) |
| `utils autoDoc` | **Strategies**, via `codeService.inspect()` + `generateDocFor()` | This is close to a 1:1 match — `codeService.generateDocFor()` already implements "find an undocumented block, ask the LLM, inject the result" as a generic, per-file-type operation. The spec'd `autoDoc` largely reimplements this from scratch with TS-specific regex instead of calling the existing generic service. |
| `utils autoVersion` | **Strategies**, via `parseMetadata()` | `TypescriptStrategy.parseMetadata()` already extracts `@version`; a real `autoVersion` could read the current version this way instead of its own bespoke regex. |
| `nuxt extractDocs` | **Strategies**, via `findDocumentableBlocks()` | The spec'd `scanFiles`/`processFile` helpers duplicate, in a more ad-hoc way, what `codeService.inspect()` already provides per file type. |

**Bottom line (Part II):** this is a second, independent instance of the exact same pattern found in Part I — a genuinely well-engineered piece of infrastructure (clean interfaces, sensible singletons, real edge-case handling like CRLF normalization and the regex/division disambiguation, self-documented bugfixes) that was built *ahead of* the commands meant to consume it. The code-intelligence stack isn't half-finished in the way the command stubs are (services/strategies/templates that exist are fully fleshed out, not 25-line placeholders) — it's **complete and unconsumed**, sitting ready for the day someone wires `nuxt createLayer`, `utils autoDoc`, `utils validateHeaders`, `utils autoVersion`, and `nuxt extractDocs` up to call it instead of reimplementing its logic from scratch.

---

## 13. Unified Technical Debt & Findings (Parts I + II Combined)

1. **No dependency injection anywhere**, in commands or services — every consumer imports services/strategies as singletons, making isolated unit testing dependent on module-level mocking rather than constructor substitution.
2. **`catch (error: any)` used pervasively** across commands and several services — recommended fix everywhere is `catch (error: unknown)` with `instanceof Error` guards.
3. **Duplicated `detectPM`/`runScript` helpers** between `runDocs` and `runQuality` (Part I) — `processService` (Part II §10.1) already exists and is the obvious extraction target, but neither spec'd command currently uses it.
4. **Hardcoded personal/owner values** — `steve-r-lewis` GitHub org fallback in `deleteRemoteRepos`; hardcoded author name (`'Steve R Lewis'`) and MIT license text baked into both `createLayer`'s spec'd output *and* the actual, implemented `headerTemplate.ts` default parameter.
5. **Unguarded final write operations** in `autoDoc` and `autoVersion` (Part I) — the destructive `fs.writeFileSync` call in both sits outside the surrounding try/catch, unlike the read and LLM-call steps which are guarded.
6. **Error swallowing without exit-code propagation** — several commands (`pushCommand`, `syncCommand`, `syncRepos`) log errors but don't re-throw, meaning CI pipelines invoking these headlessly may not fail correctly on git errors.
7. **No test-isolation reset** on `CommandRegistry` (no `clear()`/`reset()` method).
8. **The Scanner layer is built but functionally bypassed.** Every scanner (`Typescript`/`Css`/`Html`/`Json`) is a complete, self-contained tokenizer, but only `JsonStrategy` gets scanner-equivalent rigor — and it gets there via the third-party `jsonc-parser`, not the project's own `JsonScanner`. The TS/CSS/HTML strategies all still use plain regex against raw source text, which is inherently more fragile (e.g. a regex-based `findDocumentableBlocks` can be fooled by an `export` keyword appearing inside a string or comment, something a real token-stream-based implementation would handle correctly by construction).
9. **`VueStrategy` only handles `<script>`.** Its own supporting scanners' docstrings (§10.4) describe an intended future where `<template>` (via `HtmlScanner`) and `<style>` (via `CssScanner`) are also parsed and manipulated — today, both are left completely untouched.
10. **The entire code-intelligence stack (`codeService` + Strategies + Orchestrators + Scanners) has zero callers in `app/commands/`.** This is the single most significant finding of Part II, and it explains *why* so many Part I command stubs (`createLayer`, `autoDoc`, `validateHeaders`, `autoVersion`, `extractDocs`) remain unimplemented despite the exact machinery they'd need already existing and working: nobody has yet written the (relatively thin) glue code connecting a `BaseCommand.execute()` method to `codeService`'s existing methods.
11. **Templates mirror the commands' own "partially built" ratio.** Roughly 11 of 24 template files are fully implemented; the rest are `TODO` stubs — almost exactly proportional to the "4 real commands out of ~25 spec'd" ratio found in Part I, suggesting both trees were scaffolded in the same development pass and then abandoned at a similar point of completion.
12. **`VueStrategy` lives in `app/orchestrators/` but is registered and consumed identically to every other `app/strategies/*` entry** — its own revision history notes an intent to relocate it to `app/strategies/vue/` for folder-convention consistency; that move has not happened as of this audit, leaving `orchestrators/` as a one-file outlier directory rather than a distinct architectural tier.
