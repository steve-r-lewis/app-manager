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

This specification refines [AI Functional contracts](../functional/ai-functional-specification-v01.md) for the project-side AI development environment. Its resource graph and family lifecycle connect baseline project facts, optional enrichment and accepted project resources. The provider execution seam is [AI Capability](../dd_2_shared_capabilities/dd-2-7-ai-capability-detailed-design-v01.md); proposal interpretation follows [Design §11.10](../appmanager-design-specification-v01.md#_11-10-ai-assisted-workflow).

The collaboration in §§5–6 applies [Design §6.2](../appmanager-design-specification-v01.md#_6-2-application-engine-authority) and [§6.6](../appmanager-design-specification-v01.md#_6-6-capability-boundaries-and-providers) to the domain’s context, specialist delegation and final acceptance.

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

The resource graph and family workflows refine [FR-AI-001](../functional/ai-functional-specification-v01.md#fr-ai-001) and [Design](../appmanager-design-specification-v01.md#_10-6-ai-domain).

<a id="dd-ai-002"></a>

**DD-AI-002 — DD-2.7 remains the shared AI execution authority**

The §6 execution collaboration consumes [DD-2.7 AI Capability](../dd_2_shared_capabilities/dd-2-7-ai-capability-detailed-design-v01.md) under [Design](../appmanager-design-specification-v01.md#_6-6-capability-boundaries-and-providers).

<a id="dd-ai-003"></a>

**DD-AI-003 — Application authority remains above the AI domain**

AI-domain evidence interpretation follows [Design](../appmanager-design-specification-v01.md#_11-11-workflow-results-failure-and-acceptance) and final acceptance follows [Design](../appmanager-design-specification-v01.md#_6-2-application-engine-authority).


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

Other domains consuming DD-2.7 retain ownership under [Design](../appmanager-design-specification-v01.md#_10-6-ai-domain).

<a id="dd-ai-005"></a>

**DD-AI-005 — AI-document management is not provider management**

Instruction-resource provider association follows [FR-AI-022](../functional/ai-functional-specification-v01.md#fr-ai-022).


---

## 5. Consumed DD-1 Application Core Contracts

<a id="dd-ai-006"></a>

**DD-AI-006 — Invocation binding**

The domain consumes [DD-1.1 invocation](../dd_1_application_core/dd-1-1-application-invocation-detailed-design-v01.md) for normalized intent, interaction and cancellation context.

<a id="dd-ai-007"></a>

**DD-AI-007 — Outcome binding**

AI-resource evidence composes [DD-1.2 outcomes](../dd_1_application_core/dd-1-2-execution-outcomes-detailed-design-v01.md#_7-outcome-contract).

<a id="dd-ai-008"></a>

**DD-AI-008 — Managed-project binding**

Project resource operations bind [Design](../appmanager-design-specification-v01.md#_9-6-project-discovery-and-context-resolution) and [Design](../appmanager-design-specification-v01.md#_9-7-managed-scope-and-operation-targeting) to DD-1.3.

<a id="dd-ai-009"></a>

**DD-AI-009 — Configuration binding**

Provider/model, enrichment, disclosure, timeout and fallback policy consume [DD-1.4 resolution results](../dd_1_application_core/dd-1-4-configuration-resolution-detailed-design-v01.md#_15-resolution-result).

<a id="dd-ai-010"></a>

**DD-AI-010 — Application Engine binding**

Consequential coordination and final acceptance follows [Design](../appmanager-design-specification-v01.md#_6-2-application-engine-authority).


---

## 6. Consumed DD-2 Shared Capabilities

<a id="dd-ai-011"></a>

**DD-AI-011 — Resource Access composition**

Instruction creation/deletion consumes [DD-2.1](../dd_2_shared_capabilities/dd-2-1-resource-access-detailed-design-v01.md) under [Design](../appmanager-design-specification-v01.md#_6-6-capability-boundaries-and-providers).

<a id="dd-ai-012"></a>

**DD-AI-012 — Source Intelligence composition**

Existing-document recognition consumes [DD-2.4](../dd_2_shared_capabilities/dd-2-4-source-intelligence-detailed-design-v01.md) under [Design](../appmanager-design-specification-v01.md#_9-9-non-destructive-ownership-and-unmanaged-content).

<a id="dd-ai-013"></a>

**DD-AI-013 — Source Transformation composition**

Existing-instruction updates bind [FR-AI-042](../functional/ai-functional-specification-v01.md#fr-ai-042) and [FR-XFORM-033](../functional/source-transformation-functional-specification-v01.md#fr-xform-033) to DD-2.5 with explicit domain intent and scope.

<a id="dd-ai-014"></a>

**DD-AI-014 — Registry and Template composition**

Document definitions/templates consume [DD-2.6](../dd_2_shared_capabilities/dd-2-6-resource-registry-and-template-detailed-design-v01.md) under [Design](../appmanager-design-specification-v01.md#_6-8-generation-and-templates).

<a id="dd-ai-015"></a>

**DD-AI-015 — AI Capability composition**

Live enrichment uses [DD-2.7 AI Capability](../dd_2_shared_capabilities/dd-2-7-ai-capability-detailed-design-v01.md) for its bounded request/context/provider contract.

<a id="dd-ai-016"></a>

**DD-AI-016 — Capability composition does not merge responsibilities**

The §6 collaborations bind [Design](../appmanager-design-specification-v01.md#_6-6-capability-boundaries-and-providers) without changing their specialist owners.


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

Provider/tool metadata follows [FR-AI-022](../functional/ai-functional-specification-v01.md#fr-ai-022).

<a id="dd-ai-020"></a>

**DD-AI-020 — Examples remain non-exclusive**

Document examples follow [FR-AI-019](../functional/ai-functional-specification-v01.md#fr-ai-019).

### 7.3 AI-domain result payload

An AI-domain result carries the applicable semantic resource identity, resolved representation and target, scope/applicability, graph references, provider/tool association, presence, support/partial-representation state, revision evidence and policy state. For content workflows it distinguishes deterministic baseline, enrichment requested/performed/skipped/failed, and proposed versus accepted content provenance. It composes capability warnings, persistence/transformation effects, stale/conflict and no-op evidence, and recovery guidance beneath the [DD-1.2 outcome](../dd_1_application_core/dd-1-2-execution-outcomes-detailed-design-v01.md#_7-outcome-contract).

<a id="dd-ai-021"></a>

**DD-AI-021 — Provider detail remains subordinate**

Provider/model provenance follows [FR-AI-061](../functional/ai-functional-specification-v01.md#fr-ai-061).


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

Instruction listing follows [FR-AI-027](../functional/ai-functional-specification-v01.md#fr-ai-027).

<a id="dd-ai-024"></a>

**DD-AI-024 — Supported types and project presence are distinct facts**

Listing composes supported-type/presence evidence under [FR-AI-028](../functional/ai-functional-specification-v01.md#fr-ai-028), [FR-AI-029](../functional/ai-functional-specification-v01.md#fr-ai-029) and [FR-AI-031](../functional/ai-functional-specification-v01.md#fr-ai-031) without collapsing unregistered observation into supported identity.

<a id="dd-ai-025"></a>

**DD-AI-025 — Unregistered observation is conservative**

Unregistered observation follows [FR-AI-031](../functional/ai-functional-specification-v01.md#fr-ai-031), [FR-AI-032](../functional/ai-functional-specification-v01.md#fr-ai-032) and [FR-AI-033](../functional/ai-functional-specification-v01.md#fr-ai-033).

<a id="dd-ai-026"></a>

**DD-AI-026 — Discovery grants no deletion authority**

Listing candidates follow [FR-AI-069](../functional/ai-functional-specification-v01.md#fr-ai-069) at the deletion boundary.

### 8.3 Creation and deterministic baseline

<a id="dd-ai-027"></a>

**DD-AI-027 — Baseline path is explicit**

Baseline generation follows [FR-AI-044](../functional/ai-functional-specification-v01.md#fr-ai-044).

<a id="dd-ai-028"></a>

**DD-AI-028 — Project facts are authoritative inputs**

Inserted project facts follow [FR-AI-046](../functional/ai-functional-specification-v01.md#fr-ai-046).

<a id="dd-ai-029"></a>

**DD-AI-029 — Baseline rendering is not persistence**

DD-2.6 proposed content binds [Design](../appmanager-design-specification-v01.md#_6-8-generation-and-templates) to the separately authorized creation stage.

<a id="dd-ai-030"></a>

**DD-AI-030 — Existing target is protected**

Create collisions follow [FR-AI-041](../functional/ai-functional-specification-v01.md#fr-ai-041).

<a id="dd-ai-031"></a>

**DD-AI-031 — Replacement is a separate consequential intent**

Instruction update follows [FR-AI-042](../functional/ai-functional-specification-v01.md#fr-ai-042) through [FR-XFORM-033](../functional/source-transformation-functional-specification-v01.md#fr-xform-033) and DD-2.5.

### 8.4 Optional enrichment

<a id="dd-ai-032"></a>

**DD-AI-032 — Enrichment is subordinate to baseline semantics**

The baseline/enrichment distinction follows [FR-AI-044](../functional/ai-functional-specification-v01.md#fr-ai-044) and [FR-AI-049](../functional/ai-functional-specification-v01.md#fr-ai-049).

<a id="dd-ai-033"></a>

**DD-AI-033 — Optional provider unavailability need not fail baseline creation**

Optional enrichment failure follows [FR-AI-053](../functional/ai-functional-specification-v01.md#fr-ai-053), [FR-AI-049](../functional/ai-functional-specification-v01.md#fr-ai-049) and [FR-AI-100](../functional/ai-functional-specification-v01.md#fr-ai-100).

<a id="dd-ai-034"></a>

**DD-AI-034 — Required AI assistance fails explicitly**  
Where a document type/use case explicitly requires live AI capability, unsupported or unavailable DD-2.7 capability shall prevent ordinary complete acceptance rather than silently degrade to a materially different operation.

<a id="dd-ai-035"></a>

**DD-AI-035 — Context selection is domain-intent bounded**

Document-enrichment context selection binds [FR-AI-088](../functional/ai-functional-specification-v01.md#fr-ai-088) to the DD-2.7 disclosure boundary.

<a id="dd-ai-036"></a>

**DD-AI-036 — Generated claims cannot override reliable facts**

Enrichment fact acceptance follows [FR-AI-059](../functional/ai-functional-specification-v01.md#fr-ai-059).

<a id="dd-ai-037"></a>

**DD-AI-037 — Provider response requires domain acceptance**

Instruction enrichment binds [FR-AI-060](../functional/ai-functional-specification-v01.md#fr-ai-060) to the prior acceptance policy in [Design](../appmanager-design-specification-v01.md#_11-10-ai-assisted-workflow). The local validation target is the selected document contract.

### 8.5 Deletion

<a id="dd-ai-038"></a>

**DD-AI-038 — Deletion eligibility is explicit**

Deletion eligibility binds [FR-AI-064](../functional/ai-functional-specification-v01.md#fr-ai-064) to the resolved selected instruction resource.

<a id="dd-ai-039"></a>

**DD-AI-039 — Exact target deletion**

Instruction deletion follows [FR-AI-068](../functional/ai-functional-specification-v01.md#fr-ai-068).

<a id="dd-ai-040"></a>

**DD-AI-040 — Already absent may be unchanged**

Absent-target deletion follows [FR-AI-067](../functional/ai-functional-specification-v01.md#fr-ai-067).


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

Provider completion and domain interpretation follow [Design](../appmanager-design-specification-v01.md#_11-11-workflow-results-failure-and-acceptance) at the DD-2.7 seam.

<a id="dd-ai-042"></a>

**DD-AI-042 — Baseline and enrichment state remain independently visible**

The result separates baseline and enrichment under [FR-AI-049](../functional/ai-functional-specification-v01.md#fr-ai-049).

<a id="dd-ai-043"></a>

**DD-AI-043 — Completed local effects remain historical facts**

Completed creation/deletion effects follow [FR-INV-045](../functional/application-invocation-functional-specification-v01.md#fr-inv-045).

<a id="dd-ai-044"></a>

**DD-AI-044 — Indeterminate effect is first-class**  
If a local effect may have occurred but cannot be verified reliably, the domain shall represent indeterminate state rather than guess.

---

## 10. Domain Policy and Decision Rules

<a id="dd-ai-045"></a>

**DD-AI-045 — Primary intent decides domain ownership**

Primary-intent ownership follows [Design](../appmanager-design-specification-v01.md#_10-6-ai-domain).

<a id="dd-ai-046"></a>

**DD-AI-046 — Provider choice is consumed policy**

Provider selection follows [FR-AI-081](../functional/ai-functional-specification-v01.md#fr-ai-081) through DD-1.4/DD-2.7; the AI domain supplies operation-specific constraints.

<a id="dd-ai-047"></a>

**DD-AI-047 — Optional versus required enrichment is explicit policy**  
Whether enrichment is optional, required or prohibited shall be established before provider execution where it affects acceptance.

<a id="dd-ai-048"></a>

**DD-AI-048 — External disclosure is not an invisible side effect**

External submission follows [FR-AI-096](../functional/ai-functional-specification-v01.md#fr-ai-096).

<a id="dd-ai-049"></a>

**DD-AI-049 — Unsupported and unavailable remain distinct**

Type/capability/provider availability is interpreted under [FR-AI-014](../functional/ai-functional-specification-v01.md#fr-ai-014).

<a id="dd-ai-050"></a>

**DD-AI-050 — Provider fallback is governed**

Provider retry/fallback follows [FR-AI-084](../functional/ai-functional-specification-v01.md#fr-ai-084) and [FR-AI-085](../functional/ai-functional-specification-v01.md#fr-ai-085) through DD-2.7.

<a id="dd-ai-051"></a>

**DD-AI-051 — Generated action suggestions are inert**

Generated command/tool/edit suggestions follow [Design](../appmanager-design-specification-v01.md#_11-10-ai-assisted-workflow).


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

Recognized document targets follow [Design](../appmanager-design-specification-v01.md#_9-9-non-destructive-ownership-and-unmanaged-content).

<a id="dd-ai-053"></a>

**DD-AI-053 — AI output does not grant write authority**

AI-generated persistence proposals follow [Design](../appmanager-design-specification-v01.md#_11-10-ai-assisted-workflow).

<a id="dd-ai-054"></a>

**DD-AI-054 — New-resource creation is bounded**

New-document persistence binds [Design](../appmanager-design-specification-v01.md#_6-8-generation-and-templates) to the resolved target under [FR-PROJ-044](../functional/managed-project-functional-specification-v01.md#fr-proj-044).

<a id="dd-ai-055"></a>

**DD-AI-055 — Existing-resource mutation routes through DD-2.5**

Existing-content updates bind [FR-XFORM-033](../functional/source-transformation-functional-specification-v01.md#fr-xform-033) to DD-2.5 preconditions, stale-state checks and source validation.

<a id="dd-ai-056"></a>

**DD-AI-056 — Existing authored content is protected**

Authored instruction content follows [FR-AI-041](../functional/ai-functional-specification-v01.md#fr-ai-041) and [FR-AI-042](../functional/ai-functional-specification-v01.md#fr-ai-042).

<a id="dd-ai-057"></a>

**DD-AI-057 — Path safety is authoritative**

Provider/template paths bind [FR-PROJ-044](../functional/managed-project-functional-specification-v01.md#fr-proj-044) to document-type scope.

<a id="dd-ai-058"></a>

**DD-AI-058 — Consequential authorization is mode-independent**

Consequential AI-resource authorization follows [FR-INV-022](../functional/application-invocation-functional-specification-v01.md#fr-inv-022) and [FR-INV-023](../functional/application-invocation-functional-specification-v01.md#fr-inv-023) across modes.


---

## 12. Failure, Cancellation, and Partial Effects

<a id="dd-ai-059"></a>

**DD-AI-059 — Failure is stage-attributable**

Failure attribution follows [FR-AI-098](../functional/ai-functional-specification-v01.md#fr-ai-098). Type resolution, template rendering and provider-output validation remain distinguishable where material within those stages.

<a id="dd-ai-060"></a>

**DD-AI-060 — Optional enrichment failure may yield baseline success**

Optional enrichment failure follows [FR-AI-053](../functional/ai-functional-specification-v01.md#fr-ai-053) and [FR-AI-049](../functional/ai-functional-specification-v01.md#fr-ai-049).

<a id="dd-ai-061"></a>

**DD-AI-061 — Required enrichment failure prevents complete acceptance**

Required enrichment is interpreted under [DD-AI-034](#dd-ai-034). Failed or invalid enrichment cannot satisfy its required acceptance condition.

<a id="dd-ai-062"></a>

**DD-AI-062 — No false rollback**

Provider/local-effect rollback claims follow [FR-INV-046](../functional/application-invocation-functional-specification-v01.md#fr-inv-046).

<a id="dd-ai-063"></a>

**DD-AI-063 — Cancellation stops future work**

Enrichment/effect cancellation follows [FR-AI-016](../functional/ai-functional-specification-v01.md#fr-ai-016) and [DD-1.2 cancellation propagation](../dd_1_application_core/dd-1-2-execution-outcomes-detailed-design-v01.md#_17-cancellation-model) through DD-2.7/DD-2.5/DD-2.1.

<a id="dd-ai-064"></a>

**DD-AI-064 — Cancellation preserves completed work**

Completed baseline/provider/local-effect evidence follows [FR-INV-045](../functional/application-invocation-functional-specification-v01.md#fr-inv-045).

<a id="dd-ai-065"></a>

**DD-AI-065 — Provider uncertainty remains subordinate evidence**  
Indeterminate provider completion after timeout/network/cancellation shall be preserved as DD-2.7 evidence and interpreted by the AI domain according to whether a local accepted effect depended on it.

---

## 13. Headless and Interaction Independence

<a id="dd-ai-066"></a>

**DD-AI-066 — One semantic contract across adapters**

AI-resource adapter projections follow [Design](../appmanager-design-specification-v01.md#_4-6-presentation-independence).

<a id="dd-ai-067"></a>

**DD-AI-067 — Interactive selection is presentation**

Document/candidate/enrichment choice acquisition uses [FR-INV-019](../functional/application-invocation-functional-specification-v01.md#fr-inv-019) and the §7 intent model.

<a id="dd-ai-068"></a>

**DD-AI-068 — Headless ambiguity fails safely**

Unresolved document type, target, provider or mutation intent follows [FR-AI-105](../functional/ai-functional-specification-v01.md#fr-ai-105) and [FR-INV-020](../functional/application-invocation-functional-specification-v01.md#fr-inv-020) for Headless execution.

<a id="dd-ai-069"></a>

**DD-AI-069 — Machine-consumable listing and outcomes**

The document identity/presence/result model is exposed under [FR-INV-021](../functional/application-invocation-functional-specification-v01.md#fr-inv-021).


---

## 14. Concurrency, Idempotency, and Conflict Behaviour

<a id="dd-ai-070"></a>

**DD-AI-070 — Creation revalidates existence**  
Where practical, create shall revalidate that the target remains absent immediately before persistence.

<a id="dd-ai-071"></a>

**DD-AI-071 — Deletion revalidates target state**

Deletion race handling follows [FR-AI-070](../functional/ai-functional-specification-v01.md#fr-ai-070).

<a id="dd-ai-072"></a>

**DD-AI-072 — Replacement is stale-sensitive**

Replacement/update concurrency follows [FR-XFORM-068](../functional/source-transformation-functional-specification-v01.md#fr-xform-068) and [FR-XFORM-069](../functional/source-transformation-functional-specification-v01.md#fr-xform-069) through DD-2.5 revision/precondition evidence.

<a id="dd-ai-073"></a>

**DD-AI-073 — Repeated baseline generation is not implicit replacement**

Repeated create requests remain subject to [FR-AI-041](../functional/ai-functional-specification-v01.md#fr-ai-041).

<a id="dd-ai-074"></a>

**DD-AI-074 — Listing may observe changing state**  
A listing result is observation evidence and shall not be treated as immutable authorization for a later consequential operation.

---

## 15. Security and Sensitive Information

<a id="dd-ai-075"></a>

**DD-AI-075 — Project content is untrusted data**

Project instruction-like content follows [FR-AI-090](../functional/ai-functional-specification-v01.md#fr-ai-090).

<a id="dd-ai-076"></a>

**DD-AI-076 — Context is minimized before disclosure**

Document-generation context follows [FR-AI-088](../functional/ai-functional-specification-v01.md#fr-ai-088) and [FR-AI-089](../functional/ai-functional-specification-v01.md#fr-ai-089) through DD-2.7.

<a id="dd-ai-077"></a>

**DD-AI-077 — Known secrets are excluded by default**

Provider context applies [FR-AI-089](../functional/ai-functional-specification-v01.md#fr-ai-089). Baseline documents shall likewise exclude known authentication material and sensitive environment values.

<a id="dd-ai-078"></a>

**DD-AI-078 — Diagnostics minimize prompts and project content**

Prompt/context diagnostics follow [FR-AI-095](../functional/ai-functional-specification-v01.md#fr-ai-095); generated provider payloads are also subject to [FR-INV-040](../functional/application-invocation-functional-specification-v01.md#fr-inv-040).

<a id="dd-ai-079"></a>

**DD-AI-079 — Provider response remains untrusted input**

Provider content validation follows [FR-AI-060](../functional/ai-functional-specification-v01.md#fr-ai-060) and [Design](../appmanager-design-specification-v01.md#_11-10-ai-assisted-workflow).

<a id="dd-ai-080"></a>

**DD-AI-080 — Provider privacy boundary is explicit**

External submission follows [FR-AI-096](../functional/ai-functional-specification-v01.md#fr-ai-096) even within otherwise local document generation.


---

## 16. Extensibility and Replaceability

<a id="dd-ai-081"></a>

**DD-AI-081 — Document types are extensible by semantic contract**  
Additional AI instruction-document types may be added without changing domain authority, provided identity, target resolution, baseline/resource behavior and applicable policies are defined.

<a id="dd-ai-082"></a>

**DD-AI-082 — Provider replacement preserves domain semantics**

DD-2.7 substitution follows [FR-AI-005](../functional/ai-functional-specification-v01.md#fr-ai-005) and [Design](../appmanager-design-specification-v01.md#_6-6-capability-boundaries-and-providers).

<a id="dd-ai-083"></a>

**DD-AI-083 — Declarative extension is not executable extension**

Document definitions/templates follow [Design](../appmanager-design-specification-v01.md#_13-2-extension-classes).

<a id="dd-ai-084"></a>

**DD-AI-084 — No generic AI-domain takeover**

New AI-assisted workflows follow [Design](../appmanager-design-specification-v01.md#_10-6-ai-domain).

<a id="dd-ai-085"></a>

**DD-AI-085 — Implementation topology remains open**

Concrete domain service/class/package/process/provider-runtime/registry/source-layout decisions follow [the Implementation Specification boundary](../project-documentation-guide-v01.md#_8-level-4-implementation-specification).


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

Conformance review follows the resource graph, baseline/enrichment distinction and resource family lifecycle in §7 and the inspection, creation, replacement, deletion and aggregate resource management in §8. The policy, lifecycle, failure/recovery and security clauses in §§9–16 supply their local acceptance and uncertainty conditions. §18 identifies the upstream contracts; this index adds no independent invariant set.
