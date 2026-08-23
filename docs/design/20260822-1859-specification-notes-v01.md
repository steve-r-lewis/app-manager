```text
D/my_projects/web_apps/app-manager/app

```

# AppManager

A Nuxt 4, nuxt layers based project tooling application.

## Summary
App Manager is a domain-driven CLI tool for orchestrating Nuxt 4 monorepos. It unifies Git synchronization, layer/submodule management, code-quality gates, and AI-assisted documentation and versioning into one interface, usable both interactively (a guided TUI) and headlessly (for CI/CD pipelines). Core working features include running package scripts, syncing/pushing Git repos, and AI-generated "smart commits." The broader vision—Nuxt layer scaffolding, mass git operations, header/version enforcement, quality-check menus—is fully designed but mostly unimplemented, making it currently a lean git/script helper with an ambitious monorepo-management roadmap still on paper.

Application Entry Point: `D/my_projects/web_apps/app-manager/app/index.ts`

In a project that uses AppManager, the AppManager application is started through the scripts section of the calling projects `package.json` as per the following example;

```
{
  "scripts": {
    "appTools": "tsx scripts/tui/app.ts",
    "dev": "cross-env NODE_OPTIONS=--no-deprecation nuxt dev --force",
    "build": "cross-env NODE_OPTIONS=\"--no-deprecation --max-old-space-size=2048\" nuxt build --verbose",
    "preview": "nuxt preview",
    "postinstall": "nuxt prepare"
  },
}
```

## Proposed Application Commands

* app
	* Run Application
		* **Initialise Environment** Executes `pnpm install`
		* **Post Installation** Executes `pnpm run postinstall`.
		* **Build Application** Executes `pnpm run build`.
		* **Preview** Executes `pnpm run preview`.
		* **App Run Locally** Executes `pnpm run dev`.
		* **App Clean** Remove all the caches and then rebuild the types etc.
		* **App Empty** Remove all of the build and setup files and directories including lock files and `/node_modules` directory along with `/dist`
		* **Reinitialise** Run the `App Empty` then initialise with `pnpm install` then finally run `App Build`.
	* Setup New Application (setupApp.ts)
		* **New App** Create a new basic application setup similar to `nuxi create` but specific to my idealised layer based `monorepo` architecture.  This process should prompt the user for the files they want to have included, or just select minimal, or select complete.
		* **New Layer** Create and provision a new basic Layer.

* docs
	* **Document Application** Generate codebase documentation for the entire project from `app/`, `layer/s` and `tests/`.
	* **Document Code** Generate codebase documentation for the `app/`
	* **Document Layers** Generate codebase documentation for all of the associated `layers/`
	* **Document Layer** Generate codebase documentation for a user selected `layer/[SELECTED-LAYER]` 
	* **Document Test** Generate documentation for the tests in `tests/`
	* **Document File** Generate documentation for the a specific file (user selected), this will require a TUI selector to navigate to and selectiona given file.
.
* git
	* **Initialise New Repository**  Executes `git init`.
	* **commitCommand** 
	* **manageCommits**
	* **Add Submodules** 
	* **deleteRemoteRepos** 
	* **initLayers**  
	* **pushAll** 
	* **pushCommand** 
	* **pushToRemote** 
	* **syncCommand** 
	* **syncRepo** 
	* **syncReposAll** 

* nuxt
	* **CreateLayer** 
	* **extractDocs** 
	* **manageEnv** 

* quality
	* **runQuality** 

* utils
	* **addContributor** 
	* **autoDoc** 
	* **autoVersion** 
	* **cleanLogs** 
	* **validateHeaders** 

---

Operational modes
	Interactive CLI menu based operation (interactiveMode.ts).
	Headless (headlessMode.ts).

## Application 5 Layer Architecture.
The application uses the concept of

* services
* scanners
* strategies
* templates
* orchestrators

## The Five Layers

### **Services**
`app-manager/app/services/` — the foundational, general-purpose utilities everything else is built on. Each wraps one external concern behind a clean API:
* `fileService` — async file I/O, with smart JSON/JSONC read+write via `jsonc-parser` for non-destructive edits
* `githubService` — wraps `simple-git` for repo init, submodules, staging/commits
* `llmService` — unified interface to AI providers (OpenAI etc.), with JSON-mode enforcement
* `loggerService` — centralized console output wrapper
* `processService` — Promise-based `child_process` wrapper (exit codes, stdout/stderr, env/cwd control)
* `configService` — single source of truth for runtime state (cwd, git identity, feature flags)
* `codeService` — the "code intelligence" coordinator (explained below)
* `characterStreamService` — stub, not yet implemented

### **Scanners**
`app-manager/app/scanners/` — hand-rolled **tokenizers** (lexers), one per language (TypeScript, CSS, HTML, JSON), all extending `BaseScanner`. `BaseScanner` provides the low-level mechanics any tokenizer needs: character-by-character cursor advancement, line/column tracking, lookahead (`peek`/`check`/`match`), and whitespace/digit/alpha classification. Each concrete scanner (e.g. `TypescriptScanner`) turns raw source text into a flat stream of typed `Token` objects — strings, comments, punctuation, keywords, regex literals — without building a full AST.

### **Strategies**
`app-manager/app/strategies/` — one per file type (`.ts`, `.js`, `.css`, `.html`, `.json`), each implementing a shared `ICodeStrategy` interface: `parseMetadata`, `injectHeader`, `findDocumentableBlocks`, `injectFunctionDoc`. `baseStrategy.ts` is a small registry (`getStrategyForFile()`) that maps a file extension to its strategy singleton. This is the classic **Strategy pattern** — callers don't care *which* language they're touching, they just ask the registry for "the right strategy" and call the same four methods.

### **Templates**
`app/templates/` — pure string-generating functions for **scaffolding new files**: the project's own JSDoc-style file header (`headerTemplate.ts` — literally the function that produces the `@project/@file/@version/...` block seen atop every source file in this repo), plus per-framework/per-language boilerplate (Nuxt project & layer `package.json`, `nuxt.config.ts`, `.gitignore`, `tsconfig.json`, `.env`, MIT license text, README skeletons, etc.). No parsing or logic — just "given these params, return this string."

### **Orchestrators**
`app/orchestrators/` — only one exists: `VueStrategy`, which handles **composite file formats**. A `.vue` file isn't one language, it's HTML-like wrapper markup around an embedded `<script>` block. Rather than reimplementing TS parsing, `VueStrategy` extracts the `<script>` region, **delegates entirely to `TypescriptStrategy`** for the actual metadata/header/block-injection logic, then re-splices the result back into the surrounding markup (adjusting line numbers to account for the offset). It's a decorator/delegator over an existing strategy, not a new parsing engine.

## How They Fit Together

```
Templates  →  produce brand-new file content (scaffolding)
                       │
Scanners   →  tokenize existing file content (built, but currently unused)
                       │
Strategies →  parse/manipulate existing file content, keyed by file extension
                       │
Orchestrators → compose multiple Strategies for multi-language files (Vue)
                       │
              all consumed via →  codeService (the coordinator)
```

`codeService` is the single entry point that ties strategies together: given a file path, it calls `getStrategyForFile()` to get the right strategy, then exposes three high-level operations;  
* `inspect(filePath)` → find undocumented code blocks
* `updateHeader(filePath, header)` → inject/replace the file header
* `generateDocFor(filePath, functionName)` → call `llmService` to write a JSDoc comment, then use the strategy to splice it in

## How the Commands Consume This Stack

Here's the key finding: **none of it is consumed yet.** I checked every import path, and `codeService` — the only consumer of strategies/orchestrators/scanners — is never imported by any file in `app/commands/`. Templates are likewise never imported outside their own folder.

This lines up exactly with what the spec documents described as *planned* commands:

| Stub command (not yet built) | Would consume |
|---|---|
| `nuxt createLayer` | **Templates** (scaffold `package.json`, `nuxt.config.ts`, `.gitignore`, etc.) |
| `utils validateHeaders` | **Strategies** via `codeService.updateHeader()` (fix/sync file headers) |
| `utils autoDoc` | **Strategies** via `codeService.inspect()` + `generateDocFor()` (find & write missing JSDoc) |
| `utils autoVersion` | Strategies' `parseMetadata()` (read/bump `@version` tags) |
| `nuxt extractDocs` | Strategies' `findDocumentableBlocks()` (aggregate code for a doc report) |

So this entire code-intelligence stack — scanners, strategies, orchestrators, templates, and `codeService` — is real, fairly sophisticated infrastructure sitting ready and waiting, but it's currently orphaned: built ahead of the commands that are supposed to call it. The four commands that *do* work (`app.run`, `git.sync`, `git.push`, `git.commit`) only touch `loggerService`, `githubService`, `llmService`, and `fileService` — none of the code-parsing layers.


**Important gap I found while tracing the imports:** the **Scanner layer is built but not actually wired in yet**. `TypescriptStrategy.findDocumentableBlocks()` currently uses plain regex against raw text, not the token stream that `TypescriptScanner` produces. The scanners exist as clean, tested infrastructure (referenced only in `app/types`) — they look like the intended *next* implementation step to replace today's regex-based strategies with real tokenized parsing, but that swap hasn't happened.


