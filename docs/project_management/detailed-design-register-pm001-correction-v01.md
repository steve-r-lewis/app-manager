# AppManager Detailed Design Register PM-001 Correction

> **Status:** Version 1 project-management state correction
>
> **Applies to:** `docs/project_management/detailed-design-decomposition-plan-v01.md`
>
> **Corrective source:** `docs/project_management/detailed-design-conformance-audit-v01.md`, finding `PM-001`
>
> **Normative effect:** None. This document corrects project-management completion state only. It does not alter Detailed Design identity, decomposition, responsibility ownership, contract semantics, dependency direction, or specification authority.

---

## 1. Purpose

This correction closes `PM-001` from the Version 1 Detailed Design Conformance Audit.

The canonical Detailed Design decomposition plan was originally maintained as both the decomposition record and drafting-state register. Its Section 5 and Section 12 planning state ceased to reflect the repository after the DD-3 and DD-4 authoring programme completed. The underlying decomposition remained correct; only the recorded completion state became stale.

This document records the authoritative project-management correction without rewriting historical planning prose or implying a normative Detailed Design amendment.

The governing rule is:

> **Completion-state correction does not change design authority or design content.**

---

## 2. Verified Baseline

This correction is based on live `master` at:

`5f32278ca8a06a5a54cfa472c7a8b3bb1d5298d6`

That commit is the merge commit for PR #121, which added the Version 1 Detailed Design Conformance Audit.

At this baseline:

- DD-1.1 through DD-1.5 are complete;
- DD-2.1 through DD-2.10 are complete;
- DD-3.1 through DD-3.4 are complete;
- DD-4.1 through DD-4.4 are complete;
- the scheduled Version 1 Detailed Design Conformance Audit is complete and passed;
- the complete primary Version 1 Detailed Design baseline therefore comprises 23 primary Detailed Design Specifications.

---

## 3. PM-001

The conformance audit identified that the canonical decomposition plan still described:

- DD-3.2 as `Planned — next domain design`;
- DD-3.3 and DD-3.4 as `Planned`;
- DD-4.1 through DD-4.4 as `Planned`;
- DD-3.1 as the only completed DD-3 design in its Section 12 current-state prose;
- the Detailed Design Conformance Audit as a future DD-5 activity.

Those statements are historical planning state. They are no longer current project state.

`PM-001` is a project-management state defect only. No normative Detailed Design defect was identified by it.

---

## 4. Corrected Canonical Register State

For current project-management interpretation, Section 5 of `detailed-design-decomposition-plan-v01.md` shall be read with the following completion state.

### 4.1 DD-1 — Application Core

| ID | Subject | Current status |
|---|---|---|
| `DD-1.1` | Application Invocation | Complete |
| `DD-1.2` | Execution Outcomes | Complete |
| `DD-1.3` | Managed Project | Complete |
| `DD-1.4` | Configuration Resolution | Complete |
| `DD-1.5` | Application Engine | Complete |

### 4.2 DD-2 — Shared Capabilities

| ID | Subject | Current status |
|---|---|---|
| `DD-2.1` | Resource Access | Complete |
| `DD-2.2` | Process Execution | Complete |
| `DD-2.3` | Repository Capability | Complete |
| `DD-2.4` | Source Intelligence | Complete |
| `DD-2.5` | Source Transformation | Complete |
| `DD-2.6` | Resource Registry and Template | Complete |
| `DD-2.7` | AI Capability | Complete |
| `DD-2.8` | Quality Capability | Complete |
| `DD-2.9` | Documentation Capability | Complete |
| `DD-2.10` | Nuxt Capability | Complete |

### 4.3 DD-3 — High-Coupling Domains

| ID | Subject | Canonical path | Current status |
|---|---|---|---|
| `DD-3.1` | App Domain | `docs/dd_3_high_coupling_domains/dd-3-1-app-domain-detailed-design-v01.md` | Complete |
| `DD-3.2` | Git Domain | `docs/dd_3_high_coupling_domains/dd-3-2-git-domain-detailed-design-v01.md` | Complete |
| `DD-3.3` | Nuxt Domain | `docs/dd_3_high_coupling_domains/dd-3-3-nuxt-domain-detailed-design-v01.md` | Complete |
| `DD-3.4` | Docs Domain | `docs/dd_3_high_coupling_domains/dd-3-4-docs-domain-detailed-design-v01.md` | Complete |

### 4.4 DD-4 — Policy and Resource Domains

| ID | Subject | Canonical path | Current status |
|---|---|---|---|
| `DD-4.1` | Quality Domain | `docs/dd_4_policy_and_resource_domains/dd-4-1-quality-domain-detailed-design-v01.md` | Complete |
| `DD-4.2` | Settings Domain | `docs/dd_4_policy_and_resource_domains/dd-4-2-settings-domain-detailed-design-v01.md` | Complete |
| `DD-4.3` | AI Domain | `docs/dd_4_policy_and_resource_domains/dd-4-3-ai-domain-detailed-design-v01.md` | Complete |
| `DD-4.4` | Utils Domain | `docs/dd_4_policy_and_resource_domains/dd-4-4-utils-domain-detailed-design-v01.md` | Complete |

No new DD identity is introduced by this correction.

---

## 5. Corrected Drafting and Phase State

The current state corresponding to Section 12 of the decomposition plan is:

1. **DD-0 — Decomposition and Contract Map:** complete.
2. **DD-1 — Application Core:** complete; conformance audit and required corrective clarification complete.
3. **DD-2 — Shared Capabilities:** complete; independent reconciliation and final horizontal conformance closeout complete.
4. **DD-3 — High-Coupling Domains:** complete for App, Git, Nuxt and Docs.
5. **DD-4 — Policy and Resource Domains:** complete for Quality, Settings, AI and Utils.
6. **Detailed Design Conformance Audit:** complete; overall result PASS, with `PM-001` as the sole residual project-management correction.
7. **Implementation Specification Planning:** next scheduled specification-phase activity after this correction is merged.

The historical `DD-5` and `DD-6` labels in the decomposition plan are planning-stage phase labels, not primary Detailed Design identities. They do not extend the canonical primary DD register beyond DD-4.4.

---

## 6. Authority Preservation

This correction does not modify or reinterpret any Detailed Design contract.

In particular, it does not alter:

- Application Engine authority;
- canonical invocation or outcome semantics;
- managed-project or managed-scope authority;
- configuration-resolution authority;
- DD-2 capability boundaries;
- DD-3 or DD-4 domain ownership;
- accepted clarifications;
- provider replaceability;
- implementation-topology independence;
- the implementation-phase guardrails recorded by the Detailed Design Conformance Audit.

The completed Detailed Design Specifications and accepted clarifications remain the normative Detailed Design baseline.

---

## 7. Relationship to the Decomposition Plan

The decomposition plan remains authoritative as the project-management record of:

- primary Detailed Design identity;
- family decomposition;
- canonical subject assignment;
- dependency direction;
- contract-map intent;
- drafting rationale;
- traceability model;
- ADR triggers;
- transition from Detailed Design to Implementation Specification.

For **completion status and current phase state only**, this correction supersedes the stale planning statements identified in Section 3 above.

This narrow supersession avoids treating historical drafting prose as if it were a normative design contradiction and avoids unnecessary churn to otherwise valid decomposition rationale.

Any future revision of the decomposition plan should incorporate this corrected state directly and may then retire the need for this overlay as a current-state aid.

---

## 8. Closure Decision

`PM-001` is **CLOSED** by this correction.

The Version 1 Detailed Design programme is complete and has passed its scheduled conformance gate. No residual Detailed Design correction blocks the next phase.

The project may therefore proceed to **Implementation Specification decomposition and authoring planning**, subject to the implementation guardrails recorded in `docs/project_management/detailed-design-conformance-audit-v01.md`.
