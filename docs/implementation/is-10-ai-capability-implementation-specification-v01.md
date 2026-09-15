# IS-10 — AI Capability Implementation Specification

> **Document type:** Level 4 Implementation Specification
>
> **Status:** Version 1 implementation baseline
>
> **Implementation ID:** IS-10
>
> **Primary Detailed Design:** [DD-2.7 — AI Capability](../dd_2_shared_capabilities/dd-2-7-ai-capability-detailed-design-v01.md)
>
> **Related Detailed Designs:** [DD-1.1 — Application Invocation](../dd_1_application_core/dd-1-1-application-invocation-detailed-design-v01.md), [DD-1.2 — Execution Outcomes](../dd_1_application_core/dd-1-2-execution-outcomes-detailed-design-v01.md), [DD-1.3 — Managed Project](../dd_1_application_core/dd-1-3-managed-project-detailed-design-v01.md), [DD-1.4 — Configuration Resolution](../dd_1_application_core/dd-1-4-configuration-resolution-detailed-design-v01.md), [DD-1.5 — Application Engine](../dd_1_application_core/dd-1-5-application-engine-detailed-design-v01.md), [DD-2.1 — Resource Access](../dd_2_shared_capabilities/dd-2-1-resource-access-detailed-design-v01.md), [DD-2.2 — Process Execution](../dd_2_shared_capabilities/dd-2-2-process-execution-detailed-design-v01.md), [DD-2.4 — Source Intelligence](../dd_2_shared_capabilities/dd-2-4-source-intelligence-detailed-design-v01.md), [DD-2.5 — Source Transformation](../dd_2_shared_capabilities/dd-2-5-source-transformation-detailed-design-v01.md), [DD-2.6 — Resource Registry and Template](../dd_2_shared_capabilities/dd-2-6-resource-registry-and-template-detailed-design-v01.md)
>
> **Primary Functional authority:** [AI Functional Specification](../functional/ai-functional-specification-v01.md), especially `FR-AI-080`–`FR-AI-105` together with delegated-AI requirements throughout the specification
>
> **Related implementations:** [IS-1 — Application Runtime and Invocation](is-1-application-runtime-and-invocation-implementation-specification-v01.md), [IS-2 — Managed Project Resolution](is-2-managed-project-resolution-implementation-specification-v01.md), [IS-3 — Configuration Resolution](is-3-configuration-resolution-implementation-specification-v01.md), [IS-4 — Resource Access](is-4-resource-access-implementation-specification-v01.md), [IS-5 — Process Execution](is-5-process-execution-implementation-specification-v01.md), [IS-7 — Source Intelligence](is-7-source-intelligence-implementation-specification-v01.md), [IS-8 — Source Transformation](is-8-source-transformation-implementation-specification-v01.md), [IS-9 — Resource Registry and Template](is-9-resource-registry-and-template-implementation-specification-v01.md), [IS-23 — Build and Runtime Assembly](is-23-build-and-runtime-assembly-implementation-specification-v01.md)
>
> **Runtime decision:** [ADR-0001 — Primary Application Runtime](../project_management/decisions/adr-0001-primary-application-runtime.md)
>
> **Register:** [AppManager Implementation Specification](implementation-specification-v01.md)
>
> **Governing plan:** [Implementation Specification Plan](../project_management/implementation-specification-plan-v01.md)

## 1. Purpose

IS-10 defines the concrete Node.js/TypeScript implementation of AppManager's shared AI Capability.

The capability accepts an already-authorized bounded AI task, already-resolved effective provider policy, explicitly selected context and an output contract; it resolves a compatible provider/model, applies disclosure/context controls, delegates technical generation to a provider adapter, validates and normalizes the response, and returns proposal/evidence to the owning use case.

The governing implementation rules are:

> **AI execution never transfers application authority.**

> **AI output remains proposal/evidence until the owning use case accepts it.**

> **Project content is untrusted data unless the owning use case explicitly supplies it as approved task instruction.**

> **Provider capability, availability, successful transport and valid structured output are distinct facts.**

> **Version 1 is a bounded AI-provider capability, not an autonomous agent or tool-execution framework.**

---

## 2. Scope and Non-Ownership

IS-10 owns concrete implementation for:

- AI provider/model catalogue and capability descriptors;
- provider/model availability evidence;
- deterministic provider/model resolution under supplied constraints;
- normalized AI task requests;
- bounded context items and context manifests;
- disclosure, sensitivity and trust validation;
- deterministic context reduction under explicit task policy;
- provider-independent request construction;
- provider adapter invocation;
- provider response normalization;
- free-text and structured output contracts;
- JSON/schema parsing and validation;
- normalized provider failures;
- timeout and cancellation propagation;
- retryability and fallback-eligibility evidence;
- optional usage/provenance evidence;
- provider-independent fake-provider testing;
- migration of conforming current `llmService` mechanics.

IS-10 does **not** own:

- AI-domain application intent or AI instruction-document CRUD — IS-20;
- Git commit workflow semantics — IS-15;
- Docs/Nuxt/Quality/Settings application semantics — their owning domain IS;
- application invocation, final outcome or continuation policy — IS-1/owning use case;
- managed-project identity/scope — IS-2;
- configuration precedence or credential-source resolution — IS-3;
- generic filesystem/process/repository mutation — IS-4/IS-5/IS-6;
- Source Intelligence recognition — IS-7;
- Source Transformation execution — IS-8;
- registry/template identity or rendering — IS-9;
- automatic execution of provider-generated commands/tools/functions;
- general web browsing, arbitrary URL retrieval or autonomous resource discovery;
- application retry/fallback policy;
- application budget/spending authority;
- factual/domain correctness of generated content.

---

## 3. Concrete Module Boundary

The target Version 1 layout is:

```text
app/
└── capabilities/
    └── ai/
        ├── ai-capability.ts
        ├── contracts/
        │   ├── ai-identity.ts
        │   ├── ai-provider.ts
        │   ├── ai-availability.ts
        │   ├── ai-selection.ts
        │   ├── ai-request.ts
        │   ├── ai-context.ts
        │   ├── ai-output-contract.ts
        │   ├── ai-result.ts
        │   ├── ai-failure.ts
        │   └── ai-usage.ts
        ├── catalogue/
        │   └── ai-provider-catalogue.ts
        ├── selection/
        │   └── provider-model-resolver.ts
        ├── context/
        │   ├── context-validator.ts
        │   ├── context-reducer.ts
        │   └── disclosure-evaluator.ts
        ├── request/
        │   └── provider-request-builder.ts
        ├── response/
        │   ├── response-normalizer.ts
        │   └── structured-output-validator.ts
        ├── providers/
        │   ├── ai-provider-adapter.ts
        │   └── openai-compatible-http-provider.ts
        └── diagnostics/
            └── ai-diagnostics.ts
```

Provider-specific files may be split further when their protocols genuinely differ. The directory structure shall not imply that all providers are OpenAI-compatible.

Contracts remain capability-local even when several domains consume them. `app/types/` is not their semantic owner.

---

## 4. Public AI Capability Contract

The public boundary shall be structurally equivalent to:

```ts
export interface AiCapability {
  availability(request: AiAvailabilityRequest): Promise<AiAvailabilityResult>;
  resolve(request: AiSelectionRequest): Promise<AiSelectionResult>;
  execute(request: AiExecutionRequest): Promise<AiExecutionResult>;
}
```

`availability()` returns evidence and performs only probes explicitly allowed by the request/effective policy.

`resolve()` is deterministic and non-interactive. It returns one eligible selection, ambiguity, unsupported/unavailable evidence or failure.

`execute()` performs one bounded provider attempt against an explicit resolved selection. It does not silently retry or select a fallback provider.

A higher-level internal convenience method may combine `resolve()` and `execute()` only when it preserves all intermediate evidence and cannot hide fallback/retry decisions.

---

## 5. Provider and Model Identity

Stable semantic identities are AppManager-owned:

```ts
export type AiProviderId = string & { readonly __aiProviderId: unique symbol };
export type AiModelId = string & { readonly __aiModelId: unique symbol };

export interface AiProviderModelIdentity {
  readonly provider: AiProviderId;
  readonly model: AiModelId;
}
```

Provider-native model strings are adapter configuration/evidence. They may equal the AppManager model ID initially, but callers shall not depend on that coincidence.

Human labels are presentation metadata, not identity.

Identity matching is exact after normalization explicitly defined by the catalogue. The current fallback from an invalid provider ID to `toLowerCase()` is not preserved as implicit resolution policy; aliases/case normalization must be declared deliberately.

---

## 6. Provider Catalogue

IS-23 explicitly constructs an immutable catalogue:

```ts
export interface AiProviderDescriptor {
  readonly id: AiProviderId;
  readonly label: string;
  readonly disclosure: 'local' | 'external';
  readonly credentialRequirement: AiCredentialRequirement;
  readonly models: readonly AiModelDescriptor[];
  readonly adapter: AiProviderAdapterId;
}

export interface AiModelDescriptor {
  readonly id: AiModelId;
  readonly providerModelId: string;
  readonly capabilities: ReadonlySet<AiCapabilityClass>;
  readonly contextLimit?: number;
  readonly outputLimit?: number;
  readonly structuredOutput: AiStructuredOutputSupport;
}
```

Duplicate provider/model identities fail composition validation. Catalogue order has no selection semantics.

The catalogue contains provider/model capability metadata, not application configuration precedence and not credentials.

---

## 7. Current `llmRegistry.json` Disposition

`config/llmRegistry.json` is useful migration evidence but is not retained unchanged as the permanent provider contract.

Useful concepts to adapt include:

- provider IDs and labels;
- provider-specific model identifiers;
- base endpoint configuration;
- timeout hints where they represent provider constraints rather than application policy;
- response extraction/mapping evidence for the current compatible adapter;
- local-provider distinction represented by Ollama;
- provider registry as data rather than hard-coded switch statements.

The following are not promoted:

- `apiKeyEnv` as credential-resolution authority;
- `type: openai-compatible` as proof that all provider semantics are interchangeable;
- one `mapping.content`/`mapping.tokens` path strategy as the universal response contract;
- current model/version choices as permanent Version 1 product defaults;
- null timeout as hidden infinite-timeout policy;
- registry array order as fallback/selection order;
- provider base URLs as application-visible identity.

Before implementation use, every current provider record must be verified against the concrete adapter actually used. A provider shall not be declared compatible merely because the current registry labels it `openai-compatible`.

---

## 8. Effective Configuration Inputs

IS-10 receives configuration already resolved by IS-3. It does not read `process.env`, `.env`, Settings resources or registry defaults directly.

Relevant effective concerns may include:

- preferred/explicit provider;
- preferred/explicit model;
- permitted provider/model set;
- local-only/external-provider policy;
- credential handle/reference;
- provider endpoint override where permitted;
- request timeout;
- maximum context/output budget;
- permitted fallback candidates;
- disclosure policy;
- provider-specific bounded generation options;
- cost/usage constraints where Version 1 implements them.

Credentials are supplied as protected values/handles under IS-3 semantics. Provider adapters receive credential material only at the narrow execution boundary.

`API_MODEL_DEFAULT` and `API_KEY_*` remain possible environment **candidate sources** through IS-3 during migration; they are not read by IS-10 itself.

---

## 9. Provider/Model Selection Request

```ts
export interface AiSelectionRequest {
  readonly requiredCapabilities: ReadonlySet<AiCapabilityClass>;
  readonly explicit?: Partial<AiProviderModelIdentity>;
  readonly permitted?: readonly AiProviderModelIdentity[];
  readonly disclosure: AiDisclosureConstraint;
  readonly minimumContextCapacity?: number;
  readonly minimumOutputCapacity?: number;
  readonly structuredOutput?: AiStructuredOutputRequirement;
  readonly effectivePolicy: AiEffectiveSelectionPolicy;
  readonly availabilityEvidence?: AiAvailabilitySnapshot;
}
```

Selection filters by policy and required capability before applying deterministic preference.

An explicit provider/model remains subject to policy/capability/availability validation.

If multiple candidates remain with equal governing preference, return `ambiguous`; never choose first registry record.

No TUI prompt exists inside IS-10. IS-1/IS-22 may collect a user choice and resubmit an explicit selection.

---

## 10. Selection Result

```ts
export type AiSelectionResult =
  | { readonly state: 'selected'; readonly selection: ResolvedAiSelection; readonly evidence: AiSelectionEvidence }
  | { readonly state: 'ambiguous'; readonly candidates: readonly AiProviderModelIdentity[]; readonly diagnostics: readonly AiDiagnostic[] }
  | { readonly state: 'unsupported'; readonly diagnostics: readonly AiDiagnostic[] }
  | { readonly state: 'unavailable'; readonly diagnostics: readonly AiDiagnostic[] }
  | { readonly state: 'credential_unavailable'; readonly diagnostics: readonly AiDiagnostic[] }
  | { readonly state: 'policy_rejected'; readonly diagnostics: readonly AiDiagnostic[] }
  | { readonly state: 'failed'; readonly diagnostics: readonly AiDiagnostic[] };
```

`ResolvedAiSelection` records the exact provider/model, adapter, disclosure class and material constraints used. It is evidence for the subsequent attempt, not permission to expand context or execute tools.

---

## 11. Availability Model

Availability is request-relative and multi-dimensional:

```ts
export interface AiAvailabilityEvidence {
  readonly identity: AiProviderModelIdentity;
  readonly configured: boolean;
  readonly credential: 'available' | 'missing' | 'inaccessible' | 'not_required' | 'unknown';
  readonly adapter: 'available' | 'unavailable';
  readonly reachability: 'not_checked' | 'reachable' | 'unreachable' | 'unknown';
  readonly capability: 'supported' | 'unsupported' | 'unknown';
  readonly observedAt: string;
  readonly diagnostics: readonly AiDiagnostic[];
}
```

Possession of a credential reference is not reachability/authentication/model availability.

Local providers may require a reachability check even when no credential exists.

External probes are opt-in through `AiAvailabilityRequest.probePolicy`; ordinary catalogue/list operations shall not contact providers invisibly.

Probe results are bounded snapshots and may become stale.

---

## 12. AI Task Request

```ts
export interface AiExecutionRequest {
  readonly requestId: string;
  readonly invocationId: string;
  readonly owner: AiOwningUseCase;
  readonly task: AiTaskIntent;
  readonly selection: ResolvedAiSelection;
  readonly instruction: AiTaskInstruction;
  readonly context: AiContextManifest;
  readonly output: AiOutputContract;
  readonly constraints: AiGenerationConstraints;
  readonly disclosure: AiDisclosurePolicy;
  readonly timeoutMs: number;
  readonly signal?: AbortSignal;
  readonly correlation?: AiCorrelationMetadata;
}
```

The request contains enough bounded semantic intent for generation but does not contain an AppManager command dispatcher or mutation capability.

`AiTaskIntent` is an extensible discriminated application-capability task classification such as `commit_message_proposal`, `documentation_summary`, `instruction_document_enrichment`, `quality_explanation` or `bounded_content_proposal`. Adding a task does not transfer ownership from the calling domain.

---

## 13. Instruction versus Context

`AiTaskInstruction` is created from AppManager/owning-use-case policy and optional validated IS-9 template output.

Project-supplied text belongs in context unless the owning use case has explicitly approved a specific project resource as instruction material for the bounded task.

The normalized request shall preserve this distinction even if a provider adapter eventually serializes both into provider-specific messages.

Provider role enums such as `system`, `user`, `assistant` remain adapter details. They do not become the AppManager instruction-authority model.

---

## 14. Context Item Contract

```ts
export interface AiContextItem {
  readonly id: string;
  readonly kind: AiContextKind;
  readonly content: AiContextContent;
  readonly provenance: AiContextProvenance;
  readonly project?: ProjectIdentity;
  readonly scope?: ManagedScopeEvidence;
  readonly resource?: ResourceEvidence;
  readonly revision?: string;
  readonly trust: AiContextTrust;
  readonly sensitivity: AiContextSensitivity;
  readonly disclosure: AiContextDisclosureEligibility;
  readonly priority: number;
  readonly reductionPolicy: AiContextReductionPolicy;
}
```

`content` may be text, normalized facts or JSON-compatible structured data. Provider-native objects do not cross into the shared context model.

The owning use case selects items. IS-10 never crawls the project for “helpful” context.

---

## 15. Context Manifest

```ts
export interface AiContextManifest {
  readonly items: readonly AiContextItem[];
  readonly maximumProviderUnits?: number;
  readonly selectionEvidence: AiContextSelectionEvidence;
}
```

The manifest records selected, omitted and reduced items sufficiently to avoid implying that unsubmitted material was considered.

Managed scope is an upper bound. IS-10 validates that each project-associated item carries acceptable scope evidence; it does not derive managed scope itself.

Context order is explicit. Incidental map/filesystem enumeration order shall not influence prompts.

---

## 16. Disclosure Evaluation

Before any external provider request, `DisclosureEvaluator` verifies every context item and instruction component against:

- selected provider disclosure class;
- request disclosure policy;
- item sensitivity;
- item external-disclosure eligibility;
- project/context scope evidence;
- protected/credential classifications;
- any owner-supplied explicit exclusions.

Failure is fail-safe. An item whose eligibility is unknown is not externally disclosed by default.

Known credentials, tokens, passwords and protected values are excluded from ordinary context regardless of provider capacity.

Local provider classification does not bypass sensitivity policy; it only changes the external-disclosure dimension.

---

## 17. Secret and Sensitive-Data Filtering

Version 1 uses two layers:

1. authoritative sensitivity metadata from IS-3/owning capabilities;
2. a bounded defensive redaction detector for obvious credential-shaped content before external submission.

The detector may identify common assignment/header patterns and known configured secret values via non-reversible comparison where practical. It is a defense-in-depth filter, not a complete secret scanner and must not be advertised as proof that arbitrary content contains no secrets.

If required task content is rejected/redacted such that the output contract cannot reasonably be satisfied, return `context_rejected`/`insufficient_context` rather than silently weakening the request.

Redaction events appear in context evidence without exposing the removed value.

---

## 18. Context Reduction

`ContextReducer` operates only under item/task-declared reduction policies.

Supported Version 1 policies should remain simple and deterministic:

```text
none
bounded_excerpt
structural_excerpt
caller_supplied_summary
ordered_drop_low_priority
```

`structural_excerpt` consumes already-supplied IS-7 ranges/facts; IS-10 does not invoke Source Intelligence secretly to discover new content.

`caller_supplied_summary` is already accepted input for this request; IS-10 does not recursively call AI to summarize context unless a separately authorized use case explicitly requests that additional AI operation.

The current first-half/last-half `sanitizeContext()` algorithm may be retained only as an internal `bounded_excerpt` compatibility strategy where the owning task explicitly permits it. It is not the universal policy.

Every reduction records original size, submitted size and reduction kind. Required context that cannot fit under permitted reductions yields `context_limit_exceeded`.

---

## 19. Provider Adapter Contract

```ts
export interface AiProviderAdapter {
  readonly id: AiProviderAdapterId;
  supports(request: AiProviderSupportRequest): AiProviderSupportEvidence;
  probe?(request: AiProviderProbeRequest): Promise<AiProviderProbeResult>;
  execute(request: AiProviderExecutionRequest): Promise<AiProviderExecutionEvidence>;
}
```

Adapters own technical mechanics only:

- credential protocol use;
- provider-native endpoint/request serialization;
- model ID mapping;
- HTTP/SDK/process transport;
- native structured-output mode use;
- response parsing;
- finish/status mapping;
- usage extraction;
- native error capture;
- cancellation propagation.

They do not own selection policy, disclosure policy, retry/fallback policy, managed scope or application acceptance.

---

## 20. Initial HTTP Provider Implementation

Version 1 may retain a direct HTTP adapter using Node's built-in `fetch`, avoiding an unnecessary provider SDK dependency for providers whose verified protocol is sufficiently compatible.

The initial `OpenAiCompatibleHttpProvider` may support a verified subset of providers exposing compatible chat-completion semantics. Its configuration includes endpoint, auth strategy, provider-native model ID, response mapping and provider capability declarations.

Important restrictions:

- compatibility is verified per provider; the catalogue cannot make an incompatible API compatible by labeling it so;
- bearer auth is one auth strategy, not universal;
- `/chat/completions` is adapter-local;
- native `response_format`/JSON mode is adapter-local optimization;
- response-path mapping is adapter-local normalization;
- provider-specific headers/query/auth may require a separate adapter rather than growing arbitrary escape hatches;
- no default endpoint such as `https://api.openai.com/v1` is invented when provider configuration is incomplete.

A provider requiring materially different protocol semantics gets a separate adapter.

---

## 21. Local Provider Implementation

A local model server such as Ollama may use the verified compatible HTTP adapter when its configured endpoint/protocol satisfies the adapter contract.

Local execution remains a provider operation, not a generic Process Execution command unless a future adapter deliberately launches/manages a local process. Merely using a localhost HTTP endpoint does not give IS-10 lifecycle authority over that service.

A local provider can be credential-free. The current `Bearer ollama` fallback is not retained as shared semantics; auth headers are omitted or constructed according to the adapter's configured auth strategy.

---

## 22. Provider Request Construction

`ProviderRequestBuilder` converts the normalized instruction/context/output contract into the selected adapter's internal request.

It must preserve:

- instruction/context origin distinction as far as the provider protocol supports;
- deterministic item ordering;
- explicit reduction/disclosure evidence;
- bounded generation options;
- timeout/cancellation linkage;
- output contract requirements;
- no provider tool/action permissions unless a future approved design explicitly adds them.

Unknown provider options are rejected rather than forwarded blindly.

The shared public request shall not expose arbitrary `Record<string, unknown>` provider bodies as an escape hatch.

---

## 23. Output Contracts

```ts
export type AiOutputContract =
  | { readonly kind: 'text'; readonly minimumLength?: number; readonly maximumLength?: number }
  | { readonly kind: 'json'; readonly schema: AiStructuredSchema; readonly semanticLabel: string }
  | { readonly kind: 'enum'; readonly allowed: readonly string[] }
  | { readonly kind: 'domain_proposal'; readonly schema: AiStructuredSchema; readonly proposalType: string };
```

`AiStructuredSchema` is an AppManager-owned validator abstraction. Version 1 may implement it using Zod because the project already uses Zod, but Zod types do not need to leak to every provider adapter.

A domain-proposal schema validates structure only. The owning domain validates domain truth/acceptability afterwards.

---

## 24. Structured Output Validation

The response pipeline is:

```text
provider response
 -> adapter technical parse
 -> normalized candidate content
 -> output-contract parse
 -> AppManager schema validation
 -> normalized AI result
```

Provider JSON mode is not schema validation.

For `json`/`domain_proposal`, malformed JSON and schema-invalid JSON are distinct normalized failures/evidence.

Version 1 shall not automatically repair invalid JSON by sending another AI request. Such a retry changes cost/output semantics and requires explicit owning-use-case retry policy.

Do not silently coerce provider prose into structured success through brittle substring extraction unless the output contract explicitly defines a deterministic bounded parser.

---

## 25. Normalized Execution Result

```ts
export type AiExecutionResult =
  | {
      readonly state: 'completed';
      readonly selection: AiProviderModelIdentity;
      readonly output: ValidatedAiOutput;
      readonly context: AiSubmittedContextEvidence;
      readonly usage?: AiUsageEvidence;
      readonly provider: AiProviderProvenance;
      readonly diagnostics: readonly AiDiagnostic[];
    }
  | {
      readonly state: 'failed' | 'timed_out' | 'cancelled' | 'indeterminate';
      readonly selection: AiProviderModelIdentity;
      readonly failure: AiFailure;
      readonly context: AiSubmittedContextEvidence;
      readonly usage?: AiUsageEvidence;
      readonly diagnostics: readonly AiDiagnostic[];
    };
```

`completed` means the provider operation and requested capability-level output contract completed. It does not mean factual correctness, domain acceptance or AppManager success.

Empty content is invalid when the output contract requires non-empty output.

---

## 26. Provider Failure Model

```ts
type AiFailureCode =
  | 'provider_not_configured'
  | 'provider_unsupported'
  | 'model_unsupported'
  | 'provider_unavailable'
  | 'credential_missing'
  | 'credential_inaccessible'
  | 'authentication_failed'
  | 'authorization_failed'
  | 'rate_limited'
  | 'quota_exhausted'
  | 'request_rejected'
  | 'context_limit_exceeded'
  | 'output_limit_reached'
  | 'output_empty'
  | 'structured_output_malformed'
  | 'structured_output_invalid'
  | 'transport_failure'
  | 'service_unavailable'
  | 'provider_timeout'
  | 'caller_cancelled'
  | 'provider_protocol_invalid'
  | 'provider_safety_rejected'
  | 'unknown_provider_failure';
```

A failure carries bounded provider status/code/detail where safe, retryability evidence (`yes | no | unknown`), possible provider-completion state and remediation hints.

Provider error text is subordinate redacted detail, not the machine contract.

HTTP 429 should normalize to `rate_limited` or `quota_exhausted` only when provider evidence distinguishes them; otherwise use the less precise supported category.

HTML/non-JSON gateway responses become `provider_protocol_invalid` or `service_unavailable` according to reliable HTTP evidence rather than assuming “possible gateway timeout”.

---

## 27. Timeout and Cancellation

`execute()` receives both a governed timeout and caller `AbortSignal`.

Implementation uses an invocation-local `AbortController` to combine timeout and caller cancellation without mutating the caller's signal.

The implementation records the first reliably observed cause:

- timeout -> `provider_timeout` / `timed_out`;
- caller signal -> `caller_cancelled` / `cancelled`;
- transport loss with uncertain provider completion -> `indeterminate` where appropriate.

Timeout values come from effective IS-3 policy/request constraints. Adapter provider constraints may cap them but cannot silently replace application policy.

Cancellation does not imply provider-side rollback, usage reversal or deletion of provider logs.

---

## 28. Retry and Fallback

IS-10 does not perform hidden retries or provider fallback inside `execute()`.

The capability may return:

```ts
export interface AiRetryEvidence {
  readonly retryability: 'yes' | 'no' | 'unknown';
  readonly retryAfterMs?: number;
  readonly permittedFallbackCandidates?: readonly AiProviderModelIdentity[];
}
```

The owning use case/IS-1 decides whether another attempt is authorized under effective policy.

A subsequent fallback attempt is a new explicit `execute()` request with a newly resolved selection and retained attempt chain/correlation evidence.

Fallback resolution rechecks disclosure policy. A local-only request cannot silently fall back to an external provider.

---

## 29. Usage Evidence

Normalized optional usage is:

```ts
export interface AiUsageEvidence {
  readonly inputUnits?: number;
  readonly outputUnits?: number;
  readonly totalUnits?: number;
  readonly unitKind: 'tokens' | 'characters' | 'provider_units' | 'unknown';
  readonly providerReported: boolean;
}
```

No missing field is invented as zero. The current `Number(tokens) || 0` behavior is replaced because zero and unknown are materially different.

Provider-specific accounting may be retained as bounded supplemental detail if needed, but callers shall not assume token semantics are identical across providers.

Usage evidence does not authorize cost/spend.

---

## 30. Provider Tool Calls and Agentic Features

Version 1 sends no AppManager tool/function definitions to providers through IS-10.

If a provider nevertheless returns tool/function/action content, the adapter normalizes it as inert generated data or an unsupported-output diagnostic. IS-10 shall not:

- execute shell commands;
- invoke Git operations;
- write/read arbitrary files;
- browse arbitrary URLs;
- dispatch AppManager commands;
- recursively call itself based on provider instructions.

A future tool-execution feature requires its own approved design/authority model; provider capability alone is insufficient.

---

## 31. Relationship to IS-9 Request Templates

An owning use case may ask IS-9 to render an AI request template.

The rendered output is supplied to IS-10 as `AiTaskInstruction` or explicitly classified context after the owning use case validates its purpose.

IS-10 does not query arbitrary templates by filename and does not allow template text to alter:

- provider selection policy;
- managed scope;
- disclosure eligibility;
- credential access;
- timeout/fallback authorization;
- output validation;
- tool/action permissions.

IS-9 render provenance may be retained in AI request provenance.

---

## 32. Relationship to IS-7 and IS-8

IS-7 facts/ranges may be supplied as context evidence. Their presence does not authorize disclosure.

AI-generated source proposals returned by IS-10 remain untrusted proposed content. The owning use case must construct an IS-8 transformation intent/plan, perform normal approval/stale checks and validate the resulting source.

IS-10 never calls IS-8 merely because generated output looks like a patch or source file.

New-resource creation similarly remains with the owning generation/use-case path and IS-4.

---

## 33. Cross-Domain Consumption

Shared AI Capability consumers use the same contract:

```text
Git use case      -> commit-message proposal
Docs use case     -> summary/draft/enrichment proposal
Nuxt use case     -> bounded content/explanation proposal
Quality use case  -> explanation/triage proposal
AI-domain use case-> instruction-document enrichment proposal
```

The caller supplies the task identity, context, output contract and acceptance requirements. IS-10 supplies provider execution evidence only.

No consumer imports a concrete provider adapter or `llmService` singleton directly.

---

## 34. Diagnostics

Initial stable codes include:

```text
AI_PROVIDER_UNKNOWN
AI_MODEL_UNKNOWN
AI_SELECTION_AMBIGUOUS
AI_PROVIDER_UNAVAILABLE
AI_CAPABILITY_UNSUPPORTED
AI_CREDENTIAL_MISSING
AI_CREDENTIAL_INACCESSIBLE
AI_DISCLOSURE_REJECTED
AI_CONTEXT_OUT_OF_SCOPE
AI_CONTEXT_SENSITIVE
AI_CONTEXT_INSUFFICIENT
AI_CONTEXT_LIMIT_EXCEEDED
AI_CONTEXT_REDUCED
AI_REQUEST_INVALID
AI_AUTHENTICATION_FAILED
AI_AUTHORIZATION_FAILED
AI_RATE_LIMITED
AI_QUOTA_EXHAUSTED
AI_REQUEST_REJECTED
AI_SERVICE_UNAVAILABLE
AI_TRANSPORT_FAILURE
AI_PROVIDER_PROTOCOL_INVALID
AI_OUTPUT_EMPTY
AI_OUTPUT_LIMIT_REACHED
AI_STRUCTURED_OUTPUT_MALFORMED
AI_STRUCTURED_OUTPUT_INVALID
AI_PROVIDER_SAFETY_REJECTED
AI_PROVIDER_TIMEOUT
AI_CALLER_CANCELLED
AI_PROVIDER_COMPLETION_INDETERMINATE
AI_PROVIDER_FAILURE
```

Diagnostics never contain credential material. Full prompts/context/responses are not logged by default.

Provider-native exception classes/messages remain technical causes.

---

## 35. Observability

Safe observability may include:

- request/correlation ID;
- owning use-case identity;
- provider/model semantic identity;
- task/output-contract class;
- context item count and aggregate submitted size;
- reduction/redaction counts;
- external/local disclosure class;
- duration;
- normalized result/failure code;
- optional normalized usage;
- retry/fallback attempt number supplied by caller.

It shall not include full prompts, project content, credentials, protected configuration or full provider payloads by default.

Debug logging does not weaken disclosure/redaction rules.

---

## 36. Caching

Version 1 does not cache generated AI responses by default.

Response caching can create stale-content, privacy, provenance and semantic-equivalence problems and is deferred until a concrete use case defines safe cache identity/invalidation.

Provider catalogue metadata may be immutable/process-local. Availability probes may use a short bounded cache keyed by provider/model/probe class and configuration revision, provided callers can distinguish cached observation time.

Context content is not retained globally merely to improve future AI calls.

---

## 37. Concurrency

`AiCapability` is stateless per execution apart from immutable catalogue/provider objects and bounded availability cache.

Concurrent independent requests are allowed. There is no global active provider/model field.

Provider-specific concurrency/rate limits may be enforced by an injected adapter-local limiter only when configured as technical/provider constraints; the limiter shall not invent application retry semantics.

One invocation changing provider preference cannot mutate another invocation's resolved selection.

---

## 38. Security and Trust

The implementation shall fail closed against:

- credential leakage through prompts, context, diagnostics or provider errors;
- unapproved external disclosure;
- context outside authorized managed scope;
- prompt injection redefining AppManager policy;
- provider-generated action execution;
- hidden provider fallback;
- arbitrary provider URLs supplied by untrusted project content;
- unbounded context submission;
- unbounded provider response capture;
- arbitrary provider option forwarding;
- registry data dynamically loading code;
- response content being treated as trusted source/application state.

Endpoint overrides, where supported, must originate from effective trusted configuration rather than project prompt/context. The implementation should restrict URL schemes to those explicitly supported by the adapter (`https` for external HTTP providers; configured `http` may be permitted for explicitly local providers such as localhost development services).

Response body size shall be bounded independently of provider-declared output limits to protect the local process.

---

## 39. Testing Requirements

Vitest core tests shall use deterministic fake providers and cover at least:

1. empty provider catalogue;
2. duplicate provider/model composition failure;
3. one eligible provider/model;
4. explicit provider/model selection;
5. explicit selection rejected by capability/policy;
6. multiple eligible candidates with deterministic policy;
7. equal candidates -> ambiguity, independent of catalogue order;
8. configured credential reference without reachability evidence;
9. missing credential;
10. local credential-free provider;
11. availability probe disabled -> no network call;
12. permitted probe and normalized reachability;
13. provider unavailable versus unsupported;
14. Headless selection never prompts;
15. instruction/context origin distinction;
16. managed-scope context upper bound;
17. sensitive context rejection;
18. external-disclosure rejection;
19. unknown disclosure eligibility fails closed;
20. known secret exclusion;
21. defensive credential-pattern redaction;
22. deterministic context ordering;
23. bounded excerpt with explicit reduction evidence;
24. structural excerpt using supplied IS-7 evidence;
25. no hidden project reread;
26. context too large with no allowed reduction;
27. valid free-text response;
28. empty text rejected where required;
29. valid JSON structured output;
30. malformed JSON;
31. schema-invalid JSON;
32. provider JSON mode returning invalid schema;
33. enum output validation;
34. provider protocol malformed;
35. HTTP 429 normalization without false quota precision;
36. authentication/authorization failure normalization;
37. service/transport failure;
38. provider safety rejection;
39. timeout;
40. caller cancellation;
41. uncertain provider completion;
42. no hidden retry;
43. fallback candidate evidence without automatic fallback;
44. fallback selection rechecks disclosure constraints;
45. provider identity actually used retained;
46. usage available;
47. usage absent remains unknown rather than zero;
48. generated tool/action request remains inert;
49. provider substitution behind same shared contract;
50. no response cache by default;
51. concurrent requests use independent selections;
52. diagnostics/logging redact prompts/credentials;
53. IS-9 rendered request cannot override disclosure/provider policy;
54. AI-generated source proposal causes no IS-8/IS-4 mutation inside IS-10.

Adapter-specific tests shall additionally cover request serialization, auth headers, endpoint construction, native error parsing, response extraction and abort behavior without requiring live provider accounts.

Optional live integration tests may be separately enabled through explicit developer configuration and must never be part of deterministic core conformance.

---

## 40. Current Implementation Disposition

| Current artefact/responsibility | Disposition | Version 1 treatment |
|---|---|---|
| `app/services/llmService.ts` singleton | **SPLIT / REPLACE** | Separate catalogue/selection/context/normalization/provider adapter responsibilities; explicit IS-23 composition, no global active provider. |
| `LLMService.initializeDefault()` direct `API_MODEL_DEFAULT` read | **REPLACE / RELOCATE** | IS-3 resolves provider/model policy; IS-10 receives effective inputs. |
| case-insensitive retry via `toLowerCase()` | **REPLACE** | Explicit aliases/normalization only; no hidden provider guessing. |
| `checkAvailability()` key-presence test | **SPLIT / ADAPT** | Credential presence retained as one availability dimension; reachability/auth/model/capability remain separate evidence. |
| `configure()` mutable `activeConfig` | **REPLACE** | Per-request immutable `ResolvedAiSelection`; no cross-invocation mutable state. |
| `resolvePath()` response mapping helper | **RETAIN / RELOCATE / BOUND** | May serve verified compatible adapter parsing; not shared provider architecture. |
| `sanitizeContext()` | **RETAIN / NARROW / ADAPT** | Optional bounded-excerpt strategy only; add provenance/reduction evidence and task policy. |
| `generate()` string convenience API | **REPLACE** | Typed task/output contracts and normalized execution result; callers cannot discard provider/output-validation evidence by default. |
| `chat()` | **SPLIT / ADAPT** | Useful HTTP/timeout/response mechanics move into adapter; shared request is provider-independent. |
| default OpenAI base URL | **REPLACE** | Missing endpoint is configuration/provider validation failure; no unrelated provider default. |
| hard-coded `/chat/completions` | **RETAIN / NARROW** | Adapter-local only for verified compatible providers. |
| universal bearer `Authorization` | **REPLACE / NARROW** | Adapter/provider-specific auth strategy. |
| fallback bearer value `ollama` | **REMOVE** | Credential-free local provider omits auth unless configured protocol requires it. |
| `jsonMode` | **RETAIN / RELOCATE** | Provider-native optimization below AppManager structured-output validation. |
| response mapping paths | **RETAIN / NARROW** | Compatible-adapter configuration only, verified per provider. |
| `Number(tokens) || 0` | **REPLACE** | Missing usage remains unknown; normalize reliable provider-reported usage only. |
| thrown string-based HTTP/provider errors | **REPLACE** | Stable normalized AI failure categories + bounded provider detail. |
| AbortController timeout | **RETAIN / ADAPT** | Combine governed timeout and caller cancellation; preserve distinct cause/uncertain completion. |
| direct logger calls | **RELOCATE** | Safe capability observability/diagnostics; no full prompt/context/provider payload by default. |
| `app/types/services/llmServiceTypes.ts` | **SPLIT / RELOCATE / REPLACE** | Useful concepts move to capability-local contracts; remove OpenAI role/message and registry types as universal architecture. |
| `LLMResponseMapping` | **RETAIN / NARROW** | Adapter-private response extraction configuration. |
| `LLMProviderConfig` | **SPLIT** | Provider/model descriptor + IS-3 effective provider configuration + adapter config. |
| `LLMServiceConfig` | **REPLACE** | Effective IS-3 concerns and protected credential handle; no plaintext universal config object. |
| `LLMProviderStatus.available: boolean` | **REPLACE** | Multi-dimensional request-relative availability evidence. |
| `LLMMessage` role union | **REPLACE as public contract** | Provider adapter serialization detail; AppManager distinguishes authoritative task instruction from untrusted context. |
| `ILLMService` | **REPLACE** | `AiCapability` + provider adapter contracts. |
| `config/llmRegistry.json` | **RETAIN / ADAPT / VERIFY** | Migration source for provider/model catalogue; remove credential/precedence authority and verify actual protocol compatibility. |
| current provider IDs/labels/models | **REVIEW / ADAPT** | Preserve stable IDs where useful; model/version/endpoints are provider data requiring implementation-time verification, not normative defaults. |
| `interactiveMode.ts` direct `llmService` selection | **RELOCATE** | IS-22 captures selection -> IS-1/IS-3 policy -> IS-10 explicit selection request. |
| `commitCommand.ts` direct `llmService` use | **RELOCATE** | IS-15 Git use case owns commit-message intent and delegates bounded request to IS-10. |
| `codeService.ts` direct `llmService` use | **SPLIT / RELOCATE** | Docs/Source Transformation/other owning capability decides AI intent; IS-10 only executes bounded request. |
| `tests/unit/services/llmService.test.ts` | **RETAIN / SPLIT / ADAPT** | Preserve useful HTTP/error/timeout fixtures in adapter tests; add selection/context/disclosure/structured-output/failure/fake-provider conformance. |
| tests mutating `process.env` for AI semantics | **REPLACE / NARROW** | Only IS-3 environment-source/boundary tests mutate env; IS-10 tests inject effective config/credential handles. |

---

## 41. Migration Sequence

Implementation should proceed in this order:

1. create capability-local identities, request/context/output/result/failure contracts;
2. implement immutable provider catalogue and composition validation;
3. implement deterministic provider/model resolver with fake availability evidence;
4. implement context/disclosure validator and deterministic reduction evidence;
5. implement output-contract validation with Zod-backed structured schemas where appropriate;
6. define fake-provider conformance harness and normalized failure matrix;
7. extract current direct-HTTP mechanics into a bounded compatible provider adapter;
8. replace direct environment reads with IS-3 effective provider/model/credential inputs;
9. verify each retained `llmRegistry.json` provider against the adapter/protocol and normalize catalogue data;
10. implement timeout + caller-cancellation cause preservation;
11. implement normalized usage/provenance and safe diagnostics;
12. migrate `commitCommand.ts` consumer later through IS-15 rather than preserving direct service coupling;
13. migrate `codeService.ts` AI consumers through their owning IS boundaries;
14. migrate interactive provider selection through IS-22/IS-1/IS-3;
15. remove singleton `llmService`, global `activeConfig`, universal OpenAI message types and direct `process.env` reads after all consumers migrate;
16. retain old service only as a temporary compatibility adapter if necessary, backed by the new capability and without mutable provider authority;
17. run fake-provider and adapter conformance suites before enabling optional live-provider tests.

---

## 42. Traceability

| Implementation concern | Governing authority |
|---|---|
| subordinate shared capability / no AI-domain transfer | DD-AICAP-001–006; FR-AI-001–005, 072–079 |
| availability | DD-AICAP-007–010; FR-AI-014, 080–087 |
| provider/model selection | DD-AICAP-011–015; FR-AI-013, 080–087; IS-3 |
| provider-independent request | DD-AICAP-016–018 |
| context items/manifest/scope | DD-AICAP-019–022; FR-AI-055–057, 088–096; IS-2 |
| minimization/reduction | DD-AICAP-023–027; FR-AI-055, 088–096; IS-7 |
| instruction hierarchy/prompt injection | DD-AICAP-028–032; FR-AI-004, 058–060, 090–092 |
| sensitivity/disclosure | DD-AICAP-033–038; FR-AI-015, 047, 055–057, 088–096; IS-3 |
| request templates | DD-AICAP-039–042; FR-AI-023–024, 045; IS-9 |
| output contract/validation | DD-AICAP-043–047; FR-AI-058–062, 087, 097–105 |
| response normalization | DD-AICAP-048–051; FR-AI-097–105 |
| provider failure | DD-AICAP-052–054; FR-AI-097–105 |
| timeout/cancellation | DD-AICAP-055–059; FR-AI-016, 049–050, 097–104; IS-1 |
| retry/fallback | DD-AICAP-060–065; FR-AI-049, 052–054, 097–105 |
| usage/provenance | DD-AICAP-066–069; FR-AI-061, 097–105 |
| Headless equivalence | DD-AICAP-070–072; FR-AI-008–010 |
| cross-domain ownership | DD-AICAP-073–075; FR-AI-072–079 |
| mutation/action isolation | DD-AICAP-076–079; FR-AI-004, 062, 077–078; IS-4/IS-8 |
| shared capability composition | DD-AICAP-080; IS-4/5/7/8/9 |
| application outcome separation | DD-AICAP-081–083; IS-1 |
| provider contract/replaceability | DD-AICAP-084–087; ADR-0001 |
| current implementation reconciliation | DD-AICAP-088 |
| security/safety | DD-AICAP-089–091; FR-AI-088–096 |
| fake/live provider tests | DD-AICAP-092–093 |

---

## 43. Version 1 Non-Drift Baseline

The concrete Version 1 flow is:

```text
owning use-case intent
 + IS-2 approved context/scope evidence
 + IS-3 effective provider/model/disclosure/credential policy
 + optional IS-9 rendered request template
 + explicit output contract
        |
        v
IS-10 provider/model resolution
        |
        v
context scope + trust + sensitivity + disclosure validation
        |
        v
deterministic permitted reduction
        |
        v
provider-independent request
        |
        v
verified provider adapter
        |
        v
external/local AI provider
        |
        v
provider response/failure evidence
        |
        v
normalization + structured-output validation
        |
        v
normalized AI proposal/evidence
        |
        +--> source proposal -> owning use case -> IS-8
        +--> new resource proposal -> owning use case -> IS-4
        +--> textual/domain proposal -> owning domain validation
        |
        v
IS-1 / owning use-case acceptance
```

The non-drift rule is:

> **Version 1 AI Capability may select and invoke an approved provider for a bounded request and validate the provider's output contract; it may not infer AppManager intent, expand managed scope, weaken disclosure policy, execute generated actions, mutate project state, silently retry/fallback, or declare final application success.**

This implementation preserves useful HTTP, timeout, provider-registry, response-extraction and context-reduction mechanics from the current code while replacing the singleton/global-provider/OpenAI-shaped authority model with explicit per-request capability contracts.