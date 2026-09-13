# AppManager Application Core Bootstrap Resolution Clarification

> **Status:** Version 1 Detailed Design corrective clarification
>
> **Applies to:** `managed-project-detailed-design-v01.md`, `configuration-resolution-detailed-design-v01.md`, and `application-engine-detailed-design-v01.md`
>
> **Corrective source:** `docs/project_management/application-core-detailed-design-conformance-audit-v01.md`, finding MC-001
>
> **Normative purpose:** This document closes the cross-contract sequencing ambiguity identified by MC-001. It refines the interaction between DD-1.3 and DD-1.4 without changing their responsibility ownership, and is to be read as part of the Version 1 DD-1 Application Core baseline. Where older generic sequencing prose in DD-1.3, DD-1.4 or DD-1.5 can be read as requiring an incompatible order, this staged dependency contract governs until that prose is consolidated.
>
> **Propagation status:** The staged dependency order is now propagated into DD-1.5 Application Engine. DD-1.3 and DD-1.4 remain semantically governed by this clarification and require explicit backlink/consolidation in a later documentation pass; their existing ownership contracts remain valid.

## 1. Purpose

DD-1.3 correctly permits governed configuration to contribute evidence during managed-project resolution. DD-1.4 correctly requires sufficient managed-project context before project- or scope-dependent configuration can become effective.

Those requirements are compatible only when configuration resolution is staged. This clarification makes that staging explicit and prevents either Detailed Design from being interpreted as requiring a circular dependency.

The governing rule is:

> **Configuration used to resolve managed-project identity must itself be resolvable without depending on the project identity it is helping to establish. Project- or scope-dependent configuration becomes eligible only after sufficient managed-project context exists.**

A second rule follows:

> **Bootstrap configuration may contribute project-resolution evidence, but it does not pre-authorize the project, managed scope, targetability, or consequential effects that are subsequently resolved.**

A third rule makes the scope/configuration ordering explicit:

> **Managed scope is finalized only after the operation-effective configuration required by that scope decision is available. Scope therefore does not precede project/scope-aware configuration as a universal prerequisite.**

## 2. Canonical Resolution Sequence

The Application Core shall support the following semantic sequence where project resolution depends upon configuration:

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
managed scope / policy / use-case execution
```

This is a semantic dependency order. It does not mandate one implementation pipeline, class graph, process topology, number of resolver instances, or number of physical resolution passes.

Where a use case does not require project-aware configuration, irrelevant stages may be omitted. Where a scope decision itself controls which configuration concern applies, the Engine may stage resolution and scope refinement explicitly, but shall not create an unrestricted recursive project/configuration/scope loop.

## 3. Bootstrap Configuration

### 3.1 Definition

Bootstrap configuration is the bounded subset of configuration concerns that can be resolved before authoritative managed-project identity exists and that are permitted to contribute to project discovery or candidate resolution.

A bootstrap concern shall be resolvable from sources whose applicability does not depend upon the unresolved project identity, project topology, or managed scope.

Potential source classes include, where the owning configuration concern permits them:

- explicit invocation values;
- host/integration context that is independent of resolved project identity;
- tool-level configuration;
- environment-derived values;
- built-in defaults;
- other context-independent sources explicitly approved by the concern definition.

The presence of a source class in this list does not make every value from that class valid bootstrap configuration. Concern-specific applicability, validation, precedence, sensitivity, and fallback rules still apply.

### 3.2 Prohibited bootstrap dependency

A candidate shall not participate in bootstrap resolution if determining its applicability or effective value requires the managed-project identity, topology, managed entities, repository relationships, or managed scope that the current resolution is attempting to establish.

In particular, project-scoped configuration shall not bootstrap the identity of the project whose scope is required to locate or interpret that same configuration.

### 3.3 Evidence rather than authority

Bootstrap effective configuration may provide project hints, selection constraints, recognition settings, or other approved evidence.

It shall not independently determine:

- final managed-project identity;
- managed-project topology;
- managed scope;
- ownership classification;
- targetability;
- mutation authority;
- authorization;
- application-level acceptance.

Those remain with their established DD-1 owners.

## 4. Managed Project Resolution Integration

DD-1.3 references to effective configuration as project-resolution evidence shall be interpreted as references to configuration that is valid at the current resolution stage.

Before managed-project identity exists, that means bootstrap effective configuration only.

Once sufficient managed-project context exists, DD-1.3 may consume later project-aware configuration where the owning workflow explicitly permits re-resolution or refinement, but later configuration shall not silently retroactively replace the already-selected project with a materially different project.

If project-aware configuration materially conflicts with the resolved project identity, topology, or target assumptions, the conflict shall be surfaced through DD-1.2 diagnostics and returned to the Application Engine for explicit policy/acceptance handling.

Managed-scope resolution may consume operation-effective configuration where scope or exclusion semantics depend upon it. DD-1.3 therefore owns the scope decision, while DD-1.4 owns how the configuration values feeding that decision became effective.

## 5. Configuration Resolution Integration

DD-1.4 shall distinguish at least two semantic resolution stages when managed-project context is required:

1. **bootstrap resolution** — resolves only concerns and sources whose applicability is independent of the unresolved managed project;
2. **project/scope-aware resolution** — occurs after sufficient DD-1.3 context exists and may resolve project-, entity-, repository-, layer-, resource-, or scope-dependent concerns.

The normal operation-facing Effective Configuration Snapshot is produced only after the context required by its constituent concerns has been established.

A bootstrap snapshot or bootstrap effective value is therefore not automatically the complete operation configuration snapshot.

DD-1.4 remains the sole owner of candidate applicability, validation, precedence, fallback, provenance and effective-value semantics in both stages. Staging changes when enough context exists to resolve a concern; it does not create a second configuration-resolution authority.

## 6. Application Engine Coordination

DD-1.5 owns coordination of the staged sequence where required by a use case.

The Engine shall ensure that:

- project resolution is not asked to consume project-dependent effective configuration before project context exists;
- configuration resolution is not asked to infer project identity independently;
- bootstrap values are preserved with provenance;
- project/scope-aware values are resolved against the authoritative DD-1.3 context;
- the operation-effective snapshot required by scope or policy decisions is available before those decisions are finalized;
- material changes between bootstrap assumptions and later resolved context trigger appropriate validation, policy, safety, scope and authorization re-evaluation;
- no consequential execution begins while a material bootstrap/project-resolution conflict remains unresolved.

The DD-1.5 orchestration lifecycle shall therefore be interpreted as a dependency lifecycle, not as a fixed one-pass sequence in which managed scope must always precede effective configuration.

## 7. Re-resolution and Stability

Staged resolution does not authorize unlimited recursive re-resolution.

If later project-aware configuration would materially change the project candidate that was selected using bootstrap evidence, AppManager shall not enter an uncontrolled configuration/project-resolution loop.

The owning use case and Application Engine shall instead apply an explicit policy such as:

- accept the existing project where the later value is non-conflicting;
- re-resolve once at an explicit semantic checkpoint where safe;
- require disambiguation;
- reject the operation with structured conflict diagnostics.

Any re-resolution that changes target, scope, provider, safety assumptions, or consequential-effect semantics shall invalidate dependent decisions and require their re-evaluation.

## 8. Headless and Interactive Equivalence

The same staged semantics apply in TUI, Headless, GUI, IDE, CI, automation, and future interaction modes.

An interactive adapter may acquire a permitted bootstrap candidate when the workflow allows interaction, but it does not make that candidate effective directly.

Headless execution shall fail deterministically when required bootstrap configuration or project disambiguation cannot be obtained from permitted non-interactive sources.

## 9. Diagnostics

The shared diagnostic model should be capable of distinguishing at least:

- missing bootstrap configuration;
- invalid bootstrap candidate;
- bootstrap source not applicable;
- bootstrap/project evidence conflict;
- project identity unresolved;
- project-dependent configuration attempted before sufficient context;
- project-aware configuration conflicting with resolved context;
- scope-dependent configuration unresolved before scope finalization;
- re-resolution required;
- unsafe or unsupported resolution cycle.

Diagnostics shall preserve safe provenance without exposing sensitive configuration values.

## 10. Conformance Rules

The following rules close MC-001:

**DD-CORE-BOOT-001 — No circular applicability**  
Configuration used to establish managed-project identity shall not require that unresolved identity in order to determine its own applicability or effective value.

**DD-CORE-BOOT-002 — Bootstrap subset**  
Pre-project configuration resolution shall be limited to concerns and sources explicitly valid without managed-project context.

**DD-CORE-BOOT-003 — Project-aware second stage**  
Project-, topology-, entity-, repository-, layer-, resource-, or scope-dependent configuration shall become eligible only after sufficient DD-1.3 context exists.

**DD-CORE-BOOT-004 — Evidence is not project authority**  
Bootstrap effective configuration may contribute project-resolution evidence but shall not independently establish project identity, scope, targetability, mutation authority, or authorization.

**DD-CORE-BOOT-005 — Operation snapshot follows required context**  
An operation-facing effective-configuration snapshot shall not be accepted until the managed-project context required by its constituent concerns is available. Managed scope may then consume that snapshot where scope/exclusion semantics depend upon configuration.

**DD-CORE-BOOT-006 — Material change requires re-evaluation**  
Where later resolution materially changes assumptions used for project, scope, safety, authorization, provider selection, or effects, dependent decisions shall be re-evaluated before consequential execution.

**DD-CORE-BOOT-007 — No uncontrolled recursive resolution**  
Managed-project, configuration and managed-scope resolution shall not recurse indefinitely; material conflicts shall reach an explicit Engine-governed resolution, disambiguation, or failure state.

**DD-CORE-BOOT-008 — Cross-mode equivalence**  
Interactive and Headless modes shall use the same staged applicability and resolution semantics; interaction changes candidate acquisition only.

**DD-CORE-BOOT-009 — Scope does not universally precede configuration**  
Where managed-scope semantics depend upon project/scope-aware effective configuration, the required operation-effective values shall be resolved before final scope acceptance. This does not transfer scope authority from DD-1.3 to DD-1.4.

## 11. Effect on DD-1 Baseline

This clarification does not introduce a new subsystem, domain, capability family, transport, persistence model, or runtime boundary.

It does not alter the ownership established by DD-1.3, DD-1.4, or DD-1.5.

It makes their dependency ordering explicit:

> **context-independent/bootstrap configuration -> managed-project resolution -> project/scope-dependent configuration -> operation snapshot -> managed-scope/policy/use-case execution**

DD-1.5 now carries this staged lifecycle directly. DD-1.3 and DD-1.4 remain governed by this clarification until their related-design/backlink and local wording consolidation is performed.

With these rules in force, MC-001 from the Application Core Detailed Design Conformance Audit remains closed and the DD-1 Application Core is suitable to serve as the governing contract baseline for DD-2 Shared Capability Detailed Design.