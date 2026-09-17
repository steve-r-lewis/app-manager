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

The Version 1 Design, Functional, Detailed Design and Implementation Specification corpus has been authored through Level 4. DR — Documentation Rationalisation is closed and NCR — Normative Corpus Reduction is established but paused while the bounded PBC-1 semantic baseline corrections are completed.

PR #170 restored Version 1 GUI/interaction/portability criteria. PR #171 corrected the App command surface. PR #172 corrected the corresponding Nuxt command surface and merged to live `master` at `5f8b640f6b27f3ed486a711a53413ab1a6ad455a`.

The final command-ownership review identified that `utils` is an ambiguous catch-all domain name. All 78 canonical commands were assessed against a stronger-owner rule. The only required ownership correction is reclassification of the four-command `utils` domain as the semantically bounded `maintenance` domain; no command from another semantic domain requires relocation.

**Current phase:** PBC-1 Maintenance-domain reclassification and 78-command ownership review in progress. NCR remains paused until this correction merges and live `master` is independently verified.

## 3. Baseline Roles

| Baseline | SHA | Role |
|---|---|---|
| Pre-DR semantic comparison baseline | `fe30f5ad883ce2abeca2e495dd4d7036eef09da6` | Immutable historical evidence source used by DR semantic accounting. |
| DR-9 semantic-equivalence checkpoint | `bf6d01b3fdf2df3bf373b352ee5ee92ae681a8d7` | Verified semantic-equivalence result before formal DR closeout. |
| Post-DR / pre-PBC reconciled checkpoint | `8d647309e29883922a04eefe01849bd3eb15937f` | Historical comparison checkpoint. |
| NCR-control checkpoint | `1268c9c1036637556386ebb3f3ba21029877df33` | PR #169 merge establishing NCR control. |
| PBC-1 interaction/portability checkpoint | `eacb032fbb7c41bd7479c9d781eb68231a18fe73` | PR #170 merge. |
| PBC-1 App-command checkpoint | `d36445a560e09f6f9ba6d16a12fb5b53bb6629c7` | PR #171 merge. |
| PBC-1 Nuxt-command checkpoint | `5f8b640f6b27f3ed486a711a53413ab1a6ad455a` | Verified PR #172 merge; base for Maintenance review. |
| Semantically complete pre-NCR baseline | **pending Maintenance-domain correction merge verification** | Exact live `master` SHA after the final PBC-1 command-ownership correction. |

No current commit is designated the final lean implementation documentation baseline; that remains deferred until NCR-5 passes.

## 4. PBC-1 — Pre-NCR Baseline Correction

PBC-1 is one bounded pre-NCR semantic correction work package, not a successor documentation programme.

The corrected command counts are:

| Domain | Canonical commands |
|---|---:|
| App | 8 |
| Git | 8 |
| Nuxt | 13 |
| Docs | 13 |
| Quality | 10 |
| Settings | 18 |
| AI | 4 |
| Maintenance | 4 |
| **Total** | **78** |

The four Maintenance identities are:

```text
maintenance.headers.validate
maintenance.headers.repair
maintenance.source-version.maintain
maintenance.cleanup
```

They replace the corresponding `utils.*` identities. `utils` ceases to be a canonical Version 1 domain identifier.

The governing rule is: Maintenance owns explicit project-maintenance intent only when no stronger product domain owns the maintained semantic object/policy. App clean/reset, Nuxt cleanup/upgrade, Git maintenance, Docs update, Settings deletion/update and AI instruction replacement/deletion therefore remain with their stronger semantic owners.

The working evidence is `command-ownership-review-v01.md`, which accounts for 78/78 canonical identities and records 0 cross-domain relocations, 0 additions, 0 removals and 4 identity renames under the domain rename.

PBC-1 clarifications are temporary integration vehicles. NCR shall fold their semantics into canonical primary owners and retire them.

## 5. NCR — Established, Execution Pending PBC-1 Completion

NCR's objective remains: every independently meaningful normative proposition has exactly one complete canonical statement at its correct normative owner; other occurrences are references, necessary local bindings or genuine local deltas.

Execution remains:

1. NCR-1 — Design and Functional;
2. NCR-2 — Detailed Design;
3. NCR-3 — Implementation Specifications;
4. NCR-4 — Horizontal Reduction;
5. NCR-5 — Final Cardinality and Semantic Verification.

NCR-1/2/3 shall fold all PBC-1 clarification deltas, including Maintenance naming/boundary, into their primary normative owners and retire the temporary clarification layer.

## 6. Anti-Circularity Rule

PBC-1 is the only pre-NCR correction work package. The interaction, App, Nuxt and Maintenance command corrections are all part of it. No PBC-2, PBC closeout programme, NCR-6 or successor rationalisation programme is planned.

Recording/classifying a duplicate is not completion; NCR must physically remove duplicate normative restatement or reduce it to a valid reference/local binding/local delta.

## 7. Information Classes and Reading Rule

`assurance/` retains completed audits/reviews/reconciliations; `history/` retains superseded management activity; `decisions/` remains the ADR location. Active root PM documents provide current navigation/control.

For NCR: read this index and NCR control; read the normative hierarchy and active clarifications; use the 78-command ownership review as PBC-1 evidence; verify live repository state before each branch.

## 8. Active and Reusable Root Documents

- `normative-corpus-reduction-programme-v01.md` — NCR execution control;
- `normative-ownership-map-v01.md` — canonical Design/Functional ownership index;
- `detailed-design-register-v01.md` — Version 1 DD lifecycle register;
- `active-clarification-register-v01.md` — active clarification navigation;
- `command-ownership-review-v01.md` — complete 78-command stronger-owner assessment;
- `domain-detailed-design-authoring-guide-v02.md` — DD authoring guidance;
- `documentation-assurance-guide-v01.md` — assurance method;
- `README.md` — current-state navigation.

## 9. Continuing Authority Rules

The established normative hierarchy is unchanged. Project-management records do not become product authority. Similar naming or data shape does not establish semantic equivalence. Maintenance is specifically bounded and must not become a new catch-all namespace.

## 10. Next Objective

After the PBC-1 Maintenance-domain correction merges and live `master` is independently verified, designate that exact merge SHA the **semantically complete pre-NCR baseline** and begin **NCR-1 — Design and Functional** directly from it.

No additional planning, closeout or assurance package intervenes.