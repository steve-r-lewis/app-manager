# AppManager Quality Functional Specification

> **Status:** Version 1 Functional Specification
>
> **Functional domain:** `quality`
>
> **Requirement prefix:** `FR-QUAL`
>
> **Governing sources:** [Project Documentation Guide](../project-documentation-guide-v01.md), [AppManager Design Specification](../appmanager-design-specification-v01.md)
>
> **Related Functional Specifications:** [application-invocation-functional-specification-v01.md](application-invocation-functional-specification-v01.md), [managed-project-functional-specification-v01.md](managed-project-functional-specification-v01.md), [configuration-functional-specification-v01.md](configuration-functional-specification-v01.md), [source-transformation-functional-specification-v01.md](source-transformation-functional-specification-v01.md), [app-functional-specification-v01.md](app-functional-specification-v01.md), [git-functional-specification-v01.md](git-functional-specification-v01.md), [docs-functional-specification-v01.md](docs-functional-specification-v01.md)
>
> **Historical planning provenance (non-normative):** [docs/project_management/functional-specification-decomposition-plan-v01.md](../project_management/functional-specification-decomposition-plan-v01.md)

## 1. Purpose

This specification defines the observable Version 1 behaviour of the AppManager `quality` domain.

The `quality` domain owns quality-assurance intent and quality outcomes for managed applications and managed project scopes. It provides product-level behaviour for tests, coverage, linting, type checking, validation and quality gates without making any particular test runner, linter, type checker, package manager, process API or CI provider part of the Functional contract.

Version 1 supports running all tests, unit tests, end-to-end tests, coverage and a test UI, together with linting, type checking, validation, quality gates and structured Headless outcomes.

---

## 2. Functional Boundary

### 2.1 Owned behaviour

The `quality` domain owns the observable semantics of:

- running all supported tests for an approved scope;
- running unit tests;
- running end-to-end tests;
- producing or evaluating test coverage;
- launching supported test UI behaviour where retained;
- running lint checks;
- running type checks;
- running other approved validation checks;
- evaluating quality-gate policy from quality results;
- combining multiple quality checks into a coherent quality outcome;
- reporting pass, fail, partial, skipped, unavailable and indeterminate quality states;
- providing machine-consumable quality outcomes suitable for Headless automation;
- coordinating delegated quality providers while retaining application-level authority.

### 2.2 Explicit non-ownership

This specification does not define:

- application build, preview, dev or lifecycle semantics, which belong to `app`;
- repository status, commit, push or sync semantics, which belong to `git`;
- complete CI/CD workflow ownership;
- deployment semantics;
- source mutation or autofix mechanics, which are governed by the Source Transformation Functional Specification and the owning domain where applicable;
- project discovery or managed-scope authority, which belong to the Managed Project Functional Specification;
- exact package scripts, command strings, test-runner flags, process execution APIs, timeouts or source modules;
- a specific test framework, linter, type checker or coverage engine;
- the implementation structure of quality orchestrators, adapters, services or providers.

### 2.3 Core authority rules

<a id="fr-qual-001"></a>

**FR-QUAL-001 — Quality intent**  
A Quality invocation shall identify quality assurance as its primary application intent and shall not silently become a build, deployment, repository or source-mutation operation.

<a id="fr-qual-002"></a>

**FR-QUAL-002 — Application authority**  
Quality-provider delegation shall conform to [Design §6.2](../appmanager-design-specification-v01.md#_6-2-application-engine-authority), [Design §11.11](../appmanager-design-specification-v01.md#_11-11-workflow-results-failure-and-acceptance).

<a id="fr-qual-003"></a>

**FR-QUAL-003 — Provider result versus application result**  
Quality provider exits, text and raw reports shall apply [FR-INV-034](application-invocation-functional-specification-v01.md#fr-inv-034).

<a id="fr-qual-004"></a>

**FR-QUAL-004 — No implicit mutation**  
Quality checks shall be non-mutating by default. A provider capability that can modify source shall not be invoked in a mutating mode unless the selected use case explicitly authorizes that behaviour under applicable transformation rules.

<a id="fr-qual-005"></a>

**FR-QUAL-005 — No implicit CI ownership**  
A quality check invoked from CI remains a Quality-domain operation. The existence of a CI trigger shall not make the Quality domain responsible for the entire CI/CD workflow.

---

## 3. Common Invocation Behaviour

<a id="fr-qual-006"></a>

**FR-QUAL-006 — Structured invocation**  
Quality invocation and completion shall apply [FR-INV-007](application-invocation-functional-specification-v01.md#fr-inv-007), [FR-INV-033](application-invocation-functional-specification-v01.md#fr-inv-033).

<a id="fr-qual-007"></a>

**FR-QUAL-007 — Interaction-mode equivalence**  
Quality use across TUI, GUI, Headless, CI and IDE adapters shall apply [Design §4.6](../appmanager-design-specification-v01.md#_4-6-presentation-independence).

<a id="fr-qual-008"></a>

**FR-QUAL-008 — Deterministic Headless operation**  
Headless target/check selection shall apply [FR-INV-020](application-invocation-functional-specification-v01.md#fr-inv-020).

<a id="fr-qual-009"></a>

**FR-QUAL-009 — Unresolved selection**  
Unresolved Headless quality scope/check shall apply [FR-INV-020](application-invocation-functional-specification-v01.md#fr-inv-020), [FR-PROJ-042](managed-project-functional-specification-v01.md#fr-proj-042).

<a id="fr-qual-010"></a>

**FR-QUAL-010 — Interactive selection**  
Interactive quality action/scope selection shall apply [FR-INV-019](application-invocation-functional-specification-v01.md#fr-inv-019).

<a id="fr-qual-011"></a>

**FR-QUAL-011 — Availability**  
Recognised unavailable quality actions shall apply [FR-INV-015](application-invocation-functional-specification-v01.md#fr-inv-015).

<a id="fr-qual-012"></a>

**FR-QUAL-012 — Effective configuration**  
Configurable Quality behaviour shall apply [FR-CONFIG-020](configuration-functional-specification-v01.md#fr-config-020).

<a id="fr-qual-013"></a>

**FR-QUAL-013 — Managed project context**  
Project-scoped quality context shall apply [Design §9.2](../appmanager-design-specification-v01.md#_9-2-managed-project-context).

<a id="fr-qual-014"></a>

**FR-QUAL-014 — Managed scope**  
Consequential or multi-target quality execution shall apply [Design §9.7](../appmanager-design-specification-v01.md#_9-7-managed-scope-and-operation-targeting), [FR-PROJ-044](managed-project-functional-specification-v01.md#fr-proj-044).

<a id="fr-qual-015"></a>

**FR-QUAL-015 — Scope narrowing**  
Caller-requested narrower quality scope shall apply [FR-PROJ-041](managed-project-functional-specification-v01.md#fr-proj-041).

<a id="fr-qual-016"></a>

**FR-QUAL-016 — Scope expansion**  
Selected quality targets shall apply [FR-PROJ-042](managed-project-functional-specification-v01.md#fr-proj-042).

<a id="fr-qual-017"></a>

**FR-QUAL-017 — Cancellation**  
Quality operations supporting cancellation shall stop initiation of further work as soon as safely practical. Checks already completed, running or not started shall be reported under [FR-INV-031](application-invocation-functional-specification-v01.md#fr-inv-031).

<a id="fr-qual-018"></a>

**FR-QUAL-018 — Progress**  
Long-running or multi-check quality execution shall apply [FR-INV-027](application-invocation-functional-specification-v01.md#fr-inv-027).

---

## 4. Quality Target and Scope Model

<a id="fr-qual-019"></a>

**FR-QUAL-019 — Semantic target**  
Quality semantic-target resolution shall apply [Design §9.6](../appmanager-design-specification-v01.md#_9-6-project-discovery-and-context-resolution), [FR-PROJ-005](managed-project-functional-specification-v01.md#fr-proj-005).

<a id="fr-qual-020"></a>

**FR-QUAL-020 — Root target**  
Quality checks may target the managed root application where that scope is supported.

<a id="fr-qual-021"></a>

**FR-QUAL-021 — Layer target**  
Quality checks may target a selected managed layer where that layer exposes the required quality capability.

<a id="fr-qual-022"></a>

**FR-QUAL-022 — All-managed target**  
A quality use case may target the complete eligible managed project, including root and managed layers, according to the operation's scope semantics.

<a id="fr-qual-023"></a>

**FR-QUAL-023 — Explicit subset**  
Where supported, a quality operation may target an explicit subset of managed units and shall report per-target outcomes.

<a id="fr-qual-024"></a>

**FR-QUAL-024 — No filesystem-only authority**  
Discovered quality target candidates shall apply [FR-PROJ-044](managed-project-functional-specification-v01.md#fr-proj-044).

<a id="fr-qual-025"></a>

**FR-QUAL-025 — Target capability**  
A target shall be considered eligible for a requested quality action only when the required quality capability can be recognized or configured sufficiently to execute that action.

<a id="fr-qual-026"></a>

**FR-QUAL-026 — Unsupported target**  
Managed targets lacking the required quality capability shall apply [FR-QUAL-098](quality-functional-specification-v01.md#fr-qual-098).

<a id="fr-qual-027"></a>

**FR-QUAL-027 — Duplicate target normalization**  
Overlapping scopes shall not unintentionally execute the same logical quality target more than once in the same operation unless explicitly requested.

<a id="fr-qual-028"></a>

**FR-QUAL-028 — Stable target reporting**  
Structured outcomes shall identify quality targets sufficiently for automation to distinguish root, layer and multi-target results.

---

## 5. Test Execution

<a id="fr-qual-029"></a>

**FR-QUAL-029 — Run-all-tests use case**  
AppManager shall provide a use case for running all supported tests for the selected quality scope.

<a id="fr-qual-030"></a>

**FR-QUAL-030 — Unit-test use case**  
AppManager shall provide a use case for running supported unit tests for the selected quality scope.

<a id="fr-qual-031"></a>

**FR-QUAL-031 — End-to-end-test use case**  
AppManager shall provide a use case for running supported end-to-end tests for the selected quality scope.

<a id="fr-qual-032"></a>

**FR-QUAL-032 — Test selection semantics**  
All-tests, unit-test and end-to-end-test actions shall remain semantically distinct even where a concrete implementation delegates more than one action to the same underlying test framework.

<a id="fr-qual-033"></a>

**FR-QUAL-033 — Test provider independence**  
The Functional Specification shall not require Vitest or any other specific test runner.

<a id="fr-qual-034"></a>

**FR-QUAL-034 — Test discovery versus execution**  
Recognition that tests exist shall not itself execute them or establish a passing quality result.

<a id="fr-qual-035"></a>

**FR-QUAL-035 — No tests found**  
If a target validly contains no tests for the requested category, AppManager shall distinguish that state from provider failure and from tests passing.

<a id="fr-qual-036"></a>

**FR-QUAL-036 — Test failure**  
A failing test shall contribute a failed test outcome even where the delegated provider process itself completed normally from an execution perspective.

<a id="fr-qual-037"></a>

**FR-QUAL-037 — Test infrastructure failure**  
Failure to start or complete the test provider shall be distinguishable from test assertions failing.

<a id="fr-qual-038"></a>

**FR-QUAL-038 — Incomplete execution**  
A test run interrupted, cancelled or otherwise incomplete shall not be represented as a complete pass.

<a id="fr-qual-039"></a>

**FR-QUAL-039 — Per-target test results**  
Multi-target test operations shall retain per-target status rather than collapse all results into a single undifferentiated message.

<a id="fr-qual-040"></a>

**FR-QUAL-040 — Per-category results**  
Where multiple test categories run in one operation, results shall identify which categories passed, failed, were skipped, were unavailable or were incomplete.

---

## 6. Test UI

<a id="fr-qual-041"></a>

**FR-QUAL-041 — Test UI use case**  
Where a supported test provider exposes an interactive test UI capability, AppManager may expose that capability as a Quality use case.

<a id="fr-qual-042"></a>

**FR-QUAL-042 — UI capability availability**  
The test UI action shall be available only when the selected target and provider support an applicable UI capability.

<a id="fr-qual-043"></a>

**FR-QUAL-043 — UI is not a test result**  
Successfully launching a test UI shall not itself be reported as tests passing.

<a id="fr-qual-044"></a>

**FR-QUAL-044 — Long-running execution**  
A test UI may be a long-running operation and shall expose execution state and cancellation semantics through the common invocation model where supported.

<a id="fr-qual-045"></a>

**FR-QUAL-045 — Headless semantics**  
A test UI action shall not be required for Headless quality validation. Headless automation shall have non-UI quality actions capable of producing machine-consumable results.

---

## 7. Coverage

<a id="fr-qual-046"></a>

**FR-QUAL-046 — Coverage use case**  
AppManager shall provide a use case for producing or evaluating test coverage for the selected quality scope where coverage capability is available.

<a id="fr-qual-047"></a>

**FR-QUAL-047 — Coverage provider independence**  
The Functional Specification shall not mandate a particular coverage implementation or report format.

<a id="fr-qual-048"></a>

**FR-QUAL-048 — Coverage measurement**  
A coverage outcome shall distinguish successful measurement from inability to collect coverage.

<a id="fr-qual-049"></a>

**FR-QUAL-049 — Coverage data**  
Where available, structured outcomes may expose normalized coverage measures such as statement, branch, function or line coverage without requiring callers to parse provider-specific reports.

<a id="fr-qual-050"></a>

**FR-QUAL-050 — Coverage thresholds**  
If effective quality policy defines coverage thresholds, AppManager shall evaluate them explicitly as quality-gate criteria rather than treating coverage generation alone as success.

<a id="fr-qual-051"></a>

**FR-QUAL-051 — Missing threshold**  
Absence of a configured threshold shall not cause AppManager to invent one.

<a id="fr-qual-052"></a>

**FR-QUAL-052 — Threshold failure**  
Coverage below an applicable required threshold shall produce a failing gate criterion even if coverage collection itself succeeded.

<a id="fr-qual-053"></a>

**FR-QUAL-053 — Partial coverage**  
Where coverage is produced for only part of the requested managed scope, AppManager shall report incomplete or partial coverage rather than imply complete-project coverage.

---

## 8. Linting

<a id="fr-qual-054"></a>

**FR-QUAL-054 — Lint use case**  
AppManager shall provide a quality use case for linting supported managed targets where a lint capability is recognized or configured.

<a id="fr-qual-055"></a>

**FR-QUAL-055 — Lint provider independence**  
The Functional Specification shall not mandate ESLint or any particular linter.

<a id="fr-qual-056"></a>

**FR-QUAL-056 — Lint findings**  
Lint findings shall be interpreted according to applicable effective policy so that warnings and errors can contribute appropriately to the quality outcome.

<a id="fr-qual-057"></a>

**FR-QUAL-057 — Warning policy**  
Quality warnings evaluated under effective gate policy shall apply [FR-INV-039](application-invocation-functional-specification-v01.md#fr-inv-039).

<a id="fr-qual-058"></a>

**FR-QUAL-058 — Lint infrastructure failure**  
Failure to invoke or complete the linter shall be distinguishable from the linter successfully reporting code findings.

<a id="fr-qual-059"></a>

**FR-QUAL-059 — Non-mutating lint default**  
Ordinary lint execution shall apply [FR-QUAL-004](quality-functional-specification-v01.md#fr-qual-004).

<a id="fr-qual-060"></a>

**FR-QUAL-060 — Autofix boundary**  
If a future quality use case exposes lint autofix, it shall be a separately explicit mutating intent governed by Source Transformation requirements and shall not be implied by ordinary lint execution.

---

## 9. Type Checking

<a id="fr-qual-061"></a>

**FR-QUAL-061 — Type-check use case**  
AppManager shall provide a quality use case for type checking supported managed targets where a type-check capability is recognized or configured.

<a id="fr-qual-062"></a>

**FR-QUAL-062 — Type-check provider independence**  
The Functional Specification shall not mandate TypeScript, `vue-tsc` or any particular type-check implementation.

<a id="fr-qual-063"></a>

**FR-QUAL-063 — Type diagnostics**  
Type-check diagnostics shall contribute to the quality outcome according to the semantics of the selected capability and applicable quality policy.

<a id="fr-qual-064"></a>

**FR-QUAL-064 — Type-check failure**  
A provider completing with type errors shall be distinguishable from failure to start or execute the type-check provider.

<a id="fr-qual-065"></a>

**FR-QUAL-065 — Scope fidelity**  
Type-check scope fidelity shall apply [FR-PROJ-042](managed-project-functional-specification-v01.md#fr-proj-042).

---

## 10. General Validation

<a id="fr-qual-066"></a>

**FR-QUAL-066 — Validation use cases**  
The Quality domain may expose additional read-only validation use cases where validation is the primary intent and no more specific product domain owns that behaviour.

<a id="fr-qual-067"></a>

**FR-QUAL-067 — Domain-specific validation**  
Validation whose product identity clearly belongs to another domain shall remain owned by that domain even if its result contributes to an aggregate quality gate.

<a id="fr-qual-068"></a>

**FR-QUAL-068 — Source validity**  
Source validation after transformation shall apply [FR-XFORM-048](source-transformation-functional-specification-v01.md#fr-xform-048).

<a id="fr-qual-069"></a>

**FR-QUAL-069 — Validation result normalization**  
Provider-specific validation outcomes shall be interpreted into structured AppManager validation results where the selected use case requires machine consumption.

<a id="fr-qual-070"></a>

**FR-QUAL-070 — Indeterminate validation**  
Indeterminate validation findings shall apply [FR-QUAL-099](quality-functional-specification-v01.md#fr-qual-099).

---

## 11. Quality Gates

<a id="fr-qual-071"></a>

**FR-QUAL-071 — Quality-gate use case**  
AppManager shall support evaluation of a quality gate composed from one or more quality criteria where effective policy defines such a gate.

<a id="fr-qual-072"></a>

**FR-QUAL-072 — Explicit gate criteria**  
A quality gate shall be based on explicit effective criteria and shall not silently invent additional mandatory checks.

<a id="fr-qual-073"></a>

**FR-QUAL-073 — Gate composition**  
A gate may combine tests, coverage, linting, type checking and other approved validation criteria while preserving each criterion's individual outcome.

<a id="fr-qual-074"></a>

**FR-QUAL-074 — Required versus optional criteria**  
Gate policy shall distinguish required criteria from optional or advisory checks where such a distinction exists.

<a id="fr-qual-075"></a>

**FR-QUAL-075 — Gate pass**  
A quality gate shall pass only when all required criteria have outcomes satisfying the effective gate policy.

<a id="fr-qual-076"></a>

**FR-QUAL-076 — Gate fail**  
A failed required criterion shall cause the gate to fail unless policy explicitly defines a different aggregation rule.

<a id="fr-qual-077"></a>

**FR-QUAL-077 — Gate unavailable**  
If a required criterion cannot run because its capability is unavailable, the gate shall not be reported as passed merely because no failing result was produced.

<a id="fr-qual-078"></a>

**FR-QUAL-078 — Gate incomplete**  
Cancellation or incomplete execution of a required criterion shall prevent a complete gate pass.

<a id="fr-qual-079"></a>

**FR-QUAL-079 — Advisory checks**  
Failure or unavailability of advisory checks shall be represented separately from required gate failure according to effective policy.

<a id="fr-qual-080"></a>

**FR-QUAL-080 — Gate provenance**  
Structured gate outcomes shall identify the effective criteria evaluated and their resulting statuses sufficiently for automation to understand why the gate passed, failed or remained indeterminate.

---

## 12. Composite Quality Runs

<a id="fr-qual-081"></a>

**FR-QUAL-081 — Composite quality operation**  
AppManager may provide an aggregate quality operation that executes a defined set of quality checks for a target or managed scope.

<a id="fr-qual-082"></a>

**FR-QUAL-082 — Composite policy**  
The checks included in an aggregate quality operation shall be determined by the selected use case and effective quality policy rather than by whatever provider commands happen to exist.

<a id="fr-qual-083"></a>

**FR-QUAL-083 — Ordering**  
Where execution order is functionally significant, AppManager shall apply a deterministic ordering defined by policy or the use case.

<a id="fr-qual-084"></a>

**FR-QUAL-084 — Fail-fast policy**  
Whether a composite quality operation stops after the first required failure or continues to gather additional results shall be explicit policy rather than an accidental property of provider execution.

<a id="fr-qual-085"></a>

**FR-QUAL-085 — Continue-on-failure**  
Where policy permits continuation, later checks may run after an earlier failure so that the final result can report a fuller quality picture.

<a id="fr-qual-086"></a>

**FR-QUAL-086 — Partial execution**  
A composite operation that does not execute all required checks shall not be represented as a complete quality pass.

<a id="fr-qual-087"></a>

**FR-QUAL-087 — Per-check outcomes**  
Composite results shall preserve each check's identity, target, status and diagnostically useful result summary.

---

## 13. CI/CD and Automation Boundary

<a id="fr-qual-088"></a>

**FR-QUAL-088 — CI invocation equivalence**  
CI/automation quality invocation shall apply [Design §4.6](../appmanager-design-specification-v01.md#_4-6-presentation-independence).

<a id="fr-qual-089"></a>

**FR-QUAL-089 — Quality does not own CI/CD**  
Quality participation in CI/CD shall apply [FR-QUAL-005](quality-functional-specification-v01.md#fr-qual-005).

<a id="fr-qual-090"></a>

**FR-QUAL-090 — Cross-domain CI composition**  
CI/CD composition of App, Quality, Git and deployment/provider operations shall conform to [Design §6.2](../appmanager-design-specification-v01.md#_6-2-application-engine-authority), [Design §11.11](../appmanager-design-specification-v01.md#_11-11-workflow-results-failure-and-acceptance).

<a id="fr-qual-091"></a>

**FR-QUAL-091 — Quality before push/deploy**  
Quality results may be consumed as prerequisites or gates by higher-level workflows, but the Quality domain shall not itself perform Git push or deployment unless a separate owning use case explicitly composes those domains.

<a id="fr-qual-092"></a>

**FR-QUAL-092 — Machine-consumable status**  
Headless/CI quality and gate status shall apply [FR-INV-021](application-invocation-functional-specification-v01.md#fr-inv-021).

<a id="fr-qual-093"></a>

**FR-QUAL-093 — Automation-safe ambiguity**  
CI/Headless ambiguity in scope, provider or gate policy shall apply [FR-INV-020](application-invocation-functional-specification-v01.md#fr-inv-020), [FR-PROJ-042](managed-project-functional-specification-v01.md#fr-proj-042).

---

## 14. Result Semantics

<a id="fr-qual-094"></a>

**FR-QUAL-094 — Structured success**  
A successful quality result shall identify the requested check, resolved scope and application-level outcome.

<a id="fr-qual-095"></a>

**FR-QUAL-095 — Structured failure**  
A failed quality result shall identify whether failure arose from findings, failed tests, threshold failure, provider execution, configuration, target resolution, gate policy or another defined stage.

<a id="fr-qual-096"></a>

**FR-QUAL-096 — Partial success**  
Multi-check or multi-target operations shall represent mixed outcomes explicitly rather than collapsing them to a single undifferentiated status.

<a id="fr-qual-097"></a>

**FR-QUAL-097 — Skipped status**  
A check intentionally skipped by applicable policy shall be distinguishable from unavailable, failed or not-yet-run.

<a id="fr-qual-098"></a>

**FR-QUAL-098 — Unavailable status**  
A check that cannot run because its required capability is unavailable shall be distinguishable from a passing check.

<a id="fr-qual-099"></a>

**FR-QUAL-099 — Indeterminate status**  
Where AppManager cannot reliably determine pass or fail, the result shall be represented as indeterminate rather than successful.

<a id="fr-qual-100"></a>

**FR-QUAL-100 — Diagnostics**  
Quality diagnostics shall apply [FR-INV-040](application-invocation-functional-specification-v01.md#fr-inv-040).

<a id="fr-qual-101"></a>

**FR-QUAL-101 — Provider output abstraction**  
Provider-independent Quality status shall apply [FR-INV-021](application-invocation-functional-specification-v01.md#fr-inv-021).

<a id="fr-qual-102"></a>

**FR-QUAL-102 — Provider details**  
Provider-specific details may be included as supplemental diagnostics without becoming the primary application contract.

<a id="fr-qual-103"></a>

**FR-QUAL-103 — Result stability**  
Equivalent quality invocations against materially equivalent inputs and effective configuration should produce semantically equivalent structured outcomes, subject to genuine external or timing-dependent variation.

---

## 15. Failure, Cancellation and Concurrency

<a id="fr-qual-104"></a>

**FR-QUAL-104 — Provider start failure**  
Quality provider start failures shall apply [FR-QUAL-095](quality-functional-specification-v01.md#fr-qual-095).

<a id="fr-qual-105"></a>

**FR-QUAL-105 — Non-zero completion**  
A delegated provider's non-zero completion shall not be silently treated as success; it shall be interpreted according to that provider capability and the owning quality use case.

<a id="fr-qual-106"></a>

**FR-QUAL-106 — Timeout policy**  
If a quality operation has a timeout, that timeout shall come from explicit applicable policy or configuration rather than an undocumented hard-coded Functional assumption.

<a id="fr-qual-107"></a>

**FR-QUAL-107 — Cancellation truthfulness**  
Already-completed quality checks at cancellation shall apply [FR-QUAL-017](quality-functional-specification-v01.md#fr-qual-017).

<a id="fr-qual-108"></a>

**FR-QUAL-108 — No implicit rollback**  
Any future mutating Quality action shall apply [FR-INV-046](application-invocation-functional-specification-v01.md#fr-inv-046). Ordinary non-mutating checks have no source rollback requirement.

<a id="fr-qual-109"></a>

**FR-QUAL-109 — Concurrent quality runs**  
Where concurrent quality invocations could interfere through shared provider state or generated artefacts, AppManager shall handle the conflict deliberately rather than silently corrupt or misattribute results.

<a id="fr-qual-110"></a>

**FR-QUAL-110 — Stale context**  
If managed-project or configuration state changes materially between scope resolution and execution and that change can be detected, AppManager shall avoid presenting results as if they unquestionably apply to the original resolved state.

---

## 16. Safety and Non-Destructive Behaviour

<a id="fr-qual-111"></a>

**FR-QUAL-111 — Read-only default**  
Tests, coverage, lint, type checking and validation shall apply [FR-QUAL-004](quality-functional-specification-v01.md#fr-qual-004).

<a id="fr-qual-112"></a>

**FR-QUAL-112 — Generated quality artefacts**  
Quality tools may produce recognized temporary or report artefacts, but those delegated effects shall not grant Quality authority to modify unrelated source or project configuration.

<a id="fr-qual-113"></a>

**FR-QUAL-113 — No silent autofix**  
Provider autofix modes shall apply [FR-QUAL-060](quality-functional-specification-v01.md#fr-qual-060).

<a id="fr-qual-114"></a>

**FR-QUAL-114 — Managed-scope protection**  
Unmanaged external quality targets shall apply [Design §9.9](../appmanager-design-specification-v01.md#_9-9-non-destructive-ownership-and-unmanaged-content).

<a id="fr-qual-115"></a>

**FR-QUAL-115 — Sensitive-information protection**  
Quality diagnostics and structured results shall apply [FR-INV-040](application-invocation-functional-specification-v01.md#fr-inv-040).

<a id="fr-qual-116"></a>

**FR-QUAL-116 — Fail-safe scope ambiguity**  
Ambiguous quality target/gate scope shall apply [FR-PROJ-061](managed-project-functional-specification-v01.md#fr-proj-061).

---

## 17. Traceability Summary

| Functional area | Requirements | Upstream / same-level authority | Downstream refinement destination |
|---|---|---|---|
| Domain boundary and authority | FR-QUAL-001–005 | This specification; Root Design §§1, 3, 6, 10 | Owning domain/shared-contract Detailed Design |
| Invocation | FR-QUAL-006–018 | This specification; Root Design §§4–7; FR-INV, FR-PROJ, FR-CONFIG | Owning domain/shared-contract Detailed Design |
| Target and scope | FR-QUAL-019–028 | This specification §4; FR-PROJ; root managed-project model | Owning domain/shared-contract Detailed Design |
| Tests | FR-QUAL-029–040 | This specification §5 | Owning domain/shared-contract Detailed Design |
| Test UI | FR-QUAL-041–045 | This specification §6 | Owning domain/shared-contract Detailed Design |
| Coverage | FR-QUAL-046–053 | This specification §7 | Owning domain/shared-contract Detailed Design |
| Linting | FR-QUAL-054–060 | This specification §8; Root Design quality domain | Owning domain/shared-contract Detailed Design |
| Type checking | FR-QUAL-061–065 | This specification §9; Root Design quality domain | Owning domain/shared-contract Detailed Design |
| Validation | FR-QUAL-066–070 | This specification §10; Root Design quality/validation responsibility | Owning domain/shared-contract Detailed Design |
| Quality gates | FR-QUAL-071–080 | This specification §11; Root Design | Owning domain/shared-contract Detailed Design |
| Composite runs | FR-QUAL-081–087 | This specification §12; Application Engine workflow authority | Owning domain/shared-contract Detailed Design |
| CI/CD boundary | FR-QUAL-088–093 | This specification §13; Git Functional Specification CI/CD boundary; Root Design | Owning domain/shared-contract Detailed Design |
| Results | FR-QUAL-094–103 | This specification §14; FR-INV; Application Engine authority | Owning domain/shared-contract Detailed Design |
| Failure/concurrency | FR-QUAL-104–110 | This specification §15; FR-INV; managed context and delegated execution rules | Owning domain/shared-contract Detailed Design |
| Safety | FR-QUAL-111–116 | This specification §16; Root Design safety; FR-PROJ; FR-XFORM | Owning domain/shared-contract Detailed Design |

---

## 18. Downstream Specification Boundary

Detailed Design may define permanent internal contracts for quality orchestration, provider capabilities, normalized test/coverage/lint/type-check result models, gate evaluation and composite quality execution.

Implementation Specifications may define concrete TypeScript modules, package scripts, Vitest or alternative test-runner commands, linter/type-check providers, process APIs, CI bindings, report parsers, timeouts and output paths.

Neither level may redefine the Functional ownership or gate semantics established here without an approved change to the governing specification hierarchy.

---

## 19. Version 1 Functional Baseline

This document is the Version 1 Functional owner for its stated concern. Its requirement identities remain stable under the [Project Documentation Guide](../project-documentation-guide-v01.md#_9-traceability).
