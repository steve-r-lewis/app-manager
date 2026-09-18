# DD-1.5 — AppManager Application Engine Detailed Design

> **Detailed Design ID:** DD-1.5
>
> **Design family:** DD-1 — Application Core

> **Status:** Version 1 Detailed Design Specification
>
> **Detailed Design authority:** This document defines the permanent internal responsibility and authority model by which AppManager dispatches and coordinates application use cases while preserving one coherent source of application semantics.
>
> **Sources and navigation:** [Project Documentation Guide](../project-documentation-guide-v01.md), [AppManager Design Specification](../appmanager-design-specification-v01.md), Version 1 Functional Specifications, [ADR-0001 — Primary Application Runtime](../project_management/decisions/adr-0001-primary-application-runtime.md)
>
> **Related Detailed Designs:** [DD-1.1 — Application Invocation](dd-1-1-application-invocation-detailed-design-v01.md), [DD-1.2 — Execution Outcomes](dd-1-2-execution-outcomes-detailed-design-v01.md), [DD-1.3 — Managed Project](dd-1-3-managed-project-detailed-design-v01.md), [DD-1.4 — Configuration Resolution](dd-1-4-configuration-resolution-detailed-design-v01.md), [Application Core Bootstrap Resolution](dd-1-5-application-engine-detailed-design-v01.md#_8-orchestration-lifecycle)
>
> **Planning source:** [Detailed Design Register](../project_management/detailed-design-register-v01.md)

## 1. Purpose

The Application Engine connects invocation, project resolution, effective configuration and domain execution under [Design §6.2](../appmanager-design-specification-v01.md#_6-2-application-engine-authority). This design describes its registration, execution context, dependency checkpoints and acceptance flow. Its internal seams support bounded delegation under [Design §6.6](../appmanager-design-specification-v01.md#_6-6-capability-boundaries-and-providers); their concrete runtime arrangement belongs to implementation design.

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

Where managed-project resolution depends upon configuration, the staged dependency semantics are governed by [Application Core Bootstrap Resolution](dd-1-5-application-engine-detailed-design-v01.md#_8-orchestration-lifecycle). The diagram describes responsibility and authority direction, not mandatory call-stack or process topology.

### 4.1 Authority direction

The diagram follows [Design §6.2](../appmanager-design-specification-v01.md#_6-2-application-engine-authority): invocation supplies intent, delegation supplies bounded work and returned evidence supports acceptance. Technical rejection by a delegate follows [DD-ENG-048](#dd-eng-048).

### 4.2 No presentation authority

Adapters connect to this flow through [DD-1.1](dd-1-1-application-invocation-detailed-design-v01.md), applying [Design §4.6](../appmanager-design-specification-v01.md#_4-6-presentation-independence) to input acquisition and outcome projection.

### 4.3 No provider authority

Provider evidence enters application acceptance through [Design §11.11](../appmanager-design-specification-v01.md#_11-11-workflow-results-failure-and-acceptance) and the [DD-1.2 normalization boundary](dd-1-2-execution-outcomes-detailed-design-v01.md#_18-provider-result-normalization).

## 5. Responsibility Decomposition

The Application Engine is decomposed into logical responsibilities. These are not requirements for one implementation object per responsibility.

<a id="dd-eng-001"></a>

### DD-ENG-001 — Command/use-case catalogue integration

The Engine shall consume the canonical command catalogue defined by the Application Invocation Detailed Design and associate each executable command identity with exactly one owning application use-case definition.


<a id="dd-eng-002"></a>

### DD-ENG-002 — Dispatcher

Dispatch consumes [DD-1.1](dd-1-1-application-invocation-detailed-design-v01.md#_10-invocation-normalization) and [FR-INV-003](../functional/application-invocation-functional-specification-v01.md#fr-inv-003) to select the owner registered under [DD-ENG-001](#dd-eng-001).

<a id="dd-eng-003"></a>

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

<a id="dd-eng-004"></a>

### DD-ENG-004 — Policy and safety evaluator

Application policy and safety constraints shall be evaluated at defined semantic checkpoints before consequential effects and re-evaluated when a material change invalidates prior assumptions.

<a id="dd-eng-005"></a>

### DD-ENG-005 — Use-case orchestrator responsibility

Each application use case shall own its permanent workflow semantics: prerequisite order, capability coordination, application decisions, conditional branches, acceptance criteria and recovery/continuation rules.

The responsibility may be implemented by one or more collaborators but remains subordinate to the Application Engine authority model.

<a id="dd-eng-006"></a>

### DD-ENG-006 — Capability broker responsibility

Capability access binds [Design](../appmanager-design-specification-v01.md#_6-6-capability-boundaries-and-providers) to approved specialist contracts. Command exposure follows [DD-1.1](dd-1-1-application-invocation-detailed-design-v01.md#_9-4-no-executable-provider-discovery-leakage).

<a id="dd-eng-007"></a>

### DD-ENG-007 — Result interpreter

The result interpreter applies [Design](../appmanager-design-specification-v01.md#_11-11-workflow-results-failure-and-acceptance) to the normalized evidence model in [DD-1.2](dd-1-2-execution-outcomes-detailed-design-v01.md#_8-execution-evidence-contract).

<a id="dd-eng-008"></a>

### DD-ENG-008 — Outcome publisher

Publication uses [DD-1.2](dd-1-2-execution-outcomes-detailed-design-v01.md#_7-outcome-contract) and [DD-1.1](dd-1-1-application-invocation-detailed-design-v01.md#dd-outclar-002).

<a id="dd-eng-009"></a>

### DD-ENG-009 — Cancellation coordinator

Engine cancellation consumes [DD-1.1](dd-1-1-application-invocation-detailed-design-v01.md#_20-cancellation-contract) and [DD-1.2](dd-1-2-execution-outcomes-detailed-design-v01.md#_17-cancellation-model) through the workflow checkpoints in §15.

<a id="dd-eng-010"></a>

### DD-ENG-010 — Application concurrency coordinator

Application conflict coordination follows [FR-INV-051](../functional/application-invocation-functional-specification-v01.md#fr-inv-051) through the evidence and isolation contracts in §17; no universal lock is required.


---

## 6. Command and Use-Case Ownership

<a id="dd-eng-011"></a>

### DD-ENG-011 — Canonical command identity

Dispatch receives the canonical identity through [DD-1.1](dd-1-1-application-invocation-detailed-design-v01.md#_10-invocation-normalization).

<a id="dd-eng-012"></a>

### DD-ENG-012 — Single semantic owner

Semantic ownership is registered under [DD-ENG-001](#dd-eng-001); the owner supplies the workflow/acceptance responsibilities in [DD-ENG-005](#dd-eng-005).

<a id="dd-eng-013"></a>

### DD-ENG-013 — Domain grouping is not execution authority

The eight domain groupings bind [Design](../appmanager-design-specification-v01.md#_10-1-functional-domain-model). Their grouping does not require an autonomous engine, service, process or provider topology.

<a id="dd-eng-014"></a>

### DD-ENG-014 — Commands are not provider methods

Provider operation exposure follows [DD-1.1](dd-1-1-application-invocation-detailed-design-v01.md#_9-4-no-executable-provider-discovery-leakage).

<a id="dd-eng-015"></a>

### DD-ENG-015 — Compatibility aliases

Legacy or compatibility command surfaces may map to a canonical use case, but shall remain thin and shall not preserve an independent workflow implementation.

<a id="dd-eng-016"></a>

### DD-ENG-016 — Unknown and unavailable remain distinct

Lookup/availability interpretation follows [FR-INV-006](../functional/application-invocation-functional-specification-v01.md#fr-inv-006) and [FR-INV-015](../functional/application-invocation-functional-specification-v01.md#fr-inv-015) through [DD-1.1](dd-1-1-application-invocation-detailed-design-v01.md#_8-5-unknown-versus-unavailable).


---

## 7. Execution Context

<a id="dd-eng-017"></a>

### DD-ENG-017 — Invocation-scoped context

The execution context applies [FR-INV-050](../functional/application-invocation-functional-specification-v01.md#fr-inv-050) and [DD-1.1](dd-1-1-application-invocation-detailed-design-v01.md#_27-1-invocation-independence).

<a id="dd-eng-018"></a>

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

<a id="dd-eng-019"></a>

### DD-ENG-019 — Managed-project dependency

Project prerequisites use [DD-1.3 required context](dd-1-3-managed-project-detailed-design-v01.md#_11-operation-specific-context-completeness); configuration contributions enter through [DD-1.4](dd-1-4-configuration-resolution-detailed-design-v01.md#_8-resolution-context).

<a id="dd-eng-020"></a>

### DD-ENG-020 — Managed-scope dependency

Consequential target selection uses [DD-1.3 scope](dd-1-3-managed-project-detailed-design-v01.md#_18-managed-scope-resolution) and [targetability](dd-1-3-managed-project-detailed-design-v01.md#_20-targetability-evaluation). Configuration-dependent scope finalization follows [DD-CORE-BOOT-009](#dd-core-boot-009).

<a id="dd-eng-021"></a>

### DD-ENG-021 — Configuration dependency

Engine configuration consumption applies [FR-CONFIG-020](../functional/configuration-functional-specification-v01.md#fr-config-020), using [DD-1.4](dd-1-4-configuration-resolution-detailed-design-v01.md#dd-core-boot-005) for stage-complete snapshots.

<a id="dd-eng-022"></a>

### DD-ENG-022 — Configuration snapshot stability

Execution uses [DD-1.4](dd-1-4-configuration-resolution-detailed-design-v01.md#_16-effective-configuration-snapshot) and its [dynamic re-resolution contract](dd-1-4-configuration-resolution-detailed-design-v01.md#_27-4-dynamic-re-resolution). Changed bootstrap assumptions are handled by [DD-CORE-BOOT-006](#dd-core-boot-006).

<a id="dd-eng-023"></a>

### DD-ENG-023 — Context completeness

Context demand follows [FR-PROJ-014](../functional/managed-project-functional-specification-v01.md#fr-proj-014) through DD-1.3.

<a id="dd-eng-024"></a>

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

### DD-CORE-BOOT-006 — Re-evaluate changed assumptions {#dd-core-boot-006}

Later configuration/project resolution applies [DD-ENG-024](#dd-eng-024) and [DD-ENG-027](#dd-eng-027) to dependent decisions, including material provider-selection changes. Preserve bootstrap provenance so the changed assumption can be identified. No consequential execution begins while a material bootstrap/project conflict remains unresolved.

### DD-CORE-BOOT-007 — Bounded resolution {#dd-core-boot-007}

Where scope determines concern applicability, the Engine may stage configuration and scope refinement explicitly. It shall not permit unrestricted recursive resolution. The owning use case chooses an explicit response to later conflicting context: retain a non-conflicting selection, perform bounded safe re-resolution at a checkpoint, obtain disambiguation or fail with structured diagnostics. A bounded re-resolution policy may permit one retry; this example does not impose a universal pass count.

### DD-CORE-BOOT-008 — Candidate acquisition across modes {#dd-core-boot-008}

Bootstrap candidate acquisition applies [Design §8.4](../appmanager-design-specification-v01.md#_8-4-separation-of-resolution-and-interaction) across the interaction modes. Missing bootstrap inputs or disambiguation in Headless follow [FR-INV-020](../functional/application-invocation-functional-specification-v01.md#fr-inv-020) and the resolution stage’s eligibility contract.

### DD-CORE-BOOT-009 — Scope checkpoint {#dd-core-boot-009}

Finalize managed scope only after the operation-effective values required by its scope/exclusion decision are available. Scope is not a universal predecessor of project-aware configuration. DD-1.3 makes the scope decision and DD-1.4 constructs the values it consumes; the Engine coordinates their dependency checkpoints.

The lifecycle specifies semantic dependencies, not a class graph, process topology or number of resolver instances. Irrelevant configuration stages can be omitted. Bootstrap eligibility belongs to [DD-1.4 §8](dd-1-4-configuration-resolution-detailed-design-v01.md#_8-resolution-context), and project conflict reporting to [DD-1.3 §29](dd-1-3-managed-project-detailed-design-v01.md#_29-relationship-to-configuration-resolution).

<a id="dd-eng-025"></a>

### DD-ENG-025 — Effects require prerequisite satisfaction

Each consequential stage applies [FR-INV-011](../functional/application-invocation-functional-specification-v01.md#fr-inv-011) to its dependent prerequisites.

<a id="dd-eng-026"></a>

### DD-ENG-026 — Stage-specific validation

Stage-sensitive validation consumes [DD-1.1](dd-1-1-application-invocation-detailed-design-v01.md#_12-shared-validation-coordination).

<a id="dd-eng-027"></a>

### DD-ENG-027 — Material plan change

If execution planning materially changes target, scope, destructive character, required capability or consequential effects, affected policy and authorization decisions shall be re-evaluated before execution.

<a id="dd-eng-028"></a>

### DD-ENG-028 — Evidence accumulation

The execution context accumulates [DD-1.2](dd-1-2-execution-outcomes-detailed-design-v01.md#_8-execution-evidence-contract), [effects](dd-1-2-execution-outcomes-detailed-design-v01.md#_12-consequential-effects) and [child results](dd-1-2-execution-outcomes-detailed-design-v01.md#_14-partial-completion) for acceptance/recovery interpretation.

<a id="dd-eng-029"></a>

### DD-ENG-029 — No success by reaching end of handler

Handler completion is interpreted under [FR-INV-034](../functional/application-invocation-functional-specification-v01.md#fr-inv-034); the absence of an exception is technical evidence.


---

## 9. Domain Orchestration Model

Later domain Detailed Designs shall define domain-specific use-case orchestration beneath this Engine contract.

<a id="dd-eng-030"></a>

### DD-ENG-030 — Domain orchestration responsibility

Domain orchestration follows [Design](../appmanager-design-specification-v01.md#_10-11-cross-domain-workflows). An App lifecycle composition, for example, can consume project/configuration, process, Quality and Git contracts through their owning collaborators.

<a id="dd-eng-031"></a>

### DD-ENG-031 — Shared semantics not duplicated

Domain-local inputs/results compose the shared [invocation](dd-1-1-application-invocation-detailed-design-v01.md), [outcome](dd-1-2-execution-outcomes-detailed-design-v01.md), [project](dd-1-3-managed-project-detailed-design-v01.md) and [configuration](dd-1-4-configuration-resolution-detailed-design-v01.md) contracts under [Design](../appmanager-design-specification-v01.md#_6-2-application-engine-authority).

<a id="dd-eng-032"></a>

### DD-ENG-032 — Cross-domain composition

Cross-domain composition follows [Design](../appmanager-design-specification-v01.md#_10-11-cross-domain-workflows). For example, App creation coordinates root-application intent with Nuxt provisioning and requested Git initialization; each contribution retains its owning contract.

<a id="dd-eng-033"></a>

### DD-ENG-033 — No circular authority

A subordinate capability or nested use case shall not call upward into presentation or redefine the parent use case's final acceptance policy.

---

## 10. Capability Delegation

<a id="dd-eng-034"></a>

### DD-ENG-034 — AppManager-oriented capability contracts

Engine-facing capability interfaces follow [Design](../appmanager-design-specification-v01.md#_6-6-capability-boundaries-and-providers).

<a id="dd-eng-035"></a>

### DD-ENG-035 — Delegation request

A delegation request shall carry only the context, target, configuration and policy-derived constraints needed by the capability.

<a id="dd-eng-036"></a>

### DD-ENG-036 — Least semantic authority

Bounded delegation applies [Design](../appmanager-design-specification-v01.md#_6-6-capability-boundaries-and-providers) and [Design](../appmanager-design-specification-v01.md#_9-9-non-destructive-ownership-and-unmanaged-content) to the request in [DD-ENG-035](#dd-eng-035).

<a id="dd-eng-037"></a>

### DD-ENG-037 — Capability evidence

Capability results supply [DD-1.2](dd-1-2-execution-outcomes-detailed-design-v01.md#_8-execution-evidence-contract) through their local finding/plan/effect/payload models.

<a id="dd-eng-038"></a>

### DD-ENG-038 — Provider normalization

Provider-native exceptions, exits, SDK objects and responses use [DD-1.2](dd-1-2-execution-outcomes-detailed-design-v01.md#_18-provider-result-normalization).

<a id="dd-eng-039"></a>

### DD-ENG-039 — Provider fallback

Provider fallback is permitted only where the owning capability/use case semantics allow it and the fallback does not silently change application intent, scope, safety or acceptance criteria.

<a id="dd-eng-040"></a>

### DD-ENG-040 — Capability unavailability

Capability unavailability shall be represented explicitly and interpreted by the owning use case; it shall not automatically imply either command failure or fallback.

---

## 11. Scanners, Recognizers, Resolvers, Strategies and Responders

This section fixes their position in the architecture without prematurely prescribing concrete implementations.

<a id="dd-eng-041"></a>

### DD-ENG-041 — Scanners and recognizers

Scanners/recognizers bind [Design](../appmanager-design-specification-v01.md#_7-4-scanners) and [Design](../appmanager-design-specification-v01.md#_7-9-inspection-and-mutation-separation) to evidence production.

<a id="dd-eng-042"></a>

### DD-ENG-042 — Resolvers

Project/configuration/provider/strategy resolvers apply [Design](../appmanager-design-specification-v01.md#_6-7-resolvers) through their bounded owning contracts.

<a id="dd-eng-043"></a>

### DD-ENG-043 — Strategies

Strategy participation follows [Design](../appmanager-design-specification-v01.md#_7-5-strategies-and-transformation-plans). The source flow is refined by [DD-2.5](../dd_2_shared_capabilities/dd-2-5-source-transformation-detailed-design-v01.md), from recognized facts through plan, authorization, source validation and application acceptance.

<a id="dd-eng-044"></a>

### DD-ENG-044 — Responders and normalizers

Provider normalization uses [DD-1.2](dd-1-2-execution-outcomes-detailed-design-v01.md#_18-provider-result-normalization); caller projection uses [DD-1.1](dd-1-1-application-invocation-detailed-design-v01.md#dd-outclar-002). Use the precise responsibility name in normative DD text instead of the generic term `Responder` where one is available.

<a id="dd-eng-045"></a>

### DD-ENG-045 — Orchestrators

Orchestrators fulfill the assigned sequencing responsibility in [DD-ENG-005](#dd-eng-005) under [Design](../appmanager-design-specification-v01.md#_6-2-application-engine-authority).

<a id="dd-eng-046"></a>

### DD-ENG-046 — No universal pattern framework

The existence of these responsibility patterns does not mandate generic Scanner, Resolver, Strategy, Responder or Orchestrator frameworks. Shared abstractions require demonstrated common semantics, not naming similarity.

---

## 12. Policy and Safety

<a id="dd-eng-047"></a>

### DD-ENG-047 — Policy evaluation belongs above mechanism

The policy checkpoint in [DD-ENG-004](#dd-eng-004) precedes consequential delegation when application intent, scope, safety or authorization determines eligibility.

<a id="dd-eng-048"></a>

### DD-ENG-048 — Capability-local safety

A capability may enforce stricter technical invariants within its own contract, such as rejecting malformed targets or unsafe technical operations. Such rejection supplements rather than replaces application policy.

<a id="dd-eng-049"></a>

### DD-ENG-049 — Non-destructive constraints

Bounded/non-destructive use cases bind [Design](../appmanager-design-specification-v01.md#_9-9-non-destructive-ownership-and-unmanaged-content) to the constraints supplied in [DD-ENG-035](#dd-eng-035).

<a id="dd-eng-050"></a>

### DD-ENG-050 — Authorization evidence

Authorization acquisition and sufficiency use [DD-1.1](dd-1-1-application-invocation-detailed-design-v01.md#_14-confirmation-and-authorization-evidence).

<a id="dd-eng-051"></a>

### DD-ENG-051 — No inferred authorization

Headless mode, automation, provider configuration, environment variables, filesystem permissions or successful authentication shall not be treated as implicit authorization for an application operation unless the owning semantics explicitly define them as valid evidence.

<a id="dd-eng-052"></a>

### DD-ENG-052 — Authorization invalidation

Changed authorization assumptions use [DD-ENG-027](#dd-eng-027) and [DD-1.1](dd-1-1-application-invocation-detailed-design-v01.md#_14-3-binding-and-stale-authorization).


---

## 13. Preview and Planning

<a id="dd-eng-053"></a>

### DD-ENG-053 — Preview is a use-case semantic

Preview intent and owning-use-case interpretation consume [DD-1.1](dd-1-1-application-invocation-detailed-design-v01.md#_15-preview-and-dry-run-intent).

<a id="dd-eng-054"></a>

### DD-ENG-054 — Proposed versus applied effects

Planning results use [DD-1.2](dd-1-2-execution-outcomes-detailed-design-v01.md#_13-proposed-effects-and-preview).

<a id="dd-eng-055"></a>

### DD-ENG-055 — Planning does not authorize execution

Plan availability is evaluated through [DD-1.1](dd-1-1-application-invocation-detailed-design-v01.md#_14-confirmation-and-authorization-evidence) before application; the proposal model is [DD-1.2](dd-1-2-execution-outcomes-detailed-design-v01.md#_13-proposed-effects-and-preview).

<a id="dd-eng-056"></a>

### DD-ENG-056 — Plan validation

Source, repository, configuration and external-state plans apply [DD-ENG-024](#dd-eng-024) sufficiently close to application to detect stale assumptions affecting the planned effects.


---

## 14. Application Acceptance and Outcomes

<a id="dd-eng-057"></a>

### DD-ENG-057 — Technical completion is evidence

Capability completion follows [Design](../appmanager-design-specification-v01.md#_11-11-workflow-results-failure-and-acceptance).

<a id="dd-eng-058"></a>

### DD-ENG-058 — Application acceptance

Acceptance follows [FR-INV-034](../functional/application-invocation-functional-specification-v01.md#fr-inv-034) for the owning use case.

<a id="dd-eng-059"></a>

### DD-ENG-059 — Final outcome ownership

Final publication uses [DD-1.2](dd-1-2-execution-outcomes-detailed-design-v01.md#_7-outcome-contract) and [payload composition](dd-1-2-execution-outcomes-detailed-design-v01.md#_7-2-result-payload).

<a id="dd-eng-060"></a>

### DD-ENG-060 — Partial success

Partial acceptance follows [FR-INV-036](../functional/application-invocation-functional-specification-v01.md#fr-inv-036) using [DD-1.2](dd-1-2-execution-outcomes-detailed-design-v01.md#_14-partial-completion).

<a id="dd-eng-061"></a>

### DD-ENG-061 — No-op and already satisfied

No-op/already-satisfied interpretation uses [DD-1.2](dd-1-2-execution-outcomes-detailed-design-v01.md#_15-no-op-already-satisfied-skipped-and-not-attempted-states).

<a id="dd-eng-062"></a>

### DD-ENG-062 — Failure preserves effects

Failure effects follow [FR-INV-045](../functional/application-invocation-functional-specification-v01.md#fr-inv-045).

<a id="dd-eng-063"></a>

### DD-ENG-063 — Presentation projection

Caller exit-code/UI/automation projections consume [DD-1.1](dd-1-1-application-invocation-detailed-design-v01.md#dd-outclar-002).


---

## 15. Cancellation

<a id="dd-eng-064"></a>

### DD-ENG-064 — Cooperative cancellation

Cancellation cooperation follows [DD-1.2](dd-1-2-execution-outcomes-detailed-design-v01.md#_17-2-cooperative-cancellation).

<a id="dd-eng-065"></a>

### DD-ENG-065 — Propagation

Cancellation propagates through [DD-1.1](dd-1-1-application-invocation-detailed-design-v01.md#_20-2-cooperative-design) and the phases in [DD-1.2](dd-1-2-execution-outcomes-detailed-design-v01.md#_17-cancellation-model).

<a id="dd-eng-066"></a>

### DD-ENG-066 — Cancellation request is not terminal state

A requested cancellation follows [DD-1.2](dd-1-2-execution-outcomes-detailed-design-v01.md#_17-2-cooperative-cancellation) until the workflow can establish the resulting state sufficiently for terminal publication.

<a id="dd-eng-067"></a>

### DD-ENG-067 — Cancellation does not imply rollback

Prior effects and rollback evidence follow [DD-1.2](dd-1-2-execution-outcomes-detailed-design-v01.md#_17-cancellation-model) and [verified rollback reporting](dd-1-2-execution-outcomes-detailed-design-v01.md#_12-4-no-false-rollback).

<a id="dd-eng-068"></a>

### DD-ENG-068 — Late cancellation

Completion races follow [DD-1.1](dd-1-1-application-invocation-detailed-design-v01.md#_20-4-late-cancellation).


---

## 16. Retry, Resume, Fallback and Compensation

<a id="dd-eng-069"></a>

### DD-ENG-069 — No generic application retry

Use-case retry policy follows [FR-INV-048](../functional/application-invocation-functional-specification-v01.md#fr-inv-048); there is no universal application retry policy.

<a id="dd-eng-070"></a>

### DD-ENG-070 — Provider-local retry

Bounded provider-local retry follows [FR-INV-049](../functional/application-invocation-functional-specification-v01.md#fr-inv-049) and the capability contract’s safety constraints.

<a id="dd-eng-071"></a>

### DD-ENG-071 — Use-case retry authority

Use-case retry/resume applies [FR-INV-048](../functional/application-invocation-functional-specification-v01.md#fr-inv-048) with the revalidation rule in [DD-ENG-024](#dd-eng-024).

<a id="dd-eng-072"></a>

### DD-ENG-072 — Retryability evidence

Retryability evidence is supplied by [DD-1.2](dd-1-2-execution-outcomes-detailed-design-v01.md#_22-retryability-and-repetition-evidence) under [FR-INV-049](../functional/application-invocation-functional-specification-v01.md#fr-inv-049).

<a id="dd-eng-073"></a>

### DD-ENG-073 — Compensation

Compensation uses [DD-1.2](dd-1-2-execution-outcomes-detailed-design-v01.md#_12-4-no-false-rollback) as a separately recorded action/stage.

<a id="dd-eng-074"></a>

### DD-ENG-074 — Fallback semantics

Fallback follows [DD-ENG-039](#dd-eng-039); material plan changes apply [DD-ENG-027](#dd-eng-027).


---

## 17. Concurrency, Staleness and Isolation

<a id="dd-eng-075"></a>

### DD-ENG-075 — Invocation isolation

Execution state, snapshots, cancellation and evidence bind [DD-1.1](dd-1-1-application-invocation-detailed-design-v01.md#_27-1-invocation-independence). A shared resource contract may explicitly define shared state without sharing invocation intent.

<a id="dd-eng-076"></a>

### DD-ENG-076 — Shared resource conflicts

Where multiple invocations can affect the same project resource, repository, configuration concern or generated artifact, the owning use case/capability shall expose sufficient conflict evidence for safe application coordination.

<a id="dd-eng-077"></a>

### DD-ENG-077 — Stale project context

Project-context use consumes [DD-1.3 freshness](dd-1-3-managed-project-detailed-design-v01.md#_25-context-freshness-and-stale-state-boundaries).

<a id="dd-eng-078"></a>

### DD-ENG-078 — Stale configuration

Configuration refresh consumes [DD-1.4](dd-1-4-configuration-resolution-detailed-design-v01.md#_27-4-dynamic-re-resolution); changed values/provenance are new inputs to [DD-CORE-BOOT-006](#dd-core-boot-006).

<a id="dd-eng-079"></a>

### DD-ENG-079 — No global serialization requirement

Concurrency consumes [DD-1.1](dd-1-1-application-invocation-detailed-design-v01.md#_27-3-no-global-serialization-requirement) with restrictions scoped to actual semantic/resource conflicts.

<a id="dd-eng-080"></a>

### DD-ENG-080 — Deterministic conflict outcome

Conflict interpretation applies [FR-INV-051](../functional/application-invocation-functional-specification-v01.md#fr-inv-051). Unresolvable conflicts fail or defer deterministically, rather than selecting policy/scope by race.


---

## 18. Nested and Composite Use Cases

<a id="dd-eng-081"></a>

### DD-ENG-081 — Composition without authority collapse

Parent composition follows [Design](../appmanager-design-specification-v01.md#_10-11-cross-domain-workflows) through the nested contracts below.

<a id="dd-eng-082"></a>

### DD-ENG-082 — Parent/child correlation

Parent/child attribution uses [DD-1.2](dd-1-2-execution-outcomes-detailed-design-v01.md#_25-4-nested-use-cases).

<a id="dd-eng-083"></a>

### DD-ENG-083 — Sub-use-case outcome interpretation

Child outcomes enter the parent’s [DD-1.2](dd-1-2-execution-outcomes-detailed-design-v01.md#_20-outcome-aggregation) with composite acceptance policy.

<a id="dd-eng-084"></a>

### DD-ENG-084 — No recursive public invocation requirement

Internal composition does not require a domain orchestrator to re-enter AppManager through a public/transport invocation surface. It may use the appropriate internal use-case/capability contract.

<a id="dd-eng-085"></a>

### DD-ENG-085 — Independent authorization remains possible

A nested operation with materially different authorization requirements may require its own authorization decision rather than inheriting parent approval automatically.

---

## 19. Headless and Interaction-Mode Equivalence

<a id="dd-eng-086"></a>

### DD-ENG-086 — Shared Engine semantics

Normalized adapter intent follows [Design](../appmanager-design-specification-v01.md#_4-6-presentation-independence).

<a id="dd-eng-087"></a>

### DD-ENG-087 — Headless determinism

Headless behavior applies [FR-INV-020](../functional/application-invocation-functional-specification-v01.md#fr-inv-020); presentation state does not supply ungoverned defaults.

<a id="dd-eng-088"></a>

### DD-ENG-088 — Interaction capability declaration

Caller acquisition/projection capabilities consume [DD-1.1](dd-1-1-application-invocation-detailed-design-v01.md#_11-interaction-capability-contract).

<a id="dd-eng-089"></a>

### DD-ENG-089 — Interaction-required outcome

Unavailable required acquisition follows [FR-INV-020](../functional/application-invocation-functional-specification-v01.md#fr-inv-020) and [FR-INV-022](../functional/application-invocation-functional-specification-v01.md#fr-inv-022).


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

<a id="dd-eng-090"></a>

### DD-ENG-090 — No upward presentation dependency

Presentation dependency direction follows [Design](../appmanager-design-specification-v01.md#_4-6-presentation-independence).

<a id="dd-eng-091"></a>

### DD-ENG-091 — No provider-to-domain inversion

Provider/domain interfaces follow [Design](../appmanager-design-specification-v01.md#_6-6-capability-boundaries-and-providers).

<a id="dd-eng-092"></a>

### DD-ENG-092 — No raw resource authority

Technical resource access follows [Design](../appmanager-design-specification-v01.md#_9-9-non-destructive-ownership-and-unmanaged-content) and [Design](../appmanager-design-specification-v01.md#_6-2-application-engine-authority).

<a id="dd-eng-093"></a>

### DD-ENG-093 — Contract-oriented replaceability

The responsibility seams bind [Design §6.6](../appmanager-design-specification-v01.md#_6-6-capability-boundaries-and-providers) and [§6.10](../appmanager-design-specification-v01.md#_6-10-modular-typescript-and-future-host-portability) to capability, adapter and future primary-runtime replacement. This supports ADR-0001 without requiring speculative language-neutral serialization for in-process Version 1 contracts.


---

## 21. Extensibility

<a id="dd-eng-094"></a>

### DD-ENG-094 — New command/use case

A new command must define a canonical identity, owning domain/use case, context prerequisites, availability conditions, scope semantics, configuration concerns, authorization/policy requirements, capability dependencies and acceptance/outcome rules.

<a id="dd-eng-095"></a>

### DD-ENG-095 — New capability implementation

Provider substitution follows [Design](../appmanager-design-specification-v01.md#_6-6-capability-boundaries-and-providers).

<a id="dd-eng-096"></a>

### DD-ENG-096 — Declarative resources

Templates/licences/profiles follow [Design](../appmanager-design-specification-v01.md#_13-2-extension-classes) through their registry/resource contracts.

<a id="dd-eng-097"></a>

### DD-ENG-097 — No executable plugin framework implied

This design does not establish a general arbitrary executable plugin framework. Such a framework would require deliberate trust, permissions, lifecycle, compatibility, isolation, security and failure design and may require an ADR.

<a id="dd-eng-098"></a>

### DD-ENG-098 — New application surface

New application surfaces consume [DD-1.1](dd-1-1-application-invocation-detailed-design-v01.md#_37-2-new-interaction-adapters) and [DD-1.1](dd-1-1-application-invocation-detailed-design-v01.md#dd-outclar-002).


---

## 22. Failure and Internal Invariants

<a id="dd-eng-099"></a>

### DD-ENG-099 — Expected rejection is structured

Expected rejections use [DD-1.2](dd-1-2-execution-outcomes-detailed-design-v01.md#_9-diagnostic-model) and [DD-1.1](dd-1-1-application-invocation-detailed-design-v01.md#_35-error-and-fault-boundary).

<a id="dd-eng-100"></a>

### DD-ENG-100 — Internal invariant failure

Violation of an Engine invariant shall fail safely, preserve known effects/evidence where possible and produce an internal diagnostic without exposing sensitive implementation detail.

<a id="dd-eng-101"></a>

### DD-ENG-101 — No silent semantic fallback

Fallback decisions remain subject to [FR-INV-006](../functional/application-invocation-functional-specification-v01.md#fr-inv-006), [FR-PROJ-042](../functional/managed-project-functional-specification-v01.md#fr-proj-042), [FR-CONFIG-029](../functional/configuration-functional-specification-v01.md#fr-config-029) and [DD-ENG-039](#dd-eng-039). Completion pressure supplies no safety exception.

<a id="dd-eng-102"></a>

### DD-ENG-102 — Sensitive minimization

Sensitive execution context and publication bind [Design](../appmanager-design-specification-v01.md#_8-7-sensitive-configuration) to [DD-1.2](dd-1-2-execution-outcomes-detailed-design-v01.md#_24-sensitive-information-and-redaction).


---

## 23. Application Engine Conformance Invariants

The Engine's conformance review uses the registration and context contracts in §§5–7, staged lifecycle in §8, delegation and policy contracts in §§9–12, and outcome, cancellation and concurrency contracts in §§13–17. The upstream authority is [Design §6.2](../appmanager-design-specification-v01.md#_6-2-application-engine-authority); the list of review areas introduces no second set of invariants.

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

[AI Capability](../dd_2_shared_capabilities/dd-2-7-ai-capability-detailed-design-v01.md) supplies provider-neutral request/response evidence. Both primary AI use cases and AI-assisted workflows apply [Design §10.6](../appmanager-design-specification-v01.md#_10-6-ai-domain) and [§11.10](../appmanager-design-specification-v01.md#_11-10-ai-assisted-workflow): the owning workflow interprets and accepts proposals.

### 24.7 Documentation, Quality and Nuxt Capabilities

Define specialist technical mechanisms while their consuming use cases retain application-level orchestration and acceptance.

### 24.8 Resource Registry and Template Capability

Defines declarative resource selection/resolution and generation support without creating a general executable plugin authority.

---

## 25. Relationship to Domain Detailed Designs

DD-3 and DD-4 describe the domain compositions invoked by [DD-ENG-005](#dd-eng-005). Their domain payloads and acceptance/recovery decisions fit the shared [execution context](#dd-eng-003) and [command extension contract](#dd-eng-094). The [Maintenance stronger-owner gate](../dd_4_policy_and_resource_domains/dd-4-4-utils-domain-detailed-design-v01.md#dd-util-066) is one such domain-specific decision, applied before maintenance planning.

## 26. Traceability

This Detailed Design directly realizes the cross-cutting Engine obligations established throughout the Version 1 Functional Specifications and root Design Specification rather than mapping to a single Functional domain.

Primary Functional relationships include:

- `FR-INV-*` — command identity, invocation validation, availability, interaction-mode equivalence, authorization, preview, cancellation, outcomes, delegated interpretation, retry and isolation;
- `FR-PROJ-*` — managed-project interpretation, operation-specific scope and mutation-authority boundaries;
- `FR-CONFIG-*` — governed effective configuration and Application Engine authority over consumption;
- `FR-XFORM-*` — separation of recognition, strategy/planning, transformation, validation and application acceptance;
- all domain `FR-*` families — use-case ownership, domain orchestration and application-level acceptance.

The earlier `functional-specification-conformance-audit-v01.md` is historical review evidence, not a source of product authority. The governing contracts are the Design and Functional sources above.

ADR-0001 permits Version 1 implementation in Node.js/TypeScript but does not make TypeScript module topology part of this architectural authority boundary.

---

## 27. Downstream Detailed Design Requirements

A consuming Detailed Design can be read against the [execution context](#dd-eng-003), [use-case workflow](#dd-eng-005), [bounded delegation](#dd-eng-035), [stale-state checkpoint](#dd-eng-024) and [extension contract](#dd-eng-094). These references identify the integration questions for its request, evidence, cancellation, scope, sensitivity and acceptance design. The [documentation reading conventions](../project-documentation-guide-v01.md#detailed-design-reading-conventions) govern the relationship between sibling designs.

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

Conformance is assessed against the contracts indexed in [§23](#_23-application-engine-conformance-invariants), including the project/configuration dependency lifecycle and the owning use case's acceptance criteria. [§28](#_28-implementation-specification-boundary) identifies the concrete choices left to Implementation Specifications.
