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

PR #157, Package D — Final Documentation Baseline Verification, was verified merged and closed. Its resulting live `master` commit remains frozen as the semantic source baseline for the **DR — Documentation Rationalisation** programme:

`fe30f5ad883ce2abeca2e495dd4d7036eef09da6`

PR #158, DR-0 — Post-Baseline Verification and Rationalisation Control, was subsequently verified merged into live `master` at:

`358d17e3c9651ccda29fbe67215392ef4f6ff799`

That verification independently closes DR-0. DR-1 was branched from that exact commit.

**Current objective:** DR-1 — Contract and Ownership Corrections — is complete on its review branch and ready for review/merge. After its merge and independent live-master verification, proceed to DR-2 — Authority and Hierarchy Corrections.

Implementation should not branch from the former Package D “ready” wording while the DR correctness/authority programme remains active. The target implementation baseline is the lean baseline accepted by DR-9.

## 3. DR Programme

The active programme plan is `documentation-corpus-rationalisation-programme-v01.md`.

Programme state:

1. **DR-0 — Post-Baseline Verification and Rationalisation Control** — merged and independently verified;
2. **DR-1 — Contract and Ownership Corrections** — complete on branch, pending merge/live verification;
3. **DR-2 — Authority and Hierarchy Corrections** — next after DR-1 closeout;
4. **DR-3 — Design and Functional Normative Ownership**;
5. **DR-4 — DD-2 Shared Capability Rationalisation**;
6. **DR-5 — DD-3/DD-4 Domain Rationalisation**;
7. **DR-6 — Functional Corpus Rationalisation**;
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
- `detailed-design-register-v01.md` — current Version 1 DD identity/lifecycle register;
- `domain-detailed-design-authoring-guide-v02.md` — reusable drafting and hierarchical-reference/readability guidance;
- `documentation-assurance-guide-v01.md` — reusable vertical + horizontal assurance method;
- `README.md` — current-state navigation.

The old root paths for the Detailed Design decomposition plan/authoring guide v01 and the Implementation Specification plan/map are compatibility pointers. Their substantive completed content is retained under `history/programmes/`.

## 6. DR-1 Result

DR-1 is recorded at `assurance/reviews/dr1-contract-and-ownership-corrections-v01.md`.

Its classifications are:

- **IS-1 / IS-22 `InteractionCapabilities` — confirmed defect.** The application request contract and adapter-local capability description used the same type name for incompatible shapes. `docs/implementation/clarifications/interaction-capabilities-contract-clarification-v01.md` makes the five-field IS-1 contract canonical, renames the six-field IS-22 concept to adapter-local `AdapterCapabilities`, and defines the explicit mapping. Primary-body fold-forward belongs DR-7.
- **DD-3.3 / Nuxt operation identity — stale primary text, but the semantic conflict is already resolved by the active Nuxt operation-identity clarification.** The primary body still lists `inspect_layer_state`; the active clarification already defines the canonical eight identities and forbids a ninth semantic command. Fold-forward belongs DR-5; a duplicate clarification was deliberately not created.
- **App root creation / Nuxt configuration ownership — not sustained.** FR-APP-072 owns the required artefact class at Functional level; DD-3.1 explicitly gives App root-creation plan inclusion/orchestration while retaining Nuxt-specific configuration/scaffold semantics under Nuxt ownership.

No generic framework, new command identity or authority transfer was introduced.

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

After the DR-1 PR merges, independently verify the resulting live `master` and close DR-1. Then create a fresh DR-2 branch from that exact commit and verify the authority/hierarchy candidates defined by the programme before structural rationalisation begins.
