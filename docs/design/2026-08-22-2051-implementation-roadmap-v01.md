# App Manager — Implementation Roadmap

*Bridges the design work done so far (`app-manager-command-specs.md`, the architecture audit) to the build-ready component + test specifications the project already has a convention for, in `docs/developers/specifications/`.*

---

## 0. Status Check — Are We Close?

**Design: yes. Build-ready: not yet, and here's the actual gap.**

Everything specified so far — every command's behavior, the app-config settings model — is requirements-level: *what* each piece should do and why. This project already has an established, distinct format for the next layer down, visible throughout `docs/developers/specifications/`:

- **Part 1 (Component Specification):** Component Overview, Architecture & Patterns, Dependency Graph, Data Types & Interfaces, Functional Logic Specification.
- **Part 2 (Test Specification):** Mocking Strategy, Test Scenarios, Test Data Requirements.

That's the target format for "build-ready." We haven't produced anything in that shape yet for the new/changed work. Before generating those documents at volume, three things need to be locked, because they appear as concrete facts (file paths, method signatures) inside every one of them rather than as design language that can stay loose a while longer:

1. **The directory restructure** — every component spec that touches a file path needs the final path, not a placeholder.
2. **Exact new service method signatures** — `configService`, `llmService`, `githubService` all need real, final signatures before command specs can cite them as dependencies with confidence.
3. **Where JSX/TSX actually lands architecturally** — so it's scoped correctly (as real future work, not a vague aspiration) and doesn't get informally half-designed piecemeal while we're specifying other things.

This document handles all three, then lays out the phased path from here to a full set of Part 1/Part 2 documents, then to implementation.

---

## 1. Directory Restructure

### 1.1 Naming Decision: `app-manager/`, No Dot, Both Roots

You wrote `<project>/app-manager/` without a dot — I'd flagged a dot-prefix question in the last round, and I'm resolving it in favor of no dot, for two concrete reasons found while checking the actual code rather than by preference: the codebase already has a working, undotted `app-monitor/` convention (real file-logging, already gitignored, already referenced in generated project templates), and consolidating that *into* `app-manager/` is explicitly part of what you're asking for. Matching your literal wording and the existing precedent both point the same way, so: **`app-manager/`, no dot, at both the tool root and every target project root.**

### 1.2 Final Tool-Root Tree

```
<toolRoot>/
  app-manager/
    settings.json          # tool-tier settings (the "app-manager" section from §10 of the command specs)
    llmRegistry.json        # moved from config/, unchanged content
    repositoryRegistry.json # moved from config/, unchanged content
    logs/
      session-<timestamp>.log
```

### 1.3 Final Project-Root Tree

```
<targetRoot>/
  app-manager/
    settings.json           # project-tier settings (project-shared + project-local sections)
    logs/
      session-<timestamp>.log
    test-logs/              # renamed from app-monitor/test-logs — vitest report output
```

### 1.4 The Gitignore Problem This Consolidation Creates — and the Fix

Merging logs and settings into one folder creates a real conflict with the settings design from last round: `settings.json`'s `project-shared` section is meant to be **committed** (team-wide facts like `github.defaultOrg`), while `logs/`/`test-logs/` must **never** be committed. A blanket ignore of the whole `app-manager/` folder — which is exactly what the current `**/app-monitor` pattern does — would silently defeat the "shared settings are committed" design the moment the folders merge.

**Fix:** replace the blanket pattern with two targeted entries:
```gitignore
app-manager/logs/
app-manager/test-logs/
```
`app-manager/settings.json` stays trackable. This needs to change in **four places**, all found by direct search rather than assumed:

| File | Current | Change to |
|---|---|---|
| `.gitignore` (App Manager's own repo root) | `**/app-monitor` (line 53) | Targeted entries above |
| `app/templates/frameworks/nuxt/project/gitignoreTemplate.ts` | `**/app-monitor` (line 88) | Targeted entries above |
| `app/templates/frameworks/nuxt/layer/gitignoreTemplate.ts` | `**/app-monitor` (line 88) | Targeted entries above |
| `app/templates/frameworks/nuxt/project/vitestConfigTemplate.ts` | `app-monitor/test-logs/**` and a template-string path building `./app-monitor/test-logs/test-report-...json` | `app-manager/test-logs/**` / `./app-manager/test-logs/test-report-...json` |

### 1.5 Every Other Concrete Code Change the Move Requires

Found by searching the actual source, not inferred:

| File | Change |
|---|---|
| `app/services/llmService.ts` (line 42) | `import registryData from '../../config/llmRegistry.json'` → `'../../app-manager/llmRegistry.json'` |
| `app/services/loggerService.ts` (`_enableFileLogging`, `_cleanupOldLogs`) | `path.join(this._root, 'app-monitor', 'logs')` → `path.join(this._root, 'app-manager', 'logs')`, in both methods |
| `app/modes/interactiveMode.ts` (line 42) | Menu hint text `'Write logs to app-monitor/'` → `'Write logs to app-manager/'` |
| Physical move | `config/llmRegistry.json`, `config/repositoryRegistry.json` → `app-manager/llmRegistry.json`, `app-manager/repositoryRegistry.json`; delete the now-empty `config/` directory |

**One gap this surfaced that isn't just a path rename:** `repositoryRegistry.json` currently isn't read by any code at all — unlike `llmRegistry.json`, which `llmService` actively parses for `apiKeyEnv` names, nothing in `githubService` today consults `repositoryRegistry.json` for its `githubOrg`/`githubToken` env var names. The legacy `deleteRemoteRepos` spec just hardcodes `GITHUB_ORG`/`'steve-r-lewis'` directly, bypassing the registry entirely. This needs real wiring, not just a move — `githubService` needs to actually load and consult this file the same way `llmService` already does with its own registry. Adding this to §2 below as a genuine service change, not a rename.

---

## 2. Required Changes to Existing Services

| Service | Change | Why |
|---|---|---|
| `configService.ts` | Add `loadSettings(toolRoot, targetRoot)`, `resolve<T>(key)`, `setSetting(key, value, section)`, `unsetSetting(key, section)`, `getSettingSource(key)` | Per the app-config settings model — see command specs §10.6 |
| `app/types/services/configServiceTypes.ts` | Add `AppSettingsFileSchema` and its sub-schemas (`AuthorSettingsSchema`, `LlmSettingsSchema`, `GithubSettingsSchema`), following the existing `GitUserConfigSchema`/`AppConfigFlagsSchema` pattern already in this file | Keeps all of configService's data shapes in one types file, consistent with the established one-file-per-service convention across `app/types/` |
| `llmService.ts` | Add `isAvailable(): boolean`, `resolveActiveProvider(): LLMProviderConfig \| null`; extend `initializeDefault()` to also consult `configService.resolve('llm.defaultProvider'/'llm.fallbackProvider')`, not just `process.env.API_MODEL_DEFAULT` | Implements the fallback chain from command specs §10.8 |
| `githubService.ts` | Add `createRepo(name, options)` (calls the GitHub API to create a new remote repo); **new**: actually load and consult `repositoryRegistry.json` for the `githubOrg`/`githubToken` env var names (currently unread by any code); split the existing `syncRepo(cwd, silent)` — keep it as-is to back the `git.syncReposAll` command (root + submodule "deep sync," unchanged behavior), and add a new, narrower `pull(cwd, silent)` for the `git.syncRepo` command (single repo, no submodule step) | `createRepo` needed by `nuxt.createLayer`'s remote-creation step (command specs §5.1); registry consultation closes the gap found in §1.5; the sync split implements the Scoped Sync resolution (command specs §1.1, §4.1–4.3) |
| `loggerService.ts` | Path constant changes only (§1.5) — no new methods needed, it's already a complete, working file-logging implementation with redaction and auto-cleanup | Good news: nothing to design here, just rename |
| `fileService.ts` | No changes required | Already async, already JSONC-capable via `jsonc-parser` — the settings files get surgical, comment/formatting-preserving edits for free |
| `processService.ts` | No interface changes — needs to actually be *called* by `docs.run`/`quality.run` instead of each hand-rolling its own `spawn` wrapper (an implementation fix in those two commands, not an API change here) | Closes the duplicated-`detectPM`/`runScript` gap flagged in the command specs' infrastructure table |
| New file: `app/services/settingsResolver.ts` (or similar) | `resolveOrPrompt(key, { promptConfig, persistTier })` — the shared, UI-aware helper from command specs §10.7 | Kept out of `configService` deliberately, since `configService` should stay UI-agnostic like every other service; this is the one new file in the services layer that isn't an extension of an existing one |

---

## 3. Required Changes to Scanners

**None, for anything specified so far.** TS/CSS/HTML/JSON scanners are complete, self-contained, and nothing in the command specs requires changing their tokenization behavior. The only scanner work on the horizon is the JSX/TSX question — scoped separately in §6, deliberately not folded in here.

---

## 4. Required Changes to Strategies

| Strategy | Change | Why |
|---|---|---|
| `TypescriptStrategy` | Verify (and fix if needed) that `injectFunctionDoc()` handles **multiple injections into the same file safely** — specifically, that later injections don't invalidate the line/index positions of earlier ones | `utils.autoDoc` (command specs §7.2) needs to call this once per undocumented block in a file; if a file has three undocumented exports, injecting the first one shifts every line number below it, which would corrupt the second and third injection's target positions unless insertions are processed bottom-up (the exact ordering concern the legacy `autoDoc` spec's own regex-based approach already handled correctly — the strategy-based replacement needs the same discipline) |
| `JsonStrategy` | None required | Already handles the new settings files' `metadataEntity` envelope via its existing schema recognition — this is a direct, unplanned benefit of the file-format consistency already established |
| `CssStrategy`, `HtmlStrategy`, `JavascriptStrategy`, `VueStrategy` | None required | Nothing in the current command set touches these beyond what they already do |

---

## 5. Required Changes to Templates

| Template | Change | Why |
|---|---|---|
| `app/templates/blocks/headerTemplate.ts` | `author` parameter should resolve via `configService`/the new resolver helper (§2) instead of defaulting to the hardcoded `'Steve R Lewis'` string | Directly closes the personal-identity-hardcoded-into-shared-tooling issue flagged in the architectural appraisal, now that there's an actual settings layer to resolve it from |
| `gitignoreTemplate.ts` (project + layer) | `**/app-monitor` → targeted `app-manager/logs/` + `app-manager/test-logs/` entries (§1.4) | Directory consolidation |
| `vitestConfigTemplate.ts` | Path references updated (§1.4); this is also one of the currently-stub templates that needs full implementation, not just a path edit, since `app.setup` and `nuxt.createLayer`'s standalone-runnability requirement both need a working test setup generated | Blocks §2.2 and §5.1 of the command specs |
| `vitestSetupTemplate.ts` | Full implementation needed (currently `TODO`) | Same blocker as above |
| `pnpmWorkspaceTemplate.ts`, `envTemplate.ts`, `editorconfigTemplate.ts`, `npmrcTemplate.ts`, `nuxtrcTemplate.ts`, `gitmodulesTemplate.ts` | Full implementation needed (currently `TODO`) | Directly blocks `app.setup` (command specs §2.2) — this command cannot be built until these exist |
| **New:** deployment/CI file template category, starting with `netlifyTomlTemplate.ts` | New template, new category directory (e.g. `app/templates/deployment/`) | Backs `nuxt.addFile` (command specs §5.2) |
| `packageJsonTemplate.ts` (layer mode) | Needs a variant or flag producing a genuinely standalone-runnable `package.json` (with `nuxt` as a direct dependency, not just assumed to come from a consuming root) | The current `'layer'` mode is designed to be *consumed by* a root project — `nuxt.createLayer`'s new standalone-first requirement (command specs §5.1) needs a layer that can `pnpm install && pnpm dev` entirely on its own, which is a different dependency shape |

---

## 6. Orchestrators — Current State, and the JSX/TSX Question Properly Scoped

### 6.1 Where Things Actually Stand

Only one orchestrator exists — `VueStrategy`, still sitting in `app/orchestrators/vue/` pending its own previously-noted, not-yet-executed move to `app/strategies/vue/`. I want to be direct about one thing before scoping JSX/TSX: I found no existing code implementing or even directly referencing JSX/TSX support anywhere in the repository — the only hit anywhere is a single line in `JavascriptStrategy`'s own docstring, mentioning `.jsx`/`.mjs` as a *hypothetical* future extension point, not a plan. So this is genuinely new scope, not something partially built that I'd missed — worth saying plainly so we're scoping from the real starting point.

One relevant thing **does** already exist, though, and it's a good sign: `app/types/scanners/sfcTypes.ts` defines a `RegionOfInterest` interface with a generic, open `type: string` field (not a closed Vue-only union) — meaning the type system already anticipates marking arbitrary named spans within a file as "of interest" for some purpose beyond Vue's specific script/template/style blocks. That's a reusable hook, not a coincidence — it's worth building JSX support to fit that existing shape when the time comes.

### 6.2 Why This Isn't Just "Build a `ReactOrchestrator` Like `VueOrchestrator`"

I want to flag a genuine architectural difference before this gets informally assumed to be a smaller task than it is. `VueOrchestrator`'s pattern works because a `.vue` file has **clean, non-overlapping, textually-delimited regions** — `<script>`, `<template>`, `<style>` — found with a simple regex match, extracted as a contiguous string, handed to a specialized strategy, and spliced back. That extraction step is the whole trick, and it works because Vue's SFC format was designed to make it work.

JSX/TSX has no equivalent clean region. JSX is **inline expression syntax embedded directly in otherwise normal TypeScript/JavaScript grammar** — it can appear nested arbitrarily deep inside a function body, inside a conditional, inside an array map callback, anywhere an expression is valid. There's no `<script>`-equivalent tag to regex-match and extract as one block; a `.tsx` file isn't "TypeScript plus a separate JSX region," it's TypeScript *with JSX woven through it*. So the delegate-to-a-sub-strategy-via-text-extraction pattern that makes `VueStrategy` clean doesn't have an equivalent extraction point to hook into here.

The harder, more honest version of what real JSX/TSX support requires is closer to what `TypescriptScanner` already does than what `VueStrategy` does: a genuine tokenizer that understands JSX as first-class grammar, not a hand-off between two separate tools. And it's a harder tokenization problem than anything solved so far — `TypescriptScanner` already correctly disambiguates `/` as division vs. regex-literal-start by checking the preceding token (§10.3 of the architecture audit covers this). JSX needs the same category of disambiguation for `<`, except three-way instead of two-way: `a < b` (comparison), `Array<string>` (generic type parameter), and `<Component>` (JSX element start) are all valid in the same file, sometimes the same line, and a naive regex-based approach — which is what every current strategy uses — would misfire on this constantly.

### 6.3 What Real Support Would Actually Require

Scoped honestly, not minimized:

1. A JSX-aware tokenizer — either a new `TsxScanner extends BaseScanner` or a substantial extension to `TypescriptScanner` — correctly resolving the three-way `<` ambiguity above, plus JSX-specific constructs (attributes, spread props, fragments `<>...</>`, expression containers `{...}`).
2. A `TsxStrategy` (or a genuine extension to `TypescriptStrategy`, following the same "extension point" pattern `JavascriptStrategy` already establishes) capable of finding *React-meaningful* documentable blocks — component functions specifically, not just any exported function — and injecting headers/docs without corrupting JSX syntax in the process.
3. Possibly a `ReactOrchestrator` — but very likely with a different internal shape than `VueOrchestrator`'s extract-delegate-splice pattern, since there's no clean region to extract. More likely a strategy that consumes a JSX-aware token stream directly, using `RegionOfInterest` (§6.1) to mark JSX spans within the token stream rather than extracting them as separate text.

### 6.4 Recommendation: Scope as Deferred Future Work, Reserve the Architectural Home, Don't Design Further Now

This is a meaningfully harder problem than anything else in this roadmap, and — importantly — **nothing in the ~25 commands already specified depends on it**. I'd recommend:
- Log it explicitly as a scoped, deferred item (Phase 9 in §7 below), not designed further until Phases 1–8 are implemented and stable.
- Reserve its architectural home now, at zero cost: `baseStrategy.ts`'s extension-to-strategy map already trivially accepts new `.jsx`/`.tsx` entries whenever the underlying scanner/strategy exist; `app/orchestrators/react/` (or wherever `VueStrategy`'s pending move lands, `app/strategies/react/`) is a one-line addition to create when the time comes.
- Treat `RegionOfInterest` as the confirmed hook point for whatever region-marking JSX support eventually needs, since it's already generalized past Vue specifically.

---

## 7. The Phased Plan

Each phase's deliverable is a set of Part 1 (component) + Part 2 (test) specification documents, in the exact format already established in `docs/developers/specifications/`, followed by implementation against those specs.

| Phase | Deliverable | Depends On |
|---|---|---|
| **0** | Decisions locked (this document) — directory naming, gitignore fix, service signatures, JSX/TSX scoping | — |
| **1** | Directory + path-reference migration (§1) — mechanical, low-risk, done first since every later spec cites these paths as fact | Phase 0 |
| **2** | Component + test specs for the foundational service layer: `configService` settings extensions, `llmService` fallback chain, `githubService.createRepo()` + registry consultation, the new `settingsResolver` helper (§2) | Phase 1 |
| **3** | Component + test specs for `app-config` (command specs §10) — first real consumer of Phase 2, a natural checkpoint to confirm the foundation actually works before building on it further | Phase 2 |
| **4** | Component + test specs for the Git domain consolidation: `git.sync`/`syncRepo`/`syncReposAll`, `git.push`/`pushAll`, `git.commit` (absorbing `manageCommits`), `git.addSubmodules`, `git.initLayers`, `git.deleteRemoteRepos` | Phase 2 (for `createRepo`/registry work feeding `deleteRemoteRepos`) |
| **5** | Template completions (§5) — must land before Phase 6, since `app.setup` and `nuxt.createLayer` cannot be specified in build-ready detail while their required templates are still `TODO` stubs | Phase 1 |
| **6** | Component + test specs for the Nuxt domain: `nuxt.createLayer` (standalone project + own repo), `nuxt.addFile`, `nuxt.extractDocs` (via `codeService`), `nuxt.manageEnv`, `app.setup`, `app.run`'s lifecycle extension | Phases 2, 4 (submodule linking), 5 |
| **7** | Component + test specs for the Utils domain: `utils.autoDoc`, `utils.autoVersion`, `utils.validateHeaders` (all via `codeService`/Strategies — this is the phase that finally gives the Strategies layer real callers), `utils.addContributor`, `utils.cleanLogs` | Phase 4's `TypescriptStrategy` multi-injection fix (§4) |
| **8** | Component + test specs for `docs.run`, `quality.run` | Phase 2 (`processService` consolidation) |
| **9** *(deferred, unscheduled)* | JSX/TSX scanner/strategy/orchestrator work (§6) | Phases 1–8 stable |

---

## 8. Suggested Immediate Next Step

Rather than generating specs for all of Phase 2 at once, I'd suggest fully specifying **one** component end-to-end first — `configService`'s settings extensions are the natural choice, since they're the most foundational and everything from Phase 3 onward depends on their exact shape. That gives us a concrete Part 1 + Part 2 document to check against the existing convention (right level of detail, right structure) before producing the remaining ~40 documents at volume. Want me to draft that one now as the template for the rest?
