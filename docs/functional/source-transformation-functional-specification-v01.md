# AppManager Source Transformation Functional Specification

> **Status:** Version 1 Functional Specification
>
> **Functional authority:** This document defines the required observable behaviour by which AppManager inspects existing source, derives bounded transformation intent, controls and applies source mutations, validates transformed source, and accepts or rejects transformation outcomes at the application level. It refines, but does not override, the root Design Specification.
>
> **Governing sources:** [Project Documentation Guide](../project-documentation-guide-v01.md), [AppManager Design Specification](../appmanager-design-specification-v01.md)
>
> **Related Functional authorities:** [docs/functional/application-invocation-functional-specification-v01.md](application-invocation-functional-specification-v01.md), [docs/functional/managed-project-functional-specification-v01.md](managed-project-functional-specification-v01.md), [docs/functional/configuration-functional-specification-v01.md](configuration-functional-specification-v01.md)
>
> **Historical planning provenance (non-normative):** [docs/project_management/functional-specification-decomposition-plan-v01.md](../project_management/functional-specification-decomposition-plan-v01.md)

## 1. Purpose

This specification defines the shared Functional behaviour for controlled inspection and transformation of existing source within AppManager.

A source-changing use case moves from inspection to a bounded plan, approval, execution and evaluation. The sections below define the observable information and decisions at each stage, including uncertainty, preservation and recovery. Architectural responsibilities are defined in [Design §7](../appmanager-design-specification-v01.md#_7-code-intelligence-and-transformation-architecture).

## 2. Scope

This specification owns shared observable behaviour for:

- source inspection and recognition;
- structural facts required by AppManager use cases;
- supported and unsupported source structures;
- ambiguity handling;
- transformation intent;
- bounded transformation plans;
- target and managed-scope enforcement;
- separation of inspection, planning, approval, execution, validation, and acceptance;
- preview and dry-run representation where supported;
- confirmation requirements for consequential source changes where functionally required;
- transformation execution against approved plans;
- preservation of unaffected content where practical;
- structure-aware modification of structured formats where appropriate;
- source-level validation following transformation;
- application-level acceptance or rejection following source-level validation;
- rejection of technically valid transformations that violate command intent, managed scope, policy, safety, or workflow constraints;
- atomicity and partial-change reporting where functionally required;
- diagnostics for unsupported, ambiguous, conflicting, or failed transformations;
- generation-versus-mutation separation;
- AI-assisted source changes remaining non-authoritative until validated and accepted;
- interaction-mode equivalence for transformation semantics.

This specification defines shared transformation behaviour. Individual domain Functional Specifications own the user or automation intent that requests a particular source inspection or source change.

## 3. Out of Scope

The following are deliberately below the Functional level unless a later accepted architectural decision elevates them:

- concrete scanner classes;
- scanner token types or token contracts;
- parser, compiler, AST, CST, syntax-tree, or language-service object models;
- concrete strategy interfaces;
- concrete transformation-plan schemas;
- exact edit representations;
- text-edit libraries;
- parser SDKs or compiler APIs;
- concrete orchestration classes;
- TypeScript interfaces and method signatures;
- source-file implementation paths;
- exact formatting libraries;
- exact transaction, temporary-file, backup, or rollback mechanisms;
- concrete source-control integration used to restore files;
- exact validation toolchains;
- concrete diff formats;
- provider-specific AI edit formats;
- implementation-specific concurrency primitives.

Those concerns belong to Detailed Design or Implementation Specifications.

## 4. Functional Model

The shared transformation model is conceptually:

```text
command / use-case intent
        |
        v
resolved target project / managed scope / effective configuration
        |
        v
source recognition / inspection
        |
        v
structural facts
        |
        v
transformation intent
        |
        v
bounded transformation plan
        |
        v
Application Engine policy / scope / safety / approval
        |
        v
transformation execution
        |
        v
source-level validation
        |
        v
application-level acceptance
```

This is a Functional responsibility model, not a required module or process topology.

### 4.1 Application authority

<a id="fr-xform-001"></a>

**FR-XFORM-001 — Shared transformation semantics**  
Transformation use across callers and providers shall apply [Design §4.6](../appmanager-design-specification-v01.md#_4-6-presentation-independence).

<a id="fr-xform-002"></a>

**FR-XFORM-002 — Delegated execution does not delegate authority**  
Parser, scanner, strategy, transformation, language-service, tool and AI delegation shall conform to [Design §6.2](../appmanager-design-specification-v01.md#_6-2-application-engine-authority), [Design §11.11](../appmanager-design-specification-v01.md#_11-11-workflow-results-failure-and-acceptance).

<a id="fr-xform-003"></a>

**FR-XFORM-003 — Application Engine acceptance authority**  
Final transformation acceptance shall apply [FR-INV-034](application-invocation-functional-specification-v01.md#fr-inv-034).

## 5. Inspection and Recognition

<a id="fr-xform-004"></a>

**FR-XFORM-004 — Inspection before mutation where understanding is required**  
Where a source-changing operation depends on existing source structure, AppManager shall obtain sufficient source recognition or inspection information before authorising the mutation.

<a id="fr-xform-005"></a>

**FR-XFORM-005 — Recognition is non-mutating**  
Source recognition or inspection shall not modify source merely as a consequence of discovering or interpreting its structure.

<a id="fr-xform-006"></a>

**FR-XFORM-006 — Structural facts**  
Inspection shall expose structural facts sufficient for the owning use case, using the representation boundary in [Design §6.6](../appmanager-design-specification-v01.md#_6-6-capability-boundaries-and-providers).

<a id="fr-xform-007"></a>

**FR-XFORM-007 — Recognised regions**  
Where relevant, inspection shall be capable of identifying the structural region, declaration, configuration entry, documentable element, or other bounded source target to which a requested operation applies.

<a id="fr-xform-008"></a>

**FR-XFORM-008 — Unsupported source**  
If AppManager cannot safely recognise the source structure required by an operation, it shall report the source or structure as unsupported rather than proceed with an unbounded mutation.

<a id="fr-xform-009"></a>

**FR-XFORM-009 — Ambiguous source structure**  
If multiple plausible structural targets exist and the owning semantics do not provide a deterministic choice, AppManager shall require permitted disambiguation or fail clearly rather than select an arbitrary target.

<a id="fr-xform-010"></a>

**FR-XFORM-010 — Conflicting structural interpretation**  
Where available recognition mechanisms produce materially conflicting interpretations that affect mutation safety or target selection, AppManager shall resolve the conflict through defined policy or fail before consequential mutation.

## 6. Transformation Intent

<a id="fr-xform-011"></a>

**FR-XFORM-011 — Intent derived from the use case**  
AppManager transformation intent versus mechanism authority shall conform to [Design §6.2](../appmanager-design-specification-v01.md#_6-2-application-engine-authority).

<a id="fr-xform-012"></a>

**FR-XFORM-012 — Intent is source-aware but application-owned**  
Transformation intent refined by facts/effective configuration shall apply [Design §6.2](../appmanager-design-specification-v01.md#_6-2-application-engine-authority).

<a id="fr-xform-013"></a>

**FR-XFORM-013 — Intent shall be bounded**  
Transformation intent shall identify the change sufficiently to distinguish the intended structural effect from unrelated source content.

<a id="fr-xform-014"></a>

**FR-XFORM-014 — No opportunistic unrelated edits**  
A source-changing operation shall not introduce unrelated cleanup, refactoring, reformatting, metadata changes, or other edits merely because the transformation mechanism is capable of doing so, unless the owning use case explicitly includes them.

## 7. Bounded Transformation Plans

<a id="fr-xform-015"></a>

**FR-XFORM-015 — Plan before consequential mutation**  
Consequential source changes shall require the plan defined in [Design §7.5](../appmanager-design-specification-v01.md#_7-5-strategies-and-transformation-plans) before applying mutation.

<a id="fr-xform-016"></a>

**FR-XFORM-016 — Plan contents**

A transformation plan shall use the information model in [Design §7.5](../appmanager-design-specification-v01.md#_7-5-strategies-and-transformation-plans). To the extent functionally relevant it shall additionally identify preconditions and the expected transformed outcome sufficiently for later validation. Exact schemas belong to Detailed Design.

<a id="fr-xform-017"></a>

**FR-XFORM-017 — Plan is not execution**  
Creating or returning a transformation plan shall not itself apply the planned source mutation.

<a id="fr-xform-018"></a>

**FR-XFORM-018 — Plan scope cannot exceed use-case scope**  
Every planned transformation target shall apply [FR-PROJ-044](managed-project-functional-specification-v01.md#fr-proj-044).

<a id="fr-xform-019"></a>

**FR-XFORM-019 — No implicit plan expansion**  
Discovery of related source targets during planning shall apply [FR-PROJ-042](managed-project-functional-specification-v01.md#fr-proj-042).

<a id="fr-xform-020"></a>

**FR-XFORM-020 — Plan invalidation on stale assumptions**  
If material source facts or preconditions on which a transformation plan depends are no longer true before execution, AppManager shall not blindly apply the stale plan. It shall re-resolve, reject, or otherwise handle the changed condition according to defined policy.

## 8. Managed Scope and Target Safety

<a id="fr-xform-021"></a>

**FR-XFORM-021 — Managed scope before mutation**  
Transformation readiness before consequential mutation shall apply [Design §9.7](../appmanager-design-specification-v01.md#_9-7-managed-scope-and-operation-targeting), [Design §9.6](../appmanager-design-specification-v01.md#_9-6-project-discovery-and-context-resolution).

<a id="fr-xform-022"></a>

**FR-XFORM-022 — Target eligibility**  
Source-file and structural-region eligibility shall apply [FR-PROJ-044](managed-project-functional-specification-v01.md#fr-proj-044).

<a id="fr-xform-023"></a>

**FR-XFORM-023 — Recognition does not grant mutation authority**  
Recognised source files, regions, declarations and configuration entries shall apply [Design §9.9](../appmanager-design-specification-v01.md#_9-9-non-destructive-ownership-and-unmanaged-content).

<a id="fr-xform-024"></a>

**FR-XFORM-024 — Exclusions remain effective**  
Excluded source targets, including generated regions shall apply [FR-PROJ-047](managed-project-functional-specification-v01.md#fr-proj-047).

<a id="fr-xform-025"></a>

**FR-XFORM-025 — Outside-scope protection**  
Uncertain transformation scope shall apply [FR-PROJ-061](managed-project-functional-specification-v01.md#fr-proj-061).

## 9. Preview, Dry Run, and Reviewability

<a id="fr-xform-026"></a>

**FR-XFORM-026 — Previewable intent where supported**  
Transformation preview and dry run shall apply [FR-INV-025](application-invocation-functional-specification-v01.md#fr-inv-025).

<a id="fr-xform-027"></a>

**FR-XFORM-027 — Preview reflects bounded plan**  
A preview shall represent the bounded transformation plan or its expected source effects rather than a separate transformation path with independent semantics.

<a id="fr-xform-028"></a>

**FR-XFORM-028 — Dry run preserves source**  
Dry-run execution shall not intentionally persist the source mutations being evaluated.

<a id="fr-xform-029"></a>

**FR-XFORM-029 — Preview uncertainty**  
If AppManager cannot determine a reliable preview because source structure, provider behaviour, or required context is unresolved, it shall report that limitation rather than present speculative effects as certain.

## 10. Confirmation and Approval

<a id="fr-xform-030"></a>

**FR-XFORM-030 — Consequential confirmation where required**  
Source changes requiring confirmation under the owning use case or policy shall apply [FR-INV-023](application-invocation-functional-specification-v01.md#fr-inv-023).

<a id="fr-xform-031"></a>

**FR-XFORM-031 — Confirmation applies to the intended change**  
Confirmation shall relate to the relevant transformation intent and scope. Materially changing the target or effect after confirmation shall require re-evaluation and, where applicable, renewed confirmation.

<a id="fr-xform-032"></a>

**FR-XFORM-032 — Headless approval semantics**  
Headless transformation approval shall apply [FR-INV-022](application-invocation-functional-specification-v01.md#fr-inv-022).

## 11. Transformation Execution

<a id="fr-xform-033"></a>

**FR-XFORM-033 — Execute approved bounded plans**  
A transformation mechanism shall apply only a transformation plan that has passed the applicable AppManager policy, scope, safety, and approval checks.

<a id="fr-xform-034"></a>

**FR-XFORM-034 — Mechanism is subordinate to plan**  
Transformation mechanism effect bounds shall apply [FR-XFORM-033](source-transformation-functional-specification-v01.md#fr-xform-033).

<a id="fr-xform-035"></a>

**FR-XFORM-035 — Structure-aware execution**  
Transformations whose correctness depends on source structure shall enforce the structure-aware preference in [Design §7.11](../appmanager-design-specification-v01.md#_7-11-structured-formats) where suitable mechanisms exist.

<a id="fr-xform-036"></a>

**FR-XFORM-036 — No fragile global replacement as default**  
AppManager shall not use unbounded global text replacement as the default mechanism for code-aware or structure-dependent mutations where such replacement could affect unrelated content.

<a id="fr-xform-037"></a>

**FR-XFORM-037 — Source-format-appropriate mechanism**  
Source-format-specific transformation mechanisms shall conform to [Design §6.6](../appmanager-design-specification-v01.md#_6-6-capability-boundaries-and-providers).

<a id="fr-xform-038"></a>

**FR-XFORM-038 — Composite-source coordination**  
Where one source file contains multiple languages or structural regions, AppManager may coordinate specialised mechanisms, but the composed transformation shall remain one coherent bounded operation from the perspective of the owning use case.

## 12. Preservation and Non-Destructive Behaviour

<a id="fr-xform-039"></a>

**FR-XFORM-039 — Preserve unaffected content**  
Source transformations shall apply [Design §9.9](../appmanager-design-specification-v01.md#_9-9-non-destructive-ownership-and-unmanaged-content).

<a id="fr-xform-040"></a>

**FR-XFORM-040 — Preserve comments and formatting where practical**  
Source transformations shall enforce the preservation preference in [Design §7.10](../appmanager-design-specification-v01.md#_7-10-non-destructive-transformation) where the mechanism permits. This includes ordering and whitespace conventions among unaffected source characteristics.

<a id="fr-xform-041"></a>

**FR-XFORM-041 — Prefer bounded edits over regeneration**  
Choice of bounded edits versus full-file regeneration shall enforce the preference in [Design §7.10](../appmanager-design-specification-v01.md#_7-10-non-destructive-transformation).

<a id="fr-xform-042"></a>

**FR-XFORM-042 — No ownership by rewrite**  
AppManager shall not treat a file as wholly AppManager-owned merely because it performs a bounded transformation within that file.

<a id="fr-xform-043"></a>

**FR-XFORM-043 — User content remains protected**  
Unrelated authored material encountered during transformation shall apply [Design §9.9](../appmanager-design-specification-v01.md#_9-9-non-destructive-ownership-and-unmanaged-content), [Design §6.8](../appmanager-design-specification-v01.md#_6-8-generation-and-templates).

## 13. Generation Versus Mutation

<a id="fr-xform-044"></a>

**FR-XFORM-044 — Generation/mutation distinction**  
New-artefact generation and existing-source transformation shall conform to [Design §6.8](../appmanager-design-specification-v01.md#_6-8-generation-and-templates).

<a id="fr-xform-045"></a>

**FR-XFORM-045 — Generation does not imply mutation authority**  
Replacement of existing user-authored files by a generation capability shall conform to [Design §6.8](../appmanager-design-specification-v01.md#_6-8-generation-and-templates).

<a id="fr-xform-046"></a>

**FR-XFORM-046 — Existing source is not a blank template target**  
Existing user-managed template destinations shall apply [Design §6.8](../appmanager-design-specification-v01.md#_6-8-generation-and-templates).

<a id="fr-xform-047"></a>

**FR-XFORM-047 — Generated-region mutation**  
Where AppManager owns or recognises a generated region within a larger user-authored file, mutation authority shall remain bounded to the region or scope established by the owning use case and applicable ownership semantics.

## 14. Source-Level Validation

<a id="fr-xform-048"></a>

**FR-XFORM-048 — Validate transformed source**  
After a consequential transformation, AppManager shall perform the source-level validation required by the source type and owning use case before treating the transformation as successfully realised.

<a id="fr-xform-049"></a>

**FR-XFORM-049 — Validation may be multi-dimensional**  
Applicable source-level validation dimensions shall conform to [Design §7.7](../appmanager-design-specification-v01.md#_7-7-validation).

<a id="fr-xform-050"></a>

**FR-XFORM-050 — Validation is distinct from execution**  
Successful completion of the edit mechanism shall not itself prove that the transformed source is valid.

<a id="fr-xform-051"></a>

**FR-XFORM-051 — Validation against intended structural outcome**  
Where relevant, validation shall confirm not only that the source remains parseable or syntactically valid, but also that the intended bounded structural effect was achieved.

<a id="fr-xform-052"></a>

**FR-XFORM-052 — Validation failure**  
Failed required source-level validation shall apply [FR-XFORM-048](source-transformation-functional-specification-v01.md#fr-xform-048).

<a id="fr-xform-053"></a>

**FR-XFORM-053 — Validation diagnostics**  
Validation failure shall provide structured information sufficient to identify the affected target and the relevant validation problem without requiring callers to inspect implementation-specific parser objects.

## 15. Application-Level Acceptance

<a id="fr-xform-054"></a>

**FR-XFORM-054 — Acceptance follows source validation**  
Source-validation evidence supplied for application acceptance shall apply [Design §11.11](../appmanager-design-specification-v01.md#_11-11-workflow-results-failure-and-acceptance).

<a id="fr-xform-055"></a>

**FR-XFORM-055 — Acceptance criteria**  
Validated transformation acceptance shall conform to [Design §11.11](../appmanager-design-specification-v01.md#_11-11-workflow-results-failure-and-acceptance), [Design §9.9](../appmanager-design-specification-v01.md#_9-9-non-destructive-ownership-and-unmanaged-content). Workflow-specific postconditions remain applicable.

<a id="fr-xform-056"></a>

**FR-XFORM-056 — Technically valid but application-invalid result**  
Technically valid transformations that violate application criteria shall apply [FR-INV-034](application-invocation-functional-specification-v01.md#fr-inv-034).

<a id="fr-xform-057"></a>

**FR-XFORM-057 — Provider success is not application success**  
Transformation provider, parser, compiler, tool or AI completion shall apply [FR-INV-034](application-invocation-functional-specification-v01.md#fr-inv-034).

<a id="fr-xform-058"></a>

**FR-XFORM-058 — Acceptance information**  
Where a transformation is rejected after source-level validation, AppManager shall report the application-level reason sufficiently for the caller to distinguish source invalidity from policy, scope, safety, or intent rejection.

## 16. AI-Assisted Transformation

<a id="fr-xform-059"></a>

**FR-XFORM-059 — AI output is non-authoritative**  
AI-proposed source changes shall apply [Design §11.10](../appmanager-design-specification-v01.md#_11-10-ai-assisted-workflow).

<a id="fr-xform-060"></a>

**FR-XFORM-060 — AI proposals enter the normal control path**  
AI-proposed changes shall satisfy the applicable source-change contracts in §§5–15 of this specification; the contributing mechanism does not change their applicability.

<a id="fr-xform-061"></a>

**FR-XFORM-061 — AI cannot expand mutation authority**  
AI-selected source files, layers, repositories and regions shall apply [Design §11.10](../appmanager-design-specification-v01.md#_11-10-ai-assisted-workflow).

<a id="fr-xform-062"></a>

**FR-XFORM-062 — AI uncertainty shall not be hidden**  
Where an AI-generated proposal cannot be reconciled safely with recognised source structure or transformation intent, AppManager shall require review, disambiguation, or rejection rather than treat the proposal as a valid mutation by default.

## 17. Atomicity, Partial Changes, and Failure

<a id="fr-xform-063"></a>

**FR-XFORM-063 — Defined multi-target failure semantics**  
For a transformation that may affect more than one source target, the owning use case shall define whether the operation requires all-or-nothing behaviour or permits partial completion.

<a id="fr-xform-064"></a>

**FR-XFORM-064 — No silent partial success**  
Mixed applied/failed transformation results shall apply [FR-INV-036](application-invocation-functional-specification-v01.md#fr-inv-036).

<a id="fr-xform-065"></a>

**FR-XFORM-065 — Partial-change reporting**  
Completed, failed, skipped or unresolved transformation effects under partial completion shall apply [FR-INV-036](application-invocation-functional-specification-v01.md#fr-inv-036), [FR-INV-045](application-invocation-functional-specification-v01.md#fr-inv-045).

<a id="fr-xform-066"></a>

**FR-XFORM-066 — Failure state remains observable**  
A transformation failure shall leave sufficient structured outcome information for AppManager and the caller to understand whether source was unchanged, fully changed, partially changed, or left in an indeterminate state.

<a id="fr-xform-067"></a>

**FR-XFORM-067 — No implied rollback guarantee**  
Transformation rollback claims shall apply [FR-INV-046](application-invocation-functional-specification-v01.md#fr-inv-046).

## 18. Concurrency and Stale-Source Protection

<a id="fr-xform-068"></a>

**FR-XFORM-068 — Source assumptions must remain valid**  
Before applying a plan whose correctness depends on previously inspected source, AppManager shall detect or otherwise guard against material source changes that would make the plan unsafe or invalid.

<a id="fr-xform-069"></a>

**FR-XFORM-069 — Conflicting concurrent transformation**  
Where AppManager detects that another operation has materially changed the same transformation target, it shall fail, re-resolve, or otherwise apply an explicit conflict policy rather than overwrite the changed source blindly.

<a id="fr-xform-070"></a>

**FR-XFORM-070 — No stale-plan overwrite**  
Stale transformation plans targeting newer source shall apply [FR-XFORM-020](source-transformation-functional-specification-v01.md#fr-xform-020), [FR-XFORM-068](source-transformation-functional-specification-v01.md#fr-xform-068).

## 19. Diagnostics and Observable Outcomes

<a id="fr-xform-071"></a>

**FR-XFORM-071 — Transformation diagnostics**  
Source-transformation diagnostics shall distinguish materially different conditions where relevant, including unsupported structure, ambiguous target, scope violation, stale source, planning failure, execution failure, validation failure, application-level rejection, cancellation, and partial completion.

<a id="fr-xform-072"></a>

**FR-XFORM-072 — Target identification in diagnostics**  
Diagnostics shall identify the affected source target or bounded managed entity sufficiently for remediation while avoiding unnecessary disclosure of unrelated or sensitive source content.

<a id="fr-xform-073"></a>

**FR-XFORM-073 — Structured transformation result**  
Where source transformation is invoked through the Application Invocation Contract, the outcome shall expose machine-consumable information sufficient to distinguish planned, applied, validated, accepted, rejected, skipped, and partially completed states as relevant to the owning use case.

<a id="fr-xform-074"></a>

**FR-XFORM-074 — Human presentation is not the only evidence**  
Structured transformation status shall apply [FR-INV-021](application-invocation-functional-specification-v01.md#fr-inv-021).

## 20. Cancellation

<a id="fr-xform-075"></a>

**FR-XFORM-075 — Cancellation before mutation**  
If an operation is cancelled before source mutation begins, AppManager shall not intentionally apply the planned transformation.

<a id="fr-xform-076"></a>

**FR-XFORM-076 — Cancellation during mutation**  
Cancellation after transformation effects begin shall apply [FR-INV-031](application-invocation-functional-specification-v01.md#fr-inv-031), [FR-INV-032](application-invocation-functional-specification-v01.md#fr-inv-032).

<a id="fr-xform-077"></a>

**FR-XFORM-077 — Cancellation is not acceptance**  
Cancellation after lower-level transformation execution shall apply [FR-INV-031](application-invocation-functional-specification-v01.md#fr-inv-031).

## 21. Interaction-Mode Behaviour

<a id="fr-xform-078"></a>

**FR-XFORM-078 — Cross-mode equivalence**  
Transformation intent, scope, planning, validation and acceptance across supported modes shall apply [Design §4.6](../appmanager-design-specification-v01.md#_4-6-presentation-independence).

<a id="fr-xform-079"></a>

**FR-XFORM-079 — Host selection is context, not authority**  
Host-supplied files, editor selections/ranges, directories, layers and projects shall apply [FR-PROJ-006](managed-project-functional-specification-v01.md#fr-proj-006), [FR-PROJ-044](managed-project-functional-specification-v01.md#fr-proj-044), [FR-PROJ-047](managed-project-functional-specification-v01.md#fr-proj-047).

<a id="fr-xform-080"></a>

**FR-XFORM-080 — Headless transformation determinism**  
Headless transformation with supplied or resolvable intent, scope, configuration, approval and source context shall apply [FR-INV-020](application-invocation-functional-specification-v01.md#fr-inv-020).

<a id="fr-xform-081"></a>

**FR-XFORM-081 — Presentation independence**  
Transformation correctness across presentation surfaces shall apply [Design §4.6](../appmanager-design-specification-v01.md#_4-6-presentation-independence).

## 22. Relationship to Other Functional Specifications

### 22.1 Application Invocation

The Application Invocation Functional Specification owns shared invocation validation, confirmation semantics, dry-run representation, structured outcomes, diagnostics, cancellation, and partial-success conventions.

This specification refines how those concerns apply specifically to source inspection and transformation.

### 22.2 Managed Project

The Managed Project Functional Specification owns target-project resolution, managed-project context, managed scope, recognition-versus-mutation authority, exclusions, and protection of unmanaged content.

This specification consumes that authority when deciding whether a source target is eligible for transformation.

### 22.3 Configuration

The Configuration Functional Specification owns candidate-to-effective configuration semantics.

This specification consumes effective configuration where transformation policy, formatting, target selection, safety, or validation depends on configuration.

### 22.4 Domain Functional Specifications

Domain Functional Specifications own the source-changing use cases themselves, including what user or automation intent is being fulfilled and any domain-specific preconditions, postconditions, or safety constraints.

The owning requirements below define the applicable local contract.

## 23. Traceability

This specification primarily refines the following root Design Specification areas:

- Section 1 — controlled source transformation and protection against uncontrolled destructive change;
- Section 2 — structured transformation over unbounded textual mutation, correctness, transparency, and reversibility;
- Section 4 — interaction-mode and host-tool independence;
- Section 5 — Application Engine command/use-case authority and application-level outcomes;
- Section 6 — capability boundaries and delegated specialist execution;
- Section 7 — Code-Intelligence and Transformation Architecture;
- Section 9 — managed scope, ownership, unmanaged-content protection, and project context;
- Section 10 — domain behaviours that inspect, generate, document, or modify source;
- Section 11 — workflow sequencing and application-level acceptance;
- Section 12 — recognition-versus-action, bounded delegation, non-destructive operation, AI non-authority, and authoritative-versus-derived information;
- Section 14 — Functional Specification responsibility and downward traceability.

ADR-0001 selects the Version 1 primary implementation technology but does not alter these technology-independent Functional requirements.

## 24. Conformance Criteria

Conformance is assessed against the applicable requirement bodies in this specification and the canonical contracts they reference. The traceability section identifies the requirement groups; this section creates no additional acceptance checklist.

## 25. Downstream Specification Requirements

Detailed Design Specifications may define, among other things:

- scanner and recognition contracts;
- structural-fact representations;
- transformation strategy contracts;
- bounded transformation-plan schemas;
- plan validation and stale-plan detection;
- transformation-provider contracts;
- source-type-specific transformation mechanisms;
- parser, compiler, language-service, or AST integration boundaries;
- composite-source orchestration;
- validation contracts;
- application-acceptance result models;
- diff and preview representations;
- partial-change and rollback design;
- concurrency and optimistic-locking mechanisms;
- generated-region ownership markers;
- formatting-preservation policy;
- AI proposal normalization and validation boundaries.

Implementation Specifications may then map those Detailed Designs to Version 1 Node.js/TypeScript modules, parser libraries, file-writing mechanisms, source formats, language tooling, tests, concrete diagnostics, and provider integrations.
