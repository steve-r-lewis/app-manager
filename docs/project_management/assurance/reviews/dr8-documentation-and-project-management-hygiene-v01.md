# DR-8 — Documentation and Project-Management Hygiene Review

> **Status:** Complete on DR-8 review branch
>
> **Verified starting baseline:** `a43e1b1af19c64b96f1f479a4c5505f74289c67a`
>
> **Frozen semantic source baseline:** `fe30f5ad883ce2abeca2e495dd4d7036eef09da6`
>
> **Normative product effect:** None.

## 1. Objective

DR-8 addresses low-risk documentation and project-management hygiene only after the semantic/authority packages DR-1 through DR-7 are stable.

The programme names seven candidate areas: compatibility stubs, redundant `.gitkeep`, IS heading conventions, Functional front-matter/modal convention, stable DD-1 rule identifiers, stale clarification tracking and historical-register references.

## 2. Baseline Verification

PR #165 was independently verified closed and merged. Its merge commit is:

`a43e1b1af19c64b96f1f479a4c5505f74289c67a`

Live `master` was independently verified at the same commit before the DR-8 branch was created.

## 3. Read-First Repository Review

DR-8 reviewed the live repository tree, PM current-state index, DR programme, compatibility-pointer pattern, current/historical PM library split, active clarification locations, Detailed Design register, primary IS naming pattern and Functional corpus state.

The review deliberately distinguishes presentational hygiene from semantic change. DR-8 does not rewrite normative bodies merely to make metadata visually uniform.

## 4. Compatibility Stubs

The root `docs/project_management/` directory still contains a set of small compatibility pointers whose substantive records have moved into `assurance/` or `history/`.

The pointer contract says the old path is retained temporarily so existing repository-relative links do not break and explicitly denies normative product effect.

Repository search confirms that current Detailed Designs still reference some legacy paths, including DD-3.2's authoring-control references to the root decomposition plan, v01 authoring guide and DD-3.2 handover. Other DD documents also retain v01 authoring/decomposition-plan references.

**Decision:** retain compatibility pointers in DR-8. Deleting them now would create broken links and reduce compatibility value. A later targeted reference migration may retire them, but that is not required for the DR-9 semantic-equivalence proof.

## 5. Redundant `.gitkeep`

The live tree contains `docs/dd_4_policy_and_resource_domains/.gitkeep` even though the directory contains DD-4.1, DD-4.2, DD-4.3 and DD-4.4.

The placeholder is therefore redundant and was removed.

No other zero-byte implementation/test placeholder is treated as documentation hygiene merely because it is empty.

## 6. IS Heading Convention

Primary Implementation Specifications already use stable H1 identities of the form `IS-<number> — <subject> Implementation Specification` and a stable `Implementation ID` field. Internal section counts differ because each specification has different concrete Level 4 delta.

**Decision:** no rewrite. Uniformity beyond stable identity would be cosmetic churn across large normative documents and would make DR-9 comparison harder without improving authority clarity.

## 7. Functional Front Matter and Modal Convention

Functional files contain some historical metadata/status wording variation. DR-6 established that `FR-*` requirement bodies are the semantic checksum and that corpus-level reading is controlled by the active Functional rationalisation clarification.

**Decision:** no bulk metadata/modal rewrite. The variation is presentational and does not justify touching the Functional requirement baseline immediately before DR-9.

## 8. Stable DD-1 Rule Identifiers

The candidate was tested for a missing stable rule-ID scheme. Current governance already provides stable DD document identities, named contracts, sections and traceability. No approved requirement mandates a second DD-1 rule-ID namespace.

**Decision:** no new identifiers. Introducing them in DR-8 would be documentation-structure design rather than low-risk hygiene and could imply new traceability semantics.

## 9. Clarification Tracking

Clarifications are distributed by their normative level, which is correct, but current navigation required reconstructing their state from directory searches and historical assurance.

DR-8 adds `docs/project_management/active-clarification-register-v01.md`.

The register:

- is explicitly non-normative project-management navigation;
- groups current Functional, DD-1, DD-2, DD-3/DD-4 and Implementation clarifications;
- states that clarification authority comes from the clarified level/scope, not the register;
- defines deliberate lifecycle handling after complete fold-forward.

This resolves the tracking hygiene issue without centralizing semantic authority.

## 10. Historical Register References

The current PM library already separates active root controls from `assurance/` and `history/`. The remaining root stubs have compatibility value because live references remain.

The correct hygiene action is therefore classification, not deletion. Current state remains discoverable through PM README, Detailed Design Register, Implementation Specification register, normative ownership map and the new active clarification register. Historical plans/handovers remain provenance and must not be treated as active work queues.

## 11. Semantic Safety

DR-8 changes no normative product document. It removes only an empty redundant placeholder and adds project-management navigation/assurance records.

No `DD-*`, `FR-*` or `IS-*` identity changes. No active clarification is removed. No compatibility pointer is deleted while active references remain.

## 12. Metrics

Normative product files modified: **0**.

Stable DD/FR/IS identities changed: **0**.

Redundant `.gitkeep` removed: **1**.

Compatibility pointers removed: **0**.

New current-state navigation registers: **1**.

New assurance records: **2** including this review.

Blocking semantic findings: **0**.

## 13. Acceptance

All named DR-8 candidates have been examined and dispositioned. The only proven safe physical deletion is the redundant DD-4 `.gitkeep`; compatibility pointers remain because active references still exist; cosmetic normative rewrites are intentionally avoided; clarification tracking is materially improved without changing authority.

**Result: PASS — DR-8 complete on branch and ready for review/merge.**

After merge and independent live-master verification, proceed to **DR-9 — Semantic Equivalence and Lean-Baseline Verification**.