# AppManager Version 1 App Command Model Clarification

> **Document type:** Design clarification
>
> **Status:** Active — temporary PBC-1 integration vehicle
>
> **Clarifies:** AppManager Design Specification Version 1
>
> **Normative level:** Design

## 1. Purpose

This clarification restores the intended Version 1 product boundary for the `app` domain before NCR begins physical corpus reduction.

AppManager was conceived to make routine operation of a Nuxt root application quick and accessible while reserving Nuxt-aware monorepo, layer-composition and framework-structural behaviour for the `nuxt` domain. The `app` command surface shall therefore remain deliberately simple even when AppManager internally performs richer policy, validation and orchestration than the underlying Nuxt/package-manager command.

## 2. Canonical Design Rule

The `app` domain owns **simple root-application lifecycle intent**.

Its public command surface shall expose familiar root-application operations without requiring the user to understand the managed monorepo's layer topology, repository topology or Nuxt composition mechanics.

The `nuxt` domain owns **Nuxt-aware structural and compositional intent**, including layer creation/integration/detachment, Nuxt configuration, module/framework structure, and complex monorepo/layer-specific operations.

A convenient underlying Nuxt, package-manager or `npx` command may implement or contribute to an `app` operation, but the provider command is not itself the semantic definition of the AppManager command.

## 3. Version 1 App Command Surface

The canonical Version 1 `app` commands are:

```text
app.create
app.prepare
app.develop
app.build
app.preview
app.generate
app.clean
app.reset
```

Their product meanings are:

| Command | Canonical user intent |
|---|---|
| `app.create` | Create a new managed root Nuxt application and establish the initial root-application state required by the selected creation profile. |
| `app.prepare` | Prepare an already-existing managed root application for normal development/use without scaffolding over it. |
| `app.develop` | Start the managed root application's development lifecycle. |
| `app.build` | Build the managed root application. |
| `app.preview` | Preview the managed root application's production build. |
| `app.generate` | Generate/prerender the managed root application where supported. |
| `app.clean` | Remove only recognised safely regenerable root-application cache/build state. |
| `app.reset` | Remove the broader approved regenerable installation/build state so the root application can subsequently be prepared again. |

## 4. Superseded App Identities

The following previous identities are not canonical Version 1 App commands:

- `app.initialise` — **REPLACED** by `app.prepare`; its existing-project readiness semantics are preserved under the clearer identity.
- `app.post-install` — **RELOCATED** from the public App command catalogue. Declared post-install lifecycle behaviour may remain a subordinate preparation/dependency lifecycle stage where required.
- `app.reinitialise` — **REMOVED as a canonical identity**. Reinitialisation is composition of `app.reset` followed by `app.prepare`, not a separate semantic primitive. Interaction adapters may offer a convenience action such as “reset and prepare again” without minting another canonical application command.
- `app.run-script` — **REMOVED from the canonical App command catalogue**. Bounded discovery/execution of explicitly selected project-declared scripts remains supporting functionality, but arbitrary project script names do not become App-domain semantic commands.

`app.generate` is **ADDED** as the simple root-application generation/prerender intent corresponding to the ordinary Nuxt application lifecycle.

## 5. Provider and Script Boundary

An App command may resolve to a project-declared package script, direct Nuxt executable invocation, `npx`-style framework invocation, or a richer AppManager orchestration according to managed-project evidence and effective configuration.

The semantic direction is always:

```text
user intent
  -> canonical AppManager command
  -> AppManager policy/orchestration
  -> bounded capability/provider mechanism
```

Provider mechanisms do not define application semantics merely because their command names resemble AppManager command names.

Declared project-script execution shall remain bounded to scripts actually declared by the managed project and shall not become arbitrary shell execution.

## 6. Nuxt-Domain Placement

Operations whose meaning depends on Nuxt structure or composition belong to `nuxt`, not `app`. This includes:

- layer creation, integration and detachment;
- Nuxt configuration inspection and mutation;
- module/framework-structure operations;
- advanced Nuxt tooling where the user intent is intrinsically Nuxt-specific;
- complex monorepo or layer-specific operations.

Candidate future Nuxt commands such as module addition, framework scaffolding, upgrade and bundle analysis shall be decided by the Nuxt-domain authority; this clarification does not mint those command identities.

Quality intent remains Quality-owned even where a Nuxt-aware capability implements it; for example, type checking does not become an App command merely because `nuxt typecheck` is an available provider mechanism.

## 7. Root-versus-Layer Boundary

`app.create` creates a new **root application**. It does not create a Nuxt layer.

Nuxt-layer creation remains `nuxt.create-layer` and is governed by the Nuxt domain.

## 8. NCR Integration

NCR-1 shall fold this Design rule into the canonical Design owner while reducing duplicate downstream restatement. NCR-2/NCR-3 shall reconcile the affected DD/Implementation identities and retire this temporary clarification when its semantics have been incorporated into the primary corpus.