# DD-3.2 — AppManager Git Domain Detailed Design

> **Detailed Design ID:** DD-3.2
>
> **Design family:** DD-3 — High-Coupling Domains

> **Status:** Version 1 Detailed Design Specification
>
> **Detailed Design authority:** This document defines the permanent Git-domain orchestration, repository-scope policy, decision, state and result contracts by which AppManager realises managed-repository use cases through the DD-1 Application Core and DD-2 Shared Capability contracts.
>
> **Sources and navigation:** [Project Documentation Guide](../project-documentation-guide-v01.md), [AppManager Design Specification](../appmanager-design-specification-v01.md), [docs/functional/git-functional-specification-v01.md](../functional/git-functional-specification-v01.md), accepted ADRs, and the normative DD-1/DD-2 Detailed Designs.
>
> **Authoring controls:** [Detailed Design Register](../project_management/detailed-design-register-v01.md), [Domain Detailed Design Authoring Guide](../project_management/domain-detailed-design-authoring-guide-v02.md), [DD-3.2 Git Domain Handover](../project_management/dd3-2-git-domain-handover-v01.md)

---

## 1. Purpose

This specification refines [Git Functional contracts](../functional/git-functional-specification-v01.md) for repository-management intent. Its repository scope, eligibility, operation plan and per-repository results distinguish recognition, selection, authorization and acceptance. The workflows in §8 compose bounded repository primitives into coordinated operations.

The collaboration in §§5–6 applies [Design §6.2](../appmanager-design-specification-v01.md#_6-2-application-engine-authority) and [§6.6](../appmanager-design-specification-v01.md#_6-6-capability-boundaries-and-providers) to the domain’s context, specialist delegation and final acceptance.

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
- [Application Core Bootstrap Resolution](../dd_1_application_core/dd-1-5-application-engine-detailed-design-v01.md#_8-orchestration-lifecycle);
- [Application Outcome and Diagnostic Ownership](../dd_1_application_core/dd-1-2-execution-outcomes-detailed-design-v01.md#_7-outcome-contract);
- [DD-1.5 — Application Engine](../dd_1_application_core/dd-1-5-application-engine-detailed-design-v01.md).

### 3.3 Shared capability authorities

The principal shared capability is [DD-2.3 — Repository Capability](../dd_2_shared_capabilities/dd-2-3-repository-capability-detailed-design-v01.md). The Git domain supplies application intent, resolved scope, policy, authorization and acceptance conditions; Repository Capability supplies repository facts and executes already-authorized bounded repository primitives.

Supporting capability authorities include Resource Access, Process Execution and AI Capability where required by an approved Git use case. Source Intelligence may be composed by an owning workflow when actual source structure is required, but repository diff/status evidence does not become source-structural evidence by implication.

The [Repository / Source Intelligence Relationship](../dd_2_shared_capabilities/dd-2-4-source-intelligence-detailed-design-v01.md#repository-context) governs that distinction.

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

<a id="dd-git-001"></a>

### DD-GIT-001 — No local reconstruction of Application Core authority

The Git orchestration context is supplied under [Design](../appmanager-design-specification-v01.md#_6-2-application-engine-authority); the consumed records are described in §7.


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

<a id="dd-git-002"></a>

### DD-GIT-002 — Repository Capability is a primitive boundary

Git interprets the bounded repository evidence from DD-2.3 under [Design](../appmanager-design-specification-v01.md#_11-11-workflow-results-failure-and-acceptance). The collaboration in §6 identifies the primitive boundary.

<a id="dd-git-003"></a>

### DD-GIT-003 — No bypass by provider convenience

Provider invocation follows the Repository Capability boundary in [Design](../appmanager-design-specification-v01.md#_6-6-capability-boundaries-and-providers) and §6; direct provider convenience is not an alternative domain dependency.


---

## 7. Domain Contract Model

The following contracts are conceptual semantic records, not concrete TypeScript interfaces.

<a id="dd-git-004"></a>

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

<a id="dd-git-005"></a>

### DD-GIT-005 — Repository Operation Scope

A Git-domain operation scope shall bind the requested Git intent to authoritative DD-1.3 managed scope and shall be capable of distinguishing, where applicable:

```text
root_repository
selected_repository
selected_repository_set
all_managed_repositories
```

The scope shall preserve stable managed repository identities and relevant relationship context. It shall not be defined solely by discovered paths.

<a id="dd-git-006"></a>

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

<a id="dd-git-007"></a>

### DD-GIT-007 — Remote Selection Decision

Where an operation requires a remote, the Git domain shall resolve or consume an explicit remote selection sufficiently to avoid ambiguous provider action. The decision shall preserve the repository, remote identity, intended operation and evidence supporting applicability.

A conventional name such as `origin` is not universal authority.

<a id="dd-git-008"></a>

### DD-GIT-008 — Commit Intent

A commit intent shall identify at least:

```text
target managed repository
approved change/staging scope
staging policy
commit-message source and accepted message
fresh repository/change preconditions
applicable authorization/effect evidence
```

For coordinated scope, derive this intent separately for each eligible repository requiring a commit. The enclosing intent retains the resolved scope/topology revision, application-visible ordering, continuation policy, cancellation linkage and per-repository intent/result correlation. It does not impose one message, revision or staging set across repositories.

The staging policy shall distinguish already-staged changes from changes AppManager is authorized to stage. Arbitrary shell text or an unbounded whole-project assumption shall not satisfy commit intent.

<a id="dd-git-009"></a>

### DD-GIT-009 — Commit Message Proposal

An AI-generated commit message is a proposal associated with bounded repository change evidence and provenance. It shall remain distinguishable from the application-accepted commit message.

<a id="dd-git-010"></a>

### DD-GIT-010 — Synchronisation Intent

A synchronisation intent shall identify the target repository scope and the approved integration policy required by DD-2.3. It shall not delegate conflict-resolution policy to provider defaults when those defaults could discard, rewrite or materially alter local work.

<a id="dd-git-011"></a>

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

<a id="dd-git-012"></a>

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

<a id="dd-git-013"></a>

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

<a id="dd-git-014"></a>

### DD-GIT-014 — Coordinated Git Result

A multi-repository operation shall preserve an ordered or otherwise correlatable set of repository-scoped results together with scope identity, continuation decisions and known cross-repository drift/recovery information.

<a id="dd-git-015"></a>

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

<a id="dd-git-016"></a>

### DD-GIT-016 — Authoritative context precedes consequential Git work

The entry condition for these Git workflows is the Application Engine context under [Design](../appmanager-design-specification-v01.md#_6-2-application-engine-authority), bound to the operation records in §7.

<a id="dd-git-017"></a>

### DD-GIT-017 — Evidence refresh before effect

Refresh DD-2.3 evidence before effect under [FR-GIT-108](../functional/git-functional-specification-v01.md#fr-git-108). The revision/state guard is specified in [DD-GIT-061](#dd-git-061).

<a id="dd-git-018"></a>

### DD-GIT-018 — Domain acceptance follows repository evidence

Apply [Design](../appmanager-design-specification-v01.md#_11-11-workflow-results-failure-and-acceptance) to repository evidence and the requested Git postconditions.

### 8.2 Repository inspection

Repository inspection is read-only Git-domain intent over one or more repositories already represented by authoritative scope.

The orchestration shall:

1. resolve the requested repository scope from DD-1.3 context;
2. request only the DD-2.3 facts required by the inspection intent;
3. preserve repository identity on every material result;
4. distinguish multidimensional status, upstream/divergence, conflicts, remote state and unavailable/indeterminate evidence where relevant;
5. minimise sensitive repository configuration values;
6. return inspection evidence without granting later mutation authority.

<a id="dd-git-019"></a>

### DD-GIT-019 — Inspection is non-authorising

Inspection evidence follows [Design](../appmanager-design-specification-v01.md#_9-7-managed-scope-and-operation-targeting); its local interpretation supplies the eligibility record in [DD-GIT-006](#dd-git-006).

### 8.3 Repository initialisation

For an approved repository-initialisation request, Git orchestration shall:

1. resolve one explicit eligible managed target;
2. establish that existing repository state does not conflict with initialisation intent;
3. consume effective configuration for approved defaults such as identity/default-branch policy where applicable;
4. establish authorization for consequential creation;
5. delegate the bounded initialisation primitive to DD-2.3;
6. re-inspect sufficient resulting repository state;
7. interpret whether the requested repository postcondition was established and report remaining follow-on action.

<a id="dd-git-020"></a>

### DD-GIT-020 — Existing repository preservation

Initialisation applies [FR-GIT-022](../functional/git-functional-specification-v01.md#fr-git-022). Layer repository filtering additionally follows [FR-GIT-084](../functional/git-functional-specification-v01.md#fr-git-084).

### 8.4 Commit

Commit uses a selected repository, an explicit selected set or all managed repositories resolved through the existing repository-scope contract. Before commit effects, obtain sufficient fresh evidence to classify every requested repository as eligible, ineligible, already satisfied or indeterminate; eligibility can narrow DD-1.3 scope but discovery cannot expand it.

For every eligible repository requiring a commit, apply the sequence below. Review/preview covers the planned scope and materially consequential staging/message policy before execution where required; Headless resolves the same information without prompting. After each effect, retain its resulting evidence before applying the existing continuation/cancellation policy. No-change repositories receive no artificial commit.

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

<a id="dd-git-021"></a>

### DD-GIT-021 — Commit scope is explicit

Staging applies [FR-GIT-031](../functional/git-functional-specification-v01.md#fr-git-031). If available evidence cannot safely represent the requested staging policy, commit execution shall not proceed.

<a id="dd-git-022"></a>

### DD-GIT-022 — No-change is not fabricated success

The commit no-change decision applies [FR-GIT-029](../functional/git-functional-specification-v01.md#fr-git-029).

<a id="dd-git-023"></a>

### DD-GIT-023 — Commit message acceptance remains Git/application-owned

Resolve each repository’s message under [FR-GIT-032](../functional/git-functional-specification-v01.md#fr-git-032) before its commit primitive executes. Under [Design §11.10](../appmanager-design-specification-v01.md#_11-10-ai-assisted-workflow), authorized automatic acceptance uses deterministic Git criteria established before proposal generation; the proposal/accepted-message distinction is defined in [DD-GIT-009](#dd-git-009).

The coordinated result adds each repository’s eligibility/planning state, material staging effects, accepted-message provenance, resulting revision, skip/already-satisfied reason and remaining/recovery action to the repository result. Failure, cancellation, staleness or uncertainty follows §12 without erasing earlier commits. Recovery that changes completed history requires a subsequent explicitly authorized Git operation; it is not an implicit rollback.

<a id="dd-git-024"></a>

### DD-GIT-024 — AI is optional and subordinate

The optional message-assistance path applies [FR-GIT-033](../functional/git-functional-specification-v01.md#fr-git-033), [FR-GIT-034](../functional/git-functional-specification-v01.md#fr-git-034), [FR-GIT-035](../functional/git-functional-specification-v01.md#fr-git-035) and [FR-GIT-036](../functional/git-functional-specification-v01.md#fr-git-036). Its proposal record is [DD-GIT-009](#dd-git-009).

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

<a id="dd-git-025"></a>

### DD-GIT-025 — Push is repository intent only

Push composition applies [FR-GIT-048](../functional/git-functional-specification-v01.md#fr-git-048) and [FR-GIT-099](../functional/git-functional-specification-v01.md#fr-git-099).

<a id="dd-git-026"></a>

### DD-GIT-026 — Ambiguous remote blocks push

Remote selection applies [FR-GIT-044](../functional/git-functional-specification-v01.md#fr-git-044) using [DD-GIT-007](#dd-git-007).

### 8.6 Coordinated push

All-managed-repositories push is a Git-domain orchestration over an explicitly resolved DD-1.3 repository set.

The domain shall establish the complete reviewed scope and per-repository eligibility before initiating effects where reasonably possible. Each repository then receives repository-scoped push semantics.

<a id="dd-git-027"></a>

### DD-GIT-027 — Per-repository truth is retained

Coordinated push projects [DD-GIT-013](#dd-git-013) into [DD-GIT-014](#dd-git-014) under [FR-INV-036](../functional/application-invocation-functional-specification-v01.md#fr-inv-036) and [FR-INV-045](../functional/application-invocation-functional-specification-v01.md#fr-inv-045).

<a id="dd-git-028"></a>

### DD-GIT-028 — Continuation policy is explicit

Push continuation applies [FR-GIT-056](../functional/git-functional-specification-v01.md#fr-git-056). Establish that policy before execution or at an explicitly supported decision point; provider iteration order does not supply it.

<a id="dd-git-029"></a>

### DD-GIT-029 — No multi-repository transaction fiction

Coordinated Git effects apply [FR-INV-046](../functional/application-invocation-functional-specification-v01.md#fr-inv-046).

### 8.7 Synchronisation

Synchronisation orchestration shall support root, selected repository, selected set and all-managed-repositories scopes where the Functional baseline permits them.

For each repository, the domain shall:

1. establish repository eligibility and required upstream/remote relationship;
2. inspect local changes, conflicts, tracking and divergence relevant to the approved strategy;
3. preserve local work by rejecting or surfacing conditions requiring destructive or ambiguous conflict policy;
4. supply an explicit bounded integration/synchronisation intent to DD-2.3;
5. interpret resulting repository state;
6. preserve per-repository partial effects and cross-repository drift evidence.

<a id="dd-git-030"></a>

### DD-GIT-030 — Synchronisation shall not invent destructive conflict policy

Synchronisation applies [FR-GIT-068](../functional/git-functional-specification-v01.md#fr-git-068), [FR-GIT-069](../functional/git-functional-specification-v01.md#fr-git-069) and [FR-GIT-109](../functional/git-functional-specification-v01.md#fr-git-109) using the intent in [DD-GIT-010](#dd-git-010).

<a id="dd-git-031"></a>

### DD-GIT-031 — Narrow synchronisation may expose drift

Narrow synchronisation exposes the relationship drift diagnostics required by [FR-GIT-073](../functional/git-functional-specification-v01.md#fr-git-073) without broadening the resolved scope.

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

<a id="dd-git-032"></a>

### DD-GIT-032 — Relationship mechanics do not own project topology

After relationship execution, project topology remains governed by [Design](../appmanager-design-specification-v01.md#_9-6-project-discovery-and-context-resolution). Git returns the relationship evidence to that owner.

### 8.9 Managed-layer repository initialisation

When invoked directly or by a Nuxt-owned layer workflow, Git orchestration shall operate only on managed layers that DD-1.3 scope identifies as eligible for independent repositories.

For multiple layers, each target shall retain independent eligibility and outcome evidence.

<a id="dd-git-033"></a>

### DD-GIT-033 — Nuxt ownership is preserved

Layer-creation repository follow-on uses [FR-NUXT-065](../functional/nuxt-functional-specification-v01.md#fr-nuxt-065) and [FR-NUXT-067](../functional/nuxt-functional-specification-v01.md#fr-nuxt-067); acceptance of the Git portion uses repository evidence.

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

<a id="dd-git-034"></a>

### DD-GIT-034 — No inferred destructive target

Remote-deletion target resolution applies [FR-GIT-088](../functional/git-functional-specification-v01.md#fr-git-088) and [FR-GIT-089](../functional/git-functional-specification-v01.md#fr-git-089) through [DD-GIT-012](#dd-git-012).

<a id="dd-git-035"></a>

### DD-GIT-035 — Strong authorization is target-bound

Deletion authorization applies [FR-GIT-091](../functional/git-functional-specification-v01.md#fr-git-091) and [FR-GIT-092](../functional/git-functional-specification-v01.md#fr-git-092).

<a id="dd-git-036"></a>

### DD-GIT-036 — No cascading deletion

Deletion scope applies [FR-GIT-095](../functional/git-functional-specification-v01.md#fr-git-095).


---

## 9. Domain State and State Transitions

The Git domain does not own a durable replacement for repository state; repository facts remain DD-2.3 evidence and managed topology remains DD-1.3 state.

It does own transient orchestration state needed to preserve decision and effect truth during a Git use case.

<a id="dd-git-037"></a>

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

<a id="dd-git-038"></a>

### DD-GIT-038 — Multi-repository progress state

A coordinated operation shall preserve per-repository positions such as pending, skipped/already-satisfied, executing, completed, failed, conflicted, cancelled or not-attempted sufficiently to reconstruct truthful partial completion.

<a id="dd-git-039"></a>

### DD-GIT-039 — State transitions do not grant authority

Git orchestration states refine the workflow, subject to [Design](../appmanager-design-specification-v01.md#_6-2-application-engine-authority) and the supplied authority in §7.


---

## 10. Domain Policy and Decision Rules

<a id="dd-git-040"></a>

### DD-GIT-040 — Scope is intent-relative

Bind the repository subset to [Design](../appmanager-design-specification-v01.md#_9-7-managed-scope-and-operation-targeting) through [DD-GIT-005](#dd-git-005).

<a id="dd-git-041"></a>

### DD-GIT-041 — Eligibility is narrower than membership

Determine the operation-specific eligibility predicate in [DD-GIT-006](#dd-git-006) from authoritative context and DD-2.3 evidence; managed membership is the input, not the predicate result.

<a id="dd-git-042"></a>

### DD-GIT-042 — No broadest-scope fallback

Resolve ambiguous synchronisation scope under [FR-GIT-066](../functional/git-functional-specification-v01.md#fr-git-066). Other Git intents use the explicit scope record in [DD-GIT-005](#dd-git-005).

<a id="dd-git-043"></a>

### DD-GIT-043 — Provider defaults are not application policy

Provider defaults for remote selection, pull strategy, force behaviour, conflict handling, credential context, deletion target or continuation shall not become AppManager policy unless explicitly accepted by an authoritative contract.

<a id="dd-git-044"></a>

### DD-GIT-044 — Force-like semantics require separate authority

Force-like provider options apply [FR-GIT-110](../functional/git-functional-specification-v01.md#fr-git-110).

<a id="dd-git-045"></a>

### DD-GIT-045 — Technical capability does not imply enabled destructive use case

The remote-deletion primitive is consumed only under the enablement contract in [FR-GIT-087](../functional/git-functional-specification-v01.md#fr-git-087).


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

<a id="dd-git-046"></a>

### DD-GIT-046 — Mutation intent originates above Repository Capability

The domain supplies DD-2.3 intent through [DD-GIT-008](#dd-git-008) under [Design](../appmanager-design-specification-v01.md#_6-6-capability-boundaries-and-providers).

<a id="dd-git-047"></a>

### DD-GIT-047 — Authorization is effect-relative

Read-only inspection, ordinary consequential repository mutation and destructive remote deletion bind [FR-GIT-101](../functional/git-functional-specification-v01.md#fr-git-101) to the corresponding DD-1 authorization checkpoints.

<a id="dd-git-048"></a>

### DD-GIT-048 — Scope review precedes coordinated effects where required

Review the repository set under [FR-GIT-053](../functional/git-functional-specification-v01.md#fr-git-053) together with material remote targets where invocation policy requires review.

<a id="dd-git-049"></a>

### DD-GIT-049 — Stale authorization-sensitive identity invalidates execution

A material repository/remote identity change after authorization applies [DD-ENG-027](../dd_1_application_core/dd-1-5-application-engine-detailed-design-v01.md#dd-eng-027) to the exact execution target.

<a id="dd-git-050"></a>

### DD-GIT-050 — Completed effects remain truthful

Git results preserve effects under [FR-INV-036](../functional/application-invocation-functional-specification-v01.md#fr-inv-036) and [FR-INV-045](../functional/application-invocation-functional-specification-v01.md#fr-inv-045).


---

## 12. Failure, Cancellation, and Partial Effects

<a id="dd-git-051"></a>

### DD-GIT-051 — Capability failure remains repository-scoped evidence

Repository/provider failure shall preserve the affected managed repository and functional stage so Git orchestration can interpret the failure without collapsing it into project absence or unknown-command semantics.

<a id="dd-git-052"></a>

### DD-GIT-052 — Cancellation stops new effects

Coordinated cancellation applies [FR-GIT-104](../functional/git-functional-specification-v01.md#fr-git-104). In-flight behavior remains governed by DD-2.3.

<a id="dd-git-053"></a>

### DD-GIT-053 — Cancellation is not rollback

Completed Git effects after cancellation apply [FR-INV-032](../functional/application-invocation-functional-specification-v01.md#fr-inv-032).

<a id="dd-git-054"></a>

### DD-GIT-054 — Partial completion is first-class

Aggregate the repository records in [DD-GIT-013](#dd-git-013) under [DD-1.2 partial completion](../dd_1_application_core/dd-1-2-execution-outcomes-detailed-design-v01.md#_14-partial-completion).

<a id="dd-git-055"></a>

### DD-GIT-055 — Retry requires revalidation

Retry/continuation applies [FR-GIT-108](../functional/git-functional-specification-v01.md#fr-git-108) and the [Engine stale-state checkpoint](../dd_1_application_core/dd-1-5-application-engine-detailed-design-v01.md#dd-eng-024) to repository state, remote identity, managed scope and authorization assumptions before replay.

<a id="dd-git-056"></a>

### DD-GIT-056 — Indeterminate provider effects remain indeterminate

If a provider failure leaves it unknown whether a consequential remote effect completed, the Git domain shall preserve that uncertainty and require verification/recovery rather than fabricating success or failure.

---

## 13. Headless and Interaction Independence

<a id="dd-git-057"></a>

### DD-GIT-057 — One Git semantic model across adapters

Git adapters follow [Design](../appmanager-design-specification-v01.md#_4-6-presentation-independence).

<a id="dd-git-058"></a>

### DD-GIT-058 — Selection is structural, not menu-owned

Repository, remote, change-set and relationship-candidate selections bind [FR-GIT-112](../functional/git-functional-specification-v01.md#fr-git-112) to the intent records in §7.

<a id="dd-git-059"></a>

### DD-GIT-059 — Headless ambiguity fails safely

Missing scope, remote identity, message decision or destructive target/authorization follows [FR-INV-020](../functional/application-invocation-functional-specification-v01.md#fr-inv-020).

<a id="dd-git-060"></a>

### DD-GIT-060 — Machine-consumable coordinated results

Coordinated repository records in [DD-GIT-014](#dd-git-014) are exposed under [FR-INV-021](../functional/application-invocation-functional-specification-v01.md#fr-inv-021).


---

## 14. Concurrency, Idempotency, and Conflict Behaviour

<a id="dd-git-061"></a>

### DD-GIT-061 — Repository-state preconditions guard consequential work

Where concurrent or external repository changes could invalidate an approved operation, Git orchestration shall use DD-2.3 revision/state preconditions or fresh evidence sufficient to detect material conflict before consequential execution.

<a id="dd-git-062"></a>

### DD-GIT-062 — Parallelism shall not change semantics

An implementation may later choose sequential or bounded parallel execution where permitted, but concurrency shall not change resolved scope, continuation policy, per-repository truth, authorization requirements or outcome semantics.

<a id="dd-git-063"></a>

### DD-GIT-063 — Already-satisfied states are explicit

Already-satisfied Git states use [FR-GIT-047](../functional/git-functional-specification-v01.md#fr-git-047), [FR-GIT-076](../functional/git-functional-specification-v01.md#fr-git-076) and [FR-GIT-022](../functional/git-functional-specification-v01.md#fr-git-022), without forcing a mutation merely to produce success.

<a id="dd-git-064"></a>

### DD-GIT-064 — Commit is not generally idempotent

Commit creation shall not be retried as though it were inherently idempotent. After uncertain or failed execution, resulting repository revision/status evidence shall be checked before another commit is attempted.

<a id="dd-git-065"></a>

### DD-GIT-065 — Remote effects require post-failure verification where uncertain

Remote-effect verification applies [DD-GIT-056](#dd-git-056) to push, synchronisation and deletion before recovery replay.


---

## 15. Security and Sensitive Information

<a id="dd-git-066"></a>

### DD-GIT-066 — Credential material remains below Git-domain results

Git-domain payloads apply [DD-1.2 redaction](../dd_1_application_core/dd-1-2-execution-outcomes-detailed-design-v01.md#_24-sensitive-information-and-redaction) to credentials, authorization headers and credential-helper output.

<a id="dd-git-067"></a>

### DD-GIT-067 — Remote identity is not necessarily secret but is bounded

Repository URLs, owner/account names and remote metadata shall be exposed only to the extent required by the approved use case, diagnostics, review or recovery context.

<a id="dd-git-068"></a>

### DD-GIT-068 — AI disclosure is separately governed

Commit-message disclosure applies [FR-GIT-036](../functional/git-functional-specification-v01.md#fr-git-036) through DD-2.7. Repository diffs, history, filenames and configuration are disclosure inputs, not authority to disclose.

<a id="dd-git-069"></a>

### DD-GIT-069 — Destructive provider authorization is least-scope

Remote deletion shall use only the provider authorization/capability required for the exact target and shall not treat broad provider credentials as authority to delete other repositories.

---

## 16. Extensibility and Replaceability

<a id="dd-git-070"></a>

### DD-GIT-070 — Repository provider replaceability

Repository provider substitution follows [Design](../appmanager-design-specification-v01.md#_6-6-capability-boundaries-and-providers) at the DD-2.3 seam.

<a id="dd-git-071"></a>

### DD-GIT-071 — Remote-host provider replaceability

The remote identity model in [DD-GIT-012](#dd-git-012) binds the provider-independent capability contract in [Design](../appmanager-design-specification-v01.md#_6-6-capability-boundaries-and-providers).

<a id="dd-git-072"></a>

### DD-GIT-072 — AI provider replacement is invisible to commit authority

AI provider substitution preserves [FR-GIT-033](../functional/git-functional-specification-v01.md#fr-git-033) and [Design](../appmanager-design-specification-v01.md#_11-10-ai-assisted-workflow).

<a id="dd-git-073"></a>

### DD-GIT-073 — No generic repository workflow framework by similarity

Repository-scoped push/synchronization orchestration apply the [shared-abstraction criterion](../dd_1_application_core/dd-1-5-application-engine-detailed-design-v01.md#dd-eng-046) within the existing DD-1/DD-2 ownership boundaries.

<a id="dd-git-074"></a>

### DD-GIT-074 — Implementation topology remains open

[The Implementation Specification boundary](../project-documentation-guide-v01.md#_8-level-4-implementation-specification) leaves service/class/package/process and Git CLI/library/hosting-SDK topology open.


---

## 17. Testability and Conformance Requirements

The design shall permit independent verification of Git-domain policy and orchestration using controlled substitutes for DD-1 context and DD-2 capabilities.

<a id="dd-git-075"></a>

### DD-GIT-075 — Scope-policy testability

Tests shall be able to demonstrate that root, selected repository, selected set and all-managed-repositories intents resolve without filesystem-discovery authority or silent scope expansion.

<a id="dd-git-076"></a>

### DD-GIT-076 — Repository-capability substitution

Git orchestration shall be testable against controlled DD-2.3 evidence/results without requiring a live Git provider for every domain-policy test.

<a id="dd-git-077"></a>

### DD-GIT-077 — Multi-repository partial-effect testability

Tests shall be able to exercise per-repository success, failure, skip, conflict, cancellation, continuation and indeterminate states and verify truthful aggregation.

<a id="dd-git-078"></a>

### DD-GIT-078 — Safety-boundary testability

Tests shall be able to prove that recognition does not authorize mutation, ambiguous remotes block consequential execution, unrelated changes are not silently staged, destructive target identity is exact, and target-bound authorization is enforced.

<a id="dd-git-079"></a>

### DD-GIT-079 — AI independence testability

Commit creation shall be testable with AI unavailable, AI failing, AI proposing output and caller/policy rejecting or revising the proposal.

<a id="dd-git-080"></a>

### DD-GIT-080 — Headless determinism testability

Tests shall verify that missing repository/remote/destructive inputs fail structurally in Headless mode rather than triggering presentation-specific prompting or implicit defaults.

<a id="dd-git-081"></a>

### DD-GIT-081 — Stale-state and retry testability

Tests shall be able to introduce repository-state changes between inspection and execution and verify deliberate revalidation/rejection rather than blind use of stale evidence.

<a id="dd-git-082"></a>

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

<a id="dd-git-ci-001"></a>

### DD-GIT-CI-001 — Domain/capability seam

The Git/Repository seam in §6 binds [Design](../appmanager-design-specification-v01.md#_6-6-capability-boundaries-and-providers).

<a id="dd-git-ci-002"></a>

### DD-GIT-CI-002 — Managed scope authority

Repository discovery evidence is consumed under [Design](../appmanager-design-specification-v01.md#_9-6-project-discovery-and-context-resolution) and [Design](../appmanager-design-specification-v01.md#_9-7-managed-scope-and-operation-targeting).

<a id="dd-git-ci-003"></a>

### DD-GIT-CI-003 — Application Core authority

The context and final acceptance path in §8 follows [Design](../appmanager-design-specification-v01.md#_6-2-application-engine-authority).

<a id="dd-git-ci-004"></a>

### DD-GIT-CI-004 — Evidence before acceptance

Repository evidence acceptance follows [Design](../appmanager-design-specification-v01.md#_11-11-workflow-results-failure-and-acceptance).

<a id="dd-git-ci-005"></a>

### DD-GIT-CI-005 — Explicit consequential scope

The scope and remote records in §7 bind [Design](../appmanager-design-specification-v01.md#_9-7-managed-scope-and-operation-targeting), [FR-GIT-044](../functional/git-functional-specification-v01.md#fr-git-044) and [FR-GIT-066](../functional/git-functional-specification-v01.md#fr-git-066).

<a id="dd-git-ci-006"></a>

### DD-GIT-CI-006 — Local-work protection

Local-work protection follows [FR-GIT-069](../functional/git-functional-specification-v01.md#fr-git-069) and [FR-GIT-109](../functional/git-functional-specification-v01.md#fr-git-109).

<a id="dd-git-ci-007"></a>

### DD-GIT-CI-007 — Truthful partial effects

Coordinated results apply [FR-INV-036](../functional/application-invocation-functional-specification-v01.md#fr-inv-036), [FR-INV-045](../functional/application-invocation-functional-specification-v01.md#fr-inv-045) and [FR-INV-046](../functional/application-invocation-functional-specification-v01.md#fr-inv-046).

<a id="dd-git-ci-008"></a>

### DD-GIT-CI-008 — AI remains optional proposal

Message assistance binds [FR-GIT-033](../functional/git-functional-specification-v01.md#fr-git-033) and [Design](../appmanager-design-specification-v01.md#_11-10-ai-assisted-workflow) through the per-repository proposal/accepted-message model.

<a id="dd-git-ci-009"></a>

### DD-GIT-CI-009 — Destructive target exactness

The deletion record binds [FR-GIT-088](../functional/git-functional-specification-v01.md#fr-git-088), [FR-GIT-091](../functional/git-functional-specification-v01.md#fr-git-091), [FR-GIT-092](../functional/git-functional-specification-v01.md#fr-git-092) and [FR-GIT-095](../functional/git-functional-specification-v01.md#fr-git-095).

<a id="dd-git-ci-010"></a>

### DD-GIT-CI-010 — Interaction independence

Git adapter projections apply [Design](../appmanager-design-specification-v01.md#_4-6-presentation-independence).

<a id="dd-git-ci-011"></a>

### DD-GIT-CI-011 — Provider independence

Provider seams apply [Design](../appmanager-design-specification-v01.md#_6-6-capability-boundaries-and-providers); [the implementation boundary](../project-documentation-guide-v01.md#_8-level-4-implementation-specification) governs concrete runtime topology.

<a id="dd-git-ci-012"></a>

### DD-GIT-CI-012 — Repository/source distinction

Git structural-evidence composition follows [DD-2.4 repository-context interpretation](../dd_2_shared_capabilities/dd-2-4-source-intelligence-detailed-design-v01.md#repository-context).


---

## Version 1 Detailed Design Baseline

This document establishes the Version 1 Detailed Design baseline for the AppManager Git domain.

Implementation Specifications may reduce these contracts to concrete Node.js/TypeScript modules, provider bindings, libraries, command forms, source locations and tests under ADR-0001, but shall preserve the authority, scope, policy, safety, evidence and provider-independence boundaries defined here.
