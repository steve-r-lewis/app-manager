# DD-4.4 — AppManager Maintenance Domain Detailed Design

> **Detailed Design ID:** DD-4.4
>
> **Design family:** DD-4 — Policy and Resource Domains
>
> **Status:** Version 1 Detailed Design Specification
>
> **Detailed Design authority:** This document defines the permanent Maintenance-domain orchestration, maintenance-policy, state, decision and result contracts for bounded cross-cutting project maintenance through approved DD-1 Application Core and DD-2 Shared Capability contracts. It refines, but does not override, the root Design Specification, Functional Specifications, accepted ADRs within their scope, or consumed DD-1/DD-2 and stronger owning-domain contracts.
>
> **Sources and navigation:** [Project Documentation Guide](../project-documentation-guide-v01.md), [AppManager Design Specification](../appmanager-design-specification-v01.md), [Maintenance Functional Specification](../functional/utils-functional-specification-v01.md), [Detailed Design Register](../project_management/detailed-design-register-v01.md), [Domain Detailed Design Authoring Guide](../project_management/domain-detailed-design-authoring-guide-v02.md), [ADR-0001 — Primary Application Runtime](../project_management/decisions/adr-0001-primary-application-runtime.md)
>
> **Related Detailed Design authorities:** [DD-1.1 — Application Invocation](../dd_1_application_core/dd-1-1-application-invocation-detailed-design-v01.md), [DD-1.2 — Execution Outcomes](../dd_1_application_core/dd-1-2-execution-outcomes-detailed-design-v01.md), [DD-1.3 — Managed Project](../dd_1_application_core/dd-1-3-managed-project-detailed-design-v01.md), [DD-1.4 — Configuration Resolution](../dd_1_application_core/dd-1-4-configuration-resolution-detailed-design-v01.md), [DD-1.5 — Application Engine](../dd_1_application_core/dd-1-5-application-engine-detailed-design-v01.md), [DD-2.1 — Resource Access](../dd_2_shared_capabilities/dd-2-1-resource-access-detailed-design-v01.md), [DD-2.3 — Repository Capability](../dd_2_shared_capabilities/dd-2-3-repository-capability-detailed-design-v01.md), [DD-2.4 — Source Intelligence](../dd_2_shared_capabilities/dd-2-4-source-intelligence-detailed-design-v01.md), [DD-2.5 — Source Transformation](../dd_2_shared_capabilities/dd-2-5-source-transformation-detailed-design-v01.md), [DD-2.7 — AI Capability](../dd_2_shared_capabilities/dd-2-7-ai-capability-detailed-design-v01.md), [DD-3.1 — App Domain](../dd_3_high_coupling_domains/dd-3-1-app-domain-detailed-design-v01.md), [DD-3.2 — Git Domain](../dd_3_high_coupling_domains/dd-3-2-git-domain-detailed-design-v01.md), [DD-3.4 — Docs Domain](../dd_3_high_coupling_domains/dd-3-4-docs-domain-detailed-design-v01.md), [DD-4.1 — Quality Domain](dd-4-1-quality-domain-detailed-design-v01.md), [DD-4.2 — Settings Domain](dd-4-2-settings-domain-detailed-design-v01.md), [DD-4.3 — AI Domain](dd-4-3-ai-domain-detailed-design-v01.md)

---

## 1. Purpose

This specification refines [Maintenance Functional contracts](../functional/utils-functional-specification-v01.md) for bounded cross-cutting maintenance. Its header inspection, repair, source-file version and cleanup plans begin at the [stronger-owner gate](#dd-util-066). Documentation and contributor compatibility paths lead to their owning domains. The per-resource plan and lifecycle retain the information needed to report coordinated effects truthfully.

The collaboration in §§5–6 applies [Design §6.2](../appmanager-design-specification-v01.md#_6-2-application-engine-authority) and [§6.6](../appmanager-design-specification-v01.md#_6-6-capability-boundaries-and-providers) to the domain’s context, specialist delegation and final acceptance.

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

<a id="dd-util-001"></a>

**DD-UTIL-001 — Stronger-owner rule**

Maintenance placement follows [Design](../appmanager-design-specification-v01.md#_10-9-maintenance-domain) through the pre-planning gate in [DD-UTIL-066](#dd-util-066).

<a id="dd-util-002"></a>

**DD-UTIL-002 — Compatibility surfaces do not transfer ownership**

Compatibility/convenience routing applies [FR-UTIL-005](../functional/utils-functional-specification-v01.md#fr-util-005).

<a id="dd-util-003"></a>

**DD-UTIL-003 — Shared capability evidence remains subordinate**

Maintenance evidence interpretation follows [Design](../appmanager-design-specification-v01.md#_11-11-workflow-results-failure-and-acceptance) against the approved maintenance intent.


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

<a id="dd-util-004"></a>

**DD-UTIL-004 — Namespace is not authority**

Legacy `utils` names, services, scanners and strategies are evaluated under [Design](../appmanager-design-specification-v01.md#_10-9-maintenance-domain).

<a id="dd-util-005"></a>

**DD-UTIL-005 — Maintenance evidence does not expand intent**

Newly discovered defects/files/artefacts remain subject to [FR-PROJ-042](../functional/managed-project-functional-specification-v01.md#fr-proj-042).


---

## 5. Consumed DD-1 Application Core Contracts

| DD-1 contract | Maintenance use |
|---|---|
| DD-1.1 Application Invocation | receives operation identity, explicit target/scope, mode, preview/repair intent, authorization and cancellation linkage |
| DD-1.2 Execution Outcomes | represents Maintenance findings, warnings, effects, no-op, partial, failure and cancellation beneath canonical outcomes |
| DD-1.3 Managed Project | supplies authoritative project identity, topology, targetability and upper-bound managed scope |
| DD-1.4 Configuration Resolution | supplies effective header, validation, cleanup, AI-assistance and maintenance policy where configurable |
| DD-1.5 Application Engine | coordinates use-case execution and retains final acceptance |

<a id="dd-util-006"></a>

**DD-UTIL-006 — Managed scope is authoritative**

Maintenance context/targets bind [Design](../appmanager-design-specification-v01.md#_9-6-project-discovery-and-context-resolution) and [Design](../appmanager-design-specification-v01.md#_9-7-managed-scope-and-operation-targeting) to DD-1.3.

<a id="dd-util-007"></a>

**DD-UTIL-007 — Effective policy is consumed**

Maintenance policy consumes [DD-1.4 resolution results](../dd_1_application_core/dd-1-4-configuration-resolution-detailed-design-v01.md#_15-resolution-result).

<a id="dd-util-008"></a>

**DD-UTIL-008 — Canonical outcomes remain DD-1.2-owned**

Maintenance operation/target evidence composes [DD-1.2 outcomes](../dd_1_application_core/dd-1-2-execution-outcomes-detailed-design-v01.md#_7-outcome-contract).

<a id="dd-util-009"></a>

**DD-UTIL-009 — Final acceptance remains DD-1.5-owned**

Maintenance postcondition interpretation returns to [Design](../appmanager-design-specification-v01.md#_6-2-application-engine-authority) for final acceptance/publication.


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

<a id="dd-util-010"></a>

**DD-UTIL-010 — Recognition stays read-only**

DD-2.4 facts are consumed under [Design](../appmanager-design-specification-v01.md#_9-9-non-destructive-ownership-and-unmanaged-content).

<a id="dd-util-011"></a>

**DD-UTIL-011 — Transformation mechanics stay delegated**

Maintenance intent/postconditions/preservation constraints bind [FR-XFORM-033](../functional/source-transformation-functional-specification-v01.md#fr-xform-033) to DD-2.5.

<a id="dd-util-012"></a>

**DD-UTIL-012 — Repository facts do not transfer Git authority**

Repository change/diff evidence follows [FR-UTIL-069](../functional/utils-functional-specification-v01.md#fr-util-069) and [FR-UTIL-097](../functional/utils-functional-specification-v01.md#fr-util-097).

<a id="dd-util-013"></a>

**DD-UTIL-013 — AI proposals are non-authoritative**

AI classification/metadata/revision-note proposals follow [Design](../appmanager-design-specification-v01.md#_11-10-ai-assisted-workflow).

<a id="dd-util-014"></a>

**DD-UTIL-014 — Capability composition preserves separate ownership**

The §6 collaborations apply [Design](../appmanager-design-specification-v01.md#_6-6-capability-boundaries-and-providers); their shared mechanics do not establish a Maintenance framework.


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

<a id="dd-util-015"></a>

**DD-UTIL-015 — Operation identity precedes mechanics**  
The maintenance operation shall be identified semantically before choosing scanners, parsers, transformation strategies or deletion primitives. Existing optional AI proposal paths remain optional; coordinated operation introduces no AI dependency.

<a id="dd-util-016"></a>

**DD-UTIL-016 — Findings are not execution failures**

Validation findings apply [FR-UTIL-102](../functional/utils-functional-specification-v01.md#fr-util-102).

<a id="dd-util-017"></a>

**DD-UTIL-017 — Expected values require provenance**  
Project identity, file identity, author identity, package name, current version and other expected values shall be derived from authoritative project/configuration/domain evidence rather than invented by a scanner or transformation provider.

<a id="dd-util-018"></a>

**DD-UTIL-018 — Per-target state remains attributable**

Per-resource results bind [PBC-FR-MAINT-COORD-005](../functional/utils-functional-specification-v01.md#pbc-fr-maint-coord-005) and [PBC-FR-MAINT-COORD-024](../functional/utils-functional-specification-v01.md#pbc-fr-maint-coord-024), retaining observed state, decision and postcondition evidence alongside the attributed effects.

<a id="dd-util-019"></a>

**DD-UTIL-019 — No-op is first-class**

No-op interpretation binds [FR-UTIL-055](../functional/utils-functional-specification-v01.md#fr-util-055), [FR-UTIL-037](../functional/utils-functional-specification-v01.md#fr-util-037) and [FR-UTIL-087](../functional/utils-functional-specification-v01.md#fr-util-087) to the local result model, including unchanged repair and no eligible changed files.


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

<a id="dd-util-020"></a>

**DD-UTIL-020 — Inspection is non-mutating**

Header checking/validation follows [FR-UTIL-014](../functional/utils-functional-specification-v01.md#fr-util-014) even when a repair is obvious.

<a id="dd-util-021"></a>

**DD-UTIL-021 — Eligibility is operation-relative**

Required inspection targets follow [FR-UTIL-025](../functional/utils-functional-specification-v01.md#fr-util-025).

<a id="dd-util-022"></a>

**DD-UTIL-022 — Exclusions remain effective**

Recognized source candidates retain the exclusions in [FR-PROJ-047](../functional/managed-project-functional-specification-v01.md#fr-proj-047).

<a id="dd-util-023"></a>

**DD-UTIL-023 — Header states remain distinct**

Header state interpretation follows [FR-UTIL-035](../functional/utils-functional-specification-v01.md#fr-util-035).

<a id="dd-util-024"></a>

**DD-UTIL-024 — Creation metadata is preservation-sensitive**

Creation metadata follows [FR-UTIL-030](../functional/utils-functional-specification-v01.md#fr-util-030).

<a id="dd-util-025"></a>

**DD-UTIL-025 — Revision history is not disposable metadata**

Revision-history preservation follows [FR-UTIL-031](../functional/utils-functional-specification-v01.md#fr-util-031).

<a id="dd-util-026"></a>

**DD-UTIL-026 — Aggregate success requires required targets to satisfy policy**

Aggregate validation follows [FR-UTIL-036](../functional/utils-functional-specification-v01.md#fr-util-036).

<a id="dd-util-027"></a>

**DD-UTIL-027 — Empty eligibility is distinct from validated content**

Empty eligibility follows [FR-UTIL-037](../functional/utils-functional-specification-v01.md#fr-util-037).

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

<a id="dd-util-028"></a>

**DD-UTIL-028 — Repair follows current facts**

Current-defect repair follows [FR-UTIL-045](../functional/utils-functional-specification-v01.md#fr-util-045) and [FR-UTIL-046](../functional/utils-functional-specification-v01.md#fr-util-046). Each coordinated DD-2.5 plan binds [PBC-FR-MAINT-COORD-008](../functional/utils-functional-specification-v01.md#pbc-fr-maint-coord-008), [FR-XFORM-068](../functional/source-transformation-functional-specification-v01.md#fr-xform-068) and [FR-XFORM-048](../functional/source-transformation-functional-specification-v01.md#fr-xform-048) to its own revision, preservation and post-validation evidence; one stale/failed resource does not authorize broader rewriting.

<a id="dd-util-029"></a>

**DD-UTIL-029 — Field-level repair is preferred**

Field-bounded repair follows [FR-UTIL-047](../functional/utils-functional-specification-v01.md#fr-util-047).

<a id="dd-util-030"></a>

**DD-UTIL-030 — Missing fields are not synthesized by implication**

Absent-field establishment follows [FR-UTIL-049](../functional/utils-functional-specification-v01.md#fr-util-049).

<a id="dd-util-031"></a>

**DD-UTIL-031 — Author identity is never fabricated**

Author repair follows [FR-UTIL-052](../functional/utils-functional-specification-v01.md#fr-util-052).

<a id="dd-util-032"></a>

**DD-UTIL-032 — Version repair follows the convention's authority relation**

Declared source-version repair follows [FR-UTIL-053](../functional/utils-functional-specification-v01.md#fr-util-053) and [FR-UTIL-054](../functional/utils-functional-specification-v01.md#fr-util-054).

<a id="dd-util-033"></a>

**DD-UTIL-033 — Unchanged files are not rewritten**

Satisfied repair targets follow [FR-UTIL-055](../functional/utils-functional-specification-v01.md#fr-util-055).

<a id="dd-util-034"></a>

**DD-UTIL-034 — Source-valid is not Maintenance-accepted**

Changed source supplies [FR-XFORM-048](../functional/source-transformation-functional-specification-v01.md#fr-xform-048) evidence, then satisfies the Maintenance postcondition in [FR-UTIL-057](../functional/utils-functional-specification-v01.md#fr-util-057).

### 8.3 Narrow Package-Metadata Repair

Package metadata repair is permitted only as a bounded part of the approved Maintenance validation/maintenance use case.

<a id="dd-util-035"></a>

**DD-UTIL-035 — Narrow exception does not transfer Settings ownership**

The narrow package-name repair path applies [FR-UTIL-042](../functional/utils-functional-specification-v01.md#fr-util-042) and [FR-UTIL-065](../functional/utils-functional-specification-v01.md#fr-util-065).

<a id="dd-util-036"></a>

**DD-UTIL-036 — Deterministic derivation is preferred**

Deterministic package repair follows [FR-UTIL-060](../functional/utils-functional-specification-v01.md#fr-util-060).

<a id="dd-util-037"></a>

**DD-UTIL-037 — Manual values remain validated**

Manual package replacement follows [FR-UTIL-061](../functional/utils-functional-specification-v01.md#fr-util-061) before transformation.

<a id="dd-util-038"></a>

**DD-UTIL-038 — AI suggestion cannot resolve authority ambiguity**

AI package proposals apply [FR-UTIL-062](../functional/utils-functional-specification-v01.md#fr-util-062), [FR-UTIL-044](../functional/utils-functional-specification-v01.md#fr-util-044) and [Design](../appmanager-design-specification-v01.md#_11-10-ai-assisted-workflow).

<a id="dd-util-039"></a>

**DD-UTIL-039 — AI unavailability preserves deterministic/manual paths**

Optional AI availability follows [FR-UTIL-063](../functional/utils-functional-specification-v01.md#fr-util-063).

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

<a id="dd-util-040"></a>

**DD-UTIL-040 — Changed-file set is explicit evidence**

The changed eligible set follows [FR-UTIL-068](../functional/utils-functional-specification-v01.md#fr-util-068). Coordinated plans bind [PBC-FR-MAINT-COORD-008](../functional/utils-functional-specification-v01.md#pbc-fr-maint-coord-008) to each resource's recognized current version/history and proposed transition; one resource's version state is not another's evidence.

<a id="dd-util-041"></a>

**DD-UTIL-041 — Source-file version is not application version**

Source-file version identity follows [FR-UTIL-067](../functional/utils-functional-specification-v01.md#fr-util-067).

<a id="dd-util-042"></a>

**DD-UTIL-042 — Eligible version metadata is required**

Missing required version metadata follows [FR-UTIL-070](../functional/utils-functional-specification-v01.md#fr-util-070).

<a id="dd-util-043"></a>

**DD-UTIL-043 — Increment classes remain semantic**

Increment classes follow [FR-UTIL-072](../functional/utils-functional-specification-v01.md#fr-util-072). Parsing library, storage syntax and increment implementation remain below this semantic contract.

<a id="dd-util-044"></a>

**DD-UTIL-044 — AI classification is optional evidence**

Increment/revision-note proposals apply [FR-UTIL-073](../functional/utils-functional-specification-v01.md#fr-util-073) and [Design](../appmanager-design-specification-v01.md#_11-10-ai-assisted-workflow).

<a id="dd-util-045"></a>

**DD-UTIL-045 — Safe fallback is policy-governed**

Patch fallback follows [FR-UTIL-075](../functional/utils-functional-specification-v01.md#fr-util-075).

<a id="dd-util-046"></a>

**DD-UTIL-046 — Invalid current versions fail safely**

Invalid current version follows [FR-UTIL-076](../functional/utils-functional-specification-v01.md#fr-util-076). Unsupported/malformed history required by the convention shall likewise prevent blind increment.

<a id="dd-util-047"></a>

**DD-UTIL-047 — Version and history remain coherent**

Version/history acceptance follows [FR-UTIL-077](../functional/utils-functional-specification-v01.md#fr-util-077) as one Maintenance postcondition even when DD-2.5 uses multiple bounded edits.

<a id="dd-util-048"></a>

**DD-UTIL-048 — Revision notes are change-relative**

Revision-note scope follows [FR-UTIL-078](../functional/utils-functional-specification-v01.md#fr-util-078).

<a id="dd-util-049"></a>

**DD-UTIL-049 — Per-file isolation is explicit**

Per-file continuation follows [FR-UTIL-079](../functional/utils-functional-specification-v01.md#fr-util-079).

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

<a id="dd-util-050"></a>

**DD-UTIL-050 — Cleanup is narrower than App clean/reset**

Cleanup eligibility follows [FR-UTIL-082](../functional/utils-functional-specification-v01.md#fr-util-082) and [FR-UTIL-083](../functional/utils-functional-specification-v01.md#fr-util-083).

<a id="dd-util-051"></a>

**DD-UTIL-051 — Cleanup discovery is read-only**

Discovery follows [FR-UTIL-086](../functional/utils-functional-specification-v01.md#fr-util-086). Candidate classification binds [PBC-FR-MAINT-COORD-021](../functional/utils-functional-specification-v01.md#pbc-fr-maint-coord-021) and [FR-UTIL-083](../functional/utils-functional-specification-v01.md#fr-util-083) to the planned set; stabilization follows [PBC-FR-MAINT-COORD-023](../functional/utils-functional-specification-v01.md#pbc-fr-maint-coord-023). New candidates may join only through explicit policy.

<a id="dd-util-052"></a>

**DD-UTIL-052 — Cleanup policy is bounded**

Configurable cleanup policy follows [FR-UTIL-084](../functional/utils-functional-specification-v01.md#fr-util-084) and [FR-UTIL-094](../functional/utils-functional-specification-v01.md#fr-util-094).

<a id="dd-util-053"></a>

**DD-UTIL-053 — Empty cleanup is no-op**

Empty cleanup follows [FR-UTIL-087](../functional/utils-functional-specification-v01.md#fr-util-087).

<a id="dd-util-054"></a>

**DD-UTIL-054 — Preview precedes authorization where required**

Deletion preview follows [FR-UTIL-088](../functional/utils-functional-specification-v01.md#fr-util-088).

<a id="dd-util-055"></a>

**DD-UTIL-055 — Deletion authorization is explicit**

Cleanup deletion follows [FR-INV-023](../functional/application-invocation-functional-specification-v01.md#fr-inv-023) and [FR-INV-022](../functional/application-invocation-functional-specification-v01.md#fr-inv-022).

<a id="dd-util-056"></a>

**DD-UTIL-056 — Arbitrary paths are not cleanup policy**

Cleanup selectors follow [PBC-FR-MAINT-003](../functional/utils-functional-specification-v01.md#pbc-fr-maint-003).

<a id="dd-util-057"></a>

**DD-UTIL-057 — Race-safe absence is not false failure**

Race-safe absence follows [FR-UTIL-092](../functional/utils-functional-specification-v01.md#fr-util-092).

<a id="dd-util-058"></a>

**DD-UTIL-058 — Cleanup effects remain per-target**

Cleanup result states apply [FR-UTIL-091](../functional/utils-functional-specification-v01.md#fr-util-091); uncertainty follows [DD-UTIL-085](#dd-util-085).

### 8.6 Compatibility Delegation

<a id="dd-util-059"></a>

**DD-UTIL-059 — Auto-documentation delegates to Docs**

A retained `utils.autoDoc` alias routes directly to [FR-DOCS-100](../functional/docs-functional-specification-v01.md#fr-docs-100) under [FR-UTIL-005](../functional/utils-functional-specification-v01.md#fr-util-005).

<a id="dd-util-060"></a>

**DD-UTIL-060 — Contributor management delegates to Settings**

A retained `utils.addContributor` alias routes directly to [FR-SET-072](../functional/settings-functional-specification-v01.md#fr-set-072) under [FR-UTIL-005](../functional/utils-functional-specification-v01.md#fr-util-005).

<a id="dd-util-061"></a>

**DD-UTIL-061 — Delegation is transparent in authority terms**

Compatibility discoverability follows [FR-UTIL-005](../functional/utils-functional-specification-v01.md#fr-util-005).


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

<a id="dd-util-062"></a>

**DD-UTIL-062 — State progression does not manufacture authority**  
Observation or classification shall not imply proposal, authorization or execution state.

<a id="dd-util-063"></a>

**DD-UTIL-063 — Revision evidence binds consequential decisions**  
Where repair/version plans depend on observed source state, the plan shall retain sufficient revision/precondition evidence for DD-2.5 stale-state checks.

<a id="dd-util-064"></a>

**DD-UTIL-064 — Cleanup observation and deletion remain distinct**

Observed candidates follow [Design](../appmanager-design-specification-v01.md#_9-9-non-destructive-ownership-and-unmanaged-content) until the cleanup authorization and resource-execution stages.

<a id="dd-util-065"></a>

**DD-UTIL-065 — Completed effects survive later failure**

Per-target completed effects follow [FR-INV-045](../functional/application-invocation-functional-specification-v01.md#fr-inv-045).


---

## 10. Domain Policy and Decision Rules

<a id="dd-util-066"></a>

**DD-UTIL-066 — Stronger ownership wins**  
Apply the [Design Maintenance boundary](../appmanager-design-specification-v01.md#_10-9-maintenance-domain) before accepting an operation or constructing its plan. App clean/reset/prepare, Nuxt cleanup/upgrade, Git, Docs, Quality, Settings and AI intents remain with those owners. A bounded header/source-version/disposable-resource operation is not a route to generic editing, deletion or process execution.

<a id="dd-util-067"></a>

**DD-UTIL-067 — Physical resemblance is insufficient eligibility**  
A file that looks like source, a directory that looks temporary or metadata that resembles a known field shall not become an eligible Maintenance target without applicable scope/classification policy.

<a id="dd-util-068"></a>

**DD-UTIL-068 — Unsupported and ambiguous remain explicit**

Unsupported source follows [FR-XFORM-008](../functional/source-transformation-functional-specification-v01.md#fr-xform-008) and [FR-XFORM-009](../functional/source-transformation-functional-specification-v01.md#fr-xform-009). Ambiguous expected values remain unresolved rather than guessed under [DD-UTIL-017](#dd-util-017).

<a id="dd-util-069"></a>

**DD-UTIL-069 — Validation policy is distinct from Quality gating**

Maintenance postcondition validation follows [FR-UTIL-099](../functional/utils-functional-specification-v01.md#fr-util-099).

<a id="dd-util-070"></a>

**DD-UTIL-070 — Settings identity scopes remain distinct**

Resolved identity consumption follows [FR-SET-023](../functional/settings-functional-specification-v01.md#fr-set-023). Contributor metadata retains its separate collection identity.

<a id="dd-util-071"></a>

**DD-UTIL-071 — Warnings require explicit interpretation**

Maintenance warnings follow [FR-INV-039](../functional/application-invocation-functional-specification-v01.md#fr-inv-039).

<a id="dd-util-072"></a>

**DD-UTIL-072 — No hidden retry policy**

Maintenance retry/fallback follows [FR-INV-049](../functional/application-invocation-functional-specification-v01.md#fr-inv-049) and [FR-UTIL-105](../functional/utils-functional-specification-v01.md#fr-util-105).


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

<a id="dd-util-073"></a>

**DD-UTIL-073 — Read-only means non-mutating**

Inspection/check/validate-only paths follow [FR-UTIL-014](../functional/utils-functional-specification-v01.md#fr-util-014).

<a id="dd-util-074"></a>

**DD-UTIL-074 — Mutation intent is explicit**

Repair/version/package mutation follows [FR-UTIL-015](../functional/utils-functional-specification-v01.md#fr-util-015); cleanup deletion uses [FR-INV-023](../functional/application-invocation-functional-specification-v01.md#fr-inv-023) and [FR-INV-022](../functional/application-invocation-functional-specification-v01.md#fr-inv-022).

<a id="dd-util-075"></a>

**DD-UTIL-075 — Mutation remains target-bounded**

Effect bounds use [FR-XFORM-014](../functional/source-transformation-functional-specification-v01.md#fr-xform-014) for source and [FR-UTIL-084](../functional/utils-functional-specification-v01.md#fr-util-084) for cleanup.

<a id="dd-util-076"></a>

**DD-UTIL-076 — Preview does not authorize execution**

Preview binds [DD-1.2 proposed effects](../dd_1_application_core/dd-1-2-execution-outcomes-detailed-design-v01.md#_13-proposed-effects-and-preview) to the transformation/deletion plan.

<a id="dd-util-077"></a>

**DD-UTIL-077 — Stale source is revalidated**

Source revalidation follows [FR-XFORM-068](../functional/source-transformation-functional-specification-v01.md#fr-xform-068) and [FR-XFORM-069](../functional/source-transformation-functional-specification-v01.md#fr-xform-069).

<a id="dd-util-078"></a>

**DD-UTIL-078 — Cleanup scope cannot be configured away**

Cleanup options remain constrained by [FR-UTIL-094](../functional/utils-functional-specification-v01.md#fr-util-094).

<a id="dd-util-079"></a>

**DD-UTIL-079 — Generated suggestions are inert**

AI-suggested names, versions, notes, paths and commands follow [Design](../appmanager-design-specification-v01.md#_11-10-ai-assisted-workflow).


---

## 12. Failure, Cancellation, and Partial Effects

<a id="dd-util-080"></a>

**DD-UTIL-080 — Failure stage remains attributable**

Failures follow [FR-UTIL-101](../functional/utils-functional-specification-v01.md#fr-util-101). Recognition and resource deletion remain identifiable stages where applicable.

<a id="dd-util-081"></a>

**DD-UTIL-081 — Partial completion is first-class**

Multi-resource completion follows [FR-UTIL-020](../functional/utils-functional-specification-v01.md#fr-util-020) and [DD-1.2 partial completion](../dd_1_application_core/dd-1-2-execution-outcomes-detailed-design-v01.md#_14-partial-completion).

<a id="dd-util-082"></a>

**DD-UTIL-082 — No universal rollback claim**

Source/provider/resource rollback claims follow [FR-INV-046](../functional/application-invocation-functional-specification-v01.md#fr-inv-046).

<a id="dd-util-083"></a>

**DD-UTIL-083 — Cancellation stops future effects**

Cancellation follows [FR-UTIL-021](../functional/utils-functional-specification-v01.md#fr-util-021) and [DD-1.2 cancellation propagation](../dd_1_application_core/dd-1-2-execution-outcomes-detailed-design-v01.md#_17-cancellation-model).

<a id="dd-util-084"></a>

**DD-UTIL-084 — Cancellation preserves completed effects**

Completed writes/deletions follow [FR-INV-045](../functional/application-invocation-functional-specification-v01.md#fr-inv-045).

<a id="dd-util-085"></a>

**DD-UTIL-085 — Indeterminate effects remain indeterminate**  
If interruption or provider/resource failure leaves completion uncertain, Maintenance shall require verification or preserve uncertainty rather than guess success/failure.

<a id="dd-util-086"></a>

**DD-UTIL-086 — Continuation policy is explicit**

Independent later resources follow [PBC-FR-MAINT-COORD-027](../functional/utils-functional-specification-v01.md#pbc-fr-maint-coord-027). Check cancellation before each new consequential resource effect and at other safe boundaries. Retain planned disposition, effect evidence, validation/acceptance and diagnostics using [DD-UTIL-018](#dd-util-018); shared effect interpretation is governed by [DD-1.2](../dd_1_application_core/dd-1-2-execution-outcomes-detailed-design-v01.md#_14-partial-completion).


---

## 13. Headless and Interaction Independence

<a id="dd-util-087"></a>

**DD-UTIL-087 — Semantic contract is adapter-independent**

Maintenance adapter projections follow [Design](../appmanager-design-specification-v01.md#_4-6-presentation-independence).

<a id="dd-util-088"></a>

**DD-UTIL-088 — Headless never prompts**

Missing Headless targets, repair policy, authorization or disambiguation follows [FR-INV-020](../functional/application-invocation-functional-specification-v01.md#fr-inv-020).

<a id="dd-util-089"></a>

**DD-UTIL-089 — Interactive choices are presentation**

Repair-field/package/increment/cleanup choices use [FR-INV-019](../functional/application-invocation-functional-specification-v01.md#fr-inv-019) and the operation models in §7.

<a id="dd-util-090"></a>

**DD-UTIL-090 — Machine-facing results are structured**

Maintenance findings and target outcomes follow [FR-INV-021](../functional/application-invocation-functional-specification-v01.md#fr-inv-021).


---

## 14. Concurrency, Idempotency, and Conflict Behaviour

<a id="dd-util-091"></a>

**DD-UTIL-091 — Freshness is checked at consequential boundaries**  
Source/resource preconditions that can become stale shall be revalidated immediately before consequential execution where supported.

<a id="dd-util-092"></a>

**DD-UTIL-092 — Already-satisfied maintenance converges**

Repeated satisfied repair/cleanup binds [FR-UTIL-055](../functional/utils-functional-specification-v01.md#fr-util-055) and [FR-UTIL-092](../functional/utils-functional-specification-v01.md#fr-util-092) to no-op interpretation.

<a id="dd-util-093"></a>

**DD-UTIL-093 — Auto-version is not blindly idempotent**  
Source-file version maintenance shall not increment a file merely because the same command is repeated; a new increment requires applicable changed-file/change evidence under the effective policy.

<a id="dd-util-094"></a>

**DD-UTIL-094 — Concurrent changes are not silently overwritten**

Concurrent source changes follow [FR-XFORM-068](../functional/source-transformation-functional-specification-v01.md#fr-xform-068) and [FR-XFORM-069](../functional/source-transformation-functional-specification-v01.md#fr-xform-069). Detectable resource changes shall likewise be surfaced and deliberately handled before effect execution.

<a id="dd-util-095"></a>

**DD-UTIL-095 — Multi-target ordering is not transactionality**

Multi-target ordering applies [FR-INV-046](../functional/application-invocation-functional-specification-v01.md#fr-inv-046).


---

## 15. Security and Sensitive Information

<a id="dd-util-096"></a>

**DD-UTIL-096 — Content access is minimized**  
Inspection, diagnostics and optional AI context shall use only content required for the requested maintenance decision.

<a id="dd-util-097"></a>

**DD-UTIL-097 — Sensitive values are not diagnostic payloads**

Nearby credentials/environment/sensitive source in diagnostics follows [FR-INV-040](../functional/application-invocation-functional-specification-v01.md#fr-inv-040).

<a id="dd-util-098"></a>

**DD-UTIL-098 — AI disclosure follows DD-2.7 policy**

Optional source/diff/header AI context follows [FR-AI-057](../functional/ai-functional-specification-v01.md#fr-ai-057), [FR-AI-088](../functional/ai-functional-specification-v01.md#fr-ai-088), [FR-AI-090](../functional/ai-functional-specification-v01.md#fr-ai-090) and [FR-AI-096](../functional/ai-functional-specification-v01.md#fr-ai-096).

<a id="dd-util-099"></a>

**DD-UTIL-099 — Project content is untrusted data**  
Instructions embedded in source comments, logs, temporary files or revision notes shall not redefine Maintenance scope, authorization, provider policy or application behavior.

<a id="dd-util-100"></a>

**DD-UTIL-100 — Cleanup paths are safety-sensitive**

Cleanup target normalization and symlink/indirection handling apply the [Resource Access indirection contract](../dd_2_shared_capabilities/dd-2-1-resource-access-detailed-design-v01.md#dd-res-014) to the authorized cleanup boundary.


---

## 16. Extensibility and Replaceability

<a id="dd-util-101"></a>

**DD-UTIL-101 — New utilities require ownership proof**

Future Maintenance placement follows [Design](../appmanager-design-specification-v01.md#_10-9-maintenance-domain) through [DD-UTIL-066](#dd-util-066).

<a id="dd-util-102"></a>

**DD-UTIL-102 — Source/provider replaceability is preserved**

Scanner/parser/AST/CST/regex/Git/AI/transformation/filesystem substitution follows [Design](../appmanager-design-specification-v01.md#_6-6-capability-boundaries-and-providers).

<a id="dd-util-103"></a>

**DD-UTIL-103 — Header convention is semantic, not parser topology**  
Stable semantic header fields/rules may be refined without making one comment syntax or parser representation the universal application contract unless separately approved.

<a id="dd-util-104"></a>

**DD-UTIL-104 — No generic maintenance framework by naming similarity**

Maintenance header repair, source-version and cleanup shapes apply the [shared-abstraction criterion](../dd_1_application_core/dd-1-5-application-engine-detailed-design-v01.md#dd-eng-046) within the existing DD-1/DD-2 ownership boundaries.

<a id="dd-util-105"></a>

**DD-UTIL-105 — Implementation topology remains open**

Concrete service/class/package/process/executable/protocol/source-layout decisions follow [the Implementation Specification boundary](../project-documentation-guide-v01.md#_8-level-4-implementation-specification).


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

<a id="dd-util-106"></a>

**DD-UTIL-106 — Domain policy is independently testable**  
Maintenance acceptance, eligibility, stronger-owner and continuation decisions shall be testable without requiring live Git hosts, AI providers or implementation-specific source services.

<a id="dd-util-107"></a>

**DD-UTIL-107 — Capability tests do not redefine Maintenance semantics**
Scanner, parser, Git, AI, transformation and filesystem integration tests may verify adapters/providers but shall not substitute for Maintenance-domain conformance tests.

<a id="dd-util-108"></a>

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

Conformance review follows the stronger-owner gate, per-resource classification and coordinated plan in §7 and the inspection, repair, versioning and bounded cleanup in §8. The policy, lifecycle, failure/recovery and security clauses in §§9–16 supply their local acceptance and uncertainty conditions. §18 identifies the upstream contracts; this index adds no independent invariant set.
