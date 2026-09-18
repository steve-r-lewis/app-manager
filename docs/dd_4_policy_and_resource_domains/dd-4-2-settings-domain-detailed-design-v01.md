# DD-4.2 — AppManager Settings Domain Detailed Design

> **Detailed Design ID:** DD-4.2
>
> **Design family:** DD-4 — Policy and Resource Domains
>
> **Status:** Version 1 Detailed Design Specification
>
> **Detailed Design authority:** This document defines the permanent Settings-domain orchestration, settings-scope policy, metadata/resource-management decisions, state and result contracts for explicit AppManager settings, managed-project metadata, environment definitions, contributors, licence resources and declarative template resources through approved DD-1 Application Core and DD-2 Shared Capability contracts. It refines, but does not override, the root Design Specification, Functional Specifications, accepted clarifications, ADRs, DD-1 or DD-2 Detailed Designs.
>
> **Governing sources:** [Project Documentation Guide](../project-documentation-guide-v01.md), [AppManager Design Specification](../appmanager-design-specification-v01.md), [Settings Functional Specification](../functional/settings-functional-specification-v01.md), [App / Settings Environment-Definition Ownership — App Functional Specification](../functional/app-functional-specification-v01.md#fr-app-016), [Detailed Design Register](../project_management/detailed-design-register-v01.md), [Domain Detailed Design Authoring Guide](../project_management/domain-detailed-design-authoring-guide-v02.md), [ADR-0001 — Primary Application Runtime](../project_management/decisions/adr-0001-primary-application-runtime.md)
>
> **Related Detailed Design authorities:** [DD-1.1 — Application Invocation](../dd_1_application_core/dd-1-1-application-invocation-detailed-design-v01.md), [DD-1.2 — Execution Outcomes](../dd_1_application_core/dd-1-2-execution-outcomes-detailed-design-v01.md), [DD-1.3 — Managed Project](../dd_1_application_core/dd-1-3-managed-project-detailed-design-v01.md), [DD-1.4 — Configuration Resolution](../dd_1_application_core/dd-1-4-configuration-resolution-detailed-design-v01.md), [DD-1.5 — Application Engine](../dd_1_application_core/dd-1-5-application-engine-detailed-design-v01.md), [DD-2.1 — Resource Access](../dd_2_shared_capabilities/dd-2-1-resource-access-detailed-design-v01.md), [DD-2.3 — Repository Capability](../dd_2_shared_capabilities/dd-2-3-repository-capability-detailed-design-v01.md), [DD-2.4 — Source Intelligence](../dd_2_shared_capabilities/dd-2-4-source-intelligence-detailed-design-v01.md), [DD-2.5 — Source Transformation](../dd_2_shared_capabilities/dd-2-5-source-transformation-detailed-design-v01.md), [DD-2.6 — Resource Registry and Template](../dd_2_shared_capabilities/dd-2-6-resource-registry-and-template-detailed-design-v01.md), [DD-3.1 — App Domain](../dd_3_high_coupling_domains/dd-3-1-app-domain-detailed-design-v01.md), [DD-3.2 — Git Domain](../dd_3_high_coupling_domains/dd-3-2-git-domain-detailed-design-v01.md), [DD-3.3 — Nuxt Domain](../dd_3_high_coupling_domains/dd-3-3-nuxt-domain-detailed-design-v01.md), [DD-3.4 — Docs Domain](../dd_3_high_coupling_domains/dd-3-4-docs-domain-detailed-design-v01.md)

---

## 1. Purpose

This specification defines the permanent domain-level composition by which AppManager inspects and manages supported settings, metadata and declarative resources without allowing persistence mechanisms, configuration sources, registries, parsers or neighbouring domains to acquire Settings application authority.

The governing rules are:

> **Settings owns explicit settings and metadata-management intent, semantic setting/resource scope, operation-specific validation and Settings-domain acceptance; Configuration Resolution owns how configuration candidates become effective values; the Application Engine retains final application authority.**

> **Persistence is not precedence: changing a durable value does not redefine configuration applicability, precedence, provenance or already-resolved runtime behaviour.**

> **Resource management is not resource execution: registering, adding or deleting a declarative resource does not transfer the domain semantics of applying that resource into Settings.**

> **AppManager operator identity, managed-project metadata and managed resources are distinct semantic scopes even where their records contain similarly named fields.**

---

## 2. Scope

This design owns permanent Settings-domain contracts for:

- Settings operation identity and applicability;
- semantic setting, metadata and resource scope;
- AppManager/user settings inspection and explicit mutation;
- separation of persisted values from effective configuration;
- managed-project author, funding, bug-reporting, repository and application metadata management;
- persisted environment-definition CRUD semantics;
- contributor metadata management;
- licence-resource management and optional metadata synchronization;
- declarative template-resource listing, addition and deletion;
- validation and no-op interpretation;
- output/effect authorization for consequential Settings operations;
- preservation and replacement policy supplied to shared mutation capabilities;
- cross-domain delegation and composition;
- multi-effect partial outcomes;
- cancellation, concurrency and stale-write interpretation;
- deterministic Headless behavior;
- sensitive-value handling;
- domain-specific result payloads beneath DD-1.2 outcomes.

This design does not own configuration-source precedence, managed-project discovery, Git repository effects, automatic version derivation, documentation generation, AI-document execution semantics, Nuxt semantics, generic source transformation, generic persistence mechanics, legal advice, arbitrary executable plugins, or concrete storage schemas/file paths/parsers/classes/services.

---

## 3. Governing Requirements and Authorities

The Settings Functional Specification defines `FR-SET-001`–`FR-SET-116`. This Detailed Design binds those requirements as follows:

| Functional area | Requirements | Detailed Design focus |
|---|---|---|
| Domain boundary | `FR-SET-001`–`005` | intent, authority and delegated-capability boundary |
| Common Settings behaviour | `FR-SET-006`–`021` | invocation, validation, authorization, preservation and acceptance |
| Scope and identity | `FR-SET-022`–`030` | semantic scope and persisted/effective distinction |
| Author metadata | `FR-SET-031`–`037` | field-level metadata policy |
| Funding/bugs/repository metadata | `FR-SET-038`–`044` | metadata validation and repository-fact boundary |
| Application metadata | `FR-SET-045`–`057` | bounded metadata updates and coupled licence state |
| Environment definitions | `FR-SET-058`–`071` | persisted environment CRUD and Configuration separation |
| Contributors | `FR-SET-072`–`080` | contributor identity and collection preservation |
| Licences | `FR-SET-081`–`090` | catalogue/resource/metadata composition |
| Templates | `FR-SET-091`–`100` | class-aware declarative resource management |
| Cross-domain coordination | `FR-SET-101`–`107` | ownership-preserving delegation |
| Results and safety | `FR-SET-108`–`116` | failure, partial effects, concurrency, sensitivity and ambiguity |

The App / Settings Environment-Definition Ownership Clarification is normative for the App-initialisation seam: App owns lifecycle intent and sequencing; Settings owns persisted environment-definition CRUD; Configuration remains separate.

<a id="dd-set-001"></a>

**DD-SET-001 — Functional ownership is preserved**

The resource workflows refine [FR-SET-101](../functional/settings-functional-specification-v01.md#fr-set-101) while preserving the complete Settings Functional surface.

<a id="dd-set-002"></a>

**DD-SET-002 — Configuration authority is preserved**

Persisted-resource management binds [FR-CONFIG-075](../functional/configuration-functional-specification-v01.md#fr-config-075) to [DD-1.4 resolution](../dd_1_application_core/dd-1-4-configuration-resolution-detailed-design-v01.md).

<a id="dd-set-003"></a>

**DD-SET-003 — Capability evidence remains subordinate**

Settings acceptance of parser, renderer, registry, persistence and transformation evidence follows [Design](../appmanager-design-specification-v01.md#_11-11-workflow-results-failure-and-acceptance).


---

## 4. Domain Responsibility and Authority Boundary

Settings owns:

- semantic identity of Settings operations;
- semantic scope of a setting, metadata record or managed resource;
- field/resource applicability and Settings-specific validation policy;
- read versus create/set/update/add/remove/delete intent;
- operation-specific preservation, collision and replacement policy;
- whether coupled Settings effects are required by the selected operation;
- interpretation of delegated persistence/transformation/resource evidence;
- Settings-level no-op, partial and recovery semantics;
- Settings-specific sensitive presentation policy beyond common redaction rules.

Authority retained elsewhere includes:

- invocation normalization and adapter projection — DD-1.1;
- canonical outcomes/diagnostics/effects/cancellation — DD-1.2;
- managed-project identity and managed scope — DD-1.3;
- effective configuration and provenance — DD-1.4;
- final application coordination/acceptance — DD-1.5;
- resource mechanics — DD-2.1;
- repository facts/effects — DD-2.3/DD-3.2;
- source recognition — DD-2.4;
- bounded mutation and source-validity evidence — DD-2.5;
- registry/template mechanics — DD-2.6;
- App lifecycle — DD-3.1;
- Nuxt and Docs intent — DD-3.3/DD-3.4.

```text
normalized invocation
        |
        v
Application Engine
        |
        +--> DD-1.3 managed project / scope
        +--> DD-1.4 effective configuration where needed
        v
Settings intent / semantic scope / policy
        |
        +--> read/recognition evidence
        +--> DD-2.6 registry/template evidence
        +--> DD-2.1 creation/resource mechanics
        +--> DD-2.5 bounded existing-resource mutation
        +--> DD-2.3 repository facts only where relevant
        v
Settings interpretation / per-effect result
        |
        v
Application Engine acceptance -> DD-1.2 outcome
```

This diagram expresses authority and dependency, not mandatory implementation topology.

<a id="dd-set-004"></a>

**DD-SET-004 — Metadata is not operational authority**

Metadata operations bind [FR-SET-101](../functional/settings-functional-specification-v01.md#fr-set-101) to their consuming domain; repository and automatic-versioning boundaries are specified by [FR-SET-042](../functional/settings-functional-specification-v01.md#fr-set-042) and [FR-SET-048](../functional/settings-functional-specification-v01.md#fr-set-048).

<a id="dd-set-005"></a>

**DD-SET-005 — Resource management is not execution authority**

Declarative resource management follows [FR-SET-098](../functional/settings-functional-specification-v01.md#fr-set-098).


---

## 5. Consumed DD-1 Application Core Contracts

Settings composes DD-1 rather than recreating it.

<a id="dd-set-006"></a>

**DD-SET-006 — Invocation binding**

Settings consumes [DD-1.1 invocation](../dd_1_application_core/dd-1-1-application-invocation-detailed-design-v01.md) under [Design](../appmanager-design-specification-v01.md#_4-6-presentation-independence).

<a id="dd-set-007"></a>

**DD-SET-007 — Outcome binding**

Settings result evidence composes [DD-1.2 outcomes](../dd_1_application_core/dd-1-2-execution-outcomes-detailed-design-v01.md#_7-outcome-contract).

<a id="dd-set-008"></a>

**DD-SET-008 — Managed-project binding**

Project-scoped operations bind [Design](../appmanager-design-specification-v01.md#_9-6-project-discovery-and-context-resolution) and [Design](../appmanager-design-specification-v01.md#_9-7-managed-scope-and-operation-targeting) to DD-1.3.

<a id="dd-set-009"></a>

**DD-SET-009 — Configuration binding**

Settings uses [DD-1.4 resolution results](../dd_1_application_core/dd-1-4-configuration-resolution-detailed-design-v01.md#_15-resolution-result) for effective policy; persisted/effective distinction follows [FR-SET-029](../functional/settings-functional-specification-v01.md#fr-set-029).

<a id="dd-set-010"></a>

**DD-SET-010 — Application Engine binding**

Settings coordination and acceptance follows [Design](../appmanager-design-specification-v01.md#_6-2-application-engine-authority).


---

## 6. Consumed DD-2 Shared Capabilities

Settings coordinates shared capabilities only where required by the selected operation.

<a id="dd-set-011"></a>

**DD-SET-011 — Resource Access composition**

The resource effects in §8 use [DD-2.1](../dd_2_shared_capabilities/dd-2-1-resource-access-detailed-design-v01.md) under [Design](../appmanager-design-specification-v01.md#_6-6-capability-boundaries-and-providers).

<a id="dd-set-012"></a>

**DD-SET-012 — Source Intelligence composition**

Metadata/environment recognition uses [DD-2.4](../dd_2_shared_capabilities/dd-2-4-source-intelligence-detailed-design-v01.md) under [Design](../appmanager-design-specification-v01.md#_9-9-non-destructive-ownership-and-unmanaged-content).

<a id="dd-set-013"></a>

**DD-SET-013 — Source Transformation composition**

Settings existing-artefact intents bind [FR-XFORM-033](../functional/source-transformation-functional-specification-v01.md#fr-xform-033) to DD-2.5 with preservation constraints and approved target scope.

<a id="dd-set-014"></a>

**DD-SET-014 — Registry and Template composition**

Licence/template contributions consume [DD-2.6](../dd_2_shared_capabilities/dd-2-6-resource-registry-and-template-detailed-design-v01.md) under [Design](../appmanager-design-specification-v01.md#_6-8-generation-and-templates).

<a id="dd-set-015"></a>

**DD-SET-015 — Repository evidence composition**

Repository facts from DD-2.3 inform [FR-SET-043](../functional/settings-functional-specification-v01.md#fr-set-043); effects remain bounded by [FR-SET-042](../functional/settings-functional-specification-v01.md#fr-set-042).

<a id="dd-set-016"></a>

**DD-SET-016 — Capability selection is operation-relative**  
Settings shall not require every operation to pass through every shared capability merely because multiple resource classes are supported by the domain.

---

## 7. Domain Contract Model

### 7.1 Settings operation identity

Version 1 Settings operation identities include semantic families for:

- inspect/set/update/unset AppManager settings;
- inspect/update managed-project metadata;
- create/read/set/unset/delete environment definitions/entries;
- list/add/remove contributors;
- create/delete licence resources and explicitly coupled licence metadata;
- list/add/delete declarative template resources.

<a id="dd-set-017"></a>

**DD-SET-017 — Semantic operation identity precedes storage mechanics**  
An operation shall be identified by Settings intent and semantic target, not by a filename, JSON key, parser method or provider command.

### 7.2 Semantic scope

A Settings target shall distinguish at least:

- AppManager/user setting;
- managed-project setting;
- managed-project metadata;
- persisted environment-definition source;
- managed declarative resource.

<a id="dd-set-018"></a>

**DD-SET-018 — Scope is explicit**

Bind Settings scope under [FR-SET-022](../functional/settings-functional-specification-v01.md#fr-set-022) before consequential work.

<a id="dd-set-019"></a>

**DD-SET-019 — Similar field shapes do not collapse scopes**

Operator and project identity follow [FR-SET-023](../functional/settings-functional-specification-v01.md#fr-set-023); contributor collection identity uses [DD-SET-032](#dd-set-032).

<a id="dd-set-020"></a>

**DD-SET-020 — Persisted and effective values are distinct**

The result model exposes [FR-SET-029](../functional/settings-functional-specification-v01.md#fr-set-029).

### 7.3 Domain result payload

A Settings result may carry:

- operation identity;
- semantic target/scope;
- before-state evidence where safely exposable;
- requested value/resource identity;
- validation decision;
- delegated effect evidence;
- after-state/verification evidence;
- no-op reason;
- partial-effect detail;
- warnings and sensitivity/redaction metadata;
- stale/conflict/indeterminate evidence.

<a id="dd-set-021"></a>

**DD-SET-021 — Sensitive result projection**

Sensitive state in the result model follows [FR-SET-017](../functional/settings-functional-specification-v01.md#fr-set-017) and the reveal boundary in [DD-SET-057](#dd-set-057).


---

## 8. Use-Case Orchestration

### 8.1 Common flow

A consequential Settings use case shall conceptually perform:

```text
resolve invocation/context
 -> resolve semantic Settings target
 -> establish managed scope where project-scoped
 -> acquire fresh bounded current-state evidence
 -> validate requested value/resource and operation policy
 -> determine no-op/collision/replacement state
 -> obtain required authorization
 -> delegate bounded create/transformation/deletion mechanics
 -> verify/normalize resulting evidence where applicable
 -> interpret Settings postconditions
 -> return domain evidence for Application Engine acceptance
```

<a id="dd-set-022"></a>

**DD-SET-022 — Read paths terminate before mutation**

Read/list paths apply [FR-SET-012](../functional/settings-functional-specification-v01.md#fr-set-012) and [FR-SET-115](../functional/settings-functional-specification-v01.md#fr-set-115) rather than normalizing or repairing discovered content implicitly.

<a id="dd-set-023"></a>

**DD-SET-023 — Validation precedes intended mutation**

Settings validation applies [FR-SET-014](../functional/settings-functional-specification-v01.md#fr-set-014) and [FR-SET-015](../functional/settings-functional-specification-v01.md#fr-set-015) before persistence.

### 8.2 AppManager settings

<a id="dd-set-024"></a>

**DD-SET-024 — Durable preference change is prospective**

Durable preference changes apply [FR-CONFIG-051](../functional/configuration-functional-specification-v01.md#fr-config-051) to operation snapshots.

### 8.3 Managed-project metadata

<a id="dd-set-025"></a>

**DD-SET-025 — Field-bounded metadata update**

Field/item updates apply [FR-SET-115](../functional/settings-functional-specification-v01.md#fr-set-115) and [Design](../appmanager-design-specification-v01.md#_9-9-non-destructive-ownership-and-unmanaged-content).

<a id="dd-set-026"></a>

**DD-SET-026 — Repository metadata remains declarative**

Repository metadata changes apply [FR-SET-042](../functional/settings-functional-specification-v01.md#fr-set-042).

### 8.4 Environment definitions

<a id="dd-set-027"></a>

**DD-SET-027 — Environment source is explicit**

Environment source selection applies [FR-SET-059](../functional/settings-functional-specification-v01.md#fr-set-059).

<a id="dd-set-028"></a>

**DD-SET-028 — Create protection**

Environment creation applies [FR-SET-061](../functional/settings-functional-specification-v01.md#fr-set-061).

<a id="dd-set-029"></a>

**DD-SET-029 — Entry-bounded update**

Environment set/unset binds [FR-SET-065](../functional/settings-functional-specification-v01.md#fr-set-065) and [FR-SET-066](../functional/settings-functional-specification-v01.md#fr-set-066) to the selected source; preservation follows [Design](../appmanager-design-specification-v01.md#_7-10-non-destructive-transformation).

<a id="dd-set-030"></a>

**DD-SET-030 — Runtime environment remains separate**

Persisted environment effects apply [FR-SET-070](../functional/settings-functional-specification-v01.md#fr-set-070).

<a id="dd-set-031"></a>

**DD-SET-031 — App initialisation delegates, it does not duplicate**

App preparation consumes the environment operation in [FR-SET-060](../functional/settings-functional-specification-v01.md#fr-set-060) and [FR-SET-061](../functional/settings-functional-specification-v01.md#fr-set-061) through [FR-SET-102](../functional/settings-functional-specification-v01.md#fr-set-102).

### 8.5 Contributors

<a id="dd-set-032"></a>

**DD-SET-032 — Contributor identity is unambiguous**  
Add/remove operations shall use sufficient contributor identity to avoid accidental mutation of another entry.

<a id="dd-set-033"></a>

**DD-SET-033 — Duplicate contributor policy**

Contributor equivalence applies [FR-SET-077](../functional/settings-functional-specification-v01.md#fr-set-077).

### 8.6 Licences

<a id="dd-set-034"></a>

**DD-SET-034 — Licence identity precedes rendering/creation**

Licence creation binds [FR-SET-083](../functional/settings-functional-specification-v01.md#fr-set-083) to the resolved Settings target.

<a id="dd-set-035"></a>

**DD-SET-035 — Licence text provenance matters**

Licence text comes through the registry/provider collaboration under [FR-SET-084](../functional/settings-functional-specification-v01.md#fr-set-084).

<a id="dd-set-036"></a>

**DD-SET-036 — Coupled licence effects are explicit**

Coupled licence effects apply [FR-SET-057](../functional/settings-functional-specification-v01.md#fr-set-057) and [FR-SET-086](../functional/settings-functional-specification-v01.md#fr-set-086). Represent both intended effects before execution and evaluate their individual states afterward.

### 8.7 Declarative templates

<a id="dd-set-037"></a>

**DD-SET-037 — Template class is explicit**

Template add/delete binds [FR-SET-096](../functional/settings-functional-specification-v01.md#fr-set-096) and [FR-SET-097](../functional/settings-functional-specification-v01.md#fr-set-097) to the selected class/item.

<a id="dd-set-038"></a>

**DD-SET-038 — Aggregate listing is read-only composition**

Aggregate template summaries apply [FR-SET-094](../functional/settings-functional-specification-v01.md#fr-set-094) and [FR-SET-095](../functional/settings-functional-specification-v01.md#fr-set-095).

<a id="dd-set-039"></a>

**DD-SET-039 — No generic executable extension**

Declarative template management follows [Design](../appmanager-design-specification-v01.md#_13-2-extension-classes).


---

## 9. Domain State and State Transitions

A Settings operation may conceptually move through:

```text
context-resolved
 -> semantic-target-resolved
 -> current-state-observed
 -> proposed-change-validated
 -> effect-classified
 -> authorized
 -> effect-in-progress
 -> effect-observed
 -> settings-postconditions-interpreted
 -> accepted | rejected | unchanged | partial | cancelled | indeterminate
```

<a id="dd-set-040"></a>

**DD-SET-040 — State progression does not manufacture authority**

Settings states describe the operation under [Design](../appmanager-design-specification-v01.md#_9-7-managed-scope-and-operation-targeting); they do not enlarge the supplied authority.

<a id="dd-set-041"></a>

**DD-SET-041 — No-op is first-class**

Equivalent updates and absent-key removal apply [FR-SET-016](../functional/settings-functional-specification-v01.md#fr-set-016) and [FR-SET-067](../functional/settings-functional-specification-v01.md#fr-set-067).

<a id="dd-set-042"></a>

**DD-SET-042 — Multi-effect state is per effect**

Coupled effects use [DD-SET-036](#dd-set-036) and [DD-1.2 partial completion](../dd_1_application_core/dd-1-2-execution-outcomes-detailed-design-v01.md#_14-partial-completion).

<a id="dd-set-043"></a>

**DD-SET-043 — Observation and mutation revisions remain distinguishable**  
Where a mutation is based on prior content, the operation shall retain enough revision/precondition evidence to detect supported stale-write conflicts.

---

## 10. Domain Policy and Decision Rules

<a id="dd-set-044"></a>

**DD-SET-044 — Applicability is semantic**  
A field/resource is eligible only when supported by the selected Settings operation and target model; physical presence alone is insufficient.

<a id="dd-set-045"></a>

**DD-SET-045 — Unsupported is not absent**  
An unsupported metadata field, resource class or environment syntax shall not be silently represented as merely unset.

<a id="dd-set-046"></a>

**DD-SET-046 — Effective configuration is queried, not inferred**

Effective values use [DD-1.4 resolution results](../dd_1_application_core/dd-1-4-configuration-resolution-detailed-design-v01.md#_15-resolution-result); provenance follows [FR-CONFIG-045](../functional/configuration-functional-specification-v01.md#fr-config-045).

<a id="dd-set-047"></a>

**DD-SET-047 — Manual version setting does not own derivation policy**

Manual version setting applies [FR-SET-048](../functional/settings-functional-specification-v01.md#fr-set-048) and [FR-SET-049](../functional/settings-functional-specification-v01.md#fr-set-049).

<a id="dd-set-048"></a>

**DD-SET-048 — External reachability is evidence-dependent**

Repository/bug URL reachability follows [FR-SET-044](../functional/settings-functional-specification-v01.md#fr-set-044). Funding URLs shall likewise not be claimed reachable without approved capability evidence.

<a id="dd-set-049"></a>

**DD-SET-049 — Licence suitability is outside Settings authority**

Licence catalogue/creation results apply [FR-SET-090](../functional/settings-functional-specification-v01.md#fr-set-090).

<a id="dd-set-050"></a>

**DD-SET-050 — Template ownership survives management**

Template management follows [FR-SET-098](../functional/settings-functional-specification-v01.md#fr-set-098).


---

## 11. Safety, Mutation, and Authorization

<a id="dd-set-051"></a>

**DD-SET-051 — Inspection is non-mutating**

Read/list/inspect behavior applies [FR-SET-012](../functional/settings-functional-specification-v01.md#fr-set-012).

<a id="dd-set-052"></a>

**DD-SET-052 — Mutation intent is explicit**

Mutation intent follows [FR-SET-012](../functional/settings-functional-specification-v01.md#fr-set-012).

<a id="dd-set-053"></a>

**DD-SET-053 — Consequential authorization is operation-relative**

Deletion/replacement and other consequential effects consume [FR-INV-023](../functional/application-invocation-functional-specification-v01.md#fr-inv-023) before execution.

<a id="dd-set-054"></a>

**DD-SET-054 — Mutation is target-bounded**

Selected setting/resource effects bind [FR-SET-115](../functional/settings-functional-specification-v01.md#fr-set-115) to the approved scope; expressly coupled effects follow [DD-SET-036](#dd-set-036).

<a id="dd-set-055"></a>

**DD-SET-055 — Existing-resource replacement is not implicit**

Creation collisions apply [FR-SET-061](../functional/settings-functional-specification-v01.md#fr-set-061), [FR-SET-085](../functional/settings-functional-specification-v01.md#fr-set-085) and [Design](../appmanager-design-specification-v01.md#_9-9-non-destructive-ownership-and-unmanaged-content) for template items.

<a id="dd-set-056"></a>

**DD-SET-056 — Indirection does not escape scope**  
Symlinks, aliases, registry references or provider-resolved paths shall not allow a Settings operation to mutate outside the approved resource boundary.

<a id="dd-set-057"></a>

**DD-SET-057 — Secret reveal is not implied by management authority**  
Permission to set, unset or inspect the existence of a sensitive value does not imply permission to emit its plaintext value.

---

## 12. Failure, Cancellation, and Partial Effects

<a id="dd-set-058"></a>

**DD-SET-058 — Failure is stage-attributable**

Failures apply [FR-SET-108](../functional/settings-functional-specification-v01.md#fr-set-108); recognition, registry/provider and verification stages remain distinguishable where material.

<a id="dd-set-059"></a>

**DD-SET-059 — Partial completion is first-class**

Multi-effect Settings completion uses [DD-1.2 partial completion](../dd_1_application_core/dd-1-2-execution-outcomes-detailed-design-v01.md#_14-partial-completion).

<a id="dd-set-060"></a>

**DD-SET-060 — No universal rollback claim**

Settings rollback claims apply [FR-INV-046](../functional/application-invocation-functional-specification-v01.md#fr-inv-046).

<a id="dd-set-061"></a>

**DD-SET-061 — Cancellation stops future effects**

Settings cancellation applies [FR-SET-111](../functional/settings-functional-specification-v01.md#fr-set-111) and [DD-1.2 cancellation propagation](../dd_1_application_core/dd-1-2-execution-outcomes-detailed-design-v01.md#_17-cancellation-model).

<a id="dd-set-062"></a>

**DD-SET-062 — Cancellation preserves completed effects**

Completed Settings effects apply [FR-INV-045](../functional/application-invocation-functional-specification-v01.md#fr-inv-045).

<a id="dd-set-063"></a>

**DD-SET-063 — Indeterminate effect requires verification**  
If persistence may have occurred but completion cannot be established reliably, the operation shall report indeterminate state and recovery/verification guidance rather than guess success or failure.

---

## 13. Headless and Interaction Independence

<a id="dd-set-064"></a>

**DD-SET-064 — One semantic contract across adapters**

Settings adapters apply [Design](../appmanager-design-specification-v01.md#_4-6-presentation-independence).

<a id="dd-set-065"></a>

**DD-SET-065 — Interactive selection is presentation**

Setting/resource/source/value choice acquisition applies [FR-INV-019](../functional/application-invocation-functional-specification-v01.md#fr-inv-019) to the §7 intent model.

<a id="dd-set-066"></a>

**DD-SET-066 — Headless ambiguity fails safely**

Unresolved Settings inputs apply [FR-SET-116](../functional/settings-functional-specification-v01.md#fr-set-116) and [FR-INV-020](../functional/application-invocation-functional-specification-v01.md#fr-inv-020) for Headless execution.

<a id="dd-set-067"></a>

**DD-SET-067 — Machine-consumable sensitivity**

Headless redaction/presence evidence applies [FR-INV-021](../functional/application-invocation-functional-specification-v01.md#fr-inv-021) and [FR-SET-017](../functional/settings-functional-specification-v01.md#fr-set-017) under the reveal boundary in [DD-SET-057](#dd-set-057).


---

## 14. Concurrency, Idempotency, and Conflict Behaviour

<a id="dd-set-068"></a>

**DD-SET-068 — Consequential preconditions are revalidated**  
Where practical, stale-sensitive mutations shall revalidate relevant target/revision/existence preconditions immediately before effect execution.

<a id="dd-set-069"></a>

**DD-SET-069 — Equivalent updates are repeatable**  
Repeating a materially equivalent set/update/add request should converge to unchanged or the same semantic state rather than accumulate unintended duplicate effects.

<a id="dd-set-070"></a>

**DD-SET-070 — Collection identity prevents duplicates**

Collection identity binds [FR-SET-054](../functional/settings-functional-specification-v01.md#fr-set-054) for keywords, [FR-SET-077](../functional/settings-functional-specification-v01.md#fr-set-077) for contributors and [FR-SET-093](../functional/settings-functional-specification-v01.md#fr-set-093) for template classes; class-appropriate identity/equivalence shall also prevent accidental registry-item duplication.

<a id="dd-set-071"></a>

**DD-SET-071 — Concurrent change is not silently overwritten**

Concurrent target changes apply [FR-XFORM-068](../functional/source-transformation-functional-specification-v01.md#fr-xform-068) and [FR-XFORM-069](../functional/source-transformation-functional-specification-v01.md#fr-xform-069).

<a id="dd-set-072"></a>

**DD-SET-072 — Coupled effects do not imply transactions**

Coupled licence-resource/metadata intent in [DD-SET-036](#dd-set-036) applies [FR-INV-046](../functional/application-invocation-functional-specification-v01.md#fr-inv-046).


---

## 15. Security and Sensitive Information

<a id="dd-set-073"></a>

**DD-SET-073 — Sensitivity follows data, not storage format**  
Sensitive classification shall survive normalization, parsing, result projection and diagnostics regardless of whether the value came from a settings store, environment definition or other approved source.

<a id="dd-set-074"></a>

**DD-SET-074 — Secret values are minimized**

Plaintext secrets in output, logs, diagnostics, provenance and effect summaries apply [FR-SET-017](../functional/settings-functional-specification-v01.md#fr-set-017) and [DD-1.2 sensitive-information handling](../dd_1_application_core/dd-1-2-execution-outcomes-detailed-design-v01.md#_24-sensitive-information-and-redaction).

<a id="dd-set-075"></a>

**DD-SET-075 — Untrusted resource content remains data**  
Environment content, metadata strings, licence/template resources and provider-returned content shall not acquire authority to redefine AppManager commands, policy, scope or configuration.

<a id="dd-set-076"></a>

**DD-SET-076 — External resource acquisition is bounded**  
Where a catalogue/provider obtains declarative material externally, trust/provenance and applicable disclosure/network policy shall remain explicit; acquired content does not bypass validation or authorization.

<a id="dd-set-077"></a>

**DD-SET-077 — Diagnostics preserve usefulness without disclosure**

Sensitive key/resource/stage diagnostics apply [FR-INV-040](../functional/application-invocation-functional-specification-v01.md#fr-inv-040).


---

## 16. Extensibility and Replaceability

<a id="dd-set-078"></a>

**DD-SET-078 — Storage/provider replaceability**

Storage/parser/registry/licence/resource provider substitution applies [FR-SET-004](../functional/settings-functional-specification-v01.md#fr-set-004) and [Design](../appmanager-design-specification-v01.md#_6-6-capability-boundaries-and-providers).

<a id="dd-set-079"></a>

**DD-SET-079 — Registry classes remain specialised**

Licence, AI, Docs, Nuxt and other resource classes apply [FR-SET-095](../functional/settings-functional-specification-v01.md#fr-set-095) when consuming DD-2.6 infrastructure.

<a id="dd-set-080"></a>

**DD-SET-080 — New setting/resource classes require defined ownership**  
A new class may be introduced only when its semantic scope, validation, mutation and consuming-domain ownership are sufficiently defined.

<a id="dd-set-081"></a>

**DD-SET-081 — No generic domain framework from shape similarity**  
Repeated CRUD terminology or similarly shaped metadata records shall not justify a universal domain base service/request/result abstraction.

<a id="dd-set-082"></a>

**DD-SET-082 — Implementation topology remains open**

Concrete Settings service/package/process/adapter/registry/source-layout decisions follow [the Implementation Specification boundary](../project-documentation-guide-v01.md#_8-level-4-implementation-specification).


---

## 17. Testability and Conformance Requirements

Settings conformance shall be testable using deterministic substitutes for DD-1/DD-2 dependencies.

Tests shall cover at least:

- semantic scope distinction between operator identity and project author metadata;
- persisted versus effective configuration distinction;
- supported/unsupported/absent field states;
- invalid value rejection without prior-value loss;
- no-op updates;
- field-bounded metadata preservation;
- repository metadata without Git effects;
- environment source ambiguity and existing-definition protection;
- environment set/unset preservation and secret redaction;
- App initialisation delegation through the Settings environment contract;
- contributor duplicate prevention and bounded removal;
- licence identity/provenance, existing-resource protection and partial coupled effects;
- template class identity, aggregate read-only listing and exact deletion;
- source-transformation stale conflict handling;
- cancellation with completed prior effects;
- Headless ambiguity and adapter equivalence;
- provider substitution without semantic change.

<a id="dd-set-083"></a>

**DD-SET-083 — Domain policy is independently testable**  
Settings orchestration/policy shall be testable with capability substitutes without requiring live external catalogues or one concrete storage technology.

<a id="dd-set-084"></a>

**DD-SET-084 — Provider tests do not define the contract**  
Integration tests for concrete parsers, stores, licence sources or registries may verify adapter behavior below the boundary but shall not redefine Settings semantics.

<a id="dd-set-085"></a>

**DD-SET-085 — Ownership-boundary tests are mandatory design evidence**  
Conformance testing shall verify that Settings does not acquire configuration precedence, Git effects, App lifecycle, template execution or legal-decision authority and that composing domains do not duplicate Settings-owned environment/resource semantics.

---

## 18. Traceability

| Functional requirements | Primary DD-4.2 contracts |
|---|---|
| `FR-SET-001`–`005` | `DD-SET-001`–`005`, `DD-SET-017` |
| `FR-SET-006`–`021` | `DD-SET-006`–`016`, `DD-SET-021`–`023`, `DD-SET-051`–`063` |
| `FR-SET-022`–`030` | `DD-SET-018`–`020`, `DD-SET-024`, `DD-SET-046` |
| `FR-SET-031`–`037` | `DD-SET-019`, `DD-SET-023`, `DD-SET-025`, `DD-SET-044`–`045` |
| `FR-SET-038`–`044` | `DD-SET-015`, `DD-SET-026`, `DD-SET-048` |
| `FR-SET-045`–`057` | `DD-SET-025`, `DD-SET-034`–`036`, `DD-SET-047`, `DD-SET-059`, `DD-SET-072` |
| `FR-SET-058`–`071` | `DD-SET-027`–`031`, `DD-SET-046`, `DD-SET-057`, `DD-SET-073`–`074` |
| `FR-SET-072`–`080` | `DD-SET-032`–`033`, `DD-SET-069`–`070` |
| `FR-SET-081`–`090` | `DD-SET-034`–`036`, `DD-SET-049`, `DD-SET-055`, `DD-SET-059`, `DD-SET-072` |
| `FR-SET-091`–`100` | `DD-SET-014`, `DD-SET-037`–`039`, `DD-SET-050`, `DD-SET-079`–`080` |
| `FR-SET-101`–`107` | `DD-SET-004`–`005`, `DD-SET-031`, `DD-SET-047`, `DD-SET-050` |
| `FR-SET-108`–`116` | `DD-SET-051`–`077` |

Cross-authority traceability:

- DD-1.1: invocation and adapter equivalence — `DD-SET-006`, `064`–`067`;
- DD-1.2: canonical outcome/effect semantics — `DD-SET-007`, `021`, `058`–`063`;
- DD-1.3: managed-project/scope authority — `DD-SET-008`, `018`, `054`, `056`;
- DD-1.4: configuration/effective-value authority — `DD-SET-002`, `009`, `020`, `024`, `046`;
- DD-1.5: final application authority — `DD-SET-003`, `010`;
- DD-2.1: bounded resource mechanics — `DD-SET-011`, `034`–`036`, `055`;
- DD-2.4/DD-2.5: recognition/transformation — `DD-SET-012`–`013`, `023`, `025`, `068`, `071`;
- DD-2.6: registries/templates — `DD-SET-014`, `034`–`039`, `079`;
- DD-2.3/DD-3.2: repository facts/effects boundary — `DD-SET-015`, `026`;
- DD-3.1 plus App/Settings clarification: environment-definition delegation — `DD-SET-031`.

---

## 19. Conformance Invariants

A conforming DD-4.2 design shall preserve all of the following:

1. **Application authority remains DD-1-owned.** Settings-domain acceptance is subordinate to final Application Engine acceptance and canonical DD-1.2 outcomes.
2. **Settings does not own configuration resolution.** Persistence, source presence or Settings validation does not redefine DD-1.4 precedence, applicability, provenance or effective values.
3. **Managed scope remains DD-1.3-owned.** Resource visibility, current working directory or registry discovery does not establish Settings mutation scope.
4. **Operator identity and project metadata remain distinct.** Similar field names do not authorize cross-scope writes or synthesized equivalence.
5. **Persisted environment CRUD has one semantic owner.** Settings owns it; App may compose it for lifecycle initialization without duplicating it.
6. **Recognition and rendering do not authorize mutation.** DD-2.4/DD-2.6 evidence remains subordinate to explicit Settings intent, scope and authorization.
7. **Existing-resource mutation remains DD-2.5-owned mechanically.** Settings supplies intent/policy; Source Transformation supplies bounded mutation and source-validity evidence.
8. **Metadata is not operational authority.** Repository metadata does not grant Git authority; version metadata does not grant automatic versioning authority; template management does not grant consuming-domain execution authority.
9. **Sensitive-value management does not imply disclosure authority.** Secret presence and mutation may be represented without plaintext exposure.
10. **Partial effects remain truthful.** Coupled licence/resource/metadata operations shall not claim transactionality, rollback or complete success when only part completed.
11. **Provider and representation independence is preserved.** No concrete storage format, parser, registry, licence source, class/service or source topology is part of the permanent domain contract unless separately approved.
12. **Interactive and Headless semantics remain equivalent.** Presentation may differ; Settings intent, scope, policy, authorization and outcomes shall not.

The central conformance rule is:

> **Settings may manage durable values, metadata and declarative resources, but neither persistence nor resource ownership transfers configuration precedence, neighbouring-domain operational authority, or final application authority into Settings.**
