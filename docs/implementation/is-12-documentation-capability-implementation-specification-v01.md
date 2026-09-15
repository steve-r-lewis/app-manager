# IS-12 — Documentation Capability Implementation Specification

> **Document type:** Level 4 Implementation Specification
>
> **Status:** Version 1 implementation baseline
>
> **Implementation ID:** IS-12
>
> **Primary Detailed Design:** [DD-2.9 — Documentation Capability](../dd_2_shared_capabilities/dd-2-9-documentation-capability-detailed-design-v01.md)
>
> **Related Detailed Designs:** [DD-1.1 — Application Invocation](../dd_1_application_core/dd-1-1-application-invocation-detailed-design-v01.md), [DD-1.2 — Execution Outcomes](../dd_1_application_core/dd-1-2-execution-outcomes-detailed-design-v01.md), [DD-1.3 — Managed Project](../dd_1_application_core/dd-1-3-managed-project-detailed-design-v01.md), [DD-1.4 — Configuration Resolution](../dd_1_application_core/dd-1-4-configuration-resolution-detailed-design-v01.md), [DD-1.5 — Application Engine](../dd_1_application_core/dd-1-5-application-engine-detailed-design-v01.md), [DD-2.1 — Resource Access](../dd_2_shared_capabilities/dd-2-1-resource-access-detailed-design-v01.md), [DD-2.2 — Process Execution](../dd_2_shared_capabilities/dd-2-2-process-execution-detailed-design-v01.md), [DD-2.4 — Source Intelligence](../dd_2_shared_capabilities/dd-2-4-source-intelligence-detailed-design-v01.md), [DD-2.5 — Source Transformation](../dd_2_shared_capabilities/dd-2-5-source-transformation-detailed-design-v01.md), [DD-2.6 — Resource Registry and Template](../dd_2_shared_capabilities/dd-2-6-resource-registry-and-template-detailed-design-v01.md), [DD-2.7 — AI Capability](../dd_2_shared_capabilities/dd-2-7-ai-capability-detailed-design-v01.md), [DD-2.8 — Quality Capability](../dd_2_shared_capabilities/dd-2-8-quality-capability-detailed-design-v01.md), [DD-2.10 — Nuxt Capability](../dd_2_shared_capabilities/dd-2-10-nuxt-capability-detailed-design-v01.md), [DD-3.4 — Docs Domain](../dd_3_high_coupling_domains/dd-3-4-docs-domain-detailed-design-v01.md)
>
> **Primary Functional authority:** [Docs Functional Specification](../functional/docs-functional-specification-v01.md)
>
> **Related implementations:** [IS-1 — Application Runtime and Invocation](is-1-application-runtime-and-invocation-implementation-specification-v01.md), [IS-2 — Managed Project Resolution](is-2-managed-project-resolution-implementation-specification-v01.md), [IS-3 — Configuration Resolution](is-3-configuration-resolution-implementation-specification-v01.md), [IS-4 — Resource Access](is-4-resource-access-implementation-specification-v01.md), [IS-5 — Process Execution](is-5-process-execution-implementation-specification-v01.md), [IS-7 — Source Intelligence](is-7-source-intelligence-implementation-specification-v01.md), [IS-8 — Source Transformation](is-8-source-transformation-implementation-specification-v01.md), [IS-9 — Resource Registry and Template](is-9-resource-registry-and-template-implementation-specification-v01.md), [IS-10 — AI Capability](is-10-ai-capability-implementation-specification-v01.md), [IS-11 — Quality Capability](is-11-quality-capability-implementation-specification-v01.md), [IS-23 — Build and Runtime Assembly](is-23-build-and-runtime-assembly-implementation-specification-v01.md)
>
> **Runtime decision:** [ADR-0001 — Primary Application Runtime](../project_management/decisions/adr-0001-primary-application-runtime.md)
>
> **Register:** [AppManager Implementation Specification](implementation-specification-v01.md)
>
> **Governing plan:** [Implementation Specification Plan](../project_management/implementation-specification-plan-v01.md)

## 1. Purpose

IS-12 defines the concrete Node.js/TypeScript implementation of AppManager's shared Documentation Capability.

It converts explicitly selected, provenance-bearing project/source/domain evidence into provider-independent documentation models, aggregates those models under an approved documentation profile, renders deterministic proposed documentation, optionally incorporates bounded AI enrichment, delegates configured documentation tooling, and returns documentation-oriented validation and completeness evidence.

The governing implementation rules are:

> **Documentation Capability describes and renders approved information; it does not discover application intent, establish managed scope, persist output or grant mutation authority.**

> **Documentation facts, existing authored text, generated deterministic prose and AI-generated prose retain materially different provenance.**

> **Rendering produces a proposal. Creation, replacement and update are downstream effects owned by the authorized use case through IS-4/IS-8.**

> **Documentation-tool process completion is technical evidence, not documentation acceptance.**

> **Current `CodeService`, regex strategies, VitePress configuration and direct LLM/file writes are implementation evidence, not the Documentation Capability architecture.**

---

## 2. Scope and Non-Ownership

IS-12 owns concrete implementation for:

- documentable-input normalization;
- provenance/sensitivity/revision-bearing documentation facts;
- documentation profiles as capability inputs;
- provider-independent documentation sections/blocks/models;
- bounded model construction from supplied Source Intelligence/domain facts;
- existing-document contextual evidence;
- duplicate normalization and multi-input aggregation;
- omission, unsupported and completeness evidence;
- deterministic documentation rendering;
- Markdown as the initial general text documentation renderer;
- consumption of IS-9 declarative templates;
- proposed documentation artefacts and proposed update content;
- optional IS-10 enrichment integration;
- documentation-tool recognition/resolution/execution;
- VitePress as the initial configured documentation-tool adapter where applicable;
- documentation-oriented validation;
- generated documentation-tool artefact evidence;
- cancellation, timeout, progress and partial results;
- provider-independent fake-provider tests.

IS-12 does **not** own:

- Docs-domain application use-case identity, target/profile policy, output destination policy, collision/replacement policy or domain acceptance — IS-17;
- managed-project identity/scope/targetability — IS-2;
- configuration precedence — IS-3;
- generic filesystem persistence — IS-4;
- generic process execution — IS-5;
- generic source recognition — IS-7;
- existing-resource/source mutation — IS-8;
- declarative registry/template semantics — IS-9;
- AI provider/model execution or disclosure policy — IS-10;
- independent Quality checks/gates — IS-11;
- Nuxt semantic recognition — IS-13;
- interaction/prompt presentation — IS-22;
- final application outcome/acceptance — IS-1;
- governance of AppManager's own specification set, which remains controlled by the Project Documentation Guide.

---

## 3. Concrete Module Boundary

```text
app/
└── capabilities/
    └── documentation/
        ├── documentation-capability.ts
        ├── contracts/
        │   ├── documentation-input.ts
        │   ├── documentation-profile.ts
        │   ├── documentation-fact.ts
        │   ├── documentation-model.ts
        │   ├── documentation-render.ts
        │   ├── documentation-proposal.ts
        │   ├── documentation-coverage.ts
        │   ├── documentation-validation.ts
        │   ├── documentation-tool.ts
        │   └── documentation-failure.ts
        ├── modeling/
        │   ├── documentation-model-builder.ts
        │   ├── source-fact-mapper.ts
        │   ├── domain-fact-mapper.ts
        │   └── existing-document-mapper.ts
        ├── aggregation/
        │   └── documentation-aggregator.ts
        ├── rendering/
        │   ├── documentation-renderer.ts
        │   └── markdown-renderer.ts
        ├── enrichment/
        │   └── documentation-enricher.ts
        ├── validation/
        │   └── documentation-validator.ts
        ├── tooling/
        │   ├── documentation-tool-provider.ts
        │   ├── documentation-tool-catalogue.ts
        │   ├── documentation-tool-resolver.ts
        │   └── vitepress/
        │       ├── vitepress-provider.ts
        │       └── vitepress-result-normalizer.ts
        └── diagnostics/
            └── documentation-diagnostics.ts
```

Placement follows semantic ownership, not consumer count. Documentation contracts remain owned by IS-12 even when Docs, Nuxt or another domain consumes them.

No universal parser/renderer/tool plugin framework or common executable base class is introduced.

---

## 4. Public Capability Contract

```ts
export interface DocumentationCapability {
  buildModel(request: DocumentationModelRequest): Promise<DocumentationModelResult>;
  aggregate(request: DocumentationAggregationRequest): DocumentationAggregationResult;
  render(request: DocumentationRenderRequest): Promise<DocumentationRenderResult>;
  enrich(request: DocumentationEnrichmentRequest): Promise<DocumentationEnrichmentResult>;
  validate(request: DocumentationValidationRequest): Promise<DocumentationValidationResult>;
  recognizeTool(request: DocumentationToolRecognitionRequest): Promise<DocumentationToolRecognitionResult>;
  executeTool(request: DocumentationToolExecutionRequest): Promise<DocumentationToolResult>;
}
```

`buildModel()` and `aggregate()` are non-mutating.

`render()` returns proposed content only.

`enrich()` returns provenance-bearing proposed enrichment only.

`validate()` performs documentation-oriented validation only.

Tool recognition never launches tooling. Tool execution is explicit and bounded.

---

## 5. Documentable Input

```ts
export interface DocumentationInput {
  readonly id: DocumentationInputId;
  readonly subject: DocumentationSubject;
  readonly target: ProjectEntityId | ResourceReference;
  readonly source: DocumentationInputSource;
  readonly evidence: readonly DocumentationEvidence[];
  readonly revision?: DocumentationRevisionEvidence;
  readonly support: DocumentationSupportState;
  readonly trust: DocumentationTrustClass;
  readonly sensitivity: DocumentationSensitivityClass;
  readonly selection: DocumentationSelectionEvidence;
}
```

Supported input sources include normalized IS-7 facts, IS-13/Nuxt-authoritative facts, IS-11 Quality evidence supplied for documentation, repository/project facts supplied by their owner, existing documentation read under authorized scope, and previously accepted documentation content explicitly supplied for reuse.

IS-12 does not independently crawl the filesystem to expand the input set.

---

## 6. Documentation Profile

```ts
export interface DocumentationProfile {
  readonly id: DocumentationProfileId;
  readonly targetClass: DocumentationTargetClass;
  readonly categories: readonly DocumentationCategorySelection[];
  readonly output: DocumentationOutputKind;
  readonly detail: 'summary' | 'standard' | 'detailed';
  readonly template?: TemplateReference;
  readonly enrichment: DocumentationEnrichmentPolicy;
  readonly aggregation: DocumentationAggregationPolicy;
  readonly grouping: DocumentationGroupingPolicy;
  readonly provenance: DocumentationProvenancePolicy;
}
```

Profiles are supplied by IS-17/owning use case from effective policy. IS-12 validates capability support but does not decide that a profile is authorized or broaden managed scope.

No template identity implicitly changes target, scope or update intent.

---

## 7. Documentation Fact Model

```ts
export interface DocumentationFact<T = DocumentationFactValue> {
  readonly id: DocumentationFactId;
  readonly kind: DocumentationFactKind;
  readonly subject: DocumentationSubjectIdentity;
  readonly value: T;
  readonly provenance: DocumentationProvenance;
  readonly confidence: DocumentationConfidence;
  readonly revision?: DocumentationRevisionEvidence;
  readonly resource?: ResourceReference;
  readonly range?: SourceRange;
  readonly sensitivity: DocumentationSensitivityClass;
  readonly diagnostics: readonly DocumentationDiagnostic[];
}
```

`DocumentationFactKind` is a discriminated family, not one generic untyped fact bag. Initial classes include identity, responsibility, declaration/API, relationship, configuration, composition/layer, test, usage, example, limitation and existing-document observation.

Facts from different semantic owners retain their owner/provenance. IS-12 does not reclassify an AI claim as a recognized structural fact.

---

## 8. Provenance and Confidence

```ts
export type DocumentationProvenanceKind =
  | 'source_intelligence'
  | 'managed_project'
  | 'repository'
  | 'nuxt'
  | 'quality'
  | 'existing_documentation'
  | 'deterministic_derivation'
  | 'template'
  | 'ai_generated'
  | 'accepted_reuse';

export type DocumentationConfidence =
  | 'authoritative'
  | 'recognized'
  | 'derived'
  | 'authored_context'
  | 'generated'
  | 'ambiguous'
  | 'unknown';
```

Confidence is semantic evidence, not a floating pseudo-probability.

Conflicts involving an authoritative/recognized fact and generated/authored context are retained as conflict/omission evidence; lower-authority text does not silently replace the fact.

---

## 9. Source Intelligence Integration

Source structure comes from IS-7 where supported. IS-12 receives normalized facts/snapshots and maps them into documentation facts.

It does not call current regex strategies directly as an alternate parser path.

Raw source excerpts may be supplied only when explicitly permitted, bounded and useful for a profile. Raw text remains text evidence rather than structural truth.

Unsupported/ambiguous IS-7 evidence becomes omission/support diagnostics rather than inferred confirmed meaning.

---

## 10. Domain-Authoritative Fact Integration

Domain fact mappers are explicit adapters over already-normalized owner contracts. They do not duplicate owner semantics.

Examples:

- IS-13 supplies Nuxt layer/configuration/integration facts;
- IS-11 may supply test/quality evidence when documentation intent needs it;
- IS-6 may supply repository provenance/relationships when selected;
- IS-2 supplies project/entity identity and topology evidence.

A mapper may select and reshape facts for documentation presentation but may not reinterpret ownership-critical meaning.

---

## 11. Existing Documentation

Existing documentation is read through an authorized upstream/IS-4 path and supplied as contextual input.

```ts
export interface ExistingDocumentationEvidence {
  readonly resource: ResourceReference;
  readonly revision: ResourceRevisionEvidence;
  readonly content: string;
  readonly format: DocumentationFormat;
  readonly provenance: 'existing_documentation';
  readonly freshness?: DocumentationFreshnessEvidence;
}
```

Content is bounded before entering IS-12.

Existing prose is not automatically canonical project truth. Reading it does not authorize update/replacement.

---

## 12. Documentation Model

```ts
export interface DocumentationModel {
  readonly id: DocumentationModelId;
  readonly subject: DocumentationSubjectIdentity;
  readonly profile: DocumentationProfileIdentity;
  readonly sections: readonly DocumentationSection[];
  readonly provenance: readonly DocumentationProvenanceSummary[];
  readonly coverage: DocumentationCoverage;
  readonly revision: DocumentationModelRevision;
  readonly diagnostics: readonly DocumentationDiagnostic[];
}

export interface DocumentationSection {
  readonly id: DocumentationSectionId;
  readonly kind: DocumentationSectionKind;
  readonly blocks: readonly DocumentationBlock[];
}
```

Blocks are discriminated structures such as facts, prose, declarations, relationships, tables, examples, warnings and omissions. Renderer-native Markdown/HTML AST nodes do not become the universal model.

Facts and explanatory prose remain distinguishable at block level.

---

## 13. Model Construction

`DocumentationModelBuilder`:

1. validates input/profile compatibility;
2. filters only caller-selected evidence;
3. rejects/excludes protected evidence according to supplied policy;
4. maps normalized source/domain/existing-document inputs;
5. records unknown/ambiguous/unsupported inputs;
6. deduplicates semantic fact identity;
7. detects material provenance conflicts;
8. constructs semantic sections in deterministic profile order;
9. computes profile-relative coverage;
10. returns an immutable model.

Model construction does not perform AI calls, persistence or documentation-tool execution.

---

## 14. Aggregation

```ts
export interface DocumentationAggregationRequest {
  readonly profile: DocumentationProfile;
  readonly models: readonly DocumentationModel[];
  readonly selectedInputs: readonly DocumentationInputId[];
}
```

Aggregation is deterministic over equivalent ordered profile inputs. Logical fact identity, not textual equality alone, controls duplicate normalization.

Multi-layer/multi-file aggregation preserves source target/provenance on important facts and omissions.

Unsupported/failed inputs remain coverage evidence. Legitimately absent optional categories are recorded as `not_applicable`/`empty_valid`, not failures.

No recursive filesystem discovery occurs during aggregation.

---

## 15. Coverage and Completeness

```ts
export interface DocumentationCoverage {
  readonly requested: readonly DocumentationCoverageItem[];
  readonly documented: readonly DocumentationCoverageItem[];
  readonly emptyValid: readonly DocumentationCoverageItem[];
  readonly omitted: readonly DocumentationOmission[];
  readonly unsupported: readonly DocumentationCoverageItem[];
  readonly failed: readonly DocumentationCoverageFailure[];
  readonly stale: readonly DocumentationCoverageItem[];
  readonly state: 'complete' | 'partial' | 'indeterminate';
}
```

`complete` means complete relative to the approved profile/selected inputs, never complete knowledge of the project.

Unsupported/failed required items cannot count as documented. Optional absence is not failure.

Completeness does not require verbatim inclusion of every input.

---

## 16. Rendering Boundary

```ts
export interface DocumentationRenderRequest {
  readonly model: DocumentationModel;
  readonly format: DocumentationFormat;
  readonly template?: ResolvedTemplate;
  readonly constraints: DocumentationRenderConstraints;
  readonly signal?: AbortSignal;
}

export interface DocumentationRenderResult {
  readonly state: 'rendered' | 'partial' | 'unsupported' | 'cancelled' | 'failed';
  readonly proposals: readonly DocumentationProposal[];
  readonly coverage: DocumentationCoverage;
  readonly renderer: DocumentationRendererProvenance;
  readonly diagnostics: readonly DocumentationDiagnostic[];
}
```

Rendering never receives output mutation authority.

---

## 17. Markdown Renderer — Version 1

Markdown is the initial general text documentation format because the live AppManager documentation set and VitePress tooling are Markdown-oriented. This is a Version 1 implementation choice, not a permanent cross-version requirement.

The built-in `MarkdownRenderer` serializes semantic blocks with deterministic rules for headings, paragraphs, lists, tables, code fences and warnings.

It does not parse arbitrary Markdown as executable directives and does not execute embedded HTML/scripts.

Renderer output is normalized UTF-8 text with LF line endings. A final newline is emitted for generated Markdown artefacts.

Exact prose wording and heading labels come from profile/template/model content rather than hidden renderer policy where they carry product meaning.

---

## 18. Template Integration

IS-12 consumes resolved/bound IS-9 templates. It does not load registry files directly or implement a second template engine.

Documentation-specific template parameters are produced from the normalized model using an explicit mapper.

Template rendering may supply complete proposed content or bounded structural fragments depending on the registered template contract.

Missing/incompatible required templates return unsupported/unavailable evidence. A fallback renderer/template is used only when the profile/effective policy explicitly permits it.

Templates are data and cannot dispatch commands, alter managed scope or persist files.

---

## 19. Proposed Documentation Artefact

```ts
export interface DocumentationProposal {
  readonly id: DocumentationProposalId;
  readonly kind: 'new_artefact' | 'existing_artefact_content' | 'source_documentation_content';
  readonly format: DocumentationFormat;
  readonly content: string;
  readonly subject: DocumentationSubjectIdentity;
  readonly provenance: readonly DocumentationProvenanceSummary[];
  readonly sourceRevision?: DocumentationRevisionEvidence;
  readonly suggestedMetadata?: DocumentationOutputMetadata;
  readonly validation?: DocumentationValidationResult;
}
```

`suggestedMetadata` may contain semantic filename/category hints but never grants target-path authority.

A proposal is inert until IS-17/owning use case authorizes persistence/transformation.

---

## 20. Generation Versus Persistence

The implementation path is explicitly staged:

```text
selected evidence
 -> IS-12 model
 -> IS-12 render proposal
 -> IS-17 policy/preview/authorization
 -> target absent: IS-4 bounded create
    OR target exists: IS-8 transformation/replacement plan
 -> validation/acceptance
 -> IS-1 final outcome
```

IS-12 contains no `writeDocumentation()` convenience method that hides these boundaries.

An output collision is returned to the owning use case as precondition evidence; IS-12 never interprets collision as overwrite permission.

---

## 21. Existing-Document Update

For an existing document, IS-12 may render the desired complete content or documentation-specific proposed fragments, but IS-8 owns the actual edit plan, stale check, preservation and mutation.

Substantial whole-document replacement must be explicitly selected by IS-17 policy. IS-12 does not infer replacement because a template generated a complete document.

Revision evidence from the inspected existing document accompanies the proposal so IS-8 can enforce stale preconditions.

---

## 22. Source Documentation Injection

JSDoc/header/comment generation is split from source mutation:

```text
IS-7 declaration/region facts
 -> IS-12 documentation model/content proposal
 -> optional IS-10 enrichment proposal
 -> IS-17 accepts documentation intent/content
 -> IS-8 builds bounded source transformation
 -> authorized apply + source validation
```

IS-12 does not call current `injectHeader()`/`injectFunctionDoc()` strategy methods directly as a write path.

A recognized declaration/location is evidence for transformation planning, not write authority.

---

## 23. AI Enrichment

```ts
export interface DocumentationEnrichmentRequest {
  readonly model: DocumentationModel;
  readonly purpose: 'summary' | 'explanation' | 'draft_prose';
  readonly selectedFacts: readonly DocumentationFactId[];
  readonly policy: DocumentationEnrichmentPolicy;
  readonly signal?: AbortSignal;
}
```

`DocumentationEnricher` builds bounded IS-10 context from selected non-protected facts, preserving instruction/context separation and sensitivity/disclosure metadata.

AI output is normalized into `DocumentationBlock` proposals with `ai_generated` provenance. It does not mutate the base facts.

Contradictions with authoritative/recognized facts are rejected or surfaced as conflicts according to profile policy; generated prose never silently wins.

If enrichment is optional and IS-10 is unavailable/fails, the deterministic model/render path remains available and coverage records omitted enrichment where material.

IS-12 does not select AI provider/model or retry/fallback outside supplied IS-10/owning-use-case policy.

---

## 24. Documentation-Oriented Validation

IS-12 validation is bounded to documentation semantics, including where requested:

- required profile section presence;
- normalized frontmatter/schema shape;
- internal model/reference consistency;
- bounded link/reference syntax/target evidence supplied by caller;
- generated Markdown structural sanity;
- provider-specific documentation build evidence;
- output/profile completeness rules.

```ts
export interface DocumentationValidationResult {
  readonly state: 'valid' | 'invalid' | 'partial' | 'unsupported' | 'indeterminate';
  readonly findings: readonly DocumentationValidationFinding[];
  readonly validated: readonly DocumentationValidationAspect[];
  readonly diagnostics: readonly DocumentationDiagnostic[];
}
```

This is not a Quality gate. IS-11 may independently consume documentation evidence when Quality is the primary intent.

Source validity after source mutation remains IS-8.

---

## 25. Tool Provider Catalogue

IS-23 composes an immutable documentation-tool catalogue:

```ts
export interface DocumentationToolProviderDescriptor {
  readonly id: DocumentationToolProviderId;
  readonly operations: ReadonlySet<'development' | 'build' | 'preview'>;
  readonly requirements: DocumentationToolRequirements;
  readonly adapter: DocumentationToolAdapterId;
}
```

Duplicate IDs fail composition validation. Catalogue order has no provider preference semantics.

Provider preference/permission comes from IS-3 effective configuration.

Version 1 includes a VitePress adapter where target recognition confirms a compatible VitePress documentation project. VitePress remains replaceable and provider-local.

---

## 26. Tool Recognition and Resolution

Recognition consumes the explicit documentation target and bounded IS-4/configuration evidence. It does not launch the tool.

```ts
export type DocumentationToolRecognitionResult =
  | { readonly state: 'available'; readonly candidates: readonly DocumentationToolAvailability[] }
  | { readonly state: 'unavailable'; readonly diagnostics: readonly DocumentationDiagnostic[] }
  | { readonly state: 'unsupported'; readonly diagnostics: readonly DocumentationDiagnostic[] }
  | { readonly state: 'ambiguous'; readonly candidates: readonly DocumentationToolProviderId[] }
  | { readonly state: 'cancelled'; readonly diagnostics: readonly DocumentationDiagnostic[] }
  | { readonly state: 'failed'; readonly diagnostics: readonly DocumentationDiagnostic[] };
```

Selection uses requested operation, target compatibility, configured provider constraints and deterministic configured preference. Equal materially different candidates remain ambiguous.

Package-script presence is evidence, not managed-scope or provider authority.

---

## 27. VitePress Provider — Version 1

The repository's current `docs/.vitepress/` project and VitePress dependency establish useful concrete implementation evidence.

The adapter recognizes a VitePress target only from an already-approved documentation target plus compatible project/configuration evidence.

Supported operation classes are:

- `development` — long-running development server;
- `build` — finite static documentation build;
- `preview` — long-running preview server over an appropriate build/output.

Exact package scripts are not semantic contracts. If package scripts are used as invocation mechanisms, IS-3/configuration must bind them explicitly to the operation and the adapter must validate their bounded invocation strategy.

The provider does not assume that AppManager's own `docs/` directory is the target of every Docs-domain tooling request.

---

## 28. Documentation Tool Execution

```ts
export interface DocumentationToolExecutionRequest {
  readonly requestId: string;
  readonly operation: 'development' | 'build' | 'preview';
  readonly target: DocumentationToolTarget;
  readonly provider: ResolvedDocumentationToolProvider;
  readonly effectiveConfiguration: DocumentationToolConfiguration;
  readonly timeoutMs?: number;
  readonly signal?: AbortSignal;
}
```

CLI providers delegate through IS-5 using explicit executable/argument arrays, target-derived cwd and `shell: false` unless an explicitly approved provider mechanism genuinely requires shell semantics.

No arbitrary command string is accepted through IS-12.

Target/path/port values are structured provider inputs and validated before argument construction.

---

## 29. Tool Result Model

```ts
export interface DocumentationToolResult {
  readonly operation: 'development' | 'build' | 'preview';
  readonly target: DocumentationToolTargetIdentity;
  readonly provider: DocumentationToolProviderProvenance;
  readonly technicalState: 'started' | 'running' | 'completed' | 'failed' | 'timed_out' | 'cancelled' | 'indeterminate';
  readonly generatedArtefacts: readonly DocumentationToolArtefact[];
  readonly timing: DocumentationToolTiming;
  readonly completeness: DocumentationCompleteness;
  readonly diagnostics: readonly DocumentationDiagnostic[];
}
```

Development/preview remain running while active; launch is not documentation success.

Build exit/process evidence is normalized by the VitePress provider. A successful build remains bounded tooling evidence; IS-17/IS-1 decides application acceptance.

Generated output is reported as provider effect evidence and does not grant unrelated mutation authority.

---

## 30. Generated Tool Artefacts

Known build output/report/cache resources are represented with provider/request provenance and lifecycle evidence.

IS-12 does not claim cleanup or rollback unless it occurred and is verified.

Provider output locations must be within configured/authorized tooling-effect boundaries. A provider configuration that would overwrite unrelated resources is rejected or escalated to owning-use-case policy rather than silently executed.

---

## 31. Effective Configuration

IS-12 consumes IS-3 operation-effective projections for concerns such as:

- enabled documentation formats/renderers;
- template identities/variants;
- detail/aggregation/render constraints;
- AI enrichment permission/purpose/disclosure constraints;
- documentation-tool provider preference;
- tool executable/package invocation strategy;
- development/preview ports;
- timeouts;
- generated-tool-artifact locations;
- validation policy;
- content/report/output size bounds;
- sensitive-content inclusion/exclusion policy;
- deterministic fallback permissions.

IS-12 performs no direct environment/settings precedence resolution.

---

## 32. Progress

Capability progress is transport-neutral and stage-aware:

```ts
export type DocumentationProgressEvent =
  | { readonly kind: 'input_started'; readonly inputId: DocumentationInputId }
  | { readonly kind: 'model_completed'; readonly modelId: DocumentationModelId }
  | { readonly kind: 'render_started'; readonly proposalId: DocumentationProposalId }
  | { readonly kind: 'enrichment_started'; readonly purpose: DocumentationEnrichmentPurpose }
  | { readonly kind: 'validation_completed'; readonly state: DocumentationValidationState }
  | { readonly kind: 'tool_started'; readonly operation: DocumentationToolOperation; readonly provider: DocumentationToolProviderId };
```

IS-1 owns invocation-event integration; IS-22 owns presentation.

---

## 33. Cancellation and Timeout

Caller `AbortSignal` propagates to active IS-10/IS-5/provider work.

Cancellation stops future model/render/enrichment/tool stages as safely practical but preserves completed evidence/proposals and known effects.

Cancellation does not imply:

- AI usage was reversed;
- generated tooling artefacts were removed;
- a server process was successfully terminated unless provider/IS-5 evidence proves it;
- a downstream write was rolled back.

Timeout values are explicit configuration/request/provider inputs.

---

## 34. Revision and Stale-State Evidence

Documentation facts/models/proposals retain revision evidence for material source inputs.

IS-12 may compare supplied revision evidence for model consistency but does not create a universal project snapshot guarantee.

Existing-document/source updates pass revision evidence downstream to IS-8 for authoritative stale-write checks.

If required facts fail refresh or are known changed, completeness/freshness is partial/stale; IS-12 does not claim synchronized documentation.

A stale model/proposal is not automatically regenerated without owning-use-case policy.

---

## 35. Sensitive Information

Every input/fact carries a sensitivity classification sufficient for the requested documentation policy.

Default generated documentation excludes credentials, protected configuration values, environment secrets and content explicitly marked non-documentable.

Access to sensitive material does not imply documentability.

AI disclosure follows IS-10; IS-12 supplies only policy-permitted selected context.

Diagnostics use identities/ranges/summaries rather than copying protected content.

---

## 36. Provider Content Is Untrusted

Existing documentation, templates, AI prose, Markdown, VitePress output and provider diagnostics are data.

They cannot:

- redefine AppManager policy/configuration;
- broaden managed scope;
- authorize persistence;
- dispatch application commands;
- inject arbitrary shell execution;
- cause a renderer to follow unapproved include paths;
- make generated links/paths authoritative effects.

Any include/reference mechanism introduced later must be separately bounded and resolved under the owning resource/scope authority.

---

## 37. Failure Model

```ts
export type DocumentationFailureCode =
  | 'unsupported_input'
  | 'ambiguous_input'
  | 'input_unavailable'
  | 'input_stale'
  | 'profile_unsupported'
  | 'model_conflict'
  | 'model_incomplete'
  | 'template_unavailable'
  | 'template_incompatible'
  | 'renderer_unsupported'
  | 'render_failed'
  | 'enrichment_unavailable'
  | 'enrichment_failed'
  | 'enrichment_conflict'
  | 'validation_failed'
  | 'tool_unavailable'
  | 'tool_unsupported'
  | 'tool_ambiguous'
  | 'tool_launch_failed'
  | 'tool_failed'
  | 'tool_timed_out'
  | 'caller_cancelled'
  | 'generated_artefact_violation'
  | 'indeterminate_failure';
```

Persistence/transformation failures are not IS-12 failures merely because the content originated in IS-12; IS-17/IS-1 aggregate downstream stage evidence.

---

## 38. Diagnostics

Initial stable codes include:

```text
DOC_INPUT_UNSUPPORTED
DOC_INPUT_AMBIGUOUS
DOC_INPUT_UNAVAILABLE
DOC_INPUT_STALE
DOC_INPUT_EXCLUDED_SENSITIVE
DOC_PROFILE_UNSUPPORTED
DOC_FACT_CONFLICT
DOC_FACT_UNKNOWN
DOC_MODEL_PARTIAL
DOC_TEMPLATE_UNAVAILABLE
DOC_TEMPLATE_INCOMPATIBLE
DOC_RENDER_UNSUPPORTED
DOC_RENDER_FAILED
DOC_ENRICHMENT_UNAVAILABLE
DOC_ENRICHMENT_FAILED
DOC_ENRICHMENT_CONFLICT
DOC_VALIDATION_FAILED
DOC_TOOL_UNAVAILABLE
DOC_TOOL_UNSUPPORTED
DOC_TOOL_AMBIGUOUS
DOC_TOOL_LAUNCH_FAILED
DOC_TOOL_FAILED
DOC_TOOL_TIMEOUT
DOC_TOOL_ARTEFACT_VIOLATION
DOC_CANCELLED
DOC_COMPLETENESS_PARTIAL
```

Diagnostics are capability evidence and map into Docs/IS-1 canonical diagnostics without creating a competing application outcome taxonomy.

---

## 39. Caching

Model/render caching is disabled globally by default because documentation is revision/profile/template sensitive.

Invocation-local memoization may reuse identical mapped facts/models.

A future cross-invocation cache must key at least by input revision set, profile identity/revision, template revision, renderer version and relevant effective configuration. AI enrichment results require separate IS-10 disclosure/model/policy-sensitive handling and are not cached by IS-12 by default.

Tool execution is never satisfied from a documentation cache.

---

## 40. Concurrency

Pure model construction/aggregation/rendering may run concurrently for independent inputs subject to resource bounds.

AI concurrency remains governed by IS-10/provider policy.

Tooling operations may contend for ports/build directories/caches; VitePress provider descriptors expose conflict keys so IS-12 can serialize/reject conflicting operations without a global Documentation lock.

Downstream persistence concurrency is owned by IS-4/IS-8/IS-1, not IS-12.

---

## 41. Testing Requirements

Core tests use fake facts/renderers/templates/AI/tool providers and cover at least:

1. supported/unsupported input normalization;
2. profile compatibility without scope broadening;
3. no hidden filesystem crawl;
4. Source Intelligence fact mapping without reparsing;
5. Nuxt/domain-authoritative fact preservation;
6. existing-document provenance;
7. structural fact versus authored prose distinction;
8. AI prose versus recognized fact distinction;
9. unknown meaning remains unknown;
10. authoritative/generated conflict handling;
11. sensitive input exclusion;
12. semantic duplicate normalization;
13. multi-file/multi-layer provenance retention;
14. complete/partial/indeterminate coverage;
15. empty optional category;
16. unsupported required category;
17. deterministic model section ordering;
18. deterministic Markdown rendering;
19. renderer-native types do not escape contracts;
20. Markdown escaping/code-fence handling;
21. required template success;
22. missing/incompatible template;
23. explicitly permitted renderer fallback;
24. template cannot dispatch commands;
25. render creates proposal but performs no write;
26. output collision remains upstream evidence;
27. new artefact/update distinction;
28. existing-document revision carried to IS-8 seam;
29. source injection produces proposal only;
30. optional AI unavailable preserves deterministic baseline;
31. required enrichment failure marks incompleteness;
32. bounded IS-10 context and sensitivity;
33. contradictory AI output cannot replace reliable fact;
34. documentation validation after render;
35. render success plus validation failure remains distinct;
36. documentation validation does not become Quality gate;
37. tool recognition performs no execution;
38. target-relative VitePress recognition;
39. provider selection independent of catalogue order;
40. tool ambiguity;
41. explicit IS-5 executable/args and no hidden shell;
42. development/preview long-running state;
43. build technical success versus Docs acceptance;
44. generated tool artefact attribution;
45. tooling output boundary violation;
46. cancellation preserves completed model/render evidence;
47. cancellation propagates to AI/tool delegates;
48. cancellation does not claim rollback;
49. stale input/model evidence;
50. partial multi-artefact result;
51. provider substitution behind normalized contracts;
52. bounded diagnostics;
53. provider/generated content remains inert;
54. no direct fileService/llmService/singleton authority;
55. no AppManager project-documentation governance encoded into shared capability.

VitePress integration tests use temporary documentation fixtures and verify recognition, finite build normalization, long-running start/cancel behavior and generated artefact attribution without defining the shared contract.

Markdown renderer tests are deterministic golden/structural tests over normalized models, not snapshots of arbitrary provider ASTs.

---

## 42. Current Implementation Disposition

| Current artefact/responsibility | Disposition | Version 1 treatment |
|---|---|---|
| `app/services/codeService.ts` as combined documentation/source service | **SPLIT / REPLACE** | Divide responsibilities among IS-7, IS-8, IS-10, IS-12 and IS-17; no singleton Documentation authority. |
| `CodeService.inspect()` documentable-block intent | **RETAIN intent / RELOCATE** | Structural recognition is IS-7; IS-12 consumes normalized facts and maps them into documentation models. |
| `CodeService.updateHeader()` | **RETAIN intent / RELOCATE** | Documentation content proposal may be IS-12; bounded source edit/stale/preservation/validation is IS-8 under IS-17 authorization. |
| `CodeService.generateDocFor()` | **SPLIT / RELOCATE** | IS-7 identifies declaration, IS-12 constructs documentation request/model, IS-10 optionally generates prose, IS-17 accepts intent/content, IS-8 applies approved transformation. |
| direct `fileService.read()` in CodeService | **REPLACE / RELOCATE** | Authorized reads use IS-4/upstream evidence; IS-12 does not reconstruct scope from arbitrary paths. |
| direct `fileService.write()` in CodeService | **REMOVE from IS-12** | New creation is downstream IS-4; existing-resource/source update is IS-8. |
| direct `llmService.generate()` | **REPLACE / RELOCATE** | Optional enrichment uses IS-10 contracts with provenance/disclosure/policy. |
| hard-coded JSDoc prompt/response | **REPLACE / ADAPT** | Documentation purpose/profile + bounded enrichment request; exact prompt is provider/use-case implementation detail. |
| current strategy registry/file-type selection | **SPLIT / RELOCATE** | Generic source recognition belongs IS-7; it is not Documentation managed scope. |
| strategy `findDocumentableBlocks()` results | **RETAIN intent / ADAPT** | Useful recognition concepts migrate to IS-7 facts, then IS-12 fact/model mapping. |
| strategy source injection methods | **RETAIN useful mechanics / RELOCATE** | Adapt as IS-8 transformation providers/planners where conforming; never direct IS-12 writes. |
| `CodeBlock` mixed shared type | **SPLIT / REPLACE** | Source structural contracts remain IS-7-owned; Documentation owns its mapped fact/block contracts. |
| logger success/info as result | **REPLACE** | Structured capability results/diagnostics/events; logging is observability only. |
| `app/commands/docs/runDocs.ts` TODO stub | **REPLACE / RELOCATE** | Docs application use cases belong IS-17; shared mechanisms call IS-12. |
| `tests/unit/services/codeService.test.ts` | **SPLIT / RELOCATE** | Preserve useful behavioral cases across IS-7/8/10/12 and IS-17 contract tests. |
| current `docs/.vitepress/` project | **RETAIN AS PROVIDER EVIDENCE** | Concrete VitePress target/configuration evidence, not universal Docs architecture. |
| current VitePress dependency | **RETAIN / ADAPT** | Initial documentation-tool provider where target/configuration support it; provider remains replaceable. |
| project Markdown documentation corpus | **RETAIN AS FORMAT EVIDENCE** | Supports Version 1 Markdown renderer choice; AppManager's own documentation governance remains outside IS-12. |
| no shared Documentation model/provenance/coverage contracts | **ADD** | Introduce capability-local normalized contracts. |
| no normalized docs-tool provider boundary | **ADD** | Introduce bounded provider catalogue/resolution/execution over IS-5. |

---

## 43. Migration Sequence

1. create capability-local documentation input/fact/model/profile/provenance/coverage contracts;
2. implement fake source/domain/existing-document fact mappers;
3. implement deterministic model builder and aggregation with omission/conflict evidence;
4. implement Markdown renderer and proposal contracts with no persistence;
5. integrate IS-9 resolved templates without adding a second template engine;
6. implement documentation-oriented validation;
7. implement optional IS-10 enrichment adapter with provenance/sensitivity/conflict handling;
8. implement documentation-tool catalogue/resolver and fake provider tests;
9. implement IS-5-backed VitePress recognition/build/development/preview adapter;
10. add tool generated-artefact and concurrency-conflict evidence;
11. wire IS-3 documentation/tool/enrichment configuration;
12. integrate IS-2/IS-7/IS-13 normalized facts through explicit owner mappers;
13. migrate `CodeService.inspect()` recognition responsibility fully to IS-7 and documentation mapping to IS-12;
14. migrate `generateDocFor()` into IS-17 orchestration over IS-7 + IS-12 + optional IS-10 + IS-8;
15. migrate `updateHeader()` into IS-17/IS-8 transformation flow;
16. remove direct file/LLM writes and logger-as-result semantics from legacy CodeService;
17. implement IS-17 Docs use cases against IS-12 rather than expanding `runDocs.ts`;
18. retain current VitePress/Markdown project mechanics where conforming while preventing them from becoming universal contracts.

---

## 44. Traceability

| Implementation concern | Governing authority |
|---|---|
| subordinate authority/non-persistence | DD-DOCCAP-001–004; FR-DOCS-001–005 |
| input/provenance | DD-DOCCAP-005–007; FR-DOCS-013–015, 019–030 |
| profile | DD-DOCCAP-008–010; FR-DOCS-019–040 |
| facts/model | DD-DOCCAP-011–013; FR-DOCS-041–072, 100–105 |
| Source Intelligence | DD-DOCCAP-014–017; FR-DOCS-041–050, 070; IS-7 |
| domain facts | DD-DOCCAP-018–021; FR-DOCS-055–066, 101; IS-11/13 |
| existing documentation | DD-DOCCAP-022–024; FR-DOCS-037, 073–083 |
| aggregation | DD-DOCCAP-025–029; FR-DOCS-031–040, 051–060, 100–105 |
| generation request | DD-DOCCAP-030–032; FR-DOCS-073–083 |
| templates | DD-DOCCAP-033–036; IS-9 |
| rendering | DD-DOCCAP-037–040; FR-DOCS-073–083 |
| persistence/update boundary | DD-DOCCAP-041–044; FR-DOCS-073–083, 114–119; IS-4/8 |
| source injection | DD-DOCCAP-045–047; FR-DOCS-046–050; IS-8 |
| AI enrichment | DD-DOCCAP-048–053; FR-DOCS-084–090; IS-10 |
| documentation tooling | DD-DOCCAP-054–064; FR-DOCS-091–099; IS-5 |
| documentation validation | DD-DOCCAP-065–068; FR-DOCS-106–113; IS-8/11 boundary |
| coverage/completeness | DD-DOCCAP-069–072; FR-DOCS-038–040, 059–060, 102–109 |
| partial/multi-artefact | DD-DOCCAP-073–075; FR-DOCS-108, 112 |
| progress/cancellation/timeout | DD-DOCCAP-076–080; FR-DOCS-016–018, 095–099 |
| stale/revision | DD-DOCCAP-081–083; FR-DOCS-117 |
| sensitive content | DD-DOCCAP-084–087; FR-DOCS-090, 110, 114–119 |
| capability composition | DD-DOCCAP-088 |
| provider/renderer replaceability | DD-DOCCAP-089–092; ADR-0001 |
| DD-1 outcomes | DD-DOCCAP-093–095; FR-DOCS-106–113; IS-1 |
| current implementation convergence | DD-DOCCAP-096 |
| security | DD-DOCCAP-097–098; FR-DOCS-114–119 |
| testability | DD-DOCCAP-099–100 |

---

## 45. Version 1 Non-Drift Baseline

```text
IS-17 owning Docs use case / approved target/profile
 + IS-2 managed scope
 + IS-3 effective documentation policy
 + selected IS-7 / IS-13 / other authoritative evidence
        |
        v
IS-12 input normalization + provenance
        |
        v
documentation model + profile-relative coverage
        |
        +--> optional IS-10 bounded enrichment
        |
        v
deterministic IS-12 rendering / IS-9 template consumption
        |
        v
proposed documentation content + validation evidence
        |
        +--> optional explicit IS-12 docs-tool execution via IS-5
        |
        v
IS-17 policy / preview / authorization
        |
        +--> new artefact: IS-4 bounded creation
        +--> existing document/source: IS-8 transformation
        |
        v
IS-17 interpretation -> IS-1 final application acceptance
```

The non-drift rule is:

> **Version 1 Documentation Capability may normalize selected provenance-bearing evidence, construct and aggregate documentation models, render proposed documentation, optionally obtain bounded AI enrichment, validate documentation semantics and delegate explicitly requested documentation tooling; it may not discover a broader project scope, turn existing prose or generated text into authoritative facts, persist or overwrite documentation, mutate source, execute hidden tooling, absorb Nuxt/Quality/AI semantics, or decide that the complete Docs-domain/application intent succeeded.**

This implementation preserves useful current documentable-block, Markdown, VitePress, AI-drafting and source-documentation concepts while separating them into their approved capability/domain authorities and eliminating the current generation-plus-write shortcut.