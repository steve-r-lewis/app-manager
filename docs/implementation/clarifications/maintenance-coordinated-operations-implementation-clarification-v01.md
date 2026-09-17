# IS-21 Coordinated Maintenance Operations Clarification

> **Document type:** Implementation clarification
>
> **Status:** Active — temporary PBC-1 integration vehicle
>
> **Primary implementation:** [IS-21 — Utils Domain](../is-21-utils-domain-implementation-specification-v01.md)
>
> **Related clarification:** [Maintenance Domain Implementation Clarification](maintenance-domain-implementation-clarification-v01.md)
>
> **DD binding:** DD-4.4 Coordinated Maintenance Operations Clarification

## 1. Purpose

This clarification defines the implementation contract required for coordinated multi-resource Maintenance while preserving the four canonical Maintenance identities and established capability boundaries.

NCR-3 shall integrate this delta into the renamed canonical IS-21 owner and retire this clarification.

## 2. Scope Contract

IS-21 shall represent target cardinality explicitly. A representative domain-local contract is:

```ts
export type MaintenanceScope =
  | { readonly kind: 'resource'; readonly resource: ManagedResourceIdentity }
  | { readonly kind: 'selected'; readonly resources: readonly ManagedResourceIdentity[] }
  | { readonly kind: 'managed-unit'; readonly unit: ManagedUnitIdentity }
  | { readonly kind: 'all-eligible-managed' };
```

These types are implementation guidance local to IS-21 integration, not a new generic application scope framework. All variants resolve through IS-1/IS-2 authoritative managed context before Maintenance eligibility is applied.

## 3. Classification Contract

IS-21 shall preserve a discriminated classification sufficient to prevent discovered resources from being treated as implicitly consequential:

```ts
type MaintenanceResourceClassification =
  | { readonly kind: 'eligible'; readonly evidence: MaintenanceEligibilityEvidence }
  | { readonly kind: 'already_satisfied'; readonly evidence: MaintenanceStateEvidence }
  | { readonly kind: 'ineligible'; readonly reason: MaintenanceDiagnostic }
  | { readonly kind: 'stronger_owned'; readonly owner: DomainId; readonly reason: MaintenanceDiagnostic }
  | { readonly kind: 'unsupported'; readonly reason: MaintenanceDiagnostic }
  | { readonly kind: 'ambiguous'; readonly reason: MaintenanceDiagnostic }
  | { readonly kind: 'protected'; readonly reason: MaintenanceDiagnostic }
  | { readonly kind: 'outside_scope'; readonly reason: MaintenanceDiagnostic }
  | { readonly kind: 'stale_or_unresolved'; readonly reason: MaintenanceDiagnostic };
```

Names may be refined during implementation/NCR, but the semantic distinctions shall not be collapsed.

## 4. Coordinated Plan

Mutating Maintenance use cases shall execute from an immutable bounded plan equivalent to:

```ts
export interface CoordinatedMaintenancePlan {
  readonly invocationId: InvocationId;
  readonly operation: MaintenanceOperationId;
  readonly scope: MaintenanceScope;
  readonly items: readonly MaintenancePlanItem[];
  readonly continuation: MaintenanceContinuationPolicy;
}

export interface MaintenancePlanItem {
  readonly resource: ManagedResourceIdentity;
  readonly resourceClass: MaintenanceResourceClass;
  readonly classification: MaintenanceResourceClassification;
  readonly proposedEffect?: MaintenanceProposedEffect;
  readonly preconditions: readonly MaintenancePrecondition[];
  readonly acceptance: MaintenanceAcceptanceCriteria;
  readonly dependencies: readonly ManagedResourceIdentity[];
}
```

Only items positively classified as eligible and authorised for a consequential effect may reach mutation/deletion dispatch.

## 5. Planning Sequence

A coordinated mutating use case shall conceptually:

1. consume normalized IS-1 invocation and IS-2 managed scope;
2. resolve the requested Maintenance semantic scope;
3. discover/inspect candidate resources using approved bounded capabilities;
4. normalize duplicate logical resources;
5. apply the stronger-owner gate;
6. classify each candidate under operation-specific Maintenance policy;
7. construct bounded proposed effects only for eligible candidates;
8. bind revision/stale-state, protection and acceptance preconditions;
9. obtain required IS-1 consequential authorization for the resolved plan;
10. execute eligible effects according to continuation/cancellation policy;
11. validate and accept each affected resource independently;
12. return per-resource evidence to IS-1 for final canonical acceptance.

The implementation shall not enumerate arbitrary paths and then treat enumeration membership as authorization.

## 6. Header Validation Runner

`maintenance.headers.validate` may use a coordinated read-only runner over eligible header targets. It shall retain one result per logical resource plus aggregate Maintenance conformance.

A representative result is:

```ts
export interface HeaderValidationItemResult {
  readonly resource: ManagedResourceIdentity;
  readonly classification: MaintenanceResourceClassification;
  readonly conformance: HeaderConformanceState;
  readonly diagnostics: readonly MaintenanceDiagnostic[];
}
```

Validation performs no Source Transformation dispatch.

## 7. Header Repair Runner

`maintenance.headers.repair` shall build its repair plan from recognised supported defects. For each eligible item, Source Transformation receives a bounded approved transformation with the appropriate revision/preservation preconditions.

Immediately before each consequential transformation, stale-state requirements shall be checked at the applicable safe boundary. Staleness produces a truthful item result and continuation decision; it does not authorize overwrite or automatic re-planning.

## 8. Source-Version Maintenance Runner

`maintenance.source-version.maintain` shall preserve per-resource current-state evidence and proposed version-metadata transition. It may coordinate one policy across the set only where that policy is applicable to each item.

The implementation shall not infer that all files share a current version or require the same mutation merely because they are in one invocation.

## 9. Cleanup Runner

`maintenance.cleanup` shall resolve candidates through explicit disposable-resource classifiers. Resource Access may inspect/delete only the exact resources supplied after Maintenance eligibility and authorization.

The cleanup runner shall not pass an unconstrained root directory/glob to a deletion provider as a substitute for application planning.

Where practical, candidate discovery/classification completes before deletion begins. If execution-time discovery is supported, newly found candidates remain non-consequential until admitted through the same eligibility/authorization rules.

## 10. Per-Resource Result

Mutating operations shall preserve a result structure equivalent to:

```ts
export interface MaintenanceItemResult {
  readonly resource: ManagedResourceIdentity;
  readonly classification: MaintenanceResourceClassification;
  readonly plannedEffect?: MaintenanceProposedEffect;
  readonly effect?: EffectReference;
  readonly resultingRevision?: ResourceRevision;
  readonly acceptance: MaintenanceAcceptanceState;
  readonly diagnostics: readonly MaintenanceDiagnostic[];
}
```

The coordinated domain result shall contain identified item results and continuation/coverage evidence. IS-1 remains authoritative for canonical final outcome taxonomy.

## 11. Continuation and Dependencies

IS-21 shall implement explicit continuation policy at item granularity. Independent later items may proceed after failure/refusal/indeterminate state only when policy permits. A dependent item shall be blocked when its prerequisite state is not satisfied.

No synthetic rollback is permitted. If compensation is ever explicitly implemented, it is a separate effect and shall be reported as such.

## 12. Cancellation

The runner shall observe cancellation before starting each new consequential item and at other safe boundaries. Already completed effects remain in the result.

## 13. Interaction Adapters

IS-22 TUI, GUI and Headless adapters shall project the same coordinated Maintenance scope and result semantics. Interactive adapters may provide target-set selection, previews and progress; Headless shall supply or deterministically resolve scope without prompts.

Adapters shall not create their own bulk-maintenance loops over lower-level commands.

## 14. Capability and Authority Boundaries

IS-21 owns Maintenance classification/planning/continuation/postconditions. IS-8 owns existing-source transformation mechanics. IS-4 owns bounded resource inspection/deletion mechanics. Other inspection capabilities provide evidence only. IS-1/IS-2 retain managed scope and final application authority.

No AI provider is required or authorised to resolve ambiguous Maintenance classification into mutation authority.

## 15. Catalogue Impact

IS-21 continues to register exactly **4** canonical Maintenance use cases. The complete Version 1 catalogue remains **96** commands.
