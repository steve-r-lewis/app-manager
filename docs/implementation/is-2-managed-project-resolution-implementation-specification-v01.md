# IS-2 — Managed Project Resolution Implementation Specification

> **Document type:** Level 4 Implementation Specification
>
> **Status:** Version 1 implementation baseline
>
> **Implementation ID:** IS-2
>
> **Primary Detailed Design:** [DD-1.3 — AppManager Managed Project](../dd_1_application_core/dd-1-3-managed-project-detailed-design-v01.md)
>
> **Related Detailed Designs:** [DD-1.1 — Application Invocation](../dd_1_application_core/dd-1-1-application-invocation-detailed-design-v01.md), [DD-1.2 — Execution Outcomes](../dd_1_application_core/dd-1-2-execution-outcomes-detailed-design-v01.md), [DD-1.4 — Configuration Resolution](../dd_1_application_core/dd-1-4-configuration-resolution-detailed-design-v01.md), [DD-1.5 — Application Engine](../dd_1_application_core/dd-1-5-application-engine-detailed-design-v01.md)
>
> **Active clarification:** [Application Core Bootstrap Resolution](../dd_1_application_core/clarifications/application-core-bootstrap-resolution-clarification-v01.md)
>
> **Primary Functional authority:** [Managed Project Functional Specification](../functional/managed-project-functional-specification-v01.md)
>
> **Application implementation:** [IS-1 — Application Runtime and Invocation](is-1-application-runtime-and-invocation-implementation-specification-v01.md)
>
> **Runtime decision:** [ADR-0001 — Primary Application Runtime](../project_management/decisions/adr-0001-primary-application-runtime.md)
>
> **Register:** [AppManager Implementation Specification](implementation-specification-v01.md)
>
> **Governing plan:** [Implementation Specification Plan](../project_management/implementation-specification-plan-v01.md)

## 1. Purpose

IS-2 defines the concrete Node.js/TypeScript implementation by which AppManager resolves and represents the project being managed, its semantic topology, an operation-specific managed scope, and targetability evidence.

The governing rule is:

> **Managed Project converts bounded evidence into AppManager project knowledge and operation targeting; it never treats discovery, path accessibility, repository recognition or framework recognition as mutation authority.**

The concrete implementation preserves four distinct states:

```text
recognized -> in managed scope -> targetable -> mutable for the requested effect
```

IS-2 determines the first three and contributes evidence relevant to the fourth. IS-1 Application Engine and the owning use case retain final application authority over consequential execution and mutation acceptance.

---

## 2. Scope and Non-Ownership

IS-2 owns concrete implementation for:

- target-project request normalization;
- project evidence and provenance;
- deterministic candidate derivation;
- project-root resolution;
- explicit ambiguity/conflict representation;
- operation-relative project fact requirements;
- managed-project context construction;
- root-application and managed-layer identities;
- project entity and semantic relationship representation;
- repository-to-project-entity associations;
- AppManager management-resource recognition and ownership classification;
- operation-specific managed-scope requests and resolution;
- exclusions and unresolved requested entities;
- targetability evaluation;
- context/scope revision evidence and stale-state checks;
- project/scope diagnostics and normalized evidence for IS-1;
- deterministic Headless-compatible resolution;
- test seams for synthetic evidence and provider substitution.

IS-2 does **not** own:

- application invocation, command dispatch or final outcomes — IS-1;
- configuration candidate applicability, precedence, fallback or effective-value construction — IS-3;
- filesystem access/traversal mechanics — IS-4;
- child-process execution — IS-5;
- repository recognition/primitives — IS-6;
- source structural recognition — IS-7;
- Nuxt recognition mechanics — IS-13;
- domain command semantics — IS-14 through IS-21;
- TUI/Headless selection/prompting — IS-22;
- process/runtime assembly — IS-23;
- generic workspace management, IDE workspace semantics or arbitrary project-detection plugins.

A path, repository or Nuxt structure may be evidence without becoming project identity or scope authority.

---

## 3. Concrete Module Boundary

The target Version 1 layout is:

```text
app/
└── application/
    └── managed-project/
        ├── managed-project.ts
        ├── contracts/
        │   ├── project-request.ts
        │   ├── project-evidence.ts
        │   ├── project-identity.ts
        │   ├── project-entities.ts
        │   ├── project-topology.ts
        │   ├── managed-project-context.ts
        │   ├── project-requirements.ts
        │   ├── managed-scope.ts
        │   ├── targetability.ts
        │   └── project-resolution-results.ts
        ├── resolution/
        │   ├── evidence-collector.ts
        │   ├── candidate-resolver.ts
        │   ├── project-root-resolver.ts
        │   ├── context-builder.ts
        │   ├── repository-association-resolver.ts
        │   ├── scope-resolver.ts
        │   └── targetability-evaluator.ts
        ├── freshness/
        │   └── project-revalidator.ts
        └── diagnostics/
            └── project-diagnostics.ts
```

Placement follows semantic ownership, not consumer count. Managed Project contracts remain owned under this boundary even when every domain consumes them. They shall not be moved into a global `app/types/` dumping ground merely because they are widely shared.

The responsibility files above need not map one-to-one to classes. A simpler implementation is permitted where ownership and test seams remain explicit.

---

## 4. Public Managed Project Contract

IS-1 shall consume IS-2 through an application-level interface structurally equivalent to:

```ts
export interface ManagedProjectResolver {
  resolveContext(request: ProjectResolutionRequest): Promise<ProjectResolutionResult>;
  resolveScope(request: ManagedScopeResolutionRequest): Promise<ManagedScopeResolutionResult>;
  evaluateTargetability(request: TargetabilityRequest): Promise<TargetabilityResult>;
  revalidate(request: ProjectRevalidationRequest): Promise<ProjectRevalidationResult>;
}
```

The interface exposes application-oriented values only. It does not expose Node `Dirent`, raw Git results, Nuxt parser/provider objects, filesystem handles or provider exceptions.

`resolveContext()` is read-only with respect to the managed project. `resolveScope()` and `evaluateTargetability()` are semantic resolution operations, not mutation operations.

IS-2 never performs the domain effect whose targetability it evaluates.

---

## 5. Target Project Request

The target request shall preserve explicit caller intent without treating it as already authoritative:

```ts
export interface TargetProjectRequest {
  readonly explicitLocation?: ProjectLocationHint;
  readonly selectedResource?: ProjectResourceHint;
  readonly selectedLayer?: LayerSelector;
  readonly selectedRepository?: RepositorySelector;
  readonly hostContext?: readonly HostProjectHint[];
  readonly invocationLocation?: ProjectLocationHint;
  readonly otherHints?: readonly ProjectTargetHint[];
}
```

IS-22 translates host-specific selections into these AppManager-facing hints. IS-1 supplies the normalized request plus the bootstrap-effective configuration input allowed by the staged DD-1 clarification.

Absolute/relative path normalization occurs before technical inspection, but normalization does not establish project identity.

An explicit target receives strong provenance and must be reconciled with project evidence. A materially conflicting project is not silently substituted.

---

## 6. Project Evidence

### 6.1 Evidence contract

```ts
export interface ProjectEvidence<T = unknown> {
  readonly id: ProjectEvidenceId;
  readonly kind: ProjectEvidenceKind;
  readonly value: T;
  readonly provenance: ProjectEvidenceProvenance;
  readonly certainty: 'observed' | 'derived' | 'reported';
  readonly applicability?: EvidenceApplicability;
  readonly revision?: EvidenceRevision;
  readonly diagnostics?: readonly Diagnostic[];
}
```

Evidence kinds initially cover:

- explicit invocation target;
- invocation location;
- normalized host selection;
- eligible bootstrap configuration hint;
- AppManager management metadata;
- Resource Access inspection facts;
- Repository Capability recognition/facts;
- Nuxt Capability recognition/facts;
- approved project-associated resource facts;
- prior-context evidence submitted for revalidation.

### 6.2 Evidence ownership

Evidence is immutable after collection. Provider-native results are normalized by their owning capability before entering this model.

IS-2 shall not infer authority from confidence labels. `certainty` describes how a fact was obtained; candidate/project policy decides its semantic weight.

Provenance is retained when needed for conflict explanation, stale-state detection or policy. It shall not be discarded merely because two observations currently agree.

---

## 7. Evidence Acquisition

`EvidenceCollector` coordinates bounded read-only calls required by declared project requirements. It is not a generic scanner.

It may consume:

- IS-4 Resource Access for bounded path/resource facts;
- IS-6 Repository Capability for repository recognition and relationships;
- IS-13 Nuxt Capability for root/layer recognition;
- IS-7 Source Intelligence only where source structural facts are genuinely required;
- AppManager-owned management-resource readers through their owning capability/resource boundary.

Rules:

1. acquisition is requirement-driven; do not scan every accessible subtree by default;
2. all provider calls are read-only during context resolution;
3. accessibility does not imply inclusion;
4. discovery of neighbouring repositories/layers does not expand an already bounded scope;
5. capability failures are normalized as evidence/diagnostics, not thrown through as provider semantics;
6. cancellation from IS-1 is propagated to capability calls that support it;
7. evidence acquisition must not invoke Git fetch/pull, package install, Nuxt generation, source transformation or other consequential repair merely to improve recognition.

---

## 8. Project Candidate Model

A candidate is a coherent hypothesis, not an authoritative context:

```ts
export interface ProjectCandidate {
  readonly id: ProjectCandidateId;
  readonly proposedIdentity: ProjectIdentity;
  readonly proposedRoot: ProjectRoot;
  readonly supportingEvidence: readonly ProjectEvidenceId[];
  readonly contradictoryEvidence: readonly ProjectEvidenceId[];
  readonly rootApplication?: RootApplicationEvidence;
  readonly layers: readonly ManagedLayerEvidence[];
  readonly repositories: readonly RepositoryAssociationEvidence[];
  readonly unresolved: readonly ProjectRequirement[];
  readonly support: ProjectSupportAssessment;
}
```

Candidate identity shall be deterministic from material project identity inputs; it shall not depend on discovery array position.

The resolver may assign an opaque correlation ID separately if needed for interactive selection.

---

## 9. Deterministic Candidate Resolution

Version 1 shall implement explicit ordered resolution policy rather than an opaque numerical confidence score.

The resolver shall first partition evidence into coherent candidate roots/identities, then apply ordered policy such as:

1. reject candidates incompatible with a validated explicit target;
2. prefer a candidate supported by valid AppManager-owned identity metadata when it agrees with observed reality;
3. require semantic Nuxt/project evidence appropriate to the requested operation rather than path containment alone;
4. use repository evidence to strengthen relationships, never to replace project identity;
5. use invocation location/host workspace as contextual evidence, not final authority;
6. retain ambiguity when two materially different candidates remain valid under the same policy tier.

The exact helper functions are Level 4 implementation detail, but the policy must be visible and covered by table-driven tests. Incidental directory enumeration order, object insertion order and provider response order shall not choose the winner.

A later policy change that changes observable candidate selection must be treated as application behaviour and reviewed against DD-1.3/Functional authority.

---

## 10. Project Root Resolution

`ProjectRootResolver` derives the logical AppManager project root from the selected candidate.

The root is represented as a normalized absolute resource reference from IS-4 plus a semantic project-root identity. `process.cwd()` never appears inside the resolver; invocation location arrives as evidence.

Resolution supports nested invocation from root subdirectories, managed layers, files, repository subtrees and host-selected resources where evidence is sufficient.

Root validation shall verify only facts required by the operation, including where applicable:

- resource accessibility;
- supported project structure;
- consistency with explicit target;
- absence of unresolved identity conflict;
- required root application/project markers through owning capabilities.

A Git worktree root or Nuxt application root may coincide physically with the project root but remains a distinct semantic fact.

---

## 11. Resolution Result States

Context resolution shall use an explicit discriminated result:

```ts
export type ProjectResolutionResult =
  | { readonly state: 'resolved'; readonly context: ManagedProjectContext }
  | { readonly state: 'ambiguous'; readonly candidates: readonly ProjectCandidateSummary[]; readonly diagnostics: readonly Diagnostic[] }
  | { readonly state: 'conflicting'; readonly conflicts: readonly ProjectEvidenceConflict[]; readonly diagnostics: readonly Diagnostic[] }
  | { readonly state: 'insufficient'; readonly missing: readonly ProjectRequirement[]; readonly diagnostics: readonly Diagnostic[] }
  | { readonly state: 'unsupported'; readonly diagnostics: readonly Diagnostic[] }
  | { readonly state: 'inaccessible'; readonly diagnostics: readonly Diagnostic[] }
  | { readonly state: 'cancelled'; readonly diagnostics: readonly Diagnostic[] }
  | { readonly state: 'failed'; readonly diagnostics: readonly Diagnostic[] };
```

Ambiguous, conflicting, insufficient and unsupported are not generic exceptions. IS-1 interprets them according to the use case and interaction capabilities.

Interactive candidate selection occurs through IS-22/IS-1 and re-enters IS-2 as explicit validated target evidence. IS-2 never prompts.

---

## 12. Project Identity

`ProjectIdentity` is application-level and stable within a coherent project interpretation.

Version 1 shall not derive identity solely from an absolute path because projects can move and because root path is not the root application identity.

Identity shall use, in priority order when available:

- valid AppManager-owned stable project identity metadata;
- otherwise a deterministic ephemeral identity derived from normalized semantic root evidence for the current resolution.

An ephemeral identity is explicitly marked as such and must not be persisted as a durable cross-move identifier.

IS-2 shall not invent or write stable project metadata during read-only resolution. Creating durable AppManager project identity is a separate authorized application operation.

---

## 13. Managed Project Context

The resolved context is immutable/read-only to consumers:

```ts
export interface ManagedProjectContext {
  readonly identity: ProjectIdentity;
  readonly root: ProjectRoot;
  readonly rootApplication?: RootApplication;
  readonly layers: ReadonlyMap<LayerId, ManagedLayer>;
  readonly repositories: ReadonlyMap<ProjectRepositoryId, ProjectRepository>;
  readonly entities: ReadonlyMap<ProjectEntityId, ProjectEntity>;
  readonly topology: ProjectTopology;
  readonly managementResources: readonly ManagementResource[];
  readonly exclusions: readonly ProjectExclusion[];
  readonly support: ProjectSupportAssessment;
  readonly revision: ProjectContextRevision;
  readonly diagnostics: readonly Diagnostic[];
  readonly evidence: ProjectEvidenceView;
}
```

Concrete runtime values may use readonly arrays/records rather than `ReadonlyMap` if serialization/testing is materially simpler. The semantic requirement is immutable consumption and stable identity lookup.

The context is knowledge, not a permission set.

---

## 14. Operation-Specific Project Requirements

IS-1/domain use cases shall declare the project facts needed for availability, validation, execution or targetability:

```ts
export interface ProjectRequirements {
  readonly projectRoot?: RequirementLevel;
  readonly rootApplication?: RequirementLevel;
  readonly layers?: LayerRequirement;
  readonly repositories?: RepositoryRequirement;
  readonly managementResources?: ResourceRequirement;
  readonly ownership?: OwnershipRequirement;
  readonly topology?: TopologyRequirement;
  readonly managedScope?: ScopeRequirement;
  readonly targetability?: TargetabilityRequirement;
}
```

`RequirementLevel` distinguishes `required`, `optional` and `not_required` where useful.

This declaration prevents IS-2 from turning every invocation into a full-project crawl. A Git operation on one selected layer may require that layer and its repository association; an application identity query may not require repository discovery at all.

Requirements are application/domain intent. Capabilities do not expand them because additional facts are technically obtainable.

---

## 15. Root Application and Managed Layers

`RootApplication` and `ManagedLayer` are distinct entity kinds with stable application identities.

They shall contain AppManager-oriented references to:

- normalized location;
- Nuxt recognition evidence reference;
- project relationship;
- repository associations where resolved;
- relevant resource relationships where required;
- support status;
- lifecycle facts only where actually known.

A layer identity shall not be its presentation index. Version 1 shall prefer a stable AppManager metadata identity when present; otherwise use a deterministic identity derived from normalized project-relative semantic location plus recognized layer identity facts, explicitly marked non-durable where appropriate.

The model does not assume root and layers share a repository, package, version or release lifecycle.

---

## 16. Project Entity Model

IS-2 shall use a discriminated entity model rather than an untyped graph node:

```ts
export type ProjectEntity =
  | ManagedProjectEntity
  | RootApplicationEntity
  | ManagedLayerEntity
  | RepositoryEntity
  | ManagementResourceEntity
  | SourceCollectionEntity
  | DocumentationCollectionEntity
  | TestCollectionEntity
  | GeneratedArtifactEntity
  | ConfigurationResourceEntity
  | OtherApprovedProjectEntity;
```

Every entity has:

- stable operation-local identity;
- kind;
- resource/location references where applicable;
- ownership classification;
- support status;
- evidence references.

New entity kinds require an approved semantic owner; providers cannot introduce arbitrary public node kinds by returning strings.

---

## 17. Project Topology

Version 1 shall implement topology as an adjacency-list graph over typed entity IDs:

```ts
export interface ProjectRelationship {
  readonly id: ProjectRelationshipId;
  readonly kind: ProjectRelationshipKind;
  readonly from: ProjectEntityId;
  readonly to: ProjectEntityId;
  readonly evidence: readonly ProjectEvidenceId[];
}
```

Initial relationship kinds cover the DD-1.3 semantics actually required by Version 1, including semantic containment/belonging, root-layer use/extension, repository association, AppManager ownership, generation, exclusion and dependency where approved.

The implementation shall not introduce a generic graph framework/library unless ordinary maps/arrays prove insufficient. Topology is an AppManager semantic model, not a general graph platform.

Filesystem parent/child relationships are added only when they have application meaning; the filesystem tree is not copied wholesale into topology.

---

## 18. Repository Associations

Repository association consumes IS-6 normalized repository facts and maps them to project entities.

`ProjectRepository` shall preserve:

- IS-2 project repository identity;
- IS-6 local repository reference/identity;
- associated project entity IDs;
- parent/nested relationship where relevant;
- remote identity evidence only when required;
- ambiguity/support status;
- evidence provenance.

One repository may associate with multiple entities; one entity may have multiple relevant repository relationships where the use case supports that structure; entities may have no repository.

Nested path containment is evidence, not sufficient semantic association when stronger evidence conflicts.

A consequential repository use case that requires one exact association receives `repository-association-missing` or `repository-association-ambiguous` evidence rather than IS-2 selecting `origin`, nearest repository or first discovered repository by convenience.

---

## 19. AppManager Management Resources and Ownership

Ownership shall be explicit:

```ts
export type OwnershipClassification =
  | 'appmanager_owned'
  | 'user_authored'
  | 'framework_owned'
  | 'external'
  | 'generated_not_appmanager_owned'
  | 'unknown';
```

Ownership is resource-specific and never inherited from parent/sibling/repository adjacency.

AppManager metadata may contribute strong project identity/topology evidence, but stale metadata that conflicts with observed reality produces conflict/stale evidence. Read-only resolution shall not repair metadata automatically.

Credential-bearing resources and unrelated host workspace resources shall not be incorporated merely because they are accessible.

---

## 20. Managed Scope Request

The scope request is application intent, not the final target set:

```ts
export type ManagedScopeSelector =
  | { readonly kind: 'whole_project' }
  | { readonly kind: 'root_application' }
  | { readonly kind: 'all_layers' }
  | { readonly kind: 'layers'; readonly ids: readonly LayerId[] }
  | { readonly kind: 'repositories'; readonly ids: readonly ProjectRepositoryId[] }
  | { readonly kind: 'entities'; readonly ids: readonly ProjectEntityId[] }
  | { readonly kind: 'resources'; readonly resources: readonly ProjectResourceSelector[] };

export interface ManagedScopeRequest {
  readonly command: CommandIdentity;
  readonly selector: ManagedScopeSelector;
  readonly explicitExclusions?: readonly ProjectEntitySelector[];
  readonly partialExecutionPolicy: 'forbidden' | 'use_case_may_accept';
}
```

Domain use cases may define a narrower typed selector and translate it into this shared contract. Unsupported selector kinds fail validation rather than falling back to whole-project scope.

---

## 21. Scope Resolution

`ScopeResolver` evaluates the request against:

- the immutable Managed Project Context;
- owning command/use-case semantics supplied through approved scope policy input;
- explicit caller targeting;
- IS-3 operation-effective configuration;
- project exclusions;
- ownership facts;
- support state;
- application safety constraints supplied by IS-1/use case.

The resolved scope is structurally equivalent to:

```ts
export interface ManagedScope {
  readonly id: ManagedScopeId;
  readonly request: ManagedScopeRequest;
  readonly included: readonly ProjectEntityId[];
  readonly excluded: readonly ScopedExclusion[];
  readonly unresolved: readonly UnresolvedScopeTarget[];
  readonly complete: boolean;
  readonly revision: ManagedScopeRevision;
  readonly evidence: readonly ProjectEvidenceId[];
  readonly diagnostics: readonly Diagnostic[];
}
```

Included IDs are deterministic and deduplicated. Ordering may be canonicalized for stable output/tests but does not grant priority.

A consequential use case cannot cross the IS-1 scope gate until scope is sufficiently complete under its approved partial-execution policy.

---

## 22. Scope Narrowing and Expansion Rules

Scope narrowing is implemented as set intersection/validated selector refinement, not as rediscovery.

Rules:

1. narrowing may remove targets but cannot add targets outside the prior valid scope;
2. narrowing one dimension never compensates by broadening another;
3. newly discovered related entities remain context only;
4. explicit exclusions remain excluded unless the owning use case has a separately authorized override contract;
5. duplicate selectors do not duplicate effects;
6. an empty resolved scope is explicit and is not replaced with a default broader scope;
7. unknown requested entities remain unresolved rather than silently dropped.

If later evidence invalidates the scope assumptions, the scope becomes stale and must be revalidated; it is never silently expanded.

---

## 23. Partial Scope

A scope result with unresolved requested targets is explicitly partial.

Default Version 1 behaviour for consequential operations is `partialExecutionPolicy: 'forbidden'`.

Where a domain Functional/Detailed Design explicitly permits partial execution, the use case may set `use_case_may_accept`; IS-2 still returns both resolved and unresolved targets. IS-1/use-case acceptance then decides whether execution may proceed and DD-1.2 reports the eventual partial completion.

IS-2 never interprets “some targets resolved” as authorization to run against those targets.

---

## 24. Targetability

Targetability is evaluated per requested command/effect and scoped entity:

```ts
export type TargetabilityDecision =
  | { readonly state: 'targetable'; readonly evidence: readonly ProjectEvidenceId[] }
  | { readonly state: 'conditional'; readonly conditions: readonly TargetCondition[]; readonly diagnostics: readonly Diagnostic[] }
  | { readonly state: 'not_targetable'; readonly diagnostics: readonly Diagnostic[] }
  | { readonly state: 'unsupported'; readonly diagnostics: readonly Diagnostic[] }
  | { readonly state: 'indeterminate'; readonly diagnostics: readonly Diagnostic[] };
```

Inputs include command identity, effect class, entity kind, scope membership, ownership, exclusions, support status, operation-effective configuration/policy facts, freshness and authorization prerequisites where relevant.

`targetable` means IS-2 found no Managed Project targeting prohibition. It is not final mutation authorization. IS-1/use case still applies domain policy, safety, authorization and current-state preconditions.

A capability provider shall never be asked “is this in AppManager scope?” as a substitute for IS-2 targetability.

---

## 25. Configuration Collaboration

IS-2 and IS-3 collaborate only through the accepted staged contract.

### 25.1 Before project identity

`resolveContext()` may receive a `BootstrapProjectConfiguration` projection from IS-3 containing only concerns whose applicability/effective value do not depend on the unresolved project/topology/scope.

IS-2 does not query IS-3 recursively while resolving the project.

### 25.2 After sufficient context

IS-1 supplies the resolved `ManagedProjectContext` to IS-3. IS-3 returns an operation-effective configuration snapshot. IS-1 then supplies the relevant project/scope policy projection back to IS-2 for scope/targetability resolution.

Configuration can refine exclusions/targeting only through declared inputs. It cannot silently replace the selected project.

### 25.3 Material conflict

If operation-effective configuration contradicts a material bootstrap assumption or selected project identity, IS-2 returns revalidation/conflict evidence to IS-1. No uncontrolled IS-2 <-> IS-3 recursion is permitted.

---

## 26. Freshness and Revision Evidence

Version 1 shall not compute one global project hash.

`ProjectContextRevision` and `ManagedScopeRevision` shall instead contain bounded revision evidence for facts material to the operation, for example:

- AppManager metadata resource revision;
- required root/layer resource revisions;
- repository identity/revision evidence;
- required Nuxt recognition inputs;
- relationship/resource existence facts.

The revision object also carries a deterministic fingerprint produced with Node `crypto.createHash('sha256')` over canonicalized non-secret material evidence IDs/revisions. The fingerprint is an efficient comparison token, not proof that the entire project is unchanged.

Sensitive values are excluded from fingerprint input where their presence is unnecessary.

---

## 27. Revalidation

`ProjectRevalidator` rechecks only material assumptions declared by the use case/context revision.

Result states:

```ts
export type ProjectRevalidationResult =
  | { readonly state: 'current'; readonly revision: ProjectContextRevision }
  | { readonly state: 'changed'; readonly changes: readonly MaterialProjectChange[]; readonly diagnostics: readonly Diagnostic[] }
  | { readonly state: 'indeterminate'; readonly diagnostics: readonly Diagnostic[] }
  | { readonly state: 'cancelled'; readonly diagnostics: readonly Diagnostic[] };
```

For consequential operations, IS-1/use case requests revalidation at the latest safe point when project assumptions may have changed.

A changed result does not auto-refresh and continue. IS-1/use case decides whether to refresh/revalidate policy/authorization, suspend, or fail. This prevents stale context from silently changing the target set after approval.

---

## 28. Cancellation, Concurrency and Caching

IS-2 accepts the invocation `AbortSignal` for technical evidence acquisition and returns `cancelled` without claiming rollback.

Resolvers are stateless per call except for injected immutable provider dependencies. Shared mutable project context is not stored in a singleton.

Version 1 may use an invocation-local memoization cache for repeated evidence requests during one resolution lifecycle. Cross-invocation caching is not required initially because stale topology/scope evidence has safety consequences.

If later introduced, cross-invocation cache entries must carry revision/provenance and cannot become authority without freshness validation.

IS-2 does not globally lock projects. It reports revision/conflict evidence; IS-1 owns serialization/rejection/refresh policy for overlapping invocations.

---

## 29. Diagnostics

IS-2 maps project states into DD-1.2 canonical diagnostics through IS-1-owned diagnostic contracts.

Initial stable project codes shall include:

```text
PROJ_TARGET_NOT_FOUND
PROJ_INVALID_EXPLICIT_TARGET
PROJ_AMBIGUOUS
PROJ_EVIDENCE_CONFLICT
PROJ_UNSUPPORTED_STRUCTURE
PROJ_RESOURCE_INACCESSIBLE
PROJ_INVALID_ROOT
PROJ_REQUIRED_CONTEXT_MISSING
PROJ_LAYER_UNKNOWN
PROJ_LAYER_AMBIGUOUS
PROJ_REPOSITORY_ASSOCIATION_MISSING
PROJ_REPOSITORY_ASSOCIATION_AMBIGUOUS
PROJ_SCOPE_RESOLUTION_FAILED
PROJ_SCOPE_PARTIAL_UNRESOLVED
PROJ_TARGET_EXCLUDED
PROJ_TARGET_UNMANAGED
PROJ_TARGET_NOT_TARGETABLE
PROJ_TARGET_NOT_MUTABLE
PROJ_CONTEXT_STALE
PROJ_RESOLUTION_CANCELLED
PROJ_RESOLUTION_FAILED
```

These are codes, not a second diagnostic category taxonomy. They map to DD-1.2/IS-1 categories and severities.

Diagnostics preserve safe evidence references and recovery guidance where known. Provider-native exception text is not a machine contract.

---

## 30. Sensitive Information

Internal context may require absolute paths and private repository identities. Caller-visible projections shall minimize disclosure.

IS-2 shall:

- never include credentials embedded in repository URLs;
- use IS-6 sanitized remote identities;
- avoid copying configuration values into evidence unless the value is required for project semantics and safe to retain;
- avoid including unrelated host workspace resources;
- mark path/repository diagnostics with appropriate IS-1 diagnostic sensitivity where required;
- not persist full context/evidence by default;
- ensure fingerprints do not contain secret material.

---

## 31. Relationship to Application Runtime and Invocation

IS-1 owns when and why IS-2 is invoked.

The concrete collaboration is:

```text
IS-1 normalized invocation
        |
        +--> IS-3 bootstrap-effective configuration
        |
        v
IS-2 resolveContext(requirements, target request, bootstrap projection)
        |
        v
ManagedProjectContext / unresolved state
        |
        +--> IS-3 operation-effective configuration
        |
        v
IS-2 resolveScope(...)
        |
        v
IS-2 evaluateTargetability(...)
        |
        v
IS-1/use-case safety + authorization + execution gate
```

IS-1 accepts/rejects IS-2 results and publishes final outcomes. IS-2 never executes a domain workflow or publishes final AppManager success.

---

## 32. Relationship to Shared Capabilities

### 32.1 Resource Access

IS-4 supplies bounded resource facts/revisions. IS-2 decides what those facts mean to project identity and scope. `exists(path)` never means “managed”.

### 32.2 Repository Capability

IS-6 supplies repository recognition, identity, relationship and revision evidence. IS-2 maps repositories to project entities. IS-6 never chooses project scope or mutation authority.

### 32.3 Nuxt Capability

IS-13 supplies Nuxt application/layer recognition facts. IS-2 decides whether recognized structures belong to this managed project and how they relate semantically.

### 32.4 Source Intelligence

IS-7 may supply read-only structural evidence where a declared project requirement genuinely needs it. IS-2 shall not depend on source scanning merely because it is available.

---

## 33. Headless, Interactive and Host Behaviour

IS-2 contains no interaction-mode branches.

Given materially equivalent normalized evidence/configuration, Headless, TUI, IDE and automation paths obtain materially equivalent candidates/context/scope.

When ambiguity remains:

- IS-2 returns `ambiguous` plus bounded candidate summaries;
- IS-1 determines whether the invocation can request disambiguation;
- IS-22 may present the candidates and collect explicit selection;
- selection re-enters normal validation as explicit target evidence.

Headless never selects candidate zero/nearest/first merely because no user is present.

---

## 34. Testing and Conformance

### 34.1 Resolver unit tests

Vitest tests with synthetic evidence and fake capabilities shall verify at least:

1. explicit target is strong evidence but validated;
2. conflicting explicit target is never silently replaced;
3. invocation location is not project authority;
4. nested file/directory/layer invocation resolves when evidence is sufficient;
5. candidate derivation is independent of evidence/provider ordering;
6. equivalent evidence yields equivalent selection;
7. equal-policy candidates remain ambiguous;
8. stale AppManager metadata conflicts with observed reality rather than overriding it;
9. logical project root remains distinct from root application identity;
10. root and layer identities remain distinct;
11. layers may use independent repositories/lifecycles;
12. repository identity never substitutes for project identity;
13. one repository can map to several project entities;
14. ambiguous repository association remains explicit;
15. topology uses semantic relationships rather than directory containment alone;
16. management-resource ownership does not propagate by adjacency;
17. required-fact declarations prevent unrelated full-project scanning;
18. optional unresolved facts do not fail an otherwise sufficient context;
19. required unresolved facts do fail safely;
20. whole-project/layer/repository/entity/resource scope selectors resolve deterministically;
21. unknown scope targets remain unresolved;
22. scope narrowing cannot broaden another dimension;
23. discovery after scope resolution does not expand scope;
24. exclusions survive discovery;
25. empty scope is not replaced with whole project;
26. partial consequential scope defaults to forbidden;
27. permitted partial scope still reports unresolved targets;
28. recognized/in-scope/targetable/mutable distinctions remain separate;
29. targetability never substitutes for final IS-1 authorization;
30. bootstrap configuration accepted by IS-2 is project-independent;
31. project-aware configuration is consumed only after context exists;
32. material bootstrap/project/config conflict returns revalidation evidence;
33. revalidation checks only material declared facts;
34. stale material context does not auto-refresh and continue;
35. cancellation stops further evidence acquisition where supported;
36. no resolver performs consequential provider operations;
37. sensitive remote/path/config information is bounded in diagnostics;
38. provider failures are normalized and do not become final AppManager outcomes.

### 34.2 Integration tests with real temporary resources

Where practical, integration tests shall construct temporary project trees covering:

- root invocation and nested invocation;
- root app plus one/multiple layers;
- independent/nested local Git repositories;
- unmanaged neighbouring directories;
- AppManager management resources beside user resources;
- missing/deleted selected resources;
- topology change between resolution and revalidation.

Tests use real IS-4 local resource mechanics and local Git repositories through IS-6 where those implementations are available. No network, live GitHub account, real AI provider or TUI is required.

### 34.3 Cross-mode tests

IS-22/IS-1 contract tests shall prove that equivalent normalized target hints produce the same IS-2 result regardless of interaction adapter.

---

## 35. Legacy Implementation Disposition

The current repository has very little genuine Managed Project implementation. Most project semantics are implicit in a `targetRoot` string and command/provider-local checks. Those mechanisms are useful evidence but cannot be retained as the target authority model.

| Current artefact / responsibility | Disposition | Target owner/location | Preserved value | Required change |
|---|---|---|---|---|
| root `index.ts` `targetRoot = process.cwd()` | SPLIT / RELOCATE | IS-23 invocation fact -> IS-22/IS-1 target hint -> IS-2 evidence | caller working directory is useful evidence | stop treating cwd as authoritative project root; preserve provenance as invocation-location evidence |
| `app/index.ts` `main(targetRoot, toolRoot)` | REPLACE / RELOCATE | IS-1 execution context + IS-2 context | explicit target/tool separation intent | project-dependent operations receive `ManagedProjectContext`, not an assumed root string |
| `BaseCommand.execute(targetRoot, ...)` | REPLACE | IS-1/domain use-case + IS-2 context/scope | commands currently receive target location | use typed project requirements/context/scope; no private project interpretation from path |
| `BaseCommand.isEnabled(targetRoot)` | SPLIT / RELOCATE | IS-1 availability + IS-2/capability evidence | contextual availability intent | availability declares required project facts and consumes structured resolution; no Boolean path/provider probing as project semantics |
| `runApp.ts` package.json-at-target-root availability | SPLIT / RELOCATE | App Domain + IS-2/IS-4 evidence | package marker is useful technical evidence | package presence alone cannot define managed project/root/application; App use case consumes resolved context |
| Git command repository checks against `targetRoot` | SPLIT / RELOCATE | Git Domain + IS-2 repository association + IS-6 | useful repository recognition checks | exact managed repository comes from project scope/association; Git recognition is not project authority |
| `headlessMode.ts` passing targetRoot | RELOCATE | IS-22 normalized invocation hint | deterministic non-interactive target contribution | submit hint; IS-2 resolves or returns ambiguity/failure |
| `interactiveMode.ts` passing targetRoot | RELOCATE | IS-22 normalized invocation hint | interactive target contribution | same IS-2 semantics as Headless; interaction only disambiguates returned candidates |
| direct `path.join(targetRoot, ...)` in commands | SPLIT / RELOCATE | IS-2 entity/resource references + owning capability/domain | useful known resource conventions where semantically valid | derive resources from resolved context; do not assume all targets are root-relative or one uniform tree |
| command-local repository/layer/resource discovery | SPLIT / RELOCATE | IS-2 evidence/context plus owning capability | existing recognition logic may be reusable | centralize project interpretation; retain provider-specific recognition only behind capability boundaries |
| `app/resolvers/settingsResolver.ts` empty placeholder | REPLACE | IS-3 Configuration Resolution | resolver naming indicates intended pattern only | no implementation to preserve; do not turn it into a generic resolver framework or Managed Project owner |
| absence of managed-project context model | REPLACE / ADD | `app/application/managed-project/contracts/` | none | implement explicit identity/entities/topology/evidence/context contracts |
| absence of managed-scope model | REPLACE / ADD | IS-2 scope contracts/resolver | none | implement explicit included/excluded/unresolved/revision model before consequential effects |
| service/provider singletons used by commands | REPLACE | IS-23 explicit composition | current technical mechanisms may survive in owning ISs | IS-2 receives injected capability contracts; no singleton project discovery |
| tests using fixed `/mock/root` as project semantics | SPLIT / RELOCATE | IS-2 synthetic/integration tests + domain tests | convenient test fixtures | distinguish path hint from resolved project identity/context/scope |

The limited current implementation means IS-2 is primarily a new application-core subsystem, but it still preserves useful existing evidence acquisition behind the correct capability/domain boundaries rather than rewriting those mechanisms unnecessarily.

---

## 36. Migration Sequence

Implementation should proceed in this order:

1. add IS-2 project request/evidence/identity/result contracts and diagnostics;
2. add immutable project entity/context/topology contracts with synthetic tests;
3. implement project requirements and requirement-driven `EvidenceCollector` against fake IS-4/IS-6/IS-13 providers;
4. implement deterministic candidate and root resolution with explicit ambiguity/conflict states;
5. implement context builder and repository-association resolver;
6. implement Managed Scope request/result contracts, exclusions and deterministic scope resolver;
7. implement targetability decisions and ownership classifications;
8. implement bounded context/scope revision fingerprints and revalidation;
9. integrate IS-2 with IS-1 staged execution using fake IS-3 bootstrap/operation configuration projections;
10. integrate concrete IS-4, IS-6 and IS-13 evidence providers as their contracts are reduced to code;
11. migrate domains from `targetRoot`/private discovery to declared `ProjectRequirements` and resolved context/scope;
12. migrate IS-22 adapters so cwd/host selection become target hints rather than root authority;
13. add temporary-tree/local-repository integration tests;
14. remove legacy command-local project/root/repository authority only after each owning domain has migrated.

A temporary adapter may create a minimal `ProjectResolutionRequest` from legacy `targetRoot` callers during migration, but the value must be marked explicit/invocation-location evidence and still pass IS-2 validation. It shall not construct a fake resolved context by asserting `projectRoot = targetRoot`.

---

## 37. Traceability

| Governing area | IS-2 implementation |
|---|---|
| DD-PROJ-001–003 | explicit target request + immutable provenance-rich evidence; validation and evidence/authority separation |
| DD-PROJ-004–005 | deterministic ordered candidate policy; explicit ambiguity independent of discovery order |
| DD-PROJ-006 | logical project-root resolver; cwd only invocation evidence |
| DD-PROJ-007–008 | immutable `ManagedProjectContext`; one coherent context per operation |
| DD-PROJ-009 | `ProjectRequirements` drives minimal sufficient evidence acquisition |
| DD-PROJ-010–011 | distinct root-application/layer identities and independent lifecycle/repository representation |
| DD-PROJ-012 | IS-6 repository facts mapped into subordinate project associations, never project identity |
| DD-PROJ-013 | typed semantic adjacency graph; no filesystem-tree authority |
| DD-PROJ-014 | explicit resource-specific ownership classification; no adjacency propagation |
| DD-PROJ-015–018 | validated Managed Scope request, deterministic resolution, monotonic narrowing and no discovery expansion |
| DD-PROJ-019–020 | recognized/in-scope/targetable/mutable states remain distinct |
| DD-PROJ-021 | exclusions preserved as first-class scope/context facts |
| DD-PROJ-022 | partial scope explicit; consequential default forbids partial execution |
| DD-PROJ-023–024 | no interaction branches; ambiguity returned to IS-1/IS-22; host context remains evidence |
| DD-PROJ-025 | bounded revision evidence, SHA-256 comparison fingerprint and explicit revalidation result |
| DD-1.3 Sections 26–28 | IS-1 owns conflict coordination; IS-2 normalized diagnostics and sensitive projections |
| DD-1.3 Sections 29–33 | explicit staged IS-3 collaboration and bounded IS-4/IS-6/IS-7/IS-13 evidence dependencies |
| DD-1.3 Section 34 | resolver responsibilities implemented directly; no generic resolver framework |
| DD-1.3 Section 35 | all sixteen invariants retained as implementation rules/tests |
| bootstrap clarification | only project-independent bootstrap configuration enters initial resolution; later config cannot recursively redefine project identity |
| IS-1 | project requirements/context/scope/targetability plug into the authoritative invocation lifecycle without taking final outcome authority |

IS-2 also implements the Managed Project Functional Specification's observable requirements for deterministic project identity/context resolution, nested invocation, multi-repository topology, managed scope, ownership protection, cross-mode equivalence, partial-scope safety and stale-context handling.

---

## 38. Version 1 Implementation Baseline

The Version 1 Managed Project path is:

```text
IS-1 invocation intent + ProjectRequirements
        |
        +--> IS-3 project-independent bootstrap configuration
        |
        v
TargetProjectRequest
        |
        v
requirement-driven read-only evidence acquisition
  IS-4 resources / IS-6 repositories / IS-13 Nuxt / approved evidence
        |
        v
deterministic candidates -> ambiguity/conflict gate
        |
        v
logical ProjectRoot + immutable ManagedProjectContext
        |
        +--> IS-3 project/scope-aware operation configuration
        |
        v
ManagedScopeRequest -> exclusions/unresolved -> ManagedScope
        |
        v
TargetabilityDecision
        |
        v
IS-1/use-case policy + safety + authorization + stale-state gate
        |
        v
consequential capability execution
```

The non-drift rule is:

> **Version 1 may discover project facts broadly enough to understand the requested operation, but only IS-2 converts those facts into managed project context and scope, and only IS-1 with the owning use case converts targetability plus policy, safety and authorization into consequential application authority.**
