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

The Version 1 Design, Functional, Detailed Design and Implementation Specification corpus has been authored through Level 4. DR — Documentation Rationalisation is closed. PBC-1 — Pre-NCR Baseline Correction is complete. NCR-1 — Design and Functional is complete and merged in PR #179 at `b041d440faf032b2954e5a8be2fbc7894988717f`. NCR-2 — Detailed Design is complete and merged in [PR #180](https://github.com/steve-r-lewis/app-manager/pull/180) at `33024e4346cc14de94e1a02d4357f50e95b5d7de`. NCR-3/4/5 are superseded (§5, §10).

PRs #170–#177 completed the bounded PBC-1 semantic corrections: Version 1 GUI/interaction/portability restoration; App command correction; Nuxt command correction; `utils` to `maintenance` reclassification; broader project-side AI development-environment restoration; coordinated multi-repository `git.commit`; coordinated multi-target/multi-artefact Docs generation/update; and coordinated multi-resource Maintenance validation/repair/source-version/cleanup semantics.

PR #177 merged and live `master` was independently verified at `0d96d6e0123072e8b2f57bfa25bd8f6554edfc19`. That exact SHA is the **semantically complete pre-NCR baseline**.

The final cross-domain bulk-action sanity review found no additional correction required for App, Nuxt, Quality, Settings or AI. PBC-1 is therefore closed as a semantic baseline-correction activity; its Design/Functional clarification vehicles have now been integrated and retired by NCR-1. NCR-2 has integrated and retired all seventeen DD vehicles; the primary-DD physical reduction and final verification are complete and merged via PR #180. Implementation-level clarification vehicles remain active pending direct-edit integration (§10).

**Current phase:** Documentation Compression and Modularisation, superseding NCR-3/4/5 (§5, §10). Implementation remains paused until that initiative's exit criteria pass and live `master` is verified.

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
| **Semantically complete pre-NCR baseline** | **`0d96d6e0123072e8b2f57bfa25bd8f6554edfc19`** | **Verified PR #177 merge; immutable NCR semantic-preservation comparison baseline.** |
| NCR-1 merged / NCR-2 physical starting baseline | `b041d440faf032b2954e5a8be2fbc7894988717f` | Independently verified live `origin/master`; PR #179 merged and closed. |
| **NCR-2 merged / NCR-3 starting baseline** | **`33024e4346cc14de94e1a02d4357f50e95b5d7de`** | **Independently verified live `origin/master`; PR #180 merged and closed.** |

No current commit is designated the final lean implementation documentation baseline; that remains deferred until the Documentation Compression and Modularisation initiative's exit criteria pass (§10).

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

PBC-1 clarification documents are temporary integration vehicles. Their semantics are part of the `0d96d6e...` baseline and must be preserved while direct-edit work packages fold them into canonical primary owners and retire the temporary clarification layer (§10).

## 5. NCR — Execution State

NCR-1 (Design and Functional) and NCR-2 (Detailed Design) are complete and merged (PR #179, PR #180).

NCR-3 (Implementation Specifications), NCR-4 (Horizontal Reduction) and NCR-5 (Final Cardinality and Semantic Verification) are **superseded** by the Documentation Compression and Modularisation initiative (§10). The objective they shared is unchanged — every independently meaningful normative proposition has exactly one complete canonical statement at its correct owner, and semantics are preserved against `0d96d6e0123072e8b2f57bfa25bd8f6554edfc19` — but execution now proceeds as ordinary reviewed PRs against [Documentation Guide §16](../project-documentation-guide-v01.md#_16-avoiding-duplication), without a dedicated ledger or per-pass audit trail.

## 6. Anti-Circularity Rule

There is no PBC-2, PBC closeout programme, NCR-0, NCR-6, successor rationalisation programme, or second compression initiative alongside the one in §10. A defect found later is corrected directly in the affected document, not by opening a new programme.

Recording/classifying a duplicate is not completion; reduction work must physically remove duplicate normative restatement or reduce it to a valid reference/local binding/local delta rather than merely recording that it should be. Reduction does not reopen settled architecture merely because integrated wording differs. An actual contradiction, semantic-loss defect or unresolved authoritative conflict is corrected directly under the existing hierarchy rather than spawning another programme.

## 7. Information Classes and Reading Rule

`assurance/` retains completed audits/reviews/reconciliations; `history/` retains superseded management activity; `decisions/` remains the ADR location. Active root PM documents provide current navigation/control.

Before starting work, read this README's current state (§2, §10) and the specific document(s) the task touches. Reading the full normative hierarchy or clarification register first is not required.

## 8. Active and Reusable Root Documents

- `normative-corpus-reduction-programme-v01.md` — NCR-1/NCR-2 execution record; NCR-3/4/5 superseded (§5), core rules carried forward into the Documentation Guide;
- `ncr-working-proposition-ledger-v01.md` — single NCR execution and verification ledger;
- `normative-ownership-map-v01.md` — canonical Design/Functional ownership index;
- `detailed-design-register-v01.md` — Version 1 DD lifecycle register;
- `active-clarification-register-v01.md` — active clarification navigation;
- `command-ownership-review-v01.md` — retained PBC-1 Maintenance stronger-owner assessment at the 78-command checkpoint;
- `domain-detailed-design-authoring-guide-v02.md` — DD authoring guidance;
- `documentation-assurance-guide-v01.md` — assurance method;
- `README.md` — current-state navigation.

## 9. Continuing Authority Rules

The established normative hierarchy is unchanged. Project-management records do not become product authority. Similar naming or data shape does not establish semantic equivalence. Maintenance remains bounded and must not become a catch-all namespace. AI Domain ownership follows project-side AI-environment intent; AI Capability use does not transfer another domain's primary intent or authority. Coordinated Git commit remains Git-owned application intent over DD-1-managed scope. Coordinated Docs generation/update remains Docs-owned intent over DD-1-managed documentation scope. Coordinated Maintenance remains Maintenance-owned intent over DD-1-managed scope further narrowed by operation-specific eligibility and the stronger-owner gate. Shared capabilities remain subordinate specialists.

## 10. Current Work

**Documentation Compression and Modularisation** supersedes NCR-3/4/5 (§5). It targets the same objective — one canonical statement per proposition, semantics preserved, human comprehensibility co-equal with brevity — plus two additions NCR did not require: every Detailed Design/Implementation Specification pair usable as a self-contained module by a reader or coding agent who has only read the shared primer, and no dedicated ledger or audit trail beyond the ordinary PR record.

Four phases, each executed as ordinary reviewed PRs against the physical starting baseline in §3 (`33024e4346cc14de94e1a02d4357f50e95b5d7de`):

1. **Governance cleanup** — retire the process that generated the bloat (this entry, the Documentation Guide's duplication/clarification rules) — in progress.
2. **Module contract** — define what a self-contained DD/IS module may assume from the shared primer versus what it must state locally — not started.
3. **Compression sweep** — apply the module contract corpus-wide — not started.
4. **Continuous semantic verification** — a before/after check in each compression PR's own description; not a separate audit programme — applies from phase 3 onward.

Implementation remains paused until phase 4 confirms no semantic loss against `0d96d6e0123072e8b2f57bfa25bd8f6554edfc19` and live `master` is verified.
