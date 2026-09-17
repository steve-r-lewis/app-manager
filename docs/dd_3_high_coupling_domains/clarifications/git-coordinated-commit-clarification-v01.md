# DD-3.2 Coordinated Git Commit Clarification

> **Status:** Active Detailed Design clarification
>
> **Clarifies:** `../dd-3-2-git-domain-detailed-design-v01.md`
>
> **Scope:** PBC-1 extension of `git.commit` to coordinated managed-repository scope
>
> **Lifecycle:** Temporary integration vehicle; NCR-2 shall fold this delta into DD-3.2 and retire this clarification.

## 1. Purpose

DD-3.2 already defines repository operation scopes capable of representing root, selected repository, selected repository set and all managed repositories, and already defines multi-repository continuation/result semantics. This clarification applies those established concepts to commit intent.

The canonical Git operation identity remains `commit`. Coordinated commit is an operation-scope refinement, not a new use case identity.

## 2. Commit Scope

A commit operation may bind to:

```text
selected_repository
selected_repository_set
all_managed_repositories
```

The Git Domain shall resolve that request only against authoritative DD-1.3 managed-project topology and operation scope. It may narrow candidates through commit eligibility but shall not broaden scope through repository discovery.

## 3. Coordinated Commit Intent

For coordinated scope, the Git Domain shall derive a repository-specific commit intent for every eligible repository requiring a commit. Each repository-specific intent shall preserve at least:

```text
managed repository identity
approved change/staging scope
staging policy
fresh repository/change preconditions
commit-message source
accepted repository-specific message
applicable authorization/effect evidence
```

The coordinated intent shall additionally preserve:

```text
resolved repository scope
scope/topology revision
repository ordering where application-visible
continuation policy
cancellation linkage
per-repository intent/result correlation
```

The coordinated operation shall not imply a common commit message, common revision, common staging set or provider-level transaction across repositories.

## 4. Eligibility and Planning

Before initiating commit effects, Git orchestration shall establish sufficient fresh evidence to classify each repository as eligible, ineligible, already satisfied or indeterminate for the requested commit.

Repositories without eligible committable changes shall not receive artificial commits.

Where interactive preview/review is required, the planned repository scope and materially consequential staging/message policy shall be reviewable before execution according to DD-1 invocation/effect policy. Headless execution shall resolve the same semantic information deterministically without prompting.

## 5. Commit-Message Resolution

Commit-message resolution occurs per repository.

An explicit message may be supplied where semantically suitable. Where AI assistance is authorised, the Git Domain may request a bounded AI Capability proposal from approved repository-specific change evidence.

Automatic acceptance is permitted only when the authorised Git workflow has established deterministic acceptance criteria before proposal generation. The generated proposal remains distinguishable from the accepted commit message, and Git-domain policy performs acceptance.

AI availability, provider completion or proposal validity does not establish repository commit success.

## 6. Execution and Continuation

The Git Domain coordinates repository-specific commit executions through DD-2.3 bounded primitives.

After each repository effect, Git orchestration shall preserve known completed effects and resulting repository evidence before proceeding according to continuation policy.

A failure, stale-state decision, cancellation or indeterminate result for one repository shall not erase the truth of commits already completed in other repositories.

Where continuation after individual failure is authorised, later eligible repositories may proceed and failures shall be accumulated. Where fail-fast policy applies, no further repository commit effects shall be initiated after the stopping condition is safely observed.

## 7. Result and Recovery Semantics

The Git-domain result shall preserve per-repository:

- eligibility and planning state;
- staging effects where material;
- accepted commit-message provenance;
- resulting commit/revision evidence;
- skip/already-satisfied reason;
- failure/cancellation/stale-state diagnostics;
- remaining/recovery action.

Coordinated commit shall compose DD-1.2 canonical partial-success semantics and shall not introduce a competing transaction/outcome model.

No universal rollback is promised. Recovery may require a subsequent explicitly authorised Git operation and shall not silently rewrite or discard completed history.

## 8. Authority Preservation

DD-1 retains managed scope, effective configuration, invocation/authorization and final application acceptance. DD-2.3 retains repository facts and bounded primitives. DD-2.7 retains AI execution mechanics. Git Domain retains commit policy, message acceptance, per-repository interpretation and coordinated orchestration.

## 9. NCR Integration

NCR-2 shall integrate this clarification into DD-3.2 by generalising the existing commit contracts from single-repository intent to repository-specific intents within an explicitly coordinated scope, reusing DD-3.2's existing scope, continuation, partial-effect and recovery contracts rather than duplicating them.