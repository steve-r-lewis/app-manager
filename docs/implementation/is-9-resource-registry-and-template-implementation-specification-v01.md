# IS-9 — Resource Registry and Template Implementation Specification

> **Document type:** Level 4 Implementation Specification
>
> **Status:** Version 1 implementation baseline
>
> **Implementation ID:** IS-9
>
> **Primary Detailed Design:** [DD-2.6 — Resource Registry and Template](../dd_2_shared_capabilities/dd-2-6-resource-registry-and-template-detailed-design-v01.md)
>
> **Related Detailed Designs:** [DD-2.1 — Resource Access](../dd_2_shared_capabilities/dd-2-1-resource-access-detailed-design-v01.md), [DD-2.4 — Source Intelligence](../dd_2_shared_capabilities/dd-2-4-source-intelligence-detailed-design-v01.md), [DD-2.5 — Source Transformation](../dd_2_shared_capabilities/dd-2-5-source-transformation-detailed-design-v01.md), [DD-1.3 — Managed Project](../dd_1_application_core/dd-1-3-managed-project-detailed-design-v01.md), [DD-1.4 — Configuration Resolution](../dd_1_application_core/dd-1-4-configuration-resolution-detailed-design-v01.md), [DD-1.5 — Application Engine](../dd_1_application_core/dd-1-5-application-engine-detailed-design-v01.md)
>
> **Primary Functional authority:** [Settings Functional Specification](../functional/settings-functional-specification-v01.md), especially `FR-SET-081`–`FR-SET-107`
>
> **Related Functional authority:** [Source Transformation Functional Specification](../functional/source-transformation-functional-specification-v01.md)
>
> **Related implementations:** [IS-1 — Application Runtime and Invocation](is-1-application-runtime-and-invocation-implementation-specification-v01.md), [IS-2 — Managed Project Resolution](is-2-managed-project-resolution-implementation-specification-v01.md), [IS-3 — Configuration Resolution](is-3-configuration-resolution-implementation-specification-v01.md), [IS-4 — Resource Access](is-4-resource-access-implementation-specification-v01.md), [IS-7 — Source Intelligence](is-7-source-intelligence-implementation-specification-v01.md), [IS-8 — Source Transformation](is-8-source-transformation-implementation-specification-v01.md), [IS-23 — Build and Runtime Assembly](is-23-build-and-runtime-assembly-implementation-specification-v01.md)
>
> **Runtime decision:** [ADR-0001 — Primary Application Runtime](../project_management/decisions/adr-0001-primary-application-runtime.md)
>
> **Register:** [AppManager Implementation Specification](implementation-specification-v01.md)
>
> **Governing plan:** [Implementation Specification Plan](../project_management/implementation-specification-plan-v01.md)

## 1. Purpose

IS-9 defines the concrete Node.js/TypeScript implementation of the Version 1 Resource Registry and Template capability.

Its job is to load approved declarative registry material, preserve registry-class ownership, validate and resolve exact resource identities, bind template inputs, and render deterministic proposed content without acquiring application, managed-scope, mutation or execution authority.

The governing implementation rules are:

> **Registration establishes discoverability, not authority.**

> **Rendering produces proposed content, not a managed-project effect.**

> **Shared registry infrastructure does not collapse materially different resource classes into one universal schema.**

> **Declarative extension is data extension, not executable plugin loading.**

Version 1 deliberately adapts useful data and pure-generation mechanics from the current template implementation, but it does not preserve `TemplateFunction<TInput,TOutput>`, `BaseTemplateContext`, `template-repository.json`, current category strings, `sourceFile` references or the historical code-as-templates topology as universal architecture.

---

## 2. Scope and Non-Ownership

IS-9 owns concrete implementation for:

- registry-class descriptors and stable registry identities;
- registry source descriptors and snapshots;
- declarative registry loading from approved sources;
- registry-level schema validation;
- class-specific item validation;
- exact item and declared-alias resolution;
- deterministic conflict and override handling;
- provenance, origin, trust and revision evidence;
- compatibility and deprecation evidence;
- aggregate read-only discovery that preserves class ownership;
- template identity, variants and parameter definitions;
- parameter binding from already-resolved inputs;
- deterministic derived render inputs;
- non-mutating text and structured rendering;
- bounded built-in rendering providers;
- class-bounded declarative extension admission;
- normalized registry/render results and diagnostics;
- optional revision-bound discovery/render caching;
- cancellation propagation where meaningful;
- migration of conforming current template data and pure rendering mechanics.

IS-9 does **not** own:

- command/use-case identity or product intent;
- Managed Project identity, scope, target eligibility or target-path authority;
- application authorization or confirmation policy;
- effective-configuration precedence;
- filesystem mutation;
- source-transformation authority;
- repository mutation;
- Nuxt, Docs, AI, Settings or App domain semantics;
- legal interpretation or licence suitability;
- arbitrary network fetching;
- arbitrary executable plugin loading;
- shell/process dispatch from registry data;
- final DD-1.2/DD-1.5 application acceptance.

A valid and successfully rendered template may still be inapplicable, unauthorized or rejected by the owning use case.

---

## 3. Concrete Module Boundary

The target Version 1 layout is:

```text
app/
└── capabilities/
    └── resource_registry/
        ├── resource-registry.ts
        ├── contracts/
        │   ├── registry-identity.ts
        │   ├── registry-source.ts
        │   ├── registry-descriptor.ts
        │   ├── registry-item.ts
        │   ├── registry-results.ts
        │   ├── registry-diagnostics.ts
        │   ├── template-contracts.ts
        │   ├── template-parameters.ts
        │   ├── template-rendering.ts
        │   └── provenance.ts
        ├── registry-catalogue.ts
        ├── registry-loader.ts
        ├── registry-validator.ts
        ├── item-resolver.ts
        ├── compatibility-evaluator.ts
        ├── parameter-binder.ts
        ├── template-renderer.ts
        ├── registry-cache.ts
        ├── classes/
        │   ├── scaffolding/
        │   ├── licence/
        │   ├── ai_document/
        │   ├── documentation/
        │   └── nuxt/
        └── providers/
            ├── json-registry-loader.ts
            ├── static-renderer.ts
            ├── interpolation-renderer.ts
            ├── structured-renderer.ts
            └── function-renderer.ts
```

The exact class directories instantiated in the first implementation depend on registered Version 1 consumers. Empty speculative classes shall not be created merely to mirror the diagram.

The `contracts/` directory is capability-local deliberately. Placement follows semantic ownership rather than consumer count. A registry item consumed by several domains remains an IS-9 contract unless another approved authority genuinely owns its semantics.

### 3.1 Public capability shape

The public boundary shall be structurally equivalent to:

```ts
export interface ResourceRegistry {
  classes(request?: RegistryClassQuery): Promise<RegistryResult<readonly RegistryClassDescriptor[]>>;
  list(request: RegistryListRequest): Promise<RegistryResult<readonly RegistryItemSummary[]>>;
  resolve(request: RegistryResolveRequest): Promise<RegistryResult<ResolvedRegistryItem>>;
  render(request: TemplateRenderRequest): Promise<RegistryResult<TemplateRenderResult>>;
}
```

Persistent add/delete/update operations are intentionally not hidden inside this read/render interface. Settings-owned registry-management use cases coordinate validation with IS-9 and then perform authorized persistence through IS-4/IS-8 according to Section 24.

### 3.2 No generic execution escape hatch

IS-9 shall not expose APIs such as:

```text
loadPlugin()
executeTemplateCode()
runHook()
invokeCommandFromItem()
resolveArbitraryUri()
writeRenderedFile()
```

A renderer is an implementation mechanism selected from composition-time approved providers; registry data cannot introduce a new executable implementation.

---

## 4. Registry Class Model

Each resource belongs to an explicit registry class:

```ts
export type RegistryClassId = string & { readonly __registryClassId: unique symbol };

export interface RegistryClassDescriptor {
  readonly id: RegistryClassId;
  readonly owner: string;
  readonly schema: RegistrySchemaIdentity;
  readonly itemKinds: readonly string[];
  readonly extensionPolicy: RegistryExtensionPolicy;
  readonly compatibility: RegistryCompatibilityContract;
  readonly trustPolicy: RegistryTrustPolicy;
}
```

Version 1 production composition shall register only classes required by approved consumers. Likely classes include scaffolding resources and licence resources, with AI-document, Documentation and Nuxt-specific classes introduced where their owning IS requires materially distinct schemas.

A class descriptor is code-owned configuration assembled by IS-23. A project registry file cannot create a new registry class or redefine its validator, trust policy or renderer family.

An aggregate listing is implemented by iterating approved class implementations and returning summaries that retain `classId` and owner. There is no `generic-custom-template` class in Version 1 unless a later product decision explicitly adds one.

---

## 5. Registry and Item Identity

### 5.1 Registry identity

A registry instance has stable semantic identity independent of its current file location:

```ts
export interface RegistryIdentity {
  readonly classId: RegistryClassId;
  readonly registryId: string;
}
```

A source path is provenance attached to that identity, not the identity itself.

### 5.2 Item identity

```ts
export interface RegistryItemIdentity {
  readonly classId: RegistryClassId;
  readonly itemId: string;
  readonly version?: string;
}
```

`outputFileName`, display title, current `category`, and current `sourceFile` are not identity.

Resolution is exact. Similar names in other classes remain unrelated. Declared aliases are class-specific metadata and never fuzzy matching.

### 5.3 Canonical keys

Internal maps may use a canonical encoded key produced from class/item/version identity. The encoding is an implementation detail and must be collision-safe; concatenating unescaped strings and later reparsing them is not permitted where ambiguity can result.

Duplicate active identity within one composed registry snapshot produces conflict evidence unless the class's explicit version/override policy resolves it.

---

## 6. Registry Source and Snapshot

Approved local declarative sources are represented explicitly:

```ts
export interface RegistrySourceRef {
  readonly sourceId: string;
  readonly kind: 'built_in' | 'managed_project' | 'configured_local' | 'curated_external';
  readonly resource?: FileResourceRef;
  readonly trust: RegistryTrustClass;
  readonly expectedClass: RegistryClassId;
}

export interface RegistrySnapshot {
  readonly identity: RegistryIdentity;
  readonly source: RegistrySourceRef;
  readonly revision: string;
  readonly contentRevision?: string;
  readonly loadedAt?: string;
}
```

For local files, `FileResourceRef` and revision evidence come from IS-4. IS-9 never substitutes `process.cwd()` or performs unbounded filesystem traversal.

`loadedAt` is observational only and shall not participate in deterministic semantic identity unless an owning contract explicitly requires it.

Curated external acquisition, if implemented by a later provider, is a separate loader operation. `render()` never fetches network content.

---

## 7. Loader Boundary

An internal loader uses a narrow contract:

```ts
interface RegistryLoader {
  load(request: RegistryLoadRequest): Promise<RegistryLoadEvidence>;
}
```

The Version 1 local JSON loader:

1. receives an explicit approved `RegistrySourceRef`;
2. obtains bytes/text through injected IS-4 Resource Access;
3. enforces configured size limits;
4. parses JSON as data without executing content;
5. returns parser evidence and source revision;
6. never follows arbitrary content paths during initial parse;
7. never interprets data fields as module names, function references or commands.

JSON is the initial persisted representation because current repository evidence already uses it effectively. JSON is not a permanent architecture requirement.

Provider-native parse exceptions remain below the boundary and are normalized.

---

## 8. Registry Validation

Registry validation is side-effect free and occurs before normal item exposure.

The implementation shall validate:

- declared registry schema identity;
- schema version;
- expected registry class;
- required metadata;
- item collection shape;
- maximum item count/structural depth where configured;
- duplicate identities and aliases;
- class-specific top-level invariants;
- forbidden executable/provider fields;
- content-reference shape;
- provenance/integrity declarations where verifiable.

Version 1 shall use explicit TypeScript validation functions and may use the project's selected schema-validation library where already established by IS-3/other implementation. The semantic contract shall not depend on library-native schemas escaping the capability.

A malformed registry is not partially usable by default. A class may deliberately support safe partial loading only if its class implementation declares the rule and invalid entries remain visibly excluded/diagnosed.

States include at least:

```text
valid
empty
malformed
unsupported_schema
incompatible
conflicted
unavailable
cancelled
provider_failure
```

---

## 9. Class-Specific Item Validation

Every registry class supplies an implementation-owned item validator:

```ts
interface RegistryClassImplementation<TItem extends RegistryItem = RegistryItem> {
  readonly descriptor: RegistryClassDescriptor;
  validateItem(input: unknown, context: ItemValidationContext): ItemValidationResult<TItem>;
  selectRenderer(item: TItem): RendererSelection;
}
```

The class implementation is registered by the composition root, not by registry data.

Validation may cover identity, item kind, schema/version, content/content reference, parameter definitions, variants, output format, compatibility, deprecation and class-specific invariants.

A syntactically valid item using a future unsupported schema is `unsupported`, not `malformed`.

Validation does not decide use-case applicability or managed target scope.

---

## 10. Provenance, Origin and Trust

Normalized item provenance shall be capable of representing:

```ts
export interface RegistryProvenance {
  readonly registry: RegistryIdentity;
  readonly sourceId: string;
  readonly origin: 'built_in' | 'managed_project' | 'configured_local' | 'curated_external' | 'derived_cache';
  readonly trust: RegistryTrustClass;
  readonly registryRevision: string;
  readonly itemRevision?: string;
  readonly contentRevision?: string;
  readonly providerId?: string;
}
```

Hashes use SHA-256 when IS-9 itself needs a content fingerprint not already supplied by IS-4. A hash is integrity/reproducibility evidence, not proof of trust.

Trust classes are configured by the registry class/composition, not claimed authoritatively by the loaded file itself. A file may declare origin metadata, but IS-9 records that as a claim until corroborated by the configured source.

Sensitive parameter values never enter provenance merely to improve reproducibility.

---

## 11. Compatibility and Evolution

Compatibility evaluation is explicit and deterministic. It may consider registry schema, item schema, item semantic version/revision, renderer capability, AppManager version and owning capability version.

The implementation shall not attempt best-effort parsing of an unsupported future schema because familiar fields happen to exist.

Version 1 uses explicit compatibility predicates/ranges owned by each registry class. Where semantic-version ranges are needed, a small established semver library may be used internally; its objects do not cross the boundary.

Schema migration is not an implicit load side effect. A migration, when later supported, is an explicit operation or explicit loader policy that preserves source provenance and unknown data according to its contract.

Deprecation and replacement are metadata. Deprecated items may remain discoverable with warnings.

---

## 12. Conflict and Override Resolution

Composition may encounter duplicate IDs, versions, aliases or sources.

Resolution order shall never depend on filesystem enumeration, object insertion or provider-return order.

Each registry class declares one of the supported policies, for example:

```ts
type RegistryConflictPolicy =
  | { readonly kind: 'reject_duplicates' }
  | { readonly kind: 'versioned'; readonly selection: 'exact_only' | 'highest_compatible' }
  | { readonly kind: 'trusted_override'; readonly allowedOrigins: readonly RegistryTrustClass[] };
```

`highest_compatible` may be used only where the caller did not require an exact version and the class contract explicitly permits deterministic version selection.

Lower-trust project/configured material cannot silently replace a higher-trust built-in/curated item. Any permitted override is represented in provenance and diagnostics.

Unresolved conflicts return all bounded competing identities/origins needed for remediation.

---

## 13. Discovery and Resolution

`classes()` and `list()` are read-only.

`list()` may filter by class-defined category/tag/kind/compatibility metadata, but filtering never creates a cross-class universal taxonomy.

`resolve()` requires exact class and item identity. If version is omitted, the class's explicit version policy determines whether resolution is permitted; otherwise ambiguity is returned.

Resolution statuses include:

```text
resolved
not_found
ambiguous
invalid
unsupported
incompatible
deprecated
content_unavailable
registry_unavailable
cancelled
provider_failure
```

A deprecated item may be `resolved` with warning evidence; deprecation is not automatically failure.

Discoverability and successful resolution do not establish use-case applicability.

---

## 14. Template Contract

A renderable template item extends its class-owned item contract with normalized rendering metadata:

```ts
export interface TemplateItem extends RegistryItem {
  readonly templateKind: 'static' | 'parameterized' | 'composite' | 'structured';
  readonly output: TemplateOutputDescriptor;
  readonly parameters: readonly TemplateParameterDefinition[];
  readonly variants?: readonly TemplateVariant[];
  readonly renderer: RendererContractId;
}
```

`renderer` is an identifier from the approved class implementation. Loaded registry data may select among renderer contracts explicitly allowed by that class, but it cannot supply a module path or executable function.

A static template still carries identity, provenance, compatibility and validation evidence.

---

## 15. Parameter Definitions and Binding

Version 1 parameter types shall be deliberately bounded:

```ts
type TemplateParameterType =
  | 'string'
  | 'boolean'
  | 'integer'
  | 'string_list'
  | 'string_map'
  | 'structured';
```

Class implementations may further restrict types. Arbitrary constructors/classes/functions are not parameter values.

A parameter definition records name, description, type, required state, declared default, allowed values/constraints, sensitivity and output-identity relevance where material.

Binding input distinguishes source:

```ts
export interface TemplateParameterInput {
  readonly explicit?: Readonly<Record<string, unknown>>;
  readonly resolvedContext?: Readonly<Record<string, unknown>>;
  readonly derived?: Readonly<Record<string, unknown>>;
}
```

The binder does not invent precedence. The owning use case supplies already-resolved context from IS-2/IS-3/Settings/domain semantics. IS-9 applies only the template contract's declared binding rule: explicit supplied value where allowed, approved resolved value, then declared default as specified by that parameter.

Missing required values and invalid values prevent rendering. Unknown parameters are rejected unless the class explicitly declares ignore semantics.

Sensitive values are redacted in summaries/diagnostics.

---

## 16. Derived Inputs and Determinism

Clock values, generated identifiers and other derived inputs that materially affect output are supplied explicitly:

```ts
export interface TemplateDerivedInputs {
  readonly currentDate?: string;
  readonly currentYear?: string;
  readonly generatedIds?: Readonly<Record<string, string>>;
}
```

The owning application/use case or an injected deterministic derivation service creates these values before render. A renderer shall not call `new Date()`, `Date.now()`, `crypto.randomUUID()`, inspect `process.env`, or use `process.cwd()` when those values materially alter output.

This corrects the current file-header data note that date/time is computed from the system clock at generation time: Version 1 preserves date-derived headers but makes the clock value an explicit render input/evidence.

---

## 17. Variants

Variants have stable identity within a template and may refine compatibility, parameters or renderer input.

```ts
export interface TemplateVariant {
  readonly id: string;
  readonly compatibility?: CompatibilityConstraint;
  readonly parameterOverrides?: readonly TemplateParameterDefinition[];
}
```

Variant selection is either explicit or derived from a semantic value supplied by the owning use case. `root`/`layer` remains useful for Nuxt templates but is not universal.

If multiple variants remain applicable and selection matters, rendering returns `ambiguous_variant`; array order does not choose.

A `layer` variant does not identify or authorize a managed layer target.

---

## 18. Rendering Providers

Version 1 may use several bounded renderer mechanisms.

### 18.1 Static renderer

Returns validated embedded text/structured content unchanged apart from explicitly defined serialization behavior.

### 18.2 Declarative interpolation renderer

May substitute declared scalar/list parameters into a bounded template grammar. If introduced, the grammar is owned by AppManager and supports value interpolation only; it shall not expose arbitrary JavaScript evaluation, imports, filesystem access, shell execution or helper loading.

### 18.3 Structured renderer

Constructs JSON-like AppManager-owned values from validated declarative blocks/parameters and returns structure without premature serialization where downstream generation benefits.

### 18.4 Function renderer

Existing pure TypeScript template functions may be retained as compiled-in providers during migration where they remain the safest implementation of current generation semantics.

Function renderers are registered in code by IS-23 under stable `RendererContractId`s. Registry data cannot point at `sourceFile`, import a module, name an arbitrary exported function or load project code.

The function renderer is therefore a migration/implementation mechanism, not executable declarative extension.

---

## 19. Render Request and Result

A render request is structurally equivalent to:

```ts
export interface TemplateRenderRequest {
  readonly template: RegistryItemIdentity;
  readonly variant?: string;
  readonly parameters: TemplateParameterInput;
  readonly derived?: TemplateDerivedInputs;
  readonly expectedOutput?: TemplateOutputExpectation;
  readonly signal?: AbortSignal;
  readonly correlationId?: string;
}
```

The capability resolves and validates the template against the current registry snapshot before rendering.

A successful result includes:

```ts
export interface TemplateRenderResult {
  readonly status: 'rendered';
  readonly template: RegistryItemIdentity;
  readonly variant?: string;
  readonly provenance: RegistryProvenance;
  readonly boundParameters: readonly BoundParameterSummary[];
  readonly output: RenderedTemplateOutput;
  readonly suggestedTarget?: SuggestedTargetMetadata;
  readonly deterministicInputs: TemplateDerivedInputs;
  readonly rendererEvidence: RendererEvidence;
  readonly diagnostics: readonly RegistryDiagnostic[];
}
```

`RenderedTemplateOutput` is discriminated text or structured content. Binary template output is not required for Version 1 unless a registered consumer demonstrates a need.

Suggested target metadata is never a `FileResourceRef` authorized for mutation.

---

## 20. Rendering Is Non-Mutating

No IS-9 renderer receives Resource Access mutation methods, Source Transformation execution methods, repository mutation methods or an application command dispatcher.

The normal flow is:

```text
resolve template
 -> bind inputs
 -> render proposed content
 -> return evidence to owning use case
 -> owning use case resolves actual target/scope/authorization
 -> absent target: IS-4 create
 -> existing bounded modification: IS-8 transformation
 -> explicit whole-resource replacement: owning policy + IS-4 replace
 -> application acceptance: IS-1 / owning use case
```

Successful rendering does not claim that a file exists, changed or is authorized to change.

---

## 21. Preview and Dry Run

Because rendering is pure/non-mutating, the rendered result is also the canonical content basis for preview.

A later generation use case shall not maintain a separate preview renderer. Preview and execution consume the same template identity, revision, variant, bound parameters, derived inputs and renderer contract.

If the template changes after preview, provenance/revision evidence lets the owning use case detect that the reviewed output is stale and decide whether to rerender/re-authorize.

Preview success does not establish target existence, writability, managed scope or authorization.

---

## 22. Content References

Registry items may embed content or use a bounded content reference.

Local content references are resolved relative to an explicitly configured registry content root and converted to IS-4 references with containment checks. Absolute arbitrary paths, `../` escape, implicit cwd-relative references and symlink escapes are rejected according to IS-4 policy.

URI content references are not fetched by the normal JSON loader. A future curated external provider must own an allowlisted/provider-specific acquisition contract and return content/provenance evidence before normal validation/rendering.

Missing referenced content yields `content_unavailable`; it is not treated as an empty template.

---

## 23. Structured Output and Serialization

Structured output is represented as JSON-compatible AppManager-owned data.

IS-9 may validate expected output kind/schema, but serialization for a concrete target is part of the downstream generation path when target-specific newline, indentation, ordering or encoding semantics matter.

A structured template intended to modify existing JSON/JSONC does not serialize and replace the whole file by convenience. The owning use case passes the intended structural change through IS-8.

Provider-native objects/classes are normalized before return.

---

## 24. Registry Management and Settings

Settings owns product intent for listing/adding/deleting supported declarative template resources under `FR-SET-091`–`100`.

The implementation split is:

```text
Settings use case
 -> resolve registry class/source/scope/authorization
 -> IS-9 validate candidate or resolve exact existing item
 -> construct bounded registry persistence change
 -> IS-8 for structured existing-registry mutation
    OR IS-4 create/delete where the registry representation permits a direct bounded resource effect
 -> IS-9 reload/revalidate resulting registry snapshot
 -> Settings/IS-1 determine final application outcome
```

IS-9 itself does not prompt, authorize or persist the change.

Add requires class validation before the item becomes usable. Delete requires exact class/item/source identity and does not use fuzzy name matching.

Registry changes based on a prior snapshot carry IS-4/IS-8 revision preconditions so concurrent edits are not blindly overwritten.

---

## 25. Licence Registry

Licence resources are implemented as a distinct registry class rather than ordinary scaffolding templates.

The licence class preserves:

- exact supported licence identity;
- curated/authoritative text provenance;
- content revision/integrity evidence;
- parameter definitions such as copyright holder/year only where the specific licence text contract permits them;
- compatibility/provider availability;
- no legal-suitability result.

The current skeletal `app/license_engine/licenseEngine.ts` is not promoted into an authority layer. Its eventual useful provider mechanics, if any, belong beneath the Settings licence use case and IS-9 licence class.

Creating/deleting `LICENSE` and synchronizing project metadata remain Settings-owned effects and may yield partial application outcomes.

---

## 26. Scaffolding Registry and Current `template-repository.json`

The current `app_manager/templates/template-repository.json` is retained as migration evidence and may become the initial built-in scaffolding data source after schema normalization.

Useful retained concepts include:

- stable-looking item IDs;
- titles/categories as discovery metadata;
- output filename metadata;
- explicit text/structured format;
- static/dynamic/composite distinction;
- content and declarative blocks;
- defaults and variable descriptions;
- root/layer variants;
- notes useful during migration.

It is **not** consumed unchanged as the permanent IS-9 schema. Before production wiring it shall be normalized to add explicit registry class/schema/version/provenance/compatibility contracts and to remove architecture dependence on historical `sourceFile`/`contextType` implementation references.

The file currently states that no consumer is wired up. IS-9 therefore does not invent compatibility obligations around an existing runtime consumer.

Historical archive/specification citations in `notes` are provenance-only implementation cleanup material and are not normative authority. Migration shall either replace them with verified current provenance or retain them only as clearly historical notes where useful.

---

## 27. Credential-Shaped `.env.example` Data

DD-2.6 explicitly requires implementation review of current secret-like examples. The existing `env-example` record contains realistic credential-shaped placeholder strings for several providers and a GitHub token.

The Version 1 migration shall replace those values with unmistakably synthetic non-secret placeholders, for example semantic placeholders such as:

```text
API_KEY_DEEPSEEK=<your-deepseek-api-key>
API_KEY_GEMINI=<your-gemini-api-key>
GITHUB_TOKEN=<your-github-token>
```

The exact final example syntax must remain compatible with the intended `.env.example` consumer, but it shall not mimic retained real token lengths/prefix structures unnecessarily.

This IS records the required disposition; authoring IS-9 does not mutate the current template data file.

Personal author/email/repository defaults currently embedded in reusable scaffolding data shall also be reviewed. Values that are genuinely project-specific examples may remain only when the owning template class explicitly intends them; otherwise they become resolved parameters or neutral placeholders rather than universal defaults.

---

## 28. Declarative Extension Registration

An extension source may contribute items only to a class whose descriptor permits extension.

Extension admission validates:

- allowed class;
- source/trust classification;
- supported schema/version;
- content-reference restrictions;
- conflict/override policy;
- item validation;
- compatibility;
- size/complexity limits.

Extension data cannot introduce:

- JavaScript/TypeScript module paths;
- function names to dynamically import;
- shell/process commands;
- lifecycle hooks;
- application command IDs to dispatch;
- unrestricted network URLs;
- arbitrary renderer code.

If a new renderer implementation is needed, it is a code change composed through IS-23 and reviewed as application code.

---

## 29. AI and Untrusted Template Content

IS-9 treats descriptions, examples, template text and rendered text as data.

No content string is interpreted as an instruction to the Application Engine. If AI consumes registry/rendered content, IS-10 owns trust labeling, context minimization, prompt construction and sensitive-data controls.

AI-generated resource/template proposals follow the same Settings/domain authorization, IS-9 validation and IS-4/IS-8 persistence path as other proposals. AI cannot self-register an item or renderer.

---

## 30. Diagnostics and Result Model

Expected registry/template states are returned as normalized evidence rather than provider exceptions.

```ts
export type RegistryResult<T> =
  | { readonly ok: true; readonly value: T; readonly evidence: RegistryEvidence }
  | { readonly ok: false; readonly failure: RegistryFailure; readonly evidence: RegistryEvidence };
```

Stable failure/diagnostic codes shall include at least:

```text
REGISTRY_UNAVAILABLE
REGISTRY_MALFORMED
REGISTRY_SCHEMA_UNSUPPORTED
REGISTRY_CLASS_MISMATCH
REGISTRY_CONFLICT
ITEM_MALFORMED
ITEM_UNSUPPORTED
ITEM_NOT_FOUND
ITEM_AMBIGUOUS
ITEM_INCOMPATIBLE
ITEM_DEPRECATED
CONTENT_UNAVAILABLE
CONTENT_INTEGRITY_MISMATCH
PARAMETER_MISSING
PARAMETER_INVALID
PARAMETER_UNKNOWN
VARIANT_AMBIGUOUS
RENDERER_UNAVAILABLE
RENDER_FAILED
OUTPUT_FORMAT_MISMATCH
EXTENSION_NOT_PERMITTED
EXECUTABLE_CONTENT_REJECTED
RESOURCE_LIMIT_EXCEEDED
CANCELLED
PROVIDER_TIMEOUT
PROVIDER_FAILURE
```

Deprecation normally appears as warning evidence rather than `ok: false` unless the class policy prohibits use.

Diagnostics identify class/registry/item where known and redact sensitive values. Raw parser stacks, renderer objects and native exceptions do not cross the public boundary.

No IS-9 result uses `success` to mean final AppManager success.

---

## 31. Cancellation and Timeouts

Public async requests accept `AbortSignal` where loading/rendering may be non-trivial.

Built-in synchronous/pure renderers check cancellation before starting and before returning expensive composite work where practical; they are not required to pretend JavaScript can interrupt an already-running atomic synchronous expression safely.

External loaders, if later introduced, propagate cancellation to their provider mechanisms.

Provider timeout is normalized separately from malformed/unsupported content.

Because IS-9 rendering is non-mutating, cancellation never reports target rollback. Downstream effects already begun by an owning use case remain governed by their own capability evidence.

---

## 32. Caching and Snapshot Semantics

Version 1 may use an in-memory cache for parsed/validated registry snapshots and rendered results.

Registry cache keys include at least:

```text
registry identity
+ source revision/content revision
+ registry class/schema compatibility version
```

Render cache keys additionally include:

```text
exact template identity/version
+ item/content revision
+ variant
+ canonical bound-parameter fingerprint
+ deterministic derived-input fingerprint
+ renderer contract/version
```

Sensitive raw parameter values shall not be used as observable cache-key text. Where a fingerprint is required, use a canonical bounded representation and SHA-256; avoid retaining secret-bearing canonical strings beyond computation.

Cache entries are derived state, process-local by default, disposable, and never override a changed source revision.

No persistent registry cache is required for Version 1.

---

## 33. Concurrency and Stale State

Read-only discovery/rendering may proceed concurrently for independent snapshots.

IS-9 introduces no global registry lock. A cache implementation may coalesce identical in-flight loads/renders as an optimization but must not alter result semantics.

Consequential registry persistence is outside IS-9 and uses IS-4/IS-8 stale-state preconditions. After persistence, Settings shall re-load/revalidate when final acceptance depends on the resulting registry state.

A reviewed render carries template/source revision evidence. If an owning use case requires reviewed output to remain identical before application, it compares/revalidates that evidence before the downstream effect.

---

## 34. Security and Resource Bounds

The production implementation shall fail closed against:

- path traversal/content-root escape;
- symlink escape through local content references;
- arbitrary URI fetch;
- dynamic module/function loading from data;
- shell/process invocation from data;
- command dispatch from data;
- lower-trust silent overrides;
- oversized registry/template content;
- excessive structural depth/item counts;
- uncontrolled interpolation recursion;
- secret-bearing reusable defaults;
- sensitive diagnostic echo;
- template-suggested target scope expansion.

Limits come from IS-3 resolved effective configuration or class-owned constants where they are implementation safety bounds, not direct environment/settings reads.

Renderers shall not evaluate JavaScript expressions embedded in template text. If declarative interpolation is implemented, substitutions are escaped/serialized according to the renderer/output contract rather than passed to `eval`, `Function`, dynamic import or a shell.

---

## 35. Configuration and Composition

IS-9 consumes already-resolved effective configuration for matters such as:

- enabled registry sources;
- approved configured-local content roots;
- size/item/depth limits;
- allowed class-specific extensions;
- curated external provider configuration;
- cache limits;
- renderer/class options explicitly delegated by IS-3 policy.

IS-9 never reads `.env`, arbitrary settings files or `process.env` to establish private precedence.

IS-23 constructs:

1. IS-4 Resource Access;
2. class implementations and validators;
3. approved loader/renderer providers;
4. built-in/configured registry source descriptors;
5. registry catalogue/resolver/cache;
6. the `ResourceRegistry` facade;
7. consumers in Settings/App/Nuxt/Docs/AI domains.

There is no import-time singleton registry or self-registration side effect.

---

## 36. Observability

Registry/template observability may record:

- class/registry/item identity;
- source/provider identity;
- validation/resolution/render status;
- duration;
- cache hit/miss;
- output kind/size;
- bounded diagnostics;
- cancellation/timeout.

It shall not log full sensitive parameters, entire secret-bearing templates, rendered secrets, or unbounded external/provider payloads.

Observability does not become application outcome semantics.

---

## 37. Testing Requirements

IS-9 shall provide deterministic unit, provider-conformance and integration tests covering at least:

1. valid, empty and malformed registry loading;
2. expected-class mismatch;
3. unsupported future registry schema;
4. class-specific item validation;
5. exact item resolution;
6. missing item;
7. duplicate identity conflict;
8. alias collision where supported;
9. deterministic version selection where explicitly supported;
10. lower-trust override rejection;
11. aggregate listing preserving class/owner identity;
12. no false cross-class interchangeability;
13. static text rendering;
14. parameterized rendering;
15. missing required parameter;
16. invalid/unknown parameter;
17. declared defaults;
18. sensitive parameter redaction;
19. explicit derived clock input;
20. repeated identical render determinism;
21. root/layer or equivalent explicit variants;
22. ambiguous variant;
23. composite rendering;
24. structured output;
25. output-format mismatch;
26. content-reference containment and traversal rejection;
27. missing referenced content;
28. executable module/function/hook field rejection;
29. arbitrary URI/network-fetch rejection;
30. extension registration allowed/refused by class;
31. deprecated item warning;
32. renderer unavailable/failure normalization;
33. cancellation;
34. resource-size/depth/count limits;
35. cache invalidation on source revision change;
36. cache separation by parameter/derived-input fingerprint;
37. rendered result carries provenance/revision;
38. successful render reports no target effect;
39. suggested filename/path remains metadata only;
40. Settings add/delete integration uses exact class/item identity;
41. stale registry persistence is rejected by IS-4/IS-8 integration;
42. existing-target generation routes to IS-8/replacement policy rather than blind overwrite;
43. licence resolution preserves curated provenance;
44. licence registry returns no legal-suitability judgement;
45. `.env.example` migrated fixture contains unmistakably synthetic placeholders;
46. project-specific defaults are not silently universalized;
47. no renderer reads ambient cwd/environment/clock for material output;
48. no registry data can dispatch application commands or processes.

Live external-provider tests are not required for deterministic core conformance.

---

## 38. Current Implementation Disposition

Implementation migration applies dispositions to responsibilities, not whole files.

| Current artefact/responsibility | Disposition | Version 1 treatment |
|---|---|---|
| `app_manager/templates/template-repository.json` declarative data | **RETAIN / ADAPT** | Use as migration source for initial scaffolding registry after schema/provenance/security normalization. |
| `template-repository.json` claim of one canonical scaffolding data repository | **RETAIN / NARROW** | Valid for its scaffolding class; not the universal registry for licence/AI/Docs/Nuxt classes. |
| `id` fields | **RETAIN / ADAPT** | Preserve stable identities where semantics are sound; bind them explicitly to a registry class/version. |
| `title`, `category`, `format`, `kind`, `variables`, `variants`, `blocks` | **RETAIN / ADAPT** | Preserve useful class metadata after validation/schema normalization. |
| `outputFileName` | **RETAIN / RELOCATE SEMANTICS** | Suggested-target metadata only; never target authority. |
| `sourceFile` | **REPLACE as runtime contract** | May remain historical migration provenance temporarily; cannot dynamically select renderer code. |
| `contextType` | **REPLACE as runtime contract** | Convert to explicit parameter schemas; TypeScript type names are not persisted semantic contracts. |
| historical specification citations in `notes` | **ADAPT** | Treat as provenance-only cleanup; replace with verified current provenance or clearly historical annotation. |
| realistic credential-shaped `env-example` values | **REPLACE** | Use unmistakably synthetic placeholders before production registry consumption. |
| personal author/email/repository defaults | **SPLIT / ADAPT** | Keep only where a class deliberately defines project-specific example data; otherwise parameterize/neutralize. |
| `app/types/templates/templateTypes.ts` domain-specific context interfaces | **SPLIT / RELOCATE** | Move useful parameter contracts to owning registry/domain implementations. |
| `BaseTemplateContext` as universal base | **REPLACE** | No universal author/year/projectName requirement. |
| `TargetedTemplateContext` root/layer concept | **RETAIN / NARROW** | Nuxt/scaffolding variant input, not universal template semantics. |
| `TemplateFunction<TInput,TOutput>` pure-function concept | **RETAIN / ADAPT** | Compiled-in function renderer provider where useful; not public universal template contract. |
| current pure generation functions referenced by repository data | **RETAIN / ADAPT** | Migrate conforming logic behind stable renderer contracts; eliminate data-driven module/function lookup. |
| duplicate/diverged legacy template functions noted in repository data | **REPLACE / REMOVE during migration** | Select one verified semantic implementation or declarative record; do not keep competing canonical sources. |
| current system-clock calls in generation functions | **REPLACE** | Derived date/year/time supplied explicitly for deterministic rendering. |
| current hardcoded defaults inside functions/data | **ADAPT** | Reconcile against class parameter/default policy and IS-3/owning-domain resolved inputs. |
| `app/license_engine/licenseEngine.ts` placeholder shell | **REPLACE / RELOCATE** | Do not create a separate application authority; implement licence provider/class mechanics beneath Settings + IS-9. |
| current template tests | **RETAIN / SPLIT / ADAPT** | Preserve useful expected-output fixtures; add registry identity, validation, provenance, deterministic-input and non-authority tests. |
| any direct template-to-file writing | **RELOCATE / REPLACE** | Rendering stops at proposed output; authorized effects use IS-4/IS-8. |
| any global template registry/singleton introduced during migration | **REJECT** | Composition root owns explicit construction. |

No production implementation artefact is changed merely by approving this specification.

---

## 39. Migration Sequence

Implementation should proceed in this order:

1. create capability-local IS-9 contracts and normalized diagnostics;
2. define registry-class descriptors and explicit composition-time catalogue;
3. implement IS-4-backed JSON registry loader with size/containment controls;
4. implement registry and class-specific item validation;
5. implement exact resolver, compatibility and conflict policies;
6. implement provenance/trust/revision evidence;
7. implement parameter binder and explicit derived-input model;
8. implement static and structured renderers;
9. adapt required existing pure TypeScript generation functions behind compiled-in renderer contracts;
10. normalize the current scaffolding repository schema without treating it as universal;
11. replace credential-shaped `.env.example` examples and reconcile personal/hardcoded defaults;
12. migrate duplicate/diverged scaffolding sources to one verified source of truth per item;
13. implement licence registry/provider mechanics required by Settings;
14. add class-bounded extension admission where a registered Version 1 use case requires it;
15. add optional revision-bound caches only after correctness tests pass without caching;
16. integrate Settings registry-management persistence through IS-4/IS-8;
17. integrate App/Nuxt/Docs/AI consumers as their implementation specifications require;
18. retire obsolete global template types and historical code/data lookup assumptions;
19. run cross-capability conformance tests proving render/non-mutation and generation/transformation boundaries.

Migration may temporarily support both old pure-function call sites and IS-9 rendering behind a compatibility adapter, but new domain code shall target IS-9. The adapter shall not preserve direct file-writing, ambient-clock, global-singleton or data-driven executable lookup behavior.

---

## 40. Traceability

| Implementation concern | Governing authority |
|---|---|
| class-preserving registry identity/discovery | DD-REG-004–013; FR-SET-093–099 |
| provenance/trust | DD-REG-014–017 |
| discovery/resolution | DD-REG-018–021 |
| registry/item validation | DD-REG-022–027; FR-SET-096–097 |
| template kinds/parameters | DD-REG-028–038 |
| variants | DD-REG-039–042 |
| rendering/result metadata | DD-REG-043–045 |
| deterministic rendering | DD-REG-046–048 |
| renderer/provider isolation | DD-REG-049–051; ADR-0001 |
| generation versus mutation | DD-REG-052–054; FR-XFORM-044–047; IS-8 |
| preview | DD-REG-055–057 |
| Settings registry management | DD-REG-058–062; FR-SET-091–107 |
| declarative extension | DD-REG-063–066; FR-SET-092/099/100 |
| compatibility/evolution | DD-REG-067–071 |
| conflict/override | DD-REG-072–074 |
| content references | DD-REG-075–078; IS-4 |
| structured output | DD-REG-079–081; IS-8 |
| domain ownership | DD-REG-082; FR-SET-101–107 |
| licence resources | DD-REG-083–086; FR-SET-081–090 |
| AI/untrusted content | DD-REG-087–089 |
| sensitive information | DD-REG-090–093 |
| diagnostics | DD-REG-094–096 |
| cancellation/timeouts | DD-REG-097–099; IS-1 |
| caching | DD-REG-100–102 |
| application outcome separation | DD-REG-103–105; IS-1 |
| availability/replaceability | DD-REG-106–108; ADR-0001 |
| current implementation reconciliation | DD-REG-109–110 |
| security/resource limits | DD-REG-111–113 |
| stale/concurrent registry state | DD-REG-114–116; IS-4/IS-8 |

---

## 41. Version 1 Non-Drift Baseline

The concrete Version 1 flow is:

```text
approved registry source
        |
        v
IS-4 bounded acquisition
        |
        v
IS-9 loader
        |
        v
registry schema + class validation
        |
        v
class-preserving item catalogue
        |
        v
exact identity + compatibility + provenance resolution
        |
        v
parameter binding + explicit derived inputs
        |
        v
approved bounded renderer
        |
        v
rendered text/structured proposed content + revision evidence
        |
        v
owning App / Nuxt / Docs / AI / Settings use case
        |
        +--> new target -> authorized IS-4 create
        |
        +--> existing bounded edit -> IS-8 transformation
        |
        +--> explicit whole-resource replacement -> owning policy + IS-4 replace
        |
        v
IS-1 / owning use case final application acceptance
```

The non-drift rule is:

> **Version 1 Resource Registry and Template is a declarative, class-preserving discovery/validation/rendering capability. Registry data cannot execute application code, choose managed scope, authorize targets, persist rendered output or declare final AppManager success.**

This preserves useful current scaffolding data and pure rendering mechanics while giving them explicit identity, provenance, compatibility, determinism and security contracts, and without turning AppManager's template system into a generic plugin runtime.