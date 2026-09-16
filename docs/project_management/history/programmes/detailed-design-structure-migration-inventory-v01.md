# AppManager Detailed Design Structure Migration Inventory

> **Status:** Version 1 project-management migration record
>
> **Work package:** R-3 — Repository-wide migration inventory
>
> **Baseline:** `master` at `f36d22ed19508d1f727273f86face87650b70069`
>
> **Normative effect:** None. This document records the controlled structural migration required to realise the Detailed Design repository structure already governed by the Project Documentation Guide and the canonical Detailed Design register.

## 1. Purpose

This document inventories the repository changes required to migrate the active Version 1 Detailed Design set from the legacy flat `docs/detailed_design/` directory to the canonical family directories:

```text
docs/dd_1_application_core/
docs/dd_2_shared_capabilities/
docs/dd_3_high_coupling_domains/
docs/dd_4_policy_and_resource_domains/
```

It provides the old-path → identity → class → canonical-path map required before any physical migration begins.

This work package does **not** move or rename Detailed Design files. Physical migration begins only after this inventory is approved and merged.

## 2. Governing Sources

The migration is governed by:

- [Project Documentation Guide](../project-documentation-guide-v01.md);
- [Detailed Design Decomposition Plan and Canonical Register](detailed-design-decomposition-plan-v01.md);
- the active normative Detailed Design documents themselves;
- current project-management conformance/reconciliation records where they preserve provenance or clarify relationships.

The canonical `DD-<family>.<item>` identities and target paths are taken from the canonical register and must not be reconstructed from current filenames or implementation topology.

## 3. Migration Rules

The structural migration shall preserve all of the following:

1. normative content and responsibility ownership;
2. stable primary `DD-<family>.<item>` identity;
3. existing document version numbers;
4. clarification relationships;
5. traceability and authority semantics;
6. internal contract identifiers such as `DD-ENG-*`, `DD-REPO-*` and `DD-APP-*`;
7. historical statements where the old path or old repository state is itself the subject of the record;
8. repository-relative navigability after migration.

The migration shall not:

- redesign architecture;
- renumber primary Detailed Designs;
- assign primary DD IDs to clarification documents;
- infer design from current source-code topology;
- rewrite historical evidence merely to make it resemble the new structure;
- treat a file move as an authority change.

## 4. Primary Detailed Design Migration Map

### 4.1 DD-1 — Application Core

| ID | Current path | Canonical target path | Class | Action |
|---|---|---|---|---|
| `DD-1.1` | `docs/detailed_design/application-invocation-detailed-design-v01.md` | `docs/dd_1_application_core/dd-1-1-application-invocation-detailed-design-v01.md` | Primary normative DD | Move/rename; add canonical identity header; repair links |
| `DD-1.2` | `docs/detailed_design/execution-outcomes-detailed-design-v01.md` | `docs/dd_1_application_core/dd-1-2-execution-outcomes-detailed-design-v01.md` | Primary normative DD | Move/rename; add canonical identity header; repair links |
| `DD-1.3` | `docs/detailed_design/managed-project-detailed-design-v01.md` | `docs/dd_1_application_core/dd-1-3-managed-project-detailed-design-v01.md` | Primary normative DD | Move/rename; add canonical identity header; repair links |
| `DD-1.4` | `docs/detailed_design/configuration-resolution-detailed-design-v01.md` | `docs/dd_1_application_core/dd-1-4-configuration-resolution-detailed-design-v01.md` | Primary normative DD | Move/rename; add canonical identity header; repair links |
| `DD-1.5` | `docs/detailed_design/application-engine-detailed-design-v01.md` | `docs/dd_1_application_core/dd-1-5-application-engine-detailed-design-v01.md` | Primary normative DD | Move/rename; add canonical identity header; repair links |

### 4.2 DD-2 — Shared Capabilities

| ID | Current path | Canonical target path | Class | Action |
|---|---|---|---|---|
| `DD-2.1` | `docs/detailed_design/resource-access-detailed-design-v01.md` | `docs/dd_2_shared_capabilities/dd-2-1-resource-access-detailed-design-v01.md` | Primary normative DD | Move/rename; add canonical identity header; repair links |
| `DD-2.2` | `docs/detailed_design/process-execution-detailed-design-v01.md` | `docs/dd_2_shared_capabilities/dd-2-2-process-execution-detailed-design-v01.md` | Primary normative DD | Move/rename; add canonical identity header; repair links |
| `DD-2.3` | `docs/detailed_design/repository-capability-detailed-design-v01.md` | `docs/dd_2_shared_capabilities/dd-2-3-repository-capability-detailed-design-v01.md` | Primary normative DD | Move/rename; add canonical identity header; repair links |
| `DD-2.4` | `docs/detailed_design/source-intelligence-detailed-design-v01.md` | `docs/dd_2_shared_capabilities/dd-2-4-source-intelligence-detailed-design-v01.md` | Primary normative DD | Move/rename; add canonical identity header; repair links |
| `DD-2.5` | `docs/detailed_design/source-transformation-detailed-design-v01.md` | `docs/dd_2_shared_capabilities/dd-2-5-source-transformation-detailed-design-v01.md` | Primary normative DD | Move/rename; add canonical identity header; repair links |
| `DD-2.6` | `docs/detailed_design/resource-registry-and-template-detailed-design-v01.md` | `docs/dd_2_shared_capabilities/dd-2-6-resource-registry-and-template-detailed-design-v01.md` | Primary normative DD | Move/rename; add canonical identity header; repair links |
| `DD-2.7` | `docs/detailed_design/ai-capability-detailed-design-v01.md` | `docs/dd_2_shared_capabilities/dd-2-7-ai-capability-detailed-design-v01.md` | Primary normative DD | Move/rename; add canonical identity header; repair links |
| `DD-2.8` | `docs/detailed_design/quality-capability-detailed-design-v01.md` | `docs/dd_2_shared_capabilities/dd-2-8-quality-capability-detailed-design-v01.md` | Primary normative DD | Move/rename; add canonical identity header; repair links |
| `DD-2.9` | `docs/detailed_design/documentation-capability-detailed-design-v01.md` | `docs/dd_2_shared_capabilities/dd-2-9-documentation-capability-detailed-design-v01.md` | Primary normative DD | Move/rename; add canonical identity header; repair links |
| `DD-2.10` | `docs/detailed_design/nuxt-capability-detailed-design-v01.md` | `docs/dd_2_shared_capabilities/dd-2-10-nuxt-capability-detailed-design-v01.md` | Primary normative DD | Move/rename; add canonical identity header; repair links |

### 4.3 DD-3 — High-Coupling Domains

| ID | Current path | Canonical target path | Class | Action |
|---|---|---|---|---|
| `DD-3.1` | `docs/detailed_design/app-domain-detailed-design-v01.md` | `docs/dd_3_high_coupling_domains/dd-3-1-app-domain-detailed-design-v01.md` | Primary normative DD | Move/rename; preserve existing DD-3.1 identity metadata; repair links |

`DD-3.2`, `DD-3.3` and `DD-3.4` are registered but not yet authored. No placeholder normative documents shall be created during migration.

### 4.4 DD-4 — Policy and Resource Domains

No DD-4 primary document currently exists. The canonical directory may be established when the structural migration is performed, but no empty normative documents shall be created.

## 5. Detailed Design Clarification Migration Map

Clarifications remain supporting documents and do not receive fictitious primary DD identities.

| Current path | Principal relationship | Canonical target path | Class | Action |
|---|---|---|---|---|
| `docs/detailed_design/application-core-bootstrap-resolution-clarification-v01.md` | Clarifies DD-1.3 / DD-1.4 / DD-1.5 bootstrap/configuration/project sequencing | `docs/dd_1_application_core/clarifications/application-core-bootstrap-resolution-clarification-v01.md` | Detailed Design clarification | Move; add/normalise explicit `Clarifies:` metadata; repair references |
| `docs/detailed_design/application-outcome-and-diagnostic-ownership-clarification-v01.md` | Clarifies DD-1.1 / DD-1.2 outcome and diagnostic ownership | `docs/dd_1_application_core/clarifications/application-outcome-and-diagnostic-ownership-clarification-v01.md` | Detailed Design clarification | Move; add/normalise explicit `Clarifies:` metadata; repair references |
| `docs/detailed_design/nuxt-layer-scaffold-artefact-ownership-clarification-v01.md` | Clarifies DD-2.10 with DD-2.5 / DD-2.6 / DD-2.9 ownership boundaries | `docs/dd_2_shared_capabilities/clarifications/nuxt-layer-scaffold-artefact-ownership-clarification-v01.md` | Detailed Design clarification | Move; preserve cross-capability scope; repair references |
| `docs/detailed_design/repository-source-intelligence-relationship-clarification-v01.md` | Clarifies DD-2.3 / DD-2.4 sibling-capability relationship | `docs/dd_2_shared_capabilities/clarifications/repository-source-intelligence-relationship-clarification-v01.md` | Detailed Design clarification | Move; preserve cross-capability scope; repair references |

Placement in one family clarification directory is organizational only. It does not make the clarification a child authority of one individual primary DD.

## 6. Active Reference-Repair Inventory

The migration must repair active references that currently point to legacy DD paths or obsolete ADR locations. Repository-wide search at the R-3 baseline identified the following active reference surfaces.

### 6.1 Normative Detailed Design Documents

Every existing primary DD listed in Section 4 is affected because the documents contain one or more of:

- governing-source paths;
- peer Detailed Design paths;
- clarification paths;
- predecessor/dependency paths;
- stale `docs/decisions/` references.

During its family migration, each primary DD shall therefore receive a reference-only pass in addition to its identity/path update. Dependency references should become repository-relative Markdown links where practical.

### 6.2 Clarification Documents

All four clarification documents in Section 5 are affected by their own physical relocation and by references to the primary DDs they clarify.

### 6.3 Functional Specifications

Known active Functional reference surface:

- `docs/functional/nuxt-functional-specification-v01.md` — references the Nuxt layer scaffold artefact ownership clarification by its legacy `docs/detailed_design/` path.

Other Functional Specifications must be included in the migration-time repository-wide old-path search even when R-3 search did not surface a current legacy-path match.

### 6.4 Project-Management Documents

Known active or continuing project-management reference surfaces include:

- `docs/project_management/domain-detailed-design-authoring-guide-v01.md`;
- `docs/project_management/application-core-detailed-design-conformance-audit-v01.md`;
- `docs/project_management/shared-capability-detailed-design-conformance-audit-v01.md`;
- `docs/project_management/detailed-design-dd1-handover-review-v01.md`;
- `docs/project_management/dd2-independent-review-reconciliation-v01.md`;
- `docs/project_management/documentation-rationalisation-status-v01.md`;
- `docs/project_management/archive-absence-conformance-audit-v01.md`;
- `docs/project_management/technology-architecture-review-v01.md`;
- `docs/project_management/decisions/architecture-decision-governance-v01.md`.

These documents fall into two distinct treatment classes:

1. **active navigation/authority references** — update to current canonical locations;
2. **historical evidence statements** — preserve the historical wording where the old path or old repository state is itself material, but add current successor/navigation context if needed to prevent ambiguity.

The migration must not mechanically replace every historical occurrence.

### 6.5 ADR Path Repair

A separate but overlapping stale-reference signature is:

```text
docs/decisions/
```

The active ADR location is:

```text
docs/project_management/decisions/
```

Several DD and project-management documents still contain the old ADR path. Those are reference defects to repair while touching the affected documents, unless the old path is being quoted as historical repository state.

### 6.6 VitePress

`docs/.vitepress/config.ts` was inspected at the R-3 baseline.

It currently contains navigation for Guide, Layers, Commands and Architecture, but no Detailed Design path or sidebar entries. Therefore:

- there is no current DD path breakage in VitePress configuration caused by this migration;
- R-8 may still introduce explicit Detailed Design navigation later if the documentation-site design requires it;
- no VitePress edit is required merely to complete R-3.

## 7. Search Signatures for Migration and Closeout

The following repository-wide searches are mandatory during migration and final conformance closeout:

```text
docs/detailed_design/
detailed_design_1_
detailed_design_2_
detailed_design_3_
detailed_design_4_
docs/decisions/
application-invocation-detailed-design-v01.md
execution-outcomes-detailed-design-v01.md
managed-project-detailed-design-v01.md
configuration-resolution-detailed-design-v01.md
application-engine-detailed-design-v01.md
resource-access-detailed-design-v01.md
process-execution-detailed-design-v01.md
repository-capability-detailed-design-v01.md
source-intelligence-detailed-design-v01.md
source-transformation-detailed-design-v01.md
resource-registry-and-template-detailed-design-v01.md
ai-capability-detailed-design-v01.md
quality-capability-detailed-design-v01.md
documentation-capability-detailed-design-v01.md
nuxt-capability-detailed-design-v01.md
app-domain-detailed-design-v01.md
```

Clarification filenames in Section 5 must also be searched individually.

Every remaining match after structural migration must be classified as one of:

- valid current canonical reference;
- intentional historical/provenance reference;
- archive reference;
- migration defect requiring correction.

No unexplained stale match is acceptable at R-9 closeout.

## 8. Physical Migration Work Packages Derived from This Inventory

The inventory establishes the following executable sequence:

```text
R-4  DD-1 primary documents + DD-1 clarifications
  ↓
R-5  DD-2 primary documents + DD-2 clarifications
  ↓
R-6  DD-3.1 move + DD-3/DD-4 family establishment
  ↓
R-7  repository-wide cross-reference reconciliation
  ↓
R-8  VitePress/navigation reconciliation where required
  ↓
R-9  repository-wide conformance audit
```

A family migration may repair references within the files it moves, but repository-wide reference cleanup remains an explicit R-7 work package so references outside that family are not silently missed.

## 9. R-3 Gate

R-3 is complete when all of the following are true:

- every currently authored primary Version 1 Detailed Design has one registered old path and one canonical target path;
- every Detailed Design clarification in the legacy flat directory has a classified destination;
- no clarification has been assigned a fictitious primary DD ID;
- active non-DD reference surfaces have been identified by repository-wide search;
- stale ADR-path references are explicitly included in the repair scope;
- VitePress has been inspected for direct DD path coupling;
- physical migration has not yet occurred;
- the R-4/R-5/R-6 migration sequence can proceed without inventing destination paths during execution.

Upon approval and merge of this inventory, the next work package is **R-4 — DD-1 Application Core structural migration**.
