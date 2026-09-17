# AppManager Active Clarification Register

> **Document type:** Project-management navigation register
>
> **Status:** Active
>
> **Normative product effect:** None. This register does not create, amend, supersede or rank clarification semantics. Each clarification has only the authority of its documentation level and cited scope.

## 1. Purpose

This register provides one current navigation point for Version 1 clarification documents that remain active after the DR correctness/rationalisation programme and the PBC-1 pre-NCR baseline correction.

A clarification is not a new documentation-hierarchy level. It clarifies the normative document(s) identified by its own header and remains subordinate to the established Design -> Functional -> Detailed Design -> Implementation direction.

If this register and a clarification's live content disagree, the clarification itself and the governing documentation hierarchy control. Repository state must be verified before relying on lifecycle assumptions.

## 2. Design Clarifications

| Clarification | Scope / purpose |
|---|---|
| [`appmanager-version-1-interaction-and-portability-clarification-v01.md`](../appmanager-version-1-interaction-and-portability-clarification-v01.md) | PBC-1 restoration of three concrete V1 interaction provisions (TUI, GUI, Headless), modular interface-driven TypeScript architecture and future IDE/plugin portability without making WebStorm a V1 deliverable. |
| [`appmanager-version-1-app-command-model-clarification-v01.md`](../appmanager-version-1-app-command-model-clarification-v01.md) | PBC-1 correction of the V1 App command surface: simple root-application lifecycle commands, explicit App/Nuxt boundary and supporting-script/provider separation. |
| [`appmanager-version-1-nuxt-command-model-clarification-v01.md`](../appmanager-version-1-nuxt-command-model-clarification-v01.md) | PBC-1 completion of the App/Nuxt boundary and thirteen-command Nuxt surface, including scaffold, module, upgrade, analysis and bounded Nuxt cleanup intent. |

## 3. Functional Clarifications

| Clarification | Scope / purpose |
|---|---|
| [`app-settings-environment-definition-ownership-clarification-v01.md`](../functional/app-settings-environment-definition-ownership-clarification-v01.md) | App/Settings environment-definition ownership. |
| [`ai-functional-ownership-clarification-v01.md`](../functional/clarifications/ai-functional-ownership-clarification-v01.md) | AI Functional ownership and consuming-domain relationship. |
| [`app-command-model-functional-clarification-v01.md`](../functional/clarifications/app-command-model-functional-clarification-v01.md) | PBC-1 Functional binding for the corrected eight-command App surface, `prepare`/`generate`, reset+prepare composition and bounded declared-script support. |
| [`nuxt-command-model-functional-clarification-v01.md`](../functional/clarifications/nuxt-command-model-functional-clarification-v01.md) | PBC-1 Functional binding for the corrected thirteen-command Nuxt surface and added root/layer-aware Nuxt intents. |
| [`functional-corpus-rationalisation-clarification-v01.md`](../functional/clarifications/functional-corpus-rationalisation-clarification-v01.md) | DR-6 rationalised Functional-corpus reading. |
| [`functional-traceability-authority-vocabulary-clarification-v01.md`](../functional/clarifications/functional-traceability-authority-vocabulary-clarification-v01.md) | Functional traceability authority vocabulary. |
| [`nuxt-layer-scaffold-functional-ownership-clarification-v01.md`](../functional/clarifications/nuxt-layer-scaffold-functional-ownership-clarification-v01.md) | Nuxt layer-scaffold Functional ownership, including FR-NUXT-058/059. |
| [`version-1-gui-interaction-clarification-v01.md`](../functional/clarifications/version-1-gui-interaction-clarification-v01.md) | PBC-1 GUI-specific Version 1 observable interaction requirements beneath the shared Application Invocation authority. |

## 4. Detailed Design Clarifications — DD-1

| Clarification | Scope / purpose |
|---|---|
| [`application-core-bootstrap-resolution-clarification-v01.md`](../dd_1_application_core/clarifications/application-core-bootstrap-resolution-clarification-v01.md) | DD-1 bootstrap/configuration/managed-project resolution relationship. |
| [`application-outcome-and-diagnostic-ownership-clarification-v01.md`](../dd_1_application_core/clarifications/application-outcome-and-diagnostic-ownership-clarification-v01.md) | Canonical application outcome and diagnostic ownership. |

## 5. Detailed Design Clarifications — DD-2

| Clarification | Scope / purpose |
|---|---|
| [`ai-functional-refinement-relationship-clarification-v01.md`](../dd_2_shared_capabilities/clarifications/ai-functional-refinement-relationship-clarification-v01.md) | DD-2.7/AI-domain Functional refinement relationship. |
| [`dd2-shared-capability-rationalisation-clarification-v01.md`](../dd_2_shared_capabilities/clarifications/dd2-shared-capability-rationalisation-clarification-v01.md) | DR-4 rationalised DD-2 shared-capability reading. |
| [`dd2-sibling-authority-clarification-v01.md`](../dd_2_shared_capabilities/clarifications/dd2-sibling-authority-clarification-v01.md) | Same-level DD-2 sibling authority and caller-contract interpretation. |
| [`nuxt-layer-scaffold-artefact-ownership-clarification-v01.md`](../dd_2_shared_capabilities/clarifications/nuxt-layer-scaffold-artefact-ownership-clarification-v01.md) | Nuxt layer-scaffold artefact ownership refinement. |
| [`nuxt-command-model-capability-clarification-v01.md`](../dd_2_shared_capabilities/clarifications/nuxt-command-model-capability-clarification-v01.md) | PBC-1 bounded DD-2.10 technical support required by the expanded Nuxt command model without transferring domain authority. |
| [`repository-source-intelligence-relationship-clarification-v01.md`](../dd_2_shared_capabilities/clarifications/repository-source-intelligence-relationship-clarification-v01.md) | Repository Capability / Source Intelligence relationship. |

## 6. Detailed Design Clarifications — DD-3/DD-4

| Clarification | Scope / purpose |
|---|---|
| [`app-domain-command-model-clarification-v01.md`](../dd_3_high_coupling_domains/clarifications/app-domain-command-model-clarification-v01.md) | PBC-1 DD-3.1 correction for the eight canonical App use cases and supporting declared-script mechanism. |
| [`dd3-dd4-domain-rationalisation-clarification-v01.md`](../dd_3_high_coupling_domains/clarifications/dd3-dd4-domain-rationalisation-clarification-v01.md) | DR-5 rationalised domain-DD reading. |
| [`nuxt-domain-operation-identity-clarification-v01.md`](../dd_3_high_coupling_domains/clarifications/nuxt-domain-operation-identity-clarification-v01.md) | Earlier canonical Nuxt-domain identity correction; read with the PBC-1 command-model clarification until NCR-2 consolidates the primary owner. |
| [`nuxt-domain-command-model-clarification-v01.md`](../dd_3_high_coupling_domains/clarifications/nuxt-domain-command-model-clarification-v01.md) | PBC-1 DD-3.3 extension from eight to thirteen Nuxt intents and their orchestration/target/acceptance boundaries. |

## 7. Implementation Clarifications

| Clarification | Scope / purpose |
|---|---|
| [`app-command-model-implementation-clarification-v01.md`](../implementation/clarifications/app-command-model-implementation-clarification-v01.md) | PBC-1 IS-14 correction for command registration, provider resolution, reset+prepare composition and supporting declared-script runner. |
| [`interaction-capabilities-contract-clarification-v01.md`](../implementation/clarifications/interaction-capabilities-contract-clarification-v01.md) | IS-1/IS-22 interaction-capability contract distinction. |
| [`implementation-specification-rationalisation-clarification-v01.md`](../implementation/clarifications/implementation-specification-rationalisation-clarification-v01.md) | DR-7 rationalised Level 4 reading. |
| [`nuxt-command-model-implementation-clarification-v01.md`](../implementation/clarifications/nuxt-command-model-implementation-clarification-v01.md) | PBC-1 IS-16/IS-13 binding for the thirteen-command Nuxt catalogue, typed inputs, domain orchestration and bounded capability/provider seams. |
| [`version-1-gui-and-portability-implementation-clarification-v01.md`](../implementation/clarifications/version-1-gui-and-portability-implementation-clarification-v01.md) | PBC-1 binding correction for IS-22/IS-23: GUI as third concrete V1 adapter and explicit modular typed replaceability/future-host portability. |

## 8. Lifecycle Rule

When a clarification is folded into all affected primary normative documents and no compatibility or interpretive purpose remains, its lifecycle may be changed deliberately through normal documentation governance. Until then it remains active and should be linked from affected primary documents where necessary for correct interpretation.

Historical assurance records may mention clarifications without making them active. This register lists only live clarification files intended to participate in current Version 1 reading.

PBC-1 clarifications are deliberately temporary integration vehicles. NCR shall fold their semantics into the proper canonical primary owners and retire them rather than preserving an additional permanent layer of documentation.