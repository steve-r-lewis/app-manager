# IS-17 — Docs Domain Implementation Specification

> **Document type:** Level 4 Implementation Specification
>
> **Status:** Version 1 implementation baseline
>
> **Implementation ID:** IS-17
>
> **Primary Detailed Design:** [DD-3.4 — Docs Domain](../dd_3_high_coupling_domains/dd-3-4-docs-domain-detailed-design-v01.md)
>
> **Primary Functional authority:** [Docs Functional Specification](../functional/docs-functional-specification-v01.md)
>
> **Principal shared capability:** [IS-12 — Documentation Capability](is-12-documentation-capability-implementation-specification-v01.md)
>
> **Application Core:** [IS-1 — Application Runtime and Invocation](is-1-application-runtime-and-invocation-implementation-specification-v01.md), [IS-2 — Managed Project Resolution](is-2-managed-project-resolution-implementation-specification-v01.md), [IS-3 — Configuration Resolution](is-3-configuration-resolution-implementation-specification-v01.md)
>
> **Supporting implementations:** [IS-4 — Resource Access](is-4-resource-access-implementation-specification-v01.md), [IS-5 — Process Execution](is-5-process-execution-implementation-specification-v01.md), [IS-7 — Source Intelligence](is-7-source-intelligence-implementation-specification-v01.md), [IS-8 — Source Transformation](is-8-source-transformation-implementation-specification-v01.md), [IS-9 — Resource Registry and Template](is-9-resource-registry-and-template-implementation-specification-v01.md), [IS-10 — AI Capability](is-10-ai-capability-implementation-specification-v01.md), [IS-11 — Quality Capability](is-11-quality-capability-implementation-specification-v01.md), [IS-13 — Nuxt Capability](is-13-nuxt-capability-implementation-specification-v01.md), [IS-15 — Git Domain](is-15-git-domain-implementation-specification-v01.md), [IS-16 — Nuxt Domain](is-16-nuxt-domain-implementation-specification-v01.md), IS-18 Quality Domain, IS-22 Interaction Adapters, [IS-23 — Build and Runtime Assembly](is-23-build-and-runtime-assembly-implementation-specification-v01.md)
>
> **Runtime decision:** [ADR-0001 — Primary Application Runtime](../project_management/decisions/adr-0001-primary-application-runtime.md)
>
> **Register:** [AppManager Implementation Specification](implementation-specification-v01.md)
>
> **Governing plan:** [Implementation Specification Plan](../project_management/implementation-specification-plan-v01.md)

## 1. Purpose

IS-17 defines the concrete Node.js/TypeScript implementation of AppManager's Docs domain: the application domain that owns documentation-oriented application intent, semantic target/profile policy, generation/update/output policy, orchestration and Docs-domain acceptance.

The governing implementation rules are:

> **Docs owns documentation application intent and acceptance; IS-12 owns bounded documentation modeling, aggregation, rendering, tooling and validation semantics; IS-1 retains final application authority.**

> **Documentation targets derive from IS-2 managed context. Filesystem presence, parser recognition, existing documentation or tool availability does not create application scope or mutation authority.**

> **Documentation truth is provenance-sensitive. Structural/domain facts, existing authored documentation, deterministic generated prose and AI-generated prose remain distinguishable.**

> **Generation and update are different effects: new documentation is created through IS-4, while existing documentation/source injection is transformed through IS-8.**

> **Docs may compose specialist evidence without absorbing Source, Nuxt, Quality, AI, Git, process, template or persistence semantics.**

---

## 2. Scope and Non-Ownership

IS-17 implements:

- canonical Docs use-case identities/descriptors;
- complete-application, application-source, all-layer, selected-layer, tests and selected-file target resolution;
- documentation eligibility and duplicate-target normalization;
- domain documentation profiles and completeness policy;
- provenance-sensitive fact/input selection;
- documentation generation versus update intent;
- output target/collision/replacement/preservation policy;
- optional AI-enrichment acceptance policy;
- multi-target aggregation/continuation;
- documentation development/build/preview orchestration;
- extraction/aggregation application intent;
- coverage, omission, freshness, unsupported-target and partial-effect interpretation;
- Docs-domain postcondition acceptance, diagnostics and recovery.

IS-17 does not implement:

- canonical invocation, authorization or final outcome — IS-1;
- managed project topology/scope/targetability — IS-2;
- configuration precedence — IS-3;
- filesystem/process mechanics — IS-4/IS-5;
- source recognition — IS-7;
- source/document transformation mechanics — IS-8;
- template/registry rendering substrate — IS-9;
- AI provider/model/disclosure mechanics — IS-10;
- Quality execution/gates — IS-11/IS-18;
- documentation modeling/render/tool mechanics — IS-12;
- Nuxt technical/domain semantics — IS-13/IS-16;
- Git intent — IS-15;
- interaction presentation — IS-22;
- governance of AppManager's own specification repository, which remains governed by the Project Documentation Guide.

---

## 3. Concrete Module Boundary

```text
app/
└── domains/
    └── docs/
        ├── contracts/
        │   ├── docs-use-case.ts
        │   ├── documentation-target.ts
        │   ├── documentation-eligibility.ts
        │   ├── documentation-domain-profile.ts
        │   ├── documentation-output-intent.ts
        │   ├── documentation-output-policy.ts
        │   ├── documentation-coverage.ts
        │   ├── documentation-stage.ts
        │   ├── docs-result.ts
        │   ├── docs-recovery.ts
        │   └── docs-diagnostic.ts
        ├── catalogue/
        │   └── docs-use-case-catalogue.ts
        ├── policy/
        │   ├── target-resolver.ts
        │   ├── eligibility-evaluator.ts
        │   ├── profile-resolver.ts
        │   ├── evidence-selection-policy.ts
        │   ├── output-policy.ts
        │   ├── enrichment-policy.ts
        │   └── continuation-policy.ts
        ├── orchestration/
        │   ├── documentation-runner.ts
        │   ├── multi-target-runner.ts
        │   ├── documentation-tool-runner.ts
        │   ├── docs-acceptance.ts
        │   └── recovery-builder.ts
        └── use-cases/
            ├── document-application.ts
            ├── document-source.ts
            ├── document-layers.ts
            ├── document-layer.ts
            ├── document-tests.ts
            ├── document-file.ts
            ├── generate-documentation.ts
            ├── update-documentation.ts
            ├── extract-documentation.ts
            ├── aggregate-documentation.ts
            ├── develop-documentation.ts
            ├── build-documentation.ts
            └── preview-documentation.ts
```

The domain is intentionally orchestration/policy-heavy and provider-light. No second Markdown/VitePress/source parser stack is introduced.

---

## 4. Public Use-Case Seam

```ts
export interface DocsUseCase<TInput, TPayload> {
  readonly descriptor: DocsUseCaseDescriptor;
  availability(context: ApplicationExecutionContext, input: TInput): Promise<DocsAvailability>;
  validate(context: ApplicationExecutionContext, input: TInput): Promise<DocsValidation>;
  execute(context: ApplicationExecutionContext, input: TInput): Promise<DocsDomainResult<TPayload>>;
}
```

`DocsDomainResult` contributes Docs-specific payload/evidence to IS-1. It does not duplicate canonical success/failure state.

---

## 5. Canonical Docs Command Identities

```text
docs.document-application
docs.document-source
docs.document-layers
docs.document-layer
docs.document-tests
docs.document-file
docs.generate
docs.update
docs.extract
docs.aggregate
docs.develop
docs.build
docs.preview
```

These IDs preserve the Functional/DD distinctions while allowing adapters to expose friendly aliases. `nuxt.extractDocs` is a transitional alias to Docs intent, not Nuxt ownership.

---

## 6. Documentation Target Model

```ts
export type DocumentationTarget =
  | { readonly kind: 'complete_application'; readonly project: ManagedProjectId }
  | { readonly kind: 'application_source'; readonly project: ManagedProjectId }
  | { readonly kind: 'all_managed_layers'; readonly project: ManagedProjectId; readonly layers: readonly ManagedProjectEntityId[] }
  | { readonly kind: 'managed_layer'; readonly entity: ManagedProjectEntityId }
  | { readonly kind: 'tests'; readonly project: ManagedProjectId; readonly resources: readonly ManagedResourceReference[] }
  | { readonly kind: 'selected_file'; readonly resource: ManagedResourceReference };
```

Every target is bound to IS-2 context. Path is evidence/location, not semantic identity.

Overlapping scopes normalize logical resource identities before model construction so a resource is not accidentally documented twice.

---

## 7. Target Resolution

Target resolution proceeds from structured invocation plus IS-2 managed context. It may narrow scope but never broadens it from recursive discovery.

Selected-layer and selected-file requests must resolve exactly one eligible semantic target. Ambiguity is a decision requirement/error, never first-match selection.

`all_managed_layers` uses managed layer entities, not directories that resemble Nuxt layers.

External input is read-only only where an explicitly specified use case permits it; Version 1 mutation targets remain managed/authorized resources.

Symlink/indirection containment is enforced through IS-2/IS-4 evidence.

---

## 8. Eligibility

```ts
export interface DocumentationEligibilityDecision {
  readonly target: DocumentationTargetIdentity;
  readonly operation: DocsOperationId;
  readonly state: 'eligible' | 'ineligible' | 'unsupported' | 'ambiguous' | 'indeterminate';
  readonly evidence: readonly EvidenceReference[];
  readonly diagnostics: readonly DocsDiagnostic[];
}
```

Eligibility considers managed membership, target class, selected profile, supported recognition/documentation capability, sensitivity and requested operation.

Filesystem existence alone is insufficient. Unsupported binary/source types remain unsupported rather than becoming text.

---

## 9. Domain Documentation Profile

```ts
export interface DocsDomainProfile {
  readonly id: DocsProfileId;
  readonly targetClass: DocumentationTargetClass;
  readonly categories: readonly DocsProfileCategory[];
  readonly exclusions: readonly DocsProfileExclusion[];
  readonly detail: 'summary' | 'standard' | 'detailed';
  readonly output: DocumentationOutputIntent;
  readonly aggregation: DocsAggregationPolicy;
  readonly enrichment: DocsEnrichmentPolicy;
  readonly completeness: DocsCompletenessPolicy;
}
```

IS-17 resolves the application profile from explicit input/effective IS-3 policy. It then maps the bounded modeling/rendering portion into IS-12's `DocumentationProfile`.

A profile may narrow managed scope but never expand it. Template identity does not redefine profile authority.

---

## 10. Provenance-Sensitive Evidence Selection

IS-17 constructs the exact selected input set supplied to IS-12. It may obtain:

- IS-2 managed project/entity/topology facts;
- IS-7 structural facts;
- IS-13/IS-16 accepted Nuxt facts where relevant;
- IS-11/IS-18 test/quality evidence where explicitly required;
- repository facts where profile-selected;
- existing documentation through authorized bounded reads.

Evidence selection records owner/provenance/revision/sensitivity. Existing prose and AI prose cannot silently override recognized/domain-authoritative facts.

Raw source inclusion is bounded and policy-controlled.

---

## 11. Common Documentation Flow

```text
IS-1 context
 -> IS-2 target/scope
 -> IS-3 profile/output/tool policy
 -> IS-17 eligibility + selected evidence
 -> IS-12 model/aggregate
 -> optional IS-12/IS-10 enrichment
 -> IS-12 render or inspect
 -> output collision/update decision
 -> IS-1 authorization where consequential
 -> IS-4 create OR IS-8 transform
 -> IS-12 validation
 -> IS-17 coverage/postcondition acceptance
 -> IS-1 final acceptance
```

Read-only documentation operations stop before persistence/tool execution unless those effects are part of the selected use case.

---

## 12. Complete-Application Documentation

`docs.document-application` resolves the managed root and profile-required managed composition from IS-2.

It builds a deterministic target set containing only profile-relevant root/layer/source/test/documentation facts. It does not recursively dump the repository.

Each logical target receives eligibility/support/coverage status. Failure/unsupported required content prevents a false complete-coverage claim.

Optional categories that are legitimately absent are `empty_valid`, not failures.

---

## 13. Application-Source Documentation

`docs.document-source` documents recognized application source within approved scope.

IS-7 supplies structural evidence; IS-12 maps it to documentation models. IS-17 never presents heuristic/ambiguous interpretation as confirmed structure.

Source documentation is read-only by default. Generated documentation is written to a documentation output, not injected into source, unless a separately explicit update/injection intent is selected.

Any existing-source documentation injection uses IS-8 and source-level validation plus Docs postcondition acceptance.

---

## 14. All-Layers Documentation

`docs.document-layers` resolves eligible managed layers from IS-2 and preserves stable layer identity through each result.

Nuxt-specific facts come from IS-13/IS-16 evidence. Repository topology does not determine documentability.

Standalone and integrated managed layers are independently documentable.

The multi-target runner uses explicit continuation policy. One layer failure remains attributable and cannot be reported as complete all-layer success.

---

## 15. Selected-Layer Documentation

`docs.document-layer` requires one exact managed layer identity or unambiguous selector.

The layer's own source/configuration/tests/documentation/Nuxt facts may be included according to profile. Integration state is included only from Nuxt-authoritative evidence.

Ambiguous layer selection fails without guessing.

---

## 16. Test Documentation

`docs.document-tests` describes recognized tests without executing them.

IS-7/Documentation Capability may supply suites/cases/fixtures/relationships where reliably recognizable. IS-11/IS-18 execution evidence is optional input only where the profile explicitly includes it.

Test-to-source relationships remain unresolved when not reliably established. Test framework identity is provider evidence, not a Docs policy dependency.

Docs never runs tests merely to make documentation complete unless a separate Quality use case has been explicitly authorized/composed.

---

## 17. Selected-File Documentation

`docs.document-file` resolves exactly one eligible file.

```ts
export interface DocumentFileInput {
  readonly file: ManagedResourceSelector;
  readonly profile: DocsProfileSelector;
  readonly output?: DocumentationOutputIntent;
}
```

The most appropriate already-approved recognition capability is selected below the domain. Binary/unsupported input is rejected/reported rather than coerced to text.

Result states identify generated, updated, skipped, unsupported, failed or inspected-only disposition as applicable.

---

## 18. Generation versus Update

```ts
export type DocumentationOutputIntent =
  | { readonly mode: 'inspect_only' }
  | { readonly mode: 'generate'; readonly target: DocumentationOutputTarget }
  | { readonly mode: 'update'; readonly target: ExistingDocumentationTarget; readonly updatePolicy: DocsUpdatePolicy };
```

Generation creates a new documentation resource through IS-4.

Update transforms an existing documentation resource through IS-8.

The domain never chooses one merely because a file happens to exist; collision policy decides whether generation must fail or a separately authorized update intent is required.

---

## 19. Output Target and Collision Policy

Before writes, IS-17 resolves exact output identity/location within approved scope and obtains bounded IS-4 existence/revision evidence.

```ts
export type DocsCollisionDecision =
  | 'target_absent_generate'
  | 'target_exists_update_required'
  | 'target_owned_equivalent_already_satisfied'
  | 'collision_refuse'
  | 'indeterminate_refuse';
```

Version 1 has no generic overwrite/force Boolean.

Unrelated existing documentation is never replaced merely because a renderer produced new content.

---

## 20. Documentation Generation

`docs.generate` consumes a resolved target/profile/model/render proposal and creates the exact approved output through IS-4 with no-overwrite/revision preconditions.

After creation, IS-17 obtains bounded read/IS-12 validation evidence and checks target/profile postconditions.

Successful rendering is not successful generation; successful resource creation is not complete documentation acceptance.

---

## 21. Existing Documentation Update

`docs.update` requires explicit update intent, exact existing resource identity/revision and an update policy.

```ts
export type DocsUpdatePolicy =
  | { readonly kind: 'replace_managed_document'; readonly ownership: DocumentationOwnershipEvidence }
  | { readonly kind: 'update_managed_region'; readonly region: DocumentationRegionIdentity }
  | { readonly kind: 'inject_source_documentation'; readonly region: SourceDocumentationRegionIdentity };
```

Whole-document replacement is allowed only for documentation demonstrably owned/managed by the selected workflow and explicitly authorized. Otherwise bounded managed-region transformation is required.

IS-8 owns preservation/stale-write mechanics. IS-17 verifies resulting documentation intent and source/document validity.

---

## 22. Existing Authored Documentation Preservation

Existing authored text is contextual evidence, not disposable renderer input.

Where an update policy preserves authored regions, the transformation plan must identify managed versus preserved regions before authorization.

Unknown ownership or ambiguous region boundaries fail safe. IS-17 does not rewrite a whole hand-authored document to normalize formatting.

---

## 23. Extraction

`docs.extract` is read-only and returns selected normalized documentation facts/models/coverage without persistence.

Extraction does not mean raw recursive source concatenation and does not start VitePress or AI by default.

The legacy `nuxt.extractDocs` adapter path maps here when the requested semantics are documentation extraction.

---

## 24. Aggregation

`docs.aggregate` combines explicitly selected documentation models/facts under a domain profile and IS-12 aggregation semantics.

The domain chooses target set/profile/grouping and interprets completeness; IS-12 performs bounded duplicate normalization/model aggregation.

Logical provenance remains attributable after aggregation. Required omissions remain omissions rather than being hidden by aggregate prose.

Aggregation is read-only unless paired with explicit generation/update output intent.

---

## 25. Optional AI Enrichment

```ts
export type DocsEnrichmentPolicy =
  | { readonly mode: 'none' }
  | { readonly mode: 'optional'; readonly acceptedKinds: readonly DocumentationEnrichmentKind[] }
  | { readonly mode: 'required'; readonly acceptedKinds: readonly DocumentationEnrichmentKind[] };
```

IS-17 decides whether enrichment is relevant/optional/required for the selected profile. IS-12/IS-10 owns bounded enrichment execution and disclosure controls.

AI receives only explicitly selected, sensitivity-approved context. Managed scope does not imply external disclosure permission.

AI output remains generated prose/proposal with provenance. It cannot override structural/domain facts, broaden target scope, authorize writes or declare completeness.

Invalid/unavailable AI output yields omission/failure according to profile; optional enrichment failure need not invalidate deterministic documentation.

---

## 26. AI Acceptance

IS-17 accepts AI enrichment only when:

- requested/permitted by profile;
- output contract is valid;
- provenance remains `ai_generated`;
- output does not contradict higher-authority facts without explicit conflict representation;
- content remains within selected target/profile;
- required sensitivity/disclosure policy was satisfied;
- inclusion does not create unsupported claims of coverage.

Acceptance means eligible for documentation composition, not factual certification beyond the supplied evidence.

---

## 27. Documentation Tooling Use Cases

`docs.develop`, `docs.build` and `docs.preview` are explicit application use cases. They are not side effects of generation/inspection.

IS-17 resolves managed documentation target, operation-effective tool policy and applicability, then delegates tool recognition/execution to IS-12.

IS-12's initial VitePress adapter is an implementation provider, not domain identity. Docs does not invoke VitePress CLI/processes directly.

---

## 28. Documentation Develop

`docs.develop` starts a configured long-running documentation development tool only for an exact managed documentation target.

A successful process launch establishes `running` tooling evidence, not documentation correctness or build success.

The result exposes lifecycle/cancellation/endpoint evidence normalized by IS-12. Endpoint/port data is safe evidence, not authorization to expose a network service publicly.

Headless execution requires all required target/tool/lifecycle policy deterministically resolved.

---

## 29. Documentation Build

`docs.build` requests one bounded documentation build from IS-12.

Technical process completion and documentation-tool result remain distinct. A nonzero provider exit may be technical completion with documentation build failure evidence.

Generated build artefacts are recorded as documentation-tool artefacts and do not become managed source/documentation resources merely by existing.

Build does not deploy/publish documentation.

---

## 30. Documentation Preview

`docs.preview` starts the configured preview operation for an already suitable documentation build/target according to effective policy.

Preview does not silently build, generate or update documentation unless a composed higher-level use case explicitly requests those separate effects.

A successful preview launch is a tooling lifecycle state, not Docs content acceptance.

---

## 31. Tooling Lifecycle and Cancellation

Long-running tooling is invocation-scoped and cancellation-aware. IS-1 `AbortSignal` propagates through IS-12/IS-5.

Cancellation stops further work as safely practical; it does not imply that generated build artefacts or previously persisted documentation are rolled back.

No global active VitePress/server singleton exists.

---

## 32. Coverage Model

```ts
export interface DocsCoverageSummary {
  readonly profile: DocsProfileId;
  readonly required: readonly DocsCoverageItem[];
  readonly optional: readonly DocsCoverageItem[];
  readonly documented: readonly DocsCoverageItem[];
  readonly emptyValid: readonly DocsCoverageItem[];
  readonly omitted: readonly DocsOmission[];
  readonly unsupported: readonly DocsCoverageItem[];
  readonly failed: readonly DocsCoverageFailure[];
  readonly stale: readonly DocsCoverageItem[];
  readonly state: 'complete' | 'partial' | 'indeterminate';
}
```

Completeness is relative only to approved target/profile. It never means complete knowledge of the project.

Unsupported/failed required items cannot count as documented. Optional empty categories can be valid.

---

## 33. Freshness

Documentation results carry revisions for material input evidence and output resources.

IS-17 may classify output/model as fresh, stale or indeterminate relative to selected input revisions where the profile requires freshness evidence.

A stale existing document is not automatically rewritten. Freshness is decision evidence for an explicit update intent.

---

## 34. Multi-Target Continuation

```ts
export type DocsContinuationPolicy = 'stop_on_required_failure' | 'continue_collecting';
```

The policy is resolved before consequential work. A capability/provider failure cannot decide it.

Initial Version 1 multi-target documentation executes in deterministic managed-target order for clear attribution/recovery. This ordering is an implementation choice, not a permanent semantic dependency.

Completed artefacts/models remain completed if a later target fails.

---

## 35. Partial Effects

```ts
export interface DocsStageResult {
  readonly target: DocumentationTargetIdentity;
  readonly stage: DocsStageId;
  readonly state: 'completed' | 'empty_valid' | 'unsupported' | 'failed' | 'cancelled' | 'indeterminate' | 'not_attempted';
  readonly effects: readonly ApplicationEffectEvidence[];
  readonly evidence: readonly EvidenceReference[];
  readonly diagnostics: readonly DocsDiagnostic[];
}
```

No cross-file/cross-target transaction or rollback is implied.

A later failed validation does not erase a successfully created/updated artefact; it marks the operation partial/failed with truthful effect evidence.

---

## 36. Stale-State Preconditions

Consequential work binds authorization/plans to material evidence including:

- managed project/topology revision;
- selected target/resource identity;
- source/domain input revisions where material;
- existing documentation revision;
- output collision/ownership evidence;
- profile/version/template identity;
- accepted enrichment proposal identity where material.

IS-4/IS-8 enforce technical preconditions. IS-17 interprets mismatch as stale intent and does not silently regenerate/rewrite under old authorization if the effect materially changes.

---

## 37. Recovery

```ts
export interface DocsRecoveryPosition {
  readonly completedTargets: readonly DocumentationTargetIdentity[];
  readonly completedEffects: readonly ApplicationEffectEvidence[];
  readonly indeterminateEffects: readonly DocsIndeterminateEffect[];
  readonly omittedOrFailed: readonly DocsCoverageItem[];
  readonly notAttempted: readonly DocumentationTargetIdentity[];
  readonly revalidation: readonly DocsRevalidationRequirement[];
  readonly dispositions: readonly ('retry' | 'continue_after_revalidation' | 'regenerate_proposal' | 'manual_intervention')[];
}
```

Recovery is informational. Version 1 does not persist resumable documentation workflow state or promise rollback.

---

## 38. Docs Result Payload

```ts
export interface DocsDomainPayload {
  readonly operation: DocsOperationId;
  readonly targets: readonly DocumentationTargetIdentity[];
  readonly profile?: DocsProfileId;
  readonly stages: readonly DocsStageResult[];
  readonly artefacts: readonly DocsArtefactResult[];
  readonly coverage?: DocsCoverageSummary;
  readonly tooling?: DocumentationToolResultReference;
  readonly diagnostics: readonly DocsDiagnostic[];
  readonly recovery?: DocsRecoveryPosition;
}
```

No competing `success: boolean` is added.

---

## 39. Docs Acceptance

Use-case-specific postconditions include:

- application/layers/source/tests/file inspection: requested eligible facts represented with truthful omissions/support state;
- generation: exact approved output exists, validates as documentation and satisfies required profile coverage;
- update: exact intended managed document/region changed, preserved regions remain protected and postcondition validates;
- extraction: requested normalized evidence returned without mutation;
- aggregation: selected models represented once according to grouping/provenance policy;
- develop/preview: requested tool lifecycle established for exact target;
- build: configured documentation build completed with acceptable tool result and expected artefact evidence.

IS-12/tool/process/write success alone does not establish these conditions. IS-1 retains final application acceptance.

---

## 40. Diagnostics

Initial stable codes include:

```text
DOCS_OPERATION_UNAVAILABLE
DOCS_TARGET_REQUIRED
DOCS_TARGET_NOT_MANAGED
DOCS_TARGET_AMBIGUOUS
DOCS_TARGET_INELIGIBLE
DOCS_TARGET_UNSUPPORTED
DOCS_TARGET_INDETERMINATE
DOCS_PROFILE_REQUIRED
DOCS_PROFILE_UNSUPPORTED
DOCS_REQUIRED_INPUT_UNAVAILABLE
DOCS_REQUIRED_INPUT_UNSUPPORTED
DOCS_SOURCE_FACT_AMBIGUOUS
DOCS_OUTPUT_REQUIRED
DOCS_OUTPUT_AMBIGUOUS
DOCS_OUTPUT_COLLISION
DOCS_OUTPUT_OWNERSHIP_UNKNOWN
DOCS_UPDATE_POLICY_REQUIRED
DOCS_UPDATE_REGION_AMBIGUOUS
DOCS_OUTPUT_STALE
DOCS_AI_ENRICHMENT_UNAVAILABLE
DOCS_AI_ENRICHMENT_REJECTED
DOCS_TOOL_UNAVAILABLE
DOCS_TOOL_TARGET_INVALID
DOCS_TOOL_FAILED
DOCS_COVERAGE_PARTIAL
DOCS_POSTCONDITION_FAILED
DOCS_OPERATION_PARTIAL
DOCS_CANCELLED
DOCS_RECOVERY_REVALIDATION_REQUIRED
```

Diagnostics identify target/artefact/stage and safe evidence without provider-native payloads or secrets.

---

## 41. Security and Sensitive Information

Documentation is a disclosure surface. IS-17 therefore applies profile/effective sensitivity policy before evidence enters IS-12/AI/rendered output.

Credentials, tokens, secret environment values, credential-helper output and protected configuration are excluded by default.

Existing source/document content is not assumed safe for publication merely because it is managed.

AI disclosure remains separately governed by IS-10 and does not follow automatically from documentation target scope.

Generated documentation containing detected protected material fails validation/refusal policy rather than being silently published.

---

## 42. Interaction Independence

No IS-17 module imports prompts, terminal colours or IDE APIs.

Interactive adapters may present eligible target/profile/output choices, but IS-22 supplies the resulting structured values.

Headless missing/ambiguous target, profile, output or update policy returns structured decision requirements; it never chooses the first file/layer, default overwrite, arbitrary output path or implicit AI/tool provider.

---

## 43. Events and Observability

Semantic events may include:

```text
docs.target.resolved
docs.target.started
docs.model.completed
docs.render.completed
docs.output.created
docs.output.updated
docs.target.failed
docs.coverage.partial
docs.tool.started
docs.tool.completed
docs.operation.partial
docs.recovery.available
```

Events carry safe IDs/stage/effect/coverage/diagnostic references and subordinate correlation IDs. Raw documentation/source content is not emitted by default.

---

## 44. Conflict and Concurrency Keys

Consequential Docs use cases expose IS-1 conflict keys such as:

```text
docs-output:<managed-resource-id>
docs-region:<managed-resource-id>:<region-id>
docs-tool:<documentation-target-id>:<tool-lifecycle-kind>
```

Writes to the same output/managed region conflict. Independent read-only targets do not require a global Docs lock.

Long-running development/preview lifecycle conflicts are target/tool specific, not application-global.

---

## 45. Idempotency and Retry

Read-only inspection/extraction/aggregation is repeatable subject to input revision changes.

Generation detects equivalent AppManager-owned output where reliable; otherwise existing targets are collisions rather than overwrite opportunities.

Update is revision-bound and never blindly retried after uncertain transformation.

Tool build may be retried only under explicit policy after revalidation; development/preview launch is not blindly duplicated.

AI/provider failure never silently changes provider/profile/target.

---

## 46. Composition

IS-23 constructs:

1. IS-12 Documentation Capability;
2. supporting IS-4/7/8/9/10/11/13 capabilities as configured;
3. accepted cross-domain fact seams where required;
4. Docs target/profile/output/enrichment/continuation policies;
5. documentation/multi-target/tool runners;
6. Docs acceptance/recovery components;
7. thirteen Docs use cases;
8. immutable Docs descriptor catalogue;
9. IS-1 registrations.

No import-time singleton, direct `process.env`/cwd read or provider-specific constructor exists in IS-17.

---

## 47. Nuxt, Quality, Git and App Coordination

Nuxt layer/integration facts remain IS-16/IS-13-owned. Docs may describe them but cannot establish/change them.

Quality/test execution remains IS-18/IS-11-owned. Docs may document test structure or consume supplied quality evidence without executing a quality gate.

Repository facts/relationships remain IS-15/IS-6-owned and do not determine documentability.

App lifecycle remains IS-14-owned. Documentation build is not application build; documentation preview is not application preview.

When another domain needs a documentation contribution (for example Nuxt layer creation), it may consume IS-12 directly for bounded documentation proposal mechanics or invoke a Docs use case when application-level Docs policy/acceptance is required. This does not transfer ownership.

---

## 48. Testing Requirements

Core tests cover at least:

1. thirteen canonical Docs IDs;
2. aliases do not create semantics;
3. legacy `nuxt.extractDocs` maps to Docs ownership;
4. no cwd/path reconstruction of managed scope;
5. complete application target from IS-2;
6. application source target;
7. all managed layers target;
8. selected layer exact identity;
9. tests target;
10. selected file exact identity;
11. ambiguous target fails safe;
12. symlink/indirection cannot escape scope;
13. duplicate logical target normalized;
14. filesystem presence not eligibility;
15. binary file unsupported;
16. profile may narrow not broaden scope;
17. template cannot redefine profile;
18. evidence owner/provenance preserved;
19. existing prose not structural authority;
20. AI prose not structural authority;
21. unsupported source not guessed;
22. raw source bounded;
23. complete application no recursive dump;
24. required omission prevents complete coverage;
25. optional empty category valid;
26. selected layer independent of repository topology;
27. standalone layer documentable;
28. integration fact comes from Nuxt owner;
29. all-layer failure attributed per layer;
30. explicit continuation policy;
31. test documentation does not execute tests;
32. unresolved test-source relation remains unresolved;
33. selected-file unsupported state truthful;
34. inspect-only causes no write;
35. generation/update distinct;
36. generation exact output target;
37. ambiguous output refused;
38. existing target requires collision decision;
39. no generic force overwrite;
40. generation uses IS-4;
41. update uses IS-8;
42. source injection uses IS-8;
43. whole-document replacement requires ownership evidence;
44. managed-region update preserves unrelated authored content;
45. unknown region/ownership fails safe;
46. stale output/update refused;
47. renderer success not generation success;
48. write success not Docs acceptance;
49. post-write IS-12 validation;
50. extraction read-only;
51. extraction not raw recursive concatenation;
52. aggregation selected inputs only;
53. aggregation provenance retained;
54. aggregation omissions visible;
55. AI optional failure preserves deterministic path;
56. AI required failure affects profile acceptance;
57. AI disclosure separately controlled;
58. AI cannot authorize write;
59. AI conflict with fact represented/rejected;
60. develop explicit use case;
61. build explicit use case;
62. preview explicit use case;
63. tooling does not start during ordinary generation;
64. VitePress provider not domain identity;
65. develop launch not content acceptance;
66. build technical state distinct from tool result;
67. preview does not implicitly build;
68. tooling cancellation propagated;
69. no global server singleton;
70. generated build artefacts not automatically managed resources;
71. coverage profile-relative;
72. stale input/output represented;
73. multi-target deterministic attribution;
74. completed target retained after later failure;
75. no rollback claim;
76. cancellation stops new work;
77. cancellation preserves completed effects;
78. recovery requires revalidation;
79. no blind update retry;
80. no blind tool launch retry;
81. sensitive values excluded;
82. managed content not automatically publish-safe;
83. Headless target ambiguity structured;
84. Headless output ambiguity structured;
85. no prompts/colors in domain;
86. no first-file/layer default;
87. no competing success Boolean;
88. semantic events presentation-free;
89. same-output conflict key;
90. independent reads not globally serialized;
91. explicit IS-23 composition/no singleton;
92. IS-12 provider substitution leaves domain-policy tests unchanged;
93. Nuxt fact consumption does not transfer Nuxt authority;
94. Quality evidence consumption does not transfer Quality authority;
95. documentation build remains distinct from App build;
96. IS-17 acceptance remains subordinate to IS-1 final acceptance.

Integration tests use controlled IS-12/capability/domain substitutes for policy tests and dedicated documentation fixtures for source/layer/test/file, generation/update, collision, stale, authored-preservation, AI and VitePress lifecycle cases.

---

## 49. Current Implementation Disposition

| Current artefact/responsibility | Disposition | Version 1 treatment |
|---|---|---|
| `app/commands/docs/runDocs.ts` Docs command placeholder | **REPLACE / SPLIT / RELOCATE** | Current file contains only TODO scaffolding. Replace with IS-22 adapter routing to explicit IS-17 use cases. |
| single broad `runDocs` command concept | **SPLIT** | Thirteen canonical semantic use cases preserve target/output/tooling distinctions. |
| `app/commands/nuxt/extractDocs.ts` location | **RELOCATE / ADAPT** | Documentation extraction is Docs intent; transitional adapter may preserve compatibility only. |
| current absence of Docs target/profile/output policy | **ADD** | Implement from DD-3.4/FR-DOCS, not from implementation guesses. |
| current source scanners/strategies | **RETAIN useful mechanisms below domain / RELOCATE** | IS-7 supplies structural facts; IS-12 maps them. |
| current CodeService/documentation strategies | **SPLIT / REPLACE topology** | Useful recognition/rendering responsibilities migrate under IS-7/8/12; no mixed domain service. |
| current template resources | **RETAIN / ADAPT below domain** | IS-9 owns declarative identity/rendering; IS-17 chooses profile/output policy. |
| direct file writes from documentation paths | **REPLACE** | IS-4 for generation, IS-8 for existing-document/source update. |
| direct LLM calls from documentation paths | **REPLACE** | IS-12/IS-10 bounded enrichment; IS-17 decides profile acceptance. |
| VitePress scripts/config where present | **RETAIN / ADAPT below domain** | IS-12 tool adapter consumes configured technical mechanism; IS-17 owns develop/build/preview intent. |
| prompts/spinners/colors/logging in command architecture | **RELOCATE** | IS-22 presentation + IS-1 events/outcomes. |
| singleton/service-locator patterns | **REPLACE** | IS-23 explicit composition/injection. |

The near-empty current Docs command implementation is not normative architecture. DD-3.4 and FR-DOCS-001–119 define the target implementation.

---

## 50. Migration Sequence

1. add Docs-domain contracts and thirteen canonical descriptors;
2. add IS-2-backed target resolver and duplicate normalization;
3. add operation-relative eligibility evaluator;
4. add profile/evidence-selection/output/enrichment/continuation policies;
5. inject IS-12 Documentation Capability;
6. implement read-only complete-application/source/layers/layer/tests/file documentation flows;
7. implement provenance-sensitive evidence acquisition through owning capabilities/domains;
8. implement `docs.extract` and `docs.aggregate` as read-only flows;
9. implement generation collision policy and IS-4 creation path;
10. implement explicit existing-document/source update policies through IS-8;
11. add post-write IS-12 validation and Docs acceptance;
12. integrate optional AI enrichment through IS-12/IS-10 with provenance/disclosure controls;
13. implement documentation coverage/freshness interpretation;
14. implement deterministic multi-target continuation/partial-effect handling;
15. implement `docs.develop`, `docs.build`, `docs.preview` over IS-12 tooling;
16. add cancellation/tool lifecycle/recovery semantics;
17. relocate `nuxt.extractDocs` compatibility path to Docs intent;
18. replace broad `runDocs.ts` placeholder with IS-22 adapter registrations;
19. remove direct file/LLM/tool/provider access from Docs application paths;
20. remove Docs singleton/service-locator patterns as IS-23 composition lands;
21. run authority, provenance, collision, preservation, Headless, stale-state, partial-effect and provider-substitution conformance suites.

---

## 51. Traceability

| Implementation concern | Governing authority |
|---|---|
| domain boundary/read-only/delegation | DD-DOCS-001–004; FR-DOCS-001–005 |
| invocation/context/scope/cancellation | DD-3.4 §§5–8; FR-DOCS-006–018 |
| target model/eligibility | DD-DOCS-005–009; FR-DOCS-019–030 |
| profile/output/coverage | DD-DOCS-010–015; FR-DOCS-031–040, 073–083, 106–113 |
| complete application | DD-DOCS-017–019; FR-DOCS-031–040 |
| source documentation | DD-DOCS-020 onward source orchestration; FR-DOCS-041–050 |
| layer documentation | DD-3.4 layer orchestration; FR-DOCS-051–060 |
| test documentation | DD-3.4 test orchestration; FR-DOCS-061–066 |
| selected file | DD-3.4 file orchestration; FR-DOCS-067–072 |
| generation/update/preservation | DD-3.4 output/update design; FR-DOCS-073–083, 114–119; IS-4/IS-8 |
| AI enrichment | DD-3.4 AI policy; FR-DOCS-084–090; IS-10/IS-12 |
| tooling | DD-3.4 tooling design; FR-DOCS-091–099; IS-12/IS-5 |
| extraction/aggregation | DD-3.4 extraction/aggregation; FR-DOCS-100–105 |
| results/acceptance | DD-3.4 result/acceptance contracts; FR-DOCS-106–113; IS-1 |
| documentation capability mechanics | DD-2.9 / IS-12 |
| Nuxt facts | DD-3.3 / IS-13/IS-16 |
| final application acceptance | DD-1.5 / IS-1 |

---

## 52. Version 1 Non-Drift Baseline

```text
IS-22 adapter -> IS-1 canonical invocation/authority
                     |
                     +--> IS-2 managed project/documentation scope
                     +--> IS-3 operation-effective documentation policy
                     |
                     v
                IS-17 Docs Domain
                     |
                     +--> target / eligibility / profile policy
                     +--> evidence / provenance selection
                     +--> generation vs update / collision policy
                     +--> multi-target / tooling / recovery orchestration
                     |
                     +--> IS-12 documentation model/render/tool semantics
                     +--> IS-7 source facts
                     +--> IS-13/16 Nuxt facts
                     +--> IS-10 optional AI enrichment
                     +--> IS-4 generation persistence
                     +--> IS-8 existing-document/source transformation
                     |
                     v
              Docs-domain acceptance
                     |
                     v
              IS-1 final acceptance
                     |
                     v
        canonical AppManager outcome
```

The non-drift rule is:

> **Version 1 Docs Domain owns documentation application intent, semantic target/profile/evidence/output policy, generation-versus-update decisions, orchestration, coverage interpretation and Docs-domain acceptance. It never derives mutation authority from discovery or existing prose, turns IS-12 into an application domain, treats generated or AI prose as structural truth, absorbs Nuxt/Quality/Git/source semantics because they are documented, overwrites existing documentation by renderer convenience, starts tooling as an implicit side effect, hides partial documentation effects, or publishes a competing final AppManager outcome.**