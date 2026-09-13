# AppManager Nuxt Capability Detailed Design

> **Status:** Version 1 Detailed Design Specification
>
> **Detailed Design authority:** This document defines the permanent shared contracts for Nuxt-specific recognition, Nuxt configuration interpretation, supported Nuxt configuration mutation planning, Nuxt layer modeling, layer creation/scaffolding, layer integration/detachment evidence, Nuxt-specific validation and Nuxt provider normalization beneath AppManager application authority. It refines, but does not override, the root Design Specification, Functional Specifications, accepted ADRs, or the DD-1 Application Core Detailed Designs.
>
> **Governing sources:** `docs/project-documentation-guide-v01.md`, `docs/appmanager-design-specification-v01.md`, `docs/project_management/detailed-design-decomposition-plan-v01.md`, `docs/decisions/adr-0001-primary-application-runtime.md`
>
> **Related Detailed Design authorities:** `docs/detailed_design/application-invocation-detailed-design-v01.md`, `docs/detailed_design/execution-outcomes-detailed-design-v01.md`, `docs/detailed_design/managed-project-detailed-design-v01.md`, `docs/detailed_design/configuration-resolution-detailed-design-v01.md`, `docs/detailed_design/application-engine-detailed-design-v01.md`, `docs/detailed_design/resource-access-detailed-design-v01.md`, `docs/detailed_design/process-execution-detailed-design-v01.md`, `docs/detailed_design/repository-capability-detailed-design-v01.md`, `docs/detailed_design/source-intelligence-detailed-design-v01.md`, `docs/detailed_design/source-transformation-detailed-design-v01.md`, `docs/detailed_design/resource-registry-and-template-detailed-design-v01.md`, `docs/detailed_design/ai-capability-detailed-design-v01.md`, `docs/detailed_design/quality-capability-detailed-design-v01.md`, `docs/detailed_design/documentation-capability-detailed-design-v01.md`
>
> **Primary Functional authority:** `docs/functional/nuxt-functional-specification-v01.md`, together with owning-domain Functional Specifications where Nuxt facts or Nuxt-generated resources are consumed by another workflow.

---

## 1. Purpose

This specification defines the shared Nuxt Capability boundary used when AppManager must recognize, interpret, generate or validate Nuxt-specific project structures without allowing Nuxt providers, parsers, templates, package tooling or repository mechanics to acquire application authority.

The governing rules are:

> **Nuxt Capability owns Nuxt-specific technical semantics; the Application Engine and owning use case retain application intent, managed scope, authorization and final acceptance.**

> **Nuxt recognition produces Nuxt facts; recognition does not grant mutation authority.**

> **Nuxt configuration mutation must flow through Source Transformation; Nuxt Capability may define the semantic change but does not bypass transformation planning, preservation or stale-state safety.**

> **Layer creation and layer integration are distinct operations, and a Git repository relationship is distinct from a Nuxt composition relationship.**

This capability provides one coherent Nuxt-specific technical boundary beneath Nuxt-domain use cases and other approved workflows that consume Nuxt facts.

---

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
- scaffold content/resource requests supplied to Resource Registry and Template;
- generated Nuxt artefact semantics;
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
- test/lint/typecheck/gate semantics;
- generic arbitrary-file generation;
- user-facing settings CRUD;
- AI-provider selection or AI acceptance;
- final AppManager success, failure, partial-success or cancellation acceptance outside the bounded Nuxt result contract.

**DD-NUXTCAP-001 — Delegated execution remains subordinate**  
Nuxt Capability executes or evaluates bounded Nuxt-specific work selected by an authoritative caller and shall not invent application intent, managed scope, authorization or unrelated workflow continuation.

**DD-NUXTCAP-002 — Nuxt technical success is not application success**  
Parser success, generated files, package-tool completion, repository completion or syntactically valid Nuxt configuration shall not by themselves establish successful completion of the owning AppManager use case.

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
| semantic change intent / validation               |
| layer-profile / scaffold semantics               |
| Nuxt provider normalization                      |
+--------------------------+-----------------------+
                           |
          +----------------+----------------+
          |                |                |
          v                v                v
 Source Intelligence  Source Transformation  Registry/Templates
          |                |                |
          +----------------+----------------+
                           |
                 other bounded capabilities
                 (Resource Access / Git / Process)
```

**DD-NUXTCAP-003 — No alternate orchestration authority**  
Nuxt Capability shall not become a second Application Engine or a generic project workflow orchestrator merely because Nuxt use cases compose multiple capabilities.

**DD-NUXTCAP-004 — Shared capability versus Nuxt domain**  
Nuxt Capability supplies technical Nuxt semantics. The Nuxt functional domain owns Nuxt application intent and may orchestrate the capability with other domains/capabilities.

---

## 5. Nuxt Identity Model

Nuxt semantics depend on stable target identity rather than filesystem location alone.

A Nuxt target may represent:

- managed root application;
- managed Nuxt layer;
- standalone managed Nuxt layer;
- explicitly supported Nuxt configuration target;
- prospective layer-creation target prior to managed-project incorporation.

**DD-NUXTCAP-005 — Root and layer identities remain distinct**  
The capability shall not collapse the managed root application and managed layers into one undifferentiated Nuxt project identity.

**DD-NUXTCAP-006 — Filesystem presence is insufficient**  
A directory or `nuxt.config`-like file does not by itself establish managed Nuxt identity.

**DD-NUXTCAP-007 — Host-relative relationships**  
Layer integration state shall be interpretable relative to a resolved host/root identity because one layer may be integrated into one root and not another.

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

**DD-NUXTCAP-009 — Recognition consumes bounded evidence**  
Nuxt recognition should consume Managed Project, Source Intelligence and Resource Access evidence rather than independently crawling arbitrary filesystem scope.

**DD-NUXTCAP-010 — Recognition is not mutation authority**  
Recognition of a Nuxt target, config entry or layer relationship shall not authorize source changes, file creation, repository changes or process execution.

**DD-NUXTCAP-011 — Unsupported structure fails safely**  
A recognized-but-unsupported or ambiguous Nuxt structure shall produce explicit unsupported/ambiguous evidence rather than guessed semantics.

**DD-NUXTCAP-012 — Nuxt facts retain provenance**  
Facts derived from source, configuration or provider tooling shall retain sufficient provenance to distinguish observed structure from inferred or generated state where material.

---

## 7. Nuxt Configuration Target Model

A Nuxt project may contain more than one configuration-bearing resource. The capability therefore requires semantic target resolution before management operations.

**DD-NUXTCAP-013 — Explicit configuration target**  
A configuration inspection or mutation request shall resolve the Nuxt target and configuration resource unambiguously before consequential work.

**DD-NUXTCAP-014 — Root and layer config are independent**  
Root configuration and a layer's own configuration remain separately addressable where both exist.

**DD-NUXTCAP-015 — Current working directory is not identity**  
Working directory may contribute execution context but shall not be the canonical Nuxt configuration selector.

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

**DD-NUXTCAP-016 — Semantic representation is provider-independent**  
Provider/parser-native AST/CST/node objects shall remain below the shared Nuxt contract.

**DD-NUXTCAP-017 — Manageability is explicit**  
The capability shall distinguish configuration it can safely manage from configuration it can only observe.

**DD-NUXTCAP-018 — Unsupported content remains preserved evidence**  
Unsupported configuration shall not be discarded merely because the capability cannot manage it; where safe it should remain represented as opaque/unsupported context sufficient to protect preservation during transformation.

**DD-NUXTCAP-019 — Sensitive values are minimized**  
Secret-bearing runtime values or protected configuration shall not be exposed through ordinary Nuxt inspection merely to make the semantic view complete.

---

## 9. Configuration Listing

**DD-NUXTCAP-020 — Listing is non-mutating**  
Listing supported configuration entries shall not produce source changes or provider execution with consequential effects.

**DD-NUXTCAP-021 — Entry identity supports follow-on intent**  
Listed manageable entries shall expose enough identity/context for a subsequent explicit add/remove/update request to target the intended semantic entry without parsing presentation text.

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

**DD-NUXTCAP-023 — Nuxt intent precedes transformation**  
A transformation request shall be derived from an approved Nuxt semantic change rather than from arbitrary text-edit instructions.

**DD-NUXTCAP-024 — Transformation remains DD-2.5**  
Nuxt Capability shall not write config source directly in order to bypass Source Transformation preservation, stale-state, preview or validation contracts.

**DD-NUXTCAP-025 — Narrowest practical change**  
The semantic change contract shall identify the smallest Nuxt structure necessary to satisfy the requested intent so unrelated config can be preserved.

---

## 11. Add Configuration Semantics

**DD-NUXTCAP-026 — Supported-class gate**  
Only configuration classes with defined recognition, transformation and validation semantics may be added through the managed Nuxt contract.

**DD-NUXTCAP-027 — Equivalent existing entry**  
If an equivalent supported entry already exists, the capability shall report already-satisfied evidence rather than request duplicate insertion.

**DD-NUXTCAP-028 — Conflict is not duplicate**  
A conflicting existing entry shall remain distinguishable from an equivalent entry and shall require an explicit supported update/migration path or rejection.

**DD-NUXTCAP-029 — Add postcondition**  
The Nuxt-specific postcondition shall describe the intended semantic entry after transformation, independent of exact source formatting.

---

## 12. Remove Configuration Semantics

**DD-NUXTCAP-030 — Exact removal target**  
Removal shall resolve one supported semantic entry or explicitly bounded set before transformation.

**DD-NUXTCAP-031 — Already absent is distinct**  
A supported requested entry already absent may be represented as already-satisfied/no-op evidence rather than transformation failure.

**DD-NUXTCAP-032 — Removal consequence evidence**  
Known Nuxt-specific consequences of removing an entry or relationship shall be surfaced to the owning use case before authorization where material.

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

**DD-NUXTCAP-034 — Source-valid is insufficient**  
Successful Source Transformation validation does not by itself establish Nuxt semantic validity.

**DD-NUXTCAP-035 — Nuxt validation does not absorb Quality**  
Nuxt-specific validity shall not become general test/lint/typecheck/build authority.

**DD-NUXTCAP-036 — Validation result is evidence**  
Nuxt validity contributes to the owning use case outcome but does not override Application Engine policy, scope or final acceptance.

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

**DD-NUXTCAP-037 — Standalone is valid state**  
A supported layer may be valid while unintegrated into a particular host.

**DD-NUXTCAP-038 — Integration is host-relative**  
The capability shall not expose one global integrated Boolean when integration is specific to a host/root relationship.

**DD-NUXTCAP-039 — Repository-linked is separate state**  
Repository linkage may coexist with integrated/unintegrated Nuxt states and shall not be used as a synonym for Nuxt composition.

---

## 15. Layer Creation Profile

A creation profile is a declarative Nuxt capability contract describing the functional baseline to generate, not a hidden template filename set.

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

**DD-NUXTCAP-040 — Profile identity is semantic**  
Profiles shall be identified by documented capability intent rather than incidental template ordering or implementation filenames.

**DD-NUXTCAP-041 — Profile does not grant file authority**  
A profile specifies expected generated classes but does not authorize overwrite of existing resources.

**DD-NUXTCAP-042 — Effective configuration supplies values**  
Author, licence, naming, repository and similar configurable creation inputs shall consume explicit invocation values/effective configuration instead of hard-coded implementation defaults that compete with DD-1.4.

**DD-NUXTCAP-043 — No fabricated secrets**  
Required secret-bearing values shall be represented as absent, references or explicit placeholders according to policy; Nuxt Capability shall not invent real credentials.

---

## 16. Layer Scaffolding and Resource Registry

Layer scaffolding composes declarative resources from DD-2.6 under Nuxt semantics.

```text
selected Nuxt layer profile
        + effective inputs
        + validated target
            -> resolve required resource/template descriptors
            -> bind parameters
            -> deterministic render
            -> proposed layer artefacts
            -> creation authorization / collision checks
            -> Resource Access creation OR Source Transformation where existing
            -> Nuxt-specific validation
```

**DD-NUXTCAP-044 — Templates remain subordinate**  
Template availability or rendering does not determine Nuxt use-case intent, target scope, overwrite policy or final acceptance.

**DD-NUXTCAP-045 — Generated content is proposed content**  
Rendering a layer artefact does not itself persist the artefact.

**DD-NUXTCAP-046 — Existing target changes path**  
If a target artefact already exists, the owning use case shall apply explicit collision/update policy and route bounded modification through Source Transformation where applicable.

**DD-NUXTCAP-047 — No generic generator authority**  
The fact that template infrastructure can render arbitrary resources shall not cause Nuxt Capability to own arbitrary project-file generation.

---

## 17. Layer Creation Result Semantics

Layer creation may involve several independent stages.

Possible stages include:

- target validation;
- profile resolution;
- template/resource resolution;
- rendering;
- resource creation;
- Nuxt-specific validation;
- optional local repository coordination;
- optional remote repository coordination;
- optional documentation/AI enrichment.

**DD-NUXTCAP-048 — Created layer state is preserved on follow-on failure**  
If the layer scaffold is successfully created but an optional Git/remote/documentation follow-on fails, the result shall retain the created-layer fact and report the later failure separately.

**DD-NUXTCAP-049 — No universal atomicity claim**  
Nuxt Capability shall not imply transactional rollback across filesystem, Git and remote-provider effects unless lower-level contracts explicitly guarantee it.

**DD-NUXTCAP-050 — Partial creation is structured**  
Creation results shall identify completed stages, failed/skipped stages, created resources and recommended remaining actions where material.

---

## 18. Optional AI Enrichment

AI may assist descriptive/generated content but cannot define the layer baseline or Nuxt truth.

**DD-NUXTCAP-051 — AI is optional where deterministic baseline exists**  
A valid supported layer profile shall not require AI merely for descriptive enrichment if the deterministic baseline can be produced without it.

**DD-NUXTCAP-052 — AI output remains proposal**  
AI-generated README/description/other content shall pass the same scope, generation, validation and acceptance boundaries as deterministic generated content.

**DD-NUXTCAP-053 — Nuxt facts outrank generated claims**  
AI content shall not replace reliably recognized Nuxt/project facts with contradictory generated assertions.

---

## 19. Repository Coordination Boundary

Nuxt use cases may coordinate Git-domain operations but shall not reimplement repository semantics.

**DD-NUXTCAP-054 — Repository creation remains Git-owned**  
Local repository initialization, remote creation/association, commit and push are coordinated through the appropriate Git-domain/application use cases or Repository Capability contracts.

**DD-NUXTCAP-055 — Repository result remains separate evidence**  
Nuxt results shall preserve repository follow-on status separately from Nuxt scaffold/integration state where both are relevant.

**DD-NUXTCAP-056 — Git success does not prove Nuxt success**  
Successful repository/submodule coordination shall not establish a Nuxt integration relationship unless the Nuxt-specific postconditions are also satisfied.

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

**DD-NUXTCAP-057 — Integration requires existing layer**  
Integration shall not silently create a missing layer.

**DD-NUXTCAP-058 — Host identity is explicit**  
The root application receiving the relationship shall be resolved before integration planning.

**DD-NUXTCAP-059 — Eligibility precedes mutation**  
The candidate shall satisfy supported Nuxt-layer eligibility conditions before an integration source change is requested.

**DD-NUXTCAP-060 — Existing equivalent integration is no-op**  
An already equivalent integration shall be represented as already satisfied rather than duplicated.

**DD-NUXTCAP-061 — Conflicting integration requires explicit path**  
Conflicting/ambiguous existing relationships shall not be silently supplemented with another extends/integration entry.

---

## 21. Integration and Repository Relationship Composition

**DD-NUXTCAP-062 — Nuxt and Git relationships remain orthogonal**  
A composed integration workflow shall model Nuxt relationship state and repository relationship state separately.

**DD-NUXTCAP-063 — Order is owned by use-case orchestration**  
Whether repository coordination precedes/follows the Nuxt source change is an owning-use-case workflow decision and shall not be hidden inside a provider.

**DD-NUXTCAP-064 — Partial relationship state is explicit**  
If one relationship succeeds and another fails, the result shall report the actual pair of states and corrective action rather than collapse to one Boolean.

---

## 22. Layer Detachment

Nuxt detachment removes a host-relative Nuxt composition relationship without implying deletion of the layer or repository relationship.

**DD-NUXTCAP-065 — Detachment targets one relationship**  
The exact host/layer relationship shall be resolved before transformation.

**DD-NUXTCAP-066 — Detachment does not delete layer resources**  
Removing the Nuxt relationship shall not implicitly delete the layer project, local repository, remote repository or unrelated Git relationship.

**DD-NUXTCAP-067 — Git cleanup is separate intent**  
Repository/submodule cleanup, if requested, shall be a separately authorized Git operation.

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

**DD-NUXTCAP-069 — Lifecycle facts are descriptive**  
Reported state shall not itself authorize integration, deletion, repository changes or application lifecycle operations.

**DD-NUXTCAP-070 — App lifecycle remains App-owned**  
Nuxt-generated state observations shall not create a duplicate clean/install/reset/reinitialise lifecycle beneath Nuxt Capability.

---

## 24. Generic File Generation Boundary

**DD-NUXTCAP-071 — Nuxt-specific semantic purpose required**  
Nuxt Capability may request generation of resources only where the resource class participates in a defined Nuxt use case/profile.

**DD-NUXTCAP-072 — Deployment/provider files are not Nuxt by default**  
A hosting/deployment provider artefact does not become Nuxt-owned merely because it is used by a Nuxt application.

**DD-NUXTCAP-073 — Generator capability does not define domain ownership**  
Technical ability to render/create a file does not determine that Nuxt owns the application intent.

---

## 25. Documentation Boundary

**DD-NUXTCAP-074 — Nuxt may supply facts to Docs**  
Nuxt-specific facts may be consumed by DD-2.9 Documentation Capability without transferring Nuxt semantic authority.

**DD-NUXTCAP-075 — Documentation intent remains Docs-owned**  
When the primary intent is generate/extract/update documentation, the Docs domain/capability owns documentation semantics even when Nuxt facts are central inputs.

**DD-NUXTCAP-076 — No duplicate Nuxt documentation subsystem**  
Nuxt Capability shall not establish a parallel documentation generator for use cases already owned by Documentation Capability.

---

## 26. Quality Boundary

**DD-NUXTCAP-077 — Nuxt validation is not quality execution**  
Nuxt-specific postconditions may confirm Nuxt semantics, but tests, lint, type checking, coverage and quality gates remain DD-2.8/Quality-domain responsibilities.

**DD-NUXTCAP-078 — Quality evidence may contribute to higher workflows**  
An owning Nuxt use case may consume Quality evidence where explicitly required, but Quality result interpretation remains governed by DD-2.8 and application policy.

---

## 27. Process Execution Boundary

Nuxt providers may require package tooling or CLI execution for bounded technical work.

**DD-NUXTCAP-079 — Process completion is technical evidence**  
A Nuxt CLI/package-manager process completing successfully shall not alone establish Nuxt acceptance.

**DD-NUXTCAP-080 — No arbitrary command surface**  
Nuxt Capability shall not expose general process execution merely because some Nuxt tasks are implemented by commands.

**DD-NUXTCAP-081 — Executable/argument/shell boundaries remain DD-2.2**  
Provider execution shall preserve Process Execution safety and shall not construct unchecked shell fragments from project names, paths or profile inputs.

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

**DD-NUXTCAP-082 — Provider normalization**  
Provider-native ASTs, parser nodes, CLI output and exceptions shall be normalized into the shared Nuxt contracts before application interpretation.

**DD-NUXTCAP-083 — Provider limitation is explicit**  
A provider unable to safely interpret or mutate a requested structure shall return unsupported/ambiguous evidence rather than guess.

**DD-NUXTCAP-084 — Provider replaceability**  
Callers shall not require one parser library, Nuxt CLI, AST shape or source format to consume shared Nuxt facts/results.

**DD-NUXTCAP-085 — No speculative universal plugin framework**  
Provider replaceability does not require an executable plugin system, common base class or cross-runtime transport in Version 1.

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
- provider-native structures escaping as application contracts.

**DD-NUXTCAP-086 — Non-empty target safety**  
Layer creation shall refuse or require an explicitly defined safe mode when the creation target contains existing content that could be overwritten or conflated with a new layer baseline.

**DD-NUXTCAP-087 — Source preservation**  
Nuxt semantic changes shall request bounded transformations that preserve unrelated user source/comments/ordering/formatting where practical.

**DD-NUXTCAP-088 — Stale source is deliberate**  
Where relevant source changed after inspection/planning, the transformation/use case shall revalidate, replan or fail rather than blindly apply stale intent.

---

## 30. Cancellation, Progress and Partial State

**DD-NUXTCAP-089 — Cancellation propagates to delegated work**  
Cancellation shall stop future Nuxt stages and propagate to active delegated provider/process work where supported.

**DD-NUXTCAP-090 — Completed effects remain truthful**  
Cancellation/failure shall not erase already created resources, applied transformations, repository effects or remote effects from the result.

**DD-NUXTCAP-091 — Progress identifies semantic stage**  
Long/composed Nuxt operations should expose stage/target progress where useful without making one UI/event transport normative.

**DD-NUXTCAP-092 — Partial state is not rollback**  
Partial Nuxt/Git/resource effects shall be represented as actual consequential state unless rollback is explicitly guaranteed by lower-level contracts.

---

## 31. Interaction-Mode and Headless Semantics

**DD-NUXTCAP-093 — Presentation independence**  
Equivalent Nuxt intents expressed through TUI, Headless, IDE or future adapters shall reach equivalent capability semantics.

**DD-NUXTCAP-094 — Headless ambiguity fails**  
Headless execution shall not prompt for unresolved target/profile/config/integration identity and shall return structured ambiguity/unresolved-input diagnostics.

**DD-NUXTCAP-095 — Human labels are not canonical identity**  
Presentation labels for layers/profiles/config entries shall not substitute for stable semantic identity where automation requires it.

---

## 32. Relationship to DD-1 Outcomes

**DD-NUXTCAP-096 — Capability evidence feeds application outcome**  
Nuxt recognition/validation/generation/integration results shall be supplied to the owning use case/Application Engine for final interpretation under DD-1.2.

**DD-NUXTCAP-097 — Mixed outcomes stay mixed**  
Composed operations shall preserve generated/modified resources, Nuxt relationship state, Git relationship state and failed/unattempted stages rather than collapsing prematurely.

**DD-NUXTCAP-098 — No Boolean collapse**  
Recognition, transformation, Nuxt validation, repository coordination and final application acceptance shall remain distinguishable where workflow decisions depend on them.

---

## 33. Current Implementation Evidence and Reconciliation

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

**DD-NUXTCAP-099 — Implementation must converge on approved contracts**  
Future Implementation Specifications shall adapt existing Nuxt templates/strategies/services to this Detailed Design rather than weakening the design to preserve incidental implementation topology.

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

**DD-NUXTCAP-100 — Fake-provider conformance**  
Core contracts shall be verifiable with deterministic fake Nuxt providers and fake lower-level capability evidence without requiring one real parser, Nuxt CLI, Git host or AI provider.

**DD-NUXTCAP-101 — Concrete-provider tests remain adapter-specific**  
Integration tests for actual Nuxt source forms, parser libraries, package tooling or Nuxt CLI behavior may verify provider mechanics but shall not define the application contract.

---

## 35. Conformance Invariants

A conforming DD-2.10 implementation shall preserve all of the following:

1. Nuxt Capability is a shared technical capability beneath application authority.
2. Nuxt-specific intent remains owned by the Nuxt domain/Application Engine.
3. Recognition is evidence-producing and does not grant mutation authority.
4. Root application and layer identities remain distinct.
5. Layer integration is host-relative.
6. Nuxt relationship and repository relationship remain distinct.
7. Filesystem/repository presence alone does not establish Nuxt integration.
8. Configuration target identity is explicit.
9. Shared Nuxt config contracts are semantic, not provider-AST/native source contracts.
10. Manageable and observe-only config remain distinguishable.
11. Unsupported config is not silently rewritten.
12. Sensitive Nuxt/runtime values are minimized.
13. Add/remove/update semantic intent precedes transformation.
14. Source Transformation owns mutation mechanics, preservation and stale-state application.
15. Equivalent config entry does not get duplicated.
16. Conflicting config does not get silently duplicated.
17. Source validity and Nuxt semantic validity are distinct.
18. Nuxt validation does not absorb general Quality authority.
19. Standalone layers remain valid independent of host integration.
20. Creation profiles are semantic capability sets, not hidden file lists.
21. Template rendering does not persist by implication.
22. Existing resources do not get overwritten without explicit collision/update policy.
23. Nuxt does not become a generic file-generation authority.
24. AI enrichment remains optional/non-authoritative where deterministic baseline exists.
25. Git/repository semantics remain Git-owned.
26. Scaffold success is preserved even if optional Git/remote follow-on fails.
27. No universal atomicity is claimed across filesystem/Git/remote effects.
28. Integration requires an existing eligible layer and explicit host.
29. Already integrated and conflicting integration states remain distinct.
30. Detachment does not imply layer/repository deletion.
31. App lifecycle remains App-owned.
32. Docs intent remains Docs-owned.
33. Provider/process completion is technical evidence, not Nuxt acceptance.
34. Provider-native parser/CLI objects remain below normalized contracts.
35. Headless execution does not prompt or guess unresolved Nuxt identity.
36. Current templates/strategies/service topology do not define permanent architecture.

---

## 36. Traceability Summary

| Detailed Design concern | Primary authority |
|---|---|
| Nuxt authority/boundary | `FR-NUXT-001`–`012`; root Design delegated-authority rule |
| Nuxt facts/recognition | `FR-NUXT-013`–`020`; DD-1.3; DD-2.4 |
| config inspection/listing | `FR-NUXT-021`–`033`; DD-2.4 Source Intelligence |
| config add/remove | `FR-NUXT-034`–`050`; DD-2.5 Source Transformation |
| layer creation | `FR-NUXT-051`–`070`; DD-2.1, DD-2.6, DD-2.7, Repository/Git boundaries |
| integration/detachment | `FR-NUXT-071`–`088`; DD-2.5; Repository/Git boundaries |
| lifecycle facts | `FR-NUXT-089`–`092`; DD-1.3 managed-project model |
| generic file/docs/app boundaries | `FR-NUXT-093`–`102`; DD-2.6, DD-2.9, App ownership |
| safety/transformation | `FR-NUXT-103`–`109`; DD-2.1, DD-2.5 |
| interaction modes | `FR-NUXT-110`–`113`; DD-1.1 |
| process/provider normalization | DD-2.2; ACG-007 |
| implementation replaceability | ADR-0001; root Design implementation-topology independence |

---

## 37. Downstream Detailed Design Dependencies

### 37.1 Domain Detailed Designs

The later Nuxt-domain Detailed Design shall define concrete Nuxt application use cases and orchestration using DD-2.10 rather than duplicating recognition, config semantics, layer models or provider contracts.

App, Git, Docs, Quality and other domain Detailed Designs may consume Nuxt facts/results while retaining their own workflow authority.

### 37.2 Implementation Specification

Implementation planning shall determine concrete Nuxt source adapters, supported configuration classes, parser libraries, template/resource mappings, creation profiles, process/tool integration, config serializers, Nuxt validation adapters, generated file paths, package-manager integration, version support and migration from current strategies/templates/services.

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

The permanent Version 1 position is:

> **Nuxt Capability owns provider-independent Nuxt recognition, supported configuration semantics, Nuxt layer modeling, Nuxt-specific generation intent and Nuxt validity evidence; managed scope, source mutation mechanics, repository semantics, generic lifecycle, documentation, quality and final application acceptance remain outside it.**

The canonical model is:

```text
owning Nuxt use case / managed target / effective policy
                    |
                    v
              Nuxt Capability
                    |
      recognize Nuxt identity and facts
      interpret supported config/layer semantics
      derive bounded semantic change/generation intent
                    |
      +-------------+-------------+
      |             |             |
      v             v             v
 Source         Registry/       Repository/
 Transformation Templates       Process/etc.
      |             |             |
      +-------------+-------------+
                    |
           Nuxt-specific validation
                    |
                    v
          normalized Nuxt evidence
                    |
                    v
       Application Engine / owning use case
```

The central non-drift rule is:

> **Nuxt-specific knowledge may determine what a supported Nuxt change means; it does not grant authority to change unrelated project state or decide what AppManager does next.**
