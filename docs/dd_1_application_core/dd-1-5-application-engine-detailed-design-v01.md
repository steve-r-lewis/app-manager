# DD-1.5 — AppManager Application Engine Detailed Design

> **Detailed Design ID:** DD-1.5
>
> **Design family:** DD-1 — Application Core

> **Status:** Version 1 Detailed Design Specification
>
> **Detailed Design authority:** This document defines the permanent internal responsibility and authority model by which AppManager dispatches and coordinates application use cases while preserving one coherent source of application semantics.
>
> **Governing sources:** [Project Documentation Guide](../project-documentation-guide-v01.md), [AppManager Design Specification](../appmanager-design-specification-v01.md), Version 1 Functional Specifications, [ADR-0001 — Primary Application Runtime](../project_management/decisions/adr-0001-primary-application-runtime.md)
>
> **Related Detailed Designs:** [DD-1.1 — Application Invocation](dd-1-1-application-invocation-detailed-design-v01.md), [DD-1.2 — Execution Outcomes](dd-1-2-execution-outcomes-detailed-design-v01.md), [DD-1.3 — Managed Project](dd-1-3-managed-project-detailed-design-v01.md), [DD-1.4 — Configuration Resolution](dd-1-4-configuration-resolution-detailed-design-v01.md), [Application Core Bootstrap Resolution Clarification](clarifications/application-core-bootstrap-resolution-clarification-v01.md)
>
> **Planning source:** [Detailed Design Decomposition Plan and Canonical Register](../project_management/detailed-design-decomposition-plan-v01.md)

## 1. Purpose

This specification defines the Application Engine as AppManager's permanent application-authority boundary.

The Engine accepts normalized semantic invocation, establishes the execution context required by the owning use case, coordinates domain orchestration and specialist capabilities, applies application policy and safety constraints, interprets delegated execution evidence, and publishes the final AppManager outcome.

The central rule is:

> **Delegated execution does not mean delegated application authority.**

A command handler, domain orchestrator, scanner, resolver, strategy, provider, process runner, repository implementation, AI provider, filesystem mechanism, or presentation adapter may perform a bounded responsibility. None acquires authority to redefine AppManager command semantics merely because it performs that responsibility.

A second rule follows:

> **The Application Engine is an authority and responsibility boundary, not a requirement for one class, package, process, executable, deployment unit, or runtime.**

This design therefore establishes permanent internal seams without prescribing the Version 1 TypeScript module topology.

---

## 2. Scope

This specification owns the permanent internal design for:

- application command/use-case registration and lookup;
- dispatch from the Application Invocation Contract;
- use-case ownership and semantic authority;
- execution-context establishment;
- managed-project and managed-scope coordination;
- effective-configuration acquisition;
- application policy and safety evaluation points;
- authorization-evidence evaluation;
- preview coordination;
- domain/use-case orchestration boundaries;
- capability acquisition and bounded delegation;
- interpretation of capability/provider execution evidence;
- final application acceptance;
- structured outcome publication;
- cancellation propagation and interpretation;
- partial-success interpretation;
- retry and resume authority boundaries;
- application-level concurrency and stale-state coordination;
- nested/sub-use-case coordination;
- interaction-mode equivalence;
- dependency direction;
- extension/conformance rules for future commands, domains and capabilities.

It also establishes how later domain Detailed Designs fit beneath the shared Engine authority without becoming independent application engines.

---

## 3. Out of Scope

This specification deliberately does not prescribe:

- concrete TypeScript classes, interfaces, decorators or generics;
- source-code paths or package layout;
- dependency-injection framework or container;
- event-bus library;
- transport or RPC protocol;
- process boundaries;
- serialization format;
- command-line parsing;
- TUI menu implementation;
- GUI or IDE presentation;
- filesystem/process/Git/Nuxt/AI provider implementations;
- exact scanner, parser or strategy classes;
- persistence technology;
- concrete lock primitives;
- thread/worker model;
- exact exception hierarchy;
- logging or telemetry implementation;
- current-code migration sequencing.

Those concerns belong to later Detailed Designs, Implementation Specifications, or project-management work.

---

## 4. Architectural Position

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
        +--> context-independent / bootstrap configuration where needed
        +--> managed-project resolution
        +--> project/scope-aware configuration resolution
        +--> managed-scope / policy / safety / authorization
        +--> domain or use-case orchestration
        |        |
        |        +--> shared capabilities
        |        +--> scanners / recognizers
        |        +--> strategies / planners
        |        +--> providers / execution mechanisms
        |
        v
execution evidence + domain result information
        |
        v
Application Engine interpretation / acceptance
        |
        v
AppManager Execution Outcome
        |
        v
interaction-specific projection
```

Where managed-project resolution depends upon configuration, the staged dependency semantics are governed by [Application Core Bootstrap Resolution Clarification](clarifications/application-core-bootstrap-resolution-clarification-v01.md). The diagram describes responsibility and authority direction, not mandatory call-stack or process topology.

### 4.1 Authority direction

Authority flows inward from semantic invocation to the Engine and downward through explicitly delegated responsibilities. Evidence flows back upward for interpretation.

A lower-level component may reject an impossible or unsafe technical request within its own contract, but it does not thereby own the application-level meaning of the use case.

### 4.2 No presentation authority

TUI, Headless, GUI, IDE, CI and automation adapters may acquire input, provide context hints, carry authorization evidence, display progress and project outcomes. They shall not maintain independent command semantics.

### 4.3 No provider authority

A provider's success, failure, warning, default, discovered resource, exit code or response does not independently determine AppManager success or policy.

---

## 5. Responsibility Decomposition

The Application Engine is decomposed into logical responsibilities. These are not requirements for one implementation object per responsibility.

### DD-ENG-001 — Command/use-case catalogue integration

The Engine shall consume the canonical command catalogue defined by the Application Invocation Detailed Design and associate each executable command identity with exactly one owning application use-case definition.

Registration shall not permit two independent semantic owners for the same canonical command identity.

### DD-ENG-002 — Dispatcher

The dispatcher shall route a validated, recognized invocation to its owning use case without deriving semantics from presentation labels, adapter routes, menu positions, provider operations or implementation filenames.

### DD-ENG-003 — Execution-context coordinator

The Engine shall establish an invocation-scoped execution context containing the authoritative application information needed by the use case, including as applicable:

- invocation identity and canonical command identity;
- explicit caller inputs/options;
- resolved managed-project context;
- resolved managed scope;
- effective configuration snapshot;
- authorization evidence and authorization state;
- preview intent;
- cancellation linkage;
- event/progress channel;
- correlation metadata;
- capability access constrained to the use case;
- execution/effect evidence accumulated during the workflow.

### DD-ENG-004 — Policy and safety evaluator

Application policy and safety constraints shall be evaluated at defined semantic checkpoints before consequential effects and re-evaluated when a material change invalidates prior assumptions.

### DD-ENG-005 — Use-case orchestrator responsibility

Each application use case shall own its permanent workflow semantics: prerequisite order, capability coordination, application decisions, conditional branches, acceptance criteria and recovery/continuation rules.

The responsibility may be implemented by one or more collaborators but remains subordinate to the Application Engine authority model.

### DD-ENG-006 — Capability broker responsibility

The Engine shall provide or coordinate access to approved specialist capabilities through AppManager-oriented contracts. Capability acquisition shall not expose arbitrary provider operations as application commands.

### DD-ENG-007 — Result interpreter

The Engine/use-case authority shall interpret normalized execution evidence against invocation intent, managed scope, configuration, policy, safety constraints and domain acceptance criteria before determining the final application status.

### DD-ENG-008 — Outcome publisher

The Engine shall produce the canonical final outcome through the shared DD-1.2 outcome contract. Presentation adapters may project that outcome but shall not recalculate it.

### DD-ENG-009 — Cancellation coordinator

The Engine shall propagate cancellation intent to active orchestration/capabilities and determine the application-level terminal meaning from observed completion and known effects.

### DD-ENG-010 — Application concurrency coordinator

Where concurrent or stale operations can change application semantics, the Engine shall coordinate application-level conflict detection/revalidation without assuming one universal locking mechanism.

---

## 6. Command and Use-Case Ownership

### DD-ENG-011 — Canonical command identity

Dispatch shall use the canonical command identity from DD-1.1. Presentation aliases, shortcuts and host-specific actions must normalize before Engine dispatch.

### DD-ENG-012 — Single semantic owner

Every executable canonical command shall have one identifiable semantic owner. The owner defines what constitutes valid execution, required context, required policy, acceptable results and final application success.

### DD-ENG-013 — Domain grouping is not execution authority

The approved domains (`app`, `docs`, `git`, `ai`, `nuxt`, `quality`, `utils`, `settings`) organize product behaviour. A domain name does not imply an autonomous engine, service boundary, process or provider.

### DD-ENG-014 — Commands are not provider methods

Provider operations shall not become AppManager commands solely because a provider exposes them. A command exists only when approved application behaviour defines the corresponding use case.

### DD-ENG-015 — Compatibility aliases

Legacy or compatibility command surfaces may map to a canonical use case, but shall remain thin and shall not preserve an independent workflow implementation.

### DD-ENG-016 — Unknown and unavailable remain distinct

The Engine shall preserve the DD-1.1 distinction between an unknown command and a recognized command that is unavailable in the resolved context.

---

## 7. Execution Context

### DD-ENG-017 — Invocation-scoped context

Each significant invocation shall receive its own execution context. Mutable invocation state shall not leak into unrelated invocations.

### DD-ENG-018 — Explicit versus resolved information

The execution context shall preserve the distinction between caller-supplied requests/hints and authoritative values resolved by AppManager.

Examples include:

```text
requested target != resolved managed project
requested scope != resolved managed scope
configuration override candidate != effective configuration
presented confirmation != accepted authorization state
preview request != applied effects
```

### DD-ENG-019 — Managed-project dependency

When a use case depends on project semantics, the Engine shall obtain sufficient managed-project context through DD-1.3 before treating project-derived facts as authoritative. Where project resolution itself depends upon configuration, only configuration valid for the bootstrap stage defined by [Application Core Bootstrap Resolution Clarification](clarifications/application-core-bootstrap-resolution-clarification-v01.md) may contribute before managed-project identity exists.

### DD-ENG-020 — Managed-scope dependency

Consequential operations shall operate against an operation-specific managed scope. Discovery or recognition alone shall not be substituted for targetability or mutation authority. Where scope resolution depends upon project- or scope-aware configuration, the required operation-effective configuration shall be resolved before finalizing that scope.

### DD-ENG-021 — Configuration dependency

When configuration is required, the Engine shall consume governed effective configuration from DD-1.4 rather than permitting the use case or provider to independently select raw configuration sources. The Engine shall distinguish bootstrap-effective configuration used during project resolution from the later operation-effective configuration snapshot; a bootstrap value is not automatically the complete operation snapshot.

### DD-ENG-022 — Configuration snapshot stability

A use case shall normally execute against an immutable effective-configuration snapshot established for the relevant execution phase. Dynamic re-resolution requires explicit workflow semantics. A material difference between bootstrap assumptions and the later operation-effective snapshot shall trigger revalidation of dependent project, scope, policy, safety or authorization decisions.

### DD-ENG-023 — Context completeness

The Engine shall resolve only the context required to make the current use case semantically safe and deterministic. It shall not require exhaustive project discovery when the operation does not need it.

### DD-ENG-024 — Context revalidation

If a material project, scope, configuration, authorization or external-state assumption becomes stale before a consequential step, the owning workflow shall revalidate or fail safely rather than silently continue on invalid assumptions.

---

## 8. Orchestration Lifecycle

A significant use case conceptually passes through the following lifecycle, with stages omitted where irrelevant. Where project resolution depends upon configuration, the bootstrap stages are explicit:

```text
invocation accepted
    -> command/use-case resolved
    -> prerequisite host/invocation context resolved
    -> context-independent configuration candidates resolved where required
    -> bootstrap effective configuration established where required
    -> managed-project resolution
    -> sufficient managed-project context established
    -> project/scope-dependent configuration resolved
    -> operation effective-configuration snapshot established
    -> managed scope resolved/finalized
    -> availability and invocation/domain validation completed as context requires
    -> policy/safety evaluated
    -> authorization established where required
    -> preview/plan produced where requested
    -> specialist capabilities delegated
    -> evidence/effects accumulated
    -> application acceptance evaluated
    -> final outcome published
```

For operations that do not require project-aware configuration, irrelevant stages may be omitted or collapsed. Availability and validation may also occur at more than one semantic checkpoint as additional context becomes authoritative. This is a semantic dependency lifecycle, not a required synchronous call sequence or a requirement for one physical configuration-resolution pass.

### DD-ENG-025 — Effects require prerequisite satisfaction

No consequential stage may begin while a required prerequisite on which that effect depends remains unresolved, invalid, ambiguous or unauthorized.

### DD-ENG-026 — Stage-specific validation

Validation may occur at multiple stages. Early structural validation does not replace later context-, scope-, plan- or effect-sensitive validation.

### DD-ENG-027 — Material plan change

If execution planning materially changes target, scope, destructive character, required capability or consequential effects, affected policy and authorization decisions shall be re-evaluated before execution.

### DD-ENG-028 — Evidence accumulation

The orchestration context shall preserve material normalized evidence and effects required to determine final status and recovery information.

### DD-ENG-029 — No success by reaching end of handler

Completing an implementation path without an exception is insufficient to establish application success. The use case must satisfy its acceptance criteria.

---

## 9. Domain Orchestration Model

Later domain Detailed Designs shall define domain-specific use-case orchestration beneath this Engine contract.

### DD-ENG-030 — Domain orchestration responsibility

A domain orchestrator may coordinate multiple shared capabilities and domain policies for an approved use case.

For example, a future App lifecycle operation may coordinate project resolution, configuration, process execution, quality checks and Git capability without transferring ownership of those specialist semantics into the App domain.

### DD-ENG-031 — Shared semantics not duplicated

Domain designs shall consume DD-1 invocation, outcome, project and configuration contracts rather than defining domain-local equivalents.

### DD-ENG-032 — Cross-domain composition

A use case may coordinate behaviour associated with another domain when composition is necessary, but the subordinate domain/capability semantics remain owned by their designated responsibility boundary.

Example:

```text
app.create
   -> root application lifecycle semantics owned by App use case
   -> Nuxt-specific provisioning delegated to Nuxt capability/use case where needed
   -> repository initialization delegated to Git/repository capability where requested
```

The App use case owns the composed application outcome, not the internal semantics of Git or Nuxt.

### DD-ENG-033 — No circular authority

A subordinate capability or nested use case shall not call upward into presentation or redefine the parent use case's final acceptance policy.

---

## 10. Capability Delegation

### DD-ENG-034 — AppManager-oriented capability contracts

Capabilities shall expose bounded technical responsibilities meaningful to AppManager rather than leaking arbitrary provider APIs into the Engine.

### DD-ENG-035 — Delegation request

A delegation request shall carry only the context, target, configuration and policy-derived constraints needed by the capability.

### DD-ENG-036 — Least semantic authority

A capability shall receive the least application authority necessary to perform its bounded task. It shall not infer broader target or mutation scope from accessible resources.

### DD-ENG-037 — Capability evidence

Capabilities shall return normalized technical evidence, structured findings, proposed plans, applied effects or bounded result payloads suitable for DD-1.2 interpretation.

### DD-ENG-038 — Provider normalization

Provider-specific exceptions, exit codes, SDK objects and raw responses shall be normalized at the capability boundary before they participate in final application interpretation.

### DD-ENG-039 — Provider fallback

Provider fallback is permitted only where the owning capability/use case semantics allow it and the fallback does not silently change application intent, scope, safety or acceptance criteria.

### DD-ENG-040 — Capability unavailability

Capability unavailability shall be represented explicitly and interpreted by the owning use case; it shall not automatically imply either command failure or fallback.

---

## 11. Scanners, Recognizers, Resolvers, Strategies and Responders

This section fixes their position in the architecture without prematurely prescribing concrete implementations.

### DD-ENG-041 — Scanners and recognizers

Scanners, recognizers, parsers and structural analyzers are evidence-producing responsibilities. They may identify structure, facts, candidates or findings but do not acquire mutation or application-policy authority.

> **Recognition is not mutation authority.**

### DD-ENG-042 — Resolvers

Resolvers determine a governed answer within a bounded semantic concern, such as managed-project identity, managed scope, configuration value, provider selection or strategy selection.

Resolving a value does not grant authority over the use case consuming it.

### DD-ENG-043 — Strategies

A strategy may select or propose a technical approach for realizing already-approved intent. A strategy shall not independently decide that the application intent is authorized, in scope or acceptable.

The expected source-transformation relationship is:

```text
recognition / inspection
    -> structural facts
    -> strategy selection
    -> bounded transformation plan
    -> Engine/use-case policy and authorization
    -> transformation execution
    -> source-level validation
    -> application-level acceptance
```

### DD-ENG-044 — Responders and normalizers

A provider-response normalizer may convert provider-native output into AppManager-oriented evidence. A presentation responder/projector may render canonical outcomes. Neither shall redefine the final outcome.

The generic term `Responder` should be avoided in normative Detailed Design where a more precise responsibility name is available.

### DD-ENG-045 — Orchestrators

Orchestrators own sequencing within the bounded use case or domain responsibility assigned to them. They coordinate scanners, resolvers, strategies and capabilities but remain subject to the Engine authority model.

### DD-ENG-046 — No universal pattern framework

The existence of these responsibility patterns does not mandate generic Scanner, Resolver, Strategy, Responder or Orchestrator frameworks. Shared abstractions require demonstrated common semantics, not naming similarity.

---

## 12. Policy and Safety

### DD-ENG-047 — Policy evaluation belongs above mechanism

Application policy shall be evaluated before delegating a consequential operation when the decision depends on application intent, managed scope, safety or authorization.

### DD-ENG-048 — Capability-local safety

A capability may enforce stricter technical invariants within its own contract, such as rejecting malformed targets or unsafe technical operations. Such rejection supplements rather than replaces application policy.

### DD-ENG-049 — Non-destructive constraints

Where a use case is specified as non-destructive or bounded, delegated capabilities shall receive constraints sufficient to prevent them from broadening the operation beyond the approved semantics.

### DD-ENG-050 — Authorization evidence

Interaction adapters may acquire authorization/confirmation evidence. The Engine/use case determines whether the evidence satisfies the required application authorization.

### DD-ENG-051 — No inferred authorization

Headless mode, automation, provider configuration, environment variables, filesystem permissions or successful authentication shall not be treated as implicit authorization for an application operation unless the owning semantics explicitly define them as valid evidence.

### DD-ENG-052 — Authorization invalidation

Authorization shall be reconsidered if the material target, scope, destructive character or plan changes after evidence was accepted.

---

## 13. Preview and Planning

### DD-ENG-053 — Preview is a use-case semantic

DD-1.1 carries preview intent; the owning use case defines what meaningful preview means.

### DD-ENG-054 — Proposed versus applied effects

Preview/planning output shall use DD-1.2 proposed-effect semantics and shall never be represented as applied state.

### DD-ENG-055 — Planning does not authorize execution

A successfully generated plan does not itself grant authorization to apply it.

### DD-ENG-056 — Plan validation

A plan that depends on source intelligence, repository state, configuration or external state shall be validated/revalidated sufficiently close to application to prevent stale assumptions from silently broadening effects.

---

## 14. Application Acceptance and Outcomes

### DD-ENG-057 — Technical completion is evidence

Technical completion reported by a capability is evidence, not final AppManager success.

### DD-ENG-058 — Application acceptance

The owning use case shall evaluate whether the requested application intent was satisfied under applicable policy, scope and acceptance criteria.

### DD-ENG-059 — Final outcome ownership

The Engine shall publish one canonical final outcome for the invocation using DD-1.2. Domain payloads may extend the outcome by composition but shall not redefine shared terminal status semantics.

### DD-ENG-060 — Partial success

Partial success shall be selected only where the use case's semantics permit meaningful partial satisfaction and DD-1.2 evidence identifies the completed and incomplete portions.

### DD-ENG-061 — No-op and already satisfied

A no-op or already-satisfied result may contribute to application success where the use case defines the requested state as already achieved. It shall remain distinguishable in subordinate result/effect information where meaningful.

### DD-ENG-062 — Failure preserves effects

Failure shall not discard known consequential effects that occurred before rejection or failure.

### DD-ENG-063 — Presentation projection

Exit codes, terminal formatting, GUI notifications, IDE messages and automation projections shall derive from the canonical outcome through adapter-specific projection rules. They shall not become alternate outcome authorities.

---

## 15. Cancellation

### DD-ENG-064 — Cooperative cancellation

Cancellation is cooperative unless a capability explicitly guarantees stronger semantics.

### DD-ENG-065 — Propagation

The Engine shall propagate cancellation intent to active orchestration and delegated capabilities that support cancellation.

### DD-ENG-066 — Cancellation request is not terminal state

A cancellation request shall not be published as a cancelled outcome until the workflow has established the resulting known state sufficiently to terminate.

### DD-ENG-067 — Cancellation does not imply rollback

The Engine shall preserve effects completed before cancellation and shall not claim rollback unless the use case/capability explicitly guarantees and verifies it.

### DD-ENG-068 — Late cancellation

If cancellation arrives after the consequential work has irreversibly completed and application acceptance is established, the final outcome shall represent actual completion rather than fabricate cancellation.

---

## 16. Retry, Resume, Fallback and Compensation

### DD-ENG-069 — No generic application retry

The Engine shall not apply a universal retry policy to arbitrary use cases.

### DD-ENG-070 — Provider-local retry

A capability may perform provider-local retry only when its contract establishes that retry does not alter application semantics and can be performed safely within the delegated task.

### DD-ENG-071 — Use-case retry authority

Retry or resume of a use case is an application decision and may require fresh project resolution, configuration, state validation, scope resolution and authorization.

### DD-ENG-072 — Retryability evidence

DD-1.2 retryability/transience evidence may inform an Engine decision but shall not itself authorize retry.

### DD-ENG-073 — Compensation

Compensation is a separate use-case/capability action. It shall not be inferred from failure and shall be represented explicitly in effects/outcomes.

### DD-ENG-074 — Fallback semantics

Fallback to alternate strategies/providers/capabilities must preserve the approved application intent or trigger renewed policy/authorization where the material execution plan changes.

---

## 17. Concurrency, Staleness and Isolation

### DD-ENG-075 — Invocation isolation

Execution state, configuration snapshots, cancellation and accumulated evidence shall be invocation-scoped unless a shared resource contract explicitly defines otherwise.

### DD-ENG-076 — Shared resource conflicts

Where multiple invocations can affect the same project resource, repository, configuration concern or generated artifact, the owning use case/capability shall expose sufficient conflict evidence for safe application coordination.

### DD-ENG-077 — Stale project context

The Engine shall not assume that a previously resolved managed-project context remains valid indefinitely across consequential stages.

### DD-ENG-078 — Stale configuration

An established operation snapshot remains semantically stable, but a workflow that explicitly re-resolves configuration shall treat changed provenance/value as a new decision input.

### DD-ENG-079 — No global serialization requirement

This design does not require all AppManager operations to execute serially. Concurrency restrictions shall be scoped to actual semantic/resource conflicts.

### DD-ENG-080 — Deterministic conflict outcome

Unresolvable application-level conflicts shall fail or defer deterministically rather than permit race-dependent policy or scope decisions.

---

## 18. Nested and Composite Use Cases

### DD-ENG-081 — Composition without authority collapse

A parent use case may invoke a subordinate approved use case or capability while retaining authority for the parent application's composite intent.

### DD-ENG-082 — Parent/child correlation

Nested execution shall preserve parent/child correlation so diagnostics, effects and outcomes can be attributed without flattening all work into one opaque result.

### DD-ENG-083 — Sub-use-case outcome interpretation

A child outcome is evidence to the parent. The parent shall interpret it according to the composite use case rather than blindly copying its status.

### DD-ENG-084 — No recursive public invocation requirement

Internal composition does not require a domain orchestrator to re-enter AppManager through a public/transport invocation surface. It may use the appropriate internal use-case/capability contract.

### DD-ENG-085 — Independent authorization remains possible

A nested operation with materially different authorization requirements may require its own authorization decision rather than inheriting parent approval automatically.

---

## 19. Headless and Interaction-Mode Equivalence

### DD-ENG-086 — Shared Engine semantics

TUI, Headless, GUI, IDE, CI, automation and future supported adapters shall converge on the same Engine/use-case semantics after normalization.

### DD-ENG-087 — Headless determinism

Headless execution shall not depend on hidden prompt order, presentation state or interactive-only defaults.

### DD-ENG-088 — Interaction capability declaration

Adapters may declare whether they can obtain interactive input, authorization or present progress. The Engine shall use those capabilities only as acquisition/projection mechanisms, not as semantic authority.

### DD-ENG-089 — Interaction-required outcome

If a use case genuinely requires information or authorization unavailable in the current interaction mode and no permitted non-interactive source exists, the operation shall fail/reject deterministically rather than block unexpectedly.

---

## 20. Dependency Direction

The intended dependency direction is:

```text
interaction adapters
        |
        v
DD-1.1 invocation contract
        |
        v
Application Engine / domain use-case semantics
        |
        +--> DD-1.4 bootstrap configuration (when required)
        +--> DD-1.3 managed project
        +--> DD-1.4 project/scope-aware configuration
        +--> DD-1.3 managed scope / targetability
        +--> DD-2 shared capabilities
        |
        v
DD-1.2 normalized evidence/outcomes
```

The representation is conceptual. DD-1.3 and DD-1.4 collaborate through the staged bootstrap contract rather than forming unrestricted circular authority; DD-1 contracts may mutually reference shared types/responsibilities without requiring cyclic implementation modules.

### DD-ENG-090 — No upward presentation dependency

Application/domain/capability logic shall not depend on TUI/GUI/IDE presentation implementations.

### DD-ENG-091 — No provider-to-domain inversion

Provider implementations shall conform to capability contracts; domains shall not be shaped around provider SDK object models.

### DD-ENG-092 — No raw resource authority

Filesystem, repository, process, environment, AI and framework access mechanisms shall not bypass managed scope, configuration or application policy merely because they can technically perform an action.

### DD-ENG-093 — Contract-oriented replaceability

Responsibility seams shall be sufficiently explicit that a capability implementation, interaction adapter or future primary runtime can be replaced without redefining AppManager command semantics.

This supports ADR-0001 without requiring speculative language-neutral serialization for in-process Version 1 contracts.

---

## 21. Extensibility

### DD-ENG-094 — New command/use case

A new command must define a canonical identity, owning domain/use case, context prerequisites, availability conditions, scope semantics, configuration concerns, authorization/policy requirements, capability dependencies and acceptance/outcome rules.

### DD-ENG-095 — New capability implementation

A new capability provider may be substituted behind an approved capability boundary when it preserves the AppManager-oriented contract and does not redefine application semantics.

### DD-ENG-096 — Declarative resources

Templates, licences, profiles and other declarative resources may extend supported behavior through their owning registry/resource contracts without becoming arbitrary executable plugins.

### DD-ENG-097 — No executable plugin framework implied

This design does not establish a general arbitrary executable plugin framework. Such a framework would require deliberate trust, permissions, lifecycle, compatibility, isolation, security and failure design and may require an ADR.

### DD-ENG-098 — New application surface

A new interaction/integration surface shall implement the shared invocation and outcome contracts rather than duplicate domain workflows.

---

## 22. Failure and Internal Invariants

### DD-ENG-099 — Expected rejection is structured

Unknown/unavailable commands, invalid invocation, unresolved project/configuration, authorization failure, scope conflict and expected capability failures shall use structured diagnostics/outcomes rather than depend solely on thrown implementation exceptions.

### DD-ENG-100 — Internal invariant failure

Violation of an Engine invariant shall fail safely, preserve known effects/evidence where possible and produce an internal diagnostic without exposing sensitive implementation detail.

### DD-ENG-101 — No silent semantic fallback

The Engine shall not silently reinterpret an invocation as another command, broaden scope, weaken safety, invent configuration or substitute an unauthorized provider merely to complete execution.

### DD-ENG-102 — Sensitive minimization

Execution context, diagnostics, events and outcomes shall carry the minimum sensitive information required. Capability/provider secrets shall not be propagated merely for convenience.

---

## 23. Application Engine Conformance Invariants

Every implementation conforming to this Detailed Design shall preserve all of the following:

1. the Application Engine remains the application-authority boundary;
2. command identity is canonical and presentation-independent;
3. every executable command has one semantic owner;
4. interaction adapters do not implement independent workflows;
5. domain orchestrators remain subordinate to shared Engine semantics;
6. scanners and recognizers produce evidence, not mutation authority;
7. resolvers answer bounded concerns, not unrelated application policy;
8. strategies propose technical realization, not application authorization;
9. capabilities execute bounded responsibilities and return normalized evidence;
10. provider success is not automatically application success;
11. managed-project discovery does not grant targetability or mutation authority;
12. configuration is staged where project identity and project/scope-aware configuration depend on one another: bootstrap-effective configuration may inform DD-1.3 resolution, while the operation-effective snapshot follows sufficient managed-project context and precedes any scope/policy decisions that depend on it;
13. effective configuration is consumed through DD-1.4 rather than ad hoc source reads;
14. authorization is explicit and re-evaluated after material plan/scope/configuration change;
15. preview/proposed effects remain distinct from applied effects;
16. cancellation does not imply rollback;
17. retryability evidence does not grant retry authority;
18. known effects survive failure, partial success and cancellation reporting;
19. final status is determined through application acceptance;
20. interaction modes converge on equivalent semantics;
21. the Engine boundary does not require one monolithic class/process/package/runtime.

---

## 24. Relationship to the DD-2 Capability Designs

The DD-2 family shall refine bounded execution responsibilities beneath this Engine design.

### 24.1 Resource Access

Defines safe, scoped resource inspection/mutation mechanisms and evidence without deciding application scope.

### 24.2 Process Execution

Defines process/tool execution, termination, output/evidence normalization and cancellation mechanics without deciding application success.

### 24.3 Repository Capability

Defines repository inspection and Git execution semantics behind AppManager-oriented boundaries without owning whole AppManager workflows or CI/CD.

### 24.4 Source Intelligence

Defines scanners, recognizers, parsers and analyzers that produce structural facts/findings. Recognition remains non-authoritative for mutation.

### 24.5 Source Transformation

Defines strategy selection, transformation plans, bounded transformations and source-level validation. Engine/domain policy still authorizes application.

### 24.6 AI Capability

Defines provider-neutral AI request/response/evidence contracts. AI provider output remains evidence unless AI itself is the primary approved use case.

### 24.7 Documentation, Quality and Nuxt Capabilities

Define specialist technical mechanisms while their consuming use cases retain application-level orchestration and acceptance.

### 24.8 Resource Registry and Template Capability

Defines declarative resource selection/resolution and generation support without creating a general executable plugin authority.

---

## 25. Relationship to Domain Detailed Designs

DD-3 and DD-4 domain specifications shall answer how each approved domain use case composes the Application Core and shared capabilities.

They shall define:

- domain use-case orchestration;
- domain-specific validation/policy;
- domain-specific acceptance criteria;
- capability dependencies;
- domain result payloads;
- domain-specific partial-success rules;
- domain-specific recovery/continuation semantics.

They shall not redefine:

- canonical invocation;
- shared outcome/diagnostic semantics;
- managed-project authority;
- configuration precedence;
- generic process/resource/provider mechanics;
- another domain's specialist semantics.

The `utils` domain shall be designed last so that genuinely cross-cutting maintenance behavior is retained without becoming a residual bypass around stronger owners.

---

## 26. Traceability

This Detailed Design directly realizes the cross-cutting Engine obligations established throughout the Version 1 Functional Specifications and root Design Specification rather than mapping to a single Functional domain.

Primary Functional relationships include:

- `FR-INV-*` — command identity, invocation validation, availability, interaction-mode equivalence, authorization, preview, cancellation, outcomes, delegated interpretation, retry and isolation;
- `FR-PROJ-*` — managed-project interpretation, operation-specific scope and mutation-authority boundaries;
- `FR-CONFIG-*` — governed effective configuration and Application Engine authority over consumption;
- `FR-XFORM-*` — separation of recognition, strategy/planning, transformation, validation and application acceptance;
- all domain `FR-*` families — use-case ownership, domain orchestration and application-level acceptance.

It also implements Detailed Design guardrails from `functional-specification-conformance-audit-v01.md`:

- DDG-001 — no cross-cutting semantic reimplementation per domain;
- DDG-002 — preserve Application Engine authority;
- DDG-003 — separate orchestration from specialist execution;
- DDG-004 — consume shared normalized result contracts;
- DDG-005 — AI remains a capability unless AI is the primary use case;
- DDG-006 — compatibility surfaces remain thin;
- DDG-007 — preserve future runtime replaceability.

ADR-0001 permits Version 1 implementation in Node.js/TypeScript but does not make TypeScript module topology part of this architectural authority boundary.

---

## 27. Downstream Detailed Design Requirements

All later Detailed Designs shall state explicitly:

1. which Engine/use-case authority invokes the responsibility;
2. what bounded request/context it receives;
3. what authority it does and does not possess;
4. what normalized evidence/result it returns;
5. how cancellation is propagated/observed where relevant;
6. how scope and configuration constraints are preserved;
7. how sensitive information is minimized;
8. how provider-specific mechanics are prevented from escaping the capability boundary;
9. what stale/concurrent conditions require revalidation;
10. how the Engine can interpret completion without relying on provider-native success semantics.

A later design that cannot answer these questions is not yet sufficiently separated from application authority.

---

## 28. Implementation-Specification Boundary

Implementation Specifications may map this design to concrete Version 1 constructs such as:

- TypeScript types/interfaces/classes;
- command registry implementation;
- dependency injection/composition root;
- concrete use-case handlers;
- module/package boundaries;
- async/cancellation primitives;
- concurrency/locking mechanisms;
- event delivery implementation;
- error/result classes;
- concrete capability-provider wiring;
- tests and conformance fixtures;
- migration from current command/service topology.

Those choices must implement this Detailed Design rather than retroactively redefining it.

---

## 29. Conformance Criteria

The Application Core Detailed Design family is conformant only if an implementation can demonstrate that:

- semantic invocation reaches one shared application-authority model;
- project, scope and configuration are resolved through their governed contracts, including the staged bootstrap contract where project resolution and configuration applicability depend on one another;
- domain use cases coordinate capabilities without allowing capabilities to acquire application policy;
- scanners/resolvers/strategies/providers have bounded, explicit roles;
- consequential execution is preceded by required scope/policy/authorization decisions;
- provider/capability results are normalized before application interpretation;
- final outcomes reflect application acceptance and known effects;
- cancellation, partial completion, retry and fallback remain explicit rather than implicit mechanism behavior;
- TUI, Headless and future adapters can use the same use-case semantics;
- no architectural rule requires the Application Engine to be one monolithic TypeScript object or one permanent runtime topology.

The closing rule is:

> **The Application Engine owns what AppManager means and whether its intent was satisfied; specialist components own only the bounded work deliberately delegated to them.**
