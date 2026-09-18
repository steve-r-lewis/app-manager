# AppManager Documentation Corpus Rationalisation Programme

> **Document type:** Project-management programme plan and control baseline
>
> **Version:** 01
>
> **Status:** Closed
>
> **Programme:** DR — Documentation Rationalisation
>
> **Normative product effect:** None. This plan controls editorial/reconciliation work; it does not create or amend product requirements, architecture, Detailed Design contracts, Implementation Specification contracts, or ADR decisions.
>
> **Frozen semantic source baseline:** `fe30f5ad883ce2abeca2e495dd4d7036eef09da6`
>
> **Closeout record:** [Documentation Rationalisation Programme Closeout](history/closeouts/documentation-rationalisation-programme-closeout-v01.md)

## 1. Purpose

This programme reduces bloat, repetition and duplicate semantic statements across the Version 1 documentation corpus while preserving every independently meaningful proposition unless a later work package deliberately corrects a verified normative defect through the owning authority.

The programme applies the repository's existing hierarchical-reference rule:

> **State a semantic rule once at its canonical normative owner; downstream documents reference that owner and specify only the local binding and local delta.**

The objective is not a percentage reduction in words. The objective is a smaller, clearer corpus with fewer parallel normative copies, stronger ownership, lower drift risk and **zero unaccounted semantic loss**.

## 2. Programme Trigger and Evidence

Package D/PR #157 established the final pre-rationalisation documentation baseline but required post-merge live-`master` verification before closeout. That verification has now been performed: PR #157 is merged and closed and live `master` is `fe30f5ad883ce2abeca2e495dd4d7036eef09da6`.

A subsequent independent external review of all 130 files under `docs/` reported that the architecture is substantially more coherent than the prose suggests, but identified corpus-wide duplication as the dominant structural defect and alleged a small number of correctness, authority-direction and lifecycle defects that must be verified before structural editing.

External reports are assurance evidence, not normative product authority. Their allegations enter this programme as verification candidates and must be classified against the live authoritative repository before editing.

## 3. Frozen Semantic Source Baseline

The immutable comparison source for this programme is:

`fe30f5ad883ce2abeca2e495dd4d7036eef09da6`

This is the merge commit of PR #157 on `master` and is the corpus against which DR-9 will prove semantic accounting.

Later DR packages will necessarily produce corrected/rationalised live baselines. They do not replace this SHA as the source comparison point.

### 3.1 Why the baseline is frozen

Without a frozen source, later editorial changes could erase the evidence needed to prove whether a proposition was retained, referenced, relocated, corrected or removed as genuine redundancy.

The baseline therefore serves as a semantic ledger source, not as a claim that every statement in it is correct.

## 4. Governing Rules

### DR-R01 — Single normative ownership

Every architectural rule, requirement or semantic contract must have one identifiable normative owner. Similar statements elsewhere are consumers, bindings, refinements or duplicates; they do not become independent owners by repetition.

### DR-R02 — Reference inherited semantics

A lower-level document references inherited normative semantics and states only the refinement appropriate to its level.

```text
Design
  -> Functional
      -> Detailed Design
          -> Implementation Specification
```

A lower level must not become necessary to determine the meaning of a higher-level contract.

### DR-R03 — Canonical invariant, local binding, local delta

For a cross-cutting invariant retain only:

1. the canonical invariant at its owner;
2. a concise local binding where the consumer must make the relationship explicit;
3. the consumer's unique local delta.

### DR-R04 — State once within a document

Once a document establishes its local binding or local rule, later sections reference it rather than paraphrasing it repeatedly. Concise repetition is retained only where omission would make a safety, authority, mutation, trust or public-contract boundary materially ambiguous.

### DR-R05 — Examples do not create semantics

Examples and diagrams may replace repetitive explanation only when they demonstrate already-defined contracts. They do not establish new requirements, defaults, providers, commands, states, paths or policy.

### DR-R06 — No architecture by editorial similarity

Repeated names, field shapes, workflows or disclaimers do not justify a generic framework or merged semantic contract. Rationalisation removes duplicate prose; it does not invent product abstractions.

### DR-R07 — Correctness precedes deduplication

A contradiction or ambiguous ownership seam must be classified and, where necessary, corrected by its normative owner before duplicated statements around it are consolidated.

### DR-R08 — No mechanical corpus rewrite

Every edited document is read against its governing and collaborating authorities. Corpus-wide search may identify candidates, but no text is removed solely because it resembles text elsewhere.

### DR-R09 — Semantic preservation beats word-count reduction

Line/word reduction is an outcome metric, never an acceptance criterion. A package fails if it reduces prose by losing an independently meaningful proposition.

### DR-R10 — Post-merge closeout is separate

A work-package PR cannot certify its own resulting live state. After merge, live `master` must be verified before the package is recorded closed and before the next package branches.

## 5. Semantic Proposition Inventory

DR uses a semantic inventory rather than prose identity as its zero-loss control.

An **independently meaningful proposition** is a statement whose removal could change implementation, validation, authorization, observable behaviour, ownership, failure handling, security, extension behaviour, or conformance interpretation.

Each proposition is classified as one or more of:

- `AUTHORITY` — semantic or decision ownership;
- `REQUIREMENT` — observable or required behaviour;
- `CONTRACT` — interface or collaboration semantics;
- `PROHIBITION` — behaviour explicitly forbidden;
- `PRECONDITION` — condition required before an operation/decision;
- `POSTCONDITION` — guaranteed state/evidence after an operation;
- `STATE_TRANSITION` — meaningful lifecycle/state change;
- `FAILURE_SEMANTIC` — failure classification/meaning;
- `CANCELLATION_SEMANTIC` — cancellation behaviour/meaning;
- `MUTATION_RULE` — mutation intent, authorization, stale-state or effect rule;
- `SECURITY_RULE` — trust, disclosure, secret or sensitive-data constraint;
- `PROVIDER_CONSTRAINT` — provider selection/replaceability/native-semantics constraint;
- `TRACEABILITY_RELATION` — governing/derived requirement relationship;
- `CONFORMANCE_OBLIGATION` — independently testable verification duty.

The inventory is semantic, not sentence-based: several sentences may express one proposition, and one sentence may contain several propositions.

## 6. Rationalisation Dispositions

Every meaningful source proposition affected by editing must receive an accountable disposition:

| Disposition | Meaning |
|---|---|
| `RETAIN` | Unique information remains at the correct owner. |
| `REFERENCE` | Duplicate inherited semantics are replaced by a precise reference to the canonical owner plus any necessary local binding. |
| `CONSOLIDATE` | Multiple statements at the same owner become one canonical statement without loss. |
| `RELOCATE` | Valid information moves to the correct abstraction level or document owner. |
| `ILLUSTRATE` | Repetitive explanatory material becomes a clearly non-normative example/diagram while normative propositions remain elsewhere. |
| `CORRECT` | A verified defective proposition is deliberately changed through the owning normative authority and the correction is recorded. |
| `REMOVE` | Material contains no independently meaningful proposition and is genuine redundancy/editorial noise. |

`REMOVE` is intentionally the strongest burden-of-proof disposition. Most bloat reduction should arise through `REFERENCE` and `CONSOLIDATE`.

## 7. Rationalisation Register

Each work package maintains a register for the documents it changes. At minimum each entry records:

| Field | Purpose |
|---|---|
| Source document | Frozen-baseline/current document containing candidate material |
| Source locator | Stable ID/heading and section where available |
| Proposition class | Category from §5 |
| Canonical owner | Normative document/contract that owns the semantic rule |
| Local delta | Unique semantics that must remain in the consuming document |
| Disposition | §6 value |
| Destination/reference | Where the proposition remains reachable |
| Verification | How semantic preservation/correction was checked |

The register may be maintained as package assurance tables rather than one giant file, provided DR-9 can aggregate the accounting.

## 8. Work Packages

### DR-0 — Post-Baseline Verification and Rationalisation Control

**Objective:** close the Package D post-merge lifecycle gap and establish the frozen source baseline, semantic inventory, dispositions, package sequence and closeout rule.

**Deliverables:**

- this programme plan;
- a DR-0 assurance/closeout record;
- current-state README update;
- frozen source baseline `fe30f5ad883ce2abeca2e495dd4d7036eef09da6`;
- candidate-finding register for DR-1/DR-2;
- explicit ADR-governance decision point without forcing retroactive ADR creation.

### DR-1 — Contract and Ownership Corrections

**Objective:** verify alleged live semantic contradictions before deduplication.

Required candidates:

1. IS-1 versus IS-22 `InteractionCapabilities` contract;
2. DD-3.3 versus the active Nuxt operation-identity clarification;
3. App root creation versus Nuxt baseline-configuration ownership.

Each candidate is classified `confirmed defect`, `clarification required`, or `not sustained` before editing. No preferred answer from an external audit is adopted without normative verification.

### DR-2 — Authority and Hierarchy Corrections

**Objective:** ensure references point in the correct authority direction before structural reduction.

Required candidates:

- FR-NUXT-058/059 dependence on DD-level clarification;
- AI Functional ownership clarification's authority/filing level;
- DD-2 sibling “Conformance Rules for Later DD-2 Designs”;
- DD-level architectural subsystem vocabulary appearing as undefined Functional authority.

### DR-3 — Design and Functional Normative Ownership

**Objective:** create the canonical normative ownership map for recurrent invariants and rationalise owner-level duplication where safe.

Initial invariant clusters include:

- delegated execution versus application authority;
- recognition/reachability versus mutation/operation authority;
- technical/provider success versus application success;
- evidence versus interpretation;
- generation versus transformation;
- AI output versus application authority;
- managed scope versus filesystem reachability;
- Settings persistence versus effective-configuration precedence;
- domain intent/policy/orchestration versus capability mechanics.

### DR-4 — DD-2 Shared Capability Rationalisation

**Objective:** use the ten DD-2 documents as the first major application of canonical owner -> local binding -> local delta.

In addition to invariant reduction, verify and disposition:

- sibling conformance-rule sections not already resolved by DR-2;
- `Current Implementation Evidence and Reconciliation` sections against the corresponding Level 4 Implementation Specifications;
- repeated diagrams and repeated authority explanations.

Implementation evidence is removed from DD only where its meaningful content is demonstrably preserved at the proper Level 4/project-management owner.

### DR-5 — DD-3/DD-4 Domain Rationalisation

**Objective:** reduce inherited DD-1/DD-2 restatement across the nine domain designs while preserving domain intent, policy, orchestration, evidence interpretation and domain-specific acceptance semantics.

Capability specifications are referenced rather than recreated. Repeated cross-domain statements receive a canonical owner before consolidation.

### DR-6 — Functional Corpus Rationalisation

**Objective:** reduce repeated Design/cross-cutting Functional explanation while preserving every `FR-*` obligation and Functional-owned semantic consequence.

Also verify front-matter/traceability vocabulary where it affects readability or authority clarity. Functional documents must not require DD documents to determine their own meaning.

### DR-7 — Implementation Specification Rationalisation

**Objective:** perform a conservative rationalisation of IS-1 through IS-23.

The Implementation layer is treated as high-value evidence and concrete Level 4 specification. Preserve interfaces, types, provider decisions, current-vs-target evidence, migration dispositions, algorithms/mechanisms and independently testable conformance obligations. Reduce only genuine upstream architectural re-explanation and safe presentational repetition.

### DR-8 — Documentation and Project-Management Hygiene

**Objective:** address low-risk hygiene only after semantic/authority work is stable.

Candidates include compatibility stubs, redundant `.gitkeep`, IS heading conventions, Functional front matter/modal convention, stable DD-1 rule identifiers, stale clarification tracking and historical-register references.

Compatibility files are not deleted mechanically; active references and compatibility value are checked first.

### DR-9 — Semantic Equivalence and Lean-Baseline Verification

**Objective:** prove zero unaccounted semantic loss against the frozen source baseline and establish the lean Version 1 implementation documentation baseline.

The final accounting relation is:

```text
baseline meaningful propositions
    = final locally stated propositions
    + final propositions reachable through explicit normative reference
    + explicitly documented CORRECT dispositions
```

Every affected proposition must be traceable through the DR package registers. Missing accounting is a failure.

## 9. Package Acceptance Criteria

Every DR package must satisfy all applicable criteria:

1. branch created from verified live `master` after prior-package closeout;
2. authoritative documents read before edits;
3. collaborating documents compared horizontally;
4. external findings classified rather than assumed;
5. all removed/replaced meaningful material has a §6 disposition;
6. stable requirement/contract identities are preserved unless deliberately corrected;
7. no new architecture is inferred from prose similarity;
8. concise local safety/authority bindings remain where needed;
9. package comparison is reviewed for unexpected semantic scope;
10. PR is merged before closeout;
11. resulting live `master` is verified separately after merge;
12. current-state navigation is updated only after that verification.

## 10. Metrics

Each rationalisation package should record, where practical:

- files changed;
- source and final line/word counts;
- absolute and percentage reduction;
- number of `REFERENCE`, `CONSOLIDATE`, `RELOCATE`, `ILLUSTRATE`, `CORRECT`, and `REMOVE` dispositions;
- stable requirements/contracts before and after;
- unresolved semantic findings.

No target reduction percentage is imposed. A smaller reduction with complete semantic accounting is preferable to a larger reduction with ambiguous loss.

## 11. External Audit Candidate Register

The September 2026 external review is accepted as assurance evidence and seeds the following candidates:

| Candidate | Initial severity from external review | DR owner | Programme treatment |
|---|---|---|---|
| Package D post-merge verification/status gap | High | DR-0 | Verify and close lifecycle state. |
| IS-1/IS-22 `InteractionCapabilities` mismatch | High | DR-1 | Read-first horizontal contract verification. |
| DD-3.3 operation identities versus clarification | High | DR-1 | Verify live body/clarification and correct owner if sustained. |
| App root creation versus Nuxt config ownership | High | DR-1 | Verify Functional/DD ownership seam. |
| FR-NUXT authority direction | High | DR-2 | Verify and restore top-down authority if sustained. |
| AI ownership clarification filing/authority | High | DR-2 | Determine semantic level before moving/editing. |
| DD-2 sibling conformance authority | Medium-High | DR-2/DR-4 | Re-home valid cross-cutting rules to real owner; remove sibling-number authority. |
| Corpus-wide invariant duplication | High | DR-3–DR-7 | Canonical owner -> local binding -> local delta. |
| DD-2 implementation evidence leakage | Medium | DR-4 | Compare against IS before relocation/reference. |
| Functional DD-level vocabulary leakage | Medium | DR-2/DR-6 | Replace with correct level/defined references where sustained. |
| ADR governance usage | Medium | DR-0 decision point | Decide deliberately; do not generate retroactive ADRs mechanically. |
| PM compatibility stubs and hygiene | Low/Medium | DR-8 | Reference/compatibility check before deletion. |
| IS heading convention | Low | DR-8 | Presentational standardisation only. |
| Functional front matter/modal convention | Low | DR-8 | Presentational/wording consistency without requirement change. |

## 12. ADR Governance Decision Point

The external review observes that several settled decisions could meet the project's ADR-trigger expectations even though only ADR-0001 exists.

DR-0 does **not** decide that retroactive ADRs are required. Before implementation, the project owner should deliberately choose one of:

1. retain the existing accepted ADR set and rely on current normative specifications for already-settled decisions; or
2. create selected retrospective ADRs where preserving decision rationale independently of the specification text has durable value.

No DR package may create ADRs merely to satisfy a numerical or stylistic expectation.

## 13. Non-Goals

The programme does not:

- redesign AppManager;
- invent a generic invariant/framework layer;
- reopen settled architecture merely because prose repeats it;
- make implementation conform to current legacy topology where normative specifications say otherwise;
- remove local safety statements needed for independent comprehension;
- rewrite historical records to make them appear current;
- treat line count as a quality score;
- silently resolve contradictions as editorial cleanup.

## 14. Programme Exit

The programme completes only when DR-9 demonstrates zero unaccounted semantic loss against `fe30f5ad883ce2abeca2e495dd4d7036eef09da6`, all confirmed DR-1/DR-2 defects have owning corrections, all package PRs have post-merge live-master verification, and the resulting corpus is recorded as the lean Version 1 implementation documentation baseline.
