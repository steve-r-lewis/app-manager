# AppManager Detailed Design Reference Reconciliation

> **Status:** Version 1 project-management reconciliation record
>
> **Work package:** R-7 — Cross-document navigation repair
>
> **Baseline:** `master` at `df03ab62ece6135515f3364ea260dfee7cdbffbb`
>
> **Normative effect:** None. This work repairs identity metadata and navigation to the already-approved Detailed Design structure; it does not revise architecture or responsibility ownership.

## 1. Scope

R-7 reconciles active Detailed Design, Functional, architecture-decision, and current Detailed Design authoring/navigation references after the R-4 through R-6 physical migrations. Historical conformance, handover, reconciliation, and migration evidence is not mechanically rewritten when the superseded path is part of the recorded historical state.

## 2. Active Reference Policy

- Primary Detailed Designs carry their stable `DD-<family>.<item>` identity in the H1 and metadata.
- Detailed Design clarifications identify their document type and the primary DDs clarified without receiving fictitious primary DD IDs.
- Active internal Markdown document references use repository-relative links.
- Legacy `docs/detailed_design/` and `docs/decisions/` locations are not used as active navigation targets.
- Historical records may retain those strings where they document the repository state or migration itself.

## 3. Files Reconciled

- `docs/dd_1_application_core/clarifications/application-core-bootstrap-resolution-clarification-v01.md`
- `docs/dd_1_application_core/clarifications/application-outcome-and-diagnostic-ownership-clarification-v01.md`
- `docs/dd_1_application_core/dd-1-1-application-invocation-detailed-design-v01.md`
- `docs/dd_1_application_core/dd-1-2-execution-outcomes-detailed-design-v01.md`
- `docs/dd_1_application_core/dd-1-3-managed-project-detailed-design-v01.md`
- `docs/dd_1_application_core/dd-1-4-configuration-resolution-detailed-design-v01.md`
- `docs/dd_1_application_core/dd-1-5-application-engine-detailed-design-v01.md`
- `docs/dd_2_shared_capabilities/clarifications/nuxt-layer-scaffold-artefact-ownership-clarification-v01.md`
- `docs/dd_2_shared_capabilities/clarifications/repository-source-intelligence-relationship-clarification-v01.md`
- `docs/dd_2_shared_capabilities/dd-2-1-resource-access-detailed-design-v01.md`
- `docs/dd_2_shared_capabilities/dd-2-10-nuxt-capability-detailed-design-v01.md`
- `docs/dd_2_shared_capabilities/dd-2-2-process-execution-detailed-design-v01.md`
- `docs/dd_2_shared_capabilities/dd-2-3-repository-capability-detailed-design-v01.md`
- `docs/dd_2_shared_capabilities/dd-2-4-source-intelligence-detailed-design-v01.md`
- `docs/dd_2_shared_capabilities/dd-2-5-source-transformation-detailed-design-v01.md`
- `docs/dd_2_shared_capabilities/dd-2-6-resource-registry-and-template-detailed-design-v01.md`
- `docs/dd_2_shared_capabilities/dd-2-7-ai-capability-detailed-design-v01.md`
- `docs/dd_2_shared_capabilities/dd-2-8-quality-capability-detailed-design-v01.md`
- `docs/dd_2_shared_capabilities/dd-2-9-documentation-capability-detailed-design-v01.md`
- `docs/dd_3_high_coupling_domains/dd-3-1-app-domain-detailed-design-v01.md`
- `docs/functional/ai-functional-specification-v01.md`
- `docs/functional/app-functional-specification-v01.md`
- `docs/functional/app-settings-environment-definition-ownership-clarification-v01.md`
- `docs/functional/application-invocation-functional-specification-v01.md`
- `docs/functional/configuration-functional-specification-v01.md`
- `docs/functional/docs-functional-specification-v01.md`
- `docs/functional/git-functional-specification-v01.md`
- `docs/functional/managed-project-functional-specification-v01.md`
- `docs/functional/nuxt-functional-specification-v01.md`
- `docs/functional/quality-functional-specification-v01.md`
- `docs/functional/settings-functional-specification-v01.md`
- `docs/functional/source-transformation-functional-specification-v01.md`
- `docs/functional/utils-functional-specification-v01.md`
- `docs/project_management/decisions/adr-0001-primary-application-runtime.md`
- `docs/project_management/decisions/architecture-decision-governance-v01.md`
- `docs/project_management/detailed-design-decomposition-plan-v01.md`
- `docs/project_management/documentation-rationalisation-status-v01.md`
- `docs/project_management/domain-detailed-design-authoring-guide-v01.md`
- `docs/project_management/technology-architecture-review-v01.md`

## 4. Residual Legacy-Path Classification

- `docs/project-documentation-guide-v01.md` — intentional historical / migration evidence; signatures: `docs/detailed_design/`.
- `docs/project_management/application-core-detailed-design-conformance-audit-v01.md` — intentional historical / migration evidence; signatures: `docs/detailed_design/, docs/decisions/`.
- `docs/project_management/archive-absence-conformance-audit-v01.md` — intentional historical / migration evidence; signatures: `docs/detailed_design/, docs/decisions/`.
- `docs/project_management/dd2-independent-review-reconciliation-v01.md` — intentional historical / migration evidence; signatures: `docs/detailed_design/`.
- `docs/project_management/dd2-reconciliation-handover-v01.md` — intentional historical / migration evidence; signatures: `docs/detailed_design/`.
- `docs/project_management/detailed-design-dd1-handover-review-v01.md` — intentional historical / migration evidence; signatures: `docs/detailed_design/, docs/decisions/`.
- `docs/project_management/detailed-design-decomposition-plan-v01.md` — intentional historical / migration evidence; signatures: `docs/detailed_design/`.
- `docs/project_management/detailed-design-structure-migration-inventory-v01.md` — intentional historical / migration evidence; signatures: `docs/detailed_design/, docs/decisions/`.
- `docs/project_management/functional-specification-conformance-audit-v01.md` — intentional historical Functional-phase audit evidence; signatures: `docs/decisions/`.
- `docs/project_management/functional-specification-decomposition-plan-v01.md` — intentional historical Functional-phase planning evidence; signatures: `docs/decisions/`.
- `docs/project_management/shared-capability-detailed-design-conformance-audit-v01.md` — intentional historical / migration evidence; signatures: `docs/detailed_design/, docs/decisions/`.

## 5. Validation

- Active files changed: **39**.
- Broken relative Markdown `.md` links detected in the active R-7 target set: **0**.
- Unclassified legacy-path residual files outside the active target set: **0**.

R-7 is conformant only when both validation counts above are zero.
