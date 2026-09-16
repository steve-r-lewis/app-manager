# Nuxt Domain Operation Identity Clarification

> **Status:** Active Detailed Design clarification
>
> **Clarifies:** DD-3.3 — AppManager Nuxt Domain Detailed Design
>
> **Related implementation:** IS-16 — Nuxt Domain Implementation Specification
>
> **Normative scope:** Version 1 Nuxt-domain operation identity only

## 1. Purpose

This clarification resolves a Version 1 identity inconsistency between DD-3.3 and IS-16.

DD-3.3 `DD-NUXT-005` lists both `inspect` and `inspect_layer_state` among Version 1 Nuxt operation identities. The Nuxt Functional Specification requires Nuxt facts, layer identity, Nuxt relationship facts and lifecycle/integration state to be exposed, but does not require a second independently invocable layer-state operation. IS-16 consequently defines `nuxt.inspect` as the canonical inspection use case and carries layer-lifecycle interpretation in its result model rather than registering a separate `nuxt.inspect-layer-state` command.

## 2. Clarified Version 1 Operation Set

The canonical Version 1 Nuxt-domain operation identities are:

```text
inspect
inspect_configuration
list_configuration
add_configuration
remove_configuration
create_layer
integrate_layer
detach_layer
```

`inspect_layer_state` is **not** a ninth independently invocable Version 1 operation identity.

Layer lifecycle, integration and repository-relationship state remain required Nuxt-domain facts. They are exposed through the `inspect` use case when relevant to the requested target and through structured results of layer creation/integration/detachment where those operations change or evaluate such state.

## 3. Functional Binding

This clarification preserves rather than reduces the observable requirements in `FR-NUXT-013`–`FR-NUXT-020` and `FR-NUXT-089`–`FR-NUXT-092`:

- Nuxt-specific facts remain observable without mutation;
- root and layer identities remain distinguishable;
- Nuxt composition and Git repository relationships remain distinct;
- unsupported/ambiguous state remains explicit;
- lifecycle/integration state remains structured evidence.

The correction concerns command/use-case identity, not removal of lifecycle-state semantics.

## 4. Implementation Binding

IS-16's eight canonical `nuxt.*` command identities are conforming with this clarification. Its statement that those identities map to DD-3.3 shall be read together with this clarification.

No interaction adapter may introduce `nuxt.inspect-layer-state` as a separate semantic owner merely because the superseded DD-3.3 list contained the internal label `inspect_layer_state`. A presentation alias, if temporarily retained for compatibility, must resolve to `nuxt.inspect` and must not create distinct policy, availability, validation, execution, or outcome semantics.

## 5. Authority Boundaries

This clarification does not change DD-1 authority, DD-2.10 Nuxt Capability ownership, Nuxt-domain acceptance semantics, managed scope, configuration authority, Git/Nuxt relationship separation, or final Application Engine acceptance.
