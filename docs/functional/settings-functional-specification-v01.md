# AppManager Settings Functional Specification

> **Status:** Version 1 Functional Specification
>
> **Functional domain:** `settings`
>
> **Requirement prefix:** `FR-SET`
>
> **Governing sources:** [Project Documentation Guide](../project-documentation-guide-v01.md), [AppManager Design Specification](../appmanager-design-specification-v01.md)
>
> **Related Functional Specifications:** [application-invocation-functional-specification-v01.md](application-invocation-functional-specification-v01.md), [managed-project-functional-specification-v01.md](managed-project-functional-specification-v01.md), [configuration-functional-specification-v01.md](configuration-functional-specification-v01.md), [source-transformation-functional-specification-v01.md](source-transformation-functional-specification-v01.md)
>
> **Planning source:** [docs/project_management/functional-specification-decomposition-plan-v01.md](../project_management/functional-specification-decomposition-plan-v01.md)

## 1. Purpose

This specification defines the observable Version 1 behaviour of the AppManager `settings` domain.

The `settings` domain owns explicit user-facing and automation-facing inspection and management of supported settings, project metadata, environment-variable definitions, contributor metadata, licences and declarative template resources where those operations are exposed as AppManager product behaviour.

The governing boundary is:

> **Settings owns explicit settings and metadata management. Configuration owns how candidate values from configuration sources become effective application configuration. Editing a value does not give Settings authority to redefine configuration precedence, applicability, validation, provenance, or runtime interpretation.**

AppManager's own preferences and identity settings are materially distinct from metadata stored in a managed target project. Version 1 supports both categories while requiring their scope and meaning to remain explicit.

---

## 2. Functional Boundary

### 2.1 Owned behaviour

The `settings` domain owns observable behaviour for:

- inspecting supported AppManager settings where exposed to users or automation;
- explicitly changing supported AppManager settings;
- inspecting and managing supported managed-project author metadata;
- funding metadata;
- bug-reporting metadata;
- repository metadata;
- application metadata including version, description, privacy, module/application type, licence and keywords where retained;
- creating, reading, updating and deleting environment-variable definitions where retained;
- listing and managing contributor metadata where Settings is the primary intent;
- creating and deleting licence resources where exposed as a Settings/resource-management operation;
- listing, adding and deleting declarative templates where Settings is the primary resource-management intent;
- returning structured outcomes suitable for interactive and Headless use.

### 2.2 Explicit non-ownership

This specification does not define:

- configuration-source precedence or effective-configuration resolution;
- managed-project discovery or mutation scope;
- Git repository semantics merely because repository metadata is edited;
- automatic version derivation or versioning policy when that behaviour is owned elsewhere;
- documentation generation merely because a documentation template is managed;
- AI instruction-document creation/deletion when the primary intent is AI-document management;
- Nuxt configuration semantics or generic provider-file generation;
- executable plugin loading or arbitrary executable templates;
- exact storage schemas, file paths, parser APIs, registries, service classes or TypeScript implementation.

**FR-SET-001 — Explicit settings intent**  
A Settings invocation shall identify the setting, metadata class or resource-management intent explicitly enough to distinguish it from a domain operation that merely consumes the same value.

**FR-SET-002 — No configuration-precedence authority**  
Settings shall not redefine configuration source precedence, candidate selection or effective-configuration resolution.

**FR-SET-003 — No implicit runtime effect**  
Changing a persisted setting shall not be represented as changing already-resolved runtime behaviour unless the Configuration Functional Specification and affected use case define that effect.

**FR-SET-004 — Storage independence**  
The Functional contract shall define observable settings behaviour without requiring a particular file format, storage service or schema unless that representation itself is intentionally user-facing.

**FR-SET-005 — Delegated execution**  
Parsers, file services, licence providers, template registries and other delegated capabilities shall not determine AppManager's settings authority, scope or application-level outcome.

---

## 3. Common Settings Behaviour

**FR-SET-006 — Structured invocation**  
Settings use cases shall participate in the common Application Invocation Contract.

**FR-SET-007 — Structured outcome**  
Every Settings operation shall return an application-level result identifying the requested operation, target setting/resource and success, failure, no-op or partial outcome as applicable.

**FR-SET-008 — Interaction-mode equivalence**  
TUI, Headless and future adapters shall preserve equivalent settings semantics even where interactive adapters use menus or prompts.

**FR-SET-009 — Deterministic Headless operation**  
Headless Settings operations shall not require interactive prompts. Missing required target, value, scope or authorisation shall produce a structured failure rather than a prompt or guess.

**FR-SET-010 — Managed-project context**  
Project-scoped settings operations shall use the resolved Managed Project context rather than deriving independent project authority from the current working directory.

**FR-SET-011 — Managed scope**  
Consequential project-scoped settings changes shall remain within approved managed scope.

**FR-SET-012 — Read versus write**  
Settings inspection shall be non-mutating. A write shall require an explicit create, set, update, add, remove or delete intent.

**FR-SET-013 — Existing value reporting**  
Where policy permits, a read operation shall distinguish a present value from an absent or unset value.

**FR-SET-014 — Validation**  
A proposed value shall be validated according to the setting or metadata field's functional constraints before persistence.

**FR-SET-015 — Invalid value**  
An invalid value shall be rejected without intentionally altering the previous valid value.

**FR-SET-016 — No-op update**  
Setting a value to its materially equivalent current value may be reported as unchanged/no-op rather than as a consequential modification.

**FR-SET-017 — Sensitive values**  
Sensitive settings and environment values shall be redacted or omitted from normal presentation and diagnostics according to effective security policy.

**FR-SET-018 — Confirmation**  
Deletion, replacement or other consequential Settings operations shall require confirmation or explicit non-interactive authorisation where the common invocation or owning resource policy requires it.

**FR-SET-019 — Source transformation**  
Where a Settings operation modifies an existing structured project artefact, the mutation shall comply with the Source Transformation Functional Specification.

**FR-SET-020 — Preservation**  
A bounded settings update shall preserve unrelated supported content in the target artefact where practical.

**FR-SET-021 — Application-level acceptance**  
Successful persistence by a delegated mechanism shall not by itself establish success; AppManager shall determine whether the requested settings intent was correctly satisfied.

---

## 4. Settings Scope and Identity

AppManager operator/commit identity and managed-project author metadata are separate semantic scopes. Version 1 preserves that distinction without prescribing UI labels or storage paths.

**FR-SET-022 — Scope identity**  
Every setting shall have an unambiguous semantic scope such as AppManager/user setting, managed-project setting, managed-project metadata or managed resource.

**FR-SET-023 — Operator versus project author**  
AppManager operator/commit identity and managed-project author metadata shall be treated as distinct settings concepts even when both contain fields named `name`, `email` or similar.

**FR-SET-024 — Unambiguous presentation**  
Interactive and machine-facing surfaces shall identify those scopes sufficiently to prevent a reasonable caller from confusing AppManager identity with project publication/ownership metadata.

**FR-SET-025 — No cross-scope write**  
Changing project author metadata shall not silently change AppManager operator/commit identity, and changing AppManager identity shall not silently rewrite managed-project author metadata.

**FR-SET-026 — Explicit project target**  
A managed-project setting change shall apply to the resolved target project, not AppManager's own repository or another discovered project unless that target is explicitly selected.

**FR-SET-027 — AppManager settings inspection**  
Where AppManager exposes its own user/automation settings, Settings shall provide a way to inspect supported values subject to sensitive-value rules.

**FR-SET-028 — AppManager settings mutation**  
Where AppManager exposes a mutable user/automation setting, Settings shall provide explicit set/update/unset behaviour according to that setting's policy.

**FR-SET-029 — Effective-value distinction**  
A persisted setting value and the current effective configuration value shall be distinguishable where they may differ because of precedence, overrides, context or applicability.

**FR-SET-030 — Provenance delegation**  
When effective configuration provenance is exposed, that provenance shall come from Configuration authority rather than being reconstructed independently by Settings.

---

## 5. Managed-Project Author Metadata

**FR-SET-031 — Author metadata**  
Settings shall support management of retained managed-project author metadata including name, email, telephone and URL.

**FR-SET-032 — Field independence**  
Author fields shall be independently inspectable and mutable where the underlying project metadata model supports them.

**FR-SET-033 — Non-standard fields**  
A field not supported by the applicable project metadata convention shall not be silently represented as standard. AppManager shall either support it deliberately as an extension or report it unsupported.

**FR-SET-034 — Email validation**  
Where an author email is supplied, AppManager shall reject structurally invalid values according to the applicable validation policy.

**FR-SET-035 — URL validation**  
Where an author URL is supplied, AppManager shall validate it according to the applicable URL policy before accepting it.

**FR-SET-036 — Telephone representation**  
Where author telephone metadata is retained, AppManager shall preserve it as project metadata without assigning unrelated communication or identity semantics to it.

**FR-SET-037 — Missing author metadata**  
Absent author metadata shall be reported as absent/unset rather than synthesized from AppManager operator identity unless an explicit operation requests such initialization.

---

## 6. Funding, Bug-Reporting and Repository Metadata

**FR-SET-038 — Funding metadata**  
Settings shall support retained funding type and funding URL metadata.

**FR-SET-039 — Funding validation**  
Funding metadata shall be validated as a coherent supported representation before persistence.

**FR-SET-040 — Bug-reporting metadata**  
Settings shall support retained bug-reporting metadata, including a bug-reporting URL where supported.

**FR-SET-041 — Repository metadata**  
Settings shall support retained repository type and repository URL metadata.

**FR-SET-042 — Metadata is not Git authority**  
Changing repository metadata shall not initialise, modify, delete, push, synchronize or otherwise operate a Git repository or remote.

**FR-SET-043 — Repository consistency warning**  
Where AppManager can reliably determine that newly supplied repository metadata conflicts with known managed-repository facts, it may warn or reject according to policy rather than silently asserting false consistency.

**FR-SET-044 — External validation boundary**  
A syntactically valid repository or bug URL shall not be represented as an existing/reachable external resource unless that fact has actually been established by an approved capability.

---

## 7. Application Metadata

**FR-SET-045 — Application metadata use case**  
Settings shall support retained management of application version, description, privacy, application/module type, licence and keywords where applicable to the managed project.

**FR-SET-046 — Version inspection**  
The current declared application version shall be inspectable where the project metadata model exposes one.

**FR-SET-047 — Manual version setting**  
Settings may provide an explicit manual version-setting path.

**FR-SET-048 — Versioning ownership boundary**  
Manual version setting shall not redefine or duplicate automatic version-derivation policy owned by another domain. An automatic-versioning use case may coordinate a Settings metadata update while retaining its own primary intent.

**FR-SET-049 — Version validation**  
A supplied version shall satisfy the project's supported version representation before persistence.

**FR-SET-050 — Description**  
Settings shall support inspection and explicit update of the managed application's description.

**FR-SET-051 — Privacy**  
Settings shall support inspection and explicit update of retained application privacy metadata using an unambiguous boolean or equivalent semantic representation.

**FR-SET-052 — Application/module type**  
Where application/module type metadata is supported, Settings shall restrict values to the supported semantic set rather than persist arbitrary invalid values.

**FR-SET-053 — Keywords**  
Settings shall support inspection and management of application keywords.

**FR-SET-054 — Keyword preservation**  
Adding or removing a keyword shall preserve unrelated keywords and avoid unintended duplicate equivalent entries.

**FR-SET-055 — Keyword replacement**  
Whole-list replacement, if exposed, shall be an explicit operation distinguishable from add/remove behaviour.

**FR-SET-056 — Licence metadata**  
Settings shall expose the managed project's declared licence state where supported.

**FR-SET-057 — Licence coherence**  
Where licence resource creation also changes declared project licence metadata, the operation shall report both effects and shall not claim coherence if one effect fails.

---

## 8. Environment-Variable Definitions

**FR-SET-058 — Environment management**  
Settings shall support retained create, read, update and delete behaviour for managed-project environment-variable definitions.

**FR-SET-059 — Environment scope**  
Environment-variable operations shall identify which supported environment definition/source is being managed and shall not silently modify every environment source discovered in the project.

**FR-SET-060 — Create environment definition**  
Where the selected environment definition does not exist, Settings may create it according to explicit policy or from an approved example/default source.

**FR-SET-061 — Existing environment protection**  
A create operation shall not silently overwrite an existing environment definition.

**FR-SET-062 — Read environment keys**  
Settings may expose recognized environment keys and non-sensitive metadata about them.

**FR-SET-063 — Secret redaction**  
Environment values classified or reasonably recognized as sensitive shall not be emitted unredacted in normal interactive output, structured diagnostics or logs.

**FR-SET-064 — Explicit secret reveal**  
Version 1 shall not require a generic operation that reveals secret values. Any future reveal capability shall require deliberate security and authorization semantics.

**FR-SET-065 — Set environment variable**  
A set operation shall identify one target environment source, key and value and shall preserve unrelated recognized entries where practical.

**FR-SET-066 — Unset environment variable**  
An unset operation shall remove only the selected key from the selected environment source.

**FR-SET-067 — Missing key**  
Unsetting an absent key shall be reported as unchanged/no-op or a clear non-fatal condition rather than implying that a value was removed.

**FR-SET-068 — Comments and unrelated content**  
Where the environment representation supports comments, ordering or other unrelated content, updates should preserve that content where practical.

**FR-SET-069 — Environment syntax**  
Malformed or unsupported environment syntax shall produce a diagnostic rather than being silently rewritten under an assumed interpretation.

**FR-SET-070 — Runtime environment distinction**  
Managing a persisted environment-variable definition shall not be represented as modifying the environment of an already-running process unless a separate use case explicitly does so.

**FR-SET-071 — Configuration distinction**  
Environment variables may be configuration candidates, but Settings shall not decide their effective precedence relative to invocation, project, defaults or external configuration sources.

---

## 9. Contributor Metadata

**FR-SET-072 — Contributor ownership**  
Version 1 assigns project contributor metadata management to the `settings` domain when the primary intent is to inspect or edit declared contributor metadata.

**FR-SET-073 — Contributor listing**  
Settings shall support listing declared contributors including supported name, email and URL fields.

**FR-SET-074 — Empty contributor list**  
A valid project with no declared contributors shall be reported as having none rather than failing.

**FR-SET-075 — Add contributor**  
Settings shall support adding a contributor to the managed project's declared contributor metadata.

**FR-SET-076 — Contributor validation**  
Contributor fields shall be validated according to their applicable semantic constraints before persistence.

**FR-SET-077 — Duplicate contributor**  
AppManager shall avoid creating a materially duplicate contributor entry without explicit intent.

**FR-SET-078 — Preserve contributors**  
Adding one contributor shall preserve existing unrelated contributor entries.

**FR-SET-079 — Utils delegation boundary**  
A Utils surface for contributor addition shall not create a second functional authority and may delegate to the Settings-owned contributor use case for compatibility or convenience.

**FR-SET-080 — Contributor removal**  
If contributor removal is exposed in Version 1, it shall identify the contributor unambiguously and remove only the selected entry.

---

## 10. Licence Resource Management

**FR-SET-081 — Licence resource use case**  
Settings shall support retained creation and deletion of managed-project licence resources where licence management is exposed as a Settings/resource-management operation.

**FR-SET-082 — Licence catalogue**  
AppManager may expose a catalogue of supported licences, but the Functional contract shall not require a particular external catalogue, provider or curated registry.

**FR-SET-083 — Licence identity**  
A licence creation request shall resolve an unambiguous supported licence identity before writing a licence resource.

**FR-SET-084 — Licence text fidelity**  
Where AppManager generates standard licence text, it shall use an approved authoritative or curated source according to provider policy and shall not invent material licence terms.

**FR-SET-085 — Existing licence protection**  
Creation shall not silently replace an existing licence artefact unless replacement is explicitly authorized.

**FR-SET-086 — Licence metadata synchronization**  
Where the licence operation is defined to synchronize project metadata, the intended metadata effect shall be explicit and application-level success shall account for both resource and metadata outcomes.

**FR-SET-087 — Partial licence outcome**  
If licence text is created but metadata synchronization fails, or vice versa, AppManager shall report partial success and actual state rather than claim transactional success.

**FR-SET-088 — Licence deletion**  
Licence deletion shall require an unambiguous target and applicable consequential-operation authorization.

**FR-SET-089 — Delete resource versus metadata**  
Deleting a licence artefact shall not silently remove or rewrite declared licence metadata unless that coupled effect is explicitly part of the selected operation.

**FR-SET-090 — No legal interpretation**  
Licence resource management shall not represent AppManager as determining legal suitability of a licence for a project.

---

## 11. Declarative Template Resource Management

**FR-SET-091 — Template management**  
Settings shall support retained listing, adding and deleting of supported declarative template resources where Settings is the primary resource-management intent.

**FR-SET-092 — Declarative boundary**  
Version 1 template resources shall remain declarative/resource-driven and shall not constitute a general executable plugin framework.

**FR-SET-093 — Template class identity**  
A template shall belong to an explicit supported template class, registry or owning capability where multiple structurally different template types exist.

**FR-SET-094 — Aggregate listing**  
Settings may provide an aggregate read-only view of supported template resources across multiple classes while preserving each template's class/owner identity.

**FR-SET-095 — No false unified schema**  
An aggregate template view shall not imply that all template classes share one interchangeable schema or lifecycle.

**FR-SET-096 — Add template**  
Adding a template shall identify its target template class and validate the resource according to that class before registration or persistence.

**FR-SET-097 — Delete template**  
Deleting a template shall identify the exact template and template class and shall not delete similarly named resources in other classes.

**FR-SET-098 — Domain-owned execution**  
Managing a template resource in Settings shall not transfer execution/application semantics from the domain that owns use of that template. For example, AI-document generation remains AI-owned when AI-document management is the primary intent.

**FR-SET-099 — Generic custom templates**  
Version 1 does not require a fourth arbitrary generic template registry merely because aggregate management is available. Such a registry requires a deliberate future product decision.

**FR-SET-100 — Template safety**  
A template resource shall not be permitted to expand mutation authority beyond the scope of the use case that later applies it.

---

## 12. Cross-Domain Coordination

**FR-SET-101 — Settings as data owner, domain as intent owner**  
A domain use case may consume or update Settings-owned metadata while retaining ownership of its primary product intent.

**FR-SET-102 — App initialization coordination**  
An `app` initialization use case may coordinate creation of an environment definition through Settings-owned behaviour without transferring application-lifecycle ownership to Settings.

**FR-SET-103 — Git coordination**  
Git operations may consume identity or repository-related settings, but repository effects remain Git-owned.

**FR-SET-104 — Docs coordination**  
Docs may consume author, contributor, licence or project metadata for documentation generation without gaining Settings mutation authority.

**FR-SET-105 — Nuxt coordination**  
Nuxt creation/provisioning may consume project metadata or settings when scaffolding Nuxt artefacts, while Nuxt-specific semantics remain Nuxt-owned.

**FR-SET-106 — Automatic versioning coordination**  
A future retained automatic-versioning use case may derive a version and request a bounded Settings-owned metadata update; derivation policy remains with the owning automatic-versioning use case.

**FR-SET-107 — AI template coordination**  
AI may consume an AI-document template managed as a resource, but AI output remains subject to AI/domain-specific acceptance and does not become authoritative because the template was Settings-managed.

---

## 13. Results, Failure and Safety

**FR-SET-108 — Failure classification**  
Settings failures shall identify whether the failure arose from target resolution, validation, authorization, read, transformation/persistence, delegated provider behavior or application-level acceptance where relevant.

**FR-SET-109 — Partial success**  
A multi-effect Settings operation shall explicitly report partial success where only some intended effects complete.

**FR-SET-110 — No false rollback**  
AppManager shall not imply that completed settings/resource effects were rolled back unless that guarantee is actually provided.

**FR-SET-111 — Cancellation**  
Cancellation shall stop further settings effects as soon as safely practical and report already completed effects.

**FR-SET-112 — Concurrent modification**  
Where a Settings transformation is based on previously inspected content, AppManager shall avoid silently overwriting a materially changed target when the conflict can be detected.

**FR-SET-113 — Diagnostic sensitivity**  
Errors, warnings and structured results shall minimize exposure of secrets and sensitive environment values.

**FR-SET-114 — External provider failure**  
Failure of an external catalogue or provider shall not be misreported as successful settings/resource management.

**FR-SET-115 — No hidden broad mutation**  
A single-field or single-resource Settings operation shall not silently rewrite unrelated project resources merely to normalize them.

**FR-SET-116 — Fail-safe ambiguity**  
Ambiguous target scope, metadata identity, environment source, licence target or template class shall be resolved explicitly or fail safely rather than guessed.

---

## 14. Traceability Summary

| Functional area | Requirements | Current authority |
|---|---|---|
| Domain boundary | FR-SET-001–005 | Root Design; decomposition plan §5.8 |
| Common Settings behaviour | FR-SET-006–021 | FR-INV, FR-PROJ, FR-CONFIG, FR-XFORM |
| Scope and identity | FR-SET-022–030 | This specification §4; Configuration boundary |
| Author metadata | FR-SET-031–037 | This specification §5 |
| Funding/bugs/repository metadata | FR-SET-038–044 | This specification §6; Git ownership boundary |
| Application metadata | FR-SET-045–057 | This specification §7 |
| Environment definitions | FR-SET-058–071 | This specification §8; Configuration boundary |
| Contributors | FR-SET-072–080 | This specification §9; Utils delegation boundary |
| Licences | FR-SET-081–090 | This specification §10 |
| Templates | FR-SET-091–100 | This specification §11; declarative extension boundary |
| Cross-domain coordination | FR-SET-101–107 | This specification §12; Root Design domain/capability authority |
| Results and safety | FR-SET-108–116 | This specification §13; FR-INV, FR-PROJ, FR-XFORM |

---

## 15. Downstream Specification Boundary

Detailed Design may define permanent contracts for settings models, metadata adapters, environment-definition parsing, licence catalogues/providers, declarative template registries, resource managers and coordination interfaces.

Implementation Specifications may define concrete TypeScript modules, `settings.json`, `package.json` mappings, `.env` handling, parser/service placement, exact validation libraries, licence provider APIs, cache behaviour, registry structures, command identifiers and menu labels.

Neither level may redefine configuration precedence, domain authority or the functional ownership established here without an approved change to the governing specification hierarchy.

---

## 16. Version 1 Functional Baseline

This document establishes the Version 1 Functional baseline for the AppManager `settings` domain.

The central rule is:

> **Settings may manage values and declarative resources; it does not decide how every consumer interprets them. Persistence is not precedence, metadata is not operational authority, and resource management is not execution authority.**