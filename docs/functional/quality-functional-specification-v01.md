# AppManager Quality Functional Specification

> **Status:** Version 1 Functional Specification
>
> **Functional domain:** `quality`
>
> **Requirement prefix:** `FR-QUAL`
>
> **Governing sources:** `docs/project-documentation-guide-v01.md`, `docs/appmanager-design-specification-v01.md`
>
> **Related Functional Specifications:** `application-invocation-functional-specification-v01.md`, `managed-project-functional-specification-v01.md`, `configuration-functional-specification-v01.md`, `source-transformation-functional-specification-v01.md`, `app-functional-specification-v01.md`, `git-functional-specification-v01.md`, `docs-functional-specification-v01.md`
>
> **Planning source:** `docs/project_management/functional-specification-decomposition-plan-v01.md`
>
> **Legacy reconciliation source:** `docs/design/appmanager-design-reconciliation-audit-v01.md`

## 1. Purpose

This specification defines the observable Version 1 behaviour of the AppManager `quality` domain.

The `quality` domain owns quality-assurance intent and quality outcomes for managed applications and managed project scopes. It provides product-level behaviour for tests, coverage, linting, type checking, validation and quality gates without making any particular test runner, linter, type checker, package manager, process API or CI provider part of the Functional contract.

The governing boundary is:

> **The `quality` domain owns quality intent, quality scope, quality interpretation and quality-gate outcomes. It does not own application build semantics, repository semantics, CI/CD orchestration, source transformation, or the implementation mechanics of delegated quality tools.**

This specification preserves the legacy requirements to run all tests, unit tests, end-to-end tests, coverage and a test UI, and extends them consistently with the approved root Design to include linting, type checking, validation, quality gates and structured Headless outcomes.

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

**FR-QUAL-001 — Quality intent**  
A Quality invocation shall identify quality assurance as its primary application intent and shall not silently become a build, deployment, repository or source-mutation operation.

**FR-QUAL-002 — Application authority**  
Delegated test runners, linters, type checkers, coverage tools and validators may execute specialist work, but the Application Engine shall remain authoritative for interpreting their results as AppManager quality outcomes.

**FR-QUAL-003 — Provider result versus application result**  
A provider exit code, textual message or raw report shall not alone define the AppManager quality outcome where additional application policy, scope or gate interpretation is required.

**FR-QUAL-004 — No implicit mutation**  
Quality checks shall be non-mutating by default. A provider capability that can modify source shall not be invoked in a mutating mode unless the selected use case explicitly authorizes that behaviour under applicable transformation rules.

**FR-QUAL-005 — No implicit CI ownership**  
A quality check invoked from CI remains a Quality-domain operation. The existence of a CI trigger shall not make the Quality domain responsible for the entire CI/CD workflow.

---

## 3. Common Invocation Behaviour

**FR-QUAL-006 — Structured invocation**  
Every Quality use case shall participate in the common Application Invocation Contract and return a structured application-level outcome.

**FR-QUAL-007 — Interaction-mode equivalence**  
TUI, Headless, CI, IDE and future adapters shall preserve equivalent quality intent, scope, policy and outcome semantics even where presentation differs.

**FR-QUAL-008 — Deterministic Headless operation**  
Headless quality execution shall not depend on interactive prompts for target or check selection. Required information shall be supplied or deterministically resolvable.

**FR-QUAL-009 — Unresolved selection**  
Where a required quality target or check cannot be resolved non-interactively, AppManager shall fail without guessing a broader or different scope.

**FR-QUAL-010 — Interactive selection**  
Interactive adapters may present available quality actions and scopes for selection, but the resulting invocation shall map to the same underlying semantics available to non-interactive callers.

**FR-QUAL-011 — Availability**  
A known quality action that is unavailable because its required provider, configuration, project facts or target is absent shall be distinguishable from an unknown action.

**FR-QUAL-012 — Effective configuration**  
Quality behaviour affected by configuration shall consume effective configuration according to the Configuration Functional Specification.

**FR-QUAL-013 — Managed project context**  
Project-scoped quality checks shall consume the resolved managed-project context and shall not reconstruct a competing project model.

**FR-QUAL-014 — Managed scope**  
Consequential or multi-target quality execution shall resolve and validate an explicit managed scope before running delegated providers.

**FR-QUAL-015 — Scope narrowing**  
A caller may request a narrower supported quality scope than the complete managed project where the selected use case permits it.

**FR-QUAL-016 — Scope expansion**  
A quality invocation shall not silently expand from a selected layer, repository or target to the entire managed project unless that broader scope was explicitly requested or is the defined semantics of the selected use case.

**FR-QUAL-017 — Cancellation**  
Where supported, cancellation shall stop future quality work as soon as safely practical and report checks already completed, running or not started.

**FR-QUAL-018 — Progress**  
Long-running or multi-check quality operations shall expose progress or execution events where functionally useful without making a particular UI presentation normative.

---

## 4. Quality Target and Scope Model

**FR-QUAL-019 — Semantic target**  
Quality operations shall resolve a semantic managed target rather than rely solely on current working directory.

**FR-QUAL-020 — Root target**  
Quality checks may target the managed root application where that scope is supported.

**FR-QUAL-021 — Layer target**  
Quality checks may target a selected managed layer where that layer exposes the required quality capability.

**FR-QUAL-022 — All-managed target**  
A quality use case may target the complete eligible managed project, including root and managed layers, according to the operation's scope semantics.

**FR-QUAL-023 — Explicit subset**  
Where supported, a quality operation may target an explicit subset of managed units and shall report per-target outcomes.

**FR-QUAL-024 — No filesystem-only authority**  
Directory presence alone shall not establish that a resource is an eligible quality target.

**FR-QUAL-025 — Target capability**  
A target shall be considered eligible for a requested quality action only when the required quality capability can be recognized or configured sufficiently to execute that action.

**FR-QUAL-026 — Unsupported target**  
A managed target that lacks the required quality capability shall be reported as unsupported or unavailable rather than falsely treated as passing.

**FR-QUAL-027 — Duplicate target normalization**  
Overlapping scopes shall not unintentionally execute the same logical quality target more than once in the same operation unless explicitly requested.

**FR-QUAL-028 — Stable target reporting**  
Structured outcomes shall identify quality targets sufficiently for automation to distinguish root, layer and multi-target results.

---

## 5. Test Execution

**FR-QUAL-029 — Run-all-tests use case**  
AppManager shall provide a use case for running all supported tests for the selected quality scope.

**FR-QUAL-030 — Unit-test use case**  
AppManager shall provide a use case for running supported unit tests for the selected quality scope.

**FR-QUAL-031 — End-to-end-test use case**  
AppManager shall provide a use case for running supported end-to-end tests for the selected quality scope.

**FR-QUAL-032 — Test selection semantics**  
All-tests, unit-test and end-to-end-test actions shall remain semantically distinct even where a concrete implementation delegates more than one action to the same underlying test framework.

**FR-QUAL-033 — Test provider independence**  
The Functional Specification shall not require Vitest or any other specific test runner.

**FR-QUAL-034 — Test discovery versus execution**  
Recognition that tests exist shall not itself execute them or establish a passing quality result.

**FR-QUAL-035 — No tests found**  
If a target validly contains no tests for the requested category, AppManager shall distinguish that state from provider failure and from tests passing.

**FR-QUAL-036 — Test failure**  
A failing test shall contribute a failed test outcome even where the delegated provider process itself completed normally from an execution perspective.

**FR-QUAL-037 — Test infrastructure failure**  
Failure to start or complete the test provider shall be distinguishable from test assertions failing.

**FR-QUAL-038 — Incomplete execution**  
A test run interrupted, cancelled or otherwise incomplete shall not be represented as a complete pass.

**FR-QUAL-039 — Per-target test results**  
Multi-target test operations shall retain per-target status rather than collapse all results into a single undifferentiated message.

**FR-QUAL-040 — Per-category results**  
Where multiple test categories run in one operation, results shall identify which categories passed, failed, were skipped, were unavailable or were incomplete.

---

## 6. Test UI

**FR-QUAL-041 — Test UI use case**  
Where a supported test provider exposes an interactive test UI capability, AppManager may expose that capability as a Quality use case.

**FR-QUAL-042 — UI capability availability**  
The test UI action shall be available only when the selected target and provider support an applicable UI capability.

**FR-QUAL-043 — UI is not a test result**  
Successfully launching a test UI shall not itself be reported as tests passing.

**FR-QUAL-044 — Long-running execution**  
A test UI may be a long-running operation and shall expose execution state and cancellation semantics through the common invocation model where supported.

**FR-QUAL-045 — Headless semantics**  
A test UI action shall not be required for Headless quality validation. Headless automation shall have non-UI quality actions capable of producing machine-consumable results.

---

## 7. Coverage

**FR-QUAL-046 — Coverage use case**  
AppManager shall provide a use case for producing or evaluating test coverage for the selected quality scope where coverage capability is available.

**FR-QUAL-047 — Coverage provider independence**  
The Functional Specification shall not mandate a particular coverage implementation or report format.

**FR-QUAL-048 — Coverage measurement**  
A coverage outcome shall distinguish successful measurement from inability to collect coverage.

**FR-QUAL-049 — Coverage data**  
Where available, structured outcomes may expose normalized coverage measures such as statement, branch, function or line coverage without requiring callers to parse provider-specific reports.

**FR-QUAL-050 — Coverage thresholds**  
If effective quality policy defines coverage thresholds, AppManager shall evaluate them explicitly as quality-gate criteria rather than treating coverage generation alone as success.

**FR-QUAL-051 — Missing threshold**  
Absence of a configured threshold shall not cause AppManager to invent one.

**FR-QUAL-052 — Threshold failure**  
Coverage below an applicable required threshold shall produce a failing gate criterion even if coverage collection itself succeeded.

**FR-QUAL-053 — Partial coverage**  
Where coverage is produced for only part of the requested managed scope, AppManager shall report incomplete or partial coverage rather than imply complete-project coverage.

---

## 8. Linting

**FR-QUAL-054 — Lint use case**  
AppManager shall provide a quality use case for linting supported managed targets where a lint capability is recognized or configured.

**FR-QUAL-055 — Lint provider independence**  
The Functional Specification shall not mandate ESLint or any particular linter.

**FR-QUAL-056 — Lint findings**  
Lint findings shall be interpreted according to applicable effective policy so that warnings and errors can contribute appropriately to the quality outcome.

**FR-QUAL-057 — Warning policy**  
Warnings shall not automatically become failures unless effective policy or the selected quality gate defines them as failing conditions.

**FR-QUAL-058 — Lint infrastructure failure**  
Failure to invoke or complete the linter shall be distinguishable from the linter successfully reporting code findings.

**FR-QUAL-059 — Non-mutating lint default**  
Lint execution shall be non-mutating by default.

**FR-QUAL-060 — Autofix boundary**  
If a future quality use case exposes lint autofix, it shall be a separately explicit mutating intent governed by Source Transformation requirements and shall not be implied by ordinary lint execution.

---

## 9. Type Checking

**FR-QUAL-061 — Type-check use case**  
AppManager shall provide a quality use case for type checking supported managed targets where a type-check capability is recognized or configured.

**FR-QUAL-062 — Type-check provider independence**  
The Functional Specification shall not mandate TypeScript, `vue-tsc` or any particular type-check implementation.

**FR-QUAL-063 — Type diagnostics**  
Type-check diagnostics shall contribute to the quality outcome according to the semantics of the selected capability and applicable quality policy.

**FR-QUAL-064 — Type-check failure**  
A provider completing with type errors shall be distinguishable from failure to start or execute the type-check provider.

**FR-QUAL-065 — Scope fidelity**  
Type checking shall evaluate the requested supported managed scope and shall not silently substitute a different broader project scope.

---

## 10. General Validation

**FR-QUAL-066 — Validation use cases**  
The Quality domain may expose additional read-only validation use cases where validation is the primary intent and no more specific product domain owns that behaviour.

**FR-QUAL-067 — Domain-specific validation**  
Validation whose product identity clearly belongs to another domain shall remain owned by that domain even if its result contributes to an aggregate quality gate.

**FR-QUAL-068 — Source validity**  
Source-level validation used after a transformation remains part of shared Source Transformation semantics and shall not be duplicated as an independent Quality authority merely because the validation tool resembles a quality checker.

**FR-QUAL-069 — Validation result normalization**  
Provider-specific validation outcomes shall be interpreted into structured AppManager validation results where the selected use case requires machine consumption.

**FR-QUAL-070 — Indeterminate validation**  
Where validation cannot reliably determine pass or fail, AppManager shall represent an indeterminate or unavailable state rather than assume success.

---

## 11. Quality Gates

**FR-QUAL-071 — Quality-gate use case**  
AppManager shall support evaluation of a quality gate composed from one or more quality criteria where effective policy defines such a gate.

**FR-QUAL-072 — Explicit gate criteria**  
A quality gate shall be based on explicit effective criteria and shall not silently invent additional mandatory checks.

**FR-QUAL-073 — Gate composition**  
A gate may combine tests, coverage, linting, type checking and other approved validation criteria while preserving each criterion's individual outcome.

**FR-QUAL-074 — Required versus optional criteria**  
Gate policy shall distinguish required criteria from optional or advisory checks where such a distinction exists.

**FR-QUAL-075 — Gate pass**  
A quality gate shall pass only when all required criteria have outcomes satisfying the effective gate policy.

**FR-QUAL-076 — Gate fail**  
A failed required criterion shall cause the gate to fail unless policy explicitly defines a different aggregation rule.

**FR-QUAL-077 — Gate unavailable**  
If a required criterion cannot run because its capability is unavailable, the gate shall not be reported as passed merely because no failing result was produced.

**FR-QUAL-078 — Gate incomplete**  
Cancellation or incomplete execution of a required criterion shall prevent a complete gate pass.

**FR-QUAL-079 — Advisory checks**  
Failure or unavailability of advisory checks shall be represented separately from required gate failure according to effective policy.

**FR-QUAL-080 — Gate provenance**  
Structured gate outcomes shall identify the effective criteria evaluated and their resulting statuses sufficiently for automation to understand why the gate passed, failed or remained indeterminate.

---

## 12. Composite Quality Runs

**FR-QUAL-081 — Composite quality operation**  
AppManager may provide an aggregate quality operation that executes a defined set of quality checks for a target or managed scope.

**FR-QUAL-082 — Composite policy**  
The checks included in an aggregate quality operation shall be determined by the selected use case and effective quality policy rather than by whatever provider commands happen to exist.

**FR-QUAL-083 — Ordering**  
Where execution order is functionally significant, AppManager shall apply a deterministic ordering defined by policy or the use case.

**FR-QUAL-084 — Fail-fast policy**  
Whether a composite quality operation stops after the first required failure or continues to gather additional results shall be explicit policy rather than an accidental property of provider execution.

**FR-QUAL-085 — Continue-on-failure**  
Where policy permits continuation, later checks may run after an earlier failure so that the final result can report a fuller quality picture.

**FR-QUAL-086 — Partial execution**  
A composite operation that does not execute all required checks shall not be represented as a complete quality pass.

**FR-QUAL-087 — Per-check outcomes**  
Composite results shall preserve each check's identity, target, status and diagnostically useful result summary.

---

## 13. CI/CD and Automation Boundary

**FR-QUAL-088 — CI invocation equivalence**  
A Quality use case invoked from CI or automation shall preserve the same application semantics as the equivalent manually invoked use case.

**FR-QUAL-089 — Quality does not own CI/CD**  
The Quality domain shall not own the complete CI/CD workflow merely because tests, linting, type checking or quality gates commonly execute within CI.

**FR-QUAL-090 — Cross-domain CI composition**  
A CI/CD workflow may compose `app` build behaviour, Quality checks, Git operations and deployment/provider capabilities while preserving each domain's authority.

**FR-QUAL-091 — Quality before push/deploy**  
Quality results may be consumed as prerequisites or gates by higher-level workflows, but the Quality domain shall not itself perform Git push or deployment unless a separate owning use case explicitly composes those domains.

**FR-QUAL-092 — Machine-consumable status**  
Headless and CI callers shall be able to determine quality and gate outcomes from structured results without parsing human-formatted terminal output.

**FR-QUAL-093 — Automation-safe ambiguity**  
CI and Headless quality operations shall fail safely where required scope, provider or gate policy cannot be determined; they shall not prompt or silently choose a broader default.

---

## 14. Result Semantics

**FR-QUAL-094 — Structured success**  
A successful quality result shall identify the requested check, resolved scope and application-level outcome.

**FR-QUAL-095 — Structured failure**  
A failed quality result shall identify whether failure arose from findings, failed tests, threshold failure, provider execution, configuration, target resolution, gate policy or another defined stage.

**FR-QUAL-096 — Partial success**  
Multi-check or multi-target operations shall represent mixed outcomes explicitly rather than collapsing them to a single undifferentiated status.

**FR-QUAL-097 — Skipped status**  
A check intentionally skipped by applicable policy shall be distinguishable from unavailable, failed or not-yet-run.

**FR-QUAL-098 — Unavailable status**  
A check that cannot run because its required capability is unavailable shall be distinguishable from a passing check.

**FR-QUAL-099 — Indeterminate status**  
Where AppManager cannot reliably determine pass or fail, the result shall be represented as indeterminate rather than successful.

**FR-QUAL-100 — Diagnostics**  
Quality outcomes shall expose diagnostically useful information while avoiding unnecessary leakage of secrets or sensitive project content.

**FR-QUAL-101 — Provider output abstraction**  
Callers shall not be required to parse raw stdout, stderr, prompts or provider-specific UI text to determine the AppManager quality result.

**FR-QUAL-102 — Provider details**  
Provider-specific details may be included as supplemental diagnostics without becoming the primary application contract.

**FR-QUAL-103 — Result stability**  
Equivalent quality invocations against materially equivalent inputs and effective configuration should produce semantically equivalent structured outcomes, subject to genuine external or timing-dependent variation.

---

## 15. Failure, Cancellation and Concurrency

**FR-QUAL-104 — Provider start failure**  
Failure to start a delegated quality provider shall be reported distinctly from the provider running and finding quality defects.

**FR-QUAL-105 — Non-zero completion**  
A delegated provider's non-zero completion shall not be silently treated as success; it shall be interpreted according to that provider capability and the owning quality use case.

**FR-QUAL-106 — Timeout policy**  
If a quality operation has a timeout, that timeout shall come from explicit applicable policy or configuration rather than an undocumented hard-coded Functional assumption.

**FR-QUAL-107 — Cancellation truthfulness**  
Cancellation shall not retroactively erase already completed checks or their outcomes.

**FR-QUAL-108 — No implicit rollback**  
Because ordinary quality checks are non-mutating, rollback is generally not applicable; any future mutating quality action shall report actual completed effects rather than imply universal rollback.

**FR-QUAL-109 — Concurrent quality runs**  
Where concurrent quality invocations could interfere through shared provider state or generated artefacts, AppManager shall handle the conflict deliberately rather than silently corrupt or misattribute results.

**FR-QUAL-110 — Stale context**  
If managed-project or configuration state changes materially between scope resolution and execution and that change can be detected, AppManager shall avoid presenting results as if they unquestionably apply to the original resolved state.

---

## 16. Safety and Non-Destructive Behaviour

**FR-QUAL-111 — Read-only default**  
Tests, coverage, lint, type checking and validation shall be treated as non-source-mutating operations by default.

**FR-QUAL-112 — Generated quality artefacts**  
Quality tools may produce recognized temporary or report artefacts, but those delegated effects shall not grant Quality authority to modify unrelated source or project configuration.

**FR-QUAL-113 — No silent autofix**  
Quality checks shall not silently invoke provider autofix modes.

**FR-QUAL-114 — Managed-scope protection**  
A quality operation shall not execute against unmanaged external targets merely because they are reachable from the filesystem or a provider configuration.

**FR-QUAL-115 — Secret protection**  
Quality diagnostics and structured results shall avoid exposing secrets and sensitive configuration unless explicitly required and authorized by the owning use case.

**FR-QUAL-116 — Fail-safe scope ambiguity**  
Ambiguous target or quality-gate scope shall result in disambiguation or safe failure rather than silently selecting the broadest scope.

---

## 17. Legacy Reconciliation Decisions

### 17.1 Retained legacy behaviours

The following reconciliation-audit requirements are retained as first-class Quality behaviours:

- run all tests;
- run unit tests;
- run end-to-end tests;
- run coverage;
- run test UI.

### 17.2 Later `quality.run` proposal

The later technical `quality.run` proposal identified lint, test, typecheck and test-UI actions by inspecting package metadata and delegated tooling. Its user-visible intent is retained here, but package scripts, package-manager detection, `spawnChecked()`, exact commands and process APIs remain Detailed Design or Implementation concerns.

### 17.3 Lint and type checking

Linting and type checking are explicitly retained because the approved root Design and decomposition plan define the `quality` domain as the home for tests, coverage, linting, type checking, validation and quality gates. Their Functional identity does not depend on the specific scripts present in the current implementation.

### 17.4 Quality gates

Legacy command material did not fully specify a quality-gate model. The root Design and decomposition plan require one. This specification therefore defines gate semantics without inventing particular Version 1 thresholds or mandatory provider choices. Concrete gate policy may be supplied through effective configuration or later specifications.

### 17.5 CI/CD

Quality participates in CI/CD but does not own it. This preserves the boundary already established by the Git Functional Specification: a CI/CD workflow is cross-domain orchestration, not a reason to place build, quality, repository and deployment semantics under one domain.

### 17.6 Utils validation

Generic utility commands that perform narrowly scoped maintenance checks may remain in `utils` where their product identity is genuinely utility-specific. However, project-wide tests, linting, type checking, coverage and quality-gate semantics remain singularly owned by `quality` and shall not be duplicated in `utils`.

---

## 18. Traceability Summary

| Functional area | Requirements | Primary Design / legacy provenance |
|---|---|---|
| Domain boundary and authority | FR-QUAL-001–005 | Root Design §§1, 3, 6, 10; decomposition plan §5.6 |
| Invocation | FR-QUAL-006–018 | Root Design §§4–7; FR-INV, FR-PROJ, FR-CONFIG |
| Target and scope | FR-QUAL-019–028 | FR-PROJ; root managed-project model |
| Tests | FR-QUAL-029–040 | Reconciliation audit §3.18 |
| Test UI | FR-QUAL-041–045 | Reconciliation audit §3.18; legacy `quality.run` |
| Coverage | FR-QUAL-046–053 | Reconciliation audit §3.18; decomposition plan §5.6 |
| Linting | FR-QUAL-054–060 | Root Design quality domain; legacy `quality.run` |
| Type checking | FR-QUAL-061–065 | Root Design quality domain; legacy `quality.run` |
| Validation | FR-QUAL-066–070 | Root Design quality/validation responsibility |
| Quality gates | FR-QUAL-071–080 | Root Design and decomposition plan §5.6 |
| Composite runs | FR-QUAL-081–087 | Application Engine workflow authority |
| CI/CD boundary | FR-QUAL-088–093 | Git Functional Specification CI/CD boundary; Root Design |
| Results | FR-QUAL-094–103 | FR-INV; Application Engine authority |
| Failure/concurrency | FR-QUAL-104–110 | FR-INV; managed context and delegated execution rules |
| Safety | FR-QUAL-111–116 | Root Design safety; FR-PROJ; FR-XFORM |

---

## 19. Downstream Specification Boundary

Detailed Design may define permanent internal contracts for quality orchestration, provider capabilities, normalized test/coverage/lint/type-check result models, gate evaluation and composite quality execution.

Implementation Specifications may define concrete TypeScript modules, package scripts, Vitest or alternative test-runner commands, linter/type-check providers, process APIs, CI bindings, report parsers, timeouts, output paths and migration from current command stubs.

Neither level may redefine the Functional ownership or gate semantics established here without an approved change to the governing specification hierarchy.

---

## 20. Version 1 Functional Baseline

This document establishes the Version 1 Functional baseline for the AppManager `quality` domain.

The central rule is:

> **A quality provider may determine technical findings, but AppManager determines what those findings mean for the requested quality use case and any applicable quality gate.**

This preserves Quality as a coherent first-class product domain while preventing test runners, package scripts, CI providers or implementation mechanics from becoming accidental application authorities.