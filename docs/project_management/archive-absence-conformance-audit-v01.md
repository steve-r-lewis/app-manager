# AppManager Archive-Absence Conformance Audit

> **Status:** Complete — PASS
>
> **Authority:** Non-normative project-management audit. This document records conformance findings and corrective work; it does not create product requirements or architectural authority.
>
> **Final baseline:** `master` at `181f800ed1baef35c6e24d694cf22efc5ef5e06c`, after merge of PR #78.

## 1. Purpose

This audit tests the live AppManager documentation set produced so far against the archive-absence criterion:

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
- implementation-adjacent metadata that may retain historical references, including `app_manager/templates/template-repository.json`.

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

## 4. Corrective Work Completed

### 4.1 Functional Specifications

The Functional Specification remediation was completed through the isolated PR sequence ending at PR #78.

The work removed archive-derived governing-source references, historical reconciliation/disposition sections and legacy-only traceability from live normative Functional Specifications while preserving the current requirements and authority boundaries.

The resulting Functional Specification set is declarative and interpretable from current authority. The remediation includes the specifications for:

- Application Invocation;
- Managed Project;
- Configuration;
- Source Transformation;
- App;
- Git;
- Nuxt;
- Docs;
- Quality;
- Settings;
- AI;
- Utils.

Fresh reads of the remediated current files confirm that archived documents are no longer required to interpret their normative requirements.

### 4.2 Detailed Design Specifications

The completed Detailed Design set was reviewed semantically rather than by treating every use of words such as `historical`, `current implementation` or `reconciliation` as a defect.

Several DD documents deliberately retain current-implementation evidence and implementation-reconciliation sections. These sections conform because:

- they identify current implementation facts as evidence rather than architectural authority;
- permanent capability contracts are independently stated in current `DD-*` requirements, invariants, traceability sections and final design positions;
- the evidence sections are self-contained where they record current implementation facts;
- no current DD requires a reader to consult `docs/archive/` to understand a permanent contract;
- current implementation must converge on the approved DD contract rather than the DD inheriting accidental implementation structure.

Accordingly, deleting the archive would not remove a required DD definition, responsibility boundary, provider contract, state distinction, sequencing rule or implementation obligation from the completed DD set.

### 4.3 Root Design and documentation governance

The root Design Specification remains self-contained and establishes the authoritative architecture independently of historical material.

The Project Documentation Guide already establishes that:

- the Design → Functional → Detailed Design → Implementation chain is the normative specification hierarchy;
- ADRs are decision-provenance records rather than a parallel specification system;
- project-management documentation is non-normative;
- `docs/archive/` is outside the active specification hierarchy and archived documents are non-authoritative.

No additional normative governance edit is required for the archive-absence criterion.

### 4.4 ADRs

ADR governance and the accepted ADR set were reviewed for dependency on archived material.

ADR-0001 and current ADR governance are self-contained for their current decision purpose. Historical/current implementation context is used as rationale or evidence and does not make archived documents normative dependencies.

### 4.5 README and AGENTS guidance

Repository-level guidance was reviewed for authority drift.

README/AGENTS guidance does not make archived documentation authoritative. `AGENTS.md` explicitly directs repository work toward current repository state, authoritative specifications and current implementation rather than remembered or historical documentation.

### 4.6 Implementation-adjacent template metadata

`app_manager/templates/template-repository.json` retains several citations to historical template specifications in descriptive `notes` fields.

These citations do **not** prevent conformance because the notes are self-contained:

- the `vitest-config` note states directly that the scaffolded version uses Nuxt's `@nuxt/test-utils/config` wrapper and distinguishes the internal duplicate;
- the `vitest-setup` note states directly what it mocks and that it is retained data rather than a current scaffold-consumption decision;
- the layer-installation note states directly that the generated section assumes a host-consumed layer and lacks a standalone variant;
- the JSON metadata note states directly which schema shape `JsonStrategy` recognizes and how it differs from the flat registry envelopes.

The historical citations therefore provide provenance only. Removing `docs/archive/` would make those provenance pointers unresolved, but would not remove the technical facts needed to understand the metadata or current implementation obligations.

This satisfies acceptance criterion 7 because the metadata is self-contained and does not **require** the archived specification.

Removing those provenance citations may be undertaken later as metadata hygiene, but it is not required to achieve semantic archive-absence conformance and must not be mistaken for a runtime or architectural correction.

### 4.7 Temporary audit tooling

The temporary `scripts/` directory is absent from current `master`. No temporary Python audit helper remains part of the live repository state considered by this final audit.

## 5. Final Semantic Test

The final acceptance question is:

> **If `docs/archive/` were deleted entirely, could a competent developer or AI agent understand the approved AppManager architecture, requirements, boundaries and intended implementation solely from the live documentation produced so far?**

**Yes.**

A competent reader can now establish, without consulting the archive:

- documentation authority and governance;
- root application architecture and invariants;
- the shared Application Invocation Contract and Application Engine authority model;
- managed-project and managed-scope semantics;
- effective-configuration semantics;
- shared source-inspection and transformation semantics;
- the current Functional requirements for every completed functional domain;
- the DD-1 Application Core contracts;
- the completed DD-2 shared-capability contracts through Resource Registry and Template;
- accepted technology/runtime decisions recorded by current ADRs;
- the distinction between normative authority, current implementation evidence and non-normative project-management history;
- the implementation obligations and gaps identified so far.

The archive remains useful historical provenance, but it is not required to interpret the approved live architecture or requirements.

## 6. Conformance Result

**PASS.**

The live AppManager documentation produced so far satisfies the archive-absence criterion at the final baseline stated above.

This result means:

- `docs/archive/` is historical provenance rather than interpretive authority;
- current normative specifications do not depend on archived material for completeness or conformance;
- completed Detailed Design contracts stand independently of historical evidence;
- remaining historical citations outside normative specifications do not carry required semantic content that exists only in the archive;
- removal or temporary unavailability of `docs/archive/` would not prevent a competent developer or AI agent from continuing the approved design and implementation work.

DD-2.7 AI Capability is therefore unblocked from an archive-absence governance perspective.
