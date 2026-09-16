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

The Version 1 Design, Functional, Detailed Design and Implementation Specification corpus has been authored through Level 4 and the documentation-remediation programme has completed its substantive work.

Level 4 reconciliation closed with PR #152; Package 0 merged as PR #153; Package A merged as PR #154; Package B merged as PR #155; Package C merged as PR #156.

Package C was verified on live `master` at `6953b3e36a078ef4ecba41fb32177d804281c946` before Package D began.

**Package D — Final Documentation Baseline Verification** is complete on its review branch with result **PASS — READY FOR IMPLEMENTATION**, subject only to merge of the Package D PR and verification of the resulting live `master`.

The remediation sequence is:

1. Package 0 — Project Management Information Architecture — complete;
2. Package A — Documentation Governance and State Integrity — complete;
3. Package B — Specification Defect Verification and Correction — complete;
4. Package C — Hierarchical Specification Referencing and Readability — complete;
5. Package D — Final Documentation Baseline Verification — complete pending merge/live-master verification.

After Package D merges and live `master` is verified, no further remediation package is scheduled. Implementation may proceed against the Version 1 documentation baseline under normal change control.

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

## 5. Remediation Results

Package A established current governance/state integrity: the active DD register is separated from the historical decomposition programme, reusable authoring guidance is non-product-normative, and the active project-management index is the current-state entry point.

Package B is recorded at `assurance/reviews/specification-defect-verification-and-correction-v01.md`. It corrected the Nuxt operation-identity inconsistency, clarified AI Functional ownership, aligned IS-23 with IS-6's Git provider decision, and rejected unsupported architecture changes.

Package C is recorded at `assurance/reviews/hierarchical-specification-referencing-and-readability-v01.md`. It established canonical owner -> concise local binding -> local delta, state-once/reference-thereafter, current-owner referencing, bounded non-normative examples, diagram discipline, grouped conformance obligations without information loss and stable-ID-first traceability. It deliberately did not perform a mechanical corpus-wide prose rewrite.

Package D is recorded at `assurance/reviews/final-documentation-baseline-verification-v01.md`. It verifies the resulting Design -> Functional -> Detailed Design -> Implementation Specification corpus as the Version 1 implementation documentation baseline and records no blocking residual documentation contradiction.

## 6. Baseline State

The current documentation baseline preserves the following lifecycle facts:

- the Version 1 Design and Functional corpus is established under the Project Documentation Guide;
- all 23 primary Detailed Designs, DD-1.1 through DD-4.4, are registered `Complete`;
- all 23 primary Implementation Specifications, IS-1 through IS-23, are `Authored` and reconciled;
- active clarifications remain part of the applicable normative reading set;
- accepted ADRs remain decision-provenance records alongside, not above or below, the four-level specification hierarchy;
- historical programme documents remain provenance and are not current by implication.

Implementation may proceed dependency-aware against this baseline after Package D merge/live-master verification. Any implementation discovery that exposes a genuine normative contradiction must be escalated to the owning specification/decision process rather than silently resolved in code.

## 7. Package D Exit Criteria

Package D is ready for merge because:

- PR #156 was verified merged/closed and the exact resulting `master` baseline was used;
- current authority/navigation and historical evidence are distinguishable;
- DD and IS registers agree with the completed Version 1 corpus;
- the Functional/DD/IS seams corrected by Package B remain represented;
- Package C's hierarchical-reference/readability controls are active;
- core application/capability/domain/provider authority boundaries remain intact;
- no blocking residual documentation-baseline contradiction was found;
- this index no longer presents Packages A-C as outstanding work;
- no further remediation package is scheduled after Package D.

After this PR merges, verify the resulting live `master`. That verification closes the documentation-remediation programme and establishes the repository baseline from which implementation work should branch.
