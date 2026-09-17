# Nuxt Command Model Functional Clarification

> **Document type:** Functional clarification
>
> **Status:** Active — temporary PBC-1 integration vehicle
>
> **Primary Functional authority:** [Nuxt Functional Specification](../nuxt-functional-specification-v01.md)
>
> **Design binding:** [Version 1 Nuxt Command Model Clarification](../../appmanager-version-1-nuxt-command-model-clarification-v01.md)

## 1. Purpose

This clarification supplies the Functional delta required by the corrected Version 1 Nuxt command surface. Existing `FR-NUXT-*` requirements remain authoritative except where this clarification adds the five new observable Nuxt intents or corrects the App/Nuxt boundary after the App-command correction.

NCR-1 shall integrate these requirements into the primary Functional owner and retire this temporary clarification.

## 2. Corrected Canonical Surface

The Nuxt functional domain shall expose the following canonical Version 1 identities:

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

Aliases/provider commands shall not create additional canonical identities.

## 3. General Requirements for Added Operations

### PBC-FR-NUXT-001 — Explicit managed target
Where an added Nuxt operation supports root/layer targeting, AppManager shall resolve the intended managed root application or managed layer before consequential execution.

### PBC-FR-NUXT-002 — No implicit monorepo expansion
Selecting one root application or layer shall not silently cause the same operation to execute against other layers or repositories merely because they participate in the same monorepo/composition.

### PBC-FR-NUXT-003 — Intent over provider syntax
The added operations shall expose stable Nuxt-specific AppManager intent rather than raw `nuxt`, `nuxi`, package-manager or shell syntax.

### PBC-FR-NUXT-004 — Provider completion is evidence
Successful provider/package-manager execution shall not by itself establish successful completion of the requested Nuxt use case. Applicable Nuxt postconditions shall be evaluated before successful domain completion is represented.

## 4. `nuxt.add`

### PBC-FR-NUXT-005 — Supported scaffold use case
AppManager shall provide `nuxt.add` for adding a supported Nuxt framework artefact to an explicitly selected managed Nuxt target.

### PBC-FR-NUXT-006 — Explicit artefact intent
The supported artefact class, requested identity/name and target shall be explicit or deterministically resolvable before creation begins.

### PBC-FR-NUXT-007 — Not generic file creation
`nuxt.add` shall not expose arbitrary file paths/content as a generic file-generation API. Only explicitly supported Nuxt scaffold classes with defined placement and validity semantics are eligible.

### PBC-FR-NUXT-008 — Collision and postcondition
AppManager shall refuse or deliberately resolve unsafe target collisions and shall verify that the requested supported Nuxt artefact is established at the intended target before reporting success.

## 5. `nuxt.add-module`

### PBC-FR-NUXT-009 — Module-addition use case
AppManager shall provide `nuxt.add-module` for adding a selected supported Nuxt module to an explicitly selected managed root application or layer.

### PBC-FR-NUXT-010 — Composed module intent
Where module addition requires package dependency work and/or Nuxt configuration change, AppManager shall coordinate those subordinate effects as one module-addition intent without transferring package/configuration semantics into provider output.

### PBC-FR-NUXT-011 — Existing/conflicting module state
AppManager shall detect already-satisfied or conflicting supported module state where determinable and shall not blindly duplicate dependency/configuration entries.

### PBC-FR-NUXT-012 — Module postcondition
Successful module addition requires the selected target to satisfy the supported module-addition postcondition, not merely successful dependency installation.

## 6. `nuxt.upgrade`

### PBC-FR-NUXT-013 — Explicit upgrade use case
AppManager shall provide `nuxt.upgrade` for a selected managed Nuxt target using an explicit supported requested version/range or upgrade policy.

### PBC-FR-NUXT-014 — No implicit latest
An omitted version shall not silently authorize upgrade to the newest available release unless an explicitly documented selected policy has that meaning.

### PBC-FR-NUXT-015 — No implicit cross-layer upgrade
Upgrading the root application shall not automatically upgrade independently managed layers, and upgrading one layer shall not automatically upgrade the root or sibling layers.

### PBC-FR-NUXT-016 — Upgrade validation
After subordinate dependency/provider work, AppManager shall inspect applicable Nuxt state and report success only when the selected target satisfies the requested supported upgrade postcondition.

## 7. `nuxt.analyze`

### PBC-FR-NUXT-017 — Nuxt analysis use case
AppManager shall provide `nuxt.analyze` for Nuxt-specific application/bundle analysis of an explicitly selected supported Nuxt target.

### PBC-FR-NUXT-018 — Analysis evidence
The result shall expose structured analysis evidence/diagnostics where supported and shall distinguish technical inability to analyze from analysis findings.

### PBC-FR-NUXT-019 — Quality boundary
`nuxt.analyze` shall not establish a Quality pass/fail/gate outcome unless a separate Quality use case explicitly consumes the resulting evidence under Quality-owned policy.

## 8. `nuxt.cleanup`

### PBC-FR-NUXT-020 — Nuxt-generated-state cleanup
AppManager shall provide `nuxt.cleanup` for removing supported Nuxt-generated/cache state that is regenerable by Nuxt for an explicitly selected managed target.

### PBC-FR-NUXT-021 — Bounded cleanup
Nuxt cleanup shall not remove user-authored source, unrelated application state, repositories, independently managed layers, environment definitions, dependencies or other resources outside the defined Nuxt-generated-state classes.

### PBC-FR-NUXT-022 — App boundary
`nuxt.cleanup` shall remain narrower than App-owned `app.clean` and `app.reset`; App workflows may coordinate Nuxt cleanup where their own policy requires it without transferring App intent to Nuxt.

## 9. Preserved Domain Ownership

The App-command correction remains binding: simple root lifecycle commands stay App-owned. Type-check/test/lint/coverage/gate intents stay Quality-owned. Git, Docs and Settings retain their established semantic ownership. Provider command availability does not alter those ownership decisions.