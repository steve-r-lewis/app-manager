# AppManager Documentation Rationalisation Status

> **Status:** Active project-management status record
>
> **Normative effect:** None. This document records repository/documentation state and must not redefine the Project Documentation Guide, Design Specification, Functional Specifications, Detailed Design Specifications or Implementation Specifications.
>
> **Current baseline for this revision:** `master` at `58918ac2ec390ce49d97a1e3f670271af7b203a0`, the merge commit for PR #111 and the completed R-9 structural conformance audit.

---

## 1. Purpose

This document provides a durable repository-based status point for AppManager documentation rationalisation and specification development.

It exists to reduce dependence on conversation history by recording:

- the current documentation authority hierarchy;
- material rationalisation milestones already completed;
- the current Detailed Design phase and conformance state;
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

- establishment of the Project Documentation Guide;
- establishment of the AppManager Design Specification as the canonical root Design Specification;
- replacement of the former five-layer architectural description with explicit subsystem/capability responsibilities;
- migration of functional requirements into dedicated Functional Specifications;
- decomposition of Detailed Design into Application Core, Shared Capability and domain workstreams;
- DD-1 Application Core completion and conformance correction;
- DD-2 Shared Capabilities completion and horizontal reconciliation;
- DD-3.1 App Domain completion;
- adoption of stable `DD-<family>.<item>` identities and canonical family directories;
- migration of active Detailed Design documents from the former flat `docs/detailed_design/` structure;
- reconciliation of active cross-document links and rendered VitePress navigation;
- adoption of the AI branch/PR workflow that prohibits direct AI edits to `master`.

Earlier project-management versions referred to legacy material under `docs/archive/`. That tree has since been removed from the live repository after its required information was reconciled or otherwise dispositioned. It is therefore historical provenance, not current required reading and not a valid live path.

Historical references to old DD paths, early Pull Requests or migration branches are retained only where they explain provenance; they shall not be interpreted as current navigation or open work unless explicitly marked current.

---

## 4. Current Detailed Design State

### 4.1 DD-1 — Application Core

DD-1.1 through DD-1.5 are complete and have passed the DD-1 conformance audit/correction cycle:

- DD-1.1 Application Invocation;
- DD-1.2 Execution Outcomes;
- DD-1.3 Managed Project;
- DD-1.4 Configuration Resolution;
- DD-1.5 Application Engine.

The DD-1 bootstrap and outcome/diagnostic ownership clarifications are complete and reside beneath `docs/dd_1_application_core/clarifications/`.

### 4.2 DD-2 — Shared Capabilities

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

The independent horizontal reconciliation is closed. The canonical assignment is **DD-2.8 Quality Capability** and **DD-2.9 Documentation Capability**.

### 4.3 DD-3 — High-Coupling Domains

- DD-3.1 App Domain — complete;
- DD-3.2 Git Domain — **next**;
- DD-3.3 Nuxt Domain — planned;
- DD-3.4 Docs Domain — planned.

### 4.4 DD-4 — Policy and Resource Domains

- DD-4.1 Quality Domain — planned;
- DD-4.2 Settings Domain — planned;
- DD-4.3 AI Domain — planned;
- DD-4.4 Utils Domain — planned.

No unauthored planned DD has a fabricated normative placeholder specification.

---

## 5. Detailed Design Structural Refactoring

The controlled Detailed Design structural refactoring R-1 through R-10 is closed by [Detailed Design Structure Refactoring Closeout](detailed-design-structure-refactoring-closeout-v01.md), subject to merge of the R-10 closeout PR.

The programme established:

```text
docs/dd_1_application_core/
docs/dd_2_shared_capabilities/
docs/dd_3_high_coupling_domains/
docs/dd_4_policy_and_resource_domains/
```

The canonical register is [Detailed Design Decomposition Plan and Canonical Register](detailed-design-decomposition-plan-v01.md).

R-9 is recorded in [Detailed Design Structure Conformance Audit](detailed-design-structure-conformance-audit-v01.md) and concluded:

> **PASS — R-9 repository-wide structural conformance achieved.**

The audit found zero blocking structural defects, duplicate primary DD identities, missing completed registered DDs, unregistered authored primary DDs, false clarification IDs, broken active R-7 Markdown links, unclassified legacy-path residuals, fabricated planned-DD placeholders, rendered/filesystem taxonomy mismatches, or unexplained implementation-topology leakage introduced by the refactoring.

The former physical `docs/detailed_design/` and `docs/decisions/` directories are not active repository locations. Historical occurrences may remain where they are explicitly evidence of prior state.

---

## 6. DD-2 Reconciliation State

The durable DD-2 reconciliation control record is [DD-2 Independent Review Reconciliation](dd2-independent-review-reconciliation-v01.md).

Its eight findings are closed:

- **R-01 Shared outcome contract — resolved.** DD-1.2 owns the canonical AppManager outcome model; DD-1.1 owns invocation projection/delivery.
- **R-02 Diagnostic taxonomy — resolved.** DD-1.2 owns the shared application diagnostic taxonomy; capability vocabularies remain specialist evidence until mapped.
- **R-03 Nuxt scaffold licence/README ownership — resolved.** Nuxt orchestration/profile ownership is separated from artefact semantics, template rendering and persistence/mutation ownership.
- **R-04 Bootstrap configuration / managed-project sequence — resolved.** The staged bootstrap/project-aware configuration dependency is explicit across DD-1.3, DD-1.4 and DD-1.5.
- **R-05 Structural fact model — resolved, not sustained.** Source Intelligence, Nuxt and Documentation fact models are semantically distinct; no generic `StructuralFact` framework is justified.
- **R-06 Repository / Source Intelligence relationship — resolved.** They are sibling capabilities with distinct semantic ownership and no mandatory direct dependency.
- **R-07 App / Settings environment-definition ownership — resolved.** App owns application-initialisation intent and acceptance; Settings owns persisted environment-definition CRUD semantics.
- **R-08 stale references/project-management records — resolved.** Active project-management state and removed-archive references were reconciled without rewriting valid historical evidence.

The final DD-2 horizontal reconciliation/conformance gate is closed; DD-3 authoring is not blocked by DD-2 reconciliation.

---

## 7. Archive and Historical Material State

The live repository no longer contains `docs/archive/`.

Consequences:

- no active workflow shall require reading a file beneath `docs/archive/`;
- project-management records shall not describe archive files as currently available sources;
- historical archive paths may be mentioned only when clearly identified as historical provenance;
- active architecture and requirements must be derivable from the live normative documentation tree.

Likewise, the former `docs/detailed_design/` and `docs/decisions/` locations are superseded physical structures. Historical handovers and migration records may retain those strings where they document prior repository state.

---

## 8. Current Gate

The documentation-structure refactoring has passed R-9 conformance and is being formally closed by R-10.

Upon merge of the R-10 closeout PR, the gate is:

> **DETAILED DESIGN STRUCTURAL REFACTORING CLOSED — DD-3.2 AUTHORISED**

The immediate next design objective is **DD-3.2 — Git Domain Detailed Design**.

No R-1 through R-10 structural-refactoring work remains a prerequisite to DD-3.2.

---

## 9. New-Session Continuation Procedure

A new session continuing the current Detailed Design programme should begin by reading, in order:

```text
docs/project-documentation-guide-v01.md
docs/appmanager-design-specification-v01.md
docs/project_management/detailed-design-decomposition-plan-v01.md
docs/project_management/domain-detailed-design-authoring-guide-v01.md
docs/project_management/detailed-design-structure-refactoring-closeout-v01.md
```

For DD-3.2, then read the Git Functional authority, applicable clarifications/ADRs, the DD-1 contracts consumed by Git, and the DD-2 capabilities coordinated by Git. DD-2.3 Repository Capability is particularly relevant but must not be treated as synonymous with the Git domain.

Verify the current `master` head and relevant Pull Request state before making changes.

Do not rely on historical branch/PR assumptions, superseded physical paths, removed archive paths, or implementation behaviour where current normative specifications exist.

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