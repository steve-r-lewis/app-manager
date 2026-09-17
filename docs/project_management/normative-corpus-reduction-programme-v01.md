# AppManager Normative Corpus Reduction Programme

> **Document type:** Project-management execution control
>
> **Version:** 01
>
> **Status:** Active
>
> **Programme:** NCR — Normative Corpus Reduction
>
> **Normative product effect:** None. This document controls reduction work; normative authority remains with the established documentation hierarchy.
>
> **Semantically reconciled pre-NCR baseline:** `8d647309e29883922a04eefe01849bd3eb15937f`

## 1. Objective

NCR completes the physical hierarchical rationalisation that DR did not complete.

For every independently meaningful normative rule, directive, architectural invariant or design mandate in the active Version 1 corpus, there shall be **exactly one complete canonical statement at the correct normative owner**.

Every other occurrence shall be reduced to one of:

1. a precise reference to the canonical owner;
2. a necessary concise local binding that does not restate the substance; or
3. a genuine local semantic delta introduced at that documentation level.

Duplicate normative restatement is not acceptable merely because its canonical owner is known or recorded elsewhere.

## 2. Baseline

PR #168 merged at `8d647309e29883922a04eefe01849bd3eb15937f`, and live `master` was independently verified at that exact SHA before NCR was established.

That SHA is the **semantically reconciled pre-NCR baseline**. It preserves the completed DR corrections and semantic accounting while acknowledging that physical single-statement reduction remains incomplete.

The earlier `fe30f5ad883ce2abeca2e495dd4d7036eef09da6` SHA remains the historical pre-DR semantic comparison baseline. The DR-9/PR #167 SHA remains evidence of the semantic-equivalence checkpoint. Neither replaces the post-PR-168 live state as NCR's working comparison baseline.

## 3. Definitive Rule

The NCR cardinality rule is:

```text
one normative proposition
    -> one canonical owner
    -> one complete canonical statement
    -> zero duplicate normative restatements
```

Downstream documents reference inherited semantics and state only their local binding and local delta.

A downstream paragraph fails NCR when it substantially restates an inherited proposition even if the paragraph is correct.

## 4. Permitted Occurrence Classes

Every occurrence of a normative proposition is classified as exactly one of:

- `CANONICAL` — the single complete normative statement at the owning level;
- `REFERENCE` — a precise pointer to the canonical owner without substantive restatement;
- `LOCAL_BINDING` — the minimum wording required to bind the local design/implementation to the inherited rule;
- `LOCAL_DELTA` — genuinely new semantics owned by the current document;
- `DELETE_DUPLICATE` — inherited normative prose that must be physically removed.

There is no general `RETAIN` category for repeated prose. If repeated text is not canonical, a reference, a necessary local binding or a local delta, it is a duplicate.

## 5. Reduction Test

For each normative paragraph or mixed paragraph:

1. identify each independently meaningful proposition;
2. identify its normative owner under the existing hierarchy;
3. if this document owns it, retain the canonical/local statement appropriate to this level;
4. if another document owns it, replace substantive restatement with a precise reference;
5. if inherited and local semantics are mixed, split them, retain only the local delta and reference the inherited owner;
6. preserve examples only when they illustrate already-owned semantics and are clearly non-normative;
7. do not create a generic abstraction merely because several propositions have similar wording or shape.

## 6. Execution Passes

NCR is one finite programme. The following are execution passes, not independent meta-programmes.

### NCR-1 — Design and Functional

Establish physical single-statement ownership across Design and Functional specifications. Architectural explanation owned by Design is referenced from Functional; Functional retains observable `FR-*` obligations and Functional-owned consequences.

### NCR-2 — Detailed Design

Process the complete DD corpus. Replace inherited Design/Functional/DD-owner restatement with references and retain only DD-specific internal design contracts, local bindings and local deltas.

Execution may be batched as DD-1, DD-2 and DD-3/DD-4 for reviewability, but all batches remain NCR-2.

### NCR-3 — Implementation Specifications

Process all 23 primary IS documents. Retain concrete Level 4 material: interfaces, types, algorithms, provider/mechanism decisions, target layout, stale/cancellation/concurrency behaviour, error mappings, migration dispositions and independently testable conformance obligations. Remove explanatory restatement of upstream Design, Functional and DD semantics and replace it with precise references.

Execution may be divided into reviewable IS ranges, but all batches remain NCR-3.

### NCR-4 — Horizontal Reduction

After vertical reduction, eliminate remaining same-level duplicate normative statements by identifying the legitimate existing owner and referencing it. Similar naming or field shape does not establish semantic identity and shall not cause invention of generic frameworks such as a universal `StructuralFact` or base-domain abstraction.

### NCR-5 — Final Cardinality and Semantic Verification

Compare the final corpus against the semantically reconciled pre-NCR baseline. For each proposition:

```text
canonical_statement_count == 1
```

and every non-canonical occurrence must be `REFERENCE`, `LOCAL_BINDING` or `LOCAL_DELTA`.

`canonical_statement_count > 1` fails NCR because duplicate normative restatement remains.

`canonical_statement_count == 0` fails NCR because semantics have been lost.

NCR remains open until failures are corrected. A failed verification does **not** create another rationalisation programme.

## 7. Anti-Circularity Controls

1. **Execution, not certification.** NCR-1 through NCR-4 must physically edit normative corpus documents where duplicate restatement exists. Producing an audit or register alone cannot complete an execution pass.
2. **Accounting is not reduction.** Recording a canonical owner does not make a remaining duplicate acceptable.
3. **No successor rationalisation programme.** NCR-5 findings are fixed inside NCR until the exit criteria pass.
4. **No documentation-about-documentation proliferation.** NCR uses this control document plus the minimum working proposition ledger required to execute and verify changes. Per-pass narrative reports are not required.
5. **No architecture by deduplication.** Reduction may reference existing owners but may not invent product abstractions to make prose shorter.
6. **No implementation before NCR exit.** Version 1 implementation remains paused until NCR-5 passes and the resulting live `master` is verified.

## 8. Working Proposition Ledger

A single NCR working ledger shall track propositions only to the extent necessary to perform and verify physical reduction. It is assurance machinery, not normative authority.

Minimum fields:

| Field | Purpose |
|---|---|
| Proposition ID | Stable NCR verification identity |
| Canonical owner | Existing normative owner and locator |
| Canonical statement | Proposition meaning/checksum |
| Occurrences | Known corpus locations |
| Occurrence class | `CANONICAL`, `REFERENCE`, `LOCAL_BINDING`, `LOCAL_DELTA`, `DELETE_DUPLICATE` |
| Action/result | Physical edit/reference result |

The ledger shall be updated as execution proceeds rather than spawning separate planning/audit documents.

## 9. Physical Metrics

Each execution PR records at minimum:

- files changed;
- lines and words before/after for the affected normative corpus;
- number of duplicate normative occurrences physically removed;
- number of canonical references introduced;
- stable `FR-*`, DD and IS identities affected;
- unresolved NCR failures, if any.

Word/line reduction is evidence of reduced text burden, not the semantic acceptance criterion. The decisive metric is **duplicate normative restatements remaining = 0** at NCR-5.

## 10. Branch and PR Discipline

Each execution batch branches from independently verified live `master` after the preceding batch merges. `master` is never edited directly. Each PR identifies its NCR pass and the corpus slice transformed.

Historical DR documents remain historical evidence and are not repeatedly rewritten to track NCR execution.

## 11. Exit Criteria

NCR completes only when all of the following are true:

1. every normative proposition examined by the programme has exactly one complete canonical statement;
2. all other occurrences are precise references, necessary local bindings or genuine local deltas;
3. duplicate normative restatements have been physically removed;
4. no baseline semantic proposition has been lost except an explicitly controlled normative correction made through its proper owner;
5. all stable Functional requirement, DD and IS identities remain accounted;
6. the final physical text metrics are recorded;
7. NCR-5 passes against `8d647309e29883922a04eefe01849bd3eb15937f`;
8. the final NCR PR is merged and live `master` independently verifies the resulting corpus.

At that point the verified live commit becomes the **Version 1 lean implementation documentation baseline**, and implementation may begin.

There is no NCR-6 and no successor documentation-rationalisation programme.