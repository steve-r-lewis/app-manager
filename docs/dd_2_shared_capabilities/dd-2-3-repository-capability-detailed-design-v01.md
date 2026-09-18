# DD-2.3 — AppManager Repository Capability Detailed Design

> **Detailed Design ID:** DD-2.3
>
> **Design family:** DD-2 — Shared Capabilities

> **Status:** Version 1 Detailed Design Specification
>
> **Detailed Design authority:** This document defines the permanent shared contracts for bounded repository inspection and repository-state operations beneath AppManager application and Git-domain authority. It refines, but does not override, the root Design Specification, Functional Specifications, accepted ADRs, or the DD-1 Application Core Detailed Designs.
>
> **Sources and navigation:** [Project Documentation Guide](../project-documentation-guide-v01.md), [AppManager Design Specification](../appmanager-design-specification-v01.md), [Detailed Design Register](../project_management/detailed-design-register-v01.md), [ADR-0001 — Primary Application Runtime](../project_management/decisions/adr-0001-primary-application-runtime.md)
>
> **Related Detailed Design authorities:** [DD-1.1 — Application Invocation](../dd_1_application_core/dd-1-1-application-invocation-detailed-design-v01.md), [DD-1.2 — Execution Outcomes](../dd_1_application_core/dd-1-2-execution-outcomes-detailed-design-v01.md), [DD-1.3 — Managed Project](../dd_1_application_core/dd-1-3-managed-project-detailed-design-v01.md), [DD-1.4 — Configuration Resolution](../dd_1_application_core/dd-1-4-configuration-resolution-detailed-design-v01.md), [Application Core Bootstrap Resolution](../dd_1_application_core/dd-1-5-application-engine-detailed-design-v01.md#_8-orchestration-lifecycle), [DD-1.5 — Application Engine](../dd_1_application_core/dd-1-5-application-engine-detailed-design-v01.md), [DD-2.1 — Resource Access](dd-2-1-resource-access-detailed-design-v01.md), [DD-2.2 — Process Execution](dd-2-2-process-execution-detailed-design-v01.md)
>
> **Primary Functional authorities:** [docs/functional/git-functional-specification-v01.md](../functional/git-functional-specification-v01.md), [docs/functional/managed-project-functional-specification-v01.md](../functional/managed-project-functional-specification-v01.md), [docs/functional/application-invocation-functional-specification-v01.md](../functional/application-invocation-functional-specification-v01.md), [docs/functional/configuration-functional-specification-v01.md](../functional/configuration-functional-specification-v01.md)
>
> **Related domain Functional authorities:** App and Nuxt where their workflows delegate repository initialization or repository relationship work; AI where commit-message assistance consumes bounded repository evidence; Quality/Docs only where they inspect repository facts without acquiring repository workflow authority.

---

## 1. Purpose

Repository Capability supplies normalized repository state and bounded local/remote primitives. Its request contracts make repositories, refs, remotes, revisions and consequential options explicit so Git orchestration can reason about effects without depending on a CLI or host SDK.

[Git Domain](../dd_3_high_coupling_domains/dd-3-2-git-domain-detailed-design-v01.md) supplies application intent and coordinated policy. Source parsing consumes the separate [DD-2.4 snapshot contract](dd-2-4-source-intelligence-detailed-design-v01.md#repository-context). The following local models distinguish repository facts from both concerns.

## 2. Scope

This design owns permanent internal contracts for:

- repository references and repository identity evidence;
- repository recognition and capability availability;
- local repository metadata and status facts;
- repository configuration facts;
- branch and ref facts;
- upstream/tracking facts;
- remote references and remote identity facts;
- revision/commit identity and ancestry facts;
- worktree/index/staging facts where relevant;
- diff and change-set evidence;
- bounded staging/unstaging primitives;
- bounded commit creation primitives;
- repository initialization primitives;
- bounded remote-add/update/remove primitives where required;
- fetch primitives;
- pull/integration primitives where the integration strategy is explicitly supplied;
- push primitives;
- single-repository synchronization primitives where all relevant policy inputs are explicit;
- repository-relationship primitives such as submodule-style relationships where supported;
- repository clone/provisioning primitives where required by approved callers;
- remote-host repository identity/availability operations where applicable;
- remote-host creation/deletion primitives where separately authorized by an owning use case;
- stale-state/precondition evidence;
- provider-result normalization into DD-1.2 evidence and diagnostics;
- cancellation and progress integration where providers support them;
- provider isolation and testability.

This design defines a capability boundary. It does not prescribe one `GithubService`, one Git library, one CLI, one remote provider, one class hierarchy, one package layout or one TypeScript interface.

---

## 3. Explicit Non-Ownership

Repository Capability shall not own:

- canonical `git` application commands or use-case identity;
- Git-domain workflow orchestration;
- root/selected/all repository application-scope selection;
- managed-project identity or repository topology authority;
- application authorization or confirmation policy;
- destructive-operation approval policy;
- effective-configuration precedence;
- commit-message approval semantics;
- AI prompt construction or AI acceptance;
- source-transformation semantics merely because repository changes contain source files;
- build, test, documentation, deployment or CI/CD workflow semantics;
- application release/versioning policy;
- automatic force-push policy;
- automatic merge/rebase/conflict-resolution policy;
- retry, fallback or continuation policy unless explicitly delegated;
- final AppManager success, failure, partial-success or cancellation acceptance;
- the complete remote-hosting product model merely because one repository provider is GitHub.

Repository Capability may reject an invalid, unsafe, unsupported or stale technical request within its own contract. Such rejection does not replace application-level authorization, scope or workflow policy.

---

## 4. Architectural Position

The permanent dependency direction is:

```text
Application Engine / owning Git or application use case
        |
        +--> Managed Project / repository topology
        +--> operation repository scope
        +--> effective configuration
        +--> policy / safety / authorization
        +--> workflow / acceptance criteria
        |
        v
bounded Repository Capability request
        |
        v
+-------------------------------------------+
| Repository Capability                     |
|                                           |
| resolve supplied repository reference     |
| inspect repository facts                  |
| enforce technical preconditions           |
| execute bounded repository primitive      |
| normalize provider evidence               |
+----------------------+--------------------+
                       |
          +------------+-------------+
          |                          |
          v                          v
 local repository provider     remote-host provider
 (Git library/CLI/etc.)        (GitHub/etc., if needed)
          |                          |
          +------------+-------------+
                       |
                       v
            normalized repository evidence
                       |
                       v
Application Engine / owning use case
       interpretation / acceptance
```

### 4.1 Shared capability, not second Git domain

Repository Capability provides a common technical seam for consumers with different repository intent. The [Git domain](../dd_3_high_coupling_domains/dd-3-2-git-domain-detailed-design-v01.md) supplies repository policy and coordinated workflows under [Design §6.6](../appmanager-design-specification-v01.md#_6-6-capability-boundaries-and-providers); the models below describe the delegated primitive inputs and evidence.

### 4.2 Relationship to Managed Project

Managed Project owns the canonical project-oriented knowledge that repositories exist and how they relate to managed entities.

Repository Capability may produce repository recognition evidence that contributes to Managed Project resolution, but after a Managed Project Context exists it consumes repository references/topology supplied from that context rather than independently redefining project ownership.

The distinction is:

```text
repository discoverable
    != repository belongs to managed project
    != repository selected for this operation
    != repository eligible for this operation
    != repository authorized for mutation
```

### 4.3 Relationship to Process Execution

A repository provider may use DD-2.2 Process Execution to invoke Git or another command-line tool.

That provider dependency does not make raw process exit codes, stdout, stderr or shell commands the Repository Capability contract.

The normalization path is:

```text
process/provider evidence
    -> repository-provider interpretation
    -> normalized repository evidence
    -> Git/application use-case interpretation
    -> final AppManager outcome
```

### 4.4 Relationship to Resource Access

Resource Access may support repository discovery, configuration-resource access, patch/diff transport, or relationship-file mutation where a provider implementation needs it.

Repository Capability owns repository semantics; Resource Access owns bounded resource mechanics.

Neither capability may infer application scope from technical accessibility.

---

## 5. Responsibility Model

Repository Capability is decomposed into logical responsibilities:

1. **Repository Reference Contract** — stable AppManager-oriented reference to a local or remote repository target.
2. **Repository Recognizer** — produces bounded recognition evidence without mutation authority.
3. **Repository Fact Reader** — exposes normalized status, refs, remotes, configuration and revision facts.
4. **Change Evidence Reader** — exposes normalized diff/change/staging evidence.
5. **Repository Mutation Executor** — performs already-approved local repository primitives such as initialize, stage, unstage and commit.
6. **Remote Transfer Executor** — performs explicitly bounded fetch/push/integration primitives.
7. **Relationship Executor** — performs explicitly approved repository-relationship changes.
8. **Remote Host Adapter** — exposes bounded host-specific primitives where an approved use case requires remote repository operations.
9. **Repository Precondition Validator** — enforces request-specific expected state and stale-state guards.
10. **Repository Evidence Normalizer** — converts provider-native results into DD-1.2-compatible evidence and diagnostics.
11. **Repository Provider Adapter** — isolates concrete Git/library/CLI/provider details.

These are permanent responsibility distinctions, not mandatory implementation classes.

---

## 6. Repository Reference Contract

<a id="dd-repo-001"></a>

### DD-REPO-001 — Explicit repository reference

Every repository operation shall target a bounded repository reference rather than relying on ambient process location as implicit authority.

A repository reference shall be capable of representing, where relevant:

- local repository identity/reference;
- repository root/worktree location;
- managed-project repository identity supplied by higher-level context;
- expected repository kind/capability;
- remote-host repository identity where applicable;
- expected revision/state evidence;
- correlation with the owning managed entity or workflow stage.

Exact fields and serialization belong to Implementation Specification.

<a id="dd-repo-002"></a>

### DD-REPO-002 — Reference is not authority

Repository references are technical inputs under [Design](../appmanager-design-specification-v01.md#_6-6-capability-boundaries-and-providers); the bounded request still requires caller authority.

<a id="dd-repo-003"></a>

### DD-REPO-003 — No ambient-CWD authority

Repository selection follows [DD-REPO-001](#dd-repo-001); a provider working-directory parameter does not select the application target.

<a id="dd-repo-004"></a>

### DD-REPO-004 — Stable identity over incidental path

Where the managed model has a stable repository identity distinct from its local path, the capability shall preserve that distinction. Moving or checking out a repository at another path shall not silently redefine managed identity.

---

## 7. Repository Recognition

Repository recognition is a read-only evidence-producing responsibility.

<a id="dd-repo-005"></a>

### DD-REPO-005 — Recognition result

Recognition shall be capable of distinguishing at least:

- recognized supported repository;
- no repository recognized;
- ambiguous/nested repository state;
- inaccessible repository evidence;
- unsupported repository form;
- provider unavailable;
- indeterminate/error state.

<a id="dd-repo-006"></a>

### DD-REPO-006 — Recognition does not mutate

Recognition shall not initialize, repair, fetch, clean, reset, stage, commit or otherwise mutate repository state in order to make recognition succeed.

<a id="dd-repo-007"></a>

### DD-REPO-007 — Recognition does not assign managed ownership

Repository recognition contributes project evidence under [Design](../appmanager-design-specification-v01.md#_9-6-project-discovery-and-context-resolution).

<a id="dd-repo-008"></a>

### DD-REPO-008 — Nested repository evidence

Where nested or overlapping repositories are technically observable, recognition should preserve enough evidence for higher-level topology resolution rather than silently selecting the nearest or outermost repository as universal truth.

<a id="dd-repo-009"></a>

### DD-REPO-009 — Provider-specific markers remain below boundary

`.git` directories/files, provider metadata, worktree administration paths and library-native recognition objects are implementation evidence; the general contract exposes repository facts rather than requiring callers to understand those markers.

---

## 8. Repository Identity and Revision Evidence

<a id="dd-repo-010"></a>

### DD-REPO-010 — Repository identity facts

Where available, normalized identity evidence may include:

- local repository root/reference;
- current revision identity;
- current branch or detached-head state;
- repository format/support status;
- configured remotes;
- remote-host identity derived from configured remote information where safely and unambiguously recognized;
- worktree/common-repository relationships where materially relevant.

<a id="dd-repo-011"></a>

### DD-REPO-011 — Revision identities are evidence

Revision identifiers remain repository evidence under [Design](../appmanager-design-specification-v01.md#_11-11-workflow-results-failure-and-acceptance) and the [source-snapshot distinction](dd-2-4-source-intelligence-detailed-design-v01.md#repository-context).

<a id="dd-repo-012"></a>

### DD-REPO-012 — Detached state is explicit

Detached-head or equivalent non-branch states shall be represented distinctly from a normal named branch where that distinction affects later operations.

<a id="dd-repo-013"></a>

### DD-REPO-013 — Unknown identity remains unknown

If the provider cannot establish a stable identity or revision, the capability shall expose uncertainty instead of manufacturing a fallback identity from directory names or remote URLs.

---

## 9. Repository Status Model

Repository status shall be normalized into repository-oriented facts rather than provider-native status objects.

### 9.1 Status dimensions

The capability shall be able to represent, where available and relevant:

- clean versus changed worktree/index state;
- tracked modifications;
- additions/deletions/renames;
- untracked resources;
- ignored-state facts where requested;
- staged versus unstaged changes;
- conflicted/unmerged paths;
- current branch/ref state;
- upstream/tracking relationship;
- ahead/behind counts or equivalent divergence facts;
- missing upstream;
- repository operation in progress where provider exposes it safely;
- shallow or incomplete-history facts where materially relevant.

<a id="dd-repo-014"></a>

### DD-REPO-014 — Status is multidimensional

Repository status shall not be collapsed into a single `isDirty` Boolean when callers require staged, unstaged, conflict, upstream or divergence distinctions.

<a id="dd-repo-015"></a>

### DD-REPO-015 — Clean is not synchronized

A clean worktree does not imply that the repository is synchronized with a remote or that it is eligible to push/pull.

<a id="dd-repo-016"></a>

### DD-REPO-016 — Ahead/behind are contextual facts

Ahead/behind evidence is meaningful only relative to a resolved comparison/upstream ref. The capability shall not present such counts without preserving the applicable reference context where needed.

<a id="dd-repo-017"></a>

### DD-REPO-017 — Status acquisition does not authorize mutation

Consume status as evidence under [Design](../appmanager-design-specification-v01.md#_9-9-non-destructive-ownership-and-unmanaged-content) before any separately requested repository effect.


---

## 10. Repository Configuration Facts

<a id="dd-repo-018"></a>

### DD-REPO-018 — Bounded configuration inspection

Repository Capability may expose repository configuration facts required by approved use cases, including branch tracking, remotes, user identity or provider settings where applicable.

<a id="dd-repo-019"></a>

### DD-REPO-019 — Sensitive configuration minimization

Repository configuration evidence applies [DD-1.2 redaction](../dd_1_application_core/dd-1-2-execution-outcomes-detailed-design-v01.md#_24-sensitive-information-and-redaction) to credentials, helper output and authentication data.

<a id="dd-repo-020"></a>

### DD-REPO-020 — Git configuration is not AppManager configuration

Repository-native configuration may be evidence/input to Git-domain behavior, but it is distinct from DD-1.4 AppManager effective configuration and shall not create a competing AppManager configuration-precedence model.

<a id="dd-repo-021"></a>

### DD-REPO-021 — Configuration source/provenance

Where provider configuration scope matters, the capability should preserve enough provenance to distinguish facts such as local repository configuration from broader provider/user/system configuration without requiring callers to parse native config files.

---

## 11. Branches, Refs and Tracking

<a id="dd-repo-022"></a>

### DD-REPO-022 — Branch/ref facts

The capability shall expose normalized branch/ref facts required by approved use cases without requiring callers to consume provider-native ref objects.

<a id="dd-repo-023"></a>

### DD-REPO-023 — Local and remote refs remain distinct

Local branch identity, remote-tracking refs and remote branch targets shall not be conflated.

<a id="dd-repo-024"></a>

### DD-REPO-024 — Upstream relation is explicit

A branch may have no upstream, one resolved upstream, or an ambiguous/invalid tracking state. Those states shall remain distinguishable.

<a id="dd-repo-025"></a>

### DD-REPO-025 — Ref mutation requires explicit request

Creating, renaming, switching or deleting branches/refs shall occur only through an explicit bounded request from an owning use case/capability.

<a id="dd-repo-026"></a>

### DD-REPO-026 — No implicit default-branch rewrite

Repository initialization or provisioning may receive an approved default branch value, but Repository Capability shall not independently impose a product-wide branch naming policy.

---

## 12. Remote Model

### 12.1 Remote references

A local repository may contain zero, one or multiple remotes. A normalized remote model shall be capable of representing:

- remote name/identity;
- fetch endpoint identity;
- push endpoint identity where distinct;
- provider/host classification where safely recognizable;
- remote repository identity where unambiguous;
- availability/validation evidence where explicitly requested.

<a id="dd-repo-027"></a>

### DD-REPO-027 — Multiple remotes are first-class

The capability shall not assume `origin` is the only meaningful remote.

<a id="dd-repo-028"></a>

### DD-REPO-028 — Remote selection is supplied

When an operation requires a particular remote, the owning use case shall resolve or supply the intended remote under its application semantics. Repository Capability shall not silently choose among ambiguous remotes.

<a id="dd-repo-029"></a>

### DD-REPO-029 — Remote URL is not authorization

Remote references follow [Design](../appmanager-design-specification-v01.md#_6-6-capability-boundaries-and-providers) as inputs to a separately authorized network or mutation request.

<a id="dd-repo-030"></a>

### DD-REPO-030 — Fetch and push endpoints may differ

The contract shall preserve separate fetch/push endpoint facts where the repository provider supports them.

<a id="dd-repo-031"></a>

### DD-REPO-031 — Remote identity parsing is bounded

Host/provider/repository identity may be normalized from a remote reference where unambiguous, but ambiguous/custom transport syntax shall remain ambiguous rather than guessed.

---

## 13. Change and Diff Evidence

Repository Capability shall expose bounded change evidence for commit planning, AI assistance, preview, diagnostics and other approved consumers.

<a id="dd-repo-032"></a>

### DD-REPO-032 — Change domains remain distinguishable

The contract shall be able to distinguish, where relevant:

- worktree versus index/staged changes;
- index versus committed revision changes;
- revision versus revision changes;
- repository versus upstream/remote changes.

<a id="dd-repo-033"></a>

### DD-REPO-033 — Diff output is evidence

A textual patch may be one representation of change evidence, but general callers shall not be required to infer all semantics from provider-formatted patch text where structured facts are available.

<a id="dd-repo-034"></a>

### DD-REPO-034 — Large diff bounding

Diff/change retrieval shall support bounding, summarization metadata or truncation evidence where required to avoid unbounded memory/context use.

<a id="dd-repo-035"></a>

### DD-REPO-035 — Sensitive diff handling

Repository diffs may contain secrets or private source. Consumers such as AI capability shall receive only the bounded context authorized by the owning use case and applicable sensitive-information policy.

<a id="dd-repo-036"></a>

### DD-REPO-036 — Diff retrieval does not stage

Reading a diff or change set shall not alter staging state.

---

## 14. Staging and Index Primitives

Staging is a repository mutation primitive whose application semantics remain with the Git use case.

<a id="dd-repo-037"></a>

### DD-REPO-037 — Explicit staging target

A staging request shall identify the bounded change/resource set intended for staging or explicitly indicate the approved whole-repository scope.

<a id="dd-repo-038"></a>

### DD-REPO-038 — No hidden stage-all

Repository Capability shall not silently expand a selected staging request to the entire repository merely because the provider exposes a convenient `add .` operation.

<a id="dd-repo-039"></a>

### DD-REPO-039 — Staging preconditions

Where a caller supplies expected status/revision evidence, the capability shall validate that evidence before applying staging changes or report stale-state conflict.

<a id="dd-repo-040"></a>

### DD-REPO-040 — Staging result

The normalized result shall identify the technical staging outcome and sufficient resulting status/change evidence for the caller to determine whether the requested staging intent was satisfied.

<a id="dd-repo-041"></a>

### DD-REPO-041 — Unstaging/reset distinction

Removing changes from the index without discarding worktree content shall remain distinguishable from destructive reset/discard operations.

<a id="dd-repo-042"></a>

### DD-REPO-042 — Destructive reset is not generic staging

Repository Capability shall not expose a vague reset primitive whose semantics can silently discard local work. Any destructive ref/index/worktree reset requires an explicitly specified higher-level use case and bounded technical contract.

---

## 15. Commit Primitive

<a id="dd-repo-043"></a>

### DD-REPO-043 — Bounded commit request

A commit request shall identify the target repository and the already-resolved commit message plus any explicit repository-provider options required by the approved use case.

<a id="dd-repo-044"></a>

### DD-REPO-044 — Commit-message authority remains upstream

Commit-message source and acceptance policy come from the [Git commit contract](../functional/git-functional-specification-v01.md#_8-commit); the primitive receives the resolved message in DD-REPO-043.

<a id="dd-repo-045"></a>

### DD-REPO-045 — Staging behavior is explicit

Commit creation shall not implicitly stage additional changes unless the bounded commit request explicitly includes an already-approved staging behavior.

<a id="dd-repo-046"></a>

### DD-REPO-046 — Commit identity evidence

On successful technical commit creation, the capability should return normalized evidence of the created revision/commit identity and resulting repository state where available.

<a id="dd-repo-047"></a>

### DD-REPO-047 — No commit created is distinct

Provider behavior indicating that no commit was created, including no eligible staged changes, shall remain distinguishable from successful new commit creation.

<a id="dd-repo-048"></a>

### DD-REPO-048 — Hook/provider effects

Repository hooks or provider extensions may affect commit execution. Their raw output remains provider evidence; any resulting failure or state change shall be normalized without assuming the provider's message is the AppManager final outcome.

---

## 16. Repository Initialization

<a id="dd-repo-049"></a>

### DD-REPO-049 — Explicit initialization target

Initialization shall target an explicit bounded repository location/reference supplied by an authorized caller.

<a id="dd-repo-050"></a>

### DD-REPO-050 — Existing repository detection

If a repository already exists at or governs the target, the capability shall report that fact and shall not silently reinitialize/replace identity unless a separately specified repair/migration use case explicitly requests it.

<a id="dd-repo-051"></a>

### DD-REPO-051 — Initialization options are supplied

Default branch, repository-local identity or similar initialization inputs shall come from explicit request/effective configuration semantics above the capability.

<a id="dd-repo-052"></a>

### DD-REPO-052 — Initialization does not imply remote creation

Creating a local repository does not create a remote-host repository, add a remote, push history or establish a managed-project relationship unless separately requested and authorized.

<a id="dd-repo-053"></a>

### DD-REPO-053 — Initialization evidence

The result shall distinguish newly initialized, already existing, unsupported, failed and indeterminate states and return safe repository identity/state evidence where available.

---

## 17. Fetch Primitive

Fetch updates local remote-tracking/object state from an explicitly selected remote/reference context.

<a id="dd-repo-054"></a>

### DD-REPO-054 — Explicit fetch source

A fetch request shall identify the intended remote and any branch/refspec/depth constraints required by the owning semantics.

<a id="dd-repo-055"></a>

### DD-REPO-055 — Fetch is not integration

A successful fetch does not imply that the current branch/worktree was updated or that the repository is synchronized.

<a id="dd-repo-056"></a>

### DD-REPO-056 — Fetch effects are repository effects

Fetch may alter local repository object/ref state even when the worktree is unchanged. The capability shall not misrepresent it as a pure read operation.

<a id="dd-repo-057"></a>

### DD-REPO-057 — Authentication/network evidence

Authentication failure, remote absence, network failure and provider unavailability shall remain distinguishable where the provider can establish those categories.

<a id="dd-repo-058"></a>

### DD-REPO-058 — Fetch success is not Git-use-case success

Fetch evidence is interpreted under [Design](../appmanager-design-specification-v01.md#_11-11-workflow-results-failure-and-acceptance) for the caller's synchronization/inspection intent.


---

## 18. Pull / Integration Primitive

A provider may offer a `pull` operation, but its integration behavior can materially affect local history and worktree state. Therefore the capability contract shall not treat bare `pull` as policy-free.

<a id="dd-repo-059"></a>

### DD-REPO-059 — Integration strategy is explicit

Where a pull/integration primitive is used, the request shall supply or unambiguously identify the approved integration strategy required by the owning Git semantics, such as fast-forward-only, merge, rebase or another supported provider mode.

<a id="dd-repo-060"></a>

### DD-REPO-060 — No provider-default merge policy

Repository Capability shall not rely on an uncontrolled provider/user configuration default for a material integration-policy decision when the AppManager use case requires deterministic behavior.

<a id="dd-repo-061"></a>

### DD-REPO-061 — Local changes/conflict evidence

Conditions such as uncommitted changes, non-fast-forward divergence, merge/rebase conflicts or missing upstream shall be surfaced as structured repository evidence rather than silently resolved destructively.

<a id="dd-repo-062"></a>

### DD-REPO-062 — No silent conflict resolution

Repository Capability shall not auto-resolve merge conflicts, discard local changes or rewrite history unless a separately approved use case explicitly authorizes those effects.

<a id="dd-repo-063"></a>

### DD-REPO-063 — Integration may partially mutate

An integration attempt may leave repository state changed or conflicted before failing. The result shall preserve known resulting state/effects rather than imply rollback.

<a id="dd-repo-064"></a>

### DD-REPO-064 — Pull primitive is not multi-repository sync

Project-wide integration uses the [Git synchronization contract](../functional/git-functional-specification-v01.md#_10-synchronisation); this section defines only the supplied repository primitive.


---

## 19. Push Primitive

<a id="dd-repo-065"></a>

### DD-REPO-065 — Explicit push target

A push request shall identify the repository, selected remote and source/target ref relationship sufficiently to avoid relying on ambiguous provider defaults where those defaults affect meaning.

<a id="dd-repo-066"></a>

### DD-REPO-066 — No implicit force

Repository Capability shall never turn an ordinary push request into force/force-with-lease or equivalent history-rewriting behavior silently.

<a id="dd-repo-067"></a>

### DD-REPO-067 — Force behavior requires explicit higher-level semantics

If a later approved use case permits history-rewriting push, the bounded request shall carry that explicit authority and required preconditions. A generic `force` Boolean from a provider API is not sufficient architectural policy.

<a id="dd-repo-068"></a>

### DD-REPO-068 — Push result evidence

The result should expose, where available:

- remote/ref target;
- accepted/rejected ref updates;
- up-to-date/no-op state;
- non-fast-forward rejection;
- authentication/authorization failure;
- remote/provider failure;
- created/updated remote ref evidence;
- bounded provider diagnostics.

<a id="dd-repo-069"></a>

### DD-REPO-069 — Push is not deployment

Repository Capability shall not infer deployment, release or CI success from a successful push.

<a id="dd-repo-070"></a>

### DD-REPO-070 — Push success is repository evidence

Push evidence returns to the [Git push use case](../functional/git-functional-specification-v01.md#_9-push) for interpretation across its requested repositories/remotes.


---

## 20. Single-Repository Synchronization Primitive

The decomposition plan permits repository synchronization primitives, but application-level synchronization remains a Git-domain use case.

<a id="dd-repo-071"></a>

### DD-REPO-071 — Bounded synchronization primitive

A Repository Capability synchronization primitive, if provided, shall operate on exactly one supplied repository and shall require all material technical policy inputs needed for deterministic execution.

<a id="dd-repo-072"></a>

### DD-REPO-072 — No hidden project traversal

The primitive shall not scan for submodules, layers or neighbouring repositories and synchronize them merely because they are discoverable.

<a id="dd-repo-073"></a>

### DD-REPO-073 — Relationship update requires explicit inclusion

If a single-repository synchronization request includes provider-supported relationship updates such as submodule initialization/update, that behavior shall be explicit in the request rather than an unconditional hidden side effect.

<a id="dd-repo-074"></a>

### DD-REPO-074 — Domain synchronization remains above

The [Git domain scope and orchestration contracts](../dd_3_high_coupling_domains/dd-3-2-git-domain-detailed-design-v01.md#_7-domain-contract-model) supply synchronization coordination above this primitive.


---

## 21. Clone Primitive

<a id="dd-repo-075"></a>

### DD-REPO-075 — Explicit source and destination

Clone shall require an explicit remote/source repository identity and bounded destination supplied by the owning use case.

<a id="dd-repo-076"></a>

### DD-REPO-076 — Destination safety remains upstream plus technical validation

Repository Capability shall technically reject impossible/conflicting destinations, but managed-project ownership and safe creation authority remain higher-level concerns.

<a id="dd-repo-077"></a>

### DD-REPO-077 — Clone options are bounded

Branch/ref, depth and related clone options shall be explicit where material rather than taken from uncontrolled ambient defaults.

<a id="dd-repo-078"></a>

### DD-REPO-078 — Clone does not establish managed ownership

Clone results enter [Design](../appmanager-design-specification-v01.md#_9-6-project-discovery-and-context-resolution) as repository/resource evidence for any later topology decision.


---

## 22. Repository Relationships

Repository relationships include mechanisms such as Git submodules or equivalent provider-supported links between repositories.

<a id="dd-repo-079"></a>

### DD-REPO-079 — Relationship primitive consumes resolved identities

A relationship-add/update/remove request shall consume source/parent and related repository identities/paths already resolved by the owning Git/Managed Project semantics.

<a id="dd-repo-080"></a>

### DD-REPO-080 — Relationship mechanism is explicit

The request shall identify the supported relationship mechanism rather than assuming every managed repository relation is a Git submodule.

<a id="dd-repo-081"></a>

### DD-REPO-081 — Relationship eligibility remains upstream

Use the [Nuxt relationship contract](../dd_3_high_coupling_domains/dd-3-3-nuxt-domain-detailed-design-v01.md#_8-7-layer-integration) for layer intent; this capability receives an explicit repository relationship request.

<a id="dd-repo-082"></a>

### DD-REPO-082 — Existing relationship detection

The capability shall be able to distinguish newly created, already represented, conflicting and failed relationship states.

<a id="dd-repo-083"></a>

### DD-REPO-083 — Tracked-content conflict evidence

Where a relationship operation conflicts with existing tracked content or ownership, the capability shall expose the conflict rather than silently removing/replacing that content.

<a id="dd-repo-084"></a>

### DD-REPO-084 — Relationship effects are explicit

Repository relationship operations may modify repository metadata/configuration and working-tree resources. Known effects shall be represented through DD-1.2-compatible effect evidence where practical.

<a id="dd-repo-085"></a>

### DD-REPO-085 — Relationship does not equal Nuxt integration

Repository relationship evidence is interpreted under [FR-NUXT-017](../functional/nuxt-functional-specification-v01.md#fr-nuxt-017) when a Nuxt use case evaluates integration.


---

## 23. Remote-Host Capability Boundary

Some approved use cases require actions against a remote repository-hosting service rather than only a local Git repository.

Repository Capability may contain or delegate to a bounded remote-host sub-capability where needed.

### 23.1 Remote-host facts

Potential normalized facts include:

- hosting provider identity;
- owner/account/organization identity;
- remote repository identity;
- existence/availability;
- default branch or repository metadata required by an approved use case;
- authenticated principal evidence where safe and necessary;
- provider capability availability.

<a id="dd-repo-086"></a>

### DD-REPO-086 — Provider identity remains explicit

A remote-host request shall identify the intended provider/host and exact repository identity sufficiently to prevent guessed provider targets.

<a id="dd-repo-087"></a>

### DD-REPO-087 — Credentials remain provider-bounded

Remote authentication material follows [DD-REPO-119](#dd-repo-119) and [DD-1.2 redaction](../dd_1_application_core/dd-1-2-execution-outcomes-detailed-design-v01.md#_24-sensitive-information-and-redaction); expose only safe availability/authorization evidence.

<a id="dd-repo-088"></a>

### DD-REPO-088 — Provider APIs do not define application semantics

Remote HTTP/SDK result representations use [DD-1.2 normalization](../dd_1_application_core/dd-1-2-execution-outcomes-detailed-design-v01.md#_18-provider-result-normalization).

<a id="dd-repo-089"></a>

### DD-REPO-089 — Remote-host abstraction is not universal hosting platform

Version 1 need only expose the remote-host primitives required by approved AppManager use cases. This design does not mandate a generic abstraction covering every feature of GitHub, GitLab, Bitbucket or other hosts.

---

## 24. Remote Repository Creation / Provisioning

Where an approved App/Nuxt/Git use case requires remote repository creation, the capability may expose a bounded provisioning primitive.

<a id="dd-repo-090"></a>

### DD-REPO-090 — Exact owner/target identity

Provisioning shall consume an explicit provider owner/account/organization and repository identity rather than guessing a personal default.

<a id="dd-repo-091"></a>

### DD-REPO-091 — Provisioning options are supplied

Visibility, description, initialization and related provider settings shall come from the owning use case/effective configuration as explicit bounded inputs.

<a id="dd-repo-092"></a>

### DD-REPO-092 — Remote creation is distinct from local initialization

Remote-host repository creation, local Git initialization, remote registration and initial push are separate effects even when one application workflow coordinates them.

<a id="dd-repo-093"></a>

### DD-REPO-093 — Partial provisioning evidence

Record remote creation followed by local initialization/link/push failure through [DD-1.2 effects](../dd_1_application_core/dd-1-2-execution-outcomes-detailed-design-v01.md#_12-consequential-effects) and [partial completion](../dd_1_application_core/dd-1-2-execution-outcomes-detailed-design-v01.md#_14-partial-completion).


---

## 25. Remote Repository Deletion Primitive

Remote deletion is a provider primitive with exceptional consequences. Application authorization remains entirely above the capability.

<a id="dd-repo-094"></a>

### DD-REPO-094 — Exact remote identity required

Remote deletion applies the exact-target contract [DD-REPO-086](#dd-repo-086), including provider owner/account/organization identity.

<a id="dd-repo-095"></a>

### DD-REPO-095 — Authorization evidence is consumed, not invented

Repository Capability may require an authorization/approval token or execution permission supplied by the Engine/use case contract, but it shall not define the user-facing destructive confirmation policy itself.

<a id="dd-repo-096"></a>

### DD-REPO-096 — No inferred cascade

Deleting a remote repository shall not automatically delete local repositories, remotes, managed-project relationships or related repositories.

<a id="dd-repo-097"></a>

### DD-REPO-097 — Remote deletion result

The normalized result shall distinguish at least:

- deleted;
- target absent/already missing where safely distinguishable;
- refused/not authorized;
- authentication/authorization failure;
- provider unavailable/network failure;
- provider execution failure;
- indeterminate outcome where the provider response does not establish completion safely.

<a id="dd-repo-098"></a>

### DD-REPO-098 — Timeout/uncertainty does not imply not deleted

If network/provider failure occurs after a deletion request may have reached the provider, the capability shall preserve uncertainty rather than automatically reporting the repository as definitely retained.

---

## 26. Stale-State and Preconditions

Repository operations are highly susceptible to state changes between inspection and execution.

<a id="dd-repo-099"></a>

### DD-REPO-099 — Expected-state preconditions

Mutation/transfer requests shall support caller-supplied expected-state evidence where required, such as:

- expected current revision;
- expected branch/ref;
- expected remote identity;
- expected clean/change state;
- expected upstream relationship;
- expected relationship absence/presence;
- expected remote-host repository identity/state.

<a id="dd-repo-100"></a>

### DD-REPO-100 — Stale state is explicit

If observed state no longer satisfies a material precondition, Repository Capability shall return stale/conflict evidence rather than blindly applying the operation.

<a id="dd-repo-101"></a>

### DD-REPO-101 — Revalidation does not broaden authority

Technical revalidation may refresh repository facts, but it shall not independently broaden operation scope or choose a different target repository.

<a id="dd-repo-102"></a>

### DD-REPO-102 — Provider atomic checks preferred where available

Where provider primitives can enforce compare-and-set/lease-like expectations atomically, the capability should use them when required by the approved semantics rather than relying solely on an earlier non-atomic inspection.

---

## 27. Cancellation and Progress

Repository operations may be local, networked or delegated through Process Execution.

<a id="dd-repo-103"></a>

### DD-REPO-103 — Cancellation propagation

Propagate repository cancellation to supported providers/processes under [DD-1.2 cancellation](../dd_1_application_core/dd-1-2-execution-outcomes-detailed-design-v01.md#_17-cancellation-model).

<a id="dd-repo-104"></a>

### DD-REPO-104 — Cancellation is not rollback

Staging, commit, fetch, push, relationship and host effects follow [DD-1.2 cancellation](../dd_1_application_core/dd-1-2-execution-outcomes-detailed-design-v01.md#_17-cancellation-model) after completion.

<a id="dd-repo-105"></a>

### DD-REPO-105 — Cancellation uncertainty

Uncertain repository completion after cancellation uses [DD-1.2 effect evidence](../dd_1_application_core/dd-1-2-execution-outcomes-detailed-design-v01.md#_12-consequential-effects).

<a id="dd-repo-106"></a>

### DD-REPO-106 — Repository progress events

Long-running operations may emit normalized events such as:

- repository operation started;
- remote contacted;
- transfer progress;
- relationship update started/completed;
- repository mutation completed;
- warning/conflict observed;
- cancellation requested/observed;
- repository operation completed.

<a id="dd-repo-107"></a>

### DD-REPO-107 — Provider progress is not acceptance

Repository progress uses [DD-1.2 event semantics](../dd_1_application_core/dd-1-2-execution-outcomes-detailed-design-v01.md#_16-progress-events) rather than final acceptance.


---

## 28. Diagnostics and Failure Normalization

Repository Capability diagnostics shall be structured and DD-1.2-compatible.

Useful capability-level categories include:

- repository not recognized;
- repository unavailable/inaccessible;
- provider/tool unavailable;
- unsupported repository form;
- invalid/stale repository reference;
- branch/ref not found;
- detached state incompatible with request;
- upstream missing/ambiguous;
- remote missing/ambiguous;
- authentication failure;
- authorization failure;
- network/remote unavailable;
- merge/integration conflict;
- uncommitted-change conflict;
- non-fast-forward rejection;
- protected-branch/provider-policy rejection;
- staging failure;
- commit not created;
- commit failure;
- fetch/pull/push failure;
- relationship conflict;
- remote-host provider error;
- timeout/cancellation;
- indeterminate remote effect;
- unknown provider failure.

<a id="dd-repo-108"></a>

### DD-REPO-108 — Raw provider errors are subordinate

Repository errors use [DD-1.2 normalization](../dd_1_application_core/dd-1-2-execution-outcomes-detailed-design-v01.md#_18-provider-result-normalization) with bounded provider detail.

<a id="dd-repo-109"></a>

### DD-REPO-109 — Repository identity in diagnostics

Diagnostics shall identify the affected repository/reference/remote sufficiently to avoid root/layer/multi-repository ambiguity where applicable.

<a id="dd-repo-110"></a>

### DD-REPO-110 — Sensitive diagnostic minimization

Apply [DD-1.2 redaction](../dd_1_application_core/dd-1-2-execution-outcomes-detailed-design-v01.md#_24-sensitive-information-and-redaction) to repository credentials, private URLs, diffs and configuration evidence.


---

## 29. Retry, Fallback and Continuation

<a id="dd-repo-111"></a>

### DD-REPO-111 — No implicit consequential retry

Repository Capability shall not silently repeat commit, push, relationship, remote creation/deletion or other consequential operations merely because a provider error appears transient.

<a id="dd-repo-112"></a>

### DD-REPO-112 — Retryability is evidence

Classify safe repository transience/retryability evidence under [DD-1.2 retry evidence](../dd_1_application_core/dd-1-2-execution-outcomes-detailed-design-v01.md#_22-retryability-and-repetition-evidence).

<a id="dd-repo-113"></a>

### DD-REPO-113 — No implicit provider fallback

The capability shall not silently switch from one repository mechanism/provider to another if doing so changes semantics or credentials.

<a id="dd-repo-114"></a>

### DD-REPO-114 — No multi-repository continuation policy

Use the [Git continuation contract](../dd_3_high_coupling_domains/dd-3-2-git-domain-detailed-design-v01.md#_12-failure-cancellation-and-partial-effects) for all-repository failure handling.


---

## 30. Multi-Repository Boundary

Repository Capability primitives are repository-scoped. The capability may support efficient batch inspection, but it shall not acquire application-level multi-repository workflow authority.

<a id="dd-repo-115"></a>

### DD-REPO-115 — Per-repository evidence

A technical batch retains repository identity on each [DD-1.2 subordinate result](../dd_1_application_core/dd-1-2-execution-outcomes-detailed-design-v01.md#_14-partial-completion).

<a id="dd-repo-116"></a>

### DD-REPO-116 — No hidden scope expansion

Apply the bounded request in [DD-REPO-001](#dd-repo-001) and single-repository synchronization restriction [DD-REPO-072](#dd-repo-072) to discovered siblings.

<a id="dd-repo-117"></a>

### DD-REPO-117 — Multi-repository sequencing remains upstream

Repository ordering/dependencies/continuation are supplied by the [Git domain operation model](../dd_3_high_coupling_domains/dd-3-2-git-domain-detailed-design-v01.md#_7-domain-contract-model); the capability reports its bounded results.

<a id="dd-repo-118"></a>

### DD-REPO-118 — No false transactionality

Cross-repository guarantees use [DD-1.2 effects](../dd_1_application_core/dd-1-2-execution-outcomes-detailed-design-v01.md#_12-consequential-effects); this capability promises no transaction across repositories.


---

## 31. Security and Credential Boundaries

<a id="dd-repo-119"></a>

### DD-REPO-119 — Credentials are not repository facts

Authentication credentials may be consumed by a provider through approved configuration/credential mechanisms, but they shall not be exposed as ordinary repository metadata.

<a id="dd-repo-120"></a>

### DD-REPO-120 — Remote URLs may be sensitive

Remote endpoints containing embedded credentials or sensitive query data shall be sanitized before general logging/diagnostics.

<a id="dd-repo-121"></a>

### DD-REPO-121 — Environment/config credentials remain bounded

A CLI-based provider using DD-2.2 shall receive only the credential/environment context authorized for the operation.

<a id="dd-repo-122"></a>

### DD-REPO-122 — Provider credential helpers are implementation details

SSH agents, credential helpers, OS keychains and provider SDK auth mechanisms belong below the capability boundary unless their availability/status must be represented as normalized evidence.

<a id="dd-repo-123"></a>

### DD-REPO-123 — No destructive authority from credentials

Apply [Design](../appmanager-design-specification-v01.md#_6-2-application-engine-authority) when provider credentials technically permit deletion or history rewriting.


---

## 32. Relationship to DD-1.2 Outcomes

Repository Capability returns repository execution evidence; it does not directly determine the final application outcome.

A normalized repository result may contribute:

- technical status;
- repository identity;
- pre/post revision/state evidence;
- remote/provider identity;
- changed refs/staging/relationships;
- diagnostics and warnings;
- known consequential repository effects;
- cancellation/timeout evidence;
- provider availability evidence;
- uncertainty/indeterminate state.

<a id="dd-repo-124"></a>

### DD-REPO-124 — Repository result is capability evidence

Repository evidence composes [DD-1.2 status layers](../dd_1_application_core/dd-1-2-execution-outcomes-detailed-design-v01.md#_6-core-status-model) below Git/application interpretation.

<a id="dd-repo-125"></a>

### DD-REPO-125 — No Boolean collapse

Repository results shall not be reduced to a Boolean where branch/ref/status/conflict/remote/effect distinctions are needed for correct interpretation.

<a id="dd-repo-126"></a>

### DD-REPO-126 — Effects are precise

Known repository effects should identify what changed—such as created commit, updated remote ref, created relationship, fetched refs or deleted remote repository—without claiming unrelated application effects.

---

## 33. Git-Domain Integration

The Git-domain Detailed Design shall consume Repository Capability rather than duplicate provider mechanics.

The expected relationship is:

```text
Git application use case
    -> resolve managed repository scope
    -> evaluate policy / authorization / effective config
    -> inspect repository capability facts
    -> construct bounded repository operation(s)
    -> repository capability executes primitive(s)
    -> normalized repository evidence
    -> Git use-case interpretation / multi-repo aggregation
    -> Application Engine final acceptance
```

<a id="dd-repo-127"></a>

### DD-REPO-127 — Git domain owns use-case semantics

Git application intent, eligibility, policy and orchestration are defined by [DD-3.2](../dd_3_high_coupling_domains/dd-3-2-git-domain-detailed-design-v01.md#_7-domain-contract-model). This capability consumes its repository-specific requests.

<a id="dd-repo-128"></a>

### DD-REPO-128 — Repository Capability owns primitives

The bounded repository reference and primitive contracts in [§6 onward](#_6-repository-reference-contract) define the mechanics and facts supplied to Git consumers.


---

## 34. App and Nuxt Integration

### 34.1 App

Root-app creation or lifecycle workflows may request repository initialization or related follow-on behavior.

The App use case remains the owner of root-app creation/lifecycle semantics while delegating repository primitives through Git-domain or repository capability boundaries as appropriate.

### 34.2 Nuxt

Nuxt-layer creation may request local/remote repository setup and a repository relationship.

Nuxt owns layer creation and Nuxt integration. Git/Repository responsibilities own repository semantics.

<a id="dd-repo-129"></a>

### DD-REPO-129 — Nuxt relationship distinction

A composed repository/Nuxt operation retains each result under [FR-NUXT-017](../functional/nuxt-functional-specification-v01.md#fr-nuxt-017).


---

## 35. AI Integration

AI-assisted commit-message generation may consume bounded repository change evidence.

<a id="dd-repo-130"></a>

### DD-REPO-130 — Repository evidence is bounded before AI

The [bounded diff contract](#dd-repo-034) supplies change evidence to [AI Capability](dd-2-7-ai-capability-detailed-design-v01.md), whose context/request/output contracts govern AI execution.

<a id="dd-repo-131"></a>

### DD-REPO-131 — AI cannot invoke repository mutation by implication

AI-assisted repository proposals apply [Design](../appmanager-design-specification-v01.md#_11-10-ai-assisted-workflow) through the owning Git workflow.


---

## 36. Provider Model

### 36.1 Local repository providers

A local provider may be implemented using:

- a Git library;
- Git CLI through DD-2.2;
- another repository API;
- a combination of mechanisms behind one normalized capability contract.

### 36.2 Remote-host providers

Remote-host operations may use:

- provider REST/GraphQL APIs;
- an official SDK;
- a CLI through DD-2.2;
- another bounded provider.

<a id="dd-repo-132"></a>

### DD-REPO-132 — Provider selection does not change semantics

Repository providers conform to [Design](../appmanager-design-specification-v01.md#_6-6-capability-boundaries-and-providers) and the specific primitive guarantees here.

<a id="dd-repo-133"></a>

### DD-REPO-133 — Mixed providers remain coherent

If local Git operations use one provider and remote-host operations another, normalized identities/results shall preserve coherent correlation between the local remote reference and exact remote-host repository target.

<a id="dd-repo-134"></a>

### DD-REPO-134 — Provider limitations are explicit

Unsupported operations or weaker guarantees shall be reported rather than emulated with unsafe or semantically different behavior.

<a id="dd-repo-135"></a>

### DD-REPO-135 — No speculative cross-runtime protocol

Repository implementation topology follows the [Documentation Guide Level 4 boundary](../project-documentation-guide-v01.md#_8-level-4-implementation-specification); no separate process, RPC or language-neutral transport is required.


---

## 37. Current Implementation Reconciliation

This section is historical implementation evidence under the [Documentation Guide reading conventions](../project-documentation-guide-v01.md#detailed-design-reading-conventions), not permanent product authority.

The current implementation includes `app/services/githubService.ts`, based primarily on `simple-git` plus direct GitHub API access.

That code is implementation evidence, not normative architecture.

Useful existing concepts retained by this Detailed Design include:

- centralizing repository provider mechanics;
- repository initialization;
- normalized status acquisition;
- staging/commit mechanics;
- push mechanics;
- remote enumeration;
- staged diff retrieval;
- submodule-style relationship mechanics;
- clone support;
- remote-host API operations;
- timeout handling for remote API requests.

The following current/historical details are **not** promoted automatically into permanent architecture:

- one singleton `GithubService` class;
- naming a general repository capability after GitHub;
- `simple-git` as the permanent provider;
- `GitStatusResult`'s current limited shape (`branch`, `isDirty`, `modified`, `staged`, `ahead`, `behind`) as the canonical status model;
- `createCommit()` automatically staging supplied files before every commit;
- defaulting the staged file set to `['.']`;
- defaulting push remote to `origin` without higher-level remote-resolution semantics;
- `syncRepo()` always performing both `git pull` and recursive submodule update;
- terminal piping/logging as canonical progress semantics;
- reading `GITHUB_TOKEN` directly inside repository semantics as an approved configuration architecture;
- GitHub REST response JSON as an AppManager repository result;
- GitHub as the only possible remote host;
- direct exception strings as the canonical diagnostic model.

<a id="dd-repo-136"></a>

### DD-REPO-136 — Implementation migration follows approved contract

Reconcile concrete repository code under the [Documentation Guide implementation boundary](../project-documentation-guide-v01.md#_8-level-4-implementation-specification), without deriving architecture from incidental service shapes.


---

## 38. Testability

Repository Capability shall be testable independently of full Git-domain/application orchestration.

<a id="dd-repo-137"></a>

### DD-REPO-137 — Provider substitution

Tests shall be able to substitute local and remote repository providers sufficiently to validate normalization, preconditions, failure categories and effect evidence without relying on live GitHub or a developer's global Git configuration.

<a id="dd-repo-138"></a>

### DD-REPO-138 — Repository fixtures

Tests may use temporary repositories/fixtures for integration-level behavior, but unit-level contract tests shall not require network access or user credentials.

<a id="dd-repo-139"></a>

### DD-REPO-139 — Deterministic state scenarios

The contract shall support deterministic testing of at least:

- recognized and unrecognized repositories;
- nested/ambiguous repository evidence;
- clean, staged, unstaged and conflicted states;
- detached head;
- branch/upstream present and absent;
- ahead/behind/diverged evidence;
- multiple remotes;
- ambiguous remote selection rejection;
- staging bounded paths versus whole-repository scope;
- commit created versus no commit created;
- initialization into empty/non-repository/existing-repository targets;
- fetch success/failure;
- fast-forward and divergent integration states;
- merge/rebase conflict evidence;
- push success/up-to-date/non-fast-forward/auth failures;
- repository relationship create/existing/conflict;
- stale expected revision;
- remote-host authentication/network/provider failures;
- remote repository creation/deletion including indeterminate network outcomes;
- cancellation;
- sensitive-value redaction;
- provider-native error normalization.

<a id="dd-repo-140"></a>

### DD-REPO-140 — Use-case acceptance remains above

Capability tests verify repository facts/primitives. Tests for root/layer/all scope, continuation policy, destructive confirmation and final Git-domain success belong to the owning Git/Application Engine layers.

---

## 39. Conformance Invariants

Conformance follows the reference/recognition/status contracts, each named primitive's preconditions and effects, remote-target/security constraints, and the provider tests in §38. In particular, the staging, commit, fetch, integration, push, relationship and remote-host sections retain distinct effect guarantees; they are not interchangeable operations. This index introduces no repeated normative checklist.

## 40. Traceability

This Detailed Design realizes the DD-2 Repository Capability portion of the Version 1 architecture and supports Functional requirements including:

- `FR-GIT-001`–`FR-GIT-014` — authority, managed scope and provider-subordination boundaries;
- `FR-GIT-015`–`FR-GIT-020` — repository/configuration inspection and state distinctions;
- `FR-GIT-021`–`FR-GIT-026` — repository initialization;
- `FR-GIT-027`–`FR-GIT-039` — staging/commit evidence and AI boundary;
- `FR-GIT-040`–`FR-GIT-058` — repository push primitives beneath single/multi-repository Git use cases;
- `FR-GIT-059`–`FR-GIT-073` — synchronization primitives, conflict evidence and local-change preservation;
- `FR-GIT-074`–`FR-GIT-086` — repository relationship and layer-repository primitives;
- `FR-GIT-087`–`FR-GIT-095` — exact-target remote deletion primitive beneath strong application authorization;
- `FR-GIT-096`–`FR-GIT-110` — CI/CD boundary, failure safety, stale state and force semantics;
- `FR-GIT-111`–`FR-GIT-114` — machine-consumable repository evidence supporting interaction-mode equivalence;
- DD-1.3 — repository evidence/topology relationship to Managed Project;
- DD-1.5 — capability delegation and final application authority;
- DD-2.1 — bounded resource mechanics;
- DD-2.2 — bounded process execution/provider evidence;
- DD-2 guardrail ACG-003 — Repository Capability is not the Git domain or CI/CD engine.

---

## 41. Contract Consumers and Implementation Dependencies {#_41-downstream-detailed-design-requirements}

### 41.1 DD-2.4 Source Intelligence

A caller composing repository evidence with source analysis uses [DD-2.4's optional repository-context contract](dd-2-4-source-intelligence-detailed-design-v01.md#repository-context). Repository status/diffs remain this capability's evidence; source parsing and structural interpretation are supplied separately by DD-2.4. This is a permitted composition, not a mandatory dependency or an instruction for DD-2.3 to define source-analysis behavior.

### 41.2 DD-3 Git Domain Detailed Design

The [Git domain](../dd_3_high_coupling_domains/dd-3-2-git-domain-detailed-design-v01.md) composes these primitives into commit, push, synchronization, relationship and remote-deletion workflows over managed repository scope. Its plans supply operation-specific policy; its per-repository results support aggregate acceptance.

### 41.3 App/Nuxt Domain Detailed Designs

[App](../dd_3_high_coupling_domains/dd-3-1-app-domain-detailed-design-v01.md) and [Nuxt](../dd_3_high_coupling_domains/dd-3-3-nuxt-domain-detailed-design-v01.md) compose repository follow-ons through the Git/Repository seams described in their workflow contracts.

## 42. Final Design Position

The repository reference and state models lead into bounded primitives and normalized evidence. [DD-3.2](../dd_3_high_coupling_domains/dd-3-2-git-domain-detailed-design-v01.md) composes those primitives into Git workflows; the [testability section](#_38-testability) validates the capability's distinct local and remote guarantees.
