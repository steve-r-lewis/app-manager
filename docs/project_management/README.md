# AppManager Project Management Library

> **Document type:** Project-management current-state index and library entry point
>
> **Status:** Active
>
> **Role:** Current-state navigation
>
> **Normative product effect:** None. This index does not create or amend product requirements, architecture, Detailed Design, Implementation Specification contracts, or ADR decisions.

## 1. Purpose

This document is the required entry point for `docs/project_management/`. It separates active project control from retained assurance evidence and project history so current state can be established without reconstructing it from historical records.

## 2. Current Project State

The Version 1 Design, Functional, Detailed Design and Implementation Specification corpus has been authored through Level 4. Level 4 reconciliation closed with PR #152; Package 0 merged as PR #153; Package A merged as PR #154; Package B merged as PR #155.

Package B was verified on live `master` at `2750350d798e0f7fe4938724ab67411339330ed3` before Package C began.

**Package C — Hierarchical Specification Referencing and Readability** is complete on its review branch. It becomes closed project state only after its PR is merged and the resulting live `master` is verified.

The remediation sequence is:

1. Package 0 — Project Management Information Architecture — complete;
2. Package A — Documentation Governance and State Integrity — complete;
3. Package B — Specification Defect Verification and Correction — complete;
4. Package C — Hierarchical Specification Referencing and Readability — complete pending merge/live-master verification;
5. Package D — Final Documentation Baseline Verification — next after Package C merge.

## 3. Information Classes and Reading Rule

`assurance/` retains completed audits, reviews and reconciliations. `history/` retains completed/superseded management activity. `decisions/` remains the ADR location. Active root project-management documents provide current navigation, registers and reusable procedure.

For current work:

1. read this index;
2. read the active register/guide applicable to the task;
3. read the normative product hierarchy;
4. read accepted ADRs and active clarifications where relevant;
5. consult assurance/history only for evidence, provenance or rationale.

Always verify live repository state; historical PR/branch/SHA/status statements are not current by implication.

## 4. Active and Reusable Root Documents

- `detailed-design-register-v01.md` — current Version 1 DD identity/lifecycle register;
- `domain-detailed-design-authoring-guide-v02.md` — reusable drafting and hierarchical-reference/readability guidance;
- `documentation-assurance-guide-v01.md` — reusable vertical + horizontal assurance method;
- `README.md` — current-state navigation.

The old root paths for the Detailed Design decomposition plan/authoring guide v01 and the Implementation Specification plan/map are compatibility pointers. Their substantive completed content is retained under `history/programmes/`.

## 5. Package B Result

Package B is recorded at `assurance/reviews/specification-defect-verification-and-correction-v01.md`. It corrected the Nuxt operation-identity inconsistency, clarified AI Functional ownership, aligned IS-23 with IS-6's Git provider decision, and rejected unsupported architecture changes.

## 6. Package C Result

Package C is recorded at `assurance/reviews/hierarchical-specification-referencing-and-readability-v01.md`.

The active authoring guide now establishes:

- three-layer referencing: canonical owner -> concise local binding -> local delta;
- state-once-locally/reference-thereafter discipline;
- current-owner rather than historical-programme references in active specifications;
- explicit treatment of historical `DD-5`/`DD-6` labels as programme phases, not primary DD identities;
- bounded non-normative worked examples;
- one-primary-diagram-plus-deltas guidance;
- grouped conformance/test obligations without information loss;
- stable requirement/contract IDs as primary traceability anchors.

`docs/detailed-design.md` has also been reconciled with the current DD register, v02 authoring guide, assurance guide and active Package B clarification set.

Package C deliberately does not perform a corpus-wide prose rewrite. Completed specifications retain independently testable obligations and local safety/authority statements; the readability conventions apply prospectively and during substantive revisions so editorial cleanup cannot silently change architecture.

## 7. Package C Exit Criteria

Package C is ready for merge because:

- the reusable hierarchical-reference/readability model is explicit;
- the principal active Detailed Design navigation surface points to current owners;
- the DD-5/DD-6 identity ambiguity is bounded without inventing new DDs;
- repetition may be reduced only after semantic ownership/local safety is preserved;
- examples/diagrams cannot create hidden semantics;
- conformance-list grouping cannot reduce verification obligations;
- traceability is anchored primarily by stable IDs rather than section numbering;
- no Functional/DD/IS contract or architectural authority was weakened for editorial brevity.

After merge, verify the resulting live `master`; then begin **Package D — Final Documentation Baseline Verification** from that exact baseline.
