# IS-16 — Nuxt Domain Implementation Specification

> **Document type:** Level 4 Implementation Specification
>
> **Status:** Version 1 implementation baseline
>
> **Implementation ID:** IS-16
>
> **Primary Detailed Design:** [DD-3.3 — Nuxt Domain](../dd_3_high_coupling_domains/dd-3-3-nuxt-domain-detailed-design-v01.md)
>
> **Primary Functional authority:** [Nuxt Functional Specification](../functional/nuxt-functional-specification-v01.md)
>
> **Primary DD contract:** [Nuxt Layer Scaffold Artefact Ownership](../dd_2_shared_capabilities/dd-2-10-nuxt-capability-detailed-design-v01.md#_16-layer-scaffolding-and-resource-registry)
>
> **Principal shared capability:** [IS-13 — Nuxt Capability](is-13-nuxt-capability-implementation-specification-v01.md)
>
> **Application Core:** [IS-1 — Application Runtime and Invocation](is-1-application-runtime-and-invocation-implementation-specification-v01.md), [IS-2 — Managed Project Resolution](is-2-managed-project-resolution-implementation-specification-v01.md), [IS-3 — Configuration Resolution](is-3-configuration-resolution-implementation-specification-v01.md)
>
> **Supporting implementations:** [IS-4 — Resource Access](is-4-resource-access-implementation-specification-v01.md), [IS-7 — Source Intelligence](is-7-source-intelligence-implementation-specification-v01.md), [IS-8 — Source Transformation](is-8-source-transformation-implementation-specification-v01.md), [IS-9 — Resource Registry and Template](is-9-resource-registry-and-template-implementation-specification-v01.md), [IS-10 — AI Capability](is-10-ai-capability-implementation-specification-v01.md), [IS-11 — Quality Capability](is-11-quality-capability-implementation-specification-v01.md), [IS-12 — Documentation Capability](is-12-documentation-capability-implementation-specification-v01.md), [IS-14 — App Domain](is-14-app-domain-implementation-specification-v01.md), [IS-15 — Git Domain](is-15-git-domain-implementation-specification-v01.md), IS-19 Settings Domain, IS-22 Interaction Adapters, [IS-23 — Build and Runtime Assembly](is-23-build-and-runtime-assembly-implementation-specification-v01.md)
>
> **Runtime decision:** [ADR-0001 — Primary Application Runtime](../project_management/decisions/adr-0001-primary-application-runtime.md)
>
> **Register:** [AppManager Implementation Specification](implementation-specification-v01.md)
>
> **Governing plan:** [Implementation Specification Plan](../project_management/implementation-specification-plan-v01.md)

## 1. Purpose

IS-16 defines the concrete Node.js/TypeScript implementation of AppManager's Nuxt domain: the application domain that owns Nuxt-specific intent, target/applicability policy, composed orchestration and Nuxt-domain acceptance.

The governing implementation rules are:

> **Nuxt Domain owns Nuxt application intent and composed acceptance; IS-13 owns bounded Nuxt-specific technical semantics; IS-1 retains final application authority.**

> **Managed-project identity and mutation scope come from IS-2. Nuxt recognition is evidence, not authority.**

> **Layer creation is Nuxt orchestration ownership, not semantic ownership of every scaffold artefact.**

> **Nuxt composition relationships and Git repository relationships remain orthogonal.**

> **Successful rendering, persistence, transformation, Git work, documentation generation, AI work or quality execution is subordinate evidence until the Nuxt postconditions are evaluated.**

---

## 2. Scope and Non-Ownership

IS-16 implements:

- canonical Nuxt use-case identities and descriptors;
- root/layer/configuration/prospective-layer target interpretation;
- operation-specific applicability/manageability/eligibility;
- Nuxt project/configuration inspection and manageable-entry listing;
- supported configuration add/remove orchestration;
- Nuxt layer creation profile selection, target safety, stage ordering and completeness;
- cross-owned scaffold contribution orchestration;
- layer integration and detachment policy;
- lifecycle-state interpretation across Nuxt composition and repository dimensions;
- Nuxt-specific stale-state, collision, cancellation, partial-effect and recovery handling;
- Nuxt-domain diagnostics/events/results and postcondition acceptance.

IS-16 does not implement:

- invocation/authorization/final application outcomes — IS-1;
- managed topology/scope/targetability — IS-2;
- configuration precedence — IS-3;
- resource persistence mechanics — IS-4;
- source recognition/transformation mechanics — IS-7/IS-8;
- registry/template semantics — IS-9;
- AI provider semantics — IS-10;
- quality execution/gates — IS-11/IS-18;
- documentation semantics — IS-12/IS-17;
- bounded Nuxt technical interpretation/planning/validation — IS-13;
- App lifecycle — IS-14;
- Git semantics — IS-15;
- Settings/licence-management semantics — IS-19;
- prompts/presentation — IS-22;
- runtime composition — IS-23.

---

## 3. Concrete Module Boundary

```text
app/
└── domains/
    └── nuxt/
        ├── contracts/
        │   ├── nuxt-use-case.ts
        │   ├── nuxt-domain-target.ts
        │   ├── nuxt-applicability.ts
        │   ├── nuxt-configuration-intent.ts
        │   ├── layer-creation-intent.ts
        │   ├── layer-integration-intent.ts
        │   ├── layer-lifecycle.ts
        │   ├── nuxt-stage.ts
        │   ├── nuxt-result.ts
        │   ├── nuxt-recovery.ts
        │   └── nuxt-diagnostic.ts
        ├── catalogue/
        │   └── nuxt-use-case-catalogue.ts
        ├── policy/
        │   ├── target-resolver.ts
        │   ├── applicability-evaluator.ts
        │   ├── configuration-policy.ts
        │   ├── layer-profile-policy.ts
        │   ├── layer-target-safety.ts
        │   ├── integration-policy.ts
        │   └── continuation-policy.ts
        ├── orchestration/
        │   ├── configuration-change-runner.ts
        │   ├── layer-creation-runner.ts
        │   ├── layer-integration-runner.ts
        │   ├── nuxt-acceptance.ts
        │   └── recovery-builder.ts
        └── use-cases/
            ├── inspect-nuxt.ts
            ├── inspect-configuration.ts
            ├── list-configuration.ts
            ├── add-configuration.ts
            ├── remove-configuration.ts
            ├── create-layer.ts
            ├── integrate-layer.ts
            └── detach-layer.ts
```

Semantic ownership determines placement. No generic project-generation framework or second Nuxt technical capability is introduced.

---

## 4. Public Use-Case Seam

```ts
export interface NuxtUseCase<TInput, TPayload> {
  readonly descriptor: NuxtUseCaseDescriptor;
  availability(context: ApplicationExecutionContext, input: TInput): Promise<NuxtAvailability>;
  validate(context: ApplicationExecutionContext, input: TInput): Promise<NuxtValidation>;
  execute(context: ApplicationExecutionContext, input: TInput): Promise<NuxtDomainResult<TPayload>>;
}
```

`NuxtDomainResult` is subordinate to IS-1's canonical outcome and never adds a competing `success` Boolean.

---

## 5. Canonical Nuxt Command Identities

```text
nuxt.inspect
nuxt.inspect-configuration
nuxt.list-configuration
nuxt.add-configuration
nuxt.remove-configuration
nuxt.create-layer
nuxt.integrate-layer
nuxt.detach-layer
```

These map directly to DD-3.3 operation identities. Transitional aliases may exist only in IS-22 and do not create separate semantics.

Historical `nuxt.extractDocs` belongs to Docs semantics, and `nuxt.manageEnv` belongs to Settings/environment-definition semantics; neither remains a Nuxt-domain use case merely because its legacy command path is under `nuxt`.

---

## 6. Domain Target Model

```ts
export type NuxtDomainTarget =
  | { readonly kind: 'root_application'; readonly entity: ManagedProjectEntityId }
  | { readonly kind: 'managed_layer'; readonly entity: ManagedProjectEntityId }
  | { readonly kind: 'configuration_target'; readonly entity: ManagedProjectEntityId; readonly configuration: NuxtConfigurationTargetId }
  | { readonly kind: 'prospective_layer'; readonly identity: ProspectiveLayerIdentity; readonly location: ManagedResourceTarget };
```

Existing targets must resolve through IS-2. A source path or discovered `nuxt.config.*` file cannot create domain targetability.

Prospective-layer identity/location comes from an IS-1/IS-2-governed creation context; IS-16 does not convert arbitrary paths into mutation scope.

---

## 7. Applicability and Eligibility

```ts
export interface NuxtApplicabilityDecision {
  readonly operation: NuxtOperationId;
  readonly target: NuxtDomainTarget;
  readonly state: 'applicable' | 'not_applicable' | 'already_satisfied' | 'unsupported' | 'ambiguous' | 'indeterminate';
  readonly evidence: readonly NuxtEvidenceReference[];
  readonly diagnostics: readonly NuxtDiagnostic[];
}
```

IS-16 combines authoritative IS-2 target/scope and IS-3 effective configuration with fresh IS-13 technical facts. It may narrow managed scope but cannot broaden it.

`recognized` from IS-13 never equals `applicable` or `authorized` automatically.

---

## 8. IS-13 Nuxt Capability Boundary

IS-16 receives an injected `NuxtCapability` from IS-13 and uses its normalized `recognize`, `inspectConfiguration`, `planConfigurationChange`, `inspectLayer`, `planScaffold`, `planRelationshipChange` and `validate` operations.

IS-16 never:

- parses `nuxt.config.*` directly;
- manipulates AST/CST/source nodes;
- selects a Nuxt parser/provider by implementation detail;
- writes source through IS-13;
- infers application scope from technical Nuxt facts;
- treats IS-13 validation as final AppManager acceptance.

---

## 9. Nuxt Inspection

`nuxt.inspect` is non-mutating. It resolves an explicit root/layer target, requests bounded IS-13 recognition/layer facts and returns normalized Nuxt-domain facts required by approved use cases.

The result distinguishes root application, managed layer, standalone/integrated state, supported/unsupported technical structure and Nuxt composition evidence.

Git relationship evidence may be included as a separately identified dimension through IS-15/managed topology where required; it never proves Nuxt composition.

Inspection produces no reusable mutation authorization.

---

## 10. Configuration Inspection

```ts
export interface InspectNuxtConfigurationInput {
  readonly target: NuxtExistingTargetSelector;
  readonly classes?: readonly NuxtConfigClass[];
}
```

IS-16 resolves the exact Nuxt/configuration target before IS-13 inspection. Results preserve semantic class, entry identity, structural context, manageability, provenance and safe sensitivity projection.

Unsupported/observe-only entries remain explicitly distinct from manageable entries.

---

## 11. List Configuration

`nuxt.list-configuration` is a stable machine-consumable projection of supported manageable IS-13 configuration entries for one resolved target.

```ts
export interface NuxtManageableEntrySummary {
  readonly id: NuxtConfigEntryId;
  readonly class: NuxtConfigClass;
  readonly target: NuxtConfigurationTargetId;
  readonly context: NuxtConfigStructuralContext;
  readonly safeValue: NuxtConfigSafeProjection;
  readonly revision: ResourceRevisionEvidence;
}
```

It does not expose raw source or provider nodes and does not grant mutation authority.

---

## 12. Add Configuration Input

```ts
export interface AddNuxtConfigurationInput {
  readonly target: NuxtExistingTargetSelector;
  readonly class: NuxtConfigClass;
  readonly value: NuxtConfigRequestedValue;
  readonly semanticLocation?: NuxtConfigSemanticLocation;
}
```

The target, semantic class/value and intended semantic location must be explicit or deterministically resolvable.

Arbitrary object-key paths are not accepted as a generic mutation API.

---

## 13. Add Configuration Sequence

```text
IS-1 context
 -> IS-2 exact target
 -> IS-13 configuration inspection
 -> IS-16 add/equivalence/conflict policy
 -> IS-13 semantic change plan
 -> IS-1 effect review/authorization where required
 -> IS-8 bounded transformation
 -> IS-13 Nuxt validation
 -> IS-16 postcondition acceptance
 -> IS-1 final acceptance
```

Equivalent existing entries produce `already_satisfied`; conflicting entries require an explicitly specified replacement/update path or refusal. Version 1 `add` never silently mutates a conflicting entry.

---

## 14. Remove Configuration Input

```ts
export interface RemoveNuxtConfigurationInput {
  readonly target: NuxtExistingTargetSelector;
  readonly entry: NuxtConfigEntryId;
  readonly expectedRevision?: ResourceRevisionEvidence;
}
```

Removal is exact-entry based. If an entry is already absent, IS-16 may classify `already_satisfied` after fresh inspection.

Known consequences to Nuxt composition/profile requirements are surfaced before authorization. Removal never deletes siblings/unsupported regions merely because they share a source structure.

---

## 15. Configuration Mutation and Acceptance

IS-13 returns semantic plans; IS-8 owns existing-source transformation and stale-write/preservation mechanics.

IS-16 binds the selected target/entry/postcondition to the transformation request and retains the source revision used for the policy decision.

After IS-8 application, IS-16 requests fresh IS-13 inspection/validation and checks the semantic postcondition.

Source-transformation success alone is insufficient.

---

## 16. Layer Creation Input

```ts
export interface CreateNuxtLayerInput {
  readonly identity: ProspectiveLayerIdentity;
  readonly target: ManagedResourceTarget;
  readonly profile: NuxtLayerProfileId;
  readonly inputs: NuxtLayerCreationInputs;
  readonly integration?: 'standalone' | { readonly host: ManagedProjectEntityId };
  readonly git?: NuxtLayerGitIntent;
}
```

Layer creation and integration remain separable. `integration: 'standalone'` is a complete valid intent.

Profile IDs are documented capability sets, not hidden template variants.

---

## 17. Layer Target Safety

Before consequential creation, IS-16 requests bounded IS-4 target evidence and evaluates collision policy.

```ts
export type LayerTargetSafetyState =
  | 'absent_safe'
  | 'existing_empty_safe'
  | 'existing_appmanager_owned_resumable'
  | 'collision'
  | 'indeterminate';
```

Version 1 default permits only absent/explicitly safe empty targets. A future resumable mode requires separately specified ownership/recovery semantics; its enum presence does not enable it.

Non-empty/unrelated/indeterminate targets are refused. No force-overwrite Boolean is exposed.

---

## 18. Layer Profile Resolution

IS-16 resolves the requested profile against IS-13's profile catalogue and operation-effective IS-3 inputs.

A resolved profile supplies:

- Nuxt baseline requirements;
- required/optional artefact classes;
- Nuxt-specific inputs;
- contribution requirements;
- Nuxt validation/postconditions.

It does not transfer semantic ownership of documentation, licence, registry/template, Git, quality or AI artefacts to Nuxt.

---

## 19. Scaffold Contribution Contract

```ts
export interface LayerScaffoldContribution {
  readonly class: NuxtScaffoldArtefactClass;
  readonly requirement: 'required' | 'optional';
  readonly semanticOwner: AppManagerComponentId;
  readonly target: ManagedResourceTarget;
  readonly proposal: AppManagerProposalReference;
  readonly validation: readonly EvidenceReference[];
}
```

The `semanticOwner` is explicit for cross-owned contributions. IS-16 interprets whether the contribution satisfies the selected profile; it does not reimplement the specialist's semantics.

---

## 20. Cross-Owned Artefact Routing

Initial routing follows the binding clarification:

| Artefact concern | Semantic/technical route | Nuxt role |
|---|---|---|
| Nuxt config/layer baseline | IS-13 | owns profile requirement and interprets Nuxt validity |
| declarative package/config/scaffold resource | IS-9 | supplies bounded rendered proposal |
| README simple declarative scaffold | IS-9 | requires contribution; does not own docs semantics |
| README documentation modeling/generation | IS-12 | supplies documentation proposal/evidence |
| licence identity/management | IS-19/effective application policy | consumes approved identity; no competing precedence |
| licence resource rendering | IS-9 | consumes rendered licence resource |
| new resource persistence | IS-4 | delegates authorized creation |
| existing resource modification | IS-8 | delegates authorized transformation |
| repository initialization/relationship | IS-15 | delegates Git intent through nested use case |
| optional AI enrichment | IS-10 or owning AI semantics | consumes proposal only |
| explicit quality evidence | IS-11/IS-18 | consumes evidence only |

---

## 21. Layer Creation Stage Model

```ts
export type NuxtLayerCreationStage =
  | 'resolve_target'
  | 'validate_target_safety'
  | 'resolve_profile'
  | 'plan_scaffold'
  | 'render_contributions'
  | 'authorize_effects'
  | 'persist_resources'
  | 'validate_nuxt_baseline'
  | 'repository_setup'
  | 'integrate_layer'
  | 'final_validate';
```

Stages not required by the selected intent/profile are explicitly `not_required`, not silently omitted from machine results.

Repository setup and integration are optional subordinate stages and do not define successful standalone layer creation unless selected profile/intent requires them.

---

## 22. Layer Creation Planning

Before persistence, IS-16 obtains an IS-13 scaffold plan and all required cross-owned proposals needed to make the intended effect set reviewable.

The plan identifies exact targets, create-versus-transform disposition, required/optional status, semantic owner, expected source/resource preconditions and postconditions.

A renderer proposal never writes its own output.

If a required contribution cannot be safely planned, no creation effects begin unless an explicitly specified partial-creation policy permits it. Version 1 defaults to fail-before-effects for unresolved required planning dependencies.

---

## 23. Layer Creation Persistence

New resources are created through IS-4 with explicit target/precondition evidence. Existing-source modification, where the selected safe workflow explicitly permits it, uses IS-8.

The Version 1 default creation profile does not overwrite unrelated existing resources.

Creation order is dependency-aware and deterministic. Directory existence alone is not recorded as layer success.

Every completed resource effect is retained in IS-1 effect evidence.

---

## 24. Layer Creation Validation

After baseline persistence, IS-16 asks IS-13 to validate the resulting layer against the resolved profile.

Required cross-owned contribution results are then checked for completeness. Optional contribution failure becomes warning/partial evidence according to profile policy rather than silently redefining the profile.

A valid Nuxt baseline plus missing required profile artefact is not complete profile success.

A rendered/persisted scaffold plus invalid Nuxt baseline is not Nuxt layer success.

---

## 25. Optional Repository Setup

When creation intent includes repository setup, IS-16 invokes IS-15 `git.initialise` or another exact Git use case through IS-1's nested-use-case authority path.

Nuxt does not call IS-6 repository primitives directly for Git application intent.

Git results remain independently represented. Repository failure does not erase a successfully created Nuxt baseline; the selected profile/intent determines whether the overall Nuxt result is partial or failed.

---

## 26. Optional Creation-Time Integration

If creation intent requests integration, IS-16 executes the same integration semantics as `nuxt.integrate-layer` after standalone layer postconditions are sufficiently established.

Creation does not gain a hidden alternate integration implementation.

If integration fails after successful creation, the layer remains a truthful standalone created layer with a remaining integration action.

---

## 27. Integration Input

```ts
export interface IntegrateNuxtLayerInput {
  readonly host: ManagedProjectEntityId;
  readonly layer: ManagedProjectEntityId;
  readonly relationship: NuxtLayerRelationshipIntent;
  readonly repositoryRelationship?: NuxtRequestedRepositoryRelationship;
}
```

Host and layer are exact IS-2 managed identities. The layer may be independently valid before integration.

---

## 28. Nuxt Relationship versus Git Relationship

```ts
export interface NuxtLayerRelationshipState {
  readonly host: ManagedProjectEntityId;
  readonly layer: ManagedProjectEntityId;
  readonly composition: 'integrated' | 'not_integrated' | 'ambiguous' | 'unsupported';
  readonly repository: 'linked' | 'not_linked' | 'not_applicable' | 'unknown';
}
```

These dimensions are never collapsed into one Boolean.

A Git submodule relationship does not prove a Nuxt `extends` relationship; a Nuxt composition relationship does not prove repository linkage.

---

## 29. Integration Sequence

```text
resolve host + layer via IS-2
 -> IS-13 inspect both
 -> IS-16 integration applicability
 -> IS-13 semantic relationship plan
 -> review/authorize exact source effect
 -> IS-8 apply bounded host configuration change
 -> IS-13 re-inspect/validate composition
 -> optional explicit IS-15 repository relationship
 -> Nuxt integration acceptance
```

Where repository relationship is also requested, its ordering relative to source integration is fixed by the resolved integration plan and both dimensions remain independently observable.

---

## 30. Integration Applicability

Integration requires:

- managed host/layer identity;
- supported Nuxt host configuration target;
- layer technical validity sufficient for the relationship;
- no unresolved conflicting/equivalent composition entry;
- targetability/authorization eligibility;
- bounded semantic relationship plan.

Already-integrated equivalent state is `already_satisfied`.

Conflicting/ambiguous relationships are refused unless a separately specified replacement path exists.

---

## 31. Detachment Input

```ts
export interface DetachNuxtLayerInput {
  readonly host: ManagedProjectEntityId;
  readonly layer: ManagedProjectEntityId;
  readonly relationship?: NuxtRelationshipId;
}
```

Detachment means remove the Nuxt composition relationship from the selected host. It does not mean delete the layer, delete files, remove the managed-project entity, delete a repository, remove a submodule or delete a remote repository.

---

## 32. Detachment Sequence

1. resolve exact host/layer and current composition facts;
2. classify absent/already-detached/equivalent/conflicting state;
3. obtain IS-13 semantic detachment plan;
4. expose consequences and authorize exact source effect where required;
5. apply through IS-8;
6. re-inspect through IS-13;
7. verify selected composition relationship is absent;
8. report repository relationship as an independent remaining state.

Already absent is `already_satisfied` where identity can be established safely.

---

## 33. Lifecycle State

```ts
export type NuxtLayerLifecycleState =
  | 'prospective'
  | 'standalone_valid'
  | 'integrated_valid'
  | 'standalone_partial'
  | 'integrated_partial'
  | 'unsupported'
  | 'ambiguous';
```

Lifecycle state is derived from authoritative managed identity plus current Nuxt technical/profile evidence. Repository state is a related dimension, not lifecycle identity.

IS-16 does not invent project lifecycle membership from filesystem discovery.

---

## 34. Stale State and Preconditions

Consequential operations bind decisions to the evidence used to plan them:

- managed topology revision;
- target/resource identity;
- configuration/source revision;
- current semantic entry/relationship identity;
- layer target collision evidence;
- selected profile/version;
- cross-owned proposal identities where material.

IS-8/IS-4 enforce low-level revision/resource preconditions; IS-16 interprets a mismatch as stale domain intent and does not silently re-plan a materially different effect under old authorization.

---

## 35. Collision and Overwrite Policy

No Nuxt use case exposes a generic `force` switch that means overwrite/ignore safety/Headless.

Creation collision, configuration conflict and relationship conflict are distinct conditions with distinct policy.

Unsupported source shapes are not overwritten into a preferred shape merely to make management easier.

---

## 36. Cancellation

IS-1 `AbortSignal` propagates to all subordinate calls.

Layer creation checks cancellation before every new consequential stage/resource effect. Completed effects remain completed and are recorded.

Cancellation does not imply rollback or resource deletion.

A cancelled creation may therefore leave a valid standalone partial scaffold; recovery reports what exists and what remains.

---

## 37. Partial Effects

```ts
export interface NuxtStageResult {
  readonly stage: NuxtStageId;
  readonly state: 'completed' | 'already_satisfied' | 'not_required' | 'failed' | 'cancelled' | 'indeterminate' | 'not_attempted';
  readonly effects: readonly ApplicationEffectEvidence[];
  readonly evidence: readonly EvidenceReference[];
  readonly diagnostics: readonly NuxtDiagnostic[];
}
```

Later failure never erases earlier resource/source/Git effects.

IS-16 does not claim cross-capability transactions or rollback unless a future specification explicitly establishes them.

---

## 38. Recovery

```ts
export interface NuxtRecoveryPosition {
  readonly target: NuxtDomainTarget;
  readonly completedStages: readonly NuxtStageId[];
  readonly completedEffects: readonly ApplicationEffectEvidence[];
  readonly indeterminateEffects: readonly NuxtIndeterminateEffect[];
  readonly remainingActions: readonly NuxtRemainingAction[];
  readonly revalidation: readonly NuxtRevalidationRequirement[];
}
```

Recovery is informational in Version 1. Retrying/restarting revalidates IS-2 scope, IS-3 material inputs, target/resource/source state, IS-13 Nuxt facts and any Git relationship state.

---

## 39. Result Payload

```ts
export interface NuxtDomainPayload {
  readonly operation: NuxtOperationId;
  readonly target: NuxtDomainTarget;
  readonly applicability: NuxtApplicabilityDecision;
  readonly stages: readonly NuxtStageResult[];
  readonly resultingFacts: readonly NuxtEvidenceReference[];
  readonly lifecycle?: NuxtLayerLifecycleState;
  readonly remainingActions: readonly NuxtRemainingAction[];
  readonly recovery?: NuxtRecoveryPosition;
}
```

IS-1 maps the domain interpretation into the canonical application outcome.

---

## 40. Nuxt Acceptance

Use-case-specific acceptance includes:

- inspect: requested supported facts produced without mutation;
- inspect/list configuration: exact target interpreted with truthful support/manageability state;
- add: requested semantic entry is present in the intended context after bounded transformation;
- remove: exact requested entry is absent without known unintended semantic removal;
- create layer: selected profile's required Nuxt baseline/contributions satisfy profile postconditions;
- integrate: selected layer is demonstrably part of the intended host Nuxt composition;
- detach: selected Nuxt composition relationship is demonstrably absent.

Subordinate capability/domain success is evidence, not these postconditions.

---

## 41. Diagnostics

Initial stable codes include:

```text
NUXT_OPERATION_UNAVAILABLE
NUXT_TARGET_REQUIRED
NUXT_TARGET_NOT_MANAGED
NUXT_TARGET_AMBIGUOUS
NUXT_STRUCTURE_UNSUPPORTED
NUXT_STATE_INDETERMINATE
NUXT_CONFIG_TARGET_AMBIGUOUS
NUXT_CONFIG_CLASS_UNSUPPORTED
NUXT_CONFIG_ENTRY_NOT_MANAGEABLE
NUXT_CONFIG_ENTRY_ALREADY_PRESENT
NUXT_CONFIG_ENTRY_CONFLICT
NUXT_CONFIG_ENTRY_ALREADY_ABSENT
NUXT_CONFIG_ENTRY_STALE
NUXT_CONFIG_POSTCONDITION_FAILED
NUXT_LAYER_PROFILE_REQUIRED
NUXT_LAYER_PROFILE_UNSUPPORTED
NUXT_LAYER_TARGET_COLLISION
NUXT_LAYER_TARGET_INDETERMINATE
NUXT_LAYER_REQUIRED_CONTRIBUTION_UNAVAILABLE
NUXT_LAYER_BASELINE_INVALID
NUXT_LAYER_PARTIAL
NUXT_INTEGRATION_ALREADY_PRESENT
NUXT_INTEGRATION_CONFLICT
NUXT_INTEGRATION_UNSUPPORTED
NUXT_INTEGRATION_POSTCONDITION_FAILED
NUXT_DETACH_ALREADY_ABSENT
NUXT_DETACH_POSTCONDITION_FAILED
NUXT_REPOSITORY_RELATIONSHIP_REMAINS
NUXT_STALE_STATE
NUXT_CANCELLED
NUXT_RECOVERY_REVALIDATION_REQUIRED
```

Diagnostics identify affected root/layer/configuration/stage where material and contain no provider-native contracts.

---

## 42. Interaction Independence

No IS-16 module imports `@clack/prompts`, terminal colors or IDE APIs.

Missing target/profile/entry/integration decisions are structured decision requirements. Headless mode never chooses a first layer/config entry/profile, broadens scope, overwrites a collision or invents a default destructive action.

IS-22 owns presentation/acquisition only.

---

## 43. Events and Observability

Semantic events may include:

```text
nuxt.target.resolved
nuxt.configuration.planned
nuxt.configuration.applied
nuxt.layer.creation.started
nuxt.layer.stage.started
nuxt.layer.stage.completed
nuxt.layer.partial
nuxt.integration.completed
nuxt.detachment.completed
nuxt.recovery.available
```

Events contain safe IDs/stage/effect/diagnostic references and subordinate correlation IDs, not raw source/secrets/provider payloads.

---

## 44. Security and Sensitive Data

Private runtime configuration values are minimized according to IS-13 sensitivity projections.

Nuxt does not read credentials directly. Git credentials remain below IS-15/IS-6; AI disclosure follows IS-10; licence/configuration values come from governed inputs.

Generated `.env`-style examples contain placeholders only unless a separately authorized Settings use case supplies approved non-secret values.

No scaffold profile embeds personal credentials, tokens or secret defaults.

---

## 45. Conflict and Concurrency Keys

Consequential use cases expose IS-1 conflict keys such as:

```text
nuxt-config:<configuration-target-id>
nuxt-layer-target:<managed-resource-target-id>
nuxt-composition:<host-entity-id>:<layer-entity-id>
```

Operations modifying the same configuration/creation target conflict. Unrelated layers are not globally serialized.

A nested IS-15 operation also contributes its Git conflict keys; Nuxt does not suppress them.

---

## 46. Idempotency and Retry

Inspection/listing are read-only/repeatable subject to changing evidence.

Add/remove/integrate/detach classify equivalent already-satisfied states before mutation.

Layer creation may recognize already-created AppManager-owned state only if future/explicit recovery ownership evidence supports it; arbitrary existing directories are never treated as resumable.

After uncertain mutation, re-inspection precedes retry. IS-16 never blindly reapplies source changes or recreates resources.

---

## 47. Composition

IS-23 constructs:

1. IS-13 Nuxt Capability;
2. supporting IS-4/8/9/10/11/12 collaborators as configured;
3. IS-15 Git Domain nested-use-case seam;
4. IS-19 Settings/licence seam when required;
5. Nuxt policies/runners/acceptance/recovery builder;
6. eight Nuxt use cases;
7. immutable Nuxt descriptor catalogue;
8. IS-1 registrations.

No import-time singleton or direct environment/config read exists in IS-16.

---

## 48. App and Other Domain Coordination

IS-14 may invoke Nuxt operations as subordinate use cases where App lifecycle requires Nuxt work. App retains App acceptance.

IS-16 invokes IS-15 only for explicit Git intent required by the Nuxt workflow. Nuxt retains Nuxt acceptance; Git retains Git acceptance.

Documentation/Quality/Settings/AI application intent remains with IS-17/18/19/20 when that is the primary requested use case. Layer creation may consume their specialist/cross-owned contributions without duplicating those domains.

---

## 49. Testing Requirements

Core tests cover at least:

1. eight canonical IDs;
2. aliases do not create semantics;
3. `extractDocs` not Nuxt-owned;
4. `manageEnv` not Nuxt-owned;
5. no cwd/path reconstruction of managed target;
6. root target resolution;
7. managed-layer resolution;
8. prospective-layer authority supplied, not discovered;
9. recognition does not authorize mutation;
10. applicability is operation-specific;
11. unsupported/ambiguous facts fail safe;
12. inspection non-mutating;
13. Git relationship does not imply Nuxt composition;
14. config inspection exact target;
15. observe-only vs manageable preserved;
16. sensitive config minimized;
17. list is machine-consumable;
18. add supports only manageable classes;
19. add equivalent already-satisfied;
20. add conflict refused without explicit replacement semantics;
21. add uses IS-13 plan + IS-8 application;
22. add postcondition reinspection;
23. remove exact entry identity;
24. remove already absent;
25. remove preserves siblings/unsupported source;
26. remove consequence surfaced;
27. stale source rejected;
28. transformation success not Nuxt success;
29. standalone layer creation valid;
30. creation/integration distinct;
31. profile explicit/documented;
32. profile does not become hidden template variant;
33. absent target safe;
34. empty target policy;
35. non-empty collision refused;
36. no force overwrite;
37. indeterminate collision refused;
38. IS-13 scaffold plan consumed;
39. all required contributions planned before effects;
40. renderer cannot persist;
41. IS-4 creates new resources;
42. IS-8 modifies existing resources;
43. deterministic dependency order;
44. README declarative route via IS-9;
45. documentation semantic route via IS-12;
46. licence identity does not gain Nuxt precedence;
47. licence rendering via IS-9;
48. required vs optional contributions distinct;
49. missing required contribution prevents complete success;
50. optional contribution failure represented truthfully;
51. Nuxt baseline validated after persistence;
52. valid files alone not layer success;
53. repository setup through IS-15, not IS-6 direct;
54. Git failure preserves created Nuxt effects;
55. creation-time integration reuses integration semantics;
56. integration failure preserves standalone created layer;
57. host/layer exact managed identities;
58. already integrated classification;
59. integration conflict refusal;
60. IS-13 relationship plan + IS-8 apply;
61. integration postcondition reinspection;
62. optional Git relationship independently represented;
63. Nuxt integration does not imply Git linkage;
64. Git linkage does not imply Nuxt integration;
65. detach removes composition only;
66. detach does not delete layer resources;
67. detach does not remove Git relationship;
68. detach already absent;
69. detach postcondition verification;
70. lifecycle standalone/integrated/partial truth;
71. repository dimension independent from lifecycle;
72. stale topology invalidates operation;
73. stale profile/proposal material state revalidated;
74. cancellation before new effects;
75. cancellation preserves completed effects;
76. partial stages retained;
77. no rollback claim;
78. recovery requires revalidation;
79. no blind retry after uncertain mutation;
80. no prompts/colors in domain;
81. Headless missing decision returns structured requirement;
82. no first-target/profile default;
83. no competing success Boolean;
84. diagnostics identify target/stage;
85. semantic events presentation-free;
86. no credentials in Nuxt domain;
87. AI disclosure not implicit;
88. same-config conflict key;
89. unrelated layers not globally serialized;
90. nested Git conflict keys retained;
91. explicit IS-23 composition/no singleton;
92. provider substitution leaves domain-policy tests unchanged;
93. IS-13 validation remains subordinate to IS-16 acceptance;
94. IS-16 acceptance remains subordinate to IS-1 final acceptance.

Integration tests use controlled capability/domain substitutes for policy/orchestration tests and dedicated Nuxt fixtures for IS-13/IS-8 integration, including supported, unsupported, ambiguous, stale, root/layer, standalone/integrated and partial-effect states.

---

## 50. Current Implementation Disposition

| Current artefact/responsibility | Disposition | Version 1 treatment |
|---|---|---|
| `app/commands/nuxt/createLayer.ts` product intent | **RETAIN / REPLACE implementation / RELOCATE** | Preserve `nuxt.create-layer` intent; current file is only a TODO stub, so implement through IS-16 use case/policies/runners. |
| `createLayer.ts` direct command location as semantic owner | **REPLACE** | IS-22 adapter maps to IS-1 canonical `nuxt.create-layer`; domain semantics live under `app/domains/nuxt/`. |
| `app/commands/nuxt/extractDocs.ts` | **RELOCATE / REMOVE from Nuxt domain** | Documentation extraction belongs to Docs application intent/IS-17; legacy path must not imply Nuxt ownership. |
| `app/commands/nuxt/manageEnv.ts` | **RELOCATE / REMOVE from Nuxt domain** | Environment-definition CRUD belongs to Settings/IS-19; Nuxt may consume effective values only. |
| current absence of Nuxt inspect/config/integrate/detach implementations | **ADD** | Implement eight canonical IS-16 use cases from normative Functional/DD contracts rather than inventing from legacy code. |
| current source scanner/strategy mechanisms | **RETAIN useful mechanisms below domain / RELOCATE** | IS-7/8/13 own technical semantics; IS-16 consumes normalized evidence/plans. |
| current templates/template repository | **RETAIN useful resources / ADAPT below domain** | IS-9 owns identity/rendering; IS-13 profile planning and IS-16 profile orchestration consume them. |
| current filesystem writes | **REPLACE as direct domain mechanics** | IS-4 authorized creation; IS-8 existing-source modification. |
| current Git/GitHub services | **REPLACE as direct Nuxt dependency** | IS-15 nested use cases own Git intent; Nuxt never directly uses repository provider mechanics. |
| current prompts/logging/terminal decoration in command architecture | **RELOCATE** | IS-22 presentation; IS-1 events/outcomes. |
| singleton/service-locator patterns | **REPLACE** | IS-23 explicit composition/injection. |

The sparse legacy Nuxt command surface is not treated as an architectural gap to fill by guesswork; the normative Functional/DD contracts define the implementation.

---

## 51. Migration Sequence

1. add Nuxt-domain contracts and eight canonical descriptors;
2. add IS-2-backed target resolver and operation applicability evaluator;
3. inject IS-13 Nuxt Capability and implement read-only `nuxt.inspect`;
4. implement configuration inspection/list projections;
5. implement add/remove policy over IS-13 semantic plans and IS-8 transformation;
6. implement post-mutation Nuxt validation/acceptance;
7. implement layer target-safety/collision policy;
8. implement profile resolution and scaffold contribution contracts;
9. route declarative resources through IS-9;
10. route documentation semantic contributions through IS-12;
11. route licence identity/management through IS-19/effective policy and rendering through IS-9;
12. implement dependency-aware layer creation runner using IS-4/IS-8 persistence boundaries;
13. implement profile-completeness and Nuxt baseline acceptance;
14. integrate optional Git repository setup through nested IS-15 use cases;
15. implement standalone-first creation-time integration reuse;
16. implement explicit `nuxt.integrate-layer` over IS-13 relationship plan + IS-8;
17. implement explicit `nuxt.detach-layer` without deletion semantics;
18. add lifecycle-state/orthogonal repository relationship projection;
19. add stale-state/cancellation/partial-effect/recovery semantics;
20. move `extractDocs` out of Nuxt application ownership;
21. move `manageEnv` out of Nuxt application ownership;
22. route all interaction through IS-22 and canonical IS-1 registrations;
23. remove obsolete direct command/provider/singleton paths as replacement implementations land;
24. run authority, cross-owned artefact, Headless, stale-state, partial-effect and provider-substitution conformance suites.

---

## 52. Traceability

| Implementation concern | Governing authority |
|---|---|
| authority/target/delegation | DD-NUXT-001–004; FR-NUXT-001–012 |
| target/applicability contracts | DD-NUXT-005 onward domain contract model; FR-NUXT-004–011 |
| inspection/facts | FR-NUXT-013–020; DD-3.3 inspection design |
| configuration inspect/list | FR-NUXT-021–033; DD-3.3 configuration design; IS-13 |
| configuration add/remove | FR-NUXT-034–050; DD-3.3 configuration mutation design; IS-8/IS-13 |
| layer creation/profile | FR-NUXT-051–070; DD-3.3 layer creation design; binding clarification |
| scaffold ownership | Nuxt Layer Scaffold Artefact Ownership Clarification §§1–9; IS-9/12/19 |
| integration | FR-NUXT-071–082; DD-3.3 integration design; IS-13/IS-15 |
| detachment | FR-NUXT-083–088; DD-3.3 detachment design |
| lifecycle | FR-NUXT-089–092; DD-3.3 lifecycle-state design |
| cross-domain boundaries | FR-NUXT-093–102; DD-3.3 authority tables |
| safety/stale/partial effects | FR-NUXT-103–109; DD-3.3 safety/recovery design; IS-1/4/8 |
| interaction equivalence | FR-NUXT-110–113; IS-1/IS-22 |
| Nuxt technical semantics | DD-2.10 / IS-13 |
| final application acceptance | DD-1.5 / IS-1 |

---

## 53. Version 1 Non-Drift Baseline

```text
IS-22 adapter -> IS-1 canonical invocation/authority
                     |
                     +--> IS-2 managed target/topology
                     +--> IS-3 operation-effective configuration
                     |
                     v
                IS-16 Nuxt Domain
                     |
                     +--> Nuxt target/applicability/profile policy
                     +--> configuration/layer orchestration
                     +--> cross-owned contribution policy
                     +--> partial-state/recovery interpretation
                     |
                     +--> IS-13 Nuxt technical semantics
                     +--> IS-8 source transformation
                     +--> IS-9 registry/rendering
                     +--> IS-4 resource creation
                     +--> IS-12 documentation contribution
                     +--> IS-15 explicit Git intent
                     +--> IS-19 licence/settings semantics
                     |
                     v
              Nuxt-domain acceptance
                     |
                     v
              IS-1 final acceptance
                     |
                     v
        canonical AppManager outcome
```

The non-drift rule is:

> **Version 1 Nuxt Domain owns Nuxt-specific application intent, target/applicability policy, profile selection, composed layer/configuration orchestration and Nuxt-domain acceptance. It never derives mutation authority from Nuxt discovery, turns IS-13 into a second application domain, writes source or resources through content producers, absorbs documentation/licence/Git semantics because they participate in a layer profile, equates Git relationships with Nuxt composition, silently overwrites creation targets, hides partial effects, or publishes a competing final AppManager outcome.**