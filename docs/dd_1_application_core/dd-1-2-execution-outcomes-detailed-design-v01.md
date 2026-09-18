# DD-1.2 — AppManager Execution Outcomes and Diagnostics Detailed Design

> **Detailed Design ID:** DD-1.2
>
> **Design family:** DD-1 — Application Core

> **Status:** Version 1 Detailed Design Specification
>
> **Detailed Design authority:** This document is the single canonical Detailed Design authority for shared AppManager execution outcomes, diagnostics, warnings, progress, cancellation, partial completion, consequential-effect reporting, provider-result normalization, and the shared semantic rules governing their composition. It refines, but does not override, the root Design Specification or Functional Specifications.
>
> **Governing sources:** [Project Documentation Guide](../project-documentation-guide-v01.md), [AppManager Design Specification](../appmanager-design-specification-v01.md), [docs/functional/application-invocation-functional-specification-v01.md](../functional/application-invocation-functional-specification-v01.md)
>
> **Planning source:** [Detailed Design Register](../project_management/detailed-design-register-v01.md)
>
> **Preceding Detailed Design:** [DD-1.1 — Application Invocation](dd-1-1-application-invocation-detailed-design-v01.md)
>
> **Related clarification:** [Application Outcome and Diagnostic Ownership](dd-1-2-execution-outcomes-detailed-design-v01.md#_7-outcome-contract)
>
> **Related Functional authorities:** all domain Functional Specifications where command-specific success, failure, partial completion, diagnostics, progress, cancellation, preview, safety, or effect-reporting semantics are defined.

## 1. Purpose

This specification defines the shared internal contracts by which AppManager represents technical execution evidence and converts it into coherent application-level outcomes.

It establishes one permanent canonical semantic result model for the Application Engine, domain use cases, shared capabilities, invocation boundary, adapters, and future integrations to consume rather than allowing each domain, capability, provider, or invocation surface to invent incompatible success flags, error shapes, diagnostic taxonomies, warning conventions, cancellation representations, effect models, or partial-success semantics.

The central design rule is:

> **A provider result is evidence about execution; an AppManager outcome is an application decision.**

A second governing rule is:

> **Technical completion, application acceptance, and presentation are distinct stages and must remain distinguishable.**

A third governing rule is:

> **Failure or cancellation must describe known consequential state; neither implies rollback unless rollback is explicitly guaranteed by the owning use case.**

A fourth ownership rule follows:

> **DD-1.2 owns shared outcome and diagnostic semantics once; consuming designs project, compose, map, or refine them but do not recreate competing base contracts.**

DD-1.1 Application Invocation owns the caller-facing invocation/control and projection boundary. It consumes this canonical model and may define invocation-specific codes or projection details only by mapping them to the semantics defined here.

## 2. Scope

This design owns permanent internal contracts for:

- normalized execution status;
- canonical application-level outcome status;
- the shared final outcome envelope semantics;
- domain-specific result payload attachment;
- canonical diagnostics and warnings;
- diagnostic severity and broad category taxonomy;
- causal and contextual relationships among diagnostics;
- progress and execution events;
- cancellation observation and completion semantics;
- partial completion;
- skipped, no-op, and already-satisfied states where semantically meaningful;
- consequential-effect reporting;
- changed-resource reporting;
- preview/proposed-change reporting;
- provider/capability execution evidence;
- provider-result normalization;
- failure categorization and mapping into canonical diagnostics;
- recovery guidance;
- retryability evidence without implicit retry authority;
- outcome aggregation for multi-stage and multi-target operations;
- sensitive-information minimization;
- machine-consumable and human-presentable separation;
- correlation between execution evidence, events, diagnostics, and final outcomes;
- cross-domain conformance rules for result production and consumption.

This design does not own domain-specific acceptance policy, command-specific result payload semantics, invocation transport/serialization, or presentation rendering.

## 3. Out of Scope

The following are intentionally outside this Detailed Design:

- domain-specific definitions of what constitutes success for an individual use case;
- concrete TypeScript `interface`, `type`, `enum`, `class`, or error declarations;
- source paths and module boundaries;
- JSON or other serialization schemas;
- transport framing;
- logging framework configuration;
- telemetry backend selection;
- terminal formatting, colours, icons, spinners, dialogs, or GUI widgets;
- concrete exception classes;
- provider-specific SDK exception hierarchies;
- concrete tracing libraries;
- persistence of historical execution records unless a later specification requires it;
- concrete retry algorithms;
- concrete transaction or rollback mechanisms;
- domain-specific compensation logic;
- implementation-specific cancellation primitives;
- process exit-code mapping.

These belong to domain Detailed Design or Implementation Specifications as appropriate.

## 4. Architectural Position

The execution-outcome model sits between technical execution and invocation-facing delivery.

```text
command / use case
      |
      v
capability coordination
      |
      v
specialist execution / providers
      |
      v
technical evidence
      |
      v
+---------------------------------------+
| canonical DD-1.2 semantic model       |
|                                       |
| normalize evidence                    |
| classify/map diagnostics              |
| record effects                        |
| represent partial state               |
| preserve cancellation state           |
| support application interpretation    |
+------------------+--------------------+
                   |
                   v
          Application Engine
      application acceptance
                   |
                   v
       canonical AppManager outcome
                   |
                   v
      DD-1.1 invocation projection
                   |
                   v
       adapter / automation caller
```

This model is shared infrastructure. It must not become an alternative policy engine, and the invocation boundary must not become an alternative semantic outcome authority.

## 5. Responsibility Model

The design is decomposed into the following permanent responsibilities:

1. **Execution Evidence Contract** — represents bounded technical facts returned from capabilities or providers.
2. **Diagnostic Contract** — owns the canonical AppManager diagnostic structure, severity model, broad taxonomy, warnings, notices, and recovery guidance semantics.
3. **Effect Contract** — represents consequential resources or state known to have changed, been created, deleted, skipped, or proposed.
4. **Progress Event Contract** — represents meaningful execution progression without conflating progress with completion.
5. **Cancellation State Contract** — represents requested, observed, stopping, and completed cancellation states where relevant.
6. **Outcome Contract** — owns the canonical shared envelope semantics representing the Application Engine's final accepted status and domain result payload attachment.
7. **Outcome Aggregator** — combines child/stage/target results while preserving information rather than flattening it into a Boolean.
8. **Provider Result Normalizer** — converts provider-native results and failures into bounded AppManager execution evidence.
9. **Outcome Interpreter** — applies owning use-case semantics to normalized evidence and determines AppManager-level acceptance.
10. **Outcome Projection Boundary** — defines the semantic obligations that DD-1.1 and adapters must preserve when exposing canonical outcome information without making presentation or transport structures authoritative.

These are logical responsibilities, not a requirement for one implementation class per responsibility.

## 6. Core Status Model

### 6.1 Status layers

AppManager shall distinguish at least three status layers:

1. **technical execution status** — what a delegated mechanism reports about its bounded work;
2. **application interpretation status** — how the owning use case interprets that evidence;
3. **final invocation status** — the externally visible AppManager outcome after application-level acceptance and projection through DD-1.1.

A provider's `success` cannot be copied directly into the final invocation status without interpretation.

### 6.2 Final application outcome states

The canonical shared model shall support at least:

| Status | Meaning |
|---|---|
| `success` | AppManager accepts the requested intent as successfully satisfied |
| `failure` | AppManager does not accept the requested intent as successfully completed |
| `partial_success` | Some requested consequential work succeeded but the complete intent was not satisfied |
| `cancelled` | Execution stopped because cancellation was requested/observed and the use case accepts cancellation as the terminal state |

The shared model may additionally represent subordinate target/stage states such as:

- `skipped`;
- `no_op`;
- `already_satisfied`;
- `not_attempted`;
- `unsupported`;
- `unavailable`;
- `rejected`.

These subordinate states must not silently become new top-level success semantics without owning-use-case definition.

### 6.3 No Boolean collapse

Internal result contracts shall not reduce all execution semantics to a single Boolean `success` value.

A Boolean may be derived at a presentation or compatibility boundary where necessary, but the canonical internal model must retain the richer status and evidence.

## 7. Outcome Contract

### 7.1 Canonical logical outcome shape

#### DD-OUTCLAR-001 — One canonical semantic outcome {#dd-outclar-001}

A final AppManager outcome shall be capable of representing:

| Field family | Purpose |
|---|---|
| invocation identity | correlates outcome to invocation/events |
| command identity | identifies the owning use case |
| final status | success, failure, partial success, cancellation |
| result payload | domain/use-case-specific structured result |
| diagnostics | application-level problems/notices |
| warnings | non-fatal conditions requiring attention |
| effects | known consequential state changes |
| proposed effects | preview/dry-run proposed changes |
| child/target results | structured subordinate outcomes when required |
| cancellation information | cancellation facts where relevant |
| execution evidence references | bounded supporting technical facts |
| recovery guidance | safe next actions where determinable |
| timing/correlation metadata | bounded execution context where useful |

This is the canonical semantic field-family model. DD-1.1 may project, serialize, rename, or omit non-required caller detail at its boundary, but shall not define a second semantic outcome envelope.

Concrete field names and language-level types belong to Implementation Specifications.

### 7.2 Result payload

The result payload is owned by the use case or domain and may carry domain-specific information.

The payload must not redefine shared status, diagnostics, warning, cancellation, or effect semantics.

A domain shall extend the shared model by composition rather than create a competing result envelope.

### 7.3 Outcome immutability

Once a final application outcome has been accepted and published as terminal, it shall be treated as immutable for that invocation.

Subsequent events may describe external changes after completion, but they must not retroactively rewrite the historical terminal outcome.

## 8. Execution Evidence Contract

### 8.1 Purpose

Execution evidence captures technical facts from a bounded capability or provider before application-level interpretation.

Examples include:

- process exit status;
- Git operation result;
- filesystem write result;
- parser findings;
- AI provider response status;
- test/lint/typecheck findings;
- Nuxt tool output;
- documentation renderer result.

### 8.2 Evidence properties

Execution evidence shall be:

- bounded to the delegated responsibility;
- attributable to its producing capability/provider;
- distinguishable from application acceptance;
- structured where the capability contract can provide structure;
- safe to inspect without requiring provider-native exception types;
- capable of carrying provider detail where diagnostically useful without making that detail the AppManager semantic contract.

### 8.3 Provider-native data

Provider-native response objects, exceptions, stack traces, stdout/stderr blobs, API payloads, or SDK-specific result objects must not escape directly as the canonical AppManager outcome.

They may be retained as bounded evidence or debugging detail when safe and appropriate.

### 8.4 Evidence lifecycle

Evidence may be produced incrementally during execution, but only the owning Application Engine/use case may determine the final application outcome.

## 9. Diagnostic Model

### 9.1 Diagnostic purpose

A diagnostic is a structured explanation of a condition that affects or may affect AppManager execution, acceptance, recovery, or user understanding.

#### DD-OUTCLAR-004 — One application taxonomy {#dd-outclar-004}

This section owns the shared AppManager diagnostic taxonomy. Consumers use its categories directly, define documented subcategories, or supply technical evidence that the owning interpreter maps to an application diagnostic. None of these creates another application-wide taxonomy.

Diagnostics shall not depend on prose alone for their machine-visible meaning.

### 9.2 Diagnostic structure

A diagnostic shall be capable of carrying:

- stable category/code;
- severity;
- concise application-level summary;
- optional detailed explanation;
- affected command, stage, target, resource, or capability where relevant;
- causal relationship to another diagnostic where useful;
- bounded provider detail where useful;
- recovery guidance where safe and determinable;
- retryability evidence where known;
- sensitivity/redaction classification where needed.

### 9.3 Diagnostic severity

The common model should support at least:

- `info` — relevant execution information;
- `warning` — non-fatal condition requiring attention;
- `error` — condition contributing to unsuccessful execution or acceptance;
- `fatal` — condition preventing meaningful continuation of the current execution path.

Severity does not by itself determine the final application outcome. The owning use case applies acceptance semantics.

### 9.4 Canonical diagnostic categories

The canonical cross-application taxonomy shall support broad machine-readable categories sufficient for cross-domain handling, including where applicable:

- invalid invocation;
- unknown command;
- unavailable command/capability;
- missing required input;
- invalid configuration;
- managed-project resolution failure;
- scope violation;
- authorization/confirmation failure;
- unsupported operation;
- resource not found;
- resource conflict;
- stale state/concurrent modification;
- external tool/provider unavailable;
- authentication/authorization failure at provider boundary;
- rate limiting/quota;
- timeout;
- cancellation;
- parse/validation failure;
- transformation failure;
- process/tool failure;
- network/transport failure;
- application acceptance failure;
- internal invariant violation.

#### DD-OUTCLAR-006 — Refinement preserves parent meaning {#dd-outclar-006}

Invocation, domain and capability refinements retain the parent category's meaning and explicitly identify that parent where programmatic cross-domain interpretation matters.

### 9.5 Diagnostic codes

Stable machine-readable diagnostic codes should be defined where callers or tests require programmatic distinction.

Codes must represent AppManager meaning rather than third-party exception class names.

Provider-native codes may be attached as evidence but not substituted for the AppManager code.

A capability-specific failure code, provider classification, or domain finding is not automatically a new canonical diagnostic category. It becomes application-facing diagnostic meaning only when mapped into this model by the relevant capability/use-case boundary.

## 10. Warnings

Warnings are diagnostics that do not by themselves require final failure.

A warning shall remain structurally distinguishable from an error.

Examples include:

- deprecated resource usage;
- recoverable provider fallback;
- optional metadata omission;
- partial information availability;
- non-critical unsupported artefact;
- safe skip behavior;
- policy-relevant but non-blocking condition.

A use case may define particular warnings as acceptance blockers, but that rule belongs to the owning use case rather than the warning infrastructure.

## 11. Human-Presentable Messages

Structured semantics and human-readable explanation shall coexist without conflation.

A diagnostic or outcome may include human-presentable summary/detail fields, but:

- callers must not need to parse prose to determine status/category;
- localization or wording changes must not alter semantics;
- presentation adapters may reformat or replace wording while preserving structured meaning;
- terminal colouring, GUI icons, or IDE notification classes are presentation concerns.

## 12. Consequential Effects

### 12.1 Effect purpose

An effect records consequential state that AppManager knows was changed, created, deleted, moved, committed, pushed, generated, or otherwise materially affected by execution.

Effects are important for failure, partial-success, and cancellation recovery.

### 12.2 Effect structure

An effect shall be capable of representing:

- effect kind;
- target/resource identity;
- pre-operation state reference where available and useful;
- resulting state reference where available and useful;
- stage/target association;
- whether the effect is confirmed, best-effort-known, or uncertain;
- whether the effect was proposed only or actually applied;
- whether compensation/rollback was attempted or completed where applicable.

### 12.3 Effect kinds

Shared effect kinds may include:

- created;
- updated;
- deleted;
- moved/renamed;
- generated;
- executed;
- staged;
- committed;
- pushed/published;
- cleaned/removed;
- configuration/resource persisted.

Domain designs may refine these categories.

### 12.4 No false rollback

An operation that fails after recording effects shall preserve those effects in the final outcome where material.

A compensation attempt shall be reported separately from the original effect.

Rollback may be claimed only where the owning design guarantees and verifies it.

## 13. Proposed Effects and Preview

Preview/dry-run data shall be structurally distinct from applied effects.

The model shall support proposed effects containing:

- intended resource/target;
- proposed operation;
- bounded before/after or change-plan information where available;
- warnings or uncertainty;
- required authorization state where applicable.

A proposed effect must never be represented as an applied effect merely because planning succeeded.

## 14. Partial Completion

### 14.1 Purpose

Partial completion is a first-class state, not an error-message convention.

It applies when a multi-stage or multi-target operation performs meaningful consequential work but does not fully satisfy the requested intent.

### 14.2 Child result model

A parent outcome may contain child results keyed by stage, target, repository, file, layer, command sub-operation, or other stable identity.

Each child result should preserve its own:

- status;
- diagnostics;
- warnings;
- effects;
- result payload where needed.

### 14.3 Aggregation rule

Outcome aggregation must not use naive rules such as "any success means success" or "first failure discards later state".

The owning use case shall define acceptance rules, while the shared aggregator preserves all child evidence and supports determination of:

- full success;
- partial success;
- full failure;
- cancellation with prior effects;
- no-op/already-satisfied completion where semantically allowed.

### 14.4 Ordering

Where stage or target ordering matters for recovery or interpretation, the outcome model shall preserve that ordering or explicit dependency relationship.

## 15. No-Op, Already-Satisfied, Skipped, and Not-Attempted States

These states may be useful within child/stage results and may sometimes be valid successful completion modes.

They shall remain distinguishable:

- **no-op** — execution determined no consequential effect was necessary;
- **already-satisfied** — requested end state was already true;
- **skipped** — a target/stage was deliberately omitted under defined semantics;
- **not-attempted** — execution never reached the target/stage.

The owning use case determines whether each state contributes to overall success.

## 16. Progress Events

### 16.1 Purpose

Progress events expose meaningful execution state without making presentation behavior part of the application contract.

### 16.2 Event structure

A progress event shall be capable of carrying:

- invocation identity;
- event identity/sequence information where ordering matters;
- event kind;
- command/stage/target association;
- current state or progress measure where meaningful;
- structured message/diagnostic reference;
- timestamp or monotonic ordering information where required;
- bounded payload specific to the event kind.

### 16.3 Event kinds

Common event classes may include:

- execution started;
- stage started;
- stage completed;
- target started;
- target completed;
- progress update;
- warning emitted;
- diagnostic emitted;
- cancellation requested;
- cancellation observed;
- compensation started/completed;
- execution finishing;
- execution completed.

### 16.4 Progress is not success

No progress event, including a final provider completion event, may by itself establish AppManager application success.

Only the terminal AppManager outcome carries final acceptance status.

### 16.5 Event loss

Where event delivery is best-effort, loss of non-essential progress events must not alter execution semantics.

Events that are required to reconstruct final consequential state must instead be represented in the terminal outcome or durable execution state owned elsewhere.

## 17. Cancellation Model

### 17.1 Cancellation phases

Where cancellation is supported, the internal model should distinguish:

1. cancellation requested;
2. cancellation propagated;
3. cancellation observed by the current execution responsibility;
4. stopping/cleanup in progress where relevant;
5. terminal cancelled outcome.

### 17.2 Cooperative cancellation

Cancellation is cooperative unless a lower-level capability explicitly guarantees stronger termination semantics.

A cancellation request is not proof that execution has stopped.

### 17.3 Effects before cancellation

The terminal cancelled outcome shall preserve known effects completed before cancellation.

If execution cannot determine whether an in-flight external operation completed, that uncertainty shall be represented explicitly rather than guessed.

### 17.4 Cancellation versus failure

Cancellation shall remain distinguishable from ordinary failure.

If a cancellation attempt itself fails and execution continues or terminates for another reason, the owning use case shall determine the final status while preserving the cancellation diagnostics/evidence.

### 17.5 Rollback

Cancellation does not imply rollback.

Compensation or rollback, where supported, is a separate operation/stage and shall have its own evidence and effect reporting.

## 18. Provider Result Normalization

### 18.1 Boundary

Every shared capability provider shall expose results through an AppManager-oriented capability contract before those results reach domain/application outcome interpretation.

### 18.2 Normalization responsibilities

A provider normalizer should convert provider-native execution information into:

- technical status;
- structured evidence;
- normalized technical diagnostics/evidence;
- provider availability state;
- retryability/transience evidence where safely known;
- timing/termination facts where useful;
- bounded provider detail for debugging.

#### DD-OUTCLAR-005 — Provider categories remain evidence {#dd-outclar-005}

Provider exception classes, exit reasons, API codes, parser states and tool findings remain technical evidence. The owning interpretation maps them into [§9](#_9-diagnostic-model); preservation as evidence alone does not make them application categories.

### 18.3 Provider failures

Provider failure normalization shall distinguish, where meaningful:

- unavailable provider/tool;
- unsupported operation;
- authentication failure;
- authorization failure;
- invalid request;
- rate limit/quota;
- timeout;
- transport/network failure;
- provider-side execution failure;
- malformed/invalid provider response;
- cancellation/termination;
- unknown provider failure.

These are technical evidence classes. They may map to one or more canonical Section 9 diagnostic categories depending on application context; they do not expand the canonical taxonomy merely by existing.

### 18.4 No provider policy escalation

A provider normalizer may classify evidence but must not decide whether AppManager should retry, fall back, continue, skip, partially succeed, or fail the application use case unless that behavior is explicitly delegated by an owning higher-level contract.

## 19. Application-Level Interpretation

### 19.1 Authority

The Application Engine/use-case layer owns interpretation of normalized execution evidence.

Interpretation determines whether technical evidence satisfies:

- requested intent;
- managed scope;
- application policy;
- safety rules;
- validation requirements;
- domain acceptance criteria;
- workflow sequencing requirements.

### 19.2 Technical success can be application failure

Examples include:

- a provider writes a syntactically valid file outside authorized scope;
- an external tool exits successfully but required output is absent;
- an AI provider returns valid text that fails application validation;
- Git push technically succeeds for one repository while a required coordinated multi-repository operation remains incomplete.

In these cases, AppManager may correctly return failure or partial success.

### 19.3 Technical failure can be non-fatal

Examples include:

- an optional provider is unavailable but a deterministic fallback exists;
- one optional target is skipped under defined policy;
- an already-absent cleanup target reports not found and the use case defines this as already satisfied.

The owning use case decides whether such evidence is fatal, recoverable, ignorable, or part of partial success.

## 20. Outcome Aggregation

### 20.1 Aggregator role

The shared Outcome Aggregator shall preserve subordinate results and provide mechanisms for an owning use case to derive a parent outcome.

It shall not impose one universal acceptance algorithm across all domains.

### 20.2 Aggregation inputs

Aggregation may consume:

- stage outcomes;
- target outcomes;
- capability evidence;
- effects;
- diagnostics;
- cancellation state;
- owning-use-case acceptance rules.

### 20.3 Aggregation invariants

Aggregation must:

- preserve material failures;
- preserve material effects;
- preserve cancellation state;
- not convert partial completion into unconditional success;
- not discard skipped/not-attempted targets where relevant;
- not infer rollback from failure;
- not infer application success from provider success count;
- remain deterministic for equivalent ordered inputs and policy.

## 21. Recovery Guidance

Diagnostics/outcomes may provide structured recovery guidance when AppManager can safely determine a next action.

Recovery guidance may include:

- correct invalid input;
- resolve configuration;
- acquire authorization;
- re-run after resolving a conflict;
- inspect partial effects;
- manually reconcile external state;
- retry a safely repeatable sub-operation;
- use an alternate provider where policy permits.

Guidance must not imply that a retry is safe unless the owning use case permits it.

## 22. Retryability and Repetition Evidence

The result model may expose evidence such as:

- transient failure suspected;
- provider explicitly indicates retry-after;
- operation known not to have started;
- operation may have partially completed;
- safe repetition unknown.

This evidence does not grant retry authority.

The Application Engine/use case determines whether retry, resume, fallback, or repetition is allowed.

## 23. Concurrency and Stale-State Diagnostics

The outcome model shall support structured reporting of concurrency-related conditions such as:

- source changed since inspection;
- repository state changed since planning;
- target resource no longer exists;
- target now exists unexpectedly;
- configuration/context snapshot became stale;
- overlapping invocation conflict;
- provider-side optimistic-concurrency failure.

Such conditions should carry enough bounded identity/version evidence for the owning use case to decide whether to reject, re-resolve, re-plan, or retry.

Where narrower stale/conflict codes are defined by a capability, they shall map into the canonical Section 9 taxonomy rather than becoming independent cross-application categories.

## 24. Sensitive Information and Redaction

### 24.1 Principle

Diagnostics, evidence, events, and outcomes shall expose the minimum information necessary for safe understanding and recovery.

### 24.2 Sensitive values

The shared model must support marking or handling information such as:

- credentials;
- access tokens;
- secrets;
- private keys;
- sensitive environment values;
- provider authorization headers;
- private project data where policy restricts disclosure.

### 24.3 Redaction boundary

Provider-native errors shall be normalized before presentation. Raw payloads must not be assumed safe to expose.

Redaction is not merely a presentation concern when structured output may be consumed by logs, CI, IDEs, automation, or external integrations.

## 25. Correlation and Causality

### 25.1 Invocation correlation

All significant outcomes, diagnostics, effects, and events shall be correlatable to the invocation that produced them.

### 25.2 Stage/target correlation

Where multi-stage or multi-target execution occurs, subordinate evidence shall be correlatable to the relevant stage/target.

### 25.3 Causal relationships

Diagnostics may reference causal diagnostics or provider evidence so callers can distinguish root cause from secondary effects without relying on stack-trace parsing.

### 25.4 Nested use cases

Where one AppManager use case coordinates another through an approved internal boundary, correlation should preserve parent/child execution relationships without merging independent authority boundaries.

## 26. Preview and Applied Outcome Separation

The final result model shall clearly distinguish:

- plan/preview successfully produced;
- operation authorized but not yet executed;
- operation execution started;
- operation applied;
- operation partially applied;
- operation cancelled;
- operation failed.

A successful preview does not imply successful future execution.

## 27. DD-1.1 Invocation Projection

### 27.1 Structured projection

DD-1.1 Application Invocation consumes the canonical AppManager outcome defined here and projects it to the caller.

Invocation/adapters may:

- render concise prose;
- show tables/trees;
- map severity to UI affordances;
- stream progress;
- select appropriate exit codes at implementation level;
- serialize machine-readable representations;
- omit non-required implementation detail where doing so does not hide material application state.

### 27.2 Prohibited projection behavior

DD-1.1/adapters shall not:

- define a second shared outcome envelope or diagnostic taxonomy;
- reinterpret provider success as application success;
- suppress material partial effects;
- convert cancellation to success;
- treat warnings as failures unless the application outcome says so;
- infer retries;
- expose secrets from bounded provider evidence;
- create adapter-specific final status semantics.

The mapping/projection relationship is further defined by [Application Outcome and Diagnostic Ownership](dd-1-2-execution-outcomes-detailed-design-v01.md#_7-outcome-contract).

## 28. Compatibility and Evolution

### 28.1 Stable semantic core

The canonical shared outcome contract shall evolve by preserving the semantic meaning of established status, diagnostic, effect, and cancellation concepts.

### 28.2 Extensible diagnostics

New diagnostic categories should be added to the canonical taxonomy only when the distinction has genuine cross-application semantic value.

Invocation, domain, capability, or provider-specific distinctions should normally use narrower codes/subcategories/evidence classes mapped to an existing canonical category. Additive refinements shall not silently create a second broad taxonomy.

### 28.3 Extensible payloads

Domain result payloads and provider evidence may evolve independently so long as the shared envelope remains coherent.

### 28.4 Unknown fields/categories

Future machine-facing representations should permit older consumers to tolerate additive detail where safe, while unknown final status values must fail safely rather than be guessed as success.

Separate internal and transport types are permitted; semantic ownership does not require a single interface, module, inheritance hierarchy or serialized format. Tests must demonstrate equivalent shared meanings across the [DD-1.1 projection boundary](dd-1-1-application-invocation-detailed-design-v01.md#_22-invocation-outcome-projection-contract). Capability-specific evidence types remain valid. Concrete compatibility/versioning mechanisms belong to Implementation Specifications.

## 29. Testability Requirements

The design shall permit deterministic testing of:

- each final status;
- canonical diagnostic severity/category mapping;
- narrower invocation/domain/capability/provider code-to-category mapping;
- provider normalization;
- technical-success/application-failure cases;
- technical-failure/application-success-or-partial cases where allowed;
- partial-success aggregation;
- effect preservation after failure;
- cancellation with prior effects;
- no-op/already-satisfied semantics;
- preview versus applied effects;
- recovery guidance;
- sensitive-value redaction;
- child-result ordering/correlation;
- DD-1.1 projection without semantic reinterpretation;
- retryability evidence without automatic retry;
- stale-state/concurrency diagnostics.

Tests should not require real external providers where normalized provider fixtures or test doubles can satisfy the permanent contract.

## 30. Application Engine Integration Contract

The Application Engine shall consume this design as follows:

1. receive canonical invocation request from DD-1.1;
2. dispatch the owning use case;
3. obtain normalized capability/provider evidence from shared capabilities;
4. accumulate diagnostics, warnings, effects, and subordinate results under this canonical model;
5. apply domain/application acceptance rules;
6. determine terminal AppManager status;
7. construct the canonical final outcome defined by this specification;
8. return that outcome through the DD-1.1 projection/delivery boundary.

The result model supports this authority; it does not replace it.

## 31. Relationship to Other Application Core Designs

### 31.1 DD-1.1 Application Invocation

DD-1.1 owns invocation requests, discovery, interaction capability, authorization-evidence transport, event/cancellation control, and caller-facing projection/delivery.

It shall consume the canonical outcome/diagnostic model defined here rather than maintain a separate final-outcome envelope or shared diagnostic taxonomy.

### 31.2 Managed Project Detailed Design

DD-1.3 provides structured context/scope resolution failures and scope evidence that this outcome model can represent without redefining scope semantics.

### 31.3 Configuration Resolution Detailed Design

DD-1.4 provides configuration-resolution failures, provenance, and validation evidence that this model can carry without owning precedence semantics.

### 31.4 Application Engine Detailed Design

DD-1.5 defines where and how application-level interpretation and acceptance occur, using the outcome contracts defined here.

## 32. Relationship to Shared Capabilities

Every DD-2 shared capability shall define its technical evidence in a way that can be normalized into this canonical shared model.

In particular:

- Resource Access reports bounded resource operation evidence;
- Process Execution reports normalized process/tool evidence;
- Repository Capability reports repository-operation evidence;
- Source Intelligence reports findings rather than mutation outcomes;
- Source Transformation reports plans, applied changes, validation, stale-state, and partial application evidence;
- AI Capability reports provider/model execution evidence and response validation diagnostics;
- Documentation Capability reports generation/rendering/tool evidence;
- Quality Capability reports structured findings and execution evidence;
- Nuxt Capability reports Nuxt-specific specialist evidence;
- Resource Registry/Template capability reports discovery/validation/rendering evidence.

Capability-specific failure classes, finding kinds, provider states, or diagnostics are local technical/domain vocabularies until explicitly mapped to the canonical diagnostic model. They shall not be described as an alternative shared AppManager taxonomy.

None of those capabilities defines the final AppManager application outcome for a domain use case.

## 33. Domain Design Rules

All DD-3 and DD-4 domain designs shall:

- consume the canonical shared outcome envelope;
- define domain-specific result payloads only where necessary;
- define domain acceptance rules explicitly;
- map capability evidence to application outcomes;
- map domain-specific diagnostic codes/findings to the canonical broad taxonomy where they become application-facing diagnostics;
- preserve partial effects;
- preserve cancellation semantics;
- preserve diagnostics structurally;
- avoid domain-specific duplicate base error/result envelopes;
- avoid provider-native result leakage;
- define no-op/already-satisfied behavior where relevant;
- state retry/repetition safety where relevant.

## 34. Security and Safety Invariants

The following invariants are mandatory:

1. final success is determined by AppManager application acceptance, not a provider Boolean;
2. material effects are not hidden by failure or cancellation;
3. rollback is never implied without explicit verified semantics;
4. warnings remain distinguishable from errors;
5. provider-native secrets/payloads are not exposed by default;
6. raw provider exceptions are not the application error contract;
7. partial completion is not collapsed into unconditional success;
8. cancellation request is not equivalent to cancellation completion;
9. preview/proposed changes are not represented as applied changes;
10. retryability evidence does not confer retry authority;
11. adapters do not reinterpret final semantics;
12. unknown/ambiguous terminal states fail safe rather than defaulting to success;
13. there is one canonical shared AppManager outcome envelope semantic model;
14. there is one canonical broad AppManager diagnostic taxonomy;
15. local capability/domain/invocation vocabularies refine or map to the canonical model rather than compete with it.

## 35. Traceability to Functional Requirements

This design primarily realises the Application Invocation Functional Specification as follows:

| Functional requirements | Detailed Design realization |
|---|---|
| `FR-INV-021` | structured machine-consumable canonical outcome contract |
| `FR-INV-025`–`FR-INV-026` | proposed/preview effects distinct from applied effects |
| `FR-INV-027`–`FR-INV-029` | structured progress/event model independent of presentation |
| `FR-INV-030`–`FR-INV-032` | cooperative cancellation state and effect preservation |
| `FR-INV-033`–`FR-INV-037` | canonical common final status and result envelope |
| `FR-INV-038`–`FR-INV-040` | canonical diagnostics, warnings, sensitive-information minimization |
| `FR-INV-041`–`FR-INV-043` | provider normalization and application-level interpretation |
| `FR-INV-044`–`FR-INV-047` | failure semantics, effect reporting, no false rollback, recovery guidance |
| `FR-INV-048`–`FR-INV-049` | retryability evidence without implicit retry authority |
| `FR-INV-050`–`FR-INV-051` | invocation correlation and concurrency/stale-state diagnostics |

This specification also provides the shared Detailed Design mechanism required by domain Functional Specifications whenever they require structured success/failure, partial success, warnings, cancellation, diagnostics, effect reporting, or provider-result interpretation.

## 36. Traceability to Root Design and ADR-0001

The principal upward traceability is:

| Design concern | Root Design responsibility |
|---|---|
| final application authority | Application Engine architecture |
| delegated execution | capability boundaries/providers |
| structured outcomes | invocation and cross-cutting constraints |
| presentation independence | interaction/adaptor architecture |
| progress/cancellation | invocation contract plus canonical outcome semantics here |
| diagnostic safety | security/safety constraints |
| provider independence | capability boundary architecture |

ADR-0001 selects Node.js/TypeScript for Version 1 implementation but does not require these permanent contracts to expose Node.js- or TypeScript-specific primitives.

The Detailed Design therefore deliberately avoids making `Error`, `AbortSignal`, process exit codes, Node streams, Promise rejection shapes, or concrete TypeScript discriminated unions part of the normative architecture. Implementation Specifications may map this design to those mechanisms where appropriate.

## 37. Conformance Criteria

An AppManager component conforms to this Detailed Design only if:

1. it distinguishes provider/capability evidence from final AppManager outcomes;
2. it uses the canonical shared final status/outcome model rather than an incompatible private success/error envelope;
3. it preserves diagnostics structurally and maps application-facing categories/codes to the canonical taxonomy;
4. it preserves warnings separately from failures;
5. it preserves known consequential effects after failure, partial success, or cancellation;
6. it distinguishes proposed effects from applied effects;
7. it represents partial completion explicitly where the Functional layer requires it;
8. it does not imply rollback without a verified guarantee;
9. it does not expose provider-native failures as the canonical application error contract;
10. it supports application-level interpretation before final success/failure determination;
11. it keeps cancellation distinguishable from failure and from mere cancellation request;
12. it supports invocation/stage/target correlation where needed;
13. it protects sensitive information in structured outputs as well as presentation;
14. it does not grant retry authority merely because a provider marks a failure transient;
15. DD-1.1/adapters can project its results without needing to reinvent application semantics;
16. invocation/domain/capability/provider-specific vocabularies do not become competing shared diagnostic taxonomies.

## 38. Downstream Implementation Requirements

Implementation Specifications shall map this design to concrete Version 1 structures, including as appropriate:

- canonical TypeScript status/result/diagnostic/effect/event types;
- discriminated unions or equivalent result modelling;
- diagnostic-code/subcategory mapping mechanisms;
- error normalization utilities;
- provider adapters;
- correlation identifiers;
- event publication mechanisms;
- cancellation primitives;
- redaction utilities;
- result aggregation helpers;
- DD-1.1 adapter serializers/renderers/projection types;
- process exit-code mapping;
- tests and fixtures.

Implementation work must preserve the distinction among provider evidence, application interpretation, canonical final AppManager outcome, and invocation/presentation projection.

## 39. Version 1 Detailed Design Baseline

This document establishes the Version 1 permanent and canonical Detailed Design baseline for shared execution outcomes and diagnostics.

The enduring architectural rule is:

> **Execution mechanisms report facts; AppManager decides what those facts mean.**

This specification is the single semantic owner of the shared result, diagnostic, warning, effect, cancellation, and subordinate-result model that DD-1.1, DD-1.3 through DD-1.5, all DD-2 capability designs, and all domain Detailed Designs shall consume rather than reproduce.
