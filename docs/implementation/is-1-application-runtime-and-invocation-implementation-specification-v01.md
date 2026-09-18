# IS-1 — Application Runtime and Invocation Implementation Specification

> **Document type:** Level 4 Implementation Specification
>
> **Status:** Version 1 implementation baseline
>
> **Implementation ID:** IS-1
>
> **Primary Detailed Designs:** [DD-1.1 — Application Invocation](../dd_1_application_core/dd-1-1-application-invocation-detailed-design-v01.md), [DD-1.2 — Execution Outcomes and Diagnostics](../dd_1_application_core/dd-1-2-execution-outcomes-detailed-design-v01.md), [DD-1.5 — Application Engine](../dd_1_application_core/dd-1-5-application-engine-detailed-design-v01.md)
>
> **Related Detailed Designs:** [DD-1.3 — Managed Project](../dd_1_application_core/dd-1-3-managed-project-detailed-design-v01.md), [DD-1.4 — Configuration Resolution](../dd_1_application_core/dd-1-4-configuration-resolution-detailed-design-v01.md)
>
> **Primary DD contracts:** [Application Outcome and Diagnostic Ownership](../dd_1_application_core/dd-1-2-execution-outcomes-detailed-design-v01.md#_7-outcome-contract), [Application Core Bootstrap Resolution](../dd_1_application_core/dd-1-5-application-engine-detailed-design-v01.md#_8-orchestration-lifecycle)
>
> **Primary Functional authority:** [Application Invocation Functional Specification](../functional/application-invocation-functional-specification-v01.md)
>
> **Runtime decision:** [ADR-0001 — Primary Application Runtime](../project_management/decisions/adr-0001-primary-application-runtime.md)
>
> **Register:** [AppManager Implementation Specification](implementation-specification-v01.md)
>
> **Governing plan:** [Implementation Specification Plan](../project_management/implementation-specification-plan-v01.md)

## 1. Purpose

IS-1 defines the concrete Node.js/TypeScript implementation of AppManager's Version 1 application authority, invocation and canonical outcome boundary.

It combines DD-1.1, DD-1.2 and DD-1.5 because the concrete command catalogue, invocation coordinator, execution-context lifecycle, use-case dispatch, evidence interpretation and final outcome publication must form one coherent application path. Splitting those mechanics into independent runtime subsystems would create exactly the duplicate authority that DD-1 forbids.

The governing implementation rule is:

> **Every supported caller enters one application boundary; the Application Engine establishes authoritative execution context, delegates bounded work, interprets the returned evidence and publishes one canonical AppManager outcome.**

A second rule fixes the Version 1 layering:

> **DD-1.2 semantics are implemented once as the canonical outcome/diagnostic model; DD-1.1 projects that model across the invocation boundary rather than implementing a second result system.**

IS-1 does not make the Engine a monolithic class. It makes application authority, dispatch and final acceptance explicit in concrete modules and contracts.

---

## 2. Scope and Non-Ownership

IS-1 owns concrete implementation for:

- canonical command identity and descriptors;
- authoritative command/use-case catalogue construction and lookup;
- normalized application invocation requests;
- invocation identity and caller correlation;
- interaction-capability declarations;
- invocation structural validation;
- command discovery and availability coordination;
- authorization-evidence representation and validation hand-off;
- preview intent representation;
- invocation-scoped cancellation linkage;
- structured execution events and progress publication;
- invocation-scoped execution-context construction;
- staged coordination of IS-2 Managed Project and IS-3 Configuration Resolution;
- application policy/safety/authorization checkpoints at the Engine boundary;
- dispatch to exactly one owning application use case;
- bounded capability/use-case delegation;
- accumulation and interpretation of technical/domain evidence;
- canonical DD-1.2 diagnostics, warnings, effects and child-result composition;
- final application acceptance;
- canonical AppManager outcome construction;
- invocation-facing outcome projection;
- application-level concurrency/stale-state coordination hooks;
- nested/sub-use-case coordination rules;
- deterministic test seams for the complete application path.

IS-1 does **not** own:

- raw command-line parsing, terminal menus, prompts, colours, spinners or process-exit rendering — IS-22;
- package build, compiled executable, composition-root process wiring or process-signal capture — IS-23;
- Managed Project discovery/topology/scope algorithms — IS-2;
- configuration-source loading, precedence or effective-value resolution — IS-3;
- DD-2 capability mechanisms — IS-4 through IS-13;
- domain-specific use-case algorithms and policy — IS-14 through IS-21;
- provider-native failure taxonomies or result objects;
- direct filesystem, Git, process, Nuxt, AI or external-provider execution.

The Application Engine coordinates those owners without absorbing their internal semantics.

---

## 3. Concrete Module Boundary

The target Version 1 source layout is:

```text
app/
├── application/
│   ├── application.ts
│   ├── application-engine.ts
│   ├── invocation/
│   │   ├── invocation-types.ts
│   │   ├── invocation-normalizer.ts
│   │   ├── invocation-validator.ts
│   │   ├── invocation-coordinator.ts
│   │   ├── invocation-events.ts
│   │   └── authorization-evidence.ts
│   ├── commands/
│   │   ├── command-identity.ts
│   │   ├── command-descriptor.ts
│   │   └── command-catalogue.ts
│   ├── execution/
│   │   ├── execution-context.ts
│   │   ├── use-case.ts
│   │   ├── capability-access.ts
│   │   └── cancellation.ts
│   └── outcomes/
│       ├── outcome-types.ts
│       ├── diagnostics.ts
│       ├── effects.ts
│       ├── outcome-builder.ts
│       ├── outcome-aggregator.ts
│       └── invocation-projection.ts
└── composition/
    └── ... owned by IS-23
```

The layout groups contracts by semantic owner. It does not require one class per file and may be simplified during implementation where the same responsibility remains clear.

`app/application/` is the application-authority implementation boundary. Domain implementations register use cases into it; interaction adapters call into it; capabilities remain dependencies beneath it.

The historical `app/commands/` directory is not retained as the application authority merely because current command classes live there.

---

## 4. Public Application Boundary

IS-23 and IS-22 shall interact with IS-1 through a small application-facing contract. The target shape is structurally equivalent to:

```ts
export interface AppManagerApplication {
  discover(request: DiscoveryRequest): Promise<DiscoveryResult>;
  invoke(request: InvocationRequest): Promise<InvocationProjection>;
  cancel(invocationId: InvocationId): CancellationRequestResult;
}
```

`discover()` and `invoke()` use canonical application values, not raw `process.argv`, Clack prompt results or host widget identifiers.

`cancel()` requests cooperative cancellation. It does not promise rollback and does not itself determine the terminal outcome.

The concrete application object may delegate to `InvocationCoordinator` and `ApplicationEngine`; callers do not need to know that topology.

### 4.1 Process boundary relationship

The IS-23 launcher/composition root shall:

1. obtain process facts;
2. construct IS-22 adapters and the IS-1 application;
3. have an adapter translate raw caller input into `InvocationRequest` or discovery requests;
4. call IS-1;
5. allow IS-22/IS-23 to render/project the returned invocation result and process exit status.

No IS-1 module shall call `process.exit()`.

---

## 5. Canonical Command Identity

Version 1 shall use an explicit domain/name command identity:

```ts
export interface CommandIdentity {
  readonly domain: CommandDomain;
  readonly name: string;
}
```

Its canonical text representation is:

```text
<domain>.<name>
```

Examples are `git.commit` and `app.run`.

The text form is an application identifier, not a TUI label or CLI tokenization rule. IS-22 may accept two CLI tokens (`git commit`) and normalize them to the same identity.

`CommandDomain` shall initially admit the approved Version 1 domains while remaining extensible through explicit domain registration rather than arbitrary provider names.

Identity comparison is exact after normalization. Unknown identities are never approximated, fuzzy-matched or silently substituted.

---

## 6. Command Descriptor and Catalogue

### 6.1 Descriptor

A registered use case shall supply a descriptor structurally equivalent to:

```ts
export interface CommandDescriptor {
  readonly identity: CommandIdentity;
  readonly description: string;
  readonly hidden?: boolean;
  readonly supportsPreview: boolean;
  readonly availability: 'always' | 'contextual';
  readonly interactionRequirements?: InteractionRequirements;
}
```

Human-facing label/icon/menu ordering belongs to IS-22 presentation metadata or a projection of the descriptor. It is not required for canonical identity.

A descriptor may expose stable description text in Version 1; localization keys can be introduced later without changing command semantics.

### 6.2 Catalogue

`CommandCatalogue` shall be constructed explicitly by the composition root from domain/use-case registrations:

```ts
export interface CommandCatalogue {
  get(identity: CommandIdentity): RegisteredUseCase | undefined;
  list(): readonly CommandDescriptor[];
}
```

Registration shall reject duplicate canonical identities. The current behaviour that logs a warning and overwrites an existing command is not conformant because it permits semantic ownership to change with registration order.

Catalogue iteration order shall not be semantic. Discovery may apply a deterministic stable ordering for output, but adapters may present another order without changing command identity.

### 6.3 Registration

IS-23 shall assemble domain registrations explicitly. Importing a command/use-case module shall not mutate a global catalogue.

A domain registration contributes approved `RegisteredUseCase` definitions. Provider operations never self-register as AppManager commands.

---

## 7. Use-Case Contract

Each executable command identity maps to one application use case:

```ts
export interface ApplicationUseCase<TInput = unknown, TResult = unknown> {
  readonly descriptor: CommandDescriptor;
  evaluateAvailability(context: AvailabilityContext): Promise<AvailabilityResult>;
  validate(request: UseCaseValidationRequest<TInput>): Promise<UseCaseValidationResult<TInput>>;
  execute(context: ExecutionContext<TInput>): Promise<UseCaseExecutionResult<TResult>>;
}
```

The exact generic arrangement may change during coding, but the separation of descriptor, availability, validation and execution shall remain visible.

A use case owns its domain workflow and acceptance criteria under the DD-1.5 authority model. It does not publish a competing final result envelope. Its execution result supplies domain result information, normalized evidence, effects and diagnostics for Engine interpretation.

`execute()` shall not receive a presentation adapter. When interaction is required, the Engine/invocation path uses the explicit authorization/input continuation model rather than allowing domain code to prompt directly.

---

## 8. Invocation Request

The normalized Version 1 request shall be structurally equivalent to:

```ts
export interface InvocationRequest {
  readonly invocationId?: InvocationId;
  readonly command: CommandIdentity;
  readonly explicitInput: Readonly<Record<string, unknown>>;
  readonly explicitOptions: Readonly<Record<string, unknown>>;
  readonly targetHints?: readonly InvocationTargetHint[];
  readonly requestedScope?: RequestedScope;
  readonly configurationOverrides?: Readonly<Record<string, unknown>>;
  readonly authorizationEvidence?: readonly AuthorizationEvidence[];
  readonly interaction: InteractionCapabilities;
  readonly preview: PreviewIntent;
  readonly callerCorrelation?: CallerCorrelation;
}
```

The request is treated as immutable after normalization.

`explicitInput` and `explicitOptions` are transport-neutral containers at the shared invocation boundary, not an invitation for domain code to consume unvalidated arbitrary records. The owning use case converts/validates them into its typed input before execution.

Caller-supplied target hints, scope and configuration overrides remain explicitly distinguishable from authoritative values resolved later.

---

## 9. Invocation Identity and Correlation

IS-1 shall assign an invocation identity when a valid one was not supplied through an approved trusted internal path.

Version 1 shall use a UUID generated with Node's `crypto.randomUUID()` for simplicity and collision resistance. The identifier is opaque and has no business meaning.

Caller correlation is stored separately:

```ts
export interface CallerCorrelation {
  readonly id?: string;
  readonly metadata?: Readonly<Record<string, string>>;
}
```

Caller metadata is bounded and non-authoritative. It shall not be copied automatically into diagnostics, logs or provider requests.

All events and the final outcome carry the AppManager invocation identity.

---

## 10. Interaction Capabilities

The request shall describe capabilities rather than adapter class names:

```ts
export interface InteractionCapabilities {
  readonly canRequestAdditionalInput: boolean;
  readonly canAcquireAuthorization: boolean;
  readonly canConsumeEvents: boolean;
  readonly canRequestCancellation: boolean;
  readonly canConsumeStructuredOutcome: boolean;
}
```

Additional capabilities may be added when a real use case requires them.

`mode: 'interactive' | 'headless'` is insufficient as the application contract because future GUI, IDE, CI and agent hosts may expose different combinations of capabilities.

This is the canonical, transport-neutral application-boundary contract. IS-22 declares a separate adapter-local `AdapterCapabilities` type describing presentation/host capabilities and is responsible for projecting it onto this contract; the two are related but distinct interfaces and shall not share a name.

Capabilities do not grant authority. `canAcquireAuthorization: true` means the adapter can ask and return evidence; it does not mean the adapter may approve an action itself.

---

## 11. Invocation Normalization and Structural Validation

IS-22 performs transport-specific parsing. IS-1 then performs transport-neutral normalization and structural validation.

The normalizer shall:

- normalize canonical command identity;
- freeze/copy caller containers sufficiently to prevent later adapter mutation;
- normalize path/reference hints into approved application-facing hint shapes without resolving Managed Project authority;
- normalize interaction capabilities;
- normalize preview intent;
- normalize authorization evidence shape;
- reject values that cannot be represented safely.

Structural validation shall occur before contextual resolution and cover:

- command identity shape;
- bounded input/options container shape;
- mutually incompatible shared invocation options;
- authorization-evidence syntax;
- interaction-capability coherence;
- preview representation;
- caller-correlation bounds.

Expected invalid invocation states return canonical diagnostics; they are not thrown as unclassified runtime exceptions.

---

## 12. Discovery and Availability

### 12.1 Discovery

`discover()` uses the same `CommandCatalogue` as execution.

A discovery request may contain sufficient host/project hints to permit contextual availability evaluation. Where context is insufficient, availability is returned as `not_evaluated`, not falsely `unavailable`.

Discovery shall return application descriptors or lossless projections of them. Provider executables, package scripts and arbitrary capability operations are not discoverable commands.

### 12.2 Availability result

```ts
export type AvailabilityResult =
  | { readonly state: 'available' }
  | { readonly state: 'unavailable'; readonly diagnostics: readonly Diagnostic[] }
  | { readonly state: 'indeterminate'; readonly diagnostics: readonly Diagnostic[] };
```

Unknown command is resolved before availability and is not an availability state.

Availability evaluation is read-only with respect to consequential application state. It may use bounded inspection through approved IS-2/IS-3/capability contracts.

The current `BaseCommand.isEnabled(): Promise<boolean>` shall therefore be replaced by a structured availability contract.

---

## 13. Execution Context

The Engine shall construct an invocation-scoped context rather than pass `targetRoot`, raw option records and global services through handlers.

The target shape is:

```ts
export interface ExecutionContext<TInput = unknown> {
  readonly invocationId: InvocationId;
  readonly command: CommandIdentity;
  readonly input: TInput;
  readonly explicitIntent: ExplicitInvocationIntent;
  readonly managedProject?: ManagedProjectContext;
  readonly managedScope?: ManagedScope;
  readonly effectiveConfiguration?: EffectiveConfigurationSnapshot;
  readonly authorization: AuthorizationState;
  readonly preview: PreviewIntent;
  readonly cancellation: CancellationContext;
  readonly events: ExecutionEventPublisher;
  readonly capabilities: CapabilityAccess;
  readonly evidence: EvidenceAccumulator;
}
```

IS-2 and IS-3 own the exact imported Managed Project/configuration contracts. IS-1 shall consume those contracts rather than duplicate their fields.

The context is invocation-local. Domain code shall not mutate shared singleton state to communicate invocation information.

---

## 14. Staged Context Resolution

IS-1 implements the Engine coordination required by the Application Core Bootstrap Resolution clarification.

Where the use case requires project-aware context, the concrete semantic sequence is:

```text
normalized invocation
        |
        v
context-independent configuration request -> IS-3
        |
        v
bootstrap effective configuration
        |
        v
managed-project resolution -> IS-2
        |
        v
managed-project context
        |
        v
project/scope-aware configuration -> IS-3
        |
        v
operation effective-configuration snapshot
        |
        v
managed-scope resolution/finalization -> IS-2
        |
        v
policy / safety / authorization / execution
```

The Engine may omit irrelevant stages. It shall not hard-code a universal project-first or configuration-first sequence.

IS-1 shall expose explicit coordinator calls to IS-2 and IS-3 rather than allowing domains/providers to resolve their own project/configuration authority independently.

A material difference between bootstrap assumptions and operation-effective context invalidates dependent availability, scope, policy, safety or authorization decisions and triggers explicit revalidation or a canonical failure. The coordinator shall not recurse indefinitely.

---

## 15. Authorization Evidence and Continuation

Authorization evidence is an application value, not a Boolean `force` flag:

```ts
export interface AuthorizationEvidence {
  readonly kind: AuthorizationEvidenceKind;
  readonly invocationId: InvocationId;
  readonly action: AuthorizationActionRef;
  readonly planFingerprint?: string;
  readonly explicit: true;
  readonly acquiredAt?: string;
}
```

The exact evidence kinds are defined by owning domain/policy requirements. IS-1 owns the shared binding/lifecycle mechanics.

When a use case requires evidence that is absent:

- if the interaction path can acquire it, the invocation may produce an authorization-required continuation event/request tied to the invocation and action/plan;
- the adapter obtains explicit evidence and resumes/reissues through the IS-1 boundary;
- if the interaction path cannot acquire it, execution is rejected deterministically.

IS-1 shall not keep an arbitrary suspended provider operation alive while waiting for approval. Authorization is established before the consequential step it governs.

If target, scope or consequential plan changes materially, plan-bound evidence is invalidated and re-evaluated.

---

## 16. Preview and Dry Run

`PreviewIntent` shall use a shared explicit representation:

```ts
export type PreviewIntent =
  | { readonly requested: false }
  | { readonly requested: true };
```

The owning use case defines what can be planned/previewed. IS-1 carries the intent and ensures proposed effects remain distinct from applied effects in the canonical outcome.

If a command does not support preview, validation/availability returns a canonical unsupported-operation diagnostic rather than silently executing normally.

---

## 17. Cancellation

Version 1 shall use `AbortController`/`AbortSignal` as the concrete in-process cancellation primitive.

IS-23 translates process signals into cancellation requests. IS-22 may translate host/user cancellation into the same IS-1 API. The Engine owns the invocation-scoped controller and passes its signal through use cases to capabilities that support cancellation.

The cancellation sequence is:

```text
cancel request
  -> mark invocation cancellation requested
  -> abort invocation signal
  -> stop scheduling new consequential work where safe
  -> active use case/capabilities observe cancellation
  -> collect known effects/evidence
  -> owning use case/Engine determines canonical terminal outcome
```

Cancellation after irreversible completion does not rewrite a successful completed outcome to `cancelled`.

No IS-1 API promises rollback.

---

## 18. Execution Events and Progress

IS-1 shall expose an invocation-scoped event publisher/subscription seam. Version 1 may implement it as a simple in-process callback/subscriber set; no general event-bus dependency is required.

```ts
export interface ExecutionEvent {
  readonly invocationId: InvocationId;
  readonly sequence: number;
  readonly timestamp: string;
  readonly type: ExecutionEventType;
  readonly stage?: string;
  readonly target?: string;
  readonly payload?: unknown;
}
```

Event payloads shall be typed/discriminated in implementation rather than left as unrestricted `unknown` at consumer boundaries.

Within one invocation, sequence numbers provide deterministic event order. No global ordering across concurrent invocations is required.

Progress supports stage/target/quantitative forms. A percentage is published only when the owning operation can justify it; IS-1 never fabricates precise progress.

Events are observational and never substitute for the final outcome.

---

## 19. Canonical Outcome Model

DD-1.2 is implemented once under `app/application/outcomes/`.

The target top-level contract is structurally equivalent to:

```ts
export interface ApplicationOutcome<TResult = unknown> {
  readonly invocationId: InvocationId;
  readonly command: CommandIdentity;
  readonly status: 'success' | 'failure' | 'partial_success' | 'cancelled';
  readonly result?: TResult;
  readonly diagnostics: readonly Diagnostic[];
  readonly warnings: readonly Diagnostic[];
  readonly effects: readonly ApplicationEffect[];
  readonly proposedEffects: readonly ProposedEffect[];
  readonly children: readonly ChildOutcome[];
  readonly cancellation?: CancellationInformation;
  readonly evidence: readonly ExecutionEvidenceRef[];
  readonly recovery?: readonly RecoveryAction[];
  readonly timing?: OutcomeTiming;
}
```

Domain result payloads compose into `result`; they shall not duplicate shared status, diagnostics, effects or cancellation fields.

A final outcome is immutable after publication.

### 19.1 No competing invocation outcome

`InvocationProjection` is a safe projection/view of `ApplicationOutcome`, not a second semantic envelope. In-process Version 1 may return the canonical outcome directly where no projection is required. IS-22 may serialize/render a projection but may not recalculate status.

---

## 20. Diagnostics and Warnings

IS-1 shall implement the DD-1.2 canonical diagnostic structure once:

```ts
export interface Diagnostic {
  readonly code: DiagnosticCode;
  readonly category: DiagnosticCategory;
  readonly severity: 'info' | 'warning' | 'error' | 'fatal';
  readonly summary: string;
  readonly detail?: string;
  readonly context?: DiagnosticContext;
  readonly cause?: DiagnosticCauseRef;
  readonly recovery?: readonly RecoveryAction[];
  readonly retryability?: 'retryable' | 'not_retryable' | 'unknown';
  readonly sensitivity?: DiagnosticSensitivity;
  readonly evidence?: readonly ExecutionEvidenceRef[];
}
```

Canonical categories shall implement DD-1.2's broad application taxonomy. Invocation/domain/capability-specific codes refine those categories; they do not create parallel category systems.

Expected invocation codes shall include stable distinctions for at least:

```text
INV_INVALID
INV_UNKNOWN_COMMAND
INV_UNAVAILABLE_COMMAND
INV_CONTEXT_UNRESOLVED
INV_INPUT_INVALID
INV_AUTHORIZATION_REQUIRED
INV_AUTHORIZATION_INVALID
INV_INTERACTION_UNSUPPORTED
INV_PREVIEW_UNSUPPORTED
INV_CANCELLED
APP_INTERNAL_INVARIANT
```

The exact code vocabulary may grow as domains are implemented, but every application-facing code maps to a canonical category.

Warnings are diagnostics with warning semantics; the separate `warnings` projection is convenience, not a second model.

Provider-native errors remain evidence below this boundary until mapped by the capability/use case.

---

## 21. Effects and Evidence

`ApplicationEffect` and `ProposedEffect` implement DD-1.2's shared effect semantics. They shall carry stable target/resource identity, effect kind, known/uncertain state and stage/child association where material.

An applied effect and proposed effect use distinct discriminated types so preview data cannot be accidentally reported as mutation.

`ExecutionEvidenceRef` references bounded normalized evidence already owned by a capability/use case. IS-1 does not make raw stdout, parser objects, SDK responses or exception instances part of the final outcome.

The Engine's evidence accumulator preserves material evidence/effects required for acceptance and recovery even when later stages fail or cancellation occurs.

---

## 22. Outcome Interpretation and Aggregation

### 22.1 Interpretation

A use case shall return enough normalized execution information for its acceptance criteria to be evaluated explicitly.

The Engine/use-case authority determines final status from:

- requested intent;
- validated typed input;
- authoritative managed project/scope;
- operation-effective configuration;
- policy/safety/authorization state;
- child/stage results;
- normalized capability evidence;
- known effects and uncertainty;
- cancellation state;
- domain acceptance criteria.

No generic rule such as `no exception == success` or `provider success == application success` is permitted.

### 22.2 Aggregation

`outcome-aggregator.ts` provides information-preserving helpers for multi-stage/target use cases. It shall not impose one universal parent-status algorithm.

The owning use case supplies aggregation/acceptance policy while the helper preserves child identities, statuses, effects and diagnostics.

`partial_success` is used when the owning use case determines that meaningful requested consequential work succeeded but the complete intent was not satisfied. A failure before any consequential work may remain `failure` with children marked `not_attempted`/`rejected` as appropriate.

---

## 23. Application Engine Execution Lifecycle

`ApplicationEngine.invoke()` shall implement the semantic lifecycle below, omitting stages that the registered use case does not require:

```text
receive normalized request
  -> assign/validate invocation identity
  -> structural validation
  -> catalogue lookup
  -> resolve prerequisite bootstrap context
  -> contextual availability evaluation
  -> use-case input validation
  -> resolve authoritative project/configuration/scope as required
  -> re-evaluate context-sensitive availability/validation where required
  -> evaluate policy/safety
  -> establish authorization
  -> produce preview where requested
  -> execute owning use case
  -> accumulate normalized evidence/effects/children
  -> interpret acceptance
  -> construct canonical DD-1.2 outcome
  -> publish terminal state
  -> return invocation projection
```

The exact call order is dependency-driven. No consequential step begins while a material prerequisite remains unresolved, ambiguous or unauthorized.

Completing the handler is not success. A canonical outcome is published only after acceptance evaluation.

---

## 24. Capability Access and Least Authority

`CapabilityAccess` is an invocation/use-case dependency view constructed by IS-23/IS-1 wiring. It exposes only approved AppManager capability contracts required by the use case.

It shall not be a generic service locator exposing every provider.

Domain use cases may receive explicit dependencies directly instead of a capability-view object where that is clearer. The governing requirement is visible bounded dependency direction.

Delegation requests carry only required target/context/configuration constraints. Accessible resources do not expand managed scope.

A capability can reject an invalid technical request within its contract. The Engine/use case still interprets what that evidence means to the application invocation.

---

## 25. Nested and Cross-Domain Use Cases

A parent use case may invoke an approved subordinate application use case through an internal Engine coordination seam when true cross-domain composition is required.

The nested request shall preserve:

- parent invocation/correlation relationship;
- explicit child command identity;
- bounded delegated intent;
- inherited cancellation linkage where appropriate;
- independently valid scope/configuration/authorization requirements;
- child outcome/effect evidence.

A nested use case does not bypass the child semantic owner by calling its providers directly when application semantics are required.

The parent owns composition of the final parent outcome; it does not rewrite the child's internal semantic contract.

Recursive/cyclic use-case invocation shall be detected or prevented by registration/workflow design. Version 1 does not require a generic workflow engine.

---

## 26. Concurrency and Stale State

IS-1 shall support concurrent independent invocations in the single Node.js process. It shall not serialize all work globally by default.

An `InvocationStore` may track active invocation identity, cancellation controller, event sequence and terminal publication state. This is in-memory runtime state, not historical persistence.

Application-level conflicts are handled through explicit revalidation and capability/domain preconditions rather than one universal mutex.

Rules:

- one invocation's mutable context shall not leak into another;
- final outcome publication is exactly once per invocation;
- duplicate active invocation IDs are rejected;
- cancellation and terminal publication races resolve deterministically;
- material stale project/configuration/scope/authorization assumptions trigger revalidation/failure;
- retries/resume are use-case/Engine decisions and never automatic merely because a capability reports retryable evidence.

Persistent job recovery is outside Version 1 unless a later approved specification adds it.

---

## 27. Unexpected Fault Boundary

Expected application rejection/failure is represented through canonical outcomes and diagnostics.

Unexpected programming/infrastructure faults are caught at the IS-1 application boundary so they can be converted into a bounded `internal invariant violation`/internal failure outcome where the application can still do so safely.

The diagnostic shall not expose stack traces or sensitive internal data to ordinary callers. Full fault detail may be sent to injected observability subject to redaction policy.

Truly unrecoverable process-level faults remain an IS-23 launcher/runtime concern. IS-1 shall not call `process.exit()` to handle them.

---

## 28. Relationship to Interaction Adapters

IS-22 owns TUI, Headless and future adapter mechanics.

The target relationship is:

```text
raw CLI / TUI / host input
        |
        v
IS-22 adapter
  parse / prompt where permitted / render
        |
        v
canonical IS-1 InvocationRequest
        |
        v
IS-1 application authority
        |
        v
canonical outcome / events / authorization request
        |
        v
IS-22 presentation or structured serialization
```

IS-22 may hide unavailable commands, prompt for allowed missing values, obtain explicit authorization evidence and render diagnostics. It does not decide command existence, availability, safety, acceptance or final status.

The current `headlessMode.ts` and `interactiveMode.ts` both perform application lookup/availability/execution themselves and therefore require splitting under IS-1/IS-22.

---

## 29. Relationship to Build and Runtime Assembly

IS-23 owns the executable launcher and composition root. IS-1 owns the application object the composition root constructs.

The composition root shall:

- construct IS-2/IS-3 and DD-2 capabilities;
- construct domain use cases with explicit dependencies;
- create an immutable registration list/catalogue;
- construct the IS-1 outcome/engine/invocation components;
- construct IS-22 adapters;
- expose the assembled `AppManagerApplication` to the launcher.

IS-1 shall not instantiate concrete providers by importing singleton services.

IS-23 process signals request IS-1 cancellation. IS-23 process exit projection occurs only after IS-1 returns a canonical outcome/projection.

---

## 30. Testing and Conformance

### 30.1 Application-boundary tests

Vitest tests with fake use cases/resolvers/capabilities shall verify at least:

1. exact canonical command lookup;
2. duplicate command registration fails deterministically;
3. unknown and unavailable commands remain distinct;
4. discovery and execution use the same catalogue;
5. adapter presentation labels are not command authority;
6. explicit caller values remain distinguishable from resolved values;
7. structural validation occurs before consequential execution;
8. contextual validation can occur after IS-2/IS-3 resolution;
9. bootstrap -> project -> operation-config -> scope sequencing is respected when required;
10. irrelevant context stages can be omitted;
11. material context change triggers dependent revalidation;
12. absent authorization never becomes implicit approval;
13. plan-bound authorization is invalidated by material plan change;
14. preview returns proposed rather than applied effects;
15. provider/capability success is interpreted rather than copied to final status;
16. domain payload composes into one canonical outcome;
17. partial child/effect information survives later failure;
18. cancellation preserves completed effects and does not imply rollback;
19. late cancellation does not rewrite completed success;
20. final outcome is published exactly once;
21. invocation events are ordered within an invocation;
22. concurrent invocations have isolated mutable state;
23. retryable evidence does not trigger automatic retry;
24. raw provider exceptions/objects do not cross the final boundary;
25. diagnostics map to the canonical DD-1.2 taxonomy;
26. warnings do not independently determine final status;
27. nested use cases preserve child results/effects and parent authority;
28. unexpected faults become bounded internal diagnostics where safe;
29. no application/domain code calls `process.exit()`;
30. the application path contains no prompts or terminal rendering.

### 30.2 Cross-mode contract tests

IS-22 tests shall feed semantically equivalent TUI/Headless inputs into the same IS-1 fake/real application boundary and assert equivalent canonical requests and outcomes. IS-1 tests shall not need Clack.

### 30.3 Assembly tests

IS-23 assembly tests shall prove that the explicitly constructed catalogue/application can start with test doubles, that imports do not register commands by side effect, and that process exit is derived only after a canonical outcome.

### 30.4 Domain conformance

Each IS-14 through IS-21 domain suite shall test its use cases against the shared IS-1 `ApplicationUseCase`/outcome contracts rather than inventing domain-local base command/result systems.

---

## 31. Legacy Implementation Disposition

The current application path contains useful command metadata/registry and mode separation, but application authority is distributed across bootstrap, modes and command classes. Disposition is therefore responsibility-specific.

| Current artefact / responsibility | Disposition | Target owner/location | Preserved value | Required change |
|---|---|---|---|---|
| root `index.ts` application invocation | SPLIT / RELOCATE | IS-23 launcher + IS-22 adapter + IS-1 boundary | target/tool-root and startup experience | compiled thin launcher only; no duplicate config/logger init, direct application policy or `process.exit()` before canonical projection |
| `app/index.ts` `main()` | SPLIT / REPLACE | IS-1 application + IS-23 composition | central startup/dispatch intent | remove process-global reads, mode selection, service init and command registration; expose constructed application boundary |
| `app/index.ts` top-level command registration | REPLACE | IS-23 explicit composition feeding IS-1 catalogue | explicit inventory of current commands | no import-time side effects; duplicate identities rejected rather than overwritten |
| `app/commands/baseCommand.ts` metadata concept | RETAIN / ADAPT | IS-1 descriptor + domain use-case contracts | command identity/domain/name/description and availability hook intent | split application descriptor from presentation label; typed use-case input/result; structured availability; no targetRoot/options/void base API |
| `BaseCommand.execute(...): Promise<void>` | REPLACE | domain `ApplicationUseCase.execute()` + IS-1 outcome interpretation | async command execution seam | return normalized domain execution information/evidence; final outcome owned by Engine |
| `BaseCommand.isEnabled(): Promise<boolean>` | REPLACE / ADAPT | structured IS-1 availability contract | contextual availability intent | available/unavailable/indeterminate with canonical diagnostics; side-effect-free |
| `app/types/commands/baseCommandTypes.ts` `CommandMetadata` | RETAIN / ADAPT / RELOCATE | IS-1 command contracts + IS-22 presentation projection | stable `id/domain/name/description` concepts | canonical identity is domain/name; label/icon/hidden presentation separated where appropriate; capability metadata added |
| `CommandOptions` generic record | SPLIT / REPLACE | IS-1 raw explicit options + typed domain validation | bounded primitive option values | adapter parsing remains IS-22; domain use case receives validated typed input/options |
| `app/commands/commandRegistry.ts` central map | RETAIN / ADAPT | IS-1 `CommandCatalogue` | centralized lookup/enumeration | explicit construction, exact canonical lookup, duplicate rejection, no logger singleton, no global export |
| registry lookup by scanning values for domain/name | ADAPT | keyed canonical identity map | correct semantic lookup intent | deterministic O(1)-style key lookup; identity normalized once |
| registry `getByDomain()`/`getDomains()` | RETAIN / ADAPT | discovery projection | useful discovery grouping | derive from authoritative descriptors; presentation filtering remains IS-22 |
| duplicate registration warning + overwrite | REPLACE | catalogue construction failure | none as semantic behaviour | fail composition/tests; never let registration order replace semantic owner |
| singleton `commandRegistry` | REPLACE | IS-23 composition root | convenient legacy access | explicit immutable catalogue construction/injection |
| `app/modes/headlessMode.ts` argument parsing | RETAIN / ADAPT / RELOCATE | IS-22 Headless adapter | simple domain/action/flag parsing | produce canonical request; no command lookup, application validation, execution or process exit |
| Headless direct `configService.setFlag()` | RELOCATE / REPLACE | IS-22 request candidate -> IS-3 resolution | explicit invocation override intent | adapter supplies candidate; cannot mutate global effective configuration |
| Headless command lookup/`isEnabled()`/`execute()` | RELOCATE | IS-1 | useful invocation flow evidence | one IS-1 invocation path; structured outcomes instead of logger + exit |
| Headless `process.exit(1)` | REPLACE | IS-23 exit projection | conventional nonzero failure intent | map canonical outcome through approved process projection after application completion |
| `app/modes/interactiveMode.ts` menu/domain discovery | RETAIN / ADAPT / RELOCATE | IS-22 TUI adapter consuming IS-1 discovery | useful TUI navigation | consume authoritative discovery/availability; no direct registry authority |
| Interactive session config prompts | SPLIT / RELOCATE | IS-22 acquisition + IS-3 candidate resolution | interactive acquisition experience | prompt result enters governed configuration semantics; no direct global mutation/environment write |
| Interactive AI health check before all commands | RELOCATE / REPLACE as universal startup | IS-10 availability + relevant use-case/discovery handling | provider availability feedback | do not require unrelated commands to contact AI; capability availability evaluated only where relevant |
| Interactive direct command `isEnabled()`/`execute()` | RELOCATE | IS-1 | useful selection/execution flow | submit canonical invocation; application owns validation/availability/execution |
| Interactive `process.exit()` | REPLACE | IS-22 return/close + IS-23 process lifecycle | user exit intent | adapter returns control; process lifecycle remains launcher-owned |
| command implementations that prompt/log/coordinate providers | SPLIT / RELOCATE | IS-14–IS-21 domains + IS-22 + capabilities | existing workflow evidence | domain use cases own workflow; prompts presentation-only; capability evidence interpreted by Engine/use case |
| direct singleton service imports in command classes | REPLACE | explicit domain/capability dependencies via IS-23 | existing service coverage | dependency injection; no service locator/global state as application context |
| command tests based on `Promise<void>` and logger output | SPLIT / RELOCATE | IS-1/domain/IS-22 tests | useful behavioural examples | assert canonical requests, outcomes, diagnostics/effects and adapter projection separately |
| direct logger messages as command outcome | REPLACE | DD-1.2 canonical diagnostics/outcomes + injected observability | human-readable development feedback | structured semantics authoritative; IS-22 renders them |
| thrown provider/application errors caught generically in modes | REPLACE / ADAPT | capability normalization + domain interpretation + IS-1 fault boundary | central catch intent | expected failures structured; unexpected faults bounded/redacted; no `error.message` as semantic contract |

No production code is changed merely by approving IS-1. Migration occurs as the application core, IS-2/IS-3 and domain implementations are reduced to code.

---

## 32. Migration Sequence

Implementation should proceed in this order:

1. add IS-1 command identity, descriptor, canonical outcome, diagnostic, effect, event and invocation contracts;
2. implement deterministic `CommandCatalogue` construction with duplicate rejection and fake use cases;
3. implement invocation identity, normalization, structural validation, event publication and cancellation store;
4. implement canonical outcome builder/aggregator and DD-1.2 diagnostic mapping helpers;
5. implement `ApplicationEngine`/`InvocationCoordinator` against fake IS-2, IS-3 and capability dependencies;
6. implement staged bootstrap/project/configuration/scope coordination using the concrete IS-2 and IS-3 contracts as those specifications are reduced to code;
7. adapt each domain implementation to register `ApplicationUseCase` definitions rather than `BaseCommand` subclasses;
8. move Headless parsing and TUI acquisition/rendering into IS-22 adapters that call the shared IS-1 boundary;
9. move all process-global startup/exit/signal behaviour to the IS-23 launcher/composition root;
10. remove import-time command registration, singleton `commandRegistry` and application-semantic logic from `app/index.ts`;
11. remove direct command-to-prompt and command-to-provider singleton coupling as each domain migrates;
12. retire `BaseCommand`, legacy command metadata/options and mode-owned execution once all registered use cases use IS-1;
13. add cross-mode, domain-conformance and assembled-launcher tests before removing transitional adapters.

A temporary compatibility adapter may wrap a legacy `BaseCommand` as a registered use case during staged migration, but it shall be explicitly transitional. New code shall not depend on it, and it shall not preserve mode-owned application authority, `Promise<void>` as final outcome semantics, direct prompts, direct `process.exit()`, duplicate-registry overwrite or singleton service lookup.

---

## 33. Traceability

| Governing area | IS-1 implementation |
|---|---|
| DD-1.1 invocation request/identity | immutable normalized `InvocationRequest`, UUID invocation identity, separate caller correlation |
| DD-1.1 command identity/catalogue/discovery | domain/name canonical identity, explicit `CommandCatalogue`, duplicate rejection, same descriptors for discovery and execution |
| DD-1.1 normalization/validation | transport-neutral normalizer and staged structural/contextual validation |
| DD-1.1 availability | structured available/unavailable/indeterminate result after successful command lookup |
| DD-1.1 interaction capabilities | capability flags rather than adapter-name semantics; capability never implies authority |
| DD-1.1 authorization | invocation/action/plan-bound explicit evidence and deterministic non-interactive rejection |
| DD-1.1 preview | shared preview intent with use-case-owned planning and proposed/applied distinction |
| DD-1.1 events/progress | ordered invocation-local typed event channel; no fabricated percentages or event-as-outcome |
| DD-1.1 cancellation | IS-1 cancellation request transport using `AbortController`; final meaning remains canonical DD-1.2/Engine interpretation |
| DD-1.1 outcome projection | projection/view of the canonical DD-1.2 outcome only; no competing envelope/taxonomy |
| DD-1.2 status/outcome | one immutable canonical `ApplicationOutcome` with success/failure/partial_success/cancelled |
| DD-1.2 diagnostics/warnings | one canonical category/severity model with stable AppManager codes and subordinate capability/provider evidence |
| DD-1.2 effects/preview | discriminated applied/proposed effects with uncertainty and child/stage association |
| DD-1.2 partial completion | child results/effects preserved; owning use case supplies aggregate acceptance policy |
| DD-1.2 provider evidence | normalized bounded evidence references only; raw provider objects never final contract |
| DD-1.2 retry/recovery | retryability as evidence/guidance; retry/resume remains Engine/use-case authority |
| DD-1.5 command/use-case ownership | exactly one registered semantic owner per canonical command identity |
| DD-1.5 execution context | invocation-scoped typed context preserving explicit versus authoritative resolved values |
| DD-1.5 bootstrap coordination | explicit IS-3 bootstrap -> IS-2 project -> IS-3 operation config -> IS-2 scope lifecycle where required |
| DD-1.5 policy/safety/authorization | Engine checkpoints before consequential work and after material plan/context change |
| DD-1.5 delegation | bounded explicit capability dependencies; delegated execution never transfers application authority |
| DD-1.5 evidence interpretation | use-case/Engine acceptance required; no provider-success or no-exception shortcut |
| DD-1.5 concurrency/stale state | isolated active invocation state, revalidation hooks, no universal global serialization |
| DD-1.5 nested use cases | explicit child invocation/outcome relationship with parent composition authority and no circular authority |
| [DD-1.2 outcome](../dd_1_application_core/dd-1-2-execution-outcomes-detailed-design-v01.md#_7-outcome-contract) and [diagnostic model](../dd_1_application_core/dd-1-2-execution-outcomes-detailed-design-v01.md#_9-diagnostic-model) | DD-1.2 implemented once; DD-1.1 projection and local codes explicitly map to canonical semantics |
| [DD-1.5 staged lifecycle](../dd_1_application_core/dd-1-5-application-engine-detailed-design-v01.md#_8-orchestration-lifecycle) | staged dependency order, provenance/revalidation and no uncontrolled project/config/scope recursion |
| ADR-0001 / IS-23 | in-process Node.js/TypeScript contracts, explicit composition, process globals outside application semantics |

IS-1 also conforms to the Application Invocation Functional Specification by providing one command surface and invocation path across adapters, deterministic Headless-compatible semantics, explicit authorization, structured machine-consumable outcomes, cancellation/progress contracts and application-level interpretation of delegated results.

---

## 34. Version 1 Implementation Baseline

The Version 1 application runtime and invocation path is:

```text
process / caller / host
        |
        v
IS-23 launcher + IS-22 interaction adapter
  parse/acquire/render only
        |
        v
canonical IS-1 InvocationRequest
        |
        v
InvocationCoordinator / ApplicationEngine
  normalize -> validate -> catalogue lookup
        |
        +--> IS-3 bootstrap configuration where required
        +--> IS-2 managed project
        +--> IS-3 operation-effective configuration
        +--> IS-2 managed scope
        +--> policy / safety / authorization
        |
        v
one owning domain ApplicationUseCase
        |
        +--> bounded DD-2 capabilities / nested approved use cases
        |
        v
normalized evidence / effects / domain result information
        |
        v
Engine / owning-use-case interpretation and acceptance
        |
        v
canonical DD-1.2 ApplicationOutcome
        |
        v
DD-1.1 invocation projection
        |
        v
IS-22 presentation / IS-23 process-exit projection
```

The non-drift rule is:

> **Version 1 has one application invocation and authority path: adapters transport intent, domains own use-case semantics, capabilities perform bounded specialist work, and the Application Engine alone coordinates authoritative context and publishes the canonical AppManager outcome.**
