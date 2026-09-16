# AppManager Project Management Library

> **Document type:** Project-management current-state index and library entry point
>
> **Status:** Active
>
> **Role:** Current-state navigation
>
> **Normative product effect:** None. This index does not create or amend product requirements, architecture, Detailed Design, Implementation Specification contracts, or ADR decisions.

## 1. Purpose

This document is the required entry point for `docs/project_management/`.

The directory separates **active project control** from the retained **assurance library** and **project history**. The purpose is to make current project state and the next authorised management objective discoverable without requiring a reader or AI agent to reconstruct state from historical audits, reviews, reconciliations, handovers, closeouts, or completed work-package records.

Retention in the project-management library preserves evidence and institutional history. It does **not** make a retained record a current project directive.

## 2. Current Project State

The Version 1 Design, Functional, Detailed Design, and Implementation Specification corpus has been authored through Level 4. The Level 4 implementation-specification reconciliation programme closed with the merge of PR #152.

The current remediation programme, established after independent documentation review, is:

1. **Package 0 — Project Management Information Architecture** — current work package;
2. **Package A — Documentation Governance and State Integrity**;
3. **Package B — Specification Defect Verification and Correction**;
4. **Package C — Hierarchical Specification Referencing and Readability**;
5. **Package D — Final Documentation Baseline Verification**.

No historical handover, audit, review, reconciliation, or closeout overrides this current-state index merely because it contained imperative language when originally active.

## 3. Information Classes

### 3.1 Active control

Files retained directly under `docs/project_management/` are the active project-control and reusable project-management working documents required to understand or govern current work.

Active project-management material may establish project state, sequencing, planning, assignments, document identities, and procedural controls within the authority granted by the Project Documentation Guide. It does not acquire product-design authority merely by being active.

### 3.2 Assurance library

`assurance/` retains completed verification and evaluation evidence:

- `assurance/audits/` — conformance audits and formal verification records;
- `assurance/reviews/` — architecture or documentation reviews and investigations;
- `assurance/reconciliations/` — records that compare sources, identify discrepancies, or verify reconciliation.

Assurance records may identify defects and recommend corrections. They do not themselves amend normative product specifications. A finding becomes part of the current product baseline only through the appropriate authoritative document or accepted decision mechanism.

### 3.3 Project history

`history/` retains completed management activity and transition records:

- `history/handovers/` — session/programme continuation records that were once operational;
- `history/closeouts/` — evidence that a bounded programme or work package reached its exit condition;
- `history/programmes/` — completed plans, inventories, correction overlays, migration records, and status records retained to explain how the current state was reached.

Historical records remain intentionally accessible but must not be interpreted as current instructions.

### 3.4 Decisions

`decisions/` remains the dedicated ADR location. ADR status and authority continue to be governed by Architecture Decision Governance and the Project Documentation Guide. ADRs are not reclassified as ordinary assurance or history records merely because they preserve decision provenance.

## 4. Lifecycle Metadata

Project-management documents should distinguish **role** from **lifecycle status**.

Recommended roles include `Plan`, `Register`, `Map`, `Handover`, `Audit`, `Review`, `Reconciliation`, `Closeout`, `Inventory`, `Status`, and `Guide`.

Recommended lifecycle states are:

- `Active` — currently used to direct or navigate project work;
- `Completed` — the bounded activity is finished and the record is retained as evidence;
- `Superseded` — replaced by an identified successor;
- `Historical` — retained for project history and not a current directive.

A role does not imply lifecycle state. For example, an Audit may be Completed, a Plan may be Active or Superseded, and a Handover may be Active temporarily before becoming Historical.

## 5. Reading Rule

For current work, use this order:

1. this `README.md` to establish current programme state;
2. the active plan/register/guide named for the current objective;
3. the normative product-document hierarchy applicable to the work;
4. accepted ADRs and active clarifications where relevant;
5. assurance or historical records only when the current task requires their evidence, provenance, or rationale.

Historical filenames, branch names, PR numbers, commit SHAs, and status statements are evidence about the baseline they recorded. They must not be assumed to describe the current live repository state.

## 6. Active Root Documents

The following documents remain at the project-management root because they still provide active or reusable management control pending Package A reconciliation:

- `detailed-design-decomposition-plan-v01.md` — canonical Detailed Design identity/register material; Package A will reconcile stale lifecycle state;
- `domain-detailed-design-authoring-guide-v01.md` — reusable authoring guidance; Package A will resolve its identified authority-leakage problem;
- `implementation-specification-map-v01.md` — Level 4 selection/map record still referenced by the implementation register; Package A will reconcile its lifecycle/state;
- `implementation-specification-plan-v01.md` — Level 4 governing plan still referenced by the implementation register; Package A will reconcile its lifecycle/state.

The root is intentionally small. Completed evidence and programme history belong in the library subdirectories rather than competing with active control material.

## 7. Package 0 Classification

### Assurance — audits

- `application-core-detailed-design-conformance-audit-v01.md`
- `archive-absence-conformance-audit-v01.md`
- `detailed-design-conformance-audit-v01.md`
- `detailed-design-structure-conformance-audit-v01.md`
- `functional-specification-conformance-audit-v01.md`
- `shared-capability-detailed-design-conformance-audit-v01.md`

### Assurance — reviews

- `technology-architecture-review-v01.md`

### Assurance — reconciliations

- `dd2-independent-review-reconciliation-v01.md`
- `detailed-design-reference-reconciliation-v01.md`
- `detailed-design-vitepress-navigation-reconciliation-v01.md`
- `implementation-specification-conformance-reconciliation-v01.md`

### History — handovers

- `dd2-reconciliation-handover-v01.md`
- `dd3-2-git-domain-handover-v01.md`
- `detailed-design-dd1-handover-review-v01.md`
- `implementation-specification-handover-is4-v01.md`
- `implementation-specification-handover-is4-prompt-v01.md`

### History — closeouts

- `dd2-final-horizontal-reconciliation-conformance-closeout-v01.md`
- `detailed-design-structure-refactoring-closeout-v01.md`
- `implementation-specification-reconciliation-closeout-v01.md`

### History — programmes

- `archive-absence-remediation-status-v01.md`
- `detailed-design-register-pm001-correction-v01.md`
- `detailed-design-structure-migration-inventory-v01.md`
- `documentation-rationalisation-status-v01.md`
- `functional-specification-decomposition-plan-v01.md`

Classification is by the record's present lifecycle purpose, not by filename alone. Relocation does not alter the content, findings, evidential value, or historical meaning of these records.

## 8. Package 0 Exit Criteria

Package 0 is complete only when:

- active project-control material is distinguishable from assurance and history by directory location;
- the retained library contains the completed audit/review/reconciliation/handover/closeout/programme records listed above;
- ADRs remain under `decisions/`;
- current state and the next remediation package can be determined from this index without reading historical handovers;
- repository-relative links affected by relocation are reconciled or explicitly identified for correction before Package 0 closeout;
- no product specification semantics are changed as part of the structural relocation.

After Package 0 is merged and verified on live `master`, the next authorised work package is **Package A — Documentation Governance and State Integrity**.