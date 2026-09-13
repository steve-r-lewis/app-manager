# AppManager Docs Functional Specification

> **Status:** Version 1 Functional Specification
>
> **Functional domain:** `docs`
>
> **Requirement prefix:** `FR-DOCS`
>
> **Governing sources:** [Project Documentation Guide](../project-documentation-guide-v01.md), [AppManager Design Specification](../appmanager-design-specification-v01.md)
>
> **Related Functional Specifications:** [application-invocation-functional-specification-v01.md](application-invocation-functional-specification-v01.md), [managed-project-functional-specification-v01.md](managed-project-functional-specification-v01.md), [configuration-functional-specification-v01.md](configuration-functional-specification-v01.md), [source-transformation-functional-specification-v01.md](source-transformation-functional-specification-v01.md), [nuxt-functional-specification-v01.md](nuxt-functional-specification-v01.md)
>
> **Planning source:** [docs/project_management/functional-specification-decomposition-plan-v01.md](../project_management/functional-specification-decomposition-plan-v01.md)

## 1. Purpose

This specification defines the observable Version 1 behaviour of the AppManager `docs` domain.

The `docs` domain owns documentation-oriented application intent: selecting documentable managed-project scope, inspecting that scope, deriving documentation information, generating documentation artefacts and, where supported as an AppManager use case, operating documentation tooling for those artefacts.

The governing boundary is:

> **The `docs` domain owns documentation intent and documentation outcomes. It does not acquire authority over Nuxt semantics, source transformation, project scope, package execution, AI generation, or documentation-tool implementation merely because those capabilities are used to produce or present documentation.**

Version 1 supports documentation of the complete application, application source, all layers, a selected layer, tests and a selected file, together with bounded documentation generation, update, extraction, aggregation and tooling workflows.

---

## 2. Functional Boundary

### 2.1 Owned behaviour

The `docs` domain owns the observable semantics of:

- documenting the complete managed application;
- documenting application source;
- documenting all managed layers;
- documenting a selected managed layer;
- documenting tests;
- documenting a selected file;
- selecting documentation targets interactively where an interactive adapter is used;
- deriving documentation from supported source and project facts;
- generating documentation artefacts from those facts;
- updating existing documentation where an explicitly supported documentation use case requires it;
- reporting coverage, omissions, unsupported targets and generation failures;
- coordinating optional AI assistance without making AI output authoritative;
- operating supported documentation development, build or preview workflows where those workflows are exposed as AppManager documentation use cases.

### 2.2 Explicit non-ownership

This specification does not define:

- managed-project discovery or mutation authority, which belongs to the Managed Project Functional Specification;
- Nuxt configuration or layer semantics, which belong to the `nuxt` domain;
- generic source inspection and mutation safety, which belong to the Source Transformation Functional Specification;
- package-manager, process, VitePress, Markdown parser or generator implementation details;
- concrete output directories or filenames unless later made part of a stable user-facing contract;
- template-engine internals;
- LLM provider selection or implementation;
- generic AI-document management, which belongs to the `ai` domain;
- quality/test execution, which belongs to `quality`;
- generic project lifecycle execution, which belongs to `app`;
- project documentation governance for the AppManager repository itself, which remains governed by the Project Documentation Guide.

### 2.3 Documentation is not mutation authority

**FR-DOCS-001 — Documentation intent**  
A documentation invocation shall identify documentation as its primary application intent and shall not silently become a general-purpose source mutation operation.

**FR-DOCS-002 — Discovery does not grant mutation authority**  
Recognition of a source file, test, layer, configuration item, generated artefact or documentation target shall not by itself authorize modification of that resource.

**FR-DOCS-003 — Read-only default**  
Inspection and derivation of documentation information shall be read-only unless the selected use case explicitly includes creation or update of documentation artefacts.

**FR-DOCS-004 — Documentation-output boundary**  
Where a use case creates or updates documentation, its mutation authority shall be bounded to the approved documentation output scope and shall not implicitly extend to source code or project configuration.

**FR-DOCS-005 — Delegated execution**  
Use of parsers, scanners, generators, templates, AI providers, Nuxt facts, process execution or documentation tools shall not delegate AppManager's authority to determine documentation intent, scope, acceptance or final outcome.

---

## 3. Common Documentation Invocation Behaviour

**FR-DOCS-006 — Structured invocation**  
Every Docs use case shall participate in the common Application Invocation Contract and return an application-level structured outcome.

**FR-DOCS-007 — Interaction-mode equivalence**  
TUI, Headless and future adapters shall preserve equivalent documentation intent, scope, validation, safety and outcome semantics even where target selection or presentation differs.

**FR-DOCS-008 — Deterministic Headless operation**  
A Headless documentation invocation shall not depend upon an interactive prompt. All information required to resolve the requested documentation target and behaviour shall be supplied or deterministically resolvable.

**FR-DOCS-009 — Unresolved required input**  
If required documentation scope or target information cannot be resolved non-interactively, AppManager shall fail without guessing a target.

**FR-DOCS-010 — Interactive target selection**  
An interactive adapter may present discovered eligible documentation targets for selection, but the resulting invocation shall resolve to the same underlying documentation semantics available to non-interactive callers.

**FR-DOCS-011 — Availability**  
A documentation use case shall distinguish an unknown use case from a known use case that is unavailable because its required project context, target, configuration or delegated capability is absent.

**FR-DOCS-012 — Effective configuration**  
Documentation behaviour affected by configuration shall consume effective configuration according to the Configuration Functional Specification rather than independently resolving competing configuration semantics.

**FR-DOCS-013 — Project context**  
Project-scoped documentation operations shall consume the resolved managed-project context and shall not reconstruct an independent competing model of the project.

**FR-DOCS-014 — Managed scope**  
The documentation target set shall be derived from or validated against managed scope before consequential documentation writes occur.

**FR-DOCS-015 — Outside-scope targets**  
A requested target outside approved managed scope shall be rejected unless the owning use case explicitly supports an external read-only input and that input is unambiguous.

**FR-DOCS-016 — Cancellation**  
Where a documentation operation supports cancellation, cancellation shall stop further work as soon as safely practical and report any artefacts already produced or updated.

**FR-DOCS-017 — Progress**  
Long-running multi-target documentation operations shall expose progress or execution events where useful without making presentation-specific progress UI part of the functional contract.

**FR-DOCS-018 — Retry authority**  
Failure of a delegated documentation capability shall not authorize an implicit retry, fallback provider or changed target unless such behaviour is explicitly part of effective policy.

---

## 4. Documentation Target Model

**FR-DOCS-019 — Target identity**  
Every documentation operation shall resolve an explicit semantic target rather than relying only on the caller's current working directory.

**FR-DOCS-020 — Supported target classes**  
Version 1 shall support documentation intent for at least the complete managed application, application source, all managed layers, one selected managed layer, tests and one selected file.

**FR-DOCS-021 — Root application distinction**  
Documentation behaviour shall preserve the distinction between the managed root application and its managed layers.

**FR-DOCS-022 — Layer independence**  
A selected layer shall be documentable as a distinct managed unit with its own source, configuration, tests, documentation and other recognized facts where present.

**FR-DOCS-023 — All-layers target**  
The all-layers target shall include the managed layers eligible under the resolved project context and documentation scope, not arbitrary directories that merely resemble layers.

**FR-DOCS-024 — Source target**  
The application-source target shall represent recognized source content within the approved managed scope and shall exclude unrelated project resources unless the documentation profile explicitly includes them.

**FR-DOCS-025 — Test target**  
The tests target shall represent recognized test resources within managed scope independently of whether those tests are executable by the `quality` domain at the time of documentation.

**FR-DOCS-026 — Selected-file target**  
A selected-file documentation request shall resolve exactly one eligible file or fail as ambiguous or invalid.

**FR-DOCS-027 — File eligibility**  
A file shall not become documentable merely because it exists. Eligibility may depend on managed scope, supported source type, documentation policy and the selected documentation use case.

**FR-DOCS-028 — Symlink and indirection safety**  
Target resolution shall not allow filesystem indirection to silently escape the approved documentation scope.

**FR-DOCS-029 — Duplicate target normalization**  
Where the same resource is reached through overlapping documentation scopes, AppManager shall avoid unintentionally documenting it multiple times in the same logical operation unless duplication is explicitly requested.

**FR-DOCS-030 — Stable target reporting**  
Structured outcomes shall identify the semantic documentation targets acted upon sufficiently for automation to distinguish root application, layer, test, source and file scopes.

---

## 5. Complete-Application Documentation

**FR-DOCS-031 — Complete-application use case**  
AppManager shall provide a use case for documenting the complete managed application.

**FR-DOCS-032 — Complete means managed composition**  
Complete-application documentation shall be based on the resolved managed-project composition rather than an unbounded recursive dump of the filesystem.

**FR-DOCS-033 — Root coverage**  
Complete-application documentation shall include relevant recognized facts about the root application according to the selected documentation profile.

**FR-DOCS-034 — Layer coverage**  
Complete-application documentation shall include relevant recognized facts for eligible managed layers according to the selected documentation profile.

**FR-DOCS-035 — Source coverage**  
Where source documentation is part of the selected complete-application profile, source targets shall follow the source-target semantics in this specification.

**FR-DOCS-036 — Test coverage**  
Where test documentation is part of the selected complete-application profile, test targets shall follow the test-target semantics in this specification.

**FR-DOCS-037 — Existing documentation**  
Existing recognized documentation may be inspected and incorporated as context where policy permits, but its presence shall not automatically make it authoritative or permit unrestricted rewriting.

**FR-DOCS-038 — Partial coverage**  
If some eligible parts of the managed application cannot be documented, the operation shall distinguish partial documentation from complete success and identify omitted or failed targets.

**FR-DOCS-039 — Empty categories**  
Absence of an optional category such as tests or managed layers shall not itself constitute failure where the project context validly contains none.

**FR-DOCS-040 — Unsupported content**  
Unsupported content encountered during complete-application documentation shall be reported according to significance rather than silently represented as successfully documented.

---

## 6. Application-Source Documentation

**FR-DOCS-041 — Source-documentation use case**  
AppManager shall provide a use case for documenting recognized application source within approved managed scope.

**FR-DOCS-042 — Structural inspection**  
Where supported, source documentation shall derive information from structure-aware inspection rather than relying solely on raw text concatenation.

**FR-DOCS-043 — Source facts**  
Documentation may include supported facts such as declarations, exports, responsibilities, relationships, metadata and other documentable structural information where reliably recognized.

**FR-DOCS-044 — No invented source semantics**  
AppManager shall not present an inferred source meaning as a confirmed structural fact when the available inspection cannot establish it reliably.

**FR-DOCS-045 — Unsupported source structure**  
Unsupported or ambiguous source structures shall produce diagnostics or omissions rather than unsafe guessing.

**FR-DOCS-046 — Preserve source**  
Source-documentation generation shall not modify the source being documented unless a separately identified and authorized documentation-injection use case explicitly requires source mutation.

**FR-DOCS-047 — Source transformation dependency**  
Any supported operation that injects or updates documentation inside existing source shall comply with the Source Transformation Functional Specification.

**FR-DOCS-048 — Bounded source mutation**  
A source-documentation update shall be limited to the recognized documentation region or other explicitly approved transformation target and preserve unrelated source content where practical.

**FR-DOCS-049 — Source-level validation**  
After a documentation transformation of existing source, source-level validity shall be checked where the affected source type supports validation.

**FR-DOCS-050 — Application-level acceptance**  
Source-level validity shall not by itself establish success; AppManager shall also determine whether the resulting documentation change satisfies requested intent, managed scope and policy.

---

## 7. Layer Documentation

**FR-DOCS-051 — All-layers use case**  
AppManager shall provide a use case for documenting all eligible managed layers.

**FR-DOCS-052 — Selected-layer use case**  
AppManager shall provide a use case for documenting one selected managed layer.

**FR-DOCS-053 — Layer selection**  
A selected-layer invocation shall identify the layer unambiguously by a stable project-context identity or equivalent semantic selector.

**FR-DOCS-054 — Ambiguous layer**  
If a requested layer selector resolves to multiple candidates, AppManager shall require disambiguation rather than choosing one silently.

**FR-DOCS-055 — Layer-specific facts**  
Layer documentation may consume Nuxt-specific facts supplied through the Nuxt domain or an approved capability without transferring Nuxt semantic authority to Docs.

**FR-DOCS-056 — Repository independence**  
Whether a layer has its own repository, is represented by a repository relationship, or shares repository topology with another resource shall not determine whether the layer is documentable.

**FR-DOCS-057 — Standalone layers**  
A valid standalone managed Nuxt layer may be documented independently of whether it is currently integrated into the root application's Nuxt composition.

**FR-DOCS-058 — Integrated-layer context**  
Where useful, documentation may identify that a managed layer is integrated into a host application, but the Nuxt domain remains authoritative for that integration fact.

**FR-DOCS-059 — Layer failures**  
During all-layers documentation, failure to document one layer shall be reported against that layer and shall not be misreported as complete success.

**FR-DOCS-060 — Continuation after layer failure**  
A multi-layer operation may continue after an isolated layer failure where doing so is safe and policy permits, with final partial-success reporting.

---

## 8. Test Documentation

**FR-DOCS-061 — Test-documentation use case**  
AppManager shall provide a use case for documenting recognized tests within managed scope.

**FR-DOCS-062 — Documentation versus execution**  
Docs shall inspect tests for documentation purposes without assuming authority to execute them; execution and quality-gate semantics belong to `quality`.

**FR-DOCS-063 — Test structure**  
Where reliably recognizable, test documentation may describe test suites, cases, fixtures, targets or other structural test facts.

**FR-DOCS-064 — Test/source relationship**  
Where a reliable relationship between a test and tested source can be established, documentation may represent that relationship without requiring the resources to reside in the same directory.

**FR-DOCS-065 — Unresolved relationship**  
An unresolved test-to-source relationship shall be represented as unresolved or omitted rather than invented.

**FR-DOCS-066 — Test framework independence**  
The functional requirement to document tests shall not prescribe a particular test framework.

---

## 9. Selected-File Documentation

**FR-DOCS-067 — Selected-file use case**  
AppManager shall provide a use case for documenting one eligible selected file.

**FR-DOCS-068 — Interactive file selection**  
Where TUI or another interactive adapter is used, AppManager may present eligible files for interactive selection.

**FR-DOCS-069 — Headless file selection**  
Headless callers shall identify the file through a deterministic selector and shall never be forced into interactive selection.

**FR-DOCS-070 — Selected-file inspection**  
The selected file shall be inspected using the most appropriate supported recognition capability for its type without making the recognition implementation part of this Functional Specification.

**FR-DOCS-071 — File-specific result**  
The structured outcome shall identify the selected file and whether documentation was generated, updated, skipped, unsupported or failed.

**FR-DOCS-072 — Binary or unsupported file**  
A binary or otherwise unsupported file shall be rejected or reported as unsupported rather than treated as successfully documented text.

---

## 10. Documentation Generation and Update

**FR-DOCS-073 — Generation intent**  
Creation of a new documentation artefact shall be treated as generation and shall not be conflated with mutation of an existing documentation artefact.

**FR-DOCS-074 — Existing-document update**  
Updating existing documentation shall be treated as a transformation and shall comply with shared transformation requirements.

**FR-DOCS-075 — Output scope**  
Before writing documentation, AppManager shall resolve the intended output scope and reject an ambiguous destination.

**FR-DOCS-076 — Output collision**  
If generation would overwrite an existing artefact, AppManager shall apply explicit overwrite/update policy rather than silently replacing it.

**FR-DOCS-077 — Preview where consequential**  
Where a documentation update would materially replace or restructure existing authored content, AppManager shall support preview or equivalent proposed-change information when required by transformation policy.

**FR-DOCS-078 — Preservation of unrelated content**  
A bounded documentation update shall preserve unrelated authored content where practical and shall not rewrite an entire artefact merely because a narrower recognized update is possible.

**FR-DOCS-079 — Generated provenance**  
Where useful to users or automation, generated documentation shall expose sufficient provenance to identify the managed target and generation context without leaking sensitive configuration.

**FR-DOCS-080 — Repeatability**  
Repeated generation from materially equivalent project facts and effective configuration should produce semantically stable documentation outcomes, subject to explicitly non-deterministic optional capabilities such as AI assistance.

**FR-DOCS-081 — No false freshness**  
AppManager shall not represent stale or failed-to-refresh documentation as newly synchronized merely because an invocation completed other work successfully.

**FR-DOCS-082 — Partial write reporting**  
If a multi-artefact documentation operation fails after some writes succeed, the structured outcome shall identify the artefacts written, skipped, unchanged or failed.

**FR-DOCS-083 — No universal rollback claim**  
Version 1 shall not imply that all multi-artefact documentation generation is transactionally rolled back unless a later Detailed Design explicitly provides and validates that guarantee.

---

## 11. AI-Assisted Documentation

**FR-DOCS-084 — Optional AI assistance**  
Docs use cases may employ AI assistance for summarization, drafting or enrichment where policy permits, but AI availability shall not automatically be a prerequisite for documentation that can be produced deterministically without it.

**FR-DOCS-085 — Domain ownership**  
Use of AI inside a Docs workflow shall not transfer the use case to the `ai` domain when documentation remains the primary application intent.

**FR-DOCS-086 — Non-authoritative AI output**  
AI-generated documentation content shall remain proposed or derived content until AppManager validates and accepts it according to the documentation use case.

**FR-DOCS-087 — Fact preservation**  
AI enrichment shall not replace reliably inspected structural facts with contradictory generated claims.

**FR-DOCS-088 — AI failure fallback**  
Where a deterministic non-AI documentation path exists, failure or unavailability of AI assistance may fall back to that path and shall report the omitted enrichment where functionally significant.

**FR-DOCS-089 — No fabricated completion**  
If required documentation meaning cannot be established without an unavailable capability, AppManager shall report the limitation rather than fabricate content to satisfy apparent completeness.

**FR-DOCS-090 — Sensitive context**  
Documentation context supplied to AI capabilities shall respect effective policy for sensitive data and shall not include protected material merely because it is present in managed project files or configuration.

---

## 12. Documentation Tooling Workflows

Version 1 supports operating configured documentation tooling for development, build and preview workflows without making VitePress, package-manager commands or process-spawn mechanics part of the Functional contract.

**FR-DOCS-091 — Documentation-tool operation**  
Where documentation tooling is configured and supported for a managed documentation target, AppManager may expose documentation development, build and preview operations as Docs use cases.

**FR-DOCS-092 — Explicit tooling target**  
A tooling invocation shall distinguish which documentation project or documentation scope it operates against and shall not silently choose between AppManager's own documentation and a managed target project's documentation.

**FR-DOCS-093 — Managed-project documentation tooling**  
Managed-project documentation tooling shall be available only where the required documentation project/tooling capability can be recognized or configured sufficiently to execute the requested operation.

**FR-DOCS-094 — Tool implementation independence**  
The Functional Specification shall not require VitePress specifically; a later Detailed Design or effective project configuration may select VitePress or another supported provider.

**FR-DOCS-095 — Development operation**  
A supported documentation development operation may be long-running and shall expose execution state and cancellation semantics through the common invocation model where supported.

**FR-DOCS-096 — Build operation**  
A supported documentation build operation shall report application-level success or failure independently of provider-specific exit presentation.

**FR-DOCS-097 — Preview operation**  
A supported documentation preview operation shall report whether the preview capability started successfully and shall not be represented as documentation-generation success merely because a server process launched.

**FR-DOCS-098 — Delegated tooling failure**  
A documentation-tool provider failure shall be interpreted and returned as a Docs application outcome rather than exposed only as an unstructured provider error.

**FR-DOCS-099 — Generated tooling artefacts**  
Build artefacts produced by delegated documentation tooling shall be reported as delegated effects where functionally relevant but shall not expand Docs mutation authority over unrelated project resources.

---

## 13. Documentation Extraction and Aggregation

Extraction, aggregation or generation of documentation from managed source is a Docs-domain responsibility when documentation is the primary intent, even where the inspected resources are Nuxt layers. Nuxt-specific recognition remains delegated to Nuxt authority.

**FR-DOCS-100 — Documentation extraction ownership**  
Extraction, aggregation or generation of documentation from managed source is a Docs-domain responsibility when documentation is the primary intent, even where the inspected resources are Nuxt layers.

**FR-DOCS-101 — Nuxt fact delegation**  
Docs may consume Nuxt-specific facts from the `nuxt` domain or an approved Nuxt capability without independently redefining Nuxt recognition or configuration semantics.

**FR-DOCS-102 — Multi-file aggregation**  
A documentation use case may aggregate information from multiple eligible files into one or more documentation artefacts while preserving target provenance and reporting unsupported or failed inputs.

**FR-DOCS-103 — No raw-dump requirement**  
Aggregation shall not require verbatim concatenation of source files; the observable requirement is useful documentation derived from approved facts and content within copyright, security and project policy constraints.

**FR-DOCS-104 — Selection policy**  
The file types and resources included in an aggregation shall be determined by the documentation use case, managed scope and effective configuration rather than by an unbounded recursive scan.

**FR-DOCS-105 — Exclusions**  
Generated output, dependency trees, caches, protected data and other resources excluded by project or documentation policy shall not be included merely because they are reachable beneath a target directory.

---

## 14. Results, Diagnostics and Failure Semantics

**FR-DOCS-106 — Structured success**  
A successful documentation result shall identify the requested use case, resolved target scope and resulting artefacts or read-only documentation output as applicable.

**FR-DOCS-107 — Structured failure**  
A failed result shall identify the stage and target responsible sufficiently for automation or a user to distinguish target-resolution, inspection, generation, transformation, delegated-tool and acceptance failures.

**FR-DOCS-108 — Partial success**  
Multi-target or multi-artefact operations shall represent partial success explicitly rather than collapsing mixed outcomes into success or failure alone.

**FR-DOCS-109 — Warnings**  
Non-fatal omissions, unsupported source types, stale inputs, unavailable optional enrichment and similar conditions shall be exposed as warnings where they materially affect interpretation of the documentation outcome.

**FR-DOCS-110 — Diagnostic sensitivity**  
Diagnostics shall avoid exposing protected information or unnecessary sensitive project content.

**FR-DOCS-111 — Provider abstraction**  
Machine-consumable outcomes shall not require callers to parse raw provider stdout, stderr, prompts or UI text to determine application-level documentation status.

**FR-DOCS-112 — Consequential effect reporting**  
When documentation writes or delegated tooling produce consequential effects, the result shall identify those effects sufficiently for callers to understand what changed or was produced.

**FR-DOCS-113 — Acceptance failure**  
If generated or transformed documentation is syntactically valid but fails AppManager's intent, scope, safety or acceptance policy, the operation shall not report complete success.

---

## 15. Safety and Non-Destructive Behaviour

**FR-DOCS-114 — Source preservation**  
Documentation generation shall preserve source code and project configuration unless the selected use case explicitly authorizes a bounded documentation transformation of that resource.

**FR-DOCS-115 — No implicit deletion**  
A documentation generation or update operation shall not delete unrelated documentation artefacts merely because they are absent from the newly generated set.

**FR-DOCS-116 — Explicit replacement policy**  
Replacement of substantial existing authored documentation shall require an explicit applicable policy and, where required by invocation or transformation semantics, confirmation or non-interactive authorization.

**FR-DOCS-117 — Stale-source protection**  
Where a documentation transformation is based on previously inspected existing content, AppManager shall avoid silently applying a stale plan when the target has materially changed and that change can be detected.

**FR-DOCS-118 — External effects**  
Starting a documentation server or invoking external documentation tooling shall be treated as an observable delegated effect and shall not occur as a hidden side effect of a read-only documentation-inspection request.

**FR-DOCS-119 — Fail-safe ambiguity**  
Where target, output destination, overwrite intent or consequential scope is ambiguous, AppManager shall fail safely rather than infer the most destructive interpretation.

---

## 16. Traceability Summary

| Functional area | Requirements | Current authority |
|---|---|---|
| Domain boundary and authority | FR-DOCS-001–005 | Root Design §§1, 3, 6, 10; decomposition plan §5.2 |
| Invocation and project context | FR-DOCS-006–018 | Root Design §§4–7; FR-INV, FR-PROJ, FR-CONFIG |
| Documentation target model | FR-DOCS-019–030 | This specification §4; FR-PROJ |
| Complete application | FR-DOCS-031–040 | This specification §5; FR-PROJ |
| Application source | FR-DOCS-041–050 | This specification §6; FR-XFORM |
| Layers | FR-DOCS-051–060 | This specification §7; FR-PROJ; FR-NUXT |
| Tests | FR-DOCS-061–066 | This specification §8; Quality ownership boundary |
| Selected file | FR-DOCS-067–072 | This specification §9; FR-PROJ |
| Generation and update | FR-DOCS-073–083 | This specification §10; Root Design generation boundaries; FR-XFORM |
| AI assistance | FR-DOCS-084–090 | This specification §11; Root Design capability boundaries; FR-AI |
| Documentation tooling | FR-DOCS-091–099 | This specification §12; Process Execution boundary |
| Extraction/aggregation | FR-DOCS-100–105 | This specification §13; decomposition plan §5.2; FR-NUXT |
| Results and diagnostics | FR-DOCS-106–113 | This specification §14; FR-INV; Application Engine authority |
| Safety | FR-DOCS-114–119 | This specification §15; Root Design safety principles; FR-XFORM; FR-PROJ |

---

## 17. Downstream Specification Boundary

Detailed Design may define permanent internal contracts for documentation inspection, documentation models, generators, renderers, templates, documentation-tool providers, AI-assisted enrichment, aggregation, source-aware documentation transformation and output planning.

Implementation Specifications may define concrete TypeScript modules, VitePress integration, package-manager commands, source paths, parsers, file extensions, templates, process APIs and output directories.

Neither level may redefine the functional ownership established here without an approved change to the governing specification hierarchy.

---

## 18. Version 1 Functional Baseline

This document establishes the Version 1 Functional baseline for the AppManager `docs` domain.

The central rule is:

> **Documentation may inspect and describe the whole managed application, but its authority to change the project remains limited to the explicitly approved documentation operation and scope.**

This preserves documentation as a first-class AppManager product capability without turning it into an alternate project scanner, Nuxt authority, source-mutation engine, AI authority or application-lifecycle subsystem.