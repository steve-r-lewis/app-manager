# Nuxt Command Model Implementation Clarification

> **Document type:** Implementation clarification
>
> **Status:** Active — temporary PBC-1 integration vehicle
>
> **Primary implementations:** [IS-16 — Nuxt Domain](../is-16-nuxt-domain-implementation-specification-v01.md), [IS-13 — Nuxt Capability](../is-13-nuxt-capability-implementation-specification-v01.md)
>
> **DD binding:** [Nuxt Domain Command Model](../../dd_3_high_coupling_domains/dd-3-3-nuxt-domain-detailed-design-v01.md#add), [Nuxt Command Model Capability](../../dd_2_shared_capabilities/dd-2-10-nuxt-capability-detailed-design-v01.md#operation-evidence)

## 1. Purpose

This clarification corrects IS-16's eight-command catalogue and supplies the minimum implementation delta for the five added Nuxt intents. It preserves the IS-16/IS-13 domain-capability separation and the modular typed replaceability requirements restored by PBC-1.

NCR-3 shall integrate this delta into IS-16/IS-13 and retire this temporary clarification.

## 2. Canonical Catalogue

IS-16 shall register exactly these thirteen canonical Version 1 Nuxt command IDs:

```text
nuxt.inspect
nuxt.inspect-configuration
nuxt.list-configuration
nuxt.add-configuration
nuxt.remove-configuration
nuxt.add
nuxt.add-module
nuxt.upgrade
nuxt.analyze
nuxt.cleanup
nuxt.create-layer
nuxt.integrate-layer
nuxt.detach-layer
```

IS-22 aliases may translate into these IDs but shall not add semantics.

## 3. Typed Domain Inputs

IS-16 shall define explicit typed inputs equivalent in semantic information to:

```ts
export interface AddNuxtArtefactInput {
  readonly target: NuxtExistingTargetSelector;
  readonly artefactClass: NuxtScaffoldClassId;
  readonly name: string;
  readonly options?: Readonly<Record<string, unknown>>;
}

export interface AddNuxtModuleInput {
  readonly target: NuxtExistingTargetSelector;
  readonly module: NuxtModuleId;
  readonly requestedVersion?: NuxtModuleVersionRequest;
  readonly options?: NuxtModuleConfigurationIntent;
}

export interface UpgradeNuxtInput {
  readonly target: NuxtExistingTargetSelector;
  readonly request: NuxtUpgradeRequest;
}

export interface AnalyzeNuxtInput {
  readonly target: NuxtExistingTargetSelector;
  readonly profile?: NuxtAnalysisProfileId;
}

export interface CleanupNuxtInput {
  readonly target: NuxtExistingTargetSelector;
  readonly classes?: readonly NuxtGeneratedStateClass[];
}
```

Exact type/module names may be consolidated during NCR-3 implementation-specification rationalisation, but equivalent explicit typed information is required. `Record<string, unknown>` above is only an extensibility envelope for an explicitly supported artefact/module class; it shall not become arbitrary provider argument or shell input.

## 4. Use-Case Implementations

IS-16 shall provide domain use-case implementations for the five added intents. They shall resolve authoritative IS-2 targets, consume IS-3 effective configuration where required, request bounded IS-13 technical evidence/plans, coordinate subordinate capabilities through typed contracts, evaluate Nuxt postconditions, and return subordinate Nuxt-domain results for IS-1 final acceptance.

No use case shall call raw Nuxt/package-manager commands as its semantic contract.

## 5. `nuxt.add`

Implementation shall:

1. resolve one existing root/layer target;
2. resolve a supported scaffold class;
3. request IS-13 Nuxt-aware placement/technical plan evidence;
4. apply collision/authorization policy;
5. delegate authorized new-resource creation or existing-source transformation as required;
6. request fresh Nuxt validation/inspection;
7. accept only when the requested artefact postcondition is satisfied.

## 6. `nuxt.add-module`

Implementation shall model module addition as one domain operation. IS-13 may normalize module state/requirements; package dependency execution shall use the established process/package-provider path; supported configuration mutation shall use IS-8; final module state shall be freshly validated before domain acceptance.

Already-satisfied/conflicting state shall remain explicit. No arbitrary package install string is accepted as module intent.

## 7. `nuxt.upgrade`

`NuxtUpgradeRequest` shall identify an explicit version/range or documented policy identity. IS-16 shall bind it to one selected target, obtain technical current/available state through bounded providers/capabilities, coordinate authorized dependency/provider work, and validate the resulting Nuxt target.

No implementation default may silently translate an absent request into `latest`, nor iterate sibling layers implicitly.

## 8. `nuxt.analyze`

IS-16 shall coordinate Nuxt analysis through an injected technical seam. Executable tooling shall run through IS-5 Process Execution. IS-13/provider code shall normalize technical analysis evidence; IS-16 shall expose Nuxt-domain analysis payload/diagnostics without manufacturing an IS-18 Quality gate result.

## 9. `nuxt.cleanup`

IS-13 shall identify only supported Nuxt-generated/cache state classes and technical facts needed for cleanup. IS-16 shall bind those facts to the selected authoritative target and approved cleanup classes. Authorized deletion uses IS-4 Resource Access mechanics.

The cleanup implementation shall reject resources outside the supported Nuxt-generated-state classification rather than widening to App clean/reset semantics.

## 10. IS-13 Seam

IS-13 shall be extended only with the minimum normalized facts/plans/validation required by the above use cases. It shall not mirror the thirteen-command catalogue mechanically. Provider implementations remain injected/replaceable and shall not leak raw provider objects or command syntax into IS-16 contracts.

## 11. Composition and Portability

IS-23 composition shall inject the required Nuxt technical/provider implementations behind explicit TypeScript interfaces/types. TUI, GUI and Headless shall discover the same thirteen canonical Nuxt command descriptors through IS-1/IS-22 rather than maintaining interface-specific command lists.