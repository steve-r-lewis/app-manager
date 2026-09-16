# Implementation Specification Rationalisation Clarification

> **Status:** Active Version 1 Implementation clarification
>
> **Applies to:** `IS-1` through `IS-23`
>
> **Purpose:** DR-7 semantic-preservation and rationalised-reading rule
>
> **Normative level:** Level 4 Implementation Specification clarification only. This document does not amend Design, Functional or Detailed Design authority.

## 1. Purpose

DR-7 performs a conservative rationalisation of the complete Version 1 Implementation Specification corpus. The Implementation layer is both concrete Level 4 specification and high-value migration evidence. Therefore reduction is permitted only where it removes safe presentational repetition or repeated explanation of an already explicit upstream rule.

This clarification defines how repeated material in `IS-1` through `IS-23` is to be read without weakening interfaces, types, provider choices, algorithms, migration dispositions or independently testable obligations.

## 2. Governing Reading

For every primary Implementation Specification:

1. Design, Functional and Detailed Design documents remain upstream normative owners of architecture, observable behaviour and detailed contracts.
2. The owning `IS-*` document owns the concrete Level 4 realization: modules, interfaces, types, provider/mechanism decisions, algorithms, migration dispositions, dependency wiring and implementation tests.
3. A repeated upstream invariant inside an IS is an **implementation binding** unless the IS introduces a concrete implementation delta.
4. A sibling `IS-*` reference identifies a collaborating implementation responsibility; it does not transfer or rank normative authority.
5. Current repository source/topology is implementation evidence and migration input, never a competing architecture source.
6. `RETAIN / ADAPT / SPLIT / RELOCATE / REPLACE` tables are implementation migration decisions and shall be preserved even when surrounding historical explanation is compressed.

## 3. Material That Must Not Be Deduplicated Away

The following are independently meaningful Level 4 material and remain normative in their owning IS:

- public/internal interface shapes and method contracts;
- concrete TypeScript types and normalized result/error representations;
- module/component boundaries and dependency direction;
- provider and mechanism selections, including deliberate exclusions;
- path, process, filesystem, Git, source, AI, Quality, Documentation and Nuxt implementation safety mechanisms;
- stale-state, cancellation, timeout, concurrency and partial-effect algorithms;
- concrete configuration/bootstrap/runtime assembly decisions;
- current-to-target migration dispositions;
- implementation sequences where ordering is technically required;
- conformance tests and independently testable Level 4 obligations;
- traceability needed to connect concrete implementation behavior to its upstream owner.

Repeated appearance of an architectural phrase does not make any of these duplicate semantics.

## 4. Safe Rationalisation Classes

### 4.1 Upstream invariant restatement

Statements such as Application Engine final authority, managed-scope authority, evidence-versus-interpretation, AI non-authority, capability/domain separation and provider replaceability are inherited from their canonical upstream owners. Within an IS they bind the implementation to those rules; they do not create a new Level 4 copy of the architecture.

Where the same invariant appears several times in one IS, later explanatory restatement may be read as a reference to the first local binding plus the upstream owner. Concrete consequences attached to that restatement remain Level 4 requirements.

### 4.2 Scope and non-ownership lists

Scope/non-ownership sections are concise boundary maps. They may repeat upstream ownership vocabulary because implementers need an immediate dependency boundary. Such lists are not evidence that the listed upstream semantics are re-owned by the IS.

### 4.3 Governing-rule quotations and diagrams

A governing-rule quotation or generic delegation diagram is explanatory when it merely visualizes inherited architecture. Any concrete module, call path, type, provider, composition or sequencing information in the same section remains Level 4 specification.

### 4.4 Repeated conformance prose

A conformance summary may group obligations already stated in concrete sections. It remains a test/readiness checklist, not a second semantic owner. It must not be deleted where doing so would lose an independently testable obligation or a required implementation acceptance condition.

## 5. Cross-IS Collaboration

Implementation responsibilities collaborate without absorbing one another. In particular:

- IS-1 owns application runtime/invocation realization; IS-22 owns interaction projection; IS-23 owns assembly. Normal TUI/Headless flow remains launcher -> IS-23 composition -> selected IS-22 adapter -> IS-1.
- IS-6 owns repository facts/primitives while IS-15 owns Git-domain orchestration/policy.
- IS-13 owns Nuxt capability mechanics while IS-16 owns Nuxt-domain orchestration/policy.
- IS-12 owns documentation capability mechanics while IS-17 owns Docs-domain orchestration/policy.
- IS-11 owns quality capability mechanics while IS-18 owns Quality-domain orchestration/policy.
- IS-10 owns provider-independent AI execution mechanics while IS-20 owns AI-domain application intent/policy.
- IS-3 owns configuration resolution/precedence while IS-19 owns explicit Settings persistence and settings-domain intent.

These are deliberate layered implementation seams, not duplicate contracts.

## 6. Provider and Runtime Decisions

Concrete provider/mechanism choices remain owned by the relevant IS. DR-7 does not generalize them into abstract frameworks merely because several capabilities share similar adapter shapes.

The reconciled Version 1 runtime remains Node.js/TypeScript, ESM/NodeNext, pnpm, compiled `dist`, a thin launcher and explicit composition root under IS-23/ADR-0001. The Repository Capability local Git path remains direct Git CLI execution through IS-5; historical `simple-git` usage is migration evidence rather than target provider authority.

## 7. Migration Evidence

Current implementation sections and disposition tables remain valuable because implementation will begin from the existing repository rather than a blank tree. DR-7 therefore does not remove them merely to reduce document size.

When migration prose repeats the same architectural reason already established upstream, the reason is explanatory. The disposition itself, preserved useful behavior, target owner and required migration action remain Level 4 information.

## 8. DR-7 Editing Rule

DR-7 deliberately rejects a mechanical rewrite of all 23 large primary specifications. Physical deletion is justified only when proposition-by-proposition comparison proves that no interface, type, mechanism, provider decision, migration disposition, algorithm, traceability relationship or test obligation is lost.

Where a safe corpus-wide reading removes semantic duplication without risking those concrete details, this clarification supplies that reading and the primary IS text remains intact.

## 9. Effect

This clarification changes no `IS-*` identity, no upstream requirement or DD contract, no provider decision and no implementation obligation. It makes explicit which repeated material is inherited binding/explanation and which material is irreducible Level 4 delta.

Implementation shall read each primary IS together with its cited upstream authorities and this clarification. Where a genuine contradiction is discovered, normal specification change control applies; rationalisation shall not silently choose a winner.