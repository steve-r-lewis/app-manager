# IS-6 — Repository Capability Implementation Specification

> **Document type:** Level 4 Implementation Specification
>
> **Status:** Version 1 implementation baseline
>
> **Implementation ID:** IS-6
>
> **Primary Detailed Design:** [DD-2.3 — Repository Capability](../dd_2_shared_capabilities/dd-2-3-repository-capability-detailed-design-v01.md)
>
> **Related Detailed Designs:** [DD-2.1 — Resource Access](../dd_2_shared_capabilities/dd-2-1-resource-access-detailed-design-v01.md), [DD-2.2 — Process Execution](../dd_2_shared_capabilities/dd-2-2-process-execution-detailed-design-v01.md), [DD-1.3 — Managed Project](../dd_1_application_core/dd-1-3-managed-project-detailed-design-v01.md), [DD-1.5 — Application Engine](../dd_1_application_core/dd-1-5-application-engine-detailed-design-v01.md)
>
> **Runtime decision:** [ADR-0001 — Primary Application Runtime](../project_management/decisions/adr-0001-primary-application-runtime.md)
>
> **Register:** [AppManager Implementation Specification](implementation-specification-v01.md)
>
> **Governing plan:** [Implementation Specification Plan](../project_management/implementation-specification-plan-v01.md)

## 1. Purpose

IS-6 defines the concrete Node.js/TypeScript implementation of the Version 1 Repository Capability.

Its job is to expose normalized repository facts and execute already-authorized, repository-scoped primitives without acquiring Git-domain workflow, managed-project scope, destructive-operation policy or final application acceptance.

The governing implementation rule is:

> **Repository Capability owns bounded repository facts and primitives; the Git domain, Managed Project and Application Engine own repository intent, scope, policy and acceptance.**

The Version 1 implementation uses Git CLI execution through IS-5 as the primary local Git provider and a bounded GitHub REST adapter where an approved operation genuinely requires remote-host semantics. It does not expose raw Git command output, GitHub JSON, process results or provider exceptions as the general AppManager repository contract.

---

## 2. Scope and Non-Ownership

IS-6 owns concrete implementation for:

- explicit local and remote repository references;
- read-only repository recognition;
- normalized identity, revision, branch/ref, upstream, remote and configuration facts;
- multidimensional worktree/index/conflict/divergence status;
- bounded change/diff evidence;
- explicit stage and unstage primitives;
- commit creation from an already-approved message and already-approved staging state/behaviour;
- repository initialization;
- remote add/update/remove where requested;
- fetch;
- explicit-strategy pull/integration;
- push without implicit force;
- optional single-repository synchronization with all material policy supplied;
- clone;
- explicit repository relationships such as Git submodules;
- GitHub remote-host facts and bounded remote create/delete operations where required;
- stale-state preconditions and post-operation evidence;
- cancellation/progress propagation to underlying providers;
- normalized repository failures, effects and uncertainty;
- provider substitution and repository-fixture integration tests.

IS-6 does **not** own:

- `git.*` application command identity or dispatch;
- root/selected/set/all managed-repository scope;
- discovery-to-managed-project ownership decisions;
- commit workflow, AI message generation or human approval;
- remote-selection policy where more than one valid remote exists;
- multi-repository push/synchronization sequencing or continuation;
- destructive-operation confirmation/authorization;
- package/layer/Nuxt repository eligibility;
- force-push policy;
- automatic merge/rebase/conflict resolution;
- CI/CD, deployment or release semantics;
- AppManager configuration precedence;
- final DD-1.2/DD-1.5 outcome acceptance.

Repository recognition, local filesystem accessibility, configured credentials and provider capability are evidence only. None independently grants mutation authority.

---

## 3. Concrete Module Boundary

The target Version 1 layout is:

```text
app/
└── capabilities/
    └── repository/
        ├── repository-capability.ts
        ├── repository-types.ts
        ├── repository-errors.ts
        ├── repository-preconditions.ts
        ├── repository-normalizer.ts
        └── providers/
            ├── local-git-provider.ts
            └── github-remote-provider.ts
```

`repository-capability.ts` exposes AppManager-owned repository contracts. General consumers never receive `simple-git` objects, Git CLI process results, GitHub REST response objects or provider-native exceptions.

### 3.1 Public capability shape

The capability shall expose operation-specific methods rather than one stringly typed `executeGit()` escape hatch. The contract is structurally equivalent to:

```ts
export interface RepositoryCapability {
  recognize(request: RepositoryRecognitionRequest): Promise<RepositoryResult<RepositoryRecognition>>;
  inspect(request: RepositoryInspectRequest): Promise<RepositoryResult<RepositorySnapshot>>;
  readChanges(request: RepositoryChangeRequest): Promise<RepositoryResult<RepositoryChangeEvidence>>;
  stage(request: RepositoryStageRequest): Promise<RepositoryResult<RepositoryMutationEvidence>>;
  unstage(request: RepositoryUnstageRequest): Promise<RepositoryResult<RepositoryMutationEvidence>>;
  commit(request: RepositoryCommitRequest): Promise<RepositoryResult<RepositoryCommitEvidence>>;
  initialize(request: RepositoryInitializeRequest): Promise<RepositoryResult<RepositoryInitializationEvidence>>;
  fetch(request: RepositoryFetchRequest): Promise<RepositoryResult<RepositoryTransferEvidence>>;
  integrate(request: RepositoryIntegrateRequest): Promise<RepositoryResult<RepositoryIntegrationEvidence>>;
  push(request: RepositoryPushRequest): Promise<RepositoryResult<RepositoryPushEvidence>>;
  clone(request: RepositoryCloneRequest): Promise<RepositoryResult<RepositoryCloneEvidence>>;
  changeRemote(request: RepositoryRemoteMutationRequest): Promise<RepositoryResult<RepositoryMutationEvidence>>;
  changeRelationship(request: RepositoryRelationshipRequest): Promise<RepositoryResult<RepositoryRelationshipEvidence>>;
  remoteHost(request: RemoteHostRequest): Promise<RepositoryResult<RemoteHostEvidence>>;
}
```

A single-repository `synchronize()` helper may exist only if it remains a deterministic composition of explicit repository primitives with all integration/relationship inputs supplied. It shall not discover neighbouring repositories or encode Git-domain continuation/scope policy.

### 3.2 Provider contracts

Two internal provider responsibilities are used in Version 1:

- `LocalGitProvider` — local Git repository facts/primitives, implemented through IS-5 Process Execution;
- `RemoteRepositoryHostProvider` — remote-host facts/primitives, initially implemented for GitHub REST where required.

The public capability coordinates normalization and preconditions. Providers perform only their bounded technical operations.

Provider selection is explicit by repository/provider reference. There is no runtime plugin marketplace or speculative provider registry.

---

## 4. Version 1 Provider Decision

### 4.1 Local Git provider

Version 1 shall use the installed Git CLI through IS-5 rather than promote `simple-git` to a permanent architectural dependency.

This decision provides:

- one already-specified external-process boundary for executable availability, cwd, environment, cancellation, timeout and output capture;
- explicit argument vectors without shell interpolation;
- access to Git porcelain/plumbing output needed for precise repository semantics;
- removal of `simple-git` object/error shapes from the target boundary;
- deterministic control over Git options that materially affect semantics.

The provider constructs **direct** IS-5 requests with executable `git` and ordered arguments. It shall not construct shell command strings for ordinary Git operations.

Git executable identity is injected/resolved configuration. The provider does not search for substitute Git implementations when unavailable.

### 4.2 Machine-readable Git output

Where Git offers stable machine-oriented forms, the provider shall prefer them over human presentation output. Examples include:

- porcelain status with NUL-delimited paths where required;
- `for-each-ref`/explicit formatting for refs;
- explicit `rev-parse`/`merge-base` queries;
- `git config --null` or similarly bounded parseable output;
- `diff --numstat`/name-status plus patch output as appropriate;
- explicit push/fetch options rather than parsing terminal decoration.

The provider sets locale/environment where necessary for deterministic parsing, but shall not override credential/configuration context beyond the bounded request.

Human-oriented Git prose is retained only as subordinate diagnostic detail when no stable structured form exists. Machine semantics shall not depend on localized error sentences when an exit/status/ref query can establish the state directly.

### 4.3 GitHub remote-host provider

GitHub-specific remote-host operations use a narrow REST adapter built on Node's `fetch`/`AbortSignal` support. The adapter owns request transport and GitHub response parsing only.

Authentication material is injected as provider credentials/configuration by the composition/owning boundary. The adapter shall not read `GITHUB_TOKEN` directly from `process.env`.

The remote provider returns AppManager-owned host evidence and stable failures; raw GitHub repository JSON remains internal.

IS-6 does not create a generic forge abstraction beyond the operations actually required by approved Version 1 use cases. The provider seam is sufficient to prevent GitHub from becoming the general repository model.

---

## 5. Repository References

Local operations require an explicit reference:

```ts
export interface LocalRepositoryRef {
  readonly kind: 'local_git';
  readonly path: string;
  readonly managedRepositoryId?: string;
}
```

`path` is an already-resolved absolute repository/worktree location supplied by Managed Project or another authorized caller. Relative paths are rejected at this boundary rather than interpreted against ambient `process.cwd()`.

`managedRepositoryId`, when present, is correlation evidence supplied from DD-1.3. IS-6 never derives it from directory names or remote URLs.

Remote-host operations use an exact provider reference:

```ts
export interface RemoteRepositoryRef {
  readonly kind: 'remote_host';
  readonly provider: 'github';
  readonly owner: string;
  readonly repository: string;
}
```

A configured local remote URL and a remote-host identity are distinct facts until the provider can normalize the mapping unambiguously.

Possessing either reference does not authorize mutation.

---

## 6. Recognition and Repository Identity

`recognize()` is read-only. It shall never initialize, repair, fetch, reset or otherwise mutate to make a repository recognizable.

Recognition returns one of:

```ts
type RepositoryRecognitionState =
  | 'recognized'
  | 'not_recognized'
  | 'ambiguous'
  | 'inaccessible'
  | 'unsupported'
  | 'provider_unavailable'
  | 'indeterminate';
```

Recognition evidence may include repository root/worktree, common Git directory relationship, bare/worktree form, nested/containing repository evidence and current revision when safely obtainable.

The provider shall use Git's own repository queries rather than treating `.git` filesystem-marker existence alone as canonical recognition. Resource Access may assist with bounded path evidence, but `.git` directories/files/worktree administration remain provider details.

Nested/overlapping evidence is returned for higher-level topology interpretation; IS-6 does not silently choose nearest/outermost as managed ownership.

---

## 7. Repository Snapshot and Status Model

`inspect()` returns a normalized `RepositorySnapshot` containing only requested fact groups so callers can avoid unnecessary provider work and sensitive data exposure.

The snapshot supports:

- repository recognition/identity;
- current revision;
- branch state: named branch or detached HEAD;
- local refs and requested remote-tracking refs;
- upstream state: absent, resolved or invalid/ambiguous;
- remotes with distinct fetch/push endpoints;
- worktree/index status;
- conflicts/unmerged paths;
- untracked paths and ignored paths when requested;
- ahead/behind counts tied to the exact comparison refs;
- repository operation-in-progress evidence where safely detectable;
- shallow-history evidence;
- requested repository configuration facts with scope/provenance.

### 7.1 Change-state representation

Status is not represented by `isDirty` alone. At minimum:

```ts
interface RepositoryPathChange {
  readonly path: string;
  readonly originalPath?: string;
  readonly index: RepositoryChangeKind;
  readonly worktree: RepositoryChangeKind;
  readonly conflict?: RepositoryConflictKind;
}
```

A derived `clean` convenience field may exist, but structured changes remain authoritative.

Ahead/behind values include the comparison/upstream ref identities. A clean worktree does not imply synchronized state.

### 7.2 Configuration facts

Repository-native configuration is queried only for fields requested by an approved consumer. Results preserve scope/provenance where material (`local`, `worktree`, `global`, `system`, `command`/provider-derived where available).

Credentials, credential-helper output and sensitive URL material are excluded/redacted. Git configuration never becomes DD-1.4 AppManager configuration precedence.

---

## 8. Remote Model

A normalized remote record is:

```ts
interface RepositoryRemote {
  readonly name: string;
  readonly fetchEndpoints: readonly SanitizedRepositoryEndpoint[];
  readonly pushEndpoints: readonly SanitizedRepositoryEndpoint[];
  readonly hostIdentity?: RemoteRepositoryRef;
}
```

Multiple remotes are first-class. IS-6 never silently selects `origin` when a mutation/transfer request needs an exact remote.

Endpoint normalization supports common Git URL forms only where unambiguous, including HTTPS, SSH URI and SCP-like SSH syntax. Unknown/custom transports remain opaque/sanitized rather than guessed.

Embedded userinfo/tokens, sensitive query components and credentials are stripped from general evidence and diagnostics.

Remote mutation is explicit: add, set fetch URL, set push URL or remove. It does not imply network contact, push, managed-project topology change or remote-host provisioning.

---

## 9. Change and Diff Evidence

`readChanges()` requires an explicit comparison mode:

```ts
type RepositoryChangeBasis =
  | { kind: 'worktree_to_index' }
  | { kind: 'index_to_head' }
  | { kind: 'revision_to_revision'; from: string; to: string }
  | { kind: 'revision_to_upstream'; revision: string; upstream: string };
```

The result contains structured path/change summaries and optionally a textual patch when requested.

Patch capture is bounded by explicit/effective byte limits and records truncation. A truncated patch remains evidence and is never presented as complete content.

Diff retrieval is read-only and shall not stage changes. Sensitive source content is not copied into generic diagnostics/logs. Consumers such as IS-10 receive only the change evidence requested/authorized by their owning use case.

---

## 10. Preconditions and State Tokens

Mutation/transfer requests may carry:

```ts
interface RepositoryPreconditions {
  readonly expectedRevision?: string;
  readonly expectedBranch?: string | null;
  readonly expectedClean?: boolean;
  readonly expectedUpstream?: string | null;
  readonly expectedRemote?: { name: string; endpointIdentity?: string };
  readonly expectedRelationship?: 'present' | 'absent';
}
```

Before a consequential local operation, the capability re-reads only the facts required to validate supplied preconditions at the latest safe point. Mismatch returns `stale_state`; it does not refresh scope or choose a new target.

Where Git provides an atomic expectation mechanism, IS-6 uses it in addition to preflight checks. For example, a future explicitly authorized force-with-lease operation would require an expected remote ref value and Git's lease mechanism; a generic `force: true` flag is insufficient.

Repository revision identity is a strong repository state fact but not a complete worktree/index version token. Where staging/worktree state matters, the request must include the relevant expected status/change evidence rather than assuming unchanged `HEAD` proves unchanged working state.

---

## 11. Staging and Unstaging

Staging scope is explicit:

```ts
type RepositoryStageSelection =
  | { kind: 'paths'; paths: readonly string[] }
  | { kind: 'all' };
```

The provider uses Git pathspec separation (`--`) and safe literal/pathspec handling appropriate to the selected semantics. An empty path list is invalid and never converted to stage-all.

`kind: 'all'` is legal only because the caller has explicitly selected whole-repository staging. IS-6 does not decide when that is appropriate.

The result includes pre/post index/worktree evidence sufficient to establish the technical staging effect.

Unstaging removes selected changes from the index without discarding worktree content. IS-6 shall use a non-destructive index operation appropriate to repository state and shall not expose a vague `reset()` method that could discard local work.

Destructive worktree/ref reset is outside the initial IS-6 public surface unless a later approved Git-domain requirement specifies its exact semantics and authorization.

---

## 12. Commit Creation

A commit request contains:

```ts
interface RepositoryCommitRequest {
  readonly repository: LocalRepositoryRef;
  readonly message: string;
  readonly preconditions?: RepositoryPreconditions;
  readonly signal?: AbortSignal;
  readonly correlation?: RepositoryCorrelation;
}
```

The message is already resolved and approved by the owning Git use case. IS-6 does not invoke AI or prompt a user.

Commit creation does **not** stage additional files implicitly. Staging is a separate primitive. If a future owning workflow wants stage-and-commit, it composes explicit stage then commit operations and retains the partial-effect semantics if commit fails.

The result distinguishes:

- `created` with new commit/revision identity;
- `not_created` when no eligible staged change produced a commit;
- `failed`/`indeterminate` with resulting repository evidence.

Hooks may run and mutate/fail. After the Git process settles, IS-6 re-inspects revision/status as required so effect evidence is based on repository state rather than Git prose alone.

No `--no-verify` or equivalent hook bypass is introduced unless explicitly authorized by a later higher-level contract.

---

## 13. Repository Initialization

Initialization requires an explicit absolute target and supplied options such as initial branch where material.

Before `git init`, IS-6 performs recognition sufficient to distinguish an existing governing repository from a new target. It does not silently reinitialize an existing repository.

The provider invokes deterministic Git options rather than relying on user/global defaults for material semantics such as initial branch when the caller supplied a value.

Repository-local user identity may be configured only when explicitly supplied as part of the bounded initialization request. It is a separate repository configuration effect.

Initialization returns `initialized`, `already_exists`, `unsupported`, `failed` or `indeterminate` evidence. It does not create a GitHub repository, add a remote, push, register Managed Project topology or create a submodule.

---

## 14. Fetch and Integration

### 14.1 Fetch

Fetch requires an exact remote name and explicit refspec/depth/prune constraints where material. It is a mutation of local repository object/ref state even when the worktree is unchanged.

The result includes contacted remote, requested refs/options, pre/post relevant refs and normalized authentication/network/provider evidence.

Fetch never implies integration.

### 14.2 Integration

Integration requires an explicit strategy:

```ts
type RepositoryIntegrationStrategy =
  | { kind: 'fast_forward_only' }
  | { kind: 'merge'; noEdit?: boolean }
  | { kind: 'rebase' };
```

The provider maps the strategy to explicit Git options. It shall not issue a bare `git pull` whose behavior depends on uncontrolled user configuration when integration semantics matter.

The request identifies exact remote/upstream/ref context. Missing upstream, dirty-state conflicts, divergence and merge/rebase conflicts are normalized.

IS-6 never auto-resolves conflicts, discards local work or silently changes strategy. Because integration may partially mutate before failure, post-operation status/revision/in-progress evidence is returned and rollback is not implied.

---

## 15. Push

Push requires exact remote and source/target ref semantics:

```ts
interface RepositoryPushRequest {
  readonly repository: LocalRepositoryRef;
  readonly remote: string;
  readonly sourceRef: string;
  readonly targetRef: string;
  readonly mode: 'normal';
  readonly preconditions?: RepositoryPreconditions;
  readonly signal?: AbortSignal;
}
```

The initial Version 1 public contract exposes ordinary push only. It never adds `--force` or `--force-with-lease` implicitly.

If the approved Git-domain implementation later requires history-rewriting push, IS-6 shall add a separately discriminated request variant requiring explicit higher-level authority plus expected remote-ref/lease evidence.

The result distinguishes accepted updates, up-to-date/no-op, non-fast-forward rejection, authentication/authorization failure, provider policy/protected-branch rejection, remote absence and indeterminate transfer state where knowable.

A successful push is repository evidence only. It does not mean deployment, CI, release or overall AppManager success.

---

## 16. Single-Repository Synchronization

IS-6 need not expose a broad `syncRepo()` method for initial implementation. Git-domain synchronization can compose `inspect`, `fetch` and `integrate` while retaining policy authority.

If profiling or repeated downstream code demonstrates value in a repository-scoped helper, its request must include:

- one exact repository;
- exact remote/upstream;
- explicit integration strategy;
- whether relationship/submodule update is included;
- required preconditions;
- cancellation/correlation.

It must not scan layers/submodules/neighbours to define scope, choose continuation policy or silently bundle recursive relationship updates.

The legacy `syncRepo()` shape is therefore not retained as the target public semantic contract.

---

## 17. Clone

Clone requires explicit source and absolute destination plus bounded branch/ref/depth options.

Destination ownership/scope is resolved above IS-6. IS-6 performs technical validation sufficient to reject conflicting/impossible destinations and then delegates bounded Git execution.

The result reports whether a repository was created at the destination, its recognized identity/revision where available, and failure/uncertainty evidence.

Clone does not register the repository in Managed Project, create Nuxt integration or authorize follow-on mutations.

---

## 18. Repository Relationships

The initial supported relationship mechanism is explicit Git submodule semantics:

```ts
interface GitSubmoduleRelationshipRequest {
  readonly mechanism: 'git_submodule';
  readonly parent: LocalRepositoryRef;
  readonly source: string;
  readonly path: string;
  readonly branch?: string;
  readonly operation: 'add' | 'update' | 'remove';
  readonly preconditions?: RepositoryPreconditions;
}
```

The owning Git/Managed Project/Nuxt semantics resolve source identity, destination path and eligibility before this request exists.

IS-6 validates existing relationship/tracked-content conflict evidence and returns `created`, `updated`, `removed`, `already_present`, `conflict`, `failed` or `indeterminate` as applicable.

Known effects include Git metadata/index changes and relationship-resource changes. IS-6 does not claim that a submodule relationship establishes a Nuxt layer relationship.

Removal must not silently delete unrelated working content. Exact remove semantics require the approved request and post-state validation.

---

## 19. Remote-Host Operations

### 19.1 Credentials and provider construction

The GitHub adapter receives an injected credential source/value scoped to the approved operation. Raw credentials never appear in `RemoteRepositoryRef`, general repository facts or logs.

The adapter uses explicit request timeout/cancellation and safe headers. It does not rely on a hard-coded private timeout as application policy; effective technical defaults may be supplied through resolved IS-6 configuration.

### 19.2 Remote facts/listing

Where an approved use case requires GitHub repository facts/listing, raw REST objects are normalized to the minimal AppManager record required by that use case: exact owner/name identity, availability, visibility/default-branch/URL metadata only where needed and safe.

Pagination is handled explicitly. The legacy single-page `listRemoteRepos()` behavior is not sufficient for a complete listing contract.

### 19.3 Remote creation

Remote creation requires exact owner/account/organization, repository name and explicit provider options such as visibility/description/initialization where material.

Creating the remote is one effect. Local init, remote registration and initial push remain separate primitives coordinated above IS-6.

### 19.4 Remote deletion

Remote deletion requires exact GitHub owner/repository plus an authorization capability/token supplied by the owning Engine/use-case contract. IS-6 validates presence/shape of that execution permission but does not define the user-facing confirmation policy.

The result distinguishes deleted, absent, refused/not-authorized, authentication/authorization failure, provider/network failure and indeterminate outcome.

A timeout/network failure after request transmission may be indeterminate. IS-6 shall not report “not deleted” unless provider evidence establishes that state.

No local repository, remote configuration or Managed Project relationship is cascaded automatically.

---

## 20. Result, Failure and Effect Model

All public operations return:

```ts
export type RepositoryResult<T> =
  | { readonly ok: true; readonly value: T; readonly evidence: RepositoryExecutionEvidence }
  | { readonly ok: false; readonly failure: RepositoryFailure; readonly evidence: RepositoryExecutionEvidence };
```

A successful capability result means the bounded repository primitive/fact request completed sufficiently to return normalized evidence. It is not the final AppManager outcome.

Stable failure codes include:

```ts
type RepositoryFailureCode =
  | 'invalid_reference'
  | 'repository_not_recognized'
  | 'repository_inaccessible'
  | 'provider_unavailable'
  | 'unsupported_repository'
  | 'unsupported_operation'
  | 'stale_state'
  | 'ref_not_found'
  | 'detached_head'
  | 'upstream_missing'
  | 'upstream_ambiguous'
  | 'remote_missing'
  | 'remote_ambiguous'
  | 'authentication_failure'
  | 'authorization_failure'
  | 'network_failure'
  | 'local_change_conflict'
  | 'integration_conflict'
  | 'non_fast_forward'
  | 'provider_policy_rejection'
  | 'staging_failure'
  | 'commit_not_created'
  | 'commit_failure'
  | 'transfer_failure'
  | 'relationship_conflict'
  | 'remote_host_failure'
  | 'cancelled'
  | 'timeout'
  | 'indeterminate_effect'
  | 'provider_failure';
```

Provider-native process/HTTP/Git details may be attached as safe subordinate diagnostics, never the only machine-readable meaning.

Known effects are explicit, for example:

- index updated;
- commit created with revision identity;
- repository initialized;
- fetched refs updated;
- integration changed revision/worktree/index;
- remote ref created/updated;
- local remote configuration changed;
- relationship created/updated/removed;
- local clone created;
- remote-host repository created/deleted.

Effects carry `known`/`uncertain` state where provider completion is not safely established. Cancellation, timeout and failure never imply rollback.

---

## 21. Cancellation, Progress and Retry

Local Git operations pass the caller's `AbortSignal`, timeout and correlation into IS-5. Repository evidence then distinguishes process cancellation/timeout from repository-level interpretation.

Remote HTTP operations use the same cancellation intent through an `AbortController` composition that preserves caller cancellation and any approved technical timeout.

Progress events are normalized repository events such as operation started, remote contacted, transfer progress, mutation completed, conflict observed and operation completed. Raw Git terminal output is not the canonical progress contract.

IS-6 performs no implicit consequential retry of commit, push, integration, relationship changes or remote create/delete. Retryability may be evidence; retry authority remains upstream.

Provider fallback is not automatic. A failed Git CLI operation is not silently retried through `simple-git` or another mechanism.

---

## 22. Security and Sensitive Information

Remote URLs are sanitized before general diagnostics. HTTPS userinfo, embedded tokens and sensitive query values are removed. SSH keys/tokens/credential-helper results are never repository facts.

Git CLI execution receives only the environment/credential context approved for the operation through IS-5. IS-6 shall not copy the complete host environment merely to obtain credentials when the owning configuration supplies a bounded mode.

Diffs, commit messages, repository paths and remote identities may themselves be sensitive. Structured diagnostics use correlation/opaque repository IDs where appropriate and avoid reproducing full content.

Possession of credentials capable of force-pushing or deleting a repository does not authorize those operations.

---

## 23. Configuration and Dependency Wiring

IS-6 consumes resolved technical configuration; it does not read AppManager settings or environment variables directly.

An initial configuration may include:

```ts
interface RepositoryCapabilityConfig {
  readonly gitExecutable: string;
  readonly defaultDiffMaxBytes: number;
  readonly remoteRequestTimeoutMs: number;
}
```

Credential material is injected through a bounded credential/provider construction mechanism rather than stored in ordinary configuration snapshots when that would expose secrets unnecessarily.

IS-23's composition root constructs:

```text
ProcessExecution (IS-5)
        |
        v
LocalGitProvider
        |
        +-------------------+
        |                   |
GitHubRemoteProvider   RepositoryNormalizer / Preconditions
        |                   |
        +---------+---------+
                  v
       DefaultRepositoryCapability
                  |
                  v
       approved IS-14+ / capability consumers
```

No module-level `githubService` singleton or service locator is part of the target architecture.

---

## 24. Relationship to Git Domain and Other Consumers

IS-14? No. The Git domain is the separately registered Git-domain Implementation Specification identified by the Implementation Specification register; IS-6 shall consume its eventual concrete contract without assuming legacy command-file numbering or shapes.

The Git-domain implementation owns:

- root/selected/set/all repository scope;
- repository eligibility;
- commit workflow and stage-all approval;
- AI/manual message approval;
- remote selection policy;
- push/sync multi-repository sequencing;
- continuation and partial-success policy;
- destructive remote-delete authorization;
- application interpretation.

Managed Project supplies canonical managed repository topology/identity. IS-6 recognition may contribute evidence during resolution but does not replace that authority.

App and Nuxt workflows may delegate initialization/relationship primitives while retaining root-app/layer semantics. AI may consume bounded change evidence but cannot imply mutation authority. Quality/Docs may consume repository facts without becoming Git workflows.

---

## 25. Testing and Conformance

Vitest remains the Version 1 runner.

### 25.1 Provider-independent tests

Deterministic fake local/remote providers shall cover:

1. explicit repository references and rejection of ambient/relative target authority;
2. recognition without mutation;
3. nested/ambiguous recognition evidence;
4. clean, staged, unstaged, untracked, renamed and conflicted states;
5. detached HEAD;
6. upstream absent/resolved/invalid;
7. ahead/behind tied to exact refs;
8. multiple remotes and no implicit `origin` selection;
9. fetch/push endpoint distinction and URL sanitization;
10. bounded structured/text diff evidence and truncation;
11. explicit path staging versus explicit stage-all;
12. unstaging without worktree discard;
13. commit without implicit staging;
14. commit created versus no commit created;
15. initialization new versus existing repository;
16. fetch without integration;
17. explicit fast-forward/merge/rebase strategy mapping;
18. integration conflict and partial-effect evidence;
19. ordinary push without force and non-fast-forward rejection;
20. clone evidence without managed ownership;
21. relationship create/existing/conflict/remove safety;
22. stale revision/status/upstream/remote preconditions;
23. cancellation/timeout without rollback claims;
24. no implicit retry/provider fallback;
25. GitHub remote exact-target create/delete and indeterminate delete;
26. sensitive credentials/diffs/URLs excluded from diagnostics;
27. provider-native errors normalized;
28. per-repository correlation remains independent under concurrent calls.

### 25.2 Real Git integration tests

Integration tests use temporary repositories created under test-controlled directories and the configured Git executable. They shall not depend on the developer's repository or global Git identity.

Fixtures set required local Git config explicitly and test:

- recognition of ordinary, bare/worktree and nested forms where supported;
- porcelain status parsing including paths containing spaces/special characters;
- branch/detached state;
- remotes and upstreams;
- stage/unstage;
- commit creation/no-op;
- local bare repository as fetch/push remote to avoid network dependency;
- fast-forward and divergent histories;
- merge/rebase conflict evidence;
- clone;
- submodule relationship behavior where platform/Git support permits;
- stale precondition races using controlled repository changes.

No live GitHub credential/network access is required by the ordinary test suite. The GitHub adapter uses mocked HTTP responses for pagination, authentication, policy, timeout and indeterminate-effect scenarios. Optional external contract tests, if ever added, are separately gated.

### 25.3 Acceptance remains above

IS-6 tests do not decide whether a Git-domain workflow should operate on one/all repositories, whether stage-all was acceptable, whether a commit message was approved or whether a sequence should continue after failure.

---

## 26. Legacy Implementation Disposition

The current `GithubService`, related types and Git command consumers mix useful provider mechanics with application/domain policy. Disposition is therefore responsibility-specific.

| Current artefact / responsibility | Disposition | Target owner/location | Preserved value | Required change |
|---|---|---|---|---|
| `app/services/githubService.ts` central repository mechanics | RETAIN / SPLIT / ADAPT | IS-6 providers/capability | useful centralization and operation coverage | split local Git from remote-host transport; normalize behind AppManager contracts |
| `simple-git` use for local Git | REPLACE as target provider | IS-6 `LocalGitProvider` via IS-5 | proves required Git operations | use explicit Git CLI/IS-5 boundary; do not expose library semantics |
| `initRepo()` | RETAIN / ADAPT | IS-6 initialize | explicit cwd/default branch/local identity concepts | existing-repository detection, supplied semantics, normalized evidence; no logging authority |
| `cloneRepo()` | RETAIN / ADAPT | IS-6 clone | source/destination/branch/depth | absolute bounded destination, normalized effects/failures, no managed ownership |
| `getStatus()` | RETAIN / REPLACE model | IS-6 inspect | branch/change/divergence need | replace limited `isDirty` model with multidimensional status/upstream/conflict/ref evidence |
| `createCommit(cwd,message,files=['.'])` | SPLIT / REPLACE | IS-6 stage + commit; Git-domain workflow above | stage and commit primitives are valid | no default stage-all; no implicit staging in commit; commit message authority upstream |
| `push(cwd, remote='origin', branch?)` | RETAIN / ADAPT | IS-6 push | bounded push primitive | exact remote/source/target required; no implicit origin/force; normalized result |
| `syncRepo()` pull + recursive submodule update | SPLIT / RELOCATE | IS-6 fetch/integrate/relationship primitives + Git-domain orchestration | synchronization mechanisms useful | remove hidden bundle and provider-default pull policy; scope/sequence above IS-6 |
| `addSubmodule()` | RETAIN / ADAPT | IS-6 relationship provider | explicit submodule mechanism/source/path/branch | preconditions/conflict/effect evidence; eligibility remains upstream |
| `getRemotes()` | RETAIN / ADAPT | IS-6 inspect/remotes | fetch/push endpoint distinction | sanitize/normalize, multiple-remotes first-class, no selection policy |
| `getStagedDiff()` | RETAIN / ADAPT | IS-6 change evidence | staged diff useful for AI/commit planning | explicit comparison basis, size bound/truncation/sensitivity |
| `getAuthHeader()` reading `GITHUB_TOKEN` | REPLACE | IS-6 remote-provider construction / resolved credential boundary | bearer auth mechanism valid | inject credentials; no direct environment/config authority |
| `fetchWithTimeout()` | RETAIN / ADAPT | GitHub remote provider | bounded HTTP duration and AbortController | caller cancellation + resolved timeout; preserve uncertainty for consequential requests |
| `deleteRemoteRepo(owner,repo)` | RETAIN / ADAPT | IS-6 exact remote delete primitive | exact owner/repo target and HTTP DELETE | consume upstream authorization evidence; normalized absent/auth/network/indeterminate effects |
| `listRemoteRepos(org?)` | RETAIN / ADAPT | bounded GitHub remote facts | provider listing useful | exact account semantics, pagination, normalized minimal records; no raw JSON contract |
| `GithubRepo` raw REST types | RETAIN internally / REPLACE publicly | GitHub provider internal DTOs | useful strict response typing | raw snake_case REST objects do not cross capability boundary |
| `GithubRepositoryConfig` with token | SPLIT / RELOCATE | IS-3/configuration + provider credential construction | repository/provider configuration need | secret token not ordinary repository record; exact ownership determined by config spec |
| `IGithubService` | REPLACE | IS-6 capability + internal provider contracts | enumerates useful operation inventory | remove GitHub-named mixed local/remote boundary and workflow-shaped defaults |
| `GitStatusResult` | REPLACE / ADAPT | IS-6 repository snapshot types | basic branch/change/ahead/behind evidence | preserve data but expand dimensional/provenance model |
| `GitRemote` | RETAIN / ADAPT | IS-6 remote type | distinct fetch/push refs | sanitize endpoints and optional normalized host identity |
| `GitInitOptions`, `GitCloneOptions`, `GitSubmoduleOptions` | RETAIN / ADAPT | IS-6 request types | useful bounded inputs | absolute references, preconditions, cancellation/correlation and explicit semantics |
| `GitPushOptions` optional remote/branch | SPLIT / RELOCATE | Git-domain request policy + IS-6 exact push request | captures user intent | owning domain resolves optional/default selection before IS-6 |
| `GitSyncOptions.force` | REPLACE / RELOCATE | Git-domain/interaction semantics | indicates historical headless behavior | `force` must not mean prompt skipping or repository force semantics in capability |
| `app/commands/git/commitCommand.ts` repository calls | SPLIT / RELOCATE | Git-domain IS + IS-6 primitives + IS-10 AI | status/diff/stage/commit workflow evidence | remove erroneous temp commit used as staging; domain explicitly stages then obtains diff/message then commits |
| `app/commands/git/pushCommand.ts` repository calls | SPLIT / RELOCATE | Git-domain IS + IS-6 | remote selection and per-remote push workflow evidence | selection/sequencing/continuation above IS-6; exact per-repository push below |
| `app/commands/git/syncCommand.ts` repository calls | SPLIT / RELOCATE | Git-domain IS + IS-6 | sync intent and interaction evidence | explicit fetch/integration/relationship policy; interaction mode outside repository capability |
| `tests/unit/services/githubService.test.ts` | SPLIT / RELOCATE | IS-6 provider/capability tests | useful regression coverage | rewrite around normalized contracts, fake providers, real temp Git fixtures and mocked GitHub HTTP |
| Git command tests mocking `githubService` | SPLIT / RELOCATE | Git-domain/interaction tests | useful workflow expectations | mock Repository Capability at domain boundary; repository semantics tested in IS-6 |
| module singleton `export const githubService` | REPLACE | IS-23 composition root | convenient legacy access | explicit provider/capability construction and dependency injection |
| direct logger calls | ADAPT | subordinate observability | operational diagnostics useful | structured/redacted evidence/events; no logger singleton as semantic contract |

The legacy implementation is not deleted by this documentation change. Migration occurs when IS-6 and the owning Git-domain implementation are reduced to code.

---

## 27. Migration Sequence

Implementation should proceed in this order:

1. add AppManager repository references, snapshots, request/result/effect/failure types;
2. add deterministic fake local/remote provider contracts and precondition tests;
3. implement `LocalGitProvider` through IS-5 using direct Git argv and stable machine-readable output;
4. implement recognition, identity, status, refs/upstreams/remotes and configuration facts;
5. implement bounded change/diff evidence;
6. implement stage/unstage and commit without implicit staging;
7. implement initialize, fetch, explicit integration and ordinary push;
8. implement clone and explicit submodule relationship primitives;
9. implement GitHub remote adapter with injected credentials, pagination and normalized remote create/delete/facts;
10. add real temporary-Git integration fixtures and mocked HTTP contract tests;
11. wire `DefaultRepositoryCapability` through IS-23 composition;
12. migrate Git/App/Nuxt/AI consumers as their owning Implementation Specifications define workflows;
13. remove `IGithubService`, `GithubService`, legacy mixed types/tests and `simple-git` dependency once no target consumer requires them.

A temporary compatibility adapter may delegate old method calls to IS-6 while migration is incomplete, but it must not preserve hidden stage-all, implicit `origin`, provider-default pull strategy, recursive sync side effects, direct `GITHUB_TOKEN` reads or raw provider results in new code.

---

## 28. Traceability

| DD-2.3 area | IS-6 implementation |
|---|---|
| DD-REPO-001–004 | explicit absolute local/remote references; managed identity correlation distinct from path and authority |
| DD-REPO-005–009 | read-only Git recognition with nested/ambiguous/provider evidence and no marker leakage |
| DD-REPO-010–013 | normalized repository/revision/branch/detached identity; unknown remains unknown |
| DD-REPO-014–017 | multidimensional status with exact divergence context; inspection never authorizes mutation |
| DD-REPO-018–021 | requested repository configuration facts with provenance and credential minimization |
| DD-REPO-022–026 | normalized local/remote refs/upstream states and explicit ref-mutation inputs |
| DD-REPO-027–031 | multiple remotes, exact selection, distinct fetch/push endpoints and bounded URL identity parsing |
| DD-REPO-032–036 | explicit comparison basis, structured change evidence, bounded patch/truncation and read-only diff |
| DD-REPO-037–042 | explicit path/all staging, latest-safe-point preconditions, non-destructive unstaging and no vague destructive reset |
| DD-REPO-043–048 | approved-message commit, no implicit staging, created/no-op/hook/post-state evidence |
| DD-REPO-049–053 | explicit initialization, existing-repo detection, supplied branch/identity and separate effects |
| DD-REPO-054–058 | exact fetch source/options, ref effects and auth/network evidence; no integration implication |
| DD-REPO-059–064 | explicit fast-forward/merge/rebase integration, no provider-default policy or auto-conflict resolution |
| DD-REPO-065–070 | exact ordinary push, no force, structured accepted/rejected/up-to-date evidence |
| DD-REPO-071–074 | no broad initial sync method; any helper is one-repository and fully explicit |
| DD-REPO-075–078 | explicit clone source/destination/options and no managed ownership implication |
| DD-REPO-079–085 | explicit Git-submodule relationship request, conflict detection and bounded relationship effects |
| DD-REPO-086–098 | exact GitHub host identity, injected credentials, bounded facts/create/delete and indeterminate remote effects |
| DD-REPO-099–102 | caller-supplied expected state, latest-safe-point revalidation and atomic provider expectations where available |
| DD-REPO-103–107 | cancellation/progress propagated through IS-5/HTTP without rollback or acceptance claims |
| DD-REPO-108–114 | stable failure normalization, redaction, no implicit retry/fallback/multi-repo continuation |
| DD-REPO-115–118 | repository-scoped calls, per-repository evidence and no hidden expansion/transactionality |
| DD-REPO-119–123 | credential/provider isolation, URL sanitization and no authority from credential possession |
| DD-REPO-124–126 | repository result/effects remain DD-1.2-compatible evidence, not Boolean/final outcomes |
| DD-REPO-127–131 | Git/Managed Project/App/Nuxt/AI authority remains above reusable primitives/evidence |
| DD-REPO-132–136 | Git CLI + GitHub REST provider seams preserve normalized semantics and replace accidental `GithubService` boundary |
| DD-REPO-137–140 | fake-provider, temporary-Git and mocked-HTTP tests; application acceptance tests remain above |

IS-6 also conforms to IS-4 by using Resource Access only for bounded resource mechanics where needed, IS-5 by delegating Git CLI process mechanics rather than recreating them, IS-23 by using explicit composition/injection, DD-1.3 by consuming managed repository identity/topology rather than redefining it, DD-1.4 by consuming resolved configuration, and DD-1.5 by returning repository evidence for final Engine/use-case interpretation.

---

## 29. Version 1 Implementation Baseline

The Version 1 Repository Capability is:

```text
Managed Project / Git or owning application use case
  resolves repository identity, scope, policy, authorization and tool intent
        |
        v
bounded Repository Capability request
        |
        v
DefaultRepositoryCapability
  validate reference/preconditions -> delegate -> normalize -> inspect effects
        |
        +----------------------------+
        |                            |
        v                            v
LocalGitProvider              GitHubRemoteProvider
        |                            |
        v                            v
IS-5 Process Execution        HTTPS/fetch provider mechanics
        |                            |
        +-------------+--------------+
                      v
       normalized repository evidence/effects
                      |
                      v
        owning use case / Application Engine
              interpretation / acceptance
```

The non-drift rule is:

> **Version 1 Repository Capability is a repository-scoped facts-and-primitives boundary, not the Git domain, a managed-project resolver, a multi-repository workflow engine, a CI/CD engine or a source of destructive application authority.**
