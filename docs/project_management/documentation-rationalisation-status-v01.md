# AppManager Documentation Rationalisation Status

> **Status:** Active
>
> This document records the current project-management state of the AppManager documentation rationalisation work. It is not a specification authority and must not redefine the Project Documentation Guide, Design Specification, Functional Specifications, Detailed Design Specifications, or Implementation Specifications.

## 1. Purpose

This document provides a durable repository-based handoff point for ongoing documentation rationalisation work.

It exists to reduce dependence on individual AI or human conversation history by recording:

- the current authoritative documentation structure;
- completed rationalisation work;
- archived source material;
- active migration and reconciliation work;
- open documentation changes and Pull Requests;
- unresolved defects and decisions;
- the recommended next sequence of work.

This document belongs to the project-management documentation category because it records planning, coordination, migration status, rationalisation progress, handoff context, and the sequencing of work. It is outside the normative Design → Functional → Detailed Design → Implementation specification hierarchy and must not establish product requirements or design authority.

---

## 2. Governing Documentation

The current documentation authority hierarchy is:

```text
project-documentation-guide-v01.md
          |
          v
appmanager-design-specification-v01.md
          |
          v
Functional Specifications
          |
          v
Detailed Design Specifications
          |
          v
Implementation Specifications
```

The governing documents are:

- `docs/project-documentation-guide-v01.md`
  - highest documentation authority within `docs/`;
  - governs naming, specification levels, traceability, lifecycle, archiving, retirement, and AI-assisted documentation practices.

- `docs/appmanager-design-specification-v01.md`
  - current canonical Design Specification;
  - defines the intended AppManager system beneath the Project Documentation Guide.

Lower-level documents must refine these authorities without silently redefining them.

Project-management documents may report progress against this hierarchy, but they do not participate in it as normative specification authorities.

---

## 3. Canonical Naming Rules

The canonical application name is:

```text
AppManager
```

Project-controlled naming currently follows these rules:

- directories use lowercase letters, numbers, and underscores;
- filenames use lowercase letters, numbers, and hyphens;
- project-controlled identifiers normally use lowercase underscore-delimited names unless an external format imposes another convention;
- retired documentation uses `-retired` immediately after the version identifier.

Examples:

```text
license_engine/
project-documentation-guide-v01.md
document-name-v01-retired.md
```

---

## 4. Documentation Specification Levels

The approved four-level specification hierarchy is:

1. Design Specification — what system is being built and what architectural intent governs it.
2. Functional Specification — what AppManager must do.
3. Detailed Design Specification — how approved functionality should work internally.
4. Implementation Specification — how the approved design is currently realised in the repository.

Information should be stored at the highest appropriate level of abstraction and should not be duplicated across levels except where limited context or traceability requires it.

Project-management records are maintained separately from these four specification levels.

---

## 5. Completed Rationalisation Work

### 5.1 Project Documentation Guide

Created:

```text
docs/project-documentation-guide-v01.md
```

The guide now governs:

- documentation authority;
- canonical AppManager naming;
- directory, filename, and identifier conventions;
- the four-level specification hierarchy;
- bidirectional traceability;
- interaction-mode terminology;
- architectural terminology;
- document structure, naming, and versioning;
- conflict resolution;
- archive and retirement policy;
- AI-assisted documentation and development;
- design versus implementation separation;
- documentation quality criteria.

The guide was later extended to distinguish Active, Archived, and Retired documentation states and to define a formal retirement procedure.

The guide also now defines the normative AI GitHub branch and Pull Request workflow following the merge of Pull Request #6.

### 5.2 Root Design Specification

Created:

```text
docs/appmanager-design-specification-v01.md
```

This document supersedes the previous system-level design overview as the current canonical Design Specification.

It establishes the current system-level design across fifteen principal sections covering purpose, scope, system vision, terminology, interaction modes, command model, architecture, code intelligence, configuration, managed projects, functional domains, workflows, invariants, extensibility, hierarchy, traceability, and glossary material.

### 5.3 Architecture Terminology Rationalisation

The previous `five-layer architecture` description has been retired as a complete architectural model.

The responsibilities previously associated with services, scanners, strategies, templates, and orchestrators remain useful, but they are now treated as architectural subsystems, component families, processing stages, domain engines, or related architectural concerns rather than as five equivalent layers.

### 5.4 Reconciliation Audit

Created:

```text
docs/design/appmanager-design-reconciliation-audit-v01.md
```

The audit reconciles meaningful information from three major legacy sources and classifies content as appropriate for:

- Design;
- Functional Specification;
- Detailed Design Specification;
- Implementation Specification;
- proposal status;
- deliberate obsolescence.

The audit is a disposition record and does not itself complete migration where information still needs to be materialised in the target specification level.

---

## 6. Archived Documentation

The following legacy design documents have been moved out of the active documentation tree and placed beneath:

```text
docs/archive/design/
```

Archived source documents include:

```text
app-manager-design-specification-overview-v01.md
20260822-1843-app-manager-comprehensive-specification-v02.md
20260822-2051-implementation-roadmap-v01.md
```

Their current archive state has the following meaning:

- they are no longer authoritative;
- they remain available for reconciliation, provenance, and historical reference;
- archiving does not automatically mean retirement;
- a document must not receive the `-retired` suffix until all information intended for preservation has actually been transferred, explicitly retained elsewhere, or deliberately classified obsolete.

The former design overview should be understood as the superseded canonical Design Specification rather than merely as an incidental legacy document.

---

## 7. Reconciliation Status by Legacy Source

### 7.1 Previous Design Specification Overview

System-level intent has been transferred into the current root Design Specification.

The reconciliation audit has classified remaining lower-level material for Functional, Detailed Design, or Implementation treatment.

Retirement should occur only when all information intended for preservation has reached its appropriate destination or has otherwise been explicitly dispositioned under the Project Documentation Guide.

### 7.2 Comprehensive Specification

This document contains substantial Functional, Detailed Design, Implementation, and proposal material.

It is archived but should not yet be considered fully retired.

Important material still to be materialised includes command behaviour, service contracts, scanner and strategy design, configuration behaviour, Git behaviour, template behaviour, AI behaviour, and implementation observations.

### 7.3 Implementation Roadmap

This document contains implementation-planning information, Detailed Design material, migration requirements, configuration and repository-registry work, implementation status, and proposals.

It is archived but should not yet be considered fully retired.

---

## 8. Functional Specification Migration Backlog

The reconciliation audit identifies the following principal Functional Specification areas that still require consolidation or creation:

1. interaction and command execution;
2. App domain;
3. Git domain;
4. Nuxt domain;
5. Docs domain;
6. Quality domain;
7. Utils domain;
8. AI domain;
9. Settings domain;
10. configuration resolution and persistence;
11. managed project and repository behaviour;
12. source inspection, documentation, and transformation behaviour;
13. templates and artifact generation;
14. licensing behaviour.

Existing command specifications should be mined, reconciled, and consolidated rather than rewritten from memory.

---

## 9. Detailed Design Migration Backlog

The principal Detailed Design areas still requiring rationalisation include:

- command infrastructure and registry;
- command contracts and metadata;
- interaction adapters;
- configuration and settings resolution;
- configuration schemas and precedence;
- Git services;
- AI and LLM services and registries;
- file and JSONC services;
- process execution;
- logging;
- code coordination;
- scanner architecture and token models;
- TypeScript, CSS, HTML, and JSON scanners;
- strategy interfaces and discovery;
- language-specific strategies;
- safe multi-injection behaviour;
- Vue orchestration;
- template engine and template catalogue;
- License Engine;
- repository registry;
- AI registry;
- `app_manager/` directory design;
- generated state and logs;
- command-level Detailed Design Specifications.

---

## 10. Implementation Migration Backlog

Implementation-level documentation still needs to record or rationalise:

- exact source paths;
- application entry points;
- command registration and bootstrap;
- implemented commands and stubs;
- currently unwired components;
- concrete signatures;
- package-manager implementation;
- Git implementation;
- AI implementation;
- template TODOs;
- hard-coded author metadata;
- hard-coded repository organisation or environment assumptions;
- repository-registry wiring gaps;
- error typing and swallowed errors;
- duplicated process execution logic;
- current Vue implementation location;
- current scanner and strategy usage;
- path migrations;
- `.gitignore` migrations;
- test-report paths;
- settings and configuration paths;
- source/documentation discrepancies.

---

## 11. Proposal Register

The following items remain proposals unless and until approved by the appropriate authoritative specification:

- GUI interaction mode as a first-class implementation target;
- additional scoped repository synchronisation behaviour;
- repository synchronisation flags;
- command auto-discovery;
- dependency injection;
- editor configuration generation;
- standalone layer generation;
- deployment templates;
- relocation of Vue strategy/orchestration components;
- JSX and TSX support;
- JSX scanner and TSX strategy;
- React orchestration.

Proposal status must not be silently converted into approved requirement status by implementation work or AI-generated documentation.

---

## 12. Known Documentation Defects

### 12.1 Root Design Specification Control Character

The file:

```text
docs/appmanager-design-specification-v01.md
```

contains an unintended vertical-tab/control character in Appendix 15.2 before one diagram line.

This should be corrected through the normal branch and Pull Request workflow before `v01` is considered editorially complete.

### 12.2 Historical Naming Inconsistencies

Some existing directories and documents still use naming forms that do not conform to the current Project Documentation Guide.

These should be migrated deliberately rather than silently renamed, because path changes may affect references and traceability.

One known example is the existing `template-engine` directory, which conflicts with the directory convention that would require `template_engine`.

---

## 13. AI GitHub Workflow Status

The normative AI GitHub branch and Pull Request workflow is now included in:

```text
docs/project-documentation-guide-v01.md
```

The workflow requires AI systems to:

- avoid direct commits to `master` or another integration branch;
- create a dedicated session or task branch;
- use `ai/<purpose>` as the default AI branch naming form;
- make related changes on that branch;
- create a Pull Request targeting the appropriate integration branch;
- describe the purpose, affected areas, consequences, and validation performed;
- leave merging to the user or an explicitly approved review/automation process;
- avoid unrelated formatting churn, force-pushes, shared-history rewrites, and direct protected-branch edits unless explicitly authorised.

The policy became authoritative when Pull Request #6 was merged into `master`.

---

## 14. Current Change for This Status Document

This status document is being introduced and refined on the task branch:

```text
ai/documentation-rationalisation-status
```

The intended merge target is:

```text
master
```

Pull Request #7 carries the change and must be reviewed and merged by the user or another explicitly approved process.

As part of that Pull Request, this status document is located under `docs/project_management/` and the Project Documentation Guide is being updated to define project-management documentation as separate from the four-level normative specification hierarchy.

---

## 15. Recommended Next Sequence

The recommended continuation sequence is:

1. review and merge or revise Pull Request #7 introducing the project-management category and this rationalisation status document;
2. correct the control character in `docs/appmanager-design-specification-v01.md` through a dedicated branch and Pull Request;
3. inventory and rationalise existing Functional Specifications, beginning with the existing command-domain documents;
4. transfer Functional material from archived sources and the reconciliation audit into authoritative Functional Specifications;
5. perform a second zero-information-loss reconciliation check for Functional material;
6. rationalise Detailed Design documentation by subsystem and command responsibility;
7. create or consolidate the root Implementation Specification and implementation-level supporting documents;
8. transfer remaining implementation observations from archived sources;
9. extract unresolved proposals into explicit proposal records where useful;
10. perform a final cross-level traceability review;
11. mark archived documents `-retired` only when their retirement criteria have actually been satisfied.

---

## 16. New-Session Continuation Procedure

A new AI or human-assisted working session should begin by reading, in order:

```text
docs/project-documentation-guide-v01.md
docs/appmanager-design-specification-v01.md
docs/design/appmanager-design-reconciliation-audit-v01.md
docs/project_management/documentation-rationalisation-status-v01.md
```

The session should then inspect any open Pull Requests relevant to the requested work before making repository changes.

The repository documentation should be treated as the durable source of project continuity. Conversation history may provide useful context, but it must not silently override the current authoritative documentation or verified repository state.

---

## 17. Status Maintenance

This document should be updated when a material change occurs in the documentation rationalisation state, including when:

- an authoritative document is added or superseded;
- an archived document becomes retired;
- a major migration backlog area is completed;
- a proposal is approved, rejected, or moved into another specification level;
- a known documentation defect is resolved;
- a significant documentation rationalisation Pull Request is opened or merged;
- the recommended next sequence materially changes.

Routine wording changes and individual low-level edits do not require an update unless they affect project continuation or migration status.
