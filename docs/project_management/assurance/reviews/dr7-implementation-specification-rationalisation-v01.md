# DR-7 — Implementation Specification Rationalisation Review

> **Status:** Complete on DR-7 review branch
>
> **Verified starting baseline:** `7bc99614528d45a227c0c17faa7dcade777b1072`
>
> **Frozen semantic source baseline:** `fe30f5ad883ce2abeca2e495dd4d7036eef09da6`
>
> **Normative product effect:** None directly. The accompanying active Level 4 clarification controls interpretation of the existing Implementation corpus without changing upstream architecture.

## 1. Objective

DR-7 was authorized to perform a conservative rationalisation of IS-1 through IS-23 while preserving interfaces, types, provider decisions, current-vs-target evidence, migration dispositions, algorithms/mechanisms and independently testable conformance obligations.

## 2. Baseline Verification

PR #164 was independently verified merged and closed. Live `master` was independently verified at merge commit:

`7bc99614528d45a227c0c17faa7dcade777b1072`

The DR-7 branch was created from that exact commit.

## 3. Read-First Review

The review covered the Level 4 register, DR programme controls, representative application-core, shared-capability, domain and assembly specifications, repository-wide repeated implementation vocabulary, current-repository evidence and the established migration-disposition method.

The review specifically tested whether repeated material was:

1. inherited upstream architecture;
2. a concise local implementation binding;
3. concrete Level 4 delta;
4. migration evidence/disposition;
5. independently testable conformance material; or
6. genuinely information-free repetition.

## 4. Finding — The IS Corpus Is Not Safely Reducible by Bulk Prose Deletion

The primary Implementation Specifications are large, but their repeated architecture language is frequently interleaved with concrete implementation consequences. Examples include module boundaries, TypeScript contracts, normalized result models, provider seams, stale-state rules, cancellation behavior, migration tables and test obligations.

Consequently, deleting paragraphs merely because phrases such as “Application Engine authority”, “evidence only”, “managed scope” or “provider replaceability” recur would create a material risk of removing Level 4 delta.

DR-7 therefore uses the programme's safety rule: a smaller physical reduction with complete semantic accounting is preferable to a larger reduction with ambiguous loss.

## 5. Rationalised Level 4 Reading

The accompanying `implementation-specification-rationalisation-clarification-v01.md` establishes:

- upstream Design/Functional/DD rules remain canonical owners;
- repeated upstream rules in an IS are local implementation bindings unless concrete delta is attached;
- sibling IS references describe collaboration rather than authority rank;
- scope/non-ownership lists are boundary maps;
- generic governing-rule quotations/diagrams are explanatory where they add no concrete implementation information;
- concrete interfaces, types, modules, providers, algorithms, migration dispositions and tests remain Level 4 normative material;
- current repository topology remains evidence, not target architecture.

## 6. Horizontal Boundary Verification

### 6.1 Application path

IS-1, IS-22 and IS-23 remain deliberately distinct. IS-23 constructs/assembles, the selected IS-22 adapter translates interaction, and IS-1 owns the application runtime/invocation authority. The thin launcher does not become a third adapter or bypass IS-22 during normal TUI/Headless operation.

### 6.2 Repository and Git

IS-6 remains bounded repository facts/primitives and provider normalization. IS-15 remains Git-domain intent, operation-specific scope, policy and orchestration. Direct Git CLI execution through IS-5 remains the target local Git provider path; historical `simple-git` usage is migration evidence.

### 6.3 Capability/domain pairs

The AI, Quality, Documentation/Docs and Nuxt pairs remain deliberate layered seams. Similar method/result shapes do not justify unification. Settings persistence remains distinct from IS-3 configuration resolution/precedence.

## 7. Migration Evidence

Every primary IS contains or participates in responsibility-level current-to-target reasoning. The corpus consistently uses `RETAIN`, `ADAPT`, `SPLIT`, `RELOCATE` and `REPLACE` dispositions. These are not historical clutter: they are actionable Level 4 migration specification for implementation from the existing codebase.

DR-7 preserves them.

## 8. Physical Reduction Decision

No primary IS body was physically shortened in this package.

This is deliberate rather than incomplete. A proposition-safe deletion would require line-by-line proof across documents of roughly 40–50 KB each. The read-first horizontal review did not identify a class of primary-body text whose physical deletion could be applied corpus-wide without risking interfaces, algorithms, migration decisions or tests.

Instead DR-7 removes semantic duplication at the reading/authority level: repeated upstream architecture no longer needs to be interpreted as 23 separately owned Level 4 rules.

## 9. Semantic Preservation

The DR-7 disposition register records no bare `REMOVE` of independently meaningful information. All 23 IS identities remain unchanged. Concrete Level 4 specification remains textually intact.

No new generic framework, provider abstraction, domain framework or runtime topology was invented.

## 10. Metrics

Primary IS files physically edited: **0 of 23**.

Primary IS identities before/after: **23 / 23**.

Primary IS concrete contracts deliberately removed: **0**.

New active clarification: **1**.

New assurance records: **2** including this review.

Unresolved blocking semantic contradictions: **0**.

Physical word/line reduction in primary IS corpus: **0%** by design; semantic duplication is rationalised through canonical-owner/local-binding interpretation.

## 11. Acceptance

DR-7 acceptance criteria are satisfied:

- branch originates from independently verified post-DR-6 live master;
- authoritative Level 4 controls and representative collaborating specifications were read before edits;
- horizontal boundaries and provider/runtime decisions were checked;
- concrete Level 4 delta and migration evidence were preserved;
- no architecture was inferred from prose similarity;
- no stable IS identity changed;
- no unaccounted semantic removal occurred;
- no blocking contradiction requires change control.

**Result: PASS — DR-7 complete on branch and ready for review/merge.**

After merge and independent live-master verification, proceed to **DR-8 — Documentation and Project-Management Hygiene**.