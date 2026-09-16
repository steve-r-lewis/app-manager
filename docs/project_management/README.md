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

The Version 1 Design, Functional, Detailed Design and Implementation Specification corpus has been authored through Level 4. The preceding documentation-remediation sequence (Packages 0/A/B/C/D) is complete.

PR #157's resulting live `master` commit remains frozen as the semantic source baseline for the **DR — Documentation Rationalisation** programme:

`fe30f5ad883ce2abeca2e495dd4d7036eef09da6`

DR-0 merged as PR #158; DR-1 as #159; DR-2 as #160; DR-3 as #161; DR-4 as #162; DR-5 as #163.

PR #163 and live `master` were independently verified at:

`be682eb3947e2d1447d1f21ff293ea53003f69e1`

DR-6 was branched from that exact commit.

**Current objective:** DR-6 — Functional Corpus Rationalisation — is complete on its review branch and ready for review/merge. After merge and independent live-master verification, proceed to DR-7 — Implementation Specification Rationalisation.

Implementation should not branch from the former Package D “ready” wording while the DR correctness/rationalisation programme remains active. The target implementation baseline is the lean baseline accepted by DR-9.

## 3. DR Programme

The active programme plan is `documentation-corpus-rationalisation-programme-v01.md`.

Programme state:

1. **DR-0 — Post-Baseline Verification and Rationalisation Control** — merged and independently verified;
2. **DR-1 — Contract and Ownership Corrections** — merged and independently verified;
3. **DR-2 — Authority and Hierarchy Corrections** — merged and independently verified;
4. **DR-3 — Design and Functional Normative Ownership** — merged and independently verified;
5. **DR-4 — DD-2 Shared Capability Rationalisation** — merged and independently verified;
6. **DR-5 — DD-3/DD-4 Domain Rationalisation** — merged and independently verified;
7. **DR-6 — Functional Corpus Rationalisation** — complete on branch, pending merge/live verification;
8. **DR-7 — Implementation Specification Rationalisation** — next after DR-6 closeout;
9. **DR-8 — Documentation and Project-Management Hygiene**;
10. **DR-9 — Semantic Equivalence and Lean-Baseline Verification**.

The governing rationalisation rule is: **state a semantic rule once at its canonical normative owner; downstream documents reference that owner and specify only the local binding and local delta.**

## 4. Information Classes and Reading Rule

`assurance/` retains completed audits, reviews and reconciliations. `history/` retains completed/superseded management activity. `decisions/` remains the ADR location. Active root project-management documents provide current navigation, registers and reusable procedure.

For current work: read this index; read the active programme/register/guide; read the normative product hierarchy; read accepted ADRs and active clarifications; consult assurance/history only for evidence, provenance or rationale. Always verify live repository state.

## 5. Active and Reusable Root Documents

- `documentation-corpus-rationalisation-programme-v01.md` — active DR programme and semantic-preservation controls;
- `normative-ownership-map-v01.md` — DR-3 index of canonical Design/Functional owners for recurrent invariants;
- `detailed-design-register-v01.md` — current Version 1 DD identity/lifecycle register;
- `domain-detailed-design-authoring-guide-v02.md` — reusable drafting and hierarchical-reference/readability guidance;
- `documentation-assurance-guide-v01.md` — reusable vertical + horizontal assurance method;
- `README.md` — current-state navigation.

## 6. Completed Correctness and Rationalisation Packages

DR-1 and DR-2 corrected/verified contract, ownership and authority-direction candidates. DR-3 established canonical Design/Functional owner sets. DR-4 rationalised the DD-2 family reading. DR-5 rationalised DD-3/DD-4 domain reading while preserving domain-specific intent/policy/orchestration/evidence interpretation/postconditions.

Their assurance records and semantic disposition registers remain under `assurance/`.

## 7. DR-6 Result

DR-6 is recorded at `assurance/reviews/dr6-functional-corpus-rationalisation-v01.md`, with semantic accounting at `assurance/reconciliations/dr6-semantic-disposition-register-v01.md` and the active Functional reading clarification at `../functional/clarifications/functional-corpus-rationalisation-clarification-v01.md`.

DR-6 establishes that every `FR-*` obligation remains the owning Functional semantic checksum; repeated Design invariants are inherited bindings while domain-specific observable consequences remain local; Functional traceability distinguishes upstream/same-level normative authority from downstream DD/capability refinement; completed decomposition-plan references are provenance/navigation; the existing Nuxt Functional ownership clarification keeps `FR-NUXT-058/059` self-sufficient and the DD scaffold clarification downstream; and conformance/downstream-boundary sections do not replace requirement bodies.

No `FR-*` identity was removed or renumbered and no generic Functional framework was introduced.

## 8. Rationalisation Safety Rules

The DR programme requires one canonical normative owner per semantic rule; inherited rules referenced rather than fully restated; concise local safety/authority bindings where needed; only local delta downstream; no architecture inferred from naming/shape similarity; correctness before deduplication; no mechanical corpus-wide rewrite; accountable semantic dispositions; and post-merge live-master verification.

The final acceptance criterion is **zero unaccounted semantic loss** against `fe30f5ad883ce2abeca2e495dd4d7036eef09da6`, not a predetermined reduction percentage.

## 9. Next Objective

After the DR-6 PR merges, independently verify the resulting live `master` and close DR-6. Then create a fresh DR-7 branch from that exact commit and rationalise IS-1 through IS-23 conservatively, preserving concrete interfaces, types, provider decisions, current-vs-target evidence, migration dispositions, algorithms/mechanisms and independently testable conformance obligations.