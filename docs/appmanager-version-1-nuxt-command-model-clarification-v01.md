# AppManager Version 1 Nuxt Command Model Clarification

> **Document type:** Design clarification
>
> **Status:** Active — temporary PBC-1 integration vehicle
>
> **Scope:** Version 1 Nuxt-domain product boundary and canonical command surface
>
> **Governing authority:** [AppManager Design Specification](appmanager-design-specification-v01.md)
>
> **Related correction:** [Version 1 App Command Model Clarification](appmanager-version-1-app-command-model-clarification-v01.md)

## 1. Purpose

This clarification completes the PBC-1 App/Nuxt command-boundary correction before NCR begins. It does not create a new documentation hierarchy level. NCR-1 shall fold the Design-level propositions into the canonical Design owner and retire this temporary clarification.

## 2. App/Nuxt Product Boundary

The Version 1 `app` domain is the deliberately simple root-application operational surface. The `nuxt` domain owns Nuxt-aware structural, compositional and advanced framework intent whose meaning materially depends on Nuxt concepts, including managed root/layer targeting.

A Nuxt CLI command or package-manager mechanism does not acquire canonical AppManager identity merely because it exists. A canonical `nuxt` command shall represent a stable Nuxt-specific user/application intent with AppManager-managed target, policy, safety and postcondition semantics.

Simple root lifecycle intents remain App-owned even when Nuxt tooling implements them. Nuxt-specific structural, layer, module, framework-scaffold, upgrade, analysis and generated-state cleanup intents belong to Nuxt when their semantics materially depend on Nuxt.

## 3. Canonical Version 1 Nuxt Surface

Version 1 shall expose thirteen canonical Nuxt-domain command identities:

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

The existing eight identities retain their established semantics. The five added identities are defined below.

## 4. Added Nuxt Intents

### 4.1 `nuxt.add`

`nuxt.add` owns Nuxt-aware scaffolding of a supported framework artefact into an explicitly selected managed root application or managed layer. Supported artefact classes may include components, composables, plugins, middleware, pages, layouts or other explicitly supported Nuxt scaffold classes.

The command is not a generic arbitrary-file generator. The selected artefact class, name and target shall be explicit or deterministically resolvable, and AppManager shall apply Nuxt-specific placement, collision and postcondition policy.

### 4.2 `nuxt.add-module`

`nuxt.add-module` owns the composed Nuxt intent to add a selected supported Nuxt module to an explicitly selected managed root application or layer. It may coordinate dependency/package-manager work and supported Nuxt configuration change, but those mechanisms remain subordinate to the module-addition intent.

Module addition is distinct from generic `nuxt.add` scaffolding because its postconditions include the selected module's required dependency/configuration state rather than only establishment of a framework source artefact.

### 4.3 `nuxt.upgrade`

`nuxt.upgrade` owns an explicit upgrade of a selected managed Nuxt target according to a supported requested version/range or upgrade policy. It shall not silently mean "latest", silently broaden from one selected root/layer to other independently managed entities, or treat package-manager completion as sufficient proof of a successful Nuxt upgrade.

### 4.4 `nuxt.analyze`

`nuxt.analyze` owns Nuxt-specific build/bundle analysis intent and exposes the resulting Nuxt analysis evidence. Its purpose is inspection/analysis, not Quality-domain pass/fail or gate policy. Quality may consume relevant evidence without acquiring or transferring Nuxt analysis ownership.

### 4.5 `nuxt.cleanup`

`nuxt.cleanup` owns removal of Nuxt-specific generated/cache state that Nuxt can regenerate. It is deliberately narrower than `app.clean` and `app.reset`: it shall not become a generic application cleanup/reset operation and shall not remove unrelated application, layer, repository or user-authored state.

## 5. Explicit Non-Relocations

The following remain outside the Nuxt canonical surface:

- `app.create`, `app.prepare`, `app.develop`, `app.build`, `app.preview`, `app.generate`, `app.clean` and `app.reset` remain App-owned simple root-application intents;
- type checking, tests, lint, coverage and quality gates remain Quality-owned even when Nuxt-specific tooling supplies execution/evidence;
- Git operations remain Git-owned;
- documentation intent remains Docs-owned;
- Settings/environment intent remains Settings-owned;
- arbitrary project-declared script execution remains a bounded supporting mechanism rather than a Nuxt command namespace extension.

## 6. Root/Layer Targeting

Where an added Nuxt operation can validly target either the root application or a managed layer, target identity shall be explicit or deterministically resolved through the authoritative managed-project model before consequential execution. Reachability or Nuxt recognition does not grant targetability or mutation authority.

No Nuxt operation may silently apply the same mutation to every layer merely because the project is a monorepo or composition. Multi-target behaviour requires an explicitly defined operation/policy rather than implicit scope expansion.

## 7. Provider Independence

The canonical identities above are AppManager semantics, not aliases for one version of `nuxt`, `nuxi`, `npx`, `pnpm`, `npm`, `bun` or another provider syntax. Implementations may use appropriate Nuxt/package-manager mechanisms behind typed replaceable seams while preserving the owning command's AppManager preconditions, target policy, cancellation, validation and postconditions.

## 8. NCR Integration

NCR-1 shall fold this Design delta into the canonical Design owner. NCR-2 shall fold corresponding DD deltas into the Nuxt Domain/Nuxt Capability owners. NCR-3 shall fold implementation deltas into IS-16/IS-13. This clarification shall not survive as a parallel permanent normative layer once those integrations are complete.