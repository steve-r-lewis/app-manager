# IS-15 — Git Domain Implementation Specification

> **Document type:** Level 4 Implementation Specification
>
> **Status:** Version 1 implementation baseline
>
> **Implementation ID:** IS-15
>
> **Primary Detailed Design:** [DD-3.2 — Git Domain](../dd_3_high_coupling_domains/dd-3-2-git-domain-detailed-design-v01.md)
>
> **Primary Functional authority:** [Git Functional Specification](../functional/git-functional-specification-v01.md)
>
> **Application Core:** [IS-1 — Application Runtime and Invocation](is-1-application-runtime-and-invocation-implementation-specification-v01.md), [IS-2 — Managed Project Resolution](is-2-managed-project-resolution-implementation-specification-v01.md), [IS-3 — Configuration Resolution](is-3-configuration-resolution-implementation-specification-v01.md)
>
> **Principal shared capability:** [IS-6 — Repository Capability](is-6-repository-capability-implementation-specification-v01.md)
>
> **Supporting capabilities:** [IS-4 — Resource Access](is-4-resource-access-implementation-specification-v01.md), [IS-5 — Process Execution](is-5-process-execution-implementation-specification-v01.md), [IS-7 — Source Intelligence](is-7-source-intelligence-implementation-specification-v01.md), [IS-8 — Source Transformation](is-8-source-transformation-implementation-specification-v01.md), [IS-10 — AI Capability](is-10-ai-capability-implementation-specification-v01.md)
>
> **Related domain implementations:** [IS-14 — App Domain](is-14-app-domain-implementation-specification-v01.md), IS-16 Nuxt Domain, IS-20 AI Domain
>
> **Interaction/runtime:** IS-22 Interaction Adapters, [IS-23 — Build and Runtime Assembly](is-23-build-and-runtime-assembly-implementation-specification-v01.md)
>
> **Runtime decision:** [ADR-0001 — Primary Application Runtime](../project_management/decisions/adr-0001-primary-application-runtime.md)
>
> **Register:** [AppManager Implementation Specification](implementation-specification-v01.md)
>
> **Governing plan:** [Implementation Specification Plan](../project_management/implementation-specification-plan-v01.md)
>
> **Related clarification:** [Git Coordinated Commit Implementation Clarification — Retired](../archive/implementation/git-coordinated-commit-implementation-clarification-v01-retired.md) (its multi-repository `CommitGitInput`/`RepositoryCommitPlan` delta is now applied directly in §11, §12 and §15.1)

## 1. Purpose

IS-15 defines the concrete Node.js/TypeScript implementation of AppManager's Git domain: the application domain that owns managed-repository intent, operation-specific scope interpretation, eligibility, Git policy, multi-repository orchestration and Git-domain acceptance.

The governing implementation rules are:

> **Git Domain owns repository-management intent and policy; IS-6 owns repository facts and already-authorized bounded primitives.**

> **IS-2 establishes managed repository membership and targetability; IS-15 narrows that authoritative context into operation-specific Git scope and eligibility.**

> **Repository/provider success is evidence. IS-15 evaluates Git postconditions, and IS-1 retains final application acceptance.**

> **Repository recognition, membership, operation selection, eligibility, authorization, execution and acceptance remain distinct.**

> **Provider defaults, current working directory, discovered `.git` state, remote naming conventions and current implementation topology do not become Git-domain authority.**

---

## 2. Scope and Non-Ownership

IS-15 implements:

- Git use-case identities and descriptors;
- root/selected/selected-set/all-managed repository operation scope;
- operation-specific eligibility;
- repository inspection and relevant Git-configuration inspection;
- repository initialisation policy;
- explicit commit/staging/change-scope policy;
- optional AI commit-message proposal coordination;
- repository-scoped push and coordinated push;
- repository-scoped and coordinated synchronisation;
- managed repository relationship establishment;
- eligible managed-layer repository initialisation;
- deliberately enabled exact-target remote-repository deletion;
- remote selection and destructive target resolution policy;
- multi-repository ordering and continuation;
- stale-state/conflict/retry decisions;
- Git-domain partial-effect and recovery interpretation.

IS-15 does not implement:

- canonical invocation/authorization/final outcomes — IS-1;
- managed project/repository topology or mutation authority — IS-2;
- configuration precedence — IS-3;
- filesystem/process mechanics — IS-4/IS-5;
- repository facts/primitives/provider normalization — IS-6;
- source structure — IS-7;
- source mutation — IS-8;
- AI provider/model/context mechanics — IS-10;
- App lifecycle — IS-14;
- Nuxt layer creation — IS-16;
- AI user-facing semantics — IS-20;
- prompts/presentation — IS-22;
- runtime assembly — IS-23.

---

## 3. Concrete Module Boundary

```text
app/
└── domains/
    └── git/
        ├── contracts/
        │   ├── git-use-case.ts
        │   ├── git-operation.ts
        │   ├── repository-operation-scope.ts
        │   ├── repository-eligibility.ts
        │   ├── remote-selection.ts
        │   ├── commit-intent.ts
        │   ├── synchronisation-intent.ts
        │   ├── relationship-intent.ts
        │   ├── remote-deletion-intent.ts
        │   ├── git-result.ts
        │   ├── git-recovery.ts
        │   └── git-diagnostic.ts
        ├── catalogue/
        │   └── git-use-case-catalogue.ts
        ├── policy/
        │   ├── scope-resolver.ts
        │   ├── eligibility-evaluator.ts
        │   ├── remote-selector.ts
        │   ├── commit-policy.ts
        │   ├── synchronisation-policy.ts
        │   ├── continuation-policy.ts
        │   └── remote-deletion-policy.ts
        ├── orchestration/
        │   ├── repository-operation-runner.ts
        │   ├── coordinated-operation-runner.ts
        │   ├── git-acceptance.ts
        │   └── recovery-builder.ts
        └── use-cases/
            ├── inspect-repositories.ts
            ├── initialise-repository.ts
            ├── commit-repository.ts
            ├── push-repositories.ts
            ├── synchronise-repositories.ts
            ├── establish-repository-relationship.ts
            ├── initialise-layer-repositories.ts
            └── delete-remote-repository.ts
```

Contracts remain Git-domain-owned even when App/Nuxt/AI workflows consume them. Consumer count does not transfer semantic ownership.

No generic repository-workflow framework, global `GitService`, provider-native domain model or import-time singleton is introduced.

---

## 4. Public Use-Case Seam

Git use cases conform to IS-1:

```ts
export interface GitUseCase<TInput, TPayload> {
  readonly descriptor: GitUseCaseDescriptor;
  availability(context: ApplicationExecutionContext, input: TInput): Promise<GitAvailability>;
  validate(context: ApplicationExecutionContext, input: TInput): Promise<GitValidation>;
  execute(context: ApplicationExecutionContext, input: TInput): Promise<GitDomainResult<TPayload>>;
}
```

`GitDomainResult` supplies Git-specific payload/evidence to IS-1 and does not duplicate the canonical application outcome envelope.

No use case accepts a raw cwd/path as sufficient repository authority.

---

## 5. Canonical Git Command Identities

Version 1 IDs are:

```text
git.inspect
git.initialise
git.commit
git.push
git.synchronise
git.establish-relationship
git.initialise-layer-repositories
git.delete-remote-repository
```

Scope is structured input, not encoded by proliferating root/layer/all command implementations. Transitional adapter aliases such as `git.sync`, `git.push-all` or historical filenames may map to canonical IDs without creating distinct semantics.

---

## 6. Operation Scope

```ts
export type GitRepositoryScopeKind =
  | 'root_repository'
  | 'selected_repository'
  | 'selected_repository_set'
  | 'all_managed_repositories';

export interface RepositoryOperationScope {
  readonly kind: GitRepositoryScopeKind;
  readonly project: ManagedProjectId;
  readonly repositories: readonly ManagedRepositoryReference[];
  readonly topologyRevision: ManagedProjectRevision;
  readonly selectionEvidence: readonly GitEvidenceReference[];
}
```

IS-15 resolves requested intent only against IS-2's authoritative managed topology/scope. It may narrow; it cannot add a repository merely because IS-6 recognizes it.

Ambiguous input never defaults to `all_managed_repositories`.

---

## 7. Eligibility

```ts
export interface RepositoryEligibilityDecision {
  readonly repository: ManagedRepositoryId;
  readonly operation: GitOperationId;
  readonly state: 'eligible' | 'ineligible' | 'already_satisfied' | 'indeterminate';
  readonly evidence: readonly GitEvidenceReference[];
  readonly diagnostics: readonly GitDiagnostic[];
}
```

Eligibility combines authoritative managed context/effective configuration with fresh IS-6 evidence required by that operation.

Eligibility never rewrites IS-2 membership or topology.

---

## 8. Repository Capability Boundary

IS-15 receives an injected IS-6 `RepositoryCapability`. Domain code calls normalized operations such as `inspect`, `readChanges`, `stage`, `commit`, `initialize`, `fetch`, `integrate`, `push`, `changeRelationship` and `remoteHost`.

IS-15 never:

- imports `simple-git`;
- invokes Git CLI directly;
- calls GitHub REST directly;
- parses provider-native process/GitHub responses;
- reads provider credentials;
- uses a broad `syncRepo()` escape hatch with hidden policy.

IS-6 receives all material strategy/remote/ref/change/precondition inputs already resolved by IS-15.

---

## 9. Repository Inspection

`git.inspect` supports applicable structured scopes and requested fact groups.

```ts
export interface InspectGitInput {
  readonly scope: GitRepositoryScopeRequest;
  readonly facts: readonly GitInspectionFactClass[];
}
```

IS-15 resolves managed scope, evaluates read eligibility and issues bounded IS-6 inspections. Results preserve managed repository identity and distinguish clean/changed, index/worktree state, conflicts, branch/detached state, upstream state, divergence, remotes and requested configuration facts where available.

Inspection is read-only and produces no reusable mutation authorization.

Credential/helper/token material is excluded from ordinary configuration inspection.

---

## 10. Repository Initialisation

`git.initialise` targets one explicit eligible managed/prospective repository resource per invocation unless invoked through the dedicated layer-set use case.

Sequence:

```text
Engine context
 -> exact managed target
 -> IS-6 recognition/fresh evidence
 -> existing-repository policy
 -> effective initialization defaults
 -> effect classification / authorization
 -> IS-6 initialize
 -> IS-6 re-inspection
 -> Git postcondition acceptance
```

An already recognized valid repository is `already_satisfied` or rejected according to intent; it is never silently reinitialized.

Default branch/user identity inputs come from IS-3 operation-effective configuration/explicit invocation, not provider defaults.

---

## 11. Commit Input

Commit repository cardinality is expressed through the same `GitRepositoryScopeRequest` model used by inspect/push/synchronise (§9, §17, §20), per [Git Functional Specification §8.1](../functional/git-functional-specification-v01.md#_8-1-coordinated-commit):

```ts
export interface CommitGitInput {
  readonly scope: GitRepositoryScopeRequest;
  readonly staging: GitStagingIntent;
  readonly message: GitCommitMessageIntent;
  readonly continuation?: GitContinuationPolicyId;
}

export type GitStagingIntent =
  | { readonly mode: 'already_staged' }
  | { readonly mode: 'selected_changes'; readonly changes: readonly RepositoryChangeId[] }
  | { readonly mode: 'all_eligible_changes' };
```

`all_eligible_changes` means all changes within each explicitly resolved repository's own policy-defined eligible change set. It is never a filesystem-wide `.` wildcard, and it never spans repositories — each repository's eligible-change set is resolved independently.

Commit accepts the same repository cardinality as inspect/push/synchronise: root, selected repository, selected repository set or all managed repositories. No `git.commit-all` or other bulk-command identity is introduced; scope is structured input on the one canonical `git.commit`.

---

## 12. Commit Evidence and Staging

IS-15 resolves a `CommitGitInput` into one immutable, independently-evaluated plan per repository in scope before any commit effect begins:

```ts
export interface RepositoryCommitPlan {
  readonly repository: ManagedRepositoryId;
  readonly eligibility: RepositoryEligibilityDecision;
  readonly staging: GitStagingIntent;
  readonly approvedChanges: readonly RepositoryChangeId[];
  readonly message: ResolvedCommitMessage;
  readonly preconditions: readonly GitEvidenceReference[];
}
```

For each repository's plan, IS-15 requests fresh IS-6 change evidence containing stable change identities/status/index-worktree classification and repository revision/precondition evidence.

The commit policy resolves requested staging to exact IS-6 stage requests, independently per repository.

Already-staged mode does not stage unstaged changes.

Selected mode rejects missing/stale/out-of-scope change identities.

All-eligible mode is expanded into each repository's own bounded eligible set before effect review/authorization where required; it is never expanded across repositories.

IS-15 never uses `createCommit(..., 'temp', ['.'])` or another commit primitive as a staging mechanism.

---

## 13. Commit Message Resolution

```ts
export type GitCommitMessageIntent =
  | { readonly source: 'explicit'; readonly message: string }
  | { readonly source: 'ai_proposal_requested'; readonly fallback?: 'require_explicit' }
  | { readonly source: 'accepted_proposal'; readonly proposalId: string; readonly message: string };
```

The accepted message is normalized/validated by Git policy before IS-6 commit execution. Empty/invalid messages fail validation.

An AI proposal and an accepted commit message remain separate records.

Where scope resolves more than one repository, message resolution is independent per repository: an `ai_proposal_requested`/`accepted_proposal` intent applies separately to each repository's own approved change evidence, never one message reused verbatim across repositories.

---

## 14. Optional AI Commit-Message Assistance

AI assistance uses IS-10 directly as a bounded specialist capability unless a user-facing AI-domain use case is itself the requested product intent.

For each repository requiring a message proposal, IS-15 constructs a separate purpose-limited context from that repository's own approved IS-6 change evidence. It does not infer that repository scope authorizes disclosure, and one repository's context is never shared into another repository's proposal.

Context follows IS-10 disclosure/sensitivity/budget policy and may include bounded staged change summaries/patch evidence only where approved.

The AI request requires structured commit-message proposal output and provenance.

AI unavailable/failure/rejected output returns a proposal diagnostic/decision requirement and leaves the manual explicit-message path available, independently per repository.

AI never invokes stage/commit and never authorizes its own output.

An authorised Git workflow may automatically accept a valid proposal when deterministic acceptance criteria were resolved before generation, consistent with the automatic-acceptance rule already established for AI-generated output (PR #174). Automatic acceptance never removes the following six stages or collapses them into one boolean:

```text
provider completion
proposal validation
Git-domain acceptance
repository commit execution
Git-domain postcondition acceptance
final IS-1 application acceptance
```

---

## 15. Commit Execution and Acceptance

Per repository, once that repository's staging/message/authorization are satisfied:

1. validate repository/change preconditions;
2. execute exact IS-6 stage requests if required;
3. re-read staged evidence when material;
4. verify there is eligible staged content;
5. call IS-6 commit with accepted message and expected state;
6. inspect resulting revision/status;
7. establish whether a new expected commit exists;
8. preserve all staging/commit effects and diagnostics before moving to the next repository.

Commit creation is not retried blindly. Uncertain execution requires revision/status verification first.

No-change does not fabricate commit success.

### 15.1 Coordinated Commit

For scope resolving more than one repository, IS-15 reuses the existing `coordinated-operation-runner` (§19, §22) rather than a separate bulk-commit subsystem. The runner executes each repository's `RepositoryCommitPlan` (§12) through the §15 sequence above under the same `GitContinuationPolicyId` (§19), deterministic managed-topology ordering, cancellation (§34) and per-repository `GitRepositoryResult` (§31) already used for coordinated push and synchronisation.

On failure or cancellation partway through a coordinated commit, IS-15 preserves — never simulating universal transactionality by reverting commits already created in earlier repositories:

- repositories committed successfully;
- repositories skipped/already satisfied;
- repositories failed or stale;
- repositories not yet attempted;
- staging effects that occurred before a later failure where material;
- resulting revisions and recovery information.

This evidence is supplied to IS-1 for canonical final outcome construction through the same `GitRecoveryPosition` (§35) used elsewhere in the domain.

---

## 16. Remote Selection

```ts
export interface RemoteSelectionDecision {
  readonly repository: ManagedRepositoryId;
  readonly operation: 'push' | 'synchronise' | 'relationship';
  readonly remotes: readonly RepositoryRemoteId[];
  readonly source: 'explicit' | 'upstream_binding' | 'effective_policy';
  readonly evidence: readonly GitEvidenceReference[];
}
```

Remote selection precedence is semantic, not provider-order based:

1. explicit valid invocation selection;
2. unambiguous operation-relevant upstream/binding when the use case permits it;
3. explicit effective Git policy;
4. otherwise ambiguity.

There is no unconditional `origin` fallback and no `remotes[0]` default.

---

## 17. Push Input and Scope

```ts
export interface PushGitInput {
  readonly scope: GitRepositoryScopeRequest;
  readonly remote?: GitRemoteSelectionRequest;
  readonly continuation?: GitContinuationPolicyId;
}
```

`git.push` supports root, selected repository and all-managed scopes required by the Functional baseline; selected-set support may be exposed where it preserves the same semantics.

The same repository-scoped worker handles root/layer repositories after scope resolution.

---

## 18. Repository-Scoped Push

Per repository:

1. inspect branch/upstream/remotes/divergence;
2. evaluate push eligibility;
3. resolve remote target(s);
4. determine whether history requires transfer;
5. reject unsupported history-rewriting/force semantics;
6. establish effect/authorization coverage;
7. call IS-6 push for each explicitly resolved target;
8. obtain sufficient resulting evidence;
9. interpret pushed/already-current/failed/indeterminate.

Push does not build, test, release or deploy.

Version 1 IS-15 exposes no generic force-push Boolean.

---

## 19. Coordinated Push

For `all_managed_repositories`, IS-15 resolves and records the complete repository set and per-repository eligibility before starting effects where reasonably possible.

```ts
export type GitContinuationPolicyId = 'stop_on_failure' | 'continue_collecting';
```

The selected policy is resolved before execution and cannot be chosen by an IS-6/provider failure.

The initial Version 1 runner executes consequential multi-repository operations **sequentially in deterministic managed-topology order**. This deliberately simplifies cancellation, auditability and partial-effect reconstruction. The semantic contract does not depend on sequentiality; bounded parallelism may replace it later without changing scope/policy/results.

Completed pushes remain completed. No cross-repository rollback is attempted or implied.

---

## 20. Synchronisation Input

```ts
export interface SynchroniseGitInput {
  readonly scope: GitRepositoryScopeRequest;
  readonly strategy: GitSynchronisationStrategy;
  readonly continuation?: GitContinuationPolicyId;
}

export type GitSynchronisationStrategy =
  | { readonly kind: 'fast_forward_only' }
  | { readonly kind: 'merge'; readonly conflictPolicy: 'stop_and_report' }
  | { readonly kind: 'rebase'; readonly conflictPolicy: 'stop_and_report' };
```

Strategy must be explicit invocation/effective policy. IS-15 does not delegate unspecified `git pull` provider defaults.

No Version 1 strategy silently discards local work, auto-resolves conflicts, hard-resets, force-updates or stashes without separately approved semantics.

---

## 21. Repository-Scoped Synchronisation

Per repository:

1. inspect local changes/conflicts/upstream/divergence;
2. resolve exact remote/upstream;
3. reject unresolved conflict or unsupported destructive condition;
4. fetch through IS-6 where required;
5. execute IS-6 integration with explicit strategy/preconditions;
6. inspect resulting state;
7. interpret synchronized/already-current/conflicted/failed/indeterminate.

A current implementation's combined `pull()` + recursive submodule update is not the target semantic primitive. Repository integration and managed relationships are explicit; synchronising one repository does not automatically broaden into all nested/submodule repositories.

---

## 22. Coordinated Synchronisation

Root, selected, selected-set and all-managed scopes use the same repository-scoped synchronisation worker.

The runner preserves deterministic scope/order, explicit continuation policy and per-repository results.

When deliberately narrow synchronization can leave a known managed relationship at revision drift, IS-15 emits a structured warning/recommended next action but does not expand scope automatically.

---

## 23. Relationship Intent

```ts
export interface EstablishRepositoryRelationshipInput {
  readonly parent: ManagedRepositorySelector;
  readonly target: ManagedRepositorySelector;
  readonly kind: 'git_submodule';
  readonly remote: GitRemoteSelectionRequest;
  readonly targetLocation: ManagedRelationshipLocation;
  readonly branch?: RepositoryBranchReference;
}
```

Version 1 implements the currently approved concrete relationship kind `git_submodule` behind the IS-6 relationship primitive. The domain contract remains AppManager-oriented and can add another explicitly specified kind later.

---

## 24. Relationship Establishment

Sequence:

1. resolve parent/target from IS-2 topology;
2. verify both operation-specific eligibility decisions;
3. inspect existing relationship/tracked-content state;
4. resolve target remote exactly;
5. validate managed target location/ownership;
6. reject duplicate/conflicting ownership/tracking;
7. authorize material effect;
8. call IS-6 relationship primitive;
9. re-inspect relationship/repository evidence;
10. report whether parent commit remains required.

IS-15 does not mutate IS-2 topology directly from `.gitmodules`/provider state. Any managed-project topology update follows the owning Managed Project persistence path.

---

## 25. Managed-Layer Repository Initialisation

```ts
export interface InitialiseLayerRepositoriesInput {
  readonly layers: 'all_eligible' | readonly ManagedProjectEntityId[];
  readonly continuation?: GitContinuationPolicyId;
}
```

Candidates come exclusively from IS-2 managed entities/topology identified as eligible for independent repositories. Directory location alone is insufficient.

Each layer receives independent eligibility, initialization, postcondition and result evidence.

When invoked from IS-16 Nuxt Domain, Git success establishes repository state only. It does not claim layer-creation success.

---

## 26. Remote Deletion Enablement

Remote deletion is disabled unless effective Version 1 configuration/policy explicitly enables the use case and an injected IS-6 remote-host provider supports the target provider.

Technical provider capability does not enable the product use case.

Availability exposes disabled/unsupported state structurally.

---

## 27. Exact Remote Deletion Target

```ts
export interface RemoteDeletionTarget {
  readonly provider: RemoteHostProviderId;
  readonly accountKind: 'user' | 'organisation';
  readonly owner: string;
  readonly repository: string;
  readonly providerRepositoryId?: string;
  readonly identityRevision: string;
  readonly resolutionEvidence: readonly GitEvidenceReference[];
}
```

The target is resolved from explicit invocation plus fresh provider/repository evidence. Local directory name, personal defaults, remote name or URL fragment alone cannot establish deletion identity.

If identity cannot be exact, deletion is unavailable.

---

## 28. Strong Target-Bound Authorization

Remote deletion requires an IS-1 authorization class distinct from ordinary repository mutation, conceptually:

```ts
{
  class: 'destructive_remote_repository_deletion',
  targetFingerprint: sha256(canonicalProviderTargetIdentity),
  effect: 'delete_remote_repository'
}
```

IS-15 supplies the exact effect/target for authorization; IS-1 owns authorization evidence/decision.

Immediately before deletion, IS-15 refreshes provider identity and compares the canonical fingerprint. Changed target identity invalidates authorization.

Authorization cannot be reused for another repository.

---

## 29. Remote Deletion Execution

Sequence:

```text
explicit intent
 -> enabled-policy check
 -> exact target resolution
 -> fresh identity evidence
 -> strong target-bound authorization
 -> final identity/precondition refresh
 -> IS-6 remote-host delete
 -> provider/result verification where possible
 -> target-specific Git interpretation
```

No local repository, other remote, relationship or project resource is deleted as a side effect.

If provider failure leaves deletion uncertain, state is `indeterminate` until verification. IS-15 never blindly retries destructive deletion.

---

## 30. Coordinated Operation State

```ts
export type GitRepositoryOperationState =
  | 'pending'
  | 'already_satisfied'
  | 'ineligible'
  | 'executing'
  | 'completed'
  | 'failed'
  | 'conflicted'
  | 'cancelled'
  | 'indeterminate'
  | 'not_attempted';
```

This is Git orchestration state, not a replacement for IS-1 canonical outcome states.

Each state is keyed by stable managed repository identity.

---

## 31. Git Result Payload

```ts
export interface GitRepositoryResult {
  readonly operation: GitOperationId;
  readonly repository: ManagedRepositoryId;
  readonly state: GitRepositoryOperationState;
  readonly remote?: RepositoryRemoteId;
  readonly effects: readonly ApplicationEffectEvidence[];
  readonly resultingEvidence: readonly GitEvidenceReference[];
  readonly diagnostics: readonly GitDiagnostic[];
  readonly remainingActions: readonly GitRemainingAction[];
}

export interface GitDomainPayload {
  readonly operation: GitOperationId;
  readonly scope: RepositoryOperationScope;
  readonly repositories: readonly GitRepositoryResult[];
  readonly continuation: readonly GitContinuationDecision[];
  readonly recovery?: GitRecoveryPosition;
}
```

No duplicate `success: boolean` is introduced.

---

## 32. Acceptance

Git acceptance evaluators are use-case-specific:

- initialise: expected repository identity/state established;
- commit: expected new commit/revision established;
- push: intended remote/ref transfer satisfied or already current;
- synchronize: resulting local/upstream relationship satisfies selected strategy or explicitly reports conflict;
- relationship: expected relationship evidence established;
- layer initialization: each eligible selected layer classified truthfully;
- remote deletion: exact target deletion verified where possible, otherwise uncertainty retained.

IS-6 success alone does not satisfy these postconditions.

IS-15 returns domain interpretation to IS-1 for final application acceptance.

---

## 33. Stale-State Preconditions

Before consequential execution, IS-15 supplies IS-6 preconditions derived from the evidence used to approve the operation: repository identity/revision, branch/ref, remote identity, change set, relationship state or remote-host target as applicable.

Material mismatch returns stale/conflict evidence rather than silently recalculating a broader/different effect.

If re-planning changes authorized scope/effects, renewed IS-1 authorization is required where policy demands it.

---

## 34. Cancellation

IS-1 `AbortSignal` is checked before each repository effect and propagated through IS-6.

Once cancellation is safely observed, coordinated runners initiate no new consequential repository effects.

In-flight capability/provider effects are interpreted from actual evidence. Cancellation never means rollback.

Unattempted repositories remain explicitly `not_attempted`.

---

## 35. Recovery

```ts
export interface GitRecoveryPosition {
  readonly completed: readonly ManagedRepositoryId[];
  readonly terminal?: ManagedRepositoryId;
  readonly notAttempted: readonly ManagedRepositoryId[];
  readonly completedEffects: readonly ApplicationEffectEvidence[];
  readonly indeterminateEffects: readonly GitIndeterminateEffect[];
  readonly revalidation: readonly GitRevalidationRequirement[];
  readonly dispositions: readonly ('retry' | 'continue_after_revalidation' | 'repair' | 'manual_intervention')[];
}
```

Recovery is informational. Version 1 does not persist resumable Git workflow state or promise rollback.

Retry/continuation revalidates IS-2 scope/topology, IS-3 material configuration, IS-6 repository/remote state and authorization-sensitive identity.

---

## 36. Conflict and Concurrency Keys

Consequential operations expose IS-1 conflict keys such as:

```text
git-repository:<managed-repository-id>
git-remote:<provider>:<owner>:<repository>
git-relationship:<parent-repository-id>:<managed-location>
```

Operations that mutate the same repository conflict unless their explicitly specified semantics permit coexistence.

Unrelated repositories are not globally serialized by IS-15. Coordinated operations use deterministic sequential execution initially, but separate independent invocations remain subject to IS-1 conflict coordination rather than a Git-domain global lock.

---

## 37. Idempotency and Retry

Inspection is read-only/repeatable subject to changing evidence.

Initialization/relationship may classify already-satisfied states without invoking mutation.

Push/synchronization require fresh evidence after uncertain remote effects.

Commit is non-idempotent and never blindly retried.

Remote deletion is destructive/non-idempotent and requires verification before any retry consideration.

Provider retry policy cannot redefine these semantics.

---

## 38. Security and Sensitive Information

IS-15 never receives or emits raw credentials/tokens/authorization headers/credential-helper output.

Remote URLs/account metadata are projected only when required for selection/review/diagnosis/recovery.

AI disclosure is separately authorized and minimized; a Git operation's managed scope does not automatically authorize external AI disclosure.

Remote deletion uses least-scope provider capability supplied below IS-6 and exact target-bound application authorization above it.

Provider-native errors are normalized below the domain before diagnostics are emitted.

---

## 39. Interaction Independence

No IS-15 module imports `@clack/prompts`, `picocolors`, terminal UI or IDE APIs.

Repository/remote/change/relationship/destructive-target selection is structured input/decision data.

When required information is absent in Headless mode, validation returns structured decision requirements/diagnostics. It never prompts, selects the first remote, assumes `origin`, chooses the current directory or broadens to all repositories.

IS-22 owns acquisition/presentation only.

---

## 40. Events and Observability

Semantic events emitted through IS-1 may include:

```text
git.scope.resolved
git.repository.started
git.repository.completed
git.repository.failed
git.repository.conflicted
git.repository.cancelled
git.operation.partial
git.recovery.available
```

Observability records safe invocation/operation/repository/stage/remote identity references, timings, effect classes, diagnostic codes and subordinate correlation IDs.

No terminal formatting, credentials, unnecessary raw diff content or provider payloads are emitted.

---

## 41. Diagnostics

Initial stable Git-domain codes include:

```text
GIT_OPERATION_UNAVAILABLE
GIT_SCOPE_AMBIGUOUS
GIT_SCOPE_NOT_MANAGED
GIT_REPOSITORY_INELIGIBLE
GIT_REPOSITORY_STATE_INDETERMINATE
GIT_REPOSITORY_ALREADY_INITIALISED
GIT_REPOSITORY_PRECONDITION_STALE
GIT_NO_COMMITTABLE_CHANGES
GIT_CHANGE_SCOPE_STALE
GIT_STAGING_SCOPE_INVALID
GIT_COMMIT_MESSAGE_REQUIRED
GIT_AI_PROPOSAL_UNAVAILABLE
GIT_AI_PROPOSAL_REJECTED
GIT_REMOTE_REQUIRED
GIT_REMOTE_AMBIGUOUS
GIT_NOTHING_TO_PUSH
GIT_PUSH_REJECTED
GIT_SYNC_STRATEGY_REQUIRED
GIT_SYNC_CONFLICT
GIT_LOCAL_WORK_POLICY_REQUIRED
GIT_RELATIONSHIP_ALREADY_EXISTS
GIT_RELATIONSHIP_OWNERSHIP_CONFLICT
GIT_LAYER_REPOSITORY_INELIGIBLE
GIT_REMOTE_DELETION_DISABLED
GIT_REMOTE_DELETE_TARGET_AMBIGUOUS
GIT_REMOTE_DELETE_AUTHORIZATION_REQUIRED
GIT_REMOTE_DELETE_TARGET_STALE
GIT_REMOTE_DELETE_INDETERMINATE
GIT_OPERATION_PARTIAL
GIT_CANCELLED
GIT_RECOVERY_REVALIDATION_REQUIRED
```

Diagnostics preserve repository/stage identity and safe evidence without exposing provider-native error contracts.

---

## 42. Composition

IS-23 constructs:

1. IS-6 Repository Capability;
2. IS-10 AI Capability where configured;
3. Git policy/evaluator components;
4. operation runners/acceptance/recovery builder;
5. eight Git use-case instances;
6. immutable Git descriptor catalogue;
7. IS-1 registrations.

No direct environment/config reads occur in domain constructors. IS-3 operation-effective values arrive through Engine context.

No self-registering singleton exists.

---

## 43. App and Nuxt Coordination

IS-14 may invoke `git.initialise` as a subordinate root-creation/initialisation stage. Git acceptance establishes repository postconditions only; App retains lifecycle acceptance.

IS-16 may invoke `git.initialise-layer-repositories` or relationship establishment as a subordinate Nuxt workflow. Git acceptance does not establish Nuxt layer success.

Subordinate domain calls use the IS-1 Engine-authorized nested-use-case path so scope/authorization/cancellation/effect tracking remain canonical.

---

## 44. CI/CD and Automation Boundary

Automation may invoke Git use cases structurally, but IS-15 does not own complete CI/CD pipelines.

Build remains IS-14, Quality remains IS-18, documentation remains IS-17, deployment/release semantics require their owning specification.

A composed workflow may call these use cases in sequence without transferring their policy into Git.

---

## 45. Testing Requirements

Core tests cover at least:

1. eight canonical Git IDs;
2. aliases do not create semantics;
3. no cwd/path reconstruction of managed scope;
4. root scope resolution;
5. selected repository scope;
6. selected set scope;
7. all-managed scope;
8. ambiguity does not broaden scope;
9. discovery does not create membership;
10. eligibility is operation-specific;
11. IS-3 effective config consumed only;
12. IS-6 provider success not Git acceptance;
13. inspection read-only/non-authorizing;
14. inspection preserves repository identity;
15. sensitive Git config minimized;
16. existing repository not reinitialized;
17. initialization defaults from governed inputs;
18. initialization postcondition reinspection;
19. commit scope bounded to explicitly resolved repositories, never a project-wide wildcard;
20. no committable change classification;
21. already-staged mode does not stage unstaged changes;
22. selected-change scope exact;
23. all-eligible staging expanded before authorization;
24. stale change identity refused;
25. no unrelated staging;
26. no temp commit used for staging;
27. explicit commit message validation;
28. manual commit works without AI;
29. AI failure leaves manual path;
30. AI context disclosure bounded;
31. AI output remains proposal;
32. accepted proposal distinct from generated proposal;
33. commit result revision verification;
34. commit no blind retry;
35. explicit remote selection;
36. unambiguous upstream selection;
37. effective remote policy selection;
38. no `origin` fallback;
39. no first-remote fallback;
40. repository-scoped push;
41. nothing-to-push already-current;
42. push no build/quality semantics;
43. no force-push Boolean;
44. all-managed push pre-resolves scope;
45. deterministic coordinated order;
46. stop-on-failure;
47. continue-collecting;
48. completed push survives later failure;
49. no multi-repository rollback claim;
50. sync strategy required;
51. fast-forward-only strategy;
52. merge stop-on-conflict;
53. rebase stop-on-conflict;
54. no provider-default pull strategy;
55. local-work protection;
56. one-repository sync does not recursively sync relationships;
57. selected-set sync;
58. all-managed sync;
59. narrow-sync drift warning without expansion;
60. relationship exact parent/target;
61. relationship remote exactness;
62. duplicate relationship already-satisfied/conflict semantics;
63. ownership/tracking conflict refusal;
64. relationship does not rewrite IS-2 topology;
65. parent commit remaining action;
66. layer candidates from IS-2 entities only;
67. independent layer outcomes;
68. Nuxt caller does not transfer Nuxt acceptance;
69. remote deletion disabled by default/policy;
70. provider capability alone does not enable deletion;
71. exact remote-host target identity;
72. directory/default/remote-name insufficient for delete target;
73. strong target-bound authorization;
74. stale destructive target invalidates authorization;
75. no deletion cascade;
76. uncertain deletion remains indeterminate;
77. no blind delete retry;
78. cancellation stops new repository effects;
79. cancellation does not rollback completed effects;
80. unattempted repositories retained;
81. partial results preserve per-repository truth;
82. recovery requires revalidation;
83. conflict keys serialize same repo, not all repos;
84. provider credentials absent from domain;
85. Headless ambiguity returns structured diagnostic;
86. no prompts/colors in domain;
87. machine-consumable multi-repository payload;
88. no competing success Boolean;
89. semantic events presentation-free;
90. explicit IS-23 composition/no singleton;
91. provider substitution leaves policy tests unchanged;
92. repository diff evidence not treated as IS-7 source structure;
93. `CommitGitInput.scope` accepts root/selected/selected-set/all-managed cardinality without introducing `git.commit-all`;
94. `RepositoryCommitPlan` is resolved independently per repository before any commit effect begins;
95. coordinated commit reuses `coordinated-operation-runner` rather than a separate bulk-commit subsystem;
96. staging/message/AI-proposal resolution is independent per repository within one coordinated invocation;
97. provider completion, proposal validation, Git-domain acceptance, repository commit execution, Git-domain postcondition acceptance and final IS-1 acceptance remain six distinct stages, never collapsed into one boolean;
98. coordinated commit failure/cancellation preserves per-repository truth without reverting earlier successful commits.

Integration tests use controlled IS-6 substitutes for domain-policy tests and dedicated repository fixtures for capability/domain integration. Remote-host destructive tests use provider fakes by default; live destructive-provider tests are excluded from ordinary suites and require separately controlled test infrastructure.

---

## 46. Current Implementation Disposition

| Current artefact/responsibility | Disposition | Version 1 treatment |
|---|---|---|
| `app/commands/git/commitCommand.ts` commit intent | **RETAIN / ADAPT / RELOCATE** | Move repository intent to `git.commit`; preserve optional AI/manual message concept with explicit staging/message policy. |
| `CommitCommand` `targetRoot`/`isEnabled` | **REPLACE** | IS-1 use case + IS-2 scope + IS-15 applicability/eligibility. |
| commit status inspection through `githubService` | **RELOCATE** | IS-6 facts consumed by IS-15. |
| interactive stage-all confirmation | **SPLIT / RELOCATE** | IS-15 structured staging intent; IS-22 gathers choice. |
| `createCommit(targetRoot, 'temp', ['.'])` staging | **REPLACE — defect** | Explicit IS-6 `stage()` then one real commit. No temporary commit. |
| AI diff/message path | **RETAIN / SPLIT / ADAPT** | IS-6 bounded change evidence + IS-10 proposal; Git accepts message; IS-22 handles human review. |
| direct `llmService` | **REPLACE / RELOCATE** | IS-10 capability contract. |
| commit prompts/spinners/colors/logger result | **RELOCATE** | IS-22 presentation + IS-1 events/structured diagnostics. |
| `app/commands/git/pushCommand.ts` push intent | **RETAIN / ADAPT / RELOCATE** | Canonical `git.push` with structured scope/remote selection. |
| `remotes[0]` initial selection | **REPLACE** | Explicit/upstream/effective policy; ambiguity fails safe. |
| loop over selected remotes | **RETAIN concept / ADAPT** | Explicit target set with per-target evidence and domain acceptance. |
| push catches each error and continues implicitly | **REPLACE** | Explicit continuation policy; provider failure cannot choose it. |
| `app/commands/git/syncCommand.ts` sync intent | **RETAIN / ADAPT / RELOCATE** | Canonical `git.synchronise`; explicit scope/strategy. |
| `options.force` as Headless flag | **REPLACE** | Interaction mode is IS-1/IS-22 context, not force semantics. |
| `githubService.syncRepo()` hidden `git pull` policy | **REPLACE** | IS-15 explicit strategy + IS-6 fetch/integrate primitives. |
| automatic recursive submodule update during sync | **REPLACE** | Managed relationship scope is explicit; no hidden expansion. |
| `pushAll.ts`, `syncReposAll.ts`, `syncRepo.ts`, `pushToRemote.ts` stubs/parallel concepts | **SPLIT / CONSOLIDATE** | Scope variants feed canonical push/synchronise use cases rather than separate policy implementations. |
| `addSubmodules.ts` | **RETAIN intent / ADAPT / RELOCATE** | `git.establish-relationship` with exact managed parent/target/remote/location policy. |
| `initLayers.ts` | **RETAIN intent / ADAPT / RELOCATE** | `git.initialise-layer-repositories`; IS-2/Nuxt boundaries preserved. |
| `deleteRemoteRepos.ts` | **RETAIN intent / REPLACE implementation** | Exact-target, explicitly enabled, strongly authorized single-target destructive use case; coordinated deletion requires separate future semantics. |
| `manageCommits.ts` | **REPLACE / REMOVE ambiguous surface** | Commit management beyond approved `git.commit` requires explicit future requirements. |
| `app/services/githubService.ts` local Git mechanics | **RETAIN useful coverage / SPLIT / RELOCATE** | Already assigned to IS-6; not a Git-domain service. |
| `simple-git` local provider | **REPLACE below domain** | IS-6 local Git provider via IS-5 Git CLI per IS-6. |
| `githubService.createCommit()` implicit add+commit | **SPLIT / REPLACE** | IS-6 explicit stage and commit primitives; IS-15 chooses staging policy. |
| `githubService.push()` default `origin` | **REPLACE** | IS-15 resolves remote; IS-6 receives exact remote/ref. |
| `githubService.syncRepo()` pull + submodules | **SPLIT / REPLACE** | Explicit fetch/integrate/relationship operations. |
| `githubService.getAuthHeader()` direct `process.env.GITHUB_TOKEN` | **REPLACE below domain** | IS-3/composition injects credentials into IS-6 remote provider; never reaches IS-15. |
| `githubService.deleteRemoteRepo()` | **RETAIN bounded provider mechanic / RELOCATE** | IS-6 remote-host provider; IS-15 owns enablement/target/authorization/acceptance. |
| `githubService.listRemoteRepos()` | **RETAIN / ADAPT below domain** | IS-6 bounded remote-host evidence where exact-target selection requires it; no personal-default authority. |
| global `githubService` singleton | **REPLACE** | IS-23 explicit composition of IS-6 and IS-15. |
| provider/logging errors as user result | **REPLACE** | IS-6 normalization -> IS-15 diagnostics -> IS-1 canonical outcome. |

---

## 47. Migration Sequence

1. add Git-domain contracts and eight canonical use-case descriptors;
2. add scope resolver over IS-2 managed topology;
3. add operation-specific eligibility evaluator;
4. inject IS-6 Repository Capability and remove domain dependency on `githubService`;
5. implement read-only `git.inspect`;
6. implement `git.initialise` with existing-repository protection/postcondition reinspection;
7. implement commit staging/change-scope policy;
8. fix current temporary-commit staging defect by using explicit IS-6 stage primitive;
9. integrate optional IS-10 commit-message proposal with manual fallback/acceptance;
10. implement remote-selection policy with no origin/first-remote fallback;
11. implement repository-scoped `git.push`;
12. consolidate all-managed push into canonical scope-driven push orchestration;
13. implement explicit synchronization strategy over IS-6 fetch/integrate;
14. consolidate root/selected/set/all sync variants into canonical scope-driven synchronization;
15. implement relationship establishment over IS-6 relationship primitive;
16. implement managed-layer repository initialization from IS-2 topology;
17. implement remote-deletion enablement, exact target resolution and strong target-bound authorization;
18. add deterministic coordinated runner, continuation and recovery semantics;
19. route App/Nuxt subordinate Git operations through IS-1 nested-use-case authority;
20. migrate all Git interaction/presentation to IS-22;
21. remove/reduce obsolete command stubs/duplicate policy paths;
22. remove global `githubService` from domain consumers as IS-6 migration lands;
23. run authority, stale-state, partial-effect, Headless, provider-substitution and destructive-safety conformance suites.

---

## 48. Traceability

| Implementation concern | Governing authority |
|---|---|
| authority/capability seam | DD-GIT-001–003, CI-001–004; FR-GIT-001–014 |
| operation IDs/scope/eligibility | DD-GIT-004–007, 040–042; FR-GIT-003–011 |
| inspection | DD-GIT-016–019; FR-GIT-015–020 |
| initialization | DD-GIT-016–020, 063; FR-GIT-021–026 |
| commit/staging/message/AI | DD-GIT-008–009, 021–024, 064, 068, 072; FR-GIT-027–039 |
| push/remote selection | DD-GIT-007, 025–026, 043–044; FR-GIT-040–049 |
| coordinated push | DD-GIT-027–029, 048, 054; FR-GIT-050–058 |
| synchronization | DD-GIT-010, 030–031, CI-006; FR-GIT-059–073 |
| relationships | DD-GIT-011, 032; FR-GIT-074–081 |
| layer repository initialization | DD-GIT-033; FR-GIT-082–086 |
| remote deletion | DD-GIT-012, 034–036, 045, 047, 049, 056, 065, 069, CI-009; FR-GIT-087–095 |
| automation boundary | DD-GIT-057–060; FR-GIT-096–100, 111–114 |
| stale state/authorization/effects | DD-GIT-017, 046–056, 061–065; FR-GIT-101–110 |
| security | DD-GIT-066–069; FR-GIT-019, 036, 087–095, 106 |
| replaceability | DD-GIT-070–074, CI-011; FR-GIT-001–003, 012–013 |
| repository/source distinction | DD-GIT-CI-012; IS-6/IS-7 |

---

## 49. Version 1 Non-Drift Baseline

```text
IS-22 adapter -> IS-1 canonical invocation/authority
                     |
                     +--> IS-2 managed project/repository topology
                     +--> IS-3 operation-effective configuration
                     |
                     v
                 IS-15 Git Domain
                     |
                     +--> intent-relative scope + eligibility
                     +--> Git policy / remote / staging / strategy decisions
                     +--> multi-repository continuation / recovery
                     |
                     +--> IS-6 repository facts and bounded primitives
                     +--> IS-10 optional AI commit-message proposal
                     |
                     v
              Git-domain acceptance
                     |
                     v
              IS-1 final acceptance
                     |
                     v
        canonical AppManager outcome
```

The non-drift rule is:

> **Version 1 Git Domain owns managed-repository intent, intent-relative repository scope, operation eligibility, staging/remote/synchronisation/destructive policy, multi-repository orchestration and Git-domain acceptance. It never derives mutation authority from repository discovery, bypasses IS-6 for provider convenience, treats provider defaults as application policy, stages unrelated changes, requires AI for commit, broadens synchronisation through hidden submodule behaviour, equates remote access with destructive authority, erases completed partial effects, or publishes a competing final AppManager outcome.**