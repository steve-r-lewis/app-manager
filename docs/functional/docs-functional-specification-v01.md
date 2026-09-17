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
> **Historical planning provenance (non-normative):** [docs/project_management/functional-specification-decomposition-plan-v01.md](../project_management/functional-specification-decomposition-plan-v01.md)

## 1. Purpose

This specification defines the observable Version 1 behaviour of the AppManager `docs` domain.

The `docs` domain owns documentation-oriented application intent: selecting documentable managed-project scope, inspecting that scope, deriving documentation information, generating documentation artefacts and, where supported as an AppManager use case, operating documentation tooling for those artefacts.

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

<a id="fr-docs-001"></a>

**FR-DOCS-001 — Documentation intent**  
A documentation invocation shall identify documentation as its primary application intent and shall not silently become a general-purpose source mutation operation.

<a id="fr-docs-002"></a>

**FR-DOCS-002 — Discovery does not grant mutation authority**  
Recognised documentation inputs/targets shall apply [Design §9.9](../appmanager-design-specification-v01.md#_9-9-non-destructive-ownership-and-unmanaged-content).

<a id="fr-docs-003"></a>

**FR-DOCS-003 — Read-only default**  
Inspection and derivation of documentation information shall be read-only unless the selected use case explicitly includes creation or update of documentation artefacts.

<a id="fr-docs-004"></a>

**FR-DOCS-004 — Documentation-output boundary**  
Where a use case creates or updates documentation, its mutation authority shall be bounded to the approved documentation output scope and shall not implicitly extend to source code or project configuration.

<a id="fr-docs-005"></a>

**FR-DOCS-005 — Delegated execution**  
Docs capability delegation shall conform to [Design §6.2](../appmanager-design-specification-v01.md#_6-2-application-engine-authority), [Design §11.11](../appmanager-design-specification-v01.md#_11-11-workflow-results-failure-and-acceptance).

---

### 2.4 Canonical Version 1 Command Surface

The thirteen Docs identities bind to the requirement sections below:

| Identity | Behaviour |
|---|---|
| `docs.document-application` | §5 |
| `docs.document-source` | §6 |
| `docs.document-layers`, `docs.document-layer` | §7 |
| `docs.document-tests` | §8 |
| `docs.document-file` | §9 |
| `docs.generate`, `docs.update` | §10 |
| `docs.extract`, `docs.aggregate` | §13 |
| `docs.develop`, `docs.build`, `docs.preview` | §12 |

No `generate-all`, `update-all`, `bulk-generate`, `bulk-update` or AI-specific competing Docs identity is introduced.

---

## 3. Common Documentation Invocation Behaviour

<a id="fr-docs-006"></a>

**FR-DOCS-006 — Structured invocation**  
Docs invocation and completion shall apply [FR-INV-007](application-invocation-functional-specification-v01.md#fr-inv-007), [FR-INV-033](application-invocation-functional-specification-v01.md#fr-inv-033).

<a id="fr-docs-007"></a>

**FR-DOCS-007 — Interaction-mode equivalence**  
Documentation intent across TUI, GUI, Headless and future adapters shall apply [Design §4.6](../appmanager-design-specification-v01.md#_4-6-presentation-independence).

<a id="fr-docs-008"></a>

**FR-DOCS-008 — Deterministic Headless operation**  
Headless documentation shall apply [FR-INV-020](application-invocation-functional-specification-v01.md#fr-inv-020).

<a id="fr-docs-009"></a>

**FR-DOCS-009 — Unresolved required input**  
Unresolved Headless documentation scope/target shall apply [FR-INV-020](application-invocation-functional-specification-v01.md#fr-inv-020).

<a id="fr-docs-010"></a>

**FR-DOCS-010 — Interactive target selection**  
Interactive eligible-target selection shall apply [FR-INV-019](application-invocation-functional-specification-v01.md#fr-inv-019).

<a id="fr-docs-011"></a>

**FR-DOCS-011 — Availability**  
Unknown or unavailable Docs use cases shall apply [FR-INV-006](application-invocation-functional-specification-v01.md#fr-inv-006), [FR-INV-015](application-invocation-functional-specification-v01.md#fr-inv-015).

<a id="fr-docs-012"></a>

**FR-DOCS-012 — Effective configuration**  
Configurable documentation behaviour shall apply [FR-CONFIG-020](configuration-functional-specification-v01.md#fr-config-020).

<a id="fr-docs-013"></a>

**FR-DOCS-013 — Project context**  
Project-scoped documentation context shall apply [Design §9.2](../appmanager-design-specification-v01.md#_9-2-managed-project-context).

<a id="fr-docs-014"></a>

**FR-DOCS-014 — Managed scope**  
Consequential documentation output targeting shall apply [Design §9.7](../appmanager-design-specification-v01.md#_9-7-managed-scope-and-operation-targeting), [FR-PROJ-044](managed-project-functional-specification-v01.md#fr-proj-044).

<a id="fr-docs-015"></a>

**FR-DOCS-015 — Outside-scope targets**  
A requested target outside approved managed scope shall be rejected unless the owning use case explicitly supports an external read-only input and that input is unambiguous.

<a id="fr-docs-016"></a>

**FR-DOCS-016 — Cancellation**  
Docs operations supporting cancellation shall stop initiation of further work as soon as safely practical. Created/updated artefacts shall be reported under [FR-INV-031](application-invocation-functional-specification-v01.md#fr-inv-031).

<a id="fr-docs-017"></a>

**FR-DOCS-017 — Progress**  
Long-running multi-target documentation shall apply [FR-INV-027](application-invocation-functional-specification-v01.md#fr-inv-027).

<a id="fr-docs-018"></a>

**FR-DOCS-018 — Retry authority**  
Docs retries shall apply [FR-INV-049](application-invocation-functional-specification-v01.md#fr-inv-049). Provider fallback or target changes require explicit effective policy.

---

## 4. Documentation Target Model

<a id="fr-docs-019"></a>

**FR-DOCS-019 — Target identity**  
Documentation semantic-target resolution shall apply [Design §9.6](../appmanager-design-specification-v01.md#_9-6-project-discovery-and-context-resolution), [FR-PROJ-005](managed-project-functional-specification-v01.md#fr-proj-005).

<a id="fr-docs-020"></a>

**FR-DOCS-020 — Supported target classes**  
Version 1 shall support documentation intent for at least the complete managed application, application source, all managed layers, one selected managed layer, tests and one selected file.

<a id="fr-docs-021"></a>

**FR-DOCS-021 — Root application distinction**  
Documentation root/layer identity shall apply [Design §9.3](../appmanager-design-specification-v01.md#_9-3-root-application-and-managed-layers).

<a id="fr-docs-022"></a>

**FR-DOCS-022 — Layer independence**  
A selected layer shall be documentable as a distinct managed unit with its own source, configuration, tests, documentation and other recognized facts where present.

<a id="fr-docs-023"></a>

**FR-DOCS-023 — All-layers target**  
The all-layers target shall include the managed layers eligible under the resolved project context and documentation scope, not arbitrary directories that merely resemble layers.

<a id="fr-docs-024"></a>

**FR-DOCS-024 — Source target**  
The application-source target shall represent recognized source content within the approved managed scope and shall exclude unrelated project resources unless the documentation profile explicitly includes them.

<a id="fr-docs-025"></a>

**FR-DOCS-025 — Test target**  
The tests target shall represent recognized test resources within managed scope independently of whether those tests are executable by the `quality` domain at the time of documentation.

<a id="fr-docs-026"></a>

**FR-DOCS-026 — Selected-file target**  
A selected-file documentation request shall resolve exactly one eligible file or fail as ambiguous or invalid.

<a id="fr-docs-027"></a>

**FR-DOCS-027 — File eligibility**  
A file shall not become documentable merely because it exists. Eligibility may depend on managed scope, supported source type, documentation policy and the selected documentation use case.

<a id="fr-docs-028"></a>

**FR-DOCS-028 — Symlink and indirection safety**  
Target resolution shall not allow filesystem indirection to silently escape the approved documentation scope.

<a id="fr-docs-029"></a>

**FR-DOCS-029 — Duplicate target normalization**  
Where the same resource is reached through overlapping documentation scopes, AppManager shall avoid unintentionally documenting it multiple times in the same logical operation unless duplication is explicitly requested.

<a id="fr-docs-030"></a>

**FR-DOCS-030 — Stable target reporting**  
Structured outcomes shall identify the semantic documentation targets acted upon sufficiently for automation to distinguish root application, layer, test, source and file scopes.

---

## 5. Complete-Application Documentation

<a id="fr-docs-031"></a>

**FR-DOCS-031 — Complete-application use case**  
AppManager shall provide a use case for documenting the complete managed application.

<a id="fr-docs-032"></a>

**FR-DOCS-032 — Complete means managed composition**  
Complete-application documentation shall be based on the resolved managed-project composition rather than an unbounded recursive dump of the filesystem.

<a id="fr-docs-033"></a>

**FR-DOCS-033 — Root coverage**  
Complete-application documentation shall include relevant recognized facts about the root application according to the selected documentation profile.

<a id="fr-docs-034"></a>

**FR-DOCS-034 — Layer coverage**  
Complete-application documentation shall include relevant recognized facts for eligible managed layers according to the selected documentation profile.

<a id="fr-docs-035"></a>

**FR-DOCS-035 — Source coverage**  
Source included by the complete-application profile shall apply [FR-DOCS-024](docs-functional-specification-v01.md#fr-docs-024).

<a id="fr-docs-036"></a>

**FR-DOCS-036 — Test coverage**  
Tests included by the complete-application profile shall apply [FR-DOCS-025](docs-functional-specification-v01.md#fr-docs-025).

<a id="fr-docs-037"></a>

**FR-DOCS-037 — Existing documentation**  
Existing recognized documentation may be inspected and incorporated as context where policy permits, but its presence shall not automatically make it authoritative or permit unrestricted rewriting.

<a id="fr-docs-038"></a>

**FR-DOCS-038 — Partial coverage**  
If some eligible parts of the managed application cannot be documented, the operation shall distinguish partial documentation from complete success and identify omitted or failed targets.

<a id="fr-docs-039"></a>

**FR-DOCS-039 — Empty categories**  
Absence of an optional category such as tests or managed layers shall not itself constitute failure where the project context validly contains none.

<a id="fr-docs-040"></a>

**FR-DOCS-040 — Unsupported content**  
Unsupported content encountered during complete-application documentation shall be reported according to significance rather than silently represented as successfully documented.

---

## 6. Application-Source Documentation

<a id="fr-docs-041"></a>

**FR-DOCS-041 — Source-documentation use case**  
AppManager shall provide a use case for documenting recognized application source within approved managed scope.

<a id="fr-docs-042"></a>

**FR-DOCS-042 — Structural inspection**  
Where supported, source documentation shall derive information from structure-aware inspection rather than relying solely on raw text concatenation.

<a id="fr-docs-043"></a>

**FR-DOCS-043 — Source facts**  
Documentation may include supported facts such as declarations, exports, responsibilities, relationships, metadata and other documentable structural information where reliably recognized.

<a id="fr-docs-044"></a>

**FR-DOCS-044 — No invented source semantics**  
AppManager shall not present an inferred source meaning as a confirmed structural fact when the available inspection cannot establish it reliably.

<a id="fr-docs-045"></a>

**FR-DOCS-045 — Unsupported source structure**  
Unsupported or ambiguous source structures shall produce diagnostics or omissions rather than unsafe guessing.

<a id="fr-docs-046"></a>

**FR-DOCS-046 — Preserve source**  
Source-documentation generation shall not modify the source being documented unless a separately identified and authorized documentation-injection use case explicitly requires source mutation.

<a id="fr-docs-047"></a>

**FR-DOCS-047 — Source transformation dependency**  
Source documentation injection/update shall apply [FR-XFORM-033](source-transformation-functional-specification-v01.md#fr-xform-033).

<a id="fr-docs-048"></a>

**FR-DOCS-048 — Bounded source mutation**  
Bounded source-documentation regions shall apply [Design §9.9](../appmanager-design-specification-v01.md#_9-9-non-destructive-ownership-and-unmanaged-content), [FR-XFORM-047](source-transformation-functional-specification-v01.md#fr-xform-047).

<a id="fr-docs-049"></a>

**FR-DOCS-049 — Source-level validation**  
Transformed documentation-bearing source shall apply [FR-XFORM-048](source-transformation-functional-specification-v01.md#fr-xform-048).

<a id="fr-docs-050"></a>

**FR-DOCS-050 — Application-level acceptance**  
Source-valid documentation changes shall apply [FR-DOCS-113](docs-functional-specification-v01.md#fr-docs-113).

---

## 7. Layer Documentation

<a id="fr-docs-051"></a>

**FR-DOCS-051 — All-layers use case**  
AppManager shall provide a use case for documenting all eligible managed layers.

<a id="fr-docs-052"></a>

**FR-DOCS-052 — Selected-layer use case**  
AppManager shall provide a use case for documenting one selected managed layer.

<a id="fr-docs-053"></a>

**FR-DOCS-053 — Layer selection**  
A selected-layer invocation shall identify the layer unambiguously by a stable project-context identity or equivalent semantic selector.

<a id="fr-docs-054"></a>

**FR-DOCS-054 — Ambiguous layer**  
If a requested layer selector resolves to multiple candidates, AppManager shall require disambiguation rather than choosing one silently.

<a id="fr-docs-055"></a>

**FR-DOCS-055 — Layer-specific facts**  
Nuxt facts consumed for layer documentation shall apply [FR-DOCS-101](docs-functional-specification-v01.md#fr-docs-101).

<a id="fr-docs-056"></a>

**FR-DOCS-056 — Repository independence**  
Whether a layer has its own repository, is represented by a repository relationship, or shares repository topology with another resource shall not determine whether the layer is documentable.

<a id="fr-docs-057"></a>

**FR-DOCS-057 — Standalone layers**  
A valid standalone managed Nuxt layer may be documented independently of whether it is currently integrated into the root application's Nuxt composition.

<a id="fr-docs-058"></a>

**FR-DOCS-058 — Integrated-layer context**  
Reported layer integration context shall apply [FR-NUXT-016](nuxt-functional-specification-v01.md#fr-nuxt-016), [FR-NUXT-092](nuxt-functional-specification-v01.md#fr-nuxt-092).

<a id="fr-docs-059"></a>

**FR-DOCS-059 — Layer failures**  
Failures during all-layers documentation shall apply [FR-INV-036](application-invocation-functional-specification-v01.md#fr-inv-036). Results shall attribute each failure to its layer.

<a id="fr-docs-060"></a>

**FR-DOCS-060 — Continuation after layer failure**  
Continuation after layer failure shall apply [FR-DOCS-PBC-022](docs-functional-specification-v01.md#fr-docs-pbc-022).

---

## 8. Test Documentation

<a id="fr-docs-061"></a>

**FR-DOCS-061 — Test-documentation use case**  
AppManager shall provide a use case for documenting recognized tests within managed scope.

<a id="fr-docs-062"></a>

**FR-DOCS-062 — Documentation versus execution**  
Docs shall inspect tests for documentation purposes without assuming authority to execute them; execution and quality-gate semantics belong to `quality`.

<a id="fr-docs-063"></a>

**FR-DOCS-063 — Test structure**  
Where reliably recognizable, test documentation may describe test suites, cases, fixtures, targets or other structural test facts.

<a id="fr-docs-064"></a>

**FR-DOCS-064 — Test/source relationship**  
Where a reliable relationship between a test and tested source can be established, documentation may represent that relationship without requiring the resources to reside in the same directory.

<a id="fr-docs-065"></a>

**FR-DOCS-065 — Unresolved relationship**  
An unresolved test-to-source relationship shall be represented as unresolved or omitted rather than invented.

<a id="fr-docs-066"></a>

**FR-DOCS-066 — Test framework independence**  
The functional requirement to document tests shall not prescribe a particular test framework.

---

## 9. Selected-File Documentation

<a id="fr-docs-067"></a>

**FR-DOCS-067 — Selected-file use case**  
AppManager shall provide a use case for documenting one eligible selected file.

<a id="fr-docs-068"></a>

**FR-DOCS-068 — Interactive file selection**  
Interactive selected-file documentation shall apply [FR-INV-019](application-invocation-functional-specification-v01.md#fr-inv-019).

<a id="fr-docs-069"></a>

**FR-DOCS-069 — Headless file selection**  
Headless selected-file documentation shall apply [FR-INV-020](application-invocation-functional-specification-v01.md#fr-inv-020).

<a id="fr-docs-070"></a>

**FR-DOCS-070 — Selected-file inspection**  
The selected file shall be inspected using the most appropriate supported recognition capability for its type without making the recognition implementation part of this Functional Specification.

<a id="fr-docs-071"></a>

**FR-DOCS-071 — File-specific result**  
The structured outcome shall identify the selected file and whether documentation was generated, updated, skipped, unsupported or failed.

<a id="fr-docs-072"></a>

**FR-DOCS-072 — Binary or unsupported file**  
A binary or otherwise unsupported file shall be rejected or reported as unsupported rather than treated as successfully documented text.

---

## 10. Documentation Generation and Update

<a id="fr-docs-073"></a>

**FR-DOCS-073 — Generation intent**  
New documentation artefact production shall apply [Design §6.8](../appmanager-design-specification-v01.md#_6-8-generation-and-templates).

<a id="fr-docs-074"></a>

**FR-DOCS-074 — Existing-document update**  
Existing-document updates shall apply [Design §6.8](../appmanager-design-specification-v01.md#_6-8-generation-and-templates), [FR-XFORM-033](source-transformation-functional-specification-v01.md#fr-xform-033).

<a id="fr-docs-075"></a>

**FR-DOCS-075 — Output scope**  
Before writing documentation, AppManager shall resolve the intended output scope and reject an ambiguous destination.

<a id="fr-docs-076"></a>

**FR-DOCS-076 — Output collision**  
If generation would overwrite an existing artefact, AppManager shall apply explicit overwrite/update policy rather than silently replacing it.

<a id="fr-docs-077"></a>

**FR-DOCS-077 — Preview where consequential**  
Material replacement/restructuring of authored documentation where preview is required shall apply [FR-INV-025](application-invocation-functional-specification-v01.md#fr-inv-025).

<a id="fr-docs-078"></a>

**FR-DOCS-078 — Preservation of unrelated content**  
Bounded documentation updates shall apply [Design §9.9](../appmanager-design-specification-v01.md#_9-9-non-destructive-ownership-and-unmanaged-content), [FR-XFORM-041](source-transformation-functional-specification-v01.md#fr-xform-041).

<a id="fr-docs-079"></a>

**FR-DOCS-079 — Generated provenance**  
Where useful to users or automation, generated documentation shall expose sufficient provenance to identify the managed target and generation context without leaking sensitive configuration.

<a id="fr-docs-080"></a>

**FR-DOCS-080 — Repeatability**  
Repeated generation from materially equivalent project facts and effective configuration should produce semantically stable documentation outcomes, subject to explicitly non-deterministic optional capabilities such as AI assistance.

<a id="fr-docs-081"></a>

**FR-DOCS-081 — No false freshness**  
AppManager shall not represent stale or failed-to-refresh documentation as newly synchronized merely because an invocation completed other work successfully.

<a id="fr-docs-082"></a>

**FR-DOCS-082 — Partial write reporting**  
Multi-artefact write failures shall apply [FR-DOCS-PBC-019](docs-functional-specification-v01.md#fr-docs-pbc-019), [FR-INV-045](application-invocation-functional-specification-v01.md#fr-inv-045).

<a id="fr-docs-083"></a>

**FR-DOCS-083 — No universal rollback claim**  
Multi-artefact documentation rollback claims shall apply [FR-INV-046](application-invocation-functional-specification-v01.md#fr-inv-046).

---

### 10.1 Coordinated Artefact Production

A documentation request can cover several semantic targets and produce several artefacts. The plan connects each output to its source evidence and resolves its individual disposition before writes; the coordinated result retains those identities when effects diverge.

<a id="fr-docs-pbc-001"></a>

**FR-DOCS-PBC-001 — Coordinated semantic scope**

A Docs invocation may resolve one semantic target or a bounded semantic target set, including complete-application and all-managed-layer scopes, according to managed-project context and the selected documentation profile.

<a id="fr-docs-pbc-002"></a>

**FR-DOCS-PBC-002 — Cardinality is not command identity**

The number of resolved documentation targets or planned artefacts shall not create a separate bulk/all command identity.

<a id="fr-docs-pbc-003"></a>

**FR-DOCS-PBC-003 — No silent scope broadening**

Single-target documentation requests shall apply [FR-PROJ-042](managed-project-functional-specification-v01.md#fr-proj-042).

<a id="fr-docs-pbc-004"></a>

**FR-DOCS-PBC-004 — Duplicate normalization**

Overlapping coordinated documentation scopes shall apply [FR-DOCS-029](docs-functional-specification-v01.md#fr-docs-029).

<a id="fr-docs-pbc-005"></a>

**FR-DOCS-PBC-005 — Artefact plan before consequential effects**

Before coordinated documentation writes begin, AppManager shall derive a bounded artefact plan retaining each artefact's semantic source target, output identity, evidence/provenance, proposed content and intended mutation disposition.

<a id="fr-docs-pbc-006"></a>

**FR-DOCS-PBC-006 — Independent artefact disposition**

Each planned artefact shall independently resolve generation, explicitly permitted managed-document or managed-region update, already-satisfied no effect, skip, unsupported, collision refusal, blocked or indeterminate disposition. Concrete implementation vocabulary may differ but these observable distinctions shall remain.

<a id="fr-docs-pbc-007"></a>

**FR-DOCS-PBC-007 — Generation remains creation**

Generation in coordinated documentation shall apply [Design §6.8](../appmanager-design-specification-v01.md#_6-8-generation-and-templates).

<a id="fr-docs-pbc-008"></a>

**FR-DOCS-PBC-008 — Update remains explicit**

Each existing-resource artefact update shall apply [Design §6.8](../appmanager-design-specification-v01.md#_6-8-generation-and-templates), [FR-XFORM-033](source-transformation-functional-specification-v01.md#fr-xform-033), [FR-XFORM-020](source-transformation-functional-specification-v01.md#fr-xform-020), [FR-XFORM-068](source-transformation-functional-specification-v01.md#fr-xform-068). Explicit update intent and exact target/revision requirements remain applicable.

<a id="fr-docs-pbc-009"></a>

**FR-DOCS-PBC-009 — Mixed dispositions permitted**

One coordinated invocation may validly contain different per-artefact dispositions, including generation for one artefact, managed update for another and already-satisfied or refused status for another.

<a id="fr-docs-pbc-010"></a>

**FR-DOCS-PBC-010 — Deterministic non-AI path**

A coordinated Docs operation shall support deterministic documentation production without requiring AI where the selected documentation profile can be satisfied from accepted evidence, approved declarative resources/templates and deterministic Documentation Capability behaviour.

<a id="fr-docs-pbc-011"></a>

**FR-DOCS-PBC-011 — AI absence does not redefine scope**

Absence or unavailability of optional AI assistance shall not alter the resolved managed documentation scope or silently select different documentation targets.

<a id="fr-docs-pbc-012"></a>

**FR-DOCS-PBC-012 — Bounded AI proposals**

Bounded AI proposals for planned artefacts shall apply [FR-DOCS-084](docs-functional-specification-v01.md#fr-docs-084), [FR-AI-088](ai-functional-specification-v01.md#fr-ai-088), [FR-AI-089](ai-functional-specification-v01.md#fr-ai-089), [FR-AI-096](ai-functional-specification-v01.md#fr-ai-096).

<a id="fr-docs-pbc-013"></a>

**FR-DOCS-PBC-013 — Automatic acceptance under prior policy**

Automatic Docs proposal acceptance shall apply [Design §11.10](../appmanager-design-specification-v01.md#_11-10-ai-assisted-workflow). Docs shall resolve deterministic target/profile validation and acceptance criteria before generation.

<a id="fr-docs-pbc-014"></a>

**FR-DOCS-PBC-014 — Interactive review remains supported**

Docs policy requiring review, revision or explicit human acceptance shall apply [Design §11.10](../appmanager-design-specification-v01.md#_11-10-ai-assisted-workflow).

<a id="fr-docs-pbc-015"></a>

**FR-DOCS-PBC-015 — AI cannot authorise effects**

AI contributions to documentation planning and persistence shall apply [Design §11.10](../appmanager-design-specification-v01.md#_11-10-ai-assisted-workflow). Output destination selection, update authorisation, preservation and disclosure policy remain Docs-owned.

<a id="fr-docs-pbc-016"></a>

**FR-DOCS-PBC-016 — Equivalent postconditions**

AI-assisted and deterministic artefacts under the same target/profile postconditions shall apply [FR-DOCS-PBC-017](docs-functional-specification-v01.md#fr-docs-pbc-017).

<a id="fr-docs-pbc-017"></a>

**FR-DOCS-PBC-017 — Per-artefact validation**

Each consequential artefact shall be evaluated against its resolved target/profile, accepted facts, output policy, preservation requirements and relevant documentation validation before Docs acceptance.

<a id="fr-docs-pbc-018"></a>

**FR-DOCS-PBC-018 — Provider success is insufficient**

Rendering, AI, process and persistence completion shall apply [FR-INV-034](application-invocation-functional-specification-v01.md#fr-inv-034).

<a id="fr-docs-pbc-019"></a>

**FR-DOCS-PBC-019 — Per-target and per-artefact reporting**

The structured result of a coordinated operation shall preserve sufficient target and artefact identity to report generated, updated, already-satisfied, skipped, unsupported, refused, failed, cancelled and indeterminate states without collapsing them into a false uniform result.

<a id="fr-docs-pbc-020"></a>

**FR-DOCS-PBC-020 — Coordinated mutation is non-transactional by default**

Coordinated Docs cross-resource atomicity/rollback shall apply [FR-INV-046](application-invocation-functional-specification-v01.md#fr-inv-046).

<a id="fr-docs-pbc-021"></a>

**FR-DOCS-PBC-021 — Completed effects remain truthful**

Earlier completed artefacts after later failure shall apply [FR-INV-045](application-invocation-functional-specification-v01.md#fr-inv-045).

<a id="fr-docs-pbc-022"></a>

**FR-DOCS-PBC-022 — Explicit continuation policy**

Continuation after an individual target or artefact failure shall follow explicit Docs-domain policy and shall preserve attributable outcomes for work already attempted.

<a id="fr-docs-pbc-023"></a>

**FR-DOCS-PBC-023 — Cancellation**

Coordinated documentation cancellation shall apply [FR-DOCS-016](docs-functional-specification-v01.md#fr-docs-016), [FR-INV-032](application-invocation-functional-specification-v01.md#fr-inv-032). Completed proposals, AI usage and other completed work shall remain attributable alongside writes.

<a id="fr-docs-pbc-024"></a>

**FR-DOCS-PBC-024 — Canonical partial completion**

Per-target and per-artefact evidence aggregation shall apply [FR-INV-033](application-invocation-functional-specification-v01.md#fr-inv-033), [FR-INV-036](application-invocation-functional-specification-v01.md#fr-inv-036).

<a id="fr-docs-pbc-025"></a>

**FR-DOCS-PBC-025 — Deterministic Headless bulk operation**

Headless target/profile, output and AI acceptance/review policy shall apply [FR-INV-020](application-invocation-functional-specification-v01.md#fr-inv-020).

<a id="fr-docs-pbc-026"></a>

**FR-DOCS-PBC-026 — Interaction equivalence**
Coordinated documentation across TUI, GUI and Headless shall apply [Design §4.6](../appmanager-design-specification-v01.md#_4-6-presentation-independence).

---

## 11. AI-Assisted Documentation

<a id="fr-docs-084"></a>

**FR-DOCS-084 — Optional AI assistance**  
Docs use cases may employ AI assistance for summarization, drafting or enrichment where policy permits, but AI availability shall not automatically be a prerequisite for documentation that can be produced deterministically without it.

<a id="fr-docs-085"></a>

**FR-DOCS-085 — Domain ownership**  
AI assistance in Docs workflows shall apply [Design §10.6](../appmanager-design-specification-v01.md#_10-6-ai-domain).

<a id="fr-docs-086"></a>

**FR-DOCS-086 — Non-authoritative AI output**  
Generated documentation proposals shall apply [Design §11.10](../appmanager-design-specification-v01.md#_11-10-ai-assisted-workflow).

<a id="fr-docs-087"></a>

**FR-DOCS-087 — Fact preservation**  
AI enrichment shall not replace reliably inspected structural facts with contradictory generated claims.

<a id="fr-docs-088"></a>

**FR-DOCS-088 — AI failure fallback**  
Where a deterministic non-AI documentation path exists, failure or unavailability of AI assistance may fall back to that path and shall report the omitted enrichment where functionally significant.

<a id="fr-docs-089"></a>

**FR-DOCS-089 — No fabricated completion**  
If required documentation meaning cannot be established without an unavailable capability, AppManager shall report the limitation rather than fabricate content to satisfy apparent completeness.

<a id="fr-docs-090"></a>

**FR-DOCS-090 — Sensitive context**  
Documentation context disclosed for AI assistance shall apply [FR-AI-088](ai-functional-specification-v01.md#fr-ai-088), [FR-AI-089](ai-functional-specification-v01.md#fr-ai-089), [FR-AI-096](ai-functional-specification-v01.md#fr-ai-096).

---

## 12. Documentation Tooling Workflows

Version 1 supports operating configured documentation tooling for development, build and preview workflows without making VitePress, package-manager commands or process-spawn mechanics part of the Functional contract.

<a id="fr-docs-091"></a>

**FR-DOCS-091 — Documentation-tool operation**  
Where documentation tooling is configured and supported for a managed documentation target, AppManager may expose documentation development, build and preview operations as Docs use cases.

<a id="fr-docs-092"></a>

**FR-DOCS-092 — Explicit tooling target**  
A tooling invocation shall distinguish which documentation project or documentation scope it operates against and shall not silently choose between AppManager's own documentation and a managed target project's documentation.

<a id="fr-docs-093"></a>

**FR-DOCS-093 — Managed-project documentation tooling**  
Managed-project documentation tooling shall be available only where the required documentation project/tooling capability can be recognized or configured sufficiently to execute the requested operation.

<a id="fr-docs-094"></a>

**FR-DOCS-094 — Tool implementation independence**  
The Functional Specification shall not require VitePress specifically; a later Detailed Design or effective project configuration may select VitePress or another supported provider.

<a id="fr-docs-095"></a>

**FR-DOCS-095 — Development operation**  
A supported documentation development operation may be long-running and shall expose execution state and cancellation semantics through the common invocation model where supported.

<a id="fr-docs-096"></a>

**FR-DOCS-096 — Build operation**  
Documentation build completion shall apply [FR-INV-034](application-invocation-functional-specification-v01.md#fr-inv-034).

<a id="fr-docs-097"></a>

**FR-DOCS-097 — Preview operation**  
A supported documentation preview operation shall report whether the preview capability started successfully and shall not be represented as documentation-generation success merely because a server process launched.

<a id="fr-docs-098"></a>

**FR-DOCS-098 — Delegated tooling failure**  
A documentation-tool provider failure shall be interpreted and returned as a Docs application outcome rather than exposed only as an unstructured provider error.

<a id="fr-docs-099"></a>

**FR-DOCS-099 — Generated tooling artefacts**  
Build artefacts produced by delegated documentation tooling shall be reported as delegated effects where functionally relevant but shall not expand Docs mutation authority over unrelated project resources.

---

## 13. Documentation Extraction and Aggregation

The requirements below bind this concern to its shared and domain-specific owners.

<a id="fr-docs-100"></a>

**FR-DOCS-100 — Documentation extraction ownership**  
Extraction, aggregation or generation of documentation from managed source is a Docs-domain responsibility when documentation is the primary intent, even where the inspected resources are Nuxt layers.

<a id="fr-docs-101"></a>

**FR-DOCS-101 — Nuxt fact delegation**  
Docs may consume Nuxt-specific facts from the `nuxt` domain or an approved Nuxt capability without independently redefining Nuxt recognition or configuration semantics.

<a id="fr-docs-102"></a>

**FR-DOCS-102 — Multi-file aggregation**  
A documentation use case may aggregate information from multiple eligible files into one or more documentation artefacts while preserving target provenance and reporting unsupported or failed inputs.

<a id="fr-docs-103"></a>

**FR-DOCS-103 — No raw-dump requirement**  
Aggregation shall not require verbatim concatenation of source files; the observable requirement is useful documentation derived from approved facts and content within copyright, security and project policy constraints.

<a id="fr-docs-104"></a>

**FR-DOCS-104 — Selection policy**  
The file types and resources included in an aggregation shall be determined by the documentation use case, managed scope and effective configuration rather than by an unbounded recursive scan.

<a id="fr-docs-105"></a>

**FR-DOCS-105 — Exclusions**  
Generated output, dependency trees, caches, protected data and other resources excluded by project or documentation policy shall not be included merely because they are reachable beneath a target directory.

---

## 14. Results, Diagnostics and Failure Semantics

<a id="fr-docs-106"></a>

**FR-DOCS-106 — Structured success**  
A successful documentation result shall identify the requested use case, resolved target scope and resulting artefacts or read-only documentation output as applicable.

<a id="fr-docs-107"></a>

**FR-DOCS-107 — Structured failure**  
A failed result shall identify the stage and target responsible sufficiently for automation or a user to distinguish target-resolution, inspection, generation, transformation, delegated-tool and acceptance failures.

<a id="fr-docs-108"></a>

**FR-DOCS-108 — Partial success**  
Multi-target and multi-artefact documentation shall apply [FR-INV-036](application-invocation-functional-specification-v01.md#fr-inv-036).

<a id="fr-docs-109"></a>

**FR-DOCS-109 — Warnings**  
Non-fatal omissions, unsupported source types, stale inputs, unavailable optional enrichment and similar conditions shall be exposed as warnings where they materially affect interpretation of the documentation outcome.

<a id="fr-docs-110"></a>

**FR-DOCS-110 — Diagnostic sensitivity**  
Docs diagnostics shall apply [FR-INV-040](application-invocation-functional-specification-v01.md#fr-inv-040).

<a id="fr-docs-111"></a>

**FR-DOCS-111 — Provider abstraction**  
Docs results independent of provider output shall apply [FR-INV-021](application-invocation-functional-specification-v01.md#fr-inv-021).

<a id="fr-docs-112"></a>

**FR-DOCS-112 — Consequential effect reporting**  
When documentation writes or delegated tooling produce consequential effects, the result shall identify those effects sufficiently for callers to understand what changed or was produced.

<a id="fr-docs-113"></a>

**FR-DOCS-113 — Acceptance failure**  
If generated or transformed documentation is syntactically valid but fails AppManager's intent, scope, safety or acceptance policy, the operation shall not report complete success.

---

## 15. Safety and Non-Destructive Behaviour

<a id="fr-docs-114"></a>

**FR-DOCS-114 — Source preservation**  
Source/configuration preservation during documentation production shall apply [FR-DOCS-046](docs-functional-specification-v01.md#fr-docs-046).

<a id="fr-docs-115"></a>

**FR-DOCS-115 — No implicit deletion**  
A documentation generation or update operation shall not delete unrelated documentation artefacts merely because they are absent from the newly generated set.

<a id="fr-docs-116"></a>

**FR-DOCS-116 — Explicit replacement policy**  
Replacement of substantial existing authored documentation shall require an explicit applicable policy and, where required by invocation or transformation semantics, confirmation or non-interactive authorization.

<a id="fr-docs-117"></a>

**FR-DOCS-117 — Stale-source protection**  
Previously inspected documentation update targets shall apply [FR-XFORM-020](source-transformation-functional-specification-v01.md#fr-xform-020), [FR-XFORM-068](source-transformation-functional-specification-v01.md#fr-xform-068).

<a id="fr-docs-118"></a>

**FR-DOCS-118 — External effects**  
Starting a documentation server or invoking external documentation tooling shall be treated as an observable delegated effect and shall not occur as a hidden side effect of a read-only documentation-inspection request.

<a id="fr-docs-119"></a>

**FR-DOCS-119 — Fail-safe ambiguity**  
Where target, output destination, overwrite intent or consequential scope is ambiguous, AppManager shall fail safely rather than infer the most destructive interpretation.

---

## 16. Traceability Summary

| Functional area | Requirements | Upstream / same-level authority | Downstream refinement destination |
|---|---|---|---|
| Domain boundary and authority | FR-DOCS-001–005 | This specification; Root Design §§1, 3, 6, 10 | Owning domain/shared-contract Detailed Design |
| Invocation and project context | FR-DOCS-006–018 | This specification; Root Design §§4–7; FR-INV, FR-PROJ, FR-CONFIG | Owning domain/shared-contract Detailed Design |
| Documentation target model | FR-DOCS-019–030 | This specification §4; FR-PROJ | Owning domain/shared-contract Detailed Design |
| Complete application | FR-DOCS-031–040 | This specification §5; FR-PROJ | Owning domain/shared-contract Detailed Design |
| Application source | FR-DOCS-041–050 | This specification §6; FR-XFORM | Owning domain/shared-contract Detailed Design |
| Layers | FR-DOCS-051–060 | This specification §7; FR-PROJ; FR-NUXT | Owning domain/shared-contract Detailed Design |
| Tests | FR-DOCS-061–066 | This specification §8; Quality Functional Specification | Owning domain/shared-contract Detailed Design |
| Selected file | FR-DOCS-067–072 | This specification §9; FR-PROJ | Owning domain/shared-contract Detailed Design |
| Generation and update | FR-DOCS-073–083 | This specification §10; Root Design generation boundaries; FR-XFORM | Owning domain/shared-contract Detailed Design |
| AI assistance | FR-DOCS-084–090 | This specification §11; Root Design capability boundaries; FR-AI | Owning domain/shared-contract Detailed Design |
| Documentation tooling | FR-DOCS-091–099 | This specification §12 | Process Execution boundary |
| Extraction/aggregation | FR-DOCS-100–105 | This specification §13; FR-NUXT | Owning domain/shared-contract Detailed Design |
| Results and diagnostics | FR-DOCS-106–113 | This specification §14; FR-INV; Application Engine authority | Owning domain/shared-contract Detailed Design |
| Safety | FR-DOCS-114–119 | This specification §15; Root Design safety principles; FR-XFORM; FR-PROJ | Owning domain/shared-contract Detailed Design |
| Coordinated artefact production | FR-DOCS-PBC-001–026 | This specification §10.1; Managed Project; Source Transformation; AI | Docs domain and Documentation/AI capabilities |

---

## 17. Downstream Specification Boundary

Detailed Design may define permanent internal contracts for documentation inspection, documentation models, generators, renderers, templates, documentation-tool providers, AI-assisted enrichment, aggregation, source-aware documentation transformation and output planning.

Implementation Specifications may define concrete TypeScript modules, VitePress integration, package-manager commands, source paths, parsers, file extensions, templates, process APIs and output directories.

Neither level may redefine the functional ownership established here without an approved change to the governing specification hierarchy.

---

## 18. Version 1 Functional Baseline

This document is the Version 1 Functional owner for its stated concern. Its requirement identities remain stable under the [Project Documentation Guide](../project-documentation-guide-v01.md#_9-traceability).
