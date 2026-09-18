# DD-2.10 — AppManager Nuxt Capability Detailed Design

> **Detailed Design ID:** DD-2.10
>
> **Design family:** DD-2 — Shared Capabilities

> **Status:** Version 1 Detailed Design Specification
>
> **Detailed Design authority:** This document defines the permanent shared contracts for Nuxt-specific recognition, Nuxt configuration interpretation, supported Nuxt configuration mutation planning, Nuxt layer modeling, layer creation/scaffolding, layer integration/detachment evidence, Nuxt-specific validation and Nuxt provider normalization beneath AppManager application authority. It refines, but does not override, the root Design Specification, Functional Specifications, accepted ADRs, or the DD-1 Application Core Detailed Designs.
>
> **Governing sources:** [Project Documentation Guide](../project-documentation-guide-v01.md), [AppManager Design Specification](../appmanager-design-specification-v01.md), [Detailed Design Register](../project_management/detailed-design-register-v01.md), [ADR-0001 — Primary Application Runtime](../project_management/decisions/adr-0001-primary-application-runtime.md)
>
> **Related Detailed Design authorities:** [DD-1.1 — Application Invocation](../dd_1_application_core/dd-1-1-application-invocation-detailed-design-v01.md), [DD-1.2 — Execution Outcomes](../dd_1_application_core/dd-1-2-execution-outcomes-detailed-design-v01.md), [DD-1.3 — Managed Project](../dd_1_application_core/dd-1-3-managed-project-detailed-design-v01.md), [DD-1.4 — Configuration Resolution](../dd_1_application_core/dd-1-4-configuration-resolution-detailed-design-v01.md), [DD-1.5 — Application Engine](../dd_1_application_core/dd-1-5-application-engine-detailed-design-v01.md), [DD-2.1 — Resource Access](dd-2-1-resource-access-detailed-design-v01.md), [DD-2.2 — Process Execution](dd-2-2-process-execution-detailed-design-v01.md), [DD-2.3 — Repository Capability](dd-2-3-repository-capability-detailed-design-v01.md), [DD-2.4 — Source Intelligence](dd-2-4-source-intelligence-detailed-design-v01.md), [DD-2.5 — Source Transformation](dd-2-5-source-transformation-detailed-design-v01.md), [DD-2.6 — Resource Registry and Template](dd-2-6-resource-registry-and-template-detailed-design-v01.md), [DD-2.7 — AI Capability](dd-2-7-ai-capability-detailed-design-v01.md), [DD-2.8 — Quality Capability](dd-2-8-quality-capability-detailed-design-v01.md), [DD-2.9 — Documentation Capability](dd-2-9-documentation-capability-detailed-design-v01.md), [Nuxt Layer Scaffold Artefact Ownership](dd-2-10-nuxt-capability-detailed-design-v01.md#_16-layer-scaffolding-and-resource-registry)
>
> **Primary Functional authority:** [docs/functional/nuxt-functional-specification-v01.md](../functional/nuxt-functional-specification-v01.md), together with owning-domain Functional Specifications where Nuxt facts or Nuxt-generated resources are consumed by another workflow.

---

## 1. Purpose

Nuxt Capability recognizes and interprets supported Nuxt structures, supplies semantic change/scaffold plans and evaluates Nuxt validity. The local models distinguish root/layer identity, host-relative integration, configuration manageability and profile contributions. The [Nuxt domain](../dd_3_high_coupling_domains/dd-3-3-nuxt-domain-detailed-design-v01.md) composes that evidence into application workflows, using the five additional technical concerns in §6.1.

## 2. Scope

This design owns permanent contracts for:

- Nuxt project and layer recognition;
- root-versus-layer Nuxt identity evidence;
- Nuxt configuration target identity;
- supported Nuxt configuration semantic views;
- manageable versus observe-only configuration entries;
- Nuxt configuration entry identity and structural context;
- Nuxt-specific configuration validation rules;
- semantic add/remove/update intent supplied to Source Transformation;
- Nuxt extends/layer-composition relationship evidence;
- standalone versus host-integrated layer state;
- layer creation profile identity;
- Nuxt layer baseline requirements;
- scaffold orchestration and required/optional artefact-class selection for a Nuxt layer profile;
- scaffold content/resource requests supplied to the semantic/rendering owner appropriate to each artefact class;
- Nuxt-specific interpretation of generated artefact contribution to the layer baseline;
- Nuxt-specific creation validation;
- Nuxt integration and detachment semantic plans;
- Nuxt relationship preconditions and postconditions;
- Nuxt-specific partial-state evidence;
- Nuxt provider selection and normalization;
- Nuxt-specific diagnostics;
- provider replaceability and testability.

This design does not require one Nuxt parser, one AST representation, one config file format, one package manager, one scaffold generator, one Nuxt CLI, one registry layout, one class hierarchy, one process or one runtime topology.

---

## 3. Explicit Non-Ownership

Nuxt Capability shall not own:

- AppManager command or use-case semantics;
- managed-project identity or managed scope;
- application authorization or confirmation policy;
- configuration-source precedence;
- generic source parsing beyond Nuxt-specific interpretation;
- source mutation mechanics or stale-write policy;
- generic filesystem mutation;
- repository initialization, commit, push, remote or submodule semantics;
- application build, dev, preview, reset, reinstall or cleanup lifecycle;
- documentation generation semantics;
- licence-management semantics merely because a licence artefact participates in a Nuxt scaffold;
- user-facing settings CRUD or environment-definition CRUD;
- declarative registry/template rendering semantics outside the Nuxt-specific selection/binding intent supplied to DD-2.6;
- test/lint/typecheck/gate semantics;
- generic arbitrary-file generation;
- AI-provider selection or AI acceptance;
- final AppManager success, failure, partial-success or cancellation acceptance outside the bounded Nuxt result contract.

<a id="dd-nuxtcap-001"></a>

**DD-NUXTCAP-001 — Delegated execution remains subordinate**

Bounded Nuxt delegation follows [Design](../appmanager-design-specification-v01.md#_6-6-capability-boundaries-and-providers).

<a id="dd-nuxtcap-002"></a>

**DD-NUXTCAP-002 — Nuxt technical success is not application success**

Parser/tool/generated-file/configuration completion follows [Design](../appmanager-design-specification-v01.md#_11-11-workflow-results-failure-and-acceptance).


---

## 4. Architectural Position

```text
Application Engine / owning Nuxt use case
        |
        +--> managed-project context / approved target
        +--> effective configuration
        +--> Nuxt-specific application intent
        +--> authorization / confirmation / policy
        |
        v
+--------------------------------------------------+
| Nuxt Capability                                  |
|                                                  |
| Nuxt recognition / identity facts                |
| config semantic interpretation                   |
| layer relationship interpretation                |
| semantic change intent / validation              |
| layer-profile / scaffold orchestration           |
| Nuxt provider normalization                      |
+--------------------------+-----------------------+
                           |
          +----------------+----------------+----------------+
          |                |                |                |
          v                v                v                v
 Source Intelligence  Source Transformation  Registry/Templates  cross-owned semantics
                                                                  (Docs / Settings / etc.)
          |                |                |                |
          +----------------+----------------+----------------+
                           |
                 other bounded capabilities
                 (Resource Access / Git / Process)
```

<a id="dd-nuxtcap-003"></a>

**DD-NUXTCAP-003 — No alternate orchestration authority**

Nuxt capability coordination versus application orchestration follows [Design](../appmanager-design-specification-v01.md#_6-2-application-engine-authority).

<a id="dd-nuxtcap-004"></a>

**DD-NUXTCAP-004 — Shared capability versus Nuxt domain**

Nuxt application intent above technical semantics follows [Design](../appmanager-design-specification-v01.md#_10-7-nuxt-domain).


---

## 5. Nuxt Identity Model

Nuxt semantics depend on stable target identity rather than filesystem location alone.

A Nuxt target may represent:

- managed root application;
- managed Nuxt layer;
- standalone managed Nuxt layer;
- explicitly supported Nuxt configuration target;
- prospective layer-creation target prior to managed-project incorporation.

<a id="dd-nuxtcap-005"></a>

**DD-NUXTCAP-005 — Root and layer identities remain distinct**  
The capability shall not collapse the managed root application and managed layers into one undifferentiated Nuxt project identity.

<a id="dd-nuxtcap-006"></a>

**DD-NUXTCAP-006 — Filesystem presence is insufficient**

Nuxt-looking files/directories as identity evidence follows [Design](../appmanager-design-specification-v01.md#_9-6-project-discovery-and-context-resolution).

<a id="dd-nuxtcap-007"></a>

**DD-NUXTCAP-007 — Host-relative relationships**  
Layer integration state shall be interpretable relative to a resolved host/root identity because one layer may be integrated into one root and not another.

<a id="dd-nuxtcap-008"></a>

**DD-NUXTCAP-008 — Repository identity remains separate**  
Nuxt identity and Nuxt integration shall not be inferred solely from repository topology, submodule presence or remote metadata.

---

## 6. Nuxt Recognition and Facts

Recognition is evidence-producing and non-mutating.

Recognized facts may include:

- Nuxt target kind;
- supported Nuxt version/capability evidence where reliably known;
- configuration target reference;
- layer-baseline evidence;
- root/layer relationship evidence;
- extends/composition entries;
- supported Nuxt-specific resource presence;
- unsupported/ambiguous structure diagnostics;
- source/revision provenance.

<a id="dd-nuxtcap-009"></a>

**DD-NUXTCAP-009 — Recognition consumes bounded evidence**  
Nuxt recognition should consume Managed Project, Source Intelligence and Resource Access evidence rather than independently crawling arbitrary filesystem scope.

<a id="dd-nuxtcap-010"></a>

**DD-NUXTCAP-010 — Recognition is not mutation authority**

Nuxt recognition before resource/source/repository/process effects follows [Design](../appmanager-design-specification-v01.md#_9-9-non-destructive-ownership-and-unmanaged-content).

<a id="dd-nuxtcap-011"></a>

**DD-NUXTCAP-011 — Unsupported structure fails safely**  
A recognized-but-unsupported or ambiguous Nuxt structure shall produce explicit unsupported/ambiguous evidence rather than guessed semantics.

<a id="dd-nuxtcap-012"></a>

**DD-NUXTCAP-012 — Nuxt facts retain provenance**  
Facts derived from source, configuration or provider tooling shall retain sufficient provenance to distinguish observed structure from inferred or generated state where material.

---

### 6.1 Technical support for Nuxt operations {#operation-evidence}

The [Nuxt domain](../dd_3_high_coupling_domains/dd-3-3-nuxt-domain-detailed-design-v01.md) consumes these bounded fact/plan/validation concerns for the operations in the [Functional catalogue](../functional/nuxt-functional-specification-v01.md):

| Concern | Technical evidence supplied when required |
|---|---|
| Scaffold artefacts | Supported semantic classes, Nuxt-aware placement and validity constraints |
| Module establishment | Supported module state and semantic dependency/configuration requirements for the selected target |
| Upgrade | Current version/framework state, requested-version applicability and resulting-target validity |
| Analysis | Nuxt-specific analysis invocation and normalized provider results |
| Cleanup | Positively identified supported generated/cache state and applicable regeneration/validation facts |

These concerns do not imply one capability method per application command. Reuse fact, plan and validation contracts where their semantics coincide; preserve distinct technical contracts where similar provider operations have different meanings. Tool syntax remains behind the existing Process Execution/provider boundary. Domain policy selects the target and accepts the result; creation, source transformation and deletion use the persistence owners already described in this specification.

## 7. Nuxt Configuration Target Model

A Nuxt project may contain more than one configuration-bearing resource. The capability therefore requires semantic target resolution before management operations.

<a id="dd-nuxtcap-013"></a>

**DD-NUXTCAP-013 — Explicit configuration target**  
A configuration inspection or mutation request shall resolve the Nuxt target and configuration resource unambiguously before consequential work.

<a id="dd-nuxtcap-014"></a>

**DD-NUXTCAP-014 — Root and layer config are independent**  
Root configuration and a layer's own configuration remain separately addressable where both exist.

<a id="dd-nuxtcap-015"></a>

**DD-NUXTCAP-015 — Current working directory is not identity**

Working location as configuration-selection evidence follows [Design](../appmanager-design-specification-v01.md#_9-6-project-discovery-and-context-resolution).


---

## 8. Nuxt Configuration Semantic Representation

The shared representation exposes Nuxt meaning rather than provider-native AST or raw source text.

A supported configuration entry should be able to represent:

- semantic class;
- stable entry identity;
- structural location/context;
- normalized value or relationship evidence;
- source provenance;
- manageable versus observe-only capability;
- duplicates/equivalents/conflicts;
- sensitivity classification where material;
- diagnostics/limitations.

<a id="dd-nuxtcap-016"></a>

**DD-NUXTCAP-016 — Semantic representation is provider-independent**

Nuxt parser/AST/CST representations follows [Design](../appmanager-design-specification-v01.md#_6-6-capability-boundaries-and-providers).

<a id="dd-nuxtcap-017"></a>

**DD-NUXTCAP-017 — Manageability is explicit**  
The capability shall distinguish configuration it can safely manage from configuration it can only observe.

<a id="dd-nuxtcap-018"></a>

**DD-NUXTCAP-018 — Unsupported content remains preserved evidence**  
Unsupported configuration shall not be discarded merely because the capability cannot manage it; where safe it should remain represented as opaque/unsupported context sufficient to protect preservation during transformation.

<a id="dd-nuxtcap-019"></a>

**DD-NUXTCAP-019 — Sensitive values are minimized**

Secret/runtime values in Nuxt inspection uses [DD-1.2](../dd_1_application_core/dd-1-2-execution-outcomes-detailed-design-v01.md#_24-sensitive-information-and-redaction).


---

## 9. Configuration Listing

<a id="dd-nuxtcap-020"></a>

**DD-NUXTCAP-020 — Listing is non-mutating**  
Listing supported configuration entries shall not produce source changes or provider execution with consequential effects.

<a id="dd-nuxtcap-021"></a>

**DD-NUXTCAP-021 — Entry identity supports follow-on intent**  
Listed manageable entries shall expose enough identity/context for a subsequent explicit add/remove/update request to target the intended semantic entry without parsing presentation text.

<a id="dd-nuxtcap-022"></a>

**DD-NUXTCAP-022 — Equivalent values in distinct contexts stay distinct**  
The same textual value appearing in materially different Nuxt contexts shall not be collapsed into one entry when location/context affects semantics.

---

## 10. Nuxt Configuration Change Intent

Nuxt Capability owns the Nuxt-specific meaning of a supported change, while DD-2.5 owns transformation planning/application.

A semantic configuration change intent may include:

- add supported entry;
- remove supported entry;
- replace/update through an explicitly supported migration/update path;
- integrate layer by adding/changing a Nuxt relationship;
- detach layer by removing a Nuxt relationship.

<a id="dd-nuxtcap-023"></a>

**DD-NUXTCAP-023 — Nuxt intent precedes transformation**  
A transformation request shall be derived from an approved Nuxt semantic change rather than from arbitrary text-edit instructions.

<a id="dd-nuxtcap-024"></a>

**DD-NUXTCAP-024 — Transformation remains DD-2.5**

Nuxt configuration writes follows [Design](../appmanager-design-specification-v01.md#_7-code-intelligence-and-transformation-architecture).

<a id="dd-nuxtcap-025"></a>

**DD-NUXTCAP-025 — Narrowest practical change**

The semantic change applies [FR-XFORM-013](../functional/source-transformation-functional-specification-v01.md#fr-xform-013) and [Design](../appmanager-design-specification-v01.md#_7-10-non-destructive-transformation) to preserve unrelated configuration.


---

## 11. Add Configuration Semantics

<a id="dd-nuxtcap-026"></a>

**DD-NUXTCAP-026 — Supported-class gate**  
Only configuration classes with defined recognition, transformation and validation semantics may be added through the managed Nuxt contract.

<a id="dd-nuxtcap-027"></a>

**DD-NUXTCAP-027 — Equivalent existing entry**  
If an equivalent supported entry already exists, the capability shall report already-satisfied evidence rather than request duplicate insertion.

<a id="dd-nuxtcap-028"></a>

**DD-NUXTCAP-028 — Conflict is not duplicate**  
A conflicting existing entry shall remain distinguishable from an equivalent entry and shall require an explicit supported update/migration path or rejection.

<a id="dd-nuxtcap-029"></a>

**DD-NUXTCAP-029 — Add postcondition**  
The Nuxt-specific postcondition shall describe the intended semantic entry after transformation, independent of exact source formatting.

---

## 12. Remove Configuration Semantics

<a id="dd-nuxtcap-030"></a>

**DD-NUXTCAP-030 — Exact removal target**  
Removal shall resolve one supported semantic entry or explicitly bounded set before transformation.

<a id="dd-nuxtcap-031"></a>

**DD-NUXTCAP-031 — Already absent is distinct**  
A supported requested entry already absent may be represented as already-satisfied/no-op evidence rather than transformation failure.

<a id="dd-nuxtcap-032"></a>

**DD-NUXTCAP-032 — Removal consequence evidence**  
Known Nuxt-specific consequences of removing an entry or relationship shall be surfaced to the owning use case before authorization where material.

<a id="dd-nuxtcap-033"></a>

**DD-NUXTCAP-033 — Remove postcondition**  
The postcondition shall describe absence of the selected semantic entry while preserving unrelated entries/content.

---

## 13. Nuxt-Specific Validation

Nuxt-specific validation is distinct from source syntax validity and Quality-domain checks.

Validation may establish, where supported:

- expected semantic config entry exists/does not exist;
- no conflicting equivalent relationship remains;
- generated project satisfies selected Nuxt layer baseline;
- layer candidate satisfies supported eligibility rules;
- root/layer relationship is semantically present/absent;
- target remains recognizable as the intended Nuxt kind.

<a id="dd-nuxtcap-034"></a>

**DD-NUXTCAP-034 — Source-valid is insufficient**  
Successful Source Transformation validation does not by itself establish Nuxt semantic validity.

<a id="dd-nuxtcap-035"></a>

**DD-NUXTCAP-035 — Nuxt validation does not absorb Quality**  
Nuxt-specific validity shall not become general test/lint/typecheck/build authority.

<a id="dd-nuxtcap-036"></a>

**DD-NUXTCAP-036 — Validation result is evidence**

Nuxt validity evidence follows [Design](../appmanager-design-specification-v01.md#_11-11-workflow-results-failure-and-acceptance).


---

## 14. Nuxt Layer Model

A Nuxt layer is modeled independently from host integration and repository relationship.

Layer evidence may include:

- layer identity;
- target/resource root;
- standalone validity;
- configuration reference;
- selected creation profile where generated;
- host-specific integration state;
- repository-relationship evidence supplied by Repository Capability/Git domain;
- supported lifecycle facts;
- diagnostics/unsupported state.

<a id="dd-nuxtcap-037"></a>

**DD-NUXTCAP-037 — Standalone is valid state**  
A supported layer may be valid while unintegrated into a particular host.

<a id="dd-nuxtcap-038"></a>

**DD-NUXTCAP-038 — Integration is host-relative**

Host-relative integration representation follows [DD-NUXTCAP-007](#dd-nuxtcap-007).

<a id="dd-nuxtcap-039"></a>

**DD-NUXTCAP-039 — Repository-linked is separate state**  
Repository linkage may coexist with integrated/unintegrated Nuxt states and shall not be used as a synonym for Nuxt composition.

---

## 15. Layer Creation Profile

A creation profile is a declarative Nuxt capability contract describing the functional baseline to orchestrate, not a hidden template filename set and not a transfer of semantic ownership for every included artefact class.

A profile may define classes such as:

- package metadata;
- Nuxt configuration;
- TypeScript configuration;
- ignore rules;
- environment/example configuration;
- README/introduction documentation;
- licence material;
- test configuration;
- optional repository follow-on expectations.

For each class, the profile may specify that the artefact is required/optional for the selected Nuxt baseline and provide Nuxt-specific binding inputs. Where another domain/capability owns the artefact's internal semantics, Nuxt Capability consumes that contract rather than recreating it.

<a id="dd-nuxtcap-040"></a>

**DD-NUXTCAP-040 — Profile identity is semantic**  
Profiles shall be identified by documented capability intent rather than incidental template ordering or implementation filenames.

<a id="dd-nuxtcap-041"></a>

**DD-NUXTCAP-041 — Profile does not grant file or semantic authority**

Apply [the artefact-delegation contract in §16](#_16-layer-scaffolding-and-resource-registry) to cross-owned profile contributions; collision policy follows [Design](../appmanager-design-specification-v01.md#_6-8-generation-and-templates).

<a id="dd-nuxtcap-042"></a>

**DD-NUXTCAP-042 — Effective configuration supplies values**

Resolved author/licence/naming/repository inputs for creation applies [FR-NUXT-060](../functional/nuxt-functional-specification-v01.md#fr-nuxt-060).

<a id="dd-nuxtcap-043"></a>

**DD-NUXTCAP-043 — No fabricated secrets**  
Required secret-bearing values shall be represented as absent, references or explicit placeholders according to policy; Nuxt Capability shall not invent real credentials.

---

## 16. Layer Scaffolding and Resource Registry

Layer scaffolding composes cross-owned semantics and declarative resources under one Nuxt layer-creation orchestration.

```text
selected Nuxt layer profile
        + effective inputs
        + validated target
            -> classify required artefact classes
            -> obtain cross-owned semantic content/evidence where required
               (for example Documentation or Settings-owned semantics)
            -> DD-2.6 resolve resource/template descriptors
            -> bind parameters
            -> deterministic non-mutating render
            -> proposed layer artefacts
            -> creation authorization / collision checks
            -> DD-2.1 Resource Access create new resource
               OR DD-2.5 Source Transformation modify existing resource
            -> Nuxt-specific baseline validation
            -> owning Nuxt use case / Application Engine acceptance
```

This sequence separates orchestration, artefact semantics, rendering, persistence and final acceptance. It does not require every profile class to pass through every specialist capability. A semantic class is not an incidental filename; the relevant semantic owner is invoked where its contract is materially required.

For a README/introduction consisting only of an approved bounded declarative template with Nuxt parameters, DD-2.6 can render it directly. If it requires documentation aggregation, explanation, content modeling or update semantics, the profile consumes DD-2.9. These paths retain the same Nuxt profile-completeness decision without creating a second documentation model.

Licence selection comes from explicit invocation/effective configuration. Settings owns licence management and coupled project metadata semantics; DD-2.6 supplies curated-resource provenance and rendering. Nuxt consumes that choice and coordinates the profile contribution. It does not establish a competing licence policy or depend on provider internals.

<a id="dd-nuxtcap-044"></a>

**DD-NUXTCAP-044 — Templates remain subordinate**

Template availability versus Nuxt intent and target authority follows [Design](../appmanager-design-specification-v01.md#_6-8-generation-and-templates).

<a id="dd-nuxtcap-045"></a>

**DD-NUXTCAP-045 — Generated content is proposed content**

Scaffold rendering uses [DD-REG-002](dd-2-6-resource-registry-and-template-detailed-design-v01.md#dd-reg-002); cross-owned content remains a proposal until its persistence path completes.

<a id="dd-nuxtcap-046"></a>

**DD-NUXTCAP-046 — Existing target changes path**

Existing scaffold-artefact collision/update follows [Design](../appmanager-design-specification-v01.md#_6-8-generation-and-templates).

<a id="dd-nuxtcap-047"></a>

**DD-NUXTCAP-047 — No generic generator or semantic authority**  
The fact that template infrastructure can render arbitrary resources, or that Nuxt layer creation can request several artefact classes, shall not cause Nuxt Capability to own arbitrary project-file generation or the independent semantics of those artefact classes.

---

## 17. Layer Creation Result Semantics

Layer creation may involve several independent stages.

Possible stages include:

- target validation;
- profile resolution;
- artefact-class semantic delegation where required;
- template/resource resolution;
- rendering;
- resource creation;
- Nuxt-specific validation;
- optional local repository coordination;
- optional remote repository coordination;
- optional documentation/AI enrichment.

<a id="dd-nuxtcap-048"></a>

**DD-NUXTCAP-048 — Created layer state is preserved on follow-on failure**

Created layers followed by optional Git/remote/documentation failure uses [DD-1.2](../dd_1_application_core/dd-1-2-execution-outcomes-detailed-design-v01.md#_14-partial-completion).

<a id="dd-nuxtcap-049"></a>

**DD-NUXTCAP-049 — No universal atomicity claim**

Cross-capability rollback guarantees uses [DD-1.2](../dd_1_application_core/dd-1-2-execution-outcomes-detailed-design-v01.md#_12-consequential-effects).

<a id="dd-nuxtcap-050"></a>

**DD-NUXTCAP-050 — Partial creation is structured**  
Creation results shall identify completed stages, failed/skipped stages, created resources and recommended remaining actions where material. Evidence from cross-owned artefact semantics shall remain distinguishable from Nuxt baseline validation and final application acceptance.

---

## 18. Optional AI Enrichment

AI may assist descriptive/generated content but cannot define the layer baseline or Nuxt truth.

<a id="dd-nuxtcap-051"></a>

**DD-NUXTCAP-051 — AI is optional where deterministic baseline exists**  
A valid supported layer profile shall not require AI merely for descriptive enrichment if the deterministic baseline can be produced without it.

<a id="dd-nuxtcap-052"></a>

**DD-NUXTCAP-052 — AI output remains proposal**

AI-produced README/description/content proposals follows [Design](../appmanager-design-specification-v01.md#_11-10-ai-assisted-workflow).

<a id="dd-nuxtcap-053"></a>

**DD-NUXTCAP-053 — Nuxt facts outrank generated claims**  
AI content shall not replace reliably recognized Nuxt/project facts with contradictory generated assertions.

---

## 19. Repository Coordination Boundary

Nuxt use cases may coordinate Git-domain operations but shall not reimplement repository semantics.

<a id="dd-nuxtcap-054"></a>

**DD-NUXTCAP-054 — Repository creation remains Git-owned**

Repository follow-ons consume [Git domain workflows](../dd_3_high_coupling_domains/dd-3-2-git-domain-detailed-design-v01.md) and [Repository primitives](dd-2-3-repository-capability-detailed-design-v01.md) at their respective boundaries.

<a id="dd-nuxtcap-055"></a>

**DD-NUXTCAP-055 — Repository result remains separate evidence**  
Nuxt results shall preserve repository follow-on status separately from Nuxt scaffold/integration state where both are relevant.

<a id="dd-nuxtcap-056"></a>

**DD-NUXTCAP-056 — Git success does not prove Nuxt success**

Repository/submodule results used for Nuxt integration follows [DD-NUXTCAP-039](#dd-nuxtcap-039).


---

## 20. Layer Integration Model

Layer integration makes an existing eligible layer participate in a resolved host/root Nuxt composition.

Required evidence includes:

- root/host identity;
- layer identity;
- supported eligibility evidence;
- existing relationship state;
- desired Nuxt relationship;
- required config transformation intent;
- optional repository coordination state;
- post-integration validation.

<a id="dd-nuxtcap-057"></a>

**DD-NUXTCAP-057 — Integration requires existing layer**

Integration of an existing layer applies [FR-NUXT-072](../functional/nuxt-functional-specification-v01.md#fr-nuxt-072).

<a id="dd-nuxtcap-058"></a>

**DD-NUXTCAP-058 — Host identity is explicit**

Host identity before integration planning applies [FR-NUXT-073](../functional/nuxt-functional-specification-v01.md#fr-nuxt-073).

<a id="dd-nuxtcap-059"></a>

**DD-NUXTCAP-059 — Eligibility precedes mutation**

Candidate layer eligibility applies [FR-NUXT-074](../functional/nuxt-functional-specification-v01.md#fr-nuxt-074).

<a id="dd-nuxtcap-060"></a>

**DD-NUXTCAP-060 — Existing equivalent integration is no-op**

Already-equivalent integration applies [FR-NUXT-078](../functional/nuxt-functional-specification-v01.md#fr-nuxt-078).

<a id="dd-nuxtcap-061"></a>

**DD-NUXTCAP-061 — Conflicting integration requires explicit path**

Ambiguous/conflicting integration applies [FR-NUXT-079](../functional/nuxt-functional-specification-v01.md#fr-nuxt-079).


---

## 21. Integration and Repository Relationship Composition

<a id="dd-nuxtcap-062"></a>

**DD-NUXTCAP-062 — Nuxt and Git relationships remain orthogonal**

Separate Nuxt and repository relationship states follows [DD-NUXTCAP-039](#dd-nuxtcap-039).

<a id="dd-nuxtcap-063"></a>

**DD-NUXTCAP-063 — Order is owned by use-case orchestration**  
Whether repository coordination precedes/follows the Nuxt source change is an owning-use-case workflow decision and shall not be hidden inside a provider.

<a id="dd-nuxtcap-064"></a>

**DD-NUXTCAP-064 — Partial relationship state is explicit**

Divergent Nuxt/Git relationship completion applies [FR-NUXT-081](../functional/nuxt-functional-specification-v01.md#fr-nuxt-081).


---

## 22. Layer Detachment

Nuxt detachment removes a host-relative Nuxt composition relationship without implying deletion of the layer or repository relationship.

<a id="dd-nuxtcap-065"></a>

**DD-NUXTCAP-065 — Detachment targets one relationship**

Exact host/layer relationship target applies [FR-NUXT-085](../functional/nuxt-functional-specification-v01.md#fr-nuxt-085).

<a id="dd-nuxtcap-066"></a>

**DD-NUXTCAP-066 — Detachment does not delete layer resources**

Detachment effects on layer resources/repositories applies [FR-NUXT-084](../functional/nuxt-functional-specification-v01.md#fr-nuxt-084).

<a id="dd-nuxtcap-067"></a>

**DD-NUXTCAP-067 — Git cleanup is separate intent**

Requested repository/submodule cleanup is separately authorized through [Git](../dd_3_high_coupling_domains/dd-3-2-git-domain-detailed-design-v01.md), under [FR-NUXT-084](../functional/nuxt-functional-specification-v01.md#fr-nuxt-084).

<a id="dd-nuxtcap-068"></a>

**DD-NUXTCAP-068 — Detachment consequence evidence**  
Known host-level consequences shall be surfaced for confirmation/policy where material before applying the change.

---

## 23. Lifecycle Facts

Nuxt Capability may describe lifecycle facts without acquiring lifecycle authority.

Supported descriptive states may include:

- valid standalone layer;
- created but unintegrated;
- integrated into selected host;
- repository-linked where supplied by Git evidence;
- unsupported/invalid;
- ambiguous/stale.

<a id="dd-nuxtcap-069"></a>

**DD-NUXTCAP-069 — Lifecycle facts are descriptive**

Reported layer state before consequential operations follows [Design](../appmanager-design-specification-v01.md#_9-9-non-destructive-ownership-and-unmanaged-content).

<a id="dd-nuxtcap-070"></a>

**DD-NUXTCAP-070 — App lifecycle remains App-owned**  
Nuxt-generated state observations support the bounded cleanup evidence in §6.1; they do not create App Clean/Reset/Prepare semantics within this capability.

---

## 24. Generic File Generation Boundary

<a id="dd-nuxtcap-071"></a>

**DD-NUXTCAP-071 — Nuxt-specific semantic purpose required**  
Nuxt Capability may request generation of resources only where the resource class participates in a defined Nuxt use case/profile. Participation establishes Nuxt orchestration/baseline purpose, not necessarily permanent artefact semantics.

<a id="dd-nuxtcap-072"></a>

**DD-NUXTCAP-072 — Deployment/provider files are not Nuxt by default**  
A hosting/deployment provider artefact does not become Nuxt-owned merely because it is used by a Nuxt application.

<a id="dd-nuxtcap-073"></a>

**DD-NUXTCAP-073 — Generator capability does not define domain ownership**

Technical rendering/creation ability versus artefact ownership follows [Design](../appmanager-design-specification-v01.md#_6-6-capability-boundaries-and-providers).


---

## 25. Documentation Boundary

<a id="dd-nuxtcap-074"></a>

**DD-NUXTCAP-074 — Nuxt may supply facts to Docs**

[Documentation Capability](dd-2-9-documentation-capability-detailed-design-v01.md) consumes the Nuxt facts in [§6](#_6-nuxt-recognition-and-facts).

<a id="dd-nuxtcap-075"></a>

**DD-NUXTCAP-075 — Documentation semantics remain Docs-owned**  
When the primary intent is generate/extract/update documentation, the Docs domain/capability owns documentation intent and semantics even when Nuxt facts are central inputs. When README/introduction documentation is a subordinate required artefact of a Nuxt layer profile, Nuxt retains profile-completeness/orchestration authority while delegating documentation-specific modeling/generation semantics to DD-2.9 where those semantics are required.

<a id="dd-nuxtcap-076"></a>

**DD-NUXTCAP-076 — No duplicate Nuxt documentation subsystem**

Documentation modeling needed by a Nuxt scaffold follows [DD-NUXTCAP-075](#dd-nuxtcap-075).


---

## 26. Quality Boundary

<a id="dd-nuxtcap-077"></a>

**DD-NUXTCAP-077 — Nuxt validation is not quality execution**

Nuxt postconditions versus general Quality checks follows [DD-NUXTCAP-035](#dd-nuxtcap-035).

<a id="dd-nuxtcap-078"></a>

**DD-NUXTCAP-078 — Quality evidence may contribute to higher workflows**

Explicitly composed Quality evidence uses [DD-2.8 check/gate contracts](dd-2-8-quality-capability-detailed-design-v01.md) and owning workflow policy.


---

## 27. Process Execution Boundary

Nuxt providers may require package tooling or CLI execution for bounded technical work.

<a id="dd-nuxtcap-079"></a>

**DD-NUXTCAP-079 — Process completion is technical evidence**

Nuxt CLI/package-manager completion follows [Design](../appmanager-design-specification-v01.md#_11-11-workflow-results-failure-and-acceptance).

<a id="dd-nuxtcap-080"></a>

**DD-NUXTCAP-080 — No arbitrary command surface**  
Nuxt Capability shall not expose general process execution merely because some Nuxt tasks are implemented by commands.

<a id="dd-nuxtcap-081"></a>

**DD-NUXTCAP-081 — Executable/argument/shell boundaries remain DD-2.2**

Names, paths and profile inputs use [DD-PROC-014 structured arguments](dd-2-2-process-execution-detailed-design-v01.md#dd-proc-014) and the direct/shell contract.


---

## 28. Nuxt Provider Contract

A Nuxt provider may own technical mechanics including:

- Nuxt project/config recognition;
- parser/AST adapter integration;
- provider-native config traversal;
- supported entry extraction;
- mapping semantic changes to provider-specific source structures;
- Nuxt-specific validation adapters;
- optional Nuxt CLI interrogation;
- supported layer baseline checks.

<a id="dd-nuxtcap-082"></a>

**DD-NUXTCAP-082 — Provider normalization**

Nuxt native parser/CLI/error representations use [DD-1.2](../dd_1_application_core/dd-1-2-execution-outcomes-detailed-design-v01.md#_18-provider-result-normalization).

<a id="dd-nuxtcap-083"></a>

**DD-NUXTCAP-083 — Provider limitation is explicit**

Unsafe or ambiguous requested structures follows [DD-NUXTCAP-011](#dd-nuxtcap-011).

<a id="dd-nuxtcap-084"></a>

**DD-NUXTCAP-084 — Provider replaceability**

Consumer dependence on a particular Nuxt parser/CLI/source representation follows [Design](../appmanager-design-specification-v01.md#_6-6-capability-boundaries-and-providers).

<a id="dd-nuxtcap-085"></a>

**DD-NUXTCAP-085 — No speculative universal plugin framework**

Nuxt implementation topology follows the [Documentation Guide](../project-documentation-guide-v01.md#_8-level-4-implementation-specification); no executable plugin system, base class or cross-runtime transport is mandated.


---

## 29. Sensitive Information and Safety

The capability shall protect against at least:

- unmanaged/out-of-scope source mutation;
- path/symlink escape;
- arbitrary-file generation;
- overwrite of non-empty creation targets;
- whole-file config replacement when bounded transformation is available;
- loss of unsupported config/comments;
- secret fabrication or disclosure;
- command/argument injection;
- stale transformation plans;
- relationship duplication/conflict;
- repository relationship being mistaken for Nuxt integration;
- generated/AI text acquiring Nuxt authority;
- cross-owned scaffold artefacts transferring semantic authority into Nuxt by implication;
- provider-native structures escaping as application contracts.

<a id="dd-nuxtcap-086"></a>

**DD-NUXTCAP-086 — Non-empty target safety**  
Layer creation shall refuse or require an explicitly defined safe mode when the creation target contains existing content that could be overwritten or conflated with a new layer baseline.

<a id="dd-nuxtcap-087"></a>

**DD-NUXTCAP-087 — Source preservation**

Unrelated source/comments/ordering during Nuxt changes follows [Design](../appmanager-design-specification-v01.md#_7-10-non-destructive-transformation).

<a id="dd-nuxtcap-088"></a>

**DD-NUXTCAP-088 — Stale source is deliberate**

Stale Nuxt source plans apply [FR-XFORM-020](../functional/source-transformation-functional-specification-v01.md#fr-xform-020).


---

## 30. Cancellation, Progress and Partial State

<a id="dd-nuxtcap-089"></a>

**DD-NUXTCAP-089 — Cancellation propagates to delegated work**

Stop future Nuxt stages and propagate supported provider/process cancellation under [DD-1.2](../dd_1_application_core/dd-1-2-execution-outcomes-detailed-design-v01.md#_17-cancellation-model).

<a id="dd-nuxtcap-090"></a>

**DD-NUXTCAP-090 — Completed effects remain truthful**

Created/transformed/cross-owned/repository effects after stopping uses [DD-1.2](../dd_1_application_core/dd-1-2-execution-outcomes-detailed-design-v01.md#_17-cancellation-model).

<a id="dd-nuxtcap-091"></a>

**DD-NUXTCAP-091 — Progress identifies semantic stage**  
Long/composed Nuxt operations should expose stage/target progress where useful without making one UI/event transport normative.

<a id="dd-nuxtcap-092"></a>

**DD-NUXTCAP-092 — Partial state is not rollback**

Mixed Nuxt/resource/Git effects uses [DD-1.2](../dd_1_application_core/dd-1-2-execution-outcomes-detailed-design-v01.md#_14-partial-completion).


---

## 31. Interaction-Mode and Headless Semantics

<a id="dd-nuxtcap-093"></a>

**DD-NUXTCAP-093 — Presentation independence**

Equivalent Nuxt intents across callers follows [Design](../appmanager-design-specification-v01.md#_4-6-presentation-independence).

<a id="dd-nuxtcap-094"></a>

**DD-NUXTCAP-094 — Headless ambiguity fails**

Unresolved Headless target/profile/configuration/relationship input uses [FR-INV-020](../functional/application-invocation-functional-specification-v01.md#fr-inv-020) and [FR-INV-022](../functional/application-invocation-functional-specification-v01.md#fr-inv-022), returning structured diagnostics.

<a id="dd-nuxtcap-095"></a>

**DD-NUXTCAP-095 — Human labels are not canonical identity**  
Presentation labels for layers/profiles/config entries shall not substitute for stable semantic identity where automation requires it.

---

## 32. Relationship to DD-1 Outcomes

<a id="dd-nuxtcap-096"></a>

**DD-NUXTCAP-096 — Capability evidence feeds application outcome**

Nuxt recognition/validation/generation evidence follows [Design](../appmanager-design-specification-v01.md#_11-11-workflow-results-failure-and-acceptance).

<a id="dd-nuxtcap-097"></a>

**DD-NUXTCAP-097 — Mixed outcomes stay mixed**

Composed generated/modified-resource and stage results follows [DD-NUXTCAP-050](#dd-nuxtcap-050).

<a id="dd-nuxtcap-098"></a>

**DD-NUXTCAP-098 — No Boolean collapse**  
Recognition, semantic delegation, rendering, persistence/transformation, Nuxt validation, repository coordination and final application acceptance shall remain distinguishable where workflow decisions depend on them.

---

## 33. Current Implementation Evidence and Reconciliation

This section is historical implementation evidence under the [Documentation Guide reading conventions](../project-documentation-guide-v01.md#detailed-design-reading-conventions), not permanent product authority.

Current implementation evidence includes Nuxt-oriented templates/resource descriptors, source strategies capable of locating relevant source structures, Process Execution, current package metadata and existing command/service code that can coordinate project generation or manipulation.

These artefacts demonstrate useful implementation concerns such as:

- `nuxt.config`-oriented generated resources;
- Nuxt layer scaffold artefact classes;
- source-aware strategy mechanisms;
- package/process delegation;
- current Git and AI coordination mechanisms.

The following are not promoted into permanent architecture merely because current code/templates use them:

- one `nuxt.config.ts` syntax/layout as universal representation;
- one parser/regex strategy as permanent Nuxt intelligence;
- exact template names or files;
- exact package scripts or package manager;
- current hard-coded/default author/licence values where present;
- current direct service-to-service calls;
- exact layer directory structure;
- exact Nuxt version;
- direct filesystem writes from a Nuxt-oriented command/service;
- direct Git/AI/provider calls from Nuxt code;
- one TypeScript module/package topology.

<a id="dd-nuxtcap-099"></a>

**DD-NUXTCAP-099 — Implementation must converge on approved contracts**

Adapt existing Nuxt templates/strategies/services under the [Documentation Guide implementation boundary](../project-documentation-guide-v01.md#_8-level-4-implementation-specification).


---

## 34. Testability Requirements

Core Nuxt Capability contracts shall be testable without requiring a live remote provider or one parser/tool implementation.

Deterministic tests should cover at least:

- root versus layer recognition;
- standalone layer validity;
- host-relative integration state;
- repository-linked but not Nuxt-integrated state;
- supported versus unsupported config structures;
- manageable versus observe-only config entries;
- duplicate/equivalent/conflicting entries;
- add/remove semantic intent generation;
- bounded transformation preservation;
- stale source handling;
- successful Nuxt-specific post-validation;
- source-valid but Nuxt-invalid change;
- layer creation into empty target;
- refusal/safe mode for non-empty target;
- profile-driven scaffold classes;
- README/documentation artefact delegated through documentation semantics where required while remaining part of Nuxt profile acceptance;
- licence artefact rendered from governed licence/configuration input without Nuxt inventing licence-management semantics;
- missing effective config input;
- no fabricated secret behavior;
- optional AI enrichment unavailable;
- layer created with Git follow-on failure;
- repository success with Nuxt integration failure;
- already integrated layer;
- conflicting integration;
- detachment without deleting layer/repository;
- Headless ambiguity;
- provider substitution behind the same normalized contract.

<a id="dd-nuxtcap-100"></a>

**DD-NUXTCAP-100 — Fake-provider conformance**  
Core contracts shall be verifiable with deterministic fake Nuxt providers and fake lower-level capability evidence without requiring one real parser, Nuxt CLI, Git host or AI provider.

<a id="dd-nuxtcap-101"></a>

**DD-NUXTCAP-101 — Concrete-provider tests remain adapter-specific**  
Integration tests for actual Nuxt source forms, parser libraries, package tooling or Nuxt CLI behavior may verify provider mechanics but shall not define the application contract.

---

## 35. Conformance Invariants

Review target/fact/configuration contracts, supported add/remove semantics, Nuxt validity, host-relative layers, profile/scaffold contribution paths, integration/detachment and operation evidence. The testability section covers these distinctions; cross-owned artefacts follow the direct contracts in §16.

## 36. Traceability Summary

| Detailed Design concern | Primary authority |
|---|---|
| Nuxt authority/boundary | `FR-NUXT-001`–`012`; root Design delegated-authority rule |
| Nuxt facts/recognition | `FR-NUXT-013`–`020`; DD-1.3; DD-2.4 |
| config inspection/listing | `FR-NUXT-021`–`033`; DD-2.4 Source Intelligence |
| config add/remove | `FR-NUXT-034`–`050`; DD-2.5 Source Transformation |
| layer creation/scaffold orchestration | `FR-NUXT-051`–`070`; DD-2.1, DD-2.5, DD-2.6, DD-2.7, DD-2.9, Settings/application semantic boundaries, Repository/Git boundaries; scaffold ownership clarification |
| integration/detachment | `FR-NUXT-071`–`088`; DD-2.5; Repository/Git boundaries |
| lifecycle facts | `FR-NUXT-089`–`092`; DD-1.3 managed-project model |
| generic file/docs/app boundaries | `FR-NUXT-093`–`102`; DD-2.6, DD-2.9, Settings and App ownership |
| safety/transformation | `FR-NUXT-103`–`109`; DD-2.1, DD-2.5 |
| interaction modes | `FR-NUXT-110`–`113`; DD-1.1 |
| process/provider normalization | DD-2.2; ACG-007 |
| implementation replaceability | ADR-0001; root Design implementation-topology independence |

---

## 37. Contract Consumers and Implementation Dependencies {#_37-downstream-detailed-design-dependencies}

### 37.1 Domain Detailed Designs

The Nuxt-domain Detailed Design shall define concrete Nuxt application use cases and orchestration using DD-2.10 rather than duplicating recognition, config semantics, layer models or provider contracts.

App, Git, Docs, Settings, Quality and other domain Detailed Designs may participate in or consume Nuxt workflows while retaining their own semantic/workflow authority. The Nuxt domain may coordinate those contracts for a layer-creation result but shall not absorb their internal semantics.

### 37.2 Implementation Specification

Implementation planning shall determine concrete Nuxt source adapters, supported configuration classes, parser libraries, template/resource mappings, creation profiles, cross-owned artefact delegation adapters, process/tool integration, config serializers, Nuxt validation adapters, generated file paths, package-manager integration, version support and migration from current strategies/templates/services.

---

## 38. Deferred Implementation Decisions

This Detailed Design intentionally does not choose:

- a permanent Nuxt parser/AST library;
- exact supported `nuxt.config` syntax variants;
- exact Nuxt versions;
- exact configuration classes beyond those later committed by Implementation Specification/configuration;
- exact template filenames/text;
- exact layer directory layout;
- exact package manager;
- exact Nuxt CLI usage;
- exact Git coordination order;
- exact validation library;
- exact source formatting strategy;
- exact environment placeholder syntax;
- exact profile identifiers or default profile;
- exact logging/event transport;
- exact class/package/module topology;
- an executable Nuxt plugin framework.

These belong to Implementation Specification, effective configuration or a later ADR when a major architectural choice is intentionally introduced.

---

## 39. Final Design Position

The [architectural position](#_4-architectural-position) provides the collaboration map. The local models and workflows above, together with their direct upstream bindings, define the Version 1 contract; the conformance and testability sections provide the review route.
