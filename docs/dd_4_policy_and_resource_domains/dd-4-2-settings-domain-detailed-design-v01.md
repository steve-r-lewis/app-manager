# DD-4.2 — AppManager Settings Domain Detailed Design

> **Detailed Design ID:** DD-4.2
>
> **Design family:** DD-4 — Policy and Resource Domains
>
> **Status:** Version 1 Detailed Design Specification
>
> **Detailed Design authority:** This document defines the permanent Settings-domain orchestration, settings-scope policy, metadata/resource-management decisions, state and result contracts for explicit AppManager settings, managed-project metadata, environment definitions, contributors, licence resources and declarative template resources through approved DD-1 Application Core and DD-2 Shared Capability contracts. It refines, but does not override, the root Design Specification, Functional Specifications, accepted clarifications, ADRs, DD-1 or DD-2 Detailed Designs.
>
> **Governing sources:** [Project Documentation Guide](../project-documentation-guide-v01.md), [AppManager Design Specification](../appmanager-design-specification-v01.md), [Settings Functional Specification](../functional/settings-functional-specification-v01.md), [App / Settings Environment-Definition Ownership — App Functional Specification](../functional/app-functional-specification-v01.md#fr-app-016), [Detailed Design Decomposition Plan and Canonical Register](../project_management/detailed-design-decomposition-plan-v01.md), [Domain Detailed Design Authoring Guide](../project_management/domain-detailed-design-authoring-guide-v01.md), [ADR-0001 — Primary Application Runtime](../project_management/decisions/adr-0001-primary-application-runtime.md)
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

**DD-SET-001 — Functional ownership is preserved**  
This design shall refine the complete `FR-SET` surface without transferring Settings-owned persisted-resource semantics to a caller that merely composes them.

**DD-SET-002 — Configuration authority is preserved**  
DD-1.4 remains authoritative for candidate applicability, validation for resolution, precedence, provenance and effective configuration. Settings shall not reconstruct or override those semantics.

**DD-SET-003 — Capability evidence remains subordinate**  
Successful parsing, rendering, writing, registry mutation or source transformation shall remain subordinate evidence until the Settings use case determines whether its requested intent was satisfied and the Application Engine accepts the application outcome.

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

**DD-SET-004 — Metadata is not operational authority**  
Managing repository, licence, version or other metadata shall not grant Settings authority over the operational domain associated with that metadata.

**DD-SET-005 — Resource management is not execution authority**  
Settings may manage declarative resources while the domain that applies a resource retains its own use-case semantics and acceptance.

---

## 5. Consumed DD-1 Application Core Contracts

Settings composes DD-1 rather than recreating it.

**DD-SET-006 — Invocation binding**  
Settings shall consume the normalized invocation and interaction context from DD-1.1. Interactive menus/prompts are presentation; they shall resolve to the same semantic operations available Headlessly.

**DD-SET-007 — Outcome binding**  
Settings shall attach domain-specific result evidence to DD-1.2 canonical outcomes rather than define a competing generic success/failure envelope.

**DD-SET-008 — Managed-project binding**  
Project-scoped Settings operations shall consume DD-1.3 managed-project identity and approved scope and shall not infer mutation authority from current working directory or resource visibility.

**DD-SET-009 — Configuration binding**  
Where a Settings operation needs effective policy/configuration, it shall consume the applicable DD-1.4 snapshot. A persisted value written by Settings is not automatically the value in that snapshot.

**DD-SET-010 — Application Engine binding**  
The Application Engine remains responsible for application-level coordination, authorization context and final acceptance.

---

## 6. Consumed DD-2 Shared Capabilities

Settings coordinates shared capabilities only where required by the selected operation.

**DD-SET-011 — Resource Access composition**  
New-resource creation, deletion, bounded reads and resource preconditions may use DD-2.1; resource mechanics do not determine Settings semantic correctness.

**DD-SET-012 — Source Intelligence composition**  
Recognition of structured metadata or environment definitions may consume DD-2.4 facts. Recognition does not establish Settings scope, intent or mutation authorization.

**DD-SET-013 — Source Transformation composition**  
Modification of an existing structured artefact shall route through DD-2.5 with Settings supplying bounded intent, preservation constraints and approved target scope.

**DD-SET-014 — Registry and Template composition**  
Licence catalogues and declarative template resources may consume DD-2.6 identity, provenance, validation, resolution and rendering contracts. Registry validity or successful rendering does not authorize persistence.

**DD-SET-015 — Repository evidence composition**  
Where repository metadata consistency can be checked reliably, DD-2.3 repository facts may inform a warning/rejection decision; Settings shall not mutate repository state through that evidence path.

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

**DD-SET-017 — Semantic operation identity precedes storage mechanics**  
An operation shall be identified by Settings intent and semantic target, not by a filename, JSON key, parser method or provider command.

### 7.2 Semantic scope

A Settings target shall distinguish at least:

- AppManager/user setting;
- managed-project setting;
- managed-project metadata;
- persisted environment-definition source;
- managed declarative resource.

**DD-SET-018 — Scope is explicit**  
Every operation shall bind to an unambiguous semantic scope before consequential work.

**DD-SET-019 — Similar field shapes do not collapse scopes**  
Operator identity and project author/contributor metadata shall remain distinct even where they share `name`, `email`, `url` or similar fields.

**DD-SET-020 — Persisted and effective values are distinct**  
Where a persisted setting can differ from DD-1.4 effective configuration, the result model shall preserve that distinction rather than imply equivalence.

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

**DD-SET-021 — Sensitive result projection**  
Domain results shall identify sensitive-value state without requiring secret material to be exposed.

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

**DD-SET-022 — Read paths terminate before mutation**  
Inspection/listing operations shall not cross the consequential-effect boundary merely to normalize or repair discovered content.

**DD-SET-023 — Validation precedes intended mutation**  
A proposed setting, metadata field or resource shall satisfy applicable Settings validation before persistence is intentionally attempted.

### 8.2 AppManager settings

**DD-SET-024 — Durable preference change is prospective**  
Changing an AppManager setting shall affect future resolution/use according to its owning configuration semantics; Settings shall not claim to mutate an already-resolved operation snapshot unless an upstream contract explicitly permits refresh.

### 8.3 Managed-project metadata

**DD-SET-025 — Field-bounded metadata update**  
A single-field or collection-item update shall preserve unrelated supported metadata and shall not broaden into whole-project normalization without explicit intent.

**DD-SET-026 — Repository metadata remains declarative**  
Repository URL/type mutation may consult repository facts but shall not initialize, alter remotes, commit, push or synchronize a repository.

### 8.4 Environment definitions

**DD-SET-027 — Environment source is explicit**  
Environment CRUD shall identify one supported persisted environment source; discovery of multiple sources shall not authorize broad mutation.

**DD-SET-028 — Create protection**  
Create-environment operations shall not silently overwrite an existing definition.

**DD-SET-029 — Entry-bounded update**  
Set/unset shall affect only the selected key in the selected source while preserving unrelated supported content where practical.

**DD-SET-030 — Runtime environment remains separate**  
Persisted environment mutation shall not be represented as mutation of an already-running process environment.

**DD-SET-031 — App initialisation delegates, it does not duplicate**  
When DD-3.1 App requires environment-definition creation during existing-application initialisation, Settings shall execute its canonical persisted environment operation under the App/Settings clarification; App retains lifecycle sequencing and acceptance.

### 8.5 Contributors

**DD-SET-032 — Contributor identity is unambiguous**  
Add/remove operations shall use sufficient contributor identity to avoid accidental mutation of another entry.

**DD-SET-033 — Duplicate contributor policy**  
Materially equivalent contributor entries shall not be duplicated without explicit intent.

### 8.6 Licences

**DD-SET-034 — Licence identity precedes rendering/creation**  
A licence resource operation shall resolve an unambiguous supported licence identity and applicable target before generating or writing licence material.

**DD-SET-035 — Licence text provenance matters**  
Standard licence text shall derive from an approved curated/authoritative source through applicable registry/provider contracts; Settings shall not invent material licence terms.

**DD-SET-036 — Coupled licence effects are explicit**  
If an operation includes both licence-resource and declared-metadata effects, both intended effects shall be represented before execution and evaluated separately afterward.

### 8.7 Declarative templates

**DD-SET-037 — Template class is explicit**  
Add/delete operations shall bind to the exact registry/template class and item identity.

**DD-SET-038 — Aggregate listing is read-only composition**  
Settings may aggregate template summaries across classes while preserving class/owner identity and without inventing a unified schema.

**DD-SET-039 — No generic executable extension**  
Template management shall not become arbitrary code loading, script execution or a universal plugin framework.

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

**DD-SET-040 — State progression does not manufacture authority**  
Reaching a later state shall not grant broader scope or mutation authority than the invocation and approved managed scope supplied.

**DD-SET-041 — No-op is first-class**  
A materially equivalent set/update or absent-key removal may terminate as unchanged without fabricating an effect.

**DD-SET-042 — Multi-effect state is per effect**  
Coupled resource/metadata operations shall preserve the state of each intended effect so partial completion remains observable.

**DD-SET-043 — Observation and mutation revisions remain distinguishable**  
Where a mutation is based on prior content, the operation shall retain enough revision/precondition evidence to detect supported stale-write conflicts.

---

## 10. Domain Policy and Decision Rules

**DD-SET-044 — Applicability is semantic**  
A field/resource is eligible only when supported by the selected Settings operation and target model; physical presence alone is insufficient.

**DD-SET-045 — Unsupported is not absent**  
An unsupported metadata field, resource class or environment syntax shall not be silently represented as merely unset.

**DD-SET-046 — Effective configuration is queried, not inferred**  
If the caller needs the effective value or provenance of a configurable concern, Settings shall consume DD-1.4 evidence rather than infer it from the persisted source it manages.

**DD-SET-047 — Manual version setting does not own derivation policy**  
Settings may validate and persist an explicitly supplied version but shall not absorb automatic version derivation owned by another use case.

**DD-SET-048 — External reachability is evidence-dependent**  
Syntactically valid repository, funding or bug-reporting URLs shall not be claimed reachable unless an approved capability actually establishes that fact.

**DD-SET-049 — Licence suitability is outside Settings authority**  
Catalogue membership and successful licence creation do not constitute legal advice or a determination of project suitability.

**DD-SET-050 — Template ownership survives management**  
Settings management of a declarative resource shall preserve the semantic owner that later consumes/applies it.

---

## 11. Safety, Mutation, and Authorization

**DD-SET-051 — Inspection is non-mutating**  
Read/list/inspect operations shall remain non-mutating.

**DD-SET-052 — Mutation intent is explicit**  
Create, set, update, add, remove and delete effects shall not be inferred from inspection or recognition.

**DD-SET-053 — Consequential authorization is operation-relative**  
Deletion, replacement and other consequential operations shall consume the applicable confirmation or explicit non-interactive authorization policy before effect execution.

**DD-SET-054 — Mutation is target-bounded**  
An authorized Settings operation shall affect only its selected setting/resource and explicitly coupled effects within approved scope.

**DD-SET-055 — Existing-resource replacement is not implicit**  
Creation shall not silently replace an existing environment definition, licence artefact or template item where replacement is materially consequential.

**DD-SET-056 — Indirection does not escape scope**  
Symlinks, aliases, registry references or provider-resolved paths shall not allow a Settings operation to mutate outside the approved resource boundary.

**DD-SET-057 — Secret reveal is not implied by management authority**  
Permission to set, unset or inspect the existence of a sensitive value does not imply permission to emit its plaintext value.

---

## 12. Failure, Cancellation, and Partial Effects

**DD-SET-058 — Failure is stage-attributable**  
Settings failures shall distinguish target resolution, validation, authorization, read/recognition, registry/provider, transformation/persistence, verification and Settings acceptance where material.

**DD-SET-059 — Partial completion is first-class**  
Where an operation has multiple intended effects, completion of only a subset shall be represented as partial rather than complete success.

**DD-SET-060 — No universal rollback claim**  
Settings shall report actual effects and shall not imply rollback unless the delegated capability genuinely provides and completes it.

**DD-SET-061 — Cancellation stops future effects**  
Cancellation shall prevent not-yet-started Settings effects as soon as safely practical and propagate to active delegated work where supported.

**DD-SET-062 — Cancellation preserves completed effects**  
Already completed effects remain part of the result and shall not be erased by cancellation semantics.

**DD-SET-063 — Indeterminate effect requires verification**  
If persistence may have occurred but completion cannot be established reliably, the operation shall report indeterminate state and recovery/verification guidance rather than guess success or failure.

---

## 13. Headless and Interaction Independence

**DD-SET-064 — One semantic contract across adapters**  
TUI, Headless and future adapters shall express equivalent Settings intent, semantic scope, policy and results.

**DD-SET-065 — Interactive selection is presentation**  
Menus/prompts may help select a setting, resource, source or value but shall not create semantics unavailable to non-interactive callers.

**DD-SET-066 — Headless ambiguity fails safely**  
Missing or ambiguous target, environment source, metadata identity, licence identity or template class shall produce structured failure rather than prompting or selecting a broad default.

**DD-SET-067 — Machine-consumable sensitivity**  
Structured Headless results shall communicate redaction/presence state without requiring secret disclosure or parsing terminal prose.

---

## 14. Concurrency, Idempotency, and Conflict Behaviour

**DD-SET-068 — Consequential preconditions are revalidated**  
Where practical, stale-sensitive mutations shall revalidate relevant target/revision/existence preconditions immediately before effect execution.

**DD-SET-069 — Equivalent updates are repeatable**  
Repeating a materially equivalent set/update/add request should converge to unchanged or the same semantic state rather than accumulate unintended duplicate effects.

**DD-SET-070 — Collection identity prevents duplicates**  
Keyword, contributor and registry-item operations shall use semantic identity/equivalence rules appropriate to their class to avoid accidental duplication.

**DD-SET-071 — Concurrent change is not silently overwritten**  
If the target changed materially after inspection and the conflict is detectable, Settings shall reject, refresh or require renewed intent rather than silently overwrite the newer state.

**DD-SET-072 — Coupled effects do not imply transactions**  
A licence-resource-plus-metadata operation may define coordinated intent without claiming atomic transactionality across capabilities unless such a guarantee actually exists.

---

## 15. Security and Sensitive Information

**DD-SET-073 — Sensitivity follows data, not storage format**  
Sensitive classification shall survive normalization, parsing, result projection and diagnostics regardless of whether the value came from a settings store, environment definition or other approved source.

**DD-SET-074 — Secret values are minimized**  
Settings shall avoid placing plaintext secrets in normal output, logs, diagnostics, provenance records or generic effect summaries.

**DD-SET-075 — Untrusted resource content remains data**  
Environment content, metadata strings, licence/template resources and provider-returned content shall not acquire authority to redefine AppManager commands, policy, scope or configuration.

**DD-SET-076 — External resource acquisition is bounded**  
Where a catalogue/provider obtains declarative material externally, trust/provenance and applicable disclosure/network policy shall remain explicit; acquired content does not bypass validation or authorization.

**DD-SET-077 — Diagnostics preserve usefulness without disclosure**  
Sensitive failures should identify the affected semantic key/resource and stage while redacting unnecessary protected content.

---

## 16. Extensibility and Replaceability

**DD-SET-078 — Storage/provider replaceability**  
Settings semantics shall not require one storage format, parser, registry implementation, licence provider or resource service.

**DD-SET-079 — Registry classes remain specialised**  
Shared DD-2.6 registry infrastructure shall not force licence, AI, Docs, Nuxt or other declarative resources into one interchangeable schema/lifecycle.

**DD-SET-080 — New setting/resource classes require defined ownership**  
A new class may be introduced only when its semantic scope, validation, mutation and consuming-domain ownership are sufficiently defined.

**DD-SET-081 — No generic domain framework from shape similarity**  
Repeated CRUD terminology or similarly shaped metadata records shall not justify a universal domain base service/request/result abstraction.

**DD-SET-082 — Implementation topology remains open**  
This design shall not require a Settings class/service/package/process, one adapter per metadata class, one registry runtime or a specific TypeScript source layout.

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

**DD-SET-083 — Domain policy is independently testable**  
Settings orchestration/policy shall be testable with capability substitutes without requiring live external catalogues or one concrete storage technology.

**DD-SET-084 — Provider tests do not define the contract**  
Integration tests for concrete parsers, stores, licence sources or registries may verify adapter behavior below the boundary but shall not redefine Settings semantics.

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
