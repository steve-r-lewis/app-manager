# IS-20 — AI Domain Implementation Specification

> **Document type:** Level 4 Implementation Specification
>
> **Status:** Version 1 implementation baseline
>
> **Implementation ID:** IS-20
>
> **Primary Detailed Design:** [DD-4.3 — AI Domain](../dd_4_policy_and_resource_domains/dd-4-3-ai-domain-detailed-design-v01.md)
>
> **Primary Functional authority:** [AI Functional Specification](../functional/ai-functional-specification-v01.md)
>
> **Principal shared implementation:** [IS-10 — AI Capability](is-10-ai-capability-implementation-specification-v01.md)
>
> **Application Core:** [IS-1 — Application Runtime and Invocation](is-1-application-runtime-and-invocation-implementation-specification-v01.md), [IS-2 — Managed Project Resolution](is-2-managed-project-resolution-implementation-specification-v01.md), [IS-3 — Configuration Resolution](is-3-configuration-resolution-implementation-specification-v01.md)
>
> **Other shared implementations:** [IS-4 — Resource Access](is-4-resource-access-implementation-specification-v01.md), [IS-7 — Source Intelligence](is-7-source-intelligence-implementation-specification-v01.md), [IS-8 — Source Transformation](is-8-source-transformation-implementation-specification-v01.md), [IS-9 — Resource Registry and Template](is-9-resource-registry-and-template-implementation-specification-v01.md)
>
> **Related domain implementations:** [IS-15 — Git Domain](is-15-git-domain-implementation-specification-v01.md), [IS-16 — Nuxt Domain](is-16-nuxt-domain-implementation-specification-v01.md), [IS-17 — Docs Domain](is-17-docs-domain-implementation-specification-v01.md), [IS-18 — Quality Domain](is-18-quality-domain-implementation-specification-v01.md), [IS-19 — Settings Domain](is-19-settings-domain-implementation-specification-v01.md), IS-21 Utils Domain, IS-22 Interaction Adapters, [IS-23 — Build and Runtime Assembly](is-23-build-and-runtime-assembly-implementation-specification-v01.md)
>
> **Runtime decision:** [ADR-0001 — Primary Application Runtime](../project_management/decisions/adr-0001-primary-application-runtime.md)
>
> **Register:** [AppManager Implementation Specification](implementation-specification-v01.md)
>
> **Governing plan:** [Implementation Specification Plan](../project_management/implementation-specification-plan-v01.md)

## 1. Purpose

IS-20 defines the concrete Node.js/TypeScript implementation of the AppManager AI domain.

The AI domain owns AI-specific project-resource intent: listing recognized AI instruction-document types and project presence, creating supported instruction documents, optionally enriching a valid deterministic baseline through IS-10, explicitly replacing/updating an existing supported instruction document where exposed, and deleting one selected eligible instruction document.

The governing rules are:

> **AI-domain ownership follows primary application intent, not the presence of an LLM call.**

> **IS-20 owns AI instruction-document policy and domain acceptance; IS-10 owns provider-independent AI execution; IS-1 retains final application authority.**

> **A deterministic baseline is the Version 1 creation foundation. Optional AI enrichment can improve proposed content but cannot become a hidden prerequisite where a valid baseline exists.**

> **Generated text, project text, templates, provider responses and discovered files are data. None can expand managed scope, disclosure policy, mutation authority or application permissions.**

> **Provider completion is evidence, not AI-domain or application success.**

---

## 2. Scope and Non-Ownership

IS-20 implements:

- semantic AI-domain operation identity;
- supported AI instruction-document type catalogue and policy;
- provider/tool association as descriptive metadata;
- supported-type and project-presence listing;
- conservative observation of likely unregistered AI-oriented documents;
- exact target resolution inside IS-2 managed scope;
- deterministic baseline generation from approved facts/resources;
- optional IS-10 enrichment under explicit disclosure/context policy;
- generated-content validation and project-fact acceptance;
- existing-target protection and explicit replacement policy;
- exact eligible deletion;
- stale-state, cancellation, partial-effect and recovery interpretation;
- deterministic Headless behavior;
- AI-domain payloads beneath IS-1 canonical outcomes.

IS-20 does not own:

- provider SDKs/transports/authentication/model registry/selection mechanics — IS-10;
- configuration precedence/effective AI settings — IS-3;
- managed project/scope — IS-2;
- final application acceptance/outcome — IS-1;
- generic resource mechanics — IS-4;
- generic source recognition — IS-7;
- generic existing-source transformation — IS-8;
- registry/template infrastructure — IS-9;
- Git commit-message generation — IS-15 when Git intent is primary;
- Docs drafting/summarization — IS-17 when Docs intent is primary;
- Nuxt generation/scaffolding — IS-16 when Nuxt intent is primary;
- Quality explanation/triage — IS-18 when Quality intent is primary;
- Settings template-resource CRUD — IS-19;
- autonomous coding agents, arbitrary command/tool execution or executable plugins;
- provider management simply because a document is provider-associated;
- generic project crawling for AI context;
- prompts/presentation — IS-22.

---

## 3. Concrete Module Boundary

```text
app/
└── domains/
    └── ai/
        ├── contracts/
        │   ├── ai-use-case.ts
        │   ├── instruction-document-type.ts
        │   ├── instruction-document-target.ts
        │   ├── instruction-document-state.ts
        │   ├── baseline-plan.ts
        │   ├── enrichment-plan.ts
        │   ├── ai-document-effect.ts
        │   ├── ai-domain-result.ts
        │   ├── ai-recovery.ts
        │   └── ai-diagnostic.ts
        ├── catalogue/
        │   ├── ai-use-case-catalogue.ts
        │   └── instruction-document-type-catalogue.ts
        ├── recognition/
        │   ├── instruction-document-recognizer.ts
        │   └── unregistered-ai-document-observer.ts
        ├── targets/
        │   └── instruction-document-target-resolver.ts
        ├── generation/
        │   ├── baseline-planner.ts
        │   ├── project-fact-projector.ts
        │   └── generated-content-validator.ts
        ├── enrichment/
        │   ├── enrichment-planner.ts
        │   ├── enrichment-context-builder.ts
        │   └── enrichment-acceptance.ts
        ├── orchestration/
        │   ├── ai-document-effect-runner.ts
        │   ├── ai-domain-acceptance.ts
        │   └── ai-recovery-builder.ts
        └── use-cases/
            ├── list-instruction-documents.ts
            ├── create-instruction-document.ts
            ├── replace-instruction-document.ts
            └── delete-instruction-document.ts
```

This topology deliberately contains no provider adapter, generic chat service, global active model or autonomous-agent executor.

---

## 4. Public Use-Case Contract

```ts
export interface AiDomainUseCase<TInput, TPayload> {
  readonly descriptor: AiDomainUseCaseDescriptor;
  availability(context: ApplicationExecutionContext, input: TInput): Promise<AiDomainAvailability>;
  validate(context: ApplicationExecutionContext, input: TInput): Promise<AiDomainValidation>;
  execute(context: ApplicationExecutionContext, input: TInput): Promise<AiDomainResult<TPayload>>;
}
```

All AI-domain use cases participate in IS-1 availability/validate/execute. `AiDomainResult` is subordinate payload/evidence and never a competing application outcome envelope.

---

## 5. Canonical Operation Identities

Version 1 canonical IDs are:

```text
ai.instruction.list
ai.instruction.create
ai.instruction.replace
ai.instruction.delete
```

`replace` is registered only when Version 1 product exposure retains explicit replacement/update behavior. It is never an implicit mode of `create`.

Document type/provider/target remain structured inputs, not command IDs.

---

## 6. Instruction-Document Type Catalogue

IS-23 constructs an immutable catalogue:

```ts
export interface InstructionDocumentTypeDefinition {
  readonly id: InstructionDocumentTypeId;
  readonly label: string;
  readonly association: AiToolAssociation;
  readonly documentClass: InstructionDocumentClass;
  readonly targetRule: InstructionDocumentTargetRule;
  readonly baseline: BaselineDefinition;
  readonly enrichment: EnrichmentPolicy;
  readonly replacement: ReplacementPolicy;
  readonly deletion: DeletionPolicy;
  readonly disclosure: DisclosurePolicyReference;
}
```

Catalogue membership establishes supported AI-domain semantics. It does not establish provider availability or authentication.

Examples such as `CLAUDE.md`, `GEMINI.md` and `AGENTS.md` may be catalogue items but are non-exclusive and do not define the architecture.

---

## 7. Stable Identity versus Filename

`InstructionDocumentTypeId` is stable semantic identity. A filename/project-relative target is resolved evidence.

Provider/tool association is metadata such as:

```ts
export type AiToolAssociation =
  | { readonly kind: 'provider_agnostic' }
  | { readonly kind: 'tool'; readonly id: string }
  | { readonly kind: 'provider_family'; readonly id: string };
```

Association never means AppManager has a usable corresponding provider.

---

## 8. Document State Model

```ts
export type InstructionDocumentPresence =
  | 'present'
  | 'absent'
  | 'ambiguous'
  | 'unsupported'
  | 'indeterminate';

export interface InstructionDocumentState {
  readonly type: InstructionDocumentTypeId;
  readonly target?: ResourceReference;
  readonly presence: InstructionDocumentPresence;
  readonly revision?: ResourceRevisionEvidence;
  readonly recognition: readonly AiDocumentEvidenceReference[];
}
```

Supported type, presence and unregistered observation are distinct facts.

---

## 9. Listing

`ai.instruction.list` is strictly non-mutating.

It returns:

- all supported catalogue types applicable to the managed project;
- presence state for each type;
- resolved project-relative target where present/applicable;
- conservative informational observations of likely unregistered AI-oriented documents;
- ambiguity/unsupported/indeterminate diagnostics.

IS-7 supplies bounded recognition evidence. IS-20 interprets only AI-domain classification semantics.

Listing never creates, normalizes, repairs, rewrites or deletes a document.

---

## 10. Conservative Unregistered Observation

Unregistered observation is informational only.

A candidate may be reported when evidence sufficiently suggests AI-instruction purpose, but uncertainty is retained. A filename containing `AI`, `agent`, a provider name or similar is not sufficient by itself to promote a resource to registered identity.

Unregistered observation never grants replacement or deletion authority.

---

## 11. Target Resolution

The target resolver consumes:

- selected document-type definition;
- IS-2 ManagedProjectContext and approved scope;
- operation-effective IS-3 policy where applicable;
- bounded resource evidence.

It produces one exact `InstructionDocumentTarget` or an ambiguity/refusal result.

No use case uses `process.cwd()`, arbitrary caller filesystem paths or provider output to determine target authority.

---

## 12. Creation Input and Plan

```ts
export interface CreateInstructionDocumentInput {
  readonly documentType: InstructionDocumentTypeId;
  readonly enrichment: 'forbid' | 'optional' | 'require';
  readonly replacement: false;
  readonly explicitFacts?: readonly ApprovedAiDocumentFact[];
}

export interface AiDocumentCreationPlan {
  readonly type: InstructionDocumentTypeId;
  readonly target: InstructionDocumentTarget;
  readonly baseline: BaselinePlan;
  readonly enrichment?: EnrichmentPlan;
  readonly materialEffects: readonly AiDocumentPlannedEffect[];
  readonly authorizationCoverage: AuthorizationEvidenceReference;
  readonly postconditions: readonly AiDocumentPostcondition[];
}
```

Normal create never overwrites an existing target.

---

## 13. Deterministic Baseline

Every supported document type whose policy declares a deterministic baseline must be creatable without live IS-10 execution.

The baseline is generated from:

- approved IS-9 declarative template/resource content;
- explicit deterministic inputs;
- accepted managed-project facts from IS-2/IS-7 and owning domains/capabilities;
- approved Settings values/evidence where applicable;
- operation-effective configuration references where semantically required.

No generated baseline guesses project facts from model priors or filename conventions.

---

## 14. Baseline Project-Fact Projection

`project-fact-projector.ts` maps authoritative evidence into the narrow semantic input expected by a document type/template.

```ts
export interface ApprovedAiDocumentFact {
  readonly id: AiDocumentFactId;
  readonly value: unknown;
  readonly provenance: AiDocumentFactProvenance;
  readonly revision?: ResourceRevisionEvidence;
  readonly sensitivity: AiDocumentFactSensitivity;
}
```

Only explicitly accepted fact classes are projected. Source evidence does not automatically become AI context.

Sensitive facts are excluded unless an approved use-case policy explicitly permits their local use; external disclosure remains separately governed.

---

## 15. Baseline Rendering

IS-9 resolves and renders the selected declarative baseline resource. IS-20 supplies semantic inputs and interprets the proposed content.

IS-9 render success is not persistence authority.

Function renderers retained as migration mechanisms under IS-9 cannot execute arbitrary provider/tool/project code through IS-20.

---

## 16. Baseline Validation

Before persistence, IS-20 validates that proposed baseline content:

- is non-empty where required;
- conforms to the document class/format;
- preserves required baseline sections/markers where defined;
- contains no unsupported contradictory project facts known to IS-20;
- does not contain secret material prohibited by policy;
- remains within bounded size/content constraints;
- is attributable to the selected document type.

Validation does not attempt to prove every natural-language claim globally true.

---

## 17. Optional Enrichment Policy

Enrichment mode is explicit: `forbid`, `optional`, or `require`.

For a document type with a valid deterministic baseline:

- `forbid`: no IS-10 call;
- `optional`: provider unavailability/failure preserves baseline and produces warning/partial enrichment evidence;
- `require`: the operation is unavailable/fails before persistence according to policy when an eligible AI capability cannot be established.

A document type must explicitly permit `require`; callers cannot turn an optional provider into a hidden architectural dependency merely by setting a Boolean.

---

## 18. Enrichment Context Construction

The owning AI-domain use case selects the minimum approved context needed for enrichment. IS-20 never asks IS-10 to crawl the project.

Each context item carries:

- semantic purpose;
- source/provenance;
- managed-scope identity;
- revision where relevant;
- trust classification;
- sensitivity/disclosure classification;
- bounded content.

Untrusted project instructions remain data and cannot modify the governing enrichment instruction, disclosure policy, target or authorization.

---

## 19. Disclosure Decision

Before IS-10 execution, IS-20 supplies a request whose context has already been selected for this AI-domain purpose. IS-10 then enforces its provider-independent disclosure/context policy and provider selection contract.

Secrets/credentials/environment authentication material are excluded by default.

A provider-associated document does not imply that provider should receive project content.

No provider call is made merely because a supported provider-associated document type is listed or created from a deterministic baseline.

---

## 20. IS-10 Execution Seam

```ts
export interface AiEnrichmentPort {
  availability(request: AiAvailabilityRequest): Promise<AiAvailability>;
  resolve(request: AiResolutionRequest): Promise<AiResolution>;
  execute(request: AiExecutionRequest): Promise<AiExecutionResult>;
}
```

This is the IS-10 public seam, not a domain-owned provider abstraction.

IS-20 never imports provider SDKs, `fetch`, provider registry JSON or provider-native response objects.

---

## 21. Enrichment Output Contract

IS-20 requests a bounded output contract appropriate to the document operation, preferably structured section/proposal data when that materially improves validation.

Provider text is proposed content. IS-10 schema validity proves only capability-level contract validity.

IS-20 checks:

- requested section/content purpose;
- required baseline invariants;
- known project-fact consistency;
- prohibited secret/disclosure artifacts;
- output size/format constraints;
- document-type policy.

Invalid enrichment is rejected while retaining the deterministic baseline when enrichment is optional.

---

## 22. Contradictory Generated Claims

Reliable managed-project facts outrank generated claims.

When generated enrichment contradicts an accepted project fact, IS-20 rejects or omits the contradictory proposal rather than rewriting the authoritative fact.

Ambiguous evidence remains ambiguous; IS-20 does not invent certainty merely to make prose smoother.

---

## 23. Creation Ordering

The preferred Version 1 flow is:

```text
resolve type/target/current state
 -> render and validate deterministic baseline
 -> construct optional enrichment request
 -> obtain/validate enrichment when requested
 -> produce final proposed document content
 -> authorize complete local write effect
 -> IS-4 no-overwrite create
 -> verify resulting target/revision/content postconditions
 -> AI-domain acceptance
```

This avoids writing a baseline merely to overwrite it immediately after enrichment.

Where implementation constraints require baseline persistence before optional enrichment, the two effects must be reported separately and failure of enrichment must preserve/report the valid baseline. No false atomicity is claimed.

---

## 24. Existing-Target Protection

`ai.instruction.create` requires target absence immediately before write and uses IS-4 no-overwrite/revision preconditions.

If the target exists, create returns conflict/already-present evidence. It never silently overwrites because an adapter selected “yes”, a provider returned content or a generic `force` flag is present.

---

## 25. Explicit Replacement

If exposed, `ai.instruction.replace` is a separate consequential use case.

It requires:

- registered supported document type;
- exact present target;
- fresh revision evidence;
- explicit replacement authorization;
- complete proposed replacement content;
- IS-8 transformation plan preserving any required document invariants;
- postcondition verification.

Replacement cannot be smuggled through `create` and does not apply to heuristically observed unregistered documents.

---

## 26. Deletion

`ai.instruction.delete` resolves one registered supported document type and exact eligible present target.

Deletion requires authorization/confirmation coverage before IS-4 delete.

An already-absent target may return already-satisfied/no-op.

Deletion removes only the selected document. It does not delete templates, provider configuration, credentials, generated downstream resources or other instruction documents.

Unregistered AI-looking documents are not deletable through this use case in Version 1.

---

## 27. Stale-State Protection

Creation binds to target-absence evidence; replacement/deletion bind to target revision/presence evidence.

Before consequential execution, IS-20 verifies the authorized assumptions still hold. A changed/disappeared/appeared target produces stale/conflict/no-op evidence as appropriate.

No blind retry or silent reauthorization follows stale state.

---

## 28. Provider Availability versus Domain Availability

The domain use case distinguishes:

- unknown/unsupported AI-domain intent;
- unsupported document type;
- baseline unavailable;
- optional enrichment unavailable;
- required enrichment unavailable;
- configured provider unavailable;
- provider execution failure.

Optional AI unavailability does not make deterministic baseline creation unavailable.

Provider-associated document presence never implies provider availability.

---

## 29. Provider Selection

When enrichment is requested, IS-20 supplies semantic requirements and any explicit invocation preference allowed by effective policy. IS-10 resolves provider/model deterministically under IS-3 configuration.

IS-20 never chooses the first registry record, reads `API_MODEL_DEFAULT`, lowercases provider IDs as fallback, or silently switches providers after failure.

---

## 30. Provider Failure and Fallback

For optional enrichment, provider resolution/transport/rate-limit/timeout/schema/provider failure produces enrichment evidence and preserves the valid baseline.

For required enrichment, failure prevents claiming the required content contract was satisfied.

There is no hidden retry, provider fallback or model substitution in IS-20. Any future retry/fallback must be explicit policy coordinated with IS-10.

---

## 31. Partial Effects

```ts
export interface AiDocumentEffectResult {
  readonly effect: AiDocumentEffectIdentity;
  readonly state: 'applied' | 'unchanged' | 'failed' | 'cancelled' | 'indeterminate' | 'not_attempted';
  readonly evidence: readonly AiDomainEvidenceReference[];
}
```

If a baseline was persisted and optional enrichment later fails, baseline creation remains a completed effect. IS-20 reports enrichment failure separately.

No rollback is invented for provider calls or completed local writes.

---

## 32. Cancellation

Cancellation propagates from IS-1 through IS-10/IS-4/IS-8 where supported.

IS-20 stops future work as soon as safely practical and reports already completed local effects/provider evidence.

Cancellation before persistence leaves no intended local write. Cancellation after a completed write does not pretend that write was undone.

---

## 33. Concurrency

Conflict keys are target-relative:

```text
ai-document:<project-id>:<document-type-id>:<target-id>
```

Independent document targets may be processed concurrently. Consequential operations against the same target are coordinated/rejected according to IS-1/revision policy.

No global AI-domain or provider mutex is introduced.

---

## 34. Retry

IS-20 performs no hidden retry after provider failure, stale target, cancellation, invalid enrichment or indeterminate effect.

A deliberate retry reacquires project/target/configuration state and rebuilds context/proposal/effect authorization as necessary.

Provider retries, if ever approved, remain explicit IS-10 policy/evidence and cannot conceal multiple disclosures/costs.

---

## 35. Privacy and Trust

AI instruction documents and project source may contain adversarial or untrusted instructions. Their content is context data, not control-plane policy.

IS-20 therefore:

- keeps governing instructions separate from project context;
- uses only bounded approved context;
- preserves provenance/trust classification;
- excludes secrets by default;
- never treats generated text as authorization;
- never executes generated commands/tools/actions;
- never expands scope because text requests it;
- never allows document content to select provider/model outside policy.

---

## 36. Path Safety

All project targets are IS-2/IS-4 bounded references. Document-type target rules resolve inside approved managed scope.

Symlink/containment behavior follows IS-4 policy.

Provider/model output cannot contain an authoritative output path. A generated filename/path suggestion is inert text unless a future explicit use case validates it independently.

---

## 37. Plain-Document Semantics

Instruction documents are treated according to their actual format/class. Markdown/plain-text instruction documents do not receive AppManager source-code headers merely because TypeScript source files do.

Document-class validation may enforce required semantic sections/markers but avoids imposing source-code conventions unrelated to the resource.

---

## 38. AI-Domain Acceptance

Acceptance is operation-specific:

- list: supported types/presence/observations were represented truthfully without mutation;
- create: exact supported type/target was absent, valid proposed content was produced, authorized write occurred and postconditions hold;
- replace: exact registered target/revision was explicitly authorized and accepted transformed content/postconditions hold;
- delete: exact registered eligible target was removed or validly already absent under policy;
- optional enrichment: provider evidence is subordinate and failure does not invalidate a valid baseline unless enrichment was required.

IS-10 completion, IS-9 rendering or IS-4/IS-8 technical completion alone never establishes AI-domain acceptance. IS-1 retains final application acceptance.

---

## 39. Domain Result

```ts
export interface AiDomainPayload {
  readonly operation: AiDomainOperationId;
  readonly documentType?: InstructionDocumentTypeId;
  readonly target?: InstructionDocumentTargetIdentity;
  readonly presence?: InstructionDocumentPresence;
  readonly baseline?: BaselineGenerationState;
  readonly enrichment?: EnrichmentState;
  readonly providerProvenance?: AiProviderProvenanceReference;
  readonly effects: readonly AiDocumentEffectResult[];
  readonly noOp?: AiDomainNoOpReason;
  readonly diagnostics: readonly AiDomainDiagnostic[];
  readonly recovery?: AiDomainRecoveryPosition;
}
```

The payload contains no competing generic `success` Boolean.

---

## 40. Recovery

```ts
export interface AiDomainRecoveryPosition {
  readonly completedEffects: readonly AiDocumentEffectIdentity[];
  readonly currentTargetKnown: boolean;
  readonly baselineAvailable: boolean;
  readonly enrichmentState?: EnrichmentState;
  readonly revalidation: readonly AiDomainRevalidationRequirement[];
  readonly dispositions: readonly ('retry' | 'keep_baseline' | 'reconcile' | 'manual_intervention')[];
}
```

Recovery is informational. Version 1 has no generic transaction rollback or autonomous resume agent.

---

## 41. Diagnostics

Initial stable codes include:

```text
AI_OPERATION_UNAVAILABLE
AI_DOCUMENT_TYPE_REQUIRED
AI_DOCUMENT_TYPE_UNKNOWN
AI_DOCUMENT_TYPE_UNSUPPORTED
AI_TARGET_AMBIGUOUS
AI_TARGET_OUTSIDE_SCOPE
AI_TARGET_ALREADY_EXISTS
AI_TARGET_NOT_FOUND
AI_TARGET_NOT_ELIGIBLE
AI_TARGET_STALE
AI_UNREGISTERED_DOCUMENT_INFORMATIONAL
AI_UNREGISTERED_DOCUMENT_NOT_MUTABLE
AI_BASELINE_UNAVAILABLE
AI_BASELINE_INVALID
AI_PROJECT_FACT_AMBIGUOUS
AI_PROJECT_FACT_CONTRADICTION
AI_ENRICHMENT_UNSUPPORTED
AI_ENRICHMENT_UNAVAILABLE
AI_ENRICHMENT_REQUIRED_UNAVAILABLE
AI_ENRICHMENT_REJECTED
AI_PROVIDER_UNAVAILABLE
AI_PROVIDER_FAILED
AI_PROVIDER_OUTPUT_INVALID
AI_DISCLOSURE_REFUSED
AI_SENSITIVE_CONTEXT_EXCLUDED
AI_REPLACEMENT_NOT_AUTHORIZED
AI_DELETE_NOT_AUTHORIZED
AI_PARTIAL_EFFECT
AI_EFFECT_INDETERMINATE
AI_CANCELLED
AI_RECOVERY_REVALIDATION_REQUIRED
```

Provider-native messages may be retained as protected evidence but are normalized before normal domain diagnostics. Credentials/project-sensitive context are omitted.

---

## 42. Headless and Interaction Semantics

Headless callers provide/deterministically resolve operation, document type, enrichment mode and required authorization. Missing/ambiguous input fails safely without prompting or guessing.

IS-22 may present supported document menus, enrichment consent and delete/replace confirmation but maps those choices to the same canonical use cases.

No IS-20 module imports prompt libraries, terminal colours, spinners or IDE APIs.

---

## 43. Events and Observability

Semantic events may include:

```text
ai.document.target.resolved
ai.document.baseline.ready
ai.document.enrichment.started
ai.document.enrichment.completed
ai.document.enrichment.rejected
ai.document.plan.ready
ai.document.effect.started
ai.document.effect.applied
ai.document.effect.failed
ai.document.operation.unchanged
ai.document.operation.partial
ai.document.recovery.available
```

Events expose safe semantic identities/state/provenance references, not prompts, secret context, credentials or raw provider payloads by default.

---

## 44. Git Domain Relationship

AI-assisted commit-message generation remains IS-15 Git-owned because Git intent is primary. IS-15 may consume IS-10 directly under its own policy.

IS-20 is not a mandatory intermediary and cannot reinterpret Git acceptance merely because AI was used.

---

## 45. Docs Domain Relationship

AI-assisted documentation drafting/summarization remains IS-17 Docs-owned. Docs may consume IS-10 directly under Docs context/acceptance policy.

An AI instruction document is AI-domain-owned because its primary resource purpose is AI/tool instruction, even when its format is Markdown.

---

## 46. Nuxt and Quality Relationships

AI-assisted Nuxt generation remains IS-16-owned; AI-assisted quality explanation/triage remains IS-18-owned.

IS-20 neither absorbs those intents nor provides a generic “AI workflow” wrapper around them.

---

## 47. Settings Relationship

IS-19 may list/add/delete declarative AI-document template resources when template-resource management itself is the primary intent.

Applying a selected template to create/replace/delete a project AI instruction document uses IS-20 semantics.

Template registration never grants IS-20 execution/mutation authority by itself.

---

## 48. Composition

IS-23 constructs:

1. immutable instruction-document type definitions;
2. instruction-document type catalogue;
3. recognition/observation components;
4. target resolver;
5. project-fact projector;
6. baseline planner/validator;
7. enrichment planner/context/acceptance components;
8. injected IS-4/IS-7/IS-8/IS-9/IS-10 collaborators;
9. effect runner/acceptance/recovery components;
10. four canonical AI-domain use cases, with replace registered only if product exposure is retained;
11. immutable AI-domain use-case catalogue;
12. IS-1 registrations.

No import-time AI-domain singleton, mutable active provider/model, direct `process.env`, provider registry import, `fetch`, cwd authority or service locator exists.

---

## 49. Testing Requirements

Core tests cover at least:

1. canonical list/create/delete identities;
2. replace identity separately exposed/disabled by policy;
3. primary-intent ownership;
4. Git AI assistance does not route through IS-20;
5. Docs AI assistance does not route through IS-20;
6. Nuxt AI assistance does not route through IS-20;
7. Quality AI assistance does not route through IS-20;
8. Settings template CRUD does not route through IS-20;
9. IS-1 invocation seam;
10. IS-2 managed scope required;
11. no cwd-derived authority;
12. IS-3 effective AI policy consumed;
13. no direct process.env;
14. semantic type independent of filename;
15. provider association is metadata only;
16. provider-associated type does not imply provider availability;
17. examples non-exclusive;
18. catalogue immutable;
19. list non-mutating;
20. supported absent state;
21. supported present state;
22. ambiguous state retained;
23. unregistered observation informational;
24. weak filename heuristic not promoted to identity;
25. discovery grants no mutation authority;
26. machine-consumable listing;
27. exact target resolved before generation;
28. arbitrary caller path rejected;
29. provider output cannot choose target;
30. deterministic baseline without provider;
31. IS-9 render proposed only;
32. project facts from approved evidence;
33. source evidence not automatically context;
34. sensitive fact excluded;
35. baseline non-empty/format validation;
36. baseline contradiction rejected;
37. no source-code header imposed on plain document;
38. enrichment forbid makes no IS-10 call;
39. optional enrichment unavailable preserves baseline;
40. optional provider failure preserves baseline;
41. required enrichment unavailable fails according to policy;
42. caller cannot silently promote optional provider dependency;
43. bounded enrichment context;
44. context provenance retained;
45. context trust retained;
46. secrets excluded from provider context;
47. provider-associated doc does not select provider;
48. IS-10 resolves provider/model;
49. no first-registry selection;
50. no lowercase fallback;
51. no hidden provider fallback;
52. no hidden retry;
53. provider response remains proposed;
54. IS-10 schema validity not domain acceptance;
55. invalid enrichment rejected;
56. known project-fact contradiction rejected;
57. ambiguous project fact not invented;
58. create protects existing target;
59. generic force cannot overwrite;
60. create uses IS-4 no-overwrite;
61. replace is separate from create;
62. replace requires registered target;
63. replace requires revision/authorization;
64. replace routes existing source through IS-8;
65. unregistered candidate cannot be replaced;
66. delete exact registered target;
67. delete authorization required;
68. delete absent target no-op;
69. delete does not cascade;
70. unregistered candidate cannot be deleted;
71. creation stale appearance blocks write;
72. replacement stale revision blocks write;
73. deletion changed target blocks stale delete;
74. no blind stale retry;
75. provider unavailable distinct from domain unsupported;
76. optional availability distinct from baseline availability;
77. provider failure normalized;
78. provider metadata subordinate;
79. baseline + enrichment effects individually attributable;
80. completed baseline survives enrichment failure;
81. no false atomicity;
82. cancellation before write leaves no local effect;
83. cancellation after write preserves completed effect;
84. cancellation is not rollback;
85. independent targets concurrent;
86. same-target conflict coordinated;
87. no global AI mutex;
88. deliberate retry revalidates context/target;
89. untrusted project text cannot alter policy;
90. generated commands never execute;
91. generated text cannot expand scope;
92. generated text cannot authorize mutation;
93. path containment enforced;
94. symlink policy delegated IS-4;
95. operation-specific acceptance;
96. IS-10 completion insufficient for acceptance;
97. IS-9 render insufficient for acceptance;
98. IS-4/8 technical completion insufficient for acceptance;
99. no competing success Boolean;
100. recovery informational only;
101. no autonomous resume/rollback agent;
102. Headless missing type fails safely;
103. Headless no prompt dependency;
104. interactive adapter semantic equivalence;
105. events exclude secret/raw provider content;
106. diagnostics normalized/redacted;
107. no provider SDK/fetch in domain;
108. no active-provider singleton;
109. IS-23 explicit composition;
110. capability/provider substitution preserves domain policy;
111. provider failure cannot mutate target directly;
112. final acceptance remains IS-1-owned.

Integration tests use controlled IS-4/IS-7/IS-8/IS-9/IS-10 substitutes and fixtures for supported/absent/present/ambiguous/unregistered documents, deterministic baselines, provider availability/failure/invalid output, disclosure refusal, contradictory facts, target races, partial effects, cancellation and Headless ambiguity.

---

## 50. Current Implementation Disposition

| Current artefact/responsibility | Disposition | Version 1 treatment |
|---|---|---|
| absent `app/commands/ai/` surface | **ADD** | Add IS-22 adapter registrations for canonical AI-domain use cases rather than provider/chat commands. |
| `app/services/llmService.ts` provider transport/request handling | **RELOCATE / REPLACE by IS-10 seam** | Provider mechanics belong to AI Capability, never AI Domain. |
| `llmService` unified `chat`/`generate` interface | **SPLIT / REPLACE** | Domain consumes structured IS-10 availability/resolve/execute contracts; no generic domain chat primitive. |
| `llmService` mutable `activeConfig` | **REPLACE** | Deterministic per-request IS-10 resolution from IS-3 policy; no global active provider. |
| `llmService` direct `llmRegistry.json` import | **RELOCATE / ADAPT under IS-10/IS-23** | Registry is migration evidence/provider catalogue input, not AI-domain authority. |
| `llmService.initializeDefault()` `API_MODEL_DEFAULT` read | **REPLACE** | IS-3 supplies effective provider/model policy; domain never reads ambient env. |
| `llmService.checkAvailability()` API-key env inspection | **RELOCATE / REPLACE by IS-10** | Credential/provider availability remains capability-owned and normalized. |
| `llmService.configure()` registry-order/manual provider state | **REPLACE** | IS-10 deterministic resolution; ambiguity/unavailability explicit. |
| `llmService.sanitizeContext()` head/tail truncation | **ADAPT only as optional IS-10 compatibility mechanic** | Not an AI-domain context-selection or universal safety policy. |
| `llmService` OpenAI-style `/chat/completions` request | **RELOCATE / REPLACE by provider adapters** | No assumption that all providers share OpenAI protocol. |
| `llmService` `jsonMode` request flag | **ADAPT under IS-10 output contracts** | Provider-native JSON mode is optional adapter mechanism, not domain guarantee. |
| `llmService` timeout `AbortController` | **RETAIN / ADAPT under IS-10** | Integrate caller cancellation and configured timeout; normalize timeout evidence. |
| `llmService` provider-specific response paths | **RELOCATE** | Provider adapter implementation only; never crosses IS-10 boundary. |
| `llmService` usage default `0` when absent | **REPLACE** | Missing usage remains unknown; domain does not infer zero cost/tokens. |
| `llmService` logger calls/raw error strings | **RELOCATE / ADAPT** | IS-10 normalizes protected evidence; IS-20 emits safe domain diagnostics/events. |
| `llmService` exported singleton | **REPLACE** | IS-23 explicit composition; no global mutable AI/provider state. |
| current absence of AI instruction-document orchestration | **ADD** | Implement IS-20 catalogue/list/create/replace/delete semantics. |
| declarative AI templates/resources | **RETAIN / ADAPT through IS-9** | Preserve approved content/identity while keeping rendering proposed-only. |
| future direct provider write/tool execution | **REJECT** | Provider output never directly mutates/executes. |
| future autonomous coding-agent wrapper in AI domain | **REJECT for Version 1** | Outside approved product scope. |
| prompts/colors/provider selection UI in domain | **RELOCATE** | IS-22 presentation only. |

The current implementation therefore contains useful provider transport mechanics but no conforming AI-domain application layer. IS-20 adds that layer without promoting `llmService` into domain authority.

---

## 51. Migration Sequence

1. add AI-domain contracts and semantic operation IDs;
2. add immutable instruction-document type definitions/catalogue;
3. add bounded recognition and unregistered-observation interpretation over IS-7;
4. add target resolver consuming IS-2 scope;
5. add deterministic project-fact projection;
6. add IS-9 baseline planning/rendering seam;
7. add baseline content validation;
8. add enrichment mode/policy model;
9. add bounded context builder with provenance/trust/sensitivity;
10. replace domain/provider access with IS-10 availability/resolve/execute;
11. implement enrichment acceptance and contradiction handling;
12. implement `ai.instruction.list`;
13. implement protected `ai.instruction.create`;
14. implement explicit `ai.instruction.replace` only if retained in product exposure;
15. implement exact eligible `ai.instruction.delete`;
16. implement stale target/revision checks;
17. implement partial-effect/recovery semantics;
18. implement cancellation/concurrency/retry behavior;
19. remove AI-domain dependency on `llmService`, provider registry, `process.env` and provider-native errors;
20. migrate legacy provider mechanics behind IS-10 adapters/composition as specified by IS-10;
21. add IS-22 adapter registrations;
22. add IS-23 composition/IS-1 registration;
23. run primary-intent, baseline, disclosure, provider-independence, target-safety, partial-effect and Headless conformance suites.

---

## 52. Traceability

| Implementation concern | Governing authority |
|---|---|
| primary-intent/domain boundary | DD-AI-001–005; FR-AI-001–005 |
| invocation/context/config/cancellation | DD-AI-006–010; FR-AI-006–016 |
| shared capability composition | DD-AI-011–016; DD-2.1/2.4/2.5/2.6/2.7 |
| instruction-document identity | DD-AI-017–021; FR-AI-017–025 |
| listing/unregistered observation | DD-AI-023–026; FR-AI-026–035 |
| creation/baseline/target protection | DD-AI-022, DD-AI-027 onward creation design; FR-AI-036–050 |
| optional enrichment | DD-4.3 enrichment design; FR-AI-051–062; IS-10 |
| deletion | DD-4.3 deletion design; FR-AI-063–071 |
| cross-domain AI use | DD-AI-004 and cross-domain sections; FR-AI-072–079 |
| provider/model semantics | DD-AI-002/015 and provider sections; FR-AI-080–087; IS-10 |
| safety/privacy/trust | DD-4.3 safety/privacy sections; FR-AI-088–096; IS-10 |
| results/failures | DD-4.3 result/failure sections; FR-AI-097–105 |
| managed scope | DD-1.3; IS-2 |
| effective configuration | DD-1.4; IS-3 |
| resource creation/deletion | DD-2.1; IS-4 |
| existing-source replacement | DD-2.5; IS-8 |
| registry/template rendering | DD-2.6; IS-9 |
| provider execution | DD-2.7; IS-10 |
| final application acceptance | DD-1.5/DD-1.2; IS-1 |

---

## 53. Version 1 Non-Drift Baseline

```text
IS-22 adapter / Headless caller / owning domain
                |
                v
        IS-1 invocation/authority
                |
                +--> IS-2 managed project/scope
                +--> IS-3 effective AI policy
                |
                v
            IS-20 AI Domain
                |
                +--> document-type/target policy
                +--> deterministic baseline/fact acceptance
                +--> enrichment decision/context selection
                +--> replacement/deletion eligibility
                +--> domain acceptance/recovery
                |
                +--> IS-7 recognition evidence
                +--> IS-9 declarative baseline rendering
                +--> IS-10 optional provider-independent enrichment
                +--> IS-4 new-resource/delete mechanics
                +--> IS-8 explicit existing-resource replacement
                |
                v
          IS-20 AI-domain acceptance
                |
                v
          IS-1 final acceptance
                |
                v
        canonical AppManager outcome
```

The non-drift rule is:

> **Version 1 AI Domain owns AI instruction-document intent, semantic document-type and target policy, deterministic baseline composition, optional enrichment policy/context selection, existing-target protection, explicit replacement/deletion eligibility and AI-domain acceptance. It never becomes the owner of another domain merely because that domain uses AI, treats a filename or provider association as provider availability, crawls the project for context, guesses project facts, discloses secrets by default, lets project/generated text change control-plane policy, requires optional AI when a valid baseline exists, silently retries/falls back providers, lets provider output choose paths or mutate/execute directly, overwrites through create, mutates heuristically observed unregistered documents, invents transactional rollback, promotes `llmService`/provider-native semantics into domain contracts, or publishes a competing final AppManager outcome.**