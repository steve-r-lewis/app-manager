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

This specification defines the permanent internal contracts, responsibilities, state transitions, and collaboration model used to convert caller intent into an authoritative AppManager command execution and structured invocation-facing projection of the canonical application outcome.

It is the Detailed Design authority for the Application Invocation boundary. It defines how interaction adapters and host integrations enter the Application Engine without becoming independent owners of command semantics, application policy, safety, scope, diagnostic taxonomy, or final outcome semantics.

The central design rule is:

> **Invocation transports intent into the Application Engine; it does not own the meaning of that intent.**

A second governing rule is:

> **Interaction-specific mechanisms may acquire or render information, but application validation, availability, policy, scope, execution acceptance, canonical diagnostics, and final outcome semantics remain behind the shared invocation boundary.**

DD-1.2 Execution Outcomes and Diagnostics is the single semantic owner of the shared AppManager outcome, diagnostic, warning, effect, cancellation, and subordinate-result model. This document owns how that canonical model crosses the invocation boundary without semantic reinterpretation.

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

The invocation request is the canonical internal representation of a caller's requested AppManager operation.

It must contain sufficient structured information for the Application Engine to identify the requested use case, distinguish explicit caller choices from resolved context, and execute deterministically without depending on presentation artifacts.

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

The request shall not encode application meaning through menu positions, terminal strings, GUI widget identifiers, localized labels, or host-specific action names.

Adapters may map those representations to the canonical command identity and structured input model before invocation.

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

Each invocable AppManager use case shall expose a stable canonical command identity independent of adapter presentation.

The identity shall be sufficient to distinguish commands without relying on display labels or positional routing.

### 8.2 Command identity model

The canonical identity should be domain-oriented and stable across interaction modes.

At Detailed Design level, the identity contract must support:

- domain membership;
- command/use-case name;
- exact identity comparison;
- discovery representation;
- deterministic lookup;
- future extension without requiring adapter-specific identity schemes.

The exact string format is left to Implementation Specification unless compatibility requirements later make it architectural.

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

Interaction adapters may filter or present catalogue entries, but they shall not define a competing catalogue that becomes the authority for whether a command exists.

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

The invocation layer shall expose a discovery operation capable of returning the authoritative command surface for a relevant application context.

Discovery may be context-free or context-sensitive depending on the metadata requested.

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

Declaring that an adapter can prompt does not authorize it to approve an operation itself.

Declaring that an adapter cannot prompt does not weaken required authorization.

The capability contract describes interaction possibilities, not application policy.

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

The Application Engine determines when explicit confirmation/authorization is required.

Interaction adapters may acquire the evidence but do not decide whether the evidence is required or sufficient.

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

Headless callers must supply valid authorization evidence in the initial or resumed invocation where required.

If the evidence is absent or insufficient, the invocation fails/rejects deterministically rather than blocking for input.

## 15. Preview and Dry-Run Intent

### 15.1 Shared preview marker

The invocation contract shall provide a shared way to request preview/dry-run semantics where supported by the owning use case.

### 15.2 Owning-use-case responsibility

The invocation layer does not invent a generic mutation plan for every command.

The owning use case determines what preview means and which proposed effects/results it exposes.

### 15.3 Applied versus preview outcome

In accordance with DD-1.2, the canonical outcome distinguishes proposed/preview state from applied effects. The invocation boundary shall preserve that distinction when projecting the outcome to callers and must never represent preview as though consequential effects were applied.

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

The coordinator enters the Application Engine; it is not a peer authority competing with it.

Whether implemented as a distinct component or as part of the Application Engine implementation, its design must preserve the rule that use-case semantics and final acceptance remain Application Engine responsibilities.

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

The canonical DD-1.2 final application outcome classes are projected through this state model as:

- success;
- failure;
- partial success/partial completion;
- cancelled.

Preview completion remains an execution characteristic/proposed-effect distinction under DD-1.2 rather than an independent invocation terminal taxonomy.

### 17.3 Rejection before execution

Validation, unknown-command, unavailable-command, or missing-authorization rejection shall be distinguishable from failure after consequential execution has started where that distinction matters to recovery and diagnostics. Any terminal application outcome produced from that distinction shall use the canonical DD-1.2 model.

## 18. Invocation Event Contract

### 18.1 Purpose

The event contract provides structured observation of invocation lifecycle without making event presentation part of command semantics.

### 18.2 Event families

The event model shall be capable of representing:

- lifecycle/state transitions;
- progress information;
- non-fatal warnings;
- diagnostics requiring attention;
- authorization-required requests where an interactive continuation is supported;
- significant stage completion where useful;
- cancellation acknowledgement;
- other command-specific structured events explicitly exposed by the owning use case.

### 18.3 Event envelope

Each event shall carry enough metadata to associate it with the invocation and identify its event family/type.

Events may additionally include stage or target identity where required for multi-target operations.

### 18.4 Events are not final outcomes

No event, including `100%` progress or provider completion, is by itself the final AppManager outcome.

The final outcome is produced only after application-level interpretation and acceptance using DD-1.2 semantics.

### 18.5 Ordering

Within one invocation, the event channel should preserve sufficient ordering to allow callers to understand execution progression.

This does not require a globally ordered event stream across unrelated concurrent invocations.

## 19. Progress Model

### 19.1 Semantic progress

Progress should represent meaningful application stages, target completion, or bounded quantitative progress where the owning use case can provide it reliably.

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

In accordance with DD-1.2, cancellation is cooperative, preserves known completed effects, remains distinguishable from ordinary failure, and does not imply rollback. This invocation contract adds only cancellation-request transport and invocation-local coordination; it does not redefine canonical cancellation outcome semantics.

### 20.4 Late cancellation

If cancellation arrives after the operation has irreversibly completed, the projected final outcome shall reflect the canonical DD-1.2 outcome determined from actual application state rather than falsely reporting cancellation.

If the request races with completion, the coordinator must resolve one final application outcome deterministically based on the observed application state and then project that canonical result.

## 21. Diagnostic Projection Contract

### 21.1 Ownership and purpose

DD-1.2 owns the canonical AppManager diagnostic structure, severity model, broad category taxonomy, warning semantics, recovery information, and provider-evidence relationship. The invocation boundary consumes those diagnostics and projects the caller-relevant information without creating a second diagnostic taxonomy.

Invocation-specific conditions such as malformed invocation structure, unknown command, unavailable command, unresolved invocation context, missing authorization, or interaction-capability mismatch shall be represented using the canonical DD-1.2 diagnostic model and mapped to its broad categories/codes.

### 21.2 Invocation-specific refinement

Where the invocation boundary requires narrower machine-readable distinctions, it may define invocation-specific diagnostic codes or subcategories provided that they:

- map to a canonical DD-1.2 category;
- do not redefine canonical category meaning;
- do not require callers to choose between two competing shared taxonomies;
- remain AppManager-oriented rather than provider-native.

### 21.3 Warning projection

Warnings crossing the invocation boundary retain DD-1.2 warning semantics. Presentation or transport shall not promote or demote their application meaning.

### 21.4 Sensitive-data minimization

Diagnostic projection shall preserve DD-1.2 sensitivity/redaction semantics and may further omit information not required by the caller.

Provider exceptions, prompts, configuration values, paths, file excerpts, and external responses shall not be surfaced verbatim by default when they may contain secrets or unnecessary private project content.

## 22. Invocation Outcome Projection Contract

### 22.1 Purpose

The canonical final AppManager outcome is defined by DD-1.2. The Invocation Outcome Projection Contract exposes that accepted application result to a caller without creating a second semantic outcome envelope.

### 22.2 Projection obligations

#### DD-OUTCLAR-002 — Traceable caller projection {#dd-outclar-002}

The caller projection uses the [DD-1.2 outcome field families](dd-1-2-execution-outcomes-detailed-design-v01.md#_7-outcome-contract). It preserves all caller-relevant meanings and material partial/effect information. An approved serialization or caller view may rename fields, omit irrelevant implementation detail or render them for humans, while remaining traceable to that canonical outcome and preserving its lifecycle states.

#### DD-OUTCLAR-003 — Invocation-specific characteristics {#dd-outclar-003}

The projection may expose preview or pre-execution rejection characteristics. Where they affect application meaning, map them explicitly to [DD-1.2 preview semantics](dd-1-2-execution-outcomes-detailed-design-v01.md#_13-proposed-effects-and-preview) and its outcome/status model instead of maintaining an invocation-only state model.

### 22.3 Result payload ownership

DD-1.2 owns the shared outcome envelope semantics. The owning command/domain owns the semantic shape of its application result payload within that envelope. Invocation only projects the accepted payload and shared outcome semantics to the caller.

### 22.4 Provider data containment

Raw provider result objects shall not escape as the final AppManager result contract. Any provider detail crossing the invocation boundary must already be normalized into DD-1.2 evidence/diagnostic semantics and be safe for the caller.

## 23. Partial Completion Projection

DD-1.2 owns partial-success and subordinate-result semantics. Where those states are material to the caller, invocation shall preserve the canonical child/target/stage results and known effects rather than flatten them into success/failure or inventing a separate aggregate rule.

The Application Engine/owning use case determines the canonical aggregate outcome; invocation projects it.

## 24. Consequential Effect Projection

DD-1.2 owns applied-effect, proposed-effect, uncertainty, and compensation/rollback semantics. Invocation shall preserve material canonical effect information required for safe caller understanding and recovery.

Invocation shall never infer rollback, compensation, or successful application merely from the absence of an exposed provider step.

## 25. Delegated Result Interpretation Boundary

### 25.1 Capability result

Capability providers return technical results through their own shared capability contracts.

Those results may contain provider-neutral technical success/failure information, data, diagnostics, and effect facts.

### 25.2 Application interpretation

The owning use case interprets capability results against:

- requested intent;
- managed scope;
- configuration;
- application policy;
- safety constraints;
- acceptance criteria;
- workflow state.

Only after this interpretation is a canonical DD-1.2 final outcome produced and made available for invocation projection.

### 25.3 Authority invariant

```text
provider technical result
        !=
AppManager application outcome
        !=
invocation transport/presentation representation
```

A technically successful provider call can yield application failure; a bounded provider failure can yield a recoverable/partial application outcome where the use case permits it. Invocation does not re-interpret that decision.

## 26. Retry and Repetition Boundary

### 26.1 No generic invocation retry

The Invocation Coordinator shall not automatically retry a complete consequential AppManager invocation merely because a lower-level failure appears transient.

### 26.2 Provider-local retry

A capability provider may perform bounded provider-local retry only where its capability contract permits the retry without changing AppManager-visible semantics.

### 26.3 Use-case retry

Resumption, retry, or repetition of an application use case is controlled by owning use-case semantics and may require fresh validation, current-state inspection, or renewed authorization.

## 27. Concurrency and Conflict Boundary

### 27.1 Invocation independence

Each invocation has isolated intent, explicit inputs, requested scope, authorization evidence, events, cancellation state, and final outcome projection.

Mutable invocation-local state shall not leak across unrelated invocations.

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

An interaction adapter may:

- discover commands;
- map adapter actions to canonical command identity;
- gather explicit inputs;
- provide host context hints;
- declare interaction capabilities;
- acquire explicit authorization when requested;
- consume/render events;
- request cancellation;
- render or serialize the invocation-facing projection of the canonical outcome.

### 28.2 Adapter prohibitions

An adapter shall not independently:

- implement domain workflow semantics;
- decide managed scope;
- decide configuration precedence;
- declare provider success to be AppManager success;
- reinterpret canonical DD-1.2 diagnostic or outcome semantics;
- infer authorization;
- weaken safety requirements;
- choose fallback commands for unknown command identities;
- mutate project state outside an authorized AppManager use case merely to “help” invocation succeed.

### 28.3 Adapter-specific convenience

Adapters may provide convenience behavior such as remembered UI selections, command palettes, defaults shown to users, or context menus, but such convenience must be translated into explicit invocation information and revalidated by AppManager.

## 29. Headless Invocation Design

### 29.1 Deterministic request

A Headless caller shall submit a complete request or a request whose missing information can be deterministically resolved under approved context/configuration rules.

### 29.2 No interactive continuation dependency

The coordinator shall not enter an indefinite `awaiting authorization/input` state for Headless invocation.

If interaction is unavailable and required information/evidence cannot be resolved, the invocation terminates with the canonical structured rejection/failure outcome projected through this boundary.

### 29.3 Structured output

Headless callers consume the same canonical DD-1.2 outcome semantics and compatible event semantics as other adapters, without depending on terminal rendering.

Transport/serialization remain implementation choices.

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

The Application Engine determines and returns the canonical DD-1.2 application outcome. The invocation boundary projects that outcome to the caller; it does not convert it into a separately owned application-result model.

The canonical outcome may contain command-specific result data, final application status, diagnostics/warnings, effects/proposed effects, target/sub-result summaries, cancellation information, evidence references, recovery guidance, and correlation/timing metadata as defined by DD-1.2.

### 30.3 No provider bypass

Interaction adapters shall not invoke specialist providers directly as an alternative execution path for an AppManager command.

Provider access used to realize a command must occur through the Application Engine and approved capability boundaries.

## 31. Relationship to Managed Project

The invocation design carries target/context hints and requested scope, but Managed Project Detailed Design owns authoritative project-context resolution and managed-scope representation.

The invocation layer therefore depends on Managed Project to convert caller hints into governed application context.

It must preserve the distinction:

```text
caller target hint
    !=
resolved managed project
    !=
authorized mutation scope
```

## 32. Relationship to Configuration

Invocation-scoped overrides are candidate configuration inputs only.

Configuration Detailed Design owns:

- source classification;
- precedence;
- validation;
- applicability;
- provenance;
- effective configuration production.

The invocation layer shall not independently merge or prioritize configuration sources.

## 33. Relationship to Source Transformation

Preview intent, authorization evidence, and cancellation request transport are shared invocation concerns; canonical effect, partial-result, cancellation-outcome, and final-outcome semantics are owned by DD-1.2.

For operations modifying existing source, Source Transformation Detailed Design owns transformation planning, structure-aware application, stale-source detection, validation, and application-acceptance integration.

The invocation layer must not treat “preview” as authority to build or apply its own generic source patch model.

## 34. Relationship to Domain Orchestration

Domain Detailed Designs define command/use-case orchestration and domain-specific input/result payload models.

They shall use this shared invocation design for request/discovery/interaction concerns and DD-1.2 for canonical outcome/diagnostic semantics rather than creating domain-specific substitutes for:

- request identity;
- command lookup;
- availability semantics;
- authorization evidence;
- progress/event envelopes;
- cancellation request transport;
- canonical diagnostics;
- canonical final outcome status classes.

Domain designs may add domain-specific payloads, codes, and diagnostic refinements only by composition/mapping to the canonical DD-1.2 model.

## 35. Error and Fault Boundary

### 35.1 Expected application rejection

Unknown command, invalid input, unavailable command, missing authorization, managed-scope rejection, capability unavailability, and other expected operational failures shall be represented using canonical DD-1.2 application outcomes/diagnostics and projected through invocation.

### 35.2 Unexpected internal fault

Unexpected software defects or invariant violations may enter the invocation layer as internal faults.

The boundary shall ensure they are mapped to a safe canonical DD-1.2 failure before caller projection while retaining sufficient internal diagnostic evidence for observability.

### 35.3 No raw exception contract

Thrown language exceptions, process exit codes, provider error classes, and stack traces are implementation evidence, not the caller-facing invocation contract.

## 36. Security and Sensitive Information

### 36.1 Least-information boundary

Invocation requests, events, and outcome projections should carry only the information necessary for the requested operation and caller understanding.

### 36.2 Secret-bearing inputs

Where secret values are valid inputs, their representation shall support classification as sensitive so diagnostics/events can avoid echoing them.

### 36.3 Host context

IDE/host adapters shall not send arbitrary host/project state merely because it is available. Context supplied should be bounded to information relevant to the requested AppManager operation.

### 36.4 Provider detail

Provider-specific diagnostic detail crossing the invocation boundary shall be normalized under DD-1.2 and sanitized before exposure.

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

The following are normative Detailed Design invariants:

1. There is one authoritative command identity model.
2. Command existence and command availability are separate concepts.
3. Interaction adapters do not own use-case semantics.
4. Explicit caller intent remains distinguishable from resolved context/configuration.
5. Authorization is explicit evidence, never inferred from inability to prompt.
6. Preview intent is distinguishable from applied execution, using DD-1.2 effect/outcome semantics.
7. Progress/events do not define final success.
8. Cancellation request transport does not redefine DD-1.2 cancellation or rollback semantics.
9. Provider technical results do not define final AppManager outcomes.
10. The Application Engine determines application-level acceptance.
11. DD-1.2 is the single semantic owner of shared outcome, diagnostic, warning, effect, cancellation, and subordinate-result semantics.
12. Invocation projects canonical DD-1.2 outcomes and diagnostics; it does not define a competing envelope or taxonomy.
13. Expected operational rejection is represented structurally rather than only as exceptions/prose.
14. Invocation-local state and intent do not leak between unrelated invocations.
15. Sensitive data is minimized at the invocation boundary.
16. Transport and concrete runtime topology remain replaceable implementation choices.

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

DD-1.2 is the canonical semantic owner of the shared AppManager outcome, diagnostic, warning, effect, cancellation, provider-evidence, aggregation, and subordinate-result model.

This document owns only the invocation-facing request/event/cancellation-control boundary and the projection/delivery of the accepted DD-1.2 outcome. Any invocation-specific diagnostic code or projection field must map to DD-1.2 rather than redefine its shared meanings.

The relationship is further clarified by [Application Outcome and Diagnostic Ownership](dd-1-2-execution-outcomes-detailed-design-v01.md#_7-outcome-contract).

### 41.2 DD-1.3 — Managed Project

Managed Project defines authoritative context/scope models consumed during invocation validation and execution.

### 41.3 DD-1.4 — Configuration Resolution

Configuration defines effective configuration and provenance consumed by command validation and execution.

### 41.4 DD-1.5 — Application Engine

Application Engine defines command registration/dispatch ownership, use-case execution coordination, policy sequencing, capability coordination, final acceptance, and construction of the canonical DD-1.2 outcome using the invocation request/control contracts defined here.

### 41.5 DD-2 capability designs

Capability designs define provider-neutral technical evidence. They shall map local failure/diagnostic vocabularies to DD-1.2 and shall not rely on this invocation document as an alternative outcome taxonomy.

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

A Version 1 implementation conforms to this Detailed Design only if:

1. all supported adapters enter AppManager through the same canonical application invocation semantics;
2. commands use stable canonical identities and an authoritative catalogue;
3. unknown commands and unavailable commands are represented distinctly;
4. explicit input, host context, resolved context, and effective configuration remain distinguishable;
5. validation is completed before consequential effects depend upon unvalidated prerequisites;
6. authorization requirements are evaluated by application semantics and represented as explicit evidence;
7. Headless invocation terminates deterministically when required interaction cannot be satisfied;
8. preview projections cannot be confused with applied operations;
9. progress/events remain observational and do not determine final success;
10. cancellation request coordination does not falsely guarantee rollback or define a competing terminal model;
11. final caller-visible outcomes are projections of canonical DD-1.2 AppManager-level acceptance rather than provider exit status or an invocation-owned result taxonomy;
12. failure, cancellation, partial completion, diagnostics, warnings, and known consequential effects remain structurally representable without redefining DD-1.2;
13. one invocation cannot silently inherit mutable intent or authorization from another;
14. sensitive information is minimized before crossing the invocation boundary;
15. no adapter, provider, transport, or host integration becomes a parallel application authority or a parallel outcome/diagnostic authority.

## 44. Version 1 Detailed Design Baseline

This document establishes the Version 1 Detailed Design baseline for Application Invocation.

It deliberately fixes the permanent invocation, interaction, control, and projection seams while leaving canonical shared outcome/diagnostic semantics to DD-1.2 and concrete Node.js/TypeScript types, modules, serialization, process topology, transport, libraries, and wiring to Implementation Specifications.

The resulting boundary is intended to remain valid if AppManager later adds new interaction adapters, new transports, new providers, or replaces parts of the implementation runtime, provided the approved Design, Functional, Detailed Design, clarification, and ADR authorities remain unchanged.
