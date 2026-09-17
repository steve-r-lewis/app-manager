# Docs Coordinated Generation Functional Clarification

> **Status:** Active Functional clarification
>
> **Clarifies:** `../docs-functional-specification-v01.md`
>
> **Scope:** PBC-1 observable coordinated multi-target/multi-artefact Docs behaviour
>
> **Lifecycle:** Temporary integration vehicle; NCR-1 shall fold this delta into the Docs Functional Specification and retire this clarification.

## 1. Purpose

This clarification makes explicit the observable Version 1 behaviour when one Docs invocation resolves multiple semantic documentation targets and consequently plans, generates or updates multiple documentation artefacts.

It does not add a command. It refines the existing multi-target, generation/update, AI-enrichment, continuation and partial-effect requirements.

## 2. Coordinated Documentation Scope

**FR-DOCS-PBC-001 — Coordinated semantic scope**  
A Docs invocation may resolve one semantic target or a bounded semantic target set, including complete-application and all-managed-layer scopes, according to managed-project context and the selected documentation profile.

**FR-DOCS-PBC-002 — Cardinality is not command identity**  
The number of resolved documentation targets or planned artefacts shall not create a separate bulk/all command identity.

**FR-DOCS-PBC-003 — No silent scope broadening**  
A single-target request shall not silently broaden to all layers, the complete application or another multi-target scope.

**FR-DOCS-PBC-004 — Duplicate normalization**  
Overlapping semantic scopes shall be normalized so the same logical target is not unintentionally processed multiple times in one coordinated invocation.

## 3. Artefact Planning and Mutation Disposition

**FR-DOCS-PBC-005 — Artefact plan before consequential effects**  
Before coordinated documentation writes begin, AppManager shall derive a bounded plan identifying the documentation artefacts that may be produced or changed and their semantic relationship to the resolved documentation targets.

**FR-DOCS-PBC-006 — Independent artefact disposition**  
Each planned artefact shall independently resolve whether it requires generation, an explicitly permitted update, no effect because it is already satisfied, skipping, refusal, unsupported handling, blocking or an indeterminate result.

**FR-DOCS-PBC-007 — Generation remains creation**  
Coordinated scope shall not convert generation into implicit replacement or overwrite of an existing documentation resource.

**FR-DOCS-PBC-008 — Update remains explicit**  
Existing-resource mutation shall retain explicit update intent, exact target/revision requirements and applicable ownership/preservation constraints even when many artefacts are coordinated.

**FR-DOCS-PBC-009 — Mixed dispositions permitted**  
One coordinated invocation may validly contain different per-artefact dispositions, including generation for one artefact, managed update for another and already-satisfied or refused status for another.

## 4. Operation Without AI

**FR-DOCS-PBC-010 — Deterministic non-AI path**  
A coordinated Docs operation shall support deterministic documentation production without requiring AI where the selected documentation profile can be satisfied from accepted evidence, approved declarative resources/templates and deterministic Documentation Capability behaviour.

**FR-DOCS-PBC-011 — AI absence does not redefine scope**  
Absence or unavailability of optional AI assistance shall not alter the resolved managed documentation scope or silently select different documentation targets.

## 5. AI-Assisted Coordinated Documentation

**FR-DOCS-PBC-012 — Bounded AI proposals**  
Where effective policy permits AI assistance, Docs may request bounded AI enrichment or proposed content for one or more planned documentation artefacts while retaining Docs ownership of intent, context selection, validation and acceptance.

**FR-DOCS-PBC-013 — Automatic acceptance under prior policy**  
A previously authorised Docs workflow may automatically accept a valid AI-generated documentation proposal without per-artefact human confirmation only when deterministic Docs-owned validation and acceptance criteria were resolved before generation.

**FR-DOCS-PBC-014 — Interactive review remains supported**  
Effective policy may instead require human review, revision or explicit acceptance of AI-generated documentation before a consequential effect.

**FR-DOCS-PBC-015 — AI cannot authorise effects**  
AI output shall not select or broaden documentation scope, choose unrelated output destinations, authorize generation/update, weaken preservation or disclosure policy, persist documentation directly or determine application success.

**FR-DOCS-PBC-016 — Equivalent postconditions**  
AI-assisted and deterministic documentation artefacts shall be evaluated against the same owning Docs postconditions for the selected target/profile. AI assistance shall not lower correctness, provenance, preservation or validation requirements.

## 6. Per-Artefact Validation and Results

**FR-DOCS-PBC-017 — Per-artefact validation**  
Each consequential documentation artefact shall be validated sufficiently to determine whether its resolved target/profile and output postconditions were satisfied.

**FR-DOCS-PBC-018 — Provider success is insufficient**  
Successful rendering, AI completion, process completion or resource persistence shall not by itself establish successful documentation of the artefact or coordinated invocation.

**FR-DOCS-PBC-019 — Per-target and per-artefact reporting**  
The structured result of a coordinated operation shall preserve sufficient target and artefact identity to report generated, updated, already-satisfied, skipped, unsupported, refused, failed, cancelled and indeterminate states without collapsing them into a false uniform result.

## 7. Continuation, Cancellation and Partial Effects

**FR-DOCS-PBC-020 — Coordinated mutation is non-transactional by default**  
A coordinated multi-artefact Docs operation shall not claim universal cross-resource atomicity or rollback where those semantics are not actually provided.

**FR-DOCS-PBC-021 — Completed effects remain truthful**  
If an earlier artefact is successfully created or updated and a later artefact fails, the earlier completed effect shall remain reported as completed.

**FR-DOCS-PBC-022 — Explicit continuation policy**  
Continuation after an individual target or artefact failure shall follow explicit Docs-domain policy and shall preserve attributable outcomes for work already attempted.

**FR-DOCS-PBC-023 — Cancellation**  
Cancellation shall prevent initiation of further consequential effects as soon as safely practical while preserving truthful evidence for completed writes, generated proposals and other completed work.

**FR-DOCS-PBC-024 — Canonical partial completion**  
Per-target and per-artefact evidence shall support the Application Engine in publishing the canonical outcome appropriate to complete success, partial success, failure or cancellation.

## 8. Headless and Interaction Equivalence

**FR-DOCS-PBC-025 — Deterministic Headless bulk operation**  
A Headless coordinated Docs invocation shall resolve its semantic target/profile, output policy and AI-review/acceptance policy without interactive prompting or implicit target guessing.

**FR-DOCS-PBC-026 — Interaction equivalence**  
TUI, GUI and Headless adapters may present coordinated documentation differently but shall preserve equivalent target, artefact, mutation, AI-acceptance, continuation and outcome semantics.

## 9. Catalogue Impact

This clarification adds no canonical Docs command. Docs remains at **13** commands and the Version 1 catalogue remains **96** commands.
