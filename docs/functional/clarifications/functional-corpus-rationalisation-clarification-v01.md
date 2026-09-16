# Functional Corpus Rationalisation Clarification — Version 01

> **Status:** Active Functional clarification
>
> **Scope:** Version 1 Functional Specification corpus
>
> **Normative effect:** Clarifies recurrent Design inheritance, cross-Functional ownership and downward traceability after DR-2/DR-3. It does not remove, renumber or weaken any `FR-*` requirement.

## 1. Purpose

The Functional corpus contains repeated Design-level safeguards, cross-functional boundary explanations and traceability tables whose historical `Current authority` wording sometimes combines true upstream/same-level authority with downstream architectural refinement destinations. DR-2 corrected the hierarchy ambiguity and DR-3 established canonical ownership for recurrent invariants. This clarification establishes the rationalised reading of the complete Functional family.

## 2. Functional Authority Rule

At Functional level:

1. the root Design Specification owns approved system architecture and cross-cutting Design invariants;
2. each Functional Specification owns the observable behaviour expressed by its `FR-*` requirements;
3. another Functional Specification is authoritative only for an explicit cross-functional contract that the current specification consumes;
4. Detailed Design, capability, domain and implementation names are downstream refinement destinations, not upstream Functional authorities;
5. project-management decomposition plans and registers provide navigation/provenance, not product semantics.

A Functional document shall be readable without consulting a Detailed Design document to determine the meaning of its own requirements.

## 3. Recurrent Design Inheritance

Repeated Functional statements of Application Engine authority, recognition/reachability versus mutation authority, managed scope, provider completion versus application success, evidence versus interpretation, generation versus transformation, AI non-authority, Settings persistence versus precedence, and domain intent versus capability mechanics are inherited local bindings rather than competing owners.

Where an `FR-*` requirement applies one of these rules to a specific observable use case, that requirement remains a normative Functional consequence and shall not be removed merely because the Design invariant is inherited.

## 4. Cross-Functional Ownership

The `app`, `git`, `nuxt`, `docs`, `quality`, `settings`, `ai` and `utils` Functional specifications retain their explicit application-intent ownership. Shared cross-cutting Functional contracts such as Application Invocation, Managed Project, Configuration and Source Transformation retain their own observable semantics when consumed by a domain Functional specification. Coordination does not transfer ownership.

## 5. Traceability Vocabulary

Every Functional traceability table shall be read as distinguishing two directions even where an older primary body still presents one combined column.

**Upstream / same-level normative authority** includes Root Design, the current Functional Specification itself, and `FR-*` ranges or named Functional Specifications explicitly consumed by it.

**Downstream refinement destination** includes architectural names such as Resource Access, Process Execution, Repository Capability, Source Intelligence, Resource Registry and Template, AI/Quality/Documentation/Nuxt Capability, domain Detailed Designs, Interaction Adapters and implementation/provider boundaries.

These downstream names preserve useful traceability but do not define or override Functional meaning. `Current authority` or `Primary current authority` in an older table must not be read as promoting a downstream subsystem above the Functional level.

## 6. Decomposition-Plan References

References to completed Functional/Detailed Design decomposition programmes are provenance and navigation where they describe allocation or drafting history. They do not add product authority to an `FR-*` requirement.

## 7. Nuxt Layer Scaffold Reading

The active [Nuxt Layer Scaffold Functional Ownership Clarification](nuxt-layer-scaffold-functional-ownership-clarification-v01.md) is the Functional-level correction for the authority-direction ambiguity around `FR-NUXT-058/059`. Those requirements are Functional authority for Nuxt layer-profile/baseline orchestration and the below-Functional-level mechanism boundary. The DD-level scaffold clarification is downstream refinement only.

Until a later safe primary-body editorial fold-forward is performed, the sentence in Nuxt §11.1 that says the canonical detailed delegation model is defined by a DD clarification shall be read only as a downstream traceability reference, exactly as the active Functional clarification already requires.

## 8. Functional Requirements Remain the Semantic Checksum

DR-6 does not renumber or delete any `FR-*` identity. Requirement summaries, conformance summaries and explanatory prose do not supersede the requirement bodies.

A repeated paragraph may later be shortened only when every independently meaningful Functional consequence remains in an `FR-*` requirement or explicit Functional contract; inherited Design material remains reachable through an upstream reference; downstream architectural orientation is labelled as refinement; and no safety, failure, cancellation, state, mutation, privacy, provider or cross-domain boundary is weakened.

## 9. Downstream Boundary

Detailed Design refines Functional behaviour into permanent internal contracts. Implementation Specifications refine those contracts into concrete modules, interfaces, providers, algorithms and migration dispositions. Neither level may be used to reconstruct missing Functional meaning.

## 10. Non-Effect

This clarification does not change any `FR-*` obligation or identifier, create a generic Functional framework, merge distinct Functional domains, transfer authority between Functional domains, make project-management documents normative, make Detailed Design an upstream Functional authority, alter DD/IS ownership, or authorize architecture inference from legacy source topology.

## 11. DR-6 Fold-Forward Rule

Primary Functional bodies may be physically shortened only when each affected proposition is demonstrably preserved by its owning `FR-*` contract, an upstream Design reference, an explicit same-level Functional reference, or an accountable DR disposition. The rationalised Functional reading is: **Design invariant -> Functional observable consequence -> downstream refinement**, never the reverse.