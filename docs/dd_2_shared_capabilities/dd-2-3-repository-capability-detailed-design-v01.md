# DD-2.3 — AppManager Repository Capability Detailed Design

> **Detailed Design ID:** DD-2.3
>
> **Design family:** DD-2 — Shared Capabilities

> **Status:** Version 1 Detailed Design Specification
>
> **Detailed Design authority:** This document defines the permanent shared contracts for bounded repository inspection and repository-state operations beneath AppManager application and Git-domain authority. It refines, but does not override, the root Design Specification, Functional Specifications, accepted ADRs, or the DD-1 Application Core Detailed Designs.
>
> **Governing sources:** [Project Documentation Guide](../project-documentation-guide-v01.md), [AppManager Design Specification](../appmanager-design-specification-v01.md), [Detailed Design Register](../project_management/detailed-design-register-v01.md), [ADR-0001 — Primary Application Runtime](../project_management/decisions/adr-0001-primary-application-runtime.md)
>
> **Related Detailed Design authorities:** [DD-1.1 — Application Invocation](../dd_1_application_core/dd-1-1-application-invocation-detailed-design-v01.md), [DD-1.2 — Execution Outcomes](../dd_1_application_core/dd-1-2-execution-outcomes-detailed-design-v01.md), [DD-1.3 — Managed Project](../dd_1_application_core/dd-1-3-managed-project-detailed-design-v01.md), [DD-1.4 — Configuration Resolution](../dd_1_application_core/dd-1-4-configuration-resolution-detailed-design-v01.md), [Application Core Bootstrap Resolution](../dd_1_application_core/dd-1-5-application-engine-detailed-design-v01.md#_8-orchestration-lifecycle), [DD-1.5 — Application Engine](../dd_1_application_core/dd-1-5-application-engine-detailed-design-v01.md), [DD-2.1 — Resource Access](dd-2-1-resource-access-detailed-design-v01.md), [DD-2.2 — Process Execution](dd-2-2-process-execution-detailed-design-v01.md)
>
> **Primary Functional authorities:** [docs/functional/git-functional-specification-v01.md](../functional/git-functional-specification-v01.md), [docs/functional/managed-project-functional-specification-v01.md](../functional/managed-project-functional-specification-v01.md), [docs/functional/application-invocation-functional-specification-v01.md](../functional/application-invocation-functional-specification-v01.md), [docs/functional/configuration-functional-specification-v01.md](../functional/configuration-functional-specification-v01.md)
>
> **Related domain Functional authorities:** App and Nuxt where their workflows delegate repository initialization or repository relationship work; AI where commit-message assistance consumes bounded repository evidence; Quality/Docs only where they inspect repository facts without acquiring repository workflow authority.

---

## 1. Purpose

This specification defines the permanent internal contracts, responsibilities, state distinctions, safety boundaries and evidence model by which AppManager performs bounded repository operations on behalf of authoritative application use cases.

The governing rule is:

> **Repository capability supplies repository facts and executes bounded repository primitives; it does not own Git-domain application intent, repository scope policy, or final application acceptance.**

A second rule follows:

> **Repository recognition establishes repository evidence, not authority to mutate, synchronise, push, commit, relate, initialise or delete that repository.**

A third rule is:

> **Repository-provider completion is execution evidence. The owning Git/application use case determines whether the requested repository intent was satisfied.**

The Repository Capability therefore sits between AppManager application/domain semantics and concrete repository providers such as Git tooling, libraries, local repository APIs, and remote-host providers.

---

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

The Repository Capability exists so multiple AppManager use cases can consume coherent repository mechanics without duplicating provider handling.

It shall not become an alternate application layer containing its own multi-repository menus, root/layer scope defaults, deployment workflows, commit-message approval policy or destructive confirmation rules.

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

### DD-REPO-002 — Reference is not authority

Possession of a repository reference does not itself establish application authorization to mutate the repository.

### DD-REPO-003 — No ambient-CWD authority

Provider APIs may require a working directory, but the host process's current working directory shall not implicitly select the application repository.

### DD-REPO-004 — Stable identity over incidental path

Where the managed model has a stable repository identity distinct from its local path, the capability shall preserve that distinction. Moving or checking out a repository at another path shall not silently redefine managed identity.

---

## 7. Repository Recognition

Repository recognition is a read-only evidence-producing responsibility.

### DD-REPO-005 — Recognition result

Recognition shall be capable of distinguishing at least:

- recognized supported repository;
- no repository recognized;
- ambiguous/nested repository state;
- inaccessible repository evidence;
- unsupported repository form;
- provider unavailable;
- indeterminate/error state.

### DD-REPO-006 — Recognition does not mutate

Recognition shall not initialize, repair, fetch, clean, reset, stage, commit or otherwise mutate repository state in order to make recognition succeed.

### DD-REPO-007 — Recognition does not assign managed ownership

A recognized repository remains evidence for Managed Project and use-case logic. Recognition alone shall not assign the repository to the managed project or operation scope.

### DD-REPO-008 — Nested repository evidence

Where nested or overlapping repositories are technically observable, recognition should preserve enough evidence for higher-level topology resolution rather than silently selecting the nearest or outermost repository as universal truth.

### DD-REPO-009 — Provider-specific markers remain below boundary

`.git` directories/files, provider metadata, worktree administration paths and library-native recognition objects are implementation evidence; the general contract exposes repository facts rather than requiring callers to understand those markers.

---

## 8. Repository Identity and Revision Evidence

### DD-REPO-010 — Repository identity facts

Where available, normalized identity evidence may include:

- local repository root/reference;
- current revision identity;
- current branch or detached-head state;
- repository format/support status;
- configured remotes;
- remote-host identity derived from configured remote information where safely and unambiguously recognized;
- worktree/common-repository relationships where materially relevant.

### DD-REPO-011 — Revision identities are evidence

Commit/object/revision identifiers are repository facts. They do not independently establish AppManager project identity or application correctness.

### DD-REPO-012 — Detached state is explicit

Detached-head or equivalent non-branch states shall be represented distinctly from a normal named branch where that distinction affects later operations.

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

### DD-REPO-014 — Status is multidimensional

Repository status shall not be collapsed into a single `isDirty` Boolean when callers require staged, unstaged, conflict, upstream or divergence distinctions.

### DD-REPO-015 — Clean is not synchronized

A clean worktree does not imply that the repository is synchronized with a remote or that it is eligible to push/pull.

### DD-REPO-016 — Ahead/behind are contextual facts

Ahead/behind evidence is meaningful only relative to a resolved comparison/upstream ref. The capability shall not present such counts without preserving the applicable reference context where needed.

### DD-REPO-017 — Status acquisition does not authorize mutation

Reading status shall not create implicit authority to stage, reset, pull, push or resolve conflicts.

---

## 10. Repository Configuration Facts

### DD-REPO-018 — Bounded configuration inspection

Repository Capability may expose repository configuration facts required by approved use cases, including branch tracking, remotes, user identity or provider settings where applicable.

### DD-REPO-019 — Sensitive configuration minimization

Credentials, credential-helper outputs, embedded tokens, authorization headers and equivalent sensitive values shall not be unnecessarily exposed through normalized configuration results.

### DD-REPO-020 — Git configuration is not AppManager configuration

Repository-native configuration may be evidence/input to Git-domain behavior, but it is distinct from DD-1.4 AppManager effective configuration and shall not create a competing AppManager configuration-precedence model.

### DD-REPO-021 — Configuration source/provenance

Where provider configuration scope matters, the capability should preserve enough provenance to distinguish facts such as local repository configuration from broader provider/user/system configuration without requiring callers to parse native config files.

---

## 11. Branches, Refs and Tracking

### DD-REPO-022 — Branch/ref facts

The capability shall expose normalized branch/ref facts required by approved use cases without requiring callers to consume provider-native ref objects.

### DD-REPO-023 — Local and remote refs remain distinct

Local branch identity, remote-tracking refs and remote branch targets shall not be conflated.

### DD-REPO-024 — Upstream relation is explicit

A branch may have no upstream, one resolved upstream, or an ambiguous/invalid tracking state. Those states shall remain distinguishable.

### DD-REPO-025 — Ref mutation requires explicit request

Creating, renaming, switching or deleting branches/refs shall occur only through an explicit bounded request from an owning use case/capability.

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

### DD-REPO-027 — Multiple remotes are first-class

The capability shall not assume `origin` is the only meaningful remote.

### DD-REPO-028 — Remote selection is supplied

When an operation requires a particular remote, the owning use case shall resolve or supply the intended remote under its application semantics. Repository Capability shall not silently choose among ambiguous remotes.

### DD-REPO-029 — Remote URL is not authorization

Possessing or recognizing a remote URL does not authorize network access, push or remote-host mutation.

### DD-REPO-030 — Fetch and push endpoints may differ

The contract shall preserve separate fetch/push endpoint facts where the repository provider supports them.

### DD-REPO-031 — Remote identity parsing is bounded

Host/provider/repository identity may be normalized from a remote reference where unambiguous, but ambiguous/custom transport syntax shall remain ambiguous rather than guessed.

---

## 13. Change and Diff Evidence

Repository Capability shall expose bounded change evidence for commit planning, AI assistance, preview, diagnostics and other approved consumers.

### DD-REPO-032 — Change domains remain distinguishable

The contract shall be able to distinguish, where relevant:

- worktree versus index/staged changes;
- index versus committed revision changes;
- revision versus revision changes;
- repository versus upstream/remote changes.

### DD-REPO-033 — Diff output is evidence

A textual patch may be one representation of change evidence, but general callers shall not be required to infer all semantics from provider-formatted patch text where structured facts are available.

### DD-REPO-034 — Large diff bounding

Diff/change retrieval shall support bounding, summarization metadata or truncation evidence where required to avoid unbounded memory/context use.

### DD-REPO-035 — Sensitive diff handling

Repository diffs may contain secrets or private source. Consumers such as AI capability shall receive only the bounded context authorized by the owning use case and applicable sensitive-information policy.

### DD-REPO-036 — Diff retrieval does not stage

Reading a diff or change set shall not alter staging state.

---

## 14. Staging and Index Primitives

Staging is a repository mutation primitive whose application semantics remain with the Git use case.

### DD-REPO-037 — Explicit staging target

A staging request shall identify the bounded change/resource set intended for staging or explicitly indicate the approved whole-repository scope.

### DD-REPO-038 — No hidden stage-all

Repository Capability shall not silently expand a selected staging request to the entire repository merely because the provider exposes a convenient `add .` operation.

### DD-REPO-039 — Staging preconditions

Where a caller supplies expected status/revision evidence, the capability shall validate that evidence before applying staging changes or report stale-state conflict.

### DD-REPO-040 — Staging result

The normalized result shall identify the technical staging outcome and sufficient resulting status/change evidence for the caller to determine whether the requested staging intent was satisfied.

### DD-REPO-041 — Unstaging/reset distinction

Removing changes from the index without discarding worktree content shall remain distinguishable from destructive reset/discard operations.

### DD-REPO-042 — Destructive reset is not generic staging

Repository Capability shall not expose a vague reset primitive whose semantics can silently discard local work. Any destructive ref/index/worktree reset requires an explicitly specified higher-level use case and bounded technical contract.

---

## 15. Commit Primitive

### DD-REPO-043 — Bounded commit request

A commit request shall identify the target repository and the already-resolved commit message plus any explicit repository-provider options required by the approved use case.

### DD-REPO-044 — Commit-message authority remains upstream

Repository Capability does not decide whether a commit message is acceptable, whether AI should generate it, or whether a human must approve it.

### DD-REPO-045 — Staging behavior is explicit

Commit creation shall not implicitly stage additional changes unless the bounded commit request explicitly includes an already-approved staging behavior.

### DD-REPO-046 — Commit identity evidence

On successful technical commit creation, the capability should return normalized evidence of the created revision/commit identity and resulting repository state where available.

### DD-REPO-047 — No commit created is distinct

Provider behavior indicating that no commit was created, including no eligible staged changes, shall remain distinguishable from successful new commit creation.

### DD-REPO-048 — Hook/provider effects

Repository hooks or provider extensions may affect commit execution. Their raw output remains provider evidence; any resulting failure or state change shall be normalized without assuming the provider's message is the AppManager final outcome.

---

## 16. Repository Initialization

### DD-REPO-049 — Explicit initialization target

Initialization shall target an explicit bounded repository location/reference supplied by an authorized caller.

### DD-REPO-050 — Existing repository detection

If a repository already exists at or governs the target, the capability shall report that fact and shall not silently reinitialize/replace identity unless a separately specified repair/migration use case explicitly requests it.

### DD-REPO-051 — Initialization options are supplied

Default branch, repository-local identity or similar initialization inputs shall come from explicit request/effective configuration semantics above the capability.

### DD-REPO-052 — Initialization does not imply remote creation

Creating a local repository does not create a remote-host repository, add a remote, push history or establish a managed-project relationship unless separately requested and authorized.

### DD-REPO-053 — Initialization evidence

The result shall distinguish newly initialized, already existing, unsupported, failed and indeterminate states and return safe repository identity/state evidence where available.

---

## 17. Fetch Primitive

Fetch updates local remote-tracking/object state from an explicitly selected remote/reference context.

### DD-REPO-054 — Explicit fetch source

A fetch request shall identify the intended remote and any branch/refspec/depth constraints required by the owning semantics.

### DD-REPO-055 — Fetch is not integration

A successful fetch does not imply that the current branch/worktree was updated or that the repository is synchronized.

### DD-REPO-056 — Fetch effects are repository effects

Fetch may alter local repository object/ref state even when the worktree is unchanged. The capability shall not misrepresent it as a pure read operation.

### DD-REPO-057 — Authentication/network evidence

Authentication failure, remote absence, network failure and provider unavailability shall remain distinguishable where the provider can establish those categories.

### DD-REPO-058 — Fetch success is not Git-use-case success

The owning use case decides whether fetched state satisfies a larger synchronization or inspection intent.

---

## 18. Pull / Integration Primitive

A provider may offer a `pull` operation, but its integration behavior can materially affect local history and worktree state. Therefore the capability contract shall not treat bare `pull` as policy-free.

### DD-REPO-059 — Integration strategy is explicit

Where a pull/integration primitive is used, the request shall supply or unambiguously identify the approved integration strategy required by the owning Git semantics, such as fast-forward-only, merge, rebase or another supported provider mode.

### DD-REPO-060 — No provider-default merge policy

Repository Capability shall not rely on an uncontrolled provider/user configuration default for a material integration-policy decision when the AppManager use case requires deterministic behavior.

### DD-REPO-061 — Local changes/conflict evidence

Conditions such as uncommitted changes, non-fast-forward divergence, merge/rebase conflicts or missing upstream shall be surfaced as structured repository evidence rather than silently resolved destructively.

### DD-REPO-062 — No silent conflict resolution

Repository Capability shall not auto-resolve merge conflicts, discard local changes or rewrite history unless a separately approved use case explicitly authorizes those effects.

### DD-REPO-063 — Integration may partially mutate

An integration attempt may leave repository state changed or conflicted before failing. The result shall preserve known resulting state/effects rather than imply rollback.

### DD-REPO-064 — Pull primitive is not multi-repository sync

A single-repository pull/integration primitive does not own project-wide synchronization sequencing, scope selection, continuation policy or partial-success aggregation.

---

## 19. Push Primitive

### DD-REPO-065 — Explicit push target

A push request shall identify the repository, selected remote and source/target ref relationship sufficiently to avoid relying on ambiguous provider defaults where those defaults affect meaning.

### DD-REPO-066 — No implicit force

Repository Capability shall never turn an ordinary push request into force/force-with-lease or equivalent history-rewriting behavior silently.

### DD-REPO-067 — Force behavior requires explicit higher-level semantics

If a later approved use case permits history-rewriting push, the bounded request shall carry that explicit authority and required preconditions. A generic `force` Boolean from a provider API is not sufficient architectural policy.

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

### DD-REPO-069 — Push is not deployment

Repository Capability shall not infer deployment, release or CI success from a successful push.

### DD-REPO-070 — Push success is repository evidence

The owning Git/application use case determines whether the requested push intent is fully satisfied, especially when multiple remotes or repositories are involved.

---

## 20. Single-Repository Synchronization Primitive

The decomposition plan permits repository synchronization primitives, but application-level synchronization remains a Git-domain use case.

### DD-REPO-071 — Bounded synchronization primitive

A Repository Capability synchronization primitive, if provided, shall operate on exactly one supplied repository and shall require all material technical policy inputs needed for deterministic execution.

### DD-REPO-072 — No hidden project traversal

The primitive shall not scan for submodules, layers or neighbouring repositories and synchronize them merely because they are discoverable.

### DD-REPO-073 — Relationship update requires explicit inclusion

If a single-repository synchronization request includes provider-supported relationship updates such as submodule initialization/update, that behavior shall be explicit in the request rather than an unconditional hidden side effect.

### DD-REPO-074 — Domain synchronization remains above

Root-only, selected-repository, selected-set and all-managed-repositories synchronization scope, sequencing, continuation policy, warnings and partial-success aggregation remain owned by the Git use case/Application Engine.

---

## 21. Clone Primitive

### DD-REPO-075 — Explicit source and destination

Clone shall require an explicit remote/source repository identity and bounded destination supplied by the owning use case.

### DD-REPO-076 — Destination safety remains upstream plus technical validation

Repository Capability shall technically reject impossible/conflicting destinations, but managed-project ownership and safe creation authority remain higher-level concerns.

### DD-REPO-077 — Clone options are bounded

Branch/ref, depth and related clone options shall be explicit where material rather than taken from uncontrolled ambient defaults.

### DD-REPO-078 — Clone does not establish managed ownership

Successful clone produces repository/resource evidence. It does not automatically add the repository to Managed Project topology or authorize follow-on mutation.

---

## 22. Repository Relationships

Repository relationships include mechanisms such as Git submodules or equivalent provider-supported links between repositories.

### DD-REPO-079 — Relationship primitive consumes resolved identities

A relationship-add/update/remove request shall consume source/parent and related repository identities/paths already resolved by the owning Git/Managed Project semantics.

### DD-REPO-080 — Relationship mechanism is explicit

The request shall identify the supported relationship mechanism rather than assuming every managed repository relation is a Git submodule.

### DD-REPO-081 — Relationship eligibility remains upstream

Repository Capability does not decide that a Nuxt layer should become an independent repository or submodule. It executes the bounded repository relationship operation selected by the owning use case.

### DD-REPO-082 — Existing relationship detection

The capability shall be able to distinguish newly created, already represented, conflicting and failed relationship states.

### DD-REPO-083 — Tracked-content conflict evidence

Where a relationship operation conflicts with existing tracked content or ownership, the capability shall expose the conflict rather than silently removing/replacing that content.

### DD-REPO-084 — Relationship effects are explicit

Repository relationship operations may modify repository metadata/configuration and working-tree resources. Known effects shall be represented through DD-1.2-compatible effect evidence where practical.

### DD-REPO-085 — Relationship does not equal Nuxt integration

Creating a repository relationship does not establish Nuxt layer registration or application-layer integration unless a separate Nuxt/application use case performs those semantics.

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

### DD-REPO-086 — Provider identity remains explicit

A remote-host request shall identify the intended provider/host and exact repository identity sufficiently to prevent guessed provider targets.

### DD-REPO-087 — Credentials remain provider-bounded

Authentication material shall remain below the application-facing repository contract except for safe availability/authorization evidence. Raw tokens/headers shall not be exposed through normal results.

### DD-REPO-088 — Provider APIs do not define application semantics

HTTP status codes, SDK objects, GitHub-specific repository JSON or provider exception classes shall be normalized before reaching application interpretation.

### DD-REPO-089 — Remote-host abstraction is not universal hosting platform

Version 1 need only expose the remote-host primitives required by approved AppManager use cases. This design does not mandate a generic abstraction covering every feature of GitHub, GitLab, Bitbucket or other hosts.

---

## 24. Remote Repository Creation / Provisioning

Where an approved App/Nuxt/Git use case requires remote repository creation, the capability may expose a bounded provisioning primitive.

### DD-REPO-090 — Exact owner/target identity

Provisioning shall consume an explicit provider owner/account/organization and repository identity rather than guessing a personal default.

### DD-REPO-091 — Provisioning options are supplied

Visibility, description, initialization and related provider settings shall come from the owning use case/effective configuration as explicit bounded inputs.

### DD-REPO-092 — Remote creation is distinct from local initialization

Remote-host repository creation, local Git initialization, remote registration and initial push are separate effects even when one application workflow coordinates them.

### DD-REPO-093 — Partial provisioning evidence

If a composed higher-level workflow creates a remote repository but fails to initialize/link/push locally, the remote creation remains a completed effect and shall not be hidden.

---

## 25. Remote Repository Deletion Primitive

Remote deletion is a provider primitive with exceptional consequences. Application authorization remains entirely above the capability.

### DD-REPO-094 — Exact remote identity required

The primitive shall require exact provider owner/account/organization and repository identity.

### DD-REPO-095 — Authorization evidence is consumed, not invented

Repository Capability may require an authorization/approval token or execution permission supplied by the Engine/use case contract, but it shall not define the user-facing destructive confirmation policy itself.

### DD-REPO-096 — No inferred cascade

Deleting a remote repository shall not automatically delete local repositories, remotes, managed-project relationships or related repositories.

### DD-REPO-097 — Remote deletion result

The normalized result shall distinguish at least:

- deleted;
- target absent/already missing where safely distinguishable;
- refused/not authorized;
- authentication/authorization failure;
- provider unavailable/network failure;
- provider execution failure;
- indeterminate outcome where the provider response does not establish completion safely.

### DD-REPO-098 — Timeout/uncertainty does not imply not deleted

If network/provider failure occurs after a deletion request may have reached the provider, the capability shall preserve uncertainty rather than automatically reporting the repository as definitely retained.

---

## 26. Stale-State and Preconditions

Repository operations are highly susceptible to state changes between inspection and execution.

### DD-REPO-099 — Expected-state preconditions

Mutation/transfer requests shall support caller-supplied expected-state evidence where required, such as:

- expected current revision;
- expected branch/ref;
- expected remote identity;
- expected clean/change state;
- expected upstream relationship;
- expected relationship absence/presence;
- expected remote-host repository identity/state.

### DD-REPO-100 — Stale state is explicit

If observed state no longer satisfies a material precondition, Repository Capability shall return stale/conflict evidence rather than blindly applying the operation.

### DD-REPO-101 — Revalidation does not broaden authority

Technical revalidation may refresh repository facts, but it shall not independently broaden operation scope or choose a different target repository.

### DD-REPO-102 — Provider atomic checks preferred where available

Where provider primitives can enforce compare-and-set/lease-like expectations atomically, the capability should use them when required by the approved semantics rather than relying solely on an earlier non-atomic inspection.

---

## 27. Cancellation and Progress

Repository operations may be local, networked or delegated through Process Execution.

### DD-REPO-103 — Cancellation propagation

Where supported, Repository Capability shall consume DD-1 cancellation intent and propagate it to active providers/processes according to their capabilities.

### DD-REPO-104 — Cancellation is not rollback

Cancellation does not imply reversal of completed staging, commits, fetch updates, pushes, relationship changes or remote-host effects.

### DD-REPO-105 — Cancellation uncertainty

If a provider operation's completion cannot be determined after cancellation, the result shall preserve that uncertainty rather than guessing.

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

### DD-REPO-107 — Provider progress is not acceptance

Progress events or provider completion notifications do not establish final AppManager success.

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

### DD-REPO-108 — Raw provider errors are subordinate

Provider-native errors may be retained as bounded diagnostic detail but shall not be the only machine-readable representation.

### DD-REPO-109 — Repository identity in diagnostics

Diagnostics shall identify the affected repository/reference/remote sufficiently to avoid root/layer/multi-repository ambiguity where applicable.

### DD-REPO-110 — Sensitive diagnostic minimization

Credentials, embedded tokens, private URLs and sensitive diff/config content shall be minimized or redacted while retaining useful repository-level meaning.

---

## 29. Retry, Fallback and Continuation

### DD-REPO-111 — No implicit consequential retry

Repository Capability shall not silently repeat commit, push, relationship, remote creation/deletion or other consequential operations merely because a provider error appears transient.

### DD-REPO-112 — Retryability is evidence

Provider normalization may classify evidence as transient/retryable where safely known, but the owning use case determines whether another attempt is permitted.

### DD-REPO-113 — No implicit provider fallback

The capability shall not silently switch from one repository mechanism/provider to another if doing so changes semantics or credentials.

### DD-REPO-114 — No multi-repository continuation policy

Whether an all-repositories operation continues after one repository fails belongs to the Git use case/Application Engine, not Repository Capability.

---

## 30. Multi-Repository Boundary

Repository Capability primitives are repository-scoped. The capability may support efficient batch inspection, but it shall not acquire application-level multi-repository workflow authority.

### DD-REPO-115 — Per-repository evidence

If a batch capability is used for technical efficiency, each repository's evidence/status/diagnostics shall remain independently attributable.

### DD-REPO-116 — No hidden scope expansion

A request for one repository shall never expand to root + layers or other discovered repositories automatically.

### DD-REPO-117 — Multi-repository sequencing remains upstream

Ordering, parallelism, stop/continue policy, dependency ordering, partial-success aggregation and warnings about cross-repository drift remain with the owning use case/Engine.

### DD-REPO-118 — No false transactionality

Repository Capability shall not imply transactional atomicity across repositories unless a later explicit design actually provides and verifies it.

---

## 31. Security and Credential Boundaries

### DD-REPO-119 — Credentials are not repository facts

Authentication credentials may be consumed by a provider through approved configuration/credential mechanisms, but they shall not be exposed as ordinary repository metadata.

### DD-REPO-120 — Remote URLs may be sensitive

Remote endpoints containing embedded credentials or sensitive query data shall be sanitized before general logging/diagnostics.

### DD-REPO-121 — Environment/config credentials remain bounded

A CLI-based provider using DD-2.2 shall receive only the credential/environment context authorized for the operation.

### DD-REPO-122 — Provider credential helpers are implementation details

SSH agents, credential helpers, OS keychains and provider SDK auth mechanisms belong below the capability boundary unless their availability/status must be represented as normalized evidence.

### DD-REPO-123 — No destructive authority from credentials

Possession of credentials capable of deleting or force-updating a remote repository does not itself authorize AppManager to perform those effects.

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

### DD-REPO-124 — Repository result is capability evidence

A repository-provider/capability result shall remain distinguishable from the final Git-domain/AppManager outcome.

### DD-REPO-125 — No Boolean collapse

Repository results shall not be reduced to a Boolean where branch/ref/status/conflict/remote/effect distinctions are needed for correct interpretation.

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

### DD-REPO-127 — Git domain owns use-case semantics

The Git domain remains responsible for:

- root/selected/set/all scope;
- repository eligibility;
- commit workflow policy;
- remote selection policy;
- synchronization workflow semantics;
- multi-repository sequencing;
- continuation policy;
- destructive-operation authorization;
- user-facing result interpretation.

### DD-REPO-128 — Repository Capability owns primitives

Repository Capability owns reusable repository mechanics and normalized repository facts/results needed by those use cases.

---

## 34. App and Nuxt Integration

### 34.1 App

Root-app creation or lifecycle workflows may request repository initialization or related follow-on behavior.

The App use case remains the owner of root-app creation/lifecycle semantics while delegating repository primitives through Git-domain or repository capability boundaries as appropriate.

### 34.2 Nuxt

Nuxt-layer creation may request local/remote repository setup and a repository relationship.

Nuxt owns layer creation and Nuxt integration. Git/Repository responsibilities own repository semantics.

### DD-REPO-129 — Nuxt relationship distinction

A Nuxt layer relationship and a repository relationship shall remain distinct even when created in the same composed workflow.

---

## 35. AI Integration

AI-assisted commit-message generation may consume bounded repository change evidence.

### DD-REPO-130 — Repository evidence is bounded before AI

Repository Capability supplies requested diff/change evidence; the AI capability/use case determines context minimization, prompt construction, provider selection and output validation.

### DD-REPO-131 — AI cannot invoke repository mutation by implication

An AI-generated commit message or repository recommendation does not authorize staging, commit, push or other mutation. The owning Git use case must explicitly proceed under application policy.

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

### DD-REPO-132 — Provider selection does not change semantics

The provider chosen for an operation shall not silently redefine repository semantics promised by the capability contract.

### DD-REPO-133 — Mixed providers remain coherent

If local Git operations use one provider and remote-host operations another, normalized identities/results shall preserve coherent correlation between the local remote reference and exact remote-host repository target.

### DD-REPO-134 — Provider limitations are explicit

Unsupported operations or weaker guarantees shall be reported rather than emulated with unsafe or semantically different behavior.

### DD-REPO-135 — No speculative cross-runtime protocol

Provider neutrality does not require a separate process, RPC protocol or language-neutral transport in Version 1.

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

### DD-REPO-136 — Implementation migration follows approved contract

Future Implementation Specifications shall reconcile current code with this Detailed Design rather than preserving accidental service boundaries or method semantics as architecture.

---

## 38. Testability

Repository Capability shall be testable independently of full Git-domain/application orchestration.

### DD-REPO-137 — Provider substitution

Tests shall be able to substitute local and remote repository providers sufficiently to validate normalization, preconditions, failure categories and effect evidence without relying on live GitHub or a developer's global Git configuration.

### DD-REPO-138 — Repository fixtures

Tests may use temporary repositories/fixtures for integration-level behavior, but unit-level contract tests shall not require network access or user credentials.

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

### DD-REPO-140 — Use-case acceptance remains above

Capability tests verify repository facts/primitives. Tests for root/layer/all scope, continuation policy, destructive confirmation and final Git-domain success belong to the owning Git/Application Engine layers.

---

## 39. Conformance Invariants

Every conforming Repository Capability implementation shall preserve these invariants:

1. repository recognition is evidence, not mutation authority;
2. Managed Project remains authoritative for managed repository topology;
3. operation repository scope is supplied by the owning use case, not inferred from provider discovery;
4. Repository Capability is not the Git domain;
5. Repository Capability is not a CI/CD engine;
6. repository-provider success is not final AppManager success;
7. provider-native Git/SDK/process objects remain below the capability boundary;
8. local repository state is represented with enough dimensions to avoid unsafe Boolean collapse;
9. current working directory is not repository application authority;
10. multiple remotes remain first-class and ambiguous remote selection is not silently guessed;
11. staging scope is explicit and shall not silently become stage-all;
12. commit-message approval and AI assistance remain above the repository primitive;
13. initialization does not imply remote creation/push/relationship creation;
14. fetch does not imply integration;
15. pull/integration strategy shall not depend on an uncontrolled provider default when material;
16. conflicts/local changes are not silently discarded;
17. ordinary push never silently becomes force push;
18. push is not deployment;
19. single-repository synchronization does not own multi-repository workflow scope;
20. repository relationship mechanics do not define Nuxt/project relationship semantics;
21. remote-host operations require exact provider/target identity;
22. credentials do not grant destructive application authority;
23. cancellation/retry do not imply rollback of completed repository/remote effects;
24. stale-state preconditions are explicit where correctness requires them;
25. multi-repository sequencing/continuation/aggregation remain above the capability;
26. normalized repository evidence remains distinct from final application outcomes;
27. the capability boundary does not require one class, package, Git library, CLI, remote host or runtime topology.

---

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

The Git-domain design shall consume this capability and define:

- application-level Git use cases;
- repository-scope resolution over Managed Project topology;
- commit workflow semantics;
- push/synchronization workflows;
- multi-repository sequencing and aggregation;
- repository-relationship use cases;
- destructive remote-deletion authorization;
- application acceptance criteria.

It shall not reintroduce provider-native repository objects as application contracts.

### 41.3 App/Nuxt Domain Detailed Designs

App/Nuxt designs shall delegate repository concerns rather than embedding independent Git provider logic.

---

## 42. Final Design Position

Repository Capability is the shared technical-semantic boundary for bounded repository facts and repository primitives in AppManager Version 1.

Its permanent responsibility is to answer questions such as:

- what repository state exists at a supplied repository reference;
- what branches, refs, remotes, upstreams and revisions are observed;
- what staged/unstaged/conflicted changes are present;
- what bounded repository primitive was attempted;
- what local or remote repository effect technically occurred;
- what provider/authentication/network/conflict/stale-state evidence resulted.

It does **not** answer the application-level questions:

- which managed repositories should this invocation operate on;
- whether AppManager should stage all changes;
- whether a commit message should be accepted;
- whether a repository should be synchronized, pushed or force-updated;
- whether execution should continue to another repository after failure;
- whether remote deletion is authorized;
- whether a Git operation makes the overall AppManager invocation successful.

Those remain responsibilities of Managed Project, the Git/application use case and the Application Engine under DD-1.

The central boundary is therefore:

> **Repository Capability owns bounded repository facts and primitives; Git-domain and AppManager application authority remain above it.**
