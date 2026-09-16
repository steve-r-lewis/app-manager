# DR-6 Semantic Disposition Register — Functional Corpus Rationalisation

> **Status:** Complete for DR-6 review branch
>
> **Frozen semantic source baseline:** `fe30f5ad883ce2abeca2e495dd4d7036eef09da6`
>
> **DR-6 branch base:** `be682eb3947e2d1447d1f21ff293ea53003f69e1`

## 1. Scope

DR-6 reviewed the Functional corpus horizontally against the DR-3 owner map, DR-2 Functional corrections, root Design authority and the rationalised DD reading. Every `FR-*` identity and observable obligation is preserved.

## 2. Dispositions

| ID | Candidate | Disposition | Canonical owner / treatment |
|---|---|---|---|
| DR6-01 | Repeated Application Engine authority | REFERENCE + RETAIN | Root Design; domain-specific `FR-*` consequences remain local. |
| DR6-02 | Discovery/reachability versus mutation authority | REFERENCE + RETAIN | Root Design / Managed Project / applicable Functional requirement. |
| DR6-03 | Provider completion versus application success | REFERENCE + RETAIN | Root Design / Invocation plus owning Functional result requirements. |
| DR6-04 | Evidence versus interpretation | REFERENCE + RETAIN | Root Design plus owning Functional use case. |
| DR6-05 | Generation versus transformation | REFERENCE + RETAIN | Root Design / Source Transformation Functional Specification. |
| DR6-06 | AI output versus authority | REFERENCE + RETAIN | Root Design / AI Functional Specification. |
| DR6-07 | Managed scope versus technical reachability | REFERENCE + RETAIN | Managed Project Functional Specification. |
| DR6-08 | Settings persistence versus effective precedence | REFERENCE + RETAIN | Configuration + Settings Functional Specifications. |
| DR6-09 | Domain intent versus capability mechanics | REFERENCE | Root Design; domain Functional owner; DD names are downstream refinement. |
| DR6-10 | `Current authority` tables mixing DD names with Functional owners | CORRECT | Functional traceability vocabulary clarification + DR-6 family clarification. |
| DR6-11 | Completed decomposition-plan references | REFERENCE | PM provenance/navigation only. |
| DR6-12 | Nuxt §11.1 downward DD wording | CORRECT / REFERENCE | Existing Nuxt Functional ownership clarification; DD scaffold clarification downstream only. |
| DR6-13 | Functional conformance summaries | RETAIN | Grouped verification surface; requirement bodies remain semantic checksum. |
| DR6-14 | Downstream Specification Boundary sections | RETAIN | Preserve abstraction/technology-independence constraints. |
| DR6-15 | Cross-domain boundary sections | CONSOLIDATE by reading rule / RETAIN local delta | Functional owners named by each domain specification. |

## 3. Requirement Identity Check

DR-6 performs no `FR-*` renumbering or deletion. Existing Functional requirement identities remain the semantic checksum for DR-9. The active Nuxt Functional ownership clarification remains the owning correction for `FR-NUXT-058/059` authority direction.

## 4. Zero-Loss Assessment

No independently meaningful Functional proposition is disposed as bare `REMOVE` in DR-6. Rationalisation is achieved through `REFERENCE`, `CONSOLIDATE` and hierarchy `CORRECT` dispositions while local requirements, safety rules, failure semantics, cross-domain consequences and conformance summaries remain available.

## 5. DR-9 Carry-Forward

DR-9 shall verify all baseline `FR-*` identities remain accounted, DR-2 corrections remain current Functional authority, downstream DD/IS references are not prerequisites for Functional meaning, and every later physical deletion is reachable through an explicit owner/reference or accountable disposition.