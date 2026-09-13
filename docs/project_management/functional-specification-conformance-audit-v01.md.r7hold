# AppManager Functional Specification Conformance Audit v01

## 1. Purpose

This project-management audit evaluates the completed Version 1 Functional Specification set before AppManager proceeds into Detailed Design.

The audit is non-normative. It does not create new product behaviour. Its purpose is to determine whether the current Functional Specifications collectively form a coherent, complete and sufficiently stable behavioural baseline from which permanent internal contracts can be designed.

The audit was performed against the Functional Specification baseline present on `master` after merge of PR #48, whose merge commit is:

`cb5ff4b70554457789550ce953db4be126319d74`

## 2. Governing Authorities

This audit is subordinate to:

1. `docs/project-documentation-guide-v01.md`;
2. `docs/appmanager-design-specification-v01.md`;
3. accepted ADRs, including `docs/decisions/adr-0001-primary-application-runtime.md`;
4. the twelve Version 1 Functional Specifications under `docs/functional/`.

The governing architectural rule remains:

> Delegated execution does not mean delegated application authority.

Functional Specifications define observable AppManager behaviour and ownership. Detailed Design must define permanent internal contracts without redistributing that functional authority accidentally.

## 3. Audited Functional Specification Set

### 3.1 Cross-Cutting Specifications

1. `application-invocation-functional-specification-v01.md`
2. `managed-project-functional-specification-v01.md`
3. `configuration-functional-specification-v01.md`
4. `source-transformation-functional-specification-v01.md`

### 3.2 Domain Specifications

5. `app-functional-specification-v01.md`
6. `docs-functional-specification-v01.md`
7. `git-functional-specification-v01.md`
8. `ai-functional-specification-v01.md`
9. `nuxt-functional-specification-v01.md`
10. `quality-functional-specification-v01.md`
11. `utils-functional-specification-v01.md`
12. `settings-functional-specification-v01.md`

The planned decomposition is therefore complete: four cross-cutting Functional Specifications plus eight domain Functional Specifications.

## 4. Audit Criteria

The audit applies the following tests.

### 4.1 Behavioural Coverage

Each approved Version 1 product domain must have a Functional Specification covering its observable behaviour, including relevant inputs, preconditions, effects, outcomes, failure behaviour, diagnostics and non-interactive behaviour.

### 4.2 Singular Functional Authority

Where legacy material described similar behaviour under multiple commands or domains, the current specification set must establish one authoritative behavioural owner rather than permit parallel implementations with overlapping semantics.

### 4.3 Cross-Cutting Consistency

Domain behaviour must depend on, rather than redefine, the shared rules for:

- invocation;
- managed-project context and managed scope;
- configuration resolution;
- source transformation.

### 4.4 Interaction-Mode Equivalence

Interactive and Headless operation must represent the same application semantics. Presentation differences may exist, but Headless operation must not depend on interactive prompts or silently adopt weaker safety rules.

### 4.5 Scope and Mutation Safety

Discovery, recognition and inspection must not imply mutation authority. Consequential operations must be bounded to explicit managed scope and must not mutate unrelated project state.

### 4.6 Application Authority

Provider, library, process, AI, Git, filesystem, Nuxt, quality and other delegated capabilities may determine technical facts or perform technical work, but AppManager must retain application-level interpretation, policy, acceptance and outcome authority.

### 4.7 Abstraction-Level Conformance

Functional Specifications must define observable behaviour without unnecessarily freezing implementation details such as exact TypeScript classes, SDKs, parser libraries, package-manager commands, filesystem helper APIs, provider SDKs or process topology.

### 4.8 Traceability and Downward Design Readiness

The specification set must provide sufficiently stable behavioural boundaries for later Detailed Design to define permanent internal contracts while preserving traceability to the root Design Specification, ADRs and reconciled legacy behaviour.

## 5. Executive Result

### 5.1 Overall Status

**PASS — suitable to proceed to Detailed Design decomposition.**

No blocking contradiction, unresolved duplicate functional authority or material gap has been identified in the completed Version 1 Functional Specification set.

This does not mean Detailed Design may proceed independently in twelve isolated silos. The principal remaining architectural risk is now **internal duplication**: creating separate component-level implementations of semantics that the Functional layer has intentionally centralized.

### 5.2 Severity Summary

| Severity | Count | Result |
|---|---:|---|
| Blocking | 0 | None identified |
| Major | 0 | None identified |
| Minor functional correction required before Detailed Design | 0 | None identified |
| Detailed-Design guardrails / advisory findings | 7 | Must be carried into decomposition planning |

## 6. Coverage Result

### 6.1 Cross-Cutting Behaviour

The four cross-cutting specifications establish shared behavioural authorities for:

- structured invocation and result semantics;
- interactive/Headless equivalence;
- managed-project identification and explicit managed scope;
- candidate-to-effective configuration resolution;
- safe inspection, planning, generation and mutation of source.

This is the correct architectural shape. These rules should not be cloned into each domain during Detailed Design.

### 6.2 Domain Behaviour

The eight domain specifications cover the approved Version 1 domain set:

- `app` — root-application lifecycle and application-level execution intent;
- `docs` — documentation intent and documentation outcomes;
- `git` — repository intent and repository-scope semantics;
- `ai` — AI-specific project resources and AI-specific application intent;
- `nuxt` — Nuxt-specific project and layer semantics;
- `quality` — quality intent, quality interpretation and quality-gate outcomes;
- `utils` — narrowly bounded cross-cutting maintenance operations;
- `settings` — explicit settings, project metadata and declarative resource management.

No planned Version 1 domain is absent from the Functional layer.

## 7. Ownership Conformance Findings

### 7.1 Settings vs Configuration

**Status: conformant.**

Settings owns explicit persisted value/resource management. Configuration owns how configuration candidates become effective application configuration, including precedence, applicability, validation and provenance.

Detailed Design must preserve this distinction. A Settings storage component must not become the effective-configuration resolver merely because it persists some configuration candidates.

### 7.2 App vs Nuxt

**Status: conformant.**

The `app` domain owns root-application lifecycle intent. Nuxt owns Nuxt-specific layer creation/provisioning and Nuxt composition semantics.

Root application creation may coordinate Nuxt use cases, but must not duplicate Nuxt layer semantics internally.

### 7.3 Nuxt vs Git

**Status: conformant.**

Nuxt integration and repository relationships are distinct concerns. A Nuxt layer may have a repository relationship, but repository initialization, remotes, synchronization and provider-side repository actions remain Git-owned.

Detailed Design must therefore avoid a Nuxt component that directly becomes a second repository-policy authority.

### 7.4 Docs vs Quality

**Status: conformant.**

Docs may document tests and quality-related artifacts. Quality owns execution and interpretation of quality checks.

Documentation generation must not infer that it may execute tests merely because test information is part of documentation scope.

### 7.5 AI vs Owning Domains

**Status: conformant.**

The AI domain owns AI-specific project resources and AI-specific application intent. AI assistance inside Git, Docs, Nuxt, Utils or other domains does not transfer ownership of those workflows to AI.

This is a critical Detailed Design guardrail. A shared AI provider capability may be centralized, but it must remain subordinate to the use-case owner and Application Engine.

### 7.6 Utils vs Docs and Settings

**Status: conformant.**

The legacy `utils.autoDoc` behaviour is Docs-owned. Contributor metadata is Settings-owned. Utils may expose compatibility/convenience delegation, but must not become a second implementation authority.

This resolves the principal catch-all risk associated with the legacy Utils domain.

### 7.7 Application Version vs Source-File Version

**Status: conformant.**

Settings owns explicit application/project version metadata. Utils automatic version maintenance concerns eligible source-file header/history metadata.

Detailed Design must retain separate models and terminology so these two version concepts cannot be conflated accidentally.

## 8. Safety and Scope Conformance

### 8.1 Discovery Is Not Authority

The specification set consistently separates:

- discovery;
- recognition;
- managed context;
- managed scope;
- mutation authority.

This distinction is especially important for repository discovery, Nuxt layers, documentation targets, source files, temporary artifacts and AI instruction documents.

### 8.2 Consequential Operations

Consequential operations are consistently required to operate against explicit or deterministically resolved scope, with confirmation or explicit non-interactive authorization where materially destructive.

Examples include:

- reset/empty application lifecycle actions;
- repository deletion;
- source mutation;
- AI instruction-document deletion;
- header repair;
- cleanup of recognized temporary artifacts.

### 8.3 No False Atomicity

The specifications appropriately avoid claiming rollback or transactionality where external or multi-resource effects cannot genuinely be atomic.

Multi-repository Git operations, multi-file documentation/source work, resource+metadata updates and other composite operations must report actual completed effects and partial outcomes truthfully.

## 9. Headless and Structured-Outcome Conformance

The specification set consistently treats Headless operation as non-interactive application operation, not as a separate implementation of product semantics.

The following principles are sufficiently established for Detailed Design:

- missing required information in Headless mode must not trigger a prompt;
- structured success/failure/partial-success information must be available where automation depends on it;
- deterministic target resolution is required;
- interactive menus and prompts are presentation mechanisms, not business rules;
- safety requirements do not weaken in Headless mode;
- provider/library errors must be translated into application-level outcomes.

Detailed Design should therefore define one semantic invocation/result model with adapters for TUI, Headless and future integrations rather than separate mode-specific engines.

## 10. Provider and Capability Conformance

The Functional layer is generally provider-independent and does not unnecessarily bind Version 1 semantics to specific SDKs or tools.

This is aligned with ADR-0001: Version 1 uses Node.js/TypeScript while preserving boundaries that do not make the application architecture synonymous with one TypeScript implementation topology.

Permanent Detailed Design contracts may define capability-provider interfaces, normalized results and provider-selection behavior. Implementation Specifications should then map those contracts to concrete Node.js/TypeScript modules, libraries and packages.

## 11. Detailed-Design Guardrails

The following findings are not Functional defects. They are mandatory guardrails for the next phase.

### DDG-001 — Do Not Reimplement Cross-Cutting Semantics Per Domain

Invocation, managed scope, configuration resolution and source transformation must be represented by shared permanent contracts where appropriate. Domain Detailed Designs should consume those contracts rather than recreate local variants.

### DDG-002 — Preserve Application Engine Authority

A provider abstraction must not become an application-policy abstraction accidentally. Providers may execute or report technical facts; the Application Engine remains responsible for use-case sequencing, interpretation, acceptance and structured outcomes.

### DDG-003 — Separate Orchestration from Specialist Execution

Detailed Design should make the architectural path explicit:

`adapter -> invocation -> Application Engine/use case -> capability coordination -> specialist execution`

The exact module/package layout may vary, but the authority path must remain visible and testable.

### DDG-004 — Define Shared Normalized Result Contracts

Detailed Design should establish normalized internal contracts for delegated capability results, diagnostics, warnings, progress, cancellation, partial success and application-level acceptance where these concepts cross multiple domains.

Do not allow each provider or domain to invent incompatible result semantics.

### DDG-005 — Keep AI as a Capability Unless AI Is the Primary Use Case

Git commit assistance, Docs enrichment, Nuxt assistance and Utils classification should consume AI capability contracts while remaining owned by their respective use cases.

AI instruction-document management may remain AI-domain use-case behavior because AI itself is the primary subject there.

### DDG-006 — Keep Compatibility Surfaces Thin

Where legacy command names survive for convenience, they must delegate to the singular owning use case. Compatibility must not create duplicated application logic or parallel persistence/mutation paths.

### DDG-007 — Preserve Future Runtime Replaceability

Detailed Design may be concrete enough to define permanent contracts, but should avoid unnecessary Node.js/TypeScript leakage across the Application Engine, invocation and capability boundaries when the leaked detail is not intrinsically part of the permanent design.

This does not require abstraction for its own sake. It requires distinguishing stable contracts from implementation mechanics.

## 12. Detailed Design Entry Criteria

The Functional layer is considered ready for Detailed Design when all of the following are true:

- [x] four cross-cutting Functional Specifications exist;
- [x] eight approved domain Functional Specifications exist;
- [x] primary legacy behavioural scope has been reconciled;
- [x] duplicate functional ownership has been resolved;
- [x] Headless behavior is defined as shared application semantics;
- [x] managed-scope and mutation-safety rules are established;
- [x] configuration and settings responsibilities are separated;
- [x] source inspection/generation/transformation distinctions are established;
- [x] delegated execution remains subordinate to application authority;
- [x] no blocking Functional contradiction has been identified by this audit;
- [ ] Detailed Design decomposition plan approved and merged.

The only remaining entry criterion is therefore the Detailed Design decomposition plan.

## 13. Recommended Detailed Design Schedule

### Phase DD-0 — Decomposition and Contract Map

Produce a non-normative Detailed Design decomposition plan before drafting normative Detailed Design Specifications.

The plan should identify permanent shared contracts first, then domain-specific internal designs.

### Phase DD-1 — Application Core Contracts

Design the permanent internal contracts for:

1. application invocation and command/use-case identity;
2. Application Engine/use-case execution;
3. managed-project context and managed scope;
4. configuration candidate/effective-value resolution;
5. structured outcomes, diagnostics, progress and cancellation.

### Phase DD-2 — Shared Capability Contracts

Design permanent internal contracts for:

1. filesystem/resource access;
2. process/package-manager execution;
3. Git/repository capability;
4. source/code intelligence and transformation;
5. AI provider capability;
6. documentation generation/rendering capability;
7. quality/test/lint/type-check capability;
8. Nuxt-specific inspection/transformation capability;
9. declarative templates/resources.

These are capability boundaries, not new functional domains.

### Phase DD-3 — High-Coupling Domain Designs

Draft Detailed Designs for domains whose use cases exercise several shared capabilities:

1. `app`;
2. `git`;
3. `nuxt`;
4. `docs`.

### Phase DD-4 — Policy/Resource Domain Designs

Draft Detailed Designs for:

1. `quality`;
2. `settings`;
3. `ai`;
4. `utils`.

### Phase DD-5 — Cross-Design Conformance Audit

Before Implementation Specifications, perform a Detailed Design conformance audit checking:

- functional traceability;
- contract duplication;
- dependency direction;
- Application Engine authority;
- capability-provider boundaries;
- Node.js/TypeScript leakage into permanent contracts;
- concurrency/cancellation/error semantics;
- testability;
- security and secret-handling boundaries.

### Phase DD-6 — Implementation Specification Planning

Only after Detailed Design conformance should the project map permanent contracts to concrete TypeScript modules, files, libraries, build/runtime mechanisms and migration steps.

## 14. Recommended Drafting Principle

Detailed Design should not mirror the Functional document tree mechanically.

The Functional layer is organized primarily by observable product behaviour. Detailed Design should be organized around **permanent internal responsibility and contract boundaries**. Several functional domains may therefore consume the same Detailed Design contract, and one domain may depend on multiple Detailed Design components.

A one-to-one `functional domain -> internal service` mapping should be treated as suspicious unless it is independently justified by responsibility and cohesion.

## 15. Audit Conclusion

The Version 1 Functional Specification decomposition is coherent and sufficiently complete to serve as the normative behavioural baseline for Detailed Design.

No blocking Functional corrections are required before the next phase.

The project should now create and approve a Detailed Design decomposition plan that begins with Application Core and shared capability contracts, then maps domain use cases onto those contracts without duplicating application authority.
