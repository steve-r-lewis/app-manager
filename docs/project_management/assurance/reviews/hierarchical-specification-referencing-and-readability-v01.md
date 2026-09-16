# AppManager Hierarchical Specification Referencing and Readability Review

> **Document type:** Project-management assurance review
>
> **Status:** Package C complete on review branch; effective after merge/live-master verification
>
> **Role:** Work Package C reconciliation record
>
> **Normative product effect:** None. This review records editorial/navigation treatment and does not alter product semantics.

## 1. Purpose

This review completes **Package C — Hierarchical Specification Referencing and Readability** after Package B closed semantic defect verification.

Package C is intentionally not a mass rewrite of the Version 1 specification corpus. Its purpose is to establish durable readability/reference controls, repair high-value active navigation, classify remaining historical wording correctly, and prevent editorial simplification from weakening independently owned contracts.

## 2. Verified Baseline

PR #155 was verified merged and closed. Live `master` was verified at:

```text
2750350d798e0f7fe4938724ab67411339330ed3
```

The Package C branch was created from that exact baseline.

## 3. Readability Model Adopted

The active Domain Detailed Design Authoring Guide v02 now defines the reusable Package C conventions:

1. **three-layer referencing:** cite canonical owner -> state concise local binding -> define only the local delta;
2. **state once locally, reference thereafter:** repeated invariants require a local safety/comprehension reason;
3. **current-owner references:** active specifications should not present completed plans, handovers, closeouts or superseded guides as current authority;
4. **historical phase-label discipline:** labels such as `DD-5`/`DD-6` are described as historical programme phases, never primary DD identities;
5. **worked examples:** recommended for difficult contracts, explicitly non-normative unless deliberately made normative;
6. **diagram discipline:** prefer one authority/architecture diagram plus deltas rather than repeated equivalent diagrams;
7. **grouped conformance/test obligations:** grouping is encouraged when it preserves every independently testable requirement;
8. **stable traceability:** contract/requirement identifiers are primary; section numbers are secondary navigation aids.

These are drafting/readability controls. They do not create product architecture.

## 4. Active Navigation Correction

`docs/detailed-design.md` was materially stale after Package A/B because it still described the historical Detailed Design decomposition plan as the current register/authority, linked the superseded v01 authoring guide, and pointed to an old closeout path as a governing navigation source.

The page now:

- distinguishes normative product authority from project-management identity/lifecycle state;
- points to `detailed-design-register-v01.md` for current DD identity/lifecycle state;
- points to `domain-detailed-design-authoring-guide-v02.md` and `documentation-assurance-guide-v01.md` for current drafting/assurance navigation;
- exposes the Package B Nuxt operation-identity clarification in the DD-3 clarification list;
- states that all Version 1 primary DDs are complete;
- treats completed decomposition/audit programmes as history rather than current design authority.

## 5. DD-3.1 `DD-5` / `DD-6` Wording

Package B established that DD-3.1's sentence referring to a `DD-5 Detailed Design conformance audit` and `DD-6 / Implementation Specification planning` is stale programme-phase terminology, not a product-semantic defect.

Package C establishes the durable interpretation rule: these labels are historical programme phases and do not extend the primary DD identity space beyond DD-4.4. The current DD register and navigation now make that identity boundary explicit.

The Version 1 implementation boundary expressed by DD-3.1 remains valid: concrete Node.js/TypeScript module/source/provider/test mapping belongs at Level 4 and must realise, not redefine, Detailed Design semantics. Package C therefore does not create replacement DD-5/DD-6 specifications or alter DD-3.1 architecture merely to modernize historical wording.

A future substantive revision of DD-3.1 should replace the historical labels with the descriptive terms “Detailed Design conformance audit” and “Implementation Specification planning” under the v02 authoring convention. The stale labels are not to be copied into new active specifications.

## 6. Repetition and Three-Layer Referencing

The independent review correctly identified repeated authority/delegation statements across the corpus, but Package B also established that similarly worded capability/domain passages can carry necessary local boundary semantics.

The Package C rule is therefore deliberately conservative:

```text
upstream invariant
    -> canonical owner
    -> concise local binding where required
    -> domain/capability-specific delta
```

No automated or bulk deletion of repeated text is authorised. A repeated paragraph may be reduced only after confirming that no local scope, safety, acceptance, mutation, failure or provider-replaceability obligation is lost.

## 7. Worked Examples

Worked examples are now a recommended drafting device for contracts that are difficult to understand abstractly. They are not required to retrofit every completed Version 1 document before implementation can begin.

The priority examples identified by the independent review remain useful targets for future substantive revisions:

- Nuxt layer creation/integration;
- Source Transformation plan -> approval -> apply -> validation/stale-state handling;
- AI structured-output proposal -> validation -> owning-domain interpretation -> Application Engine acceptance.

The authoring guide now defines how such examples must be bounded so they cannot accidentally introduce defaults, provider choices, command identities or policy.

## 8. Conformance/Test Lists

The long Level 4 conformance lists are retained because they encode independently testable obligations. Package C rejects mechanical compression that would reduce verification coverage.

For new/revised documents, long lists should be grouped by semantic concern or expressed as a matrix where every obligation remains independently visible. Existing lists may be reorganised opportunistically when the owning specification is substantively revised.

## 9. Traceability and Section Numbers

Stable requirement/contract identifiers are now the preferred traceability anchor. Section numbers may be included as navigation aids but must not be the sole binding reference where editorial movement could cause drift.

This directly addresses the class of traceability-numbering defects identified by the independent review without requiring a high-risk corpus-wide renumbering exercise.

## 10. Historical and Compatibility References

Package A deliberately retained compatibility pointers at former project-management paths. Their presence means an old link can continue to resolve without making the old programme document current authority.

Package C therefore distinguishes:

- **broken/stale active navigation** — correct when encountered;
- **compatibility pointer** — valid navigation bridge, explicitly non-authoritative;
- **historical citation** — valid when evidence/provenance is the subject;
- **active product authority reference** — should point to the current normative owner/active clarification.

This avoids rewriting historical records merely to make them appear contemporary.

## 11. Architectural Preservation Check

Package C changes preserve:

- the Project Documentation Guide's hierarchy;
- DD-1 Application Core authority;
- managed scope and effective-configuration ownership;
- canonical outcome/final Application Engine acceptance;
- capability/domain separation;
- Source Intelligence versus Source Transformation;
- evidence versus interpretation;
- provider replaceability;
- AI non-authority;
- implementation-topology independence;
- the Package B Nuxt and AI ownership clarifications;
- all existing Functional/DD/IS requirement and contract identifiers.

No generic framework has been inferred from repeated prose or repeated contract shape.

## 12. Exit Decision

**PASS — WORK PACKAGE C HIERARCHICAL SPECIFICATION REFERENCING AND READABILITY COMPLETE ON BRANCH.**

Package C has established the reusable editorial model, repaired the principal active Detailed Design navigation surface, bounded the DD-5/DD-6 historical-label issue, and defined safe treatment of repetition, examples, diagrams, conformance lists and traceability.

A corpus-wide prose rewrite is explicitly **not** a Package C exit criterion: it would create disproportionate semantic-regression risk after the completed Level 3/Level 4 reconciliations. The new conventions apply to future documents and substantive revisions, with opportunistic cleanup where the owning document is already being changed.

Package C becomes closed project state only after this branch is merged and the resulting live `master` is verified.

The next authorised objective after that verification is **Package D — Final Documentation Baseline Verification**.
