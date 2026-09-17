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

The Version 1 Design, Functional, Detailed Design and Implementation Specification corpus has been authored through Level 4. DR — Documentation Rationalisation is closed and NCR — Normative Corpus Reduction is established but paused while bounded PBC-1 semantic baseline corrections are completed.

PR #170 restored Version 1 GUI/interaction/portability criteria. PR #171 corrected the App command surface. PR #172 corrected the Nuxt command surface. PR #173 reclassified `utils` as `maintenance`. PR #174 restored the broader project-side AI development-environment requirement and merged to live `master` at `eff7212ab9a44e0889d81d21964618344ae9927b`.

The final Git-domain sanity review then identified one remaining semantic omission: `git.commit` was still restricted to a single repository even though AppManager's root-plus-managed-layers model and the accepted automated bulk-commit workflow require deliberately coordinated commits over selected or all eligible managed repositories. PBC-1 therefore remains open for this final Git correction before NCR.

**Current phase:** PBC-1 coordinated Git commit correction in progress. NCR remains paused until this correction merges and live `master` is independently verified.

## 3. Baseline Roles

| Baseline | SHA | Role |
|---|---|---|
| Pre-DR semantic comparison baseline | `fe30f5ad883ce2abeca2e495dd4d7036eef09da6` | Immutable historical evidence source used by DR semantic accounting. |
| DR-9 semantic-equivalence checkpoint | `bf6d01b3fdf2df3bf373b352ee5ee92ae681a8d7` | Verified semantic-equivalence result before formal DR closeout. |
| Post-DR / pre-PBC reconciled checkpoint | `8d647309e29883922a04eefe01849bd3eb15937f` | Historical comparison checkpoint. |
| NCR-control checkpoint | `1268c9c1036637556386ebb3f3ba21029877df33` | PR #169 merge establishing NCR control. |
| PBC-1 interaction/portability checkpoint | `eacb032fbb7c41bd7479c9d781eb68231a18fe73` | PR #170 merge. |
| PBC-1 App-command checkpoint | `d36445a560e09f6f9ba6d16a12fb5b53bb6629c7` | PR #171 merge. |
| PBC-1 Nuxt-command checkpoint | `5f8b640f6b27f3ed486a711a53413ab1a6ad455a` | PR #172 merge. |
| PBC-1 Maintenance checkpoint | `a1f25d37409872b2d3312eecbd98257b754613af` | Verified PR #173 merge. |
| PBC-1 AI project-environment checkpoint | `eff7212ab9a44e0889d81d21964618344ae9927b` | Verified PR #174 merge; base for coordinated Git commit correction. |
| Semantically complete pre-NCR baseline | **pending coordinated Git commit correction merge verification** | Exact live `master` SHA after the final PBC-1 Git correction. |

No current commit is designated the final lean implementation documentation baseline; that remains deferred until NCR-5 passes.

## 4. PBC-1 — Pre-NCR Baseline Correction

PBC-1 is one bounded pre-NCR semantic correction work package, not a successor documentation programme.

The corrected command counts remain:

| Domain | Canonical commands |
|---|---:|
| App | 8 |
| Git | 8 |
| Nuxt | 13 |
| Docs | 13 |
| Quality | 10 |
| Settings | 18 |
| AI | 22 |
| Maintenance | 4 |
| **Total** | **96** |

The AI correction restored project-side management of instructions, prompts, agents, skills, tool integrations and AI policy, plus aggregate `ai.inspect`. It preserves the separate AI Capability used by any owning domain for bounded inference/generation. AI-generated output remains non-authoritative proposal data, but a previously authorised owning workflow may automatically accept validated output under deterministic policy.

The Git correction applies that accepted automation model to canonical `git.commit`: one invocation may deliberately target a selected managed-repository set or all eligible managed repositories, with independent per-repository staging, message resolution, commit effects and outcomes. No `git.commit-all` command is added; Git remains at eight commands and the catalogue remains 96. Coordinated commit is explicitly non-transactional across repositories and preserves truthful partial completion.

The Maintenance stronger-owner rule remains unchanged. The earlier `command-ownership-review-v01.md` remains evidence for the 78-command Maintenance review; later AI and Git corrections supersede only the affected command semantics/cardinality evidence described above.

PBC-1 clarifications are temporary integration vehicles. NCR shall fold their semantics into canonical primary owners and retire them.

## 5. NCR — Established, Execution Pending PBC-1 Completion

NCR's objective remains: every independently meaningful normative proposition has exactly one complete canonical statement at its correct normative owner; other occurrences are references, necessary local bindings or genuine local deltas.

Execution remains:

1. NCR-1 — Design and Functional;
2. NCR-2 — Detailed Design;
3. NCR-3 — Implementation Specifications;
4. NCR-4 — Horizontal Reduction;
5. NCR-5 — Final Cardinality and Semantic Verification.

NCR-1/2/3 shall fold all PBC-1 clarification deltas, including interaction/portability, App, Nuxt, Maintenance, AI project-environment and coordinated Git commit corrections, into their primary normative owners and retire the temporary clarification layer.

## 6. Anti-Circularity Rule

PBC-1 remains the only pre-NCR correction work package. The coordinated Git commit correction was discovered by the authorised final Git-domain sanity review and is incorporated into PBC-1 rather than creating PBC-2. No PBC closeout programme, NCR-6 or successor rationalisation programme is planned.

Recording/classifying a duplicate is not completion; NCR must physically remove duplicate normative restatement or reduce it to a valid reference/local binding/local delta.

## 7. Information Classes and Reading Rule

`assurance/` retains completed audits/reviews/reconciliations; `history/` retains superseded management activity; `decisions/` remains the ADR location. Active root PM documents provide current navigation/control.

For NCR: read this index and NCR control; read the normative hierarchy and active clarifications; verify live repository state before each branch.

## 8. Active and Reusable Root Documents

- `normative-corpus-reduction-programme-v01.md` — NCR execution control;
- `normative-ownership-map-v01.md` — canonical Design/Functional ownership index;
- `detailed-design-register-v01.md` — Version 1 DD lifecycle register;
- `active-clarification-register-v01.md` — active clarification navigation;
- `command-ownership-review-v01.md` — Maintenance stronger-owner assessment at the 78-command checkpoint;
- `domain-detailed-design-authoring-guide-v02.md` — DD authoring guidance;
- `documentation-assurance-guide-v01.md` — assurance method;
- `README.md` — current-state navigation.

## 9. Continuing Authority Rules

The established normative hierarchy is unchanged. Project-management records do not become product authority. Similar naming or data shape does not establish semantic equivalence. Maintenance remains bounded and must not become a catch-all namespace. AI Domain ownership follows project-side AI-environment intent; AI Capability use does not transfer another domain's primary intent or authority. Coordinated Git commit remains Git-owned application intent over DD-1-managed scope; Repository Capability and AI Capability remain subordinate specialist capabilities.

## 10. Next Objective

After the PBC-1 coordinated Git commit correction merges and live `master` is independently verified, designate that exact merge SHA the **semantically complete pre-NCR baseline** and begin **NCR-1 — Design and Functional** directly from it.

No additional planning, closeout or assurance package intervenes.