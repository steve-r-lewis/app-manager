# AppManager Managed Project Functional Specification

> **Status:** Version 1 Functional Specification
>
> **Functional authority:** This document defines the required observable behaviour by which AppManager identifies, resolves, validates, represents, and scopes the target project it manages. It refines, but does not override, the root Design Specification.
>
> **Governing sources:** [Project Documentation Guide](../project-documentation-guide-v01.md), [AppManager Design Specification](../appmanager-design-specification-v01.md)
>
> **Historical planning provenance (non-normative):** [docs/project_management/functional-specification-decomposition-plan-v01.md](../project_management/functional-specification-decomposition-plan-v01.md)

## 1. Purpose

This specification defines the common functional behaviour by which AppManager determines **which project is being managed**, **which project entities belong to the relevant managed project context**, and **which of those entities are permitted targets of a particular operation**.

It is the shared Functional authority for managed-project context and managed-scope semantics. Domain Functional Specifications define what individual AppManager use cases do; this specification defines the common project-understanding and targeting behaviour those use cases consume.

## 2. Scope

This specification owns observable behaviour for:

- target-project identification;
- project-root resolution;
- managed-project-context resolution;
- root Nuxt application recognition;
- managed layer recognition;
- repository and repository-relationship recognition;
- AppManager-owned management-resource recognition;
- project-context validation;
- ambiguity, conflict, incompleteness, and unsupported-context handling;
- deterministic project resolution for Headless operation;
- operation-specific managed-scope resolution;
- inclusion and exclusion of project entities from an operation;
- distinction between recognised, targetable, and mutable resources;
- root-application, layer, repository, file, and project-wide targeting;
- cross-layer and cross-repository scope semantics;
- host-context and invocation-context contribution to project resolution;
- protection of unmanaged and unrelated user-authored resources;
- AppManager-owned resource boundaries;
- project-context information made available to commands and callers where functionally relevant.

## 3. Out of Scope

The following are deliberately below the Functional level unless a later accepted architectural decision elevates them:

- concrete directory names other than already adopted architectural conventions;
- filesystem traversal algorithms;
- repository marker files;
- exact Nuxt-recognition heuristics;
- concrete workspace formats;
- concrete metadata schemas;
- concrete repository graph data structures;
- TypeScript interfaces or class designs;
- resolver implementations;
- cache formats;
- persistence mechanisms;
- Git worktree, submodule, and remote implementation details;
- source paths, package structure, and runtime wiring.

These concerns belong to Detailed Design or Implementation Specifications.

## 4. Functional Model

A project-dependent AppManager operation is conceptually:

```text
invocation / host context / environment
    -> candidate project evidence
    -> target-project identification
    -> project-root resolution
    -> managed-project-context resolution
    -> context validation
    -> command-specific managed-scope resolution
    -> scope / ownership / safety evaluation
    -> operation execution
    -> structured outcome
```

The sequence above defines functional responsibility and observable behaviour, not implementation topology.

### 4.1 Application authority

The requirements below bind this concern to its shared and domain-specific owners.

<a id="fr-proj-001"></a>

**FR-PROJ-001 — Single project semantics**  
All project-dependent invocation paths shall apply [Design §4.6](../appmanager-design-specification-v01.md#_4-6-presentation-independence).

<a id="fr-proj-002"></a>

**FR-PROJ-002 — Candidate evidence is not authority**  
Project evidence from locations, repositories, host selections, configuration, markers and adapters shall conform to [Design §9.6](../appmanager-design-specification-v01.md#_9-6-project-discovery-and-context-resolution).

## 5. Target Project Identification

### 5.1 Target project

<a id="fr-proj-003"></a>

**FR-PROJ-003 — Target-project identity**  
Project-dependent target identity before reliance on project-specific behaviour shall conform to [Design §9.6](../appmanager-design-specification-v01.md#_9-6-project-discovery-and-context-resolution).

<a id="fr-proj-004"></a>

**FR-PROJ-004 — Explicit target preference**  
Where the invocation explicitly identifies a target project in a valid form, AppManager shall treat that information as project-resolution input and validate it against the managed-project model rather than silently substituting an unrelated project.

### 5.2 Invocation location and host context

<a id="fr-proj-005"></a>

**FR-PROJ-005 — Invocation-location evidence**  
The location from which AppManager is invoked may contribute evidence toward target-project resolution, but invocation location alone shall not define the managed project where stronger or conflicting project evidence exists.

<a id="fr-proj-006"></a>

**FR-PROJ-006 — Host-context evidence**  
IDE, editor, GUI, automation, or other host integrations may supply project, file, directory, layer, or repository context. AppManager shall translate such context into AppManager project semantics and validate it before use.

### 5.3 No hidden project switching

<a id="fr-proj-007"></a>

**FR-PROJ-007 — No silent project substitution**  
If supplied and resolved project evidence identifies materially different candidate projects, AppManager shall not silently switch to one candidate merely to continue execution.

The ambiguity shall be resolved explicitly or the operation shall fail clearly.

## 6. Project Root Resolution

### 6.1 Project root

<a id="fr-proj-008"></a>

**FR-PROJ-008 — Project-root resolution**  
AppManager shall resolve a project root for operations whose semantics require one.

The resolved project root shall represent the root of the target project rather than merely the caller's current working directory.

<a id="fr-proj-009"></a>

**FR-PROJ-009 — Nested invocation**  
Invocation from a file, subdirectory, layer, repository subtree, or other nested location shall not require the caller to manually relocate to the project root when AppManager can deterministically resolve the intended target project from supported evidence.

### 6.2 Invalid roots

<a id="fr-proj-010"></a>

**FR-PROJ-010 — Invalid project root**  
If a supplied or discovered project root is invalid, unsupported, inaccessible, or inconsistent with the requested operation, AppManager shall reject it with a structured diagnostic rather than treating the path as a valid managed project by default.

## 7. Managed Project Context

### 7.1 Coherent context

<a id="fr-proj-011"></a>

**FR-PROJ-011 — Managed-project context**

Coherent project-context resolution before dependence on project identity or structure shall conform to [Design §9.6](../appmanager-design-specification-v01.md#_9-6-project-discovery-and-context-resolution).

<a id="fr-proj-012"></a>

**FR-PROJ-012 — Context contents**

Where relevant and available, managed-project context shall represent the entities/resources in [Design §9.1](../appmanager-design-specification-v01.md#_9-1-managed-project-model), together with project identity/root and configuration scope, using the representation boundary in [Design §9.2](../appmanager-design-specification-v01.md#_9-2-managed-project-context).

### 7.2 Context completeness

<a id="fr-proj-013"></a>

**FR-PROJ-013 — Required context completeness**  
Project-dependent effects with unresolved target or safety context shall conform to [Design §9.6](../appmanager-design-specification-v01.md#_9-6-project-discovery-and-context-resolution).

<a id="fr-proj-014"></a>

**FR-PROJ-014 — Operation-specific completeness**  
Managed-project context need only be complete for the requirements of the requested operation. AppManager shall not require unrelated project facts merely because they could theoretically be discovered.

### 7.3 Context reuse

<a id="fr-proj-015"></a>

**FR-PROJ-015 — Consistent context within an operation**  
One coherent target-project interpretation across participating commands and capabilities shall conform to [Design §9.2](../appmanager-design-specification-v01.md#_9-2-managed-project-context).

## 8. Root Application and Managed Layers

### 8.1 Root application

<a id="fr-proj-016"></a>

**FR-PROJ-016 — Root-application recognition**  
Where the target project contains a supported root Nuxt application, AppManager shall represent it distinctly within the managed-project context.

### 8.2 Managed layers

<a id="fr-proj-017"></a>

**FR-PROJ-017 — Managed-layer recognition**  
AppManager shall be able to recognise supported Nuxt layers that form part of the target project's managed application structure.

<a id="fr-proj-018"></a>

**FR-PROJ-018 — Layer identity**  
Each managed layer shall be distinguishable sufficiently for commands and callers to select the intended layer without depending solely on presentation order or incidental filesystem position.

<a id="fr-proj-019"></a>

**FR-PROJ-019 — Layer independence**  
Managed-layer independence shall conform to [Design §9.3](../appmanager-design-specification-v01.md#_9-3-root-application-and-managed-layers).

### 8.3 Root/layer distinction

<a id="fr-proj-020"></a>

**FR-PROJ-020 — Root and layer distinction**  
Root/layer distinction despite nested filesystem or repository layouts shall conform to [Design §9.3](../appmanager-design-specification-v01.md#_9-3-root-application-and-managed-layers).

## 9. Project Topology and Resource Relationships

<a id="fr-proj-021"></a>

**FR-PROJ-021 — Project topology**  
Representation of relationships required by project operations shall conform to [Design §9.4](../appmanager-design-specification-v01.md#_9-4-project-topology-and-resource-relationships).

<a id="fr-proj-022"></a>

**FR-PROJ-022 — Semantic relationships over directory containment**  
Directory-containment evidence in project topology shall conform to [Design §9.4](../appmanager-design-specification-v01.md#_9-4-project-topology-and-resource-relationships).

<a id="fr-proj-023"></a>

**FR-PROJ-023 — No uniform-tree assumption**  
Non-uniform directory/repository layouts shall conform to [Design §9.1](../appmanager-design-specification-v01.md#_9-1-managed-project-model).

## 10. Repository Relationships

### 10.1 Repository recognition

<a id="fr-proj-024"></a>

**FR-PROJ-024 — Repository recognition**  
Where repositories are relevant to the requested operation, AppManager shall identify the repository or repositories associated with the applicable managed project entities.

<a id="fr-proj-025"></a>

**FR-PROJ-025 — Repository topology is not project identity**  
Repository topology and Nuxt project identity shall conform to [Design §9.3](../appmanager-design-specification-v01.md#_9-3-root-application-and-managed-layers).

### 10.2 Multi-repository projects

<a id="fr-proj-026"></a>

**FR-PROJ-026 — Multi-repository support**  
Multi-repository and nested repository support shall conform to [Design §9.5](../appmanager-design-specification-v01.md#_9-5-repository-relationships).

<a id="fr-proj-027"></a>

**FR-PROJ-027 — Repository targeting by project scope**  
Repository relevance for resolved project/root/layer scope shall conform to [Design §9.5](../appmanager-design-specification-v01.md#_9-5-repository-relationships).

### 10.3 Repository ambiguity

<a id="fr-proj-028"></a>

**FR-PROJ-028 — Ambiguous repository association**  
If AppManager cannot determine which repository relationship is applicable to a consequential operation, it shall require explicit disambiguation or fail clearly rather than mutate or synchronise an arbitrary repository.

## 11. Project Discovery and Context Resolution

### 11.1 Approved evidence classes

<a id="fr-proj-029"></a>

**FR-PROJ-029 — Project-resolution evidence**

Project-context candidate evidence and discovery mechanisms shall conform to [Design §9.6](../appmanager-design-specification-v01.md#_9-6-project-discovery-and-context-resolution).

### 11.2 Deterministic resolution

<a id="fr-proj-030"></a>

**FR-PROJ-030 — Deterministic resolution**  
Given materially equivalent candidate evidence and effective configuration, project-context resolution shall produce materially equivalent results.

<a id="fr-proj-031"></a>

**FR-PROJ-031 — Headless project resolution**  
Headless project-context resolution shall apply [FR-INV-020](application-invocation-functional-specification-v01.md#fr-inv-020).

### 11.3 Interactive disambiguation

<a id="fr-proj-032"></a>

**FR-PROJ-032 — Interactive disambiguation**  
Where multiple valid candidate project contexts remain and interaction is permitted, an interactive adapter may assist the user in selecting among those candidates.

The resulting selection shall be validated under the same AppManager project semantics as an explicitly supplied non-interactive target.

### 11.4 Ambiguity and conflict

<a id="fr-proj-033"></a>

**FR-PROJ-033 — Ambiguous context**  
If AppManager cannot resolve one sufficiently coherent managed-project context from the available evidence, the operation shall fail or request permitted disambiguation rather than proceed through a hidden assumption.

<a id="fr-proj-034"></a>

**FR-PROJ-034 — Conflicting evidence**  
When project evidence conflicts, AppManager shall apply defined project-resolution policy and report unresolved conflicts that materially affect target identity, scope, or safety.

### 11.5 Insufficient and unsupported context

<a id="fr-proj-035"></a>

**FR-PROJ-035 — Insufficient context**  
If required project information cannot be resolved, AppManager shall produce a structured failure indicating which project requirement remains unresolved where that information can be determined safely.

<a id="fr-proj-036"></a>

**FR-PROJ-036 — Unsupported project structure**  
If the target project's structure is recognised but unsupported for the requested operation, AppManager shall distinguish that condition from both an unknown project and a generic execution failure.

## 12. Managed Scope

### 12.1 Scope definition

<a id="fr-proj-037"></a>

**FR-PROJ-037 — Managed-scope resolution**  
Consequential operation targeting shall apply [Design §9.7](../appmanager-design-specification-v01.md#_9-7-managed-scope-and-operation-targeting).

<a id="fr-proj-038"></a>

**FR-PROJ-038 — Operation-specific scope**  
Managed scope shall be derived from the requested command semantics, explicit caller intent, resolved managed-project context, effective configuration, applicable exclusions, and AppManager policy.

### 12.2 Supported scope forms

<a id="fr-proj-039"></a>

**FR-PROJ-039 — Scope forms**

Command-supported scope forms shall conform to [Design §9.7](../appmanager-design-specification-v01.md#_9-7-managed-scope-and-operation-targeting).

### 12.3 Scope clarity

<a id="fr-proj-040"></a>

**FR-PROJ-040 — Consequential scope clarity**  
Managed scope before mutation, remote change, history-changing action, deletion, overwrite or other significant effects shall conform to [Design §9.7](../appmanager-design-specification-v01.md#_9-7-managed-scope-and-operation-targeting).

### 12.4 Scope narrowing

<a id="fr-proj-041"></a>

**FR-PROJ-041 — Scope narrowing**  
A command or caller may narrow an otherwise broader valid scope where the command permits such targeting. Narrowing shall not implicitly expand any other part of the operation.

<a id="fr-proj-042"></a>

**FR-PROJ-042 — No implicit scope expansion**  
AppManager shall not silently broaden an explicitly bounded scope merely because additional related resources were discovered.

## 13. Recognition, Targetability, and Mutation Authority

### 13.1 Recognition is not authority

<a id="fr-proj-043"></a>

**FR-PROJ-043 — Recognition does not grant mutation authority**  
Recognised resources and consequential targetability shall conform to [Design §9.9](../appmanager-design-specification-v01.md#_9-9-non-destructive-ownership-and-unmanaged-content).

### 13.2 Targetability

<a id="fr-proj-044"></a>

**FR-PROJ-044 — Targetability evaluation**  
Before a consequential operation acts on a recognised resource, AppManager shall determine that the resource belongs to the resolved managed scope and is an eligible target for that command.

### 13.3 Ownership and permission

<a id="fr-proj-045"></a>

**FR-PROJ-045 — Ownership-sensitive behaviour**  
Ownership distinctions affecting whether/how a resource may be modified shall conform to [Design §9.9](../appmanager-design-specification-v01.md#_9-9-non-destructive-ownership-and-unmanaged-content).

<a id="fr-proj-046"></a>

**FR-PROJ-046 — No adjacent-resource ownership assumption**  
Resources adjacent to AppManager-owned management data shall conform to [Design §9.8](../appmanager-design-specification-v01.md#_9-8-appmanager-owned-management-area-and-project-coexistence).

## 14. Inclusion, Exclusion, and Unmanaged Content

<a id="fr-proj-047"></a>

**FR-PROJ-047 — Explicit exclusion**  
Where project or command semantics define excluded resources or entities, those exclusions shall remain effective even when the excluded resources are discoverable within the project topology.

<a id="fr-proj-048"></a>

**FR-PROJ-048 — Unmanaged resource protection**  
Protection of accessible resources outside resolved managed scope shall conform to [Design §9.9](../appmanager-design-specification-v01.md#_9-9-non-destructive-ownership-and-unmanaged-content).

<a id="fr-proj-049"></a>

**FR-PROJ-049 — Preserve unrelated content**  
Preservation of unrelated authored/unmanaged content within project-wide operations shall conform to [Design §9.9](../appmanager-design-specification-v01.md#_9-9-non-destructive-ownership-and-unmanaged-content).

## 15. AppManager-Owned Management Resources

<a id="fr-proj-050"></a>

**FR-PROJ-050 — Management-resource recognition**  
Distinguishing management resources from authored application resources where functionally relevant shall conform to [Design §9.9](../appmanager-design-specification-v01.md#_9-9-non-destructive-ownership-and-unmanaged-content).

<a id="fr-proj-051"></a>

**FR-PROJ-051 — Coexistence with project structure**  
AppManager resource coexistence shall conform to [Design §9.8](../appmanager-design-specification-v01.md#_9-8-appmanager-owned-management-area-and-project-coexistence).

<a id="fr-proj-052"></a>

**FR-PROJ-052 — Management data does not redefine project structure**  
AppManager-owned metadata may contribute to project-context resolution but shall not silently override contradictory project reality or redefine user-owned structure without governed application semantics.

## 16. Context and Scope Exposure

### 16.1 Command consumption

<a id="fr-proj-053"></a>

**FR-PROJ-053 — AppManager-oriented project information**  
Project information supplied to commands and shared capabilities shall conform to [Design §9.2](../appmanager-design-specification-v01.md#_9-2-managed-project-context).

### 16.2 Caller-visible context

<a id="fr-proj-054"></a>

**FR-PROJ-054 — Observable target information**  
Where target identity or managed scope materially affects a caller's understanding, safety decision, automation behaviour, or interpretation of the result, AppManager shall expose sufficient structured information to identify the resolved target and scope.

Exact schemas belong to Detailed Design.

### 16.3 Diagnostics

<a id="fr-proj-055"></a>

**FR-PROJ-055 — Project-resolution diagnostics**  
Failures or warnings involving target-project resolution, ambiguity, unsupported structure, inaccessible resources, or scope shall provide diagnostics sufficient to distinguish the material cause without requiring the caller to infer it from incidental filesystem or terminal behaviour.

## 17. Interaction-Mode Behaviour

<a id="fr-proj-056"></a>

**FR-PROJ-056 — Cross-mode project equivalence**  
Project identity, context and scope across supported modes shall apply [Design §4.6](../appmanager-design-specification-v01.md#_4-6-presentation-independence).

<a id="fr-proj-057"></a>

**FR-PROJ-057 — Host selection is contextual input**  
Host-selected files, directories, layers and repositories shall apply [FR-PROJ-006](managed-project-functional-specification-v01.md#fr-proj-006), [FR-PROJ-044](managed-project-functional-specification-v01.md#fr-proj-044), [FR-PROJ-047](managed-project-functional-specification-v01.md#fr-proj-047).

<a id="fr-proj-058"></a>

**FR-PROJ-058 — No interaction-only project semantics**  
Project-dependent use cases suitable for automation shall apply [FR-INV-020](application-invocation-functional-specification-v01.md#fr-inv-020).

## 18. Safety and Consequential Operations

<a id="fr-proj-059"></a>

**FR-PROJ-059 — Scope before consequential effects**  
Project-context and scope readiness before effects shall apply [Design §9.6](../appmanager-design-specification-v01.md#_9-6-project-discovery-and-context-resolution), [Design §9.7](../appmanager-design-specification-v01.md#_9-7-managed-scope-and-operation-targeting).

<a id="fr-proj-060"></a>

**FR-PROJ-060 — Scope failure is not partial authorisation**  
Failure to resolve part of a requested consequential scope shall not implicitly authorise execution against the subset that happened to resolve unless the command's Functional Specification explicitly permits partial-scope execution and reports it as such.

<a id="fr-proj-061"></a>

**FR-PROJ-061 — Discovery failure shall fail safe**  
When project-context or scope uncertainty could cause AppManager to act on the wrong project, repository, layer, file, or external target, AppManager shall fail safely rather than choose the most convenient candidate.

## 19. Relationship to Other Functional Specifications

### 19.1 Application Invocation

[application-invocation-functional-specification-v01.md](application-invocation-functional-specification-v01.md) owns shared invocation, validation, Headless, confirmation, result, diagnostics, cancellation, and partial-success semantics.

This specification owns project-context and managed-scope semantics consumed by those invocations.

### 19.2 Configuration

[configuration-functional-specification-v01.md](configuration-functional-specification-v01.md) owns candidate-to-effective configuration semantics and precedence.

Effective configuration may contribute to project-context resolution, but this document does not define general configuration precedence.

### 19.3 Source Transformation

[source-transformation-functional-specification-v01.md](source-transformation-functional-specification-v01.md) owns shared inspection, mutation, generation, transformation, validation, and application-acceptance behaviour.

This specification determines whether a source resource belongs to the relevant managed context and scope; it does not define how source mutation is performed.

### 19.4 Domain specifications

Domain Functional Specifications shall define domain-specific target choices and use-case semantics while referencing this document for shared project resolution and scope behaviour.

The owning requirements below define the applicable local contract.

## 20. Traceability

| Functional requirement range | Root Design authority | Notes |
|---|---|---|
| `FR-PROJ-001`–`002` | Sections 6, 9, 12 | Application authority; candidate evidence is not authority |
| `FR-PROJ-003`–`010` | Sections 3.2–3.4, 4, 9.6 | Target project and project-root resolution |
| `FR-PROJ-011`–`015` | Sections 9.1–9.2, 11, 12 | Coherent managed-project context |
| `FR-PROJ-016`–`020` | Sections 3.5, 9.3 | Root application and managed layers |
| `FR-PROJ-021`–`023` | Sections 9.1, 9.4, 9.10 | Project topology and physical-layout independence |
| `FR-PROJ-024`–`028` | Sections 9.5, 10.3, 11 | Repository relationships |
| `FR-PROJ-029`–`036` | Sections 4, 9.6, 12 | Discovery, determinism, ambiguity, unsupported context |
| `FR-PROJ-037`–`042` | Sections 5.2, 9.7, 11, 12 | Managed scope and operation targeting |
| `FR-PROJ-043`–`049` | Sections 1.4, 9.8–9.9, 12 | Recognition vs authority; unmanaged content protection |
| `FR-PROJ-050`–`052` | Sections 8, 9.8 | AppManager-owned management resources |
| `FR-PROJ-053`–`055` | Sections 5, 6, 9.2, 11 | Shared context consumption and diagnostics |
| `FR-PROJ-056`–`058` | Sections 4, 9.6, 12 | Interaction-mode equivalence and Headless behaviour |
| `FR-PROJ-059`–`061` | Sections 9.7–9.9, 11, 12 | Safety before consequential effects |

## 21. Conformance

Conformance is assessed against the applicable requirement bodies in this specification and the canonical contracts they reference. The traceability section identifies the requirement groups; this section creates no additional acceptance checklist.
