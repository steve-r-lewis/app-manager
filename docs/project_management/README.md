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

DR-0 through DR-6 have been merged as PRs #158 through #164 respectively.

PR #164 and live `master` were independently verified at:

`7bc99614528d45a227c0c17faa7dcade777b1072`

DR-7 was branched from that exact commit.

**Current objective:** DR-7 — Implementation Specification Rationalisation — is complete on its review branch and ready for review/merge. After merge and independent live-master verification, proceed to DR-8 — Documentation and Project-Management Hygiene.

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
7. **DR-6 — Functional Corpus Rationalisation** — merged and independently verified;
8. **DR-7 — Implementation Specification Rationalisation** — complete on branch, pending merge/live verification;
9. **DR-8 — Documentation and Project-Management Hygiene** — next after DR-7 closeout;
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

DR-1 and DR-2 corrected/verified contract, ownership and authority-direction candidates. DR-3 established canonical Design/Functional owner sets. DR-4 rationalised the DD-2 family reading. DR-5 rationalised DD-3/DD-4 domain reading while preserving domain-specific intent/policy/orchestration/evidence interpretation/postconditions. DR-6 rationalised the Functional corpus reading while preserving every `FR-*` identity and observable obligation.

Their assurance records and semantic disposition registers remain under `assurance/`.

## 7. DR-7 Result

DR-7 is recorded at `assurance/reviews/dr7-implementation-specification-rationalisation-v01.md`, with semantic accounting at `assurance/reconciliations/dr7-semantic-disposition-register-v01.md` and the active Level 4 reading clarification at `../implementation/clarifications/implementation-specification-rationalisation-clarification-v01.md`.

DR-7 establishes that repeated upstream architecture in an Implementation Specification is an inherited implementation binding unless concrete Level 4 delta is attached. Interfaces, types, module boundaries, provider/mechanism decisions, algorithms, stale/cancellation/concurrency semantics, migration dispositions, traceability and independently testable conformance obligations remain owned by the relevant IS and are not deduplicated away.

The read-first horizontal review confirmed the deliberate IS-1/IS-22/IS-23 runtime seam; Repository/Git, AI, Quality, Documentation/Docs and Nuxt capability/domain pairs; IS-3/IS-19 configuration/settings separation; direct Git CLI through IS-5 for the IS-6 local Git provider; and current source as migration evidence rather than target architecture.

No primary IS body was mechanically shortened because no corpus-wide deletion class was proven proposition-safe. All 23 IS identities and concrete Level 4 contracts remain intact.

## 8. Rationalisation Safety Rules

The DR programme requires one canonical normative owner per semantic rule; inherited rules referenced rather than fully restated; concise local safety/authority bindings where needed; only local delta downstream; no architecture inferred from naming/shape similarity; correctness before deduplication; no mechanical corpus-wide rewrite; accountable semantic dispositions; and post-merge live-master verification.

The final acceptance criterion is **zero unaccounted semantic loss** against `fe30f5ad883ce2abeca2e495dd4d7036eef09da6`, not a predetermined reduction percentage.

## 9. Next Objective

After the DR-7 PR merges, independently verify the resulting live `master` and close DR-7. Then create a fresh DR-8 branch from that exact commit and perform Documentation and Project-Management Hygiene, checking compatibility value and active references before deleting or standardising low-risk artefacts.