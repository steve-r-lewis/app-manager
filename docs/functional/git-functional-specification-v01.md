# AppManager Git Functional Specification

> **Status:** Version 1 Functional Specification
>
> **Functional authority:** Observable application-level behaviour for AppManager-managed Git repositories, repository relationships, commits, push, synchronisation, repository initialisation, and deliberately authorised remote-repository deletion.
>
> **Governing authorities:** [Project Documentation Guide](../project-documentation-guide-v01.md), [AppManager Design Specification](../appmanager-design-specification-v01.md)
>
> **Related Functional Specifications:** [application-invocation-functional-specification-v01.md](application-invocation-functional-specification-v01.md), [managed-project-functional-specification-v01.md](managed-project-functional-specification-v01.md), [configuration-functional-specification-v01.md](configuration-functional-specification-v01.md), [source-transformation-functional-specification-v01.md](source-transformation-functional-specification-v01.md), [app-functional-specification-v01.md](app-functional-specification-v01.md)
>
> **Planning source:** [docs/project_management/functional-specification-decomposition-plan-v01.md](../project_management/functional-specification-decomposition-plan-v01.md)

---

## 1. Purpose

This specification defines the observable Version 1 behaviour of the AppManager `git` functional domain.

The `git` domain owns use cases whose primary product identity is source-control and repository management for repositories that form part of an AppManager managed project. It includes repository inspection, repository initialisation, commits, push, synchronisation, managed repository relationships, layer-repository initialisation, and remote-repository deletion where that destructive capability is deliberately enabled.

The governing question is:

> **What repository-management behaviour must AppManager provide for the root application and its managed repositories?**

The central boundary is:

> **The `git` domain owns repository intent and repository-scope semantics. It does not own application build/test/deployment semantics merely because those activities may occur in CI/CD or be triggered by Git events.**

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

Git behaviour shall consume the managed-project context and repository topology defined by `FR-PROJ-*`. Filesystem discovery alone shall not determine repository authority.

### 4.2 Repository scope

Version 1 recognises the following functional Git scopes where applicable:

- **root repository** — the repository associated with the managed root application;
- **selected managed repository** — one explicitly selected repository in the managed project topology, including a managed layer repository;
- **selected managed repositories** — an explicitly selected subset of eligible managed repositories;
- **all managed repositories** — the complete eligible repository set for the operation, normally including the root repository and eligible managed layer repositories.

A use case may expose only the scopes that are meaningful and safe for that operation.

### 4.3 Layer identity is not inferred solely from directory location

A managed layer may have an independent repository, participate through a repository relationship, share repository ownership with another project resource, or otherwise have topology that cannot safely be inferred from directory shape alone. Git behaviour shall use resolved managed-project repository relationships.

### 4.4 CI/CD boundary

Git operations may be invoked by CI/CD, automation, or release workflows. This does not make the `git` domain the owner of the complete workflow. For example, build remains `app`, quality validation remains `quality`, and Git push remains `git`.

### 4.5 Cross-cutting authority

Invocation, confirmation, cancellation, structured outcomes, and interaction-mode equivalence remain governed by `FR-INV-*`; project/repository identity and managed scope by `FR-PROJ-*`; effective configuration by `FR-CONFIG-*`; and controlled source mutation by `FR-XFORM-*`.

---

## 5. General Git-Domain Requirements

### FR-GIT-001 — Coherent Git semantics
AppManager shall provide one coherent set of Git-domain semantics across supported interaction modes and host integrations.

### FR-GIT-002 — Application Engine authority
The Application Engine shall retain authority over Git use-case intent, scope, policy, safety, delegated-result interpretation, and final application-level outcomes.

### FR-GIT-003 — Repository intent over mechanism
A Git-domain operation shall represent repository-management intent rather than expose a Git library, provider API, or shell command as the primary application abstraction.

### FR-GIT-004 — Valid managed-project context
A consequential Git operation shall require managed-project context sufficient to establish the repositories and relationships relevant to the operation.

### FR-GIT-005 — Explicit repository scope
Before a consequential multi-repository Git operation begins, AppManager shall establish the intended repository scope.

### FR-GIT-006 — No discovery-based mutation authority
Discovering a Git repository shall not by itself grant AppManager authority to mutate, synchronise, push, commit, relate, initialise, or delete it.

### FR-GIT-007 — No implicit scope expansion
A Git operation shall not silently expand from one repository to other managed or unmanaged repositories merely because they are discoverable.

### FR-GIT-008 — Repository topology awareness
Git operations spanning multiple repositories shall respect the repository relationships represented by the managed-project context.

### FR-GIT-009 — Eligibility is operation-specific
A repository recognised by AppManager may be eligible for one Git operation and ineligible for another; eligibility shall be resolved per use case.

### FR-GIT-010 — Unmanaged repository protection
AppManager shall not perform consequential Git operations against an unmanaged repository unless an explicit use case first brings that repository within authorised managed scope.

### FR-GIT-011 — Effective configuration
Git behaviour depending on configurable values shall consume effective configuration rather than independently interpreting arbitrary raw configuration sources.

### FR-GIT-012 — Provider delegation is subordinate
A Git implementation, repository-hosting provider, credential provider, AI provider, or other delegated capability shall not redefine AppManager Git intent, scope, safety, or success criteria.

### FR-GIT-013 — Lower-level success is not automatically Git-use-case success
Successful completion of a delegated Git or provider operation shall not by itself establish successful completion of the AppManager Git use case.

### FR-GIT-014 — Structured diagnostics
Git-domain failures shall identify the affected repository or repository relationship and the functional stage that failed where that distinction is material.

---

## 6. Repository Inspection and Git Configuration

### FR-GIT-015 — Repository inspection
AppManager shall provide Git-domain inspection sufficient to expose relevant repository state for approved use cases without mutating the repository.

### FR-GIT-016 — Git configuration inspection
AppManager shall support inspection of Git configuration relevant to the selected managed repository or repository scope where retained as a user-facing use case.

### FR-GIT-017 — Inspection is non-authorising
Inspection or display of repository configuration shall not grant subsequent mutation authority.

### FR-GIT-018 — Repository identity in results
Inspection results shall identify the managed repository to which reported state applies sufficiently to avoid root/layer ambiguity.

### FR-GIT-019 — Sensitive-value minimisation
Git configuration inspection shall not unnecessarily expose credentials, tokens, secrets, or other sensitive authentication material.

### FR-GIT-020 — Repository-state distinctions
Where relevant, AppManager shall distinguish repository states such as clean/changed, ahead/behind/diverged, missing upstream, unresolved conflict, or unavailable remote rather than reducing all non-clean states to a single generic condition.

---

## 7. Repository Initialisation

### FR-GIT-021 — Repository initialisation use case
AppManager shall support initialising an eligible managed project resource as a Git repository where required by an approved use case.

### FR-GIT-022 — Existing repository protection
Repository initialisation shall not silently replace or reinitialise an already recognised repository in a manner that risks changing its identity or history.

### FR-GIT-023 — Scope-specific initialisation
The target of repository initialisation shall be explicit and shall not implicitly initialise neighbouring layers or directories.

### FR-GIT-024 — Configuration-driven defaults
Where repository initialisation depends on identity, default branch, or similar configurable choices, those values shall follow effective configuration and explicit invocation semantics.

### FR-GIT-025 — Initialisation result
The result shall identify the repository initialised and any consequential follow-on state or remaining action.

### FR-GIT-026 — Root creation delegation
When `app` root-application creation requests repository initialisation, Git semantics remain governed by this specification even though the higher-level workflow is owned by `app`.

---

## 8. Commit

### FR-GIT-027 — Commit use case
AppManager shall provide a Git-domain use case for creating a commit in an eligible selected managed repository.

### FR-GIT-028 — Commit target
A commit shall apply to one explicitly resolved repository at a time unless a future use case deliberately defines coordinated multi-repository commits.

### FR-GIT-029 — Commit requires committable change
AppManager shall determine whether the selected repository contains changes eligible for the requested commit and shall not report a successful new commit when no commit was created.

### FR-GIT-030 — Staging semantics must be explicit
Whether AppManager commits already-staged changes, stages a selected change set, or stages all eligible changes shall be explicit in the use case and shall not be hidden implementation behaviour.

### FR-GIT-031 — No unrelated staging
A commit use case shall not silently stage changes outside the approved repository/change scope.

### FR-GIT-032 — Commit message required
A commit shall have an application-accepted commit message obtained from explicit input, approved generation, or another approved source.

### FR-GIT-033 — Manual commit-message path
Commit creation shall remain possible without AI assistance when all other requirements are satisfied.

### FR-GIT-034 — Optional AI assistance
AppManager may offer AI-assisted commit-message generation when an eligible AI capability is available.

### FR-GIT-035 — AI availability handling
Absence or failure of an AI provider shall not make ordinary manual commit creation unavailable.

### FR-GIT-036 — AI input minimisation
Context supplied for AI commit-message assistance shall be bounded and sanitised according to applicable AI, security, and configuration policy.

### FR-GIT-037 — AI output is non-authoritative
An AI-generated commit message shall remain a proposal until accepted by AppManager under the invocation and policy model.

### FR-GIT-038 — Generated-message reviewability
Where AI-generated commit messages are presented to a human caller, the caller shall be able to accept or revise the proposed message before the commit is created unless an explicitly authorised automation policy defines otherwise.

### FR-GIT-039 — Commit outcome
The structured result shall distinguish commit success, cancellation, no eligible changes, staging failure, message-resolution failure, and commit failure where applicable.

---

## 9. Push

### 9.1 Purpose

Push transfers committed repository history from an eligible managed repository to an explicitly applicable remote. Push scope is distinct from repository discovery scope.

### FR-GIT-040 — Push use case
AppManager shall provide a Git-domain use case for pushing an eligible managed repository.

### FR-GIT-041 — Root-repository push
AppManager shall support pushing the managed root repository independently of managed layer repositories.

### FR-GIT-042 — Selected-layer push
AppManager shall support pushing an explicitly selected managed layer repository independently where that layer has an eligible repository.

### FR-GIT-043 — Selected-repository push
The same repository-scoped push semantics shall apply to any explicitly selected eligible managed repository without requiring a separate implementation philosophy for root and layer repositories.

### FR-GIT-044 — Remote resolution
Where a repository has multiple applicable remotes, AppManager shall resolve or require selection of the intended remote set rather than silently choosing an ambiguous remote.

### FR-GIT-045 — Headless remote determinism
Headless push shall not depend on an interactive remote-selection prompt; required remote information shall be supplied or deterministically resolvable.

### FR-GIT-046 — Push eligibility
AppManager shall determine whether the selected repository and remote relationship are eligible for push before claiming that push can proceed.

### FR-GIT-047 — Nothing-to-push behaviour
Where the selected repository has no history requiring push under the use case, AppManager may report it as already up to date rather than treating the condition as an opaque failure.

### FR-GIT-048 — Push does not imply build or quality validation
A Git push operation shall not silently acquire `app` build or `quality` validation semantics. Such steps require an explicitly composed workflow or policy.

### FR-GIT-049 — Push result
The structured result shall identify the repository, applicable remote(s), and success/failure sufficiently for callers to distinguish repository-level outcomes.

---

## 10. Push All Managed Repositories

### FR-GIT-050 — Coordinated multi-repository push
AppManager shall provide a use case for pushing all eligible managed repositories within an explicitly resolved all-managed-repositories scope.

### FR-GIT-051 — Root and layers included by topology
The all-managed-repositories push scope shall include the root repository and eligible managed layer repositories according to the resolved project topology, not according to a hard-coded directory scan.

### FR-GIT-052 — Eligibility filtering
Repositories that do not require or cannot validly perform the requested push shall be identified as skipped, already current, or ineligible rather than blindly invoked.

### FR-GIT-053 — Pre-execution scope visibility
Before a consequential interactive multi-repository push, AppManager shall make the intended repository scope reviewable where required by invocation policy.

### FR-GIT-054 — Explicit Headless scope
Headless all-repository push shall require or imply an unambiguous all-managed-repositories scope and shall not depend on interactive selection.

### FR-GIT-055 — Per-repository outcome isolation
Failure to push one repository shall not be misreported as success for that repository and shall not automatically erase the successful outcomes of repositories already pushed.

### FR-GIT-056 — Continuation policy
Whether a multi-repository push continues after an individual repository failure shall be an explicit use-case policy. Where continuation is supported, failures shall be accumulated and reported.

### FR-GIT-057 — Partial-success result
A multi-repository push shall support a structured partial-success outcome when some repositories succeed and others fail or are skipped.

### FR-GIT-058 — No false transactionality
AppManager shall not imply that a multi-repository push is universally atomic or rollback-capable.

---

## 11. Synchronisation

### 11.1 Purpose

Synchronisation updates local managed repository state from its configured repository relationships according to an explicit scope. Synchronisation is distinct from push and from application dependency/build initialisation.

### FR-GIT-059 — Synchronisation use case
AppManager shall provide Git-domain synchronisation for eligible managed repositories.

### FR-GIT-060 — Root-only synchronisation
AppManager shall support synchronising the root repository without implicitly synchronising every managed layer repository.

### FR-GIT-061 — Selected-layer synchronisation
AppManager shall support synchronising an explicitly selected managed layer repository independently where eligible.

### FR-GIT-062 — Selected-repository synchronisation
AppManager shall support synchronising an explicitly selected eligible managed repository using the same repository-scoped semantics regardless of whether it is the root or a layer.

### FR-GIT-063 — Selected-set synchronisation
Where supported, AppManager shall allow an explicitly selected subset of eligible managed repositories to be synchronised as one coordinated invocation.

### FR-GIT-064 — All-managed-repositories synchronisation
AppManager shall support synchronising the complete eligible managed repository set where that scope is requested.

### FR-GIT-065 — Scope is not inferred from current directory alone
Current invocation location may contribute context, but shall not be the sole authority for consequential synchronisation scope when managed-project topology provides a more authoritative model.

### FR-GIT-066 — No implicit global default where ambiguous
If the caller's synchronisation intent could validly mean root-only, selected repository, selected set, or all repositories and cannot be deterministically resolved, AppManager shall require disambiguation or fail safely rather than silently choosing the broadest scope.

### FR-GIT-067 — Headless synchronisation determinism
Headless synchronisation shall require or resolve an unambiguous repository scope without prompting.

### FR-GIT-068 — Divergence/conflict handling
Where synchronisation encounters divergence, conflicts, missing upstream state, authentication failure, or other conditions requiring policy or user decisions, AppManager shall expose the condition rather than silently discarding or overwriting local work.

### FR-GIT-069 — Local-change preservation
Synchronisation shall not intentionally discard uncommitted or committed local work unless a separately defined destructive use case explicitly authorises that effect.

### FR-GIT-070 — Relationship-aware synchronisation
Where repository relationships require coordinated update behaviour, AppManager shall respect those relationships while retaining explicit scope and reporting each materially affected repository.

### FR-GIT-071 — Multi-repository partial success
A coordinated synchronisation shall report per-repository success, failure, skip, conflict, and cancellation states sufficiently to represent partial completion.

### FR-GIT-072 — No false rollback guarantee
Synchronisation across multiple repositories shall not imply universal rollback of repositories already updated when a later repository fails.

### FR-GIT-073 — Drift diagnostics
Where a deliberately narrower synchronisation scope can leave related managed repositories at mutually inconsistent revisions, AppManager should expose a diagnostic or warning when the relationship model makes that risk knowable.

---

## 12. Managed Repository Relationships

### 12.1 Purpose

AppManager may establish repository relationships, including submodule-style relationships where supported, so independently managed repositories can participate coherently in the managed project.

### FR-GIT-074 — Add managed repository relationship
AppManager shall support establishing an approved repository relationship between the root project and an eligible managed repository where the project model requires such a relationship.

### FR-GIT-075 — Relationship candidates require eligibility
A discovered layer or repository shall not become a relationship candidate merely because it occupies a conventional directory; AppManager shall validate its managed identity, repository state, and required remote/provider information.

### FR-GIT-076 — Existing relationship protection
AppManager shall not duplicate a repository relationship that is already represented in the managed project.

### FR-GIT-077 — Tracked-content conflict protection
Where establishing a repository relationship would conflict with content already owned or tracked under another repository model, AppManager shall refuse or require an explicitly defined migration workflow rather than corrupting repository ownership.

### FR-GIT-078 — Remote identity requirement
Where the relationship mechanism requires a remote repository identity, AppManager shall require that identity to be valid and unambiguous before establishing the relationship.

### FR-GIT-079 — Explicit selection
When multiple eligible relationship candidates exist, AppManager shall require explicit selection or an unambiguous Headless scope.

### FR-GIT-080 — Relationship changes are consequential
Creating or changing repository relationships shall follow applicable confirmation, preview, managed-scope, and structured-outcome semantics.

### FR-GIT-081 — Relationship outcome
The result shall identify relationships created, skipped, already existing, failed, or left requiring a subsequent commit or other user action.

---

## 13. Initialise Layer Repositories

### FR-GIT-082 — Layer-repository initialisation use case
AppManager shall support initialising repositories for managed layers that legitimately require independent Git repositories and do not already have them.

### FR-GIT-083 — Nuxt creation relationship
A Nuxt-layer creation workflow may delegate repository initialisation to Git behaviour, but the `nuxt` domain retains ownership of layer-creation semantics.

### FR-GIT-084 — Existing layer repository preservation
Layer-repository initialisation shall exclude layers already represented by a valid repository unless an explicit repair/migration use case is invoked.

### FR-GIT-085 — Selected or all eligible layers
The use case may operate on one selected eligible layer or a reviewed set of eligible layers, but shall not initialise arbitrary directories outside managed scope.

### FR-GIT-086 — Multi-layer partial outcomes
Where multiple layer repositories are initialised in one invocation, AppManager shall report per-layer outcomes and represent partial success where applicable.

---

## 14. Remote Repository Deletion

### 14.1 Purpose

Remote repository deletion is an exceptional destructive capability and, where enabled in Version 1, requires stronger safety controls than ordinary Git operations.

### FR-GIT-087 — Explicitly retained destructive capability
If remote-repository deletion is enabled in Version 1, it shall exist only as a deliberately destructive Git-domain use case with stronger safety controls than ordinary repository operations.

### FR-GIT-088 — Exact remote target identity
Before deletion is authorised, AppManager shall establish the exact repository-hosting target identity, including the owning account/organisation and repository identity where applicable.

### FR-GIT-089 — No guessed owner
AppManager shall not guess a remote owner, organisation, or account for repository deletion from a hard-coded personal fallback or unrelated local context.

### FR-GIT-090 — No Headless prompting exception
Headless remote-repository deletion shall not fall back to interactive prompting when required target identity is unresolved. It shall fail safely and require the missing information to be supplied or deterministically resolvable.

### FR-GIT-091 — Strong explicit authorisation
Remote-repository deletion shall require explicit authorisation that is materially stronger than ordinary confirmation and suitable for non-interactive invocation.

### FR-GIT-092 — Authorisation bound to target
Deletion authorisation shall be associated with the resolved target sufficiently to reduce the risk that confirmation intended for one repository is applied to another.

### FR-GIT-093 — Provider-side deletion is not inferred from local removal
Removing a local remote reference, local repository, or managed-project relationship shall not be treated as equivalent to deleting a repository from a remote hosting provider.

### FR-GIT-094 — Remote deletion result
The result shall identify the exact remote repository targeted and whether deletion succeeded, was cancelled/refused, was unavailable, or failed.

### FR-GIT-095 — No automatic cascading deletion
Deleting one remote repository shall not implicitly delete related layer repositories, root repositories, local repositories, or repository relationships unless a separately defined destructive workflow explicitly authorises each effect.

---

## 15. CI/CD, Automation, and Workflow Composition

### FR-GIT-096 — Git operations are automation-capable
Git-domain operations shall be invocable through Headless and automation integrations when their required inputs, scope, configuration, and authorisation can be resolved non-interactively.

### FR-GIT-097 — Git does not own complete CI/CD semantics
The `git` domain shall not redefine application build, quality validation, release packaging, or deployment as Git behaviours merely because they execute in a Git-triggered automation environment.

### FR-GIT-098 — Workflow composition preserves ownership
A composed workflow may sequence `quality`, `app`, `git`, and other domain use cases, but each constituent operation shall retain its own functional authority and outcome semantics.

### FR-GIT-099 — Push is not deployment
A successful repository push shall not be represented as successful application deployment unless a separately governed deployment workflow establishes that outcome.

### FR-GIT-100 — CI-triggered Git operation equivalence
A Git operation invoked by CI/CD shall enforce equivalent scope, safety, configuration, and outcome semantics to the same application intent invoked through another supported adapter.

---

## 16. Safety, Failure, and Multi-Repository Behaviour

### FR-GIT-101 — Consequence classification
Git operations shall be classified sufficiently to apply appropriate confirmation and authorisation policy to ordinary, consequential, and destructive behaviours.

### FR-GIT-102 — Repository-specific diagnostics
In multi-repository operations, diagnostics shall identify the repository associated with each material warning or failure.

### FR-GIT-103 — Preserve completed truth
If a multi-repository operation partially succeeds, AppManager shall preserve and report the truth of completed effects rather than collapsing the invocation into an undifferentiated success or failure.

### FR-GIT-104 — Cancellation before next effect
Where cancellation is supported during a multi-repository operation, AppManager shall stop initiating further consequential repository effects as soon as cancellation is safely observed.

### FR-GIT-105 — Cancellation does not undo completed remote effects
Cancellation shall not imply that commits already pushed, repositories already synchronised, relationships already created, or remote deletions already completed have been rolled back.

### FR-GIT-106 — Authentication failures
Authentication or authorisation failures from a Git or hosting provider shall be surfaced as repository/provider access failures rather than misclassified as project absence or unknown command behaviour.

### FR-GIT-107 — Remote unavailability
Network or remote-provider unavailability shall not cause AppManager to fabricate successful synchronisation, push, or remote mutation outcomes.

### FR-GIT-108 — Concurrent/stale state
Where repository state materially changes between inspection/planning and consequential execution, AppManager shall fail, revalidate, or otherwise handle the stale state deliberately rather than blindly applying an invalid prior assumption.

### FR-GIT-109 — No silent destructive conflict resolution
AppManager shall not silently resolve merge conflicts, discard local changes, force-push rewritten history, or perform equivalent destructive conflict resolution unless a separately specified and explicitly authorised use case requires it.

### FR-GIT-110 — Force semantics require explicit specification
A lower-level implementation flag named `force` shall not by itself define application semantics. Any Version 1 behaviour that bypasses confirmation, rewrites history, overrides conflicts, or broadens effects must be explicitly specified and authorised at the appropriate functional level.

---

## 17. Interaction-Mode Equivalence

### FR-GIT-111 — TUI/Headless semantic equivalence
Interactive and Headless Git operations expressing the same intent shall resolve equivalent repository scope, policy, safety, and application-level outcomes.

### FR-GIT-112 — Interactive selection is presentation
Menus for choosing repositories, layers, remotes, or relationship candidates are presentation mechanisms and shall not become the only way to express the underlying Git intent.

### FR-GIT-113 — Headless missing information
When required repository, remote, scope, or destructive-authorisation information cannot be resolved in Headless mode, AppManager shall fail with structured diagnostics rather than prompt.

### FR-GIT-114 — Machine-consumable multi-repository results
Headless callers shall be able to determine per-repository outcomes of coordinated Git operations without parsing human terminal text.

---

## 18. Traceability Summary

| Requirement range | Functional concern | Primary current authority |
|---|---|---|
| `FR-GIT-001`–`014` | General Git authority, topology, scope | Root Design; Managed Project; Invocation |
| `FR-GIT-015`–`020` | Inspection/configuration | Repository Capability; Managed Project |
| `FR-GIT-021`–`026` | Repository initialisation | Repository Capability; App creation boundary |
| `FR-GIT-027`–`039` | Commit and optional AI assistance | Repository Capability; AI capability boundary; Invocation |
| `FR-GIT-040`–`049` | Root/selected repository push | Repository Capability; Managed Project |
| `FR-GIT-050`–`058` | All-managed-repositories push | Managed Project topology; Repository Capability |
| `FR-GIT-059`–`073` | Scoped synchronisation | Managed Project; Repository Capability |
| `FR-GIT-074`–`081` | Managed repository relationships | Managed Project; Repository Capability |
| `FR-GIT-082`–`086` | Layer repository initialisation | Nuxt boundary; Repository Capability |
| `FR-GIT-087`–`095` | Remote deletion | Invocation safety; Repository Capability/provider boundary |
| `FR-GIT-096`–`100` | CI/CD and automation boundary | Root Design; App Functional Specification; Quality boundary |
| `FR-GIT-101`–`114` | Safety, partial success, modes | Invocation; Managed Project; Configuration; Repository Capability |

Detailed Design shall extend traceability downward to permanent repository contracts and provider boundaries without changing these functional ownership decisions.

---

## 19. Conformance Summary

A Version 1 implementation conforms to this Functional Specification only if it:

1. treats Git operations as managed-project repository intents rather than filesystem/Git-library wrappers;
2. distinguishes root, selected managed repository/layer, selected set, and all-managed-repositories scope where applicable;
3. never grants mutation authority merely because a repository was discovered;
4. supports repository inspection and initialisation;
5. supports commit creation without requiring AI and treats AI output as non-authoritative;
6. supports independent root and selected-layer/repository push;
7. supports coordinated all-managed-repositories push with truthful partial-success reporting;
8. supports root-only, selected repository/layer, selected set, and all-repository synchronisation where applicable;
9. protects local work and does not silently perform destructive conflict resolution;
10. supports managed repository relationships without corrupting existing ownership/tracking;
11. supports eligible layer-repository initialisation while preserving the Nuxt layer-creation boundary;
12. applies exceptionally strong target resolution and authorisation to any retained remote-repository deletion capability;
13. never prompts in Headless mode for unresolved destructive target information;
14. preserves the distinction between Git operations and complete CI/CD workflow ownership;
15. provides machine-consumable per-repository outcomes for coordinated operations; and
16. preserves Application Engine authority over scope, policy, safety, and final outcomes.

---

## 20. Version 1 Functional Baseline

This document establishes the Version 1 Functional baseline for the AppManager `git` domain.

Future Detailed Design may choose concrete Git abstractions, provider interfaces, repository-topology representations, batching mechanisms, and implementation structure, but shall preserve the observable behaviour and domain boundaries established here unless this Functional Specification is deliberately superseded.