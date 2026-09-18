# NCR Working Proposition Ledger

> **Document type:** Project-management working ledger
>
> **Status:** Active NCR ledger; NCR-1 merged through PR #179; NCR-2 complete on PR #180 for independent review; PR unmerged
>
> **Normative product effect:** None. This ledger records ownership and reduction actions; the normative corpus remains authoritative.
>
> **Semantic comparison baseline:** `0d96d6e0123072e8b2f57bfa25bd8f6554edfc19`
>
> **NCR-2 physical starting baseline:** `b041d440faf032b2954e5a8be2fbc7894988717f`

## 1. Use

This is the single working proposition ledger required by the NCR control programme. It is intentionally compact: it records proposition families and physical reduction/integration results without becoming a second specification.

For every reduction, two conditions apply together:

1. normative substance must have one canonical owner; and
2. the edited document must remain understandable to a human reader at its own abstraction level.

A reference therefore replaces inherited normative substance, not the local explanation of why that authority matters to the document being read.

## 2. NCR-1 — Design and Functional

The following stable NCR proposition families account for unnumbered Design/clarification material and recurrent cross-cutting rules. Requirement-level coverage is exhaustive in §5; these summaries are non-normative meaning checksums, not substitute specifications. `LOCAL_DELTA` below records surviving local semantics, not a new product obligation.

| Proposition ID / family | Canonical meaning checksum | Canonical owner | Occurrences / inputs | Class / physical action | Human-readable local binding | Result |
|---|---|---|---|---|---|---|
| NCR1-P01 — Application authority and delegated execution | Application Engine retains use-case policy, scope, sequencing and outcome authority; providers supply bounded mechanics. | Design §§6.2, 6.6 | Design §§5–7, 10–12; domain authority FRs | `CANONICAL` / `LOCAL_DELTA` at owner; `REFERENCE` / `LOCAL_BINDING` at consumers; `DELETE_DUPLICATE`: Removed authority essays; stable FRs bind directly to Design. | Local domain purpose and capability roles remain. | verified; no open finding |
| NCR1-P02 — Recognition, topology and mutation authority | Evidence/context membership is distinct from eligible operation scope and ownership. | Design §§9.1–9.9; Managed Project FR-PROJ-013–018, 030–036, 041–048, 054–055, 060–061 | Managed Project and every target-consuming domain | `CANONICAL` / `LOCAL_DELTA` at owner; `REFERENCE` / `LOCAL_BINDING` at consumers; `DELETE_DUPLICATE`: Removed repeated discovery/authority explanations; kept targetability, exclusions and command-specific scope deltas. | Each operation still identifies its target, eligibility and refusal behaviour. | verified; no open finding |
| NCR1-P03 — Evidence, acceptance and observable results | Technical completion is evidence; accepted status, partial effects and recovery remain independently meaningful. | Design §§7.7, 11.11; Invocation FR-INV-028, 031–047 | Design workflow/invariant summaries; all capability-consuming Functional owners | `CANONICAL` / `LOCAL_DELTA` at owner; `REFERENCE` / `LOCAL_BINDING` at consumers; `DELETE_DUPLICATE`: Separated architectural acceptance from canonical observable results; replaced repeated result slogans. | Workflow narratives retain their own postconditions and affected-resource fields. | verified; no open finding |
| NCR1-P04 — Generation and transformation | New-artefact creation does not grant replacement authority; existing source uses bounded change and validation. | Design §§6.8, 7.5–7.12, 11.8; Source Transformation §§5–18 | App/Nuxt/Docs/Settings/AI/Maintenance creation and change requirements | `CANONICAL` / `LOCAL_DELTA` at owner; `REFERENCE` / `LOCAL_BINDING` at consumers; `DELETE_DUPLICATE`: Replaced inherited prose; preserved source-format, collision, generated-region and stale-state deltas. | Readers can follow inspection, plan, approval, effect and validation locally. | verified; no open finding |
| NCR1-P05 — AI proposals and owning-workflow acceptance | AI output uses prior owning-workflow policy; human or deterministic automatic acceptance is permitted without self-authorisation. | Design §§10.6, 11.10; AI PBC-FR-AI-ENV-017 and consuming-domain acceptance requirements | AI ownership/project-environment clarifications; Git, Docs and other consumers | `CANONICAL` / `LOCAL_DELTA` at owner; `REFERENCE` / `LOCAL_BINDING` at consumers; `DELETE_DUPLICATE`: Integrated automatic acceptance; removed repeated proposal/non-authority rules; bound consumers directly. | Git message and Docs artefact validation remain separate contracts. | verified; no open finding |
| NCR1-P06 — Persistence and effective configuration | Persisted settings/environment candidates remain distinct from resolved effective values, precedence, provenance and runtime effect. | Design §§8.1–8.9; Configuration §§5–20; Settings FR-SET-001–005, 058–071 | Configuration, Settings, App and environment-definition clarification | `CANONICAL` / `LOCAL_DELTA` at owner; `REFERENCE` / `LOCAL_BINDING` at consumers; `DELETE_DUPLICATE`: Removed repeated precedence/authority prose; retained candidate, sensitivity, persistence and effect deltas. | Environment readiness still explains App coordination and the Settings result. | verified; no open finding |
| NCR1-P07 — Interaction, GUI and portability | Version 1 has TUI, GUI and Headless; future WebStorm integration uses modular typed, replaceable boundaries without a prescribed transport. | Design §§4, 6.10; Invocation FR-INV-017–024, FR-INV-GUI-001–010 | Interaction/portability Design and GUI Functional clarifications | `CANONICAL` / `LOCAL_DELTA` at owner; `REFERENCE` / `LOCAL_BINDING` at consumers; `DELETE_DUPLICATE`: Integrated both levels and retired both vehicles; retained GUI input, preview, authorisation and parity obligations. | Graphical interaction has a local operating model, not just adapter links. | verified; no open finding |
| NCR1-P08 — App command and lifecycle model | Eight canonical identities; prepare replaces initialise; post-install and declared scripts are subordinate; re-preparation composes existing commands. | Design §10.3; App §§4.6, 6–15, FR-APP-116 | App Design/Functional command clarifications and primary lifecycle requirements | `CANONICAL` / `LOCAL_DELTA` at owner; `REFERENCE` / `LOCAL_BINDING` at consumers; `DELETE_DUPLICATE`: Integrated settled identities and creation readiness; preserved optional/deferred dependencies and stage failure constraints. | Preparation, creation, build/generate, clean/reset and re-preparation remain readable workflows. | verified; no open finding |
| NCR1-P09 — Nuxt command and framework model | Thirteen canonical identities retain distinct configuration, scaffold, module, upgrade, analysis, cleanup and layer postconditions. | Design §10.7; Nuxt §§4.6, 6–15.1 | Nuxt Design/Functional command clarifications | `CANONICAL` / `LOCAL_DELTA` at owner; `REFERENCE` / `LOCAL_BINDING` at consumers; `DELETE_DUPLICATE`: Integrated 22 stable PBC-FR-NUXT identities without changing root/layer ownership. | Operation-specific resource effects and acceptance remain explicit. | verified; no open finding |
| NCR1-P10 — Maintenance identity and stronger owner | Maintenance is bounded by stronger semantic owners; four commands replace utils without creating catch-all or bulk identities. | Design §10.9; Maintenance §2.1, PBC-FR-MAINT-003 | Maintenance Design/Functional reclassification clarifications; FR-UTIL boundary prose | `CANONICAL` / `LOCAL_DELTA` at owner; `REFERENCE` / `LOCAL_BINDING` at consumers; `DELETE_DUPLICATE`: Integrated canonical identity; retained FR-UTIL identities and filename compatibility; removed repeated ownership tests. | The specification explains its eligible resource families and compatibility seam. | verified; no open finding |
| NCR1-P11 — Coordinated Maintenance | Per-resource eligibility, plans, effects and continuation constrain multi-resource validation, repair, source-version maintenance and disposable cleanup. | Maintenance §11.1, PBC-FR-MAINT-COORD-001–032; operation requirements §§4–9 | Coordinated Maintenance Design/Functional clarifications | `CANONICAL` / `LOCAL_DELTA` at owner; `REFERENCE` / `LOCAL_BINDING` at consumers; `DELETE_DUPLICATE`: Integrated classification, no-effect/refusal, stale state and partial completion; no new AI dependency. | Validation and mutation remain distinct; cleanup is positively classified. | verified; no open finding |
| NCR1-P12 — AI project environment | Instructions, prompts, agents, skills, tools and policy form a provider-neutral resource graph; 22 operations include aggregate inspection. | Design §10.6; AI §§2.3, 4.1, PBC-FR-AI-ENV-001–012 | AI project-environment Design/Functional and earlier ownership clarification | `CANONICAL` / `LOCAL_DELTA` at owner; `REFERENCE` / `LOCAL_BINDING` at consumers; `DELETE_DUPLICATE`: Integrated scope, references, credentials and unsupported/partial representation; removed duplicate family/authority prose. | Resource families and provider mappings are explained before requirements. | verified; no open finding |
| NCR1-P13 — Coordinated Git commit | One commit invocation coordinates independent repository eligibility, staging, messages, effects and outcomes over supported managed scope. | Git §8, FR-GIT-027–039, PBC-FR-GIT-COMMIT-001–014 | Coordinated Git Design/Functional clarifications | `CANONICAL` / `LOCAL_DELTA` at owner; `REFERENCE` / `LOCAL_BINDING` at consumers; `DELETE_DUPLICATE`: Integrated selected/set/all scope, manual or optional AI messages, continuation and partial effects; no cross-repository atomicity or extra command. | Repository-specific preconditions, revision evidence and failures remain explicit. | verified; no open finding |
| NCR1-P14 — Coordinated Docs production | One documentation intent plans independent artefacts across semantic targets, with generation/update/refusal/unresolved dispositions. | Docs §10.1, FR-DOCS-PBC-001–026; §§5–13 | Coordinated Docs Design/Functional clarifications | `CANONICAL` / `LOCAL_DELTA` at owner; `REFERENCE` / `LOCAL_BINDING` at consumers; `DELETE_DUPLICATE`: Integrated plan evidence, deterministic and optional AI production, collisions, continuation and truthful partial effects. | The artefact-plan narrative explains mixed production and per-artefact postconditions. | verified; no open finding |
| NCR1-P15 — App/Settings environment delegation | App supplies lifecycle context and consumes Settings-owned persisted-definition protection/results; neither bypasses Configuration. | App FR-APP-016–018, 022–024; Settings FR-SET-060–071, 102; Configuration FR-CONFIG-020, 075 | FCL-APPSET-001–007 and duplicate App/Settings wording | `CANONICAL` / `LOCAL_DELTA` at owner; `REFERENCE` / `LOCAL_BINDING` at consumers; `DELETE_DUPLICATE`: Integrated all seven clarification clauses; no second CRUD owner, secret fabrication or independent copy bypass. | The orchestration and persisted-resource responsibilities remain visible together. | verified; no open finding |
| NCR1-P16 — Nuxt scaffold ownership | Nuxt owns profile inclusion and layer-baseline acceptance; artefact classes keep their independent Functional owners. | Nuxt FR-NUXT-055–060; participating Settings/Docs/Git/Source Transformation contracts | Nuxt layer-scaffold Functional clarification and §11.1 | `CANONICAL` / `LOCAL_DELTA` at owner; `REFERENCE` / `LOCAL_BINDING` at consumers; `DELETE_DUPLICATE`: Integrated Functional-complete semantics; DD link now explicitly downstream refinement. | The scaffold narrative names the artefact concerns and their contribution. | verified; no open finding |
| NCR1-P17 — Authority and traceability vocabulary | Design/Functional authority is separated from downstream DD/IS refinement; governance remains with the Documentation Guide. | Project Documentation Guide §§2, 4–9, 16–18, 20; Design §14; Functional traceability sections | Functional rationalisation/traceability clarifications; Design hierarchy/invariant summaries | `CANONICAL` / `LOCAL_DELTA` at owner; `REFERENCE` / `LOCAL_BINDING` at consumers; `DELETE_DUPLICATE`: Retired both meta-clarifications; split mixed table columns and added integrated requirement ranges. | Stable hierarchy locators and readable upstream/downstream labels remain. | verified; no open finding |
| NCR1-P18 — Design terminology and extensibility | Responsibility, declarative-resource, provider, topology and extension classes retain their distinct contracts; no universal plugin abstraction is inferred. | Design §§3, 6, 7, 8, 9, 13; §12 locator index | Design objectives, glossary, workflows, invariants and extension descriptions | `CANONICAL` / `LOCAL_DELTA` at owner; `REFERENCE` / `LOCAL_BINDING` at consumers; `DELETE_DUPLICATE`: Removed repeated mandates from summaries and glossary; retained independent extension, resource-validation and compatibility rules. | Definitions, explanatory diagrams and subject narratives remain at Design level. | verified; no open finding |
| NCR1-P19 — Shared Functional execution and resolution | Invocation validation/state, project resolution, configuration precedence and source-change stages retain their independent observable contracts. | Invocation §§5–19; Managed Project §§5–17; Configuration §§5–19; Source Transformation §§5–20 | Four shared Functional primaries and domain consumer bindings | `CANONICAL` / `LOCAL_DELTA` at owner; `REFERENCE` / `LOCAL_BINDING` at consumers; `DELETE_DUPLICATE`: Removed shared-contract restatements; retained deterministic resolution, uncertainty, provenance, cancellation, concurrency and recovery deltas. | Shared owners explain their models; consumers give local applicability and direct links. | verified; no open finding |
| NCR1-P20 — Remaining domain-specific obligations | Distinct operations, metadata fields, failure causes, content classes and acceptance criteria remain independently required. | Each primary requirement body or its direct canonical binding, exhaustively accounted in §5 | All 1,300 baseline FR/PBC-FR identities; added FR-APP-116 | `CANONICAL` / `LOCAL_DELTA` at owner; `REFERENCE` / `LOCAL_BINDING` at consumers; `DELETE_DUPLICATE`: 776 baseline bodies unchanged; 429 complete duplicate bodies reduced to references; 95 changed bodies retain local delta/integration; one added identity for settled generate behaviour. | Similar wording alone did not collapse distinct tests, targets, metadata or operation intents. | verified; no open finding |

## 3. NCR-1 Completion Gate

NCR-1 is complete only when:

- the root Design and complete primary Functional corpus have been read horizontally as well as vertically;
- all Design- and Functional-level temporary clarification semantics are integrated into proper primary owners;
- those clarification files are retired when no unique compatibility purpose remains;
- stable `FR-*` identifiers and observable obligations remain accounted;
- inherited Design propositions are references/local bindings rather than repeated Functional essays;
- same-level Functional contracts have one owner and precise consumers;
- traceability language does not promote downstream DD/IS names into upstream authority;
- edited documents remain coherent, navigable and human-readable without copying referenced normative material;
- NCR-1 physical metrics are recorded in PR #179; and
- unresolved NCR-1 semantic-loss, duplication or readability failures equal zero.

NCR-1 completion does not certify DD or IS reduction; those remain NCR-2 and NCR-3.

**Gate disposition:** Passed for NCR-1 after the final horizontal Design/Functional comparison. Duplicate normative restatements remaining within this scope: **0**. Unresolved semantic-loss, authority, identity, navigation or readability findings within NCR-1: **0**. This is a scoped review result supported by the accounting below; text similarity or identifier counts alone are not semantic proof. NCR-5 remains required for the full corpus.

## 4. Clarification Integration and Retirement

All eight Design and thirteen Functional clarification vehicles are retired. Their archive entries contain only non-normative lineage and successor navigation; their former normative prose is physically removed. Original text remains available at the immutable semantic baseline. The primary specifications contain the continuing contracts. No DD/IS clarification is retired in this pass.

| Retired vehicle | Primary integration destinations and semantic coverage |
|---|---|
| [appmanager-version-1-interaction-and-portability-clarification-v01.md](../archive/design/appmanager-version-1-interaction-and-portability-clarification-v01-retired.md) | Design §§4, 6.10; Invocation §9.4 / FR-INV-GUI-001–010: delivery scope, adapter parity, graphical interaction, typed composition and future-host seams. [Primary entry](../appmanager-design-specification-v01.md#_4-operating-context-and-interaction-modes). |
| [appmanager-version-1-app-command-model-clarification-v01.md](../archive/design/appmanager-version-1-app-command-model-clarification-v01-retired.md) | Design §10.3; App §§4.6, 6–15, FR-APP-116: eight commands, supporting stages/scripts, prepare/create readiness and mechanism independence. [Primary entry](../appmanager-design-specification-v01.md#_10-3-app-domain). |
| [appmanager-version-1-nuxt-command-model-clarification-v01.md](../archive/design/appmanager-version-1-nuxt-command-model-clarification-v01-retired.md) | Design §10.7; Nuxt §§4.6, 15.1 / PBC-FR-NUXT-001–022: thirteen commands and operation-specific postconditions. [Primary entry](../appmanager-design-specification-v01.md#_10-7-nuxt-domain). |
| [appmanager-version-1-maintenance-domain-clarification-v01.md](../archive/design/appmanager-version-1-maintenance-domain-clarification-v01-retired.md) | Design §10.9; Maintenance §2.1 / PBC-FR-MAINT-001–004: canonical name, stronger owner, four identities and alias constraints. [Primary entry](../appmanager-design-specification-v01.md#_10-9-maintenance-domain). |
| [appmanager-version-1-maintenance-coordinated-operations-clarification-v01.md](../archive/design/appmanager-version-1-maintenance-coordinated-operations-clarification-v01-retired.md) | Design §10.9; Maintenance §11.1 / PBC-FR-MAINT-COORD-001–032: classification, coordinated scope, bounded plans, per-resource effects, continuation and partial results. [Primary entry](../functional/utils-functional-specification-v01.md#_11-1-coordinated-resource-operations). |
| [appmanager-version-1-ai-project-environment-clarification-v01.md](../archive/design/appmanager-version-1-ai-project-environment-clarification-v01-retired.md) | Design §§10.6, 11.10; AI §§2.3, 4.1, 7.1 / PBC-FR-AI-ENV-001–017: resource graph, 22 identities, representations, policy and output acceptance. [Primary entry](../appmanager-design-specification-v01.md#_10-6-ai-domain). |
| [appmanager-version-1-git-coordinated-commit-clarification-v01.md](../archive/design/appmanager-version-1-git-coordinated-commit-clarification-v01-retired.md) | Design §10.5; Git §8 / FR-GIT-027–039 and PBC-FR-GIT-COMMIT-001–014: scope, independent staging/messages/commit evidence and continuation. [Primary entry](../functional/git-functional-specification-v01.md#_8-commit). |
| [appmanager-version-1-docs-coordinated-generation-clarification-v01.md](../archive/design/appmanager-version-1-docs-coordinated-generation-clarification-v01-retired.md) | Design §§10.4, 11.6; Docs §10.1 / FR-DOCS-PBC-001–026: artefact plans, generation/update/collision dispositions, optional AI and truthful effects. [Primary entry](../functional/docs-functional-specification-v01.md#_10-1-coordinated-artefact-production). |
| [app-settings-environment-definition-ownership-clarification-v01.md](../archive/functional/app-settings-environment-definition-ownership-clarification-v01-retired.md) | FCL-APPSET-001/002 → FR-APP-016; 003/004 → FR-APP-018 and FR-SET-059–061; 005 → FR-APP-017 and FR-SET-060/065; 006 → Design §6.6 and shared capability bindings; 007 → FR-APP-016/022–024 and Invocation acceptance. Configuration §§6, 20 retains effective-value authority. [Primary entry](../functional/app-functional-specification-v01.md#fr-app-016). |
| [ai-functional-ownership-clarification-v01.md](../archive/functional/ai-functional-ownership-clarification-v01-retired.md) | Design §10.6; AI §§1–2, 9 / FR-AI-001–005, 072–079: primary AI-resource intent versus cross-domain AI Capability consumption. [Primary entry](../functional/ai-functional-specification-v01.md#_9-ai-capability-use-by-other-domains). |
| [ai-project-environment-functional-clarification-v01.md](../archive/functional/ai-project-environment-functional-clarification-v01-retired.md) | AI §§2.3, 4.1, 7.1: all seventeen PBC-FR-AI-ENV identities integrated; architectural resource/acceptance propositions bind Design §§10.6, 11.10. [Primary entry](../functional/ai-functional-specification-v01.md#_4-1-project-side-environment-resources). |
| [app-command-model-functional-clarification-v01.md](../archive/functional/app-command-model-functional-clarification-v01-retired.md) | App §4.6 and §§6–15: eight-command catalogue, prepare terminology, subordinate post-install/re-preparation/script behaviour, root creation and generate. [Primary entry](../functional/app-functional-specification-v01.md#_4-6-canonical-version-1-command-surface). |
| [nuxt-command-model-functional-clarification-v01.md](../archive/functional/nuxt-command-model-functional-clarification-v01-retired.md) | Nuxt §§4.6, 15.1: all twenty-two PBC-FR-NUXT identities integrated; App/Quality boundaries bind their proper owners. [Primary entry](../functional/nuxt-functional-specification-v01.md#_4-6-canonical-version-1-command-surface). |
| [maintenance-domain-functional-clarification-v01.md](../archive/functional/maintenance-domain-functional-clarification-v01-retired.md) | Maintenance §2.1: all four PBC-FR-MAINT identities integrated; FR-UTIL identifiers and existing filename retained for compatibility. [Primary entry](../functional/utils-functional-specification-v01.md#_2-1-canonical-version-1-command-surface). |
| [maintenance-coordinated-operations-functional-clarification-v01.md](../archive/functional/maintenance-coordinated-operations-functional-clarification-v01-retired.md) | Maintenance §11.1: all thirty-two PBC-FR-MAINT-COORD identities integrated, including complete eligible scope, classifiers, bounded mutation and no AI dependency. [Primary entry](../functional/utils-functional-specification-v01.md#_11-1-coordinated-resource-operations). |
| [git-coordinated-commit-functional-clarification-v01.md](../archive/functional/git-coordinated-commit-functional-clarification-v01-retired.md) | Git §8.1: all fourteen PBC-FR-GIT-COMMIT identities integrated; existing FR-GIT-027/028 corrected to the accepted coordinated scope. [Primary entry](../functional/git-functional-specification-v01.md#_8-1-coordinated-commit). |
| [docs-coordinated-generation-functional-clarification-v01.md](../archive/functional/docs-coordinated-generation-functional-clarification-v01-retired.md) | Docs §10.1: all twenty-six FR-DOCS-PBC identities integrated with the plan evidence/dispositions formerly stated at Design clarification level. [Primary entry](../functional/docs-functional-specification-v01.md#_10-1-coordinated-artefact-production). |
| [functional-corpus-rationalisation-clarification-v01.md](../archive/functional/functional-corpus-rationalisation-clarification-v01-retired.md) | Design §14 and primary Functional requirement bindings/conformance sections: actual owners replace inherited restatements; identities and local deltas retained. [Primary entry](../appmanager-design-specification-v01.md#_14-specification-hierarchy-decision-provenance-and-traceability). |
| [functional-traceability-authority-vocabulary-clarification-v01.md](../archive/functional/functional-traceability-authority-vocabulary-clarification-v01-retired.md) | Design §14.9 / Documentation Guide §9; primary Functional traceability tables: upstream/same-level authorities separated from downstream refinement destinations. [Primary entry](../appmanager-design-specification-v01.md#_14-9-traceability). |
| [nuxt-layer-scaffold-functional-ownership-clarification-v01.md](../archive/functional/nuxt-layer-scaffold-functional-ownership-clarification-v01-retired.md) | Nuxt §11.1 / FR-NUXT-055–060: Functional ownership complete for profile/artefact inclusion, coordination and baseline acceptance; DD references are refinement only. [Primary entry](../functional/nuxt-functional-specification-v01.md#fr-nuxt-058). |
| [version-1-gui-interaction-clarification-v01.md](../archive/functional/version-1-gui-interaction-clarification-v01-retired.md) | Invocation §9.4: all ten FR-INV-GUI identities integrated; delivery/portability architecture remains in Design §§4, 6.10. [Primary entry](../functional/application-invocation-functional-specification-v01.md#_9-4-version-1-graphical-interaction). |

## 5. Requirement Identity and Occurrence Accounting

All **1,300** baseline requirement identities occur exactly once in the current twelve primary Functional specifications: **1,175** originally primary identities plus **125** integrated clarification identities. No identity is removed or renumbered. **FR-APP-116** adds a stable identity for the already-approved `app.generate` obligation; it adds no new command or semantics. `FR-UTIL-*` is intentionally retained despite the Maintenance domain name.

Each original identity is its stable proposition locator. Unchanged requirement bodies remain `CANONICAL` or their existing local contract. The exact reference-only identity sets below are `REFERENCE`/`LOCAL_BINDING` occurrences; their bodies point directly to the canonical owner rather than repeating its rule. The other changed sets retain `LOCAL_DELTA` plus owner references, or integrate accepted clarification semantics. This partitions the 1,300 baseline identities into 776 unchanged bodies, 429 fully reduced duplicate bodies and 95 locally meaningful revised bodies. The separate new identity accounts for the 1,301 current total.

| Primary specification | Original primary IDs | Current IDs | Reference-only bindings | Other revised baseline bodies |
|---|---:|---:|---:|---:|
| [ai-functional-specification-v01.md](../functional/ai-functional-specification-v01.md) | 105 | 122 | 46 | 6 |
| [app-functional-specification-v01.md](../functional/app-functional-specification-v01.md) | 115 | 116 | 31 | 9 |
| [application-invocation-functional-specification-v01.md](../functional/application-invocation-functional-specification-v01.md) | 51 | 61 | 12 | 7 |
| [configuration-functional-specification-v01.md](../functional/configuration-functional-specification-v01.md) | 76 | 76 | 24 | 8 |
| [docs-functional-specification-v01.md](../functional/docs-functional-specification-v01.md) | 119 | 145 | 52 | 10 |
| [git-functional-specification-v01.md](../functional/git-functional-specification-v01.md) | 114 | 128 | 38 | 8 |
| [managed-project-functional-specification-v01.md](../functional/managed-project-functional-specification-v01.md) | 61 | 61 | 31 | 1 |
| [nuxt-functional-specification-v01.md](../functional/nuxt-functional-specification-v01.md) | 113 | 135 | 38 | 5 |
| [quality-functional-specification-v01.md](../functional/quality-functional-specification-v01.md) | 116 | 116 | 36 | 2 |
| [settings-functional-specification-v01.md](../functional/settings-functional-specification-v01.md) | 116 | 116 | 27 | 6 |
| [source-transformation-functional-specification-v01.md](../functional/source-transformation-functional-specification-v01.md) | 81 | 81 | 40 | 8 |
| [utils-functional-specification-v01.md](../functional/utils-functional-specification-v01.md) | 108 | 144 | 54 | 25 |

Exact occurrence sets (inclusive numeric ranges; requirement bodies provide the direct owner links):

| Primary family | `REFERENCE` / `LOCAL_BINDING` identities | Revised bodies retaining local semantics |
|---|---|---|
| ai | FR-AI-002–004, FR-AI-006, FR-AI-008–013, FR-AI-015, FR-AI-023, FR-AI-034–035, FR-AI-043, FR-AI-047, FR-AI-050, FR-AI-052, FR-AI-055–056, FR-AI-058, FR-AI-062, FR-AI-065–066, FR-AI-072–079, FR-AI-082, FR-AI-087, FR-AI-091–094, FR-AI-097, FR-AI-099, FR-AI-101, FR-AI-103–104, PBC-FR-AI-ENV-013–015 | FR-AI-016, FR-AI-042, PBC-FR-AI-ENV-002–003, PBC-FR-AI-ENV-006, PBC-FR-AI-ENV-016 |
| app | FR-APP-001–002, FR-APP-004, FR-APP-006–010, FR-APP-012, FR-APP-033, FR-APP-038, FR-APP-041–042, FR-APP-048, FR-APP-054–055, FR-APP-058, FR-APP-061, FR-APP-065, FR-APP-077, FR-APP-079, FR-APP-088, FR-APP-090, FR-APP-100–101, FR-APP-105, FR-APP-107–109, FR-APP-111, FR-APP-115 | FR-APP-003, FR-APP-016, FR-APP-018, FR-APP-023, FR-APP-025, FR-APP-059, FR-APP-066, FR-APP-094, FR-APP-113 |
| application-invocation | FR-INV-001–002, FR-INV-008, FR-INV-017–018, FR-INV-041–042, FR-INV-044, FR-INV-GUI-002, FR-INV-GUI-005, FR-INV-GUI-008–009 | FR-INV-004, FR-INV-010, FR-INV-034, FR-INV-037, FR-INV-040, FR-INV-GUI-004, FR-INV-GUI-006 |
| configuration | FR-CONFIG-001–004, FR-CONFIG-008, FR-CONFIG-014–015, FR-CONFIG-019, FR-CONFIG-030, FR-CONFIG-035, FR-CONFIG-037, FR-CONFIG-039–040, FR-CONFIG-053, FR-CONFIG-055–059, FR-CONFIG-065, FR-CONFIG-067, FR-CONFIG-069–070, FR-CONFIG-073 | FR-CONFIG-005, FR-CONFIG-011, FR-CONFIG-020, FR-CONFIG-036, FR-CONFIG-041–043, FR-CONFIG-061 |
| docs | FR-DOCS-002, FR-DOCS-005–014, FR-DOCS-017, FR-DOCS-019, FR-DOCS-021, FR-DOCS-035–036, FR-DOCS-047–050, FR-DOCS-055, FR-DOCS-058, FR-DOCS-060, FR-DOCS-068–069, FR-DOCS-073–074, FR-DOCS-077–078, FR-DOCS-082–083, FR-DOCS-085–086, FR-DOCS-090, FR-DOCS-096, FR-DOCS-108, FR-DOCS-110–111, FR-DOCS-114, FR-DOCS-117, FR-DOCS-PBC-003–004, FR-DOCS-PBC-007, FR-DOCS-PBC-012, FR-DOCS-PBC-014, FR-DOCS-PBC-016, FR-DOCS-PBC-018, FR-DOCS-PBC-020–021, FR-DOCS-PBC-024–026 | FR-DOCS-016, FR-DOCS-018, FR-DOCS-059, FR-DOCS-PBC-005–006, FR-DOCS-PBC-008, FR-DOCS-PBC-013, FR-DOCS-PBC-015, FR-DOCS-PBC-017, FR-DOCS-PBC-023 |
| git | FR-GIT-001–002, FR-GIT-004–008, FR-GIT-010–013, FR-GIT-017, FR-GIT-019, FR-GIT-037, FR-GIT-045, FR-GIT-055, FR-GIT-057–058, FR-GIT-065, FR-GIT-067, FR-GIT-072, FR-GIT-083, FR-GIT-090, FR-GIT-096, FR-GIT-098, FR-GIT-100, FR-GIT-102–103, FR-GIT-105, FR-GIT-111, FR-GIT-113–114, PBC-FR-GIT-COMMIT-002–004, PBC-FR-GIT-COMMIT-009, PBC-FR-GIT-COMMIT-013–014 | FR-GIT-003, FR-GIT-027–028, FR-GIT-054, FR-GIT-084, PBC-FR-GIT-COMMIT-008, PBC-FR-GIT-COMMIT-011–012 |
| managed-project | FR-PROJ-001–003, FR-PROJ-011, FR-PROJ-013, FR-PROJ-015, FR-PROJ-019–023, FR-PROJ-025–027, FR-PROJ-029, FR-PROJ-031, FR-PROJ-037, FR-PROJ-039–040, FR-PROJ-043, FR-PROJ-045–046, FR-PROJ-048–051, FR-PROJ-053, FR-PROJ-056–059 | FR-PROJ-012 |
| nuxt | FR-NUXT-001–002, FR-NUXT-004, FR-NUXT-006–010, FR-NUXT-014, FR-NUXT-020, FR-NUXT-025, FR-NUXT-028, FR-NUXT-033, FR-NUXT-039–040, FR-NUXT-049, FR-NUXT-052, FR-NUXT-063–064, FR-NUXT-069, FR-NUXT-075, FR-NUXT-080, FR-NUXT-090, FR-NUXT-099–100, FR-NUXT-103–104, FR-NUXT-106, FR-NUXT-108–110, FR-NUXT-112–113, PBC-FR-NUXT-001–004, PBC-FR-NUXT-015 | FR-NUXT-003, FR-NUXT-059, FR-NUXT-062, FR-NUXT-098, FR-NUXT-102 |
| quality | FR-QUAL-002–003, FR-QUAL-006–016, FR-QUAL-018–019, FR-QUAL-024, FR-QUAL-026, FR-QUAL-057, FR-QUAL-059, FR-QUAL-065, FR-QUAL-068, FR-QUAL-070, FR-QUAL-088–090, FR-QUAL-092–093, FR-QUAL-100–101, FR-QUAL-104, FR-QUAL-107, FR-QUAL-111, FR-QUAL-113–116 | FR-QUAL-017, FR-QUAL-108 |
| settings | FR-SET-002–003, FR-SET-005–006, FR-SET-008–011, FR-SET-018–021, FR-SET-030, FR-SET-063, FR-SET-068, FR-SET-071, FR-SET-079, FR-SET-087, FR-SET-092, FR-SET-100, FR-SET-106–107, FR-SET-109–110, FR-SET-112–114 | FR-SET-007, FR-SET-025, FR-SET-060, FR-SET-086, FR-SET-102, FR-SET-111 |
| source-transformation | FR-XFORM-001–003, FR-XFORM-011–012, FR-XFORM-018–019, FR-XFORM-021–026, FR-XFORM-030, FR-XFORM-032, FR-XFORM-034, FR-XFORM-037, FR-XFORM-039, FR-XFORM-043–046, FR-XFORM-049, FR-XFORM-052, FR-XFORM-054, FR-XFORM-056–057, FR-XFORM-059, FR-XFORM-061, FR-XFORM-064–065, FR-XFORM-067, FR-XFORM-070, FR-XFORM-074, FR-XFORM-076–081 | FR-XFORM-006, FR-XFORM-015–016, FR-XFORM-035, FR-XFORM-040–041, FR-XFORM-055, FR-XFORM-060 |
| utils | FR-UTIL-001, FR-UTIL-003–004, FR-UTIL-006–008, FR-UTIL-010, FR-UTIL-012–013, FR-UTIL-016–019, FR-UTIL-022–023, FR-UTIL-026, FR-UTIL-029, FR-UTIL-056, FR-UTIL-058–059, FR-UTIL-074, FR-UTIL-080, FR-UTIL-085, FR-UTIL-089–090, FR-UTIL-093, FR-UTIL-095–096, FR-UTIL-098, FR-UTIL-100, FR-UTIL-103–104, FR-UTIL-106–107, PBC-FR-MAINT-001–002, PBC-FR-MAINT-COORD-002–003, PBC-FR-MAINT-COORD-007, PBC-FR-MAINT-COORD-009–010, PBC-FR-MAINT-COORD-012, PBC-FR-MAINT-COORD-014–016, PBC-FR-MAINT-COORD-018–019, PBC-FR-MAINT-COORD-022, PBC-FR-MAINT-COORD-025–026, PBC-FR-MAINT-COORD-028–031 | FR-UTIL-002, FR-UTIL-005, FR-UTIL-011, FR-UTIL-020–021, FR-UTIL-024, FR-UTIL-032–033, FR-UTIL-042–045, FR-UTIL-052, FR-UTIL-060, FR-UTIL-066–067, FR-UTIL-069, FR-UTIL-082–083, FR-UTIL-097, FR-UTIL-101, FR-UTIL-105, PBC-FR-MAINT-004, PBC-FR-MAINT-COORD-008, PBC-FR-MAINT-COORD-011 |

## 6. Horizontal Verification and Readability

The final horizontal pass compared the root Design, all twelve primary Functional specifications and all twenty-one clarification inputs across ownership, interaction, context, configuration, transformation, generation, AI, command surfaces and coordinated effects. It corrected residual Design/Functional result and authority restatements, App/Settings and Nuxt scaffold direction, shared scope/protection rules, AI acceptance/family restatements, mixed traceability labels and reference chains. No architecture was inferred from implementation.

Similarity candidates were reviewed as propositions, not collapsed by wording: unit/end-to-end/all-test operations, different metadata fields, root/layer scope, create/delete and add/remove intents, validation versus repair, source recognition versus application acceptance, and each domain's supported cancellation/continuation obligations remain independently meaningful. Shared reporting binds Invocation; domain-specific stop-work obligations and per-resource evidence remain local. No generic cancellation, resource, transaction or base-domain abstraction was invented.

Readability review retained local domain purposes, target models, operation sequences, postconditions and explanatory diagrams. It flattened all pure requirement-reference chains, coalesced repeated owner links and restored a missing requirement anchor. Canonical bodies remain readable at their owners. Stable FR bindings remain individually navigable for downstream traceability. Design §12 is an invariant locator index; §14 binds the existing Documentation Guide rather than recreating governance.

Verification results:

- All 34 original normative inputs are byte-identical between the semantic baseline `0d96d6e...` and the merged PR #178 baseline `6e5cd183...`.
- Missing baseline IDs: 0; duplicate requirement definitions: 0; missing stable requirement anchors: 0.
- Pure indirect bindings: 0; requirement-reference cycles: 0; repeated substantial normative paragraphs found by the exact-text scan: 0. These mechanical checks supplement the semantic comparison above.
- Broken local file/anchor links in the edited scope: 0; newly broken Markdown links across the repository: 0. The 42 pre-existing unrelated broken links remain outside this pass.
- All 21 retired vehicles have a primary successor and no remaining normative body. Active Design/Functional clarification entries: 0.
- The settled 96-command surface and stable obligations are preserved. Architectural policy, command semantics and the documentation hierarchy are unchanged.
- DD/IS changes are nine dependency-navigation lines in eight files. Their normative contracts and identities are unchanged; NCR-2 and NCR-3 are not begun.
- Whitespace/diff hygiene passes after restoring consistent LF endings and removing added trailing whitespace. No implementation tests are applicable to this documentation-only change.

**Scoped conclusion:** canonical statement count is one per accounted proposition, and duplicate normative restatements remaining in NCR-1 are zero. There are no unresolved normative conflicts or semantic-loss/readability findings. Later NCR passes remain open and receive no certification from this result.

## 7. Physical Metrics and Branch Disposition

Metrics compare the immutable semantic baseline with the final NCR-1 corpus. Lines are physical Markdown source lines; words are whitespace-delimited source tokens, including links/tables. This intentionally reproducible count is not a semantic acceptance test.

| Metric | Before | After / disposition |
|---|---:|---:|
| Changed paths in PR #179 | — | 67: 13 primary + 42 retirement source/destination + 8 downstream navigation + 4 PM/control |
| Active normative documents in scope | 34 (13 primary + 21 clarifications) | 13 primary |
| Active normative source lines | 10,780 | 11,048 |
| Active normative source words | 80,232 | 57,980 |
| Primary-only source lines / words (integration changes this population) | 8,763 / 65,233 | 11,048 / 57,980 |
| Complete duplicate requirement bodies physically replaced by direct owner bindings | — | 429 |
| Canonical anchored references introduced | — | 866 |
| Clarification vehicles integrated / retired | 21 active | 21 / 21 |
| Non-normative retirement notices, excluded from active-corpus totals | 0 | 21; 147 lines / 1,132 words |
| Stable baseline FR/PBC-FR identities | 1,300 | 1,300 preserved; FR-APP-116 added |
| Duplicate normative restatements remaining in NCR-1 | not yet reduced | 0 |
| Unresolved NCR-1 semantic/readability failures | not yet verified | 0 |

The active corpus loses 22,252 source words (27.7%). Physical line count rises because each of the 1,301 requirement identities now has an explicit stable anchor and paragraph separation; rendered normative prose is reduced. The duplicate-removal count uses a conservative, reproducible unit: one entire baseline requirement body replaced by a direct binding. Additional duplicate Design summaries, glossary entries, Functional conformance checklists and clarification restatements are physically removed but are not inflated into that count. Reference additions are the positive multiset difference of anchored links to Design, Functional or the Documentation Guide, after resolving relative paths.

All changes belong to existing branch `ai/ncr1-design-functional` and existing [PR #179](https://github.com/steve-r-lewis/app-manager/pull/179). The authoritative merge base is `origin/master` at `6e5cd1834d2b262ef7822491d6c42edc7b75cb08`; the immutable semantic baseline remains `0d96d6e0123072e8b2f57bfa25bd8f6554edfc19`. The accidentally advanced local `master` is untouched. PR #179 records final file/path counts and commit delivery. No branch/PR is created and no merge is performed.

The preceding delivery paragraph records the NCR-1 pre-merge checkpoint. PR #179 subsequently merged at `b041d440faf032b2954e5a8be2fbc7894988717f`. NCR-2 current state follows below. Version 1 implementation remains paused until NCR-5 and verification of resulting live `master`.

## 8. NCR-2 — Verified Baseline and Complete Inventory

On 2026-09-18, live `git ls-remote origin refs/heads/master`, a fresh `git fetch origin master`, and `git rev-parse origin/master` agreed on `b041d440faf032b2954e5a8be2fbc7894988717f`. GitHub reported PR #179 closed and merged at that SHA. Its head `f02bffbdb980eb61f5c592198c2c4c5dccc5788d` is an ancestor of the starting commit. NCR-1's integrated primaries, preserved identities and retirement notices are present.

The initial working tree was clean on `ai/ncr1-design-functional`. Existing local branches were that branch and `master`; local `master` was not used as authority or changed. Fresh branch `ai/ncr2-detailed-design` starts at the verified live SHA. Only this branch is used for NCR-2. NCR-3/4/5 remain future work and implementation remains paused.

The control documents were read in the requested order, followed by Design, all twelve primary Functional Specifications, all twenty-three primary Detailed Designs and all seventeen active DD clarifications. Current DD register, domain authoring guide v02, documentation assurance guidance and accepted ADR-0001 were inspected. Superseded decomposition/authoring-plan pointers are navigation, not product authority. No Implementation Specification was used to infer a DD contract.

### 8.1 Primary inventory and local proposition families

Each row covers the whole named primary, including unnumbered prose, diagrams, models, workflows, diagnostics, testability, traceability, conformance and implementation-boundary sections. Ranges identify existing definitions, not every mention of an identity. In the initial classification, owner-specific models, preconditions, ordering, uncertainty and test obligations are `CANONICAL` DD refinements / `LOCAL_DELTA` to their upstream contract. Consumed contracts are `REFERENCE` or `LOCAL_BINDING`; repeated complete bodies and repeated invariant/conclusion formulations are `DELETE_DUPLICATE` candidates, subject to clause-level preservation before removal. A recurring heading is not itself proof of duplication.

| Primary / baseline definitions | Upstream owner | Local families to preserve; horizontal comparison |
|---|---|---|
| DD-1.1; unnumbered §§1–44 | Design §§4–6; Invocation FR-INV and FR-INV-GUI | Request/caller capabilities, explicit/resolved provenance, identities/discovery, normalization/validation, authorization/preview, coordinator state, event transport/order, projection/redaction, retry/isolation, adapters and evolution. Outcome model itself belongs DD-1.2; transport/projection remains here. |
| DD-1.2; unnumbered §§1–39 | Design §11.11; Invocation §§14–17 | Evidence/status/outcome envelope, diagnostic taxonomy, warnings/messages, effect certainty, child aggregation, no-effect distinctions, progress semantics, cancellation phases, normalization, recovery/retry evidence, causal correlation, evolution and tests. Distinct from domain postconditions and invocation transport. |
| DD-1.3; DD-PROJ-001–025 and unnumbered §§1–41 | Design §9; Managed Project FR-PROJ | Target/evidence/candidate/root/context contracts, operation-specific completeness, root/layer/repository/graph identity, resource ownership, scope request/result, targetability, exclusions, partial resolution, host/headless/freshness, bootstrap collaboration and resolver testability. |
| DD-1.4; unnumbered §§1–45 | Design §8; Configuration FR-CONFIG; Settings persistence requirements | Concern/source/candidate/applicability contracts, acquisition, validation, precedence, effective value/snapshot/batch/provenance/explanation, interaction, protected values, fallback/conflict, persistence/cache/invalidation, freshness/provider policy. Bootstrap selection cannot consume unresolved project-dependent candidates. |
| DD-1.5; DD-ENG-001–102 and §§1–29 | Design §§5–6, 11; Invocation/Managed Project/Configuration and domain Functional owners | Catalogue/dispatch/execution context/checkpoints, staged bootstrap, domain delegation, bounded capability execution, acceptance, authorization, preview, cancellation/retry, concurrency, nested composition, extension and final publication. No mandatory single runtime object. |
| DD-2.1; DD-RES-001–090 and §§1–37 | Design §§6–9; Managed Project; Source Transformation | Resource identity/kind/request, path normalization, containment/indirection, reads/enumeration, preconditions/revisions, create/replace/delete/move, staging guarantees, uncertainty, sensitive transport, per-target effects and provider tests. Existing-source semantics remain DD-2.5. |
| DD-2.2; DD-PROC-001–101 and §§1–35 | Design §§6, 11; Invocation and consuming domains | Executable/argument/shell form, working context, environment/I/O, lifecycle/launch/exit/signal, availability, timeout/termination/descendants, interactive/long-running readiness, output ordering/loss, uncertain launch, concurrency and provider tests. Working directory is not a sandbox. |
| DD-2.3; DD-REPO-001–140 and §§1–42 | Git FR-GIT; Managed Project | References/recognition, status/config/refs/remotes, changes/staging, commit/init/fetch/integration/push/clone/sync/relationships, exact remote-host creation/deletion, conditional state guards, uncertain external effects and provider tests. Git domain owns coordinated intent; source structure remains DD-2.4. |
| DD-2.4; DD-SINT-001–068 and §§1–41 | Source Transformation FR-XFORM; Design §7 | Snapshot-bound request/recognition, fact-specific support, structural ranges/declarations/headers/documentation/config/composite regions, scanner/provider isolation, absent/unsupported/malformed/partial evidence, determinism/cache/cancellation and untrusted non-executing analysis. No universal StructuralFact for domain facts. |
| DD-2.5; DD-XFORM-001–090 and §§1–47 | Source Transformation FR-XFORM; Design §§6.8, 7 | Intent/strategy/immutable plan/edit/precondition/preservation contracts, preview and approval binding, freshness, execution, single/multi-target evidence, atomicity scope/staging, validation, recovery/compensation, composite source/formatting/ownership and AI proposal normalization. |
| DD-2.6; DD-REG-001–116 and §§1–45 | Settings FR-SET-081–107; Design §§6.8–6.9, 13; Source Transformation | Class-preserving registry/item identity, provenance/trust, discovery/validation, parameters/variants/rendering, deterministic derived inputs, extensions/schema evolution/conflict, content references, licence resources, cache/concurrency and tests. Similar classes do not imply one schema. |
| DD-2.7; DD-AICAP-001–093 and §§1–33 | AI FR-AI and PBC-FR-AI-ENV; consuming domain Functional owners | Task-relative availability/probes, provider/model constraints, request/context manifest/provenance/disclosure, size and trust boundaries, templates/output validation, normalization/failure/usage, timeout/retry/fallback and test providers. Distinct from AI resource graph and each consuming domain's acceptance. |
| DD-2.8; DD-QUALCAP-001–096 and §§1–36 | Quality FR-QUAL | Check-relative recognition, provider/request, findings/measurements/test/UI/coverage/lint/type/validation states, explicit criterion evaluation, composite execution, per-target evidence, generated artefacts, concurrency/freshness and tests. Domain chooses policy; tool sharing does not merge validation owners. |
| DD-2.9; DD-DOCCAP-001–100 and §§1–37 | Docs FR-DOCS / FR-DOCS-PBC | Inputs/profile/facts/model, source/domain provenance, existing authored evidence, aggregation/omissions, render/proposals, optional AI, documentation-tool lifecycle, validation/completeness, artefact evidence/freshness and provider tests. Docs domain owns output policy/acceptance. |
| DD-2.10; DD-NUXTCAP-001–101 and §§1–39 | Nuxt FR-NUXT / PBC-FR-NUXT; artefact Functional owners | Nuxt identity/recognition/configuration manageability, semantic change/validation, host-relative layers, profile/scaffold contributions, separate Git relationships, create/integrate/detach evidence and provider tests. Integrate technical support for five corrected commands without a mirrored command API. |
| DD-3.1; DD-APP-001–092, CI-001–015 and §§1–20 | App FR-APP-001–116; Settings environment contract | Lifecycle applicability/stage/result/recovery, preparation/readiness, subordinate post-install/scripts, develop/build/generate/preview, distinct clean/reset policy, composed re-preparation, safe root creation/profile acceptance. Preserve optional dependency/Git follow-ons. |
| DD-3.2; DD-GIT-001–082, CI-001–012 and §§1–19 | Git FR-GIT / PBC-FR-GIT-COMMIT | Scope/eligibility/remote/commit/sync/relationship/deletion intents, per-repository results/recovery, workflows, continuation/stale authorization and domain tests. Extend commit coordination using existing scope and continuation contracts; no common message/revision/staging assumption. |
| DD-3.3; DD-NUXT-001–092, CI-001–012 and §§1–19 | Nuxt FR-NUXT / PBC-FR-NUXT | Operation/target/applicability/configuration/profile/contribution/relationship/result/recovery contracts, orchestration and postconditions. Integrate thirteen identities and five new workflows; lifecycle-state inspection remains evidence under inspect. |
| DD-3.4; DD-DOCS-001–084, CI-001–012 and §§1–19 | Docs FR-DOCS / FR-DOCS-PBC | Target/profile/eligibility/output/coverage, source/layer/test/file workflows, generation/update/AI/tooling/aggregation, per-artefact acceptance and continuation. Integrate coordinated plans without absorbing DD-2.9 model/render semantics. |
| DD-4.1; DD-QUAL-001–084, CI-001–012 and §§1–19 | Quality FR-QUAL | Quality scope/eligibility/check/gate/composite policy, interpretation, operation-specific workflows, required/advisory/non-pass distinctions and domain tests. Reference DD-2.8 evidence/criterion schemas rather than copy them. |
| DD-4.2; DD-SET-001–085 and §§1–19 | Settings FR-SET; App FR-APP-016–018; Configuration | Semantic setting/metadata/resource scope, CRUD validation/no-op/protection, environment delegation, contributors, coupled licence effects and template management, prospective persistence and sensitive state. Similar identity fields do not merge operator and project author scopes. |
| DD-4.3; DD-AI-001–088 and §§1–19 | AI FR-AI / PBC-FR-AI-ENV | Resource identity/policy/representation/reference graph, instruction baseline/enrichment/update/deletion, support/partial state, domain result and acceptance. Expand primary to six settled resource families and twenty-two operations, retaining instruction-specific lifecycle. |
| DD-4.4; DD-UTIL-001–108 and §§1–19 | Maintenance FR-UTIL / PBC-FR-MAINT / PBC-FR-MAINT-COORD | Stronger-owner gate, headers/findings/field repair, narrow package exception, changed-file version/history transitions, positively classified disposable cleanup, per-resource coordination. Rename displayed domain to Maintenance; retain stable IDs/path. No required AI dependency. |

### 8.2 Horizontal occurrence decisions

The following families cover recurrent occurrences across the inventory. A `LOCAL_BINDING` must identify the local subject and direct owner; it is not a licence to retain a complete copied rule. `LOCAL_DELTA` is retained only when it adds an independently meaningful condition, model, workflow or guarantee. Physical actions below are planned at checkpoint A, not claimed completed.

| Family | Canonical upstream / DD refinement owner | Sibling / clarification occurrences and disposition | Readability and distinction decision |
|---|---|---|---|
| NCR2-P01 authority and acceptance | Design §§6.2, 6.6, 11.11; DD-1.5 context/delegation/acceptance | All primary purpose/non-ownership/authority/conformance/conclusion sections; rationalisation clarifications: repeated rules `DELETE_DUPLICATE`, direct `REFERENCE`; named roles `LOCAL_BINDING`. | Keep local purpose, collaborator inputs/results and domain postconditions. Provider success, domain acceptance and Engine publication remain distinct. |
| NCR2-P02 managed identity/scope | Design §9; Managed Project; DD-1.3 §§6–28 | All target/recognition/discovery/containment consumers: generic no-authority prose `DELETE_DUPLICATE`; target-specific gates `LOCAL_DELTA`. | Resource containment, Git eligibility, Docs documentability and Nuxt manageability are different predicates. |
| NCR2-P03 configuration/bootstrap | Configuration; DD-1.4 concern/candidate/snapshot; DD-1.5 §8 sequencing; DD-1.3 conflict handling | DD-1.3 §29, DD-1.4 §§8/32, DD-1.5 §§7/8; bootstrap vehicle: integrate unique sequence/applicability/conflict clauses once. Other configuration consumption sections `LOCAL_BINDING`. | Preserve project-independent bootstrap, later snapshot and scope-dependent refinement; no universal pipeline or recursion. |
| NCR2-P04 outcome and diagnostic model | Invocation FR-INV; DD-1.2 §§6–28; DD-1.1 projection/event transport | Outcome clarification and every result/diagnostic section: shared envelope/taxonomy `REFERENCE`; subject payload/category mapping `LOCAL_DELTA`. | Domain-specific fields and provider evidence states remain; no second generic envelope. |
| NCR2-P05 cancellation/retry/effects | Invocation FR-INV-030–049; DD-1.2 §§12–23; DD-1.5 §§15–18 | All failure/cancellation/recovery/conformance sections: repeated no-rollback/technical-evidence rules `DELETE_DUPLICATE`; local effect boundaries `LOCAL_DELTA`. | Preserve process descendants, remote uncertainty, non-interruptible replacement, AI usage and per-target stopping independently. |
| NCR2-P06 interaction/adapters | Design §4; Invocation FR-INV / GUI; DD-1.1 | All headless/mode sections: direct `REFERENCE` plus local missing-input `LOCAL_BINDING`; diagrams explanatory. | TUI/GUI/Headless project one model; local selectors/structured results remain intelligible. |
| NCR2-P07 generation/source mutation | Design §§6.8, 7; Source Transformation; DD-2.5 plan/preservation/validation | DD-2.1 §§17/27, DD-2.6 §§4/20/27, Docs/Nuxt/Settings/AI/Maintenance: inherited rules `REFERENCE`, actual bounded effect paths `LOCAL_BINDING`, specific preservation `LOCAL_DELTA`. | New creation, explicit replacement and semantic existing-source change remain distinct. Raw bytes do not absorb source meaning. |
| NCR2-P08 repository versus source facts | Git / Source Transformation Functional owners; DD-2.3 facts and DD-2.4 snapshot | Relationship vehicle §§1–8; DD-2.3 §§41.1, DD-2.4 §§7/26/29, Git/Maintenance consumers. Integrate snapshot/revision distinction in DD-2.4; direct consumer bindings elsewhere. | Commit revision is not uncommitted/in-memory/embedded source state. Neither sibling becomes a mandatory dependency or common provider. |
| NCR2-P09 source/domain/documentation facts | DD-2.4 §§10–16, DD-2.9 §§5–11, DD-2.10 §§5–14 | Docs/Nuxt domain models and capability integration sections: retain distinct `CANONICAL` models, reference consumed structure. | Similar location/provenance fields do not justify a universal StructuralFact or one truth source. |
| NCR2-P10 capability/domain pairs | Design §§6, 10; each domain Functional owner; DD-2.3/7/8/9/10 and DD-3.2/3/4, DD-4.1/3 | Both rationalisation vehicles, AI refinement vehicle, repeated authority tables. Consumption `LOCAL_BINDING`; own policy/model `LOCAL_DELTA`; copied mechanics `DELETE_DUPLICATE`. | Git/Repository, AI domain/capability, Quality, Docs and Nuxt pairings remain separate. |
| NCR2-P11 registry/scaffold contributions | Settings/Docs/Nuxt/App Functional owners; DD-2.6 rendering; DD-2.10 profile; DD-3.3 acceptance | Scaffold vehicle §§1–8 and DD-2.10 §§15–18/25, DD-3.3 §§7/8, DD-3.1 creation. Integrate template-only versus modeled README distinction; other repeated rules reference owners. | Preserve orchestration, artefact meaning, rendering, persistence and acceptance dimensions without forcing every artefact through every capability. |
| NCR2-P12 App/Settings environment | App FR-APP-016–018; Settings FR-SET-060–071; DD-3.1 preparation; DD-4.2 environment | App/Settings primary paragraphs and stale retired Functional references: direct owner navigation; retain lifecycle readiness and secret remaining-action delta. | Persisted creation does not imply complete secret readiness, changed process environment or changed operation snapshot. |
| NCR2-P13 root/layer/catalogue | Design §10; twelve Functional primaries; DD-1.5 catalogue | App/Nuxt/Maintenance/AI correction vehicles and stale primary lists. Replace obsolete lists with canonical catalogue references and local operation bindings. | No new commands; exactly 96. Preserve internal stage identities as supporting concepts, not catalogue extensions. |
| NCR2-P14 prior AI acceptance policy | Design §11.10; AI PBC-FR-AI-ENV-017; owning Git/Docs/AI contracts | AI environment, Git commit and Docs coordination clarifications. Shared rule `REFERENCE`; per-message/per-artefact criteria/provenance `LOCAL_DELTA`. | Human and pre-authorised deterministic automatic paths survive; provider cannot choose mode or confer authority. |
| NCR2-P15 coordinated operations | Git/Docs/Maintenance Functional coordination requirements; corresponding domain plans/results | Three coordination vehicles; existing batch/continuation sections and DD-2 evidence. Integrate domain-specific plan delta; reference shared effect semantics. | Repository commit, documentation artefact and maintenance resource plans are distinct; no transaction or generic orchestrator introduced. |
| NCR2-P16 stronger owner | Design §10.9; Maintenance Functional gate; DD-4.4 eligibility | Reclassification/coordination vehicles, DD-4.4 §§3/4/10/16/19; App/Nuxt/Quality/Settings boundaries. `REFERENCE` plus local eligibility delta. | Header version is not package/release version; temporary artefacts are positively disposable, not every reachable path. |
| NCR2-P17 portability/provider topology | Design §§6.10, 13; accepted ADR-0001 | All provider/evidence/reconciliation/deferred sections: direct references, retain provider-specific guarantees/test seams. Historical implementation paragraphs non-normative. | No code topology inferred; no universal provider/plugin/schema framework. IS remains downstream. |
| NCR2-P18 same-level authority/governance | Documentation Guide; Design §14; current DD register | Sibling/rationalisation vehicles and sequential “later DD” sections: remove rank/authoring-order framing; preserve consumption constraints and navigation. | DD number never creates superior authority. Requirement definitions/anchors survive even when their duplicate body becomes a binding. |

## 9. NCR-2 — Clarification Integration Accounting {#ncr2-clarification-integration}

The following table records checkpoint A classification and destinations. At checkpoint B all seventeen vehicles have been integrated and retired as recorded in §9.1; the table retains the original occurrence decisions for traceability. Final corpus-wide disposition is recorded in §11; this table preserves checkpoint A analysis.

| Active vehicle | Unique delta / canonical primary destination | Other occurrences / intended disposition |
|---|---|---|
| Application Core bootstrap resolution | DD-1.5 §8 staged collaboration; DD-1.4 §8 candidate applicability; DD-1.3 §29 identity conflict. Preserve DD-CORE-BOOT-001–009 exactly once. | Repeated sequence becomes direct reference; local inputs/outputs stay. Scope completion is conditional, not universal prerequisite. |
| Application outcome and diagnostic ownership | DD-1.2 envelope/taxonomy/provider mapping; DD-1.1 projection. Preserve DD-OUTCLAR-001–006 exactly once. | Remove competing envelope prose and clarify local diagnostic refinements; no mandated wire/interface/module structure. |
| DD-2 sibling authority | Guide/Design hierarchy plus each DD-2's own consumption boundaries. | Remove sequential superiority language and link owners directly; no separate new governing level. |
| DD-2 rationalisation | Guide hierarchy, primary-owned capability deltas and non-normative evidence labels. | Replace interpretive overlay with actual duplicate removal; retain meaningful capability diagrams. |
| Repository / Source Intelligence relationship | DD-2.4 source/revision and optional repository-context contract; DD-2.3 consumer navigation. | No mandatory mutual dependency; no shared universal revision type; diff is not structural fact. |
| AI Functional refinement relationship | DD-2.7 §21 and DD-4.3 domain binding. | Clarify metadata constraint versus domain ownership; cross-domain AI remains with consumer. |
| Nuxt layer scaffold artefact ownership | DD-2.10 §§15–16/25 local artefact delegation; DD-3.3 contribution/acceptance binding. | DD-2.6 rendering and DD-2.9 modeling referenced directly; licence semantics remain Settings-owned. |
| Nuxt command model capability | DD-2.10 bounded scaffold/module/version/analysis/generated-state evidence. | Five technical concerns, no forced thirteen-method API, no domain ownership transfer. |
| App command model | DD-3.1 identity/lifecycle/script sections. | Prepare/create/generate integrated; post-install/scripts subordinate; reset+prepare composition under Engine. |
| DD-3/DD-4 rationalisation | Eight primaries' local bindings/deltas; hierarchy from Guide/Design. | Physically remove repeats; retain all domain contracts/IDs. Old eight-command Nuxt list superseded by settled thirteen. |
| Coordinated Git commit | DD-3.2 commit intent/workflow/result. | Reuse scope/continuation/recovery; per-repository staging/message/revision remains independent. |
| Coordinated Docs generation | DD-3.4 output plan/workflow/acceptance. | Mixed dispositions, immutable/stale plan, prior AI criteria, per-artefact evidence and dependencies. |
| Earlier Nuxt operation identity | DD-3.3 identity and inspect result. | No separate inspect-layer-state identity; retain lifecycle observability. Thirteen-command upstream catalogue supersedes old list; IS is not authority. |
| Nuxt domain command model | DD-3.3 five operation-specific orchestration contracts. | Preserve one selected target, supported scaffold/module/version policy/analysis/cleanup postconditions; no generic generator. |
| Maintenance reclassification | DD-4.4 title/identity/stronger-owner gate. | Preserve DD-UTIL IDs and filename compatibility; four canonical maintenance operations. |
| Coordinated Maintenance operations | DD-4.4 classification/plan/operation/continuation/result. | Stable target set, per-resource metadata transitions, positive disposability, independent stale/acceptance evidence; no new AI dependency. |
| AI project environment domain | DD-4.3 resource graph/representation/result and resource lifecycle. | Six resource classes, references/partial representation, policy narrowing, Settings credential boundary, twenty-two operations; shared proposal rule links upstream. |

### 9.1 Checkpoint B integration and retirement

All 17 vehicles are retired after clause comparison with their primary successors. The nine bootstrap identities and six outcome clarification identities now have one definition each in DD-1; the total definition multiset remains 1,915, including the 1,900 pre-existing primary definitions. No stable DD identity was removed or added.

Bootstrap applicability/source classes and operation-snapshot eligibility are in DD-1.4 §8; project conflict reporting is in DD-1.3 §29; staged dependencies, re-evaluation and bounded resolution are in DD-1.5 §8. Stage-specific diagnostic conditions are in DD-1.4 §32. Outcome/taxonomy/provider mapping is in DD-1.2; caller projection and preview/rejection mapping are in DD-1.1 §22. Compatibility permits separate internal/transport representations with semantic equivalence tests.

Repository/source snapshot distinctions and optional contextual composition are in DD-2.4 §7.4 with a DD-2.3 consumption link. AI Functional metadata allocation is in DD-2.7 §21. Nuxt technical support is in DD-2.10 §6.1; scaffold delegation and the template-only versus modeled README paths are in §16, alongside the Settings/licence binding. Existing primary profile, mutation and acceptance clauses retain the remaining scaffold semantics.

App identity/preparation/create/generate and subordinate stages are integrated in DD-3.1 §§7–8. Nuxt's thirteen-identity binding, lifecycle-state projection and five operation workflows are in DD-3.3 §§7–8. AI's six-family resource graph, representation/reference states and family lifecycle are in DD-4.3 §§7–8. Maintenance display identity and stronger-owner-before-planning gate are integrated in DD-4.4, retaining its filename and DD-UTIL identities. Existing optional AI uses are preserved; coordination introduces no new AI dependency.

Git's per-repository intent and accepted-message provenance are integrated in DD-3.2 §§7–8. Docs' heterogeneous artefact plan, prior criteria, per-artefact acceptance and dependent continuation are in DD-3.4 §§7.5/8.11. Maintenance's classification/resource plan and independent version transitions are in DD-4.4 §§7–8/12. These are distinct domain compositions, not equivalent record shapes or a shared transaction model.

The three sibling/rationalisation vehicles' process rules are integrated into the Documentation Guide §7.10, alongside its existing hierarchy/identity rules. Sequential superiority framing was removed from primary DD-2 sections, historical implementation observations are labeled non-normative, and capability/domain local contracts remain in their owners. Physical inherited-prose reduction continues at checkpoint C; retirement does not certify zero duplicates yet.

Retirement lineage (all non-normative; prior text recoverable at both immutable baselines):

- [ai-functional-refinement-relationship-clarification-v01](../archive/detailed-design/ai-functional-refinement-relationship-clarification-v01-retired.md)
- [ai-project-environment-domain-clarification-v01](../archive/detailed-design/ai-project-environment-domain-clarification-v01-retired.md)
- [app-domain-command-model-clarification-v01](../archive/detailed-design/app-domain-command-model-clarification-v01-retired.md)
- [application-core-bootstrap-resolution-clarification-v01](../archive/detailed-design/application-core-bootstrap-resolution-clarification-v01-retired.md)
- [application-outcome-and-diagnostic-ownership-clarification-v01](../archive/detailed-design/application-outcome-and-diagnostic-ownership-clarification-v01-retired.md)
- [dd2-shared-capability-rationalisation-clarification-v01](../archive/detailed-design/dd2-shared-capability-rationalisation-clarification-v01-retired.md)
- [dd2-sibling-authority-clarification-v01](../archive/detailed-design/dd2-sibling-authority-clarification-v01-retired.md)
- [dd3-dd4-domain-rationalisation-clarification-v01](../archive/detailed-design/dd3-dd4-domain-rationalisation-clarification-v01-retired.md)
- [docs-coordinated-generation-clarification-v01](../archive/detailed-design/docs-coordinated-generation-clarification-v01-retired.md)
- [git-coordinated-commit-clarification-v01](../archive/detailed-design/git-coordinated-commit-clarification-v01-retired.md)
- [maintenance-coordinated-operations-clarification-v01](../archive/detailed-design/maintenance-coordinated-operations-clarification-v01-retired.md)
- [maintenance-domain-reclassification-clarification-v01](../archive/detailed-design/maintenance-domain-reclassification-clarification-v01-retired.md)
- [nuxt-command-model-capability-clarification-v01](../archive/detailed-design/nuxt-command-model-capability-clarification-v01-retired.md)
- [nuxt-domain-command-model-clarification-v01](../archive/detailed-design/nuxt-domain-command-model-clarification-v01-retired.md)
- [nuxt-domain-operation-identity-clarification-v01](../archive/detailed-design/nuxt-domain-operation-identity-clarification-v01-retired.md)
- [nuxt-layer-scaffold-artefact-ownership-clarification-v01](../archive/detailed-design/nuxt-layer-scaffold-artefact-ownership-clarification-v01-retired.md)
- [repository-source-intelligence-relationship-clarification-v01](../archive/detailed-design/repository-source-intelligence-relationship-clarification-v01-retired.md)

### 9.2 Downstream navigation-only repairs

The following seven Implementation files each change one existing metadata/navigation line only. The complete diffs were inspected; all body content below metadata remains byte-for-byte unchanged. No Implementation clarification is retired or semantically reduced.

- `docs/implementation/is-1-application-runtime-and-invocation-implementation-specification-v01.md`: direct primary DD authority-source link/label replaces retired clarification navigation.
- `docs/implementation/is-13-nuxt-capability-implementation-specification-v01.md`: direct primary DD authority-source link/label replaces retired clarification navigation.
- `docs/implementation/is-16-nuxt-domain-implementation-specification-v01.md`: direct primary DD authority-source link/label replaces retired clarification navigation.
- `docs/implementation/is-2-managed-project-resolution-implementation-specification-v01.md`: direct primary DD authority-source link/label replaces retired clarification navigation.
- `docs/implementation/is-3-configuration-resolution-implementation-specification-v01.md`: direct primary DD authority-source link/label replaces retired clarification navigation.
- `docs/implementation/clarifications/app-command-model-implementation-clarification-v01.md`: direct primary DD authority-source link/label replaces retired clarification navigation.
- `docs/implementation/clarifications/nuxt-command-model-implementation-clarification-v01.md`: direct primary DD authority-source link/label replaces retired clarification navigation.

The two Nuxt Functional links to the scaffold clarification also point directly to DD-2.10 §16; no Functional requirement body or identity changes.

## 10. NCR-2 — Physical Metrics and Completion Gate

Baseline metrics use UTF-8 source, whitespace-separated words and `splitlines()` physical lines. Archive notices are excluded from active normative totals.

| Population at physical starting baseline | Documents | Words | Lines | Bytes |
|---|---:|---:|---:|---:|
| Primary Detailed Designs | 23 | 132,679 | 22,747 | 1,092,260 |
| Active DD clarifications | 17 | 12,908 | 1,837 | 104,915 |
| Total NCR-2 active scope | 40 | 145,587 | 24,584 | 1,197,175 |

Checkpoint A is committed as `23c325a871214dc117b3b0f9cfe7bd30d1feaead`; draft [PR #180](https://github.com/steve-r-lewis/app-manager/pull/180) is the single NCR-2 PR. Checkpoint B integrates and retires all seventeen DD vehicles with 1,915 definitions preserved. Limited duplicate bodies directly affected by integration have been removed; complete physical reduction and final horizontal verification remain outstanding. Checkpoint B verification: all 1,915 DD definitions preserved as a multiset; all 17 active DD vehicle files replaced by 17 seven-line lineage notices; new/changed Markdown link targets and anchors resolve; seven IS bodies unchanged below metadata; `git diff --check` passes. Counts of remaining duplicate propositions and unresolved semantic/readability findings are **not yet verified**. NCR-2 is not complete. NCR-3 has not begun.


Checkpoint C interim: 179 reviewed requirement bodies reduced across DD-2.1 through DD-2.5, plus duplicate purpose/conformance summaries in the first three. All 1,915 definitions remain, now with stable direct anchors. New links checked, one synchronization anchor corrected, and `git diff --check` passes after EOF normalization. The rest of the primary corpus and final horizontal review remain outstanding; this is not checkpoint C completion.

Checkpoint C shared-capability interim: the first numbered-clause pass covers all ten DD-2 primaries, with 409 distinct duplicate bodies replaced so far. Duplicate purpose/final rule collections and conformance checklists have been removed from all ten, retaining architecture diagrams and local models/workflows. Same-shaped registry classes, source/domain facts, Quality criteria, and provider lifecycle contracts remain distinct. Definition multiset remains 1,915; new link/anchor checks and `git diff --check` pass. Additional unnumbered DD-2 prose, DD-1 and domain reduction plus final horizontal verification remain outstanding.

The next domain checkpoint reviews App, Git and Nuxt numbered clauses against their Functional owners and shared execution contracts. 622 distinct requirement bodies have now been reduced across the ongoing C pass. App script discovery retains its read-only delta; named lifecycle preference and absence of implicit script lifecycle stages have separate direct Functional references. Git retains exact-target authorization invalidation, operation-specific eligibility, uncertain-effect recovery, non-idempotent commit retry, coordinated commit/message provenance and provider-substitution test obligations. Nuxt retains its independent target/applicability/creation/contribution/relationship/recovery models, required-versus-optional stage rule, host-relative validity, concurrent mutation guards and five integrated operation workflows. These similarly shaped models are domain specializations, not candidates for a universal plan or result framework. The final horizontal review, remaining domains, DD-1 and unnumbered occurrence pass remain open; this is not the NCR-2 completion gate.

The Docs/Quality/Settings checkpoint brings the ongoing C pass to 842 distinct reduced requirement bodies. Docs retains the profile-relative coverage model, per-artefact plan, prior AI criteria, ownership-sensitive replacement delta, indeterminate persistence and dependency-aware continuation. Quality retains operation-policy immutability, eligibility versus gate interpretation, non-pass policy exceptions, provider-content constraints, concurrency handling, deterministic gate evaluation and boundary tests; a measurement, finding and gate decision are distinct contracts. Settings retains class-specific scope/identity, coupled-effect planning, observation/mutation revisions, unsupported-versus-absent state, secret-reveal boundary, sensitivity propagation and external-acquisition constraints. Operator identity, contributor identity and provider/resource identity remain distinct despite similar fields. These passes leave AI, Maintenance, DD-1, unnumbered occurrences and the final full-corpus horizontal verification open. No completion claim is made.

The AI/Maintenance checkpoint brings the ongoing C pass to 1007 distinct reduced requirement bodies. AI retains the integrated project resource graph, family lifecycle, provider association versus availability distinction, required-enrichment policy, stale-sensitive creation/deletion, local-effect uncertainty and secret exclusion from baseline documents. Maintenance retains the stronger-owner gate before acceptance/planning, current per-resource revision/history evidence, coordinated eligibility/plan, cancellation before each new effect, policy/dependency continuation, non-idempotent source-version evidence and bounded positive cleanup classification. Existing optional AI paths remain optional and no coordinated operation acquires an AI dependency. DD-1, unnumbered occurrences, direct-reference flattening and final complete-corpus horizontal/semantic preservation verification remain open.

The Application Core checkpoint covers DD-1.1, DD-1.2 and DD-1.3: 1029 distinct numbered requirement bodies and 101 unnumbered sections are recorded in the ongoing C pass. Invocation retains intent immutability, request/provenance fields, command descriptors, structural validation, authorization-to-plan binding, channel ordering, late-cancellation resolution and invocation isolation. Outcomes retains status layers, canonical field families, diagnostic taxonomy, effect/child models, uncertainty, cancellation phases, local evidence normalization, deterministic aggregation, redaction and compatibility. Managed Project retains evidence/candidate/context/scope/targetability models, read-only coherent context, explicit multi-project exception, root-entity/path distinction, partial-scope gating, project-local diagnostics and bootstrap conflict handling. The command identity representation note now explicitly binds the settled Functional catalogues, leaving only concrete representation below DD. DD-1.4/DD-1.5 and the final unnumbered/horizontal review remain open.

Configuration/Engine checkpoint: 1109 distinct numbered bodies and 173 unnumbered sections are recorded so far. Configuration retains candidate applicability, staged bootstrap, resolution/snapshot/provenance models, sensitivity propagation, fallback/conflict and cache invalidation. Engine retains registration, execution context, policy checkpoints, least-context delegation, bounded bootstrap, nested authorization and provider fallback constraints. Historical audit text is explicitly non-normative; AI primary-use-case routing is bound to Design authority without suggesting an exception for provider output. Full unnumbered and horizontal review remains open; no zero-duplicate or NCR-2 completion claim is made.


Horizontal preservation correction: DD-QUALCAP-093 retains the complete local untrusted-report condition; DD-QUAL-072 now binds it directly. Design §6.6 alone was too broad a replacement. AI project-input handling now points directly to FR-AI-090 with its provider/disclosure/intent binding. Repository/Nuxt relationship references now point directly to FR-NUXT-017. Settings sensitivity propagation binds DD-1.4 §22.4 across its local representations. These corrections are semantic review results, not evidence from similarity scanning.

Horizontal collaboration checkpoint: 1110 distinct numbered replacement decisions and 218 unnumbered decisions are recorded. All ten DD-2 consumer maps now bind sibling owners directly where edited; domain purpose narratives retain their local models/workflows with direct upstream context. The Settings, AI and Maintenance repeated closing invariant lists were removed. The complete active DD/IS navigation scan checks existing as well as new inbound links. Final semantic/cardinality review remains open.


Documentation preservation correction: DD-DOCCAP-097 is the complete canonical untrusted-content clause, incorporating the template/command-authority coverage formerly repeated by DD-DOCS-074. The domain now binds it directly. A broad Design provider-boundary reference was insufficient for that full content contract.

Safety-list classification: DD-2.8 §30, DD-2.9 §31 and DD-2.10 §29 retain local threat/exposure examples as LOCAL_BINDING indexes to the local safety clauses and Design §9.9. Their repeated mandatory-list wrapper is removed; numbered safety requirements and distinct local exposure cases remain.

Retirement navigation sweep: primary DD metadata and prose now identify integrated bootstrap, outcome, scaffold and App/Settings owners directly rather than referring to retired clarification vehicles by name. Header lists are labeled sources/navigation so lifecycle registers and authoring guidance are not presented as product authority. Stable decomposition and requirement identities are unchanged.

Horizontal distinction checkpoint: 1121 distinct numbered reduction decisions and 218 unnumbered decisions are recorded. Similarity candidates were reviewed semantically: Source Intelligence fact substitution differs from Source Transformation plan/preservation substitution; AI output capability, Quality report/UI support and Documentation profile/tooling support have different compatibility predicates; App recovery and Nuxt recovery remain separate compositions (Nuxt includes actual relationship state); concrete provider tests remain capability-specific. Repeated no-framework clauses now bind DD-ENG-046/Design §13.2 without introducing an abstraction. Quality technical-check registration binds the domain semantic-owner decision. Explicit DD-ID reference graph: zero cycles; two multi-edge paths link distinct complete snapshot/scope and stage/plan contracts rather than duplicate aliases. Active DD/IS navigation: 1,969 targets checked, zero errors; new-link check: 2,056 targets, zero errors; all 1,915 DD definitions preserved. Complete semantic/cardinality verification remains open.


Core horizontal follow-up: DD-1.3 §17.2 and DD-1.4 §§4/16.2/32 now reference the Engine bootstrap/scope owners instead of repeating staging rules; their diagrams, snapshot associations and local diagnostic classes remain. DD-1.2 §32 binds its capability evidence map to canonical normalization/category mapping. DD-CORE-BOOT-008 now binds candidate acquisition and Headless fallback directly upstream.

Retained-clause checkpoint: 1220 distinct numbered reduction decisions and 220 unnumbered decisions are recorded. A second retained-clause review of all ten DD-2 owners removed further Functional repetition in AI retry/context, Quality tests/coverage/gates, Documentation coverage/tooling and Nuxt identity/configuration/scaffolding. Distinct request/state/provider compatibility and technical effect guarantees remain. Nuxt identity cannot be inferred from repository evidence (DD-NUXTCAP-008 local delta) separately from FR-NUXT-017 integration; Documentation unknown required meaning remains canonical DD-DOCCAP-013 because the narrower source/test Functional clauses do not cover every model relationship. Core bootstrap/preview/category mapping was also checked horizontally. All 1,915 DD definitions are preserved; 2,199 new targets resolve. Seven IS bodies remain unchanged below metadata, Design is unchanged, Functional identities are unchanged and Nuxt Functional changes are exactly two downstream navigation repairs. Remaining retained core/domain clauses and final cardinality/readability verification remain open.


Core retained-clause review: DD-PROJ-007/008/010 remain distinct read-only context, coherent per-operation identity and root-entity/path contracts. DD-ENG-001 registration, 003 context, 004 checkpoints, 005 workflow, 015 compatibility, 018 requested/resolved distinctions, 024 stale assumptions, 027 changed plans, 033 upward-call boundary, 035 least-context delegation, 039/040 fallback/availability, 046 abstraction criterion, 048 technical rejection, 051 authorization evidence, 076 conflicts, 084/085 nested invocation, 094 extension fields, 097 executable-extension design and 100 invariant failure retain their local refinements. The repeated second registration sentence and repeated immutable-context sentence were removed. Bootstrap re-evaluation binds 024/027 while retaining provider selection, provenance and unresolved-conflict deltas.

Checkpoint C — primary physical reduction complete; final checkpoint D verification pending. The retained-clause comparison now includes all 23 primaries, in addition to the complete initial vertical/horizontal read. 1257 distinct numbered bodies and 220 unnumbered section decisions have been reduced, with local deltas retained and canonical restorations excluded. App stage/recovery semantics, Git coordinated intent/message provenance, Nuxt artefact contributions, Docs profile/artefact acceptance, Quality policy/evaluation, Settings class-specific mutations, AI resource graph and Maintenance stronger-owner/per-resource workflow remain independently readable and distinct. Final completion, clean-tree/push and review-readiness gates are not claimed at this checkpoint.

### 10.1 Physical occurrence decisions

Each row records a reviewed `DELETE_DUPLICATE` body replaced by `REFERENCE`/`LOCAL_BINDING`, retaining identified `LOCAL_DELTA`. Canonical clauses restored during preservation review are excluded from this deletion table. Retained local contracts are accounted by the complete §8 inventory and horizontal distinction decisions above.

| Occurrence | Direct owner references after reduction |
|---|---|
| `DD-RES-002` | [Design](../appmanager-design-specification-v01.md#_9-6-project-discovery-and-context-resolution) |
| `DD-RES-009` | [Design](../appmanager-design-specification-v01.md#_6-6-capability-boundaries-and-providers) |
| `DD-RES-010` | [DD-RES-001](../dd_2_shared_capabilities/dd-2-1-resource-access-detailed-design-v01.md#dd-res-001); [Design](../appmanager-design-specification-v01.md#_9-6-project-discovery-and-context-resolution) |
| `DD-RES-016` | [Design](../appmanager-design-specification-v01.md#_9-9-non-destructive-ownership-and-unmanaged-content) |
| `DD-RES-026` | [Design](../appmanager-design-specification-v01.md#_9-6-project-discovery-and-context-resolution) |
| `DD-RES-028` | [Design](../appmanager-design-specification-v01.md#_6-2-application-engine-authority) |
| `DD-RES-038` | [DD-1.2 Consequential Effects](../dd_1_application_core/dd-1-2-execution-outcomes-detailed-design-v01.md#_12-consequential-effects) |
| `DD-RES-042` | [DD-1.2 Partial Completion](../dd_1_application_core/dd-1-2-execution-outcomes-detailed-design-v01.md#_14-partial-completion) |
| `DD-RES-052` | [DD-1.2 Sensitive Information and Redaction](../dd_1_application_core/dd-1-2-execution-outcomes-detailed-design-v01.md#_24-sensitive-information-and-redaction) |
| `DD-RES-053` | [DD-1.2 Sensitive Information and Redaction](../dd_1_application_core/dd-1-2-execution-outcomes-detailed-design-v01.md#_24-sensitive-information-and-redaction) |
| `DD-RES-055` | [DD-1.2 Cancellation Model](../dd_1_application_core/dd-1-2-execution-outcomes-detailed-design-v01.md#_17-cancellation-model) |
| `DD-RES-057` | [DD-1.2 Cancellation Model](../dd_1_application_core/dd-1-2-execution-outcomes-detailed-design-v01.md#_17-cancellation-model) |
| `DD-RES-059` | [DD-1.2 Provider Result Normalization](../dd_1_application_core/dd-1-2-execution-outcomes-detailed-design-v01.md#_18-provider-result-normalization) |
| `DD-RES-061` | [Design](../appmanager-design-specification-v01.md#_11-11-workflow-results-failure-and-acceptance) |
| `DD-RES-062` | [DD-1.2 Proposed Effects and Preview](../dd_1_application_core/dd-1-2-execution-outcomes-detailed-design-v01.md#_13-proposed-effects-and-preview) |
| `DD-RES-064` | [DD-1.4 effective values](../dd_1_application_core/dd-1-4-configuration-resolution-detailed-design-v01.md#_15-resolution-result) |
| `DD-RES-068` | [Design](../appmanager-design-specification-v01.md#_6-6-capability-boundaries-and-providers); [Documentation Guide implementation boundary](../project-documentation-guide-v01.md#_8-level-4-implementation-specification) |
| `DD-RES-072` | [DD-RES-008](../dd_2_shared_capabilities/dd-2-1-resource-access-detailed-design-v01.md#dd-res-008); [DD-RES-013](../dd_2_shared_capabilities/dd-2-1-resource-access-detailed-design-v01.md#dd-res-013); [Design](../appmanager-design-specification-v01.md#_9-6-project-discovery-and-context-resolution) |
| `DD-RES-073` | [DD-RES-011](../dd_2_shared_capabilities/dd-2-1-resource-access-detailed-design-v01.md#dd-res-011); [DD-RES-013](../dd_2_shared_capabilities/dd-2-1-resource-access-detailed-design-v01.md#dd-res-013); [DD-RES-084](../dd_2_shared_capabilities/dd-2-1-resource-access-detailed-design-v01.md#dd-res-084) |
| `DD-RES-074` | [Design](../appmanager-design-specification-v01.md#_9-9-non-destructive-ownership-and-unmanaged-content) |
| `DD-RES-075` | [DD-1.2 child results](../dd_1_application_core/dd-1-2-execution-outcomes-detailed-design-v01.md#_14-partial-completion) |
| `DD-RES-077` | [DD-1.2 subordinate results](../dd_1_application_core/dd-1-2-execution-outcomes-detailed-design-v01.md#_14-partial-completion) |
| `DD-RES-080` | [DD-1.2 Retryability and Repetition Evidence](../dd_1_application_core/dd-1-2-execution-outcomes-detailed-design-v01.md#_22-retryability-and-repetition-evidence) |
| `DD-RES-083` | [Design](../appmanager-design-specification-v01.md#_9-9-non-destructive-ownership-and-unmanaged-content) |
| `DD-RES-085` | [DD-RES-004](../dd_2_shared_capabilities/dd-2-1-resource-access-detailed-design-v01.md#dd-res-004) |
| `DD-RES-086` | [DD-RES-005](../dd_2_shared_capabilities/dd-2-1-resource-access-detailed-design-v01.md#dd-res-005) |
| `DD-RES-087` | [DD-RES-043](../dd_2_shared_capabilities/dd-2-1-resource-access-detailed-design-v01.md#dd-res-043); [DD-RES-044](../dd_2_shared_capabilities/dd-2-1-resource-access-detailed-design-v01.md#dd-res-044) |
| `DD-RES-088` | [Design §6.2](../appmanager-design-specification-v01.md#_6-2-application-engine-authority); [DD-RES-065](../dd_2_shared_capabilities/dd-2-1-resource-access-detailed-design-v01.md#dd-res-065) |
| `DD-RES-089` | [DD-1.2 Sensitive Information and Redaction](../dd_1_application_core/dd-1-2-execution-outcomes-detailed-design-v01.md#_24-sensitive-information-and-redaction) |
| `DD-RES-090` | [DD-1.2 Consequential Effects](../dd_1_application_core/dd-1-2-execution-outcomes-detailed-design-v01.md#_12-consequential-effects); [DD-1.2 Cancellation Model](../dd_1_application_core/dd-1-2-execution-outcomes-detailed-design-v01.md#_17-cancellation-model) |
| `DD-PROC-016` | [DD-PROC-084](../dd_2_shared_capabilities/dd-2-2-process-execution-detailed-design-v01.md#dd-proc-084); [DD-1.2 redaction](../dd_1_application_core/dd-1-2-execution-outcomes-detailed-design-v01.md#_24-sensitive-information-and-redaction) |
| `DD-PROC-019` | [Design](../appmanager-design-specification-v01.md#_9-6-project-discovery-and-context-resolution) |
| `DD-PROC-023` | [DD-1.4 effective values](../dd_1_application_core/dd-1-4-configuration-resolution-detailed-design-v01.md#_15-resolution-result) |
| `DD-PROC-025` | [DD-PROC-084](../dd_2_shared_capabilities/dd-2-2-process-execution-detailed-design-v01.md#dd-proc-084); [DD-1.2 redaction](../dd_1_application_core/dd-1-2-execution-outcomes-detailed-design-v01.md#_24-sensitive-information-and-redaction) |
| `DD-PROC-027` | [DD-1.2 redaction](../dd_1_application_core/dd-1-2-execution-outcomes-detailed-design-v01.md#_24-sensitive-information-and-redaction) |
| `DD-PROC-030` | [DD-PROC-084](../dd_2_shared_capabilities/dd-2-2-process-execution-detailed-design-v01.md#dd-proc-084); [DD-1.2 redaction](../dd_1_application_core/dd-1-2-execution-outcomes-detailed-design-v01.md#_24-sensitive-information-and-redaction) |
| `DD-PROC-042` | [DD-1.2 application interpretation](../dd_1_application_core/dd-1-2-execution-outcomes-detailed-design-v01.md#_19-application-level-interpretation) |
| `DD-PROC-045` | [DD-1.2 normalization](../dd_1_application_core/dd-1-2-execution-outcomes-detailed-design-v01.md#_18-provider-result-normalization) |
| `DD-PROC-049` | [DD-1.1 command availability](../dd_1_application_core/dd-1-1-application-invocation-detailed-design-v01.md) |
| `DD-PROC-052` | [DD-1.2 consequential effects](../dd_1_application_core/dd-1-2-execution-outcomes-detailed-design-v01.md#_12-consequential-effects) |
| `DD-PROC-066` | [Design](../appmanager-design-specification-v01.md#_4-6-presentation-independence) |
| `DD-PROC-069` | [DD-1.2 correlation](../dd_1_application_core/dd-1-2-execution-outcomes-detailed-design-v01.md#_25-correlation-and-causality) |
| `DD-PROC-072` | [DD-1.2 normalization](../dd_1_application_core/dd-1-2-execution-outcomes-detailed-design-v01.md#_18-provider-result-normalization) |
| `DD-PROC-073` | [DD-1.2 redaction](../dd_1_application_core/dd-1-2-execution-outcomes-detailed-design-v01.md#_24-sensitive-information-and-redaction) |
| `DD-PROC-075` | [DD-1.2 retry evidence](../dd_1_application_core/dd-1-2-execution-outcomes-detailed-design-v01.md#_22-retryability-and-repetition-evidence) |
| `DD-PROC-077` | [DD-PROC-048](../dd_2_shared_capabilities/dd-2-2-process-execution-detailed-design-v01.md#dd-proc-048) |
| `DD-PROC-086` | [DD-PROC-021](../dd_2_shared_capabilities/dd-2-2-process-execution-detailed-design-v01.md#dd-proc-021) |
| `DD-PROC-087` | [DD-1.2 evidence/status layers](../dd_1_application_core/dd-1-2-execution-outcomes-detailed-design-v01.md#_6-core-status-model) |
| `DD-PROC-089` | [DD-PROC-061](../dd_2_shared_capabilities/dd-2-2-process-execution-detailed-design-v01.md#dd-proc-061) |
| `DD-PROC-090` | [DD-3.1 declared-script selection](../dd_3_high_coupling_domains/dd-3-1-app-domain-detailed-design-v01.md#dd-app-009) |
| `DD-PROC-094` | [Design](../appmanager-design-specification-v01.md#_6-6-capability-boundaries-and-providers) |
| `DD-PROC-095` | [Documentation Guide §7.5](../project-documentation-guide-v01.md#_7-5-permanent-design-versus-migration-design) |
| `DD-PROC-098` | [Documentation Guide Level 4 boundary](../project-documentation-guide-v01.md#_8-level-4-implementation-specification) |
| `DD-REPO-002` | [Design](../appmanager-design-specification-v01.md#_6-6-capability-boundaries-and-providers) |
| `DD-REPO-003` | [DD-REPO-001](../dd_2_shared_capabilities/dd-2-3-repository-capability-detailed-design-v01.md#dd-repo-001) |
| `DD-REPO-007` | [Design](../appmanager-design-specification-v01.md#_9-6-project-discovery-and-context-resolution) |
| `DD-REPO-011` | [Design](../appmanager-design-specification-v01.md#_11-11-workflow-results-failure-and-acceptance); [source-snapshot distinction](../dd_2_shared_capabilities/dd-2-4-source-intelligence-detailed-design-v01.md#repository-context) |
| `DD-REPO-017` | [Design](../appmanager-design-specification-v01.md#_9-9-non-destructive-ownership-and-unmanaged-content) |
| `DD-REPO-019` | [DD-1.2 redaction](../dd_1_application_core/dd-1-2-execution-outcomes-detailed-design-v01.md#_24-sensitive-information-and-redaction) |
| `DD-REPO-029` | [Design](../appmanager-design-specification-v01.md#_6-6-capability-boundaries-and-providers) |
| `DD-REPO-044` | [Git commit contract](../functional/git-functional-specification-v01.md#_8-commit) |
| `DD-REPO-058` | [Design](../appmanager-design-specification-v01.md#_11-11-workflow-results-failure-and-acceptance) |
| `DD-REPO-064` | [Git synchronization contract](../functional/git-functional-specification-v01.md#_11-synchronisation) |
| `DD-REPO-070` | [Git push use case](../functional/git-functional-specification-v01.md#_9-push) |
| `DD-REPO-074` | [Git domain scope and orchestration contracts](../dd_3_high_coupling_domains/dd-3-2-git-domain-detailed-design-v01.md#_7-domain-contract-model) |
| `DD-REPO-078` | [Design](../appmanager-design-specification-v01.md#_9-6-project-discovery-and-context-resolution) |
| `DD-REPO-081` | [Nuxt relationship contract](../dd_3_high_coupling_domains/dd-3-3-nuxt-domain-detailed-design-v01.md#_8-7-layer-integration) |
| `DD-REPO-085` | [FR-NUXT-017](../functional/nuxt-functional-specification-v01.md#fr-nuxt-017) |
| `DD-REPO-087` | [DD-REPO-119](../dd_2_shared_capabilities/dd-2-3-repository-capability-detailed-design-v01.md#dd-repo-119); [DD-1.2 redaction](../dd_1_application_core/dd-1-2-execution-outcomes-detailed-design-v01.md#_24-sensitive-information-and-redaction) |
| `DD-REPO-088` | [DD-1.2 normalization](../dd_1_application_core/dd-1-2-execution-outcomes-detailed-design-v01.md#_18-provider-result-normalization) |
| `DD-REPO-093` | [DD-1.2 effects](../dd_1_application_core/dd-1-2-execution-outcomes-detailed-design-v01.md#_12-consequential-effects); [partial completion](../dd_1_application_core/dd-1-2-execution-outcomes-detailed-design-v01.md#_14-partial-completion) |
| `DD-REPO-094` | [DD-REPO-086](../dd_2_shared_capabilities/dd-2-3-repository-capability-detailed-design-v01.md#dd-repo-086) |
| `DD-REPO-103` | [DD-1.2 cancellation](../dd_1_application_core/dd-1-2-execution-outcomes-detailed-design-v01.md#_17-cancellation-model) |
| `DD-REPO-104` | [DD-1.2 cancellation](../dd_1_application_core/dd-1-2-execution-outcomes-detailed-design-v01.md#_17-cancellation-model) |
| `DD-REPO-105` | [DD-1.2 effect evidence](../dd_1_application_core/dd-1-2-execution-outcomes-detailed-design-v01.md#_12-consequential-effects) |
| `DD-REPO-107` | [DD-1.2 event semantics](../dd_1_application_core/dd-1-2-execution-outcomes-detailed-design-v01.md#_16-progress-events) |
| `DD-REPO-108` | [DD-1.2 normalization](../dd_1_application_core/dd-1-2-execution-outcomes-detailed-design-v01.md#_18-provider-result-normalization) |
| `DD-REPO-110` | [DD-1.2 redaction](../dd_1_application_core/dd-1-2-execution-outcomes-detailed-design-v01.md#_24-sensitive-information-and-redaction) |
| `DD-REPO-112` | [DD-1.2 retry evidence](../dd_1_application_core/dd-1-2-execution-outcomes-detailed-design-v01.md#_22-retryability-and-repetition-evidence) |
| `DD-REPO-114` | [Git continuation contract](../dd_3_high_coupling_domains/dd-3-2-git-domain-detailed-design-v01.md#_12-failure-cancellation-and-partial-effects) |
| `DD-REPO-115` | [DD-1.2 subordinate result](../dd_1_application_core/dd-1-2-execution-outcomes-detailed-design-v01.md#_14-partial-completion) |
| `DD-REPO-116` | [DD-REPO-001](../dd_2_shared_capabilities/dd-2-3-repository-capability-detailed-design-v01.md#dd-repo-001); [DD-REPO-072](../dd_2_shared_capabilities/dd-2-3-repository-capability-detailed-design-v01.md#dd-repo-072) |
| `DD-REPO-117` | [Git domain operation model](../dd_3_high_coupling_domains/dd-3-2-git-domain-detailed-design-v01.md#_7-domain-contract-model) |
| `DD-REPO-118` | [DD-1.2 effects](../dd_1_application_core/dd-1-2-execution-outcomes-detailed-design-v01.md#_12-consequential-effects) |
| `DD-REPO-123` | [Design](../appmanager-design-specification-v01.md#_6-2-application-engine-authority) |
| `DD-REPO-124` | [DD-1.2 status layers](../dd_1_application_core/dd-1-2-execution-outcomes-detailed-design-v01.md#_6-core-status-model) |
| `DD-REPO-127` | [DD-3.2](../dd_3_high_coupling_domains/dd-3-2-git-domain-detailed-design-v01.md#_7-domain-contract-model) |
| `DD-REPO-128` | [§6 onward](../dd_2_shared_capabilities/dd-2-3-repository-capability-detailed-design-v01.md#_6-repository-reference-contract) |
| `DD-REPO-129` | [FR-NUXT-017](../functional/nuxt-functional-specification-v01.md#fr-nuxt-017) |
| `DD-REPO-130` | [bounded diff contract](../dd_2_shared_capabilities/dd-2-3-repository-capability-detailed-design-v01.md#dd-repo-034); [AI Capability](../dd_2_shared_capabilities/dd-2-7-ai-capability-detailed-design-v01.md) |
| `DD-REPO-131` | [Design](../appmanager-design-specification-v01.md#_11-10-ai-assisted-workflow) |
| `DD-REPO-132` | [Design](../appmanager-design-specification-v01.md#_6-6-capability-boundaries-and-providers) |
| `DD-REPO-135` | [Documentation Guide Level 4 boundary](../project-documentation-guide-v01.md#_8-level-4-implementation-specification) |
| `DD-REPO-136` | [Documentation Guide implementation boundary](../project-documentation-guide-v01.md#_8-level-4-implementation-specification) |
| `DD-SINT-002` | [FR-XFORM-005](../functional/source-transformation-functional-specification-v01.md#fr-xform-005) |
| `DD-SINT-005` | [FR-XFORM-005](../functional/source-transformation-functional-specification-v01.md#fr-xform-005) |
| `DD-SINT-011` | [FR-XFORM-009](../functional/source-transformation-functional-specification-v01.md#fr-xform-009) |
| `DD-SINT-022` | [FR-XFORM-005](../functional/source-transformation-functional-specification-v01.md#fr-xform-005) |
| `DD-SINT-036` | [FR-XFORM-009](../functional/source-transformation-functional-specification-v01.md#fr-xform-009) |
| `DD-SINT-001` | [Design](../appmanager-design-specification-v01.md#_9-9-non-destructive-ownership-and-unmanaged-content) |
| `DD-SINT-018` | [Design](../appmanager-design-specification-v01.md#_9-9-non-destructive-ownership-and-unmanaged-content) |
| `DD-SINT-019` | [Design](../appmanager-design-specification-v01.md#_7-5-strategies-and-transformation-plans) |
| `DD-SINT-032` | [Design](../appmanager-design-specification-v01.md#_6-6-capability-boundaries-and-providers) |
| `DD-SINT-051` | [Design](../appmanager-design-specification-v01.md#_9-6-project-discovery-and-context-resolution) |
| `DD-SINT-054` | [Design](../appmanager-design-specification-v01.md#_11-11-workflow-results-failure-and-acceptance) |
| `DD-SINT-056` | [Design](../appmanager-design-specification-v01.md#_7-5-strategies-and-transformation-plans) |
| `DD-SINT-038` | [DD-1.2](../dd_1_application_core/dd-1-2-execution-outcomes-detailed-design-v01.md#_19-application-level-interpretation) |
| `DD-SINT-039` | [DD-1.2](../dd_1_application_core/dd-1-2-execution-outcomes-detailed-design-v01.md#_18-provider-result-normalization) |
| `DD-SINT-049` | [DD-1.2](../dd_1_application_core/dd-1-2-execution-outcomes-detailed-design-v01.md#_24-sensitive-information-and-redaction) |
| `DD-SINT-009` | [DD-SINT-004](../dd_2_shared_capabilities/dd-2-4-source-intelligence-detailed-design-v01.md#dd-sint-004) |
| `DD-SINT-028` | [DD-SINT-015](../dd_2_shared_capabilities/dd-2-4-source-intelligence-detailed-design-v01.md#dd-sint-015) |
| `DD-SINT-043` | [DD-SINT-042](../dd_2_shared_capabilities/dd-2-4-source-intelligence-detailed-design-v01.md#dd-sint-042) |
| `DD-SINT-044` | [DD-SINT-040](../dd_2_shared_capabilities/dd-2-4-source-intelligence-detailed-design-v01.md#dd-sint-040) |
| `DD-SINT-048` | [DD-SINT-047](../dd_2_shared_capabilities/dd-2-4-source-intelligence-detailed-design-v01.md#dd-sint-047) |
| `DD-SINT-062` | [DD-SINT-013](../dd_2_shared_capabilities/dd-2-4-source-intelligence-detailed-design-v01.md#dd-sint-013) |
| `DD-SINT-024` | [DD-1.4 resolution](../dd_1_application_core/dd-1-4-configuration-resolution-detailed-design-v01.md#_15-resolution-result) |
| `DD-SINT-045` | [DD-1.2](../dd_1_application_core/dd-1-2-execution-outcomes-detailed-design-v01.md#_17-cancellation-model) |
| `DD-SINT-053` | [DD-1.4 effective values](../dd_1_application_core/dd-1-4-configuration-resolution-detailed-design-v01.md#_15-resolution-result) |
| `DD-SINT-058` | [Documentation Capability](../dd_2_shared_capabilities/dd-2-9-documentation-capability-detailed-design-v01.md) |
| `DD-SINT-059` | [Nuxt Capability](../dd_2_shared_capabilities/dd-2-10-nuxt-capability-detailed-design-v01.md); [Managed Project](../dd_1_application_core/dd-1-3-managed-project-detailed-design-v01.md) |
| `DD-SINT-060` | [Quality Domain](../dd_4_policy_and_resource_domains/dd-4-1-quality-domain-detailed-design-v01.md) |
| `DD-SINT-061` | [AI Capability context policy](../dd_2_shared_capabilities/dd-2-7-ai-capability-detailed-design-v01.md) |
| `DD-SINT-065` | [Documentation Guide](../project-documentation-guide-v01.md#_8-level-4-implementation-specification) |
| `DD-SINT-066` | [Implementation Specification](../project-documentation-guide-v01.md#_8-level-4-implementation-specification) |
| `DD-XFORM-012` | [FR-XFORM-017](../functional/source-transformation-functional-specification-v01.md#fr-xform-017) |
| `DD-XFORM-018` | [FR-XFORM-014](../functional/source-transformation-functional-specification-v01.md#fr-xform-014) |
| `DD-XFORM-021` | [FR-XFORM-047](../functional/source-transformation-functional-specification-v01.md#fr-xform-047) |
| `DD-XFORM-023` | [FR-XFORM-027](../functional/source-transformation-functional-specification-v01.md#fr-xform-027) |
| `DD-XFORM-024` | [FR-XFORM-028](../functional/source-transformation-functional-specification-v01.md#fr-xform-028) |
| `DD-XFORM-025` | [FR-XFORM-029](../functional/source-transformation-functional-specification-v01.md#fr-xform-029) |
| `DD-XFORM-026` | [FR-XFORM-031](../functional/source-transformation-functional-specification-v01.md#fr-xform-031) |
| `DD-XFORM-027` | [FR-XFORM-031](../functional/source-transformation-functional-specification-v01.md#fr-xform-031) |
| `DD-XFORM-033` | [FR-XFORM-014](../functional/source-transformation-functional-specification-v01.md#fr-xform-014) |
| `DD-XFORM-036` | [FR-XFORM-050](../functional/source-transformation-functional-specification-v01.md#fr-xform-050) |
| `DD-XFORM-045` | [FR-XFORM-075](../functional/source-transformation-functional-specification-v01.md#fr-xform-075) |
| `DD-XFORM-049` | [FR-XFORM-048](../functional/source-transformation-functional-specification-v01.md#fr-xform-048) |
| `DD-XFORM-050` | [FR-XFORM-051](../functional/source-transformation-functional-specification-v01.md#fr-xform-051) |
| `DD-XFORM-056` | [FR-XFORM-072](../functional/source-transformation-functional-specification-v01.md#fr-xform-072) |
| `DD-XFORM-061` | [FR-XFORM-068](../functional/source-transformation-functional-specification-v01.md#fr-xform-068) |
| `DD-XFORM-065` | [FR-XFORM-036](../functional/source-transformation-functional-specification-v01.md#fr-xform-036) |
| `DD-XFORM-071` | [FR-XFORM-042](../functional/source-transformation-functional-specification-v01.md#fr-xform-042) |
| `DD-XFORM-077` | [FR-XFORM-062](../functional/source-transformation-functional-specification-v01.md#fr-xform-062) |
| `DD-XFORM-084` | [FR-XFORM-073](../functional/source-transformation-functional-specification-v01.md#fr-xform-073) |
| `DD-XFORM-001` | [Design](../appmanager-design-specification-v01.md#_7-5-strategies-and-transformation-plans) |
| `DD-XFORM-002` | [Design](../appmanager-design-specification-v01.md#_7-code-intelligence-and-transformation-architecture) |
| `DD-XFORM-003` | [Design](../appmanager-design-specification-v01.md#_6-2-application-engine-authority) |
| `DD-XFORM-005` | [Design](../appmanager-design-specification-v01.md#_7-5-strategies-and-transformation-plans) |
| `DD-XFORM-017` | [Design](../appmanager-design-specification-v01.md#_6-2-application-engine-authority) |
| `DD-XFORM-019` | [Design](../appmanager-design-specification-v01.md#_7-10-non-destructive-transformation) |
| `DD-XFORM-020` | [Design](../appmanager-design-specification-v01.md#_6-8-generation-and-templates) |
| `DD-XFORM-032` | [Design](../appmanager-design-specification-v01.md#_9-6-project-discovery-and-context-resolution) |
| `DD-XFORM-052` | [Design](../appmanager-design-specification-v01.md#_11-11-workflow-results-failure-and-acceptance) |
| `DD-XFORM-054` | [Design](../appmanager-design-specification-v01.md#_11-11-workflow-results-failure-and-acceptance) |
| `DD-XFORM-055` | [Design](../appmanager-design-specification-v01.md#_11-11-workflow-results-failure-and-acceptance) |
| `DD-XFORM-069` | [Design](../appmanager-design-specification-v01.md#_7-10-non-destructive-transformation) |
| `DD-XFORM-075` | [Design](../appmanager-design-specification-v01.md#_11-10-ai-assisted-workflow) |
| `DD-XFORM-080` | [Design](../appmanager-design-specification-v01.md#_9-9-non-destructive-ownership-and-unmanaged-content) |
| `DD-XFORM-083` | [Design](../appmanager-design-specification-v01.md#_9-9-non-destructive-ownership-and-unmanaged-content) |
| `DD-XFORM-034` | [DD-1.2](../dd_1_application_core/dd-1-2-execution-outcomes-detailed-design-v01.md#_12-consequential-effects) |
| `DD-XFORM-035` | [DD-1.2](../dd_1_application_core/dd-1-2-execution-outcomes-detailed-design-v01.md#_15-no-op-already-satisfied-skipped-and-not-attempted-states) |
| `DD-XFORM-038` | [DD-1.2](../dd_1_application_core/dd-1-2-execution-outcomes-detailed-design-v01.md#_14-partial-completion) |
| `DD-XFORM-041` | [DD-1.2](../dd_1_application_core/dd-1-2-execution-outcomes-detailed-design-v01.md#_13-proposed-effects-and-preview) |
| `DD-XFORM-043` | [DD-1.2](../dd_1_application_core/dd-1-2-execution-outcomes-detailed-design-v01.md#_14-partial-completion) |
| `DD-XFORM-044` | [DD-1.2](../dd_1_application_core/dd-1-2-execution-outcomes-detailed-design-v01.md#_12-consequential-effects) |
| `DD-XFORM-047` | [DD-1.2](../dd_1_application_core/dd-1-2-execution-outcomes-detailed-design-v01.md#_17-cancellation-model) |
| `DD-XFORM-057` | [DD-1.2](../dd_1_application_core/dd-1-2-execution-outcomes-detailed-design-v01.md#_18-provider-result-normalization) |
| `DD-XFORM-058` | [DD-1.2](../dd_1_application_core/dd-1-2-execution-outcomes-detailed-design-v01.md#_12-consequential-effects) |
| `DD-XFORM-060` | [DD-1.2](../dd_1_application_core/dd-1-2-execution-outcomes-detailed-design-v01.md#_12-consequential-effects) |
| `DD-XFORM-081` | [DD-1.2](../dd_1_application_core/dd-1-2-execution-outcomes-detailed-design-v01.md#_12-consequential-effects) |
| `DD-XFORM-007` | [FR-PROJ-042](../functional/managed-project-functional-specification-v01.md#fr-proj-042) |
| `DD-XFORM-013` | [FR-PROJ-044](../functional/managed-project-functional-specification-v01.md#fr-proj-044) |
| `DD-XFORM-028` | [FR-INV-022](../functional/application-invocation-functional-specification-v01.md#fr-inv-022) |
| `DD-XFORM-037` | [DD-1.2](../dd_1_application_core/dd-1-2-execution-outcomes-detailed-design-v01.md#_12-consequential-effects) |
| `DD-XFORM-046` | [DD-1.2](../dd_1_application_core/dd-1-2-execution-outcomes-detailed-design-v01.md#_17-cancellation-model) |
| `DD-XFORM-073` | [DD-1.4 effective values](../dd_1_application_core/dd-1-4-configuration-resolution-detailed-design-v01.md#_15-resolution-result) |
| `DD-XFORM-078` | [FR-XFORM-050](../functional/source-transformation-functional-specification-v01.md#fr-xform-050); [Design](../appmanager-design-specification-v01.md#_11-11-workflow-results-failure-and-acceptance) |
| `DD-XFORM-086` | [DD-XFORM-008](../dd_2_shared_capabilities/dd-2-5-source-transformation-detailed-design-v01.md#dd-xform-008) |
| `DD-XFORM-088` | [Documentation Guide](../project-documentation-guide-v01.md#_8-level-4-implementation-specification) |
| `DD-XFORM-089` | [Documentation Guide implementation boundary](../project-documentation-guide-v01.md#_8-level-4-implementation-specification) |
| `DD-REG-001` | [Design](../appmanager-design-specification-v01.md#_6-9-registries) |
| `DD-REG-003` | [Design](../appmanager-design-specification-v01.md#_6-8-generation-and-templates) |
| `DD-REG-009` | [Design](../appmanager-design-specification-v01.md#_6-6-capability-boundaries-and-providers) |
| `DD-REG-027` | [Design](../appmanager-design-specification-v01.md#_6-2-application-engine-authority) |
| `DD-REG-038` | [Design](../appmanager-design-specification-v01.md#_9-9-non-destructive-ownership-and-unmanaged-content) |
| `DD-REG-042` | [Design](../appmanager-design-specification-v01.md#_9-6-project-discovery-and-context-resolution) |
| `DD-REG-043` | [Design](../appmanager-design-specification-v01.md#_6-9-registries) |
| `DD-REG-052` | [Design](../appmanager-design-specification-v01.md#_6-8-generation-and-templates) |
| `DD-REG-053` | [Design](../appmanager-design-specification-v01.md#_9-9-non-destructive-ownership-and-unmanaged-content) |
| `DD-REG-062` | [Design](../appmanager-design-specification-v01.md#_6-9-registries) |
| `DD-REG-066` | [Design](../appmanager-design-specification-v01.md#_6-9-registries) |
| `DD-REG-082` | [Design](../appmanager-design-specification-v01.md#_6-9-registries) |
| `DD-REG-089` | [Design](../appmanager-design-specification-v01.md#_11-10-ai-assisted-workflow) |
| `DD-REG-103` | [Design](../appmanager-design-specification-v01.md#_11-11-workflow-results-failure-and-acceptance) |
| `DD-REG-044` | [DD-REG-002](../dd_2_shared_capabilities/dd-2-6-resource-registry-and-template-detailed-design-v01.md#dd-reg-002) |
| `DD-REG-047` | [DD-REG-037](../dd_2_shared_capabilities/dd-2-6-resource-registry-and-template-detailed-design-v01.md#dd-reg-037) |
| `DD-REG-060` | [DD-REG-013](../dd_2_shared_capabilities/dd-2-6-resource-registry-and-template-detailed-design-v01.md#dd-reg-013) |
| `DD-REG-064` | [DD-REG-049](../dd_2_shared_capabilities/dd-2-6-resource-registry-and-template-detailed-design-v01.md#dd-reg-049) |
| `DD-REG-084` | [DD-REG-017](../dd_2_shared_capabilities/dd-2-6-resource-registry-and-template-detailed-design-v01.md#dd-reg-017) |
| `DD-REG-085` | [DD-REG-017](../dd_2_shared_capabilities/dd-2-6-resource-registry-and-template-detailed-design-v01.md#dd-reg-017) |
| `DD-REG-092` | [DD-REG-035](../dd_2_shared_capabilities/dd-2-6-resource-registry-and-template-detailed-design-v01.md#dd-reg-035) |
| `DD-REG-093` | [DD-REG-035](../dd_2_shared_capabilities/dd-2-6-resource-registry-and-template-detailed-design-v01.md#dd-reg-035) |
| `DD-REG-101` | [DD-REG-100](../dd_2_shared_capabilities/dd-2-6-resource-registry-and-template-detailed-design-v01.md#dd-reg-100) |
| `DD-REG-106` | [DD-REG-021](../dd_2_shared_capabilities/dd-2-6-resource-registry-and-template-detailed-design-v01.md#dd-reg-021) |
| `DD-REG-109` | [DD-REG-005](../dd_2_shared_capabilities/dd-2-6-resource-registry-and-template-detailed-design-v01.md#dd-reg-005) |
| `DD-REG-111` | [DD-REG-049](../dd_2_shared_capabilities/dd-2-6-resource-registry-and-template-detailed-design-v01.md#dd-reg-049) |
| `DD-REG-113` | [DD-REG-065](../dd_2_shared_capabilities/dd-2-6-resource-registry-and-template-detailed-design-v01.md#dd-reg-065) |
| `DD-REG-023` | [DD-1.2](../dd_1_application_core/dd-1-2-execution-outcomes-detailed-design-v01.md#_18-provider-result-normalization) |
| `DD-REG-050` | [DD-1.2](../dd_1_application_core/dd-1-2-execution-outcomes-detailed-design-v01.md#_18-provider-result-normalization) |
| `DD-REG-094` | [DD-1.2](../dd_1_application_core/dd-1-2-execution-outcomes-detailed-design-v01.md#_18-provider-result-normalization) |
| `DD-REG-096` | [DD-1.2](../dd_1_application_core/dd-1-2-execution-outcomes-detailed-design-v01.md#_19-application-level-interpretation) |
| `DD-REG-105` | [DD-1.2](../dd_1_application_core/dd-1-2-execution-outcomes-detailed-design-v01.md#_12-consequential-effects) |
| `DD-REG-036` | [DD-1.4 effective values](../dd_1_application_core/dd-1-4-configuration-resolution-detailed-design-v01.md#_15-resolution-result) |
| `DD-REG-054` | [FR-XFORM-047](../functional/source-transformation-functional-specification-v01.md#fr-xform-047) |
| `DD-REG-056` | [DD-1.2](../dd_1_application_core/dd-1-2-execution-outcomes-detailed-design-v01.md#_13-proposed-effects-and-preview) |
| `DD-REG-061` | [Resource Access](../dd_2_shared_capabilities/dd-2-1-resource-access-detailed-design-v01.md); [Design](../appmanager-design-specification-v01.md#_7-code-intelligence-and-transformation-architecture) |
| `DD-REG-076` | [DD-2.1 bounded reads](../dd_2_shared_capabilities/dd-2-1-resource-access-detailed-design-v01.md#dd-res-019) |
| `DD-REG-081` | [Design](../appmanager-design-specification-v01.md#_6-8-generation-and-templates) |
| `DD-REG-086` | [DD-REG-002](../dd_2_shared_capabilities/dd-2-6-resource-registry-and-template-detailed-design-v01.md#dd-reg-002); [Settings-owned](../dd_4_policy_and_resource_domains/dd-4-2-settings-domain-detailed-design-v01.md) |
| `DD-REG-088` | [DD-2.7 context/disclosure contracts](../dd_2_shared_capabilities/dd-2-7-ai-capability-detailed-design-v01.md) |
| `DD-REG-097` | [DD-1.2](../dd_1_application_core/dd-1-2-execution-outcomes-detailed-design-v01.md#_17-cancellation-model) |
| `DD-REG-098` | [DD-REG-002](../dd_2_shared_capabilities/dd-2-6-resource-registry-and-template-detailed-design-v01.md#dd-reg-002); [DD-1.2](../dd_1_application_core/dd-1-2-execution-outcomes-detailed-design-v01.md#_17-cancellation-model) |
| `DD-REG-108` | [Documentation Guide](../project-documentation-guide-v01.md#_8-level-4-implementation-specification) |
| `DD-AICAP-001` | [Design](../appmanager-design-specification-v01.md#_6-6-capability-boundaries-and-providers) |
| `DD-AICAP-002` | [Design](../appmanager-design-specification-v01.md#_11-10-ai-assisted-workflow) |
| `DD-AICAP-003` | [Design](../appmanager-design-specification-v01.md#_11-10-ai-assisted-workflow) |
| `DD-AICAP-004` | [Design](../appmanager-design-specification-v01.md#_11-10-ai-assisted-workflow) |
| `DD-AICAP-006` | [Design](../appmanager-design-specification-v01.md#_10-6-ai-domain) |
| `DD-AICAP-017` | [Design](../appmanager-design-specification-v01.md#_11-10-ai-assisted-workflow) |
| `DD-AICAP-019` | [Design](../appmanager-design-specification-v01.md#_11-10-ai-assisted-workflow) |
| `DD-AICAP-020` | [Design](../appmanager-design-specification-v01.md#_9-7-managed-scope-and-operation-targeting) |
| `DD-AICAP-028` | [FR-AI-090](../functional/ai-functional-specification-v01.md#fr-ai-090) |
| `DD-AICAP-030` | [Design](../appmanager-design-specification-v01.md#_11-10-ai-assisted-workflow) |
| `DD-AICAP-041` | [Design](../appmanager-design-specification-v01.md#_11-10-ai-assisted-workflow) |
| `DD-AICAP-047` | [Design](../appmanager-design-specification-v01.md#_11-11-workflow-results-failure-and-acceptance) |
| `DD-AICAP-073` | [Design](../appmanager-design-specification-v01.md#_10-6-ai-domain) |
| `DD-AICAP-074` | [Design](../appmanager-design-specification-v01.md#_11-10-ai-assisted-workflow) |
| `DD-AICAP-077` | [Design](../appmanager-design-specification-v01.md#_7-code-intelligence-and-transformation-architecture) |
| `DD-AICAP-078` | [Design](../appmanager-design-specification-v01.md#_6-8-generation-and-templates) |
| `DD-AICAP-080` | [Design](../appmanager-design-specification-v01.md#_6-6-capability-boundaries-and-providers) |
| `DD-AICAP-081` | [Design](../appmanager-design-specification-v01.md#_11-11-workflow-results-failure-and-acceptance) |
| `DD-AICAP-089` | [Design](../appmanager-design-specification-v01.md#_11-10-ai-assisted-workflow) |
| `DD-AICAP-090` | [Design](../appmanager-design-specification-v01.md#_11-10-ai-assisted-workflow) |
| `DD-AICAP-048` | [DD-1.2](../dd_1_application_core/dd-1-2-execution-outcomes-detailed-design-v01.md#_18-provider-result-normalization) |
| `DD-AICAP-050` | [DD-1.2](../dd_1_application_core/dd-1-2-execution-outcomes-detailed-design-v01.md#_8-execution-evidence-contract) |
| `DD-AICAP-051` | [DD-1.2](../dd_1_application_core/dd-1-2-execution-outcomes-detailed-design-v01.md#_24-sensitive-information-and-redaction) |
| `DD-AICAP-052` | [DD-1.2](../dd_1_application_core/dd-1-2-execution-outcomes-detailed-design-v01.md#_18-provider-result-normalization) |
| `DD-AICAP-053` | [DD-1.2](../dd_1_application_core/dd-1-2-execution-outcomes-detailed-design-v01.md#_18-provider-result-normalization) |
| `DD-AICAP-056` | [DD-1.2](../dd_1_application_core/dd-1-2-execution-outcomes-detailed-design-v01.md#_17-cancellation-model) |
| `DD-AICAP-057` | [DD-1.2](../dd_1_application_core/dd-1-2-execution-outcomes-detailed-design-v01.md#_17-cancellation-model) |
| `DD-AICAP-061` | [DD-1.2](../dd_1_application_core/dd-1-2-execution-outcomes-detailed-design-v01.md#_22-retryability-and-repetition-evidence) |
| `DD-AICAP-082` | [DD-1.2](../dd_1_application_core/dd-1-2-execution-outcomes-detailed-design-v01.md#_12-consequential-effects) |
| `DD-AICAP-011` | [DD-1.4 effective values](../dd_1_application_core/dd-1-4-configuration-resolution-detailed-design-v01.md#_15-resolution-result) |
| `DD-AICAP-026` | [Documentation Guide implementation boundary](../project-documentation-guide-v01.md#_8-level-4-implementation-specification) |
| `DD-AICAP-038` | [DD-1.2](../dd_1_application_core/dd-1-2-execution-outcomes-detailed-design-v01.md#_24-sensitive-information-and-redaction) |
| `DD-AICAP-039` | [Registry declarative-item contract](../dd_2_shared_capabilities/dd-2-6-resource-registry-and-template-detailed-design-v01.md#dd-reg-049) |
| `DD-AICAP-042` | [DD-REG-002](../dd_2_shared_capabilities/dd-2-6-resource-registry-and-template-detailed-design-v01.md#dd-reg-002) |
| `DD-AICAP-065` | [the owning domain](../dd_2_shared_capabilities/dd-2-7-ai-capability-detailed-design-v01.md#_21-cross-domain-consumption); [Design](../appmanager-design-specification-v01.md#_11-10-ai-assisted-workflow) |
| `DD-AICAP-070` | [DD-AICAP-012](../dd_2_shared_capabilities/dd-2-7-ai-capability-detailed-design-v01.md#dd-aicap-012); [DD-AICAP-014](../dd_2_shared_capabilities/dd-2-7-ai-capability-detailed-design-v01.md#dd-aicap-014) |
| `DD-AICAP-071` | [Design](../appmanager-design-specification-v01.md#_4-6-presentation-independence) |
| `DD-AICAP-075` | [DD-1.2](../dd_1_application_core/dd-1-2-execution-outcomes-detailed-design-v01.md#_18-provider-result-normalization) |
| `DD-AICAP-079` | [DD-AICAP-031](../dd_2_shared_capabilities/dd-2-7-ai-capability-detailed-design-v01.md#dd-aicap-031) |
| `DD-AICAP-086` | [DD-AICAP-016](../dd_2_shared_capabilities/dd-2-7-ai-capability-detailed-design-v01.md#dd-aicap-016); [DD-1.2](../dd_1_application_core/dd-1-2-execution-outcomes-detailed-design-v01.md#_18-provider-result-normalization) |
| `DD-AICAP-087` | [Documentation Guide](../project-documentation-guide-v01.md#_8-level-4-implementation-specification) |
| `DD-AICAP-088` | [Documentation Guide implementation boundary](../project-documentation-guide-v01.md#_8-level-4-implementation-specification) |
| `DD-QUALCAP-001` | [Design](../appmanager-design-specification-v01.md#_6-6-capability-boundaries-and-providers) |
| `DD-QUALCAP-003` | [Design](../appmanager-design-specification-v01.md#_6-6-capability-boundaries-and-providers) |
| `DD-QUALCAP-004` | [Design](../appmanager-design-specification-v01.md#_6-2-application-engine-authority) |
| `DD-QUALCAP-009` | [Design](../appmanager-design-specification-v01.md#_9-6-project-discovery-and-context-resolution) |
| `DD-QUALCAP-048` | [Design](../appmanager-design-specification-v01.md#_6-6-capability-boundaries-and-providers) |
| `DD-QUALCAP-082` | [Design](../appmanager-design-specification-v01.md#_4-6-presentation-independence) |
| `DD-QUALCAP-084` | [Design](../appmanager-design-specification-v01.md#_11-10-ai-assisted-workflow) |
| `DD-QUALCAP-089` | [Design](../appmanager-design-specification-v01.md#_11-11-workflow-results-failure-and-acceptance) |
| `DD-QUALCAP-002` | [DD-1.2](../dd_1_application_core/dd-1-2-execution-outcomes-detailed-design-v01.md#_18-provider-result-normalization) |
| `DD-QUALCAP-028` | [DD-1.2](../dd_1_application_core/dd-1-2-execution-outcomes-detailed-design-v01.md#_24-sensitive-information-and-redaction) |
| `DD-QUALCAP-063` | [DD-1.2](../dd_1_application_core/dd-1-2-execution-outcomes-detailed-design-v01.md#_14-partial-completion) |
| `DD-QUALCAP-066` | [DD-1.2](../dd_1_application_core/dd-1-2-execution-outcomes-detailed-design-v01.md#_17-cancellation-model) |
| `DD-QUALCAP-069` | [DD-1.2](../dd_1_application_core/dd-1-2-execution-outcomes-detailed-design-v01.md#_12-consequential-effects) |
| `DD-QUALCAP-072` | [DD-1.2](../dd_1_application_core/dd-1-2-execution-outcomes-detailed-design-v01.md#_12-consequential-effects) |
| `DD-QUALCAP-085` | [DD-1.2](../dd_1_application_core/dd-1-2-execution-outcomes-detailed-design-v01.md#_18-provider-result-normalization) |
| `DD-QUALCAP-091` | [DD-1.2](../dd_1_application_core/dd-1-2-execution-outcomes-detailed-design-v01.md#_14-partial-completion) |
| `DD-QUALCAP-020` | [DD-QUALCAP-019](../dd_2_shared_capabilities/dd-2-8-quality-capability-detailed-design-v01.md#dd-qualcap-019) |
| `DD-QUALCAP-021` | [DD-QUALCAP-050](../dd_2_shared_capabilities/dd-2-8-quality-capability-detailed-design-v01.md#dd-qualcap-050) |
| `DD-QUALCAP-042` | [DD-QUALCAP-026](../dd_2_shared_capabilities/dd-2-8-quality-capability-detailed-design-v01.md#dd-qualcap-026) |
| `DD-QUALCAP-046` | [DD-QUALCAP-016](../dd_2_shared_capabilities/dd-2-8-quality-capability-detailed-design-v01.md#dd-qualcap-016) |
| `DD-QUALCAP-059` | [DD-QUALCAP-027](../dd_2_shared_capabilities/dd-2-8-quality-capability-detailed-design-v01.md#dd-qualcap-027) |
| `DD-QUALCAP-060` | [DD-QUALCAP-027](../dd_2_shared_capabilities/dd-2-8-quality-capability-detailed-design-v01.md#dd-qualcap-027) |
| `DD-QUALCAP-062` | [DD-QUALCAP-024](../dd_2_shared_capabilities/dd-2-8-quality-capability-detailed-design-v01.md#dd-qualcap-024) |
| `DD-QUALCAP-067` | [DD-QUALCAP-024](../dd_2_shared_capabilities/dd-2-8-quality-capability-detailed-design-v01.md#dd-qualcap-024) |
| `DD-QUALCAP-081` | [Design](../appmanager-design-specification-v01.md#_6-2-application-engine-authority) |
| `DD-QUALCAP-087` | [DD-QUALCAP-015](../dd_2_shared_capabilities/dd-2-8-quality-capability-detailed-design-v01.md#dd-qualcap-015) |
| `DD-QUALCAP-090` | [DD-QUALCAP-080](../dd_2_shared_capabilities/dd-2-8-quality-capability-detailed-design-v01.md#dd-qualcap-080) |
| `DD-QUALCAP-012` | [DD-1.4 effective values](../dd_1_application_core/dd-1-4-configuration-resolution-detailed-design-v01.md#_15-resolution-result) |
| `DD-QUALCAP-017` | [FR-INV-020](../functional/application-invocation-functional-specification-v01.md#fr-inv-020) |
| `DD-QUALCAP-022` | [DD-2.2 direct/shell boundaries](../dd_2_shared_capabilities/dd-2-2-process-execution-detailed-design-v01.md#_8-direct-execution-and-shell-boundary) |
| `DD-QUALCAP-043` | [Design](../appmanager-design-specification-v01.md#_7-code-intelligence-and-transformation-architecture) |
| `DD-QUALCAP-049` | [FR-XFORM-048](../functional/source-transformation-functional-specification-v01.md#fr-xform-048) |
| `DD-QUALCAP-065` | [DD-1.2](../dd_1_application_core/dd-1-2-execution-outcomes-detailed-design-v01.md#_17-cancellation-model) |
| `DD-QUALCAP-079` | [Design](../appmanager-design-specification-v01.md#_4-6-presentation-independence) |
| `DD-QUALCAP-088` | [DD-ENG-046](../dd_1_application_core/dd-1-5-application-engine-detailed-design-v01.md#dd-eng-046); [Design extension classes](../appmanager-design-specification-v01.md#_13-2-extension-classes); [implementation choices](../project-documentation-guide-v01.md#_8-level-4-implementation-specification) |
| `DD-QUALCAP-092` | [Documentation Guide implementation boundary](../project-documentation-guide-v01.md#_8-level-4-implementation-specification) |
| `DD-QUALCAP-094` | [DD-2.2 argument structure](../dd_2_shared_capabilities/dd-2-2-process-execution-detailed-design-v01.md#dd-proc-014) |
| `DD-DOCCAP-001` | [Design](../appmanager-design-specification-v01.md#_6-6-capability-boundaries-and-providers) |
| `DD-DOCCAP-002` | [Design](../appmanager-design-specification-v01.md#_6-8-generation-and-templates) |
| `DD-DOCCAP-003` | [Design](../appmanager-design-specification-v01.md#_6-6-capability-boundaries-and-providers) |
| `DD-DOCCAP-004` | [Design](../appmanager-design-specification-v01.md#_6-2-application-engine-authority) |
| `DD-DOCCAP-008` | [Design](../appmanager-design-specification-v01.md#_9-7-managed-scope-and-operation-targeting) |
| `DD-DOCCAP-015` | [Design](../appmanager-design-specification-v01.md#_9-9-non-destructive-ownership-and-unmanaged-content) |
| `DD-DOCCAP-023` | [Design](../appmanager-design-specification-v01.md#_9-9-non-destructive-ownership-and-unmanaged-content) |
| `DD-DOCCAP-034` | [Design](../appmanager-design-specification-v01.md#_9-7-managed-scope-and-operation-targeting) |
| `DD-DOCCAP-042` | [Design](../appmanager-design-specification-v01.md#_7-code-intelligence-and-transformation-architecture) |
| `DD-DOCCAP-043` | [Design](../appmanager-design-specification-v01.md#_6-8-generation-and-templates) |
| `DD-DOCCAP-046` | [Design](../appmanager-design-specification-v01.md#_9-9-non-destructive-ownership-and-unmanaged-content) |
| `DD-DOCCAP-047` | [Design](../appmanager-design-specification-v01.md#_7-code-intelligence-and-transformation-architecture) |
| `DD-DOCCAP-053` | [Design](../appmanager-design-specification-v01.md#_11-10-ai-assisted-workflow) |
| `DD-DOCCAP-057` | [Design](../appmanager-design-specification-v01.md#_6-6-capability-boundaries-and-providers) |
| `DD-DOCCAP-060` | [Design](../appmanager-design-specification-v01.md#_11-11-workflow-results-failure-and-acceptance) |
| `DD-DOCCAP-087` | [Design](../appmanager-design-specification-v01.md#_11-10-ai-assisted-workflow) |
| `DD-DOCCAP-088` | [Design](../appmanager-design-specification-v01.md#_6-6-capability-boundaries-and-providers) |
| `DD-DOCCAP-093` | [Design](../appmanager-design-specification-v01.md#_11-11-workflow-results-failure-and-acceptance) |
| `DD-DOCCAP-095` | [Design](../appmanager-design-specification-v01.md#_11-11-workflow-results-failure-and-acceptance) |
| `DD-DOCCAP-012` | [DD-DOCCAP-006](../dd_2_shared_capabilities/dd-2-9-documentation-capability-detailed-design-v01.md#dd-doccap-006) |
| `DD-DOCCAP-025` | [DD-DOCCAP-007](../dd_2_shared_capabilities/dd-2-9-documentation-capability-detailed-design-v01.md#dd-doccap-007) |
| `DD-DOCCAP-035` | [DD-DOCCAP-030](../dd_2_shared_capabilities/dd-2-9-documentation-capability-detailed-design-v01.md#dd-doccap-030) |
| `DD-DOCCAP-040` | [DD-DOCCAP-011](../dd_2_shared_capabilities/dd-2-9-documentation-capability-detailed-design-v01.md#dd-doccap-011) |
| `DD-DOCCAP-041` | [DD-DOCCAP-030](../dd_2_shared_capabilities/dd-2-9-documentation-capability-detailed-design-v01.md#dd-doccap-030) |
| `DD-DOCCAP-050` | [DD-DOCCAP-021](../dd_2_shared_capabilities/dd-2-9-documentation-capability-detailed-design-v01.md#dd-doccap-021) |
| `DD-DOCCAP-070` | [DD-DOCCAP-028](../dd_2_shared_capabilities/dd-2-9-documentation-capability-detailed-design-v01.md#dd-doccap-028) |
| `DD-DOCCAP-071` | [DD-DOCCAP-029](../dd_2_shared_capabilities/dd-2-9-documentation-capability-detailed-design-v01.md#dd-doccap-029) |
| `DD-DOCCAP-086` | [DD-2.7 context/disclosure contracts](../dd_2_shared_capabilities/dd-2-7-ai-capability-detailed-design-v01.md) |
| `DD-DOCCAP-091` | [DD-DOCCAP-011](../dd_2_shared_capabilities/dd-2-9-documentation-capability-detailed-design-v01.md#dd-doccap-011) |
| `DD-DOCCAP-073` | [DD-1.2](../dd_1_application_core/dd-1-2-execution-outcomes-detailed-design-v01.md#_14-partial-completion) |
| `DD-DOCCAP-074` | [DD-1.2](../dd_1_application_core/dd-1-2-execution-outcomes-detailed-design-v01.md#_12-consequential-effects) |
| `DD-DOCCAP-078` | [DD-1.2](../dd_1_application_core/dd-1-2-execution-outcomes-detailed-design-v01.md#_17-cancellation-model) |
| `DD-DOCCAP-079` | [DD-1.2](../dd_1_application_core/dd-1-2-execution-outcomes-detailed-design-v01.md#_17-cancellation-model) |
| `DD-DOCCAP-085` | [DD-1.2](../dd_1_application_core/dd-1-2-execution-outcomes-detailed-design-v01.md#_24-sensitive-information-and-redaction) |
| `DD-DOCCAP-089` | [DD-1.2](../dd_1_application_core/dd-1-2-execution-outcomes-detailed-design-v01.md#_18-provider-result-normalization) |
| `DD-DOCCAP-094` | [DD-1.2](../dd_1_application_core/dd-1-2-execution-outcomes-detailed-design-v01.md#_14-partial-completion) |
| `DD-DOCCAP-014` | [Source Intelligence normalized facts](../dd_2_shared_capabilities/dd-2-4-source-intelligence-detailed-design-v01.md#_10-structural-fact-model) |
| `DD-DOCCAP-018` | [DD-2.10 Nuxt facts](../dd_2_shared_capabilities/dd-2-10-nuxt-capability-detailed-design-v01.md#_6-nuxt-recognition-and-facts) |
| `DD-DOCCAP-020` | [DD-2.3](../dd_2_shared_capabilities/dd-2-3-repository-capability-detailed-design-v01.md) |
| `DD-DOCCAP-033` | [Registry declarative contract](../dd_2_shared_capabilities/dd-2-6-resource-registry-and-template-detailed-design-v01.md#dd-reg-049) |
| `DD-DOCCAP-045` | [DD-2.5 plans](../dd_2_shared_capabilities/dd-2-5-source-transformation-detailed-design-v01.md#_9-transformation-plan-contract) |
| `DD-DOCCAP-051` | [DD-2.7 context, sensitivity and disclosure contracts](../dd_2_shared_capabilities/dd-2-7-ai-capability-detailed-design-v01.md) |
| `DD-DOCCAP-056` | [DD-1.4 effective values](../dd_1_application_core/dd-1-4-configuration-resolution-detailed-design-v01.md#_15-resolution-result) |
| `DD-DOCCAP-058` | [DD-2.2 process interpretation](../dd_2_shared_capabilities/dd-2-2-process-execution-detailed-design-v01.md#dd-proc-043) |
| `DD-DOCCAP-061` | [DD-2.2 direct/shell boundaries](../dd_2_shared_capabilities/dd-2-2-process-execution-detailed-design-v01.md#_8-direct-execution-and-shell-boundary) |
| `DD-DOCCAP-066` | [FR-XFORM-048](../functional/source-transformation-functional-specification-v01.md#fr-xform-048) |
| `DD-DOCCAP-077` | [DD-1.2](../dd_1_application_core/dd-1-2-execution-outcomes-detailed-design-v01.md#_17-cancellation-model) |
| `DD-DOCCAP-083` | [DD-XFORM-029](../dd_2_shared_capabilities/dd-2-5-source-transformation-detailed-design-v01.md#dd-xform-029); [DD-XFORM-030](../dd_2_shared_capabilities/dd-2-5-source-transformation-detailed-design-v01.md#dd-xform-030) |
| `DD-DOCCAP-092` | [DD-ENG-046](../dd_1_application_core/dd-1-5-application-engine-detailed-design-v01.md#dd-eng-046); [Design extension classes](../appmanager-design-specification-v01.md#_13-2-extension-classes); [implementation choices](../project-documentation-guide-v01.md#_8-level-4-implementation-specification) |
| `DD-DOCCAP-096` | [Documentation Guide implementation boundary](../project-documentation-guide-v01.md#_8-level-4-implementation-specification) |
| `DD-NUXTCAP-001` | [Design](../appmanager-design-specification-v01.md#_6-6-capability-boundaries-and-providers) |
| `DD-NUXTCAP-002` | [Design](../appmanager-design-specification-v01.md#_11-11-workflow-results-failure-and-acceptance) |
| `DD-NUXTCAP-003` | [Design](../appmanager-design-specification-v01.md#_6-2-application-engine-authority) |
| `DD-NUXTCAP-004` | [Design](../appmanager-design-specification-v01.md#_10-7-nuxt-domain) |
| `DD-NUXTCAP-006` | [Design](../appmanager-design-specification-v01.md#_9-6-project-discovery-and-context-resolution) |
| `DD-NUXTCAP-010` | [Design](../appmanager-design-specification-v01.md#_9-9-non-destructive-ownership-and-unmanaged-content) |
| `DD-NUXTCAP-015` | [Design](../appmanager-design-specification-v01.md#_9-6-project-discovery-and-context-resolution) |
| `DD-NUXTCAP-016` | [Design](../appmanager-design-specification-v01.md#_6-6-capability-boundaries-and-providers) |
| `DD-NUXTCAP-024` | [Design](../appmanager-design-specification-v01.md#_7-code-intelligence-and-transformation-architecture) |
| `DD-NUXTCAP-036` | [Design](../appmanager-design-specification-v01.md#_11-11-workflow-results-failure-and-acceptance) |
| `DD-NUXTCAP-044` | [Design](../appmanager-design-specification-v01.md#_6-8-generation-and-templates) |
| `DD-NUXTCAP-046` | [Design](../appmanager-design-specification-v01.md#_6-8-generation-and-templates) |
| `DD-NUXTCAP-052` | [Design](../appmanager-design-specification-v01.md#_11-10-ai-assisted-workflow) |
| `DD-NUXTCAP-069` | [Design](../appmanager-design-specification-v01.md#_9-9-non-destructive-ownership-and-unmanaged-content) |
| `DD-NUXTCAP-073` | [Design](../appmanager-design-specification-v01.md#_6-6-capability-boundaries-and-providers) |
| `DD-NUXTCAP-079` | [Design](../appmanager-design-specification-v01.md#_11-11-workflow-results-failure-and-acceptance) |
| `DD-NUXTCAP-087` | [Design](../appmanager-design-specification-v01.md#_7-10-non-destructive-transformation) |
| `DD-NUXTCAP-093` | [Design](../appmanager-design-specification-v01.md#_4-6-presentation-independence) |
| `DD-NUXTCAP-096` | [Design](../appmanager-design-specification-v01.md#_11-11-workflow-results-failure-and-acceptance) |
| `DD-NUXTCAP-042` | [FR-NUXT-060](../functional/nuxt-functional-specification-v01.md#fr-nuxt-060) |
| `DD-NUXTCAP-057` | [FR-NUXT-072](../functional/nuxt-functional-specification-v01.md#fr-nuxt-072) |
| `DD-NUXTCAP-058` | [FR-NUXT-073](../functional/nuxt-functional-specification-v01.md#fr-nuxt-073) |
| `DD-NUXTCAP-059` | [FR-NUXT-074](../functional/nuxt-functional-specification-v01.md#fr-nuxt-074) |
| `DD-NUXTCAP-060` | [FR-NUXT-078](../functional/nuxt-functional-specification-v01.md#fr-nuxt-078) |
| `DD-NUXTCAP-061` | [FR-NUXT-079](../functional/nuxt-functional-specification-v01.md#fr-nuxt-079) |
| `DD-NUXTCAP-064` | [FR-NUXT-081](../functional/nuxt-functional-specification-v01.md#fr-nuxt-081) |
| `DD-NUXTCAP-066` | [FR-NUXT-084](../functional/nuxt-functional-specification-v01.md#fr-nuxt-084) |
| `DD-NUXTCAP-065` | [FR-NUXT-085](../functional/nuxt-functional-specification-v01.md#fr-nuxt-085) |
| `DD-NUXTCAP-038` | [DD-NUXTCAP-007](../dd_2_shared_capabilities/dd-2-10-nuxt-capability-detailed-design-v01.md#dd-nuxtcap-007) |
| `DD-NUXTCAP-056` | [DD-NUXTCAP-039](../dd_2_shared_capabilities/dd-2-10-nuxt-capability-detailed-design-v01.md#dd-nuxtcap-039) |
| `DD-NUXTCAP-062` | [DD-NUXTCAP-039](../dd_2_shared_capabilities/dd-2-10-nuxt-capability-detailed-design-v01.md#dd-nuxtcap-039) |
| `DD-NUXTCAP-076` | [DD-NUXTCAP-075](../dd_2_shared_capabilities/dd-2-10-nuxt-capability-detailed-design-v01.md#dd-nuxtcap-075) |
| `DD-NUXTCAP-077` | [DD-NUXTCAP-035](../dd_2_shared_capabilities/dd-2-10-nuxt-capability-detailed-design-v01.md#dd-nuxtcap-035) |
| `DD-NUXTCAP-083` | [DD-NUXTCAP-011](../dd_2_shared_capabilities/dd-2-10-nuxt-capability-detailed-design-v01.md#dd-nuxtcap-011) |
| `DD-NUXTCAP-084` | [Design](../appmanager-design-specification-v01.md#_6-6-capability-boundaries-and-providers) |
| `DD-NUXTCAP-097` | [DD-NUXTCAP-050](../dd_2_shared_capabilities/dd-2-10-nuxt-capability-detailed-design-v01.md#dd-nuxtcap-050) |
| `DD-NUXTCAP-019` | [DD-1.2](../dd_1_application_core/dd-1-2-execution-outcomes-detailed-design-v01.md#_24-sensitive-information-and-redaction) |
| `DD-NUXTCAP-048` | [DD-1.2](../dd_1_application_core/dd-1-2-execution-outcomes-detailed-design-v01.md#_14-partial-completion) |
| `DD-NUXTCAP-049` | [DD-1.2](../dd_1_application_core/dd-1-2-execution-outcomes-detailed-design-v01.md#_12-consequential-effects) |
| `DD-NUXTCAP-090` | [DD-1.2](../dd_1_application_core/dd-1-2-execution-outcomes-detailed-design-v01.md#_17-cancellation-model) |
| `DD-NUXTCAP-092` | [DD-1.2](../dd_1_application_core/dd-1-2-execution-outcomes-detailed-design-v01.md#_14-partial-completion) |
| `DD-NUXTCAP-025` | [FR-XFORM-013](../functional/source-transformation-functional-specification-v01.md#fr-xform-013); [Design](../appmanager-design-specification-v01.md#_7-10-non-destructive-transformation) |
| `DD-NUXTCAP-041` | [the artefact-delegation contract in §16](../dd_2_shared_capabilities/dd-2-10-nuxt-capability-detailed-design-v01.md#_16-layer-scaffolding-and-resource-registry); [Design](../appmanager-design-specification-v01.md#_6-8-generation-and-templates) |
| `DD-NUXTCAP-045` | [DD-REG-002](../dd_2_shared_capabilities/dd-2-6-resource-registry-and-template-detailed-design-v01.md#dd-reg-002) |
| `DD-NUXTCAP-054` | [Git domain workflows](../dd_3_high_coupling_domains/dd-3-2-git-domain-detailed-design-v01.md); [Repository primitives](../dd_2_shared_capabilities/dd-2-3-repository-capability-detailed-design-v01.md) |
| `DD-NUXTCAP-067` | [Git](../dd_3_high_coupling_domains/dd-3-2-git-domain-detailed-design-v01.md); [FR-NUXT-084](../functional/nuxt-functional-specification-v01.md#fr-nuxt-084) |
| `DD-NUXTCAP-074` | [Documentation Capability](../dd_2_shared_capabilities/dd-2-9-documentation-capability-detailed-design-v01.md); [§6](../dd_2_shared_capabilities/dd-2-10-nuxt-capability-detailed-design-v01.md#_6-nuxt-recognition-and-facts) |
| `DD-NUXTCAP-078` | [DD-2.8 check/gate contracts](../dd_2_shared_capabilities/dd-2-8-quality-capability-detailed-design-v01.md) |
| `DD-NUXTCAP-081` | [DD-PROC-014 structured arguments](../dd_2_shared_capabilities/dd-2-2-process-execution-detailed-design-v01.md#dd-proc-014) |
| `DD-NUXTCAP-082` | [DD-1.2](../dd_1_application_core/dd-1-2-execution-outcomes-detailed-design-v01.md#_18-provider-result-normalization) |
| `DD-NUXTCAP-085` | [Documentation Guide](../project-documentation-guide-v01.md#_8-level-4-implementation-specification) |
| `DD-NUXTCAP-088` | [FR-XFORM-020](../functional/source-transformation-functional-specification-v01.md#fr-xform-020) |
| `DD-NUXTCAP-089` | [DD-1.2](../dd_1_application_core/dd-1-2-execution-outcomes-detailed-design-v01.md#_17-cancellation-model) |
| `DD-NUXTCAP-094` | [FR-INV-020](../functional/application-invocation-functional-specification-v01.md#fr-inv-020); [FR-INV-022](../functional/application-invocation-functional-specification-v01.md#fr-inv-022) |
| `DD-NUXTCAP-099` | [Documentation Guide implementation boundary](../project-documentation-guide-v01.md#_8-level-4-implementation-specification) |
| `DD-QUALCAP-040` | [FR-QUAL-004](../functional/quality-functional-specification-v01.md#fr-qual-004) |
| `DD-APP-016` | [FR-APP-014](../functional/app-functional-specification-v01.md#fr-app-014) |
| `DD-APP-018` | [Settings FR-SET-060](../functional/settings-functional-specification-v01.md#fr-set-060); [FR-SET-061](../functional/settings-functional-specification-v01.md#fr-set-061) |
| `DD-APP-019` | [FR-APP-017](../functional/app-functional-specification-v01.md#fr-app-017) |
| `DD-APP-020` | [FR-APP-019](../functional/app-functional-specification-v01.md#fr-app-019) |
| `DD-APP-022` | [FR-APP-027](../functional/app-functional-specification-v01.md#fr-app-027) |
| `DD-APP-024` | [FR-APP-030](../functional/app-functional-specification-v01.md#fr-app-030) |
| `DD-APP-025` | [FR-APP-032](../functional/app-functional-specification-v01.md#fr-app-032) |
| `DD-APP-028` | [FR-XFORM-014](../functional/source-transformation-functional-specification-v01.md#fr-xform-014) |
| `DD-APP-030` | [FR-APP-030](../functional/app-functional-specification-v01.md#fr-app-030); [FR-APP-032](../functional/app-functional-specification-v01.md#fr-app-032) |
| `DD-APP-032` | [FR-APP-047](../functional/app-functional-specification-v01.md#fr-app-047) |
| `DD-APP-033` | [FR-APP-045](../functional/app-functional-specification-v01.md#fr-app-045) |
| `DD-APP-037` | [FR-APP-057](../functional/app-functional-specification-v01.md#fr-app-057) |
| `DD-APP-038` | [FR-APP-059](../functional/app-functional-specification-v01.md#fr-app-059) |
| `DD-APP-039` | [FR-APP-063](../functional/app-functional-specification-v01.md#fr-app-063) |
| `DD-APP-041` | [FR-APP-064](../functional/app-functional-specification-v01.md#fr-app-064) |
| `DD-APP-043` | [FR-APP-071](../functional/app-functional-specification-v01.md#fr-app-071) |
| `DD-APP-046` | [FR-APP-081](../functional/app-functional-specification-v01.md#fr-app-081) |
| `DD-APP-047` | [FR-APP-084](../functional/app-functional-specification-v01.md#fr-app-084) |
| `DD-APP-051` | [FR-APP-094](../functional/app-functional-specification-v01.md#fr-app-094) |
| `DD-APP-052` | [FR-APP-095](../functional/app-functional-specification-v01.md#fr-app-095); [FR-APP-096](../functional/app-functional-specification-v01.md#fr-app-096) |
| `DD-APP-054` | [FR-APP-098](../functional/app-functional-specification-v01.md#fr-app-098) |
| `DD-APP-059` | [FR-APP-005](../functional/app-functional-specification-v01.md#fr-app-005) |
| `DD-APP-061` | [Design](../appmanager-design-specification-v01.md#_9-9-non-destructive-ownership-and-unmanaged-content) |
| `DD-APP-081` | [FR-APP-024](../functional/app-functional-specification-v01.md#fr-app-024) |
| `DD-APP-082` | [FR-APP-047](../functional/app-functional-specification-v01.md#fr-app-047) |
| `DD-APP-085` | [FR-APP-017](../functional/app-functional-specification-v01.md#fr-app-017) |
| `DD-APP-087` | [FR-APP-078](../functional/app-functional-specification-v01.md#fr-app-078) |
| `DD-APP-011` | [Design](../appmanager-design-specification-v01.md#_9-6-project-discovery-and-context-resolution) |
| `DD-APP-014` | [Design](../appmanager-design-specification-v01.md#_11-11-workflow-results-failure-and-acceptance) |
| `DD-APP-023` | [Design](../appmanager-design-specification-v01.md#_11-11-workflow-results-failure-and-acceptance) |
| `DD-APP-044` | [Design](../appmanager-design-specification-v01.md#_6-8-generation-and-templates) |
| `DD-APP-063` | [Design](../appmanager-design-specification-v01.md#_10-11-cross-domain-workflows) |
| `DD-APP-065` | [Design](../appmanager-design-specification-v01.md#_9-7-managed-scope-and-operation-targeting) |
| `DD-APP-066` | [Design](../appmanager-design-specification-v01.md#_9-9-non-destructive-ownership-and-unmanaged-content) |
| `DD-APP-076` | [Design](../appmanager-design-specification-v01.md#_6-2-application-engine-authority) |
| `DD-APP-078` | [Design](../appmanager-design-specification-v01.md#_4-6-presentation-independence) |
| `DD-APP-089` | [Design](../appmanager-design-specification-v01.md#_6-6-capability-boundaries-and-providers) |
| `DD-APP-069` | [DD-1.2](../dd_1_application_core/dd-1-2-execution-outcomes-detailed-design-v01.md#_12-consequential-effects) |
| `DD-APP-070` | [DD-1.2](../dd_1_application_core/dd-1-2-execution-outcomes-detailed-design-v01.md#_17-cancellation-model) |
| `DD-APP-071` | [DD-1.2](../dd_1_application_core/dd-1-2-execution-outcomes-detailed-design-v01.md#_17-cancellation-model) |
| `DD-APP-073` | [DD-1.2](../dd_1_application_core/dd-1-2-execution-outcomes-detailed-design-v01.md#_14-partial-completion) |
| `DD-APP-075` | [DD-1.2](../dd_1_application_core/dd-1-2-execution-outcomes-detailed-design-v01.md#_12-consequential-effects) |
| `DD-APP-088` | [DD-1.2](../dd_1_application_core/dd-1-2-execution-outcomes-detailed-design-v01.md#_24-sensitive-information-and-redaction) |
| `DD-APP-004` | [DD-1.2 child-result model](../dd_1_application_core/dd-1-2-execution-outcomes-detailed-design-v01.md#_14-partial-completion) |
| `DD-APP-008` | [FR-APP-044](../functional/app-functional-specification-v01.md#fr-app-044); [FR-APP-045](../functional/app-functional-specification-v01.md#fr-app-045); [FR-APP-052](../functional/app-functional-specification-v01.md#fr-app-052) |
| `DD-APP-013` | [DD-APP-003 stage contract](../dd_3_high_coupling_domains/dd-3-1-app-domain-detailed-design-v01.md#dd-app-003) |
| `DD-APP-017` | [FR-APP-024](../functional/app-functional-specification-v01.md#fr-app-024) |
| `DD-APP-026` | [FR-APP-035](../functional/app-functional-specification-v01.md#fr-app-035); [FR-APP-037](../functional/app-functional-specification-v01.md#fr-app-037) |
| `DD-APP-036` | [DD-APP-058](../dd_3_high_coupling_domains/dd-3-1-app-domain-detailed-design-v01.md#dd-app-058); [FR-INV-023](../functional/application-invocation-functional-specification-v01.md#fr-inv-023) |
| `DD-APP-040` | [DD-APP-015](../dd_3_high_coupling_domains/dd-3-1-app-domain-detailed-design-v01.md#dd-app-015) |
| `DD-APP-042` | [FR-APP-067](../functional/app-functional-specification-v01.md#fr-app-067); [FR-APP-068](../functional/app-functional-specification-v01.md#fr-app-068); [FR-APP-069](../functional/app-functional-specification-v01.md#fr-app-069) |
| `DD-APP-045` | [FR-APP-071](../functional/app-functional-specification-v01.md#fr-app-071); [capability bindings](../dd_3_high_coupling_domains/dd-3-1-app-domain-detailed-design-v01.md#_6-consumed-dd-2-shared-capabilities) |
| `DD-APP-048` | [FR-APP-085](../functional/app-functional-specification-v01.md#fr-app-085); [FR-APP-086](../functional/app-functional-specification-v01.md#fr-app-086); [DD-1.2](../dd_1_application_core/dd-1-2-execution-outcomes-detailed-design-v01.md#_14-partial-completion) |
| `DD-APP-050` | [FR-APP-092](../functional/app-functional-specification-v01.md#fr-app-092); [FR-APP-093](../functional/app-functional-specification-v01.md#fr-app-093); [DD-APP-009](../dd_3_high_coupling_domains/dd-3-1-app-domain-detailed-design-v01.md#dd-app-009) |
| `DD-APP-053` | [DD-2.2 structured arguments](../dd_2_shared_capabilities/dd-2-2-process-execution-detailed-design-v01.md#dd-proc-014) |
| `DD-APP-060` | [DD-APP-009](../dd_3_high_coupling_domains/dd-3-1-app-domain-detailed-design-v01.md#dd-app-009) |
| `DD-APP-064` | [creation plan](../dd_3_high_coupling_domains/dd-3-1-app-domain-detailed-design-v01.md#dd-app-007); [Clean plan](../dd_3_high_coupling_domains/dd-3-1-app-domain-detailed-design-v01.md#dd-app-031); [Reset plan](../dd_3_high_coupling_domains/dd-3-1-app-domain-detailed-design-v01.md#dd-app-034); [effect classification](../dd_3_high_coupling_domains/dd-3-1-app-domain-detailed-design-v01.md#dd-app-058) |
| `DD-APP-067` | [DD-ENG-027](../dd_1_application_core/dd-1-5-application-engine-detailed-design-v01.md#dd-eng-027) |
| `DD-APP-068` | [Source Transformation](../dd_2_shared_capabilities/dd-2-5-source-transformation-detailed-design-v01.md); [Settings FR-SET-060](../functional/settings-functional-specification-v01.md#fr-set-060); [Git](../dd_3_high_coupling_domains/dd-3-2-git-domain-detailed-design-v01.md) |
| `DD-APP-072` | [DD-APP-015](../dd_3_high_coupling_domains/dd-3-1-app-domain-detailed-design-v01.md#dd-app-015) |
| `DD-APP-077` | [Application Invocation request contract](../dd_1_application_core/dd-1-1-application-invocation-detailed-design-v01.md) |
| `DD-APP-086` | [DD-2.2 environment contracts](../dd_2_shared_capabilities/dd-2-2-process-execution-detailed-design-v01.md#_11-environment-contract); [DD-1.4 effective configuration](../dd_1_application_core/dd-1-4-configuration-resolution-detailed-design-v01.md#_15-resolution-result) |
| `DD-APP-CI-001` | [Design](../appmanager-design-specification-v01.md#_5-1-domain-oriented-command-model) |
| `DD-APP-CI-002` | [Design](../appmanager-design-specification-v01.md#_11-11-workflow-results-failure-and-acceptance) |
| `DD-APP-CI-003` | [Design](../appmanager-design-specification-v01.md#_9-9-non-destructive-ownership-and-unmanaged-content) |
| `DD-APP-CI-004` | [DD-1.4](../dd_1_application_core/dd-1-4-configuration-resolution-detailed-design-v01.md) |
| `DD-APP-CI-005` | [Settings FR-SET-060/061](../functional/settings-functional-specification-v01.md#fr-set-060) |
| `DD-APP-CI-006` | [DD-APP-031](../dd_3_high_coupling_domains/dd-3-1-app-domain-detailed-design-v01.md#dd-app-031); [DD-APP-034](../dd_3_high_coupling_domains/dd-3-1-app-domain-detailed-design-v01.md#dd-app-034); [DD-APP-035](../dd_3_high_coupling_domains/dd-3-1-app-domain-detailed-design-v01.md#dd-app-035) |
| `DD-APP-CI-007` | [FR-APP-059](../functional/app-functional-specification-v01.md#fr-app-059); [FR-APP-062](../functional/app-functional-specification-v01.md#fr-app-062) |
| `DD-APP-CI-008` | [FR-APP-070](../functional/app-functional-specification-v01.md#fr-app-070); [FR-APP-081](../functional/app-functional-specification-v01.md#fr-app-081) |
| `DD-APP-CI-009` | [Design](../appmanager-design-specification-v01.md#_6-8-generation-and-templates) |
| `DD-APP-CI-010` | [FR-APP-019](../functional/app-functional-specification-v01.md#fr-app-019); [FR-APP-083](../functional/app-functional-specification-v01.md#fr-app-083) |
| `DD-APP-CI-011` | [DD-APP-009](../dd_3_high_coupling_domains/dd-3-1-app-domain-detailed-design-v01.md#dd-app-009); [FR-APP-094](../functional/app-functional-specification-v01.md#fr-app-094) |
| `DD-APP-CI-012` | [Design](../appmanager-design-specification-v01.md#_11-11-workflow-results-failure-and-acceptance) |
| `DD-APP-CI-013` | [DD-1.2](../dd_1_application_core/dd-1-2-execution-outcomes-detailed-design-v01.md#_12-consequential-effects); [DD-1.2](../dd_1_application_core/dd-1-2-execution-outcomes-detailed-design-v01.md#_14-partial-completion) |
| `DD-APP-CI-014` | [Design](../appmanager-design-specification-v01.md#_4-6-presentation-independence) |
| `DD-APP-CI-015` | [Documentation Guide](../project-documentation-guide-v01.md#_8-level-4-implementation-specification) |
| `DD-GIT-001` | [Design](../appmanager-design-specification-v01.md#_6-2-application-engine-authority) |
| `DD-GIT-002` | [Design](../appmanager-design-specification-v01.md#_11-11-workflow-results-failure-and-acceptance) |
| `DD-GIT-003` | [Design](../appmanager-design-specification-v01.md#_6-6-capability-boundaries-and-providers) |
| `DD-GIT-016` | [Design](../appmanager-design-specification-v01.md#_6-2-application-engine-authority) |
| `DD-GIT-017` | [FR-GIT-108](../functional/git-functional-specification-v01.md#fr-git-108); [DD-GIT-061](../dd_3_high_coupling_domains/dd-3-2-git-domain-detailed-design-v01.md#dd-git-061) |
| `DD-GIT-018` | [Design](../appmanager-design-specification-v01.md#_11-11-workflow-results-failure-and-acceptance) |
| `DD-GIT-019` | [Design](../appmanager-design-specification-v01.md#_9-7-managed-scope-and-operation-targeting); [DD-GIT-006](../dd_3_high_coupling_domains/dd-3-2-git-domain-detailed-design-v01.md#dd-git-006) |
| `DD-GIT-020` | [FR-GIT-022](../functional/git-functional-specification-v01.md#fr-git-022); [FR-GIT-084](../functional/git-functional-specification-v01.md#fr-git-084) |
| `DD-GIT-021` | [FR-GIT-031](../functional/git-functional-specification-v01.md#fr-git-031) |
| `DD-GIT-022` | [FR-GIT-029](../functional/git-functional-specification-v01.md#fr-git-029) |
| `DD-GIT-024` | [FR-GIT-033](../functional/git-functional-specification-v01.md#fr-git-033); [FR-GIT-034](../functional/git-functional-specification-v01.md#fr-git-034); [FR-GIT-035](../functional/git-functional-specification-v01.md#fr-git-035); [FR-GIT-036](../functional/git-functional-specification-v01.md#fr-git-036); [DD-GIT-009](../dd_3_high_coupling_domains/dd-3-2-git-domain-detailed-design-v01.md#dd-git-009) |
| `DD-GIT-025` | [FR-GIT-048](../functional/git-functional-specification-v01.md#fr-git-048); [FR-GIT-099](../functional/git-functional-specification-v01.md#fr-git-099) |
| `DD-GIT-026` | [FR-GIT-044](../functional/git-functional-specification-v01.md#fr-git-044); [DD-GIT-007](../dd_3_high_coupling_domains/dd-3-2-git-domain-detailed-design-v01.md#dd-git-007) |
| `DD-GIT-027` | [DD-GIT-013](../dd_3_high_coupling_domains/dd-3-2-git-domain-detailed-design-v01.md#dd-git-013); [DD-GIT-014](../dd_3_high_coupling_domains/dd-3-2-git-domain-detailed-design-v01.md#dd-git-014); [FR-INV-036](../functional/application-invocation-functional-specification-v01.md#fr-inv-036); [FR-INV-045](../functional/application-invocation-functional-specification-v01.md#fr-inv-045) |
| `DD-GIT-028` | [FR-GIT-056](../functional/git-functional-specification-v01.md#fr-git-056) |
| `DD-GIT-029` | [FR-INV-046](../functional/application-invocation-functional-specification-v01.md#fr-inv-046) |
| `DD-GIT-030` | [FR-GIT-068](../functional/git-functional-specification-v01.md#fr-git-068); [FR-GIT-069](../functional/git-functional-specification-v01.md#fr-git-069); [FR-GIT-109](../functional/git-functional-specification-v01.md#fr-git-109); [DD-GIT-010](../dd_3_high_coupling_domains/dd-3-2-git-domain-detailed-design-v01.md#dd-git-010) |
| `DD-GIT-031` | [FR-GIT-073](../functional/git-functional-specification-v01.md#fr-git-073) |
| `DD-GIT-032` | [Design](../appmanager-design-specification-v01.md#_9-6-project-discovery-and-context-resolution) |
| `DD-GIT-033` | [FR-NUXT-065](../functional/nuxt-functional-specification-v01.md#fr-nuxt-065); [FR-NUXT-067](../functional/nuxt-functional-specification-v01.md#fr-nuxt-067) |
| `DD-GIT-034` | [FR-GIT-088](../functional/git-functional-specification-v01.md#fr-git-088); [FR-GIT-089](../functional/git-functional-specification-v01.md#fr-git-089); [DD-GIT-012](../dd_3_high_coupling_domains/dd-3-2-git-domain-detailed-design-v01.md#dd-git-012) |
| `DD-GIT-035` | [FR-GIT-091](../functional/git-functional-specification-v01.md#fr-git-091); [FR-GIT-092](../functional/git-functional-specification-v01.md#fr-git-092) |
| `DD-GIT-036` | [FR-GIT-095](../functional/git-functional-specification-v01.md#fr-git-095) |
| `DD-GIT-039` | [Design](../appmanager-design-specification-v01.md#_6-2-application-engine-authority) |
| `DD-GIT-040` | [Design](../appmanager-design-specification-v01.md#_9-7-managed-scope-and-operation-targeting); [DD-GIT-005](../dd_3_high_coupling_domains/dd-3-2-git-domain-detailed-design-v01.md#dd-git-005) |
| `DD-GIT-041` | [DD-GIT-006](../dd_3_high_coupling_domains/dd-3-2-git-domain-detailed-design-v01.md#dd-git-006) |
| `DD-GIT-042` | [FR-GIT-066](../functional/git-functional-specification-v01.md#fr-git-066); [DD-GIT-005](../dd_3_high_coupling_domains/dd-3-2-git-domain-detailed-design-v01.md#dd-git-005) |
| `DD-GIT-044` | [FR-GIT-110](../functional/git-functional-specification-v01.md#fr-git-110) |
| `DD-GIT-045` | [FR-GIT-087](../functional/git-functional-specification-v01.md#fr-git-087) |
| `DD-GIT-046` | [DD-GIT-008](../dd_3_high_coupling_domains/dd-3-2-git-domain-detailed-design-v01.md#dd-git-008); [Design](../appmanager-design-specification-v01.md#_6-6-capability-boundaries-and-providers) |
| `DD-GIT-048` | [FR-GIT-053](../functional/git-functional-specification-v01.md#fr-git-053) |
| `DD-GIT-050` | [FR-INV-036](../functional/application-invocation-functional-specification-v01.md#fr-inv-036); [FR-INV-045](../functional/application-invocation-functional-specification-v01.md#fr-inv-045) |
| `DD-GIT-052` | [FR-GIT-104](../functional/git-functional-specification-v01.md#fr-git-104) |
| `DD-GIT-053` | [FR-INV-032](../functional/application-invocation-functional-specification-v01.md#fr-inv-032) |
| `DD-GIT-054` | [DD-GIT-013](../dd_3_high_coupling_domains/dd-3-2-git-domain-detailed-design-v01.md#dd-git-013); [DD-1.2 partial completion](../dd_1_application_core/dd-1-2-execution-outcomes-detailed-design-v01.md#_14-partial-completion) |
| `DD-GIT-057` | [Design](../appmanager-design-specification-v01.md#_4-6-presentation-independence) |
| `DD-GIT-058` | [FR-GIT-112](../functional/git-functional-specification-v01.md#fr-git-112) |
| `DD-GIT-059` | [FR-INV-020](../functional/application-invocation-functional-specification-v01.md#fr-inv-020) |
| `DD-GIT-060` | [DD-GIT-014](../dd_3_high_coupling_domains/dd-3-2-git-domain-detailed-design-v01.md#dd-git-014); [FR-INV-021](../functional/application-invocation-functional-specification-v01.md#fr-inv-021) |
| `DD-GIT-063` | [FR-GIT-047](../functional/git-functional-specification-v01.md#fr-git-047); [FR-GIT-076](../functional/git-functional-specification-v01.md#fr-git-076); [FR-GIT-022](../functional/git-functional-specification-v01.md#fr-git-022) |
| `DD-GIT-065` | [DD-GIT-056](../dd_3_high_coupling_domains/dd-3-2-git-domain-detailed-design-v01.md#dd-git-056) |
| `DD-GIT-066` | [DD-1.2 redaction](../dd_1_application_core/dd-1-2-execution-outcomes-detailed-design-v01.md#_24-sensitive-information-and-redaction) |
| `DD-GIT-068` | [FR-GIT-036](../functional/git-functional-specification-v01.md#fr-git-036) |
| `DD-GIT-070` | [Design](../appmanager-design-specification-v01.md#_6-6-capability-boundaries-and-providers) |
| `DD-GIT-071` | [DD-GIT-012](../dd_3_high_coupling_domains/dd-3-2-git-domain-detailed-design-v01.md#dd-git-012); [Design](../appmanager-design-specification-v01.md#_6-6-capability-boundaries-and-providers) |
| `DD-GIT-072` | [FR-GIT-033](../functional/git-functional-specification-v01.md#fr-git-033); [Design](../appmanager-design-specification-v01.md#_11-10-ai-assisted-workflow) |
| `DD-GIT-074` | [The Implementation Specification boundary](../project-documentation-guide-v01.md#_8-level-4-implementation-specification) |
| `DD-GIT-CI-001` | [Design](../appmanager-design-specification-v01.md#_6-6-capability-boundaries-and-providers) |
| `DD-GIT-CI-002` | [Design](../appmanager-design-specification-v01.md#_9-6-project-discovery-and-context-resolution); [Design](../appmanager-design-specification-v01.md#_9-7-managed-scope-and-operation-targeting) |
| `DD-GIT-CI-003` | [Design](../appmanager-design-specification-v01.md#_6-2-application-engine-authority) |
| `DD-GIT-CI-004` | [Design](../appmanager-design-specification-v01.md#_11-11-workflow-results-failure-and-acceptance) |
| `DD-GIT-CI-005` | [Design](../appmanager-design-specification-v01.md#_9-7-managed-scope-and-operation-targeting); [FR-GIT-044](../functional/git-functional-specification-v01.md#fr-git-044); [FR-GIT-066](../functional/git-functional-specification-v01.md#fr-git-066) |
| `DD-GIT-CI-006` | [FR-GIT-069](../functional/git-functional-specification-v01.md#fr-git-069); [FR-GIT-109](../functional/git-functional-specification-v01.md#fr-git-109) |
| `DD-GIT-CI-007` | [FR-INV-036](../functional/application-invocation-functional-specification-v01.md#fr-inv-036); [FR-INV-045](../functional/application-invocation-functional-specification-v01.md#fr-inv-045); [FR-INV-046](../functional/application-invocation-functional-specification-v01.md#fr-inv-046) |
| `DD-GIT-CI-008` | [FR-GIT-033](../functional/git-functional-specification-v01.md#fr-git-033); [Design](../appmanager-design-specification-v01.md#_11-10-ai-assisted-workflow) |
| `DD-GIT-CI-009` | [FR-GIT-088](../functional/git-functional-specification-v01.md#fr-git-088); [FR-GIT-091](../functional/git-functional-specification-v01.md#fr-git-091); [FR-GIT-092](../functional/git-functional-specification-v01.md#fr-git-092); [FR-GIT-095](../functional/git-functional-specification-v01.md#fr-git-095) |
| `DD-GIT-CI-010` | [Design](../appmanager-design-specification-v01.md#_4-6-presentation-independence) |
| `DD-GIT-CI-011` | [Design](../appmanager-design-specification-v01.md#_6-6-capability-boundaries-and-providers); [the implementation boundary](../project-documentation-guide-v01.md#_8-level-4-implementation-specification) |
| `DD-GIT-CI-012` | [DD-2.4 repository-context interpretation](../dd_2_shared_capabilities/dd-2-4-source-intelligence-detailed-design-v01.md#repository-context) |
| `DD-NUXT-001` | [Design](../appmanager-design-specification-v01.md#_6-2-application-engine-authority) |
| `DD-NUXT-002` | [DD-1.5 bootstrap sequencing](../dd_1_application_core/dd-1-5-application-engine-detailed-design-v01.md#dd-core-boot-006) |
| `DD-NUXT-003` | [Design](../appmanager-design-specification-v01.md#_6-6-capability-boundaries-and-providers); [Design](../appmanager-design-specification-v01.md#_10-7-nuxt-domain) |
| `DD-NUXT-004` | [FR-NUXT-058](../functional/nuxt-functional-specification-v01.md#fr-nuxt-058); [DD-NUXT-011](../dd_3_high_coupling_domains/dd-3-3-nuxt-domain-detailed-design-v01.md#dd-nuxt-011) |
| `DD-NUXT-015` | [Design](../appmanager-design-specification-v01.md#_6-2-application-engine-authority); [DD-NUXT-006](../dd_3_high_coupling_domains/dd-3-3-nuxt-domain-detailed-design-v01.md#dd-nuxt-006) |
| `DD-NUXT-017` | [Design](../appmanager-design-specification-v01.md#_9-9-non-destructive-ownership-and-unmanaged-content) |
| `DD-NUXT-019` | [Design](../appmanager-design-specification-v01.md#_9-9-non-destructive-ownership-and-unmanaged-content) |
| `DD-NUXT-020` | [FR-NUXT-092](../functional/nuxt-functional-specification-v01.md#fr-nuxt-092); [FR-NUXT-091](../functional/nuxt-functional-specification-v01.md#fr-nuxt-091) |
| `DD-NUXT-021` | [FR-NUXT-024](../functional/nuxt-functional-specification-v01.md#fr-nuxt-024) |
| `DD-NUXT-022` | [FR-NUXT-026](../functional/nuxt-functional-specification-v01.md#fr-nuxt-026); [FR-NUXT-032](../functional/nuxt-functional-specification-v01.md#fr-nuxt-032) |
| `DD-NUXT-023` | [DD-NUXT-008](../dd_3_high_coupling_domains/dd-3-3-nuxt-domain-detailed-design-v01.md#dd-nuxt-008); [FR-NUXT-036](../functional/nuxt-functional-specification-v01.md#fr-nuxt-036); [FR-XFORM-014](../functional/source-transformation-functional-specification-v01.md#fr-xform-014) |
| `DD-NUXT-024` | [FR-NUXT-037](../functional/nuxt-functional-specification-v01.md#fr-nuxt-037); [FR-NUXT-038](../functional/nuxt-functional-specification-v01.md#fr-nuxt-038) |
| `DD-NUXT-025` | [FR-NUXT-041](../functional/nuxt-functional-specification-v01.md#fr-nuxt-041); [FR-NUXT-107](../functional/nuxt-functional-specification-v01.md#fr-nuxt-107) |
| `DD-NUXT-026` | [FR-NUXT-047](../functional/nuxt-functional-specification-v01.md#fr-nuxt-047) |
| `DD-NUXT-027` | [FR-NUXT-048](../functional/nuxt-functional-specification-v01.md#fr-nuxt-048) |
| `DD-NUXT-028` | [FR-NUXT-054](../functional/nuxt-functional-specification-v01.md#fr-nuxt-054) |
| `DD-NUXT-029` | [DD-NUXT-009](../dd_3_high_coupling_domains/dd-3-3-nuxt-domain-detailed-design-v01.md#dd-nuxt-009); [FR-NUXT-057](../functional/nuxt-functional-specification-v01.md#fr-nuxt-057); [FR-NUXT-058](../functional/nuxt-functional-specification-v01.md#fr-nuxt-058) |
| `DD-NUXT-030` | [DD-NUXT-011](../dd_3_high_coupling_domains/dd-3-3-nuxt-domain-detailed-design-v01.md#dd-nuxt-011); [FR-NUXT-055](../functional/nuxt-functional-specification-v01.md#fr-nuxt-055); [FR-NUXT-058](../functional/nuxt-functional-specification-v01.md#fr-nuxt-058) |
| `DD-NUXT-031` | [Design](../appmanager-design-specification-v01.md#_6-8-generation-and-templates) |
| `DD-NUXT-032` | [FR-NUXT-061](../functional/nuxt-functional-specification-v01.md#fr-nuxt-061) |
| `DD-NUXT-033` | [FR-NUXT-062](../functional/nuxt-functional-specification-v01.md#fr-nuxt-062); [Design](../appmanager-design-specification-v01.md#_11-10-ai-assisted-workflow); [FR-XFORM-060](../functional/source-transformation-functional-specification-v01.md#fr-xform-060) |
| `DD-NUXT-034` | [FR-NUXT-065](../functional/nuxt-functional-specification-v01.md#fr-nuxt-065); [FR-NUXT-066](../functional/nuxt-functional-specification-v01.md#fr-nuxt-066); [FR-NUXT-067](../functional/nuxt-functional-specification-v01.md#fr-nuxt-067); [FR-NUXT-068](../functional/nuxt-functional-specification-v01.md#fr-nuxt-068) |
| `DD-NUXT-035` | [FR-INV-046](../functional/application-invocation-functional-specification-v01.md#fr-inv-046) |
| `DD-NUXT-036` | [FR-NUXT-072](../functional/nuxt-functional-specification-v01.md#fr-nuxt-072) |
| `DD-NUXT-037` | [DD-NUXT-012](../dd_3_high_coupling_domains/dd-3-3-nuxt-domain-detailed-design-v01.md#dd-nuxt-012); [FR-NUXT-073](../functional/nuxt-functional-specification-v01.md#fr-nuxt-073); [managed identity authority](../appmanager-design-specification-v01.md#_9-6-project-discovery-and-context-resolution) |
| `DD-NUXT-038` | [FR-NUXT-017](../functional/nuxt-functional-specification-v01.md#fr-nuxt-017) |
| `DD-NUXT-039` | [FR-NUXT-081](../functional/nuxt-functional-specification-v01.md#fr-nuxt-081) |
| `DD-NUXT-040` | [FR-NUXT-084](../functional/nuxt-functional-specification-v01.md#fr-nuxt-084) |
| `DD-NUXT-041` | [FR-NUXT-088](../functional/nuxt-functional-specification-v01.md#fr-nuxt-088) |
| `DD-NUXT-042` | [FR-NUXT-089](../functional/nuxt-functional-specification-v01.md#fr-nuxt-089); [Design](../appmanager-design-specification-v01.md#_9-9-non-destructive-ownership-and-unmanaged-content); [DD-NUXT-007](../dd_3_high_coupling_domains/dd-3-3-nuxt-domain-detailed-design-v01.md#dd-nuxt-007) |
| `DD-NUXT-043` | [FR-NUXT-091](../functional/nuxt-functional-specification-v01.md#fr-nuxt-091) |
| `DD-NUXT-045` | [FR-INV-036](../functional/application-invocation-functional-specification-v01.md#fr-inv-036); [FR-INV-045](../functional/application-invocation-functional-specification-v01.md#fr-inv-045) |
| `DD-NUXT-046` | [DD-NUXT-061](../dd_3_high_coupling_domains/dd-3-3-nuxt-domain-detailed-design-v01.md#dd-nuxt-061) |
| `DD-NUXT-048` | [Design](../appmanager-design-specification-v01.md#_9-7-managed-scope-and-operation-targeting) |
| `DD-NUXT-049` | [FR-NUXT-032](../functional/nuxt-functional-specification-v01.md#fr-nuxt-032); [FR-NUXT-035](../functional/nuxt-functional-specification-v01.md#fr-nuxt-035) |
| `DD-NUXT-050` | [FR-NUXT-105](../functional/nuxt-functional-specification-v01.md#fr-nuxt-105); [DD-NUXT-007](../dd_3_high_coupling_domains/dd-3-3-nuxt-domain-detailed-design-v01.md#dd-nuxt-007) |
| `DD-NUXT-051` | [FR-NUXT-093](../functional/nuxt-functional-specification-v01.md#fr-nuxt-093); [FR-NUXT-094](../functional/nuxt-functional-specification-v01.md#fr-nuxt-094); [FR-NUXT-096](../functional/nuxt-functional-specification-v01.md#fr-nuxt-096) |
| `DD-NUXT-052` | [FR-DOCS-100](../functional/docs-functional-specification-v01.md#fr-docs-100); [FR-NUXT-058](../functional/nuxt-functional-specification-v01.md#fr-nuxt-058); [DD-2.10 scaffold ownership](../dd_2_shared_capabilities/dd-2-10-nuxt-capability-detailed-design-v01.md#_16-layer-scaffolding-and-resource-registry) |
| `DD-NUXT-055` | [FR-NUXT-067](../functional/nuxt-functional-specification-v01.md#fr-nuxt-067) |
| `DD-NUXT-056` | [FR-NUXT-060](../functional/nuxt-functional-specification-v01.md#fr-nuxt-060) |
| `DD-NUXT-057` | [Design](../appmanager-design-specification-v01.md#_6-6-capability-boundaries-and-providers) |
| `DD-NUXT-058` | [FR-XFORM-014](../functional/source-transformation-functional-specification-v01.md#fr-xform-014) |
| `DD-NUXT-059` | [Design](../appmanager-design-specification-v01.md#_6-8-generation-and-templates) |
| `DD-NUXT-060` | [Design §7.10](../appmanager-design-specification-v01.md#_7-10-non-destructive-transformation) |
| `DD-NUXT-062` | [FR-NUXT-054](../functional/nuxt-functional-specification-v01.md#fr-nuxt-054); [Design](../appmanager-design-specification-v01.md#_9-9-non-destructive-ownership-and-unmanaged-content) |
| `DD-NUXT-063` | [FR-INV-040](../functional/application-invocation-functional-specification-v01.md#fr-inv-040) |
| `DD-NUXT-064` | [Design](../appmanager-design-specification-v01.md#_9-6-project-discovery-and-context-resolution); [Design](../appmanager-design-specification-v01.md#_9-9-non-destructive-ownership-and-unmanaged-content) |
| `DD-NUXT-066` | [DD-1.2 cancellation](../dd_1_application_core/dd-1-2-execution-outcomes-detailed-design-v01.md#_17-cancellation-model) |
| `DD-NUXT-067` | [FR-INV-032](../functional/application-invocation-functional-specification-v01.md#fr-inv-032) |
| `DD-NUXT-068` | [DD-NUXT-013](../dd_3_high_coupling_domains/dd-3-3-nuxt-domain-detailed-design-v01.md#dd-nuxt-013); [DD-1.2 partial completion](../dd_1_application_core/dd-1-2-execution-outcomes-detailed-design-v01.md#_14-partial-completion) |
| `DD-NUXT-069` | [DD-NUXT-014](../dd_3_high_coupling_domains/dd-3-3-nuxt-domain-detailed-design-v01.md#dd-nuxt-014); [FR-INV-046](../functional/application-invocation-functional-specification-v01.md#fr-inv-046) |
| `DD-NUXT-070` | [DD-NUXT-018](../dd_3_high_coupling_domains/dd-3-3-nuxt-domain-detailed-design-v01.md#dd-nuxt-018); [FR-NUXT-068](../functional/nuxt-functional-specification-v01.md#fr-nuxt-068) |
| `DD-NUXT-071` | [Design](../appmanager-design-specification-v01.md#_4-6-presentation-independence) |
| `DD-NUXT-072` | [FR-NUXT-111](../functional/nuxt-functional-specification-v01.md#fr-nuxt-111) |
| `DD-NUXT-073` | [FR-INV-020](../functional/application-invocation-functional-specification-v01.md#fr-inv-020) |
| `DD-NUXT-074` | [DD-NUXT-013](../dd_3_high_coupling_domains/dd-3-3-nuxt-domain-detailed-design-v01.md#dd-nuxt-013); [FR-INV-021](../functional/application-invocation-functional-specification-v01.md#fr-inv-021) |
| `DD-NUXT-075` | [FR-NUXT-037](../functional/nuxt-functional-specification-v01.md#fr-nuxt-037); [FR-NUXT-046](../functional/nuxt-functional-specification-v01.md#fr-nuxt-046); [FR-NUXT-078](../functional/nuxt-functional-specification-v01.md#fr-nuxt-078) |
| `DD-NUXT-076` | [DD-NUXT-061](../dd_3_high_coupling_domains/dd-3-3-nuxt-domain-detailed-design-v01.md#dd-nuxt-061) |
| `DD-NUXT-077` | [FR-NUXT-038](../functional/nuxt-functional-specification-v01.md#fr-nuxt-038); [FR-NUXT-079](../functional/nuxt-functional-specification-v01.md#fr-nuxt-079) |
| `DD-NUXT-079` | [Design](../appmanager-design-specification-v01.md#_11-11-workflow-results-failure-and-acceptance) |
| `DD-NUXT-082` | [FR-INV-040](../functional/application-invocation-functional-specification-v01.md#fr-inv-040) |
| `DD-NUXT-085` | [Design](../appmanager-design-specification-v01.md#_6-6-capability-boundaries-and-providers) |
| `DD-NUXT-086` | [FR-XFORM-048](../functional/source-transformation-functional-specification-v01.md#fr-xform-048) |
| `DD-NUXT-087` | [DD-NUXT-009](../dd_3_high_coupling_domains/dd-3-3-nuxt-domain-detailed-design-v01.md#dd-nuxt-009); [Design](../appmanager-design-specification-v01.md#_6-9-registries) |
| `DD-NUXT-088` | [Design](../appmanager-design-specification-v01.md#_10-11-cross-domain-workflows) |
| `DD-NUXT-CI-001` | [Design](../appmanager-design-specification-v01.md#_6-2-application-engine-authority) |
| `DD-NUXT-CI-002` | [Design](../appmanager-design-specification-v01.md#_6-6-capability-boundaries-and-providers) |
| `DD-NUXT-CI-003` | [FR-XFORM-014](../functional/source-transformation-functional-specification-v01.md#fr-xform-014) |
| `DD-NUXT-CI-004` | [FR-NUXT-058](../functional/nuxt-functional-specification-v01.md#fr-nuxt-058); [DD-2.10 scaffold collaborators](../dd_2_shared_capabilities/dd-2-10-nuxt-capability-detailed-design-v01.md#_16-layer-scaffolding-and-resource-registry) |
| `DD-NUXT-CI-005` | [FR-NUXT-017](../functional/nuxt-functional-specification-v01.md#fr-nuxt-017); [FR-NUXT-076](../functional/nuxt-functional-specification-v01.md#fr-nuxt-076); [FR-NUXT-084](../functional/nuxt-functional-specification-v01.md#fr-nuxt-084); [FR-NUXT-088](../functional/nuxt-functional-specification-v01.md#fr-nuxt-088) |
| `DD-NUXT-CI-006` | [Design](../appmanager-design-specification-v01.md#_9-9-non-destructive-ownership-and-unmanaged-content) |
| `DD-NUXT-CI-007` | [Design](../appmanager-design-specification-v01.md#_11-11-workflow-results-failure-and-acceptance) |
| `DD-NUXT-CI-008` | [FR-INV-036](../functional/application-invocation-functional-specification-v01.md#fr-inv-036); [FR-INV-045](../functional/application-invocation-functional-specification-v01.md#fr-inv-045); [FR-INV-046](../functional/application-invocation-functional-specification-v01.md#fr-inv-046) |
| `DD-NUXT-CI-009` | [Design](../appmanager-design-specification-v01.md#_4-6-presentation-independence) |
| `DD-NUXT-CI-010` | [Design](../appmanager-design-specification-v01.md#_6-6-capability-boundaries-and-providers) |
| `DD-NUXT-CI-011` | [Design](../appmanager-design-specification-v01.md#_10-11-cross-domain-workflows); [FR-NUXT-058](../functional/nuxt-functional-specification-v01.md#fr-nuxt-058) |
| `DD-NUXT-CI-012` | [the Implementation Specification boundary](../project-documentation-guide-v01.md#_8-level-4-implementation-specification) |
| `DD-DOCS-001` | [Design](../appmanager-design-specification-v01.md#_6-2-application-engine-authority) |
| `DD-DOCS-003` | [Design](../appmanager-design-specification-v01.md#_11-11-workflow-results-failure-and-acceptance) |
| `DD-DOCS-004` | [Design](../appmanager-design-specification-v01.md#_6-6-capability-boundaries-and-providers) |
| `DD-DOCS-006` | [FR-DOCS-020](../functional/docs-functional-specification-v01.md#fr-docs-020); [Design](../appmanager-design-specification-v01.md#_9-6-project-discovery-and-context-resolution) |
| `DD-DOCS-007` | [Design](../appmanager-design-specification-v01.md#_9-3-root-application-and-managed-layers) |
| `DD-DOCS-008` | [FR-DOCS-029](../functional/docs-functional-specification-v01.md#fr-docs-029) |
| `DD-DOCS-011` | [DD-DOCS-010](../dd_3_high_coupling_domains/dd-3-4-docs-domain-detailed-design-v01.md#dd-docs-010); [Design](../appmanager-design-specification-v01.md#_9-7-managed-scope-and-operation-targeting) |
| `DD-DOCS-012` | [Design](../appmanager-design-specification-v01.md#_6-8-generation-and-templates); [coordinated artefact plan](../dd_3_high_coupling_domains/dd-3-4-docs-domain-detailed-design-v01.md#coordinated-artefact-plan) |
| `DD-DOCS-013` | [FR-DOCS-075](../functional/docs-functional-specification-v01.md#fr-docs-075) |
| `DD-DOCS-015` | [DD-1.2 outcome contract](../dd_1_application_core/dd-1-2-execution-outcomes-detailed-design-v01.md#_7-outcome-contract) |
| `DD-DOCS-016` | [FR-DOCS-003](../functional/docs-functional-specification-v01.md#fr-docs-003); [FR-DOCS-118](../functional/docs-functional-specification-v01.md#fr-docs-118) |
| `DD-DOCS-017` | [FR-DOCS-032](../functional/docs-functional-specification-v01.md#fr-docs-032) |
| `DD-DOCS-018` | [FR-DOCS-038](../functional/docs-functional-specification-v01.md#fr-docs-038); [FR-DOCS-040](../functional/docs-functional-specification-v01.md#fr-docs-040) |
| `DD-DOCS-019` | [FR-DOCS-039](../functional/docs-functional-specification-v01.md#fr-docs-039); [DD-DOCS-014](../dd_3_high_coupling_domains/dd-3-4-docs-domain-detailed-design-v01.md#dd-docs-014) |
| `DD-DOCS-020` | [FR-DOCS-044](../functional/docs-functional-specification-v01.md#fr-docs-044); [FR-DOCS-045](../functional/docs-functional-specification-v01.md#fr-docs-045) |
| `DD-DOCS-021` | [FR-DOCS-046](../functional/docs-functional-specification-v01.md#fr-docs-046); [FR-XFORM-033](../functional/source-transformation-functional-specification-v01.md#fr-xform-033) |
| `DD-DOCS-022` | [FR-DOCS-101](../functional/docs-functional-specification-v01.md#fr-docs-101) |
| `DD-DOCS-023` | [FR-DOCS-056](../functional/docs-functional-specification-v01.md#fr-docs-056) |
| `DD-DOCS-024` | [FR-DOCS-PBC-022](../functional/docs-functional-specification-v01.md#fr-docs-pbc-022); [FR-DOCS-059](../functional/docs-functional-specification-v01.md#fr-docs-059) |
| `DD-DOCS-025` | [FR-DOCS-062](../functional/docs-functional-specification-v01.md#fr-docs-062) |
| `DD-DOCS-026` | [FR-DOCS-065](../functional/docs-functional-specification-v01.md#fr-docs-065) |
| `DD-DOCS-027` | [FR-DOCS-026](../functional/docs-functional-specification-v01.md#fr-docs-026); [FR-DOCS-072](../functional/docs-functional-specification-v01.md#fr-docs-072); [FR-DOCS-015](../functional/docs-functional-specification-v01.md#fr-docs-015) |
| `DD-DOCS-028` | [Design](../appmanager-design-specification-v01.md#_6-8-generation-and-templates) |
| `DD-DOCS-029` | [FR-DOCS-076](../functional/docs-functional-specification-v01.md#fr-docs-076) |
| `DD-DOCS-030` | [Design](../appmanager-design-specification-v01.md#_7-10-non-destructive-transformation) |
| `DD-DOCS-031` | [FR-DOCS-116](../functional/docs-functional-specification-v01.md#fr-docs-116) |
| `DD-DOCS-032` | [FR-DOCS-084](../functional/docs-functional-specification-v01.md#fr-docs-084); [FR-DOCS-088](../functional/docs-functional-specification-v01.md#fr-docs-088) |
| `DD-DOCS-034` | [FR-DOCS-087](../functional/docs-functional-specification-v01.md#fr-docs-087); [Documentation Capability conflict contract](../dd_2_shared_capabilities/dd-2-9-documentation-capability-detailed-design-v01.md#dd-doccap-021) |
| `DD-DOCS-035` | [FR-DOCS-092](../functional/docs-functional-specification-v01.md#fr-docs-092) |
| `DD-DOCS-036` | [Design](../appmanager-design-specification-v01.md#_11-11-workflow-results-failure-and-acceptance) |
| `DD-DOCS-037` | [FR-DOCS-095](../functional/docs-functional-specification-v01.md#fr-docs-095); [FR-DOCS-097](../functional/docs-functional-specification-v01.md#fr-docs-097) |
| `DD-DOCS-038` | [FR-DOCS-104](../functional/docs-functional-specification-v01.md#fr-docs-104); [FR-DOCS-105](../functional/docs-functional-specification-v01.md#fr-docs-105); [DD-DOCS-010](../dd_3_high_coupling_domains/dd-3-4-docs-domain-detailed-design-v01.md#dd-docs-010) |
| `DD-DOCS-039` | [FR-DOCS-102](../functional/docs-functional-specification-v01.md#fr-docs-102) |
| `DD-DOCS-043` | [Design](../appmanager-design-specification-v01.md#_6-2-application-engine-authority) |
| `DD-DOCS-044` | [FR-PROJ-005](../functional/managed-project-functional-specification-v01.md#fr-proj-005) |
| `DD-DOCS-045` | [Design](../appmanager-design-specification-v01.md#_9-7-managed-scope-and-operation-targeting) |
| `DD-DOCS-046` | [FR-DOCS-038](../functional/docs-functional-specification-v01.md#fr-docs-038); [FR-DOCS-040](../functional/docs-functional-specification-v01.md#fr-docs-040); [DD-DOCS-014](../dd_3_high_coupling_domains/dd-3-4-docs-domain-detailed-design-v01.md#dd-docs-014) |
| `DD-DOCS-047` | [FR-DOCS-037](../functional/docs-functional-specification-v01.md#fr-docs-037) |
| `DD-DOCS-048` | [FR-DOCS-081](../functional/docs-functional-specification-v01.md#fr-docs-081) |
| `DD-DOCS-049` | [FR-DOCS-018](../functional/docs-functional-specification-v01.md#fr-docs-018) |
| `DD-DOCS-050` | [FR-DOCS-093](../functional/docs-functional-specification-v01.md#fr-docs-093) |
| `DD-DOCS-051` | [Design](../appmanager-design-specification-v01.md#_9-9-non-destructive-ownership-and-unmanaged-content) |
| `DD-DOCS-052` | [FR-DOCS-004](../functional/docs-functional-specification-v01.md#fr-docs-004) |
| `DD-DOCS-053` | [Design](../appmanager-design-specification-v01.md#_6-8-generation-and-templates) |
| `DD-DOCS-054` | [FR-DOCS-028](../functional/docs-functional-specification-v01.md#fr-docs-028) |
| `DD-DOCS-055` | [FR-DOCS-115](../functional/docs-functional-specification-v01.md#fr-docs-115) |
| `DD-DOCS-056` | [FR-DOCS-118](../functional/docs-functional-specification-v01.md#fr-docs-118) |
| `DD-DOCS-057` | [FR-DOCS-107](../functional/docs-functional-specification-v01.md#fr-docs-107) |
| `DD-DOCS-058` | [DD-DOCS-042](../dd_3_high_coupling_domains/dd-3-4-docs-domain-detailed-design-v01.md#dd-docs-042); [DD-1.2 partial completion](../dd_1_application_core/dd-1-2-execution-outcomes-detailed-design-v01.md#_14-partial-completion) |
| `DD-DOCS-059` | [FR-INV-046](../functional/application-invocation-functional-specification-v01.md#fr-inv-046) |
| `DD-DOCS-060` | [FR-DOCS-016](../functional/docs-functional-specification-v01.md#fr-docs-016); [DD-1.2 cancellation propagation](../dd_1_application_core/dd-1-2-execution-outcomes-detailed-design-v01.md#_17-cancellation-model) |
| `DD-DOCS-061` | [FR-INV-045](../functional/application-invocation-functional-specification-v01.md#fr-inv-045) |
| `DD-DOCS-063` | [Design](../appmanager-design-specification-v01.md#_4-6-presentation-independence) |
| `DD-DOCS-064` | [FR-INV-019](../functional/application-invocation-functional-specification-v01.md#fr-inv-019) |
| `DD-DOCS-065` | [FR-INV-020](../functional/application-invocation-functional-specification-v01.md#fr-inv-020) |
| `DD-DOCS-066` | [DD-DOCS-015](../dd_3_high_coupling_domains/dd-3-4-docs-domain-detailed-design-v01.md#dd-docs-015); [FR-INV-021](../functional/application-invocation-functional-specification-v01.md#fr-inv-021) |
| `DD-DOCS-068` | [FR-DOCS-080](../functional/docs-functional-specification-v01.md#fr-docs-080) |
| `DD-DOCS-069` | [FR-DOCS-080](../functional/docs-functional-specification-v01.md#fr-docs-080) |
| `DD-DOCS-070` | [FR-XFORM-020](../functional/source-transformation-functional-specification-v01.md#fr-xform-020); [FR-XFORM-068](../functional/source-transformation-functional-specification-v01.md#fr-xform-068) |
| `DD-DOCS-071` | [DD-1.2 no-op interpretation](../dd_1_application_core/dd-1-2-execution-outcomes-detailed-design-v01.md#_15-no-op-already-satisfied-skipped-and-not-attempted-states) |
| `DD-DOCS-075` | [FR-INV-040](../functional/application-invocation-functional-specification-v01.md#fr-inv-040) |
| `DD-DOCS-077` | [Design](../appmanager-design-specification-v01.md#_6-6-capability-boundaries-and-providers) |
| `DD-DOCS-078` | [Design](../appmanager-design-specification-v01.md#_6-6-capability-boundaries-and-providers) |
| `DD-DOCS-079` | [FR-DOCS-084](../functional/docs-functional-specification-v01.md#fr-docs-084); [Design](../appmanager-design-specification-v01.md#_11-10-ai-assisted-workflow) |
| `DD-DOCS-081` | [the Implementation Specification boundary](../project-documentation-guide-v01.md#_8-level-4-implementation-specification) |
| `DD-DOCS-CI-001` | [Design](../appmanager-design-specification-v01.md#_6-2-application-engine-authority) |
| `DD-DOCS-CI-002` | [Design](../appmanager-design-specification-v01.md#_6-6-capability-boundaries-and-providers) |
| `DD-DOCS-CI-003` | [Design](../appmanager-design-specification-v01.md#_9-9-non-destructive-ownership-and-unmanaged-content) |
| `DD-DOCS-CI-004` | [FR-DOCS-037](../functional/docs-functional-specification-v01.md#fr-docs-037); [FR-DOCS-079](../functional/docs-functional-specification-v01.md#fr-docs-079); [FR-DOCS-087](../functional/docs-functional-specification-v01.md#fr-docs-087); [DD-DOCCAP-021](../dd_2_shared_capabilities/dd-2-9-documentation-capability-detailed-design-v01.md#dd-doccap-021) |
| `DD-DOCS-CI-005` | [FR-XFORM-033](../functional/source-transformation-functional-specification-v01.md#fr-xform-033) |
| `DD-DOCS-CI-006` | [Design](../appmanager-design-specification-v01.md#_10-11-cross-domain-workflows) |
| `DD-DOCS-CI-007` | [Design](../appmanager-design-specification-v01.md#_11-11-workflow-results-failure-and-acceptance) |
| `DD-DOCS-CI-008` | [FR-DOCS-038](../functional/docs-functional-specification-v01.md#fr-docs-038); [FR-DOCS-040](../functional/docs-functional-specification-v01.md#fr-docs-040); [FR-DOCS-081](../functional/docs-functional-specification-v01.md#fr-docs-081) |
| `DD-DOCS-CI-009` | [FR-INV-045](../functional/application-invocation-functional-specification-v01.md#fr-inv-045); [FR-INV-046](../functional/application-invocation-functional-specification-v01.md#fr-inv-046) |
| `DD-DOCS-CI-010` | [Design](../appmanager-design-specification-v01.md#_4-6-presentation-independence) |
| `DD-DOCS-CI-011` | [Design](../appmanager-design-specification-v01.md#_6-6-capability-boundaries-and-providers) |
| `DD-DOCS-CI-012` | [the Implementation Specification boundary](../project-documentation-guide-v01.md#_8-level-4-implementation-specification) |
| `DD-QUAL-001` | [Design](../appmanager-design-specification-v01.md#_6-2-application-engine-authority) |
| `DD-QUAL-003` | [Design](../appmanager-design-specification-v01.md#_11-11-workflow-results-failure-and-acceptance) |
| `DD-QUAL-005` | [FR-QUAL-067](../functional/quality-functional-specification-v01.md#fr-qual-067) |
| `DD-QUAL-007` | [Design](../appmanager-design-specification-v01.md#_9-6-project-discovery-and-context-resolution) |
| `DD-QUAL-008` | [FR-QUAL-025](../functional/quality-functional-specification-v01.md#fr-qual-025) |
| `DD-QUAL-009` | [FR-QUAL-025](../functional/quality-functional-specification-v01.md#fr-qual-025); [FR-QUAL-098](../functional/quality-functional-specification-v01.md#fr-qual-098) |
| `DD-QUAL-010` | [FR-QUAL-097](../functional/quality-functional-specification-v01.md#fr-qual-097); [FR-QUAL-098](../functional/quality-functional-specification-v01.md#fr-qual-098); [FR-QUAL-099](../functional/quality-functional-specification-v01.md#fr-qual-099) |
| `DD-QUAL-011` | [FR-QUAL-072](../functional/quality-functional-specification-v01.md#fr-qual-072); [FR-QUAL-051](../functional/quality-functional-specification-v01.md#fr-qual-051); [FR-INV-039](../functional/application-invocation-functional-specification-v01.md#fr-inv-039) |
| `DD-QUAL-012` | [FR-QUAL-075](../functional/quality-functional-specification-v01.md#fr-qual-075); [FR-QUAL-077](../functional/quality-functional-specification-v01.md#fr-qual-077); [FR-QUAL-078](../functional/quality-functional-specification-v01.md#fr-qual-078) |
| `DD-QUAL-013` | [FR-QUAL-081](../functional/quality-functional-specification-v01.md#fr-qual-081); [FR-QUAL-001](../functional/quality-functional-specification-v01.md#fr-qual-001) |
| `DD-QUAL-014` | [DD-1.2 outcome contract](../dd_1_application_core/dd-1-2-execution-outcomes-detailed-design-v01.md#_7-outcome-contract) |
| `DD-QUAL-015` | [Design](../appmanager-design-specification-v01.md#_9-7-managed-scope-and-operation-targeting) |
| `DD-QUAL-017` | [FR-QUAL-032](../functional/quality-functional-specification-v01.md#fr-qual-032) |
| `DD-QUAL-018` | [FR-QUAL-035](../functional/quality-functional-specification-v01.md#fr-qual-035) |
| `DD-QUAL-019` | [FR-QUAL-036](../functional/quality-functional-specification-v01.md#fr-qual-036); [FR-QUAL-037](../functional/quality-functional-specification-v01.md#fr-qual-037) |
| `DD-QUAL-020` | [FR-QUAL-043](../functional/quality-functional-specification-v01.md#fr-qual-043); [FR-QUAL-044](../functional/quality-functional-specification-v01.md#fr-qual-044) |
| `DD-QUAL-021` | [FR-QUAL-045](../functional/quality-functional-specification-v01.md#fr-qual-045) |
| `DD-QUAL-022` | [FR-QUAL-048](../functional/quality-functional-specification-v01.md#fr-qual-048); [FR-QUAL-050](../functional/quality-functional-specification-v01.md#fr-qual-050); [FR-QUAL-052](../functional/quality-functional-specification-v01.md#fr-qual-052) |
| `DD-QUAL-023` | [FR-QUAL-053](../functional/quality-functional-specification-v01.md#fr-qual-053) |
| `DD-QUAL-024` | [FR-QUAL-004](../functional/quality-functional-specification-v01.md#fr-qual-004) |
| `DD-QUAL-025` | [FR-QUAL-056](../functional/quality-functional-specification-v01.md#fr-qual-056); [FR-INV-039](../functional/application-invocation-functional-specification-v01.md#fr-inv-039) |
| `DD-QUAL-026` | [FR-QUAL-064](../functional/quality-functional-specification-v01.md#fr-qual-064) |
| `DD-QUAL-027` | [FR-PROJ-042](../functional/managed-project-functional-specification-v01.md#fr-proj-042) |
| `DD-QUAL-028` | [FR-QUAL-066](../functional/quality-functional-specification-v01.md#fr-qual-066); [FR-QUAL-067](../functional/quality-functional-specification-v01.md#fr-qual-067); [FR-XFORM-048](../functional/source-transformation-functional-specification-v01.md#fr-xform-048) |
| `DD-QUAL-029` | [FR-QUAL-077](../functional/quality-functional-specification-v01.md#fr-qual-077); [FR-QUAL-078](../functional/quality-functional-specification-v01.md#fr-qual-078) |
| `DD-QUAL-030` | [FR-QUAL-079](../functional/quality-functional-specification-v01.md#fr-qual-079) |
| `DD-QUAL-031` | [FR-QUAL-082](../functional/quality-functional-specification-v01.md#fr-qual-082) |
| `DD-QUAL-032` | [FR-QUAL-083](../functional/quality-functional-specification-v01.md#fr-qual-083) |
| `DD-QUAL-033` | [FR-QUAL-084](../functional/quality-functional-specification-v01.md#fr-qual-084); [FR-QUAL-085](../functional/quality-functional-specification-v01.md#fr-qual-085) |
| `DD-QUAL-035` | [FR-QUAL-091](../functional/quality-functional-specification-v01.md#fr-qual-091); [FR-QUAL-001](../functional/quality-functional-specification-v01.md#fr-qual-001) |
| `DD-QUAL-037` | [FR-INV-045](../functional/application-invocation-functional-specification-v01.md#fr-inv-045) |
| `DD-QUAL-038` | [FR-QUAL-043](../functional/quality-functional-specification-v01.md#fr-qual-043); [FR-QUAL-044](../functional/quality-functional-specification-v01.md#fr-qual-044) |
| `DD-QUAL-039` | [FR-QUAL-099](../functional/quality-functional-specification-v01.md#fr-qual-099); [FR-QUAL-098](../functional/quality-functional-specification-v01.md#fr-qual-098) |
| `DD-QUAL-040` | [FR-PROJ-042](../functional/managed-project-functional-specification-v01.md#fr-proj-042) |
| `DD-QUAL-042` | [FR-QUAL-051](../functional/quality-functional-specification-v01.md#fr-qual-051); [FR-QUAL-072](../functional/quality-functional-specification-v01.md#fr-qual-072) |
| `DD-QUAL-043` | [FR-QUAL-074](../functional/quality-functional-specification-v01.md#fr-qual-074) |
| `DD-QUAL-044` | [FR-QUAL-097](../functional/quality-functional-specification-v01.md#fr-qual-097) |
| `DD-QUAL-045` | [Design](../appmanager-design-specification-v01.md#_11-11-workflow-results-failure-and-acceptance) |
| `DD-QUAL-046` | [Design](../appmanager-design-specification-v01.md#_4-6-presentation-independence) |
| `DD-QUAL-048` | [FR-QUAL-004](../functional/quality-functional-specification-v01.md#fr-qual-004) |
| `DD-QUAL-049` | [FR-QUAL-060](../functional/quality-functional-specification-v01.md#fr-qual-060) |
| `DD-QUAL-050` | [FR-QUAL-112](../functional/quality-functional-specification-v01.md#fr-qual-112) |
| `DD-QUAL-051` | [FR-PROJ-061](../functional/managed-project-functional-specification-v01.md#fr-proj-061); [FR-INV-020](../functional/application-invocation-functional-specification-v01.md#fr-inv-020) |
| `DD-QUAL-052` | [DD-PROC-014 structured arguments](../dd_2_shared_capabilities/dd-2-2-process-execution-detailed-design-v01.md#dd-proc-014) |
| `DD-QUAL-053` | [FR-QUAL-095](../functional/quality-functional-specification-v01.md#fr-qual-095) |
| `DD-QUAL-054` | [DD-1.2 provider-result normalization](../dd_1_application_core/dd-1-2-execution-outcomes-detailed-design-v01.md#_18-provider-result-normalization) |
| `DD-QUAL-055` | [FR-QUAL-017](../functional/quality-functional-specification-v01.md#fr-qual-017); [DD-1.2 propagation](../dd_1_application_core/dd-1-2-execution-outcomes-detailed-design-v01.md#_17-cancellation-model) |
| `DD-QUAL-056` | [FR-INV-045](../functional/application-invocation-functional-specification-v01.md#fr-inv-045) |
| `DD-QUAL-057` | [FR-QUAL-078](../functional/quality-functional-specification-v01.md#fr-qual-078); [FR-QUAL-086](../functional/quality-functional-specification-v01.md#fr-qual-086) |
| `DD-QUAL-058` | [FR-QUAL-096](../functional/quality-functional-specification-v01.md#fr-qual-096); [FR-QUAL-087](../functional/quality-functional-specification-v01.md#fr-qual-087) |
| `DD-QUAL-059` | [FR-INV-046](../functional/application-invocation-functional-specification-v01.md#fr-inv-046); [FR-QUAL-004](../functional/quality-functional-specification-v01.md#fr-qual-004) |
| `DD-QUAL-061` | [Design](../appmanager-design-specification-v01.md#_4-6-presentation-independence) |
| `DD-QUAL-062` | [FR-INV-019](../functional/application-invocation-functional-specification-v01.md#fr-inv-019) |
| `DD-QUAL-063` | [FR-INV-020](../functional/application-invocation-functional-specification-v01.md#fr-inv-020) |
| `DD-QUAL-064` | [FR-INV-021](../functional/application-invocation-functional-specification-v01.md#fr-inv-021) |
| `DD-QUAL-065` | [FR-QUAL-045](../functional/quality-functional-specification-v01.md#fr-qual-045) |
| `DD-QUAL-066` | [FR-QUAL-109](../functional/quality-functional-specification-v01.md#fr-qual-109) |
| `DD-QUAL-067` | [FR-QUAL-109](../functional/quality-functional-specification-v01.md#fr-qual-109) |
| `DD-QUAL-068` | [FR-QUAL-103](../functional/quality-functional-specification-v01.md#fr-qual-103) |
| `DD-QUAL-071` | [FR-QUAL-110](../functional/quality-functional-specification-v01.md#fr-qual-110) |
| `DD-QUAL-073` | [FR-INV-040](../functional/application-invocation-functional-specification-v01.md#fr-inv-040) |
| `DD-QUAL-075` | [Design](../appmanager-design-specification-v01.md#_9-7-managed-scope-and-operation-targeting) |
| `DD-QUAL-077` | [Design](../appmanager-design-specification-v01.md#_6-6-capability-boundaries-and-providers) |
| `DD-QUAL-079` | [FR-QUAL-066](../functional/quality-functional-specification-v01.md#fr-qual-066); [FR-QUAL-067](../functional/quality-functional-specification-v01.md#fr-qual-067) |
| `DD-QUAL-081` | [the Implementation Specification boundary](../project-documentation-guide-v01.md#_8-level-4-implementation-specification) |
| `DD-QUAL-CI-001` | [Design](../appmanager-design-specification-v01.md#_6-2-application-engine-authority) |
| `DD-QUAL-CI-002` | [Design](../appmanager-design-specification-v01.md#_6-6-capability-boundaries-and-providers) |
| `DD-QUAL-CI-003` | [Design](../appmanager-design-specification-v01.md#_11-11-workflow-results-failure-and-acceptance) |
| `DD-QUAL-CI-004` | [FR-QUAL-050](../functional/quality-functional-specification-v01.md#fr-qual-050); [FR-QUAL-075](../functional/quality-functional-specification-v01.md#fr-qual-075) |
| `DD-QUAL-CI-005` | [FR-QUAL-025](../functional/quality-functional-specification-v01.md#fr-qual-025) |
| `DD-QUAL-CI-006` | [FR-QUAL-004](../functional/quality-functional-specification-v01.md#fr-qual-004) |
| `DD-QUAL-CI-007` | [FR-QUAL-067](../functional/quality-functional-specification-v01.md#fr-qual-067); [FR-XFORM-048](../functional/source-transformation-functional-specification-v01.md#fr-xform-048) |
| `DD-QUAL-CI-008` | [FR-QUAL-097](../functional/quality-functional-specification-v01.md#fr-qual-097); [FR-QUAL-098](../functional/quality-functional-specification-v01.md#fr-qual-098); [FR-QUAL-099](../functional/quality-functional-specification-v01.md#fr-qual-099); [FR-QUAL-078](../functional/quality-functional-specification-v01.md#fr-qual-078); [FR-INV-045](../functional/application-invocation-functional-specification-v01.md#fr-inv-045) |
| `DD-QUAL-CI-009` | [FR-QUAL-005](../functional/quality-functional-specification-v01.md#fr-qual-005); [Design](../appmanager-design-specification-v01.md#_4-6-presentation-independence) |
| `DD-QUAL-CI-010` | [Design](../appmanager-design-specification-v01.md#_6-6-capability-boundaries-and-providers) |
| `DD-QUAL-CI-011` | [FR-QUAL-091](../functional/quality-functional-specification-v01.md#fr-qual-091); [FR-QUAL-001](../functional/quality-functional-specification-v01.md#fr-qual-001) |
| `DD-QUAL-CI-012` | [the Implementation Specification boundary](../project-documentation-guide-v01.md#_8-level-4-implementation-specification) |
| `DD-SET-001` | [FR-SET-101](../functional/settings-functional-specification-v01.md#fr-set-101) |
| `DD-SET-002` | [FR-CONFIG-075](../functional/configuration-functional-specification-v01.md#fr-config-075); [DD-1.4 resolution](../dd_1_application_core/dd-1-4-configuration-resolution-detailed-design-v01.md) |
| `DD-SET-003` | [Design](../appmanager-design-specification-v01.md#_11-11-workflow-results-failure-and-acceptance) |
| `DD-SET-004` | [FR-SET-101](../functional/settings-functional-specification-v01.md#fr-set-101); [FR-SET-042](../functional/settings-functional-specification-v01.md#fr-set-042); [FR-SET-048](../functional/settings-functional-specification-v01.md#fr-set-048) |
| `DD-SET-005` | [FR-SET-098](../functional/settings-functional-specification-v01.md#fr-set-098) |
| `DD-SET-006` | [DD-1.1 invocation](../dd_1_application_core/dd-1-1-application-invocation-detailed-design-v01.md); [Design](../appmanager-design-specification-v01.md#_4-6-presentation-independence) |
| `DD-SET-007` | [DD-1.2 outcomes](../dd_1_application_core/dd-1-2-execution-outcomes-detailed-design-v01.md#_7-outcome-contract) |
| `DD-SET-008` | [Design](../appmanager-design-specification-v01.md#_9-6-project-discovery-and-context-resolution); [Design](../appmanager-design-specification-v01.md#_9-7-managed-scope-and-operation-targeting) |
| `DD-SET-009` | [DD-1.4 resolution results](../dd_1_application_core/dd-1-4-configuration-resolution-detailed-design-v01.md#_15-resolution-result); [FR-SET-029](../functional/settings-functional-specification-v01.md#fr-set-029) |
| `DD-SET-010` | [Design](../appmanager-design-specification-v01.md#_6-2-application-engine-authority) |
| `DD-SET-011` | [DD-2.1](../dd_2_shared_capabilities/dd-2-1-resource-access-detailed-design-v01.md); [Design](../appmanager-design-specification-v01.md#_6-6-capability-boundaries-and-providers) |
| `DD-SET-012` | [DD-2.4](../dd_2_shared_capabilities/dd-2-4-source-intelligence-detailed-design-v01.md); [Design](../appmanager-design-specification-v01.md#_9-9-non-destructive-ownership-and-unmanaged-content) |
| `DD-SET-013` | [FR-XFORM-033](../functional/source-transformation-functional-specification-v01.md#fr-xform-033) |
| `DD-SET-014` | [DD-2.6](../dd_2_shared_capabilities/dd-2-6-resource-registry-and-template-detailed-design-v01.md); [Design](../appmanager-design-specification-v01.md#_6-8-generation-and-templates) |
| `DD-SET-015` | [FR-SET-043](../functional/settings-functional-specification-v01.md#fr-set-043); [FR-SET-042](../functional/settings-functional-specification-v01.md#fr-set-042) |
| `DD-SET-018` | [FR-SET-022](../functional/settings-functional-specification-v01.md#fr-set-022) |
| `DD-SET-019` | [FR-SET-023](../functional/settings-functional-specification-v01.md#fr-set-023); [DD-SET-032](../dd_4_policy_and_resource_domains/dd-4-2-settings-domain-detailed-design-v01.md#dd-set-032) |
| `DD-SET-020` | [FR-SET-029](../functional/settings-functional-specification-v01.md#fr-set-029) |
| `DD-SET-021` | [FR-SET-017](../functional/settings-functional-specification-v01.md#fr-set-017); [DD-SET-057](../dd_4_policy_and_resource_domains/dd-4-2-settings-domain-detailed-design-v01.md#dd-set-057) |
| `DD-SET-022` | [FR-SET-012](../functional/settings-functional-specification-v01.md#fr-set-012); [FR-SET-115](../functional/settings-functional-specification-v01.md#fr-set-115) |
| `DD-SET-023` | [FR-SET-014](../functional/settings-functional-specification-v01.md#fr-set-014); [FR-SET-015](../functional/settings-functional-specification-v01.md#fr-set-015) |
| `DD-SET-024` | [FR-CONFIG-051](../functional/configuration-functional-specification-v01.md#fr-config-051) |
| `DD-SET-025` | [FR-SET-115](../functional/settings-functional-specification-v01.md#fr-set-115); [Design](../appmanager-design-specification-v01.md#_9-9-non-destructive-ownership-and-unmanaged-content) |
| `DD-SET-026` | [FR-SET-042](../functional/settings-functional-specification-v01.md#fr-set-042) |
| `DD-SET-027` | [FR-SET-059](../functional/settings-functional-specification-v01.md#fr-set-059) |
| `DD-SET-028` | [FR-SET-061](../functional/settings-functional-specification-v01.md#fr-set-061) |
| `DD-SET-029` | [FR-SET-065](../functional/settings-functional-specification-v01.md#fr-set-065); [FR-SET-066](../functional/settings-functional-specification-v01.md#fr-set-066); [Design](../appmanager-design-specification-v01.md#_7-10-non-destructive-transformation) |
| `DD-SET-030` | [FR-SET-070](../functional/settings-functional-specification-v01.md#fr-set-070) |
| `DD-SET-031` | [FR-SET-060](../functional/settings-functional-specification-v01.md#fr-set-060); [FR-SET-061](../functional/settings-functional-specification-v01.md#fr-set-061); [FR-SET-102](../functional/settings-functional-specification-v01.md#fr-set-102) |
| `DD-SET-033` | [FR-SET-077](../functional/settings-functional-specification-v01.md#fr-set-077) |
| `DD-SET-034` | [FR-SET-083](../functional/settings-functional-specification-v01.md#fr-set-083) |
| `DD-SET-035` | [FR-SET-084](../functional/settings-functional-specification-v01.md#fr-set-084) |
| `DD-SET-036` | [FR-SET-057](../functional/settings-functional-specification-v01.md#fr-set-057); [FR-SET-086](../functional/settings-functional-specification-v01.md#fr-set-086) |
| `DD-SET-037` | [FR-SET-096](../functional/settings-functional-specification-v01.md#fr-set-096); [FR-SET-097](../functional/settings-functional-specification-v01.md#fr-set-097) |
| `DD-SET-038` | [FR-SET-094](../functional/settings-functional-specification-v01.md#fr-set-094); [FR-SET-095](../functional/settings-functional-specification-v01.md#fr-set-095) |
| `DD-SET-039` | [Design](../appmanager-design-specification-v01.md#_13-2-extension-classes) |
| `DD-SET-040` | [Design](../appmanager-design-specification-v01.md#_9-7-managed-scope-and-operation-targeting) |
| `DD-SET-041` | [FR-SET-016](../functional/settings-functional-specification-v01.md#fr-set-016); [FR-SET-067](../functional/settings-functional-specification-v01.md#fr-set-067) |
| `DD-SET-042` | [DD-SET-036](../dd_4_policy_and_resource_domains/dd-4-2-settings-domain-detailed-design-v01.md#dd-set-036); [DD-1.2 partial completion](../dd_1_application_core/dd-1-2-execution-outcomes-detailed-design-v01.md#_14-partial-completion) |
| `DD-SET-046` | [DD-1.4 resolution results](../dd_1_application_core/dd-1-4-configuration-resolution-detailed-design-v01.md#_15-resolution-result); [FR-CONFIG-045](../functional/configuration-functional-specification-v01.md#fr-config-045) |
| `DD-SET-047` | [FR-SET-048](../functional/settings-functional-specification-v01.md#fr-set-048); [FR-SET-049](../functional/settings-functional-specification-v01.md#fr-set-049) |
| `DD-SET-048` | [FR-SET-044](../functional/settings-functional-specification-v01.md#fr-set-044) |
| `DD-SET-049` | [FR-SET-090](../functional/settings-functional-specification-v01.md#fr-set-090) |
| `DD-SET-050` | [FR-SET-098](../functional/settings-functional-specification-v01.md#fr-set-098) |
| `DD-SET-051` | [FR-SET-012](../functional/settings-functional-specification-v01.md#fr-set-012) |
| `DD-SET-052` | [FR-SET-012](../functional/settings-functional-specification-v01.md#fr-set-012) |
| `DD-SET-053` | [FR-INV-023](../functional/application-invocation-functional-specification-v01.md#fr-inv-023) |
| `DD-SET-054` | [FR-SET-115](../functional/settings-functional-specification-v01.md#fr-set-115); [DD-SET-036](../dd_4_policy_and_resource_domains/dd-4-2-settings-domain-detailed-design-v01.md#dd-set-036) |
| `DD-SET-055` | [FR-SET-061](../functional/settings-functional-specification-v01.md#fr-set-061); [FR-SET-085](../functional/settings-functional-specification-v01.md#fr-set-085); [Design](../appmanager-design-specification-v01.md#_9-9-non-destructive-ownership-and-unmanaged-content) |
| `DD-SET-058` | [FR-SET-108](../functional/settings-functional-specification-v01.md#fr-set-108) |
| `DD-SET-059` | [DD-1.2 partial completion](../dd_1_application_core/dd-1-2-execution-outcomes-detailed-design-v01.md#_14-partial-completion) |
| `DD-SET-060` | [FR-INV-046](../functional/application-invocation-functional-specification-v01.md#fr-inv-046) |
| `DD-SET-061` | [FR-SET-111](../functional/settings-functional-specification-v01.md#fr-set-111); [DD-1.2 cancellation propagation](../dd_1_application_core/dd-1-2-execution-outcomes-detailed-design-v01.md#_17-cancellation-model) |
| `DD-SET-062` | [FR-INV-045](../functional/application-invocation-functional-specification-v01.md#fr-inv-045) |
| `DD-SET-064` | [Design](../appmanager-design-specification-v01.md#_4-6-presentation-independence) |
| `DD-SET-065` | [FR-INV-019](../functional/application-invocation-functional-specification-v01.md#fr-inv-019) |
| `DD-SET-066` | [FR-SET-116](../functional/settings-functional-specification-v01.md#fr-set-116); [FR-INV-020](../functional/application-invocation-functional-specification-v01.md#fr-inv-020) |
| `DD-SET-067` | [FR-INV-021](../functional/application-invocation-functional-specification-v01.md#fr-inv-021); [FR-SET-017](../functional/settings-functional-specification-v01.md#fr-set-017); [DD-SET-057](../dd_4_policy_and_resource_domains/dd-4-2-settings-domain-detailed-design-v01.md#dd-set-057) |
| `DD-SET-070` | [FR-SET-054](../functional/settings-functional-specification-v01.md#fr-set-054); [FR-SET-077](../functional/settings-functional-specification-v01.md#fr-set-077); [FR-SET-093](../functional/settings-functional-specification-v01.md#fr-set-093) |
| `DD-SET-071` | [FR-XFORM-068](../functional/source-transformation-functional-specification-v01.md#fr-xform-068); [FR-XFORM-069](../functional/source-transformation-functional-specification-v01.md#fr-xform-069) |
| `DD-SET-072` | [DD-SET-036](../dd_4_policy_and_resource_domains/dd-4-2-settings-domain-detailed-design-v01.md#dd-set-036); [FR-INV-046](../functional/application-invocation-functional-specification-v01.md#fr-inv-046) |
| `DD-SET-074` | [FR-SET-017](../functional/settings-functional-specification-v01.md#fr-set-017); [DD-1.2 sensitive-information handling](../dd_1_application_core/dd-1-2-execution-outcomes-detailed-design-v01.md#_24-sensitive-information-and-redaction) |
| `DD-SET-077` | [FR-INV-040](../functional/application-invocation-functional-specification-v01.md#fr-inv-040) |
| `DD-SET-078` | [FR-SET-004](../functional/settings-functional-specification-v01.md#fr-set-004); [Design](../appmanager-design-specification-v01.md#_6-6-capability-boundaries-and-providers) |
| `DD-SET-079` | [FR-SET-095](../functional/settings-functional-specification-v01.md#fr-set-095) |
| `DD-SET-082` | [the Implementation Specification boundary](../project-documentation-guide-v01.md#_8-level-4-implementation-specification) |
| `DD-AI-001` | [FR-AI-001](../functional/ai-functional-specification-v01.md#fr-ai-001); [Design](../appmanager-design-specification-v01.md#_10-6-ai-domain) |
| `DD-AI-002` | [DD-2.7 AI Capability](../dd_2_shared_capabilities/dd-2-7-ai-capability-detailed-design-v01.md); [Design](../appmanager-design-specification-v01.md#_6-6-capability-boundaries-and-providers) |
| `DD-AI-003` | [Design](../appmanager-design-specification-v01.md#_11-11-workflow-results-failure-and-acceptance); [Design](../appmanager-design-specification-v01.md#_6-2-application-engine-authority) |
| `DD-AI-004` | [Design](../appmanager-design-specification-v01.md#_10-6-ai-domain) |
| `DD-AI-005` | [FR-AI-022](../functional/ai-functional-specification-v01.md#fr-ai-022) |
| `DD-AI-006` | [DD-1.1 invocation](../dd_1_application_core/dd-1-1-application-invocation-detailed-design-v01.md) |
| `DD-AI-007` | [DD-1.2 outcomes](../dd_1_application_core/dd-1-2-execution-outcomes-detailed-design-v01.md#_7-outcome-contract) |
| `DD-AI-008` | [Design](../appmanager-design-specification-v01.md#_9-6-project-discovery-and-context-resolution); [Design](../appmanager-design-specification-v01.md#_9-7-managed-scope-and-operation-targeting) |
| `DD-AI-009` | [DD-1.4 resolution results](../dd_1_application_core/dd-1-4-configuration-resolution-detailed-design-v01.md#_15-resolution-result) |
| `DD-AI-010` | [Design](../appmanager-design-specification-v01.md#_6-2-application-engine-authority) |
| `DD-AI-011` | [DD-2.1](../dd_2_shared_capabilities/dd-2-1-resource-access-detailed-design-v01.md); [Design](../appmanager-design-specification-v01.md#_6-6-capability-boundaries-and-providers) |
| `DD-AI-012` | [DD-2.4](../dd_2_shared_capabilities/dd-2-4-source-intelligence-detailed-design-v01.md); [Design](../appmanager-design-specification-v01.md#_9-9-non-destructive-ownership-and-unmanaged-content) |
| `DD-AI-013` | [FR-AI-042](../functional/ai-functional-specification-v01.md#fr-ai-042); [FR-XFORM-033](../functional/source-transformation-functional-specification-v01.md#fr-xform-033) |
| `DD-AI-014` | [DD-2.6](../dd_2_shared_capabilities/dd-2-6-resource-registry-and-template-detailed-design-v01.md); [Design](../appmanager-design-specification-v01.md#_6-8-generation-and-templates) |
| `DD-AI-015` | [DD-2.7 AI Capability](../dd_2_shared_capabilities/dd-2-7-ai-capability-detailed-design-v01.md) |
| `DD-AI-016` | [Design](../appmanager-design-specification-v01.md#_6-6-capability-boundaries-and-providers) |
| `DD-AI-019` | [FR-AI-022](../functional/ai-functional-specification-v01.md#fr-ai-022) |
| `DD-AI-020` | [FR-AI-019](../functional/ai-functional-specification-v01.md#fr-ai-019) |
| `DD-AI-021` | [FR-AI-061](../functional/ai-functional-specification-v01.md#fr-ai-061) |
| `DD-AI-023` | [FR-AI-027](../functional/ai-functional-specification-v01.md#fr-ai-027) |
| `DD-AI-024` | [FR-AI-028](../functional/ai-functional-specification-v01.md#fr-ai-028); [FR-AI-029](../functional/ai-functional-specification-v01.md#fr-ai-029); [FR-AI-031](../functional/ai-functional-specification-v01.md#fr-ai-031) |
| `DD-AI-025` | [FR-AI-031](../functional/ai-functional-specification-v01.md#fr-ai-031); [FR-AI-032](../functional/ai-functional-specification-v01.md#fr-ai-032); [FR-AI-033](../functional/ai-functional-specification-v01.md#fr-ai-033) |
| `DD-AI-026` | [FR-AI-069](../functional/ai-functional-specification-v01.md#fr-ai-069) |
| `DD-AI-027` | [FR-AI-044](../functional/ai-functional-specification-v01.md#fr-ai-044) |
| `DD-AI-028` | [FR-AI-046](../functional/ai-functional-specification-v01.md#fr-ai-046) |
| `DD-AI-029` | [Design](../appmanager-design-specification-v01.md#_6-8-generation-and-templates) |
| `DD-AI-030` | [FR-AI-041](../functional/ai-functional-specification-v01.md#fr-ai-041) |
| `DD-AI-031` | [FR-AI-042](../functional/ai-functional-specification-v01.md#fr-ai-042); [FR-XFORM-033](../functional/source-transformation-functional-specification-v01.md#fr-xform-033) |
| `DD-AI-032` | [FR-AI-044](../functional/ai-functional-specification-v01.md#fr-ai-044); [FR-AI-049](../functional/ai-functional-specification-v01.md#fr-ai-049) |
| `DD-AI-033` | [FR-AI-053](../functional/ai-functional-specification-v01.md#fr-ai-053); [FR-AI-049](../functional/ai-functional-specification-v01.md#fr-ai-049); [FR-AI-100](../functional/ai-functional-specification-v01.md#fr-ai-100) |
| `DD-AI-035` | [FR-AI-088](../functional/ai-functional-specification-v01.md#fr-ai-088) |
| `DD-AI-036` | [FR-AI-059](../functional/ai-functional-specification-v01.md#fr-ai-059) |
| `DD-AI-037` | [FR-AI-060](../functional/ai-functional-specification-v01.md#fr-ai-060); [Design](../appmanager-design-specification-v01.md#_11-10-ai-assisted-workflow) |
| `DD-AI-038` | [FR-AI-064](../functional/ai-functional-specification-v01.md#fr-ai-064) |
| `DD-AI-039` | [FR-AI-068](../functional/ai-functional-specification-v01.md#fr-ai-068) |
| `DD-AI-040` | [FR-AI-067](../functional/ai-functional-specification-v01.md#fr-ai-067) |
| `DD-AI-041` | [Design](../appmanager-design-specification-v01.md#_11-11-workflow-results-failure-and-acceptance) |
| `DD-AI-042` | [FR-AI-049](../functional/ai-functional-specification-v01.md#fr-ai-049) |
| `DD-AI-043` | [FR-INV-045](../functional/application-invocation-functional-specification-v01.md#fr-inv-045) |
| `DD-AI-045` | [Design](../appmanager-design-specification-v01.md#_10-6-ai-domain) |
| `DD-AI-046` | [FR-AI-081](../functional/ai-functional-specification-v01.md#fr-ai-081) |
| `DD-AI-048` | [FR-AI-096](../functional/ai-functional-specification-v01.md#fr-ai-096) |
| `DD-AI-049` | [FR-AI-014](../functional/ai-functional-specification-v01.md#fr-ai-014) |
| `DD-AI-050` | [FR-AI-084](../functional/ai-functional-specification-v01.md#fr-ai-084); [FR-AI-085](../functional/ai-functional-specification-v01.md#fr-ai-085) |
| `DD-AI-051` | [Design](../appmanager-design-specification-v01.md#_11-10-ai-assisted-workflow) |
| `DD-AI-052` | [Design](../appmanager-design-specification-v01.md#_9-9-non-destructive-ownership-and-unmanaged-content) |
| `DD-AI-053` | [Design](../appmanager-design-specification-v01.md#_11-10-ai-assisted-workflow) |
| `DD-AI-054` | [Design](../appmanager-design-specification-v01.md#_6-8-generation-and-templates); [FR-PROJ-044](../functional/managed-project-functional-specification-v01.md#fr-proj-044) |
| `DD-AI-055` | [FR-XFORM-033](../functional/source-transformation-functional-specification-v01.md#fr-xform-033) |
| `DD-AI-056` | [FR-AI-041](../functional/ai-functional-specification-v01.md#fr-ai-041); [FR-AI-042](../functional/ai-functional-specification-v01.md#fr-ai-042) |
| `DD-AI-057` | [FR-PROJ-044](../functional/managed-project-functional-specification-v01.md#fr-proj-044) |
| `DD-AI-058` | [FR-INV-022](../functional/application-invocation-functional-specification-v01.md#fr-inv-022); [FR-INV-023](../functional/application-invocation-functional-specification-v01.md#fr-inv-023) |
| `DD-AI-059` | [FR-AI-098](../functional/ai-functional-specification-v01.md#fr-ai-098) |
| `DD-AI-060` | [FR-AI-053](../functional/ai-functional-specification-v01.md#fr-ai-053); [FR-AI-049](../functional/ai-functional-specification-v01.md#fr-ai-049) |
| `DD-AI-061` | [DD-AI-034](../dd_4_policy_and_resource_domains/dd-4-3-ai-domain-detailed-design-v01.md#dd-ai-034) |
| `DD-AI-062` | [FR-INV-046](../functional/application-invocation-functional-specification-v01.md#fr-inv-046) |
| `DD-AI-063` | [FR-AI-016](../functional/ai-functional-specification-v01.md#fr-ai-016); [DD-1.2 cancellation propagation](../dd_1_application_core/dd-1-2-execution-outcomes-detailed-design-v01.md#_17-cancellation-model) |
| `DD-AI-064` | [FR-INV-045](../functional/application-invocation-functional-specification-v01.md#fr-inv-045) |
| `DD-AI-066` | [Design](../appmanager-design-specification-v01.md#_4-6-presentation-independence) |
| `DD-AI-067` | [FR-INV-019](../functional/application-invocation-functional-specification-v01.md#fr-inv-019) |
| `DD-AI-068` | [FR-AI-105](../functional/ai-functional-specification-v01.md#fr-ai-105); [FR-INV-020](../functional/application-invocation-functional-specification-v01.md#fr-inv-020) |
| `DD-AI-069` | [FR-INV-021](../functional/application-invocation-functional-specification-v01.md#fr-inv-021) |
| `DD-AI-071` | [FR-AI-070](../functional/ai-functional-specification-v01.md#fr-ai-070) |
| `DD-AI-072` | [FR-XFORM-068](../functional/source-transformation-functional-specification-v01.md#fr-xform-068); [FR-XFORM-069](../functional/source-transformation-functional-specification-v01.md#fr-xform-069) |
| `DD-AI-073` | [FR-AI-041](../functional/ai-functional-specification-v01.md#fr-ai-041) |
| `DD-AI-075` | [FR-AI-090](../functional/ai-functional-specification-v01.md#fr-ai-090) |
| `DD-AI-076` | [FR-AI-088](../functional/ai-functional-specification-v01.md#fr-ai-088); [FR-AI-089](../functional/ai-functional-specification-v01.md#fr-ai-089) |
| `DD-AI-077` | [FR-AI-089](../functional/ai-functional-specification-v01.md#fr-ai-089) |
| `DD-AI-078` | [FR-AI-095](../functional/ai-functional-specification-v01.md#fr-ai-095); [FR-INV-040](../functional/application-invocation-functional-specification-v01.md#fr-inv-040) |
| `DD-AI-079` | [FR-AI-060](../functional/ai-functional-specification-v01.md#fr-ai-060); [Design](../appmanager-design-specification-v01.md#_11-10-ai-assisted-workflow) |
| `DD-AI-080` | [FR-AI-096](../functional/ai-functional-specification-v01.md#fr-ai-096) |
| `DD-AI-082` | [FR-AI-005](../functional/ai-functional-specification-v01.md#fr-ai-005); [Design](../appmanager-design-specification-v01.md#_6-6-capability-boundaries-and-providers) |
| `DD-AI-083` | [Design](../appmanager-design-specification-v01.md#_13-2-extension-classes) |
| `DD-AI-084` | [Design](../appmanager-design-specification-v01.md#_10-6-ai-domain) |
| `DD-AI-085` | [the Implementation Specification boundary](../project-documentation-guide-v01.md#_8-level-4-implementation-specification) |
| `DD-UTIL-001` | [Design](../appmanager-design-specification-v01.md#_10-9-maintenance-domain); [DD-UTIL-066](../dd_4_policy_and_resource_domains/dd-4-4-utils-domain-detailed-design-v01.md#dd-util-066) |
| `DD-UTIL-002` | [FR-UTIL-005](../functional/utils-functional-specification-v01.md#fr-util-005) |
| `DD-UTIL-003` | [Design](../appmanager-design-specification-v01.md#_11-11-workflow-results-failure-and-acceptance) |
| `DD-UTIL-004` | [Design](../appmanager-design-specification-v01.md#_10-9-maintenance-domain) |
| `DD-UTIL-005` | [FR-PROJ-042](../functional/managed-project-functional-specification-v01.md#fr-proj-042) |
| `DD-UTIL-006` | [Design](../appmanager-design-specification-v01.md#_9-6-project-discovery-and-context-resolution); [Design](../appmanager-design-specification-v01.md#_9-7-managed-scope-and-operation-targeting) |
| `DD-UTIL-007` | [DD-1.4 resolution results](../dd_1_application_core/dd-1-4-configuration-resolution-detailed-design-v01.md#_15-resolution-result) |
| `DD-UTIL-008` | [DD-1.2 outcomes](../dd_1_application_core/dd-1-2-execution-outcomes-detailed-design-v01.md#_7-outcome-contract) |
| `DD-UTIL-009` | [Design](../appmanager-design-specification-v01.md#_6-2-application-engine-authority) |
| `DD-UTIL-010` | [Design](../appmanager-design-specification-v01.md#_9-9-non-destructive-ownership-and-unmanaged-content) |
| `DD-UTIL-011` | [FR-XFORM-033](../functional/source-transformation-functional-specification-v01.md#fr-xform-033) |
| `DD-UTIL-012` | [FR-UTIL-069](../functional/utils-functional-specification-v01.md#fr-util-069); [FR-UTIL-097](../functional/utils-functional-specification-v01.md#fr-util-097) |
| `DD-UTIL-013` | [Design](../appmanager-design-specification-v01.md#_11-10-ai-assisted-workflow) |
| `DD-UTIL-014` | [Design](../appmanager-design-specification-v01.md#_6-6-capability-boundaries-and-providers) |
| `DD-UTIL-016` | [FR-UTIL-102](../functional/utils-functional-specification-v01.md#fr-util-102) |
| `DD-UTIL-019` | [FR-UTIL-055](../functional/utils-functional-specification-v01.md#fr-util-055); [FR-UTIL-037](../functional/utils-functional-specification-v01.md#fr-util-037); [FR-UTIL-087](../functional/utils-functional-specification-v01.md#fr-util-087) |
| `DD-UTIL-020` | [FR-UTIL-014](../functional/utils-functional-specification-v01.md#fr-util-014) |
| `DD-UTIL-021` | [FR-UTIL-025](../functional/utils-functional-specification-v01.md#fr-util-025) |
| `DD-UTIL-022` | [FR-PROJ-047](../functional/managed-project-functional-specification-v01.md#fr-proj-047) |
| `DD-UTIL-023` | [FR-UTIL-035](../functional/utils-functional-specification-v01.md#fr-util-035) |
| `DD-UTIL-024` | [FR-UTIL-030](../functional/utils-functional-specification-v01.md#fr-util-030) |
| `DD-UTIL-025` | [FR-UTIL-031](../functional/utils-functional-specification-v01.md#fr-util-031) |
| `DD-UTIL-026` | [FR-UTIL-036](../functional/utils-functional-specification-v01.md#fr-util-036) |
| `DD-UTIL-027` | [FR-UTIL-037](../functional/utils-functional-specification-v01.md#fr-util-037) |
| `DD-UTIL-028` | [FR-UTIL-045](../functional/utils-functional-specification-v01.md#fr-util-045); [FR-UTIL-046](../functional/utils-functional-specification-v01.md#fr-util-046); [PBC-FR-MAINT-COORD-008](../functional/utils-functional-specification-v01.md#pbc-fr-maint-coord-008); [FR-XFORM-068](../functional/source-transformation-functional-specification-v01.md#fr-xform-068); [FR-XFORM-048](../functional/source-transformation-functional-specification-v01.md#fr-xform-048) |
| `DD-UTIL-029` | [FR-UTIL-047](../functional/utils-functional-specification-v01.md#fr-util-047) |
| `DD-UTIL-030` | [FR-UTIL-049](../functional/utils-functional-specification-v01.md#fr-util-049) |
| `DD-UTIL-031` | [FR-UTIL-052](../functional/utils-functional-specification-v01.md#fr-util-052) |
| `DD-UTIL-032` | [FR-UTIL-053](../functional/utils-functional-specification-v01.md#fr-util-053); [FR-UTIL-054](../functional/utils-functional-specification-v01.md#fr-util-054) |
| `DD-UTIL-033` | [FR-UTIL-055](../functional/utils-functional-specification-v01.md#fr-util-055) |
| `DD-UTIL-034` | [FR-XFORM-048](../functional/source-transformation-functional-specification-v01.md#fr-xform-048); [FR-UTIL-057](../functional/utils-functional-specification-v01.md#fr-util-057) |
| `DD-UTIL-035` | [FR-UTIL-042](../functional/utils-functional-specification-v01.md#fr-util-042); [FR-UTIL-065](../functional/utils-functional-specification-v01.md#fr-util-065) |
| `DD-UTIL-036` | [FR-UTIL-060](../functional/utils-functional-specification-v01.md#fr-util-060) |
| `DD-UTIL-037` | [FR-UTIL-061](../functional/utils-functional-specification-v01.md#fr-util-061) |
| `DD-UTIL-038` | [FR-UTIL-062](../functional/utils-functional-specification-v01.md#fr-util-062); [FR-UTIL-044](../functional/utils-functional-specification-v01.md#fr-util-044); [Design](../appmanager-design-specification-v01.md#_11-10-ai-assisted-workflow) |
| `DD-UTIL-039` | [FR-UTIL-063](../functional/utils-functional-specification-v01.md#fr-util-063) |
| `DD-UTIL-040` | [FR-UTIL-068](../functional/utils-functional-specification-v01.md#fr-util-068); [PBC-FR-MAINT-COORD-008](../functional/utils-functional-specification-v01.md#pbc-fr-maint-coord-008) |
| `DD-UTIL-041` | [FR-UTIL-067](../functional/utils-functional-specification-v01.md#fr-util-067) |
| `DD-UTIL-042` | [FR-UTIL-070](../functional/utils-functional-specification-v01.md#fr-util-070) |
| `DD-UTIL-043` | [FR-UTIL-072](../functional/utils-functional-specification-v01.md#fr-util-072) |
| `DD-UTIL-044` | [FR-UTIL-073](../functional/utils-functional-specification-v01.md#fr-util-073); [Design](../appmanager-design-specification-v01.md#_11-10-ai-assisted-workflow) |
| `DD-UTIL-045` | [FR-UTIL-075](../functional/utils-functional-specification-v01.md#fr-util-075) |
| `DD-UTIL-046` | [FR-UTIL-076](../functional/utils-functional-specification-v01.md#fr-util-076) |
| `DD-UTIL-047` | [FR-UTIL-077](../functional/utils-functional-specification-v01.md#fr-util-077) |
| `DD-UTIL-048` | [FR-UTIL-078](../functional/utils-functional-specification-v01.md#fr-util-078) |
| `DD-UTIL-049` | [FR-UTIL-079](../functional/utils-functional-specification-v01.md#fr-util-079) |
| `DD-UTIL-050` | [FR-UTIL-082](../functional/utils-functional-specification-v01.md#fr-util-082); [FR-UTIL-083](../functional/utils-functional-specification-v01.md#fr-util-083) |
| `DD-UTIL-051` | [FR-UTIL-086](../functional/utils-functional-specification-v01.md#fr-util-086); [PBC-FR-MAINT-COORD-021](../functional/utils-functional-specification-v01.md#pbc-fr-maint-coord-021); [FR-UTIL-083](../functional/utils-functional-specification-v01.md#fr-util-083); [PBC-FR-MAINT-COORD-023](../functional/utils-functional-specification-v01.md#pbc-fr-maint-coord-023) |
| `DD-UTIL-052` | [FR-UTIL-084](../functional/utils-functional-specification-v01.md#fr-util-084); [FR-UTIL-094](../functional/utils-functional-specification-v01.md#fr-util-094) |
| `DD-UTIL-053` | [FR-UTIL-087](../functional/utils-functional-specification-v01.md#fr-util-087) |
| `DD-UTIL-054` | [FR-UTIL-088](../functional/utils-functional-specification-v01.md#fr-util-088) |
| `DD-UTIL-055` | [FR-INV-023](../functional/application-invocation-functional-specification-v01.md#fr-inv-023); [FR-INV-022](../functional/application-invocation-functional-specification-v01.md#fr-inv-022) |
| `DD-UTIL-056` | [PBC-FR-MAINT-003](../functional/utils-functional-specification-v01.md#pbc-fr-maint-003) |
| `DD-UTIL-057` | [FR-UTIL-092](../functional/utils-functional-specification-v01.md#fr-util-092) |
| `DD-UTIL-058` | [FR-UTIL-091](../functional/utils-functional-specification-v01.md#fr-util-091); [DD-UTIL-085](../dd_4_policy_and_resource_domains/dd-4-4-utils-domain-detailed-design-v01.md#dd-util-085) |
| `DD-UTIL-059` | [FR-DOCS-100](../functional/docs-functional-specification-v01.md#fr-docs-100); [FR-UTIL-005](../functional/utils-functional-specification-v01.md#fr-util-005) |
| `DD-UTIL-060` | [FR-SET-072](../functional/settings-functional-specification-v01.md#fr-set-072); [FR-UTIL-005](../functional/utils-functional-specification-v01.md#fr-util-005) |
| `DD-UTIL-061` | [FR-UTIL-005](../functional/utils-functional-specification-v01.md#fr-util-005) |
| `DD-UTIL-064` | [Design](../appmanager-design-specification-v01.md#_9-9-non-destructive-ownership-and-unmanaged-content) |
| `DD-UTIL-065` | [FR-INV-045](../functional/application-invocation-functional-specification-v01.md#fr-inv-045) |
| `DD-UTIL-068` | [FR-XFORM-008](../functional/source-transformation-functional-specification-v01.md#fr-xform-008); [FR-XFORM-009](../functional/source-transformation-functional-specification-v01.md#fr-xform-009); [DD-UTIL-017](../dd_4_policy_and_resource_domains/dd-4-4-utils-domain-detailed-design-v01.md#dd-util-017) |
| `DD-UTIL-069` | [FR-UTIL-099](../functional/utils-functional-specification-v01.md#fr-util-099) |
| `DD-UTIL-070` | [FR-SET-023](../functional/settings-functional-specification-v01.md#fr-set-023) |
| `DD-UTIL-071` | [FR-INV-039](../functional/application-invocation-functional-specification-v01.md#fr-inv-039) |
| `DD-UTIL-072` | [FR-INV-049](../functional/application-invocation-functional-specification-v01.md#fr-inv-049); [FR-UTIL-105](../functional/utils-functional-specification-v01.md#fr-util-105) |
| `DD-UTIL-073` | [FR-UTIL-014](../functional/utils-functional-specification-v01.md#fr-util-014) |
| `DD-UTIL-074` | [FR-UTIL-015](../functional/utils-functional-specification-v01.md#fr-util-015); [FR-INV-023](../functional/application-invocation-functional-specification-v01.md#fr-inv-023); [FR-INV-022](../functional/application-invocation-functional-specification-v01.md#fr-inv-022) |
| `DD-UTIL-075` | [FR-XFORM-014](../functional/source-transformation-functional-specification-v01.md#fr-xform-014); [FR-UTIL-084](../functional/utils-functional-specification-v01.md#fr-util-084) |
| `DD-UTIL-076` | [DD-1.2 proposed effects](../dd_1_application_core/dd-1-2-execution-outcomes-detailed-design-v01.md#_13-proposed-effects-and-preview) |
| `DD-UTIL-077` | [FR-XFORM-068](../functional/source-transformation-functional-specification-v01.md#fr-xform-068); [FR-XFORM-069](../functional/source-transformation-functional-specification-v01.md#fr-xform-069) |
| `DD-UTIL-078` | [FR-UTIL-094](../functional/utils-functional-specification-v01.md#fr-util-094) |
| `DD-UTIL-079` | [Design](../appmanager-design-specification-v01.md#_11-10-ai-assisted-workflow) |
| `DD-UTIL-080` | [FR-UTIL-101](../functional/utils-functional-specification-v01.md#fr-util-101) |
| `DD-UTIL-081` | [FR-UTIL-020](../functional/utils-functional-specification-v01.md#fr-util-020); [DD-1.2 partial completion](../dd_1_application_core/dd-1-2-execution-outcomes-detailed-design-v01.md#_14-partial-completion) |
| `DD-UTIL-082` | [FR-INV-046](../functional/application-invocation-functional-specification-v01.md#fr-inv-046) |
| `DD-UTIL-083` | [FR-UTIL-021](../functional/utils-functional-specification-v01.md#fr-util-021); [DD-1.2 cancellation propagation](../dd_1_application_core/dd-1-2-execution-outcomes-detailed-design-v01.md#_17-cancellation-model) |
| `DD-UTIL-084` | [FR-INV-045](../functional/application-invocation-functional-specification-v01.md#fr-inv-045) |
| `DD-UTIL-086` | [PBC-FR-MAINT-COORD-027](../functional/utils-functional-specification-v01.md#pbc-fr-maint-coord-027); [DD-UTIL-018](../dd_4_policy_and_resource_domains/dd-4-4-utils-domain-detailed-design-v01.md#dd-util-018); [DD-1.2](../dd_1_application_core/dd-1-2-execution-outcomes-detailed-design-v01.md#_14-partial-completion) |
| `DD-UTIL-087` | [Design](../appmanager-design-specification-v01.md#_4-6-presentation-independence) |
| `DD-UTIL-088` | [FR-INV-020](../functional/application-invocation-functional-specification-v01.md#fr-inv-020) |
| `DD-UTIL-089` | [FR-INV-019](../functional/application-invocation-functional-specification-v01.md#fr-inv-019) |
| `DD-UTIL-090` | [FR-INV-021](../functional/application-invocation-functional-specification-v01.md#fr-inv-021) |
| `DD-UTIL-092` | [FR-UTIL-055](../functional/utils-functional-specification-v01.md#fr-util-055); [FR-UTIL-092](../functional/utils-functional-specification-v01.md#fr-util-092) |
| `DD-UTIL-094` | [FR-XFORM-068](../functional/source-transformation-functional-specification-v01.md#fr-xform-068); [FR-XFORM-069](../functional/source-transformation-functional-specification-v01.md#fr-xform-069) |
| `DD-UTIL-095` | [FR-INV-046](../functional/application-invocation-functional-specification-v01.md#fr-inv-046) |
| `DD-UTIL-097` | [FR-INV-040](../functional/application-invocation-functional-specification-v01.md#fr-inv-040) |
| `DD-UTIL-098` | [FR-AI-057](../functional/ai-functional-specification-v01.md#fr-ai-057); [FR-AI-088](../functional/ai-functional-specification-v01.md#fr-ai-088); [FR-AI-090](../functional/ai-functional-specification-v01.md#fr-ai-090); [FR-AI-096](../functional/ai-functional-specification-v01.md#fr-ai-096) |
| `DD-UTIL-101` | [Design](../appmanager-design-specification-v01.md#_10-9-maintenance-domain); [DD-UTIL-066](../dd_4_policy_and_resource_domains/dd-4-4-utils-domain-detailed-design-v01.md#dd-util-066) |
| `DD-UTIL-102` | [Design](../appmanager-design-specification-v01.md#_6-6-capability-boundaries-and-providers) |
| `DD-UTIL-105` | [the Implementation Specification boundary](../project-documentation-guide-v01.md#_8-level-4-implementation-specification) |
| `DD-PROJ-001` | [FR-PROJ-004](../functional/managed-project-functional-specification-v01.md#fr-proj-004) |
| `DD-PROJ-002` | [FR-PROJ-007](../functional/managed-project-functional-specification-v01.md#fr-proj-007) |
| `DD-PROJ-003` | [Design](../appmanager-design-specification-v01.md#_9-6-project-discovery-and-context-resolution); [Design](../appmanager-design-specification-v01.md#_9-9-non-destructive-ownership-and-unmanaged-content) |
| `DD-PROJ-004` | [FR-PROJ-030](../functional/managed-project-functional-specification-v01.md#fr-proj-030); [bootstrap inputs](../dd_1_application_core/dd-1-4-configuration-resolution-detailed-design-v01.md#_8-resolution-context) |
| `DD-PROJ-005` | [FR-PROJ-033](../functional/managed-project-functional-specification-v01.md#fr-proj-033) |
| `DD-PROJ-006` | [FR-PROJ-008](../functional/managed-project-functional-specification-v01.md#fr-proj-008); [FR-PROJ-005](../functional/managed-project-functional-specification-v01.md#fr-proj-005) |
| `DD-PROJ-009` | [FR-PROJ-014](../functional/managed-project-functional-specification-v01.md#fr-proj-014) |
| `DD-PROJ-011` | [Design](../appmanager-design-specification-v01.md#_9-3-root-application-and-managed-layers) |
| `DD-PROJ-012` | [Design](../appmanager-design-specification-v01.md#_9-3-root-application-and-managed-layers); [Design](../appmanager-design-specification-v01.md#_9-5-repository-relationships) |
| `DD-PROJ-013` | [Design](../appmanager-design-specification-v01.md#_9-4-project-topology-and-resource-relationships) |
| `DD-PROJ-014` | [Design](../appmanager-design-specification-v01.md#_9-8-appmanager-owned-management-area-and-project-coexistence) |
| `DD-PROJ-015` | [FR-PROJ-038](../functional/managed-project-functional-specification-v01.md#fr-proj-038) |
| `DD-PROJ-016` | [Design](../appmanager-design-specification-v01.md#_9-6-project-discovery-and-context-resolution); [Design](../appmanager-design-specification-v01.md#_9-7-managed-scope-and-operation-targeting) |
| `DD-PROJ-017` | [FR-PROJ-041](../functional/managed-project-functional-specification-v01.md#fr-proj-041) |
| `DD-PROJ-018` | [FR-PROJ-042](../functional/managed-project-functional-specification-v01.md#fr-proj-042) |
| `DD-PROJ-019` | [Design](../appmanager-design-specification-v01.md#_9-9-non-destructive-ownership-and-unmanaged-content) |
| `DD-PROJ-020` | [Design](../appmanager-design-specification-v01.md#_9-9-non-destructive-ownership-and-unmanaged-content) |
| `DD-PROJ-021` | [FR-PROJ-047](../functional/managed-project-functional-specification-v01.md#fr-proj-047) |
| `DD-PROJ-022` | [FR-PROJ-060](../functional/managed-project-functional-specification-v01.md#fr-proj-060) |
| `DD-PROJ-023` | [FR-INV-020](../functional/application-invocation-functional-specification-v01.md#fr-inv-020) |
| `DD-PROJ-024` | [FR-PROJ-006](../functional/managed-project-functional-specification-v01.md#fr-proj-006); [FR-PROJ-044](../functional/managed-project-functional-specification-v01.md#fr-proj-044); [FR-PROJ-047](../functional/managed-project-functional-specification-v01.md#fr-proj-047) |
| `DD-PROJ-025` | [FR-PROJ-061](../functional/managed-project-functional-specification-v01.md#fr-proj-061) |
| `DD-ENG-002` | [DD-1.1](../dd_1_application_core/dd-1-1-application-invocation-detailed-design-v01.md#_10-invocation-normalization); [FR-INV-003](../functional/application-invocation-functional-specification-v01.md#fr-inv-003); [DD-ENG-001](../dd_1_application_core/dd-1-5-application-engine-detailed-design-v01.md#dd-eng-001) |
| `DD-ENG-006` | [Design](../appmanager-design-specification-v01.md#_6-6-capability-boundaries-and-providers); [DD-1.1](../dd_1_application_core/dd-1-1-application-invocation-detailed-design-v01.md#_9-4-no-executable-provider-discovery-leakage) |
| `DD-ENG-007` | [Design](../appmanager-design-specification-v01.md#_11-11-workflow-results-failure-and-acceptance); [DD-1.2](../dd_1_application_core/dd-1-2-execution-outcomes-detailed-design-v01.md#_8-execution-evidence-contract) |
| `DD-ENG-008` | [DD-1.2](../dd_1_application_core/dd-1-2-execution-outcomes-detailed-design-v01.md#_7-outcome-contract); [DD-1.1](../dd_1_application_core/dd-1-1-application-invocation-detailed-design-v01.md#dd-outclar-002) |
| `DD-ENG-009` | [DD-1.1](../dd_1_application_core/dd-1-1-application-invocation-detailed-design-v01.md#_20-cancellation-contract); [DD-1.2](../dd_1_application_core/dd-1-2-execution-outcomes-detailed-design-v01.md#_17-cancellation-model) |
| `DD-ENG-010` | [FR-INV-051](../functional/application-invocation-functional-specification-v01.md#fr-inv-051) |
| `DD-ENG-011` | [DD-1.1](../dd_1_application_core/dd-1-1-application-invocation-detailed-design-v01.md#_10-invocation-normalization) |
| `DD-ENG-012` | [DD-ENG-001](../dd_1_application_core/dd-1-5-application-engine-detailed-design-v01.md#dd-eng-001); [DD-ENG-005](../dd_1_application_core/dd-1-5-application-engine-detailed-design-v01.md#dd-eng-005) |
| `DD-ENG-013` | [Design](../appmanager-design-specification-v01.md#_10-1-functional-domain-model) |
| `DD-ENG-014` | [DD-1.1](../dd_1_application_core/dd-1-1-application-invocation-detailed-design-v01.md#_9-4-no-executable-provider-discovery-leakage) |
| `DD-ENG-016` | [FR-INV-006](../functional/application-invocation-functional-specification-v01.md#fr-inv-006); [FR-INV-015](../functional/application-invocation-functional-specification-v01.md#fr-inv-015); [DD-1.1](../dd_1_application_core/dd-1-1-application-invocation-detailed-design-v01.md#_8-5-unknown-versus-unavailable) |
| `DD-ENG-017` | [FR-INV-050](../functional/application-invocation-functional-specification-v01.md#fr-inv-050); [DD-1.1](../dd_1_application_core/dd-1-1-application-invocation-detailed-design-v01.md#_27-1-invocation-independence) |
| `DD-ENG-019` | [DD-1.3 required context](../dd_1_application_core/dd-1-3-managed-project-detailed-design-v01.md#_11-operation-specific-context-completeness); [DD-1.4](../dd_1_application_core/dd-1-4-configuration-resolution-detailed-design-v01.md#_8-resolution-context) |
| `DD-ENG-020` | [DD-1.3 scope](../dd_1_application_core/dd-1-3-managed-project-detailed-design-v01.md#_18-managed-scope-resolution); [targetability](../dd_1_application_core/dd-1-3-managed-project-detailed-design-v01.md#_20-targetability-evaluation); [DD-CORE-BOOT-009](../dd_1_application_core/dd-1-5-application-engine-detailed-design-v01.md#dd-core-boot-009) |
| `DD-ENG-021` | [FR-CONFIG-020](../functional/configuration-functional-specification-v01.md#fr-config-020); [DD-1.4](../dd_1_application_core/dd-1-4-configuration-resolution-detailed-design-v01.md#dd-core-boot-005) |
| `DD-ENG-022` | [DD-1.4](../dd_1_application_core/dd-1-4-configuration-resolution-detailed-design-v01.md#_16-effective-configuration-snapshot); [dynamic re-resolution contract](../dd_1_application_core/dd-1-4-configuration-resolution-detailed-design-v01.md#_27-4-dynamic-re-resolution); [DD-CORE-BOOT-006](../dd_1_application_core/dd-1-5-application-engine-detailed-design-v01.md#dd-core-boot-006) |
| `DD-ENG-023` | [FR-PROJ-014](../functional/managed-project-functional-specification-v01.md#fr-proj-014) |
| `DD-ENG-025` | [FR-INV-011](../functional/application-invocation-functional-specification-v01.md#fr-inv-011) |
| `DD-ENG-026` | [DD-1.1](../dd_1_application_core/dd-1-1-application-invocation-detailed-design-v01.md#_12-shared-validation-coordination) |
| `DD-ENG-028` | [DD-1.2](../dd_1_application_core/dd-1-2-execution-outcomes-detailed-design-v01.md#_8-execution-evidence-contract); [effects](../dd_1_application_core/dd-1-2-execution-outcomes-detailed-design-v01.md#_12-consequential-effects); [child results](../dd_1_application_core/dd-1-2-execution-outcomes-detailed-design-v01.md#_14-partial-completion) |
| `DD-ENG-029` | [FR-INV-034](../functional/application-invocation-functional-specification-v01.md#fr-inv-034) |
| `DD-ENG-030` | [Design](../appmanager-design-specification-v01.md#_10-11-cross-domain-workflows) |
| `DD-ENG-031` | [invocation](../dd_1_application_core/dd-1-1-application-invocation-detailed-design-v01.md); [outcome](../dd_1_application_core/dd-1-2-execution-outcomes-detailed-design-v01.md); [project](../dd_1_application_core/dd-1-3-managed-project-detailed-design-v01.md); [configuration](../dd_1_application_core/dd-1-4-configuration-resolution-detailed-design-v01.md); [Design](../appmanager-design-specification-v01.md#_6-2-application-engine-authority) |
| `DD-ENG-032` | [Design](../appmanager-design-specification-v01.md#_10-11-cross-domain-workflows) |
| `DD-ENG-034` | [Design](../appmanager-design-specification-v01.md#_6-6-capability-boundaries-and-providers) |
| `DD-ENG-036` | [Design](../appmanager-design-specification-v01.md#_6-6-capability-boundaries-and-providers); [Design](../appmanager-design-specification-v01.md#_9-9-non-destructive-ownership-and-unmanaged-content); [DD-ENG-035](../dd_1_application_core/dd-1-5-application-engine-detailed-design-v01.md#dd-eng-035) |
| `DD-ENG-037` | [DD-1.2](../dd_1_application_core/dd-1-2-execution-outcomes-detailed-design-v01.md#_8-execution-evidence-contract) |
| `DD-ENG-038` | [DD-1.2](../dd_1_application_core/dd-1-2-execution-outcomes-detailed-design-v01.md#_18-provider-result-normalization) |
| `DD-ENG-041` | [Design](../appmanager-design-specification-v01.md#_7-4-scanners); [Design](../appmanager-design-specification-v01.md#_7-9-inspection-and-mutation-separation) |
| `DD-ENG-042` | [Design](../appmanager-design-specification-v01.md#_6-7-resolvers) |
| `DD-ENG-043` | [Design](../appmanager-design-specification-v01.md#_7-5-strategies-and-transformation-plans); [DD-2.5](../dd_2_shared_capabilities/dd-2-5-source-transformation-detailed-design-v01.md) |
| `DD-ENG-044` | [DD-1.2](../dd_1_application_core/dd-1-2-execution-outcomes-detailed-design-v01.md#_18-provider-result-normalization); [DD-1.1](../dd_1_application_core/dd-1-1-application-invocation-detailed-design-v01.md#dd-outclar-002) |
| `DD-ENG-045` | [DD-ENG-005](../dd_1_application_core/dd-1-5-application-engine-detailed-design-v01.md#dd-eng-005); [Design](../appmanager-design-specification-v01.md#_6-2-application-engine-authority) |
| `DD-ENG-047` | [DD-ENG-004](../dd_1_application_core/dd-1-5-application-engine-detailed-design-v01.md#dd-eng-004) |
| `DD-ENG-049` | [Design](../appmanager-design-specification-v01.md#_9-9-non-destructive-ownership-and-unmanaged-content); [DD-ENG-035](../dd_1_application_core/dd-1-5-application-engine-detailed-design-v01.md#dd-eng-035) |
| `DD-ENG-050` | [DD-1.1](../dd_1_application_core/dd-1-1-application-invocation-detailed-design-v01.md#_14-confirmation-and-authorization-evidence) |
| `DD-ENG-052` | [DD-ENG-027](../dd_1_application_core/dd-1-5-application-engine-detailed-design-v01.md#dd-eng-027); [DD-1.1](../dd_1_application_core/dd-1-1-application-invocation-detailed-design-v01.md#_14-3-binding-and-stale-authorization) |
| `DD-ENG-053` | [DD-1.1](../dd_1_application_core/dd-1-1-application-invocation-detailed-design-v01.md#_15-preview-and-dry-run-intent) |
| `DD-ENG-054` | [DD-1.2](../dd_1_application_core/dd-1-2-execution-outcomes-detailed-design-v01.md#_13-proposed-effects-and-preview) |
| `DD-ENG-055` | [DD-1.1](../dd_1_application_core/dd-1-1-application-invocation-detailed-design-v01.md#_14-confirmation-and-authorization-evidence); [DD-1.2](../dd_1_application_core/dd-1-2-execution-outcomes-detailed-design-v01.md#_13-proposed-effects-and-preview) |
| `DD-ENG-056` | [DD-ENG-024](../dd_1_application_core/dd-1-5-application-engine-detailed-design-v01.md#dd-eng-024) |
| `DD-ENG-057` | [Design](../appmanager-design-specification-v01.md#_11-11-workflow-results-failure-and-acceptance) |
| `DD-ENG-058` | [FR-INV-034](../functional/application-invocation-functional-specification-v01.md#fr-inv-034) |
| `DD-ENG-059` | [DD-1.2](../dd_1_application_core/dd-1-2-execution-outcomes-detailed-design-v01.md#_7-outcome-contract); [payload composition](../dd_1_application_core/dd-1-2-execution-outcomes-detailed-design-v01.md#_7-2-result-payload) |
| `DD-ENG-060` | [FR-INV-036](../functional/application-invocation-functional-specification-v01.md#fr-inv-036); [DD-1.2](../dd_1_application_core/dd-1-2-execution-outcomes-detailed-design-v01.md#_14-partial-completion) |
| `DD-ENG-061` | [DD-1.2](../dd_1_application_core/dd-1-2-execution-outcomes-detailed-design-v01.md#_15-no-op-already-satisfied-skipped-and-not-attempted-states) |
| `DD-ENG-062` | [FR-INV-045](../functional/application-invocation-functional-specification-v01.md#fr-inv-045) |
| `DD-ENG-063` | [DD-1.1](../dd_1_application_core/dd-1-1-application-invocation-detailed-design-v01.md#dd-outclar-002) |
| `DD-ENG-064` | [DD-1.2](../dd_1_application_core/dd-1-2-execution-outcomes-detailed-design-v01.md#_17-2-cooperative-cancellation) |
| `DD-ENG-065` | [DD-1.1](../dd_1_application_core/dd-1-1-application-invocation-detailed-design-v01.md#_20-2-cooperative-design); [DD-1.2](../dd_1_application_core/dd-1-2-execution-outcomes-detailed-design-v01.md#_17-cancellation-model) |
| `DD-ENG-066` | [DD-1.2](../dd_1_application_core/dd-1-2-execution-outcomes-detailed-design-v01.md#_17-2-cooperative-cancellation) |
| `DD-ENG-067` | [DD-1.2](../dd_1_application_core/dd-1-2-execution-outcomes-detailed-design-v01.md#_17-cancellation-model); [verified rollback reporting](../dd_1_application_core/dd-1-2-execution-outcomes-detailed-design-v01.md#_12-4-no-false-rollback) |
| `DD-ENG-068` | [DD-1.1](../dd_1_application_core/dd-1-1-application-invocation-detailed-design-v01.md#_20-4-late-cancellation) |
| `DD-ENG-069` | [FR-INV-048](../functional/application-invocation-functional-specification-v01.md#fr-inv-048) |
| `DD-ENG-070` | [FR-INV-049](../functional/application-invocation-functional-specification-v01.md#fr-inv-049) |
| `DD-ENG-071` | [FR-INV-048](../functional/application-invocation-functional-specification-v01.md#fr-inv-048); [DD-ENG-024](../dd_1_application_core/dd-1-5-application-engine-detailed-design-v01.md#dd-eng-024) |
| `DD-ENG-072` | [DD-1.2](../dd_1_application_core/dd-1-2-execution-outcomes-detailed-design-v01.md#_22-retryability-and-repetition-evidence); [FR-INV-049](../functional/application-invocation-functional-specification-v01.md#fr-inv-049) |
| `DD-ENG-073` | [DD-1.2](../dd_1_application_core/dd-1-2-execution-outcomes-detailed-design-v01.md#_12-4-no-false-rollback) |
| `DD-ENG-074` | [DD-ENG-039](../dd_1_application_core/dd-1-5-application-engine-detailed-design-v01.md#dd-eng-039); [DD-ENG-027](../dd_1_application_core/dd-1-5-application-engine-detailed-design-v01.md#dd-eng-027) |
| `DD-ENG-075` | [DD-1.1](../dd_1_application_core/dd-1-1-application-invocation-detailed-design-v01.md#_27-1-invocation-independence) |
| `DD-ENG-077` | [DD-1.3 freshness](../dd_1_application_core/dd-1-3-managed-project-detailed-design-v01.md#_25-context-freshness-and-stale-state-boundaries) |
| `DD-ENG-078` | [DD-1.4](../dd_1_application_core/dd-1-4-configuration-resolution-detailed-design-v01.md#_27-4-dynamic-re-resolution); [DD-CORE-BOOT-006](../dd_1_application_core/dd-1-5-application-engine-detailed-design-v01.md#dd-core-boot-006) |
| `DD-ENG-079` | [DD-1.1](../dd_1_application_core/dd-1-1-application-invocation-detailed-design-v01.md#_27-3-no-global-serialization-requirement) |
| `DD-ENG-080` | [FR-INV-051](../functional/application-invocation-functional-specification-v01.md#fr-inv-051) |
| `DD-ENG-081` | [Design](../appmanager-design-specification-v01.md#_10-11-cross-domain-workflows) |
| `DD-ENG-082` | [DD-1.2](../dd_1_application_core/dd-1-2-execution-outcomes-detailed-design-v01.md#_25-4-nested-use-cases) |
| `DD-ENG-083` | [DD-1.2](../dd_1_application_core/dd-1-2-execution-outcomes-detailed-design-v01.md#_20-outcome-aggregation) |
| `DD-ENG-086` | [Design](../appmanager-design-specification-v01.md#_4-6-presentation-independence) |
| `DD-ENG-087` | [FR-INV-020](../functional/application-invocation-functional-specification-v01.md#fr-inv-020) |
| `DD-ENG-088` | [DD-1.1](../dd_1_application_core/dd-1-1-application-invocation-detailed-design-v01.md#_11-interaction-capability-contract) |
| `DD-ENG-089` | [FR-INV-020](../functional/application-invocation-functional-specification-v01.md#fr-inv-020); [FR-INV-022](../functional/application-invocation-functional-specification-v01.md#fr-inv-022) |
| `DD-ENG-090` | [Design](../appmanager-design-specification-v01.md#_4-6-presentation-independence) |
| `DD-ENG-091` | [Design](../appmanager-design-specification-v01.md#_6-6-capability-boundaries-and-providers) |
| `DD-ENG-092` | [Design](../appmanager-design-specification-v01.md#_9-9-non-destructive-ownership-and-unmanaged-content); [Design](../appmanager-design-specification-v01.md#_6-2-application-engine-authority) |
| `DD-ENG-095` | [Design](../appmanager-design-specification-v01.md#_6-6-capability-boundaries-and-providers) |
| `DD-ENG-096` | [Design](../appmanager-design-specification-v01.md#_13-2-extension-classes) |
| `DD-ENG-098` | [DD-1.1](../dd_1_application_core/dd-1-1-application-invocation-detailed-design-v01.md#_37-2-new-interaction-adapters); [DD-1.1](../dd_1_application_core/dd-1-1-application-invocation-detailed-design-v01.md#dd-outclar-002) |
| `DD-ENG-099` | [DD-1.2](../dd_1_application_core/dd-1-2-execution-outcomes-detailed-design-v01.md#_9-diagnostic-model); [DD-1.1](../dd_1_application_core/dd-1-1-application-invocation-detailed-design-v01.md#_35-error-and-fault-boundary) |
| `DD-ENG-101` | [FR-INV-006](../functional/application-invocation-functional-specification-v01.md#fr-inv-006); [FR-PROJ-042](../functional/managed-project-functional-specification-v01.md#fr-proj-042); [FR-CONFIG-029](../functional/configuration-functional-specification-v01.md#fr-config-029); [DD-ENG-039](../dd_1_application_core/dd-1-5-application-engine-detailed-design-v01.md#dd-eng-039) |
| `DD-ENG-102` | [Design](../appmanager-design-specification-v01.md#_8-7-sensitive-configuration); [DD-1.2](../dd_1_application_core/dd-1-2-execution-outcomes-detailed-design-v01.md#_24-sensitive-information-and-redaction) |
| `DD-QUAL-072` | [Quality Capability untrusted-evidence boundary](../dd_2_shared_capabilities/dd-2-8-quality-capability-detailed-design-v01.md#dd-qualcap-093) |
| `DD-SET-073` | [sensitivity propagation](../dd_1_application_core/dd-1-4-configuration-resolution-detailed-design-v01.md#_22-4-sensitivity-propagation) |
| `DD-APP-092` | [shared-abstraction criterion](../dd_1_application_core/dd-1-5-application-engine-detailed-design-v01.md#dd-eng-046) |
| `DD-GIT-073` | [shared-abstraction criterion](../dd_1_application_core/dd-1-5-application-engine-detailed-design-v01.md#dd-eng-046) |
| `DD-NUXT-089` | [shared-abstraction criterion](../dd_1_application_core/dd-1-5-application-engine-detailed-design-v01.md#dd-eng-046) |
| `DD-DOCS-080` | [shared-abstraction criterion](../dd_1_application_core/dd-1-5-application-engine-detailed-design-v01.md#dd-eng-046) |
| `DD-SET-081` | [shared-abstraction criterion](../dd_1_application_core/dd-1-5-application-engine-detailed-design-v01.md#dd-eng-046) |
| `DD-UTIL-104` | [shared-abstraction criterion](../dd_1_application_core/dd-1-5-application-engine-detailed-design-v01.md#dd-eng-046) |
| `DD-QUAL-080` | [DD-ENG-046](../dd_1_application_core/dd-1-5-application-engine-detailed-design-v01.md#dd-eng-046); [Design extension classes](../appmanager-design-specification-v01.md#_13-2-extension-classes); [implementation choices](../project-documentation-guide-v01.md#_8-level-4-implementation-specification) |
| `DD-QUALCAP-007` | [Quality semantic-ownership decision](../dd_4_policy_and_resource_domains/dd-4-1-quality-domain-detailed-design-v01.md#dd-qual-078) |
| `DD-QUALCAP-015` | [Design provider encapsulation contract](../appmanager-design-specification-v01.md#_6-6-capability-boundaries-and-providers) |
| `DD-AICAP-016` | [Design provider encapsulation contract](../appmanager-design-specification-v01.md#_6-6-capability-boundaries-and-providers) |
| `DD-DOCCAP-011` | [Design provider encapsulation contract](../appmanager-design-specification-v01.md#_6-6-capability-boundaries-and-providers) |
| `DD-DOCS-074` | [Documentation Capability untrusted-content boundary](../dd_2_shared_capabilities/dd-2-9-documentation-capability-detailed-design-v01.md#dd-doccap-097) |
| `DD-CORE-BOOT-008` | [Design §8.4](../appmanager-design-specification-v01.md#_8-4-separation-of-resolution-and-interaction); [FR-INV-020](../functional/application-invocation-functional-specification-v01.md#fr-inv-020) |
| `DD-PROC-002` | [Design §6.2](../appmanager-design-specification-v01.md#_6-2-application-engine-authority) |
| `DD-PROC-007` | [Design §6.2](../appmanager-design-specification-v01.md#_6-2-application-engine-authority) |
| `DD-PROC-012` | [Design provider encapsulation](../appmanager-design-specification-v01.md#_6-6-capability-boundaries-and-providers) |
| `DD-PROC-024` | [Design configuration model](../appmanager-design-specification-v01.md#_8-1-configuration-model) |
| `DD-PROC-032` | [Design §11.11](../appmanager-design-specification-v01.md#_11-11-workflow-results-failure-and-acceptance) |
| `DD-PROC-054` | [DD-PROC-062](../dd_2_shared_capabilities/dd-2-2-process-execution-detailed-design-v01.md#dd-proc-062); [DD-PROC-061](../dd_2_shared_capabilities/dd-2-2-process-execution-detailed-design-v01.md#dd-proc-061) |
| `DD-PROC-074` | [FR-INV-049](../functional/application-invocation-functional-specification-v01.md#fr-inv-049) |
| `DD-PROC-079` | [application conflict-coordination boundary](../dd_1_application_core/dd-1-1-application-invocation-detailed-design-v01.md#_27-3-no-global-serialization-requirement); [DD-PROC-080](../dd_2_shared_capabilities/dd-2-2-process-execution-detailed-design-v01.md#dd-proc-080) |
| `DD-PROC-091` | [Design capability boundary](../appmanager-design-specification-v01.md#_6-6-capability-boundaries-and-providers); [DD-ENG-046](../dd_1_application_core/dd-1-5-application-engine-detailed-design-v01.md#dd-eng-046) |
| `DD-PROC-097` | [Design §6.6](../appmanager-design-specification-v01.md#_6-6-capability-boundaries-and-providers) |
| `DD-RES-036` | [DD-RES-035](../dd_2_shared_capabilities/dd-2-1-resource-access-detailed-design-v01.md#dd-res-035) |
| `DD-SINT-015` | [Design §6.6](../appmanager-design-specification-v01.md#_6-6-capability-boundaries-and-providers) |
| `DD-SINT-040` | [Design §4.6](../appmanager-design-specification-v01.md#_4-6-presentation-independence) |
| `DD-SINT-052` | [FR-PROJ-044](../functional/managed-project-functional-specification-v01.md#fr-proj-044) |
| `DD-XFORM-004` | [FR-XFORM-013](../functional/source-transformation-functional-specification-v01.md#fr-xform-013); [FR-PROJ-044](../functional/managed-project-functional-specification-v01.md#fr-proj-044) |
| `DD-XFORM-011` | [FR-XFORM-031](../functional/source-transformation-functional-specification-v01.md#fr-xform-031) |
| `DD-XFORM-014` | [Design §6.6](../appmanager-design-specification-v01.md#_6-6-capability-boundaries-and-providers) |
| `DD-XFORM-022` | [Resource Access create/replace distinction](../dd_2_shared_capabilities/dd-2-1-resource-access-detailed-design-v01.md#dd-res-005) |
| `DD-XFORM-030` | [FR-XFORM-020](../functional/source-transformation-functional-specification-v01.md#fr-xform-020) |
| `DD-REG-007` | [FR-SET-099](../functional/settings-functional-specification-v01.md#fr-set-099) |
| `DD-AICAP-012` | [FR-AI-081](../functional/ai-functional-specification-v01.md#fr-ai-081) |
| `DD-AICAP-023` | [FR-AI-088](../functional/ai-functional-specification-v01.md#fr-ai-088) |
| `DD-AICAP-031` | [Design §11.10](../appmanager-design-specification-v01.md#_11-10-ai-assisted-workflow) |
| `DD-AICAP-034` | [FR-AI-089](../functional/ai-functional-specification-v01.md#fr-ai-089) |
| `DD-AICAP-060` | [FR-AI-084](../functional/ai-functional-specification-v01.md#fr-ai-084) |
| `DD-AICAP-062` | [FR-AI-085](../functional/ai-functional-specification-v01.md#fr-ai-085) |
| `DD-AICAP-069` | [DD-AICAP-015](../dd_2_shared_capabilities/dd-2-7-ai-capability-detailed-design-v01.md#dd-aicap-015) |
| `DD-AICAP-084` | [Design §6.6](../appmanager-design-specification-v01.md#_6-6-capability-boundaries-and-providers) |
| `DD-QUALCAP-024` | [FR-QUAL-097](../functional/quality-functional-specification-v01.md#fr-qual-097); [FR-QUAL-098](../functional/quality-functional-specification-v01.md#fr-qual-098); [FR-QUAL-099](../functional/quality-functional-specification-v01.md#fr-qual-099); [FR-QUAL-038](../functional/quality-functional-specification-v01.md#fr-qual-038) |
| `DD-QUALCAP-025` | [FR-QUAL-102](../functional/quality-functional-specification-v01.md#fr-qual-102); [FR-INV-021](../functional/application-invocation-functional-specification-v01.md#fr-inv-021) |
| `DD-QUALCAP-029` | [FR-QUAL-036](../functional/quality-functional-specification-v01.md#fr-qual-036); [FR-QUAL-037](../functional/quality-functional-specification-v01.md#fr-qual-037) |
| `DD-QUALCAP-030` | [FR-QUAL-035](../functional/quality-functional-specification-v01.md#fr-qual-035) |
| `DD-QUALCAP-031` | [FR-QUAL-038](../functional/quality-functional-specification-v01.md#fr-qual-038) |
| `DD-QUALCAP-032` | [FR-QUAL-032](../functional/quality-functional-specification-v01.md#fr-qual-032); [FR-QUAL-040](../functional/quality-functional-specification-v01.md#fr-qual-040) |
| `DD-QUALCAP-033` | [FR-QUAL-043](../functional/quality-functional-specification-v01.md#fr-qual-043) |
| `DD-QUALCAP-035` | [FR-QUAL-044](../functional/quality-functional-specification-v01.md#fr-qual-044); [FR-QUAL-043](../functional/quality-functional-specification-v01.md#fr-qual-043) |
| `DD-QUALCAP-036` | [FR-QUAL-050](../functional/quality-functional-specification-v01.md#fr-qual-050) |
| `DD-QUALCAP-039` | [FR-QUAL-053](../functional/quality-functional-specification-v01.md#fr-qual-053) |
| `DD-QUALCAP-044` | [FR-QUAL-063](../functional/quality-functional-specification-v01.md#fr-qual-063) |
| `DD-QUALCAP-045` | [FR-QUAL-064](../functional/quality-functional-specification-v01.md#fr-qual-064) |
| `DD-QUALCAP-047` | [FR-QUAL-066](../functional/quality-functional-specification-v01.md#fr-qual-066); [FR-QUAL-067](../functional/quality-functional-specification-v01.md#fr-qual-067) |
| `DD-QUALCAP-050` | [FR-QUAL-072](../functional/quality-functional-specification-v01.md#fr-qual-072); [FR-QUAL-051](../functional/quality-functional-specification-v01.md#fr-qual-051) |
| `DD-QUALCAP-051` | [FR-QUAL-079](../functional/quality-functional-specification-v01.md#fr-qual-079) |
| `DD-QUALCAP-052` | [FR-QUAL-075](../functional/quality-functional-specification-v01.md#fr-qual-075); [FR-QUAL-077](../functional/quality-functional-specification-v01.md#fr-qual-077); [FR-QUAL-078](../functional/quality-functional-specification-v01.md#fr-qual-078) |
| `DD-QUALCAP-053` | [FR-QUAL-080](../functional/quality-functional-specification-v01.md#fr-qual-080) |
| `DD-QUALCAP-055` | [FR-QUAL-082](../functional/quality-functional-specification-v01.md#fr-qual-082) |
| `DD-QUALCAP-056` | [FR-QUAL-083](../functional/quality-functional-specification-v01.md#fr-qual-083) |
| `DD-QUALCAP-057` | [FR-QUAL-084](../functional/quality-functional-specification-v01.md#fr-qual-084) |
| `DD-QUALCAP-068` | [FR-QUAL-106](../functional/quality-functional-specification-v01.md#fr-qual-106) |
| `DD-QUALCAP-074` | [FR-QUAL-109](../functional/quality-functional-specification-v01.md#fr-qual-109) |
| `DD-QUALCAP-080` | [FR-QUAL-091](../functional/quality-functional-specification-v01.md#fr-qual-091); [Design §11.11](../appmanager-design-specification-v01.md#_11-11-workflow-results-failure-and-acceptance) |
| `DD-DOCCAP-007` | [FR-DOCS-104](../functional/docs-functional-specification-v01.md#fr-docs-104) |
| `DD-DOCCAP-016` | [FR-DOCS-045](../functional/docs-functional-specification-v01.md#fr-docs-045) |
| `DD-DOCCAP-019` | [FR-DOCS-062](../functional/docs-functional-specification-v01.md#fr-docs-062) |
| `DD-DOCCAP-022` | [FR-DOCS-037](../functional/docs-functional-specification-v01.md#fr-docs-037) |
| `DD-DOCCAP-027` | [FR-DOCS-102](../functional/docs-functional-specification-v01.md#fr-docs-102) |
| `DD-DOCCAP-028` | [FR-DOCS-038](../functional/docs-functional-specification-v01.md#fr-docs-038); [FR-DOCS-102](../functional/docs-functional-specification-v01.md#fr-docs-102) |
| `DD-DOCCAP-029` | [FR-DOCS-039](../functional/docs-functional-specification-v01.md#fr-docs-039) |
| `DD-DOCCAP-032` | [Design §6.8](../appmanager-design-specification-v01.md#_6-8-generation-and-templates) |
| `DD-DOCCAP-038` | [FR-DOCS-080](../functional/docs-functional-specification-v01.md#fr-docs-080) |
| `DD-DOCCAP-044` | [FR-DOCS-076](../functional/docs-functional-specification-v01.md#fr-docs-076) |
| `DD-DOCCAP-048` | [FR-DOCS-084](../functional/docs-functional-specification-v01.md#fr-docs-084) |
| `DD-DOCCAP-052` | [FR-DOCS-089](../functional/docs-functional-specification-v01.md#fr-docs-089) |
| `DD-DOCCAP-055` | [FR-DOCS-118](../functional/docs-functional-specification-v01.md#fr-docs-118) |
| `DD-DOCCAP-059` | [FR-DOCS-097](../functional/docs-functional-specification-v01.md#fr-docs-097); [Process readiness](../dd_2_shared_capabilities/dd-2-2-process-execution-detailed-design-v01.md#dd-proc-067) |
| `DD-DOCCAP-063` | [FR-DOCS-099](../functional/docs-functional-specification-v01.md#fr-docs-099) |
| `DD-DOCCAP-064` | [FR-DOCS-098](../functional/docs-functional-specification-v01.md#fr-docs-098) |
| `DD-DOCCAP-065` | [FR-QUAL-067](../functional/quality-functional-specification-v01.md#fr-qual-067) |
| `DD-DOCCAP-067` | [FR-QUAL-066](../functional/quality-functional-specification-v01.md#fr-qual-066); [FR-QUAL-067](../functional/quality-functional-specification-v01.md#fr-qual-067); [FR-DOCS-100](../functional/docs-functional-specification-v01.md#fr-docs-100) |
| `DD-DOCCAP-072` | [FR-DOCS-103](../functional/docs-functional-specification-v01.md#fr-docs-103) |
| `DD-DOCCAP-082` | [FR-DOCS-081](../functional/docs-functional-specification-v01.md#fr-docs-081) |
| `DD-NUXTCAP-005` | [Design §9.3](../appmanager-design-specification-v01.md#_9-3-root-application-and-managed-layers) |
| `DD-NUXTCAP-007` | [FR-NUXT-092](../functional/nuxt-functional-specification-v01.md#fr-nuxt-092) |
| `DD-NUXTCAP-008` | [FR-NUXT-017](../functional/nuxt-functional-specification-v01.md#fr-nuxt-017) |
| `DD-NUXTCAP-011` | [FR-NUXT-019](../functional/nuxt-functional-specification-v01.md#fr-nuxt-019) |
| `DD-NUXTCAP-014` | [FR-NUXT-022](../functional/nuxt-functional-specification-v01.md#fr-nuxt-022); [FR-NUXT-023](../functional/nuxt-functional-specification-v01.md#fr-nuxt-023) |
| `DD-NUXTCAP-017` | [FR-NUXT-032](../functional/nuxt-functional-specification-v01.md#fr-nuxt-032) |
| `DD-NUXTCAP-018` | [FR-NUXT-026](../functional/nuxt-functional-specification-v01.md#fr-nuxt-026); [FR-NUXT-042](../functional/nuxt-functional-specification-v01.md#fr-nuxt-042) |
| `DD-NUXTCAP-021` | [FR-NUXT-030](../functional/nuxt-functional-specification-v01.md#fr-nuxt-030); [FR-INV-021](../functional/application-invocation-functional-specification-v01.md#fr-inv-021) |
| `DD-NUXTCAP-022` | [FR-NUXT-031](../functional/nuxt-functional-specification-v01.md#fr-nuxt-031) |
| `DD-NUXTCAP-026` | [FR-NUXT-035](../functional/nuxt-functional-specification-v01.md#fr-nuxt-035) |
| `DD-NUXTCAP-027` | [FR-NUXT-037](../functional/nuxt-functional-specification-v01.md#fr-nuxt-037) |
| `DD-NUXTCAP-028` | [FR-NUXT-038](../functional/nuxt-functional-specification-v01.md#fr-nuxt-038) |
| `DD-NUXTCAP-030` | [FR-NUXT-045](../functional/nuxt-functional-specification-v01.md#fr-nuxt-045) |
| `DD-NUXTCAP-031` | [FR-NUXT-046](../functional/nuxt-functional-specification-v01.md#fr-nuxt-046) |
| `DD-NUXTCAP-032` | [FR-NUXT-048](../functional/nuxt-functional-specification-v01.md#fr-nuxt-048) |
| `DD-NUXTCAP-034` | [FR-NUXT-041](../functional/nuxt-functional-specification-v01.md#fr-nuxt-041); [FR-NUXT-011](../functional/nuxt-functional-specification-v01.md#fr-nuxt-011) |
| `DD-NUXTCAP-037` | [FR-NUXT-091](../functional/nuxt-functional-specification-v01.md#fr-nuxt-091) |
| `DD-NUXTCAP-039` | [FR-NUXT-017](../functional/nuxt-functional-specification-v01.md#fr-nuxt-017) |
| `DD-NUXTCAP-040` | [FR-NUXT-057](../functional/nuxt-functional-specification-v01.md#fr-nuxt-057) |
| `DD-NUXTCAP-043` | [FR-NUXT-061](../functional/nuxt-functional-specification-v01.md#fr-nuxt-061) |
| `DD-NUXTCAP-047` | [FR-NUXT-058](../functional/nuxt-functional-specification-v01.md#fr-nuxt-058); [FR-NUXT-096](../functional/nuxt-functional-specification-v01.md#fr-nuxt-096); [§16](../dd_2_shared_capabilities/dd-2-10-nuxt-capability-detailed-design-v01.md#_16-layer-scaffolding-and-resource-registry) |
| `DD-NUXTCAP-051` | [FR-NUXT-062](../functional/nuxt-functional-specification-v01.md#fr-nuxt-062) |
| `DD-NUXTCAP-055` | [FR-NUXT-068](../functional/nuxt-functional-specification-v01.md#fr-nuxt-068) |
| `DD-NUXTCAP-071` | [FR-NUXT-094](../functional/nuxt-functional-specification-v01.md#fr-nuxt-094); [FR-NUXT-058](../functional/nuxt-functional-specification-v01.md#fr-nuxt-058) |
| `DD-NUXTCAP-072` | [FR-NUXT-095](../functional/nuxt-functional-specification-v01.md#fr-nuxt-095) |
| `DD-NUXTCAP-075` | [FR-DOCS-100](../functional/docs-functional-specification-v01.md#fr-docs-100); [FR-NUXT-058](../functional/nuxt-functional-specification-v01.md#fr-nuxt-058); [scaffold collaboration contract](../dd_2_shared_capabilities/dd-2-10-nuxt-capability-detailed-design-v01.md#_16-layer-scaffolding-and-resource-registry) |
| `DD-NUXTCAP-086` | [FR-NUXT-054](../functional/nuxt-functional-specification-v01.md#fr-nuxt-054) |
| `DD-APP-012` | [FR-APP-011](../functional/app-functional-specification-v01.md#fr-app-011); [FR-INV-015](../functional/application-invocation-functional-specification-v01.md#fr-inv-015) |
| `DD-APP-015` | [FR-APP-113](../functional/app-functional-specification-v01.md#fr-app-113) |
| `DD-APP-021` | [FR-APP-022](../functional/app-functional-specification-v01.md#fr-app-022) |
| `DD-APP-027` | [FR-APP-036](../functional/app-functional-specification-v01.md#fr-app-036) |
| `DD-APP-029` | [FR-APP-040](../functional/app-functional-specification-v01.md#fr-app-040); [Design §4.6](../appmanager-design-specification-v01.md#_4-6-presentation-independence) |
| `DD-APP-034` | [FR-APP-052](../functional/app-functional-specification-v01.md#fr-app-052); [Design §9.9](../appmanager-design-specification-v01.md#_9-9-non-destructive-ownership-and-unmanaged-content); [DD-APP-035](../dd_3_high_coupling_domains/dd-3-1-app-domain-detailed-design-v01.md#dd-app-035) |
| `DD-APP-062` | [FR-INV-036](../functional/application-invocation-functional-specification-v01.md#fr-inv-036) |
| `DD-APP-074` | [Engine stale-state checkpoint](../dd_1_application_core/dd-1-5-application-engine-detailed-design-v01.md#dd-eng-024) |
| `DD-APP-080` | [DD-ENG-024](../dd_1_application_core/dd-1-5-application-engine-detailed-design-v01.md#dd-eng-024) |
| `DD-GIT-047` | [FR-GIT-101](../functional/git-functional-specification-v01.md#fr-git-101) |
| `DD-GIT-049` | [DD-ENG-027](../dd_1_application_core/dd-1-5-application-engine-detailed-design-v01.md#dd-eng-027) |
| `DD-GIT-055` | [FR-GIT-108](../functional/git-functional-specification-v01.md#fr-git-108); [Engine stale-state checkpoint](../dd_1_application_core/dd-1-5-application-engine-detailed-design-v01.md#dd-eng-024) |
| `DD-GIT-023` | [FR-GIT-032](../functional/git-functional-specification-v01.md#fr-git-032); [Design §11.10](../appmanager-design-specification-v01.md#_11-10-ai-assisted-workflow); [DD-GIT-009](../dd_3_high_coupling_domains/dd-3-2-git-domain-detailed-design-v01.md#dd-git-009) |
| `DD-NUXTCAP-035` | [FR-NUXT-011](../functional/nuxt-functional-specification-v01.md#fr-nuxt-011); [Quality ownership](../functional/quality-functional-specification-v01.md#fr-qual-001); [FR-APP-034](../functional/app-functional-specification-v01.md#fr-app-034) |
| `DD-NUXT-054` | [FR-NUXT-011](../functional/nuxt-functional-specification-v01.md#fr-nuxt-011); [Quality ownership](../functional/quality-functional-specification-v01.md#fr-qual-001); [FR-APP-034](../functional/app-functional-specification-v01.md#fr-app-034) |
| `DD-NUXT-061` | [Engine stale-state checkpoint](../dd_1_application_core/dd-1-5-application-engine-detailed-design-v01.md#dd-eng-024); [FR-XFORM-020](../functional/source-transformation-functional-specification-v01.md#fr-xform-020) |
| `DD-NUXT-081` | [FR-AI-088](../functional/ai-functional-specification-v01.md#fr-ai-088); [FR-AI-089](../functional/ai-functional-specification-v01.md#fr-ai-089) |
| `DD-NUXT-083` | [Design §9.7](../appmanager-design-specification-v01.md#_9-7-managed-scope-and-operation-targeting); [Resource Access indirection boundary](../dd_2_shared_capabilities/dd-2-1-resource-access-detailed-design-v01.md#dd-res-014) |
| `DD-NUXT-084` | [Design §6.6](../appmanager-design-specification-v01.md#_6-6-capability-boundaries-and-providers); [§11.11](../appmanager-design-specification-v01.md#_11-11-workflow-results-failure-and-acceptance); [§11.10](../appmanager-design-specification-v01.md#_11-10-ai-assisted-workflow) |
| `DD-DOCS-067` | [Engine stale-state checkpoint](../dd_1_application_core/dd-1-5-application-engine-detailed-design-v01.md#dd-eng-024) |
| `DD-DOCS-072` | [DD-DOCCAP-084](../dd_2_shared_capabilities/dd-2-9-documentation-capability-detailed-design-v01.md#dd-doccap-084) |
| `DD-DOCS-076` | [DD-DOCCAP-098](../dd_2_shared_capabilities/dd-2-9-documentation-capability-detailed-design-v01.md#dd-doccap-098) |
| `DD-QUAL-016` | [Quality recognition boundary](../dd_2_shared_capabilities/dd-2-8-quality-capability-detailed-design-v01.md#dd-qualcap-008) |
| `DD-QUAL-034` | [unattempted-check evidence](../dd_2_shared_capabilities/dd-2-8-quality-capability-detailed-design-v01.md#dd-qualcap-058) |
| `DD-QUAL-036` | [DD-QUALCAP-023](../dd_2_shared_capabilities/dd-2-8-quality-capability-detailed-design-v01.md#dd-qualcap-023); [FR-QUAL-075](../functional/quality-functional-specification-v01.md#fr-qual-075) |
| `DD-QUAL-060` | [Engine stale-state checkpoint](../dd_1_application_core/dd-1-5-application-engine-detailed-design-v01.md#dd-eng-024) |
| `DD-QUAL-069` | [deterministic evaluation contract](../dd_2_shared_capabilities/dd-2-8-quality-capability-detailed-design-v01.md#dd-qualcap-054) |
| `DD-QUAL-070` | [DD-QUALCAP-075](../dd_2_shared_capabilities/dd-2-8-quality-capability-detailed-design-v01.md#dd-qualcap-075) |
| `DD-QUAL-076` | [DD-QUALCAP-083](../dd_2_shared_capabilities/dd-2-8-quality-capability-detailed-design-v01.md#dd-qualcap-083) |
| `DD-SET-032` | [FR-SET-078](../functional/settings-functional-specification-v01.md#fr-set-078); [FR-SET-080](../functional/settings-functional-specification-v01.md#fr-set-080) |
| `DD-SET-056` | [Resource Access indirection contract](../dd_2_shared_capabilities/dd-2-1-resource-access-detailed-design-v01.md#dd-res-014) |
| `DD-AI-044` | [DD-1.2 effect/uncertainty model](../dd_1_application_core/dd-1-2-execution-outcomes-detailed-design-v01.md#_12-consequential-effects) |
| `DD-AI-074` | [Design §9.9](../appmanager-design-specification-v01.md#_9-9-non-destructive-ownership-and-unmanaged-content); [Engine freshness checkpoint](../dd_1_application_core/dd-1-5-application-engine-detailed-design-v01.md#dd-eng-024) |
| `DD-UTIL-018` | [PBC-FR-MAINT-COORD-005](../functional/utils-functional-specification-v01.md#pbc-fr-maint-coord-005); [PBC-FR-MAINT-COORD-024](../functional/utils-functional-specification-v01.md#pbc-fr-maint-coord-024) |
| `DD-UTIL-100` | [Resource Access indirection contract](../dd_2_shared_capabilities/dd-2-1-resource-access-detailed-design-v01.md#dd-res-014) |
| `DD-CORE-BOOT-006` | [DD-ENG-024](../dd_1_application_core/dd-1-5-application-engine-detailed-design-v01.md#dd-eng-024); [DD-ENG-027](../dd_1_application_core/dd-1-5-application-engine-detailed-design-v01.md#dd-eng-027) |
| `DD-ENG-093` | [Design §6.6](../appmanager-design-specification-v01.md#_6-6-capability-boundaries-and-providers); [§6.10](../appmanager-design-specification-v01.md#_6-10-modular-typescript-and-future-host-portability) |

### 10.2 Unnumbered occurrence decisions

Section decisions remove duplicate normative bodies while retaining contextual narrative and local delta. Models, workflows, test obligations and semantic distinctions are accounted by §8 and the retained-clause comparisons.

| Occurrence | Direct owner references after reduction |
|---|---|
| DD-1-1 §1 | [Design](../appmanager-design-specification-v01.md#_4-6-presentation-independence); [DD-1.2](../dd_1_application_core/dd-1-2-execution-outcomes-detailed-design-v01.md#_7-outcome-contract) |
| DD-1-1 §6.1 | [FR-INV-007](../functional/application-invocation-functional-specification-v01.md#fr-inv-007) |
| DD-1-1 §6.4 | [Design](../appmanager-design-specification-v01.md#_4-6-presentation-independence) |
| DD-1-1 §8.1 | [FR-INV-003](../functional/application-invocation-functional-specification-v01.md#fr-inv-003) |
| DD-1-1 §8.4 | [Design](../appmanager-design-specification-v01.md#_5-4-command-discovery) |
| DD-1-1 §9.1 | [Design](../appmanager-design-specification-v01.md#_5-4-command-discovery) |
| DD-1-1 §11.3 | [Design](../appmanager-design-specification-v01.md#_4-6-presentation-independence); [FR-INV-022](../functional/application-invocation-functional-specification-v01.md#fr-inv-022); [FR-INV-024](../functional/application-invocation-functional-specification-v01.md#fr-inv-024) |
| DD-1-1 §14.1 | [Design](../appmanager-design-specification-v01.md#_4-6-presentation-independence); [FR-INV-023](../functional/application-invocation-functional-specification-v01.md#fr-inv-023) |
| DD-1-1 §14.5 | [FR-INV-020](../functional/application-invocation-functional-specification-v01.md#fr-inv-020); [FR-INV-022](../functional/application-invocation-functional-specification-v01.md#fr-inv-022) |
| DD-1-1 §15.3 | [DD-1.2](../dd_1_application_core/dd-1-2-execution-outcomes-detailed-design-v01.md#_13-proposed-effects-and-preview); [the caller projection](../dd_1_application_core/dd-1-1-application-invocation-detailed-design-v01.md#dd-outclar-003) |
| DD-1-1 §16.3 | [Design](../appmanager-design-specification-v01.md#_6-2-application-engine-authority) |
| DD-1-1 §17.2 | [DD-1.2](../dd_1_application_core/dd-1-2-execution-outcomes-detailed-design-v01.md#_6-core-status-model); [DD-OUTCLAR-002](../dd_1_application_core/dd-1-1-application-invocation-detailed-design-v01.md#dd-outclar-002); [DD-OUTCLAR-003](../dd_1_application_core/dd-1-1-application-invocation-detailed-design-v01.md#dd-outclar-003) |
| DD-1-1 §18.2 | [DD-1.2](../dd_1_application_core/dd-1-2-execution-outcomes-detailed-design-v01.md#_16-progress-events) |
| DD-1-1 §18.3 | [DD-1.2](../dd_1_application_core/dd-1-2-execution-outcomes-detailed-design-v01.md#_16-progress-events) |
| DD-1-1 §18.4 | [FR-INV-028](../functional/application-invocation-functional-specification-v01.md#fr-inv-028) |
| DD-1-1 §19.1 | [FR-INV-027](../functional/application-invocation-functional-specification-v01.md#fr-inv-027) |
| DD-1-1 §20.3 | [DD-1.2](../dd_1_application_core/dd-1-2-execution-outcomes-detailed-design-v01.md#_17-cancellation-model) |
| DD-1-1 §21.1 | [DD-1.2](../dd_1_application_core/dd-1-2-execution-outcomes-detailed-design-v01.md#_9-diagnostic-model) |
| DD-1-1 §21.2 | [DD-1.2](../dd_1_application_core/dd-1-2-execution-outcomes-detailed-design-v01.md#dd-outclar-006); [canonical code semantics](../dd_1_application_core/dd-1-2-execution-outcomes-detailed-design-v01.md#_9-5-diagnostic-codes) |
| DD-1-1 §21.3 | [FR-INV-039](../functional/application-invocation-functional-specification-v01.md#fr-inv-039); [DD-1.2](../dd_1_application_core/dd-1-2-execution-outcomes-detailed-design-v01.md#_9-diagnostic-model) |
| DD-1-1 §21.4 | [DD-1.2](../dd_1_application_core/dd-1-2-execution-outcomes-detailed-design-v01.md#_24-sensitive-information-and-redaction) |
| DD-1-1 §22.1 | [DD-1.2](../dd_1_application_core/dd-1-2-execution-outcomes-detailed-design-v01.md#_7-outcome-contract) |
| DD-1-1 §22.3 | [DD-1.2](../dd_1_application_core/dd-1-2-execution-outcomes-detailed-design-v01.md#_7-2-result-payload) |
| DD-1-1 §22.4 | [DD-1.2](../dd_1_application_core/dd-1-2-execution-outcomes-detailed-design-v01.md#_18-provider-result-normalization); [sensitive-information handling](../dd_1_application_core/dd-1-2-execution-outcomes-detailed-design-v01.md#_24-sensitive-information-and-redaction) |
| DD-1-1 §23 | [caller projection](../dd_1_application_core/dd-1-1-application-invocation-detailed-design-v01.md#dd-outclar-002); [DD-1.2 child/stage/target results](../dd_1_application_core/dd-1-2-execution-outcomes-detailed-design-v01.md#_14-partial-completion) |
| DD-1-1 §24 | [caller projection](../dd_1_application_core/dd-1-1-application-invocation-detailed-design-v01.md#dd-outclar-002); [DD-1.2 effect information](../dd_1_application_core/dd-1-2-execution-outcomes-detailed-design-v01.md#_12-consequential-effects) |
| DD-1-1 §25.1 | [DD-1.2](../dd_1_application_core/dd-1-2-execution-outcomes-detailed-design-v01.md#_8-execution-evidence-contract) |
| DD-1-1 §25.2 | [Design](../appmanager-design-specification-v01.md#_11-11-workflow-results-failure-and-acceptance) |
| DD-1-1 §25.3 | [DD-1.2](../dd_1_application_core/dd-1-2-execution-outcomes-detailed-design-v01.md#_19-application-level-interpretation); [DD-OUTCLAR-002](../dd_1_application_core/dd-1-1-application-invocation-detailed-design-v01.md#dd-outclar-002) |
| DD-1-1 §26.1 | [FR-INV-049](../functional/application-invocation-functional-specification-v01.md#fr-inv-049) |
| DD-1-1 §26.2 | [FR-INV-049](../functional/application-invocation-functional-specification-v01.md#fr-inv-049) |
| DD-1-1 §26.3 | [FR-INV-048](../functional/application-invocation-functional-specification-v01.md#fr-inv-048) |
| DD-1-1 §27.1 | [FR-INV-050](../functional/application-invocation-functional-specification-v01.md#fr-inv-050) |
| DD-1-1 §28.1 | [Design](../appmanager-design-specification-v01.md#_4-6-presentation-independence) |
| DD-1-1 §28.2 | [Design](../appmanager-design-specification-v01.md#_4-6-presentation-independence); [FR-INV-006](../functional/application-invocation-functional-specification-v01.md#fr-inv-006); [DD-OUTCLAR-002](../dd_1_application_core/dd-1-1-application-invocation-detailed-design-v01.md#dd-outclar-002) |
| DD-1-1 §29.1 | [FR-INV-020](../functional/application-invocation-functional-specification-v01.md#fr-inv-020) |
| DD-1-1 §29.2 | [FR-INV-020](../functional/application-invocation-functional-specification-v01.md#fr-inv-020); [FR-INV-022](../functional/application-invocation-functional-specification-v01.md#fr-inv-022) |
| DD-1-1 §29.3 | [FR-INV-021](../functional/application-invocation-functional-specification-v01.md#fr-inv-021); [DD-OUTCLAR-002](../dd_1_application_core/dd-1-1-application-invocation-detailed-design-v01.md#dd-outclar-002) |
| DD-1-1 §30.2 | [DD-1.2](../dd_1_application_core/dd-1-2-execution-outcomes-detailed-design-v01.md#_7-outcome-contract); [§22 caller projection](../dd_1_application_core/dd-1-1-application-invocation-detailed-design-v01.md#_22-invocation-outcome-projection-contract) |
| DD-1-1 §30.3 | [Design](../appmanager-design-specification-v01.md#_6-2-application-engine-authority); [Design](../appmanager-design-specification-v01.md#_6-6-capability-boundaries-and-providers) |
| DD-1-1 §31 | [DD-1.3 context resolution](../dd_1_application_core/dd-1-3-managed-project-detailed-design-v01.md#_10-managed-project-context-contract); [scope resolution](../dd_1_application_core/dd-1-3-managed-project-detailed-design-v01.md#_18-managed-scope-resolution) |
| DD-1-1 §32 | [DD-1.4 candidate resolution](../dd_1_application_core/dd-1-4-configuration-resolution-detailed-design-v01.md#_9-candidate-model); [effective snapshot](../dd_1_application_core/dd-1-4-configuration-resolution-detailed-design-v01.md#_16-effective-configuration-snapshot) |
| DD-1-1 §33 | [DD-2.5](../dd_2_shared_capabilities/dd-2-5-source-transformation-detailed-design-v01.md); [FR-XFORM-033](../functional/source-transformation-functional-specification-v01.md#fr-xform-033) |
| DD-1-1 §34 | [DD-1.2](../dd_1_application_core/dd-1-2-execution-outcomes-detailed-design-v01.md#_7-2-result-payload); [DD-OUTCLAR-006](../dd_1_application_core/dd-1-2-execution-outcomes-detailed-design-v01.md#dd-outclar-006) |
| DD-1-1 §35.1 | [FR-INV-012](../functional/application-invocation-functional-specification-v01.md#fr-inv-012); [DD-1.2](../dd_1_application_core/dd-1-2-execution-outcomes-detailed-design-v01.md#_9-diagnostic-model) |
| DD-1-1 §35.3 | [DD-1.2](../dd_1_application_core/dd-1-2-execution-outcomes-detailed-design-v01.md#_18-provider-result-normalization) |
| DD-1-1 §36.4 | [DD-1.2](../dd_1_application_core/dd-1-2-execution-outcomes-detailed-design-v01.md#_18-provider-result-normalization); [redaction](../dd_1_application_core/dd-1-2-execution-outcomes-detailed-design-v01.md#_24-sensitive-information-and-redaction) |
| DD-1-1 §39 | Local explanatory binding; see primary |
| DD-1-1 §41.1 | [DD-1.2](../dd_1_application_core/dd-1-2-execution-outcomes-detailed-design-v01.md); [DD-OUTCLAR-002](../dd_1_application_core/dd-1-1-application-invocation-detailed-design-v01.md#dd-outclar-002); [DD-OUTCLAR-003](../dd_1_application_core/dd-1-1-application-invocation-detailed-design-v01.md#dd-outclar-003) |
| DD-1-1 §41.5 | [DD-1.2](../dd_1_application_core/dd-1-2-execution-outcomes-detailed-design-v01.md#_18-provider-result-normalization); [diagnostic refinement](../dd_1_application_core/dd-1-2-execution-outcomes-detailed-design-v01.md#dd-outclar-006) |
| DD-1-1 §43 | Local explanatory binding; see primary |
| DD-1-1 §44 | [The Project Documentation Guide](../project-documentation-guide-v01.md#_8-level-4-implementation-specification) |
| DD-1-2 §1 | [Design](../appmanager-design-specification-v01.md#_11-11-workflow-results-failure-and-acceptance); [DD-1.1](../dd_1_application_core/dd-1-1-application-invocation-detailed-design-v01.md#_22-invocation-outcome-projection-contract) |
| DD-1-2 §8.3 | [Design](../appmanager-design-specification-v01.md#_6-6-capability-boundaries-and-providers); [§18 normalization](../dd_1_application_core/dd-1-2-execution-outcomes-detailed-design-v01.md#_18-provider-result-normalization) |
| DD-1-2 §8.4 | [Design](../appmanager-design-specification-v01.md#_6-2-application-engine-authority) |
| DD-1-2 §10 | [§9](../dd_1_application_core/dd-1-2-execution-outcomes-detailed-design-v01.md#_9-diagnostic-model); [FR-INV-039](../functional/application-invocation-functional-specification-v01.md#fr-inv-039) |
| DD-1-2 §12.4 | [FR-INV-045](../functional/application-invocation-functional-specification-v01.md#fr-inv-045); [FR-INV-046](../functional/application-invocation-functional-specification-v01.md#fr-inv-046) |
| DD-1-2 §14.1 | [FR-INV-036](../functional/application-invocation-functional-specification-v01.md#fr-inv-036) |
| DD-1-2 §14.3 | [§20](../dd_1_application_core/dd-1-2-execution-outcomes-detailed-design-v01.md#_20-outcome-aggregation); [§6 statuses](../dd_1_application_core/dd-1-2-execution-outcomes-detailed-design-v01.md#_6-core-status-model); [§17 cancellation](../dd_1_application_core/dd-1-2-execution-outcomes-detailed-design-v01.md#_17-cancellation-model); [§15 no-op states](../dd_1_application_core/dd-1-2-execution-outcomes-detailed-design-v01.md#_15-no-op-already-satisfied-skipped-and-not-attempted-states) |
| DD-1-2 §16.4 | [FR-INV-028](../functional/application-invocation-functional-specification-v01.md#fr-inv-028); [§7](../dd_1_application_core/dd-1-2-execution-outcomes-detailed-design-v01.md#_7-outcome-contract) |
| DD-1-2 §17.3 | [FR-INV-031](../functional/application-invocation-functional-specification-v01.md#fr-inv-031) |
| DD-1-2 §17.4 | [FR-INV-031](../functional/application-invocation-functional-specification-v01.md#fr-inv-031) |
| DD-1-2 §17.5 | [FR-INV-032](../functional/application-invocation-functional-specification-v01.md#fr-inv-032); [§12.4](../dd_1_application_core/dd-1-2-execution-outcomes-detailed-design-v01.md#_12-4-no-false-rollback) |
| DD-1-2 §18.1 | [Design](../appmanager-design-specification-v01.md#_6-6-capability-boundaries-and-providers) |
| DD-1-2 §19.1 | [Design](../appmanager-design-specification-v01.md#_11-11-workflow-results-failure-and-acceptance); [§6](../dd_1_application_core/dd-1-2-execution-outcomes-detailed-design-v01.md#_6-core-status-model) |
| DD-1-2 §20.3 | [FR-INV-036](../functional/application-invocation-functional-specification-v01.md#fr-inv-036); [FR-INV-045](../functional/application-invocation-functional-specification-v01.md#fr-inv-045); [FR-INV-046](../functional/application-invocation-functional-specification-v01.md#fr-inv-046); [child model](../dd_1_application_core/dd-1-2-execution-outcomes-detailed-design-v01.md#_14-2-child-result-model); [cancellation model](../dd_1_application_core/dd-1-2-execution-outcomes-detailed-design-v01.md#_17-cancellation-model); [subordinate-state distinctions](../dd_1_application_core/dd-1-2-execution-outcomes-detailed-design-v01.md#_15-no-op-already-satisfied-skipped-and-not-attempted-states) |
| DD-1-2 §22 | [FR-INV-048](../functional/application-invocation-functional-specification-v01.md#fr-inv-048); [FR-INV-049](../functional/application-invocation-functional-specification-v01.md#fr-inv-049) |
| DD-1-2 §25.1 | [DD-1.1 invocation identity](../dd_1_application_core/dd-1-1-application-invocation-detailed-design-v01.md#_7-invocation-identity-and-correlation) |
| DD-1-2 §27.1 | [DD-OUTCLAR-002](../dd_1_application_core/dd-1-1-application-invocation-detailed-design-v01.md#dd-outclar-002) |
| DD-1-2 §27.2 | [DD-OUTCLAR-002](../dd_1_application_core/dd-1-1-application-invocation-detailed-design-v01.md#dd-outclar-002); [DD-OUTCLAR-003](../dd_1_application_core/dd-1-1-application-invocation-detailed-design-v01.md#dd-outclar-003); [DD-OUTCLAR-006](../dd_1_application_core/dd-1-2-execution-outcomes-detailed-design-v01.md#dd-outclar-006); [§24](../dd_1_application_core/dd-1-2-execution-outcomes-detailed-design-v01.md#_24-sensitive-information-and-redaction); [FR-INV-039](../functional/application-invocation-functional-specification-v01.md#fr-inv-039); [FR-INV-049](../functional/application-invocation-functional-specification-v01.md#fr-inv-049) |
| DD-1-2 §31.1 | [DD-1.1](../dd_1_application_core/dd-1-1-application-invocation-detailed-design-v01.md); [projection contract](../dd_1_application_core/dd-1-1-application-invocation-detailed-design-v01.md#_22-invocation-outcome-projection-contract) |
| DD-1-2 §33 | [§7.2](../dd_1_application_core/dd-1-2-execution-outcomes-detailed-design-v01.md#_7-2-result-payload); [DD-OUTCLAR-006](../dd_1_application_core/dd-1-2-execution-outcomes-detailed-design-v01.md#dd-outclar-006); [Design](../appmanager-design-specification-v01.md#_11-11-workflow-results-failure-and-acceptance); [§15](../dd_1_application_core/dd-1-2-execution-outcomes-detailed-design-v01.md#_15-no-op-already-satisfied-skipped-and-not-attempted-states); [FR-INV-048](../functional/application-invocation-functional-specification-v01.md#fr-inv-048) |
| DD-1-2 §34 | Local explanatory binding; see primary |
| DD-1-2 §37 | Local explanatory binding; see primary |
| DD-1-2 §39 | [the Implementation Specification boundary](../project-documentation-guide-v01.md#_8-level-4-implementation-specification) |
| DD-1-3 §1 | [Design](../appmanager-design-specification-v01.md#_9-6-project-discovery-and-context-resolution); [Design](../appmanager-design-specification-v01.md#_9-9-non-destructive-ownership-and-unmanaged-content); [DD-1.4 stage-eligibility contract](../dd_1_application_core/dd-1-4-configuration-resolution-detailed-design-v01.md#_8-resolution-context); [DD-1.5](../dd_1_application_core/dd-1-5-application-engine-detailed-design-v01.md#_8-orchestration-lifecycle); [§29](../dd_1_application_core/dd-1-3-managed-project-detailed-design-v01.md#_29-relationship-to-configuration-resolution) |
| DD-1-3 §4 | [DD-1.5 §8](../dd_1_application_core/dd-1-5-application-engine-detailed-design-v01.md#_8-orchestration-lifecycle); [DD-1.4 §8](../dd_1_application_core/dd-1-4-configuration-resolution-detailed-design-v01.md#_8-resolution-context); [Design](../appmanager-design-specification-v01.md#_9-6-project-discovery-and-context-resolution) |
| DD-1-3 §9.2 | [FR-PROJ-009](../functional/managed-project-functional-specification-v01.md#fr-proj-009); [FR-PROJ-006](../functional/managed-project-functional-specification-v01.md#fr-proj-006) |
| DD-1-3 §11.1 | [FR-PROJ-014](../functional/managed-project-functional-specification-v01.md#fr-proj-014) |
| DD-1-3 §11.3 | [FR-PROJ-035](../functional/managed-project-functional-specification-v01.md#fr-proj-035); [FR-INV-011](../functional/application-invocation-functional-specification-v01.md#fr-inv-011) |
| DD-1-3 §13.3 | [FR-PROJ-018](../functional/managed-project-functional-specification-v01.md#fr-proj-018) |
| DD-1-3 §14.1 | [DD-2.3](../dd_2_shared_capabilities/dd-2-3-repository-capability-detailed-design-v01.md); [Design](../appmanager-design-specification-v01.md#_9-6-project-discovery-and-context-resolution) |
| DD-1-3 §14.3 | [FR-PROJ-028](../functional/managed-project-functional-specification-v01.md#fr-proj-028) |
| DD-1-3 §15.3 | [Design](../appmanager-design-specification-v01.md#_9-1-managed-project-model) |
| DD-1-3 §16.3 | [FR-PROJ-052](../functional/managed-project-functional-specification-v01.md#fr-proj-052) |
| DD-1-3 §21.3 | [Design](../appmanager-design-specification-v01.md#_9-9-non-destructive-ownership-and-unmanaged-content) |
| DD-1-3 §22.1 | [FR-PROJ-060](../functional/managed-project-functional-specification-v01.md#fr-proj-060) |
| DD-1-3 §22.3 | [FR-PROJ-060](../functional/managed-project-functional-specification-v01.md#fr-proj-060); [DD-1.2 child results](../dd_1_application_core/dd-1-2-execution-outcomes-detailed-design-v01.md#_14-partial-completion) |
| DD-1-3 §23.2 | [FR-PROJ-032](../functional/managed-project-functional-specification-v01.md#fr-proj-032) |
| DD-1-3 §23.3 | [Design](../appmanager-design-specification-v01.md#_4-6-presentation-independence) |
| DD-1-3 §28 | [DD-1.2 sensitivity handling](../dd_1_application_core/dd-1-2-execution-outcomes-detailed-design-v01.md#_24-sensitive-information-and-redaction) |
| DD-1-3 §31 | [DD-1.2 diagnostics](../dd_1_application_core/dd-1-2-execution-outcomes-detailed-design-v01.md#_9-diagnostic-model); [Design](../appmanager-design-specification-v01.md#_11-11-workflow-results-failure-and-acceptance) |
| DD-1-3 §32 | [DD-1.5 orchestration](../dd_1_application_core/dd-1-5-application-engine-detailed-design-v01.md#_8-orchestration-lifecycle); [Design](../appmanager-design-specification-v01.md#_6-2-application-engine-authority) |
| DD-1-3 §33.1 | [DD-2.1](../dd_2_shared_capabilities/dd-2-1-resource-access-detailed-design-v01.md) |
| DD-1-3 §33.2 | [DD-2.3](../dd_2_shared_capabilities/dd-2-3-repository-capability-detailed-design-v01.md) |
| DD-1-3 §33.3 | [DD-2.10](../dd_2_shared_capabilities/dd-2-10-nuxt-capability-detailed-design-v01.md) |
| DD-1-3 §33.4 | [DD-2.4](../dd_2_shared_capabilities/dd-2-4-source-intelligence-detailed-design-v01.md) |
| DD-1-3 §35 | Local explanatory binding; see primary |
| DD-1-3 §39 | [DD-1.5](../dd_1_application_core/dd-1-5-application-engine-detailed-design-v01.md#_8-orchestration-lifecycle) |
| DD-1-3 §40 | Local explanatory binding; see primary |
| DD-1-3 §41 | [§19](../dd_1_application_core/dd-1-3-managed-project-detailed-design-v01.md#_19-recognition-scope-targetability-and-mutability) |
| DD-1-4 §1 | [Design](../appmanager-design-specification-v01.md#_6-2-application-engine-authority); [§8](../dd_1_application_core/dd-1-4-configuration-resolution-detailed-design-v01.md#_8-resolution-context); [Engine lifecycle](../dd_1_application_core/dd-1-5-application-engine-detailed-design-v01.md#_8-orchestration-lifecycle) |
| DD-1-4 §6.3 | [FR-CONFIG-063](../functional/configuration-functional-specification-v01.md#fr-config-063); [FR-CONFIG-017](../functional/configuration-functional-specification-v01.md#fr-config-017) |
| DD-1-4 §7.1 | [FR-CONFIG-005](../functional/configuration-functional-specification-v01.md#fr-config-005) |
| DD-1-4 §8.2 | [FR-CONFIG-066](../functional/configuration-functional-specification-v01.md#fr-config-066) |
| DD-1-4 §8.4 | [FR-CONFIG-064](../functional/configuration-functional-specification-v01.md#fr-config-064); [Design](../appmanager-design-specification-v01.md#_9-6-project-discovery-and-context-resolution); [§8.3 eligibility boundary](../dd_1_application_core/dd-1-4-configuration-resolution-detailed-design-v01.md#_8-3-bootstrap-resolution-dependency) |
| DD-1-4 §8.5 | [DD-CORE-BOOT-003](../dd_1_application_core/dd-1-4-configuration-resolution-detailed-design-v01.md#dd-core-boot-003); [DD-1.5 scope checkpoint](../dd_1_application_core/dd-1-5-application-engine-detailed-design-v01.md#dd-core-boot-009); [Design §9.7](../appmanager-design-specification-v01.md#_9-7-managed-scope-and-operation-targeting) |
| DD-1-4 §9.1 | [Design](../appmanager-design-specification-v01.md#_8-2-configuration-resolution-and-effective-configuration); [§15](../dd_1_application_core/dd-1-4-configuration-resolution-detailed-design-v01.md#_15-resolution-result) |
| DD-1-4 §9.4 | [FR-CONFIG-027](../functional/configuration-functional-specification-v01.md#fr-config-027) |
| DD-1-4 §10.3 | [FR-CONFIG-018](../functional/configuration-functional-specification-v01.md#fr-config-018); [§8](../dd_1_application_core/dd-1-4-configuration-resolution-detailed-design-v01.md#_8-resolution-context) |
| DD-1-4 §12.3 | [FR-CONFIG-024](../functional/configuration-functional-specification-v01.md#fr-config-024) |
| DD-1-4 §12.5 | [FR-CONFIG-012](../functional/configuration-functional-specification-v01.md#fr-config-012); [FR-CONFIG-013](../functional/configuration-functional-specification-v01.md#fr-config-013) |
| DD-1-4 §13.3 | [FR-CONFIG-018](../functional/configuration-functional-specification-v01.md#fr-config-018) |
| DD-1-4 §13.4 | [FR-CONFIG-013](../functional/configuration-functional-specification-v01.md#fr-config-013) |
| DD-1-4 §13.5 | [FR-CONFIG-029](../functional/configuration-functional-specification-v01.md#fr-config-029) |
| DD-1-4 §13.6 | [Design](../appmanager-design-specification-v01.md#_8-4-separation-of-resolution-and-interaction) |
| DD-1-4 §14.1 | [FR-CONFIG-016](../functional/configuration-functional-specification-v01.md#fr-config-016); [FR-CONFIG-022](../functional/configuration-functional-specification-v01.md#fr-config-022) |
| DD-1-4 §14.3 | [Design](../appmanager-design-specification-v01.md#_6-2-application-engine-authority); [§25](../dd_1_application_core/dd-1-4-configuration-resolution-detailed-design-v01.md#_25-persistence-boundary); [§31.3](../dd_1_application_core/dd-1-4-configuration-resolution-detailed-design-v01.md#_31-3-authorization-independence) |
| DD-1-4 §15.3 | [FR-CONFIG-033](../functional/configuration-functional-specification-v01.md#fr-config-033) |
| DD-1-4 §16.1 | [DD-CORE-BOOT-005](../dd_1_application_core/dd-1-4-configuration-resolution-detailed-design-v01.md#dd-core-boot-005) |
| DD-1-4 §16.3 | [FR-CONFIG-051](../functional/configuration-functional-specification-v01.md#fr-config-051); [FR-CONFIG-050](../functional/configuration-functional-specification-v01.md#fr-config-050) |
| DD-1-4 §17.2 | [FR-CONFIG-032](../functional/configuration-functional-specification-v01.md#fr-config-032); [DD-1.2 partial results](../dd_1_application_core/dd-1-2-execution-outcomes-detailed-design-v01.md#_14-partial-completion) |
| DD-1-4 §18.2 | [FR-CONFIG-046](../functional/configuration-functional-specification-v01.md#fr-config-046) |
| DD-1-4 §18.3 | [FR-CONFIG-045](../functional/configuration-functional-specification-v01.md#fr-config-045) |
| DD-1-4 §19.2 | [Design](../appmanager-design-specification-v01.md#_4-6-presentation-independence) |
| DD-1-4 §19.3 | [§22 sensitivity handling](../dd_1_application_core/dd-1-4-configuration-resolution-detailed-design-v01.md#_22-sensitive-configuration) |
| DD-1-4 §20.1 | [Design](../appmanager-design-specification-v01.md#_8-4-separation-of-resolution-and-interaction) |
| DD-1-4 §20.3 | [FR-CONFIG-038](../functional/configuration-functional-specification-v01.md#fr-config-038); [DD-1.2 cancellation](../dd_1_application_core/dd-1-2-execution-outcomes-detailed-design-v01.md#_17-cancellation-model) |
| DD-1-4 §20.4 | [FR-CONFIG-047](../functional/configuration-functional-specification-v01.md#fr-config-047); [FR-CONFIG-048](../functional/configuration-functional-specification-v01.md#fr-config-048) |
| DD-1-4 §21.1 | [FR-INV-020](../functional/application-invocation-functional-specification-v01.md#fr-inv-020) |
| DD-1-4 §21.2 | [FR-INV-020](../functional/application-invocation-functional-specification-v01.md#fr-inv-020); [FR-CONFIG-034](../functional/configuration-functional-specification-v01.md#fr-config-034) |
| DD-1-4 §21.3 | [FR-CONFIG-041](../functional/configuration-functional-specification-v01.md#fr-config-041) |
| DD-1-4 §22.1 | [Design](../appmanager-design-specification-v01.md#_8-7-sensitive-configuration) |
| DD-1-4 §22.3 | [Design](../appmanager-design-specification-v01.md#_8-7-sensitive-configuration); [DD-1.2 redaction](../dd_1_application_core/dd-1-2-execution-outcomes-detailed-design-v01.md#_24-sensitive-information-and-redaction) |
| DD-1-4 §22.5 | [Design](../appmanager-design-specification-v01.md#_8-1-configuration-model) |
| DD-1-4 §23.2 | [§18 provenance](../dd_1_application_core/dd-1-4-configuration-resolution-detailed-design-v01.md#_18-provenance); [§19 explanation](../dd_1_application_core/dd-1-4-configuration-resolution-detailed-design-v01.md#_19-explainability) |
| DD-1-4 §23.3 | [FR-CONFIG-024](../functional/configuration-functional-specification-v01.md#fr-config-024); [FR-CONFIG-028](../functional/configuration-functional-specification-v01.md#fr-config-028) |
| DD-1-4 §24.1 | [FR-CONFIG-072](../functional/configuration-functional-specification-v01.md#fr-config-072) |
| DD-1-4 §24.3 | [Design](../appmanager-design-specification-v01.md#_8-4-separation-of-resolution-and-interaction) |
| DD-1-4 §25.1 | [Settings](../dd_4_policy_and_resource_domains/dd-4-2-settings-domain-detailed-design-v01.md); [FR-CONFIG-047](../functional/configuration-functional-specification-v01.md#fr-config-047); [FR-CONFIG-075](../functional/configuration-functional-specification-v01.md#fr-config-075) |
| DD-1-4 §25.2 | [FR-CONFIG-047](../functional/configuration-functional-specification-v01.md#fr-config-047); [FR-CONFIG-049](../functional/configuration-functional-specification-v01.md#fr-config-049) |
| DD-1-4 §25.3 | [FR-CONFIG-060](../functional/configuration-functional-specification-v01.md#fr-config-060) |
| DD-1-4 §25.4 | [FR-CONFIG-075](../functional/configuration-functional-specification-v01.md#fr-config-075) |
| DD-1-4 §26.1 | [Design](../appmanager-design-specification-v01.md#_8-8-configuration-state-reports-and-logs) |
| DD-1-4 §26.2 | [Design](../appmanager-design-specification-v01.md#_8-8-configuration-state-reports-and-logs) |
| DD-1-4 §27.1 | [FR-CONFIG-050](../functional/configuration-functional-specification-v01.md#fr-config-050) |
| DD-1-4 §27.3 | [FR-CONFIG-051](../functional/configuration-functional-specification-v01.md#fr-config-051) |
| DD-1-4 §29.3 | [§22](../dd_1_application_core/dd-1-4-configuration-resolution-detailed-design-v01.md#_22-sensitive-configuration); [DD-1.2 redaction](../dd_1_application_core/dd-1-2-execution-outcomes-detailed-design-v01.md#_24-sensitive-information-and-redaction) |
| DD-1-4 §30.1 | [DD-1.2 diagnostics](../dd_1_application_core/dd-1-2-execution-outcomes-detailed-design-v01.md#_9-diagnostic-model); [local-refinement rule](../dd_1_application_core/dd-1-2-execution-outcomes-detailed-design-v01.md#dd-outclar-006) |
| DD-1-4 §30.3 | [FR-INV-039](../functional/application-invocation-functional-specification-v01.md#fr-inv-039) |
| DD-1-4 §31.1 | [FR-CONFIG-012](../functional/configuration-functional-specification-v01.md#fr-config-012); [FR-CONFIG-013](../functional/configuration-functional-specification-v01.md#fr-config-013) |
| DD-1-4 §31.2 | [§18 provenance](../dd_1_application_core/dd-1-4-configuration-resolution-detailed-design-v01.md#_18-provenance) |
| DD-1-4 §33.1 | [Design](../appmanager-design-specification-v01.md#_8-1-configuration-model) |
| DD-1-4 §33.2 | [FR-CONFIG-020](../functional/configuration-functional-specification-v01.md#fr-config-020) |
| DD-1-4 §35.2 | [FR-CONFIG-023](../functional/configuration-functional-specification-v01.md#fr-config-023) |
| DD-1-4 §36 | [Design](../appmanager-design-specification-v01.md#_4-6-presentation-independence); [§8 staging rules](../dd_1_application_core/dd-1-4-configuration-resolution-detailed-design-v01.md#_8-resolution-context); [§20 re-entry model](../dd_1_application_core/dd-1-4-configuration-resolution-detailed-design-v01.md#_20-interactive-acquisition) |
| DD-1-4 §39 | Local explanatory binding; see primary |
| DD-1-4 §41.3 | [DD-1.3](../dd_1_application_core/dd-1-3-managed-project-detailed-design-v01.md#_29-relationship-to-configuration-resolution); [§8](../dd_1_application_core/dd-1-4-configuration-resolution-detailed-design-v01.md#_8-resolution-context); [DD-1.5 §8](../dd_1_application_core/dd-1-5-application-engine-detailed-design-v01.md#_8-orchestration-lifecycle) |
| DD-1-4 §41.4 | [DD-1.5 §8](../dd_1_application_core/dd-1-5-application-engine-detailed-design-v01.md#_8-orchestration-lifecycle) |
| DD-1-4 §41.5 | [FR-CONFIG-020](../functional/configuration-functional-specification-v01.md#fr-config-020); [FR-CONFIG-007](../functional/configuration-functional-specification-v01.md#fr-config-007) |
| DD-1-4 §41.6 | [DD-4.2 Settings](../dd_4_policy_and_resource_domains/dd-4-2-settings-domain-detailed-design-v01.md); [FR-CONFIG-075](../functional/configuration-functional-specification-v01.md#fr-config-075) |
| DD-1-4 §43 | [FR-CONFIG-017](../functional/configuration-functional-specification-v01.md#fr-config-017); [FR-CONFIG-020](../functional/configuration-functional-specification-v01.md#fr-config-020) |
| DD-1-4 §44 | Local explanatory binding; see primary |
| DD-1-4 §45 | Local explanatory binding; see primary |
| DD-1-5 §1 | [Design §6.2](../appmanager-design-specification-v01.md#_6-2-application-engine-authority); [Design §6.6](../appmanager-design-specification-v01.md#_6-6-capability-boundaries-and-providers) |
| DD-1-5 §4.1 | [Design §6.2](../appmanager-design-specification-v01.md#_6-2-application-engine-authority); [DD-ENG-048](../dd_1_application_core/dd-1-5-application-engine-detailed-design-v01.md#dd-eng-048) |
| DD-1-5 §4.2 | [DD-1.1](../dd_1_application_core/dd-1-1-application-invocation-detailed-design-v01.md); [Design §4.6](../appmanager-design-specification-v01.md#_4-6-presentation-independence) |
| DD-1-5 §4.3 | [Design §11.11](../appmanager-design-specification-v01.md#_11-11-workflow-results-failure-and-acceptance); [DD-1.2 normalization boundary](../dd_1_application_core/dd-1-2-execution-outcomes-detailed-design-v01.md#_18-provider-result-normalization) |
| DD-1-5 §23 | [Design §6.2](../appmanager-design-specification-v01.md#_6-2-application-engine-authority) |
| DD-1-5 §24.6 | [AI Capability](../dd_2_shared_capabilities/dd-2-7-ai-capability-detailed-design-v01.md); [Design §10.6](../appmanager-design-specification-v01.md#_10-6-ai-domain); [§11.10](../appmanager-design-specification-v01.md#_11-10-ai-assisted-workflow) |
| DD-1-5 §25 | [DD-ENG-005](../dd_1_application_core/dd-1-5-application-engine-detailed-design-v01.md#dd-eng-005); [execution context](../dd_1_application_core/dd-1-5-application-engine-detailed-design-v01.md#dd-eng-003); [command extension contract](../dd_1_application_core/dd-1-5-application-engine-detailed-design-v01.md#dd-eng-094); [Maintenance stronger-owner gate](../dd_4_policy_and_resource_domains/dd-4-4-utils-domain-detailed-design-v01.md#dd-util-066) |
| DD-1-5 §27 | [execution context](../dd_1_application_core/dd-1-5-application-engine-detailed-design-v01.md#dd-eng-003); [use-case workflow](../dd_1_application_core/dd-1-5-application-engine-detailed-design-v01.md#dd-eng-005); [bounded delegation](../dd_1_application_core/dd-1-5-application-engine-detailed-design-v01.md#dd-eng-035); [stale-state checkpoint](../dd_1_application_core/dd-1-5-application-engine-detailed-design-v01.md#dd-eng-024); [extension contract](../dd_1_application_core/dd-1-5-application-engine-detailed-design-v01.md#dd-eng-094); [documentation reading conventions](../project-documentation-guide-v01.md#detailed-design-reading-conventions) |
| DD-1-5 §29 | [§23](../dd_1_application_core/dd-1-5-application-engine-detailed-design-v01.md#_23-application-engine-conformance-invariants); [§28](../dd_1_application_core/dd-1-5-application-engine-detailed-design-v01.md#_28-implementation-specification-boundary) |
| DD-3-1 §1 | [App Functional contracts](../functional/app-functional-specification-v01.md); [Design §6.2](../appmanager-design-specification-v01.md#_6-2-application-engine-authority); [§6.6](../appmanager-design-specification-v01.md#_6-6-capability-boundaries-and-providers) |
| DD-3-2 §1 | [Git Functional contracts](../functional/git-functional-specification-v01.md); [Design §6.2](../appmanager-design-specification-v01.md#_6-2-application-engine-authority); [§6.6](../appmanager-design-specification-v01.md#_6-6-capability-boundaries-and-providers) |
| DD-3-3 §1 | [Nuxt Functional contracts](../functional/nuxt-functional-specification-v01.md); [Design §6.2](../appmanager-design-specification-v01.md#_6-2-application-engine-authority); [§6.6](../appmanager-design-specification-v01.md#_6-6-capability-boundaries-and-providers) |
| DD-3-4 §1 | [Docs Functional contracts](../functional/docs-functional-specification-v01.md); [FR-DOCS-037](../functional/docs-functional-specification-v01.md#fr-docs-037); [FR-DOCS-079](../functional/docs-functional-specification-v01.md#fr-docs-079); [Design §6.2](../appmanager-design-specification-v01.md#_6-2-application-engine-authority); [§6.6](../appmanager-design-specification-v01.md#_6-6-capability-boundaries-and-providers) |
| DD-4-1 §1 | [Quality Functional contracts](../functional/quality-functional-specification-v01.md); [Design §6.2](../appmanager-design-specification-v01.md#_6-2-application-engine-authority); [§6.6](../appmanager-design-specification-v01.md#_6-6-capability-boundaries-and-providers) |
| DD-4-2 §1 | [Settings Functional contracts](../functional/settings-functional-specification-v01.md); [Configuration Resolution](../dd_1_application_core/dd-1-4-configuration-resolution-detailed-design-v01.md); [Design §6.2](../appmanager-design-specification-v01.md#_6-2-application-engine-authority); [§6.6](../appmanager-design-specification-v01.md#_6-6-capability-boundaries-and-providers) |
| DD-4-3 §1 | [AI Functional contracts](../functional/ai-functional-specification-v01.md); [AI Capability](../dd_2_shared_capabilities/dd-2-7-ai-capability-detailed-design-v01.md); [Design §11.10](../appmanager-design-specification-v01.md#_11-10-ai-assisted-workflow); [Design §6.2](../appmanager-design-specification-v01.md#_6-2-application-engine-authority); [§6.6](../appmanager-design-specification-v01.md#_6-6-capability-boundaries-and-providers) |
| DD-4-4 §1 | [Maintenance Functional contracts](../functional/utils-functional-specification-v01.md); [stronger-owner gate](../dd_4_policy_and_resource_domains/dd-4-4-utils-domain-detailed-design-v01.md#dd-util-066); [Design §6.2](../appmanager-design-specification-v01.md#_6-2-application-engine-authority); [§6.6](../appmanager-design-specification-v01.md#_6-6-capability-boundaries-and-providers) |
| DD-4-2 §19 | Local explanatory binding; see primary |
| DD-4-3 §19 | Local explanatory binding; see primary |
| DD-4-4 §19 | Local explanatory binding; see primary |
| DD-2-1 §4.1 | [Design §6.6](../appmanager-design-specification-v01.md#_6-6-capability-boundaries-and-providers) |
| DD-2-1 §16.1 | [§15](../dd_2_shared_capabilities/dd-2-1-resource-access-detailed-design-v01.md#_15-mutation-preconditions); [Engine stale-state checkpoint](../dd_1_application_core/dd-1-5-application-engine-detailed-design-v01.md#dd-eng-024); [invocation retry contract](../functional/application-invocation-functional-specification-v01.md#fr-inv-048) |
| DD-2-1 §35.3 | [Documentation Guide](../project-documentation-guide-v01.md#_8-level-4-implementation-specification) |
| DD-2-2 §4.1 | [Design §6.6](../appmanager-design-specification-v01.md#_6-6-capability-boundaries-and-providers) |
| DD-2-2 §4.3 | [Engine delegation contract](../dd_1_application_core/dd-1-5-application-engine-detailed-design-v01.md#dd-eng-035); [application interpretation](../dd_1_application_core/dd-1-2-execution-outcomes-detailed-design-v01.md#_19-application-level-interpretation) |
| DD-2-2 §34.1 | [Repository Capability](../dd_2_shared_capabilities/dd-2-3-repository-capability-detailed-design-v01.md) |
| DD-2-2 §34.2 | [Quality Capability](../dd_2_shared_capabilities/dd-2-8-quality-capability-detailed-design-v01.md) |
| DD-2-2 §34.3 | [Documentation Capability](../dd_2_shared_capabilities/dd-2-9-documentation-capability-detailed-design-v01.md) |
| DD-2-2 §34.4 | [Nuxt Capability](../dd_2_shared_capabilities/dd-2-10-nuxt-capability-detailed-design-v01.md) |
| DD-2-2 §34.5 | [AI Capability](../dd_2_shared_capabilities/dd-2-7-ai-capability-detailed-design-v01.md) |
| DD-2-2 §26 introduction | [technical completion model](../dd_2_shared_capabilities/dd-2-2-process-execution-detailed-design-v01.md#_15-1-technical-completion-model); [events](../dd_2_shared_capabilities/dd-2-2-process-execution-detailed-design-v01.md#_21-output-and-progress-events); [local diagnostics](../dd_2_shared_capabilities/dd-2-2-process-execution-detailed-design-v01.md#_22-diagnostics); [DD-1.2 evidence normalization](../dd_1_application_core/dd-1-2-execution-outcomes-detailed-design-v01.md#_18-provider-result-normalization) |
| DD-2-2 §34 introduction | [Documentation Guide reading conventions](../project-documentation-guide-v01.md#detailed-design-reading-conventions) |
| DD-2-3 §4.1 | [Git domain](../dd_3_high_coupling_domains/dd-3-2-git-domain-detailed-design-v01.md); [Design §6.6](../appmanager-design-specification-v01.md#_6-6-capability-boundaries-and-providers) |
| DD-2-3 §41.2 | [Git domain](../dd_3_high_coupling_domains/dd-3-2-git-domain-detailed-design-v01.md) |
| DD-2-3 §41.3 | [App](../dd_3_high_coupling_domains/dd-3-1-app-domain-detailed-design-v01.md); [Nuxt](../dd_3_high_coupling_domains/dd-3-3-nuxt-domain-detailed-design-v01.md) |
| DD-2-4 §40.1 | [Source Transformation](../dd_2_shared_capabilities/dd-2-5-source-transformation-detailed-design-v01.md); [Design §7.9](../appmanager-design-specification-v01.md#_7-9-inspection-and-mutation-separation) |
| DD-2-4 §40.2 | [Documentation](../dd_2_shared_capabilities/dd-2-9-documentation-capability-detailed-design-v01.md); [Nuxt](../dd_2_shared_capabilities/dd-2-10-nuxt-capability-detailed-design-v01.md); [Quality](../dd_2_shared_capabilities/dd-2-8-quality-capability-detailed-design-v01.md); [AI](../dd_2_shared_capabilities/dd-2-7-ai-capability-detailed-design-v01.md) |
| DD-2-5 §4.3 | [Engine delegation contract](../dd_1_application_core/dd-1-5-application-engine-detailed-design-v01.md#dd-eng-035); [application interpretation](../dd_1_application_core/dd-1-2-execution-outcomes-detailed-design-v01.md#_19-application-level-interpretation) |
| DD-2-5 §46.4 | [Settings](../dd_4_policy_and_resource_domains/dd-4-2-settings-domain-detailed-design-v01.md); [Maintenance](../dd_4_policy_and_resource_domains/dd-4-4-utils-domain-detailed-design-v01.md); [AI proposals](../appmanager-design-specification-v01.md#_11-10-ai-assisted-workflow) |
| DD-2-6 §28.4 | [AI domain resource workflows](../dd_4_policy_and_resource_domains/dd-4-3-ai-domain-detailed-design-v01.md#resource-family-lifecycle); [Design §11.10](../appmanager-design-specification-v01.md#_11-10-ai-assisted-workflow) |
| DD-2-6 §43.1 | [AI Capability](../dd_2_shared_capabilities/dd-2-7-ai-capability-detailed-design-v01.md); [Design §11.10](../appmanager-design-specification-v01.md#_11-10-ai-assisted-workflow) |
| DD-2-7 §23.2 introduction | [Resource Access bounded request](../dd_2_shared_capabilities/dd-2-1-resource-access-detailed-design-v01.md#_9-bounded-resource-request-contract); [DD-ENG-035](../dd_1_application_core/dd-1-5-application-engine-detailed-design-v01.md#dd-eng-035) |
| DD-2-7 §23.5 introduction | [Process Execution](../dd_2_shared_capabilities/dd-2-2-process-execution-detailed-design-v01.md) |
| DD-2-7 §23.6 introduction | [FR-CONFIG-020](../functional/configuration-functional-specification-v01.md#fr-config-020); [DD-1.4](../dd_1_application_core/dd-1-4-configuration-resolution-detailed-design-v01.md) |
| DD-2-7 §31.1 introduction | [Quality AI interpretation contract](../dd_2_shared_capabilities/dd-2-8-quality-capability-detailed-design-v01.md#_26-relationship-to-ai-capability) |
| DD-2-7 §31.4 introduction | [AI domain](../dd_4_policy_and_resource_domains/dd-4-3-ai-domain-detailed-design-v01.md#resource-graph); [Design §10.6](../appmanager-design-specification-v01.md#_10-6-ai-domain) |
| DD-2-8 §34.1 introduction | [Documentation Capability](../dd_2_shared_capabilities/dd-2-9-documentation-capability-detailed-design-v01.md) |
| DD-2-8 §34.3 introduction | [Quality domain](../dd_4_policy_and_resource_domains/dd-4-1-quality-domain-detailed-design-v01.md); [Design §10.11](../appmanager-design-specification-v01.md#_10-11-cross-domain-workflows) |
| DD-2-9 §27.1 introduction | [Resource Access bounded request](../dd_2_shared_capabilities/dd-2-1-resource-access-detailed-design-v01.md#_9-bounded-resource-request-contract) |
| DD-2-9 §27.6 introduction | [Process Execution](../dd_2_shared_capabilities/dd-2-2-process-execution-detailed-design-v01.md) |
| DD-2-9 §27.7 introduction | [Quality criterion and gate contracts](../dd_2_shared_capabilities/dd-2-8-quality-capability-detailed-design-v01.md) |
| DD-2-9 §35.1 introduction | [Nuxt Capability](../dd_2_shared_capabilities/dd-2-10-nuxt-capability-detailed-design-v01.md) |
| DD-2-9 §35.2 introduction | [Docs domain](../dd_3_high_coupling_domains/dd-3-4-docs-domain-detailed-design-v01.md); [Design §10.11](../appmanager-design-specification-v01.md#_10-11-cross-domain-workflows) |
| DD-2-10 §37.1 introduction | [Nuxt domain](../dd_3_high_coupling_domains/dd-3-3-nuxt-domain-detailed-design-v01.md); [§16](../dd_2_shared_capabilities/dd-2-10-nuxt-capability-detailed-design-v01.md#_16-layer-scaffolding-and-resource-registry) |
| DD-1-2 §13 | [FR-INV-025](../functional/application-invocation-functional-specification-v01.md#fr-inv-025); [FR-INV-026](../functional/application-invocation-functional-specification-v01.md#fr-inv-026) |
| DD-1-2 §9.5 | [DD-OUTCLAR-006](../dd_1_application_core/dd-1-2-execution-outcomes-detailed-design-v01.md#dd-outclar-006) |

### 10.3 Final downstream navigation accounting

The final retirement sweep includes bare source labels as well as hyperlinks. Nine Level-4 files are touched, including the navigation index and two still-active Implementation clarifications. Only metadata links and the following dependency/traceability labels change; all remaining text below metadata is byte-identical after reversing these exact source-label replacements. No Implementation requirement or clarification is reduced or retired.

| File | Navigation-only change |
|---|---|
| [app-command-model-implementation-clarification-v01.md](../implementation/clarifications/app-command-model-implementation-clarification-v01.md) | Metadata source links only. |
| [nuxt-command-model-implementation-clarification-v01.md](../implementation/clarifications/nuxt-command-model-implementation-clarification-v01.md) | Metadata source links only. |
| [implementation-specification-v01.md](../implementation/implementation-specification-v01.md) | Metadata/source navigation where applicable; 1 exact bare clarification-source label replacement(s) in dependency/traceability text. |
| [is-1-application-runtime-and-invocation-implementation-specification-v01.md](../implementation/is-1-application-runtime-and-invocation-implementation-specification-v01.md) | Metadata/source navigation where applicable; 2 exact bare clarification-source label replacement(s) in dependency/traceability text. |
| [is-13-nuxt-capability-implementation-specification-v01.md](../implementation/is-13-nuxt-capability-implementation-specification-v01.md) | Metadata/source navigation where applicable; 1 exact bare clarification-source label replacement(s) in dependency/traceability text. |
| [is-16-nuxt-domain-implementation-specification-v01.md](../implementation/is-16-nuxt-domain-implementation-specification-v01.md) | Metadata source links only. |
| [is-2-managed-project-resolution-implementation-specification-v01.md](../implementation/is-2-managed-project-resolution-implementation-specification-v01.md) | Metadata/source navigation where applicable; 2 exact bare clarification-source label replacement(s) in dependency/traceability text. |
| [is-23-build-and-runtime-assembly-implementation-specification-v01.md](../implementation/is-23-build-and-runtime-assembly-implementation-specification-v01.md) | Metadata/source navigation where applicable; 1 exact bare clarification-source label replacement(s) in dependency/traceability text. |
| [is-3-configuration-resolution-implementation-specification-v01.md](../implementation/is-3-configuration-resolution-implementation-specification-v01.md) | Metadata source links only. |

IS-2’s request-input sentence names DD-1.4 bootstrap eligibility instead of the retired staged clarification; its allowed input and all surrounding semantics are unchanged. IS-1, IS-2, IS-13 and IS-23 traceability labels name integrated outcome, bootstrap and scaffold owners. The Level-4 index points IS-3 to DD-1.4/DD-1.5. Nuxt Functional has exactly two downstream-DD navigation repairs; every other Functional body and Design are unchanged.

## 11. NCR-2 completion disposition

NCR-2 is complete on `ai/ncr2-detailed-design` for independent review in [PR #180](https://github.com/steve-r-lewis/app-manager/pull/180), against `master`. The PR remains unmerged. This disposition supersedes the in-progress gate statements in the chronological checkpoints above; those statements describe their respective checkpoints, not current state. NCR-3, NCR-4 and NCR-5 remain future work. Implementation remains paused until NCR-5 and verification of the resulting live master.

### 11.1 Semantic and horizontal result

The review covered all 23 primary DDs vertically and horizontally, all 17 active DD clarification vehicles from the starting baseline, every numbered definition, and the unnumbered model/workflow/invariant narrative. Sections 8–10 account for proposition families, occurrence classifications, canonical owners, clarification integration, 1,257 distinct numbered reduction decisions and 220 unnumbered section decisions. Remaining complete statements are canonical refinements; inherited occurrences are references, local bindings or local deltas. Duplicate normative restatements remaining in NCR-2 scope: **0**. Unresolved semantic-loss, authority-boundary and human-readability findings: **0**.

This is a semantic review result, not an inference from similarity scores or requirement counts. Apparently similar records and workflows were deliberately compared: Resource Access effects versus Source Transformation plans; Repository primitives versus Git intent; Source Intelligence facts versus Nuxt structure and Documentation models; AI proposals versus AI resource graphs; Quality evaluation versus domain acceptance policy; registry identity versus domain resource semantics; App environment readiness versus Settings definitions; root versus layer lifecycle; and Git/Docs/Maintenance coordinated per-target effects. Their distinct specialisations and compositions remain intact. No universal fact, transaction, plugin, provider or orchestration abstraction was introduced.

The final retained-clause pass preserves local request/state models, stage decisions, acceptance criteria, stale-state handling, failure/uncertainty, recovery and provider compatibility. It explicitly preserves capability/domain boundaries, DD-1 application authority, interaction projections, the stronger-owner Maintenance gate and truthful partial effects. The 23 documents retain their own purpose, model, workflow and sibling collaboration narrative; references do not replace that narrative with a list of identities. Canonical restorations made during review include Documentation unknown required meaning, Quality untrusted provider report content and Nuxt required/optional stage semantics.

Final navigation refinements point Nuxt bootstrap directly to the full DD-1.5 lifecycle and Nuxt re-entry/replay directly to the Engine stale-state checkpoint and Source Transformation stale-plan requirement. Other multi-edge numbered references compose distinct contracts: Engine configuration consumes staged bootstrap invalidation; App Reset composes its explicit lock-state policy; Nuxt stage acceptance composes its operation plan. They are not alias-only authority chains. The numbered-clause reference graph has no cycles; reciprocal component collaboration links do not create circular normative authority.

The immutable pre-NCR baseline and the NCR-1 starting baseline differ in the DD corpus only through five source/navigation changes. Their DD normative bodies and clarification semantics agree. Preservation therefore covers `0d96d6e0123072e8b2f57bfa25bd8f6554edfc19` as well as the physically edited baseline `b041d440faf032b2954e5a8be2fbc7894988717f`. All 1,915 DD identities (including 15 moved clarification identities), all 1,301 Functional identities and the settled 96-command catalogue survive. Design is unchanged; Functional changes are precisely the two Nuxt downstream-DD navigation repairs. No downstream IS contract supplied DD authority.

### 11.2 Physical metrics

Counts use whitespace-delimited words, source lines and UTF-8 bytes. The active scope comprises the 23 primary DDs and formerly active 17 clarification vehicles. Archive lineage notices, indexes, guidance and the project ledger are excluded from these corpus metrics.

| Active corpus | Before words | After words | Before lines | After lines | Before bytes | After bytes |
|---|---:|---:|---:|---:|---:|---:|
| 23 primary DDs | 132,679 | 112,919 | 22,747 | 25,598 | 1,092,260 | 1,125,464 |
| 17 DD clarification vehicles | 12,908 | 0 | 1,837 | 0 | 104,915 | 0 |
| Total active DD corpus | 145,587 | 112,919 | 24,584 | 25,598 | 1,197,175 | 1,125,464 |

The active corpus decreases by **32,668 words (22.44%)** and **71,711 bytes (5.99%)**. Source lines increase by 1,014, reflecting stable explicit anchors and reference spacing; this is not presented as a line-count reduction. Seventeen short non-normative archive notices retain successor/history navigation. Prior normative text remains recoverable from immutable Git history.

### 11.3 Verification and delivery gates

| Gate | Result |
|---|---|
| Complete vertical/horizontal DD coverage | 23/23 primaries and 17/17 clarification vehicles accounted; final retained-clause and cross-owner comparison complete. |
| Clarification semantic preservation and retirement | Continuing propositions integrated into correct primary owners before retirement; no active DD clarification remains; 17 non-normative lineage notices identify successors. |
| Cardinality and semantic preservation | Zero remaining duplicate normative restatements in scope; zero unresolved semantic-loss findings; stable identities preserved as multisets, including all 15 migrated identities. |
| Authority and comprehension | Zero unresolved boundary/readability findings; no Design/Functional redefinition, IS-as-authority inversion, new architecture or command identity. |
| NCR-3 exclusion | No IS reduction; all 10 Implementation clarifications remain active. Nine touched Level-4 files pass the exact navigation-only whitelist in §10.3. |
| Reference verification | New/edited relative links and anchors resolve; full active DD/IS link scan passes. Numbered-clause dependency cycle scan passes; semantic chain review completed separately. |
| Mechanical checks | `git diff --check`; baseline/current DD and Functional definition counters; Design equality; exact IS body comparison after reversing whitelisted navigation replacements; retirement inventory; exact repeated normative-line scan. All pass. Similarity scanning supports, but does not prove, semantic review. |
| Current-state records | This single ledger, the active clarification register and project-management README updated. No second report or ledger created. |
| Repository delivery | Checkpoints A/B/C pushed on the same branch and PR. The commit containing this final disposition is checkpoint D; final delivery verifies clean working tree, matching pushed HEAD and PR ready for independent review, open and unmerged. Master is not modified. |

Live remote verification confirms `origin/master` at `b041d440faf032b2954e5a8be2fbc7894988717f` and PR #179 closed/merged. The NCR-2 branch starts at that verified SHA. Application build/runtime tests are not applicable to this documentation-only change; verification targets semantic preservation, identities, scope and navigation. Delivery state is checked again after pushing the final commit. No NCR-wide completion or NCR-5 gate is claimed.
