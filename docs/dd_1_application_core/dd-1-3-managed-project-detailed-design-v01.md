# DD-1.3 — AppManager Managed Project Detailed Design

> **Detailed Design ID:** DD-1.3
>
> **Design family:** DD-1 — Application Core

> **Status:** Version 1 Detailed Design Specification
>
> **Detailed Design authority:** This document defines the permanent internal design by which AppManager identifies, resolves, validates, represents, and scopes the project being managed. It refines, but does not override, the root Design Specification or Functional Specifications.
>
> **Sources and navigation:** [Project Documentation Guide](../project-documentation-guide-v01.md), [AppManager Design Specification](../appmanager-design-specification-v01.md), [docs/functional/managed-project-functional-specification-v01.md](../functional/managed-project-functional-specification-v01.md)
>
> **Planning source:** [Detailed Design Register](../project_management/detailed-design-register-v01.md)
>
> **Related Detailed Designs:** [DD-1.1 — Application Invocation](dd-1-1-application-invocation-detailed-design-v01.md), [DD-1.2 — Execution Outcomes](dd-1-2-execution-outcomes-detailed-design-v01.md), [DD-1.4 — Configuration Resolution](dd-1-4-configuration-resolution-detailed-design-v01.md), [DD-1.5 — Application Engine](dd-1-5-application-engine-detailed-design-v01.md), [Application Core Bootstrap Resolution](dd-1-5-application-engine-detailed-design-v01.md#_8-orchestration-lifecycle)

## 1. Purpose

Managed Project turns caller hints and specialist observations into a coherent project view, then resolves the targets and eligibility required by an operation. The evidence, candidate, context, scope and targetability models below explain how those decisions collaborate under [Design](../appmanager-design-specification-v01.md#_9-6-project-discovery-and-context-resolution) and [Design](../appmanager-design-specification-v01.md#_9-9-non-destructive-ownership-and-unmanaged-content).

Configuration participates through the [DD-1.4 stage-eligibility contract](dd-1-4-configuration-resolution-detailed-design-v01.md#_8-resolution-context), coordinated by [DD-1.5](dd-1-5-application-engine-detailed-design-v01.md#_8-orchestration-lifecycle). This document supplies the project-side input and conflict handling in [§29](#_29-relationship-to-configuration-resolution).

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

Managed Project connects invocation intent to domain/capability execution through the following illustrative dependency view:

```text
caller / host / automation
          |
          v
Application Invocation
          |
          v
Application Engine
          |
          +--> context-independent configuration candidates
          |         |
          |         v
          |    bootstrap effective configuration
          |         |
          +---------+-------------------+
                                    |
                                    v
                         target-project request
                                    |
                                    v
                       Managed Project resolution
                                    |
                                    v
                       managed-project context
                                    |
                                    +--> project/scope-aware configuration
                                    |         |
                                    |         v
                                    |   operation effective snapshot
                                    |         |
                                    +---------+-------------------+
                                                              |
                                                              v
                                                   managed-scope resolution
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

The authoritative staging contract is [DD-1.5 §8](dd-1-5-application-engine-detailed-design-v01.md#_8-orchestration-lifecycle), including conditional scope prerequisites. [DD-1.4 §8](dd-1-4-configuration-resolution-detailed-design-v01.md#_8-resolution-context) determines configuration eligibility. The diagram does not prescribe a call stack or universal physical pipeline.

Current directories, repositories, Nuxt/workspace files and host selections contribute the evidence model in §7 under [Design](../appmanager-design-specification-v01.md#_9-6-project-discovery-and-context-resolution).

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

The candidate/root contracts below perform that reconciliation.

<a id="dd-proj-001"></a>

**DD-PROJ-001 — Explicit target validation**

Explicit target validation follows [FR-PROJ-004](../functional/managed-project-functional-specification-v01.md#fr-proj-004) through the candidate/root contracts below.

### 6.3 No silent substitution

<a id="dd-proj-002"></a>

**DD-PROJ-002 — No hidden target replacement**

Conflicting target selection follows [FR-PROJ-007](../functional/managed-project-functional-specification-v01.md#fr-proj-007).

## 7. Project Evidence Model

### 7.1 Evidence classes

Project resolution may consume bounded evidence from:

- explicit invocation target information;
- invocation location;
- host integration selections;
- bootstrap effective configuration valid at the current resolution stage;
- AppManager-owned project metadata;
- Nuxt project/layer recognition;
- repository recognition;
- project-associated resource recognition;
- previously resolved context evidence that is still valid.

Configuration evidence is stage-eligible under [DD-1.4 §8](dd-1-4-configuration-resolution-detailed-design-v01.md#_8-resolution-context); the project-side binding is [DD-CORE-BOOT-004](#dd-core-boot-004).

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

<a id="dd-proj-003"></a>

**DD-PROJ-003 — Evidence/authority separation**

Evidence items bind [Design](../appmanager-design-specification-v01.md#_9-6-project-discovery-and-context-resolution) and [Design](../appmanager-design-specification-v01.md#_9-9-non-destructive-ownership-and-unmanaged-content) to the §7.2 model.

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

<a id="dd-proj-004"></a>

**DD-PROJ-004 — Deterministic candidate resolution**

Candidate derivation applies [FR-PROJ-030](../functional/managed-project-functional-specification-v01.md#fr-proj-030) to stage-eligible [bootstrap inputs](dd-1-4-configuration-resolution-detailed-design-v01.md#_8-resolution-context).

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

<a id="dd-proj-005"></a>

**DD-PROJ-005 — Ambiguity is explicit state**

The candidate model represents ambiguity under [FR-PROJ-033](../functional/managed-project-functional-specification-v01.md#fr-proj-033).

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

<a id="dd-proj-006"></a>

**DD-PROJ-006 — Logical root semantics**

Logical root resolution follows [FR-PROJ-008](../functional/managed-project-functional-specification-v01.md#fr-proj-008) and [FR-PROJ-005](../functional/managed-project-functional-specification-v01.md#fr-proj-005).

### 9.2 Nested invocation

Nested caller locations and supported host selections follow [FR-PROJ-009](../functional/managed-project-functional-specification-v01.md#fr-proj-009) and [FR-PROJ-006](../functional/managed-project-functional-specification-v01.md#fr-proj-006) through the target request.

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

<a id="dd-proj-007"></a>

**DD-PROJ-007 — Read-only context consumption**  
Commands and capabilities should consume Managed Project Context through read-only or immutable views such that inspecting context cannot itself mutate project state or redefine resolved relationships.

The implementation need not use a particular immutable data structure.

### 10.4 Context coherence

The shared context supports the operation-local coherence rule below; additional capability facts are reconciled through that context.

<a id="dd-proj-008"></a>

**DD-PROJ-008 — One operation, one project interpretation**  
A single application operation shall not contain competing authoritative managed-project contexts for the same target unless the operation explicitly models multiple independent projects.

## 11. Operation-Specific Context Completeness

### 11.1 Completeness is use-case relative

Use-case-relative completeness follows [FR-PROJ-014](../functional/managed-project-functional-specification-v01.md#fr-proj-014). For example, displaying identity may need only the root, pushing a layer needs its repository association, and deleting a resource needs scope and targetability evidence.

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

<a id="dd-proj-009"></a>

**DD-PROJ-009 — Minimal sufficient context**

Required-fact resolution follows [FR-PROJ-014](../functional/managed-project-functional-specification-v01.md#fr-proj-014) using the §11.2 declaration.

### 11.3 Incomplete required context

Unresolved required facts follow [FR-PROJ-035](../functional/managed-project-functional-specification-v01.md#fr-proj-035) and [FR-INV-011](../functional/application-invocation-functional-specification-v01.md#fr-inv-011). Optional facts may remain unknown/absent where safe.

## 12. Root Application Model

The root application entity carries the identity distinguished by DD-PROJ-010.

A Root Application entity may represent:

- stable logical identity;
- relevant location;
- Nuxt recognition facts;
- associated repository or repositories;
- source/config/docs/tests/resource references;
- lifecycle-relevant facts;
- support status.

<a id="dd-proj-010"></a>

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

<a id="dd-proj-011"></a>

**DD-PROJ-011 — No root/layer lifecycle collapse**

The layer model binds [Design](../appmanager-design-specification-v01.md#_9-3-root-application-and-managed-layers) to repository and lifecycle facts.

### 13.3 Layer selection

Layer selectors bind [FR-PROJ-018](../functional/managed-project-functional-specification-v01.md#fr-proj-018) to the scope request model.

## 14. Repository Relationship Model

### 14.1 Repository facts are project facts, not project authority

Repository observations contribute identity, working-tree/root relationship, root/layer association, nesting and relevant remote identity evidence through [DD-2.3](../dd_2_shared_capabilities/dd-2-3-repository-capability-detailed-design-v01.md). Interpretation follows [Design](../appmanager-design-specification-v01.md#_9-6-project-discovery-and-context-resolution).

### 14.2 Repository association

The project topology shall be capable of representing:

- one repository containing root and layers;
- root repository plus independent layer repositories;
- nested repositories;
- managed entities with no repository;
- one repository associated with multiple managed entities;
- unsupported or ambiguous repository relationships.

<a id="dd-proj-012"></a>

**DD-PROJ-012 — Repository topology remains subordinate**

Repository evidence binds [Design](../appmanager-design-specification-v01.md#_9-3-root-application-and-managed-layers) and [Design](../appmanager-design-specification-v01.md#_9-5-repository-relationships) to the association model.

### 14.3 Ambiguous association

Association ambiguity follows [FR-PROJ-028](../functional/managed-project-functional-specification-v01.md#fr-proj-028) and is returned as a project/scope diagnostic before consequential Git execution.

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

<a id="dd-proj-013"></a>

**DD-PROJ-013 — Semantic relationships over path assumptions**

Topology representation follows [Design](../appmanager-design-specification-v01.md#_9-4-project-topology-and-resource-relationships).

### 15.3 Uniform-tree assumption prohibited

The topology graph binds [Design](../appmanager-design-specification-v01.md#_9-1-managed-project-model) to supported entities spanning directories or repositories.

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

<a id="dd-proj-014"></a>

**DD-PROJ-014 — Ownership is resource-specific**

Resource ownership binds [Design](../appmanager-design-specification-v01.md#_9-8-appmanager-owned-management-area-and-project-coexistence) to the §16.1 classification.

### 16.3 Metadata is not project reality override

Management metadata follows [FR-PROJ-052](../functional/managed-project-functional-specification-v01.md#fr-proj-052). Material disagreement with observed structure is represented by the conflict/staleness models in §§8 and 25.

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
- operation-effective configuration available at the scope-resolution stage;
- project exclusions;
- domain policy;
- safety policy;
- ownership/targetability rules.

Configuration-dependent scope resolution uses the [Engine scope checkpoint](dd-1-5-application-engine-detailed-design-v01.md#dd-core-boot-009); the list above identifies the local scope decision inputs.

<a id="dd-proj-015"></a>

**DD-PROJ-015 — Scope requires application resolution**

The scope selector is resolved under [FR-PROJ-038](../functional/managed-project-functional-specification-v01.md#fr-proj-038) using the §18 model.

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

<a id="dd-proj-016"></a>

**DD-PROJ-016 — Consequential scope gate**

The scope gate applies [Design](../appmanager-design-specification-v01.md#_9-6-project-discovery-and-context-resolution) and [Design](../appmanager-design-specification-v01.md#_9-7-managed-scope-and-operation-targeting) before consequential effects.

### 18.3 Scope narrowing

The resolved scope records support caller/use-case narrowing under the rule below.

<a id="dd-proj-017"></a>

**DD-PROJ-017 — No compensating expansion**

Scope narrowing applies [FR-PROJ-041](../functional/managed-project-functional-specification-v01.md#fr-proj-041).

### 18.4 No implicit expansion from discovery

Newly discovered related entities remain context facts until explicitly included by scope semantics.

<a id="dd-proj-018"></a>

**DD-PROJ-018 — Discovery does not expand scope**

Discovery after resolution applies [FR-PROJ-042](../functional/managed-project-functional-specification-v01.md#fr-proj-042). If it invalidates scope assumptions, the owning use case revalidates, suspends or fails.

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

<a id="dd-proj-019"></a>

**DD-PROJ-019 — Recognition is weakest state**

Recognition binds [Design](../appmanager-design-specification-v01.md#_9-9-non-destructive-ownership-and-unmanaged-content) to the first state above.

<a id="dd-proj-020"></a>

**DD-PROJ-020 — Scope is not mutation authority**

The in-scope state binds [Design](../appmanager-design-specification-v01.md#_9-9-non-destructive-ownership-and-unmanaged-content) to the remaining targetability/mutability decisions.

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

The scope model retains exclusions and their reasons. Any override requires explicit authority from the owning use case.

<a id="dd-proj-021"></a>

**DD-PROJ-021 — Discovery cannot override exclusion**

Discovery and topology expansion preserve [FR-PROJ-047](../functional/managed-project-functional-specification-v01.md#fr-proj-047).

### 21.3 Unmanaged-resource protection

Accessible out-of-scope resources follow [Design](../appmanager-design-specification-v01.md#_9-9-non-destructive-ownership-and-unmanaged-content).

## 22. Partial Scope Resolution

### 22.1 Partial resolution is explicit

The §18 scope model retains both resolved and unresolved requested entities under [FR-PROJ-060](../functional/managed-project-functional-specification-v01.md#fr-proj-060).

### 22.2 Default fail-safe rule

<a id="dd-proj-022"></a>

**DD-PROJ-022 — Partial resolution does not imply partial authorization**

Partial scope execution follows [FR-PROJ-060](../functional/managed-project-functional-specification-v01.md#fr-proj-060).

### 22.3 Permitted partial scope

When permitted by [FR-PROJ-060](../functional/managed-project-functional-specification-v01.md#fr-proj-060), partial execution uses the explicit resolved/unresolved subsets in §18. The Engine interprets the resulting [DD-1.2 child results](dd-1-2-execution-outcomes-detailed-design-v01.md#_14-partial-completion); callers receive its canonical projection.

## 23. Headless and Interactive Resolution

### 23.1 Headless

Headless candidate selection uses the same request and evidence models; unresolved selection follows the binding below.

<a id="dd-proj-023"></a>

**DD-PROJ-023 — No Headless guess mode**

Candidate ambiguity in Headless resolution applies [FR-INV-020](../functional/application-invocation-functional-specification-v01.md#fr-inv-020).

### 23.2 Interactive assistance

Candidate choice acquisition follows [FR-PROJ-032](../functional/managed-project-functional-specification-v01.md#fr-proj-032) and returns the selection to the explicit-target validation path.

### 23.3 Cross-mode equivalence

Project/context/scope projections follow [Design](../appmanager-design-specification-v01.md#_4-6-presentation-independence).

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

<a id="dd-proj-024"></a>

**DD-PROJ-024 — Host context remains contextual**

Host selections apply [FR-PROJ-006](../functional/managed-project-functional-specification-v01.md#fr-proj-006), [FR-PROJ-044](../functional/managed-project-functional-specification-v01.md#fr-proj-044) and [FR-PROJ-047](../functional/managed-project-functional-specification-v01.md#fr-proj-047).

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

<a id="dd-proj-025"></a>

**DD-PROJ-025 — Stale context fails safe**

Stale project authority follows [FR-PROJ-061](../functional/managed-project-functional-specification-v01.md#fr-proj-061). Refresh/revalidation may restore valid targeting; known-stale assumptions that risk the wrong entity or scope shall not remain execution authority.

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

Project-local diagnostic refinements map through [DD-OUTCLAR-006](dd-1-2-execution-outcomes-detailed-design-v01.md#dd-outclar-006). Recommended local distinctions include:

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

Project-context diagnostics and projections bind [DD-1.2 sensitivity handling](dd-1-2-execution-outcomes-detailed-design-v01.md#_24-sensitive-information-and-redaction) to paths, private repository locations, credential-bearing remotes, configuration and host resources. Internal path/identity evidence may be needed for resolution; caller views select the detail needed for understanding and automation.

## 29. Relationship to Configuration Resolution

Managed Project consumes the staged inputs coordinated by [DD-1.5 §8](dd-1-5-application-engine-detailed-design-v01.md#_8-orchestration-lifecycle). [DD-1.4 §8](dd-1-4-configuration-resolution-detailed-design-v01.md#_8-resolution-context) determines which configuration concerns are eligible at each stage. Before project identity exists, the input is bootstrap effective configuration; later project-aware values can refine project/scope interpretation only through the defined resolution inputs.

### DD-CORE-BOOT-004 — Bootstrap evidence at the project boundary {#dd-core-boot-004}

Apply the [Design project-evidence contract](../appmanager-design-specification-v01.md#_9-6-project-discovery-and-context-resolution) to bootstrap hints and selection constraints: they are inputs to this resolver, not an independently selected project or permission to act. Managed Project retains the identity, topology, ownership, scope and targetability decisions described in this specification; Engine authorization and acceptance remain with DD-1.5.

Later configuration shall not silently replace the selected project with a materially different project. A material conflict with resolved identity, topology or target assumptions shall be returned through [DD-1.2 diagnostics](dd-1-2-execution-outcomes-detailed-design-v01.md#_9-diagnostic-model) to the Engine for explicit handling. Settings persistence does not directly redefine project semantics.

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

Project resolution contributes ambiguity/conflict, support, inclusion/exclusion, unresolved-target, stale-state and targetability evidence through [DD-1.2 diagnostics](dd-1-2-execution-outcomes-detailed-design-v01.md#_9-diagnostic-model). Acceptance follows [Design](../appmanager-design-specification-v01.md#_11-11-workflow-results-failure-and-acceptance).

## 32. Relationship to Application Engine

[DD-1.5 orchestration](dd-1-5-application-engine-detailed-design-v01.md#_8-orchestration-lifecycle) requests the use-case facts in §11, coordinates bootstrap/project-aware configuration, evaluates scope/targetability and accepts the result. Conflict coordination consumes §26. Project resolvers supply the models here under [Design](../appmanager-design-specification-v01.md#_6-2-application-engine-authority).

## 33. Relationship to Shared Capabilities

### 33.1 Resource Access

[DD-2.1](../dd_2_shared_capabilities/dd-2-1-resource-access-detailed-design-v01.md) supplies bounded resource observations for the §7 evidence model.

### 33.2 Repository Capability

[DD-2.3](../dd_2_shared_capabilities/dd-2-3-repository-capability-detailed-design-v01.md) supplies repository facts for the §14 association model.

### 33.3 Nuxt Capability

[DD-2.10](../dd_2_shared_capabilities/dd-2-10-nuxt-capability-detailed-design-v01.md) supplies Nuxt application/layer facts for §§12–13.

### 33.4 Source Intelligence

[DD-2.4](../dd_2_shared_capabilities/dd-2-4-source-intelligence-detailed-design-v01.md) supplies file/structural recognition evidence. All §33 contributors are interpreted through the §7 project-evidence contract.

## 34. Resolver Pattern

This local resolver decomposition refines [Design §6.7](../appmanager-design-specification-v01.md#_6-7-resolvers).

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

The canonical local models are evidence/candidates (§§7–8), context/coherence (§10), root/layer/repository/topology (§§12–15), scope (§§17–18), targetability (§§19–20), partial resolution (§22), freshness (§25) and staged configuration collaboration (§29). Their direct upstream bindings govern inherited rules; this index adds no duplicate invariant list.

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
- AppManager-resource adjacency protection;
- bootstrap configuration cannot depend on the unresolved project identity it helps resolve;
- project/scope-aware configuration becomes eligible only after sufficient Managed Project Context exists.

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

Consuming designs use the collaboration map in §§29–33. Domain operations provide the required project facts and supported scope forms described in §11; shared capabilities supply technical evidence through §7. [DD-1.5](dd-1-5-application-engine-detailed-design-v01.md#_8-orchestration-lifecycle) coordinates eligibility, revalidation and staged configuration rather than delegating project authority to those providers.

## 40. Conformance Criteria

Conformance is assessed against the local models indexed in §35, their canonical references and the test obligations in §37. This section adds no second acceptance checklist.

## 41. Summary Design Rule

The local models answer three increasingly restrictive questions:

```text
What belongs to this project?       -> Managed Project Context
What is this operation targeting?   -> Managed Scope
What effect is permitted here?      -> Targetability / mutability
```

The state distinctions are defined in [§19](#_19-recognition-scope-targetability-and-mutability).
