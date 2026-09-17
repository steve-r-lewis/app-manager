# AppManager Version 1 Coordinated Git Commit Clarification

> **Status:** Active Design clarification
>
> **Scope:** PBC-1 correction of coordinated Git commit semantics before NCR
>
> **Lifecycle:** Temporary integration vehicle; NCR-1 shall fold this Design delta into the canonical Design owner and retire this clarification.

## 1. Purpose

The Version 1 Git command model retains the single canonical `git.commit` identity but extends its repository scope so AppManager can deliberately commit changes across a selected managed-repository set or the complete eligible managed-repository set.

This correction reflects AppManager's root-application-plus-managed-layers product model and the already accepted requirement for Headless/bulk workflows in which commit-message proposals may be generated and accepted automatically under pre-resolved owning-domain policy.

The governing rule is:

> **Coordinated commit is one Git-domain application intent over an explicit managed-repository scope, realised as independently truthful repository commits; it is not one cross-repository Git transaction and does not create a second `commit-all` command.**

## 2. Canonical Command Identity

The Version 1 Git command surface remains eight commands. No command is added or removed.

`git.commit` remains the canonical commit identity. Repository cardinality is structured operation scope rather than command identity.

Applicable commit scopes are:

```text
selected_repository
selected_repository_set
all_managed_repositories
```

A coordinated commit shall never silently broaden a single-repository request into a selected set or all-managed-repositories scope.

## 3. Per-Repository Commit Semantics

For every repository in resolved coordinated scope, Git-domain policy shall independently determine:

- operation eligibility;
- approved change/staging scope;
- fresh repository/change preconditions;
- commit-message source;
- accepted commit message;
- whether a commit is required, already satisfied, skipped, blocked or indeterminate;
- resulting repository revision and effect evidence.

A coordinated invocation does not imply that every repository receives the same commit message. Commit messages shall describe the bounded changes of the repository to which each commit applies.

Repositories with no eligible committable changes shall not receive fabricated or empty commits merely to make the coordinated set appear uniform.

## 4. AI-Assisted Automatic Acceptance

The AI Capability may generate a bounded commit-message proposal independently for each eligible repository where the invocation and effective Git policy permit AI assistance.

Generated text remains non-authoritative proposal data. The Git Domain may automatically accept a proposal without per-message human confirmation only when the authorised owning workflow established deterministic validation and acceptance criteria before generation.

The AI provider shall not:

- select or broaden repository scope;
- select unrelated changes for staging;
- accept or authorise its own proposal;
- decide whether a repository commit is application-successful;
- invoke repository mutation directly.

Interactive policy may instead require review or revision before acceptance. Manual explicit commit messages remain supported independently of AI availability.

## 5. Partial Effects and Continuation

Coordinated commit is not universally atomic or rollback-capable.

If commits have been created successfully in repositories A and B and repository C subsequently fails, the commits in A and B remain completed effects. AppManager shall preserve and report that truth.

Continuation after an individual repository failure shall follow explicit Git-domain continuation policy. Cancellation shall stop initiation of further consequential effects as soon as safely observed but shall not imply rollback of commits already created.

The coordinated result shall preserve per-repository outcomes and support canonical partial-success semantics through the Application Engine.

## 6. Authority Boundaries

This correction does not alter established authority:

- DD-1 owns managed scope, effective configuration, invocation/authorization, canonical outcomes and final Application Engine acceptance;
- Git Domain owns commit intent, operation-specific eligibility, staging/change policy, message acceptance, continuation and coordinated repository orchestration;
- Repository Capability owns bounded repository facts and already-authorised repository primitives;
- AI Capability supplies bounded proposal generation only.

Provider commands, filesystem discovery and repository reachability do not create application authority.

## 7. Catalogue Impact

Git remains **8 canonical commands** and the complete Version 1 AppManager catalogue remains **96 canonical commands**.

No `git.commit-all`, `git.bulk-commit` or equivalent competing command identity is introduced.

## 8. NCR Integration

NCR-1 shall integrate this Design/Functional correction into the canonical Design and Functional owners. NCR-2 shall integrate the DD-3.2 delta. NCR-3 shall integrate the IS-15 delta. The temporary clarification vehicles shall then be retired under the established clarification lifecycle rule.