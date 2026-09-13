# AppManager Managed Project Functional Specification

> **Status:** Version 1 Functional Specification
>
> **Functional authority:** This document defines the required observable behaviour by which AppManager identifies, resolves, validates, represents, and scopes the target project it manages. It refines, but does not override, the root Design Specification.
>
> **Governing sources:** `docs/project-documentation-guide-v01.md`, `docs/appmanager-design-specification-v01.md`
>
> **Planning source:** `docs/project_management/functional-specification-decomposition-plan-v01.md`

## 1. Purpose

This specification defines the common functional behaviour by which AppManager determines **which project is being managed**, **which project entities belong to the relevant managed project context**, and **which of those entities are permitted targets of a particular operation**.

It is the shared Functional authority for managed-project context and managed-scope semantics. Domain Functional Specifications define what individual AppManager use cases do; this specification defines the common project-understanding and targeting behaviour those use cases consume.

The central distinction is:

> **Discovery or recognition establishes knowledge. Managed scope establishes operation targeting. Neither discovery nor inclusion in context alone grants mutation authority.**

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

The Application Engine remains authoritative for interpreting project context, operation scope, project relationships, ownership boundaries, and safety policy.

Adapters, repositories, framework markers, resolvers, configuration sources, external providers, and filesystem layout may provide evidence but do not independently define AppManager project semantics.

**FR-PROJ-001 — Single project semantics**  
All supported interaction modes and host integrations shall use the same AppManager semantics for target-project identity, managed-project context, and managed scope.

**FR-PROJ-002 — Candidate evidence is not authority**  
A filesystem location, repository, host-tool selection, configuration source, project marker, or adapter-supplied value may contribute candidate project evidence but shall not independently become authoritative merely because it was discovered or supplied.

## 5. Target Project Identification

### 5.1 Target project

**FR-PROJ-003 — Target-project identity**  
For every project-dependent operation, AppManager shall determine the target project to which the operation applies before relying on project-specific behaviour.

**FR-PROJ-004 — Explicit target preference**  
Where the invocation explicitly identifies a target project in a valid form, AppManager shall treat that information as project-resolution input and validate it against the managed-project model rather than silently substituting an unrelated project.

### 5.2 Invocation location and host context

**FR-PROJ-005 — Invocation-location evidence**  
The location from which AppManager is invoked may contribute evidence toward target-project resolution, but invocation location alone shall not define the managed project where stronger or conflicting project evidence exists.

**FR-PROJ-006 — Host-context evidence**  
IDE, editor, GUI, automation, or other host integrations may supply project, file, directory, layer, or repository context. AppManager shall translate such context into AppManager project semantics and validate it before use.

### 5.3 No hidden project switching

**FR-PROJ-007 — No silent project substitution**  
If supplied and resolved project evidence identifies materially different candidate projects, AppManager shall not silently switch to one candidate merely to continue execution.

The ambiguity shall be resolved explicitly or the operation shall fail clearly.

## 6. Project Root Resolution

### 6.1 Project root

**FR-PROJ-008 — Project-root resolution**  
AppManager shall resolve a project root for operations whose semantics require one.

The resolved project root shall represent the root of the target project rather than merely the caller's current working directory.

**FR-PROJ-009 — Nested invocation**  
Invocation from a file, subdirectory, layer, repository subtree, or other nested location shall not require the caller to manually relocate to the project root when AppManager can deterministically resolve the intended target project from supported evidence.

### 6.2 Invalid roots

**FR-PROJ-010 — Invalid project root**  
If a supplied or discovered project root is invalid, unsupported, inaccessible, or inconsistent with the requested operation, AppManager shall reject it with a structured diagnostic rather than treating the path as a valid managed project by default.

## 7. Managed Project Context

### 7.1 Coherent context

**FR-PROJ-011 — Managed-project context**  
Before a project-dependent command relies on project identity or structure, AppManager shall resolve one coherent managed-project context representing the AppManager-relevant view of the target project.

**FR-PROJ-012 — Context contents**  
Where relevant and available, the managed-project context shall represent AppManager-oriented information about:

- project identity and project root;
- the root Nuxt application;
- managed Nuxt layers;
- repository relationships;
- configuration scope;
- AppManager-owned management resources;
- relevant source, documentation, tests, generated artefacts, and other command targets.

The context need not expose implementation-specific structures to callers.

### 7.2 Context completeness

**FR-PROJ-013 — Required context completeness**  
A command shall not proceed with a project-dependent effect when information required to determine its correct target or safety boundaries remains unresolved.

**FR-PROJ-014 — Operation-specific completeness**  
Managed-project context need only be complete for the requirements of the requested operation. AppManager shall not require unrelated project facts merely because they could theoretically be discovered.

### 7.3 Context reuse

**FR-PROJ-015 — Consistent context within an operation**  
Within one application operation, commands and participating capabilities shall consume a coherent AppManager interpretation of the target project rather than independently resolving conflicting project identities or relationships.

## 8. Root Application and Managed Layers

### 8.1 Root application

**FR-PROJ-016 — Root-application recognition**  
Where the target project contains a supported root Nuxt application, AppManager shall represent it distinctly within the managed-project context.

### 8.2 Managed layers

**FR-PROJ-017 — Managed-layer recognition**  
AppManager shall be able to recognise supported Nuxt layers that form part of the target project's managed application structure.

**FR-PROJ-018 — Layer identity**  
Each managed layer shall be distinguishable sufficiently for commands and callers to select the intended layer without depending solely on presentation order or incidental filesystem position.

**FR-PROJ-019 — Layer independence**  
A managed layer may have its own source, package metadata, configuration, documentation, tests, repository relationship, and lifecycle characteristics. AppManager shall not require all managed layers to share the root application's repository or management lifecycle.

### 8.3 Root/layer distinction

**FR-PROJ-020 — Root and layer distinction**  
AppManager shall distinguish the root application from managed layers even where filesystem or repository layout makes them appear closely nested.

## 9. Project Topology and Resource Relationships

**FR-PROJ-021 — Project topology**  
AppManager shall represent project relationships sufficiently for operations to determine how the root application, managed layers, repositories, AppManager-owned management resources, and other relevant entities relate to one another.

**FR-PROJ-022 — Semantic relationships over directory containment**  
Directory containment may contribute evidence to project topology, but AppManager shall not assume that every semantic project relationship is defined solely by physical nesting.

**FR-PROJ-023 — No uniform-tree assumption**  
AppManager shall support managed projects whose relevant entities do not all occupy one uniform directory or repository tree.

## 10. Repository Relationships

### 10.1 Repository recognition

**FR-PROJ-024 — Repository recognition**  
Where repositories are relevant to the requested operation, AppManager shall identify the repository or repositories associated with the applicable managed project entities.

**FR-PROJ-025 — Repository topology is not project identity**  
Repository boundaries shall not substitute for managed-project identity or Nuxt application structure.

### 10.2 Multi-repository projects

**FR-PROJ-026 — Multi-repository support**  
Managed-project context and managed-scope semantics shall support projects that span multiple repositories or nested repository relationships where those arrangements are supported by AppManager.

**FR-PROJ-027 — Repository targeting by project scope**  
For project-wide, root-application, layer-specific, or otherwise scoped operations, AppManager shall be able to determine which recognised repositories are relevant to that scope without assuming that every managed entity belongs to a single repository.

### 10.3 Repository ambiguity

**FR-PROJ-028 — Ambiguous repository association**  
If AppManager cannot determine which repository relationship is applicable to a consequential operation, it shall require explicit disambiguation or fail clearly rather than mutate or synchronise an arbitrary repository.

## 11. Project Discovery and Context Resolution

### 11.1 Approved evidence classes

**FR-PROJ-029 — Project-resolution evidence**  
AppManager may derive candidate project information from supported evidence including:

- explicit invocation context or supplied target information;
- invocation location;
- host-tool context;
- effective configuration;
- AppManager-owned project metadata;
- recognised Nuxt application or layer structure;
- repository information where relevant.

The precise discovery mechanism for each evidence class belongs below the Functional level.

### 11.2 Deterministic resolution

**FR-PROJ-030 — Deterministic resolution**  
Given materially equivalent candidate evidence and effective configuration, project-context resolution shall produce materially equivalent results.

**FR-PROJ-031 — Headless project resolution**  
Headless operation shall resolve required project context deterministically from non-interactive evidence or fail clearly. It shall not block waiting for interactive project selection.

### 11.3 Interactive disambiguation

**FR-PROJ-032 — Interactive disambiguation**  
Where multiple valid candidate project contexts remain and interaction is permitted, an interactive adapter may assist the user in selecting among those candidates.

The resulting selection shall be validated under the same AppManager project semantics as an explicitly supplied non-interactive target.

### 11.4 Ambiguity and conflict

**FR-PROJ-033 — Ambiguous context**  
If AppManager cannot resolve one sufficiently coherent managed-project context from the available evidence, the operation shall fail or request permitted disambiguation rather than proceed through a hidden assumption.

**FR-PROJ-034 — Conflicting evidence**  
When project evidence conflicts, AppManager shall apply defined project-resolution policy and report unresolved conflicts that materially affect target identity, scope, or safety.

### 11.5 Insufficient and unsupported context

**FR-PROJ-035 — Insufficient context**  
If required project information cannot be resolved, AppManager shall produce a structured failure indicating which project requirement remains unresolved where that information can be determined safely.

**FR-PROJ-036 — Unsupported project structure**  
If the target project's structure is recognised but unsupported for the requested operation, AppManager shall distinguish that condition from both an unknown project and a generic execution failure.

## 12. Managed Scope

### 12.1 Scope definition

**FR-PROJ-037 — Managed-scope resolution**  
Before a consequential operation acts on project resources, AppManager shall resolve the bounded set of project entities to which that operation is intended to apply.

**FR-PROJ-038 — Operation-specific scope**  
Managed scope shall be derived from the requested command semantics, explicit caller intent, resolved managed-project context, effective configuration, applicable exclusions, and AppManager policy.

### 12.2 Supported scope forms

**FR-PROJ-039 — Scope forms**  
Where supported by the relevant command, managed scope may identify:

- the complete managed project;
- the root application;
- all managed layers;
- one or more selected layers;
- one or more selected repositories;
- one or more selected files or directories;
- another explicitly bounded set of managed project entities.

### 12.3 Scope clarity

**FR-PROJ-040 — Consequential scope clarity**  
For a consequential operation, the intended managed scope shall be determinable before mutation, remote change, history-changing action, deletion, overwrite, or other significant side effect begins.

### 12.4 Scope narrowing

**FR-PROJ-041 — Scope narrowing**  
A command or caller may narrow an otherwise broader valid scope where the command permits such targeting. Narrowing shall not implicitly expand any other part of the operation.

**FR-PROJ-042 — No implicit scope expansion**  
AppManager shall not silently broaden an explicitly bounded scope merely because additional related resources were discovered.

## 13. Recognition, Targetability, and Mutation Authority

### 13.1 Recognition is not authority

**FR-PROJ-043 — Recognition does not grant mutation authority**  
A resource becoming recognised or included in managed-project context shall not by itself make that resource eligible for mutation, deletion, overwrite, synchronisation, remote change, or another consequential effect.

### 13.2 Targetability

**FR-PROJ-044 — Targetability evaluation**  
Before a consequential operation acts on a recognised resource, AppManager shall determine that the resource belongs to the resolved managed scope and is an eligible target for that command.

### 13.3 Ownership and permission

**FR-PROJ-045 — Ownership-sensitive behaviour**  
AppManager shall distinguish AppManager-owned data from user-authored or externally owned project resources when that distinction affects whether or how a command may modify the resource.

**FR-PROJ-046 — No adjacent-resource ownership assumption**  
The presence of AppManager-owned configuration, state, templates, reports, registries, or generated artefacts shall not grant AppManager ownership of adjacent files, directories, repositories, or framework resources.

## 14. Inclusion, Exclusion, and Unmanaged Content

**FR-PROJ-047 — Explicit exclusion**  
Where project or command semantics define excluded resources or entities, those exclusions shall remain effective even when the excluded resources are discoverable within the project topology.

**FR-PROJ-048 — Unmanaged resource protection**  
Resources outside the resolved managed scope shall not be modified merely because they are accessible from the project root, repository, workspace, or host environment.

**FR-PROJ-049 — Preserve unrelated content**  
Operations shall preserve unrelated user-authored and unmanaged content wherever practical and shall avoid treating project-wide scope as permission to rewrite all discoverable resources.

## 15. AppManager-Owned Management Resources

**FR-PROJ-050 — Management-resource recognition**  
AppManager shall be able to distinguish its own project-associated management resources from the target project's user-authored application resources where that distinction is functionally relevant.

**FR-PROJ-051 — Coexistence with project structure**  
AppManager-owned management resources shall coexist with the project's own structure without requiring the project to be reorganised around AppManager internals.

**FR-PROJ-052 — Management data does not redefine project structure**  
AppManager-owned metadata may contribute to project-context resolution but shall not silently override contradictory project reality or redefine user-owned structure without governed application semantics.

## 16. Context and Scope Exposure

### 16.1 Command consumption

**FR-PROJ-053 — AppManager-oriented project information**  
Commands and shared capabilities shall receive the project information they require in AppManager-oriented terms rather than each reconstructing target identity, layer relationships, repository relationships, or scope independently.

### 16.2 Caller-visible context

**FR-PROJ-054 — Observable target information**  
Where target identity or managed scope materially affects a caller's understanding, safety decision, automation behaviour, or interpretation of the result, AppManager shall expose sufficient structured information to identify the resolved target and scope.

Exact schemas belong to Detailed Design.

### 16.3 Diagnostics

**FR-PROJ-055 — Project-resolution diagnostics**  
Failures or warnings involving target-project resolution, ambiguity, unsupported structure, inaccessible resources, or scope shall provide diagnostics sufficient to distinguish the material cause without requiring the caller to infer it from incidental filesystem or terminal behaviour.

## 17. Interaction-Mode Behaviour

**FR-PROJ-056 — Cross-mode project equivalence**  
TUI, Headless, GUI, IDE/host-tool, CI, automation-agent, and future supported invocation paths shall preserve equivalent target-project, managed-context, and managed-scope semantics.

**FR-PROJ-057 — Host selection is contextual input**  
A selected file, directory, layer, or repository in a host tool may contribute to target or scope resolution but shall not bypass AppManager validation, policy, exclusions, or safety requirements.

**FR-PROJ-058 — No interaction-only project semantics**  
A project-dependent use case that is otherwise suitable for Headless execution shall not require interactive project browsing or selection when all required target information can be supplied or deterministically resolved non-interactively.

## 18. Safety and Consequential Operations

**FR-PROJ-059 — Scope before consequential effects**  
Consequential effects shall not begin until AppManager has resolved sufficient project context and managed scope to determine the intended targets and applicable safety boundaries.

**FR-PROJ-060 — Scope failure is not partial authorisation**  
Failure to resolve part of a requested consequential scope shall not implicitly authorise execution against the subset that happened to resolve unless the command's Functional Specification explicitly permits partial-scope execution and reports it as such.

**FR-PROJ-061 — Discovery failure shall fail safe**  
When project-context or scope uncertainty could cause AppManager to act on the wrong project, repository, layer, file, or external target, AppManager shall fail safely rather than choose the most convenient candidate.

## 19. Relationship to Other Functional Specifications

### 19.1 Application Invocation

`application-invocation-functional-specification-v01.md` owns shared invocation, validation, Headless, confirmation, result, diagnostics, cancellation, and partial-success semantics.

This specification owns project-context and managed-scope semantics consumed by those invocations.

### 19.2 Configuration

The future `configuration-functional-specification-v01.md` owns candidate-to-effective configuration semantics and precedence.

Effective configuration may contribute to project-context resolution, but this document does not define general configuration precedence.

### 19.3 Source Transformation

The future `source-transformation-functional-specification-v01.md` owns shared inspection, mutation, generation, transformation, validation, and application-acceptance behaviour.

This specification determines whether a source resource belongs to the relevant managed context and scope; it does not define how source mutation is performed.

### 19.4 Domain specifications

Domain Functional Specifications shall define domain-specific target choices and use-case semantics while referencing this document for shared project resolution and scope behaviour.

A domain specification may further constrain scope for one command but shall not weaken the cross-cutting rule that discovery does not grant mutation authority.

## 20. Legacy Reconciliation

The legacy documentation contains useful but mixed-abstraction material around resolvers, target selection, settings, repositories, layers, and filesystem context.

The following functional substance is retained here:

- incomplete or ambiguous target information must be resolved through explicit application policy;
- explicit input, environment/context, detected project state, configuration, and interaction may act as candidate information sources;
- resolution must be deterministic for Headless and automation use;
- unresolved ambiguity must fail clearly rather than block or guess;
- interactive completion is a source of candidate information, not an alternative application model;
- target selection and operation execution are separate concerns;
- repository or layer selection is resolution of an AppManager target, not authority to mutate it;
- cancellation or inability to resolve a target is not a valid target value;
- resolution policy must not be duplicated independently across commands.

The following legacy material is deliberately not propagated as Functional authority:

- resolver class hierarchies;
- exact TypeScript APIs;
- concrete `Resolution<T>` shapes;
- specific error classes;
- exact precedence chains belonging to configuration resolution;
- exact directory traversal algorithms;
- specific resolver filenames or source locations;
- concrete Git/Nuxt detection implementations;
- persistence mechanisms and caches.

Those belong to Detailed Design or Implementation Specifications where still relevant.

## 21. Traceability

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

Legacy provenance is principally reconciled from `docs/archive/design/appmanager-design-reconciliation-audit-v01.md` and the historical resolver specification under `docs/archive/specification/architecture/resolvers/`.

## 22. Conformance

A Version 1 implementation conforms to this Functional Specification only if project-dependent operations:

1. resolve a target project and project root where required;
2. produce one coherent managed-project context before depending on project identity or structure;
3. distinguish root application, managed layers, repositories, and AppManager-owned management resources where relevant;
4. resolve an explicit managed scope before consequential effects;
5. treat discovery, recognition, targeting, and mutation authority as distinct concepts;
6. handle ambiguity, conflict, insufficiency, and unsupported context explicitly;
7. remain deterministic in Headless operation;
8. preserve equivalent project semantics across interaction modes;
9. protect unmanaged and unrelated user-authored resources;
10. fail safely when project or scope uncertainty could cause effects against the wrong target.

---

**End of Version 1 Managed Project Functional Specification**
