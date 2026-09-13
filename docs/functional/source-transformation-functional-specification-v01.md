# AppManager Source Transformation Functional Specification

> **Status:** Version 1 Functional Specification
>
> **Functional authority:** This document defines the required observable behaviour by which AppManager inspects existing source, derives bounded transformation intent, controls and applies source mutations, validates transformed source, and accepts or rejects transformation outcomes at the application level. It refines, but does not override, the root Design Specification.
>
> **Governing sources:** `docs/project-documentation-guide-v01.md`, `docs/appmanager-design-specification-v01.md`
>
> **Related Functional authorities:** `docs/functional/application-invocation-functional-specification-v01.md`, `docs/functional/managed-project-functional-specification-v01.md`, `docs/functional/configuration-functional-specification-v01.md`
>
> **Planning source:** `docs/project_management/functional-specification-decomposition-plan-v01.md`

## 1. Purpose

This specification defines the shared Functional behaviour for controlled inspection and transformation of existing source within AppManager.

It establishes the behavioural separation between:

1. source recognition and inspection;
2. structural facts derived from source;
3. transformation intent;
4. bounded transformation planning;
5. AppManager policy, scope, safety, and approval decisions;
6. transformation execution;
7. source-level validation; and
8. application-level acceptance.

The central rule is:

> **Recognition is not mutation. A transformation plan is not an applied change. Source-level validity is not application-level acceptance.**

A second governing distinction is:

> **Generation creates a new artefact from governed inputs; transformation modifies existing source. AppManager shall not treat those paths as interchangeable.**

These distinctions are required to keep source changes bounded, reviewable, automatable, non-destructive where practical, and subordinate to AppManager application authority.

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

**FR-XFORM-001 — Shared transformation semantics**  
AppManager shall apply one coherent set of source-inspection and source-transformation semantics across commands, interaction modes, host integrations, and capability providers.

**FR-XFORM-002 — Delegated execution does not delegate authority**  
A parser, scanner, strategy, transformation mechanism, language service, external tool, AI provider, or other capability provider may perform specialist work, but shall not independently acquire authority over AppManager transformation intent, managed scope, safety policy, approval, or final application-level acceptance.

**FR-XFORM-003 — Application Engine acceptance authority**  
The Application Engine shall retain authority to determine whether a transformation outcome satisfies command intent, application policy, managed scope, safety requirements, and the overall workflow outcome.

## 5. Inspection and Recognition

**FR-XFORM-004 — Inspection before mutation where understanding is required**  
Where a source-changing operation depends on existing source structure, AppManager shall obtain sufficient source recognition or inspection information before authorising the mutation.

**FR-XFORM-005 — Recognition is non-mutating**  
Source recognition or inspection shall not modify source merely as a consequence of discovering or interpreting its structure.

**FR-XFORM-006 — Structural facts**  
Inspection shall expose AppManager-oriented structural facts sufficient for the owning use case without requiring commands or interaction adapters to consume parser-specific, compiler-specific, or provider-specific internal representations.

**FR-XFORM-007 — Recognised regions**  
Where relevant, inspection shall be capable of identifying the structural region, declaration, configuration entry, documentable element, or other bounded source target to which a requested operation applies.

**FR-XFORM-008 — Unsupported source**  
If AppManager cannot safely recognise the source structure required by an operation, it shall report the source or structure as unsupported rather than proceed with an unbounded mutation.

**FR-XFORM-009 — Ambiguous source structure**  
If multiple plausible structural targets exist and the owning semantics do not provide a deterministic choice, AppManager shall require permitted disambiguation or fail clearly rather than select an arbitrary target.

**FR-XFORM-010 — Conflicting structural interpretation**  
Where available recognition mechanisms produce materially conflicting interpretations that affect mutation safety or target selection, AppManager shall resolve the conflict through defined policy or fail before consequential mutation.

## 6. Transformation Intent

**FR-XFORM-011 — Intent derived from the use case**  
A source transformation shall be driven by an explicit AppManager command or use-case intent rather than by a transformation mechanism independently deciding what change should be made.

**FR-XFORM-012 — Intent is source-aware but application-owned**  
Transformation intent may be refined using structural facts and effective configuration, but its application meaning remains owned by AppManager rather than by the parser, strategy, provider, or edit mechanism.

**FR-XFORM-013 — Intent shall be bounded**  
Transformation intent shall identify the change sufficiently to distinguish the intended structural effect from unrelated source content.

**FR-XFORM-014 — No opportunistic unrelated edits**  
A source-changing operation shall not introduce unrelated cleanup, refactoring, reformatting, metadata changes, or other edits merely because the transformation mechanism is capable of doing so, unless the owning use case explicitly includes them.

## 7. Bounded Transformation Plans

**FR-XFORM-015 — Plan before consequential mutation**  
Where a source change is consequential, AppManager shall establish a bounded transformation plan before applying the mutation.

**FR-XFORM-016 — Plan contents**  
A bounded transformation plan shall identify, to the extent functionally relevant:

- the source target or targets;
- the intended structural change;
- the managed scope within which the change is permitted;
- relevant preconditions;
- relevant constraints or invariants;
- expected transformed outcome sufficiently for later validation.

Exact plan schemas belong to Detailed Design.

**FR-XFORM-017 — Plan is not execution**  
Creating or returning a transformation plan shall not itself apply the planned source mutation.

**FR-XFORM-018 — Plan scope cannot exceed use-case scope**  
A transformation plan shall not include targets outside the resolved managed scope or outside the source-changing authority granted by the owning use case.

**FR-XFORM-019 — No implicit plan expansion**  
Discovery of additional structurally related files, declarations, layers, repositories, or configuration regions shall not silently expand the transformation plan unless the owning use case explicitly permits such expansion and the resulting scope is made clear.

**FR-XFORM-020 — Plan invalidation on stale assumptions**  
If material source facts or preconditions on which a transformation plan depends are no longer true before execution, AppManager shall not blindly apply the stale plan. It shall re-resolve, reject, or otherwise handle the changed condition according to defined policy.

## 8. Managed Scope and Target Safety

**FR-XFORM-021 — Managed scope before mutation**  
A source transformation shall not begin consequential mutation until the relevant managed project and managed scope have been resolved in accordance with the Managed Project Functional Specification.

**FR-XFORM-022 — Target eligibility**  
A discovered source file or structural region shall be mutable only if it is both within the resolved managed scope and eligible for modification under the owning use case.

**FR-XFORM-023 — Recognition does not grant mutation authority**  
A source file, region, declaration, or configuration entry shall not become mutable merely because AppManager can inspect or recognise it.

**FR-XFORM-024 — Exclusions remain effective**  
Explicitly excluded files, directories, layers, repositories, generated regions, or other source targets shall remain excluded from mutation even if they are discoverable and structurally relevant.

**FR-XFORM-025 — Outside-scope protection**  
AppManager shall fail safely rather than modify a source target when it cannot establish that the target is within the permitted managed scope.

## 9. Preview, Dry Run, and Reviewability

**FR-XFORM-026 — Previewable intent where supported**  
Where a use case exposes preview or dry-run behaviour, AppManager shall present the proposed transformation without applying the source mutation.

**FR-XFORM-027 — Preview reflects bounded plan**  
A preview shall represent the bounded transformation plan or its expected source effects rather than a separate transformation path with independent semantics.

**FR-XFORM-028 — Dry run preserves source**  
Dry-run execution shall not intentionally persist the source mutations being evaluated.

**FR-XFORM-029 — Preview uncertainty**  
If AppManager cannot determine a reliable preview because source structure, provider behaviour, or required context is unresolved, it shall report that limitation rather than present speculative effects as certain.

## 10. Confirmation and Approval

**FR-XFORM-030 — Consequential confirmation where required**  
Where the owning Functional Specification or application policy requires confirmation for a consequential source change, AppManager shall obtain that confirmation before applying the mutation.

**FR-XFORM-031 — Confirmation applies to the intended change**  
Confirmation shall relate to the relevant transformation intent and scope. Materially changing the target or effect after confirmation shall require re-evaluation and, where applicable, renewed confirmation.

**FR-XFORM-032 — Headless approval semantics**  
Headless operation shall not depend on an interactive prompt. Required approval or authorization shall be supplied through permitted non-interactive invocation semantics or the operation shall fail clearly.

## 11. Transformation Execution

**FR-XFORM-033 — Execute approved bounded plans**  
A transformation mechanism shall apply only a transformation plan that has passed the applicable AppManager policy, scope, safety, and approval checks.

**FR-XFORM-034 — Mechanism is subordinate to plan**  
The transformation mechanism shall not independently broaden the requested mutation beyond the approved plan.

**FR-XFORM-035 — Structure-aware execution**  
Where the source format provides meaningful structure and suitable source-aware mechanisms exist, AppManager shall prefer structure-aware modification over unrestricted textual replacement for transformations whose correctness depends on that structure.

**FR-XFORM-036 — No fragile global replacement as default**  
AppManager shall not use unbounded global text replacement as the default mechanism for code-aware or structure-dependent mutations where such replacement could affect unrelated content.

**FR-XFORM-037 — Source-format-appropriate mechanism**  
Different source formats may use different transformation mechanisms provided they preserve the same AppManager-level intent, scope, safety, validation, and acceptance semantics.

**FR-XFORM-038 — Composite-source coordination**  
Where one source file contains multiple languages or structural regions, AppManager may coordinate specialised mechanisms, but the composed transformation shall remain one coherent bounded operation from the perspective of the owning use case.

## 12. Preservation and Non-Destructive Behaviour

**FR-XFORM-039 — Preserve unaffected content**  
Source transformations shall preserve unrelated user-authored content wherever practical.

**FR-XFORM-040 — Preserve comments and formatting where practical**  
Where the transformation mechanism permits, AppManager shall avoid unnecessarily discarding or rewriting comments, formatting, ordering, whitespace conventions, or other unaffected source characteristics.

**FR-XFORM-041 — Prefer bounded edits over regeneration**  
When modifying existing source, AppManager shall prefer a bounded structural edit over full-file regeneration where the bounded edit can safely achieve the intended result.

**FR-XFORM-042 — No ownership by rewrite**  
AppManager shall not treat a file as wholly AppManager-owned merely because it performs a bounded transformation within that file.

**FR-XFORM-043 — User content remains protected**  
A transformation shall not overwrite unrelated user-authored material merely to simplify implementation unless the owning use case explicitly defines replacement of that material and the operation satisfies applicable safety requirements.

## 13. Generation Versus Mutation

**FR-XFORM-044 — Generation/mutation distinction**  
AppManager shall distinguish creation of new artefacts through generation from modification of existing source through transformation.

**FR-XFORM-045 — Generation does not imply mutation authority**  
A generation capability that can create a complete new file shall not thereby gain authority to replace an existing user-authored file without the mutation semantics, scope, safety, and approval required for that replacement.

**FR-XFORM-046 — Existing source is not a blank template target**  
Where a file already exists and contains user-managed content, AppManager shall not treat it as equivalent to generating a new file unless the owning use case explicitly defines replacement semantics.

**FR-XFORM-047 — Generated-region mutation**  
Where AppManager owns or recognises a generated region within a larger user-authored file, mutation authority shall remain bounded to the region or scope established by the owning use case and applicable ownership semantics.

## 14. Source-Level Validation

**FR-XFORM-048 — Validate transformed source**  
After a consequential transformation, AppManager shall perform the source-level validation required by the source type and owning use case before treating the transformation as successfully realised.

**FR-XFORM-049 — Validation may be multi-dimensional**  
Source-level validation may evaluate structural, syntactic, semantic, schema, type, transformation-specific, or other source-aware constraints as appropriate to the operation.

**FR-XFORM-050 — Validation is distinct from execution**  
Successful completion of the edit mechanism shall not itself prove that the transformed source is valid.

**FR-XFORM-051 — Validation against intended structural outcome**  
Where relevant, validation shall confirm not only that the source remains parseable or syntactically valid, but also that the intended bounded structural effect was achieved.

**FR-XFORM-052 — Validation failure**  
If required source-level validation fails, AppManager shall not report the transformation as fully successful.

**FR-XFORM-053 — Validation diagnostics**  
Validation failure shall provide structured information sufficient to identify the affected target and the relevant validation problem without requiring callers to inspect implementation-specific parser objects.

## 15. Application-Level Acceptance

**FR-XFORM-054 — Acceptance follows source validation**  
Source-level validity shall be treated as an input to application-level acceptance, not as the final application outcome.

**FR-XFORM-055 — Acceptance criteria**  
Application-level acceptance shall evaluate whether the validated transformation satisfies, as applicable:

- command or use-case intent;
- managed scope;
- application policy;
- safety constraints;
- effective configuration;
- ownership and non-destructive requirements;
- workflow-specific postconditions.

**FR-XFORM-056 — Technically valid but application-invalid result**  
AppManager shall be able to reject or mark unsuccessful a source transformation that is technically valid but violates command intent, managed scope, policy, safety, ownership, or workflow requirements.

**FR-XFORM-057 — Provider success is not application success**  
A transformation provider, parser, compiler, external tool, or AI service reporting success shall not by itself determine AppManager application-level success.

**FR-XFORM-058 — Acceptance information**  
Where a transformation is rejected after source-level validation, AppManager shall report the application-level reason sufficiently for the caller to distinguish source invalidity from policy, scope, safety, or intent rejection.

## 16. AI-Assisted Transformation

**FR-XFORM-059 — AI output is non-authoritative**  
AI-generated or AI-proposed source changes shall not become authoritative merely because an AI provider produced them.

**FR-XFORM-060 — AI proposals enter the normal control path**  
Where AI contributes a proposed source change, the proposal shall be subject to the same applicable managed scope, transformation planning, approval, execution, source validation, and application-level acceptance requirements as other transformation inputs.

**FR-XFORM-061 — AI cannot expand mutation authority**  
An AI provider shall not gain authority to modify additional files, layers, repositories, or source regions beyond the scope established by the AppManager use case.

**FR-XFORM-062 — AI uncertainty shall not be hidden**  
Where an AI-generated proposal cannot be reconciled safely with recognised source structure or transformation intent, AppManager shall require review, disambiguation, or rejection rather than treat the proposal as a valid mutation by default.

## 17. Atomicity, Partial Changes, and Failure

**FR-XFORM-063 — Defined multi-target failure semantics**  
For a transformation that may affect more than one source target, the owning use case shall define whether the operation requires all-or-nothing behaviour or permits partial completion.

**FR-XFORM-064 — No silent partial success**  
If some planned changes are applied and others fail, AppManager shall not report unqualified success.

**FR-XFORM-065 — Partial-change reporting**  
Where partial transformation is permitted or occurs despite failure, AppManager shall report which targets or planned effects succeeded, failed, were skipped, or remain unresolved to the extent needed for safe recovery.

**FR-XFORM-066 — Failure state remains observable**  
A transformation failure shall leave sufficient structured outcome information for AppManager and the caller to understand whether source was unchanged, fully changed, partially changed, or left in an indeterminate state.

**FR-XFORM-067 — No implied rollback guarantee**  
Unless the owning Functional Specification explicitly requires rollback, AppManager shall not imply that every failed transformation can be automatically restored. Any rollback or recovery guarantee shall be specified deliberately.

## 18. Concurrency and Stale-Source Protection

**FR-XFORM-068 — Source assumptions must remain valid**  
Before applying a plan whose correctness depends on previously inspected source, AppManager shall detect or otherwise guard against material source changes that would make the plan unsafe or invalid.

**FR-XFORM-069 — Conflicting concurrent transformation**  
Where AppManager detects that another operation has materially changed the same transformation target, it shall fail, re-resolve, or otherwise apply an explicit conflict policy rather than overwrite the changed source blindly.

**FR-XFORM-070 — No stale-plan overwrite**  
A stale transformation plan shall not be used to overwrite newer source merely because the originally planned edit was once valid.

## 19. Diagnostics and Observable Outcomes

**FR-XFORM-071 — Transformation diagnostics**  
Source-transformation diagnostics shall distinguish materially different conditions where relevant, including unsupported structure, ambiguous target, scope violation, stale source, planning failure, execution failure, validation failure, application-level rejection, cancellation, and partial completion.

**FR-XFORM-072 — Target identification in diagnostics**  
Diagnostics shall identify the affected source target or bounded managed entity sufficiently for remediation while avoiding unnecessary disclosure of unrelated or sensitive source content.

**FR-XFORM-073 — Structured transformation result**  
Where source transformation is invoked through the Application Invocation Contract, the outcome shall expose machine-consumable information sufficient to distinguish planned, applied, validated, accepted, rejected, skipped, and partially completed states as relevant to the owning use case.

**FR-XFORM-074 — Human presentation is not the only evidence**  
A successful or failed transformation shall not be represented solely through human-readable terminal text where structured invocation is supported.

## 20. Cancellation

**FR-XFORM-075 — Cancellation before mutation**  
If an operation is cancelled before source mutation begins, AppManager shall not intentionally apply the planned transformation.

**FR-XFORM-076 — Cancellation during mutation**  
If cancellation occurs after mutation has begun, AppManager shall report the resulting transformation state according to the operation's atomicity and partial-change semantics rather than assume the source is unchanged.

**FR-XFORM-077 — Cancellation is not acceptance**  
A cancelled transformation shall not be reported as an accepted successful source change merely because some lower-level execution completed.

## 21. Interaction-Mode Behaviour

**FR-XFORM-078 — Cross-mode equivalence**  
TUI, Headless, GUI, IDE/host-tool, CI, automation-agent, and future supported invocation paths shall use equivalent transformation intent, scope, safety, planning, validation, and application-acceptance semantics.

**FR-XFORM-079 — Host selection is context, not authority**  
A file, selection, editor range, directory, layer, or project supplied by an IDE or host tool shall be treated as invocation context subject to AppManager target and scope validation rather than as independent mutation authority.

**FR-XFORM-080 — Headless transformation determinism**  
A Headless transformation shall not depend on interaction-only decisions when all required intent, scope, configuration, approval, and source context can be supplied or resolved non-interactively.

**FR-XFORM-081 — Presentation independence**  
Transformation correctness shall not depend on terminal prompt order, GUI widget state, editor-specific representation, or other presentation-only behaviour.

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

They may add stricter transformation requirements but shall not weaken the shared separation between recognition, planning, execution, source validation, and application-level acceptance.

## 23. Legacy Requirement Disposition

The following legacy code-intelligence, scanner, strategy, and transformation concepts are retained at the Functional level:

| Legacy concept | Functional disposition |
|---|---|
| existing source and generated source require different mechanisms | `FR-XFORM-044`–`FR-XFORM-047` |
| scanners recognise structure but do not own mutation policy | `FR-XFORM-004`–`FR-XFORM-010` |
| strategies determine bounded source-aware transformation intent/plans | `FR-XFORM-011`–`FR-XFORM-020` |
| transformation mechanism applies approved change but does not own application policy | `FR-XFORM-033`–`FR-XFORM-038` |
| inspection and mutation are separate | `FR-XFORM-004`–`FR-XFORM-005`, `FR-XFORM-015`–`FR-XFORM-017` |
| transformation plans should be reviewable before mutation | `FR-XFORM-015`–`FR-XFORM-020`, `FR-XFORM-026`–`FR-XFORM-029` |
| preserve unaffected source where practical | `FR-XFORM-039`–`FR-XFORM-043` |
| structured formats should use source-aware mechanisms | `FR-XFORM-035`–`FR-XFORM-038` |
| transformed source requires validation | `FR-XFORM-048`–`FR-XFORM-053` |
| source-valid result may still fail at application level | `FR-XFORM-054`–`FR-XFORM-058` |
| multi-target operations require explicit atomicity/partial reporting semantics | `FR-XFORM-063`–`FR-XFORM-067` |
| unsupported and ambiguous structures must be explicit | `FR-XFORM-008`–`FR-XFORM-010`, `FR-XFORM-071` |
| AI output is non-authoritative until validated and controlled | `FR-XFORM-059`–`FR-XFORM-062` |

The following legacy material is not propagated as Functional authority:

- scanner class hierarchies;
- exact token contracts and token enums;
- concrete strategy classes and source-type registries;
- exact parser or AST libraries;
- exact edit-plan object structures;
- concrete code-service APIs;
- TypeScript interfaces and method signatures;
- concrete orchestrator classes;
- source-module paths;
- concrete parser/compiler/language-service representations;
- exact file-writing, temporary-file, backup, rollback, or formatting mechanisms;
- concrete validation toolchains;
- provider-specific AI patch formats.

Those concerns require deliberate Detailed Design or Implementation treatment.

## 24. Traceability

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

This specification also reconciles the source-inspection and transformation Functional material identified in `docs/archive/design/appmanager-design-reconciliation-audit-v01.md` and retains useful behavioural principles from the historical scanner and strategy documentation without treating those legacy files as current architectural authority.

ADR-0001 selects the Version 1 primary implementation technology but does not alter these technology-independent Functional requirements.

## 25. Conformance Criteria

An implementation conforms to this Functional Specification only if all of the following are true:

1. recognition and inspection do not implicitly mutate source;
2. transformations are driven by AppManager use-case intent rather than edit mechanisms inventing work;
3. consequential source changes use bounded plans before mutation;
4. transformation targets remain inside resolved managed scope and applicable ownership rules;
5. preview or dry-run paths do not intentionally persist source changes;
6. consequential confirmation or approval is respected where required;
7. transformation mechanisms remain subordinate to approved intent and scope;
8. source-aware mutation is preferred over unsafe unbounded textual replacement where structure matters;
9. unrelated user-authored content is preserved wherever practical;
10. generation and mutation remain distinct behaviours;
11. transformed source undergoes required source-level validation;
12. source-level validity does not automatically equal application-level acceptance;
13. technically valid but policy-, scope-, safety-, ownership-, or intent-invalid transformations can be rejected;
14. AI-generated changes remain non-authoritative until they pass the normal control path;
15. multi-target or partial transformations expose explicit completion state;
16. stale or concurrently changed source is not blindly overwritten by an obsolete plan;
17. structured diagnostics distinguish planning, execution, validation, and application-acceptance failures where relevant;
18. cancellation does not produce false success semantics;
19. interaction modes and host integrations do not redefine transformation policy;
20. specialist capability providers do not acquire AppManager application authority merely by executing transformations.

## 26. Downstream Specification Requirements

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

Implementation Specifications may then map those Detailed Designs to Version 1 Node.js/TypeScript modules, parser libraries, file-writing mechanisms, source formats, language tooling, tests, concrete diagnostics, provider integrations, and migration state.
