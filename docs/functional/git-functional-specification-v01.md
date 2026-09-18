# AppManager Git Functional Specification

> **Status:** Version 1 Functional Specification
>
> **Functional authority:** Observable application-level behaviour for AppManager-managed Git repositories, repository relationships, commits, push, synchronisation, repository initialisation, and deliberately authorised remote-repository deletion.
>
> **Governing authorities:** [Project Documentation Guide](../project-documentation-guide-v01.md), [AppManager Design Specification](../appmanager-design-specification-v01.md)
>
> **Related Functional Specifications:** [application-invocation-functional-specification-v01.md](application-invocation-functional-specification-v01.md), [managed-project-functional-specification-v01.md](managed-project-functional-specification-v01.md), [configuration-functional-specification-v01.md](configuration-functional-specification-v01.md), [source-transformation-functional-specification-v01.md](source-transformation-functional-specification-v01.md), [app-functional-specification-v01.md](app-functional-specification-v01.md)
>
> **Historical planning provenance (non-normative):** [docs/project_management/functional-specification-decomposition-plan-v01.md](../project_management/functional-specification-decomposition-plan-v01.md)

---

## 1. Purpose

This specification defines the observable Version 1 behaviour of the AppManager `git` functional domain.

The `git` domain owns use cases whose primary product identity is source-control and repository management for repositories that form part of an AppManager managed project. It includes repository inspection, repository initialisation, commits, push, synchronisation, managed repository relationships, layer-repository initialisation, and remote-repository deletion where that destructive capability is deliberately enabled.

The governing question is:

> **What repository-management behaviour must AppManager provide for the root application and its managed repositories?**

Git operations may participate in larger workflows coordinated by the Application Engine. A workflow that builds, tests, pushes, releases, or deploys shall retain the functional ownership of each constituent use case rather than collapsing all CI/CD behaviour into `git`.

---

## 2. Scope

This specification owns functional behaviour for:

- inspecting Git/repository state relevant to a managed project;
- resolving Git operation scope over the root repository and managed layer repositories;
- initialising a repository where an approved use case requires it;
- creating commits from approved changes;
- optional AI assistance for commit-message generation without delegating commit authority to AI;
- pushing the root repository;
- pushing a selected managed layer repository;
- pushing a selected repository to one or more applicable remotes;
- pushing all eligible managed repositories as a coordinated operation;
- synchronising the root repository;
- synchronising a selected managed layer repository;
- synchronising selected managed repositories;
- synchronising the complete eligible managed repository set;
- creating managed repository relationships such as submodule relationships where supported;
- initialising Git repositories for eligible managed layers where required;
- deleting remote repositories only through deliberately destructive, strongly authorised behaviour where retained;
- structured outcomes, partial success, diagnostics, safety, and Headless equivalence for Git-domain operations.

---

## 3. Explicitly Out of Scope

This specification does not define:

- Git library choices or command-line invocation strings;
- concrete service methods, TypeScript interfaces, command classes, filenames, or source layout;
- filesystem heuristics such as testing for `.git` or `.gitmodules` as architectural truth;
- concrete remote-provider APIs;
- concrete authentication mechanisms or credential storage;
- arbitrary shell execution;
- application build, preview, post-install, clean, reset, or reinitialisation semantics, which belong to `app`;
- test, lint, type-check, coverage, or quality-gate semantics, which belong to `quality`;
- general CI/CD workflow ownership;
- deployment-provider semantics;
- Nuxt-layer creation, which belongs to `nuxt`;
- source transformation mechanics;
- transport or presentation details;
- exact retry, batching, concurrency, or process topology unless later made functionally observable.

---

## 4. Domain Boundary and Repository Model

### 4.1 Repository operations are managed-project operations

Repository commands consume [Managed Project §§10–14](managed-project-functional-specification-v01.md#_10-repository-relationships); §§5–17 below define operation-specific eligibility and effects.

### 4.2 Repository scope

Version 1 recognises the following functional Git scopes where applicable:

- **root repository** — the repository associated with the managed root application;
- **selected managed repository** — one explicitly selected repository in the managed project topology, including a managed layer repository;
- **selected managed repositories** — an explicitly selected subset of eligible managed repositories;
- **all managed repositories** — the complete eligible repository set for the operation, normally including the root repository and eligible managed layer repositories.

A use case may expose only the scopes that are meaningful and safe for that operation.

### 4.3 Layer identity is not inferred solely from directory location

Repository targeting consumes the topology model in [Managed Project FR-PROJ-019–027](managed-project-functional-specification-v01.md#fr-proj-019). This permits the scopes in §4.2 to address root and layer repository relationships.

### 4.4 CI/CD boundary

CI/CD composition and Git-triggered workflows are governed by FR-GIT-096–100 in §14.

### 4.5 Cross-cutting authority

Invocation, confirmation, cancellation, structured outcomes, and interaction-mode equivalence remain governed by `FR-INV-*`; project/repository identity and managed scope by `FR-PROJ-*`; effective configuration by `FR-CONFIG-*`; and controlled source mutation by `FR-XFORM-*`.

---

## 5. General Git-Domain Requirements

<a id="fr-git-001"></a>

### FR-GIT-001 — Coherent Git semantics
Git invocation paths shall apply [Design §4.6](../appmanager-design-specification-v01.md#_4-6-presentation-independence).

<a id="fr-git-002"></a>

### FR-GIT-002 — Application Engine authority
Git orchestration shall conform to [Design §6.2](../appmanager-design-specification-v01.md#_6-2-application-engine-authority), [Design §11.11](../appmanager-design-specification-v01.md#_11-11-workflow-results-failure-and-acceptance).

<a id="fr-git-003"></a>

### FR-GIT-003 — Repository intent over mechanism
Git repository-management intent shall conform to [Design §5.1](../appmanager-design-specification-v01.md#_5-1-domain-oriented-command-model) and the provider boundary in [Design §6.6](../appmanager-design-specification-v01.md#_6-6-capability-boundaries-and-providers).

<a id="fr-git-004"></a>

### FR-GIT-004 — Valid managed-project context
Consequential repository operations shall apply [Design §9.6](../appmanager-design-specification-v01.md#_9-6-project-discovery-and-context-resolution).

<a id="fr-git-005"></a>

### FR-GIT-005 — Explicit repository scope
Multi-repository Git scope shall apply [Design §9.7](../appmanager-design-specification-v01.md#_9-7-managed-scope-and-operation-targeting).

<a id="fr-git-006"></a>

### FR-GIT-006 — No discovery-based mutation authority
Discovered repositories shall apply [Design §9.9](../appmanager-design-specification-v01.md#_9-9-non-destructive-ownership-and-unmanaged-content).

<a id="fr-git-007"></a>

### FR-GIT-007 — No implicit scope expansion
Repository scope expansion shall apply [FR-PROJ-042](managed-project-functional-specification-v01.md#fr-proj-042).

<a id="fr-git-008"></a>

### FR-GIT-008 — Repository topology awareness
Multi-repository relationship resolution shall apply [Design §9.5](../appmanager-design-specification-v01.md#_9-5-repository-relationships).

<a id="fr-git-009"></a>

### FR-GIT-009 — Eligibility is operation-specific
A repository recognised by AppManager may be eligible for one Git operation and ineligible for another; eligibility shall be resolved per use case.

<a id="fr-git-010"></a>

### FR-GIT-010 — Unmanaged repository protection
Unmanaged repositories shall apply [Design §9.9](../appmanager-design-specification-v01.md#_9-9-non-destructive-ownership-and-unmanaged-content).

<a id="fr-git-011"></a>

### FR-GIT-011 — Effective configuration
Configurable Git behaviour shall apply [FR-CONFIG-020](configuration-functional-specification-v01.md#fr-config-020).

<a id="fr-git-012"></a>

### FR-GIT-012 — Provider delegation is subordinate
Git, hosting, credential and AI provider delegation shall conform to [Design §6.2](../appmanager-design-specification-v01.md#_6-2-application-engine-authority), [Design §11.11](../appmanager-design-specification-v01.md#_11-11-workflow-results-failure-and-acceptance).

<a id="fr-git-013"></a>

### FR-GIT-013 — Lower-level success is not automatically Git-use-case success
Delegated Git/provider completion shall apply [FR-INV-034](application-invocation-functional-specification-v01.md#fr-inv-034).

<a id="fr-git-014"></a>

### FR-GIT-014 — Structured diagnostics
Git-domain failures shall identify the affected repository or repository relationship and the functional stage that failed where that distinction is material.

---

## 6. Repository Inspection and Git Configuration

<a id="fr-git-015"></a>

### FR-GIT-015 — Repository inspection
AppManager shall provide Git-domain inspection sufficient to expose relevant repository state for approved use cases without mutating the repository.

<a id="fr-git-016"></a>

### FR-GIT-016 — Git configuration inspection
AppManager shall support inspection of Git configuration relevant to the selected managed repository or repository scope where retained as a user-facing use case.

<a id="fr-git-017"></a>

### FR-GIT-017 — Inspection is non-authorising
Repository configuration inspection shall apply [Design §9.9](../appmanager-design-specification-v01.md#_9-9-non-destructive-ownership-and-unmanaged-content).

<a id="fr-git-018"></a>

### FR-GIT-018 — Repository identity in results
Inspection results shall identify the managed repository to which reported state applies sufficiently to avoid root/layer ambiguity.

<a id="fr-git-019"></a>

### FR-GIT-019 — Sensitive-value minimisation
Git configuration inspection results shall apply [FR-INV-040](application-invocation-functional-specification-v01.md#fr-inv-040).

<a id="fr-git-020"></a>

### FR-GIT-020 — Repository-state distinctions
Where relevant, AppManager shall distinguish repository states such as clean/changed, ahead/behind/diverged, missing upstream, unresolved conflict, or unavailable remote rather than reducing all non-clean states to a single generic condition.

---

## 7. Repository Initialisation

<a id="fr-git-021"></a>

### FR-GIT-021 — Repository initialisation use case
AppManager shall support initialising an eligible managed project resource as a Git repository where required by an approved use case.

<a id="fr-git-022"></a>

### FR-GIT-022 — Existing repository protection
Repository initialisation shall not silently replace or reinitialise an already recognised repository in a manner that risks changing its identity or history.

<a id="fr-git-023"></a>

### FR-GIT-023 — Scope-specific initialisation
The target of repository initialisation shall be explicit and shall not implicitly initialise neighbouring layers or directories.

<a id="fr-git-024"></a>

### FR-GIT-024 — Configuration-driven defaults
Where repository initialisation depends on identity, default branch, or similar configurable choices, those values shall follow effective configuration and explicit invocation semantics.

<a id="fr-git-025"></a>

### FR-GIT-025 — Initialisation result
The result shall identify the repository initialised and any consequential follow-on state or remaining action.

<a id="fr-git-026"></a>

### FR-GIT-026 — Root creation delegation
When `app` root-application creation requests repository initialisation, Git semantics remain governed by this specification even though the higher-level workflow is owned by `app`.

---

## 8. Commit

<a id="fr-git-027"></a>

### FR-GIT-027 — Commit use case
AppManager shall provide `git.commit` for creating commits in eligible managed repositories within the scope defined by FR-GIT-028.

<a id="fr-git-028"></a>

### FR-GIT-028 — Commit target
A commit invocation shall operate on an explicitly resolved selected repository, selected managed-repository set or all-managed-repositories scope where requested and supported. Each repository commit remains independently identified and evaluated.

<a id="fr-git-029"></a>

### FR-GIT-029 — Commit requires committable change
AppManager shall determine whether the selected repository contains changes eligible for the requested commit and shall not report a successful new commit when no commit was created.

<a id="fr-git-030"></a>

### FR-GIT-030 — Staging semantics must be explicit
Whether AppManager commits already-staged changes, stages a selected change set, or stages all eligible changes shall be explicit in the use case and shall not be hidden implementation behaviour.

<a id="fr-git-031"></a>

### FR-GIT-031 — No unrelated staging
A commit use case shall not silently stage changes outside the approved repository/change scope.

<a id="fr-git-032"></a>

### FR-GIT-032 — Commit message required
A commit shall have an application-accepted commit message obtained from explicit input, approved generation, or another approved source.

<a id="fr-git-033"></a>

### FR-GIT-033 — Manual commit-message path
Commit creation shall remain possible without AI assistance when all other requirements are satisfied.

<a id="fr-git-034"></a>

### FR-GIT-034 — Optional AI assistance
AppManager may offer AI-assisted commit-message generation when an eligible AI capability is available.

<a id="fr-git-035"></a>

### FR-GIT-035 — AI availability handling
Absence or failure of an AI provider shall not make ordinary manual commit creation unavailable.

<a id="fr-git-036"></a>

### FR-GIT-036 — AI input minimisation
Context supplied for AI commit-message assistance shall be bounded and sanitised according to applicable AI, security, and configuration policy.

<a id="fr-git-037"></a>

### FR-GIT-037 — AI output is non-authoritative
Generated commit messages shall apply [Design §11.10](../appmanager-design-specification-v01.md#_11-10-ai-assisted-workflow).

<a id="fr-git-038"></a>

### FR-GIT-038 — Generated-message reviewability
Where AI-generated commit messages are presented to a human caller, the caller shall be able to accept or revise the proposed message before the commit is created unless an explicitly authorised automation policy defines otherwise.

<a id="fr-git-039"></a>

### FR-GIT-039 — Commit outcome
The structured result shall distinguish commit success, cancellation, no eligible changes, staging failure, message-resolution failure, and commit failure where applicable.

---

### 8.1 Coordinated Commit

One invocation may prepare independent commits for the requested repositories. Each repository retains its own eligibility, staging policy, message, current-state preconditions and resulting revision/effect evidence. The requirements below bind coordination to the existing commit contract rather than introduce a cross-repository transaction.

<a id="pbc-fr-git-commit-001"></a>

### PBC-FR-GIT-COMMIT-001 — Canonical identity
Coordinated commit shall use canonical `git.commit`; repository cardinality shall be expressed as structured scope rather than separate `commit-all` or bulk command identities.

<a id="pbc-fr-git-commit-002"></a>

### PBC-FR-GIT-COMMIT-002 — Explicit scope
Coordinated commit scope resolution shall apply [FR-GIT-028](git-functional-specification-v01.md#fr-git-028), [Design §9.7](../appmanager-design-specification-v01.md#_9-7-managed-scope-and-operation-targeting).

<a id="pbc-fr-git-commit-003"></a>

### PBC-FR-GIT-COMMIT-003 — Per-repository eligibility
Each repository in coordinated commit scope shall apply [FR-GIT-009](git-functional-specification-v01.md#fr-git-009), [FR-GIT-029](git-functional-specification-v01.md#fr-git-029).

<a id="pbc-fr-git-commit-004"></a>

### PBC-FR-GIT-COMMIT-004 — Per-repository staging scope
Each repository staging/change scope shall apply [FR-GIT-030](git-functional-specification-v01.md#fr-git-030), [FR-GIT-031](git-functional-specification-v01.md#fr-git-031).

<a id="pbc-fr-git-commit-005"></a>

### PBC-FR-GIT-COMMIT-005 — Per-repository message
Each repository requiring a commit shall receive an application-accepted commit message appropriate to that repository's bounded approved changes. AppManager shall not require one identical message for the entire coordinated set.

<a id="pbc-fr-git-commit-006"></a>

### PBC-FR-GIT-COMMIT-006 — No fabricated commits
A repository with no eligible committable changes shall be reported as skipped, already satisfied or otherwise appropriately classified; AppManager shall not create an empty/fabricated commit solely for coordinated-set uniformity.

<a id="pbc-fr-git-commit-007"></a>

### PBC-FR-GIT-COMMIT-007 — AI proposal independence
Where AI-assisted message generation is authorised, AppManager may request a separate bounded proposal for each repository using only context approved for that repository/use case.

<a id="pbc-fr-git-commit-008"></a>

### PBC-FR-GIT-COMMIT-008 — Automatic acceptance
Automatic Git commit-message acceptance shall apply [Design §11.10](../appmanager-design-specification-v01.md#_11-10-ai-assisted-workflow). Git shall establish deterministic message validation/acceptance criteria before generation.

<a id="pbc-fr-git-commit-009"></a>

### PBC-FR-GIT-COMMIT-009 — Manual path preserved
Manual coordinated-commit messages shall apply [FR-GIT-033](git-functional-specification-v01.md#fr-git-033), [FR-GIT-035](git-functional-specification-v01.md#fr-git-035).

<a id="pbc-fr-git-commit-010"></a>

### PBC-FR-GIT-COMMIT-010 — Continuation policy
Whether coordinated commit continues after one repository fails, becomes stale or is otherwise blocked shall follow explicit Git-domain continuation policy.

<a id="pbc-fr-git-commit-011"></a>

### PBC-FR-GIT-COMMIT-011 — Truthful partial completion
Completed coordinated commits shall apply [FR-INV-036](application-invocation-functional-specification-v01.md#fr-inv-036), [FR-INV-045](application-invocation-functional-specification-v01.md#fr-inv-045), [FR-GIT-039](git-functional-specification-v01.md#fr-git-039). Results shall retain per-repository revision and effect evidence.

<a id="pbc-fr-git-commit-012"></a>

### PBC-FR-GIT-COMMIT-012 — No false transactionality
Coordinated commit atomicity/rollback claims shall apply [FR-INV-046](application-invocation-functional-specification-v01.md#fr-inv-046). The invocation is not one provider-level transaction.

<a id="pbc-fr-git-commit-013"></a>

### PBC-FR-GIT-COMMIT-013 — Headless determinism
Headless commit scope, staging, message and continuation policy shall apply [FR-INV-020](application-invocation-functional-specification-v01.md#fr-inv-020), [FR-INV-022](application-invocation-functional-specification-v01.md#fr-inv-022).

<a id="pbc-fr-git-commit-014"></a>

### PBC-FR-GIT-COMMIT-014 — Interaction equivalence
Coordinated commit across TUI, GUI and Headless shall apply [Design §4.6](../appmanager-design-specification-v01.md#_4-6-presentation-independence).

---

## 9. Push

### 9.1 Purpose

Push transfers committed repository history from an eligible managed repository to an explicitly applicable remote. Push scope is distinct from repository discovery scope.

<a id="fr-git-040"></a>

### FR-GIT-040 — Push use case
AppManager shall provide a Git-domain use case for pushing an eligible managed repository.

<a id="fr-git-041"></a>

### FR-GIT-041 — Root-repository push
AppManager shall support pushing the managed root repository independently of managed layer repositories.

<a id="fr-git-042"></a>

### FR-GIT-042 — Selected-layer push
AppManager shall support pushing an explicitly selected managed layer repository independently where that layer has an eligible repository.

<a id="fr-git-043"></a>

### FR-GIT-043 — Selected-repository push
The same repository-scoped push semantics shall apply to any explicitly selected eligible managed repository without requiring a separate implementation philosophy for root and layer repositories.

<a id="fr-git-044"></a>

### FR-GIT-044 — Remote resolution
Where a repository has multiple applicable remotes, AppManager shall resolve or require selection of the intended remote set rather than silently choosing an ambiguous remote.

<a id="fr-git-045"></a>

### FR-GIT-045 — Headless remote determinism
Headless push remote selection shall apply [FR-INV-020](application-invocation-functional-specification-v01.md#fr-inv-020).

<a id="fr-git-046"></a>

### FR-GIT-046 — Push eligibility
AppManager shall determine whether the selected repository and remote relationship are eligible for push before claiming that push can proceed.

<a id="fr-git-047"></a>

### FR-GIT-047 — Nothing-to-push behaviour
Where the selected repository has no history requiring push under the use case, AppManager may report it as already up to date rather than treating the condition as an opaque failure.

<a id="fr-git-048"></a>

### FR-GIT-048 — Push does not imply build or quality validation
A Git push operation shall not silently acquire `app` build or `quality` validation semantics. Such steps require an explicitly composed workflow or policy.

<a id="fr-git-049"></a>

### FR-GIT-049 — Push result
The structured result shall identify the repository, applicable remote(s), and success/failure sufficiently for callers to distinguish repository-level outcomes.

---

### 9.2 Coordinated Push

One invocation may push the root repository, a selected layer, a selected set, or all eligible managed repositories. Repository cardinality is structured scope on the single push use case, not a separate command; the requirements below bind coordination to the existing push contract rather than introduce a cross-repository transaction. This mirrors [8.1 Coordinated Commit](#_8-1-coordinated-commit).

<a id="fr-git-050"></a>

### FR-GIT-050 — Canonical identity and coordinated scope
Coordinated push shall use canonical `git.push`; repository cardinality — root, a selected layer, a selected set, or all eligible managed repositories — shall be expressed as structured scope per [FR-GIT-041](#fr-git-041)–[FR-GIT-043](#fr-git-043), not a separate `push-all` command identity.

<a id="fr-git-051"></a>

### FR-GIT-051 — Topology-driven scope
All-eligible-repositories push scope shall apply [FR-GIT-008](#fr-git-008) and resolved project topology; it shall not be determined by a hard-coded directory scan.

<a id="fr-git-052"></a>

### FR-GIT-052 — Per-repository eligibility
Each repository in coordinated push scope shall apply [FR-GIT-046](#fr-git-046), [FR-GIT-047](#fr-git-047).

<a id="fr-git-053"></a>

### FR-GIT-053 — Scope visibility
Before a consequential interactive coordinated push, the intended repository scope shall be reviewable where required by invocation policy.

<a id="fr-git-054"></a>

### FR-GIT-054 — Headless determinism
Headless coordinated push shall apply [FR-INV-020](application-invocation-functional-specification-v01.md#fr-inv-020); the request shall identify its scope unambiguously.

<a id="fr-git-055"></a>

### FR-GIT-055 — Per-repository outcome isolation
Per-repository push results shall apply [FR-INV-036](application-invocation-functional-specification-v01.md#fr-inv-036), [FR-INV-045](application-invocation-functional-specification-v01.md#fr-inv-045).

<a id="fr-git-056"></a>

### FR-GIT-056 — Continuation policy
Whether coordinated push continues after an individual repository failure shall be explicit Git-domain continuation policy; where continuation is supported, failures shall be accumulated and reported.

<a id="fr-git-057"></a>

### FR-GIT-057 — Partial-success result
Coordinated push results shall apply [FR-INV-036](application-invocation-functional-specification-v01.md#fr-inv-036).

<a id="fr-git-058"></a>

### FR-GIT-058 — No false transactionality
Coordinated push atomicity/rollback claims shall apply [FR-INV-046](application-invocation-functional-specification-v01.md#fr-inv-046). The invocation is not one provider-level transaction.

---

## 10. Synchronisation

### 11.1 Purpose

Synchronisation updates local managed repository state from its configured repository relationships according to an explicit scope. Synchronisation is distinct from push and from application dependency/build initialisation.

<a id="fr-git-059"></a>

### FR-GIT-059 — Synchronisation use case
AppManager shall provide Git-domain synchronisation for eligible managed repositories.

<a id="fr-git-060"></a>

### FR-GIT-060 — Root-only synchronisation
AppManager shall support synchronising the root repository without implicitly synchronising every managed layer repository.

<a id="fr-git-061"></a>

### FR-GIT-061 — Selected-layer synchronisation
AppManager shall support synchronising an explicitly selected managed layer repository independently where eligible.

<a id="fr-git-062"></a>

### FR-GIT-062 — Selected-repository synchronisation
AppManager shall support synchronising an explicitly selected eligible managed repository using the same repository-scoped semantics regardless of whether it is the root or a layer.

<a id="fr-git-063"></a>

### FR-GIT-063 — Selected-set synchronisation
Where supported, AppManager shall allow an explicitly selected subset of eligible managed repositories to be synchronised as one coordinated invocation.

<a id="fr-git-064"></a>

### FR-GIT-064 — All-managed-repositories synchronisation
AppManager shall support synchronising the complete eligible managed repository set where that scope is requested.

<a id="fr-git-065"></a>

### FR-GIT-065 — Scope is not inferred from current directory alone
Synchronisation invoked from a filesystem location shall apply [FR-PROJ-005](managed-project-functional-specification-v01.md#fr-proj-005).

<a id="fr-git-066"></a>

### FR-GIT-066 — No implicit global default where ambiguous
If the caller's synchronisation intent could validly mean root-only, selected repository, selected set, or all repositories and cannot be deterministically resolved, AppManager shall require disambiguation or fail safely rather than silently choosing the broadest scope.

<a id="fr-git-067"></a>

### FR-GIT-067 — Headless synchronisation determinism
Headless synchronisation scope shall apply [FR-INV-020](application-invocation-functional-specification-v01.md#fr-inv-020).

<a id="fr-git-068"></a>

### FR-GIT-068 — Divergence/conflict handling
Where synchronisation encounters divergence, conflicts, missing upstream state, authentication failure, or other conditions requiring policy or user decisions, AppManager shall expose the condition rather than silently discarding or overwriting local work.

<a id="fr-git-069"></a>

### FR-GIT-069 — Local-change preservation
Synchronisation shall not intentionally discard uncommitted or committed local work unless a separately defined destructive use case explicitly authorises that effect.

<a id="fr-git-070"></a>

### FR-GIT-070 — Relationship-aware synchronisation
Where repository relationships require coordinated update behaviour, AppManager shall respect those relationships while retaining explicit scope and reporting each materially affected repository.

<a id="fr-git-071"></a>

### FR-GIT-071 — Multi-repository partial success
A coordinated synchronisation shall report per-repository success, failure, skip, conflict, and cancellation states sufficiently to represent partial completion.

<a id="fr-git-072"></a>

### FR-GIT-072 — No false rollback guarantee
Coordinated synchronisation rollback claims shall apply [FR-INV-046](application-invocation-functional-specification-v01.md#fr-inv-046).

<a id="fr-git-073"></a>

### FR-GIT-073 — Drift diagnostics
Where a deliberately narrower synchronisation scope can leave related managed repositories at mutually inconsistent revisions, AppManager should expose a diagnostic or warning when the relationship model makes that risk knowable.

---

## 11. Managed Repository Relationships

### 12.1 Purpose

AppManager may establish repository relationships, including submodule-style relationships where supported, so independently managed repositories can participate coherently in the managed project.

<a id="fr-git-074"></a>

### FR-GIT-074 — Add managed repository relationship
AppManager shall support establishing an approved repository relationship between the root project and an eligible managed repository where the project model requires such a relationship.

<a id="fr-git-075"></a>

### FR-GIT-075 — Relationship candidates require eligibility
A discovered layer or repository shall not become a relationship candidate merely because it occupies a conventional directory; AppManager shall validate its managed identity, repository state, and required remote/provider information.

<a id="fr-git-076"></a>

### FR-GIT-076 — Existing relationship protection
AppManager shall not duplicate a repository relationship that is already represented in the managed project.

<a id="fr-git-077"></a>

### FR-GIT-077 — Tracked-content conflict protection
Where establishing a repository relationship would conflict with content already owned or tracked under another repository model, AppManager shall refuse or require an explicitly defined migration workflow rather than corrupting repository ownership.

<a id="fr-git-078"></a>

### FR-GIT-078 — Remote identity requirement
Where the relationship mechanism requires a remote repository identity, AppManager shall require that identity to be valid and unambiguous before establishing the relationship.

<a id="fr-git-079"></a>

### FR-GIT-079 — Explicit selection
When multiple eligible relationship candidates exist, AppManager shall require explicit selection or an unambiguous Headless scope.

<a id="fr-git-080"></a>

### FR-GIT-080 — Relationship changes are consequential
Creating or changing repository relationships shall follow applicable confirmation, preview, managed-scope, and structured-outcome semantics.

<a id="fr-git-081"></a>

### FR-GIT-081 — Relationship outcome
The result shall identify relationships created, skipped, already existing, failed, or left requiring a subsequent commit or other user action.

---

## 12. Initialise Layer Repositories

<a id="fr-git-082"></a>

### FR-GIT-082 — Layer-repository initialisation use case
AppManager shall support initialising repositories for managed layers that legitimately require independent Git repositories and do not already have them.

<a id="fr-git-083"></a>

### FR-GIT-083 — Nuxt creation relationship
Repository initialisation requested by layer creation shall apply [FR-NUXT-065](nuxt-functional-specification-v01.md#fr-nuxt-065), [FR-NUXT-067](nuxt-functional-specification-v01.md#fr-nuxt-067).

<a id="fr-git-084"></a>

### FR-GIT-084 — Existing layer repository preservation
Existing layer repositories shall apply [FR-GIT-022](git-functional-specification-v01.md#fr-git-022). Valid repositories shall be excluded unless an explicit repair/migration use case applies.

<a id="fr-git-085"></a>

### FR-GIT-085 — Selected or all eligible layers
The use case may operate on one selected eligible layer or a reviewed set of eligible layers, but shall not initialise arbitrary directories outside managed scope.

<a id="fr-git-086"></a>

### FR-GIT-086 — Multi-layer partial outcomes
Where multiple layer repositories are initialised in one invocation, AppManager shall report per-layer outcomes and represent partial success where applicable.

---

## 13. Remote Repository Deletion

### 14.1 Purpose

Remote repository deletion is an exceptional destructive capability and, where enabled in Version 1, requires stronger safety controls than ordinary Git operations.

<a id="fr-git-087"></a>

### FR-GIT-087 — Explicitly retained destructive capability
If remote-repository deletion is enabled in Version 1, it shall exist only as a deliberately destructive Git-domain use case with stronger safety controls than ordinary repository operations.

<a id="fr-git-088"></a>

### FR-GIT-088 — Exact remote target identity
Before deletion is authorised, AppManager shall establish the exact repository-hosting target identity, including the owning account/organisation and repository identity where applicable.

<a id="fr-git-089"></a>

### FR-GIT-089 — No guessed owner
AppManager shall not guess a remote owner, organisation, or account for repository deletion from a hard-coded personal fallback or unrelated local context.

<a id="fr-git-090"></a>

### FR-GIT-090 — No Headless prompting exception
Headless remote deletion with unresolved target identity shall apply [FR-INV-020](application-invocation-functional-specification-v01.md#fr-inv-020).

<a id="fr-git-091"></a>

### FR-GIT-091 — Strong explicit authorisation
Remote-repository deletion shall require explicit authorisation that is materially stronger than ordinary confirmation and suitable for non-interactive invocation.

<a id="fr-git-092"></a>

### FR-GIT-092 — Authorisation bound to target
Deletion authorisation shall be associated with the resolved target sufficiently to reduce the risk that confirmation intended for one repository is applied to another.

<a id="fr-git-093"></a>

### FR-GIT-093 — Provider-side deletion is not inferred from local removal
Removing a local remote reference, local repository, or managed-project relationship shall not be treated as equivalent to deleting a repository from a remote hosting provider.

<a id="fr-git-094"></a>

### FR-GIT-094 — Remote deletion result
The result shall identify the exact remote repository targeted and whether deletion succeeded, was cancelled/refused, was unavailable, or failed.

<a id="fr-git-095"></a>

### FR-GIT-095 — No automatic cascading deletion
Deleting one remote repository shall not implicitly delete related layer repositories, root repositories, local repositories, or repository relationships unless a separately defined destructive workflow explicitly authorises each effect.

---

## 14. CI/CD, Automation, and Workflow Composition

<a id="fr-git-096"></a>

### FR-GIT-096 — Git operations are automation-capable
Git operations invoked by Headless callers and automation shall apply [FR-INV-020](application-invocation-functional-specification-v01.md#fr-inv-020).

<a id="fr-git-097"></a>

### FR-GIT-097 — Git does not own complete CI/CD semantics
The `git` domain shall not redefine application build, quality validation, release packaging, or deployment as Git behaviours merely because they execute in a Git-triggered automation environment.

<a id="fr-git-098"></a>

### FR-GIT-098 — Workflow composition preserves ownership
Composed App, Quality, Git and other domain workflows shall conform to [Design §6.2](../appmanager-design-specification-v01.md#_6-2-application-engine-authority), [Design §11.11](../appmanager-design-specification-v01.md#_11-11-workflow-results-failure-and-acceptance).

<a id="fr-git-099"></a>

### FR-GIT-099 — Push is not deployment
A successful repository push shall not be represented as successful application deployment unless a separately governed deployment workflow establishes that outcome.

<a id="fr-git-100"></a>

### FR-GIT-100 — CI-triggered Git operation equivalence
CI/CD Git invocations shall apply [Design §4.6](../appmanager-design-specification-v01.md#_4-6-presentation-independence).

---

## 15. Safety, Failure, and Multi-Repository Behaviour

<a id="fr-git-101"></a>

### FR-GIT-101 — Consequence classification
Git operations shall be classified sufficiently to apply appropriate confirmation and authorisation policy to ordinary, consequential, and destructive behaviours.

<a id="fr-git-102"></a>

### FR-GIT-102 — Repository-specific diagnostics
Multi-repository diagnostics shall apply [FR-GIT-014](git-functional-specification-v01.md#fr-git-014).

<a id="fr-git-103"></a>

### FR-GIT-103 — Preserve completed truth
Completed effects of multi-repository operations shall apply [FR-INV-036](application-invocation-functional-specification-v01.md#fr-inv-036), [FR-INV-045](application-invocation-functional-specification-v01.md#fr-inv-045).

<a id="fr-git-104"></a>

### FR-GIT-104 — Cancellation before next effect
Where cancellation is supported during a multi-repository operation, AppManager shall stop initiating further consequential repository effects as soon as cancellation is safely observed.

<a id="fr-git-105"></a>

### FR-GIT-105 — Cancellation does not undo completed remote effects
Completed commits, pushes, synchronisations, relationships and remote deletions shall apply [FR-INV-032](application-invocation-functional-specification-v01.md#fr-inv-032).

<a id="fr-git-106"></a>

### FR-GIT-106 — Authentication failures
Authentication or authorisation failures from a Git or hosting provider shall be surfaced as repository/provider access failures rather than misclassified as project absence or unknown command behaviour.

<a id="fr-git-107"></a>

### FR-GIT-107 — Remote unavailability
Network or remote-provider unavailability shall not cause AppManager to fabricate successful synchronisation, push, or remote mutation outcomes.

<a id="fr-git-108"></a>

### FR-GIT-108 — Concurrent/stale state
Where repository state materially changes between inspection/planning and consequential execution, AppManager shall fail, revalidate, or otherwise handle the stale state deliberately rather than blindly applying an invalid prior assumption.

<a id="fr-git-109"></a>

### FR-GIT-109 — No silent destructive conflict resolution
AppManager shall not silently resolve merge conflicts, discard local changes, force-push rewritten history, or perform equivalent destructive conflict resolution unless a separately specified and explicitly authorised use case requires it.

<a id="fr-git-110"></a>

### FR-GIT-110 — Force semantics require explicit specification
A lower-level implementation flag named `force` shall not by itself define application semantics. Any Version 1 behaviour that bypasses confirmation, rewrites history, overrides conflicts, or broadens effects must be explicitly specified and authorised at the appropriate functional level.

---

## 16. Interaction-Mode Equivalence

<a id="fr-git-111"></a>

### FR-GIT-111 — TUI/Headless semantic equivalence
Interactive and Headless Git operations shall apply [Design §4.6](../appmanager-design-specification-v01.md#_4-6-presentation-independence).

<a id="fr-git-112"></a>

### FR-GIT-112 — Interactive selection is presentation
Menus for choosing repositories, layers, remotes, or relationship candidates are presentation mechanisms and shall not become the only way to express the underlying Git intent.

<a id="fr-git-113"></a>

### FR-GIT-113 — Headless missing information
Missing repository, remote, scope or destructive-authorisation inputs shall apply [FR-INV-020](application-invocation-functional-specification-v01.md#fr-inv-020).

<a id="fr-git-114"></a>

### FR-GIT-114 — Machine-consumable multi-repository results
Per-repository results of coordinated Git operations shall apply [FR-INV-021](application-invocation-functional-specification-v01.md#fr-inv-021).

---

## 17. Traceability Summary

| Requirement range | Functional concern | Upstream / same-level authority | Downstream refinement destination |
|---|---|---|---|
| `FR-GIT-001`–`014` | General Git authority, topology, scope | This specification; Root Design; Managed Project; Invocation | Owning domain/shared-contract Detailed Design |
| `FR-GIT-015`–`020` | Inspection/configuration | This specification; Managed Project | Repository Capability |
| `FR-GIT-021`–`026` | Repository initialisation | This specification; App Functional Specification §14 | Repository Capability |
| `FR-GIT-027`–`039` | Commit and optional AI assistance | This specification; Invocation | Repository Capability; AI capability boundary |
| `FR-GIT-040`–`049` | Root/selected repository push | This specification; Managed Project | Repository Capability |
| `FR-GIT-050`–`058` | Coordinated push (§9.2) | This specification; Managed Project topology | Repository Capability |
| `FR-GIT-059`–`073` | Scoped synchronisation | This specification; Managed Project | Repository Capability |
| `FR-GIT-074`–`081` | Managed repository relationships | This specification; Managed Project | Repository Capability |
| `FR-GIT-082`–`086` | Layer repository initialisation | This specification | Nuxt boundary; Repository Capability |
| `FR-GIT-087`–`095` | Remote deletion | This specification; Invocation safety | Repository Capability/provider boundary |
| `FR-GIT-096`–`100` | CI/CD and automation boundary | This specification; Root Design; App Functional Specification | Quality boundary |
| `FR-GIT-101`–`114` | Safety, partial success, modes | This specification; Invocation; Managed Project; Configuration | Repository Capability |
| `PBC-FR-GIT-COMMIT-001`–`014` | Coordinated commit | This specification §8.1; Managed Project; AI generated-output acceptance | Git domain and Repository/AI capabilities |

Detailed Design shall extend traceability downward to permanent repository contracts and provider boundaries without changing these functional ownership decisions.

---

## 18. Conformance Summary

Conformance is assessed against the applicable requirement bodies in this specification and the canonical contracts they reference. The traceability section identifies the requirement groups; this section creates no additional acceptance checklist.

---

## 19. Version 1 Functional Baseline

This document is the Version 1 Functional owner for its stated concern. Its requirement identities remain stable under the [Project Documentation Guide](../project-documentation-guide-v01.md#_9-traceability).
