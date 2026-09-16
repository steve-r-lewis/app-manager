# DR-7 Semantic Disposition Register

> **Status:** DR-7 branch closeout evidence
>
> **Baseline:** live `master` after merged PR #164, `7bc99614528d45a227c0c17faa7dcade777b1072`
>
> **Frozen programme comparison baseline:** `fe30f5ad883ce2abeca2e495dd4d7036eef09da6`
>
> **Normative product effect:** None. This is assurance/accounting evidence.

## 1. Purpose

This register accounts for the meaningful proposition classes reviewed during DR-7 — Implementation Specification Rationalisation.

## 2. Corpus Result

All 23 primary Implementation Specification identities remain unchanged. DR-7 found the primary corpus dense but unusually high-value: much of its apparent repetition is attached to concrete interfaces, types, provider decisions, algorithms, migration dispositions or conformance obligations and therefore cannot safely be deleted as prose duplication.

No primary IS body is mechanically rewritten in DR-7.

## 3. Dispositions

| Proposition class | Disposition | Canonical treatment |
|---|---|---|
| Application Engine final authority repeated across IS documents | `REFERENCE / RETAIN binding` | Upstream DD-1/Functional owners remain canonical; local IS statements bind concrete implementation. |
| managed-scope / discovery-not-authority repetition | `REFERENCE / RETAIN binding` | Upstream managed-project authority; concrete target/path/scope mechanisms remain in owning IS. |
| evidence-versus-interpretation repetition | `REFERENCE / RETAIN binding` | Upstream owner; concrete normalized evidence/result types and acceptance seams remain Level 4. |
| capability/domain separation | `REFERENCE / RETAIN seam` | DD-2/DD-3/DD-4 owners; concrete IS pair boundaries remain implementation requirements. |
| provider replaceability/non-leakage | `REFERENCE / RETAIN mechanism` | Upstream invariant plus concrete provider adapters/normalizers in owning IS. |
| AI non-authority | `REFERENCE / RETAIN consequence` | Upstream AI rules; concrete proposal/output/disclosure/provider contracts remain IS-10/IS-20. |
| scope/non-ownership lists | `ILLUSTRATE / RETAIN` | Boundary maps retained for implementation readability; they do not re-own upstream semantics. |
| generic governing-rule quotations/diagrams | `ILLUSTRATE` | Explanatory unless they contain concrete module/call-path/sequencing delta. |
| public/internal TypeScript contracts | `RETAIN` | Owning IS. |
| module/source target layout | `RETAIN` | Owning IS; implementation may simplify only where responsibility remains explicit as already permitted. |
| provider/mechanism selections | `RETAIN` | Owning IS; no generic provider framework invented. |
| algorithms, stale-state, cancellation, timeout, concurrency, partial effects | `RETAIN` | Owning IS. |
| `RETAIN / ADAPT / SPLIT / RELOCATE / REPLACE` tables | `RETAIN` | Owning IS as current-to-target migration specification. |
| historical implementation rationale surrounding a disposition | `ILLUSTRATE / CONSOLIDATE conceptually` | Disposition, preserved behavior, target owner and migration action remain normative Level 4 information. |
| conformance summaries repeating concrete sections | `CONSOLIDATE conceptually / RETAIN checklist` | Checklist is not second owner; independently testable obligations preserved. |
| IS-1/IS-22/IS-23 application path | `RETAIN` | Deliberate runtime seam; launcher -> composition -> adapter -> application. |
| IS-6/IS-15 Repository/Git pair | `RETAIN` | Deliberate facts/primitives vs domain orchestration/policy seam. |
| IS-10/IS-20 AI pair | `RETAIN` | Deliberate provider-independent AI execution vs AI-domain intent seam. |
| IS-11/IS-18 Quality pair | `RETAIN` | Deliberate technical execution/evidence vs domain policy/gate intent seam. |
| IS-12/IS-17 Documentation/Docs pair | `RETAIN` | Deliberate shared mechanics vs domain intent seam. |
| IS-13/IS-16 Nuxt pair | `RETAIN` | Deliberate framework mechanics vs Nuxt-domain orchestration seam. |
| IS-3/IS-19 Config/Settings pair | `RETAIN` | Resolution/precedence distinct from persisted settings intent. |
| current repository topology as target authority | `REFERENCE / REJECT` | Source is migration evidence; owning IS defines target implementation. |
| concrete current-repository migration evidence | `RETAIN` | High-value starting-state evidence. |
| information-free duplicate proposition | `REMOVE` | None proven safe enough for physical removal in this package. |

## 4. Provider/Runtime Verification

Horizontal comparison preserved the reconciled decisions that:

- IS-23 owns Node.js/TypeScript ESM/NodeNext/pnpm build and assembly;
- the launcher remains thin and normal TUI/Headless entry flows through IS-22 before IS-1;
- IS-6 uses Git CLI through IS-5 for local Git and a bounded GitHub REST adapter for approved remote-host semantics;
- provider-native objects/errors do not become general AppManager contracts;
- historical source libraries/topology are evidence, not authority.

## 5. Zero-Loss Accounting

DR-7 removes no primary-IS proposition physically. The new active Implementation clarification classifies repeated upstream explanation without deleting concrete Level 4 material. Therefore interfaces, types, provider decisions, algorithms, migration dispositions, traceability and test obligations remain textually present in their primary specifications.

No `IS-*` identity changed. No upstream architecture changed. No unresolved semantic contradiction was found that requires specification or ADR change control.

## 6. Acceptance

**PASS — DR-7 semantic accounting complete.**

The Implementation corpus is rationalised conservatively through an explicit inherited-binding/local-delta reading while preserving the complete concrete Level 4 baseline for implementation. DR-8 may proceed after merge and independent live-master verification.