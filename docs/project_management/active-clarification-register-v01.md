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

Detailed Design clarification integration is recorded below. Implementation clarifications remain active pending direct-edit integration (§7); NCR-3 is superseded by that work.

## 4. Detailed Design Clarifications — DD-1

None remain active: 2 vehicles integrated and retired during NCR-2. See the [single NCR ledger](ncr-working-proposition-ledger-v01.md#ncr2-clarification-integration) for non-normative lineage notices and successors. Physical reduction and final NCR-2 verification are complete and merged via PR #180.

## 5. Detailed Design Clarifications — DD-2

None remain active: 6 vehicles integrated and retired during NCR-2. See the [single NCR ledger](ncr-working-proposition-ledger-v01.md#ncr2-clarification-integration) for non-normative lineage notices and successors. Physical reduction and final NCR-2 verification are complete and merged via PR #180.

## 6. Detailed Design Clarifications — DD-3/DD-4

None remain active: 9 vehicles integrated and retired during NCR-2. See the [single NCR ledger](ncr-working-proposition-ledger-v01.md#ncr2-clarification-integration) for non-normative lineage notices and successors. Physical reduction and final NCR-2 verification are complete and merged via PR #180.

## 7. Implementation Clarifications

| Clarification | Scope / purpose |
|---|---|
| [`implementation-specification-rationalisation-clarification-v01.md`](../implementation/clarifications/implementation-specification-rationalisation-clarification-v01.md) | DR-7 rationalised Level 4 reading. |
| [`nuxt-command-model-implementation-clarification-v01.md`](../implementation/clarifications/nuxt-command-model-implementation-clarification-v01.md) | PBC-1 IS-16/IS-13 Nuxt correction. |
| [`maintenance-coordinated-operations-implementation-clarification-v01.md`](../implementation/clarifications/maintenance-coordinated-operations-implementation-clarification-v01.md) | PBC-1 IS-21 coordinated Maintenance scope/classification plans, runners and per-resource results. |
| [`ai-project-environment-implementation-clarification-v01.md`](../implementation/clarifications/ai-project-environment-implementation-clarification-v01.md) | PBC-1 IS-20 expanded AI environment contracts, 22 identities and automatic acceptance. |
| [`version-1-gui-and-portability-implementation-clarification-v01.md`](../implementation/clarifications/version-1-gui-and-portability-implementation-clarification-v01.md) | PBC-1 IS-22/IS-23 GUI/portability correction. |

## 8. Lifecycle Rule

When a clarification is folded into all affected primary normative documents and no compatibility or interpretive purpose remains, its lifecycle may be changed deliberately through normal documentation governance. PBC-1 clarifications are temporary integration vehicles; NCR shall fold their semantics into proper canonical primary owners and retire them.

## 9. Retired Implementation Clarifications

- [`interaction-capabilities-contract-clarification-v01-retired.md`](../archive/implementation/interaction-capabilities-contract-clarification-v01-retired.md) — the IS-1/IS-22 `InteractionCapabilities` name collision it identified is resolved directly in both primary specifications; see the retired document's status notice for the disposition.
- [`maintenance-domain-implementation-clarification-v01-retired.md`](../archive/implementation/maintenance-domain-implementation-clarification-v01-retired.md) — the `utils.*`→`maintenance.*` reclassification it specified is applied directly in IS-21; see the retired document's status notice for the disposition.
