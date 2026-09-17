# AppManager Maintenance Functional Specification

> **Status:** Version 1 Functional Specification
>
> **Functional domain:** `maintenance`
>
> **Requirement prefix:** `FR-UTIL` (stable historical requirement identities; canonical domain `maintenance`)
>
> **Filename compatibility:** The existing filename is retained for links; it does not establish a `utils` product domain.
>
> **Governing sources:** [Project Documentation Guide](../project-documentation-guide-v01.md), [AppManager Design Specification](../appmanager-design-specification-v01.md)
>
> **Related Functional Specifications:** [application-invocation-functional-specification-v01.md](application-invocation-functional-specification-v01.md), [managed-project-functional-specification-v01.md](managed-project-functional-specification-v01.md), [configuration-functional-specification-v01.md](configuration-functional-specification-v01.md), [source-transformation-functional-specification-v01.md](source-transformation-functional-specification-v01.md), [docs-functional-specification-v01.md](docs-functional-specification-v01.md), [settings-functional-specification-v01.md](settings-functional-specification-v01.md), [git-functional-specification-v01.md](git-functional-specification-v01.md), [ai-functional-specification-v01.md](ai-functional-specification-v01.md)
>
> **Historical planning provenance (non-normative):** [docs/project_management/functional-specification-decomposition-plan-v01.md](../project_management/functional-specification-decomposition-plan-v01.md)

## 1. Purpose

This specification defines the observable Version 1 behaviour of the AppManager `maintenance` domain.

Maintenance uses the [Design §10.9 stronger-owner rule](../appmanager-design-specification-v01.md#_10-9-maintenance-domain) to determine which project-maintenance concerns belong here.

Version 1 Maintenance owns three principal behavioural families:

- project source-header inspection, validation and bounded repair;
- automatic source-file version maintenance where version metadata is governed by the AppManager source-header convention;
- cleanup of recognized temporary/test/log artefacts that do not belong to the broader application clean/reset lifecycle.

Adjacent documentation and contributor requests are covered by FR-UTIL-003–005.

---

## 2. Functional Boundary

<a id="fr-util-001"></a>

**FR-UTIL-001 — Bounded utility ownership**  
Maintenance use-case placement shall conform to [Design §10.9](../appmanager-design-specification-v01.md#_10-9-maintenance-domain).

<a id="fr-util-002"></a>

**FR-UTIL-002 — No catch-all authority**  
Maintenance use-case names shall apply the stronger-owner test in [Design §10.9](../appmanager-design-specification-v01.md#_10-9-maintenance-domain).

<a id="fr-util-003"></a>

**FR-UTIL-003 — Documentation ownership**  
Maintenance-facing documentation requests shall apply [FR-DOCS-100](docs-functional-specification-v01.md#fr-docs-100).

<a id="fr-util-004"></a>

**FR-UTIL-004 — Contributor ownership**  
Maintenance-facing contributor requests shall apply [FR-SET-072](settings-functional-specification-v01.md#fr-set-072).

<a id="fr-util-005"></a>

**FR-UTIL-005 — Domain delegation**  
A compatibility or convenience Maintenance surface may delegate to another domain-owned use case only if the owning domain's semantics remain authoritative and the delegation is not presented as a separate behaviour.

<a id="fr-util-006"></a>

**FR-UTIL-006 — Source transformation authority**  
Maintenance changes to existing source shall apply [FR-XFORM-033](source-transformation-functional-specification-v01.md#fr-xform-033).

<a id="fr-util-007"></a>

**FR-UTIL-007 — Managed-project authority**  
Maintenance context and targets shall apply [Design §9.2](../appmanager-design-specification-v01.md#_9-2-managed-project-context), [FR-PROJ-044](managed-project-functional-specification-v01.md#fr-proj-044).

<a id="fr-util-008"></a>

**FR-UTIL-008 — Delegated execution**  
Maintenance inspection, transformation, Git, AI and persistence delegation shall conform to [Design §6.2](../appmanager-design-specification-v01.md#_6-2-application-engine-authority), [Design §11.11](../appmanager-design-specification-v01.md#_11-11-workflow-results-failure-and-acceptance).

<a id="fr-util-009"></a>

**FR-UTIL-009 — Implementation independence**  
Functional requirements shall not mandate `codeService`, a particular Strategy class, regular-expression implementation, filesystem API or TypeScript service layout.

---

### 2.1 Canonical Version 1 Command Surface

| Canonical identity | Behavioural owner |
|---|---|
| `maintenance.headers.validate` | §§4–5 |
| `maintenance.headers.repair` | §§6–7 |
| `maintenance.source-version.maintain` | §8 |
| `maintenance.cleanup` | §9 |

These replace the corresponding historical `utils.*` identities. Historical spellings may be transitional interaction aliases only; they create no competing semantics. No generic `maintenance.inspect`, `maintenance.check`, `maintenance.repair`, `*-all` or `bulk-*` identity is established.

<a id="pbc-fr-maint-001"></a>

### PBC-FR-MAINT-001 — Primary maintenance intent
Canonical Maintenance commands shall apply [Design §10.9](../appmanager-design-specification-v01.md#_10-9-maintenance-domain).

<a id="pbc-fr-maint-002"></a>

### PBC-FR-MAINT-002 — Stronger-owner exclusion
Operations over stronger-owned semantic objects shall conform to [Design §10.9](../appmanager-design-specification-v01.md#_10-9-maintenance-domain).

<a id="pbc-fr-maint-003"></a>

### PBC-FR-MAINT-003 — No generic utility authority
Maintenance shall not accept arbitrary paths, shell commands, transformations or unspecified "fix" requests as a generic utility/repair surface.

<a id="pbc-fr-maint-004"></a>

### PBC-FR-MAINT-004 — Managed scope
Maintenance target eligibility shall apply [FR-PROJ-044](managed-project-functional-specification-v01.md#fr-proj-044), [Design §9.9](../appmanager-design-specification-v01.md#_9-9-non-destructive-ownership-and-unmanaged-content). The operation-specific resource classes further constrain managed scope.

---

## 3. Common Maintenance Behaviour

<a id="fr-util-010"></a>

**FR-UTIL-010 — Structured invocation**  
Maintenance invocations shall apply [FR-INV-007](application-invocation-functional-specification-v01.md#fr-inv-007).

<a id="fr-util-011"></a>

**FR-UTIL-011 — Structured outcome**  
Every Maintenance operation shall apply [FR-INV-033](application-invocation-functional-specification-v01.md#fr-inv-033) and identify the requested operation and managed target/scope. The result shall distinguish no-op where applicable; cancellation, success, failure and partial completion use FR-INV-031 and FR-INV-034–036.

<a id="fr-util-012"></a>

**FR-UTIL-012 — Interaction-mode equivalence**  
Maintenance across TUI, GUI, Headless and future adapters shall apply [Design §4.6](../appmanager-design-specification-v01.md#_4-6-presentation-independence).

<a id="fr-util-013"></a>

**FR-UTIL-013 — Deterministic Headless behaviour**  
Headless Maintenance repair policy, scope and authorisation shall apply [FR-INV-020](application-invocation-functional-specification-v01.md#fr-inv-020), [FR-INV-022](application-invocation-functional-specification-v01.md#fr-inv-022).

<a id="fr-util-014"></a>

**FR-UTIL-014 — Read-only inspection**  
A check, inspect or validate-only invocation shall not modify project content.

<a id="fr-util-015"></a>

**FR-UTIL-015 — Explicit repair intent**  
A repair or update operation shall be explicitly requested or explicitly authorized by the invoking workflow.

<a id="fr-util-016"></a>

**FR-UTIL-016 — Preview where consequential**  
Multiple or consequential Maintenance source changes where preview is required shall apply [FR-INV-025](application-invocation-functional-specification-v01.md#fr-inv-025).

<a id="fr-util-017"></a>

**FR-UTIL-017 — Bounded mutation**  
Maintenance mutation effect bounds shall apply [FR-XFORM-014](source-transformation-functional-specification-v01.md#fr-xform-014).

<a id="fr-util-018"></a>

**FR-UTIL-018 — Preserve unrelated content**  
Maintenance source preservation shall apply [Design §9.9](../appmanager-design-specification-v01.md#_9-9-non-destructive-ownership-and-unmanaged-content), [FR-XFORM-040](source-transformation-functional-specification-v01.md#fr-xform-040).

<a id="fr-util-019"></a>

**FR-UTIL-019 — Unsupported content**  
Unsupported or ambiguous Maintenance source shall apply [FR-XFORM-008](source-transformation-functional-specification-v01.md#fr-xform-008), [FR-XFORM-009](source-transformation-functional-specification-v01.md#fr-xform-009).

<a id="fr-util-020"></a>

**FR-UTIL-020 — Partial success**  
Multi-file Maintenance shall apply [FR-INV-036](application-invocation-functional-specification-v01.md#fr-inv-036). Results shall identify each target disposition.

<a id="fr-util-021"></a>

**FR-UTIL-021 — Cancellation**  
Maintenance cancellation shall stop initiation of further work as soon as safely practical. Completed per-resource effects shall be reported under [FR-INV-031](application-invocation-functional-specification-v01.md#fr-inv-031).

<a id="fr-util-022"></a>

**FR-UTIL-022 — No false rollback**  
Maintenance rollback claims shall apply [FR-INV-046](application-invocation-functional-specification-v01.md#fr-inv-046).

<a id="fr-util-023"></a>

**FR-UTIL-023 — Sensitive diagnostics**  
Maintenance diagnostics and optional AI context shall apply [FR-INV-040](application-invocation-functional-specification-v01.md#fr-inv-040), [FR-AI-088](ai-functional-specification-v01.md#fr-ai-088).

---

## 4. Source-Header Convention

Version 1 supports the AppManager project source-header convention as a maintenance concern. The convention may include semantic fields such as project identity, file identity, author attribution, version metadata and revision-history information. Exact comment syntax and parser mechanics belong below the Functional level unless intentionally exposed as a stable contract.

<a id="fr-util-024"></a>

**FR-UTIL-024 — Header recognition**  
Maintenance shall be able to determine whether a supported source file contains a recognized AppManager source-header representation.

<a id="fr-util-025"></a>

**FR-UTIL-025 — Header scope**  
Header operations shall apply only to supported managed source files selected by the requested scope and effective policy.

<a id="fr-util-026"></a>

**FR-UTIL-026 — Exclusion policy**  
Excluded generated output, dependencies, caches and repository internals shall apply [FR-PROJ-047](managed-project-functional-specification-v01.md#fr-proj-047).

<a id="fr-util-027"></a>

**FR-UTIL-027 — Header facts**  
Inspection may expose recognized header facts including presence, project identity, file identity, author metadata, declared version and revision-history consistency where supported.

<a id="fr-util-028"></a>

**FR-UTIL-028 — Missing header distinction**  
A missing header, malformed header and valid-but-inconsistent header shall be distinguishable outcomes.

<a id="fr-util-029"></a>

**FR-UTIL-029 — Recognition is not authority**  
Recognised headers and defects shall apply [Design §9.9](../appmanager-design-specification-v01.md#_9-9-non-destructive-ownership-and-unmanaged-content).

<a id="fr-util-030"></a>

**FR-UTIL-030 — Creation metadata preservation**  
Header validation or repair shall preserve original creation-date/time metadata unless the requested use case explicitly concerns establishing missing creation metadata under an approved policy.

<a id="fr-util-031"></a>

**FR-UTIL-031 — Revision-history preservation**  
Repair shall preserve valid existing revision-history information except for the bounded changes required by the selected maintenance intent.

---

## 5. Check and Validate Headers

Header checking and validation form a coherent read-only validation capability with selectable depth rather than separate authorities derived from command naming.

<a id="fr-util-032"></a>

**FR-UTIL-032 — Header check use case**  
Maintenance shall provide a non-mutating use case that checks supported managed source files for recognized header presence and validity.

<a id="fr-util-033"></a>

**FR-UTIL-033 — Validation use case**  
Maintenance shall provide validation capable of evaluating supported semantic consistency rules for recognized headers.

<a id="fr-util-034"></a>

**FR-UTIL-034 — Scope selection**  
Header checking/validation shall operate on an explicit supported scope such as a selected file, selected managed component/layer, or eligible managed-project source set where such scopes are exposed.

<a id="fr-util-035"></a>

**FR-UTIL-035 — Per-file result**  
Validation shall identify each inspected file's status sufficiently to distinguish valid, missing, malformed, inconsistent, unsupported and failed inspection outcomes as applicable.

<a id="fr-util-036"></a>

**FR-UTIL-036 — Aggregate result**  
An aggregate validation outcome shall not report success when required files contain unresolved validation failures.

<a id="fr-util-037"></a>

**FR-UTIL-037 — No-files result**  
A valid scope containing no eligible source files shall be reported distinctly from a successful validation of one or more files.

<a id="fr-util-038"></a>

**FR-UTIL-038 — Project identity consistency**  
Where the source-header convention contains project identity and a reliable expected project identity is available, validation may compare them.

<a id="fr-util-039"></a>

**FR-UTIL-039 — File identity consistency**  
Where the header contains file/path identity, validation shall be able to compare it with the file's managed-project-relative identity according to the supported convention.

<a id="fr-util-040"></a>

**FR-UTIL-040 — Author consistency**  
Where author consistency is part of the configured convention, validation may compare recognized author metadata with the applicable resolved identity without silently rewriting the header.

<a id="fr-util-041"></a>

**FR-UTIL-041 — Version consistency**  
Where revision history is authoritative for the source-file version convention, validation shall identify disagreement between declared top-level version and the applicable revision-history version.

<a id="fr-util-042"></a>

**FR-UTIL-042 — Package metadata validation boundary**  
Package-name checks may be included only where they are part of the project-maintenance validation use case; they shall not give Maintenance general ownership over application metadata, package management or Nuxt semantics.

<a id="fr-util-043"></a>

**FR-UTIL-043 — Package-name diagnostic**  
Where a supported package metadata naming convention can be deterministically derived from managed project facts, Maintenance may report a mismatch as a validation finding.

<a id="fr-util-044"></a>

**FR-UTIL-044 — Ambiguous expected name**  
If an expected package name cannot be determined unambiguously, Maintenance shall report that limitation rather than invent a replacement.

---

## 6. Repair Headers

<a id="fr-util-045"></a>

**FR-UTIL-045 — Header repair use case**  
Maintenance shall provide bounded repair of supported source-header defects where a deterministic repair can be established and the operation is authorized.

<a id="fr-util-046"></a>

**FR-UTIL-046 — Check before repair**  
Repair shall be based on current inspection/validation facts rather than unconditional header replacement.

<a id="fr-util-047"></a>

**FR-UTIL-047 — Field-level intent**  
Where only individual header fields are inconsistent, repair shall target those fields rather than replace valid unrelated header content.

<a id="fr-util-048"></a>

**FR-UTIL-048 — Project field repair**  
Where a recognized project-identity field exists and its correct value is determinable, repair may synchronize that field to the managed-project identity.

<a id="fr-util-049"></a>

**FR-UTIL-049 — Missing project field**  
Version 1 does not require header repair to synthesize a missing project-identity field merely because validation can detect its absence; adding previously absent fields shall be governed by explicit repair policy.

<a id="fr-util-050"></a>

**FR-UTIL-050 — File field repair**  
Where the header contains a recognized file-identity field, repair may synchronize it with the correct managed-project-relative file identity.

<a id="fr-util-051"></a>

**FR-UTIL-051 — Author addition**  
Where author maintenance is enabled and a required author entry is absent, repair may add the resolved applicable author without deleting existing valid author history.

<a id="fr-util-052"></a>

**FR-UTIL-052 — Missing author identity**  
If required author identity cannot be resolved, Maintenance shall not fabricate an author value.

<a id="fr-util-053"></a>

**FR-UTIL-053 — Version field repair**  
Where the source convention defines revision history as authoritative, repair may synchronize the declared header version to the highest applicable recognized revision-history version.

<a id="fr-util-054"></a>

**FR-UTIL-054 — No history invention**  
Header repair shall not invent revision-history events merely to make a version field appear valid.

<a id="fr-util-055"></a>

**FR-UTIL-055 — Only write changed files**  
A repair operation shall not rewrite a file when no material repair is required.

<a id="fr-util-056"></a>

**FR-UTIL-056 — Source-level validation**  
Header-repair source validation shall apply [FR-XFORM-048](source-transformation-functional-specification-v01.md#fr-xform-048).

<a id="fr-util-057"></a>

**FR-UTIL-057 — Application acceptance**  
A syntactically successful write shall not alone establish successful repair; the resulting file shall satisfy the intended header-maintenance policy.

<a id="fr-util-058"></a>

**FR-UTIL-058 — Stale-source protection**  
Header-repair source assumptions shall apply [FR-XFORM-068](source-transformation-functional-specification-v01.md#fr-xform-068), [FR-XFORM-069](source-transformation-functional-specification-v01.md#fr-xform-069).

---

## 7. Package Metadata Repair within Header Validation

Header validation may include package-name repair narrowly, without converting Maintenance into the owner of project metadata generally.

<a id="fr-util-059"></a>

**FR-UTIL-059 — Explicit package repair**  
Package-name mismatch findings shall apply [FR-UTIL-014](utils-functional-specification-v01.md#fr-util-014), [FR-UTIL-015](utils-functional-specification-v01.md#fr-util-015).

<a id="fr-util-060"></a>

**FR-UTIL-060 — Deterministic repair path**  
Where the expected package name is unambiguous, Maintenance may offer or apply the deterministic expected value according to invocation policy.

<a id="fr-util-061"></a>

**FR-UTIL-061 — Manual repair path**  
Interactive operation may permit the caller to supply a replacement value, subject to validation.

<a id="fr-util-062"></a>

**FR-UTIL-062 — Optional AI suggestion**  
Where AI-assisted package metadata repair is retained, AI may suggest a name or description but shall not be authoritative.

<a id="fr-util-063"></a>

**FR-UTIL-063 — AI unavailable**  
AI unavailability shall not prevent deterministic/manual repair where those paths are otherwise valid.

<a id="fr-util-064"></a>

**FR-UTIL-064 — Headless AI safety**  
Headless operation shall not rely on AI to resolve ambiguous package identity unless explicit policy permits the proposed value to be validated and accepted deterministically.

<a id="fr-util-065"></a>

**FR-UTIL-065 — Settings boundary**  
General package/application metadata CRUD remains Settings-owned; this narrow repair path exists only as part of the validation/maintenance use case.

---

## 8. Automatic Source-File Version Maintenance

This use case concerns source-file header versions, not the managed application's declared package/release version.

<a id="fr-util-066"></a>

**FR-UTIL-066 — Source-file auto-version use case**  
Maintenance shall support automatic maintenance of recognized source-file version metadata for eligible changed files.

<a id="fr-util-067"></a>

**FR-UTIL-067 — Application-version distinction**  
Source-file version maintenance shall remain distinct from package/application versioning, repository tagging, documentation versioning and Nuxt upgrade intent. Settings-owned manual application-version metadata remains governed by [FR-SET-045–049](settings-functional-specification-v01.md#fr-set-045).

<a id="fr-util-068"></a>

**FR-UTIL-068 — Changed-file basis**  
Auto-versioning shall operate on an explicitly established set of changed eligible managed source files rather than indiscriminately versioning every discovered source file.

<a id="fr-util-069"></a>

**FR-UTIL-069 — Git facts without Git ownership transfer**  
Maintenance may consume Git-provided change/diff/identity facts to establish source-file changes. Repository semantics remain Git-owned.

<a id="fr-util-070"></a>

**FR-UTIL-070 — Eligible header requirement**  
A file without the recognized version metadata required by the source-file version convention shall not be silently converted into a versioned file by auto-versioning.

<a id="fr-util-071"></a>

**FR-UTIL-071 — Diff-informed increment**  
Where available, AppManager may use bounded change information to determine an appropriate semantic increment for an eligible source file.

<a id="fr-util-072"></a>

**FR-UTIL-072 — Supported increments**  
Where semantic version increments are used, the functional increment classes shall be Major, Minor and Patch or their semantically equivalent configured representation.

<a id="fr-util-073"></a>

**FR-UTIL-073 — Optional AI classification**  
AI may assist in classifying a source-file change as Major, Minor or Patch and may suggest a revision note.

<a id="fr-util-074"></a>

**FR-UTIL-074 — AI non-authority**  
Optional AI source-version recommendations shall apply [Design §11.10](../appmanager-design-specification-v01.md#_11-10-ai-assisted-workflow).

<a id="fr-util-075"></a>

**FR-UTIL-075 — AI fallback**  
Where Version 1 auto-versioning is invoked without usable AI classification, the operation may use the safe Patch fallback if effective policy does not require a different explicit decision.

<a id="fr-util-076"></a>

**FR-UTIL-076 — Invalid current version**  
Malformed or unsupported current version metadata shall be reported and the affected file shall not be blindly incremented.

<a id="fr-util-077"></a>

**FR-UTIL-077 — Version update coherence**  
An accepted auto-version change shall update the source-file version metadata and corresponding revision-history information coherently where the convention requires both.

<a id="fr-util-078"></a>

**FR-UTIL-078 — Revision note**  
Where a revision note is part of the convention, the operation shall produce or obtain a bounded note associated with the actual source-file change rather than unrelated project activity.

<a id="fr-util-079"></a>

**FR-UTIL-079 — Per-file isolation**  
Failure to classify or update one file shall not require abandoning unrelated eligible files unless fail-fast policy explicitly requires it.

<a id="fr-util-080"></a>

**FR-UTIL-080 — Write validation**  
Modified source-version metadata shall apply [FR-XFORM-048](source-transformation-functional-specification-v01.md#fr-xform-048), [FR-XFORM-055](source-transformation-functional-specification-v01.md#fr-xform-055).

<a id="fr-util-081"></a>

**FR-UTIL-081 — Summary outcome**  
The operation shall report counts or structured per-file outcomes sufficient to distinguish updated, skipped, failed and unchanged files.

---

## 9. Temporary/Test/Log Artefact Cleanup

This use case is intentionally narrower than App-domain clean/reset.

<a id="fr-util-082"></a>

**FR-UTIL-082 — Utility cleanup use case**  
Maintenance shall support cleanup of recognized temporary test/log artefacts produced within AppManager-managed maintenance/testing workflows where those artefacts are not part of the broader App lifecycle clean/reset semantics.

<a id="fr-util-083"></a>

**FR-UTIL-083 — App clean boundary**  
Cleanup shall preserve resources whose deletion semantics belong to App, Nuxt, Git, Settings, Docs, AI or another stronger owner under [Design §10.9](../appmanager-design-specification-v01.md#_10-9-maintenance-domain), as well as user-authored or protected resources not positively classified as disposable Maintenance artefacts.

<a id="fr-util-084"></a>

**FR-UTIL-084 — Recognized cleanup targets**  
Cleanup targets shall be identified by explicit supported location/classification and naming/pattern policy rather than by an unrestricted recursive delete.

<a id="fr-util-085"></a>

**FR-UTIL-085 — Managed scope**  
Maintenance cleanup targets shall apply [FR-PROJ-044](managed-project-functional-specification-v01.md#fr-proj-044).

<a id="fr-util-086"></a>

**FR-UTIL-086 — Discovery is read-only**  
Scanning for eligible cleanup artefacts shall not delete them.

<a id="fr-util-087"></a>

**FR-UTIL-087 — Empty cleanup result**  
If no eligible cleanup artefacts are found, the operation shall return a no-op/clean result without requiring consequential confirmation.

<a id="fr-util-088"></a>

**FR-UTIL-088 — Cleanup preview**  
Before deletion, the operation shall be able to identify the eligible artefacts or at minimum their classes/counts sufficiently for informed authorization according to invocation policy.

<a id="fr-util-089"></a>

**FR-UTIL-089 — Confirmation**  
Consequential cleanup deletion shall apply [FR-INV-023](application-invocation-functional-specification-v01.md#fr-inv-023), [FR-INV-022](application-invocation-functional-specification-v01.md#fr-inv-022).

<a id="fr-util-090"></a>

**FR-UTIL-090 — No arbitrary deletion**  
Arbitrary-path cleanup requests shall apply [PBC-FR-MAINT-003](utils-functional-specification-v01.md#pbc-fr-maint-003).

<a id="fr-util-091"></a>

**FR-UTIL-091 — Per-target deletion outcome**  
Deletion results shall distinguish successfully removed, already absent, skipped and failed targets where multiple artefacts are processed.

<a id="fr-util-092"></a>

**FR-UTIL-092 — Race-safe absence**  
An artefact that disappears between discovery and deletion may be treated as already absent/no-op rather than a destructive failure, provided the operation does not mask other errors.

<a id="fr-util-093"></a>

**FR-UTIL-093 — Partial cleanup**  
Mixed cleanup deletion outcomes shall apply [FR-UTIL-020](utils-functional-specification-v01.md#fr-util-020).

<a id="fr-util-094"></a>

**FR-UTIL-094 — Configurable policy boundary**  
Detailed Design may make cleanup locations/patterns configurable, but effective configuration shall not permit a cleanup policy to escape managed scope or safety constraints.

---

## 10. Cross-Domain Coordination

<a id="fr-util-095"></a>

**FR-UTIL-095 — Docs delegation**  
Historical `utils.autoDoc` compatibility delegation shall apply [FR-DOCS-100](docs-functional-specification-v01.md#fr-docs-100).

<a id="fr-util-096"></a>

**FR-UTIL-096 — Settings delegation**  
Historical `utils.addContributor` compatibility delegation shall apply [FR-SET-072](settings-functional-specification-v01.md#fr-set-072).

<a id="fr-util-097"></a>

**FR-UTIL-097 — Git facts**  
Maintenance may consume Git status/diff/identity facts where required by an approved utility use case, but shall not perform repository synchronization, commit, push or remote-management semantics as a side effect.

<a id="fr-util-098"></a>

**FR-UTIL-098 — AI assistance**  
Optional AI assistance in Maintenance shall apply [Design §10.6](../appmanager-design-specification-v01.md#_10-6-ai-domain), [Design §11.10](../appmanager-design-specification-v01.md#_11-10-ai-assisted-workflow).

<a id="fr-util-099"></a>

**FR-UTIL-099 — Quality boundary**  
Header validation may produce validation findings, but it does not replace Quality-owned project-wide test, lint, type-check, coverage or quality-gate semantics.

<a id="fr-util-100"></a>

**FR-UTIL-100 — Settings identity consumption**  
Maintenance author/operator identity consumption shall apply [FR-SET-023](settings-functional-specification-v01.md#fr-set-023), [FR-CONFIG-020](configuration-functional-specification-v01.md#fr-config-020).

---

## 11. Results, Failure and Safety

<a id="fr-util-101"></a>

**FR-UTIL-101 — Failure classification**  
Maintenance shall distinguish target/scope failure, unsupported source, validation finding, transformation failure, provider failure, authorization failure and application-level rejection where applicable.

<a id="fr-util-102"></a>

**FR-UTIL-102 — Findings versus execution failure**  
A validation finding shall be distinguishable from failure to execute the validation itself.

<a id="fr-util-103"></a>

**FR-UTIL-103 — Warning semantics**  
Maintenance warnings shall apply [FR-INV-039](application-invocation-functional-specification-v01.md#fr-inv-039).

<a id="fr-util-104"></a>

**FR-UTIL-104 — Concurrent modification**  
Concurrent multi-file Maintenance shall apply [FR-XFORM-068](source-transformation-functional-specification-v01.md#fr-xform-068), [FR-XFORM-069](source-transformation-functional-specification-v01.md#fr-xform-069).

<a id="fr-util-105"></a>

**FR-UTIL-105 — No implicit retry authority**  
Maintenance retries shall apply [FR-INV-049](application-invocation-functional-specification-v01.md#fr-inv-049). Retry policy shall not implicitly permit broader effects.

<a id="fr-util-106"></a>

**FR-UTIL-106 — Machine-consumable outcomes**  
Maintenance status and target outcomes shall apply [FR-INV-021](application-invocation-functional-specification-v01.md#fr-inv-021).

<a id="fr-util-107"></a>

**FR-UTIL-107 — No hidden scope expansion**  
Selected Maintenance resource scope shall apply [FR-PROJ-042](managed-project-functional-specification-v01.md#fr-proj-042).

<a id="fr-util-108"></a>

**FR-UTIL-108 — Safety over compatibility convenience**  
Where compatibility behaviour conflicts with managed-scope, deterministic Headless or source-transformation safety rules, the shared Version 1 safety contract shall prevail.

---

### 11.1 Coordinated Resource Operations

A selected Maintenance operation resolves semantic scope, classifies resources, plans eligible effects, obtains consequential authorisation and evaluates each resource result before aggregate completion. Discovery helps find candidates; eligibility and the selected operation determine the plan. Completed work remains visible if later work cannot finish.

<a id="pbc-fr-maint-coord-001"></a>

**PBC-FR-MAINT-COORD-001 — Supported cardinality**

Where the selected Maintenance command permits it, an invocation may target one eligible managed resource, an explicit eligible resource set, a supported semantic managed unit, or the complete eligible managed scope.

<a id="pbc-fr-maint-coord-002"></a>

**PBC-FR-MAINT-COORD-002 — Managed-scope ceiling**

Coordinated Maintenance selectors and discovery shall apply [FR-PROJ-042](managed-project-functional-specification-v01.md#fr-proj-042).

<a id="pbc-fr-maint-coord-003"></a>

**PBC-FR-MAINT-COORD-003 — Operation-specific eligibility**

Each planned Maintenance resource shall apply [PBC-FR-MAINT-004](utils-functional-specification-v01.md#pbc-fr-maint-004).

<a id="pbc-fr-maint-coord-004"></a>

**PBC-FR-MAINT-COORD-004 — Duplicate normalization**

Overlapping semantic scopes shall not cause the same logical resource to be consequentially processed more than once in one invocation unless the command explicitly defines repeated processing.

<a id="pbc-fr-maint-coord-005"></a>

**PBC-FR-MAINT-COORD-005 — Stable identity**

Structured results shall identify each inspected or consequential resource sufficiently for interactive and Headless callers to correlate its state and outcome.

<a id="pbc-fr-maint-coord-006"></a>

**PBC-FR-MAINT-COORD-006 — Classification before mutation**

Before a coordinated mutating Maintenance operation starts consequential effects, AppManager shall classify the requested scope sufficiently to distinguish eligible targets from already-satisfied, ineligible, unsupported, ambiguous, protected, outside-scope or unresolved resources as applicable.

<a id="pbc-fr-maint-coord-007"></a>

**PBC-FR-MAINT-COORD-007 — Discovery is not authority**

Maintenance files/artefacts discovered for repair, versioning or cleanup shall apply [Design §9.9](../appmanager-design-specification-v01.md#_9-9-non-destructive-ownership-and-unmanaged-content).

<a id="pbc-fr-maint-coord-008"></a>

**PBC-FR-MAINT-COORD-008 — Bounded plan**

Before consequential execution, a coordinated mutating operation shall derive a bounded plan retaining each resource's stable identity, operation-specific evidence/current state, proposed effect, applicable preconditions and acceptance criteria. After classification and planning, consequential authorisation precedes effects and per-resource validation/acceptance. Material authority or safety facts becoming stale shall invalidate the affected effect rather than permit blind repair, overwrite or deletion.

<a id="pbc-fr-maint-coord-009"></a>

**PBC-FR-MAINT-COORD-009 — No arbitrary paths**

User-supplied Maintenance selectors shall apply [PBC-FR-MAINT-003](utils-functional-specification-v01.md#pbc-fr-maint-003), [PBC-FR-MAINT-004](utils-functional-specification-v01.md#pbc-fr-maint-004).

<a id="pbc-fr-maint-coord-010"></a>

**PBC-FR-MAINT-COORD-010 — Multi-resource validation**

Coordinated header validation shall apply [FR-UTIL-032](utils-functional-specification-v01.md#fr-util-032), [FR-UTIL-034](utils-functional-specification-v01.md#fr-util-034).

<a id="pbc-fr-maint-coord-011"></a>

**PBC-FR-MAINT-COORD-011 — Per-resource validation evidence**

Coordinated header validation evidence shall apply [FR-UTIL-035](utils-functional-specification-v01.md#fr-util-035), [FR-UTIL-036](utils-functional-specification-v01.md#fr-util-036). One invalid or indeterminate header shall not erase other inspected-resource results.

<a id="pbc-fr-maint-coord-012"></a>

**PBC-FR-MAINT-COORD-012 — Invalid is not repair authority**

Validation findings shall apply [Design §9.9](../appmanager-design-specification-v01.md#_9-9-non-destructive-ownership-and-unmanaged-content).

<a id="pbc-fr-maint-coord-013"></a>

**PBC-FR-MAINT-COORD-013 — Coordinated repair**

`maintenance.headers.repair` may repair multiple independently eligible managed source resources within one authorised invocation.

<a id="pbc-fr-maint-coord-014"></a>

**PBC-FR-MAINT-COORD-014 — Recognised defect required**

Each coordinated header repair shall apply [FR-UTIL-045](utils-functional-specification-v01.md#fr-util-045), [FR-UTIL-046](utils-functional-specification-v01.md#fr-util-046), [PBC-FR-MAINT-COORD-008](utils-functional-specification-v01.md#pbc-fr-maint-coord-008).

<a id="pbc-fr-maint-coord-015"></a>

**PBC-FR-MAINT-COORD-015 — Per-resource transformation safety**

Every coordinated source repair shall apply [Design §9.9](../appmanager-design-specification-v01.md#_9-9-non-destructive-ownership-and-unmanaged-content), [FR-XFORM-068](source-transformation-functional-specification-v01.md#fr-xform-068), [FR-XFORM-048](source-transformation-functional-specification-v01.md#fr-xform-048).

<a id="pbc-fr-maint-coord-016"></a>

**PBC-FR-MAINT-COORD-016 — Unsupported/ambiguous preservation**

Unsupported, ambiguous, protected or stale Maintenance targets shall apply [FR-XFORM-008](source-transformation-functional-specification-v01.md#fr-xform-008), [FR-XFORM-009](source-transformation-functional-specification-v01.md#fr-xform-009), [FR-XFORM-068](source-transformation-functional-specification-v01.md#fr-xform-068), [FR-UTIL-083](utils-functional-specification-v01.md#fr-util-083).

<a id="pbc-fr-maint-coord-017"></a>

**PBC-FR-MAINT-COORD-017 — Coordinated source-version maintenance**

`maintenance.source-version.maintain` may apply explicit source-version maintenance policy to multiple independently eligible managed resources in one invocation.

<a id="pbc-fr-maint-coord-018"></a>

**PBC-FR-MAINT-COORD-018 — Per-resource current state**

Each source-version effect shall apply [PBC-FR-MAINT-COORD-008](utils-functional-specification-v01.md#pbc-fr-maint-coord-008), [FR-UTIL-076](utils-functional-specification-v01.md#fr-util-076).

<a id="pbc-fr-maint-coord-019"></a>

**PBC-FR-MAINT-COORD-019 — Version boundary preserved**

Coordinated source-version maintenance shall apply [FR-UTIL-067](utils-functional-specification-v01.md#fr-util-067).

<a id="pbc-fr-maint-coord-020"></a>

**PBC-FR-MAINT-COORD-020 — Coordinated cleanup**

`maintenance.cleanup` may delete multiple positively recognised disposable Maintenance artefacts in one authorised invocation.

<a id="pbc-fr-maint-coord-021"></a>

**PBC-FR-MAINT-COORD-021 — Positive disposable classification**

A cleanup resource shall be consequentially eligible only when it is positively classified as a supported disposable Maintenance artefact within managed scope.

<a id="pbc-fr-maint-coord-022"></a>

**PBC-FR-MAINT-COORD-022 — Protected and stronger-owned resources**

Coordinated cleanup exclusions shall apply [FR-UTIL-083](utils-functional-specification-v01.md#fr-util-083).

<a id="pbc-fr-maint-coord-023"></a>

**PBC-FR-MAINT-COORD-023 — Stable cleanup set**

Where practical, the consequential cleanup set shall be resolved before deletion begins. Discovery during execution shall not silently broaden the authorised cleanup scope.

<a id="pbc-fr-maint-coord-024"></a>

**PBC-FR-MAINT-COORD-024 — Independent effects**

A coordinated mutating Maintenance invocation shall preserve independently attributable per-resource effects and acceptance states.

<a id="pbc-fr-maint-coord-025"></a>

**PBC-FR-MAINT-COORD-025 — No synthetic transaction**

Multi-resource Maintenance transaction/compensation claims shall apply [FR-INV-046](application-invocation-functional-specification-v01.md#fr-inv-046).

<a id="pbc-fr-maint-coord-026"></a>

**PBC-FR-MAINT-COORD-026 — Partial completion**

Completed Maintenance effects before later failure, staleness, refusal or indeterminate state shall apply [FR-UTIL-020](utils-functional-specification-v01.md#fr-util-020), [FR-INV-045](application-invocation-functional-specification-v01.md#fr-inv-045).

<a id="pbc-fr-maint-coord-027"></a>

**PBC-FR-MAINT-COORD-027 — Continuation policy**

Whether independent later resources continue after an individual failure/refusal/indeterminate state shall be determined by explicit Maintenance continuation policy and any dependency relationships.

<a id="pbc-fr-maint-coord-028"></a>

**PBC-FR-MAINT-COORD-028 — Cancellation**

Coordinated Maintenance cancellation shall apply [FR-UTIL-021](utils-functional-specification-v01.md#fr-util-021).

<a id="pbc-fr-maint-coord-029"></a>

**PBC-FR-MAINT-COORD-029 — Application acceptance**

Per-resource Maintenance evidence and final outcome shall apply [FR-INV-033](application-invocation-functional-specification-v01.md#fr-inv-033), [Design §11.11](../appmanager-design-specification-v01.md#_11-11-workflow-results-failure-and-acceptance).

<a id="pbc-fr-maint-coord-030"></a>

**PBC-FR-MAINT-COORD-030 — Interaction equivalence**
Coordinated Maintenance across TUI, GUI and Headless shall apply [Design §4.6](../appmanager-design-specification-v01.md#_4-6-presentation-independence).

<a id="pbc-fr-maint-coord-031"></a>

**PBC-FR-MAINT-COORD-031 — Deterministic Headless scope**

Headless coordinated semantic scope shall apply [FR-INV-020](application-invocation-functional-specification-v01.md#fr-inv-020), [FR-INV-022](application-invocation-functional-specification-v01.md#fr-inv-022).

<a id="pbc-fr-maint-coord-032"></a>

**PBC-FR-MAINT-COORD-032 — No AI dependency**

Version 1 coordinated Maintenance shall not require AI availability. AI shall not be used to convert ambiguous resource classification into mutation authority.

---

## 12. Traceability Summary

| Functional area | Requirements | Upstream / same-level authority | Downstream refinement destination |
|---|---|---|---|
| Domain boundary | FR-UTIL-001–009 | This specification; Root Design | Owning domain/shared-contract Detailed Design |
| Common behavior | FR-UTIL-010–023 | This specification §3; FR-INV, FR-PROJ, FR-XFORM | Owning domain/shared-contract Detailed Design |
| Header convention | FR-UTIL-024–031 | This specification §4 | Owning domain/shared-contract Detailed Design |
| Header check/validation | FR-UTIL-032–044 | This specification §5 | Owning domain/shared-contract Detailed Design |
| Header repair | FR-UTIL-045–058 | This specification §6; FR-XFORM | Owning domain/shared-contract Detailed Design |
| Package repair | FR-UTIL-059–065 | This specification §7; Settings Functional Specification | Owning domain/shared-contract Detailed Design |
| Source-file auto-version | FR-UTIL-066–081 | This specification §8; Git Functional Specification; Root Design §11.10 | Owning domain/shared-contract Detailed Design |
| Temporary/test/log cleanup | FR-UTIL-082–094 | This specification §9; Managed Project scope | Owning domain/shared-contract Detailed Design |
| Cross-domain coordination | FR-UTIL-095–100 | This specification §10; Docs, Settings, Git, AI and Quality Functional Specifications | Owning domain/shared-contract Detailed Design |
| Results and safety | FR-UTIL-101–108 | This specification §11; FR-INV, FR-PROJ, FR-XFORM | Owning domain/shared-contract Detailed Design |
| Maintenance identity and coordinated scope | PBC-FR-MAINT-001–004; PBC-FR-MAINT-COORD-001–032 | This specification §§2.1, 11.1; Design §10.9; Managed Project; Source Transformation | Maintenance domain and Source Intelligence/Transformation capabilities |

---

## 13. Downstream Specification Boundary

Detailed Design may define permanent contracts for source-header models, validation rules, code-intelligence interfaces, change classification, revision-history representation, cleanup policy, source scanners and transformation strategies.

Implementation Specifications may define concrete TypeScript modules, exact supported extensions, excluded directories, header comment syntax, path derivation, Git diff calls, AI prompt/response schemas, version increment functions, cleanup directory names, filesystem APIs and compatibility command aliases.

Neither level may restore automatic documentation or contributor metadata as independent Maintenance authorities, nor turn Maintenance into a generic fallback domain, without an approved change to the governing Functional/Design specifications.

---

## 14. Version 1 Functional Baseline

This document is the Version 1 Functional owner for its stated concern. Its requirement identities remain stable under the [Project Documentation Guide](../project-documentation-guide-v01.md#_9-traceability).
