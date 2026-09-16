# DD-2 Shared Capability Rationalisation Clarification — Version 01

> **Status:** Active Detailed Design clarification
>
> **Scope:** DD-2.1 through DD-2.10 shared-capability Detailed Designs
>
> **Normative effect:** Clarifies how recurrent inherited authority statements, sibling-conformance prose and implementation-evidence sections in the existing DD-2 corpus are to be interpreted after DR-2 and DR-3. It does not remove or weaken any capability-specific `DD-*` requirement.

## 1. Purpose

The ten DD-2 documents were authored sequentially and deliberately repeated several architectural safeguards while the shared-capability model was being established. DR-2 subsequently corrected the implication that an earlier DD-2 sibling governs a later sibling merely because of authoring order. DR-3 then established canonical Design/Functional ownership for recurrent cross-cutting invariants.

This clarification establishes the rationalised reading rule for the DD-2 family without inventing a generic shared-capability framework or transferring authority between sibling capabilities.

## 2. Rationalised Reading Rule

For DD-2.1 through DD-2.10:

1. upstream Design, Functional, DD-1 and accepted ADR rules remain authoritative according to the documented hierarchy;
2. each DD-2 document owns only the permanent Detailed Design contract of its named capability;
3. a sibling DD-2 document is authoritative only for the capability contract it owns, not because its number or authoring date is earlier;
4. repeated explanations of application authority, managed scope, effective configuration, evidence/interpretation, provider isolation or final acceptance are local bindings to their canonical owners, not independent competing definitions;
5. capability-specific exceptions, preconditions, state distinctions, safety rules, provider constraints, evidence schemas, failure semantics and acceptance boundaries remain normative local delta;
6. diagrams are explanatory unless a requirement explicitly makes a represented relationship normative;
7. implementation evidence is evidence only. Level 4 Implementation Specifications own concrete migration dispositions, provider choices, interfaces, modules and implementation topology.

## 3. Sibling-Conformance Sections

Sections titled or framed as `Conformance Rules for Later DD-2 Designs`, `Downstream Detailed Design Requirements`, or equivalent shall be interpreted as one of two things only:

- a reference to the owning capability contract that a consumer must respect when it actually delegates to that capability; or
- non-normative authoring guidance preserved from the sequential DD-2 programme.

They shall not be read as granting one sibling capability general architectural authority over another sibling.

A statement remains a valid local requirement when it defines the owning capability's own boundary. For example, Resource Access may require callers to supply bounded target constraints; Process Execution may require explicit process requests; Source Intelligence may require read-only evidence semantics. The invalid implication is only that DD numbering itself creates authority.

## 4. Current Implementation Evidence and Reconciliation

Sections describing `Current Implementation Evidence`, `Current Implementation Reconciliation`, historical services, source paths, convenience methods or migration observations are retained as provenance but are not part of the permanent DD-2 architecture unless a separate `DD-*` requirement establishes the same semantic rule.

For Version 1 implementation decisions, the corresponding Level 4 owner is:

| DD | Capability | Level 4 owner |
|---|---|---|
| DD-2.1 | Resource Access | IS-4 |
| DD-2.2 | Process Execution | IS-5 |
| DD-2.3 | Repository Capability | IS-6 |
| DD-2.4 | Source Intelligence | IS-7 |
| DD-2.5 | Source Transformation | IS-8 |
| DD-2.6 | Resource Registry and Template | IS-9 |
| DD-2.7 | AI Capability | IS-10 |
| DD-2.8 | Quality Capability | IS-11 |
| DD-2.9 | Documentation Capability | IS-12 |
| DD-2.10 | Nuxt Capability | IS-13 |

Where a historical DD implementation observation conflicts with its corresponding accepted IS, the IS governs implementation because it is the later and more concrete Level 4 refinement, provided it remains conformant with the upstream normative hierarchy.

## 5. Recurrent Authority Explanations

The following recurrent statements are inherited bindings and need not be independently reconstructed from every DD-2 document:

- delegated specialist execution does not transfer application authority;
- recognition, discovery, accessibility or technical reachability does not create mutation/operation authority;
- technical/provider completion is evidence rather than final application success;
- evidence remains distinct from owning-use-case interpretation and final Application Engine acceptance;
- managed scope is not inferred from filesystem/repository reachability;
- effective configuration is consumed from Configuration Resolution rather than privately reconstructed;
- AI output is proposal/evidence until accepted by the owning use case;
- generation of new artefacts does not silently authorize transformation/replacement of existing artefacts;
- domain intent, policy and orchestration remain distinct from bounded capability mechanics.

Canonical ownership for these propositions is recorded by `docs/project_management/normative-ownership-map-v01.md`. That project-management map is navigation/accounting only; the normative force remains in the Design/Functional owners it identifies.

## 6. Capability-Specific Delta That Must Remain Local

Rationalisation shall not remove the semantics that make the ten capabilities distinct. In particular:

- **Resource Access:** resource references, containment, revision/stale-state evidence, bounded mutation mechanics and filesystem/provider safety;
- **Process Execution:** process request shape, direct/shell distinction, environment/I/O handling, lifecycle, timeout/cancellation and termination evidence;
- **Repository Capability:** repository-local/remote primitives, repository state/effect evidence and provider-neutral repository mechanics beneath Git-domain intent;
- **Source Intelligence:** read-only source snapshots, structural fact discovery, provenance/ranges, ambiguity/partial evidence and provider availability;
- **Source Transformation:** approved transformation plans, preservation, stale protection, application/validation mechanics and transformation-specific effects;
- **Resource Registry and Template:** declarative resource identity/classification, template selection/rendering, deterministic proposed content and registry semantics;
- **AI Capability:** provider-independent AI request/context/disclosure/output contracts, provider selection evidence and non-authoritative generated output;
- **Quality Capability:** bounded check execution, normalized findings/results and gate-evaluation mechanics without taking domain/application acceptance;
- **Documentation Capability:** documentation inspection/generation mechanics and evidence beneath Docs-domain intent, while existing-source semantic mutation remains Source Transformation-owned;
- **Nuxt Capability:** Nuxt-specific inspection/scaffold/configuration mechanics and evidence beneath Nuxt-domain intent.

## 7. Diagrams

Repeated diagrams that merely restate the generic delegation path are explanatory. The canonical conceptual relationship is:

```text
owning application use case
    -> bounded shared capability request
    -> provider/mechanism evidence
    -> capability-normalized evidence
    -> owning-use-case interpretation
    -> Application Engine acceptance
```

A capability document may retain a different diagram where it introduces capability-specific states, ordering, safety boundaries or evidence flow. Those local deltas remain meaningful.

## 8. Non-Effect

This clarification does not:

- create a new specification level;
- create a generic `SharedCapability` semantic framework;
- make DD-2.1 the parent of DD-2.2 through DD-2.10;
- alter any canonical command identity;
- remove any `DD-*` requirement;
- change domain ownership;
- change DD-1 application authority;
- replace the corresponding Level 4 Implementation Specifications;
- authorize implementation to infer architecture from the current source tree.

## 9. DR-4 Fold-Forward Rule

The primary DD-2 bodies may be physically shortened in a later editorial pass only when each removed proposition is demonstrably reachable through this clarification and its canonical normative owner, or is preserved as a capability-specific local requirement. Until then, the repeated prose remains readable historical context but shall not be treated as multiple independent normative owners.
