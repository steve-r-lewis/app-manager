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

DR-0 merged as PR #158; DR-1 merged as PR #159; DR-2 merged as PR #160; DR-3 merged as PR #161; DR-4 merged as PR #162.

PR #162 and live `master` were independently verified at:

`f9c81503cdbdb6c361f9ead75e45cc8a553536fe`

DR-5 was branched from that exact commit.

**Current objective:** DR-5 — DD-3/DD-4 Domain Rationalisation — is complete on its review branch and ready for review/merge. After merge and independent live-master verification, proceed to DR-6 — Functional Corpus Rationalisation.

Implementation should not branch from the former Package D “ready” wording while the DR correctness/rationalisation programme remains active. The target implementation baseline is the lean baseline accepted by DR-9.

## 3. DR Programme

The active programme plan is `documentation-corpus-rationalisation-programme-v01.md`.

Programme state:

1. **DR-0 — Post-Baseline Verification and Rationalisation Control** — merged and independently verified;
2. **DR-1 — Contract and Ownership Corrections** — merged and independently verified;
3. **DR-2 — Authority and Hierarchy Corrections** — merged and independently verified;
4. **DR-3 — Design and Functional Normative Ownership** — merged and independently verified;
5. **DR-4 — DD-2 Shared Capability Rationalisation** — merged and independently verified;
6. **DR-5 — DD-3/DD-4 Domain Rationalisation** — complete on branch, pending merge/live verification;
7. **DR-6 — Functional Corpus Rationalisation** — next after DR-5 closeout;
8. **DR-7 — Implementation Specification Rationalisation**;
9. **DR-8 — Documentation and Project-Management Hygiene**;
10. **DR-9 — Semantic Equivalence and Lean-Baseline Verification**.

The governing rationalisation rule is: **state a semantic rule once at its canonical normative owner; downstream documents reference that owner and specify only the local binding and local delta.** Reduction is controlled by semantic propositions and accountable dispositions, not by a target percentage of lines or words.

## 4. Information Classes and Reading Rule

`assurance/` retains completed audits, reviews and reconciliations. `history/` retains completed/superseded management activity. `decisions/` remains the ADR location. Active root project-management documents provide current navigation, registers and reusable procedure.

For current work:

1. read this index;
2. read the active programme/register/guide applicable to the task;
3. read the normative product hierarchy;
4. read accepted ADRs and active clarifications where relevant;
5. consult assurance/history only for evidence, provenance or rationale.

Always verify live repository state; historical PR/branch/SHA/status statements are not current by implication.

## 5. Active and Reusable Root Documents

- `documentation-corpus-rationalisation-programme-v01.md` — active DR programme and semantic-preservation controls;
- `normative-ownership-map-v01.md` — DR-3 index of canonical Design/Functional owners for recurrent invariants;
- `detailed-design-register-v01.md` — current Version 1 DD identity/lifecycle register;
- `domain-detailed-design-authoring-guide-v02.md` — reusable drafting and hierarchical-reference/readability guidance;
- `documentation-assurance-guide-v01.md` — reusable vertical + horizontal assurance method;
- `README.md` — current-state navigation.

The old root paths for the Detailed Design decomposition plan/authoring guide v01 and the Implementation Specification plan/map are compatibility pointers. Their substantive completed content is retained under `history/programmes/`.

## 6. Completed Correctness Packages

DR-1 corrected/verified contract and ownership candidates. DR-2 corrected authority-direction and hierarchy candidates. Their assurance records and semantic disposition registers remain under `assurance/`.

No `FR-*` obligation, capability safety boundary or domain ownership was removed by those packages.

## 7. DR-3 Result

DR-3 is recorded at `assurance/reviews/dr3-design-and-functional-normative-ownership-v01.md`, with semantic accounting at `assurance/reconciliations/dr3-semantic-disposition-register-v01.md` and the reusable owner index at `normative-ownership-map-v01.md`.

The nine recurrent clusters now have explicit canonical owner sets. The existing Design/Functional corpus was found semantically sufficient to own them; no generic invariant framework was created.

## 8. DR-4 Result

DR-4 is recorded at `assurance/reviews/dr4-dd2-shared-capability-rationalisation-v01.md`, with semantic accounting at `assurance/reconciliations/dr4-semantic-disposition-register-v01.md` and the active DD-level reading correction at `../dd_2_shared_capabilities/clarifications/dd2-shared-capability-rationalisation-clarification-v01.md`.

DR-4 establishes sibling-authority neutrality, inherited-binding treatment for repeated upstream rules, explanatory treatment for generic delegation diagrams, Level 4 ownership of concrete implementation disposition, and preservation of all capability-specific local delta.

## 9. DR-5 Result

DR-5 is recorded at `assurance/reviews/dr5-dd3-dd4-domain-rationalisation-v01.md`, with semantic accounting at `assurance/reconciliations/dr5-semantic-disposition-register-v01.md` and the active family clarification at `../dd_3_high_coupling_domains/clarifications/dd3-dd4-domain-rationalisation-clarification-v01.md`.

DR-5 establishes that:

- DD-1 application authority and DD-2 capability mechanics are inherited owners, not domain-local redefinitions;
- domain DDs retain application intent, policy, orchestration, evidence interpretation and domain-specific postconditions;
- Git/Repository, Nuxt/Nuxt Capability, Docs/Documentation Capability, Quality/Quality Capability and AI Domain/AI Capability are deliberate layered pairs rather than duplicate contracts;
- Settings persistence remains distinct from DD-1.4 configuration precedence;
- Utils remains bounded by stronger semantic owners;
- App/Nuxt root-creation composition remains deliberate rather than duplicate ownership;
- the corrected eight-operation Nuxt identity set is carried forward and `inspect_layer_state` is not a ninth semantic operation, while lifecycle-state evidence remains required;
- historical implementation prose is provenance and IS-14 through IS-21 own concrete domain implementation disposition.

No generic domain framework or unsafe bulk deletion was introduced.

## 10. Rationalisation Safety Rules

The DR programme requires:

- one canonical normative owner per semantic rule;
- inherited rules referenced rather than fully restated;
- concise local bindings retained where needed for safety/authority clarity;
- only local deltas specified downstream;
- no architecture inferred from naming/shape similarity;
- correctness corrections before deduplication;
- no mechanical corpus-wide rewrite;
- every meaningful removed/replaced proposition accounted as `RETAIN`, `REFERENCE`, `CONSOLIDATE`, `RELOCATE`, `ILLUSTRATE`, `CORRECT`, or `REMOVE`;
- post-merge live-master verification before each work package is closed.

The final acceptance criterion is **zero unaccounted semantic loss** against `fe30f5ad883ce2abeca2e495dd4d7036eef09da6`, not a predetermined reduction percentage.

## 11. Next Objective

After the DR-5 PR merges, independently verify the resulting live `master` and close DR-5. Then create a fresh DR-6 branch from that exact commit and rationalise the Functional corpus while preserving every `FR-*` obligation and making Functional authority self-sufficient without downward Detailed Design dependency.
