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

The Version 1 Design, Functional, Detailed Design and Implementation Specification corpus has been authored through Level 4. DR — Documentation Rationalisation is closed. PBC-1 — Pre-NCR Baseline Correction is complete. NCR — Normative Corpus Reduction is established and ready to execute.

PRs #170–#177 completed the bounded PBC-1 semantic corrections: Version 1 GUI/interaction/portability restoration; App command correction; Nuxt command correction; `utils` to `maintenance` reclassification; broader project-side AI development-environment restoration; coordinated multi-repository `git.commit`; coordinated multi-target/multi-artefact Docs generation/update; and coordinated multi-resource Maintenance validation/repair/source-version/cleanup semantics.

PR #177 merged and live `master` was independently verified at `0d96d6e0123072e8b2f57bfa25bd8f6554edfc19`. That exact SHA is the **semantically complete pre-NCR baseline**.

The final cross-domain bulk-action sanity review found no additional correction required for App, Nuxt, Quality, Settings or AI. PBC-1 is therefore closed as a semantic baseline-correction activity; its temporary normative clarification vehicles remain active only as inputs to NCR integration and retirement.

**Current phase:** NCR control re-baselining to the semantically complete pre-NCR checkpoint, immediately followed by NCR-1 — Design and Functional.

## 3. Baseline Roles

| Baseline | SHA | Role |
|---|---|---|
| Pre-DR semantic comparison baseline | `fe30f5ad883ce2abeca2e495dd4d7036eef09da6` | Immutable historical evidence source used by DR semantic accounting. |
| DR-9 semantic-equivalence checkpoint | `bf6d01b3fdf2df3bf373b352ee5ee92ae681a8d7` | Verified semantic-equivalence result before formal DR closeout. |
| Post-DR / pre-PBC reconciled checkpoint | `8d647309e29883922a04eefe01849bd3eb15937f` | Historical comparison checkpoint; original NCR planning baseline. |
| NCR-control checkpoint | `1268c9c1036637556386ebb3f3ba21029877df33` | PR #169 merge establishing NCR control. |
| PBC-1 interaction/portability checkpoint | `eacb032fbb7c41bd7479c9d781eb68231a18fe73` | PR #170 merge. |
| PBC-1 App-command checkpoint | `d36445a560e09f6f9ba6d16a12fb5b53bb6629c7` | PR #171 merge. |
| PBC-1 Nuxt-command checkpoint | `5f8b640f6b27f3ed486a711a53413ab1a6ad455a` | PR #172 merge. |
| PBC-1 Maintenance-reclassification checkpoint | `a1f25d37409872b2d3312eecbd98257b754613af` | PR #173 merge. |
| PBC-1 AI project-environment checkpoint | `eff7212ab9a44e0889d81d21964618344ae9927b` | PR #174 merge. |
| PBC-1 coordinated Git checkpoint | `f9679e61f2cf613a46100fac88ec70c23970309d` | PR #175 merge. |
| PBC-1 coordinated Docs checkpoint | `a56bface1cef5518112961fabe9c62f4147ee436` | PR #176 merge. |
| **Semantically complete pre-NCR baseline** | **`0d96d6e0123072e8b2f57bfa25bd8f6554edfc19`** | **Verified PR #177 merge; authoritative NCR working and semantic-preservation comparison baseline.** |

No current commit is designated the final lean implementation documentation baseline; that remains deferred until NCR-5 passes.

## 4. PBC-1 — Complete

PBC-1 was one bounded pre-NCR semantic correction work package, not a successor documentation programme. Its final command counts are:

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

The AI correction restored project-side management of instructions, prompts, agents, skills, tool integrations and AI policy, plus aggregate `ai.inspect`, while preserving the separate AI Capability consumed by owning workflows. AI-generated output remains non-authoritative proposal data, but a previously authorised owning workflow may automatically accept validated output under deterministic policy.

The Git correction applies that automation model to canonical `git.commit`: one invocation may deliberately target a selected managed-repository set or all eligible managed repositories, with independent per-repository staging, message resolution, commit effects and outcomes. No `git.commit-all` command was added.

The Docs correction applies the same scope-versus-command principle to documentation production. One Docs intent may resolve multiple semantic documentation targets and plan multiple artefacts. Each artefact independently resolves generation, authorised update, no-effect/refusal or unresolved disposition; deterministic non-AI production remains supported; AI enrichment remains subordinate proposal data; completed effects remain truthful under later failure/cancellation.

The Maintenance correction applies structured cardinality to its four operations. Header validation may inspect a selected or complete eligible managed source-header set; repair and source-version maintenance use bounded per-resource transformation plans; cleanup deletes only positively classified disposable Maintenance artefacts. Discovery/globs/filesystem reachability never become mutation authority and the stronger-owner rule remains mandatory. No AI dependency was introduced.

PBC-1 clarification documents are temporary integration vehicles. Their semantics are part of the `0d96d6e...` baseline and must be preserved while NCR folds them into canonical primary owners and retires the temporary clarification layer.

## 5. NCR — Ready for Execution

NCR's objective remains: every independently meaningful normative proposition has exactly one complete canonical statement at its correct normative owner; other occurrences are references, necessary local bindings or genuine local deltas.

The five-pass decomposition remains unchanged after re-evaluation against the complete semantic baseline:

1. NCR-1 — Design and Functional;
2. NCR-2 — Detailed Design;
3. NCR-3 — Implementation Specifications;
4. NCR-4 — Horizontal Reduction;
5. NCR-5 — Final Cardinality and Semantic Verification.

NCR-1/2/3 shall fold all PBC-1 clarification deltas into their primary normative owners at the corresponding hierarchy level and retire the temporary clarification vehicles when fully accounted. NCR-4 shall ensure no clarification survives as duplicate normative restatement. NCR-5 shall prove semantic preservation against `0d96d6e0123072e8b2f57bfa25bd8f6554edfc19`.

## 6. Anti-Circularity Rule

There is no PBC-2, PBC closeout programme, NCR-0, NCR-6 or successor rationalisation programme. The semantic baseline is frozen for NCR.

Recording/classifying a duplicate is not completion; NCR must physically remove duplicate normative restatement or reduce it to a valid reference/local binding/local delta. Reduction does not reopen settled architecture merely because integrated wording differs. An actual contradiction, semantic-loss defect or unresolved authoritative conflict is corrected within NCR under the existing hierarchy rather than spawning another programme.

## 7. Information Classes and Reading Rule

`assurance/` retains completed audits/reviews/reconciliations; `history/` retains superseded management activity; `decisions/` remains the ADR location. Active root PM documents provide current navigation/control.

For NCR: read this index and NCR control; read the normative hierarchy and active clarifications; verify live repository state before each branch.

## 8. Active and Reusable Root Documents

- `normative-corpus-reduction-programme-v01.md` — NCR execution control;
- `normative-ownership-map-v01.md` — canonical Design/Functional ownership index;
- `detailed-design-register-v01.md` — Version 1 DD lifecycle register;
- `active-clarification-register-v01.md` — active clarification navigation;
- `command-ownership-review-v01.md` — retained PBC-1 Maintenance stronger-owner assessment at the 78-command checkpoint;
- `domain-detailed-design-authoring-guide-v02.md` — DD authoring guidance;
- `documentation-assurance-guide-v01.md` — assurance method;
- `README.md` — current-state navigation.

## 9. Continuing Authority Rules

The established normative hierarchy is unchanged. Project-management records do not become product authority. Similar naming or data shape does not establish semantic equivalence. Maintenance remains bounded and must not become a catch-all namespace. AI Domain ownership follows project-side AI-environment intent; AI Capability use does not transfer another domain's primary intent or authority. Coordinated Git commit remains Git-owned application intent over DD-1-managed scope. Coordinated Docs generation/update remains Docs-owned intent over DD-1-managed documentation scope. Coordinated Maintenance remains Maintenance-owned intent over DD-1-managed scope further narrowed by operation-specific eligibility and the stronger-owner gate. Shared capabilities remain subordinate specialists.

## 10. Next Objective

Complete this administrative NCR baseline-control correction, merge it, independently verify live `master`, and begin **NCR-1 — Design and Functional** directly from that verified state.

No additional planning, closeout or assurance package intervenes.
