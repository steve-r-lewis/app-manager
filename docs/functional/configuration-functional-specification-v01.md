# AppManager Configuration Functional Specification

> **Status:** Version 1 Functional Specification
>
> **Functional authority:** This document defines the required observable behaviour by which AppManager obtains, validates, resolves, explains, protects, and applies configuration. It refines, but does not override, the root Design Specification.
>
> **Governing sources:** [Project Documentation Guide](../project-documentation-guide-v01.md), [AppManager Design Specification](../appmanager-design-specification-v01.md)
>
> **Related Functional authorities:** [docs/functional/application-invocation-functional-specification-v01.md](application-invocation-functional-specification-v01.md), [docs/functional/managed-project-functional-specification-v01.md](managed-project-functional-specification-v01.md)
>
> **Historical planning provenance (non-normative):** [docs/project_management/functional-specification-decomposition-plan-v01.md](../project_management/functional-specification-decomposition-plan-v01.md)

## 1. Purpose

This specification defines the common functional behaviour through which AppManager converts configuration candidates from approved sources into effective configuration for a particular invocation, managed project, managed scope, or application operation.

It establishes the distinction between a configuration source, a candidate value, an effective value, and the application policy that consumes that value.

The requirements below define source applicability, resolution, provenance and failure behaviour for the configuration architecture in [Design §8](../appmanager-design-specification-v01.md#_8-configuration-and-state-architecture).

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
- exact secure-store technology, encryption mechanism, or operating-system credential API;
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

<a id="fr-config-001"></a>

**FR-CONFIG-001 — Application-level configuration semantics**  
Configuration semantics across supported callers and capabilities shall apply [Design §4.6](../appmanager-design-specification-v01.md#_4-6-presentation-independence).

<a id="fr-config-002"></a>

**FR-CONFIG-002 — Candidate-source non-authority**  
Configuration-source candidates shall conform to [Design §8.1](../appmanager-design-specification-v01.md#_8-1-configuration-model).

<a id="fr-config-003"></a>

**FR-CONFIG-003 — Application Engine authority**  
Effective-configuration consumption shall conform to [Design §6.2](../appmanager-design-specification-v01.md#_6-2-application-engine-authority), [Design §11.11](../appmanager-design-specification-v01.md#_11-11-workflow-results-failure-and-acceptance).

<a id="fr-config-004"></a>

**FR-CONFIG-004 — Resolution is not execution authority**  
Resolution mechanism authority shall conform to [Design §6.2](../appmanager-design-specification-v01.md#_6-2-application-engine-authority).

## 5. Configuration Sources and Candidates

### 5.1 Recognised source classes

<a id="fr-config-005"></a>

**FR-CONFIG-005 — Source classes**

AppManager shall be capable of obtaining applicable candidates from the source classes in [Design §8.1](../appmanager-design-specification-v01.md#_8-1-configuration-model). It shall additionally support contextual/detected values where a Functional Specification permits them, safe defined built-in defaults, and user-supplied values where interaction is permitted. A setting or operation need not use every source class.

<a id="fr-config-006"></a>

**FR-CONFIG-006 — Candidate classification**  
AppManager shall distinguish the source class of a candidate sufficiently to apply the correct applicability, precedence, validation, sensitivity, and provenance rules.

<a id="fr-config-007"></a>

**FR-CONFIG-007 — Source applicability**  
A source shall participate in resolution only when it is applicable to the configuration item, target project, managed scope, invocation, operation, and execution context concerned.

<a id="fr-config-008"></a>

**FR-CONFIG-008 — No source-by-presence authority**  
Candidates present in files, environments, host context, provider responses, registries, project resources or invocations shall apply [FR-CONFIG-007](configuration-functional-specification-v01.md#fr-config-007), [FR-CONFIG-023](configuration-functional-specification-v01.md#fr-config-023).

### 5.2 Project configuration

<a id="fr-config-009"></a>

**FR-CONFIG-009 — Project-specific override capability**  
AppManager shall support target-project configuration capable of overriding reusable tool-level configuration where the configuration item's defined semantics permit project-specific override.

<a id="fr-config-010"></a>

**FR-CONFIG-010 — Project-shared and project-local distinction**  
Where a configuration concern supports both project-shared and project-local values, AppManager shall distinguish those scopes and resolve them according to defined precedence and portability semantics rather than treating them as interchangeable storage locations.

<a id="fr-config-011"></a>

**FR-CONFIG-011 — Project association**  
Project-scoped configuration selection shall conform to [Design §9.6](../appmanager-design-specification-v01.md#_9-6-project-discovery-and-context-resolution) and apply [FR-PROJ-005](managed-project-functional-specification-v01.md#fr-proj-005) to invocation-location evidence.

### 5.3 Explicit invocation values

<a id="fr-config-012"></a>

**FR-CONFIG-012 — Explicit invocation candidates**  
Where a use case permits an invocation-supplied configuration value or override, AppManager shall treat the supplied value as an explicit candidate subject to the same applicable validation and safety requirements as equivalent values obtained elsewhere.

<a id="fr-config-013"></a>

**FR-CONFIG-013 — Override permission**  
An explicit invocation value shall override another configuration source only where the relevant configuration semantics permit invocation-level override. Callers shall not be able to bypass non-overridable application policy merely by supplying a value explicitly.

### 5.4 Environment and provider candidates

<a id="fr-config-014"></a>

**FR-CONFIG-014 — Environment-derived candidates**  
Environment-derived candidate applicability and precedence shall apply [FR-CONFIG-007](configuration-functional-specification-v01.md#fr-config-007), [FR-CONFIG-016](configuration-functional-specification-v01.md#fr-config-016).

<a id="fr-config-015"></a>

**FR-CONFIG-015 — Provider-derived candidates**  
Provider/external candidates and their representations/defaults shall conform to [Design §8.1](../appmanager-design-specification-v01.md#_8-1-configuration-model).

## 6. Precedence and Effective Configuration

### 6.1 Defined precedence

<a id="fr-config-016"></a>

**FR-CONFIG-016 — Explicit precedence**  
For each configuration concern that may have more than one applicable candidate, AppManager shall define deterministic precedence or selection semantics sufficient to identify the effective value or a defined resolution failure.

<a id="fr-config-017"></a>

**FR-CONFIG-017 — Centralised semantics**  
Equivalent configuration concerns shall use the same precedence semantics wherever they are consumed. Commands, adapters, and capability providers shall not independently invent competing precedence chains for the same AppManager configuration item.

<a id="fr-config-018"></a>

**FR-CONFIG-018 — Project override ordering**  
Where project-local, project-shared, and tool-level settings tiers are applicable to a configuration item, their precedence shall be:

```text
project-local
    -> project-shared
    -> tool-level
```

Higher-priority valid applicable values shall take precedence over lower-priority values. Additional source classes such as explicit invocation values, detected context, environment values, provider values, built-in defaults, or interactive completion shall be positioned by the owning configuration semantics rather than assumed to occupy one universal position for every setting.

<a id="fr-config-019"></a>

**FR-CONFIG-019 — No universal precedence by convenience**  
Concern-specific ordering of additional source classes shall apply [FR-CONFIG-018](configuration-functional-specification-v01.md#fr-config-018).

### 6.2 Effective values

<a id="fr-config-020"></a>

**FR-CONFIG-020 — Effective configuration**  
Operation configuration consumption shall apply [FR-CONFIG-016](configuration-functional-specification-v01.md#fr-config-016). Consumers shall use the resulting effective value, not independently select a raw source candidate.

<a id="fr-config-021"></a>

**FR-CONFIG-021 — Scope-specific effectiveness**  
An effective value may differ by target project, managed scope, invocation, operation, or other defined context. AppManager shall not treat a value resolved for one scope as universally effective when its semantics are scope-dependent.

<a id="fr-config-022"></a>

**FR-CONFIG-022 — Stable resolution inputs**  
Given equivalent applicable candidate sources, candidate values, managed context, invocation inputs, environmental observations, and configuration policy, resolution shall produce the same effective result.

## 7. Candidate Validation

<a id="fr-config-023"></a>

**FR-CONFIG-023 — Candidate validation**  
Before a candidate becomes effective, AppManager shall validate the constraints that are functionally significant for that configuration item, including as applicable whether the candidate is malformed, unsupported, unavailable, inaccessible, unsafe, incompatible with the operation, or incompatible with the execution mode.

<a id="fr-config-024"></a>

**FR-CONFIG-024 — Invalid higher-priority candidate behaviour**  
The owning configuration semantics shall define whether an invalid higher-priority candidate causes resolution failure or permits fallback to another source. AppManager shall not silently choose whichever behaviour is most convenient at the call site.

<a id="fr-config-025"></a>

**FR-CONFIG-025 — Invalid candidate diagnostics**  
Where an invalid candidate prevents successful resolution, AppManager shall provide an application-level diagnostic identifying the configuration concern and the nature of the failure without unnecessarily exposing sensitive value content.

<a id="fr-config-026"></a>

**FR-CONFIG-026 — Explicitly unset and absent values**  
Where the distinction is functionally relevant, AppManager shall distinguish a source that supplies no candidate from a source that explicitly represents an unset or intentionally absent value. Exact null/undefined representations belong to Detailed Design.

<a id="fr-config-027"></a>

**FR-CONFIG-027 — Empty values**  
An empty value shall be accepted, rejected, or treated as absence according to the configuration item's defined semantics rather than by a global assumption that all empty representations mean the same thing.

## 8. Fallbacks and Defaults

<a id="fr-config-028"></a>

**FR-CONFIG-028 — Defined fallback**  
Fallback to a lower-priority or alternate source shall occur only where the configuration item's defined semantics permit fallback.

<a id="fr-config-029"></a>

**FR-CONFIG-029 — Safe built-in defaults**  
A built-in default shall be used only where AppManager has deliberately defined a value that is valid and sufficiently safe for the relevant configuration concern.

<a id="fr-config-030"></a>

**FR-CONFIG-030 — No invented default**  
Defaults considered to avoid missing-value failure or prompting shall apply [FR-CONFIG-029](configuration-functional-specification-v01.md#fr-config-029).

<a id="fr-config-031"></a>

**FR-CONFIG-031 — Default provenance**  
Where provenance is exposed, a built-in default shall remain distinguishable from a persisted, explicit, detected, environment-derived, provider-derived, or interactively supplied value.

## 9. Required and Optional Configuration

<a id="fr-config-032"></a>

**FR-CONFIG-032 — Required configuration**  
Where an operation requires a configuration value, AppManager shall either resolve a valid effective value through permitted sources or reject the operation clearly before effects that depend on that value occur.

<a id="fr-config-033"></a>

**FR-CONFIG-033 — Optional configuration**  
Where a configuration value is optional, absence shall be represented according to the owning use case rather than automatically converted into an arbitrary default or failure.

<a id="fr-config-034"></a>

**FR-CONFIG-034 — Missing required value**  
Failure to resolve required configuration shall produce a structured application-level failure compatible with the Application Invocation Functional Specification and shall identify the unresolved configuration concern sufficiently for remediation.

## 10. Interactive Completion

<a id="fr-config-035"></a>

**FR-CONFIG-035 — Resolution independent of UI**  
Configuration resolution without a user interface shall apply [FR-INV-020](application-invocation-functional-specification-v01.md#fr-inv-020).

<a id="fr-config-036"></a>

**FR-CONFIG-036 — Interactive candidate acquisition**  
Interactive completion of unresolved configuration shall conform to [Design §8.4](../appmanager-design-specification-v01.md#_8-4-separation-of-resolution-and-interaction). An owning use case may also explicitly request user selection where interaction and the configuration item permit it.

<a id="fr-config-037"></a>

**FR-CONFIG-037 — Interaction does not own resolution**  
Adapter-acquired configuration values shall conform to [Design §8.4](../appmanager-design-specification-v01.md#_8-4-separation-of-resolution-and-interaction).

<a id="fr-config-038"></a>

**FR-CONFIG-038 — Interactive cancellation**  
Cancellation of interactive configuration acquisition shall not be converted into an empty value, persisted as configuration, or silently replaced by an unsafe default. It shall be handled through the applicable cancellation or failure semantics.

## 11. Headless and Automation Behaviour

<a id="fr-config-039"></a>

**FR-CONFIG-039 — Deterministic Headless resolution**  
Headless configuration resolution shall apply [FR-INV-020](application-invocation-functional-specification-v01.md#fr-inv-020).

<a id="fr-config-040"></a>

**FR-CONFIG-040 — No implicit prompting**  
Headless acquisition of missing configuration shall apply [FR-INV-020](application-invocation-functional-specification-v01.md#fr-inv-020).

<a id="fr-config-041"></a>

**FR-CONFIG-041 — No automation-specific weakening**  
Automated configuration acquisition shall apply [FR-INV-022](application-invocation-functional-specification-v01.md#fr-inv-022). The candidate validation, precedence, sensitivity and non-overridable-policy requirements of this specification remain applicable.

<a id="fr-config-042"></a>

**FR-CONFIG-042 — Reproducible automation**  
Repeated Headless resolution shall apply [FR-CONFIG-022](configuration-functional-specification-v01.md#fr-config-022). Presentation state and unpersisted prior interactive choices are not authoritative configuration inputs.

## 12. Provenance and Explainability

<a id="fr-config-043"></a>

**FR-CONFIG-043 — Effective-value provenance**  
Effective-value provenance shall enforce the source-identification requirement in [Design §8.2](../appmanager-design-specification-v01.md#_8-2-configuration-resolution-and-effective-configuration) where useful for user understanding, automation, diagnostics or auditing.

<a id="fr-config-044"></a>

**FR-CONFIG-044 — Explainable selection**  
Where practical and safe, AppManager shall be able to explain why a candidate became effective or why resolution failed, including relevant precedence, applicability, validation, or missing-source information.

<a id="fr-config-045"></a>

**FR-CONFIG-045 — Provenance without reconstruction**  
Consumers that need configuration provenance shall not be required to independently reconstruct precedence by rereading all candidate sources.

<a id="fr-config-046"></a>

**FR-CONFIG-046 — Sensitive provenance**  
Configuration provenance may identify a sensitive value's source or status without disclosing the sensitive value itself.

## 13. Persistence and Configuration Changes

### 13.1 Resolution versus persistence

<a id="fr-config-047"></a>

**FR-CONFIG-047 — Resolution/persistence separation**  
Resolving or supplying a configuration value shall not, by itself, mean that the value must be persisted for future operations.

<a id="fr-config-048"></a>

**FR-CONFIG-048 — Explicit persistence semantics**  
Where a use case permits a supplied or interactively acquired value to be persisted, persistence shall be an explicit operation or explicit policy of that use case rather than an incidental side effect of resolution.

<a id="fr-config-049"></a>

**FR-CONFIG-049 — One-off values**  
AppManager shall permit one-off invocation values where the owning use case allows them without requiring those values to modify durable project or tool configuration.

### 13.2 Effect of changes

<a id="fr-config-050"></a>

**FR-CONFIG-050 — Changed configuration affects future resolution**  
A successful durable configuration change shall be eligible to influence subsequent effective-configuration resolution according to its scope and precedence.

<a id="fr-config-051"></a>

**FR-CONFIG-051 — No retroactive semantic mutation**  
A configuration change shall not silently rewrite the already-established meaning of an invocation that has passed the point at which its effective configuration is defined, unless the owning workflow explicitly supports dynamic re-resolution.

<a id="fr-config-052"></a>

**FR-CONFIG-052 — Scope of persisted changes**  
A persisted configuration change shall affect only the configuration scope selected by the owning Settings or domain use case and shall not silently modify another scope merely to make resolution succeed.

## 14. Sensitive Configuration

<a id="fr-config-053"></a>

**FR-CONFIG-053 — Sensitive classification**  
Sensitive versus shareable configuration distinctions shall conform to [Design §8.7](../appmanager-design-specification-v01.md#_8-7-sensitive-configuration).

<a id="fr-config-054"></a>

**FR-CONFIG-054 — Sensitive-source suitability**  
Sensitive configuration shall not be required to reside in ordinary source-controlled project configuration when doing so would expose protected information.

<a id="fr-config-055"></a>

**FR-CONFIG-055 — Sensitive-value minimisation**  
Configuration-bearing invocation outputs shall apply [FR-INV-040](application-invocation-functional-specification-v01.md#fr-inv-040).

<a id="fr-config-056"></a>

**FR-CONFIG-056 — Sensitive absence versus disclosure**  
Sensitive-value absence, invalidity, inaccessibility or unavailability diagnostics shall apply [FR-CONFIG-025](configuration-functional-specification-v01.md#fr-config-025).

<a id="fr-config-057"></a>

**FR-CONFIG-057 — Provider secrecy does not transfer authority**  
Secure stores, host credential facilities and protected-value providers shall apply [Design §8.1](../appmanager-design-specification-v01.md#_8-1-configuration-model).

## 15. Configuration, State, Reports, Logs, and Derived Information

<a id="fr-config-058"></a>

**FR-CONFIG-058 — Durable configuration distinction**  
Configuration/state category distinctions shall conform to [Design §8.8](../appmanager-design-specification-v01.md#_8-8-configuration-state-reports-and-logs).

<a id="fr-config-059"></a>

**FR-CONFIG-059 — No accidental configuration authority**  
Operational, derived and machine-local information shall conform to [Design §8.8](../appmanager-design-specification-v01.md#_8-8-configuration-state-reports-and-logs).

<a id="fr-config-060"></a>

**FR-CONFIG-060 — Explicit promotion only**  
If information derived from state, detection, a provider, or another non-authoritative source is to become durable configuration, that transition shall occur only through an explicit configuration-management behaviour or defined persistence policy.

<a id="fr-config-061"></a>

**FR-CONFIG-061 — Lifecycle distinctions**  
Configuration categories shall enforce the classification in [Design §§8.6–8.8](../appmanager-design-specification-v01.md#_8-6-configuration-categories) at Functional level even where physical storage co-locates them.

## 16. Configuration Categories

<a id="fr-config-062"></a>

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

<a id="fr-config-063"></a>

**FR-CONFIG-063 — Domain ownership of meaning**  
The domain or cross-cutting Functional Specification that owns a configuration concern shall define the functional meaning and constraints of that concern. This specification owns the shared resolution behaviour by which such values become effective.

## 17. Configuration and Managed Project Context

<a id="fr-config-064"></a>

**FR-CONFIG-064 — Project context before project configuration**  
Where configuration selection depends on the target project, AppManager shall resolve sufficient managed-project context before treating project-scoped configuration as applicable.

<a id="fr-config-065"></a>

**FR-CONFIG-065 — Managed-scope-aware configuration**  
Values varying between roots, layers, repositories, files or other managed entities shall apply [FR-CONFIG-021](configuration-functional-specification-v01.md#fr-config-021).

<a id="fr-config-066"></a>

**FR-CONFIG-066 — Context does not become configuration automatically**  
A fact present in managed-project context shall become a configuration candidate only where the relevant configuration semantics explicitly permit contextual or detected fallback.

<a id="fr-config-067"></a>

**FR-CONFIG-067 — Configuration does not expand scope**  
Configuration-dependent target selection shall apply [FR-PROJ-042](managed-project-functional-specification-v01.md#fr-proj-042).

## 18. Configuration and Invocation Semantics

<a id="fr-config-068"></a>

**FR-CONFIG-068 — Invocation compatibility**  
Configuration-related failures, warnings, cancellation, and structured information shall integrate with the shared outcome and diagnostic semantics defined by the Application Invocation Functional Specification.

<a id="fr-config-069"></a>

**FR-CONFIG-069 — Interaction-mode equivalence**  
Configuration precedence, validation, applicability, sensitivity and effective values across supported modes shall apply [Design §4.6](../appmanager-design-specification-v01.md#_4-6-presentation-independence).

<a id="fr-config-070"></a>

**FR-CONFIG-070 — Presentation independence**  
Configuration input and meaning shall apply [Design §4.6](../appmanager-design-specification-v01.md#_4-6-presentation-independence).

## 19. Resolution Failure Behaviour

<a id="fr-config-071"></a>

**FR-CONFIG-071 — Failure classification**  
Configuration resolution shall distinguish functionally meaningful failure causes where relevant, including missing, invalid, ambiguous, unavailable, inaccessible, interaction-required, cancelled, unsupported, or conflicting configuration.

Exact error codes and classes belong to Detailed Design.

<a id="fr-config-072"></a>

**FR-CONFIG-072 — Conflict handling**  
Where applicable candidates conflict in a way that defined precedence cannot safely resolve, AppManager shall fail or require permitted disambiguation rather than select an arbitrary candidate.

<a id="fr-config-073"></a>

**FR-CONFIG-073 — No consequential execution on unresolved requirement**  
Effects dependent on required configuration shall apply [FR-CONFIG-032](configuration-functional-specification-v01.md#fr-config-032).

<a id="fr-config-074"></a>

**FR-CONFIG-074 — Remediation information**  
Where safely determinable, a configuration-resolution failure should identify a meaningful remediation path such as supplying an explicit permitted value, correcting a configuration source, selecting a project scope, or establishing required protected configuration.

## 20. Relationship to Settings-Domain Behaviour

Configuration resolution and settings management are related but distinct.

The Settings Functional Specification owns user- and automation-facing behaviours for inspecting and changing persisted configuration and managed resources such as author metadata, funding metadata, repository metadata, application metadata, environment-related settings, contributors, licences, and templates.

This specification owns how applicable candidates from such configuration become effective for AppManager operations.

<a id="fr-config-075"></a>

**FR-CONFIG-075 — Settings/configuration separation**  
A Settings-domain operation that stores or removes a value shall not independently redefine the precedence, fallback, applicability, or effective-value semantics established by this specification and the owning domain requirement.

<a id="fr-config-076"></a>

**FR-CONFIG-076 — Resolution does not imply CRUD**  
A command that consumes effective configuration shall not need to expose configuration-management behaviour merely because it requires a value.

## 21. Traceability

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

ADR-0001 selects the Version 1 primary implementation technology but does not alter these technology-independent Functional requirements.

## 22. Conformance Criteria

Conformance is assessed against the applicable requirement bodies in this specification and the canonical contracts they reference. The traceability section identifies the requirement groups; this section creates no additional acceptance checklist.

## 23. Downstream Specification Requirements

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

Implementation Specifications may then map those Detailed Designs to the Version 1 Node.js/TypeScript source tree, concrete libraries, file formats, environment conventions, secure-storage facilities, runtime wiring, and tests.
