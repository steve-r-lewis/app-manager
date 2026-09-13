# AppManager Archive-Absence Remediation Status

> **Status:** Complete
>
> **Authority:** Non-normative project-management record. This document tracks corrective work arising from the archive-absence conformance audit; it does not create product requirements or architectural authority.
>
> **Completion baseline:** `master` at `181f800ed1baef35c6e24d694cf22efc5ef5e06c`, after merge of PR #78.

## 1. Purpose

PR #67 established the archive-absence audit and identified conformance defects that had to be resolved before DD-2.7 could begin.

The acceptance criterion is:

> **If `docs/archive/` were unavailable, the current live documentation must remain sufficient to understand the approved AppManager architecture, functional requirements, detailed design, decision authority, and implementation obligations defined so far.**

This record now reports the remediation workstream as complete. The final conformance determination is recorded in `archive-absence-conformance-audit-v01.md`.

## 2. Remediation Completed

### 2.1 Functional Specifications

The Functional Specification cleanup was completed through the isolated PR sequence culminating in PR #78.

The work removed archive-derived governing-source references, legacy reconciliation/disposition sections, and historical traceability where that material was not necessary to state current requirements. Current Functional requirements and domain-authority boundaries were preserved.

The resulting live Functional Specifications are intended to be read declaratively against current Design, Functional and Detailed Design authority rather than against archived derivation material.

### 2.2 Detailed Design semantic review

The completed Detailed Design set was reviewed using the semantic archive-absence test rather than a simple keyword test.

Sections describing current implementation, historical implementation experience, or implementation reconciliation were retained where they are self-contained evidence mappings and where every permanent contract is independently stated by current `DD-*` requirements, invariants, traceability, or final design positions.

The review found no requirement for a reader or implementer to consult `docs/archive/` in order to understand the approved DD contracts created so far.

### 2.3 Root Design, governance and ADR review

The root Design Specification, Project Documentation Guide, ADR governance, ADR-0001, README and AGENTS guidance were reviewed for archive-dependent interpretation.

The Project Documentation Guide already places `docs/archive/` outside the active specification hierarchy. Root Design and ADR material use historical/current implementation only as evidence, rationale or anti-drift context and do not make archived material a normative dependency.

No further normative edit was required for archive-absence conformance.

### 2.4 Implementation-adjacent template metadata

`app_manager/templates/template-repository.json` retains several historical-specification citations in descriptive `notes` fields.

Semantic review determined that these are provenance-only annotations rather than dependencies:

- each note states the relevant current technical fact in the note itself;
- no runtime behaviour, template identity, template content, target authority or application contract depends on consulting the cited archived specification;
- the file remains implementation-adjacent descriptive data rather than a normative specification authority.

Accordingly, removal of `docs/archive/` would leave those notes with historical citations that no longer resolve, but would not remove information required to interpret or implement the current AppManager architecture or template catalogue. Under the audit criterion that implementation-adjacent metadata be self-contained **or** point to current authority rather than require archived material, these notes are self-contained and do not block conformance.

A future metadata-cleanliness change may remove obsolete provenance citations if desired, but it is not required for archive-absence conformance and must not be confused with a runtime or architectural correction.

### 2.5 Temporary audit tooling

The repository no longer contains the temporary `scripts/` directory used during this documentation work. No temporary Python audit helper remains part of the live repository state examined for completion.

## 3. Change Discipline Preserved

The remediation work preserved the following constraints:

- every current FR/DD requirement and enduring architectural boundary remains represented in current authority;
- historical provenance was removed from normative specifications only after its enduring substance was represented declaratively;
- current traceability points to live authority or accepted ADRs where normative traceability is required;
- no runtime/application behaviour was intentionally changed by the documentation remediation;
- non-normative historical and project-management evidence remains outside the normative specification hierarchy;
- archive absence was evaluated semantically rather than merely by counting broken links.

## 4. Completion State

**COMPLETE.**

The remediation workstream identified by PR #67 has been completed. PRs through #78 have been merged, the Detailed Design and governance semantic reviews are complete, and no unresolved archive dependency remains that prevents understanding or implementing the approved live documentation produced so far.

The archive-absence conformance audit may therefore record a final **PASS** and DD-2.7 may proceed once that audit result is merged.
