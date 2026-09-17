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
> **Semantically complete pre-NCR baseline:** `0d96d6e0123072e8b2f57bfa25bd8f6554edfc19`

## 1. Objective

NCR completes the physical hierarchical rationalisation that DR did not complete.

For every independently meaningful normative rule, directive, architectural invariant or design mandate in the active Version 1 corpus, there shall be **exactly one complete canonical statement at the correct normative owner**.

Every other occurrence shall be reduced to one of:

1. a precise reference to the canonical owner;
2. a necessary concise local binding that does not restate the substance; or
3. a genuine local semantic delta introduced at that documentation level.

Duplicate normative restatement is not acceptable merely because its canonical owner is known or recorded elsewhere.

Reduction must also preserve the documentation as a usable human specification. A reader of an edited document must be able to understand that document's purpose, local responsibilities, workflow, constraints and relationship to referenced authorities without having the referenced prose copied into the document.

## 2. Baseline

PR #177 merged at `0d96d6e0123072e8b2f57bfa25bd8f6554edfc19`, and live `master` was independently verified at that exact SHA before NCR execution began.

That SHA is the **semantically complete pre-NCR baseline**. It contains the completed DR corpus plus the bounded PBC-1 semantic corrections accepted through PRs #170–#177: Version 1 GUI/interaction/portability restoration, App command correction, Nuxt command correction, Utils-to-Maintenance reclassification, AI project-environment restoration, coordinated multi-repository Git commit, coordinated multi-target/multi-artefact Docs generation/update, and coordinated multi-resource Maintenance operations.

The PBC-1 clarification documents present at this baseline are temporary normative integration vehicles. They are part of the semantics NCR must preserve, but they are not intended to survive as a parallel clarification layer: NCR-1, NCR-2 and NCR-3 shall fold each clarification's propositions into the proper primary canonical owner at the corresponding hierarchy level and retire the clarification once all affected owners have absorbed its required local semantics.

Historical baseline roles remain distinct:

- `fe30f5ad883ce2abeca2e495dd4d7036eef09da6` remains the immutable pre-DR semantic comparison baseline;
- `bf6d01b3fdf2df3bf373b352ee5ee92ae681a8d7` remains the DR-9 semantic-equivalence checkpoint;
- `8d647309e29883922a04eefe01849bd3eb15937f` remains the post-DR / pre-PBC reconciled checkpoint;
- `1268c9c1036637556386ebb3f3ba21029877df33` remains the checkpoint at which NCR control was established.

None of those historical checkpoints replaces `0d96d6e0123072e8b2f57bfa25bd8f6554edfc19` as NCR's working or final semantic-preservation comparison baseline.

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

A document also fails NCR when technically correct references leave its local design incomprehensible to a human reader. References remove duplicated normative substance; they do not remove the local narrative needed to explain what the document itself owns and how its owned responsibilities fit together.

## 4. Permitted Occurrence Classes

Every occurrence of a normative proposition is classified as exactly one of:

- `CANONICAL` — the single complete normative statement at the owning level;
- `REFERENCE` — a precise pointer to the canonical owner without substantive restatement;
- `LOCAL_BINDING` — the minimum wording required to bind the local design/implementation to the inherited rule;
- `LOCAL_DELTA` — genuinely new semantics owned by the current document;
- `DELETE_DUPLICATE` — inherited normative prose that must be physically removed.

There is no general `RETAIN` category for repeated prose. If repeated text is not canonical, a reference, a necessary local binding or a local delta, it is a duplicate.

A `REFERENCE` may include concise orienting prose that tells the reader why the authority is relevant in the present context. That prose must explain the local relationship rather than paraphrase the referenced rule.

## 5. Reduction Test

For each normative paragraph or mixed paragraph:

1. identify each independently meaningful proposition;
2. identify its normative owner under the existing hierarchy;
3. if this document owns it, retain the canonical/local statement appropriate to this level;
4. if another document owns it, replace substantive restatement with a precise reference;
5. if inherited and local semantics are mixed, split them, retain only the local delta and reference the inherited owner;
6. preserve examples only when they illustrate already-owned semantics and are clearly non-normative;
7. do not create a generic abstraction merely because several propositions have similar wording or shape;
8. read the edited section as a human reader who has not memorised the referenced source and confirm that the section still explains its own subject, local responsibility, sequence and constraints;
9. if a bare reference would make the section cryptic, retain concise contextual narrative that explains the local binding without reproducing the inherited normative proposition.

For PBC-1 clarification propositions, the same test applies. The clarification's temporary location does not become permanent ownership: identify the proper primary owner under Design -> Functional -> Detailed Design -> Implementation, integrate the proposition there as `CANONICAL`, `LOCAL_BINDING` or `LOCAL_DELTA` as appropriate, and remove the temporary duplicate occurrence when its integration obligation is complete.

## 6. Execution Passes

NCR is one finite programme. The following are execution passes, not independent meta-programmes. The PBC-1 corrections do not alter this decomposition.

### NCR-1 — Design and Functional

Establish physical single-statement ownership across Design and Functional specifications. Architectural explanation owned by Design is referenced from Functional; Functional retains observable `FR-*` obligations and Functional-owned consequences.

NCR-1 shall also integrate and retire the Design- and Functional-level PBC-1 clarification vehicles after their propositions are accounted at the proper primary owners.

Design and Functional documents must remain independently navigable and comprehensible at their own abstraction level. Functional Specifications should introduce the user-visible concern and explain the local requirement model before using precise Design references; they must not become collections of unexplained cross-references and requirement identifiers.

### NCR-2 — Detailed Design

Process the complete DD corpus. Replace inherited Design/Functional/DD-owner restatement with references and retain only DD-specific internal design contracts, local bindings and local deltas.

NCR-2 shall integrate the DD-level PBC-1 clarification deltas into the appropriate DD-2, DD-3 or DD-4 primary owner and retire those temporary DD clarification vehicles when fully accounted.

Execution may be batched as DD-1, DD-2 and DD-3/DD-4 for reviewability, but all batches remain NCR-2.

### NCR-3 — Implementation Specifications

Process all 23 primary IS documents. Retain concrete Level 4 material: interfaces, types, algorithms, provider/mechanism decisions, target layout, stale/cancellation/concurrency behaviour, error mappings, migration dispositions and independently testable conformance obligations. Remove explanatory restatement of upstream Design, Functional and DD semantics and replace it with precise references.

NCR-3 shall integrate the Implementation-level PBC-1 clarification deltas into the appropriate primary IS owners and retire those temporary Implementation clarification vehicles when fully accounted.

Execution may be divided into reviewable IS ranges, but all batches remain NCR-3.

### NCR-4 — Horizontal Reduction

After vertical reduction, eliminate remaining same-level duplicate normative statements by identifying the legitimate existing owner and referencing it. Similar naming or field shape does not establish semantic identity and shall not cause invention of generic frameworks such as a universal `StructuralFact` or base-domain abstraction.

NCR-4 shall also verify that no PBC-1 clarification survives merely as a duplicate normative restatement. Any clarification retained for a genuine compatibility or interpretive purpose must contain no duplicate canonical semantics.

### NCR-5 — Final Cardinality and Semantic Verification

Compare the final corpus against the semantically complete pre-NCR baseline `0d96d6e0123072e8b2f57bfa25bd8f6554edfc19`. For each proposition:

```text
canonical_statement_count == 1
```

and every non-canonical occurrence must be `REFERENCE`, `LOCAL_BINDING` or `LOCAL_DELTA`.

`canonical_statement_count > 1` fails NCR because duplicate normative restatement remains.

`canonical_statement_count == 0` fails NCR because semantics have been lost.

The comparison shall include the semantics introduced by every accepted PBC-1 correction present at the baseline. A proposition shall not be discarded merely because it originated in a temporary clarification rather than a primary document.

NCR-5 shall additionally perform a human-readability review of each reduced normative document. Passing cardinality is necessary but not sufficient: the resulting corpus must remain coherent, navigable and understandable without requiring a reader to reconstruct sentences from chains of references.

NCR remains open until failures are corrected. A failed verification does **not** create another rationalisation programme.

## 7. Anti-Circularity Controls

1. **Execution, not certification.** NCR-1 through NCR-4 must physically edit normative corpus documents where duplicate restatement exists. Producing an audit or register alone cannot complete an execution pass.
2. **Accounting is not reduction.** Recording a canonical owner does not make a remaining duplicate acceptable.
3. **No successor rationalisation programme.** NCR-5 findings are fixed inside NCR until the exit criteria pass.
4. **No documentation-about-documentation proliferation.** NCR uses this control document plus the minimum working proposition ledger required to execute and verify changes. Per-pass narrative reports are not required.
5. **No architecture by deduplication.** Reduction may reference existing owners but may not invent product abstractions to make prose shorter.
6. **No implementation before NCR exit.** Version 1 implementation remains paused until NCR-5 passes and the resulting live `master` is verified.
7. **No PBC reopening by default.** The semantic baseline is frozen for NCR. Reduction shall not reopen settled command or architecture design merely because integration exposes different wording. Only an actual contradiction, semantic-loss defect or unresolved authoritative conflict may justify a controlled normative correction, and it shall be corrected within NCR rather than spawning another rationalisation programme.
8. **No reference-only degradation.** NCR shall not optimise for the fewest words or references at the expense of comprehension. Concise local narrative is retained whenever it is needed to explain the document's own model, provided that narrative does not restate inherited normative substance.

## 8. Working Proposition Ledger

A single NCR working ledger shall track propositions only to the extent necessary to perform and verify physical reduction. It is assurance machinery, not normative authority.

Minimum fields:

| Field | Purpose |
|---|---|
| Proposition ID | Stable NCR verification identity |
| Canonical owner | Existing normative owner and locator |
| Canonical statement | Proposition meaning/checksum |
| Occurrences | Known corpus locations, including temporary PBC-1 clarifications where applicable |
| Occurrence class | `CANONICAL`, `REFERENCE`, `LOCAL_BINDING`, `LOCAL_DELTA`, `DELETE_DUPLICATE` |
| Action/result | Physical edit/reference/integration/clarification-retirement result |

The ledger shall be updated as execution proceeds rather than spawning separate planning/audit documents.

## 9. Physical Metrics

Each execution PR records at minimum:

- files changed;
- lines and words before/after for the affected normative corpus;
- number of duplicate normative occurrences physically removed;
- number of canonical references introduced;
- number of temporary clarification files integrated/retired where applicable;
- stable `FR-*`, DD and IS identities affected;
- unresolved NCR failures, if any;
- human-readability issues identified and corrected during the pass.

Word/line reduction is evidence of reduced text burden, not the semantic acceptance criterion. The decisive structural metric is **duplicate normative restatements remaining = 0** at NCR-5; semantic preservation and human comprehensibility remain co-equal acceptance constraints.

## 10. Branch and PR Discipline

Each execution batch branches from independently verified live `master` after the preceding batch merges. `master` is never edited directly. Each PR identifies its NCR pass and the corpus slice transformed.

Historical DR and PBC project-management evidence remains historical evidence and is not repeatedly rewritten to track NCR execution. Temporary normative PBC-1 clarification vehicles are handled according to Sections 2, 5 and 6 rather than retained as historical normative duplicates.

## 11. Exit Criteria

NCR completes only when all of the following are true:

1. every normative proposition examined by the programme has exactly one complete canonical statement;
2. all other occurrences are precise references, necessary local bindings or genuine local deltas;
3. duplicate normative restatements have been physically removed;
4. no semantic proposition present at the semantically complete pre-NCR baseline has been lost except an explicitly controlled normative correction made through its proper owner;
5. every accepted PBC-1 semantic correction present at the baseline remains accounted after its temporary clarification vehicles are integrated/retired;
6. all stable Functional requirement, DD and IS identities remain accounted;
7. every reduced normative document remains coherent, navigable and human-comprehensible at its own abstraction level without restating referenced normative material;
8. the final physical text metrics are recorded;
9. NCR-5 passes against `0d96d6e0123072e8b2f57bfa25bd8f6554edfc19`;
10. the final NCR PR is merged and live `master` independently verifies the resulting corpus.

At that point the verified live commit becomes the **Version 1 lean implementation documentation baseline**, and implementation may begin.

There is no NCR-6 and no successor documentation-rationalisation programme.
