# AppManager Domain Detailed Design Authoring Guide

> **Document type:** Project-management authoring guide
>
> **Version:** 02
>
> **Status:** Active
>
> **Role:** Reusable Detailed Design drafting guidance
>
> **Normative product effect:** None. This guide controls drafting practice; it does not establish application architecture.

## 1. Purpose

This guide provides reusable drafting controls for AppManager domain Detailed Design Specifications, principally DD-3 and DD-4. It supersedes Version 01 as the active authoring guide.

The canonical primary identities are recorded in [Detailed Design Register](detailed-design-register-v01.md). Product semantics remain owned by the applicable normative specifications and accepted decisions.

## 2. Authority Boundary

This guide must never be cited as the semantic owner of an application invariant, capability contract, domain policy, or product requirement.

The reading order for drafting is:

1. Project Documentation Guide;
2. AppManager Design Specification;
3. applicable Functional Specifications;
4. accepted ADRs and active normative clarifications;
5. owning and collaborating Detailed Design Specifications;
6. this guide for drafting method and presentation;
7. assurance/history records only for evidence, provenance, or lessons relevant to the task.

A project-management audit, reconciliation, closeout, handover, plan, map, register, or authoring guide may identify or explain an architectural rule, but the rule is authoritative only where it is established in the owning normative document or accepted decision mechanism.

## 3. Four Mandatory Domain Questions

Every domain Detailed Design must answer:

1. Which Functional requirements does the domain own?
2. Which DD-1 Application Core contracts does it consume?
3. Which DD-2 Shared Capability contracts does it coordinate?
4. What permanent domain-specific orchestration, state, policy, decision, or result semantics remain after shared concerns are removed?

## 4. Scope Discipline

Appropriate domain-DD content includes permanent domain orchestration, sequencing, policy, applicability, domain state, interpretation of capability evidence, mutation/authorization boundaries, conflict/idempotency semantics, domain-specific security deltas, and domain-specific result payloads that bind to canonical DD-1 outcomes.

Implementation-specific source paths, exact TypeScript classes/functions, package/library calls, dependency-injection wiring, build wiring, migration sequencing, temporary compatibility structures, current implementation status, and file-by-file refactoring belong at Level 4 or project-management level as appropriate.

## 5. Mandatory Architectural Checks

A draft must preserve the owning normative contracts for:

- Application Engine authority and final acceptance;
- managed-project and managed-scope authority;
- effective configuration and provenance;
- canonical outcome semantics;
- evidence-versus-interpretation boundaries;
- capability/domain separation;
- provider replaceability;
- source recognition versus transformation/mutation;
- AI non-authority;
- presentation/interaction independence;
- implementation-topology independence at Detailed Design level.

These items are review checks, not architecture created by this guide.

## 6. Three-Layer Documentation Rule

For cross-cutting semantics:

1. cite the canonical owning contract;
2. state the concise local binding;
3. define only the domain-specific delta.

Do not reproduce a complete upstream contract merely to make the domain document self-contained. Do retain concise local safety/authority statements where omission would make the domain boundary ambiguous.

## 7. Recommended Document Structure

A domain Detailed Design should normally contain:

1. Purpose;
2. Scope — in scope / out of scope;
3. Governing requirements and normative authorities;
4. Domain responsibility and authority boundary;
5. Consumed DD-1 contracts;
6. Consumed DD-2 capabilities;
7. Domain contract model;
8. Use-case orchestration;
9. Domain state/state transitions where meaningful;
10. Domain policy and decision rules;
11. Safety, mutation, and authorization;
12. Failure, cancellation, and partial effects;
13. Headless and interaction independence;
14. Concurrency, idempotency, and conflict behaviour where relevant;
15. Security and sensitive-information delta;
16. Extension points where justified;
17. Testability/conformance requirements;
18. Traceability.

Sections may be concise or omitted where they add no information, except that scope, authority, safety/mutation, and traceability must remain explicit.

## 8. Use-Case Orchestration Rule

Organise orchestration by approved Functional use case rather than hypothetical classes or current source modules. For each significant use case identify, as applicable:

- intent;
- preconditions/applicability;
- authoritative inputs;
- semantic sequence;
- domain-owned decisions;
- delegated capability operations;
- interpretation and domain acceptance;
- failure, partial-effect, and cancellation semantics.

Capability completion is evidence; it does not automatically establish domain or application acceptance.

## 9. Safety and Mutation Rule

Where relevant, preserve the distinction:

```text
recognition
    != selection
    != intent
    != authorization
    != execution
    != technical success
    != domain acceptance
    != application success
```

A domain design must identify where mutation intent originates, what authorization evidence is required, which bounded capability performs the mutation, how stale/changed state is treated, and what the domain is prohibited from inferring.

## 10. Abstraction Rule

Repeated orchestration shapes do not justify a generic domain framework by themselves. Introduce a shared abstraction only when semantics are genuinely shared, are not already owned by DD-1/DD-2, and form a durable responsibility boundary. Similar naming or record shape is insufficient.

## 11. Assurance Requirement

Completion review must apply the [Documentation Assurance Guide](documentation-assurance-guide-v01.md):

- vertical conformance to higher authority;
- horizontal comparison with collaborating peer documents;
- single semantic ownership;
- explicit consumer relationships;
- dependency-cycle safety;
- provider/implementation replaceability;
- mutation and outcome authority checks;
- lifecycle/state integrity where project-management material is involved.

The DD-2 programme demonstrated that a vertical pass alone is insufficient to establish horizontal architectural coherence.

## 12. Completion Checklist

Before a domain Detailed Design is accepted, reviewers should be able to answer yes to all applicable questions:

- Are Functional ownership and traceability explicit?
- Are consumed DD-1/DD-2 contracts referenced rather than recreated?
- Is domain-specific authority distinguished from capability execution?
- Are managed scope, configuration, mutation authorization, and final outcome ownership preserved?
- Are provider-native representations prevented from becoming accidental shared semantics?
- Is implementation topology deferred to Level 4?
- Has horizontal comparison been performed against collaborating domains/capabilities?
- Are unresolved contradictions explicitly recorded rather than silently reconciled?
