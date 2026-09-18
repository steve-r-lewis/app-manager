# IS-21 — Maintenance Domain Implementation Specification

> **Document type:** Level 4 Implementation Specification
>
> **Status:** Version 1 implementation baseline
>
> **Implementation ID:** IS-21
>
> **Primary Detailed Design:** [DD-4.4 — Maintenance Domain](../dd_4_policy_and_resource_domains/dd-4-4-maintenance-domain-detailed-design-v01.md)
>
> **Primary Functional authority:** [Maintenance Functional Specification](../functional/utils-functional-specification-v01.md)
>
> **Application Core:** [IS-1 — Application Runtime and Invocation](is-1-application-runtime-and-invocation-implementation-specification-v01.md), [IS-2 — Managed Project Resolution](is-2-managed-project-resolution-implementation-specification-v01.md), [IS-3 — Configuration Resolution](is-3-configuration-resolution-implementation-specification-v01.md)
>
> **Shared implementations:** [IS-4 — Resource Access](is-4-resource-access-implementation-specification-v01.md), [IS-6 — Repository Capability](is-6-repository-capability-implementation-specification-v01.md), [IS-7 — Source Intelligence](is-7-source-intelligence-implementation-specification-v01.md), [IS-8 — Source Transformation](is-8-source-transformation-implementation-specification-v01.md), [IS-10 — AI Capability](is-10-ai-capability-implementation-specification-v01.md), [IS-11 — Quality Capability](is-11-quality-capability-implementation-specification-v01.md)
>
> **Related domain implementations:** [IS-14 — App Domain](is-14-app-domain-implementation-specification-v01.md), [IS-15 — Git Domain](is-15-git-domain-implementation-specification-v01.md), [IS-17 — Docs Domain](is-17-docs-domain-implementation-specification-v01.md), [IS-18 — Quality Domain](is-18-quality-domain-implementation-specification-v01.md), [IS-19 — Settings Domain](is-19-settings-domain-implementation-specification-v01.md), [IS-20 — AI Domain](is-20-ai-domain-implementation-specification-v01.md), IS-22 Interaction Adapters, [IS-23 — Build and Runtime Assembly](is-23-build-and-runtime-assembly-implementation-specification-v01.md)
>
> **Runtime decision:** [ADR-0001 — Primary Application Runtime](../project_management/decisions/adr-0001-primary-application-runtime.md)
>
> **Register:** [AppManager Implementation Specification](implementation-specification-v01.md)
>
> **Governing plan:** [Implementation Specification Plan](../project_management/implementation-specification-plan-v01.md)
>
> **Filename compatibility:** The existing filename is retained for links; it does not establish a `utils` product domain. The canonical domain is `maintenance` (module path `app/domains/maintenance/`, operation identities `maintenance.*`).

## 1. Purpose

IS-21 defines the concrete Node.js/TypeScript implementation of the AppManager Maintenance domain.

Maintenance is intentionally the final semantic domain because it is the boundary most likely to become an architectural catch-all. Version 1 Maintenance owns only three genuine cross-cutting maintenance families with no stronger approved domain owner:

- AppManager source-header inspection, validation and bounded repair;
- source-file header-version maintenance for eligible changed source files;
- narrowly classified temporary/test/log artefact cleanup outside App-owned clean/reset semantics.

The governing rules are:

> **A `utils` namespace, legacy command or convenient implementation location never establishes ownership. Every Maintenance use case must prove that no stronger approved domain owns its primary intent.**

> **Inspection does not authorize repair, repository change evidence does not transfer Git authority, cleanup discovery does not authorize deletion, and a technically successful source write does not establish Maintenance-domain acceptance.**

> **IS-21 owns maintenance intent and postcondition interpretation; specialist capabilities remain bounded executors/evidence providers; IS-1 retains final application authority.**

> **Automatic documentation remains Docs-owned and contributor/general metadata management remains Settings-owned even when legacy commands are located under `utils`.**

---

## 2. Scope and Non-Ownership

IS-21 implements:

- semantic Maintenance operation identity and applicability;
- stronger-owner proof/classification;
- source-header convention interpretation for Maintenance maintenance;
- read-only header inspection and validation;
- field-level bounded header repair;
- narrow package-name validation/repair only as part of header/project maintenance;
- changed-file eligibility for source-file header-version maintenance;
- semantic Major/Minor/Patch increment policy and safe fallback;
- revision-history coherence and revision-note policy;
- optional IS-10 classification/proposal evidence;
- temporary/test/log artefact classification and exact cleanup;
- per-target and aggregate findings/effects;
- stale-state, preview, cancellation, partial completion and recovery;
- deterministic Headless behavior;
- compatibility delegation to stronger domains.

IS-21 does not own:

- invocation/outcome/managed scope/effective configuration/final acceptance — IS-1/2/3;
- generic filesystem/resource mechanics — IS-4;
- Git/repository status/diff/workflow policy — IS-6/15;
- generic source recognition/structural fact semantics — IS-7;
- generic source transformation mechanics — IS-8;
- AI provider/model mechanics — IS-10;
- project-wide test/lint/type/coverage/gates — IS-11/18;
- App clean/reset/build/dependency/cache lifecycle — IS-14;
- automatic documentation — IS-17;
- contributor/general package/application metadata CRUD — IS-19;
- AI instruction-resource management — IS-20;
- application/release version workflow;
- arbitrary recursive deletion;
- presentation/prompt semantics — IS-22;
- runtime composition — IS-23.

---

## 3. Concrete Module Boundary

```text
app/
└── domains/
    └── maintenance/
        ├── contracts/
        │   ├── maintenance-use-case.ts
        │   ├── maintenance-target.ts
        │   ├── maintenance-scope.ts
        │   ├── header-model.ts
        │   ├── header-finding.ts
        │   ├── header-repair-intent.ts
        │   ├── source-version-intent.ts
        │   ├── cleanup-artefact.ts
        │   ├── maintenance-effect.ts
        │   ├── maintenance-result.ts
        │   ├── maintenance-recovery.ts
        │   └── maintenance-diagnostic.ts
        ├── catalogue/
        │   └── maintenance-use-case-catalogue.ts
        ├── ownership/
        │   └── stronger-owner-policy.ts
        ├── headers/
        │   ├── header-target-resolver.ts
        │   ├── header-expected-values.ts
        │   ├── header-validator.ts
        │   ├── header-repair-planner.ts
        │   └── header-acceptance.ts
        ├── versioning/
        │   ├── changed-source-resolver.ts
        │   ├── increment-classifier.ts
        │   ├── revision-note-planner.ts
        │   ├── source-version-planner.ts
        │   └── source-version-acceptance.ts
        ├── cleanup/
        │   ├── cleanup-candidate-resolver.ts
        │   ├── cleanup-eligibility.ts
        │   └── cleanup-acceptance.ts
        ├── orchestration/
        │   ├── maintenance-effect-runner.ts
        │   ├── aggregate-result-builder.ts
        │   └── maintenance-recovery-builder.ts
        └── use-cases/
            ├── validate-headers.ts
            ├── repair-headers.ts
            ├── maintain-source-versions.ts
            └── cleanup-artefacts.ts
```

Compatibility aliases for legacy automatic documentation or contributor commands do not live as independent domain use cases here; IS-22 may map them directly to the owning canonical Docs/Settings use cases during migration.

---

## 4. Public Use-Case Contract

```ts
export interface UtilsDomainUseCase<TInput, TPayload> {
  readonly descriptor: UtilsUseCaseDescriptor;
  availability(context: ApplicationExecutionContext, input: TInput): Promise<UtilsAvailability>;
  validate(context: ApplicationExecutionContext, input: TInput): Promise<UtilsValidation>;
  execute(context: ApplicationExecutionContext, input: TInput): Promise<UtilsDomainResult<TPayload>>;
}
```

All use cases participate in IS-1 availability/validate/execute and return subordinate domain payload/evidence, not a competing outcome envelope.

---

## 5. Canonical Operation Identities

Version 1 canonical Maintenance IDs are:

```text
maintenance.headers.validate
maintenance.headers.repair
maintenance.source-version.maintain
maintenance.cleanup
```

Header “check” is a validation-depth/mode of `maintenance.headers.validate`, not a separate authority. Package-name repair is a bounded repair concern within `maintenance.headers.repair`, not general metadata management.

`utils.autoDoc` and `utils.addContributor` are not canonical Maintenance operations.

---

## 6. Stronger-Owner Gate

Every registered Maintenance use case has an immutable ownership declaration:

```ts
export interface UtilsOwnershipDeclaration {
  readonly operation: UtilsOperationId;
  readonly maintenanceIntent: UtilsMaintenanceIntent;
  readonly excludedOwners: readonly DomainId[];
  readonly rationale: string;
}
```

`stronger-owner-policy.ts` rejects attempts to reinterpret known App, Git, Docs, Quality, Settings, AI or Nuxt intent as Maintenance behavior.

The gate is design-time/catalogue policy plus runtime applicability protection; it is not a dynamic “guess the domain” router.

---

## 7. Target and Scope Model

```ts
export type UtilsMaintenanceScope =
  | { readonly kind: 'file'; readonly file: ManagedResourceIdentity }
  | { readonly kind: 'managed_component'; readonly component: ManagedEntityIdentity }
  | { readonly kind: 'managed_source_set'; readonly project: ManagedProjectIdentity };
```

IS-2 resolves scope. Maintenance may narrow that scope using operation eligibility/exclusion policy but cannot broaden it.

No Maintenance implementation treats `process.cwd()`, recursive filesystem discovery or repository membership as mutation authority.

---

## 8. Read versus Consequential Intent

`maintenance.headers.validate` is read-only.

`maintenance.headers.repair`, `maintenance.source-version.maintain` and `maintenance.cleanup` are consequential and require applicable effect authorization/preview semantics through IS-1/IS-8/IS-4.

A validation finding never silently transitions into repair.

---

## 9. Header Convention Model

IS-21 owns the semantic interpretation of the approved AppManager source-header convention for maintenance purposes, not parser syntax.

```ts
export interface AppManagerSourceHeader {
  readonly presence: 'present' | 'missing' | 'malformed' | 'unsupported' | 'indeterminate';
  readonly project?: HeaderField<string>;
  readonly file?: HeaderField<string>;
  readonly authors: readonly HeaderAuthor[];
  readonly version?: HeaderVersion;
  readonly creation?: HeaderCreationMetadata;
  readonly revisions: readonly HeaderRevision[];
  readonly provenance: readonly SourceFactReference[];
}
```

Parser/token/range evidence comes from IS-7 and remains provider-independent at the boundary.

---

## 10. Header Target Eligibility

Eligible targets are supported managed source files within the requested IS-2 scope and effective IS-3 inclusion/exclusion policy.

Generated output, dependency trees, caches, repository internals and other excluded resources never become required/mutation targets merely because IS-7 can parse them.

Unsupported source is reported, not rewritten using a guessed comment syntax.

---

## 11. Expected Header Values

`header-expected-values.ts` derives expected semantic values with provenance:

- project identity from IS-2 managed project;
- file identity from managed-project-relative canonical resource identity;
- author identity only from applicable resolved configuration/Settings evidence;
- source-file version from recognized header/revision evidence;
- package-name expectation only when deterministically derivable for the narrow validation use case.

A scanner/provider never invents expected values.

---

## 12. Header Findings

```ts
export type HeaderFindingKind =
  | 'header_missing'
  | 'header_malformed'
  | 'project_mismatch'
  | 'file_mismatch'
  | 'author_missing'
  | 'version_history_mismatch'
  | 'package_name_mismatch'
  | 'expected_value_ambiguous'
  | 'unsupported_source'
  | 'inspection_failed';
```

Findings distinguish invalid content from failure to inspect. Required-target validation cannot report valid while unresolved failure findings remain.

A valid scope with no eligible source files is `no_eligible_targets`, not “all files valid”.

---

## 13. Header Validation Flow

```text
IS-1 invocation
 -> IS-2 managed scope
 -> IS-3 effective maintenance policy
 -> resolve eligible source targets
 -> IS-7 fresh source/header facts
 -> derive expected values with provenance
 -> evaluate header convention
 -> retain per-target findings
 -> aggregate Maintenance validation state
 -> IS-1 final acceptance
```

No source mutation occurs in this path.

---

## 14. Creation Metadata Preservation

Original recognized creation date/time is preservation-sensitive.

Ordinary repair never rewrites existing valid creation metadata to the current clock. Establishing missing creation metadata requires an explicit approved policy and derived value semantics; otherwise the absence remains a finding.

Ambient `Date.now()` is not a repair truth source.

---

## 15. Revision-History Preservation

Existing valid revision history is retained. Repair does not regenerate or collapse historical entries merely to make the top-level version appear coherent.

When revision history is authoritative under the convention, the declared version may be repaired to the highest applicable recognized revision version without inventing a new historical event.

---

## 16. Header Repair Input

```ts
export interface RepairHeadersInput {
  readonly scope: UtilsMaintenanceScope;
  readonly fields: readonly HeaderRepairField[] | 'deterministic_findings';
  readonly packageRepair?: PackageRepairIntent;
  readonly preview: boolean;
}
```

Repair is based on fresh validation facts and explicit intent. A generic `force` flag is not supported.

---

## 17. Field-Level Repair Planning

For each target, IS-21 constructs semantic changes only for selected deterministic findings.

Examples:

- synchronize recognized project field to IS-2 project identity;
- synchronize recognized file field to canonical managed-relative identity;
- add an applicable resolved author without deleting valid author history;
- synchronize declared version to authoritative recognized revision history;
- narrowly repair package name when unambiguous and explicitly authorized.

Missing fields are not automatically synthesized unless the specific repair policy permits creation.

---

## 18. Source Transformation Seam

All existing-source repair/version mutations route through IS-8.

IS-21 supplies:

- exact source reference/revision;
- semantic maintenance changes;
- preservation constraints;
- approved effect authorization reference;
- required source/header postconditions.

IS-21 does not manipulate text ranges/AST/CST/regex replacements directly.

---

## 19. Header Repair Acceptance

A target is accepted as repaired only when:

- IS-8 reports a determinate accepted transformation;
- applicable source validation succeeds;
- fresh header evidence satisfies selected repair postconditions;
- unrelated required header/history evidence remains preserved;
- target revision corresponds to the accepted effect.

Technical write completion alone is insufficient.

---

## 20. Narrow Package Metadata Boundary

Package-name validation/repair exists only when it is part of the approved header/project-maintenance operation.

General package/application metadata CRUD remains IS-19-owned.

Deterministic repair uses an unambiguous expected value. Interactive manual replacement is an IS-22-supplied structured value validated by IS-21. Optional AI suggestion is proposal evidence only.

---

## 21. Optional AI Package Suggestion

When retained, IS-21 may ask IS-10 for a bounded package name/description proposal. It supplies minimum approved context and an explicit output contract.

AI unavailability never blocks deterministic/manual repair.

An AI proposal cannot establish package identity when authoritative evidence is ambiguous unless an explicit policy permits a proposed value and IS-21 can validate it independently.

---

## 22. Source-File Versioning Boundary

`maintenance.source-version.maintain` changes source-file header version/revision metadata only.

It does not change application/package/release version, create releases/tags, stage/commit/push, or own release policy.

---

## 23. Changed-Source Resolution

IS-21 consumes normalized repository facts from IS-6 (and, when orchestration is required, Git-domain-owned context from IS-15) to establish an explicit changed eligible managed source set.

Repository evidence may include target repository identity, changed path identity and bounded diff/change evidence.

Maintenance never invokes provider-native Git status/diff directly and never turns “changed” into staging/commit authority.

---

## 24. Version Eligibility

A changed file is version-maintenance eligible only when:

- it is inside approved IS-2 scope;
- it is a supported source class;
- it is not excluded by effective policy;
- it has a recognized version-bearing AppManager header convention;
- current version/revision evidence is valid enough to update safely;
- current source revision matches planning evidence.

A missing/non-versioned header is not silently converted by auto-versioning.

---

## 25. Increment Classification

```ts
export type SourceVersionIncrement = 'major' | 'minor' | 'patch';

export interface IncrementDecision {
  readonly increment: SourceVersionIncrement;
  readonly basis: 'explicit' | 'deterministic_policy' | 'ai_proposal_accepted' | 'safe_patch_fallback';
  readonly evidence: readonly UtilsEvidenceReference[];
}
```

Explicit caller/policy decisions outrank AI proposals. AI classification is optional.

---

## 26. AI-Assisted Classification

IS-10 may classify a bounded actual source change as Major/Minor/Patch and propose a concise revision note.

IS-21 validates that output against the requested enum/text contract and source-version policy. Provider/model completion does not make the classification authoritative.

No source file is sent wholesale when bounded diff/context is sufficient; sensitive content is minimized under IS-10 disclosure policy.

---

## 27. Safe Patch Fallback

If no usable AI classification exists and effective policy does not require an explicit decision, Version 1 may choose Patch with basis `safe_patch_fallback`.

The fallback is explicit in result/provenance. It is not disguised as an AI or semantic-diff conclusion.

If policy requires explicit classification, lack of classification leaves that target unchanged/refused rather than guessing.

---

## 28. Revision Note

A revision note describes the actual bounded source-file change. Its provenance records explicit/manual, deterministic or accepted AI proposal origin.

IS-21 rejects unrelated/generated narrative and does not use a project-wide summary as a per-file revision note without evidence that it accurately describes that file.

---

## 29. Coherent Version Transformation

Where the convention requires both declared version and revision history, one semantic plan updates them coherently:

```text
current valid version + increment
 -> next semantic version
 -> bounded revision-history entry/note
 -> declared version update
 -> IS-8 transformation
 -> source/header validation
 -> Maintenance acceptance
```

Malformed current version/revision history blocks blind increment.

---

## 30. Per-File Isolation and Continuation

Multi-file version maintenance retains independent target state. Default Version 1 continuation is `continue_collecting` for independent files after a target-local classification/transformation failure, unless explicit policy selects fail-fast.

No failure erases completed effects on other files.

---

## 31. Utility Cleanup Boundary

`maintenance.cleanup` owns only recognized temporary/test/log artefact classes produced by AppManager-managed maintenance/testing workflows and explicitly assigned to Maintenance.

It is not an alternate App clean/reset implementation and never deletes build output, dependencies, caches or lifecycle resources merely because they look temporary.

---

## 32. Cleanup Class Catalogue

Cleanup classes are immutable policy definitions, for example:

```ts
export interface UtilsCleanupClass {
  readonly id: UtilsCleanupClassId;
  readonly ownership: 'utils';
  readonly targetRule: CleanupTargetRule;
  readonly evidenceRule: CleanupEvidenceRule;
  readonly exclusions: readonly ResourceClassId[];
  readonly deletionPolicy: CleanupDeletionPolicy;
}
```

A filename glob alone is insufficient ownership evidence. Classes require bounded provenance/location/type evidence appropriate to the artefact.

---

## 33. Cleanup Discovery

Candidate resolution uses IS-2 scope and IS-4 bounded inspection. Discovery returns candidates with evidence; it does not authorize deletion.

Unknown files, ambiguous ownership, symlink/containment uncertainty or resources matching a stronger-owner exclusion remain non-deletable and are reported.

No unrestricted recursive “delete logs/temp/test files” traversal is permitted.

---

## 34. Cleanup Authorization and Execution

Consequential cleanup resolves the complete candidate set before authorization where practical, so preview/authorization covers the material effects.

Each deletion uses exact IS-4 resource identity and stale/current-state preconditions where supported.

A candidate disappearing before deletion may become already-absent/no-op. A candidate materially changing/losing eligibility is not blindly deleted.

---

## 35. Cleanup Acceptance

Cleanup acceptance requires each selected target to be attributable as deleted, already absent, refused, failed, cancelled or indeterminate.

An empty eligible cleanup set is a first-class no-op.

Aggregate success never implies that refused/failed required candidates were deleted.

---

## 36. App Clean/Reset Separation

IS-14 remains authoritative for application lifecycle clean/reset and semantic resource classes such as build/dependency/cache/dev artefacts.

If a requested cleanup class is App-owned, Maintenance returns/delegates to the App canonical use case rather than duplicating its deletion rules.

---

## 37. Docs Compatibility Delegation

Legacy `utils/autoDoc.ts` may remain temporarily as an IS-22 compatibility alias, but it maps directly to the appropriate IS-17 canonical Docs operation.

No Maintenance result semantics, Maintenance acceptance or Maintenance-specific source path is inserted around Docs behavior.

The alias should be deprecated and removable once callers migrate.

---

## 38. Contributor Compatibility Delegation

Legacy `utils/addContributor.ts` may remain temporarily as an IS-22 compatibility alias to IS-19 contributor/settings semantics.

Maintenance never owns contributor identity, metadata persistence or package/application metadata CRUD.

---

## 39. Quality Boundary

Header validation produces Maintenance maintenance findings. It does not become IS-18 project-wide quality orchestration or an IS-11 quality gate merely because invalid headers can affect quality.

A Quality use case may consume/expose Maintenance validation evidence through an explicit contract without transferring ownership in either direction.

---

## 40. Stale-State Protection

Consequential plans bind to material evidence including:

- managed project/scope revision where applicable;
- source/resource revision;
- recognized header/version state;
- changed-file/diff evidence where versioning depends on it;
- cleanup eligibility evidence;
- effective policy/configuration references;
- authorized proposed effects.

Material change invalidates the plan/authorization as appropriate. No silent replan-and-apply occurs.

---

## 41. Preview

Preview uses the same target-resolution/policy/planning path as execution but terminates before consequential effects.

It reports exact proposed semantic source changes/deletions where determinable and indeterminate/unsupported targets explicitly.

Preview does not imply later execution authorization remains valid after state changes.

---

## 42. Cancellation

Cancellation propagates from IS-1 to IS-7/8/10/4/6 where supported.

After cancellation, IS-21 schedules no new effects, preserves completed effects and reports in-flight indeterminate evidence honestly.

No rollback is implied.

---

## 43. Concurrency

Conflict keys are resource-relative:

```text
utils-source:<project-id>:<resource-id>
utils-cleanup:<project-id>:<resource-id>
```

Independent targets may execute concurrently when ordering is semantically irrelevant. Same-resource mutation is coordinated through IS-1/IS-8/IS-4 conflict/revision semantics.

No global Maintenance mutex is introduced.

---

## 44. Retry

IS-21 performs no blind retry after stale state, transformation failure, deletion uncertainty, cancellation or AI failure.

A deliberate retry reacquires managed scope, effective policy, source/repository/resource evidence and authorization where material effects may differ.

Optional AI failure may use the explicit Patch fallback without repeating provider disclosure.

---

## 45. Per-Target Effect Model

```ts
export interface UtilsTargetResult {
  readonly target: UtilsTargetIdentity;
  readonly state:
    | 'valid'
    | 'invalid'
    | 'updated'
    | 'deleted'
    | 'unchanged'
    | 'skipped'
    | 'unsupported'
    | 'refused'
    | 'failed'
    | 'cancelled'
    | 'indeterminate';
  readonly findings: readonly HeaderFinding[];
  readonly effects: readonly UtilsEffectEvidence[];
  readonly diagnostics: readonly UtilsDiagnostic[];
}
```

Per-target identity/evidence is never collapsed into only aggregate counts.

---

## 46. Aggregate Result

Aggregate state is derived from operation-specific policy over per-target states. It distinguishes:

- all required targets satisfied;
- no eligible targets/no-op;
- validation findings;
- partial completion;
- execution failure;
- cancellation;
- indeterminate effects.

The domain payload contains no competing generic `success` Boolean; IS-1 publishes the canonical application outcome.

---

## 47. Recovery

Recovery records completed effects and required revalidation, for example:

```ts
export interface UtilsRecoveryPosition {
  readonly completedTargets: readonly UtilsTargetIdentity[];
  readonly unresolvedTargets: readonly UtilsTargetIdentity[];
  readonly indeterminateTargets: readonly UtilsTargetIdentity[];
  readonly revalidation: readonly UtilsRevalidationRequirement[];
  readonly dispositions: readonly ('retry' | 'revalidate' | 'manual_reconcile' | 'delegate_to_owner')[];
}
```

Recovery is informational; Version 1 provides no generic rollback transaction.

---

## 48. Diagnostics

Initial stable codes include:

```text
MAINT_OPERATION_UNAVAILABLE
MAINT_STRONGER_OWNER_REQUIRED
MAINT_SCOPE_REQUIRED
MAINT_SCOPE_NOT_MANAGED
MAINT_NO_ELIGIBLE_TARGETS
MAINT_SOURCE_UNSUPPORTED
MAINT_HEADER_MISSING
MAINT_HEADER_MALFORMED
MAINT_HEADER_PROJECT_MISMATCH
MAINT_HEADER_FILE_MISMATCH
MAINT_HEADER_AUTHOR_MISSING
MAINT_HEADER_VERSION_HISTORY_MISMATCH
MAINT_EXPECTED_VALUE_AMBIGUOUS
MAINT_HEADER_REPAIR_NOT_AUTHORIZED
MAINT_HEADER_REPAIR_UNSUPPORTED
MAINT_PACKAGE_NAME_MISMATCH
MAINT_PACKAGE_REPAIR_AMBIGUOUS
MAINT_SOURCE_VERSION_NOT_ELIGIBLE
MAINT_SOURCE_VERSION_INVALID
MAINT_INCREMENT_REQUIRED
MAINT_AI_CLASSIFICATION_UNAVAILABLE
MAINT_PATCH_FALLBACK_APPLIED
MAINT_REVISION_NOTE_INVALID
MAINT_CLEANUP_CLASS_UNSUPPORTED
MAINT_CLEANUP_TARGET_AMBIGUOUS
MAINT_CLEANUP_TARGET_NOT_ELIGIBLE
MAINT_CLEANUP_NOT_AUTHORIZED
MAINT_STALE_STATE
MAINT_PARTIAL_EFFECT
MAINT_EFFECT_INDETERMINATE
MAINT_CANCELLED
MAINT_RECOVERY_REVALIDATION_REQUIRED
```

Provider/parser/Git/filesystem-native errors remain protected subordinate evidence and are normalized before normal domain diagnostics.

---

## 49. Headless and Interaction Semantics

Headless calls never prompt. Missing target/scope/repair policy/manual value/authorization/classification decision produces structured refusal/finding unless deterministic policy supplies the value.

IS-22 may offer target selection, repair preview/confirmation, manual package values, increment choices or cleanup confirmation, but maps choices to the same canonical use cases.

No IS-21 module imports prompt libraries, terminal colours, spinners or IDE APIs.

---

## 50. Security and Sensitivity

Maintenance minimizes source content in diagnostics/events/AI context. Secrets and unrelated source are not included merely because a source file is inspected.

AI context uses bounded change/header evidence and IS-10 disclosure policy.

Cleanup never follows arbitrary generated paths or untrusted text. IS-4 containment/symlink policy remains authoritative.

---

## 51. Events and Observability

Semantic events may include:

```text
maintenance.targets.resolved
maintenance.header.inspected
maintenance.header.finding
maintenance.repair.plan.ready
maintenance.repair.applied
maintenance.version.classified
maintenance.version.fallback.applied
maintenance.version.applied
maintenance.cleanup.candidates.resolved
maintenance.cleanup.deleted
maintenance.operation.partial
maintenance.operation.unchanged
maintenance.recovery.available
```

Events contain safe semantic identity/state/evidence references rather than full source, secrets, raw provider prompts/responses or provider-native Git details.

---

## 52. Composition

IS-23 constructs:

1. immutable Maintenance use-case descriptors/ownership declarations;
2. stronger-owner policy;
3. header target resolver/expected-value/validator/repair planner/acceptance;
4. changed-source resolver/increment classifier/revision-note/version planner/acceptance;
5. cleanup class definitions/resolver/eligibility/acceptance;
6. injected IS-4/IS-6/IS-7/IS-8/IS-10 collaborators;
7. effect/aggregate/recovery components;
8. four canonical Maintenance use cases;
9. immutable Maintenance catalogue;
10. IS-1 registrations.

No singleton, service locator, import-time project scan, direct `process.cwd()`, direct `process.env`, direct Git CLI/simple-git, direct provider SDK, direct filesystem mutation or adapter prompt is used.

---

## 53. Testing Requirements

Core tests cover at least:

1. canonical four operation IDs;
2. no canonical Maintenance auto-doc operation;
3. no canonical Maintenance contributor operation;
4. stronger-owner gate rejects App intent;
5. stronger-owner gate rejects Docs intent;
6. stronger-owner gate rejects Settings intent;
7. stronger-owner gate rejects Quality intent;
8. namespace alone does not establish ownership;
9. IS-1 invocation seam;
10. IS-2 managed scope required;
11. no cwd authority;
12. IS-3 policy consumed;
13. validation is read-only;
14. repair requires explicit intent;
15. preview performs no effects;
16. supported file eligibility;
17. generated output excluded;
18. dependencies excluded;
19. caches excluded;
20. repository internals excluded;
21. missing/malformed/inconsistent/valid states distinct;
22. unsupported source distinct;
23. inspection failure distinct from invalid header;
24. no eligible files distinct from valid files;
25. project expected value provenance;
26. file expected value provenance;
27. unresolved author not fabricated;
28. ambiguous package name not invented;
29. creation metadata preserved;
30. repair does not replace creation time with now;
31. revision history preserved;
32. version field can synchronize to authoritative history;
33. no revision event invented during ordinary repair;
34. field-level repair only;
35. project field deterministic repair;
36. file field deterministic repair;
37. author addition preserves existing authors;
38. missing field synthesis obeys explicit policy;
39. unchanged file not rewritten;
40. repair routes through IS-8;
41. direct range/regex mutation absent from domain;
42. stale source blocks repair;
43. source validation after repair;
44. technical write alone not acceptance;
45. package repair validate-only never mutates;
46. deterministic package repair;
47. manual package value validation;
48. AI package suggestion optional;
49. AI unavailable does not block deterministic/manual path;
50. AI proposal non-authoritative;
51. general metadata CRUD remains Settings-owned;
52. source-file version distinct from application version;
53. changed set uses repository evidence;
54. repository evidence does not grant Git effects;
55. no direct Git provider in domain;
56. only managed changed files eligible;
57. non-versioned header not auto-converted;
58. malformed current version blocks increment;
59. Major classification supported;
60. Minor classification supported;
61. Patch classification supported;
62. explicit increment outranks AI;
63. AI classification optional;
64. AI output enum validated;
65. AI proposal not authoritative;
66. bounded diff/context sent to AI;
67. sensitive AI context minimized;
68. safe Patch fallback when policy permits;
69. fallback provenance explicit;
70. no fallback when explicit classification required;
71. revision note bound to actual file change;
72. unrelated AI revision note rejected;
73. declared version/revision history updated coherently;
74. version mutation routes through IS-8;
75. post-write header/source validation;
76. per-file failure isolated;
77. continue-collecting default for independent files;
78. fail-fast explicit only;
79. completed file effects retained;
80. cleanup classes immutable;
81. cleanup class must be Maintenance-owned;
82. glob alone insufficient cleanup authority;
83. cleanup bounded to IS-2 scope;
84. discovery does not authorize deletion;
85. unknown cleanup file refused;
86. ambiguous ownership refused;
87. symlink/containment uncertainty refused/delegated IS-4;
88. App clean resource delegated/rejected from Maintenance;
89. complete cleanup candidate set previewed;
90. cleanup authorization required;
91. exact IS-4 deletion;
92. disappeared target no-op handling;
93. changed target stale/refused;
94. empty cleanup set no-op;
95. per-target cleanup attribution;
96. autoDoc compatibility maps to Docs semantics;
97. addContributor compatibility maps to Settings semantics;
98. compatibility alias adds no Maintenance acceptance;
99. header findings do not become Quality gate authority;
100. stale planning evidence invalidates consequential plan;
101. no silent replan-and-apply;
102. cancellation stops future effects;
103. cancellation preserves completed effects;
104. no false rollback;
105. independent targets may run concurrently;
106. same-resource mutation conflict coordinated;
107. no global Maintenance mutex;
108. no blind retry;
109. deliberate retry reacquires evidence;
110. optional AI failure does not trigger hidden retry;
111. per-target results retained;
112. aggregate result derived from per-target state;
113. no competing success Boolean;
114. recovery informational only;
115. Headless never prompts;
116. Headless ambiguity fails safely;
117. IS-22 interaction semantic equivalence;
118. diagnostics redact sensitive source/provider data;
119. events do not expose raw source/provider payloads;
120. no direct process.env;
121. no direct filesystem mutation;
122. no service singleton;
123. IS-23 explicit composition;
124. source/repository/AI provider substitution preserves Maintenance policy;
125. final application acceptance remains IS-1-owned.

Integration tests use controlled IS-4/IS-6/IS-7/IS-8/IS-10 substitutes and fixtures for valid/missing/malformed/inconsistent headers, excluded source, ambiguous expected values, package mismatch, changed-file sets, malformed versions, all increment classes, AI unavailable/invalid classification, Patch fallback, stale source, partial transformations, cleanup candidates, stronger-owner collisions, cancellation and Headless ambiguity.

---

## 54. Current Implementation Disposition

The live `app/commands/utils/` directory currently contains `addContributor.ts`, `autoDoc.ts`, `autoVersion.ts`, `cleanLogs.ts` and `validateHeaders.ts`. The inspected `autoVersion.ts` and `validateHeaders.ts` files are TODO-only command stubs, so their names are migration evidence rather than approved architecture.

| Current artefact/responsibility | Disposition | Version 1 treatment |
|---|---|---|
| `app/commands/utils/validateHeaders.ts` intent | **RETAIN / ADAPT** | Preserve header-validation product intent; relocate semantics to `maintenance.headers.validate`, presentation to IS-22. |
| `validateHeaders.ts` TODO implementation | **REPLACE** | Implement IS-21 read-only target/evidence/validation orchestration. |
| `app/commands/utils/autoVersion.ts` intent | **RETAIN / ADAPT** | Preserve source-file header-version maintenance; relocate to `maintenance.source-version.maintain`. |
| `autoVersion.ts` TODO implementation | **REPLACE** | Implement changed-file eligibility, increment/revision policy and IS-8 transformation. |
| `app/commands/utils/cleanLogs.ts` broad name | **SPLIT / ADAPT** | Retain only approved Maintenance temporary/test/log artefact cleanup classes; reject App clean/reset overlap and arbitrary log deletion. |
| `app/commands/utils/autoDoc.ts` | **RELOCATE / DEPRECATE** | Automatic documentation is IS-17-owned; optional temporary IS-22 compatibility alias only. |
| `app/commands/utils/addContributor.ts` | **RELOCATE / DEPRECATE** | Contributor/general metadata management is IS-19-owned; optional temporary IS-22 compatibility alias only. |
| command-path ownership assumptions | **REPLACE** | Canonical semantic catalogue/stronger-owner rule establishes authority. |
| current source scanners/header parsers | **RETAIN / ADAPT below domain where conforming** | Useful recognition mechanics belong behind IS-7/provider seams; no scanner authority. |
| current source strategies/editors | **RETAIN / ADAPT below domain where conforming** | Existing-source mutation belongs IS-8; no direct Maintenance text-edit strategy contract. |
| current repository/diff mechanics | **RELOCATE / ADAPT through IS-6/15** | Maintenance consumes normalized changed-file evidence only. |
| current AI/LLM mechanics | **RELOCATE / ADAPT through IS-10** | Optional classification/proposal only; no provider code in Maintenance. |
| direct filesystem deletion/write | **REPLACE** | IS-4 exact resource mechanics and IS-8 existing-source transformation. |
| prompts/logging/terminal formatting | **RELOCATE** | IS-22/IS-1 observability/presentation. |
| singleton/service-locator composition | **REPLACE** | IS-23 explicit dependency construction. |

No implementation stub is promoted into a normative design decision merely because it already exists.

---

## 55. Migration Sequence

1. add Maintenance contracts and four canonical semantic IDs;
2. add immutable ownership declarations and stronger-owner policy;
3. add managed scope/target model consuming IS-2;
4. map header recognition evidence from IS-7 into IS-21 header model;
5. implement expected-value derivation with provenance;
6. implement read-only header validator and aggregate semantics;
7. implement field-level repair planner;
8. route existing-source repairs through IS-8;
9. implement post-repair header/source acceptance;
10. implement narrow package-name validation/repair boundary;
11. add optional IS-10 package proposal path if retained;
12. implement changed-source resolver over IS-6 normalized facts;
13. implement source-version eligibility/current-version validation;
14. implement explicit/deterministic/AI/Patch increment decision model;
15. implement bounded revision-note planning;
16. implement coherent version/history IS-8 transformation;
17. implement per-file continuation/partial-effect semantics;
18. define immutable Maintenance cleanup classes/exclusions;
19. implement bounded cleanup candidate resolution/preview;
20. implement exact authorized IS-4 deletion and cleanup acceptance;
21. relocate/deprecate `autoDoc.ts` to IS-17 compatibility mapping;
22. relocate/deprecate `addContributor.ts` to IS-19 compatibility mapping;
23. adapt `cleanLogs.ts` to bounded `maintenance.cleanup` semantics rather than broad filename deletion;
24. replace TODO `validateHeaders.ts`/`autoVersion.ts` adapter bodies with IS-22-to-IS-1 invocation mapping;
25. remove direct provider/scanner/strategy/filesystem authority from Maintenance paths;
26. add cancellation/stale/concurrency/recovery behavior;
27. add IS-23 composition and IS-1 registrations;
28. run stronger-owner, header preservation, source-version, cleanup-boundary, partial-effect and Headless conformance suites.

---

## 56. Traceability

| Implementation concern | Governing authority |
|---|---|
| bounded ownership/stronger-owner rule | DD-UTIL-001–005; FR-UTIL-001–009 |
| invocation/read-mutation/partial/cancellation | DD-UTIL-006–009; FR-UTIL-010–023 |
| shared capability subordination | DD-UTIL-010–014; DD-2.1/2.3/2.4/2.5/2.7 |
| operation/findings/provenance model | DD-UTIL-015–019 |
| header inspection/validation | DD-UTIL-020–026 and DD-4.4 header sections; FR-UTIL-024–044 |
| header repair | DD-4.4 repair sections; FR-UTIL-045–058; IS-8 |
| narrow package repair | DD-4.4 package-maintenance sections; FR-UTIL-059–065; IS-10/19 |
| source-file version maintenance | DD-4.4 version-maintenance sections; FR-UTIL-066–081; IS-6/8/10 |
| utility cleanup | DD-4.4 cleanup sections; FR-UTIL-082–094; IS-4/14 |
| cross-domain boundaries | DD-4.4 coordination sections; FR-UTIL-095–100 |
| results/safety/stale state | DD-4.4 result/safety sections; FR-UTIL-101–108 |
| managed scope | DD-1.3; IS-2 |
| effective policy | DD-1.4; IS-3 |
| final application acceptance | DD-1.5/DD-1.2; IS-1 |

---

## 57. Version 1 Non-Drift Baseline

```text
IS-22 adapter / owning workflow
            |
            v
     IS-1 invocation/authority
            |
            +--> IS-2 managed project/scope
            +--> IS-3 effective maintenance policy
            |
            v
        IS-21 Maintenance Domain
            |
            +--> stronger-owner gate
            +--> header maintenance policy
            +--> source-version policy
            +--> bounded cleanup policy
            +--> Maintenance acceptance/recovery
            |
            +--> IS-7 recognition evidence
            +--> IS-6 repository/change evidence
            +--> IS-10 optional AI proposals
            +--> IS-8 source transformations
            +--> IS-4 exact resource effects
            |
            +--> stronger domain delegation where applicable
            |
            v
      IS-21 domain acceptance
            |
            v
       IS-1 final acceptance
            |
            v
    canonical AppManager outcome
```

The non-drift rule is:

> **Version 1 Maintenance owns only genuine otherwise-unowned cross-cutting maintenance intent: AppManager source-header inspection/validation/repair, source-file header-version maintenance, and narrowly classified temporary/test/log artefact cleanup. It never becomes a residual namespace for known App/Docs/Settings/Git/Quality/AI/Nuxt behavior, derives authority from command location, cwd, recursive discovery, repository membership or scanner recognition, turns validation into implicit repair, rewrites valid creation/revision history for convenience, invents expected metadata, auto-versions non-versioned source, confuses source-file versions with application releases, converts repository change evidence into Git authority, treats AI classification as authoritative, hides the Patch fallback, deletes by broad glob/name alone, duplicates App clean/reset, bypasses IS-8 for source mutation or IS-4 for deletion, erases partial effects, invents rollback, or publishes a competing final AppManager outcome.**