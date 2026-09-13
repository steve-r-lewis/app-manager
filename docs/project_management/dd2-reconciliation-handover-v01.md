# AppManager DD-2 Reconciliation Handover

> **Status:** Active project-management handover
>
> **Verified closeout baseline:** `master` at `f2901eedce70c467fc3f52c6608fee437d2ac30b`, the merge commit for PR #98.
>
> **Normative effect:** None. Design, Functional and Detailed Design authority remains in the owning normative documents.

## 1. Purpose

This handover records the DD-2 reconciliation closeout state so later work can continue from verified repository state rather than conversation history or obsolete branch/archive assumptions.

## 2. Mandatory Reading Order

Before beginning DD-3, read:

1. `docs/project-documentation-guide-v01.md`
2. `docs/appmanager-design-specification-v01.md`
3. `docs/project_management/detailed-design-decomposition-plan-v01.md`
4. `docs/project_management/dd2-independent-review-reconciliation-v01.md`
5. `docs/project_management/dd2-final-horizontal-reconciliation-conformance-closeout-v01.md`
6. normative Functional and Detailed Design documents directly implicated by the DD-3 domain being designed
7. this handover for project-management state

The removed `docs/archive/` tree is not required reading and is not current design authority.

## 3. Repository Workflow

For each focused task:

- verify current `master` and relevant PR state;
- create a fresh `ai/...` branch from that verified baseline;
- keep changes focused;
- inspect live normative documents before accepting historical findings;
- compare the task branch against its verified base;
- open a focused PR;
- stop at the requested task boundary.

Approved architecture must come from the normative specifications, not from implementation shape.

## 4. Architectural Invariants

Future DD-3 work shall preserve these reconciled rules:

- delegated specialist execution does not transfer application authority;
- recognition/discovery does not grant mutation authority;
- provider completion does not independently determine AppManager application success;
- managed scope and effective configuration remain governed inputs;
- provider-native models remain below AppManager-oriented contracts;
- provider and implementation replaceability remain explicit;
- implementation topology is not frozen by speculative abstractions;
- similar record shapes do not justify shared semantics without demonstrated semantic identity;
- domain orchestration consumes shared DD-1/DD-2 contracts rather than recreating them.

## 5. Reconciliation Result

R-01 through R-08 are resolved:

- R-01 — shared outcome contract: resolved;
- R-02 — diagnostic taxonomy: resolved;
- R-03 — Nuxt scaffold artefact ownership: resolved;
- R-04 — bootstrap configuration / managed-project sequence: resolved;
- R-05 — structural fact model: resolved, allegation not sustained;
- R-06 — Repository / Source Intelligence relationship: resolved;
- R-07 — App / Settings environment-definition ownership: resolved;
- R-08 — stale references/project-management records: resolved through PR #98.

The final horizontal verification is recorded in:

`docs/project_management/dd2-final-horizontal-reconciliation-conformance-closeout-v01.md`

Its result is **PASS**.

## 6. Documentation Repetition Rule

Use the three-layer rule:

1. canonical invariant — one normative owner;
2. local binding statement — concise reference to that owner where local clarity requires it;
3. domain/capability delta — detailed local semantics only.

DD-3 documents should therefore concentrate on domain-specific orchestration and policy rather than restating complete DD-1/DD-2 contracts.

## 7. Gate

The final closeout records:

> **PASS — DD-2 RECONCILIATION CLOSED; DD-3 DOMAIN DETAILED DESIGN MAY BEGIN AFTER THE CLOSEOUT PR IS MERGED.**

Until that focused closeout PR is merged, `master` still carries the previous paused project-management state. Do not begin a DD-3 repository edit from the closeout branch or assume merge completion.

After merge, verify the new live `master` SHA and create a fresh DD-3 branch.

## 8. Next Phase

The approved decomposition plan defines DD-3 as Domain Orchestration Detailed Design.

The domain document family is:

```text
docs/detailed_design/app-domain-detailed-design-v01.md
docs/detailed_design/git-domain-detailed-design-v01.md
docs/detailed_design/nuxt-domain-detailed-design-v01.md
docs/detailed_design/docs-domain-detailed-design-v01.md
docs/detailed_design/quality-domain-detailed-design-v01.md
docs/detailed_design/settings-domain-detailed-design-v01.md
docs/detailed_design/ai-domain-detailed-design-v01.md
docs/detailed_design/utils-domain-detailed-design-v01.md
```

For each domain, answer four questions:

1. Which Functional requirements does the domain own?
2. Which DD-1 Application Core contracts does it consume?
3. Which DD-2 shared capabilities does it coordinate?
4. What permanent domain-specific orchestration, state, policy or result contracts remain after shared concerns are removed?

The final all-Detailed-Design conformance audit remains future work after the DD-3 domain family is complete.