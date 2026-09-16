# AppManager Project Management Library

> **Document type:** Project-management current-state index and library entry point
>
> **Status:** Active
>
> **Role:** Current-state navigation
>
> **Normative product effect:** None. This index does not create or amend product requirements, architecture, Detailed Design, Implementation Specification contracts, or ADR decisions.

## 1. Purpose

This document is the required entry point for `docs/project_management/`. It separates active project control from retained assurance evidence and project history so that current state can be established without reconstructing it from old handovers, audits, branches, PRs, or work queues.

Retention preserves evidence and institutional history; it does not make a retained record a current directive.

## 2. Current Project State

The Version 1 Design, Functional, Detailed Design, and Implementation Specification corpus has been authored through Level 4. Level 4 reconciliation closed with PR #152. Work Package 0 — Project Management Information Architecture — merged as PR #153.

**Package A — Documentation Governance and State Integrity** is complete on its review branch when this version of the index is read there. Its changes do not become live project state until the Package A PR is merged and verified on `master`.

The remediation sequence is:

1. Package 0 — Project Management Information Architecture — complete;
2. Package A — Documentation Governance and State Integrity — complete pending merge/live-master verification;
3. Package B — Specification Defect Verification and Correction — next after Package A merge;
4. Package C — Hierarchical Specification Referencing and Readability;
5. Package D — Final Documentation Baseline Verification.

## 3. Information Classes

### 3.1 Active control

Active/reusable project-management documents may establish state, sequencing, document identities, and procedural controls within the Project Documentation Guide. They do not acquire product-design authority merely by being active.

### 3.2 Assurance library

`assurance/` retains completed audits, reviews, and reconciliations. Findings are evidence until corrected in the owning normative specification or accepted decision mechanism.

### 3.3 Project history

`history/` retains completed handovers, closeouts, plans, maps, inventories, migration records, and superseded authoring material. Historical imperative language is not a current directive.

### 3.4 Decisions

`decisions/` remains the dedicated ADR location under Architecture Decision Governance. ADRs are not ordinary assurance/history records.

## 4. Lifecycle Metadata

Project-management role and lifecycle status are separate dimensions. Recommended roles include Plan, Register, Map, Handover, Audit, Review, Reconciliation, Closeout, Inventory, Status, and Guide. Lifecycle states include Active, Completed, Superseded, and Historical.

A role never implies current authority. A completed audit remains evidence; a historical plan remains provenance; an active register may identify documents without owning their product semantics.

## 5. Reading Rule

For current work:

1. read this index for current programme state;
2. read the active register/guide applicable to the task;
3. read the normative product hierarchy applicable to the work;
4. read accepted ADRs and active clarifications where relevant;
5. consult assurance/history only for required evidence, provenance, or rationale.

Always verify live repository state. Historical branch names, PR numbers, commit SHAs, filenames, and status statements describe the baseline they recorded, not necessarily the current repository.

## 6. Active and Reusable Root Documents

- `detailed-design-register-v01.md` — canonical current Version 1 DD identity/lifecycle register;
- `domain-detailed-design-authoring-guide-v02.md` — reusable drafting guidance with explicit non-authority boundary;
- `documentation-assurance-guide-v01.md` — reusable vertical + horizontal assurance method;
- `README.md` — current-state navigation.

The old root paths for `detailed-design-decomposition-plan-v01.md`, `domain-detailed-design-authoring-guide-v01.md`, `implementation-specification-plan-v01.md`, and `implementation-specification-map-v01.md` are compatibility pointers only. Their substantive completed content is retained under `history/programmes/`.

Current Level 4 identity and lifecycle state is defined by `docs/implementation/implementation-specification-v01.md`, not by the historical IS plan/map.

## 7. Package A Corrections

Package A resolves the governance/state defects identified after Package 0:

- **Detailed Design register:** stale DD-3/DD-4 planned state is removed from current control. All 23 primary Version 1 DD documents are registered as complete at their canonical active paths.
- **Implementation Plan/Map:** completed Level 4 planning and mapping are explicitly historical rather than current authoring directives. The authoritative current IS register remains under `docs/implementation/`.
- **Authoring-guide authority leakage:** Version 02 makes clear that project-management guidance cannot establish product architecture; normative rules must be owned by the specification hierarchy or accepted decision mechanism.
- **DD-2 assurance lesson:** the reusable assurance method now requires both vertical conformance and horizontal coherence review, with finding classification before normative edits.
- **Lifecycle truth:** completed plans/maps and superseded authoring material are retained without competing with current project control.

## 8. Package A Exit Criteria

Package A is ready for merge when:

- current DD lifecycle state can be read without encountering a false future work queue;
- all Version 1 DD identities have one canonical current register entry;
- completed IS planning/map material is clearly historical;
- reusable authoring guidance cannot be mistaken for product-design authority;
- the DD-2 vertical-versus-horizontal assurance lesson is captured as reusable procedure;
- no normative product semantics are changed merely to repair project-management state;
- historical substantive content is preserved;
- Package B is identified as the next objective only after Package A is merged and live `master` is verified.

After merge, Package B must begin from the resulting live `master`, not from this branch's historical base assumptions.
