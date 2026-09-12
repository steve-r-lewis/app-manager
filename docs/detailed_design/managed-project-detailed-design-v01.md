# AppManager Managed Project Detailed Design

> **Status:** Version 1 Detailed Design Specification
>
> **Detailed Design authority:** This document defines the permanent internal design by which AppManager identifies, resolves, validates, represents, and scopes the project being managed. It refines, but does not override, the root Design Specification or Functional Specifications.
>
> **Governing sources:** `docs/project-documentation-guide-v01.md`, `docs/appmanager-design-specification-v01.md`, `docs/functional/managed-project-functional-specification-v01.md`
>
> **Planning source:** `docs/project_management/detailed-design-decomposition-plan-v01.md`
>
> **Related Detailed Designs:** `docs/detailed_design/application-invocation-detailed-design-v01.md`, `docs/detailed_design/execution-outcomes-detailed-design-v01.md`

## 1. Purpose

This specification defines the permanent internal contracts, responsibilities, resolution stages, state models, and safety boundaries used to determine:

1. which project AppManager is managing;
2. which project entities belong to the resolved managed-project context;
3. how those entities relate to one another;
4. which subset of those entities is within the managed scope of a particular operation; and
5. which of those scoped entities are eligible targets for consequential effects.

The governing distinction is:

> **Discovery or recognition establishes knowledge. Managed scope establishes operation targeting. Neither discovery nor inclusion in context alone grants mutation authority.**

A second governing rule is:

> **Project evidence informs AppManager; it does not independently define AppManager project semantics.**

This Detailed Design therefore separates project evidence acquisition, candidate resolution, project-context construction, operation-specific scope resolution, targetability evaluation, and final application authority.

## 2. Scope

This design owns permanent internal contracts for:

- target-project requests;
- project evidence;
- project candidate identification;
- project-root resolution;
- project ambiguity and conflict representation;
- managed-project context;
- root-application identity;
- managed-layer identity;
- repository relationships;
- project topology;
- AppManager-owned management-resource recognition;
- operation-specific context completeness;
- managed-scope requests;
- managed-scope resolution;
- inclusion and exclusion rules;
- scope narrowing;
- targetability evaluation;
- ownership classification;
- mutable versus non-mutable target distinctions;
- unsupported project structures;
- deterministic Headless resolution;
- host-context contribution;
- immutable/read-only project views where appropriate;
- project and scope diagnostics;
- project-context correlation with invocation and outcomes;
- stale-context and concurrent-change detection boundaries.

This document does not define Nuxt parsing algorithms, Git provider implementation details, concrete filesystem traversal, source transformation, configuration precedence, transport protocols, concrete TypeScript interfaces, or repository-specific command semantics.

## 3. Out of Scope

The following remain Implementation Specification concerns unless a later approved architectural decision elevates them:

- exact directory-walking algorithms;
- concrete filesystem APIs;
- concrete Nuxt-recognition libraries;
- concrete Git libraries or shell commands;
- exact project marker filenames except where already normative elsewhere;
- concrete metadata serialization;
- cache technologies and persistence formats;
- TypeScript `interface`, `type`, `class`, or module declarations;
- source file paths;
- dependency-injection mechanisms;
- concrete immutable collection types;
- exact graph data structures;
- hashing or fingerprinting libraries;
- exact locking or concurrency primitives;
- Git worktree, submodule, or remote-provider mechanics;
- bootstrap and runtime wiring.

The design defines enduring responsibility and contract boundaries, not one implementation topology.

## 4. Architectural Position

Managed Project sits between invocation intent and domain/capability execution.

```text
caller / host / automation
          |
          v
Application Invocation
          |
          v
Application Engine
          |
          +------------------------------+
          |                              |
          v                              v
 target-project request          effective configuration
          |                              |
          +---------------+--------------+
                          |
                          v
              Managed Project resolution
                          |
          +---------------+---------------+
          |                               |
          v                               v
 managed-project context          managed-scope resolution
          |                               |
          +---------------+---------------+
                          |
                          v
                  targetability view
                          |
                          v
                  domain orchestration
                          |
                          v
                  shared capabilities
```

Managed Project is a permanent application-level interpretation boundary. It is not equivalent to:

- current working directory;
- one Git repository;
- one Nuxt configuration file;
- one workspace file;
- one filesystem tree;
- one IDE workspace;
- one layer directory.

Those may provide evidence, but they do not independently define the managed project.

## 5. Responsibility Model

The design is decomposed into the following permanent responsibilities:

1. **Target Project Request** — represents explicit caller intent about the project to manage.
2. **Project Evidence Model** — represents candidate evidence supplied or discovered from supported sources.
3. **Project Candidate Resolver** — derives coherent project candidates from evidence.
4. **Project Root Resolver** — determines the logical root of the selected AppManager project.
5. **Managed Project Context Builder** — assembles an AppManager-oriented view of the target project.
6. **Project Topology Model** — represents root application, layers, repositories, resources, and their semantic relationships.
7. **Context Validator** — determines whether sufficient coherent context exists for a requested operation.
8. **Managed Scope Resolver** — derives the bounded operation-specific target set.
9. **Targetability Evaluator** — determines whether a scoped entity is actually eligible for the requested effect.
10. **Project Context View** — exposes stable read-only project information to commands and capabilities.
11. **Project Diagnostic Model** — explains ambiguity, unsupported structure, inaccessible resources, conflicts, and scope failures through DD-1.2 outcomes.

These are responsibility boundaries, not mandatory one-class-per-responsibility implementation objects.

## 6. Target Project Request Contract

### 6.1 Purpose

The Target Project Request represents what the caller explicitly intends AppManager to manage before project semantics are resolved.

It may contain:

- an explicit project location;
- a selected file or directory;
- a selected layer identity;
- a selected repository identity;
- host workspace context;
- invocation location;
- another approved target hint;
- no explicit target, where deterministic resolution is permitted.

### 6.2 Explicit target does not bypass validation

An explicit target is strong caller intent, but remains input to AppManager project resolution.

The resolver shall verify that the target can be reconciled with a supported managed-project model.

**DD-PROJ-001 — Explicit target validation**  
Explicit project targets shall be validated against AppManager project semantics before becoming authoritative managed-project identity.

### 6.3 No silent substitution

**DD-PROJ-002 — No hidden target replacement**  
When a supplied target and stronger project evidence identify materially different projects, resolution shall produce conflict or ambiguity rather than silently substituting another target.

## 7. Project Evidence Model

### 7.1 Evidence classes

Project resolution may consume bounded evidence from:

- explicit invocation target information;
- invocation location;
- host integration selections;
- effective configuration;
- AppManager-owned project metadata;
- Nuxt project/layer recognition;
- repository recognition;
- project-associated resource recognition;
- previously resolved context evidence that is still valid.

### 7.2 Evidence is factual, not authoritative

Each evidence item should represent:

- evidence kind;
- observed value or identity;
- provenance/source;
- confidence or certainty where useful;
- applicability constraints;
- freshness/revision evidence where useful;
- whether it was caller-supplied or discovered;
- diagnostics associated with acquisition.

**DD-PROJ-003 — Evidence/authority separation**  
No individual evidence provider shall acquire authority to define AppManager project identity, scope, ownership, or mutability merely by producing a match.

### 7.3 Evidence provenance

Provenance shall be retained where it materially affects conflict explanation, diagnostics, stale-state detection, or application policy.

Examples include distinguishing:

- explicit caller target from inferred invocation location;
- Nuxt-recognition evidence from Git-repository evidence;
- AppManager metadata from user-authored project structure;
- current observation from cached observation.

## 8. Project Candidate Resolution

### 8.1 Candidate model

A Project Candidate is a coherent hypothesis that a specific AppManager-manageable project corresponds to the available evidence.

A candidate should be capable of identifying:

- proposed project identity;
- proposed project root;
- supporting evidence;
- contradictory evidence;
- known root-application facts;
- known managed-layer facts;
- known repository facts;
- unresolved questions;
- support status for the requested operation.

### 8.2 Deterministic candidate derivation

**DD-PROJ-004 — Deterministic candidate resolution**  
Materially equivalent evidence and effective configuration shall produce materially equivalent candidate sets and selection decisions.

### 8.3 Candidate ranking and selection

If multiple candidates exist, the resolver may evaluate them according to approved project-resolution policy, but it shall not use incidental discovery order as hidden authority.

Candidate selection may consider:

- explicit target consistency;
- semantic project markers;
- AppManager-owned metadata;
- supported Nuxt topology;
- repository relationship evidence;
- host context;
- invocation location;
- configured project hints.

The exact weighting or algorithm belongs to Implementation Specification unless the policy itself becomes architecturally significant.

### 8.4 Ambiguity

Ambiguity exists when more than one materially different candidate remains plausible and selection would affect project identity, scope, safety, or consequential effects.

**DD-PROJ-005 — Ambiguity is explicit state**  
Ambiguous project resolution shall be represented explicitly rather than collapsed to an arbitrary candidate.

### 8.5 Conflict

Conflict exists when trusted evidence materially disagrees about project identity or topology.

Examples include:

- explicit target points to one project while AppManager metadata identifies another;
- selected file appears under one project while supplied layer identity belongs to another;
- repository relationship evidence contradicts configured ownership;
- cached context no longer matches observed project structure.

Conflicts shall be surfaced through structured diagnostics and either resolved under defined policy or fail safely.

## 9. Project Root Resolution

### 9.1 Logical root

The project root is the logical root of the managed AppManager project, not automatically the caller's current working directory.

**DD-PROJ-006 — Logical root semantics**  
Project-root resolution shall derive the root from coherent project evidence and project semantics rather than treating the invocation directory as authoritative by default.

### 9.2 Nested invocation

Resolution shall support invocation from:

- root application subdirectories;
- layer directories;
- files inside managed layers;
- repository subtrees;
- test/docs/source directories;
- supported host-selected resources.

### 9.3 Root validation

A resolved root shall be validated for:

- accessibility where required;
- supported project structure;
- consistency with selected target evidence;
- absence of unresolved identity conflict;
- sufficient context for the requested operation.

An invalid or unsupported root becomes a structured project-resolution failure.

## 10. Managed Project Context Contract

### 10.1 Purpose

The Managed Project Context is the canonical AppManager-oriented, operation-consumable representation of the target project.

It should be treated as a resolved knowledge model, not as permission to modify everything it contains.

### 10.2 Logical context contents

A conforming context shall be capable of representing, where relevant:

| Context element | Purpose |
|---|---|
| project identity | Stable identity for the resolved managed project |
| project root | Logical root of the managed project |
| root application | Root Nuxt application identity and relevant facts |
| managed layers | Recognized managed Nuxt layers and identities |
| repositories | Recognized repositories relevant to project entities |
| repository relationships | Mapping between repositories and project entities |
| project topology | Semantic relationships among managed entities |
| configuration scope | Project-oriented configuration applicability context |
| AppManager resources | Management metadata/resources owned by AppManager |
| source/resource references | Recognized command-relevant resources |
| ownership classifications | AppManager-owned, user-authored, external, generated, unknown where relevant |
| exclusions | Project-level exclusions applicable to later scope resolution |
| support status | Supported, partially supported, unsupported facts where relevant |
| context revision | Evidence enabling stale-context checks where useful |
| diagnostics | Non-fatal context warnings or unresolved optional facts |

### 10.3 Immutable consumption

**DD-PROJ-007 — Read-only context consumption**  
Commands and capabilities should consume Managed Project Context through read-only or immutable views such that inspecting context cannot itself mutate project state or redefine resolved relationships.

The implementation need not use a particular immutable data structure, but shared consumers shall not casually mutate authoritative context in place.

### 10.4 Context coherence

Within one operation, participating components shall consume one coherent interpretation of project identity and relationships.

Capabilities may inspect additional technical facts, but they shall not independently substitute a conflicting project model.

**DD-PROJ-008 — One operation, one project interpretation**  
A single application operation shall not contain competing authoritative managed-project contexts for the same target unless the operation explicitly models multiple independent projects.

## 11. Operation-Specific Context Completeness

### 11.1 Completeness is use-case relative

Managed Project resolution shall not require all possible project facts for every operation.

Examples:

- displaying project identity may require only root resolution;
- pushing one selected layer requires repository association for that layer;
- project-wide quality checks may require root and layer topology but no mutation ownership;
- deleting or overwriting a resource requires stronger scope and targetability evidence.

### 11.2 Required fact declaration

Use cases should declare or otherwise expose the project facts they require.

A project requirement may include:

- root identity;
- root application presence;
- selected layer existence;
- repository association;
- ownership classification;
- path containment;
- managed-scope resolution;
- mutability eligibility.

**DD-PROJ-009 — Minimal sufficient context**  
Context resolution shall establish the facts required by the requested operation without forcing discovery of unrelated project facts merely because they could be obtained.

### 11.3 Incomplete required context

If a required fact remains unresolved, the operation shall not proceed into consequential execution that depends on that fact.

Optional unresolved facts may remain represented as unknown/absent when safe.

## 12. Root Application Model

The root application shall have a distinct project-entity identity separate from the project root path itself.

A Root Application entity may represent:

- stable logical identity;
- relevant location;
- Nuxt recognition facts;
- associated repository or repositories;
- source/config/docs/tests/resource references;
- lifecycle-relevant facts;
- support status.

**DD-PROJ-010 — Root application distinct from project root**  
The root application shall not be conflated with the project-root directory merely because they often coincide physically.

This allows AppManager to preserve semantic distinctions where management resources or other project entities coexist at the same root.

## 13. Managed Layer Model

### 13.1 Layer identity

Each managed layer shall expose an unambiguous application-level identity independent of presentation order.

A layer entity may represent:

- logical layer identity;
- location;
- relationship to root application;
- Nuxt-recognition evidence;
- repository association;
- package/config/docs/tests/source relationships;
- lifecycle characteristics;
- support status.

### 13.2 Independent lifecycle

Layers may differ from the root application in:

- repository;
- package metadata;
- source layout;
- configuration;
- documentation;
- tests;
- versioning;
- release lifecycle.

**DD-PROJ-011 — No root/layer lifecycle collapse**  
The context model shall not assume every managed layer shares the root application's repository or management lifecycle.

### 13.3 Layer selection

Scope requests shall select layers by stable identity or another validated AppManager-oriented selector, not merely by incidental enumeration index.

## 14. Repository Relationship Model

### 14.1 Repository facts are project facts, not project authority

Repository recognition contributes technical facts such as:

- repository identity;
- working-tree/root relationship;
- association with root application or layer;
- parent/nested relation where relevant;
- remote identity evidence where relevant.

Repository facts do not by themselves define the managed project.

### 14.2 Repository association

The project topology shall be capable of representing:

- one repository containing root and layers;
- root repository plus independent layer repositories;
- nested repositories;
- managed entities with no repository;
- one repository associated with multiple managed entities;
- unsupported or ambiguous repository relationships.

**DD-PROJ-012 — Repository topology remains subordinate**  
Repository boundaries shall not replace project identity, root/layer semantics, or managed-scope policy.

### 14.3 Ambiguous association

A consequential repository operation shall not proceed when the relevant project entity cannot be mapped to the intended repository with sufficient confidence.

This ambiguity becomes a project/scope diagnostic before Git capability execution.

## 15. Project Topology Model

### 15.1 Semantic graph

Project topology is conceptually a semantic relationship graph even if implemented using simpler structures.

Entities may include:

- managed project;
- root application;
- managed layer;
- repository;
- AppManager management resource;
- source collection;
- documentation collection;
- test collection;
- generated artifact;
- configuration resource;
- other recognized command-relevant entity.

Relationships may include:

- contains semantically;
- extends/uses;
- belongs to project;
- associated with repository;
- owned by AppManager;
- generated from;
- scoped under;
- excluded from;
- depends on;
- related to.

### 15.2 Physical containment is evidence only

**DD-PROJ-013 — Semantic relationships over path assumptions**  
Filesystem containment may support topology resolution but shall not be the sole mechanism for relationships that are semantically stronger than directory nesting.

### 15.3 Uniform-tree assumption prohibited

The topology shall support project entities that span multiple directories or repositories where AppManager supports those arrangements.

## 16. AppManager-Owned Management Resources

### 16.1 Ownership classification

Management resources may include AppManager-owned configuration, metadata, registries, reports, generated management artifacts, or other resources explicitly created and governed by AppManager.

The context shall distinguish these from:

- user-authored application resources;
- framework-owned resources;
- external-provider resources;
- generated application resources not owned by AppManager;
- resources whose ownership is unknown.

### 16.2 Ownership does not propagate by adjacency

**DD-PROJ-014 — Ownership is resource-specific**  
AppManager ownership of one resource shall not imply ownership of sibling, parent, child, adjacent, or repository-coincident resources without explicit project semantics.

### 16.3 Metadata is not project reality override

AppManager metadata may strengthen project resolution but must be reconciled with observed project reality.

If metadata contradicts current project structure materially, the resolver shall surface stale/conflicting state rather than silently rewriting project interpretation.

## 17. Managed Scope Request Contract

### 17.1 Purpose

Managed Scope Request represents the operation-specific targeting intent supplied by the use case and invocation.

A scope request may specify:

- whole project;
- root application;
- all managed layers;
- one or more selected layers;
- selected repositories;
- selected files/directories;
- selected resource classes;
- another explicitly bounded entity set supported by the command.

### 17.2 Scope request is not final scope

The request must be resolved against:

- command semantics;
- Managed Project Context;
- explicit caller intent;
- effective configuration;
- project exclusions;
- domain policy;
- safety policy;
- ownership/targetability rules.

**DD-PROJ-015 — Scope requires application resolution**  
A caller-supplied scope selector shall not directly become the final target set without validation and policy evaluation.

## 18. Managed Scope Resolution

### 18.1 Canonical scope model

A resolved Managed Scope should be capable of representing:

- scope identity/correlation;
- originating scope request;
- included entities;
- excluded entities;
- exclusion reasons;
- unresolved requested entities;
- scope derivation evidence;
- whether the scope is complete for the operation;
- target classes represented;
- diagnostics/warnings;
- revision/freshness evidence where applicable.

### 18.2 Scope before consequential effects

**DD-PROJ-016 — Consequential scope gate**  
No consequential effect shall begin until the Application Engine has a sufficiently complete resolved scope for the requested operation.

This includes mutation, deletion, overwrite, remote changes, history-changing actions, generated-resource replacement, or any other materially consequential operation.

### 18.3 Scope narrowing

A caller or command may narrow an otherwise valid broader scope where the use case permits it.

Narrowing shall be monotonic with respect to target inclusion: removing targets from one scope dimension shall not silently broaden another dimension.

**DD-PROJ-017 — No compensating expansion**  
Narrowing a scope shall never implicitly add unrelated targets merely to preserve the approximate size or shape of the original scope.

### 18.4 No implicit expansion from discovery

Newly discovered related entities remain context facts until explicitly included by scope semantics.

**DD-PROJ-018 — Discovery does not expand scope**  
Discovering an additional layer, repository, file, or related project entity after scope resolution shall not silently broaden the operation's target set.

If the new discovery invalidates scope assumptions, execution shall revalidate, suspend, or fail according to owning use-case semantics.

## 19. Recognition, Scope, Targetability, and Mutability

The design uses four distinct states:

1. **Recognized** — AppManager knows the entity exists or is relevant.
2. **In scope** — the entity belongs to the resolved target set for the current operation.
3. **Targetable** — the command is semantically permitted to act on the entity.
4. **Mutable** — the requested consequential effect is permitted under ownership, safety, policy, and command semantics.

These states shall not be collapsed.

```text
recognized
   |
   v
in managed scope
   |
   v
targetable for this command
   |
   v
mutable for this requested effect
```

Each transition may reject an entity.

**DD-PROJ-019 — Recognition is weakest state**  
Recognition alone grants no consequential permission.

**DD-PROJ-020 — Scope is not mutation authority**  
Inclusion in Managed Scope shall not by itself authorize mutation where ownership, command semantics, policy, or safety prohibit the requested effect.

## 20. Targetability Evaluation

Targetability evaluation determines whether a scoped entity is eligible for the requested command/effect.

Inputs may include:

- command identity;
- operation type;
- entity kind;
- scope membership;
- ownership classification;
- effective configuration;
- safety policy;
- exclusion status;
- support status;
- stale-state evidence;
- required confirmation/authorization evidence.

The output should distinguish:

- targetable;
- not targetable;
- targetable only under additional conditions;
- unsupported;
- ambiguous/unknown.

Targetability is application-level policy and must not be delegated to a filesystem, Git, Nuxt, AI, or other capability provider.

## 21. Inclusion and Exclusion Model

### 21.1 Exclusion sources

Exclusions may derive from:

- project-level configuration;
- command semantics;
- explicit invocation exclusions;
- ownership boundaries;
- unsupported entity kinds;
- safety policy;
- domain-specific rules.

### 21.2 Exclusion strength

An excluded entity remains excluded even if discoverable and related to included entities unless the owning use case explicitly authorizes a governed override.

**DD-PROJ-021 — Discovery cannot override exclusion**  
Project discovery, topology expansion, or provider recognition shall not silently re-include an excluded resource.

### 21.3 Unmanaged-resource protection

Resources outside resolved Managed Scope remain non-targets even when accessible from the project root, workspace, repository, or host environment.

## 22. Partial Scope Resolution

### 22.1 Partial resolution is explicit

A requested scope may contain some resolvable and some unresolved entities.

This state shall be represented explicitly rather than silently reducing the request.

### 22.2 Default fail-safe rule

**DD-PROJ-022 — Partial resolution does not imply partial authorization**  
If part of a consequential requested scope cannot be resolved, AppManager shall not execute against the resolvable subset unless the owning Functional Specification explicitly permits partial-scope execution.

### 22.3 Permitted partial scope

Where partial-scope execution is explicitly allowed:

- the resolved subset must remain explicit;
- unresolved targets must remain explicit;
- the Application Engine must determine that partial execution is acceptable;
- DD-1.2 must report partial completion appropriately;
- adapters must not present the result as unconditional full success.

## 23. Headless and Interactive Resolution

### 23.1 Headless

Headless operation shall never depend on interactive project browsing or selection when all required information can be supplied or resolved deterministically.

If ambiguity remains material, Headless shall fail with structured diagnostics.

**DD-PROJ-023 — No Headless guess mode**  
Headless resolution shall not choose an arbitrary project candidate merely because no human is available to disambiguate.

### 23.2 Interactive assistance

Interactive adapters may present valid candidates and collect a user selection.

The selected candidate then re-enters the same project-validation path as any explicit target.

The adapter does not become project authority.

### 23.3 Cross-mode equivalence

TUI, Headless, GUI, IDE, CI, automation, and future adapters shall resolve equivalent target/context/scope semantics from materially equivalent input.

Presentation differences are allowed; project semantics are not.

## 24. Host Integration Contract

Host integrations may provide context such as:

- selected file;
- selected directory;
- selected repository;
- workspace root;
- selected layer;
- active document;
- project/workspace metadata.

This information becomes Project Evidence or explicit scope input.

**DD-PROJ-024 — Host context remains contextual**  
A host selection shall not bypass Managed Project validation, exclusions, targetability checks, or application safety policy.

## 25. Context Freshness and Stale-State Boundaries

### 25.1 Why freshness matters

Project structure may change between resolution and consequential execution.

Examples include:

- layer added or removed;
- repository moved or replaced;
- project metadata changed;
- selected file deleted;
- ownership marker changed;
- repository relation changed.

### 25.2 Revision evidence

Managed Project Context and Managed Scope may retain bounded revision/freshness evidence sufficient to detect material stale-state conditions where required.

This need not imply one global project hash.

### 25.3 Revalidation

Consequential operations whose correctness depends on project facts should revalidate materially significant assumptions before applying effects when those assumptions may have changed.

**DD-PROJ-025 — Stale context fails safe**  
If project-context staleness creates a credible risk of acting on the wrong project entity or outside intended scope, execution shall refresh/revalidate or fail rather than proceed using known-stale authority assumptions.

## 26. Concurrency Boundary

Managed Project does not prescribe global locking.

It does define application-level conflict inputs for DD-1.5 Application Engine, including cases where concurrent operations would:

- target overlapping mutable resources;
- alter project topology while another operation depends on it;
- change repository associations;
- modify management metadata governing scope;
- invalidate ownership/targetability assumptions.

The Application Engine remains responsible for deciding whether to serialize, reject, refresh, or otherwise coordinate conflicting invocations.

## 27. Diagnostics and Outcome Integration

All project-resolution failures, warnings, ambiguity states, and scope failures shall integrate with DD-1.2.

Recommended machine-readable diagnostic categories include concepts such as:

- target-project-not-found;
- invalid-explicit-target;
- ambiguous-project;
- conflicting-project-evidence;
- unsupported-project-structure;
- inaccessible-project-resource;
- invalid-project-root;
- missing-required-context;
- unknown-layer;
- ambiguous-layer;
- repository-association-missing;
- repository-association-ambiguous;
- scope-resolution-failed;
- partial-scope-unresolved;
- excluded-target;
- unmanaged-target;
- target-not-mutable;
- stale-project-context.

Exact codes belong to Implementation Specification unless standardized later as a cross-project compatibility contract.

Diagnostics should identify, where safe:

- which requirement could not be resolved;
- which candidates conflicted;
- which target was excluded;
- whether the problem is ambiguity, unsupported structure, access failure, stale state, or policy;
- safe next actions where known.

## 28. Sensitive Information and Path Exposure

Managed-project diagnostics and context projections shall minimize unnecessary disclosure of:

- absolute paths where not needed;
- private repository locations;
- credentials embedded in remote identities;
- secret-bearing configuration values;
- unrelated host-workspace resources.

Internal resolution may require paths and identifiers, but caller-visible projections should expose only the detail required for understanding and automation.

## 29. Relationship to Configuration Resolution

DD-1.4 Configuration Resolution may use Managed Project Context to determine:

- project applicability;
- project-local configuration sources;
- layer-specific applicability;
- scope-specific configuration candidates.

Managed Project may in turn consume effective configuration for governed project-resolution hints and exclusion policy.

This creates a deliberate collaboration boundary, not unrestricted circular authority.

To avoid semantic cycles:

1. bootstrap-level project evidence must be resolvable without requiring a fully resolved project-dependent configuration snapshot;
2. configuration may refine project interpretation only through defined project-resolution inputs;
3. final project identity remains Managed Project/Application Engine authority;
4. Settings persistence does not directly redefine project semantics.

## 30. Relationship to Application Invocation

DD-1.1 may supply:

- explicit target request;
- host context;
- selected scope hints;
- interaction availability;
- confirmation/authorization evidence.

Managed Project returns:

- resolved project identity;
- Managed Project Context;
- resolved Managed Scope where requested;
- project/scope diagnostics.

Invocation does not resolve project semantics itself.

## 31. Relationship to Execution Outcomes

DD-1.2 owns normalized outcome and diagnostic semantics.

Managed Project contributes structured evidence describing:

- resolution success/failure;
- ambiguity/conflict;
- unsupported context;
- scope inclusion/exclusion;
- unresolved requested targets;
- stale-state findings;
- targetability rejection.

Project-resolution technical success is not final application success; the owning use case and Application Engine interpret it in context.

## 32. Relationship to Application Engine

DD-1.5 shall consume this design as the authoritative project/scope contract.

The Application Engine shall remain responsible for:

- deciding when project context is required;
- supplying use-case requirements;
- accepting or rejecting resolution results;
- interpreting partial-scope permissibility;
- enforcing scope-before-effect gates;
- coordinating project/configuration resolution;
- enforcing targetability before consequential capability calls;
- conflict coordination;
- final AppManager outcome semantics.

Managed Project resolvers provide authoritative application components, but they do not independently execute domain workflows.

## 33. Relationship to Shared Capabilities

### 33.1 Resource Access

Resource Access may inspect filesystem/resources and report facts.

It shall not decide managed scope or ownership simply because a resource is accessible.

### 33.2 Repository Capability

Repository Capability may discover repository facts and associations.

It shall not define project identity, project scope, or mutation authority.

### 33.3 Nuxt Capability

Nuxt Capability may recognize applications, layers, and Nuxt-specific structural facts.

It shall not decide which recognized structures are managed or mutable without AppManager project semantics.

### 33.4 Source Intelligence

Source Intelligence may recognize files and structural facts.

Recognition feeds context/scope decisions but does not grant targeting authority.

## 34. Resolver Pattern

The Managed Project design is the first Detailed Design in which the **resolver** responsibility pattern becomes explicit.

A resolver:

- consumes bounded inputs and evidence;
- applies one coherent semantic responsibility;
- returns a structured resolved value or structured unresolved state;
- preserves provenance needed for explanation;
- does not perform unrelated consequential actions;
- does not silently invent authority beyond its responsibility.

Expected resolver roles include:

- project candidate resolver;
- project root resolver;
- project-context resolver/builder;
- repository-association resolver;
- managed-scope resolver;
- targetability evaluator.

These roles may share implementation infrastructure, but no generic resolver framework is mandated.

## 35. Invariants

The following invariants are mandatory:

1. **Discovery is not mutation authority.**
2. **Recognized does not imply in scope.**
3. **In scope does not imply targetable.**
4. **Targetable does not automatically imply mutable for every effect.**
5. **Current working directory is evidence, not project identity.**
6. **Git repository identity is not managed-project identity.**
7. **Nuxt recognition is evidence, not AppManager management authority.**
8. **AppManager metadata cannot silently override contradictory project reality.**
9. **Explicit scope is never silently broadened by discovery.**
10. **Exclusions survive discovery.**
11. **Consequential effects require sufficiently complete scope first.**
12. **Partial scope failure does not imply partial authorization.**
13. **Headless resolution fails on material ambiguity rather than guessing.**
14. **Capabilities consume AppManager-oriented project facts rather than reconstructing independent project semantics.**
15. **Known stale context cannot remain mutation authority where it risks targeting the wrong resource.**

## 36. Extensibility Rules

Future project evidence sources may be added provided they:

- produce bounded evidence rather than independent project authority;
- expose provenance;
- participate in deterministic conflict/ambiguity handling;
- do not silently broaden scope;
- do not create transport- or presentation-specific project semantics.

Future project entity kinds may be added provided they:

- have unambiguous identity;
- define relationships to existing topology where relevant;
- participate in recognition/scope/targetability distinctions;
- define ownership semantics where consequential operations require them.

Adding arbitrary executable project-detection plugins is not implied by this design and would require separate trust/security governance if proposed.

## 37. Testability Requirements

The design shall support testing project semantics without requiring real external providers wherever practical.

Tests should be able to supply synthetic evidence and assert:

- deterministic project selection;
- explicit-target handling;
- nested invocation resolution;
- ambiguity detection;
- conflict reporting;
- invalid-root rejection;
- root/layer distinction;
- multi-repository topology;
- repository ambiguity;
- scope narrowing;
- exclusion preservation;
- no implicit scope expansion;
- recognition/scope/targetability separation;
- partial-scope fail-safe behaviour;
- Headless deterministic failure;
- host-context validation;
- stale-context handling;
- ownership boundaries;
- AppManager-resource adjacency protection.

Tests should not require a real TUI or presentation layer to establish project correctness.

## 38. Traceability to Functional Requirements

| Functional requirement(s) | Detailed Design realization |
|---|---|
| `FR-PROJ-001`–`002` | Sections 4–8 establish one AppManager project model and evidence/authority separation |
| `FR-PROJ-003`–`007` | Sections 6–8 define target requests, explicit target validation, host/invocation evidence and no silent substitution |
| `FR-PROJ-008`–`010` | Section 9 defines logical project-root resolution and invalid-root handling |
| `FR-PROJ-011`–`015` | Sections 10–11 define coherent Managed Project Context, completeness and operation-local consistency |
| `FR-PROJ-016`–`020` | Sections 12–13 define root application and managed layer models |
| `FR-PROJ-021`–`023` | Section 15 defines semantic project topology without uniform-tree assumptions |
| `FR-PROJ-024`–`028` | Section 14 defines repository relationship semantics and ambiguity handling |
| `FR-PROJ-029`–`036` | Sections 7–9 and 23 define evidence classes, deterministic resolution, ambiguity/conflict, unsupported and insufficient context |
| `FR-PROJ-037`–`042` | Sections 17–18 define Managed Scope Request, resolution, narrowing and no implicit expansion |
| `FR-PROJ-043`–`046` | Sections 16, 19–20 define recognition, ownership, targetability and mutability distinctions |
| `FR-PROJ-047`–`049` | Section 21 defines exclusions and unmanaged-resource protection |
| `FR-PROJ-050`–`052` | Section 16 defines AppManager-owned management-resource semantics |
| `FR-PROJ-053`–`055` | Sections 10, 27 and 30–33 define AppManager-oriented context exposure and diagnostics |
| `FR-PROJ-056`–`058` | Sections 23–24 define cross-mode equivalence and Headless/host semantics |
| `FR-PROJ-059` | Section 18.2 defines the consequential-scope gate |
| `FR-PROJ-060` | Section 22 defines partial-scope non-authorization |
| `FR-PROJ-061` | Sections 8, 22, 23 and 25 define fail-safe ambiguity, unresolved scope and stale-state handling |

## 39. Downstream Detailed Design Requirements

The following downstream documents shall consume this design without redefining its authority boundaries:

### DD-1.4 — Configuration Resolution

Shall use Managed Project Context for project applicability while preserving configuration resolution as a distinct responsibility.

### DD-1.5 — Application Engine

Shall define how context and scope requirements are requested, accepted, cached/reused where appropriate, revalidated, and enforced before capability delegation.

### DD-2 Resource Access

Shall provide bounded technical resource inspection without inferring managed scope from accessibility.

### DD-2 Repository Capability

Shall provide repository facts without elevating repository identity into project authority.

### DD-2 Source Intelligence

Shall provide read-only recognition/scanning facts that may contribute to context and scope but never grant mutation authority.

### DD-2 Source Transformation

Shall require approved target scope and mutation authority before applying transformations.

### DD-2 Nuxt Capability

Shall provide Nuxt-specific recognition facts for root/layer topology while leaving AppManager project interpretation here.

### Domain Detailed Designs

Shall declare the project facts and scope forms each use case requires rather than implementing private project resolvers.

## 40. Conformance Criteria

A Managed Project implementation conforms to this Detailed Design only if:

1. it resolves project identity from structured evidence under common AppManager semantics;
2. explicit targets are validated and never silently substituted with unrelated projects;
3. current working directory, Git repository, Nuxt markers, host selections, and metadata remain evidence rather than independent project authority;
4. one coherent Managed Project Context is consumed within an operation;
5. root application, managed layers, repositories, management resources, and relevant project entities are represented distinctly where required;
6. repository topology does not replace project identity;
7. Managed Scope is resolved per operation before consequential effects;
8. scope narrowing cannot cause implicit expansion elsewhere;
9. discovery cannot silently expand scope;
10. recognized, in-scope, targetable, and mutable states remain distinct;
11. exclusions and unmanaged-resource protections are enforced;
12. AppManager ownership does not propagate by filesystem adjacency;
13. partial scope failure does not become partial authorization unless explicitly permitted;
14. Headless resolution is deterministic and fails safely on material ambiguity;
15. host context is validated under the same semantics as other project evidence;
16. stale context is not used for unsafe consequential targeting;
17. project/scope failures integrate with DD-1.2 structured diagnostics and outcomes;
18. capabilities receive AppManager-oriented project information instead of reconstructing competing project semantics;
19. no scanner, resolver, repository provider, framework recognizer, or interaction adapter independently acquires mutation authority.

## 41. Summary Design Rule

The Managed Project subsystem exists to answer three increasingly restrictive questions:

```text
What does AppManager know belongs to this project?
                    |
                    v
What is this operation intended to target?
                    |
                    v
What is this operation actually permitted to affect?
```

These questions correspond respectively to:

```text
Managed Project Context
        -> Managed Scope
        -> Targetability / mutation authority
```

The permanent architectural rule is therefore:

> **Knowledge, targeting, and authority are separate states. AppManager may discover broadly, but it must scope deliberately and mutate only through explicit application authority.**
