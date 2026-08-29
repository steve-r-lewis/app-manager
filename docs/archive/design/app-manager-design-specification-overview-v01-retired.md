> **Status:** Retired
>
> This document has been superseded and is no longer authoritative.
> All retained requirements and design information have been migrated
> to the current specification hierarchy.

# AppManager

## System Overview & Architecture

App Manager is a domain-driven designed to orchestrate Nuxt 4 monorepos through a five-layer code-intelligence architecture:

* **Services:** The foundational utilities providing file I/O, Git operations, LLM interfacing, and process management.
* **Scanners:** Hand-rolled tokenizers that parse TypeScript, CSS, HTML, and JSON into token streams.
* **Strategies:** File-type specific parsers that implement a shared `ICodeStrategy` interface to inspect and mutate existing code.
* **Templates:** Pure string-generating functions used exclusively for scaffolding brand-new file content.
* **Orchestrators:** Composers, such as `VueStrategy`, that extract regions of composite file formats and delegate them to other strategies.

It unifies Git synchronization, layer/submodule management, code-quality gates, as well as having AI-assisted documentation and versioning presented into one interface, usable both interactively (a guided TUI) and headlessly (for CI/CD pipelines). Core working features include running package scripts, syncing/pushing Git repos, and AI-generated "smart commits." The broader vision—Nuxt layer scaffolding, mass git operations, header/version enforcement, quality-check menus—is fully designed but mostly unimplemented, making it currently a lean git/script helper with an ambitious monorepo-management roadmap still on paper.

Application Entry Point: `D/my_projects/web_apps/app-manager/app/index.ts`

## 1. Application Usage

In a project that uses AppManager, the AppManager application is started through the scripts section of the calling projects `package.json` as per the following example;

```
{
  "scripts": {
    "appTools": "tsx scripts/tui/app.ts"
	...
	...
	...
  },
}
```

---

## 2. Deployed Application Directory Structure

The application will adopt a consolidated directory structure and a flexible, non-destructive configuration model:

* **Directory Restructure:** Dedicated, `app_manager/` directories at both the tool root and project root will centrally house logs and configuration files.
* **Two-Tier Settings:** A global tool-tier settings file and a project-tier overrides file will seamlessly merge user preferences and shared project configurations without committing secrets.

### 2.1 Final Tool-Root Tree

```
<toolRoot>/
└── app_manager
	├── config
	│   ├── llmRegistry.json                 # moved from config/, unchanged content
	│   └── repositoryRegistry.json          # moved from config/, unchanged content
	├── license_engine
	│   ├── opensource-api.json              # 
	│	└── license-templates.json
	├── logs
	│   ├── application                      #
	│   └── test                             # renamed from app_manager/logs/test — vitest report output
	│       └── test-report-<timestamp>.json
	├── settings.json                        # tool-tier settings (the "app-manager" section from §10 of the command specs)
	└── templates
		└── template-repository.json
```

### 2.2 Final Project-Root Tree

```
<targetRoot>/
└── app_manager
	├── config
	│   ├── llmRegistry.json
	│   └── repositoryRegistry.json
	├── logs
	│   ├── application
	│   └── test                             # renamed from app_manager/logs/test/test — vitest report output
	│       └── test-report-<timestamp>.json
	├── settings.json                        # project-tier settings (project-shared + project-local sections)
	└── templates
		└── license-template.json
```

## 2.3. Operational modes

* Interactive CLI menu based operation (interactiveMode.ts).
* Headless (headlessMode.ts).

---

## 4. Application Layered Architecture.

The application uses the concept of

* services
* scanners
* strategies
* templates
* orchestrators

### 4.1 **Services**

`**app-manager/app/services/**` — the foundational, general-purpose utilities everything else is built on. Each wraps one external concern behind a clean API:

* `characterStreamService` — stub, not yet implemented
* `codeService` — the "code intelligence" coordinator (explained below)
* `configService` — single source of truth for runtime state (cwd, git identity, feature flags)
* `fileService` — async file I/O, with smart JSON/JSONC read+write via `jsonc-parser` for non-destructive edits
* `githubService` — wraps `simple-git` for repo init, submodules, staging/commits
* `licenseService`
* `llmService` — unified interface to AI providers (OpenAI etc.), with JSON-mode enforcement
* `loggerService` — centralized console output wrapper
* `processService` — Promise-based `child_process` wrapper (exit codes, stdout/stderr, env/cwd control)

### 4.2 **Scanners**
`app-manager/app/scanners/` — hand-rolled **tokenizers** (lexers), one per language (TypeScript, CSS, HTML, JSON), all extending `BaseScanner`. `BaseScanner` provides the low-level mechanics any tokenizer needs: character-by-character cursor advancement, line/column tracking, lookahead (`peek`/`check`/`match`), and whitespace/digit/alpha classification. Each concrete scanner (e.g. `TypescriptScanner`) turns raw source text into a flat stream of typed `Token` objects — strings, comments, punctuation, keywords, regex literals — without building a full AST.

### 4.3 **Strategies**
`app-manager/app/strategies/` — one per file type (`.ts`, `.js`, `.css`, `.html`, `.json`), each implementing a shared `ICodeStrategy` interface: `parseMetadata`, `injectHeader`, `findDocumentableBlocks`, `injectFunctionDoc`. `baseStrategy.ts` is a small registry (`getStrategyForFile()`) that maps a file extension to its strategy singleton. This is the classic **Strategy pattern** — callers don't care *which* language they're touching, they just ask the registry for "the right strategy" and call the same four methods.

### 4.4 **Templates**
`app/templates/` — pure string-generating functions for **scaffolding new files**: the project's own JSDoc-style file header (`headerTemplate.ts` — literally the function that produces the `@project/@file/@version/...` block seen atop every source file in this repo), plus per-framework/per-language boilerplate (Nuxt project & layer `package.json`, `nuxt.config.ts`, `.gitignore`, `tsconfig.json`, `.env`, MIT license text, README skeletons, etc.). No parsing or logic — just "given these params, return this string."

### 4.5 **Orchestrators**
`app/orchestrators/` — only one exists: `VueStrategy`, which handles **composite file formats**. A `.vue` file isn't one language, it's HTML-like wrapper markup around an embedded `<script>` block. Rather than reimplementing TS parsing, `VueStrategy` extracts the `<script>` region, **delegates entirely to `TypescriptStrategy`** for the actual metadata/header/block-injection logic, then re-splices the result back into the surrounding markup (adjusting line numbers to account for the offset). It's a decorator/delegator over an existing strategy, not a new parsing engine.

### 4.6 **License Engine**
`app-manager/app/orchestrators/` — 

### 4.7 **Resolvers**
`app-manager/app/resolvers/` — 

## 5. Command Surface & Domains

The TUI and the headless CLI manages workflows across multiple distinct domains:

### 5.1. Command Domains

* **app**
* **docs**
* **git**
* **AI**
* **nuxt**
* **quality**
* **utils**
* **Settings**

### 5.2. Commands In Detail

* **app**
	* **Run Application**
		* **Initialise Environment** Executes `pnpm install`
		* **Post Installation** Executes `pnpm run postinstall`.
		* **Build Application** Executes `pnpm run build`.
		* **Preview** Executes `pnpm run preview`.
		* **App Run Locally** Executes `pnpm run dev`.
		* **App Clean** Remove all the caches and then rebuild the types etc.
		* **App Empty** Remove all of the build and setup files and directories including lock files and `/node_modules` directory along with `/dist`
		* **Reinitialise** Run the `App Empty` then initialise with `pnpm install` then finally run `App Build`.
	* **Setup New Application**
		* **New App** Create a new basic application setup similar to `nuxi create` but specific to my idealised layer based `monorepo` architecture.  This process should prompt the user for the files they want to have included, or just select minimal, or select complete.
		* **New Layer** Create and provision a new basic Layer.

* **docs**
	* **Document Application** Generate codebase documentation for the entire project from `app/`, `layer/s` and `tests/`.
	* **Document Code** Generate codebase documentation for the `app/`
	* **Document Layers** Generate codebase documentation for all of the associated `layers/`
	* **Document Layer** Generate codebase documentation for a user selected `layer/[SELECTED-LAYER]` 
	* **Document Test** Generate documentation for the tests in `tests/`
	* **Document File** Generate documentation for the a specific file (user selected), this will require a TUI selector to navigate to and selectiona given file.
.
* **git**
	* **Show Config**
	* **Initialise New Repository**  Executes `git init`.
	* **Commit** 
	* **Manage Commits**
	* **Add Submodules** 
	* **Initialise Layers**  
	* **Delete Remote Repos** 
	* **Push All** 
	* **pushCommand** 
	* **Push To Remote** 
	* **Sync Command** 
	* **Sync Repo** 
	* **Sync Project** 

* **AI**
	* **List AI Doc's** Retrieve and present a list of exising AI doc's in the project root (e.g. CLAUDE.md, GEMINI.md etc.).
	* **Create New Project AI Doc** Create a new AI doc in the project root (e.g. CLAUDE.md, GEMINI.md etc.).
	* **Delete Project AI Doc** Delete an existing AI doc in the project root (e.g. CLAUDE.md, GEMINI.md etc.).

* **nuxt**
	* **Manage nuxt.config** Tools to manage the `nuxt.config.ts` file.
	* **List Config's** 
	* **Add New Config** 
	* **Delete Config** 

* **quality**
	* **Code Test Suite**
		* **Run All** Execute `vitest run`.
		* **Run Unit** Execute ` vitest run tests/unit`.
		* **Run E2E** Execute `vitest run tests/e2e --test-timeout=30000`.
		* **Run Coverage** Execute `vitest run --coverage`.
		* **Run UI** Execute `vitest --ui`.		

* **utils**
	* **Check Headers**
	* **Repair Headers**
	* **addContributor** 
	* **autoDoc** 
	* **autoVersion** 
	* **cleanLogs** 
	* **validateHeaders** 

* **Settings**
	* **Application Defaults**
		* **Authors Name** Manage the developers name.
		* **Authors Email** Manage the developers email.
		* **Authors Telephone** Manage the developers telephone.
		* **Authors URL** 
		* **Funding Details**
			* **Funding Type** 
			* **Funding URL** 
		* **Bug Reporting** 
		* **Repository** 
			* **Repository Type** Type of repository.
			* **Repository URL**
		* **Application Version** 
		* **Application Description** 
		* **Application Privacy Type** 
		* **Application  Type** 
		* **License Type** 
		* **Keyword List** 
	* **Manage .env File**
		* **Create New `Env Vars` File** 
		* **Read .env File** 
		* **Add `Env Vars`** 
		* **Edit `Env Vars`** 
		* **Delete `Env Vars`**
	* **Manage Contributors**
		* **List Contributors** 
		* **Add Contributors**
			* **Contributors Name** 
			* **Contributors Email**
			* **Contributors URL**
	* **Manage Templates**
		* **Create New License** 
		* **Delete Existing License** 
		* **List Templates** 
		* **Add Template** 
		* **Delete Template**

---

## 5. Application Workflow

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

## 6. How the Commands Consume This Stack

Here's the key finding: **none of it is consumed yet.** I checked every import path, and `codeService` — the only consumer of strategies/orchestrators/scanners — is never imported by any file in `app/commands/`. Templates are likewise never imported outside their own folder.

This lines up exactly with what the spec documents described as *planned* commands:

| Stub command (not yet built) | Would consume |
|---|---|
| `nuxt createLayer` | **Templates** (scaffold `package.json`, `nuxt.config.ts`, `.gitignore`, etc.) |
| `utils validateHeaders` | **Strategies** via `codeService.updateHeader()` (fix/sync file headers) |
| `utils autoDoc` | **Strategies** via `codeService.inspect()` + `generateDocFor()` (find & write missing JSDoc) |
| `utils autoVersion` | Strategies' `parseMetadata()` (read/bump `@version` tags) |
| `nuxt extractDocs` | Strategies' `findDocumentableBlocks()` (aggregate code for a doc report) |

# Appendix I

```text
D/my_projects/web_apps/app-manager/app

```