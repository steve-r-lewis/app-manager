# AppManager Archive-Absence Conformance Audit

> **Status:** In progress
>
> **Authority:** Non-normative project-management audit. This document records conformance findings and corrective work; it does not create product requirements or architectural authority.
>
> **Baseline:** `master` at `dcf15a31fd4f75b694831222823f23c0513159d7` after merge of PR #66.

## 1. Purpose

This audit tests the complete live AppManager documentation set produced so far against the archive-absence criterion:

> **If `docs/archive/` were unavailable, the current live documentation must remain sufficient to understand the approved AppManager architecture, functional requirements, detailed design, decision authority, and the implementation obligations defined so far.**

The archive may preserve provenance and historical evidence, but live normative documentation must not require archived material for interpretation, definition, completeness, conformance, or implementation.

## 2. Audit Scope

The audit covers the live documentation and closely related repository guidance produced so far, including:

- `docs/project-documentation-guide-v01.md`;
- `docs/appmanager-design-specification-v01.md`;
- `docs/decisions/`;
- `docs/functional/`;
- `docs/detailed_design/`;
- live project-management documents where they affect interpretation of current work;
- `README.md` and `AGENTS.md` where they direct readers or AI agents to documentation authority;
- implementation-adjacent metadata that currently cites archived specifications, including `app_manager/templates/template-repository.json`.

The contents of `docs/archive/` are not treated as required reading for the conformance decision.

## 3. Acceptance Criteria

A live document conforms when:

1. it does not depend on an archived document for normative meaning;
2. any enduring requirement recovered from historical material is stated completely in a current authoritative document;
3. historical provenance is not presented as a governing source in a normative specification;
4. traceability needed for current implementation points to current authority or accepted ADRs;
5. removal of `docs/archive/` would not create an unresolved requirement, boundary, contract, or implementation obligation;
6. historical or migration narrative is kept outside normative specifications unless it is itself necessary to state an enduring constraint;
7. implementation-adjacent metadata is self-contained or points to current authority rather than requiring an archived specification.

## 4. Initial Findings

### 4.1 Documentation governance

The Project Documentation Guide already establishes that the archive is outside the active specification hierarchy and that active specifications should normally reference active authority. The audit will verify whether the live corpus actually satisfies that policy and will strengthen wording only where a concrete ambiguity remains.

### 4.2 Root Design and ADRs

Initial search found no direct `docs/archive/` dependency in the root Design Specification or live ADR documents. These remain subject to semantic review for historical statements that would make the archive necessary to interpret the approved design.

### 4.3 Functional Specifications

**Non-conforming; corrective work required.** Direct archive references and/or legacy-reconciliation framing remain in several live Functional Specifications after PR #66, including AI, Docs, Quality, Settings, Utils, Managed Project, Configuration, and Source Transformation. Application Invocation and App also retain legacy-disposition sections even where they do not directly link to `docs/archive/`.

PR #66 successfully cleaned Git and Nuxt; those specifications will still be reviewed semantically as part of this audit.

Corrective rule: preserve every current functional requirement and enduring boundary, but remove historical derivation/provenance from the normative specification when that provenance is not necessary to state the current requirement.

### 4.4 Detailed Design Specifications

No direct `docs/archive/` path dependency was found in the current Detailed Design set. However, several DD documents retain `Current Implementation Reconciliation`, `historical specifications`, or similar evidence sections. These require semantic review because archive-absence conformance is not merely a broken-link test: any permanent contract derived from that evidence must stand independently in the DD itself.

### 4.5 Implementation-adjacent template metadata

**Non-conforming; corrective work required.** `app_manager/templates/template-repository.json` still contains notes that cite `spec-templates-full-v01.md`, including direct `docs/archive/...` references. These notes must be made self-contained or redirected to current authority without changing the template catalogue or runtime-relevant data.

## 5. Incremental Audit Plan

The PR will be updated incrementally in this order:

1. establish this audit record and open PR #67;
2. Functional Specifications — remove archive dependencies and historical derivation while preserving all normative requirements;
3. Detailed Design — verify every completed DD contract is self-contained and remove/reframe non-normative reconciliation narrative where necessary;
4. root Design, Documentation Guide, ADRs, README and AGENTS — verify authority-chain completeness and consistency;
5. implementation-adjacent metadata — remove archived-spec dependencies with minimal, non-semantic edits;
6. perform a final repository-wide search and semantic conformance pass;
7. record the final PASS / PASS WITH CORRECTIONS / FAIL result in this audit.

## 6. Current Result

**IN PROGRESS — not yet conformant.**

The initial repository-wide evaluation has identified live Functional Specification and template-metadata dependencies that would leave the documentation corpus referring to unavailable historical material if `docs/archive/` were removed. These are now the first corrective targets for PR #67.
