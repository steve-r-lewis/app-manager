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

The Version 1 Design, Functional, Detailed Design and Implementation Specification corpus has been authored through Level 4. The documentation-remediation sequence (Packages 0/A/B/C/D) and the complete **DR — Documentation Rationalisation** programme are closed.

The immutable pre-rationalisation semantic comparison baseline remains:

`fe30f5ad883ce2abeca2e495dd4d7036eef09da6`

DR-0 through DR-9 were merged as PRs #158 through #167 respectively. PR #167 was independently verified merged and closed, and live `master` was independently verified at its exact merge commit:

`bf6d01b3fdf2df3bf373b352ee5ee92ae681a8d7`

That commit is the accepted **Version 1 lean implementation documentation baseline**.

**Current phase:** Version 1 implementation may begin from the accepted lean baseline under the established normative hierarchy, accepted ADRs and active clarifications. Implementation must not treat the frozen pre-rationalisation comparison baseline, historical handovers, intermediate DR branches or legacy source topology as competing target authority.

## 3. DR Programme — Closed

The completed programme plan is `documentation-corpus-rationalisation-programme-v01.md`.

Final programme state:

1. **DR-0 — Post-Baseline Verification and Rationalisation Control** — merged and independently verified;
2. **DR-1 — Contract and Ownership Corrections** — merged and independently verified;
3. **DR-2 — Authority and Hierarchy Corrections** — merged and independently verified;
4. **DR-3 — Design and Functional Normative Ownership** — merged and independently verified;
5. **DR-4 — DD-2 Shared Capability Rationalisation** — merged and independently verified;
6. **DR-5 — DD-3/DD-4 Domain Rationalisation** — merged and independently verified;
7. **DR-6 — Functional Corpus Rationalisation** — merged and independently verified;
8. **DR-7 — Implementation Specification Rationalisation** — merged and independently verified;
9. **DR-8 — Documentation and Project-Management Hygiene** — merged and independently verified;
10. **DR-9 — Semantic Equivalence and Lean-Baseline Verification** — merged, independently verified and accepted.

Final DR-9 finding: **PASS — semantic equivalence established with accountable corrections; zero unaccounted semantic loss identified.**

The governing rationalisation rule remains useful documentation guidance: **state a semantic rule once at its canonical normative owner; downstream documents reference that owner and specify only the local binding and local delta.**

## 4. Baseline Roles

| Baseline | SHA | Role |
|---|---|---|
| Pre-rationalisation semantic comparison baseline | `fe30f5ad883ce2abeca2e495dd4d7036eef09da6` | Immutable evidence source used to prove semantic accounting through DR-9. Historical comparison baseline only. |
| Version 1 lean implementation documentation baseline | `bf6d01b3fdf2df3bf373b352ee5ee92ae681a8d7` | Accepted documentation baseline from which Version 1 implementation planning and implementation work may proceed. |

The first baseline is not superseded as evidence; the second supersedes it as the implementation starting point.

## 5. Information Classes and Reading Rule

`assurance/` retains completed audits, reviews and reconciliations. `history/` retains completed/superseded management activity. `decisions/` remains the ADR location. Active root project-management documents provide current navigation, registers and reusable procedure.

For implementation work: read this index; read the normative product hierarchy; read accepted ADRs and active clarifications; use the Implementation Specification register and relevant IS documents; consult assurance/history for evidence, provenance or rationale only. Always verify live repository state before creating a work branch.

## 6. Active and Reusable Root Documents

- `normative-ownership-map-v01.md` — DR-3 index of canonical Design/Functional owners for recurrent invariants;
- `detailed-design-register-v01.md` — current Version 1 DD identity/lifecycle register;
- `active-clarification-register-v01.md` — current navigation across active Functional, DD and Implementation clarifications;
- `domain-detailed-design-authoring-guide-v02.md` — reusable drafting and hierarchical-reference/readability guidance;
- `documentation-assurance-guide-v01.md` — reusable vertical + horizontal assurance method;
- `README.md` — current-state navigation.

The completed `documentation-corpus-rationalisation-programme-v01.md` is retained as programme control/history evidence and is no longer an active work programme.

## 7. DR Closeout Evidence

DR-9 is recorded at `assurance/reviews/dr9-semantic-equivalence-and-lean-baseline-verification-v01.md`, with programme-wide proposition accounting at `assurance/reconciliations/dr9-semantic-equivalence-register-v01.md`. Formal programme closeout is recorded at `history/closeouts/documentation-rationalisation-programme-closeout-v01.md`.

The final review preserved stable Functional requirement identities, Detailed Design contracts accounted by DR-4/DR-5, all 23 primary Implementation Specification identities and concrete Level 4 contracts, the nine DR-3 recurrent invariant owner sets, and every confirmed DR-1/DR-2 correction. No unresolved semantic contradiction requires new normative change control.

The post-merge verification required by DR-9 is satisfied: PR #167 merged at `bf6d01b3fdf2df3bf373b352ee5ee92ae681a8d7`, and live `master` was independently verified at the same SHA.

## 8. Continuing Documentation Rules

The final corpus continues to require one canonical normative owner per semantic rule; inherited rules referenced rather than fully restated; concise local safety/authority bindings where needed; only local delta downstream; no architecture inferred from naming/shape similarity; correctness before deduplication; and accountable change control for genuine semantic changes.

Project-management records do not become product authority. Current source remains migration evidence where normative target specifications exist.

## 9. Next Objective

Begin the Version 1 implementation programme from the accepted lean implementation documentation baseline `bf6d01b3fdf2df3bf373b352ee5ee92ae681a8d7`.

Before implementation changes are made, establish the implementation programme and dependency-ordered work plan from the governing Implementation Specifications. The plan should respect the explicit runtime/assembly path, application authority, shared-capability/domain boundaries, migration dispositions and independently testable conformance obligations rather than assuming numeric IS order is the implementation sequence.