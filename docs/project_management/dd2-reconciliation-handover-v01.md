# AppManager DD-2 Reconciliation Handover

> **Status:** Active project-management handover
>
> **Current baseline:** `master` at `497400e816e2a0990554b2bcf1e90b333c21ddc9`, the merge commit for PR #97.
>
> **Normative effect:** None. Design, Functional and Detailed Design authority remains in the owning normative documents.

## 1. Purpose

This handover records the current DD-2 reconciliation state so later work can continue from verified repository state rather than conversation history or obsolete branch/archive assumptions.

## 2. Mandatory Reading Order

Before continuing reconciliation or moving toward DD-3, read:

1. `docs/project-documentation-guide-v01.md`
2. `docs/appmanager-design-specification-v01.md`
3. `docs/project_management/detailed-design-decomposition-plan-v01.md`
4. `docs/project_management/dd2-independent-review-reconciliation-v01.md`
5. normative documents directly implicated by the task
6. this handover for project-management state

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

Reconciliation preserves these rules:

- delegated specialist execution does not transfer application authority;
- recognition/discovery does not grant mutation authority;
- provider completion does not independently determine AppManager application success;
- managed scope and effective configuration remain governed inputs;
- provider-native models remain below AppManager-oriented contracts;
- provider and implementation replaceability remain explicit;
- implementation topology is not frozen by speculative abstractions;
- similar record shapes do not justify shared semantics without demonstrated semantic identity.

## 5. Completed Reconciliation Findings

### R-01 — Shared outcome contract — RESOLVED

DD-1.2 owns canonical AppManager outcome semantics. DD-1.1 owns invocation mechanics and projection/delivery. Relevant PRs: #87 and #88.

### R-02 — Diagnostic taxonomy — RESOLVED

DD-1.2 owns the broad shared application diagnostic taxonomy. Invocation/capability refinements map into that authority rather than defining competing shared taxonomies.

### R-03 — Nuxt scaffold licence/README ownership — RESOLVED

Nuxt owns layer-creation orchestration/profile intent, not every artefact's semantics or persistence mechanics. Relevant PR: #89.

### R-04 — Bootstrap configuration / managed-project sequence — RESOLVED

The canonical staged dependency is:

```text
invocation / host context
        -> context-independent configuration candidates
        -> bootstrap effective configuration
        -> target-project / managed-project resolution
        -> managed-project context
        -> project/scope-dependent configuration resolution
        -> operation effective-configuration snapshot
        -> managed scope / policy / use-case execution
```

DD-1.3, DD-1.4 and DD-1.5 retain distinct authority.

### R-05 — Structural fact model — RESOLVED / NOT SUSTAINED

Source Intelligence structural facts, Nuxt semantic facts and Documentation projections are deliberately distinct models. A generic `StructuralFact` framework is not justified.

### R-06 — Repository / Source Intelligence relationship — RESOLVED

Repository Capability and Source Intelligence are sibling shared capabilities. There is no mandatory direct dependency or universal shared revision type.

Normative clarification: `docs/detailed_design/repository-source-intelligence-relationship-clarification-v01.md`.

Relevant PR: #96.

### R-07 — App / Settings environment-file ownership — RESOLVED

App owns existing-application initialisation intent, sequencing, delegated-result interpretation and final lifecycle acceptance. Settings owns persisted environment-definition CRUD semantics.

```text
App existing-application initialisation
        -> Settings-owned environment-definition operation
        -> Settings result/evidence
        -> App initialisation interpretation / aggregation
        -> final App outcome
```

Normative clarification: `docs/functional/app-settings-environment-definition-ownership-clarification-v01.md`.

Relevant PR: #97.

### R-08 — stale references/project-management records — RESOLVED PENDING MERGE

Live verification established that:

- the alleged stale future/forthcoming references in current Managed Project/Configuration normative text were not sustained;
- `docs/archive/` is absent from the live repository;
- stale project-management records still treated removed archive material, old PRs/branches, obsolete migration backlogs and an already-fixed defect as current state;
- the previous version of this handover was stale because it still identified R-05 as next and R-06 through R-08 as open.

R-08 therefore corrects project-management state rather than current normative architecture.

A historical archive citation remains in `app_manager/templates/template-repository.json`. It is implementation/data provenance rather than project-management authority and should be handled by later verified implementation/template rationalisation rather than guessed replacement text.

## 6. Documentation Repetition Rule

Use the three-layer rule:

1. canonical invariant — one normative owner;
2. local binding statement — concise reference to that owner where local clarity requires it;
3. domain/capability delta — detailed local semantics only.

## 7. Current Gate

All R-01 through R-08 findings are classified and resolved, with R-08 awaiting merge of its focused cleanup PR.

> **DD-2 RECONCILIATION CLOSEOUT PENDING — DD-3 PAUSED**

After the R-08 PR is merged, perform a final horizontal reconciliation/conformance closeout against the resulting live `master`. Only that closeout should decide whether the DD-2 gate can be lifted.

## 8. Immediate Next Step After R-08 Merge

1. verify the R-08 merge and current `master` SHA;
2. re-read the reconciliation control record and changed project-management files from `master`;
3. perform final horizontal DD-2 conformance/reconciliation verification against the live normative corpus;
4. record the gate decision in a focused project-management closeout/audit update;
5. proceed to DD-3 only if that closeout records a PASS.