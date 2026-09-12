# AppManager Detailed Design Decomposition Plan

## 1. Purpose

This document defines the Version 1 decomposition, contract map, dependency direction, drafting sequence, and traceability rules for AppManager Detailed Design Specifications.

It is a **project-management planning document**, not itself a normative Detailed Design Specification.

Its purpose is to prevent the Detailed Design phase from reproducing Functional Specifications as implementation-shaped domain documents, duplicating cross-cutting semantics, or allowing provider and service mechanics to acquire application authority.

The governing documentation authority remains:

1. `docs/project-documentation-guide-v01.md`;
2. `docs/appmanager-design-specification-v01.md`;
3. the Version 1 Functional Specifications under `docs/functional/`;
4. accepted ADRs, including `docs/decisions/adr-0001-primary-application-runtime.md`;
5. `docs/project_management/functional-specification-conformance-audit-v01.md` as transition evidence and guardrails.

---

## 2. Detailed Design Question

The Detailed Design level answers:

> **How should AppManager realise the approved functionality internally as permanent technical responsibilities, contracts, interactions, data structures, state transitions, and extension points?**

Detailed Design may define permanent internal interfaces, normalized result models, component responsibilities, orchestration contracts, registries, resolvers, provider abstractions, algorithms, and collaboration rules.

Detailed Design must not become a description of the current TypeScript source tree, temporary migration arrangement, implementation status, package layout, exact library calls, or file-by-file refactoring plan.

Those matters belong in Implementation Specifications or project-management documents.

---

## 3. Governing Architectural Rule

The principal Detailed Design invariant is:

> **Delegated execution does not mean delegated application authority.**

The Application Engine retains authority over:

- command and use-case semantics;
- application policy;
- workflow sequencing;
- managed-project interpretation;
- managed scope;
- safety and non-destructive constraints;
- interpretation of delegated capability results;
- application-level success, failure, warning, partial-success and diagnostic outcomes.

Detailed Design may create specialized components and capability providers, but none of those components may independently redefine AppManager application semantics merely because they execute part of an operation.

---

## 4. Decomposition Principle

Detailed Design shall be decomposed by **permanent technical responsibility and contract ownership**, not mechanically one document per Functional domain.

The Functional layer answers what AppManager must do. The Detailed Design layer should instead identify the internal seams that allow multiple Functional domains to share consistent execution semantics.

The key consequence is:

> Cross-cutting Functional authorities become shared internal contracts before domain-specific orchestration is designed.

This avoids independent implementations of invocation, scope, configuration, transformation, diagnostics, cancellation, provider execution, or result normalization inside each domain.

---

## 5. Proposed Detailed Design Document Set

Normative Detailed Design Specifications should be placed under:

```text
docs/detailed_design/
```

This directory name follows the project rule that directories use underscores while filenames use hyphens.

### 5.1 Application Core Detailed Designs

The first design family defines the permanent Application Engine contracts that every domain depends upon.

Proposed documents:

```text
docs/detailed_design/application-invocation-detailed-design-v01.md
docs/detailed_design/application-engine-detailed-design-v01.md
docs/detailed_design/managed-project-detailed-design-v01.md
docs/detailed_design/configuration-resolution-detailed-design-v01.md
docs/detailed_design/execution-outcomes-detailed-design-v01.md
```

These documents are intentionally separated where responsibilities are independently reusable and testable, but must remain mutually coherent.

### 5.2 Shared Capability Detailed Designs

The second design family defines reusable specialist capabilities behind stable AppManager-oriented boundaries.

Proposed documents:

```text
docs/detailed_design/resource-access-detailed-design-v01.md
docs/detailed_design/process-execution-detailed-design-v01.md
docs/detailed_design/repository-capability-detailed-design-v01.md
docs/detailed_design/source-intelligence-detailed-design-v01.md
docs/detailed_design/source-transformation-detailed-design-v01.md
docs/detailed_design/ai-capability-detailed-design-v01.md
docs/detailed_design/documentation-capability-detailed-design-v01.md
docs/detailed_design/quality-capability-detailed-design-v01.md
docs/detailed_design/nuxt-capability-detailed-design-v01.md
docs/detailed_design/resource-registry-and-template-detailed-design-v01.md
```

These names describe responsibility boundaries, not required classes, services, packages, or processes.

### 5.3 Domain Orchestration Detailed Designs

The third design family defines how approved domain use cases coordinate the shared Application Core and capability contracts.

Proposed documents:

```text
docs/detailed_design/app-domain-detailed-design-v01.md
docs/detailed_design/git-domain-detailed-design-v01.md
docs/detailed_design/nuxt-domain-detailed-design-v01.md
docs/detailed_design/docs-domain-detailed-design-v01.md
docs/detailed_design/quality-domain-detailed-design-v01.md
docs/detailed_design/settings-domain-detailed-design-v01.md
docs/detailed_design/ai-domain-detailed-design-v01.md
docs/detailed_design/utils-domain-detailed-design-v01.md
```

Domain Detailed Designs own orchestration and domain-specific internal policy. They must not duplicate shared capability implementation contracts.

### 5.4 Detailed Design Conformance Document

After all Detailed Design documents are drafted, a project-management audit should be created:

```text
docs/project_management/detailed-design-conformance-audit-v01.md
```

This is not a fifth design layer. It is verification evidence before Implementation Specification work begins.

---

## 6. Core Contract Map

### 6.1 Application Invocation Contract

The Application Invocation Detailed Design should define permanent internal representations for:

- command identity;
- domain and command discovery metadata;
- caller-supplied inputs and options;
- invocation context;
- explicit target/scope requests;
- execution mode indicators where semantically relevant;
- confirmation or authorization evidence;
- dry-run or preview intent;
- cancellation linkage;
- structured result delivery;
- progress/event delivery;
- contract evolution and compatibility rules.

It must remain transport-independent at Detailed Design level unless a future accepted architectural decision makes a transport an enduring characteristic.

It must not own domain policy or workflow semantics.

### 6.2 Application Engine Contract

The Application Engine Detailed Design should define:

- command registration and discovery;
- command dispatch;
- use-case execution context;
- orchestration lifecycle;
- policy and safety evaluation points;
- capability acquisition/delegation;
- application-level result interpretation;
- command availability;
- cancellation propagation;
- partial-success interpretation;
- retry authority boundaries;
- concurrency/conflict coordination where application-level;
- dependency direction rules.

The Application Engine must not become a monolithic implementation object merely because it is the central authority boundary.

Its Detailed Design should separate authority from execution topology.

### 6.3 Managed Project Contract

The Managed Project Detailed Design should define permanent models and resolvers for:

- target-project request;
- resolved managed-project context;
- root application;
- managed layers;
- repository relationships;
- AppManager-owned resources;
- recognized resources;
- operation-specific managed scope;
- inclusion/exclusion rules;
- ambiguity and unsupported-context representation;
- scope narrowing;
- immutable or read-only context views where appropriate.

A critical internal distinction must be preserved:

> **Recognized or discovered does not mean mutable.**

No capability may infer mutation authority merely because a path/resource appears in the managed-project context.

### 6.4 Configuration Resolution Contract

The Configuration Resolution Detailed Design should define:

- configuration source abstraction;
- candidate value representation;
- effective value representation;
- provenance/source metadata;
- precedence evaluation;
- validation stage boundaries;
- absent/unset/empty distinctions;
- sensitive-value handling;
- project-context applicability;
- deterministic Headless resolution;
- immutable effective configuration snapshots where appropriate;
- invalid configuration result contracts.

Settings persistence must remain distinct from configuration resolution.

### 6.5 Execution Outcome Contract

A shared execution-outcome model should be established before domain designs.

It should normalize at least:

- success;
- failure;
- partial success;
- cancellation;
- skipped/no-op/already-satisfied states where semantically useful;
- diagnostics;
- warnings;
- changed resources/effects;
- preview/proposed changes;
- provider/capability evidence where useful but non-authoritative;
- machine-readable failure categories;
- human-presentable messages without making presentation strings the semantic contract.

Domain-specific result payloads may extend this model.

Capability-provider raw results must not be exposed as the application result without Application Engine interpretation.

---

## 7. Shared Capability Contract Map

### 7.1 Resource Access

The Resource Access design should provide reusable bounded access to filesystem and structured resources.

It should define permanent contracts for:

- text and structured reads;
- metadata/stat-like inspection;
- bounded writes;
- create/update/delete distinctions;
- directory/resource enumeration;
- atomic or best-effort mutation semantics where required;
- stale-state detection inputs;
- path normalization and containment checks;
- sensitive-resource handling;
- structured parse/update operations where preservation matters.

It must not decide application scope.

### 7.2 Process Execution

The Process Execution design should define:

- executable/tool invocation request;
- working context;
- arguments and environment;
- streaming output/events;
- exit result normalization;
- cancellation/termination semantics;
- timeout semantics where applicable;
- non-shell vs shell execution policy boundary;
- sensitive environment handling;
- provider/tool unavailability representation.

It must not interpret tool success as AppManager application success.

### 7.3 Repository Capability

The Repository Capability design should define AppManager-oriented repository primitives such as:

- repository recognition;
- status facts;
- identity facts;
- remotes;
- branches;
- diffs;
- staging;
- commit;
- push/pull/fetch/sync primitives;
- repository relationship facts;
- remote-host capability abstraction where applicable.

The Git domain retains repository use-case semantics and policy.

### 7.4 Source Intelligence

The Source Intelligence design should define read-only structural analysis contracts for:

- file/language recognition;
- supported source kinds;
- structural facts;
- declarations/blocks;
- metadata/header recognition;
- documentation presence;
- configuration structure recognition;
- unsupported or ambiguous source representation.

Recognition must remain distinct from transformation.

### 7.5 Source Transformation

The Source Transformation design should define permanent internal contracts for:

- transformation intent;
- transformation strategy selection;
- bounded transformation plans;
- planned edits/effects;
- source snapshots or revision evidence;
- preview rendering/data;
- application approval input;
- execution;
- source-level validation;
- stale-source detection;
- preservation guarantees;
- partial application representation;
- application acceptance/rejection after technical execution.

Transformation components may establish source correctness but not application authority.

### 7.6 AI Capability

The AI Capability design should define provider-independent contracts for:

- capability availability;
- provider/model selection inputs;
- bounded context construction;
- prompt/request representation;
- response normalization;
- structured-output validation;
- provider failure categorization;
- fallback policy hooks;
- cancellation and timeout propagation;
- secret and sensitive-context exclusion;
- untrusted project-content treatment.

AI output remains proposal/evidence unless the owning use case deliberately accepts it.

### 7.7 Documentation Capability

The Documentation Capability design should define reusable technical contracts for:

- documentation inspection;
- documentation models;
- generation;
- rendering;
- aggregation;
- templates;
- documentation-tool providers;
- source-aware documentation planning;
- optional AI enrichment.

The Docs domain retains documentation use-case authority.

### 7.8 Quality Capability

The Quality Capability design should define normalized contracts for:

- test execution results;
- coverage results;
- lint findings;
- type-check findings;
- tool/provider availability;
- normalized finding severity/category;
- quality execution metadata.

Quality gates and AppManager interpretation remain Quality-domain/application policy.

### 7.9 Nuxt Capability

The Nuxt Capability design should define Nuxt-specific specialist contracts for:

- Nuxt project/layer recognition;
- Nuxt configuration inspection;
- layer metadata and relationship facts;
- Nuxt scaffolding primitives;
- Nuxt-specific resource generation;
- Nuxt-specific configuration planning;
- ecosystem tool delegation where required.

It must not absorb generic Git, documentation, source-transformation, Settings, or App lifecycle authority.

### 7.10 Resource Registries and Templates

The registry/template design should define declarative resource contracts for:

- registry item identity;
- schema/version metadata;
- resource discovery;
- validation;
- template identity and parameters;
- rendering inputs/outputs;
- extension registration where approved;
- provenance;
- compatibility/evolution.

It must not become a general executable plugin framework.

---

## 8. Domain Detailed Design Responsibility

Each domain Detailed Design should focus on four questions:

1. Which Functional requirements does the domain own?
2. Which Application Core contracts does it consume?
3. Which shared capabilities does it coordinate?
4. What permanent domain-specific orchestration, state, policy, or result contracts remain after shared concerns are removed?

A domain Detailed Design should not repeat general filesystem, process, Git-provider, AI-provider, transformation, configuration-resolution, or invocation mechanics unless it is defining a domain-specific refinement of a shared contract.

---

## 9. Dependency Direction

The intended permanent dependency direction is:

```text
interaction adapters / integrations
            |
            v
application invocation contracts
            |
            v
application engine / use-case orchestration
            |
            +-----------------------+
            |                       |
            v                       v
managed project / config      domain orchestration
            |                       |
            +-----------+-----------+
                        |
                        v
              shared capability contracts
                        |
                        v
               capability providers
                        |
                        v
        external tools / filesystem / APIs
```

Dependencies may be implemented in-process, but conceptual direction must remain stable.

Forbidden architectural inversions include:

- capability providers dispatching application commands;
- filesystem/process/Git/AI providers deciding managed scope;
- adapters owning application policy;
- domain components bypassing configuration resolution to invent competing precedence;
- transformation strategies directly mutating sources without approved transformation intent;
- AI providers authorizing application changes;
- Settings persistence deciding runtime interpretation for unrelated consumers.

---

## 10. Internal Contract Design Rules

Detailed Design contracts should prefer AppManager-oriented semantics over provider-native representations.

Where external/provider-native data is important, it may be carried as bounded evidence or provider detail, but should not become the primary shared model unless the semantics are genuinely identical.

Contracts should:

- distinguish intent from execution;
- distinguish recognition from authority;
- distinguish proposal from application;
- distinguish technical success from application acceptance;
- represent partial success explicitly where the Functional layer requires it;
- preserve deterministic Headless semantics;
- support cancellation where the Functional layer promises it;
- preserve diagnostics and warnings structurally;
- avoid presentation dependencies;
- avoid assuming one provider where the Functional layer requires provider independence;
- remain testable without requiring real external providers wherever practical.

---

## 11. Traceability Model

Every Detailed Design Specification should contain a traceability section mapping its permanent design contracts to:

- root Design Specification section(s);
- Functional requirement IDs;
- accepted ADR(s) where relevant;
- related Detailed Design contracts;
- legacy technical sources only as provenance, not authority.

The preferred downward chain is:

```text
Design invariant / subsystem
        |
        v
Functional requirement(s)
        |
        v
Detailed Design responsibility / contract
        |
        v
Implementation Specification
        |
        v
concrete source / tests / build / runtime artefacts
```

Detailed Design identifiers should be stable enough for Implementation Specifications to reference them.

A proposed identifier scheme is:

```text
DD-INV-*     invocation
DD-ENG-*     application engine
DD-PROJ-*    managed project
DD-CONFIG-*  configuration resolution
DD-OUT-*     execution outcomes
DD-RES-*     resource access
DD-PROC-*    process execution
DD-REPO-*    repository capability
DD-SRC-*     source intelligence
DD-XFORM-*   source transformation
DD-AICAP-*   AI capability
DD-DOCCAP-*  documentation capability
DD-QUALCAP-* quality capability
DD-NUXTCAP-* Nuxt capability
DD-REG-*     registries/templates
DD-APP-*     app domain
DD-GIT-*     git domain
DD-NUXT-*    nuxt domain
DD-DOCS-*    docs domain
DD-QUAL-*    quality domain
DD-SET-*     settings domain
DD-AI-*      ai domain
DD-UTIL-*    utils domain
```

The exact numeric ranges should be assigned when each specification is drafted.

---

## 12. Drafting Sequence

### DD-0 — Decomposition and Contract Map

This document completes DD-0 once approved.

### DD-1 — Application Core

Draft in this order:

1. Application Invocation Detailed Design;
2. Execution Outcomes Detailed Design;
3. Managed Project Detailed Design;
4. Configuration Resolution Detailed Design;
5. Application Engine Detailed Design.

Rationale: the Application Engine should be designed against explicit invocation, outcome, scope, and configuration contracts rather than defining those concerns opportunistically inside engine orchestration.

### DD-2 — Shared Capabilities

Draft in this order:

1. Resource Access;
2. Process Execution;
3. Repository Capability;
4. Source Intelligence;
5. Source Transformation;
6. Registry and Template Resources;
7. AI Capability;
8. Quality Capability;
9. Documentation Capability;
10. Nuxt Capability.

Rationale: lower-level reusable mechanics should stabilize before higher-coupling capability designs that compose them.

### DD-3 — High-Coupling Domains

Draft:

1. App;
2. Git;
3. Nuxt;
4. Docs.

These domains coordinate the largest number of shared capabilities and should validate the contract architecture early.

### DD-4 — Policy and Resource Domains

Draft:

1. Quality;
2. Settings;
3. AI;
4. Utils.

Utils remains last because its design must prove that no residual behavior is being used to bypass a stronger owner.

### DD-5 — Detailed Design Conformance Audit

Audit:

- Design and Functional traceability;
- duplicate responsibility;
- circular dependency pressure;
- capability-provider leakage;
- scope and configuration authority;
- execution outcome consistency;
- transformation safety;
- AI subordination;
- Headless compatibility;
- cancellation and concurrency semantics;
- testability;
- security and sensitive-data handling;
- inappropriate Implementation-level detail.

### DD-6 — Implementation Specification Planning

Only after DD-5 passes should the project map Detailed Design to:

- concrete TypeScript modules;
- source paths;
- interfaces/classes/functions;
- package/library choices;
- entry-point wiring;
- migration steps;
- compatibility work;
- concrete tests;
- build/runtime configuration.

---

## 13. ADR Triggers During Detailed Design

Detailed Design work should not automatically create ADRs for routine component design.

An ADR should be considered when Detailed Design discovers a significant durable choice such as:

- a new major subsystem boundary;
- a mandatory protocol/transport family;
- a durable persistence model;
- an executable plugin framework;
- a security trust-boundary change;
- a new runtime/process separation requirement;
- a major technology selection not already governed by ADR-0001;
- a decision that materially constrains multiple Detailed Design families.

If such a decision is required, the ADR must be approved and the relevant higher-level specification updated before the affected Detailed Design is treated as final.

---

## 14. Relationship to ADR-0001

ADR-0001 establishes Node.js/TypeScript as the Version 1 primary application implementation technology while requiring architecture that preserves Application Engine, invocation-contract, and capability-boundary semantics.

Detailed Design may therefore use type-contract concepts compatible with TypeScript, but should not confuse TypeScript module topology with architectural responsibility.

The design should remain capable of supporting future replacement of an implementation behind a stable boundary without requiring command semantics or interaction adapters to be redefined.

This does **not** require speculative abstraction for every component or premature language-neutral serialization for in-process contracts.

The governing balance is:

> Define real responsibility seams cleanly; do not manufacture abstraction solely to anticipate a hypothetical migration.

---

## 15. Completion Criteria for DD-0

DD-0 is complete when this plan is approved and the project agrees that:

- Detailed Design will be responsibility/contract-oriented rather than one-service-per-domain;
- shared Application Core contracts are designed first;
- shared capability contracts precede domain orchestration;
- domain Detailed Designs cannot redefine cross-cutting Functional authority;
- `docs/detailed_design/` is the normative location for Detailed Design Specifications;
- the dependency direction in this document is the planning baseline;
- traceability from Functional requirements into Detailed Design contracts is mandatory;
- Implementation-specific reduction to practice remains deferred to the Implementation Specification phase.

Upon completion, the next work item is:

```text
DD-1.1 — Application Invocation Detailed Design
```
