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

PR #157, Package D — Final Documentation Baseline Verification, was verified merged and closed. The resulting live `master` was independently verified at:

`fe30f5ad883ce2abeca2e495dd4d7036eef09da6`

That post-merge verification closes the lifecycle gap left by Package D's necessarily pre-merge status text. The commit above is now frozen as the semantic source baseline for the **DR — Documentation Rationalisation** programme.

A new independent external review of the complete `docs/` corpus subsequently identified substantial repetition/duplication and alleged several correctness/authority issues. Those reports are assurance evidence, not product authority. Their findings are being verified through DR before structural rationalisation.

**Current objective:** DR-0 — Post-Baseline Verification and Rationalisation Control — is complete on its branch and ready for review/merge. After its merge and live-master verification, proceed to DR-1 — Contract and Ownership Corrections.

Implementation should not branch from the former Package D “ready” wording while DR-1 correctness candidates remain unclassified. The target implementation baseline is the lean baseline accepted by DR-9.

## 3. DR Programme

The active programme plan is:

`documentation-corpus-rationalisation-programme-v01.md`

Its work packages are:

1. **DR-0 — Post-Baseline Verification and Rationalisation Control** — complete on branch;
2. **DR-1 — Contract and Ownership Corrections** — next;
3. **DR-2 — Authority and Hierarchy Corrections**;
4. **DR-3 — Design and Functional Normative Ownership**;
5. **DR-4 — DD-2 Shared Capability Rationalisation**;
6. **DR-5 — DD-3/DD-4 Domain Rationalisation**;
7. **DR-6 — Functional Corpus Rationalisation**;
8. **DR-7 — Implementation Specification Rationalisation**;
9. **DR-8 — Documentation and Project-Management Hygiene**;
10. **DR-9 — Semantic Equivalence and Lean-Baseline Verification**.

The governing rationalisation rule is: **state a semantic rule once at its canonical normative owner; downstream documents reference that owner and specify only the local binding and local delta.**

Reduction is controlled by semantic propositions and accountable dispositions, not by a target percentage of lines or words.

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
- `detailed-design-register-v01.md` — current Version 1 DD identity/lifecycle register;
- `domain-detailed-design-authoring-guide-v02.md` — reusable drafting and hierarchical-reference/readability guidance;
- `documentation-assurance-guide-v01.md` — reusable vertical + horizontal assurance method;
- `README.md` — current-state navigation.

The old root paths for the Detailed Design decomposition plan/authoring guide v01 and the Implementation Specification plan/map are compatibility pointers. Their substantive completed content is retained under `history/programmes/`.

## 6. Established Documentation State

The current pre-rationalisation semantic source preserves these lifecycle facts:

- the Version 1 Design and Functional corpus is established under the Project Documentation Guide;
- all 23 primary Detailed Designs, DD-1.1 through DD-4.4, are registered `Complete`;
- all 23 primary Implementation Specifications, IS-1 through IS-23, are `Authored` and reconciled;
- active clarifications remain part of the applicable normative reading set;
- accepted ADRs remain decision-provenance records alongside, not above or below, the four-level specification hierarchy;
- historical programme documents remain provenance and are not current by implication.

These facts do not pre-judge the new external audit's specific semantic allegations. DR-1 and DR-2 must classify those against live authoritative documents before editing.

## 7. Rationalisation Safety Rules

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

## 8. Next Objective

After DR-0 merges, verify live `master` and close DR-0. Then create a fresh DR-1 branch from that exact commit and perform a read-first horizontal verification of:

1. IS-1 versus IS-22 `InteractionCapabilities`;
2. DD-3.3 versus its active Nuxt operation-identity clarification;
3. App root creation versus Nuxt baseline-configuration ownership.

Classify each as `confirmed defect`, `clarification required`, or `not sustained` before making any normative edit.
