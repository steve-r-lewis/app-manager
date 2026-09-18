# DD-4.1 — AppManager Quality Domain Detailed Design

> **Detailed Design ID:** DD-4.1
>
> **Design family:** DD-4 — Policy and Resource Domains
>
> **Status:** Version 1 Detailed Design Specification
>
> **Detailed Design authority:** This document defines the permanent Quality-domain orchestration, target/scope policy, quality-gate policy, decision, state and result contracts by which AppManager realises quality-assurance use cases through the DD-1 Application Core and DD-2 Shared Capability contracts.
>
> **Governing sources:** [Project Documentation Guide](../project-documentation-guide-v01.md), [AppManager Design Specification](../appmanager-design-specification-v01.md), [docs/functional/quality-functional-specification-v01.md](../functional/quality-functional-specification-v01.md), accepted ADRs, and the normative DD-1/DD-2 Detailed Designs and active clarifications.
>
> **Authoring controls:** [Detailed Design Register](../project_management/detailed-design-register-v01.md), [Domain Detailed Design Authoring Guide](../project_management/domain-detailed-design-authoring-guide-v02.md)

---

## 1. Purpose

This specification refines [Quality Functional contracts](../functional/quality-functional-specification-v01.md) for quality-assurance intent. Its operation policy, check plan, measurements and gate decisions connect tests, coverage, linting, type checking, validation and composite runs. Provider execution, check evidence and gate interpretation occupy separate stages in the local workflow.

The collaboration in §§5–6 applies [Design §6.2](../appmanager-design-specification-v01.md#_6-2-application-engine-authority) and [§6.6](../appmanager-design-specification-v01.md#_6-6-capability-boundaries-and-providers) to the domain’s context, specialist delegation and final acceptance.

## 2. Scope

### 2.1 In Scope

This design owns permanent Quality-domain contracts for:

- Quality-domain operation identity and applicability;
- root, selected-layer, explicit-subset and all-managed quality-scope interpretation over DD-1.3 managed-project context;
- operation-specific target eligibility and capability requirements;
- all-tests, unit-test and end-to-end-test orchestration;
- test-UI intent and long-running Quality-domain interpretation;
- coverage collection intent and coverage-threshold policy;
- linting and warning-policy interpretation;
- type-check orchestration and scope fidelity;
- residual general validation where quality is the primary product intent and no more specific domain owns the validation;
- quality-gate criterion selection, required/advisory classification and gate-policy interpretation;
- composite quality plan selection, ordering, fail-fast/continue-on-failure policy and partial execution semantics;
- multi-target result aggregation without loss of per-target/per-check truth;
- interpretation of DD-2.8 capability evidence against requested Quality intent;
- cancellation, timeout, stale-context, concurrency and generated-quality-artefact interpretation;
- Quality-domain security and sensitive-information constraints;
- deterministic Headless/CI semantics and machine-consumable Quality payloads;
- cross-domain consumption of Quality evidence without transferring workflow authority.

### 2.2 Out of Scope

This design does not own or redefine:

- canonical invocation identity, caller authorization evidence, cancellation linkage or interaction-mode semantics owned by DD-1.1 Application Invocation;
- canonical success, failure, partial-success, cancellation, diagnostics, warnings or effect semantics owned by DD-1.2 Execution Outcomes;
- managed-project identity, target topology, managed scope or targetability authority owned by DD-1.3 Managed Project;
- configuration precedence, provenance or effective-value construction owned by DD-1.4 Configuration Resolution;
- application-wide dispatch, final authority, final acceptance or outcome publication owned by DD-1.5 Application Engine;
- resource mechanics owned by DD-2.1 Resource Access;
- provider process execution mechanics owned by DD-2.2 Process Execution;
- repository semantics owned by DD-2.3 Repository Capability and DD-3.2 Git Domain;
- source recognition owned by DD-2.4 Source Intelligence;
- source mutation, autofix implementation, preservation or stale-write mechanics owned by DD-2.5 Source Transformation;
- AI execution or generated-remediation mechanics owned by DD-2.7 AI Capability;
- bounded quality capability recognition, provider normalization, findings/measurements, criterion evaluation and provider isolation owned by DD-2.8 Quality Capability;
- documentation semantics owned by DD-2.9/DD-3.4;
- Nuxt-specific validation owned by DD-2.10/DD-3.3 where Nuxt is the primary intent;
- App build/dev/preview/reset/deployment semantics;
- complete CI/CD orchestration;
- exact package scripts, commands, flags, TypeScript interfaces, classes, services, source paths, report formats, provider APIs, package topology or runtime wiring.

---

## 3. Governing Requirements and Authorities

### 3.1 Functional ownership

The Quality domain owns `FR-QUAL-001` through `FR-QUAL-116` from [docs/functional/quality-functional-specification-v01.md](../functional/quality-functional-specification-v01.md).

| Functional range | Quality-domain concern |
|---|---|
| `FR-QUAL-001`–`005` | domain authority and non-ownership |
| `FR-QUAL-006`–`018` | invocation, availability, scope and cancellation |
| `FR-QUAL-019`–`028` | target and scope model |
| `FR-QUAL-029`–`040` | test execution |
| `FR-QUAL-041`–`045` | test UI |
| `FR-QUAL-046`–`053` | coverage |
| `FR-QUAL-054`–`060` | linting |
| `FR-QUAL-061`–`065` | type checking |
| `FR-QUAL-066`–`070` | general validation |
| `FR-QUAL-071`–`080` | quality gates |
| `FR-QUAL-081`–`087` | composite quality runs |
| `FR-QUAL-088`–`093` | CI/CD and automation boundary |
| `FR-QUAL-094`–`103` | result semantics |
| `FR-QUAL-104`–`110` | failure, cancellation and concurrency |
| `FR-QUAL-111`–`116` | safety and non-destructive behaviour |

### 3.2 Application Core authorities

This design consumes, but does not redefine, DD-1.1 through DD-1.5 and the active Application Core clarifications. In particular:

- DD-1.1 supplies normalized invocation, explicit selections, cancellation and interaction-independent inputs;
- DD-1.2 owns canonical outcomes, diagnostics, warnings, effects, cancellation and subordinate-result semantics;
- DD-1.3 owns managed-project identity, managed units and authoritative managed scope;
- DD-1.4 owns effective configuration and provenance;
- DD-1.5 retains application-wide orchestration authority and final acceptance.

### 3.3 Shared capability authority

[DD-2.8 — Quality Capability](../dd_2_shared_capabilities/dd-2-8-quality-capability-detailed-design-v01.md) is the principal shared capability beneath this domain.

The Quality domain supplies quality intent, approved target/scope, operation-specific policy, gate/composite policy and domain acceptance conditions. DD-2.8 supplies bounded capability recognition, provider selection under governed inputs, normalized check execution, findings, measurements, generated artefact evidence, explicit criterion evaluation and provider-isolated technical evidence.

Process Execution remains beneath provider mechanics; Source Transformation owns any separately authorised mutation; other domains retain their domain-specific validation semantics.

### 3.4 Accepted runtime decision

ADR-0001 permits Node.js/TypeScript for Version 1 implementation but does not authorize implementation topology at Detailed Design level.

---

## 4. Domain Responsibility and Authority Boundary

### 4.1 Quality-domain ownership

The Quality domain owns:

- semantic identity of Quality use cases;
- operation-specific target and scope interpretation from authoritative DD-1.3 context;
- operation-specific eligibility decisions above bounded capability recognition;
- selection of required quality checks for the requested use case;
- Quality policy for warnings, thresholds, required/advisory checks and acceptable missing/incomplete states;
- gate composition and domain interpretation of gate evidence;
- composite execution ordering and continuation policy where application-visible;
- distinction between quality defect, provider/infrastructure failure, unavailable capability, skipped work, incomplete work and indeterminate result;
- Quality-domain interpretation of long-running test-UI state;
- interpretation of generated quality artefacts as bounded effects;
- Quality-specific per-check/per-target payloads and recovery information.

### 4.2 Authority retained elsewhere

| Concern | Authoritative owner | Quality-domain relationship |
|---|---|---|
| invocation semantics | DD-1.1 | consumes normalized Quality intent, explicit scope, cancellation and caller correlation |
| canonical outcomes | DD-1.2 | supplies Quality-specific payload/evidence; does not redefine canonical taxonomy |
| managed scope | DD-1.3 | consumes authoritative root/layer/subset/all-managed targetability |
| effective configuration | DD-1.4 | consumes operation snapshot; does not reconstruct precedence |
| final application authority | DD-1.5 | Quality interprets domain evidence; Engine publishes final outcome |
| quality recognition/execution | DD-2.8 | delegates bounded checks and consumes normalized evidence |
| process mechanics | DD-2.2 | remains below Quality Capability/provider |
| source mutation/autofix | DD-2.5 | requires separate explicit mutating intent; never implied by read-only Quality checks |
| domain-specific validation | owning domain | Quality may consume supplied result but does not absorb semantic ownership |
| CI/CD workflow | owning automation/workflow | consumes Quality evidence without transferring complete workflow ownership |

### 4.3 Architectural position

```text
normalized invocation
        |
        v
Application Engine authority
        |
        +--> DD-1.3 managed project / approved scope
        +--> DD-1.4 effective configuration
        +--> DD-1.1 cancellation / interaction context
        |
        v
Quality-domain intent / policy / orchestration
        |
        +--> DD-2.8 Quality Capability
        |       +--> provider / DD-2.2 Process Execution
        |       +--> normalized findings / measurements / criterion evidence
        |
        +--> other bounded domain/capability evidence only where explicitly required
        |
        v
Quality-domain interpretation / per-check / gate result
        |
        v
Application Engine acceptance
        |
        v
canonical DD-1.2 outcome
```

This is an authority model, not a required runtime call graph.

---

## 5. Consumed DD-1 Application Core Contracts

| DD-1 contract | Quality-domain use |
|---|---|
| Application Invocation | receives canonical Quality intent, explicit target/check selection, cancellation and adapter-independent request data |
| Execution Outcomes | carries Quality-specific findings, measurements, criterion/gate payloads, subordinate evidence and partial execution |
| Managed Project | supplies authoritative root/layer/subset/all-managed scope and targetability |
| Configuration Resolution | supplies quality policy, provider constraints, thresholds, warning policy, timeouts and composite/gate settings |
| Application Engine | provides execution context and accepts/publishes final application outcome |

<a id="dd-qual-001"></a>

### DD-QUAL-001 — No local reconstruction of Application Core authority

Quality consumes Application Core context under [Design](../appmanager-design-specification-v01.md#_6-2-application-engine-authority) through §5.

<a id="dd-qual-002"></a>

### DD-QUAL-002 — Operation-effective policy is immutable for interpretation

A Quality use case shall interpret check/gate evidence against the effective policy resolved for that operation unless a deliberate re-resolution/retry path is initiated after material context change.

---

## 6. Consumed DD-2 Shared Capabilities

### 6.1 Quality Capability

DD-2.8 supplies target-relative quality capability recognition, bounded provider execution, normalized findings/measurements, test and coverage evidence, lint/type/validation evidence, explicit gate-criterion evaluation, composite execution evidence, generated artefact evidence, cancellation, concurrency and stale-context evidence.

<a id="dd-qual-003"></a>

### DD-QUAL-003 — Capability completion is subordinate evidence

Check and provider evidence is interpreted under [Design](../appmanager-design-specification-v01.md#_11-11-workflow-results-failure-and-acceptance).

<a id="dd-qual-004"></a>

### DD-QUAL-004 — Domain policy precedes provider execution

The Quality domain shall establish the requested check class, approved target/scope and applicable policy before delegating bounded execution.

### 6.2 Process Execution

The Quality domain shall not expose arbitrary command execution. Provider execution remains governed by DD-2.2 through DD-2.8/provider contracts.

### 6.3 Source Transformation

Ordinary Quality checks are non-source-mutating. Any future explicit remediation/autofix workflow shall require separately authorised transformation semantics and shall not be smuggled into a read-only check.

### 6.4 Other specialist authorities

Nuxt, Docs and other domain-specific validations retain their semantic owners even when their evidence contributes to a broader Quality gate.

<a id="dd-qual-005"></a>

### DD-QUAL-005 — Similar tool mechanics do not transfer semantic ownership

Tool sharing follows [FR-QUAL-067](../functional/quality-functional-specification-v01.md#fr-qual-067); the executable does not determine the semantic owner.


---

## 7. Domain Contract Model

### 7.1 Operation identity

Version 1 Quality operation identities include at least:

- `all_tests`;
- `unit_tests`;
- `end_to_end_tests`;
- `coverage`;
- `test_ui` where supported;
- `lint`;
- `type_check`;
- `validate` for approved residual Quality validation;
- `quality_gate`;
- `composite_quality` where a defined aggregate use case exists.

<a id="dd-qual-006"></a>

### DD-QUAL-006 — Operation identity is semantic

A package-script name, executable, CI job label or provider command shall not define canonical Quality operation identity.

### 7.2 Target and scope contract

A Quality scope may represent:

- managed root target;
- selected managed layer;
- explicit eligible managed subset;
- complete eligible managed project.

<a id="dd-qual-007"></a>

### DD-QUAL-007 — Stable managed identity is required

Quality targets bind [Design](../appmanager-design-specification-v01.md#_9-6-project-discovery-and-context-resolution) to the target model in §7.

<a id="dd-qual-008"></a>

### DD-QUAL-008 — Scope is operation-relative

The target model applies [FR-QUAL-025](../functional/quality-functional-specification-v01.md#fr-qual-025) separately for tests, coverage, lint, type checking and other approved Quality actions.

### 7.3 Eligibility decision

An operation-specific eligibility decision shall distinguish at least:

- eligible;
- ineligible/unsupported;
- unavailable because required capability/configuration is absent;
- indeterminate/ambiguous where applicability cannot safely be established.

<a id="dd-qual-009"></a>

### DD-QUAL-009 — Managed membership is not quality eligibility

Managed-target applicability applies [FR-QUAL-025](../functional/quality-functional-specification-v01.md#fr-qual-025) and [FR-QUAL-098](../functional/quality-functional-specification-v01.md#fr-qual-098).

### 7.4 Quality check interpretation

A Quality check result must preserve the distinction between:

- technical execution state;
- normalized quality state;
- findings/measurements;
- completeness;
- generated artefact effects;
- stale/context evidence.

<a id="dd-qual-010"></a>

### DD-QUAL-010 — Absence of failure is not pass

Non-pass interpretation applies [FR-QUAL-097](../functional/quality-functional-specification-v01.md#fr-qual-097), [FR-QUAL-098](../functional/quality-functional-specification-v01.md#fr-qual-098) and [FR-QUAL-099](../functional/quality-functional-specification-v01.md#fr-qual-099). Any acceptable treatment of skipped, incomplete, cancelled or not-attempted evidence for a higher-level decision requires explicit governing policy.

### 7.5 Quality criterion

A Quality criterion binds:

- criterion identity;
- source check/measurement;
- target/scope;
- required or advisory classification;
- acceptance/comparison rule;
- missing/unavailable/incomplete treatment;
- resulting criterion evidence.

<a id="dd-qual-011"></a>

### DD-QUAL-011 — Criteria originate from approved policy

Criteria bind [FR-QUAL-072](../functional/quality-functional-specification-v01.md#fr-qual-072), [FR-QUAL-051](../functional/quality-functional-specification-v01.md#fr-qual-051) and [FR-INV-039](../functional/application-invocation-functional-specification-v01.md#fr-inv-039) to the operation-effective policy.

### 7.6 Gate result

A gate result shall preserve criterion identity and evidence sufficient to explain pass, fail or non-pass/indeterminate status.

<a id="dd-qual-012"></a>

### DD-QUAL-012 — Gate success is criterion-relative

Gate acceptance applies [FR-QUAL-075](../functional/quality-functional-specification-v01.md#fr-qual-075), [FR-QUAL-077](../functional/quality-functional-specification-v01.md#fr-qual-077) and [FR-QUAL-078](../functional/quality-functional-specification-v01.md#fr-qual-078).

### 7.7 Composite plan

A composite plan defines selected checks, targets, ordering and continuation policy without becoming a generic application workflow model.

<a id="dd-qual-013"></a>

### DD-QUAL-013 — Composite plans remain Quality-bounded

The composite plan binds [FR-QUAL-081](../functional/quality-functional-specification-v01.md#fr-qual-081) and [FR-QUAL-001](../functional/quality-functional-specification-v01.md#fr-qual-001).

### 7.8 Quality result payload

The Quality domain may extend DD-1.2 outcomes with payloads containing:

- requested Quality operation;
- resolved scope;
- per-target and per-check results;
- gate criteria and gate result where applicable;
- findings/measurements summaries;
- generated quality artefacts;
- skipped/unavailable/not-attempted reasons;
- stale/context warnings;
- recommended retry or follow-up information.

<a id="dd-qual-014"></a>

### DD-QUAL-014 — No competing outcome envelope

Quality-specific data composes the [DD-1.2 outcome contract](../dd_1_application_core/dd-1-2-execution-outcomes-detailed-design-v01.md#_7-outcome-contract).


---

## 8. Use-Case Orchestration

### 8.1 Common flow

A consequential Quality use case shall conceptually:

1. receive normalized invocation and cancellation context;
2. consume authoritative managed-project context;
3. consume effective configuration/policy;
4. resolve operation identity and requested scope;
5. derive eligible target set;
6. establish operation-specific Quality policy;
7. delegate bounded recognition/execution to DD-2.8;
8. interpret normalized evidence against requested intent/policy;
9. preserve partial/mixed states;
10. return Quality-domain payload to the Application Engine for final acceptance.

<a id="dd-qual-015"></a>

### DD-QUAL-015 — Target set precedes execution

Establish the Quality target set under [Design](../appmanager-design-specification-v01.md#_9-7-managed-scope-and-operation-targeting) before provider execution.

<a id="dd-qual-016"></a>

### DD-QUAL-016 — Capability recognition is non-executing

Recognition that a target supports a check shall not itself execute the check or establish a passing state.

### 8.2 Test orchestration

All-tests, unit-tests and end-to-end-tests remain semantically distinct.

<a id="dd-qual-017"></a>

### DD-QUAL-017 — Category fidelity is preserved

Test category fidelity applies [FR-QUAL-032](../functional/quality-functional-specification-v01.md#fr-qual-032).

<a id="dd-qual-018"></a>

### DD-QUAL-018 — No-tests is interpreted deliberately

No-tests interpretation applies [FR-QUAL-035](../functional/quality-functional-specification-v01.md#fr-qual-035); acceptable treatment is operation/policy specific.

<a id="dd-qual-019"></a>

### DD-QUAL-019 — Assertion failure and infrastructure failure remain distinct

Test execution interpretation applies [FR-QUAL-036](../functional/quality-functional-specification-v01.md#fr-qual-036) and [FR-QUAL-037](../functional/quality-functional-specification-v01.md#fr-qual-037).

### 8.3 Test UI orchestration

<a id="dd-qual-020"></a>

### DD-QUAL-020 — Test UI launch is not test success

Test UI state applies [FR-QUAL-043](../functional/quality-functional-specification-v01.md#fr-qual-043) and [FR-QUAL-044](../functional/quality-functional-specification-v01.md#fr-qual-044).

<a id="dd-qual-021"></a>

### DD-QUAL-021 — Headless validation never depends on test UI

Automation uses [FR-QUAL-045](../functional/quality-functional-specification-v01.md#fr-qual-045).

### 8.4 Coverage orchestration

<a id="dd-qual-022"></a>

### DD-QUAL-022 — Measurement and threshold acceptance are separate

Coverage collection and acceptance apply [FR-QUAL-048](../functional/quality-functional-specification-v01.md#fr-qual-048), [FR-QUAL-050](../functional/quality-functional-specification-v01.md#fr-qual-050) and [FR-QUAL-052](../functional/quality-functional-specification-v01.md#fr-qual-052).

<a id="dd-qual-023"></a>

### DD-QUAL-023 — Partial coverage cannot represent complete scope

Coverage completeness applies [FR-QUAL-053](../functional/quality-functional-specification-v01.md#fr-qual-053).

### 8.5 Lint orchestration

<a id="dd-qual-024"></a>

### DD-QUAL-024 — Lint is non-mutating by default

Ordinary lint binds [FR-QUAL-004](../functional/quality-functional-specification-v01.md#fr-qual-004) to provider mode selection.

<a id="dd-qual-025"></a>

### DD-QUAL-025 — Warning significance is policy-driven

Warning interpretation follows [FR-QUAL-056](../functional/quality-functional-specification-v01.md#fr-qual-056) and [FR-INV-039](../functional/application-invocation-functional-specification-v01.md#fr-inv-039).

### 8.6 Type-check orchestration

<a id="dd-qual-026"></a>

### DD-QUAL-026 — Type diagnostics differ from provider failure

Type-check findings and infrastructure failure apply [FR-QUAL-064](../functional/quality-functional-specification-v01.md#fr-qual-064).

<a id="dd-qual-027"></a>

### DD-QUAL-027 — Type-check scope cannot silently broaden

Type-check provider project mechanics apply [FR-PROJ-042](../functional/managed-project-functional-specification-v01.md#fr-proj-042) to the resolved Quality scope.

### 8.7 Residual validation

<a id="dd-qual-028"></a>

### DD-QUAL-028 — Quality validation is residual

Residual validation applies [FR-QUAL-066](../functional/quality-functional-specification-v01.md#fr-qual-066) and [FR-QUAL-067](../functional/quality-functional-specification-v01.md#fr-qual-067); transformation validation remains governed by [FR-XFORM-048](../functional/source-transformation-functional-specification-v01.md#fr-xform-048).

### 8.8 Quality-gate orchestration

A gate flow shall conceptually:

1. resolve effective gate policy;
2. establish criterion set and required/advisory classification;
3. obtain or execute required bounded checks;
4. evaluate each criterion against normalized evidence;
5. preserve unavailable/incomplete/indeterminate states;
6. aggregate according to explicit gate policy;
7. return criterion provenance and gate decision.

<a id="dd-qual-029"></a>

### DD-QUAL-029 — Required unavailable/incomplete work blocks an ordinary complete pass

Required unavailable/incomplete criteria apply [FR-QUAL-077](../functional/quality-functional-specification-v01.md#fr-qual-077) and [FR-QUAL-078](../functional/quality-functional-specification-v01.md#fr-qual-078).

<a id="dd-qual-030"></a>

### DD-QUAL-030 — Advisory state remains separate

Advisory checks apply [FR-QUAL-079](../functional/quality-functional-specification-v01.md#fr-qual-079).

### 8.9 Composite Quality orchestration

<a id="dd-qual-031"></a>

### DD-QUAL-031 — Composite check set is explicit

Composite membership follows [FR-QUAL-082](../functional/quality-functional-specification-v01.md#fr-qual-082).

<a id="dd-qual-032"></a>

### DD-QUAL-032 — Ordering is deterministic where significant

Significant check ordering follows [FR-QUAL-083](../functional/quality-functional-specification-v01.md#fr-qual-083).

<a id="dd-qual-033"></a>

### DD-QUAL-033 — Fail-fast versus continuation is explicit policy

Continuation decisions apply [FR-QUAL-084](../functional/quality-functional-specification-v01.md#fr-qual-084) and [FR-QUAL-085](../functional/quality-functional-specification-v01.md#fr-qual-085).

<a id="dd-qual-034"></a>

### DD-QUAL-034 — Unstarted work remains visible

Checks not attempted because of fail-fast, cancellation or prerequisite failure shall remain represented with reason.

### 8.10 Cross-domain consumption

<a id="dd-qual-035"></a>

### DD-QUAL-035 — Passing Quality does not push, build or deploy

Quality completion applies [FR-QUAL-091](../functional/quality-functional-specification-v01.md#fr-qual-091) and [FR-QUAL-001](../functional/quality-functional-specification-v01.md#fr-qual-001) in enclosing workflows.


---

## 9. Domain State and State Transitions

A Quality use case may conceptually progress through:

```text
context_resolved
    -> scope_resolved
    -> eligibility_established
    -> policy_resolved
    -> executing
    -> interpreting
    -> accepted | rejected | partially_completed | cancelled | indeterminate
```

Per-target/per-check state may additionally distinguish:

- not_attempted;
- running;
- passed;
- failed;
- skipped;
- unavailable;
- incomplete;
- indeterminate;
- cancelled.

<a id="dd-qual-036"></a>

### DD-QUAL-036 — Domain state does not replace provider state

Provider running/exited states and Quality check/gate states shall remain distinguishable.

<a id="dd-qual-037"></a>

### DD-QUAL-037 — Completed evidence remains immutable history

Completed evidence applies [FR-INV-045](../functional/application-invocation-functional-specification-v01.md#fr-inv-045) when another check fails or cancellation occurs.

<a id="dd-qual-038"></a>

### DD-QUAL-038 — Long-running UI state is explicit

An active test UI follows [FR-QUAL-043](../functional/quality-functional-specification-v01.md#fr-qual-043) and [FR-QUAL-044](../functional/quality-functional-specification-v01.md#fr-qual-044).

<a id="dd-qual-039"></a>

### DD-QUAL-039 — Indeterminate is first-class

Unreliable pass/fail interpretation applies [FR-QUAL-099](../functional/quality-functional-specification-v01.md#fr-qual-099); unavailable capability applies [FR-QUAL-098](../functional/quality-functional-specification-v01.md#fr-qual-098).


---

## 10. Domain Policy and Decision Rules

<a id="dd-qual-040"></a>

### DD-QUAL-040 — Scope never broadens by convenience

Missing capability/provider constraints remain subject to [FR-PROJ-042](../functional/managed-project-functional-specification-v01.md#fr-proj-042).

<a id="dd-qual-041"></a>

### DD-QUAL-041 — Provider defaults are not application policy

Provider default thresholds, warning treatment, discovery scope or fail-fast behavior shall not redefine AppManager Quality policy unless explicitly adopted by effective configuration/use-case policy.

<a id="dd-qual-042"></a>

### DD-QUAL-042 — No invented thresholds

Missing numeric criteria apply [FR-QUAL-051](../functional/quality-functional-specification-v01.md#fr-qual-051). Other required criteria must be supplied under [FR-QUAL-072](../functional/quality-functional-specification-v01.md#fr-qual-072).

<a id="dd-qual-043"></a>

### DD-QUAL-043 — Required/advisory semantics are explicit

Required/advisory roles apply [FR-QUAL-074](../functional/quality-functional-specification-v01.md#fr-qual-074); availability or CI convention does not select the role.

<a id="dd-qual-044"></a>

### DD-QUAL-044 — Skipped is not unavailable

Policy skip applies [FR-QUAL-097](../functional/quality-functional-specification-v01.md#fr-qual-097).

<a id="dd-qual-045"></a>

### DD-QUAL-045 — No provider-success shortcut

Provider completion is interpreted under [Design](../appmanager-design-specification-v01.md#_11-11-workflow-results-failure-and-acceptance) using the findings, measurement, completeness and gate models in §7.

<a id="dd-qual-046"></a>

### DD-QUAL-046 — CI context does not alter Quality meaning

CI/manual/Headless Quality intent applies [Design](../appmanager-design-specification-v01.md#_4-6-presentation-independence).


---

## 11. Safety, Mutation, and Authorization

The Quality domain is read-only with respect to source by default.

<a id="dd-qual-047"></a>

### DD-QUAL-047 — Recognition does not grant execution or mutation authority

Discovery of tests, scripts, tools, reports or configuration shall not independently authorize execution or mutation.

<a id="dd-qual-048"></a>

### DD-QUAL-048 — Ordinary Quality checks prohibit source autofix

Tests, coverage, lint, type checking and validation bind [FR-QUAL-004](../functional/quality-functional-specification-v01.md#fr-qual-004) to provider mode selection.

<a id="dd-qual-049"></a>

### DD-QUAL-049 — Future mutating Quality intents require separate authority

Future autofix uses [FR-QUAL-060](../functional/quality-functional-specification-v01.md#fr-qual-060); other remediation requires separately approved intent and the owning domain/DD-2.5 transformation contracts.

<a id="dd-qual-050"></a>

### DD-QUAL-050 — Generated reports do not expand mutation scope

Reports/caches/snapshots apply [FR-QUAL-112](../functional/quality-functional-specification-v01.md#fr-qual-112).

<a id="dd-qual-051"></a>

### DD-QUAL-051 — Ambiguous scope fails safely

Ambiguous target/provider/gate policy uses [FR-PROJ-061](../functional/managed-project-functional-specification-v01.md#fr-proj-061) and [FR-INV-020](../functional/application-invocation-functional-specification-v01.md#fr-inv-020) where Headless.

<a id="dd-qual-052"></a>

### DD-QUAL-052 — Target-derived provider inputs remain bounded

Target paths, filters and test names use [DD-PROC-014 structured arguments](../dd_2_shared_capabilities/dd-2-2-process-execution-detailed-design-v01.md#dd-proc-014).


---

## 12. Failure, Cancellation, and Partial Effects

<a id="dd-qual-053"></a>

### DD-QUAL-053 — Quality defect differs from infrastructure failure

Failure classification applies [FR-QUAL-095](../functional/quality-functional-specification-v01.md#fr-qual-095) to assertions, lint findings, type errors, thresholds and execution infrastructure.

<a id="dd-qual-054"></a>

### DD-QUAL-054 — Provider failure remains subordinate evidence

Provider start/timeout/runtime evidence is normalized under [DD-1.2 provider-result normalization](../dd_1_application_core/dd-1-2-execution-outcomes-detailed-design-v01.md#_18-provider-result-normalization) and interpreted for the requested check.

<a id="dd-qual-055"></a>

### DD-QUAL-055 — Cancellation stops future work

Check cancellation applies [FR-QUAL-017](../functional/quality-functional-specification-v01.md#fr-qual-017) and [DD-1.2 propagation](../dd_1_application_core/dd-1-2-execution-outcomes-detailed-design-v01.md#_17-cancellation-model).

<a id="dd-qual-056"></a>

### DD-QUAL-056 — Cancellation does not erase completed checks

Completed check results and generated effects apply [FR-INV-045](../functional/application-invocation-functional-specification-v01.md#fr-inv-045).

<a id="dd-qual-057"></a>

### DD-QUAL-057 — Incomplete required work cannot be complete pass

Required incomplete work applies [FR-QUAL-078](../functional/quality-functional-specification-v01.md#fr-qual-078) and [FR-QUAL-086](../functional/quality-functional-specification-v01.md#fr-qual-086).

<a id="dd-qual-058"></a>

### DD-QUAL-058 — Partial execution is first-class

Composite/multi-target evidence applies [FR-QUAL-096](../functional/quality-functional-specification-v01.md#fr-qual-096) and [FR-QUAL-087](../functional/quality-functional-specification-v01.md#fr-qual-087) with the local state distinctions in §7.

<a id="dd-qual-059"></a>

### DD-QUAL-059 — No universal rollback claim

Generated/provider effects apply [FR-INV-046](../functional/application-invocation-functional-specification-v01.md#fr-inv-046). Ordinary check behavior follows [FR-QUAL-004](../functional/quality-functional-specification-v01.md#fr-qual-004).

<a id="dd-qual-060"></a>

### DD-QUAL-060 — Retry requires fresh applicability

A retry after provider failure, timeout, cancellation or stale-context detection shall revalidate relevant target, capability and policy assumptions rather than blindly replay stale execution state.

---

## 13. Headless and Interaction Independence

<a id="dd-qual-061"></a>

### DD-QUAL-061 — One semantic model across adapters

Quality adapter intent follows [Design](../appmanager-design-specification-v01.md#_4-6-presentation-independence).

<a id="dd-qual-062"></a>

### DD-QUAL-062 — Interactive selection is presentation

Check/target/gate selection uses [FR-INV-019](../functional/application-invocation-functional-specification-v01.md#fr-inv-019) and the semantic models in §7.

<a id="dd-qual-063"></a>

### DD-QUAL-063 — Headless ambiguity fails

Headless/CI missing target/provider/gate inputs apply [FR-INV-020](../functional/application-invocation-functional-specification-v01.md#fr-inv-020).

<a id="dd-qual-064"></a>

### DD-QUAL-064 — Machine-consumable results are required

Per-check/per-target and gate results apply [FR-INV-021](../functional/application-invocation-functional-specification-v01.md#fr-inv-021).

<a id="dd-qual-065"></a>

### DD-QUAL-065 — Test UI is not required for automation

Test UI availability follows [FR-QUAL-045](../functional/quality-functional-specification-v01.md#fr-qual-045) for automation.


---

## 14. Concurrency, Idempotency, and Conflict Behaviour

<a id="dd-qual-066"></a>

### DD-QUAL-066 — Concurrent provider interference is handled deliberately

Provider contention applies [FR-QUAL-109](../functional/quality-functional-specification-v01.md#fr-qual-109). Ports, browsers, snapshots, caches, reports and provider-global state shall be isolated, serialized or rejected according to explicit semantics.

<a id="dd-qual-067"></a>

### DD-QUAL-067 — Result attribution survives concurrency

Concurrent invocation attribution applies [FR-QUAL-109](../functional/quality-functional-specification-v01.md#fr-qual-109) to reports, findings and generated artefacts.

<a id="dd-qual-068"></a>

### DD-QUAL-068 — Read-only checks are repeatable, not necessarily identical

Check repeatability applies [FR-QUAL-103](../functional/quality-functional-specification-v01.md#fr-qual-103), including legitimate timing, external-service and non-deterministic test variation.

<a id="dd-qual-069"></a>

### DD-QUAL-069 — Gate evaluation is deterministic over equivalent evidence and policy

Given materially equivalent normalized check evidence and gate policy, gate interpretation shall be materially equivalent.

<a id="dd-qual-070"></a>

### DD-QUAL-070 — Provider-global state is not canonical Quality state

One provider's internal watcher/server/cache state shall not define the AppManager Quality-domain state model.

<a id="dd-qual-071"></a>

### DD-QUAL-071 — Stale context is deliberate

Detected context changes apply [FR-QUAL-110](../functional/quality-functional-specification-v01.md#fr-qual-110). Source changes detected before execution or acceptance shall likewise produce revalidation, stale evidence or safe failure.


---

## 15. Security and Sensitive Information

<a id="dd-qual-072"></a>

### DD-QUAL-072 — Provider output is untrusted evidence

The domain consumes provider reports, stdout/stderr and findings through the [Quality Capability untrusted-evidence boundary](../dd_2_shared_capabilities/dd-2-8-quality-capability-detailed-design-v01.md#dd-qualcap-093).

<a id="dd-qual-073"></a>

### DD-QUAL-073 — Sensitive diagnostics are minimized

Quality diagnostics and results apply [FR-INV-040](../functional/application-invocation-functional-specification-v01.md#fr-inv-040) to credentials, protected environment and sensitive source.

<a id="dd-qual-074"></a>

### DD-QUAL-074 — Unbounded provider output is not an application contract

Provider output retained for diagnostics shall be bounded/normalized according to capability policy.

<a id="dd-qual-075"></a>

### DD-QUAL-075 — External tool execution stays within approved target

Provider working directory, project/configuration file and filters bind [Design](../appmanager-design-specification-v01.md#_9-7-managed-scope-and-operation-targeting) to the Quality target.

<a id="dd-qual-076"></a>

### DD-QUAL-076 — AI explanation cannot replace Quality truth

If AI is used to explain findings, normalized provider evidence and effective Quality policy remain authoritative for the Quality result.

---

## 16. Extensibility and Replaceability

<a id="dd-qual-077"></a>

### DD-QUAL-077 — Provider replacement preserves Quality semantics

DD-2.8 provider substitution follows [Design](../appmanager-design-specification-v01.md#_6-6-capability-boundaries-and-providers).

<a id="dd-qual-078"></a>

### DD-QUAL-078 — New check classes require semantic ownership

A new check may enter Quality only when its intent/result semantics and ownership are defined; arbitrary executable scripts shall not automatically become Quality operations.

<a id="dd-qual-079"></a>

### DD-QUAL-079 — No generic validation sink

Residual validation ownership follows [FR-QUAL-066](../functional/quality-functional-specification-v01.md#fr-qual-066) and [FR-QUAL-067](../functional/quality-functional-specification-v01.md#fr-qual-067).

<a id="dd-qual-080"></a>

### DD-QUAL-080 — No universal provider framework from shape similarity

Common provider patterns do not require one executable plugin system, shared base class or transport protocol in Version 1.

<a id="dd-qual-081"></a>

### DD-QUAL-081 — Implementation topology remains open

Concrete service/orchestrator/package/process/registry/module choices follow [the Implementation Specification boundary](../project-documentation-guide-v01.md#_8-level-4-implementation-specification).


---

## 17. Testability and Conformance Requirements

A conforming implementation shall provide deterministic design-level tests for at least:

- root/layer/subset/all-managed scope resolution;
- supported versus unavailable/unsupported target-check combinations;
- provider recognition without execution;
- all-tests/unit/end-to-end category fidelity;
- no-tests versus pass versus provider unavailable;
- assertion failure versus provider/infrastructure failure;
- test-UI launch/running state without test-pass fabrication;
- coverage collection versus threshold failure;
- missing threshold behavior;
- lint warnings under different effective policies;
- autofix remaining disabled for ordinary lint;
- type findings versus provider failure;
- domain-specific validation remaining outside residual Quality ownership;
- required versus advisory gate criteria;
- required unavailable/incomplete criterion blocking an ordinary complete pass;
- composite fail-fast and continue-on-failure policy;
- unstarted-check representation;
- overlapping target normalization;
- cancellation after completed checks;
- timeout and stale-context interpretation;
- generated quality artefact reporting;
- concurrency isolation/conflict behavior;
- Headless/CI semantic equivalence;
- provider substitution behind normalized DD-2.8 contracts;
- Quality evidence consumed by another workflow without Quality acquiring that workflow's authority.

<a id="dd-qual-082"></a>

### DD-QUAL-082 — Domain policy is testable without concrete providers

Core Quality-domain orchestration and evidence interpretation shall be testable using deterministic DD-2.8 substitutes rather than requiring a specific quality toolchain.

<a id="dd-qual-083"></a>

### DD-QUAL-083 — Provider tests do not define domain semantics

Concrete provider integration tests may verify tool mechanics but shall not redefine Quality-domain operation, scope, gate or outcome contracts.

<a id="dd-qual-084"></a>

### DD-QUAL-084 — Authority-boundary conformance is mandatory

Tests shall demonstrate that provider/process completion does not independently establish Quality-domain or final application success and that passing Quality does not independently authorize build, Git or deployment continuation.

---

## 18. Traceability

| Detailed Design contract(s) | Functional requirement(s) | Principal related DD authority |
|---|---|---|
| `DD-QUAL-001`–`005` | `FR-QUAL-001`–`018` | DD-1.1–1.5; DD-2.8 |
| `DD-QUAL-006`–`016` | `FR-QUAL-019`–`028`; cross-cutting invocation/scope | DD-1.3; DD-1.4; DD-2.8 |
| `DD-QUAL-017`–`019` | `FR-QUAL-029`–`040` | DD-2.8 |
| `DD-QUAL-020`–`021` | `FR-QUAL-041`–`045` | DD-2.8; DD-1.1 |
| `DD-QUAL-022`–`023` | `FR-QUAL-046`–`053` | DD-2.8; DD-1.4 |
| `DD-QUAL-024`–`025` | `FR-QUAL-054`–`060` | DD-2.8; DD-2.5 |
| `DD-QUAL-026`–`027` | `FR-QUAL-061`–`065` | DD-2.8 |
| `DD-QUAL-028` | `FR-QUAL-066`–`070` | DD-2.8; DD-2.5; owning domains |
| `DD-QUAL-011`–`012`, `DD-QUAL-029`–`030`, `DD-QUAL-042`–`045`, `DD-QUAL-069` | `FR-QUAL-071`–`080` | DD-1.4; DD-2.8 |
| `DD-QUAL-013`, `DD-QUAL-031`–`034`, `DD-QUAL-058` | `FR-QUAL-081`–`087` | DD-2.8; DD-1.5 |
| `DD-QUAL-035`, `DD-QUAL-046`, `DD-QUAL-061`–`065` | `FR-QUAL-088`–`093` | DD-1.1; DD-1.5; DD-3.1; DD-3.2 |
| `DD-QUAL-010`, `DD-QUAL-014`, `DD-QUAL-036`–`039`, `DD-QUAL-053`–`060` | `FR-QUAL-094`–`110` | DD-1.2; DD-2.8 |
| `DD-QUAL-047`–`052`, `DD-QUAL-066`–`076` | `FR-QUAL-111`–`116` | DD-1.3; DD-2.2; DD-2.5; DD-2.8 |
| `DD-QUAL-077`–`081` | provider/capability replaceability across `FR-QUAL-*` | DD-2.8; ADR-0001 |
| `DD-QUAL-082`–`084` | design-level conformance across `FR-QUAL-*` | Domain DD Authoring Guide; DD-1/DD-2 contracts |

This grouped traceability does not imply one implementation component per requirement or per contract.

---

## 19. Conformance Invariants

<a id="dd-qual-ci-001"></a>

### DD-QUAL-CI-001 — Application authority remains DD-1-owned

Quality consumes [Design](../appmanager-design-specification-v01.md#_6-2-application-engine-authority) through §5.

<a id="dd-qual-ci-002"></a>

### DD-QUAL-CI-002 — DD-2.8 remains the bounded Quality technical capability

The Quality/DD-2.8 seam in §6 binds [Design](../appmanager-design-specification-v01.md#_6-6-capability-boundaries-and-providers).

<a id="dd-qual-ci-003"></a>

### DD-QUAL-CI-003 — Provider execution is not Quality success

Provider evidence is interpreted under [Design](../appmanager-design-specification-v01.md#_11-11-workflow-results-failure-and-acceptance).

<a id="dd-qual-ci-004"></a>

### DD-QUAL-CI-004 — Check state and gate state remain distinct

Check/measurement versus gate acceptance follows [FR-QUAL-050](../functional/quality-functional-specification-v01.md#fr-qual-050) and [FR-QUAL-075](../functional/quality-functional-specification-v01.md#fr-qual-075).

<a id="dd-qual-ci-005"></a>

### DD-QUAL-CI-005 — Managed membership and Quality eligibility remain distinct

Managed-target eligibility applies [FR-QUAL-025](../functional/quality-functional-specification-v01.md#fr-qual-025).

<a id="dd-qual-ci-006"></a>

### DD-QUAL-CI-006 — Ordinary Quality remains non-source-mutating

Ordinary checks apply [FR-QUAL-004](../functional/quality-functional-specification-v01.md#fr-qual-004).

<a id="dd-qual-ci-007"></a>

### DD-QUAL-CI-007 — Domain-specific validation remains with its owner

Domain/transformation validation ownership follows [FR-QUAL-067](../functional/quality-functional-specification-v01.md#fr-qual-067) and [FR-XFORM-048](../functional/source-transformation-functional-specification-v01.md#fr-xform-048).

<a id="dd-qual-ci-008"></a>

### DD-QUAL-CI-008 — Partial and non-pass states remain truthful

Non-pass states apply [FR-QUAL-097](../functional/quality-functional-specification-v01.md#fr-qual-097), [FR-QUAL-098](../functional/quality-functional-specification-v01.md#fr-qual-098), [FR-QUAL-099](../functional/quality-functional-specification-v01.md#fr-qual-099) and [FR-QUAL-078](../functional/quality-functional-specification-v01.md#fr-qual-078); completed evidence applies [FR-INV-045](../functional/application-invocation-functional-specification-v01.md#fr-inv-045).

<a id="dd-qual-ci-009"></a>

### DD-QUAL-CI-009 — CI is an invocation context, not Quality ownership expansion

CI participation applies [FR-QUAL-005](../functional/quality-functional-specification-v01.md#fr-qual-005) and [Design](../appmanager-design-specification-v01.md#_4-6-presentation-independence).

<a id="dd-qual-ci-010"></a>

### DD-QUAL-CI-010 — Provider independence is preserved

The DD-2.8 provider seam applies [Design](../appmanager-design-specification-v01.md#_6-6-capability-boundaries-and-providers).

<a id="dd-qual-ci-011"></a>

### DD-QUAL-CI-011 — Passing Quality does not authorize unrelated effects

Enclosing workflows consume Quality evidence under [FR-QUAL-091](../functional/quality-functional-specification-v01.md#fr-qual-091) and [FR-QUAL-001](../functional/quality-functional-specification-v01.md#fr-qual-001).

<a id="dd-qual-ci-012"></a>

### DD-QUAL-CI-012 — Detailed Design remains topology-independent

Concrete module/class/service/directory/package/process/registry/CI topology follows [the Implementation Specification boundary](../project-documentation-guide-v01.md#_8-level-4-implementation-specification).
