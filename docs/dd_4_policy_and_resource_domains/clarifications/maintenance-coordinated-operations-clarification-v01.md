# DD-4.4 Coordinated Maintenance Operations Clarification

> **Document type:** Detailed Design clarification
>
> **Status:** Active — temporary PBC-1 integration vehicle
>
> **Primary Detailed Design:** [DD-4.4 — Utils Domain](../dd-4-4-utils-domain-detailed-design-v01.md)
>
> **Related clarification:** [Maintenance Domain Reclassification Clarification](maintenance-domain-reclassification-clarification-v01.md)
>
> **Functional binding:** [Maintenance Coordinated Operations Functional Clarification](../../functional/clarifications/maintenance-coordinated-operations-functional-clarification-v01.md)

## 1. Purpose

This clarification extends the Maintenance reclassification with explicit coordinated multi-resource planning/execution semantics for header validation, header repair, source-version maintenance and cleanup. It does not expand the domain beyond the stronger-owner boundary.

NCR-2 shall integrate this delta into the renamed canonical DD-4.4 owner and retire this clarification.

## 2. Coordinated Maintenance Scope

DD-4.4 shall resolve Maintenance cardinality as semantic scope rather than as new operation identity.

A supported operation may resolve one resource, an explicit selected resource set, a supported semantic managed unit or the complete eligible managed scope. Resolution shall compose:

```text
DD-1 managed scope
  ∩ Maintenance resource-class eligibility
  ∩ operation-specific applicability
  = coordinated Maintenance target set
```

Filesystem traversal or source discovery may provide evidence used during resolution but shall not enlarge the set beyond DD-1 authority or Maintenance eligibility.

## 3. Maintenance Classification

For coordinated mutation, DD-4.4 shall classify requested resources before consequential effects sufficiently to distinguish at least:

- eligible consequential targets;
- already-satisfied/no-effect resources;
- ineligible or stronger-owned resources;
- unsupported resources;
- ambiguous resources;
- protected resources;
- resources outside managed scope;
- stale/unresolved resources where relevant.

Classification evidence remains evidence until DD-4.4 interprets it under Maintenance policy. Capability/provider recognition shall not grant mutation authority.

## 4. Coordinated Plan

For mutating operations DD-4.4 shall construct a bounded plan before effects. Each planned consequential resource shall preserve at least:

- stable managed resource identity;
- semantic Maintenance resource class;
- recognised current/defect/disposable state supporting the action;
- proposed operation-specific effect;
- applicable revision/stale-state preconditions;
- preservation/protection requirements;
- operation-specific validation and acceptance criteria;
- dependency/continuation information where applicable.

The plan shall be immutable for the consequential stage or the affected item shall be invalidated/re-resolved when authority/safety-relevant facts become stale.

## 5. Header Validation Design

Header validation is read-only and naturally set-oriented. DD-4.4 may coordinate inspection of all eligible source headers in the resolved scope and shall preserve per-resource findings plus aggregate conformance interpretation.

Validation shall not chain implicitly into repair. Repair requires its own explicit Maintenance intent/authorization.

## 6. Header Repair Design

For each repair candidate DD-4.4 shall establish a supported recognised defect and a bounded repair plan. It shall delegate existing-source mutation to DD-2.5 Source Transformation.

Each transformation retains independent revision, stale-state, preservation and post-validation semantics. Failure/staleness of one resource does not authorize broader rewriting of it or other resources.

## 7. Source-Version Maintenance Design

Source-version maintenance may coordinate policy across multiple eligible source resources, but each resource shall retain recognised current state and its own proposed metadata transition.

DD-4.4 shall not infer one resource's version state from another or promote this operation into general project/package/version-control management.

## 8. Cleanup Design

Cleanup shall resolve recognised disposable artefact classes under Maintenance policy before deletion. DD-4.4 shall not expose Resource Access deletion reachability as application-level cleanup authority.

Each cleanup candidate shall be positively classified as disposable, within managed scope and not excluded by stronger ownership/protection policy.

Where practical, the planned cleanup set shall be stabilized before consequential deletion begins. New discoveries during execution require explicit policy to join the plan; they shall not silently broaden the authorised operation.

## 9. Continuation and Partial Effects

DD-4.4 shall define continuation at resource granularity for coordinated mutation. Independent later resources may continue after an item-level failure/refusal/indeterminate state only when resolved Maintenance policy permits it and no dependency requires blocking.

There is no universal cross-resource transaction. Completed Source Transformation or Resource Access effects remain completed unless a real compensating effect occurs.

The domain result shall preserve per-resource planned disposition, effect evidence, validation/acceptance state and diagnostics so DD-1 can perform final canonical acceptance.

## 10. Cancellation

Cancellation shall be observed before each new consequential resource effect and at other safe boundaries. It prevents further work but does not erase completed transformations/deletions.

## 11. Authority Boundary

The existing Maintenance stronger-owner gate remains prior to coordinated planning. DD-4.4 owns Maintenance intent, operation-specific eligibility/classification, plan construction, continuation and domain postconditions.

DD-2 specialists retain their bounded mechanics. DD-1 retains managed scope, effective configuration, invocation/authorization, canonical outcomes and final Application Engine acceptance.

## 12. AI Boundary

No DD-2.7 AI dependency is introduced. Ambiguous Maintenance evidence shall remain ambiguous rather than being converted into consequential authority by generative inference.

## 13. Catalogue Impact

DD-4.4 continues to own exactly the four canonical `maintenance.*` operations. The complete Version 1 catalogue remains **96** commands.
