# IS-13 — Nuxt Capability Implementation Specification

> **Document type:** Level 4 Implementation Specification
>
> **Status:** Version 1 implementation baseline
>
> **Implementation ID:** IS-13
>
> **Primary Detailed Design:** [DD-2.10 — Nuxt Capability](../dd_2_shared_capabilities/dd-2-10-nuxt-capability-detailed-design-v01.md)
>
> **Primary DD contract:** [Nuxt Layer Scaffold Artefact Ownership](../dd_2_shared_capabilities/dd-2-10-nuxt-capability-detailed-design-v01.md#_16-layer-scaffolding-and-resource-registry)
>
> **Related Detailed Designs:** [DD-1.1 — Application Invocation](../dd_1_application_core/dd-1-1-application-invocation-detailed-design-v01.md), [DD-1.2 — Execution Outcomes](../dd_1_application_core/dd-1-2-execution-outcomes-detailed-design-v01.md), [DD-1.3 — Managed Project](../dd_1_application_core/dd-1-3-managed-project-detailed-design-v01.md), [DD-1.4 — Configuration Resolution](../dd_1_application_core/dd-1-4-configuration-resolution-detailed-design-v01.md), [DD-1.5 — Application Engine](../dd_1_application_core/dd-1-5-application-engine-detailed-design-v01.md), [DD-2.1 — Resource Access](../dd_2_shared_capabilities/dd-2-1-resource-access-detailed-design-v01.md), [DD-2.2 — Process Execution](../dd_2_shared_capabilities/dd-2-2-process-execution-detailed-design-v01.md), [DD-2.3 — Repository Capability](../dd_2_shared_capabilities/dd-2-3-repository-capability-detailed-design-v01.md), [DD-2.4 — Source Intelligence](../dd_2_shared_capabilities/dd-2-4-source-intelligence-detailed-design-v01.md), [DD-2.5 — Source Transformation](../dd_2_shared_capabilities/dd-2-5-source-transformation-detailed-design-v01.md), [DD-2.6 — Resource Registry and Template](../dd_2_shared_capabilities/dd-2-6-resource-registry-and-template-detailed-design-v01.md), [DD-2.7 — AI Capability](../dd_2_shared_capabilities/dd-2-7-ai-capability-detailed-design-v01.md), [DD-2.8 — Quality Capability](../dd_2_shared_capabilities/dd-2-8-quality-capability-detailed-design-v01.md), [DD-2.9 — Documentation Capability](../dd_2_shared_capabilities/dd-2-9-documentation-capability-detailed-design-v01.md), [DD-3.3 — Nuxt Domain](../dd_3_high_coupling_domains/dd-3-3-nuxt-domain-detailed-design-v01.md)
>
> **Primary Functional authority:** [Nuxt Functional Specification](../functional/nuxt-functional-specification-v01.md)
>
> **Related implementations:** [IS-1 — Application Runtime and Invocation](is-1-application-runtime-and-invocation-implementation-specification-v01.md), [IS-2 — Managed Project Resolution](is-2-managed-project-resolution-implementation-specification-v01.md), [IS-3 — Configuration Resolution](is-3-configuration-resolution-implementation-specification-v01.md), [IS-4 — Resource Access](is-4-resource-access-implementation-specification-v01.md), [IS-5 — Process Execution](is-5-process-execution-implementation-specification-v01.md), [IS-6 — Repository Capability](is-6-repository-capability-implementation-specification-v01.md), [IS-7 — Source Intelligence](is-7-source-intelligence-implementation-specification-v01.md), [IS-8 — Source Transformation](is-8-source-transformation-implementation-specification-v01.md), [IS-9 — Resource Registry and Template](is-9-resource-registry-and-template-implementation-specification-v01.md), [IS-10 — AI Capability](is-10-ai-capability-implementation-specification-v01.md), [IS-11 — Quality Capability](is-11-quality-capability-implementation-specification-v01.md), [IS-12 — Documentation Capability](is-12-documentation-capability-implementation-specification-v01.md), [IS-23 — Build and Runtime Assembly](is-23-build-and-runtime-assembly-implementation-specification-v01.md)
>
> **Runtime decision:** [ADR-0001 — Primary Application Runtime](../project_management/decisions/adr-0001-primary-application-runtime.md)
>
> **Register:** [AppManager Implementation Specification](implementation-specification-v01.md)
>
> **Governing plan:** [Implementation Specification Plan](../project_management/implementation-specification-plan-v01.md)

## 1. Purpose

IS-13 defines the concrete Node.js/TypeScript implementation of AppManager's shared Nuxt Capability.

It provides provider-independent Nuxt recognition, supported Nuxt configuration interpretation, semantic configuration-change planning, Nuxt layer modeling, layer-profile/scaffold technical orchestration, host-relative integration/detachment semantics and Nuxt-specific validation without acquiring application-use-case, managed-scope, persistence, repository or final acceptance authority.

The governing implementation rules are:

> **Nuxt Capability owns Nuxt-specific technical meaning; IS-16/owning use cases own Nuxt application intent and the Application Engine retains final authority.**

> **Nuxt recognition is evidence, not authorization.**

> **A Nuxt semantic change becomes an IS-8 transformation request; Nuxt Capability does not write configuration directly.**

> **A layer profile owns the Nuxt baseline and required artefact classes, not the independent semantics of every scaffold artefact.**

> **Nuxt composition and Git repository relationships remain orthogonal state dimensions.**

> **Current templates, TODO commands, source strategies and package conventions are starting-state evidence, not the target architecture.**

---

## 2. Scope and Non-Ownership

IS-13 owns concrete implementation for:

- normalized Nuxt target identities and facts;
- root/layer/standalone-layer technical recognition;
- explicit Nuxt configuration targets;
- supported Nuxt configuration semantic classes;
- manageable versus observe-only configuration entries;
- duplicate/equivalent/conflict interpretation;
- semantic add/remove/update requests for supported classes;
- Nuxt-specific postconditions and validation;
- host-relative layer-composition facts;
- layer technical eligibility;
- layer creation profiles and Nuxt baseline requirements;
- scaffold artefact-class requests and Nuxt-specific parameter contributions;
- Nuxt baseline validation over subordinate artefact evidence;
- integration/detachment semantic plans;
- provider selection/normalization;
- Nuxt-specific diagnostics, cancellation and partial technical state.

IS-13 does **not** own:

- Nuxt-domain operation identity/applicability/profile selection/collision policy/stage ordering/domain acceptance — IS-16;
- managed project identity/scope/targetability — IS-2;
- effective-configuration precedence — IS-3;
- filesystem mutation — IS-4;
- generic process execution — IS-5;
- repository/Git policy — IS-6/IS-15;
- generic source recognition — IS-7;
- transformation planning/application/stale-write mechanics — IS-8;
- registry/template semantics — IS-9;
- AI provider/model semantics — IS-10;
- Quality execution/gates — IS-11;
- documentation modeling/generation — IS-12/IS-17;
- Settings/licence-management semantics — IS-19;
- generic App lifecycle — IS-14;
- adapter prompts/presentation — IS-22;
- final application acceptance/outcomes — IS-1.

---

## 3. Concrete Module Boundary

```text
app/
└── capabilities/
    └── nuxt/
        ├── nuxt-capability.ts
        ├── contracts/
        │   ├── nuxt-target.ts
        │   ├── nuxt-facts.ts
        │   ├── nuxt-config.ts
        │   ├── nuxt-config-change.ts
        │   ├── nuxt-layer.ts
        │   ├── nuxt-layer-profile.ts
        │   ├── nuxt-scaffold.ts
        │   ├── nuxt-relationship.ts
        │   ├── nuxt-validation.ts
        │   └── nuxt-failure.ts
        ├── recognition/
        │   ├── nuxt-recognizer.ts
        │   └── nuxt-fact-normalizer.ts
        ├── configuration/
        │   ├── nuxt-config-interpreter.ts
        │   ├── nuxt-config-catalogue.ts
        │   └── nuxt-change-planner.ts
        ├── layers/
        │   ├── nuxt-layer-modeler.ts
        │   ├── nuxt-layer-profile-catalogue.ts
        │   ├── nuxt-scaffold-planner.ts
        │   └── nuxt-relationship-planner.ts
        ├── validation/
        │   └── nuxt-validator.ts
        └── providers/
            ├── nuxt-provider.ts
            └── typescript-config/
                ├── typescript-nuxt-provider.ts
                ├── config-source-adapter.ts
                └── config-change-adapter.ts
```

Contracts remain capability-local because semantic ownership, not consumer count, determines placement.

No executable Nuxt plugin framework, common provider base class or provider self-registration mechanism is required.

---

## 4. Public Capability Contract

```ts
export interface NuxtCapability {
  recognize(request: NuxtRecognitionRequest): Promise<NuxtRecognitionResult>;
  inspectConfiguration(request: NuxtConfigInspectionRequest): Promise<NuxtConfigInspectionResult>;
  planConfigurationChange(request: NuxtConfigChangeRequest): Promise<NuxtConfigChangeResult>;
  inspectLayer(request: NuxtLayerInspectionRequest): Promise<NuxtLayerInspectionResult>;
  planScaffold(request: NuxtScaffoldRequest): Promise<NuxtScaffoldPlanResult>;
  planRelationshipChange(request: NuxtRelationshipChangeRequest): Promise<NuxtRelationshipPlanResult>;
  validate(request: NuxtValidationRequest): Promise<NuxtValidationResult>;
}
```

Every method returns technical Nuxt evidence/proposals. None performs application-level authorization, filesystem mutation, Git operations or final outcome publication.

`planScaffold()` returns a composed technical plan; it does not persist artefacts.

---

## 5. Nuxt Target Identity

```ts
export type NuxtTargetKind =
  | 'root_application'
  | 'managed_layer'
  | 'standalone_layer'
  | 'configuration_target'
  | 'prospective_layer';

export interface NuxtTargetReference {
  readonly id: NuxtTargetId;
  readonly kind: NuxtTargetKind;
  readonly projectEntity?: ProjectEntityId;
  readonly resourceRoot: ResourceReference;
  readonly host?: ProjectEntityId;
}
```

A path is evidence/resource location, not canonical Nuxt identity.

Root and layer identities remain distinct even when they share repository/workspace topology.

Prospective-layer identity is supplied by the authorized creation workflow before incorporation into Managed Project; IS-13 does not invent targetability.

---

## 6. Recognition Inputs

Recognition consumes bounded evidence supplied by IS-2, IS-7 and IS-4 where required:

```ts
export interface NuxtRecognitionRequest {
  readonly target: NuxtTargetReference;
  readonly projectContext?: ManagedProjectContextReference;
  readonly sourceEvidence: readonly SourceIntelligenceEvidence[];
  readonly resourceEvidence: readonly ResourceInspectionEvidence[];
  readonly effectiveConfiguration: NuxtRecognitionConfiguration;
  readonly signal?: AbortSignal;
}
```

IS-13 does not recursively scan from `process.cwd()` or infer managed scope from `nuxt.config.*` presence.

Recognition may request narrowly identified additional resource evidence through an injected bounded collaborator only where the target context already permits it; it may not broaden the target set.

---

## 7. Nuxt Fact Model

```ts
export interface NuxtFact<T = NuxtFactValue> {
  readonly id: NuxtFactId;
  readonly kind: NuxtFactKind;
  readonly target: NuxtTargetId;
  readonly value: T;
  readonly provenance: NuxtFactProvenance;
  readonly confidence: NuxtFactConfidence;
  readonly revision?: ResourceRevisionEvidence;
  readonly diagnostics: readonly NuxtDiagnostic[];
}
```

Initial discriminated fact classes include:

- `target_kind`;
- `nuxt_version_evidence`;
- `configuration_target`;
- `layer_baseline`;
- `composition_relationship`;
- `nuxt_resource_presence`;
- `supported_config_entry`;
- `unsupported_config_region`.

This is a Nuxt-owned semantic fact family, not a generic structural-fact framework. IS-7 source facts remain IS-7-owned and are mapped only when Nuxt meaning is established.

---

## 8. Recognition Result

```ts
export type NuxtRecognitionState =
  | 'recognized'
  | 'partial'
  | 'not_nuxt'
  | 'unsupported'
  | 'ambiguous'
  | 'stale'
  | 'cancelled'
  | 'failed';
```

`not_nuxt` is a valid recognition result, not provider failure.

`unsupported` means Nuxt evidence exists but the selected provider cannot safely interpret the required structure.

`ambiguous` preserves multiple materially plausible interpretations rather than selecting by provider/source order.

---

## 9. Version Support

Version 1 does not hard-code one exact Nuxt release into the public contract.

Provider compatibility is expressed as explicit evidence:

```ts
export interface NuxtVersionSupport {
  readonly detected?: string;
  readonly support: 'supported' | 'partially_supported' | 'unsupported' | 'unknown';
  readonly basis: readonly NuxtVersionEvidence[];
}
```

The initial TypeScript-config provider targets Nuxt 4 project/layer structures used by AppManager's managed estate, while capability contracts remain version-aware and fail safely for unverified structures.

Package metadata/version declarations are evidence, not proof that source structure is safely manageable.

---

## 10. Configuration Target

```ts
export interface NuxtConfigurationTarget {
  readonly id: NuxtConfigurationTargetId;
  readonly nuxtTarget: NuxtTargetId;
  readonly resource: ResourceReference;
  readonly format: NuxtConfigurationFormat;
  readonly revision: ResourceRevisionEvidence;
  readonly provider: NuxtProviderId;
}
```

Initial supported source format is TypeScript/JavaScript `defineNuxtConfig`-style configuration only where the provider can reliably locate and interpret the requested semantic structures.

The implementation does not claim all valid Nuxt configuration syntax is manageable.

Root and layer configuration targets are independently addressable.

---

## 11. Configuration Semantic Classes

Version 1 defines an explicit catalogue rather than arbitrary key-path mutation:

```ts
export type NuxtConfigClass =
  | 'extends'
  | 'modules'
  | 'css'
  | 'runtime_config_public'
  | 'app_head'
  | 'compatibility_date';
```

The catalogue is deliberately narrow. A class is `manageable` only when recognition, semantic equivalence, bounded transformation mapping and post-validation are implemented for the provider/source shape.

`runtime_config_private` is observe-only by default because ordinary Nuxt inspection must not expose/manage secret-bearing runtime values as a generic convenience.

Provider support matrices may initially enable only a subset of the above classes. An enumerated class is not automatically enabled.

Adding another managed class requires its recognition, transformation and validation tests; it is not achieved by passing an arbitrary object key path.

---

## 12. Configuration Entry

```ts
export interface NuxtConfigEntry<T = NuxtConfigValue> {
  readonly id: NuxtConfigEntryId;
  readonly class: NuxtConfigClass;
  readonly target: NuxtConfigurationTargetId;
  readonly context: NuxtConfigStructuralContext;
  readonly value: T;
  readonly manageability: 'manageable' | 'observe_only' | 'unsupported';
  readonly provenance: NuxtFactProvenance;
  readonly sourceRange?: SourceRange;
  readonly revision: ResourceRevisionEvidence;
  readonly equivalents: readonly NuxtConfigEntryId[];
  readonly conflicts: readonly NuxtConfigEntryId[];
  readonly sensitivity: NuxtSensitivityClass;
}
```

Equivalent textual values in different semantic contexts remain separate entries.

Provider-native AST/CST/node values never cross this contract.

Unsupported regions remain preservation evidence and are not discarded merely because IS-13 cannot edit them.

---

## 13. Configuration Inspection

`inspectConfiguration()`:

1. validates the explicit Nuxt/config target;
2. consumes revision-bound source evidence;
3. resolves an eligible configured provider;
4. interprets supported semantic classes;
5. records observe-only/unsupported regions where useful;
6. classifies duplicates/equivalents/conflicts;
7. minimizes sensitive values;
8. returns normalized entries and diagnostics without mutation.

Listing manageable entries is a projection of this normalized result, not a separate parser path.

No provider execution with consequential effects is permitted during inspection.

---

## 14. Configuration Change Request

```ts
export type NuxtConfigChangeRequest =
  | NuxtConfigAddRequest
  | NuxtConfigRemoveRequest
  | NuxtConfigUpdateRequest;
```

Every request identifies:

- exact Nuxt/configuration target;
- semantic class;
- exact entry identity or normalized requested value;
- expected source revision;
- intended semantic postcondition;
- effective capability configuration;
- optional cancellation signal.

The public contract does not accept arbitrary text replacement, raw AST nodes or arbitrary object paths.

---

## 15. Add Semantics

For `add`:

1. class/provider support is checked;
2. current entries are interpreted;
3. an equivalent existing entry returns `already_satisfied`;
4. a conflicting entry returns `conflict` unless an explicit supported update path was requested;
5. otherwise IS-13 emits a semantic transformation request plus Nuxt postcondition.

Duplicate insertion is never used to resolve ambiguity/conflict.

For `extends`, equivalence includes normalized relationship identity, not merely string equality.

---

## 16. Remove Semantics

Removal requires one exact manageable entry or an explicitly bounded semantic set.

Already absent returns `already_satisfied`/`already_absent` evidence.

Known Nuxt consequences are returned before mutation as `NuxtChangeConsequence[]`; IS-16 decides confirmation/refusal policy.

The transformation request identifies the narrow semantic region and preservation requirements. IS-13 does not delete sibling values/comments/unsupported source.

---

## 17. Update Semantics

Version 1 supports update only for classes/providers that define an explicit migration from one normalized semantic entry to another.

Update is not implemented as remove-plus-add if that would create an observable invalid intermediate state or lose preservation guarantees.

Unsupported update returns `unsupported_change`; callers must not synthesize an arbitrary text replacement.

---

## 18. Source Transformation Seam

```ts
export interface NuxtTransformationIntent {
  readonly kind: 'nuxt_configuration_change';
  readonly target: ResourceReference;
  readonly expectedRevision: ResourceRevisionEvidence;
  readonly semanticClass: NuxtConfigClass;
  readonly operation: 'add' | 'remove' | 'update';
  readonly providerChange: NuxtProviderChangeDescriptor;
  readonly preservation: NuxtPreservationRequirements;
  readonly postcondition: NuxtSemanticPostcondition;
}
```

`NuxtProviderChangeDescriptor` is an AppManager-owned opaque-to-callers descriptor understood only by the paired IS-8 transformation provider/adapter; it does not expose parser-native nodes.

IS-8 owns preview, stale validation, source edit application, preservation verification and source-level validation.

After IS-8 applies an authorized change, IS-13 re-inspects/revalidates Nuxt semantics against the postcondition.

---

## 19. TypeScript Nuxt Configuration Provider

Version 1 uses a replaceable TypeScript/JavaScript source provider for supported `defineNuxtConfig` structures.

The provider is implemented over IS-7 structural/source evidence plus a Nuxt-specific source adapter. It may use a concrete parser library only below the provider boundary when IS-7 evidence is insufficient for reliable Nuxt semantics.

No regex-only implementation is approved as the universal mutation provider for Nuxt configuration.

The provider must preserve:

- comments where the transformation path can preserve them;
- unrelated properties;
- unsupported structures;
- existing ordering/formatting where practical;
- source ranges/revision binding required by IS-8.

If a dynamic/computed/spread structure prevents safe semantic management, the relevant class/region becomes observe-only/unsupported rather than guessed.

---

## 20. Provider Contract

```ts
export interface NuxtProvider {
  readonly descriptor: NuxtProviderDescriptor;
  recognize(request: NuxtProviderRecognitionRequest): Promise<NuxtProviderRecognitionResult>;
  inspectConfiguration(request: NuxtProviderConfigRequest): Promise<NuxtProviderConfigResult>;
  mapChange(request: NuxtProviderChangeRequest): Promise<NuxtProviderChangeResult>;
  validate(request: NuxtProviderValidationRequest): Promise<NuxtProviderValidationResult>;
}
```

Provider descriptors declare supported target kinds, source forms, Nuxt-version ranges/evidence requirements, configuration classes and operation support.

Provider selection uses explicit compatibility and effective configuration. Catalogue order is not policy.

Equal compatible providers remain ambiguous unless configuration selects one.

---

## 21. Provider Native Data Boundary

AST/CST/compiler nodes, parser exceptions, Nuxt CLI output and package-tool stdout/stderr remain provider-local.

Normalized contracts contain semantic entries, ranges, revisions, facts and diagnostics only.

Provider exceptions map to stable Nuxt failures; callers never parse exception strings to determine manageability.

---

## 22. Nuxt Layer Model

```ts
export interface NuxtLayerModel {
  readonly layer: NuxtTargetId;
  readonly resourceRoot: ResourceReference;
  readonly standalone: NuxtLayerValidity;
  readonly configuration?: NuxtConfigurationTarget;
  readonly baseline: NuxtLayerBaselineEvidence;
  readonly integrations: readonly NuxtHostIntegrationEvidence[];
  readonly repository?: RepositoryRelationshipEvidence;
  readonly lifecycle: NuxtLayerLifecycleEvidence;
  readonly provenance: readonly NuxtFactProvenance[];
  readonly diagnostics: readonly NuxtDiagnostic[];
}
```

`integrations` is a collection keyed by host identity. There is no global `isIntegrated` Boolean.

Repository evidence is optional subordinate evidence and is never converted into Nuxt integration by implication.

A standalone valid layer remains valid while unintegrated.

---

## 23. Layer Eligibility

Technical layer eligibility checks include only supported Nuxt requirements such as:

- recognized/prospective layer identity;
- safe/known layer root;
- supported configuration/baseline structure;
- required baseline resources where applicable;
- supported Nuxt version evidence;
- no unresolved Nuxt-structural ambiguity material to the requested relationship.

IS-13 returns eligibility evidence. IS-16 applies domain/project/policy/authorization eligibility.

Git repository existence is not a Nuxt eligibility requirement unless an owning profile/use case explicitly adds a separate Git-stage precondition.

---

## 24. Layer Creation Profiles

Version 1 uses code-owned immutable profile descriptors composed by IS-23:

```ts
export interface NuxtLayerProfileDescriptor {
  readonly id: NuxtLayerProfileId;
  readonly version: string;
  readonly nuxtCompatibility: NuxtCompatibilityRequirement;
  readonly artefacts: readonly NuxtScaffoldArtefactRequirement[];
  readonly baseline: NuxtLayerBaselineRequirement;
}
```

Initial profile identity is `nuxt4-layer-standard-v1`.

It represents a standalone-capable Nuxt 4 layer baseline, not a hidden list of current template filenames.

No default profile is silently chosen when the owning use case supplies none and more than one applicable profile exists.

Profile IDs/versions are stable semantic identities; filenames/template ordering are not.

---

## 25. Standard Nuxt 4 Layer Profile

The initial `nuxt4-layer-standard-v1` profile requires semantic artefact classes sufficient for a standalone supported layer:

| Artefact class | Requirement | Semantic owner/contributor |
|---|---|---|
| package metadata | required | Nuxt profile requirements + governed project metadata; IS-9 rendering where declarative |
| Nuxt configuration | required | IS-13 Nuxt semantics; IS-9 rendering for new resource |
| TypeScript configuration | required | profile technical requirement; IS-9 rendering where declarative |
| ignore rules | required | profile technical requirement; IS-9 rendering |
| environment example | optional | governed Settings/environment semantics where values are material; no real secrets |
| README/introduction | required | IS-9 bounded scaffold rendering or IS-12 when documentation semantics/modeling are required |
| licence material | required when profile/effective policy requires | IS-19/application licence semantics + IS-9 licence resource |
| test configuration/scaffold | optional/configured | IS-11/Quality semantics where quality-specific meaning is required |

The exact filenames and content are resolved by semantic resource descriptors/configuration and are not embedded as permanent profile authority.

A profile may classify an artefact as required without authorizing overwrite of an existing resource.

---

## 26. Scaffold Request

```ts
export interface NuxtScaffoldRequest {
  readonly target: NuxtTargetReference;
  readonly profile: NuxtLayerProfileId;
  readonly effectiveInputs: NuxtLayerCreationInputs;
  readonly existingTargetEvidence: ResourceContainerEvidence;
  readonly availableSpecialists: NuxtScaffoldSpecialistCapabilities;
  readonly signal?: AbortSignal;
}
```

`effectiveInputs` contains already-resolved values such as package/layer name, author/project metadata, licence identity, compatibility date and repository intent references where required. IS-13 does not resolve competing precedence.

Secret-bearing values are absent/references/synthetic placeholders according to policy; IS-13 never fabricates credentials.

---

## 27. Non-Empty Target Safety

IS-13 evaluates technical collision evidence supplied for the prospective layer root.

The normal creation mode requires an empty/nonexistent target compatible with the profile.

If content already exists, `planScaffold()` returns `target_not_empty` plus collision inventory; it does not overwrite, merge or reinterpret the existing directory.

A future explicit adoption/migration mode requires separate specification. Version 1 does not disguise adoption as creation.

Symlink/containment enforcement remains IS-4/IS-2.

---

## 28. Scaffold Plan

```ts
export interface NuxtScaffoldPlan {
  readonly profile: NuxtLayerProfileDescriptor;
  readonly target: NuxtTargetReference;
  readonly artefacts: readonly NuxtScaffoldArtefactPlan[];
  readonly nuxtPostcondition: NuxtLayerBaselinePostcondition;
  readonly requiredStages: readonly NuxtScaffoldStage[];
  readonly optionalStages: readonly NuxtScaffoldStage[];
  readonly diagnostics: readonly NuxtDiagnostic[];
}
```

Each artefact plan records semantic class, required/optional status, owning specialist, required inputs, resource/template identity request, proposed target metadata and validation contribution.

It contains no rendered bytes and grants no persistence authority.

---

## 29. Cross-Owned Artefact Delegation

The binding ownership clarification is implemented literally:

```text
IS-16 Nuxt layer-creation use case
 -> IS-13 profile/scaffold plan
 -> per artefact:
      IS-13 Nuxt semantics where Nuxt-specific
      IS-12 documentation semantics where required
      IS-19/application licence/settings semantics where required
      IS-11 Quality semantics where required
      IS-9 resource/template resolution and render
 -> IS-16 authorization/collision decision
 -> IS-4 new-resource creation OR IS-8 existing-resource transformation
 -> IS-13 Nuxt baseline validation
 -> IS-16 interpretation -> IS-1 final acceptance
```

IS-13 may supply Nuxt-specific parameters/facts to each specialist. It does not inspect specialist internals or reinterpret their independent semantic contracts.

A specialist's technical success is recorded as subordinate artefact evidence, not Nuxt profile acceptance.

---

## 30. Template Integration

IS-13 requests IS-9 resources by stable semantic identity/class. It does not load `template-repository.json` or import historical template functions directly.

Current `nuxt-config` and related Nuxt-oriented template records are migration evidence for the initial profile after IS-9 normalization.

Current `NuxtConfigContext`, `TargetedTemplateContext` and root/layer template variants may contribute useful binding concepts but do not become the Nuxt Capability public contract.

IS-9 owns binding/rendering. IS-13 owns the Nuxt meaning of inputs such as layer composition, compatibility requirements and profile contribution.

---

## 31. New Nuxt Configuration Generation

For a new layer, IS-13 supplies a normalized semantic configuration model to an approved IS-9 renderer/provider rather than assembling source with ad hoc string concatenation.

```ts
export interface NewNuxtConfigurationModel {
  readonly targetKind: 'managed_layer' | 'standalone_layer';
  readonly compatibilityDate?: string;
  readonly extends: readonly NuxtRelationshipValue[];
  readonly entries: readonly NewNuxtConfigEntry[];
}
```

The resulting source is proposed content. IS-4 performs authorized creation after IS-16 approval.

For an existing config, IS-8 bounded transformation is mandatory; new-file rendering is not used as a whole-file replacement shortcut.

---

## 32. Layer Baseline Validation

```ts
export interface NuxtLayerBaselineValidation {
  readonly state: 'valid' | 'invalid' | 'partial' | 'unsupported' | 'indeterminate';
  readonly profile: NuxtLayerProfileId;
  readonly nuxtFacts: readonly NuxtFact[];
  readonly requiredArtefacts: readonly NuxtArtefactValidation[];
  readonly optionalArtefacts: readonly NuxtArtefactValidation[];
  readonly diagnostics: readonly NuxtDiagnostic[];
}
```

Validation confirms the Nuxt-specific/profile baseline using refreshed post-effect evidence.

It does not imply:

- Quality gates passed;
- repository setup succeeded;
- documentation prose is correct;
- licence selection is legally appropriate;
- the complete application use case succeeded.

---

## 33. Relationship Model

```ts
export interface NuxtHostIntegrationEvidence {
  readonly host: ProjectEntityId;
  readonly layer: ProjectEntityId;
  readonly state: 'integrated' | 'not_integrated' | 'conflicting' | 'ambiguous' | 'unsupported' | 'stale';
  readonly configTarget: NuxtConfigurationTargetId;
  readonly entries: readonly NuxtConfigEntryId[];
  readonly provenance: readonly NuxtFactProvenance[];
}
```

The same layer may have different states for different hosts.

Repository/submodule state is a separate field/result supplied by IS-6/IS-15.

---

## 34. Integration Planning

Integration request requires explicit host and existing eligible layer.

`planRelationshipChange({ operation: 'integrate', ... })`:

1. validates host/layer technical identities;
2. confirms layer eligibility;
3. inspects host config relationship state;
4. returns `already_satisfied` for equivalent integration;
5. returns `conflict`/`ambiguous` for incompatible existing relationships;
6. otherwise emits an `extends` semantic change intent for IS-8;
7. defines host-relative postcondition for subsequent IS-13 validation.

It never creates a missing layer and never initializes/links a repository.

---

## 35. Detachment Planning

Detachment targets one exact host/layer Nuxt relationship.

Equivalent absence returns already-satisfied evidence.

A valid plan removes only the Nuxt composition entry through IS-8 and defines a postcondition that the selected relationship is absent.

It does not delete:

- layer resources;
- local repository;
- remote repository;
- submodule/repository relationship;
- unrelated host configuration.

Any Git cleanup is separate IS-15 intent.

---

## 36. Nuxt and Repository State Composition

When a caller supplies repository evidence, IS-13 may return a descriptive pair:

```ts
export interface NuxtLayerRelationshipState {
  readonly nuxt: NuxtHostIntegrationEvidence;
  readonly repository?: RepositoryRelationshipEvidence;
}
```

No combined Boolean such as `linked` or `integrated` is used.

Repository success does not satisfy Nuxt postconditions; Nuxt integration success does not satisfy Git postconditions.

Ordering of Git and Nuxt effects belongs to IS-16.

---

## 37. Nuxt-Specific Validation

Validation kinds include:

- target recognition;
- supported config entry present/absent/equivalent;
- conflicting relationship absence;
- layer technical eligibility;
- selected layer baseline;
- host-relative integration present/absent;
- target remains recognized as expected Nuxt kind.

Source-valid is not Nuxt-valid. IS-8 source validation precedes/feeds refreshed IS-13 semantic validation where mutation occurred.

Nuxt-valid is not Quality/application accepted. IS-11 and IS-1 remain separate.

---

## 38. Optional Process/CLI Evidence

Version 1 does not require Nuxt CLI execution for ordinary semantic recognition/config management where source evidence is sufficient.

If a provider later requires a Nuxt/package CLI for bounded interrogation/validation, it delegates through IS-5 with explicit executable/arguments/cwd/environment and normalized output.

No arbitrary command string or public process-execution surface is exposed by IS-13.

Provider process completion remains technical evidence only.

---

## 39. Optional AI Enrichment

AI is not part of the Nuxt baseline definition.

If IS-16 requests optional descriptive enrichment for a scaffold artefact, IS-10/IS-12 or another semantic owner handles it under their contracts.

IS-13 supplies bounded Nuxt facts; generated text retains generated provenance and cannot override Nuxt facts.

AI unavailability does not invalidate a deterministic layer baseline unless the selected owning profile/use case explicitly introduced an approved required AI stage.

---

## 40. Effective Configuration

IS-13 consumes operation-effective IS-3 projections for concerns such as:

- enabled Nuxt providers/source forms;
- supported Nuxt version policy;
- enabled manageable configuration classes;
- provider preference;
- profile availability/version;
- compatibility-date/default Nuxt technical values where policy defines them;
- profile artefact requirement toggles where allowed;
- resource/template identities;
- technical validation bounds;
- provider/process timeout;
- sensitive-value policy.

IS-13 does not read `.env`, settings files or `process.env` to establish competing precedence.

---

## 41. Cancellation, Progress and Partial State

Caller `AbortSignal` propagates through provider/source/template/process collaborators where meaningful.

Capability progress uses semantic stages such as recognition, config interpretation, scaffold planning, relationship planning and validation rather than UI strings.

Cancellation stops future stages but preserves completed evidence and known effects supplied by downstream collaborators.

IS-13 does not claim rollback of created resources, transformations, Git effects, remote effects, documentation/AI work or provider processes.

Partial scaffold/relationship evidence remains structured by stage and artefact/relationship dimension.

---

## 42. Freshness and Revision

Facts/config entries/plans retain source revision evidence.

A configuration change request built against a stale revision is not silently remapped to current source.

IS-8 owns authoritative stale-write enforcement; IS-13 re-inspects refreshed source after a change before asserting the semantic postcondition.

If recognition evidence is materially stale and cannot be refreshed, the result is `stale`/`indeterminate`, not current Nuxt truth.

---

## 43. Sensitive Information and Security

IS-13 protects against:

- unmanaged/out-of-scope mutation by never deriving application authority;
- arbitrary path traversal by using IS-2/IS-4 resource references;
- arbitrary-file generation by profile/class gating;
- non-empty target overwrite by explicit collision evidence;
- whole-file config replacement shortcuts;
- loss of unsupported config/comments;
- secret disclosure through private runtime config;
- fabricated credentials in scaffold content;
- command/argument injection;
- stale source application;
- duplicate/conflicting composition entries;
- Git/Nuxt relationship conflation;
- generated/AI prose becoming Nuxt fact;
- provider-native data escaping public contracts;
- cross-owned artefact semantic capture.

Provider/source/template content is untrusted data and cannot redefine profile, scope, configuration precedence or application commands.

---

## 44. Failure Model

```ts
export type NuxtFailureCode =
  | 'target_unresolved'
  | 'target_not_nuxt'
  | 'target_unsupported'
  | 'target_ambiguous'
  | 'target_stale'
  | 'config_target_unresolved'
  | 'config_structure_unsupported'
  | 'config_class_unsupported'
  | 'config_entry_unresolved'
  | 'config_entry_conflict'
  | 'unsupported_change'
  | 'layer_ineligible'
  | 'profile_unavailable'
  | 'profile_incompatible'
  | 'target_not_empty'
  | 'artefact_requirement_unavailable'
  | 'relationship_conflict'
  | 'relationship_ambiguous'
  | 'validation_failed'
  | 'provider_unavailable'
  | 'provider_failure'
  | 'provider_timeout'
  | 'cancelled'
  | 'indeterminate_failure';
```

IS-4/8/9/10/11/12/15 failures remain owned by those stages. IS-16/IS-1 aggregate them into domain/application outcomes rather than IS-13 relabeling every subordinate failure as a Nuxt provider failure.

---

## 45. Diagnostics

Initial stable diagnostic codes include:

```text
NUXT_TARGET_UNRESOLVED
NUXT_TARGET_NOT_RECOGNIZED
NUXT_TARGET_UNSUPPORTED
NUXT_TARGET_AMBIGUOUS
NUXT_TARGET_STALE
NUXT_CONFIG_TARGET_UNRESOLVED
NUXT_CONFIG_UNSUPPORTED_STRUCTURE
NUXT_CONFIG_OBSERVE_ONLY
NUXT_CONFIG_CLASS_UNSUPPORTED
NUXT_CONFIG_ALREADY_PRESENT
NUXT_CONFIG_ALREADY_ABSENT
NUXT_CONFIG_CONFLICT
NUXT_CONFIG_CHANGE_UNSUPPORTED
NUXT_LAYER_INELIGIBLE
NUXT_LAYER_PROFILE_UNAVAILABLE
NUXT_LAYER_PROFILE_INCOMPATIBLE
NUXT_LAYER_TARGET_NOT_EMPTY
NUXT_SCAFFOLD_REQUIREMENT_UNAVAILABLE
NUXT_RELATIONSHIP_ALREADY_PRESENT
NUXT_RELATIONSHIP_ALREADY_ABSENT
NUXT_RELATIONSHIP_CONFLICT
NUXT_RELATIONSHIP_AMBIGUOUS
NUXT_VALIDATION_FAILED
NUXT_PROVIDER_UNAVAILABLE
NUXT_PROVIDER_FAILURE
NUXT_PROVIDER_TIMEOUT
NUXT_CANCELLED
```

Diagnostics contain semantic identities/ranges/provenance, not secret values or provider-native exception dumps.

---

## 46. Caching and Concurrency

Recognition/config interpretation may use invocation-local memoization keyed by target identity, resource revision, provider version and relevant effective configuration.

No persistent cache is required for Version 1.

Scaffold planning is deterministic from profile version + effective inputs + collision/specialist capability evidence and may be recomputed cheaply.

Independent read-only recognition may run concurrently. IS-13 introduces no global Nuxt lock.

Mutation serialization/conflict protection belongs to IS-8/IS-4/IS-1; provider-local non-thread-safe resources may expose bounded conflict keys.

---

## 47. Composition

IS-23 constructs:

1. capability-local provider descriptors/adapters;
2. config-class catalogue;
3. immutable layer-profile catalogue;
4. recognizer/interpreter/planners/validator;
5. injected IS-7/IS-9/other bounded collaborators where technically required;
6. the `NuxtCapability` facade;
7. IS-16/domain consumers.

No import-time singleton, global provider registry or self-registration is permitted.

---

## 48. Testing Requirements

Core tests use fake source/resource/template/specialist/provider evidence and cover at least:

1. root versus layer recognition;
2. standalone valid layer;
3. filesystem presence alone not managed Nuxt identity;
4. repository-linked but not Nuxt-integrated layer;
5. host-relative integration collection;
6. same layer integrated into one host but not another;
7. recognized unsupported structure;
8. ambiguous structure preserved;
9. stale recognition evidence;
10. no hidden cwd/filesystem crawl;
11. provider-native AST does not escape;
12. version support supported/partial/unknown/unsupported;
13. explicit root config target;
14. explicit layer config target;
15. manageable versus observe-only entries;
16. private runtime config sensitivity;
17. equivalent values in distinct contexts remain distinct;
18. equivalent duplicate detection;
19. conflicting entry detection;
20. add already present;
21. add supported entry transformation intent;
22. add conflict refuses duplicate;
23. remove exact entry;
24. remove already absent;
25. remove consequence evidence;
26. update only through supported migration;
27. dynamic/computed structure becomes unsupported;
28. transformation descriptor has revision/preservation/postcondition;
29. no direct write during change planning;
30. source-valid but Nuxt-invalid postcondition;
31. Nuxt-valid does not become Quality success;
32. profile identity/version stability;
33. standard Nuxt 4 layer profile requirements;
34. profile class not hidden filename identity;
35. target empty/nonexistent accepted for planning;
36. non-empty target refused;
37. profile does not authorize overwrite;
38. cross-owned README delegation;
39. cross-owned licence delegation;
40. no fabricated secret values;
41. IS-9 template resolution remains subordinate;
42. current root/layer template context not public contract;
43. new Nuxt config proposed, not persisted;
44. baseline valid/partial/invalid;
45. optional artefact absence versus required failure;
46. optional AI unavailable preserves deterministic baseline;
47. integration requires existing eligible layer;
48. explicit host required;
49. already integrated no-op;
50. conflicting integration;
51. integration emits bounded `extends` change intent;
52. detachment exact relationship;
53. detachment already absent;
54. detachment does not delete layer/repository;
55. Nuxt and Git states remain separate;
56. Git success does not prove Nuxt integration;
57. provider selection independent of catalogue order;
58. provider substitution behind normalized contracts;
59. cancellation propagation;
60. cancellation preserves completed/partial evidence;
61. no rollback claim;
62. Headless-facing capability result contains stable identities, no presentation parsing;
63. no arbitrary process surface;
64. no generic arbitrary-file generation;
65. no duplicate Documentation subsystem;
66. no duplicate App lifecycle;
67. sensitive diagnostics redacted;
68. no singleton/provider self-registration.

Concrete TypeScript-config provider tests use fixtures covering ordinary `defineNuxtConfig`, arrays, comments, multiline values, root/layer configs, supported `extends`/module/CSS structures, duplicates, computed/spread/dynamic unsupported cases and preservation around bounded IS-8 edits.

---

## 49. Current Implementation Disposition

| Current artefact/responsibility | Disposition | Version 1 treatment |
|---|---|---|
| `app/commands/nuxt/createLayer.ts` TODO stub | **REPLACE / RELOCATE** | Concrete layer-creation use case belongs IS-16 and consumes IS-13 profile/scaffold semantics. |
| `app/commands/nuxt/extractDocs.ts` TODO stub | **REPLACE / RELOCATE** | Documentation-primary intent belongs IS-17/IS-12; Nuxt supplies facts only. |
| `app/commands/nuxt/manageEnv.ts` TODO stub | **REPLACE / RELOCATE** | General environment/settings lifecycle remains IS-14/IS-19; only genuinely Nuxt-specific facts stay IS-13. |
| current absence of Nuxt capability module | **ADD** | Introduce capability-local contracts/providers/planners/validator. |
| `app/types/templates/templateTypes.ts` | **SPLIT / RELOCATE** | IS-9 owns template contracts; IS-13 owns only Nuxt semantic inputs/profile facts. |
| `TargetedTemplateContext` root/layer distinction | **RETAIN concept / NARROW** | Useful rendering variant evidence; does not replace Nuxt target identity or host-relative relationships. |
| `NuxtConfigContext.layers` | **RETAIN concept / ADAPT** | Map to normalized Nuxt relationship/configuration model; no raw universal template contract. |
| `NuxtConfigContext.port` | **RELOCATE / NARROW** | Runtime/dev-server values are configuration/provider concerns, not universal layer semantics. |
| `NuxtConfigContext.compatibilityDate` | **RETAIN concept / ADAPT** | Explicit governed Nuxt technical input/config class where supported. |
| `app_manager/templates/template-repository.json` Nuxt records | **RETAIN data / ADAPT** | Normalize through IS-9 semantic resource identities; remove `sourceFile`/`contextType` architecture dependence. |
| current `nuxt-config` root/layer variants | **RETAIN useful content / ADAPT** | Seed IS-9 renderer/profile resources after conformance review; exact current defaults are not Nuxt authority. |
| current Nuxt config template tests | **SPLIT / ADAPT / RELOCATE** | Preserve useful root/layer/render expectations under IS-9 and IS-13 provider/profile tests; remove tests for nonexistent historical import paths. |
| hard-coded root HMR/module/Nitro defaults in historical template tests | **ADAPT / NARROW** | Only retained where effective configuration/profile deliberately specifies them; not universal Nuxt root semantics. |
| source scanners/strategies | **RETAIN useful mechanics / RELOCATE** | Generic source facts stay IS-7; Nuxt-specific interpretation occurs in IS-13 provider. |
| regex-only source strategy as Nuxt authority | **REPLACE** | Provider may use reliable parsing/IS-7 evidence; unsupported dynamic forms fail safely. |
| direct filesystem writes from future Nuxt command/service | **REJECT / RELOCATE** | IS-4 new-resource creation or IS-8 existing-resource transformation only after owning authorization. |
| direct Git/simple-git calls from Nuxt workflow | **REJECT / RELOCATE** | IS-15/IS-6 own repository intent/primitives; states remain separate. |
| direct LLM calls from Nuxt workflow | **REJECT / RELOCATE** | IS-10/IS-12 or semantic owner handles optional enrichment. |
| package manager/CLI command strings as Nuxt public API | **REJECT / RELOCATE** | Optional bounded provider execution through IS-5 only. |

---

## 50. Migration Sequence

1. create capability-local target/fact/config/layer/profile/relationship/validation contracts;
2. implement fake-provider conformance suite;
3. implement immutable config-class and profile catalogues;
4. implement Nuxt target/fact normalizer over IS-2/IS-7 evidence;
5. implement TypeScript/JavaScript `defineNuxtConfig` inspection provider for the first proven manageable classes;
6. implement duplicate/equivalent/conflict semantics;
7. implement add/remove/update semantic change planning and IS-8 descriptor seam;
8. implement refreshed Nuxt postcondition validation;
9. implement host-relative layer model and relationship planner;
10. implement `nuxt4-layer-standard-v1` profile and technical baseline validation;
11. map normalized Nuxt resource requests to IS-9 template/resource identities;
12. integrate IS-12/IS-19/IS-11 specialist artefact seams where profile semantics require them;
13. implement non-empty target/collision evidence handling without persistence;
14. migrate useful current Nuxt template data/defaults through IS-9 review, moving policy values into IS-3/profile configuration;
15. implement IS-16 layer creation/integration/detachment use cases over IS-13;
16. retire/reclassify Nuxt TODO commands rather than filling them with direct service orchestration;
17. remove any emerging direct filesystem/Git/LLM/process shortcuts from Nuxt code;
18. add concrete provider/fixture tests and cross-capability partial-state tests.

---

## 51. Traceability

| Implementation concern | Governing authority |
|---|---|
| authority/non-ownership | DD-NUXTCAP-001–004; FR-NUXT-001–012 |
| identity | DD-NUXTCAP-005–008; FR-NUXT-004–007, 013–020 |
| recognition/facts | DD-NUXTCAP-009–012; FR-NUXT-013–020; IS-2/7 |
| config target | DD-NUXTCAP-013–015; FR-NUXT-018, 021–033 |
| config semantic representation | DD-NUXTCAP-016–019; FR-NUXT-024–033 |
| listing | DD-NUXTCAP-020–022; FR-NUXT-029–033 |
| change intent | DD-NUXTCAP-023–025; FR-NUXT-034–050; IS-8 |
| add | DD-NUXTCAP-026–029; FR-NUXT-034–043 |
| remove/update | DD-NUXTCAP-030–033; FR-NUXT-044–050 |
| Nuxt validation | DD-NUXTCAP-034–036; FR-NUXT-011, 041, 107; IS-8/11 boundary |
| layer model | DD-NUXTCAP-037–039; FR-NUXT-051–092 |
| layer profiles | DD-NUXTCAP-040–043; FR-NUXT-051–070 |
| scaffold/template | DD-NUXTCAP-044–047; FR-NUXT-058–070; IS-9; [DD-2.10 scaffold ownership](../dd_2_shared_capabilities/dd-2-10-nuxt-capability-detailed-design-v01.md#_16-layer-scaffolding-and-resource-registry) |
| creation result/partial state | DD-NUXTCAP-048–050; FR-NUXT-068–070, 108–109 |
| AI | DD-NUXTCAP-051–053; IS-10/12 |
| repository boundary | DD-NUXTCAP-054–056; FR-NUXT-064–070; IS-6/15 |
| integration | DD-NUXTCAP-057–064; FR-NUXT-071–082 |
| detachment | DD-NUXTCAP-065–068; FR-NUXT-083–088 |
| lifecycle | DD-NUXTCAP-069–070; FR-NUXT-089–092, 100–102 |
| generic generation | DD-NUXTCAP-071–073; FR-NUXT-093–096 |
| documentation | DD-NUXTCAP-074–076; FR-NUXT-097–099; IS-12/17 |
| quality | DD-NUXTCAP-077–078; IS-11 |
| process | DD-NUXTCAP-079–081; IS-5 |
| provider | DD-NUXTCAP-082–085; ADR-0001 |
| safety/stale | DD-NUXTCAP-086–088; FR-NUXT-103–109; IS-2/4/8 |
| cancellation/partial | DD-NUXTCAP-089–092; FR-NUXT-108–109 |
| interaction/headless | DD-NUXTCAP-093–095; FR-NUXT-110–113; IS-22 |
| outcomes | DD-NUXTCAP-096–098; IS-1/16 |
| implementation convergence | DD-NUXTCAP-099 |
| testing | DD-NUXTCAP-100–101 |

---

## 52. Version 1 Non-Drift Baseline

```text
IS-16 owning Nuxt use case
 + IS-2 managed target/scope
 + IS-3 effective policy
        |
        v
IS-13 Nuxt recognition / semantic interpretation
        |
        +--> IS-7 source evidence
        |
        v
Nuxt facts / config entries / layer model
        |
        +--> config/integration change -> IS-8 transformation intent
        |
        +--> layer creation -> IS-13 semantic profile/scaffold plan
                               +--> IS-9 templates/resources
                               +--> IS-12 documentation semantics where required
                               +--> IS-19 licence/settings semantics where required
                               +--> IS-11 quality semantics where required
        |
        v
authorized IS-4 creation / IS-8 transformation
        |
        +--> separate IS-15 Git coordination where requested
        |
        v
refreshed IS-13 Nuxt-specific validation
        |
        v
IS-16 Nuxt-domain interpretation -> IS-1 final acceptance
```

The non-drift rule is:

> **Version 1 Nuxt Capability may establish provider-independent Nuxt technical facts, interpret explicitly supported configuration semantics, derive bounded transformation intents, model host-relative layer relationships, define Nuxt layer-profile/baseline requirements, coordinate technical scaffold contributions and validate Nuxt postconditions; it may not infer managed scope from filesystem presence, directly mutate configuration/resources, own Git relationships, absorb documentation/licence/quality/AI semantics, turn a profile into generic file-generation authority, conflate standalone validity with host integration, or decide that the Nuxt-domain/application use case succeeded.**

This implementation completes the DD-2 shared-capability implementation family while preserving the separation between specialist Nuxt technical knowledge, cross-owned scaffold semantics, Nuxt-domain orchestration and DD-1 application authority.