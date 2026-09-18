# DD-2.5 — AppManager Source Transformation Detailed Design

> **Detailed Design ID:** DD-2.5
>
> **Design family:** DD-2 — Shared Capabilities

> **Status:** Version 1 Detailed Design Specification
>
> **Detailed Design authority:** This document defines the permanent shared contracts for bounded source-transformation planning, execution, source-level validation and transformation evidence beneath AppManager application authority. It refines, but does not override, the root Design Specification, Functional Specifications, accepted ADRs, or DD-1 Application Core Detailed Designs.
>
> **Sources and navigation:** [Project Documentation Guide](../project-documentation-guide-v01.md), [AppManager Design Specification](../appmanager-design-specification-v01.md), [Detailed Design Register](../project_management/detailed-design-register-v01.md), [ADR-0001 — Primary Application Runtime](../project_management/decisions/adr-0001-primary-application-runtime.md)
>
> **Related Detailed Design authorities:** [DD-1.1 — Application Invocation](../dd_1_application_core/dd-1-1-application-invocation-detailed-design-v01.md), [DD-1.2 — Execution Outcomes](../dd_1_application_core/dd-1-2-execution-outcomes-detailed-design-v01.md), [DD-1.3 — Managed Project](../dd_1_application_core/dd-1-3-managed-project-detailed-design-v01.md), [DD-1.4 — Configuration Resolution](../dd_1_application_core/dd-1-4-configuration-resolution-detailed-design-v01.md), [DD-1.5 — Application Engine](../dd_1_application_core/dd-1-5-application-engine-detailed-design-v01.md), [DD-2.1 — Resource Access](dd-2-1-resource-access-detailed-design-v01.md), [DD-2.2 — Process Execution](dd-2-2-process-execution-detailed-design-v01.md), [DD-2.3 — Repository Capability](dd-2-3-repository-capability-detailed-design-v01.md), [DD-2.4 — Source Intelligence](dd-2-4-source-intelligence-detailed-design-v01.md)
>
> **Primary Functional authority:** [docs/functional/source-transformation-functional-specification-v01.md](../functional/source-transformation-functional-specification-v01.md)
>
> **Related domain Functional authorities:** App, Docs, Nuxt, Quality, AI, Settings and Maintenance where those domains request source changes or validate source-level consequences.

---

## 1. Purpose

Source Transformation connects source-aware intent to bounded edit planning, application and validation. The plan, edit, precondition and preservation models make the intended source change reviewable; execution records actual effects before evaluating source validity. Application interpretation then uses [Design §11.11](../appmanager-design-specification-v01.md#_11-11-workflow-results-failure-and-acceptance).

## 2. Scope

This design owns permanent internal contracts for:

- transformation intent inputs supplied by an owning use case;
- transformation strategy selection;
- bounded transformation planning;
- plan identity and revision binding;
- target/resource references;
- planned source edits and planned effects;
- source preconditions and expected postconditions;
- preservation constraints;
- source ownership/region constraints supplied by upstream authority;
- preview and dry-run data;
- plan reviewability;
- plan approval state as an input to execution;
- stale-source detection;
- source mutation execution;
- single-target and multi-target execution semantics;
- atomicity and partial-application evidence;
- cancellation during planning/execution;
- source-level validation;
- validation evidence and diagnostics;
- recovery/indeterminate-state evidence;
- provider normalization;
- transformation capability discovery;
- provider replaceability and testability.

This design does not prescribe one edit library, AST/CST library, text-diff format, temporary-file mechanism, backup strategy, transaction implementation, parser library, class hierarchy, package topology or TypeScript interface.

---

## 3. Explicit Non-Ownership

Source Transformation shall not own:

- canonical AppManager command/use-case identity;
- managed-project identity;
- managed-scope derivation;
- application-level authorization or confirmation policy;
- effective-configuration precedence;
- source-recognition semantics owned by Source Intelligence;
- domain-specific intent such as Nuxt-layer creation or documentation policy;
- repository workflow semantics;
- AI prompt construction/provider acceptance;
- quality-gate policy;
- final AppManager success, failure, partial-success or cancellation acceptance;
- automatic retry/fallback unless explicitly delegated;
- universal rollback guarantees;
- universal formatting policy;
- generation of brand-new artefacts where the operation is properly classified as generation rather than mutation.

Source Transformation may reject an invalid, stale, unsupported or technically unsafe plan within its own contract. Such rejection remains subordinate to application-level interpretation.

---

## 4. Architectural Position

The permanent dependency direction is:

```text
Application Engine / owning use case
        |
        +--> command/use-case intent
        +--> Managed Project / managed scope
        +--> effective configuration
        +--> policy / safety / authorization
        +--> transformation-specific requirements
        |
        v
Source Intelligence facts + source revision evidence
        |
        v
+--------------------------------------------+
| Source Transformation capability           |
|                                            |
| select eligible strategy/provider          |
| derive bounded transformation plan         |
| expose preview / dry-run representation    |
| verify source freshness / preconditions    |
| apply approved bounded edits               |
| validate transformed source                |
| normalize applied effects / diagnostics    |
+----------------------+---------------------+
                       |
           +-----------+------------+
           |                        |
           v                        v
   Resource Access             specialist tools
   bounded mutation            where explicitly used
           |                        |
           +-----------+------------+
                       |
                       v
              transformation evidence
                       |
                       v
Application Engine / owning use case
       application-level acceptance
```

### 4.1 Relationship to Source Intelligence

Source Intelligence owns read-only recognition and structural facts. Source Transformation consumes those facts and may request fresh recognition before or after mutation.

<a id="dd-xform-001"></a>

**DD-XFORM-001 — Recognition is not planning authority**

Recognized targets bound to intent/scope applies [Design](../appmanager-design-specification-v01.md#_7-5-strategies-and-transformation-plans).

### 4.2 Relationship to Resource Access

Resource Access owns bounded resource mechanics such as snapshots, preconditioned replacement and atomic write guarantees where supported.

<a id="dd-xform-002"></a>

**DD-XFORM-002 — Transformation semantics remain above write mechanics**

Resource writes versus semantic source changes applies [Design](../appmanager-design-specification-v01.md#_7-code-intelligence-and-transformation-architecture).

### 4.3 Relationship to Application Engine

The [Engine delegation contract](../dd_1_application_core/dd-1-5-application-engine-detailed-design-v01.md#dd-eng-035) supplies intent and constraints for the transformation plan. The local planning, execution and source-validation contracts feed [application interpretation](../dd_1_application_core/dd-1-2-execution-outcomes-detailed-design-v01.md#_19-application-level-interpretation).

## 5. Responsibility Model

Source Transformation is decomposed into logical responsibilities:

1. **Transformation Request Contract** — receives bounded intent and constraints from the owning use case.
2. **Strategy Resolver** — selects an eligible transformation strategy/provider.
3. **Plan Builder** — derives an immutable bounded transformation plan.
4. **Plan Validator** — checks internal coherence, scope references and preconditions.
5. **Preview Renderer/Data Producer** — exposes plan effects without mutation.
6. **Freshness Coordinator** — verifies source revision/preconditions before execution.
7. **Execution Coordinator** — applies approved edits in governed order.
8. **Effect Recorder** — records known mutations and their status.
9. **Source Validator** — establishes post-edit source-level correctness.
10. **Transformation Evidence Normalizer** — converts provider/resource outcomes into DD-1.2-compatible evidence.
11. **Recovery Evidence Coordinator** — records partial/indeterminate state and actionable recovery information.

These are logical responsibilities, not mandatory classes or processes.

---

## 6. Transformation Request Contract

A bounded transformation request shall be capable of carrying, where relevant:

- transformation intent identity supplied by the owning use case;
- one or more source targets;
- managed-scope references;
- source-intelligence facts;
- source revision/snapshot evidence;
- desired structural effect;
- explicit preservation constraints;
- ownership/generated-region constraints;
- required source-level postconditions;
- effective configuration relevant to transformation mechanics;
- caller-provided content/proposals where applicable;
- approval/confirmation state where execution is requested;
- preview/dry-run intent;
- cancellation context;
- correlation/invocation identity.

<a id="dd-xform-003"></a>

**DD-XFORM-003 — Intent originates upstream**

Transformation-request intent applies [Design](../appmanager-design-specification-v01.md#_6-2-application-engine-authority).

<a id="dd-xform-004"></a>

**DD-XFORM-004 — Request scope is bounded**  
The request shall identify source targets and effect constraints sufficiently to prevent an implementation from treating an entire project as implicitly mutable.

<a id="dd-xform-005"></a>

**DD-XFORM-005 — No authority by content proposal**

Supplied content, patches and AI edits applies [Design](../appmanager-design-specification-v01.md#_7-5-strategies-and-transformation-plans).


---

## 7. Transformation Intent

Transformation intent represents the semantic change requested by an authoritative caller.

Examples may include:

- add or update a bounded metadata field;
- inject documentation for a specific declaration;
- update a recognized configuration property;
- insert or alter a bounded Nuxt configuration structure;
- update a generated region;
- remove a specifically authorized structural element.

<a id="dd-xform-006"></a>

**DD-XFORM-006 — Intent and mechanism are distinct**  
Intent shall not be expressed solely as “run this regex”, “write this whole file”, “apply this AST mutation” or another provider-native mechanism where AppManager needs stronger semantic meaning.

<a id="dd-xform-007"></a>

**DD-XFORM-007 — Intent does not broaden itself**

Related-source discovery applies [FR-PROJ-042](../functional/managed-project-functional-specification-v01.md#fr-proj-042) to transformation scope.


---

## 8. Strategy Resolution

A Transformation Strategy is a provider-neutral logical capability able to convert bounded intent plus source facts into a transformation plan and, where applicable, provider-specific execution input.

Strategy selection may consider:

- source kind/language;
- requested transformation kind;
- structural fact availability;
- preservation requirements;
- configured provider availability;
- required validation semantics;
- composite-source constraints.

<a id="dd-xform-008"></a>

**DD-XFORM-008 — Strategy capability is intent-specific**  
A provider capable of one transformation kind for a source format shall not be assumed capable of all transformations for that format.

<a id="dd-xform-009"></a>

**DD-XFORM-009 — Provider order is not hidden policy**  
Incidental registry order shall not silently decide between materially different transformation strategies where their preservation or semantic guarantees differ.

<a id="dd-xform-010"></a>

**DD-XFORM-010 — Weak fallback is explicit**  
Falling back from a structure-aware strategy to a weaker textual heuristic shall only occur when the requested guarantees remain satisfied or when the weaker certainty is explicitly surfaced for upstream policy.

---

## 9. Transformation Plan Contract

### 9.1 Purpose

The transformation plan is the canonical bounded description of what Source Transformation proposes to change before consequential mutation begins.

A plan shall be immutable or treated as immutable once approved.

### 9.2 Plan identity

A plan should carry a stable plan identity/correlation value where required for approval, preview and execution linkage.

<a id="dd-xform-011"></a>

**DD-XFORM-011 — Approved plan identity**  
Execution shall be traceable to the plan that was approved. Material modification after approval requires revalidation and, where required by policy, renewed approval.

### 9.3 Logical plan contents

A conforming plan shall be capable of representing, where relevant:

- transformation intent identity;
- target resources;
- target structural regions;
- source revision/snapshot evidence;
- ordered planned edits/effects;
- edit dependencies/order constraints;
- preconditions;
- preservation constraints;
- expected structural postconditions;
- expected resource effects;
- validation requirements;
- atomicity expectations;
- partial-application policy supplied by the owner;
- preview data;
- diagnostics/uncertainties;
- provider capability assumptions.

<a id="dd-xform-012"></a>

**DD-XFORM-012 — Plan is not mutation**

Non-mutating plan construction follows [FR-XFORM-017](../functional/source-transformation-functional-specification-v01.md#fr-xform-017).

<a id="dd-xform-013"></a>

**DD-XFORM-013 — Plan cannot exceed upstream scope**

Each plan target applies [FR-PROJ-044](../functional/managed-project-functional-specification-v01.md#fr-proj-044) within supplied effect bounds.


---

## 10. Planned Edit Model

A planned edit is a bounded proposed source effect. It is not required to be a raw byte/character patch at the shared contract level.

A planned edit may describe:

- target resource;
- structural target identity;
- edit kind;
- intended semantic effect;
- expected source range or provider locator;
- source precondition;
- replacement/insertion/removal data;
- preservation constraints;
- sequencing dependencies;
- expected resulting fact/postcondition.

<a id="dd-xform-014"></a>

**DD-XFORM-014 — Semantic edit above provider patch**  
Provider-native patches, text edits, AST mutations or CST edits may implement a planned edit but shall not become the only shared representation when AppManager requires semantic traceability.

<a id="dd-xform-015"></a>

**DD-XFORM-015 — Edit target must be reconcilable**  
Each consequential edit shall identify its target sufficiently to detect when the source no longer matches the assumptions under which the edit was planned.

---

## 11. Preconditions

Transformation preconditions may include:

- exact or equivalent source revision;
- target region exists;
- target region has expected structure/value;
- conflicting element absent;
- source kind unchanged;
- managed ownership classification unchanged;
- relevant provider capability still available.

<a id="dd-xform-016"></a>

**DD-XFORM-016 — Preconditions are explicit evidence**  
Where correctness depends on a source assumption, that assumption shall be represented as a plan precondition or equivalent stale-state guard rather than remain an invisible provider assumption.

<a id="dd-xform-017"></a>

**DD-XFORM-017 — Preconditions do not replace application policy**

Technical preconditions versus application approval applies [Design](../appmanager-design-specification-v01.md#_6-2-application-engine-authority).


---

## 12. Preservation Constraints

Preservation constraints express what must remain unaffected by a transformation.

They may include:

- preserve unrelated user content;
- preserve comments/trivia where practical;
- preserve ordering where not semantically required to change;
- preserve shebangs or required leading directives;
- preserve formatting outside changed regions;
- preserve unrelated configuration keys;
- preserve non-target embedded regions;
- preserve encoding/line-ending characteristics where required;
- preserve repository-unrelated data.

<a id="dd-xform-018"></a>

**DD-XFORM-018 — Preservation is part of correctness**

Unrelated cleanup or rewriting during a bounded change follows [FR-XFORM-014](../functional/source-transformation-functional-specification-v01.md#fr-xform-014).

<a id="dd-xform-019"></a>

**DD-XFORM-019 — Whole-file rewrite requires justification**

Whole-file rewriting under explicit preservation guarantees applies [Design](../appmanager-design-specification-v01.md#_7-10-non-destructive-transformation).


---

## 13. Generation Versus Mutation

Generation and mutation are distinct paths.

<a id="dd-xform-020"></a>

**DD-XFORM-020 — Existing resource changes use mutation semantics**

Existing authored targets encountered by generation applies [Design](../appmanager-design-specification-v01.md#_6-8-generation-and-templates).

<a id="dd-xform-021"></a>

**DD-XFORM-021 — Generated region remains bounded**

Edits within a generated region follows [FR-XFORM-047](../functional/source-transformation-functional-specification-v01.md#fr-xform-047).

<a id="dd-xform-022"></a>

**DD-XFORM-022 — Create-if-absent is explicit**  
A transformation request that may create a missing resource shall distinguish creation from modification so Resource Access and outcome reporting can preserve the actual effect.

---

## 14. Preview and Dry Run

Preview and dry run expose the planned effects without intentionally persisting source mutation.

A preview may include:

- affected target identities;
- semantic planned effects;
- bounded before/after excerpts where safe;
- normalized diff-like data;
- expected created/modified/deleted resources;
- warnings/uncertainties;
- validation expectations.

<a id="dd-xform-023"></a>

**DD-XFORM-023 — Preview derives from the execution plan**

Preview derived from the execution plan follows [FR-XFORM-027](../functional/source-transformation-functional-specification-v01.md#fr-xform-027).

<a id="dd-xform-024"></a>

**DD-XFORM-024 — Dry run does not persist**

Dry-run persistence follows [FR-XFORM-028](../functional/source-transformation-functional-specification-v01.md#fr-xform-028).

<a id="dd-xform-025"></a>

**DD-XFORM-025 — Preview uncertainty is explicit**

Uncertain preview effects follows [FR-XFORM-029](../functional/source-transformation-functional-specification-v01.md#fr-xform-029).


---

## 15. Approval and Plan Binding

Application authorization/confirmation is owned above Source Transformation, but execution must consume its result correctly.

<a id="dd-xform-026"></a>

**DD-XFORM-026 — Approval binds to material plan identity**

Approval bound to the executed plan follows [FR-XFORM-031](../functional/source-transformation-functional-specification-v01.md#fr-xform-031).

<a id="dd-xform-027"></a>

**DD-XFORM-027 — Material plan change invalidates approval**

Material changes after approval follows [FR-XFORM-031](../functional/source-transformation-functional-specification-v01.md#fr-xform-031).

<a id="dd-xform-028"></a>

**DD-XFORM-028 — Headless approval remains upstream**

Missing Headless approval follows [FR-INV-022](../functional/application-invocation-functional-specification-v01.md#fr-inv-022) through Invocation.


---

## 16. Stale-Source Detection

Stale-source protection is mandatory where a plan depends on previously observed content.

<a id="dd-xform-029"></a>

**DD-XFORM-029 — Freshness before consequential mutation**  
Immediately before applying a consequential plan, Source Transformation shall establish that material source assumptions remain valid using revision/digest/precondition checks appropriate to the resource/provider.

<a id="dd-xform-030"></a>

**DD-XFORM-030 — No stale overwrite**  
If the source materially changed since planning, the plan shall not blindly overwrite newer content.

Permitted outcomes include:

- fail as stale;
- request replanning;
- re-run Source Intelligence and deterministically rebuild the plan under upstream policy;
- apply a provider-supported conditional edit only if all required preconditions still hold.

<a id="dd-xform-031"></a>

**DD-XFORM-031 — Replanning is not silent scope expansion**  
Replanning may update locators/ranges but shall not silently broaden intent, targets or approved effects.

---

## 17. Execution Contract

Execution accepts an approved, applicable plan and produces transformation evidence.

The conceptual lifecycle is:

```text
plan accepted for execution
    -> approval/authority evidence checked
    -> source freshness/preconditions checked
    -> execution begun
    -> edits/effects applied
    -> actual effects recorded
    -> source-level validation
    -> normalized transformation evidence
    -> application-level interpretation
```

<a id="dd-xform-032"></a>

**DD-XFORM-032 — No execution before plan applicability**

Unresolved source preconditions before mutation applies [Design](../appmanager-design-specification-v01.md#_9-6-project-discovery-and-context-resolution).

<a id="dd-xform-033"></a>

**DD-XFORM-033 — Mechanism subordinate to plan**

Opportunistic edits beyond the approved plan follows [FR-XFORM-014](../functional/source-transformation-functional-specification-v01.md#fr-xform-014).

<a id="dd-xform-034"></a>

**DD-XFORM-034 — Actual effects recorded**

Actual edit evidence follows [DD-1.2](../dd_1_application_core/dd-1-2-execution-outcomes-detailed-design-v01.md#_12-consequential-effects).


---

## 18. Single-Target Mutation

For a single source resource, execution should distinguish:

- unchanged/no-op;
- applied fully;
- failed before mutation;
- failed after mutation began;
- validation failed after mutation;
- cancelled before mutation;
- cancelled during mutation;
- resulting state indeterminate.

<a id="dd-xform-035"></a>

**DD-XFORM-035 — No-op is first-class**

Already-satisfied targets without a write follows [DD-1.2](../dd_1_application_core/dd-1-2-execution-outcomes-detailed-design-v01.md#_15-no-op-already-satisfied-skipped-and-not-attempted-states).

<a id="dd-xform-036"></a>

**DD-XFORM-036 — Write success is not transformation completion**

Resource replacement versus source validity follows [FR-XFORM-050](../functional/source-transformation-functional-specification-v01.md#fr-xform-050).


---

## 19. Multi-Target Transformation

A transformation plan may affect multiple resources or regions.

The plan shall carry the atomicity/continuation policy supplied by the owning use case where material.

Possible execution models include:

- all-or-nothing where the underlying mechanism can honestly guarantee it;
- staged-then-commit where supported;
- ordered best-effort with stop-on-failure;
- ordered best-effort with explicit continuation;
- independently applicable targets with partial success permitted.

<a id="dd-xform-037"></a>

**DD-XFORM-037 — No invented transactionality**

Multi-source atomicity claims use [DD-1.2](../dd_1_application_core/dd-1-2-execution-outcomes-detailed-design-v01.md#_12-consequential-effects) and the guarantee boundary in DD-XFORM-040.

<a id="dd-xform-038"></a>

**DD-XFORM-038 — Per-target evidence**

Multi-target plan results follows [DD-1.2](../dd_1_application_core/dd-1-2-execution-outcomes-detailed-design-v01.md#_14-partial-completion).

<a id="dd-xform-039"></a>

**DD-XFORM-039 — Continuation policy is not provider whim**  
Whether execution proceeds after one target fails shall be supplied by the owning plan/use-case policy, not inferred from provider convenience.

---

## 20. Atomicity and Staging

Atomicity may exist at different levels:

- individual resource replacement;
- a group of edits to one resource;
- a multi-resource plan;
- provider-managed transaction.

These must not be conflated.

<a id="dd-xform-040"></a>

**DD-XFORM-040 — Atomicity scope is explicit**  
Any atomicity guarantee shall identify the boundary to which it applies.

<a id="dd-xform-041"></a>

**DD-XFORM-041 — Staging is not commitment**

Staged transformed content before mutation follows [DD-1.2](../dd_1_application_core/dd-1-2-execution-outcomes-detailed-design-v01.md#_13-proposed-effects-and-preview).

<a id="dd-xform-042"></a>

**DD-XFORM-042 — Provider staging remains subordinate**  
Temporary-file, transaction or buffer mechanisms are implementation details unless their guarantees materially affect the shared contract.

---

## 21. Partial Application and Indeterminate State

Source Transformation shall distinguish:

- planned but not attempted;
- attempted with no effect;
- applied;
- skipped;
- failed before effect;
- failed after effect;
- validation failed after effect;
- state unknown/indeterminate.

<a id="dd-xform-043"></a>

**DD-XFORM-043 — Partial truth is preserved**

Mixed completed/failed edits follows [DD-1.2](../dd_1_application_core/dd-1-2-execution-outcomes-detailed-design-v01.md#_14-partial-completion).

<a id="dd-xform-044"></a>

**DD-XFORM-044 — Indeterminate is not unchanged**

Indeterminate edit completion follows [DD-1.2](../dd_1_application_core/dd-1-2-execution-outcomes-detailed-design-v01.md#_12-consequential-effects).


---

## 22. Cancellation

Source Transformation consumes DD-1 cancellation semantics.

<a id="dd-xform-045"></a>

**DD-XFORM-045 — Cancellation before mutation**

Cancellation before source mutation follows [FR-XFORM-075](../functional/source-transformation-functional-specification-v01.md#fr-xform-075).

<a id="dd-xform-046"></a>

**DD-XFORM-046 — Cancellation during execution**

After mutation begins, apply [DD-1.2](../dd_1_application_core/dd-1-2-execution-outcomes-detailed-design-v01.md#_17-cancellation-model) at safe boundaries under the plan atomicity/continuation policy.

<a id="dd-xform-047"></a>

**DD-XFORM-047 — Cancellation does not imply rollback**

Completed source effects after cancellation follows [DD-1.2](../dd_1_application_core/dd-1-2-execution-outcomes-detailed-design-v01.md#_17-cancellation-model).

<a id="dd-xform-048"></a>

**DD-XFORM-048 — Validation after cancellation where needed**  
If cancellation leaves source potentially modified, the capability may perform bounded cleanup/inspection necessary to determine resulting state, provided this does not broaden application intent.

---

## 23. Source-Level Validation

Source-level validation establishes whether transformed source satisfies the technical/structural requirements defined by the plan.

Validation may include:

- re-running Source Intelligence;
- parse/syntax validation;
- schema validation;
- type/semantic checks where explicitly part of transformation correctness;
- verifying required structural postconditions;
- verifying forbidden/unrelated structural changes are absent where practical;
- provider-specific structural checks normalized to AppManager evidence.

<a id="dd-xform-049"></a>

**DD-XFORM-049 — Validation is mandatory where required by plan/use case**

Required post-mutation validation follows [FR-XFORM-048](../functional/source-transformation-functional-specification-v01.md#fr-xform-048).

<a id="dd-xform-050"></a>

**DD-XFORM-050 — Validation checks intended effect**

Structural postcondition validation beyond parseability follows [FR-XFORM-051](../functional/source-transformation-functional-specification-v01.md#fr-xform-051).

<a id="dd-xform-051"></a>

**DD-XFORM-051 — Validation provider may differ from mutation provider**  
The mechanism used to edit source need not be the same mechanism used to validate it.

<a id="dd-xform-052"></a>

**DD-XFORM-052 — Validation does not decide application success**

Source-valid evidence applies [Design](../appmanager-design-specification-v01.md#_11-11-workflow-results-failure-and-acceptance).


---

## 24. Validation Evidence

A normalized validation result should be capable of carrying:

- validation status;
- target/resource identity;
- validation kind;
- checked postconditions;
- satisfied/unsatisfied conditions;
- source revision after mutation;
- structural facts used;
- diagnostics;
- provider evidence;
- uncertainty/partial status.

States should distinguish at least:

- valid;
- invalid;
- unsupported validation;
- partially validated;
- validation failed technically;
- validation cancelled;
- validation indeterminate.

<a id="dd-xform-053"></a>

**DD-XFORM-053 — Validation failure is not generic execution failure**  
The outcome model shall preserve the distinction between edit-mechanism failure and post-edit validation failure.

---

## 25. Application-Level Acceptance Boundary

After Source Transformation produces execution and validation evidence, the Application Engine/owning use case decides application-level acceptance.

That decision may consider:

- whether requested intent was achieved;
- whether scope remained valid;
- whether policy/safety conditions remain satisfied;
- whether required validation passed;
- whether partial completion is acceptable;
- whether downstream workflow postconditions hold.

<a id="dd-xform-054"></a>

**DD-XFORM-054 — Source-valid can still be application-rejected**

Application rejection of technically valid source applies [Design](../appmanager-design-specification-v01.md#_11-11-workflow-results-failure-and-acceptance).

<a id="dd-xform-055"></a>

**DD-XFORM-055 — Provider success cannot bypass acceptance**

Parser/editor/compiler/resource/AI results at final acceptance applies [Design](../appmanager-design-specification-v01.md#_11-11-workflow-results-failure-and-acceptance).


---

## 26. Diagnostics

Transformation diagnostics should distinguish, where relevant:

- unsupported transformation;
- unsupported source structure;
- ambiguous target;
- invalid plan;
- plan/approval mismatch;
- scope/precondition violation;
- stale source;
- provider unavailable;
- planning failure;
- mutation failure;
- resource precondition failure;
- partial application;
- indeterminate application;
- validation failure;
- validation unavailable;
- cancellation;
- preservation violation;
- recovery required.

<a id="dd-xform-056"></a>

**DD-XFORM-056 — Target-specific diagnostics**

Target/region identity in diagnostics follows [FR-XFORM-072](../functional/source-transformation-functional-specification-v01.md#fr-xform-072).

<a id="dd-xform-057"></a>

**DD-XFORM-057 — Provider detail remains subordinate**

Transformation-provider object/error shapes follows [DD-1.2](../dd_1_application_core/dd-1-2-execution-outcomes-detailed-design-v01.md#_18-provider-result-normalization).


---

## 27. Recovery Evidence

Source Transformation does not universally own rollback, but it must produce evidence useful for recovery.

Recovery evidence may include:

- targets changed successfully;
- targets not attempted;
- failed targets;
- post-mutation revision identities;
- prior snapshot identifiers where available;
- whether a backup/staged copy exists;
- whether rollback was attempted;
- whether rollback succeeded/failed;
- whether manual review is required;
- recommended safe next action where determinable.

<a id="dd-xform-058"></a>

**DD-XFORM-058 — Recovery is evidence, not guarantee**

Rollback claims based on snapshots/history follows [DD-1.2](../dd_1_application_core/dd-1-2-execution-outcomes-detailed-design-v01.md#_12-consequential-effects).


---

## 28. Rollback and Compensating Actions

Rollback may be implemented for particular transformation classes but is not universal Version 1 semantics.

<a id="dd-xform-059"></a>

**DD-XFORM-059 — Rollback must be explicit**  
If a transformation advertises rollback, the plan/execution contract shall define its scope and failure semantics.

<a id="dd-xform-060"></a>

**DD-XFORM-060 — Compensation differs from rollback**

Compensating edits recorded as later effects follows [DD-1.2](../dd_1_application_core/dd-1-2-execution-outcomes-detailed-design-v01.md#_12-consequential-effects).


---

## 29. Concurrency

Transformation concurrency may occur across invocations or targets.

<a id="dd-xform-061"></a>

**DD-XFORM-061 — No blind overwrite under concurrent change**

Concurrent changes invalidating a source plan follows [FR-XFORM-068](../functional/source-transformation-functional-specification-v01.md#fr-xform-068).

<a id="dd-xform-062"></a>

**DD-XFORM-062 — Conflict policy remains upstream where semantic**  
Technical detection of conflict belongs in the capability; whether to retry, replan, serialize, skip or fail remains application/use-case policy unless explicitly delegated.

<a id="dd-xform-063"></a>

**DD-XFORM-063 — Independent targets need not be globally serialized**  
The capability may allow safe technical concurrency when plan dependencies and resource-conflict rules permit it.

---

## 30. Structure-Aware Versus Textual Mutation

Structure-aware mutation should be preferred where correctness depends on syntax or schema.

Acceptable mechanisms may include:

- CST/AST edits;
- syntax-tree-aware insertion/replacement;
- JSON/JSONC path edits;
- bounded source-range replacement derived from current verified structure;
- language-service edits;
- bounded regex/text manipulation where guarantees are adequate.

<a id="dd-xform-064"></a>

**DD-XFORM-064 — No universal AST requirement**  
The architecture does not require AST/CST tooling when a simpler bounded mechanism can meet the required guarantees.

<a id="dd-xform-065"></a>

**DD-XFORM-065 — No unbounded global replace as default**

Global replacement for structure-dependent edits follows [FR-XFORM-036](../functional/source-transformation-functional-specification-v01.md#fr-xform-036).


---

## 31. Composite Source

Composite files such as Vue SFCs may require region-aware transformation.

<a id="dd-xform-066"></a>

**DD-XFORM-066 — Embedded-region edits preserve container coordinates**  
A transformation strategy operating on an embedded region shall map planned/applied effects back to the containing resource consistently.

<a id="dd-xform-067"></a>

**DD-XFORM-067 — Non-target regions preserved**  
Editing one embedded region shall not silently rewrite unrelated embedded regions unless explicitly included in the plan.

<a id="dd-xform-068"></a>

**DD-XFORM-068 — Composite validation may be layered**  
Validation may check both the changed embedded region and containing resource where either can invalidate the transformation.

---

## 32. Formatting

Formatting may be consequential because it can create large unrelated diffs.

<a id="dd-xform-069"></a>

**DD-XFORM-069 — Formatting policy is explicit where material**

Serializer-wide formatting under plan preservation applies [Design](../appmanager-design-specification-v01.md#_7-10-non-destructive-transformation).

<a id="dd-xform-070"></a>

**DD-XFORM-070 — Local formatting is permissible**  
Formatting directly necessary to express the bounded change may be included when represented as part of the planned effect or provider guarantee.

---

## 33. Ownership and Generated Content

The owning use case/Managed Project supplies ownership classifications such as AppManager-owned, generated, user-authored, external or unknown.

<a id="dd-xform-071"></a>

**DD-XFORM-071 — Capability consumes ownership, does not invent it**

Whole-resource ownership assumptions follows [FR-XFORM-042](../functional/source-transformation-functional-specification-v01.md#fr-xform-042).

<a id="dd-xform-072"></a>

**DD-XFORM-072 — Unknown ownership is conservative**  
Where ownership materially affects preservation/safety and cannot be established, the capability shall fail, require stronger upstream evidence or use a transformation strategy that does not rely on broader ownership.

---

## 34. Effective Configuration

Source Transformation may consume effective configuration for:

- formatter/provider selection;
- transformation limits;
- file-format conventions;
- validation requirements;
- generated-region markers;
- provider-specific options approved by configuration policy.

<a id="dd-xform-073"></a>

**DD-XFORM-073 — No private configuration precedence**

Transformation policy consumes [DD-1.4 effective values](../dd_1_application_core/dd-1-4-configuration-resolution-detailed-design-v01.md#_15-resolution-result).


---

## 35. AI-Assisted Transformations

AI may propose source changes, but Source Transformation treats AI output as untrusted proposal/evidence.

<a id="dd-xform-074"></a>

**DD-XFORM-074 — AI proposal enters normal planning**  
AI-proposed source changes shall be reconciled with recognized source structure and converted into a bounded transformation plan before mutation.

<a id="dd-xform-075"></a>

**DD-XFORM-075 — AI cannot broaden targets**

Out-of-scope AI proposals during planning applies [Design](../appmanager-design-specification-v01.md#_11-10-ai-assisted-workflow).

<a id="dd-xform-076"></a>

**DD-XFORM-076 — AI-native patch is not authority**  
Provider-specific diff/patch/tool-call formats must be validated and normalized before they can become executable planned edits.

<a id="dd-xform-077"></a>

**DD-XFORM-077 — AI uncertainty remains visible**

AI proposals not safely reconcilable with source follows [FR-XFORM-062](../functional/source-transformation-functional-specification-v01.md#fr-xform-062).


---

## 36. Relationship to Process Execution

Some transformations or validations may delegate to external tools through DD-2.2 Process Execution.

<a id="dd-xform-078"></a>

**DD-XFORM-078 — Process completion is subordinate evidence**

Tool completion uses [FR-XFORM-050](../functional/source-transformation-functional-specification-v01.md#fr-xform-050) for source validity and [Design](../appmanager-design-specification-v01.md#_11-11-workflow-results-failure-and-acceptance) for application acceptance.

<a id="dd-xform-079"></a>

**DD-XFORM-079 — Tool output is normalized**  
Provider-specific stdout/stderr/exit codes shall be interpreted within the transformation/validation provider before becoming source-transformation evidence.

---

## 37. Relationship to Repository Capability

Repository state may provide recovery, stale-state or contextual evidence, but repository mechanics do not replace source transformation semantics.

<a id="dd-xform-080"></a>

**DD-XFORM-080 — Repository cleanliness is not transformation approval**

Clean-worktree evidence applies [Design](../appmanager-design-specification-v01.md#_9-9-non-destructive-ownership-and-unmanaged-content).

<a id="dd-xform-081"></a>

**DD-XFORM-081 — Repository restoration is not implicit rollback**

Repository-history restoration guarantees follows [DD-1.2](../dd_1_application_core/dd-1-2-execution-outcomes-detailed-design-v01.md#_12-consequential-effects).


---

## 38. Relationship to Resource Access

Source Transformation relies on DD-2.1 for bounded resource effects.

<a id="dd-xform-082"></a>

**DD-XFORM-082 — Resource preconditions are leveraged where available**  
Conditional replace/write semantics, snapshot identity, atomic resource replacement and stale-state checks should be used where they strengthen transformation guarantees.

<a id="dd-xform-083"></a>

**DD-XFORM-083 — Path accessibility is not mutation authority**

Writable-path evidence applies [Design](../appmanager-design-specification-v01.md#_9-9-non-destructive-ownership-and-unmanaged-content).


---

## 39. Relationship to Execution Outcomes

Transformation evidence must integrate with DD-1.2 without collapsing states.

A normalized result should be capable of representing:

- planning status;
- plan identity;
- approval applicability evidence;
- precondition/freshness status;
- per-target execution state;
- actual effects;
- source revision after execution;
- validation state;
- diagnostics;
- cancellation evidence;
- partial/indeterminate state;
- recovery evidence.

<a id="dd-xform-084"></a>

**DD-XFORM-084 — Transformation state is multidimensional**

Plan, effect, validation and acceptance states follows [FR-XFORM-073](../functional/source-transformation-functional-specification-v01.md#fr-xform-073).

<a id="dd-xform-085"></a>

**DD-XFORM-085 — No Boolean collapse**  
A single success flag shall not erase partial, no-op, stale, invalid, cancelled, indeterminate or validation-failed distinctions.

---

## 40. Capability Discovery

A caller may need to know whether a transformation kind is supported before planning.

Capability discovery should be able to report support by:

- source kind;
- transformation kind;
- required preservation guarantee;
- preview availability;
- validation availability;
- provider availability.

<a id="dd-xform-086"></a>

**DD-XFORM-086 — Support is transformation-specific**

Edit-type availability uses the format-relative contract [DD-XFORM-008](#dd-xform-008).


---

## 41. Provider Replaceability

Version 1 may use Node.js/TypeScript, regex strategies, JSONC edits, source-range replacement or other existing mechanisms.

<a id="dd-xform-087"></a>

**DD-XFORM-087 — Provider-neutral semantics**  
Replacement providers shall preserve the transformation plan, preservation, stale-state, validation and evidence semantics promised by this design or explicitly report unsupported capability.

<a id="dd-xform-088"></a>

**DD-XFORM-088 — No speculative cross-runtime protocol**

Transformation topology follows the [Documentation Guide](../project-documentation-guide-v01.md#_8-level-4-implementation-specification); no worker, RPC or language-neutral plugin protocol is mandated.


---

## 42. Current Implementation Reconciliation

This section is historical implementation evidence under the [Documentation Guide reading conventions](../project-documentation-guide-v01.md#detailed-design-reading-conventions), not permanent product authority.

Current source and historical technical specifications are implementation evidence only.

### 42.1 Useful concepts retained

The current implementation demonstrates useful behaviors including:

- source-kind-specific transformation strategies;
- bounded header insertion/replacement;
- Vue region-aware transformation;
- JSON/JSONC structured edits;
- documentable-block discovery followed by targeted documentation injection;
- source reading before mutation;
- write delegation through a shared file/resource service;
- language-specific preservation rules such as shebang-aware header placement.

### 42.2 Incidental structures not promoted

The following are not automatically permanent architecture:

- singleton `CodeService`;
- `ICodeStrategy` as the final transformation interface;
- extension-keyed strategy registry;
- `injectHeader()`/`injectFunctionDoc()` as the permanent operation set;
- regex strategies as universal transformation mechanisms;
- exact `jsonc-parser` edit APIs;
- direct `fileService.read()` / `fileService.write()` sequencing;
- direct logger calls;
- direct `llmService.generate()` invocation inside transformation orchestration;
- whole in-memory string replacement as the universal execution model.

### 42.3 Current implementation gaps relative to this design

The current `codeService.ts` implementation generally performs:

```text
read current content
    -> choose strategy
    -> create transformed content
    -> write transformed content
```

That is useful implementation evidence but does not yet embody the full DD-2.5 contract for:

- explicit plan identity;
- plan approval binding;
- stale-source preconditions between read and write;
- normalized preview data;
- per-edit planned effects;
- source-level post-edit validation;
- partial/indeterminate evidence;
- recovery evidence;
- DD-1.2 normalized outcomes.

<a id="dd-xform-089"></a>

**DD-XFORM-089 — Implementation must converge on the design**

Current mechanisms are adapted under the [Documentation Guide implementation boundary](../project-documentation-guide-v01.md#_8-level-4-implementation-specification), preserving the approved plan contracts.


---

## 43. Testability Requirements

Source Transformation shall permit deterministic tests for at least:

- supported/unsupported transformation kinds;
- bounded plan construction;
- plan contains only authorized targets;
- no-op/already-satisfied plans;
- preview equivalence with planned execution;
- dry run preserves source;
- material plan change invalidates approval linkage;
- stale-source rejection;
- successful single-target mutation;
- failure before mutation;
- failure during mutation;
- multi-target partial completion;
- explicitly atomic provider behavior where offered;
- cancellation before mutation;
- cancellation after some effects;
- source-level validation success/failure;
- validation-provider failure;
- preservation of unrelated content;
- composite-source edits;
- formatting constraints;
- AI proposal normalization/rejection;
- sensitive diagnostics;
- provider replacement.

<a id="dd-xform-090"></a>

**DD-XFORM-090 — Tests separate provider correctness from application acceptance**  
Provider/Source Transformation tests shall establish planning, mutation and source-validation behavior without requiring the capability itself to decide final application success.

---

## 44. Conformance Invariants

The plan/edit/precondition models (§§9–11), preservation and generation boundaries, preview/approval/freshness contracts, execution/validation states and recovery provisions form the review path. Provider replacement and testability obligations validate those local guarantees; the Functional bindings identify inherited obligations.

## 45. Traceability Summary

| Detailed Design concern | Primary authority |
|---|---|
| intent and planning | `FR-XFORM-011`–`020` |
| preview/dry run | `FR-XFORM-026`–`029` |
| approval binding | `FR-XFORM-030`–`032`; DD-1.1/1.5 |
| execution | `FR-XFORM-033`–`038` |
| preservation | `FR-XFORM-039`–`043` |
| generation vs mutation | `FR-XFORM-044`–`047` |
| source-level validation | `FR-XFORM-048`–`053` |
| application acceptance separation | `FR-XFORM-054`–`058`; DD-1.2/1.5 |
| AI proposals | `FR-XFORM-059`–`062` |
| atomicity/partial state | `FR-XFORM-063`–`067`; DD-1.2 |
| stale/concurrency | `FR-XFORM-068`–`070`; DD-2.1/DD-2.4 |
| diagnostics/outcomes | `FR-XFORM-071`–`074`; DD-1.2 |
| cancellation | `FR-XFORM-075`–`077`; DD-1.2/1.5 |
| interaction equivalence | `FR-XFORM-078`–`081`; DD-1.1 |
| source facts | DD-2.4 Source Intelligence |
| resource mutation mechanics | DD-2.1 Resource Access |
| process-backed tools | DD-2.2 Process Execution |
| provider/runtime replaceability | ADR-0001 |

---

## 46. Contract Consumers and Implementation Dependencies {#_46-downstream-detailed-design-dependencies}

### 46.1 DD-2.6 Resource Registry and Template

Resource Registry and Template may generate new artefacts or templates. It must preserve the DD-2.5 distinction between generation and mutation when a target already exists.

### 46.2 Documentation Capability

Documentation generation or injection may consume DD-2.4 facts and DD-2.5 transformation plans. Docs retains documentation semantics and application intent.

### 46.3 Nuxt Capability

Nuxt configuration/source updates may use DD-2.5 but Nuxt retains Nuxt-domain semantics and postconditions.

### 46.4 Settings / Maintenance / AI

[Settings](../dd_4_policy_and_resource_domains/dd-4-2-settings-domain-detailed-design-v01.md) and [Maintenance](../dd_4_policy_and_resource_domains/dd-4-4-utils-domain-detailed-design-v01.md) supply bounded source-change intent; [AI proposals](../appmanager-design-specification-v01.md#_11-10-ai-assisted-workflow) can supply desired content. Their transformation requests enter the same plan/approval lifecycle here.

### 46.5 Implementation Specification

Implementation planning shall reconcile current `codeService`, strategy classes, `fileService`, JSONC edits, Vue orchestration and documentation-injection mechanisms against this design.

---

## 47. Final Design Position

The [architectural position](#_4-architectural-position) provides the collaboration map. The local models and workflows above, together with their direct upstream bindings, define the Version 1 contract; the conformance and testability sections provide the review route.
