# AppManager Design Reconciliation Audit

## 1. Purpose

This document records the reconciliation of the new root Design Specification against the three principal legacy design sources:

- `app-manager-design-specification-overview-v01.md`;
- `20260822-1843-app-manager-comprehensive-specification-v02.md`;
- `20260822-2051-implementation-roadmap-v01.md`.

The audit exists to provide a zero-information-loss disposition before any of those legacy documents are retired.

Each meaningful topic is classified as one or more of:

- **retained in design** - durable system intent already represented by `docs/appmanager-design-specification-v01.md`;
- **move to functional** - behavioural requirement that should be specified below the Design Specification;
- **move to detailed design** - command, component, interface, algorithm, dependency, or internal interaction design;
- **move to implementation** - source-specific fact, current implementation state, migration action, concrete path, package, method signature, audit finding, or technical debt;
- **proposal** - useful idea that is not yet approved as a normative requirement;
- **obsolete** - superseded terminology, stale structure, incorrect naming, or historical implementation framing that should not be carried forward as current authority.

A topic may have more than one disposition where the source mixes abstraction levels.

---

## 2. Reconciliation Principles

This audit applies the following rules:

1. Durable product and architectural intent belongs in the Design Specification.
2. User-visible behaviour belongs in Functional Specifications.
3. Internal component and command design belongs in Detailed Design Specifications.
4. Current source-code facts and migration work belong in Implementation Specifications or implementation audits.
5. Unapproved future ideas remain proposals until deliberately accepted.
6. Superseded terminology and demonstrably stale implementation statements are not propagated as normative design.
7. Unique information is not discarded merely because the document containing it is stale.
8. Historical documents are not safe to retire until every meaningful item has a destination or explicit obsolete disposition.

---

## 3. Source A - Design Specification Overview Reconciliation

Source: `docs/design/app-manager-design-specification-overview-v01.md`

### 3.1 System Identity and Purpose

| Source information | Disposition | Destination / rationale |
|---|---|---|
| AppManager manages Nuxt monorepos | retained in design | Root Design Specification sections 1 and 2 |
| Git synchronisation, layer management, quality, documentation, versioning and AI-assisted workflows form a unified product surface | retained in design | Sections 1, 2 and 10 |
| Interactive TUI and Headless operation | retained in design | Section 4 |
| GUI absent from legacy source | obsolete as complete interaction model | New design adds GUI as a proposed first-class adapter |
| Product described as a lean Git/script helper with a larger mostly unimplemented vision | move to implementation | This is implementation status, not product intent |
| Absolute application entry-point path | move to implementation | Machine-specific source path |

### 3.2 Five-Layer Architecture

| Source information | Disposition | Destination / rationale |
|---|---|---|
| Services as foundational reusable capabilities | retained in design | Section 6.2 |
| Scanners as lexical/structural source readers | retained in design | Section 6.3 and section 7 |
| Strategies as file-type-specific inspection and mutation components | retained in design | Section 6.4 and section 7 |
| Templates as generators of new artefacts | retained in design | Section 6.7 and generation/mutation invariant |
| Orchestrators as composers/delegators for composite concerns | retained in design | Section 6.5 |
| These five component families constitute the complete application architecture | obsolete | Replaced by subsystem/component-family model including commands, resolvers, domain engines, registries, configuration and presentation adapters |
| `five-layer architecture` terminology | obsolete | Explicitly retired by root Design Specification and documentation guide |

### 3.3 Application Invocation

| Source information | Disposition | Destination / rationale |
|---|---|---|
| AppManager may be invoked from a managed project's package scripts | move to functional | Valid invocation capability, but not defining system architecture |
| Exact `package.json` script example using `tsx scripts/tui/app.ts` | move to implementation | Concrete integration mechanism and stale path risk |

### 3.4 AppManager-Owned Directory Structure

| Source information | Disposition | Destination / rationale |
|---|---|---|
| Dedicated `app_manager/` management area | retained in design | Section 8.4 and section 9 |
| Tool-level and project-level AppManager data | retained in design | Section 8 |
| Two-tier configuration with project overrides | retained in design | Section 8 |
| Shared configuration should not require secrets to be committed | retained in design | Configuration/state principle; security details to Functional/Detailed Design |
| Exact tool-root directory tree | move to detailed design | Concrete filesystem design |
| Exact project-root directory tree | move to detailed design | Concrete filesystem design |
| Exact locations of `llmRegistry.json`, `repositoryRegistry.json`, logs, templates and license files | move to detailed design / implementation | Needs final lower-level resolution before becoming source paths |
| Comments such as `moved from config/` and `renamed from ...` | move to implementation | Migration history |

### 3.5 Operational Modes

| Source information | Disposition | Destination / rationale |
|---|---|---|
| Interactive TUI | retained in design | Section 4.2 |
| Headless | retained in design | Section 4.3 |
| Concrete `interactiveMode.ts` and `headlessMode.ts` paths | move to implementation | Source-specific |
| GUI | proposal retained in design | Section 4.4 explicitly marks GUI proposed |

### 3.6 Service Inventory

| Source information | Disposition | Destination / rationale |
|---|---|---|
| File I/O service responsibility | retained in design | Section 6.2 |
| Git service responsibility | retained in design | Section 6.2 |
| AI-provider service responsibility | retained in design | Sections 6.2 and 10.4 |
| Logging service responsibility | retained in design | Sections 6.2 and 12.8 |
| Process-execution service responsibility | retained in design | Sections 6.2 and 12.9 |
| Code-intelligence coordinator concept | retained in design | Section 7; exact coordinator design moves lower |
| Configuration service responsibility | retained in design | Section 8 |
| Licensing capability | retained in design | Section 6.8 |
| Character-stream service exists as a stub | move to implementation | Current implementation status |
| Exact service filenames and source directories | move to implementation | Concrete source structure |
| `jsonc-parser`, `simple-git`, JSON mode and exact service implementation details | move to implementation | Concrete dependencies/behaviour |

### 3.7 Scanner Inventory

| Source information | Disposition | Destination / rationale |
|---|---|---|
| Hand-written scanner/tokenizer concept | retained in design | Sections 6.3 and 7 |
| TypeScript, CSS, HTML and JSON are existing supported scanner families | move to detailed design / implementation | Exact supported set should be documented below root design |
| `BaseScanner` cursor, line/column, lookahead and character-classification mechanics | move to detailed design | Component algorithm |
| Exact token kinds and flat token-stream representation | move to detailed design | Component contract |
| Exact scanner paths/class names | move to implementation | Source-specific |

### 3.8 Strategy Inventory

| Source information | Disposition | Destination / rationale |
|---|---|---|
| File-type strategy pattern | retained in design | Sections 6.4 and 7 |
| Shared conceptual operations for metadata, headers, documentable blocks and documentation injection | move to detailed design | Interface contract |
| Exact `ICodeStrategy` method names | move to detailed design / implementation | Contract needs deliberate lower-level specification |
| Extension-to-strategy registry | retained in design conceptually | Sections 6.9 and 13.3 |
| Exact singleton registry implementation | move to implementation | Source-specific |

### 3.9 Template Inventory

| Source information | Disposition | Destination / rationale |
|---|---|---|
| Templates generate new content rather than parse existing source | retained in design | Sections 6.7 and 12.5 |
| Header, package, Nuxt config, gitignore, TypeScript config, environment, license and README generation | move to functional | Required generated artefact catalogue |
| Exact template filenames/functions | move to detailed design / implementation | Component/source-specific |

### 3.10 Orchestrator Inventory

| Source information | Disposition | Destination / rationale |
|---|---|---|
| Composite files may be handled by orchestration/delegation | retained in design | Sections 6.5 and 7.6 |
| Vue source can delegate script-region processing to TypeScript capability | move to detailed design | Concrete composite-file design |
| Exact extraction/re-splicing and line-offset mechanics | move to detailed design |
| Only one orchestrator currently exists | move to implementation | Current-state audit |
| Exact `VueStrategy` location | move to implementation | Source-specific |

### 3.11 License Engine and Resolvers

| Source information | Disposition | Destination / rationale |
|---|---|---|
| License Engine exists as an intended architectural concern | retained in design | Section 6.8 |
| Resolvers exist as an intended architectural concern | retained in design | Section 6.6 |
| Blank/incomplete legacy sections | obsolete | Replaced by explicit design responsibilities |
| Incorrect License Engine path under orchestrators | obsolete | Not propagated |

### 3.12 Command Domains

| Source information | Disposition | Destination / rationale |
|---|---|---|
| `app` domain | retained in design | Section 10.1 |
| `docs` domain | retained in design | Section 10.2 |
| `git` domain | retained in design | Section 10.3 |
| `ai` domain | retained in design | Section 10.4 |
| `nuxt` domain | retained in design | Section 10.5 |
| `quality` domain | retained in design | Section 10.6 |
| `utils` domain | retained in design | Section 10.7 |
| `settings` domain | retained in design | Section 10.8 |
| Inconsistent legacy capitalisation `AI` and `Settings` | obsolete | Canonical machine-facing domain identifiers are lowercase |

### 3.13 App Commands

All detailed command behaviours below are **move to functional** unless otherwise noted:

- initialise environment;
- post-installation operation;
- build;
- preview;
- local development execution;
- clean generated caches/state;
- empty/reset generated installation/build state;
- reinitialise by composing reset, install and build;
- create a new application;
- offer minimal, complete or custom creation choices;
- create/provision a new Nuxt layer.

Exact `pnpm` command strings are **move to implementation** unless package-manager behaviour is deliberately constrained by a Functional Specification.

### 3.14 Documentation Commands

The following are **move to functional**:

- document the complete application;
- document application source;
- document all layers;
- document a selected layer;
- document tests;
- document a selected file;
- provide interactive file selection where TUI is used.

The root Design Specification retains the Docs domain and structural-documentation intent without enumerating every command contract.

### 3.15 Git Commands

The following are **move to functional**:

- show Git configuration;
- initialise repository;
- commit;
- manage commits;
- add submodules or managed repository relationships;
- initialise layer repositories;
- delete remote repositories;
- push all;
- push to selected remote;
- synchronise a repository;
- synchronise the project;
- scoped repository synchronisation.

Legacy duplicate names such as `pushCommand`, `Sync Command` and `Sync Repo` are **obsolete as authoritative command naming** until canonical command identifiers are established in Functional/Detailed Design Specifications.

### 3.16 AI Commands

The following are **move to functional**:

- list project AI instruction documents;
- create a project AI instruction document;
- delete a project AI instruction document.

Examples such as `CLAUDE.md` and `GEMINI.md` are useful functional examples and should be retained at the Functional Specification level.

### 3.17 Nuxt Commands

The following are **move to functional**:

- manage `nuxt.config`;
- list configuration entries;
- add configuration;
- remove configuration.

Exact source mutation mechanism is **move to detailed design**.

### 3.18 Quality Commands

The following are **move to functional**:

- run all tests;
- run unit tests;
- run end-to-end tests;
- run coverage;
- run test UI.

Exact Vitest command strings and timeouts are **move to implementation**, unless later made normative configuration defaults.

### 3.19 Utility Commands

The following are **move to functional**:

- check headers;
- repair headers;
- manage contributors;
- automatic documentation;
- automatic versioning;
- clean logs;
- validate headers.

The mapping from these commands to strategies and code-intelligence services is **move to detailed design**.

### 3.20 Settings Commands

The following are **move to functional**:

- manage author name, email, telephone and URL;
- manage funding type and URL;
- manage bug-reporting metadata;
- manage repository type and URL;
- manage application version, description, privacy, type, license and keywords;
- create/read/update/delete environment variables;
- list and add contributors including name, email and URL;
- create/delete licenses;
- list/add/delete templates.

Storage schemas, precedence and resolver behaviour are **move to detailed design**.

### 3.21 Legacy Code-Intelligence Workflow

| Source information | Disposition | Destination / rationale |
|---|---|---|
| Existing source and generated source require different mechanisms | retained in design | Sections 7 and 12.5 |
| Scanners feed source understanding | retained in design | Section 7 |
| Strategies inspect/mutate existing source | retained in design | Section 7 |
| Orchestrators compose specialised capabilities | retained in design | Sections 6.5 and 7 |
| `codeService` is the single concrete entry point | move to detailed design | Requires deliberate component contract |
| Exact `inspect`, `updateHeader`, `generateDocFor` methods | move to detailed design / implementation |
| None of this is consumed by commands yet | move to implementation | Historical/current audit status |
| Command-to-component wiring table | move to detailed design as intended wiring; move to implementation for actual wiring status |

---

## 4. Source B - Comprehensive Specification Reconciliation

Source: `docs/design/20260822-1843-app-manager-comprehensive-specification-v02.md`

This source deliberately combines requirements, reverse-engineered legacy specifications, current implementation audit, architectural appraisal and proposals. It therefore requires the most aggressive separation by abstraction level.

### 4.1 Source Provenance and Reliability

| Source information | Disposition | Destination / rationale |
|---|---|---|
| Source was synthesised from many AI-generated reverse-engineering documents and direct source audit | move to implementation/audit history | Important provenance, not system design |
| Some source specifications describe removed `.ts.old` files | move to implementation/audit history | Explains uncertainty of legacy behaviour |
| Multiple concatenated revisions may disagree | move to implementation/audit history | Source-quality warning |
| Gap analyses compare richer legacy behaviour with leaner current code | move to implementation | Useful migration evidence |
| Small working core / larger unwired body framing | move to implementation | Status statement, not design authority |

### 4.2 Command Infrastructure

| Source information | Disposition | Destination / rationale |
|---|---|---|
| Commands share a common base contract | retained in design conceptually | Root design requires coherent command model; exact base class moves lower |
| Central command discovery/registry | retained in design | Section 5.3 |
| Command metadata contains identity/domain/name/visibility | move to detailed design | Command contract |
| `isEnabled` availability gating | move to functional / detailed design | Behaviour plus command contract |
| Registry lookup/filter/sort behaviour | move to detailed design | Internal component behaviour |
| Exact `BaseCommand` TypeScript signature | move to detailed design / implementation |
| Exact `CommandRegistry` methods and singleton implementation | move to implementation |
| Bootstrap registration and `process.argv` dispatch | move to implementation |
| Hard-coded command registration coupling | move to implementation | Technical debt |
| Proposed loader/auto-discovery refactor | proposal | Evaluate during command infrastructure Detailed Design |

### 4.3 Cross-Cutting Implementation Findings

All of the following are **move to implementation** unless deliberately elevated by later design work:

- absence of dependency injection;
- module-level singleton imports;
- `catch (error: any)` usage;
- current stateless command implementation;
- `@clack/prompts` usage;
- `picocolors` usage;
- `consola` legacy usage;
- `simple-git` usage;
- exact headless/interactive spinner implementation.

The durable principle that presentation logic should be separated from shared command behaviour is **retained in design**.

### 4.4 Application Script Execution

| Source information | Disposition |
|---|---|
| Execute a selected project package script | move to functional |
| Detect package manager | move to functional |
| Lockfile detection priority and exact commands | move to detailed design / implementation |
| Preserve interactive child-process TTY where required | move to functional / detailed design |
| Exact `execSync` implementation | move to implementation |
| Current return-type mismatch | move to implementation |

### 4.5 Application Setup

The following legacy behaviours are preserved as **move to functional** candidates:

- provision a fresh environment;
- create `.env` from `.env.example` when appropriate;
- install dependencies;
- initialise/synchronise managed repositories;
- optionally create recommended editor configuration;
- do not overwrite existing user editor settings;
- abort dependent setup stages after critical installation failure.

Exact prompts, libraries, spinner behaviour and source functions are **move to implementation**.

Whether editor configuration belongs in core AppManager setup remains a **proposal requiring confirmation**.

### 4.6 Git Synchronisation

| Source information | Disposition |
|---|---|
| Synchronise root repository | move to functional |
| Deep synchronisation may include managed submodules/layers | move to functional |
| Global/root/local/selective scopes | proposal, with global/full sync retained as current design candidate |
| Safe default should avoid monorepo drift | retained in design principle / move to functional for exact rule |
| `--all`, `--root-only` flags | move to functional if retained |
| Selective TUI multiselect | move to functional |
| Exact `simple-git` pull/submodule calls | move to implementation |
| Streaming Git output in Headless mode | move to functional / detailed design |
| Current `syncRepo` implementation uncertainty | move to implementation |

### 4.7 Git Push

The following are **move to functional**:

- detect configured remotes;
- allow selected remote(s);
- preserve multi-remote push capability;
- resolve target branch;
- report per-remote results;
- ensure Headless failures produce meaningful failure status.

Exact service methods, spinner behaviour and current swallowed-error defect are **move to implementation**.

### 4.8 Git Commit and AI-Assisted Commit

The following are **move to functional**:

- inspect repository status;
- stage selected/all changes under user control;
- accept explicit commit messages;
- optionally generate commit messages using AI;
- obtain staged diff context;
- permit review/edit/rejection of generated messages;
- provide manual fallback when AI is unavailable, rejected, or fails;
- avoid sending unbounded or inappropriate source context to an AI provider.

The following are **move to detailed design**:

- provider availability resolution;
- context sanitisation/truncation policy;
- staged-diff acquisition contract;
- commit-message validation.

The temporary `createCommit(..., 'temp', ['.'])` staging workaround is **move to implementation** and should not become normative design.

### 4.9 Remaining Legacy Git Commands

Unique behaviours described for repository initialisation, configuration display, submodule management, layer repository initialisation, remote deletion and project-wide operations are **move to functional**.

Hard-coded organisations, environment variable names, direct GitHub API details and removed legacy implementations are **move to implementation**.

Destructive remote deletion requires explicit safety/confirmation requirements at the Functional level.

### 4.10 Nuxt and Layer Management

Unique intended behaviours are **move to functional**:

- create a Nuxt application tailored to AppManager's layer-based monorepo model;
- create/provision layers;
- support standalone-runnable layer creation where approved;
- manage Nuxt configuration;
- add framework/project files from supported templates.

Template selection, component dependencies and exact generated file sets are **move to detailed design**.

Concrete template modules and package dependency shapes are **move to implementation**.

### 4.11 Documentation Domain

Unique behaviours are **move to functional**:

- document application, code, layers, tests and selected files;
- discover documentable source structures;
- support AI-assisted generation where configured;
- preserve existing source while injecting documentation;
- operate at project-wide and selected scopes.

Strategy selection, block discovery and bottom-up mutation algorithms are **move to detailed design**.

### 4.12 Quality Domain

Unique behaviours are **move to functional**:

- run complete, unit, end-to-end, coverage and UI test workflows;
- expose quality operations to Headless automation;
- propagate meaningful process failure.

Duplicated package-manager/process wrappers are **move to implementation** technical debt.

Shared process execution is already represented as a root Design principle.

### 4.13 Utility Domain

Unique intended behaviour for header checking/repair, automatic documentation, automatic versioning, contributor operations and log cleanup is **move to functional**.

The mapping to `parseMetadata`, documentable-block discovery and source injection is **move to detailed design**.

Legacy regex implementations and current wiring status are **move to implementation**.

### 4.14 Configuration and Settings

The durable two-scope configuration model is **retained in design**.

The following are **move to functional**:

- tool defaults plus project overrides;
- project-shared versus project-local concerns where retained;
- effective-value resolution;
- user-facing setting management;
- environment-variable management;
- contributor and metadata management;
- AI-provider default/fallback behaviour;
- repository defaults.

The following are **move to detailed design**:

- exact precedence chain;
- settings schemas;
- source attribution for resolved settings;
- UI-aware `resolveOrPrompt` behaviour;
- separation between UI-agnostic configuration resolution and presentation prompting.

Exact JSON structures, source files and current config service implementation are **move to implementation**.

### 4.15 Services

Durable service responsibilities are **retained in design**.

Exact service APIs, singleton patterns and dependencies are **move to detailed design / implementation**.

Important unique lower-level items to preserve include:

- asynchronous file I/O;
- JSON/JSONC structure-preserving edits;
- process result containing exit status, stdout and stderr;
- Git repository creation capability;
- repository registry consultation;
- AI-provider availability/default/fallback resolution;
- central logging and redaction/cleanup behaviour;
- code-intelligence coordination.

### 4.16 Scanners

The scanner concept is **retained in design**.

Unique lower-level information to preserve in Detailed Design includes:

- shared base scanner mechanics;
- line/column tracking;
- lookahead and matching;
- token classification;
- TypeScript regex-literal disambiguation;
- existing TypeScript/CSS/HTML/JSON scanner scope.

Current completeness and usage status is **move to implementation**.

### 4.17 Strategies

The strategy concept is **retained in design**.

Unique lower-level information to preserve includes:

- common strategy contract;
- metadata parsing;
- header injection;
- documentable-block discovery;
- function documentation injection;
- extension-based strategy discovery;
- safe multiple-injection ordering.

These are **move to detailed design**.

### 4.18 Templates

The template/generation distinction is **retained in design**.

The generated artefact catalogue is **move to functional**.

Template parameters, standalone layer package shape, deployment template category and exact generators are **move to detailed design**.

Hard-coded author defaults and unfinished `TODO` templates are **move to implementation**.

### 4.19 Orchestrators and Vue

The composite orchestration concept is **retained in design**.

Vue script extraction/delegation/recomposition is **move to detailed design**.

The existing source location and proposal to move VueStrategy between directories are **move to implementation / proposal** respectively.

### 4.20 JSX and TSX

| Source information | Disposition |
|---|---|
| Future source-language extensibility | retained in design |
| JSX/TSX support | proposal |
| JSX-aware scanner requirement | proposal for detailed design |
| Three-way `<` ambiguity and JSX grammar constraints | preserve with proposal as technical rationale |
| `TsxStrategy` | proposal |
| `ReactOrchestrator` | proposal, not assumed necessary |
| Reuse of generic region-of-interest concept | proposal for detailed design |
| Defer until current command architecture is stable | proposal / roadmap |

Nothing in the root Design Specification should imply JSX/TSX support already exists.

---

## 5. Source C - Implementation Roadmap Reconciliation

Source: `docs/design/20260822-2051-implementation-roadmap-v01.md`

This source is primarily a bridge from requirements to build-ready component/test specifications. Most of its content therefore belongs below the Design Specification.

### 5.1 Specification Maturity Model

| Source information | Disposition |
|---|---|
| Requirements/design and build-ready component/test specifications are distinct levels | retained conceptually in documentation guide |
| Component Overview, Architecture & Patterns, Dependency Graph, Data Types & Interfaces, Functional Logic | move to detailed design style guidance |
| Mocking Strategy, Test Scenarios, Test Data Requirements | move to implementation/test specification guidance |
| Need to lock paths and signatures before build-ready specs | move to implementation planning |

The new four-level documentation hierarchy supersedes the roadmap's less formal level model.

### 5.2 Directory Consolidation and Gitignore

| Source information | Disposition |
|---|---|
| AppManager-owned management directory | retained in design |
| Roadmap's `app-manager/` directory spelling | obsolete | Canonical directory delimiter rule requires `app_manager/` |
| Shared settings should remain trackable while logs remain ignored | move to functional / detailed design |
| Targeted ignore rules for generated logs | move to detailed design / implementation |
| Exact four files requiring path changes | move to implementation |
| Migration from `config/` to AppManager-owned directory | move to implementation |

### 5.3 Repository Registry Gap

| Source information | Disposition |
|---|---|
| Repository configuration should be registry/configuration driven rather than hard-coded | retained in design |
| Registry must provide organisation/token environment-variable metadata | move to detailed design |
| Current repository registry is unread by code | move to implementation |
| Hard-coded organisation in legacy remote deletion | move to implementation and treat as defect |

### 5.4 Config Service Changes

The following are **move to detailed design**:

- load tool and project settings;
- resolve typed values;
- set/unset settings by scope;
- identify setting source;
- define settings schemas.

Exact filenames and TypeScript schema declarations are **move to implementation**.

### 5.5 AI Service Changes

The following are **move to functional / detailed design**:

- determine whether an AI provider is available;
- resolve active provider;
- support default and fallback providers;
- resolve provider choice from configuration.

Exact method signatures and environment variable names are **move to detailed design / implementation**.

### 5.6 Git Service Changes

The following are **move to functional / detailed design**:

- create remote repository;
- consult repository registry;
- distinguish deep project sync from single-repository pull;
- support repository scope explicitly.

Exact service methods and GitHub API calls are **move to implementation**.

### 5.7 Logging, File and Process Services

| Source information | Disposition |
|---|---|
| Central logging | retained in design |
| Structure-preserving JSONC file operations | move to detailed design |
| Shared process execution | retained in design |
| Docs/Quality must use shared process execution | move to detailed design / implementation |
| Exact logger path changes | move to implementation |
| No file-service changes currently required | move to implementation status |

### 5.8 Settings Resolver

The architectural distinction between UI-agnostic configuration resolution and UI-aware prompting is **retained in design**.

A dedicated `resolveOrPrompt` helper/component and its exact API are **move to detailed design**.

Exact source location is **move to implementation**.

### 5.9 Scanner Changes

No required scanner changes for the currently specified command set is **move to implementation status**.

Deferred JSX/TSX scanner work remains a **proposal**.

### 5.10 Strategy Changes

Safe multiple documentation injection, including bottom-up application to avoid invalidated positions, is **move to detailed design**.

Statements that individual strategies need no changes are **move to implementation status**.

### 5.11 Template Changes

The following are preserved:

- remove hard-coded author identity - **move to detailed design / implementation**;
- resolve template values through configuration - **retained in design principle**;
- targeted AppManager log ignores - **move to detailed design / implementation**;
- complete unfinished Vitest/workspace/environment/editor/npm/Nuxt/Git modules templates - **move to implementation**;
- deployment/CI template category - **proposal / move to functional if approved**;
- standalone-runnable layer package mode - **move to functional if approved, then detailed design**.

### 5.12 Vue Location

Moving VueStrategy from orchestrators to strategies is an unresolved structural idea and remains a **proposal**.

The root Design Specification deliberately avoids prescribing its source directory.

### 5.13 JSX/TSX Scope

The roadmap's JSX/TSX analysis is preserved as a **proposal** with technical rationale.

It should eventually become a dedicated proposal or future Detailed Design document rather than remaining embedded in a retired implementation roadmap.

### 5.14 Phasing and Roadmap Status

Implementation phases, ordering, blockers, and statements about what is currently complete are **move to implementation planning**.

They should not be copied into the root Design Specification.

---

## 6. Cross-Source Conflicts and Resolutions

### 6.1 Application Name

**Conflict:** legacy documents use `App Manager`, `AppManager`, and `app-manager` interchangeably.

**Resolution:** `AppManager` is the canonical application name in prose. Machine-facing names follow the naming rules in `project-documentation-guide-v01.md`.

**Disposition:** alternative prose names are obsolete.

### 6.2 Directory Delimiter

**Conflict:** the overview uses `app_manager/`; the implementation roadmap proposes `app-manager/`.

**Resolution:** project-controlled directory names use lowercase letters, numbers and underscores. The canonical AppManager-owned directory is therefore `app_manager/`.

**Disposition:** roadmap references to `app-manager/` as a directory are obsolete and must be translated when lower-level specifications are written.

### 6.3 Five-Layer Architecture

**Conflict:** legacy sources present services, scanners, strategies, templates and orchestrators as the complete architecture.

**Resolution:** those concepts remain valid component families, but the complete system also includes interaction adapters, command/use-case infrastructure, configuration, resolvers, registries, domain engines and other concerns.

**Disposition:** component responsibilities retained; `five-layer architecture` framing obsolete.

### 6.4 Interaction Modes

**Conflict:** legacy design recognises TUI and Headless only; current design proposes GUI.

**Resolution:** TUI and Headless are established modes. GUI is a proposed first-class mode. All are adapters over shared application capabilities.

### 6.5 Exact AppManager Directory Contents

**Conflict:** legacy overview and roadmap disagree about nesting, log names, registry locations and directory spelling.

**Resolution:** the root Design Specification intentionally fixes only the existence and role of an `app_manager/` management area. Exact contents must be resolved in Detailed Design before migration.

**Disposition:** competing exact trees remain lower-level unresolved design input, not current root-design authority.

### 6.6 Command Counts and Domains

**Conflict:** older comprehensive material describes six primary domains, while the later overview includes `ai` and `settings` as additional domains.

**Resolution:** current Design Specification recognises `app`, `docs`, `git`, `ai`, `nuxt`, `quality`, `utils`, and `settings`.

**Disposition:** earlier domain count is obsolete; unique command behaviour remains preserved for Functional Specifications.

### 6.7 Vue Architectural Location

**Conflict:** Vue handling is described as an orchestrator while roadmap material proposes moving it under strategies.

**Resolution:** the root design defines the orchestration responsibility but does not mandate a source directory.

**Disposition:** source-location move remains proposal/implementation concern.

### 6.8 Settings Storage and Ignore Behaviour

**Conflict:** the need for shared trackable settings conflicts with blanket ignoring of the AppManager-owned directory.

**Resolution:** durable project-shared configuration must be capable of being source controlled, while generated logs/local state should be separately ignored.

**Disposition:** retained as Functional/Detailed Design requirement; exact ignore rules move to Implementation.

---

## 7. Information Already Correctly Retained in the Root Design Specification

The new `docs/appmanager-design-specification-v01.md` already preserves the following durable intent from the legacy sources:

- Nuxt monorepo management as the central product purpose;
- root application and managed-layer awareness;
- domain-oriented commands;
- shared command capabilities across interaction modes;
- TUI and Headless operation;
- proposed GUI operation;
- central command discovery concept;
- services as reusable operational capabilities;
- scanners for lexical/structural source understanding;
- strategies for file-specific inspection and mutation;
- orchestrators for composite concerns;
- resolvers for contextual/configuration resolution;
- templates for new artefact generation;
- License Engine as a specialised domain subsystem;
- registries as discovery/configuration structures;
- distinction between generation and mutation;
- structure-aware and non-destructive modification;
- multi-scope configuration;
- deterministic Headless operation;
- AppManager-owned `app_manager/` management area;
- multi-repository managed-project model;
- `app`, `docs`, `git`, `ai`, `nuxt`, `quality`, `utils`, and `settings` domains;
- application lifecycle workflows;
- repository synchronisation intent;
- documentation workflows;
- source transformation workflow;
- generation workflow;
- quality workflow;
- AI-assisted workflow principles;
- extensibility across commands, domains, file types, providers, templates, resolvers, interaction adapters and domain engines;
- separation of Design, Functional, Detailed Design and Implementation specification responsibilities.

---

## 8. Required Functional Specification Backlog

Before the legacy documents can be retired without losing behavioural requirements, the following Functional Specifications should be created or rationalised:

1. AppManager interaction and command execution behaviour.
2. App domain functional specification.
3. Git domain functional specification.
4. Nuxt domain functional specification.
5. Docs domain functional specification.
6. Quality domain functional specification.
7. Utils domain functional specification.
8. AI domain functional specification.
9. Settings domain functional specification.
10. Configuration resolution and persistence behaviour.
11. Managed-project and managed-repository behaviour.
12. Source inspection, documentation and transformation behaviour.
13. Template and artefact generation behaviour.
14. Licensing behaviour.

Existing command specifications should be mined and rationalised into these rather than rewritten from memory.

---

## 9. Required Detailed Design Backlog

The following Detailed Design responsibilities must retain lower-level information currently embedded in the legacy sources:

1. command infrastructure and registry;
2. command contracts and metadata;
3. interaction adapter contracts;
4. configuration service and settings resolver;
5. settings schemas and precedence;
6. repository/Git service;
7. AI/LLM provider service and provider registry;
8. file service and JSON/JSONC mutation;
9. process service;
10. logging service;
11. code-intelligence coordinator;
12. scanner architecture and token contracts;
13. TypeScript scanner behaviour;
14. CSS scanner behaviour;
15. HTML scanner behaviour;
16. JSON scanner behaviour;
17. strategy interface and strategy discovery;
18. TypeScript strategy including safe multi-injection;
19. JavaScript strategy;
20. CSS strategy;
21. HTML strategy;
22. JSON strategy;
23. Vue composite-source handling;
24. template engine and template catalogue;
25. License Engine;
26. repository registry;
27. AI-provider registry;
28. AppManager-owned directory structure;
29. generated-state and log layout;
30. command-level designs for each approved functional command.

---

## 10. Required Implementation Specification and Audit Backlog

The following information must be preserved outside normative Design/Functional documents:

- current source paths;
- current entry point;
- current command registration mechanism;
- implemented versus stub commands;
- unused or unwired components;
- exact service method signatures as currently implemented;
- current third-party dependencies;
- current package-manager execution mechanisms;
- current Git implementation details;
- current AI-provider implementation details;
- current template TODOs;
- current hard-coded author identity;
- current hard-coded repository organisation/environment names;
- current repository registry wiring gap;
- current error typing and swallowed-error defects;
- current duplicated process/package-manager logic;
- current VueStrategy source location;
- current scanner/strategy usage status;
- exact path migrations required by the eventual `app_manager/` structure;
- `.gitignore` migration;
- test-report path migration;
- current settings/configuration file locations;
- current code-versus-document discrepancies.

This material should be consolidated into an Implementation Specification and, where useful, a separate implementation-status audit.

---

## 11. Proposal Register

The following ideas are preserved but are not automatically promoted to approved requirements by this reconciliation:

| Proposal | Recommended next disposition |
|---|---|
| GUI as third interaction mode | Already recorded as proposed in Design; develop Functional requirements before implementation |
| Scoped Git sync: global/local/selective | Evaluate in Git Functional Specification |
| `--all` and `--root-only` sync flags | Evaluate with scoped-sync behaviour |
| Command auto-discovery/loader | Evaluate in command infrastructure Detailed Design |
| Dependency injection | Evaluate as architecture/implementation decision, not assumed requirement |
| Editor configuration generation during app setup | Evaluate in App Functional Specification |
| Standalone-runnable generated Nuxt layers | Confirm in Nuxt Functional Specification |
| Deployment/CI template category | Confirm in Nuxt/App generation Functional Specification |
| Move VueStrategy source location | Evaluate in code-intelligence Detailed Design |
| JSX/TSX support | Preserve as deferred future capability proposal |
| JSX-aware scanner / TsxStrategy | Develop only if JSX/TSX capability is approved |
| React-specific orchestrator | Do not assume; determine from future JSX/TSX design |

---

## 12. Obsolete Register

The following legacy material is explicitly considered obsolete as current normative design:

- `App Manager` as the application name;
- `app-manager` as a project-controlled directory name;
- uppercase domain identifiers such as `AI` and `Settings` where machine-facing identifiers are intended;
- the claim that AppManager is completely described by a five-layer architecture;
- the phrase `five-layer code-intelligence architecture` as the system architecture;
- blank License Engine and Resolver sections in the old overview;
- the incorrect placement of the License Engine under the orchestrator path;
- duplicate section numbering in the old overview;
- absolute developer-machine paths as design authority;
- statements that current stubs or unwired code define intended product scope;
- legacy command names where multiple competing names exist and no canonical Functional Specification has yet selected one;
- the earlier domain count that omits `ai` and `settings`;
- any implication that TUI-specific prompts define command business logic;
- roadmap path migrations that use hyphenated AppManager directory names.

Obsolete does not mean the historical text must be deleted immediately. It means it must not be treated as current normative authority.

---

## 13. Retirement Readiness

### 13.1 `app-manager-design-specification-overview-v01.md`

**Status: conditionally ready for retirement.**

Its durable system-level design intent is represented in the new root Design Specification, and its lower-level behavioural/component information is explicitly catalogued in this audit.

It should remain available until the first Functional and Detailed Design consolidation pass has materialised the command and component backlogs identified here.

### 13.2 `20260822-1843-app-manager-comprehensive-specification-v02.md`

**Status: not yet ready for deletion.**

It contains substantial command behaviour, legacy implementation evidence, component details and architectural observations that now have explicit destinations but have not all yet been transferred into authoritative lower-level documents.

It may be marked as a legacy reconciliation source once the relevant Functional, Detailed Design and Implementation documents exist.

### 13.3 `20260822-2051-implementation-roadmap-v01.md`

**Status: not yet ready for deletion.**

Its system-level decisions have been reconciled, but it remains a source for implementation migration details, service changes, template gaps, settings work and deferred JSX/TSX rationale.

It can be retired after those items are transferred into the Implementation Specification, Detailed Design Specifications and proposal register documents.

---

## 14. Recommended Next Sequence

The safest zero-information-loss sequence is:

1. Treat `docs/appmanager-design-specification-v01.md` as the current root Design Specification.
2. Correct any editorial defects found during reconciliation.
3. Build domain-level Functional Specifications by mining the existing command specifications and the legacy comprehensive document.
4. Build architecture/component Detailed Design Specifications from the existing specification tree and the component backlog in this audit.
5. Create an AppManager Implementation Specification containing current wiring, paths, dependencies, migration work and implementation status.
6. Extract unresolved future ideas into explicit proposal documents or proposal sections.
7. Perform a second traceability check from each legacy source into the new hierarchy.
8. Mark the three legacy documents as superseded/retired only when every retained item has a durable destination.
9. Delete or archive historical sources only if project policy later determines that source-control history alone is sufficient.

---

## 15. Reconciliation Conclusion

The new root Design Specification is a suitable replacement for the system-level design intent previously scattered across the three legacy documents.

The reconciliation also confirms that those legacy documents contain a substantial amount of information that never belonged in a root Design Specification: detailed command behaviour, concrete component contracts, source paths, implementation status, migration instructions, test concerns, technical debt and future proposals.

That information has not been rejected. It has been classified and assigned a destination.

Accordingly, the correct next step is not wholesale deletion of the legacy sources. It is controlled decomposition into the Functional, Detailed Design and Implementation levels defined by the AppManager documentation hierarchy.

This audit is the disposition record for that decomposition.
