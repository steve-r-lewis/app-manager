# AppManager Domain Detailed Design Authoring Guide

## 1. Purpose

This document defines the project-management authoring controls, scope boundaries, presentation structure, and drafting conventions for AppManager domain Detailed Design Specifications.

It applies principally to the Version 1 domain-design families identified by `docs/project_management/detailed-design-decomposition-plan-v01.md`:

- DD-3 — High-Coupling Domains;
- DD-4 — Policy and Resource Domains.

This document is a **project-management authoring guide**, not a normative Detailed Design Specification and not a new level in the AppManager documentation hierarchy.

Its purpose is to ensure that domain Detailed Designs:

- refine approved Design and Functional requirements without redefining them;
- compose established DD-1 Application Core and DD-2 Shared Capability contracts rather than duplicating them;
- define only permanent domain-specific orchestration, state, policy, decision, and result semantics;
- preserve application authority, managed-scope authority, configuration authority, outcome semantics, provider replaceability, and implementation-topology independence established by DD-1 and DD-2;
- remain clearly separated from implementation-specific reduction to practice;
- use a consistent document structure that supports later horizontal conformance auditing and Implementation Specification planning.

The governing principle is:

> **A domain Detailed Design defines the permanent domain-specific composition of approved Application Core and shared capability contracts; it does not recreate those contracts and it does not prematurely map them to concrete code.**

---

## 2. Authority and Relationship to Other Documentation

This document operates under the authority of:

1. `docs/project-documentation-guide-v01.md`;
2. `docs/appmanager-design-specification-v01.md`;
3. the applicable Version 1 Functional Specifications under `docs/functional/`;
4. accepted ADRs;
5. the normative DD-1 Application Core specifications under `docs/detailed_design/`;
6. the normative DD-2 Shared Capability specifications under `docs/detailed_design/`;
7. `docs/project_management/detailed-design-decomposition-plan-v01.md`;
8. `docs/project_management/dd2-final-horizontal-reconciliation-conformance-closeout-v01.md`.

Where this guide conflicts with a higher-authority normative specification, the higher-authority document governs.

This guide controls drafting practice and document structure. It does not establish application architecture independently of the normative specification hierarchy.

---

## 3. Domain Detailed Design Families

The approved decomposition separates domain Detailed Design into two families.

### 3.1 DD-3 — High-Coupling Domains

DD-3 comprises:

```text
docs/detailed_design/app-domain-detailed-design-v01.md
docs/detailed_design/git-domain-detailed-design-v01.md
docs/detailed_design/nuxt-domain-detailed-design-v01.md
docs/detailed_design/docs-domain-detailed-design-v01.md
```

These domains coordinate the largest number of DD-1 and DD-2 contracts and therefore act as the first domain-level validation of the established architecture.

### 3.2 DD-4 — Policy and Resource Domains

DD-4 comprises:

```text
docs/detailed_design/quality-domain-detailed-design-v01.md
docs/detailed_design/settings-domain-detailed-design-v01.md
docs/detailed_design/ai-domain-detailed-design-v01.md
docs/detailed_design/utils-domain-detailed-design-v01.md
```

These documents remain subject to the same authoring rules defined here.

`Utils` remains last in the sequence so that residual behaviour cannot be placed there merely because a stronger architectural owner has not yet been identified.

### 3.3 No Generic Domain-Orchestration Framework by Default

The existence of repeated orchestration patterns across domains does not by itself justify a new generic domain-orchestration framework, base service, shared domain request type, shared domain result type, or other abstraction.

A common abstraction may be introduced only when the semantics are genuinely shared, are not already owned by DD-1 or DD-2, and justify a durable responsibility boundary.

Similarity of naming, field shape, or workflow structure is insufficient evidence of shared semantic ownership.

---

## 4. The Four Mandatory Domain Questions

Every domain Detailed Design shall answer four questions explicitly:

1. **Which Functional requirements does the domain own?**
2. **Which DD-1 Application Core contracts does it consume?**
3. **Which DD-2 Shared Capability contracts does it coordinate?**
4. **What permanent domain-specific orchestration, state, policy, decision, or result contracts remain after shared concerns are removed?**

These questions form the analytical spine of the document.

A domain Detailed Design is incomplete if it describes domain behaviour without establishing these ownership and dependency boundaries.

---

## 5. Domain Detailed Design Scope

### 5.1 Appropriate Content

A domain Detailed Design may define permanent domain-level:

- orchestration responsibilities;
- use-case coordination;
- sequencing rules;
- policy and decision points;
- applicability rules;
- domain-specific preconditions and acceptance conditions;
- domain-specific state and state transitions;
- domain-specific request or intent contracts where not already defined by DD-1;
- domain-specific result payloads extending canonical DD-1 outcome semantics;
- interpretation of capability evidence;
- capability coordination rules;
- mutation and authorization boundaries;
- conflict and concurrency rules;
- idempotency expectations;
- cancellation interpretation;
- partial-effect interpretation;
- domain-specific security and sensitive-information rules;
- extension points justified by durable domain semantics;
- conceptual components where they express real architectural responsibilities;
- testability and conformance requirements at the design level.

### 5.2 Inappropriate Content

A domain Detailed Design shall not normally define:

- exact source file paths;
- concrete module directory layout;
- current source-tree structure merely because it exists;
- concrete TypeScript classes or services solely to mirror architectural responsibilities;
- exact exported symbols;
- concrete function or method signatures;
- dependency-injection container wiring;
- exact package or library calls;
- current implementation status;
- migration sequencing;
- temporary compatibility structures;
- file-by-file refactoring work;
- concrete test file paths;
- build-system wiring;
- provider-native models as the primary domain contract where AppManager semantics differ;
- duplicated definitions of DD-1 or DD-2 contracts.

These concerns belong principally to Implementation Specifications, implementation planning, or project-management documentation according to their nature.

---

## 6. Governing Architectural Invariants

Every DD-3 and DD-4 document shall preserve the following established invariants.

### 6.1 Delegated Execution Does Not Delegate Application Authority

The Application Engine remains authoritative for application-level command and use-case semantics, policy coordination, managed-scope interpretation, safety constraints, and final application-level outcomes.

A domain may own domain-specific policy and orchestration, but a delegated capability or provider does not acquire application authority merely because it performs part of the work.

### 6.2 Managed Scope Is Not Inferred from Discovery

Recognition, discovery, repository membership, source presence, or resource visibility does not independently establish mutation authority.

Domain orchestration shall consume authoritative managed-project and operation-scope context rather than recreate scope rules locally.

### 6.3 Configuration Resolution Remains Distinct from Domain Policy

Domains consume effective configuration produced by the DD-1 Configuration Resolution contract.

A domain may interpret configuration values for its own policy, but it shall not invent a competing precedence model or independently reconstruct effective configuration.

### 6.4 Canonical Outcome Semantics Remain DD-1-Owned

Domains may define domain-specific result payloads and interpret subordinate evidence, but success, failure, partial success, cancellation, diagnostics, warnings, and related application-level outcome semantics remain governed by the DD-1 Execution Outcomes design.

### 6.5 Capability Results Are Evidence Until Interpreted

A capability or provider result is not automatically a domain result or application result.

The owning domain/use case must interpret relevant capability evidence according to approved policy before the result is accepted at the domain level.

### 6.6 Provider and Capability Replaceability Shall Be Preserved

Domain semantics shall depend upon AppManager-oriented capability contracts rather than provider-specific representations unless the provider semantics are genuinely part of the approved architecture.

### 6.7 Implementation Topology Shall Not Be Presumed

A documented responsibility does not imply a class, service, package, process, runtime, deployment unit, or one-to-one source module.

Detailed Design defines responsibility and contracts; Implementation Specifications define concrete code topology.

---

## 7. Three-Layer Documentation Rule

Domain Detailed Designs shall follow the three-layer rule established during DD-2 reconciliation:

1. **canonical invariant** — reference the authoritative DD-1 or DD-2 rule;
2. **concise local binding** — state how the domain consumes or applies that rule;
3. **domain-specific delta** — define only what is unique to the domain.

The domain document shall not reproduce the complete upstream contract merely to make itself self-contained.

For example:

```text
Canonical invariant:
    DD-1 Configuration Resolution owns effective configuration.

Local binding:
    Git-domain orchestration consumes the operation effective-configuration snapshot.

Domain-specific delta:
    Git policy interprets selected repository-policy values when deciding whether a requested synchronisation operation may proceed.
```

This rule reduces duplication while retaining enough local context for the document to remain understandable.

---

## 8. Standard Domain Detailed Design Structure

The following structure is the default authoring template for DD-3 and DD-4 domain Detailed Designs.

Sections may be concise where the domain has little or no domain-specific delta. Sections should not be expanded artificially merely for structural symmetry.

### 8.1 Section 1 — Purpose

State:

- the permanent domain responsibility defined by the document;
- the principal Functional domain being realised;
- the fact that the document coordinates DD-1 and DD-2 contracts rather than redefining them.

Where useful, include one concise boundary statement identifying the most important concerns that remain owned elsewhere.

### 8.2 Section 2 — Scope

Use two subsections:

#### 2.1 In Scope

Identify the permanent domain-specific orchestration, policy, state, decision, and result concerns addressed by the document.

#### 2.2 Out of Scope

Explicitly name important concerns owned by DD-1, DD-2, another domain, Implementation Specifications, or project-management documentation.

This section is mandatory because domain designs operate at the highest risk of duplicating already-established shared responsibilities.

### 8.3 Section 3 — Governing Requirements and Authorities

Identify the applicable:

- root Design Specification sections;
- Functional Specification sections and requirement identifiers;
- accepted ADRs;
- DD-1 contracts;
- DD-2 contracts;
- approved clarification or reconciliation records where they materially constrain interpretation.

This section defines the document's authority envelope.

### 8.4 Section 4 — Domain Responsibility and Authority Boundary

State explicitly:

- what the domain owns;
- what decisions the domain may make;
- what evidence the domain may interpret;
- what authority remains with Application Core, shared capabilities, other domains, or providers.

A concise ownership table or authority diagram is preferred where it improves clarity.

### 8.5 Section 5 — Consumed DD-1 Application Core Contracts

Identify each DD-1 contract consumed by the domain and the purpose for which it is consumed.

Prefer a compact matrix such as:

| DD-1 contract | Domain use |
|---|---|
| Application Invocation | receives normalized invocation intent where relevant |
| Application Engine | participates in authorised use-case orchestration |
| Managed Project | consumes authoritative managed-project and operation scope |
| Configuration Resolution | consumes effective configuration |
| Execution Outcomes | maps domain interpretation into canonical outcomes |

Only applicable entries should be included.

Do not restate the full DD-1 contract.

### 8.6 Section 6 — Consumed DD-2 Shared Capabilities

Identify each DD-2 capability consumed or coordinated by the domain and the domain purpose for that dependency.

Prefer a compact matrix.

The section shall reinforce that capability consumption does not transfer semantic ownership to the capability and does not permit the domain to redefine capability mechanics.

### 8.7 Section 7 — Domain Contract Model

Define only durable domain-specific contracts required to express the design.

Examples may include:

- domain operation intent;
- domain execution context refinement;
- domain policy inputs;
- domain decision records;
- domain orchestration plans where independently meaningful;
- domain-specific evidence aggregation;
- domain-specific result payloads;
- domain-specific state.

Conceptual contract structures may be represented using neutral text blocks, tables, or type-like notation.

A conceptual contract shall not be presented as a concrete implementation signature unless that implementation form is itself an approved enduring constraint.

### 8.8 Section 8 — Use-Case Orchestration

This should normally be the principal section of a domain Detailed Design.

Organise orchestration by approved Functional use case rather than by hypothetical classes or source modules.

For each significant use case, define as applicable:

#### Intent

The domain intent being fulfilled.

#### Preconditions and Applicability

The domain-specific conditions under which orchestration may proceed.

#### Authoritative Inputs

Identify the source of caller intent, managed scope, effective configuration, authorization evidence, and other authoritative context.

#### Orchestration Sequence

Describe the semantic sequence of domain decisions and delegated capability interactions.

Prefer a compact numbered flow or ASCII sequence diagram when it materially improves clarity.

#### Decision Points

Identify decisions genuinely owned by the domain.

#### Delegated Operations

Identify subordinate capability operations required by the use case without redefining their internal mechanics.

#### Interpretation and Acceptance

Define how the domain interprets subordinate evidence and determines domain-level acceptance.

#### Failure, Partial Success, and Cancellation

Define only the domain-specific interpretation and effects. Canonical outcome semantics remain DD-1-owned.

### 8.9 Section 9 — Domain State and State Transitions

Use this section where durable domain state or a meaningful state machine exists.

Define only state that belongs to the domain and is required to realise approved behaviour.

Do not manufacture a state machine merely to satisfy the document template.

If the domain has no meaningful persistent or transient domain state beyond existing DD-1/DD-2 contracts, state that explicitly and keep the section concise.

### 8.10 Section 10 — Domain Policy and Decision Rules

Define domain-specific policy that cannot be reduced to shared capability mechanics.

Examples may include:

- applicability decisions;
- domain-specific safety policy;
- workflow sequencing policy;
- acceptance/rejection rules;
- domain-specific existing-state handling;
- domain-specific conflict policy.

Policy shall remain distinct from lower-level technical execution.

### 8.11 Section 11 — Safety, Mutation, and Authorization

This section is mandatory.

The domain design shall distinguish, where applicable:

```text
recognition
    != selection
    != intent
    != authorization
    != execution
    != technical success
    != domain acceptance
    != application success
```

Define:

- where mutation intent originates;
- what authorization or confirmation evidence is required;
- which capability performs bounded mutation;
- how stale or changed state is treated;
- how completed effects are interpreted;
- what the domain explicitly may not infer.

### 8.12 Section 12 — Failure, Cancellation, and Partial Effects

Define domain-specific behaviour for:

- subordinate capability failure;
- unavailable capability/provider;
- cancellation;
- partial completion;
- retained evidence;
- already-completed effects;
- whether continuation, retry, recovery, or manual intervention is semantically possible.

Do not redefine generic DD-1 cancellation or outcome semantics.

### 8.13 Section 13 — Headless and Interaction Independence

State how the domain preserves presentation independence.

Domain behaviour shall not depend on TUI prompting or another presentation-specific interaction mechanism.

Where user choice or authorization is required, the domain should represent the requirement structurally so that TUI, Headless, GUI, IDE, automation, or other adapters can satisfy it through the shared invocation model.

### 8.14 Section 14 — Concurrency, Idempotency, and Conflict Behaviour

Address where relevant:

- repeatability of domain operations;
- stale-state or revision conflicts;
- parallel-operation hazards;
- application-level serialization requirements;
- idempotent or already-satisfied outcomes;
- conflict detection delegated to DD-2 capabilities;
- conflict interpretation retained by the domain.

Do not invent concurrency mechanisms where the Functional requirements do not justify them.

### 8.15 Section 15 — Security and Sensitive Information

Define only the domain-specific security delta.

Examples include:

- handling of credentials or repository metadata;
- environment-definition sensitivity;
- AI disclosure boundaries;
- generated documentation containing sensitive project information;
- restrictions on logging or diagnostic projection.

Shared sensitive-resource and provider rules should be referenced rather than duplicated.

### 8.16 Section 16 — Extensibility and Replaceability

Define any real domain extension points and the boundaries that replacement must preserve.

For example:

```text
provider replacement
        must not alter
approved domain use-case semantics
```

Do not introduce speculative plugin systems, generic extension registries, or base frameworks without a demonstrated durable requirement.

### 8.17 Section 17 — Testability and Conformance Requirements

Define what the design must permit to be tested independently.

Examples include:

- orchestration against controlled capability substitutes;
- domain policy decisions;
- interpretation of capability results;
- capability unavailability;
- cancellation;
- partial effects;
- deterministic Headless operation;
- provider substitution;
- stale-state handling;
- safety and mutation boundaries.

Do not specify concrete test file paths or framework-specific test implementation unless required by an accepted enduring technical decision.

### 8.18 Section 18 — Traceability

Provide explicit traceability between domain Detailed Design identifiers and their authorities.

A table is preferred:

| Detailed Design contract | Design authority | Functional requirement(s) | Related DD contract(s) |
|---|---|---|---|
| `DD-<DOMAIN>-NNN` | applicable Design section | `FR-...` | applicable DD-1/DD-2 identifiers |

Traceability shall be sufficient for later Implementation Specifications to map concrete code components back to approved Detailed Design.

### 8.19 Section 19 — Conformance Invariants

Conclude with concise domain conformance invariants where they add verification value.

These should express architectural rules that future implementation must preserve and that later DD-5 auditing can verify.

Example pattern:

```text
DD-<DOMAIN>-CI-001
Capability-provider success shall not independently constitute domain or AppManager application success.
```

Only meaningful invariants should be created; avoid restating every requirement as a conformance invariant.

---

## 9. Detailed Design Identifier Conventions

Domain Detailed Design identifiers shall use the families established by the decomposition plan:

```text
DD-APP-*   app domain
DD-GIT-*   git domain
DD-NUXT-*  nuxt domain
DD-DOCS-*  docs domain
DD-QUAL-*  quality domain
DD-SET-*   settings domain
DD-AI-*    ai domain
DD-UTIL-*  utils domain
```

Identifiers should be stable enough for later Implementation Specifications, audits, tests, and traceability records to reference them.

Numeric assignment should be monotonic within each domain document and should not be reused for a different semantic contract after publication.

Conformance-invariant identifiers may use a domain-specific `-CI-` suffix family where useful, for example `DD-GIT-CI-001`.

---

## 10. Presentation Conventions

### 10.1 Markdown

Markdown is the canonical presentation format.

Use prose for:

- semantic ownership;
- rationale;
- policy;
- important distinctions;
- interpretation rules.

Use tables for:

- contract consumption;
- authority matrices;
- traceability;
- concise state or decision comparisons.

Use ASCII diagrams for:

- dependency direction;
- authority flow;
- orchestration sequences;
- state relationships.

### 10.2 Normative Language

Use `shall`, `must`, `shall not`, and `must not` where the document establishes normative Detailed Design requirements.

Use descriptive language where explaining rationale, examples, or non-normative context.

### 10.3 Conceptual Contract Notation

Conceptual data or request/result contracts may use neutral type-like notation such as:

```text
DomainOperationRequest
    intent
    managed_project_context
    effective_configuration
    authorization_evidence
    domain_inputs
```

This notation describes semantic structure and does not imply a concrete class, interface, source file, serialization format, or TypeScript declaration.

Concrete language syntax should be avoided unless it materially clarifies a permanent contract and does not accidentally prescribe Implementation Specification detail.

### 10.4 Diagrams Shall Show Authority, Not Only Calls

Where a diagram includes delegated capability execution, it should make clear where domain/application interpretation occurs.

A preferred pattern is:

```text
Application Engine
        |
        v
Domain orchestration
        |
        +--> DD-1 context / scope / configuration
        +--> DD-2 capability evidence or execution
        |
        v
domain interpretation / acceptance
        |
        v
DD-1 canonical outcome
```

A raw call graph that obscures authority boundaries is insufficient where authority is material to the design.

---

## 11. Anti-Duplication Rules

Domain Detailed Designs shall not become independent copies of DD-1 or DD-2 contracts.

In particular:

- App shall not redefine Settings environment-definition CRUD semantics;
- Git shall not redefine Repository Capability primitives;
- Nuxt shall not redefine generic Source Intelligence, Source Transformation, Repository, Documentation, Settings, or Resource Access contracts;
- Docs shall not redefine Documentation Capability mechanics, AI provider mechanics, or generic source-transformation mechanics;
- Quality shall not redefine Quality Capability normalized execution/finding contracts;
- Settings shall not redefine Configuration Resolution precedence or effective-value construction;
- AI shall not redefine provider mechanics already owned by AI Capability;
- Utils shall not acquire behaviour merely because no stronger owner has yet been identified.

Where a domain-specific refinement is genuinely required, the document shall state:

1. the upstream contract being refined;
2. why the refinement is domain-specific;
3. the exact additional semantic constraint;
4. why ownership remains coherent and non-duplicative.

---

## 12. Conceptual Components at Detailed Design Level

Detailed Design may define conceptual components when they represent meaningful permanent responsibility boundaries.

For example, a document may identify an orchestration responsibility such as:

```text
Repository Synchronisation Orchestration
    |
    +--> obtains authoritative managed scope
    +--> obtains repository evidence
    +--> applies Git-domain policy
    +--> coordinates approved repository operations
    +--> interprets resulting evidence
```

Such a component is an architectural responsibility, not an instruction to implement a class with the same name.

A conceptual component should be introduced only when it improves the precision of ownership, collaboration, state, or testability.

Detailed Design shall not create one `Service`, `Manager`, `Controller`, or `Orchestrator` per section merely for structural symmetry.

---

## 13. Boundary Between Detailed Design and Code-Component Design

The project shall preserve a deliberate separation between architectural component design and concrete code-component design.

### 13.1 Detailed Design Owns

DD-3 and DD-4 may define:

- permanent technical responsibilities;
- conceptual components;
- domain contracts;
- dependency direction;
- orchestration;
- state transitions;
- domain algorithms and decision rules;
- extension points;
- design-level testability requirements.

### 13.2 Implementation Specification Owns

Concrete code-component design is deferred until the Detailed Design family has passed horizontal conformance review.

Implementation Specifications may then define:

- concrete source directories and files;
- TypeScript modules;
- exported interfaces, types, classes, and functions;
- concrete method/function signatures;
- dependency-injection and bootstrap wiring;
- concrete package/library usage;
- provider bindings;
- serialization/transport binding where required;
- build/runtime integration;
- concrete test files and fixtures;
- migration and replacement work;
- source-level implementation constraints.

The governing distinction is:

> **Detailed Design defines what technical responsibilities and contracts must exist; Implementation Specification defines how those approved responsibilities are partitioned into concrete code components.**

---

## 14. DD-5 and DD-6 Transition

### 14.1 DD-5 — Detailed Design Conformance Audit

After DD-3 and DD-4 are complete, DD-5 shall perform horizontal conformance review before code-component reduction to practice.

The audit should verify at least:

- Design and Functional traceability;
- duplicate semantic ownership;
- circular dependency pressure;
- DD-1/DD-2 contract misuse;
- provider leakage;
- managed-scope authority;
- configuration authority;
- outcome consistency;
- transformation safety;
- AI subordination;
- Headless compatibility;
- cancellation and concurrency semantics;
- testability;
- sensitive-data handling;
- inappropriate Implementation-level detail.

### 14.2 DD-6 — Implementation Specification Planning

Only after DD-5 passes should the project define the component decomposition required to reduce Detailed Design into concrete code.

DD-6 should establish an implementation component map that connects approved Detailed Design identifiers to prospective code responsibilities without changing their semantics.

Conceptually:

```text
approved Detailed Design contracts
            |
            v
implementation component decomposition
            |
            +--> component boundaries
            +--> ownership
            +--> dependency graph
            +--> contract-to-component mapping
            +--> proposed module grouping
            |
            v
Implementation Specifications
            |
            v
concrete implementation
```

The exact source topology shall be decided during this reduction-to-practice phase rather than inferred prematurely during DD-3 or DD-4.

---

## 15. Domain Drafting Workflow

For each DD-3 or DD-4 document, the author shall:

1. verify the current live repository state;
2. read the governing documentation in the authoritative order defined by current handover/project-management guidance;
3. identify the Functional requirements owned by the domain;
4. identify relevant Design Specification authority;
5. identify consumed DD-1 contracts;
6. identify coordinated DD-2 capabilities;
7. identify applicable reconciliation/clarification decisions;
8. isolate the permanent domain-specific delta;
9. draft the document using the structure in this guide;
10. verify that no shared contract has been silently redefined;
11. verify that no implementation topology has been inferred from the current codebase;
12. verify traceability and conformance invariants;
13. compare the focused branch against current `master`;
14. open a focused pull request;
15. stop before beginning the next Detailed Design objective unless explicitly authorised.

No domain design shall use removed archive documentation or superseded historical material as current architectural authority.

---

## 16. Review Questions for Each Domain Document

Before a domain Detailed Design is considered complete, reviewers should be able to answer `yes` to the following questions:

- Is every owned Functional requirement accounted for?
- Are consumed DD-1 contracts explicit?
- Are coordinated DD-2 capabilities explicit?
- Is the permanent domain-specific delta clear?
- Is domain authority distinguished from Application Engine authority?
- Is managed scope consumed rather than reinvented?
- Is effective configuration consumed rather than recalculated?
- Are capability/provider results treated as evidence until interpreted?
- Are mutation intent, authorization, execution, technical success, domain acceptance, and application success kept distinct where relevant?
- Are provider-native details prevented from leaking into primary domain semantics?
- Is the design independent of presentation mode?
- Is the design independent of unnecessary implementation topology?
- Are conceptual components justified by real responsibility seams?
- Has concrete code-component design been deferred appropriately?
- Is traceability sufficient for later Implementation Specifications?
- Can the design be tested against controlled capability substitutes where appropriate?
- Are domain-specific security, cancellation, partial-effect, conflict, and concurrency concerns addressed where required?
- Does the document avoid speculative generic frameworks based only on similarity?

A `no` answer indicates that the document requires further design or clarification before it should be treated as complete.

---

## 17. Completion Criterion for This Guide

This guide is satisfied when DD-3 and DD-4 documents consistently:

- use the approved domain decomposition;
- answer the four mandatory domain questions;
- preserve DD-1 and DD-2 semantic ownership;
- emphasise orchestration and domain-specific policy rather than shared mechanics;
- use the standard structural pattern where applicable;
- maintain explicit authority and mutation boundaries;
- provide stable Detailed Design identifiers and traceability;
- remain free of unnecessary implementation-specific code topology;
- leave concrete code-component decomposition to DD-6 and Implementation Specification work;
- support efficient horizontal conformance review during DD-5.

The intended phase progression remains:

```text
DD-1  Application Core
DD-2  Shared Capabilities
DD-3  High-Coupling Domains
DD-4  Policy and Resource Domains
      |
      v
DD-5  Detailed Design Conformance Audit
      |
      v
DD-6  Implementation Specification Planning
      |
      v
Implementation Specifications
      |
      v
Concrete implementation
```

This guide does not itself authorise progression between those phases; progression remains governed by current project-management state and the applicable conformance gates.
