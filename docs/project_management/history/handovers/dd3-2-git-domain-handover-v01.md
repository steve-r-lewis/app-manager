# AppManager DD-3.2 Git Domain Handover

> **Status:** Version 1 project-management session handover
>
> **Purpose:** Durable clean-thread handover into DD-3.2 — Git Domain Detailed Design
>
> **Baseline:** `master` at `328b82b2b74ed23e17d3a4a6c73f20509b5f9457`, the merge commit for PR #112
>
> **Normative effect:** None. This document records continuation state, reading order, settled constraints and the next bounded objective. It does not replace or amend the Project Documentation Guide, Design Specification, Functional Specifications, Detailed Design Specifications, accepted ADRs or clarifications.

---

## 1. Purpose and Use

This handover is the preferred entry point for a fresh AI/human working thread beginning **DD-3.2 — Git Domain Detailed Design**.

It exists to prevent context drift, avoid replaying historical conversation, and ensure that the next thread begins from the current repository rather than from stale branch, filename or migration assumptions.

A new thread should use this document to answer four questions:

1. **What is authoritative?**
2. **What work is already complete and must not be reopened without evidence?**
3. **What architectural and authoring invariants must DD-3.2 preserve?**
4. **What is the exact next bounded task?**

The repository remains the durable project memory. This document is a navigation and continuation record only.

---

## 2. Verified Continuation Baseline

At creation of this handover:

- PR #112 — `docs: close Detailed Design structural refactoring` — is merged and closed;
- live `master` is `328b82b2b74ed23e17d3a4a6c73f20509b5f9457`;
- R-1 through R-10 of the Detailed Design documentation-structure refactoring are complete;
- the R-9 structural conformance audit passed with zero blocking or unexplained structural findings;
- the R-10 closeout gate is:

> **DETAILED DESIGN STRUCTURAL REFACTORING CLOSED — DD-3.2 AUTHORISED**

The next thread must still verify the live `master` head and relevant Pull Request state before editing, because this recorded baseline may be superseded by later repository changes.

---

## 3. Current Detailed Design Programme State

The Version 1 Detailed Design families are:

```text
DD-1 — Application Core
DD-2 — Shared Capabilities
DD-3 — High-Coupling Domains
DD-4 — Policy and Resource Domains
```

Canonical directories are:

```text
docs/dd_1_application_core/
docs/dd_2_shared_capabilities/
docs/dd_3_high_coupling_domains/
docs/dd_4_policy_and_resource_domains/
```

Current primary-design status is:

| Detailed Design | Status |
|---|---|
| DD-1.1 Application Invocation | Complete |
| DD-1.2 Execution Outcomes | Complete |
| DD-1.3 Managed Project | Complete |
| DD-1.4 Configuration Resolution | Complete |
| DD-1.5 Application Engine | Complete |
| DD-2.1 Resource Access | Complete |
| DD-2.2 Process Execution | Complete |
| DD-2.3 Repository Capability | Complete |
| DD-2.4 Source Intelligence | Complete |
| DD-2.5 Source Transformation | Complete |
| DD-2.6 Resource Registry and Template | Complete |
| DD-2.7 AI Capability | Complete |
| DD-2.8 Quality Capability | Complete |
| DD-2.9 Documentation Capability | Complete |
| DD-2.10 Nuxt Capability | Complete |
| DD-3.1 App Domain | Complete |
| **DD-3.2 Git Domain** | **Next** |
| DD-3.3 Nuxt Domain | Planned |
| DD-3.4 Docs Domain | Planned |
| DD-4.1 Quality Domain | Planned |
| DD-4.2 Settings Domain | Planned |
| DD-4.3 AI Domain | Planned |
| DD-4.4 Utils Domain | Planned |

No unauthored DD-3/DD-4 item has a placeholder normative specification.

The canonical DD-2 assignment is fixed:

```text
DD-2.8 = Quality Capability
DD-2.9 = Documentation Capability
```

---

## 4. Documentation Authority

The governing documentation hierarchy remains:

```text
Project Documentation Guide
        |
        v
AppManager Design Specification
        |
        v
Functional Specifications
        |
        v
Detailed Design Specifications
        |
        v
Implementation Specifications
        |
        v
Implementation
```

ADRs are orthogonal architectural-decision provenance. Project-management records, including this handover, own sequencing, status, audits, migration and handoff state; they do not override normative specifications.

Where a current normative specification exists, implementation behaviour shall not be used to infer or replace approved architecture.

---

## 5. Authoritative Reading Order for a Fresh DD-3.2 Thread

A fresh thread shall begin with this document, then read and verify the following sources in order.

### 5.1 Governance and programme state

1. `docs/project-documentation-guide-v01.md`
2. `docs/appmanager-design-specification-v01.md`
3. `docs/project_management/detailed-design-decomposition-plan-v01.md`
4. `docs/project_management/domain-detailed-design-authoring-guide-v01.md`
5. `docs/project_management/detailed-design-structure-refactoring-closeout-v01.md`
6. `docs/project_management/detailed-design-structure-conformance-audit-v01.md`

The closeout/audit documents establish programme state only. They do not create Git-domain semantics.

### 5.2 Primary Git-domain Functional authority

7. `docs/functional/git-functional-specification-v01.md`

The Git Functional Specification is the primary observable-behaviour authority for DD-3.2.

Its Git domain includes, at minimum:

- repository inspection and Git configuration inspection;
- repository initialisation;
- commit creation and staging semantics;
- optional AI-assisted commit-message proposal without AI authority;
- repository-scoped push;
- coordinated push across eligible managed repositories;
- repository synchronisation over root, selected, selected-set and all-managed scopes where supported;
- managed repository relationships such as supported submodule-style relationships;
- Git initialisation for eligible managed layers;
- deliberately authorised remote-repository deletion where retained;
- structured outcomes, partial success, diagnostics, cancellation, safety and Headless equivalence.

Git owns repository-management **intent, policy and workflow semantics**. It does not own build, test, deployment, Nuxt creation or generic CI/CD merely because Git may participate in larger workflows.

### 5.3 Related Functional authorities

Read the directly related Functional Specifications required to understand the Git authority boundary:

8. `docs/functional/application-invocation-functional-specification-v01.md`
9. `docs/functional/managed-project-functional-specification-v01.md`
10. `docs/functional/configuration-functional-specification-v01.md`
11. `docs/functional/source-transformation-functional-specification-v01.md`
12. `docs/functional/app-functional-specification-v01.md`

Read other Functional Specifications only where a specific Git use case actually crosses their authority boundary.

### 5.4 Existing domain-design precedent

13. `docs/dd_3_high_coupling_domains/dd-3-1-app-domain-detailed-design-v01.md`

Use DD-3.1 as precedent for document composition, level of abstraction, traceability, diagrams, domain-contract treatment and conformance invariants. Do **not** copy App-specific semantics into Git.

### 5.5 DD-1 Application Core contracts

Read the DD-1 documents actually consumed by Git, with particular attention to:

14. `docs/dd_1_application_core/dd-1-1-application-invocation-detailed-design-v01.md`
15. `docs/dd_1_application_core/dd-1-2-execution-outcomes-detailed-design-v01.md`
16. `docs/dd_1_application_core/dd-1-3-managed-project-detailed-design-v01.md`
17. `docs/dd_1_application_core/dd-1-4-configuration-resolution-detailed-design-v01.md`
18. `docs/dd_1_application_core/dd-1-5-application-engine-detailed-design-v01.md`

Also inspect DD-1 clarifications where they materially constrain the consumed contracts.

### 5.6 DD-2 shared-capability contracts

The first mandatory DD-2 authority for Git is:

19. `docs/dd_2_shared_capabilities/dd-2-3-repository-capability-detailed-design-v01.md`

Then inspect other DD-2 capabilities only where required by a Git-owned use case, including as applicable:

20. `docs/dd_2_shared_capabilities/dd-2-1-resource-access-detailed-design-v01.md`
21. `docs/dd_2_shared_capabilities/dd-2-2-process-execution-detailed-design-v01.md`
22. `docs/dd_2_shared_capabilities/dd-2-4-source-intelligence-detailed-design-v01.md`
23. `docs/dd_2_shared_capabilities/dd-2-5-source-transformation-detailed-design-v01.md`
24. `docs/dd_2_shared_capabilities/dd-2-7-ai-capability-detailed-design-v01.md`

The exact dependency set shall be justified by the Git Functional requirements rather than assumed from this list.

### 5.7 Clarifications and ADRs

25. `docs/dd_2_shared_capabilities/clarifications/repository-source-intelligence-relationship-clarification-v01.md` where repository/source evidence boundaries are relevant.
26. Applicable accepted ADRs beneath `docs/project_management/decisions/`, especially ADR-0001 where runtime assumptions matter.

The next thread may identify additional active clarifications while following references from these authorities.

---

## 6. Central Git / Repository Capability Boundary

The most important DD-3.2 ownership seam is already established by DD-2.3:

> **Repository Capability supplies repository facts and executes bounded repository primitives; it does not own Git-domain application intent, repository scope policy, or final application acceptance.**

The distinction must remain explicit:

```text
repository discoverable
    != repository belongs to managed project
    != repository selected for this operation
    != repository eligible for this operation
    != repository authorised for mutation
```

DD-2.3 may own bounded technical primitives such as repository inspection, status facts, branch/ref facts, remotes, staging, commit creation, fetch, pull/integration with supplied strategy, push, single-repository synchronization, relationship primitives and bounded remote-host operations.

DD-3.2 must therefore define what remains uniquely Git-domain after those primitives are removed, including application-facing repository intent, operation-specific eligibility, scope selection, sequencing, multi-repository policy, destructive policy, evidence interpretation, partial-success meaning and Git-domain acceptance.

Do not turn DD-2.3 into the Git domain, and do not duplicate DD-2.3 provider mechanics inside DD-3.2.

---

## 7. Domain Detailed Design Authoring Rule

DD-3.2 shall follow the established rule:

> **A domain Detailed Design defines the permanent domain-specific composition of approved Application Core and shared capability contracts; it does not recreate those contracts and it does not prematurely map them to concrete code.**

Every domain Detailed Design must answer four questions explicitly:

1. Which Functional requirements does the domain own?
2. Which DD-1 Application Core contracts does it consume?
3. Which DD-2 Shared Capability contracts does it coordinate?
4. What permanent domain-specific orchestration, state, policy, decision or result contracts remain after shared concerns are removed?

Use the three-layer rule throughout:

```text
canonical invariant
    -> concise local binding
    -> domain-specific delta
```

Do not repeat complete upstream contracts merely for self-containment.

---

## 8. Canonical DD-3.2 Document Location and Identity

The canonical target is:

```text
docs/dd_3_high_coupling_domains/dd-3-2-git-domain-detailed-design-v01.md
```

The document identity shall be:

```markdown
# DD-3.2 — AppManager Git Domain Detailed Design

> **Detailed Design ID:** DD-3.2
>
> **Design family:** DD-3 — High-Coupling Domains
>
> **Status:** Version 1 Detailed Design Specification
```

Do not create a competing Git-domain document elsewhere.

---

## 9. Standard DD-3.2 Structure

Use the established domain Detailed Design structure unless a section genuinely has no domain-specific delta:

```text
# DD-3.2 — AppManager Git Domain Detailed Design

1. Purpose
2. Scope
   2.1 In Scope
   2.2 Out of Scope
3. Governing Requirements and Authorities
4. Domain Responsibility and Authority Boundary
5. Consumed DD-1 Application Core Contracts
6. Consumed DD-2 Shared Capabilities
7. Domain Contract Model
8. Use-Case Orchestration
9. Domain State and State Transitions
10. Domain Policy and Decision Rules
11. Safety, Mutation and Authorization
12. Failure, Cancellation and Partial Effects
13. Headless and Interaction Independence
14. Concurrency, Idempotency and Conflict Behaviour
15. Security and Sensitive Information
16. Extensibility and Replaceability
17. Testability and Conformance Requirements
18. Traceability
19. Conformance Invariants
```

A section may explicitly state that there is no additional Git-domain delta rather than inventing an abstraction merely to make the document symmetrical.

---

## 10. Architectural Invariants DD-3.2 Must Preserve

### 10.1 Application authority

The permanent direction remains:

```text
interaction adapters / integrations
        |
        v
Application Invocation
        |
        v
Application Engine / owning use case
        |
        +--> Managed Project / governed scope
        +--> effective Configuration
        +--> Git-domain orchestration
        |
        v
DD-2 shared capabilities
        |
        v
replaceable providers
        |
        v
external tools / resources / APIs
```

Delegated execution does not delegate application authority.

### 10.2 Scope

Git shall consume DD-1.3 managed-project repository topology and operation-specific scope. Repository discovery, `.git` markers, current working directory, remote URLs or provider-native state do not independently establish managed or mutation scope.

### 10.3 Configuration

Git shall consume DD-1.4 effective configuration. Repository-native Git configuration may be evidence used by Git semantics, but it shall not create a competing AppManager configuration precedence model.

### 10.4 Outcomes

DD-1.2 remains the canonical owner of shared success, failure, partial-success, cancellation, diagnostic, warning and effect semantics. Git may define Git-specific result payloads and interpret subordinate evidence but shall not create an alternate universal outcome envelope.

### 10.5 Evidence and acceptance

```text
provider result
    -> Repository Capability evidence
    -> Git-domain interpretation
    -> Application Engine acceptance
    -> canonical AppManager outcome
```

Technical/provider success is not automatically Git-domain success or application success.

### 10.6 Mutation and safety

Preserve:

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

Particular care is required for staging, commit creation, synchronisation/integration, relationship changes, force-like operations if any are retained, and remote-repository deletion.

### 10.7 Provider independence

Do not make Git CLI syntax, one Git library, one remote host, GitHub-specific SDK objects, shell commands or current TypeScript modules into the Git-domain contract unless an accepted authority explicitly makes them architectural.

### 10.8 Implementation-topology independence

A conceptual Git orchestration responsibility does not imply a service, class, package, process or source file. Concrete TypeScript decomposition belongs to Implementation Specification planning.

---

## 11. Git-Specific Design Questions to Resolve

DD-3.2 should resolve the following at domain level without reimplementing capability mechanics:

- the semantic identity of each Git-owned use case;
- repository-scope forms and operation-specific eligibility over root, selected, selected-set and all-managed repositories;
- how repository topology from Managed Project is bound into Git orchestration;
- how inspection evidence is interpreted without authorising mutation;
- repository-initialisation applicability and already-existing-repository protection;
- commit policy, including explicit staging semantics, committable-change evidence and commit-message acceptance;
- optional AI commit-message assistance as proposal/evidence only;
- remote resolution and ambiguity handling for push;
- multi-repository push sequencing, continuation and partial-success interpretation;
- synchronisation intent and policy without embedding provider-specific pull/rebase/merge mechanics unless supplied by approved policy;
- relationship-management semantics and pre/postconditions for supported managed-repository relationships;
- layer-repository initialisation semantics where Git is delegated work by App/Nuxt workflows;
- destructive remote-repository deletion policy, strong authorisation, scope and irreversible/partial-effect treatment where that use case remains approved;
- retry/revalidation boundaries;
- idempotent/already-satisfied states where meaningful;
- stale state, divergence, conflict and concurrent-operation interpretation;
- security treatment for remote identities, credentials and repository configuration;
- deterministic Headless behaviour;
- Git-specific conformance requirements and traceability to `FR-GIT-*`.

These are design questions, not pre-approved answers. The next thread shall derive the final design from normative authorities.

---

## 12. What Must Not Be Reopened Without New Evidence

The next thread shall not casually reopen:

- DD-1 Application Core ownership;
- DD-2 shared-capability ownership;
- DD-2.3 Repository Capability versus Git-domain separation;
- DD-2.8 Quality / DD-2.9 Documentation numbering;
- the four DD family decomposition;
- canonical family directories and DD filename convention;
- the R-1 through R-10 documentation-structure closeout;
- the rule that clarifications do not receive fictitious primary DD IDs;
- the rule that provider/capability evidence is subordinate to application interpretation;
- the rule that implementation topology is not inferred from current code.

If a genuine contradiction is discovered, record the exact normative sources and resolve it explicitly rather than silently selecting one interpretation.

---

## 13. Historical Material and Superseded Paths

The following are not active canonical locations:

```text
docs/detailed_design/
docs/decisions/
```

Historical handovers, audits and migration records may still mention those paths as provenance. Such references are not current navigation instructions.

The active ADR location is:

```text
docs/project_management/decisions/
```

The earlier `docs/project_management/detailed-design-dd1-handover-review-v01.md` remains historical DD-1→DD-2 provenance. For current continuation into DD-3.2, this handover and the R-10 closeout govern project-management state, subject always to live repository verification and higher-authority normative documents.

---

## 14. Git Workflow for the Next Thread

Before editing DD-3.2, the next thread shall:

1. verify live `master` and relevant PR state;
2. confirm that this handover PR has been merged before treating this document as a `master` source;
3. create a fresh dedicated branch from the then-current verified `master`, for example `ai/dd3-2-git-domain-detailed-design`;
4. author only the focused DD-3.2 document and any directly necessary navigation/status adjustment justified by the repository workflow;
5. compare the branch against its verified base;
6. open a focused PR against `master`;
7. stop and leave merge authority to the user.

Never edit `master` directly.

---

## 15. New-Thread Bootstrap Procedure

The first prompt in the new thread should instruct the assistant to:

1. ingest this handover first;
2. follow the authoritative reading order in Section 5;
3. verify the current repository state rather than trusting this handover's historical baseline;
4. treat normative specifications as authoritative over current implementation;
5. avoid editing `master` directly;
6. after completing the review, respond **only** with:

```text
ready
```

That `ready` response is the gate confirming that the new thread has reconstructed sufficient project context without beginning DD-3.2 prematurely.

After that gate, the user can issue a separate instruction such as:

```text
Proceed with DD-3.2 — Git Domain Detailed Design.
```

---

## 16. Immediate Next Objective

The immediate next project objective is:

> **DD-3.2 — Git Domain Detailed Design**

Canonical target:

```text
docs/dd_3_high_coupling_domains/dd-3-2-git-domain-detailed-design-v01.md
```

The next thread should begin by reviewing authorities and reconstructing the Git-domain ownership/dependency map. It should not begin from current implementation classes, commands or source layout.
