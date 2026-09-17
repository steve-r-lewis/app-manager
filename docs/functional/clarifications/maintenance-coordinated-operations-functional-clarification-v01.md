# Maintenance Coordinated Operations Functional Clarification

> **Document type:** Functional clarification
>
> **Status:** Active — temporary PBC-1 integration vehicle
>
> **Design binding:** [Version 1 Coordinated Maintenance Operations Clarification](../../appmanager-version-1-maintenance-coordinated-operations-clarification-v01.md)
>
> **Clarifies:** Maintenance Functional semantics

## 1. Purpose

This clarification defines observable multi-resource behaviour for the four canonical Maintenance commands without adding aggregate command identities or weakening the stronger-owner boundary.

NCR-1 shall fold these requirements into the canonical Functional owner and retire this temporary clarification.

## 2. Canonical Identities

The Maintenance surface remains:

```text
maintenance.headers.validate
maintenance.headers.repair
maintenance.source-version.maintain
maintenance.cleanup
```

Target cardinality is structured invocation scope. It does not create `*-all` or `bulk-*` commands.

## 3. Common Coordinated Scope

**PBC-FR-MAINT-COORD-001 — Supported cardinality**  
Where the selected Maintenance command permits it, an invocation may target one eligible managed resource, an explicit eligible resource set, a supported semantic managed unit, or the complete eligible managed scope.

**PBC-FR-MAINT-COORD-002 — Managed-scope ceiling**  
A coordinated Maintenance scope shall remain within authoritative managed scope and shall not be broadened by directory discovery, glob matching, provider reachability or filesystem traversal.

**PBC-FR-MAINT-COORD-003 — Operation-specific eligibility**  
Every resource in a consequential Maintenance plan shall independently satisfy the selected command's eligibility rules. Membership in the managed project alone is insufficient.

**PBC-FR-MAINT-COORD-004 — Duplicate normalization**  
Overlapping semantic scopes shall not cause the same logical resource to be consequentially processed more than once in one invocation unless the command explicitly defines repeated processing.

**PBC-FR-MAINT-COORD-005 — Stable identity**  
Structured results shall identify each inspected or consequential resource sufficiently for interactive and Headless callers to correlate its state and outcome.

## 4. Classification and Planning

**PBC-FR-MAINT-COORD-006 — Classification before mutation**  
Before a coordinated mutating Maintenance operation starts consequential effects, AppManager shall classify the requested scope sufficiently to distinguish eligible targets from already-satisfied, ineligible, unsupported, ambiguous, protected, outside-scope or unresolved resources as applicable.

**PBC-FR-MAINT-COORD-007 — Discovery is not authority**  
Recognition or discovery of a file/artefact shall not itself authorise repair, version mutation or deletion.

**PBC-FR-MAINT-COORD-008 — Bounded plan**  
A coordinated mutating operation shall derive a bounded plan identifying each consequential resource, the recognised state that justifies the maintenance action, the intended effect and applicable acceptance/precondition evidence before execution.

**PBC-FR-MAINT-COORD-009 — No arbitrary paths**  
Maintenance shall not expose arbitrary path/glob/recursive traversal as independent mutation authority. User-supplied selectors, where supported, are requests that must resolve through managed scope and Maintenance eligibility.

## 5. Header Validation

**PBC-FR-MAINT-COORD-010 — Multi-resource validation**  
`maintenance.headers.validate` may inspect all eligible headers in its resolved supported scope without mutation.

**PBC-FR-MAINT-COORD-011 — Per-resource validation evidence**  
A coordinated header validation result shall preserve per-resource conformance/diagnostic state and an aggregate Maintenance interpretation.

**PBC-FR-MAINT-COORD-012 — Invalid is not repair authority**  
A validation finding shall not automatically trigger repair or create mutation authority.

## 6. Header Repair

**PBC-FR-MAINT-COORD-013 — Coordinated repair**  
`maintenance.headers.repair` may repair multiple independently eligible managed source resources within one authorised invocation.

**PBC-FR-MAINT-COORD-014 — Recognised defect required**  
Each repair target shall have a recognised supported header defect and bounded proposed repair before consequential mutation.

**PBC-FR-MAINT-COORD-015 — Per-resource transformation safety**  
Each repair remains subject to existing Source Transformation preservation, revision/stale-state and validation requirements. Bulk scope shall not weaken them.

**PBC-FR-MAINT-COORD-016 — Unsupported/ambiguous preservation**  
Unsupported, ambiguous, protected or stale resources shall not be blindly repaired and shall be reported truthfully.

## 7. Source-Version Maintenance

**PBC-FR-MAINT-COORD-017 — Coordinated source-version maintenance**  
`maintenance.source-version.maintain` may apply explicit source-version maintenance policy to multiple independently eligible managed resources in one invocation.

**PBC-FR-MAINT-COORD-018 — Per-resource current state**  
Each consequential resource shall have recognised current version state, applicable policy and proposed bounded metadata change before mutation.

**PBC-FR-MAINT-COORD-019 — Version boundary preserved**  
Coordinated source-version maintenance shall not become application/package versioning, Git tagging, documentation versioning or Nuxt upgrade authority.

## 8. Cleanup

**PBC-FR-MAINT-COORD-020 — Coordinated cleanup**  
`maintenance.cleanup` may delete multiple positively recognised disposable Maintenance artefacts in one authorised invocation.

**PBC-FR-MAINT-COORD-021 — Positive disposable classification**  
A cleanup resource shall be consequentially eligible only when it is positively classified as a supported disposable Maintenance artefact within managed scope.

**PBC-FR-MAINT-COORD-022 — Protected and stronger-owned resources**  
Cleanup shall preserve arbitrary/user-authored/protected resources and resources whose deletion semantics belong to App, Nuxt, Git, Docs, Settings, AI or another stronger owner.

**PBC-FR-MAINT-COORD-023 — Stable cleanup set**  
Where practical, the consequential cleanup set shall be resolved before deletion begins. Discovery during execution shall not silently broaden the authorised cleanup scope.

## 9. Effects, Continuation and Cancellation

**PBC-FR-MAINT-COORD-024 — Independent effects**  
A coordinated mutating Maintenance invocation shall preserve independently attributable per-resource effects and acceptance states.

**PBC-FR-MAINT-COORD-025 — No synthetic transaction**  
Multi-resource Maintenance mutation shall not be represented as universally atomic or rolled back unless actual transaction/compensation semantics occurred.

**PBC-FR-MAINT-COORD-026 — Partial completion**  
If earlier resources complete successfully and a later resource fails, becomes stale, is refused or is indeterminate, completed effects shall remain reported as completed and the aggregate result shall preserve partial completion truthfully.

**PBC-FR-MAINT-COORD-027 — Continuation policy**  
Whether independent later resources continue after an individual failure/refusal/indeterminate state shall be determined by explicit Maintenance continuation policy and any dependency relationships.

**PBC-FR-MAINT-COORD-028 — Cancellation**  
Cancellation shall prevent initiation of further consequential resource effects as soon as safely practical and shall not erase already completed effects.

**PBC-FR-MAINT-COORD-029 — Application acceptance**  
Per-resource Maintenance outcomes shall be returned through the common invocation path so the Application Engine retains final canonical outcome authority.

## 10. Interaction and Automation

**PBC-FR-MAINT-COORD-030 — Interaction equivalence**  
TUI, GUI and Headless shall preserve the same Maintenance scope, classification, plan, effect and outcome semantics even where target selection and presentation differ.

**PBC-FR-MAINT-COORD-031 — Deterministic Headless scope**  
Headless coordinated Maintenance shall require explicit or deterministically resolvable semantic scope and shall fail rather than guess a broader target set.

## 11. AI Boundary

**PBC-FR-MAINT-COORD-032 — No AI dependency**  
Version 1 coordinated Maintenance shall not require AI availability. AI shall not be used to convert ambiguous resource classification into mutation authority.

## 12. Cardinality

Maintenance remains **4 canonical commands**. The complete Version 1 catalogue remains **96 canonical commands**.
