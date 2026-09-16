# DR-5 — DD-3/DD-4 Domain Rationalisation Review

> **Status:** PASS — DR-5 complete on review branch
>
> **Verified branch baseline:** `f9c81503cdbdb6c361f9ead75e45cc8a553536fe`
>
> **Frozen semantic source baseline:** `fe30f5ad883ce2abeca2e495dd4d7036eef09da6`

## 1. Objective

DR-5 applies the DR-3 canonical ownership map and DR-4 capability reading rule to the eight Version 1 domain Detailed Designs:

- DD-3.1 App;
- DD-3.2 Git;
- DD-3.3 Nuxt;
- DD-3.4 Docs;
- DD-4.1 Quality;
- DD-4.2 Settings;
- DD-4.3 AI;
- DD-4.4 Utils.

The package must reduce ownership ambiguity and repetition without removing domain intent, policy, orchestration, evidence interpretation or domain-specific acceptance semantics.

## 2. Baseline Verification

PR #162 was independently verified `closed` and `merged`. Its merge commit is `f9c81503cdbdb6c361f9ead75e45cc8a553536fe`. Live `master` independently resolved to the same SHA before the DR-5 branch was created.

The DR-5 branch therefore starts from the verified post-DR-4 state rather than a historical branch assumption.

## 3. Horizontal Review Result

The eight domain designs consistently contain three semantic layers:

1. inherited DD-1 application authority and DD-2 capability boundaries;
2. a concise local binding explaining how the domain consumes those owners;
3. substantial domain-specific delta defining intent, policy, orchestration, interpretation, state and postconditions.

The apparent repetition is therefore mixed. Some prose is genuinely inherited architecture suitable for reference; some is necessary local binding; and much of the corpus is domain-specific contract material that must remain local.

No generic Domain framework is justified by similar headings, result shapes or delegation diagrams.

## 4. Capability/Domain Boundary Verification

### 4.1 Git / Repository

DD-3.2 owns Git application intent, policy, repository eligibility/orchestration and interpretation. DD-2.3 owns bounded repository primitives/facts. The two are deliberate layers, not duplicate semantic contracts.

### 4.2 Nuxt / Nuxt Capability

DD-3.3 owns Nuxt application intent, target/applicability policy, configuration/layer orchestration and lifecycle interpretation. DD-2.10 owns bounded Nuxt technical semantics. Cross-owned scaffold artefacts remain with their semantic owners.

### 4.3 Docs / Documentation Capability

DD-3.4 owns Docs application use cases and output/target policy. DD-2.9 owns reusable documentation mechanics/evidence. Existing-source semantic mutation remains Source Transformation-owned.

### 4.4 Quality / Quality Capability

DD-4.1 owns quality application intent, scope/check/gate policy and interpretation. DD-2.8 owns bounded quality execution/findings/gate mechanics. Technical completion is not itself final application acceptance.

### 4.5 AI Domain / AI Capability

DD-4.3 owns AI-domain instruction-resource application intent. DD-2.7 owns provider-independent AI execution. This matches the active AI Detailed Design ownership clarification introduced during DR-2. Generated content remains proposal/evidence until accepted by the owning use case.

## 5. Settings and Utils Boundaries

DD-4.2 owns Settings persistence/application intent but does not establish configuration precedence; DD-1.4 remains the effective-configuration authority.

DD-4.4 remains deliberately narrow. Source-header maintenance and classified cleanup do not authorize Utils to absorb work with a stronger semantic owner. Source Intelligence, Source Transformation, Resource Access, Docs and Settings boundaries remain intact.

## 6. App/Nuxt Composition

The DR-1 candidate concerning App root creation versus Nuxt baseline configuration remains not sustained. App may own inclusion/orchestration of a root-creation plan while Nuxt owns Nuxt-specific scaffold/configuration semantics. DR-5 preserves this as deliberate composition.

## 7. Nuxt Operation Identity Correction

DR-1 required DR-5 to fold forward the already-settled DD-3.3 operation-identity correction.

The active Nuxt clarification establishes eight canonical Version 1 identities and explicitly rejects `inspect_layer_state` as a ninth independently invocable operation. DR-5 carries that corrected set into the new family rationalisation clarification and marks the stale primary-list proposition `CORRECT` in the semantic register.

Lifecycle/integration state remains observable structured evidence; only the duplicate command identity is rejected.

## 8. Repetition Classes

### 8.1 DD-1 authority prose

Repeated descriptions of invocation, outcomes, managed scope, effective configuration and final Engine acceptance are inherited bindings. The canonical owners remain DD-1.1 through DD-1.5.

### 8.2 DD-2 capability prose

Repeated descriptions of capability mechanics are consumption bindings. The corresponding DD-2 capability, read with the DR-4 clarification, remains authoritative for those mechanics.

### 8.3 Generic diagrams

Generic Engine -> domain -> capability -> evidence -> Engine diagrams are illustrative unless they establish domain-specific stage ordering, state transition, safety or recovery semantics.

### 8.4 Implementation evidence

Historical source paths and implementation observations are provenance. Concrete Version 1 implementation disposition belongs IS-14 through IS-21 for the domain layer.

## 9. Why DR-5 Does Not Bulk-Delete Domain Bodies

The eight domain documents interleave inherited architecture with hundreds of domain-specific `DD-*` requirements, preconditions, state distinctions, orchestration rules and failure/recovery semantics. A mechanical shortening pass would create semantic-loss risk disproportionate to the readability gain.

DR-5 therefore establishes the authoritative rationalised reading and proposition accounting first. Physical deletion remains safe only where a later pass can prove every removed proposition is reachable through a canonical owner or retained local delta.

This follows the programme acceptance rule: semantic equivalence is mandatory; line reduction is only a metric.

## 10. Deliverables

DR-5 adds:

- `docs/dd_3_high_coupling_domains/clarifications/dd3-dd4-domain-rationalisation-clarification-v01.md`;
- `docs/project_management/assurance/reconciliations/dr5-semantic-disposition-register-v01.md`;
- this review;
- a current-state README update.

## 11. Acceptance Checks

| Check | Result |
|---|---|
| verified post-DR-4 master used | PASS |
| all eight DD-3/DD-4 domain designs included | PASS |
| domain intent/policy/orchestration preserved | PASS |
| capability/domain pairings remain separate | PASS |
| DD-1 final authority preserved | PASS |
| DD-2 bounded mechanics preserved | PASS |
| App/Nuxt deliberate composition preserved | PASS |
| Nuxt stale ninth-operation identity corrected in active rationalised reading | PASS |
| lifecycle-state observability preserved | PASS |
| Settings persistence/precedence separation preserved | PASS |
| AI non-authority preserved | PASS |
| Utils stronger-owner boundary preserved | PASS |
| no generic domain framework invented | PASS |
| semantic dispositions recorded | PASS |
| zero unaccounted semantic deletion in package | PASS |

## 12. Result

**PASS — DR-5 COMPLETE.**

The DD-3/DD-4 family now has an explicit rationalised reading that keeps domains focused on their local application semantics while referencing inherited DD-1/DD-2 authority. No domain-specific contract has been discarded, and the known Nuxt operation-identity correction is carried forward without removing lifecycle-state semantics.

After merge and independent live-master verification, proceed to **DR-6 — Functional Corpus Rationalisation**.
