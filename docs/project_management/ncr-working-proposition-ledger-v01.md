# NCR Working Proposition Ledger

> **Document type:** Project-management working ledger
>
> **Status:** Active during NCR execution
>
> **Normative product effect:** None. This ledger records ownership and reduction actions; the normative corpus remains authoritative.
>
> **Semantic comparison baseline:** `0d96d6e0123072e8b2f57bfa25bd8f6554edfc19`

## 1. Use

This is the single working proposition ledger required by the NCR control programme. It is intentionally compact: it records proposition families and physical reduction/integration results without becoming a second specification.

For every reduction, two conditions apply together:

1. normative substance must have one canonical owner; and
2. the edited document must remain understandable to a human reader at its own abstraction level.

A reference therefore replaces inherited normative substance, not the local explanation of why that authority matters to the document being read.

## 2. NCR-1 — Design and Functional

| Proposition family | Canonical owner | NCR-1 occurrences / inputs | Class / action | Human-readable local binding | Result |
|---|---|---|---|---|---|
| Application authority vs delegated execution | Design §§6.6, 11.1–11.3; observable invocation consequence in FR-INV-001–002 | recurrent Functional introductions/boundaries | `REFERENCE` + retained Functional consequence | explain what the current Functional concern asks the Application Engine to coordinate; do not repeat the general authority essay | in progress |
| Recognition/reachability vs mutation authority | Design §§9.6–9.7; Managed Project FR-PROJ-037–049 | domain Functional scope/safety prose | `REFERENCE` + command-specific `LOCAL_DELTA` | state the domain's eligible target and refusal consequence, then reference managed-scope authority | in progress |
| Evidence vs interpretation / provider completion vs application success | Design §§7.2, 7.7, 11.1–11.3; FR-INV-001–002 | capability-facing Functional prose | `REFERENCE` + operation-specific acceptance | explain which evidence matters to this use case without recreating the common success model | in progress |
| Generation vs transformation | Design §§6.8, 7.1, 7.9–7.10; Source Transformation FR-XFORM-044–045 | App/Nuxt/Docs/Settings/AI generation and update prose | `REFERENCE` + resource-specific collision/update delta | describe the resource being created/updated and the user-visible disposition; reference generic transformation governance | in progress |
| AI output vs owning-workflow authority | Design AI boundary; AI FR-AI-002–005 | AI and AI-consuming Functional specifications | `REFERENCE` + consuming-domain acceptance | distinguish AI proposal from the owning workflow's acceptance in the local workflow narrative | in progress |
| Settings persistence vs effective configuration | Design §8; Configuration FR-CONFIG-001–008; Settings FR-SET-001–005 | App/Settings/environment-definition prose | `REFERENCE` + persistence-specific behaviour | tell the reader what is persisted and when Configuration becomes relevant without duplicating precedence rules | in progress |
| Interaction-mode equivalence and GUI restoration | Design primary interaction model; Application Invocation Functional | Design and Functional PBC-1 GUI/portability clarifications | integrate `CANONICAL` Design semantics and Functional observable consequences; retire temporary Design/Functional clarification vehicles | preserve a short operating-model narrative for TUI, GUI and Headless rather than reducing the section to adapter references | pending integration |
| App command model | Design command/domain model; App Functional | App Design/Functional PBC-1 clarifications | integrate eight-command canonical surface and App/Nuxt boundary; retire temporary clarification vehicles | keep command descriptions and lifecycle relationships understandable without provider-command restatement | pending integration |
| Nuxt command model | Design command/domain model; Nuxt Functional | Nuxt Design/Functional PBC-1 clarifications | integrate thirteen-command canonical surface; retire temporary clarification vehicles | retain the distinction between root-application lifecycle and Nuxt-aware architecture/tooling | pending integration |
| Maintenance domain identity and stronger-owner gate | Design domain model; Maintenance Functional | Maintenance reclassification Design/Functional clarifications | replace `utils` identity, integrate four commands and stronger-owner rule; retire temporary clarification vehicles | explain what Maintenance is for and why stronger semantic owners keep their operations | pending integration |
| Coordinated Maintenance cardinality | Design scope model; Maintenance Functional | coordinated Maintenance Design/Functional clarifications | integrate structured multi-resource scope, per-resource evidence/effects and partial completion | describe validation/repair/version/cleanup workflows locally; reference general managed-scope and application-outcome rules | pending integration |
| AI project environment | Design AI domain; AI Functional | AI project-environment Design/Functional clarifications plus earlier AI ownership clarification | integrate project-side instructions/prompts/agents/skills/tools/policy model and 22-command surface; preserve AI Capability distinction; retire superseded clarification vehicles | retain the semantic resource-family model and provider-mapping explanation so users can understand the domain without knowing provider file layouts | pending integration |
| Coordinated Git commit | Design Git domain/scope; Git Functional | coordinated Git Design/Functional clarifications | integrate selected repository/set/all-managed scope, per-repository message/effects and truthful partial completion; retire temporary clarification vehicles | explain one invocation coordinating independent repository commits; do not imply transactionality | pending integration |
| Coordinated Docs production | Design Docs domain/scope; Docs Functional | coordinated Docs Design/Functional clarifications | integrate multi-target/multi-artefact generation/update, deterministic/AI paths and partial effects; retire temporary clarification vehicles | retain an artefact-plan narrative so mixed generation/update behaviour remains intelligible | pending integration |
| App/Settings environment-definition ownership | App Functional + Settings Functional + Configuration Functional | `app-settings-environment-definition-ownership-clarification-v01.md` | integrate same-level ownership split, then retire clarification | explain the difference between lifecycle consumption, persisted environment definitions and effective configuration | pending integration |
| Nuxt layer scaffold ownership | Nuxt Functional plus applicable generation/transformation Functional owners | `nuxt-layer-scaffold-functional-ownership-clarification-v01.md` | integrate Functional ownership and convert downstream DD wording to refinement references | retain a concise layer-scaffold workflow explanation | pending integration |
| Functional authority/traceability vocabulary | Design hierarchy + each owning Functional specification | `functional-corpus-rationalisation-clarification-v01.md`; `functional-traceability-authority-vocabulary-clarification-v01.md`; affected traceability tables | fold authority direction into primary Functional presentation, remove stale `current authority` ambiguity, retire meta-clarifications | traceability tables must distinguish upstream/same-level authority from downstream refinement in labels understandable without a governance essay | pending integration |

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
