# DD-4.3 — AppManager AI Domain Detailed Design

> **Detailed Design ID:** DD-4.3
>
> **Design family:** DD-4 — Policy and Resource Domains
>
> **Status:** Version 1 Detailed Design Specification
>
> **Detailed Design authority:** This document defines the permanent AI-domain orchestration, policy, state, decision and result contracts for AppManager-owned AI instruction-document management and AI-specific project-resource use cases through approved DD-1 Application Core and DD-2 Shared Capability contracts. It refines, but does not override, the root Design Specification, Functional Specifications, accepted ADRs, DD-1 or DD-2 Detailed Designs.
>
> **Governing sources:** [Project Documentation Guide](../project-documentation-guide-v01.md), [AppManager Design Specification](../appmanager-design-specification-v01.md), [AI Functional Specification](../functional/ai-functional-specification-v01.md), [Detailed Design Register](../project_management/detailed-design-register-v01.md), [Domain Detailed Design Authoring Guide](../project_management/domain-detailed-design-authoring-guide-v02.md), [ADR-0001 — Primary Application Runtime](../project_management/decisions/adr-0001-primary-application-runtime.md)
>
> **Related Detailed Design authorities:** [DD-1.1 — Application Invocation](../dd_1_application_core/dd-1-1-application-invocation-detailed-design-v01.md), [DD-1.2 — Execution Outcomes](../dd_1_application_core/dd-1-2-execution-outcomes-detailed-design-v01.md), [DD-1.3 — Managed Project](../dd_1_application_core/dd-1-3-managed-project-detailed-design-v01.md), [DD-1.4 — Configuration Resolution](../dd_1_application_core/dd-1-4-configuration-resolution-detailed-design-v01.md), [DD-1.5 — Application Engine](../dd_1_application_core/dd-1-5-application-engine-detailed-design-v01.md), [DD-2.1 — Resource Access](../dd_2_shared_capabilities/dd-2-1-resource-access-detailed-design-v01.md), [DD-2.4 — Source Intelligence](../dd_2_shared_capabilities/dd-2-4-source-intelligence-detailed-design-v01.md), [DD-2.5 — Source Transformation](../dd_2_shared_capabilities/dd-2-5-source-transformation-detailed-design-v01.md), [DD-2.6 — Resource Registry and Template](../dd_2_shared_capabilities/dd-2-6-resource-registry-and-template-detailed-design-v01.md), [DD-2.7 — AI Capability](../dd_2_shared_capabilities/dd-2-7-ai-capability-detailed-design-v01.md), [DD-3.2 — Git Domain](../dd_3_high_coupling_domains/dd-3-2-git-domain-detailed-design-v01.md), [DD-3.3 — Nuxt Domain](../dd_3_high_coupling_domains/dd-3-3-nuxt-domain-detailed-design-v01.md), [DD-3.4 — Docs Domain](../dd_3_high_coupling_domains/dd-3-4-docs-domain-detailed-design-v01.md), [DD-4.1 — Quality Domain](dd-4-1-quality-domain-detailed-design-v01.md), [DD-4.2 — Settings Domain](dd-4-2-settings-domain-detailed-design-v01.md)

---

## 1. Purpose

This specification defines the permanent domain-level composition by which AppManager manages the project-side AI development environment and its supported semantic resources without allowing a provider, model, template, discovered project content or shared AI capability to acquire application authority.

The governing rules are:

> **The AI domain owns AI-specific project-resource intent and AI-domain acceptance; DD-2.7 owns bounded provider-independent AI execution; the Application Engine retains final application authority.**

> **Using AI inside another domain does not transfer that domain's product intent into DD-4.3.**

> **AI output is proposed content until the AI-domain use case validates and accepts it; provider completion is not application success.**

> **Project content and generated content are data, not authority to expand managed scope, disclosure policy, mutation rights or application permissions.**

---

## 2. Scope

### 2.1 In Scope

This design owns permanent AI-domain contracts for:

- AI-domain operation identity and applicability;
- AI resource identity, graph references and provider/environment representations;
- aggregate inspection and the resource-family operations defined by the AI Functional catalogue;
- recognized AI instruction-document type identity;
- listing supported document types and presence state;
- conservative observation of likely unregistered AI-oriented documents;
- creation of new supported AI instruction documents;
- deterministic non-AI baseline generation where supported;
- optional AI-assisted enrichment of a valid baseline;
- deletion of selected eligible AI instruction documents;
- document-type target resolution within managed scope;
- AI-domain policy for existing-target protection and explicit replacement;
- AI-domain selection of required versus optional AI capability use;
- project-fact acceptance for generated instruction content;
- AI-domain interpretation of DD-2.7 normalized evidence;
- fallback from optional enrichment to deterministic baseline;
- AI-domain provider-failure interpretation;
- AI-domain privacy/disclosure decisions above DD-2.7 capability mechanics;
- cancellation, stale-state and partial-effect interpretation;
- deterministic Headless behavior;
- AI-domain-specific result payloads beneath DD-1.2 outcomes.

### 2.2 Out of Scope

This design does not own:

- provider SDKs, transports, authentication protocols, request wire formats or model registries;
- provider/model selection mechanics beneath DD-2.7;
- generic prompt/context safety mechanics already owned by DD-2.7;
- Git commit-message generation when Git intent is primary;
- Docs generation/summarization when Docs intent is primary;
- Nuxt generation or scaffolding when Nuxt intent is primary;
- Quality explanation/triage when Quality intent is primary;
- Settings resource-management semantics;
- general source mutation;
- automatic version derivation;
- arbitrary command/tool execution;
- autonomous coding agents;
- generic executable plugins or an AI marketplace;
- concrete filenames, parser libraries, TypeScript classes/services, source paths, SDKs, prompt strings or model identifiers.

---

## 3. Governing Requirements and Authorities

The AI Functional Specification defines the project-environment requirements `PBC-FR-AI-ENV-001` through `017` alongside `FR-AI-001`–`FR-AI-105`. This Detailed Design binds those requirements as follows:

| Functional area | Requirements | Detailed Design focus |
|---|---|---|
| Domain boundary | `FR-AI-001`–`005` | primary intent, authority and provider independence |
| Invocation/context | `FR-AI-006`–`016` | application context, configuration, cancellation and mode equivalence |
| Instruction-document model | `FR-AI-017`–`025` | semantic document identity and declarative-resource boundary |
| Listing | `FR-AI-026`–`035` | recognition, presence state and conservative classification |
| Creation | `FR-AI-036`–`050` | baseline generation, target safety, persistence and partial outcomes |
| Optional enrichment | `FR-AI-051`–`062` | DD-2.7 delegation, fallback, context policy and acceptance |
| Deletion | `FR-AI-063`–`071` | eligibility, authorization, exact target and race handling |
| Cross-domain AI use | `FR-AI-072`–`079` | primary-intent ownership and capability/domain separation |
| Provider/model semantics | `FR-AI-080`–`087` | governed DD-2.7 consumption and failure interpretation |
| Safety/privacy/trust | `FR-AI-088`–`096` | disclosure, untrusted content, path safety and existing content protection |
| Results/failures | `FR-AI-097`–`105` | application-level interpretation, warnings and ambiguity |

<a id="dd-ai-001"></a>

**DD-AI-001 — Primary-intent ownership is preserved**  
DD-4.3 shall own only use cases whose primary application intent is AI-specific project-resource management or AI instruction-document management.

<a id="dd-ai-002"></a>

**DD-AI-002 — DD-2.7 remains the shared AI execution authority**  
Provider/model capability discovery, bounded context handling, request construction, provider delegation, response normalization and structured-output validation remain owned by DD-2.7.

<a id="dd-ai-003"></a>

**DD-AI-003 — Application authority remains above the AI domain**  
The AI domain shall interpret subordinate capability/resource evidence but shall not replace DD-1.5 final application acceptance or DD-1.2 canonical outcome semantics.

---

## 4. Domain Responsibility and Authority Boundary

The AI domain owns:

- semantic identity of AI instruction-document use cases;
- supported AI document-type policy at the domain level;
- operation-specific target applicability and eligibility;
- whether baseline generation requires, permits or forbids live AI assistance;
- AI-domain project-fact acceptance for generated instruction content;
- whether optional enrichment is requested and acceptable;
- AI-domain interpretation of provider/capability evidence;
- AI-domain existing-target and replacement policy;
- deletion eligibility of recognized AI instruction documents;
- AI-domain partial-success semantics where baseline generation succeeds but optional enrichment fails;
- AI-domain result payload and recovery guidance.

Authority retained elsewhere includes:

- invocation normalization and adapter projection — DD-1.1;
- canonical outcomes, warnings, effects and cancellation — DD-1.2;
- managed-project identity and managed scope — DD-1.3;
- effective configuration and provenance — DD-1.4;
- final application coordination/acceptance — DD-1.5;
- bounded resource creation/deletion mechanics — DD-2.1;
- source recognition facts — DD-2.4;
- existing-resource transformation — DD-2.5;
- declarative registry/template identity/rendering — DD-2.6;
- provider/model AI execution mechanics — DD-2.7;
- Git/Docs/Nuxt/Quality primary intent — their respective domain designs;
- Settings template-resource CRUD — DD-4.2.

```text
normalized invocation
        |
        v
Application Engine
        |
        +--> DD-1.3 managed project / scope
        +--> DD-1.4 effective AI policy/configuration
        v
AI-domain intent / document type / operation policy
        |
        +--> DD-2.4 recognition facts
        +--> DD-2.6 document/template resource
        +--> optional DD-2.7 enrichment evidence
        +--> DD-2.1 creation/deletion mechanics
        +--> DD-2.5 explicit replacement/update path
        v
AI-domain interpretation / acceptance
        |
        v
Application Engine -> DD-1.2 outcome
```

This expresses semantic authority, not mandatory runtime topology.

<a id="dd-ai-004"></a>

**DD-AI-004 — Delegated AI does not transfer use-case ownership**  
A Git, Docs, Nuxt, Quality, Settings or future domain use case remains owned by that domain when it consumes DD-2.7 merely for AI assistance.

<a id="dd-ai-005"></a>

**DD-AI-005 — AI-document management is not provider management**  
Managing a provider-associated instruction document shall not imply that the corresponding provider is configured, available, authenticated or selected for AppManager execution.

---

## 5. Consumed DD-1 Application Core Contracts

<a id="dd-ai-006"></a>

**DD-AI-006 — Invocation binding**  
AI-domain operations shall consume normalized intent, interaction mode and cancellation context from DD-1.1 rather than deriving semantics from presentation flows.

<a id="dd-ai-007"></a>

**DD-AI-007 — Outcome binding**  
AI-domain results shall extend DD-1.2 with domain evidence and shall not define a competing generic outcome envelope.

<a id="dd-ai-008"></a>

**DD-AI-008 — Managed-project binding**  
Project-scoped listing, creation, replacement and deletion shall consume DD-1.3 managed-project identity and approved scope.

<a id="dd-ai-009"></a>

**DD-AI-009 — Configuration binding**  
Provider/model, enrichment, disclosure, timeout, fallback and other applicable AI policy shall consume DD-1.4 effective configuration rather than directly resolving competing sources.

<a id="dd-ai-010"></a>

**DD-AI-010 — Application Engine binding**  
Final acceptance of AI-domain results and authorization of consequential effects remain coordinated by DD-1.5.

---

## 6. Consumed DD-2 Shared Capabilities

<a id="dd-ai-011"></a>

**DD-AI-011 — Resource Access composition**  
Creation and deletion of AI instruction documents may use DD-2.1 bounded resource mechanics; those mechanics shall not decide document semantics or domain acceptance.

<a id="dd-ai-012"></a>

**DD-AI-012 — Source Intelligence composition**  
Recognition of existing AI-oriented documents may consume DD-2.4 facts. Recognition alone shall not authorize replacement or deletion.

<a id="dd-ai-013"></a>

**DD-AI-013 — Source Transformation composition**  
Replacing or updating an existing AI instruction document shall use DD-2.5 under explicit AI-domain transformation intent and managed scope.

<a id="dd-ai-014"></a>

**DD-AI-014 — Registry and Template composition**  
Supported AI document definitions/templates may use DD-2.6 for declarative identity, validation, provenance and rendering; template success shall not itself authorize a write.

<a id="dd-ai-015"></a>

**DD-AI-015 — AI Capability composition**  
Live enrichment shall delegate provider/model resolution, bounded context, external disclosure checks, request execution and normalized provider evidence to DD-2.7.

<a id="dd-ai-016"></a>

**DD-AI-016 — Capability composition does not merge responsibilities**  
The AI domain shall not recreate provider mechanics, generic transformation planning or registry infrastructure merely because one use case composes them.

---

## 7. Domain Contract Model

### 7.1 AI-domain operation identity

Operation identity binds the [twenty-two AI Functional commands](../functional/ai-functional-specification-v01.md). Optional enrichment is supporting behavior, not another public command. `ai.instruction.update` owns update intent; targeted transformation or whole-resource replacement is an effect selected by its DD-2.5 plan. There is no `ai.prompt.run` or generic AI execution command.

<a id="dd-ai-017"></a>

**DD-AI-017 — Operation identity is semantic**  
An AI-domain operation shall be identified by application intent and semantic AI-resource target, not by one filename, provider, command, parser or SDK method.

### 7.2 AI instruction-document type

A domain-level document type shall be capable of representing:

- stable semantic document-type identity;
- provider/tool association where applicable;
- provider-agnostic status where applicable;
- expected document format/class;
- target-resolution rule or target descriptor;
- baseline template/resource identity where applicable;
- baseline availability requirements;
- whether optional enrichment is supported;
- replacement/deletion policy where applicable;
- sensitivity/disclosure constraints relevant to generation.

<a id="dd-ai-018"></a>

**DD-AI-018 — Document type is not filename identity**  
A filename may participate in target resolution but shall not replace stable semantic document-type identity.

<a id="dd-ai-019"></a>

**DD-AI-019 — Provider association is descriptive metadata**  
Provider/tool association shall not imply provider availability, authentication or runtime selection.

<a id="dd-ai-020"></a>

**DD-AI-020 — Examples remain non-exclusive**  
`CLAUDE.md`, `GEMINI.md`, `AGENTS.md` and similar examples shall not constrain the architecture to a closed hard-coded provider set.

### 7.3 AI-domain result payload

An AI-domain result carries the applicable semantic resource identity, resolved representation and target, scope/applicability, graph references, provider/tool association, presence, support/partial-representation state, revision evidence and policy state. For content workflows it distinguishes deterministic baseline, enrichment requested/performed/skipped/failed, and proposed versus accepted content provenance. It composes capability warnings, persistence/transformation effects, stale/conflict and no-op evidence, and recovery guidance beneath the [DD-1.2 outcome](../dd_1_application_core/dd-1-2-execution-outcomes-detailed-design-v01.md#_7-outcome-contract).

<a id="dd-ai-021"></a>

**DD-AI-021 — Provider detail remains subordinate**  
Provider/model metadata may support provenance and diagnostics but shall not become the domain success contract.

---

### 7.4 Resource graph and representation {#resource-graph}

The graph refines the [Functional resource families](../functional/ai-functional-specification-v01.md#_4-1-project-side-environment-resources): `InstructionResource`, `PromptResource`, `AgentDefinition`, `SkillDefinition`, `ToolIntegration` and `AiPolicy`, with provider/environment mappings. The instruction-document type in §7.2 specializes the instruction family; its baseline/enrichment lifecycle is not imposed on every other family.

Validate references between semantic resources and preserve missing, ambiguous, unsupported and partially representable states. Provider files, directories and schemas are representation evidence: matching names or shapes do not establish equivalent resources. Rules are scoped instructions unless independently distinct semantics are established. MCP represents tool integration; a template is an instantiation mechanism unless it has independently meaningful resource semantics.

AI policy narrows visibility/operation within [DD-1 scope](../dd_1_application_core/dd-1-3-managed-project-detailed-design-v01.md). Credential references follow [Settings ownership](../functional/ai-functional-specification-v01.md#pbc-fr-ai-env-010); a reference is not permission to acquire or disclose the secret.

## 8. Use-Case Orchestration

### 8.1 Common orchestration

A consequential AI-domain use case shall conceptually perform:

```text
resolve normalized invocation
 -> resolve managed project / approved scope
 -> resolve AI-domain operation and semantic resource identity
 -> resolve operation-effective configuration/policy
 -> acquire bounded current-state/resource evidence
 -> resolve target and eligibility
 -> render/generate deterministic baseline where applicable
 -> optionally invoke DD-2.7 under explicit enrichment policy
 -> validate proposed content/resource state against domain postconditions
 -> authorize consequential persistence/replacement/deletion
 -> delegate bounded effect mechanics
 -> verify resulting state where applicable
 -> interpret AI-domain acceptance
 -> return evidence for Application Engine acceptance
```

<a id="dd-ai-022"></a>

**DD-AI-022 — Target identity precedes consequential work**  
Consequential resource operations resolve the eligible semantic resource and bounded project target before mutation. Instruction creation/update/deletion retains the document-type specialization below.

### 8.2 Instruction-resource listing

<a id="dd-ai-023"></a>

**DD-AI-023 — Listing is non-mutating**  
Listing supported or observed AI instruction documents shall not create, normalize, rewrite or delete project resources.

<a id="dd-ai-024"></a>

**DD-AI-024 — Supported types and project presence are distinct facts**  
A supported document type may be absent, and an observed AI-looking document may be unregistered; these states shall not be collapsed.

<a id="dd-ai-025"></a>

**DD-AI-025 — Unregistered observation is conservative**  
Likely AI-oriented unregistered documents may be reported informationally, but uncertain classification shall not be elevated to recognized document identity without sufficient evidence.

<a id="dd-ai-026"></a>

**DD-AI-026 — Discovery grants no deletion authority**  
An unregistered or heuristically observed document shall not become deletable merely because it appears in a listing result.

### 8.3 Creation and deterministic baseline

<a id="dd-ai-027"></a>

**DD-AI-027 — Baseline path is explicit**  
Where a document type supports deterministic baseline generation, the AI domain shall be able to generate a valid baseline without requiring live DD-2.7 execution.

<a id="dd-ai-028"></a>

**DD-AI-028 — Project facts are authoritative inputs**  
Project-specific facts inserted into a baseline shall derive from approved managed-project/source/settings/domain evidence and shall not be guessed from generated text.

<a id="dd-ai-029"></a>

**DD-AI-029 — Baseline rendering is not persistence**  
Successful DD-2.6 rendering establishes proposed document content only; creation remains a separately authorized resource effect.

<a id="dd-ai-030"></a>

**DD-AI-030 — Existing target is protected**  
Create shall not silently overwrite a pre-existing target.

<a id="dd-ai-031"></a>

**DD-AI-031 — Replacement is a separate consequential intent**  
If replacement/update is supported, it shall be explicit and shall enter DD-2.5 with applicable authorization and preservation/conflict semantics.

### 8.4 Optional enrichment

<a id="dd-ai-032"></a>

**DD-AI-032 — Enrichment is subordinate to baseline semantics**  
Optional AI enrichment shall not erase the distinction between deterministic baseline creation and provider-assisted enhancement.

<a id="dd-ai-033"></a>

**DD-AI-033 — Optional provider unavailability need not fail baseline creation**  
Where the requested use case permits baseline-only completion, unavailable/failed optional DD-2.7 enrichment shall preserve a valid baseline and be interpreted as warning or partial result according to policy.

<a id="dd-ai-034"></a>

**DD-AI-034 — Required AI assistance fails explicitly**  
Where a document type/use case explicitly requires live AI capability, unsupported or unavailable DD-2.7 capability shall prevent ordinary complete acceptance rather than silently degrade to a materially different operation.

<a id="dd-ai-035"></a>

**DD-AI-035 — Context selection is domain-intent bounded**  
The AI domain shall choose only project facts/content reasonably necessary for the requested document enrichment and then delegate disclosure/minimization enforcement to DD-2.7.

<a id="dd-ai-036"></a>

**DD-AI-036 — Generated claims cannot override reliable facts**  
The AI domain shall reject or correct known contradictions between generated enrichment and authoritative project facts where material to document correctness.

<a id="dd-ai-037"></a>

**DD-AI-037 — Provider response requires domain acceptance**  
For instruction enrichment, apply [Design §11.10](../appmanager-design-specification-v01.md#_11-10-ai-assisted-workflow): validate suitability for the selected document contract under the acceptance policy resolved before the proposal. The authorized policy may require human review or deterministic automatic acceptance; the provider cannot select it.

### 8.5 Deletion

<a id="dd-ai-038"></a>

**DD-AI-038 — Deletion eligibility is explicit**  
Deletion shall apply only to a resolved, present and eligible AI instruction document under the selected operation.

<a id="dd-ai-039"></a>

**DD-AI-039 — Exact target deletion**  
Deletion shall affect only the selected document and shall not cascade to templates, other instruction documents, provider configuration or unrelated resources.

<a id="dd-ai-040"></a>

**DD-AI-040 — Already absent may be unchanged**  
A selected document that is already absent may be reported as no-op/already satisfied without fabricating a destructive effect.

---

### 8.6 Other resource families and aggregate inspection {#resource-family-lifecycle}

Aggregate inspection reports the resource graph and its representation/support state. Family list operations expose their own selected resource class under the Functional contract. Prompt and agent create/update/delete, skill add/remove, tool add/update/remove, and policy inspect/configure use their respective semantic identities and eligibility constraints; they do not inherit instruction-baseline or enrichment requirements merely because files represent them.

For an authorized change, validate the selected resource, references and representability, establish the requested postcondition, delegate the applicable creation/transformation/removal mechanism and interpret the resulting resource state. Preserve unresolved/partial representation and actual effects in §7.3 rather than claiming complete success from a rendered template, recognized source or configured tool. AI execution, if used, remains with DD-2.7; the AI domain does not absorb Git or Docs intent when those domains consume that same capability.

## 9. Domain State and State Transitions

A domain operation may conceptually move through:

```text
context-resolved
 -> intent-resolved
 -> document-type-resolved
 -> target-resolved
 -> current-state-observed
 -> baseline-prepared (where applicable)
 -> enrichment-resolved (none / optional / required)
 -> enrichment-completed-or-skipped
 -> effect-authorized
 -> effect-in-progress
 -> resulting-state-observed
 -> domain-postconditions-interpreted
 -> accepted | unchanged | partial | rejected | cancelled | indeterminate
```

<a id="dd-ai-041"></a>

**DD-AI-041 — Provider state and domain state remain distinct**  
Provider request success, failure, timeout or cancellation shall not be treated as equivalent to AI-domain operation state.

<a id="dd-ai-042"></a>

**DD-AI-042 — Baseline and enrichment state remain independently visible**  
Where both stages exist, the result shall retain whether baseline generation succeeded independently of enrichment outcome.

<a id="dd-ai-043"></a>

**DD-AI-043 — Completed local effects remain historical facts**  
Cancellation or later provider failure shall not erase a completed document creation/deletion effect from the result.

<a id="dd-ai-044"></a>

**DD-AI-044 — Indeterminate effect is first-class**  
If a local effect may have occurred but cannot be verified reliably, the domain shall represent indeterminate state rather than guess.

---

## 10. Domain Policy and Decision Rules

<a id="dd-ai-045"></a>

**DD-AI-045 — Primary intent decides domain ownership**  
The presence of an AI provider/model in a workflow shall not determine domain ownership; the primary application intent shall.

<a id="dd-ai-046"></a>

**DD-AI-046 — Provider choice is consumed policy**  
The AI domain may supply operation-specific constraints but shall not independently invent provider precedence or selection order outside DD-1.4/DD-2.7.

<a id="dd-ai-047"></a>

**DD-AI-047 — Optional versus required enrichment is explicit policy**  
Whether enrichment is optional, required or prohibited shall be established before provider execution where it affects acceptance.

<a id="dd-ai-048"></a>

**DD-AI-048 — External disclosure is not an invisible side effect**  
An AI-domain operation that sends project content to an external provider shall do so only under applicable effective disclosure policy and explicit operation semantics.

<a id="dd-ai-049"></a>

**DD-AI-049 — Unsupported and unavailable remain distinct**  
Unknown document type, unsupported capability and temporarily unavailable provider/model shall not be collapsed into one generic failure state.

<a id="dd-ai-050"></a>

**DD-AI-050 — Provider fallback is governed**  
The AI domain may request retry/fallback only where allowed by effective/invocation policy and shall not manufacture hidden fallback behavior around DD-2.7.

<a id="dd-ai-051"></a>

**DD-AI-051 — Generated action suggestions are inert**  
Commands, tool calls, file edits or other consequential actions mentioned by generated instruction content shall not execute merely because the AI-domain workflow produced them.

---

## 11. Safety, Mutation, and Authorization

The AI domain shall preserve:

```text
recognition
    != document selection
    != generation intent
    != provider execution
    != content acceptance
    != mutation authorization
    != technical persistence
    != domain acceptance
    != application success
```

<a id="dd-ai-052"></a>

**DD-AI-052 — Recognition does not grant mutation authority**  
A discovered or recognized document shall not be replaced or deleted without explicit consequential intent and authorization.

<a id="dd-ai-053"></a>

**DD-AI-053 — AI output does not grant write authority**  
Generated content shall not be written merely because DD-2.7 produced it successfully.

<a id="dd-ai-054"></a>

**DD-AI-054 — New-resource creation is bounded**  
Accepted generated content for a new document shall be persisted only to the approved resolved target through the applicable resource path.

<a id="dd-ai-055"></a>

**DD-AI-055 — Existing-resource mutation routes through DD-2.5**  
Replacement/update of existing content shall not bypass transformation preconditions, stale-state checks or source-validity evidence.

<a id="dd-ai-056"></a>

**DD-AI-056 — Existing authored content is protected**  
The AI domain shall not silently overwrite existing user-authored instruction content.

<a id="dd-ai-057"></a>

**DD-AI-057 — Path safety is authoritative**  
Provider/template-suggested paths shall not expand target scope beyond the document type and DD-1.3 managed scope.

<a id="dd-ai-058"></a>

**DD-AI-058 — Consequential authorization is mode-independent**  
Interactive confirmation and Headless explicit authorization may differ in presentation but shall satisfy equivalent consequential-operation policy.

---

## 12. Failure, Cancellation, and Partial Effects

<a id="dd-ai-059"></a>

**DD-AI-059 — Failure is stage-attributable**  
Failures shall distinguish target/type resolution, managed-scope validation, baseline generation, template/rendering, provider delegation, provider-output validation, authorization, persistence/transformation and AI-domain acceptance where material.

<a id="dd-ai-060"></a>

**DD-AI-060 — Optional enrichment failure may yield baseline success**  
Where policy allows, a valid created baseline plus failed optional enrichment shall be represented truthfully as baseline completion with warning/partial enrichment rather than total provider-defined failure.

<a id="dd-ai-061"></a>

**DD-AI-061 — Required enrichment failure prevents complete acceptance**  
Where enrichment is required by the selected operation, failed or invalid enrichment shall not be silently accepted as complete success.

<a id="dd-ai-062"></a>

**DD-AI-062 — No false rollback**  
Provider requests and completed local resource effects shall not be described as rolled back unless an actual rollback guarantee completed.

<a id="dd-ai-063"></a>

**DD-AI-063 — Cancellation stops future work**  
Cancellation shall prevent not-yet-started enrichment/effects as soon as safely practical and propagate to DD-2.7/DD-2.5/DD-2.1 where supported.

<a id="dd-ai-064"></a>

**DD-AI-064 — Cancellation preserves completed work**  
Completed baseline generation, provider calls and local effects remain represented after cancellation.

<a id="dd-ai-065"></a>

**DD-AI-065 — Provider uncertainty remains subordinate evidence**  
Indeterminate provider completion after timeout/network/cancellation shall be preserved as DD-2.7 evidence and interpreted by the AI domain according to whether a local accepted effect depended on it.

---

## 13. Headless and Interaction Independence

<a id="dd-ai-066"></a>

**DD-AI-066 — One semantic contract across adapters**  
TUI, Headless and future adapters shall express equivalent AI-domain operation identity, document type, provider policy, authorization and acceptance semantics.

<a id="dd-ai-067"></a>

**DD-AI-067 — Interactive selection is presentation**  
Menus for document types, existing candidates or optional enrichment shall not create semantics unavailable to Headless callers.

<a id="dd-ai-068"></a>

**DD-AI-068 — Headless ambiguity fails safely**  
Ambiguous document type, project target, provider choice, replacement intent or delete target shall produce structured failure rather than prompts or guesses.

<a id="dd-ai-069"></a>

**DD-AI-069 — Machine-consumable listing and outcomes**  
Headless callers shall receive stable document identities, presence states, selected targets and outcome/effect data without parsing provider text or terminal presentation.

---

## 14. Concurrency, Idempotency, and Conflict Behaviour

<a id="dd-ai-070"></a>

**DD-AI-070 — Creation revalidates existence**  
Where practical, create shall revalidate that the target remains absent immediately before persistence.

<a id="dd-ai-071"></a>

**DD-AI-071 — Deletion revalidates target state**  
Deletion shall avoid applying stale assumptions if the selected document changed or disappeared and that condition can be detected.

<a id="dd-ai-072"></a>

**DD-AI-072 — Replacement is stale-sensitive**  
A replacement/update based on prior content shall use revision/precondition evidence where supported and shall not silently overwrite material concurrent changes.

<a id="dd-ai-073"></a>

**DD-AI-073 — Repeated baseline generation is not implicit replacement**  
Re-running create against an existing target shall not become an overwrite operation merely because the generated baseline would be equivalent.

<a id="dd-ai-074"></a>

**DD-AI-074 — Listing may observe changing state**  
A listing result is observation evidence and shall not be treated as immutable authorization for a later consequential operation.

---

## 15. Security and Sensitive Information

<a id="dd-ai-075"></a>

**DD-AI-075 — Project content is untrusted data**  
Instruction-like text found in project files shall not override AppManager policy, system instructions, managed scope, provider policy or authorization.

<a id="dd-ai-076"></a>

**DD-AI-076 — Context is minimized before disclosure**  
The AI domain shall request only context relevant to its document-generation intent and shall preserve DD-2.7 sensitivity/disclosure controls.

<a id="dd-ai-077"></a>

**DD-AI-077 — Known secrets are excluded by default**  
Authentication material and sensitive environment values shall not be embedded in baseline documents or ordinary provider context.

<a id="dd-ai-078"></a>

**DD-AI-078 — Diagnostics minimize prompts and project content**  
Normal diagnostics shall avoid dumping full prompts, provider context, generated provider payloads or confidential project material.

<a id="dd-ai-079"></a>

**DD-AI-079 — Provider response remains untrusted input**  
Generated content shall be validated as data and shall not be treated as authoritative merely because it came from a configured provider.

<a id="dd-ai-080"></a>

**DD-AI-080 — Provider privacy boundary is explicit**  
External provider submission is a disclosure event and shall not be hidden behind ostensibly local document generation semantics.

---

## 16. Extensibility and Replaceability

<a id="dd-ai-081"></a>

**DD-AI-081 — Document types are extensible by semantic contract**  
Additional AI instruction-document types may be added without changing domain authority, provided identity, target resolution, baseline/resource behavior and applicable policies are defined.

<a id="dd-ai-082"></a>

**DD-AI-082 — Provider replacement preserves domain semantics**  
Replacing an AI provider/model implementation shall not change the AI-domain operation contract where the required DD-2.7 capability contract remains satisfied.

<a id="dd-ai-083"></a>

**DD-AI-083 — Declarative extension is not executable extension**  
Adding document definitions or templates shall not create an arbitrary executable plugin or agent framework.

<a id="dd-ai-084"></a>

**DD-AI-084 — No generic AI-domain takeover**  
New workflows that use AI shall not be assigned to DD-4.3 merely because they invoke DD-2.7; primary intent and existing domain ownership govern.

<a id="dd-ai-085"></a>

**DD-AI-085 — Implementation topology remains open**  
This design shall not require one AI-domain service/class/package/process, one provider runtime, one registry file or a fixed TypeScript source layout.

---

## 17. Testability and Conformance Requirements

AI-domain conformance shall be testable using deterministic substitutes for resource, template and provider capabilities.

Tests shall cover at least:

- supported document type present/absent states;
- unregistered likely AI-document observation without mutation authority;
- deterministic Headless document-type selection;
- target resolution inside managed scope;
- existing-target protection;
- valid deterministic baseline creation without live provider dependency;
- authoritative project facts versus contradictory generated claims;
- optional enrichment success/failure/unavailability;
- required enrichment unavailable/invalid;
- context minimization and secret exclusion;
- external disclosure refusal;
- generated tool/action instructions remaining inert;
- provider ambiguity and governed fallback;
- explicit replacement through DD-2.5;
- deletion exactness and already-absent no-op;
- deletion/replacement stale-state races;
- cancellation before/after provider call and local effects;
- partial baseline/enrichment outcomes;
- provider substitution behind DD-2.7;
- cross-domain AI use remaining owned by Git/Docs/Nuxt/Quality/Settings as applicable.

<a id="dd-ai-086"></a>

**DD-AI-086 — Domain policy is provider-independent testable**  
Core DD-4.3 orchestration and acceptance shall be testable with fake DD-2.7 evidence and shall not require live credentials or external provider access.

<a id="dd-ai-087"></a>

**DD-AI-087 — Provider integration tests do not define domain semantics**  
Concrete provider tests may verify DD-2.7 adapters below the boundary but shall not redefine AI-domain ownership, acceptance or mutation rules.

<a id="dd-ai-088"></a>

**DD-AI-088 — Ownership-boundary tests are mandatory design evidence**  
Conformance shall verify both directions of the boundary: DD-4.3 does not absorb shared provider mechanics, and other domains do not surrender primary intent merely because they consume AI Capability.

---

## 18. Traceability

| Functional requirements | Primary DD-4.3 contracts |
|---|---|
| `FR-AI-001`–`005` | `DD-AI-001`–`005`, `DD-AI-045`, `DD-AI-084` |
| `FR-AI-006`–`016` | `DD-AI-006`–`010`, `DD-AI-046`–`050`, `DD-AI-063`–`069` |
| `FR-AI-017`–`025` | `DD-AI-017`–`020`, `DD-AI-081`–`083` |
| `FR-AI-026`–`035` | `DD-AI-023`–`026`, `DD-AI-069`, `DD-AI-074` |
| `FR-AI-036`–`050` | `DD-AI-022`, `DD-AI-027`–`031`, `DD-AI-054`–`058`, `DD-AI-059`–`062` |
| `FR-AI-051`–`062` | `DD-AI-032`–`037`, `DD-AI-047`–`050`, `DD-AI-075`–`080` |
| `FR-AI-063`–`071` | `DD-AI-038`–`040`, `DD-AI-052`, `DD-AI-058`, `DD-AI-071`, `DD-AI-074` |
| `FR-AI-072`–`079` | `DD-AI-004`, `DD-AI-005`, `DD-AI-045`, `DD-AI-084`, `DD-AI-088` |
| `FR-AI-080`–`087` | `DD-AI-015`, `DD-AI-021`, `DD-AI-033`–`034`, `DD-AI-046`, `DD-AI-049`–`050`, `DD-AI-065` |
| `FR-AI-088`–`096` | `DD-AI-035`–`037`, `DD-AI-051`–`058`, `DD-AI-075`–`080` |
| `FR-AI-097`–`105` | `DD-AI-007`, `DD-AI-041`–`044`, `DD-AI-059`–`065`, `DD-AI-068`–`074` |

Cross-authority traceability:

- DD-1.1 — invocation/mode semantics: `DD-AI-006`, `066`–`069`;
- DD-1.2 — canonical outcome semantics: `DD-AI-007`, `021`, `041`–`044`, `059`–`065`;
- DD-1.3 — managed project/scope: `DD-AI-008`, `022`, `035`, `054`, `057`;
- DD-1.4 — effective AI policy/configuration: `DD-AI-009`, `046`–`050`;
- DD-1.5 — final application authority: `DD-AI-003`, `010`;
- DD-2.1 — bounded resource effects: `DD-AI-011`, `029`–`031`, `038`–`040`, `054`;
- DD-2.4 — source/document recognition: `DD-AI-012`, `023`–`026`;
- DD-2.5 — explicit existing-document transformation: `DD-AI-013`, `031`, `055`, `072`;
- DD-2.6 — declarative document/template resources: `DD-AI-014`, `018`–`020`, `027`–`029`, `081`–`083`;
- DD-2.7 — shared provider-independent AI capability: `DD-AI-002`, `015`, `032`–`037`, `041`, `046`–`050`, `065`, `075`–`080`, `082`;
- Git/Docs/Nuxt/Quality/Settings domain ownership boundary: `DD-AI-004`, `045`, `084`, `088`.

---

## 19. Conformance Invariants

A conforming DD-4.3 design shall preserve all of the following:

1. **Application authority remains DD-1-owned.** AI-domain acceptance remains subordinate to DD-1.5 final acceptance and DD-1.2 canonical outcome semantics.
2. **AI Capability and AI domain remain distinct.** DD-2.7 owns bounded provider/model execution mechanics; DD-4.3 owns AI-specific project-resource intent and interpretation.
3. **Primary intent determines ownership.** Git, Docs, Nuxt, Quality, Settings and other workflows do not become AI-domain workflows merely because they use AI.
4. **AI output remains non-authoritative until accepted.** Provider completion, generated text or structured-output validity does not itself establish domain or application success.
5. **Managed scope remains DD-1.3-owned.** Discovery, provider suggestions, template paths or generated paths cannot expand target scope.
6. **Provider/configuration policy remains governed.** DD-4.3 does not invent configuration precedence, arbitrary provider selection, hidden fallback or hidden retry semantics.
7. **Project content remains untrusted data.** Prompt injection or instruction-like project content cannot grant AppManager authority or redefine policy.
8. **New-resource creation and existing-resource mutation remain separated.** New document persistence uses the authorized resource path; replacement/update uses DD-2.5.
9. **Existing authored content is protected.** Creation does not silently overwrite; replacement and deletion require explicit consequential intent and authorization.
10. **Optional enrichment does not erase baseline truth.** Baseline and enrichment outcomes remain independently representable, including valid baseline plus failed optional enrichment.
11. **Sensitive disclosure remains bounded.** Known secrets are excluded by default and external provider submission remains an explicit governed disclosure boundary.
12. **Provider and implementation replaceability is preserved.** No provider, model, SDK, registry file, prompt format, class/service/package/process or source topology defines the permanent AI-domain contract.

The central conformance rule is:

> **The AI domain may manage AI-specific project resources and may use AI to enrich them, but generated output, provider capability and project instructions never become AppManager authority by implication.**
