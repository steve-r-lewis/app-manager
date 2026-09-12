# AppManager DD-1 Application Core Handover Review

> **Status:** Version 1 project-management handover checkpoint
>
> **Purpose:** Durable session and phase handover from DD-1 Application Core into DD-2 Shared Capabilities
>
> **Baseline:** `master` at `aa0757920ee361db1edd63f6546fc9a154b511b6`, including the MC-001 bootstrap-resolution correction
>
> **Normative effect:** None. This document identifies, summarizes, and orders authoritative sources; it does not replace them.

## 1. How to Use This Handover

This document is the preferred entry point when beginning a fresh AI/human working session after completion of DD-1.

It is deliberately different from a conversational summary. It is a **navigation, state, invariant, and continuation document**. Its purpose is to let a new session recover the project's architectural state efficiently without replaying the entire history that produced it.

### 1.1 Correct usage

A new session should:

1. verify that the repository baseline is at or after the baseline recorded above;
2. read this handover first;
3. follow the authoritative reading order in Section 15;
4. inspect the exact normative documents needed for the immediate task rather than ingesting every repository file indiscriminately;
5. treat this document's summaries as navigation aids, not substitutes for normative wording;
6. verify unresolved/open items against current repository state;
7. create a new `ai/<purpose>` session branch from current `master` before editing;
8. continue with the immediate next task in Section 16.

### 1.2 What not to do

A new session shall not:

- treat this handover as a new Design Specification;
- infer architecture from current implementation where specifications already govern it;
- reopen settled decisions without new evidence or an identified contradiction;
- mechanically mirror the Functional Specification tree into Detailed Design;
- assume historical code structure is approved architecture;
- carry temporary branch/PR state forward without verifying GitHub;
- load every prior discussion into working context merely because it exists.

### 1.3 Session reset principle

The repository is the durable project memory. A conversation is a temporary working context.

The handover exists to answer four questions efficiently:

1. **What is authoritative?**
2. **What has been decided?**
3. **What must not drift?**
4. **What is the next bounded task?**

## 2. Phase State

The project has completed the following design sequence:

```text
Root Design Specification
        |
        v
Functional Specification decomposition
        |
        v
12 Version 1 Functional Specifications
        |
        v
Functional Conformance Audit
        |
        v
DD-0 Detailed Design Decomposition Plan
        |
        v
DD-1 Application Core
        +-- DD-1.1 Application Invocation
        +-- DD-1.2 Execution Outcomes and Diagnostics
        +-- DD-1.3 Managed Project
        +-- DD-1.4 Configuration Resolution
        +-- DD-1.5 Application Engine
        |
        v
DD-1 Application Core Conformance Audit
        |
        v
MC-001 Bootstrap Resolution Clarification
        |
        v
THIS HANDOVER
        |
        v
DD-2 Shared Capabilities
```

The DD-1 conformance audit found zero blocking defects, zero major defects, and one minor cross-contract clarification. MC-001 has been resolved by `application-core-bootstrap-resolution-clarification-v01.md`.

The project is therefore architecturally ready to enter DD-2 after this handover is accepted and merged.

## 3. Documentation Authority

The documentation hierarchy remains:

```text
Project Documentation Guide
        |
        v
Root Design Specification
        |
        v
Functional Specifications
        |
        v
Detailed Design Specifications
        |
        v
Implementation Specifications
        |
        v
Implementation
```

ADRs are orthogonal decision provenance. They explain **why** significant choices were made; they do not form a fifth specification level.

Project-management documents, including this handover, own planning, sequencing, audits, migration state, handoff state and temporary coordination. They do not override normative specifications.

### 3.1 Allocation tests

Use these tests whenever material appears to belong in more than one documentation level:

- **Root Design:** what enduring architecture and authority model governs AppManager?
- **Functional:** what observable behaviour must AppManager provide?
- **Detailed Design:** how should approved behaviour be realised internally as permanent responsibilities/contracts?
- **Implementation Specification:** how does approved Detailed Design map to concrete code/build/runtime/repository artefacts?
- **Project Management:** what is the sequence, status, migration, coordination, milestone or temporary state?
- **ADR:** why was a significant architectural/technology decision made?

## 4. Canonical Architecture Entering DD-2

The permanent conceptual flow is:

```text
interaction / integration
        |
        v
Application Invocation Contract
        |
        v
Application Engine authority
        |
        +--> managed-project resolution
        +--> configuration resolution
        +--> policy / safety / authorization
        +--> domain / use-case orchestration
        |        |
        |        +--> shared capabilities
        |        +--> scanners / recognizers
        |        +--> resolvers
        |        +--> strategies / planners
        |        +--> providers / execution mechanisms
        |
        v
normalized execution evidence / domain result information
        |
        v
Application Engine interpretation / acceptance
        |
        v
canonical AppManager outcome
        |
        v
interaction-specific projection
```

This is an authority/responsibility model, not a mandatory process, package, class, transport or deployment topology.

The central invariant is:

> **Delegated execution does not mean delegated application authority.**

## 5. DD-1 Application Core Baseline

### 5.1 DD-1.1 — Application Invocation

File: `docs/detailed_design/application-invocation-detailed-design-v01.md`

Owns the shared semantic invocation boundary, including:

- canonical command identity;
- command catalogue/discovery metadata;
- caller inputs/options;
- target/context hints;
- normalization;
- structural/contextual validation coordination;
- availability representation;
- authorization evidence;
- preview intent;
- progress/events;
- cancellation linkage;
- invocation-facing final outcome delivery.

Governing rule:

> **Invocation transports intent into the Application Engine; it does not own the meaning of that intent.**

### 5.2 DD-1.2 — Execution Outcomes and Diagnostics

File: `docs/detailed_design/execution-outcomes-detailed-design-v01.md`

Owns shared normalized execution evidence, diagnostics, effects, progress, cancellation state, child results and canonical final outcome semantics.

It separates:

1. technical execution status;
2. application interpretation;
3. final invocation status.

Governing rule:

> **A provider result is evidence about execution; an AppManager outcome is an application decision.**

Top-level final states are:

- `success`;
- `failure`;
- `partial_success`;
- `cancelled`.

Known effects survive failure, partial success and cancellation reporting. Cancellation does not imply rollback. Retryability evidence does not grant retry authority.

### 5.3 DD-1.3 — Managed Project

File: `docs/detailed_design/managed-project-detailed-design-v01.md`

Owns:

- target-project requests;
- project evidence/candidates;
- project-root resolution;
- managed-project context;
- root application/layers;
- repository relationships/topology;
- AppManager resource recognition;
- operation-specific context completeness;
- managed-scope resolution;
- inclusion/exclusion;
- targetability;
- ownership/mutability classification;
- Headless deterministic resolution;
- stale-context boundaries.

Governing rule:

> **Discovery or recognition establishes knowledge. Managed scope establishes operation targeting. Neither discovery nor inclusion in context alone grants mutation authority.**

The following states remain distinct:

```text
recognized
    != in managed scope
    != targetable
    != mutable / authorized for every effect
```

### 5.4 DD-1.4 — Configuration Resolution

File: `docs/detailed_design/configuration-resolution-detailed-design-v01.md`

Owns configuration concern/source/candidate/applicability/validation/precedence/fallback/effective-value/snapshot semantics.

Canonical chain:

```text
source
  -> candidate
  -> applicability / validation
  -> precedence / fallback
  -> effective value
  -> coherent effective-configuration snapshot
  -> Application Engine / use-case consumption
```

Required distinctions:

```text
source != candidate authority
candidate != effective value
effective value != application policy
resolution != persistence
configuration != managed scope
configuration != authorization
```

Capabilities should consume governed effective AppManager configuration rather than independently read competing raw sources for shared concerns.

### 5.5 DD-1.5 — Application Engine

File: `docs/detailed_design/application-engine-detailed-design-v01.md`

Owns the permanent application-authority boundary:

- command/use-case ownership and dispatch;
- invocation-scoped execution context;
- managed-project/scope coordination;
- effective-configuration acquisition;
- policy/safety/authorization checkpoints;
- domain/use-case orchestration;
- bounded capability delegation;
- application acceptance;
- canonical outcome publication;
- cancellation interpretation;
- retry/resume/fallback authority;
- concurrency/staleness coordination;
- nested/composite use cases;
- cross-mode semantic equivalence.

Governing rules:

> **Delegated execution does not mean delegated application authority.**

> **The Application Engine is an authority and responsibility boundary, not a requirement for one class, package, process, executable, deployment unit, or runtime.**

## 6. DD-1 Audit and MC-001 Resolution

Audit file:

`docs/project_management/application-core-detailed-design-conformance-audit-v01.md`

Audit result before correction:

- Blocking: 0
- Major: 0
- Minor corrective: 1
- DD-2 guardrails: 8

### 6.1 MC-001

The audit identified an implicit bootstrap cycle because DD-1.3 may consume configuration evidence during project resolution while DD-1.4 requires project context for project/scope-dependent configuration.

Normative correction:

`docs/detailed_design/application-core-bootstrap-resolution-clarification-v01.md`

Canonical sequence:

```text
invocation / host context
        |
        v
context-independent configuration candidates
        |
        v
bootstrap effective configuration
        |
        v
target-project / managed-project resolution
        |
        v
managed-project context
        |
        v
project/scope-dependent configuration resolution
        |
        v
operation effective-configuration snapshot
        |
        v
managed scope / policy / use-case execution
```

Configuration used to establish project identity must not depend on that unresolved identity for its own applicability. Bootstrap configuration contributes evidence, not project/scope/mutation authority.

## 7. Functional Domain Ownership Already Settled

Approved Version 1 domains:

- `app`
- `docs`
- `git`
- `ai`
- `nuxt`
- `quality`
- `utils`
- `settings`

These organize product behaviour/use cases, not autonomous implementation subsystems.

Important ownership decisions already made:

- **App:** root application lifecycle and project execution semantics; not Git/Nuxt/process/package mechanics.
- **Git:** repository/source-control intent; not the whole CI/CD pipeline.
- **Nuxt:** Nuxt-specific intent and semantics; not generic file/source/Git/docs/settings mechanics.
- **Docs:** documentation intent/outcomes; specialist source/render/provider mechanics may be delegated.
- **Quality:** quality intent, gates, scope and interpretation; not generic tool/process mechanics.
- **Settings:** explicit settings/metadata/declarative-resource management; Configuration Resolution owns candidate-to-effective semantics.
- **AI:** AI-specific application intent/resources; AI used internally by another domain remains a subordinate capability.
- **Utils:** only genuinely cross-cutting maintenance behaviour not owned more strongly elsewhere; designed last to prevent residual-authority drift.

### 7.1 CI/CD

CI/CD is composition, not automatically a Git-domain responsibility.

Conceptually:

```text
App lifecycle/build
    + Quality test/lint/typecheck
    + Git commit/push/tag
    + deployment/provider capability
    = composed CI/CD workflow
```

Repository steps remain Git-owned; whole workflow ownership depends on the application use case.

## 8. Internal Responsibility Patterns

These are patterns, not architectural layers and not automatically generic frameworks.

### 8.1 Scanners / recognizers

Primary home: DD-2 Source Intelligence and specialist capabilities where appropriate.

Purpose: read-only recognition, inspection, extraction and structural facts.

Rule:

> **Recognition is not mutation authority.**

### 8.2 Resolvers

Primary homes include Managed Project, Configuration Resolution and bounded later capability concerns.

A resolver:

- consumes bounded inputs/evidence;
- owns one coherent resolution concern;
- returns a structured resolved or unresolved state;
- preserves provenance;
- does not invent unrelated application authority.

Do not create a universal resolver framework without demonstrated common semantics.

### 8.3 Strategies and planners

Primary home: DD-2 Source Transformation, with domain-specific strategies where genuinely required.

Expected flow:

```text
scanner / recognition
    -> structural facts
    -> strategy selection
    -> transformation strategy
    -> bounded plan
    -> Engine/use-case policy and authorization
    -> execution
    -> source-level validation
    -> application-level acceptance
```

Strategy knows **how** approved intent may be realised; it does not decide that intent is authorized or in scope.

### 8.4 Normalizers / interpreters / projectors

Use precise names rather than generic `Responder` where possible.

- provider result normalizer: native provider result -> AppManager evidence;
- response interpreter: bounded interpretation within capability/domain contract;
- outcome projector: canonical AppManager outcome -> presentation-specific representation.

No such component independently redefines final application outcome semantics.

### 8.5 Orchestrators

Primary homes:

- Application Engine for shared application coordination;
- DD-3/DD-4 domain designs for domain/use-case sequencing.

Orchestrators coordinate bounded responsibilities. Scanners, strategies, providers and transformers do not become application orchestrators merely because they execute a step.

## 9. Runtime and Technology Decision

ADR:

`docs/decisions/adr-0001-primary-application-runtime.md`

Version 1 uses **Node.js/TypeScript** as the primary application implementation technology.

This does **not** approve an undifferentiated TypeScript architecture.

Detailed Design must preserve real AppManager-oriented responsibility seams even when they are implemented in one process/runtime.

Do not introduce speculative cross-runtime serialization solely because Kotlin/JVM may be reconsidered in a future version.

Rule:

> **Define real responsibility seams cleanly; do not manufacture abstraction solely to anticipate a hypothetical migration.**

A future primary-runtime change requires a superseding ADR.

## 10. DD-2 Planned Shared Capability Set

The approved DD-2 sequence is:

1. `resource-access-detailed-design-v01.md`
2. `process-execution-detailed-design-v01.md`
3. `repository-capability-detailed-design-v01.md`
4. `source-intelligence-detailed-design-v01.md`
5. `source-transformation-detailed-design-v01.md`
6. `resource-registry-and-template-detailed-design-v01.md`
7. `ai-capability-detailed-design-v01.md`
8. `quality-capability-detailed-design-v01.md`
9. `documentation-capability-detailed-design-v01.md`
10. `nuxt-capability-detailed-design-v01.md`

After DD-2, the planned domain Detailed Designs are App, Git, Nuxt, Docs, Quality, Settings, AI and Utils in the sequence recorded by the decomposition plan.

## 11. DD-2 Guardrails

The DD-1 audit establishes the following guardrails for DD-2.

### DD2-G-001 — Resource accessibility is not managed scope

Resource Access may read/write resources only through bounded requests. Filesystem visibility or technical accessibility must never become project inclusion, targetability or mutation authority.

### DD2-G-002 — Process completion is not application success

Process Execution owns process/tool mechanics and technical evidence. Exit code zero or process completion is not sufficient to determine AppManager success.

### DD2-G-003 — Repository capability is not Git-domain or CI/CD authority

Repository Capability owns reusable repository mechanics/facts. Git-domain use cases own repository intent. CI/CD remains composed application workflow, not automatically Git-owned.

### DD2-G-004 — Source Intelligence is evidence-producing

Scanners/recognizers/parsers/analyzers produce structural facts and findings. They do not grant transformation or mutation authority.

### DD2-G-005 — Source Transformation preserves staged authority

Transformation must preserve recognition -> facts -> strategy -> plan -> policy/authorization -> execution -> validation -> application acceptance.

### DD2-G-006 — Shared capabilities consume governed configuration

Capabilities must not create competing configuration-precedence systems. AppManager-level concerns consume DD-1.4 effective configuration.

### DD2-G-007 — Provider-native models stay below capability boundaries

Provider SDK objects, compiler/framework-native representations, raw process results and similar implementation details must be normalized before becoming general application evidence.

### DD2-G-008 — Repeated names do not justify generic frameworks

Scanner, resolver, strategy, provider, normalizer and orchestrator abstractions should be introduced only where common semantics genuinely exist.

## 12. Intentionally Deferred Decisions

The following are not accidental omissions and must not be invented during DD-2 without justification:

- concrete TypeScript module/package layout;
- dependency-injection framework;
- general executable plugin system;
- cross-runtime RPC/serialization protocol;
- mandatory separate capability process;
- persistence technology for execution history;
- universal locking model;
- universal retry framework;
- universal scanner/resolver/strategy framework;
- exact Git library/shell implementation;
- exact filesystem abstraction library;
- exact Nuxt/Vue/TypeScript parsing libraries;
- concrete AI provider selection;
- concrete logging/telemetry implementation;
- current implementation migration sequence.

These belong to later Detailed Design where genuinely architectural, Implementation Specification where concrete, project management where transitional, or ADR where a major cross-cutting decision is introduced.

## 13. ADR Triggers During DD-2

Do not create an ADR for routine component design.

Consider an ADR if DD-2 would introduce:

- a new major subsystem boundary;
- a mandatory protocol or transport;
- a durable persistence model affecting multiple areas;
- an arbitrary executable plugin framework;
- a security/trust-boundary change;
- mandatory process/runtime separation;
- a major technology selection not already governed by ADR-0001;
- another decision that materially constrains multiple Detailed Design families.

## 14. GitHub and Editing Workflow

For each bounded documentation task:

```text
verify current master
    -> create ai/<purpose> branch
    -> make targeted changes on branch
    -> validate against governing documents
    -> open PR to master
    -> review
    -> user normally merges
    -> verify exact merge state before next branch
```

AI sessions must not edit `master` directly unless explicitly instructed.

A new phase/session branch must be based on the current exact `master` state, not a remembered historical SHA.

## 15. Authoritative Reading Order for a New DD-2 Session

A fresh session should read in this order.

### Tier 1 — Handover and governance

1. `docs/project_management/detailed-design-dd1-handover-review-v01.md`
2. `docs/project-documentation-guide-v01.md`
3. `docs/project_management/detailed-design-decomposition-plan-v01.md`

### Tier 2 — Architectural authority

4. `docs/appmanager-design-specification-v01.md`
5. `docs/decisions/adr-0001-primary-application-runtime.md`

### Tier 3 — Application Core contracts

6. `docs/detailed_design/application-invocation-detailed-design-v01.md`
7. `docs/detailed_design/execution-outcomes-detailed-design-v01.md`
8. `docs/detailed_design/managed-project-detailed-design-v01.md`
9. `docs/detailed_design/configuration-resolution-detailed-design-v01.md`
10. `docs/detailed_design/application-core-bootstrap-resolution-clarification-v01.md`
11. `docs/detailed_design/application-engine-detailed-design-v01.md`

### Tier 4 — Audit evidence

12. `docs/project_management/functional-specification-conformance-audit-v01.md`
13. `docs/project_management/application-core-detailed-design-conformance-audit-v01.md`

### Tier 5 — Task-specific Functional Specifications

Read the Functional Specifications that materially constrain the capability being designed. Do **not** mechanically ingest all domain specifications unless the capability genuinely spans them.

For DD-2.1 Resource Access, inspect at minimum the cross-cutting requirements involving managed project, configuration, source transformation and invocation/outcomes, then search domain Functional Specifications for file/resource access requirements that require a shared mechanism.

### Tier 6 — Current implementation only as evidence

Inspect current code only after the normative architecture is understood, and only where it can reveal:

- existing behaviours that must not be lost;
- useful implementation experience;
- current technical constraints relevant to later Implementation Specifications;
- candidate terminology requiring reconciliation.

Current code does not override approved specifications.

## 16. Immediate Next Task — DD-2.1 Resource Access

Create:

`docs/detailed_design/resource-access-detailed-design-v01.md`

Stable requirement prefix:

`DD-RES-*`

The design should establish permanent shared contracts for safe bounded access to project resources without acquiring managed-project or application authority.

Expected design concerns include:

- resource identity/reference model;
- resource kind and location semantics;
- read versus inspect versus write/create/update/delete/move distinctions;
- bounded resource requests;
- managed-project/scope constraints supplied by callers;
- path/resource normalization at the capability boundary;
- existence and accessibility evidence;
- resource metadata/evidence;
- text/binary/structured-resource distinctions where architecturally meaningful;
- atomicity expectations without prematurely selecting a filesystem mechanism;
- preconditions and conflict/stale-state evidence;
- proposed versus applied resource effects;
- safe temporary/staging semantics where permanently required;
- write/delete/move safety boundaries;
- symlink/indirection/containment concerns at the semantic level;
- error/diagnostic normalization into DD-1.2;
- cancellation boundaries for multi-resource work;
- concurrency/staleness responsibilities;
- sensitive-resource handling;
- provider/filesystem implementation isolation;
- testability and future provider replaceability.

### 16.1 Resource Access must not own

DD-2.1 shall not own:

- managed-project identity;
- managed-scope derivation;
- application authorization;
- command/use-case semantics;
- configuration precedence;
- source-language parsing/intelligence;
- source transformation strategy;
- repository semantics;
- documentation semantics;
- Nuxt semantics;
- quality policy;
- final application acceptance.

The key rule entering DD-2.1 is:

> **Technical ability to access a resource is evidence of accessibility, not authority to target or mutate it.**

## 17. Suggested New-Session Prompt

Use a concise prompt rather than pasting historical conversation state:

```text
@GitHub Please ingest the AppManager repository for continuation of the Version 1 Detailed Design work.

Begin with:
`docs/project_management/detailed-design-dd1-handover-review-v01.md`

Follow the authoritative reading order defined by that handover, verifying current repository state rather than relying on historical branch/PR assumptions.

We have completed DD-1 Application Core and its conformance audit/correction. The next task is DD-2.1 Resource Access Detailed Design.

Do not infer approved architecture from current implementation where normative specifications exist, and do not edit master directly. Once you have reviewed the required material and are ready to begin DD-2.1, respond only with:

ready to proceed
```

The prompt is intentionally small. The handover and repository carry the durable context.

## 18. Handover Readiness

At this checkpoint:

- Root Design rationalisation is complete;
- the Version 1 Functional Specification set is complete;
- Functional conformance audit passed;
- Detailed Design decomposition is established;
- DD-1.1 through DD-1.5 are complete;
- DD-1 conformance audit found no blocking or major defect;
- MC-001 has been normatively resolved;
- Application Engine authority is explicit;
- invocation/outcome/project/configuration contracts are explicit;
- DD-2 capability guardrails are explicit;
- the next task and reading order are explicit.

**Handover result: READY FOR DD-2 SHARED CAPABILITY DESIGN.**

The continuation principle is:

> **Load durable architectural state from the repository; load only the task-specific detail needed for the next bounded design decision.**
