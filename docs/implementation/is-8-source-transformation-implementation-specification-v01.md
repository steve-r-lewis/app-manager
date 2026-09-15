# IS-8 — Source Transformation Implementation Specification

> **Document type:** Level 4 Implementation Specification
>
> **Status:** Version 1 implementation baseline
>
> **Implementation ID:** IS-8
>
> **Primary Detailed Design:** [DD-2.5 — Source Transformation](../dd_2_shared_capabilities/dd-2-5-source-transformation-detailed-design-v01.md)
>
> **Related Detailed Designs:** [DD-2.1 — Resource Access](../dd_2_shared_capabilities/dd-2-1-resource-access-detailed-design-v01.md), [DD-2.2 — Process Execution](../dd_2_shared_capabilities/dd-2-2-process-execution-detailed-design-v01.md), [DD-2.3 — Repository Capability](../dd_2_shared_capabilities/dd-2-3-repository-capability-detailed-design-v01.md), [DD-2.4 — Source Intelligence](../dd_2_shared_capabilities/dd-2-4-source-intelligence-detailed-design-v01.md), [DD-1.3 — Managed Project](../dd_1_application_core/dd-1-3-managed-project-detailed-design-v01.md), [DD-1.4 — Configuration Resolution](../dd_1_application_core/dd-1-4-configuration-resolution-detailed-design-v01.md), [DD-1.5 — Application Engine](../dd_1_application_core/dd-1-5-application-engine-detailed-design-v01.md)
>
> **Primary Functional authority:** [Source Transformation Functional Specification](../functional/source-transformation-functional-specification-v01.md)
>
> **Related implementations:** [IS-4 — Resource Access](is-4-resource-access-implementation-specification-v01.md), [IS-5 — Process Execution](is-5-process-execution-implementation-specification-v01.md), [IS-6 — Repository Capability](is-6-repository-capability-implementation-specification-v01.md), [IS-7 — Source Intelligence](is-7-source-intelligence-implementation-specification-v01.md)
>
> **Runtime decision:** [ADR-0001 — Primary Application Runtime](../project_management/decisions/adr-0001-primary-application-runtime.md)
>
> **Register:** [AppManager Implementation Specification](implementation-specification-v01.md)
>
> **Governing plan:** [Implementation Specification Plan](../project_management/implementation-specification-plan-v01.md)

## 1. Purpose

IS-8 defines the concrete Node.js/TypeScript implementation of the Version 1 Source Transformation capability.

Its job is to convert an authoritative caller's bounded source-change intent and current IS-7 evidence into an immutable, reviewable transformation plan; apply only an approved and still-applicable plan through bounded mechanisms; validate the resulting source; and return truthful transformation evidence to the owning use case.

The governing implementation rules are:

> **Recognition is evidence, not mutation authority.**

> **A plan describes a bounded proposed change; it does not apply that change.**

> **A successful write is not source validation, and source validation is not final AppManager acceptance.**

IS-8 preserves useful current header, JSDoc, JSON/JSONC and Vue mutation mechanics where they can satisfy these contracts. It does not preserve the current `CodeService`/`ICodeStrategy` topology as architectural authority.

---

## 2. Scope and Non-Ownership

IS-8 owns concrete implementation for:

- transformation capability discovery;
- bounded transformation requests supplied by authoritative callers;
- intent-specific strategy/provider resolution;
- immutable transformation plans and material plan identity;
- semantic planned edits above provider-native patches;
- explicit target/source-revision binding;
- preservation and ownership constraints supplied upstream;
- preconditions and expected postconditions;
- preview data derived from the executable plan;
- dry-run evaluation without persistence;
- approval-evidence consumption and plan binding;
- immediate pre-mutation freshness checks;
- provider-neutral edit preparation;
- bounded single-target and multi-target execution;
- explicit atomicity/continuation semantics;
- per-target effect evidence;
- source-level validation;
- partial, cancelled and indeterminate state preservation;
- recovery evidence;
- normalized transformation diagnostics;
- cancellation propagation;
- safe technical concurrency;
- migration of conforming mutation mechanics from current strategies and `CodeService`.

IS-8 does **not** own:

- command/use-case identity or application intent;
- Managed Project identity, managed scope, ownership classification or target eligibility;
- application authorization/confirmation policy;
- effective-configuration precedence;
- source-recognition semantics or IS-7 fact ownership;
- arbitrary filesystem access or write authority;
- repository workflow/rollback policy;
- AI prompt/provider authority;
- Documentation/Nuxt/Quality/domain policy;
- universal formatting policy;
- universal rollback/transaction guarantees;
- final DD-1.2/DD-1.5 application acceptance;
- generic source editing unrelated to a registered transformation kind.

---

## 3. Concrete Module Boundary

The target Version 1 layout is:

```text
app/
└── capabilities/
    └── source_transformation/
        ├── source-transformation.ts
        ├── contracts/
        │   ├── transformation-request.ts
        │   ├── transformation-kind.ts
        │   ├── transformation-plan.ts
        │   ├── planned-edit.ts
        │   ├── transformation-approval.ts
        │   ├── transformation-effects.ts
        │   ├── transformation-validation.ts
        │   └── transformation-results.ts
        ├── strategy-resolver.ts
        ├── plan-builder.ts
        ├── plan-validator.ts
        ├── plan-fingerprint.ts
        ├── freshness-coordinator.ts
        ├── execution-coordinator.ts
        ├── validation-coordinator.ts
        ├── evidence-normalizer.ts
        └── providers/
            ├── text/
            ├── jsonc/
            └── composite/
```

The layout expresses semantic ownership rather than consumer count. IS-8 contracts remain capability-local even when App, Docs, Nuxt, Settings, AI or other domains consume them.

IS-7 facts are imported as IS-7-owned evidence. IS-8 shall not duplicate or re-home their semantic contracts merely because transformation consumes them.

Provider directories are implementation-mechanism families, not public transformation taxonomies.

---

## 4. Public Capability Contract

The AppManager-facing capability is structurally equivalent to:

```ts
export interface SourceTransformation {
  capabilities(request: TransformationCapabilityRequest): TransformationCapabilityResult;
  plan(request: TransformationRequest): Promise<TransformationPlanningResult>;
  preview(request: TransformationPreviewRequest): Promise<TransformationPreviewResult>;
  execute(request: TransformationExecutionRequest): Promise<TransformationExecutionResult>;
  validate(request: TransformationValidationRequest): Promise<TransformationValidationResult>;
}
```

`plan()` is non-mutating.

`preview()` derives from an existing validated plan or performs the same deterministic provider preparation used by execution without committing resource effects.

`execute()` accepts a plan plus upstream approval/authority evidence. It does not prompt or authorize itself.

`validate()` may be exposed separately for recovery/revalidation workflows, but normal `execute()` performs all validation obligations required by the plan before returning a fully source-valid state.

There is no public `editFile(path, callback)`, `replaceAll()`, `applyPatch(any)` or provider-native AST/CST escape hatch.

---

## 5. Transformation Kinds

Transformation support is registered by semantic transformation kind, not only source extension.

Version 1 shall define stable kinds only where approved consumers require them, initially including the families demonstrated by current implementation and DD-2.5:

```text
metadata_upsert
source_header_upsert
documentation_insert
configuration_value_upsert
generated_region_replace
bounded_region_replace
bounded_structural_remove
```

A kind describes the intended source effect, not the application reason for requesting it.

For example, `documentation_insert` does not decide which declaration deserves documentation; the Docs/use-case owner supplies the target and proposed content.

New transformation kinds require an explicit contract for targets, preservation, postconditions and provider support. They are not created dynamically from arbitrary strings supplied by project content or AI output.

---

## 6. Transformation Request

A request is structurally equivalent to:

```ts
export interface TransformationRequest {
  readonly intent: TransformationIntentRef;
  readonly kind: TransformationKind;
  readonly targets: readonly TransformationTarget[];
  readonly managedScope: ManagedScopeRef;
  readonly sourceEvidence: readonly SourceEvidenceBinding[];
  readonly desiredEffect: TransformationDesiredEffect;
  readonly preservation: readonly PreservationConstraint[];
  readonly ownership: readonly OwnershipConstraint[];
  readonly postconditions: readonly TransformationPostcondition[];
  readonly executionPolicy: TransformationExecutionPolicy;
  readonly effectiveConfiguration?: TransformationConfigurationView;
  readonly proposedContent?: ProposedTransformationContent;
  readonly signal?: AbortSignal;
  readonly correlationId?: string;
}
```

The request contains references/projections from IS-1/IS-2/IS-3/IS-7; IS-8 does not reconstruct those authorities.

`managedScope` is evidence that the caller has already resolved scope. IS-8 validates that every target is covered by the supplied scope projection but does not broaden that scope.

`proposedContent` is data. AI output, user text or provider-native patch material never carries authority by itself.

---

## 7. Transformation Target

Each target binds logical intent to one concrete resource and, where applicable, one structural region:

```ts
export interface TransformationTarget {
  readonly id: TransformationTargetId;
  readonly resource: FileResourceRef;
  readonly source: SourceRef;
  readonly expectedRevision: ResourceRevision;
  readonly structuralTarget?: SourceFactRef;
  readonly expectedRange?: SourceRange;
  readonly ownership: SourceOwnership;
  readonly containment: ResourceContainmentView;
}
```

The resource/source/revision types are imported from IS-4/IS-7 where possible rather than duplicated.

`SourceFactRef` references a fact identity/revision; the fact itself is evidence, not edit authority.

A range is never sufficient alone when correctness depends on semantic identity. The plan also carries the structural/precondition evidence needed to reconcile the target immediately before mutation.

---

## 8. Strategy Resolution

Internal transformation providers implement a contract such as:

```ts
interface TransformationProvider {
  readonly id: TransformationProviderId;
  describeCapabilities(): readonly TransformationProviderCapability[];
  build(request: ProviderPlanRequest): Promise<ProviderPlanEvidence>;
  prepare(request: ProviderPreparationRequest): Promise<ProviderPreparedMutation>;
  validate(request: ProviderValidationRequest): Promise<ProviderValidationEvidence>;
}
```

Provider selection uses:

```text
transformation kind
+ recognized source kind/language
+ required preservation guarantees
+ composite-region requirements
+ required validation capability
+ governed provider configuration
```

Extension alone is insufficient.

Registry order and import order are prohibited semantic tie-breaks. If two eligible providers offer materially different guarantees and policy does not select one, planning returns ambiguity/conflict.

A structure-aware provider may fall back to a textual provider only when the weaker provider still satisfies every required preservation/precondition/postcondition guarantee. Otherwise the transformation is unsupported rather than silently weakened.

---

## 9. Provider Mechanisms for Version 1

Version 1 may use:

- bounded string/range construction for simple header/comment insertions;
- adapted language-specific current strategies where exact preservation is proven by tests;
- `jsonc-parser` `modify()`/`applyEdits()` for JSON/JSONC path edits;
- Vue/composite region mapping supplied by IS-7;
- optional structure-aware TypeScript/compiler mechanisms where a registered transformation cannot be implemented safely by bounded retained mechanics;
- IS-5 external tools only for transformations/validation explicitly requiring them.

No universal AST requirement is introduced.

No regex implementation is accepted merely because current code uses regex. Each provider must satisfy its transformation-specific guarantees.

Provider-native text edits, JSONC edits, syntax nodes and process results remain internal.

---

## 10. Transformation Plan

The canonical plan is immutable:

```ts
export interface TransformationPlan {
  readonly id: TransformationPlanId;
  readonly materialFingerprint: TransformationPlanFingerprint;
  readonly intent: TransformationIntentRef;
  readonly kind: TransformationKind;
  readonly scope: ManagedScopeRef;
  readonly targets: readonly PlannedTransformationTarget[];
  readonly edits: readonly PlannedEdit[];
  readonly preservation: readonly PreservationConstraint[];
  readonly preconditions: readonly TransformationPrecondition[];
  readonly postconditions: readonly TransformationPostcondition[];
  readonly validation: readonly TransformationValidationRequirement[];
  readonly executionPolicy: TransformationExecutionPolicy;
  readonly providerAssumptions: readonly TransformationProviderAssumption[];
  readonly diagnostics: readonly TransformationDiagnostic[];
  readonly createdAt: string;
}
```

The plan contains no mutable “approved” Boolean. Approval is separate evidence bound to the plan fingerprint.

Plan construction performs no IS-4 mutation and no external tool with consequential source effects.

---

## 11. Planned Edit Model

A planned edit is semantic first:

```ts
export interface PlannedEdit {
  readonly id: PlannedEditId;
  readonly target: TransformationTargetId;
  readonly kind: PlannedEditKind;
  readonly structuralTarget?: SourceFactRef;
  readonly intendedEffect: TransformationEffectDescriptor;
  readonly expectedRange?: SourceRange;
  readonly preconditions: readonly TransformationPrecondition[];
  readonly preservation: readonly PreservationConstraint[];
  readonly dependencies: readonly PlannedEditId[];
  readonly expectedPostconditions: readonly TransformationPostcondition[];
  readonly sensitivity?: TransformationSensitivity;
}
```

Provider-native patches are generated during preparation and linked back to one or more `PlannedEditId` values.

The shared plan shall not become a generic arbitrary patch container.

---

## 12. Plan Validation

`plan-validator.ts` rejects a plan before preview/approval when any of these conditions holds:

- target is not covered by supplied managed-scope evidence;
- target/source/resource identities disagree;
- target revision does not match supplied IS-7 evidence;
- structural fact belongs to another snapshot/resource;
- requested kind is unsupported for the source/provider guarantees;
- ownership constraints prohibit the effect;
- planned edit exceeds authorized target/region;
- edit dependencies contain a cycle;
- preservation constraints cannot be met;
- required postcondition cannot be validated;
- execution policy requests an unsupported atomicity guarantee;
- provider assumptions are internally contradictory.

Plan validation proves internal applicability only. It does not authorize execution.

---

## 13. Material Plan Fingerprint

`plan-fingerprint.ts` produces a SHA-256 fingerprint over a canonical serialization of material plan fields including:

- intent identity;
- transformation kind;
- managed-scope identity/revision where supplied;
- target resource/source identities;
- source revisions;
- semantic planned effects;
- destructive/create/delete character;
- preservation constraints;
- execution/atomicity policy;
- required postconditions/validation;
- provider guarantee assumptions.

Non-material fields such as timestamps, diagnostic wording, presentation-only preview formatting and correlation metadata are excluded.

Sensitive replacement content is represented in the fingerprint by a one-way digest rather than copied into approval metadata.

The fingerprint is approval linkage and stale-plan comparison evidence, not an authorization token.

---

## 14. Preview

`preview()` consumes the validated plan and provider preparation output.

It returns normalized data such as:

```ts
export interface TransformationPreview {
  readonly plan: TransformationPlanId;
  readonly fingerprint: TransformationPlanFingerprint;
  readonly targets: readonly TransformationTargetPreview[];
  readonly expectedEffects: readonly TransformationEffectDescriptor[];
  readonly excerpts?: readonly SafeTransformationExcerpt[];
  readonly diff?: NormalizedSourceDiff;
  readonly uncertainty: readonly TransformationUncertainty[];
}
```

Preview and execution use the same provider preparation logic. There is no separate “preview transformation” implementation.

Sensitive excerpts are omitted or redacted according to target sensitivity/effective configuration.

A preview may be provisional when exact provider output depends on execution-time state; that uncertainty is explicit.

---

## 15. Dry Run

Dry run is an application/use-case execution mode that requests planning/preview/validation of plan applicability without committing source mutation.

IS-8 shall not call IS-4 create/replace/delete/move during dry run.

Providers used for preparation in dry run must be side-effect-free with respect to managed source. An external formatter that can only operate in-place cannot be used as a dry-run preparation provider unless isolated against non-authoritative temporary content and its output is treated as proposal data.

Dry run never creates a false `applied` effect.

---

## 16. Approval Evidence

Execution receives separate upstream evidence:

```ts
export interface TransformationApprovalEvidence {
  readonly state: 'not_required' | 'approved';
  readonly planFingerprint: TransformationPlanFingerprint;
  readonly intent: TransformationIntentRef;
  readonly scope: ManagedScopeRef;
  readonly authority: ApprovalAuthorityRef;
  readonly constraints?: readonly ApprovalConstraint[];
}
```

IS-8 verifies material fingerprint/intent/scope equality and any supplied constraints immediately before consequential execution.

A changed target, effect, destructive character, scope, source revision or required validation changes the material plan and invalidates prior approval.

IS-8 never prompts and never manufactures `approved` evidence in TUI or Headless operation.

---

## 17. Freshness and Precondition Checking

Immediately before mutation, `freshness-coordinator.ts`:

1. inspects/reads each target through IS-4 under the original containment constraints;
2. compares IS-4 revision evidence with the plan's expected revision;
3. obtains a fresh immutable source snapshot where content-dependent preconditions exist;
4. requests only required IS-7 facts to re-establish structural preconditions;
5. verifies ownership/scope evidence has not been superseded when the caller supplies revisioned scope/ownership evidence;
6. verifies provider capability assumptions still hold.

A revision mismatch does not automatically mean “overwrite anyway”.

Result states include:

```text
fresh
stale_replan_required
precondition_failed
scope_evidence_stale
ownership_evidence_stale
provider_changed
cancelled
indeterminate
```

IS-8 may deterministically rebind a locator/range only if the same semantic target is unambiguously established and the material plan remains equivalent. Any material effect/target change returns `replan_required` to the owning use case.

---

## 18. Prepared Mutation

After freshness succeeds, a provider converts semantic planned edits into an internal prepared mutation:

```ts
interface ProviderPreparedMutation {
  readonly target: TransformationTargetId;
  readonly baseRevision: ResourceRevision;
  readonly resultingContent?: string | Uint8Array;
  readonly resourceOperation: 'none' | 'create' | 'replace' | 'delete';
  readonly providerEdits: readonly ProviderEditEvidence[];
  readonly predictedPostconditions: readonly TransformationPostcondition[];
  readonly guarantee: PreparedMutationGuarantee;
}
```

The provider output remains internal. `resultingContent` for replacement is passed to IS-4 with the exact base revision precondition.

Preparation itself does not write the authoritative target.

---

## 19. Resource Access Execution

IS-8 delegates filesystem effects to IS-4:

- existing source replacement -> `ResourceAccess.replace()` with `must_exist`, expected revision and requested `atomic_single_file` where available/required;
- explicit create-if-absent -> `ResourceAccess.create()` with `must_not_exist`;
- explicit deletion -> `ResourceAccess.delete()` with revision precondition;
- directory/resource topology operations are used only if a registered transformation kind actually requires them.

IS-8 never calls `node:fs` directly in providers/coordinators.

IS-4 write success is recorded as resource-effect evidence, then source validation proceeds.

The compare-before-replace revision check is mandatory even when IS-8 just performed its own freshness read. This closes the race between transformation freshness validation and consequential resource replacement as far as the local provider contract permits.

---

## 20. Single-Target Execution States

A target execution result distinguishes:

```ts
export type TransformationTargetState =
  | 'not_attempted'
  | 'already_satisfied'
  | 'prepared'
  | 'applied'
  | 'failed_before_effect'
  | 'failed_after_effect'
  | 'validation_failed_after_effect'
  | 'cancelled_before_effect'
  | 'cancelled_after_effect'
  | 'indeterminate';
```

`already_satisfied` is first-class and produces no write.

`applied` means the resource effect is known to have occurred. It does not mean source validation passed.

The final target evidence carries execution state and validation state separately.

---

## 21. Multi-Target Execution Policy

The plan carries:

```ts
export interface TransformationExecutionPolicy {
  readonly atomicity:
    | 'single_target_atomic_only'
    | 'provider_transaction_required'
    | 'ordered_best_effort';
  readonly onFailure: 'stop' | 'continue_independent';
  readonly dependencyMode: 'respect_edit_dependencies';
}
```

Version 1 local-file composition normally provides `single_target_atomic_only`: each IS-4 replacement may be atomic for one file, but the overall multi-file plan is not claimed atomic.

`provider_transaction_required` is supported only by a provider that honestly implements and verifies a multi-target transaction boundary. No such generic transaction is assumed for the Node filesystem.

`continue_independent` is legal only for targets proven independent by plan dependencies and supplied owner policy.

---

## 22. Ordering and Concurrency

The execution coordinator topologically orders edit/target dependencies.

Independent targets may be prepared or validated concurrently. Consequential writes may also proceed concurrently only when:

- the plan permits independent continuation;
- targets do not resolve to the same effective resource;
- no dependency crosses them;
- resource preconditions remain independently enforceable;
- cancellation/evidence remains truthful.

Version 1 does not globally serialize all transformations and does not introduce a process-wide source lock manager without a concrete need.

Concurrency safety primarily relies on revision/preconditioned IS-4 mutation. Semantic conflict policy remains upstream.

---

## 23. Cancellation

IS-8 consumes the invocation `AbortSignal`.

Before the first consequential effect, observed cancellation returns `cancelled` without initiating writes.

After effects begin, cancellation stops new independent effects as soon as safely practical. Already completed effects remain completed.

If a provider/resource operation cannot be interrupted, IS-8 waits only as required to determine the resulting state and records cancellation timing.

Cancellation never implies rollback.

Post-cancellation bounded inspection/validation is permitted when necessary to distinguish applied from indeterminate state.

---

## 24. Source-Level Validation

`validation-coordinator.ts` executes the plan's explicit obligations after mutation.

Validation kinds include:

```text
structural_postcondition
parse_or_syntax
schema
embedded_region
preservation
provider_specific
external_tool
```

IS-7 is the preferred mechanism for structural postconditions. A new post-mutation snapshot is acquired through IS-4 and analyzed independently; pre-mutation facts are never relabelled current.

For JSON/JSONC, validation includes parse/structure checks plus the requested path/value postcondition.

For composite Vue changes, validation may analyze both the changed embedded region and containing SFC.

IS-5 external tools may be used only when the plan explicitly requires a technical validator. Exit code zero remains process evidence until the validation provider interprets it.

---

## 25. Validation Result

```ts
export type TransformationValidationState =
  | 'not_required'
  | 'valid'
  | 'invalid'
  | 'partial'
  | 'unsupported'
  | 'provider_failed'
  | 'cancelled'
  | 'indeterminate';
```

Validation evidence records:

- target and post-mutation revision;
- obligations checked;
- satisfied/unsatisfied postconditions;
- IS-7 facts/revisions used;
- preservation evidence where checked;
- provider evidence;
- diagnostics.

`valid` means all required source-level obligations passed. It does not mean the owning use case accepts the application operation.

---

## 26. Preservation Verification

Preservation constraints are enforced during planning/provider selection and, where practical, checked after mutation.

Version 1 constraints include:

```text
preserve_unrelated_content
preserve_comments
preserve_unrelated_key_order
preserve_shebang
preserve_leading_directives
preserve_line_endings
preserve_encoding
preserve_non_target_regions
preserve_generated_region_boundary
no_whole_file_reformat
```

Not every provider can prove every constraint. Capability discovery advertises supported guarantees.

A provider that serializes a whole JSON document cannot satisfy `preserve_comments` for JSONC and therefore cannot be selected for that request.

For exact bounded textual transformations, IS-8 may compare unchanged before/after spans or hashes to prove preservation where economical.

---

## 27. Formatting

Formatting is part of the plan only when required to express the bounded change or explicitly requested by the owning use case/effective configuration.

Providers infer existing local formatting where feasible. For JSONC, `jsonc-parser` formatting options should be derived from current indentation/EOL conventions rather than always forcing the current implementation's hard-coded two spaces.

A formatter that rewrites the whole file is rejected when `no_whole_file_reformat` or equivalent preservation applies.

Formatting outside the target cannot be introduced as opportunistic cleanup.

---

## 28. TypeScript and JavaScript Header/Documentation Provider

The current TypeScript mutation mechanics are retained only as bounded provider material.

### 28.1 Header upsert

The provider shall:

- preserve a shebang exactly at byte/character position zero;
- target only the recognized file-header region or insertion point;
- distinguish existing AppManager/header metadata from arbitrary leading JSDoc where replacement semantics require that distinction;
- avoid `trimStart()` when it would remove unrelated leading content/formatting;
- produce a semantic `source_header_upsert` edit and exact prepared replacement;
- validate header presence/value and shebang preservation after mutation.

The current broad `^\s*/** ... */` removal is therefore **ADAPT**, not accepted unchanged.

### 28.2 Documentation insertion

The target declaration comes from IS-7 `DeclarationFact`/documentation-presence evidence, not a fresh regex lookup by function name alone.

The provider inserts the supplied validated documentation immediately at the verified declaration target, preserving indentation/EOL convention.

If the declaration moved or became ambiguous, freshness validation causes replan/failure rather than inserting at the first matching name.

---

## 29. CSS and HTML Header Providers

Existing CSS/HTML header mechanics may be retained/adapted where tests prove bounded behaviour.

CSS transformation must preserve required leading constructs such as `@charset` according to source semantics and must not replace an arbitrary first comment unless it is recognized as the intended header region.

HTML transformation must target a recognized header/comment insertion region and preserve doctype/leading constructs according to the transformation contract.

The known HTML scanner range defect is an IS-7 provider issue; IS-8 shall not rely on affected range evidence until corrected and covered by IS-7 regression tests.

---

## 30. JSON and JSONC Provider

The current `jsonc-parser` mechanism is a strong Version 1 implementation candidate and shall be retained/adapted.

For `configuration_value_upsert`/`metadata_upsert`:

1. the owning use case supplies schema/path semantic intent;
2. IS-7 confirms the source kind/structure and relevant current path evidence;
3. IS-8 plan records the semantic path/value effect and revision;
4. provider uses `modify()` to derive bounded text edits;
5. formatting options are inferred/configured without unnecessary rewrite;
6. `applyEdits()` is applied to in-memory current content only;
7. IS-4 conditionally replaces the resource;
8. post-mutation IS-7/schema validation verifies the requested path/value.

The current `parseHeaderText()` convention that converts free-form header lines into JSON keys is not a target shared transformation API. The caller supplies typed semantic values/path.

Malformed non-empty JSON/JSONC returns planning/validation failure rather than silently returning unchanged content and allowing a caller to mistake that for success.

Deep path creation is supported only when the transformation kind/schema explicitly permits creation of missing intermediate objects.

---

## 31. Vue / Composite Provider

Vue transformations consume IS-7 composite-region mappings.

A plan targeting `<script>`/`<script setup>` binds to the exact recognized region identity and whole-source revision.

The provider transforms bounded embedded content and maps prepared edits back to whole-resource offsets without regex `content.replace(fullMatch, ...)` as the semantic target mechanism.

Non-target template/style/custom blocks must remain byte-for-byte or semantically unchanged according to preservation requirements.

If no script region exists, the current fallback of prepending a script-style header to the top of the `.vue` file is **not** retained. Creation of a new script block or file-level comment is a distinct explicit transformation kind/intent.

Post-validation checks both the embedded target and SFC structure where required.

---

## 32. AI-Proposed Content

AI output enters IS-8 only as `ProposedTransformationContent` supplied by an owning AI/domain workflow.

IS-8 shall:

- reject proposed targets outside the request;
- normalize/parse provider-native diff/tool-call formats below the capability boundary;
- reconcile proposal targets against current IS-7 evidence;
- validate content against the registered transformation kind;
- convert accepted proposal portions into ordinary semantic planned edits;
- preserve ambiguity rather than guessing;
- require normal approval/freshness/execution/validation.

IS-8 does not call an AI provider simply because a transformation request lacks content. AI generation belongs to IS-10/IS-20/owning workflow.

---

## 33. No-Op / Already-Satisfied Planning

If current verified source already satisfies the desired effect and all required postconditions, planning may produce a plan with no consequential edits and an `already_satisfied` expected result.

No-op plans retain target/revision/evidence so the owning use case can distinguish:

- already satisfied;
- unsupported;
- target absent;
- ambiguous;
- planning failed.

Execution of a no-op plan performs no write. It may revalidate freshness if the caller requires current-state assurance.

---

## 34. Result and Evidence Model

The overall execution result is multidimensional:

```ts
export interface TransformationExecutionEvidence {
  readonly plan: TransformationPlanId;
  readonly fingerprint: TransformationPlanFingerprint;
  readonly planningState: TransformationPlanningState;
  readonly approvalState: TransformationApprovalState;
  readonly freshnessState: TransformationFreshnessState;
  readonly targets: readonly TransformationTargetEvidence[];
  readonly validationState: TransformationValidationState;
  readonly effects: readonly TransformationEffectEvidence[];
  readonly recovery: readonly TransformationRecoveryEvidence[];
  readonly diagnostics: readonly TransformationDiagnostic[];
}
```

There is deliberately no single `success: boolean` contract.

The owning use case/IS-1 interprets this evidence into canonical DD-1.2 outcome semantics.

---

## 35. Recovery Evidence

For each affected target IS-8 records, where available:

- pre-mutation snapshot/revision reference;
- post-mutation revision;
- known resource effect;
- whether IS-4 staging completed/committed;
- validation result;
- whether state is known or indeterminate;
- whether a retained caller-owned snapshot could support a separately authorized restoration;
- bounded recommended next action.

IS-8 does not automatically restore from Git, overwrite with the old snapshot or advertise rollback merely because pre-mutation content is available.

A restoration/compensating edit is a new authorized consequential operation unless the plan explicitly used a provider transaction with defined rollback semantics.

---

## 36. Diagnostics

Initial stable diagnostic codes include:

```text
XFORM_UNSUPPORTED_KIND
XFORM_UNSUPPORTED_SOURCE
XFORM_PROVIDER_UNAVAILABLE
XFORM_PROVIDER_AMBIGUOUS
XFORM_TARGET_AMBIGUOUS
XFORM_TARGET_OUTSIDE_SCOPE
XFORM_OWNERSHIP_CONSTRAINT
XFORM_INVALID_PLAN
XFORM_PLAN_APPROVAL_MISMATCH
XFORM_PLAN_CHANGED
XFORM_STALE_SOURCE
XFORM_PRECONDITION_FAILED
XFORM_PRESERVATION_UNSUPPORTED
XFORM_PRESERVATION_VIOLATION
XFORM_ATOMICITY_UNSUPPORTED
XFORM_RESOURCE_PRECONDITION_FAILED
XFORM_MUTATION_FAILED
XFORM_PARTIAL_APPLICATION
XFORM_STATE_INDETERMINATE
XFORM_VALIDATION_FAILED
XFORM_VALIDATION_UNAVAILABLE
XFORM_VALIDATION_INDETERMINATE
XFORM_AI_PROPOSAL_INVALID
XFORM_CANCELLED
XFORM_RECOVERY_REQUIRED
XFORM_PROVIDER_FAILURE
```

Diagnostics carry target/edit/provider IDs and safe location data where useful. They do not expose whole source, protected values, raw AST/CST nodes, provider edit objects or arbitrary stack traces.

Provider/resource failures are preserved as causes/evidence but normalized before crossing IS-8.

---

## 37. Configuration

IS-8 consumes an effective IS-3 projection. It never reads settings/environment files directly.

Potential concerns include:

- enabled transformation providers;
- source/preview size limits;
- formatter/provider selection where material;
- line-ending/format conventions where explicitly governed;
- maximum diagnostics;
- external validation tool selection;
- generated-region marker conventions.

Provider selection configuration cannot override required preservation/safety guarantees.

No provider is permitted to establish its own hidden environment/settings precedence.

---

## 38. Composition and Lifecycle

IS-23 explicitly constructs:

1. IS-8 contracts/catalogue of transformation kinds;
2. retained/adapted text/JSONC/composite providers;
3. provider resolver;
4. plan builder/validator/fingerprint service;
5. freshness coordinator over IS-4 and IS-7;
6. execution coordinator over IS-4 and optional IS-5;
7. validation coordinator over IS-7 and optional specialist validators;
8. evidence normalizer;
9. `DefaultSourceTransformation`.

No singleton strategy registry or `codeService` instance forms the target composition.

Providers are immutable/stateless where practical. Per-plan mutable execution state is invocation-local.

---

## 39. Security and Safety

Implementation rules:

1. never execute analyzed source to transform it;
2. never dynamically import project-controlled transformer modules in Version 1;
3. never broaden a target because a provider/AI proposal references another file;
4. use IS-4 containment/revision preconditions for every consequential filesystem effect;
5. do not log source/replacement content by default;
6. bound preview excerpts and redact sensitive material;
7. do not follow symlinks outside IS-4 containment policy;
8. reject unsupported preservation rather than silently weakening it;
9. do not use repository cleanliness as authorization;
10. do not auto-rollback through Git;
11. do not treat writable paths as mutation authority;
12. do not allow arbitrary provider patches to bypass semantic plan validation.

---

## 40. Test and Conformance Requirements

### 40.1 Planning tests

Vitest tests shall verify at least:

1. planning is non-mutating;
2. unsupported transformation kind is explicit;
3. support is kind/source/guarantee specific;
4. extension alone does not select provider;
5. provider registration order does not change semantics;
6. weaker fallback occurs only when all guarantees remain satisfied;
7. plan targets cannot exceed supplied scope;
8. source facts from another revision/resource are rejected;
9. ownership constraints are enforced;
10. semantic planned edits retain provider-neutral traceability;
11. dependency cycles fail planning;
12. unsupported atomicity fails before execution;
13. no-op/already-satisfied is distinct from failure;
14. material plan fingerprint is deterministic;
15. material change changes fingerprint;
16. non-material presentation data does not change fingerprint.

### 40.2 Preview/approval tests

17. preview uses the same prepared plan as execution;
18. preview performs no authoritative write;
19. dry run performs no IS-4 mutation;
20. preview uncertainty is explicit;
21. sensitive content is absent from unsafe preview/diagnostics;
22. approval for another fingerprint is rejected;
23. material replan invalidates approval;
24. IS-8 never prompts for approval.

### 40.3 Freshness/execution tests

25. unchanged revision/preconditions permit execution;
26. stale revision prevents blind overwrite;
27. semantic target moved unambiguously may rebind only when material plan remains equivalent;
28. changed semantic target requires replan;
29. IS-4 replacement receives the exact fresh revision precondition;
30. race detected by IS-4 after freshness check returns stale/resource-precondition evidence;
31. successful write remains distinct from validation success;
32. already-satisfied performs no write;
33. failed-before-effect differs from failed-after-effect;
34. indeterminate is never reported unchanged;
35. single-file atomic guarantee is not promoted to multi-file atomicity;
36. stop/continue behaviour follows plan policy;
37. independent target concurrency does not reorder dependencies.

### 40.4 Cancellation/recovery tests

38. cancellation before mutation causes no write;
39. cancellation after one target preserves that effect evidence;
40. cancellation does not claim rollback;
41. bounded post-cancellation inspection can establish resulting state;
42. recovery evidence distinguishes prior snapshot availability from rollback guarantee.

### 40.5 Validation/preservation tests

43. post-mutation validation uses a new revision/snapshot;
44. parse success alone does not satisfy structural postcondition;
45. validation-provider failure differs from invalid transformed source;
46. preservation violation is explicit;
47. shebang is preserved by TS/JS header transformation;
48. unrelated leading JSDoc is not blindly replaced as AppManager header;
49. JSDoc insertion binds to verified declaration identity, not first matching name;
50. JSONC comments/order/format are preserved within promised guarantees;
51. malformed JSONC fails rather than masquerading as no-op;
52. deep JSON path creation occurs only when allowed;
53. Vue edit preserves non-target regions;
54. absent Vue script does not trigger implicit file-top fallback;
55. composite post-validation maps to whole-source coordinates;
56. CSS/HTML required leading constructs remain preserved;
57. external tool exit zero does not bypass validation interpretation.

### 40.6 Authority tests

58. IS-7 recognition alone cannot call execute;
59. writable IS-4 resource alone cannot call execute;
60. effective configuration cannot expand supplied scope;
61. AI proposal outside targets is rejected;
62. repository cleanliness/history does not change approval state;
63. source-valid evidence is returned without declaring final AppManager success;
64. equivalent inputs produce equivalent plans/evidence across TUI/Headless/host adapters.

---

## 41. Legacy Implementation Disposition

| Current artefact / responsibility | Disposition | Target owner/location | Preserved value | Required change |
|---|---|---|---|---|
| `app/services/codeService.ts` | SPLIT / REPLACE | IS-7 + IS-8 + AI/Docs/domain workflows | useful read-transform-write orchestration evidence | `inspect()` moves IS-7; mutation becomes plan/approval/freshness/IS-4/validation path; AI generation leaves transformation capability |
| `CodeService.updateHeader()` | RETAIN intent / ADAPT / RELOCATE | IS-8 transformation kinds/providers + owning use case | header-update use case mechanism | no direct read-transform-write; plan first, revision-bind, approve, conditionally replace, validate |
| `CodeService.generateDocFor()` | SPLIT / RELOCATE | IS-10/IS-12/domain + IS-7 + IS-8 | useful inspect -> propose -> inject workflow concept | AI prompt/provider call cannot live in IS-8; target by IS-7 fact; proposal enters normal IS-8 planning |
| `app/strategies/baseStrategy.ts` | REPLACE | IS-7 resolver + IS-8 strategy resolver | source-specific mechanism dispatch intent | extension-keyed singleton map cannot define recognition/transformation support or hidden provider policy |
| `ICodeStrategy` | SPLIT / REPLACE | IS-7 provider contracts + IS-8 provider contracts | common language-specific implementation grouping | read and mutation responsibilities separate; no universal header/docs methods |
| `TypescriptStrategy.parseMetadata()` / `findDocumentableBlocks()` | RELOCATE / ADAPT | IS-7 | useful read-only recognition | not IS-8 implementation |
| `TypescriptStrategy.injectHeader()` | RETAIN / ADAPT / RELOCATE | IS-8 text provider | shebang-aware insertion and existing mechanism | replace broad leading-JSDoc removal/`trimStart`; semantic target, preservation, plan and validation required |
| `TypescriptStrategy.injectFunctionDoc()` | RETAIN / ADAPT / RELOCATE | IS-8 documentation-insert provider | indentation-aware insertion | target by verified IS-7 declaration/range, not regex name search; preserve EOL/content |
| `JavascriptStrategy` TS inheritance | RETAIN / ADAPT | IS-8 provider composition | shared mechanics currently useful | explicit JS capability identity; inheritance is implementation convenience, not semantic equivalence |
| `CssStrategy.injectHeader()` | RETAIN / ADAPT / RELOCATE | IS-8 text provider | source-specific header placement | bind recognized header/insertion target and preservation/postvalidation |
| `HtmlStrategy.injectHeader()` | RETAIN / ADAPT / RELOCATE | IS-8 text provider | HTML comment construction | use verified region/leading-construct semantics; do not rely on defective IS-7 ranges until fixed |
| `JsonStrategy.parseMetadata()` | RELOCATE / ADAPT | IS-7 | useful JSON metadata recognition | no mutation ownership |
| `JsonStrategy.injectHeader()` | SPLIT / ADAPT / RELOCATE | IS-8 JSONC provider | `jsonc-parser` surgical edit mechanics and deep path support | typed semantic path/value plan; infer formatting; malformed source is failure; no free-form header parsing as API |
| `jsonc-parser modify()/applyEdits()` | RETAIN | IS-8 JSONC provider | comment/order-preserving bounded edits | provider-native edits remain internal and revision-bound |
| `VueStrategy` read/extraction logic | RELOCATE / ADAPT | IS-7 | composite recognition evidence | IS-8 consumes normalized region mapping rather than re-recognizing via regex |
| `VueStrategy.injectHeader()` | RETAIN / ADAPT / RELOCATE | IS-8 composite provider | embedded-script transformation concept | exact region binding; remove implicit no-script file-top fallback; preserve non-target regions |
| `VueStrategy.injectFunctionDoc()` | RETAIN / ADAPT / RELOCATE | IS-8 composite provider | delegate bounded script transformation | map verified embedded coordinates; avoid whole-block regex replacement as semantic mechanism |
| strategy tests under `tests/unit/code-strategies/` | RETAIN / SPLIT / ADAPT | IS-7 provider tests + IS-8 provider/conformance tests | valuable language-specific fixtures/behaviour | add plan, stale, preservation, validation, cancellation and authority cases; move read-only tests to IS-7 |
| `fileService.read()/write()` sequencing from CodeService | REPLACE at boundary | IS-4 Resource Access + IS-8 coordinator | shared resource access intent | use explicit `FileResourceRef`, snapshots/revisions and conditional create/replace; no blind write |
| direct logger calls in transformation workflow | RELOCATE / ADAPT | application observability | useful operational events | structured/safe evidence/events; no provider/application outcome authority |
| direct `llmService.generate()` in CodeService | RELOCATE | IS-10/IS-20/Docs workflow | AI proposal generation | AI output is untrusted proposal supplied to IS-8; no direct AI dependency in core transformation provider |
| global `app/types/` transformation declarations | ADAPT / RELOCATE | `app/capabilities/source_transformation/contracts/` | reusable type concepts | semantic ownership local to IS-8; IS-7-owned facts remain imported from IS-7 |
| singleton strategy instances / `codeService` singleton | REPLACE | IS-23 composition | stateless reuse intent | explicit DI/composition; invocation-local plan/execution state |

---

## 42. Migration Sequence

Implementation should proceed in this order:

1. add IS-8 capability-local request/plan/edit/approval/effect/validation/result contracts;
2. implement transformation-kind catalogue and provider capability descriptors;
3. implement deterministic strategy resolver with fake providers;
4. implement plan builder, validator and material fingerprint with no mutation dependency;
5. integrate IS-7 fact/revision bindings and IS-2 scope/ownership projections;
6. implement preview/dry-run preparation path;
7. implement freshness coordinator over IS-4/IS-7;
8. adapt TypeScript/JavaScript/CSS/HTML header/documentation mutation mechanics into bounded providers;
9. adapt `jsonc-parser` mutation into the JSON/JSONC provider;
10. adapt Vue mutation to consume normalized IS-7 composite mappings;
11. implement execution coordinator using IS-4 conditional create/replace/delete and explicit multi-target policy;
12. implement post-mutation validation and preservation evidence;
13. implement cancellation, partial/indeterminate and recovery evidence;
14. wire optional IS-5 technical validators only where registered transformation requirements justify them;
15. migrate `CodeService.updateHeader()` callers through owning use cases into IS-8 plan/approval/execute flow;
16. split `generateDocFor()` into IS-7 inspection, AI/Docs proposal generation and IS-8 transformation;
17. remove mutation methods from `ICodeStrategy`/extension registry and remove `CodeService`/strategy singletons after consumers migrate;
18. retain compatibility adapters only as read-only/plan-backed transitional facades; no adapter may perform blind read-transform-write.

---

## 43. Traceability

| Governing area | IS-8 implementation |
|---|---|
| FR-XFORM-001–003 | one provider-neutral capability beneath owning use case/Engine acceptance |
| FR-XFORM-004–010 | consumes IS-7 recognition/facts; unsupported/ambiguous evidence blocks unsafe planning |
| FR-XFORM-011–014 | explicit upstream intent, semantic transformation kinds, no opportunistic edits |
| FR-XFORM-015–020 | immutable bounded plan, semantic edits, revision/precondition binding and replanning |
| FR-XFORM-021–025 | supplied IS-2 managed scope/ownership projections checked before mutation |
| FR-XFORM-026–029 | preview/dry run derived from executable plan/preparation, no persistence |
| FR-XFORM-030–032 | separate approval evidence bound to material plan fingerprint; no prompting |
| FR-XFORM-033–038 | intent-specific providers, structure-aware where required, composite coordination |
| FR-XFORM-039–043 | explicit preservation constraints/provider guarantees/postchecks |
| FR-XFORM-044–047 | create/replace/generated-region semantics remain explicit |
| FR-XFORM-048–053 | post-mutation validation with new snapshot/revision and structural postconditions |
| FR-XFORM-054–058 | transformation evidence returned to Engine/use case; no final success authority |
| FR-XFORM-059–062 | AI proposals normalized as untrusted content through normal planning |
| FR-XFORM-063–067 | explicit atomicity scope, per-target partial/indeterminate evidence |
| FR-XFORM-068–070 | immediate freshness checks plus IS-4 compare-before-replace preconditions |
| FR-XFORM-071–074 | stable normalized diagnostics/recovery evidence |
| FR-XFORM-075–079 | cancellation before/during mutation without implied rollback |
| DD-XFORM-001–010 | IS-7/IS-8 separation and intent-specific provider resolution |
| DD-XFORM-011–028 | plan/edit/precondition/preservation/preview/approval implementation |
| DD-XFORM-029–048 | freshness, execution, atomicity, partial state and cancellation implementation |
| DD-XFORM-049–060 | source validation, application-acceptance separation and recovery/rollback distinction |
| DD-XFORM-061–073 | concurrency, structure-aware mutation, composite source, formatting, ownership/configuration |
| DD-XFORM-074–088 | AI/process/repository/resource relationships and provider replaceability |
| DD-XFORM-089–090 | explicit legacy convergence and provider-vs-application test separation |
| IS-4 | bounded conditional resource mutation and single-file replacement guarantees |
| IS-5 | optional external transformation/validation process mechanics only |
| IS-6 | repository evidence/mechanics never become source mutation approval/rollback automatically |
| IS-7 | immutable source snapshots, facts, revisions and post-mutation structural validation evidence |
| IS-1/IS-2/IS-3 | application authority, managed scope/ownership and effective configuration remain upstream |

---

## 44. Version 1 Implementation Baseline

The concrete Version 1 path is:

```text
owning use case / IS-1
  intent + managed scope + ownership + effective config + policy
        |
        v
IS-4 snapshot + IS-7 current source facts/revision
        |
        v
IS-8 plan()
  transformation-kind/provider resolution
  semantic bounded edits
  preservation/preconditions/postconditions
  material plan fingerprint
        |
        +--> preview / dry run (no persistence)
        |
        v
owning use case / IS-1 approval decision
        |
        v
IS-8 execute(approved plan)
  approval fingerprint check
  immediate freshness + IS-7 preconditions
  provider preparation
  IS-4 revision-preconditioned mutation
  per-target effect recording
  fresh post-mutation snapshot
  IS-7 / specialist source validation
        |
        v
multidimensional transformation evidence
        |
        v
owning use case / IS-1 final application interpretation
```

The non-drift rule is:

> **Version 1 Source Transformation is a bounded plan/apply/source-validate capability for already-authorized source-change intent; it is not a generic editor, source-recognition authority, managed-scope resolver, configuration authority, AI agent, repository workflow, rollback engine or final AppManager acceptance authority.**
