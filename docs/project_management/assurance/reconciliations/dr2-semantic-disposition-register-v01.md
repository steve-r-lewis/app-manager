# DR-2 Semantic Disposition Register

> **Status:** Complete on branch
>
> **Role:** Semantic accounting for DR-2
>
> **Frozen source baseline:** `fe30f5ad883ce2abeca2e495dd4d7036eef09da6`

| ID | Baseline proposition/finding | Classification | Disposition | Final owner / follow-forward |
|---|---|---|---|---|
| DR2-01-A | Nuxt layer creation owns profile/baseline orchestration | valid | RETAIN | Nuxt Functional Specification / FR-NUXT-051–070 |
| DR2-01-B | profile inclusion does not transfer independent artefact semantic ownership | valid | RETAIN | FR-NUXT-058 plus Functional clarification |
| DR2-01-C | Functional meaning depends on DD scaffold clarification | authority-direction defect | CORRECT | Functional clarification makes DD document downstream refinement only; fold into Nuxt FS in DR-6 |
| DR2-02-A | AI Functional Specification owns observable AI functional behaviour | valid | RETAIN | AI Functional Specification + Functional clarification |
| DR2-02-B | consuming domain retains primary application intent when using AI | valid | RETAIN | applicable Functional domain + FR-AI constraints |
| DR2-02-C | Functional clarification allocates DD-2.7 versus DD-4.3 responsibility | mixed-level filing defect | RELOCATE | DD-level AI refinement relationship clarification |
| DR2-02-D | DD-4.3 owns AI-domain intent while DD-2.7 owns bounded AI capability mechanics/evidence | valid DD allocation | RETAIN | DD-level AI refinement relationship clarification; later fold-forward in DR-4/DR-5 as applicable |
| DR2-03-A | DD-2 capability owner may constrain safe consumption of its own contract | valid | RETAIN | owning DD-2 capability contract |
| DR2-03-B | lower-numbered/earlier-authored DD-2 sibling governs later-numbered siblings | authority-presentation defect | CORRECT | DD-2 sibling authority clarification; fold into DD-2 in DR-4 |
| DR2-03-C | genuine cross-capability invariants derive from upstream/common owner | valid | REFERENCE | Root Design / Functional / DD-1 or specialist owner contract |
| DR2-04-A | Functional tables preserve useful downward architectural traceability | valid | RETAIN | Functional corpus |
| DR2-04-B | DD subsystem/capability name is `current authority` for Functional requirements | hierarchy-vocabulary defect | CORRECT | Functional authority vocabulary clarification |
| DR2-04-C | distinguish normative Functional authority from downstream refinement destination | required correction | CORRECT | DR-6 primary Functional table fold-forward |

No DR-2 row authorizes silent semantic deletion.