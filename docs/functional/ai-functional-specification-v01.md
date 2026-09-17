# AppManager AI Functional Specification

> **Status:** Version 1 Functional Specification
>
> **Functional domain:** `ai`
>
> **Requirement prefix:** `FR-AI`
>
> **Governing sources:** [Project Documentation Guide](../project-documentation-guide-v01.md), [AppManager Design Specification](../appmanager-design-specification-v01.md)
>
> **Related Functional Specifications:** [application-invocation-functional-specification-v01.md](application-invocation-functional-specification-v01.md), [managed-project-functional-specification-v01.md](managed-project-functional-specification-v01.md), [configuration-functional-specification-v01.md](configuration-functional-specification-v01.md), [source-transformation-functional-specification-v01.md](source-transformation-functional-specification-v01.md), [settings-functional-specification-v01.md](settings-functional-specification-v01.md)
>
> **Historical planning provenance (non-normative):** [docs/project_management/functional-specification-decomposition-plan-v01.md](../project_management/functional-specification-decomposition-plan-v01.md)

## 1. Purpose

This specification defines the observable Version 1 behaviour of the AppManager `ai` domain.

The `ai` domain manages the project-side AI development environment described in [Design §10.6](../appmanager-design-specification-v01.md#_10-6-ai-domain). Instructions are one resource family alongside prompts, agents, skills, tools and policy. It does not become the owner of every workflow that uses an LLM, AI provider, model-generated suggestion or agent capability internally.

Version 1 provides aggregate inspection and the family-specific operations in §2.3. Examples such as `CLAUDE.md`, `GEMINI.md` and generic agent-instruction documents are examples of supported document classes, not an exhaustive list or an architectural commitment to particular providers.

---

## 2. Functional Boundary

### 2.1 Owned behaviour

The `ai` domain owns observable behaviour for:

- discovering recognized project AI instruction documents;
- distinguishing recognized and unrecognized AI-oriented instruction documents where supported;
- listing supported AI instruction document types;
- listing which supported AI instruction documents are present in a managed project;
- creating a selected project AI instruction document;
- deleting a selected project AI instruction document;
- using declarative AI-document templates where supported;
- optionally enriching generated AI instruction documents with delegated AI assistance;
- reporting AI provider/capability availability where required by an AI-owned use case;
- producing structured, deterministic outcomes suitable for interactive and Headless operation.

### 2.2 Explicit non-ownership

This specification does not define:

- Git commit-message generation merely because AI assistance is used;
- documentation summarization or generation when documentation is the primary intent;
- Nuxt layer generation or source transformation when Nuxt/source modification is the primary intent;
- automatic version derivation merely because AI contributes a suggestion;
- provider implementation details, SDKs, APIs, model identifiers or authentication mechanisms;
- general executable agents, autonomous coding systems or arbitrary command execution;
- a general-purpose AI plugin marketplace or executable plugin framework;
- configuration precedence for model/provider settings;
- generic template-resource CRUD where Settings is the primary resource-management intent.

<a id="fr-ai-001"></a>

**FR-AI-001 — Primary-intent ownership**  
An AI-domain use case shall have AI-specific project management or AI-resource management as its primary application intent.

<a id="fr-ai-002"></a>

**FR-AI-002 — Delegated AI does not transfer authority**  
Domain ownership when AI is delegated shall conform to [Design §10.6](../appmanager-design-specification-v01.md#_10-6-ai-domain).

<a id="fr-ai-003"></a>

**FR-AI-003 — Application Engine authority**  
Generated-output acceptance shall apply [Design §11.10](../appmanager-design-specification-v01.md#_11-10-ai-assisted-workflow).

<a id="fr-ai-004"></a>

**FR-AI-004 — No autonomous authority**  
AI provider, model and response authority shall apply [Design §11.10](../appmanager-design-specification-v01.md#_11-10-ai-assisted-workflow).

<a id="fr-ai-005"></a>

**FR-AI-005 — Provider independence**  
The Functional Specification shall not require a particular AI provider, model family, transport or SDK unless a future approved specification deliberately makes one part of the product contract.

---

### 2.3 Canonical Version 1 Command Surface

| Family | Canonical identities |
|---|---|
| Environment | `ai.inspect` |
| Instruction | `ai.instruction.list`, `ai.instruction.create`, `ai.instruction.update`, `ai.instruction.delete` |
| Prompt | `ai.prompt.list`, `ai.prompt.create`, `ai.prompt.update`, `ai.prompt.delete` |
| Agent | `ai.agent.list`, `ai.agent.create`, `ai.agent.update`, `ai.agent.delete` |
| Skill | `ai.skill.list`, `ai.skill.add`, `ai.skill.remove` |
| Tool | `ai.tool.list`, `ai.tool.add`, `ai.tool.update`, `ai.tool.remove` |
| Policy | `ai.policy.inspect`, `ai.policy.configure` |

These are 22 canonical commands. `ai.instruction.update` replaces `ai.instruction.replace`; whole-resource replacement is a possible update effect. No `ai.prompt.run`, generic AI execution/action command or `ai.skill.update` is established. Family lists support targeted interaction and deterministic automation independently of aggregate inspection.

---

## 3. Common AI-Domain Invocation Behaviour

<a id="fr-ai-006"></a>

**FR-AI-006 — Structured invocation**  
AI-domain invocations shall apply [FR-INV-007](application-invocation-functional-specification-v01.md#fr-inv-007).

<a id="fr-ai-007"></a>

**FR-AI-007 — Structured outcome**  
Every AI-domain operation shall return an application-level structured outcome identifying the requested intent, resolved target and resulting effect or read-only result.

<a id="fr-ai-008"></a>

**FR-AI-008 — Interaction-mode equivalence**  
AI-domain operations across TUI, GUI, Headless and future adapters shall apply [Design §4.6](../appmanager-design-specification-v01.md#_4-6-presentation-independence).

<a id="fr-ai-009"></a>

**FR-AI-009 — Deterministic Headless operation**  
Headless AI target/type/authorisation shall apply [FR-INV-020](application-invocation-functional-specification-v01.md#fr-inv-020), [FR-INV-022](application-invocation-functional-specification-v01.md#fr-inv-022).

<a id="fr-ai-010"></a>

**FR-AI-010 — Unresolved target**  
Unresolved Headless AI type/target selection shall apply [FR-INV-020](application-invocation-functional-specification-v01.md#fr-inv-020).

<a id="fr-ai-011"></a>

**FR-AI-011 — Project context**  
Project-scoped AI context shall apply [Design §9.2](../appmanager-design-specification-v01.md#_9-2-managed-project-context).

<a id="fr-ai-012"></a>

**FR-AI-012 — Managed scope**  
Consequential AI-resource targets shall apply [FR-PROJ-044](managed-project-functional-specification-v01.md#fr-proj-044).

<a id="fr-ai-013"></a>

**FR-AI-013 — Effective configuration**  
AI provider/model/behaviour settings shall apply [FR-CONFIG-020](configuration-functional-specification-v01.md#fr-config-020).

<a id="fr-ai-014"></a>

**FR-AI-014 — Availability distinction**  
A known AI-domain use case shall distinguish between unsupported/unknown intent and temporary unavailability of an optional or required delegated AI capability.

<a id="fr-ai-015"></a>

**FR-AI-015 — Sensitive diagnostics**  
AI provider and project diagnostics shall apply [FR-INV-040](application-invocation-functional-specification-v01.md#fr-inv-040).

<a id="fr-ai-016"></a>

**FR-AI-016 — Cancellation**  
AI operations supporting cancellation shall stop initiation of further work as soon as safely practical. Local resource effects shall be reported under [FR-INV-031](application-invocation-functional-specification-v01.md#fr-inv-031).

---

## 4. AI Instruction Document Model

<a id="fr-ai-017"></a>

**FR-AI-017 — Instruction-document concept**  
A project AI instruction document is a managed project resource whose primary purpose is to communicate project-specific instructions, context, conventions or operational guidance to an AI assistant, agent or AI-capable tool.

<a id="fr-ai-018"></a>

**FR-AI-018 — Recognized document types**  
AppManager may maintain a supported set of recognized AI instruction document types.

<a id="fr-ai-019"></a>

**FR-AI-019 — Examples are non-exclusive**  
Examples including `CLAUDE.md`, `GEMINI.md` and `AGENTS.md` shall not be interpreted as the only document types that Version 1 architecture can support.

<a id="fr-ai-020"></a>

**FR-AI-020 — Document-type identity**  
Each supported AI instruction document type shall have an unambiguous semantic identity independent of presentation labels.

<a id="fr-ai-021"></a>

**FR-AI-021 — Provider association**  
A document type may be associated with a provider/tool or may be provider-agnostic.

<a id="fr-ai-022"></a>

**FR-AI-022 — Provider association is metadata**  
Association of an instruction-document type with a provider shall not imply that the provider is configured, available, authenticated or used by AppManager at invocation time.

<a id="fr-ai-023"></a>

**FR-AI-023 — Declarative resource model**  
AI instruction definitions and templates shall apply [Design §13.2](../appmanager-design-specification-v01.md#_13-2-extension-classes).

<a id="fr-ai-024"></a>

**FR-AI-024 — Template ownership boundary**  
Settings may expose aggregate template-resource management, but the AI domain retains AI-specific semantics for applying an AI instruction document template.

<a id="fr-ai-025"></a>

**FR-AI-025 — Plain-document semantics**  
AI instruction documents shall be treated according to their actual document format and shall not inherit source-code header requirements merely because AppManager source files use such headers.

---

### 4.1 Project-Side Environment Resources

AI resources form a provider-neutral graph: for example, an agent may reference instructions, skills, tools and policy, while a prompt may target an agent and a tool may reference a credential. Family operations preserve semantic identity even when supported environments use different files or schemas.

<a id="pbc-fr-ai-env-001"></a>

**PBC-FR-AI-ENV-001 — Aggregate inspection**

`ai.inspect` shall report the recognised project-side AI environment across supported resource families, representation state and material ambiguity/unsupported state without mutating the project.

<a id="pbc-fr-ai-env-002"></a>

**PBC-FR-AI-ENV-002 — Instructions**

Instruction operations shall manage resources with explicit semantic identity, scope and provider representation where applicable, using the instruction/scoped-rule model in [Design §10.6](../appmanager-design-specification-v01.md#_10-6-ai-domain).

<a id="pbc-fr-ai-env-003"></a>

**PBC-FR-AI-ENV-003 — Prompts**

Prompt operations shall manage the prompt resources defined in [Design §10.6](../appmanager-design-specification-v01.md#_10-6-ai-domain); application operations performed with a prompt remain subject to that section's domain/capability boundary.

<a id="pbc-fr-ai-env-004"></a>

**PBC-FR-AI-ENV-004 — Agents**

Agent operations shall manage named specialist agent definitions and their supported references to instructions, skills, tools, prompts or policy.

<a id="pbc-fr-ai-env-005"></a>

**PBC-FR-AI-ENV-005 — Skills**

Skill operations shall list, add and remove reusable project-side specialist knowledge/capability packages. Version 1 does not invent `skill.update` merely for CRUD symmetry.

<a id="pbc-fr-ai-env-006"></a>

**PBC-FR-AI-ENV-006 — Tools**

Tool operations shall manage the supported integration resources defined in [Design §10.6](../appmanager-design-specification-v01.md#_10-6-ai-domain), applying its provider-neutral representation boundary to MCP.

<a id="pbc-fr-ai-env-007"></a>

**PBC-FR-AI-ENV-007 — Policy**

AI policy shall include supported AI-specific context inclusion/exclusion, tool restrictions, execution/access constraints and related project-side controls. `ai.policy.configure` expresses semantic policy configuration rather than CRUD of an assumed policy file.

<a id="pbc-fr-ai-env-008"></a>

**PBC-FR-AI-ENV-008 — Partial representation**

Where a supported AI environment cannot represent an AppManager semantic resource or policy completely, AppManager shall preserve unsupported/partial/ambiguous state rather than claim equivalence.

<a id="pbc-fr-ai-env-009"></a>

**PBC-FR-AI-ENV-009 — Scope narrowing only**

AI-specific policy may narrow AI-visible or AI-operable scope but shall not broaden managed scope, mutation authority or application authority established by the Application Core.

<a id="pbc-fr-ai-env-010"></a>

**PBC-FR-AI-ENV-010 — Credential ownership**

AI tool/environment configuration may reference a required credential, but actual secret/environment values remain Settings-owned and subject to existing disclosure rules.

<a id="pbc-fr-ai-env-011"></a>

**PBC-FR-AI-ENV-011 — Tool configuration is not action authority**

Adding/configuring a tool integration shall not itself authorise an AI agent to perform every consequential operation exposed by that integration.

<a id="pbc-fr-ai-env-012"></a>

**PBC-FR-AI-ENV-012 — Referential integrity**

Where AI project resources reference other managed AI resources, AppManager shall preserve resolvable identity and report missing, ambiguous or unsupported references rather than silently fabricating them.

---

## 5. Listing AI Instruction Documents

<a id="fr-ai-026"></a>

**FR-AI-026 — List use case**  
AppManager shall provide a use case to list project AI instruction documents.

<a id="fr-ai-027"></a>

**FR-AI-027 — Read-only listing**  
Listing AI instruction documents shall be non-mutating.

<a id="fr-ai-028"></a>

**FR-AI-028 — Supported-type listing**  
The list result shall identify supported AI instruction document types known to AppManager where that information is exposed.

<a id="fr-ai-029"></a>

**FR-AI-029 — Presence state**  
For each supported document type, AppManager shall be capable of distinguishing whether a corresponding managed-project document is present or absent.

<a id="fr-ai-030"></a>

**FR-AI-030 — Existing document identity**  
Where present, a listed document shall be identified sufficiently for automation to distinguish document type and project-relative target.

<a id="fr-ai-031"></a>

**FR-AI-031 — Unregistered-document observation**  
AppManager may report likely AI-oriented instruction documents that are present but not registered as supported document types.

<a id="fr-ai-032"></a>

**FR-AI-032 — Unregistered is informational**  
Detection of an unregistered AI-oriented document shall not by itself be treated as an error.

<a id="fr-ai-033"></a>

**FR-AI-033 — Conservative classification**  
AppManager shall not claim that an arbitrary project document is an AI instruction document unless that classification is recognized or sufficiently supported by the applicable discovery policy.

<a id="fr-ai-034"></a>

**FR-AI-034 — No mutation authority from discovery**  
Discovered instruction-document candidates shall apply [Design §9.9](../appmanager-design-specification-v01.md#_9-9-non-destructive-ownership-and-unmanaged-content).

<a id="fr-ai-035"></a>

**FR-AI-035 — Machine-consumable listing**  
Instruction document identities and presence states shall apply [FR-INV-021](application-invocation-functional-specification-v01.md#fr-inv-021).

---

## 6. Creating AI Instruction Documents

<a id="fr-ai-036"></a>

**FR-AI-036 — Create use case**  
AppManager shall provide a use case to create a supported project AI instruction document.

<a id="fr-ai-037"></a>

**FR-AI-037 — Explicit document type**  
Creation shall resolve one explicit supported AI instruction document type before any write occurs.

<a id="fr-ai-038"></a>

**FR-AI-038 — Interactive selection**  
An interactive adapter may present supported document types for selection.

<a id="fr-ai-039"></a>

**FR-AI-039 — Headless selection**  
A Headless invocation shall identify the document type deterministically and shall reject an unknown type with a structured diagnostic.

<a id="fr-ai-040"></a>

**FR-AI-040 — Target resolution**  
The target location of the AI instruction document shall be resolved according to the document type and managed-project scope before generation.

<a id="fr-ai-041"></a>

**FR-AI-041 — Existing-target protection**  
Creation shall not silently overwrite an existing document.

<a id="fr-ai-042"></a>

**FR-AI-042 — Explicit replacement**  
`ai.instruction.update` shall provide explicit supported update of an existing instruction resource. Whole-resource replacement, when supported, is a consequential update disposition subject to applicable authorisation/confirmation semantics.

<a id="fr-ai-043"></a>

**FR-AI-043 — Generation versus transformation**  
Instruction-document creation/update dispositions shall apply [Design §6.8](../appmanager-design-specification-v01.md#_6-8-generation-and-templates).

<a id="fr-ai-044"></a>

**FR-AI-044 — Valid non-AI baseline**  
A supported AI instruction document type shall be capable of producing a valid baseline document without requiring a live AI provider unless that type is explicitly defined as provider-dependent.

<a id="fr-ai-045"></a>

**FR-AI-045 — Template-based baseline**  
Where a declarative template exists, AppManager may generate the baseline document from project facts, effective settings and the selected document type.

<a id="fr-ai-046"></a>

**FR-AI-046 — Project-fact accuracy**  
Project facts inserted into a generated AI instruction document shall come from recognized managed-project information or other authoritative application capabilities rather than unsupported guesses.

<a id="fr-ai-047"></a>

**FR-AI-047 — No secret synthesis**  
Sensitive configuration in generated instruction documents shall apply [FR-INV-040](application-invocation-functional-specification-v01.md#fr-inv-040).

<a id="fr-ai-048"></a>

**FR-AI-048 — Structured creation result**  
A successful creation result shall identify the created document type and resulting project-relative resource.

<a id="fr-ai-049"></a>

**FR-AI-049 — Partial creation outcome**  
If optional enrichment fails after a valid baseline document has been created, AppManager shall distinguish successful baseline creation from failed optional enrichment.

<a id="fr-ai-050"></a>

**FR-AI-050 — No false atomicity**  
AI local/provider transactionality claims shall apply [FR-INV-046](application-invocation-functional-specification-v01.md#fr-inv-046).

---

## 7. Optional AI-Assisted Enrichment

<a id="fr-ai-051"></a>

**FR-AI-051 — Optional enrichment**  
An AI-domain document-creation workflow may offer delegated AI assistance to enrich generated content.

<a id="fr-ai-052"></a>

**FR-AI-052 — AI availability is not baseline availability**  
Baseline instruction creation when optional AI is unavailable shall apply [FR-AI-044](ai-functional-specification-v01.md#fr-ai-044).

<a id="fr-ai-053"></a>

**FR-AI-053 — Provider failure fallback**  
Where a baseline path exists, failure of optional AI enrichment shall fall back to or preserve the deterministic baseline rather than convert the entire use case into failure.

<a id="fr-ai-054"></a>

**FR-AI-054 — Enrichment authorization**  
Interactive enrichment may require user selection or consent according to effective policy; Headless enrichment shall be deterministic and governed by explicit configuration/invocation policy.

<a id="fr-ai-055"></a>

**FR-AI-055 — Context minimization**  
Instruction-document enrichment context shall apply [FR-AI-088](ai-functional-specification-v01.md#fr-ai-088).

<a id="fr-ai-056"></a>

**FR-AI-056 — Sensitive-content exclusion**  
Sensitive enrichment context shall apply [FR-AI-089](ai-functional-specification-v01.md#fr-ai-089).

<a id="fr-ai-057"></a>

**FR-AI-057 — Managed-scope context**  
Project content supplied for enrichment shall remain within the approved context/scope of the operation.

<a id="fr-ai-058"></a>

**FR-AI-058 — Generated content is non-authoritative**  
Generated instruction enrichment shall apply [Design §11.10](../appmanager-design-specification-v01.md#_11-10-ai-assisted-workflow).

<a id="fr-ai-059"></a>

**FR-AI-059 — Contradictory generated claims**  
AppManager shall not knowingly replace reliable project facts with contradictory AI-generated statements.

<a id="fr-ai-060"></a>

**FR-AI-060 — Provider response validation**  
A provider response shall be validated for basic suitability to the requested document section or content contract before acceptance where practical.

<a id="fr-ai-061"></a>

**FR-AI-061 — Provider metadata**  
Provider/model metadata may be included in diagnostics or provenance where useful, but shall not be required for callers to understand application-level success.

<a id="fr-ai-062"></a>

**FR-AI-062 — No direct provider mutation**  
Provider-originated project writes shall apply [Design §11.10](../appmanager-design-specification-v01.md#_11-10-ai-assisted-workflow).

---

### 7.1 Generated-Output Acceptance

The acceptance model follows [Design §11.10](../appmanager-design-specification-v01.md#_11-10-ai-assisted-workflow). These observable requirements apply to AI-owned and consuming-domain workflows.

<a id="pbc-fr-ai-env-013"></a>

**PBC-FR-AI-ENV-013 — Non-authoritative generated output**

Generated-output status and prior-policy independence shall conform to [Design §11.10](../appmanager-design-specification-v01.md#_11-10-ai-assisted-workflow).

<a id="pbc-fr-ai-env-014"></a>

**PBC-FR-AI-ENV-014 — Human or automatic acceptance**

Human or automatic acceptance of generated output shall conform to [Design §11.10](../appmanager-design-specification-v01.md#_11-10-ai-assisted-workflow).

<a id="pbc-fr-ai-env-015"></a>

**PBC-FR-AI-ENV-015 — No self-authorisation**

Provider/model/result self-authorisation, scope and validation shall conform to [Design §11.10](../appmanager-design-specification-v01.md#_11-10-ai-assisted-workflow).

<a id="pbc-fr-ai-env-016"></a>

**PBC-FR-AI-ENV-016 — Cross-domain automation**

Authorised automated/bulk consuming-domain workflows shall apply [Design §11.10](../appmanager-design-specification-v01.md#_11-10-ai-assisted-workflow). The consumer validates the bounded output under its own contract.

<a id="pbc-fr-ai-env-017"></a>

**PBC-FR-AI-ENV-017 — Failure policy remains owning-domain policy**

Invalid AI-generated content shall be handled according to the owning use case's resolved policy, which may fail, use a deterministic fallback, request bounded regeneration where explicitly supported, or require human intervention. Provider output shall not choose the recovery policy.

---

## 8. Deleting AI Instruction Documents

<a id="fr-ai-063"></a>

**FR-AI-063 — Delete use case**  
AppManager shall provide a use case to delete a selected project AI instruction document.

<a id="fr-ai-064"></a>

**FR-AI-064 — Existing candidates**  
Interactive deletion shall present only deletable AI instruction documents that AppManager has resolved as present and eligible.

<a id="fr-ai-065"></a>

**FR-AI-065 — Explicit Headless target**  
Headless instruction deletion shall apply [FR-INV-020](application-invocation-functional-specification-v01.md#fr-inv-020), [FR-INV-022](application-invocation-functional-specification-v01.md#fr-inv-022).

<a id="fr-ai-066"></a>

**FR-AI-066 — Confirmation or authorization**  
Instruction deletion authorisation shall apply [FR-INV-023](application-invocation-functional-specification-v01.md#fr-inv-023), [FR-INV-022](application-invocation-functional-specification-v01.md#fr-inv-022).

<a id="fr-ai-067"></a>

**FR-AI-067 — Missing target**  
If the selected document is already absent, AppManager may report the operation as already satisfied/no-op rather than as a destructive failure.

<a id="fr-ai-068"></a>

**FR-AI-068 — Exact deletion target**  
Deletion shall remove only the selected AI instruction document and shall not cascade to other instruction documents, templates or provider configuration.

<a id="fr-ai-069"></a>

**FR-AI-069 — Unregistered document deletion**  
Version 1 shall not assume that an unregistered AI-looking document is safe to delete merely because it was discovered by listing.

<a id="fr-ai-070"></a>

**FR-AI-070 — Race handling**  
If a document changes or disappears between selection and deletion and the change can be detected, AppManager shall avoid silently applying stale assumptions.

<a id="fr-ai-071"></a>

**FR-AI-071 — Deletion result**  
The structured result shall identify the selected document and whether it was deleted, already absent, refused, cancelled or failed.

---

## 9. AI Capability Use by Other Domains

The shared AI-use requirements in §§7, 10 and 11 also govern bounded AI work consumed by other domains; each consumer defines its own intent and acceptance. Detailed Design may separate domain orchestration and shared capability contracts, but does not supply missing Functional meaning.

<a id="fr-ai-072"></a>

**FR-AI-072 — Git assistance boundary**  
Git-owned commit-message assistance shall apply [Design §10.6](../appmanager-design-specification-v01.md#_10-6-ai-domain).

<a id="fr-ai-073"></a>

**FR-AI-073 — Docs assistance boundary**  
Docs-owned drafting, summary and enrichment shall apply [Design §10.6](../appmanager-design-specification-v01.md#_10-6-ai-domain).

<a id="fr-ai-074"></a>

**FR-AI-074 — Nuxt assistance boundary**  
Nuxt-owned scaffolding/configuration assistance shall apply [Design §10.6](../appmanager-design-specification-v01.md#_10-6-ai-domain).

<a id="fr-ai-075"></a>

**FR-AI-075 — Settings assistance boundary**  
Settings resource-management assistance shall apply [Design §10.6](../appmanager-design-specification-v01.md#_10-6-ai-domain).

<a id="fr-ai-076"></a>

**FR-AI-076 — Quality assistance boundary**  
Future Quality-owned explanation or triage shall apply [Design §10.6](../appmanager-design-specification-v01.md#_10-6-ai-domain).

<a id="fr-ai-077"></a>

**FR-AI-077 — Source transformation boundary**  
AI-proposed source modifications shall apply [FR-XFORM-060](source-transformation-functional-specification-v01.md#fr-xform-060).

<a id="fr-ai-078"></a>

**FR-AI-078 — Application-level acceptance**  
AI acceptance by consuming domains shall apply [Design §11.10](../appmanager-design-specification-v01.md#_11-10-ai-assisted-workflow).

<a id="fr-ai-079"></a>

**FR-AI-079 — AI-domain invocation from Settings**  
Instruction-template application initiated from Settings shall apply [FR-AI-024](ai-functional-specification-v01.md#fr-ai-024).

---

## 10. Provider and Model Capability Semantics

<a id="fr-ai-080"></a>

**FR-AI-080 — Capability availability**  
Where an AI-owned use case requires a live AI capability, AppManager shall determine whether an eligible configured capability is available before relying on it.

<a id="fr-ai-081"></a>

**FR-AI-081 — Optional provider selection**  
If multiple providers/models are supported, selection shall follow explicit invocation or effective configuration policy rather than arbitrary implementation order.

<a id="fr-ai-082"></a>

**FR-AI-082 — No provider guessing**  
Headless provider selection where choice affects intent shall apply [FR-INV-020](application-invocation-functional-specification-v01.md#fr-inv-020).

<a id="fr-ai-083"></a>

**FR-AI-083 — Provider failure classification**  
Authentication, rate-limit, transport, provider, model-availability and response-validation failures shall be represented as delegated capability failures rather than collapsed into generic document errors where distinction is useful.

<a id="fr-ai-084"></a>

**FR-AI-084 — Retry policy**  
A provider failure shall not authorize unbounded or hidden retries. Retry/fallback behaviour shall follow explicit effective policy.

<a id="fr-ai-085"></a>

**FR-AI-085 — Fallback provider**  
Using a different provider/model after failure shall occur only where such fallback is explicitly permitted by configuration or invocation policy.

<a id="fr-ai-086"></a>

**FR-AI-086 — Cost/usage transparency**  
Where provider invocation may incur externally metered usage and such information is available, AppManager may expose relevant usage/provenance without making provider-specific accounting part of the core Functional contract.

<a id="fr-ai-087"></a>

**FR-AI-087 — Provider output isolation**  
Raw AI provider output shall apply [FR-INV-021](application-invocation-functional-specification-v01.md#fr-inv-021).

---

## 11. Safety, Privacy and Trust Boundaries

<a id="fr-ai-088"></a>

**FR-AI-088 — Data minimization**  
AI context shall be minimized to the information needed for the requested operation.

<a id="fr-ai-089"></a>

**FR-AI-089 — Secret protection**  
Known authentication material and sensitive environment values shall be excluded from AI provider context by default.

<a id="fr-ai-090"></a>

**FR-AI-090 — Untrusted project content**  
Project files consumed as AI context shall be treated as untrusted data, not as authority to redefine AppManager system policy, managed scope or application permissions.

<a id="fr-ai-091"></a>

**FR-AI-091 — Instruction hierarchy protection**  
Instructions in managed-project content shall apply [FR-AI-090](ai-functional-specification-v01.md#fr-ai-090).

<a id="fr-ai-092"></a>

**FR-AI-092 — Generated action isolation**  
Consequential generated suggestions shall apply [Design §11.10](../appmanager-design-specification-v01.md#_11-10-ai-assisted-workflow).

<a id="fr-ai-093"></a>

**FR-AI-093 — Path safety**  
Selected or generated AI-resource paths shall apply [FR-PROJ-044](managed-project-functional-specification-v01.md#fr-proj-044).

<a id="fr-ai-094"></a>

**FR-AI-094 — Existing authored content**  
Existing authored instruction documents shall apply [FR-AI-041](ai-functional-specification-v01.md#fr-ai-041), [FR-AI-042](ai-functional-specification-v01.md#fr-ai-042).

<a id="fr-ai-095"></a>

**FR-AI-095 — Prompt/context diagnostics**  
Normal diagnostics shall not dump full prompts, full model context or confidential project content unless an explicit secure diagnostic mode is later defined.

<a id="fr-ai-096"></a>

**FR-AI-096 — Provider privacy boundary**  
Sending project content to an external AI provider is an external data disclosure and shall remain governed by effective configuration/policy rather than being an invisible side effect.

---

## 12. Results, Diagnostics and Failure Semantics

<a id="fr-ai-097"></a>

**FR-AI-097 — Success semantics**  
AI-domain success shall apply [FR-INV-034](application-invocation-functional-specification-v01.md#fr-inv-034).

<a id="fr-ai-098"></a>

**FR-AI-098 — Failure semantics**  
A failed result shall identify whether failure occurred during target resolution, scope validation, generation, transformation, provider delegation, persistence, authorization or application-level acceptance where applicable.

<a id="fr-ai-099"></a>

**FR-AI-099 — Partial success**  
AI multi-stage local/enrichment effects shall apply [FR-INV-036](application-invocation-functional-specification-v01.md#fr-inv-036).

<a id="fr-ai-100"></a>

**FR-AI-100 — Warning semantics**  
Optional provider unavailability, fallback to deterministic content, unregistered documents and other non-fatal conditions shall be exposed as warnings where they materially affect interpretation.

<a id="fr-ai-101"></a>

**FR-AI-101 — No provider-text parsing requirement**  
AI operation status shall apply [FR-INV-021](application-invocation-functional-specification-v01.md#fr-inv-021).

<a id="fr-ai-102"></a>

**FR-AI-102 — Consequential effect reporting**  
Creation, replacement or deletion outcomes shall identify the document/resource affected.

<a id="fr-ai-103"></a>

**FR-AI-103 — No false rollback**  
Completed provider calls or file-change rollback claims shall apply [FR-INV-046](application-invocation-functional-specification-v01.md#fr-inv-046).

<a id="fr-ai-104"></a>

**FR-AI-104 — Concurrent modification**  
Previously inspected AI-document update targets shall apply [FR-XFORM-068](source-transformation-functional-specification-v01.md#fr-xform-068), [FR-XFORM-069](source-transformation-functional-specification-v01.md#fr-xform-069).

<a id="fr-ai-105"></a>

**FR-AI-105 — Fail-safe ambiguity**  
Ambiguous document type, provider choice, project target, replacement intent or delete target shall be resolved explicitly or fail safely rather than guessed.

---

## 13. Traceability Summary

| Functional area | Requirements | Upstream / same-level authority | Downstream refinement destination |
|---|---|---|---|
| Domain boundary | FR-AI-001–005 | This specification; Root Design domain/capability model | Owning domain/shared-contract Detailed Design |
| Invocation/context | FR-AI-006–016 | This specification; FR-INV, FR-PROJ, FR-CONFIG | Owning domain/shared-contract Detailed Design |
| Instruction-document model | FR-AI-017–025 | This specification §§1–4; Root Design capability/resource boundaries | Owning domain/shared-contract Detailed Design |
| Listing | FR-AI-026–035 | This specification §5; FR-PROJ managed-scope rules | Owning domain/shared-contract Detailed Design |
| Creation | FR-AI-036–050 | This specification §6; FR-XFORM; FR-INV | Owning domain/shared-contract Detailed Design |
| Optional enrichment | FR-AI-051–062 | This specification §7; Application Engine authority; FR-CONFIG | Owning domain/shared-contract Detailed Design |
| Deletion | FR-AI-063–071 | This specification §8; FR-INV; FR-PROJ | Owning domain/shared-contract Detailed Design |
| Cross-domain AI use | FR-AI-072–079 | This specification §9; owning domain Functional Specifications | Owning domain/shared-contract Detailed Design |
| Provider/model semantics | FR-AI-080–087 | This specification §10; Configuration Functional Specification; Root Design §6.6 | Owning domain/shared-contract Detailed Design |
| Safety/privacy/trust | FR-AI-088–096 | This specification §11; Root Design safety/capability model; FR-PROJ | Owning domain/shared-contract Detailed Design |
| Results/failures | FR-AI-097–105 | This specification §12; FR-INV; Application Engine authority | Owning domain/shared-contract Detailed Design |
| Project-side environment and output acceptance | PBC-FR-AI-ENV-001–017 | This specification §§4.1, 7.1; Design §§10.6, 11.10 | AI domain and shared AI Capability |

---

## 14. Downstream Specification Boundary

Detailed Design may define permanent internal contracts for AI-document registries, AI-document templates, provider capability abstractions, prompt/context construction, provider selection, response normalization, content validation and AI resource management.

Implementation Specifications may define concrete TypeScript modules, filenames, registry entries, template functions, provider SDKs, model identifiers, API clients, retry settings, context-size limits and redaction implementations.

Neither level may transfer application authority to an AI provider or redefine the primary-intent ownership rules established here without an approved change to the governing specification hierarchy.

---

## 15. Version 1 Functional Baseline

This document is the Version 1 Functional owner for its stated concern. Its requirement identities remain stable under the [Project Documentation Guide](../project-documentation-guide-v01.md#_9-traceability).
