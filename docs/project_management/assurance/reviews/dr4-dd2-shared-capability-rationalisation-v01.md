# DR-4 — DD-2 Shared Capability Rationalisation Review

> **Status:** Complete on review branch
>
> **Source baseline:** live `master` `e2856d9d74890320a4b42c660854b169d8879640`
>
> **Normative product effect:** None. The accompanying DD-level clarification carries the normative interpretive correction.

## 1. Objective

DR-4 applies the DR-3 canonical-owner model to the ten DD-2 shared-capability designs and dispositions three known repetition classes:

1. sibling conformance-rule sections;
2. current-implementation evidence/reconciliation sections;
3. repeated generic authority explanations and diagrams.

The package must reduce competing normative ownership without erasing capability-specific contracts or treating similarly shaped records as a generic framework.

## 2. Baseline Verification

PR #161 was verified merged and closed before work began. Live `master` was independently verified at `e2856d9d74890320a4b42c660854b169d8879640`, the merge commit for PR #161. The DR-4 branch was created from that exact commit.

## 3. Corpus Reviewed

The review covers:

- DD-2.1 Resource Access;
- DD-2.2 Process Execution;
- DD-2.3 Repository Capability;
- DD-2.4 Source Intelligence;
- DD-2.5 Source Transformation;
- DD-2.6 Resource Registry and Template;
- DD-2.7 AI Capability;
- DD-2.8 Quality Capability;
- DD-2.9 Documentation Capability;
- DD-2.10 Nuxt Capability;
- DR-2 authority corrections;
- DR-3 normative ownership map;
- corresponding IS-4 through IS-13 implementation owners.

## 4. Findings

### 4.1 The DD-2 family is not a parent/child chain

**Confirmed.** Sequential authoring left wording such as `Conformance Rules for Later DD-2 Designs` and `Downstream Detailed Design Requirements`. Where these statements describe an owning capability's contract they remain valid; where they imply that earlier numbering grants authority over later siblings, that implication is invalid under the documented hierarchy and DR-2.

The active DD-2 rationalisation clarification now establishes that sibling consumption follows semantic ownership, not numbering.

### 4.2 Generic authority prose is materially repetitive

**Confirmed.** The ten designs repeatedly explain variants of the same upstream rules: delegated execution does not transfer application authority; technical success is evidence; managed scope is not technical reachability; configuration is consumed rather than privately resolved; provider-native representations do not become application semantics.

These are not ten independent rules. DR-3 already identified their canonical owners. DR-4 classifies the DD-2 occurrences as local bindings unless a statement adds capability-specific delta.

### 4.3 Repeated diagrams are mostly explanatory

**Confirmed with qualification.** Generic diagrams showing application use case -> capability -> provider -> evidence -> interpretation -> Engine acceptance are explanatory restatements of the same architecture. DR-4 records one canonical conceptual form in the DD-level clarification.

Diagrams that add capability-specific state, ordering, stale-state, lifecycle, preservation or safety semantics remain meaningful local design material and are not collapsed.

### 4.4 Current implementation evidence is not permanent DD authority

**Confirmed.** Multiple DD-2 documents contain sections describing historical services, source paths, package scripts, provider mechanisms or convenience methods. These sections were valuable during design derivation but are implementation evidence rather than permanent Level 3 architecture.

The corresponding accepted Level 4 specifications IS-4 through IS-13 now own concrete implementation disposition. Historical DD evidence remains provenance and may explain why a boundary exists, but it cannot override the accepted IS or make current source topology normative.

### 4.5 Capability-specific semantics remain substantial

**Confirmed.** The review does not support collapsing the ten capabilities into a generic framework. Their local contracts remain materially distinct, including Resource Access containment/revision semantics, Process Execution lifecycle semantics, Repository primitives, Source Intelligence fact/provenance semantics, Source Transformation plan/preservation semantics, registry/template declarative semantics, AI context/disclosure/output mechanics, Quality check/gate mechanics, Documentation specialist mechanics and Nuxt specialist mechanics.

Similarity of request/result shapes, provider seams, cancellation fields or evidence envelopes is not sufficient to create a new shared semantic abstraction.

## 5. Rationalisation Mechanism

DR-4 uses an active DD-level clarification rather than mechanically rewriting ten large normative documents in one package. This is deliberate: the existing primary bodies contain dense, independently identified `DD-*` requirements interleaved with repeated explanation. A bulk textual deletion would create greater semantic-loss risk than an explicit owner/disposition correction.

The clarification therefore changes the **normative reading** of the family immediately:

- repeated upstream rules are references/local bindings, not competing owners;
- sibling-order conformance prose cannot create authority;
- implementation-evidence sections are provenance and Level 4 owns implementation disposition;
- generic delegation diagrams are illustrative unless they add local delta;
- all capability-specific `DD-*` requirements remain in force.

This is a semantic rationalisation, not a cosmetic line-count exercise. Physical shortening of primary bodies is not required to establish the corrected normative baseline and must not be performed without proposition-level accounting.

## 6. Architectural Preservation Check

PASS. DR-4 preserves:

- DD-1 authority for managed scope, effective configuration integration, canonical outcomes, invocation and final Application Engine acceptance;
- domain intent/policy/orchestration above bounded capability mechanics;
- Resource Access as bounded resource mechanics rather than filesystem-shaped application authority;
- Process Execution as technical process mechanics/evidence;
- Repository Capability as bounded primitives beneath Git-domain intent;
- Source Intelligence as read-only evidence;
- Source Transformation as the existing-source semantic mutation capability;
- AI output as non-authoritative proposal/evidence;
- Documentation Capability distinct from Docs-domain intent;
- Quality Capability distinct from Quality-domain/application acceptance;
- Nuxt Capability distinct from Nuxt-domain intent;
- provider replaceability and implementation-topology independence.

## 7. Semantic Accounting

The accompanying `dr4-semantic-disposition-register-v01.md` accounts for the proposition classes affected by the rationalisation. No `DD-*` requirement is removed. Implementation evidence is preserved as provenance while concrete implementation decisions remain reachable through IS-4 through IS-13.

## 8. Residual Work

DR-4 intentionally does not:

- rewrite or renumber the ten DD-2 documents;
- delete historical implementation-evidence prose solely for line-count reduction;
- create a generic shared-capability framework;
- change Functional requirements;
- change Level 4 provider/interface decisions;
- rationalise DD-3/DD-4 domain designs.

The next package, DR-5, can now reference the corrected DD-2 capability boundaries rather than reproducing their generic authority explanations.

## 9. Decision

**PASS — DR-4 COMPLETE.**

The DD-2 family now has one explicit rationalised reading rule, sibling authority is corrected, implementation evidence is correctly subordinated to Level 4, recurrent authority prose is classified as inherited binding, and capability-specific local delta remains intact.

After merge and independent live-master verification, proceed to **DR-5 — DD-3/DD-4 Domain Rationalisation**.
