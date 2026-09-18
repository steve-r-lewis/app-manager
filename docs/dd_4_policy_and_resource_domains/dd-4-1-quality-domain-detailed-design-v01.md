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

This specification defines the permanent internal Quality-domain design for quality-assurance intent across AppManager managed projects.

The Quality domain composes authoritative Application Core context with DD-2.8 Quality Capability and other bounded capabilities to realise tests, coverage, linting, type checking, approved validation, test UI operation, composite quality runs and quality-gate evaluation.

The governing rule is:

> **The Quality domain owns quality-assurance intent, operation-specific quality policy, quality-scope interpretation and Quality-domain acceptance; DD-2.8 Quality Capability owns bounded quality-capability recognition, execution, normalization and explicit criterion evaluation; the Application Engine retains final application authority.**

A second rule is:

> **Provider execution state, quality-check state, quality-gate state and final AppManager outcome are distinct semantic stages.**

A third rule is:

> **A Quality-domain use case is defined by quality intent, approved scope and required quality postconditions, not by one package script, test runner, linter, type checker, process command, CI provider or implementation topology.**

---

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

### DD-QUAL-001 — No local reconstruction of Application Core authority

The Quality domain shall not reconstruct managed scope, effective configuration, invocation semantics or canonical outcome semantics from package scripts, provider discovery, current working directory, CI environment variables or presentation choices.

### DD-QUAL-002 — Operation-effective policy is immutable for interpretation

A Quality use case shall interpret check/gate evidence against the effective policy resolved for that operation unless a deliberate re-resolution/retry path is initiated after material context change.

---

## 6. Consumed DD-2 Shared Capabilities

### 6.1 Quality Capability

DD-2.8 supplies target-relative quality capability recognition, bounded provider execution, normalized findings/measurements, test and coverage evidence, lint/type/validation evidence, explicit gate-criterion evaluation, composite execution evidence, generated artefact evidence, cancellation, concurrency and stale-context evidence.

### DD-QUAL-003 — Capability completion is subordinate evidence

Quality Capability or provider completion shall not by itself establish Quality-domain or final AppManager success.

### DD-QUAL-004 — Domain policy precedes provider execution

The Quality domain shall establish the requested check class, approved target/scope and applicable policy before delegating bounded execution.

### 6.2 Process Execution

The Quality domain shall not expose arbitrary command execution. Provider execution remains governed by DD-2.2 through DD-2.8/provider contracts.

### 6.3 Source Transformation

Ordinary Quality checks are non-source-mutating. Any future explicit remediation/autofix workflow shall require separately authorised transformation semantics and shall not be smuggled into a read-only check.

### 6.4 Other specialist authorities

Nuxt, Docs and other domain-specific validations retain their semantic owners even when their evidence contributes to a broader Quality gate.

### DD-QUAL-005 — Similar tool mechanics do not transfer semantic ownership

A validation implemented by the same executable/provider as a Quality check shall remain with its approved semantic owner where the primary intent belongs to another domain.

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

### DD-QUAL-006 — Operation identity is semantic

A package-script name, executable, CI job label or provider command shall not define canonical Quality operation identity.

### 7.2 Target and scope contract

A Quality scope may represent:

- managed root target;
- selected managed layer;
- explicit eligible managed subset;
- complete eligible managed project.

### DD-QUAL-007 — Stable managed identity is required

Consequential or multi-target Quality execution shall bind targets to authoritative managed identities rather than filesystem paths alone.

### DD-QUAL-008 — Scope is operation-relative

The same managed-project topology may yield different eligible targets for tests, coverage, lint, type checking or another Quality operation.

### 7.3 Eligibility decision

An operation-specific eligibility decision shall distinguish at least:

- eligible;
- ineligible/unsupported;
- unavailable because required capability/configuration is absent;
- indeterminate/ambiguous where applicability cannot safely be established.

### DD-QUAL-009 — Managed membership is not quality eligibility

A managed root/layer may exist within approved scope while remaining unavailable or unsupported for a particular Quality action.

### 7.4 Quality check interpretation

A Quality check result must preserve the distinction between:

- technical execution state;
- normalized quality state;
- findings/measurements;
- completeness;
- generated artefact effects;
- stale/context evidence.

### DD-QUAL-010 — Absence of failure is not pass

Unavailable, skipped, incomplete, indeterminate, cancelled or not-attempted states shall not be promoted to passed unless an explicit governing policy defines their acceptable treatment for the specific higher-level decision.

### 7.5 Quality criterion

A Quality criterion binds:

- criterion identity;
- source check/measurement;
- target/scope;
- required or advisory classification;
- acceptance/comparison rule;
- missing/unavailable/incomplete treatment;
- resulting criterion evidence.

### DD-QUAL-011 — Criteria originate from approved policy

The Quality domain shall not invent mandatory checks, coverage thresholds or warning-failure rules merely because a provider can expose them.

### 7.6 Gate result

A gate result shall preserve criterion identity and evidence sufficient to explain pass, fail or non-pass/indeterminate status.

### DD-QUAL-012 — Gate success is criterion-relative

A passing bounded check does not imply a passing gate when other required criteria remain failed, unavailable, incomplete or indeterminate.

### 7.7 Composite plan

A composite plan defines selected checks, targets, ordering and continuation policy without becoming a generic application workflow model.

### DD-QUAL-013 — Composite plans remain Quality-bounded

Composite Quality execution shall coordinate only approved Quality checks and shall not silently absorb build, Git, deployment or unrelated workflows.

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

### DD-QUAL-014 — No competing outcome envelope

Quality-specific result data shall compose with DD-1.2 rather than define a parallel application success/failure taxonomy.

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

### DD-QUAL-015 — Target set precedes execution

The Quality domain shall establish the intended managed target set before provider execution and shall not allow provider discovery to silently broaden it.

### DD-QUAL-016 — Capability recognition is non-executing

Recognition that a target supports a check shall not itself execute the check or establish a passing state.

### 8.2 Test orchestration

All-tests, unit-tests and end-to-end-tests remain semantically distinct.

### DD-QUAL-017 — Category fidelity is preserved

The Quality domain shall preserve requested test-category semantics even when one provider implements multiple categories.

### DD-QUAL-018 — No-tests is interpreted deliberately

A reliable no-tests state shall remain distinct from tests-passed and provider-unavailable; any acceptable treatment is operation/policy specific.

### DD-QUAL-019 — Assertion failure and infrastructure failure remain distinct

Tests that execute and fail assertions shall not be collapsed with inability to start/complete the provider.

### 8.3 Test UI orchestration

### DD-QUAL-020 — Test UI launch is not test success

Successfully starting a supported test UI establishes a long-running Quality tool state, not a passing test or gate result.

### DD-QUAL-021 — Headless validation never depends on test UI

Non-interactive Quality assurance shall remain expressible through non-UI operations with machine-consumable outcomes.

### 8.4 Coverage orchestration

### DD-QUAL-022 — Measurement and threshold acceptance are separate

Coverage collection success shall be interpreted separately from satisfaction of configured coverage criteria.

### DD-QUAL-023 — Partial coverage cannot represent complete scope

Coverage evidence that applies to only part of the requested scope shall retain that limitation.

### 8.5 Lint orchestration

### DD-QUAL-024 — Lint is non-mutating by default

Ordinary lint execution shall not enable autofix or other provider mutation modes.

### DD-QUAL-025 — Warning significance is policy-driven

Provider warning labels shall contribute according to effective Quality policy rather than universal hard-coded failure semantics.

### 8.6 Type-check orchestration

### DD-QUAL-026 — Type diagnostics differ from provider failure

Type findings returned by a completed type-check provider shall remain distinct from provider launch/configuration/infrastructure failure.

### DD-QUAL-027 — Type-check scope cannot silently broaden

Provider project mechanics shall not substitute a broader Quality scope without explicit operation semantics.

### 8.7 Residual validation

### DD-QUAL-028 — Quality validation is residual

General validation belongs to Quality only when validation is the primary intent and no more specific domain or DD-2.5 transformation contract owns the semantic purpose.

### 8.8 Quality-gate orchestration

A gate flow shall conceptually:

1. resolve effective gate policy;
2. establish criterion set and required/advisory classification;
3. obtain or execute required bounded checks;
4. evaluate each criterion against normalized evidence;
5. preserve unavailable/incomplete/indeterminate states;
6. aggregate according to explicit gate policy;
7. return criterion provenance and gate decision.

### DD-QUAL-029 — Required unavailable/incomplete work blocks an ordinary complete pass

A required criterion that cannot be established shall not silently become passing merely because no explicit failure finding exists.

### DD-QUAL-030 — Advisory state remains separate

Advisory failure/unavailability shall remain distinguishable from required gate failure according to effective policy.

### 8.9 Composite Quality orchestration

### DD-QUAL-031 — Composite check set is explicit

The selected use case/effective policy shall define the checks included; package-script discovery shall not define composite semantics.

### DD-QUAL-032 — Ordering is deterministic where significant

When order affects observable behavior, the Quality domain shall supply an explicit deterministic order.

### DD-QUAL-033 — Fail-fast versus continuation is explicit policy

Stopping after a failed required check versus continuing for fuller evidence shall not be an accidental provider property.

### DD-QUAL-034 — Unstarted work remains visible

Checks not attempted because of fail-fast, cancellation or prerequisite failure shall remain represented with reason.

### 8.10 Cross-domain consumption

### DD-QUAL-035 — Passing Quality does not push, build or deploy

A passing Quality result may be consumed by another workflow, but the Quality domain shall not perform or authorize Git push, build or deployment as an implicit consequence.

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

### DD-QUAL-036 — Domain state does not replace provider state

Provider running/exited states and Quality check/gate states shall remain distinguishable.

### DD-QUAL-037 — Completed evidence remains immutable history

Later cancellation or another check's failure shall not retroactively erase already completed check evidence.

### DD-QUAL-038 — Long-running UI state is explicit

An active test UI may remain running without forcing the parent Quality operation into a fabricated completed-test state.

### DD-QUAL-039 — Indeterminate is first-class

Where reliable pass/fail interpretation is impossible, the state shall remain indeterminate/unavailable as appropriate rather than defaulting to success.

---

## 10. Domain Policy and Decision Rules

### DD-QUAL-040 — Scope never broadens by convenience

Missing capability or provider constraints shall not cause automatic expansion from a selected target to a broader managed scope.

### DD-QUAL-041 — Provider defaults are not application policy

Provider default thresholds, warning treatment, discovery scope or fail-fast behavior shall not redefine AppManager Quality policy unless explicitly adopted by effective configuration/use-case policy.

### DD-QUAL-042 — No invented thresholds

Absence of configured coverage or other numeric criteria shall not cause the Quality domain to invent one.

### DD-QUAL-043 — Required/advisory semantics are explicit

Criteria shall not become required merely because they are available or commonly run in CI.

### DD-QUAL-044 — Skipped is not unavailable

Intentional policy skip shall remain distinct from inability to execute a capability.

### DD-QUAL-045 — No provider-success shortcut

A zero exit code or technically completed provider run shall not bypass findings, measurements, completeness or gate policy interpretation.

### DD-QUAL-046 — CI context does not alter Quality meaning

Equivalent Quality intent executed manually, Headless or within CI shall use equivalent scope, policy and interpretation semantics.

---

## 11. Safety, Mutation, and Authorization

The Quality domain is read-only with respect to source by default.

### DD-QUAL-047 — Recognition does not grant execution or mutation authority

Discovery of tests, scripts, tools, reports or configuration shall not independently authorize execution or mutation.

### DD-QUAL-048 — Ordinary Quality checks prohibit source autofix

Tests, coverage, lint, type checking and validation shall not silently invoke provider mutation modes.

### DD-QUAL-049 — Future mutating Quality intents require separate authority

Any approved future autofix/remediation use case shall be explicitly identified and shall route source changes through the owning domain/DD-2.5 transformation contracts.

### DD-QUAL-050 — Generated reports do not expand mutation scope

Permission for a provider to create an approved report/cache/snapshot does not authorize modification of unrelated source or configuration.

### DD-QUAL-051 — Ambiguous scope fails safely

Unresolved target, provider or gate-policy ambiguity shall not be resolved by selecting the broadest or most consequential interpretation.

### DD-QUAL-052 — Target-derived provider inputs remain bounded

Paths, filters, test names and related data shall remain structured provider inputs rather than unchecked shell fragments.

---

## 12. Failure, Cancellation, and Partial Effects

### DD-QUAL-053 — Quality defect differs from infrastructure failure

A failed assertion, lint finding, type error or threshold miss shall remain distinguishable from inability to invoke or complete the provider.

### DD-QUAL-054 — Provider failure remains subordinate evidence

A provider start/timeout/runtime failure shall be normalized and interpreted in the context of the requested Quality operation rather than becoming an unstructured application result.

### DD-QUAL-055 — Cancellation stops future work

Once cancellation is safely observed, new checks shall not be started and active providers shall receive cancellation where supported.

### DD-QUAL-056 — Cancellation does not erase completed checks

Already completed check results and generated effects shall remain truthful after cancellation.

### DD-QUAL-057 — Incomplete required work cannot be complete pass

Cancellation, timeout or partial provider completion of required checks shall prevent a fabricated complete gate/composite pass.

### DD-QUAL-058 — Partial execution is first-class

Multi-target/composite operations shall preserve exactly which checks/targets passed, failed, were skipped, unavailable, incomplete or not attempted.

### DD-QUAL-059 — No universal rollback claim

Ordinary Quality checks are generally non-mutating; generated provider artefacts or future authorised effects shall be reported truthfully rather than assumed rolled back.

### DD-QUAL-060 — Retry requires fresh applicability

A retry after provider failure, timeout, cancellation or stale-context detection shall revalidate relevant target, capability and policy assumptions rather than blindly replay stale execution state.

---

## 13. Headless and Interaction Independence

### DD-QUAL-061 — One semantic model across adapters

TUI, Headless, CI, IDE and future adapters shall express equivalent Quality intent through the same domain semantics.

### DD-QUAL-062 — Interactive selection is presentation

Menus for selecting checks, targets or gates shall not own semantic identity or policy.

### DD-QUAL-063 — Headless ambiguity fails

Headless/CI execution shall not prompt for unresolved required target, provider or gate-policy information.

### DD-QUAL-064 — Machine-consumable results are required

Automation shall be able to determine per-check/per-target state, gate decision and relevant diagnostics without parsing terminal-formatted provider text.

### DD-QUAL-065 — Test UI is not required for automation

Headless quality validation shall remain possible even where an interactive provider UI is unavailable or unsupported.

---

## 14. Concurrency, Idempotency, and Conflict Behaviour

### DD-QUAL-066 — Concurrent provider interference is handled deliberately

Where Quality executions can contend for ports, browsers, snapshots, caches, reports or provider-global state, the implementation shall isolate, serialize or reject according to explicit semantics.

### DD-QUAL-067 — Result attribution survives concurrency

Reports, findings and generated artefacts shall remain attributable to the correct invocation when concurrent execution is allowed.

### DD-QUAL-068 — Read-only checks are repeatable, not necessarily identical

Equivalent invocations against materially equivalent state should be semantically repeatable, while timing, external services or nondeterministic tests may legitimately vary.

### DD-QUAL-069 — Gate evaluation is deterministic over equivalent evidence and policy

Given materially equivalent normalized check evidence and gate policy, gate interpretation shall be materially equivalent.

### DD-QUAL-070 — Provider-global state is not canonical Quality state

One provider's internal watcher/server/cache state shall not define the AppManager Quality-domain state model.

### DD-QUAL-071 — Stale context is deliberate

Detected material changes to managed-project/configuration/source context between resolution and execution/acceptance shall produce revalidation, stale evidence or safe failure rather than unquestioned reuse.

---

## 15. Security and Sensitive Information

### DD-QUAL-072 — Provider output is untrusted evidence

Provider reports/stdout/stderr/findings shall not redefine AppManager commands, policy, scope or configuration.

### DD-QUAL-073 — Sensitive diagnostics are minimized

Results and diagnostics shall identify useful Quality failures without unnecessarily reproducing credentials, protected environment values or sensitive source content.

### DD-QUAL-074 — Unbounded provider output is not an application contract

Provider output retained for diagnostics shall be bounded/normalized according to capability policy.

### DD-QUAL-075 — External tool execution stays within approved target

Provider working directory, project/config file and filters shall remain bounded by the approved Quality target/scope.

### DD-QUAL-076 — AI explanation cannot replace Quality truth

If AI is used to explain findings, normalized provider evidence and effective Quality policy remain authoritative for the Quality result.

---

## 16. Extensibility and Replaceability

### DD-QUAL-077 — Provider replacement preserves Quality semantics

Replacing Vitest, a linter, a type checker, a coverage engine or another concrete provider shall not require callers to adopt provider-native result semantics.

### DD-QUAL-078 — New check classes require semantic ownership

A new check may enter Quality only when its intent/result semantics and ownership are defined; arbitrary executable scripts shall not automatically become Quality operations.

### DD-QUAL-079 — No generic validation sink

The residual validation operation shall not become a catch-all for behaviors with stronger App, Git, Docs, Nuxt, Settings or transformation ownership.

### DD-QUAL-080 — No universal provider framework from shape similarity

Common provider patterns do not require one executable plugin system, shared base class or transport protocol in Version 1.

### DD-QUAL-081 — Implementation topology remains open

These contracts do not imply one Quality service, orchestrator class, package, process, registry or module per responsibility.

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

### DD-QUAL-082 — Domain policy is testable without concrete providers

Core Quality-domain orchestration and evidence interpretation shall be testable using deterministic DD-2.8 substitutes rather than requiring a specific quality toolchain.

### DD-QUAL-083 — Provider tests do not define domain semantics

Concrete provider integration tests may verify tool mechanics but shall not redefine Quality-domain operation, scope, gate or outcome contracts.

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

### DD-QUAL-CI-001 — Application authority remains DD-1-owned

Quality shall not independently redefine managed scope, effective configuration, canonical outcomes, invocation semantics or final Application Engine acceptance.

### DD-QUAL-CI-002 — DD-2.8 remains the bounded Quality technical capability

Quality-domain intent/policy/orchestration shall remain distinct from capability recognition, provider mechanics, findings normalization and criterion evaluation.

### DD-QUAL-CI-003 — Provider execution is not Quality success

Process launch/completion/exit status shall remain subordinate evidence until interpreted against the requested Quality intent.

### DD-QUAL-CI-004 — Check state and gate state remain distinct

A passing check or coverage measurement shall not automatically establish a passing quality gate.

### DD-QUAL-CI-005 — Managed membership and Quality eligibility remain distinct

A managed target shall not be treated as supporting every Quality action merely because it belongs to the managed project.

### DD-QUAL-CI-006 — Ordinary Quality remains non-source-mutating

Tests, coverage, lint, type checking and validation shall not silently enable autofix or unrelated source mutation.

### DD-QUAL-CI-007 — Domain-specific validation remains with its owner

Nuxt, Docs, Source Transformation or another stronger semantic owner shall not be absorbed into Quality merely because similar tools or findings are involved.

### DD-QUAL-CI-008 — Partial and non-pass states remain truthful

Unavailable, incomplete, indeterminate, cancelled, skipped and not-attempted states shall not silently become pass, and completed evidence shall survive cancellation/failure.

### DD-QUAL-CI-009 — CI is an invocation context, not Quality ownership expansion

Execution from CI shall preserve Quality semantics and shall not transfer complete CI/CD workflow authority into DD-4.1.

### DD-QUAL-CI-010 — Provider independence is preserved

No concrete test runner, linter, type checker, coverage engine, package script, report format or provider-native model becomes the general Quality-domain contract.

### DD-QUAL-CI-011 — Passing Quality does not authorize unrelated effects

Quality evidence may be consumed by other workflows, but Quality shall not implicitly build, push, deploy or mutate source as a consequence of a pass.

### DD-QUAL-CI-012 — Detailed Design remains topology-independent

No responsibility in this document requires a particular TypeScript module, class, service, directory, package, process, provider registry or CI topology.

---

This document establishes the Version 1 DD-4.1 Quality-domain baseline. Implementation Specifications may reduce these contracts to concrete Node.js/TypeScript modules, provider bindings, quality tools, process integrations and tests under ADR-0001, but shall preserve the authority, scope, policy, evidence, safety and replaceability boundaries defined here.
