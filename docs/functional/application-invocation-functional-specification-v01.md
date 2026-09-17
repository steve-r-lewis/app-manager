# AppManager Application Invocation Functional Specification

> **Status:** Version 1 Functional Specification
>
> **Functional authority:** This document defines the required observable behaviour of AppManager invocation and shared command execution semantics. It refines, but does not override, the root Design Specification.
>
> **Governing sources:** [Project Documentation Guide](../project-documentation-guide-v01.md), [AppManager Design Specification](../appmanager-design-specification-v01.md)
>
> **Historical planning provenance (non-normative):** [docs/project_management/functional-specification-decomposition-plan-v01.md](../project_management/functional-specification-decomposition-plan-v01.md)

## 1. Purpose

This specification defines the common functional behaviour by which AppManager commands and use cases are discovered, invoked, validated, executed, observed, completed, failed, partially completed, or cancelled across supported interaction modes and host integrations.

It is the shared Functional authority for invocation semantics. Domain Functional Specifications define what individual AppManager use cases do; this specification defines the common behavioural contract under which those use cases are invoked and report their outcomes.

## 2. Scope

This specification owns observable behaviour for:

- command identity and discovery;
- invocation intent, inputs, options, and invocation context;
- invocation validation;
- command availability;
- deterministic non-interactive Headless operation;
- interaction-mode functional equivalence;
- functionally required confirmation and explicit authorisation;
- preview or dry-run behaviour when a use case requires it;
- structured success, failure, cancellation, and partial-success outcomes;
- diagnostics and warnings;
- progress or execution events where functionally significant;
- cancellation where supported and functionally significant;
- machine-consumable results independent of presentation;
- behaviour when required information cannot be resolved non-interactively;
- application-level interpretation and acceptance of delegated results.

This specification does not define individual domain command behaviour except where necessary to establish shared invocation semantics.

## 3. Out of Scope

The following are deliberately below the Functional level unless a later accepted architectural decision elevates them:

- transport protocols;
- serialization or wire formats;
- TypeScript interfaces or language-level APIs;
- concrete command registry implementations;
- process, package, module, or deployment topology;
- terminal, GUI, IDE, CI, or automation libraries;
- concrete cancellation primitives;
- provider-specific request or result representations;
- concrete error classes or exception hierarchies;
- source paths and runtime wiring.

These concerns belong to Detailed Design or Implementation Specifications.

## 4. Functional Model

A conforming invocation is conceptually:

```text
caller intent
    -> interaction adapter / host integration
    -> structured AppManager invocation
    -> invocation validation
    -> command discovery and availability evaluation
    -> Application Engine execution
    -> shared context / configuration / scope / safety semantics
    -> capability coordination where required
    -> application-level interpretation and acceptance
    -> structured outcome
    -> adapter-specific presentation or machine consumption
```

The sequence above defines functional responsibility and observable behaviour, not implementation topology.

### 4.1 Application authority

The requirements below bind this concern to its shared and domain-specific owners.

<a id="fr-inv-001"></a>

**FR-INV-001 — Single application semantics**  
Every supported invocation path shall apply [Design §4.6](../appmanager-design-specification-v01.md#_4-6-presentation-independence).

<a id="fr-inv-002"></a>

**FR-INV-002 — Delegated execution**  
Delegated result interpretation, application policy, scope and safety shall conform to [Design §6.2](../appmanager-design-specification-v01.md#_6-2-application-engine-authority), [Design §11.11](../appmanager-design-specification-v01.md#_11-11-workflow-results-failure-and-acceptance).

## 5. Command Identity and Discovery

### 5.1 Stable command identity

<a id="fr-inv-003"></a>

**FR-INV-003 — Command identity**  
Every invocable AppManager command or use case shall have an unambiguous identity sufficient for a caller to select the intended operation without depending on presentation-specific labels.

Human-readable labels, menu positions, shortcuts, or IDE actions may represent that identity but shall not constitute the authoritative command identity.

### 5.2 Discoverable command surface

<a id="fr-inv-004"></a>

**FR-INV-004 — Command discovery**

AppManager shall provide callers with a discoverable command surface for the relevant application context, using the authoritative discovery model in [Design §5.4](../appmanager-design-specification-v01.md#_5-4-command-discovery).

### 5.3 Command metadata

<a id="fr-inv-005"></a>

**FR-INV-005 — Discovery information**  
Where needed to support selection or automation, discovery shall expose sufficient application-level information to distinguish commands, including their identity, functional domain, purpose or description, and availability state where applicable.

Exact metadata schemas belong to Detailed Design.

### 5.4 Unknown commands

<a id="fr-inv-006"></a>

**FR-INV-006 — Unknown command behaviour**  
An invocation that identifies no recognised command shall fail without executing another command by approximation or implicit substitution. The outcome shall identify the invocation as invalid and provide a diagnostic sufficient to determine that the requested command was not recognised.

## 6. Invocation Information

### 6.1 Required invocation information

<a id="fr-inv-007"></a>

**FR-INV-007 — Structured invocation intent**  
An invocation shall carry sufficient structured information for AppManager to determine the requested command or use case and the explicit inputs and options supplied by the caller.

Where relevant to the use case, invocation information may also include target-project context, requested scope, explicit configuration overrides, confirmation or authorisation information, and caller capabilities such as whether interaction is available.

### 6.2 Explicitness

<a id="fr-inv-008"></a>

**FR-INV-008 — No presentation-dependent semantics**  
The meaning of structured invocation information shall conform to [Design §4.6](../appmanager-design-specification-v01.md#_4-6-presentation-independence).

### 6.3 Omitted optional information

<a id="fr-inv-009"></a>

**FR-INV-009 — Optional inputs**  
Omitted optional inputs shall be handled according to the command's Functional Specification and shared configuration/context rules. Omission shall not be silently interpreted as an unsafe or destructive choice merely because one interaction adapter supplied such a value.

### 6.4 Invocation context

<a id="fr-inv-010"></a>

**FR-INV-010 — Invocation context**

Where execution depends on caller or environment context, AppManager shall distinguish explicit invocation inputs from context resolved through the governed managed-project and configuration contracts. Host-supplied context follows [Design §4.6](../appmanager-design-specification-v01.md#_4-6-presentation-independence).

## 7. Validation and Preconditions

### 7.1 Validation before consequential execution

<a id="fr-inv-011"></a>

**FR-INV-011 — Invocation validation**  
AppManager shall validate command identity, required inputs, applicable input constraints, and functionally required preconditions before beginning consequential effects that depend on those conditions.

### 7.2 Validation failures

<a id="fr-inv-012"></a>

**FR-INV-012 — Validation failure outcome**  
A validation failure shall produce a structured failure outcome that identifies the invocation as rejected and provides diagnostics sufficient to identify the invalid, missing, ambiguous, or unsupported requirement.

Validation failure shall not be represented as successful command completion.

### 7.3 Context-dependent validation

<a id="fr-inv-013"></a>

**FR-INV-013 — Deferred contextual validation**  
Where validity depends on managed project context, managed scope, effective configuration, or another shared Functional authority, AppManager may resolve that information before completing validation. Failure to resolve required information shall be reported as a defined invocation or execution failure rather than being replaced by an unsafe guess.

## 8. Command Availability

<a id="fr-inv-014"></a>

**FR-INV-014 — Availability evaluation**  
Where a command is conditionally available, AppManager shall be able to determine whether the command is currently available for the relevant context.

<a id="fr-inv-015"></a>

**FR-INV-015 — Unavailable command**  
A recognised but unavailable command shall remain distinguishable from an unknown command. Attempting to invoke it shall fail clearly without performing the unavailable operation and shall provide an application-level reason where that reason can be determined safely.

<a id="fr-inv-016"></a>

**FR-INV-016 — Presentation independence of availability**  
An adapter may hide, disable, annotate, or otherwise present unavailable commands differently, but presentation shall not be the authority that decides whether the command is executable.

## 9. Interaction Modes and Functional Equivalence

### 9.1 Shared semantics

<a id="fr-inv-017"></a>

**FR-INV-017 — Cross-mode equivalence**

Every supported TUI, Headless, GUI, IDE/host-tool, CI, automation-agent and future invocation path shall conform to [Design §4.6](../appmanager-design-specification-v01.md#_4-6-presentation-independence).

### 9.2 Thin interaction behaviour

<a id="fr-inv-018"></a>

**FR-INV-018 — Adapter responsibility**  
Adapter input, host-context, progress, confirmation and result responsibilities shall conform to [Design §4.6](../appmanager-design-specification-v01.md#_4-6-presentation-independence).

### 9.3 Human interaction

<a id="fr-inv-019"></a>

**FR-INV-019 — Interactive input acquisition**  
An interactive adapter may request missing information from a user only where the underlying use case permits that information to be supplied interactively. The resulting value shall enter the same application validation and execution semantics as an explicitly supplied non-interactive value.

### 9.4 Version 1 Graphical Interaction

The graphical interaction model is established in [Design §4](../appmanager-design-specification-v01.md#_4-operating-context-and-interaction-modes). These requirements define what callers can do through its graphical projection; future IDE/host equivalence does not make WebStorm a Version 1 deliverable.

<a id="fr-inv-gui-001"></a>

**FR-INV-GUI-001 — Concrete Version 1 provision**

AppManager Version 1 shall provide a graphical user interface capable of discovering and invoking the authoritative Version 1 AppManager command/use-case catalogue through the shared Application Invocation semantics.

<a id="fr-inv-gui-002"></a>

**FR-INV-GUI-002 — No GUI command model**

GUI catalogue/availability projection shall apply [FR-INV-004](application-invocation-functional-specification-v01.md#fr-inv-004), [Design §4.6](../appmanager-design-specification-v01.md#_4-6-presentation-independence).

<a id="fr-inv-gui-003"></a>

**FR-INV-GUI-003 — Graphical interaction projection**

For application information that can be represented graphically, the GUI shall present suitable graphical controls or views for acquiring permitted input and presenting application state, proposed effects, progress, diagnostics and outcomes without requiring the user to interpret terminal formatting or Headless output syntax.

<a id="fr-inv-gui-004"></a>

**FR-INV-GUI-004 — Semantic rather than layout equivalence**
Equivalent GUI, TUI and Headless intent/context shall apply [Design §4.6](../appmanager-design-specification-v01.md#_4-6-presentation-independence). Graphical flow and layout may differ.

<a id="fr-inv-gui-005"></a>

**FR-INV-GUI-005 — Structured input provenance**
Values acquired through forms, selectors and editors shall apply [FR-INV-007](application-invocation-functional-specification-v01.md#fr-inv-007), [Design §4.6](../appmanager-design-specification-v01.md#_4-6-presentation-independence), [FR-INV-019](application-invocation-functional-specification-v01.md#fr-inv-019).

<a id="fr-inv-gui-006"></a>

**FR-INV-GUI-006 — Graphical authorization acquisition**

Graphical authorisation acquisition shall apply [FR-INV-023](application-invocation-functional-specification-v01.md#fr-inv-023), [FR-INV-024](application-invocation-functional-specification-v01.md#fr-inv-024). Evidence shall remain bound to the intended effect; material changes require authorisation re-evaluation.

<a id="fr-inv-gui-007"></a>

**FR-INV-GUI-007 — WYSIWYG preview**

Where a use case exposes preview/proposed effects or structured proposed content, the GUI shall be capable of presenting that information graphically without representing proposed effects as already applied.

<a id="fr-inv-gui-008"></a>

**FR-INV-GUI-008 — Graphical progress and outcome**

Graphical progress and final-state rendering shall apply [FR-INV-028](application-invocation-functional-specification-v01.md#fr-inv-028), [FR-INV-033](application-invocation-functional-specification-v01.md#fr-inv-033), [FR-INV-045](application-invocation-functional-specification-v01.md#fr-inv-045), [FR-INV-047](application-invocation-functional-specification-v01.md#fr-inv-047).

<a id="fr-inv-gui-009"></a>

**FR-INV-GUI-009 — Interactive capability**

GUI interactive acquisition of permitted input, authorisation and cancellation shall apply [FR-INV-019](application-invocation-functional-specification-v01.md#fr-inv-019), [FR-INV-023](application-invocation-functional-specification-v01.md#fr-inv-023), [FR-INV-030](application-invocation-functional-specification-v01.md#fr-inv-030).

<a id="fr-inv-gui-010"></a>

**FR-INV-GUI-010 — TUI/GUI parity without presentation duplication**

A Version 1 use case exposed interactively through the TUI shall be exposable through the GUI when its authoritative availability permits it. A presentation limitation shall not silently redefine the application catalogue; any deliberate adapter projection/subset shall be identified as such.

## 10. Headless and Automation Behaviour

### 10.1 Determinism

<a id="fr-inv-020"></a>

**FR-INV-020 — Deterministic Headless operation**  
Headless operation shall not require human interaction to complete a valid invocation.

Where required information is absent, AppManager shall do one of the following according to defined Functional semantics: resolve it deterministically, apply a defined non-interactive default or fallback, or fail clearly.

It shall not block indefinitely awaiting interactive input or make an ungoverned guess merely to continue execution.

### 10.2 Machine-consumable outcomes

<a id="fr-inv-021"></a>

**FR-INV-021 — Machine-consumable result**  
Headless and automation-oriented invocation shall make the application-level outcome available in structured form without requiring a caller to infer success or failure from human-oriented prose, colour, spinner state, menu state, or terminal formatting.

### 10.3 Automation safety

<a id="fr-inv-022"></a>

**FR-INV-022 — Non-interactive safety**  
The absence of an interactive user shall not weaken AppManager safety, scope, confirmation, or authorisation requirements.

If an operation requires explicit authorisation that cannot be satisfied by the invocation, Headless execution shall fail clearly rather than implicitly approve the operation.

## 11. Confirmation, Authorisation, Preview, and Dry Run

### 11.1 Confirmation is functional only where required

<a id="fr-inv-023"></a>

**FR-INV-023 — Confirmation semantics**  
Where a domain or shared Functional Specification requires explicit confirmation or authorisation before a consequential operation, that requirement shall apply independently of interaction mode.

The TUI prompt, GUI dialog, command option, IDE control, or other mechanism used to obtain that authorisation is presentation or lower-level design.

### 11.2 No false confirmation

<a id="fr-inv-024"></a>

**FR-INV-024 — Explicit authorisation**  
AppManager shall not infer affirmative authorisation solely from the absence of a response, the use of Headless mode, or an adapter's inability to prompt.

### 11.3 Preview and dry run

<a id="fr-inv-025"></a>

**FR-INV-025 — Preview semantics**  
Where a use case supports preview or dry-run behaviour, the preview shall represent the intended operation without claiming that the consequential effects have occurred.

<a id="fr-inv-026"></a>

**FR-INV-026 — Preview result distinction**  
A preview or dry-run outcome shall be distinguishable from an applied-operation outcome in machine-consumable results and human presentation.

Exact planning representations belong to the owning Functional Specification and lower-level design.

## 12. Execution Progress and Events

<a id="fr-inv-027"></a>

**FR-INV-027 — Functionally significant progress**  
Where an operation is sufficiently long-running or multi-stage that progress is functionally significant, AppManager shall make meaningful execution progress or state transitions observable to capable callers.

<a id="fr-inv-028"></a>

**FR-INV-028 — Progress is not outcome**  
Progress, spinner completion, emitted messages, or intermediate capability success shall not by themselves constitute final application-level success.

<a id="fr-inv-029"></a>

**FR-INV-029 — Presentation independence of progress**  
Adapters may render the same underlying progress information differently or omit non-essential presentation detail. This shall not alter execution semantics.

## 13. Cancellation

### 13.1 Supported cancellation

<a id="fr-inv-030"></a>

**FR-INV-030 — Cancellation capability**  
Where an operation is functionally specified as cancellable, a capable invocation path shall be able to request cancellation without redefining the operation's application semantics.

### 13.2 Cancellation outcome

<a id="fr-inv-031"></a>

**FR-INV-031 — Cancellation result**  
A cancelled operation shall produce a structured outcome distinguishable from both success and ordinary failure.

The outcome shall report consequential effects already completed before cancellation where those effects are functionally significant and known.

### 13.3 Cancellation safety

<a id="fr-inv-032"></a>

**FR-INV-032 — Cancellation consistency**  
Cancellation shall not be reported as though it guaranteed rollback unless the owning Functional Specification explicitly guarantees rollback for that operation.

Where cancellation leaves partial effects, those effects shall be represented through partial-completion information and diagnostics.

## 14. Structured Outcomes

### 14.1 Common outcome classes

Every significant invocation shall terminate with an application-level outcome representing at least one of the applicable states: success, failure, cancellation, or partial success/partial completion.

<a id="fr-inv-033"></a>

**FR-INV-033 — Structured final outcome**  
AppManager shall produce a structured final outcome for significant invocations. The outcome shall be independent of the adapter's human-readable rendering.

### 14.2 Success

<a id="fr-inv-034"></a>

**FR-INV-034 — Success semantics**

Success shall mean that AppManager has accepted the operation as successfully satisfying its application-level intent and applicable policy, scope, safety and validation requirements. Delegated evidence is governed by [Design §11.11](../appmanager-design-specification-v01.md#_11-11-workflow-results-failure-and-acceptance).

### 14.3 Failure

<a id="fr-inv-035"></a>

**FR-INV-035 — Failure semantics**  
Failure shall indicate that AppManager did not accept the invocation or operation as successfully completed. Where safe and applicable, the outcome shall identify the failed stage or reason and any consequential effects already performed.

### 14.4 Partial success

<a id="fr-inv-036"></a>

**FR-INV-036 — Partial-success semantics**  
Where a multi-target or multi-stage operation completes some consequential work but cannot satisfy the complete requested intent, AppManager shall not collapse that state into unconditional success.

If the owning use case permits partial success, the outcome shall identify it explicitly and expose enough information to distinguish completed, failed, skipped, cancelled, or otherwise unresolved portions where applicable.

### 14.5 Result information

<a id="fr-inv-037"></a>

**FR-INV-037 — Result content**

Structured outcomes shall contain sufficient application-level information for callers to determine final status and consume functionally significant results under [FR-INV-021](application-invocation-functional-specification-v01.md#fr-inv-021). Where relevant, this includes affected or unchanged managed targets and material results from delegated capabilities or external operations. Failure, partial completion, consequential effects and recovery information follow FR-INV-035–036 and FR-INV-045–047. Exact schemas, field names, type systems and serialization formats belong to Detailed Design.

## 15. Diagnostics and Warnings

### 15.1 Diagnostics

<a id="fr-inv-038"></a>

**FR-INV-038 — Diagnostics**  
AppManager shall provide structured or otherwise machine-associable diagnostics for failures and for significant conditions that require caller attention.

Diagnostics shall describe AppManager-level meaning rather than requiring callers to understand provider-specific exception objects or terminal output.

### 15.2 Warnings

<a id="fr-inv-039"></a>

**FR-INV-039 — Warning distinction**  
A non-fatal warning shall be distinguishable from a failure. The presence of a warning shall not silently convert a failed operation into success or a successful operation into failure unless the owning Functional Specification defines that condition as an acceptance criterion.

### 15.3 Sensitive information

<a id="fr-inv-040"></a>

**FR-INV-040 — Diagnostic minimisation**

Invocation results, diagnostics, warnings and progress shall enforce the disclosure-minimisation constraint in [Design §8.7](../appmanager-design-specification-v01.md#_8-7-sensitive-configuration). Where sensitive information is relevant to a failure, AppManager shall prefer sufficient diagnostic meaning over reproducing the sensitive value itself.

## 16. Delegated Results and Application-Level Acceptance

<a id="fr-inv-041"></a>

**FR-INV-041 — Capability result interpretation**  
Capability/provider result interpretation before final outcome determination shall conform to [Design §11.11](../appmanager-design-specification-v01.md#_11-11-workflow-results-failure-and-acceptance).

<a id="fr-inv-042"></a>

**FR-INV-042 — Technical success versus application success**  
Technical success reported by a delegated capability shall apply [FR-INV-034](application-invocation-functional-specification-v01.md#fr-inv-034).

<a id="fr-inv-043"></a>

**FR-INV-043 — Technical failure versus workflow interpretation**  
A delegated capability failure shall be represented and interpreted according to the owning use case. AppManager may determine that a particular delegated failure is fatal, recoverable, skippable, or part of a partial-success outcome, but that interpretation remains an AppManager application decision.

## 17. Failure Behaviour

<a id="fr-inv-044"></a>

**FR-INV-044 — No presentation-only failure semantics**  
Failure representation on structured invocation paths shall apply [FR-INV-021](application-invocation-functional-specification-v01.md#fr-inv-021).

<a id="fr-inv-045"></a>

**FR-INV-045 — Consequential-effect reporting**  
When an invocation fails after consequential effects have occurred, AppManager shall report those known effects where they are material to safe caller understanding or recovery.

<a id="fr-inv-046"></a>

**FR-INV-046 — No implicit rollback guarantee**  
A failed invocation shall not imply that all prior effects were rolled back unless the owning Functional Specification explicitly guarantees transactional or rollback behaviour.

<a id="fr-inv-047"></a>

**FR-INV-047 — Recovery information**  
Where AppManager can determine a safe, meaningful recovery or next action, the failure diagnostics should expose that information without inventing recovery guarantees that the application cannot provide.

## 18. Idempotence, Repetition, and Retry

Invocation infrastructure shall not assume that commands are idempotent or safely repeatable.

<a id="fr-inv-048"></a>

**FR-INV-048 — Repeat execution semantics**  
Whether a command may be safely repeated, resumed, or retried shall be defined by the owning Functional Specification where functionally significant.

<a id="fr-inv-049"></a>

**FR-INV-049 — No implicit retry authority**  
An adapter or provider shall not silently retry consequential AppManager operations in a way that can change application-visible semantics unless retry behaviour is permitted by the owning application semantics.

Detailed retry algorithms and provider-level transient-failure handling belong to lower-level specifications unless they materially affect observable behaviour.

## 19. Concurrency and Invocation Independence

<a id="fr-inv-050"></a>

**FR-INV-050 — Invocation isolation of intent**  
Each invocation shall preserve its own command intent, explicit inputs, requested context, and requested scope. One invocation shall not silently inherit mutable invocation-specific choices from an unrelated invocation.

<a id="fr-inv-051"></a>

**FR-INV-051 — Concurrent conflict behaviour**  
Where simultaneous or overlapping invocations would create an application-level conflict, AppManager shall detect, prevent, serialize, reject, or otherwise resolve that conflict according to the owning Functional semantics rather than allowing nondeterministic corruption.

Concrete locking, queueing, transaction, and concurrency mechanisms belong to Detailed Design.

## 20. Relationship to Other Functional Specifications

This specification intentionally delegates several shared concerns to their authoritative Functional homes:

| Concern | Functional authority |
|---|---|
| Managed project context, project recognition, managed scope | [managed-project-functional-specification-v01.md](managed-project-functional-specification-v01.md) |
| Effective configuration and configuration-source resolution | [configuration-functional-specification-v01.md](configuration-functional-specification-v01.md) |
| Shared source inspection, mutation, generation, validation and acceptance | [source-transformation-functional-specification-v01.md](source-transformation-functional-specification-v01.md) |
| Individual commands and use cases | Owning domain Functional Specification |

These specifications are current authorities for their respective concerns. This document shall not be interpreted as duplicating or weakening them.

## 21. Traceability

The principal upward traceability for this specification is:

| Functional area | Root Design responsibility |
|---|---|
| Shared invocation boundary and interaction modes | Sections 4 and 5 |
| Command identity, discovery, responsibilities, shared execution semantics | Section 5 |
| Application Engine authority and delegated capability execution | Section 6 |
| Command invocation and workflow outcomes | Section 11 |
| Presentation independence | Section 12 |
| Structured invocation boundary | Section 12 |
| Single application authority and delegated execution | Section 12 |
| Structured outcomes and observability | Section 12 |
| Deterministic Headless operation | Section 12 |
| Sensitive-information minimisation | Section 12 |
| Extensible command surface without parallel authority | Section 13 |
| Functional specification responsibility and traceability | Section 14 |
| GUI catalogue, graphical inputs, preview and parity | FR-INV-GUI-001–010; Design §4 and §6.10 |

ADR-0001 selects the Version 1 implementation runtime but does not alter these technology-independent Functional requirements.

## 22. Conformance Criteria

Conformance is assessed against the applicable requirement bodies in this specification and the canonical contracts they reference. The traceability section identifies the requirement groups; this section creates no additional acceptance checklist.

## 23. Downstream Specification Requirements

Detailed Design Specifications derived from this Functional Specification shall define the permanent technical realisation required to satisfy these behaviours, including where appropriate:

- invocation request/result/event contracts;
- command identity and discovery contracts;
- availability evaluation contracts;
- validation coordination;
- progress and cancellation coordination;
- error and diagnostic taxonomy;
- application-level result modelling;
- concurrency and lifecycle semantics;
- adapter/application boundary contracts;
- capability-result interpretation boundaries.

Implementation Specifications shall subsequently map those approved Detailed Designs to the concrete Version 1 Node.js/TypeScript code, packages, modules, entry points, libraries, runtime wiring, schemas, transports, and tests.

Neither lower level may silently weaken or redefine the Functional requirements in this document.
