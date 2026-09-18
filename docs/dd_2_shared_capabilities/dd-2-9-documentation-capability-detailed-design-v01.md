# DD-2.9 — AppManager Documentation Capability Detailed Design

> **Detailed Design ID:** DD-2.9
>
> **Design family:** DD-2 — Shared Capabilities

> **Status:** Version 1 Detailed Design Specification
>
> **Detailed Design authority:** This document defines the permanent shared contracts for documentation inspection, documentation models, extraction, aggregation, generation, rendering, documentation-tool delegation, optional AI enrichment and documentation-oriented validation beneath AppManager application authority. It refines, but does not override, the root Design Specification, Functional Specifications, accepted ADRs, or the DD-1 Application Core Detailed Designs.
>
> **Governing sources:** [Project Documentation Guide](../project-documentation-guide-v01.md), [AppManager Design Specification](../appmanager-design-specification-v01.md), [Detailed Design Register](../project_management/detailed-design-register-v01.md), [ADR-0001 — Primary Application Runtime](../project_management/decisions/adr-0001-primary-application-runtime.md)
>
> **Related Detailed Design authorities:** [DD-1.1 — Application Invocation](../dd_1_application_core/dd-1-1-application-invocation-detailed-design-v01.md), [DD-1.2 — Execution Outcomes](../dd_1_application_core/dd-1-2-execution-outcomes-detailed-design-v01.md), [DD-1.3 — Managed Project](../dd_1_application_core/dd-1-3-managed-project-detailed-design-v01.md), [DD-1.4 — Configuration Resolution](../dd_1_application_core/dd-1-4-configuration-resolution-detailed-design-v01.md), [DD-1.5 — Application Engine](../dd_1_application_core/dd-1-5-application-engine-detailed-design-v01.md), [DD-2.1 — Resource Access](dd-2-1-resource-access-detailed-design-v01.md), [DD-2.2 — Process Execution](dd-2-2-process-execution-detailed-design-v01.md), [DD-2.4 — Source Intelligence](dd-2-4-source-intelligence-detailed-design-v01.md), [DD-2.5 — Source Transformation](dd-2-5-source-transformation-detailed-design-v01.md), [DD-2.6 — Resource Registry and Template](dd-2-6-resource-registry-and-template-detailed-design-v01.md), [DD-2.7 — AI Capability](dd-2-7-ai-capability-detailed-design-v01.md), [DD-2.8 — Quality Capability](dd-2-8-quality-capability-detailed-design-v01.md)
>
> **Primary Functional authority:** [docs/functional/docs-functional-specification-v01.md](../functional/docs-functional-specification-v01.md), together with owning-domain Functional Specifications where documentation capability is consumed by another workflow.

---

## 1. Purpose

This specification defines the shared Documentation Capability boundary used to inspect documentable facts, construct normalized documentation models, aggregate those models, render proposed documentation content and delegate bounded documentation-tool operations without allowing parsers, renderers, templates, AI providers, Nuxt facts or documentation tools to acquire AppManager application authority.

The governing rules are:

> **Documentation Capability describes and renders approved information; it does not establish managed scope, application intent, mutation authority or final acceptance.**

> **Documentation inspection is evidence-producing. Documentation generation produces proposed artefacts/content. Persistence or modification of existing resources requires the appropriate downstream authority.**

> **Source facts, Nuxt facts, test facts, AI-generated prose and existing documentation have different provenance and shall not be collapsed into one undifferentiated truth source.**

> **Documentation tooling execution is technical execution evidence, not documentation acceptance.**

The capability provides stable reusable semantics beneath Docs-domain use cases and other approved workflows that consume documentation models or rendered documentation.

---

## 2. Scope

This design owns permanent contracts for:

- documentable-input identity;
- documentation-target identity as supplied by an authoritative caller;
- documentable-fact representation;
- documentation-section/block models;
- source-aware documentation inspection inputs;
- consumption of Source Intelligence facts;
- consumption of Nuxt- or other domain-authoritative facts;
- existing-document inspection as contextual evidence;
- documentation provenance and confidence metadata;
- documentation model composition;
- documentation aggregation across multiple inputs;
- selection/exclusion evidence supplied by an owning use case;
- normalized omission/unsupported evidence;
- documentation-generation requests;
- deterministic rendering;
- declarative template consumption;
- output format/kind representation;
- proposed documentation artefacts;
- proposed documentation updates;
- preview/change evidence;
- optional AI-enrichment requests and normalized enrichment evidence;
- documentation-tool capability recognition;
- bounded documentation-tool execution through Process Execution;
- generated documentation-tool artefact evidence;
- documentation-oriented validation evidence;
- progress, cancellation and partial-result evidence;
- provider/renderer replaceability and provider-independent testing.

This design does not require one parser, renderer, markup format, template engine, documentation generator, static-site tool, AI provider, package manager, service class, package, process, protocol or runtime topology.

---

## 3. Explicit Non-Ownership

Documentation Capability shall not own:

- AppManager command or use-case semantics;
- Docs-domain target selection policy;
- managed-project identity or managed scope;
- application authorization or confirmation policy;
- configuration-source precedence;
- Nuxt recognition or layer semantics;
- generic source recognition semantics already owned by Source Intelligence;
- source transformation or file-mutation authority;
- Resource Access persistence authority merely because documentation content was rendered;
- Quality-domain test execution or quality-gate semantics;
- AI-provider selection or AI acceptance semantics beyond DD-2.7 contracts;
- application build/dev/preview lifecycle outside explicitly bounded documentation-tool operations;
- repository mutation;
- project documentation governance for the AppManager repository itself;
- final AppManager success, failure, partial-success or cancellation acceptance.

**DD-DOCCAP-001 — Documentation execution remains subordinate**  
Documentation Capability shall operate only on bounded targets, facts, models and output contracts supplied or authorized by the owning use case and shall not invent application intent, scope or authorization.

**DD-DOCCAP-002 — Rendered content is not mutation authority**  
A successfully rendered documentation artefact or update proposal shall not authorize creation, replacement or modification of a target resource.

---

## 4. Architectural Position

```text
Application Engine / owning Docs use case
        |
        +--> managed-project context / approved docs scope
        +--> effective configuration
        +--> documentation intent / target / profile
        +--> authoritative domain facts
        +--> generation/update policy
        +--> AI/tooling policy where applicable
        |
        v
+--------------------------------------------------+
| Documentation Capability                         |
|                                                  |
| documentable-input normalization                 |
| documentation model construction                 |
| aggregation / omission evidence                  |
| template/render planning                         |
| deterministic rendering                          |
| optional AI enrichment delegation                |
| documentation-tool provider delegation           |
| normalized docs evidence / proposed outputs      |
+--------------------------+-----------------------+
                           |
             +-------------+-------------+
             |                           |
             v                           v
      shared capabilities          docs/tool providers
      (Source Intelligence,        (renderer/site tool/
       Registry/Template, AI,       preview/build provider)
       Process Execution, etc.)
```

**DD-DOCCAP-003 — Capability boundary is not the Docs domain**  
The shared capability may be consumed by Docs-domain or other authorized use cases without assuming Docs-domain application ownership.

**DD-DOCCAP-004 — No upward dispatch**  
A renderer, documentation provider, template or generated document shall not dispatch arbitrary AppManager commands or expand workflow scope.

---

## 5. Documentation Input Model

A documentable input may represent:

- a managed application/root target;
- a managed layer;
- a source resource;
- a test resource or recognized test fact;
- a selected file;
- a normalized Source Intelligence fact set;
- a Nuxt/domain-authoritative fact set;
- existing documentation permitted as context;
- generated documentation content already accepted for reuse;
- another explicitly supported documentation evidence source.

Each input should retain, where material:

- semantic identity;
- source/provenance;
- target association;
- revision/snapshot evidence;
- support/ambiguity state;
- trust/confidence classification;
- sensitivity classification;
- selection/exclusion evidence.

**DD-DOCCAP-005 — Inputs are evidence, not automatic documentation truth**  
The presence of an input shall not require every fact or text fragment within it to appear in generated documentation.

**DD-DOCCAP-006 — Provenance remains distinguishable**  
Reliably recognized structural facts, existing authored documentation, generated summaries and AI-generated prose shall remain distinguishable where their provenance affects acceptance.

**DD-DOCCAP-007 — No hidden project crawl**  
Documentation Capability shall not independently traverse arbitrary project resources to expand its input set outside the approved target/selection contract.

---

## 6. Documentation Target and Profile Contract

The owning use case may supply a documentation profile describing the intended semantic coverage without prescribing one concrete template or file layout.

A profile may include:

- target class;
- included information categories;
- excluded information categories;
- desired output kind/format;
- level of detail;
- template identity where explicitly selected;
- AI-enrichment eligibility;
- aggregation rules;
- output grouping/splitting intent;
- update versus generation intent as determined upstream.

**DD-DOCCAP-008 — Profile does not establish managed scope**  
A documentation profile may narrow approved content selection but shall not broaden DD-1.3 managed scope.

**DD-DOCCAP-009 — Stable semantic profile**  
Equivalent profiles shall express equivalent documentation intent independent of presentation labels or one renderer implementation.

**DD-DOCCAP-010 — Unsupported profile aspects are explicit**  
A provider incapable of satisfying a required profile dimension shall report unsupported/partial evidence rather than silently omit it and claim full completion.

---

## 7. Documentation Facts and Model

Documentation Capability shall prefer normalized facts over raw provider-native structures.

A documentation fact may carry:

- fact kind;
- semantic value;
- subject/target identity;
- source provenance;
- location/resource reference where useful;
- confidence/support classification;
- revision/snapshot evidence;
- sensitivity classification;
- diagnostics.

A documentation model may organize facts into semantic sections or blocks such as:

- overview/identity;
- responsibilities;
- declarations/APIs;
- relationships;
- configuration facts;
- layer/project composition;
- test facts;
- usage/installation information;
- examples supplied by authoritative sources;
- generated explanatory prose;
- warnings/limitations/unknowns.

**DD-DOCCAP-011 — Model is provider-independent**  
Parser ASTs, regex match objects, VitePress page objects, Markdown-library nodes and provider-native representations shall not become the universal shared documentation model merely because a current implementation uses them.

**DD-DOCCAP-012 — Facts and prose remain distinguishable**  
The model shall support distinguishing authoritative/reliably recognized facts from explanatory or generated prose where acceptance depends on that difference.

**DD-DOCCAP-013 — Unknown is not invented**  
Where a required relationship or meaning cannot be established reliably, the model shall represent omission, ambiguity or unknown rather than fabricate a confirmed fact.

---

## 8. Source Intelligence Boundary

Source-derived documentation shall consume DD-2.4 Source Intelligence rather than duplicating generic parsing/recognition authority.

**DD-DOCCAP-014 — Structural facts come through approved recognition**  
Where supported source structure is available from Source Intelligence, Documentation Capability shall consume normalized facts rather than reconstruct a competing universal parser model.

**DD-DOCCAP-015 — Recognition does not authorize mutation**  
Discovery of documentable declarations/regions does not authorize documentation injection or source modification.

**DD-DOCCAP-016 — Unsupported source remains explicit**  
Unsupported or ambiguous source recognition shall result in bounded omission/diagnostic evidence rather than unsafe textual inference being promoted to structural fact.

**DD-DOCCAP-017 — Raw text may be bounded evidence**  
Raw excerpts may be used when explicitly permitted and appropriate, but their use shall not erase the distinction between text observation and recognized structure.

---

## 9. Domain-Authoritative Facts

Documentation may describe domain semantics without acquiring ownership of those semantics.

**DD-DOCCAP-018 — Nuxt facts remain Nuxt-owned**  
Nuxt layer/configuration/integration facts consumed for documentation shall originate from the Nuxt domain/capability or another approved authority rather than being redefined by Documentation Capability.

**DD-DOCCAP-019 — Quality facts remain Quality-owned**  
Documentation may describe recognized tests or consume supplied Quality evidence, but it shall not execute tests or establish quality-gate truth merely to document them.

**DD-DOCCAP-020 — Repository facts remain repository-owned**  
Repository relationships or revision provenance used in documentation shall not transfer repository semantics to Documentation Capability.

**DD-DOCCAP-021 — Domain conflicts are not silently resolved**  
If domain-authoritative facts conflict with lower-confidence or generated documentation content, the conflict shall be exposed or the lower-authority content excluded rather than silently replacing the authoritative fact.

---

## 10. Existing Documentation as Input

Existing documentation may provide useful authored context but is not automatically canonical project truth.

**DD-DOCCAP-022 — Existing docs are contextual evidence**  
Existing documentation may be inspected and reused according to policy while retaining provenance as authored documentation.

**DD-DOCCAP-023 — Existing text does not grant rewrite authority**  
Reading an existing document does not authorize replacement, deletion or restructuring of that document.

**DD-DOCCAP-024 — Stale documentation remains detectable evidence**  
Where revision/freshness comparison is available, stale or mismatched documentation shall be representable rather than being treated as freshly synchronized.

---

## 11. Aggregation

Documentation aggregation combines multiple bounded models/facts into one or more documentation outputs.

**DD-DOCCAP-025 — Aggregation follows selected inputs**  
Aggregation shall operate only on inputs selected by the owning use case/profile rather than unbounded recursive filesystem discovery.

**DD-DOCCAP-026 — Duplicate semantic inputs are normalized**  
Overlapping documentation scopes shall not unintentionally duplicate the same logical fact/resource unless the profile explicitly requires repeated representation.

**DD-DOCCAP-027 — Provenance survives aggregation**  
Multi-file/multi-layer aggregation shall preserve sufficient provenance to attribute important facts, omissions and failures to their source targets.

**DD-DOCCAP-028 — Partial aggregation is explicit**  
If some inputs are unsupported, unavailable or fail inspection, the aggregate result shall retain those omissions/failures rather than imply complete coverage.

**DD-DOCCAP-029 — Empty optional categories are not failures**  
A valid absence of optional layers/tests/other categories may produce an empty section or omission without becoming a capability failure.

---

## 12. Documentation Generation Request

A normalized generation request may include:

- documentation profile;
- normalized documentation model;
- output kind/format;
- template identity/variant;
- rendering constraints;
- desired artefact grouping;
- provenance requirements;
- AI-enrichment policy/input contract;
- preview requirement;
- correlation/cancellation linkage.

**DD-DOCCAP-030 — Generation is non-persistent by default**  
The shared generation/rendering operation shall produce proposed content/artefacts and shall not implicitly persist them.

**DD-DOCCAP-031 — Output destination remains upstream**  
A renderer may suggest or report output metadata but shall not independently choose an application target path where target selection carries scope or overwrite consequences.

**DD-DOCCAP-032 — Generation and update remain distinct**  
Producing a proposed new artefact is distinct from modifying an existing documentation artefact.

---

## 13. Resource Registry and Template Boundary

Documentation Capability may consume DD-2.6 declarative templates.

**DD-DOCCAP-033 — Templates remain declarative**  
Documentation templates shall be resolved/rendered through approved Resource Registry and Template contracts rather than treated as arbitrary executable plugins.

**DD-DOCCAP-034 — Template identity does not define Docs intent**  
Selecting a template does not independently establish which project target, scope or documentation use case is authorized.

**DD-DOCCAP-035 — Template rendering is not persistence**  
A successfully rendered template remains proposed documentation content until the owning use case authorizes downstream creation/update.

**DD-DOCCAP-036 — Missing template behavior is explicit**  
A missing/incompatible template shall produce unavailable/unsupported evidence or invoke an explicitly permitted alternative path; it shall not silently select an unrelated template.

---

## 14. Rendering

Rendering converts a documentation model into proposed content in a requested output format.

A rendered result may carry:

- output kind/format;
- proposed content;
- semantic section map where useful;
- provenance summary;
- warnings/omissions;
- deterministic-render evidence;
- provider/renderer identity;
- diagnostics.

**DD-DOCCAP-037 — Rendering does not invent authoritative facts**  
A renderer may structure/present facts but shall not create unsupported project semantics merely to fill a template.

**DD-DOCCAP-038 — Deterministic path is preferred where possible**  
Given materially equivalent model, template and rendering configuration, deterministic renderers should produce semantically equivalent output.

**DD-DOCCAP-039 — Formatting differences are not semantic authority**  
Markdown, HTML, JSON or another format shall not redefine the underlying documentation facts merely because presentation differs.

**DD-DOCCAP-040 — Provider-native renderer output is normalized**  
Renderer-specific objects shall remain below the shared boundary; callers receive AppManager-oriented proposed content/evidence.

---

## 15. Generation Versus Persistence and Update

The shared capability boundary preserves the downstream distinction:

```text
normalized documentation model
        -> render proposed content
        -> owning use-case policy/scope/authorization
        -> target absent: bounded Resource Access creation
           OR
        -> target exists: Source Transformation / explicit replacement path
        -> validation
        -> AppManager acceptance
```

**DD-DOCCAP-041 — New artefact creation remains downstream**  
Documentation Capability shall not acquire generic Resource Access mutation authority merely because it generated a new document proposal.

**DD-DOCCAP-042 — Existing-document updates route through transformation**  
Bounded modification of an existing documentation resource shall use DD-2.5 Source Transformation where transformation semantics apply.

**DD-DOCCAP-043 — Whole replacement is explicit**  
Replacement of substantial existing authored documentation shall remain an owning-use-case policy/authorization decision and shall not occur as an incidental renderer behavior.

**DD-DOCCAP-044 — Output collision is evidence, not overwrite permission**  
Discovery that a proposed output already exists shall return collision/precondition evidence rather than silently replacing the resource.

---

## 16. Source Documentation Injection

Some documentation use cases may propose comments, headers or structured documentation inside source.

**DD-DOCCAP-045 — Injection planning does not bypass DD-2.5**  
Documentation Capability may produce documentation content or a documentation-oriented transformation intent, but Source Transformation owns the bounded edit plan, stale-state checks, preservation and source-level validation.

**DD-DOCCAP-046 — Documentable-region evidence is not write authority**  
A recognized declaration, header position or documentation block does not authorize injection into source.

**DD-DOCCAP-047 — Existing source content is preserved by transformation contract**  
Documentation Capability shall not implement a private source-rewrite path merely because it knows the intended documentation text.

---

## 17. Optional AI Enrichment

Documentation Capability may consume DD-2.7 AI Capability for bounded summarization, drafting or enrichment.

**DD-DOCCAP-048 — AI remains optional where deterministic baseline exists**  
A deterministic documentation path shall not become unavailable merely because optional AI enrichment is unavailable.

**DD-DOCCAP-049 — AI output retains generated provenance**  
AI-generated prose shall remain distinguishable from reliably inspected facts until accepted into the documentation model/output by the owning use case.

**DD-DOCCAP-050 — Reliable facts dominate generated claims**  
AI enrichment shall not knowingly replace reliable structural/domain facts with contradictory generated assertions.

**DD-DOCCAP-051 — AI context remains bounded**  
Context construction for AI enrichment shall follow DD-2.7 scope, sensitivity, minimization and disclosure rules.

**DD-DOCCAP-052 — AI failure does not fabricate completeness**  
If a required documentation meaning cannot be established after an AI/enrichment failure, the capability shall expose the limitation rather than fabricate content.

**DD-DOCCAP-053 — AI cannot persist documentation directly**  
AI-generated output remains proposed content and shall not directly write documentation or source resources.

---

## 18. Documentation Tooling Capability

Documentation development, build and preview tools are specialist providers beneath Documentation Capability/Docs-domain authority.

A tooling capability may expose:

- provider identity;
- recognized documentation project/target compatibility;
- supported operation classes such as development, build or preview;
- required configuration evidence;
- long-running capability support;
- generated artefact evidence;
- provider diagnostics.

**DD-DOCCAP-054 — Tooling availability is target-relative**  
A documentation tool may be available for one documentation target/project and unavailable for another.

**DD-DOCCAP-055 — Tool recognition does not launch it**  
Recognition of VitePress or another documentation tool shall not start development/preview/build processes.

**DD-DOCCAP-056 — Provider selection is governed**  
Tool/provider selection shall consume explicit/effective configuration and capability constraints rather than incidental package-script or discovery order.

**DD-DOCCAP-057 — Tooling provider independence**  
VitePress, another static-site generator or a future provider shall remain below the shared contract unless a later approved specification intentionally makes one provider normative.

---

## 19. Process Execution Boundary for Documentation Tooling

Documentation tooling generally delegates technical execution through DD-2.2.

**DD-DOCCAP-058 — Process completion is not documentation success**  
Process launch/completion, exit status and output shall be normalized under the requested documentation-tool operation before application interpretation.

**DD-DOCCAP-059 — Development/preview launch is not generation success**  
Successfully starting a long-running documentation server establishes provider execution state, not that documentation was generated, correct or accepted.

**DD-DOCCAP-060 — Build completion remains provider evidence**  
A build provider may report successful technical completion and generated artefacts; Docs/Application Engine determines the application-level outcome.

**DD-DOCCAP-061 — Shell boundaries remain explicit**  
Documentation-tool invocation shall preserve DD-2.2 executable/argument/shell policy rather than accepting arbitrary command strings through the documentation contract.

---

## 20. Documentation Tool Result Model

A normalized tooling result should represent where applicable:

- operation class;
- target identity;
- provider identity;
- technical execution state;
- running/started/stopped state for long-running operations;
- generated artefacts;
- bounded output/diagnostics;
- timing;
- cancellation/timeout evidence;
- completeness.

**DD-DOCCAP-062 — Long-running state remains explicit**  
Development/preview operations shall not be forced into a completed-success model while still running.

**DD-DOCCAP-063 — Generated tooling artefacts are effects**  
Known build/output artefacts shall be reported as provider effects without granting permission to modify unrelated resources.

**DD-DOCCAP-064 — Provider failure is normalized**  
Tool launch, configuration, build, runtime and termination failures shall be represented as normalized capability evidence rather than exposed only as provider-native errors.

---

## 21. Documentation-Oriented Validation

Documentation validation may include bounded checks such as rendered-output validity, required-section presence, link/schema/frontmatter validity or provider-specific build validation where these are part of documentation generation/tooling semantics.

**DD-DOCCAP-065 — Documentation validity is not universal Quality authority**  
Documentation-oriented validation used to establish a Documentation Capability result shall not absorb independent Quality-domain checks merely because both produce findings.

**DD-DOCCAP-066 — Source validity after source mutation remains DD-2.5**  
When documentation is injected into existing source, source-level validation remains part of Source Transformation.

**DD-DOCCAP-067 — Quality may consume documentation evidence independently**  
DD-2.8 may later evaluate documentation-related quality criteria where Quality is the primary intent, but this does not transfer Docs generation semantics to Quality.

**DD-DOCCAP-068 — Validation failure is distinct from rendering failure**  
A rendered artefact may exist yet fail documentation-oriented validation; the states shall remain distinguishable.

---

## 22. Coverage, Omission and Completeness Evidence

Documentation completeness is relative to the requested profile/scope, not an unbounded claim about every project fact.

A coverage record may represent:

- requested targets/categories;
- successfully documented inputs;
- empty-but-valid categories;
- unsupported inputs;
- omitted inputs and reasons;
- failed inputs;
- generated artefacts;
- enrichment omissions;
- stale-input evidence.

**DD-DOCCAP-069 — Completeness is profile-relative**  
A result may claim complete coverage only relative to the approved target/profile actually evaluated.

**DD-DOCCAP-070 — Unsupported content cannot count as documented**  
Unsupported/failed inputs shall not silently increase completeness merely because other content was generated.

**DD-DOCCAP-071 — Optional absence is represented correctly**  
A legitimately absent optional category shall not be confused with failed or unsupported documentation coverage.

**DD-DOCCAP-072 — No raw-dump requirement**  
Completeness does not require verbatim inclusion of every source file; it requires satisfaction of the approved documentation profile from authorized facts/content.

---

## 23. Partial Results and Multi-Artefact Operations

**DD-DOCCAP-073 — Per-target/per-artefact evidence is retained**  
Multi-target or multi-artefact operations shall preserve which targets/artefacts succeeded, failed, were omitted, unchanged or not attempted.

**DD-DOCCAP-074 — Capability does not invent universal rollback**  
Documentation Capability shall not claim transactional rollback of downstream writes or provider effects unless the owning components actually guarantee it.

**DD-DOCCAP-075 — Render success may coexist with persistence failure**  
A successfully rendered proposal and a failed downstream write/update are distinct stages and shall remain distinguishable.

---

## 24. Progress, Cancellation and Timeout

**DD-DOCCAP-076 — Progress is target/stage aware**  
Long-running documentation operations may expose model/target/render/enrichment/tool stages without making one UI event format normative.

**DD-DOCCAP-077 — Cancellation propagates to active delegates**  
DD-1 cancellation shall stop future documentation work and propagate to AI/tooling/provider execution where supported.

**DD-DOCCAP-078 — Completed evidence remains after cancellation**  
Cancellation shall not erase already completed inspection, render or known downstream-effect evidence.

**DD-DOCCAP-079 — Cancellation does not imply rollback**  
Cancellation shall not imply that generated files, external AI usage or running/terminated provider effects were reversed unless they actually were.

**DD-DOCCAP-080 — Timeout values are governed inputs**  
Tooling or provider timeouts shall derive from approved configuration/request/provider constraints rather than hidden Detailed Design constants.

---

## 25. Stale-State and Revision Semantics

**DD-DOCCAP-081 — Documentation evidence is revision-relative**  
Facts/models derived from inspected resources shall retain sufficient revision/snapshot context where staleness could materially affect updates or claims of freshness.

**DD-DOCCAP-082 — No false freshness**  
A documentation result shall not claim synchronization/freshness where required inputs failed to refresh or changed materially before acceptance.

**DD-DOCCAP-083 — Existing-document update uses transformation stale checks**  
When updating existing documentation from prior inspection, DD-2.5 stale-state/precondition semantics shall govern the actual transformation.

---

## 26. Sensitive Information and Content Safety

**DD-DOCCAP-084 — Sensitive facts are not automatically documentable**  
The existence of sensitive configuration, credentials, environment data or protected source content within managed scope does not authorize inclusion in documentation.

**DD-DOCCAP-085 — Diagnostics minimize sensitive content**  
Capability diagnostics should identify targets/failures without unnecessarily reproducing protected source, prompts or configuration values.

**DD-DOCCAP-086 — External disclosure uses DD-2.7 policy**  
Documentation content supplied to external AI providers shall follow the AI Capability disclosure/sensitivity contract.

**DD-DOCCAP-087 — Generated documentation remains untrusted output until accepted**  
Rendered or AI-generated content shall not acquire application authority merely because it is intended for human-readable documentation.

---

## 27. Relationship to Other Shared Capabilities

### 27.1 Resource Access

Resource Access owns bounded read/write mechanics. Documentation Capability may consume supplied resource contents/evidence and return proposed output, but target persistence remains separately authorized.

### 27.2 Source Intelligence

Source Intelligence supplies read-only structural facts. Documentation Capability turns selected facts into documentation models/content without redefining source recognition.

### 27.3 Source Transformation

Existing-document/source modifications use Source Transformation for planning, preservation, stale checks, mutation and source-level validation.

### 27.4 Resource Registry and Template

Declarative template identity, validation, parameter binding and rendering substrate remain DD-2.6 responsibilities. Documentation Capability supplies documentation-specific models/parameters and consumes rendered results.

### 27.5 AI Capability

AI supplies bounded proposed enrichment. Documentation Capability/owning Docs use case retains documentation fact selection and acceptance.

### 27.6 Process Execution

Documentation tools may execute through DD-2.2. Process status remains technical evidence.

### 27.7 Quality Capability

Quality may independently assess documentation-related criteria; Documentation Capability does not inherit Quality gate authority.

**DD-DOCCAP-088 — Capability composition preserves authority**  
Combining shared capabilities shall not allow Documentation Capability to acquire their separate authorities or bypass their safety contracts.

---

## 28. Provider and Renderer Contracts

A documentation provider/renderer may own technical mechanics including:

- provider-specific document parsing;
- format rendering;
- markup serialization;
- static-site/documentation-tool invocation construction;
- provider-specific project recognition;
- build-output parsing;
- preview/dev server execution integration;
- provider-specific diagnostics.

**DD-DOCCAP-089 — Providers normalize upward**  
Provider-native objects/results shall be translated into the shared Documentation Capability contracts before application interpretation.

**DD-DOCCAP-090 — Provider limitations are explicit**  
A provider unable to satisfy required format/profile/tooling semantics shall report unsupported/unavailable evidence rather than silently substituting materially different behavior.

**DD-DOCCAP-091 — Provider replaceability**  
Callers shall not require VitePress, one Markdown library, one AST shape or one renderer-native type to consume Documentation Capability results.

**DD-DOCCAP-092 — No universal documentation plugin framework**  
Recurring parser/renderer/provider naming patterns do not require a universal executable plugin system, common base class or cross-runtime protocol in Version 1.

---

## 29. Relationship to DD-1 Outcomes

**DD-DOCCAP-093 — Capability success is not automatically Docs success**  
Inspection, rendering, AI enrichment or tooling success supplies evidence; the owning Docs use case/Application Engine determines whether the complete documentation intent was satisfied.

**DD-DOCCAP-094 — Partial/mixed evidence is preserved**  
Mixed target, render, enrichment, validation and persistence states shall remain available to DD-1.2 rather than collapsing prematurely to a Boolean.

**DD-DOCCAP-095 — Final acceptance remains upstream**  
Documentation Capability may establish that an output satisfies its bounded render/validation contract, but application acceptance remains with the owning use case.

---

## 30. Current Implementation Evidence and Reconciliation

This section is historical implementation evidence under the [Documentation Guide reading conventions](../project-documentation-guide-v01.md#detailed-design-reading-conventions), not permanent product authority.

Current implementation evidence includes `app/services/codeService.ts`, source strategies and related file/AI services.

Useful concepts demonstrated by current code include:

- inspection of documentable blocks;
- file-type strategy selection;
- documentation/header/JSDoc generation intent;
- optional LLM-generated documentation content;
- source-aware injection mechanics;
- file persistence;
- logging of documentation effects.

These implementation facts do **not** make the following permanent architecture:

- one `CodeService` singleton as Documentation Capability;
- regex strategy objects as the universal documentation model;
- direct `fileService.read/write` inside Documentation Capability as the permanent resource boundary;
- direct `llmService.generate()` invocation as the permanent enrichment boundary;
- direct generation-and-write in one method as an approved authority model;
- one prompt string or JSDoc-only response contract;
- direct source injection without DD-2.5 transformation planning/approval/stale checks;
- current source-file strategy registry as managed scope;
- logger output as the application result contract;
- TypeScript/JavaScript/Vue support as the complete documentation architecture;
- current module/package topology as a permanent subsystem boundary.

**DD-DOCCAP-096 — Implementation must converge on approved boundaries**  
Future Implementation Specifications shall adapt current code/documentation services to this Detailed Design rather than weakening shared capability boundaries to preserve incidental current structure.

---

## 31. Security and Safety Model

The capability shall protect against at least:

- documentation target expansion beyond managed scope;
- hidden recursive scans outside selected inputs;
- secret/sensitive material inclusion;
- AI external disclosure outside policy;
- template/provider content acquiring command authority;
- path traversal/output collision being treated as overwrite permission;
- source/document mutation outside DD-2.5/authorized persistence;
- provider-generated commands or markup triggering application actions;
- unbounded provider output/diagnostics;
- stale source/document assumptions;
- documentation-tool execution as a hidden side effect of inspection;
- generated tooling artefacts overwriting unrelated resources.

**DD-DOCCAP-097 — Documentation/provider content is untrusted evidence**  
Existing documentation, rendered content, provider output and generated prose shall not redefine AppManager policy, scope, authorization or configuration.

**DD-DOCCAP-098 — Output references are bounded**  
Generated paths, links, include directives or provider-specific references shall remain data until validated by the downstream consumer responsible for their effects.

---

## 32. Testability Requirements

Core Documentation Capability semantics shall be testable without real external AI providers or one documentation-tool implementation.

Deterministic tests should cover at least:

- supported/unsupported documentable inputs;
- target/profile normalization;
- duplicate input normalization;
- authoritative facts versus generated prose;
- unknown/ambiguous fact handling;
- Source Intelligence consumption without hidden reread;
- domain-authoritative fact preservation;
- existing-document provenance;
- complete versus partial aggregation;
- empty optional categories;
- deterministic template rendering;
- missing/incompatible template;
- output collision evidence;
- generation versus update distinction;
- source injection routed through Source Transformation;
- deterministic baseline with AI unavailable;
- AI enrichment accepted/rejected/contradictory;
- sensitive AI context exclusion;
- documentation-tool unavailable;
- development/preview long-running state;
- build technical success versus Docs acceptance;
- generated tool artefact evidence;
- documentation-oriented validation failure after render;
- cancellation with completed prior stages;
- stale input evidence;
- partial multi-artefact result;
- provider substitution behind the same normalized contract.

**DD-DOCCAP-099 — Fake-provider conformance**  
Core capability tests shall be expressible with deterministic fake source facts, renderers, AI results and documentation-tool providers.

**DD-DOCCAP-100 — Real-provider tests remain adapter-specific**  
Integration tests for VitePress, concrete Markdown libraries, source strategies or other providers may verify provider behavior below the shared boundary but shall not define AppManager documentation semantics.

---

## 33. Conformance Invariants

A conforming DD-2.9 implementation shall preserve all of the following:

1. Documentation Capability is a shared technical capability beneath application authority.
2. Documentation capability execution does not transfer Docs-domain/application authority.
3. Managed scope and documentation target selection remain upstream.
4. Inspection is evidence-producing and non-mutating.
5. Documentable facts retain provenance where material.
6. Authoritative structural/domain facts remain distinguishable from authored/generated prose.
7. Unknown or unsupported meaning is not fabricated as fact.
8. Documentation Capability does not independently crawl arbitrary project resources.
9. Source structural facts come through Source Intelligence where supported.
10. Nuxt/domain-specific semantics remain owned by their authoritative domains/capabilities.
11. Existing documentation is contextual evidence, not automatic canonical truth.
12. Aggregation follows bounded selected inputs and retains omissions/failures.
13. Duplicate logical inputs are normalized where appropriate.
14. Generation produces proposed content/artefacts rather than implicit persistence.
15. Output target/path authority remains upstream/downstream as appropriate.
16. New artefact creation and existing-resource update remain distinct.
17. Existing-document/source updates route through Source Transformation when transformation semantics apply.
18. Templates remain declarative and do not establish application intent or write authority.
19. Rendering does not invent authoritative project facts.
20. Optional AI enrichment does not make deterministic baseline generation provider-dependent where such a baseline exists.
21. AI-generated prose remains proposal/evidence until accepted.
22. Reliable facts are not silently replaced by contradictory generated claims.
23. AI external disclosure follows DD-2.7.
24. Documentation-tool recognition does not execute tooling.
25. Process/tool completion is not documentation acceptance.
26. Development/preview launch is not documentation-generation success.
27. Documentation-oriented validation is distinct from Source Transformation validity and independent Quality authority.
28. Completeness is relative to the approved target/profile.
29. Unsupported/failed inputs do not count as documented coverage.
30. Multi-target/multi-artefact results preserve component evidence.
31. Cancellation does not erase completed evidence or imply rollback.
32. Documentation freshness claims remain revision-aware where material.
33. Sensitive information is not automatically documentable merely because it is accessible.
34. Provider-native parser/renderer/tool objects remain below normalized contracts.
35. Current `CodeService`, strategies, direct AI calls and direct writes are implementation evidence, not permanent architecture.
36. No universal executable documentation plugin framework is introduced from naming similarity.

---

## 34. Traceability Summary

| Detailed Design concern | Primary authority |
|---|---|
| Docs authority/capability boundary | `FR-DOCS-001`–`005`; root Design delegated-authority rule |
| invocation/configuration/scope | `FR-DOCS-006`–`030`; DD-1.1, DD-1.3, DD-1.4, DD-1.5 |
| complete application/source/layers/tests/file inputs | `FR-DOCS-031`–`072`; DD-2.4 and domain-authority boundaries |
| generation/update/persistence distinction | `FR-DOCS-073`–`083`; DD-2.1, DD-2.5, DD-2.6 |
| AI enrichment | `FR-DOCS-084`–`090`; DD-2.7 |
| documentation tooling | `FR-DOCS-091`–`099`; DD-2.2 |
| extraction/aggregation | `FR-DOCS-100`–`105`; DD-2.4, managed scope |
| results/diagnostics/partial success | `FR-DOCS-106`–`113`; DD-1.2 |
| safety/non-destructive behavior | `FR-DOCS-114`–`119`; DD-1.3, DD-2.1, DD-2.5, DD-2.7 |
| independent quality boundary | `FR-DOCS-062`; DD-2.8 |
| provider/runtime replaceability | ADR-0001; root Design implementation-topology independence |

---

## 35. Contract Consumers and Implementation Dependencies {#_35-downstream-detailed-design-dependencies}

### 35.1 DD-2.10 Nuxt Capability

Nuxt Capability shall provide Nuxt-specific recognition, metadata and scaffolding/configuration facts without transferring Nuxt semantic authority to Documentation Capability. DD-2.9 may consume those facts for documentation models.

### 35.2 Domain Detailed Designs

The Docs-domain Detailed Design shall define documentation use-case orchestration using DD-2.9 and shall not duplicate shared inspection/model/render/provider contracts. App, Nuxt, Quality, AI and other domain designs may consume documentation models/proposals while retaining their own application authority.

### 35.3 Implementation Specification

Implementation planning shall determine concrete source/document parsers, model structures, renderers, Markdown/static-site integrations, templates, VitePress/alternative providers, package-manager commands, AI prompt templates, output paths, validation libraries, caching, logging/events and migration from current code/documentation services.

---

## 36. Deferred Implementation Decisions

This Detailed Design intentionally does not choose:

- a permanent documentation markup format;
- a permanent static-site/documentation provider;
- a permanent parser or Markdown library;
- exact documentation model classes/interfaces;
- exact section ordering or prose style;
- exact output paths or filenames;
- exact template identities/contents;
- exact source-file extensions supported;
- exact aggregation heuristics;
- exact caching strategy;
- exact documentation-tool commands or package scripts;
- exact preview/development ports;
- exact AI prompts/models/parameters;
- exact validation libraries;
- exact logging/event transport;
- exact class/package/module topology;
- a universal executable documentation plugin framework.

These belong to Implementation Specification, effective configuration, provider adapters or a future ADR where a major architectural choice is intentionally introduced.

---

## 37. Final Design Position

The permanent Version 1 position is:

> **Documentation Capability owns bounded documentation evidence modeling, aggregation, rendering, optional enrichment and documentation-tool delegation; application intent, managed scope, source mutation, persistence and final documentation acceptance remain outside the capability.**

The canonical model is:

```text
owning Docs use case / managed scope / documentation profile
                  + authoritative selected facts
                              |
                              v
                 Documentation Capability
                              |
          normalize facts / provenance
          compose documentation model
          aggregate bounded inputs
          render proposed documentation
          optionally enrich through AI
          optionally delegate docs tooling
                              |
                              v
        normalized docs proposal/evidence
                              |
                              v
 owning use case -> authorized persistence/transformation
                  -> validation -> AppManager acceptance
```

The central non-drift rule is:

> **Documentation Capability may explain and render what AppManager knows; it does not gain authority to change what AppManager manages merely because it can describe it.**
