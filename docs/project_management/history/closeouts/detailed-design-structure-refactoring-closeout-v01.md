# AppManager Detailed Design Structure Refactoring Closeout

> **Status:** Version 1 project-management closeout and handover record
>
> **Work package:** R-10 — Structural-refactoring closeout and handover
>
> **Baseline:** `master` at `58918ac2ec390ce49d97a1e3f670271af7b203a0`, the merge commit for PR #111
>
> **Normative effect:** None. This document closes the documentation-structure refactoring and records the continuation state. It does not revise architecture, Functional requirements, Detailed Design semantics, authority boundaries, or implementation topology.

## 1. Purpose

This record formally closes the Version 1 Detailed Design documentation-structure refactoring performed through work packages R-1 to R-10 and establishes the repository state from which domain Detailed Design authoring resumes.

The refactoring objective was:

> Every active Version 1 Detailed Design Specification has an explicit stable DD identity, a canonical self-documenting family location, navigable dependencies, an authoritative register entry, and no unexplained dependency on the superseded flat Detailed Design structure remains.

R-9 verified that completion condition with a PASS and zero blocking or unexplained structural findings. R-10 therefore records the refactoring as complete and removes the temporary pause on DD-3 authoring.

## 2. Closeout Decision

**DETAILED DESIGN STRUCTURAL REFACTORING CLOSED — DD-3.2 AUTHORISED**

The next Detailed Design objective is:

> **DD-3.2 — Git Domain Detailed Design**

This authorization means that structural migration is no longer a prerequisite to DD-3.2 authoring. It does not waive the normal requirement to verify live repository state, read the governing authorities, work on a dedicated branch, and submit a focused Pull Request.

## 3. Completed Work Packages

| Work package | Result |
|---|---|
| R-1 — Governance finalisation | Complete — canonical `dd_<family>_<semantic_name>/` family convention established |
| R-2 — Canonical DD register | Complete — stable DD identities, subjects, paths and statuses registered |
| R-3 — Repository-wide migration inventory | Complete — affected primary DDs, clarifications and reference surfaces classified |
| R-4 — DD-1 migration | Complete — DD-1 Application Core and its clarifications moved to canonical structure |
| R-5 — DD-2 migration | Complete — DD-2 Shared Capabilities and its clarifications moved to canonical structure |
| R-6 — DD-3/DD-4 establishment | Complete — DD-3.1 migrated and future DD-3/DD-4 family locations established without fabricated normative placeholders |
| R-7 — Cross-document navigation repair | Complete — active references and in-document DD identity metadata reconciled |
| R-8 — VitePress/navigation repair | Complete — rendered navigation reconciled with canonical taxonomy |
| R-9 — Repository-wide conformance audit | Complete — PASS, zero blocking or unexplained structural findings |
| R-10 — Closeout/handover | Complete upon merge of this record and associated status updates |

## 4. Canonical Detailed Design State

The Version 1 Detailed Design families are:

```text
DD-1 — Application Core
DD-2 — Shared Capabilities
DD-3 — High-Coupling Domains
DD-4 — Policy and Resource Domains
```

Their canonical active directories are:

```text
docs/dd_1_application_core/
docs/dd_2_shared_capabilities/
docs/dd_3_high_coupling_domains/
docs/dd_4_policy_and_resource_domains/
```

Current authored primary designs are:

- DD-1.1 through DD-1.5 — complete;
- DD-2.1 through DD-2.10 — complete;
- DD-3.1 App Domain — complete.

Current planned primary designs are:

- DD-3.2 Git Domain — **next**;
- DD-3.3 Nuxt Domain — planned;
- DD-3.4 Docs Domain — planned;
- DD-4.1 Quality Domain — planned;
- DD-4.2 Settings Domain — planned;
- DD-4.3 AI Domain — planned;
- DD-4.4 Utils Domain — planned.

No unauthored planned design has a fabricated normative placeholder file.

## 5. Governing Sources for Continuation

A fresh session beginning DD-3.2 should read and verify, in this order:

1. [Project Documentation Guide](../project-documentation-guide-v01.md);
2. [AppManager Design Specification](../appmanager-design-specification-v01.md);
3. [Detailed Design Decomposition Plan and Canonical Register](detailed-design-decomposition-plan-v01.md);
4. [Domain Detailed Design Authoring Guide](domain-detailed-design-authoring-guide-v01.md);
5. the Git-domain Functional Specification and any directly governing Functional clarifications;
6. [DD-3.1 — App Domain](../dd_3_high_coupling_domains/dd-3-1-app-domain-detailed-design-v01.md) for established domain-DD composition conventions, without treating App-specific semantics as Git authority;
7. the DD-1 Application Core contracts consumed by Git;
8. the DD-2 shared capabilities consumed by Git, particularly Repository Capability and any required Resource Access, Process Execution, Source Intelligence, Configuration or outcome-related contracts;
9. applicable accepted ADRs and active clarification documents;
10. this closeout and the R-9 conformance audit as project-management state/evidence only.

The exact normative set for DD-3.2 shall be established from the current repository rather than inferred from this navigation list.

## 6. DD-3.2 Authoring Guardrails

DD-3.2 shall follow the established domain Detailed Design rule:

> **A domain Detailed Design defines permanent domain-specific composition of approved Application Core and shared capability contracts; it does not recreate those contracts and does not prematurely map them to concrete code.**

For Git Domain specifically, authoring shall:

1. identify the Functional requirements owned by Git;
2. identify DD-1 contracts consumed;
3. identify DD-2 capabilities coordinated;
4. define only the permanent Git-domain orchestration, policy, state, decisions and result semantics remaining after shared concerns are removed;
5. preserve DD-1.2 canonical outcome and diagnostic ownership;
6. consume DD-1.3 managed scope and DD-1.4 effective configuration rather than reconstructing them;
7. treat repository/provider results as evidence until Git-domain interpretation and Application Engine acceptance;
8. preserve the distinction between repository primitives and Git-domain workflow/policy;
9. avoid provider-native Git coupling and implementation topology;
10. avoid speculative shared frameworks;
11. preserve provider/capability replaceability and interaction-mode independence;
12. apply the canonical-invariant / local-binding / domain-specific-delta rule.

In particular, DD-3.2 must not turn DD-2.3 Repository Capability into the Git domain or duplicate repository primitives already owned by that capability.

## 7. Authority and Dependency Invariants

The canonical authority direction remains:

```text
interaction adapters / integrations
        |
        v
Application Invocation
        |
        v
Application Engine / owning use case
        |
        +--> Managed Project / governed scope
        +--> effective Configuration
        +--> domain-specific orchestration
        |
        v
shared capability contracts
        |
        v
replaceable providers
        |
        v
external tools / resources / APIs
```

The structural refactoring changes documentation location and navigability only. It does not alter this architecture.

The following distinctions remain mandatory:

```text
recognition
    != selection
    != intent
    != authorization
    != execution
    != technical success
    != domain acceptance
    != application success
```

Delegated specialist execution remains subordinate to application authority.

## 8. Historical and Superseded Locations

The following locations are not active Detailed Design/ADR locations:

```text
docs/detailed_design/
docs/decisions/
```

Occurrences of those paths in migration records, audits or historical handovers may remain valid historical evidence. They shall not be used as current navigation or authority paths.

The active ADR location is:

```text
docs/project_management/decisions/
```

Historical DD handovers remain useful provenance but shall not override this closeout, the current canonical register, or live repository state.

## 9. Structural Refactoring Completion Condition

The completion condition is satisfied:

- stable primary DD identities are explicit;
- completed DDs occupy canonical family locations;
- clarifications remain separately classified;
- the canonical register maps identities to current paths and statuses;
- active dependency/navigation references are reconciled;
- VitePress reflects the canonical taxonomy;
- the superseded flat DD structure is absent;
- no unexplained active legacy-path dependency remains;
- no normative content was intentionally redesigned as part of the migration;
- no planned DD placeholder was fabricated;
- R-9 reports zero blocking structural findings.

Accordingly, no further structural-refactoring work package blocks domain Detailed Design authoring.

## 10. New-Session Continuation Procedure

For subsequent Detailed Design work:

1. verify the current `master` head and relevant PR state;
2. begin from the Project Documentation Guide and canonical register;
3. use this closeout to establish that structural refactoring is complete;
4. read the Domain Detailed Design Authoring Guide;
5. identify the exact normative authorities for the next domain;
6. do not infer approved architecture from current implementation where normative specifications exist;
7. create a fresh `ai/...` branch from the verified live baseline;
8. make a focused design change;
9. compare the branch to the verified base;
10. open a focused PR and leave merge authority to the user.

## 11. Next Objective

Upon merge of R-10, the immediate next project objective is:

```text
DD-3.2 — Git Domain Detailed Design
```

The structural-refactoring programme is then closed. Future changes to documentation structure should be treated as new governed changes rather than continuation of R-1 through R-10.