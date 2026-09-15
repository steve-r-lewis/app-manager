# IS-18 — Quality Domain Implementation Specification

> **Document type:** Level 4 Implementation Specification
>
> **Status:** Version 1 implementation baseline
>
> **Implementation ID:** IS-18
>
> **Primary Detailed Design:** [DD-4.1 — Quality Domain](../dd_4_policy_and_resource_domains/dd-4-1-quality-domain-detailed-design-v01.md)
>
> **Primary Functional authority:** [Quality Functional Specification](../functional/quality-functional-specification-v01.md)
>
> **Principal shared capability:** [IS-11 — Quality Capability](is-11-quality-capability-implementation-specification-v01.md)
>
> **Application Core:** [IS-1 — Application Runtime and Invocation](is-1-application-runtime-and-invocation-implementation-specification-v01.md), [IS-2 — Managed Project Resolution](is-2-managed-project-resolution-implementation-specification-v01.md), [IS-3 — Configuration Resolution](is-3-configuration-resolution-implementation-specification-v01.md)
>
> **Supporting implementations:** [IS-4 — Resource Access](is-4-resource-access-implementation-specification-v01.md), [IS-5 — Process Execution](is-5-process-execution-implementation-specification-v01.md), [IS-7 — Source Intelligence](is-7-source-intelligence-implementation-specification-v01.md), [IS-8 — Source Transformation](is-8-source-transformation-implementation-specification-v01.md), [IS-10 — AI Capability](is-10-ai-capability-implementation-specification-v01.md), [IS-13 — Nuxt Capability](is-13-nuxt-capability-implementation-specification-v01.md), [IS-14 — App Domain](is-14-app-domain-implementation-specification-v01.md), [IS-15 — Git Domain](is-15-git-domain-implementation-specification-v01.md), [IS-16 — Nuxt Domain](is-16-nuxt-domain-implementation-specification-v01.md), [IS-17 — Docs Domain](is-17-docs-domain-implementation-specification-v01.md), IS-22 Interaction Adapters, [IS-23 — Build and Runtime Assembly](is-23-build-and-runtime-assembly-implementation-specification-v01.md)
>
> **Runtime decision:** [ADR-0001 — Primary Application Runtime](../project_management/decisions/adr-0001-primary-application-runtime.md)
>
> **Register:** [AppManager Implementation Specification](implementation-specification-v01.md)
>
> **Governing plan:** [Implementation Specification Plan](../project_management/implementation-specification-plan-v01.md)

## 1. Purpose

IS-18 defines the concrete Node.js/TypeScript implementation of AppManager's Quality domain.

The Quality domain owns quality-assurance application intent, operation-specific target/scope policy, required check selection, warning/threshold/gate policy, composite-run orchestration and Quality-domain acceptance. It consumes IS-11 for bounded quality recognition, provider execution, normalized findings/measurements and explicit criterion evaluation while IS-1 retains final application authority.

The governing implementation rules are:

> **Quality intent and policy belong to IS-18; bounded quality mechanics belong to IS-11; final AppManager acceptance belongs to IS-1.**

> **Provider technical state, normalized quality-check state, gate state and final application outcome remain distinct.**

> **Managed membership is not quality eligibility. Quality scope is resolved from IS-2 and interpreted per operation before any provider executes.**

> **No package script, executable, provider, CI job or report format defines a canonical Quality use case.**

> **Ordinary Quality operations are non-mutating. Provider autofix capability does not create source-mutation authority.**

---

## 2. Scope and Non-Ownership

IS-18 implements:

- canonical Quality use-case identities and descriptors;
- root, selected-layer, explicit-subset and all-managed scope interpretation;
- operation-relative eligibility and capability requirements;
- all/unit/end-to-end test intent;
- test-UI application intent and lifecycle interpretation;
- coverage collection intent and threshold policy;
- lint warning/error policy;
- type-check scope fidelity;
- approved residual Quality validation;
- explicit gate criteria and required/advisory policy;
- composite Quality plans, ordering and continuation;
- per-target/per-check aggregation without truth loss;
- stale-context, cancellation, timeout and generated-artefact interpretation;
- machine-consumable Headless/CI Quality payloads;
- Quality-domain acceptance and recovery evidence.

IS-18 does not own:

- invocation, authorization, canonical outcomes or final application acceptance — IS-1;
- managed-project identity/scope/targetability — IS-2;
- configuration precedence — IS-3;
- process/resource mechanics — IS-4/IS-5;
- source recognition/transformation mechanics — IS-7/IS-8;
- AI execution/remediation generation — IS-10;
- bounded quality provider recognition/execution/normalization/criterion evaluation — IS-11;
- Nuxt-specific validation when Nuxt is primary intent — IS-13/IS-16;
- Docs-specific validation — IS-12/IS-17;
- App build/dev/preview/reset semantics — IS-14;
- Git/repository semantics — IS-15;
- complete CI/CD workflow ownership;
- deployment;
- interaction presentation — IS-22.

---

## 3. Concrete Module Boundary

```text
app/
└── domains/
    └── quality/
        ├── contracts/
        │   ├── quality-use-case.ts
        │   ├── quality-scope.ts
        │   ├── quality-eligibility.ts
        │   ├── quality-domain-policy.ts
        │   ├── quality-gate-policy.ts
        │   ├── quality-composite-policy.ts
        │   ├── quality-domain-result.ts
        │   ├── quality-recovery.ts
        │   └── quality-diagnostic.ts
        ├── catalogue/
        │   └── quality-use-case-catalogue.ts
        ├── policy/
        │   ├── quality-scope-resolver.ts
        │   ├── quality-eligibility-evaluator.ts
        │   ├── quality-check-policy.ts
        │   ├── quality-gate-policy-resolver.ts
        │   └── quality-continuation-policy.ts
        ├── orchestration/
        │   ├── quality-check-runner.ts
        │   ├── quality-multi-target-runner.ts
        │   ├── quality-composite-runner.ts
        │   ├── quality-gate-runner.ts
        │   ├── quality-acceptance.ts
        │   └── quality-recovery-builder.ts
        └── use-cases/
            ├── run-all-tests.ts
            ├── run-unit-tests.ts
            ├── run-e2e-tests.ts
            ├── run-coverage.ts
            ├── run-test-ui.ts
            ├── run-lint.ts
            ├── run-type-check.ts
            ├── run-validation.ts
            ├── evaluate-quality-gate.ts
            └── run-quality.ts
```

IS-18 contains application policy/orchestration, not provider implementations. Provider-specific Vitest/TypeScript/report/process details remain beneath IS-11.

---

## 4. Public Use-Case Seam

```ts
export interface QualityUseCase<TInput, TPayload> {
  readonly descriptor: QualityUseCaseDescriptor;
  availability(context: ApplicationExecutionContext, input: TInput): Promise<QualityAvailability>;
  validate(context: ApplicationExecutionContext, input: TInput): Promise<QualityValidation>;
  execute(context: ApplicationExecutionContext, input: TInput): Promise<QualityDomainResult<TPayload>>;
}
```

`QualityDomainResult` supplies Quality-specific evidence/payload to IS-1 and contains no competing application `success` Boolean.

---

## 5. Canonical Quality Command Identities

```text
quality.test
quality.test-unit
quality.test-e2e
quality.coverage
quality.test-ui
quality.lint
quality.type-check
quality.validate
quality.gate
quality.run
```

These semantic identities map to DD-4.1 operations `all_tests`, `unit_tests`, `end_to_end_tests`, `coverage`, `test_ui`, `lint`, `type_check`, `validate`, `quality_gate` and `composite_quality`.

Adapters may expose aliases, but package-script names such as `vitest:unit`, `typecheck` or provider commands never become canonical operation identity.

---

## 6. Quality Scope Model

```ts
export type QualityScope =
  | { readonly kind: 'managed_root'; readonly target: ManagedProjectEntityId }
  | { readonly kind: 'selected_layer'; readonly target: ManagedProjectEntityId }
  | { readonly kind: 'explicit_subset'; readonly targets: readonly ManagedProjectEntityId[] }
  | { readonly kind: 'all_managed'; readonly targets: readonly ManagedProjectEntityId[] };
```

Scope is derived from IS-2 managed context. Paths/cwd/package files are location/evidence only.

Overlapping requested scopes normalize stable managed identities before execution. A target executes at most once per semantic check unless duplication is explicitly part of the request.

A caller may narrow scope where the operation supports it. IS-18 never silently expands a selected layer/subset to the complete project.

---

## 7. Operation-Relative Eligibility

```ts
export interface QualityEligibilityDecision {
  readonly operation: QualityOperationId;
  readonly target: ManagedProjectEntityId;
  readonly state: 'eligible' | 'unsupported' | 'unavailable' | 'ambiguous' | 'indeterminate';
  readonly capability?: QualityRecognitionReference;
  readonly diagnostics: readonly QualityDomainDiagnostic[];
}
```

IS-18 first verifies target membership/targetability from IS-2, then requests IS-11 recognition for the semantic check.

A managed root/layer can be eligible for one operation and unsupported for another. Provider/package presence does not establish managed authority.

`unsupported`, `unavailable`, `ambiguous` and `indeterminate` never normalize to pass.

---

## 8. Operation-Effective Quality Policy

IS-18 consumes an immutable IS-3 projection for the operation. Relevant policy includes:

- allowed/required semantic checks;
- provider constraints/preferences supplied to IS-11;
- target/scope rules;
- warning treatment;
- coverage thresholds;
- required/advisory gate criteria;
- missing/unavailable/incomplete criterion treatment;
- timeouts;
- generated quality-artefact permission;
- test filters where semantically supported;
- composite ordering/continuation;
- concurrency constraints;
- test-UI permission;
- stale-context acceptance/revalidation policy.

No threshold, warning-failure rule or mandatory check is invented because a provider supports it.

---

## 9. Common Quality Flow

```text
IS-1 normalized invocation
 -> IS-2 managed target/scope
 -> IS-3 operation-effective Quality policy
 -> IS-18 eligibility/check/gate/composite policy
 -> IS-11 recognize/execute/evaluate
 -> IS-18 per-target/check/gate interpretation
 -> IS-1 final acceptance/outcome
```

For each operation IS-18:

1. resolves semantic scope;
2. resolves operation-effective policy;
3. evaluates target eligibility;
4. selects semantic check(s);
5. delegates bounded execution to IS-11;
6. retains technical/quality/finding/measurement/artefact evidence;
7. evaluates required criteria/gates where the selected use case requires it;
8. interprets completeness, cancellation, stale evidence and partial execution;
9. returns Quality-domain payload to IS-1.

No provider may alter steps 1–4 or declare steps 8–9 satisfied.

---

## 10. Test Operations

`quality.test`, `quality.test-unit` and `quality.test-e2e` remain distinct application intents even when all use the same IS-11 Vitest provider.

Each target is recognized for the requested category before execution. Recognition of tests does not execute them or establish pass.

IS-11 states are interpreted without collapse:

- `passed` means the requested bounded test check passed;
- `failed` means test-quality failure when provider execution yielded valid test evidence;
- `no_tests` is distinct from pass/failure;
- provider launch/protocol failure is infrastructure/provider failure;
- `incomplete`, `cancelled`, `indeterminate`, `unavailable` and `unsupported` remain non-pass states.

Multi-target/category results retain target and category identity.

---

## 11. No-Tests Policy

`no_tests` is evidence, not universally pass or fail.

The operation-effective policy determines whether no tests is:

- acceptable for an optional/advisory target/category;
- a required-criterion failure;
- incomplete/indeterminate for a broader gate.

The raw IS-11 result remains `no_tests`; IS-18 records the policy interpretation separately.

---

## 12. Test UI

`quality.test-ui` is available only where IS-11 recognizes a compatible UI capability and policy permits it.

A successful launch establishes long-running tooling/execution state only. It never means tests passed or a quality gate passed.

Test UI is never required for Headless/CI validation.

IS-1 cancellation propagates through IS-11/IS-5. There is no application-global active test UI singleton.

---

## 13. Coverage

`quality.coverage` requests normalized coverage evidence from IS-11 for the approved scope.

Collection success and threshold satisfaction are separate. Coverage measurements remain structured (`statements`, `branches`, `functions`, `lines` where available), and missing measurements remain unknown rather than zero.

IS-18 evaluates configured threshold criteria explicitly through IS-11 criterion/gate evaluation. No threshold is invented when absent.

Partial-scope coverage is marked incomplete/partial relative to the requested scope and cannot be represented as complete-project coverage.

---

## 14. Lint

`quality.lint` requests the semantic lint check only when IS-11 recognizes/configures a concrete linter.

The current Version 1 repository has no governing linter provider; therefore the domain preserves the lint use case but reports unsupported/unavailable until a provider is deliberately configured/implemented.

Warnings and errors remain distinct findings. Warning-to-failure behavior comes only from operation/gate policy.

Ordinary lint execution is non-mutating. Autofix is not a mode of `quality.lint`.

---

## 15. Type Check

`quality.type-check` delegates semantic `type_check` execution to IS-11 for each eligible target.

IS-11's Version 1 TypeScript provider may implement this with project-installed compiler semantics, but TypeScript/`tsc` is not the domain identity.

IS-18 verifies scope fidelity: a selected layer/subset cannot silently be replaced by a broader root-project check unless that broader target is explicitly the selected semantics.

Type errors are quality defects; inability to launch/execute the provider is infrastructure failure.

---

## 16. Residual General Validation

`quality.validate` is available only for approved validation whose primary product identity is Quality and for which a semantic validator identity exists.

Nuxt validation remains IS-16/IS-13-owned when Nuxt intent is primary. Docs validation remains IS-17/IS-12-owned. Source post-transformation validation remains IS-8-owned.

The same executable being reusable across domains does not transfer semantic ownership.

Arbitrary package scripts cannot be promoted to Quality validation by naming convention.

---

## 17. Quality Criterion Contract

```ts
export interface QualityDomainCriterion {
  readonly id: QualityCriterionId;
  readonly check: QualityCheckSelector;
  readonly scope: QualityCriterionScope;
  readonly classification: 'required' | 'advisory';
  readonly rule: QualityCriterionRule;
  readonly missingEvidence: 'fail' | 'incomplete' | 'indeterminate' | 'advisory';
}
```

Criteria originate from explicit invocation/effective policy. IS-18 maps them into IS-11 `QualityCriterion` contracts for deterministic evaluation.

Provider-native thresholds/configuration are evidence/mechanics; they do not silently add application criteria.

---

## 18. Quality Gate

`quality.gate` evaluates an explicit gate policy over normalized quality evidence.

```ts
export interface QualityGatePolicy {
  readonly id: QualityGatePolicyId;
  readonly criteria: readonly QualityDomainCriterion[];
  readonly requireFreshEvidence: boolean;
}
```

IS-18 ensures required evidence exists or deliberately executes the selected checks when the gate use case explicitly includes execution. IS-11 `evaluateGate()` never implicitly runs missing checks.

Gate states remain `passed`, `failed`, `incomplete` or `indeterminate`.

A gate passes only when every required criterion is satisfied under the effective policy. Advisory failures remain visible but do not become required failures unless policy says they are required.

---

## 19. Gate Evidence versus Workflow Authority

A passing Quality gate is evidence for another use case. It does not authorize commit, push, build, deploy, publish or source mutation.

Git/App/Docs/Nuxt workflows that require quality evidence define their own freshness/acceptance requirement and remain authoritative for the next action.

IS-18 does not expose `gatePassed => executeNextAction` behavior.

---

## 20. Composite Quality Run

`quality.run` coordinates an explicit Quality-bounded plan.

```ts
export interface QualityCompositePlan {
  readonly id: QualityPlanId;
  readonly scope: QualityScope;
  readonly steps: readonly QualityCompositeStep[];
  readonly continuation: 'continue_collecting' | 'fail_fast_required';
  readonly gate?: QualityGatePolicy;
}
```

A step selects only approved Quality checks. Composite Quality cannot absorb build, Git, deployment, Docs generation or unrelated application workflows.

IS-18 owns step selection/order/continuation; IS-11 may execute the resulting explicit bounded plan.

---

## 21. Composite Ordering and Continuation

Initial Version 1 uses deterministic configured step order and deterministic managed-target order.

`fail_fast_required` stops scheduling new required work after a required failure/non-pass condition defined by policy. Already running/completed work remains recorded.

`continue_collecting` continues independent safe checks to maximize evidence.

Skipped/not-attempted steps retain explicit reasons. Fail-fast never converts unexecuted checks into pass.

---

## 22. Multi-Target Aggregation

```ts
export interface QualityTargetResult {
  readonly target: ManagedProjectEntityId;
  readonly checks: readonly QualityCheckResultReference[];
  readonly criteria: readonly QualityCriterionResultReference[];
  readonly state: QualityTargetInterpretation;
  readonly diagnostics: readonly QualityDomainDiagnostic[];
}
```

Aggregation preserves target/check/category identity. Mixed results remain mixed; one successful target cannot hide another failed/unavailable/incomplete target.

Duplicate logical targets are normalized before execution.

---

## 23. State Separation

IS-18 preserves four stages:

```text
IS-5 technical process state
        ↓
IS-11 technical execution state
        ↓
IS-11 normalized quality-check state
        ↓
IS-11/IS-18 criterion and gate state
        ↓
IS-18 Quality-domain acceptance
        ↓
IS-1 canonical application outcome
```

A nonzero provider exit can coexist with technical completion and quality failure. A zero exit can coexist with missing/incomplete evidence. A passed check can coexist with a failed gate. A passed gate remains subordinate evidence to another workflow.

---

## 24. Findings and Measurements

IS-18 preserves normalized IS-11 findings and measurements rather than reparsing provider stdout.

Findings retain target/check/category/severity/rule/resource/range/provider provenance where available.

Measurements retain metric identity/value/unit/scope/completeness. Missing values are not synthesized.

IS-18 may summarize for domain payloads but must preserve references to per-check evidence needed for automation/diagnostics.

---

## 25. Generated Quality Artefacts

Coverage reports, test reports, UI state files and provider caches remain generated quality artefact evidence.

Their existence does not make them source resources, documentation resources or application configuration.

IS-18 records artefact kind/resource/request/provider/lifecycle/cleanup evidence supplied by IS-11. It does not use generated reports as mutation authority.

---

## 26. Stale Evidence

Quality execution binds results to target/project revisions and relevant operation-effective policy identity.

If the managed target materially changes after a check, the evidence is stale for policies requiring current evidence.

IS-18 never silently re-runs stale checks unless the selected use case/policy explicitly authorizes a retry/revalidation cycle. A gate requiring fresh evidence cannot pass on known-stale required evidence.

---

## 27. Cancellation

Cancellation propagates from IS-1 through IS-18 to IS-11/IS-5.

IS-18 stops scheduling new checks as soon as safely practical, preserves completed results, identifies running/cancelled/not-attempted checks and evaluates no false pass from incomplete required work.

Cancellation is not rollback and does not erase generated quality artefacts already produced.

---

## 28. Timeout

Check-specific timeout policy is resolved before execution and supplied to IS-11.

A timed-out provider/check is incomplete/non-pass evidence, not a failed assertion and not a pass.

Composite/gate interpretation follows the explicit missing/incomplete policy while preserving the underlying timeout state.

---

## 29. Concurrency

IS-18 permits concurrency only for independent checks/targets after IS-11 conflict constraints are known.

Conflict dimensions may include report paths, caches, snapshots, UI ports/browser resources and provider-global restrictions.

No global Quality lock is introduced. Deterministic result ordering is independent of completion order.

---

## 30. Retry

Provider/check failure never grants automatic retry, provider fallback or broader scope.

A retry requires explicit effective policy/use-case semantics plus revalidation of target revision, provider availability and applicable gate/composite context.

No blind retry follows timeout, cancellation, indeterminate effect or stale evidence.

---

## 31. Quality-Domain Acceptance

Use-case-specific postconditions include:

- test operations: every required selected target/category has truthful complete test evidence under operation policy;
- test UI: requested UI lifecycle was established for exact target, without implying test pass;
- coverage: requested scope measurement was collected with truthful completeness; threshold acceptance only where configured;
- lint: requested targets were evaluated by a recognized linter and warning/error policy interpreted;
- type check: requested supported scope was evaluated without silent broadening;
- validation: approved validator returned sufficient normalized evidence;
- gate: all required criteria satisfy policy and freshness requirements;
- composite run: selected steps were executed/skipped according to plan, with truthful per-step state and optional gate interpretation.

IS-11 completion alone never establishes these domain postconditions. IS-1 retains final application acceptance.

---

## 32. Quality Domain Result

```ts
export interface QualityDomainPayload {
  readonly operation: QualityOperationId;
  readonly scope: QualityScopeIdentity;
  readonly targets: readonly QualityTargetResult[];
  readonly gate?: QualityGateResultReference;
  readonly findings: readonly QualityFindingReference[];
  readonly measurements: readonly QualityMeasurementReference[];
  readonly artefacts: readonly QualityArtefactReference[];
  readonly stale: readonly QualityStaleEvidence[];
  readonly diagnostics: readonly QualityDomainDiagnostic[];
  readonly recovery?: QualityRecoveryPosition;
}
```

The payload composes with IS-1 canonical outcome semantics. It does not add a parallel `success` field.

---

## 33. Partial Execution

A composite/multi-target operation can have completed, failed, unavailable, skipped, cancelled and not-attempted checks simultaneously.

IS-18 retains all of these states. It does not flatten partial execution into the final provider/check observed.

Canonical partial-success/failure classification remains IS-1/DD-1.2-owned.

---

## 34. Recovery

```ts
export interface QualityRecoveryPosition {
  readonly completed: readonly QualityCheckResultReference[];
  readonly failedOrNonPass: readonly QualityCheckResultReference[];
  readonly runningOrIndeterminate: readonly QualityCheckReference[];
  readonly notAttempted: readonly QualityCheckReference[];
  readonly stale: readonly QualityCheckResultReference[];
  readonly revalidation: readonly QualityRevalidationRequirement[];
  readonly dispositions: readonly ('retry_check' | 'rerun_scope' | 'reevaluate_gate' | 'manual_intervention')[];
}
```

Recovery is informational. Version 1 does not persist a resumable CI/workflow state machine.

---

## 35. Diagnostics

Initial stable domain codes include:

```text
QUALITY_OPERATION_UNAVAILABLE
QUALITY_SCOPE_REQUIRED
QUALITY_SCOPE_NOT_MANAGED
QUALITY_SCOPE_AMBIGUOUS
QUALITY_SCOPE_UNSUPPORTED
QUALITY_TARGET_UNAVAILABLE
QUALITY_TARGET_UNSUPPORTED
QUALITY_CHECK_UNAVAILABLE
QUALITY_CHECK_AMBIGUOUS
QUALITY_NO_TESTS
QUALITY_PROVIDER_FAILURE
QUALITY_CHECK_INCOMPLETE
QUALITY_CHECK_INDETERMINATE
QUALITY_COVERAGE_INCOMPLETE
QUALITY_COVERAGE_THRESHOLD_FAILED
QUALITY_LINT_WARNINGS
QUALITY_LINT_FAILED
QUALITY_TYPE_CHECK_FAILED
QUALITY_VALIDATION_INDETERMINATE
QUALITY_GATE_POLICY_REQUIRED
QUALITY_GATE_EVIDENCE_MISSING
QUALITY_GATE_FAILED
QUALITY_GATE_INCOMPLETE
QUALITY_GATE_INDETERMINATE
QUALITY_EVIDENCE_STALE
QUALITY_COMPOSITE_PARTIAL
QUALITY_CANCELLED
QUALITY_TIMEOUT
QUALITY_RECOVERY_REVALIDATION_REQUIRED
```

Provider-native errors are normalized below the domain. Diagnostics retain target/check/criterion/provider references where safe and never expose secrets by default.

---

## 36. Security and Non-Destructive Behaviour

Quality execution is non-mutating by default.

IS-18 never supplies autofix flags for ordinary lint/validation. Any future remediation/autofix must be a separately named mutating use case governed by IS-8 and owning-domain policy.

Quality requests cannot contain arbitrary executable/shell/package-script strings. IS-11/provider configuration controls bounded invocation.

Target/filter input is structured and cannot escape approved managed scope through path traversal/shell injection.

Provider output/report text is untrusted evidence and is bounded/normalized by IS-11 before domain use.

Credentials/protected configuration are excluded from diagnostics/events.

---

## 37. Headless and CI Semantics

Headless/CI callers supply or deterministically resolve operation, scope and required policy selectors. Missing/ambiguous selections return structured decision requirements rather than prompts/default broadening.

CI environment variables do not redefine managed scope or quality policy.

Machine-consumable payloads preserve per-target/check/gate states without requiring parsing terminal prose.

Invoking Quality from CI does not transfer CI/CD workflow ownership into IS-18.

---

## 38. Interaction Independence

No IS-18 module imports prompts, terminal colours, spinners, browser UI APIs or IDE APIs.

IS-22 may present eligible operations/scopes/gates and maps user choices into the same structured invocation available Headlessly.

Test UI is a product Quality operation, but presentation of the AppManager command itself remains adapter-owned.

---

## 39. Events and Observability

Semantic events may include:

```text
quality.scope.resolved
quality.target.started
quality.check.started
quality.check.completed
quality.check.failed
quality.check.unavailable
quality.gate.evaluated
quality.composite.partial
quality.evidence.stale
quality.operation.cancelled
quality.recovery.available
```

Events expose safe IDs/states/counts/durations/evidence references, not raw provider output or protected source/configuration by default.

---

## 40. Cross-Domain Quality Evidence

Other domains may consume Quality results/gate evidence as subordinate evidence.

The consumer decides whether evidence is required, sufficiently fresh and applicable to its workflow. IS-18 remains authoritative for Quality semantics but does not authorize the consumer's next effect.

Likewise IS-18 may consume domain-specific validation results only where gate policy explicitly includes them; it does not reinterpret their owner-specific semantics.

---

## 41. App Domain Relationship

Application build/dev/preview/reset semantics remain IS-14-owned.

A Quality check that happens to invoke TypeScript/Vitest/package tooling does not become an App build.

An App use case may require a Quality gate before a consequential step, but IS-14/IS-1 retains authority for that step.

---

## 42. Git Domain Relationship

Git status/commit/push/sync semantics remain IS-15-owned.

A passing gate cannot push or commit. A Git use case may consume fresh Quality evidence under Git policy without transferring Git authority to IS-18.

Repository state may be evidence for freshness/target context only through its owning contracts.

---

## 43. Nuxt and Docs Relationships

Nuxt-specific validation remains IS-16/IS-13-owned when Nuxt is primary intent. Quality gates may consume an accepted Nuxt validation result as a criterion if explicitly configured.

Docs validation remains IS-17/IS-12-owned. Documentation build/tool success is not automatically a Quality check unless an approved Quality criterion explicitly consumes its normalized result.

Shared provider/tool mechanics do not merge domain ownership.

---

## 44. AI Relationship

IS-10 may explain normalized Quality findings or propose remediation where an owning use case explicitly requests it.

AI output cannot change a failed check/gate into pass, invent missing measurements, suppress required findings or authorize remediation.

Any generated remediation remains an inert proposal until a separately authorized owning-domain/IS-8 transformation path accepts it.

---

## 45. Composition

IS-23 constructs:

1. IS-11 Quality Capability and configured providers;
2. Quality scope/eligibility/check/gate/composite policies;
3. check/multi-target/composite/gate runners;
4. Quality acceptance/recovery components;
5. ten canonical Quality use cases;
6. immutable Quality descriptor catalogue;
7. IS-1 registrations.

No import-time Quality singleton, global active provider, global active target, direct `process.env`, cwd-derived authority or service locator exists in IS-18.

---

## 46. Testing Requirements

Core tests cover at least:

1. ten canonical Quality IDs;
2. aliases/provider scripts do not define semantics;
3. IS-2 root scope;
4. selected-layer scope;
5. explicit subset scope;
6. all-managed scope;
7. duplicate target normalization;
8. no cwd reconstruction;
9. scope narrowing preserved;
10. no silent scope expansion;
11. managed membership not eligibility;
12. per-operation eligibility differs;
13. unsupported target non-pass;
14. unavailable target non-pass;
15. ambiguous recognition fails safe;
16. operation policy immutable during interpretation;
17. no invented mandatory checks;
18. no invented thresholds;
19. no invented warning-failure rule;
20. all/unit/e2e distinct;
21. provider identity does not alter operation identity;
22. recognition does not execute tests;
23. no-tests distinct from pass;
24. no-tests policy interpreted separately;
25. test assertion failure vs provider failure;
26. incomplete test execution non-pass;
27. per-target test truth retained;
28. per-category truth retained;
29. test UI availability;
30. test UI launch not test pass;
31. test UI not Headless requirement;
32. test UI cancellation;
33. coverage collection vs threshold distinct;
34. missing coverage metric remains missing;
35. partial coverage truthful;
36. threshold failure criterion;
37. lint unsupported when no provider;
38. lint warning policy;
39. lint ordinary mode non-mutating;
40. no autofix flag in ordinary lint;
41. type-check defect vs infrastructure failure;
42. type-check scope fidelity;
43. residual validation only when Quality-owned;
44. Nuxt validation not absorbed;
45. Docs validation not absorbed;
46. source transformation validation not absorbed;
47. arbitrary script not validator;
48. required/advisory criterion distinction;
49. missing required criterion non-pass;
50. gate all-required semantics;
51. advisory failure separately represented;
52. gate evidence freshness;
53. evaluateGate does not execute missing checks implicitly;
54. passing check not automatically passing gate;
55. passing gate not workflow authority;
56. composite plan Quality-bounded;
57. deterministic step order;
58. fail-fast stops unscheduled required work;
59. fail-fast preserves completed evidence;
60. continue-collecting preserves independent work;
61. skipped/not-attempted reasons retained;
62. multi-target mixed results remain mixed;
63. technical state distinct from quality state;
64. quality state distinct from gate state;
65. gate state distinct from IS-1 outcome;
66. nonzero exit can be technical completion + quality fail;
67. zero exit not sufficient for gate pass;
68. normalized findings used, no stdout reparsing;
69. missing measurements not synthesized;
70. generated reports remain quality artefacts;
71. generated artefact not source authority;
72. stale evidence recognized;
73. stale required gate evidence cannot pass when freshness required;
74. no silent stale rerun;
75. cancellation stops new scheduling;
76. cancellation preserves completed checks;
77. timeout remains incomplete/non-pass;
78. no global Quality lock;
79. conflict-aware concurrency;
80. deterministic result ordering under concurrency;
81. no implicit provider retry/fallback;
82. retry requires revalidation;
83. Quality acceptance operation-specific;
84. no competing success Boolean;
85. partial execution truth retained;
86. recovery informational only;
87. no persisted CI workflow engine;
88. structured Headless ambiguity;
89. CI env does not redefine scope;
90. no prompts/colors in domain;
91. semantic events presentation-free;
92. no arbitrary shell/package command input;
93. provider output treated untrusted;
94. credentials absent from diagnostics;
95. cross-domain consumer retains workflow authority;
96. App build remains App-owned;
97. Git push/commit remains Git-owned;
98. Nuxt/Docs validation ownership preserved;
99. AI explanation cannot alter Quality truth;
100. AI remediation remains inert;
101. explicit IS-23 composition;
102. no singleton/global provider;
103. IS-11 provider substitution leaves domain-policy tests unchanged;
104. IS-18 acceptance remains subordinate to IS-1 final acceptance.

Integration tests use controlled IS-11 substitutes plus fixtures for root/layer/subset/all-managed scope, tests/no-tests, coverage, absent lint provider, type checking, gates, composite runs, stale evidence, cancellation, timeout and generated artefacts.

---

## 47. Current Implementation Disposition

| Current artefact/responsibility | Disposition | Version 1 treatment |
|---|---|---|
| `app/commands/quality/runQuality.ts` placeholder | **REPLACE / SPLIT / RELOCATE** | Current file is TODO scaffolding. Replace with IS-22 adapter routing to ten explicit IS-18 use cases. |
| single broad `runQuality` concept | **SPLIT** | Preserve semantic test/coverage/UI/lint/type/validation/gate/composite distinctions. |
| package `vitest:*` scripts | **RETAIN / ADAPT below domain** | Useful provider invocation/developer mechanisms; IS-11 maps semantic checks, scripts do not define domain identity. |
| package `typecheck` script | **RETAIN / ADAPT below domain** | Useful TypeScript provider mechanism; IS-11 owns provider invocation. |
| current absence of governing lint provider | **RETAIN as implementation fact** | `quality.lint` remains semantic use case but unavailable/unsupported until deliberately implemented/configured. |
| `vitest.config.ts` | **RETAIN / ADAPT below domain** | Provider configuration/reporting evidence owned beneath IS-11; not Quality policy authority. |
| current test reports/coverage artefacts | **ADAPT** | Normalize as request-attributable generated quality artefact evidence. |
| current tests | **RETAIN** | Existing suites remain implementation assets and provider fixtures; their presence does not define managed scope. |
| direct package/process invocation from command paths | **REPLACE** | IS-18 -> IS-11 -> IS-5 only. |
| warning/threshold/gate decisions embedded in provider configuration | **SPLIT / RELOCATE** | Application policy belongs to IS-18/IS-3; provider-native enforcement may be defense/evidence only. |
| future linter autofix/provider mutation mode | **EXCLUDE / RELOCATE** | Ordinary Quality is read-only; explicit remediation requires IS-8/owning-domain authority. |
| CI scripts/workflows | **RETAIN outside domain authority** | May invoke Headless Quality; do not become IS-18 workflow model. |
| prompts/spinners/colors in command architecture | **RELOCATE** | IS-22 presentation; IS-1 semantic events/outcomes. |
| singleton/service-locator patterns | **REPLACE** | IS-23 explicit composition/injection. |

The near-empty current Quality command implementation is not normative architecture. DD-4.1 and FR-QUAL-001–116 define the implementation target.

---

## 48. Migration Sequence

1. add Quality-domain contracts and ten canonical descriptors;
2. add IS-2-backed root/layer/subset/all-managed scope resolver;
3. add duplicate target normalization;
4. add operation-relative eligibility evaluator over IS-11 recognition;
5. add immutable operation-effective check/warning/threshold/gate/composite policy projections;
6. inject IS-11 Quality Capability;
7. implement all/unit/e2e test use cases;
8. implement no-tests policy interpretation;
9. implement coverage collection and explicit threshold criteria;
10. implement test-UI lifecycle semantics;
11. implement lint use case with unavailable/unsupported Version 1 behavior until provider exists;
12. implement type-check use case with strict scope fidelity;
13. implement approved residual validation registry/policy;
14. implement gate policy mapping/evaluation;
15. implement composite Quality plan/continuation;
16. implement multi-target aggregation preserving per-check truth;
17. implement stale-evidence/freshness handling;
18. implement cancellation/timeout/concurrency/retry interpretation;
19. implement generated-quality-artefact evidence handling;
20. implement Quality acceptance/recovery payloads;
21. replace `runQuality.ts` placeholder with IS-22 adapter registrations;
22. remove direct process/provider/prompt access from Quality domain paths;
23. remove singleton/global provider/target state as IS-23 composition lands;
24. run authority, scope, state-separation, gate, Headless, stale, cancellation, non-mutation and provider-substitution conformance suites.

---

## 49. Traceability

| Implementation concern | Governing authority |
|---|---|
| domain authority/non-ownership | DD-QUAL-001–005; FR-QUAL-001–005 |
| invocation/availability/scope/cancellation | DD-4.1 §§5–8; FR-QUAL-006–018 |
| target/scope/eligibility | DD-QUAL-006–009; FR-QUAL-019–028 |
| tests | DD-4.1 test orchestration; FR-QUAL-029–040 |
| test UI | DD-4.1 test-UI design; FR-QUAL-041–045 |
| coverage | DD-4.1 coverage design; FR-QUAL-046–053 |
| lint | DD-4.1 lint design; FR-QUAL-054–060 |
| type checking | DD-4.1 type-check design; FR-QUAL-061–065 |
| validation | DD-4.1 validation ownership; FR-QUAL-066–070 |
| gate criteria/evaluation | DD-QUAL-010–012; FR-QUAL-071–080 |
| composite Quality | DD-QUAL-013; FR-QUAL-081–087 |
| CI/automation boundary | DD-4.1 automation boundary; FR-QUAL-088–093 |
| result/state semantics | DD-QUAL-014 and DD-4.1 result design; FR-QUAL-094–103 |
| failure/cancellation/concurrency | DD-4.1 execution-state design; FR-QUAL-104–110 |
| safety/non-destructive behavior | DD-4.1 safety design; FR-QUAL-111–116 |
| bounded Quality mechanics | DD-2.8 / IS-11 |
| final application acceptance | DD-1.5 / IS-1 |

---

## 50. Version 1 Non-Drift Baseline

```text
IS-22 adapter / CI / IDE
          |
          v
IS-1 canonical invocation/authority
          |
          +--> IS-2 managed Quality scope
          +--> IS-3 operation-effective Quality policy
          |
          v
      IS-18 Quality Domain
          |
          +--> semantic operation/scope/eligibility
          +--> check/warning/threshold/gate policy
          +--> composite ordering/continuation
          +--> domain interpretation/recovery
          |
          v
      IS-11 Quality Capability
          |
          +--> recognition/provider selection
          +--> bounded execution through IS-5
          +--> normalized findings/measurements
          +--> explicit criterion evaluation
          |
          v
      IS-18 Quality acceptance
          |
          v
      IS-1 final acceptance
          |
          v
canonical AppManager outcome
```

The non-drift rule is:

> **Version 1 Quality Domain owns quality-assurance application intent, semantic scope, operation-relative eligibility, required-check and warning/threshold/gate policy, composite orchestration and Quality-domain acceptance. It never reconstructs managed scope from cwd or package scripts, promotes provider execution to application truth, invents thresholds or mandatory checks, treats no-tests/unavailable/incomplete evidence as pass without explicit policy, turns a passing gate into workflow authority, absorbs domain-specific validation because tools are similar, enables implicit autofix, becomes a CI/CD engine, hides partial execution, or publishes a competing final AppManager outcome.**