# AppManager Implementation Specification Map

> **Document type:** Project-management implementation map
>
> **Status:** Version 1 working baseline
>
> **Governing plan:** [Implementation Specification Plan](implementation-specification-plan-v01.md)
>
> **Normative destination:** `docs/implementation/`

## 1. Purpose

This document defines how AppManager decides which concrete implementation responsibilities need a primary Implementation Specification.

It is not a list of current files that must be documented. It is a decision tool for grouping the approved Detailed Design into implementation units that are large enough to matter, small enough to review, and concrete enough to map to code, tests, build and runtime artefacts.

The central rule is:

> **An Implementation Specification is justified by a coherent implementation responsibility, not by the existence of a file, class, service, directory or Detailed Design document.**

The current repository is implementation evidence. It does not determine the target structure where it conflicts with the approved Detailed Design.

---

## 2. What Is an Implementation Unit?

For this planning work, an **implementation unit** means a coherent group of code, configuration, tests and runtime wiring that together realise one recognisable implementation responsibility.

An implementation unit may be:

- one module when that module owns a substantial stable boundary;
- several modules that work together behind one boundary;
- an adapter plus its concrete transport or presentation wiring;
- a provider implementation plus its configuration and normalization code;
- a runtime composition concern spanning bootstrap, registration and dependency wiring;
- a persistence or resource mechanism with its schemas and tests.

An implementation unit is **not automatically**:

- one source file;
- one class;
- one exported function;
- one directory;
- one service named in the current code;
- one command;
- one Detailed Design document.

---

## 3. Selection Test

A proposed implementation unit should receive its own primary `IS-*` document when it satisfies the following test.

### 3.1 Mandatory conditions

All of these must be true.

1. **Approved-design traceability** — the unit realises one or more approved Detailed Design contracts.
2. **Concrete implementation boundary** — the unit can be described in terms of specific modules, APIs, runtime wiring, schemas, libraries, providers, build artefacts or tests.
3. **Coherent responsibility** — its contents belong together for a reason stronger than current folder placement or historical naming.
4. **Independent review value** — reviewing the unit separately makes it easier to verify conformance, safety, dependencies or migration.
5. **Stable usefulness** — the specification will remain useful after the immediate implementation session or migration step is complete.

If any mandatory condition is false, the material normally belongs inside another Implementation Specification or in project-management documentation.

### 3.2 Strengthening conditions

A separate `IS-*` document is more strongly justified when one or more of these are true:

- the unit owns a stable API or module boundary used by several consumers;
- it wraps or normalizes an external library, executable, service or provider;
- it contains consequential mutation or safety behaviour;
- it has meaningful lifecycle, cancellation, concurrency or failure semantics;
- it has its own configuration, schema or persistence concerns;
- it requires substantial migration from the current code;
- it has a distinct test strategy or conformance surface;
- it is independently replaceable behind an approved capability boundary;
- its wiring is sufficiently complex that leaving it implicit would create architectural ambiguity.

### 3.3 Reasons not to create a separate specification

A separate `IS-*` document should normally **not** be created merely because:

- a TypeScript file exists;
- a class is large;
- a folder already has a convenient name;
- a command has its own entry-point function;
- a helper is reused in several places;
- a Detailed Design has its own `DD-*` identity;
- a third-party package is used;
- a function has tests;
- a migration task needs tracking.

Those facts may contribute evidence, but none establishes a primary implementation responsibility by itself.

---

## 4. Split and Merge Rules

### 4.1 Split a proposed unit when

A candidate should be divided into separate Implementation Specifications when combining it would cause any of the following:

- two different approved authority boundaries become obscured;
- unrelated external providers or runtime mechanisms are forced into one document;
- the document would have multiple largely independent source/test ownership areas;
- one half could be replaced or migrated without materially changing the other;
- safety, persistence or lifecycle rules differ substantially;
- traceability becomes difficult because most DD contracts apply to only part of the document.

### 4.2 Merge proposed units when

Candidates should be combined when:

- they are always instantiated, wired, changed and tested together;
- separating them would mostly duplicate context and dependency descriptions;
- neither has a meaningful stable boundary without the other;
- one is merely an internal helper or implementation detail of the other;
- the distinction comes only from current folder layout or class naming.

---

## 5. Granularity Rule

The target granularity is **subsystem/component-family implementation**, not file-level documentation.

A useful primary Implementation Specification should normally be capable of answering:

> Which concrete artefacts implement this responsibility, how are they wired, what contracts do they expose, what external mechanisms do they use, how are they tested, and what must change from the current implementation?

If the answer is only “this file exports this function”, the subject is probably too small for a primary `IS-*` document.

If the answer spans most of AppManager and repeatedly switches between unrelated concerns, the subject is probably too large.

---

## 6. Current Repository Evidence

The present `app/` tree contains historical implementation groupings including:

```text
app/
├── commands/
├── license_engine/
├── modes/
├── orchestrators/
├── resolvers/
├── scanners/
├── services/
├── strategies/
└── types/
```

The current `services/` directory includes, among other files:

```text
characterStreamService.ts
codeService.ts
configService.ts
fileService.ts
githubService.ts
llmService.ts
loggerService.ts
processService.ts
```

The current source tree also contains domain-shaped command directories and source scanners for CSS, HTML, JSON and TypeScript.

These are useful implementation facts, but they do not establish the Version 1 target boundaries. In particular:

- `services/` mixes several unrelated DD responsibilities;
- `commands/` reflects current command entry points rather than the full Application Engine/use-case contract;
- `scanners/` is evidence for Source Intelligence but does not by itself define the target Source Intelligence implementation;
- `modes/` is evidence for interaction adapters but must not own application semantics;
- the current `license_engine/` name does not establish a standalone architectural engine if the approved Settings design assigns the relevant responsibility differently.

---

## 7. First-Pass Implementation Responsibility Candidates

The following are **candidate implementation units**, not yet assigned `IS-*` identities. They are derived from the approved DD boundaries and checked against visible repository implementation evidence.

### 7.1 Application runtime and invocation

**Candidate responsibility:** concrete application bootstrap, command registration, invocation request handling, execution-context construction, Application Engine dispatch, canonical result projection and adapter hand-off.

Principal DD inputs:

- DD-1.1 Application Invocation;
- DD-1.2 Execution Outcomes;
- DD-1.5 Application Engine.

Current evidence includes `app/index.ts`, `app/commands/baseCommand.ts`, `app/commands/commandRegistry.ts`, and interaction-mode entry points.

**Initial judgement:** strong candidate for a primary IS because it is the concrete application authority/wiring seam and will affect many later units.

### 7.2 Managed project and configuration resolution

**Candidate responsibility:** concrete managed-project resolution, topology/context representation, configuration-source loading, staged configuration resolution, provenance and immutable operation configuration.

Principal DD inputs:

- DD-1.3 Managed Project;
- DD-1.4 Configuration Resolution;
- DD-1.5 Application Engine bootstrap sequencing.

Current evidence includes `configService.ts`, `settingsResolver.ts` and other project/configuration code to be inventoried.

**Initial judgement:** strong candidate, but the repository inventory must determine whether managed-project resolution and configuration resolution are best implemented in one IS or two closely related IS documents.

### 7.3 Resource access and process execution

**Candidate responsibility:** concrete filesystem/resource access and bounded child-process execution mechanisms.

Principal DD inputs:

- DD-2.1 Resource Access;
- DD-2.2 Process Execution.

Current evidence includes `fileService.ts` and `processService.ts`.

**Initial judgement:** likely two primary implementation units if their APIs, failure semantics and test strategies remain substantially independent; otherwise they may share one infrastructure IS. This requires code-level comparison rather than assumption.

### 7.4 Repository provider implementation

**Candidate responsibility:** concrete repository facts and bounded repository primitives, including the selected Git library/provider binding and normalization layer.

Principal DD input:

- DD-2.3 Repository Capability.

Current evidence includes Git-oriented services and command code, plus the `simple-git` package dependency.

**Initial judgement:** strong candidate because it wraps an external technical provider and is explicitly replaceable behind a capability boundary.

### 7.5 Source intelligence

**Candidate responsibility:** concrete source recognition and structural-fact extraction across supported source forms.

Principal DD input:

- DD-2.4 Source Intelligence.

Current evidence includes `app/scanners/`, `baseScanner.ts`, language/source-specific scanners and `codeService.ts`.

**Initial judgement:** strong candidate. Individual CSS/HTML/JSON/TypeScript scanners should normally be provider/strategy parts of the same IS unless one introduces materially different runtime or provider architecture.

### 7.6 Source transformation

**Candidate responsibility:** concrete bounded transformation-plan representation, edit application, stale-source protection, preservation and source-level validation.

Principal DD input:

- DD-2.5 Source Transformation.

Current evidence includes current strategies and source-editing code to be inventoried.

**Initial judgement:** strong candidate because mutation safety makes this boundary independently reviewable even where it shares parsers or source models with Source Intelligence.

### 7.7 Resource registry and templates

**Candidate responsibility:** concrete registry storage/loading, template identity, validation, parameter binding and rendering.

Principal DD input:

- DD-2.6 Resource Registry and Template.

**Initial judgement:** probable primary IS if the repository contains or requires a coherent registry/template subsystem. Must not be elevated into a generic plugin architecture.

### 7.8 AI provider capability

**Candidate responsibility:** concrete AI provider/model adapters, configuration binding, context/request construction, disclosure controls, response normalization and structured-output validation.

Principal DD input:

- DD-2.7 AI Capability.

Current evidence includes `llmService.ts` and the Google Generative AI dependency.

**Initial judgement:** strong candidate because it wraps an external provider and must preserve provider-independent AppManager semantics.

### 7.9 Quality execution capability

**Candidate responsibility:** concrete test/lint/type/coverage provider invocation and normalized quality evidence.

Principal DD input:

- DD-2.8 Quality Capability.

Current evidence includes package scripts for Vitest/build/typecheck and current Quality command stubs.

**Initial judgement:** probable primary IS, subject to inventory of actual provider implementations.

### 7.10 Documentation capability

**Candidate responsibility:** concrete documentation inspection, models, rendering/generation and validation mechanisms.

Principal DD input:

- DD-2.9 Documentation Capability.

**Initial judgement:** probable primary IS if Version 1 implementation requires a shared documentation mechanism distinct from Docs-domain orchestration.

### 7.11 Nuxt capability

**Candidate responsibility:** concrete Nuxt/layer recognition, configuration inspection and bounded Nuxt-specific technical mechanisms.

Principal DD input:

- DD-2.10 Nuxt Capability.

Current evidence includes Nuxt command code and other Nuxt-oriented implementation to be inventoried.

**Initial judgement:** strong candidate because framework-specific technical semantics should remain encapsulated from domain orchestration.

### 7.12 Domain use-case implementation

The App, Git, Nuxt, Docs, Quality, Settings, AI and Utils domains require concrete use-case/orchestration implementation.

However, **one primary IS per domain is not assumed**.

The domain code should be grouped according to concrete orchestration responsibility. A domain may warrant one IS where its use cases share the same wiring and policy mechanisms, or several where materially different implementation mechanisms exist.

Current command-directory names are not sufficient evidence for the split.

### 7.13 Interaction adapters

**Candidate responsibility:** concrete TUI/interactive and Headless adapters that translate presentation/input concerns into the Application Invocation Contract and project canonical outcomes back to callers.

Principal DD inputs include DD-1.1 and the domain-independent interaction requirements carried through the DD set.

Current evidence includes `app/modes/interactiveMode.ts` and `app/modes/headlessMode.ts`.

**Initial judgement:** likely primary IS because adapter independence and Headless equivalence are important conformance boundaries. Whether TUI and Headless require separate documents depends on how much implementation they share.

### 7.14 Build, package and runtime assembly

**Candidate responsibility:** concrete Node.js/TypeScript package configuration, executable entry point, TypeScript build, package scripts, dependency composition and production runtime assembly.

Governing inputs include ADR-0001 and the complete DD dependency direction.

Current evidence includes `package.json`, `app/index.ts`, TypeScript configuration and package-manager/build scripts.

**Initial judgement:** likely primary IS because this is where the architectural units become one executable application, but it must not become a miscellaneous dumping ground for every implementation detail.

---

## 8. What Does Not Receive a Primary IS by Default

The following should normally be specified inside the owning implementation unit rather than receive their own `IS-*` document:

- individual command files;
- individual scanner implementations;
- small helper services;
- DTO/type-only files;
- one-off validators;
- individual transformation strategies;
- logging helpers unless observability becomes a substantial independent subsystem;
- individual test files;
- configuration files whose meaning belongs to another implementation unit;
- package scripts considered in isolation.

They may still appear explicitly in source mappings and test tables inside a primary Implementation Specification.

---

## 9. Decision Procedure for the Version 1 Map

For each candidate responsibility, the next inventory pass shall record:

| Question | Required result |
|---|---|
| Which DD contracts does it implement? | Explicit contract list |
| Which current files/modules relate to it? | Current-state evidence |
| Which target modules are likely required? | Proposed concrete responsibility, not final code until specified |
| Does it have a stable boundary/API? | Yes / No / Partial |
| Does it wrap an external provider/tool? | Yes / No |
| Does it own mutation/safety/lifecycle concerns? | Yes / No |
| Can it be tested independently? | Yes / No / Partially |
| Does it need substantial migration? | Yes / No |
| Should it be a primary IS? | Yes / No / Merge / Split / Investigate |

A primary `IS-*` identity shall be assigned only after this table has enough evidence to support the boundary.

---

## 10. Ordering Principle

Once the map is complete, writing order should follow implementation dependency rather than DD number.

The likely dependency shape is:

```text
build/runtime foundations
        |
        v
application runtime + invocation
        |
        +-----------------------+
        |                       |
        v                       v
managed project/config     shared technical capabilities
        |                       |
        +-----------+-----------+
                    |
                    v
              domain use cases
                    |
                    v
              interaction adapters
```

This is a planning hypothesis, not yet the final `IS-*` sequence. The repository/DD comparison may refine it.

---

## 11. Current Decision

The immediate answer to “what code units need specifications?” is therefore:

> **Specify the implementation boundaries whose contracts, wiring, provider choices, safety behaviour or migration are important enough that a developer could not reliably derive them from the Detailed Design and source code alone. Do not separately specify every file or class.**

The first-pass inventory identifies approximately fourteen candidate responsibility areas, but those are deliberately not yet fourteen `IS-*` documents. The next pass must merge, split or reject candidates using the selection test in Section 3.

The output of that pass will be the canonical Version 1 `IS-*` register that populates `docs/implementation/implementation-specification-v01.md`.
