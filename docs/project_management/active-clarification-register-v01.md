# AppManager Active Clarification Register

> **Document type:** Project-management navigation register
>
> **Status:** Active
>
> **Normative product effect:** None. This register does not create, amend, supersede or rank clarification semantics. Each clarification has only the authority of its documentation level and cited scope.

## 1. Purpose

This register provides one current navigation point for Version 1 clarification documents that remain active after the DR correctness/rationalisation programme.

A clarification is not a new documentation-hierarchy level. It clarifies the normative document(s) identified by its own header and remains subordinate to the established Design -> Functional -> Detailed Design -> Implementation direction.

If this register and a clarification's live content disagree, the clarification itself and the governing documentation hierarchy control. Repository state must be verified before relying on lifecycle assumptions.

## 2. Functional Clarifications

| Clarification | Scope / purpose |
|---|---|
| [`app-settings-environment-definition-ownership-clarification-v01.md`](../functional/app-settings-environment-definition-ownership-clarification-v01.md) | App/Settings environment-definition ownership. |
| [`ai-functional-ownership-clarification-v01.md`](../functional/clarifications/ai-functional-ownership-clarification-v01.md) | AI Functional ownership and consuming-domain relationship. |
| [`functional-corpus-rationalisation-clarification-v01.md`](../functional/clarifications/functional-corpus-rationalisation-clarification-v01.md) | DR-6 rationalised Functional-corpus reading. |
| [`functional-traceability-authority-vocabulary-clarification-v01.md`](../functional/clarifications/functional-traceability-authority-vocabulary-clarification-v01.md) | Functional traceability authority vocabulary. |
| [`nuxt-layer-scaffold-functional-ownership-clarification-v01.md`](../functional/clarifications/nuxt-layer-scaffold-functional-ownership-clarification-v01.md) | Nuxt layer-scaffold Functional ownership, including FR-NUXT-058/059. |

## 3. Detailed Design Clarifications — DD-1

| Clarification | Scope / purpose |
|---|---|
| [`application-core-bootstrap-resolution-clarification-v01.md`](../dd_1_application_core/clarifications/application-core-bootstrap-resolution-clarification-v01.md) | DD-1 bootstrap/configuration/managed-project resolution relationship. |
| [`application-outcome-and-diagnostic-ownership-clarification-v01.md`](../dd_1_application_core/clarifications/application-outcome-and-diagnostic-ownership-clarification-v01.md) | Canonical application outcome and diagnostic ownership. |

## 4. Detailed Design Clarifications — DD-2

| Clarification | Scope / purpose |
|---|---|
| [`ai-functional-refinement-relationship-clarification-v01.md`](../dd_2_shared_capabilities/clarifications/ai-functional-refinement-relationship-clarification-v01.md) | DD-2.7/AI-domain Functional refinement relationship. |
| [`dd2-shared-capability-rationalisation-clarification-v01.md`](../dd_2_shared_capabilities/clarifications/dd2-shared-capability-rationalisation-clarification-v01.md) | DR-4 rationalised DD-2 shared-capability reading. |
| [`dd2-sibling-authority-clarification-v01.md`](../dd_2_shared_capabilities/clarifications/dd2-sibling-authority-clarification-v01.md) | Same-level DD-2 sibling authority and caller-contract interpretation. |
| [`nuxt-layer-scaffold-artefact-ownership-clarification-v01.md`](../dd_2_shared_capabilities/clarifications/nuxt-layer-scaffold-artefact-ownership-clarification-v01.md) | Nuxt layer-scaffold artefact ownership refinement. |
| [`repository-source-intelligence-relationship-clarification-v01.md`](../dd_2_shared_capabilities/clarifications/repository-source-intelligence-relationship-clarification-v01.md) | Repository Capability / Source Intelligence relationship. |

## 5. Detailed Design Clarifications — DD-3/DD-4

| Clarification | Scope / purpose |
|---|---|
| [`dd3-dd4-domain-rationalisation-clarification-v01.md`](../dd_3_high_coupling_domains/clarifications/dd3-dd4-domain-rationalisation-clarification-v01.md) | DR-5 rationalised domain-DD reading. |
| [`nuxt-domain-operation-identity-clarification-v01.md`](../dd_3_high_coupling_domains/clarifications/nuxt-domain-operation-identity-clarification-v01.md) | Canonical Version 1 Nuxt-domain operation identities. |

## 6. Implementation Clarifications

| Clarification | Scope / purpose |
|---|---|
| [`interaction-capabilities-contract-clarification-v01.md`](../implementation/clarifications/interaction-capabilities-contract-clarification-v01.md) | IS-1/IS-22 interaction-capability contract distinction. |
| [`implementation-specification-rationalisation-clarification-v01.md`](../implementation/clarifications/implementation-specification-rationalisation-clarification-v01.md) | DR-7 rationalised Level 4 reading. |

## 7. Lifecycle Rule

When a clarification is folded into all affected primary normative documents and no compatibility or interpretive purpose remains, its lifecycle may be changed deliberately through normal documentation governance. Until then it remains active and should be linked from affected primary documents where necessary for correct interpretation.

Historical assurance records may mention clarifications without making them active. This register lists only live clarification files intended to participate in current Version 1 reading.