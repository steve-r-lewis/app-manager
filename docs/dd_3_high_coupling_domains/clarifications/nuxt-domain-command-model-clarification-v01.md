# Nuxt Domain Command Model Clarification

> **Document type:** Detailed Design clarification
>
> **Status:** Active — temporary PBC-1 integration vehicle
>
> **Primary Detailed Design:** [DD-3.3 — Nuxt Domain](../dd-3-3-nuxt-domain-detailed-design-v01.md)
>
> **Functional binding:** [Nuxt Command Model Functional Clarification](../../functional/clarifications/nuxt-command-model-functional-clarification-v01.md)

## 1. Purpose

This clarification extends DD-3.3 for the corrected thirteen-command Version 1 Nuxt surface while preserving DD-3.3 ownership of Nuxt application intent/policy/orchestration and DD-2.10 ownership of bounded Nuxt technical semantics.

NCR-2 shall fold these deltas into the canonical Detailed Design owners and retire this temporary clarification.

## 2. Operation Identities

`NuxtOperationIdentity` shall include:

```text
inspect
inspect_configuration
list_configuration
add_configuration
remove_configuration
add
add_module
upgrade
analyze
cleanup
create_layer
integrate_layer
detach_layer
```

These are semantic identities independent of provider syntax.

## 3. Target Model Extension

The existing root/layer/configuration/prospective-layer target model remains authoritative. The added operations shall use explicit existing root/layer targets where applicable.

`add`, `add_module`, `upgrade`, `analyze` and `cleanup` shall not infer a broader target set from monorepo membership. If a future operation deliberately targets multiple managed entities, that requires an explicit multi-target contract rather than implicit iteration.

## 4. `add` Orchestration

DD-3.3 shall own:

- supported scaffold-class application intent;
- explicit root/layer target selection;
- requested artefact identity/name;
- applicability and collision policy;
- interpretation of technical scaffold plans/evidence;
- Nuxt-domain postcondition acceptance.

DD-2.10 may own bounded Nuxt scaffold-class recognition, placement semantics, technical plan generation and Nuxt-specific validation. New-resource persistence remains Resource Access-owned; existing-source transformation remains Source Transformation-owned.

`add` shall not become a generic resource-generation framework.

## 5. `add_module` Orchestration

DD-3.3 shall own the composed intent to establish a supported Nuxt module on one selected target. The domain shall determine applicability/already-satisfied/conflict state, authorize/coordinate subordinate dependency and configuration work, and evaluate the module postcondition.

Dependency/package execution remains subordinate technical work. Supported existing-source configuration mutation remains Source Transformation-owned. DD-2.10 may supply bounded module-state interpretation, required semantic configuration/dependency intent and Nuxt validation evidence.

## 6. `upgrade` Orchestration

The domain input shall identify the selected managed Nuxt target and an explicit supported requested version/range or upgrade-policy identity. DD-3.3 shall own upgrade applicability, scope, preconditions, effect review, interpretation and postcondition acceptance.

No policy may broaden one target into root-plus-all-layers implicitly. Provider resolution/version discovery and technical Nuxt validation may be delegated through bounded capabilities without transferring upgrade policy.

## 7. `analyze` Orchestration

DD-3.3 shall own the request to obtain Nuxt-specific analysis for one selected supported target and shall normalize technical analysis evidence/diagnostics into a Nuxt-domain result payload.

The operation is observational/diagnostic with respect to Quality policy. It shall not create a competing quality-gate result. Any build/tool execution needed to produce analysis remains subordinate provider evidence.

## 8. `cleanup` Orchestration

DD-3.3 shall own selection of the Nuxt cleanup target and supported generated-state cleanup class/policy. DD-2.10 may identify Nuxt-generated/cache resources and Nuxt-specific regeneration/validation facts. Authorized deletion mechanics remain Resource Access-owned.

Cleanup shall be bounded to explicitly supported Nuxt-generated/cache state and shall not acquire App-owned clean/reset semantics.

## 9. Capability Boundary

The five new domain operations do not imply five matching DD-2.10 public operations. DD-2.10 shall expose only the minimum reusable technical facts/plans/validation contracts required by the domain. Similar provider commands or data shapes shall not be used to invent a second Nuxt application domain inside the capability.

## 10. Acceptance

For each added operation, technical/provider completion remains evidence. DD-3.3 evaluates the Nuxt-specific requested postcondition and supplies the resulting domain interpretation to DD-1 Application Engine for final application acceptance.