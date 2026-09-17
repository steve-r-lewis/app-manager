# App Command Model Functional Clarification

> **Document type:** Functional clarification
>
> **Status:** Active — temporary PBC-1 integration vehicle
>
> **Clarifies:** App Functional Specification Version 1
>
> **Governing Design clarification:** [AppManager Version 1 App Command Model Clarification](../../appmanager-version-1-app-command-model-clarification-v01.md)

## 1. Functional Binding

The App Functional Specification shall be read with the following corrected Version 1 command model:

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

Existing `FR-APP-*` obligations remain binding except where this clarification changes command identity or relocates composition/supporting mechanics. NCR-1 shall reconcile the primary Functional Specification without losing those obligations.

## 2. Corrected Functional Identities

### 2.1 Prepare

The observable behaviour currently specified for initialising an existing managed application is preserved but its canonical command identity is `app.prepare`, not `app.initialise`.

Preparation applies to an already-existing managed root application, shall not scaffold over that application, and may coordinate dependency readiness, environment-definition readiness and other approved preparation stages through their owning domains/capabilities.

### 2.2 Create

`app.create` remains distinct from preparation because its user intent is creation of a new root application. Creation owns the complete creation workflow required by the selected profile; it does not require the user to invoke `app.prepare` as a second command merely to complete ordinary creation.

Creation of Nuxt layers remains outside App ownership.

### 2.3 Generate

AppManager shall provide `app.generate` as the simple root-application generation/prerender lifecycle operation where the managed project supports it. Its concrete provider mechanism is resolved from project/effective-configuration evidence and is not fixed by this Functional clarification.

### 2.4 Reset and re-preparation

`app.reset` remains the stronger approved removal of regenerable installation/build state. The previous `app.reinitialise` identity is not retained as a separate canonical use case.

Where the user requests reset followed by preparation, AppManager may compose `app.reset` and `app.prepare` while preserving each operation's preconditions, authorization, effects, diagnostics and outcome semantics. Presentation of that composition does not create a ninth App command.

### 2.5 Post-install lifecycle

Project-declared post-install behaviour is not a standalone canonical App command. Where required for preparation, creation or dependency readiness, it may be executed as a subordinate lifecycle stage according to the project's declaration and the owning lifecycle/capability contracts.

### 2.6 Declared project scripts

Bounded execution of an explicitly selected project-declared package script remains supported functionality, but `app.run-script` is not a canonical App-domain semantic command.

The facility shall:

- discover only scripts declared by the managed project;
- require explicit selection/identity and applicable revision evidence;
- use the recognised package-manager/provider boundary;
- reject arbitrary shell text as App intent;
- preserve invocation, authorization, cancellation and structured-outcome rules;
- avoid promoting discovered script names into canonical AppManager commands.

Named App commands may use the same underlying declared-script execution facility when that is the correct provider mechanism.

## 3. App/Nuxt Functional Boundary

Simple root-application lifecycle intent belongs to App. Nuxt-aware structure/composition belongs to Nuxt.

Accordingly, layer creation/integration/detachment, Nuxt configuration semantics, module/framework structure and complex monorepo/layer-specific behaviour shall not be added to the App command catalogue.

Advanced Nuxt operations may be added to the Nuxt Functional authority only through deliberate Nuxt-domain specification; this clarification does not create new Nuxt command identities.

## 4. NCR Integration

NCR-1 shall replace obsolete App command identities in the primary Functional Specification, add the `generate` requirements without duplicating inherited invocation rules, preserve all still-valid `FR-APP-*` obligations, and retire this clarification once the primary owner contains the corrected semantics.