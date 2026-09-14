# DD-3.2 — AppManager Git Domain Detailed Design

> **Detailed Design ID:** DD-3.2
>
> **Design family:** DD-3 — High-Coupling Domains

> **Status:** Version 1 Detailed Design Specification
>
> **Detailed Design authority:** This document defines the permanent Git-domain orchestration, repository-scope policy, decision, state and result contracts by which AppManager realises managed-repository use cases through the DD-1 Application Core and DD-2 Shared Capability contracts.
>
> **Governing sources:** [Project Documentation Guide](../project-documentation-guide-v01.md), [AppManager Design Specification](../appmanager-design-specification-v01.md), [docs/functional/git-functional-specification-v01.md](../functional/git-functional-specification-v01.md), accepted ADRs, and the normative DD-1/DD-2 Detailed Designs and active clarifications.
>
> **Authoring controls:** [Detailed Design Decomposition Plan and Canonical Register](../project_management/detailed-design-decomposition-plan-v01.md), [Domain Detailed Design Authoring Guide](../project_management/domain-detailed-design-authoring-guide-v01.md), [DD-3.2 Git Domain Handover](../project_management/dd3-2-git-domain-handover-v01.md)

---

## 1. Purpose

This specification defines the permanent internal Git-domain design for repository-management intent across AppManager managed projects.

The Git domain composes authoritative Application Core context with bounded repository and supporting capabilities to realise repository inspection, repository initialisation, commit creation, push, synchronisation, managed repository relationships, managed-layer repository initialisation and deliberately authorised remote-repository deletion.

The governing rule is:

> **The Git domain owns repository-management intent, operation-specific repository policy and multi-repository orchestration; DD-2.3 Repository Capability owns repository facts and bounded repository primitives; the Application Engine retains final application authority.**

A second rule is:

> **Repository recognition, repository membership, operation selection, eligibility, authorization, technical execution, Git-domain acceptance and final AppManager acceptance are distinct semantic stages.**

A third rule is:

> **A Git-domain use case is defined by repository intent and required postconditions, not by a Git command, library API, hosting-provider operation, current working directory, source path or implementation topology.**

---

## 2. Scope

### 2.1 In Scope

This design owns permanent Git-domain contracts for:

- Git-domain operation identity and applicability;
- operation-specific repository scope interpretation over the DD-1.3 managed-project topology;
- root, selected repository, selected repository set and all-managed-repositories scope semantics where applicable;
- repository eligibility decisions for Git use cases;
- repository inspection as a Git-domain use case;
- repository initialisation policy and orchestration;
- commit intent, change-scope policy, staging policy and commit-message acceptance;
- optional AI-assisted commit-message proposal orchestration;
- repository-scoped and coordinated multi-repository push;
- repository-scoped and coordinated synchronisation;
- managed repository relationship establishment;
- repository initialisation for eligible managed layers;
- deliberately destructive remote-repository deletion policy and orchestration where enabled;
- remote-selection and remote-target policy above bounded repository primitives;
- Git-specific safety, stale-state and conflict decisions;
- continuation policy for multi-repository operations;
- per-repository result aggregation and Git-specific partial-effect interpretation;
- Git-domain cancellation and recovery position;
- Git-specific interaction-independent choice requirements;
- interpretation of DD-2 capability evidence against Git-domain postconditions;
- coordination with App, Nuxt, AI and other owning domains without transferring their authority.

### 2.2 Out of Scope

This design does not own or redefine:

- canonical invocation identity, caller authorization evidence, cancellation linkage or interaction-mode semantics owned by DD-1.1 Application Invocation;
- canonical success, failure, partial-success, cancellation, diagnostics, warnings or effect semantics owned by DD-1.2 Execution Outcomes;
- managed-project identity, repository topology, managed scope or mutation authority owned by DD-1.3 Managed Project;
- configuration candidate precedence, provenance or effective-value construction owned by DD-1.4 Configuration Resolution;
- application-wide dispatch, final authority, final acceptance or outcome publication owned by DD-1.5 Application Engine;
- resource-access mechanics owned by DD-2.1 Resource Access;
- external-process mechanics owned by DD-2.2 Process Execution;
- repository recognition, status/ref/remote/change facts, repository preconditions or bounded repository primitives owned by DD-2.3 Repository Capability;
- source-structural interpretation owned by DD-2.4 Source Intelligence;
- existing-source transformation mechanics owned by DD-2.5 Source Transformation;
- AI provider/model execution, context safety or structured-output mechanics owned by DD-2.7 AI Capability;
- application lifecycle, build, preview, clean, reset or deployment semantics;
- Nuxt layer-creation semantics;
- quality-gate or documentation semantics;
- provider-native Git, GitHub or other hosting-provider models as application contracts;
- exact Git commands, command flags, libraries, APIs, TypeScript interfaces, classes, services, source paths, package topology, concurrency mechanisms or provider wiring.

---

## 3. Governing Requirements and Authorities

### 3.1 Functional ownership

The Git domain owns `FR-GIT-001` through `FR-GIT-114` from [docs/functional/git-functional-specification-v01.md](../functional/git-functional-specification-v01.md).

| Functional range | Git-domain concern |
|---|---|
| `FR-GIT-001`–`FR-GIT-014` | general authority, scope, provider subordination and diagnostics |
| `FR-GIT-015`–`FR-GIT-020` | repository/configuration inspection |
| `FR-GIT-021`–`FR-GIT-026` | repository initialisation |
| `FR-GIT-027`–`FR-GIT-039` | commit and optional AI assistance |
| `FR-GIT-040`–`FR-GIT-049` | repository-scoped push |
| `FR-GIT-050`–`FR-GIT-058` | coordinated all-managed-repositories push |
| `FR-GIT-059`–`FR-GIT-073` | scoped synchronisation |
| `FR-GIT-074`–`FR-GIT-081` | managed repository relationships |
| `FR-GIT-082`–`FR-GIT-086` | managed-layer repository initialisation |
| `FR-GIT-087`–`FR-GIT-095` | remote-repository deletion |
| `FR-GIT-096`–`FR-GIT-100` | automation and workflow composition |
| `FR-GIT-101`–`FR-GIT-110` | safety, failure, stale state and multi-repository behaviour |
| `FR-GIT-111`–`FR-GIT-114` | interaction-mode equivalence |

### 3.2 Application Core authorities

This design consumes, but does not redefine:

- [DD-1.1 — Application Invocation](../dd_1_application_core/dd-1-1-application-invocation-detailed-design-v01.md);
- [DD-1.2 — Execution Outcomes](../dd_1_application_core/dd-1-2-execution-outcomes-detailed-design-v01.md);
- [DD-1.3 — Managed Project](../dd_1_application_core/dd-1-3-managed-project-detailed-design-v01.md);
- [DD-1.4 — Configuration Resolution](../dd_1_application_core/dd-1-4-configuration-resolution-detailed-design-v01.md);
- [Application Core Bootstrap Resolution Clarification](../dd_1_application_core/clarifications/application-core-bootstrap-resolution-clarification-v01.md);
- [Application Outcome and Diagnostic Ownership Clarification](../dd_1_application_core/clarifications/application-outcome-and-diagnostic-ownership-clarification-v01.md);
- [DD-1.5 — Application Engine](../dd_1_application_core/dd-1-5-application-engine-detailed-design-v01.md).

### 3.3 Shared capability authorities

The principal shared capability is [DD-2.3 — Repository Capability](../dd_2_shared_capabilities/dd-2-3-repository-capability-detailed-design-v01.md). The Git domain supplies application intent, resolved scope, policy, authorization and acceptance conditions; Repository Capability supplies repository facts and executes already-authorized bounded repository primitives.

Supporting capability authorities include Resource Access, Process Execution and AI Capability where required by an approved Git use case. Source Intelligence may be composed by an owning workflow when actual source structure is required, but repository diff/status evidence does not become source-structural evidence by implication.

The [Repository / Source Intelligence Relationship Clarification](../dd_2_shared_capabilities/clarifications/repository-source-intelligence-relationship-clarification-v01.md) governs that distinction.

### 3.4 Accepted runtime decision

ADR-0001 permits Node.js/TypeScript for Version 1 implementation but does not alter this document's semantic boundaries or authorize implementation topology at Detailed Design level.

---

## 4. Domain Responsibility and Authority Boundary

### 4.1 Git-domain ownership

The Git domain owns:

- semantic identity of Git use cases;
- operation-specific repository-scope interpretation from authoritative DD-1.3 scope/topology;
- operation-specific eligibility decisions;
- Git-specific preconditions and postconditions;
- remote-selection policy where the use case requires a remote;
- commit change/staging policy and commit-message acceptance;
- synchronisation strategy intent and conflict policy supplied to Repository Capability where supported;
- multi-repository ordering/continuation policy where application-visible;
- relationship-establishment intent and ownership-conflict interpretation;
- destructive remote-deletion target and authorization policy;
- interpretation of repository/provider evidence in the context of the requested Git intent;
- Git-specific per-repository result payloads, partial-effect meaning and recovery information.

### 4.2 Authority retained elsewhere

| Concern | Authoritative owner | Git-domain relationship |
|---|---|---|
| invocation semantics | DD-1.1 | consumes normalized intent, explicit choices and authorization evidence |
| canonical outcomes | DD-1.2 | supplies Git-specific payload/evidence; does not redefine outcome taxonomy |
| project/repository topology and managed scope | DD-1.3 | consumes authoritative repository membership, relationships and targetability |
| effective AppManager configuration | DD-1.4 | consumes operation snapshot; does not reinterpret raw sources |
| final application authority | DD-1.5 | Git interprets domain evidence; Engine accepts/publishes final outcome |
| repository facts/primitives | DD-2.3 | delegates bounded repository inspection and execution |
| process mechanics | DD-2.2 | remains beneath Repository Capability/provider where used |
| AI execution | DD-2.7 | requests bounded proposal generation; Git retains message acceptance |
| App lifecycle | App domain | Git may be subordinate to App workflows without acquiring App semantics |
| Nuxt layer lifecycle | Nuxt domain | Git may initialise/relate repositories without acquiring layer-creation authority |

### 4.3 Architectural position

```text
normalized invocation
        |
        v
Application Engine authority
        |
        +--> DD-1.3 managed project / operation scope
        +--> DD-1.4 effective configuration
        +--> DD-1.1 authorization / cancellation context
        |
        v
Git-domain intent / policy / orchestration
        |
        +--> DD-2.3 repository facts and bounded primitives
        +--> DD-2.7 AI proposal, where explicitly requested
        +--> other bounded capabilities only where semantically required
        |
        v
Git-domain interpretation / per-repository result
        |
        v
Application Engine acceptance
        |
        v
canonical DD-1.2 outcome
```

This describes semantic authority, not a required call graph or source topology.

---

## 5. Consumed DD-1 Application Core Contracts

| DD-1 contract | Git-domain use |
|---|---|
| Application Invocation | receives canonical Git intent, explicit repository/remote/change selections, preview intent, authorization evidence, cancellation linkage and caller correlation |
| Execution Outcomes | records Git-specific payloads, repository-scoped diagnostics, effects, subordinate results and partial completion within canonical semantics |
| Managed Project | consumes managed repository identities, root/layer relationships, operation scope and mutation/targetability constraints |
| Configuration Resolution | consumes immutable operation-effective values for Git policy, defaults and capability constraints |
| Application Engine | receives authoritative execution context and returns Git-domain interpretation for final acceptance |

### DD-GIT-001 — No local reconstruction of Application Core authority

The Git domain shall not reconstruct managed scope, effective configuration, invocation authorization or canonical outcomes from current working directory, repository discovery, raw configuration, provider state or presentation input.

---

## 6. Consumed DD-2 Shared Capabilities

| DD-2 capability | Git-domain purpose |
|---|---|
| Resource Access | bounded resource evidence/effects only where a Git workflow explicitly requires resource mechanics outside repository semantics |
| Process Execution | indirect provider execution where Repository Capability or another approved provider uses an external tool; raw process results do not become Git-domain semantics |
| Repository Capability | repository recognition, facts, revisions, refs, remotes, change evidence, preconditions and bounded repository/local/remote primitives |
| Source Intelligence | optional source-structural evidence when an owning Git workflow genuinely requires structure beyond repository change evidence |
| Source Transformation | only where a separately approved Git-domain intent requires existing-source mutation not already a repository primitive |
| AI Capability | optional commit-message proposal generation from bounded approved context |

### DD-GIT-002 — Repository Capability is a primitive boundary

The Git domain shall express bounded repository intent to DD-2.3 without exposing provider commands as its application contract. DD-2.3 technical completion is evidence until Git-domain interpretation establishes whether the requested repository intent was satisfied.

### DD-GIT-003 — No bypass by provider convenience

The availability of a Git CLI, library, remote-host API or provider SDK shall not permit Git-domain orchestration to bypass DD-2.3's normalized repository contract merely because direct invocation is convenient.

---

## 7. Domain Contract Model

The following contracts are conceptual semantic records, not concrete TypeScript interfaces.

### DD-GIT-004 — Git Operation Identity

A Git operation shall have a stable semantic identity independent of provider syntax. Version 1 identities include at least:

```text
inspect
initialise_repository
commit
push
synchronise
establish_relationship
initialise_layer_repositories
delete_remote_repository
```

Presentation aliases shall not create separate semantics.

### DD-GIT-005 — Repository Operation Scope

A Git-domain operation scope shall bind the requested Git intent to authoritative DD-1.3 managed scope and shall be capable of distinguishing, where applicable:

```text
root_repository
selected_repository
selected_repository_set
all_managed_repositories
```

The scope shall preserve stable managed repository identities and relevant relationship context. It shall not be defined solely by discovered paths.

### DD-GIT-006 — Repository Eligibility Decision

For each candidate in authoritative scope, Git orchestration shall be capable of recording:

```text
managed repository identity
operation identity
eligibility: eligible | ineligible | already_satisfied | indeterminate
supporting repository/configuration evidence
blocking condition or diagnostic
```

Eligibility is operation-specific and does not alter DD-1.3 managed membership.

### DD-GIT-007 — Remote Selection Decision

Where an operation requires a remote, the Git domain shall resolve or consume an explicit remote selection sufficiently to avoid ambiguous provider action. The decision shall preserve the repository, remote identity, intended operation and evidence supporting applicability.

A conventional name such as `origin` is not universal authority.

### DD-GIT-008 — Commit Intent

A commit intent shall identify at least:

```text
target managed repository
approved change/staging scope
staging policy
commit-message source and accepted message
relevant repository preconditions
```

The staging policy shall distinguish already-staged changes from changes AppManager is authorized to stage. Arbitrary shell text or an unbounded whole-project assumption shall not satisfy commit intent.

### DD-GIT-009 — Commit Message Proposal

An AI-generated commit message is a proposal associated with bounded repository change evidence and provenance. It shall remain distinguishable from the application-accepted commit message.

### DD-GIT-010 — Synchronisation Intent

A synchronisation intent shall identify the target repository scope and the approved integration policy required by DD-2.3. It shall not delegate conflict-resolution policy to provider defaults when those defaults could discard, rewrite or materially alter local work.

### DD-GIT-011 — Repository Relationship Intent

A relationship intent shall bind:

```text
owning managed-project relationship context
source/parent managed repository identity
target managed repository identity
approved relationship kind
resolved remote identity where required
expected existing ownership/tracking state
```

Relationship intent is distinct from provider-specific relationship metadata.

### DD-GIT-012 — Remote Deletion Intent

Remote-repository deletion shall require a target-bound destructive intent capable of preserving:

```text
exact hosting target identity
provider/host identity where material
owner/account/organisation identity
repository identity
source of target resolution
strong authorization evidence bound to that target
```

A local remote name, URL fragment or repository directory name alone is insufficient destructive target authority.

### DD-GIT-013 — Repository Operation Result

A repository-scoped Git result payload shall be capable of carrying:

- operation identity;
- managed repository identity;
- selected remote/relationship identity where applicable;
- eligibility and precondition evidence;
- known completed effects;
- relevant resulting revision/ref/state evidence;
- skipped/already-satisfied reason;
- Git-specific diagnostics and remaining action;
- recovery/revalidation information.

It composes DD-1.2 semantics and shall not create a competing generic outcome envelope.

### DD-GIT-014 — Coordinated Git Result

A multi-repository operation shall preserve an ordered or otherwise correlatable set of repository-scoped results together with scope identity, continuation decisions and known cross-repository drift/recovery information.

### DD-GIT-015 — Git Recovery Position

Where an operation terminates after effects begin, Git orchestration shall be able to expose:

- repositories completed;
- repository currently failed/cancelled/conflicted;
- repositories not attempted;
- completed local/remote effects known not to be rolled back;
- stale assumptions requiring revalidation;
- whether retry, continuation, repair or manual intervention is semantically plausible.

This is evidence, not a rollback or automatic-resume guarantee.

---

## 8. Use-Case Orchestration

### 8.1 General orchestration rules

### DD-GIT-016 — Authoritative context precedes consequential Git work

Consequential Git use cases shall begin from Engine-established context sufficient to identify the managed project, operation-specific managed scope, effective configuration, invocation intent and required authorization state.

### DD-GIT-017 — Evidence refresh before effect

Where correctness depends on mutable repository state, the Git domain shall obtain or validate sufficiently fresh DD-2.3 evidence before consequential execution. Material stale-state evidence shall cause revalidation, rejection or explicit policy handling rather than blind execution.

### DD-GIT-018 — Domain acceptance follows repository evidence

The Git domain shall interpret DD-2.3 evidence against the use-case postconditions before reporting domain acceptance to the Application Engine.

### 8.2 Repository inspection

Repository inspection is read-only Git-domain intent over one or more repositories already represented by authoritative scope.

The orchestration shall:

1. resolve the requested repository scope from DD-1.3 context;
2. request only the DD-2.3 facts required by the inspection intent;
3. preserve repository identity on every material result;
4. distinguish multidimensional status, upstream/divergence, conflicts, remote state and unavailable/indeterminate evidence where relevant;
5. minimise sensitive repository configuration values;
6. return inspection evidence without granting later mutation authority.

### DD-GIT-019 — Inspection is non-authorising

Successful inspection shall not be reused as authorization for a later consequential operation.

### 8.3 Repository initialisation

For an approved repository-initialisation request, Git orchestration shall:

1. resolve one explicit eligible managed target;
2. establish that existing repository state does not conflict with initialisation intent;
3. consume effective configuration for approved defaults such as identity/default-branch policy where applicable;
4. establish authorization for consequential creation;
5. delegate the bounded initialisation primitive to DD-2.3;
6. re-inspect sufficient resulting repository state;
7. interpret whether the requested repository postcondition was established and report remaining follow-on action.

### DD-GIT-020 — Existing repository preservation

An already recognized repository shall not be silently reinitialised merely to make the requested operation convenient. Repair or migration requires separately approved semantics.

### 8.4 Commit

Commit orchestration applies to one explicitly resolved managed repository in Version 1.

The semantic sequence is:

```text
resolved repository scope
    -> fresh change/staging evidence
    -> committable-change decision
    -> explicit staging policy/change scope
    -> commit-message resolution
    -> authorization/preview checkpoint
    -> bounded stage operations where required
    -> bounded commit creation
    -> resulting revision/status evidence
    -> Git-domain acceptance
```

### DD-GIT-021 — Commit scope is explicit

Git orchestration shall not silently stage unrelated changes. If the requested staging policy cannot be represented safely from available evidence, commit execution shall not proceed.

### DD-GIT-022 — No-change is not fabricated success

If no eligible change can produce a new commit, the result shall represent the actual condition rather than claiming that a commit was created.

### DD-GIT-023 — Commit message acceptance remains Git/application-owned

A commit message may originate from explicit caller input, an approved deterministic source or an AI proposal, but the message used for commit creation shall be accepted under Git-domain/invocation policy before the commit primitive executes.

### DD-GIT-024 — AI is optional and subordinate

Failure, unavailability or rejection of AI-assisted message generation shall not prevent the manual commit path where all non-AI commit requirements are satisfied.

AI context shall be bounded to approved repository/change evidence and shall obey DD-2.7 trust, disclosure and sensitivity constraints.

### 8.5 Repository-scoped push

Push orchestration shall:

1. resolve one eligible managed repository;
2. obtain fresh branch/upstream/remote/divergence evidence required by policy;
3. resolve an unambiguous remote target or target set under the use case;
4. determine whether there is history requiring push;
5. reject or separately authorize any history-rewriting semantics not explicitly specified by the Functional baseline;
6. establish consequential authorization;
7. delegate bounded push to DD-2.3;
8. obtain resulting evidence where required;
9. interpret repository/remote-specific success, failure or already-current state.

### DD-GIT-025 — Push is repository intent only

Successful push shall not imply build, quality validation, release or deployment success.

### DD-GIT-026 — Ambiguous remote blocks push

Where multiple applicable remotes exist and policy cannot deterministically resolve the intended target, the Git domain shall require explicit selection or fail safely.

### 8.6 Coordinated push

All-managed-repositories push is a Git-domain orchestration over an explicitly resolved DD-1.3 repository set.

The domain shall establish the complete reviewed scope and per-repository eligibility before initiating effects where reasonably possible. Each repository then receives repository-scoped push semantics.

### DD-GIT-027 — Per-repository truth is retained

A failure in one repository shall not erase or rewrite the truth of repositories already pushed, skipped or found already current.

### DD-GIT-028 — Continuation policy is explicit

Whether processing continues after an individual repository failure shall be a Git use-case policy resolved before or at a defined decision point. Provider failure shall not silently choose continuation policy.

### DD-GIT-029 — No multi-repository transaction fiction

Coordinated push shall not claim universal atomicity or rollback. Completed remote effects remain completed unless separately proven otherwise.

### 8.7 Synchronisation

Synchronisation orchestration shall support root, selected repository, selected set and all-managed-repositories scopes where the Functional baseline permits them.

For each repository, the domain shall:

1. establish repository eligibility and required upstream/remote relationship;
2. inspect local changes, conflicts, tracking and divergence relevant to the approved strategy;
3. preserve local work by rejecting or surfacing conditions requiring destructive or ambiguous conflict policy;
4. supply an explicit bounded integration/synchronisation intent to DD-2.3;
5. interpret resulting repository state;
6. preserve per-repository partial effects and cross-repository drift evidence.

### DD-GIT-030 — Synchronisation shall not invent destructive conflict policy

Merge conflicts, divergence, missing upstream or local changes requiring a policy decision shall be surfaced unless an explicitly specified and authorized strategy resolves the condition without violating the Functional baseline.

### DD-GIT-031 — Narrow synchronisation may expose drift

When the managed relationship model makes it knowable that a deliberately narrow scope can leave related repositories at inconsistent revisions, Git orchestration should attach a domain warning without broadening scope automatically.

### 8.8 Managed repository relationships

Relationship establishment shall:

1. resolve parent/source and target repositories from DD-1.3 topology;
2. verify operation-specific eligibility;
3. inspect existing repository/relationship/tracked-content evidence;
4. resolve required remote identity unambiguously;
5. reject duplicate relationships or ownership/tracking conflicts unless a separately specified migration workflow applies;
6. establish consequential authorization;
7. delegate only the bounded relationship primitive to DD-2.3;
8. revalidate relationship state and report whether a later commit or other action remains required.

### DD-GIT-032 — Relationship mechanics do not own project topology

DD-2.3 may execute a relationship primitive, but DD-1.3 remains authoritative for the managed-project relationship model. Git-domain acceptance shall not silently rewrite project topology from provider state alone.

### 8.9 Managed-layer repository initialisation

When invoked directly or by a Nuxt-owned layer workflow, Git orchestration shall operate only on managed layers that DD-1.3 scope identifies as eligible for independent repositories.

For multiple layers, each target shall retain independent eligibility and outcome evidence.

### DD-GIT-033 — Nuxt ownership is preserved

A Nuxt workflow may delegate repository initialisation to Git, but Git acceptance establishes repository postconditions only. It shall not claim that Nuxt layer creation itself succeeded.

### 8.10 Remote-repository deletion

Remote deletion, where enabled, is exceptional and destructive.

The semantic sequence is:

```text
explicit destructive Git intent
    -> exact remote-host target resolution
    -> target review / deterministic Headless binding
    -> fresh provider/repository identity evidence
    -> strong target-bound authorization
    -> final stale-target/precondition validation
    -> bounded DD-2.3 remote-host deletion primitive
    -> provider evidence
    -> Git-domain target-specific interpretation
    -> Application Engine acceptance
```

### DD-GIT-034 — No inferred destructive target

The Git domain shall not guess remote owner, organisation, account or repository identity from a personal default, local directory name or unrelated context.

### DD-GIT-035 — Strong authorization is target-bound

Remote-deletion authorization shall be materially stronger than ordinary consequential confirmation and shall be bound sufficiently to the exact resolved target to prevent reuse for a different repository.

### DD-GIT-036 — No cascading deletion

Deletion of one remote repository shall not imply deletion of local repositories, related remote repositories, managed relationships or other project resources.

---

## 9. Domain State and State Transitions

The Git domain does not own a durable replacement for repository state; repository facts remain DD-2.3 evidence and managed topology remains DD-1.3 state.

It does own transient orchestration state needed to preserve decision and effect truth during a Git use case.

### DD-GIT-037 — Git orchestration state

A consequential Git operation shall be able to distinguish conceptually:

```text
context_resolved
scope_resolved
eligibility_established
policy_resolved
authorization_satisfied
executing
interpreting
accepted | rejected | partially_completed | cancelled | indeterminate
```

Not every use case requires every state, and these states do not replace DD-1.2 terminal outcome semantics.

### DD-GIT-038 — Multi-repository progress state

A coordinated operation shall preserve per-repository positions such as pending, skipped/already-satisfied, executing, completed, failed, conflicted, cancelled or not-attempted sufficiently to reconstruct truthful partial completion.

### DD-GIT-039 — State transitions do not grant authority

Progressing through orchestration state shall not manufacture missing managed scope, authorization or provider capability.

---

## 10. Domain Policy and Decision Rules

### DD-GIT-040 — Scope is intent-relative

A managed repository set is not automatically the operation scope. Git orchestration shall bind caller intent to the subset permitted by DD-1.3 operation scope and the requested use case.

### DD-GIT-041 — Eligibility is narrower than membership

Managed-project membership is necessary but not universally sufficient for a Git effect. The Git domain shall determine operation-specific eligibility from authoritative context plus DD-2.3 evidence.

### DD-GIT-042 — No broadest-scope fallback

Ambiguous intent shall not default to all managed repositories merely because that scope is available.

### DD-GIT-043 — Provider defaults are not application policy

Provider defaults for remote selection, pull strategy, force behaviour, conflict handling, credential context, deletion target or continuation shall not become AppManager policy unless explicitly accepted by an authoritative contract.

### DD-GIT-044 — Force-like semantics require separate authority

A provider flag or API option that rewrites history, discards changes, overrides conflicts or broadens effects shall not be enabled merely under a generic `force` concept. The corresponding application semantics require explicit specification and authorization.

### DD-GIT-045 — Technical capability does not imply enabled destructive use case

The presence of a DD-2.3 remote deletion primitive or provider capability does not mean remote deletion is enabled for Version 1 operation. Enablement remains an application/domain policy decision under the Functional requirement.

---

## 11. Safety, Mutation, and Authorization

The permanent distinction is:

```text
repository recognition
    != managed-project membership
    != operation selection
    != operation eligibility
    != mutation intent
    != authorization
    != repository execution
    != Git-domain acceptance
    != AppManager application success
```

### DD-GIT-046 — Mutation intent originates above Repository Capability

DD-2.3 shall receive already-bounded mutation intent. Repository evidence or provider capability shall not independently create Git mutation intent.

### DD-GIT-047 — Authorization is effect-relative

The Git domain shall preserve the consequence classification of requested effects so DD-1 invocation/application policy can require appropriate authorization. Read-only inspection, ordinary consequential repository mutation and destructive remote deletion shall not be treated as equivalent authorization classes.

### DD-GIT-048 — Scope review precedes coordinated effects where required

Where invocation policy requires review of a consequential multi-repository operation, the resolved repository set and material remote targets shall be reviewable before effects begin.

### DD-GIT-049 — Stale authorization-sensitive identity invalidates execution

If repository or remote identity materially changes after authorization such that the authorized target is no longer the execution target, authorization shall not be silently carried forward.

### DD-GIT-050 — Completed effects remain truthful

Cancellation, later failure or rollback inability shall not cause AppManager to report already-created commits, pushes, synchronisations, relationships or deletions as though they never occurred.

---

## 12. Failure, Cancellation, and Partial Effects

### DD-GIT-051 — Capability failure remains repository-scoped evidence

Repository/provider failure shall preserve the affected managed repository and functional stage so Git orchestration can interpret the failure without collapsing it into project absence or unknown-command semantics.

### DD-GIT-052 — Cancellation stops new effects

After cancellation is safely observed, coordinated Git orchestration shall stop initiating further consequential repository effects. In-flight provider behavior remains governed by the applicable capability contract.

### DD-GIT-053 — Cancellation is not rollback

Cancellation shall not imply reversal of completed local or remote effects.

### DD-GIT-054 — Partial completion is first-class

When some repositories complete and others fail, conflict, cancel or remain unattempted, Git orchestration shall preserve the per-repository truth needed for DD-1.2 partial-success/partial-effect interpretation.

### DD-GIT-055 — Retry requires revalidation

A retry or continuation after failure shall revalidate repository state, remote identity, managed scope and any authorization assumptions that may have become stale. A previous request shall not be blindly replayed merely because its provider operation failed.

### DD-GIT-056 — Indeterminate provider effects remain indeterminate

If a provider failure leaves it unknown whether a consequential remote effect completed, the Git domain shall preserve that uncertainty and require verification/recovery rather than fabricating success or failure.

---

## 13. Headless and Interaction Independence

### DD-GIT-057 — One Git semantic model across adapters

TUI, Headless, GUI, IDE, CI and automation adapters shall express the same Git-domain intents and receive semantically equivalent scope, policy and outcomes.

### DD-GIT-058 — Selection is structural, not menu-owned

Repository, remote, change-set and relationship-candidate choices shall be representable through invocation inputs/context. A TUI menu is one acquisition mechanism, not the semantic owner of selection.

### DD-GIT-059 — Headless ambiguity fails safely

When required repository scope, remote identity, commit-message decision or destructive target/authorization cannot be resolved non-interactively, Headless execution shall return structured diagnostics rather than prompt or choose the broadest/default target.

### DD-GIT-060 — Machine-consumable coordinated results

Multi-repository results shall preserve repository identities and per-repository states without requiring callers to parse human terminal output.

---

## 14. Concurrency, Idempotency, and Conflict Behaviour

### DD-GIT-061 — Repository-state preconditions guard consequential work

Where concurrent or external repository changes could invalidate an approved operation, Git orchestration shall use DD-2.3 revision/state preconditions or fresh evidence sufficient to detect material conflict before consequential execution.

### DD-GIT-062 — Parallelism shall not change semantics

An implementation may later choose sequential or bounded parallel execution where permitted, but concurrency shall not change resolved scope, continuation policy, per-repository truth, authorization requirements or outcome semantics.

### DD-GIT-063 — Already-satisfied states are explicit

Operations such as push with nothing to transfer, an already-existing valid relationship, or initialisation of an already-valid repository shall be represented according to their use-case semantics rather than forced through a mutating provider call solely to obtain success.

### DD-GIT-064 — Commit is not generally idempotent

Commit creation shall not be retried as though it were inherently idempotent. After uncertain or failed execution, resulting repository revision/status evidence shall be checked before another commit is attempted.

### DD-GIT-065 — Remote effects require post-failure verification where uncertain

Push, synchronisation and remote deletion may have externally visible effects that cannot be inferred safely from local provider failure alone. Recovery shall prefer verification evidence over blind replay.

---

## 15. Security and Sensitive Information

### DD-GIT-066 — Credential material remains below Git-domain results

Credentials, tokens, authorization headers, credential-helper outputs and equivalent secrets shall not be included in Git-domain result payloads or ordinary diagnostics merely because repository/provider operations used them.

### DD-GIT-067 — Remote identity is not necessarily secret but is bounded

Repository URLs, owner/account names and remote metadata shall be exposed only to the extent required by the approved use case, diagnostics, review or recovery context.

### DD-GIT-068 — AI disclosure is separately governed

Repository diffs, commit history, file names and configuration may contain sensitive project information. Commit-message AI assistance shall disclose only approved bounded context under DD-2.7 policy; Git scope does not itself authorize external disclosure.

### DD-GIT-069 — Destructive provider authorization is least-scope

Remote deletion shall use only the provider authorization/capability required for the exact target and shall not treat broad provider credentials as authority to delete other repositories.

---

## 16. Extensibility and Replaceability

### DD-GIT-070 — Repository provider replaceability

A replacement Git/repository provider shall preserve DD-2.3 contracts and shall not alter Git-domain use-case semantics, scope, policy, safety or result meaning.

### DD-GIT-071 — Remote-host provider replaceability

Git-domain remote operations shall depend on AppManager-oriented remote identity and bounded repository capability semantics rather than making one hosting provider's object model the general Git-domain contract.

### DD-GIT-072 — AI provider replacement is invisible to commit authority

Changing or removing an AI provider shall not change the manual commit path or transfer commit-message acceptance to AI Capability.

### DD-GIT-073 — No generic repository workflow framework by similarity

Repeated repository-scoped orchestration across push, synchronisation or future Git operations shall not by itself justify a new generic framework. Shared abstraction requires genuinely shared semantics not already owned by DD-1 or DD-2.

### DD-GIT-074 — Implementation topology remains open

Nothing in this design requires one Git service, one class per use case, a separate process, a particular package structure, direct CLI execution, a particular Git library or a particular remote-host SDK.

---

## 17. Testability and Conformance Requirements

The design shall permit independent verification of Git-domain policy and orchestration using controlled substitutes for DD-1 context and DD-2 capabilities.

### DD-GIT-075 — Scope-policy testability

Tests shall be able to demonstrate that root, selected repository, selected set and all-managed-repositories intents resolve without filesystem-discovery authority or silent scope expansion.

### DD-GIT-076 — Repository-capability substitution

Git orchestration shall be testable against controlled DD-2.3 evidence/results without requiring a live Git provider for every domain-policy test.

### DD-GIT-077 — Multi-repository partial-effect testability

Tests shall be able to exercise per-repository success, failure, skip, conflict, cancellation, continuation and indeterminate states and verify truthful aggregation.

### DD-GIT-078 — Safety-boundary testability

Tests shall be able to prove that recognition does not authorize mutation, ambiguous remotes block consequential execution, unrelated changes are not silently staged, destructive target identity is exact, and target-bound authorization is enforced.

### DD-GIT-079 — AI independence testability

Commit creation shall be testable with AI unavailable, AI failing, AI proposing output and caller/policy rejecting or revising the proposal.

### DD-GIT-080 — Headless determinism testability

Tests shall verify that missing repository/remote/destructive inputs fail structurally in Headless mode rather than triggering presentation-specific prompting or implicit defaults.

### DD-GIT-081 — Stale-state and retry testability

Tests shall be able to introduce repository-state changes between inspection and execution and verify deliberate revalidation/rejection rather than blind use of stale evidence.

### DD-GIT-082 — Provider replacement testability

Provider-native result shape shall be substitutable below DD-2.3 without changing Git-domain policy tests or application-facing semantics.

---

## 18. Traceability

The following matrix groups the principal Detailed Design contracts by their Functional authority and shared-contract dependency. Individual Implementation Specifications may refine this mapping further without changing ownership.

| Detailed Design contract(s) | Functional requirement(s) | Principal related DD authority |
|---|---|---|
| `DD-GIT-001`–`003` | `FR-GIT-001`–`014` | DD-1.1–1.5; DD-2.2; DD-2.3 |
| `DD-GIT-004`–`007` | `FR-GIT-003`–`011`, `044`–`046`, `065`–`067` | DD-1.3; DD-1.4; DD-2.3 |
| `DD-GIT-008`–`009`, `021`–`024` | `FR-GIT-027`–`039` | DD-1.1; DD-1.3; DD-2.3; DD-2.7 |
| `DD-GIT-010`, `030`–`031` | `FR-GIT-059`–`073`, `108`–`110` | DD-1.3; DD-2.3 |
| `DD-GIT-011`, `032`–`033` | `FR-GIT-074`–`086` | DD-1.3; DD-2.3; Nuxt-domain authority where composed |
| `DD-GIT-012`, `034`–`036` | `FR-GIT-087`–`095` | DD-1.1; DD-1.3; DD-2.3 |
| `DD-GIT-013`–`015`, `037`–`039` | `FR-GIT-014`, `039`, `049`, `055`–`058`, `071`–`073`, `081`, `086`, `094`, `102`–`105`, `114` | DD-1.2; DD-2.3 |
| `DD-GIT-016`–`020` | `FR-GIT-004`–`020`, `021`–`026`, `108` | DD-1.3; DD-1.4; DD-2.3 |
| `DD-GIT-025`–`029` | `FR-GIT-040`–`058`, `097`–`100` | DD-1.2; DD-1.3; DD-2.3 |
| `DD-GIT-040`–`045` | `FR-GIT-005`–`013`, `044`–`046`, `056`, `066`, `101`, `109`–`110` | DD-1.3; DD-1.4; DD-2.3 |
| `DD-GIT-046`–`050` | `FR-GIT-006`–`010`, `053`–`054`, `080`, `087`–`095`, `101`, `108`–`110` | DD-1.1; DD-1.3; DD-2.3 |
| `DD-GIT-051`–`056` | `FR-GIT-055`–`058`, `068`–`073`, `102`–`108` | DD-1.2; DD-2.3 |
| `DD-GIT-057`–`060` | `FR-GIT-045`, `054`, `067`, `090`, `096`, `100`, `111`–`114` | DD-1.1; DD-1.2 |
| `DD-GIT-061`–`065` | `FR-GIT-022`, `029`, `047`, `068`–`073`, `076`, `084`, `103`, `108`–`110` | DD-2.3 |
| `DD-GIT-066`–`069` | `FR-GIT-019`, `036`, `088`–`092`, `106` | DD-1.1; DD-2.3; DD-2.7 |
| `DD-GIT-070`–`074` | `FR-GIT-001`–`003`, `012`–`013`, `096`–`100` | DD-2.3; ADR-0001 |
| `DD-GIT-075`–`082` | all applicable conformance requirements | DD-1/DD-2 contracts above |

---

## 19. Conformance Invariants

### DD-GIT-CI-001 — Domain/capability seam

Git-domain application intent, repository-scope policy, orchestration and acceptance shall remain above DD-2.3 Repository Capability facts and bounded primitives.

### DD-GIT-CI-002 — Managed scope authority

Repository discovery or provider accessibility shall never independently establish managed-project membership, operation scope or mutation authority.

### DD-GIT-CI-003 — Application Core authority

The Git domain shall consume DD-1 managed scope and effective configuration and shall return domain interpretation for final Application Engine acceptance; it shall not become a second Application Engine.

### DD-GIT-CI-004 — Evidence before acceptance

Provider or Repository Capability success shall not independently constitute Git-domain or AppManager application success.

### DD-GIT-CI-005 — Explicit consequential scope

Consequential repository operations shall execute only against repositories and remotes resolved within the authorized operation scope; ambiguity shall not broaden scope.

### DD-GIT-CI-006 — Local-work protection

Synchronisation and conflict handling shall not silently discard local work, rewrite history or resolve destructive conflicts without separately specified and authorized semantics.

### DD-GIT-CI-007 — Truthful partial effects

Multi-repository failure or cancellation shall preserve completed effects and per-repository outcomes and shall not imply universal transactionality or rollback.

### DD-GIT-CI-008 — AI remains optional proposal

AI assistance shall not be required for ordinary commit creation and AI output shall not acquire commit authority.

### DD-GIT-CI-009 — Destructive target exactness

Remote-repository deletion, where enabled, shall require exact target identity and strong target-bound authorization and shall not cascade implicitly.

### DD-GIT-CI-010 — Interaction independence

Equivalent Git intent shall retain equivalent scope, policy, safety and result semantics across TUI, Headless, GUI, IDE, CI and automation adapters.

### DD-GIT-CI-011 — Provider independence

Git-domain contracts shall not expose Git CLI syntax, one library model, one remote-host provider model or one runtime topology as the permanent application architecture.

### DD-GIT-CI-012 — Repository/source distinction

Repository status, revision and diff evidence shall remain distinct from DD-2.4 source-structural facts unless an owning workflow explicitly composes both capabilities.

---

## Version 1 Detailed Design Baseline

This document establishes the Version 1 Detailed Design baseline for the AppManager Git domain.

Implementation Specifications may reduce these contracts to concrete Node.js/TypeScript modules, provider bindings, libraries, command forms, source locations and tests under ADR-0001, but shall preserve the authority, scope, policy, safety, evidence and provider-independence boundaries defined here.