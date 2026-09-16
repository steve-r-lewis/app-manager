# AppManager Specification Defect Verification and Correction

> **Document type:** Project-management assurance review
>
> **Status:** Package B complete on review branch; effective after merge/live-master verification
>
> **Role:** Work Package B verification and correction record
>
> **Normative product effect:** None by itself. Confirmed normative corrections are carried by the owning specification/clarification changes in this work package.

## 1. Purpose

This record completes **Package B — Specification Defect Verification and Correction**. It verifies the independent-review candidate defects against the live post-Package-A normative corpus before accepting, correcting or rejecting each allegation.

The review follows `documentation-assurance-guide-v01.md`: live-state verification, vertical authority check, horizontal peer comparison, finding classification before editing, and correction only in an owning normative surface.

## 2. Verified Baseline

PR #154 was verified merged and closed. Package B began from live `master` at:

```text
114a07e9d75755876788b1ad2a6aa36e58102528
```

No historical branch/PR state was treated as current authority.

## 3. Candidate Findings

| ID | Candidate | Classification | Resolution |
|---|---|---|---|
| B-01 | Source Intelligence / Source Transformation separation at DD-2.4/DD-2.5 and IS-7/IS-8 | **Not sustained** | Existing normative and Level 4 contracts explicitly keep recognition/read-only source evidence separate from approved transformation/mutation. No correction. |
| B-02 | DD-3.1 references `DD-5` / `DD-6` as though they were primary Detailed Design identities | **Terminology/readability defect, not semantic architecture defect** | Historical decomposition used these as programme phase labels; the current DD register ends at DD-4.4. No product semantic ambiguity remains. Package C owns hierarchical-reference/readability cleanup of such stale phase-label prose. |
| B-03 | DD-3.3 `inspect_layer_state` versus IS-16 canonical Nuxt command set | **Confirmed normative identity inconsistency** | Corrected by active `nuxt-domain-operation-identity-clarification-v01.md`: lifecycle state remains required evidence, but is projected through `nuxt.inspect`/relevant operation results rather than a ninth independent use case. |
| B-04 | Source Intelligence lacks a single primary domain Functional authority | **Not sustained** | DD-2.4 is deliberately cross-cutting and records related consuming Functional authorities. It is not an application domain and does not require invention of a Source Intelligence user-facing Functional domain. |
| B-05 | AI Functional ownership is ambiguous between DD-2.7 shared AI Capability and DD-4.3 AI Domain | **Clarification required** | Corrected by `ai-functional-ownership-clarification-v01.md`: AI FS is the AI-domain observable-behaviour authority; DD-4.3 owns AI-domain intent; DD-2.7 owns shared provider-independent AI execution semantics and constrains cross-domain AI use without taking over primary intent. |
| B-06 | Required Detailed Design clarification relationships are missing | **Not sustained as a general normative defect** | Current corpus contains active clarification relationships/backlinks for the load-bearing DD-1/DD-2 clarifications inspected. Package C may still normalize/reference them for readability, but no missing binding relationship was found that changes semantics. |
| B-07 | Docs capability/domain repeated prose implies duplicate semantic ownership | **Not sustained** | DD-2.9/IS-12 own bounded documentation capability mechanics/modeling; DD-3.4/IS-17 own Docs application intent, target/profile/completeness and acceptance. Repetition is principally a readability concern; semantic ownership remains distinct. |
| B-08 | IS-6/IS-23 repository dependency disposition is coherent | **Confirmed Level 4 contradiction** | IS-6 explicitly selects direct Git CLI through IS-5 and rejects `simple-git` as the target provider dependency, while IS-23 incorrectly said `simple-git` RETAIN/ADAPT. IS-23 is corrected to REPLACE/REMOVE from the target provider path and defer to IS-6's owning provider decision. |

## 4. B-01 — Source Intelligence and Transformation

IS-7 explicitly states that mutation methods are not Source Intelligence operations and relocate to IS-8 or another owning transformation implementation. IS-8 traceability explicitly preserves the IS-7/IS-8 separation. DD-2.4 remains evidence-producing/read-only; DD-2.5 owns semantic transformation planning/application.

**Decision:** no correction. Collapsing these responsibilities would create the defect alleged by the review rather than resolve one.

## 5. B-02 — DD-5 / DD-6 Phase Labels

DD-3.1 contains historical wording: after DD-3/DD-4 and the `DD-5` audit, `DD-6` implementation planning may proceed. The completed programme records establish that `DD-5` and `DD-6` were planning-stage phase labels, not primary DD identities. Package A's current register contains exactly DD-1.1 through DD-4.4.

The wording is therefore stale/confusing but does not establish a nonexistent design owner or change any App contract. It is deliberately assigned to Package C because that package exists to repair hierarchical referencing/readability after semantic defects are settled.

## 6. B-03 — Nuxt Operation Identity

Functional requirements require layer lifecycle/integration state to be observable, but do not require a separately invocable layer-state command. DD-3.3 listed `inspect_layer_state`; IS-16 registered eight canonical commands and treated lifecycle state as part of inspection/result semantics.

The correction preserves all required facts while establishing one semantic owner: `nuxt.inspect` is the canonical inspection use case. The active DD clarification prevents an adapter from manufacturing a ninth semantic use case from the stale internal label.

## 7. B-04 — Source Intelligence Functional Authority

Source Intelligence is a shared capability consumed by multiple functional domains. Its lack of a dedicated user-facing Functional Specification is consistent with the decomposition: the applicable domain Functional Specifications own observable behaviour; DD-2.4 owns the reusable internal evidence contract.

**Decision:** no invented Functional domain or duplicate authority document.

## 8. B-05 — AI Functional Ownership

The corpus already states that DD-2.7 is shared and DD-4.3 owns AI-specific project-resource intent, but metadata could be read as assigning the whole AI Functional Specification to both Detailed Designs.

The active Functional clarification makes the refinement relation explicit without changing feature scope: DD-4.3 owns AI-domain intent; DD-2.7 owns bounded provider-independent execution; other domains retain their own primary intent when consuming DD-2.7; applicable `FR-AI-*` constraints still apply.

## 9. B-06 — Clarification Backlinks

The inspected load-bearing clarification relationships are present in the active corpus, including Application Core bootstrap/outcome clarifications, Nuxt scaffold artefact ownership, and App/Settings environment-definition ownership at the relevant lower levels.

Some documents still use old project-management authoring-control links. That is a Package C reference/readability concern after Package A's compatibility-pointer work, not evidence that the normative clarification itself is absent.

## 10. B-07 — Documentation Capability versus Docs Domain

Horizontal comparison preserves the intended seam:

```text
Docs domain / IS-17
    owns application intent, target/profile/grouping,
    completeness and domain acceptance
        |
        v
Documentation Capability / IS-12
    owns bounded documentation evidence/model aggregation,
    rendering/tool delegation and capability-level validation
```

The domain may choose a target set and interpret completeness while the capability normalizes/aggregates evidence. Similar prose about evidence, AI, tooling and outcomes does not establish duplicate ownership.

**Decision:** no semantic consolidation framework. Package C may reduce redundant explanatory prose using the three-layer rule.

## 11. B-08 — Repository Provider Dependency

This was the clearest Level 4 contradiction. IS-6 §4.1 explicitly selects installed Git CLI through IS-5 and states that Version 1 does not promote `simple-git` to the target provider dependency. IS-23 §9 nevertheless classified `simple-git` as RETAIN/ADAPT behind IS-6.

Because IS-6 owns Repository Capability provider implementation and IS-23 owns package/assembly classification, IS-23 must follow IS-6 rather than reopen the provider choice. IS-23 has therefore been corrected to `REPLACE / REMOVE from target provider path`, with an explicit owner-precedence sentence and migration instruction.

## 12. Horizontal Recheck

After the corrections, the reviewed seams preserve:

1. one Application Engine/final-outcome authority;
2. managed scope and configuration authority in DD-1/IS-1–3;
3. Source Intelligence read-only evidence versus Source Transformation mutation;
4. Nuxt intent in DD-3.3/IS-16 versus bounded Nuxt mechanics in DD-2.10/IS-13;
5. AI-domain intent versus shared AI capability execution;
6. Docs-domain intent versus Documentation Capability mechanics;
7. Git-domain policy/orchestration versus Repository Capability primitives;
8. provider decisions owned by the relevant capability IS rather than package assembly;
9. provider-native success/evidence remaining subordinate to domain/application acceptance;
10. no new generic framework or implementation-topology requirement.

## 13. Exit Decision

**PASS — WORK PACKAGE B SPECIFICATION DEFECT VERIFICATION AND CORRECTION COMPLETE ON BRANCH.**

All identified Package B candidates have been classified. Confirmed semantic/Level 4 inconsistencies have an owning normative correction or active clarification. Allegations not supported by the live corpus have not been converted into architecture. The remaining DD-5/DD-6 wording and repeated/reference-heavy prose are explicitly non-semantic readability/reference work for Package C.

Package B becomes closed project state only after this branch is merged and the resulting live `master` is verified.

The next authorised remediation package after that verification is **Package C — Hierarchical Specification Referencing and Readability**.
