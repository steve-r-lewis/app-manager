# AppManager Nuxt Functional Specification

> **Status:** Version 1 Functional Specification
>
> **Functional authority:** Observable application-level behaviour for Nuxt-specific project inspection, Nuxt configuration management, Nuxt-layer creation and integration, and Nuxt-specific project facts within AppManager-managed projects.
>
> **Governing authorities:** `docs/project-documentation-guide-v01.md`, `docs/appmanager-design-specification-v01.md`
>
> **Related Functional Specifications:** `application-invocation-functional-specification-v01.md`, `managed-project-functional-specification-v01.md`, `configuration-functional-specification-v01.md`, `source-transformation-functional-specification-v01.md`, `app-functional-specification-v01.md`, `git-functional-specification-v01.md`, `settings-functional-specification-v01.md`
>
> **Related Detailed Design clarification:** `docs/detailed_design/nuxt-layer-scaffold-artefact-ownership-clarification-v01.md`
>
> **Planning source:** `docs/project_management/functional-specification-decomposition-plan-v01.md`

---

## 1. Purpose

This specification defines the observable Version 1 behaviour of the AppManager `nuxt` functional domain.

The `nuxt` domain owns use cases whose primary product identity is Nuxt-specific structure, configuration, layer lifecycle, and Nuxt-aware project interpretation.

The governing question is:

> **What Nuxt-specific behaviour must AppManager provide for the managed root application and its constituent layers?**

The central functional boundary is:

> **The `nuxt` domain owns Nuxt-specific intent. It does not own general application lifecycle, Git, documentation, quality, settings, generic file generation, or source-transformation mechanics merely because those capabilities may be used while managing a Nuxt project.**

Nuxt operations may coordinate other domains and capabilities, but delegated execution does not transfer application authority.

---

## 2. Scope

This specification owns functional behaviour for:

- exposing Nuxt-specific facts about the managed root application and managed layers;
- inspecting the effective Nuxt project structure relevant to approved use cases;
- inspecting supported Nuxt configuration;
- listing supported Nuxt configuration entries;
- adding supported Nuxt configuration entries;
- removing supported Nuxt configuration entries;
- validating Nuxt configuration changes at the application level;
- creating a new Nuxt layer as a valid layer project;
- preserving the distinction between standalone layer creation and integration into a host managed project;
- integrating an eligible layer into a managed root application's Nuxt layer topology where requested;
- coordinating Git repository creation/relationships through the `git` domain without taking ownership of Git semantics;
- exposing layer lifecycle state and integration status where functionally relevant;
- structured outcomes, diagnostics, safety, Headless equivalence, and partial success for Nuxt-specific operations.

---

## 3. Explicitly Out of Scope

This specification does not define:

- concrete parser, AST, scanner, strategy, or code-transformation implementations;
- concrete TypeScript interfaces, classes, source files, registries, or module layout;
- exact `nuxt.config` source syntax or formatting rules at the Functional level;
- exact Nuxt package versions or package-manager command strings;
- application build, preview, clean, reset, reinitialise, post-install, or generic package-script execution, which belong to `app`;
- Git commit, push, synchronisation, remote creation, remote deletion, or repository-relationship mechanics, which belong to `git`;
- general documentation generation or extraction, which belongs to `docs` when documentation is the primary user intent;
- quality/test execution, which belongs to `quality`;
- generic environment cleanup or dependency reinstall semantics;
- generic creation of arbitrary files such as provider-specific deployment files unless a separate domain use case owns that intent;
- user-facing settings CRUD or configuration precedence semantics;
- general AI behaviour;
- concrete template-engine or generator implementation.

---

## 4. Domain Boundary and Functional Model

### 4.1 Nuxt-specific product identity

A use case belongs to `nuxt` when its meaning depends materially on Nuxt concepts such as Nuxt configuration, Nuxt layers, Nuxt extends relationships, or Nuxt-specific project validity.

### 4.2 Root application versus layer

The managed root application and each managed Nuxt layer are distinct project resources. A layer may have its own source, package metadata, configuration, repository identity, and lifecycle while participating in the root application's Nuxt composition.

### 4.3 Layer creation versus layer integration

Version 1 distinguishes two separate operations:

1. **layer creation** — establish a valid Nuxt layer project;
2. **layer integration** — make an eligible layer participate in a managed root application's Nuxt topology.

A layer can exist successfully before it is integrated into a particular root application.

### 4.4 Integration versus repository relationship

A Nuxt layer relationship and a Git repository relationship are not the same thing.

A layer may be configured as part of a Nuxt application while its repository relationship is managed separately. Conversely, creation of a Git relationship does not by itself establish that the root application's Nuxt configuration extends or consumes that layer.

### 4.5 Cross-cutting authority

The following remain authoritative in their respective specifications:

- invocation, availability, confirmation, cancellation, structured outcomes, and interaction-mode equivalence: `FR-INV-*`;
- managed-project context, root/layer identity, managed scope, and mutation authority: `FR-PROJ-*`;
- candidate and effective configuration: `FR-CONFIG-*`;
- source inspection, bounded transformation, validation, and application acceptance: `FR-XFORM-*`;
- root-application lifecycle: `FR-APP-*`;
- repository semantics and repository relationships: `FR-GIT-*`;
- user-facing application metadata, licence-selection/management intent, and environment-definition CRUD: `FR-SET-*`.

---

## 5. General Nuxt-Domain Requirements

### FR-NUXT-001 — Coherent Nuxt-domain semantics
AppManager shall provide one coherent set of Nuxt-domain semantics across supported interaction modes and host integrations.

### FR-NUXT-002 — Application Engine authority
The Application Engine shall retain authority over Nuxt use-case intent, scope, policy, safety, delegated-result interpretation, and final application-level outcomes.

### FR-NUXT-003 — Nuxt intent over implementation mechanism
A Nuxt-domain operation shall represent Nuxt-specific application intent rather than expose a parser, template, package-manager command, Git method, or filesystem routine as the primary product abstraction.

### FR-NUXT-004 — Managed project required where applicable
Operations against an existing Nuxt application or layer shall require managed-project context sufficient to resolve the intended root application, layer, or Nuxt configuration target.

### FR-NUXT-005 — Explicit target identity
A consequential Nuxt operation shall establish whether it targets the root application, one selected layer, or another explicitly supported Nuxt resource before mutation begins.

### FR-NUXT-006 — Discovery is not mutation authority
Recognition of a Nuxt application, layer, configuration file, or extends relationship shall not by itself authorise mutation.

### FR-NUXT-007 — No implicit scope expansion
A Nuxt operation targeting one root application or layer shall not silently mutate other layers or repositories merely because they participate in the same managed project.

### FR-NUXT-008 — Effective configuration consumption
Where Nuxt behaviour depends on configurable AppManager values, it shall consume effective configuration according to the Configuration Functional Specification.

### FR-NUXT-009 — Capability delegation is subordinate
A parser, generator, Git provider, filesystem mechanism, package manager, AI provider, or other delegated capability shall not redefine Nuxt use-case intent, scope, safety, or acceptance criteria.

### FR-NUXT-010 — Lower-level success is not automatically Nuxt success
Successful file generation, source parsing, Git execution, or provider execution shall not by itself establish successful completion of the Nuxt use case.

### FR-NUXT-011 — Nuxt-specific validation
Where a Nuxt use case has Nuxt-specific validity conditions, AppManager shall evaluate them before representing the use case as successful.

### FR-NUXT-012 — Structured diagnostics
Nuxt failures shall identify the affected root application, layer, configuration target, or integration stage where that distinction is material.

---

## 6. Nuxt Project Facts and Inspection

### FR-NUXT-013 — Nuxt facts exposure
AppManager shall be able to expose Nuxt-specific facts required by approved use cases without mutating the managed project.

### FR-NUXT-014 — Root Nuxt identity
AppManager shall distinguish the managed root Nuxt application from managed Nuxt layers.

### FR-NUXT-015 — Layer identity
AppManager shall expose the identity of recognised managed Nuxt layers sufficiently to distinguish them from arbitrary directories and non-layer project resources.

### FR-NUXT-016 — Nuxt relationship facts
Where knowable, AppManager shall expose whether a layer is configured as part of the root application's Nuxt composition.

### FR-NUXT-017 — Repository relationship is distinct
Nuxt inspection shall not infer that a layer is integrated into Nuxt composition solely because a Git repository or submodule relationship exists.

### FR-NUXT-018 — Configuration target facts
AppManager shall expose which Nuxt configuration target is authoritative for the operation being requested where more than one Nuxt application or layer configuration exists.

### FR-NUXT-019 — Unsupported structure diagnostics
If AppManager recognises a Nuxt project shape but cannot safely interpret the relevant Nuxt structure, it shall report an unsupported or ambiguous condition rather than fabricate project facts.

### FR-NUXT-020 — Inspection is non-authorising
Inspection of Nuxt structure or configuration shall not grant subsequent mutation authority.

---

## 7. Nuxt Configuration Inspection

### FR-NUXT-021 — Nuxt configuration inspection use case
AppManager shall provide an observable use case for inspecting supported Nuxt configuration of the selected Nuxt target.

### FR-NUXT-022 — Root configuration inspection
AppManager shall support inspection of the managed root application's supported Nuxt configuration.

### FR-NUXT-023 — Layer configuration inspection
Where a managed layer has its own supported Nuxt configuration, AppManager shall support inspecting that configuration independently.

### FR-NUXT-024 — Supported semantic view
Inspection shall expose supported configuration semantically rather than requiring callers to interpret raw source text.

### FR-NUXT-025 — Source preservation
Configuration inspection shall not modify source.

### FR-NUXT-026 — Unsupported entries
AppManager may expose unsupported or unrecognised configuration as opaque/unsupported information where safe, but shall not imply that it can manage entries it cannot safely understand.

### FR-NUXT-027 — Configuration provenance
Where diagnostically useful, AppManager should identify which Nuxt target/source contributes a reported supported configuration entry.

### FR-NUXT-028 — Sensitive information
Nuxt configuration inspection shall minimise exposure of sensitive values where Nuxt configuration references credentials, private runtime values, or secret-bearing configuration.

---

## 8. List Supported Nuxt Configuration Entries

### FR-NUXT-029 — List use case
AppManager shall provide a use case for listing supported manageable Nuxt configuration entries for the selected Nuxt target.

### FR-NUXT-030 — Entry identity
Each listed manageable entry shall have an identity sufficient for subsequent explicit add, update where supported, or remove operations.

### FR-NUXT-031 — Structural context
Where the same value or key can occur in materially different Nuxt configuration contexts, AppManager shall expose enough structural context to disambiguate it.

### FR-NUXT-032 — Managed versus observed distinction
AppManager shall distinguish entries it can safely manage from entries it can only observe.

### FR-NUXT-033 — Stable machine-consumable result
Headless callers shall be able to consume listed configuration entries without parsing terminal-formatted source text.

---

## 9. Add Nuxt Configuration

### FR-NUXT-034 — Add configuration use case
AppManager shall support adding a supported Nuxt configuration entry to an explicitly selected Nuxt target.

### FR-NUXT-035 — Supported configuration classes
Only configuration classes that AppManager can recognise, validate, and safely transform shall be eligible for managed addition.

### FR-NUXT-036 — Explicit configuration intent
The requested configuration entry, target, and intended semantic location shall be explicit or deterministically resolvable before a change is proposed.

### FR-NUXT-037 — Existing equivalent entry
Where an equivalent entry already exists, AppManager shall report that state rather than blindly duplicating the configuration.

### FR-NUXT-038 — Conflict handling
Where an existing entry conflicts with the requested addition, AppManager shall require an explicitly defined update/replacement path or refuse the addition rather than silently creating contradictory configuration.

### FR-NUXT-039 — Bounded transformation
Adding configuration shall use the Source Transformation Functional Specification and shall not opportunistically reformat or rewrite unrelated configuration.

### FR-NUXT-040 — Proposed change reviewability
Where required by transformation or invocation policy, the intended configuration change shall be reviewable before persistence.

### FR-NUXT-041 — Nuxt-level validation
After source-level transformation validation, AppManager shall apply applicable Nuxt-specific acceptance criteria before representing the addition as successful.

### FR-NUXT-042 — Preserve unsupported content
Supported configuration addition shall preserve unrelated and unsupported configuration content where practical.

### FR-NUXT-043 — Add outcome
The result shall identify the target, requested semantic entry, whether it was added, already present, rejected, cancelled, or failed.

---

## 10. Remove Nuxt Configuration

### FR-NUXT-044 — Remove configuration use case
AppManager shall support removal of a supported manageable Nuxt configuration entry from an explicitly selected Nuxt target.

### FR-NUXT-045 — Exact target resolution
The entry to remove shall be resolved unambiguously before mutation begins.

### FR-NUXT-046 — Missing entry behaviour
If the requested manageable entry is already absent, AppManager may report it as already absent rather than treating that state as an opaque transformation failure.

### FR-NUXT-047 — No broad deletion
Removing one configuration entry shall not remove sibling configuration, comments, unrelated values, or unsupported source merely because they occupy the same source structure.

### FR-NUXT-048 — Consequence awareness
Where removal would materially invalidate a known Nuxt relationship or supported application requirement, AppManager shall expose that consequence and apply applicable confirmation or refusal policy.

### FR-NUXT-049 — Bounded removal transformation
Configuration removal shall follow `FR-XFORM-*` semantics for bounded intent, preservation, validation, and application-level acceptance.

### FR-NUXT-050 — Remove outcome
The result shall identify the target entry and whether it was removed, already absent, rejected, cancelled, or failed.

---

## 11. Nuxt Layer Creation

### 11.1 Purpose

Nuxt-layer creation establishes a new Nuxt layer project. Version 1 assigns singular functional ownership of this use case to the `nuxt` domain.

Layer-creation ownership is **orchestration ownership**. It means the `nuxt` domain owns the composed request to establish the selected Nuxt layer baseline, including which artefact classes the selected profile requires and whether the resulting layer satisfies the Nuxt-specific creation contract. It does not mean Nuxt acquires the permanent internal semantics of every artefact class participating in that scaffold.

Where a scaffold artefact has an existing semantic owner, layer creation shall delegate to that owner and consume the result as subordinate evidence. Rendering and persistence likewise remain with their owning capabilities. The canonical detailed delegation model is defined by `nuxt-layer-scaffold-artefact-ownership-clarification-v01.md`.

### FR-NUXT-051 — Layer creation use case
AppManager shall provide a `nuxt` use case for creating a new Nuxt layer project.

### FR-NUXT-052 — Nuxt ownership
Layer creation shall not be duplicated as an independent `app` implementation. The `app` domain may recommend or coordinate this Nuxt use case as a follow-on operation.

### FR-NUXT-053 — Layer identity
Before consequential creation begins, AppManager shall resolve the intended layer identity and target location sufficiently to prevent accidental creation over unrelated content.

### FR-NUXT-054 — Target safety
AppManager shall refuse or require a deliberately defined safe mode when the layer creation target is non-empty or would overwrite an existing project.

### FR-NUXT-055 — Valid Nuxt layer baseline
A successful creation shall establish a project structure sufficient to represent a valid supported Nuxt layer baseline under the selected creation profile.

### FR-NUXT-056 — Standalone capability
Version 1 layer creation shall support creating a layer as a standalone project that can exist, be developed, tested, versioned, and documented independently of one particular root application where the selected profile requires that capability.

### FR-NUXT-057 — Creation profile
Where more than one layer profile is supported, the selected profile shall represent a documented functional capability set rather than an arbitrary hidden template variant.

### FR-NUXT-058 — Generated artefact classes
Layer creation may require applicable artefact classes including package metadata, Nuxt configuration, TypeScript configuration, ignore rules, environment/example configuration, README/introduction material, licence material, and test configuration according to the selected profile. Inclusion in the profile establishes Nuxt-layer baseline/orchestration intent only; it does not transfer the artefact class's independent semantic authority to the `nuxt` domain where another domain or shared capability owns that semantic contract.

### FR-NUXT-059 — Exact file set below Functional level
This specification shall not mandate exact template filenames, template functions, source text, or concrete rendering/persistence mechanisms for the generated artefacts. Detailed Design shall preserve semantic ownership boundaries while coordinating the required scaffold.

### FR-NUXT-060 — Effective configuration during creation
Author identity, licence choice, repository defaults, naming policy, visibility defaults, or similar configurable inputs shall use explicit invocation values or effective configuration according to `FR-CONFIG-*`. Where a value participates in a separately owned semantic contract, layer creation shall consume that contract rather than establish a competing Nuxt-specific source of truth.

### FR-NUXT-061 — No fabricated secrets
Layer creation shall not fabricate secret values to make generated environment material appear complete.

### FR-NUXT-062 — Optional AI enrichment
AI may assist generation of descriptive or documentation content where available, but layer creation shall not require AI in order to produce a valid supported layer baseline. Documentation-specific modeling/generation semantics remain owned by the documentation boundary even when the resulting documentation artefact is required by the Nuxt layer profile.

### FR-NUXT-063 — AI output non-authoritative
AI-generated layer content shall remain subject to the same generation, validation, and application-acceptance rules as non-AI content.

### FR-NUXT-064 — Generation versus mutation
Creation of new layer artefacts shall follow generation semantics. Encountering existing artefacts requiring modification or replacement shall invoke applicable source-transformation and safety semantics. The Nuxt use case authorizes the composed layer-creation intent; lower-level resource creation or source modification remains governed by the owning persistence/mutation boundary.

### FR-NUXT-065 — Local repository optional coordination
Layer creation may coordinate initialisation of a local repository through the `git` domain when requested or required by the selected layer profile.

### FR-NUXT-066 — Remote repository optional coordination
Layer creation may coordinate creation or association of a remote repository through Git/provider capabilities when explicitly requested and supported.

### FR-NUXT-067 — Git semantics remain Git-owned
Nuxt layer creation shall not redefine repository initialisation, remote creation, remote association, commit, push, or repository-relationship semantics.

### FR-NUXT-068 — Repository failure isolation
If the Nuxt layer scaffold succeeds but an optional Git or remote follow-on step fails, AppManager shall report the successfully created layer and the Git-stage failure separately rather than falsely claiming that the layer does not exist.

### FR-NUXT-069 — No false creation atomicity
Unless lower-level specifications deliberately provide transactional creation, AppManager shall not imply that layer scaffolding and all optional external follow-on actions are universally atomic.

### FR-NUXT-070 — Creation result
A successful or partial layer-creation result shall identify the created layer, selected profile or material creation choices, completed follow-on actions, and remaining recommended actions. Subordinate artefact-generation, documentation, licence/resource, persistence, transformation, Git, AI, or quality evidence shall remain distinguishable where relevant to explaining the final layer-creation outcome.

---

## 12. Layer Integration into a Managed Root Application

### 12.1 Purpose

Layer integration makes an existing eligible Nuxt layer participate in the managed root application's Nuxt composition. It is separate from creating the layer itself.

### FR-NUXT-071 — Layer integration use case
AppManager shall support integrating an eligible Nuxt layer into a managed root application where Version 1 supports that layer relationship.

### FR-NUXT-072 — Existing layer required
Integration shall operate on an existing layer identity; it shall not silently create a new layer when the caller intended only to integrate one.

### FR-NUXT-073 — Root target required
The host root application into which the layer will be integrated shall be explicitly resolved through managed-project context.

### FR-NUXT-074 — Layer eligibility
Before integration, AppManager shall validate that the candidate is a supported Nuxt layer and is eligible for the intended root application relationship.

### FR-NUXT-075 — Integration is not repository linking
A successful Git relationship or submodule addition shall not by itself be represented as successful Nuxt integration.

### FR-NUXT-076 — Repository linking may be coordinated
Where the managed project requires a Git repository relationship for the layer, the Nuxt integration workflow may coordinate the appropriate `git` use case.

### FR-NUXT-077 — Nuxt composition change
Where integration requires a change to root Nuxt configuration, that change shall be treated as a bounded Nuxt configuration transformation governed by `FR-XFORM-*` and the configuration requirements in this specification.

### FR-NUXT-078 — Existing integration
If the selected layer is already integrated equivalently, AppManager shall report it as already integrated rather than duplicating the relationship.

### FR-NUXT-079 — Conflicting integration
Where the root configuration contains an incompatible or ambiguous relationship for the same layer identity, AppManager shall refuse, disambiguate, or use an explicitly defined migration/update use case rather than silently introducing duplicate/conflicting relationships.

### FR-NUXT-080 — Integration scope
Integrating one layer shall not implicitly integrate other discovered layers.

### FR-NUXT-081 — Partial integration
If repository coordination succeeds but Nuxt configuration integration fails, or vice versa, AppManager shall report the actual partial state and the remaining corrective action.

### FR-NUXT-082 — Integration result
The result shall identify the root application, layer, Nuxt integration status, repository-relationship status where relevant, and any remaining action.

---

## 13. Layer Detachment / Nuxt Relationship Removal

### FR-NUXT-083 — Nuxt detachment use case
Where Version 1 exposes removal of a layer from the root application's Nuxt composition, AppManager shall treat that as a distinct Nuxt relationship-removal operation.

### FR-NUXT-084 — Detachment does not imply deletion
Removing a layer from Nuxt composition shall not implicitly delete the layer project, local repository, remote repository, or Git relationship.

### FR-NUXT-085 — Explicit relationship target
The exact root/layer relationship to remove shall be resolved before mutation begins.

### FR-NUXT-086 — Consequence diagnostics
Where detachment is known to affect root application behaviour materially, AppManager shall expose the consequence before applying the change as required by invocation policy.

### FR-NUXT-087 — Bounded source change
Nuxt detachment shall mutate only the configuration necessary to remove the selected Nuxt relationship and preserve unrelated configuration where practical.

### FR-NUXT-088 — Separate Git cleanup
If a caller also wants to remove a Git repository relationship, that shall be an explicitly coordinated `git` operation rather than an implicit side effect of Nuxt detachment.

---

## 14. Nuxt Layer Lifecycle Facts

### FR-NUXT-089 — Layer lifecycle state
AppManager shall be able to distinguish relevant layer states such as created-but-unintegrated, integrated, repository-linked where knowable, and invalid/unsupported where required by approved use cases.

### FR-NUXT-090 — State is descriptive, not authority
Reported layer lifecycle state shall not itself grant mutation authority.

### FR-NUXT-091 — Independent layer usability
A standalone layer that is not currently integrated into the selected root application shall not automatically be classified as invalid merely because it is unintegrated.

### FR-NUXT-092 — Host-specific integration
A layer may be integrated into one managed root application and not another; integration status shall be interpreted relative to the resolved host project where relevant.

---

## 15. Generic File Addition Boundary

### FR-NUXT-093 — No generic arbitrary-file command under Nuxt
The Nuxt domain shall not own a generic command whose semantic purpose is simply to add an arbitrary named file to a project.

### FR-NUXT-094 — Nuxt-specific artefact exception
If a requested artefact is intrinsically a Nuxt configuration/resource artefact and AppManager supports it as a defined Nuxt capability, Nuxt may own that specific use case.

### FR-NUXT-095 — Provider/deployment artefacts require clearer ownership
Provider-specific deployment files such as a hosting-provider configuration file shall not be classified as Nuxt behaviour merely because they are used by a Nuxt application.

### FR-NUXT-096 — Generation mechanisms remain subordinate
Template/resource generation used by a Nuxt-specific use case does not create a separate Nuxt authority for all files the generator is technically capable of producing.

---

## 16. Documentation Boundary

### FR-NUXT-097 — Nuxt facts may support documentation
The Nuxt domain may expose Nuxt-specific project facts that a documentation use case consumes.

### FR-NUXT-098 — Documentation intent belongs to docs
When the primary user intent is to generate, extract, or update documentation for a layer or Nuxt project, functional ownership belongs to the `docs` domain rather than `nuxt`. A documentation artefact required as one subordinate part of a Nuxt layer-creation profile remains Nuxt-orchestrated for profile completeness, but any documentation-specific modeling/generation semantics it requires remain delegated to the documentation boundary.

### FR-NUXT-099 — Single documentation authority
Nuxt shall not establish a second independent documentation implementation for product intent already owned by the `docs` domain or for documentation-specific semantics merely because documentation participates in a Nuxt scaffold.

---

## 17. Environment and Application Lifecycle Boundary

### FR-NUXT-100 — No duplicate environment lifecycle
The Nuxt domain shall not define an independent general clean/install/reset environment lifecycle that duplicates `app` lifecycle behaviour.

### FR-NUXT-101 — Nuxt-specific environment facts allowed
Nuxt may expose Nuxt-specific generated-state facts when required by another approved Nuxt use case, but removal/reinstallation lifecycle intent remains owned by `app` unless a genuinely Nuxt-specific operation is separately specified.

### FR-NUXT-102 — Application lifecycle ownership
Cache cleanup, dependency reinstall, reset, and equivalent general application-environment actions are owned by the `app` lifecycle rather than by an independent Nuxt lifecycle authority.

---

## 18. Safety and Source-Transformation Behaviour

### FR-NUXT-103 — Managed-scope enforcement
Nuxt mutations shall act only within the approved managed scope for the selected root application or layer.

### FR-NUXT-104 — Preserve unrelated source
Nuxt source transformations shall preserve unrelated user content, comments, ordering, and formatting where practical and shall not use whole-file regeneration merely for implementation convenience when a bounded transformation is available.

### FR-NUXT-105 — Ambiguous structure fails safely
If the target Nuxt configuration structure is ambiguous or unsupported for the requested mutation, AppManager shall refuse or require an explicitly supported migration path rather than guess.

### FR-NUXT-106 — Revalidate stale source
Where source changes materially between inspection/planning and mutation, AppManager shall revalidate, fail, or otherwise handle stale state deliberately rather than blindly overwrite newer changes.

### FR-NUXT-107 — Source-valid is not application-accepted
A syntactically valid Nuxt configuration change shall not be considered successful if it violates the requested Nuxt intent, managed scope, policy, or known Nuxt-specific validity requirements.

### FR-NUXT-108 — Partial source changes reported truthfully
Where a composed Nuxt operation changes more than one artefact or coordinates more than one domain and only part succeeds, AppManager shall report the actual resulting state.

### FR-NUXT-109 — No universal rollback claim
Nuxt operations shall not imply universal rollback across source changes, Git effects, and remote-provider effects unless lower-level design deliberately supplies and exposes such semantics.

---

## 19. Interaction-Mode Equivalence

### FR-NUXT-110 — Cross-mode semantic equivalence
Interactive and Headless Nuxt operations expressing the same intent shall resolve equivalent target, scope, policy, safety, validation, and application-level outcomes.

### FR-NUXT-111 — Interactive selection is presentation
Menus for selecting a root application, layer, configuration entry, profile, or integration choice are presentation mechanisms and shall not be the only way to express the underlying Nuxt intent.

### FR-NUXT-112 — Deterministic Headless behaviour
Headless Nuxt operations shall not prompt for missing required information; unresolved required target, profile, integration, or configuration data shall produce structured diagnostics.

### FR-NUXT-113 — Machine-consumable results
Headless callers shall be able to determine created/modified targets, integration state, configuration outcomes, partial completion, and failures without parsing human terminal text.

---

## 20. Traceability Summary

| Requirement range | Functional concern | Primary current authority |
|---|---|---|
| `FR-NUXT-001`–`012` | General Nuxt authority and boundaries | Root Design; Invocation; Managed Project |
| `FR-NUXT-013`–`020` | Nuxt facts and inspection | Root Design; Managed Project; Source Intelligence boundary |
| `FR-NUXT-021`–`033` | Nuxt configuration inspection/listing | Source Intelligence; Source Transformation; Managed Project |
| `FR-NUXT-034`–`050` | Add/remove Nuxt configuration | Source Transformation; Managed Project |
| `FR-NUXT-051`–`070` | Nuxt layer creation and scaffold orchestration | App boundary; Settings boundary; Resource Registry and Template; Documentation; Resource Access; Source Transformation; Git boundary |
| `FR-NUXT-071`–`088` | Layer integration/detachment | Root Design layer model; Source Transformation; Git boundary |
| `FR-NUXT-089`–`092` | Layer lifecycle facts | Managed Project; Nuxt layer model |
| `FR-NUXT-093`–`102` | File/docs/environment ownership boundaries | Docs, Settings, App, Resource Registry and Template boundaries |
| `FR-NUXT-103`–`109` | Safety/transformation | Source Transformation; Managed Project |
| `FR-NUXT-110`–`113` | Interaction modes | Application Invocation |

Detailed Design shall extend traceability downward to permanent Nuxt configuration representations, layer models, transformation contracts, generator boundaries, artefact-semantic delegation seams, and provider interfaces without changing these functional ownership decisions.

---

## 21. Conformance Summary

A Version 1 implementation conforms to this Functional Specification only if it:

1. treats the Nuxt domain as the owner of Nuxt-specific intent rather than general project mechanics;
2. distinguishes the root Nuxt application from managed Nuxt layers;
3. exposes supported Nuxt project facts without granting mutation authority through discovery;
4. supports semantic inspection/listing of supported Nuxt configuration;
5. supports bounded addition and removal of supported Nuxt configuration subject to `FR-XFORM-*`;
6. creates valid supported Nuxt layer projects under singular `nuxt` orchestration ownership without treating that ownership as semantic ownership of every scaffold artefact class;
7. supports standalone layer creation independently of immediate host integration;
8. keeps Git repository setup and relationships under `git` authority even when coordinated by layer creation;
9. distinguishes Nuxt layer integration from Git repository linking;
10. reports partial creation/integration truthfully when composed steps diverge;
11. does not duplicate `app` clean/reset/reinitialise behaviour under `nuxt`;
12. does not duplicate documentation-generation authority under `nuxt`;
13. does not treat generic arbitrary file creation as inherently Nuxt-specific;
14. delegates cross-owned scaffold artefact semantics, rendering, persistence, and mutation through their owning contracts while retaining Nuxt profile/baseline acceptance;
15. fails safely on ambiguous or unsupported Nuxt source structures;
16. preserves unrelated source during controlled Nuxt configuration changes;
17. provides deterministic Headless behaviour and machine-consumable outcomes; and
18. preserves Application Engine authority over Nuxt scope, policy, safety, and final application-level acceptance.

---

## 22. Version 1 Functional Baseline

This document establishes the Version 1 Functional baseline for the AppManager `nuxt` domain.

Future Detailed Design may define concrete Nuxt source models, transformation strategies, layer metadata, generator interfaces, provider boundaries, and implementation structure, but shall preserve the observable behaviours and domain boundaries established here unless this Functional Specification is deliberately superseded.