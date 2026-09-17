# IS-15 Coordinated Git Commit Implementation Clarification

> **Status:** Active Implementation clarification
>
> **Clarifies:** `../is-15-git-domain-implementation-specification-v01.md`
>
> **Scope:** PBC-1 implementation correction for coordinated `git.commit`
>
> **Lifecycle:** Temporary integration vehicle; NCR-3 shall fold this delta into IS-15 and retire this clarification.

## 1. Purpose

IS-15 currently defines a four-kind repository operation scope but restricts `CommitGitInput` to one repository and states that Version 1 commit remains single-repository. This clarification removes that implementation restriction while retaining the canonical `git.commit` identity.

## 2. Input Contract Correction

The implementation shall represent commit repository cardinality through the existing Git repository-scope model rather than a dedicated single-repository selector.

The target shape is conceptually:

```ts
export interface CommitGitInput {
  readonly scope: GitRepositoryScopeRequest;
  readonly staging: GitCoordinatedStagingIntent;
  readonly message: GitCoordinatedCommitMessageIntent;
  readonly continuation?: GitContinuationIntent;
}
```

The exact TypeScript decomposition may use repository-specific policy maps or resolvers, but shall support selected-repository, selected-repository-set and all-managed-repositories commit scope without introducing a separate `git.commit-all` descriptor.

## 3. Repository-Specific Commit Plan

IS-15 shall resolve a coordinated input into immutable repository-specific commit plans before the corresponding effects begin. A plan shall bind:

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

This is a semantic illustration, not a requirement to use these exact interface names.

`all_eligible_changes` remains repository-bounded. It shall never become a project-wide filesystem wildcard merely because the coordinated scope contains multiple repositories.

## 4. AI Proposal Resolution

For AI-assisted coordinated commit, IS-15 shall construct a separate purpose-limited IS-10 request from the approved change evidence of each repository requiring a message proposal.

The accepted PR #174 automatic-acceptance rule applies: an authorised Git workflow may automatically accept a valid proposal when deterministic acceptance criteria were resolved before generation.

Implementation shall preserve proposal provenance and distinguish:

```text
provider completion
proposal validation
Git-domain acceptance
repository commit execution
Git-domain postcondition acceptance
final IS-1 application acceptance
```

These stages shall not collapse into one boolean.

The implementation shall not require a presentation round-trip merely to accept every generated message when policy already authorises deterministic automatic acceptance.

## 5. Coordinated Runner

The existing `coordinated-operation-runner` concept shall be reusable for coordinated commit. A separate bulk-commit subsystem is not required.

For each repository plan the runner shall:

1. revalidate material repository/change preconditions;
2. execute exact bounded stage requests if required;
3. verify eligible staged content;
4. resolve/validate the accepted repository-specific message;
5. invoke the IS-6 commit primitive with expected state;
6. inspect resulting revision/status as required;
7. record the completed effect/result before moving to the next repository.

Ordering and continuation shall be explicit policy where application-visible. Implementations may execute independent work concurrently only where doing so preserves deterministic policy, cancellation, diagnostics and truthful effect accounting.

## 6. Failure, Cancellation and Partial Completion

The implementation shall never attempt to simulate universal transactionality by automatically reverting commits already created in earlier repositories.

On failure or cancellation it shall preserve:

- repositories committed successfully;
- repositories skipped/already satisfied;
- repositories failed or stale;
- repositories not yet attempted;
- staging effects that occurred before a later failure where material;
- resulting revisions and recovery information.

IS-15 supplies this Git-domain evidence to IS-1 for canonical final outcome construction.

## 7. Module and Command Surface

The canonical command list remains unchanged at eight Git commands. The existing `commit-repository.ts` implementation concept may be generalised/renamed during implementation to reflect coordinated scope, but source filenames are not semantic contracts.

No `git.commit-all`, `git.bulk-commit` or provider-native bulk command shall be registered.

## 8. NCR Integration

NCR-3 shall integrate these corrections into IS-15, specifically replacing the single-repository `CommitGitInput` restriction and the statement `Version 1 commit remains single-repository`, while reusing the existing scope, coordinated-runner, continuation and result architecture.