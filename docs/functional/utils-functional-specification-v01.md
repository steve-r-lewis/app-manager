# AppManager Utils Functional Specification

> **Status:** Version 1 Functional Specification
>
> **Functional domain:** `utils`
>
> **Requirement prefix:** `FR-UTIL`
>
> **Governing sources:** [Project Documentation Guide](../project-documentation-guide-v01.md), [AppManager Design Specification](../appmanager-design-specification-v01.md)
>
> **Related Functional Specifications:** [application-invocation-functional-specification-v01.md](application-invocation-functional-specification-v01.md), [managed-project-functional-specification-v01.md](managed-project-functional-specification-v01.md), [configuration-functional-specification-v01.md](configuration-functional-specification-v01.md), [source-transformation-functional-specification-v01.md](source-transformation-functional-specification-v01.md), [docs-functional-specification-v01.md](docs-functional-specification-v01.md), [settings-functional-specification-v01.md](settings-functional-specification-v01.md), [git-functional-specification-v01.md](git-functional-specification-v01.md), [ai-functional-specification-v01.md](ai-functional-specification-v01.md)
>
> **Planning source:** [docs/project_management/functional-specification-decomposition-plan-v01.md](../project_management/functional-specification-decomposition-plan-v01.md)

## 1. Purpose

This specification defines the observable Version 1 behaviour of the AppManager `utils` domain.

`utils` is deliberately the final domain specification because it is the domain most vulnerable to becoming a catch-all. A behaviour belongs here only when it is a coherent AppManager product operation and no more specific functional domain has primary ownership.

Version 1 Utils owns three principal behavioural families:

- project source-header inspection, validation and bounded repair;
- automatic source-file version maintenance where version metadata is governed by the AppManager source-header convention;
- cleanup of recognized temporary/test/log artefacts that do not belong to the broader application clean/reset lifecycle.

Automatic documentation is owned by `docs`. Contributor metadata management is owned by `settings`. Those behaviours shall not be introduced as independent Utils authorities.

The governing rule is:

> **Utils is a bounded home for genuine cross-cutting maintenance operations, not a residual namespace for behaviour whose proper owner has already been identified.**

---

## 2. Functional Boundary

**FR-UTIL-001 — Bounded utility ownership**  
A Utils use case shall have a defined maintenance intent that is not more appropriately owned by another approved functional domain.

**FR-UTIL-002 — No catch-all authority**  
The existence of a `utils` command name shall not by itself establish Version 1 Utils ownership.

**FR-UTIL-003 — Documentation ownership**  
Automatic documentation generation is owned by the Docs Functional Specification. Utils shall not define a competing automatic-documentation semantic path.

**FR-UTIL-004 — Contributor ownership**  
Declared contributor metadata management is owned by the Settings Functional Specification. Utils shall not define a competing contributor-management authority.

**FR-UTIL-005 — Domain delegation**  
A compatibility or convenience Utils surface may delegate to another domain-owned use case only if the owning domain's semantics remain authoritative and the delegation is not presented as a separate behaviour.

**FR-UTIL-006 — Source transformation authority**  
Any Utils operation that modifies existing source shall comply with the Source Transformation Functional Specification.

**FR-UTIL-007 — Managed-project authority**  
Utils shall use resolved Managed Project context and managed scope rather than deriving mutation authority from directory discovery alone.

**FR-UTIL-008 — Delegated execution**  
Scanners, strategies, parsers, Git providers, AI providers and file services may execute specialist work but shall not determine Utils application authority or application-level success.

**FR-UTIL-009 — Implementation independence**  
Functional requirements shall not mandate `codeService`, a particular Strategy class, regular-expression implementation, filesystem API or TypeScript service layout.

---

## 3. Common Utils Behaviour

**FR-UTIL-010 — Structured invocation**  
Utils use cases shall participate in the common Application Invocation Contract.

**FR-UTIL-011 — Structured outcome**  
Every Utils operation shall return an application-level outcome identifying the requested operation, managed target or scope, and success, failure, no-op, partial or cancelled state as applicable.

**FR-UTIL-012 — Interaction-mode equivalence**  
TUI, Headless and future adapters shall preserve equivalent Utils semantics even where interactive adapters offer menus or repair choices.

**FR-UTIL-013 — Deterministic Headless behaviour**  
Headless Utils operations shall not prompt. Missing required repair policy, authorization or target information shall produce a structured failure or non-mutating diagnostic result rather than a guess.

**FR-UTIL-014 — Read-only inspection**  
A check, inspect or validate-only invocation shall not modify project content.

**FR-UTIL-015 — Explicit repair intent**  
A repair or update operation shall be explicitly requested or explicitly authorized by the invoking workflow.

**FR-UTIL-016 — Preview where consequential**  
Where a Utils operation proposes multiple or consequential source changes, AppManager shall support preview/dry-run semantics through the shared invocation/transformation contract where required by policy.

**FR-UTIL-017 — Bounded mutation**  
A Utils mutation shall change only content required to satisfy the approved maintenance intent.

**FR-UTIL-018 — Preserve unrelated content**  
Utils source maintenance shall preserve unrelated source, comments, metadata and formatting where practical.

**FR-UTIL-019 — Unsupported content**  
Unsupported or ambiguous source shall be reported rather than silently rewritten under an assumed interpretation.

**FR-UTIL-020 — Partial success**  
A multi-file Utils operation shall report per-target outcomes and partial success when only some targets complete successfully.

**FR-UTIL-021 — Cancellation**  
Cancellation shall stop future effects as soon as safely practical while preserving and reporting already completed effects.

**FR-UTIL-022 — No false rollback**  
Utils shall not imply rollback of completed file changes unless rollback is actually guaranteed.

**FR-UTIL-023 — Sensitive diagnostics**  
Diagnostics and AI context shall avoid unnecessary disclosure of protected or sensitive project content.

---

## 4. Source-Header Convention

Version 1 supports the AppManager project source-header convention as a maintenance concern. The convention may include semantic fields such as project identity, file identity, author attribution, version metadata and revision-history information. Exact comment syntax and parser mechanics belong below the Functional level unless intentionally exposed as a stable contract.

**FR-UTIL-024 — Header recognition**  
Utils shall be able to determine whether a supported source file contains a recognized AppManager source-header representation.

**FR-UTIL-025 — Header scope**  
Header operations shall apply only to supported managed source files selected by the requested scope and effective policy.

**FR-UTIL-026 — Exclusion policy**  
Generated output, dependency trees, caches, repository internals and other excluded content shall not become mutation targets merely because files within them resemble supported source files.

**FR-UTIL-027 — Header facts**  
Inspection may expose recognized header facts including presence, project identity, file identity, author metadata, declared version and revision-history consistency where supported.

**FR-UTIL-028 — Missing header distinction**  
A missing header, malformed header and valid-but-inconsistent header shall be distinguishable outcomes.

**FR-UTIL-029 — Recognition is not authority**  
Recognizing a header or header defect shall not itself authorize repair.

**FR-UTIL-030 — Creation metadata preservation**  
Header validation or repair shall preserve original creation-date/time metadata unless the requested use case explicitly concerns establishing missing creation metadata under an approved policy.

**FR-UTIL-031 — Revision-history preservation**  
Repair shall preserve valid existing revision-history information except for the bounded changes required by the selected maintenance intent.

---

## 5. Check and Validate Headers

Header checking and validation form a coherent read-only validation capability with selectable depth rather than separate authorities derived from command naming.

**FR-UTIL-032 — Header check use case**  
Utils shall provide a non-mutating use case that checks supported managed source files for recognized header presence and validity.

**FR-UTIL-033 — Validation use case**  
Utils shall provide validation capable of evaluating supported semantic consistency rules for recognized headers.

**FR-UTIL-034 — Scope selection**  
Header checking/validation shall operate on an explicit supported scope such as a selected file, selected managed component/layer, or eligible managed-project source set where such scopes are exposed.

**FR-UTIL-035 — Per-file result**  
Validation shall identify each inspected file's status sufficiently to distinguish valid, missing, malformed, inconsistent, unsupported and failed inspection outcomes as applicable.

**FR-UTIL-036 — Aggregate result**  
An aggregate validation outcome shall not report success when required files contain unresolved validation failures.

**FR-UTIL-037 — No-files result**  
A valid scope containing no eligible source files shall be reported distinctly from a successful validation of one or more files.

**FR-UTIL-038 — Project identity consistency**  
Where the source-header convention contains project identity and a reliable expected project identity is available, validation may compare them.

**FR-UTIL-039 — File identity consistency**  
Where the header contains file/path identity, validation shall be able to compare it with the file's managed-project-relative identity according to the supported convention.

**FR-UTIL-040 — Author consistency**  
Where author consistency is part of the configured convention, validation may compare recognized author metadata with the applicable resolved identity without silently rewriting the header.

**FR-UTIL-041 — Version consistency**  
Where revision history is authoritative for the source-file version convention, validation shall identify disagreement between declared top-level version and the applicable revision-history version.

**FR-UTIL-042 — Package metadata validation boundary**  
Package-name checks may be included only where they are part of the project-maintenance validation use case; they shall not give Utils general ownership over application metadata, package management or Nuxt semantics.

**FR-UTIL-043 — Package-name diagnostic**  
Where a supported package metadata naming convention can be deterministically derived from managed project facts, Utils may report a mismatch as a validation finding.

**FR-UTIL-044 — Ambiguous expected name**  
If an expected package name cannot be determined unambiguously, Utils shall report that limitation rather than invent a replacement.

---

## 6. Repair Headers

**FR-UTIL-045 — Header repair use case**  
Utils shall provide bounded repair of supported source-header defects where a deterministic repair can be established and the operation is authorized.

**FR-UTIL-046 — Check before repair**  
Repair shall be based on current inspection/validation facts rather than unconditional header replacement.

**FR-UTIL-047 — Field-level intent**  
Where only individual header fields are inconsistent, repair shall target those fields rather than replace valid unrelated header content.

**FR-UTIL-048 — Project field repair**  
Where a recognized project-identity field exists and its correct value is determinable, repair may synchronize that field to the managed-project identity.

**FR-UTIL-049 — Missing project field**  
Version 1 does not require header repair to synthesize a missing project-identity field merely because validation can detect its absence; adding previously absent fields shall be governed by explicit repair policy.

**FR-UTIL-050 — File field repair**  
Where the header contains a recognized file-identity field, repair may synchronize it with the correct managed-project-relative file identity.

**FR-UTIL-051 — Author addition**  
Where author maintenance is enabled and a required author entry is absent, repair may add the resolved applicable author without deleting existing valid author history.

**FR-UTIL-052 — Missing author identity**  
If required author identity cannot be resolved, Utils shall not fabricate an author value.

**FR-UTIL-053 — Version field repair**  
Where the source convention defines revision history as authoritative, repair may synchronize the declared header version to the highest applicable recognized revision-history version.

**FR-UTIL-054 — No history invention**  
Header repair shall not invent revision-history events merely to make a version field appear valid.

**FR-UTIL-055 — Only write changed files**  
A repair operation shall not rewrite a file when no material repair is required.

**FR-UTIL-056 — Source-level validation**  
After a header repair, AppManager shall perform applicable source-level validation before accepting the transformation.

**FR-UTIL-057 — Application acceptance**  
A syntactically successful write shall not alone establish successful repair; the resulting file shall satisfy the intended header-maintenance policy.

**FR-UTIL-058 — Stale-source protection**  
AppManager shall avoid silently applying a repair plan to materially changed source when stale-state conflict can be detected.

---

## 7. Package Metadata Repair within Header Validation

Header validation may include package-name repair narrowly, without converting Utils into the owner of project metadata generally.

**FR-UTIL-059 — Explicit package repair**  
Package metadata shall not be changed by a validate-only invocation. A detected naming mismatch requires explicit repair intent or authorization.

**FR-UTIL-060 — Deterministic repair path**  
Where the expected package name is unambiguous, Utils may offer or apply the deterministic expected value according to invocation policy.

**FR-UTIL-061 — Manual repair path**  
Interactive operation may permit the caller to supply a replacement value, subject to validation.

**FR-UTIL-062 — Optional AI suggestion**  
Where AI-assisted package metadata repair is retained, AI may suggest a name or description but shall not be authoritative.

**FR-UTIL-063 — AI unavailable**  
AI unavailability shall not prevent deterministic/manual repair where those paths are otherwise valid.

**FR-UTIL-064 — Headless AI safety**  
Headless operation shall not rely on AI to resolve ambiguous package identity unless explicit policy permits the proposed value to be validated and accepted deterministically.

**FR-UTIL-065 — Settings boundary**  
General package/application metadata CRUD remains Settings-owned; this narrow repair path exists only as part of the validation/maintenance use case.

---

## 8. Automatic Source-File Version Maintenance

This use case concerns source-file header versions, not the managed application's declared package/release version.

**FR-UTIL-066 — Source-file auto-version use case**  
Utils shall support automatic maintenance of recognized source-file version metadata for eligible changed files.

**FR-UTIL-067 — Application-version distinction**  
Source-file auto-versioning shall remain distinct from Settings-owned manual application-version metadata and from any future release/version workflow.

**FR-UTIL-068 — Changed-file basis**  
Auto-versioning shall operate on an explicitly established set of changed eligible managed source files rather than indiscriminately versioning every discovered source file.

**FR-UTIL-069 — Git facts without Git ownership transfer**  
Utils may consume Git-provided change/diff/identity facts to establish source-file changes. Repository semantics remain Git-owned.

**FR-UTIL-070 — Eligible header requirement**  
A file without the recognized version metadata required by the source-file version convention shall not be silently converted into a versioned file by auto-versioning.

**FR-UTIL-071 — Diff-informed increment**  
Where available, AppManager may use bounded change information to determine an appropriate semantic increment for an eligible source file.

**FR-UTIL-072 — Supported increments**  
Where semantic version increments are used, the functional increment classes shall be Major, Minor and Patch or their semantically equivalent configured representation.

**FR-UTIL-073 — Optional AI classification**  
AI may assist in classifying a source-file change as Major, Minor or Patch and may suggest a revision note.

**FR-UTIL-074 — AI non-authority**  
An AI increment recommendation shall be treated as a proposal and shall remain subject to AppManager validation and policy.

**FR-UTIL-075 — AI fallback**  
Where Version 1 auto-versioning is invoked without usable AI classification, the operation may use the safe Patch fallback if effective policy does not require a different explicit decision.

**FR-UTIL-076 — Invalid current version**  
Malformed or unsupported current version metadata shall be reported and the affected file shall not be blindly incremented.

**FR-UTIL-077 — Version update coherence**  
An accepted auto-version change shall update the source-file version metadata and corresponding revision-history information coherently where the convention requires both.

**FR-UTIL-078 — Revision note**  
Where a revision note is part of the convention, the operation shall produce or obtain a bounded note associated with the actual source-file change rather than unrelated project activity.

**FR-UTIL-079 — Per-file isolation**  
Failure to classify or update one file shall not require abandoning unrelated eligible files unless fail-fast policy explicitly requires it.

**FR-UTIL-080 — Write validation**  
Each modified file shall be validated and accepted under Source Transformation semantics before being reported as successfully versioned.

**FR-UTIL-081 — Summary outcome**  
The operation shall report counts or structured per-file outcomes sufficient to distinguish updated, skipped, failed and unchanged files.

---

## 9. Temporary/Test/Log Artefact Cleanup

This use case is intentionally narrower than App-domain clean/reset.

**FR-UTIL-082 — Utility cleanup use case**  
Utils shall support cleanup of recognized temporary test/log artefacts produced within AppManager-managed maintenance/testing workflows where those artefacts are not part of the broader App lifecycle clean/reset semantics.

**FR-UTIL-083 — App clean boundary**  
Utils cleanup shall not become an alternate implementation of App-owned cache/build/dependency clean or reset behavior.

**FR-UTIL-084 — Recognized cleanup targets**  
Cleanup targets shall be identified by explicit supported location/classification and naming/pattern policy rather than by an unrestricted recursive delete.

**FR-UTIL-085 — Managed scope**  
Cleanup shall remain within the resolved managed project/AppManager management scope approved for the operation.

**FR-UTIL-086 — Discovery is read-only**  
Scanning for eligible cleanup artefacts shall not delete them.

**FR-UTIL-087 — Empty cleanup result**  
If no eligible cleanup artefacts are found, the operation shall return a no-op/clean result without requiring consequential confirmation.

**FR-UTIL-088 — Cleanup preview**  
Before deletion, the operation shall be able to identify the eligible artefacts or at minimum their classes/counts sufficiently for informed authorization according to invocation policy.

**FR-UTIL-089 — Confirmation**  
Consequential deletion shall require confirmation in interactive operation or explicit non-interactive authorization.

**FR-UTIL-090 — No arbitrary deletion**  
A caller shall not be able to turn the bounded cleanup use case into arbitrary filesystem deletion merely by supplying an unrestricted path.

**FR-UTIL-091 — Per-target deletion outcome**  
Deletion results shall distinguish successfully removed, already absent, skipped and failed targets where multiple artefacts are processed.

**FR-UTIL-092 — Race-safe absence**  
An artefact that disappears between discovery and deletion may be treated as already absent/no-op rather than a destructive failure, provided the operation does not mask other errors.

**FR-UTIL-093 — Partial cleanup**  
Failure to delete one eligible artefact shall be reported without falsely claiming that all cleanup completed.

**FR-UTIL-094 — Configurable policy boundary**  
Detailed Design may make cleanup locations/patterns configurable, but effective configuration shall not permit a cleanup policy to escape managed scope or safety constraints.

---

## 10. Cross-Domain Coordination

**FR-UTIL-095 — Docs delegation**  
A compatibility or convenience `utils.autoDoc` surface, if retained, shall invoke Docs-owned automatic documentation semantics rather than maintain a second implementation authority.

**FR-UTIL-096 — Settings delegation**  
A compatibility or convenience `utils.addContributor` surface, if retained, shall invoke Settings-owned contributor metadata semantics.

**FR-UTIL-097 — Git facts**  
Utils may consume Git status/diff/identity facts where required by an approved utility use case, but shall not perform repository synchronization, commit, push or remote-management semantics as a side effect.

**FR-UTIL-098 — AI assistance**  
AI assistance inside Utils does not transfer the primary use case to the AI domain; the Utils use case remains authoritative for validation, acceptance and fallback.

**FR-UTIL-099 — Quality boundary**  
Header validation may produce validation findings, but it does not replace Quality-owned project-wide test, lint, type-check, coverage or quality-gate semantics.

**FR-UTIL-100 — Settings identity consumption**  
Where Utils needs author/operator identity, it may consume the applicable resolved Settings/Configuration value while preserving the distinction between AppManager operator identity and project author metadata.

---

## 11. Results, Failure and Safety

**FR-UTIL-101 — Failure classification**  
Utils shall distinguish target/scope failure, unsupported source, validation finding, transformation failure, provider failure, authorization failure and application-level rejection where applicable.

**FR-UTIL-102 — Findings versus execution failure**  
A validation finding shall be distinguishable from failure to execute the validation itself.

**FR-UTIL-103 — Warning semantics**  
Warnings shall not silently become success or failure criteria unless the specific use case or effective policy defines that interpretation.

**FR-UTIL-104 — Concurrent modification**  
Multi-file maintenance shall handle detectable concurrent/stale modification deliberately and shall not silently overwrite newer unrelated changes.

**FR-UTIL-105 — No implicit retry authority**  
A delegated capability failure shall not authorize unbounded retries or broader mutations unless retry policy explicitly permits them.

**FR-UTIL-106 — Machine-consumable outcomes**  
Headless callers shall be able to determine operation status and affected targets without parsing human-oriented log prose.

**FR-UTIL-107 — No hidden scope expansion**  
A utility operation shall not expand from a selected file/component to the complete project merely because additional defects or artefacts are discovered elsewhere.

**FR-UTIL-108 — Safety over compatibility convenience**  
Where compatibility behaviour conflicts with managed-scope, deterministic Headless or source-transformation safety rules, the shared Version 1 safety contract shall prevail.

---

## 12. Traceability Summary

| Functional area | Requirements | Current authority |
|---|---|---|
| Domain boundary | FR-UTIL-001–009 | Root Design; decomposition plan §5.7 |
| Common behavior | FR-UTIL-010–023 | This specification §3; FR-INV, FR-PROJ, FR-XFORM |
| Header convention | FR-UTIL-024–031 | This specification §4 |
| Header check/validation | FR-UTIL-032–044 | This specification §5 |
| Header repair | FR-UTIL-045–058 | This specification §6; FR-XFORM |
| Package repair | FR-UTIL-059–065 | This specification §7; Settings ownership boundary |
| Source-file auto-version | FR-UTIL-066–081 | This specification §8; Git facts boundary; AI non-authority |
| Temporary/test/log cleanup | FR-UTIL-082–094 | This specification §9; Managed Project scope |
| Cross-domain coordination | FR-UTIL-095–100 | This specification §10; Docs, Settings, Git, AI, Quality boundaries |
| Results and safety | FR-UTIL-101–108 | This specification §11; FR-INV, FR-PROJ, FR-XFORM |

---

## 13. Downstream Specification Boundary

Detailed Design may define permanent contracts for source-header models, validation rules, code-intelligence interfaces, change classification, revision-history representation, cleanup policy, source scanners and transformation strategies.

Implementation Specifications may define concrete TypeScript modules, exact supported extensions, excluded directories, header comment syntax, path derivation, Git diff calls, AI prompt/response schemas, version increment functions, cleanup directory names, filesystem APIs and compatibility command aliases.

Neither level may restore automatic documentation or contributor metadata as independent Utils authorities, nor turn Utils into a generic fallback domain, without an approved change to the governing Functional/Design specifications.

---

## 14. Version 1 Functional Baseline

This document establishes the Version 1 Functional baseline for the AppManager `utils` domain and completes the planned set of eight domain Functional Specifications.

The central rule is:

> **A utility exists because its maintenance intent is genuinely cross-cutting and otherwise unowned—not because no one has yet decided where it belongs. Inspection does not authorize repair, discovery does not authorize deletion, and delegated intelligence does not authorize application effects.**