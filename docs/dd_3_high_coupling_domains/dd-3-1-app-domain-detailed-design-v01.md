# DD-3.1 — AppManager App Domain Detailed Design

> **Detailed Design ID:** DD-3.1
>
> **Design family:** DD-3 — High-Coupling Domains

> **Status:** Version 1 Detailed Design Specification
>
> **Detailed Design authority:** This document defines the permanent domain-specific orchestration, policy, state, decision and result contracts by which AppManager realises root-application lifecycle and root-application creation use cases through the DD-1 Application Core and DD-2 Shared Capability contracts.
>
> **Governing sources:** [Project Documentation Guide](../project-documentation-guide-v01.md), [AppManager Design Specification](../appmanager-design-specification-v01.md), [docs/functional/app-functional-specification-v01.md](../functional/app-functional-specification-v01.md), [docs/functional/app-settings-environment-definition-ownership-canonical specification-v01.md](../functional/app-functional-specification-v01.md#fr-app-016), accepted ADRs, and the normative DD-1/DD-2 Detailed Designs.
>
> **Authoring controls:** [Detailed Design Register](../project_management/detailed-design-register-v01.md), [docs/project_management/domain-detailed-design-authoring-guide-v02.md](../project_management/domain-detailed-design-authoring-guide-v02.md), [docs/project_management/dd2-final-horizontal-reconciliation-conformance-closeout-v01.md](../project_management/dd2-final-horizontal-reconciliation-conformance-closeout-v01.md)

---

## 1. Purpose

This specification defines the permanent internal App-domain design for root-application lifecycle intent and root-application creation.

The App domain composes authoritative Application Core context and shared specialist capabilities into coherent lifecycle use cases. It owns the domain-specific sequencing, applicability, policy, acceptance and recovery meaning of those use cases without becoming a second owner of managed scope, effective configuration, process mechanics, repository semantics, Nuxt semantics, Settings persistence, template rendering, source transformation or canonical application outcomes.

The governing rule is:

> **The App domain owns root-application lifecycle composition; the capabilities it coordinates own their bounded specialist semantics, and the Application Engine retains final application authority.**

A second rule is:

> **An App use case is defined by lifecycle intent and postconditions, not by a particular package-manager command, process invocation, source path, template implementation or provider.**

---

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

A `LifecycleStageResult` shall preserve enough information to distinguish:

```text
stage identity
status/evidence under DD-1.2 semantics
completed effects
skipped/already-satisfied reason
remaining action
diagnostics
recovery relevance
```

The stage result does not create a second generic outcome taxonomy.

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

Clean and Reset shall operate on App-domain resource classes rather than acquiring deletion authority from arbitrary discovered paths.

The classification shall distinguish at least:

- safely regenerable cache/build state eligible for Clean;
- regenerable installation/build state potentially eligible for Reset;
- lock state whose treatment is explicit policy;
- durable source/configuration/project metadata excluded by default;
- unrelated or ambiguous resources excluded from mutation authority.

Concrete filesystem paths belong to later implementation design/provider evidence.

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

Existing-project App use cases shall begin from an Engine-established execution context containing a resolved managed root application, operation-specific scope and effective configuration sufficient for the use case.

The App domain shall not substitute current working directory, adapter selection, discovered files or provider defaults for authoritative context.

<a id="dd-app-012"></a>

### DD-APP-012 — Applicability before consequential execution

Before consequential effects, the App domain shall determine whether the requested lifecycle action is applicable to the authoritative project context.

A recognised but unsupported or unsatisfied action shall produce structured unavailability/precondition evidence rather than degrade into an opaque provider failure where the condition can be established beforehand.

<a id="dd-app-013"></a>

### DD-APP-013 — Domain stages precede provider operations

Composed App workflows shall be defined in lifecycle stages and delegated intents. Provider commands are selected below the domain boundary.

<a id="dd-app-014"></a>

### DD-APP-014 — Stage acceptance

A stage is accepted only when its domain-specific postcondition is satisfied. Successful technical execution alone is insufficient where additional evidence or validation is required.

<a id="dd-app-015"></a>

### DD-APP-015 — Dependency-aware continuation

A stage shall not execute when an unsatisfied earlier stage is a prerequisite for it. Independent optional stages may continue only where the workflow explicitly permits that behaviour and the resulting partial state remains safe and accurately reportable.

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

Preparation shall treat the target as an existing managed application. It shall not invoke root-application scaffold semantics over that project.

<a id="dd-app-017"></a>

### DD-APP-017 — Readiness-derived stage selection

Preparation shall select only lifecycle preparation stages required or explicitly requested for the resolved project/profile. Already-satisfied stages should not be destructively repeated where their semantics permit safe recognition.

<a id="dd-app-018"></a>

### DD-APP-018 — Environment-definition delegation

Where environment-definition readiness requires creation of a missing persisted definition from an approved example/default source, App shall delegate the persisted operation to Settings according to [Settings environment-definition requirements](../functional/settings-functional-specification-v01.md#fr-set-060).

App shall not implement an alternate direct-copy path that bypasses Settings protection semantics.

<a id="dd-app-019"></a>

### DD-APP-019 — No secret-completeness fiction

App preparation shall distinguish successful creation/management of an environment definition from full environment readiness. Missing required sensitive values shall remain explicit remaining action and shall not be fabricated.

<a id="dd-app-020"></a>

### DD-APP-020 — Repository readiness delegation

Where repository relationships must be prepared for development readiness, App shall coordinate the relevant Git-domain use case. Repository mechanics or Git-domain policy shall not be recreated as App lifecycle stages.

<a id="dd-app-021"></a>

### DD-APP-021 — Preparation acceptance

Preparation acceptance shall be based on required lifecycle preparation postconditions, not on whether every optional stage was attempted. The result shall expose completed stages and unresolved required user action.

### 8.3 Post-installation lifecycle execution

This is subordinate stage behavior where a lifecycle requires it; it is not a public App use case.

<a id="dd-app-022"></a>

### DD-APP-022 — Declaration-derived action

Post-installation execution shall require recognised project evidence that identifies the applicable project-declared lifecycle action. The App domain shall not assume one universal script identity.

<a id="dd-app-023"></a>

### DD-APP-023 — Post-install acceptance

The App domain shall interpret normalized process/lifecycle evidence and any required postcondition evidence before accepting the post-install stage.

### 8.4 Local development execution

<a id="dd-app-024"></a>

### DD-APP-024 — Long-running lifecycle operation

Development execution shall be modelled as a potentially long-running App lifecycle stage with progress/event forwarding and cancellation linkage through DD-1/DD-2 contracts.

<a id="dd-app-025"></a>

### DD-APP-025 — Termination interpretation

Termination shall be interpreted using invocation cancellation state, process termination evidence and App lifecycle context. A provider exit/termination representation shall not directly become the App outcome.

### 8.5 Build

<a id="dd-app-026"></a>

### DD-APP-026 — Project-supported build intent

Build shall require recognised project/configuration evidence that the managed root supports an applicable build lifecycle action. The App domain shall not prescribe a universal build command or output directory.

<a id="dd-app-027"></a>

### DD-APP-027 — Build acceptance

Build acceptance shall require successful delegated execution plus any App-owned postcondition explicitly required by the resolved project/profile. Quality gates are not implicitly part of Build unless an approved App use case or configuration explicitly composes them.

<a id="dd-app-028"></a>

### DD-APP-028 — No incidental source-mutation authority

Build does not authorize AppManager-controlled mutation of unrelated existing source. Any deliberate source mutation shall pass through the applicable Source Transformation authority.

### 8.6 Preview

<a id="dd-app-029"></a>

### DD-APP-029 — Preview prerequisite policy

The App domain shall deterministically define, from governed project/profile/configuration semantics, whether preview requires a validated prior build state, an App-composed build stage, or delegation to a project lifecycle action that establishes its own prerequisite failure.

The selected policy shall not be inferred ad hoc from presentation mode.

<a id="dd-app-030"></a>

### DD-APP-030 — Long-running preview interpretation

Long-running preview shall use the same DD-1/DD-2 cancellation and process-evidence boundaries as development execution while retaining Preview-specific lifecycle identity.

### 8.7 Clean

<a id="dd-app-031"></a>

### DD-APP-031 — Clean plan

Before mutation, Clean shall establish a bounded effect plan containing only resource classes classified as safely regenerable for Clean within the authoritative root scope.

<a id="dd-app-032"></a>

### DD-APP-032 — Already-clean semantics

An absent approved Clean target may be accepted as already satisfied. Absence of an expected target shall become a failure only where it contradicts a required project invariant.

<a id="dd-app-033"></a>

### DD-APP-033 — Clean exclusion

Installed dependency state, lock state, durable user source, project metadata, repositories and unrelated resources shall be excluded from Clean unless a future approved Clean requirement explicitly changes that classification.

### 8.8 Reset / Empty

<a id="dd-app-034"></a>

### DD-APP-034 — Reset plan

Reset shall establish a bounded effect plan distinct from Clean. It may include approved regenerable dependency-installation and build state, but shall exclude durable source/configuration and unrelated resources by default.

<a id="dd-app-035"></a>

### DD-APP-035 — Lock-state policy

Lock-state treatment shall be an explicit App-domain policy input derived from approved effective configuration/profile semantics. In the absence of an explicit policy permitting removal, lock state shall be retained.

<a id="dd-app-036"></a>

### DD-APP-036 — Consequential authorization

The material Reset effect classes shall be known before the authorization checkpoint. The App domain shall require the Engine/invocation authorization state appropriate to those effects before delegating mutation.

<a id="dd-app-037"></a>

### DD-APP-037 — Reset partial effects

If Reset stops after some effects have completed, the App result shall identify completed, unattempted and failed effect classes. No universal rollback shall be implied.

### 8.9 Reset-and-prepare

A reset-and-prepare convenience flow composes canonical Reset and Prepare through the Application Engine. It has no independent command identity or parallel use-case implementation. A build stage is included only where selected under the [App composition policy](../functional/app-functional-specification-v01.md#fr-app-059).

```text
authorized reset -> reset accepted -> prepare -> preparation accepted
                                                   -> optional selected build
                                                   -> composed result
```

<a id="dd-app-038"></a>

### DD-APP-038 — Reuse, not reimplementation

The Engine composes the existing Reset and Prepare intents and, where selected, Build. Each stage retains its own policy and acceptance contract.

<a id="dd-app-039"></a>

### DD-APP-039 — Authorization before reset

Authorization covering the Reset effect plan shall be obtained before the first consequential reset effect. Later non-destructive stages do not retroactively authorize Reset.

<a id="dd-app-040"></a>

### DD-APP-040 — Stage dependency stop

Failure or cancellation of Reset stops dependent Prepare and any selected Build. Failure or cancellation of Prepare stops a selected Build whose preparation prerequisites remain unsatisfied.

<a id="dd-app-041"></a>

### DD-APP-041 — Reset-and-prepare result composition

The App result shall retain stage-by-stage evidence sufficient to distinguish failure before mutation, failure after reset, preparation failure, build failure, cancellation and complete success.

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

Before consequential creation, the App domain shall establish the intended target identity/location and obtain Resource Access/Managed Project evidence sufficient to classify the target as safe, unsafe or ambiguous for the selected creation mode.

An existing recognised project shall not be silently scaffolded over. Ambiguous non-empty targets shall fail safe or require an explicitly approved safe mode.

<a id="dd-app-043"></a>

### DD-APP-043 — Profile-driven artefact selection

The selected creation profile shall determine approved artefact classes and optional setup choices through declarative project/profile semantics rather than hidden template implementation switches.

<a id="dd-app-044"></a>

### DD-APP-044 — Generation versus transformation

Creating a previously absent artefact in an approved creation target uses generation/resource-creation semantics. Modifying or replacing an existing artefact crosses into Source Transformation and applicable authorization/preservation semantics.

<a id="dd-app-045"></a>

### DD-APP-045 — Artefact semantic ownership

The App domain owns inclusion of an artefact class in the root-application creation plan but does not automatically own the artefact's specialist content semantics.

Examples:

- Nuxt-specific configuration/scaffold semantics remain Nuxt-owned;
- documentation composition semantics remain Documentation/Docs-owned where delegated as such;
- registry/template rendering remains DD-2-owned;
- persistence remains Resource Access-owned.

<a id="dd-app-046"></a>

### DD-APP-046 — No implicit Nuxt-layer creation

Root creation may prepare a layers container or relationship-ready structure but shall not claim or perform Nuxt-layer creation unless a distinct Nuxt-domain use case is explicitly invoked.

<a id="dd-app-047"></a>

### DD-APP-047 — Optional Git follow-on isolation

Optional repository initialisation shall be a coordinated Git-domain follow-on. If it fails after scaffold acceptance, the created scaffold remains an actual completed effect and the result shall report the repository failure separately.

<a id="dd-app-048"></a>

### DD-APP-048 — Optional dependency-install isolation

Dependency installation may follow successful scaffold creation when requested. Scaffold success shall not be retroactively erased by installation failure; the overall App result may be partial according to canonical outcome semantics.

<a id="dd-app-049"></a>

### DD-APP-049 — Creation acceptance

Creation acceptance shall establish that the required artefact classes for the selected profile were created/accepted, the root application identity is coherent, and all mandatory creation stages satisfy their postconditions. Optional failed follow-on actions shall remain visible in the result.

### 8.11 Declared project-package-script execution

<a id="dd-app-050"></a>

### DD-APP-050 — Script discovery evidence

Eligible script identities shall come from recognised managed-root package metadata or another approved project declaration source. Script discovery is read-only evidence and does not authorize arbitrary command execution.

<a id="dd-app-051"></a>

### DD-APP-051 — Script validation

The requested script identity shall match an eligible declared script before Process Execution is delegated.

<a id="dd-app-052"></a>

### DD-APP-052 — Named lifecycle preference

Where the selected script corresponds to an App-owned named lifecycle intent such as Build, Preview or Develop, the canonical named lifecycle use case remains the richer semantic route. Generic declared-script execution shall not silently acquire the named lifecycle's additional stages or policies.

<a id="dd-app-053"></a>

### DD-APP-053 — Bounded execution intent

After validation, the App domain shall construct a bounded project-script execution intent from project/profile semantics. Arbitrary caller-supplied shell fragments shall not be appended merely because the process provider supports shell execution.

<a id="dd-app-054"></a>

### DD-APP-054 — Script result

The App-specific result shall identify the selected declared script and interpret normalized execution evidence without requiring terminal-output parsing.

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

Existing-project App lifecycle effects target the managed root application by default. Managed layers do not inherit equivalent clean/reset/install/build effects merely because they are related to the root.

<a id="dd-app-060"></a>

### DD-APP-060 — Project declaration over universal command assumptions

Where a lifecycle action is project-declared, App policy shall use recognised project/profile/configuration evidence to identify it. Provider defaults shall not silently establish App lifecycle semantics.

<a id="dd-app-061"></a>

### DD-APP-061 — Durable-resource preservation

Clean, Reset, Prepare and Reset-and-prepare shall preserve durable user-authored source, user-managed project configuration and unrelated project resources unless the invoked use case has explicit approved authority over a particular resource.

<a id="dd-app-062"></a>

### DD-APP-062 — Optional-stage semantics

An optional stage shall be explicitly identified as optional by profile, effective configuration or invocation intent. Failure of an optional consequential follow-on may produce partial success rather than pretending either complete success or total non-effect.

<a id="dd-app-063"></a>

### DD-APP-063 — No implicit cross-domain expansion

App shall not add Git, Nuxt, Docs, Quality, AI or Settings operations merely because their capabilities are available. Cross-domain coordination requires an App Functional requirement, selected profile/configuration choice or explicit invocation intent that makes the subordinate operation part of the App workflow.

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

Clean, Reset, root creation and any App workflow that deliberately changes existing resources shall establish the bounded intended effect set or effect classes before the relevant consequential mutation begins.

<a id="dd-app-065"></a>

### DD-APP-065 — Scope containment

Every App-controlled resource mutation shall remain within authoritative operation scope. A path/resource discovered outside scope shall be excluded regardless of name similarity.

<a id="dd-app-066"></a>

### DD-APP-066 — Ambiguity fails safe

Where the App domain cannot establish that a candidate consequential target belongs to the authorized effect set and scope, it shall refuse that effect or require approved disambiguation rather than infer authority from accessibility.

<a id="dd-app-067"></a>

### DD-APP-067 — Authorization coverage

Authorization evidence shall cover the material effect class actually planned. Material expansion of the effect set after authorization requires re-evaluation and, where required by DD-1 policy, renewed authorization before the additional effect.

<a id="dd-app-068"></a>

### DD-APP-068 — Specialist mutation boundaries

App shall delegate mutation mechanics to the applicable DD-2 capability or subordinate domain. It shall not bypass Source Transformation for deliberate existing-source modification, Settings for environment-definition persistence, or Git for repository-policy operations.

<a id="dd-app-069"></a>

### DD-APP-069 — Completed effects are facts

After mutation completes, App shall preserve effect evidence even if a later stage fails or is cancelled. Later failure shall not cause the result to claim that completed effects did not occur.

---

## 12. Failure, Cancellation and Partial Effects

<a id="dd-app-070"></a>

### DD-APP-070 — Cancellation before effect

When cancellation is accepted before a planned consequential effect begins, the App workflow shall not intentionally start that effect.

<a id="dd-app-071"></a>

### DD-APP-071 — Cancellation during delegated work

Cancellation shall propagate through the applicable DD-1/DD-2 contract. App shall interpret the returned termination/effect evidence rather than assume that cancellation restored pre-operation state.

<a id="dd-app-072"></a>

### DD-APP-072 — Failure blocks dependent stages

A failed or cancelled stage shall block every later stage whose preconditions depend on its acceptance.

<a id="dd-app-073"></a>

### DD-APP-073 — Partial-effect reporting

Where completed effects coexist with failed, cancelled or unattempted stages, the App result shall retain enough structured stage/effect evidence for DD-1.2 to represent the actual partial outcome.

<a id="dd-app-074"></a>

### DD-APP-074 — Retry requires revalidation

Retry, continuation or repair after failure shall revalidate relevant managed-project, configuration, resource/revision and lifecycle applicability evidence. Prior stage success shall not be assumed durable where underlying state may have changed.

<a id="dd-app-075"></a>

### DD-APP-075 — No universal rollback

No App lifecycle use case implies universal rollback unless a later approved design defines transactional semantics for that specific effect set. Recovery information shall distinguish rollback capability from manual or forward repair.

---

## 13. Headless and Interaction Independence

<a id="dd-app-076"></a>

### DD-APP-076 — Structured lifecycle intent

All supported App lifecycle use cases shall be expressible through the Application Invocation Contract without embedding business logic in TUI menus, GUI flows or IDE actions.

<a id="dd-app-077"></a>

### DD-APP-077 — Structured decision requirements

Where App requires a profile choice, target disambiguation, authorization or other caller decision, the requirement shall be represented as structured invocation/policy information. Interactive adapters may collect that information, but the domain shall not depend on prompting.

<a id="dd-app-078"></a>

### DD-APP-078 — Equivalent acceptance semantics

The same authoritative scope, configuration, policy, stage acceptance and outcome interpretation shall apply across TUI, Headless, GUI, IDE, CI and automation invocation.

---

## 14. Concurrency, Idempotency and Conflict Behaviour

<a id="dd-app-079"></a>

### DD-APP-079 — Conflicting lifecycle operations

The App domain shall treat concurrent operations as conflicting where their planned effects or required stable state overlap materially, including where one operation may invalidate another's project/resource assumptions.

Application-level conflict coordination remains under DD-1 Application Engine authority; capability-level stale-state evidence remains subordinate input.

<a id="dd-app-080"></a>

### DD-APP-080 — Stale-plan invalidation

A creation, Clean, Reset or other mutation plan shall be revalidated before application when material target/resource evidence has changed since planning.

<a id="dd-app-081"></a>

### DD-APP-081 — Prepare idempotence

Prepare should treat valid already-satisfied preparation stages as satisfied rather than destructively recreating them. This does not permit stale evidence to bypass validation.

<a id="dd-app-082"></a>

### DD-APP-082 — Clean idempotence

Repeated Clean over already-absent approved regenerable targets may complete as already satisfied/no-op under DD-1.2 semantics.

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

App preparation shall not expose or fabricate sensitive environment values. Settings and Configuration sensitive-value contracts remain authoritative for persisted definitions and effective configuration respectively.

<a id="dd-app-086"></a>

### DD-APP-086 — Process environment minimization

When App delegates lifecycle execution, only the environment/context required by the bounded execution intent should be supplied according to Process Execution and Configuration contracts. Ambient host secrets shall not be treated as implicit App lifecycle inputs.

<a id="dd-app-087"></a>

### DD-APP-087 — Creation secret exclusion

Shared generated project artefacts shall not receive secret values merely because effective configuration contains them. Template/render inputs shall be purpose-bounded and respect sensitive-value classification.

<a id="dd-app-088"></a>

### DD-APP-088 — Diagnostic minimization

App-specific diagnostics and recovery information shall identify failed lifecycle stages and relevant resource/effect classes without unnecessarily projecting sensitive values, credentials or provider-native secret-bearing payloads.

---

## 16. Extensibility and Replaceability

<a id="dd-app-089"></a>

### DD-APP-089 — Lifecycle-provider replaceability

Replacement of package-manager/process/resource/template/Nuxt/repository providers shall not alter canonical App lifecycle identities, policy or acceptance semantics.

<a id="dd-app-090"></a>

### DD-APP-090 — New lifecycle actions

A future App lifecycle action may be added only where it represents coherent root-application lifecycle intent with a clear Functional owner. Availability of a new provider operation alone is insufficient justification.

<a id="dd-app-091"></a>

### DD-APP-091 — Creation-profile extensibility

Additional creation profiles or approved profile choices may extend the declarative profile model without requiring App to hard-code provider/template identities into lifecycle semantics.

<a id="dd-app-092"></a>

### DD-APP-092 — No generic orchestration framework requirement

Repeated stage shapes across App, Git, Nuxt or Docs do not require a shared domain-orchestration base framework. Any future abstraction must demonstrate genuinely shared semantics not already owned by DD-1/DD-2.

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

Root-application lifecycle semantics shall not be derived from provider commands, presentation routes or implementation filenames.

<a id="dd-app-ci-002"></a>

### DD-APP-CI-002 — Application authority remains above domain execution

App-domain interpretation shall remain subject to DD-1 Application Engine final acceptance and DD-1.2 canonical outcome semantics.

<a id="dd-app-ci-003"></a>

### DD-APP-CI-003 — Scope remains governed

App shall not derive mutation authority from filesystem accessibility, discovery, repository membership or path-name similarity.

<a id="dd-app-ci-004"></a>

### DD-APP-CI-004 — Configuration precedence is not recreated

App shall consume effective configuration rather than reconstructing competing precedence from raw sources.

<a id="dd-app-ci-005"></a>

### DD-APP-CI-005 — Settings owns environment persistence

App preparation shall use the Settings-owned environment-definition operation and shall not create a competing persistence path.

<a id="dd-app-ci-006"></a>

### DD-APP-CI-006 — Clean and Reset remain distinct

Clean shall remain limited to safely regenerable cache/build state; Reset may be broader only under explicit policy and authorization while preserving durable resources by default.

<a id="dd-app-ci-007"></a>

### DD-APP-CI-007 — Reset-and-prepare composes existing lifecycle semantics

Reset-and-prepare shall not become an independent alternate implementation of Reset, Prepare or Build.

<a id="dd-app-ci-008"></a>

### DD-APP-CI-008 — Root creation is not layer creation

Root-application creation shall not absorb Nuxt-layer creation semantics.

<a id="dd-app-ci-009"></a>

### DD-APP-CI-009 — Generation is not silent replacement

Creation of absent artefacts shall remain distinct from modification/replacement of existing resources, which requires the applicable transformation/safety boundary.

<a id="dd-app-ci-010"></a>

### DD-APP-CI-010 — Repository semantics remain Git-owned

Optional repository initialisation/readiness work shall not create App-owned Git policy or provider semantics.

<a id="dd-app-ci-011"></a>

### DD-APP-CI-011 — Declared-script execution is bounded

The supporting script collaborator uses DD-APP-009 and DD-APP-050 through DD-APP-054; it does not extend the App command catalogue.

<a id="dd-app-ci-012"></a>

### DD-APP-CI-012 — Provider completion is evidence

Process, resource, template, repository, Nuxt or other provider success shall not independently establish App lifecycle success.

<a id="dd-app-ci-013"></a>

### DD-APP-CI-013 — Partial effects remain observable

Completed effects shall remain represented when later stages fail or are cancelled; no false atomicity or universal rollback shall be implied.

<a id="dd-app-ci-014"></a>

### DD-APP-CI-014 — Interaction modes share semantics

TUI, Headless, GUI, IDE, CI and automation shall not acquire independent App lifecycle policy.

<a id="dd-app-ci-015"></a>

### DD-APP-CI-015 — Implementation topology remains open

This design shall not be interpreted as requiring one App service, lifecycle class, orchestrator class, package, process or source module per documented responsibility.

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
