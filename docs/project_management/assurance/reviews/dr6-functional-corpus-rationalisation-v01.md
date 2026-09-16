# DR-6 — Functional Corpus Rationalisation Review

> **Status:** Complete — PASS
>
> **Verified branch base:** `be682eb3947e2d1447d1f21ff293ea53003f69e1`
>
> **Frozen semantic source baseline:** `fe30f5ad883ce2abeca2e495dd4d7036eef09da6`

## 1. Objective

DR-6 rationalises the Functional corpus while preserving every `FR-*` obligation and Functional-owned observable consequence. It verifies recurrent Design explanation, cross-functional boundaries, traceability vocabulary, completed decomposition-plan references, DR-2's Nuxt scaffold ownership correction, conformance summaries and downstream-boundary sections.

## 2. Baseline Verification

PR #163 was independently verified merged and closed. Its merge commit and live `master` were independently verified as `be682eb3947e2d1447d1f21ff293ea53003f69e1` before `ai/dr6-functional-corpus-rationalisation` was created.

## 3. Horizontal Result

The Functional corpus already contains strong explicit `FR-*` contracts. The principal rationalisation problem is repeated architectural explanation and traceability presentation, not missing observable behaviour.

Four repetition classes were confirmed: Design inheritance; cross-Functional boundary restatement; traceability vocabulary mixing true authority with downstream architectural names; and completed programme provenance in traceability rows. None justifies a generic Functional framework.

## 4. Functional Authority Model

```text
Root Design invariant
    -> owning Functional observable requirement (`FR-*`)
        -> explicit same-level Functional collaboration
            -> Detailed Design refinement
                -> Implementation Specification
```

A downstream DD/capability/domain name may be useful traceability but cannot be upstream authority for a Functional requirement.

## 5. DR-2 Fold-Forward Verification

The active Nuxt Layer Scaffold Functional Ownership Clarification already makes `FR-NUXT-058/059` self-sufficient Functional authority and explicitly classifies the DD scaffold clarification as downstream refinement. DR-6 incorporates that correction into the corpus-wide reading rule rather than risking a mechanical rewrite of the dense primary Nuxt body.

The older Nuxt §11.1 wording is therefore not permitted to reverse authority direction. A later physical fold-forward may remove the stale sentence only with proposition-level equivalence verification.

## 6. Traceability Vocabulary

The existing Functional Traceability Authority Vocabulary Clarification is retained and reinforced. Older tables using `Current authority` or `Primary current authority` are read in two directions: upstream/same-level normative authority versus downstream refinement destination.

This preserves useful downward traceability without promoting Repository Capability, Source Intelligence, Process Execution, Resource Registry and Template, Quality boundary or similar DD vocabulary into Functional authority.

## 7. Why No Bulk Primary-Body Deletion

Many apparently repetitive domain requirements are observable consequences of inherited Design invariants. Removing them because the architectural principle is repeated would reduce independently testable Functional coverage.

DR-6 therefore distinguishes repeated explanation, which can be referenced/consolidated, from domain-specific observable consequence, which remains normative. No `FR-*` requirement is removed or renumbered.

## 8. Conformance and Downstream Boundaries

Functional conformance summaries remain grouped verification surfaces; they do not replace requirement bodies. Downstream Specification Boundary sections remain useful abstraction constraints and do not authorize DD/IS documents to supply missing Functional meaning.

## 9. Semantic Accounting

Accounting is recorded in `assurance/reconciliations/dr6-semantic-disposition-register-v01.md`. No proposition is classified as bare `REMOVE`; dominant dispositions are `REFERENCE`, `RETAIN`, `CONSOLIDATE` and `CORRECT`.

## 10. Architecture Preservation

DR-6 preserves root Design authority; every Functional specification's `FR-*` ownership; Invocation/Managed Project/Configuration/Source Transformation contracts; all eight domain distinctions; delegated execution without authority transfer; evidence versus interpretation; managed scope versus reachability; Settings persistence versus precedence; AI proposal/evidence semantics; provider replaceability; and implementation-topology independence.

## 11. Package Result

**PASS.** DR-6 establishes a corpus-wide rationalised Functional reading, resolves traceability authority interpretation, carries forward the DR-2 Nuxt correction at Functional level, preserves all `FR-*` identities and obligations, and records semantic dispositions for DR-9.

## 12. Next Objective

After merge and independent live-master verification, proceed to **DR-7 — Implementation Specification Rationalisation**. DR-7 must conservatively preserve concrete interfaces, types, provider decisions, current-vs-target evidence, migration dispositions, algorithms/mechanisms and independently testable conformance obligations.