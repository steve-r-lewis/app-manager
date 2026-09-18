# IS-3 — Configuration Resolution Implementation Specification

> **Document type:** Level 4 Implementation Specification
>
> **Status:** Version 1 implementation baseline
>
> **Implementation ID:** IS-3
>
> **Primary Detailed Design:** [DD-1.4 — AppManager Configuration Resolution](../dd_1_application_core/dd-1-4-configuration-resolution-detailed-design-v01.md)
>
> **Related Detailed Designs:** [DD-1.1 — Application Invocation](../dd_1_application_core/dd-1-1-application-invocation-detailed-design-v01.md), [DD-1.2 — Execution Outcomes](../dd_1_application_core/dd-1-2-execution-outcomes-detailed-design-v01.md), [DD-1.3 — Managed Project](../dd_1_application_core/dd-1-3-managed-project-detailed-design-v01.md), [DD-1.5 — Application Engine](../dd_1_application_core/dd-1-5-application-engine-detailed-design-v01.md)
>
> **Primary DD contract:** [Application Core Bootstrap Resolution](../dd_1_application_core/dd-1-5-application-engine-detailed-design-v01.md#_8-orchestration-lifecycle)
>
> **Primary Functional authority:** [Configuration Functional Specification](../functional/configuration-functional-specification-v01.md)
>
> **Application implementations:** [IS-1 — Application Runtime and Invocation](is-1-application-runtime-and-invocation-implementation-specification-v01.md), [IS-2 — Managed Project Resolution](is-2-managed-project-resolution-implementation-specification-v01.md)
>
> **Runtime decision:** [ADR-0001 — Primary Application Runtime](../project_management/decisions/adr-0001-primary-application-runtime.md)
>
> **Register:** [AppManager Implementation Specification](implementation-specification-v01.md)
>
> **Governing plan:** [Implementation Specification Plan](../project_management/implementation-specification-plan-v01.md)

## 1. Purpose

IS-3 defines the concrete Node.js/TypeScript implementation that converts configuration evidence from approved sources into deterministic, provenance-rich effective configuration for an AppManager operation.

The implementation is governed by three separations:

> **source value -> candidate -> effective value -> application interpretation**

> **bootstrap configuration -> managed-project context -> project-aware operation configuration**

> **resolution != persistence != authorization**

Configuration Resolution owns applicability, candidate validation, concern-specific precedence, fallback, provenance and effective-value construction. IS-1 and the owning use case retain authority over what an effective value means to application execution, safety, scope and final outcomes.

---

## 2. Scope and Non-Ownership

IS-3 owns concrete implementation for:

- stable configuration concern identities and descriptors;
- approved configuration source registration;
- source applicability evaluation;
- candidate acquisition and presence states;
- candidate provenance and sensitivity;
- concern-level candidate validation;
- concern-specific resolution policies;
- precedence, fallback, defaults and equal-authority conflict handling;
- bootstrap-stage resolution;
- project-/entity-/repository-/layer-/resource-/scope-aware resolution;
- immutable effective values and effective-configuration snapshots;
- selective multi-concern resolution;
- cross-concern validation hand-off;
- safe explanation/provenance projections;
- interaction-required results and candidate re-entry;
- Headless-compatible deterministic resolution;
- source revision evidence and invalidation for future resolution;
- bounded protected-value access abstractions;
- normalized configuration diagnostics;
- migration away from ad hoc `process.env`/singleton configuration reads.

IS-3 does **not** own:

- application invocation, interaction or final outcomes — IS-1/IS-22;
- managed-project identity, topology, managed scope or targetability — IS-2;
- durable Settings CRUD/persistence workflows — IS-19;
- filesystem mechanics — IS-4;
- process environment construction for an already-authorized child process — IS-5;
- repository/provider semantics — IS-6;
- AI provider policy — IS-10/IS-20;
- domain-specific meaning of configuration concerns — owning domain/capability;
- generic secret-store technology, arbitrary configuration plugins or a universal settings format.

---

## 3. Concrete Module Boundary

The target Version 1 layout is:

```text
app/
└── application/
    └── configuration/
        ├── configuration-resolver.ts
        ├── contracts/
        │   ├── configuration-concern.ts
        │   ├── configuration-context.ts
        │   ├── configuration-source.ts
        │   ├── configuration-candidate.ts
        │   ├── configuration-policy.ts
        │   ├── effective-configuration.ts
        │   ├── protected-value.ts
        │   └── configuration-results.ts
        ├── catalogue/
        │   └── configuration-concern-catalogue.ts
        ├── sources/
        │   ├── invocation-source.ts
        │   ├── environment-source.ts
        │   ├── tool-configuration-source.ts
        │   ├── project-configuration-source.ts
        │   ├── contextual-source.ts
        │   └── builtin-default-source.ts
        ├── resolution/
        │   ├── applicability-evaluator.ts
        │   ├── candidate-acquirer.ts
        │   ├── candidate-validator.ts
        │   ├── policy-resolver.ts
        │   └── snapshot-builder.ts
        ├── explanation/
        │   └── configuration-explanation-projector.ts
        └── invalidation/
            └── configuration-invalidation.ts
```

The tree expresses semantic ownership, not a mandatory one-class-per-file design. Small responsibilities may be combined when tests and ownership remain clear.

Contracts stay under the Configuration Resolution boundary even when many domains consume them. A global `app/types/` directory shall not become their semantic owner merely because consumer count is high.

---

## 4. Public Configuration Resolver Contract

IS-1 consumes IS-3 through an interface structurally equivalent to:

```ts
export interface ConfigurationResolver {
  resolveBootstrap(request: BootstrapConfigurationRequest): Promise<ConfigurationResolutionSetResult>;
  resolveOperation(request: OperationConfigurationRequest): Promise<ConfigurationSnapshotResult>;
  resumeWithCandidate(request: ConfigurationCandidateResumeRequest): Promise<ConfigurationResolutionSetResult>;
  explain(request: ConfigurationExplanationRequest): ConfigurationExplanationResult;
  invalidate(request: ConfigurationInvalidationRequest): void;
}
```

`resolveBootstrap()` and `resolveOperation()` use the same concern catalogue, source contracts, validation and policy engine. They are separate entry points only to make the allowed context/stage explicit and hard to misuse.

`resumeWithCandidate()` re-enters governed resolution after IS-1/IS-22 obtains a permitted interactive candidate. It does not persist that candidate.

`invalidate()` affects future resolutions/caches only; it cannot mutate an immutable snapshot already accepted by an invocation.

---

## 5. Configuration Concern Catalogue

Every governed AppManager configuration value has a stable concern descriptor:

```ts
export interface ConfigurationConcernDescriptor<T> {
  readonly id: ConfigurationConcernId;
  readonly owner: ConfigurationOwnerId;
  readonly schema: ConfigurationValueSchema<T>;
  readonly requiredness: 'required' | 'optional';
  readonly allowedSourceClasses: ReadonlySet<ConfigurationSourceClass>;
  readonly allowedScopes: ReadonlySet<ConfigurationScopeKind>;
  readonly invocationOverride: 'allowed' | 'forbidden';
  readonly environmentInput: 'allowed' | 'forbidden';
  readonly providerInput: 'allowed' | 'forbidden';
  readonly contextualInput: 'allowed' | 'forbidden';
  readonly interactiveInput: 'allowed' | 'forbidden';
  readonly bootstrapEligibility: 'eligible' | 'project_context_required';
  readonly sensitivity: ConfigurationSensitivity;
  readonly policy: ConfigurationResolutionPolicyId;
  readonly explainability: 'normal' | 'restricted';
}
```

The descriptor contains resolution semantics only. User-facing labels, storage paths and presentation strings belong elsewhere.

The catalogue is constructed explicitly by IS-23. Import order does not register concerns. Duplicate IDs fail composition/startup validation rather than silently replacing a descriptor.

Concern owners supply the schema/semantic validator and policy identity. They do not implement private source precedence at call sites.

---

## 6. Concern Identity and Type Safety

Version 1 shall use branded string IDs plus typed descriptors rather than one monolithic `AppConfig` object:

```ts
export type ConfigurationConcernId = string & { readonly __configurationConcernId: unique symbol };
```

A typed helper may preserve value inference:

```ts
export interface ConfigurationConcern<T> {
  readonly descriptor: ConfigurationConcernDescriptor<T>;
}
```

This allows concerns to evolve independently and prevents unrelated optional values from becoming mandatory merely because they share one global schema.

Zod remains an approved runtime validation mechanism because it is already present and useful, but each concern owns a bounded schema. IS-3 shall not require every configuration value to be nested in one permanent Zod `AppConfigSchema`.

---

## 7. Resolution Context

IS-3 receives explicit context rather than reading process globals:

```ts
export interface ConfigurationResolutionContext {
  readonly stage: 'bootstrap' | 'operation';
  readonly invocationId: InvocationId;
  readonly command: CommandIdentity;
  readonly executionMode: ExecutionMode;
  readonly interactionAvailable: boolean;
  readonly explicitCandidates: readonly InvocationConfigurationInput[];
  readonly environment: EnvironmentObservation;
  readonly managedProject?: ManagedProjectContextView;
  readonly managedScope?: ManagedScopeView;
  readonly capabilityContext?: readonly CapabilityConfigurationContext[];
  readonly correlation?: CorrelationMetadata;
}
```

`EnvironmentObservation` is an immutable snapshot captured at the IS-23/IS-1 boundary from the permitted process environment. Individual configuration sources/capabilities do not read `process.env` ad hoc.

At bootstrap stage, `managedProject` and `managedScope` are absent by construction.

At operation stage, IS-1 supplies the authoritative IS-2 context required by requested concerns. IS-3 never reconstructs project identity from cwd, config-file proximity, Git roots or Nuxt markers.

---

## 8. Configuration Source Contract

Approved sources implement:

```ts
export interface ConfigurationSource {
  readonly id: ConfigurationSourceId;
  readonly sourceClass: ConfigurationSourceClass;
  assessApplicability(request: SourceApplicabilityRequest): Promise<SourceApplicabilityResult>;
  acquire(request: CandidateAcquisitionRequest): Promise<CandidateAcquisitionResult>;
}
```

Source classes initially include:

```text
tool
project_shared
project_local
invocation
environment
provider
contextual
builtin_default
interactive
```

A source returns candidates/evidence only. It never selects the effective value, changes managed scope, persists an acquired value or manufactures a fallback.

Source identity and source class remain distinct so two sources of the same class can retain different scope/revision/provenance.

---

## 9. Concrete Source Implementations

### 9.1 Invocation source

Consumes normalized explicit inputs from IS-1. It does not reread argv. Inputs participate only for concerns permitting invocation override.

### 9.2 Environment source

Consumes `EnvironmentObservation`, not live `process.env`. The mapping from environment variable name to concern is declared explicitly in source/concern registration. Unknown environment variables do not become configuration automatically.

### 9.3 Tool configuration source

Reads an explicitly configured AppManager-owned resource through IS-4. Its storage format is an adapter concern. Version 1 may use JSON/JSONC where adopted by Settings implementation, but IS-3 semantics do not depend on that format.

### 9.4 Project configuration sources

Project-shared/project-local sources receive resolved IS-2 project/entity resource references. They do not locate a project by walking upward from cwd. They read only the approved AppManager configuration resource(s) associated with that context.

### 9.5 Contextual/provider sources

These accept already-normalized facts from the owning capability/context. They do not invoke arbitrary provider work merely to discover defaults unless the concern explicitly defines that acquisition.

### 9.6 Built-in default source

Defaults are explicit catalogue/policy data. There is no `value ?? convenientDefault` fallback outside the resolver.

### 9.7 Interactive source

An interactive candidate exists only after IS-1/IS-22 acquires it. IS-3 itself never prompts.

---

## 10. Candidate Presence Model

The candidate model preserves value-state semantics explicitly:

```ts
export type CandidatePresence<T> =
  | { readonly state: 'absent' }
  | { readonly state: 'unset' }
  | { readonly state: 'empty'; readonly value: T }
  | { readonly state: 'value'; readonly value: T }
  | { readonly state: 'protected'; readonly value: ProtectedValueHandle<T> }
  | { readonly state: 'protected_inaccessible'; readonly reference: ProtectedValueReference }
  | { readonly state: 'external_unresolved'; readonly reference: ExternalValueReference }
  | { readonly state: 'invalid_representation'; readonly summary: string };
```

`empty` is not globally equivalent to absent or unset. The concern validator/policy decides its meaning.

A source returning no candidate and a source being unavailable are separate acquisition states.

---

## 11. Configuration Candidate

```ts
export interface ConfigurationCandidate<T> {
  readonly concern: ConfigurationConcernId;
  readonly presence: CandidatePresence<T>;
  readonly source: ConfigurationSourceId;
  readonly sourceClass: ConfigurationSourceClass;
  readonly scope: ConfigurationScope;
  readonly projectAssociation?: ProjectIdentity;
  readonly entityAssociation?: ProjectEntityId;
  readonly provenance: ConfigurationProvenance;
  readonly sensitivity: ConfigurationSensitivity;
  readonly revision?: ConfigurationSourceRevision;
  readonly diagnostics: readonly Diagnostic[];
}
```

Candidates are immutable. Validation results are recorded separately rather than mutating source evidence.

Candidate values are not exposed in diagnostics or explanation when sensitivity forbids it.

---

## 12. Source Applicability

`ApplicabilityEvaluator` runs before candidate precedence.

It checks:

- concern/source-class permission;
- bootstrap eligibility;
- source scope against resolved project/entity/scope context;
- invocation/operation applicability;
- execution-mode restrictions;
- provider/capability availability where relevant;
- sensitivity/source suitability;
- explicit source ownership constraints.

Result states:

```ts
export type SourceApplicabilityResult =
  | { readonly state: 'applicable' }
  | { readonly state: 'not_applicable'; readonly reason: ApplicabilityReason }
  | { readonly state: 'context_required'; readonly requirement: ConfigurationContextRequirement }
  | { readonly state: 'unsupported'; readonly diagnostics: readonly Diagnostic[] };
```

A `not_applicable` source is not a missing candidate and does not participate in precedence.

Project-local/shared sources return `context_required` during bootstrap rather than guessing association from paths.

---

## 13. Candidate Acquisition

`CandidateAcquirer` evaluates applicable sources and preserves all candidates needed for policy/fallback/explanation.

Acquisition results distinguish:

```text
candidate(s) acquired
applicable but absent
source unavailable
source inaccessible
source malformed
acquisition cancelled
unexpected source failure
```

Sources may be acquired concurrently only when doing so cannot change semantics and cancellation/resource bounds are preserved. Resolution ordering never depends on completion order.

Lower-precedence candidates are not discarded during acquisition because fallback or explanation may require them.

---

## 14. Candidate Validation

Each candidate passes a bounded validation pipeline:

1. representation/presence interpretation;
2. runtime shape/type validation;
3. owner-supplied semantic validation;
4. context compatibility;
5. execution-mode compatibility;
6. required provider/capability availability where applicable;
7. sensitivity/source suitability.

```ts
export type CandidateValidationResult<T> =
  | { readonly state: 'valid'; readonly normalized: T | ProtectedValueHandle<T> }
  | { readonly state: 'invalid'; readonly diagnostics: readonly Diagnostic[] }
  | { readonly state: 'dependency_unavailable'; readonly diagnostics: readonly Diagnostic[] }
  | { readonly state: 'protected_inaccessible'; readonly diagnostics: readonly Diagnostic[] }
  | { readonly state: 'unsupported'; readonly diagnostics: readonly Diagnostic[] }
  | { readonly state: 'external_unresolved'; readonly diagnostics: readonly Diagnostic[] };
```

Zod `safeParse()` should be used for ordinary runtime shape validation where the concern uses Zod. Provider/Zod exceptions are normalized; callers do not receive library-native errors as configuration semantics.

---

## 15. Resolution Policy

No universal source order exists.

Each concern references an immutable policy:

```ts
export interface ConfigurationResolutionPolicy<T> {
  readonly id: ConfigurationResolutionPolicyId;
  readonly tiers: readonly ConfigurationPolicyTier[];
  readonly invalidCandidate: InvalidCandidatePolicy;
  readonly unavailableSource: UnavailableSourcePolicy;
  readonly absence: AbsencePolicy;
  readonly unset: UnsetPolicy;
  readonly equalAuthority: EqualAuthorityPolicy;
  readonly defaultPolicy: DefaultPolicy<T>;
  readonly interactivePolicy: InteractivePolicy;
}
```

A tier may identify one or more allowed source classes/scopes. Equal-tier candidates are resolved only through an explicit deterministic tie-break permitted by the concern; otherwise they produce conflict.

The historical order:

```text
project-local -> project-shared -> tool-level
```

is implemented as a reusable policy fragment only for concerns that explicitly adopt it. It is never prepended/appended automatically to invocation/environment/provider/default sources.

---

## 16. Explicit Invocation Values

Invocation values participate only when the concern descriptor permits them.

They retain `sourceClass: 'invocation'` provenance and undergo the same validation as equivalent persisted values.

A configuration value named `force`, `yes`, `allowDelete` or similar is not authorization evidence merely because it is effective. IS-1/use-case authorization contracts remain separate.

Invocation candidates are one-off by default and never written to Settings resources by IS-3.

---

## 17. Fallback and Defaults

Fallback behaviour is explicit per policy and reason:

- absence fallback;
- invalid-candidate fallback;
- unavailable-source fallback;
- contextual/provider fallback;
- built-in-default fallback;
- no fallback.

The resolver records the fallback path in provenance/explanation.

An explicit higher-priority invalid candidate blocks when policy says `block`; it is not silently masked by a lower source.

A built-in default is represented as an ordinary validated candidate from `builtin_default`, with explicit provenance. No resolver branch manufactures a value merely to avoid failure.

---

## 18. Equal-Authority Conflicts

When two materially different valid candidates occupy the same policy tier and no concern-specific deterministic tie-break exists, resolution returns `conflict`.

Candidate enumeration order, file order, source registration order and async completion order are prohibited tie-breaks.

Interactive disambiguation is available only if the policy explicitly permits it. The resulting choice re-enters resolution as disambiguation/candidate evidence rather than becoming effective directly.

---

## 19. Concern Resolution Result

```ts
export type ConfigurationResolutionResult<T> =
  | { readonly state: 'effective'; readonly effective: EffectiveConfigurationValue<T>; readonly explanation: ConfigurationExplanationRef }
  | { readonly state: 'optional_absent'; readonly concern: ConfigurationConcernId; readonly explanation: ConfigurationExplanationRef }
  | { readonly state: 'required_unresolved'; readonly diagnostics: readonly Diagnostic[] }
  | { readonly state: 'invalid'; readonly diagnostics: readonly Diagnostic[] }
  | { readonly state: 'conflict'; readonly conflict: ConfigurationConflict; readonly diagnostics: readonly Diagnostic[] }
  | { readonly state: 'source_unavailable'; readonly diagnostics: readonly Diagnostic[] }
  | { readonly state: 'protected_unavailable'; readonly diagnostics: readonly Diagnostic[] }
  | { readonly state: 'interaction_required'; readonly request: ConfigurationInteractionRequest; readonly diagnostics: readonly Diagnostic[] }
  | { readonly state: 'interaction_cancelled'; readonly diagnostics: readonly Diagnostic[] }
  | { readonly state: 'unsupported'; readonly diagnostics: readonly Diagnostic[] }
  | { readonly state: 'cancelled'; readonly diagnostics: readonly Diagnostic[] }
  | { readonly state: 'failed'; readonly diagnostics: readonly Diagnostic[] };
```

Optional absence is a successful governed resolution state, not an implicit default.

---

## 20. Effective Configuration Value

```ts
export interface EffectiveConfigurationValue<T> {
  readonly concern: ConfigurationConcernId;
  readonly value: T | ProtectedValueHandle<T>;
  readonly sourceClass: ConfigurationSourceClass;
  readonly source: ConfigurationSourceId;
  readonly scope: ConfigurationScope;
  readonly projectAssociation?: ProjectIdentity;
  readonly entityAssociation?: ProjectEntityId;
  readonly sensitivity: ConfigurationSensitivity;
  readonly provenance: EffectiveConfigurationProvenance;
  readonly revision?: ConfigurationSourceRevision;
}
```

Effective values are immutable. The value carries enough context to prevent accidental reuse across incompatible project/scope associations.

The effective model is AppManager-owned and shall not expose a provider SDK configuration object as the shared contract.

---

## 21. Bootstrap Resolution

`resolveBootstrap()` accepts only concerns whose descriptor is `bootstrapEligibility: 'eligible'`.

Permitted source participation remains concern-specific, but source applicability cannot depend on unresolved managed-project identity/topology/scope.

Typical eligible classes may include invocation, tool, environment, context-independent host evidence and built-in defaults where the concern permits them.

Project-local/shared sources are ineligible at this stage.

The bootstrap result is:

```ts
export interface BootstrapConfigurationSnapshot {
  readonly invocationId: InvocationId;
  readonly values: ReadonlyMap<ConfigurationConcernId, EffectiveConfigurationValue<unknown>>;
  readonly optionalAbsences: ReadonlySet<ConfigurationConcernId>;
  readonly revision: ConfigurationSnapshotRevision;
  readonly stage: 'bootstrap';
}
```

It is not automatically the operation-effective snapshot. IS-2 may consume approved projected values as project-resolution evidence but remains project authority.

---

## 22. Operation Resolution

After sufficient IS-2 context exists, `resolveOperation()` may resolve project-, layer-, repository-, resource- and scope-aware concerns.

The request declares the exact concern set needed by the use case. IS-3 shall not resolve every known concern on every invocation.

Where scope finalization depends on effective configuration, IS-1 calls operation resolution with sufficient Managed Project Context before final scope acceptance, then supplies the relevant effective projection to IS-2. A concern that truly requires already-finalized scope is resolved only after that scope exists.

The implementation must therefore support bounded staged concern sets; it shall not encode “scope always before configuration” or “configuration always before scope” as a universal call graph.

---

## 23. Effective Configuration Snapshot

```ts
export interface EffectiveConfigurationSnapshot {
  readonly id: ConfigurationSnapshotId;
  readonly invocationId: InvocationId;
  readonly command: CommandIdentity;
  readonly project?: ProjectIdentity;
  readonly scope?: ManagedScopeId;
  readonly values: ReadonlyMap<ConfigurationConcernId, EffectiveConfigurationValue<unknown>>;
  readonly optionalAbsences: ReadonlySet<ConfigurationConcernId>;
  readonly revision: ConfigurationSnapshotRevision;
  readonly diagnostics: readonly Diagnostic[];
}
```

The snapshot is accepted only when all required concerns in the requested set have effective values and cross-concern validation required at this stage has succeeded.

It is immutable for the execution phase that consumes it. A Settings write or environment change does not mutate the object.

Consumers access typed values through catalogue-aware helpers such as `snapshot.get(concern)`; they do not reread raw sources.

---

## 24. Multi-Concern Resolution and Cross-Concern Validation

`SnapshotBuilder` resolves the requested concern set and preserves individual provenance/failure evidence.

Independent concerns may be acquired/validated concurrently where deterministic semantics remain unchanged.

Cross-concern constraints are registered explicitly by the owning application/domain composition. They run after individual values resolve and before snapshot acceptance.

A cross-concern validator returns evidence such as incompatible provider/credential or target/template combination. It does not implement source precedence.

If a required concern fails, IS-3 returns an unaccepted snapshot result. IS-1/use case decides whether any independent work can proceed under DD-1.2 partial-result semantics.

---

## 25. Protected Values

Version 1 defines a narrow protected-value seam without choosing an OS credential manager:

```ts
export interface ProtectedValueHandle<T = string> {
  readonly id: ProtectedValueHandleId;
  readonly classification: ConfigurationSensitivity;
  access(request: ProtectedValueAccessRequest): Promise<ProtectedValueAccessResult<T>>;
}
```

The handle is created by an approved protected source and can reveal material only to an explicitly constructed consumer with the required access purpose/capability token defined by application composition.

IS-3 does not log, serialize or include protected material in provenance.

Environment-backed secrets may initially be copied into an in-memory protected handle at environment snapshot construction, then omitted from general `EnvironmentObservation` projections. This reduces casual plaintext propagation but is not claimed to provide hardware-backed secret isolation.

No secret persistence/encryption scheme is invented by IS-3.

---

## 26. Environment Observation

IS-23/IS-1 captures process environment once for the invocation into a bounded observation provider.

The environment source requests only explicitly registered keys for requested concerns. It does not expose a free-form copy of all environment variables to arbitrary consumers.

This corrects current direct reads such as AI model selection, GitHub credentials and logging switches. Those values become governed concerns/candidates only where normative domain/capability semantics require them.

IS-5 remains allowed to inherit the process environment for child-process execution when an already-authorized process request explicitly selects inheritance; that technical mechanism is not configuration precedence.

---

## 27. Provenance and Explanation

IS-3 stores internal resolution evidence sufficient to project a safe explanation:

```ts
export interface ConfigurationExplanation {
  readonly concern: ConfigurationConcernId;
  readonly applicableSources: readonly ConfigurationSourceSummary[];
  readonly selected?: ConfigurationSourceSummary;
  readonly rejected: readonly CandidateRejectionSummary[];
  readonly fallback?: ConfigurationFallbackSummary;
  readonly conflict?: ConfigurationConflictSummary;
  readonly reason: ConfigurationResolutionReason;
  readonly remediation: readonly RemediationHint[];
}
```

Explanation excludes raw protected values and minimizes ordinary values unless their display is explicitly safe/useful.

Consumers obtain this projection rather than reconstructing precedence by rereading sources.

---

## 28. Interactive Acquisition

If a required concern remains unresolved and the descriptor/policy permits interactive input, IS-3 returns `interaction_required` with:

- concern ID;
- expected value kind/constraints in safe form;
- sensitivity classification;
- permitted candidate source semantics;
- whether persistence is available as a separate owning workflow option;
- safe prompt/presentation hints where useful.

IS-1/IS-22 acquires or cancels. An acquired value returns through `resumeWithCandidate()` as `sourceClass: 'interactive'` and is validated/resolved normally.

Cancellation is a cancellation result, never `''`, `undefined`, `false` or explicit unset.

Headless mode never calls an interaction adapter; IS-1 projects `interaction_required` into a deterministic unresolved-configuration outcome.

---

## 29. Persistence Boundary

IS-3 source adapters are read-only for resolution.

IS-19 Settings Domain owns creation/update/delete of durable configuration and selects the intended persistence scope. It uses IS-4/IS-8/other approved persistence mechanisms as specified by its own implementation.

After successful persistence, the owning workflow calls IS-3 invalidation with affected source/concern/scope revision information.

IS-3 shall never:

- write a prompted value because it resolved successfully;
- promote an environment/provider observation into a file;
- change another configuration scope to make resolution succeed;
- expose a generic `set()`/`save()` method on `ConfigurationResolver`.

---

## 30. Invalidation, Revision and Cache

Version 1 may cache source reads/resolution results within an invocation and may retain a bounded process-local source cache where revision-safe.

Every cached entry retains:

- source identity/class;
- configuration scope/project association;
- source revision/digest where available;
- concern ID;
- policy/catalogue semantic version;
- sensitivity restrictions.

A cache key never creates a new precedence tier.

`ConfigurationSnapshotRevision` contains material source revisions plus a SHA-256 fingerprint over canonicalized non-secret concern/source/revision/policy identifiers. It is a comparison token, not a secret-bearing content hash and not proof that all external state is unchanged.

Invalidation removes/marks affected future cache entries. Accepted snapshots remain unchanged.

---

## 31. Dynamic Re-Resolution

Dynamic re-resolution is disabled by default.

A use case that explicitly permits it must identify:

- concerns allowed to change;
- semantic checkpoint;
- whether project/scope/provider/safety decisions depend on them;
- which dependent decisions require revalidation;
- authorization consequences;
- reporting for already-performed effects.

IS-3 returns the changed effective evidence. IS-1/use case decides whether execution can continue.

There is no background watcher that silently mutates active snapshots in Version 1.

---

## 32. Staged IS-2 / IS-3 Collaboration

The concrete dependency is:

```text
IS-1 normalized invocation
        |
        v
IS-3 resolveBootstrap(context-independent concerns)
        |
        v
BootstrapConfigurationSnapshot
        |
        v
IS-2 resolveContext(project hints/evidence)
        |
        v
ManagedProjectContext
        |
        v
IS-3 resolveOperation(project-aware concerns needed before scope)
        |
        v
operation-effective values
        |
        v
IS-2 resolveScope / targetability
        |
        +--> IS-3 resolve any concerns that genuinely require final scope
        |
        v
IS-1 snapshot acceptance / policy / execution
```

The Engine may omit unnecessary stages. It may perform one explicit bounded re-resolution checkpoint when approved semantics require it. It shall not permit recursive resolver calls to converge by accident.

A later project-aware value that materially conflicts with bootstrap/project assumptions yields `CONFIG_BOOTSTRAP_PROJECT_CONFLICT` or revalidation evidence to IS-1; IS-3 does not silently select a new project.

---

## 33. Provider and Capability Configuration

Capabilities receive effective configuration projections at construction/request boundaries. They do not read shared settings/environment sources themselves.

Provider-local technical options may remain local only when they have no material AppManager semantic effect. Once an option affects target, safety, observable behaviour, provider selection or domain policy, it becomes an approved configuration concern or domain policy input.

Provider-native defaults are normalized as provider observations only when a concern explicitly permits provider-derived candidates. They never automatically become AppManager defaults.

---

## 34. Diagnostics

IS-3 emits DD-1.2-compatible diagnostics through IS-1 contracts. Initial stable codes include:

```text
CONFIG_UNKNOWN_CONCERN
CONFIG_SOURCE_UNAVAILABLE
CONFIG_SOURCE_INACCESSIBLE
CONFIG_SOURCE_NOT_APPLICABLE
CONFIG_CONTEXT_REQUIRED
CONFIG_REQUIRED_MISSING
CONFIG_CANDIDATE_INVALID
CONFIG_CANDIDATE_UNSUPPORTED
CONFIG_CANDIDATE_CONFLICT
CONFIG_PROJECT_ASSOCIATION_INVALID
CONFIG_SCOPE_ASSOCIATION_INVALID
CONFIG_INTERACTION_REQUIRED
CONFIG_INTERACTION_CANCELLED
CONFIG_PROTECTED_VALUE_UNAVAILABLE
CONFIG_PROVIDER_DEPENDENCY_UNAVAILABLE
CONFIG_STALE_EVIDENCE
CONFIG_CROSS_CONCERN_INCOMPATIBLE
CONFIG_BOOTSTRAP_PROJECT_CONFLICT
CONFIG_RESOLUTION_CYCLE_UNSAFE
CONFIG_RESOLUTION_CANCELLED
CONFIG_RESOLUTION_FAILED
```

Diagnostics identify concern/source/scope/reason where safe but never include secret material merely for debugging.

Provider/Zod/filesystem exceptions are technical causes, not public machine codes.

---

## 35. Cancellation and Concurrency

IS-3 accepts the invocation `AbortSignal` and propagates it to sources/capabilities that support cancellation.

Cancellation stops new acquisition work and returns a structured cancelled state; it does not claim rollback because resolution is read-only.

Resolvers/catalogues/policies are immutable after composition. No global mutable `configService` state is shared between invocations.

Concurrent invocations may resolve different snapshots safely. A durable Settings write affects future resolution after invalidation; it does not mutate another invocation's accepted snapshot.

---

## 36. Security and Trust

Project configuration and external values are untrusted input.

Implementation rules:

1. parse data, never execute configuration as code;
2. use bounded IS-4 reads and configured size limits for file-backed sources;
3. do not dynamically import project-controlled configuration modules for Version 1;
4. validate every candidate before effective selection;
5. never permit configuration to redefine its own source precedence/trust rules at runtime;
6. never permit configuration to expand IS-2 managed scope directly;
7. protect secret values from logs/events/explanation/snapshots not authorized to access material;
8. do not automatically load `.env` files as an implicit source merely because they exist;
9. environment variables participate only through registered concern mappings;
10. do not introduce executable configuration plugins.

---

## 37. Testing and Conformance

### 37.1 Catalogue/source tests

Vitest tests shall verify at least:

1. duplicate concern IDs fail composition;
2. source registration order does not affect resolution;
3. source presence does not imply applicability;
4. project source requires authoritative IS-2 context;
5. bootstrap rejects project-dependent concern/source applicability;
6. environment source uses supplied observation, not live `process.env`;
7. unknown environment keys never become candidates;
8. source unavailable differs from applicable-but-absent;
9. absent/unset/empty/value/protected/inaccessible/external-unresolved remain distinct;
10. Zod/semantic validation failures normalize correctly;
11. candidate validation happens before precedence eligibility;
12. candidate values remain immutable.

### 37.2 Policy tests

13. project-local > project-shared > tool only for concerns adopting that fragment;
14. no universal invocation/environment precedence is introduced;
15. invocation override is rejected when forbidden;
16. invalid higher candidate blocks or falls through exactly per policy;
17. unavailable source fallback follows policy;
18. default is used only when explicitly defined;
19. optional absence remains absence;
20. equal-authority conflict is independent of acquisition order;
21. interactive candidate ranks according to policy, not because it was interactive;
22. provider-native default is not automatically effective.

### 37.3 Staging/snapshot tests

23. bootstrap snapshot contains only bootstrap-eligible concerns;
24. bootstrap value retains provenance when projected to IS-2;
25. operation project-aware source becomes eligible only after context exists;
26. scope-dependent concern requires scope only when its descriptor/policy says so;
27. configuration needed to finalize scope can resolve from sufficient project context before scope acceptance;
28. later material bootstrap/project conflict returns explicit conflict/revalidation evidence;
29. no recursive IS-2/IS-3 resolution loop occurs;
30. snapshot resolves only requested concerns;
31. required failure prevents snapshot acceptance;
32. cross-concern incompatibility prevents acceptance;
33. accepted snapshot is immutable after source mutation/invalidation;
34. future resolution sees invalidated durable changes;
35. cache never changes precedence or provenance;
36. revision fingerprint excludes protected material.

### 37.4 Interaction/security tests

37. Headless never prompts;
38. interaction-required is deterministic;
39. interactive cancellation is not empty/unset;
40. interactive values are not persisted by resolution;
41. protected value material is absent from diagnostics/explanations;
42. protected handle reveals material only through its access contract;
43. configuration cannot broaden managed scope;
44. effective `force`-like values do not satisfy authorization contracts;
45. project-controlled executable configuration is not imported;
46. equivalent normalized inputs produce equivalent results across TUI/Headless/host adapters.

---

## 38. Legacy Implementation Disposition

Current configuration behaviour is fragmented across a mutable singleton, environment reads and provider/service defaults. Useful validation mechanics can be preserved, but current topology is not the target authority model.

| Current artefact / responsibility | Disposition | Target owner/location | Preserved value | Required change |
|---|---|---|---|---|
| `app/services/configService.ts` singleton | SPLIT / REPLACE | IS-3 resolver/catalogue + IS-1 invocation context | central-access intent and immutable clone intent | replace mutable global “single source of truth” with per-invocation effective snapshots and explicit DI |
| `ConfigService.getDefaults()` | SPLIT / ADAPT | concern policies / built-in default source / IS-2 invocation evidence | explicit `verbose=false`, `dryRun=false` may remain if owning concern semantics approve | `cwd` is not configuration authority; Git user empty strings are not universal safe defaults merely because schema accepts them |
| `ConfigService.setFlag()` | SPLIT / RELOCATE | invocation candidate handling or Settings Domain depending persistence semantics | runtime Zod validation | no mutation of global active configuration; one-off flags become invocation candidates |
| `ConfigService.setGitUser()` | SPLIT / RELOCATE | Git-domain/config concern + IS-3 candidate resolution; persistence in IS-19 if requested | useful Git user schema validation | detected/persisted/invocation Git identity must retain source/provenance/precedence rather than mutate singleton state |
| `ConfigService.isVerbose()` | REPLACE | typed effective snapshot access | convenient Boolean consumer API | consumer receives effective `verbose` concern projection |
| `ConfigService.toolRoot` / `init(toolRoot)` | RELOCATE | IS-23 installation/runtime context; tool source resource reference | tool installation root may locate AppManager-owned resources | tool root is runtime assembly context, not mutable application configuration |
| `AppConfigSchema` monolith | SPLIT / ADAPT | concern-local schemas under IS-3/owners | Zod runtime validation | replace permanent monolithic global config with typed concern descriptors/schemas |
| `GitUserConfigSchema` | RETAIN / ADAPT / RELOCATE | owning Git/config concern contract | useful shape/email validation | use as bounded concern schema; do not imply source/default/precedence |
| `AppConfigFlagsSchema` | SPLIT / ADAPT | individual flag concerns | useful Boolean validation | each semantically governed flag resolves independently; avoid one global mutable flags bag |
| `IConfigService` | REPLACE | `ConfigurationResolver` + snapshot contracts | need for a typed boundary | remove global getters/setters/reset API from target architecture |
| empty `app/resolvers/settingsResolver.ts` | REPLACE | IS-3 resolution modules | resolver naming only | no implementation to preserve; do not create generic resolver framework |
| `interactiveMode.ts` calling `setFlag('verbose', true)` | RELOCATE | IS-22 normalized invocation input -> IS-3 invocation candidate | session selection intent | adapter supplies candidate; resolver decides applicability/precedence |
| `interactiveMode.ts` mutating `process.env.LOG_TO_FILE` | REPLACE / RELOCATE | logging concern/invocation candidate + logging implementation | user-selectable file logging intent | no process-global mutation to communicate configuration; pass effective logging config explicitly |
| `llmService.ts` reading `API_MODEL_DEFAULT` | SPLIT / RELOCATE | AI provider-selection concern through IS-3 | environment can be valid candidate source | AI capability receives effective provider/model selection; no direct env precedence |
| `githubService.ts` reading `GITHUB_TOKEN` | SPLIT / RELOCATE | protected credential concern/source -> IS-6 provider construction/request | environment-backed token mechanism can be retained initially | no direct env read in Repository Capability; inject protected credential/effective config |
| `loggerService.ts` reading `LOG_TO_FILE` | SPLIT / RELOCATE | logging concern/effective invocation config | environment may be permitted source if concern says so | logger consumes resolved config; no private precedence |
| root `index.ts` reading `DEBUG` | SPLIT / RELOCATE | bootstrap/invocation logging/debug concern where approved | early diagnostic switch intent | capture environment observation at boundary; no ad hoc process-global policy |
| `.env.example` | RETAIN AS DOCUMENTATION / ADAPT | environment source mapping documentation | inventory of candidate environment names | examples do not define precedence/defaults; remove placeholder values that resemble live credentials during implementation hardening and document sensitivity |
| `config/llmRegistry.json` | RECLASSIFY / RETAIN IN OWNING CAPABILITY | AI Resource Registry/AI Capability, not automatically IS-3 config | provider/model registry data | registry/resource data is not configuration merely because stored under `config/` |
| `config/repositoryRegistry.json` | RECLASSIFY / RETAIN IN OWNING CAPABILITY | Repository/Resource Registry owner | repository registry data | do not treat registry entries as configuration candidates unless a concern explicitly references them |
| service tests mutating `process.env` | SPLIT / ADAPT | source adapter tests + capability tests | useful environment scenarios | test immutable `EnvironmentObservation`; direct env tests limited to boundary-capture adapter |
| configuration singleton reset in tests | REPLACE | fresh resolver/composition per test | isolation intent | explicit construction, no global reset lifecycle |

---

## 39. Migration Sequence

Implementation should proceed in this order:

1. add concern/source/candidate/policy/effective-result contracts and stable diagnostics;
2. implement explicit concern catalogue and policy registry with duplicate-ID validation;
3. implement source applicability and candidate validation using fake sources;
4. implement policy resolver with table-driven precedence/fallback/conflict tests;
5. implement bootstrap/operation stage guards and selective snapshot builder;
6. implement bounded environment observation and invocation/default sources;
7. adapt approved `AppConfig` Zod schemas into concern-local schemas;
8. implement tool/project file-backed read sources through IS-4 once Settings storage conventions are concretely available;
9. implement protected-value handle and migrate GitHub/AI credentials away from direct `process.env` reads;
10. integrate IS-3 with IS-1/IS-2 staged bootstrap/project/scope lifecycle;
11. migrate `verbose`, `dryRun`, logging and other approved invocation flags from mutable `configService` state;
12. migrate provider/model/repository/domain consumers to effective snapshot projections;
13. add invalidation hook from IS-19 Settings persistence workflows;
14. remove `ConfigService` singleton/global reset and `IConfigService` after all consumers migrate;
15. remove direct shared-configuration `process.env` reads outside the boundary/environment adapter, while preserving IS-5's separately specified child-process environment mechanics.

During migration, a compatibility adapter may expose read-only legacy `getConfig()` projections backed by an accepted effective snapshot. It shall not expose `setFlag`, `setGitUser`, `reset`, direct environment reads or a mutable singleton.

---

## 40. Traceability

| Governing area | IS-3 implementation |
|---|---|
| FR-CONFIG-001–004 | one resolver/catalogue/policy boundary; sources provide candidates; IS-1 retains execution authority |
| FR-CONFIG-005–015 | explicit source classes, applicability, invocation/environment/provider permissions and project association |
| FR-CONFIG-016–022 | concern-specific immutable policies, reusable project-local/shared/tool fragment, deterministic effective values |
| FR-CONFIG-023–027 | structured validation and explicit candidate presence states |
| FR-CONFIG-028–031 | reason-specific fallback and explicit built-in-default candidates/provenance |
| FR-CONFIG-032–034 | required/optional result states and pre-effect snapshot acceptance |
| FR-CONFIG-035–038 | UI-independent resolver, interaction-required hand-off and candidate re-entry/cancellation |
| FR-CONFIG-039–042 | Headless never prompts; equivalent normalized sources/policy yield equivalent result |
| FR-CONFIG-043–046 | safe provenance/explanation projection without secret reconstruction/disclosure |
| FR-CONFIG-047–052 | no resolver writes; IS-19 persistence + invalidation; immutable active snapshots |
| FR-CONFIG-053–057 | sensitivity propagation and bounded protected-value handles |
| FR-CONFIG-058–061 | registry/state/cache data does not automatically become configuration authority |
| FR-CONFIG-062–063 | concern catalogue retains semantic owner while centralizing resolution mechanics |
| FR-CONFIG-064–067 | authoritative IS-2 project/scope associations; configuration cannot expand scope |
| FR-CONFIG-068–070 | invocation candidates and cross-mode equivalence through normalized context |
| FR-CONFIG-071–074 | normalized failures/conflicts/remediation and safe diagnostics |
| FR-CONFIG-075–076 | Settings CRUD explicitly separate from effective-value semantics |
| DD-CORE-BOOT-001–002 | bootstrap eligibility encoded in descriptors/applicability; project-dependent sources rejected pre-context |
| DD-CORE-BOOT-003–005 | operation resolution consumes sufficient IS-2 context and produces required snapshot before dependent scope finalization |
| DD-CORE-BOOT-006–007 | material conflict/revalidation evidence and explicit bounded Engine checkpoint; no recursive resolver loop |
| DD-CORE-BOOT-008–009 | same semantics across adapters; configuration-before-scope supported only where scope consumes those values |
| IS-1 | explicit staged calls, interaction hand-off, snapshot acceptance and final outcome authority |
| IS-2 | project identity/context/scope remain external authoritative inputs/outputs, never reconstructed by IS-3 |

---

## 41. Version 1 Implementation Baseline

The concrete Version 1 configuration path is:

```text
IS-23/IS-1 boundary
  argv/host inputs + bounded environment observation
        |
        v
requested configuration concerns
        |
        v
IS-3 concern catalogue + stage applicability
        |
        v
approved sources -> immutable candidates + provenance
        |
        v
validation -> concern-specific policy -> fallback/conflict
        |
        +--> interaction_required -> IS-1/IS-22 -> candidate re-entry
        |
        v
bootstrap effective values (when pre-project)
        |
        v
IS-2 ManagedProjectContext
        |
        v
project-aware effective values / immutable operation snapshot
        |
        +--> IS-2 scope finalization where configuration is an input
        |
        v
IS-1/use-case interpretation, safety, authorization and execution
```

The non-drift rule is:

> **Version 1 Configuration Resolution is the sole application-core mechanism for deciding which governed configuration candidate is effective, but an effective value remains input to application semantics: it does not become project authority, managed scope, authorization, persistence intent or final execution authority.**
