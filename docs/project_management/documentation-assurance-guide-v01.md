# AppManager Documentation Assurance Guide

> **Document type:** Project-management assurance guide
>
> **Status:** Active
>
> **Role:** Reusable documentation review and conformance method
>
> **Normative product effect:** None. Findings produced by this method do not amend product specifications.

## 1. Purpose

This guide defines the reusable assurance method for AppManager specification and documentation reviews. It captures the principal lesson from the DD-2 programme: a vertically correct document set can still contain horizontal ownership ambiguity, duplicated semantics, inconsistent state, or dependency inversions.

Assurance must therefore test both **vertical conformance** and **horizontal coherence**.

## 2. Authority Rule

An audit, review, reconciliation, closeout, authoring guide, plan, register, map, handover, issue, pull request, or implementation observation is evidence or project control according to its role. It does not become product-design authority by identifying a defect or proposing a correction.

Where assurance identifies a genuine normative defect, the correction must be made in the owning authoritative specification or accepted decision mechanism. The assurance record then records verification of that correction.

## 3. Required Review Dimensions

### 3.1 Vertical conformance

Verify each document against the higher-level authority it refines:

```text
Project Documentation Guide
        |
        v
Design Specification
        |
        v
Functional Specification
        |
        v
Detailed Design Specification
        |
        v
Implementation Specification
```

Accepted ADRs provide decision provenance and may constrain the affected specifications, but do not replace deliberate propagation into the normative hierarchy.

### 3.2 Horizontal coherence

Compare peer and collaborating documents across the same abstraction level and across capability/domain seams. At minimum test:

1. single semantic ownership;
2. explicit consumer/owner relationships;
3. delegation without authority transfer;
4. evidence versus interpretation;
5. dependency-cycle safety;
6. mutation and authorization boundaries;
7. canonical outcome ownership;
8. provider and implementation replaceability;
9. implementation-topology independence where required by the governing level;
10. terminology and state consistency.

Similarity of names, fields, records, or workflow shape is not sufficient evidence that two contracts should be unified. Conversely, absence of a direct textual contradiction is not sufficient evidence that ownership is unambiguous.

## 4. Read-First Rule

Before proposing a normative correction:

1. verify current live repository state;
2. read the owning normative documents;
3. read directly collaborating specifications horizontally;
4. consult accepted ADRs and active clarifications;
5. use implementation only as evidence where the specification hierarchy does not already settle the question;
6. classify the finding before editing.

Historical branch names, PR states, filenames, handovers, and status statements must not be assumed current.

## 5. Finding Classification

Use these classifications:

- **confirmed defect** — authoritative documents materially conflict, duplicate semantic ownership, contain false lifecycle/state information, or leave a load-bearing contract ambiguous;
- **clarification required** — architecture is coherent but an ownership/delegation relationship is insufficiently explicit for independent implementation;
- **not sustained** — the alleged defect is stale, incorrect, or represents compatible specialisation/composition rather than conflicting ownership.

Do not turn an assurance allegation into architecture by editing first and investigating later.

## 6. Three-Layer Repetition Rule

For cross-cutting invariants use:

1. **canonical invariant** — one semantic owner;
2. **local binding statement** — concise statement of how the consumer applies the owner;
3. **local delta** — only the specialised semantics owned by the consuming document.

This is not a mandate for maximal deduplication. Safety, authority, mutation, and trust boundaries may need concise local restatement at their point of use.

## 7. State-Integrity Check

Every assurance pass must also verify project/document lifecycle truth:

- current registers reflect documents that actually exist;
- completed authoring programmes are not presented as future work;
- superseded plans/maps/handovers are not current directives;
- compatibility pointers are not mistaken for substantive authority;
- project-management records distinguish role from lifecycle state;
- active navigation identifies the next authorised objective without requiring reconstruction from history.

## 8. Closeout Rule

A work package is not closed merely because corrective edits exist on a branch. Closeout must verify the resulting live `master` state after merge.

A closeout record may state what was verified and which findings are resolved. It must not create new normative product semantics.
