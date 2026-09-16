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

The Version 1 Design, Functional, Detailed Design and Implementation Specification corpus has been authored through Level 4. Level 4 reconciliation closed with PR #152; Package 0 merged as PR #153; Package A merged as PR #154.

Package A was verified on live `master` at `114a07e9d75755876788b1ad2a6aa36e58102528` before Package B began.

**Package B — Specification Defect Verification and Correction** is complete on its review branch. It becomes closed project state only after its PR is merged and the resulting live `master` is verified.

The remediation sequence is:

1. Package 0 — Project Management Information Architecture — complete;
2. Package A — Documentation Governance and State Integrity — complete;
3. Package B — Specification Defect Verification and Correction — complete pending merge/live-master verification;
4. Package C — Hierarchical Specification Referencing and Readability — next after Package B merge;
5. Package D — Final Documentation Baseline Verification.

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
- `domain-detailed-design-authoring-guide-v02.md` — reusable drafting guidance;
- `documentation-assurance-guide-v01.md` — reusable vertical + horizontal assurance method;
- `README.md` — current-state navigation.

The old root paths for the Detailed Design decomposition plan/authoring guide v01 and the Implementation Specification plan/map are compatibility pointers. Their substantive completed content is retained under `history/programmes/`.

## 5. Package B Result

The Package B review is recorded at `assurance/reviews/specification-defect-verification-and-correction-v01.md`.

The candidate set was verified rather than adopted mechanically. Results:

- Source Intelligence versus Source Transformation separation — allegation not sustained;
- DD-3.1 `DD-5`/`DD-6` wording — stale phase-label/readability issue assigned to Package C, not a product-semantic defect;
- DD-3.3 versus IS-16 `inspect_layer_state` identity — confirmed and corrected by active Nuxt operation-identity clarification;
- Source Intelligence Functional authority — allegation not sustained; it remains a cross-cutting shared capability;
- AI Functional ownership — ambiguity confirmed and corrected by active Functional clarification separating AI-domain intent from shared AI capability execution;
- missing load-bearing clarification relationships — general allegation not sustained;
- Docs capability/domain repeated prose — semantic duplication allegation not sustained; readability remains Package C work;
- IS-6 versus IS-23 `simple-git` disposition — confirmed Level 4 contradiction; IS-23 corrected to follow IS-6's direct Git CLI through IS-5 provider decision.

No new product feature, generic framework, domain, capability, provider authority or implementation topology was introduced.

## 6. Package B Exit Criteria

Package B is ready for merge because:

- every identified candidate defect has been classified against the live authoritative corpus;
- confirmed semantic/Level 4 inconsistencies have an owning normative correction or active clarification;
- unsupported allegations were not converted into architecture;
- remaining stale-reference/repetitive-prose issues are explicitly bounded as Package C readability/reference work;
- DD-1 authority, managed scope/configuration authority, capability/domain separation, provider replaceability and final outcome ownership remain intact.

After merge, verify the resulting live `master`; then begin **Package C — Hierarchical Specification Referencing and Readability** from that exact baseline.
