# AppManager Detailed Design Register

> **Document type:** Project-management register
>
> **Status:** Active
>
> **Role:** Canonical Version 1 Detailed Design identity and lifecycle register
>
> **Normative product effect:** None. This register identifies normative Detailed Design documents; it does not define their design semantics.

## 1. Purpose

This document is the current project-management register for the stable Version 1 `DD-<family>.<item>` identities and canonical active paths. It supersedes the lifecycle/status function formerly carried by `detailed-design-decomposition-plan-v01.md`.

The completed decomposition plan remains historical evidence. Detailed Design authority resides in the registered Detailed Design Specifications themselves, under the Project Documentation Guide, Design Specification, applicable Functional Specifications, accepted ADRs, and active clarifications.

## 2. Register Rules

- DD family numbers are subdivisions of Level 3, not authority levels.
- Stable IDs are not reconstructed from filenames, alphabetical order, source topology, or implementation structure.
- Clarifications and project-management records do not acquire primary DD identities.
- `Complete` means the primary Version 1 document exists at its canonical active path; it does not make this register the semantic authority for that design.

## 3. Version 1 Register

| ID | Subject | Canonical active path | Status |
|---|---|---|---|
| `DD-1.1` | Application Invocation | `docs/dd_1_application_core/dd-1-1-application-invocation-detailed-design-v01.md` | Complete |
| `DD-1.2` | Execution Outcomes | `docs/dd_1_application_core/dd-1-2-execution-outcomes-detailed-design-v01.md` | Complete |
| `DD-1.3` | Managed Project | `docs/dd_1_application_core/dd-1-3-managed-project-detailed-design-v01.md` | Complete |
| `DD-1.4` | Configuration Resolution | `docs/dd_1_application_core/dd-1-4-configuration-resolution-detailed-design-v01.md` | Complete |
| `DD-1.5` | Application Engine | `docs/dd_1_application_core/dd-1-5-application-engine-detailed-design-v01.md` | Complete |
| `DD-2.1` | Resource Access | `docs/dd_2_shared_capabilities/dd-2-1-resource-access-detailed-design-v01.md` | Complete |
| `DD-2.2` | Process Execution | `docs/dd_2_shared_capabilities/dd-2-2-process-execution-detailed-design-v01.md` | Complete |
| `DD-2.3` | Repository Capability | `docs/dd_2_shared_capabilities/dd-2-3-repository-capability-detailed-design-v01.md` | Complete |
| `DD-2.4` | Source Intelligence | `docs/dd_2_shared_capabilities/dd-2-4-source-intelligence-detailed-design-v01.md` | Complete |
| `DD-2.5` | Source Transformation | `docs/dd_2_shared_capabilities/dd-2-5-source-transformation-detailed-design-v01.md` | Complete |
| `DD-2.6` | Resource Registry and Template | `docs/dd_2_shared_capabilities/dd-2-6-resource-registry-and-template-detailed-design-v01.md` | Complete |
| `DD-2.7` | AI Capability | `docs/dd_2_shared_capabilities/dd-2-7-ai-capability-detailed-design-v01.md` | Complete |
| `DD-2.8` | Quality Capability | `docs/dd_2_shared_capabilities/dd-2-8-quality-capability-detailed-design-v01.md` | Complete |
| `DD-2.9` | Documentation Capability | `docs/dd_2_shared_capabilities/dd-2-9-documentation-capability-detailed-design-v01.md` | Complete |
| `DD-2.10` | Nuxt Capability | `docs/dd_2_shared_capabilities/dd-2-10-nuxt-capability-detailed-design-v01.md` | Complete |
| `DD-3.1` | App Domain | `docs/dd_3_high_coupling_domains/dd-3-1-app-domain-detailed-design-v01.md` | Complete |
| `DD-3.2` | Git Domain | `docs/dd_3_high_coupling_domains/dd-3-2-git-domain-detailed-design-v01.md` | Complete |
| `DD-3.3` | Nuxt Domain | `docs/dd_3_high_coupling_domains/dd-3-3-nuxt-domain-detailed-design-v01.md` | Complete |
| `DD-3.4` | Docs Domain | `docs/dd_3_high_coupling_domains/dd-3-4-docs-domain-detailed-design-v01.md` | Complete |
| `DD-4.1` | Quality Domain | `docs/dd_4_policy_and_resource_domains/dd-4-1-quality-domain-detailed-design-v01.md` | Complete |
| `DD-4.2` | Settings Domain | `docs/dd_4_policy_and_resource_domains/dd-4-2-settings-domain-detailed-design-v01.md` | Complete |
| `DD-4.3` | AI Domain | `docs/dd_4_policy_and_resource_domains/dd-4-3-ai-domain-detailed-design-v01.md` | Complete |
| `DD-4.4` | Maintenance Domain | `docs/dd_4_policy_and_resource_domains/dd-4-4-utils-domain-detailed-design-v01.md` | Complete |

## 4. Lifecycle State

The Version 1 Detailed Design authoring programme is complete. The former decomposition/drafting sequence is historical programme information, not a current work queue.

Changes to a registered identity, family assignment, or responsibility boundary require deliberate documentation-governance review. Ordinary revisions to the content of an existing DD retain its stable identity unless the responsibility itself is deliberately re-decomposed.
