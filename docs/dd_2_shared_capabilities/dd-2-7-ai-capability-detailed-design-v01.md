# DD-2.7 — AppManager AI Capability Detailed Design

> **Detailed Design ID:** DD-2.7
>
> **Design family:** DD-2 — Shared Capabilities

> **Status:** Version 1 Detailed Design Specification
>
> **Detailed Design authority:** This document defines the permanent shared contracts for bounded AI capability availability, provider/model selection inputs, context construction, request representation, response normalization, structured-output validation, provider-failure evidence, cancellation/timeout propagation and AI safety boundaries beneath AppManager application authority. It refines, but does not override, the root Design Specification, Functional Specifications, accepted ADRs, or the DD-1 Application Core Detailed Designs.
>
> **Sources and navigation:** [Project Documentation Guide](../project-documentation-guide-v01.md), [AppManager Design Specification](../appmanager-design-specification-v01.md), [Detailed Design Register](../project_management/detailed-design-register-v01.md), [ADR-0001 — Primary Application Runtime](../project_management/decisions/adr-0001-primary-application-runtime.md)
>
> **Related Detailed Design authorities:** [DD-1.1 — Application Invocation](../dd_1_application_core/dd-1-1-application-invocation-detailed-design-v01.md), [DD-1.2 — Execution Outcomes](../dd_1_application_core/dd-1-2-execution-outcomes-detailed-design-v01.md), [DD-1.3 — Managed Project](../dd_1_application_core/dd-1-3-managed-project-detailed-design-v01.md), [DD-1.4 — Configuration Resolution](../dd_1_application_core/dd-1-4-configuration-resolution-detailed-design-v01.md), [DD-1.5 — Application Engine](../dd_1_application_core/dd-1-5-application-engine-detailed-design-v01.md), [DD-2.1 — Resource Access](dd-2-1-resource-access-detailed-design-v01.md), [DD-2.2 — Process Execution](dd-2-2-process-execution-detailed-design-v01.md), [DD-2.4 — Source Intelligence](dd-2-4-source-intelligence-detailed-design-v01.md), [DD-2.5 — Source Transformation](dd-2-5-source-transformation-detailed-design-v01.md), [DD-2.6 — Resource Registry and Template](dd-2-6-resource-registry-and-template-detailed-design-v01.md)
>
> **Primary Functional authority:** [docs/functional/ai-functional-specification-v01.md](../functional/ai-functional-specification-v01.md), together with owning-domain Functional Specifications where AI is consumed as a delegated capability.

---

## 1. Purpose

AI Capability gives Git, Docs, Nuxt, Quality, Settings and AI-domain workflows a shared boundary for bounded generative or interpretive tasks. Task-relative availability, provider/model resolution, context manifests, disclosure checks and output validation make provider results usable as normalized proposals. Proposal acceptance follows [Design §11.10](../appmanager-design-specification-v01.md#_11-10-ai-assisted-workflow) in the consuming workflow.

## 2. Scope

This design owns permanent internal contracts for:

- AI capability discovery and availability evidence;
- provider and model identity as capability-level evidence;
- caller-supplied selection constraints;
- effective-configuration consumption for provider/model policy;
- deterministic provider/model resolution inputs;
- bounded AI request intent;
- prompt/request representation independent of one provider wire format;
- bounded context items and context manifests;
- context provenance, scope, trust and sensitivity metadata;
- context minimization and exclusion;
- external-disclosure classification;
- untrusted project-content treatment;
- provider request execution;
- response normalization;
- structured-output requirements and validation;
- usage/provenance evidence where available;
- provider-failure categorization;
- timeout and cancellation propagation;
- retry/fallback eligibility evidence and caller-supplied policy hooks;
- normalized AI capability diagnostics;
- provider replaceability;
- provider-independent testability.

This design defines a capability boundary. It does not require one service class, singleton, package, SDK, HTTP API style, message schema, registry format, model family, transport, executable, process or runtime topology.

---

## 3. Explicit Non-Ownership

AI Capability shall not own:

- AppManager command or use-case semantics;
- AI-domain application intent;
- Git commit workflow semantics;
- Docs generation or acceptance semantics;
- Nuxt lifecycle or scaffolding semantics;
- Quality-gate interpretation;
- Settings resource-management semantics;
- managed-project identity or managed scope;
- application authorization or confirmation policy;
- configuration-source precedence;
- application retry or fallback policy;
- application-level cost/budget policy unless explicitly supplied as a capability constraint;
- source mutation or Resource Access authority;
- repository mutation;
- process-execution authority unrelated to an approved AI provider adapter;
- acceptance of generated source, documentation, commit messages, metadata or instructions;
- execution of AI-suggested actions;
- final AppManager success, failure, partial-success or cancellation acceptance.

An AI provider may generate content. AI Capability may establish that a provider request technically completed and that its output satisfies a requested capability-level contract. Neither fact means the owning AppManager use case has succeeded.

<a id="dd-aicap-001"></a>

**DD-AICAP-001 — Capability execution is subordinate**

Bounded AI delegation follows [Design](../appmanager-design-specification-v01.md#_6-6-capability-boundaries-and-providers).

<a id="dd-aicap-002"></a>

**DD-AICAP-002 — Output is non-authoritative**

Normalized AI proposal acceptance follows [Design](../appmanager-design-specification-v01.md#_11-10-ai-assisted-workflow).


---

## 4. Architectural Position

The permanent dependency direction is:

```text
Application Engine / owning use case
        |
        +--> managed-project context / approved scope
        +--> effective configuration
        +--> application policy / authorization
        +--> AI task intent and output contract
        +--> context-selection policy
        +--> retry/fallback policy where allowed
        |
        v
+--------------------------------------------------+
| AI Capability                                    |
|                                                  |
| availability / provider capability facts         |
| provider-model resolution under supplied policy  |
| context validation / minimization                 |
| request normalization                             |
| provider delegation                               |
| response normalization                            |
| structured-output validation                      |
| provider diagnostics / usage / cancellation       |
+--------------------------+-----------------------+
                           |
                           v
                   AI capability provider
                           |
                           v
                 external/local AI system
```

The capability may collaborate with Resource Registry and Template, Resource Access, Source Intelligence, Process Execution or another approved provider mechanism, but those collaborations shall preserve the same dependency direction.

<a id="dd-aicap-003"></a>

**DD-AICAP-003 — No upward dispatch**

Generated requests to dispatch AppManager commands follows [Design](../appmanager-design-specification-v01.md#_11-10-ai-assisted-workflow).

<a id="dd-aicap-004"></a>

**DD-AICAP-004 — No authority from provider capability**

Provider tool/function/code/file/web/agent features follows [Design](../appmanager-design-specification-v01.md#_11-10-ai-assisted-workflow).


---

## 5. Core AI Capability Model

A bounded AI operation consists conceptually of:

```text
AI task intent
    + output contract
    + provider/model constraints
    + context manifest
    + effective policy/configuration
        -> capability resolution
        -> context validation/minimization
        -> provider request construction
        -> provider execution
        -> response normalization
        -> output-contract validation
        -> normalized AI capability result
        -> owning use-case acceptance
```

This is a responsibility model, not a required class or process pipeline.

### 5.1 AI task intent

The capability shall receive enough semantic intent to construct or delegate a bounded provider request without acquiring ownership of the surrounding application use case.

Examples include:

- generate a commit-message proposal from supplied change evidence;
- summarize supplied documentation facts;
- enrich a generated AI instruction document;
- produce a structured explanation from supplied quality findings;
- propose bounded source content for later Source Transformation review.

<a id="dd-aicap-005"></a>

**DD-AICAP-005 — Task intent is bounded**  
A capability request shall identify the requested AI task sufficiently to prevent the provider from being treated as a general autonomous AppManager agent.

<a id="dd-aicap-006"></a>

**DD-AICAP-006 — Primary use-case identity remains upstream**

Owning-domain correlation on a shared AI request follows [Design](../appmanager-design-specification-v01.md#_10-6-ai-domain).


---

## 6. Capability Discovery and Availability

AI availability is multi-dimensional. A configured provider entry, present credential, reachable endpoint and model capable of satisfying a requested output contract are distinct facts.

An availability result may include:

- provider identity;
- model identity where known or selected;
- configuration presence;
- credential/reference availability without exposing the credential;
- endpoint/provider reachability where explicitly checked;
- required capability support;
- structured-output capability where relevant;
- context/output limit evidence where known;
- local/external disclosure classification where known;
- availability diagnostics;
- observation time/revision where material.

<a id="dd-aicap-007"></a>

**DD-AICAP-007 — Availability is request-relative**  
Availability for one provider/model/task class shall not imply availability for all AI tasks.

<a id="dd-aicap-008"></a>

**DD-AICAP-008 — Configuration presence is not runtime availability**  
A configured provider or credential reference does not by itself establish reachability, authentication success, model availability or output-contract support.

<a id="dd-aicap-009"></a>

**DD-AICAP-009 — Availability probe effects are explicit**  
A probe that requires external network/provider contact shall be treated as provider execution and shall not occur invisibly merely to populate a menu or read-only registry view where policy forbids such disclosure/contact.

<a id="dd-aicap-010"></a>

**DD-AICAP-010 — Unavailable versus unsupported**  
The capability shall distinguish a known provider/model that is currently unavailable from a provider/model that cannot satisfy the requested capability contract.

---

## 7. Provider and Model Resolution

Provider/model selection is governed by caller intent and effective configuration, not incidental registry order.

Selection inputs may include:

- explicit provider identity;
- explicit model identity;
- permitted provider/model set;
- required capability class;
- required structured-output behavior;
- local-only or external-provider policy;
- context/output size requirements;
- timeout bounds;
- cost/usage constraints where defined upstream;
- fallback candidates explicitly permitted upstream.

<a id="dd-aicap-011"></a>

**DD-AICAP-011 — Governed selection inputs**

Provider/model policy consumes [DD-1.4 effective values](../dd_1_application_core/dd-1-4-configuration-resolution-detailed-design-v01.md#_15-resolution-result) and explicit invocation/use-case constraints.

<a id="dd-aicap-012"></a>

**DD-AICAP-012 — No arbitrary provider guessing**  
Where more than one eligible provider/model remains and the governing policy cannot choose deterministically, the capability shall report ambiguity rather than select by incidental registration order.

<a id="dd-aicap-013"></a>

**DD-AICAP-013 — Explicit selection remains validated**  
An explicitly requested provider/model must still satisfy required capability, availability and policy constraints.

<a id="dd-aicap-014"></a>

**DD-AICAP-014 — Deterministic Headless resolution**  
Equivalent provider/model constraints and effective configuration shall yield materially equivalent selection or ambiguity results without prompting.

<a id="dd-aicap-015"></a>

**DD-AICAP-015 — Selected identity is evidence**  
The normalized result shall identify the provider/model actually used sufficiently for provenance and diagnostics where available, without making provider-native identifiers the application outcome contract.

---

## 8. AI Request Contract

The shared request model should express AppManager semantics rather than one provider's API shape.

A normalized request may contain:

- request/task identity;
- owning use-case correlation;
- provider/model selection or constraints;
- task instruction supplied by the owning capability/use case;
- bounded context items;
- required output mode;
- optional structured-output schema/validator reference;
- generation constraints where semantically required;
- timeout/cancellation linkage;
- disclosure/privacy classification;
- provider-specific bounded options only where explicitly permitted.

<a id="dd-aicap-016"></a>

**DD-AICAP-016 — Provider wire formats remain below the boundary**

Provider message arrays, REST bodies, SDK request objects and role enums apply the [Design provider encapsulation contract](../appmanager-design-specification-v01.md#_6-6-capability-boundaries-and-providers) at the AI request seam.

<a id="dd-aicap-017"></a>

**DD-AICAP-017 — Request contract is non-executable application intent**

Mutation or operation authority claimed by an AI request follows [Design](../appmanager-design-specification-v01.md#_11-10-ai-assisted-workflow).

<a id="dd-aicap-018"></a>

**DD-AICAP-018 — Provider options are bounded**  
Provider-specific options may be carried below the shared contract where required, but shall not bypass effective policy, sensitivity constraints or output validation.

---

## 9. Context Item and Context Manifest

AI context shall be represented as bounded items rather than an undifferentiated dump of project state.

A context item should be able to carry, where material:

- semantic kind;
- source/provenance;
- managed-project association;
- source resource/reference;
- revision/snapshot evidence;
- content or normalized facts;
- trust classification;
- sensitivity classification;
- external-disclosure eligibility;
- truncation/selection evidence;
- ordering/priority where intentionally supplied.

A request-level context manifest records which context items were selected and the material filtering decisions made before provider submission.

<a id="dd-aicap-019"></a>

**DD-AICAP-019 — Context is explicitly selected**

Available project/source/repository/settings/documentation material considered for context follows [Design](../appmanager-design-specification-v01.md#_11-10-ai-assisted-workflow).

<a id="dd-aicap-020"></a>

**DD-AICAP-020 — Managed scope is an upper bound**

Project-context scope follows [Design](../appmanager-design-specification-v01.md#_9-7-managed-scope-and-operation-targeting).

<a id="dd-aicap-021"></a>

**DD-AICAP-021 — Context provenance is retained**  
Where the owning use case needs to distinguish authoritative project facts from generated/inferred content, context provenance shall remain available through normalization rather than being erased before provider invocation.

<a id="dd-aicap-022"></a>

**DD-AICAP-022 — No hidden resource reread**  
AI Capability shall not bypass Resource Access, Source Intelligence or the owning use case by independently crawling or rereading arbitrary project resources merely because a prompt might benefit from more context.

---

## 10. Context Minimization and Size Handling

Context minimization is a semantic safety requirement, not merely a token-saving optimization.

Selection may use:

- explicit caller-selected excerpts/facts;
- structural ranges from Source Intelligence;
- bounded repository change evidence;
- generated summaries already accepted for this purpose;
- declarative templates from Resource Registry and Template;
- deterministic reduction strategies defined by the owning capability contract.

<a id="dd-aicap-023"></a>

**DD-AICAP-023 — Minimum necessary context**  
AI Capability shall submit only context required or explicitly permitted for the bounded task.

<a id="dd-aicap-024"></a>

**DD-AICAP-024 — Size reduction must preserve truthfulness**  
Context reduction shall not silently create the impression that omitted content was inspected or considered by the provider.

<a id="dd-aicap-025"></a>

**DD-AICAP-025 — Truncation is explicit evidence**  
If content is truncated, summarized or selectively omitted because of size limits, the normalized request/result evidence shall preserve that fact where it may affect acceptance.

<a id="dd-aicap-026"></a>

**DD-AICAP-026 — No universal head/tail truncation contract**

Context-reduction algorithms are selected under the [Documentation Guide implementation boundary](../project-documentation-guide-v01.md#_8-level-4-implementation-specification), not inherited from current first/last-character truncation code.

<a id="dd-aicap-027"></a>

**DD-AICAP-027 — Insufficient context is explicit**  
If required context cannot fit or cannot be disclosed under the governing policy, the capability shall report an unsatisfied request/constraint rather than silently weakening the task.

---

## 11. Trust and Instruction-Hierarchy Boundary

Project resources may contain natural-language instructions directed at AI systems. Such content is data from AppManager's perspective unless the owning use case explicitly classifies part of it as approved AI-task instruction.

<a id="dd-aicap-028"></a>

**DD-AICAP-028 — Untrusted project content remains data**

Project-supplied text applies [FR-AI-090](../functional/ai-functional-specification-v01.md#fr-ai-090) to AI context. This includes instruction-like attempts to change provider selection, disclosure policy or the requested use-case semantics.

<a id="dd-aicap-029"></a>

**DD-AICAP-029 — Instruction origin remains distinguishable**  
The request-construction boundary shall preserve a distinction between AppManager/owning-use-case instructions and untrusted project context where the provider interface permits such a distinction.

<a id="dd-aicap-030"></a>

**DD-AICAP-030 — Prompt injection cannot grant application authority**

Output influenced by conflicting or malicious project instructions follows [Design](../appmanager-design-specification-v01.md#_11-10-ai-assisted-workflow).

<a id="dd-aicap-031"></a>

**DD-AICAP-031 — Generated tool/action requests are inert by default**  
Tool calls, function calls, shell commands, file operations, URLs or other action requests emitted by a provider shall be treated as generated data unless a separately designed and authorized AppManager capability explicitly interprets them.

<a id="dd-aicap-032"></a>

**DD-AICAP-032 — No general autonomous-agent boundary**  
Version 1 AI Capability shall not become a general autonomous command-execution or coding-agent framework merely because one provider offers agentic features.

---

## 12. Sensitive Information and External Disclosure

Sending context to an external provider is an external disclosure. Local providers may have different disclosure properties but remain subject to sensitivity and scope policy.

<a id="dd-aicap-033"></a>

**DD-AICAP-033 — Sensitive classifications are consumed**  
Where context or configuration has an established sensitivity classification, AI Capability shall consume that classification rather than independently weakening it.

<a id="dd-aicap-034"></a>

**DD-AICAP-034 — Known credentials are excluded**  
Known authentication secrets, tokens, passwords and protected environment values shall be excluded from ordinary AI context.

<a id="dd-aicap-035"></a>

**DD-AICAP-035 — Secret references are not secret values**  
Provider credential references/status may participate in capability setup, but credential values shall not be surfaced as ordinary context, diagnostics or normalized output.

<a id="dd-aicap-036"></a>

**DD-AICAP-036 — External disclosure requires eligibility**  
Context shall not be sent to an external provider unless the provider/request is permitted by effective configuration and the context is eligible for that disclosure.

<a id="dd-aicap-037"></a>

**DD-AICAP-037 — Disclosure failure is fail-safe**  
If required disclosure eligibility cannot be established, the capability shall omit the material or reject the request according to supplied policy rather than disclose by default.

<a id="dd-aicap-038"></a>

**DD-AICAP-038 — Diagnostics minimize sensitive content**

Prompt/context/response diagnostics use [DD-1.2](../dd_1_application_core/dd-1-2-execution-outcomes-detailed-design-v01.md#_24-sensitive-information-and-redaction) with safe identifiers, classifications, hashes/lengths or bounded excerpts.


---

## 13. Request Construction and Templates

AI request construction may consume declarative templates from DD-2.6.

The intended composition is:

```text
owning use-case AI intent
    + validated declarative AI template/resource
    + bounded context items
    + governed provider/model constraints
        -> AI Capability request
```

<a id="dd-aicap-039"></a>

**DD-AICAP-039 — Templates are data**

AI request templates follow the [Registry declarative-item contract](dd-2-6-resource-registry-and-template-detailed-design-v01.md#dd-reg-049).

<a id="dd-aicap-040"></a>

**DD-AICAP-040 — Template parameters are validated before submission**  
Required request-template parameters shall be bound and validated before provider execution.

<a id="dd-aicap-041"></a>

**DD-AICAP-041 — Template content does not override policy**

Request templates proposing scope/disclosure/provider/action changes follows [Design](../appmanager-design-specification-v01.md#_11-10-ai-assisted-workflow).

<a id="dd-aicap-042"></a>

**DD-AICAP-042 — Render success is not provider success**

Successful template rendering observes [DD-REG-002](dd-2-6-resource-registry-and-template-detailed-design-v01.md#dd-reg-002); AI provider execution is a subsequent stage.


---

## 14. Output Contract and Structured Output

An AI request may specify an output contract such as:

- free text;
- bounded text with semantic expectations;
- JSON/structured data conforming to a supplied schema;
- one of an enumerated result set;
- domain-specific normalized proposal data.

<a id="dd-aicap-043"></a>

**DD-AICAP-043 — Output expectations are explicit**  
Where downstream correctness depends on structure, the request shall identify the required output contract rather than relying on callers to scrape arbitrary provider prose.

<a id="dd-aicap-044"></a>

**DD-AICAP-044 — Provider JSON mode is not validation**  
A provider claiming JSON/structured-output mode does not establish that the returned data satisfies the AppManager-required schema or semantics.

<a id="dd-aicap-045"></a>

**DD-AICAP-045 — Structured output is validated**  
Structured output shall be parsed and validated against the supplied AppManager-level contract before being reported as valid structured AI evidence.

<a id="dd-aicap-046"></a>

**DD-AICAP-046 — Invalid structured output remains provider evidence**  
Malformed or schema-invalid output shall be represented distinctly from provider transport failure and shall not be silently coerced into valid application data.

<a id="dd-aicap-047"></a>

**DD-AICAP-047 — Semantic acceptance remains upstream**

Domain/factual acceptance of schema-valid AI output follows [Design](../appmanager-design-specification-v01.md#_11-11-workflow-results-failure-and-acceptance).


---

## 15. Response Normalization

Provider-native responses shall be normalized before crossing the shared capability boundary.

A normalized AI result may include:

- technical execution status;
- provider/model identity actually used;
- normalized generated content;
- normalized structured data where validated;
- output-contract validation status;
- finish/termination evidence where useful;
- usage evidence where available;
- provider request/correlation identifier where safe;
- warnings;
- provider diagnostics;
- timeout/cancellation evidence;
- bounded raw/provider detail where necessary for diagnosis;
- context/truncation/disclosure evidence needed by the caller.

<a id="dd-aicap-048"></a>

**DD-AICAP-048 — Provider-native objects stay below the boundary**

AI SDK/HTTP/native result objects uses [DD-1.2](../dd_1_application_core/dd-1-2-execution-outcomes-detailed-design-v01.md#_18-provider-result-normalization).

<a id="dd-aicap-049"></a>

**DD-AICAP-049 — Generated text does not equal success**  
Presence of non-empty provider content shall not alone establish a successful capability result where the output contract was not satisfied.

<a id="dd-aicap-050"></a>

**DD-AICAP-050 — Provider metadata remains subordinate**

Provider/model/usage metadata uses [DD-1.2](../dd_1_application_core/dd-1-2-execution-outcomes-detailed-design-v01.md#_8-execution-evidence-contract).

<a id="dd-aicap-051"></a>

**DD-AICAP-051 — Raw provider content is bounded**

Full raw response payload propagation uses [DD-1.2](../dd_1_application_core/dd-1-2-execution-outcomes-detailed-design-v01.md#_24-sensitive-information-and-redaction).


---

## 16. Provider Failure Model

AI Capability shall normalize provider failures into AppManager-oriented capability categories where reliably distinguishable.

Categories may include:

- provider not configured;
- provider/model unsupported;
- provider/model unavailable;
- missing credential/reference;
- authentication failure;
- authorization failure;
- rate/quota limited;
- request rejected/invalid;
- context/input limit exceeded;
- output limit/termination;
- structured-output invalid;
- transport/network failure;
- provider service unavailable;
- provider timeout;
- caller cancellation;
- provider protocol/response malformed;
- safety/content-policy rejection where reported;
- unknown provider failure.

<a id="dd-aicap-052"></a>

**DD-AICAP-052 — Failure category is capability evidence**

Normalized provider failures before owning-use-case retry/fallback/continuation policy uses [DD-1.2](../dd_1_application_core/dd-1-2-execution-outcomes-detailed-design-v01.md#_18-provider-result-normalization).

<a id="dd-aicap-053"></a>

**DD-AICAP-053 — Provider messages are subordinate detail**

Redacted provider error text uses [DD-1.2](../dd_1_application_core/dd-1-2-execution-outcomes-detailed-design-v01.md#_18-provider-result-normalization).

<a id="dd-aicap-054"></a>

**DD-AICAP-054 — Unknown remains explicit**  
The normalizer shall not invent a precise failure cause when provider evidence does not support one.

---

## 17. Timeout and Cancellation

Timeout and caller cancellation are distinct causes even where both use the same provider abort primitive.

<a id="dd-aicap-055"></a>

**DD-AICAP-055 — Timeout is explicit**  
A provider timeout shall be represented separately from caller-requested cancellation where the distinction is observable.

<a id="dd-aicap-056"></a>

**DD-AICAP-056 — Cancellation propagation**

Propagation of cancellation to supported AI providers uses [DD-1.2](../dd_1_application_core/dd-1-2-execution-outcomes-detailed-design-v01.md#_17-cancellation-model).

<a id="dd-aicap-057"></a>

**DD-AICAP-057 — Cancellation is not rollback**

Submitted AI requests, usage charges, logs and local effects after cancellation uses [DD-1.2](../dd_1_application_core/dd-1-2-execution-outcomes-detailed-design-v01.md#_17-cancellation-model).

<a id="dd-aicap-058"></a>

**DD-AICAP-058 — Indeterminate provider completion**  
If cancellation or network failure occurs after a request may have been accepted by the provider, the capability shall preserve uncertainty where provider completion cannot be established.

<a id="dd-aicap-059"></a>

**DD-AICAP-059 — Timeout bounds are governed inputs**  
Capability/provider timeout values shall derive from approved configuration/request policy or documented provider constraints rather than hidden call-site constants that redefine application behavior.

---

## 18. Retry and Fallback Boundaries

Retries and fallback can change external cost, latency, disclosure and output semantics. They therefore require explicit policy boundaries.

<a id="dd-aicap-060"></a>

**DD-AICAP-060 — No hidden retry loop**  
AI Capability shall not perform unbounded or policy-invented retries merely because a failure appears transient.

<a id="dd-aicap-061"></a>

**DD-AICAP-061 — Retryability is evidence**

AI transience/retryability evidence uses [DD-1.2](../dd_1_application_core/dd-1-2-execution-outcomes-detailed-design-v01.md#_22-retryability-and-repetition-evidence).

<a id="dd-aicap-062"></a>

**DD-AICAP-062 — Fallback requires authorization**  
Switching provider/model after failure shall occur only under caller-supplied or effective fallback policy that permits the candidate.

<a id="dd-aicap-063"></a>

**DD-AICAP-063 — Fallback preserves disclosure constraints**  
A fallback provider shall satisfy the same or stricter applicable disclosure/sensitivity constraints unless an authoritative policy explicitly permits otherwise.

<a id="dd-aicap-064"></a>

**DD-AICAP-064 — Fallback change is reported**  
When a fallback provider/model is used, normalized evidence shall make the actual provider/model and fallback occurrence distinguishable where material.

<a id="dd-aicap-065"></a>

**DD-AICAP-065 — Baseline preservation remains use-case policy**

Optional enrichment fallback is interpreted by [the owning domain](#_21-cross-domain-consumption) under [Design](../appmanager-design-specification-v01.md#_11-10-ai-assisted-workflow).


---

## 19. Usage, Metering and Provenance

Providers may expose token counts, request units, duration, model identifiers or other usage information.

<a id="dd-aicap-066"></a>

**DD-AICAP-066 — Usage evidence is optional and normalized**  
Where available, usage information may be normalized into provider-independent fields without requiring every provider to supply identical accounting semantics.

<a id="dd-aicap-067"></a>

**DD-AICAP-067 — Missing usage is not invented**  
Absence of reliable usage data shall remain absent/unknown rather than being estimated as authoritative provider usage.

<a id="dd-aicap-068"></a>

**DD-AICAP-068 — Cost policy remains upstream**  
Usage evidence does not authorize spending or define budget policy. Cost/usage constraints belong to effective application policy/configuration when supported.

<a id="dd-aicap-069"></a>

**DD-AICAP-069 — Provenance supports acceptance**  
Provider/model/request provenance may be retained sufficiently for callers to understand which AI capability produced a proposal without making provider-native response data part of the application contract.

---

## 20. Deterministic Headless Semantics

AI Capability shall be presentation-independent.

<a id="dd-aicap-070"></a>

**DD-AICAP-070 — No provider prompt in Headless execution**

Provider/model ambiguity uses [DD-AICAP-012](#dd-aicap-012) and non-prompting selection [DD-AICAP-014](#dd-aicap-014).

<a id="dd-aicap-071"></a>

**DD-AICAP-071 — Same request semantics across adapters**

Equivalent caller tasks/policy apply [Design](../appmanager-design-specification-v01.md#_4-6-presentation-independence) at the shared AI boundary.

<a id="dd-aicap-072"></a>

**DD-AICAP-072 — Human-readable provider labels are not identity**  
Presentation labels shall not be the canonical provider/model selector where stable semantic identity is required.

---

## 21. Cross-Domain Consumption

AI Capability supplies provider-independent execution, context/disclosure handling and normalized proposal evidence to its consumers. Its metadata designation of the AI Functional Specification as primary Functional authority identifies the principal constraint source, not ownership of the whole AI domain. [DD-4.3](../dd_4_policy_and_resource_domains/dd-4-3-ai-domain-detailed-design-v01.md) refines AI resource intent, policy and orchestration; Git, Docs and other domains retain their own assisted use cases.

Examples:

```text
Git use case  -----> AI Capability -----> commit-message proposal
Docs use case -----> AI Capability -----> documentation proposal/enrichment
Nuxt use case -----> AI Capability -----> bounded generated proposal
Quality use case --> AI Capability -----> explanation/triage proposal
AI domain use case -> AI Capability -----> instruction-document enrichment
```

<a id="dd-aicap-073"></a>

**DD-AICAP-073 — Owning domain remains authoritative**

Other domains consuming shared AI execution follows [Design](../appmanager-design-specification-v01.md#_10-6-ai-domain).

<a id="dd-aicap-074"></a>

**DD-AICAP-074 — Domain validation remains downstream**

Owning-domain validation and acceptance of normalized output follows [Design](../appmanager-design-specification-v01.md#_11-10-ai-assisted-workflow).

<a id="dd-aicap-075"></a>

**DD-AICAP-075 — Capability does not infer application continuation**

Continuation after AI warnings/failure/invalid output follows [DD-1.2](../dd_1_application_core/dd-1-2-execution-outcomes-detailed-design-v01.md#_18-provider-result-normalization); only an explicitly bounded delegated request may determine capability-local continuation.


---

## 22. Mutation and Action Isolation

AI Capability is non-mutating with respect to managed project resources.

<a id="dd-aicap-076"></a>

**DD-AICAP-076 — No direct project mutation**  
The capability shall return generated proposals/evidence and shall not directly create, replace, delete or edit managed project resources.

<a id="dd-aicap-077"></a>

**DD-AICAP-077 — Generated source routes through transformation**

Existing-source effects proposed by AI follows [Design](../appmanager-design-specification-v01.md#_7-code-intelligence-and-transformation-architecture).

<a id="dd-aicap-078"></a>

**DD-AICAP-078 — New resource creation remains downstream**

New-resource persistence proposed by AI follows [Design](../appmanager-design-specification-v01.md#_6-8-generation-and-templates).

<a id="dd-aicap-079"></a>

**DD-AICAP-079 — Generated commands remain data**

Generated shell/Git/API/AppManager actions use the action-data boundary [DD-AICAP-031](#dd-aicap-031).


---

## 23. Relationship to Other Shared Capabilities

### 23.1 Resource Registry and Template

AI Capability may consume validated/rendered declarative AI request templates from DD-2.6. It does not own registry CRUD, template identity, compatibility or rendering semantics.

### 23.2 Resource Access

Context resources arrive from the owning use case or through the [Resource Access bounded request](dd-2-1-resource-access-detailed-design-v01.md#_9-bounded-resource-request-contract), binding [DD-ENG-035](../dd_1_application_core/dd-1-5-application-engine-detailed-design-v01.md#dd-eng-035) to AI input acquisition.

### 23.3 Source Intelligence

AI Capability may consume normalized structural facts/excerpts. Structural facts are not automatic disclosure permission.

### 23.4 Source Transformation

AI-generated proposals do not bypass transformation planning, approval, stale-state checks, preservation or validation.

### 23.5 Process Execution

Local CLI adapters may consume [Process Execution](dd-2-2-process-execution-detailed-design-v01.md); completion evidence feeds the response validation and acceptance path in this design.

### 23.6 Configuration Resolution

AI provider/model policy, timeout and disclosure parameters consume [FR-CONFIG-020](../functional/configuration-functional-specification-v01.md#fr-config-020) through [DD-1.4](../dd_1_application_core/dd-1-4-configuration-resolution-detailed-design-v01.md).

<a id="dd-aicap-080"></a>

**DD-AICAP-080 — Shared-capability composition preserves authority**

Composition with other shared capabilities follows [Design](../appmanager-design-specification-v01.md#_6-6-capability-boundaries-and-providers).


---

## 24. Relationship to DD-1 Outcomes

The AI capability result contributes technical evidence to DD-1.2.

The Application Engine/owning use case may interpret that evidence as:

- accepted AI proposal contributing to success;
- optional AI failure with deterministic baseline success;
- partial success;
- warning;
- retry/fallback opportunity;
- terminal application failure;
- cancellation.

<a id="dd-aicap-081"></a>

**DD-AICAP-081 — Capability success is not application success**

Successful bounded AI execution follows [Design](../appmanager-design-specification-v01.md#_11-11-workflow-results-failure-and-acceptance).

<a id="dd-aicap-082"></a>

**DD-AICAP-082 — Partial effects remain upstream**

Known AI provider effects before workflow aggregation uses [DD-1.2](../dd_1_application_core/dd-1-2-execution-outcomes-detailed-design-v01.md#_12-consequential-effects).

<a id="dd-aicap-083"></a>

**DD-AICAP-083 — No Boolean collapse**  
Availability, provider execution, output validity, cancellation and application acceptance shall not be collapsed into one Boolean where their distinction affects workflow decisions.

---

## 25. Provider Contract

An AI provider implements concrete communication with one AI system or provider family.

A provider may own technical mechanics including:

- authentication protocol use;
- request serialization;
- endpoint/API invocation;
- provider-specific model identifiers;
- provider-native structured-output mechanisms;
- response parsing;
- provider-specific finish/status interpretation;
- cancellation/abort mechanics;
- usage extraction;
- provider error capture.

It does not own AppManager configuration precedence, managed scope, context disclosure policy, application fallback policy or final outcomes.

<a id="dd-aicap-084"></a>

**DD-AICAP-084 — Provider normalization**  
Every provider shall translate its native request/response/failure mechanics into the shared AI Capability contracts.

<a id="dd-aicap-085"></a>

**DD-AICAP-085 — Provider limitations are explicit**  
A provider unable to satisfy a requested capability/output contract shall report unsupported/unavailable evidence rather than silently emulate materially weaker semantics.

<a id="dd-aicap-086"></a>

**DD-AICAP-086 — Provider replaceability**

AI callers consume the provider-neutral request in [DD-AICAP-016](#dd-aicap-016) and normalized evidence under [DD-1.2](../dd_1_application_core/dd-1-2-execution-outcomes-detailed-design-v01.md#_18-provider-result-normalization).

<a id="dd-aicap-087"></a>

**DD-AICAP-087 — No speculative cross-runtime protocol**

AI provider topology follows the [Documentation Guide](../project-documentation-guide-v01.md#_8-level-4-implementation-specification); no separate process, RPC, neutral wire schema or executable plugin framework is required.


---

## 26. Current Implementation Evidence and Reconciliation

This section is historical implementation evidence under the [Documentation Guide reading conventions](../project-documentation-guide-v01.md#detailed-design-reading-conventions), not permanent product authority.

The current implementation includes `app/services/llmService.ts`, provider/model registry data and `app/types/services/llmServiceTypes.ts`.

Those artefacts are implementation evidence, not normative architecture.

Useful concepts demonstrated by the current code include:

- provider registry identity;
- availability/status reporting;
- provider selection;
- provider-specific endpoint/model configuration;
- request timeout support;
- normalized generated content;
- optional usage/token evidence;
- structured/JSON response mode;
- provider-response extraction/mapping;
- bounded context reduction;
- provider-error capture.

The following current details are not promoted automatically into permanent architecture:

- one singleton `LLMService`;
- direct import of one JSON registry as the universal provider registry;
- direct environment-variable lookup inside AI capability semantics;
- `API_MODEL_DEFAULT` as permanent precedence policy;
- presence of an API-key environment variable as a complete availability test;
- OpenAI-compatible `/chat/completions` as the universal provider protocol;
- bearer-token authentication as the universal auth model;
- `system | user | assistant` as the universal AppManager message contract;
- one string `generate()` result as the universal response model;
- `jsonMode` as equivalent to schema validation;
- first/last-character context truncation as permanent context policy;
- provider error strings/exceptions as the canonical failure model;
- one provider's token accounting as universal usage semantics;
- direct logger calls as the shared diagnostic contract.

<a id="dd-aicap-088"></a>

**DD-AICAP-088 — Implementation must converge on approved contracts**

Adapt current AI service/provider mechanisms under the [Documentation Guide implementation boundary](../project-documentation-guide-v01.md#_8-level-4-implementation-specification).


---

## 27. Security and Safety Model

The capability shall protect against at least:

- secret/credential disclosure;
- unintended external disclosure of project content;
- prompt injection through untrusted project content;
- provider/model ambiguity;
- hidden provider fallback to a less trusted disclosure boundary;
- generated-action execution by implication;
- oversized/unbounded context submission;
- unsafe diagnostic capture of full prompts/context/responses;
- provider-native errors leaking sensitive request data;
- templates or registry data overriding policy;
- generated paths or commands being treated as authorized effects.

<a id="dd-aicap-089"></a>

**DD-AICAP-089 — Provider possession of data grants no authority**

Provider processing or reproducing previously submitted context follows [Design](../appmanager-design-specification-v01.md#_11-10-ai-assisted-workflow).

<a id="dd-aicap-090"></a>

**DD-AICAP-090 — Provider response is untrusted input**

Generated output before consuming-contract validation follows [Design](../appmanager-design-specification-v01.md#_11-10-ai-assisted-workflow).

<a id="dd-aicap-091"></a>

**DD-AICAP-091 — Safety rejection is not application policy transfer**  
A provider-side safety refusal may be normalized as provider evidence, but the provider does not become AppManager's authority for unrelated application policy.

---

## 28. Testability Requirements

AI Capability shall be testable without requiring live external providers for core contract verification.

Tests should support deterministic scenarios covering at least:

- no configured provider;
- one eligible provider;
- multiple eligible providers with deterministic policy;
- ambiguous provider/model selection;
- unsupported capability;
- credential reference absent;
- provider unavailable;
- authentication/authorization failure;
- rate/quota limit;
- transport failure;
- timeout;
- caller cancellation;
- cancellation with indeterminate provider completion;
- valid free-text output;
- malformed/empty provider output;
- valid structured output;
- invalid JSON;
- schema-invalid structured output;
- provider-native structured mode returning semantically invalid data;
- context minimization;
- sensitive context exclusion;
- external-disclosure rejection;
- untrusted project instructions remaining non-authoritative;
- explicit truncation/omission evidence;
- context too large with no safe reduction;
- provider fallback allowed/refused;
- fallback preserving disclosure policy;
- usage metadata available/unavailable;
- raw provider diagnostics redaction;
- generated action/tool request remaining inert;
- provider substitution behind the same normalized contract.

<a id="dd-aicap-092"></a>

**DD-AICAP-092 — Fake-provider conformance**  
Core AI Capability tests shall be expressible against deterministic fake providers without network access, live credentials or provider accounts.

<a id="dd-aicap-093"></a>

**DD-AICAP-093 — Real-provider tests are adapter-specific**  
Live-provider integration tests may verify concrete API/auth/protocol behavior below the shared contract but shall not be required to define application semantics.

---

## 29. Conformance Invariants

Review request/task availability, provider selection, context/provenance/minimization, trust/disclosure, output validation and normalized failure contracts. Timeout/cancellation, fallback and usage each retain their own evidence semantics. The deterministic provider tests in §28 exercise these boundaries independently of live providers.

## 30. Traceability Summary

| Detailed Design concern | Primary authority |
|---|---|
| shared AI capability versus AI-domain ownership | `FR-AI-001`–`005`, `FR-AI-072`–`079`; root Design delegated-authority rule |
| invocation/configuration/context | `FR-AI-006`–`016`; DD-1.1, DD-1.3, DD-1.4, DD-1.5 |
| AI document/resource boundary | `FR-AI-017`–`025`; DD-2.6 Resource Registry and Template |
| optional enrichment/baseline separation | `FR-AI-044`–`062`; DD-1.2 outcomes |
| provider/model availability and selection | `FR-AI-080`–`087`; DD-1.4 Configuration Resolution |
| context minimization/sensitive data | `FR-AI-055`–`057`, `FR-AI-088`–`096`; DD-1.3; DD-2.4 |
| untrusted project content/instruction hierarchy | `FR-AI-090`–`092`; root Design application authority |
| response/output normalization | `FR-AI-060`–`062`, `FR-AI-087`, `FR-AI-097`–`105`; DD-1.2 |
| no direct mutation | `FR-AI-004`, `FR-AI-062`, `FR-AI-077`, `FR-AI-092`–`094`; DD-2.1, DD-2.5 |
| cancellation/partial outcomes | `FR-AI-016`, `FR-AI-049`–`050`, `FR-AI-097`–`104`; DD-1.2, DD-1.5 |
| templates/request construction | `FR-AI-023`–`024`, `FR-AI-045`; DD-2.6 |
| provider/runtime replaceability | `FR-AI-005`; ADR-0001; root Design implementation-topology independence |

---

## 31. Contract Consumers and Implementation Dependencies {#_31-downstream-detailed-design-dependencies}

### 31.1 DD-2.8 Quality Capability

Quality explanatory/triage flows use the [Quality AI interpretation contract](dd-2-8-quality-capability-detailed-design-v01.md#_26-relationship-to-ai-capability).

### 31.2 DD-2.9 Documentation Capability

Documentation Capability may use AI for bounded drafting, summarization or enrichment. Docs retains documentation models, scope, generation semantics and acceptance.

### 31.3 DD-2.10 Nuxt Capability

Nuxt Capability may use AI for bounded explanatory or generative proposals. Nuxt retains Nuxt recognition, lifecycle, configuration and scaffolding semantics.

### 31.4 Domain Detailed Designs

Git, Docs, Nuxt, Quality, Settings, AI and Maintenance workflows consume the request, bounded context and response contracts here when they need AI assistance. The [AI domain](../dd_4_policy_and_resource_domains/dd-4-3-ai-domain-detailed-design-v01.md#resource-graph) defines project-side resource intent; shared AI use follows [Design §10.6](../appmanager-design-specification-v01.md#_10-6-ai-domain).

### 31.5 Implementation Specification

Implementation planning shall determine concrete provider adapters, registry integration, credential mechanisms, HTTP/SDK/process providers, model mappings, timeout mechanics, structured-output validators, context filters, redaction logic, logging/telemetry, tests and migration from the current `llmService`.

---

## 32. Deferred Implementation Decisions

This Detailed Design intentionally does not choose:

- a permanent AI provider or model family;
- a mandatory cloud versus local provider;
- a universal provider registry storage format;
- a provider SDK versus direct HTTP client;
- an OpenAI-compatible protocol as the universal transport;
- one role/message schema;
- one structured-output mechanism;
- one schema-validation library;
- exact prompt templates;
- exact model parameters such as temperature/top-p;
- exact context-size limits;
- exact truncation or summarization algorithm;
- exact secret-detection implementation;
- exact credential store;
- exact retry/backoff algorithm;
- exact cost-budget mechanism;
- exact telemetry/logging implementation;
- exact class/package/module topology;
- an executable provider plugin framework;
- a general autonomous-agent/tool-execution framework.

These belong to Implementation Specification, later Detailed Design where a permanent shared contract is genuinely required, effective configuration, or ADR where a major architectural decision is introduced.

---

## 33. Final Design Position

The [architectural position](#_4-architectural-position) provides the collaboration map. The local models and workflows above, together with their direct upstream bindings, define the Version 1 contract; the conformance and testability sections provide the review route.
