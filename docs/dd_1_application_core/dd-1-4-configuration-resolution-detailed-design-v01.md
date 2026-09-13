# DD-1.4 — AppManager Configuration Resolution Detailed Design

> **Detailed Design ID:** DD-1.4
>
> **Design family:** DD-1 — Application Core

> **Status:** Version 1 Detailed Design Specification
>
> **Detailed Design authority:** This document defines the permanent internal design by which AppManager resolves configuration candidates into effective configuration for application operations. It refines, but does not override, the root Design Specification, Functional Specifications, or accepted ADRs.
>
> **Governing sources:** [Project Documentation Guide](../project-documentation-guide-v01.md), [AppManager Design Specification](../appmanager-design-specification-v01.md), [docs/functional/configuration-functional-specification-v01.md](../functional/configuration-functional-specification-v01.md)
>
> **Related Detailed Design authorities:** [DD-1.1 — Application Invocation](dd-1-1-application-invocation-detailed-design-v01.md), [DD-1.2 — Execution Outcomes](dd-1-2-execution-outcomes-detailed-design-v01.md), [DD-1.3 — Managed Project](dd-1-3-managed-project-detailed-design-v01.md), [DD-1.5 — Application Engine](dd-1-5-application-engine-detailed-design-v01.md), [Application Core Bootstrap Resolution Clarification](clarifications/application-core-bootstrap-resolution-clarification-v01.md)
>
> **Planning source:** [Detailed Design Decomposition Plan and Canonical Register](../project_management/detailed-design-decomposition-plan-v01.md)

## 1. Purpose

This specification defines the permanent internal contracts, responsibilities, resolution stages, evidence models, and authority boundaries through which AppManager obtains configuration candidates from approved sources and produces effective configuration for a specific invocation, managed project, managed scope, operation, or capability request.

The central design rule is:

> **Configuration sources provide candidates. Configuration resolution determines effective values. The Application Engine retains authority over how effective configuration influences AppManager behaviour.**

A second governing rule is:

> **Resolution determines which value applies; it does not acquire authority over the use case that consumes that value.**

A third governing rule is:

> **A value becoming available does not make it effective; source applicability, candidate validity, precedence, fallback policy, sensitivity, and operation context must all be resolved under AppManager semantics.**

Where managed-project identity and configuration applicability depend on one another, this design shall be read with [Application Core Bootstrap Resolution Clarification](clarifications/application-core-bootstrap-resolution-clarification-v01.md), which defines the staged bootstrap-versus-project-aware resolution contract without changing DD-1.4 ownership of configuration semantics.

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

This is a semantic dependency view, not a requirement for two resolver implementations, two services, two passes for every operation, or one fixed call sequence. Operations that do not require bootstrap/project staging may resolve directly with the context they require.

Configuration Resolution is a permanent responsibility boundary. It does not imply a separate process, package, executable, service, or transport.

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

The concern owner defines what the value means and what constraints are materially required for its use.

Configuration Resolution owns how valid candidates become effective.

Therefore:

> **Domain meaning and resolution mechanics are distinct responsibilities.**

A domain may define that a value must satisfy a particular semantic constraint, but it shall not invent a private precedence chain for an otherwise shared concern.

## 7. Configuration Source Contract

### 7.1 Source classes

The shared model shall support approved source classes including, where applicable:

- tool-level configuration;
- project-shared configuration;
- project-local configuration;
- explicit invocation values;
- environment-derived values;
- provider-derived values;
- contextual or detected values;
- built-in defaults;
- interactively acquired values.

Not every concern uses every source class.

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

Resolution context is input to configuration resolution. It does not itself become configuration.

A project fact, selected file, repository identity, host selection, detected framework fact, or provider property becomes a candidate only where the concern explicitly permits contextual or detected input.

### 8.3 Bootstrap resolution dependency

Before authoritative managed-project identity exists, only concerns and sources whose applicability and effective value do not depend on that unresolved identity, project topology or managed scope may participate. Those concerns form the bounded bootstrap subset defined by [Application Core Bootstrap Resolution Clarification](clarifications/application-core-bootstrap-resolution-clarification-v01.md).

Bootstrap resolution uses the same concern catalogue, candidate validation, precedence, fallback, sensitivity and provenance semantics as later resolution. It is not a second configuration system.

Bootstrap effective configuration may contribute governed project hints or other permitted evidence to DD-1.3. It does not itself establish project identity, managed scope, targetability, mutation authority or authorization.

### 8.4 Managed Project dependency

Project-scoped source participation requires sufficient DD-1.3 managed-project context.

The configuration resolver shall not infer project association merely from:

- current working directory;
- a nearby configuration file;
- repository containment;
- adapter-provided host selection;
- framework marker presence.

Those may contribute project evidence through DD-1.3, but project association used by project/scope-aware configuration resolution shall consume the resolved managed-project model.

### 8.5 Managed scope dependency

Where a configuration concern genuinely requires an already-resolved managed scope to determine its applicability, DD-1.4 shall consume that scope.

Managed scope is not, however, a universal prerequisite for all project-aware configuration. Where DD-1.3 scope or exclusion semantics themselves depend upon an operation-effective configuration value, that value may be resolved from sufficient managed-project context before final scope acceptance and then supplied to DD-1.3 as governed input.

Configuration shall not silently broaden scope, and Configuration Resolution does not acquire scope authority merely because a scope decision consumes an effective value.

## 9. Candidate Model

### 9.1 Candidate versus effective value

A candidate is a possible value supplied by an approved source.

An effective value is the result of governed resolution.

These are not interchangeable.

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

Empty is not globally equivalent to absent.

A concern may define empty as:

- valid concrete value;
- explicit clearing/unset instruction;
- invalid;
- equivalent to absence.

The candidate model must preserve enough information for the concern's validation/resolution policy to decide correctly.

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

Where historical project-local/project-shared/tool-level tiers remain valid for a concern, the project association and required scope context must be resolved before those candidates participate.

The known precedence:

```text
project-local
    -> project-shared
    -> tool-level
```

shall apply only for concerns whose policy adopts those tiers.

It is not a universal precedence chain for every source class.

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

The resolver shall not globally assume either:

- invalid higher-priority candidate always blocks; or
- invalid higher-priority candidate always falls through.

The concern's resolution policy must define this behaviour.

### 12.4 Safety-sensitive invalid candidates

Where falling back would conceal a material misconfiguration, security problem, scope mismatch, or explicit caller error, policy should prefer explicit failure unless the Functional Specification permits safe fallback.

### 12.5 Invocation candidate validation

Explicit invocation candidates are not trusted merely because the caller supplied them directly.

They remain subject to:

- override permission;
- validation;
- safety constraints;
- managed-project applicability;
- managed-scope constraints where the concern requires them;
- sensitivity rules.

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

There shall be no assumed global precedence such as:

```text
invocation -> environment -> project -> tool -> default
```

unless a concern explicitly adopts it.

Different concerns may legitimately position source classes differently.

### 13.4 Explicit caller values

An explicit invocation value may receive high precedence only where the concern permits invocation-level override.

An invocation cannot override:

- non-overridable application safety policy;
- immutable architectural constraints;
- managed-scope boundaries;
- concern-specific restrictions that explicitly reject invocation override.

### 13.5 Built-in defaults

A built-in default participates only where deliberately defined as safe and valid.

The resolver shall not manufacture a default to avoid failure.

### 13.6 Interactive completion

Interactive acquisition is a candidate-acquisition mechanism, not a precedence mechanism by itself.

The policy defines when an interactively acquired candidate may participate and where it ranks.

## 14. Configuration Resolver

### 14.1 Resolver responsibility

The Configuration Resolver applies concern metadata, source applicability, candidate validation, resolution policy, and current context to produce a deterministic resolution result.

This is the principal resolver-pattern responsibility for DD-1.4.

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

The resolver may decide which value is effective.

It shall not:

- execute the consuming use case;
- expand managed scope;
- decide unrelated domain policy;
- authorize consequential effects;
- treat a configuration value as proof that an operation is safe;
- directly persist a transient candidate merely because it resolved successfully.

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

Optional absence is not automatically a failure and is not automatically a default.

The consuming use case determines what optional absence means after governed resolution has established that no effective value exists.

## 16. Effective Configuration Snapshot

### 16.1 Purpose

An operation that requires multiple configuration concerns should consume a coherent effective-configuration snapshot rather than repeatedly rereading raw sources throughout execution.

A bootstrap effective value or bootstrap snapshot is a bounded stage result used only for concerns resolvable without managed-project context. It is not automatically the operation-facing snapshot.

### 16.2 Snapshot properties

An operation-effective configuration snapshot should be:

- immutable from the consuming operation's perspective;
- associated with the invocation/use case;
- associated with the relevant managed project once project context is required;
- associated with the relevant managed scope where that scope is already established and required by the constituent concerns;
- capable of preceding final managed-scope acceptance where DD-1.3 scope/exclusion semantics consume configuration values that can be resolved from sufficient managed-project context;
- composed only of governed effective values and explicit optional absences;
- capable of exposing safe provenance;
- stable for the phase of execution that depends on it.

### 16.3 No retroactive mutation

A durable settings change occurring after a snapshot is established shall not silently mutate that snapshot.

Future operations may observe the change.

The current operation observes it only if its owning workflow explicitly supports dynamic re-resolution.

### 16.4 Selective snapshot construction

An operation should resolve only configuration concerns it actually requires.

The model does not require loading the entire AppManager configuration universe for every command.

## 17. Configuration Sets and Multi-Concern Resolution

### 17.1 Batch resolution

Where a use case requires several concerns, resolution may occur as a coordinated batch.

The batch shall preserve individual concern provenance and failure reasons.

### 17.2 Required-set semantics

If any required concern fails resolution, effects depending on that concern shall not begin.

A workflow may proceed with independent work only where the use-case design explicitly defines that behaviour and DD-1.2 partial-result semantics represent it correctly.

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

Provenance may identify a protected source without returning the secret itself.

For example, it may safely state:

```text
source class: protected environment-derived credential
status: present and valid
```

without exposing the credential.

### 18.3 Consumer access

Consumers needing provenance shall consume the resolver's provenance model rather than rereading sources and reconstructing precedence independently.

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

The resolver exposes structured explanation data.

TUI, Headless, GUI, IDE, CI, or automation adapters decide how to render it.

### 19.3 Explanation minimisation

Sensitive candidate content shall be redacted or omitted.

The explanation model should prefer semantic reason codes and safe summaries over raw source dumps.

## 20. Interactive Acquisition

### 20.1 Hand-off boundary

When policy permits interactive acquisition and non-interactive resolution cannot satisfy the concern, the resolver may return an interaction-required state.

The invocation/application layer may then request an adapter to acquire a candidate.

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

Interactive cancellation is not an empty candidate.

It shall be represented through DD-1.1/DD-1.2 cancellation or failure semantics as appropriate to the workflow.

### 20.4 Persistence

An interactively acquired value remains one-off unless the owning use case separately authorizes persistence.

## 21. Headless Resolution

### 21.1 Deterministic non-interactive behaviour

Headless resolution shall:

- use applicable non-interactive sources;
- apply the same validation and precedence semantics as interactive modes;
- use defined fallback/defaults where permitted;
- fail clearly when required configuration remains unresolved;
- never block waiting for a prompt.

### 21.2 Interaction-required state in Headless mode

If a concern can only be satisfied through an interactive candidate under current inputs, Headless execution shall return a deterministic structured failure indicating the unresolved concern and permitted remediation where safe.

### 21.3 No automation weakening

Headless or CI execution does not weaken:

- validation;
- sensitivity rules;
- precedence;
- scope constraints;
- non-overridable policy;
- requiredness.

## 22. Sensitive Configuration

### 22.1 Classification

Configuration shall support sensitivity classes sufficient to distinguish ordinary shareable values from protected values such as:

- secrets;
- credentials;
- access tokens;
- private keys;
- sensitive provider configuration.

### 22.2 Protected-value representation

The shared model should permit protected values to be represented by bounded access/reference abstractions rather than requiring unrestricted plaintext propagation through every consumer.

Exact secure-value technology belongs to Implementation Specification.

### 22.3 Least disclosure

Sensitive values shall not be included unnecessarily in:

- diagnostics;
- warnings;
- events;
- logs;
- reports;
- result payloads;
- provenance explanations;
- adapter rendering.

### 22.4 Sensitivity propagation

When a value is transformed, combined, or projected, sensitivity classification shall be preserved or strengthened as necessary.

It shall not be accidentally downgraded merely because a provider, adapter, or cache uses a generic representation.

### 22.5 Protected-source non-authority

A secure store or provider may protect value material, but it does not decide AppManager applicability, precedence, or policy.

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

When fallback occurs, provenance/explanation should preserve that fact where useful.

### 23.3 No silent masking

Fallback shall not silently mask an explicit higher-priority misconfiguration where policy defines that error as blocking.

## 24. Conflict Handling

### 24.1 Equal-authority conflicts

Where two materially conflicting candidates remain at an equivalent policy position and no deterministic tie-break exists, the resolver shall return conflict rather than choose arbitrarily.

### 24.2 Conflict diagnostics

Conflict diagnostics should identify:

- concern identity;
- conflicting source classes/identities where safe;
- relevant scopes;
- why precedence did not resolve the conflict;
- permitted remediation.

### 24.3 Interactive disambiguation

Interactive selection may be used only where the concern's policy permits it.

The selected choice shall re-enter resolution as governed candidate evidence or explicit disambiguation input rather than bypassing policy.

## 25. Persistence Boundary

### 25.1 Resolution is read/selection semantics

Configuration Resolution does not own durable CRUD.

Persisting, updating, or deleting configuration belongs to Settings-domain or another explicitly owning use case.

### 25.2 One-off candidate rule

A supplied invocation or interactive candidate shall not be persisted merely because it resolved successfully.

### 25.3 Explicit promotion

Detected/provider/environment/state-derived information becomes durable configuration only through an explicit approved persistence operation or defined persistence policy.

### 25.4 Settings integration

Settings-domain operations may write or remove values, but shall not redefine:

- precedence;
- source applicability;
- fallback;
- requiredness;
- effective-value semantics.

Those remain configuration-resolution concerns plus the owning concern policy.

## 26. Configuration Versus Operational State

### 26.1 Authority separation

The model shall distinguish durable configuration from:

- operational state;
- logs;
- diagnostics;
- reports;
- generated artefacts;
- caches;
- provider observations;
- temporary execution metadata.

### 26.2 No accidental promotion

A value found in operational state shall not automatically become a configuration candidate unless the concern explicitly permits that source class.

### 26.3 Cache non-authority

A cache may accelerate acquisition or resolution but does not become a new precedence tier.

Cached data must retain the authority/provenance semantics of the source/result it represents.

## 27. Invalidation and Refresh

### 27.1 Future-operation visibility

After a successful durable configuration change, future resolution shall be capable of observing that change according to its scope and precedence.

### 27.2 Invalidation responsibility

The architecture requires an invalidation boundary, but does not mandate a particular cache implementation.

The implementation must ensure stale cached data does not silently override newer authoritative configuration.

### 27.3 Snapshot stability

Invalidation affects future resolutions, not already-accepted immutable snapshots, unless a workflow explicitly supports dynamic re-resolution.

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

Configuration diagnostics shall integrate with DD-1.2 and should support categories including:

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

Diagnostics shall not include sensitive values merely to make failures easier to debug.

## 30. Outcome Integration

### 30.1 DD-1.2 relationship

Configuration resolution produces normalized resolution evidence that is projected into DD-1.2 diagnostics/outcomes by the owning invocation/use case.

### 30.2 Resolver result versus application outcome

A resolution failure is not itself always the entire invocation outcome.

The Application Engine/use case determines whether it causes:

- pre-execution rejection;
- partial result where independent work is permitted;
- cancellation;
- another domain-specific final outcome.

### 30.3 Warnings

A configuration warning may remain non-fatal unless concern/domain policy promotes it to failure.

## 31. Invocation Integration

### 31.1 Explicit invocation values

DD-1.1 explicit options/inputs may contribute configuration candidates only for concerns that permit them.

### 31.2 Provenance of explicit values

The resolver shall preserve that the value came explicitly from the invocation rather than pretending it originated in durable settings.

### 31.3 Authorization independence

Supplying a configuration value is not equivalent to supplying authorization evidence.

For example, a value such as `force=true` or a target branch name cannot automatically substitute for DD-1.1 explicit authorization if the use case separately requires confirmation/authorization.

## 32. Managed Project Integration

DD-1.3 and DD-1.4 collaborate through the staged contract in [Application Core Bootstrap Resolution Clarification](clarifications/application-core-bootstrap-resolution-clarification-v01.md); neither is globally upstream of the other for every stage.

### 32.1 Bootstrap contribution to DD-1.3

Before authoritative managed-project identity exists, DD-1.4 may supply only governed bootstrap effective configuration whose own applicability does not depend on that unresolved identity. DD-1.3 may consume those values as project-resolution evidence but retains authority over project identity and context.

### 32.2 Project-aware DD-1.3 dependency

After sufficient Managed Project Context exists, Configuration Resolution consumes DD-1.3 project identity, project topology and managed entities to determine project-aware source applicability and effective values.

It does not independently rediscover or replace those project semantics.

### 32.3 Scope-sensitive concerns

A concern may resolve differently for:

- root application;
- one managed layer;
- multiple managed layers;
- one repository;
- multiple repositories;
- selected files/resources.

Where the concern requires an already-resolved managed scope, the effective snapshot shall preserve that scope association. Where DD-1.3 scope/exclusion semantics instead require an operation-effective value that can be resolved from sufficient project context, DD-1.4 may supply that value before final scope acceptance.

### 32.4 Configuration cannot expand scope

Even an effective value cannot authorize targets outside the DD-1.3 scope that is ultimately resolved and accepted for the operation. Configuration Resolution supplies governed values; DD-1.3/Application Engine retain scope and targetability authority.

### 32.5 Conflict and re-resolution

Project-aware configuration that materially conflicts with the project identity or bootstrap assumptions shall produce structured evidence for DD-1.5 to handle through explicit revalidation, bounded re-resolution, disambiguation or failure. DD-1.3/DD-1.4 shall not enter an uncontrolled recursive resolution loop.

## 33. Provider and Capability Integration

### 33.1 Provider-derived candidates

A provider/capability may supply candidates where the concern explicitly permits it.

The provider's native default does not automatically become AppManager's default.

### 33.2 Provider configuration consumption

Capabilities should receive effective AppManager configuration, not independently read competing settings sources for shared concerns.

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

Environment, provider, host-tool, and externally supplied values are candidate evidence and shall be validated before use.

### 35.3 Secret minimisation

Protected values should be exposed only to components that need them for authorized execution.

### 35.4 No policy injection

Configuration values shall not be allowed to redefine the configuration system's own precedence, trust, safety, or managed-scope rules unless an explicitly governed concern has been designed for that purpose.

## 36. Cross-Mode Equivalence

TUI, Headless, GUI, IDE/host-tool, CI, automation agents, and future adapters shall use the same:

- concern identities;
- source applicability semantics;
- candidate validation;
- precedence;
- fallback;
- sensitivity;
- effective-value semantics;
- bootstrap-versus-project-aware staging semantics where staging is required.

Interaction modes may differ only in how they acquire optional interactive candidates and render explanation/diagnostics.

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

The following invariants are normative for downstream design:

1. configuration sources provide candidates, not authority;
2. candidate presence does not imply applicability;
3. applicability is evaluated before precedence;
4. candidate and effective value are distinct models;
5. absent, explicit unset, and empty remain distinguishable where semantically relevant;
6. precedence is concern-specific, not universally inferred;
7. invocation overrides apply only where permitted;
8. invalid-candidate fallback is policy-defined;
9. built-in defaults must be deliberately defined and safe;
10. interactive acquisition supplies candidates, not effective values directly;
11. Headless mode never requires a prompt;
12. provenance does not require sensitive-value disclosure;
13. resolution does not imply persistence;
14. operational state and caches do not silently become configuration authority;
15. effective snapshots are stable for the operation phase that consumes them;
16. bootstrap resolution is restricted to concerns and sources whose applicability does not depend on unresolved managed-project identity;
17. project/scope-aware concerns become eligible only when their required DD-1.3 context exists;
18. configuration cannot expand managed scope;
19. resolving a value before scope finalization does not transfer scope authority to DD-1.4;
20. the resolver does not own consuming use-case semantics;
21. Settings persistence does not redefine precedence;
22. provider defaults do not automatically become AppManager defaults;
23. equivalent contexts yield materially equivalent effective resolution.

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

DD-1.3 owns project identity, topology, managed entities, managed scope and targetability.

DD-1.4 may first provide bootstrap effective configuration as bounded project-resolution evidence, then consumes sufficient DD-1.3 context to determine project/scope-aware source applicability and effective values. The staged collaboration is governed by [Application Core Bootstrap Resolution Clarification](clarifications/application-core-bootstrap-resolution-clarification-v01.md); neither side acquires the other's authority.

### 41.4 DD-1.5 Application Engine

DD-1.5 defines when the Application Engine requests bootstrap or project/scope-aware configuration resolution, how snapshots enter use-case execution context, how managed-scope/policy decisions consume effective values, and when bounded re-resolution is permitted.

The Application Engine remains authoritative over application sequencing and semantics; DD-1.4 remains authoritative over configuration resolution semantics.

### 41.5 Shared capabilities

DD-2 capability designs shall consume effective configuration and may contribute provider/context candidates only where approved.

They shall not invent competing configuration resolution semantics.

### 41.6 Settings domain

The Settings domain shall own configuration-management workflows and persistence operations.

It shall use DD-1.4 concern, scope, provenance, and resolution semantics rather than redefining them.

## 42. ADR-0001 Compatibility

This design is compatible with Version 1 Node.js/TypeScript implementation selected by ADR-0001, but it deliberately avoids making TypeScript module topology part of the architecture.

The contracts may be implemented in-process in Version 1.

Future runtime changes may preserve these responsibility boundaries without requiring configuration semantics to be redefined.

## 43. Downstream Detailed Design Requirements

Later Detailed Designs shall preserve the following constraints:

- DD-1.5 Application Engine must consume effective configuration rather than raw source values and must preserve staged bootstrap/project-aware resolution where required;
- Resource Access may read/write configuration resources but must not decide precedence;
- Process Execution must receive already-authorized effective execution options rather than reading AppManager settings ad hoc;
- Repository Capability may contribute repository/provider observations but not configuration authority;
- Source Intelligence may contribute detected/contextual candidates only where a concern permits detection;
- Source Transformation strategies may consume effective configuration but must not bypass resolution;
- AI Capability must separate provider-native defaults from AppManager effective configuration;
- Documentation, Quality, and Nuxt capabilities must not create private precedence chains;
- resource registries/templates may define configuration concerns but shall resolve them through this shared model;
- domain orchestrators must request concern-specific effective values through this boundary;
- Utils must not become an informal fallback location for ad hoc configuration lookup.

## 44. Conformance Criteria

A downstream design conforms to DD-1.4 only if all of the following are true:

1. raw configuration sources are not consumed directly where a governed concern exists;
2. candidates remain distinguishable from effective values;
3. source applicability is explicit;
4. concern-specific precedence/fallback is deterministic;
5. project-local/project-shared/tool precedence is used only where the concern adopts it;
6. invocation overrides are permissioned rather than assumed;
7. Headless behavior is deterministic and non-interactive;
8. interactive acquisition re-enters the same resolver;
9. sensitive values are minimized and provenance remains safe;
10. one-off values are not silently persisted;
11. bootstrap values are not mistaken for the complete operation-effective snapshot;
12. configuration used before project resolution does not require unresolved project identity for its own applicability;
13. project/scope-aware sources participate only after sufficient DD-1.3 context exists;
14. effective snapshots are coherent and stable for the phase that consumes them;
15. changed durable configuration affects future resolution without retroactively mutating accepted snapshots;
16. project/scope configuration consumes DD-1.3 rather than reconstructing project identity;
17. configuration cannot expand managed scope or bypass authorization;
18. resolving configuration before final scope acceptance where required does not transfer scope authority to DD-1.4;
19. Settings CRUD remains distinct from resolution semantics;
20. capability providers do not redefine AppManager configuration semantics;
21. configuration diagnostics integrate with DD-1.2;
22. all supported interaction modes preserve equivalent semantics.

## 45. Summary

AppManager configuration resolution is a governed application-core responsibility that converts source-specific candidate evidence into stable, explainable, safe effective configuration.

The permanent semantic flow is:

```text
approved sources
    -> applicable sources for the current resolution stage
    -> candidates + provenance
    -> validation
    -> concern-specific precedence / selection / fallback
    -> effective values
    -> bootstrap result or immutable operation snapshot as applicable
    -> Application Engine / DD-1.3 / use-case semantics
```

The key boundaries are:

> **source != candidate authority**

> **candidate != effective value**

> **bootstrap effective value != complete operation snapshot**

> **effective value != application policy**

> **resolution != persistence**

> **configuration != managed scope**

> **configuration != authorization**

These distinctions allow later domain and capability designs to share deterministic configuration semantics without collapsing Settings, project discovery, managed-scope authority, provider mechanics, or application authority into one configuration service.