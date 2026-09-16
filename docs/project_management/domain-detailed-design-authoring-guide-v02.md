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

## 6. Hierarchical Referencing and Readability

### 6.1 Three-layer rule

For cross-cutting semantics:

1. cite the canonical owning contract;
2. state the concise local binding;
3. define only the domain-specific delta.

Do not reproduce a complete upstream contract merely to make the domain document self-contained. Do retain concise local safety/authority statements where omission would make the domain boundary ambiguous.

### 6.2 State once locally, reference thereafter

Within one specification, a cross-cutting invariant should normally have one primary local statement. Later sections should reference that statement or the canonical upstream owner rather than repeatedly paraphrasing it.

Repetition remains justified when the local section would otherwise be unsafe or materially ambiguous in isolation—for example at a mutation boundary, authorization rule, public contract, or conformance invariant. Repetition for emphasis alone should be removed.

This convention never permits deletion of a domain-specific rule merely because an upstream document contains a related general rule.

### 6.3 Reference the current owner, not programme history

Active normative documents should reference current normative owners, active clarifications, the current Detailed Design register, and the active authoring/assurance guides where procedural navigation is useful.

Completed decomposition plans, handovers, closeouts, historical audits and superseded authoring guides may be cited only when their historical evidence or rationale is itself relevant. They should not appear as if they were current product authorities or active authoring controls.

Planning-stage labels such as historical `DD-5`/`DD-6` phases must not be written in a form that can be mistaken for primary Detailed Design identities. Use descriptive names such as “Detailed Design conformance audit” or “Implementation Specification planning” when historical phase context is genuinely needed.

### 6.4 Worked examples

A worked example is recommended when a contract is difficult to understand from abstract rules alone, especially for multi-stage orchestration, mutation planning, stale-state handling, evidence-versus-interpretation, or structured AI output.

A worked example must be explicitly non-normative unless the owning specification deliberately makes the example normative. It should demonstrate an already-defined contract, not introduce a new command, state, default, provider, file path, or policy.

Preferred shape:

```text
input/authoritative context
    -> domain decision
    -> delegated capability evidence
    -> domain interpretation
    -> Application Engine acceptance
```

### 6.5 Diagrams

Prefer one canonical architecture/authority diagram per document when a diagram materially improves comprehension. Later sections should reference that diagram and describe only their delta. Additional diagrams are appropriate only where they explain a genuinely different state machine, data flow, or use-case sequence.

### 6.6 Conformance and test lists

Large flat lists should be grouped by contract concern where grouping improves reviewability—for example identity/applicability, authority/scope, orchestration, mutation/stale state, failure/cancellation, interaction independence, and provider replaceability.

Grouping must not weaken, merge, renumber, or silently remove independently testable requirements. A concise matrix may replace repeated prose when it preserves the same verification obligations.

### 6.7 Traceability references

Traceability should point to stable requirement/contract identifiers and current owning documents. Section numbers are secondary navigation aids because they are more susceptible to editorial drift. When a section number is useful, pair it with the stable identifier or named contract rather than relying on the number alone.

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
- lifecycle/state integrity where project-management material is involved;
- hierarchical-reference integrity;
- readability changes preserve every normative obligation.

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
- Are current owners/active clarifications referenced instead of historical programme controls where possible?
- Is each repeated invariant necessary for local safety or comprehension?
- Do examples and diagrams demonstrate rather than create semantics?
- Do grouped conformance/test obligations preserve independently testable requirements?
- Are unresolved contradictions explicitly recorded rather than silently reconciled?