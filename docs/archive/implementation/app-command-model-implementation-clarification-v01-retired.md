# App Command Model Implementation Clarification — Retired

> **Status:** Retired
>
> This document has been superseded and is no longer authoritative. All information that remains relevant to the project has been dispositioned within the current documentation hierarchy.
>
> **Successor:** [IS-14 — App Domain Implementation Specification](../../implementation/is-14-app-domain-implementation-specification-v01.md) §5 (corrected 8-command identity set), §17 (Prepare), §21 (Post-Install as subordinate stage), §24.1 (Generate), §29 (Reset-and-Prepare composition) and §44 (declared-script-runner collaborator).
>
> **Disposition:** The corrected 8-command Version 1 App identity set (`create`, `prepare`, `develop`, `build`, `preview`, `generate`, `clean`, `reset`) has been applied directly to IS-14, building on [DD-3.1 — App Domain](../../dd_3_high_coupling_domains/dd-3-1-app-domain-detailed-design-v01.md), which already accepted this exact set. `app.initialise` was renamed `app.prepare`; `app.post-install` and the former `app.run-script` mechanism became subordinate/internal (a lifecycle stage and the `declared-script-runner` collaborator respectively, neither independently invocable); `app.reinitialise` was removed as a registered use case in favour of an adapter-composed workflow over `app.reset` and `app.prepare`; `app.generate` was added as a new named lifecycle action alongside Develop/Build/Preview. No information from this clarification remains solely recorded here.

---

*Original clarification content preserved below for provenance.*

# App Command Model Implementation Clarification

> **Document type:** Implementation clarification
>
> **Status:** Active — temporary PBC-1 integration vehicle
>
> **Clarifies:** IS-14 — App Domain Implementation Specification
>
> **Primary Detailed Design contract:** [App Domain Command Model Detailed Design](../../dd_3_high_coupling_domains/dd-3-1-app-domain-detailed-design-v01.md#_7-domain-contract-model)

## 1. Canonical Implementation Identities

IS-14 shall implement and register exactly these Version 1 App command IDs:

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

The existing `app.initialise`, `app.post-install`, `app.reinitialise` and `app.run-script` IDs shall not be registered as canonical Version 1 application commands.

## 2. Implementation Dispositions

| Existing/current concept | Disposition | Implementation consequence |
|---|---|---|
| `app.initialise` | REPLACE | Rename/rework the existing-root use case and types as `app.prepare`; preserve existing-root readiness and no-scaffold-over-existing-target guarantees. |
| `app.post-install` | RELOCATE | Retain declaration-aware post-install execution only as a subordinate lifecycle/dependency stage where required. |
| `app.develop` | RETAIN | Preserve named development lifecycle implementation. |
| `app.build` | RETAIN | Preserve named build lifecycle implementation. |
| `app.preview` | RETAIN | Preserve named preview lifecycle implementation. |
| `app.clean` | RETAIN | Preserve bounded regenerable-state cleanup. |
| `app.reset` | RETAIN | Preserve stronger approved regenerable installation/build reset. |
| `app.reinitialise` | REMOVE IDENTITY | Do not implement/register a separate canonical use case; compose reset then prepare through normal application invocation when requested by an adapter/workflow. |
| `app.create` | RETAIN | Preserve new-root creation and make the selected profile's required initial establishment part of creation orchestration. |
| `app.run-script` | REMOVE IDENTITY / RETAIN MECHANISM | Keep bounded declared-script discovery/invocation as an internal/supporting typed service, not an App command. |
| `app.generate` | ADD | Implement/register root-application generation/prerender lifecycle intent with project-resolved provider mapping and normal App stage acceptance. |

## 3. Suggested IS-14 Module Shape

The target implementation should contain named use cases only for the eight canonical commands, for example:

```text
app/domains/app/
  contracts/
  catalogue/
  lifecycle/
  use-cases/
    create-app.ts
    prepare-app.ts
    develop-app.ts
    build-app.ts
    preview-app.ts
    generate-app.ts
    clean-app.ts
    reset-app.ts
  collaborators/
    declared-script-runner.ts
    project-lifecycle-reader.ts
    app-resource-planner.ts
    settings-domain-port.ts
    git-domain-port.ts
    nuxt-domain-port.ts
```

Names remain subject to normal implementation naming conventions; the architectural requirement is the command/service separation, not these exact filenames.

## 4. Provider Resolution

A named App use case may use a declared package script or direct Nuxt/package-manager executable form as the bounded provider mechanism. Provider selection shall derive from managed-project/effective-configuration evidence and shall not be encoded as the command's semantic identity.

The declared-script runner shall continue to construct bounded direct process requests through IS-5 and shall not accept arbitrary shell strings as App intent.

## 5. Reset-and-Prepare Composition

An interaction adapter may present a convenience operation such as “Reset and prepare again”. The adapter shall express this as an application workflow over the canonical `app.reset` and `app.prepare` intents. It shall not call implementation services directly or manufacture `app.reinitialise` as an alternate command ID.

## 6. Nuxt Placement

IS-14 shall not implement Nuxt layer/composition/configuration/module/advanced-framework commands merely because their provider is `nuxt`/`npx`. Those operations belong to IS-16 and the Nuxt capability path when and if their canonical Nuxt identities are specified.

## 7. Integration

A direct-edit work package shall fold these implementation deltas into IS-14, remove obsolete command registration/contracts, preserve the bounded declared-script mechanism, and retire this clarification.
