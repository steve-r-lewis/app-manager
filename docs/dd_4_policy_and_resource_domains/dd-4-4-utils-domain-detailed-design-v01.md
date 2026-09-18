# DD-4.4 — AppManager Maintenance Domain Detailed Design

> **Detailed Design ID:** DD-4.4
>
> **Design family:** DD-4 — Policy and Resource Domains
>
> **Status:** Version 1 Detailed Design Specification
>
> **Detailed Design authority:** This document defines the permanent Maintenance-domain orchestration, maintenance-policy, state, decision and result contracts for bounded cross-cutting project maintenance through approved DD-1 Application Core and DD-2 Shared Capability contracts. It refines, but does not override, the root Design Specification, Functional Specifications, accepted clarifications, ADRs, DD-1, DD-2 or stronger owning-domain Detailed Designs.
>
> **Governing sources:** [Project Documentation Guide](../project-documentation-guide-v01.md), [AppManager Design Specification](../appmanager-design-specification-v01.md), [Maintenance Functional Specification](../functional/utils-functional-specification-v01.md), [Detailed Design Register](../project_management/detailed-design-register-v01.md), [Domain Detailed Design Authoring Guide](../project_management/domain-detailed-design-authoring-guide-v02.md), [ADR-0001 — Primary Application Runtime](../project_management/decisions/adr-0001-primary-application-runtime.md)
>
> **Related Detailed Design authorities:** [DD-1.1 — Application Invocation](../dd_1_application_core/dd-1-1-application-invocation-detailed-design-v01.md), [DD-1.2 — Execution Outcomes](../dd_1_application_core/dd-1-2-execution-outcomes-detailed-design-v01.md), [DD-1.3 — Managed Project](../dd_1_application_core/dd-1-3-managed-project-detailed-design-v01.md), [DD-1.4 — Configuration Resolution](../dd_1_application_core/dd-1-4-configuration-resolution-detailed-design-v01.md), [DD-1.5 — Application Engine](../dd_1_application_core/dd-1-5-application-engine-detailed-design-v01.md), [DD-2.1 — Resource Access](../dd_2_shared_capabilities/dd-2-1-resource-access-detailed-design-v01.md), [DD-2.3 — Repository Capability](../dd_2_shared_capabilities/dd-2-3-repository-capability-detailed-design-v01.md), [DD-2.4 — Source Intelligence](../dd_2_shared_capabilities/dd-2-4-source-intelligence-detailed-design-v01.md), [DD-2.5 — Source Transformation](../dd_2_shared_capabilities/dd-2-5-source-transformation-detailed-design-v01.md), [DD-2.7 — AI Capability](../dd_2_shared_capabilities/dd-2-7-ai-capability-detailed-design-v01.md), [DD-3.1 — App Domain](../dd_3_high_coupling_domains/dd-3-1-app-domain-detailed-design-v01.md), [DD-3.2 — Git Domain](../dd_3_high_coupling_domains/dd-3-2-git-domain-detailed-design-v01.md), [DD-3.4 — Docs Domain](../dd_3_high_coupling_domains/dd-3-4-docs-domain-detailed-design-v01.md), [DD-4.1 — Quality Domain](dd-4-1-quality-domain-detailed-design-v01.md), [DD-4.2 — Settings Domain](dd-4-2-settings-domain-detailed-design-v01.md), [DD-4.3 — AI Domain](dd-4-3-ai-domain-detailed-design-v01.md)

---

## 1. Purpose

This specification defines the permanent domain-level composition by which AppManager performs genuine cross-cutting maintenance operations that have no stronger approved domain owner.

The governing rules are:

> **Maintenance owns only bounded maintenance intent that is genuinely cross-cutting and otherwise unowned; it is not a residual namespace for behavior whose stronger owner is already known.**

> **Maintenance interprets source, repository, AI and resource evidence for Maintenance-owned maintenance intent; delegated specialist execution does not transfer Maintenance application authority to those capabilities.**

> **Inspection does not authorize repair, discovery does not authorize deletion, and a technically successful source write does not establish Maintenance-domain acceptance.**

> **The Application Engine retains final application authority.**

Version 1 Maintenance therefore owns source-header inspection/validation/repair, source-file header-version maintenance, and narrowly bounded temporary/test/log artefact cleanup. Documentation generation and contributor management remain delegated compatibility surfaces, not independent Maintenance authorities.

---

## 2. Scope

### 2.1 In Scope

This design owns permanent Maintenance-domain contracts for:

- Maintenance operation identity and applicability;
- proof that a proposed Maintenance operation has no stronger domain owner;
- source-header convention interpretation for Maintenance maintenance purposes;
- header inspection and validation policy;
- header-repair intent and acceptance;
- narrow package-metadata validation/repair only when part of header/project-maintenance validation;
- source-file version-maintenance intent and increment policy;
- revision-history coherence decisions;
- changed-file eligibility using repository facts without Git authority transfer;
- optional AI-assisted maintenance classification with deterministic fallback policy;
- temporary/test/log artefact cleanup eligibility and deletion policy;
- per-target and aggregate maintenance interpretation;
- no-op, partial, stale-state and cancellation semantics;
- deterministic Headless behavior;
- compatibility delegation to stronger owning domains;
- Maintenance-specific result payloads beneath DD-1.2 outcomes.

### 2.2 Out of Scope

This design does not own or redefine:

- canonical invocation, outcomes, managed-project identity/scope, effective configuration or final application acceptance;
- generic resource-access mechanics;
- repository status/diff/change semantics or Git workflow effects;
- generic source recognition or structural-fact semantics;
- generic source-transformation planning/execution/source validation;
- AI provider/model execution, prompt/context safety or response normalization;
- automatic documentation semantics;
- contributor or general application/package metadata CRUD;
- App-owned cache/build/dependency clean or reset;
- project-wide tests, lint, type checking, coverage or quality gates;
- application/release version workflow;
- arbitrary filesystem deletion;
- concrete header comment syntax, supported file extensions, excluded directory names, regexes, parser libraries, Git commands, prompt schemas, TypeScript classes/services/source paths or runtime topology.

---

## 3. Governing Requirements and Authorities

The Maintenance Functional Specification defines `FR-UTIL-001`–`FR-UTIL-108`. This Detailed Design binds those requirements as follows:

| Functional area | Requirements | Detailed Design focus |
|---|---|---|
| Domain boundary | `FR-UTIL-001`–`009` | bounded ownership, stronger-owner rule and capability subordination |
| Common behavior | `FR-UTIL-010`–`023` | invocation, outcomes, read/mutation distinction, partial effects and sensitivity |
| Header convention | `FR-UTIL-024`–`031` | recognition evidence and preservation |
| Header check/validation | `FR-UTIL-032`–`044` | read-only findings, expected-value derivation and aggregate acceptance |
| Header repair | `FR-UTIL-045`–`058` | current-state planning, bounded repair and postcondition acceptance |
| Package repair | `FR-UTIL-059`–`065` | narrow maintenance exception without Settings authority transfer |
| Source-file auto-version | `FR-UTIL-066`–`081` | changed-file eligibility, increment policy and revision coherence |
| Temporary/test/log cleanup | `FR-UTIL-082`–`094` | bounded discovery, authorization and deletion |
| Cross-domain coordination | `FR-UTIL-095`–`100` | Docs, Settings, Git, AI and Quality boundaries |
| Results and safety | `FR-UTIL-101`–`108` | findings/failures, stale state, scope and machine-consumable outcomes |

The decomposition plan deliberately places Maintenance last because its design must prove that residual behavior is not bypassing a stronger owner.

**DD-UTIL-001 — Stronger-owner rule**  
A behavior shall be Maintenance-owned only when its primary maintenance intent is defined by the Maintenance Functional Specification and no stronger approved domain owns that intent.

**DD-UTIL-002 — Compatibility surfaces do not transfer ownership**  
A Maintenance-labelled compatibility or convenience entry point delegating to Docs, Settings or another domain shall preserve that domain's canonical use-case semantics and shall not create a second Maintenance authority.

**DD-UTIL-003 — Shared capability evidence remains subordinate**  
Source recognition, repository facts, AI proposals, resource effects and transformation evidence shall remain subordinate until the Maintenance use case interprets them against its approved maintenance intent and the Application Engine accepts the final outcome.

---

## 4. Domain Responsibility and Authority Boundary

Maintenance owns:

- semantic identity of approved Maintenance maintenance operations;
- Maintenance-specific target eligibility within DD-1.3 managed scope;
- source-header maintenance policy above shared source capabilities;
- expected-value derivation rules that are specific to the supported header convention;
- classification of header findings for Maintenance use cases;
- field-level repair intent and preservation requirements;
- source-file version increment policy and fallback decisions;
- cleanup artefact class eligibility and operation-specific deletion policy;
- interpretation of delegated evidence against Maintenance postconditions;
- Maintenance-level no-op, partial and stale/conflict decisions.

Authority retained elsewhere includes:

| Authority | Owner | Maintenance relationship |
|---|---|---|
| invocation normalization | DD-1.1 | consume |
| canonical outcomes/effects/cancellation | DD-1.2 | contribute domain evidence |
| managed project and managed scope | DD-1.3 | consume; never rediscover authority |
| effective configuration/provenance | DD-1.4 | consume |
| final application coordination/acceptance | DD-1.5 | retained above Maintenance |
| bounded resource mechanics | DD-2.1 | delegate |
| repository facts/primitives | DD-2.3 / DD-3.2 | consume facts only for Maintenance-owned intent |
| source recognition/structural facts | DD-2.4 | consume |
| bounded source transformation | DD-2.5 | delegate mutation/validation mechanics |
| AI execution | DD-2.7 | consume optional proposal evidence |
| App clean/reset | DD-3.1 | never duplicate |
| Docs automation | DD-3.4 | delegate compatibility surface |
| Quality gates/checks | DD-4.1 / DD-2.8 | never absorb |
| Settings metadata management | DD-4.2 | delegate/consume resolved values |
| AI-domain resources | DD-4.3 | no ownership transfer |

**DD-UTIL-004 — Namespace is not authority**  
The presence of a `utils` command, legacy service, scanner, strategy or compatibility alias shall not establish semantic ownership.

**DD-UTIL-005 — Maintenance evidence does not expand intent**  
Discovery of additional defects, changed files or cleanup artefacts shall not expand the selected operation beyond its approved scope.

---

## 5. Consumed DD-1 Application Core Contracts

| DD-1 contract | Maintenance use |
|---|---|
| DD-1.1 Application Invocation | receives operation identity, explicit target/scope, mode, preview/repair intent, authorization and cancellation linkage |
| DD-1.2 Execution Outcomes | represents Maintenance findings, warnings, effects, no-op, partial, failure and cancellation beneath canonical outcomes |
| DD-1.3 Managed Project | supplies authoritative project identity, topology, targetability and upper-bound managed scope |
| DD-1.4 Configuration Resolution | supplies effective header, validation, cleanup, AI-assistance and maintenance policy where configurable |
| DD-1.5 Application Engine | coordinates use-case execution and retains final acceptance |

**DD-UTIL-006 — Managed scope is authoritative**  
Maintenance shall consume DD-1.3 managed scope and shall not infer mutation or deletion authority from current working directory, recursive discovery or repository membership alone.

**DD-UTIL-007 — Effective policy is consumed**  
Configurable maintenance behavior shall consume DD-1.4 effective configuration rather than independently applying competing environment, file or default precedence.

**DD-UTIL-008 — Canonical outcomes remain DD-1.2-owned**  
Maintenance-specific results shall refine the requested maintenance operation and affected targets without introducing a competing generic outcome envelope.

**DD-UTIL-009 — Final acceptance remains DD-1.5-owned**  
Maintenance may determine domain-level postcondition satisfaction; the Application Engine retains final application acceptance and publication.

---

## 6. Consumed DD-2 Shared Capabilities

| DD-2 capability | Maintenance use |
|---|---|
| DD-2.1 Resource Access | bounded snapshots, reads and authorized resource deletion/write mechanics where appropriate |
| DD-2.3 Repository Capability | changed-file, diff and repository identity evidence for source-file maintenance |
| DD-2.4 Source Intelligence | read-only source/header recognition, structural facts and revision evidence |
| DD-2.5 Source Transformation | bounded repair/version transformation planning, preview, stale checks, execution and source validation |
| DD-2.7 AI Capability | optional increment/revision-note or narrow metadata proposal evidence |

DD-2.8 Quality Capability may consume or coexist with Maintenance validation evidence, but Maintenance header validation does not become a generic Quality check/gate authority merely because both produce findings.

**DD-UTIL-010 — Recognition stays read-only**  
Source Intelligence facts shall not be treated as repair authorization or transformation intent.

**DD-UTIL-011 — Transformation mechanics stay delegated**  
Maintenance shall supply maintenance intent, target scope, expected postconditions and preservation constraints to DD-2.5 rather than reimplement source-edit mechanics.

**DD-UTIL-012 — Repository facts do not transfer Git authority**  
Changed-file and diff evidence may inform Maintenance eligibility/classification but shall not authorize staging, commit, push, synchronization, remote management or other Git-domain effects.

**DD-UTIL-013 — AI proposals are non-authoritative**  
AI classification, metadata or revision-note output shall remain proposal evidence subject to Maintenance policy and validation.

**DD-UTIL-014 — Capability composition preserves separate ownership**  
Combining Resource Access, Repository, Source Intelligence, Source Transformation and AI capabilities shall not create a generic Maintenance capability framework or transfer their permanent semantic ownership into Maintenance.

---

## 7. Domain Contract Model

A Maintenance operation is conceptually defined by:

```text
Maintenance maintenance intent
    + authoritative managed scope
    + effective maintenance policy
    + current target evidence
    + explicit mutation/deletion authorization where required
        -> Maintenance decision/orchestration
        -> bounded delegated capability work
        -> Maintenance postcondition interpretation
        -> DD-1 application acceptance
```

This is a semantic responsibility model, not a required implementation pipeline.

A Maintenance operation record shall distinguish at least:

- canonical operation identity from the [four-command Maintenance catalogue](../functional/utils-functional-specification-v01.md); narrow package repair is subordinate approved maintenance behavior and compatibility routes are not additional Maintenance commands;
- selected target/scope;
- read-only versus consequential intent;
- effective policy relevant to the operation;
- observed target revision/state where stale-state matters;
- findings and unsupported/ambiguous evidence;
- proposed effects where consequential;
- authorization/preview state where applicable;
- per-target delegated evidence;
- Maintenance-domain postcondition state.

**DD-UTIL-015 — Operation identity precedes mechanics**  
The maintenance operation shall be identified semantically before choosing scanners, parsers, transformation strategies or deletion primitives. Existing optional AI proposal paths remain optional; coordinated operation introduces no AI dependency.

**DD-UTIL-016 — Findings are not execution failures**  
A successfully executed validation that discovers invalid source shall distinguish those findings from inability to perform the validation.

**DD-UTIL-017 — Expected values require provenance**  
Project identity, file identity, author identity, package name, current version and other expected values shall be derived from authoritative project/configuration/domain evidence rather than invented by a scanner or transformation provider.

**DD-UTIL-018 — Per-target state remains attributable**  
Multi-target operations shall retain target identity, observed state, decision, effect and postcondition evidence sufficiently to report partial completion truthfully.

**DD-UTIL-019 — No-op is first-class**  
Already-valid headers, unchanged repairs, no eligible changed files and empty cleanup sets shall be representable as intentional no-op/unchanged outcomes rather than synthetic mutation success.

---

### 7.1 Coordinated scope and classification {#coordinated-scope}

Apply the stronger-owner gate in DD-UTIL-066 before accepting or planning Maintenance work. Supported cardinality is one resource, an explicit set, a semantic managed unit or the complete eligible managed scope. The target set is the intersection of DD-1 scope, Maintenance resource-class eligibility and operation applicability. Traversal/source discovery supplies evidence within that set.

Before mutation, classify requested resources as consequentially eligible, already satisfied/no effect, ineligible/stronger-owned, unsupported, ambiguous, protected, outside scope or stale/unresolved as applicable. Generative inference cannot turn ambiguous evidence into authority.

### 7.2 Coordinated resource plan {#coordinated-plan}

For each consequential resource, retain its stable managed identity, Maintenance class, recognized current/defect/disposable state, operation-specific proposed effect, revision preconditions, preservation/protection requirements, validation/acceptance criteria and relevant dependencies/continuation policy. Freeze the plan for the consequential stage or invalidate/re-resolve an item when authority/safety-relevant facts become stale.

## 8. Use-Case Orchestration

### 8.1 Header Inspection and Validation

The semantic flow is:

```text
resolve invocation and managed scope
    -> establish eligible supported source targets
    -> obtain fresh read-only source/header facts
    -> derive applicable expected values
    -> evaluate header convention rules
    -> classify per-file findings
    -> aggregate required validation state
    -> return Maintenance validation evidence
```

**DD-UTIL-020 — Inspection is non-mutating**  
Header check/validation shall terminate without source mutation, even when deterministic repairs are obvious.

**DD-UTIL-021 — Eligibility is operation-relative**  
Only supported managed source files within the selected scope and effective inclusion/exclusion policy shall be inspected as required targets.

**DD-UTIL-022 — Exclusions remain effective**  
Generated output, dependencies, caches, repository internals and other excluded resources shall not become Maintenance mutation candidates merely because Source Intelligence can recognize them.

**DD-UTIL-023 — Header states remain distinct**  
Missing, malformed, valid-but-inconsistent, valid, unsupported and failed-inspection states shall remain distinguishable where supported by evidence.

**DD-UTIL-024 — Creation metadata is preservation-sensitive**  
Validation may identify missing or inconsistent creation metadata, but ordinary repair shall preserve existing original creation date/time unless explicit approved policy authorizes establishing missing creation metadata.

**DD-UTIL-025 — Revision history is not disposable metadata**  
Valid existing revision-history evidence shall be preserved and interpreted according to the source-header convention rather than regenerated wholesale for convenience.

**DD-UTIL-026 — Aggregate success requires required targets to satisfy policy**  
An aggregate validation shall not report a passing Maintenance-domain state while required inspected targets retain unresolved validation failures.

**DD-UTIL-027 — Empty eligibility is distinct from validated content**  
A valid scope with no eligible source files shall remain distinguishable from successful validation of one or more files.

### 8.2 Header Repair

The semantic flow is:

```text
fresh inspection/validation
    -> identify deterministic repairable findings
    -> derive field-level intended values
    -> preserve unrelated header/source content
    -> produce bounded transformation plan
    -> preview/authorize as required
    -> revalidate freshness
    -> execute through Source Transformation
    -> validate transformed source
    -> re-evaluate header-maintenance postconditions
```

**DD-UTIL-028 — Repair follows current facts**  
Repair shall be based on a supported recognized defect in current inspection evidence and shall not perform unconditional header replacement. Each coordinated DD-2.5 plan retains its own revision, preservation and post-validation requirements; one stale/failed resource does not authorize broader rewriting.

**DD-UTIL-029 — Field-level repair is preferred**  
Where a defect is field-bounded, Maintenance shall request only the change required to satisfy that field's approved maintenance rule and preserve unrelated valid content.

**DD-UTIL-030 — Missing fields are not synthesized by implication**  
Detecting an absent semantic field shall not authorize adding it unless the applicable repair policy explicitly permits establishment of that field.

**DD-UTIL-031 — Author identity is never fabricated**  
Where author maintenance requires a resolved identity and none is authoritative, the operation shall report the limitation rather than invent an author.

**DD-UTIL-032 — Version repair follows the convention's authority relation**  
Where revision history is authoritative for declared source-file version, Maintenance may synchronize the declared version to the highest applicable recognized history version but shall not invent history events to justify a value.

**DD-UTIL-033 — Unchanged files are not rewritten**  
A repair plan shall contain no write effect for a target whose current state already satisfies the requested maintenance intent.

**DD-UTIL-034 — Source-valid is not Maintenance-accepted**
DD-2.5 source-level validation is required evidence for changed source, but Maintenance shall additionally establish that the requested header-maintenance postcondition is satisfied.

### 8.3 Narrow Package-Metadata Repair

Package metadata repair is permitted only as a bounded part of the approved Maintenance validation/maintenance use case.

**DD-UTIL-035 — Narrow exception does not transfer Settings ownership**  
Maintenance may diagnose and, under explicit repair intent, correct a deterministically derivable package naming mismatch only within the approved maintenance use case; general package/application metadata CRUD remains Settings-owned.

**DD-UTIL-036 — Deterministic derivation is preferred**  
Where the expected package name follows unambiguously from authoritative managed-project facts and approved convention, Maintenance may propose that value without AI.

**DD-UTIL-037 — Manual values remain validated**  
An interactively supplied replacement shall be validated against applicable package/maintenance constraints before transformation.

**DD-UTIL-038 — AI suggestion cannot resolve authority ambiguity**  
AI may suggest a package name or description where retained, but shall not convert an ambiguous expected identity into authoritative project truth.

**DD-UTIL-039 — AI unavailability preserves deterministic/manual paths**  
Failure or absence of optional AI assistance shall not invalidate an otherwise valid deterministic or manually supplied repair path.

### 8.4 Automatic Source-File Version Maintenance

The semantic flow is:

```text
resolve Maintenance version-maintenance intent
    -> obtain authoritative changed-file set / bounded diff evidence
    -> intersect with managed scope and eligible header-bearing source
    -> validate current source-file version/history state
    -> classify increment under effective policy
    -> optionally consume AI proposal
    -> choose accepted Major/Minor/Patch decision or safe configured fallback
    -> construct coherent version + revision-history transformation
    -> preview/authorize where required
    -> transform and validate each file
    -> aggregate per-file Maintenance acceptance
```

**DD-UTIL-040 — Changed-file set is explicit evidence**  
Auto-versioning shall operate on an established changed eligible set and shall not infer that every discovered source file requires a version increment. Coordinated policy retains each resource's recognized current version/history and proposed transition; one resource's version state is not copied as another's evidence.

**DD-UTIL-041 — Source-file version is not application version**  
The source-header version maintained here shall remain semantically distinct from Settings-managed application/package version metadata and any future release workflow.

**DD-UTIL-042 — Eligible version metadata is required**  
Auto-versioning shall not silently introduce the source-file version convention into a file that lacks the required recognized version metadata.

**DD-UTIL-043 — Increment classes remain semantic**  
Major, Minor and Patch are semantic increment classes; the design does not prescribe one parsing library, storage syntax or increment function.

**DD-UTIL-044 — AI classification is optional evidence**  
An AI-proposed increment or revision note shall be validated as bounded proposal evidence and shall not itself authorize source mutation.

**DD-UTIL-045 — Safe fallback is policy-governed**  
When usable AI classification is absent, Patch may be selected only where the effective Maintenance policy permits that safe fallback and no stronger explicit decision is required.

**DD-UTIL-046 — Invalid current versions fail safely**  
Malformed or unsupported current version/history state shall prevent blind increment of the affected file.

**DD-UTIL-047 — Version and history remain coherent**  
Where the convention requires both declared version and revision-history update, an accepted transformation shall satisfy both as one Maintenance postcondition even if the underlying edit plan contains multiple bounded edits.

**DD-UTIL-048 — Revision notes are change-relative**  
A generated or supplied revision note shall relate to the actual bounded source-file change and shall not claim unrelated project activity.

**DD-UTIL-049 — Per-file isolation is explicit**  
One file's classification or transformation failure shall not automatically cancel unrelated eligible files unless the effective operation policy explicitly selects fail-fast behavior.

### 8.5 Temporary/Test/Log Artefact Cleanup

The semantic flow is:

```text
resolve cleanup intent and managed scope
    -> load bounded cleanup class/pattern policy
    -> discover candidates read-only
    -> validate each candidate remains within scope and eligible class
    -> present/record preview evidence
    -> obtain consequential authorization
    -> delete bounded eligible targets
    -> record per-target effect evidence
    -> aggregate Maintenance cleanup acceptance
```

**DD-UTIL-050 — Cleanup is narrower than App clean/reset**  
Maintenance cleanup shall target only recognized maintenance/test/log artefact classes defined for this use case and shall not absorb App-owned build, cache, dependency clean or reset semantics.

**DD-UTIL-051 — Cleanup discovery is read-only**  
Candidate discovery shall not itself delete, truncate or modify resources. Positively classify each candidate as disposable, in scope and not protected or stronger-owned. Stabilize the planned set before deletion where practical; newly discovered candidates join only through explicit policy, never silently.

**DD-UTIL-052 — Cleanup policy is bounded**  
Configurable locations, names or patterns may refine eligible classes but shall not create unrestricted recursive-delete authority or escape DD-1.3 managed scope.

**DD-UTIL-053 — Empty cleanup is no-op**  
No eligible artefacts shall produce an already-clean/no-op interpretation without requiring destructive confirmation.

**DD-UTIL-054 — Preview precedes authorization where required**  
The operation shall expose candidate identities or sufficiently precise classes/counts before consequential deletion according to invocation policy.

**DD-UTIL-055 — Deletion authorization is explicit**  
Interactive deletion requires applicable confirmation; Headless deletion requires explicit non-interactive authorization before effects begin.

**DD-UTIL-056 — Arbitrary paths are not cleanup policy**  
Caller-supplied unrestricted paths shall not transform the bounded cleanup operation into a generic delete command.

**DD-UTIL-057 — Race-safe absence is not false failure**  
An eligible target that disappears between observation and deletion may be interpreted as already absent/no-op where other error evidence does not contradict that interpretation.

**DD-UTIL-058 — Cleanup effects remain per-target**  
Multi-target cleanup shall retain removed, already-absent, skipped, failed and indeterminate states where applicable rather than collapsing them into a single Boolean.

### 8.6 Compatibility Delegation

**DD-UTIL-059 — Auto-documentation delegates to Docs**  
A retained `utils.autoDoc`-style surface shall invoke the Docs-owned use case and return/project its semantics; Maintenance shall not independently interpret documentation success.

**DD-UTIL-060 — Contributor management delegates to Settings**  
A retained `utils.addContributor`-style surface shall invoke Settings-owned contributor semantics rather than maintaining a separate Maintenance contributor contract.

**DD-UTIL-061 — Delegation is transparent in authority terms**  
Compatibility routing may preserve user-facing discoverability, but application semantics, validation and acceptance remain with the stronger owning domain.

---

## 9. Domain State and State Transitions

Maintenance does not require one persistent global state machine. Each operation has transient domain state sufficient to preserve the distinctions required for safe maintenance.

A consequential maintenance target may progress conceptually through:

```text
scope-resolved
    -> observed
    -> classified
    -> proposed
    -> authorized
    -> effect-in-progress
    -> effect-observed
    -> postcondition-validated
    -> accepted | rejected | partial | cancelled | indeterminate
```

A read-only validation target terminates after observation/classification and aggregate interpretation.

**DD-UTIL-062 — State progression does not manufacture authority**  
Observation or classification shall not imply proposal, authorization or execution state.

**DD-UTIL-063 — Revision evidence binds consequential decisions**  
Where repair/version plans depend on observed source state, the plan shall retain sufficient revision/precondition evidence for DD-2.5 stale-state checks.

**DD-UTIL-064 — Cleanup observation and deletion remain distinct**  
A discovered cleanup candidate shall remain merely eligible evidence until deletion authorization and bounded resource execution occur.

**DD-UTIL-065 — Completed effects survive later failure**  
Per-target state shall preserve completed writes/deletions when a later target fails, is cancelled or becomes indeterminate.

---

## 10. Domain Policy and Decision Rules

**DD-UTIL-066 — Stronger ownership wins**  
Apply the [Design Maintenance boundary](../appmanager-design-specification-v01.md#_10-9-maintenance-domain) before accepting an operation or constructing its plan. App clean/reset/prepare, Nuxt cleanup/upgrade, Git, Docs, Quality, Settings and AI intents remain with those owners. A bounded header/source-version/disposable-resource operation is not a route to generic editing, deletion or process execution.

**DD-UTIL-067 — Physical resemblance is insufficient eligibility**  
A file that looks like source, a directory that looks temporary or metadata that resembles a known field shall not become an eligible Maintenance target without applicable scope/classification policy.

**DD-UTIL-068 — Unsupported and ambiguous remain explicit**  
Unsupported source or ambiguous expected values shall be reported rather than rewritten under guessed semantics.

**DD-UTIL-069 — Validation policy is distinct from Quality gating**  
Maintenance may determine whether its own maintenance postconditions pass, but it shall not infer project-wide quality-gate success from header validation.

**DD-UTIL-070 — Settings identity scopes remain distinct**  
Where Maintenance consumes resolved operator/author identity, it shall preserve the distinction between AppManager operator identity and managed-project author/contributor metadata.

**DD-UTIL-071 — Warnings require explicit interpretation**  
A warning shall not silently become pass/fail policy unless the specific Maintenance use case or effective configuration defines that interpretation.

**DD-UTIL-072 — No hidden retry policy**  
A delegated source, resource, repository or AI failure shall not authorize unbounded retries, fallback or broader mutation absent explicit effective policy.

---

## 11. Safety, Mutation, and Authorization

The required distinction is:

```text
recognition
    != selection
    != maintenance intent
    != authorization
    != delegated execution
    != technical success
    != Maintenance acceptance
    != application success
```

**DD-UTIL-073 — Read-only means non-mutating**  
Inspect, check and validate-only operations shall not mutate project resources.

**DD-UTIL-074 — Mutation intent is explicit**  
Repair, version update, package repair and cleanup deletion shall require explicit requested/authorized consequential intent.

**DD-UTIL-075 — Mutation remains target-bounded**  
An authorized effect shall be restricted to targets and fields/resources necessary for the approved maintenance intent.

**DD-UTIL-076 — Preview does not authorize execution**  
Producing a valid transformation/deletion preview establishes proposed effects only; authorization remains separately required where policy demands it.

**DD-UTIL-077 — Stale source is revalidated**  
Detectable material change between source observation/planning and mutation shall trigger revalidation, replanning or safe refusal rather than silent overwrite.

**DD-UTIL-078 — Cleanup scope cannot be configured away**  
No cleanup pattern, alias or caller option may authorize deletion outside the managed scope and fixed safety boundary of the cleanup use case.

**DD-UTIL-079 — Generated suggestions are inert**  
AI-proposed names, versions, notes, paths or commands shall remain data until the owning Maintenance decision validates and separately authorizes any consequential effect.

---

## 12. Failure, Cancellation, and Partial Effects

**DD-UTIL-080 — Failure stage remains attributable**  
Results shall distinguish scope/target resolution failure, unsupported source, validation finding, recognition failure, transformation failure, AI/provider failure, resource deletion failure, authorization failure and Maintenance/application rejection where applicable.

**DD-UTIL-081 — Partial completion is first-class**  
Multi-file repair, auto-version and cleanup operations shall report partial completion when some target effects complete and others do not.

**DD-UTIL-082 — No universal rollback claim**  
Maintenance shall not claim rollback of completed source changes, provider requests or resource deletions unless the delegated mechanism actually provides and confirms it.

**DD-UTIL-083 — Cancellation stops future effects**  
Cancellation shall propagate through active delegated work where supported and prevent unstarted effects as soon as safely practical.

**DD-UTIL-084 — Cancellation preserves completed effects**  
Already completed writes/deletions remain explicit effects after cancellation and shall not be reported as though they never occurred.

**DD-UTIL-085 — Indeterminate effects remain indeterminate**  
If interruption or provider/resource failure leaves completion uncertain, Maintenance shall require verification or preserve uncertainty rather than guess success/failure.

**DD-UTIL-086 — Continuation policy is explicit**  
Independent later resources may continue after failure, refusal or indeterminate state only if resolved Maintenance policy permits and dependencies do not block them. Check cancellation before each new consequential resource effect and at other safe boundaries. Retain per-resource planned disposition, effect evidence, validation/acceptance and diagnostics under DD-UTIL-018; the shared effect rules remain in DD-1.2.

---

## 13. Headless and Interaction Independence

**DD-UTIL-087 — Semantic contract is adapter-independent**  
TUI, Headless and future adapters expressing equivalent Maintenance intent, scope, policy and authorization shall reach materially equivalent domain decisions.

**DD-UTIL-088 — Headless never prompts**  
Headless operation shall fail safely or return non-mutating diagnostic evidence when required target, repair policy, authorization or ambiguity resolution is absent.

**DD-UTIL-089 — Interactive choices are presentation**  
Menus for repair fields, package values, increment choices or cleanup confirmation shall project semantic choices already defined by the domain contract and shall not create TUI-only semantics.

**DD-UTIL-090 — Machine-facing results are structured**  
Headless callers shall determine operation state, findings and affected targets without parsing logs, provider prose or human-formatted summaries.

---

## 14. Concurrency, Idempotency, and Conflict Behaviour

**DD-UTIL-091 — Freshness is checked at consequential boundaries**  
Source/resource preconditions that can become stale shall be revalidated immediately before consequential execution where supported.

**DD-UTIL-092 — Already-satisfied maintenance converges**  
Repeating a repair against an already-correct target or cleanup against an already-absent eligible artefact should converge to no-op/unchanged semantics rather than manufacture new effects.

**DD-UTIL-093 — Auto-version is not blindly idempotent**  
Source-file version maintenance shall not increment a file merely because the same command is repeated; a new increment requires applicable changed-file/change evidence under the effective policy.

**DD-UTIL-094 — Concurrent changes are not silently overwritten**  
Detectable concurrent source/resource changes shall be surfaced and deliberately handled rather than overwritten through stale assumptions.

**DD-UTIL-095 — Multi-target ordering is not transactionality**  
Deterministic or configured execution ordering does not imply all-or-nothing atomicity across independent files/resources.

---

## 15. Security and Sensitive Information

**DD-UTIL-096 — Content access is minimized**  
Inspection, diagnostics and optional AI context shall use only content required for the requested maintenance decision.

**DD-UTIL-097 — Sensitive values are not diagnostic payloads**  
Known credentials, protected environment values and unrelated sensitive source content shall not be exposed merely because Maintenance scans or validates nearby resources.

**DD-UTIL-098 — AI disclosure follows DD-2.7 policy**  
Source/diff/header content supplied for optional AI classification shall satisfy the same managed-scope, minimization, trust and external-disclosure constraints as any other DD-2.7 request.

**DD-UTIL-099 — Project content is untrusted data**  
Instructions embedded in source comments, logs, temporary files or revision notes shall not redefine Maintenance scope, authorization, provider policy or application behavior.

**DD-UTIL-100 — Cleanup paths are safety-sensitive**  
Symlinks, indirection, path normalization or equivalent resource mechanisms shall not be permitted to escape the authorized cleanup boundary.

---

## 16. Extensibility and Replaceability

**DD-UTIL-101 — New utilities require ownership proof**  
A future operation shall not be added to Maintenance merely because it is cross-cutting or convenient; its primary intent and absence of a stronger owner shall be established first.

**DD-UTIL-102 — Source/provider replaceability is preserved**  
Maintenance contracts shall not require one scanner, parser, AST/CST, regex strategy, Git provider, AI provider, transformation engine or filesystem implementation.

**DD-UTIL-103 — Header convention is semantic, not parser topology**  
Stable semantic header fields/rules may be refined without making one comment syntax or parser representation the universal application contract unless separately approved.

**DD-UTIL-104 — No generic maintenance framework by naming similarity**  
Header repair, auto-version and cleanup shall not be collapsed into a generic `UtilityAction`/plugin framework merely because they share target/effect/result shapes.

**DD-UTIL-105 — Implementation topology remains open**  
This design does not require one service, class hierarchy, package, process, executable, plugin protocol or source-tree layout.

---

## 17. Testability and Conformance Requirements

Core Maintenance policy shall be testable with deterministic substitutes for Resource Access, Repository Capability, Source Intelligence, Source Transformation and AI Capability.

Tests shall cover at least:

- stronger-owner rejection/delegation;
- valid, missing, malformed, inconsistent, unsupported and failed header inspection;
- no eligible source files;
- project/file/author/version expected-value resolution and ambiguity;
- read-only validation with findings and no mutation;
- field-level repair and preservation of unrelated content;
- missing-author refusal;
- no history invention;
- no-op repair without rewrite;
- stale-source refusal/replan;
- deterministic and manual package repair;
- optional AI unavailable/invalid/non-authoritative;
- changed-file eligibility for auto-version;
- Major/Minor/Patch decisions and policy-governed Patch fallback;
- invalid current version;
- coherent version/history update;
- per-file partial auto-version outcome;
- empty cleanup;
- bounded cleanup discovery/preview/authorization;
- arbitrary-path rejection and scope escape prevention;
- cleanup race-to-absence;
- partial cleanup;
- cancellation after completed effects;
- Headless ambiguity/authorization failure;
- compatibility delegation preserving Docs/Settings semantics;
- provider substitution behind shared capability contracts.

**DD-UTIL-106 — Domain policy is independently testable**  
Maintenance acceptance, eligibility, stronger-owner and continuation decisions shall be testable without requiring live Git hosts, AI providers or implementation-specific source services.

**DD-UTIL-107 — Capability tests do not redefine Maintenance semantics**
Scanner, parser, Git, AI, transformation and filesystem integration tests may verify adapters/providers but shall not substitute for Maintenance-domain conformance tests.

**DD-UTIL-108 — Ownership-boundary tests are mandatory design evidence**  
Conformance testing shall include negative cases proving that Docs automation, contributor CRUD, Git workflow effects, App clean/reset, Quality gates and generic metadata management are not silently reintroduced as Maintenance authority.

---

## 18. Traceability

### 18.1 Functional traceability

| Detailed Design contracts | Functional requirements |
|---|---|
| `DD-UTIL-001`–`005`, `066`, `101`, `104` | `FR-UTIL-001`–`009` |
| `DD-UTIL-006`–`019`, `073`–`086`, `087`–`100` | `FR-UTIL-010`–`023` |
| `DD-UTIL-010`, `017`, `021`–`025`, `067`–`068` | `FR-UTIL-024`–`031` |
| `DD-UTIL-016`–`027`, `069`–`071` | `FR-UTIL-032`–`044` |
| `DD-UTIL-028`–`034`, `073`–`077`, `091`–`095` | `FR-UTIL-045`–`058` |
| `DD-UTIL-035`–`039`, `070`, `079` | `FR-UTIL-059`–`065` |
| `DD-UTIL-012`–`013`, `040`–`049`, `093`, `098` | `FR-UTIL-066`–`081` |
| `DD-UTIL-050`–`058`, `064`, `078`, `092`, `100` | `FR-UTIL-082`–`094` |
| `DD-UTIL-002`, `012`–`014`, `059`–`061`, `066`, `069`–`070`, `098` | `FR-UTIL-095`–`100` |
| `DD-UTIL-016`, `018`, `080`–`095` | `FR-UTIL-101`–`108` |

### 18.2 Cross-authority traceability

| Authority | Principal Maintenance contracts |
|---|---|
| DD-1.1 Application Invocation | `DD-UTIL-006`, `073`–`076`, `087`–`090` |
| DD-1.2 Execution Outcomes | `DD-UTIL-008`, `016`, `018`–`019`, `080`–`086` |
| DD-1.3 Managed Project | `DD-UTIL-006`, `021`–`022`, `040`, `052`, `075`, `078`, `100` |
| DD-1.4 Configuration Resolution | `DD-UTIL-007`, `021`–`022`, `045`, `052`, `071`–`072` |
| DD-1.5 Application Engine | `DD-UTIL-003`, `009` |
| DD-2.1 Resource Access | `DD-UTIL-014`, `050`–`058`, `085`, `091`–`092`, `100` |
| DD-2.3 Repository Capability / DD-3.2 Git | `DD-UTIL-012`, `040`, `093` |
| DD-2.4 Source Intelligence | `DD-UTIL-010`, `020`–`028` |
| DD-2.5 Source Transformation | `DD-UTIL-011`, `028`–`034`, `040`–`049`, `077`, `091`–`095` |
| DD-2.7 AI Capability | `DD-UTIL-013`, `038`–`045`, `079`, `098` |
| DD-3.1 App Domain | `DD-UTIL-050`, `066`, `108` |
| DD-3.4 Docs Domain | `DD-UTIL-002`, `059`, `061`, `066`, `108` |
| DD-4.1 Quality Domain | `DD-UTIL-069`, `108` |
| DD-4.2 Settings Domain | `DD-UTIL-002`, `035`, `060`, `070`, `108` |
| DD-4.3 AI Domain | `DD-UTIL-013`, `079`; AI assistance remains Maintenance-owned when Maintenance intent is primary |

---

## 19. Conformance Invariants

A conforming DD-4.4 implementation shall preserve all of the following:

1. **Maintenance is not a catch-all.** A stronger approved domain owner always prevails over namespace or implementation convenience.
2. **Application authority remains DD-1-owned.** Maintenance does not own managed-project scope, effective-configuration resolution, canonical outcomes or final Application Engine acceptance.
3. **Recognition is not repair authority.** Source/header facts remain evidence until explicit Maintenance maintenance intent and authorization establish a bounded transformation.
4. **Source mutation remains DD-2.5-owned mechanically.** Maintenance owns maintenance intent/postconditions, not generic edit planning/execution internals.
5. **Repository evidence does not transfer Git authority.** Changed-file/diff facts may inform maintenance without granting commit, synchronization, push or remote semantics.
6. **AI remains advisory.** AI classification or generated notes/names are proposals; provider success does not establish Maintenance success or mutation authority.
7. **Source-file version is not application/release version.** The two semantic scopes shall not be collapsed.
8. **Cleanup is bounded and narrower than App clean/reset.** Discovery does not authorize deletion and configurable patterns cannot escape managed scope.
9. **Compatibility delegation preserves the stronger owner.** Docs automation and contributor management do not become independent Maintenance semantics.
10. **Partial and stale effects are truthful.** Completed effects, conflicts, cancellation and indeterminate state are not hidden behind false rollback or aggregate success.
11. **Interactive and Headless semantics are equivalent.** Headless ambiguity or missing authorization fails safely rather than guessing.
12. **Provider and implementation topology remain replaceable.** Current scanners, strategies, services, regexes, file APIs, Git/AI providers and TypeScript layout do not define permanent architecture.

The central conformance rule is:

> **A utility exists because its maintenance intent is genuinely cross-cutting and otherwise unowned—not because no stronger owner was consulted. Inspection does not authorize repair, discovery does not authorize deletion, and delegated intelligence does not authorize application effects.**
