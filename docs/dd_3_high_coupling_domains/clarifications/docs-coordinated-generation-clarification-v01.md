# DD-3.4 Coordinated Documentation Generation Clarification

> **Status:** Active Detailed Design clarification
>
> **Clarifies:** `../dd-3-4-docs-domain-detailed-design-v01.md`
>
> **Scope:** PBC-1 refinement of coordinated multi-target/multi-artefact Docs orchestration
>
> **Lifecycle:** Temporary integration vehicle; NCR-2 shall fold this delta into DD-3.4 and retire this clarification.

## 1. Purpose

DD-3.4 already defines multi-target documentation, multi-artefact continuation, generation/update distinction, optional AI enrichment and truthful partial effects. This clarification closes the remaining ambiguity at their intersection: one Docs intent may deliberately produce or update multiple independently governed documentation artefacts.

The canonical Docs operation identities remain unchanged.

## 2. Coordinated Documentation Plan

For a multi-target Docs operation, the domain shall construct a coordinated plan from authoritative DD-1 managed context and effective policy. The plan shall preserve the semantic relationship between documentation targets and proposed output artefacts.

Conceptually:

```text
Docs intent
  -> resolved semantic target/profile scope
  -> selected authoritative evidence
  -> documentation models
  -> proposed artefact set
  -> per-artefact output disposition
  -> authorization/effects
  -> per-artefact validation/acceptance
  -> coordinated Docs result
  -> Application Engine acceptance
```

The plan is not a generic list of arbitrary paths. Target membership derives from Docs intent and DD-1 managed scope.

## 3. Artefact Plan Contract

A coordinated artefact plan shall preserve at least:

- stable semantic target identity;
- planned documentation artefact/output identity;
- selected profile and relevant evidence/provenance references;
- proposed content/model/render evidence as applicable;
- intended disposition: create, permitted update, already satisfied, skip/refuse or unresolved state;
- ownership/preservation evidence required for update;
- revision/stale-state preconditions where an existing resource may change;
- validation/acceptance criteria resolved before consequential execution;
- AI-enrichment mode and acceptance policy where applicable.

The plan shall be immutable for the consequential stage or shall be invalidated/re-resolved if facts that affect authority or safety become stale.

## 4. Generation and Update Within One Coordinated Invocation

A coordinated invocation may contain heterogeneous artefact effects. One artefact may require creation while another requires an authorised managed-region update and another is already satisfied.

Generation and update remain distinct semantic dispositions:

- creation of a new documentation resource delegates persistence mechanics to Resource Access;
- mutation of an existing documentation/source resource delegates transformation mechanics to Source Transformation;
- whole-document replacement remains permitted only where managed ownership and explicit policy justify it;
- collision with unrelated authored documentation remains refusal rather than implicit overwrite.

Target-set cardinality shall not weaken any single-artefact collision, ownership, preservation, authorization or stale-write rule.

## 5. Deterministic Production Path

The domain shall be capable of coordinating documentation without AI when the selected profile is satisfiable deterministically.

DD-2.9 Documentation Capability may model, aggregate and render from bounded selected evidence and approved declarative resources/templates. Its output remains proposed documentation evidence until accepted by Docs and, where consequential, authorised through the Application Engine path.

## 6. AI-Assisted Production Path

Where policy permits, Docs may request bounded AI enrichment/proposals through DD-2.7 for individual artefacts or bounded portions of the coordinated plan.

Before generation, Docs shall resolve the criteria by which an AI proposal may be accepted. A previously authorised workflow may automatically accept a proposal when those deterministic owning-domain criteria are satisfied. If policy requires review, the proposal remains pending until the required decision is supplied.

Automatic acceptance is a Docs-domain policy decision over subordinate AI evidence. It is not self-authorization by the AI provider.

AI shall not change the coordinated target set, invent mutation authority, select arbitrary output paths, weaken preservation/sensitivity policy, bypass stale-state checks or determine final success.

## 7. Per-Artefact Acceptance

Each consequential artefact shall produce independently attributable evidence for:

- generation/update/no-effect disposition;
- delegated capability/provider results;
- resulting resource revision/effect where applicable;
- documentation validation;
- target/profile satisfaction;
- warnings, omissions or conflicts;
- final Docs-domain artefact acceptance state.

A successful render or AI proposal is insufficient. A successful write is also insufficient if the resulting artefact fails Docs postconditions.

## 8. Continuation and Partial Effects

Coordinated documentation is not a universal transaction across artefacts.

The domain's existing continuation policy applies at target/artefact granularity. It shall determine whether later independent artefacts may continue after a failure, refusal or indeterminate result, subject to cancellation and any dependency relationships between planned artefacts.

Completed effects are never relabelled as rolled back unless an actual compensating operation occurred and is itself reported truthfully.

The coordinated result shall preserve per-target/per-artefact states so DD-1.5 can perform final application acceptance using DD-1.2 canonical outcome semantics.

## 9. Cancellation and Stale State

Cancellation shall be checked before each new consequential artefact effect and at other safe boundaries. Cancellation does not erase already completed generation, update, AI usage or tool effects.

Freshness/revision preconditions remain artefact-specific. Staleness of one planned existing resource shall not automatically authorize re-planning or mutation of that resource; continuation for independent artefacts follows explicit Docs policy.

## 10. Authority and Capability Boundary

This clarification requires no DD-2.9 ownership expansion. Documentation Capability remains a bounded specialist producing models, aggregates, rendered proposals, tooling evidence and documentation validation. Docs Domain retains coordinated target/output policy, AI-proposal acceptance, continuation and domain postconditions.

DD-1 remains authoritative for managed scope, effective configuration, invocation/authorization, canonical outcomes and final application acceptance.

## 11. Command and Catalogue Impact

No command identity is added or removed. Docs remains **13** commands and the Version 1 catalogue remains **96** commands.
