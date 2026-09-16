# DR-3 Semantic Disposition Register

> **Status:** Complete on DR-3 branch
>
> **Role:** Semantic accounting for Design/Functional normative ownership
>
> **Frozen source baseline:** `fe30f5ad883ce2abeca2e495dd4d7036eef09da6`

| ID | Recurrent proposition | Canonical owner | Disposition in DR-3 | Later-package treatment |
|---|---|---|---|---|
| DR3-01 | delegated specialist execution does not transfer application policy/outcome authority | Design §§6.6, 11; FR-INV-001–002 | CONSOLIDATE ownership mapping | REFERENCE from DR-4–DR-7; retain local delegated delta |
| DR3-02 | recognition/discovery/reachability does not grant mutation authority | Design §9; FR-PROJ-037–049 | CONSOLIDATE ownership mapping | REFERENCE; retain command-specific targetability/authorization |
| DR3-03 | technical/provider completion is not final application success | Design §§7.7, 11; FR-INV-001–002 | CONSOLIDATE ownership mapping | REFERENCE; retain domain acceptance semantics |
| DR3-04 | evidence remains evidence until interpreted by the owning application responsibility | Design §§7.2, 9.6, 11; FR-PROJ-002 / FR-INV-002 | CONSOLIDATE ownership mapping | REFERENCE; retain evidence type and interpretation delta |
| DR3-05 | generation of new artefacts is distinct from transformation of existing source | Design §§6.8, 7; FR-XFORM-044–045 | CONSOLIDATE ownership mapping | REFERENCE; retain domain generation/collision rules |
| DR3-06 | AI output does not acquire application/source/mutation authority | Design §10.6; FR-AI-002–005; FR-XFORM-059 for source proposals | CONSOLIDATE ownership mapping | REFERENCE; retain AI/consuming-domain local constraints |
| DR3-07 | managed scope is semantic and not equivalent to filesystem/repository reachability | Design §9; FR-PROJ-037–049, 059–060 | CONSOLIDATE ownership mapping | REFERENCE; retain command-specific scope forms |
| DR3-08 | Settings persistence does not define effective-configuration precedence | Design §8/§10.10; FR-CONFIG-001–008; FR-SET-001–005 | CONSOLIDATE ownership mapping | REFERENCE; retain Settings CRUD and configuration concern deltas |
| DR3-09 | domains own application intent/policy/orchestration while shared capabilities own bounded specialist mechanics | Design §§6.5–6.6, 10.11, 11; FR-INV-001–002 plus domain Functional ownership | CONSOLIDATE ownership mapping | REFERENCE; preserve domain and capability local contracts |

## Owner-Level Editing Disposition

DR-3 found the Design and Functional owners already semantically sufficient for these clusters. No `FR-*` requirement needed deletion, renumbering or semantic correction to establish ownership.

Accordingly, DR-3 deliberately does **not** perform broad primary-body deletion. The safe owner-level rationalisation in this package is the ownership map itself: it prevents later packages from choosing owners by prose frequency and gives each recurrent invariant a stable current reference set.

Actual duplicate-body reduction is assigned to DR-4 through DR-7, where each consuming document can be read horizontally and its local delta preserved.

No row authorizes silent semantic deletion.