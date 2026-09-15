# IS-11 — Quality Capability Implementation Specification

> **Document type:** Level 4 Implementation Specification
>
> **Status:** Version 1 implementation baseline
>
> **Implementation ID:** IS-11
>
> **Primary Detailed Design:** [DD-2.8 — Quality Capability](../dd_2_shared_capabilities/dd-2-8-quality-capability-detailed-design-v01.md)
>
> **Related Detailed Designs:** [DD-1.1 — Application Invocation](../dd_1_application_core/dd-1-1-application-invocation-detailed-design-v01.md), [DD-1.2 — Execution Outcomes](../dd_1_application_core/dd-1-2-execution-outcomes-detailed-design-v01.md), [DD-1.3 — Managed Project](../dd_1_application_core/dd-1-3-managed-project-detailed-design-v01.md), [DD-1.4 — Configuration Resolution](../dd_1_application_core/dd-1-4-configuration-resolution-detailed-design-v01.md), [DD-1.5 — Application Engine](../dd_1_application_core/dd-1-5-application-engine-detailed-design-v01.md), [DD-2.1 — Resource Access](../dd_2_shared_capabilities/dd-2-1-resource-access-detailed-design-v01.md), [DD-2.2 — Process Execution](../dd_2_shared_capabilities/dd-2-2-process-execution-detailed-design-v01.md), [DD-2.4 — Source Intelligence](../dd_2_shared_capabilities/dd-2-4-source-intelligence-detailed-design-v01.md), [DD-2.5 — Source Transformation](../dd_2_shared_capabilities/dd-2-5-source-transformation-detailed-design-v01.md), [DD-2.7 — AI Capability](../dd_2_shared_capabilities/dd-2-7-ai-capability-detailed-design-v01.md)
>
> **Primary Functional authority:** [Quality Functional Specification](../functional/quality-functional-specification-v01.md)
>
> **Related implementations:** [IS-1 — Application Runtime and Invocation](is-1-application-runtime-and-invocation-implementation-specification-v01.md), [IS-2 — Managed Project Resolution](is-2-managed-project-resolution-implementation-specification-v01.md), [IS-3 — Configuration Resolution](is-3-configuration-resolution-implementation-specification-v01.md), [IS-4 — Resource Access](is-4-resource-access-implementation-specification-v01.md), [IS-5 — Process Execution](is-5-process-execution-implementation-specification-v01.md), [IS-7 — Source Intelligence](is-7-source-intelligence-implementation-specification-v01.md), [IS-8 — Source Transformation](is-8-source-transformation-implementation-specification-v01.md), [IS-10 — AI Capability](is-10-ai-capability-implementation-specification-v01.md), [IS-23 — Build and Runtime Assembly](is-23-build-and-runtime-assembly-implementation-specification-v01.md)
>
> **Runtime decision:** [ADR-0001 — Primary Application Runtime](../project_management/decisions/adr-0001-primary-application-runtime.md)
>
> **Register:** [AppManager Implementation Specification](implementation-specification-v01.md)
>
> **Governing plan:** [Implementation Specification Plan](../project_management/implementation-specification-plan-v01.md)

## 1. Purpose

IS-11 defines the concrete Node.js/TypeScript implementation of AppManager's shared Quality Capability.

It recognizes bounded quality capabilities for an already-resolved managed target, selects a compatible provider under effective configuration, executes explicitly requested checks through bounded provider adapters, normalizes findings and measurements, aggregates component evidence, and evaluates explicitly supplied quality criteria.

The governing implementation rules are:

> **A quality provider reports technical evidence; it does not acquire application authority.**

> **Technical process completion, quality-check status and quality-gate status are three distinct states.**

> **Ordinary Quality execution is non-source-mutating. Provider autofix capability does not grant mutation authority.**

> **Semantic quality-check identity is independent of package scripts, executable names and provider-native result formats.**

> **Quality Capability is not a general process runner, CI/CD engine, source validator or workflow engine.**

---

## 2. Scope and Non-Ownership

IS-11 owns concrete implementation for:

- semantic quality-check identities;
- target-relative provider recognition and availability;
- provider capability descriptors and deterministic resolution;
- bounded quality execution requests;
- Vitest Version 1 test/coverage/UI provider integration;
- TypeScript Version 1 type-check provider integration;
- extension seams for future lint and bounded-validation providers;
- Process Execution request construction;
- provider-specific exit/output/report interpretation;
- normalized technical execution state;
- normalized quality state;
- test, coverage, lint, type and validation evidence;
- findings, measurements and generated-quality-artefact evidence;
- composite execution of an explicitly supplied quality plan;
- deterministic per-check/per-target aggregation;
- explicit quality-criterion and gate evaluation;
- cancellation, timeout, progress and concurrency controls;
- stale/revision evidence;
- provider-independent fake-provider tests.

IS-11 does **not** own:

- Quality-domain application use-case semantics — IS-18;
- managed-project identity, scope or targetability — IS-2;
- configuration precedence — IS-3;
- generic process execution — IS-5;
- source recognition — IS-7;
- transformation validity when Source Transformation owns the primary intent — IS-8;
- AI explanation/remediation generation — IS-10;
- Documentation/Nuxt-specific validation when those domains own the primary intent;
- build/dev/preview/deployment semantics;
- repository push/commit/release semantics;
- arbitrary package-script execution;
- dependency/package installation;
- provider autofix/source mutation;
- complete CI/CD orchestration;
- final cross-domain workflow acceptance — IS-1/owning use case.

---

## 3. Concrete Module Boundary

```text
app/
└── capabilities/
    └── quality/
        ├── quality-capability.ts
        ├── contracts/
        │   ├── quality-check.ts
        │   ├── quality-target.ts
        │   ├── quality-availability.ts
        │   ├── quality-request.ts
        │   ├── quality-result.ts
        │   ├── quality-finding.ts
        │   ├── quality-measurement.ts
        │   ├── quality-artefact.ts
        │   ├── quality-plan.ts
        │   ├── quality-gate.ts
        │   └── quality-failure.ts
        ├── catalogue/
        │   └── quality-provider-catalogue.ts
        ├── recognition/
        │   └── quality-recognizer.ts
        ├── selection/
        │   └── quality-provider-resolver.ts
        ├── execution/
        │   ├── quality-executor.ts
        │   └── composite-quality-executor.ts
        ├── aggregation/
        │   └── quality-result-aggregator.ts
        ├── gates/
        │   └── quality-gate-evaluator.ts
        ├── providers/
        │   ├── quality-provider.ts
        │   ├── vitest/
        │   │   ├── vitest-provider.ts
        │   │   ├── vitest-command-builder.ts
        │   │   └── vitest-result-parser.ts
        │   └── typescript/
        │       ├── typescript-provider.ts
        │       └── typescript-result-parser.ts
        ├── concurrency/
        │   └── quality-execution-coordinator.ts
        └── diagnostics/
            └── quality-diagnostics.ts
```

Provider folders are concrete adapters, not independent application authorities. Shared consumption does not move Quality-owned contracts into `app/types/`.

No universal executable-provider base class/plugin framework is introduced. Providers implement the minimum common `QualityProvider` contract and retain check-specific internal structure.

---

## 4. Public Capability Contract

```ts
export interface QualityCapability {
  recognize(request: QualityRecognitionRequest): Promise<QualityRecognitionResult>;
  execute(request: QualityExecutionRequest): Promise<QualityCheckResult>;
  executePlan(request: QualityPlanExecutionRequest): Promise<QualityPlanResult>;
  evaluateGate(request: QualityGateEvaluationRequest): QualityGateResult;
}
```

`recognize()` is read-only/non-executing.

`execute()` performs one already-selected bounded check against one semantic target.

`executePlan()` coordinates only an explicit Quality plan. It is not a general workflow engine.

`evaluateGate()` is deterministic and side-effect free. It evaluates supplied normalized evidence against supplied criteria; it does not discover or execute missing checks implicitly.

---

## 5. Semantic Check Identity

```ts
export type QualityCheck =
  | { readonly kind: 'tests'; readonly category: 'all' | 'unit' | 'e2e' }
  | { readonly kind: 'test_ui' }
  | { readonly kind: 'coverage'; readonly testCategory?: 'all' | 'unit' | 'e2e' }
  | { readonly kind: 'lint' }
  | { readonly kind: 'type_check' }
  | { readonly kind: 'validation'; readonly validator: QualityValidatorId };
```

The semantic identity is not `vitest:unit`, `pnpm test`, `tsc --noEmit`, an executable name or a package-script string.

All/unit/e2e remain distinct even where Vitest implements all three.

A new validation identity requires explicit semantics and ownership. An arbitrary package script does not become a `validation` check by naming convention.

---

## 6. Quality Target Contract

```ts
export interface QualityTarget {
  readonly id: ProjectEntityId;
  readonly project: ProjectIdentity;
  readonly resource: ResourceReference;
  readonly kind: 'root_application' | 'layer' | 'managed_unit';
  readonly scope: ManagedScopeEvidence;
  readonly revision: ProjectRevisionEvidence;
}
```

IS-2 supplies target identity/scope. IS-11 validates that a provider request remains within that target but does not reconstruct project authority from cwd, package files or provider configuration.

Provider working directories are derived from the approved target resource.

A reachable directory is not automatically a quality target.

---

## 7. Provider Catalogue

IS-23 constructs an immutable catalogue:

```ts
export interface QualityProviderDescriptor {
  readonly id: QualityProviderId;
  readonly supportedChecks: ReadonlySet<QualityCheckClass>;
  readonly adapter: QualityProviderAdapterId;
  readonly requirements: QualityProviderRequirements;
  readonly concurrency: QualityProviderConcurrencyPolicy;
}
```

Duplicate provider IDs fail composition validation. Catalogue order has no semantic preference.

Provider preference comes from IS-3 effective configuration/caller constraints.

Version 1 concrete providers are:

- `vitest` for verified tests, coverage and test UI semantics;
- `typescript` for TypeScript `type_check` where the target is recognized/configured for that provider.

No linter is selected merely because Quality supports the semantic `lint` class. The current repository contains no governing linter dependency/script, so Version 1 must return unsupported/unavailable until a concrete linter is deliberately configured/implemented.

---

## 8. Recognition and Availability

```ts
export interface QualityRecognitionRequest {
  readonly check: QualityCheck;
  readonly target: QualityTarget;
  readonly effectiveConfiguration: QualityEffectiveConfiguration;
  readonly requiredCapabilities?: ReadonlySet<QualityProviderCapability>;
  readonly signal?: AbortSignal;
}

export type QualityRecognitionResult =
  | { readonly state: 'available'; readonly candidates: readonly QualityProviderAvailability[] }
  | { readonly state: 'no_tests'; readonly evidence: QualityNoTestsEvidence }
  | { readonly state: 'unavailable'; readonly diagnostics: readonly QualityDiagnostic[] }
  | { readonly state: 'unsupported'; readonly diagnostics: readonly QualityDiagnostic[] }
  | { readonly state: 'ambiguous'; readonly candidates: readonly QualityProviderId[]; readonly diagnostics: readonly QualityDiagnostic[] }
  | { readonly state: 'cancelled'; readonly diagnostics: readonly QualityDiagnostic[] }
  | { readonly state: 'failed'; readonly diagnostics: readonly QualityDiagnostic[] };
```

Recognition may consume bounded IS-4 facts and already-authorized target resources/configuration. It does not run the requested quality check.

Package-script presence is evidence, not semantic authority. Provider recognition must validate the requested check contract, target and configured invocation strategy.

Where `no_tests` can be established reliably without executing the test suite, it remains distinct. Otherwise the provider may establish no-tests during execution.

---

## 9. Provider Selection

Selection filters providers by:

1. requested semantic check;
2. target compatibility;
3. required provider capability/report mode;
4. effective configuration permission;
5. explicit provider constraint, if supplied;
6. deterministic configured preference.

An explicit provider remains subject to compatibility validation.

If materially different eligible providers remain equally preferred, return ambiguity rather than choosing catalogue/discovery order.

No interactive prompt exists in IS-11.

---

## 10. Effective Configuration Inputs

IS-11 consumes an already-resolved IS-3 projection. It does not read environment variables or invent package/provider precedence.

Relevant concerns may include:

- provider preference/permission per check class;
- package-manager/provider invocation strategy;
- check-specific timeout;
- test filters/categories;
- report/measurement requirements;
- generated-artifact permission and locations;
- coverage metrics/threshold inputs;
- lint finding policy;
- gate criteria;
- fail-fast/continue policy;
- maximum output/report size;
- provider concurrency policy;
- test UI permission;
- stale-evidence acceptance inputs where owned by the caller.

Package scripts may be selected as a concrete provider invocation mechanism only through governed configuration/recognition; their names do not define Quality semantics.

---

## 11. Execution Request

```ts
export interface QualityExecutionRequest {
  readonly requestId: string;
  readonly invocationId: string;
  readonly check: QualityCheck;
  readonly target: QualityTarget;
  readonly provider: ResolvedQualityProvider;
  readonly effectiveConfiguration: QualityEffectiveConfiguration;
  readonly filters?: QualityFilters;
  readonly requestedEvidence: ReadonlySet<QualityEvidenceClass>;
  readonly generatedArtefacts: QualityArtefactPolicy;
  readonly timeoutMs?: number;
  readonly signal?: AbortSignal;
  readonly correlation?: QualityCorrelationMetadata;
}
```

The request is structured. It does not accept an arbitrary command string, shell fragment or free-form package script from the caller.

Filters are typed provider-independent concepts where possible. Provider adapters validate/translate them into argument arrays.

---

## 12. Process Execution Integration

CLI providers build an IS-5 direct-execution request:

```ts
{
  executable,
  args,
  cwd: target.resource,
  shell: false,
  environment,
  stdout: { mode: 'capture', limit: ... },
  stderr: { mode: 'capture', limit: ... },
  timeoutMs,
  signal
}
```

The exact IS-5 contract shall be used as implemented; the shape above illustrates required semantics rather than redefining IS-5.

Rules:

- direct execution is the default;
- no hidden `shell: true`;
- target/filter values become discrete arguments, never concatenated shell fragments;
- cwd derives from approved target evidence;
- environment comes from effective configuration/provider requirements;
- captured output is bounded;
- IS-5 technical completion is interpreted by the selected provider;
- provider execution cannot invoke unrelated scripts/commands.

---

## 13. Technical Execution State

```ts
export type QualityTechnicalState =
  | 'completed'
  | 'launch_failed'
  | 'timed_out'
  | 'cancelled'
  | 'terminated'
  | 'protocol_failed'
  | 'indeterminate';
```

This state answers what happened to provider execution, not whether the code passed a quality check.

A non-zero exit can accompany `completed` when the provider successfully evaluated the target and uses non-zero to report findings/assertion failures.

A zero exit does not itself establish gate pass.

---

## 14. Quality State

```ts
export type QualityState =
  | 'passed'
  | 'failed'
  | 'no_tests'
  | 'skipped'
  | 'unavailable'
  | 'unsupported'
  | 'incomplete'
  | 'indeterminate'
  | 'cancelled';
```

No state is inferred merely from absence of normalized findings unless provider/check semantics justify it.

`no_tests`, `unavailable`, `incomplete`, `indeterminate` and `cancelled` never normalize to `passed` inside IS-11.

---

## 15. Normalized Check Result

```ts
export interface QualityCheckResult {
  readonly requestId: string;
  readonly check: QualityCheck;
  readonly target: QualityTargetIdentity;
  readonly provider: QualityProviderProvenance;
  readonly technicalState: QualityTechnicalState;
  readonly qualityState: QualityState;
  readonly findings: readonly QualityFinding[];
  readonly measurements: readonly QualityMeasurement[];
  readonly testEvidence?: QualityTestEvidence;
  readonly artefacts: readonly QualityArtefactEvidence[];
  readonly completeness: QualityCompleteness;
  readonly timing: QualityTimingEvidence;
  readonly revision: QualityRevisionEvidence;
  readonly diagnostics: readonly QualityDiagnostic[];
  readonly providerDetail?: BoundedQualityProviderDetail;
}
```

The normalized result contains enough information for callers/gates without parsing stdout/stderr.

Raw provider output is optional bounded diagnostic evidence only.

---

## 16. Findings

```ts
export interface QualityFinding {
  readonly id: string;
  readonly category: 'test' | 'lint' | 'type' | 'validation' | 'provider';
  readonly severity: 'error' | 'warning' | 'info' | 'unknown';
  readonly message: string;
  readonly rule?: string;
  readonly resource?: ResourceReference;
  readonly range?: SourceRange;
  readonly provider: QualityProviderId;
  readonly check: QualityCheck;
  readonly target: QualityTargetIdentity;
  readonly providerClassification?: string;
}
```

Provider severity is normalized evidence. It does not automatically define gate severity.

Finding messages/details are bounded and treated as untrusted provider content.

---

## 17. Test Evidence

```ts
export interface QualityTestEvidence {
  readonly category: 'all' | 'unit' | 'e2e';
  readonly discovered?: number;
  readonly executed?: number;
  readonly passed?: number;
  readonly failed?: number;
  readonly skipped?: number;
  readonly suites?: QualityTestSuiteSummary;
  readonly failedTests: readonly QualityFailedTestSummary[];
  readonly completeness: QualityCompleteness;
}
```

Missing counts remain unknown, not zero.

Assertion failure is normalized as failed-test evidence when the provider successfully executed tests. Failure to launch/parse/complete is infrastructure/protocol evidence.

A timed-out run remains incomplete even if every completed assertion passed before timeout.

---

## 18. Coverage Measurements

```ts
export type QualityCoverageMetric = 'statements' | 'branches' | 'functions' | 'lines';

export interface QualityCoverageMeasurement {
  readonly kind: 'coverage';
  readonly metric: QualityCoverageMetric;
  readonly valuePercent: number;
  readonly covered?: number;
  readonly total?: number;
  readonly scope: QualityTargetIdentity;
  readonly completeness: QualityCompleteness;
  readonly provider: QualityProviderId;
}
```

Values must be finite and bounded to the provider metric's valid range.

Missing metrics remain missing. They are never invented as zero or 100%.

Coverage collection success and threshold satisfaction remain separate.

Partial-target coverage carries partial completeness and cannot be represented as complete-project coverage.

---

## 19. Lint Evidence

A future concrete linter adapter shall normalize rule identity, provider severity, resource/range and message.

Ordinary `lint` provider invocation must explicitly disable autofix/write modes. A provider whose configured invocation cannot guarantee non-mutating behavior is ineligible for ordinary lint execution.

Warning-to-failure interpretation belongs to supplied Quality policy/gate criteria, not universal adapter behavior.

Version 1 does not invent an ESLint adapter in the absence of a verified current provider/configuration.

---

## 20. Type-Check Evidence

The initial TypeScript provider uses the project-installed TypeScript compiler through a direct provider invocation equivalent to the existing governed `typecheck` semantics (`tsc --noEmit`) where recognition confirms applicability.

It shall not assume every managed target shares the repository root `tsconfig.json` or can safely be type-checked from the root. The target/provider resolver must establish the applicable project/configuration and cwd.

Provider-reported type diagnostics become `QualityFinding(category: 'type')` when parsing is reliable.

Type errors represent `technicalState: completed` plus `qualityState: failed` when TypeScript successfully performed the check. Compiler launch/configuration/protocol failures remain distinct.

The exact human `tsc` output format is not the preferred machine contract. If Version 1 cannot reliably structure every diagnostic, it may return bounded provider detail and a failed normalized check while marking finding completeness accordingly; it shall not fabricate locations/rules.

---

## 21. General Validation Boundary

`validation` is residual and explicit. A provider can register a `QualityValidatorId` only when:

- validation is genuinely quality-oriented;
- no more specific domain/capability owns the primary semantics;
- execution is read-only with respect to source;
- pass/fail/indeterminate semantics are defined;
- provider outputs can be normalized sufficiently.

Nuxt validation remains Nuxt-owned when Nuxt intent is primary. Documentation validation remains Docs-owned when documentation semantics are primary. IS-8 post-transformation validation remains IS-8-owned.

---

## 22. Vitest Provider — Version 1

The repository's current Vitest 4 configuration and scripts are retained as concrete implementation evidence, not universal contracts.

The Version 1 adapter shall support the semantic mappings, subject to target recognition/configuration:

```text
tests/all    -> Vitest run mode
 tests/unit   -> Vitest run with bounded unit selection
 tests/e2e    -> Vitest run with bounded e2e selection
 coverage     -> Vitest run with coverage enabled
 test_ui      -> Vitest UI/watch-style long-running provider mode
```

The existing package scripts (`vitest:run`, `vitest:unit`, `vitest:e2e`, `vitest:coverage`, `vitest:ui`) may be used as migration/configuration evidence, but IS-11 shall not require those exact names.

For deterministic machine normalization, the adapter should prefer a provider-supported structured reporter/report file over scraping decorated terminal output.

The existing Vitest configuration already enables a JSON reporter and writes a dated JSON test report. IS-11 adapts that concept but requires report identity/paths to be request-attributable and bounded rather than relying on wall-clock filename coincidence.

---

## 23. Vitest Invocation Strategy

Provider invocation is selected from governed configuration:

```ts
export type VitestInvocationStrategy =
  | { readonly kind: 'direct'; readonly executable: ResourceReference; readonly baseArgs: readonly string[] }
  | { readonly kind: 'package_script'; readonly packageManager: PackageManagerInvocation; readonly script: string };
```

A package script is allowed only when recognition/configuration binds it to a semantic check and the script's known behavior satisfies the non-mutating/check contract.

No arbitrary user/project string is forwarded as a shell command.

The preferred long-term adapter should use direct executable/argument invocation where it provides more reliable control of report paths, filters and cancellation. Existing scripts remain useful compatibility mechanisms during migration.

---

## 24. Vitest Report Normalization

The adapter shall parse a verified structured Vitest report format and validate the parsed shape before trusting it.

The parser is provider-local. Vitest JSON types do not leak through `QualityCheckResult`.

The parser normalizes:

- executed/discovered test/suite counts when reliably available;
- passed/failed/skipped evidence;
- failed test/suite summaries;
- duration where reliable;
- no-tests evidence;
- completeness;
- provider/report parse failures.

A report from a previous request is rejected using request-specific path/provenance and freshness evidence.

Malformed/unbounded report content yields `protocol_failed`/`indeterminate` rather than a false pass.

---

## 25. Coverage Provider Strategy

Vitest coverage is the initial concrete coverage mechanism because current project configuration declares the V8 provider/reporters.

IS-11 must verify that the required coverage provider dependency/configuration is actually available for the selected target. Configuration declaration alone is not proof of executable availability.

The adapter should request a structured coverage report format suitable for deterministic parsing, preferably JSON/JSON-summary where supported by the installed coverage provider.

HTML/text reports are presentation/diagnostic artefacts, not the normalization contract.

Coverage report paths are request-attributable and constrained to approved generated-quality-artefact locations.

---

## 26. Test UI

`test_ui` is represented as a long-running provider operation:

```ts
export type QualityUiState = 'starting' | 'running' | 'stopped' | 'cancelled' | 'failed';
```

Successful launch yields UI execution evidence, never `tests passed`.

The adapter may expose safe provider metadata needed by IS-22 presentation, but terminal/browser presentation remains outside IS-11.

Headless gate execution never depends on test UI.

Cancellation is propagated through IS-5. IS-11 does not claim child/browser/process cleanup beyond what the concrete provider/IS-5 evidence proves.

---

## 27. Generated Quality Artefacts

```ts
export interface QualityArtefactEvidence {
  readonly kind: 'test_report' | 'coverage_report' | 'coverage_html' | 'cache' | 'snapshot' | 'temporary' | 'other';
  readonly resource: ResourceReference;
  readonly requestId: string;
  readonly provider: QualityProviderId;
  readonly lifecycle: 'created' | 'updated' | 'observed' | 'unknown';
  readonly cleanup: 'not_requested' | 'completed' | 'failed' | 'unknown';
}
```

Artefact policy explicitly permits expected report/cache locations. A provider requiring writes outside allowed generated-artifact locations is rejected or executed only under a separately authorized policy.

Generated reports/caches are not source autofix.

IS-11 never claims cleanup unless it actually occurred and was verified sufficiently.

---

## 28. Quality Criteria

```ts
export interface QualityCriterion {
  readonly id: QualityCriterionId;
  readonly classification: 'required' | 'advisory';
  readonly target: QualityCriterionTarget;
  readonly source: QualityCriterionSource;
  readonly rule: QualityCriterionRule;
  readonly unavailable: QualityMissingEvidencePolicy;
  readonly incomplete: QualityMissingEvidencePolicy;
}
```

Rules include explicit operations such as:

```text
check_state_is(passed)
coverage_metric_at_least(lines, 80)
coverage_metric_at_least(branches, 75)
maximum_findings(category=lint, severity=error, count=0)
required_validation_passed(validatorId)
```

Numeric examples above illustrate contract shape only; IS-11 defines no default thresholds.

Criteria originate from effective Quality policy/owning use case. Provider configuration does not silently invent AppManager gate policy.

---

## 29. Criterion Evaluation

```ts
export type QualityCriterionStatus =
  | 'satisfied'
  | 'failed'
  | 'advisory_failed'
  | 'unavailable'
  | 'incomplete'
  | 'indeterminate'
  | 'not_applicable';
```

Evaluation matches criterion source to normalized evidence by semantic check/target/measurement identity.

Missing measurement is not zero.

Provider warning/error labels affect a criterion only where the criterion/policy refers to them.

Required unavailable/incomplete evidence cannot become satisfied unless the explicit criterion policy defines a permitted alternative state.

---

## 30. Quality Gate Result

```ts
export interface QualityGateResult {
  readonly gateId: QualityGateId;
  readonly state: 'passed' | 'failed' | 'incomplete' | 'indeterminate';
  readonly criteria: readonly QualityCriterionResult[];
  readonly evidence: readonly QualityEvidenceReference[];
  readonly diagnostics: readonly QualityDiagnostic[];
}
```

Gate evaluation is pure/deterministic over equivalent normalized evidence and policy.

`passed` requires every required criterion to be satisfied according to its explicit rule.

Advisory failure remains visible but does not fail a gate unless effective policy explicitly makes it required.

Gate pass is Quality evidence. It does not authorize push, deploy, build continuation or another domain's action.

---

## 31. Composite Quality Plan

```ts
export interface QualityPlan {
  readonly id: QualityPlanId;
  readonly steps: readonly QualityPlanStep[];
  readonly continuation: 'continue' | 'fail_fast_required';
  readonly concurrency: QualityPlanConcurrencyPolicy;
}

export interface QualityPlanStep {
  readonly id: QualityPlanStepId;
  readonly check: QualityCheck;
  readonly target: QualityTarget;
  readonly provider?: QualityProviderConstraint;
  readonly required: boolean;
}
```

The owning Quality use case supplies the plan. IS-11 does not discover every quality-like script and create a plan automatically.

Step order is explicit and stable.

Overlapping logical target/check pairs are deduplicated unless the plan explicitly assigns distinct step identities/semantics requiring repeated execution.

---

## 32. Composite Execution

`CompositeQualityExecutor` executes only Quality steps and records every planned step.

When fail-fast stops later work, unstarted steps receive explicit state/reason such as `skipped_due_to_required_failure` rather than disappearing.

Cancellation stops future scheduling and propagates to active provider operations. Completed results remain intact.

Composite result preserves all per-check/per-target evidence and may include an evaluated gate only if criteria were explicitly supplied.

It does not convert a composite result into the final DD-1.2 application outcome.

---

## 33. Multi-Target Semantics

Target identity is retained on every request, finding, measurement and result.

A multi-target caller constructs plan steps from IS-2 managed scope. IS-11 does not broaden one target's provider cwd to encompass neighboring targets merely because the provider can do so.

Unsupported target/check combinations remain explicit.

Mixed results remain mixed; aggregation never hides one failing/unavailable target behind another passing target.

---

## 34. Progress Events

Capability-local progress events are transport-neutral:

```ts
export type QualityProgressEvent =
  | { readonly kind: 'step_started'; readonly stepId: string; readonly check: QualityCheck; readonly target: QualityTargetIdentity }
  | { readonly kind: 'provider_started'; readonly stepId: string; readonly provider: QualityProviderId }
  | { readonly kind: 'step_completed'; readonly stepId: string; readonly state: QualityState }
  | { readonly kind: 'step_skipped'; readonly stepId: string; readonly reason: QualitySkipReason };
```

IS-1 owns invocation event integration; IS-22 owns presentation.

Provider stdout is not itself the semantic event stream.

---

## 35. Cancellation and Timeout

Caller `AbortSignal` propagates through plan -> check -> provider -> IS-5.

Timeout comes from effective configuration/request/provider constraints and remains explicit.

Cancellation semantics:

- do not schedule future steps;
- signal active work;
- retain completed results;
- mark interrupted active work incomplete/cancelled according to reliable provider evidence;
- record unstarted work explicitly;
- never infer pass from cancellation.

Timeout and caller cancellation remain distinct diagnostics even if both use abort mechanics below the boundary.

---

## 36. Concurrency and Isolation

Provider descriptors declare material conflict keys, for example:

```ts
export interface QualityConflictKey {
  readonly provider: QualityProviderId;
  readonly target?: QualityTargetIdentity;
  readonly resource?: ResourceReference;
  readonly class: 'report_path' | 'cache' | 'snapshot' | 'port' | 'browser' | 'provider_global';
}
```

`QualityExecutionCoordinator` may:

- permit execution when conflict keys do not overlap;
- serialize conflicting provider work;
- reject unsupported concurrent requests.

It does not create a global Quality lock.

Vitest requests using request-specific report paths should be independently runnable where provider/cache behavior permits. Test UI may require stronger target/provider serialization because of ports/watch state.

Concurrency decisions and waiting do not change application authorization.

---

## 37. Revision and Stale Evidence

Every result records the project/configuration/provider revision evidence actually evaluated where available.

IS-11 does not claim filesystem snapshot isolation.

Before consequential use of a quality gate, the owning use case/IS-1 may ask IS-2/IS-3 to revalidate material context. If supplied revalidation evidence shows a material change, the Quality evidence is marked stale/changed rather than silently treated as current.

Provider report freshness is also validated independently to avoid consuming stale reports.

A stale result is not automatically re-run by IS-11; rerun policy belongs to the owning use case.

---

## 38. Provider Failure Model

```ts
export type QualityFailureCode =
  | 'provider_not_configured'
  | 'provider_unavailable'
  | 'provider_unsupported'
  | 'provider_launch_failed'
  | 'provider_invocation_invalid'
  | 'provider_protocol_invalid'
  | 'provider_timed_out'
  | 'caller_cancelled'
  | 'provider_terminated'
  | 'report_missing'
  | 'report_stale'
  | 'report_invalid'
  | 'report_too_large'
  | 'generated_artefact_violation'
  | 'concurrency_conflict'
  | 'target_out_of_scope'
  | 'target_stale'
  | 'indeterminate_provider_failure';
```

Quality defects are not provider failures. Failed assertions, lint findings, type diagnostics and threshold failures are normalized Quality evidence when the provider completed sufficiently to establish them.

Provider stderr/exception text is bounded subordinate detail.

---

## 39. Diagnostics

Initial stable diagnostic codes include:

```text
QUAL_CHECK_UNKNOWN
QUAL_TARGET_OUT_OF_SCOPE
QUAL_TARGET_STALE
QUAL_PROVIDER_UNKNOWN
QUAL_PROVIDER_UNAVAILABLE
QUAL_PROVIDER_UNSUPPORTED
QUAL_PROVIDER_AMBIGUOUS
QUAL_PROVIDER_LAUNCH_FAILED
QUAL_PROVIDER_INVOCATION_INVALID
QUAL_PROVIDER_PROTOCOL_INVALID
QUAL_PROVIDER_TIMEOUT
QUAL_CALLER_CANCELLED
QUAL_TESTS_FAILED
QUAL_NO_TESTS
QUAL_TEST_EXECUTION_INCOMPLETE
QUAL_COVERAGE_MISSING
QUAL_COVERAGE_PARTIAL
QUAL_LINT_FINDINGS
QUAL_TYPE_FINDINGS
QUAL_VALIDATION_FAILED
QUAL_REPORT_MISSING
QUAL_REPORT_STALE
QUAL_REPORT_INVALID
QUAL_REPORT_TOO_LARGE
QUAL_ARTEFACT_POLICY_VIOLATION
QUAL_CONCURRENCY_CONFLICT
QUAL_CRITERION_FAILED
QUAL_CRITERION_UNAVAILABLE
QUAL_CRITERION_INCOMPLETE
QUAL_GATE_FAILED
QUAL_GATE_INCOMPLETE
QUAL_GATE_INDETERMINATE
```

Diagnostics remain capability evidence and map into IS-1/DD-1.2 application diagnostics where appropriate.

---

## 40. Security and Safety

The implementation shall protect against:

- unmanaged-target execution;
- shell/argument injection;
- arbitrary package-script execution;
- unbounded stdout/stderr/report ingestion;
- provider autofix/write flags in ordinary checks;
- report-path traversal/overwrite outside permitted generated-artifact locations;
- stale report reuse;
- malicious report text being interpreted as AppManager instruction;
- protected configuration leakage;
- provider discovery becoming executable discovery;
- cross-request report/cache attribution errors;
- concurrency contamination;
- test UI accidentally becoming Headless gate semantics.

Report files are untrusted structured input. Parsers validate shape, bounds and provenance before normalization.

Provider-generated paths/messages never become commands.

---

## 41. Relationship to IS-8 Source Transformation

Ordinary Quality checks do not mutate source.

If a future Quality-domain use case offers lint/type/AI-assisted remediation, the flow is:

```text
Quality finding
 -> owning use case selects remediation intent
 -> optional IS-10 proposal
 -> explicit IS-8 transformation plan
 -> normal approval/stale/precondition checks
 -> mutation
 -> validation/recheck as separately authorized
```

IS-11 never enables `--fix`, write mode or equivalent merely because a provider supports it.

IS-8 may itself invoke a validation tool under its transformation-validity contract. Similar mechanics do not transfer that validation to IS-11 ownership.

---

## 42. Relationship to IS-10 AI Capability

Normalized Quality findings/results may be supplied by an owning use case as bounded IS-10 context for explanation/triage.

AI output cannot change `QualityCheckResult`, measurements or `QualityGateResult`.

AI-proposed remediation is proposal evidence only and follows IS-8 before source mutation.

IS-11 does not call AI automatically after failures.

---

## 43. CI and Adapter Boundary

CI/Headless/TUI/IDE adapters all invoke the same IS-18/IS-1 Quality use cases and IS-11 capability contracts.

IS-11 contains no GitHub Actions, GitLab CI or other CI-provider workflow model.

Machine consumers receive structured normalized results and gates; they do not parse terminal output.

A passing gate cannot invoke Git push/deploy. The owning higher-level workflow consumes the gate as evidence.

---

## 44. Observability

Safe observability may include:

- invocation/request/step identity;
- semantic check identity;
- target identity;
- provider identity;
- start/end/duration;
- technical and quality state;
- aggregate finding/test counts;
- measurement names/values where non-sensitive;
- generated artefact identities;
- cancellation/timeout/concurrency state;
- gate/criterion identities and states.

Do not log full provider output, arbitrary source excerpts, protected environment/configuration or complete report payloads by default.

---

## 45. Caching

Quality execution results are not globally cached by default because they are revision-sensitive evidence.

Recognition evidence may be memoized within an invocation and may later use a bounded revision-aware cache.

Structured report parsing may be memoized only within the owning request/report revision.

Gate evaluation is pure and may be recomputed cheaply; no persistent gate cache is required.

---

## 46. Testing Requirements

Core Vitest tests use fake providers/process evidence and cover at least:

1. semantic check identity independent of scripts;
2. supported/unsupported check recognition;
3. target-relative availability;
4. package-script presence does not establish managed scope;
5. provider selection from effective policy;
6. equal provider ambiguity independent of catalogue order;
7. recognition performs no quality execution;
8. no-tests versus unavailable;
9. direct IS-5 invocation uses explicit executable/args and `shell: false`;
10. target/filter values cannot become shell fragments;
11. provider launch failure;
12. zero exit plus malformed report does not pass;
13. non-zero assertion failure -> technical completed + quality failed;
14. non-zero infrastructure failure remains provider failure;
15. all/unit/e2e category fidelity;
16. test counts preserve unknown versus zero;
17. no-tests does not become pass;
18. cancelled/timed-out tests remain incomplete;
19. test UI launch does not become test pass;
20. test UI long-running cancellation;
21. coverage collection success distinct from gate success;
22. missing coverage metric remains unknown;
23. partial coverage scope;
24. threshold satisfied/failed;
25. no invented threshold;
26. lint adapter ordinary mode forbids autofix when such adapter exists;
27. lint warning under advisory versus required policy;
28. type diagnostics versus TypeScript provider failure;
29. type-check target scope fidelity;
30. domain-specific validation rejection from generic Quality registration;
31. IS-8 validation ownership preserved;
32. required criterion satisfied/failed;
33. required unavailable/incomplete cannot silently pass;
34. advisory failure remains visible;
35. deterministic gate evaluation;
36. explicit composite ordering;
37. continue policy;
38. fail-fast policy;
39. unstarted steps remain represented;
40. overlapping target/check deduplication;
41. mixed multi-target results preserved;
42. cancellation retains completed prior checks;
43. generated report evidence;
44. generated artefact policy violation;
45. cleanup truthfulness;
46. stale report rejection;
47. stale project/config evidence surfaced;
48. non-conflicting concurrency;
49. conflicting report path serialization/rejection;
50. request/result attribution under concurrency;
51. provider substitution behind same normalized contract;
52. provider-native report types do not escape public contracts;
53. CI/TUI/Headless semantic equivalence at capability boundary;
54. AI explanation cannot modify Quality truth;
55. gate pass causes no Git/deployment action;
56. bounded diagnostics/report ingestion;
57. malicious report content remains data;
58. no hidden source mutation.

Concrete Vitest adapter integration tests shall use temporary fixture projects and verified structured reports. TypeScript adapter tests shall use small fixture `tsconfig` projects containing passing/type-error/configuration-error cases.

No core conformance test requires a CI provider or external service.

---

## 47. Current Implementation Disposition

| Current artefact/responsibility | Disposition | Version 1 treatment |
|---|---|---|
| `app/commands/quality/runQuality.ts` TODO stub | **REPLACE / RELOCATE** | Quality application intent belongs to IS-18; shared execution belongs to IS-11. No implementation behavior to preserve. |
| `package.json` `vitest:run` | **RETAIN / ADAPT** | Migration evidence for semantic all-tests provider mapping; exact script name not contract. |
| `package.json` `vitest:unit` | **RETAIN / ADAPT** | Migration evidence for unit-test mapping; exact `tests/unit` path not universal contract. |
| `package.json` `vitest:e2e` | **RETAIN / ADAPT** | Migration evidence for e2e mapping; hard-coded timeout moves to IS-3/check policy. |
| `package.json` watch scripts | **RETAIN / NARROW** | Provider-specific developer/UI/watch mechanics only; not Headless quality result semantics. |
| `package.json` `vitest:coverage` | **RETAIN / ADAPT** | Initial coverage-provider evidence; verify coverage provider availability and structured report. |
| `package.json` `vitest:ui` | **RETAIN / ADAPT** | Initial optional test-UI provider mapping; launch/running state only, never pass. |
| `package.json` `typecheck` (`tsc --noEmit`) | **RETAIN / ADAPT** | Initial TypeScript provider evidence; target-specific config/cwd must be resolved rather than assumed root. |
| absence of lint script/dependency | **RETAIN AS FACT** | Do not invent ESLint/provider; semantic lint remains supported by contract but unavailable until configured/implemented. |
| `vitest.config.ts` provider/config | **RETAIN / ADAPT** | Concrete Vitest adapter evidence; not universal Quality config. |
| `pool: forks` / `fileParallelism: true` | **RETAIN AS PROVIDER CONFIG** | Useful current provider isolation behavior, not AppManager concurrency guarantee. |
| global `testTimeout: 30000` | **RELOCATE / ADAPT** | Provider/config default candidate through IS-3; not hidden universal Quality timeout. |
| coverage `provider: v8` | **RETAIN / VERIFY** | Initial provider-specific coverage configuration; verify runtime dependency/support. |
| coverage text/json/html reporters | **RETAIN / ADAPT** | Prefer structured machine report for normalization; presentation reports are artefact evidence. |
| Vitest `reporters: ['default','json']` | **RETAIN / ADAPT** | JSON reporting is useful; provider-local parser validates schema/provenance. |
| dated `outputFile` under `app_manager/logs/test/` | **REPLACE / ADAPT** | Use request-attributable bounded report identity/path; avoid timestamp-only stale/misattribution risk. |
| existing `tests/` suite | **RETAIN** | Remains project test suite and future provider fixture/conformance source; test directory names do not define permanent semantics. |
| current direct developer invocation of package scripts | **RETAIN OUTSIDE AUTHORITY** | Developer scripts remain useful, but AppManager Quality uses capability/provider contracts. |
| IS-5 Process Execution | **RETAIN / CONSUME** | Sole generic CLI execution boundary; raw exit/stdout/stderr normalized by provider. |
| no existing Quality result/gate model | **ADD** | Introduce capability-local normalized contracts/evaluator. |
| no existing Quality provider abstraction | **ADD** | Add bounded Vitest/TypeScript providers without universal executable plugin framework. |

---

## 48. Migration Sequence

1. create capability-local semantic check/target/result/finding/measurement/gate contracts;
2. implement immutable provider catalogue and deterministic resolver;
3. implement fake-provider conformance harness;
4. implement pure gate criterion/evaluator and aggregation tests;
5. implement Process Execution-backed provider execution boundary;
6. implement request-specific generated-report policy/provenance;
7. adapt Vitest all/unit/e2e execution with structured result parsing;
8. adapt Vitest coverage with structured measurement parsing;
9. adapt optional Vitest UI long-running state/cancellation;
10. implement TypeScript type-check provider with target-specific recognition;
11. wire IS-3 effective Quality configuration and remove hidden timeout/script assumptions;
12. implement composite execution, fail-fast/continue and progress;
13. implement concurrency conflict keys/coordinator for provider artefacts/UI/shared state;
14. integrate stale/revision evidence with IS-2/IS-3 caller flow;
15. implement IS-18 Quality-domain use cases against IS-11 rather than expanding `runQuality.ts` directly;
16. add future lint provider only after a concrete provider/configuration decision exists;
17. route any future mutating remediation through IS-8;
18. retain package scripts as developer/provider compatibility surfaces where useful without making them semantic authority.

---

## 49. Traceability

| Implementation concern | Governing authority |
|---|---|
| delegated authority/non-mutation/CI boundary | DD-QUALCAP-001–004; FR-QUAL-001–005 |
| semantic check identity | DD-QUALCAP-005–007; FR-QUAL-029–033, 046–047, 054–055, 061–062, 066–070 |
| target recognition/availability | DD-QUALCAP-008–011; FR-QUAL-011, 019–028, 034–035 |
| provider resolution | DD-QUALCAP-012–015; FR-QUAL-012, 025, 093; IS-3 |
| execution request/scope | DD-QUALCAP-016–018; FR-QUAL-006–018; IS-2 |
| process interpretation | DD-QUALCAP-019–022; FR-QUAL-003, 036–038, 058, 064, 104–105; IS-5 |
| normalized result | DD-QUALCAP-023–025; FR-QUAL-094–103 |
| findings | DD-QUALCAP-026–028; FR-QUAL-056–057, 063, 100–102 |
| tests | DD-QUALCAP-029–032; FR-QUAL-029–040 |
| test UI | DD-QUALCAP-033–035; FR-QUAL-041–045 |
| coverage | DD-QUALCAP-036–039; FR-QUAL-046–053 |
| lint | DD-QUALCAP-040–043; FR-QUAL-054–060; IS-8 |
| type check | DD-QUALCAP-044–046; FR-QUAL-061–065 |
| general validation | DD-QUALCAP-047–049; FR-QUAL-066–070; IS-7/8 |
| gate criteria/evaluation | DD-QUALCAP-050–054; FR-QUAL-071–080 |
| composite execution | DD-QUALCAP-055–059; FR-QUAL-081–087 |
| multi-target | DD-QUALCAP-060–063; FR-QUAL-022–028, 039, 096 |
| progress/cancellation/timeout | DD-QUALCAP-064–068; FR-QUAL-017–018, 038, 078, 084–086, 106–108 |
| generated artefacts | DD-QUALCAP-069–072; FR-QUAL-111–113 |
| concurrency/isolation | DD-QUALCAP-073–075; FR-QUAL-109 |
| stale/revision | DD-QUALCAP-076–078; FR-QUAL-103, 110 |
| CI/cross-domain | DD-QUALCAP-079–082; FR-QUAL-088–093 |
| AI relationship | DD-QUALCAP-083–084; DD-2.7/IS-10 |
| provider boundary | DD-QUALCAP-085–088 |
| DD-1 outcome relationship | DD-QUALCAP-089–091; FR-QUAL-094–103; IS-1 |
| implementation reconciliation | DD-QUALCAP-092 |
| security | DD-QUALCAP-093–094; FR-QUAL-111–116 |
| testability | DD-QUALCAP-095–096 |

---

## 50. Version 1 Non-Drift Baseline

```text
owning Quality use case / cross-domain caller
 + IS-2 managed target/scope
 + IS-3 effective Quality configuration/policy
 + explicit semantic check or composite plan
        |
        v
IS-11 recognition + deterministic provider resolution
        |
        v
bounded provider request
        |
        v
IS-5 Process Execution / approved provider mechanism
        |
        v
provider technical evidence + structured report
        |
        v
provider-local interpretation
        |
        +--> technical execution state
        +--> normalized findings/test evidence/measurements
        +--> generated artefact evidence
        |
        v
Quality check result
        |
        +--> optional explicit criterion/gate evaluation
        +--> optional owning-use-case IS-10 explanation
        +--> optional separately authorized IS-8 remediation
        |
        v
IS-1 / owning workflow acceptance
```

The non-drift rule is:

> **Version 1 Quality Capability may recognize and execute explicitly requested bounded quality checks, normalize their technical evidence and evaluate explicitly supplied quality criteria; it may not infer application intent, expand managed scope, execute arbitrary scripts, enable source autofix, treat process completion as quality truth, treat check pass as automatic gate pass, or decide what another AppManager workflow is allowed to do next.**

This implementation deliberately retains useful current Vitest, TypeScript, structured-report, test-isolation and package-script mechanics while keeping them below semantic Quality contracts and leaving application authority with the owning use case and Application Engine.