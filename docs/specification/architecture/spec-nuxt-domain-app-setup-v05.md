# Technical Specification Document

**Component:** Nuxt Domain, `app.setup`, and `app.run`'s Lifecycle Extension — Six Commands
**Files:** `~/app/commands/nuxt/*.ts`, `~/app/commands/app/setupApp.ts`, `~/app/commands/app/runApp.ts`
**Project:** `app-manager`
**Language:** TypeScript (Node.js runtime)

*Phase 6 (Implementation Roadmap §7). Depends on Phases 2–3 (settings/resolution), Phase 4 (`git.addSubmodules` as the layer-linking mechanism), and Phase 5 (templates — all confirmed working or fixed).*

---

## 1. Shared Context

### 1.1 Three New Service Methods, Confirmed Necessary by Direct Inspection

| Method | Service | Why it's needed |
|---|---|---|
| `fileService.deleteDir(path: string): Promise<void>` | `fileService` | `fileService.delete()` only wraps `fs.unlink`, which cannot remove a directory with contents. `nuxt.manageEnv`'s cache/`node_modules` cleanup (§6) needs real recursive removal. **Specified in full in `spec-fileService.md` §5.7**, added there as an addendum. |
| `fileService.listFilesRecursive(dir: string, options?: { extensions?: string[]; exclude?: string[] }): Promise<string[]>` | `fileService` | No directory-walking capability exists anywhere in the service layer today. Needed by `nuxt.extractDocs` (§5) this phase, and also by `utils.autoDoc`/`utils.validateHeaders` in Phase 7 (confirmed **not** needed by `utils.autoVersion`, which uses git-diff-based discovery instead — see `spec-utils-domain-commands.md` §1.1). **Specified in full in `spec-fileService.md` §5.8**. |
| `githubService.addRemote(cwd: string, name: string, url: string): Promise<void>` | `githubService` | `githubService.push()` assumes a remote already exists in local git config — there is no existing method to register one. Needed by `nuxt.createLayer` (§4) to attach the newly-`createRepo()`'d remote before the first push. **Specified in full in `spec-githubService-createRepo.md` §5.8**, added there as an addendum. |

### 1.2 Shared `executeClean`/`executeInstall` — One Implementation, Two Callers

Per the consolidation decision made when `app.run`'s lifecycle actions were first specified: `nuxt.manageEnv` owns the actual mechanics; `app.run` imports and reuses them rather than maintaining a second deletion/install routine.

```ts
// Exported from manageEnv.ts, imported by runApp.ts
export async function executeClean(targetRoot: string, dirs: string[]): Promise<void> {
	for (const dir of dirs) {
		const fullPath = path.join(targetRoot, dir);
		if (await fileService.exists(fullPath)) {
			await fileService.deleteDir(fullPath); // §1.1
		}
	}
}

export async function executeInstall(targetRoot: string): Promise<void> {
	const pm = processService.detectPackageManager(targetRoot); // §1.3
	await processService.spawn(pm, ['install'], { cwd: targetRoot });
}
```

Per-directory error isolation (one failed removal doesn't stop the rest) is the caller's responsibility, not baked into `executeClean` itself, since `app.run`'s `Empty` action wants a slightly different failure posture (abort the Empty→Initialise→Build chain on any single failure) than `nuxt.manageEnv`'s standalone `Clean` action (continue past individual failures, matching the original legacy spec).

### 1.3 Shared Package-Manager Detection — Consolidated Into `processService`

The lockfile-priority check (`bun.lockb` → bun, `pnpm-lock.yaml` → pnpm, `yarn.lock` → yarn, else npm) currently exists independently in today's `runApp.ts` and in the legacy specs for `docs.run`/`quality.run`/`manageEnv` — four separate copies of the same seven lines. Consolidated once into the service that already owns "how do I run commands" — **specified in full in `spec-processService.md` §5.3**, added there as an addendum, including the reasoning for why this one method is deliberately synchronous while every other method on that service is `async`.

Every command in this document that needs package-manager detection calls this, not its own copy.

### 1.4 All Lifecycle/Install/Build Execution Uses `spawn()`, Not `execute()`

Checked `processService.ts` directly (§ of Phase 6 investigation): `execute()` is shell-based with **captured** output (`child_process.exec`); `spawn()` supports **inherited** stdio (`stdio: 'inherit'`), preserving live terminal output, colors, and progress indicators. Every action specified in this document — `install`, `dev`, `build`, `preview`, `postinstall` — benefits from live output and none need to programmatically parse captured stdout, so **all of them use `spawn()`**, consistently, replacing today's `runApp.ts`'s direct `execSync` call with the equivalent `processService.spawn()` call.

---

## 2. `app.run` — Lifecycle Extension

**Status:** Extends the current, working generic-script-runner implementation with eight named presets. The existing generic runner (list all `package.json` scripts, let the user pick or pass one positionally) remains as a fallback for anything not covered below — **unchanged**.

### 2.1 The Eight Actions

| Action | Implementation |
|---|---|
| **Run Locally (Dev)** | `processService.spawn(pm, ['run', 'dev'], { cwd: targetRoot })` |
| **Build** | `processService.spawn(pm, ['run', 'build'], { cwd: targetRoot })` |
| **Preview** | `processService.spawn(pm, ['run', 'preview'], { cwd: targetRoot })` — no pre-check that a build output exists; if the script itself fails because nothing's been built, that failure surfaces naturally rather than this command trying to guess at build-output conventions |
| **Post Installation** | Read `package.json` via `fileService.read()`; if no `postinstall` script exists, report that clearly rather than attempting a no-op; otherwise `spawn(pm, ['run', 'postinstall'], ...)` |
| **Initialise** | `spawn(pm, ['install'], ...)` **plus** the checkout-provisioning steps absorbed from the old `setupApp.ts` legacy spec: copy an *existing* `.env.example` → `.env` if missing (this is copying a file the project already ships with, **not** generating one — that's `app.setup`'s job, §3, using `envTemplate.ts` — the two are easy to conflate and are deliberately kept distinct here); prompt to sync git submodules if `layers/` contains any (`git.sync`, Phase 4); generate VS Code `settings.json` if absent |
| **Clean** | `executeClean(targetRoot, ['.nuxt', '.output', '.cache'])` (§1.2) — cache-only, no confirmation needed |
| **Empty** | `executeClean(targetRoot, ['.nuxt', '.output', '.cache', 'node_modules', 'dist', 'pnpm-lock.yaml', 'yarn.lock', 'package-lock.json', 'bun.lockb'])` — **requires confirmation** (default `false`), prompt copy explicitly names what's being deleted, since this is materially more destructive than `Clean` |
| **Reinitialise** | `Empty` → `Initialise`'s install-only portion → `Build`, sequential, **abort the chain on any step's failure** rather than continuing |

### 2.2 Test Scenarios

| ID | Scenario | Expected Outcome |
|---|---|---|
| AR-01 | Dev/Build/Preview | `processService.spawn` called with the correct `pm run <script>` args, `stdio: 'inherit'` behavior confirmed via the mock |
| AR-02 | Post Installation, no such script | No `spawn` call at all; clear "no postinstall script" message |
| AR-03 | Initialise, `.env.example` present, `.env` absent | `.env` created via copy; submodule-sync prompt shown only if `layers/` has entries |
| AR-04 | Empty, confirmed | All nine target paths checked; `executeClean` called with the full list |
| AR-05 | Empty, declined | `executeClean` never called |
| AR-06 | Reinitialise, `Empty` step fails | Chain aborts — `Initialise`/`Build` never attempted |

---

## 3. `app.setup` — Create New Application

**Status:** New. Redefined scope confirmed from the earlier discussion — this scaffolds a brand-new root project, distinct from `app.run`'s "provision an existing checkout" (§2).

### 3.1 Functional Logic

1. Resolve project name/path (flags or prompts). Refuse if the target directory already contains a `package.json`.
2. Create the target directory.
3. **Resolve identity and git defaults**, all via `resolveOrPrompt` (Phase 2): `author.name`, `author.email`, `github.defaultBranch`. **Not** `github.defaultOrg`/`defaultVisibility` — this command creates no remote repository (that's `nuxt.createLayer`'s job, §4); it only needs local identity for the git commit and the templates.
4. **Generate root-mode files**, all confirmed working per Phase 5/the later Templates audit: `packageJsonTemplate` (root), `tsconfigTemplate` (root), `nuxtConfigTemplate`, `gitignoreTemplate` (root — with the Phase 5 `app-manager` fix). **Correction, made after the full Templates audit (`spec-templates-full.md` §1):** `pnpmWorkspaceTemplate`, `gitModulesTemplate` (not written at scaffold time regardless — see step 6 below), and `vitestConfigTemplate` should be imported **from `rootConfigTemplate.ts` specifically, not from the standalone files of the same/similar names** — the standalone `getPnpmWorkspaceTemplate()`/`getVitestConfigTemplate()` were found to be a separate, meaningfully diverged implementation apparently intended for App Manager's own internal use, not for scaffolding a target project. `editorconfigTemplate`, `npmrcTemplate`, `nuxtrcTemplate` are safe to import from either location (confirmed byte-identical between `rootConfigTemplate.ts` and the standalone files), but importing all six consistently from `rootConfigTemplate.ts` is simpler and avoids the ambiguity entirely. **`vitestSetupTemplate` (the `@clack/prompts` mocking harness) is removed from this list entirely** — on the same reasoning applied to `nuxt.createLayer` below, its content (mocking `confirm`/`select`/`multiselect`/`text`/`password`) is oriented toward testing CLI commands, not toward testing a scaffolded Nuxt application's components/composables, and has no legitimate use in a project `app.setup` produces. Like the standalone `vitestConfigTemplate`, it reads as App Manager's own internal tooling. A scaffolded project's `vitest.setup.ts`, if one is needed, would require a genuinely different, Nuxt-appropriate template that does not currently exist — out of scope for this command as specified.
5. **Generate `.env.example`** via the Phase 5-fixed `envTemplate.ts`, passing the resolved `author.name`/`author.email` from step 3 — this is the one place in this command that actually calls `getEnvExampleTemplate()` with real data rather than letting it fall back to generic placeholders.
6. **New — genuinely missing from every prior version of this spec, not a correction to existing behavior:** resolve and write a `LICENSE` file, per `spec-license-system.md` §4. This step did not exist anywhere in this document before the license-registry feature surfaced it — `app.setup` scaffolds a complete new project and had no license-handling step at all, which is a real gap independent of and predating the multi-license design.
7. **Deliberately does not write `.gitmodules`** — per the Phase 5 fix, `getGitmodulesTemplate()` with zero modules returns an empty string, and a project with no submodules yet shouldn't have a `.gitmodules` file at all; the file is created naturally, as a side effect of git's own `submodule add` command, the first time `git.addSubmodules` (Phase 4) actually links a layer in.
8. Create an empty `layers/` directory.
9. If git init requested (default: yes): `githubService.initRepo({ cwd, defaultBranch: resolvedBranch, userName: resolvedName, userEmail: resolvedEmail })`, then `githubService.createCommit(cwd, 'Initial commit', ['.'])`.
10. If install requested: `executeInstall(cwd)` (§1.2 — the same shared helper `app.run`/`nuxt.manageEnv` use, not a fourth reimplementation).
11. Print a "what's next" summary pointing at `nuxt.createLayer`.

### 3.2 Test Scenarios

| ID | Scenario | Expected Outcome |
|---|---|---|
| AS-01 | Target already has a `package.json` | Refused immediately, nothing written |
| AS-02 | Full scaffold, git + install both confirmed | All eleven template-backed files written; `initRepo` + `createCommit` called; `executeInstall` called |
| AS-03 | No `.gitmodules` written under any circumstance | Confirmed absent from output regardless of other flags — this command never writes that file |
| AS-04 | Identity resolution | `.env.example`'s `AUTHOR_NAME`/`AUTHOR_EMAIL` fields reflect whatever `resolveOrPrompt` returned, not the generic placeholder — proves the resolved values actually flow through to the template call, not just to the git config |

---

## 4. `nuxt.createLayer` — Standalone Layer Project

**Status:** Major re-scope, now made fully concrete against every dependency it needs.

### 4.1 Functional Logic

1. Resolve name/purpose (flags or prompts, normalized per the original legacy behavior — trim/lowercase).
2. Resolve target path: prompt for a location **outside** the current project if run from inside a monorepo (default suggestion: a sibling directory), or accept `--path` directly. Refuse if the target exists and is non-empty.
3. Resolve `author.name`/`author.email` via `resolveOrPrompt`.
4. **Scaffold a genuinely standalone project**, using the layer-mode templates with the Phase 5 `standalone: true` extension: `packageJsonTemplate({ target: 'layer', standalone: true, ... })`, `tsconfigTemplate` (layer), `gitignoreTemplate` (layer, Phase 5 fix applied), `nuxtConfigTemplate` (layer), plus `vitestConfigTemplate`/`envTemplate` — reused from the project-mode set even though this is a layer, since a standalone layer needs the same independent test/env setup a root project does. **Correction, made after the full Templates audit (`spec-templates-full.md` §1):** `vitestConfigTemplate` here means `rootConfigTemplate.ts`'s Nuxt-test-utils-based version specifically, for the same reason given in `app.setup`'s step 4 above — a standalone layer is, for testing purposes, indistinguishable from a root project. `vitestSetupTemplate` (the `@clack/prompts` mocking harness) has no bearing on a scaffolded layer's own test suite and should not be included here at all — it was listed in error; removed. **Also new, per `spec-templates-full.md` §5:** `readmeTemplate({ target: 'layer', standalone: true, ... })` requires the new `standalone` field specified in that document — without it, the generated README would incorrectly instruct the reader to add the layer to a host's `nuxt.config.ts`, directly contradicting this command's own purpose.
5. **AI content, gated on availability (Phase 2 pattern applied here too):** `if (llmService.isAvailable())`, generate README/JSDoc content via `llmService.generate()`; on `false` or on any generation failure, fall back to the same hardcoded defaults the original legacy spec already described — **no behavior change to the fallback itself**, just a proactive check added in front of it, consistent with how `git.commit` was extended in Phase 4.
6. Resolve the license via `resolveOrPrompt('license.defaultType', { kind: 'license-select', ... })` (see `spec-license-system.md` §3), then write `LICENSE` via `getLicenseTemplate(resolvedId, { year, author, email })` — **replaces** the previously hardcoded `mitLicenseTemplate` call.
7. `githubService.initRepo({ cwd: layerPath, defaultBranch: resolvedBranch, userName, userEmail })`, then `createCommit(layerPath, 'Initial commit', ['.'])`.
8. **If `--remote` (or confirmed interactively):**
   - Resolve `github.defaultOrg`/`github.defaultVisibility` via `resolveOrPrompt`.
   - `const repo = await githubService.createRepo({ name: layerName, org: resolvedOrg, private: resolvedVisibility === 'private' });` (Phase 2).
   - `await githubService.addRemote(layerPath, 'origin', repo.clone_url);` (§1.1 — the new method this command specifically needs).
   - `await githubService.push(layerPath, 'origin', resolvedBranch);`
   - **Failure isolation:** if remote creation or the push fails, the already-successful local scaffold and git init are **not** rolled back — report the local repo as usable and the remote step as failed separately, per the original design decision.
9. `executeInstall(layerPath)` (§1.2).
10. Report the path (and remote URL, if created) back, pointing at `git.addSubmodules` for linking into a consuming app.

### 4.2 Test Scenarios

| ID | Scenario | Expected Outcome |
|---|---|---|
| CL-01 | Full flow, no remote | Standalone project scaffolded, git initialized, dependencies installed; no `createRepo`/`addRemote`/`push` calls |
| CL-02 | Full flow, with `--remote` | `createRepo` → `addRemote` → `push`, in that order, using the resolved org/visibility |
| CL-03 | AI unavailable | README/JSDoc content uses the hardcoded fallback; `llmService.generate()` never called |
| CL-04 | Remote creation fails after local scaffold succeeds | Local repo remains intact and reported as usable; remote failure reported separately, no rollback attempted |
| CL-05 | `packageJsonTemplate` output for this command | Contains real `dependencies`/`devDependencies` (not empty objects) — confirms the `standalone: true` flag from Phase 5 is actually being passed |

---

## 5. `nuxt.extractDocs` — Generate Layer Documentation Report

**Status:** New. Built against `codeService` directly, per the original recommendation — this is the first real consumer of the Strategies/`codeService` stack anywhere in the codebase.

### 5.1 A Design Decision: Hybrid, Not "Always `codeService`"

`codeService.inspect(filePath)` calls a strategy's `findDocumentableBlocks()`, which — confirmed by reading `TypescriptStrategy`'s real implementation in an earlier phase of this project — returns **every** matched export with a `hasDoc: boolean` flag, not just undocumented ones. That's exactly what a documentation report needs (list everything, note what's documented), and it's directly reusable with no modification for `.ts`/`.js`/`.vue` files.

But `package.json` and `.md` files don't have "exported code blocks" in any sense `findDocumentableBlocks()` was designed for — forcing them through that abstraction would be a worse fit than the legacy spec's own simple, direct handling (blockquote a `package.json`'s `description` field; truncate a `.md` file to its first 20 lines). **This command is a deliberate hybrid**: `codeService.inspect()` for genuine code files, the legacy spec's original special-casing preserved as-is for `package.json`/`.md`.

### 5.2 Functional Logic

1. Validate `layers/` exists.
2. `multiselect` for which extensions to include, offering exactly the set `getStrategyForFile()` supports (`.ts`, `.js`, `.vue`, `.css`, `.html`, `.json`) plus `.md` and `package.json` as their own special-cased entries.
3. For each layer, `fileService.listFilesRecursive(layerPath, { extensions: selectedExtensions })` (§1.1 — the new shared method) replaces the legacy spec's own bespoke `scanFiles()` walker.
4. Per file:
   - `package.json` → parse and blockquote `description` (unchanged from legacy).
   - `.md` → first 20 lines, `"... (truncated)"` if longer (unchanged).
   - Everything else → `const blocks = await codeService.inspect(filePath);` — list each block's name/type/`hasDoc` status. **If `llmService.isAvailable()`**, additionally generate a whole-file AI summary (`llmService.generate()` on the first 2000 chars, prefixed `**AI Summary:**`) exactly as the legacy spec described; if unavailable, this section is simply omitted from that file's report entry rather than showing a "failed" message — there's a real difference between "AI declined to summarize this" (worth reporting as a failure) and "AI was never going to be attempted" (not worth flagging as if something went wrong).
5. Assemble the Markdown report with a table of contents, write to `docs/reports/layer-report-<timestamp>.md`.

### 5.3 Test Scenarios

| ID | Scenario | Expected Outcome |
|---|---|---|
| ED-01 | `.ts` file with two exports, one documented | Report shows both, with accurate `hasDoc` status for each — proves `codeService.inspect()` integration works, not just that it's called |
| ED-02 | `package.json`/`.md` handling | Unchanged output format from the legacy spec's own description — confirms the hybrid approach didn't regress these two cases while fixing the code-file case |
| ED-03 | AI unavailable | Code file entries appear with block listings but no AI Summary section — no "(AI Summarization failed...)" message, since nothing was attempted |
| ED-04 | `.vue` file | Routed through `VueStrategy` via `getStrategyForFile()`, same as any other supported extension — no `.vue`-specific logic needed in this command itself, confirming the whole point of the Strategy pattern |

---

## 6. `nuxt.manageEnv` — Manage Environment

**Status:** New. Owns the mechanics `app.run` (§2) reuses.

### 6.1 Functional Logic

Interactive menu: **Clean** (multiselect from `['.nuxt', '.output', '.cache', 'node_modules', 'dist']`, then `executeClean` with the selection, §1.2) / **Reinstall** (`executeInstall` directly) / **Reset** (confirm → `executeClean` with **all** targets → `executeInstall`) / **Back**. Headless: `--clean`/`--reinstall` flags map directly to the corresponding action, skipping the menu.

### 6.2 Test Scenarios

| ID | Scenario | Expected Outcome |
|---|---|---|
| ME-01 | Interactive Clean, partial selection | `executeClean` called only with the selected subset |
| ME-02 | Reset | `executeClean` called with the full target list, then `executeInstall` called, in that order |
| ME-03 | Headless `--clean` | Menu never shown |

---

## 7. `nuxt.addFile` — Add Optional Project File

**Status:** New, small. Backed by the Phase 5 `netlifyTomlTemplate.ts`.

### 7.1 Functional Logic

1. Registry: `{ 'netlify.toml': { template: getNetlifyTomlTemplate, description: '...' } }` — a plain object map, extensible by adding entries, not a class hierarchy (deliberately minimal for a one-entry registry).
2. Resolve target file name from the positional arg or an interactive `select()` over registry keys.
3. `fileService.exists()` check — refuse unless `--force`.
4. Call the matched template function, `fileService.write()` the result.

### 7.2 Test Scenarios

| ID | Scenario | Expected Outcome |
|---|---|---|
| AF-01 | `am nuxt addFile netlify.toml`, file doesn't exist | Written successfully |
| AF-02 | File already exists, no `--force` | Refused, nothing overwritten |
| AF-03 | Unknown file name | Registry keys listed, nothing written |

---

## Final Architectural Notes

- Three new service methods were needed this phase (`fileService.deleteDir`, `fileService.listFilesRecursive`, `githubService.addRemote`) — each confirmed necessary by directly checking that no existing method already covered the need, consistent with the discipline established in every prior phase rather than assumed from the higher-level design alone.
- §5.1's hybrid design for `extractDocs` is worth calling attention to as a considered *departure* from "always prefer the generic stack" — `codeService` is the right tool for genuine code files and the wrong tool for `package.json`/`.md`, and forcing uniformity where the underlying data doesn't fit would have been a worse outcome than the deliberately mixed approach specified here.
- Per the roadmap, **Phase 7 is next** — the Utils domain (`utils.autoDoc`, `utils.autoVersion`, `utils.validateHeaders` via `codeService`/Strategies; `utils.addContributor`; `utils.cleanLogs`) — which will be the second and third real consumers of `codeService`, and the first consumers of this phase's new `fileService.listFilesRecursive()` method, exactly as anticipated in §1.1.
