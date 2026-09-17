# App Domain Command Model Detailed Design Clarification

> **Document type:** Detailed Design clarification
>
> **Status:** Active — temporary PBC-1 integration vehicle
>
> **Clarifies:** DD-3.1 — AppManager App Domain Detailed Design
>
> **Functional authority:** [App Command Model Functional Clarification](../../../functional/clarifications/app-command-model-functional-clarification-v01.md)

## 1. Corrected DD-3.1 Command Set

DD-3.1 shall refine exactly these Version 1 App-domain canonical identities:

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

The App Domain continues to own root-application lifecycle intent, policy and orchestration while delegating bounded mechanics to their owning domains/capabilities.

## 2. Lifecycle Design Consequences

- Existing `initialise` planning/acceptance behaviour becomes `prepare`; its existing-root safety semantics are preserved.
- `create` remains a new-root workflow and includes the initial establishment stages required by the selected creation profile without requiring a separate public `prepare` invocation.
- `generate` becomes a named root-application lifecycle use case whose provider mechanism is project-resolved.
- `reinitialise` is not a separate use-case implementation. A requested reset-and-prepare convenience flow composes the canonical `reset` and `prepare` intents through the Application Engine rather than bypassing their individual contracts.
- post-install execution becomes subordinate lifecycle-stage behaviour where required, not a public App use-case identity.
- declared-script discovery/execution remains a bounded supporting collaborator/mechanism and not a canonical App use case.

## 3. Supporting Script Execution

DD-3.1 may retain a typed collaborator for declared project-script discovery and invocation. That collaborator shall accept project-declared script identity/evidence rather than arbitrary shell text and shall delegate actual process execution through the Process Execution capability.

The supporting collaborator does not own App lifecycle semantics and discovered script names do not extend the canonical application catalogue.

## 4. Nuxt Boundary

DD-3.1 shall not absorb layer, Nuxt-configuration, module/framework-structure or complex monorepo composition behaviour. Those intents refine through the Nuxt domain and its capabilities.

## 5. NCR Integration

NCR-2 shall fold these deltas into DD-3.1 and retire this clarification after the primary DD reflects the corrected command model.