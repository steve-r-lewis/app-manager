# DD-1.1 — AppManager Application Invocation Detailed Design

> **Detailed Design ID:** DD-1.1
>
> **Design family:** DD-1 — Application Core

> **Status:** Version 1 Detailed Design Specification
>
> **Detailed Design authority:** This document defines the permanent internal design by which AppManager realises the shared Application Invocation Functional Specification. It refines, but does not override, the root Design Specification or Functional Specifications.
>
> **Governing sources:** [Project Documentation Guide](../project-documentation-guide-v01.md), [AppManager Design Specification](../appmanager-design-specification-v01.md), [docs/functional/application-invocation-functional-specification-v01.md](../functional/application-invocation-functional-specification-v01.md)
>
> **Planning source:** [Detailed Design Register](../project_management/detailed-design-register-v01.md)
>
> **Related Functional authorities:** [docs/functional/managed-project-functional-specification-v01.md](../functional/managed-project-functional-specification-v01.md), [docs/functional/configuration-functional-specification-v01.md](../functional/configuration-functional-specification-v01.md), [docs/functional/source-transformation-functional-specification-v01.md](../functional/source-transformation-functional-specification-v01.md)
>
> **Related Detailed Designs:** [DD-1.2 — Execution Outcomes](dd-1-2-execution-outcomes-detailed-design-v01.md), [Application Outcome and Diagnostic Ownership](dd-1-2-execution-outcomes-detailed-design-v01.md#_7-outcome-contract)

## 1. Purpose

The invocation boundary turns caller intent into a normalized request, carries interaction and authorization evidence, coordinates entry to the Application Engine, and delivers its accepted result. Its request, catalogue, control-channel and projection contracts let adapters collaborate with the same application model under [Design](../appmanager-design-specification-v01.md#_4-6-presentation-independence).

The local lifecycle connects caller choices to context-dependent validation and execution. [DD-1.2](dd-1-2-execution-outcomes-detailed-design-v01.md#_7-outcome-contract) supplies outcome meanings; the projection in §22 preserves them for the caller. The workflow and responsibility map below explain where each hand-off occurs.

## 2. Scope

This design owns permanent internal contracts for:

- structured invocation requests;
- command identity and command discovery metadata;
- invocation-context normalization;
- caller and interaction capability description;
- command lookup and availability evaluation;
- shared invocation validation coordination;
- explicit confirmation and authorization evidence;
- preview and dry-run intent representation;
- execution-event and progress publication;
- cancellation request propagation;
- invocation-facing delivery of canonical diagnostics and warnings;
- invocation-facing projection and delivery of the canonical DD-1.2 application outcome;
- preservation of partial-completion and consequential-effect information at the invocation boundary;
- invocation-local lifecycle and correlation identity;
- concurrency/conflict hand-off points;
- adapter/Application Engine boundary responsibilities;
- application-level interpretation hand-off for delegated results at the invocation boundary.

This document does not own the canonical shared outcome envelope, diagnostic taxonomy, warning semantics, effect semantics, cancellation semantics, domain-specific use-case algorithms, managed-project resolution internals, configuration precedence algorithms, source-transformation algorithms, provider-specific execution mechanics, or presentation rendering.

## 3. Out of Scope

The following remain Implementation Specification concerns unless a later approved architectural decision elevates them:

- concrete TypeScript source paths;
- exact TypeScript `interface`, `type`, or `class` declarations;
- package/module boundaries;
- dependency-injection framework choice;
- concrete registry data structures;
- JSON, MessagePack, protobuf, or other serialization formats;
- standard-input/output, IPC, RPC, HTTP, socket, or in-process transport choice;
- terminal/GUI/IDE libraries;
- concrete cancellation primitives such as `AbortController`;
- exact concurrency primitives, mutexes, queues, or transaction mechanisms;
- logging framework choice;
- concrete error classes;
- concrete UUID/correlation-ID libraries;
- source paths and bootstrap wiring.

The design deliberately preserves transport and implementation-topology independence.

## 4. Architectural Position

The invocation boundary sits between interaction adapters and the Application Engine.

```text
caller / host / automation
          |
          v
interaction adapter
          |
          v
+------------------------------------+
| Application Invocation boundary    |
|                                    |
| normalize request                  |
| resolve command identity           |
| validate invocation shape          |
| carry authorization evidence       |
| expose events / cancellation       |
| project canonical DD-1.2 outcome   |
+------------------+-----------------+
                   |
                   v
          Application Engine
                   |
                   v
          command / use case
                   |
                   v
       capability coordination
```

The boundary is a permanent logical contract. It does not imply a separate process, package, executable, transport, or runtime.

## 5. Responsibility Model

The invocation design is decomposed into the following permanent responsibilities:

1. **Invocation Contract** — represents caller intent and execution-facing context.
2. **Command Catalogue** — exposes authoritative command identity and discovery metadata.
3. **Invocation Normalizer** — converts adapter-supplied values into canonical application-facing invocation values.
4. **Invocation Validator** — validates shared invocation structure and coordinates contextual validation requirements.
5. **Availability Evaluator** — determines recognized-but-unavailable state without confusing it with unknown command identity.
6. **Authorization Evidence Model** — represents explicit approval/authorization supplied by a caller or interaction adapter.
7. **Invocation Event Channel** — carries progress, warnings, diagnostics, state transitions, and other execution events.
8. **Cancellation Channel** — carries cancellation intent without pretending that cancellation implies rollback.
9. **Invocation Outcome Projection Contract** — projects and delivers the canonical DD-1.2 outcome to the caller without creating a competing semantic envelope.
10. **Invocation Coordinator** — binds these responsibilities to Application Engine execution while preserving authority boundaries.

These are responsibility boundaries, not a mandatory one-class-per-item implementation.

## 6. Invocation Request Contract

### 6.1 Purpose

The request refines [FR-INV-007](../functional/application-invocation-functional-specification-v01.md#fr-inv-007) into the logical field families below, separating explicit caller choices from subsequently resolved context.

### 6.2 Logical request model

A conforming invocation request shall be capable of representing the following logical fields:

| Field family | Purpose |
|---|---|
| invocation identity | Correlates this invocation with events and its final outcome |
| command identity | Selects the requested AppManager command/use case |
| explicit inputs | User/automation-supplied command inputs |
| explicit options | Invocation-scoped options affecting the requested use case |
| target/context hints | Caller-provided project, layer, repository, file, or host context hints |
| requested scope | Explicit narrowing or targeting requested by the caller |
| configuration overrides | Invocation-scoped candidate configuration values where allowed |
| authorization evidence | Explicit approvals or authorization relevant to the use case |
| execution mode capabilities | Declares whether the caller can interact, consume progress, request cancellation, etc. |
| preview intent | Requests preview/dry-run semantics where the use case supports them |
| correlation metadata | Optional non-semantic caller correlation information |

The exact field names and language-level representation belong to Implementation Specification.

### 6.3 Explicit values versus resolved values

The request contract shall distinguish caller-supplied values from values resolved later by Managed Project, Configuration, Settings, or another authoritative subsystem.

The request shall not contain an undifferentiated bag in which callers and resolvers overwrite each other without provenance.

Where a value may come from multiple sources, the eventual execution context shall preserve whether it was:

- explicitly supplied by the caller;
- derived from host context;
- resolved from managed-project context;
- resolved from configuration;
- supplied by an owning domain policy;
- defaulted according to approved semantics.

This distinction is required for deterministic behavior, diagnostics, safety review, and traceability.

### 6.4 No presentation semantics

Adapters map menu positions, labels, widget identifiers and host action names to the command identity and inputs under [Design](../appmanager-design-specification-v01.md#_4-6-presentation-independence).

### 6.5 Invocation-local immutability of intent

Once accepted for execution, the canonical representation of command identity and explicit caller intent shall be treated as invocation-local immutable intent.

Resolution may enrich the execution context, but it shall not silently mutate the requested command or reinterpret omitted values as consequential choices without approved semantics.

This does not require immutable language data structures; it defines semantic immutability.

## 7. Invocation Identity and Correlation

### 7.1 Invocation identity

Every significant invocation shall have an invocation-local identity sufficient to correlate:

- validation diagnostics;
- progress/events;
- warnings;
- cancellation requests;
- delegated execution traces where exposed internally;
- the final invocation outcome.

### 7.2 Identity properties

The identity must be unique enough within the active AppManager execution context to avoid accidental event/outcome cross-association.

The design does not require globally unique identifiers, UUIDs, database persistence, or externally stable IDs.

### 7.3 Caller correlation

A caller may supply separate correlation metadata for its own workflow. Caller correlation metadata shall not replace AppManager's invocation identity and shall not grant application authority.

## 8. Command Identity and Catalogue

### 8.1 Canonical command identity

Catalogue identities bind [FR-INV-003](../functional/application-invocation-functional-specification-v01.md#fr-inv-003) to deterministic lookup.

### 8.2 Command identity model

The canonical identity should be domain-oriented and stable across interaction modes.

At Detailed Design level, the identity contract must support:

- domain membership;
- command/use-case name;
- exact identity comparison;
- discovery representation;
- deterministic lookup;
- future extension without requiring adapter-specific identity schemes.

The owning domain Functional catalogues establish the canonical command identities. Implementation Specifications choose their concrete representation without changing those identities.

### 8.3 Command catalogue

The Application Engine shall expose an authoritative Command Catalogue containing command descriptors.

A descriptor shall be capable of representing:

- canonical command identity;
- functional domain;
- human-readable purpose/description key or description;
- supported invocation characteristics relevant to callers;
- whether contextual availability evaluation is required;
- whether preview/dry-run is supported where discoverable;
- interaction/capability requirements where relevant;
- sufficient metadata for deterministic discovery and selection.

### 8.4 Catalogue authority

Catalogue ownership follows [Design](../appmanager-design-specification-v01.md#_5-4-command-discovery); adapters consume the descriptors in §8.3.

### 8.5 Unknown versus unavailable

Command lookup and availability evaluation are separate steps:

```text
command identity
    |
    +-- no catalogue match --> unknown command
    |
    +-- catalogue match ----> availability evaluation
                                |
                                +-- available
                                |
                                +-- unavailable + reason
```

An unavailable command remains recognized.

## 9. Discovery Contract

### 9.1 Discovery query

The discovery query binds [Design](../appmanager-design-specification-v01.md#_5-4-command-discovery) to the descriptor model in §8.3. Queries may be context-free or context-sensitive according to the requested metadata.

### 9.2 Discovery result

Discovery results shall use the same canonical command descriptors that execution lookup uses, or a lossless application-facing projection of them.

This prevents divergence between what callers discover and what the Application Engine can execute.

### 9.3 Availability in discovery

Where sufficient context exists, discovery may include availability state and a safe application-level reason for unavailability.

Where context is insufficient, discovery shall distinguish `unknown/not evaluated` from `unavailable` rather than inventing an availability result.

### 9.4 No executable provider discovery leakage

Provider-specific operations, raw executable names, package scripts, or external-tool commands shall not automatically appear as first-class AppManager commands merely because a provider exposes them.

They require an owning AppManager use case or explicit bounded generic execution semantics.

## 10. Invocation Normalization

### 10.1 Purpose

The Invocation Normalizer converts adapter-facing structured values into canonical application-facing invocation values before shared validation and dispatch.

### 10.2 Normalization responsibilities

Normalization may:

- map adapter-specific command handles to canonical command identity;
- normalize explicit option representations;
- classify host-derived context separately from explicit user input;
- normalize path/reference representations into an application-facing form suitable for later governed resolution;
- normalize caller capability declarations;
- normalize authorization evidence into the shared evidence model;
- reject structurally malformed values that cannot be represented safely.

### 10.3 Normalization limitations

Normalization shall not:

- choose an alternate command when the requested command is unknown;
- resolve managed project scope authoritatively;
- resolve configuration precedence;
- perform consequential application effects;
- decide domain policy;
- infer destructive authorization;
- reinterpret provider-specific errors as final AppManager outcomes.

Those responsibilities belong elsewhere.

## 11. Interaction Capability Contract

### 11.1 Purpose

The request shall describe relevant capabilities of the invoking interaction path so AppManager can remain deterministic without depending on adapter type names.

### 11.2 Capability examples

The contract may represent whether the caller can:

- supply additional interactive input;
- present a confirmation request and return explicit evidence;
- consume progress/events;
- request cancellation;
- consume machine-readable structured results;
- render human-facing diagnostics;
- preserve caller correlation metadata.

### 11.3 Capability not authority

Interaction capabilities describe acquisition/delivery possibilities under [Design](../appmanager-design-specification-v01.md#_4-6-presentation-independence). Authorization sufficiency follows [FR-INV-022](../functional/application-invocation-functional-specification-v01.md#fr-inv-022) and [FR-INV-024](../functional/application-invocation-functional-specification-v01.md#fr-inv-024), independently of whether an adapter can prompt.

## 12. Shared Validation Coordination

### 12.1 Validation stages

Invocation validation is staged so that structural validation can occur before contextual work while context-dependent requirements can defer to their authorities.

```text
request normalization
        |
        v
structural invocation validation
        |
        v
command lookup
        |
        v
context prerequisite resolution
        |
        v
availability evaluation
        |
        v
command/domain input validation
        |
        v
policy / scope / authorization validation
        |
        v
execution eligibility established
```

The exact internal ordering may vary where dependencies require it, but no consequential effect may rely on a prerequisite that has not yet been validated.

### 12.2 Structural validation

Shared structural validation shall cover at least:

- command identity is representable;
- required common request structure is well-formed;
- explicit input/option representations are internally coherent;
- authorization evidence is syntactically valid where present;
- execution capability declarations are coherent;
- preview intent uses a supported shared representation.

### 12.3 Contextual validation

The invocation layer may coordinate resolution from:

- Managed Project;
- Configuration;
- Settings/identity resources;
- owning domain/use-case validation;
- shared safety/policy facilities.

It shall not duplicate those authorities.

### 12.4 Validation result contract

A validation stage shall return a structured result rather than relying solely on thrown implementation exceptions.

The result must be able to represent:

- valid;
- invalid with one or more diagnostics;
- unresolved because required context could not be established;
- unsupported invocation characteristic where relevant.

Implementation may use exceptions internally for exceptional faults, but expected validation rejection is an application state, not an unclassified crash.

## 13. Availability Evaluation

### 13.1 Availability evaluator

Each conditionally available command shall expose or be associated with an availability evaluator under Application Engine authority.

### 13.2 Availability inputs

Availability evaluation may depend on:

- resolved managed-project context;
- effective configuration;
- capability/provider availability;
- project state;
- supported interaction capability where genuinely required;
- other non-consequential facts required by the owning use case.

### 13.3 Availability result

The evaluator shall return an application-facing result capable of representing:

- available;
- unavailable;
- indeterminate because required safe context could not be resolved.

Unavailable/indeterminate results should include a safe diagnostic reason or reason code where useful.

### 13.4 Availability shall be side-effect free

Availability evaluation must not perform consequential application effects solely to determine whether a command is available.

Read-only inspection needed to establish availability is permitted if it respects managed scope and applicable safety rules.

## 14. Confirmation and Authorization Evidence

### 14.1 Separation of request and evidence acquisition

Authorization acquisition follows [Design](../appmanager-design-specification-v01.md#_4-6-presentation-independence) and [FR-INV-023](../functional/application-invocation-functional-specification-v01.md#fr-inv-023). The adapter returns the evidence model below to the Application Engine.

### 14.2 Authorization evidence model

Authorization evidence shall identify, at minimum:

- the invocation/use case to which it applies;
- the authorized action or consequential intent with sufficient specificity;
- the source/kind of evidence where relevant;
- whether the evidence was explicit rather than inferred.

### 14.3 Binding and stale authorization

Where materially important to safety, authorization evidence shall be bound to the operation or plan it approves strongly enough that material changes to target, scope, or proposed effects invalidate or require re-evaluation of that evidence.

This prevents approval for one plan from silently authorizing a materially different plan.

### 14.4 Interactive confirmation flow

A command may return an internal `authorization required` execution state/request containing enough safe information for a capable adapter to request explicit user confirmation.

The adapter then submits the resulting authorization evidence back through the invocation boundary.

The adapter shall not bypass the Application Engine by directly continuing a consequential provider operation.

### 14.5 Headless authorization

Headless initial or resumed requests supply the §14.2 evidence under [FR-INV-020](../functional/application-invocation-functional-specification-v01.md#fr-inv-020) and [FR-INV-022](../functional/application-invocation-functional-specification-v01.md#fr-inv-022).

## 15. Preview and Dry-Run Intent

### 15.1 Shared preview marker

The invocation contract shall provide a shared way to request preview/dry-run semantics where supported by the owning use case.

### 15.2 Owning-use-case responsibility

The invocation layer does not invent a generic mutation plan for every command.

The owning use case determines what preview means and which proposed effects/results it exposes.

### 15.3 Applied versus preview outcome

Invocation projects [DD-1.2](dd-1-2-execution-outcomes-detailed-design-v01.md#_13-proposed-effects-and-preview) using [the caller projection](#dd-outclar-003).

## 16. Invocation Coordinator

### 16.1 Responsibility

The Invocation Coordinator is the permanent internal application-boundary component responsible for moving a canonical request through lookup, validation, availability, execution coordination, event publication, and final outcome return.

It does not own the domain use-case algorithm itself.

### 16.2 Coordination sequence

A typical invocation follows:

```text
canonical request
      |
      v
Invocation Coordinator
      |
      +--> structural validation
      |
      +--> command catalogue lookup
      |
      +--> context prerequisite resolution
      |
      +--> availability evaluation
      |
      +--> command/use-case validation
      |
      +--> authorization/policy eligibility
      |
      +--> Application Engine executes use case
      |       |
      |       +--> capability coordination
      |       +--> application acceptance
      |       +--> canonical DD-1.2 outcome
      |
      +--> project canonical outcome for invocation
      |
      v
structured invocation-facing outcome
```

### 16.3 Application Engine authority

The coordinator is the entry component under [Design](../appmanager-design-specification-v01.md#_6-2-application-engine-authority). It may be implemented within the Engine or as a distinct component.

## 17. Execution State Model

### 17.1 Logical states

A significant invocation shall be capable of progressing through the following logical states:

```text
received
  |
  v
normalizing
  |
  v
validating
  |
  +--> rejected
  |
  v
ready
  |
  +--> awaiting authorization (interactive-capable path only)
  |
  v
executing
  |
  +--> cancelling
  |
  +--> completed
  +--> failed
  +--> partially completed
  +--> cancelled
```

Not every invocation must expose every state externally.

### 17.2 Terminal states

Terminal states project [DD-1.2](dd-1-2-execution-outcomes-detailed-design-v01.md#_6-core-status-model) through [DD-OUTCLAR-002](#dd-outclar-002). Preview and pre-execution rejection characteristics use [DD-OUTCLAR-003](#dd-outclar-003).

### 17.3 Rejection before execution

Validation, unknown-command, unavailable-command, or missing-authorization rejection shall be distinguishable from failure after consequential execution has started where that distinction matters to recovery and diagnostics. Any terminal application outcome produced from that distinction shall use the canonical DD-1.2 model.

## 18. Invocation Event Contract

### 18.1 Purpose

The event contract provides structured observation of invocation lifecycle without making event presentation part of command semantics.

### 18.2 Event families

The channel carries the event classes in [DD-1.2](dd-1-2-execution-outcomes-detailed-design-v01.md#_16-progress-events). Invocation additionally carries authorization-required requests where interactive continuation is supported and command-specific structured events explicitly exposed by the owning use case.

### 18.3 Event envelope

Channel envelopes use [DD-1.2](dd-1-2-execution-outcomes-detailed-design-v01.md#_16-progress-events) for invocation/event-family and optional stage/target association.

### 18.4 Events are not final outcomes

Event interpretation follows [FR-INV-028](../functional/application-invocation-functional-specification-v01.md#fr-inv-028). The coordinator delivers final acceptance through §22.

### 18.5 Ordering

Within one invocation, the event channel should preserve sufficient ordering to allow callers to understand execution progression.

This does not require a globally ordered event stream across unrelated concurrent invocations.

## 19. Progress Model

### 19.1 Semantic progress

Stage, target and reliable bounded quantitative progress bind [FR-INV-027](../functional/application-invocation-functional-specification-v01.md#fr-inv-027) to the channel in §18.

### 19.2 No fabricated percentages

The invocation infrastructure shall not invent precise percentage completion where the owning operation cannot determine it meaningfully.

Stage-based or indeterminate progress is preferable to false precision.

### 19.3 Provider progress translation

Provider-specific progress may be translated into AppManager-facing progress where useful, but raw provider status strings shall not automatically become the application event contract.

## 20. Cancellation Contract

### 20.1 Cancellation request

A cancellation request is invocation-scoped intent asking the Application Engine to stop further work as safely and promptly as supported by the owning use case and delegated capabilities.

### 20.2 Cooperative design

Cancellation is cooperative across the execution chain:

```text
caller cancellation request
       |
       v
Invocation Coordinator
       |
       v
Application Engine / use case
       |
       +--> stop scheduling new work
       +--> request cancellation from active capabilities where supported
       +--> determine completed/partial effects
       |
       v
canonical DD-1.2 cancelled / partial outcome
```

### 20.3 Cancellation semantics

This boundary transports cancellation requests and coordinates their invocation-local path. Outcome interpretation uses [DD-1.2](dd-1-2-execution-outcomes-detailed-design-v01.md#_17-cancellation-model).

### 20.4 Late cancellation

If cancellation arrives after the operation has irreversibly completed, the projected final outcome shall reflect the canonical DD-1.2 outcome determined from actual application state rather than falsely reporting cancellation.

If the request races with completion, the coordinator must resolve one final application outcome deterministically based on the observed application state and then project that canonical result.

## 21. Diagnostic Projection Contract

### 21.1 Ownership and purpose

The boundary projects [DD-1.2](dd-1-2-execution-outcomes-detailed-design-v01.md#_9-diagnostic-model). Its malformed-request, unknown/unavailable-command, unresolved-context, missing-authorization and interaction-capability-mismatch conditions map to that owner’s categories/codes.

### 21.2 Invocation-specific refinement

Narrow invocation codes/subcategories apply [DD-1.2](dd-1-2-execution-outcomes-detailed-design-v01.md#dd-outclar-006) and [canonical code semantics](dd-1-2-execution-outcomes-detailed-design-v01.md#_9-5-diagnostic-codes).

### 21.3 Warning projection

Caller warning projection applies [FR-INV-039](../functional/application-invocation-functional-specification-v01.md#fr-inv-039) through [DD-1.2](dd-1-2-execution-outcomes-detailed-design-v01.md#_9-diagnostic-model).

### 21.4 Sensitive-data minimization

Projection applies [DD-1.2](dd-1-2-execution-outcomes-detailed-design-v01.md#_24-sensitive-information-and-redaction) to exceptions, prompts, configuration, paths, excerpts and external responses. It may further omit information not required by the caller.

## 22. Invocation Outcome Projection Contract

### 22.1 Purpose

This contract delivers the accepted [DD-1.2](dd-1-2-execution-outcomes-detailed-design-v01.md#_7-outcome-contract) to a caller; the two projection refinements below define its local obligations.

### 22.2 Projection obligations

#### DD-OUTCLAR-002 — Traceable caller projection {#dd-outclar-002}

The caller projection uses the [DD-1.2 outcome field families](dd-1-2-execution-outcomes-detailed-design-v01.md#_7-outcome-contract). It preserves all caller-relevant meanings and material partial/effect information. An approved serialization or caller view may rename fields, omit irrelevant implementation detail or render them for humans, while remaining traceable to that canonical outcome and preserving its lifecycle states.

#### DD-OUTCLAR-003 — Invocation-specific characteristics {#dd-outclar-003}

The projection may expose preview or pre-execution rejection characteristics. Where they affect application meaning, map them explicitly to [DD-1.2 preview semantics](dd-1-2-execution-outcomes-detailed-design-v01.md#_13-proposed-effects-and-preview) and its outcome/status model instead of maintaining an invocation-only state model.

### 22.3 Result payload ownership

The boundary projects the accepted payload under [DD-1.2](dd-1-2-execution-outcomes-detailed-design-v01.md#_7-2-result-payload).

### 22.4 Provider data containment

Provider detail reaches the caller only through [DD-1.2](dd-1-2-execution-outcomes-detailed-design-v01.md#_18-provider-result-normalization) and [sensitive-information handling](dd-1-2-execution-outcomes-detailed-design-v01.md#_24-sensitive-information-and-redaction).

## 23. Partial Completion Projection

The [caller projection](#dd-outclar-002) carries material [DD-1.2 child/stage/target results](dd-1-2-execution-outcomes-detailed-design-v01.md#_14-partial-completion). The aggregate arrives already interpreted by the owning use case/Application Engine.

## 24. Consequential Effect Projection

The [caller projection](#dd-outclar-002) carries [DD-1.2 effect information](dd-1-2-execution-outcomes-detailed-design-v01.md#_12-consequential-effects), including uncertainty and compensation evidence. Absence of an exposed provider step is not additional effect evidence.

## 25. Delegated Result Interpretation Boundary

### 25.1 Capability result

Capabilities supply [DD-1.2](dd-1-2-execution-outcomes-detailed-design-v01.md#_8-execution-evidence-contract) through their bounded technical contracts.

### 25.2 Application interpretation

The owning use case applies [Design](../appmanager-design-specification-v01.md#_11-11-workflow-results-failure-and-acceptance) before the coordinator receives the canonical outcome.

### 25.3 Authority invariant

The distinct hand-offs are illustrated by:

```text
provider evidence -> application interpretation -> caller projection
```

The interpretation examples are in [DD-1.2](dd-1-2-execution-outcomes-detailed-design-v01.md#_19-application-level-interpretation); projection follows [DD-OUTCLAR-002](#dd-outclar-002).

## 26. Retry and Repetition Boundary

### 26.1 No generic invocation retry

Coordinator retry decisions apply [FR-INV-049](../functional/application-invocation-functional-specification-v01.md#fr-inv-049). A transient lower-level failure does not supply a complete-invocation retry policy.

### 26.2 Provider-local retry

Bounded provider-local retry consumes [FR-INV-049](../functional/application-invocation-functional-specification-v01.md#fr-inv-049) and the relevant capability contract.

### 26.3 Use-case retry

Application retry/resume/repetition follows [FR-INV-048](../functional/application-invocation-functional-specification-v01.md#fr-inv-048). Owning semantics may require fresh validation, state inspection or authorization.

## 27. Concurrency and Conflict Boundary

### 27.1 Invocation independence

Invocation-local state applies [FR-INV-050](../functional/application-invocation-functional-specification-v01.md#fr-inv-050) to intent and inputs, and also isolates authorization evidence, events, cancellation and final-outcome projection.

### 27.2 Conflict evaluation hand-off

The Invocation Coordinator shall provide an integration point through which the Application Engine or owning use case can detect operations that conflict over managed targets/resources.

The concrete conflict strategy may be:

- reject;
- serialize;
- coordinate through resource-specific concurrency control;
- use optimistic stale-state detection;
- use another approved mechanism.

The mechanism belongs to relevant Detailed Design/Implementation specifications; the invocation contract requires deterministic application-level conflict handling and canonical DD-1.2 reporting.

### 27.3 No global serialization requirement

This design does not require all AppManager invocations to execute serially. Independent invocations may execute concurrently when their owning designs permit it safely.

## 28. Adapter Boundary Contract

### 28.1 Adapter responsibilities

Under [Design](../appmanager-design-specification-v01.md#_4-6-presentation-independence), an adapter consumes the catalogue (§8), supplies request and capability information (§§6, 11), acquires authorization (§14), observes events (§18), requests cancellation (§20) and receives the projection (§22).

### 28.2 Adapter prohibitions

Adapter behavior follows [Design](../appmanager-design-specification-v01.md#_4-6-presentation-independence). Unknown-command handling follows [FR-INV-006](../functional/application-invocation-functional-specification-v01.md#fr-inv-006), and outcome projection follows [DD-OUTCLAR-002](#dd-outclar-002). Convenience behavior uses §28.3 rather than an independent mutation path.

### 28.3 Adapter-specific convenience

Adapters may provide convenience behavior such as remembered UI selections, command palettes, defaults shown to users, or context menus, but such convenience must be translated into explicit invocation information and revalidated by AppManager.

## 29. Headless Invocation Design

### 29.1 Deterministic request

Headless request completeness follows [FR-INV-020](../functional/application-invocation-functional-specification-v01.md#fr-inv-020) using the §6 request model.

### 29.2 No interactive continuation dependency

The coordinator applies [FR-INV-020](../functional/application-invocation-functional-specification-v01.md#fr-inv-020) and [FR-INV-022](../functional/application-invocation-functional-specification-v01.md#fr-inv-022) to the `awaiting authorization/input` state; unresolved required information produces the structured projection in §22.

### 29.3 Structured output

Headless delivery binds [FR-INV-021](../functional/application-invocation-functional-specification-v01.md#fr-inv-021) to [DD-OUTCLAR-002](#dd-outclar-002) and §18 events. Transport/serialization are implementation choices.

## 30. Application Engine Integration Contract

### 30.1 Command execution interface

The invocation boundary shall hand the Application Engine a validated execution request containing:

- canonical command identity;
- validated explicit inputs/options;
- invocation context references/results required by the use case;
- explicit requested scope;
- authorization evidence;
- preview intent;
- cancellation/event channels or equivalent execution controls;
- invocation identity/correlation.

### 30.2 Execution return

The Engine returns [DD-1.2](dd-1-2-execution-outcomes-detailed-design-v01.md#_7-outcome-contract) for the [§22 caller projection](#_22-invocation-outcome-projection-contract).

### 30.3 No provider bypass

Provider access for an invoked command follows [Design](../appmanager-design-specification-v01.md#_6-2-application-engine-authority) and [Design](../appmanager-design-specification-v01.md#_6-6-capability-boundaries-and-providers).

## 31. Relationship to Managed Project

Request hints and scope selectors flow to [DD-1.3 context resolution](dd-1-3-managed-project-detailed-design-v01.md#_10-managed-project-context-contract) and [scope resolution](dd-1-3-managed-project-detailed-design-v01.md#_18-managed-scope-resolution). The collaboration distinguishes a caller hint, resolved project and authorized mutation scope.

## 32. Relationship to Configuration

Invocation overrides enter [DD-1.4 candidate resolution](dd-1-4-configuration-resolution-detailed-design-v01.md#_9-candidate-model). The resulting [effective snapshot](dd-1-4-configuration-resolution-detailed-design-v01.md#_16-effective-configuration-snapshot) joins execution context through its owner.

## 33. Relationship to Source Transformation

Source-changing invocations carry preview intent, authorization and cancellation through §§14–20. [DD-2.5](../dd_2_shared_capabilities/dd-2-5-source-transformation-detailed-design-v01.md) supplies the source plan and execution contract under [FR-XFORM-033](../functional/source-transformation-functional-specification-v01.md#fr-xform-033); the invocation marker does not supply a generic patch model.

## 34. Relationship to Domain Orchestration

Domains bind their local inputs and accepted result payloads to §§6, 8–14, 18 and 20. Shared outcome composition and diagnostic refinement use [DD-1.2](dd-1-2-execution-outcomes-detailed-design-v01.md#_7-2-result-payload) and [DD-OUTCLAR-006](dd-1-2-execution-outcomes-detailed-design-v01.md#dd-outclar-006).

## 35. Error and Fault Boundary

### 35.1 Expected application rejection

Expected rejection conditions use [FR-INV-012](../functional/application-invocation-functional-specification-v01.md#fr-inv-012) and [DD-1.2](dd-1-2-execution-outcomes-detailed-design-v01.md#_9-diagnostic-model) before projection through §22.

### 35.2 Unexpected internal fault

Unexpected software defects or invariant violations may enter the invocation layer as internal faults.

The boundary shall ensure they are mapped to a safe canonical DD-1.2 failure before caller projection while retaining sufficient internal diagnostic evidence for observability.

### 35.3 No raw exception contract

Language exceptions, process exits and provider error classes enter [DD-1.2](dd-1-2-execution-outcomes-detailed-design-v01.md#_18-provider-result-normalization) as evidence.

## 36. Security and Sensitive Information

### 36.1 Least-information boundary

Invocation requests, events, and outcome projections should carry only the information necessary for the requested operation and caller understanding.

### 36.2 Secret-bearing inputs

Where secret values are valid inputs, their representation shall support classification as sensitive so diagnostics/events can avoid echoing them.

### 36.3 Host context

IDE/host adapters shall not send arbitrary host/project state merely because it is available. Context supplied should be bounded to information relevant to the requested AppManager operation.

### 36.4 Provider detail

Provider detail uses [DD-1.2](dd-1-2-execution-outcomes-detailed-design-v01.md#_18-provider-result-normalization) and [redaction](dd-1-2-execution-outcomes-detailed-design-v01.md#_24-sensitive-information-and-redaction) before crossing this boundary.

## 37. Extensibility

### 37.1 New commands

A new command becomes invocable by registering an approved canonical command descriptor and execution binding with the authoritative command model.

Adding a command must not require modifying each interaction adapter's business logic.

### 37.2 New interaction adapters

A new adapter conforms by producing/consuming the shared invocation contracts and canonical DD-1.2 outcome projection.

It must not require a new domain implementation or outcome taxonomy.

### 37.3 New transports

A future transport may serialize the same logical request/event contracts and canonical outcome projection without changing command or outcome semantics.

Transport-specific concerns belong to Implementation Specification unless an accepted ADR makes them architectural.

## 38. Testability Requirements

Detailed Design conformance shall be testable without relying on a particular presentation adapter.

The implementation must support tests covering at least:

- exact command lookup;
- unknown versus unavailable behavior;
- canonical request normalization;
- explicit versus resolved input provenance;
- deterministic Headless rejection when information is missing;
- authorization evidence required/supplied/stale cases;
- preview versus applied outcome distinction;
- event/outcome separation;
- cancellation before, during, and after effective completion;
- success/failure/partial/cancelled outcome projection from DD-1.2;
- provider technical success rejected by application acceptance;
- provider failure interpreted as partial/recoverable where owning policy permits;
- canonical diagnostic mapping and invocation-specific refinement;
- sensitive diagnostic minimization;
- invocation isolation under concurrent execution;
- adapter equivalence using the same canonical invocation and outcome semantics.

Concrete test frameworks and source locations belong to Implementation Specification.

## 39. Design Invariants

The canonical local contracts are the request/provenance model (§6), catalogue and discovery (§§8–9), validation/availability (§§12–13), authorization evidence (§14), coordinator/state/channel model (§§16–20), projection (§§21–24) and isolation (§27). Their upstream and sibling bindings are direct references in those sections; this index adds no second invariant statement.

## 40. Traceability to Functional Requirements

| Detailed Design area | Functional requirements |
|---|---|
| Application authority and boundary | FR-INV-001–002 |
| Command identity/catalogue/discovery | FR-INV-003–006 |
| Invocation request and context | FR-INV-007–010 |
| Validation coordination | FR-INV-011–013 |
| Availability evaluation | FR-INV-014–016 |
| Adapter equivalence and interaction | FR-INV-017–019 |
| Headless design | FR-INV-020–022 |
| Authorization/preview | FR-INV-023–026 |
| Events/progress | FR-INV-027–029 |
| Cancellation request/coordination | FR-INV-030–032 |
| Outcome projection/delivery using DD-1.2 | FR-INV-033–037 |
| Diagnostic/warning projection and security using DD-1.2 | FR-INV-038–040 |
| Delegated-result interpretation hand-off | FR-INV-041–043 |
| Failure/effect/recovery projection using DD-1.2 | FR-INV-044–047 |
| Retry/repetition boundary | FR-INV-048–049 |
| Invocation isolation/concurrency conflict integration | FR-INV-050–051 |

## 41. Related and Downstream Detailed Design Dependencies

This design establishes invocation contracts that other Detailed Design Specifications consume and binds its outcome-facing responsibilities to DD-1.2.

### 41.1 DD-1.2 — Execution Outcomes and Diagnostics

[DD-1.2](dd-1-2-execution-outcomes-detailed-design-v01.md) supplies the outcome, diagnostic, event, effect and cancellation meanings projected here. The local projection refinements are [DD-OUTCLAR-002](#dd-outclar-002) and [DD-OUTCLAR-003](#dd-outclar-003).

### 41.2 DD-1.3 — Managed Project

Managed Project defines authoritative context/scope models consumed during invocation validation and execution.

### 41.3 DD-1.4 — Configuration Resolution

Configuration defines effective configuration and provenance consumed by command validation and execution.

### 41.4 DD-1.5 — Application Engine

Application Engine defines command registration/dispatch ownership, use-case execution coordination, policy sequencing, capability coordination, final acceptance, and construction of the canonical DD-1.2 outcome using the invocation request/control contracts defined here.

### 41.5 DD-2 capability designs

DD-2 technical evidence reaches the caller through [DD-1.2](dd-1-2-execution-outcomes-detailed-design-v01.md#_18-provider-result-normalization) and [diagnostic refinement](dd-1-2-execution-outcomes-detailed-design-v01.md#dd-outclar-006).

## 42. Implementation Specification Obligations

Implementation Specifications derived from this Detailed Design shall define at minimum:

- concrete Version 1 TypeScript representations for request, command identity, descriptors, interaction capabilities, authorization evidence, events, cancellation controls, and invocation projection/transport of canonical DD-1.2 diagnostics/outcomes;
- concrete command catalogue/registration mechanism;
- concrete invocation coordinator wiring;
- concrete adapter-to-invocation bindings;
- exact correlation/invocation-ID generation;
- exact event delivery mechanism;
- concrete cancellation primitive;
- serialization and transport bindings where applicable;
- concurrency mechanisms used to satisfy owning designs;
- structured error conversion/mapping into DD-1.2 at process/provider boundaries;
- runtime registration/bootstrap;
- tests mapped to the invariants and FR traceability above.

Implementation Specifications may choose efficient concrete structures but must not duplicate or fork the canonical DD-1.2 semantic contracts.

## 43. Conformance Criteria

Conformance is assessed against the local contracts indexed in §39, their canonical references and the test obligations in §38. This section introduces no duplicate acceptance checklist.

## 44. Version 1 Detailed Design Baseline

This baseline defines the invocation request, interaction, control and caller-projection seams. [The Project Documentation Guide](../project-documentation-guide-v01.md#_8-level-4-implementation-specification) governs their concrete implementation mapping.
