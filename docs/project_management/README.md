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

The Version 1 Design, Functional, Detailed Design and Implementation Specification corpus has been authored through Level 4. The documentation-remediation sequence (Packages 0/A/B/C/D) and **DR — Documentation Rationalisation** are closed.

DR established semantic ownership, corrected verified defects and demonstrated zero unaccounted semantic loss, but subsequent closeout review identified that it did **not fully complete the intended physical single-statement hierarchical reduction**. In particular, some inherited normative propositions remain substantively restated downstream rather than being reduced to canonical references plus local binding/local delta.

PR #168 merged at `8d647309e29883922a04eefe01849bd3eb15937f`, and live `master` was independently verified at that exact SHA. That commit is now designated the **semantically reconciled pre-NCR baseline**.

The current active programme is **NCR — Normative Corpus Reduction**, governed by `normative-corpus-reduction-programme-v01.md`.

**Current phase:** physical hierarchical reduction of the normative Version 1 corpus. Version 1 implementation is paused until NCR completes.

## 3. Baseline Roles

| Baseline | SHA | Role |
|---|---|---|
| Pre-DR semantic comparison baseline | `fe30f5ad883ce2abeca2e495dd4d7036eef09da6` | Immutable historical evidence source used by DR semantic accounting. |
| DR-9 semantic-equivalence checkpoint | `bf6d01b3fdf2df3bf373b352ee5ee92ae681a8d7` | Verified semantic-equivalence result before formal DR closeout. |
| Semantically reconciled pre-NCR baseline | `8d647309e29883922a04eefe01849bd3eb15937f` | Live post-PR-168 corpus against which NCR performs and verifies physical hierarchical reduction. |

No current commit is yet designated the final lean implementation documentation baseline. That designation is deferred until NCR-5 passes and the final NCR merge is independently verified on live `master`.

## 4. DR Programme — Closed, Scope Clarified

DR-0 through DR-9 remain completed historical work. Their semantic corrections, ownership analysis, proposition accounting and assurance evidence remain valid.

The DR closeout claim that the corpus was ready to serve as the final lean implementation baseline is narrowed by the later finding recorded here and in the DR closeout record: **semantic reconciliation was complete, but physical single-statement reduction was not**.

DR is not reopened. Its result is treated as the reconciled semantic foundation for NCR.

## 5. NCR — Active

NCR has one definitive objective:

> Every normative rule, directive, architectural invariant or design mandate shall have exactly one complete canonical statement at its correct normative owner. Every other occurrence shall be a precise reference, a necessary concise local binding, or a genuine local semantic delta.

The execution passes are:

1. **NCR-1 — Design and Functional**;
2. **NCR-2 — Detailed Design**;
3. **NCR-3 — Implementation Specifications**;
4. **NCR-4 — Horizontal Reduction**;
5. **NCR-5 — Final Cardinality and Semantic Verification**.

These are execution passes within one finite programme, not separate documentation programmes. NCR-1 through NCR-4 physically edit the normative corpus; NCR-5 verifies the result. A failed NCR-5 check is corrected inside NCR rather than creating another rationalisation programme.

## 6. Anti-Circularity Rule

NCR deliberately limits project-management overhead. It uses one control document and one working proposition ledger as needed for execution and verification. Per-pass narrative assurance reports are not required.

Recording or classifying a duplicate is not completion. A duplicate normative restatement must be physically removed or reduced to a valid reference/local binding/local delta.

There is no NCR-6 and no successor documentation-rationalisation programme.

## 7. Information Classes and Reading Rule

`assurance/` retains completed audits, reviews and reconciliations. `history/` retains completed/superseded management activity. `decisions/` remains the ADR location. Active root project-management documents provide current navigation, registers and reusable procedure.

For NCR work: read this index and the NCR control; read the normative hierarchy and relevant active clarifications; use DR ownership/disposition evidence where useful; verify the live repository before each branch. Historical DR records are evidence and shall not be repeatedly rewritten to narrate NCR progress.

## 8. Active and Reusable Root Documents

- `normative-corpus-reduction-programme-v01.md` — active NCR execution control and definitive exit criteria;
- `normative-ownership-map-v01.md` — DR-3 index of canonical Design/Functional owners for recurrent invariants;
- `detailed-design-register-v01.md` — current Version 1 DD identity/lifecycle register;
- `active-clarification-register-v01.md` — current navigation across active Functional, DD and Implementation clarifications;
- `domain-detailed-design-authoring-guide-v02.md` — reusable drafting and hierarchical-reference/readability guidance;
- `documentation-assurance-guide-v01.md` — reusable vertical + horizontal assurance method;
- `README.md` — current-state navigation.

The completed `documentation-corpus-rationalisation-programme-v01.md` remains historical DR programme evidence.

## 9. Continuing Authority Rules

The established normative hierarchy is unchanged. NCR does not move authority merely to shorten prose. It removes duplicate statements by referencing the existing correct owner and retaining the consumer's genuine local delta.

Project-management records do not become product authority. Similar naming or data shape does not establish semantic equivalence or justify new generic architecture. Current source remains migration evidence where normative target specifications exist.

## 10. Next Objective

After this baseline-correction PR merges and live `master` is verified, begin **NCR-1 — Design and Functional** from that exact live baseline.

Implementation must not begin until NCR-5 satisfies the programme's cardinality and semantic-preservation criteria and the final resulting live `master` is independently verified.