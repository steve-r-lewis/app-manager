# DR-4 Semantic Disposition Register — DD-2 Shared Capability Rationalisation

> **Status:** DR-4 assurance record
>
> **Normative product effect:** None. Normative clarification is recorded separately under `docs/dd_2_shared_capabilities/clarifications/`.
>
> **Source baseline for DR-4:** `e2856d9d74890320a4b42c660854b169d8879640`

## 1. Purpose

This register accounts for the meaningful proposition classes reviewed across DD-2.1 through DD-2.10 during DR-4.

## 2. Dispositions

| Proposition class | Disposition | Preserved owner / treatment |
|---|---|---|
| Capability-specific permanent contracts and `DD-*` requirements | RETAIN | Owning DD-2 document |
| Delegated execution does not transfer application authority | REFERENCE | Canonical Design/Functional/DD-1 owners identified by DR-3 |
| Recognition/reachability does not create mutation authority | REFERENCE | Managed Project / Source Transformation / applicable domain Functional owner |
| Technical/provider completion is not final application success | REFERENCE | Application Invocation / DD-1.2 / DD-1.5 |
| Evidence vs interpretation vs final acceptance | REFERENCE | Application Invocation / DD-1.2 / DD-1.5 |
| Managed scope vs technical reachability | REFERENCE | Managed Project Functional / DD-1.3 |
| Effective configuration consumption | REFERENCE | Configuration Functional / DD-1.4 |
| AI output remains proposal/evidence | REFERENCE | AI Functional / consuming-domain Functional owner / DD-2.7 local AI mechanics |
| Generation vs existing-resource transformation | REFERENCE + RETAIN LOCAL DELTA | Source Transformation Functional; DD-2.5; owning generation capability where creation semantics differ |
| Domain intent/policy/orchestration vs capability mechanics | REFERENCE | Design/Functional primary-intent owners; capability-specific mechanics remain local |
| `Conformance Rules for Later DD-2 Designs` and equivalent sibling-order prose | CORRECT | Reinterpreted as owner-contract consumption or historical authoring guidance; numbering creates no sibling authority |
| Capability-specific cross-capability dependency constraints | RETAIN | Owning capability's local boundary; consumer references actual owner contract |
| `Current Implementation Evidence/Reconciliation` observations | RELOCATE BY AUTHORITY | Historical/provenance value retained in DD text; concrete implementation disposition owned by IS-4 through IS-13 and PM assurance/history |
| Provider/library/source-path observations | REFERENCE / RELOCATE | Corresponding IS unless independently elevated by ADR or upstream contract |
| Repeated generic delegation diagrams | ILLUSTRATE / CONSOLIDATE | One conceptual path recorded in active DD-2 clarification; capability-specific diagrams retained where they add local state/order/safety meaning |
| Provider replaceability | REFERENCE + RETAIN LOCAL DELTA | Design/ADR canonical principle plus each capability's provider-specific boundary |
| Capability-specific failure, stale-state, cancellation, concurrency, partial-effect and security semantics | RETAIN | Owning DD-2 document |
| Capability-specific evidence schemas/fact models | RETAIN | Owning DD-2 document; naming/shape similarity does not justify unification |
| Current source topology as architectural authority | REMOVE AS AUTHORITY | May remain historical evidence only; never target architecture by implication |

## 3. Per-Document Accounting

| DD | Permanent local delta preserved | Implementation owner verified |
|---|---|---|
| DD-2.1 Resource Access | resource identity, containment, revision/stale state, bounded I/O/mutation mechanics | IS-4 |
| DD-2.2 Process Execution | invocation/I/O/environment/lifecycle/timeout/cancellation/termination mechanics | IS-5 |
| DD-2.3 Repository Capability | bounded repository primitives and normalized repository evidence | IS-6 |
| DD-2.4 Source Intelligence | read-only snapshot/provenance/fact/range/ambiguity semantics | IS-7 |
| DD-2.5 Source Transformation | plan/preservation/stale protection/apply/validate/effect semantics | IS-8 |
| DD-2.6 Registry and Template | declarative identity/classification/rendering/proposed-content semantics | IS-9 |
| DD-2.7 AI Capability | provider-independent AI execution/context/disclosure/output mechanics | IS-10 |
| DD-2.8 Quality Capability | bounded checks/findings/results/gate mechanics | IS-11 |
| DD-2.9 Documentation Capability | documentation specialist mechanics/evidence | IS-12 |
| DD-2.10 Nuxt Capability | Nuxt specialist inspection/scaffold/configuration mechanics/evidence | IS-13 |

## 4. Semantic-Loss Check

No capability-specific requirement is deleted or superseded. Recurrent propositions are consolidated only at the level of normative ownership and interpretation. Historical implementation evidence remains available but cannot compete with accepted Level 4 implementation decisions.

**DR-4 semantic accounting result: PASS.**
