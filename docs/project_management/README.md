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

PR #157's resulting live `master` commit remains the frozen semantic source baseline for the **DR — Documentation Rationalisation** programme:

`fe30f5ad883ce2abeca2e495dd4d7036eef09da6`

DR-0 through DR-8 have been merged as PRs #158 through #166 respectively.

PR #166 and live `master` were independently verified at:

`24571992a833e943ec8217da98843fdc6492f5b6`

DR-9 was branched from that exact commit.

**Current objective:** DR-9 — Semantic Equivalence and Lean-Baseline Verification — is complete on its review branch with a PASS finding of zero unaccounted semantic loss. The final lean-baseline SHA remains pending only because programme closeout requires this PR to merge and the resulting live `master` to be independently verified.

Implementation must branch from the final DR-9 lean-baseline SHA after that verification, not from the former Package D readiness baseline or an intermediate DR branch.

## 3. DR Programme

The programme plan is `documentation-corpus-rationalisation-programme-v01.md`.

Programme state:

1. **DR-0 — Post-Baseline Verification and Rationalisation Control** — merged and independently verified;
2. **DR-1 — Contract and Ownership Corrections** — merged and independently verified;
3. **DR-2 — Authority and Hierarchy Corrections** — merged and independently verified;
4. **DR-3 — Design and Functional Normative Ownership** — merged and independently verified;
5. **DR-4 — DD-2 Shared Capability Rationalisation** — merged and independently verified;
6. **DR-5 — DD-3/DD-4 Domain Rationalisation** — merged and independently verified;
7. **DR-6 — Functional Corpus Rationalisation** — merged and independently verified;
8. **DR-7 — Implementation Specification Rationalisation** — merged and independently verified;
9. **DR-8 — Documentation and Project-Management Hygiene** — merged and independently verified;
10. **DR-9 — Semantic Equivalence and Lean-Baseline Verification** — PASS on review branch; pending merge/live-master verification for permanent baseline designation.

The governing rationalisation rule is: **state a semantic rule once at its canonical normative owner; downstream documents reference that owner and specify only the local binding and local delta.**

## 4. Information Classes and Reading Rule

`assurance/` retains completed audits, reviews and reconciliations. `history/` retains completed/superseded management activity. `decisions/` remains the ADR location. Active root project-management documents provide current navigation, registers and reusable procedure.

For current work: read this index; read the active programme/register/guide; read the normative product hierarchy; read accepted ADRs and active clarifications; consult assurance/history only for evidence, provenance or rationale. Always verify live repository state.

## 5. Active and Reusable Root Documents

- `documentation-corpus-rationalisation-programme-v01.md` — DR programme and semantic-preservation controls;
- `normative-ownership-map-v01.md` — DR-3 index of canonical Design/Functional owners for recurrent invariants;
- `detailed-design-register-v01.md` — current Version 1 DD identity/lifecycle register;
- `active-clarification-register-v01.md` — current navigation across active Functional, DD and Implementation clarifications;
- `domain-detailed-design-authoring-guide-v02.md` — reusable drafting and hierarchical-reference/readability guidance;
- `documentation-assurance-guide-v01.md` — reusable vertical + horizontal assurance method;
- `README.md` — current-state navigation.

## 6. Completed Correctness and Rationalisation Packages

DR-1 and DR-2 corrected/verified contract, ownership and authority-direction candidates. DR-3 established canonical Design/Functional owner sets. DR-4 rationalised the DD-2 family reading. DR-5 rationalised DD-3/DD-4 domain reading while preserving domain-specific intent/policy/orchestration/evidence interpretation/postconditions. DR-6 rationalised the Functional corpus reading while preserving every `FR-*` identity and observable obligation. DR-7 rationalised Level 4 interpretation while preserving all concrete IS contracts and migration evidence. DR-8 completed low-risk hygiene without changing product semantics.

Their assurance records and semantic disposition registers remain under `assurance/`.

## 7. DR-9 Result

DR-9 is recorded at `assurance/reviews/dr9-semantic-equivalence-and-lean-baseline-verification-v01.md`, with programme-wide proposition accounting at `assurance/reconciliations/dr9-semantic-equivalence-register-v01.md`.

The final review aggregates DR-1 through DR-8 against frozen source baseline `fe30f5ad883ce2abeca2e495dd4d7036eef09da6` using the programme relation:

```text
baseline meaningful propositions
    = final locally stated propositions
    + final propositions reachable through explicit normative reference
    + explicitly documented CORRECT dispositions
```

The result is **PASS — semantic equivalence established with accountable corrections; zero unaccounted semantic loss identified**.

The check preserves all stable Functional requirement identities, all 23 Detailed Design identities/contracts as accounted by the DD packages, all 23 primary Implementation Specification identities and concrete Level 4 contracts, the nine DR-3 recurrent invariant owner sets, and every confirmed DR-1/DR-2 correction. No unresolved semantic contradiction requires new normative change control.

## 8. Rationalisation Safety Rules

The final corpus continues to require one canonical normative owner per semantic rule; inherited rules referenced rather than fully restated; concise local safety/authority bindings where needed; only local delta downstream; no architecture inferred from naming/shape similarity; correctness before deduplication; no mechanical corpus-wide rewrite; and accountable semantic dispositions.

The DR-9 result demonstrates zero unaccounted semantic loss rather than a predetermined reduction percentage.

## 9. Next Objective

Merge the DR-9 PR and independently verify the resulting live `master`. Record that exact merge SHA as the **lean Version 1 implementation documentation baseline**. Once verified, the DR programme is closed and Version 1 implementation may begin from that baseline under the established normative hierarchy, accepted ADRs and active clarifications.