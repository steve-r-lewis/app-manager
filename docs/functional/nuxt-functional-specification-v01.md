# AppManager Nuxt Functional Specification

> **Status:** Version 1 Functional Specification
>
> **Functional authority:** Observable application-level behaviour for Nuxt-specific project inspection, Nuxt configuration management, Nuxt-layer creation and integration, and Nuxt-specific project facts within AppManager-managed projects.
>
> **Governing authorities:** [Project Documentation Guide](../project-documentation-guide-v01.md), [AppManager Design Specification](../appmanager-design-specification-v01.md)
>
> **Related Functional Specifications:** [application-invocation-functional-specification-v01.md](application-invocation-functional-specification-v01.md), [managed-project-functional-specification-v01.md](managed-project-functional-specification-v01.md), [configuration-functional-specification-v01.md](configuration-functional-specification-v01.md), [source-transformation-functional-specification-v01.md](source-transformation-functional-specification-v01.md), [app-functional-specification-v01.md](app-functional-specification-v01.md), [git-functional-specification-v01.md](git-functional-specification-v01.md), [settings-functional-specification-v01.md](settings-functional-specification-v01.md)
>
> **Downstream Detailed Design refinement:** [Nuxt Layer Scaffold Artefact Ownership Clarification](../dd_2_shared_capabilities/clarifications/nuxt-layer-scaffold-artefact-ownership-clarification-v01.md)
>
> **Historical planning provenance (non-normative):** [docs/project_management/functional-specification-decomposition-plan-v01.md](../project_management/functional-specification-decomposition-plan-v01.md)

---

## 1. Purpose

This specification defines the observable Version 1 behaviour of the AppManager `nuxt` functional domain.

The `nuxt` domain owns use cases whose primary product identity is Nuxt-specific structure, configuration, layer lifecycle, and Nuxt-aware project interpretation.

The governing question is:

> **What Nuxt-specific behaviour must AppManager provide for the managed root application and its constituent layers?**

The owning requirements below define the applicable local contract.

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

The operation families below apply the product boundary in [Design §10.7](../appmanager-design-specification-v01.md#_10-7-nuxt-domain).

### 4.2 Root application versus layer

Root/layer operations consume [Managed Project §8](managed-project-functional-specification-v01.md#_8-root-application-and-managed-layers).

### 4.3 Layer creation versus layer integration

Creation (§11) establishes a layer baseline. Integration (§12) concerns its relationship to a selected host. These are independently invocable intents under FR-NUXT-051 and FR-NUXT-071.

### 4.4 Integration versus repository relationship

FR-NUXT-017 and FR-NUXT-075 define how Nuxt relationship facts and acceptance relate to Git evidence. Git follow-on work is described in FR-NUXT-065–068 and FR-NUXT-076.

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

### 4.6 Canonical Version 1 Command Surface

| Canonical identity | Behavioural owner |
|---|---|
| `nuxt.inspect` | §6 |
| `nuxt.inspect-configuration` | §7 |
| `nuxt.list-configuration` | §8 |
| `nuxt.add-configuration` | §9 |
| `nuxt.remove-configuration` | §10 |
| `nuxt.add` | §15.1, supported framework artefacts |
| `nuxt.add-module` | §15.1, module dependency/configuration state |
| `nuxt.upgrade` | §15.1, supported version/range or policy |
| `nuxt.analyze` | §15.1, Nuxt build/bundle evidence |
| `nuxt.cleanup` | §15.1, Nuxt-generated/cache state |
| `nuxt.create-layer` | §11 |
| `nuxt.integrate-layer` | §12 |
| `nuxt.detach-layer` | §13 |

These thirteen identities define the Nuxt catalogue. Provider syntax and compatibility aliases do not add canonical commands. Supported scaffold classes may include components, composables, plugins, middleware, pages and layouts; eligibility is specified below rather than inferred from arbitrary filenames.

---

## 5. General Nuxt-Domain Requirements

<a id="fr-nuxt-001"></a>

### FR-NUXT-001 — Coherent Nuxt-domain semantics
Nuxt invocation paths shall apply [Design §4.6](../appmanager-design-specification-v01.md#_4-6-presentation-independence).

<a id="fr-nuxt-002"></a>

### FR-NUXT-002 — Application Engine authority
Nuxt orchestration shall conform to [Design §6.2](../appmanager-design-specification-v01.md#_6-2-application-engine-authority), [Design §11.11](../appmanager-design-specification-v01.md#_11-11-workflow-results-failure-and-acceptance).

<a id="fr-nuxt-003"></a>

### FR-NUXT-003 — Nuxt intent over implementation mechanism
Nuxt-specific intent shall conform to [Design §5.1](../appmanager-design-specification-v01.md#_5-1-domain-oriented-command-model) and the provider boundary in [Design §6.6](../appmanager-design-specification-v01.md#_6-6-capability-boundaries-and-providers).

<a id="fr-nuxt-004"></a>

### FR-NUXT-004 — Managed project required where applicable
Existing root/layer operations shall apply [Design §9.6](../appmanager-design-specification-v01.md#_9-6-project-discovery-and-context-resolution).

<a id="fr-nuxt-005"></a>

### FR-NUXT-005 — Explicit target identity
A consequential Nuxt operation shall establish whether it targets the root application, one selected layer, or another explicitly supported Nuxt resource before mutation begins.

<a id="fr-nuxt-006"></a>

### FR-NUXT-006 — Discovery is not mutation authority
Nuxt structures and relationships shall apply [Design §9.9](../appmanager-design-specification-v01.md#_9-9-non-destructive-ownership-and-unmanaged-content).

<a id="fr-nuxt-007"></a>

### FR-NUXT-007 — No implicit scope expansion
Selected root/layer Nuxt operations shall apply [FR-PROJ-042](managed-project-functional-specification-v01.md#fr-proj-042).

<a id="fr-nuxt-008"></a>

### FR-NUXT-008 — Effective configuration consumption
Configurable Nuxt inputs shall apply [FR-CONFIG-020](configuration-functional-specification-v01.md#fr-config-020).

<a id="fr-nuxt-009"></a>

### FR-NUXT-009 — Capability delegation is subordinate
Nuxt parser, generator, Git, filesystem, package-manager and AI delegation shall conform to [Design §6.2](../appmanager-design-specification-v01.md#_6-2-application-engine-authority), [Design §11.11](../appmanager-design-specification-v01.md#_11-11-workflow-results-failure-and-acceptance).

<a id="fr-nuxt-010"></a>

### FR-NUXT-010 — Lower-level success is not automatically Nuxt success
Delegated Nuxt-stage completion shall apply [FR-INV-034](application-invocation-functional-specification-v01.md#fr-inv-034).

<a id="fr-nuxt-011"></a>

### FR-NUXT-011 — Nuxt-specific validation
Where a Nuxt use case has Nuxt-specific validity conditions, AppManager shall evaluate them before representing the use case as successful.

<a id="fr-nuxt-012"></a>

### FR-NUXT-012 — Structured diagnostics
Nuxt failures shall identify the affected root application, layer, configuration target, or integration stage where that distinction is material.

---

## 6. Nuxt Project Facts and Inspection

<a id="fr-nuxt-013"></a>

### FR-NUXT-013 — Nuxt facts exposure
AppManager shall be able to expose Nuxt-specific facts required by approved use cases without mutating the managed project.

<a id="fr-nuxt-014"></a>

### FR-NUXT-014 — Root Nuxt identity
Nuxt inspection root/layer identity shall apply [Design §9.3](../appmanager-design-specification-v01.md#_9-3-root-application-and-managed-layers).

<a id="fr-nuxt-015"></a>

### FR-NUXT-015 — Layer identity
AppManager shall expose the identity of recognised managed Nuxt layers sufficiently to distinguish them from arbitrary directories and non-layer project resources.

<a id="fr-nuxt-016"></a>

### FR-NUXT-016 — Nuxt relationship facts
Where knowable, AppManager shall expose whether a layer is configured as part of the root application's Nuxt composition.

<a id="fr-nuxt-017"></a>

### FR-NUXT-017 — Repository relationship is distinct
Nuxt inspection shall not infer that a layer is integrated into Nuxt composition solely because a Git repository or submodule relationship exists.

<a id="fr-nuxt-018"></a>

### FR-NUXT-018 — Configuration target facts
AppManager shall expose which Nuxt configuration target is authoritative for the operation being requested where more than one Nuxt application or layer configuration exists.

<a id="fr-nuxt-019"></a>

### FR-NUXT-019 — Unsupported structure diagnostics
If AppManager recognises a Nuxt project shape but cannot safely interpret the relevant Nuxt structure, it shall report an unsupported or ambiguous condition rather than fabricate project facts.

<a id="fr-nuxt-020"></a>

### FR-NUXT-020 — Inspection is non-authorising
Nuxt inspection results shall apply [Design §9.9](../appmanager-design-specification-v01.md#_9-9-non-destructive-ownership-and-unmanaged-content).

---

## 7. Nuxt Configuration Inspection

<a id="fr-nuxt-021"></a>

### FR-NUXT-021 — Nuxt configuration inspection use case
AppManager shall provide an observable use case for inspecting supported Nuxt configuration of the selected Nuxt target.

<a id="fr-nuxt-022"></a>

### FR-NUXT-022 — Root configuration inspection
AppManager shall support inspection of the managed root application's supported Nuxt configuration.

<a id="fr-nuxt-023"></a>

### FR-NUXT-023 — Layer configuration inspection
Where a managed layer has its own supported Nuxt configuration, AppManager shall support inspecting that configuration independently.

<a id="fr-nuxt-024"></a>

### FR-NUXT-024 — Supported semantic view
Inspection shall expose supported configuration semantically rather than requiring callers to interpret raw source text.

<a id="fr-nuxt-025"></a>

### FR-NUXT-025 — Source preservation
Nuxt configuration inspection shall apply [FR-XFORM-005](source-transformation-functional-specification-v01.md#fr-xform-005).

<a id="fr-nuxt-026"></a>

### FR-NUXT-026 — Unsupported entries
AppManager may expose unsupported or unrecognised configuration as opaque/unsupported information where safe, but shall not imply that it can manage entries it cannot safely understand.

<a id="fr-nuxt-027"></a>

### FR-NUXT-027 — Configuration provenance
Where diagnostically useful, AppManager should identify which Nuxt target/source contributes a reported supported configuration entry.

<a id="fr-nuxt-028"></a>

### FR-NUXT-028 — Sensitive information
Nuxt configuration inspection output shall apply [FR-INV-040](application-invocation-functional-specification-v01.md#fr-inv-040).

---

## 8. List Supported Nuxt Configuration Entries

<a id="fr-nuxt-029"></a>

### FR-NUXT-029 — List use case
AppManager shall provide a use case for listing supported manageable Nuxt configuration entries for the selected Nuxt target.

<a id="fr-nuxt-030"></a>

### FR-NUXT-030 — Entry identity
Each listed manageable entry shall have an identity sufficient for subsequent explicit add, update where supported, or remove operations.

<a id="fr-nuxt-031"></a>

### FR-NUXT-031 — Structural context
Where the same value or key can occur in materially different Nuxt configuration contexts, AppManager shall expose enough structural context to disambiguate it.

<a id="fr-nuxt-032"></a>

### FR-NUXT-032 — Managed versus observed distinction
AppManager shall distinguish entries it can safely manage from entries it can only observe.

<a id="fr-nuxt-033"></a>

### FR-NUXT-033 — Stable machine-consumable result
Listed manageable Nuxt entries shall apply [FR-INV-021](application-invocation-functional-specification-v01.md#fr-inv-021).

---

## 9. Add Nuxt Configuration

<a id="fr-nuxt-034"></a>

### FR-NUXT-034 — Add configuration use case
AppManager shall support adding a supported Nuxt configuration entry to an explicitly selected Nuxt target.

<a id="fr-nuxt-035"></a>

### FR-NUXT-035 — Supported configuration classes
Only configuration classes that AppManager can recognise, validate, and safely transform shall be eligible for managed addition.

<a id="fr-nuxt-036"></a>

### FR-NUXT-036 — Explicit configuration intent
The requested configuration entry, target, and intended semantic location shall be explicit or deterministically resolvable before a change is proposed.

<a id="fr-nuxt-037"></a>

### FR-NUXT-037 — Existing equivalent entry
Where an equivalent entry already exists, AppManager shall report that state rather than blindly duplicating the configuration.

<a id="fr-nuxt-038"></a>

### FR-NUXT-038 — Conflict handling
Where an existing entry conflicts with the requested addition, AppManager shall require an explicitly defined update/replacement path or refuse the addition rather than silently creating contradictory configuration.

<a id="fr-nuxt-039"></a>

### FR-NUXT-039 — Bounded transformation
Nuxt configuration addition shall apply [FR-XFORM-014](source-transformation-functional-specification-v01.md#fr-xform-014), [FR-XFORM-033](source-transformation-functional-specification-v01.md#fr-xform-033).

<a id="fr-nuxt-040"></a>

### FR-NUXT-040 — Proposed change reviewability
Review of consequential configuration additions shall apply [FR-INV-025](application-invocation-functional-specification-v01.md#fr-inv-025), [FR-XFORM-031](source-transformation-functional-specification-v01.md#fr-xform-031).

<a id="fr-nuxt-041"></a>

### FR-NUXT-041 — Nuxt-level validation
After source-level transformation validation, AppManager shall apply applicable Nuxt-specific acceptance criteria before representing the addition as successful.

<a id="fr-nuxt-042"></a>

### FR-NUXT-042 — Preserve unsupported content
Supported configuration addition shall preserve unrelated and unsupported configuration content where practical.

<a id="fr-nuxt-043"></a>

### FR-NUXT-043 — Add outcome
The result shall identify the target, requested semantic entry, whether it was added, already present, rejected, cancelled, or failed.

---

## 10. Remove Nuxt Configuration

<a id="fr-nuxt-044"></a>

### FR-NUXT-044 — Remove configuration use case
AppManager shall support removal of a supported manageable Nuxt configuration entry from an explicitly selected Nuxt target.

<a id="fr-nuxt-045"></a>

### FR-NUXT-045 — Exact target resolution
The entry to remove shall be resolved unambiguously before mutation begins.

<a id="fr-nuxt-046"></a>

### FR-NUXT-046 — Missing entry behaviour
If the requested manageable entry is already absent, AppManager may report it as already absent rather than treating that state as an opaque transformation failure.

<a id="fr-nuxt-047"></a>

### FR-NUXT-047 — No broad deletion
Removing one configuration entry shall not remove sibling configuration, comments, unrelated values, or unsupported source merely because they occupy the same source structure.

<a id="fr-nuxt-048"></a>

### FR-NUXT-048 — Consequence awareness
Where removal would materially invalidate a known Nuxt relationship or supported application requirement, AppManager shall expose that consequence and apply applicable confirmation or refusal policy.

<a id="fr-nuxt-049"></a>

### FR-NUXT-049 — Bounded removal transformation
Nuxt configuration removal shall apply [FR-XFORM-033](source-transformation-functional-specification-v01.md#fr-xform-033), [Design §9.9](../appmanager-design-specification-v01.md#_9-9-non-destructive-ownership-and-unmanaged-content), [FR-XFORM-048](source-transformation-functional-specification-v01.md#fr-xform-048).

<a id="fr-nuxt-050"></a>

### FR-NUXT-050 — Remove outcome
The result shall identify the target entry and whether it was removed, already absent, rejected, cancelled, or failed.

---

## 11. Nuxt Layer Creation

### 11.1 Purpose

Layer creation assembles a selected profile into a supported baseline, then evaluates the resulting Nuxt layer. FR-NUXT-055–060 owns profile choice, artefact-class inclusion and orchestration acceptance. [Settings](settings-functional-specification-v01.md#_7-application-metadata), [Docs](docs-functional-specification-v01.md#_10-documentation-generation-and-update), [Git](git-functional-specification-v01.md#_7-repository-initialisation) and [Source Transformation](source-transformation-functional-specification-v01.md#_13-generation-versus-mutation) supply the independently owned contracts used by scaffold steps. The [scaffold DD clarification](../dd_2_shared_capabilities/clarifications/nuxt-layer-scaffold-artefact-ownership-clarification-v01.md) records downstream refinement only.

<a id="fr-nuxt-051"></a>

### FR-NUXT-051 — Layer creation use case
AppManager shall provide a `nuxt` use case for creating a new Nuxt layer project.

<a id="fr-nuxt-052"></a>

### FR-NUXT-052 — Nuxt ownership
App coordination or recommendation of layer creation shall apply [FR-APP-070](app-functional-specification-v01.md#fr-app-070).

<a id="fr-nuxt-053"></a>

### FR-NUXT-053 — Layer identity
Before consequential creation begins, AppManager shall resolve the intended layer identity and target location sufficiently to prevent accidental creation over unrelated content.

<a id="fr-nuxt-054"></a>

### FR-NUXT-054 — Target safety
AppManager shall refuse or require a deliberately defined safe mode when the layer creation target is non-empty or would overwrite an existing project.

<a id="fr-nuxt-055"></a>

### FR-NUXT-055 — Valid Nuxt layer baseline
A successful creation shall establish a project structure sufficient to represent a valid supported Nuxt layer baseline under the selected creation profile.

<a id="fr-nuxt-056"></a>

### FR-NUXT-056 — Standalone capability
Version 1 layer creation shall support creating a layer as a standalone project that can exist, be developed, tested, versioned, and documented independently of one particular root application where the selected profile requires that capability.

<a id="fr-nuxt-057"></a>

### FR-NUXT-057 — Creation profile
Where more than one layer profile is supported, the selected profile shall represent a documented functional capability set rather than an arbitrary hidden template variant.

<a id="fr-nuxt-058"></a>

### FR-NUXT-058 — Generated artefact classes
Layer creation may require applicable artefact classes including package metadata, Nuxt configuration, TypeScript configuration, ignore rules, environment/example configuration, README/introduction material, licence material, and test configuration according to the selected profile. Inclusion in the profile establishes Nuxt-layer baseline/orchestration intent only; it does not transfer the artefact class's independent semantic authority to the `nuxt` domain where another domain or shared capability owns that semantic contract.

<a id="fr-nuxt-059"></a>

### FR-NUXT-059 — Exact file set below Functional level
Downstream scaffold design shall apply [FR-NUXT-058](nuxt-functional-specification-v01.md#fr-nuxt-058). Exact filenames, template functions, source text and concrete rendering/persistence mechanisms belong below Functional level.

<a id="fr-nuxt-060"></a>

### FR-NUXT-060 — Effective configuration during creation
Author identity, licence choice, repository defaults, naming policy, visibility defaults, or similar configurable inputs shall use explicit invocation values or effective configuration according to `FR-CONFIG-*`. Where a value participates in a separately owned semantic contract, layer creation shall consume that contract rather than establish a competing Nuxt-specific source of truth.

<a id="fr-nuxt-061"></a>

### FR-NUXT-061 — No fabricated secrets
Layer creation shall not fabricate secret values to make generated environment material appear complete.

<a id="fr-nuxt-062"></a>

### FR-NUXT-062 — Optional AI enrichment
Optional descriptive/documentation enrichment during layer creation shall apply [FR-DOCS-084](docs-functional-specification-v01.md#fr-docs-084). A valid supported layer baseline shall remain possible without AI.

<a id="fr-nuxt-063"></a>

### FR-NUXT-063 — AI output non-authoritative
AI-generated layer content shall apply [Design §11.10](../appmanager-design-specification-v01.md#_11-10-ai-assisted-workflow), [FR-XFORM-060](source-transformation-functional-specification-v01.md#fr-xform-060).

<a id="fr-nuxt-064"></a>

### FR-NUXT-064 — Generation versus mutation
Layer-creation output dispositions shall apply [Design §6.8](../appmanager-design-specification-v01.md#_6-8-generation-and-templates).

<a id="fr-nuxt-065"></a>

### FR-NUXT-065 — Local repository optional coordination
Layer creation may coordinate initialisation of a local repository through the `git` domain when requested or required by the selected layer profile.

<a id="fr-nuxt-066"></a>

### FR-NUXT-066 — Remote repository optional coordination
Layer creation may coordinate creation or association of a remote repository through Git/provider capabilities when explicitly requested and supported.

<a id="fr-nuxt-067"></a>

### FR-NUXT-067 — Git semantics remain Git-owned
Nuxt layer creation shall not redefine repository initialisation, remote creation, remote association, commit, push, or repository-relationship semantics.

<a id="fr-nuxt-068"></a>

### FR-NUXT-068 — Repository failure isolation
If the Nuxt layer scaffold succeeds but an optional Git or remote follow-on step fails, AppManager shall report the successfully created layer and the Git-stage failure separately rather than falsely claiming that the layer does not exist.

<a id="fr-nuxt-069"></a>

### FR-NUXT-069 — No false creation atomicity
Layer scaffold and external follow-on atomicity claims shall apply [FR-INV-046](application-invocation-functional-specification-v01.md#fr-inv-046).

<a id="fr-nuxt-070"></a>

### FR-NUXT-070 — Creation result
A successful or partial layer-creation result shall identify the created layer, selected profile or material creation choices, completed follow-on actions, and remaining recommended actions. Subordinate artefact-generation, documentation, licence/resource, persistence, transformation, Git, AI, or quality evidence shall remain distinguishable where relevant to explaining the final layer-creation outcome.

---

## 12. Layer Integration into a Managed Root Application

### 12.1 Purpose

Layer integration makes an existing eligible Nuxt layer participate in the managed root application's Nuxt composition. It is separate from creating the layer itself.

<a id="fr-nuxt-071"></a>

### FR-NUXT-071 — Layer integration use case
AppManager shall support integrating an eligible Nuxt layer into a managed root application where Version 1 supports that layer relationship.

<a id="fr-nuxt-072"></a>

### FR-NUXT-072 — Existing layer required
Integration shall operate on an existing layer identity; it shall not silently create a new layer when the caller intended only to integrate one.

<a id="fr-nuxt-073"></a>

### FR-NUXT-073 — Root target required
The host root application into which the layer will be integrated shall be explicitly resolved through managed-project context.

<a id="fr-nuxt-074"></a>

### FR-NUXT-074 — Layer eligibility
Before integration, AppManager shall validate that the candidate is a supported Nuxt layer and is eligible for the intended root application relationship.

<a id="fr-nuxt-075"></a>

### FR-NUXT-075 — Integration is not repository linking
Integration acceptance when Git linking succeeds shall apply [FR-NUXT-017](nuxt-functional-specification-v01.md#fr-nuxt-017).

<a id="fr-nuxt-076"></a>

### FR-NUXT-076 — Repository linking may be coordinated
Where the managed project requires a Git repository relationship for the layer, the Nuxt integration workflow may coordinate the appropriate `git` use case.

<a id="fr-nuxt-077"></a>

### FR-NUXT-077 — Nuxt composition change
Where integration requires a change to root Nuxt configuration, that change shall be treated as a bounded Nuxt configuration transformation governed by `FR-XFORM-*` and the configuration requirements in this specification.

<a id="fr-nuxt-078"></a>

### FR-NUXT-078 — Existing integration
If the selected layer is already integrated equivalently, AppManager shall report it as already integrated rather than duplicating the relationship.

<a id="fr-nuxt-079"></a>

### FR-NUXT-079 — Conflicting integration
Where the root configuration contains an incompatible or ambiguous relationship for the same layer identity, AppManager shall refuse, disambiguate, or use an explicitly defined migration/update use case rather than silently introducing duplicate/conflicting relationships.

<a id="fr-nuxt-080"></a>

### FR-NUXT-080 — Integration scope
Layer integration scope shall apply [FR-PROJ-042](managed-project-functional-specification-v01.md#fr-proj-042).

<a id="fr-nuxt-081"></a>

### FR-NUXT-081 — Partial integration
If repository coordination succeeds but Nuxt configuration integration fails, or vice versa, AppManager shall report the actual partial state and the remaining corrective action.

<a id="fr-nuxt-082"></a>

### FR-NUXT-082 — Integration result
The result shall identify the root application, layer, Nuxt integration status, repository-relationship status where relevant, and any remaining action.

---

## 13. Layer Detachment / Nuxt Relationship Removal

<a id="fr-nuxt-083"></a>

### FR-NUXT-083 — Nuxt detachment use case
Where Version 1 exposes removal of a layer from the root application's Nuxt composition, AppManager shall treat that as a distinct Nuxt relationship-removal operation.

<a id="fr-nuxt-084"></a>

### FR-NUXT-084 — Detachment does not imply deletion
Removing a layer from Nuxt composition shall not implicitly delete the layer project, local repository, remote repository, or Git relationship.

<a id="fr-nuxt-085"></a>

### FR-NUXT-085 — Explicit relationship target
The exact root/layer relationship to remove shall be resolved before mutation begins.

<a id="fr-nuxt-086"></a>

### FR-NUXT-086 — Consequence diagnostics
Where detachment is known to affect root application behaviour materially, AppManager shall expose the consequence before applying the change as required by invocation policy.

<a id="fr-nuxt-087"></a>

### FR-NUXT-087 — Bounded source change
Nuxt detachment shall mutate only the configuration necessary to remove the selected Nuxt relationship and preserve unrelated configuration where practical.

<a id="fr-nuxt-088"></a>

### FR-NUXT-088 — Separate Git cleanup
If a caller also wants to remove a Git repository relationship, that shall be an explicitly coordinated `git` operation rather than an implicit side effect of Nuxt detachment.

---

## 14. Nuxt Layer Lifecycle Facts

<a id="fr-nuxt-089"></a>

### FR-NUXT-089 — Layer lifecycle state
AppManager shall be able to distinguish relevant layer states such as created-but-unintegrated, integrated, repository-linked where knowable, and invalid/unsupported where required by approved use cases.

<a id="fr-nuxt-090"></a>

### FR-NUXT-090 — State is descriptive, not authority
Reported layer lifecycle state shall apply [Design §9.9](../appmanager-design-specification-v01.md#_9-9-non-destructive-ownership-and-unmanaged-content).

<a id="fr-nuxt-091"></a>

### FR-NUXT-091 — Independent layer usability
A standalone layer that is not currently integrated into the selected root application shall not automatically be classified as invalid merely because it is unintegrated.

<a id="fr-nuxt-092"></a>

### FR-NUXT-092 — Host-specific integration
A layer may be integrated into one managed root application and not another; integration status shall be interpreted relative to the resolved host project where relevant.

---

## 15. Generic File Addition Boundary

<a id="fr-nuxt-093"></a>

### FR-NUXT-093 — No generic arbitrary-file command under Nuxt
The Nuxt domain shall not own a generic command whose semantic purpose is simply to add an arbitrary named file to a project.

<a id="fr-nuxt-094"></a>

### FR-NUXT-094 — Nuxt-specific artefact exception
If a requested artefact is intrinsically a Nuxt configuration/resource artefact and AppManager supports it as a defined Nuxt capability, Nuxt may own that specific use case.

<a id="fr-nuxt-095"></a>

### FR-NUXT-095 — Provider/deployment artefacts require clearer ownership
Provider-specific deployment files such as a hosting-provider configuration file shall not be classified as Nuxt behaviour merely because they are used by a Nuxt application.

<a id="fr-nuxt-096"></a>

### FR-NUXT-096 — Generation mechanisms remain subordinate
Template/resource generation used by a Nuxt-specific use case does not create a separate Nuxt authority for all files the generator is technically capable of producing.

---

### 15.1 Framework Artefacts, Modules, Upgrade, Analysis and Cleanup

These operations address an explicitly selected managed root application or layer when supported. Artefact scaffolding establishes a framework resource; module addition may require both dependency and configuration effects; upgrade verifies requested framework state; analysis returns evidence; cleanup removes its recognised Nuxt-generated classes. Their distinct postconditions govern acceptance.

<a id="pbc-fr-nuxt-001"></a>

### PBC-FR-NUXT-001 — Explicit managed target
Added Nuxt root/layer operations shall apply [FR-NUXT-005](nuxt-functional-specification-v01.md#fr-nuxt-005).

<a id="pbc-fr-nuxt-002"></a>

### PBC-FR-NUXT-002 — No implicit monorepo expansion
Added operations in a monorepo/composition shall apply [FR-PROJ-042](managed-project-functional-specification-v01.md#fr-proj-042).

<a id="pbc-fr-nuxt-003"></a>

### PBC-FR-NUXT-003 — Intent over provider syntax
Added Nuxt commands shall apply [FR-NUXT-003](nuxt-functional-specification-v01.md#fr-nuxt-003).

<a id="pbc-fr-nuxt-004"></a>

### PBC-FR-NUXT-004 — Provider completion is evidence
Provider completion for added Nuxt operations shall apply [FR-INV-034](application-invocation-functional-specification-v01.md#fr-inv-034), [FR-NUXT-011](nuxt-functional-specification-v01.md#fr-nuxt-011).

<a id="pbc-fr-nuxt-005"></a>

### PBC-FR-NUXT-005 — Supported scaffold use case
AppManager shall provide `nuxt.add` for adding a supported Nuxt framework artefact to an explicitly selected managed Nuxt target.

<a id="pbc-fr-nuxt-006"></a>

### PBC-FR-NUXT-006 — Explicit artefact intent
The supported artefact class, requested identity/name and target shall be explicit or deterministically resolvable before creation begins.

<a id="pbc-fr-nuxt-007"></a>

### PBC-FR-NUXT-007 — Not generic file creation
`nuxt.add` shall not expose arbitrary file paths/content as a generic file-generation API. Only explicitly supported Nuxt scaffold classes with defined placement and validity semantics are eligible.

<a id="pbc-fr-nuxt-008"></a>

### PBC-FR-NUXT-008 — Collision and postcondition
AppManager shall refuse or deliberately resolve unsafe target collisions and shall verify that the requested supported Nuxt artefact is established at the intended target before reporting success.

<a id="pbc-fr-nuxt-009"></a>

### PBC-FR-NUXT-009 — Module-addition use case
AppManager shall provide `nuxt.add-module` for adding a selected supported Nuxt module to an explicitly selected managed root application or layer.

<a id="pbc-fr-nuxt-010"></a>

### PBC-FR-NUXT-010 — Composed module intent
Where module addition requires package dependency work and/or Nuxt configuration change, AppManager shall coordinate those subordinate effects as one module-addition intent without transferring package/configuration semantics into provider output.

<a id="pbc-fr-nuxt-011"></a>

### PBC-FR-NUXT-011 — Existing/conflicting module state
AppManager shall detect already-satisfied or conflicting supported module state where determinable and shall not blindly duplicate dependency/configuration entries.

<a id="pbc-fr-nuxt-012"></a>

### PBC-FR-NUXT-012 — Module postcondition
Successful module addition requires the selected target to satisfy the supported module-addition postcondition, not merely successful dependency installation.

<a id="pbc-fr-nuxt-013"></a>

### PBC-FR-NUXT-013 — Explicit upgrade use case
AppManager shall provide `nuxt.upgrade` for a selected managed Nuxt target using an explicit supported requested version/range or upgrade policy.

<a id="pbc-fr-nuxt-014"></a>

### PBC-FR-NUXT-014 — No implicit latest
An omitted version shall not silently authorize upgrade to the newest available release unless an explicitly documented selected policy has that meaning.

<a id="pbc-fr-nuxt-015"></a>

### PBC-FR-NUXT-015 — No implicit cross-layer upgrade
Root/layer upgrade targeting shall apply [FR-PROJ-042](managed-project-functional-specification-v01.md#fr-proj-042).

<a id="pbc-fr-nuxt-016"></a>

### PBC-FR-NUXT-016 — Upgrade validation
After subordinate dependency/provider work, AppManager shall inspect applicable Nuxt state and report success only when the selected target satisfies the requested supported upgrade postcondition.

<a id="pbc-fr-nuxt-017"></a>

### PBC-FR-NUXT-017 — Nuxt analysis use case
AppManager shall provide `nuxt.analyze` for Nuxt-specific application/bundle analysis of an explicitly selected supported Nuxt target.

<a id="pbc-fr-nuxt-018"></a>

### PBC-FR-NUXT-018 — Analysis evidence
The result shall expose structured analysis evidence/diagnostics where supported and shall distinguish technical inability to analyze from analysis findings.

<a id="pbc-fr-nuxt-019"></a>

### PBC-FR-NUXT-019 — Quality boundary
`nuxt.analyze` shall not establish a Quality pass/fail/gate outcome unless a separate Quality use case explicitly consumes the resulting evidence under Quality-owned policy.

<a id="pbc-fr-nuxt-020"></a>

### PBC-FR-NUXT-020 — Nuxt-generated-state cleanup
AppManager shall provide `nuxt.cleanup` for removing supported Nuxt-generated/cache state that is regenerable by Nuxt for an explicitly selected managed target.

<a id="pbc-fr-nuxt-021"></a>

### PBC-FR-NUXT-021 — Bounded cleanup
Nuxt cleanup shall not remove user-authored source, unrelated application state, repositories, independently managed layers, environment definitions, dependencies or other resources outside the defined Nuxt-generated-state classes.

<a id="pbc-fr-nuxt-022"></a>

### PBC-FR-NUXT-022 — App boundary
`nuxt.cleanup` shall remain narrower than App-owned `app.clean` and `app.reset`; App workflows may coordinate Nuxt cleanup where their own policy requires it without transferring App intent to Nuxt.

---

## 16. Documentation Boundary

<a id="fr-nuxt-097"></a>

### FR-NUXT-097 — Nuxt facts may support documentation
The Nuxt domain may expose Nuxt-specific project facts that a documentation use case consumes.

<a id="fr-nuxt-098"></a>

### FR-NUXT-098 — Documentation intent belongs to docs
Documentation whose primary intent concerns a Nuxt project/layer shall apply [FR-DOCS-100](docs-functional-specification-v01.md#fr-docs-100). A subordinate layer-profile artefact remains subject to FR-NUXT-058.

<a id="fr-nuxt-099"></a>

### FR-NUXT-099 — Single documentation authority
Nuxt documentation coordination shall apply [FR-NUXT-098](nuxt-functional-specification-v01.md#fr-nuxt-098).

---

## 17. Environment and Application Lifecycle Boundary

<a id="fr-nuxt-100"></a>

### FR-NUXT-100 — No duplicate environment lifecycle
General environment clean/install/reset lifecycle shall apply [FR-NUXT-102](nuxt-functional-specification-v01.md#fr-nuxt-102).

<a id="fr-nuxt-101"></a>

### FR-NUXT-101 — Nuxt-specific environment facts allowed
Nuxt may expose Nuxt-specific generated-state facts when required by another approved Nuxt use case, but removal/reinstallation lifecycle intent remains owned by `app` unless a genuinely Nuxt-specific operation is separately specified.

<a id="fr-nuxt-102"></a>

### FR-NUXT-102 — Application lifecycle ownership
General application clean/reset remains governed by [App §§11–12](app-functional-specification-v01.md#_11-clean-regenerable-application-state). The narrower Nuxt-generated-state operation is defined by PBC-FR-NUXT-020–022.

---

## 18. Safety and Source-Transformation Behaviour

<a id="fr-nuxt-103"></a>

### FR-NUXT-103 — Managed-scope enforcement
Nuxt root/layer mutation targets shall apply [FR-PROJ-044](managed-project-functional-specification-v01.md#fr-proj-044).

<a id="fr-nuxt-104"></a>

### FR-NUXT-104 — Preserve unrelated source
Nuxt source changes shall apply [Design §9.9](../appmanager-design-specification-v01.md#_9-9-non-destructive-ownership-and-unmanaged-content), [FR-XFORM-040](source-transformation-functional-specification-v01.md#fr-xform-040), [FR-XFORM-041](source-transformation-functional-specification-v01.md#fr-xform-041).

<a id="fr-nuxt-105"></a>

### FR-NUXT-105 — Ambiguous structure fails safely
If the target Nuxt configuration structure is ambiguous or unsupported for the requested mutation, AppManager shall refuse or require an explicitly supported migration path rather than guess.

<a id="fr-nuxt-106"></a>

### FR-NUXT-106 — Revalidate stale source
Stale Nuxt source shall apply [FR-XFORM-020](source-transformation-functional-specification-v01.md#fr-xform-020), [FR-XFORM-068](source-transformation-functional-specification-v01.md#fr-xform-068).

<a id="fr-nuxt-107"></a>

### FR-NUXT-107 — Source-valid is not application-accepted
A syntactically valid Nuxt configuration change shall not be considered successful if it violates the requested Nuxt intent, managed scope, policy, or known Nuxt-specific validity requirements.

<a id="fr-nuxt-108"></a>

### FR-NUXT-108 — Partial source changes reported truthfully
Multi-artefact and cross-domain Nuxt effects shall apply [FR-INV-036](application-invocation-functional-specification-v01.md#fr-inv-036), [FR-INV-045](application-invocation-functional-specification-v01.md#fr-inv-045).

<a id="fr-nuxt-109"></a>

### FR-NUXT-109 — No universal rollback claim
Nuxt source/Git/remote rollback claims shall apply [FR-INV-046](application-invocation-functional-specification-v01.md#fr-inv-046).

---

## 19. Interaction-Mode Equivalence

<a id="fr-nuxt-110"></a>

### FR-NUXT-110 — Cross-mode semantic equivalence
Nuxt target, policy, validation and outcomes across modes shall apply [Design §4.6](../appmanager-design-specification-v01.md#_4-6-presentation-independence).

<a id="fr-nuxt-111"></a>

### FR-NUXT-111 — Interactive selection is presentation
Menus for selecting a root application, layer, configuration entry, profile, or integration choice are presentation mechanisms and shall not be the only way to express the underlying Nuxt intent.

<a id="fr-nuxt-112"></a>

### FR-NUXT-112 — Deterministic Headless behaviour
Headless Nuxt target, profile, integration and configuration resolution shall apply [FR-INV-020](application-invocation-functional-specification-v01.md#fr-inv-020).

<a id="fr-nuxt-113"></a>

### FR-NUXT-113 — Machine-consumable results
Nuxt target, integration, configuration and partial-completion results shall apply [FR-INV-021](application-invocation-functional-specification-v01.md#fr-inv-021).

---

## 20. Traceability Summary

| Requirement range | Functional concern | Upstream / same-level authority | Downstream refinement destination |
|---|---|---|---|
| `FR-NUXT-001`–`012` | General Nuxt authority and boundaries | This specification; Root Design; Invocation; Managed Project | Owning domain/shared-contract Detailed Design |
| `FR-NUXT-013`–`020` | Nuxt facts and inspection | This specification; Root Design; Managed Project | Source Intelligence boundary |
| `FR-NUXT-021`–`033` | Nuxt configuration inspection/listing | This specification; Source Transformation; Managed Project | Source Intelligence |
| `FR-NUXT-034`–`050` | Add/remove Nuxt configuration | This specification; Source Transformation; Managed Project | Owning domain/shared-contract Detailed Design |
| `FR-NUXT-051`–`070` | Nuxt layer creation and scaffold orchestration | This specification; Source Transformation | App boundary; Settings boundary; Resource Registry and Template; Documentation; Resource Access; Git boundary |
| `FR-NUXT-071`–`088` | Layer integration/detachment | This specification; Root Design layer model; Source Transformation | Git boundary |
| `FR-NUXT-089`–`092` | Layer lifecycle facts | This specification; Managed Project; Nuxt layer model | Owning domain/shared-contract Detailed Design |
| `FR-NUXT-093`–`102` | File/docs/environment ownership boundaries | This specification; Docs, Settings and App Functional Specifications | Docs, Settings and App domain seams; Resource Registry and Template |
| `FR-NUXT-103`–`109` | Safety/transformation | This specification; Source Transformation; Managed Project | Owning domain/shared-contract Detailed Design |
| `FR-NUXT-110`–`113` | Interaction modes | This specification; Application Invocation | Owning domain/shared-contract Detailed Design |
| `PBC-FR-NUXT-001`–`022` | Expanded framework command surface | This specification §§4.6, 15.1; Design §10.7 | Nuxt domain and Nuxt Capability |

Detailed Design shall extend traceability downward to permanent Nuxt configuration representations, layer models, transformation contracts, generator boundaries, artefact-semantic delegation seams, and provider interfaces without changing these functional ownership decisions.

---

## 21. Conformance Summary

Conformance is assessed against the applicable requirement bodies in this specification and the canonical contracts they reference. The traceability section identifies the requirement groups; this section creates no additional acceptance checklist.

---

## 22. Version 1 Functional Baseline

This document is the Version 1 Functional owner for its stated concern. Its requirement identities remain stable under the [Project Documentation Guide](../project-documentation-guide-v01.md#_9-traceability).
