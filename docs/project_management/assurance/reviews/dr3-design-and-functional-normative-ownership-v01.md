# DR-3 Design and Functional Normative Ownership

> **Document type:** Project-management assurance review
>
> **Version:** 01
>
> **Status:** Complete on DR-3 branch; close after merge/live-master verification
>
> **Normative product effect:** None
>
> **DR-3 source baseline:** `f3e56df744a22c3e6eec9a06bf750ee5233cae87`
>
> **Frozen DR semantic source baseline:** `fe30f5ad883ce2abeca2e495dd4d7036eef09da6`

## 1. Objective

DR-3 establishes the canonical normative ownership map for recurrent Design/Functional invariants before the major DD/Functional/IS rationalisation packages begin.

The package is intentionally ownership-first. It does not delete downstream repetition before the consuming documents are reviewed in DR-4 through DR-7.

## 2. Live-State Verification

PR #160 was independently verified `closed` and `merged` at `2026-09-16T22:44:12Z`, with merge commit:

`f3e56df744a22c3e6eec9a06bf750ee5233cae87`

Live `master` was independently verified at the same commit before the DR-3 session branch was created.

DR-2 is therefore closed for programme sequencing purposes.

## 3. Read-First Horizontal Review

The recurrent clusters were checked against the root Design Specification and the Functional specifications that already express their observable consequences. The review also searched downstream DD/IS material to confirm why each cluster recurs and to ensure that local refinements are not mistaken for duplicate owner-level semantics.

The key result is that the corpus does **not** need a new generic invariant specification or cross-cutting framework. Existing Design and Functional documents already provide adequate canonical owners.

## 4. Ownership Findings

### DR3-01 — Delegated execution versus application authority

**Owner:** Design §§6.6 and 11; Application Invocation FR-INV-001–002.

The Design already states that capability providers may own specialist mechanics while AppManager retains policy/outcome authority. Application Invocation makes the rule functionally testable across invocation paths.

**Disposition:** CONSOLIDATE ownership mapping; later consumers REFERENCE and retain only local delegation/evidence/interpretation deltas.

### DR3-02 — Recognition/reachability versus mutation authority

**Owner:** Design §9; Managed Project FR-PROJ-037–049, especially FR-PROJ-043–048.

Managed Project already distinguishes recognition, managed scope, targetability, ownership and consequential eligibility. Filesystem/repository accessibility is not permission.

**Disposition:** CONSOLIDATE ownership mapping; retain command-specific target rules downstream.

### DR3-03 — Technical/provider success versus application success

**Owner:** Design §§7.7 and 11; Application Invocation FR-INV-001–002, with domain-specific acceptance retained by the owning Functional domain.

Provider completion is subordinate evidence. The owning use case interprets it and final application acceptance remains application authority.

**Disposition:** CONSOLIDATE general ownership; retain domain acceptance semantics.

### DR3-04 — Evidence versus interpretation

**Owner:** Design §§7.2, 9.6 and 11; Managed Project FR-PROJ-002 and Application Invocation FR-INV-002.

The general rule is already present: discovered/provider/technical information contributes evidence; participation does not make that source authoritative. Domain/capability documents may still define unique evidence models and interpretation rules.

**Disposition:** CONSOLIDATE general ownership; retain local evidence/interpretation contracts.

### DR3-05 — Generation versus transformation

**Owner:** Design §§6.8 and 7; Source Transformation FR-XFORM-044–045.

The Design distinguishes new-artefact generation from existing-source mutation. Source Transformation provides the canonical cross-domain Functional distinction.

**Disposition:** CONSOLIDATE general ownership; retain domain-specific artefact sets, collision/update semantics and validation.

### DR3-06 — AI output versus application authority

**Owner:** Design §10.6; AI FR-AI-002–005; Source Transformation FR-XFORM-059 for source-change proposals.

AI output remains subordinate to application intent, scope, validation and acceptance. AI assistance inside another domain does not transfer use-case ownership.

**Disposition:** CONSOLIDATE general ownership; retain AI context/disclosure/provider constraints and consuming-domain acceptance.

### DR3-07 — Managed scope versus filesystem reachability

**Owner:** Design §§9.4–9.7; Managed Project FR-PROJ-037–049 and FR-PROJ-059–060.

Project topology and physical accessibility may contribute evidence, but consequential scope is a resolved semantic boundary.

**Disposition:** CONSOLIDATE general ownership; retain command-specific scope forms and exclusions.

### DR3-08 — Settings persistence versus effective-configuration precedence

**Owner:** Design §§8.1–8.4 and 10.10; Configuration FR-CONFIG-001–008; Settings FR-SET-001–005.

Configuration owns candidate applicability/precedence/effective values. Settings owns persisted settings/resource-management intent. A durable write is not itself a precedence decision or an automatic change to already-resolved runtime semantics.

**Disposition:** CONSOLIDATE ownership mapping; retain concern-specific Settings CRUD and Configuration rules.

### DR3-09 — Domain intent/policy/orchestration versus capability mechanics

**Owner:** Design §§6.5–6.6, 10.11 and 11; Application Invocation FR-INV-001–002 plus each domain Functional Specification's owned/non-owned behaviour.

Domains organise application intent and domain policy; shared capabilities provide bounded specialist mechanics. Delegation does not transfer the primary use-case identity.

**Disposition:** CONSOLIDATE general ownership; retain each domain/capability's actual local contract.

## 5. Owner-Level Duplication Assessment

The required canonical semantics already exist in the Design/Functional corpus. DR-3 found no need to delete or renumber `FR-*` requirements and no owner-level contradiction requiring a new normative clarification.

Aggressive edits to the root Design or Functional bodies at this stage would create unnecessary semantic risk and would overlap DR-6. The correct DR-3 output is therefore a precise ownership index and semantic disposition register, followed by consumer-level rationalisation in the packages that own those documents.

This is a deliberate result, not an incomplete package: DR-3 answers **where each repeated invariant belongs** before DR-4 starts removing repeated DD-2 prose.

## 6. Deliverables

Created:

- `docs/project_management/normative-ownership-map-v01.md`;
- `docs/project_management/assurance/reconciliations/dr3-semantic-disposition-register-v01.md`;
- this assurance review.

Updated current-state navigation to advance the programme state.

## 7. Architecture Preservation

The ownership map preserves:

- top-down Design -> Functional -> DD -> IS authority;
- DD-1 final Application Engine authority;
- managed scope and targetability distinct from discovery/reachability;
- evidence distinct from interpretation;
- capability mechanics distinct from domain intent/policy/orchestration;
- Source Transformation ownership of existing-source semantic mutation;
- AI output as non-authoritative proposal/evidence;
- Configuration precedence distinct from Settings persistence;
- provider replaceability and implementation-topology independence.

No generic invariant framework, new subsystem, command identity, provider contract or runtime topology was introduced.

## 8. Exit Criteria

DR-3 passes on branch because:

1. PR #160 and resulting live `master` were independently verified before branching;
2. all nine initial invariant clusters were reviewed against current Design/Functional authorities;
3. each cluster has an explicit canonical owner and downstream local-delta rule;
4. no owner was selected merely because its wording was repeated most often;
5. no `FR-*` requirement was removed, renumbered or weakened;
6. no new architecture was inferred from repetition;
7. semantic dispositions are recorded against the frozen DR source baseline;
8. DR-4 now has a stable owner map for DD-2 rationalisation.

## 9. Decision

**PASS — DR-3 COMPLETE ON BRANCH.**

After merge and independent live-master verification, proceed to **DR-4 — DD-2 Shared Capability Rationalisation**.