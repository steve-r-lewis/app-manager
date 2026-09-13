# AppManager AI Functional Specification

> **Status:** Version 1 Functional Specification
>
> **Functional domain:** `ai`
>
> **Requirement prefix:** `FR-AI`
>
> **Governing sources:** `docs/project-documentation-guide-v01.md`, `docs/appmanager-design-specification-v01.md`
>
> **Related Functional Specifications:** `application-invocation-functional-specification-v01.md`, `managed-project-functional-specification-v01.md`, `configuration-functional-specification-v01.md`, `source-transformation-functional-specification-v01.md`, `settings-functional-specification-v01.md`
>
> **Planning source:** `docs/project_management/functional-specification-decomposition-plan-v01.md`
>
> **Legacy reconciliation source:** `docs/archive/design/appmanager-design-reconciliation-audit-v01.md`

## 1. Purpose

This specification defines the observable Version 1 behaviour of the AppManager `ai` domain.

The `ai` domain owns explicit management of project AI instruction documents and AI-oriented resources when AI management itself is the primary product intent. It does not become the owner of every workflow that uses an LLM, AI provider, model-generated suggestion or agent capability internally.

The governing boundary is:

> **The `ai` domain owns AI-specific application intent. AI used as a delegated capability inside another domain does not transfer ownership of that use case to `ai`.**

Version 1 retains the legacy product behaviours to list, create and delete project AI instruction documents. Examples such as `CLAUDE.md`, `GEMINI.md` and generic agent-instruction documents are retained as examples of supported document classes, not as an exhaustive list or an architectural commitment to particular providers.

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

**FR-AI-001 — Primary-intent ownership**  
An AI-domain use case shall have AI-specific project management or AI-resource management as its primary application intent.

**FR-AI-002 — Delegated AI does not transfer authority**  
A use case owned by another domain shall remain owned by that domain when AI is used only as an internal delegated capability.

**FR-AI-003 — Application Engine authority**  
AI-generated or provider-generated results shall remain subordinate to the Application Engine's interpretation, validation, scope and acceptance rules.

**FR-AI-004 — No autonomous authority**  
No AI provider, model or generated response shall independently gain authority to mutate managed project resources, expand managed scope or approve consequential application actions.

**FR-AI-005 — Provider independence**  
The Functional Specification shall not require a particular AI provider, model family, transport or SDK unless a future approved specification deliberately makes one part of the product contract.

---

## 3. Common AI-Domain Invocation Behaviour

**FR-AI-006 — Structured invocation**  
AI-domain use cases shall participate in the common Application Invocation Contract.

**FR-AI-007 — Structured outcome**  
Every AI-domain operation shall return an application-level structured outcome identifying the requested intent, resolved target and resulting effect or read-only result.

**FR-AI-008 — Interaction-mode equivalence**  
TUI, Headless and future adapters shall preserve equivalent AI-domain semantics even where interactive adapters provide menus or confirmation prompts.

**FR-AI-009 — Deterministic Headless operation**  
Headless AI-domain invocations shall not depend on interactive selection or provider prompts. Required target, type and authorization information shall be supplied or deterministically resolvable.

**FR-AI-010 — Unresolved target**  
If the requested AI document type or target cannot be resolved non-interactively, AppManager shall fail safely rather than guess.

**FR-AI-011 — Project context**  
Project-scoped AI-domain operations shall use resolved Managed Project context rather than independently treating the current working directory as authority.

**FR-AI-012 — Managed scope**  
Consequential AI-document operations shall remain within approved managed scope.

**FR-AI-013 — Effective configuration**  
Provider, model or AI-behaviour settings shall be consumed from effective configuration where applicable rather than resolved independently by the AI domain.

**FR-AI-014 — Availability distinction**  
A known AI-domain use case shall distinguish between unsupported/unknown intent and temporary unavailability of an optional or required delegated AI capability.

**FR-AI-015 — Sensitive diagnostics**  
Diagnostics and structured outcomes shall not expose AI-provider secrets, credentials or unnecessarily sensitive project content.

**FR-AI-016 — Cancellation**  
Where an AI-domain operation supports cancellation, cancellation shall stop further work as soon as safely practical and report already completed local effects.

---

## 4. AI Instruction Document Model

**FR-AI-017 — Instruction-document concept**  
A project AI instruction document is a managed project resource whose primary purpose is to communicate project-specific instructions, context, conventions or operational guidance to an AI assistant, agent or AI-capable tool.

**FR-AI-018 — Recognized document types**  
AppManager may maintain a supported set of recognized AI instruction document types.

**FR-AI-019 — Examples are non-exclusive**  
Examples including `CLAUDE.md`, `GEMINI.md` and `AGENTS.md` shall not be interpreted as the only document types that Version 1 architecture can support.

**FR-AI-020 — Document-type identity**  
Each supported AI instruction document type shall have an unambiguous semantic identity independent of presentation labels.

**FR-AI-021 — Provider association**  
A document type may be associated with a provider/tool or may be provider-agnostic.

**FR-AI-022 — Provider association is metadata**  
Association of an instruction-document type with a provider shall not imply that the provider is configured, available, authenticated or used by AppManager at invocation time.

**FR-AI-023 — Declarative resource model**  
Supported AI instruction document definitions and templates shall remain declarative/resource-driven and shall not constitute arbitrary executable plugins.

**FR-AI-024 — Template ownership boundary**  
Settings may expose aggregate template-resource management, but the AI domain retains AI-specific semantics for applying an AI instruction document template.

**FR-AI-025 — Plain-document semantics**  
AI instruction documents shall be treated according to their actual document format and shall not inherit source-code header requirements merely because AppManager source files use such headers.

---

## 5. Listing AI Instruction Documents

**FR-AI-026 — List use case**  
AppManager shall provide a use case to list project AI instruction documents.

**FR-AI-027 — Read-only listing**  
Listing AI instruction documents shall be non-mutating.

**FR-AI-028 — Supported-type listing**  
The list result shall identify supported AI instruction document types known to AppManager where that information is exposed.

**FR-AI-029 — Presence state**  
For each supported document type, AppManager shall be capable of distinguishing whether a corresponding managed-project document is present or absent.

**FR-AI-030 — Existing document identity**  
Where present, a listed document shall be identified sufficiently for automation to distinguish document type and project-relative target.

**FR-AI-031 — Unregistered-document observation**  
AppManager may report likely AI-oriented instruction documents that are present but not registered as supported document types.

**FR-AI-032 — Unregistered is informational**  
Detection of an unregistered AI-oriented document shall not by itself be treated as an error.

**FR-AI-033 — Conservative classification**  
AppManager shall not claim that an arbitrary project document is an AI instruction document unless that classification is recognized or sufficiently supported by the applicable discovery policy.

**FR-AI-034 — No mutation authority from discovery**  
Discovery of a candidate AI instruction document shall not by itself authorize update or deletion of that document.

**FR-AI-035 — Machine-consumable listing**  
Headless listing shall return machine-consumable document identities and presence states rather than requiring parsing of presentation text.

---

## 6. Creating AI Instruction Documents

**FR-AI-036 — Create use case**  
AppManager shall provide a use case to create a supported project AI instruction document.

**FR-AI-037 — Explicit document type**  
Creation shall resolve one explicit supported AI instruction document type before any write occurs.

**FR-AI-038 — Interactive selection**  
An interactive adapter may present supported document types for selection.

**FR-AI-039 — Headless selection**  
A Headless invocation shall identify the document type deterministically and shall reject an unknown type with a structured diagnostic.

**FR-AI-040 — Target resolution**  
The target location of the AI instruction document shall be resolved according to the document type and managed-project scope before generation.

**FR-AI-041 — Existing-target protection**  
Creation shall not silently overwrite an existing document.

**FR-AI-042 — Explicit replacement**  
Replacement of an existing AI instruction document, if supported, shall be an explicit consequential operation with applicable authorization/confirmation semantics.

**FR-AI-043 — Generation versus transformation**  
Creating a new AI instruction document is generation. Replacing or updating an existing document is transformation and shall comply with the Source Transformation Functional Specification.

**FR-AI-044 — Valid non-AI baseline**  
A supported AI instruction document type shall be capable of producing a valid baseline document without requiring a live AI provider unless that type is explicitly defined as provider-dependent.

**FR-AI-045 — Template-based baseline**  
Where a declarative template exists, AppManager may generate the baseline document from project facts, effective settings and the selected document type.

**FR-AI-046 — Project-fact accuracy**  
Project facts inserted into a generated AI instruction document shall come from recognized managed-project information or other authoritative application capabilities rather than unsupported guesses.

**FR-AI-047 — No secret synthesis**  
Generated instruction documents shall not embed secrets or sensitive configuration values merely because those values are available to AppManager.

**FR-AI-048 — Structured creation result**  
A successful creation result shall identify the created document type and resulting project-relative resource.

**FR-AI-049 — Partial creation outcome**  
If optional enrichment fails after a valid baseline document has been created, AppManager shall distinguish successful baseline creation from failed optional enrichment.

**FR-AI-050 — No false atomicity**  
Version 1 shall not imply transactional rollback of all local/provider effects unless that guarantee is explicitly provided.

---

## 7. Optional AI-Assisted Enrichment

**FR-AI-051 — Optional enrichment**  
An AI-domain document-creation workflow may offer delegated AI assistance to enrich generated content.

**FR-AI-052 — AI availability is not baseline availability**  
Unavailability of optional AI assistance shall not make the baseline instruction-document creation use case unavailable when a valid non-AI template path exists.

**FR-AI-053 — Provider failure fallback**  
Where a baseline path exists, failure of optional AI enrichment shall fall back to or preserve the deterministic baseline rather than convert the entire use case into failure.

**FR-AI-054 — Enrichment authorization**  
Interactive enrichment may require user selection or consent according to effective policy; Headless enrichment shall be deterministic and governed by explicit configuration/invocation policy.

**FR-AI-055 — Context minimization**  
Context sent to a delegated AI provider shall be limited to information reasonably necessary for the requested enrichment.

**FR-AI-056 — Sensitive-content exclusion**  
Secrets, credentials and sensitive environment values shall not be included in provider context unless a future explicit security policy and use case authorize them.

**FR-AI-057 — Managed-scope context**  
Project content supplied for enrichment shall remain within the approved context/scope of the operation.

**FR-AI-058 — Generated content is non-authoritative**  
AI-generated enrichment shall remain proposed/generated content until AppManager accepts it as satisfying the selected AI-document use case.

**FR-AI-059 — Contradictory generated claims**  
AppManager shall not knowingly replace reliable project facts with contradictory AI-generated statements.

**FR-AI-060 — Provider response validation**  
A provider response shall be validated for basic suitability to the requested document section or content contract before acceptance where practical.

**FR-AI-061 — Provider metadata**  
Provider/model metadata may be included in diagnostics or provenance where useful, but shall not be required for callers to understand application-level success.

**FR-AI-062 — No direct provider mutation**  
An AI provider response shall not directly write project files without Application Engine-mediated scope, validation and acceptance.

---

## 8. Deleting AI Instruction Documents

**FR-AI-063 — Delete use case**  
AppManager shall provide a use case to delete a selected project AI instruction document.

**FR-AI-064 — Existing candidates**  
Interactive deletion shall present only deletable AI instruction documents that AppManager has resolved as present and eligible.

**FR-AI-065 — Explicit Headless target**  
Headless deletion shall identify the document type/target explicitly and shall never rely on an interactive prompt.

**FR-AI-066 — Confirmation or authorization**  
Deletion shall require applicable confirmation or explicit non-interactive authorization before the consequential effect occurs.

**FR-AI-067 — Missing target**  
If the selected document is already absent, AppManager may report the operation as already satisfied/no-op rather than as a destructive failure.

**FR-AI-068 — Exact deletion target**  
Deletion shall remove only the selected AI instruction document and shall not cascade to other instruction documents, templates or provider configuration.

**FR-AI-069 — Unregistered document deletion**  
Version 1 shall not assume that an unregistered AI-looking document is safe to delete merely because it was discovered by listing.

**FR-AI-070 — Race handling**  
If a document changes or disappears between selection and deletion and the change can be detected, AppManager shall avoid silently applying stale assumptions.

**FR-AI-071 — Deletion result**  
The structured result shall identify the selected document and whether it was deleted, already absent, refused, cancelled or failed.

---

## 9. AI Capability Use by Other Domains

The AI domain is intentionally narrow. Other domains may consume AI as a capability without becoming subordinate to the AI domain.

**FR-AI-072 — Git assistance boundary**  
AI-assisted commit-message generation remains part of the Git use case when commit management is the primary intent.

**FR-AI-073 — Docs assistance boundary**  
AI-assisted documentation summarization, drafting or enrichment remains Docs-owned when documentation is the primary intent.

**FR-AI-074 — Nuxt assistance boundary**  
AI-assisted Nuxt scaffolding or explanatory content remains Nuxt-owned when Nuxt lifecycle/configuration is the primary intent.

**FR-AI-075 — Settings assistance boundary**  
AI use while creating or interpreting Settings-managed resources does not transfer Settings resource-management authority to AI.

**FR-AI-076 — Quality assistance boundary**  
A future AI-assisted quality explanation or triage feature would remain Quality-owned when quality interpretation is the primary intent.

**FR-AI-077 — Source transformation boundary**  
AI-generated source modifications remain governed by the Source Transformation Functional Specification and the owning domain's intent.

**FR-AI-078 — Application-level acceptance**  
Every other domain using AI shall retain responsibility for accepting or rejecting the AI-derived result according to its own functional requirements.

**FR-AI-079 — AI-domain invocation from Settings**  
Settings may list/manage an AI-document template resource, but applying that template to create/delete an AI instruction document shall use AI-domain semantics.

---

## 10. Provider and Model Capability Semantics

**FR-AI-080 — Capability availability**  
Where an AI-owned use case requires a live AI capability, AppManager shall determine whether an eligible configured capability is available before relying on it.

**FR-AI-081 — Optional provider selection**  
If multiple providers/models are supported, selection shall follow explicit invocation or effective configuration policy rather than arbitrary implementation order.

**FR-AI-082 — No provider guessing**  
Headless operation shall not guess a provider when provider choice materially affects the requested use case and cannot be resolved deterministically.

**FR-AI-083 — Provider failure classification**  
Authentication, rate-limit, transport, provider, model-availability and response-validation failures shall be represented as delegated capability failures rather than collapsed into generic document errors where distinction is useful.

**FR-AI-084 — Retry policy**  
A provider failure shall not authorize unbounded or hidden retries. Retry/fallback behaviour shall follow explicit effective policy.

**FR-AI-085 — Fallback provider**  
Using a different provider/model after failure shall occur only where such fallback is explicitly permitted by configuration or invocation policy.

**FR-AI-086 — Cost/usage transparency**  
Where provider invocation may incur externally metered usage and such information is available, AppManager may expose relevant usage/provenance without making provider-specific accounting part of the core Functional contract.

**FR-AI-087 — Provider output isolation**  
Raw provider output shall not be treated as a machine-facing application result; AppManager shall interpret it into structured application semantics.

---

## 11. Safety, Privacy and Trust Boundaries

**FR-AI-088 — Data minimization**  
AI context shall be minimized to the information needed for the requested operation.

**FR-AI-089 — Secret protection**  
Known secrets, credentials, tokens, private keys and sensitive environment values shall be excluded from AI provider context by default.

**FR-AI-090 — Untrusted project content**  
Project files consumed as AI context shall be treated as untrusted data, not as authority to redefine AppManager system policy, managed scope or application permissions.

**FR-AI-091 — Instruction hierarchy protection**  
Content discovered inside a managed project shall not override governing AppManager specifications or Application Engine policy merely because it contains instructions addressed to AI tools.

**FR-AI-092 — Generated action isolation**  
AI-generated suggestions that imply consequential actions shall not execute those actions unless a separate authorized AppManager use case validates and performs them.

**FR-AI-093 — Path safety**  
Generated or selected AI instruction document paths shall be validated to prevent writes or deletes outside approved managed scope.

**FR-AI-094 — Existing authored content**  
Existing user-authored AI instruction documents shall be protected from silent replacement.

**FR-AI-095 — Prompt/context diagnostics**  
Normal diagnostics shall not dump full prompts, full model context or confidential project content unless an explicit secure diagnostic mode is later defined.

**FR-AI-096 — Provider privacy boundary**  
Sending project content to an external AI provider is an external data disclosure and shall remain governed by effective configuration/policy rather than being an invisible side effect.

---

## 12. Results, Diagnostics and Failure Semantics

**FR-AI-097 — Success semantics**  
A successful AI-domain result shall reflect AppManager-level satisfaction of the requested intent rather than mere completion of a provider API call.

**FR-AI-098 — Failure semantics**  
A failed result shall identify whether failure occurred during target resolution, scope validation, generation, transformation, provider delegation, persistence, authorization or application-level acceptance where applicable.

**FR-AI-099 — Partial success**  
Multi-stage operations shall represent partial success explicitly when a valid local effect completes but optional provider enrichment or another secondary stage fails.

**FR-AI-100 — Warning semantics**  
Optional provider unavailability, fallback to deterministic content, unregistered documents and other non-fatal conditions shall be exposed as warnings where they materially affect interpretation.

**FR-AI-101 — No provider-text parsing requirement**  
Callers shall not be required to parse raw provider responses, logs or UI text to determine application-level status.

**FR-AI-102 — Consequential effect reporting**  
Creation, replacement or deletion outcomes shall identify the document/resource affected.

**FR-AI-103 — No false rollback**  
AppManager shall not claim provider calls or completed file changes were rolled back unless such rollback actually occurred.

**FR-AI-104 — Concurrent modification**  
Where an AI-document transformation is based on previously inspected content, AppManager shall avoid silently overwriting a materially changed target when the conflict can be detected.

**FR-AI-105 — Fail-safe ambiguity**  
Ambiguous document type, provider choice, project target, replacement intent or delete target shall be resolved explicitly or fail safely rather than guessed.

---

## 13. Legacy Reconciliation Decisions

### 13.1 `ai.list`

The legacy `ai.list` behaviour is retained as the functional requirement to list recognized project AI instruction documents and their presence state. Detection of likely unregistered AI-oriented documents is retained as an optional informational capability, not as automatic management authority.

### 13.2 `ai.create`

The legacy `ai.create` behaviour is retained as deterministic creation of a selected supported AI instruction document. Interactive selection is an adapter concern; Headless callers must identify the type explicitly. Existing-file overwrite is not a default behaviour and any replacement is governed by Source Transformation and consequential-operation authorization.

### 13.3 `ai.delete`

The legacy `ai.delete` behaviour is retained as explicit deletion of a selected existing AI instruction document with confirmation/authorization and exact-target semantics.

### 13.4 Initial registry examples

Legacy technical material proposed `CLAUDE.md`, `GEMINI.md` and `AGENTS.md` as an initial registry. Version 1 retains these as useful examples while deliberately avoiding a frozen exhaustive provider list at Functional level. Tool-specific files such as `.cursorrules`-style resources can be added later if deliberately supported without changing the architectural model.

### 13.5 Optional AI enrichment

The legacy specification correctly treated live AI assistance as optional for AI-document creation. Version 1 preserves that principle: declarative baseline generation must not become unavailable merely because a provider is unavailable, unless a future document type explicitly requires provider-generated content.

### 13.6 Template registry implementation

Exact registry interfaces, template-function signatures, filenames, menu labels and source modules are Detailed Design or Implementation concerns. Settings may manage declarative template resources, but AI owns application of AI-document templates to AI-specific use cases.

### 13.7 Cross-domain AI use

Legacy and current AppManager behaviour use AI in Git, Docs, Nuxt and potentially other domains. Those uses are not reclassified as AI-domain commands because AI is delegated execution rather than primary product intent.

---

## 14. Traceability Summary

| Functional area | Requirements | Primary provenance |
|---|---|---|
| Domain boundary | FR-AI-001–005 | Root Design domain/capability model; decomposition plan §5.4 |
| Invocation/context | FR-AI-006–016 | FR-INV, FR-PROJ, FR-CONFIG |
| Instruction-document model | FR-AI-017–025 | legacy AI technical spec §1 |
| Listing | FR-AI-026–035 | reconciliation audit §3.16; legacy `ai.list` |
| Creation | FR-AI-036–050 | reconciliation audit §3.16; legacy `ai.create`; FR-XFORM |
| Optional enrichment | FR-AI-051–062 | legacy AI technical spec §1.3; Application Engine authority |
| Deletion | FR-AI-063–071 | reconciliation audit §3.16; legacy `ai.delete` |
| Cross-domain AI use | FR-AI-072–079 | decomposition plan §5.4; existing domain specifications |
| Provider/model semantics | FR-AI-080–087 | Configuration/capability boundaries |
| Safety/privacy/trust | FR-AI-088–096 | Root Design safety/capability model; FR-PROJ |
| Results/failures | FR-AI-097–105 | FR-INV; Application Engine authority |

---

## 15. Downstream Specification Boundary

Detailed Design may define permanent internal contracts for AI-document registries, AI-document templates, provider capability abstractions, prompt/context construction, provider selection, response normalization, content validation and AI resource management.

Implementation Specifications may define concrete TypeScript modules, filenames, registry entries, template functions, provider SDKs, model identifiers, API clients, retry settings, context-size limits, redaction implementations and migration from legacy command stubs.

Neither level may transfer application authority to an AI provider or redefine the primary-intent ownership rules established here without an approved change to the governing specification hierarchy.

---

## 16. Version 1 Functional Baseline

This document establishes the Version 1 Functional baseline for the AppManager `ai` domain.

The central rule is:

> **AI may propose, enrich and assist. AppManager remains authoritative. The `ai` domain owns AI-specific project resources, not every AppManager workflow that happens to use AI.**