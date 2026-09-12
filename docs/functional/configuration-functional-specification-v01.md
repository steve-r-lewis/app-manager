# AppManager Configuration Functional Specification

> **Status:** Version 1 Functional Specification
>
> **Functional authority:** This document defines the required observable behaviour by which AppManager obtains, validates, resolves, explains, protects, and applies configuration. It refines, but does not override, the root Design Specification.
>
> **Governing sources:** `docs/project-documentation-guide-v01.md`, `docs/appmanager-design-specification-v01.md`
>
> **Related Functional authorities:** `docs/functional/application-invocation-functional-specification-v01.md`, `docs/functional/managed-project-functional-specification-v01.md`
>
> **Planning source:** `docs/project_management/functional-specification-decomposition-plan-v01.md`

## 1. Purpose

This specification defines the common functional behaviour through which AppManager converts configuration candidates from approved sources into effective configuration for a particular invocation, managed project, managed scope, or application operation.

It establishes the distinction between a configuration source, a candidate value, an effective value, and the application policy that consumes that value.

The central rule is:

> Configuration sources provide candidates. Configuration resolution determines effective values. The Application Engine retains authority over how effective configuration influences AppManager behaviour.

Configuration must therefore be deterministic, explainable where practical, independent of presentation, safe for Headless operation, and appropriately protective of sensitive information.

## 2. Scope

This specification owns observable behaviour for:

- recognised configuration-source classes;
- applicability of configuration sources to a target project, scope, invocation, or operation;
- collection and interpretation of candidate configuration values;
- project-specific and project-local/project-shared configuration where supported;
- explicit invocation-supplied configuration overrides where permitted;
- environment-derived and provider-derived configuration where supported;
- application/tool defaults and built-in defaults;
- deterministic precedence and fallback semantics;
- candidate validation and rejection;
- production of effective configuration;
- required versus optional configuration;
- configuration provenance and explanation;
- interactive completion where permitted;
- deterministic Headless resolution;
- distinction between one-off supplied values and persisted configuration;
- configuration changes and when they affect subsequent resolution;
- sensitive-configuration handling at the Functional level;
- separation of durable configuration from operational state, logs, reports, caches, and derived artefacts;
- structured configuration-related failures and diagnostics;
- interaction-mode equivalence of configuration semantics.

This specification defines configuration resolution semantics. It does not define every user-facing Settings-domain command used to create, inspect, update, or delete persisted settings; those behaviours belong to the Settings Functional Specification.

## 3. Out of Scope

The following are deliberately below the Functional level unless a later accepted architectural decision elevates them:

- concrete configuration file names other than an explicitly adopted architectural convention;
- configuration serialization formats;
- TypeScript interfaces, classes, enums, or method signatures;
- concrete resolver or configuration-service classes;
- physical directory trees and storage paths;
- file-reading and file-writing mechanisms;
- exact secret-store technology, encryption mechanism, or operating-system credential API;
- environment-variable naming conventions;
- concrete cache implementations;
- persistence APIs;
- concrete error classes;
- internal dependency injection or module topology;
- exact provider SDK representations;
- source-code paths and runtime wiring.

These concerns belong to Detailed Design or Implementation Specifications.

## 4. Functional Model

Configuration resolution is conceptually:

```text
operation / invocation
        |
        v
managed project and managed scope where relevant
        |
        v
applicable configuration sources
        |
        v
candidate values
        |
        v
applicability + validation + precedence + fallback
        |
        v
effective configuration
        |
        v
Application Engine policy / command semantics / capability coordination
```

This is a behavioural model, not an implementation pipeline or required component topology.

### 4.1 Configuration authority

**FR-CONFIG-001 — Application-level configuration semantics**  
AppManager shall apply one coherent set of configuration semantics across commands, interaction modes, host integrations, and capability providers.

**FR-CONFIG-002 — Candidate-source non-authority**  
A configuration source shall supply candidate information only. Its participation in resolution shall not independently grant it authority over precedence, applicability, validity, command semantics, workflow policy, safety, or final application outcomes.

**FR-CONFIG-003 — Application Engine authority**  
The Application Engine shall retain authority over how effective configuration influences command semantics, policy, workflow coordination, safety constraints, managed scope, and application-level outcomes.

**FR-CONFIG-004 — Resolution is not execution authority**  
A resolver or equivalent resolution mechanism may determine an effective value but shall not thereby acquire authority to perform an unrelated application operation or redefine the use case consuming that value.

## 5. Configuration Sources and Candidates

### 5.1 Recognised source classes

**FR-CONFIG-005 — Source classes**  
AppManager shall be capable of obtaining configuration candidates, where applicable, from recognised source classes including:

- tool-level configuration and reusable defaults;
- target-project configuration and overrides;
- explicitly supplied invocation values and options;
- environment-derived values;
- provider-derived or externally supplied values required by an AppManager capability;
- contextual or detected values where a Functional Specification explicitly permits them;
- built-in defaults where AppManager defines a safe default;
- interactive user-supplied values where interaction is permitted.

Not every setting or operation is required to use every source class.

**FR-CONFIG-006 — Candidate classification**  
AppManager shall distinguish the source class of a candidate sufficiently to apply the correct applicability, precedence, validation, sensitivity, and provenance rules.

**FR-CONFIG-007 — Source applicability**  
A source shall participate in resolution only when it is applicable to the configuration item, target project, managed scope, invocation, operation, and execution context concerned.

**FR-CONFIG-008 — No source-by-presence authority**  
The mere presence of a value in a file, environment, host context, provider response, registry, project resource, or invocation shall not make that value effective unless the source and candidate are valid and applicable under AppManager configuration semantics.

### 5.2 Project configuration

**FR-CONFIG-009 — Project-specific override capability**  
AppManager shall support target-project configuration capable of overriding reusable tool-level configuration where the configuration item's defined semantics permit project-specific override.

**FR-CONFIG-010 — Project-shared and project-local distinction**  
Where a configuration concern supports both project-shared and project-local values, AppManager shall distinguish those scopes and resolve them according to defined precedence and portability semantics rather than treating them as interchangeable storage locations.

**FR-CONFIG-011 — Project association**  
Project-scoped configuration shall be associated with the resolved managed project rather than selected solely from an incidental current working directory or adapter-specific representation.

### 5.3 Explicit invocation values

**FR-CONFIG-012 — Explicit invocation candidates**  
Where a use case permits an invocation-supplied configuration value or override, AppManager shall treat the supplied value as an explicit candidate subject to the same applicable validation and safety requirements as equivalent values obtained elsewhere.

**FR-CONFIG-013 — Override permission**  
An explicit invocation value shall override another configuration source only where the relevant configuration semantics permit invocation-level override. Callers shall not be able to bypass non-overridable application policy merely by supplying a value explicitly.

### 5.4 Environment and provider candidates

**FR-CONFIG-014 — Environment-derived candidates**  
Environment-derived values shall participate only for configuration items whose semantics explicitly permit environment input and shall not silently override unrelated or higher-authority configuration.

**FR-CONFIG-015 — Provider-derived candidates**  
Provider-derived or externally supplied values may participate where an AppManager capability legitimately depends on them, but provider representations and defaults shall not independently redefine AppManager configuration semantics.

## 6. Precedence and Effective Configuration

### 6.1 Defined precedence

**FR-CONFIG-016 — Explicit precedence**  
For each configuration concern that may have more than one applicable candidate, AppManager shall define deterministic precedence or selection semantics sufficient to identify the effective value or a defined resolution failure.

**FR-CONFIG-017 — Centralised semantics**  
Equivalent configuration concerns shall use the same precedence semantics wherever they are consumed. Commands, adapters, and capability providers shall not independently invent competing precedence chains for the same AppManager configuration item.

**FR-CONFIG-018 — Project override ordering**  
Where the historical project-local, project-shared, and tool-level settings tiers remain applicable to a configuration item, their precedence shall be:

```text
project-local
    -> project-shared
    -> tool-level
```

Higher-priority valid applicable values shall take precedence over lower-priority values. Additional source classes such as explicit invocation values, detected context, environment values, provider values, built-in defaults, or interactive completion shall be positioned by the owning configuration semantics rather than assumed to occupy one universal position for every setting.

**FR-CONFIG-019 — No universal precedence by convenience**  
AppManager shall not create one implicit universal precedence order for source classes whose correct ordering depends on the configuration concern or use case.

### 6.2 Effective values

**FR-CONFIG-020 — Effective configuration**  
Configuration consumed by an AppManager operation shall be the effective configuration produced by governed resolution, not an arbitrary raw source value selected independently by a command, adapter, or provider.

**FR-CONFIG-021 — Scope-specific effectiveness**  
An effective value may differ by target project, managed scope, invocation, operation, or other defined context. AppManager shall not treat a value resolved for one scope as universally effective when its semantics are scope-dependent.

**FR-CONFIG-022 — Stable resolution inputs**  
Given equivalent applicable candidate sources, candidate values, managed context, invocation inputs, environmental observations, and configuration policy, resolution shall produce the same effective result.

## 7. Candidate Validation

**FR-CONFIG-023 — Candidate validation**  
Before a candidate becomes effective, AppManager shall validate the constraints that are functionally significant for that configuration item, including as applicable whether the candidate is malformed, unsupported, unavailable, inaccessible, unsafe, incompatible with the operation, or incompatible with the execution mode.

**FR-CONFIG-024 — Invalid higher-priority candidate behaviour**  
The owning configuration semantics shall define whether an invalid higher-priority candidate causes resolution failure or permits fallback to another source. AppManager shall not silently choose whichever behaviour is most convenient at the call site.

**FR-CONFIG-025 — Invalid candidate diagnostics**  
Where an invalid candidate prevents successful resolution, AppManager shall provide an application-level diagnostic identifying the configuration concern and the nature of the failure without unnecessarily exposing sensitive value content.

**FR-CONFIG-026 — Explicitly unset and absent values**  
Where the distinction is functionally relevant, AppManager shall distinguish a source that supplies no candidate from a source that explicitly represents an unset or intentionally absent value. Exact null/undefined representations belong to Detailed Design.

**FR-CONFIG-027 — Empty values**  
An empty value shall be accepted, rejected, or treated as absence according to the configuration item's defined semantics rather than by a global assumption that all empty representations mean the same thing.

## 8. Fallbacks and Defaults

**FR-CONFIG-028 — Defined fallback**  
Fallback to a lower-priority or alternate source shall occur only where the configuration item's defined semantics permit fallback.

**FR-CONFIG-029 — Safe built-in defaults**  
A built-in default shall be used only where AppManager has deliberately defined a value that is valid and sufficiently safe for the relevant configuration concern.

**FR-CONFIG-030 — No invented default**  
AppManager shall not invent a configuration value merely to avoid a missing-value failure or interactive request when no safe, defined default exists.

**FR-CONFIG-031 — Default provenance**  
Where provenance is exposed, a built-in default shall remain distinguishable from a persisted, explicit, detected, environment-derived, provider-derived, or interactively supplied value.

## 9. Required and Optional Configuration

**FR-CONFIG-032 — Required configuration**  
Where an operation requires a configuration value, AppManager shall either resolve a valid effective value through permitted sources or reject the operation clearly before effects that depend on that value occur.

**FR-CONFIG-033 — Optional configuration**  
Where a configuration value is optional, absence shall be represented according to the owning use case rather than automatically converted into an arbitrary default or failure.

**FR-CONFIG-034 — Missing required value**  
Failure to resolve required configuration shall produce a structured application-level failure compatible with the Application Invocation Functional Specification and shall identify the unresolved configuration concern sufficiently for remediation.

## 10. Interactive Completion

**FR-CONFIG-035 — Resolution independent of UI**  
Configuration resolution shall remain usable without an interactive user interface.

**FR-CONFIG-036 — Interactive candidate acquisition**  
Where interaction is permitted and the configuration item's semantics allow it, an interaction adapter may request a value from the user after non-interactive resolution cannot produce a required value or when the use case explicitly requests user selection.

**FR-CONFIG-037 — Interaction does not own resolution**  
A value obtained through a prompt, GUI control, IDE interaction, or other adapter shall re-enter the governed configuration flow as a candidate. The adapter shall not decide precedence, validity, persistence, or application policy merely because it acquired the value.

**FR-CONFIG-038 — Interactive cancellation**  
Cancellation of interactive configuration acquisition shall not be converted into an empty value, persisted as configuration, or silently replaced by an unsafe default. It shall be handled through the applicable cancellation or failure semantics.

## 11. Headless and Automation Behaviour

**FR-CONFIG-039 — Deterministic Headless resolution**  
Headless configuration resolution shall use available non-interactive sources, a defined non-interactive fallback or default where permitted, or fail clearly.

**FR-CONFIG-040 — No implicit prompting**  
Headless operation shall not block awaiting interactive configuration input.

**FR-CONFIG-041 — No automation-specific weakening**  
Automation shall not weaken validation, precedence, sensitivity, safety, or non-overridable policy merely because no interactive user is present.

**FR-CONFIG-042 — Reproducible automation**  
Where the relevant configuration sources and environmental observations are stable, repeated Headless resolution shall be reproducible and shall not depend on presentation state or prior interactive choices that were not persisted as authoritative configuration.

## 12. Provenance and Explainability

**FR-CONFIG-043 — Effective-value provenance**  
Where useful for user understanding, automation, diagnostics, or auditing, AppManager shall be able to identify the source class or configuration scope from which an effective value originated.

**FR-CONFIG-044 — Explainable selection**  
Where practical and safe, AppManager shall be able to explain why a candidate became effective or why resolution failed, including relevant precedence, applicability, validation, or missing-source information.

**FR-CONFIG-045 — Provenance without reconstruction**  
Consumers that need configuration provenance shall not be required to independently reconstruct precedence by rereading all candidate sources.

**FR-CONFIG-046 — Sensitive provenance**  
Configuration provenance may identify a sensitive value's source or status without disclosing the sensitive value itself.

## 13. Persistence and Configuration Changes

### 13.1 Resolution versus persistence

**FR-CONFIG-047 — Resolution/persistence separation**  
Resolving or supplying a configuration value shall not, by itself, mean that the value must be persisted for future operations.

**FR-CONFIG-048 — Explicit persistence semantics**  
Where a use case permits a supplied or interactively acquired value to be persisted, persistence shall be an explicit operation or explicit policy of that use case rather than an incidental side effect of resolution.

**FR-CONFIG-049 — One-off values**  
AppManager shall permit one-off invocation values where the owning use case allows them without requiring those values to modify durable project or tool configuration.

### 13.2 Effect of changes

**FR-CONFIG-050 — Changed configuration affects future resolution**  
A successful durable configuration change shall be eligible to influence subsequent effective-configuration resolution according to its scope and precedence.

**FR-CONFIG-051 — No retroactive semantic mutation**  
A configuration change shall not silently rewrite the already-established meaning of an invocation that has passed the point at which its effective configuration is defined, unless the owning workflow explicitly supports dynamic re-resolution.

**FR-CONFIG-052 — Scope of persisted changes**  
A persisted configuration change shall affect only the configuration scope selected by the owning Settings or domain use case and shall not silently modify another scope merely to make resolution succeed.

## 14. Sensitive Configuration

**FR-CONFIG-053 — Sensitive classification**  
AppManager shall distinguish sensitive configuration, including secrets, credentials, tokens, private keys, and other protected values, from ordinary shareable configuration.

**FR-CONFIG-054 — Sensitive-source suitability**  
Sensitive configuration shall not be required to reside in ordinary source-controlled project configuration when doing so would expose protected information.

**FR-CONFIG-055 — Sensitive-value minimisation**  
AppManager shall avoid exposing sensitive configuration unnecessarily through logs, diagnostics, reports, structured results, command output, progress information, or presentation surfaces.

**FR-CONFIG-056 — Secret absence versus disclosure**  
AppManager may report that required sensitive configuration is missing, invalid, inaccessible, or unavailable without reproducing the protected value in the diagnostic.

**FR-CONFIG-057 — Provider secrecy does not transfer authority**  
Use of a secure store, host credential facility, environment source, or external provider for sensitive values shall not transfer AppManager configuration-policy authority to that mechanism.

## 15. Configuration, State, Reports, Logs, and Derived Information

**FR-CONFIG-058 — Durable configuration distinction**  
AppManager shall distinguish durable configuration intended to influence future behaviour from operational state, generated reports, derived artefacts, caches, logs, and diagnostics.

**FR-CONFIG-059 — No accidental configuration authority**  
Operational state, reports, generated artefacts, caches, logs, diagnostics, or machine-local observations shall not become authoritative configuration merely because they are stored within the AppManager management area, reused by a later operation, or contain a value that resembles configuration.

**FR-CONFIG-060 — Explicit promotion only**  
If information derived from state, detection, a provider, or another non-authoritative source is to become durable configuration, that transition shall occur only through an explicit configuration-management behaviour or defined persistence policy.

**FR-CONFIG-061 — Lifecycle distinctions**  
Configuration categories with different sensitivity, portability, sharing, source-control, or retention expectations shall remain distinguishable at the Functional level even if lower-level designs store them near one another.

## 16. Configuration Categories

**FR-CONFIG-062 — Supported concern categories**  
The configuration model shall be capable of representing configuration concerns required by AppManager domains, including as applicable:

- application metadata and defaults;
- author and contributor defaults;
- funding and issue-reporting metadata;
- repository configuration and metadata;
- AI-provider configuration;
- template selection and template-related configuration;
- licensing preferences and defaults;
- keywords;
- command defaults;
- environment-related values;
- other domain-specific configuration introduced through approved Functional Specifications.

This requirement establishes configuration-model capability, not the complete Settings command catalogue.

**FR-CONFIG-063 — Domain ownership of meaning**  
The domain or cross-cutting Functional Specification that owns a configuration concern shall define the functional meaning and constraints of that concern. This specification owns the shared resolution behaviour by which such values become effective.

## 17. Configuration and Managed Project Context

**FR-CONFIG-064 — Project context before project configuration**  
Where configuration selection depends on the target project, AppManager shall resolve sufficient managed-project context before treating project-scoped configuration as applicable.

**FR-CONFIG-065 — Managed-scope-aware configuration**  
Where configuration may vary between the root application, managed layers, repositories, files, or other managed entities, resolution shall respect the operation's managed scope rather than assuming one project-wide value is universally applicable.

**FR-CONFIG-066 — Context does not become configuration automatically**  
A fact present in managed-project context shall become a configuration candidate only where the relevant configuration semantics explicitly permit contextual or detected fallback.

**FR-CONFIG-067 — Configuration does not expand scope**  
Configuration shall not silently expand the managed scope of an operation beyond the scope permitted by the Managed Project Functional Specification and the owning use case.

## 18. Configuration and Invocation Semantics

**FR-CONFIG-068 — Invocation compatibility**  
Configuration-related failures, warnings, cancellation, and structured information shall integrate with the shared outcome and diagnostic semantics defined by the Application Invocation Functional Specification.

**FR-CONFIG-069 — Interaction-mode equivalence**  
TUI, Headless, GUI, IDE/host-tool, CI, automation-agent, and future supported invocation paths shall use equivalent configuration precedence, validation, applicability, sensitivity, and effective-value semantics.

**FR-CONFIG-070 — Presentation independence**  
Configuration meaning shall not depend on a terminal prompt order, GUI layout, menu state, IDE settings panel, environment-specific display convention, or another presentation-only representation.

## 19. Resolution Failure Behaviour

**FR-CONFIG-071 — Failure classification**  
Configuration resolution shall distinguish functionally meaningful failure causes where relevant, including missing, invalid, ambiguous, unavailable, inaccessible, interaction-required, cancelled, unsupported, or conflicting configuration.

Exact error codes and classes belong to Detailed Design.

**FR-CONFIG-072 — Conflict handling**  
Where applicable candidates conflict in a way that defined precedence cannot safely resolve, AppManager shall fail or require permitted disambiguation rather than select an arbitrary candidate.

**FR-CONFIG-073 — No consequential execution on unresolved requirement**  
An operation shall not begin effects that depend on required configuration while that configuration remains unresolved or invalid.

**FR-CONFIG-074 — Remediation information**  
Where safely determinable, a configuration-resolution failure should identify a meaningful remediation path such as supplying an explicit permitted value, correcting a configuration source, selecting a project scope, or establishing required protected configuration.

## 20. Relationship to Settings-Domain Behaviour

Configuration resolution and settings management are related but distinct.

The future `settings-functional-specification-v01.md` owns user- and automation-facing behaviours for inspecting and changing persisted configuration and managed resources such as author metadata, funding metadata, repository metadata, application metadata, environment-related settings, contributors, licences, and templates.

This specification owns how applicable candidates from such configuration become effective for AppManager operations.

**FR-CONFIG-075 — Settings/configuration separation**  
A Settings-domain operation that stores or removes a value shall not independently redefine the precedence, fallback, applicability, or effective-value semantics established by this specification and the owning domain requirement.

**FR-CONFIG-076 — Resolution does not imply CRUD**  
A command that consumes effective configuration shall not need to expose configuration-management behaviour merely because it requires a value.

## 21. Legacy Requirement Disposition

The following legacy configuration and resolver concepts are retained at the Functional level:

| Legacy concept | Functional disposition |
|---|---|
| tool defaults plus project overrides | `FR-CONFIG-009`, `FR-CONFIG-016`–`FR-CONFIG-022` |
| project-local -> project-shared -> tool precedence where retained | `FR-CONFIG-010`, `FR-CONFIG-018` |
| effective-value resolution | `FR-CONFIG-016`–`FR-CONFIG-022` |
| centralised precedence rather than command duplication | `FR-CONFIG-017` |
| explicit values, persisted settings, environment/detected values, defaults and interaction as possible candidates | `FR-CONFIG-005`–`FR-CONFIG-015` |
| deterministic resolution | `FR-CONFIG-022`, `FR-CONFIG-039`–`FR-CONFIG-042` |
| provenance/source reporting | `FR-CONFIG-043`–`FR-CONFIG-046` |
| pure resolution versus interactive completion | `FR-CONFIG-035`–`FR-CONFIG-038` |
| persistence separate from resolution | `FR-CONFIG-047`–`FR-CONFIG-052` |
| cancellation not a resolved value | `FR-CONFIG-038` |
| safe built-in defaults only | `FR-CONFIG-028`–`FR-CONFIG-031` |
| shared configuration should not require committed secrets | `FR-CONFIG-053`–`FR-CONFIG-057` |
| shared settings and machine-local/operational information require different authority/lifecycle treatment | `FR-CONFIG-058`–`FR-CONFIG-061` |

The following legacy material is not propagated as Functional authority:

- `ConfigService`, `SettingsResolver`, `Resolution<T>`, `ResolutionResult<T>`, `ResolutionPolicy`, and concrete TypeScript APIs;
- exact resolution-source enums and error-code enums;
- concrete JSON schemas and settings filenames;
- exact filesystem paths and directory trees;
- exact persistence calls such as `setSetting()`;
- prompt-library interfaces;
- implementation-specific null/undefined types;
- concrete provider SDKs or environment-variable names;
- exact storage and encryption mechanisms.

Those concerns require deliberate Detailed Design or Implementation treatment.

## 22. Traceability

This specification primarily refines the following root Design Specification areas:

- Section 2 — configuration resolution over hard-coded assumptions and deterministic automation;
- Section 4 — Headless behaviour, host adapters, and presentation independence;
- Section 5 — invocation inputs, options, context, validation, and Application Engine authority;
- Section 6 — resolver and capability-boundary responsibilities;
- Section 8 — Configuration and State Architecture;
- Section 9 — managed-project context and scope where project configuration depends on them;
- Section 10 — domain configuration concerns, particularly Settings;
- Section 11 — configuration resolution within application workflows;
- Section 12 — configuration-source non-authority, deterministic Headless behaviour, sensitive-information minimisation, and authoritative-versus-derived information;
- Section 14 — Functional Specification responsibility and downward traceability.

The specification also reconciles the configuration-related Functional material identified in `docs/design/appmanager-design-reconciliation-audit-v01.md` and the useful behavioural principles from the historical resolver specification without treating those legacy documents as current architectural authority.

ADR-0001 selects the Version 1 primary implementation technology but does not alter these technology-independent Functional requirements.

## 23. Conformance Criteria

An implementation conforms to this Functional Specification only if all of the following are true:

1. configuration is resolved from governed candidate sources rather than read ad hoc by independent commands;
2. source presence does not equal configuration authority;
3. project-specific overrides and retained project-local/project-shared/tool precedence behave deterministically;
4. explicit invocation values can override only where permitted;
5. invalid, missing, ambiguous, conflicting, or unsupported required configuration is handled explicitly;
6. effective configuration is deterministic for equivalent inputs and context;
7. Headless operation never requires an unexpected prompt;
8. interactive acquisition supplies candidates without becoming configuration authority;
9. effective-value provenance can be exposed where useful without disclosing protected values;
10. resolution does not silently persist one-off values;
11. sensitive configuration is distinguished and minimised in outputs;
12. operational state, logs, reports, caches, and derived artefacts do not silently become durable configuration authority;
13. project- and scope-dependent configuration respects the Managed Project Functional Specification;
14. configuration does not expand managed scope or bypass application policy;
15. configuration semantics remain equivalent across interaction modes and presentation mechanisms;
16. Settings-domain storage behaviour remains distinct from shared effective-configuration semantics.

## 24. Downstream Specification Requirements

Detailed Design Specifications may define, among other things:

- configuration-source contracts;
- configuration schemas and typed keys;
- concrete precedence tables by configuration concern;
- resolver responsibilities and interfaces;
- configuration service responsibilities;
- validation contracts;
- provenance/result models;
- sensitive-value abstractions and redaction rules;
- cache and invalidation behaviour;
- persistence boundaries;
- configuration lifecycle and reload semantics;
- interaction-provider contracts;
- environment and provider adapters;
- exact distinction and representation of absent, unset, null, and empty values;
- project-local, project-shared, and tool-level storage design;
- AppManager management-area layout for configuration and state.

Implementation Specifications may then map those Detailed Designs to the Version 1 Node.js/TypeScript source tree, concrete libraries, file formats, environment conventions, secure-storage facilities, runtime wiring, tests, and migration state.
