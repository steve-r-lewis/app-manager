# DD-2.8 — AppManager Quality Capability Detailed Design

> **Detailed Design ID:** DD-2.8
>
> **Design family:** DD-2 — Shared Capabilities

> **Status:** Version 1 Detailed Design Specification
>
> **Detailed Design authority:** This document defines the permanent shared contracts for quality-capability recognition, bounded quality-check execution, normalized findings and measurements, quality-result aggregation, quality-gate evaluation, provider isolation, generated quality artefacts, cancellation and concurrency beneath AppManager application authority. It refines, but does not override, the root Design Specification, Functional Specifications, accepted ADRs, or the DD-1 Application Core Detailed Designs.
>
> **Sources and navigation:** [Project Documentation Guide](../project-documentation-guide-v01.md), [AppManager Design Specification](../appmanager-design-specification-v01.md), [Detailed Design Register](../project_management/detailed-design-register-v01.md), [ADR-0001 — Primary Application Runtime](../project_management/decisions/adr-0001-primary-application-runtime.md)
>
> **Related Detailed Design authorities:** [DD-1.1 — Application Invocation](../dd_1_application_core/dd-1-1-application-invocation-detailed-design-v01.md), [DD-1.2 — Execution Outcomes](../dd_1_application_core/dd-1-2-execution-outcomes-detailed-design-v01.md), [DD-1.3 — Managed Project](../dd_1_application_core/dd-1-3-managed-project-detailed-design-v01.md), [DD-1.4 — Configuration Resolution](../dd_1_application_core/dd-1-4-configuration-resolution-detailed-design-v01.md), [DD-1.5 — Application Engine](../dd_1_application_core/dd-1-5-application-engine-detailed-design-v01.md), [DD-2.1 — Resource Access](dd-2-1-resource-access-detailed-design-v01.md), [DD-2.2 — Process Execution](dd-2-2-process-execution-detailed-design-v01.md), [DD-2.3 — Repository Capability](dd-2-3-repository-capability-detailed-design-v01.md), [DD-2.4 — Source Intelligence](dd-2-4-source-intelligence-detailed-design-v01.md), [DD-2.5 — Source Transformation](dd-2-5-source-transformation-detailed-design-v01.md), [DD-2.6 — Resource Registry and Template](dd-2-6-resource-registry-and-template-detailed-design-v01.md), [DD-2.7 — AI Capability](dd-2-7-ai-capability-detailed-design-v01.md)
>
> **Primary Functional authority:** [docs/functional/quality-functional-specification-v01.md](../functional/quality-functional-specification-v01.md), together with owning-domain Functional Specifications where quality evidence is consumed by another workflow.

---

## 1. Purpose

Quality Capability recognizes and executes bounded checks, normalizes findings/measurements and evaluates supplied criteria. Its models distinguish technical execution, check status and gate evidence so a caller can interpret the requested quality intent. Requests apply the [non-mutating default](../functional/quality-functional-specification-v01.md#fr-qual-004).

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

Delegated Quality requests follows [Design](../appmanager-design-specification-v01.md#_6-6-capability-boundaries-and-providers).

<a id="dd-qualcap-002"></a>

**DD-QUALCAP-002 — Provider evidence is not application authority**

Provider exit/output/report/UI evidence uses [DD-1.2](../dd_1_application_core/dd-1-2-execution-outcomes-detailed-design-v01.md#_18-provider-result-normalization).


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

Quality Capability consumption by other workflows follows [Design](../appmanager-design-specification-v01.md#_6-6-capability-boundaries-and-providers).

<a id="dd-qualcap-004"></a>

**DD-QUALCAP-004 — No upward workflow authority**

Suggested build/Git/deploy/mutation follow-ons follows [Design](../appmanager-design-specification-v01.md#_6-2-application-engine-authority).


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

Registration of an additional technical check class consumes the [Quality semantic-ownership decision](../dd_4_policy_and_resource_domains/dd-4-1-quality-domain-detailed-design-v01.md#dd-qual-078).


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

Discovered quality scripts, tools and test directories follows [Design](../appmanager-design-specification-v01.md#_9-6-project-discovery-and-context-resolution).

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

Quality provider policy consumes [DD-1.4 effective values](../dd_1_application_core/dd-1-4-configuration-resolution-detailed-design-v01.md#_15-resolution-result) and resolved caller constraints.

<a id="dd-qualcap-013"></a>

**DD-QUALCAP-013 — Provider eligibility is semantic**  
A provider is eligible only if it can satisfy the requested quality-check contract for the selected target.

<a id="dd-qualcap-014"></a>

**DD-QUALCAP-014 — Ambiguity is explicit**  
Where multiple materially different providers remain eligible and governing policy cannot choose deterministically, the capability shall return ambiguity rather than guess.

<a id="dd-qualcap-015"></a>

**DD-QUALCAP-015 — Provider details remain below the shared contract**

Executable names, package-manager syntax, command flags, SDK objects and report schemas apply the [Design provider encapsulation contract](../appmanager-design-specification-v01.md#_6-6-capability-boundaries-and-providers) at the Quality seam.


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

Complete non-interactive requests use [FR-INV-020](../functional/application-invocation-functional-specification-v01.md#fr-inv-020); capability selection ambiguity is returned to the caller.

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

Provider non-zero completion, including findings versus infrastructure failure follows [DD-QUALCAP-019](#dd-qualcap-019).

<a id="dd-qualcap-021"></a>

**DD-QUALCAP-021 — Zero is not sufficient for gate success**

Provider completion before supplied criteria evaluation follows [DD-QUALCAP-050](#dd-qualcap-050).

<a id="dd-qualcap-022"></a>

**DD-QUALCAP-022 — Shell semantics remain explicit**

Provider launch applies [DD-2.2 direct/shell boundaries](dd-2-2-process-execution-detailed-design-v01.md#_8-direct-execution-and-shell-boundary).


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

Non-pass check states bind [FR-QUAL-097](../functional/quality-functional-specification-v01.md#fr-qual-097), [FR-QUAL-098](../functional/quality-functional-specification-v01.md#fr-qual-098), [FR-QUAL-099](../functional/quality-functional-specification-v01.md#fr-qual-099) and [FR-QUAL-038](../functional/quality-functional-specification-v01.md#fr-qual-038) to the normalized result model.

<a id="dd-qualcap-025"></a>

**DD-QUALCAP-025 — Provider-native output is supplemental**

Bounded supplemental provider output uses [FR-QUAL-102](../functional/quality-functional-specification-v01.md#fr-qual-102); machine interpretation uses [FR-INV-021](../functional/application-invocation-functional-specification-v01.md#fr-inv-021).


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

Quality evidence copied to diagnostics uses [DD-1.2](../dd_1_application_core/dd-1-2-execution-outcomes-detailed-design-v01.md#_24-sensitive-information-and-redaction).


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

Assertion-failure evidence applies [FR-QUAL-036](../functional/quality-functional-specification-v01.md#fr-qual-036) and [FR-QUAL-037](../functional/quality-functional-specification-v01.md#fr-qual-037) at the test-provider normalizer.

<a id="dd-qualcap-030"></a>

**DD-QUALCAP-030 — No-tests state is explicit**

Reliable no-tests evidence applies [FR-QUAL-035](../functional/quality-functional-specification-v01.md#fr-qual-035). Any higher-level policy interpreting that evidence as acceptable remains explicit.

<a id="dd-qualcap-031"></a>

**DD-QUALCAP-031 — Incomplete tests cannot pass completely**

Interrupted test normalization applies [FR-QUAL-038](../functional/quality-functional-specification-v01.md#fr-qual-038) even when earlier tests passed.

<a id="dd-qualcap-032"></a>

**DD-QUALCAP-032 — Category fidelity**

Provider normalization carries the requested category identity from [FR-QUAL-032](../functional/quality-functional-specification-v01.md#fr-qual-032) and [FR-QUAL-040](../functional/quality-functional-specification-v01.md#fr-qual-040).


---

## 13. Test UI Semantics

Test UI is a provider capability, not a test outcome.

<a id="dd-qualcap-033"></a>

**DD-QUALCAP-033 — UI launch is execution evidence**

Test UI launch evidence applies [FR-QUAL-043](../functional/quality-functional-specification-v01.md#fr-qual-043) before gate interpretation.

<a id="dd-qualcap-034"></a>

**DD-QUALCAP-034 — UI capability is optional**  
A provider may support non-interactive testing without supporting an interactive UI.

<a id="dd-qualcap-035"></a>

**DD-QUALCAP-035 — Long-running UI state is represented**

An active UI exposes running/stopped/cancelled state under [FR-QUAL-044](../functional/quality-functional-specification-v01.md#fr-qual-044) and [FR-QUAL-043](../functional/quality-functional-specification-v01.md#fr-qual-043).


---

## 14. Coverage Semantics

Coverage collection and coverage-policy evaluation are separate stages.

A normalized measurement may represent statement, branch, function, line or other explicitly supported metrics together with scope/completeness evidence.

<a id="dd-qualcap-036"></a>

**DD-QUALCAP-036 — Measurement success is not threshold success**

Coverage collection supplies measurements for [FR-QUAL-050](../functional/quality-functional-specification-v01.md#fr-qual-050) rather than a threshold decision.

<a id="dd-qualcap-037"></a>

**DD-QUALCAP-037 — Metric semantics remain explicit**  
Different provider metrics shall not be combined or compared as if equivalent unless their normalized semantics are compatible.

<a id="dd-qualcap-038"></a>

**DD-QUALCAP-038 — Missing measurement remains unknown**  
A metric absent from provider evidence shall not be invented as zero, 100%, or another value.

<a id="dd-qualcap-039"></a>

**DD-QUALCAP-039 — Coverage scope is retained**

Coverage evidence identifies its evaluated target/scope to implement [FR-QUAL-053](../functional/quality-functional-specification-v01.md#fr-qual-053).


---

## 15. Lint Semantics

<a id="dd-qualcap-040"></a>

**DD-QUALCAP-040 — Lint is non-mutating by default**

Ordinary lint applies [FR-QUAL-004](../functional/quality-functional-specification-v01.md#fr-qual-004).

<a id="dd-qualcap-041"></a>

**DD-QUALCAP-041 — Provider lint findings are normalized**  
Where provider structure permits, lint rule identity, severity, resource/location and message shall be normalized without requiring callers to parse terminal text.

<a id="dd-qualcap-042"></a>

**DD-QUALCAP-042 — Warning interpretation remains policy**

Lint warning significance follows [DD-QUALCAP-026](#dd-qualcap-026).

<a id="dd-qualcap-043"></a>

**DD-QUALCAP-043 — Autofix is outside ordinary Quality execution**

Autofix is a separate authorized source-change path under [Design](../appmanager-design-specification-v01.md#_7-code-intelligence-and-transformation-architecture); ordinary lint retains DD-QUALCAP-040.


---

## 16. Type-Check Semantics

<a id="dd-qualcap-044"></a>

**DD-QUALCAP-044 — Type diagnostics are findings**

Completed type-check diagnostics apply [FR-QUAL-063](../functional/quality-functional-specification-v01.md#fr-qual-063) through the normalized finding model.

<a id="dd-qualcap-045"></a>

**DD-QUALCAP-045 — Type findings differ from provider failure**

Type-provider infrastructure versus type-error evidence applies [FR-QUAL-064](../functional/quality-functional-specification-v01.md#fr-qual-064).

<a id="dd-qualcap-046"></a>

**DD-QUALCAP-046 — Type-check scope fidelity**

Type-provider project/include mechanics follows [DD-QUALCAP-016](#dd-qualcap-016).


---

## 17. General Validation Boundary

<a id="dd-qualcap-047"></a>

**DD-QUALCAP-047 — Generic validation is residual, not absorbing**

Additional Quality validation binds [FR-QUAL-066](../functional/quality-functional-specification-v01.md#fr-qual-066) and [FR-QUAL-067](../functional/quality-functional-specification-v01.md#fr-qual-067) to the supported check classes.

<a id="dd-qualcap-048"></a>

**DD-QUALCAP-048 — Domain validation retains ownership**

Similarly implemented Nuxt/Docs/transformation validation follows [Design](../appmanager-design-specification-v01.md#_6-6-capability-boundaries-and-providers).

<a id="dd-qualcap-049"></a>

**DD-QUALCAP-049 — Post-transformation validation remains DD-2.5**

Transformation validation uses [FR-XFORM-048](../functional/source-transformation-functional-specification-v01.md#fr-xform-048); using the same tool for an independent Quality check does not change that owner.


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

Supplied/effective gate evaluation follows [FR-QUAL-072](../functional/quality-functional-specification-v01.md#fr-qual-072) and [FR-QUAL-051](../functional/quality-functional-specification-v01.md#fr-qual-051).

<a id="dd-qualcap-051"></a>

**DD-QUALCAP-051 — Required and advisory remain distinct**

Advisory failure/unavailability follows [FR-QUAL-079](../functional/quality-functional-specification-v01.md#fr-qual-079).

<a id="dd-qualcap-052"></a>

**DD-QUALCAP-052 — Required unavailable cannot pass**

Required-criterion interpretation follows [FR-QUAL-075](../functional/quality-functional-specification-v01.md#fr-qual-075), [FR-QUAL-077](../functional/quality-functional-specification-v01.md#fr-qual-077) and [FR-QUAL-078](../functional/quality-functional-specification-v01.md#fr-qual-078). An explicit governing policy can define a different acceptable state; provider availability alone cannot define that exception.

<a id="dd-qualcap-053"></a>

**DD-QUALCAP-053 — Gate provenance is retained**

Criterion identity and normalized decision evidence implement [FR-QUAL-080](../functional/quality-functional-specification-v01.md#fr-qual-080).

<a id="dd-qualcap-054"></a>

**DD-QUALCAP-054 — Gate evaluation is deterministic**  
Equivalent normalized check evidence and equivalent effective gate policy shall yield materially equivalent gate evaluation.

---

## 19. Composite Quality Execution

A composite quality run coordinates multiple bounded checks but does not become a general workflow engine.

<a id="dd-qualcap-055"></a>

**DD-QUALCAP-055 — Composite plan is explicit**

The supplied composite check/target plan binds [FR-QUAL-082](../functional/quality-functional-specification-v01.md#fr-qual-082).

<a id="dd-qualcap-056"></a>

**DD-QUALCAP-056 — Ordering is governed**

The plan records the significant execution order required by [FR-QUAL-083](../functional/quality-functional-specification-v01.md#fr-qual-083).

<a id="dd-qualcap-057"></a>

**DD-QUALCAP-057 — Fail-fast is policy**

The plan records fail-fast/continuation policy under [FR-QUAL-084](../functional/quality-functional-specification-v01.md#fr-qual-084).

<a id="dd-qualcap-058"></a>

**DD-QUALCAP-058 — Unstarted checks remain visible**  
When fail-fast, cancellation or failure prevents later checks from running, they shall remain distinguishable as not attempted/skipped according to the governing reason rather than silently disappearing.

<a id="dd-qualcap-059"></a>

**DD-QUALCAP-059 — Aggregation preserves components**

Per-target/per-check identity in composite evidence follows [DD-QUALCAP-027](#dd-qualcap-027).


---

## 20. Multi-Target Semantics

<a id="dd-qualcap-060"></a>

**DD-QUALCAP-060 — Targets remain individually attributable**

Root/layer/unit identity in multi-target evidence follows [DD-QUALCAP-027](#dd-qualcap-027).

<a id="dd-qualcap-061"></a>

**DD-QUALCAP-061 — Overlap is normalized**  
Overlapping target selections shall not accidentally execute the same logical target more than once unless explicitly requested.

<a id="dd-qualcap-062"></a>

**DD-QUALCAP-062 — Unsupported target is not passing**

Unsupported managed targets versus passing checks follows [DD-QUALCAP-024](#dd-qualcap-024).

<a id="dd-qualcap-063"></a>

**DD-QUALCAP-063 — Mixed targets produce mixed evidence**

Mixed managed-target outcomes uses [DD-1.2](../dd_1_application_core/dd-1-2-execution-outcomes-detailed-design-v01.md#_14-partial-completion).


---

## 21. Progress, Cancellation and Timeout

<a id="dd-qualcap-064"></a>

**DD-QUALCAP-064 — Progress is semantic**  
Progress/events should identify check/target lifecycle where useful without making terminal rendering or one event transport normative.

<a id="dd-qualcap-065"></a>

**DD-QUALCAP-065 — Cancellation propagates**

Stop future checks and propagate supported active-provider cancellation under [DD-1.2](../dd_1_application_core/dd-1-2-execution-outcomes-detailed-design-v01.md#_17-cancellation-model).

<a id="dd-qualcap-066"></a>

**DD-QUALCAP-066 — Completed checks remain completed**

Previously established quality evidence after cancellation uses [DD-1.2](../dd_1_application_core/dd-1-2-execution-outcomes-detailed-design-v01.md#_17-cancellation-model).

<a id="dd-qualcap-067"></a>

**DD-QUALCAP-067 — Cancellation is not pass**

Cancelled required checks without observed failure follows [DD-QUALCAP-024](#dd-qualcap-024).

<a id="dd-qualcap-068"></a>

**DD-QUALCAP-068 — Timeout is governed**

Quality timeout parameters apply [FR-QUAL-106](../functional/quality-functional-specification-v01.md#fr-qual-106), with documented provider constraints retained as technical inputs.


---

## 22. Generated Quality Artefacts

Quality providers may generate coverage reports, test reports, snapshots, caches, temporary files or other artefacts even when source mutation is prohibited.

<a id="dd-qualcap-069"></a>

**DD-QUALCAP-069 — Artefact effects are explicit**

Known material report/cache artefacts uses [DD-1.2](../dd_1_application_core/dd-1-2-execution-outcomes-detailed-design-v01.md#_12-consequential-effects).

<a id="dd-qualcap-070"></a>

**DD-QUALCAP-070 — Artefact permission is bounded**  
Permission to generate an approved quality report/cache does not authorize modification of unrelated source, configuration or repository state.

<a id="dd-qualcap-071"></a>

**DD-QUALCAP-071 — Generated artefact is not source autofix**  
A recognized quality report or cache shall remain semantically distinct from provider modification of source under test.

<a id="dd-qualcap-072"></a>

**DD-QUALCAP-072 — Cleanup is truthful**

Claims that generated artefacts were cleaned up uses [DD-1.2](../dd_1_application_core/dd-1-2-execution-outcomes-detailed-design-v01.md#_12-consequential-effects).


---

## 23. Concurrency and Isolation

Quality providers may contend for ports, caches, report paths, snapshots, browsers or other shared state.

<a id="dd-qualcap-073"></a>

**DD-QUALCAP-073 — Concurrency conflicts are deliberate**  
Where concurrent quality requests can interfere materially, the capability shall serialize, isolate or reject according to explicit provider/capability policy rather than silently cross-contaminate results.

<a id="dd-qualcap-074"></a>

**DD-QUALCAP-074 — Result attribution survives concurrency**

Concurrent request attribution applies [FR-QUAL-109](../functional/quality-functional-specification-v01.md#fr-qual-109) to provider output, reports and generated artefacts.

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

CI callers apply [Design](../appmanager-design-specification-v01.md#_4-6-presentation-independence); this capability does not own complete CI/CD workflows.

<a id="dd-qualcap-080"></a>

**DD-QUALCAP-080 — Quality evidence may gate other workflows**

Git, deployment and other enclosing workflows consume Quality evidence through [FR-QUAL-091](../functional/quality-functional-specification-v01.md#fr-qual-091) and [Design §11.11](../appmanager-design-specification-v01.md#_11-11-workflow-results-failure-and-acceptance).

<a id="dd-qualcap-081"></a>

**DD-QUALCAP-081 — Quality does not push or deploy**

Push/deployment follow-ons after a gate apply [Design](../appmanager-design-specification-v01.md#_6-2-application-engine-authority).

<a id="dd-qualcap-082"></a>

**DD-QUALCAP-082 — Adapter equivalence**

Equivalent Quality intent across TUI, Headless, CI and IDE callers follows [Design](../appmanager-design-specification-v01.md#_4-6-presentation-independence).


---

## 26. Relationship to AI Capability

AI may explain or summarize quality findings but does not determine the underlying quality truth.

<a id="dd-qualcap-083"></a>

**DD-QUALCAP-083 — AI explanation is supplementary**  
DD-2.7 output may provide explanation, triage or proposed remediation, but it shall not replace normalized provider findings or gate policy as the source of a Quality result.

<a id="dd-qualcap-084"></a>

**DD-QUALCAP-084 — AI cannot silently mutate remediation**

AI remediation proposals follows [Design](../appmanager-design-specification-v01.md#_11-10-ai-assisted-workflow).


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

Quality-provider result translation uses [DD-1.2](../dd_1_application_core/dd-1-2-execution-outcomes-detailed-design-v01.md#_18-provider-result-normalization).

<a id="dd-qualcap-086"></a>

**DD-QUALCAP-086 — Provider limitations are explicit**  
A provider unable to satisfy a requested category, scope, report or UI contract shall return unsupported/unavailable evidence rather than silently substitute materially different semantics.

<a id="dd-qualcap-087"></a>

**DD-QUALCAP-087 — Provider replaceability**

Toolchain-native data in consumer contracts follows [DD-QUALCAP-015](#dd-qualcap-015).

<a id="dd-qualcap-088"></a>

**DD-QUALCAP-088 — No universal provider framework**

Quality provider patterns apply [DD-ENG-046](../dd_1_application_core/dd-1-5-application-engine-detailed-design-v01.md#dd-eng-046) and the [Design extension classes](../appmanager-design-specification-v01.md#_13-2-extension-classes). Concrete base classes and cross-runtime protocols remain [implementation choices](../project-documentation-guide-v01.md#_8-level-4-implementation-specification).


---

## 28. Relationship to DD-1 Outcomes

Quality Capability supplies normalized check/gate evidence to the owning use case/Application Engine.

<a id="dd-qualcap-089"></a>

**DD-QUALCAP-089 — Check pass is not automatically invocation success**

Passing bounded checks in larger workflows follows [Design](../appmanager-design-specification-v01.md#_11-11-workflow-results-failure-and-acceptance).

<a id="dd-qualcap-090"></a>

**DD-QUALCAP-090 — Gate result is application-relevant evidence**

Gate results consumed by a larger workflow follows [DD-QUALCAP-080](#dd-qualcap-080).

<a id="dd-qualcap-091"></a>

**DD-QUALCAP-091 — Partial/mixed evidence is preserved**

Mixed target/check states uses [DD-1.2](../dd_1_application_core/dd-1-2-execution-outcomes-detailed-design-v01.md#_14-partial-completion).


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

Adapt concrete quality scripts/providers under the [Documentation Guide implementation boundary](../project-documentation-guide-v01.md#_8-level-4-implementation-specification).


---

## 30. Security and Safety

The local exposure points below locate the target, provider, output, mutation and stale-state contracts in this design. They apply [Design safety boundaries](../appmanager-design-specification-v01.md#_9-9-non-destructive-ownership-and-unmanaged-content) and the [local safety clauses](#dd-qualcap-093); this threat-model index does not establish a second set of guarantees:

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

Provider output and report content are untrusted evidence: they shall not redefine AppManager policy, scope, commands or configuration.

<a id="dd-qualcap-094"></a>

**DD-QUALCAP-094 — Target-derived arguments are bounded**

Target-derived paths, filters and test names use [DD-2.2 argument structure](dd-2-2-process-execution-detailed-design-v01.md#dd-proc-014) and the provider request contract.


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

Review check identity/recognition (§§5–6), execution/results (§§7–11), test/UI/coverage/lint/type/validation semantics (§§12–17), supplied criteria/composition (§§18–20), and effect/freshness/provider obligations. The testability section verifies these distinctions with controlled evidence.

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

[Documentation Capability](dd-2-9-documentation-capability-detailed-design-v01.md) can consume bounded Quality checks as evidence for its documentation-oriented validation; the two validation models meet at that evidence boundary.

### 34.2 DD-2.10 Nuxt Capability

Nuxt Capability may consume bounded Quality evidence, but Nuxt-specific validation/lifecycle semantics remain Nuxt-owned where Nuxt is the primary intent.

### 34.3 Domain Detailed Designs

The [Quality domain](../dd_4_policy_and_resource_domains/dd-4-1-quality-domain-detailed-design-v01.md) supplies operation policy and composes checks/gates using the contracts here. Other domain consumers interpret Quality evidence in their enclosing workflows under [Design §10.11](../appmanager-design-specification-v01.md#_10-11-cross-domain-workflows).

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

The [architectural position](#_4-architectural-position) provides the collaboration map. The local models and workflows above, together with their direct upstream bindings, define the Version 1 contract; the conformance and testability sections provide the review route.
