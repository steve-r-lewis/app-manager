# Interaction Capabilities Contract Clarification

> **Status:** Active Implementation Specification clarification
>
> **Clarifies:** IS-1 — Application Runtime and Invocation; IS-22 — Interaction Adapters
>
> **Normative scope:** Version 1 adapter/application interaction-capability contract only

## 1. Purpose

This clarification resolves the Version 1 contract-name collision between IS-1 and IS-22. Both specifications currently declare a TypeScript interface named `InteractionCapabilities`, but the declarations represent different abstraction levels and have incompatible fields. They shall not be implemented as competing definitions of one shared type.

## 2. Canonical Application Contract

The `InteractionCapabilities` carried by the IS-1 `InvocationRequest` is the canonical application-boundary contract:

```ts
export interface InteractionCapabilities {
  readonly canRequestAdditionalInput: boolean;
  readonly canAcquireAuthorization: boolean;
  readonly canConsumeEvents: boolean;
  readonly canRequestCancellation: boolean;
  readonly canConsumeStructuredOutcome: boolean;
}
```

IS-1 owns this transport-neutral request contract because it defines the information the Application Runtime requires when normalizing and executing an invocation.

These flags describe available interaction mechanisms. They do not grant application authority, satisfy authorization by themselves, or transfer validation/policy/final-outcome ownership to an adapter.

## 3. IS-22 Adapter Capability Description

The six-field declaration currently shown by IS-22 is an adapter-local presentation/host capability description and shall be named `AdapterCapabilities` (or an implementation-equivalent non-conflicting local name), not `InteractionCapabilities`:

```ts
export interface AdapterCapabilities {
  readonly interactiveInput: boolean;
  readonly explicitConfirmation: boolean;
  readonly progressEvents: boolean;
  readonly cancellation: boolean;
  readonly structuredResults: boolean;
  readonly humanDiagnostics: boolean;
}
```

`humanDiagnostics` is presentation capability metadata and has no corresponding semantic grant in the IS-1 invocation request.

## 4. Required Mapping

IS-22's invocation-request builder shall map adapter-local capabilities to the IS-1 contract explicitly. The semantic mapping is:

| Adapter-local fact | IS-1 request capability |
|---|---|
| `interactiveInput` | `canRequestAdditionalInput` |
| `explicitConfirmation` | `canAcquireAuthorization` |
| `progressEvents` | `canConsumeEvents` |
| `cancellation` | `canRequestCancellation` |
| `structuredResults` | `canConsumeStructuredOutcome` |
| `humanDiagnostics` | no IS-1 capability field; presentation only |

The mapping is capability projection, not authority acquisition. In particular, `explicitConfirmation: true` means the adapter can acquire and return authorization evidence when requested; it does not mean the adapter may decide authorization sufficiency.

## 5. Implementation Binding

Until the primary IS documents are rationalised/folded forward, the following readings apply:

- references in IS-1 to `InteractionCapabilities` mean the five-field canonical application request contract;
- the six-field declaration in IS-22 §5 shall be read as `AdapterCapabilities`;
- `InteractionAdapter.capabilities` in IS-22 §4 is adapter-local metadata of type `AdapterCapabilities`;
- `invocation-request-builder.ts` is responsible for producing the canonical IS-1 `InvocationRequest.interaction` projection;
- no module shall define two incompatible exported types with the same semantic identity and rely on structural coincidence or import topology to disambiguate them.

## 6. Authority Boundaries

This correction does not alter DD-1 Application Engine authority, adapter presentation-only responsibility, command identity/catalogue ownership, managed scope/configuration ownership, domain policy, authorization semantics, or canonical outcome ownership.
