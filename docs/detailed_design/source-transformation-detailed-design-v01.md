# AppManager Source Transformation Detailed Design

> **Status:** Version 1 Detailed Design Specification
>
> **Detailed Design authority:** This document defines the permanent shared contracts for bounded source-transformation planning, execution, source-level validation and transformation evidence beneath AppManager application authority. It refines, but does not override, the root Design Specification, Functional Specifications, accepted ADRs, or DD-1 Application Core Detailed Designs.
>
> **Governing sources:** `docs/project-documentation-guide-v01.md`, `docs/appmanager-design-specification-v01.md`, `docs/project_management/detailed-design-decomposition-plan-v01.md`, `docs/decisions/adr-0001-primary-application-runtime.md`
>
> **Related Detailed Design authorities:** `docs/detailed_design/application-invocation-detailed-design-v01.md`, `docs/detailed_design/execution-outcomes-detailed-design-v01.md`, `docs/detailed_design/managed-project-detailed-design-v01.md`, `docs/detailed_design/configuration-resolution-detailed-design-v01.md`, `docs/detailed_design/application-engine-detailed-design-v01.md`, `docs/detailed_design/resource-access-detailed-design-v01.md`, `docs/detailed_design/process-execution-detailed-design-v01.md`, `docs/detailed_design/repository-capability-detailed-design-v01.md`, `docs/detailed_design/source-intelligence-detailed-design-v01.md`
>
> **Primary Functional authority:** `docs/functional/source-transformation-functional-specification-v01.md`
>
> **Related domain Functional authorities:** App, Docs, Nuxt, Quality, AI, Settings and Utils where those domains request source changes or validate source-level consequences.

---

## 1. Purpose

This specification defines the permanent internal contracts, responsibilities, state distinctions, execution sequencing and evidence model by which AppManager plans, applies and validates bounded changes to existing source.

The governing rule is:

> **Source Transformation applies only an approved bounded transformation plan; it does not invent application intent, managed scope, authorization or final application acceptance.**

A second governing rule is:

> **Recognition, planning, approval, mutation, source-level validation and application-level acceptance are distinct stages and must remain distinguishable.**

A third governing rule is:

> **A technically applied edit is not automatically a valid transformation, and a source-valid transformation is not automatically an accepted AppManager outcome.**

Source Transformation therefore owns the controlled bridge between read-only source intelligence and consequential resource mutation while preserving Application Engine authority.

---

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

**DD-XFORM-001 — Recognition is not planning authority**  
A recognized declaration, block, metadata region or configuration path does not become a transformation target until the owning use case and Source Transformation plan bind it to explicit intent and scope.

### 4.2 Relationship to Resource Access

Resource Access owns bounded resource mechanics such as snapshots, preconditioned replacement and atomic write guarantees where supported.

**DD-XFORM-002 — Transformation semantics remain above write mechanics**  
Resource Access may apply an approved write, but it shall not decide what source edit is semantically correct.

### 4.3 Relationship to Application Engine

The Engine/use-case authority determines why the transformation is required, which targets are in scope, whether the plan is approved and whether the validated result satisfies application intent.

Source Transformation determines how an approved bounded source change is planned, applied and source-validated.

---

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

**DD-XFORM-003 — Intent originates upstream**  
The transformation request shall express an AppManager-owned intent; a transformation provider shall not independently invent the application reason for changing source.

**DD-XFORM-004 — Request scope is bounded**  
The request shall identify source targets and effect constraints sufficiently to prevent an implementation from treating an entire project as implicitly mutable.

**DD-XFORM-005 — No authority by content proposal**  
Supplying replacement content, a patch, an AI proposal or a provider-native edit object does not by itself authorize application of that content.

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

**DD-XFORM-006 — Intent and mechanism are distinct**  
Intent shall not be expressed solely as “run this regex”, “write this whole file”, “apply this AST mutation” or another provider-native mechanism where AppManager needs stronger semantic meaning.

**DD-XFORM-007 — Intent does not broaden itself**  
Discovery of related declarations/files/regions shall not silently expand the transformation intent beyond the owning use case.

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

**DD-XFORM-008 — Strategy capability is intent-specific**  
A provider capable of one transformation kind for a source format shall not be assumed capable of all transformations for that format.

**DD-XFORM-009 — Provider order is not hidden policy**  
Incidental registry order shall not silently decide between materially different transformation strategies where their preservation or semantic guarantees differ.

**DD-XFORM-010 — Weak fallback is explicit**  
Falling back from a structure-aware strategy to a weaker textual heuristic shall only occur when the requested guarantees remain satisfied or when the weaker certainty is explicitly surfaced for upstream policy.

---

## 9. Transformation Plan Contract

### 9.1 Purpose

The transformation plan is the canonical bounded description of what Source Transformation proposes to change before consequential mutation begins.

A plan shall be immutable or treated as immutable once approved.

### 9.2 Plan identity

A plan should carry a stable plan identity/correlation value where required for approval, preview and execution linkage.

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

**DD-XFORM-012 — Plan is not mutation**  
Constructing a plan shall not intentionally alter source.

**DD-XFORM-013 — Plan cannot exceed upstream scope**  
A plan shall not include source targets or structural effects outside the authority supplied by the owning use case and managed scope.

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

**DD-XFORM-014 — Semantic edit above provider patch**  
Provider-native patches, text edits, AST mutations or CST edits may implement a planned edit but shall not become the only shared representation when AppManager requires semantic traceability.

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

**DD-XFORM-016 — Preconditions are explicit evidence**  
Where correctness depends on a source assumption, that assumption shall be represented as a plan precondition or equivalent stale-state guard rather than remain an invisible provider assumption.

**DD-XFORM-017 — Preconditions do not replace application policy**  
Technical preconditions establish plan applicability, not application authorization.

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

**DD-XFORM-018 — Preservation is part of correctness**  
When the owning use case requires bounded mutation, unnecessary rewriting of unrelated content is a transformation defect even if the intended value appears in the final source.

**DD-XFORM-019 — Whole-file rewrite requires justification**  
A provider may rewrite a whole file only when that behavior is compatible with the approved intent and preservation guarantees; it is not the default merely because regeneration is easier.

---

## 13. Generation Versus Mutation

Generation and mutation are distinct paths.

**DD-XFORM-020 — Existing resource changes use mutation semantics**  
A capability that can generate a complete artefact shall not overwrite an existing user-authored source resource unless an owning use case explicitly authorizes replacement under transformation semantics.

**DD-XFORM-021 — Generated region remains bounded**  
Where AppManager owns a generated region within a larger file, transformation authority shall remain bounded to that region unless broader replacement is explicitly authorized.

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

**DD-XFORM-023 — Preview derives from the execution plan**  
Preview shall be generated from the same bounded plan intended for execution rather than from an independent code path that can diverge semantically.

**DD-XFORM-024 — Dry run does not persist**  
Dry-run behavior shall not intentionally persist source changes.

**DD-XFORM-025 — Preview uncertainty is explicit**  
Where exact effects cannot be predicted reliably before execution, the preview shall distinguish uncertain/provisional information from guaranteed effects.

---

## 15. Approval and Plan Binding

Application authorization/confirmation is owned above Source Transformation, but execution must consume its result correctly.

**DD-XFORM-026 — Approval binds to material plan identity**  
Where approval is required, Source Transformation shall execute only a plan materially equivalent to the plan/intent/scope that was approved.

**DD-XFORM-027 — Material plan change invalidates approval**  
If target, effect, scope, destructive character or other material plan properties change, approval shall be considered stale until re-evaluated by the owning authority.

**DD-XFORM-028 — Headless approval remains upstream**  
Source Transformation shall not introduce interactive prompts to obtain missing application approval in Headless operation.

---

## 16. Stale-Source Detection

Stale-source protection is mandatory where a plan depends on previously observed content.

**DD-XFORM-029 — Freshness before consequential mutation**  
Immediately before applying a consequential plan, Source Transformation shall establish that material source assumptions remain valid using revision/digest/precondition checks appropriate to the resource/provider.

**DD-XFORM-030 — No stale overwrite**  
If the source materially changed since planning, the plan shall not blindly overwrite newer content.

Permitted outcomes include:

- fail as stale;
- request replanning;
- re-run Source Intelligence and deterministically rebuild the plan under upstream policy;
- apply a provider-supported conditional edit only if all required preconditions still hold.

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

**DD-XFORM-032 — No execution before plan applicability**  
Execution shall not begin consequential mutation while required source preconditions remain unresolved.

**DD-XFORM-033 — Mechanism subordinate to plan**  
Execution shall not opportunistically add cleanup, refactoring, formatting or unrelated changes beyond the approved plan.

**DD-XFORM-034 — Actual effects recorded**  
Transformation evidence shall describe known effects that actually occurred rather than assuming every planned edit completed.

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

**DD-XFORM-035 — No-op is first-class**  
If the requested semantic state is already satisfied and no mutation is required, Source Transformation may return a no-op/already-satisfied technical result rather than fabricate a write.

**DD-XFORM-036 — Write success is not transformation completion**  
Successful resource replacement does not prove source-level validation or intended structural postconditions.

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

**DD-XFORM-037 — No invented transactionality**  
Source Transformation shall not describe a multi-resource operation as atomic unless the underlying execution path actually provides the required guarantee.

**DD-XFORM-038 — Per-target evidence**  
Multi-target execution shall preserve target-level states/effects sufficiently to represent partial completion and recovery needs.

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

**DD-XFORM-040 — Atomicity scope is explicit**  
Any atomicity guarantee shall identify the boundary to which it applies.

**DD-XFORM-041 — Staging is not commitment**  
Preparing temporary/staged transformed content does not itself mean consequential source mutation has been committed.

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

**DD-XFORM-043 — Partial truth is preserved**  
When some effects complete and others do not, the capability shall preserve known completed effects rather than collapse the operation into undifferentiated failure.

**DD-XFORM-044 — Indeterminate is not unchanged**  
If the capability cannot prove whether an edit took effect, it shall not report the source as unchanged.

---

## 22. Cancellation

Source Transformation consumes DD-1 cancellation semantics.

**DD-XFORM-045 — Cancellation before mutation**  
If cancellation is observed before consequential mutation begins, planned mutation shall not intentionally be initiated.

**DD-XFORM-046 — Cancellation during execution**  
If cancellation is observed after effects begin, Source Transformation shall stop initiating additional effects as safely as practical under the plan's atomicity/continuation model and report resulting state truthfully.

**DD-XFORM-047 — Cancellation does not imply rollback**  
Completed source effects remain completed unless an explicit rollback mechanism successfully reverses them.

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

**DD-XFORM-049 — Validation is mandatory where required by plan/use case**  
Consequential transformation shall not be described as source-valid until all required validation obligations complete successfully.

**DD-XFORM-050 — Validation checks intended effect**  
Parseability alone is insufficient where the plan promised a specific structural outcome.

**DD-XFORM-051 — Validation provider may differ from mutation provider**  
The mechanism used to edit source need not be the same mechanism used to validate it.

**DD-XFORM-052 — Validation does not decide application success**  
A source-valid result remains evidence for the Application Engine/owning use case.

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

**DD-XFORM-054 — Source-valid can still be application-rejected**  
The capability contract shall permit a technically valid transformed source to be rejected by the application layer without falsifying the technical evidence.

**DD-XFORM-055 — Provider success cannot bypass acceptance**  
No parser, patch engine, formatter, compiler, Resource Access provider or AI provider may independently declare final AppManager transformation success.

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

**DD-XFORM-056 — Target-specific diagnostics**  
Diagnostics shall identify the affected target/region sufficiently for remediation without unnecessarily disclosing unrelated source.

**DD-XFORM-057 — Provider detail remains subordinate**  
Raw parser exceptions, AST nodes, stack traces, text-edit SDK objects and provider-native failure shapes shall be bounded/normalized before crossing the capability boundary.

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

**DD-XFORM-058 — Recovery is evidence, not guarantee**  
The presence of prior snapshots or repository history shall not be described as an automatic rollback guarantee unless the operation explicitly provides and verifies that guarantee.

---

## 28. Rollback and Compensating Actions

Rollback may be implemented for particular transformation classes but is not universal Version 1 semantics.

**DD-XFORM-059 — Rollback must be explicit**  
If a transformation advertises rollback, the plan/execution contract shall define its scope and failure semantics.

**DD-XFORM-060 — Compensation differs from rollback**  
A later compensating edit is a new consequential effect and shall not be conflated with proof that the original transformation never occurred.

---

## 29. Concurrency

Transformation concurrency may occur across invocations or targets.

**DD-XFORM-061 — No blind overwrite under concurrent change**  
Source revision/precondition checks shall prevent a stale plan from blindly replacing material concurrent edits.

**DD-XFORM-062 — Conflict policy remains upstream where semantic**  
Technical detection of conflict belongs in the capability; whether to retry, replan, serialize, skip or fail remains application/use-case policy unless explicitly delegated.

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

**DD-XFORM-064 — No universal AST requirement**  
The architecture does not require AST/CST tooling when a simpler bounded mechanism can meet the required guarantees.

**DD-XFORM-065 — No unbounded global replace as default**  
Global textual replacement shall not be the default for structure-dependent edits where it can affect unrelated source.

---

## 31. Composite Source

Composite files such as Vue SFCs may require region-aware transformation.

**DD-XFORM-066 — Embedded-region edits preserve container coordinates**  
A transformation strategy operating on an embedded region shall map planned/applied effects back to the containing resource consistently.

**DD-XFORM-067 — Non-target regions preserved**  
Editing one embedded region shall not silently rewrite unrelated embedded regions unless explicitly included in the plan.

**DD-XFORM-068 — Composite validation may be layered**  
Validation may check both the changed embedded region and containing resource where either can invalidate the transformation.

---

## 32. Formatting

Formatting may be consequential because it can create large unrelated diffs.

**DD-XFORM-069 — Formatting policy is explicit where material**  
A transformation provider shall not silently reformat an entire resource merely because its serializer does so, unless such behavior is compatible with the plan and preservation requirements.

**DD-XFORM-070 — Local formatting is permissible**  
Formatting directly necessary to express the bounded change may be included when represented as part of the planned effect or provider guarantee.

---

## 33. Ownership and Generated Content

The owning use case/Managed Project supplies ownership classifications such as AppManager-owned, generated, user-authored, external or unknown.

**DD-XFORM-071 — Capability consumes ownership, does not invent it**  
Source Transformation may enforce supplied ownership constraints but shall not classify an entire resource as AppManager-owned merely because it can modify it.

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

**DD-XFORM-073 — No private configuration precedence**  
Transformation providers shall not establish competing configuration semantics by independently rereading arbitrary settings/environment sources.

---

## 35. AI-Assisted Transformations

AI may propose source changes, but Source Transformation treats AI output as untrusted proposal/evidence.

**DD-XFORM-074 — AI proposal enters normal planning**  
AI-proposed source changes shall be reconciled with recognized source structure and converted into a bounded transformation plan before mutation.

**DD-XFORM-075 — AI cannot broaden targets**  
An AI response that proposes edits outside authorized targets/scope shall not expand the plan automatically.

**DD-XFORM-076 — AI-native patch is not authority**  
Provider-specific diff/patch/tool-call formats must be validated and normalized before they can become executable planned edits.

**DD-XFORM-077 — AI uncertainty remains visible**  
If an AI proposal cannot be deterministically reconciled with current source, planning shall fail or remain ambiguous rather than guess.

---

## 36. Relationship to Process Execution

Some transformations or validations may delegate to external tools through DD-2.2 Process Execution.

**DD-XFORM-078 — Process completion is subordinate evidence**  
An external formatter/compiler/transformer exiting successfully does not establish source-level or application-level success by itself.

**DD-XFORM-079 — Tool output is normalized**  
Provider-specific stdout/stderr/exit codes shall be interpreted within the transformation/validation provider before becoming source-transformation evidence.

---

## 37. Relationship to Repository Capability

Repository state may provide recovery, stale-state or contextual evidence, but repository mechanics do not replace source transformation semantics.

**DD-XFORM-080 — Repository cleanliness is not transformation approval**  
A clean worktree does not grant authority to mutate source.

**DD-XFORM-081 — Repository restoration is not implicit rollback**  
The existence of repository history shall not cause failed transformations to advertise rollback unless an owning workflow explicitly defines and executes restoration.

---

## 38. Relationship to Resource Access

Source Transformation relies on DD-2.1 for bounded resource effects.

**DD-XFORM-082 — Resource preconditions are leveraged where available**  
Conditional replace/write semantics, snapshot identity, atomic resource replacement and stale-state checks should be used where they strengthen transformation guarantees.

**DD-XFORM-083 — Path accessibility is not mutation authority**  
Resource Access confirming a path is writable shall not override managed scope or plan authorization.

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

**DD-XFORM-084 — Transformation state is multidimensional**  
Planning success, mutation completion, validation success and application acceptance shall remain distinguishable.

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

**DD-XFORM-086 — Support is transformation-specific**  
General support for a source kind does not imply support for every edit type.

---

## 41. Provider Replaceability

Version 1 may use Node.js/TypeScript, regex strategies, JSONC edits, source-range replacement or other existing mechanisms.

**DD-XFORM-087 — Provider-neutral semantics**  
Replacement providers shall preserve the transformation plan, preservation, stale-state, validation and evidence semantics promised by this design or explicitly report unsupported capability.

**DD-XFORM-088 — No speculative cross-runtime protocol**  
Provider replaceability does not require a worker process, RPC layer or language-neutral plugin protocol in Version 1 without a concrete need.

---

## 42. Current Implementation Reconciliation

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

**DD-XFORM-089 — Implementation must converge on the design**  
Future Implementation Specifications shall adapt current mechanisms to this Detailed Design rather than weakening the Detailed Design to match current service behavior.

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

**DD-XFORM-090 — Tests separate provider correctness from application acceptance**  
Provider/Source Transformation tests shall establish planning, mutation and source-validation behavior without requiring the capability itself to decide final application success.

---

## 44. Conformance Invariants

A conforming DD-2.5 implementation shall preserve all of the following:

1. Transformation intent originates from an authoritative owning use case.
2. Recognition alone does not authorize mutation.
3. Consequential source changes are represented by a bounded plan before execution.
4. Plan construction does not itself mutate source.
5. Plan targets cannot exceed upstream managed scope/authority.
6. Planned edits preserve semantic traceability above provider-native patches.
7. Approval, where required, binds to the material plan/intent/scope.
8. Material plan change requires approval re-evaluation.
9. Preview derives from the same plan intended for execution.
10. Dry run does not intentionally persist mutation.
11. Source freshness/preconditions are checked before consequential execution.
12. Stale plans do not blindly overwrite newer source.
13. Transformation mechanisms do not opportunistically broaden edits.
14. Unrelated user-authored source is preserved wherever practical.
15. Generation and mutation remain distinct.
16. Whole-file regeneration is not the default mutation mechanism where a bounded edit is safe.
17. Successful resource write is not source-level validation.
18. Source-level validation checks the intended structural effect where required.
19. Source-valid does not equal final application-accepted.
20. Provider/tool success does not equal AppManager success.
21. Multi-target atomicity is never implied without a real guarantee.
22. Partial effects are preserved in evidence.
23. Indeterminate state is distinct from unchanged state.
24. Cancellation does not imply rollback.
25. Recovery information is evidence, not universal rollback guarantee.
26. Configuration precedence remains under Configuration Resolution.
27. Ownership classification remains upstream.
28. AI proposals follow the normal planning/approval/validation path.
29. External process results are normalized before transformation interpretation.
30. Repository state does not grant mutation authority.
31. Provider-native AST/CST/text-edit/SDK objects remain below the shared boundary.
32. Current implementation structure does not define permanent architecture.
33. The capability boundary does not require one class, package, library, process or runtime topology.

---

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

## 46. Downstream Detailed Design Dependencies

### 46.1 DD-2.6 Resource Registry and Template

The next shared capability may generate new artefacts or templates. It must preserve the DD-2.5 distinction between generation and mutation when a target already exists.

### 46.2 Documentation Capability

Documentation generation or injection may consume DD-2.4 facts and DD-2.5 transformation plans. Docs retains documentation semantics and application intent.

### 46.3 Nuxt Capability

Nuxt configuration/source updates may use DD-2.5 but Nuxt retains Nuxt-domain semantics and postconditions.

### 46.4 Settings / Utils / AI

Settings and Utils may request bounded source changes; AI may propose edits. None acquires transformation execution authority merely by producing desired content.

### 46.5 Implementation Specification

Implementation planning shall reconcile current `codeService`, strategy classes, `fileService`, JSONC edits, Vue orchestration and documentation-injection mechanisms against this design.

---

## 47. Final Design Position

The permanent Version 1 position is:

> **Source Transformation owns bounded transformation planning, approved source mutation, source-level validation and transformation evidence; application intent, scope, authorization and final acceptance remain above it.**

The canonical staged model is:

```text
Source Intelligence recognition/facts
    -> AppManager transformation intent
    -> bounded transformation plan
    -> policy/scope/approval
    -> stale-source verification
    -> bounded mutation
    -> actual-effect recording
    -> source-level validation
    -> application-level acceptance
```

This ensures AppManager can evolve from current regex/string-oriented transformation mechanisms toward richer AST/CST/language-service providers where useful without changing the architectural authority model or sacrificing preservation, reviewability, stale-state safety and outcome truthfulness.