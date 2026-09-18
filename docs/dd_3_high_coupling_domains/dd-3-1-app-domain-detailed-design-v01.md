# DD-3.1 — AppManager App Domain Detailed Design

> **Detailed Design ID:** DD-3.1
>
> **Design family:** DD-3 — High-Coupling Domains

> **Status:** Version 1 Detailed Design Specification
>
> **Detailed Design authority:** This document defines the permanent domain-specific orchestration, policy, state, decision and result contracts by which AppManager realises root-application lifecycle and root-application creation use cases through the DD-1 Application Core and DD-2 Shared Capability contracts.
>
> **Sources and navigation:** [Project Documentation Guide](../project-documentation-guide-v01.md), [AppManager Design Specification](../appmanager-design-specification-v01.md), [docs/functional/app-functional-specification-v01.md](../functional/app-functional-specification-v01.md), [docs/functional/app-settings-environment-definition-ownership-canonical specification-v01.md](../functional/app-functional-specification-v01.md#fr-app-016), accepted ADRs, and the normative DD-1/DD-2 Detailed Designs.
>
> **Authoring controls:** [Detailed Design Register](../project_management/detailed-design-register-v01.md), [docs/project_management/domain-detailed-design-authoring-guide-v02.md](../project_management/domain-detailed-design-authoring-guide-v02.md), [docs/project_management/dd2-final-horizontal-reconciliation-conformance-closeout-v01.md](../project_management/dd2-final-horizontal-reconciliation-conformance-closeout-v01.md)

---

## 1. Purpose

This specification refines [App Functional contracts](../functional/app-functional-specification-v01.md) for root-application lifecycle and creation. Its lifecycle plans connect readiness, preparation, build and cleanup stages. Root creation and declared-script execution have separate local models in §7 and workflows in §8.

The collaboration in §§5–6 applies [Design §6.2](../appmanager-design-specification-v01.md#_6-2-application-engine-authority) and [§6.6](../appmanager-design-specification-v01.md#_6-6-capability-boundaries-and-providers) to the domain’s context, specialist delegation and final acceptance.

## 2. Scope

### 2.1 In Scope

This design owns permanent App-domain contracts for:

- existing root-application preparation;
- project-declared post-installation lifecycle execution;
- local development and project-resolved generation;
- build;
- preview;
- clean of safely regenerable root-application state;
- reset/empty of approved regenerable installation and build state;
- reset-and-prepare composition as a composed lifecycle workflow;
- creation of a new AppManager-oriented root application;
- creation-profile interpretation and orchestration;
- bounded execution of recognised project-declared package scripts;
- App-domain lifecycle action identity and applicability;
- lifecycle-stage composition and dependency ordering;
- App-specific policy, safety and acceptance decisions;
- App-specific progress/stage evidence and result payloads;
- coordination of Settings, Git and Nuxt domain behaviour where an App use case requires a subordinate domain operation;
- interpretation of DD-2 capability evidence in the context of App lifecycle intent;
- App-domain cancellation, partial-effect, recovery and conflict semantics.

### 2.2 Out of Scope

This design does not own or redefine:

- canonical invocation identity, caller authorization evidence, cancellation linkage or interaction-mode semantics owned by DD-1 Application Invocation;
- canonical success, failure, partial-success, cancellation, diagnostics or effect semantics owned by DD-1 Execution Outcomes;
- managed-project identity, root/layer topology, managed scope or mutation authority owned by DD-1 Managed Project;
- configuration candidate precedence, provenance or effective-value construction owned by DD-1 Configuration Resolution;
- application-wide dispatch, authority, final acceptance or outcome publication owned by DD-1 Application Engine;
- filesystem/resource access mechanics owned by DD-2 Resource Access;
- external-process execution mechanics owned by DD-2 Process Execution;
- repository primitives or Git-domain policy;
- source-recognition semantics owned by DD-2 Source Intelligence;
- bounded existing-source mutation semantics owned by DD-2 Source Transformation;
- registry or template rendering semantics owned by DD-2 Resource Registry and Template;
- Nuxt-specific recognition, configuration or scaffold semantics owned by DD-2 Nuxt Capability and the Nuxt domain;
- persisted environment-definition CRUD semantics owned by Settings;
- ongoing documentation, quality or AI-domain use cases;
- concrete package-manager command strings, source paths, TypeScript modules, classes, functions, dependency-injection wiring, libraries or migration sequencing.

---

## 3. Governing Requirements and Authorities

### 3.1 Functional ownership

The App domain owns `FR-APP-001` through `FR-APP-116` from [docs/functional/app-functional-specification-v01.md](../functional/app-functional-specification-v01.md).

The principal requirement groups are:

| Functional range | App-domain concern |
|---|---|
| `FR-APP-001`–`FR-APP-012` | general lifecycle semantics and authority |
| `FR-APP-013`–`FR-APP-024` | prepare existing application |
| `FR-APP-025`–`FR-APP-028` | post-installation lifecycle behaviour |
| `FR-APP-029`–`FR-APP-033` | local development execution |
| `FR-APP-034`–`FR-APP-038` | build |
| `FR-APP-039`–`FR-APP-042` | preview |
| `FR-APP-043`–`FR-APP-049` | clean regenerable state |
| `FR-APP-050`–`FR-APP-058` | reset/empty regenerable installation/build state |
| `FR-APP-059`–`FR-APP-065` | reset-and-prepare |
| `FR-APP-066`–`FR-APP-090` | create new root application |
| `FR-APP-091`–`FR-APP-098` | declared project-package-script execution |
| `FR-APP-099`–`FR-APP-104` | safety and non-destructive behaviour |
| `FR-APP-105`–`FR-APP-109` | interaction-mode behaviour |
| `FR-APP-116` | root generation |
| `FR-APP-110`–`FR-APP-115` | cancellation, failure and partial completion |

`FR-APP-013`–`FR-APP-018` are additionally constrained by [Settings environment-definition requirements](../functional/settings-functional-specification-v01.md#fr-set-060): App owns preparation intent and lifecycle acceptance; Settings owns persisted environment-definition operations.

### 3.2 Application Core authorities

This design consumes, but does not redefine:

- [DD-1.1 — Application Invocation](../dd_1_application_core/dd-1-1-application-invocation-detailed-design-v01.md);
- [DD-1.2 — Execution Outcomes](../dd_1_application_core/dd-1-2-execution-outcomes-detailed-design-v01.md);
- [DD-1.3 — Managed Project](../dd_1_application_core/dd-1-3-managed-project-detailed-design-v01.md);
- [DD-1.4 — Configuration Resolution](../dd_1_application_core/dd-1-4-configuration-resolution-detailed-design-v01.md);
- [Application Core Bootstrap Resolution](../dd_1_application_core/dd-1-5-application-engine-detailed-design-v01.md#_8-orchestration-lifecycle);
- [DD-1.5 — Application Engine](../dd_1_application_core/dd-1-5-application-engine-detailed-design-v01.md).

### 3.3 Shared capability authorities

This design may coordinate the following DD-2 contracts according to the use case:

- Resource Access;
- Process Execution;
- Repository Capability;
- Source Intelligence;
- Source Transformation;
- Resource Registry and Template;
- Documentation Capability;
- Quality Capability;
- Nuxt Capability.

AI Capability is not a required dependency for the Version 1 App-domain lifecycle semantics defined here. AI assistance may be introduced only through an approved owning use case and shall remain subordinate evidence/proposal.

---

## 4. Domain Responsibility and Authority Boundary

### 4.1 App-domain ownership

The App domain owns:

- the semantic identity of each App lifecycle use case;
- lifecycle applicability after authoritative project/configuration context is available;
- App-specific preconditions;
- lifecycle-stage selection and sequencing;
- App-specific policy for clean/reset/create effects;
- interpretation of declared project lifecycle actions;
- interpretation of subordinate Settings/Git/Nuxt domain results within an App workflow;
- interpretation of DD-2 capability evidence against App lifecycle postconditions;
- App-domain result payloads and recovery information;
- determination of whether a lifecycle stage is satisfied, skipped, blocked, failed or requires further user action.

### 4.2 Authority retained elsewhere

| Concern | Authoritative owner | App-domain relationship |
|---|---|---|
| invocation semantics | DD-1 Application Invocation | consumes normalized intent and authorization evidence |
| final application authority | DD-1 Application Engine | App supplies domain interpretation; Engine accepts/publishes final outcome |
| managed scope | DD-1 Managed Project | consumes authoritative root-application scope |
| effective configuration | DD-1 Configuration Resolution | consumes operation snapshot |
| canonical outcomes | DD-1 Execution Outcomes | supplies App-specific payload/evidence |
| resource mechanics | DD-2 Resource Access | delegates bounded resource operations |
| process mechanics | DD-2 Process Execution | delegates bounded executable/tool execution |
| repository primitives | DD-2 Repository Capability | normally reached through Git-domain semantics when repository use-case policy is required |
| environment-definition persistence | Settings domain | delegates environment operation during preparation |
| Nuxt-specific semantics | Nuxt domain / DD-2 Nuxt Capability | coordinates without duplicating Nuxt ownership |
| templates/registries | DD-2 Resource Registry and Template | resolves/renders selected declarative resources |
| existing-source mutation | DD-2 Source Transformation | delegates approved bounded transformation |

### 4.3 Domain orchestration position

```text
normalized invocation
        |
        v
Application Engine authority
        |
        +--> managed-project / root scope
        +--> effective configuration
        +--> authorization / cancellation / outcome context
        |
        v
App-domain lifecycle orchestration
        |
        +--> Settings domain, where environment persistence is required
        +--> Git domain, where repository use-case semantics are required
        +--> Nuxt domain/capability, where Nuxt-specific semantics are required
        +--> DD-2 capabilities for bounded technical work
        |
        v
App-domain interpretation / lifecycle result
        |
        v
Application Engine acceptance
        |
        v
canonical AppManager outcome
```

The diagram describes authority and semantic dependency, not a required call stack, class hierarchy or process topology.

---

## 5. Consumed DD-1 Application Core Contracts

| DD-1 contract | App-domain use |
|---|---|
| Application Invocation | receives canonical App command/use-case identity, explicit inputs, preview intent, authorization evidence, cancellation linkage and event context |
| Application Engine | receives execution context and application authority; returns App-domain interpretation for final acceptance |
| Managed Project | consumes root-application identity, recognized project facts, operation-specific scope and targetability constraints |
| Configuration Resolution | consumes the immutable operation effective-configuration snapshot and provenance where policy requires it |
| Execution Outcomes | records lifecycle-stage evidence, effects, diagnostics, partial completion and App-specific payloads within canonical outcome semantics |

The App domain shall not independently reconstruct any of these contracts from adapter input, filesystem discovery or provider-native state.

---

## 6. Consumed DD-2 Shared Capabilities

| DD-2 capability | App-domain purpose |
|---|---|
| Resource Access | bounded inspection, creation, deletion and other resource effects already authorized by App/domain policy |
| Process Execution | execution and observation of project lifecycle actions and recognised project-declared scripts |
| Repository Capability | repository evidence/primitives where an App workflow coordinates an already-authorized repository operation; Git-domain policy remains distinct |
| Source Intelligence | read-only structural/project evidence where lifecycle applicability requires supported source facts |
| Source Transformation | mutation/replacement of existing source where creation or lifecycle work crosses from generation into existing-source modification |
| Resource Registry and Template | creation-profile resource discovery, validation, parameter binding and deterministic rendering |
| Documentation Capability | generation/planning of documentation artefacts where a creation profile delegates documentation semantics rather than treating content as an opaque template |
| Quality Capability | optional validation evidence where an App lifecycle postcondition explicitly requires it; quality policy remains Quality-owned |
| Nuxt Capability | Nuxt-specific recognition, generation/configuration evidence and bounded primitives required by a root-application workflow |

Capability consumption does not transfer semantic ownership. Technical completion from any capability is evidence until interpreted by the App use case and accepted by the Application Engine.

---

## 7. Domain Contract Model

The following are conceptual App-domain contracts. They define semantic information, not concrete TypeScript interfaces or source modules.

<a id="dd-app-001"></a>

### DD-APP-001 — Lifecycle Action Identity

`LifecycleActionIdentity` binds exactly the eight commands in the [App Functional catalogue](../functional/app-functional-specification-v01.md): create, prepare, develop, build, preview, generate, clean and reset. Their identities are independent of provider syntax. Post-install and declared-script identities describe subordinate work, not additional commands; aliases do not extend the catalogue.

<a id="dd-app-002"></a>

### DD-APP-002 — Lifecycle Applicability

A `LifecycleApplicability` record shall be capable of representing:

```text
action identity
applicability: available | unavailable | already_satisfied
supporting project/configuration evidence
unmet preconditions
diagnostics
```

`unavailable` is distinct from an unknown invocation. `already_satisfied` may be used only where the use case has meaningful idempotent satisfaction semantics.

<a id="dd-app-003"></a>

### DD-APP-003 — Lifecycle Stage

A composed App workflow shall represent meaningful lifecycle stages using stable semantic identities rather than provider commands.

A stage shall be able to describe:

```text
stage identity
lifecycle purpose
prerequisite stage identities
required authoritative context
delegated domain/capability intent
consequential-effect classification
stage acceptance condition
```

A stage description is an orchestration contract, not a requirement for one implementation object.

<a id="dd-app-004"></a>

### DD-APP-004 — Lifecycle Stage Result

`LifecycleStageResult` composes the [DD-1.2 child-result model](../dd_1_application_core/dd-1-2-execution-outcomes-detailed-design-v01.md#_14-partial-completion) using lifecycle stage identity, accepted-stage evidence, remaining action and recovery relevance. Shared status, diagnostics and effects retain their canonical meanings.

<a id="dd-app-005"></a>

### DD-APP-005 — App Lifecycle Result Payload

An App lifecycle result payload shall be capable of carrying, as applicable:

- lifecycle action identity;
- target root-application identity or creation target identity;
- ordered stage results;
- created/removed/retained resource-class evidence;
- selected creation profile/choices;
- selected declared-script identity;
- completed follow-on actions;
- remaining required user action;
- recovery/continuation information;
- recommended next lifecycle actions.

The payload is embedded within or associated with the canonical DD-1.2 outcome; it is not an alternate outcome envelope.

<a id="dd-app-006"></a>

### DD-APP-006 — Creation Profile Selection

A `CreationProfileSelection` shall identify a supported root-application creation profile and its approved capability choices without embedding template/provider implementation details.

A profile selection shall be validated for internal coherence before consequential creation begins.

<a id="dd-app-007"></a>

### DD-APP-007 — Creation Plan

For root-application creation, the App domain shall establish a bounded semantic creation plan before applying consequential effects.

The plan shall identify, as applicable:

```text
target identity/location
selected profile/choices
planned generated artefact classes
planned existing-resource transformations, if any
planned follow-on domain/lifecycle actions
required authorization checkpoints
validation/postcondition expectations
```

Rendered template output or provider-native scaffold output is evidence used by this plan; neither is the plan's semantic authority.

<a id="dd-app-008"></a>

### DD-APP-008 — Regenerable Resource Classification

`RegenerableResourceClassification` distinguishes Clean-eligible cache/build state, Reset-eligible installation/build state, policy-dependent lock state, and excluded durable/unrelated/ambiguous resources. Eligibility follows [FR-APP-044](../functional/app-functional-specification-v01.md#fr-app-044), [FR-APP-045](../functional/app-functional-specification-v01.md#fr-app-045), [FR-APP-052](../functional/app-functional-specification-v01.md#fr-app-052) and the lock-state policy in DD-APP-035. Concrete paths are implementation evidence for these classes.

<a id="dd-app-009"></a>

### DD-APP-009 — Declared Script Selection

The bounded supporting collaborator accepts project-declared identity/evidence and delegates actual execution to Process Execution. Discovery does not add command identities. A declared-script execution request shall identify a script proven to exist in recognised managed-root package metadata. Arbitrary caller-supplied shell text shall not satisfy this contract.

<a id="dd-app-010"></a>

### DD-APP-010 — App Recovery Position

A composed App workflow that terminates after effects begin shall be able to expose a recovery position containing:

- last accepted stage;
- failed/cancelled stage;
- material completed effects;
- invalidated or unattempted dependent stages;
- whether retry, continuation, repair or manual intervention is semantically plausible;
- evidence required to revalidate before further work.

A recovery position is information, not an automatic rollback or resume guarantee.

---

## 8. Use-Case Orchestration

The sections include public lifecycle operations and explicitly identified supporting stages. Layer, Nuxt-configuration, module/framework and complex monorepo-composition intents remain Nuxt-owned.

### 8.1 General orchestration rules

<a id="dd-app-011"></a>

### DD-APP-011 — Authoritative context first

Managed-root context before App lifecycle work follows [Design](../appmanager-design-specification-v01.md#_9-6-project-discovery-and-context-resolution).

<a id="dd-app-012"></a>

### DD-APP-012 — Applicability before consequential execution

Pre-effect lifecycle applicability applies [FR-APP-011](../functional/app-functional-specification-v01.md#fr-app-011) and [FR-INV-015](../functional/application-invocation-functional-specification-v01.md#fr-inv-015) using the local applicability record, so known unmet preconditions are reported before delegated execution.

<a id="dd-app-013"></a>

### DD-APP-013 — Domain stages precede provider operations

Represent composed workflows with the [DD-APP-003 stage contract](#dd-app-003); delegated providers select concrete commands.

<a id="dd-app-014"></a>

### DD-APP-014 — Stage acceptance

App stage postcondition acceptance follows [Design](../appmanager-design-specification-v01.md#_11-11-workflow-results-failure-and-acceptance).

<a id="dd-app-015"></a>

### DD-APP-015 — Dependency-aware continuation

Prerequisite-dependent stages apply [FR-APP-113](../functional/app-functional-specification-v01.md#fr-app-113). Independent optional stages may continue only where the workflow explicitly permits that behaviour and the resulting partial state remains safe and accurately reportable.

### 8.2 Prepare existing application

The semantic flow is:

```text
resolved existing root application
        |
        v
assess lifecycle readiness
        |
        +--> dependency readiness, if required
        |       -> bounded lifecycle/process execution
        |
        +--> environment-definition readiness, if applicable
        |       -> Settings-owned environment operation
        |
        +--> managed repository relationship readiness, if required
        |       -> Git-domain operation
        |
        +--> approved optional development-environment artefacts
        |       -> appropriate registry/template/resource contracts
        |
        v
reassess required readiness/postconditions
        |
        v
App preparation interpretation
```

<a id="dd-app-016"></a>

### DD-APP-016 — Existing-project protection

Preparation of an existing root follows [FR-APP-014](../functional/app-functional-specification-v01.md#fr-app-014).

<a id="dd-app-017"></a>

### DD-APP-017 — Readiness-derived stage selection

Choose required or explicitly requested preparation stages using the project/profile and [FR-APP-024](../functional/app-functional-specification-v01.md#fr-app-024) for already-satisfied stages.

<a id="dd-app-018"></a>

### DD-APP-018 — Environment-definition delegation

During preparation, supply project/definition/example identity to [Settings FR-SET-060](../functional/settings-functional-specification-v01.md#fr-set-060); consume existing-definition protection from [FR-SET-061](../functional/settings-functional-specification-v01.md#fr-set-061). Sequence and interpret that result within the App readiness workflow.

<a id="dd-app-019"></a>

### DD-APP-019 — No secret-completeness fiction

Remaining sensitive-value readiness follows [FR-APP-017](../functional/app-functional-specification-v01.md#fr-app-017).

<a id="dd-app-020"></a>

### DD-APP-020 — Repository readiness delegation

Repository readiness during preparation follows [FR-APP-019](../functional/app-functional-specification-v01.md#fr-app-019).

<a id="dd-app-021"></a>

### DD-APP-021 — Preparation acceptance

Preparation acceptance is based on required lifecycle preparation postconditions, not whether every optional stage was attempted. Completed stages and unresolved user action use [FR-APP-022](../functional/app-functional-specification-v01.md#fr-app-022).

### 8.3 Post-installation lifecycle execution

This is subordinate stage behavior where a lifecycle requires it; it is not a public App use case.

<a id="dd-app-022"></a>

### DD-APP-022 — Declaration-derived action

Project-declared post-install selection follows [FR-APP-027](../functional/app-functional-specification-v01.md#fr-app-027).

<a id="dd-app-023"></a>

### DD-APP-023 — Post-install acceptance

Post-install evidence before stage acceptance follows [Design](../appmanager-design-specification-v01.md#_11-11-workflow-results-failure-and-acceptance).

### 8.4 Local development execution

<a id="dd-app-024"></a>

### DD-APP-024 — Long-running lifecycle operation

Development stage lifecycle and cancellation follows [FR-APP-030](../functional/app-functional-specification-v01.md#fr-app-030).

<a id="dd-app-025"></a>

### DD-APP-025 — Termination interpretation

Development termination interpretation follows [FR-APP-032](../functional/app-functional-specification-v01.md#fr-app-032).

### 8.5 Build

<a id="dd-app-026"></a>

### DD-APP-026 — Project-supported build intent

Resolve supported Build applicability through [FR-APP-035](../functional/app-functional-specification-v01.md#fr-app-035); output-layout expectations follow [FR-APP-037](../functional/app-functional-specification-v01.md#fr-app-037).

<a id="dd-app-027"></a>

### DD-APP-027 — Build acceptance

Build acceptance applies [FR-APP-036](../functional/app-functional-specification-v01.md#fr-app-036) to delegated execution and the resolved project/profile postconditions. Quality gates participate only when an approved App use case or configuration explicitly composes them.

<a id="dd-app-028"></a>

### DD-APP-028 — No incidental source-mutation authority

App-controlled Build source changes apply [FR-XFORM-014](../functional/source-transformation-functional-specification-v01.md#fr-xform-014).

### 8.6 Preview

<a id="dd-app-029"></a>

### DD-APP-029 — Preview prerequisite policy

Preview binds [FR-APP-040](../functional/app-functional-specification-v01.md#fr-app-040) through governed project/profile/configuration policy selecting validated prior build state, an App-composed build stage, or a project lifecycle action that establishes its own prerequisite failure. Caller projection follows [Design §4.6](../appmanager-design-specification-v01.md#_4-6-presentation-independence).

<a id="dd-app-030"></a>

### DD-APP-030 — Long-running preview interpretation

Long-running Preview lifecycle follows [FR-APP-030](../functional/app-functional-specification-v01.md#fr-app-030). Preview retains its own lifecycle identity and interprets termination under [FR-APP-032](../functional/app-functional-specification-v01.md#fr-app-032).

### 8.7 Clean

<a id="dd-app-031"></a>

### DD-APP-031 — Clean plan

Before mutation, Clean shall establish a bounded effect plan containing only resource classes classified as safely regenerable for Clean within the authoritative root scope.

<a id="dd-app-032"></a>

### DD-APP-032 — Already-clean semantics

Already-absent Clean targets follows [FR-APP-047](../functional/app-functional-specification-v01.md#fr-app-047).

<a id="dd-app-033"></a>

### DD-APP-033 — Clean exclusion

Clean exclusions follows [FR-APP-045](../functional/app-functional-specification-v01.md#fr-app-045).

### 8.8 Reset / Empty

<a id="dd-app-034"></a>

### DD-APP-034 — Reset plan

Reset establishes a bounded effect plan distinct from Clean. Resource classes follow [FR-APP-052](../functional/app-functional-specification-v01.md#fr-app-052) and [Design §9.9](../appmanager-design-specification-v01.md#_9-9-non-destructive-ownership-and-unmanaged-content), with explicit lock-state treatment under [DD-APP-035](#dd-app-035).

<a id="dd-app-035"></a>

### DD-APP-035 — Lock-state policy

Lock-state treatment shall be an explicit App-domain policy input derived from approved effective configuration/profile semantics. In the absence of an explicit policy permitting removal, lock state shall be retained.

<a id="dd-app-036"></a>

### DD-APP-036 — Consequential authorization

Bind Reset authorization to the material effect classes in [DD-APP-058](#dd-app-058) and [FR-INV-023](../functional/application-invocation-functional-specification-v01.md#fr-inv-023).

<a id="dd-app-037"></a>

### DD-APP-037 — Reset partial effects

Partial Reset effects follows [FR-APP-057](../functional/app-functional-specification-v01.md#fr-app-057).

### 8.9 Reset-and-prepare

A reset-and-prepare convenience flow composes canonical Reset and Prepare through the Application Engine. It has no independent command identity or parallel use-case implementation. A build stage is included only where selected under the [App composition policy](../functional/app-functional-specification-v01.md#fr-app-059).

```text
authorized reset -> reset accepted -> prepare -> preparation accepted
                                                   -> optional selected build
                                                   -> composed result
```

<a id="dd-app-038"></a>

### DD-APP-038 — Reuse, not reimplementation

Reset/Prepare and selected Build composition follows [FR-APP-059](../functional/app-functional-specification-v01.md#fr-app-059).

<a id="dd-app-039"></a>

### DD-APP-039 — Authorization before reset

Authorization before composed Reset follows [FR-APP-063](../functional/app-functional-specification-v01.md#fr-app-063).

<a id="dd-app-040"></a>

### DD-APP-040 — Stage dependency stop

Apply the lifecycle dependency rule [DD-APP-015](#dd-app-015) to Reset -> Prepare -> selected Build. An unsatisfied preparation prerequisite blocks dependent Build.

<a id="dd-app-041"></a>

### DD-APP-041 — Reset-and-prepare result composition

Reset-and-prepare stage results follows [FR-APP-064](../functional/app-functional-specification-v01.md#fr-app-064).

### 8.10 Create new root application

The semantic flow is:

```text
explicit creation intent
        |
        v
resolve target identity + effective creation inputs
        |
        v
validate target safety and profile coherence
        |
        v
construct bounded creation plan
        |
        +--> resolve/render declarative resources/templates
        +--> coordinate Nuxt-specific artefact semantics where required
        +--> coordinate documentation semantics where required
        |
        v
apply generated artefacts to valid creation target
        |
        +--> existing artefact encountered?
        |       -> transformation/safety boundary, not silent replacement
        |
        +--> optional Git-domain initialisation
        +--> optional dependency installation
        |
        v
validate creation postconditions
        |
        v
App creation interpretation + next actions
```

Creation includes the initial establishment stages required by its selected profile. It does not require the caller to invoke public Prepare separately to complete those creation postconditions. Optional Git/dependency follow-ons remain distinguishable in the creation result.

<a id="dd-app-042"></a>

### DD-APP-042 — Creation target safety

Classify the creation target using Resource Access/Managed Project evidence under [FR-APP-067](../functional/app-functional-specification-v01.md#fr-app-067), [FR-APP-068](../functional/app-functional-specification-v01.md#fr-app-068) and [FR-APP-069](../functional/app-functional-specification-v01.md#fr-app-069).

<a id="dd-app-043"></a>

### DD-APP-043 — Profile-driven artefact selection

Profile-derived creation artefact classes follows [FR-APP-071](../functional/app-functional-specification-v01.md#fr-app-071).

<a id="dd-app-044"></a>

### DD-APP-044 — Generation versus transformation

Creation versus existing-artefact transformation follows [Design](../appmanager-design-specification-v01.md#_6-8-generation-and-templates).

<a id="dd-app-045"></a>

### DD-APP-045 — Artefact semantic ownership

The creation plan identifies included artefact classes under [FR-APP-071](../functional/app-functional-specification-v01.md#fr-app-071). Nuxt facts, documentation models, registry rendering and persistence are consumed through their [capability bindings](#_6-consumed-dd-2-shared-capabilities).

<a id="dd-app-046"></a>

### DD-APP-046 — No implicit Nuxt-layer creation

Layer-ready structure during root creation follows [FR-APP-081](../functional/app-functional-specification-v01.md#fr-app-081).

<a id="dd-app-047"></a>

### DD-APP-047 — Optional Git follow-on isolation

Optional repository follow-on failure follows [FR-APP-084](../functional/app-functional-specification-v01.md#fr-app-084).

<a id="dd-app-048"></a>

### DD-APP-048 — Optional dependency-install isolation

Requested dependency installation follows [FR-APP-085](../functional/app-functional-specification-v01.md#fr-app-085)/[FR-APP-086](../functional/app-functional-specification-v01.md#fr-app-086); installation failure after scaffolding uses [DD-1.2](../dd_1_application_core/dd-1-2-execution-outcomes-detailed-design-v01.md#_14-partial-completion).

<a id="dd-app-049"></a>

### DD-APP-049 — Creation acceptance

Creation acceptance shall establish that the required artefact classes for the selected profile were created/accepted, the root application identity is coherent, and all mandatory creation stages satisfy their postconditions. Optional failed follow-on actions shall remain visible in the result.

### 8.11 Declared project-package-script execution

<a id="dd-app-050"></a>

### DD-APP-050 — Script discovery evidence

Script discovery remains read-only. Its evidence applies [FR-APP-092](../functional/app-functional-specification-v01.md#fr-app-092)/[FR-APP-093](../functional/app-functional-specification-v01.md#fr-app-093) with the selected identity model [DD-APP-009](#dd-app-009).

<a id="dd-app-051"></a>

### DD-APP-051 — Script validation

Declared-script validation before execution follows [FR-APP-094](../functional/app-functional-specification-v01.md#fr-app-094).

<a id="dd-app-052"></a>

### DD-APP-052 — Named lifecycle preference

The script collaborator follows the named-lifecycle preference in [FR-APP-095](../functional/app-functional-specification-v01.md#fr-app-095) and the prohibition on adding lifecycle semantics to generic script execution in [FR-APP-096](../functional/app-functional-specification-v01.md#fr-app-096).

<a id="dd-app-053"></a>

### DD-APP-053 — Bounded execution intent

After script validation, construct the bounded intent using [DD-2.2 structured arguments](../dd_2_shared_capabilities/dd-2-2-process-execution-detailed-design-v01.md#dd-proc-014) and its direct/shell boundary.

<a id="dd-app-054"></a>

### DD-APP-054 — Script result

Structured script results follows [FR-APP-098](../functional/app-functional-specification-v01.md#fr-app-098).


---

### 8.12 Generate {#generate}

`app.generate` applies [FR-APP-116](../functional/app-functional-specification-v01.md#fr-app-116) to the selected managed root. Resolve the supported generation mechanism from project evidence, use the existing applicability/stage contracts, delegate process mechanics and interpret the requested generation postcondition. The provider command is not the application identity.

## 9. Domain State and State Transitions

The App domain does not require a new persistent global lifecycle state machine in Version 1. Durable project state remains represented by managed resources, project metadata and specialist domain state.

App does require invocation-scoped workflow state for composed operations.

<a id="dd-app-055"></a>

### DD-APP-055 — Invocation-scoped lifecycle state

A composed App workflow shall track enough invocation-scoped state to distinguish:

```text
planned
ready
running
stage_satisfied
stage_failed
stage_cancelled
blocked_by_prerequisite
completed
```

These labels describe orchestration position and shall not replace canonical DD-1.2 outcome states.

<a id="dd-app-056"></a>

### DD-APP-056 — Evidence-backed transitions

Transitions between lifecycle stages shall be based on accepted stage evidence and authoritative cancellation/policy state rather than presentation events or provider-local state alone.

<a id="dd-app-057"></a>

### DD-APP-057 — No persisted workflow fiction

Unless a later approved requirement introduces resumable persisted workflows, App shall not imply that an interrupted in-memory lifecycle workflow can be resumed solely from an internal stage label. Recovery requires revalidation of actual project/resource state.

---

## 10. Domain Policy and Decision Rules

<a id="dd-app-058"></a>

### DD-APP-058 — Lifecycle action classification

App shall classify lifecycle actions by material effect sufficiently to distinguish:

- observational/non-consequential lifecycle selection;
- process/lifecycle execution;
- safely regenerable-state mutation;
- consequential reset mutation;
- new-target creation;
- existing-source transformation encountered during creation/lifecycle work.

This classification drives App policy and authorization checkpoints without replacing DD-1 authorization semantics.

<a id="dd-app-059"></a>

### DD-APP-059 — Root-only default

Existing-project lifecycle root target follows [FR-APP-005](../functional/app-functional-specification-v01.md#fr-app-005).

<a id="dd-app-060"></a>

### DD-APP-060 — Project declaration over universal command assumptions

Project-declared lifecycle selection uses [DD-APP-009](#dd-app-009), with effective project/profile inputs rather than provider-selected policy.

<a id="dd-app-061"></a>

### DD-APP-061 — Durable-resource preservation

Durable source/configuration in lifecycle operations applies [Design](../appmanager-design-specification-v01.md#_9-9-non-destructive-ownership-and-unmanaged-content).

<a id="dd-app-062"></a>

### DD-APP-062 — Optional-stage semantics

An optional stage shall be explicitly identified by profile, effective configuration or invocation intent. Optional consequential follow-on failures are interpreted under [FR-INV-036](../functional/application-invocation-functional-specification-v01.md#fr-inv-036).

<a id="dd-app-063"></a>

### DD-APP-063 — No implicit cross-domain expansion

Cross-domain stages selected by App intent/profile/configuration follows [Design](../appmanager-design-specification-v01.md#_10-11-cross-domain-workflows).


---

## 11. Safety, Mutation and Authorization

The permanent distinction is:

```text
recognition
    != selection
    != lifecycle intent
    != authorization
    != delegated execution
    != technical success
    != App-domain acceptance
    != final application success
```

<a id="dd-app-064"></a>

### DD-APP-064 — Mutation plan before consequential effect

Lifecycle effect planning uses the [creation plan](#dd-app-007), [Clean plan](#dd-app-031), [Reset plan](#dd-app-034) and [effect classification](#dd-app-058) before mutation.

<a id="dd-app-065"></a>

### DD-APP-065 — Scope containment

App-controlled resource effects follows [Design](../appmanager-design-specification-v01.md#_9-7-managed-scope-and-operation-targeting).

<a id="dd-app-066"></a>

### DD-APP-066 — Ambiguity fails safe

Ambiguous consequential target ownership follows [Design](../appmanager-design-specification-v01.md#_9-9-non-destructive-ownership-and-unmanaged-content).

<a id="dd-app-067"></a>

### DD-APP-067 — Authorization coverage

Material App plan expansion applies [DD-ENG-027](../dd_1_application_core/dd-1-5-application-engine-detailed-design-v01.md#dd-eng-027) before additional effects.

<a id="dd-app-068"></a>

### DD-APP-068 — Specialist mutation boundaries

Use [Source Transformation](../dd_2_shared_capabilities/dd-2-5-source-transformation-detailed-design-v01.md) for existing-source changes, [Settings FR-SET-060](../functional/settings-functional-specification-v01.md#fr-set-060) for environment persistence, and [Git](dd-3-2-git-domain-detailed-design-v01.md) for repository intent.

<a id="dd-app-069"></a>

### DD-APP-069 — Completed effects are facts

Completed App effects before a later stage failure uses [DD-1.2](../dd_1_application_core/dd-1-2-execution-outcomes-detailed-design-v01.md#_12-consequential-effects).


---

## 12. Failure, Cancellation and Partial Effects

<a id="dd-app-070"></a>

### DD-APP-070 — Cancellation before effect

Cancellation before a planned App effect uses [DD-1.2](../dd_1_application_core/dd-1-2-execution-outcomes-detailed-design-v01.md#_17-cancellation-model).

<a id="dd-app-071"></a>

### DD-APP-071 — Cancellation during delegated work

Delegated lifecycle cancellation and returned effects uses [DD-1.2](../dd_1_application_core/dd-1-2-execution-outcomes-detailed-design-v01.md#_17-cancellation-model).

<a id="dd-app-072"></a>

### DD-APP-072 — Failure blocks dependent stages

A failed/cancelled App stage uses the dependency rule [DD-APP-015](#dd-app-015).

<a id="dd-app-073"></a>

### DD-APP-073 — Partial-effect reporting

Mixed completed, failed, cancelled and unattempted stages uses [DD-1.2](../dd_1_application_core/dd-1-2-execution-outcomes-detailed-design-v01.md#_14-partial-completion).

<a id="dd-app-074"></a>

### DD-APP-074 — Retry requires revalidation

Retry, continuation or repair uses the [Engine stale-state checkpoint](../dd_1_application_core/dd-1-5-application-engine-detailed-design-v01.md#dd-eng-024) for project, configuration, resource/revision and lifecycle applicability. Prior stage success is not assumed durable where the underlying state may have changed.

<a id="dd-app-075"></a>

### DD-APP-075 — No universal rollback

App rollback claims versus forward/manual recovery uses [DD-1.2](../dd_1_application_core/dd-1-2-execution-outcomes-detailed-design-v01.md#_12-consequential-effects).


---

## 13. Headless and Interaction Independence

<a id="dd-app-076"></a>

### DD-APP-076 — Structured lifecycle intent

App lifecycle invocation through adapters follows [Design](../appmanager-design-specification-v01.md#_6-2-application-engine-authority).

<a id="dd-app-077"></a>

### DD-APP-077 — Structured decision requirements

Profile/target/authorization decisions use the [Application Invocation request contract](../dd_1_application_core/dd-1-1-application-invocation-detailed-design-v01.md); adapters acquire the structured input.

<a id="dd-app-078"></a>

### DD-APP-078 — Equivalent acceptance semantics

App policy and stage acceptance across interaction modes follows [Design](../appmanager-design-specification-v01.md#_4-6-presentation-independence).


---

## 14. Concurrency, Idempotency and Conflict Behaviour

<a id="dd-app-079"></a>

### DD-APP-079 — Conflicting lifecycle operations

The App domain shall treat concurrent operations as conflicting where their planned effects or required stable state overlap materially, including where one operation may invalidate another's project/resource assumptions.

Application-level conflict coordination remains under DD-1 Application Engine authority; capability-level stale-state evidence remains subordinate input.

<a id="dd-app-080"></a>

### DD-APP-080 — Stale-plan invalidation

Creation, Clean, Reset and other mutation plans use [DD-ENG-024](../dd_1_application_core/dd-1-5-application-engine-detailed-design-v01.md#dd-eng-024) when material target/resource evidence has changed since planning.

<a id="dd-app-081"></a>

### DD-APP-081 — Prepare idempotence

Already-satisfied preparation stages follows [FR-APP-024](../functional/app-functional-specification-v01.md#fr-app-024).

<a id="dd-app-082"></a>

### DD-APP-082 — Clean idempotence

Repeated Clean follows [FR-APP-047](../functional/app-functional-specification-v01.md#fr-app-047).

<a id="dd-app-083"></a>

### DD-APP-083 — Reset repeatability

Repeated Reset may encounter already-absent regenerable state. Absence alone is not failure, but lock-state policy, scope and durable-resource exclusions shall be re-evaluated each time.

<a id="dd-app-084"></a>

### DD-APP-084 — Creation is not generally idempotent

Root creation shall not treat an already-created or newly non-empty target as equivalent to the original empty/safe creation target. Repeated invocation requires fresh target classification and may be refused.

---

## 15. Security and Sensitive Information

<a id="dd-app-085"></a>

### DD-APP-085 — Environment sensitivity

Sensitive environment readiness during preparation follows [FR-APP-017](../functional/app-functional-specification-v01.md#fr-app-017).

<a id="dd-app-086"></a>

### DD-APP-086 — Process environment minimization

Lifecycle execution consumes [DD-2.2 environment contracts](../dd_2_shared_capabilities/dd-2-2-process-execution-detailed-design-v01.md#_11-environment-contract) and [DD-1.4 effective configuration](../dd_1_application_core/dd-1-4-configuration-resolution-detailed-design-v01.md#_15-resolution-result). Ambient secrets are not implicit lifecycle inputs.

<a id="dd-app-087"></a>

### DD-APP-087 — Creation secret exclusion

Secrets in generated shared artefacts follows [FR-APP-078](../functional/app-functional-specification-v01.md#fr-app-078).

<a id="dd-app-088"></a>

### DD-APP-088 — Diagnostic minimization

Stage/resource diagnostics and recovery information uses [DD-1.2](../dd_1_application_core/dd-1-2-execution-outcomes-detailed-design-v01.md#_24-sensitive-information-and-redaction).


---

## 16. Extensibility and Replaceability

<a id="dd-app-089"></a>

### DD-APP-089 — Lifecycle-provider replaceability

Replacement lifecycle providers follows [Design](../appmanager-design-specification-v01.md#_6-6-capability-boundaries-and-providers).

<a id="dd-app-090"></a>

### DD-APP-090 — New lifecycle actions

A future App lifecycle action may be added only where it represents coherent root-application lifecycle intent with a clear Functional owner. Availability of a new provider operation alone is insufficient justification.

<a id="dd-app-091"></a>

### DD-APP-091 — Creation-profile extensibility

Additional creation profiles or approved profile choices may extend the declarative profile model without requiring App to hard-code provider/template identities into lifecycle semantics.

<a id="dd-app-092"></a>

### DD-APP-092 — No generic orchestration framework requirement

App lifecycle stages apply the [shared-abstraction criterion](../dd_1_application_core/dd-1-5-application-engine-detailed-design-v01.md#dd-eng-046) within the existing DD-1/DD-2 ownership boundaries.


---

## 17. Testability and Conformance Requirements

The design shall permit independent verification of App-domain orchestration using controlled substitutes for subordinate domains and DD-2 capabilities.

At minimum, design-level tests shall be able to establish:

- lifecycle applicability from controlled managed-project/configuration evidence;
- stage sequencing and prerequisite blocking;
- provider/capability success not automatically becoming App success;
- preparation delegation to Settings without direct environment persistence bypass;
- Git readiness/follow-on delegation without duplicated repository policy;
- clean versus reset effect-class separation;
- lock-state policy behaviour;
- authorization before consequential reset/create effects;
- target ambiguity refusal;
- generation versus existing-source transformation distinction;
- creation partial failure after completed scaffold effects;
- declared-script validation and rejection of arbitrary shell identity;
- long-running development/preview cancellation interpretation;
- partial-effect and recovery-position reporting;
- Headless operation without presentation-only decisions;
- stale-plan/conflict revalidation;
- provider replacement without App semantic changes.

Concrete test files, frameworks, fixtures and mocks belong to Implementation Specifications.

---

## 18. Traceability

| Detailed Design contracts | Functional authority | Principal DD dependencies |
|---|---|---|
| `DD-APP-001`–`DD-APP-015` | `FR-APP-001`–`FR-APP-012`, `FR-APP-099`–`FR-APP-115` | DD-1 Invocation, Engine, Managed Project, Configuration, Outcomes |
| `DD-APP-016`–`DD-APP-021` | `FR-APP-013`–`FR-APP-024`; Settings `FR-SET-060`/`061` | Settings domain seam, Process Execution, Resource/Template contracts, Git domain |
| `DD-APP-022`–`DD-APP-025` | `FR-APP-025`–`FR-APP-033` | Process Execution, DD-1 Invocation/Outcomes |
| `DD-APP-026`–`DD-APP-030` | `FR-APP-034`–`FR-APP-042` | Process Execution, Source Transformation boundary, DD-1 Outcomes |
| `DD-APP-031`–`DD-APP-037` | `FR-APP-043`–`FR-APP-058` | Managed Project, Resource Access, DD-1 authorization/outcomes |
| `DD-APP-038`–`DD-APP-041` | `FR-APP-059`–`FR-APP-065` | Application Engine workflow authority; preceding App contracts |
| `DD-APP-042`–`DD-APP-049` | `FR-APP-066`–`FR-APP-090` | Registry/Template, Resource Access, Source Transformation, Nuxt/Docs/Git seams |
| `DD-APP-050`–`DD-APP-054` | `FR-APP-091`–`FR-APP-098` | Process Execution, project evidence, DD-1 Outcomes |
| `DD-APP-055`–`DD-APP-075` | `FR-APP-099`–`FR-APP-104`, `FR-APP-110`–`FR-APP-115` | Engine, Managed Project, Outcomes, Resource Access |
| `DD-APP-076`–`DD-APP-078` | `FR-APP-105`–`FR-APP-109` | Application Invocation, Application Engine |
| `DD-APP-079`–`DD-APP-092` | cross-cutting App requirements | DD-1 concurrency/scope/configuration; DD-2 stale-state/provider boundaries |

ADR-0001 permits Version 1 implementation using Node.js/TypeScript but does not require the conceptual App-domain contracts above to map one-to-one to TypeScript modules, classes or interfaces.

---

## 19. Conformance Invariants

A conforming App-domain design and implementation shall preserve all of the following.

<a id="dd-app-ci-001"></a>

### DD-APP-CI-001 — Lifecycle intent remains App-owned

Lifecycle identity uses [Design](../appmanager-design-specification-v01.md#_5-1-domain-oriented-command-model).

<a id="dd-app-ci-002"></a>

### DD-APP-CI-002 — Application authority remains above domain execution

App acceptance uses [Design](../appmanager-design-specification-v01.md#_11-11-workflow-results-failure-and-acceptance).

<a id="dd-app-ci-003"></a>

### DD-APP-CI-003 — Scope remains governed

Resource evidence uses [Design](../appmanager-design-specification-v01.md#_9-9-non-destructive-ownership-and-unmanaged-content).

<a id="dd-app-ci-004"></a>

### DD-APP-CI-004 — Configuration precedence is not recreated

Lifecycle inputs consume [DD-1.4](../dd_1_application_core/dd-1-4-configuration-resolution-detailed-design-v01.md).

<a id="dd-app-ci-005"></a>

### DD-APP-CI-005 — Settings owns environment persistence

Environment persistence uses [Settings FR-SET-060/061](../functional/settings-functional-specification-v01.md#fr-set-060).

<a id="dd-app-ci-006"></a>

### DD-APP-CI-006 — Clean and Reset remain distinct

Clean/Reset plans use [DD-APP-031](#dd-app-031), [DD-APP-034](#dd-app-034) and the explicit lock policy [DD-APP-035](#dd-app-035).

<a id="dd-app-ci-007"></a>

### DD-APP-CI-007 — Reset-and-prepare composes existing lifecycle semantics

Reset-and-prepare applies [FR-APP-059](../functional/app-functional-specification-v01.md#fr-app-059) and [FR-APP-062](../functional/app-functional-specification-v01.md#fr-app-062).

<a id="dd-app-ci-008"></a>

### DD-APP-CI-008 — Root creation is not layer creation

Root creation uses [FR-APP-070](../functional/app-functional-specification-v01.md#fr-app-070)/[FR-APP-081](../functional/app-functional-specification-v01.md#fr-app-081).

<a id="dd-app-ci-009"></a>

### DD-APP-CI-009 — Generation is not silent replacement

Creation/replacement uses [Design](../appmanager-design-specification-v01.md#_6-8-generation-and-templates).

<a id="dd-app-ci-010"></a>

### DD-APP-CI-010 — Repository semantics remain Git-owned

Repository readiness and creation follow-ons use [FR-APP-019](../functional/app-functional-specification-v01.md#fr-app-019)/[FR-APP-083](../functional/app-functional-specification-v01.md#fr-app-083).

<a id="dd-app-ci-011"></a>

### DD-APP-CI-011 — Declared-script execution is bounded

Declared-script support uses [DD-APP-009](#dd-app-009) and [FR-APP-094](../functional/app-functional-specification-v01.md#fr-app-094).

<a id="dd-app-ci-012"></a>

### DD-APP-CI-012 — Provider completion is evidence

Provider evidence uses [Design](../appmanager-design-specification-v01.md#_11-11-workflow-results-failure-and-acceptance).

<a id="dd-app-ci-013"></a>

### DD-APP-CI-013 — Partial effects remain observable

App partial effects use [DD-1.2](../dd_1_application_core/dd-1-2-execution-outcomes-detailed-design-v01.md#_12-consequential-effects) and [DD-1.2](../dd_1_application_core/dd-1-2-execution-outcomes-detailed-design-v01.md#_14-partial-completion).

<a id="dd-app-ci-014"></a>

### DD-APP-CI-014 — Interaction modes share semantics

Caller projections use [Design](../appmanager-design-specification-v01.md#_4-6-presentation-independence).

<a id="dd-app-ci-015"></a>

### DD-APP-CI-015 — Implementation topology remains open

App topology follows the [Documentation Guide](../project-documentation-guide-v01.md#_8-level-4-implementation-specification); no one-service/class/package/process mapping is required.


---

## 20. Implementation Specification Boundary

This Detailed Design deliberately stops before concrete code-component decomposition.

After DD-3 and DD-4 are complete and the DD-5 Detailed Design conformance audit passes, DD-6 / Implementation Specification planning may map these contracts to:

- concrete Node.js/TypeScript modules;
- source paths and package layout;
- exported interfaces, classes and functions;
- package-manager recognition and command mappings;
- concrete lifecycle-action adapters;
- clean/reset filesystem target resolvers;
- creation-profile schemas and registry files;
- concrete template/resource bindings;
- dependency-injection/wiring choices;
- process, filesystem, Git and Nuxt provider implementations;
- concrete tests, fixtures and build/runtime integration.

Those implementation decisions shall realise the contracts in this document without redefining their semantic ownership or authority boundaries.
