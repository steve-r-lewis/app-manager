# DD-2.6 — AppManager Resource Registry and Template Detailed Design

> **Detailed Design ID:** DD-2.6
>
> **Design family:** DD-2 — Shared Capabilities

> **Status:** Version 1 Detailed Design Specification
>
> **Detailed Design authority:** This document defines the permanent shared contracts for declarative resource registries, template discovery, template validation, parameter binding, deterministic rendering, provenance, compatibility and extension beneath AppManager application authority. It refines, but does not override, the root Design Specification, Functional Specifications, accepted ADRs, or the DD-1 Application Core Detailed Designs.
>
> **Sources and navigation:** [Project Documentation Guide](../project-documentation-guide-v01.md), [AppManager Design Specification](../appmanager-design-specification-v01.md), [Detailed Design Register](../project_management/detailed-design-register-v01.md), [ADR-0001 — Primary Application Runtime](../project_management/decisions/adr-0001-primary-application-runtime.md)
>
> **Related Detailed Design authorities:** [DD-1.1 — Application Invocation](../dd_1_application_core/dd-1-1-application-invocation-detailed-design-v01.md), [DD-1.2 — Execution Outcomes](../dd_1_application_core/dd-1-2-execution-outcomes-detailed-design-v01.md), [DD-1.3 — Managed Project](../dd_1_application_core/dd-1-3-managed-project-detailed-design-v01.md), [DD-1.4 — Configuration Resolution](../dd_1_application_core/dd-1-4-configuration-resolution-detailed-design-v01.md), [DD-1.5 — Application Engine](../dd_1_application_core/dd-1-5-application-engine-detailed-design-v01.md), [DD-2.1 — Resource Access](dd-2-1-resource-access-detailed-design-v01.md), [DD-2.4 — Source Intelligence](dd-2-4-source-intelligence-detailed-design-v01.md), [DD-2.5 — Source Transformation](dd-2-5-source-transformation-detailed-design-v01.md)
>
> **Primary Functional authorities:** [docs/functional/settings-functional-specification-v01.md](../functional/settings-functional-specification-v01.md) for declarative template-resource management, plus the App, Docs, Nuxt, AI, Settings and other domain Functional Specifications where they consume declarative resources or templates.

---

## 1. Purpose

Resource Registry and Template supplies declarative item discovery, validation, exact resolution, parameter binding and rendering. Separate registry classes let callers reuse these mechanics while retaining each class's identity, compatibility and domain meaning. Rendered proposals feed the caller's creation or transformation workflow under [Design §6.8](../appmanager-design-specification-v01.md#_6-8-generation-and-templates).

## 2. Scope

This design owns permanent internal contracts for:

- registry identity and registry-class identity;
- registry item identity;
- resource kind and template kind metadata;
- schema and item-version metadata;
- resource discovery and enumeration;
- exact item resolution;
- aliases only where explicitly declared;
- registration-source provenance;
- resource-origin and trust metadata;
- registry validation;
- item validation;
- template identity;
- template parameter definitions;
- parameter binding and validation;
- defaults and required-input semantics;
- template variants;
- deterministic template rendering;
- rendered-output representation;
- output format/kind metadata;
- rendering diagnostics;
- compatibility and evolution metadata;
- duplicate/conflict representation;
- approved extension registration;
- aggregate read-only registry views;
- provider/loader isolation;
- sensitive template/input handling;
- normalized registry/template evidence;
- provider replaceability and testability.

This design defines capability contracts. It does not require one registry file, one template engine, one class hierarchy, one JSON schema library, one TypeScript interface, one package, or one process.

---

## 3. Explicit Non-Ownership

Resource Registry and Template shall not own:

- AppManager command or use-case semantics;
- managed-project identity or managed scope;
- application authorization or confirmation policy;
- target-path selection merely because a template declares a suggested filename;
- filesystem mutation;
- source-transformation authority;
- repository mutation;
- Nuxt lifecycle semantics;
- documentation workflow semantics;
- AI workflow semantics;
- Settings-domain management intent;
- licence legal interpretation;
- configuration precedence;
- arbitrary executable plugin loading;
- provider-side scripts supplied by untrusted registry items;
- final AppManager success, failure, partial-success or cancellation acceptance.

A registry may report that an item is valid, invalid, unavailable, incompatible, ambiguous or unsupported. A renderer may report that rendering succeeded or failed. These are capability facts, not final application outcomes.

---

## 4. Architectural Position

The permanent dependency direction is:

```text
Application Engine / owning domain use case
        |
        +--> managed-project context / operation scope
        +--> effective configuration
        +--> application policy / authorization
        +--> requested resource or template identity
        |
        v
+------------------------------------------------+
| Resource Registry and Template capability      |
|                                                |
| registry discovery / resolution                |
| schema and item validation                     |
| provenance / compatibility                     |
| template parameter binding                     |
| deterministic rendering                        |
| normalized registry/render evidence            |
+------------------------+-----------------------+
                         |
              +----------+----------+
              |                     |
              v                     v
      declarative sources      bounded renderers
              |                     |
              +----------+----------+
                         |
                         v
               rendered/proposed content
                         |
                         v
          owning use case / generation path
                         |
          +--------------+----------------+
          |                               |
          v                               v
   create new resource             existing target
   via Resource Access             -> Source Transformation
```

The capability is therefore upstream of resource effects.

<a id="dd-reg-001"></a>

**DD-REG-001 — Registration is descriptive**

Registry discovery/metadata versus application authority follows [Design](../appmanager-design-specification-v01.md#_6-9-registries).

<a id="dd-reg-002"></a>

**DD-REG-002 — Rendering is non-mutating**  
Rendering shall produce bounded output/evidence and shall not itself persist the output to a managed-project target.

<a id="dd-reg-003"></a>

**DD-REG-003 — Generation/mutation boundary**

Rendered output destined for new or existing resources follows [Design](../appmanager-design-specification-v01.md#_6-8-generation-and-templates).


---

## 5. Responsibility Model

The capability is decomposed into logical responsibilities:

1. **Registry Catalogue** — exposes known registry classes and their descriptors.
2. **Registry Loader** — acquires declarative registry material from approved sources.
3. **Registry Validator** — validates registry-level structure and version metadata.
4. **Item Validator** — validates resource/template items against their owning class contract.
5. **Item Resolver** — resolves exact item identities and declared aliases/variants.
6. **Compatibility Evaluator** — determines whether schema/item versions are supported.
7. **Provenance Recorder** — preserves source/origin/revision/trust evidence.
8. **Template Parameter Binder** — validates and binds explicit/default parameter values.
9. **Template Renderer** — renders bounded output without persisting it.
10. **Evidence Normalizer** — converts loader/renderer-native results into AppManager-oriented evidence.
11. **Extension Registration Boundary** — admits approved declarative extensions without becoming a plugin runtime.

These responsibilities need not map one-to-one to classes or packages.

---

## 6. Registry Classes

Version 1 shall support multiple registry classes where resources have materially different schemas or ownership.

Examples may include:

- scaffolding artefact templates;
- AI instruction-document templates;
- licence catalogue/resources;
- Nuxt-specific generation resources;
- documentation templates;
- other explicitly approved declarative resource classes.

<a id="dd-reg-004"></a>

**DD-REG-004 — Explicit registry class**  
Every registered item shall be associated with an explicit registry class or owning capability contract.

<a id="dd-reg-005"></a>

**DD-REG-005 — No false unified schema**  
Shared discovery infrastructure shall not imply that all registry classes accept the same item fields, parameter schema, lifecycle or renderer.

<a id="dd-reg-006"></a>

**DD-REG-006 — Aggregate view is read-only composition**  
An aggregate listing may combine item summaries from multiple registry classes for discovery, but shall preserve registry class and owner identity and shall not manufacture cross-class interchangeability.

<a id="dd-reg-007"></a>

**DD-REG-007 — No arbitrary generic registry requirement**  
Version 1 shall not create a fourth or universal arbitrary custom-template registry merely to make all template-like resources appear uniform.

This directly preserves `FR-SET-093`–`FR-SET-099`.

---

## 7. Registry Identity Contract

A registry descriptor shall be capable of representing, where relevant:

- stable registry-class identity;
- owning capability/domain identity;
- registry schema identity;
- registry schema version;
- supported item kinds;
- supported item-schema/version ranges;
- provenance/source descriptor;
- trust classification;
- extension policy;
- loader/provider identity where useful;
- diagnostics/availability state.

<a id="dd-reg-008"></a>

**DD-REG-008 — Stable identity over incidental location**  
Registry identity shall not be defined solely by a current filesystem path, module path or provider object.

<a id="dd-reg-009"></a>

**DD-REG-009 — Registry source is provenance**

Registry source locations and provider identity follows [Design](../appmanager-design-specification-v01.md#_6-6-capability-boundaries-and-providers).

<a id="dd-reg-010"></a>

**DD-REG-010 — Registry availability**  
Unavailable, malformed, incompatible and empty registries shall remain distinguishable.

---

## 8. Registry Item Contract

A normalized registry item shall be capable of representing:

- stable item identity within its registry class;
- human-readable title/description where useful;
- item kind;
- item schema/version metadata;
- category/tags where defined by the class;
- provenance;
- compatibility constraints;
- deprecation/replacement metadata where applicable;
- output/resource format metadata where applicable;
- parameter schema reference where applicable;
- variant metadata where applicable;
- renderer/provider reference through a bounded approved mechanism where applicable;
- content or content reference where the class permits it;
- diagnostics/warnings.

<a id="dd-reg-011"></a>

**DD-REG-011 — Identity is not filename**  
An output filename, target filename or display title shall not substitute for stable registry-item identity.

<a id="dd-reg-012"></a>

**DD-REG-012 — Duplicate identity is explicit**  
Multiple active items claiming the same identity within the same registry class shall produce a conflict/ambiguity unless an explicit version/override rule resolves them.

<a id="dd-reg-013"></a>

**DD-REG-013 — Similar names remain distinct**  
Deletion or selection shall use exact registry-class/item identity and shall not affect similarly named items in another class.

---

## 9. Provenance and Trust

Registry and template evidence shall preserve sufficient provenance to explain what resource was selected and from where it originated.

Provenance may include:

- built-in AppManager resource;
- managed-project declarative resource;
- user-configured resource source;
- curated external catalogue/provider;
- generated/cache material derived from an authoritative source;
- schema/version/revision/hash evidence where useful.

<a id="dd-reg-014"></a>

**DD-REG-014 — Provenance survives normalization**  
Normalization shall not discard materially relevant origin/version evidence.

<a id="dd-reg-015"></a>

**DD-REG-015 — Provenance is not trust equivalence**  
Two resources with the same semantic item identity but different origins shall not automatically be considered equally trusted.

<a id="dd-reg-016"></a>

**DD-REG-016 — External resource claims require evidence**  
A declared external source or catalogue entry shall not be represented as reachable/current merely because a URI is syntactically valid.

<a id="dd-reg-017"></a>

**DD-REG-017 — Curated licence fidelity**  
Where standard licence text is supplied, provenance shall support the owning Settings/licence use case in determining that text came from an approved authoritative or curated source. The capability shall not invent licence terms or determine legal suitability.

---

## 10. Registry Discovery

Discovery shall support:

- listing registry classes;
- listing valid items within a class;
- retrieving item summaries;
- resolving an exact item;
- filtering by class-defined metadata where required;
- exposing invalid/incompatible items when diagnostics require them without treating them as usable.

<a id="dd-reg-018"></a>

**DD-REG-018 — Discovery is read-only**  
Discovery shall not register, delete, execute, render or apply an item as a side effect.

<a id="dd-reg-019"></a>

**DD-REG-019 — Deterministic identity resolution**  
Given the same registry snapshot, compatibility context and explicit item identity, resolution shall be deterministic.

<a id="dd-reg-020"></a>

**DD-REG-020 — Ambiguity is not guessed**  
Ambiguous item identity, registry class or version shall fail resolution or require higher-level disambiguation.

<a id="dd-reg-021"></a>

**DD-REG-021 — Discovery does not imply eligibility**  
A discoverable template may still be inapplicable to the current project, use case, version or managed scope.

---

## 11. Registry Validation

Registry validation occurs before item use and is distinct from application acceptance.

Validation may include:

- syntactic/serialization validity;
- registry schema identity;
- schema version support;
- required top-level metadata;
- item collection structure;
- duplicate identity checks;
- class-specific invariants;
- provenance integrity where verifiable;
- unsupported executable constructs;
- sensitive-content policy where applicable.

<a id="dd-reg-022"></a>

**DD-REG-022 — Invalid registry is not partially trusted by default**  
A malformed registry shall not silently expose unvalidated items as normal usable resources unless the owning registry class explicitly defines safe partial loading.

<a id="dd-reg-023"></a>

**DD-REG-023 — Validation diagnostics**

Registry parser failures, attributed to registry/class/location follows [DD-1.2](../dd_1_application_core/dd-1-2-execution-outcomes-detailed-design-v01.md#_18-provider-result-normalization).

<a id="dd-reg-024"></a>

**DD-REG-024 — Validation is side-effect free**  
Registry validation shall not execute template content or mutate managed-project resources.

---

## 12. Item Validation

Item validation shall be class-specific.

It may validate:

- required identity fields;
- item kind;
- item schema/version;
- required content/content reference;
- parameter definitions;
- variants;
- output format declarations;
- compatibility constraints;
- forbidden executable material;
- class-specific semantic invariants.

<a id="dd-reg-025"></a>

**DD-REG-025 — Class-specific validation**  
An item valid in one registry class shall not be assumed valid in another.

<a id="dd-reg-026"></a>

**DD-REG-026 — Unsupported is distinct from invalid**  
A well-formed item using a newer/unsupported schema or renderer shall be distinguishable from a malformed item.

<a id="dd-reg-027"></a>

**DD-REG-027 — Validation does not grant use**

Application acceptance of a validated registry item follows [Design](../appmanager-design-specification-v01.md#_6-2-application-engine-authority).


---

## 13. Template Identity and Kinds

A template is a registry item capable of producing bounded output from validated inputs.

Template metadata may distinguish:

- static templates;
- parameterized/dynamic templates;
- variant templates;
- composite templates assembled from declarative blocks;
- structured-output templates;
- text-output templates;
- domain-specific template kinds.

<a id="dd-reg-028"></a>

**DD-REG-028 — Template kind is explicit**  
Consumers shall not infer rendering semantics solely from filename extension or arbitrary content inspection where the registry class defines explicit kind/format metadata.

<a id="dd-reg-029"></a>

**DD-REG-029 — Static template still has identity/provenance**  
A static content resource is not exempt from registry identity, validation, provenance and compatibility rules.

<a id="dd-reg-030"></a>

**DD-REG-030 — Composite is not arbitrary code composition**  
Composite templates may combine approved declarative blocks/render operations but shall not become a mechanism for executing arbitrary project-supplied code.

---

## 14. Template Parameter Contract

A template parameter definition shall be capable of representing, where relevant:

- parameter identity/name;
- semantic description;
- value type/shape;
- required/optional state;
- default value or default-source rule;
- allowed values/constraints;
- sensitivity classification;
- whether the value affects output identity/path metadata;
- class-specific validation rules.

<a id="dd-reg-031"></a>

**DD-REG-031 — Explicit required inputs**  
Missing required parameters shall produce a binding diagnostic rather than silently inventing arbitrary values.

<a id="dd-reg-032"></a>

**DD-REG-032 — Defaults are declared**  
Defaults shall come from the template/class contract or from a higher-level resolved input explicitly permitted by that contract. A renderer shall not establish private configuration precedence.

<a id="dd-reg-033"></a>

**DD-REG-033 — Parameter validation precedes rendering**  
Invalid bound parameters shall prevent normal rendering.

<a id="dd-reg-034"></a>

**DD-REG-034 — Extra parameters**  
Unknown parameters shall be rejected or explicitly ignored according to the registry-class contract; they shall not silently alter unrelated behavior.

<a id="dd-reg-035"></a>

**DD-REG-035 — Sensitive parameters**  
Sensitive parameter values shall be minimized/redacted in diagnostics and shall not be copied into provenance metadata unless required for the rendered artefact itself.

---

## 15. Parameter Binding and Effective Configuration

Parameter binding may consume:

- explicit use-case inputs;
- managed-project facts;
- Settings-owned project metadata;
- operation effective configuration;
- template-declared defaults;
- approved derived values such as current year where the template contract deliberately permits them.

The binding responsibility does not determine global precedence among those sources.

<a id="dd-reg-036"></a>

**DD-REG-036 — Effective configuration remains authoritative**

Configuration-dependent parameters consume [DD-1.4 effective values](../dd_1_application_core/dd-1-4-configuration-resolution-detailed-design-v01.md#_15-resolution-result).

<a id="dd-reg-037"></a>

**DD-REG-037 — Derived values are declared behavior**  
Clock/time, generated identifiers or other derived values that affect output shall be part of the rendering input/evidence so deterministic tests and previews can control them.

<a id="dd-reg-038"></a>

**DD-REG-038 — Managed-project facts are context, not mutation authority**

Project/layer/repository parameters bound into output follows [Design](../appmanager-design-specification-v01.md#_9-9-non-destructive-ownership-and-unmanaged-content).


---

## 16. Template Variants

A template may expose variants when the owning registry class deliberately defines them, for example root versus layer or environment-specific forms.

<a id="dd-reg-039"></a>

**DD-REG-039 — Variant identity**  
Variant selection shall be explicit or deterministically derived from an approved semantic input.

<a id="dd-reg-040"></a>

**DD-REG-040 — No hidden variant guessing**  
If multiple variants remain applicable and selection is material, the capability shall report ambiguity rather than choose based on incidental ordering.

<a id="dd-reg-041"></a>

**DD-REG-041 — Variant compatibility**  
Variants may declare independent compatibility constraints and parameter refinements.

<a id="dd-reg-042"></a>

**DD-REG-042 — Variant does not redefine scope**

Layer-variant selection versus managed-target identity follows [Design](../appmanager-design-specification-v01.md#_9-6-project-discovery-and-context-resolution).


---

## 17. Rendering Contract

A render request shall be capable of identifying:

- registry class;
- exact template item identity/version where required;
- selected variant;
- validated bound parameters;
- rendering-purpose/correlation metadata where useful;
- expected output kind/format;
- deterministic derived-input snapshot;
- cancellation linkage where rendering may be expensive.

A normalized render result shall be capable of representing:

- template identity/version;
- variant;
- renderer/provider identity where useful;
- bound-parameter summary with sensitive values redacted;
- rendered output or bounded output reference;
- output kind/format;
- suggested filename/path metadata where the template defines it;
- diagnostics/warnings;
- provenance;
- deterministic input/revision evidence;
- technical rendering status.

<a id="dd-reg-043"></a>

**DD-REG-043 — Renderer is subordinate**

Rendering the selected contract versus inventing a workflow follows [Design](../appmanager-design-specification-v01.md#_6-9-registries).

<a id="dd-reg-044"></a>

**DD-REG-044 — Render output is proposed content**

Rendered proposals before persistence uses [DD-REG-002](#dd-reg-002).

<a id="dd-reg-045"></a>

**DD-REG-045 — Suggested output path is not target authority**  
A template-declared output filename/path is metadata. The owning use case and Managed Project/scope contracts determine the actual target.

---

## 18. Deterministic Rendering

Rendering should be deterministic for a fixed:

- template identity/version;
- template content/revision;
- variant;
- bound parameter set;
- explicitly supplied derived values;
- renderer version/compatibility context where material.

<a id="dd-reg-046"></a>

**DD-REG-046 — No ambient hidden inputs**  
Renderers shall not silently depend on current working directory, ambient process environment, uncontrolled clock values, network responses or mutable global state when those inputs materially affect output.

<a id="dd-reg-047"></a>

**DD-REG-047 — Controlled clock-derived content**

Clock/date/year/time values used by templates uses [DD-REG-037](#dd-reg-037).

<a id="dd-reg-048"></a>

**DD-REG-048 — External fetch is separate**  
If template material must be obtained from an external provider, acquisition/refresh shall be explicit capability work. Rendering shall not silently fetch arbitrary network content.

---

## 19. Rendering Providers

The permanent contract does not require a single rendering mechanism.

Approved implementations may include:

- pure functions compiled with AppManager;
- declarative interpolation;
- structured object assembly;
- bounded format-specific renderers;
- composition of approved declarative blocks.

However:

<a id="dd-reg-049"></a>

**DD-REG-049 — No general executable plugin framework**  
A registry item shall not carry arbitrary executable code that AppManager loads and runs merely because it is registered.

<a id="dd-reg-050"></a>

**DD-REG-050 — Provider-native representations remain below boundary**

Renderer ASTs, functions and native result/error objects follows [DD-1.2](../dd_1_application_core/dd-1-2-execution-outcomes-detailed-design-v01.md#_18-provider-result-normalization).

<a id="dd-reg-051"></a>

**DD-REG-051 — Provider selection cannot redefine semantics**  
Changing renderer implementation shall not silently alter template identity, required parameters, application scope or authorization semantics.

---

## 20. Generation Versus Mutation

DD-2.5 establishes the permanent generation/mutation distinction.

The registry/template capability therefore follows:

```text
render template
    |
    v
proposed new artefact content
    |
    +--> target absent + creation authorized
    |       -> Resource Access create
    |
    +--> target exists + bounded modification intended
    |       -> Source Transformation plan
    |
    +--> target exists + explicit whole-resource replacement intended
            -> owning use case applies replacement policy/approval
               -> bounded Resource Access effect
```

<a id="dd-reg-052"></a>

**DD-REG-052 — Existing source is not a blank template target**

Generated replacements for authored resources follows [Design](../appmanager-design-specification-v01.md#_6-8-generation-and-templates).

<a id="dd-reg-053"></a>

**DD-REG-053 — Template ownership is not target ownership**

Ownership of destinations produced from built-in templates follows [Design](../appmanager-design-specification-v01.md#_9-9-non-destructive-ownership-and-unmanaged-content).

<a id="dd-reg-054"></a>

**DD-REG-054 — Generated-region scope**

Generated-region updates apply [FR-XFORM-047](../functional/source-transformation-functional-specification-v01.md#fr-xform-047) through Source Transformation.


---

## 21. Preview and Dry Run

Rendering is naturally usable for preview because it is non-mutating.

<a id="dd-reg-055"></a>

**DD-REG-055 — Preview uses executable render semantics**  
A preview shall derive from the same template identity, variant, bound inputs and renderer semantics intended for later generation.

<a id="dd-reg-056"></a>

**DD-REG-056 — Preview does not imply applicability**

Render preview uses [DD-1.2](../dd_1_application_core/dd-1-2-execution-outcomes-detailed-design-v01.md#_13-proposed-effects-and-preview) separately from the destination/safety checks of the owning use case.

<a id="dd-reg-057"></a>

**DD-REG-057 — Preview uncertainty**  
If rendering depends on unresolved inputs, incompatible resources or unavailable providers, the preview shall expose the limitation rather than fabricate certain output.

---

## 22. Registry Mutation and Settings Integration

Settings may own product use cases for listing, adding and deleting declarative template resources. The shared capability supplies the technical registry contracts beneath those use cases.

<a id="dd-reg-058"></a>

**DD-REG-058 — Registry mutation is a bounded resource-management effect**  
Adding or deleting a registry item shall occur only under an owning use case that has resolved registry class, target registry source, scope and authorization.

<a id="dd-reg-059"></a>

**DD-REG-059 — Registration validation before persistence**  
An added item shall be validated against its target registry class before being treated as registered/usable.

<a id="dd-reg-060"></a>

**DD-REG-060 — Exact deletion**

Exact deletion across registry classes uses [DD-REG-013](#dd-reg-013).

<a id="dd-reg-061"></a>

**DD-REG-061 — Registry persistence uses shared resource semantics**

Registry persistence delegates to [Resource Access](dd-2-1-resource-access-detailed-design-v01.md); structured existing-source changes follow [Design](../appmanager-design-specification-v01.md#_7-code-intelligence-and-transformation-architecture).

<a id="dd-reg-062"></a>

**DD-REG-062 — Settings does not acquire execution semantics**

Settings management of templates consumed by other domains follows [Design](../appmanager-design-specification-v01.md#_6-9-registries).


---

## 23. Extension Registration

Approved extension registration may allow additional declarative resources without changing AppManager code for every item.

An extension registration contract may define:

- eligible registry class;
- accepted schema/version;
- source/provenance requirements;
- trust restrictions;
- conflict/override policy;
- validation requirements;
- lifecycle/persistence policy;
- compatibility requirements.

<a id="dd-reg-063"></a>

**DD-REG-063 — Extensions are class-bounded**  
An extension may register only into a registry class that explicitly permits extension.

<a id="dd-reg-064"></a>

**DD-REG-064 — Extension cannot add arbitrary execution**

Executable hooks, shell commands and project code in declarative extensions uses [DD-REG-049](#dd-reg-049).

<a id="dd-reg-065"></a>

**DD-REG-065 — Override is explicit**  
An extension shall not silently replace a built-in or higher-trust item with the same identity unless the registry class defines an explicit, reviewable override/version policy.

<a id="dd-reg-066"></a>

**DD-REG-066 — Extension does not broaden scope**

Registered references to paths/commands/layers follows [Design](../appmanager-design-specification-v01.md#_6-9-registries).


---

## 24. Compatibility and Evolution

Registry and template contracts require explicit evolution because persisted declarative resources may outlive one AppManager version.

Compatibility may consider:

- registry schema version;
- item schema version;
- template semantic version/revision;
- renderer capability/version;
- AppManager version range;
- domain/capability version where material;
- deprecated/replaced item identity.

<a id="dd-reg-067"></a>

**DD-REG-067 — Schema version is explicit**  
Persisted registries intended for evolution shall carry sufficient schema identity/version metadata to determine compatibility.

<a id="dd-reg-068"></a>

**DD-REG-068 — Unsupported future version fails safely**  
A newer unsupported schema shall not be interpreted using older assumptions merely because some fields look familiar.

<a id="dd-reg-069"></a>

**DD-REG-069 — Migration is deliberate**  
Schema migration, when supported, shall be an explicit operation or loader policy with diagnostics/provenance. Loading shall not silently destroy unknown newer data.

<a id="dd-reg-070"></a>

**DD-REG-070 — Item evolution preserves identity semantics**  
Version changes shall not silently reuse an item identity for materially unrelated semantics.

<a id="dd-reg-071"></a>

**DD-REG-071 — Deprecation is metadata, not deletion**  
A deprecated item may remain discoverable with warning/replacement metadata until an owning policy removes it.

---

## 25. Conflict and Override Model

Registry composition may encounter:

- duplicate item identity;
- competing versions;
- built-in versus project-provided item;
- alias collision;
- incompatible schema;
- conflicting variants;
- conflicting provenance/trust levels.

<a id="dd-reg-072"></a>

**DD-REG-072 — No incidental last-write-wins**  
Registry composition shall not resolve material conflicts merely by filesystem enumeration order, object insertion order or provider return order.

<a id="dd-reg-073"></a>

**DD-REG-073 — Precedence is class policy**  
If a registry class supports precedence/override, the rule shall be explicit and deterministic and shall not be confused with DD-1.4 application configuration precedence.

<a id="dd-reg-074"></a>

**DD-REG-074 — Conflict evidence**  
Unresolved conflicts shall preserve the competing identities/origins sufficiently for higher-level remediation.

---

## 26. Resource Content and References

Registry items may embed content or refer to approved content resources.

<a id="dd-reg-075"></a>

**DD-REG-075 — Content reference is bounded**  
A content reference shall identify an approved resource source and shall not permit arbitrary path traversal or unrestricted URI fetching.

<a id="dd-reg-076"></a>

**DD-REG-076 — Resource Access boundary**

Registry loaders use [DD-2.1 bounded reads](dd-2-1-resource-access-detailed-design-v01.md#dd-res-019) for local content.

<a id="dd-reg-077"></a>

**DD-REG-077 — Content revision evidence**  
Where reproducibility or stale-state matters, rendering evidence should identify the registry/template content revision/hash/snapshot used.

<a id="dd-reg-078"></a>

**DD-REG-078 — Missing content is explicit**  
An item whose referenced content is missing/unavailable shall not be reported as normally renderable.

---

## 27. Structured Output Templates

Templates may produce structured values such as JSON-like configuration as well as text.

<a id="dd-reg-079"></a>

**DD-REG-079 — Structured output remains typed/validated evidence**  
A structured renderer may return an AppManager-oriented structured value plus format metadata rather than prematurely serializing it where downstream generation benefits from structure.

<a id="dd-reg-080"></a>

**DD-REG-080 — Serialization is explicit**  
When a target resource requires serialization, format/encoding/newline/ordering semantics that affect correctness or preservation shall be explicit in the generation path.

<a id="dd-reg-081"></a>

**DD-REG-081 — Structured generation does not bypass transformation**

Structured output for existing-resource changes follows [Design](../appmanager-design-specification-v01.md#_6-8-generation-and-templates) through the approved transformation path.


---

## 28. Domain Ownership Integration

### 28.1 App

App initialization may consume scaffolding templates for new project artefacts. App owns lifecycle intent, target project, sequencing and acceptance.

### 28.2 Nuxt

Nuxt may consume Nuxt-specific templates/resources for projects, layers and configuration. Nuxt owns Nuxt semantics and eligibility; the registry/template capability owns reusable resource resolution/rendering.

### 28.3 Docs

Docs may consume documentation templates. Docs owns documentation intent, source selection, aggregation and acceptance.

### 28.4 AI

The [AI domain resource workflows](../dd_4_policy_and_resource_domains/dd-4-3-ai-domain-detailed-design-v01.md#resource-family-lifecycle) may consume templates or rendered bounded context. Enrichment follows [Design §11.10](../appmanager-design-specification-v01.md#_11-10-ai-assisted-workflow).

### 28.5 Settings

Settings may manage declarative template resources and licence catalogue/resources. Settings owns the resource-management intent, not the later domain execution semantics.

<a id="dd-reg-082"></a>

**DD-REG-082 — Domain semantics remain above registry**

Registry presence versus domain-workflow dispatch follows [Design](../appmanager-design-specification-v01.md#_6-9-registries).


---

## 29. Licence Resource Boundary

Licence resources are a useful example of a registry that is not interchangeable with ordinary scaffolding templates.

<a id="dd-reg-083"></a>

**DD-REG-083 — Licence identity is exact**  
Licence catalogue resolution shall return an unambiguous supported licence identity before text generation/resolution.

<a id="dd-reg-084"></a>

**DD-REG-084 — Licence text provenance**

Standard licence text provenance uses [DD-REG-017](#dd-reg-017).

<a id="dd-reg-085"></a>

**DD-REG-085 — No legal recommendation semantics**

Claims about legal suitability of licence metadata uses [DD-REG-017](#dd-reg-017).

<a id="dd-reg-086"></a>

**DD-REG-086 — Licence creation remains a Settings/application effect**

Licence rendering uses [DD-REG-002](#dd-reg-002); LICENSE persistence and metadata coupling are [Settings-owned](../dd_4_policy_and_resource_domains/dd-4-2-settings-domain-detailed-design-v01.md).


---

## 30. AI and Untrusted Content

Templates and registries may contain untrusted project-controlled text.

<a id="dd-reg-087"></a>

**DD-REG-087 — Declarative content is data**  
Template text, descriptions, examples and variables shall be treated as data, not as instructions to the Application Engine or AI provider.

<a id="dd-reg-088"></a>

**DD-REG-088 — AI prompt boundary**

Template content supplied to AI uses [DD-2.7 context/disclosure contracts](dd-2-7-ai-capability-detailed-design-v01.md).

<a id="dd-reg-089"></a>

**DD-REG-089 — AI cannot self-register authority**

AI-produced resource additions follows [Design](../appmanager-design-specification-v01.md#_11-10-ai-assisted-workflow).


---

## 31. Sensitive Information

Registries/templates can accidentally become a distribution mechanism for secrets or personal defaults.

<a id="dd-reg-090"></a>

**DD-REG-090 — Secret-bearing defaults are restricted**  
Template resources intended for broad reuse shall not embed live credentials, access tokens or secrets as defaults.

<a id="dd-reg-091"></a>

**DD-REG-091 — Example credentials are unmistakably non-secret**  
Where examples are required, they shall use clearly synthetic placeholders and shall not resemble retained real credentials whose disclosure could cause harm.

<a id="dd-reg-092"></a>

**DD-REG-092 — Diagnostic minimization**

Sensitive registry/render diagnostics uses [DD-REG-035](#dd-reg-035).

<a id="dd-reg-093"></a>

**DD-REG-093 — Provenance metadata excludes secrets**

Reproducibility metadata containing sensitive values uses [DD-REG-035](#dd-reg-035).


---

## 32. Provider Failure and Diagnostics

Normalized diagnostic categories should include, where relevant:

- registry unavailable;
- registry malformed;
- unsupported registry schema;
- duplicate/conflicting item;
- item malformed;
- unsupported item version;
- item not found;
- ambiguous item;
- deprecated item;
- content unavailable;
- content integrity mismatch;
- incompatible template/renderer;
- missing required parameter;
- invalid parameter;
- ambiguous variant;
- rendering failure;
- output-format mismatch;
- extension not permitted;
- unsafe executable content rejected;
- external provider unavailable;
- cancellation;
- unknown provider failure.

<a id="dd-reg-094"></a>

**DD-REG-094 — Provider errors are subordinate**

Loader/renderer/parser exception detail follows [DD-1.2](../dd_1_application_core/dd-1-2-execution-outcomes-detailed-design-v01.md#_18-provider-result-normalization).

<a id="dd-reg-095"></a>

**DD-REG-095 — Diagnostic identity**  
Diagnostics shall identify registry class and item identity where known.

<a id="dd-reg-096"></a>

**DD-REG-096 — No false application failure category**

Render failures at application acceptance follows [DD-1.2](../dd_1_application_core/dd-1-2-execution-outcomes-detailed-design-v01.md#_19-application-level-interpretation).


---

## 33. Cancellation and Timeouts

Most built-in rendering should be fast, but loaders/renderers may eventually involve external or expensive providers.

<a id="dd-reg-097"></a>

**DD-REG-097 — Cancellation propagation**

Cancellable registry loading/rendering observes [DD-1.2](../dd_1_application_core/dd-1-2-execution-outcomes-detailed-design-v01.md#_17-cancellation-model) at safe boundaries.

<a id="dd-reg-098"></a>

**DD-REG-098 — Cancellation does not imply target effects**

Rendering cancellation preserves the non-persistence boundary [DD-REG-002](#dd-reg-002); separately started target effects follow [DD-1.2](../dd_1_application_core/dd-1-2-execution-outcomes-detailed-design-v01.md#_17-cancellation-model).

<a id="dd-reg-099"></a>

**DD-REG-099 — Timeout is provider evidence**  
A loader/provider timeout shall be normalized distinctly from item invalidity.

---

## 34. Caching and Snapshots

Registry discovery and rendering may use caches when safe.

<a id="dd-reg-100"></a>

**DD-REG-100 — Cache key includes material revision context**  
Cached resolution/rendering shall be keyed by sufficient registry/template revision, compatibility and parameter evidence to prevent stale content from masquerading as current output.

<a id="dd-reg-101"></a>

**DD-REG-101 — Cache does not hide source change**

Cache refresh after source revision changes uses [DD-REG-100](#dd-reg-100).

<a id="dd-reg-102"></a>

**DD-REG-102 — Cache is derived state**  
Cache entries are not registry authority and may be discarded/rebuilt.

---

## 35. DD-1.2 Execution Outcome Integration

A normalized registry/template capability result may contribute:

- technical status;
- registry class/identity;
- item/template identity/version;
- provenance/revision;
- compatibility state;
- validation state;
- bound-input state;
- rendered-output metadata;
- diagnostics/warnings;
- provider availability;
- cancellation/timeout evidence.

<a id="dd-reg-103"></a>

**DD-REG-103 — Capability evidence is not final outcome**

Application interpretation of a rendered result follows [Design](../appmanager-design-specification-v01.md#_11-11-workflow-results-failure-and-acceptance).

<a id="dd-reg-104"></a>

**DD-REG-104 — No Boolean collapse**  
Registry/template results shall preserve materially distinct states such as absent, invalid, unsupported, ambiguous, incompatible, rendered, no-op and cancelled where relevant.

<a id="dd-reg-105"></a>

**DD-REG-105 — Effects remain downstream**

Claims of downstream target mutation follows [DD-1.2](../dd_1_application_core/dd-1-2-execution-outcomes-detailed-design-v01.md#_12-consequential-effects).


---

## 36. Provider Availability and Replaceability

Provider availability may distinguish:

- registry loader available/unavailable;
- renderer available/unavailable;
- external catalogue available/unavailable;
- item supported/unsupported by installed capability set.

<a id="dd-reg-106"></a>

**DD-REG-106 — Availability is not applicability**

Renderer availability versus template applicability uses [DD-REG-021](#dd-reg-021).

<a id="dd-reg-107"></a>

**DD-REG-107 — Replaceability**  
A registry may move from JSON to another storage representation, or a renderer from TypeScript pure functions to another bounded mechanism, without changing application authority contracts provided identity, validation, rendering and evidence semantics remain conformant.

<a id="dd-reg-108"></a>

**DD-REG-108 — No speculative transport abstraction**

Registry/template topology follows the [Documentation Guide](../project-documentation-guide-v01.md#_8-level-4-implementation-specification); ADR-0001 does not require language-neutral RPC.


---

## 37. Current Implementation Reconciliation

This section is historical implementation evidence under the [Documentation Guide reading conventions](../project-documentation-guide-v01.md#detailed-design-reading-conventions), not permanent product authority.

Current implementation and historical specifications are implementation evidence only.

Useful concepts retained include:

- strongly defined template contexts/parameters;
- pure generation functions;
- text and structured outputs;
- root/layer variants;
- reusable scaffolding templates;
- a declarative `template-repository.json` containing identity, category, output filename, format, kind, content/blocks/defaults/variables and notes;
- separation of template data from output assembly in that repository;
- distinct licence and AI-template concerns;
- source-specific templates for Nuxt scaffolding.

The current `app/types/templates/templateTypes.ts` describes a code-as-templates architecture where TypeScript functions transform typed context into string/object output. That is a useful Version 1 implementation pattern but not a permanent architectural requirement.

The current `app_manager/templates/template-repository.json` is especially useful evidence because it already distinguishes static, dynamic and composite records and explicitly states that it stores template data rather than introducing a new interpolation engine.

The following are **not** promoted automatically into permanent Detailed Design:

- `TemplateFunction<TInput,TOutput>` as the universal contract;
- `BaseTemplateContext` fields as mandatory for every future template class;
- root/layer as the only variant model;
- TypeScript functions as the only renderer;
- `template-repository.json` as the one universal registry;
- its current field names as the universal schema;
- `sourceFile` references as permanent item identity;
- hardcoded author/project defaults;
- the current set of template categories;
- direct template-to-file writing;
- separate legacy duplicate template files;
- current registry wiring status.

<a id="dd-reg-109"></a>

**DD-REG-109 — Implementation evidence cannot override registry-class boundaries**

Shared aggregate scaffolding storage versus distinct registry-class schemas uses [DD-REG-005](#dd-reg-005).

<a id="dd-reg-110"></a>

**DD-REG-110 — Existing secret-like examples require implementation review**  
Implementation planning shall review existing `.env.example` template data for realistic-looking credential placeholders and align it with DD-REG-090/091. This Detailed Design does not silently rewrite existing resources.

---

## 38. Security Model

The capability shall protect against:

- path traversal through content references;
- arbitrary URI/network loading;
- executable-code smuggling through declarative registries;
- template-driven target-scope expansion;
- secret-bearing defaults;
- malicious or oversized template content;
- registry identity collision/override attacks;
- untrusted template content being treated as AI/application instructions.

<a id="dd-reg-111"></a>

**DD-REG-111 — Registry data cannot command the Engine**

Command or shell dispatch from declarative fields uses [DD-REG-049](#dd-reg-049).

<a id="dd-reg-112"></a>

**DD-REG-112 — Resource limits**  
Loaders/renderers may enforce bounded size/depth/complexity limits and shall report limit violations explicitly.

<a id="dd-reg-113"></a>

**DD-REG-113 — Trust-sensitive overrides**

Overrides from lower-trust sources uses [DD-REG-065](#dd-reg-065).


---

## 39. Concurrency and Stale Registry State

Registry-management operations may be based on a previously inspected registry snapshot.

<a id="dd-reg-114"></a>

**DD-REG-114 — Expected registry revision**  
Consequential add/delete/update operations should carry expected registry revision/state where stale overwrite would be unsafe.

<a id="dd-reg-115"></a>

**DD-REG-115 — Concurrent registry change**  
A materially changed registry shall trigger revalidation, conflict handling or failure rather than blind overwrite.

<a id="dd-reg-116"></a>

**DD-REG-116 — Render revision evidence**  
Where application correctness depends on a reviewed template, the rendered result shall identify the template revision/version used so the owning use case can detect material change before downstream application if required.

---

## 40. Testability

The design shall support deterministic tests without requiring live external providers.

Test scenarios shall include at least:

- valid/empty/malformed registries;
- unsupported schema version;
- exact item resolution;
- duplicate identities;
- alias collision where aliases exist;
- aggregate listing preserving class identity;
- static rendering;
- dynamic parameter binding;
- missing required parameter;
- invalid parameter;
- default resolution;
- root/layer or equivalent variants;
- ambiguous variant;
- composite rendering;
- structured output;
- deterministic clock-derived inputs;
- provider unavailable;
- external content unavailable;
- content reference containment;
- extension registration allowed/refused;
- override conflict;
- deprecation/compatibility;
- secret redaction;
- executable-content rejection;
- render cancellation;
- stale registry mutation;
- generated-content path remaining non-authoritative;
- existing-target generation routing into transformation/replacement policy.

Use-case acceptance tests remain above this capability.

---

## 41. Conformance Invariants

Review registry classes/identity/provenance (§§6–9), discovery and validation (§§10–12), template parameters/variants/rendering (§§13–19), mutation/extension/evolution (§§20–25), and content/security/cache/concurrency contracts. The testability section covers deterministic rendering and class-specific guarantees.

## 42. Traceability Summary

| Detailed Design concern | Primary authority |
|---|---|
| declarative template management | `FR-SET-091`–`FR-SET-100` |
| domain/resource ownership coordination | `FR-SET-101`–`FR-SET-107` |
| Settings result/failure/safety | `FR-SET-108`–`FR-SET-116` |
| licence catalogue/text fidelity | `FR-SET-081`–`FR-SET-090` |
| generation vs mutation | `FR-XFORM-044`–`FR-XFORM-047`; DD-2.5 |
| preview/dry-run separation | `FR-XFORM-026`–`FR-XFORM-029`; DD-2.5 |
| managed scope/recognition authority | DD-1.3 Managed Project |
| effective configuration | DD-1.4 Configuration Resolution |
| application authority/acceptance | DD-1.5 Application Engine |
| structured outcomes | DD-1.2 Execution Outcomes |
| resource loading/persistence | DD-2.1 Resource Access |
| source recognition where needed | DD-2.4 Source Intelligence |
| existing-source mutation | DD-2.5 Source Transformation |
| provider/runtime replaceability | ADR-0001 |

The root Design Specification additionally establishes reusable templates as generation capabilities and preserves the distinction between generated artefacts and structured mutation of existing source.

---

## 43. Contract Consumers and Implementation Dependencies {#_43-downstream-detailed-design-dependencies}

### 43.1 DD-2.7 AI Capability

[AI Capability](dd-2-7-ai-capability-detailed-design-v01.md) may consume rendered material as bounded context through its request/context contracts; proposal interpretation follows [Design §11.10](../appmanager-design-specification-v01.md#_11-10-ai-assisted-workflow).

### 43.2 DD-2.8 Quality Capability

Quality may use declarative resource descriptors for tool configuration where later design requires them, but quality findings/gates remain Quality capability/domain concerns.

### 43.3 DD-2.9 Documentation Capability

Documentation Capability may consume documentation templates and rendering services while retaining documentation-specific models, generation semantics and source-aware planning.

### 43.4 DD-2.10 Nuxt Capability

Nuxt Capability may consume scaffolding templates and Nuxt-specific resources while retaining Nuxt recognition, layer semantics and configuration planning.

### 43.5 Domain Detailed Designs

App, Nuxt, Docs, Settings and AI domain designs shall coordinate registry/template resources without duplicating the shared identity, validation, provenance, compatibility and rendering contracts defined here.

---

## 44. Implementation Planning Guidance

Implementation Specifications shall determine concrete:

- registry storage representations;
- TypeScript interfaces/types;
- schema validators;
- registry loader/resolver classes;
- renderer implementations;
- migration from hardcoded template functions/data;
- treatment of `template-repository.json`;
- licence catalogue/provider implementation;
- AI-document template storage;
- Docs/Nuxt template locations;
- caching;
- package/module layout;
- tests and migration sequencing.

Implementation work should specifically reconcile duplicate/diverged current template sources and review the existing environment-example resource for realistic credential-shaped placeholder values.

No Implementation Specification may weaken the declarative/non-executable boundary or allow templates to bypass managed scope, Resource Access or Source Transformation.

---

## 45. Final Design Position

The [architectural position](#_4-architectural-position) provides the collaboration map. The local models and workflows above, together with their direct upstream bindings, define the Version 1 contract; the conformance and testability sections provide the review route.
