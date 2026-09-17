# Git Coordinated Commit Functional Clarification

> **Status:** Active Functional clarification
>
> **Clarifies:** `../git-functional-specification-v01.md`
>
> **Scope:** PBC-1 correction of Version 1 coordinated commit behaviour
>
> **Lifecycle:** Temporary integration vehicle; NCR-1 shall fold this Functional delta into the primary Git Functional Specification and retire this clarification.

## 1. Purpose

This clarification extends the observable behaviour of canonical `git.commit` beyond the single-repository restriction currently stated by `FR-GIT-028`.

Version 1 shall support deliberately coordinated commits over an explicitly resolved selected managed-repository set or all eligible managed repositories while preserving independent per-repository commit semantics and truthful partial outcomes.

## 2. Functional Correction to FR-GIT-028

The single-repository restriction is superseded by the following rule:

> **A commit invocation shall operate on an explicitly resolved selected repository, selected managed-repository set, or all-managed-repositories scope where that scope is requested and supported. Each repository commit remains independently identified and evaluated.**

No scope may be broadened merely because additional repositories are discoverable or technically reachable.

## 3. Coordinated Commit Requirements

### PBC-FR-GIT-COMMIT-001 — Canonical identity
Coordinated commit shall use canonical `git.commit`; repository cardinality shall be expressed as structured scope rather than separate `commit-all` or bulk command identities.

### PBC-FR-GIT-COMMIT-002 — Explicit scope
Before consequential execution AppManager shall establish an unambiguous selected-repository, selected-set or all-managed-repositories scope according to invocation policy and managed-project topology.

### PBC-FR-GIT-COMMIT-003 — Per-repository eligibility
Each repository in coordinated scope shall be independently evaluated for commit eligibility and committable changes.

### PBC-FR-GIT-COMMIT-004 — Per-repository staging scope
Staging policy and approved change scope shall be resolved independently for each eligible repository. Coordinated scope shall not authorise staging unrelated changes.

### PBC-FR-GIT-COMMIT-005 — Per-repository message
Each repository requiring a commit shall receive an application-accepted commit message appropriate to that repository's bounded approved changes. AppManager shall not require one identical message for the entire coordinated set.

### PBC-FR-GIT-COMMIT-006 — No fabricated commits
A repository with no eligible committable changes shall be reported as skipped, already satisfied or otherwise appropriately classified; AppManager shall not create an empty/fabricated commit solely for coordinated-set uniformity.

### PBC-FR-GIT-COMMIT-007 — AI proposal independence
Where AI-assisted message generation is authorised, AppManager may request a separate bounded proposal for each repository using only context approved for that repository/use case.

### PBC-FR-GIT-COMMIT-008 — Automatic acceptance
A previously authorised Git workflow may automatically accept a generated commit-message proposal without per-result human review when deterministic Git-owned validation and acceptance criteria were established before generation. The AI provider or generated output shall not accept or authorise itself.

### PBC-FR-GIT-COMMIT-009 — Manual path preserved
Manual explicit commit-message input shall remain available independently of AI assistance where the other commit requirements are satisfied.

### PBC-FR-GIT-COMMIT-010 — Continuation policy
Whether coordinated commit continues after one repository fails, becomes stale or is otherwise blocked shall follow explicit Git-domain continuation policy.

### PBC-FR-GIT-COMMIT-011 — Truthful partial completion
Successful commits already created shall remain completed effects if a later repository fails or cancellation is observed. AppManager shall support canonical partial-success reporting with per-repository outcomes.

### PBC-FR-GIT-COMMIT-012 — No false transactionality
AppManager shall not represent coordinated multi-repository commit as universally atomic, rollback-capable or equivalent to one provider-level transaction.

### PBC-FR-GIT-COMMIT-013 — Headless determinism
Headless coordinated commit shall resolve scope, staging policy, message policy, continuation policy and any required authorisation without interactive prompting. Missing required information shall fail safely with structured diagnostics.

### PBC-FR-GIT-COMMIT-014 — Interaction equivalence
TUI, GUI and Headless invocations expressing the same coordinated commit intent shall resolve equivalent Git scope, policy, safety and application-level outcome semantics.

## 4. Existing Requirements Preserved

Except for the single-repository restriction in `FR-GIT-028`, the existing commit requirements remain applicable per repository, including committable-change validation, explicit staging semantics, no unrelated staging, required accepted messages, optional AI assistance, bounded AI context and truthful commit outcomes.

The existing general Git requirements for managed scope, no implicit scope expansion, stale-state handling, cancellation, partial-effect truth and Application Engine authority also remain applicable.

## 5. Command Cardinality

This correction changes behaviour, not command identity. Git remains at **8 canonical commands** and the complete Version 1 catalogue remains **96 canonical commands**.

## 6. NCR Integration

NCR-1 shall replace the obsolete single-repository restriction in the primary Git Functional Specification with the coordinated-scope semantics defined here and consolidate the requirements into the canonical Git Functional owner.