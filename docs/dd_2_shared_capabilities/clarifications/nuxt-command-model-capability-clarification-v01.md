# Nuxt Command Model Capability Clarification

> **Document type:** Detailed Design clarification
>
> **Status:** Active — temporary PBC-1 integration vehicle
>
> **Primary Detailed Design:** [DD-2.10 — Nuxt Capability](../dd-2-10-nuxt-capability-detailed-design-v01.md)
>
> **Consuming domain:** [DD-3.3 — Nuxt Domain](../../dd_3_high_coupling_domains/dd-3-3-nuxt-domain-detailed-design-v01.md)
>
> **Domain correction:** [Nuxt Domain Command Model Clarification](../../dd_3_high_coupling_domains/clarifications/nuxt-domain-command-model-clarification-v01.md)

## 1. Purpose

This clarification defines only the bounded Nuxt technical capability delta required to support the corrected Nuxt-domain command surface. It does not transfer Nuxt application intent, scope, policy, orchestration or acceptance from DD-3.3 into DD-2.10.

NCR-2 shall integrate the necessary reusable technical contracts into DD-2.10 and retire this temporary clarification.

## 2. Capability Delta

DD-2.10 shall be capable, where required by an approved Nuxt-domain use case, of supplying normalized technical evidence/plans for:

- supported Nuxt scaffold artefact classes and their Nuxt-aware placement/validity constraints;
- supported Nuxt module state and semantic requirements needed to establish a module on a selected target;
- Nuxt version/framework state required to evaluate a requested upgrade and validate the resulting target;
- Nuxt-specific analysis invocation/result normalization where a provider is required;
- identification of supported Nuxt-generated/cache state eligible for bounded cleanup and applicable regeneration/validation facts.

These are capability concerns, not new application command identities.

## 3. Provider Independence

The capability shall not expose raw provider syntax as the domain contract. `nuxt`, `nuxi`, package-manager or other tooling may be used by provider implementations through the established Process Execution boundary, but provider-specific exit/output remains technical evidence.

## 4. Mutation Boundary

DD-2.10 remains non-authoritative for application mutation. It may return semantic plans/technical target facts where its existing contract permits them. New-resource persistence, existing-source transformation and deletion mechanics remain with their established capability owners under application authorization.

## 5. Scope Boundary

DD-2.10 shall not infer that a recognized root/layer should be operated on, nor expand one selected entity to sibling layers. Managed identity/scope/targetability remain DD-1-owned and operation policy remains DD-3.3-owned.

## 6. No Artificial One-to-One API

The corrected thirteen-command Nuxt catalogue does not require thirteen Nuxt Capability methods. Capability APIs shall be fact/plan/validation oriented and reusable where semantics genuinely coincide. Conversely, superficially similar provider operations shall remain distinct where their technical semantics differ.