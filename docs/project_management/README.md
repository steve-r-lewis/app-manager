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

DR established semantic ownership, corrected verified defects and demonstrated zero unaccounted semantic loss, but subsequent closeout review identified that it did **not fully complete the intended physical single-statement hierarchical reduction**. NCR — Normative Corpus Reduction was therefore established by PR #169.

Before NCR-1 began, PBC-1 restored previously agreed Version 1 interaction/portability criteria through PR #170. During the required pre-NCR command review, the App command catalogue was also found to preserve historical workflow identities that did not match the intended simple root-application product surface. PBC-1 therefore remains open only long enough to correct that App command model in the immediately following PR.

**Current phase:** PBC-1 App-command correction pending merge. NCR execution remains paused until this correction PR is merged and live `master` is independently verified.

## 3. Baseline Roles

| Baseline | SHA | Role |
|---|---|---|
| Pre-DR semantic comparison baseline | `fe30f5ad883ce2abeca2e495dd4d7036eef09da6` | Immutable historical evidence source used by DR semantic accounting. |
| DR-9 semantic-equivalence checkpoint | `bf6d01b3fdf2df3bf373b352ee5ee92ae681a8d7` | Verified semantic-equivalence result before formal DR closeout. |
| Post-DR / pre-PBC reconciled checkpoint | `8d647309e29883922a04eefe01849bd3eb15937f` | PR #168 closeout state retained as historical comparison after PBC-1 identified omitted criteria. |
| NCR-control checkpoint | `1268c9c1036637556386ebb3f3ba21029877df33` | PR #169 merge commit establishing NCR control; not the final semantic input because PBC-1 follows. |
| PBC-1 interaction/portability checkpoint | `eacb032fbb7c41bd7479c9d781eb68231a18fe73` | Verified live `master` merge of PR #170; also the base for the App-command correction. |
| Semantically complete pre-NCR baseline | **pending App-command correction merge verification** | The exact live `master` merge SHA after the immediately following PBC-1 App-command PR becomes NCR's authoritative semantic input baseline. |

No current commit is yet designated the final lean implementation documentation baseline. That designation remains deferred until NCR-5 passes and the final NCR result is independently verified on live `master`.

## 4. PBC-1 — Pre-NCR Baseline Correction

PBC-1 is a bounded pre-NCR semantic correction, not a new documentation programme.

PR #170 restored the interaction/portability criteria:

1. Version 1 provides **TUI, GUI and Headless** as three concrete interaction provisions over one application model.
2. The GUI is the graphical/WYSIWYG interaction counterpart to the TUI while preserving shared command, policy, scope, safety and outcome semantics.
3. The publishable Version 1 implementation is modular, interface-driven TypeScript with explicit typed boundaries and explicit composition at deliberately replaceable seams.
4. Future IDE/plugin portability, including the previously discussed WebStorm direction, constrains Version 1 coupling but does not make the WebStorm plugin, JVM implementation, generic plugin framework or cross-language transport a Version 1 deliverable.

The immediately following App-command correction establishes the intended simple root-application command surface before NCR canonicalises it:

```text
app.create
app.prepare
app.develop
app.build
app.preview
app.generate
app.clean
app.reset
```

It also restores the boundary that complex Nuxt-aware monorepo, layer-composition and framework-structural operations belong to the `nuxt` domain rather than the simple `app` surface.

PBC-1 clarifications are temporary integration vehicles. NCR shall fold their semantics into canonical primary owners and retire them.

No PBC-2, PBC closeout programme or separate PBC assurance programme is planned.

## 5. NCR — Established, Execution Pending PBC-1 Completion

NCR has one definitive objective:

> Every normative rule, directive, architectural invariant or design mandate shall have exactly one complete canonical statement at its correct normative owner. Every other occurrence shall be a precise reference, a necessary concise local binding, or a genuine local semantic delta.

The execution passes are:

1. **NCR-1 — Design and Functional**;
2. **NCR-2 — Detailed Design**;
3. **NCR-3 — Implementation Specifications**;
4. **NCR-4 — Horizontal Reduction**;
5. **NCR-5 — Final Cardinality and Semantic Verification**.

NCR-1 must treat the PBC-1 Design and Functional clarifications as active input and fold them into the canonical Design/Functional owners rather than preserving them as an additional permanent documentation layer. NCR-2/NCR-3 do the equivalent for the PBC-1 DD/Implementation clarifications.

## 6. Anti-Circularity Rule

NCR deliberately limits project-management overhead. It uses one control document and one working proposition ledger as needed for execution and verification. Per-pass narrative assurance reports are not required.

Recording or classifying a duplicate is not completion. A duplicate normative restatement must be physically removed or reduced to a valid reference/local binding/local delta.

PBC-1 is the only pre-NCR correction work package. The App-command correction is part of that same work package, not PBC-2. Once it merges and is verified, newly discovered reduction defects are handled within the appropriate NCR pass.

There is no NCR-6 and no successor documentation-rationalisation programme.

## 7. Information Classes and Reading Rule

`assurance/` retains completed audits, reviews and reconciliations. `history/` retains completed/superseded management activity. `decisions/` remains the ADR location. Active root project-management documents provide current navigation, registers and reusable procedure.

For NCR work: read this index and the NCR control; read the normative hierarchy and relevant active clarifications, including PBC-1; use DR ownership/disposition evidence where useful; verify the live repository before each branch. Historical DR records are evidence and shall not be repeatedly rewritten to narrate NCR progress.

## 8. Active and Reusable Root Documents

- `normative-corpus-reduction-programme-v01.md` — NCR execution control and definitive exit criteria;
- `normative-ownership-map-v01.md` — DR-3 index of canonical Design/Functional owners for recurrent invariants;
- `detailed-design-register-v01.md` — current Version 1 DD identity/lifecycle register;
- `active-clarification-register-v01.md` — current navigation across active Design, Functional, DD and Implementation clarifications, including PBC-1;
- `domain-detailed-design-authoring-guide-v02.md` — reusable drafting and hierarchical-reference/readability guidance;
- `documentation-assurance-guide-v01.md` — reusable vertical + horizontal assurance method;
- `README.md` — current-state navigation.

The completed `documentation-corpus-rationalisation-programme-v01.md` remains historical DR programme evidence.

## 9. Continuing Authority Rules

The established normative hierarchy is unchanged. PBC-1 restores omitted/corrected criteria at their proper levels; NCR subsequently consolidates them into canonical primary owners. Project-management records do not become product authority.

NCR does not move authority merely to shorten prose. It removes duplicate statements by referencing the existing correct owner and retaining the consumer's genuine local delta.

Similar naming or data shape does not establish semantic equivalence or justify new generic architecture. Current source remains migration evidence where normative target specifications exist. Future plugin portability does not authorize speculative generic plugin, RPC or cross-language abstractions in Version 1.

## 10. Next Objective

After the PBC-1 App-command correction PR merges and live `master` is independently verified, designate that exact merge SHA the **semantically complete pre-NCR baseline** and begin **NCR-1 — Design and Functional** directly from it.

No additional planning, closeout or assurance package intervenes. Implementation remains paused until NCR-5 satisfies the programme's cardinality and semantic-preservation criteria and the final resulting live `master` is independently verified.