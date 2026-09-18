# DD-1.4 — AppManager Configuration Resolution Detailed Design

> **Detailed Design ID:** DD-1.4
>
> **Design family:** DD-1 — Application Core

> **Status:** Version 1 Detailed Design Specification
>
> **Detailed Design authority:** This document defines the permanent internal design by which AppManager resolves configuration candidates into effective configuration for application operations. It refines, but does not override, the root Design Specification, Functional Specifications, or accepted ADRs.
>
> **Sources and navigation:** [Project Documentation Guide](../project-documentation-guide-v01.md), [AppManager Design Specification](../appmanager-design-specification-v01.md), [docs/functional/configuration-functional-specification-v01.md](../functional/configuration-functional-specification-v01.md)
>
> **Related Detailed Design authorities:** [DD-1.1 — Application Invocation](dd-1-1-application-invocation-detailed-design-v01.md), [DD-1.2 — Execution Outcomes](dd-1-2-execution-outcomes-detailed-design-v01.md), [DD-1.3 — Managed Project](dd-1-3-managed-project-detailed-design-v01.md), [DD-1.5 — Application Engine](dd-1-5-application-engine-detailed-design-v01.md), [Application Core Bootstrap Resolution](dd-1-5-application-engine-detailed-design-v01.md#_8-orchestration-lifecycle)
>
> **Planning source:** [Detailed Design Register](../project_management/detailed-design-register-v01.md)

## 1. Purpose

Configuration Resolution turns approved source candidates into effective values for an invocation, project, scope, operation or capability request. Concern descriptors select applicable sources and policy; candidate and provenance models retain the evidence needed to explain the selected value or failure. The Application Engine consumes that result under [Design](../appmanager-design-specification-v01.md#_6-2-application-engine-authority).

The stage contract in [§8](#_8-resolution-context) separates bootstrap eligibility from project-aware resolution. The [Engine lifecycle](dd-1-5-application-engine-detailed-design-v01.md#_8-orchestration-lifecycle) coordinates these inputs with project resolution and scope decisions.

## 2. Scope

This design owns permanent internal contracts for:

- configuration concern identity;
- source registration and source classification;
- source applicability;
- candidate acquisition;
- candidate provenance;
- candidate presence-state semantics;
- candidate validation;
- precedence and selection policy;
- fallback policy;
- required versus optional values;
- effective configuration values;
- immutable effective-configuration snapshots;
- project-, scope-, invocation-, operation-, and capability-specific resolution context;
- deterministic Headless resolution;
- interactive candidate acquisition hand-off;
- sensitive configuration classification and redaction;
- configuration-resolution diagnostics;
- configuration explanation and provenance reporting;
- resolution/persistence separation;
- refresh and invalidation boundaries;
- configuration change visibility to subsequent operations;
- cross-mode equivalence;
- integration with DD-1.1 invocation, DD-1.2 outcomes, DD-1.3 managed-project context, and DD-1.5 staged Application Engine coordination.

This design does not own Settings-domain CRUD workflows, persistence user experiences, domain-specific configuration meaning, command semantics, managed-scope authority, provider execution semantics, secret-store technology, serialization formats, or presentation rendering.

## 3. Out of Scope

The following remain Implementation Specification concerns unless a later accepted architectural decision elevates them:

- concrete TypeScript interfaces, classes, enums, generic parameters, or utility types;
- exact source-file and package paths;
- concrete configuration file names unless adopted elsewhere as architectural conventions;
- JSON, YAML, TOML, environment-file, database, registry, or other storage formats;
- exact environment-variable names;
- exact secret-store or credential-manager technology;
- operating-system credential APIs;
- concrete encryption algorithms or key-management systems;
- exact cache implementation;
- exact dependency-injection framework;
- concrete parser libraries;
- exact filesystem layout;
- exact persistence methods;
- exact logging implementation;
- concrete error classes;
- exact reload/watch mechanisms;
- exact lifecycle hooks;
- exact transport or serialization for external invocation.

The design deliberately defines semantic seams before implementation topology.

## 4. Architectural Position

Configuration Resolution participates in two semantic stages where managed-project identity and project-aware configuration depend on one another. Both stages use this same DD-1.4 resolution authority; the stages differ only in which context is available and therefore which concerns/sources are applicable.

```text
invocation / host context
        |
        v
context-independent configuration candidates
        |
        v
+-------------------------------------+
| Configuration Resolution boundary   |
| bootstrap applicability / validation|
| precedence / fallback / provenance  |
+------------------+------------------+
                   |
                   v
      bootstrap effective configuration
                   |
                   v
        DD-1.3 managed-project resolution
                   |
                   v
        sufficient managed-project context
                   |
                   v
+-------------------------------------+
| Configuration Resolution boundary   |
| project/scope-aware applicability   |
| validation / precedence / fallback  |
| provenance / effective construction |
+------------------+------------------+
                   |
                   v
      operation effective snapshot
                   |
                   +--> DD-1.3 managed-scope resolution where scope depends on configuration
                   |
                   v
          Application Engine
                   |
                   v
      domain / capability semantics
```

The diagram projects the [Engine staged lifecycle](dd-1-5-application-engine-detailed-design-v01.md#_8-orchestration-lifecycle) through the configuration boundary. [Bounded resolution](dd-1-5-application-engine-detailed-design-v01.md#dd-core-boot-007) governs staging; [Design §6.6](../appmanager-design-specification-v01.md#_6-6-capability-boundaries-and-providers) governs topology independence.

## 5. Responsibility Model

The design is decomposed into the following permanent responsibilities:

1. **Configuration Concern Catalogue** — identifies configuration concerns and their resolution semantics.
2. **Configuration Source Contract** — provides candidate values from an approved source class.
3. **Source Applicability Evaluator** — determines whether a source may participate for the current concern and context.
4. **Candidate Acquisition Coordinator** — obtains candidate evidence without making it effective.
5. **Candidate Model** — preserves value state, source class, scope, provenance, sensitivity, and acquisition evidence.
6. **Candidate Validator** — determines whether a candidate is structurally and semantically eligible for consideration.
7. **Resolution Policy** — defines concern-specific precedence, fallback, override, default, and requiredness semantics.
8. **Configuration Resolver** — applies applicability, validation, precedence, fallback, and selection to produce an effective value or structured failure.
9. **Effective Configuration Snapshot** — provides stable operation-facing values and provenance.
10. **Explanation Projector** — exposes safe provenance and selection reasoning where required.
11. **Interactive Acquisition Hand-off** — requests additional candidate acquisition without transferring resolution authority to the adapter.
12. **Configuration Invalidation Boundary** — defines when future operations must observe changed durable configuration.

These are responsibility boundaries, not a mandatory one-class-per-item implementation.

## 6. Configuration Concern Contract

### 6.1 Purpose

A configuration concern is the canonical AppManager identity for one semantically coherent configurable value or value family.

Examples may include author defaults, repository defaults, AI-provider selection, license preference, template selection, command defaults, environment-related values, or domain-specific configuration introduced by approved specifications.

### 6.2 Concern descriptor

A configuration concern descriptor shall be capable of representing:

- stable concern identity;
- owning domain or cross-cutting authority;
- value kind or validation contract;
- required versus optional semantics;
- permitted source classes;
- permitted scopes;
- invocation-override permission;
- environment-input permission;
- provider-input permission;
- contextual/detected-input permission;
- interactive acquisition permission;
- built-in default availability;
- sensitivity classification;
- precedence or selection policy identity;
- fallback policy identity;
- whether provenance is expected to be externally explainable;
- whether runtime re-resolution is permitted.

The descriptor defines configuration semantics, not presentation labels or storage paths.

### 6.3 Ownership of meaning

Concern meaning and constraints follow [FR-CONFIG-063](../functional/configuration-functional-specification-v01.md#fr-config-063). Shared resolution follows [FR-CONFIG-017](../functional/configuration-functional-specification-v01.md#fr-config-017) through the descriptor above.

## 7. Configuration Source Contract

### 7.1 Source classes

Source classes bind [FR-CONFIG-005](../functional/configuration-functional-specification-v01.md#fr-config-005) to the source-instance contract below. Each concern descriptor selects which approved classes participate.

### 7.2 Source identity versus source class

Source class and source instance are distinct.

For example, two project-scoped sources may both be project configuration while referring to different scopes or storage origins.

The model shall therefore preserve enough source identity to support:

- applicability;
- provenance;
- conflict diagnostics;
- project/scope association;
- explanation;
- invalidation.

### 7.3 Source contract behaviour

A configuration source may:

- report whether it can participate for a concern/context;
- acquire zero, one, or multiple candidates where the concern permits;
- report unavailable/inaccessible source state;
- provide provenance metadata;
- classify candidate sensitivity where known;
- report source-local acquisition diagnostics.

A configuration source shall not:

- decide final precedence;
- decide application semantics;
- expand managed scope;
- bypass candidate validation;
- persist an interactively supplied value unless an owning use case explicitly requests persistence;
- reinterpret an invalid value as valid merely to allow execution;
- expose sensitive values through unrestricted diagnostics.

## 8. Resolution Context

### 8.1 Purpose

Configuration resolution occurs relative to explicit operation context rather than in a global vacuum.

A resolution context shall be capable of carrying, where available at the current stage:

- invocation identity where available;
- command/use-case identity;
- managed-project identity;
- managed-project context reference;
- managed scope or relevant target subset;
- explicit invocation configuration candidates;
- execution mode characteristics;
- interaction capability indicators;
- environment observations approved for use;
- provider/capability context where relevant;
- correlation metadata;
- policy/evaluation phase where relevant.

A bootstrap resolution context intentionally lacks authoritative managed-project identity, topology and managed scope. An operation/project-aware context may carry those values once DD-1.3 has established them.

### 8.2 Context authority

Resolution context supplies observations under [FR-CONFIG-066](../functional/configuration-functional-specification-v01.md#fr-config-066). Project, file, repository, host, framework and provider facts participate only through the descriptor’s permitted contextual/detected-input class.

### 8.3 Bootstrap resolution dependency

Bootstrap resolution supplies the context-independent effective values needed by the [Engine's staged lifecycle](dd-1-5-application-engine-detailed-design-v01.md#_8-orchestration-lifecycle). It uses this specification's concern catalogue, validation, precedence, fallback, sensitivity and provenance contracts at both stages.

#### DD-CORE-BOOT-001 — No circular applicability {#dd-core-boot-001}

A candidate cannot establish the project identity on which its own applicability or effective value depends. This excludes candidates requiring unresolved topology, managed entities, repository relationships or managed scope, including project-scoped configuration whose location or interpretation requires that same project.

#### DD-CORE-BOOT-002 — Bootstrap subset {#dd-core-boot-002}

Only concerns and sources explicitly valid without the unresolved project context participate in bootstrap resolution. A concern may permit explicit invocation values, independent host/integration context, tool configuration, environment-derived values, built-in defaults or another explicitly approved context-independent source. This list grants no source universal applicability; the concern's validation and precedence still apply.

#### DD-CORE-BOOT-003 — Project-aware eligibility {#dd-core-boot-003}

Project-, topology-, entity-, repository-, layer-, resource- and scope-dependent candidates become eligible only when DD-1.3 has supplied the context required by the concern. Bootstrap values are passed as [project-resolution evidence](dd-1-3-managed-project-detailed-design-v01.md#dd-core-boot-004).

#### DD-CORE-BOOT-005 — Operation snapshot context {#dd-core-boot-005}

The operation-facing snapshot is accepted only after the context required by its constituent concerns is available. A bootstrap snapshot is therefore not automatically a complete operation snapshot. The scope decision consumes effective values according to [DD-1.5's scope checkpoint](dd-1-5-application-engine-detailed-design-v01.md#dd-core-boot-009).

### 8.4 Managed Project dependency

Project association follows [FR-CONFIG-064](../functional/configuration-functional-specification-v01.md#fr-config-064) and [Design](../appmanager-design-specification-v01.md#_9-6-project-discovery-and-context-resolution). The resolver consumes DD-1.3 context at the [§8.3 eligibility boundary](#_8-3-bootstrap-resolution-dependency); current directories, nearby files, repository containment, host selections and framework markers enter that project owner as evidence.

### 8.5 Managed scope dependency

Scope-dependent concern eligibility follows [DD-CORE-BOOT-003](#dd-core-boot-003). A concern supplying a value needed for scope finalization uses the conditional [DD-1.5 scope checkpoint](dd-1-5-application-engine-detailed-design-v01.md#dd-core-boot-009), once its required project context exists. Scope authority follows [Design §9.7](../appmanager-design-specification-v01.md#_9-7-managed-scope-and-operation-targeting).

## 9. Candidate Model

### 9.1 Candidate versus effective value

The source-supplied candidate model below feeds governed resolution under [Design](../appmanager-design-specification-v01.md#_8-2-configuration-resolution-and-effective-configuration). Its effective result is represented separately in [§15](#_15-resolution-result).

### 9.2 Candidate fields

A candidate shall be capable of representing:

- concern identity;
- candidate value or protected value reference;
- presence state;
- source class;
- source identity;
- configuration scope;
- target-project association where applicable;
- managed-entity association where applicable;
- acquisition provenance;
- sensitivity classification;
- validation status;
- compatibility metadata where applicable;
- acquisition diagnostics;
- timestamp/version/revision evidence where useful for staleness detection.

### 9.3 Presence-state semantics

The shared model shall distinguish, where semantically relevant:

- no candidate supplied;
- explicit unset;
- explicit empty value;
- concrete value;
- inaccessible protected value;
- unresolved provider reference;
- invalid representation.

Exact language-level representations remain Implementation Specification concerns.

### 9.4 Empty value semantics

Empty-value interpretation follows [FR-CONFIG-027](../functional/configuration-functional-specification-v01.md#fr-config-027). The §9.3 representation retains enough information for a concern to treat empty as a concrete value, explicit clearing/unset, invalid or absent.

## 10. Source Applicability

### 10.1 Applicability dimensions

Source applicability may depend on:

- concern identity;
- target project;
- managed scope;
- invocation;
- operation;
- execution mode;
- provider/capability availability;
- sensitivity requirements;
- source portability/shareability rules;
- explicit ownership policy.

### 10.2 Applicability before precedence

A non-applicable candidate does not participate in precedence.

The conceptual order is:

```text
source known
   -> source applicable?
      -> candidate acquired
         -> candidate valid?
            -> candidate eligible for precedence/selection
```

Presence alone cannot move a candidate into the effective set.

### 10.3 Project-local and project-shared applicability

Project-local/project-shared/tool ordering follows [FR-CONFIG-018](../functional/configuration-functional-specification-v01.md#fr-config-018) for applicable tiers. Project/scope association is established through [§8](#_8-resolution-context) before those candidates enter precedence.

## 11. Candidate Acquisition

### 11.1 Acquisition coordinator

Candidate acquisition coordinates approved sources for a specific concern and resolution context.

It may acquire candidates eagerly or lazily, provided the resulting semantics are equivalent.

### 11.2 Acquisition does not imply selection

Acquisition must preserve all materially relevant candidate evidence needed for:

- precedence;
- fallback;
- conflict resolution;
- validation;
- provenance;
- explanation.

A source adapter must not discard a lower-priority candidate merely because it assumes another source will win if that candidate may be needed for permitted fallback or diagnostics.

### 11.3 Source unavailability

Source unavailability shall be represented distinctly from:

- source not applicable;
- source applicable but no candidate present;
- source accessible but candidate invalid;
- source containing explicit unset;
- source containing valid candidate.

This distinction is required for deterministic failure and remediation.

## 12. Candidate Validation

### 12.1 Validation stages

Candidate validation may include:

1. representation validation;
2. type/shape validation;
3. concern-specific semantic validation;
4. context compatibility validation;
5. execution-mode compatibility validation;
6. provider/capability availability validation where materially required;
7. safety/sensitivity suitability validation.

Not every concern requires every stage.

### 12.2 Validation result

Expected validation outcomes shall be structured rather than represented only by thrown exceptions.

A validation result shall support at least:

- valid;
- invalid;
- unavailable dependency;
- inaccessible protected value;
- unsupported in current context;
- unresolved external reference.

### 12.3 Higher-priority invalid candidate

Higher-priority invalid candidates follow [FR-CONFIG-024](../functional/configuration-functional-specification-v01.md#fr-config-024) through the concern policy in §13.

### 12.4 Safety-sensitive invalid candidates

Where falling back would conceal a material misconfiguration, security problem, scope mismatch, or explicit caller error, policy should prefer explicit failure unless the Functional Specification permits safe fallback.

### 12.5 Invocation candidate validation

Invocation candidates follow [FR-CONFIG-012](../functional/configuration-functional-specification-v01.md#fr-config-012) and [FR-CONFIG-013](../functional/configuration-functional-specification-v01.md#fr-config-013) through the same validation stages, including project/scope applicability and sensitivity.

## 13. Resolution Policy

### 13.1 Purpose

Resolution policy defines how eligible candidates for one concern become an effective result.

### 13.2 Policy dimensions

A resolution policy may define:

- source precedence;
- source-selection rules;
- equal-priority conflict behaviour;
- invalid-candidate fallback behaviour;
- absence fallback behaviour;
- explicit-unset behaviour;
- default behaviour;
- invocation-override behaviour;
- interactive-completion behaviour;
- requiredness;
- conflict/disambiguation rules;
- multi-value combination where the concern genuinely supports aggregation.

### 13.3 No universal source order

Additional source ordering follows [FR-CONFIG-018](../functional/configuration-functional-specification-v01.md#fr-config-018) through the concern’s §13.2 policy; the descriptor does not install a universal chain.

### 13.4 Explicit caller values

Invocation overrides apply [FR-CONFIG-013](../functional/configuration-functional-specification-v01.md#fr-config-013). Non-overridable safety, architecture, scope and concern constraints remain outside the permitted override.

### 13.5 Built-in defaults

Built-in defaults follow [FR-CONFIG-029](../functional/configuration-functional-specification-v01.md#fr-config-029).

### 13.6 Interactive completion

Interactive acquisition follows [Design](../appmanager-design-specification-v01.md#_8-4-separation-of-resolution-and-interaction); the concern policy assigns candidate eligibility and precedence.

## 14. Configuration Resolver

### 14.1 Resolver responsibility

The resolver applies the local descriptor, applicability, candidate and policy models under [FR-CONFIG-016](../functional/configuration-functional-specification-v01.md#fr-config-016) and [FR-CONFIG-022](../functional/configuration-functional-specification-v01.md#fr-config-022). The flow below shows their collaboration.

### 14.2 Conceptual resolution flow

```text
configuration concern
        |
        v
resolution context
        |
        v
applicable source determination
        |
        v
candidate acquisition
        |
        v
candidate validation
        |
        v
eligibility set
        |
        v
precedence / selection / conflict rules
        |
        +------> permitted fallback/default
        |
        v
effective value OR structured resolution failure
```

### 14.3 Resolver non-authority

Effective-value selection follows [Design](../appmanager-design-specification-v01.md#_6-2-application-engine-authority) at the consuming-use-case boundary. Persistence follows [§25](#_25-persistence-boundary), and supplying a value does not satisfy the independent authorization requirement in [§31.3](#_31-3-authorization-independence).

## 15. Resolution Result

### 15.1 Result classes

A concern resolution shall produce one of the following semantic classes:

- effective value resolved;
- optional value absent;
- required value unresolved;
- invalid configuration;
- conflicting candidates;
- unavailable source/dependency;
- inaccessible protected value;
- interaction required;
- interaction cancelled;
- unsupported configuration/context.

These integrate with DD-1.2 diagnostics/outcome semantics.

### 15.2 Effective value model

An effective configuration value shall be capable of carrying:

- concern identity;
- effective value or protected value access handle;
- provenance summary;
- source class;
- source identity where safe;
- configuration scope;
- target/scope association where relevant;
- sensitivity metadata;
- selection reason/policy reference where useful;
- validation evidence where useful;
- revision/staleness evidence where required.

### 15.3 Optional absence

Optional absence follows [FR-CONFIG-033](../functional/configuration-functional-specification-v01.md#fr-config-033) after resolution establishes that no effective value exists.

## 16. Effective Configuration Snapshot

### 16.1 Purpose

The snapshot gives an operation a coherent set of the effective values in §15. Its stage completeness follows [DD-CORE-BOOT-005](#dd-core-boot-005).

### 16.2 Snapshot properties

An operation-effective configuration snapshot should be:

- immutable from the consuming operation's perspective;
- associated with the invocation/use case;
- associated with the relevant managed project once project context is required;
- associated with the relevant managed scope where that scope is already established and required by the constituent concerns;
- staged relative to managed-scope acceptance under [DD-CORE-BOOT-009](dd-1-5-application-engine-detailed-design-v01.md#dd-core-boot-009);
- composed only of governed effective values and explicit optional absences;
- capable of exposing safe provenance;
- stable for the phase of execution that depends on it.

### 16.3 No retroactive mutation

Accepted snapshots apply [FR-CONFIG-051](../functional/configuration-functional-specification-v01.md#fr-config-051). Future-operation visibility follows [FR-CONFIG-050](../functional/configuration-functional-specification-v01.md#fr-config-050), while opt-in dynamic re-resolution is defined in §27.4.

### 16.4 Selective snapshot construction

An operation should resolve only configuration concerns it actually requires.

The model does not require loading the entire AppManager configuration universe for every command.

## 17. Configuration Sets and Multi-Concern Resolution

### 17.1 Batch resolution

Where a use case requires several concerns, resolution may occur as a coordinated batch.

The batch shall preserve individual concern provenance and failure reasons.

### 17.2 Required-set semantics

Dependent effects follow [FR-CONFIG-032](../functional/configuration-functional-specification-v01.md#fr-config-032). Independent work may proceed only where the owning use-case design permits it, using [DD-1.2 partial results](dd-1-2-execution-outcomes-detailed-design-v01.md#_14-partial-completion).

### 17.3 Cross-concern validation

Some values may be individually valid but mutually incompatible.

Cross-concern validation may therefore occur after individual effective values are selected but before the configuration snapshot is accepted by the Application Engine/use case.

Examples may include:

- provider selection incompatible with credential source;
- repository option incompatible with managed scope;
- template selection incompatible with requested target type.

The exact rules belong to the owning concern/domain design.

## 18. Provenance

### 18.1 Provenance model

Provenance shall preserve enough information to answer, where safe:

- which source class supplied the effective candidate;
- which source instance supplied it;
- which configuration scope applied;
- whether it was explicit, persisted, detected, environment-derived, provider-derived, defaulted, or interactive;
- why it outranked or replaced another candidate where explanation is required;
- whether fallback occurred.

### 18.2 Provenance is not raw source disclosure

Source/status explanation applies [FR-CONFIG-046](../functional/configuration-functional-specification-v01.md#fr-config-046). For example, a protected environment credential can be reported as present and valid without exposing its value.

### 18.3 Consumer access

Provenance consumers use the §18.1 model under [FR-CONFIG-045](../functional/configuration-functional-specification-v01.md#fr-config-045).

## 19. Explainability

### 19.1 Explanation contract

The resolver shall be capable of producing a safe explanation for materially significant resolution outcomes.

An explanation may include:

- concern identity;
- applicable source classes;
- selected source class;
- ignored non-applicable sources;
- rejected invalid candidates;
- fallback performed;
- default selected;
- conflict detected;
- required source missing;
- interaction required;
- remediation guidance.

### 19.2 Explanation is not presentation

Structured explanation is projected under [Design](../appmanager-design-specification-v01.md#_4-6-presentation-independence) for each adapter.

### 19.3 Explanation minimisation

Explanation uses [§22 sensitivity handling](#_22-sensitive-configuration), preferring semantic reason codes and safe summaries over raw source dumps.

## 20. Interactive Acquisition

### 20.1 Hand-off boundary

When permitted under [Design](../appmanager-design-specification-v01.md#_8-4-separation-of-resolution-and-interaction), the resolver returns its `interaction required` state to the invocation/application layer for candidate acquisition.

### 20.2 Re-entry into resolution

An interactively supplied value shall re-enter the same governed candidate pipeline:

```text
interaction required
      -> adapter acquires candidate
      -> candidate submitted
      -> validation
      -> precedence / policy
      -> effective value or failure
```

The adapter does not directly inject an effective value.

### 20.3 Cancellation

Acquisition cancellation applies [FR-CONFIG-038](../functional/configuration-functional-specification-v01.md#fr-config-038) through [DD-1.2 cancellation](dd-1-2-execution-outcomes-detailed-design-v01.md#_17-cancellation-model).

### 20.4 Persistence

Acquired candidates follow [FR-CONFIG-047](../functional/configuration-functional-specification-v01.md#fr-config-047) and [FR-CONFIG-048](../functional/configuration-functional-specification-v01.md#fr-config-048).

## 21. Headless Resolution

### 21.1 Deterministic non-interactive behaviour

Headless resolution uses [FR-INV-020](../functional/application-invocation-functional-specification-v01.md#fr-inv-020) with the same candidate validation and policy models.

### 21.2 Interaction-required state in Headless mode

A Headless `interaction required` result maps to [FR-INV-020](../functional/application-invocation-functional-specification-v01.md#fr-inv-020) and [FR-CONFIG-034](../functional/configuration-functional-specification-v01.md#fr-config-034), identifying the unresolved concern and safe remediation.

### 21.3 No automation weakening

Automation applies [FR-CONFIG-041](../functional/configuration-functional-specification-v01.md#fr-config-041) to the local concern/candidate models.

## 22. Sensitive Configuration

### 22.1 Classification

The descriptor and candidate sensitivity fields implement [Design](../appmanager-design-specification-v01.md#_8-7-sensitive-configuration) for credentials, tokens, private keys and other protected configuration.

### 22.2 Protected-value representation

The shared model should permit protected values to be represented by bounded access/reference abstractions rather than requiring unrestricted plaintext propagation through every consumer.

Exact secure-value technology belongs to Implementation Specification.

### 22.3 Least disclosure

Diagnostics, warnings, events, logs, reports, payloads, provenance and rendering apply [Design](../appmanager-design-specification-v01.md#_8-7-sensitive-configuration) through [DD-1.2 redaction](dd-1-2-execution-outcomes-detailed-design-v01.md#_24-sensitive-information-and-redaction).

### 22.4 Sensitivity propagation

When a value is transformed, combined, or projected, sensitivity classification shall be preserved or strengthened as necessary.

It shall not be accidentally downgraded merely because a provider, adapter, or cache uses a generic representation.

### 22.5 Protected-source non-authority

Protected-value sources follow [Design](../appmanager-design-specification-v01.md#_8-1-configuration-model) through the source contract.

## 23. Defaults and Fallbacks

### 23.1 Fallback taxonomy

The model shall distinguish:

- fallback due to absence;
- fallback due to invalid candidate where policy permits;
- fallback due to unavailable source where policy permits;
- fallback to built-in default;
- fallback to contextual/detected candidate;
- no fallback permitted.

### 23.2 Fallback provenance

Fallback is recorded in [§18 provenance](#_18-provenance) and [§19 explanation](#_19-explainability) where useful.

### 23.3 No silent masking

Blocking higher-priority errors follow [FR-CONFIG-024](../functional/configuration-functional-specification-v01.md#fr-config-024) and [FR-CONFIG-028](../functional/configuration-functional-specification-v01.md#fr-config-028) in the concern policy.

## 24. Conflict Handling

### 24.1 Equal-authority conflicts

Equal-policy-position conflicts follow [FR-CONFIG-072](../functional/configuration-functional-specification-v01.md#fr-config-072) when no deterministic tie-break is available.

### 24.2 Conflict diagnostics

Conflict diagnostics should identify:

- concern identity;
- conflicting source classes/identities where safe;
- relevant scopes;
- why precedence did not resolve the conflict;
- permitted remediation.

### 24.3 Interactive disambiguation

Permitted selection follows [Design](../appmanager-design-specification-v01.md#_8-4-separation-of-resolution-and-interaction) through the re-entry model in §20.2. It supplies candidate evidence or explicit disambiguation input to the policy.

## 25. Persistence Boundary

### 25.1 Resolution is read/selection semantics

Durable management is consumed through [Settings](../dd_4_policy_and_resource_domains/dd-4-2-settings-domain-detailed-design-v01.md) or another explicit persistence owner under [FR-CONFIG-047](../functional/configuration-functional-specification-v01.md#fr-config-047) and [FR-CONFIG-075](../functional/configuration-functional-specification-v01.md#fr-config-075).

### 25.2 One-off candidate rule

One-off invocation/interactive candidates apply [FR-CONFIG-047](../functional/configuration-functional-specification-v01.md#fr-config-047) and [FR-CONFIG-049](../functional/configuration-functional-specification-v01.md#fr-config-049).

### 25.3 Explicit promotion

Durable promotion of detected/provider/environment/state information applies [FR-CONFIG-060](../functional/configuration-functional-specification-v01.md#fr-config-060).

### 25.4 Settings integration

Settings writes/removals follow [FR-CONFIG-075](../functional/configuration-functional-specification-v01.md#fr-config-075) when they become candidate inputs to this resolver.

## 26. Configuration Versus Operational State

### 26.1 Authority separation

Durable configuration, operational state, logs, reports, generated artefacts, caches and temporary/provider observations are classified under [Design](../appmanager-design-specification-v01.md#_8-8-configuration-state-reports-and-logs).

### 26.2 No accidental promotion

Operational-state inputs apply [Design](../appmanager-design-specification-v01.md#_8-8-configuration-state-reports-and-logs) through the permitted-source declaration in §6.2.

### 26.3 Cache non-authority

A cache may accelerate acquisition or resolution but does not become a new precedence tier.

Cached data must retain the authority/provenance semantics of the source/result it represents.

## 27. Invalidation and Refresh

### 27.1 Future-operation visibility

Durable changes become eligible for future resolution under [FR-CONFIG-050](../functional/configuration-functional-specification-v01.md#fr-config-050).

### 27.2 Invalidation responsibility

The architecture requires an invalidation boundary, but does not mandate a particular cache implementation.

The implementation must ensure stale cached data does not silently override newer authoritative configuration.

### 27.3 Snapshot stability

Invalidation preserves accepted snapshots under [FR-CONFIG-051](../functional/configuration-functional-specification-v01.md#fr-config-051); dynamic re-resolution follows §27.4.

### 27.4 Dynamic re-resolution

Dynamic re-resolution is opt-in at the use-case level because changing effective configuration mid-operation can alter semantics, safety, provider selection, or targets.

If permitted, the workflow must define:

- which concerns may change;
- at which checkpoints;
- how changed values are revalidated;
- whether authorization must be reconsidered;
- how effects already performed are reported.

## 28. Staleness and Concurrency

### 28.1 Stale configuration evidence

Where configuration mutation can race with execution, resolution may preserve source revision or observation evidence sufficient to detect materially stale configuration where required.

### 28.2 Concurrency policy boundary

This design does not impose global locking.

A consumer may use:

- immutable snapshot semantics;
- revision checks;
- optimistic validation;
- explicit refresh checkpoints;
- other approved mechanisms.

### 28.3 Consequential operations

If a materially changed configuration value would alter target, scope, provider, safety, or effect semantics, the Application Engine/use case shall decide whether execution remains acceptable.

The resolver supplies evidence; it does not independently authorize continuation.

## 29. Diagnostics

### 29.1 Diagnostic categories

Configuration-local distinctions map through [DD-OUTCLAR-006](dd-1-2-execution-outcomes-detailed-design-v01.md#dd-outclar-006). The model should support:

- unknown configuration concern;
- source unavailable;
- source inaccessible;
- source not applicable;
- missing required configuration;
- invalid candidate;
- unsupported candidate;
- conflicting candidates;
- invalid project/scope association;
- interaction required;
- interaction cancelled;
- protected value unavailable;
- provider dependency unavailable;
- stale configuration evidence;
- cross-concern incompatibility;
- unexpected resolution fault.

### 29.2 Diagnostic fields

Where useful and safe, diagnostics may identify:

- concern identity;
- source class;
- source identity;
- configuration scope;
- target project/scope;
- validation stage;
- machine-readable reason code;
- human-presentable safe summary;
- remediation guidance;
- correlation metadata.

### 29.3 Redaction

Diagnostic value exposure follows [§22](#_22-sensitive-configuration) and [DD-1.2 redaction](dd-1-2-execution-outcomes-detailed-design-v01.md#_24-sensitive-information-and-redaction).

## 30. Outcome Integration

### 30.1 DD-1.2 relationship

Resolution evidence maps into [DD-1.2 diagnostics](dd-1-2-execution-outcomes-detailed-design-v01.md#_9-diagnostic-model) through its [local-refinement rule](dd-1-2-execution-outcomes-detailed-design-v01.md#dd-outclar-006).

### 30.2 Resolver result versus application outcome

A resolution failure is not itself always the entire invocation outcome.

The Application Engine/use case determines whether it causes:

- pre-execution rejection;
- partial result where independent work is permitted;
- cancellation;
- another domain-specific final outcome.

### 30.3 Warnings

Configuration warnings apply [FR-INV-039](../functional/application-invocation-functional-specification-v01.md#fr-inv-039) under the owning concern/domain acceptance policy.

## 31. Invocation Integration

### 31.1 Explicit invocation values

DD-1.1 candidates follow [FR-CONFIG-012](../functional/configuration-functional-specification-v01.md#fr-config-012) and [FR-CONFIG-013](../functional/configuration-functional-specification-v01.md#fr-config-013).

### 31.2 Provenance of explicit values

Explicit invocation origin is retained by [§18 provenance](#_18-provenance).

### 31.3 Authorization independence

Supplying a configuration value is not equivalent to supplying authorization evidence.

For example, a value such as `force=true` or a target branch name cannot automatically substitute for DD-1.1 explicit authorization if the use case separately requires confirmation/authorization.

## 32. Managed Project Integration

The [resolution context contract in §8](#_8-resolution-context) defines configuration's stage-specific inputs; [DD-1.5 §8](dd-1-5-application-engine-detailed-design-v01.md#_8-orchestration-lifecycle) coordinates the stages. Configuration consumes the project model rather than rediscovering it. Project-side interpretation and conflict reporting follow [DD-1.3 §29](dd-1-3-managed-project-detailed-design-v01.md#_29-relationship-to-configuration-resolution).

A scope-sensitive concern may resolve differently for the root application, one or several layers, one or several repositories, or selected resources. Its snapshot preserves the relevant scope association. Values needed to decide scope follow [DD-CORE-BOOT-009](dd-1-5-application-engine-detailed-design-v01.md#dd-core-boot-009).

Resolution diagnostics should distinguish missing bootstrap values, invalid candidates, inapplicable sources, bootstrap/project evidence conflict, unresolved project identity, premature project-dependent resolution, later configuration/context conflict, unresolved scope-dependent values, required re-resolution and unsafe or unsupported cycles. These are local conditions mapped through [DD-1.2 §9](dd-1-2-execution-outcomes-detailed-design-v01.md#_9-diagnostic-model); safe provenance is retained without exposing sensitive configuration values.

## 33. Provider and Capability Integration

### 33.1 Provider-derived candidates

Provider/capability candidates follow [Design](../appmanager-design-specification-v01.md#_8-1-configuration-model) through the concern descriptor.

### 33.2 Provider configuration consumption

Capabilities consume the §15 result under [FR-CONFIG-020](../functional/configuration-functional-specification-v01.md#fr-config-020).

### 33.3 Provider-local configuration

A capability may own provider-local technical options that have no AppManager-level semantic meaning, but any option that materially affects AppManager use-case semantics, safety, target, or observable behaviour should be represented through governed AppManager configuration or domain policy.

## 34. Resolver Pattern and Future Detailed Designs

DD-1.4 formalizes the Configuration Resolver as a permanent resolver-pattern responsibility.

Later designs may introduce additional resolvers, such as:

- provider resolver;
- strategy resolver;
- template resolver;
- capability resolver.

Those resolvers shall not duplicate configuration precedence where the decision is actually configuration-driven.

The architectural test is:

> **Is the component deciding which configured value applies, or is it selecting an execution mechanism using already-effective configuration and other evidence?**

The former belongs to Configuration Resolution; the latter may belong to a downstream capability or strategy-selection design.

## 35. Security and Trust Boundaries

### 35.1 Untrusted project configuration

Project configuration is project input and may be untrusted.

Parsing and interpretation shall not assume project-controlled data is safe merely because it resides in a recognized managed project.

### 35.2 External values

Environment, provider, host and external values apply [FR-CONFIG-023](../functional/configuration-functional-specification-v01.md#fr-config-023) through candidate validation.

### 35.3 Secret minimisation

Protected values should be exposed only to components that need them for authorized execution.

### 35.4 No policy injection

Configuration values shall not be allowed to redefine the configuration system's own precedence, trust, safety, or managed-scope rules unless an explicitly governed concern has been designed for that purpose.

## 36. Cross-Mode Equivalence

Configuration context and candidate acquisition apply [Design](../appmanager-design-specification-v01.md#_4-6-presentation-independence). The shared [§8 staging rules](#_8-resolution-context) and [§20 re-entry model](#_20-interactive-acquisition) apply to each adapter projection.

## 37. Extensibility

### 37.1 New configuration concern

Adding a concern requires an approved concern descriptor and owning semantics.

### 37.2 New source class

Adding a new source class requires deliberate definition of:

- applicability;
- trust characteristics;
- sensitivity handling;
- provenance;
- conflict behaviour;
- precedence participation for each concern that adopts it.

A source class does not automatically participate in all concerns.

### 37.3 New storage/provider

A new storage backend or provider may implement an existing source contract without changing concern semantics.

### 37.4 Executable plugins

This design does not introduce a general executable configuration-plugin framework.

Any future arbitrary executable extension mechanism would require separate trust, compatibility, lifecycle, and security design.

## 38. Testability

Detailed Design conformance tests should be able to verify at least:

- source presence does not imply applicability;
- candidate acquisition preserves source identity/provenance;
- absent, unset, empty, inaccessible, and concrete values remain distinguishable;
- invalid candidate behaviour follows concern policy;
- project-local/project-shared/tool precedence is honored where adopted;
- no universal source ordering is accidentally imposed;
- explicit invocation override works only where permitted;
- built-in defaults are used only where defined;
- required missing values fail deterministically;
- optional absence remains distinct from default;
- Headless mode never prompts;
- interactive values re-enter governed resolution;
- cancellation is not treated as empty input;
- provenance can be exposed without secret disclosure;
- one-off values are not silently persisted;
- durable changes affect future resolution;
- immutable snapshots do not retroactively change;
- bootstrap configuration can be resolved without unresolved project-dependent applicability;
- project-aware sources do not participate before sufficient Managed Project Context exists;
- managed-project and managed-scope context affect applicable values correctly;
- operation-effective configuration may feed scope finalization without acquiring scope authority;
- configuration cannot broaden managed scope;
- caches do not become a new authority tier;
- equal-authority conflicts fail or disambiguate deterministically;
- provider defaults do not redefine AppManager defaults;
- all interaction modes produce equivalent effective values and equivalent staging decisions for equivalent inputs.

## 39. Design Invariants

The operative local contracts are descriptors/sources (§§6–7), staged context (§8), candidate/applicability/validation/policy (§§9–13), resolution/snapshots (§§14–17), provenance/explanation (§§18–19), sensitivity (§22), conflict/persistence (§§24–25), invalidation (§27) and authorization independence (§31.3). This index adds no duplicate normative summary.

## 40. Traceability to Functional Requirements

The design realizes the Configuration Functional Specification as follows:

| Detailed Design area | Functional requirements |
|---|---|
| authority and shared semantics | `FR-CONFIG-001`–`FR-CONFIG-004` |
| source classes and candidate classification | `FR-CONFIG-005`–`FR-CONFIG-015` |
| precedence and effective values | `FR-CONFIG-016`–`FR-CONFIG-022` |
| candidate validation and value-state semantics | `FR-CONFIG-023`–`FR-CONFIG-027` |
| fallback/defaults | `FR-CONFIG-028`–`FR-CONFIG-031` |
| required/optional configuration | `FR-CONFIG-032`–`FR-CONFIG-034` |
| interactive acquisition | `FR-CONFIG-035`–`FR-CONFIG-038` |
| Headless and automation | `FR-CONFIG-039`–`FR-CONFIG-042` |
| provenance/explanation | `FR-CONFIG-043`–`FR-CONFIG-046` |
| persistence separation and configuration change visibility | `FR-CONFIG-047`–`FR-CONFIG-052` |
| sensitive configuration | `FR-CONFIG-053`–`FR-CONFIG-057` |
| state/report/cache distinction | `FR-CONFIG-058`–`FR-CONFIG-061` |
| configuration concern categories and domain ownership | `FR-CONFIG-062`–`FR-CONFIG-063` |
| managed-project and managed-scope integration | `FR-CONFIG-064`–`FR-CONFIG-067` |
| invocation/cross-mode integration | `FR-CONFIG-068`–`FR-CONFIG-070` |
| failures/conflicts/remediation | `FR-CONFIG-071`–`FR-CONFIG-074` |
| Settings/configuration separation | `FR-CONFIG-075`–`FR-CONFIG-076` |

## 41. Relationship to Other Detailed Designs

### 41.1 DD-1.1 Application Invocation

DD-1.1 transports explicit invocation values, context, interaction capabilities, events, cancellation, and final structured outcomes.

DD-1.4 determines whether invocation-supplied values may participate as configuration candidates and how they resolve.

### 41.2 DD-1.2 Execution Outcomes

DD-1.2 supplies shared diagnostics, warnings, recovery, cancellation, and outcome semantics.

DD-1.4 supplies configuration-resolution evidence projected into those models.

### 41.3 DD-1.3 Managed Project

[DD-1.3](dd-1-3-managed-project-detailed-design-v01.md#_29-relationship-to-configuration-resolution) supplies project context and consumes eligible bootstrap evidence. The direct stage owners are [§8](#_8-resolution-context) and [DD-1.5 §8](dd-1-5-application-engine-detailed-design-v01.md#_8-orchestration-lifecycle).

### 41.4 DD-1.5 Application Engine

[DD-1.5 §8](dd-1-5-application-engine-detailed-design-v01.md#_8-orchestration-lifecycle) coordinates resolution requests, snapshot acceptance, scope/policy checkpoints and bounded re-resolution.

### 41.5 Shared capabilities

Capability consumers use [FR-CONFIG-020](../functional/configuration-functional-specification-v01.md#fr-config-020); provider candidates enter the §7 source contract under [FR-CONFIG-007](../functional/configuration-functional-specification-v01.md#fr-config-007).

### 41.6 Settings domain

[DD-4.2 Settings](../dd_4_policy_and_resource_domains/dd-4-2-settings-domain-detailed-design-v01.md) supplies durable resource-management workflows under [FR-CONFIG-075](../functional/configuration-functional-specification-v01.md#fr-config-075).

## 42. ADR-0001 Compatibility

This design is compatible with Version 1 Node.js/TypeScript implementation selected by ADR-0001, but it deliberately avoids making TypeScript module topology part of the architecture.

The contracts may be implemented in-process in Version 1.

Future runtime changes may preserve these responsibility boundaries without requiring configuration semantics to be redefined.

## 43. Downstream Detailed Design Requirements

The §41 collaboration map identifies consumers. Their effective-value integration follows [FR-CONFIG-017](../functional/configuration-functional-specification-v01.md#fr-config-017) and [FR-CONFIG-020](../functional/configuration-functional-specification-v01.md#fr-config-020), with source participation under §7 and stage eligibility under §8. This applies to domain workflows, capabilities and registry/template concerns without a separate precedence implementation.

## 44. Conformance Criteria

Conformance is assessed against the models indexed in §39, their canonical references and the tests in §38. This section introduces no second acceptance checklist.

## 45. Summary

The resolver flow in §14 connects approved candidate evidence to effective values. The result then serves either bootstrap coordination or an operation snapshot under §8; the consumer uses it through the §41 collaboration map. The source, candidate, snapshot, persistence and authorization models keep those responsibilities understandable and separate.
