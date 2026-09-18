# DD-3.4 — AppManager Docs Domain Detailed Design

> **Detailed Design ID:** DD-3.4
>
> **Design family:** DD-3 — High-Coupling Domains
>
> **Status:** Version 1 Detailed Design Specification
>
> **Detailed Design authority:** This document defines the permanent Docs-domain orchestration, documentation-target policy, decision, state and result contracts by which AppManager realises documentation inspection, derivation, generation, update, aggregation and documentation-tooling use cases through the DD-1 Application Core and DD-2 Shared Capability contracts.
>
> **Sources and navigation:** [Project Documentation Guide](../project-documentation-guide-v01.md), [AppManager Design Specification](../appmanager-design-specification-v01.md), [docs/functional/docs-functional-specification-v01.md](../functional/docs-functional-specification-v01.md), accepted ADRs, and the normative DD-1/DD-2 Detailed Designs.
>
> **Authoring controls:** [Detailed Design Register](../project_management/detailed-design-register-v01.md), [Domain Detailed Design Authoring Guide](../project_management/domain-detailed-design-authoring-guide-v02.md), [Nuxt Layer Scaffold Artefact Ownership](../dd_2_shared_capabilities/dd-2-10-nuxt-capability-detailed-design-v01.md#_16-layer-scaffolding-and-resource-registry)

---

## 1. Purpose

This specification refines [Docs Functional contracts](../functional/docs-functional-specification-v01.md) for documentation intent. Its profile, coverage and per-artefact plan models connect source/domain evidence, authored documentation and proposed explanatory prose to generation, update and tooling workflows. Provenance-sensitive interpretation follows [FR-DOCS-037](../functional/docs-functional-specification-v01.md#fr-docs-037) and [FR-DOCS-079](../functional/docs-functional-specification-v01.md#fr-docs-079).

The collaboration in §§5–6 applies [Design §6.2](../appmanager-design-specification-v01.md#_6-2-application-engine-authority) and [§6.6](../appmanager-design-specification-v01.md#_6-6-capability-boundaries-and-providers) to the domain’s context, specialist delegation and final acceptance.

## 2. Scope

### 2.1 In Scope

This design owns permanent Docs-domain contracts for:

- Docs-domain operation identity and applicability;
- documentation target classes and target-selection policy over DD-1.3 managed-project context;
- documentation profiles and domain-level completeness expectations;
- complete-application documentation orchestration;
- application-source documentation orchestration;
- all-managed-layers and selected-layer documentation orchestration;
- test documentation orchestration without acquiring test-execution authority;
- selected-file documentation and eligibility policy;
- documentation fact-selection and provenance policy above bounded capability facts;
- generation versus update intent and output-scope policy;
- documentation output collision, replacement and preservation policy;
- optional AI-enrichment policy and acceptance;
- documentation development, build and preview use-case orchestration;
- extraction and aggregation selection policy;
- coverage, omission, unsupported-target and freshness interpretation;
- multi-target and multi-artefact continuation policy;
- documentation-specific partial-effect and recovery interpretation;
- cancellation and long-running tooling interpretation;
- deterministic Headless target resolution;
- documentation-specific security and sensitive-information policy;
- interpretation of DD-2 capability evidence against Docs-domain postconditions.

### 2.2 Out of Scope

This design does not own or redefine:

- invocation identity, caller authorization evidence, cancellation linkage or interaction-mode semantics owned by DD-1.1;
- canonical success, failure, partial-success, cancellation, diagnostics, warnings or effects owned by DD-1.2;
- managed-project identity, root/layer topology, managed scope or mutation authority owned by DD-1.3;
- configuration precedence, provenance or effective-value construction owned by DD-1.4;
- application-wide dispatch, final authority, final acceptance or outcome publication owned by DD-1.5;
- filesystem/resource mechanics owned by DD-2.1;
- external-process mechanics owned by DD-2.2;
- repository semantics owned by DD-2.3 and DD-3.2;
- generic source recognition owned by DD-2.4;
- source/document transformation planning, preservation, stale-write handling and mutation mechanics owned by DD-2.5;
- declarative resource identity, parameter binding or template rendering substrate owned by DD-2.6;
- AI provider/model execution, disclosure safety or structured-output mechanics owned by DD-2.7;
- independent test/lint/typecheck/coverage/gate semantics owned by DD-2.8 and the Quality domain;
- bounded documentation modeling, rendering, aggregation and tooling mechanics owned by DD-2.9;
- Nuxt recognition, configuration, layer or integration semantics owned by DD-2.10 and DD-3.3;
- App lifecycle semantics;
- Settings or licence-management semantics;
- governance of AppManager's own specification/documentation repository, which remains governed by the Project Documentation Guide;
- exact Markdown/VitePress syntax, templates, package commands, TypeScript interfaces, classes, services, source paths, package topology, parser libraries, renderers or provider wiring.

---

## 3. Governing Requirements and Authorities

### 3.1 Functional ownership

The Docs domain owns `FR-DOCS-001` through `FR-DOCS-119` from [docs/functional/docs-functional-specification-v01.md](../functional/docs-functional-specification-v01.md).

| Functional range | Docs-domain concern |
|---|---|
| `FR-DOCS-001`–`005` | domain boundary, read-only default and delegated-authority rules |
| `FR-DOCS-006`–`018` | invocation, project context, scope, cancellation and retry |
| `FR-DOCS-019`–`030` | documentation target model |
| `FR-DOCS-031`–`040` | complete-application documentation |
| `FR-DOCS-041`–`050` | application-source documentation |
| `FR-DOCS-051`–`060` | managed-layer documentation |
| `FR-DOCS-061`–`066` | test documentation |
| `FR-DOCS-067`–`072` | selected-file documentation |
| `FR-DOCS-073`–`083` | generation, update, preservation and partial writes |
| `FR-DOCS-084`–`090` | optional AI-assisted documentation |
| `FR-DOCS-091`–`099` | documentation tooling workflows |
| `FR-DOCS-100`–`105` | extraction and aggregation |
| `FR-DOCS-106`–`113` | results, diagnostics and acceptance |
| `FR-DOCS-114`–`119` | safety and non-destructive behavior |

### 3.2 Application Core authorities

DD-3.4 consumes DD-1.1 Application Invocation, DD-1.2 Execution Outcomes, DD-1.3 Managed Project, DD-1.4 Configuration Resolution and DD-1.5 Application Engine. Its staged context and result interpretation use the [Engine bootstrap lifecycle](../dd_1_application_core/dd-1-5-application-engine-detailed-design-v01.md#_8-orchestration-lifecycle) and [outcome contract](../dd_1_application_core/dd-1-2-execution-outcomes-detailed-design-v01.md#_7-outcome-contract).

### 3.3 Shared capability authorities

The principal specialist is [DD-2.9 — Documentation Capability](../dd_2_shared_capabilities/dd-2-9-documentation-capability-detailed-design-v01.md). Docs supplies application intent, target/profile selection, managed-scope binding, policy, authorization and acceptance conditions; DD-2.9 supplies bounded documentation facts/models, aggregation, proposed outputs, tooling evidence and documentation-oriented validation.

Supporting authorities include DD-2.1 Resource Access, DD-2.2 Process Execution, DD-2.4 Source Intelligence, DD-2.5 Source Transformation, DD-2.6 Resource Registry and Template, DD-2.7 AI Capability, DD-2.8 Quality Capability and DD-2.10 Nuxt Capability where an approved Docs use case requires their evidence or execution.

### 3.4 Cross-domain authorities

DD-3.3 remains authoritative for Nuxt-domain facts and relationships; DD-3.2 remains authoritative for Git-domain intent; DD-3.1 remains authoritative for application lifecycle. Docs may consume their accepted facts without absorbing their semantics.

### 3.5 Runtime decision

ADR-0001 permits Node.js/TypeScript for Version 1 implementation but does not prescribe the implementation topology of this design.

---

## 4. Domain Responsibility and Authority Boundary

The Docs domain owns:

- semantic identity of Docs use cases;
- documentation-target and documentation-profile policy;
- operation-specific documentability/eligibility decisions;
- selection and exclusion policy over authoritative managed scope;
- generation versus update intent;
- output-destination and collision/replacement policy;
- interpretation of provenance, omissions, unsupported inputs and coverage against the requested documentation intent;
- acceptance of optional AI enrichment into documentation output;
- documentation-tool operation intent and target selection;
- multi-target ordering/continuation policy where application-visible;
- Docs-specific per-target/per-artefact result payloads and recovery information.

| Concern | Authoritative owner | Docs-domain relationship |
|---|---|---|
| invocation semantics | DD-1.1 | consumes normalized Docs intent, choices, preview/authorization and cancellation context |
| canonical outcomes | DD-1.2 | supplies Docs-specific payload/evidence without redefining outcome taxonomy |
| project topology/scope | DD-1.3 | consumes root/layer/resource identities and operation scope |
| effective configuration | DD-1.4 | consumes immutable operation-effective values |
| final application authority | DD-1.5 | returns Docs interpretation for final acceptance |
| documentation model/render/tool evidence | DD-2.9 | delegates bounded documentation mechanics |
| source facts | DD-2.4 | consumes structural evidence without redefining source truth |
| source/document mutation | DD-2.5 | delegates bounded transformations |
| Nuxt facts | DD-2.10 / DD-3.3 | consumes accepted Nuxt evidence |
| AI execution | DD-2.7 | requests bounded proposed enrichment |
| Quality semantics | DD-2.8 / DD-4.1 | consumes facts where relevant; does not execute/own gates |

```text
normalized invocation
        |
        v
Application Engine authority
        |
        +--> DD-1.3 managed project / operation scope
        +--> DD-1.4 effective configuration
        +--> DD-1.1 authorization / cancellation context
        |
        v
Docs-domain intent / target / profile / policy
        |
        +--> DD-2.9 documentation modeling/rendering/tooling evidence
        +--> DD-2.4 source facts
        +--> DD-2.10 / DD-3.3 Nuxt facts where required
        +--> DD-2.7 AI proposal where permitted
        +--> DD-2.1 / DD-2.5 persistence or transformation after authorization
        |
        v
Docs-domain interpretation / coverage / per-target result
        |
        v
Application Engine acceptance -> canonical DD-1.2 outcome
```

The diagram describes semantic authority, not a mandatory call graph.

---

## 5. Consumed DD-1 Application Core Contracts

| DD-1 contract | Docs-domain use |
|---|---|
| Application Invocation | receives canonical Docs intent, explicit selectors, output/update choices, preview intent, authorization evidence and cancellation linkage |
| Execution Outcomes | records target/artefact diagnostics, effects, warnings, subordinate results and partial completion |
| Managed Project | supplies root/layer/resource identities, managed scope and targetability constraints |
| Configuration Resolution | supplies operation-effective documentation, provider, template, AI and tooling policy values |
| Application Engine | supplies authoritative execution context and performs final acceptance |

<a id="dd-docs-001"></a>

### DD-DOCS-001 — No local reconstruction of Application Core authority

Docs consumes the Application Core context under [Design](../appmanager-design-specification-v01.md#_6-2-application-engine-authority) through the collaboration in §5.


---

## 6. Consumed DD-2 Shared Capabilities

<a id="dd-docs-002"></a>

### DD-DOCS-002 — Documentation Capability is the principal specialist boundary

DD-3.4 shall consume DD-2.9 for bounded documentation inspection/modeling, aggregation, rendering, proposed documentation outputs, documentation-tool capability evidence and documentation-oriented validation rather than duplicating those mechanics.

<a id="dd-docs-003"></a>

### DD-DOCS-003 — Capability success remains subordinate evidence

Documentation stage evidence is interpreted under [Design](../appmanager-design-specification-v01.md#_11-11-workflow-results-failure-and-acceptance) against the Docs postconditions.

<a id="dd-docs-004"></a>

### DD-DOCS-004 — Capability composition preserves specialist authority

The §6 specialist collaborations apply [Design](../appmanager-design-specification-v01.md#_6-6-capability-boundaries-and-providers).


---

## 7. Domain Contract Model

### 7.1 Docs operation identity

<a id="dd-docs-005"></a>

**DD-DOCS-005 — Stable operation identities**  
Docs-domain intent shall distinguish at least complete-application documentation, application-source documentation, all-layers documentation, selected-layer documentation, tests documentation, selected-file documentation, documentation generation/update and supported documentation development/build/preview operations where applicable.

### 7.2 Documentation target

<a id="dd-docs-006"></a>

**DD-DOCS-006 — Semantic target identity**

The Docs target model binds the supported classes in [FR-DOCS-020](../functional/docs-functional-specification-v01.md#fr-docs-020) to authoritative managed-project/resource identity under [Design](../appmanager-design-specification-v01.md#_9-6-project-discovery-and-context-resolution).

<a id="dd-docs-007"></a>

**DD-DOCS-007 — Root/layer distinction is preserved**

The root, individual-layer and aggregate scopes bind [Design](../appmanager-design-specification-v01.md#_9-3-root-application-and-managed-layers) throughout orchestration and results.

<a id="dd-docs-008"></a>

**DD-DOCS-008 — Duplicate target normalization**

Normalize overlapping targets under [FR-DOCS-029](../functional/docs-functional-specification-v01.md#fr-docs-029), including duplication explicitly requested by the profile.

### 7.3 Documentation eligibility decision

<a id="dd-docs-009"></a>

**DD-DOCS-009 — Eligibility is operation-relative**  
Managed membership or filesystem presence alone shall not establish documentability. Eligibility may depend on target class, supported recognition, documentation policy, selected profile, sensitivity and requested operation.

A decision should distinguish `eligible`, `ineligible`, `unsupported`, `ambiguous` and `indeterminate` with evidence and diagnostics.

### 7.4 Documentation profile

<a id="dd-docs-010"></a>

**DD-DOCS-010 — Profile is semantic, not renderer topology**  
A documentation profile may express requested information categories, exclusions, output kind, detail, aggregation/grouping, required/optional enrichment and completeness expectations without requiring one template, renderer or file layout.

<a id="dd-docs-011"></a>

**DD-DOCS-011 — Profile may narrow but not broaden managed scope**

The profile in [DD-DOCS-010](#dd-docs-010) is constrained by [Design](../appmanager-design-specification-v01.md#_9-7-managed-scope-and-operation-targeting).

### 7.5 Documentation output intent

<a id="dd-docs-012"></a>

**DD-DOCS-012 — Generation and update are distinct intents**

Output intents apply [Design](../appmanager-design-specification-v01.md#_6-8-generation-and-templates) through the independent dispositions in the [coordinated artefact plan](#coordinated-artefact-plan).

<a id="dd-docs-013"></a>

**DD-DOCS-013 — Output destination is explicit before writes**

Output resolution applies [FR-DOCS-075](../functional/docs-functional-specification-v01.md#fr-docs-075) before persistence or transformation.

#### Coordinated artefact plan {#coordinated-artefact-plan}

A multi-target operation constructs its plan from semantic Docs targets, profiles and authoritative DD-1 context, preserving the relationship between each target and its outputs. For each artefact retain:

- semantic target and output identities;
- selected profile and relevant evidence/provenance;
- proposed model/content/render evidence;
- disposition: create, permitted update, already satisfied, skip/refuse or unresolved;
- update ownership/preservation evidence and existing-resource revision preconditions;
- validation/acceptance criteria resolved before effects;
- AI-enrichment mode and acceptance policy where applicable.

The plan remains immutable during the consequential stage; authority/safety-relevant staleness invalidates the affected plan and requires explicit re-resolution. A plan can mix creation, authorized managed-region updates and no-effect items. Each disposition uses the single-artefact policy in §8.7; target cardinality does not relax it.

### 7.6 Coverage and result payload

<a id="dd-docs-014"></a>

**DD-DOCS-014 — Coverage is profile-relative**  
Docs completeness shall be evaluated only against the approved target/profile, including required, optional, unsupported, omitted, failed and empty-but-valid categories.

<a id="dd-docs-015"></a>

**DD-DOCS-015 — Domain payload composes DD-1.2**

Docs target, artefact, coverage, freshness and tooling evidence composes the [DD-1.2 outcome contract](../dd_1_application_core/dd-1-2-execution-outcomes-detailed-design-v01.md#_7-outcome-contract).


---

## 8. Use-Case Orchestration

### 8.1 Common flow

A Docs use case shall conceptually:

1. receive normalized intent and authoritative DD-1 context;
2. resolve the semantic Docs target and profile;
3. establish operation-specific eligibility and exclusions;
4. acquire fresh bounded source/domain/documentation evidence;
5. construct/aggregate documentation evidence through DD-2.9;
6. obtain optional enrichment only where policy permits;
7. render or inspect according to the selected intent;
8. for consequential output, resolve destination/collision/update policy and authorization;
9. delegate authorized creation or transformation through the proper capability;
10. validate relevant documentation postconditions;
11. interpret coverage, freshness, omissions, effects and subordinate failures;
12. return Docs-domain evidence for Application Engine acceptance.

<a id="dd-docs-016"></a>

**DD-DOCS-016 — Read-only inspection does not cross the mutation boundary**

Inspection, extraction and derivation bind [FR-DOCS-003](../functional/docs-functional-specification-v01.md#fr-docs-003) and [FR-DOCS-118](../functional/docs-functional-specification-v01.md#fr-docs-118) to the read-only branch of the common flow.

### 8.2 Complete-application documentation

<a id="dd-docs-017"></a>

**DD-DOCS-017 — Complete application means managed composition**

The complete-application target set applies [FR-DOCS-032](../functional/docs-functional-specification-v01.md#fr-docs-032) using the approved profile.

<a id="dd-docs-018"></a>

**DD-DOCS-018 — Partial coverage remains truthful**

Coverage interpretation applies [FR-DOCS-038](../functional/docs-functional-specification-v01.md#fr-docs-038) and [FR-DOCS-040](../functional/docs-functional-specification-v01.md#fr-docs-040) against required profile inputs.

<a id="dd-docs-019"></a>

**DD-DOCS-019 — Empty optional categories are not failures**

Optional empty categories apply [FR-DOCS-039](../functional/docs-functional-specification-v01.md#fr-docs-039) within [DD-DOCS-014](#dd-docs-014).

### 8.3 Application-source documentation

<a id="dd-docs-020"></a>

**DD-DOCS-020 — Source facts remain recognition evidence**

DD-2.4 evidence is consumed under [FR-DOCS-044](../functional/docs-functional-specification-v01.md#fr-docs-044) and [FR-DOCS-045](../functional/docs-functional-specification-v01.md#fr-docs-045).

<a id="dd-docs-021"></a>

**DD-DOCS-021 — Documentation injection is a separate consequential path**

Source injection binds [FR-DOCS-046](../functional/docs-functional-specification-v01.md#fr-docs-046) and [FR-XFORM-033](../functional/source-transformation-functional-specification-v01.md#fr-xform-033): Docs supplies the content/intent, and DD-2.5 supplies the bounded transformation contract.

### 8.4 Layer documentation

<a id="dd-docs-022"></a>

**DD-DOCS-022 — Layer documentation consumes authoritative Nuxt facts**

Nuxt evidence is obtained through the §6 collaborators under [FR-DOCS-101](../functional/docs-functional-specification-v01.md#fr-docs-101).

<a id="dd-docs-023"></a>

**DD-DOCS-023 — Repository topology does not determine documentability**

Layer documentability applies [FR-DOCS-056](../functional/docs-functional-specification-v01.md#fr-docs-056).

<a id="dd-docs-024"></a>

**DD-DOCS-024 — All-layers continuation is explicit**

All-layers continuation applies [FR-DOCS-PBC-022](../functional/docs-functional-specification-v01.md#fr-docs-pbc-022); results retain layer attribution under [FR-DOCS-059](../functional/docs-functional-specification-v01.md#fr-docs-059).

### 8.5 Test documentation

<a id="dd-docs-025"></a>

**DD-DOCS-025 — Documentation of tests is not test execution**

Test documentation applies [FR-DOCS-062](../functional/docs-functional-specification-v01.md#fr-docs-062).

<a id="dd-docs-026"></a>

**DD-DOCS-026 — Unresolved test relationships remain unresolved**

Unresolved test/source evidence applies [FR-DOCS-065](../functional/docs-functional-specification-v01.md#fr-docs-065).

### 8.6 Selected-file documentation

<a id="dd-docs-027"></a>

**DD-DOCS-027 — Selected file resolves exactly one eligible resource**

Selected-file resolution applies [FR-DOCS-026](../functional/docs-functional-specification-v01.md#fr-docs-026), [FR-DOCS-072](../functional/docs-functional-specification-v01.md#fr-docs-072) and [FR-DOCS-015](../functional/docs-functional-specification-v01.md#fr-docs-015).

### 8.7 Generation and update

<a id="dd-docs-028"></a>

**DD-DOCS-028 — Proposed content precedes persistence**

DD-2.9 proposals precede the persistence decision under [Design](../appmanager-design-specification-v01.md#_6-8-generation-and-templates).

<a id="dd-docs-029"></a>

**DD-DOCS-029 — Existing-output collision is not overwrite authority**

Output collision handling applies [FR-DOCS-076](../functional/docs-functional-specification-v01.md#fr-docs-076).

<a id="dd-docs-030"></a>

**DD-DOCS-030 — Narrow update is preferred where semantically supported**

Recognized documentation regions bind the bounded-edit preference in [Design](../appmanager-design-specification-v01.md#_7-10-non-destructive-transformation) to DD-2.5.

<a id="dd-docs-031"></a>

**DD-DOCS-031 — Substantial replacement is explicit**

Substantial replacement applies [FR-DOCS-116](../functional/docs-functional-specification-v01.md#fr-docs-116). It additionally requires managed ownership: unrelated authored documentation remains a refused collision rather than an implicit overwrite target.

### 8.8 AI-assisted documentation

<a id="dd-docs-032"></a>

**DD-DOCS-032 — AI is optional where deterministic baseline exists**

Optional enrichment follows [FR-DOCS-084](../functional/docs-functional-specification-v01.md#fr-docs-084) and [FR-DOCS-088](../functional/docs-functional-specification-v01.md#fr-docs-088).

<a id="dd-docs-033"></a>

**DD-DOCS-033 — AI output is proposed documentation evidence**  
For individual artefacts or bounded plan portions, resolve AI acceptance criteria before generation under [Design §11.10](../appmanager-design-specification-v01.md#_11-10-ai-assisted-workflow). Preserve generated provenance. A pre-authorized automatic path accepts only proposals satisfying those criteria; a review-required proposal remains pending until the decision. The proposal cannot change targets/output paths, preservation/sensitivity policy or stale-write checks.

<a id="dd-docs-034"></a>

**DD-DOCS-034 — Reliable facts dominate contradictory generated claims**

Structural-fact preservation applies [FR-DOCS-087](../functional/docs-functional-specification-v01.md#fr-docs-087); contradictions of domain-authoritative facts use the [Documentation Capability conflict contract](../dd_2_shared_capabilities/dd-2-9-documentation-capability-detailed-design-v01.md#dd-doccap-021) at acceptance.

### 8.9 Documentation tooling

<a id="dd-docs-035"></a>

**DD-DOCS-035 — Tooling target is explicit**

Development/build/preview target resolution applies [FR-DOCS-092](../functional/docs-functional-specification-v01.md#fr-docs-092).

<a id="dd-docs-036"></a>

**DD-DOCS-036 — Tool launch/build evidence is not Docs acceptance**

Tool launch/build evidence is interpreted under [Design](../appmanager-design-specification-v01.md#_11-11-workflow-results-failure-and-acceptance) against the Docs tooling intent.

<a id="dd-docs-037"></a>

**DD-DOCS-037 — Long-running tooling state remains explicit**

Long-running development and preview state applies [FR-DOCS-095](../functional/docs-functional-specification-v01.md#fr-docs-095) and [FR-DOCS-097](../functional/docs-functional-specification-v01.md#fr-docs-097).

### 8.10 Extraction and aggregation

<a id="dd-docs-038"></a>

**DD-DOCS-038 — Aggregation follows bounded selection policy**

Aggregation target selection applies [FR-DOCS-104](../functional/docs-functional-specification-v01.md#fr-docs-104) and [FR-DOCS-105](../functional/docs-functional-specification-v01.md#fr-docs-105) using [DD-DOCS-010](#dd-docs-010).

<a id="dd-docs-039"></a>

**DD-DOCS-039 — Provenance survives aggregation**

Aggregation retains provenance under [FR-DOCS-102](../functional/docs-functional-specification-v01.md#fr-docs-102).


---

### 8.11 Coordinated execution and acceptance {#coordinated-execution}

Apply the common flow to the [artefact plan](#coordinated-artefact-plan): selected evidence feeds DD-2.9 models/aggregation/rendering, then the output disposition determines authorization and the existing creation/transformation path. Deterministically satisfiable profiles remain available without AI under DD-DOCS-032.

For each consequential artefact retain disposition, delegated evidence, resulting revision/effect, documentation validation, target/profile satisfaction, warnings/omissions/conflicts and domain acceptance. Rendering or writing alone does not satisfy the requested documentation postcondition.

Continuation operates at target/artefact granularity. After failure, refusal or uncertainty, later independent artefacts proceed only under resolved Docs policy and dependency constraints. Check cancellation before each new consequential effect and at other safe boundaries. One stale artefact does not itself authorize replanning or mutation; independent artefacts follow the continuation policy. The result composes these states under §12 and DD-1.2 without a cross-artefact transaction guarantee.

## 9. Domain State and State Transitions

<a id="dd-docs-040"></a>

**DD-DOCS-040 — Conceptual domain states**  
A Docs operation may progress through `context_resolved`, `target_resolved`, `eligibility_established`, `evidence_acquired`, `model_composed`, `proposal_ready`, `authorization_satisfied`, `persisting_or_tooling`, `validating`, `interpreting`, and terminal domain positions such as `accepted`, `rejected`, `partially_completed`, `cancelled` or `indeterminate`.

These states are semantic checkpoints, not required classes or persistence records.

<a id="dd-docs-041"></a>

**DD-DOCS-041 — Read-only operations terminate before persistence**  
Inspection/extraction operations may move from model/evidence interpretation directly to acceptance without passing through mutation/tooling states.

<a id="dd-docs-042"></a>

**DD-DOCS-042 — Multi-target state is per target/artefact**  
Coordinated documentation shall retain each target/artefact's semantic position rather than deriving all state from one aggregate provider status.

<a id="dd-docs-043"></a>

**DD-DOCS-043 — State progression does not manufacture authority**

The state model binds [Design](../appmanager-design-specification-v01.md#_6-2-application-engine-authority); its checkpoints describe the workflow rather than grant missing authority.


---

## 10. Domain Policy and Decision Rules

<a id="dd-docs-044"></a>

**DD-DOCS-044 — Current working directory is context, not target authority**

Working-directory evidence is interpreted under [FR-PROJ-005](../functional/managed-project-functional-specification-v01.md#fr-proj-005) when resolving the Docs target.

<a id="dd-docs-045"></a>

**DD-DOCS-045 — Discovery never broadens scope**

Discovered documentation inputs bind [Design](../appmanager-design-specification-v01.md#_9-7-managed-scope-and-operation-targeting) to the approved target set.

<a id="dd-docs-046"></a>

**DD-DOCS-046 — Unsupported does not count as documented**

Required unsupported/failed inputs are evaluated under [FR-DOCS-038](../functional/docs-functional-specification-v01.md#fr-docs-038) and [FR-DOCS-040](../functional/docs-functional-specification-v01.md#fr-docs-040) against [DD-DOCS-014](#dd-docs-014).

<a id="dd-docs-047"></a>

**DD-DOCS-047 — Existing documentation is contextual evidence**

Existing authored documentation follows [FR-DOCS-037](../functional/docs-functional-specification-v01.md#fr-docs-037); its context shall not automatically override fresher authoritative source/domain facts.

<a id="dd-docs-048"></a>

**DD-DOCS-048 — No false freshness**

Coverage/freshness acceptance applies [FR-DOCS-081](../functional/docs-functional-specification-v01.md#fr-docs-081).

<a id="dd-docs-049"></a>

**DD-DOCS-049 — Retry/fallback is governed**

Provider/capability retry and fallback applies [FR-DOCS-018](../functional/docs-functional-specification-v01.md#fr-docs-018).

<a id="dd-docs-050"></a>

**DD-DOCS-050 — Tool availability is target-relative**

Tool availability applies [FR-DOCS-093](../functional/docs-functional-specification-v01.md#fr-docs-093) for the selected target, not every documentation target.


---

## 11. Safety, Mutation, and Authorization

<a id="dd-docs-051"></a>

**DD-DOCS-051 — Documentation recognition is not mutation authority**

Documentable evidence is consumed under [Design](../appmanager-design-specification-v01.md#_9-9-non-destructive-ownership-and-unmanaged-content).

<a id="dd-docs-052"></a>

**DD-DOCS-052 — Mutation authority is output-bounded**

Writes and bounded documentation updates apply [FR-DOCS-004](../functional/docs-functional-specification-v01.md#fr-docs-004).

<a id="dd-docs-053"></a>

**DD-DOCS-053 — New creation and existing-resource mutation use different effect paths**

New documentation uses DD-2.1 and existing-resource transformation uses DD-2.5 under [Design](../appmanager-design-specification-v01.md#_6-8-generation-and-templates).

<a id="dd-docs-054"></a>

**DD-DOCS-054 — Symlink/indirection escape is prohibited**

Target/output indirection applies [FR-DOCS-028](../functional/docs-functional-specification-v01.md#fr-docs-028) through DD-1.3/DD-2.1.

<a id="dd-docs-055"></a>

**DD-DOCS-055 — No implicit deletion**

Generated-set differences apply [FR-DOCS-115](../functional/docs-functional-specification-v01.md#fr-docs-115).

<a id="dd-docs-056"></a>

**DD-DOCS-056 — Tooling effects are explicit**

Tooling stages apply [FR-DOCS-118](../functional/docs-functional-specification-v01.md#fr-docs-118).


---

## 12. Failure, Cancellation, and Partial Effects

<a id="dd-docs-057"></a>

**DD-DOCS-057 — Failure remains target/stage attributable**

Stage failures apply [FR-DOCS-107](../functional/docs-functional-specification-v01.md#fr-docs-107). Modeling, enrichment, rendering and persistence are distinguished within the generation stage where material.

<a id="dd-docs-058"></a>

**DD-DOCS-058 — Partial completion is first-class**

Target/artefact states in [DD-DOCS-042](#dd-docs-042) compose [DD-1.2 partial completion](../dd_1_application_core/dd-1-2-execution-outcomes-detailed-design-v01.md#_14-partial-completion), including unchanged, skipped, unsupported and not-attempted positions.

<a id="dd-docs-059"></a>

**DD-DOCS-059 — No universal rollback claim**

Documentation files, transformations, AI usage and tooling effects apply [FR-INV-046](../functional/application-invocation-functional-specification-v01.md#fr-inv-046).

<a id="dd-docs-060"></a>

**DD-DOCS-060 — Cancellation stops future work when safely observed**

Docs cancellation applies [FR-DOCS-016](../functional/docs-functional-specification-v01.md#fr-docs-016) and [DD-1.2 cancellation propagation](../dd_1_application_core/dd-1-2-execution-outcomes-detailed-design-v01.md#_17-cancellation-model).

<a id="dd-docs-061"></a>

**DD-DOCS-061 — Cancellation does not erase completed effects**

Completed writes, AI disclosures, tooling outputs and process effects apply [FR-INV-045](../functional/application-invocation-functional-specification-v01.md#fr-inv-045).

<a id="dd-docs-062"></a>

**DD-DOCS-062 — Indeterminate effects require verification**  
Where persistence/tooling completion is uncertain, Docs shall preserve indeterminate state and require verification/recovery rather than fabricate success or failure.

---

## 13. Headless and Interaction Independence

<a id="dd-docs-063"></a>

**DD-DOCS-063 — One semantic model across adapters**

Docs adapters apply [Design](../appmanager-design-specification-v01.md#_4-6-presentation-independence).

<a id="dd-docs-064"></a>

**DD-DOCS-064 — Interactive selection is presentation only**

Target menus/file pickers acquire intent under [FR-INV-019](../functional/application-invocation-functional-specification-v01.md#fr-inv-019) using the same §7 target model.

<a id="dd-docs-065"></a>

**DD-DOCS-065 — Headless ambiguity fails safely**

Unresolved required target, destination, replacement or tooling choices apply [FR-INV-020](../functional/application-invocation-functional-specification-v01.md#fr-inv-020).

<a id="dd-docs-066"></a>

**DD-DOCS-066 — Results are machine-consumable**

The Docs payload in [DD-DOCS-015](#dd-docs-015) is exposed under [FR-INV-021](../functional/application-invocation-functional-specification-v01.md#fr-inv-021).


---

## 14. Concurrency, Idempotency, and Conflict Behaviour

<a id="dd-docs-067"></a>

**DD-DOCS-067 — Consequential preconditions are revalidated**

Output existence, target revision and relevant source facts bind the [Engine stale-state checkpoint](../dd_1_application_core/dd-1-5-application-engine-detailed-design-v01.md#dd-eng-024) before a prepared consequential action is applied.

<a id="dd-docs-068"></a>

**DD-DOCS-068 — Deterministic generation is semantically repeatable**

Deterministic generation binds [FR-DOCS-080](../functional/docs-functional-specification-v01.md#fr-docs-080) to equivalent facts, profile and effective configuration.

<a id="dd-docs-069"></a>

**DD-DOCS-069 — AI enrichment does not create deterministic identity**

Repeatability claims bind the optional non-deterministic enrichment qualification in [FR-DOCS-080](../functional/docs-functional-specification-v01.md#fr-docs-080) to the baseline/enrichment distinction.

<a id="dd-docs-070"></a>

**DD-DOCS-070 — Concurrent change is not silently overwritten**

Existing-target changes apply [FR-XFORM-020](../functional/source-transformation-functional-specification-v01.md#fr-xform-020) and [FR-XFORM-068](../functional/source-transformation-functional-specification-v01.md#fr-xform-068) through DD-2.5.

<a id="dd-docs-071"></a>

**DD-DOCS-071 — Already-satisfied output is explicit**

Satisfied documentation postconditions bind [DD-1.2 no-op interpretation](../dd_1_application_core/dd-1-2-execution-outcomes-detailed-design-v01.md#_15-no-op-already-satisfied-skipped-and-not-attempted-states) without requiring an artificial write.


---

## 15. Security and Sensitive Information

<a id="dd-docs-072"></a>

**DD-DOCS-072 — Accessible does not mean documentable**

Sensitive documentation inputs use [DD-DOCCAP-084](../dd_2_shared_capabilities/dd-2-9-documentation-capability-detailed-design-v01.md#dd-doccap-084), including credentials, protected configuration/environment and source content within managed scope.

<a id="dd-docs-073"></a>

**DD-DOCS-073 — External disclosure is separately governed**  
Context supplied to AI or external documentation providers shall follow DD-2.7 and effective disclosure policy, including minimization and sensitivity constraints.

<a id="dd-docs-074"></a>

**DD-DOCS-074 — Generated/provider content is untrusted data**

Docs consumes existing documents, templates, renderer output, AI prose and provider diagnostics through the [Documentation Capability untrusted-content boundary](../dd_2_shared_capabilities/dd-2-9-documentation-capability-detailed-design-v01.md#dd-doccap-097).

<a id="dd-docs-075"></a>

**DD-DOCS-075 — Diagnostics minimize sensitive content**

Docs diagnostics apply [FR-INV-040](../functional/application-invocation-functional-specification-v01.md#fr-inv-040) to protected source, prompts, configuration and credentials.

<a id="dd-docs-076"></a>

**DD-DOCS-076 — Generated references remain data until validated**

Generated paths, links, include directives, frontmatter and provider-specific references apply [DD-DOCCAP-098](../dd_2_shared_capabilities/dd-2-9-documentation-capability-detailed-design-v01.md#dd-doccap-098) at the domain’s downstream-effect boundary.


---

## 16. Extensibility and Replaceability

<a id="dd-docs-077"></a>

**DD-DOCS-077 — Documentation providers are replaceable behind DD-2.9**

The DD-2.9 seam applies [Design](../appmanager-design-specification-v01.md#_6-6-capability-boundaries-and-providers) to documentation parsers/renderers/static-site tools and their native models.

<a id="dd-docs-078"></a>

**DD-DOCS-078 — Source recognition remains replaceable behind DD-2.4**

The DD-2.4 seam applies [Design](../appmanager-design-specification-v01.md#_6-6-capability-boundaries-and-providers) to equivalent source facts consumed by Docs.

<a id="dd-docs-079"></a>

**DD-DOCS-079 — AI providers remain replaceable and subordinate**

AI substitution applies [FR-DOCS-084](../functional/docs-functional-specification-v01.md#fr-docs-084) and [Design](../appmanager-design-specification-v01.md#_11-10-ai-assisted-workflow).

<a id="dd-docs-080"></a>

**DD-DOCS-080 — No generic domain framework from workflow similarity**

Docs workflow/request/result shapes apply the [shared-abstraction criterion](../dd_1_application_core/dd-1-5-application-engine-detailed-design-v01.md#dd-eng-046) within the existing DD-1/DD-2 ownership boundaries. A future shared domain abstraction requires separate approval.

<a id="dd-docs-081"></a>

**DD-DOCS-081 — Implementation topology remains open**

Concrete TypeScript services/classes/packages/processes/paths/provider wiring remain governed by [the Implementation Specification boundary](../project-documentation-guide-v01.md#_8-level-4-implementation-specification).


---

## 17. Testability and Conformance Requirements

Conformance testing shall cover at least:

- target resolution for complete application, source, all layers, selected layer, tests and selected file;
- ambiguous/out-of-scope/unsupported target handling;
- duplicate target normalization;
- managed scope versus discovery;
- authoritative facts versus authored/generated prose;
- complete versus partial coverage;
- empty optional categories;
- source facts consumed without duplicate parsing authority;
- Nuxt facts consumed without Docs redefining Nuxt semantics;
- test documentation without test execution authority;
- generation versus update distinction;
- output collision and substantial replacement policy;
- bounded existing-document/source transformation;
- stale update rejection/replanning;
- deterministic baseline with AI unavailable;
- contradictory AI proposal rejection/conflict handling;
- sensitive-context exclusion;
- all-layer/multi-target continuation and partial completion;
- documentation tooling target selection;
- development/preview long-running state;
- build/process success versus Docs acceptance;
- cancellation before and after consequential effects;
- provider substitution without changing domain semantics;
- deterministic Headless ambiguity handling.

<a id="dd-docs-082"></a>

**DD-DOCS-082 — Domain policy is testable with capability substitutes**  
Core Docs target/profile policy, orchestration and evidence interpretation shall be testable with deterministic substitutes for DD-2.9 and supporting capabilities rather than requiring concrete providers.

<a id="dd-docs-083"></a>

**DD-DOCS-083 — Concrete-provider tests do not define the contract**  
VitePress, Markdown, parser, AI, process or template integration tests may verify provider mechanics but shall not redefine DD-3.4 semantics.

<a id="dd-docs-084"></a>

**DD-DOCS-084 — Ownership-boundary tests are mandatory design evidence**  
Tests shall demonstrate that rendering, AI, transformation, process, Nuxt, source-recognition or persistence success does not independently establish Docs-domain success when Docs acceptance conditions are unsatisfied.

---

## 18. Traceability

| Detailed Design contract(s) | Functional requirement(s) | Principal related DD authority |
|---|---|---|
| `DD-DOCS-001`–`004` | `FR-DOCS-001`–`018` | DD-1.1–1.5; DD-2.9 |
| `DD-DOCS-005`–`015` | `FR-DOCS-019`–`030`, `FR-DOCS-106`–`113` | DD-1.2; DD-1.3; DD-2.9 |
| `DD-DOCS-017`–`019` | `FR-DOCS-031`–`040` | DD-1.3; DD-2.9 |
| `DD-DOCS-020`–`021` | `FR-DOCS-041`–`050` | DD-2.4; DD-2.5; DD-2.9 |
| `DD-DOCS-022`–`024` | `FR-DOCS-051`–`060` | DD-1.3; DD-2.10; DD-3.3 |
| `DD-DOCS-025`–`026` | `FR-DOCS-061`–`066` | DD-2.4; DD-2.8 |
| `DD-DOCS-027` | `FR-DOCS-067`–`072` | DD-1.3; DD-2.4; DD-2.9 |
| `DD-DOCS-012`–`013`, `DD-DOCS-028`–`031`, `DD-DOCS-067`–`071` | `FR-DOCS-073`–`083`, `FR-DOCS-114`–`119` | DD-2.1; DD-2.5; DD-2.9 |
| `DD-DOCS-032`–`034`, `DD-DOCS-072`–`075` | `FR-DOCS-084`–`090`, `FR-DOCS-110` | DD-2.7; DD-2.9 |
| `DD-DOCS-035`–`037`, `DD-DOCS-050`, `DD-DOCS-056` | `FR-DOCS-091`–`099`, `FR-DOCS-118` | DD-2.2; DD-2.9 |
| `DD-DOCS-038`–`039`, `DD-DOCS-045`–`048` | `FR-DOCS-100`–`105` | DD-1.3; DD-2.4; DD-2.9 |
| `DD-DOCS-057`–`066` | `FR-DOCS-006`–`018`, `FR-DOCS-106`–`113` | DD-1.1; DD-1.2; DD-2.9 |
| `DD-DOCS-077`–`081` | provider/capability subordination across `FR-DOCS-*` | DD-2.4; DD-2.7; DD-2.9; ADR-0001 |
| `DD-DOCS-082`–`084` | design-level conformance across `FR-DOCS-*` | Domain DD Authoring Guide; DD-1/DD-2 contracts |

This grouped traceability expresses semantic contract families and does not imply one implementation component per Functional requirement.

---

## 19. Conformance Invariants

<a id="dd-docs-ci-001"></a>

### DD-DOCS-CI-001 — Application authority remains DD-1-owned

Docs consumes [Design](../appmanager-design-specification-v01.md#_6-2-application-engine-authority) through §5.

<a id="dd-docs-ci-002"></a>

### DD-DOCS-CI-002 — DD-2.9 remains the bounded Documentation Capability

The §6 Docs/DD-2.9 seam binds [Design](../appmanager-design-specification-v01.md#_6-6-capability-boundaries-and-providers).

<a id="dd-docs-ci-003"></a>

### DD-DOCS-CI-003 — Documentation recognition does not authorize mutation

Input/output recognition applies [Design](../appmanager-design-specification-v01.md#_9-9-non-destructive-ownership-and-unmanaged-content).

<a id="dd-docs-ci-004"></a>

### DD-DOCS-CI-004 — Documentation truth remains provenance-sensitive

Documentation provenance binds [FR-DOCS-037](../functional/docs-functional-specification-v01.md#fr-docs-037), [FR-DOCS-079](../functional/docs-functional-specification-v01.md#fr-docs-079) and [FR-DOCS-087](../functional/docs-functional-specification-v01.md#fr-docs-087); domain-fact conflicts use [DD-DOCCAP-021](../dd_2_shared_capabilities/dd-2-9-documentation-capability-detailed-design-v01.md#dd-doccap-021).

<a id="dd-docs-ci-005"></a>

### DD-DOCS-CI-005 — Source mutation remains DD-2.5-owned

Existing-document/source updates bind [FR-XFORM-033](../functional/source-transformation-functional-specification-v01.md#fr-xform-033) to DD-2.5.

<a id="dd-docs-ci-006"></a>

### DD-DOCS-CI-006 — Domain facts remain with their owners

Documented domain facts follow [Design](../appmanager-design-specification-v01.md#_10-11-cross-domain-workflows) and their §6 owning collaborators.

<a id="dd-docs-ci-007"></a>

### DD-DOCS-CI-007 — Technical success is subordinate evidence

Documentation stage evidence follows [Design](../appmanager-design-specification-v01.md#_11-11-workflow-results-failure-and-acceptance).

<a id="dd-docs-ci-008"></a>

### DD-DOCS-CI-008 — Completeness and freshness are truthful

Completeness and freshness follow [FR-DOCS-038](../functional/docs-functional-specification-v01.md#fr-docs-038), [FR-DOCS-040](../functional/docs-functional-specification-v01.md#fr-docs-040) and [FR-DOCS-081](../functional/docs-functional-specification-v01.md#fr-docs-081).

<a id="dd-docs-ci-009"></a>

### DD-DOCS-CI-009 — Partial effects remain truthful

Partial Docs effects follow [FR-INV-045](../functional/application-invocation-functional-specification-v01.md#fr-inv-045) and [FR-INV-046](../functional/application-invocation-functional-specification-v01.md#fr-inv-046).

<a id="dd-docs-ci-010"></a>

### DD-DOCS-CI-010 — Headless and interactive semantics remain equivalent

Docs target/profile projections apply [Design](../appmanager-design-specification-v01.md#_4-6-presentation-independence).

<a id="dd-docs-ci-011"></a>

### DD-DOCS-CI-011 — Provider independence is preserved

The §6 provider seams apply [Design](../appmanager-design-specification-v01.md#_6-6-capability-boundaries-and-providers).

<a id="dd-docs-ci-012"></a>

### DD-DOCS-CI-012 — Detailed Design remains topology-independent

Concrete module/class/service/package/directory/process/provider topology follows [the Implementation Specification boundary](../project-documentation-guide-v01.md#_8-level-4-implementation-specification).
