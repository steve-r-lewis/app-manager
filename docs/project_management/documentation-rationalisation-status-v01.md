# AppManager Documentation Rationalisation Status

> **Status:** Active project-management status record
>
> **Normative effect:** None. This document records repository/documentation state and must not redefine the Project Documentation Guide, Design Specification, Functional Specifications, Detailed Design Specifications or Implementation Specifications.
>
> **Current baseline for this revision:** `master` at `497400e816e2a0990554b2bcf1e90b333c21ddc9`, the merge commit for PR #97.

---

## 1. Purpose

This document provides a durable repository-based status point for AppManager documentation rationalisation and specification development.

It exists to reduce dependence on conversation history by recording:

- the current documentation authority hierarchy;
- material rationalisation milestones already completed;
- the current Detailed Design phase and reconciliation state;
- historical source-material disposition;
- current continuation rules.

This is a project-management document. It does not participate in the normative specification hierarchy.

---

## 2. Current Documentation Authority

The active authority hierarchy is:

```text
Project Documentation Guide
        -> Design Specification
        -> Functional Specifications
        -> Detailed Design Specifications
        -> Implementation Specifications
```

Primary governing documents include:

- [Project Documentation Guide](../project-documentation-guide-v01.md);
- [AppManager Design Specification](../appmanager-design-specification-v01.md);
- the active Functional Specifications beneath `docs/functional/`;
- the active Detailed Design Specifications beneath `docs/dd_1_application_core/`, `docs/dd_2_shared_capabilities/`, `docs/dd_3_high_coupling_domains/`, and `docs/dd_4_policy_and_resource_domains/`.

Project-management records may describe progress and verification state but are not design authority.

---

## 3. Historical Rationalisation Context

The documentation programme began by reconciling older design/specification material into the current four-level hierarchy.

Historical milestones include:

- establishment of [Project Documentation Guide](../project-documentation-guide-v01.md);
- establishment of [AppManager Design Specification](../appmanager-design-specification-v01.md) as the canonical root Design Specification;
- replacement of the former five-layer architectural description with explicit subsystem/capability responsibilities;
- migration of functional requirements into dedicated Functional Specifications;
- decomposition of Detailed Design into Application Core and Shared Capability workstreams;
- adoption of the AI branch/PR workflow that prohibits direct AI edits to `master`.

Earlier project-management versions referred to legacy material under `docs/archive/`. That tree has since been removed from the live repository after its required information was reconciled or otherwise dispositioned. It is therefore historical provenance, not current required reading and not a valid live path.

Historical references to early Pull Requests or migration branches are retained only where they explain provenance; they shall not be interpreted as open work unless explicitly marked current.

---

## 4. Current Detailed Design State

### 4.1 DD-1 Application Core

DD-1 Application Core is complete and has passed its conformance audit/correction cycle.

The Application Core Detailed Designs establish the shared contracts for:

- Application Invocation;
- Execution Outcomes;
- Managed Project;
- Configuration Resolution;
- Application Engine.

The bootstrap configuration / managed-project sequencing clarification is also complete and propagated.

### 4.2 DD-2 Shared Capabilities

DD-2.1 through DD-2.10 are complete:

- DD-2.1 Resource Access;
- DD-2.2 Process Execution;
- DD-2.3 Repository Capability;
- DD-2.4 Source Intelligence;
- DD-2.5 Source Transformation;
- DD-2.6 Resource Registry and Template;
- DD-2.7 AI Capability;
- DD-2.8 Quality Capability;
- DD-2.9 Documentation Capability;
- DD-2.10 Nuxt Capability.

A vertical conformance audit was followed by an independent horizontal reconciliation because cross-document ownership and dependency questions remained.

---

## 5. DD-2 Independent Review Reconciliation

The durable reconciliation control record is:

[docs/project_management/dd2-independent-review-reconciliation-v01.md](dd2-independent-review-reconciliation-v01.md)

The reconciliation findings are:

- **R-01 Shared outcome contract — resolved.** DD-1.2 owns the canonical AppManager outcome model; DD-1.1 owns invocation projection/delivery.
- **R-02 Diagnostic taxonomy — resolved.** DD-1.2 owns the shared application diagnostic taxonomy; capability vocabularies remain specialist evidence until mapped.
- **R-03 Nuxt scaffold licence/README ownership — resolved.** Nuxt orchestration/profile ownership is separated from artefact semantics, template rendering and persistence/mutation ownership.
- **R-04 Bootstrap configuration / managed-project sequence — resolved.** The staged bootstrap/project-aware configuration dependency is explicit across DD-1.3, DD-1.4 and DD-1.5.
- **R-05 Structural fact model — resolved, not sustained.** Source Intelligence, Nuxt and Documentation fact models are semantically distinct projections/compositions; no generic `StructuralFact` framework is justified.
- **R-06 Repository / Source Intelligence relationship — resolved.** They are sibling capabilities with distinct semantic ownership and no mandatory direct dependency.
- **R-07 App / Settings environment-file ownership — resolved.** App owns application-initialisation intent and acceptance; Settings owns persisted environment-definition CRUD semantics. The normative seam is recorded in [docs/functional/app-settings-environment-definition-ownership-clarification-v01.md](../functional/app-settings-environment-definition-ownership-clarification-v01.md).
- **R-08 stale references/project-management records — addressed by the current cleanup.** Alleged stale future/forthcoming references in the cited live normative DD material were not sustained; stale project-management state and removed-archive references were confirmed and corrected.

---

## 6. Archive and Legacy Material State

The live repository no longer contains `docs/archive/`.

Consequences:

- no active workflow shall require reading a file beneath `docs/archive/`;
- project-management records shall not describe archive files as currently available sources;
- historical archive paths may be mentioned only when clearly identified as historical provenance;
- active architecture and requirements must be derivable from the live normative documentation tree.

The dedicated archive-absence audit/remediation records remain historical evidence that this independence requirement was checked. Their references to `docs/archive/` describe the audit condition and are not live-path instructions.

---

## 7. Known Historical Defects and Closed Items

Earlier versions of this status record listed an unintended control character in the root Design Specification as an open defect. That item has already been corrected and is no longer current work.

Likewise, early references to PR #7, the branch `ai/documentation-rationalisation-status`, and the initial Functional/Detailed Design migration backlog describe completed historical work and are no longer continuation instructions.

Potential implementation-level observations that remain relevant should be handled through the applicable Implementation Specification or a fresh verified implementation audit, not carried forward automatically from historical rationalisation notes.

---

## 8. Current Gate

DD-3 remains paused until the final DD-2 horizontal reconciliation/conformance closeout is recorded after the R-08 cleanup is merged.

R-08 itself does not introduce new architecture. It restores accuracy to the project-management records so that the final gate decision can be made from live repository state.

---

## 9. New-Session Continuation Procedure

A new session working on the current DD programme should begin by reading, in order:

```text
docs/project-documentation-guide-v01.md
docs/appmanager-design-specification-v01.md
docs/project_management/detailed-design-decomposition-plan-v01.md
docs/project_management/dd2-independent-review-reconciliation-v01.md
docs/project_management/dd2-reconciliation-handover-v01.md
```

Then verify the current `master` head and relevant Pull Request state before making changes.

Do not rely on historical branch/PR assumptions, removed archive paths, or implementation behaviour where current normative specifications exist.

---

## 10. Repository Workflow

AI-assisted repository changes shall follow the Project Documentation Guide:

1. verify current repository state;
2. create a dedicated `ai/...` task/session branch from the verified integration baseline;
3. make only the focused changes required by the task;
4. validate the branch diff against the verified base;
5. open a focused Pull Request to `master` or the documented integration branch;
6. leave merge authority to the user or an explicitly authorised process.

Direct AI edits to `master` are prohibited.

---

## 11. Status Maintenance

Update this record only when a material documentation-programme state changes, including:

- completion or reopening of a specification phase;
- a material reconciliation or conformance decision;
- a change to the active authority/read-order model;
- retirement/removal of a documentation source on which continuation instructions previously depended;
- a significant change to the current gate or next phase.

Routine wording edits do not require a status update.