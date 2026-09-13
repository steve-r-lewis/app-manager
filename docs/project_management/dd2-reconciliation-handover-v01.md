# AppManager DD-2 Reconciliation Handover

> **Status:** Version 1 project-management handover checkpoint
>
> **Purpose:** Durable session handover for continuation of the independent DD-2 documentation reconciliation
>
> **Baseline:** `master` at `1820c1d71c0474798941ab4783e05a54b0e846aa`, the merge commit for PR #93
>
> **Active control record:** `docs/project_management/dd2-independent-review-reconciliation-v01.md`
>
> **Normative effect:** None. This document records current repository state, settled decisions, active reconciliation work and the next bounded task. It does not replace the normative Design, Functional or Detailed Design specifications.

## 1. How to Use This Handover

This document is the preferred entry point for the next AI/human working session continuing the DD-2 reconciliation.

It is a **navigation, state, invariant and continuation document**, not a conversational transcript and not a new design authority.

A fresh session should:

1. verify that current `master` is at or after the baseline recorded above;
2. verify the current state of any PRs named in this handover rather than assuming temporary GitHub state remains unchanged;
3. read this handover first;
4. read the active reconciliation record before changing normative documents;
5. inspect only the normative documents required for the immediate reconciliation item;
6. treat the summaries here as navigation aids rather than substitutes for normative wording;
7. preserve already-settled ownership and authority decisions unless new evidence demonstrates a contradiction;
8. create a new `ai/<purpose>` session branch from current `master` before editing;
9. use focused corrective PRs rather than editing `master` directly;
10. continue with the immediate next task in Section 12.

A fresh session should not reload the entire historical conversation or repository indiscriminately. The repository is the durable project memory; the conversation is temporary working context.

## 2. Current Project Gate

The project is in an independent horizontal reconciliation of the previously completed DD-2 Shared Capability Detailed Design phase.

The original DD-2 conformance audit was merged in PR #85, but its clean PASS was subsequently challenged by an independent documentation review that identified cross-document inconsistencies not found by the earlier vertically-oriented audit.

The active gate is therefore:

> **DD-2 RECONCILIATION ACTIVE — DD-3 PAUSED**

DD-3 shall not resume until all material R-01 through R-08 findings are classified, confirmed defects/clarifications are resolved, and the final cross-document audit records the resulting state.

## 3. Documentation Authority

The documentation hierarchy remains:

```text
Project Documentation Guide
        |
        v
Root Design Specification
        |
        v
Functional Specifications
        |
        v
Detailed Design Specifications
        |
        v
Implementation Specifications
        |
        v
Implementation
```

ADRs provide orthogonal decision provenance. Project-management documents, including this handover and the reconciliation record, own temporary status, sequencing, audits, handover and coordination; they do not override normative specifications.

The architecture must remain implementation-topology independent unless an accepted architectural decision says otherwise. Detailed Design defines durable semantic responsibilities/contracts; absence of a TypeScript class diagram or literal interface listing is not by itself a conformance defect.

## 4. Architectural Invariants That Must Not Drift

The central invariant remains:

> **Delegated specialist execution does not transfer application authority.**

The permanent conceptual direction is:

```text
Application Invocation Contract
        -> Application Engine authority
        -> application/domain use-case coordination
        -> AppManager-owned capabilities / capability boundaries
        -> specialist providers or tools
        -> technical evidence/results
        -> owning-use-case interpretation
        -> canonical AppManager outcome
        -> invocation/presentation projection
```

Preserve these distinctions:

- provider/capability completion is evidence, not automatically AppManager success;
- discovery/recognition is not managed scope, targetability or mutation authority;
- managed scope is not configuration authority;
- configuration resolution is not application policy or authorization;
- validation stages remain intentionally distinct where they answer different semantic questions;
- cancellation does not imply rollback;
- known effects survive failure, partial success and cancellation reporting;
- domains organize use cases and intent; they are not automatically autonomous implementation subsystems;
- provider models remain below AppManager-oriented capability contracts;
- future implementation replaceability must not be achieved through speculative generic frameworks.

## 5. Independent Review and Reconciliation Control

The independent review produced two external working documents:

- `20260913-1532-appmanager-docs-merged-review.md` — merged findings and corrective action plan;
- `20260913-1534-appmanager-docs-action-plan-updated.md` — operational corrective action plan.

Those documents are evidence/challenge material, not repository design authority. Every allegation must be checked against the current live repository before normative changes are made.

The durable repository control record is:

`docs/project_management/dd2-independent-review-reconciliation-v01.md`

It classifies challenged findings as:

1. **confirmed defect**;
2. **clarification required**;
3. **not sustained**.

It also adopts horizontal checks for single semantic ownership, explicit consumer relationships, authority boundaries, interface visibility, replaceability, cohesion, coupling, dependency-cycle safety, mutation control and outcome control.

## 6. Reconciliation Completed So Far

### R-01 — Shared outcome contract — RESOLVED

Decision: DD-1.2 Execution Outcomes is the single canonical semantic owner of the shared AppManager outcome model. DD-1.1 Application Invocation owns invocation mechanics and projection/delivery of the accepted DD-1.2 outcome; it does not own a second semantic result envelope.

Relevant PRs:

- PR #87 — canonical outcome/diagnostic ownership clarification;
- PR #88 — propagation into DD-1.1 and DD-1.2.

Canonical direction:

```text
capability/provider evidence
        -> owning-use-case interpretation
        -> canonical DD-1.2 AppManager outcome
        -> DD-1.1 invocation projection/delivery
        -> caller
```

### R-02 — Diagnostic taxonomy — RESOLVED

Decision: DD-1.2 owns the canonical broad cross-application diagnostic taxonomy. DD-1.1 may project/refine it for invocation concerns only by mapping to DD-1.2. Capability/provider failure vocabularies remain local technical evidence until mapped into application-facing diagnostics.

Do not create a new universal diagnostic registry unless a later concrete need demonstrates semantics beyond DD-1.2 ownership.

### R-03 — Nuxt scaffold licence and README ownership — RESOLVED

Decision: inclusion of an artefact class in a Nuxt layer-creation profile creates Nuxt orchestration/baseline intent; it does not transfer semantic ownership of every artefact.

Five ownership dimensions are kept distinct:

1. Nuxt layer-creation orchestration/profile ownership;
2. artefact semantic/content ownership;
3. resource/template resolution/rendering ownership;
4. project-resource persistence/mutation ownership;
5. final Nuxt layer-creation application acceptance.

Relevant PR: #89.

Important bindings:

- Documentation Capability owns documentation semantics where required;
- Settings/application licence semantics remain outside Nuxt;
- DD-2.6 owns declarative resource/template resolution/rendering;
- DD-2.1 owns authorized new-resource creation mechanics;
- DD-2.5 owns authorized existing-resource modification;
- Nuxt owns Nuxt-specific scaffold semantics/validation and use-case orchestration delta.

### R-04 — Bootstrap configuration / managed-project sequence — RESOLVED

PR #93 is merged. Merge commit:

`1820c1d71c0474798941ab4783e05a54b0e846aa`

The canonical staged dependency is now propagated into DD-1.3, DD-1.4 and DD-1.5:

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

Ownership remains deliberately separate:

- DD-1.3 owns project identity, managed-project context, managed scope and targetability;
- DD-1.4 owns configuration applicability, validation, precedence, fallback, provenance and effective-value construction in both stages;
- DD-1.5 owns coordination of the staged sequence;
- `application-core-bootstrap-resolution-clarification-v01.md` is the canonical cross-contract sequencing authority.

The correction does not create a new subsystem or recursive project/configuration authority.

## 7. Open Reconciliation Work

### R-05 — Structural fact model — NEXT

External finding: Source Intelligence, Documentation Capability and Nuxt Capability appear to define similar structural/domain fact records independently.

Required decision: determine whether these are:

- genuine duplicate semantic contracts that require one shared base/composition contract; or
- intentionally distinct domain/capability projections that merely share naming/shape.

Do not begin by inventing a generic `StructuralFact` inheritance hierarchy. First compare semantics, authority, provenance, lifecycle, consumers and validation responsibilities.

The preferred outcome is the smallest shared contract justified by actual semantic overlap, with domain-specific extensions/compositions remaining explicit.

### R-06 — Repository / Source Intelligence relationship — OPEN

External finding: Repository Capability states constraints on Source Intelligence without reciprocal acknowledgement.

Required decision: make dependency direction explicit and ensure one document cannot silently impose an undocumented obligation on another.

### R-07 — App / Settings environment-file ownership — OPEN

Current classification: clarification required rather than proven duplicate ownership.

Current evidence: App owns higher-level existing-application initialization intent; Settings owns persisted environment-definition CRUD. The missing seam is how App initialization delegates the Settings-owned environment operation without creating a second environment-definition authority.

### R-08 — stale references/project-management records — OPEN

The alleged stale future/forthcoming references in the cited Managed Project/Configuration material were not sustained against current live text.

Confirmed stale project-management references to removed `docs/archive/` material and already-fixed defects still require cleanup.

## 8. Three-Layer Documentation Rule

The reconciliation adopted a three-layer rule to reduce semantic drift without making documents unusable in isolation.

### Layer A — canonical invariant

One normative owner contains the complete shared semantic rule.

### Layer B — local binding statement

A consuming specification may restate the invariant concisely where omission would create a plausible authority leak. It must identify the canonical owner and must not redefine the rule.

### Layer C — domain/capability delta

The consuming document describes only its specialised states, evidence, constraints or behavior in detail.

Do not perform maximal deduplication. Keep concise local defensive boundaries where they prevent destructive or authority-leaking interpretations.

## 9. Findings That Must Not Be Adopted Mechanically

The external review is valuable but not all recommendations are accepted as written.

### 9.1 Class diagrams/interfaces

The absence of literal TypeScript interfaces or class diagrams is not itself a Detailed Design failure. The architecture intentionally defines permanent responsibility and semantic contracts independently of implementation topology.

The valid underlying concern is whether an implementer can identify inputs, outputs, states, dependencies and authority seams clearly enough. Add illustrative/conceptual contract structure where useful, but do not prematurely freeze code topology.

### 9.2 Application Engine as a "god object"

The Application Engine is an application-authority boundary, explicitly not a requirement for one class/package/process/executable. Do not fragment application authority merely to shorten its responsibility list.

Composition guidance may be improved while preserving one application-authority model.

### 9.3 Validation

Do not collapse validation into one universal Validation component. The architecture intentionally distinguishes, among other things:

```text
source validity
    != quality evaluation
    != Nuxt semantic validity
    != documentation validity
    != application acceptance
```

Where needed, clarify the taxonomy and ownership boundaries rather than centralizing unrelated semantics.

### 9.4 Mandatory implementation spike

The external action plan proposed a Git vertical implementation slice before continuing DD-3. That is not currently an adopted blocking gate because it would alter the established Design -> Functional -> Detailed Design -> Implementation Specification progression. A later explicit spike may be useful, but it must not silently become a phase-policy change.

## 10. DD-2 Shared Capability Baseline

The completed DD-2 capability family is:

1. Resource Access;
2. Process Execution;
3. Repository Capability;
4. Source Intelligence;
5. Source Transformation;
6. Resource Registry and Template;
7. AI Capability;
8. Quality Capability;
9. Documentation Capability;
10. Nuxt Capability.

Primary files are under `docs/detailed_design/` with names corresponding to those capability titles.

The standing DD-2 guardrails remain:

- resource access != managed scope;
- process completion != application success;
- repository capability != Git-domain/CI-CD authority;
- Source Intelligence is evidence-producing;
- Source Transformation preserves recognition -> facts -> strategy -> plan -> authorization -> execution -> validation -> acceptance;
- capabilities consume governed effective configuration;
- provider models remain below capability contracts;
- naming similarity does not justify a generic framework.

## 11. GitHub Working Protocol

For every new working session:

1. verify current `master` and any named PR state;
2. create a dedicated `ai/<purpose>` branch from current `master` before editing;
3. make only the focused changes required by the current reconciliation item;
4. inspect the exact branch diff against `master` before opening a PR;
5. open a focused PR against `master`;
6. do not edit `master` directly;
7. do not assume a PR is merged until GitHub confirms it;
8. after merge, re-establish the next session branch from the new `master` baseline.

The repository, not chat memory, is the durable source of project state.

## 12. Immediate Next Task — R-05 Structural Fact Model

After this handover PR is merged, the next session should begin R-05 as a read-first horizontal reconciliation.

### 12.1 First actions

1. verify this handover PR is merged and record the resulting `master` SHA;
2. read `docs/project_management/dd2-independent-review-reconciliation-v01.md`, especially R-05 and the modularity/coupling criteria;
3. inspect the current live versions of:
   - `docs/detailed_design/source-intelligence-detailed-design-v01.md`;
   - `docs/detailed_design/documentation-capability-detailed-design-v01.md`;
   - `docs/detailed_design/nuxt-capability-detailed-design-v01.md`;
4. inspect their governing Functional Specifications only where needed to determine semantic ownership;
5. create a new `ai/dd2-r05-structural-facts` branch from current `master` before any edit.

### 12.2 Questions R-05 must answer before editing

For each candidate fact/record model, determine:

- what real-world/application fact it represents;
- which capability is authoritative for producing it;
- whether it is observation/evidence, a domain interpretation, or an application decision;
- its provenance requirements;
- its lifecycle/staleness semantics;
- its consumers;
- whether another capability consumes it directly, projects it, enriches it, or independently derives a different semantic fact;
- whether apparently shared fields have identical meaning or merely similar shape;
- whether sharing a base contract would reduce semantic duplication without coupling specialist capabilities to each other's internal models.

### 12.3 R-05 acceptance rule

Do not modify normative documents until the horizontal comparison establishes a concrete semantic overlap or contradiction.

If a shared contract is justified, prefer composition or a narrowly defined evidence contract over speculative inheritance/framework design.

If the models are semantically distinct, record R-05 as not sustained or clarification-only and make only the minimum wording changes required to make the distinction explicit.

### 12.4 Required output

The R-05 work should produce:

- a written comparison/classification before normative edits;
- focused normative corrections only if justified by that comparison;
- an update to `dd2-independent-review-reconciliation-v01.md` recording the decision and evidence;
- a focused PR against `master`;
- continued DD-3 pause unless/until R-05 through R-08 and the final reconciliation audit are complete.

## 13. First Prompt for the Next Thread

Use the following prompt to start the next working thread:

> @GitHub
>
> We are continuing the AppManager DD-2 independent documentation reconciliation from the repository handover.
>
> First, ingest `docs/project_management/dd2-reconciliation-handover-v01.md` and then read `docs/project_management/dd2-independent-review-reconciliation-v01.md`. Treat the handover as project-management navigation/state, not normative design authority.
>
> Verify the current `master` baseline and confirm that the handover PR is merged. Do not assume temporary branch or PR state from the previous thread.
>
> Then begin **R-05 — Structural Fact Model** exactly as directed by the handover. Perform a read-first horizontal comparison of Source Intelligence, Documentation Capability and Nuxt Capability before proposing any normative change. Determine whether their apparently overlapping structural/domain fact records are genuinely duplicate semantic contracts, deliberate specialisations/compositions, or merely similarly shaped but semantically distinct records.
>
> Preserve the existing architecture: delegated specialist execution does not transfer application authority; do not invent a generic StructuralFact framework merely from naming/shape similarity; preserve provenance, evidence-vs-interpretation distinctions, capability replaceability and implementation-topology independence.
>
> Before editing, create a new `ai/dd2-r05-structural-facts` session branch from current `master`. Never edit `master` directly. Use focused corrective changes and a focused PR. Update the reconciliation control record with the verified R-05 classification/evidence.
>
> DD-3 remains paused. Do not proceed to R-06 until R-05 is explicitly resolved.

## 14. Handover State

At this checkpoint:

- PR #93 is merged;
- R-01 through R-04 are resolved;
- R-05 is the immediate next bounded task;
- R-06 through R-08 remain open;
- DD-3 remains paused;
- no implementation work is authorized by this handover;
- the next session should recover state from the repository rather than from prior-chat reconstruction.

This handover is complete when it is merged into `master` and the next session verifies that merged state before beginning R-05.