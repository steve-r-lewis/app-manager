# AppManager Active Clarification Register

> **Document type:** Project-management navigation register
>
> **Status:** Active
>
> **Normative product effect:** None. This register does not create, amend, supersede or rank clarification semantics. Each clarification has only the authority of its documentation level and cited scope.

## 1. Purpose

This register provides one current navigation point for Version 1 clarification documents that remain active during NCR. A clarification is not a new documentation-hierarchy level and remains subordinate to Design -> Functional -> Detailed Design -> Implementation.

## 2. Design Clarifications

None remain active after NCR-1. Eight Design clarification vehicles have been integrated into the [root Design Specification](../appmanager-design-specification-v01.md) and the appropriate Functional owners. The [NCR ledger integration table](ncr-working-proposition-ledger-v01.md#_4-clarification-integration-and-retirement) links every retired vehicle to its primary destinations.

## 3. Functional Clarifications

None remain active after NCR-1. Thirteen Functional clarification vehicles have been integrated into the twelve primary Functional Specifications or their existing Design/governance owners. Their stable requirement identities remain in the primary specifications. See the [NCR ledger](ncr-working-proposition-ledger-v01.md#_4-clarification-integration-and-retirement) for retirement and identity accounting.

The DD and Implementation clarifications below remain active. Their integration belongs to NCR-2 and NCR-3 respectively; NCR-1 has not reduced their normative content.

## 4. Detailed Design Clarifications — DD-1

| Clarification | Scope / purpose |
|---|---|
| [`application-core-bootstrap-resolution-clarification-v01.md`](../dd_1_application_core/clarifications/application-core-bootstrap-resolution-clarification-v01.md) | DD-1 bootstrap/configuration/managed-project resolution. |
| [`application-outcome-and-diagnostic-ownership-clarification-v01.md`](../dd_1_application_core/clarifications/application-outcome-and-diagnostic-ownership-clarification-v01.md) | Canonical application outcome/diagnostic ownership. |

## 5. Detailed Design Clarifications — DD-2

| Clarification | Scope / purpose |
|---|---|
| [`ai-functional-refinement-relationship-clarification-v01.md`](../dd_2_shared_capabilities/clarifications/ai-functional-refinement-relationship-clarification-v01.md) | DD-2.7/AI Functional refinement. |
| [`dd2-shared-capability-rationalisation-clarification-v01.md`](../dd_2_shared_capabilities/clarifications/dd2-shared-capability-rationalisation-clarification-v01.md) | DR-4 rationalised DD-2 reading. |
| [`dd2-sibling-authority-clarification-v01.md`](../dd_2_shared_capabilities/clarifications/dd2-sibling-authority-clarification-v01.md) | DD-2 sibling authority. |
| [`nuxt-layer-scaffold-artefact-ownership-clarification-v01.md`](../dd_2_shared_capabilities/clarifications/nuxt-layer-scaffold-artefact-ownership-clarification-v01.md) | Nuxt layer-scaffold artefact ownership. |
| [`nuxt-command-model-capability-clarification-v01.md`](../dd_2_shared_capabilities/clarifications/nuxt-command-model-capability-clarification-v01.md) | PBC-1 DD-2.10 support for Nuxt command correction. |
| [`repository-source-intelligence-relationship-clarification-v01.md`](../dd_2_shared_capabilities/clarifications/repository-source-intelligence-relationship-clarification-v01.md) | Repository/Source Intelligence relationship. |

## 6. Detailed Design Clarifications — DD-3/DD-4

| Clarification | Scope / purpose |
|---|---|
| [`app-domain-command-model-clarification-v01.md`](../dd_3_high_coupling_domains/clarifications/app-domain-command-model-clarification-v01.md) | PBC-1 DD-3.1 App correction. |
| [`dd3-dd4-domain-rationalisation-clarification-v01.md`](../dd_3_high_coupling_domains/clarifications/dd3-dd4-domain-rationalisation-clarification-v01.md) | DR-5 rationalised domain-DD reading. |
| [`git-coordinated-commit-clarification-v01.md`](../dd_3_high_coupling_domains/clarifications/git-coordinated-commit-clarification-v01.md) | PBC-1 DD-3.2 coordinated commit intent, repository-specific planning and partial-effect semantics. |
| [`docs-coordinated-generation-clarification-v01.md`](../dd_3_high_coupling_domains/clarifications/docs-coordinated-generation-clarification-v01.md) | PBC-1 DD-3.4 coordinated artefact plans, mixed output dispositions, AI acceptance and continuation. |
| [`nuxt-domain-operation-identity-clarification-v01.md`](../dd_3_high_coupling_domains/clarifications/nuxt-domain-operation-identity-clarification-v01.md) | Earlier Nuxt identity correction pending NCR consolidation. |
| [`nuxt-domain-command-model-clarification-v01.md`](../dd_3_high_coupling_domains/clarifications/nuxt-domain-command-model-clarification-v01.md) | PBC-1 DD-3.3 Nuxt extension. |
| [`maintenance-domain-reclassification-clarification-v01.md`](../dd_4_policy_and_resource_domains/clarifications/maintenance-domain-reclassification-clarification-v01.md) | PBC-1 DD-4.4 reclassification from Utils to Maintenance and stronger-owner gate. |
| [`maintenance-coordinated-operations-clarification-v01.md`](../dd_4_policy_and_resource_domains/clarifications/maintenance-coordinated-operations-clarification-v01.md) | PBC-1 DD-4.4 coordinated Maintenance classification, planning, per-resource effects and continuation. |
| [`ai-project-environment-domain-clarification-v01.md`](../dd_4_policy_and_resource_domains/clarifications/ai-project-environment-domain-clarification-v01.md) | PBC-1 DD-4.3 AI resource graph, provider-neutral representation and automatic-acceptance refinement. |

## 7. Implementation Clarifications

| Clarification | Scope / purpose |
|---|---|
| [`app-command-model-implementation-clarification-v01.md`](../implementation/clarifications/app-command-model-implementation-clarification-v01.md) | PBC-1 IS-14 App correction. |
| [`interaction-capabilities-contract-clarification-v01.md`](../implementation/clarifications/interaction-capabilities-contract-clarification-v01.md) | IS-1/IS-22 interaction-capability distinction. |
| [`implementation-specification-rationalisation-clarification-v01.md`](../implementation/clarifications/implementation-specification-rationalisation-clarification-v01.md) | DR-7 rationalised Level 4 reading. |
| [`git-coordinated-commit-implementation-clarification-v01.md`](../implementation/clarifications/git-coordinated-commit-implementation-clarification-v01.md) | PBC-1 IS-15 scope-based coordinated commit plans, AI message acceptance and truthful partial completion. |
| [`docs-coordinated-generation-implementation-clarification-v01.md`](../implementation/clarifications/docs-coordinated-generation-implementation-clarification-v01.md) | PBC-1 IS-17 coordinated artefact-plan implementation, deterministic/AI paths and per-artefact results. |
| [`nuxt-command-model-implementation-clarification-v01.md`](../implementation/clarifications/nuxt-command-model-implementation-clarification-v01.md) | PBC-1 IS-16/IS-13 Nuxt correction. |
| [`maintenance-domain-implementation-clarification-v01.md`](../implementation/clarifications/maintenance-domain-implementation-clarification-v01.md) | PBC-1 IS-21 reclassification, canonical `maintenance.*` identities and compatibility rule. |
| [`maintenance-coordinated-operations-implementation-clarification-v01.md`](../implementation/clarifications/maintenance-coordinated-operations-implementation-clarification-v01.md) | PBC-1 IS-21 coordinated Maintenance scope/classification plans, runners and per-resource results. |
| [`ai-project-environment-implementation-clarification-v01.md`](../implementation/clarifications/ai-project-environment-implementation-clarification-v01.md) | PBC-1 IS-20 expanded AI environment contracts, 22 identities and automatic acceptance. |
| [`version-1-gui-and-portability-implementation-clarification-v01.md`](../implementation/clarifications/version-1-gui-and-portability-implementation-clarification-v01.md) | PBC-1 IS-22/IS-23 GUI/portability correction. |

## 8. Lifecycle Rule

When a clarification is folded into all affected primary normative documents and no compatibility or interpretive purpose remains, its lifecycle may be changed deliberately through normal documentation governance. PBC-1 clarifications are temporary integration vehicles; NCR shall fold their semantics into proper canonical primary owners and retire them.
