# DD-2.8 — AppManager Quality Capability Detailed Design

> **Detailed Design ID:** DD-2.8
>
> **Design family:** DD-2 — Shared Capabilities

> **Status:** Version 1 Detailed Design Specification
>
> **Detailed Design authority:** This document defines the permanent shared contracts for quality-capability recognition, bounded quality-check execution, normalized findings and measurements, quality-result aggregation, quality-gate evaluation, provider isolation, generated quality artefacts, cancellation and concurrency beneath AppManager application authority. It refines, but does not override, the root Design Specification, Functional Specifications, accepted ADRs, or the DD-1 Application Core Detailed Designs.
>
> **Governing sources:** [Project Documentation Guide](../project-documentation-guide-v01.md), [AppManager Design Specification](../appmanager-design-specification-v01.md), [Detailed Design Register](../project_management/detailed-design-register-v01.md), [ADR-0001 — Primary Application Runtime](../project_management/decisions/adr-0001-primary-application-runtime.md)
>
> **Related Detailed Design authorities:** [DD-1.1 — Application Invocation](../dd_1_application_core/dd-1-1-application-invocation-detailed-design-v01.md), [DD-1.2 — Execution Outcomes](../dd_1_application_core/dd-1-2-execution-outcomes-detailed-design-v01.md), [DD-1.3 — Managed Project](../dd_1_application_core/dd-1-3-managed-project-detailed-design-v01.md), [DD-1.4 — Configuration Resolution](../dd_1_application_core/dd-1-4-configuration-resolution-detailed-design-v01.md), [DD-1.5 — Application Engine](../dd_1_application_core/dd-1-5-application-engine-detailed-design-v01.md), [DD-2.1 — Resource Access](dd-2-1-resource-access-detailed-design-v01.md), [DD-2.2 — Process Execution](dd-2-2-process-execution-detailed-design-v01.md), [DD-2.3 — Repository Capability](dd-2-3-repository-capability-detailed-design-v01.md), [DD-2.4 — Source Intelligence](dd-2-4-source-intelligence-detailed-design-v01.md), [DD-2.5 — Source Transformation](dd-2-5-source-transformation-detailed-design-v01.md), [DD-2.6 — Resource Registry and Template](dd-2-6-resource-registry-and-template-detailed-design-v01.md), [DD-2.7 — AI Capability](dd-2-7-ai-capability-detailed-design-v01.md)
>
> **Primary Functional authority:** [docs/functional/quality-functional-specification-v01.md](../functional/quality-functional-specification-v01.md), together with owning-domain Functional Specifications where quality evidence is consumed by another workflow.

---

## 1. Purpose

This specification defines the shared Quality Capability boundary used to recognize, execute and normalize bounded quality checks and to evaluate explicitly supplied quality criteria without allowing test runners, linters, type checkers, coverage engines, validators, package scripts or CI systems to acquire AppManager application authority.

The governing rules are:

> **A quality provider produces technical execution evidence, findings and measurements; AppManager determines what that evidence means for the requested quality intent and any applicable quality gate.**

> **Quality-check execution is non-source-mutating by default. Provider support for autofix or other mutation does not grant mutation authority.**

> **A completed provider process is not equivalent to a passing quality check, and a passing quality check is not automatically equivalent to a passing quality gate.**

> **Quality Capability does not own CI/CD merely because quality checks are commonly executed by CI.**

The capability supplies stable internal semantics beneath Quality-domain use cases and other authorized workflows that consume quality evidence.

---

## 2. Scope

This design owns permanent contracts for:

- quality-capability identity and recognition;
- semantic check classes including tests, coverage, lint, type checking and bounded validation;
- target-relative capability availability;
- quality execution requests;
- provider selection under supplied constraints and effective configuration;
- bounded provider invocation through Process Execution or equivalent approved provider boundaries;
- provider-output parsing and normalization;
- normalized findings, diagnostics and measurements;
- test-category and test-result evidence;
- coverage-measurement evidence;
- lint and type-diagnostic evidence;
- validation evidence;
- per-check and per-target result models;
- skipped, unavailable, incomplete and indeterminate states;
- quality-criterion representation;
- quality-gate evaluation from explicit policy;
- composite quality execution plans supplied by an owning use case;
- deterministic ordering and fail-fast/continue policy inputs;
- progress, cancellation and timeout propagation;
- generated quality artefact evidence;
- concurrency/isolation evidence;
- stale-context/revision evidence;
- provider replaceability and provider-independent testing.

This design does not require one quality service, package-script convention, test framework, coverage engine, linter, type checker, report format, process API, CI provider, class hierarchy, package or runtime topology.

---

## 3. Explicit Non-Ownership

Quality Capability shall not own:

- AppManager command or use-case semantics;
- managed-project identity or managed scope;
- application authorization or confirmation policy;
- configuration-source precedence;
- application build, dev, preview or deployment semantics;
- repository status, commit, push, sync or release semantics;
- complete CI/CD workflow orchestration;
- source-transformation authority or autofix intent;
- documentation or Nuxt-domain validation semantics where those domains own the primary intent;
- provider package installation;
- arbitrary package-script execution merely because a script has a quality-like name;
- application-level retry/fallback policy;
- final AppManager success, failure, partial-success or cancellation acceptance outside the bounded Quality contract.

<a id="dd-qualcap-001"></a>

**DD-QUALCAP-001 — Delegated execution remains subordinate**  
Quality Capability shall execute only bounded quality work selected by an authoritative caller and shall not invent application intent, managed scope, authorization or unrelated workflow continuation.

<a id="dd-qualcap-002"></a>

**DD-QUALCAP-002 — Provider evidence is not application authority**  
Provider-native exit status, stdout, stderr, reports, exceptions and UI state shall remain technical evidence until normalized and interpreted under the requested quality semantics.

---

## 4. Architectural Position

```text
Application Engine / owning Quality use case
        |
        +--> managed-project context / approved quality scope
        +--> effective configuration
        +--> quality intent / check selection
        +--> quality policy / gate criteria
        +--> ordering / continuation / timeout policy
        |
        v
+--------------------------------------------------+
| Quality Capability                               |
|                                                  |
| capability recognition / availability            |
| bounded check resolution                         |
| provider delegation                              |
| result/report normalization                      |
| findings / measurements                          |
| per-check / per-target aggregation               |
| explicit quality-gate evaluation                 |
| progress / cancellation / diagnostics            |
+--------------------------+-----------------------+
                           |
                           v
             quality provider / Process Execution
                           |
                           v
          test / coverage / lint / type / validator
```

<a id="dd-qualcap-003"></a>

**DD-QUALCAP-003 — Capability boundary is not the Quality domain**  
The shared capability may be consumed by Quality-domain use cases or other authorized workflows without transferring ownership of those workflows.

<a id="dd-qualcap-004"></a>

**DD-QUALCAP-004 — No upward workflow authority**  
A provider or Quality Capability implementation shall not trigger build, Git, deployment, source mutation or unrelated AppManager commands merely because a quality result suggests such an action.

---

## 5. Quality Capability and Check Identity

A quality check has semantic identity independent of the executable or package script used to implement it.

Core Version 1 classes include:

- all-tests;
- unit-tests;
- end-to-end-tests;
- coverage;
- test UI where supported;
- lint;
- type-check;
- bounded general validation.

<a id="dd-qualcap-005"></a>

**DD-QUALCAP-005 — Semantic identity precedes provider command**  
A command string or package-script name shall not itself define the canonical quality-check identity.

<a id="dd-qualcap-006"></a>

**DD-QUALCAP-006 — Similar mechanics do not collapse semantics**  
All-tests, unit-tests, end-to-end-tests, coverage, lint and type checking remain semantically distinct even when one provider executable implements several classes.

<a id="dd-qualcap-007"></a>

**DD-QUALCAP-007 — Extension requires defined semantics**  
Additional validation/check classes may be registered only where their result semantics and ownership are sufficiently defined; arbitrary executable scripts shall not automatically become Quality capabilities.

---

## 6. Target and Capability Recognition

Quality availability is relative to both the requested check and the selected managed target.

Recognition evidence may include:

- semantic target identity;
- recognized check class;
- provider identity;
- provider/configuration evidence;
- required resource or script evidence;
- supported test category;
- report/structured-output support;
- interactive UI support;
- limitations and diagnostics;
- observation revision/time where material.

<a id="dd-qualcap-008"></a>

**DD-QUALCAP-008 — Recognition is non-executing**  
Recognizing that a quality capability exists shall not execute the check or establish a passing result.

<a id="dd-qualcap-009"></a>

**DD-QUALCAP-009 — Recognition does not establish scope**  
A discoverable script, configuration file, executable or test directory does not make a target managed, selected or authorized.

<a id="dd-qualcap-010"></a>

**DD-QUALCAP-010 — Availability is check-relative**  
A target supporting one quality class shall not be assumed to support another.

<a id="dd-qualcap-011"></a>

**DD-QUALCAP-011 — No-tests is distinct from unavailable**  
Where reliably knowable, a valid target with no tests for a requested category shall remain distinguishable from a target lacking the provider/capability required to inspect or execute that category.

---

## 7. Provider Resolution

Provider selection shall consume explicit check requirements and governed effective configuration.

<a id="dd-qualcap-012"></a>

**DD-QUALCAP-012 — Governed provider inputs**  
Quality Capability shall consume DD-1.4 effective configuration and caller-supplied constraints rather than independently establishing precedence from package scripts, environment variables, provider defaults or registry order.

<a id="dd-qualcap-013"></a>

**DD-QUALCAP-013 — Provider eligibility is semantic**  
A provider is eligible only if it can satisfy the requested quality-check contract for the selected target.

<a id="dd-qualcap-014"></a>

**DD-QUALCAP-014 — Ambiguity is explicit**  
Where multiple materially different providers remain eligible and governing policy cannot choose deterministically, the capability shall return ambiguity rather than guess.

<a id="dd-qualcap-015"></a>

**DD-QUALCAP-015 — Provider details remain below the shared contract**  
Executable names, package-manager syntax, command-line flags, SDK objects and provider report schemas shall not become universal Quality Capability contracts.

---

## 8. Quality Execution Request

A normalized bounded request may include:

- check identity;
- target identity and approved scope;
- provider constraints;
- effective configuration snapshot/reference;
- execution mode;
- category/filter constraints where supported;
- requested measurements/reports;
- timeout/cancellation linkage;
- output/report bounds;
- correlation identity;
- policy inputs required for normalization.

<a id="dd-qualcap-016"></a>

**DD-QUALCAP-016 — Request cannot expand managed scope**  
Provider-specific working-directory, project or include-pattern mechanics shall remain bounded by the approved quality target/scope.

<a id="dd-qualcap-017"></a>

**DD-QUALCAP-017 — Headless requests are deterministic**  
A complete Headless quality request shall not require interactive provider, target or check selection.

<a id="dd-qualcap-018"></a>

**DD-QUALCAP-018 — Provider request is not general process authority**  
Quality Capability may delegate an approved provider invocation to Process Execution, but shall not expose arbitrary command execution through the Quality contract.

---

## 9. Process Execution Boundary

Most command-line quality providers ultimately depend on DD-2.2 Process Execution.

<a id="dd-qualcap-019"></a>

**DD-QUALCAP-019 — Process completion remains technical evidence**  
Launch success, exit code, signal, timeout and captured output shall be interpreted according to the selected provider/check semantics before a Quality result is established.

<a id="dd-qualcap-020"></a>

**DD-QUALCAP-020 — Non-zero is not one universal meaning**  
A non-zero provider completion may represent quality findings, failed tests, invalid invocation, infrastructure failure or another provider-defined state and shall be normalized accordingly.

<a id="dd-qualcap-021"></a>

**DD-QUALCAP-021 — Zero is not sufficient for gate success**  
A provider's successful technical completion shall not bypass findings interpretation, coverage thresholds, required-check policy or gate evaluation.

<a id="dd-qualcap-022"></a>

**DD-QUALCAP-022 — Shell semantics remain explicit**  
Quality provider invocation shall preserve DD-2.2 executable/argument/shell boundaries and shall not silently escalate to shell interpretation for convenience.

---

## 10. Normalized Quality Result Model

A bounded quality result shall preserve distinctions required for application interpretation.

A normalized check result should be able to represent:

- check identity;
- target identity;
- provider identity/provenance;
- technical execution state;
- quality state;
- findings summary;
- measurements;
- normalized diagnostics;
- generated artefacts;
- completeness;
- timing;
- cancellation/timeout evidence;
- stale/revision evidence;
- bounded provider detail.

Quality states include, where applicable:

- passed;
- failed;
- skipped;
- unavailable;
- incomplete;
- indeterminate;
- cancelled.

<a id="dd-qualcap-023"></a>

**DD-QUALCAP-023 — Technical and quality states remain distinct**  
The model shall not collapse provider execution status and interpreted quality status into one Boolean.

<a id="dd-qualcap-024"></a>

**DD-QUALCAP-024 — No false pass from absence of failure**  
Unavailable, incomplete, indeterminate, cancelled or not-executed work shall not be represented as passed merely because no failing finding was produced.

<a id="dd-qualcap-025"></a>

**DD-QUALCAP-025 — Provider-native output is supplemental**  
Raw or bounded provider output may be retained for diagnostics but shall not be required for callers to determine normalized Quality status.

---

## 11. Findings and Diagnostics

A normalized finding may carry:

- finding category;
- severity/classification;
- message/summary;
- target/resource identity;
- location/range where available;
- rule/check identifier;
- provider provenance;
- suppression/advisory evidence where supplied;
- bounded provider detail.

<a id="dd-qualcap-026"></a>

**DD-QUALCAP-026 — Finding severity is not automatically gate severity**  
Provider labels such as warning/error do not independently determine application gate failure; effective Quality policy interprets their significance.

<a id="dd-qualcap-027"></a>

**DD-QUALCAP-027 — Findings remain attributable**  
Multi-target and multi-check execution shall retain enough identity to attribute findings to their check and target.

<a id="dd-qualcap-028"></a>

**DD-QUALCAP-028 — Diagnostics are bounded**  
Normalization shall avoid unnecessarily copying unbounded provider output, protected configuration or sensitive project content into application diagnostics.

---

## 12. Test Semantics

Test execution shall preserve category, execution and assertion distinctions.

A normalized test result may include:

- requested category;
- discovered/executed test counts where reliable;
- passed/failed/skipped counts;
- failed-test summaries;
- suite/file identity where useful;
- duration;
- provider/infrastructure failure evidence;
- completeness.

<a id="dd-qualcap-029"></a>

**DD-QUALCAP-029 — Assertion failure is not infrastructure failure**  
A provider successfully running tests that fail assertions shall produce failed-test evidence distinct from failure to launch or complete the provider.

<a id="dd-qualcap-030"></a>

**DD-QUALCAP-030 — No-tests state is explicit**  
A reliable no-tests result shall not be normalized as tests-passed unless explicit policy defines that interpretation at a higher layer.

<a id="dd-qualcap-031"></a>

**DD-QUALCAP-031 — Incomplete tests cannot pass completely**  
Cancelled, timed-out or otherwise incomplete test execution shall preserve incompleteness regardless of tests that passed before interruption.

<a id="dd-qualcap-032"></a>

**DD-QUALCAP-032 — Category fidelity**  
Unit, end-to-end and all-tests requests shall retain requested category identity through provider normalization.

---

## 13. Test UI Semantics

Test UI is a provider capability, not a test outcome.

<a id="dd-qualcap-033"></a>

**DD-QUALCAP-033 — UI launch is execution evidence**  
Successfully starting a test UI proves only that the UI capability launched; it does not establish any test or gate result.

<a id="dd-qualcap-034"></a>

**DD-QUALCAP-034 — UI capability is optional**  
A provider may support non-interactive testing without supporting an interactive UI.

<a id="dd-qualcap-035"></a>

**DD-QUALCAP-035 — Long-running UI state is represented**  
Where a test UI remains active, its running/stopped/cancelled state shall be represented without inventing a completed quality result.

---

## 14. Coverage Semantics

Coverage collection and coverage-policy evaluation are separate stages.

A normalized measurement may represent statement, branch, function, line or other explicitly supported metrics together with scope/completeness evidence.

<a id="dd-qualcap-036"></a>

**DD-QUALCAP-036 — Measurement success is not threshold success**  
Successful coverage collection establishes measurement evidence, not satisfaction of a configured threshold.

<a id="dd-qualcap-037"></a>

**DD-QUALCAP-037 — Metric semantics remain explicit**  
Different provider metrics shall not be combined or compared as if equivalent unless their normalized semantics are compatible.

<a id="dd-qualcap-038"></a>

**DD-QUALCAP-038 — Missing measurement remains unknown**  
A metric absent from provider evidence shall not be invented as zero, 100%, or another value.

<a id="dd-qualcap-039"></a>

**DD-QUALCAP-039 — Coverage scope is retained**  
Coverage evidence shall identify the target/scope sufficiently to prevent partial coverage being represented as complete-project coverage.

---

## 15. Lint Semantics

<a id="dd-qualcap-040"></a>

**DD-QUALCAP-040 — Lint is non-mutating by default**  
Ordinary lint requests shall not enable provider autofix or write modes.

<a id="dd-qualcap-041"></a>

**DD-QUALCAP-041 — Provider lint findings are normalized**  
Where provider structure permits, lint rule identity, severity, resource/location and message shall be normalized without requiring callers to parse terminal text.

<a id="dd-qualcap-042"></a>

**DD-QUALCAP-042 — Warning interpretation remains policy**  
Warnings remain findings; whether they fail a check or gate is determined by the applicable Quality semantics/policy rather than universal provider severity assumptions.

<a id="dd-qualcap-043"></a>

**DD-QUALCAP-043 — Autofix is outside ordinary Quality execution**  
A provider's ability to fix findings shall not be exposed as an implicit side effect. Any approved mutating workflow shall use explicit Source Transformation authority.

---

## 16. Type-Check Semantics

<a id="dd-qualcap-044"></a>

**DD-QUALCAP-044 — Type diagnostics are findings**  
Provider-reported type errors/diagnostics shall be normalized as quality findings when the provider successfully evaluates the requested scope.

<a id="dd-qualcap-045"></a>

**DD-QUALCAP-045 — Type findings differ from provider failure**  
Type errors shall remain distinguishable from inability to launch, configure or complete the type-check provider.

<a id="dd-qualcap-046"></a>

**DD-QUALCAP-046 — Type-check scope fidelity**  
Provider project/configuration mechanics shall not silently broaden the requested managed target without the owning use case authorizing the broader semantics.

---

## 17. General Validation Boundary

<a id="dd-qualcap-047"></a>

**DD-QUALCAP-047 — Generic validation is residual, not absorbing**  
Quality Capability may support read-only validation whose primary semantics are genuinely quality-oriented and not owned more specifically by another domain.

<a id="dd-qualcap-048"></a>

**DD-QUALCAP-048 — Domain validation retains ownership**  
Nuxt, Docs, Source Transformation or other domain-specific validation does not become Quality-owned merely because it uses similar provider mechanics.

<a id="dd-qualcap-049"></a>

**DD-QUALCAP-049 — Post-transformation validation remains DD-2.5**  
Source-level validation required to establish a transformation's validity remains part of Source Transformation even when the same tool can also be invoked as an independent Quality check.

---

## 18. Quality Criteria and Gate Model

A gate criterion should identify:

- criterion identity;
- source check/measurement;
- target/scope;
- required/advisory classification;
- comparison/acceptance rule;
- applicable threshold or finding policy;
- missing/unavailable/incomplete treatment;
- resulting criterion status and evidence.

<a id="dd-qualcap-050"></a>

**DD-QUALCAP-050 — Gate criteria are explicit inputs**  
Quality Capability shall evaluate supplied/effective criteria and shall not invent mandatory checks or thresholds merely because a provider supports them.

<a id="dd-qualcap-051"></a>

**DD-QUALCAP-051 — Required and advisory remain distinct**  
Advisory failure/unavailability shall remain distinguishable from required-criterion failure.

<a id="dd-qualcap-052"></a>

**DD-QUALCAP-052 — Required unavailable cannot pass**  
A required criterion whose necessary check is unavailable, incomplete or indeterminate shall not yield a complete gate pass unless an explicit governing policy defines a different acceptable state.

<a id="dd-qualcap-053"></a>

**DD-QUALCAP-053 — Gate provenance is retained**  
A gate result shall preserve the criteria evaluated and evidence sufficient to explain the pass/fail/indeterminate decision without parsing provider output.

<a id="dd-qualcap-054"></a>

**DD-QUALCAP-054 — Gate evaluation is deterministic**  
Equivalent normalized check evidence and equivalent effective gate policy shall yield materially equivalent gate evaluation.

---

## 19. Composite Quality Execution

A composite quality run coordinates multiple bounded checks but does not become a general workflow engine.

<a id="dd-qualcap-055"></a>

**DD-QUALCAP-055 — Composite plan is explicit**  
The selected checks, targets and policy shall be supplied by the owning Quality use case/effective policy rather than inferred from every executable quality-like script found in the project.

<a id="dd-qualcap-056"></a>

**DD-QUALCAP-056 — Ordering is governed**  
Where order matters, the plan shall carry deterministic ordering rather than rely on incidental provider discovery order.

<a id="dd-qualcap-057"></a>

**DD-QUALCAP-057 — Fail-fast is policy**  
Stopping after a failed required check versus continuing to gather evidence shall be an explicit plan/policy property.

<a id="dd-qualcap-058"></a>

**DD-QUALCAP-058 — Unstarted checks remain visible**  
When fail-fast, cancellation or failure prevents later checks from running, they shall remain distinguishable as not attempted/skipped according to the governing reason rather than silently disappearing.

<a id="dd-qualcap-059"></a>

**DD-QUALCAP-059 — Aggregation preserves components**  
Composite results shall retain per-check and per-target evidence rather than replacing it with only one aggregate Boolean.

---

## 20. Multi-Target Semantics

<a id="dd-qualcap-060"></a>

**DD-QUALCAP-060 — Targets remain individually attributable**  
Checks spanning root/layers/other approved managed units shall retain per-target identity and status.

<a id="dd-qualcap-061"></a>

**DD-QUALCAP-061 — Overlap is normalized**  
Overlapping target selections shall not accidentally execute the same logical target more than once unless explicitly requested.

<a id="dd-qualcap-062"></a>

**DD-QUALCAP-062 — Unsupported target is not passing**  
A managed target lacking a requested capability shall be represented as unsupported/unavailable according to the contract, not as passed.

<a id="dd-qualcap-063"></a>

**DD-QUALCAP-063 — Mixed targets produce mixed evidence**  
A multi-target run with different target outcomes shall preserve the mixture for DD-1.2/Application Engine interpretation.

---

## 21. Progress, Cancellation and Timeout

<a id="dd-qualcap-064"></a>

**DD-QUALCAP-064 — Progress is semantic**  
Progress/events should identify check/target lifecycle where useful without making terminal rendering or one event transport normative.

<a id="dd-qualcap-065"></a>

**DD-QUALCAP-065 — Cancellation propagates**  
DD-1 cancellation shall stop future checks and propagate to active provider execution where supported.

<a id="dd-qualcap-066"></a>

**DD-QUALCAP-066 — Completed checks remain completed**  
Cancellation shall not erase quality evidence already established before cancellation.

<a id="dd-qualcap-067"></a>

**DD-QUALCAP-067 — Cancellation is not pass**  
An incomplete required check caused by cancellation shall not become a passing check merely because no failure was observed.

<a id="dd-qualcap-068"></a>

**DD-QUALCAP-068 — Timeout is governed**  
Timeouts shall derive from effective configuration/request/provider constraints rather than hidden constants that redefine the permanent Quality semantics.

---

## 22. Generated Quality Artefacts

Quality providers may generate coverage reports, test reports, snapshots, caches, temporary files or other artefacts even when source mutation is prohibited.

<a id="dd-qualcap-069"></a>

**DD-QUALCAP-069 — Artefact effects are explicit**  
Known generated artefacts that materially affect the managed project/worktree or downstream interpretation shall be represented as provider effects/evidence.

<a id="dd-qualcap-070"></a>

**DD-QUALCAP-070 — Artefact permission is bounded**  
Permission to generate an approved quality report/cache does not authorize modification of unrelated source, configuration or repository state.

<a id="dd-qualcap-071"></a>

**DD-QUALCAP-071 — Generated artefact is not source autofix**  
A recognized quality report or cache shall remain semantically distinct from provider modification of source under test.

<a id="dd-qualcap-072"></a>

**DD-QUALCAP-072 — Cleanup is truthful**  
Quality Capability shall not claim generated artefacts were removed or rolled back unless cleanup actually occurred.

---

## 23. Concurrency and Isolation

Quality providers may contend for ports, caches, report paths, snapshots, browsers or other shared state.

<a id="dd-qualcap-073"></a>

**DD-QUALCAP-073 — Concurrency conflicts are deliberate**  
Where concurrent quality requests can interfere materially, the capability shall serialize, isolate or reject according to explicit provider/capability policy rather than silently cross-contaminate results.

<a id="dd-qualcap-074"></a>

**DD-QUALCAP-074 — Result attribution survives concurrency**  
Provider output, reports and generated artefacts shall be attributable to the correct quality request where concurrent execution is permitted.

<a id="dd-qualcap-075"></a>

**DD-QUALCAP-075 — Provider global state is not application state**  
A provider's internal/global execution state shall not become the canonical AppManager quality state model.

---

## 24. Stale Context and Revision Semantics

<a id="dd-qualcap-076"></a>

**DD-QUALCAP-076 — Quality evidence is contextual**  
A quality result applies to the project/configuration/provider state actually evaluated and shall not be represented as timeless proof about later materially changed state.

<a id="dd-qualcap-077"></a>

**DD-QUALCAP-077 — Material stale state is exposed**  
If AppManager can detect that managed-project/configuration/source state materially changed between resolution and execution/acceptance, stale evidence shall be surfaced for owning-use-case interpretation.

<a id="dd-qualcap-078"></a>

**DD-QUALCAP-078 — No universal snapshot guarantee**  
This design does not claim filesystem/repository snapshot isolation unless an implementation/provider explicitly supplies it.

---

## 25. CI/CD and Cross-Domain Consumption

<a id="dd-qualcap-079"></a>

**DD-QUALCAP-079 — CI is an adapter/orchestrator context**  
Execution from CI does not alter the semantic Quality contract or transfer complete CI/CD ownership to Quality Capability.

<a id="dd-qualcap-080"></a>

**DD-QUALCAP-080 — Quality evidence may gate other workflows**  
Git, deployment or other workflows may consume normalized Quality/gate evidence, but the owning workflow decides whether and how that evidence authorizes continuation.

<a id="dd-qualcap-081"></a>

**DD-QUALCAP-081 — Quality does not push or deploy**  
Quality Capability shall not perform repository push or deployment as an implied consequence of a passing gate.

<a id="dd-qualcap-082"></a>

**DD-QUALCAP-082 — Adapter equivalence**  
TUI, Headless, CI, IDE and future adapters expressing equivalent Quality intent/policy shall consume equivalent capability semantics.

---

## 26. Relationship to AI Capability

AI may explain or summarize quality findings but does not determine the underlying quality truth.

<a id="dd-qualcap-083"></a>

**DD-QUALCAP-083 — AI explanation is supplementary**  
DD-2.7 output may provide explanation, triage or proposed remediation, but it shall not replace normalized provider findings or gate policy as the source of a Quality result.

<a id="dd-qualcap-084"></a>

**DD-QUALCAP-084 — AI cannot silently mutate remediation**  
AI-generated remediation remains proposal/evidence and must route through an authorized owning use case and DD-2.5 before source mutation.

---

## 27. Provider Contract

A Quality provider may own technical mechanics including:

- provider capability probing;
- provider-specific invocation construction;
- package-manager/executable integration;
- report-format parsing;
- provider exit/status interpretation;
- provider-specific test/filter arguments;
- coverage extraction;
- finding extraction;
- UI launch mechanics;
- cancellation/termination integration;
- generated artefact discovery.

<a id="dd-qualcap-085"></a>

**DD-QUALCAP-085 — Provider normalization**  
Provider-native process/results shall be translated into the shared Quality Capability contracts before application interpretation.

<a id="dd-qualcap-086"></a>

**DD-QUALCAP-086 — Provider limitations are explicit**  
A provider unable to satisfy a requested category, scope, report or UI contract shall return unsupported/unavailable evidence rather than silently substitute materially different semantics.

<a id="dd-qualcap-087"></a>

**DD-QUALCAP-087 — Provider replaceability**  
Callers shall not require Vitest, ESLint, TypeScript, `vue-tsc`, a particular coverage engine or provider-native data types to consume normalized Quality evidence.

<a id="dd-qualcap-088"></a>

**DD-QUALCAP-088 — No universal provider framework**  
Common provider naming/patterns do not require a universal executable plugin framework, common base class or cross-runtime protocol in Version 1.

---

## 28. Relationship to DD-1 Outcomes

Quality Capability supplies normalized check/gate evidence to the owning use case/Application Engine.

<a id="dd-qualcap-089"></a>

**DD-QUALCAP-089 — Check pass is not automatically invocation success**  
A passing bounded check contributes evidence; the owning use case determines final AppManager outcome when additional stages or criteria exist.

<a id="dd-qualcap-090"></a>

**DD-QUALCAP-090 — Gate result is application-relevant evidence**  
A Quality-domain gate may itself represent the primary requested Quality result, but higher-level workflows consuming that gate retain authority over their own continuation and final outcome.

<a id="dd-qualcap-091"></a>

**DD-QUALCAP-091 — Partial/mixed evidence is preserved**  
Mixed target/check states shall be supplied to DD-1.2 rather than collapsed prematurely.

---

## 29. Current Implementation Evidence and Reconciliation

This section is historical implementation evidence under the [Documentation Guide reading conventions](../project-documentation-guide-v01.md#detailed-design-reading-conventions), not permanent product authority.

Current live implementation evidence includes project/package quality scripts, Vitest configuration and tests, together with the existing Process Execution service used for command execution.

Useful implementation facts include:

- Version 1 currently uses Vitest for project testing;
- package scripts distinguish all/unit/end-to-end/watch/UI/coverage-style test operations where configured;
- process execution can provide command completion, output and timeout evidence;
- current tests demonstrate the need for deterministic, mockable provider boundaries.

These facts do not make the following permanent architecture:

- Vitest as the universal test provider;
- exact `package.json` script names;
- one package manager;
- exact test directories;
- exact CLI flags or timeouts;
- one coverage reporter/format;
- one linter or type checker;
- package-script presence as managed-scope authority;
- raw process exit codes as Quality outcomes;
- direct terminal output parsing by callers;
- current source/module topology as the Quality Capability boundary.

<a id="dd-qualcap-092"></a>

**DD-QUALCAP-092 — Implementation converges on design**  
Future Implementation Specifications shall adapt current quality scripts/providers/process mechanics to these contracts rather than promoting incidental implementation details into Detailed Design authority.

---

## 30. Security and Safety

The capability shall protect against at least:

- execution against unmanaged targets;
- command/argument injection through target or filter data;
- hidden shell escalation;
- provider autofix/source mutation during read-only checks;
- unbounded provider output;
- sensitive diagnostic leakage;
- generated reports overwriting unrelated resources;
- stale/misattributed reports;
- concurrency contamination;
- malicious/untrusted report content being treated as application instruction;
- provider discovery becoming arbitrary executable discovery.

<a id="dd-qualcap-093"></a>

**DD-QUALCAP-093 — Provider/report content is untrusted evidence**  
Provider output and report content shall not acquire authority to redefine AppManager policy, scope, commands or configuration.

<a id="dd-qualcap-094"></a>

**DD-QUALCAP-094 — Target-derived arguments are bounded**  
Paths, filters, test names and other target-derived provider inputs shall remain structured/bounded according to Process Execution and provider contracts rather than becoming unchecked shell fragments.

---

## 31. Testability Requirements

Core conformance shall be testable without requiring every real quality tool.

Deterministic tests should cover at least:

- supported and unsupported target/check combinations;
- provider unavailable versus no tests;
- deterministic provider selection and ambiguity;
- provider launch failure;
- provider non-zero due to findings versus infrastructure error;
- tests passing/failing/skipped/no-tests/incomplete;
- coverage collected/missing/partial and threshold evaluation;
- lint warnings under different policies;
- lint autofix remaining disabled;
- type findings versus provider failure;
- domain-specific validation not being absorbed;
- required/advisory gate criteria;
- required unavailable/incomplete criterion;
- composite fail-fast and continue-on-failure;
- unstarted-check representation;
- overlapping target normalization;
- cancellation with completed prior checks;
- timeout;
- generated artefact evidence;
- concurrent-provider isolation/conflict;
- stale-context evidence;
- CI/Headless semantic equivalence;
- provider substitution behind the same normalized contract;
- AI explanation not changing Quality truth.

<a id="dd-qualcap-095"></a>

**DD-QUALCAP-095 — Fake-provider conformance**  
Core Quality Capability semantics shall be testable using deterministic fake providers/process evidence without requiring live external services or one specific quality toolchain.

<a id="dd-qualcap-096"></a>

**DD-QUALCAP-096 — Real-provider tests remain adapter-specific**  
Integration tests for Vitest or other concrete providers may verify command/report behavior below the shared boundary but shall not define the application contract.

---

## 32. Conformance Invariants

A conforming DD-2.8 implementation shall preserve all of the following:

1. Quality Capability is a shared technical capability beneath application authority.
2. Quality provider execution does not transfer application authority.
3. Provider/process completion is distinct from quality pass/fail.
4. Quality check status is distinct from quality-gate status.
5. Semantic check identity is independent of package-script/executable identity.
6. Capability recognition does not execute checks.
7. Recognition/discovery does not establish managed scope or authorization.
8. Availability is check- and target-relative.
9. No-tests is distinguishable from provider unavailable and tests passed where reliably knowable.
10. Capabilities consume governed effective configuration.
11. Provider ambiguity is not guessed where semantics differ materially.
12. Provider-native process/report models remain below normalized contracts.
13. Non-zero provider completion has provider/check-specific meaning.
14. Zero provider completion does not bypass findings or gate evaluation.
15. Quality results preserve per-check and per-target identity.
16. Unavailable, incomplete, indeterminate and cancelled do not silently become pass.
17. Coverage measurement and threshold satisfaction are distinct.
18. Missing coverage metrics are not invented.
19. Lint is non-mutating by default.
20. Provider autofix does not grant source-mutation authority.
21. Type findings are distinct from provider infrastructure failure.
22. Domain-specific validation retains its owning-domain semantics.
23. Source Transformation validation remains DD-2.5 when transformation validity is the primary concern.
24. Gate criteria and thresholds are explicit/effective policy, not provider inventions.
25. Required and advisory criteria remain distinct.
26. Composite ordering and fail-fast/continue behavior are governed inputs.
27. Composite results preserve component evidence.
28. Cancellation does not erase completed checks or imply pass for incomplete work.
29. Generated quality artefacts do not authorize unrelated mutation.
30. Concurrency/interference is handled deliberately where material.
31. Quality evidence is contextual to the state actually evaluated.
32. CI invocation does not transfer CI/CD ownership to Quality.
33. A passing gate does not itself authorize Git push or deployment.
34. AI explanation does not replace provider findings or gate policy.
35. Current Vitest/package-script/process implementation is evidence, not permanent architecture.
36. No universal provider/plugin framework is created from implementation naming similarity.

---

## 33. Traceability Summary

| Detailed Design concern | Primary authority |
|---|---|
| Quality authority/provider boundary | `FR-QUAL-001`–`005`; root Design delegated-authority rule |
| invocation/configuration/scope | `FR-QUAL-006`–`028`; DD-1.1, DD-1.3, DD-1.4, DD-1.5 |
| tests/test UI | `FR-QUAL-029`–`045`; DD-2.2 Process Execution |
| coverage | `FR-QUAL-046`–`053` |
| lint/type checking | `FR-QUAL-054`–`065`; DD-2.5 mutation boundary |
| general validation | `FR-QUAL-066`–`070`; DD-2.4/DD-2.5 ownership boundaries |
| quality gates | `FR-QUAL-071`–`080`; DD-1.2 outcomes |
| composite execution | `FR-QUAL-081`–`087`; DD-1.5 orchestration authority |
| CI/automation boundary | `FR-QUAL-088`–`093`; Git/App ownership boundaries |
| result semantics | `FR-QUAL-094`–`103`; DD-1.2 |
| failure/cancellation/concurrency | `FR-QUAL-104`–`110`; DD-1.2, DD-1.5, DD-2.2 |
| safety/non-destructive behavior | `FR-QUAL-111`–`116`; DD-1.3, DD-2.1, DD-2.5 |
| AI-assisted explanation | `FR-AI-076`, `FR-AI-078`; DD-2.7 |
| implementation replaceability | ADR-0001; root Design implementation-topology independence |

---

## 34. Contract Consumers and Implementation Dependencies {#_34-downstream-detailed-design-dependencies}

### 34.1 DD-2.9 Documentation Capability

Documentation Capability may consume Quality Capability for bounded documentation validation or higher-level quality evidence where Docs remains authoritative for documentation semantics. Quality shall not absorb documentation generation, documentation scope or documentation-specific acceptance.

### 34.2 DD-2.10 Nuxt Capability

Nuxt Capability may consume bounded Quality evidence, but Nuxt-specific validation/lifecycle semantics remain Nuxt-owned where Nuxt is the primary intent.

### 34.3 Domain Detailed Designs

The Quality-domain Detailed Design shall define Quality application use cases and orchestration using DD-2.8 rather than duplicating provider execution/result/gate contracts. App, Git, Docs, Nuxt and other domain designs may consume Quality evidence while retaining their own workflow authority.

### 34.4 Implementation Specification

Implementation planning shall determine concrete quality providers, package-manager integration, Vitest/alternative adapters, lint/type-check adapters, report parsers, coverage formats, generated-artifact paths, process options, concurrency controls, timeouts, event transport and migration from current scripts/services.

---

## 35. Deferred Implementation Decisions

This Detailed Design intentionally does not choose:

- a permanent test runner;
- a permanent coverage engine/report format;
- a permanent linter;
- a permanent type checker;
- exact package scripts or package manager;
- exact executable commands or flags;
- exact test directories or naming conventions;
- exact timeout values;
- exact output/report locations;
- exact cache strategy;
- exact process concurrency level;
- exact CI provider or workflow syntax;
- exact parser libraries;
- exact event/logging/telemetry implementation;
- exact class/package/module topology;
- a universal executable provider plugin framework.

These belong to Implementation Specification, effective configuration, provider adapters or a future ADR where a major architectural choice is intentionally introduced.

---

## 36. Final Design Position

The permanent Version 1 position is:

> **Quality Capability owns bounded quality-check recognition/execution, normalized findings and measurements, explicit criterion evaluation and quality-gate evidence; application scope, cross-domain workflow authority, source mutation and final higher-level acceptance remain outside the capability.**

The canonical model is:

```text
owning Quality use case / approved scope / effective policy
                    |
                    v
             Quality Capability
                    |
        recognize bounded check/provider
        execute through provider boundary
        normalize technical evidence
        interpret check findings/measurements
        evaluate explicit criteria/gate
                    |
                    v
        normalized Quality evidence
                    |
                    v
     Application Engine / owning workflow
```

The central non-drift rule is:

> **A tool may report what happened during a quality check; it does not decide what AppManager is allowed to do next.**
