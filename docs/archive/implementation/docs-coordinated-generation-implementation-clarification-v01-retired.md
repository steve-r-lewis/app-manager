# IS-17 Coordinated Documentation Generation Clarification — Retired

> **Status:** Retired
>
> This document has been superseded and is no longer authoritative. All information that remains relevant to the project has been dispositioned within the current documentation hierarchy.
>
> **Successor:** [IS-17 — Docs Domain Implementation Specification](../../implementation/is-17-docs-domain-implementation-specification-v01.md) §11.1 (`CoordinatedDocsPlan`/`DocsArtefactPlan`), §19 (`DocsArtefactDisposition`), §26 (`DocsAIProposalAcceptance`), §34 (artefact dependency blocking) and §38 (`DocsArtefactResult`).
>
> **Disposition:** The coordinated artefact-plan structure, the nine-variant artefact disposition, the AI-proposal acceptance modes and the previously-referenced-but-undefined `DocsArtefactResult` type have all been applied directly to IS-17, with cross-references from the new material back to the pre-existing sections it operationalizes (target/profile resolution, output/collision policy, stale-state preconditions, continuation policy). No information from this clarification remains solely recorded here. The catalogue impact stated in this clarification's §12 (13 Docs commands, 96-command Version 1 total) was already true in IS-17 and required no change.

---

*Original clarification content preserved below for provenance.*

# IS-17 Coordinated Documentation Generation Clarification

> **Status:** Active Implementation clarification
>
> **Clarifies:** `../is-17-docs-domain-implementation-specification-v01.md`
>
> **Scope:** PBC-1 implementation refinement for coordinated multi-target/multi-artefact Docs workflows
>
> **Lifecycle:** Temporary integration vehicle; a direct-edit work package shall fold this delta into IS-17 and retire this clarification.

## 1. Purpose

IS-17 already provides target resolution, a multi-target runner, output policy, optional AI enrichment, continuation and partial-effect interpretation. This clarification binds those pieces into one explicit coordinated artefact-plan implementation for Version 1.

No new canonical command is introduced.

## 2. Coordinated Artefact Plan

IS-17 shall represent consequential multi-target documentation as a bounded immutable plan rather than an unstructured loop over paths.

A representative contract is:

```ts
export interface CoordinatedDocsPlan {
  readonly invocationId: InvocationId;
  readonly operation: DocsOperationId;
  readonly targets: readonly DocumentationTargetIdentity[];
  readonly artefacts: readonly DocsArtefactPlan[];
  readonly continuation: DocsContinuationPolicy;
}

export interface DocsArtefactPlan {
  readonly target: DocumentationTargetIdentity;
  readonly output: DocumentationOutputTarget;
  readonly profile: DocsProfileId;
  readonly evidence: readonly EvidenceReference[];
  readonly proposal: DocumentationProposalReference;
  readonly disposition: DocsArtefactDisposition;
  readonly preconditions: readonly DocsArtefactPrecondition[];
  readonly acceptance: DocsArtefactAcceptancePolicy;
  readonly enrichment: DocsEnrichmentPolicy;
}
```

These names are implementation guidance for IS-17 integration, not new cross-application generic abstractions.

## 3. Artefact Disposition

The implementation shall preserve a discriminated disposition sufficient to represent at least:

```ts
type DocsArtefactDisposition =
  | { readonly kind: 'generate_new' }
  | { readonly kind: 'update_managed_document'; readonly revision: ResourceRevision }
  | { readonly kind: 'update_managed_region'; readonly revision: ResourceRevision; readonly region: DocumentationRegionIdentity }
  | { readonly kind: 'already_satisfied' }
  | { readonly kind: 'skip'; readonly reason: DocsDiagnostic }
  | { readonly kind: 'refuse_collision'; readonly reason: DocsDiagnostic }
  | { readonly kind: 'unsupported'; readonly reason: DocsDiagnostic }
  | { readonly kind: 'blocked'; readonly reason: DocsDiagnostic }
  | { readonly kind: 'indeterminate'; readonly reason: DocsDiagnostic };
```

The implementation may refine names/types during NCR/implementation, but shall not collapse create, update, no-effect and refusal semantics.

## 4. Planning Sequence

For coordinated documentation, `multi-target-runner` shall conceptually:

1. consume the normalized IS-1 invocation and IS-2 managed scope;
2. resolve semantic Docs targets and profile through existing IS-17 policy;
3. normalize duplicate logical targets;
4. acquire bounded fresh evidence;
5. construct documentation models/proposals through IS-12;
6. resolve exact output targets and collision/ownership state;
7. assign each artefact its create/update/no-effect/refusal disposition;
8. bind revision/stale-state preconditions for existing resources;
9. bind deterministic acceptance criteria and AI-enrichment/review policy;
10. obtain IS-1 authorization for the resolved consequential plan as required;
11. execute eligible artefact effects according to continuation/cancellation policy;
12. validate and accept each artefact independently;
13. return per-target/per-artefact evidence to IS-1 for final canonical acceptance.

The runner shall not infer arbitrary filesystem targets or broaden managed scope.

## 5. Deterministic Path

The deterministic path shall remain available independently of AI for profiles supported by IS-12 and approved templates/resources.

```text
selected evidence
 -> IS-12 model/aggregate
 -> deterministic render proposal
 -> IS-17 output/acceptance policy
 -> IS-4 create or IS-8 transform
 -> IS-12 validation
 -> IS-17 postcondition acceptance
```

Optional AI failure shall not invalidate a valid deterministic baseline unless effective policy declared AI enrichment required.

## 6. AI-Assisted Path

Where enrichment is permitted or required, IS-17 shall construct bounded purpose-specific AI requests through IS-10 using only approved context/provenance/disclosure policy.

The artefact acceptance policy shall distinguish at least:

```ts
type DocsAIProposalAcceptance =
  | { readonly mode: 'forbid' }
  | { readonly mode: 'review_required' }
  | { readonly mode: 'automatic_if_valid'; readonly criteria: DocsProposalValidationCriteria }
  | { readonly mode: 'required_and_reviewed' };
```

For `automatic_if_valid`, the validation criteria shall be resolved before provider execution. Provider output cannot alter those criteria. A proposal that fails them is rejected/diagnosed according to owning Docs policy; it is not silently repaired, regenerated or accepted by the provider itself.

No hidden provider fallback, retry, model substitution or changed target is authorised by proposal failure.

## 7. Execution of Mixed Artefact Effects

A single coordinated plan may execute both IS-4 creation and IS-8 transformation effects. The runner shall dispatch according to each artefact's pre-resolved disposition rather than applying one bulk filesystem operation.

For existing-resource updates, revision/stale-state preconditions are checked immediately before the consequential transformation at the appropriate safe boundary. Stale state produces a truthful artefact result and continuation decision; it does not authorize overwrite.

## 8. Per-Artefact Result

IS-17 shall preserve a result structure equivalent to:

```ts
export interface DocsArtefactResult {
  readonly target: DocumentationTargetIdentity;
  readonly output: DocumentationOutputTarget;
  readonly disposition: DocsArtefactDisposition;
  readonly proposalProvenance: DocumentationProvenance;
  readonly effect?: EffectReference;
  readonly resultingRevision?: ResourceRevision;
  readonly validation: DocsValidationEvidence;
  readonly acceptance: DocsArtefactAcceptanceState;
  readonly diagnostics: readonly DocsDiagnostic[];
}
```

The coordinated domain result contains the ordered/identified artefact results plus coverage/continuation evidence. IS-1 remains responsible for canonical final outcome taxonomy.

## 9. Continuation, Dependencies and Cancellation

`continuation-policy.ts` shall decide whether independent later artefacts may proceed after an artefact failure/refusal/indeterminate state. A dependency between artefacts may block a dependent artefact without blocking unrelated artefacts.

Cancellation shall be observed before starting each new consequential effect and at other safe boundaries. Already completed effects remain completed.

The implementation shall not synthesize rollback. If compensation is ever explicitly supported, compensation is a separate reported effect.

## 10. Interaction Adapters

IS-22 adapters shall project the same coordinated plan semantics. TUI/GUI may present aggregate review/progress and Headless may provide fully structured inputs, but adapters do not create their own bulk Docs workflow.

Headless operation shall deterministically specify or resolve target/profile/output/enrichment/acceptance choices and return one canonical application result containing per-target/per-artefact evidence.

## 11. Capability Boundaries

No change is required to IS-12 ownership. It remains incapable of persisting documentation by convenience. IS-4/IS-8 execute bounded authorised effects; IS-10 supplies AI proposals; IS-17 owns Docs planning/acceptance; IS-1 owns final application authority.

## 12. Catalogue Impact

IS-17 continues to register the existing **13** canonical Docs use cases. The Version 1 catalogue remains **96** commands.
