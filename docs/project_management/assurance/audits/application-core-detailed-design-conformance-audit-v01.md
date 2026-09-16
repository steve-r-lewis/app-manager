# AppManager Application Core Detailed Design Conformance Audit

> **Status:** Version 1 project-management conformance audit
>
> **Audit scope:** DD-1 Application Core Detailed Design family
>
> **Audited baseline:** `master` at merge commit `4198af785fbe0e77d0f5b3b0b0ca4c4cf345b48b`
>
> **Normative effect:** None. This document records verification findings and corrective actions; it does not itself redefine Design, Functional, Detailed Design, or ADR authority.

## 1. Purpose

This audit verifies that the completed DD-1 Application Core Detailed Design family remains aligned with the AppManager root Design Specification, Functional Specifications, Detailed Design decomposition plan, accepted runtime ADR, and the guardrails established by the Functional Specification conformance audit.

The audit is an explicit phase gate before the project proceeds into DD-2 Shared Capability Detailed Designs.

The audited Detailed Designs are:

1. `docs/detailed_design/application-invocation-detailed-design-v01.md`;
2. `docs/detailed_design/execution-outcomes-detailed-design-v01.md`;
3. `docs/detailed_design/managed-project-detailed-design-v01.md`;
4. `docs/detailed_design/configuration-resolution-detailed-design-v01.md`;
5. `docs/detailed_design/application-engine-detailed-design-v01.md`.

## 2. Governing Authorities

The audit was performed against:

- `docs/project-documentation-guide-v01.md`;
- `docs/appmanager-design-specification-v01.md`;
- the Version 1 Functional Specifications under `docs/functional/`;
- `docs/project_management/functional-specification-conformance-audit-v01.md`;
- `docs/project_management/detailed-design-decomposition-plan-v01.md`;
- `docs/decisions/adr-0001-primary-application-runtime.md`.

The governing Detailed Design invariant remains:

> **Delegated execution does not mean delegated application authority.**

## 3. Audit Result

### 3.1 Overall result

**PASS WITH ONE MINOR CORRECTIVE CLARIFICATION REQUIRED BEFORE DD-2.**

The DD-1 family is architecturally coherent and remains on the intended design trajectory.

No blocking or major architectural defects were identified.

One cross-contract sequencing ambiguity should be corrected before DD-2 capability designs begin consuming the Application Core contracts.

### 3.2 Finding counts

| Classification | Count |
|---|---:|
| Blocking | 0 |
| Major | 0 |
| Minor corrective | 1 |
| Advisory / downstream guardrail | 8 |

The minor finding does **not** invalidate DD-1.5 or require decomposition redesign. It requires an explicit staged-resolution rule between Managed Project and Configuration Resolution.

## 4. DD-1 Family Completeness

### 4.1 DD-1.1 — Application Invocation

**Result: PASS**

The specification correctly establishes a transport- and presentation-independent invocation boundary and preserves the principle:

> **Invocation transports intent into the Application Engine; it does not own the meaning of that intent.**

It appropriately owns:

- canonical command identity and discovery metadata;
- caller intent and explicit inputs/options;
- target/context hints;
- authorization evidence;
- preview intent;
- event/progress delivery;
- cancellation linkage;
- invocation-facing outcome delivery.

It does not acquire domain workflow, managed-project, configuration-precedence, provider-execution, or presentation authority.

### 4.2 DD-1.2 — Execution Outcomes and Diagnostics

**Result: PASS**

The specification establishes a shared normalized result model and correctly separates:

1. technical execution status;
2. application interpretation status;
3. final invocation status.

Its central rule is sound:

> **A provider result is evidence about execution; an AppManager outcome is an application decision.**

The design correctly prevents Boolean-result collapse, preserves known effects after failure/cancellation/partial completion, separates proposed from applied effects, and keeps provider-native error/result models below the shared AppManager outcome boundary.

### 4.3 DD-1.3 — Managed Project

**Result: PASS SUBJECT TO MC-001**

The specification correctly separates:

- target request;
- project evidence;
- project candidate resolution;
- project-root resolution;
- managed-project context;
- project topology;
- managed-scope resolution;
- targetability;
- mutability/application authority.

The governing distinction is correct:

> **Discovery or recognition establishes knowledge. Managed scope establishes operation targeting. Neither discovery nor inclusion in context alone grants mutation authority.**

The design also correctly formalizes resolver responsibilities without creating a generic resolver framework.

### 4.4 DD-1.4 — Configuration Resolution

**Result: PASS SUBJECT TO MC-001**

The specification correctly establishes the semantic chain:

```text
source
  -> candidate
  -> applicability / validation
  -> precedence / fallback
  -> effective value
  -> coherent effective-configuration snapshot
  -> Application Engine / use-case consumption
```

It correctly distinguishes:

- configuration source from configuration authority;
- candidate from effective value;
- effective configuration from application policy;
- resolution from persistence;
- configuration from managed scope;
- configuration from authorization.

It also correctly requires project/scope-aware configuration to consume DD-1.3 managed-project semantics rather than rediscover project structure independently.

### 4.5 DD-1.5 — Application Engine

**Result: PASS**

DD-1.5 successfully closes the Application Core by defining the permanent application-authority boundary rather than prescribing one monolithic implementation object.

The specification correctly establishes:

- canonical command/use-case ownership;
- dispatch;
- invocation-scoped execution context;
- policy/safety checkpoints;
- authorization evaluation;
- capability delegation;
- application acceptance;
- cancellation interpretation;
- retry/resume/fallback authority;
- concurrency/staleness coordination;
- nested/composite use cases;
- cross-mode semantic equivalence.

It also places scanners, recognizers, resolvers, strategies, normalizers/projectors, and orchestrators correctly beneath application authority.

The rule:

> **The Application Engine is an authority and responsibility boundary, not a requirement for one class, package, process, executable, deployment unit, or runtime.**

is consistent with ADR-0001 and the technology-architecture review.

## 5. Cross-Contract Conformance

### 5.1 Invocation -> Engine

**PASS**

DD-1.1 provides canonical caller intent, while DD-1.5 owns use-case interpretation and orchestration. Adapter normalization does not become policy authority.

### 5.2 Engine -> Managed Project

**PASS**

DD-1.5 consumes DD-1.3 project identity/scope semantics and preserves the distinction between caller-requested targets and resolved/authorized targets.

### 5.3 Engine -> Configuration

**PASS**

DD-1.5 consumes effective configuration snapshots rather than permitting domain/capability components to read arbitrary raw configuration sources.

### 5.4 Capability evidence -> Outcome interpretation

**PASS**

DD-1.2 and DD-1.5 consistently separate specialist execution evidence from application acceptance and final outcome determination.

### 5.5 Presentation -> canonical semantics

**PASS**

The DD-1 family consistently prevents TUI, Headless, GUI, IDE, CI, automation, or future adapters from acquiring independent command/workflow semantics.

## 6. Minor Corrective Finding

### MC-001 — Explicitly define staged bootstrap configuration and managed-project resolution

**Classification:** Minor corrective clarification before DD-2

**Affected designs:** DD-1.3 Managed Project and DD-1.4 Configuration Resolution; DD-1.5 should consume the clarified sequence.

### 6.1 Observed ambiguity

DD-1.3 permits **effective configuration** to contribute project-resolution evidence.

DD-1.4 correctly states that project/scope-sensitive configuration consumes DD-1.3 project identity, topology, managed entities, and managed scope, and shall not independently rediscover them.

Both statements are individually valid, but without an explicit staged-resolution rule they can be read as a circular dependency:

```text
managed project
    requires effective configuration
        requires managed project
```

The Functional layer already requires both behaviors:

- configuration may contribute candidate project-resolution evidence where permitted;
- project-scoped configuration must not become applicable before sufficient managed-project context exists.

The Detailed Design therefore needs to state how these coexist.

### 6.2 Required clarification

The Application Core should explicitly define staged resolution as conceptually:

```text
invocation / host context
        |
        v
context-independent configuration candidates
        |
        v
bootstrap effective configuration
        |
        v
target-project / managed-project resolution
        |
        v
managed-project context
        |
        v
project/scope-dependent configuration resolution
        |
        v
operation effective-configuration snapshot
        |
        v
managed-scope / policy / use-case execution
```

The exact number of implementation passes is not prescribed.

The required semantic rule is:

> **Configuration used to resolve managed-project identity must itself be resolvable without depending on the project identity it is helping to establish. Project- or scope-dependent configuration becomes eligible only after sufficient managed-project context exists.**

Where later configuration materially changes a project-resolution assumption, DD-1.5 stale-context/revalidation semantics should apply rather than silently mutating the established project identity.

### 6.3 Why this is minor rather than major

The required components and authority boundaries already exist and are correctly owned.

No new subsystem, domain, provider, transport, persistence model, or architectural authority is required.

The correction is a sequencing/contract clarification between two already-approved responsibilities.

### 6.4 Required disposition

MC-001 should be closed by a targeted amendment to DD-1.3 and DD-1.4 before DD-2 specifications begin depending on the configuration/project-resolution lifecycle.

DD-1.5 does not require structural redesign; at most, its execution-context lifecycle may reference the staged rule for clarity.

## 7. Functional Conformance Guardrail Review

### DDG-001 — Do Not Reimplement Cross-Cutting Semantics Per Domain

**PASS**

Invocation, outcomes, project/scope, configuration, and Engine semantics have been extracted as shared contracts before domain Detailed Designs.

### DDG-002 — Preserve Application Engine Authority

**PASS**

All five DD-1 documents consistently preserve Engine/use-case authority over application meaning, policy, scope, safety, acceptance, and final outcome.

### DDG-003 — Separate Orchestration from Specialist Execution

**PASS**

DD-1.5 explicitly distinguishes use-case orchestration from specialist capability execution and positions scanners/resolvers/strategies beneath the authority boundary.

### DDG-004 — Define Shared Normalized Result Contracts

**PASS**

DD-1.2 provides the common outcome, diagnostic, effect, progress, cancellation, provider-evidence, and aggregation semantics required by later capabilities/domains.

### DDG-005 — Keep AI as a Capability Unless AI Is the Primary Use Case

**PASS**

DD-1.5 explicitly maintains the distinction between AI as a delegated capability and AI-owned application use cases.

### DDG-006 — Keep Compatibility Surfaces Thin

**PASS**

DD-1.1 and DD-1.5 require compatibility aliases/adapters to map into canonical command semantics rather than preserving independent workflows.

### DDG-007 — Preserve Future Runtime Replaceability

**PASS**

The DD-1 family defines logical responsibility contracts while explicitly rejecting mandatory package/process/transport/runtime topology. This remains consistent with ADR-0001.

## 8. Documentation-Layer Discipline

**PASS**

The DD-1 documents generally remain at the correct abstraction level.

They define permanent:

- responsibilities;
- contracts;
- state distinctions;
- sequencing semantics;
- authority boundaries;
- collaboration rules;
- extension/conformance rules.

They avoid treating current TypeScript file paths, concrete classes, library calls, package topology, serialization, transport, or migration state as architectural authority.

This is materially consistent with the Project Documentation Guide's Detailed Design role.

## 9. ADR-0001 Conformance

**PASS**

ADR-0001 selects Node.js/TypeScript for Version 1 implementation but requires architecture to preserve genuine Application Engine, invocation, and capability seams.

The DD-1 family does this without manufacturing speculative language-neutral transports or process boundaries.

No DD-1 specification makes a future Kotlin/JVM implementation a commitment, and no DD-1 contract depends on TypeScript module topology for its architectural meaning.

## 10. DD-2 Readiness

Subject to closure of MC-001, DD-1 provides a suitable contract base for DD-2 Shared Capability work.

The intended DD-2 sequence remains:

1. Resource Access;
2. Process Execution;
3. Repository Capability;
4. Source Intelligence;
5. Source Transformation;
6. Resource Registry and Template;
7. AI Capability;
8. Quality Capability;
9. Documentation Capability;
10. Nuxt Capability.

No decomposition change is recommended.

## 11. DD-2 Guardrails

The following guardrails should be carried explicitly into DD-2 drafting.

### ACG-001 — Resource access is not managed scope

Filesystem/resource accessibility must never be treated as AppManager targetability or mutation authority. Resource Access consumes DD-1.3 scope/target constraints; it does not invent them.

### ACG-002 — Process completion is not application success

Process Execution may report technical completion, termination, output and timing. DD-1.2/DD-1.5 determine application acceptance.

### ACG-003 — Repository capability is not the Git domain or CI/CD engine

Repository Capability should expose bounded repository semantics. It must not absorb App lifecycle, Quality, deployment, or complete CI/CD workflow ownership merely because those workflows invoke Git.

### ACG-004 — Source intelligence is evidence-producing

Scanners, recognizers, parsers and analyzers must remain read-only/evidence-producing unless a separately authorized transformation responsibility is invoked.

> **Recognition is not mutation authority.**

### ACG-005 — Transformation stages remain distinct

Source Transformation must preserve:

```text
recognition
 -> structural facts
 -> strategy selection
 -> bounded plan
 -> Engine/use-case approval
 -> transformation
 -> source validation
 -> application acceptance
```

A strategy must not directly acquire mutation authority merely because it knows how to transform source.

### ACG-006 — Capabilities consume governed configuration

DD-2 capabilities should receive effective AppManager configuration snapshots for shared concerns and must not establish private competing precedence chains by directly reading settings/environment/provider defaults.

### ACG-007 — Provider models remain below capability contracts

Provider SDK objects, process exit codes, raw Git results, raw AI responses, Nuxt tool output, filesystem exceptions and similar native representations must be normalized before crossing into application interpretation.

### ACG-008 — Do not create generic frameworks from naming similarity

The recurring Scanner, Resolver, Strategy, Normalizer/Responder, Provider and Orchestrator patterns do not by themselves justify universal base classes, registries or plugin frameworks.

Shared abstractions should be introduced only where permanent semantics are genuinely common.

## 12. Decision

The project remains **on track**.

The DD-1 decomposition has achieved its intended purpose: cross-cutting application semantics have been established before specialist capability and domain orchestration design.

The Application Engine remains the application-authority boundary; interaction adapters remain thin; managed-project and configuration semantics are centralized; provider execution remains subordinate; and shared outcome semantics prevent each capability/domain from inventing incompatible result models.

The only corrective action required before DD-2 is MC-001: explicitly document staged bootstrap configuration versus project/scope-dependent configuration resolution.

After MC-001 is closed, the recommended next step is:

> **Proceed to DD-2.1 — Resource Access Detailed Design.**
