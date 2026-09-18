# Version 1 GUI and Portability Implementation Clarification

> **Document type:** Implementation clarification
>
> **Status:** Active — Pre-NCR Baseline Correction PBC-1
>
> **Clarifies:** IS-22 — Interaction Adapters and IS-23 — Build and Runtime Assembly; applies to IS-1 through IS-21 only where their existing typed architectural boundaries are implemented or consumed
>
> **Governing Design:** [AppManager Design Specification](../../appmanager-design-specification-v01.md) including [Interaction and Portability](../../appmanager-design-specification-v01.md#_4-operating-context-and-interaction-modes)
>
> **Governing Functional authority:** [Application Invocation Functional Specification](../../functional/application-invocation-functional-specification-v01.md) including [GUI Interaction](../../functional/application-invocation-functional-specification-v01.md#_9-4-version-1-graphical-interaction)

## 1. Purpose

IS-22 and IS-23 currently implement a closed Version 1 set of TUI + Headless adapters and describe GUI as future. That closed-set assumption conflicts with the restored Version 1 Design/Functional requirement.

This clarification binds the corrected implementation target before NCR begins. It does not require premature implementation of the future WebStorm plugin or a generic plugin/RPC framework.

## 2. Corrected IS-22 Version 1 Adapter Set

Where IS-22 states or implies that Version 1 provides two concrete interaction paths, “both adapters”, “TUI and Headless”, or GUI as a future adapter, the binding Version 1 interpretation is:

```text
Version 1 concrete IS-22 adapters
    - TUI
    - GUI
    - Headless
```

All three use only the IS-1 `AppManagerApplication` public surface for application discovery/invocation/cancellation/event/outcome semantics.

IS-22 shall therefore implement a GUI adapter alongside `tui/` and `headless/`, with shared request/discovery/outcome/diagnostic/event/authorization projections reused where appropriate.

A conforming target topology is:

```text
app/adapters/
    shared/
    tui/
    gui/
    headless/
```

The exact GUI framework/library remains an implementation choice to be resolved during implementation without changing application semantics. GUI framework objects shall remain inside the GUI adapter/presentation boundary and shall not become domain/capability contracts.

## 3. GUI Adapter Contract

The existing `InteractionAdapter` contract remains the common adapter port. GUI shall implement that port rather than create a parallel application API.

The existing interaction-capability model shall be applied to GUI as an interactive adapter. At minimum the GUI implementation must be able to declare and exercise, where supported by the host, interactive input, explicit confirmation, progress/event consumption, cancellation, structured results and human diagnostics.

Capability declaration remains descriptive; it does not grant application authority.

GUI discovery/navigation shall be built from `AppManagerApplication.discover(...)`. GUI invocation shall map graphical input to the shared adapter invocation/request builder and call `AppManagerApplication.invoke(...)`. GUI progress/state shall consume IS-1 events and GUI final presentation shall project the canonical application outcome.

## 4. GUI Presentation Boundary

GUI-specific modules may own:

- graphical application shell/window lifecycle;
- navigation and command grouping;
- forms, selectors and structured input controls;
- graphical confirmation controls;
- preview/proposed-effect views;
- progress/event views;
- structured result, diagnostic, effect and recovery views;
- presentation-local state that does not become application policy.

They shall not own domain workflows, command existence, availability decisions, managed scope, configuration precedence, authorization sufficiency, provider interpretation or final application acceptance.

No domain/capability/Application Core module shall import the selected GUI framework to implement application semantics.

## 5. Corrected IS-23 Assembly

IS-23 shall construct all three Version 1 IS-22 adapters through explicit composition:

```text
IS-23 composition root
    +--> IS-1 AppManagerApplication
    +--> IS-22 TUI adapter
    +--> IS-22 GUI adapter
    +--> IS-22 Headless adapter
```

The normal invocation path remains:

```text
host/launcher
    -> selected IS-22 adapter
    -> IS-1 AppManagerApplication
    -> canonical application outcome/events
    -> selected IS-22 projection
    -> host lifecycle
```

The launcher/composition root shall not become a fourth adapter. GUI launch mechanics may differ from terminal/headless launch mechanics, but they shall terminate at the same IS-22/IS-1 boundary.

## 6. Modular TypeScript Implementation Requirement

The finished Version 1 implementation shall use explicit TypeScript contracts at architectural seams and explicit dependency composition.

Implementation shall preserve, where defined by the governing DD/IS contracts:

- interface/type separation between consumers and concrete providers;
- provider-independent AppManager result/evidence types at capability boundaries;
- discriminated state/result models rather than ambiguous Boolean/string conventions where the existing IS contract defines distinct states;
- readonly/immutable request, plan, snapshot and evidence semantics where specified;
- constructor/factory/composition injection or equivalent explicit registration rather than hidden global authority;
- test-double/substitute injection at deliberately replaceable seams;
- no import-time workflow registration or provider selection that bypasses the composition root.

This clarification does not invent a generic base interface across semantically distinct capabilities. Existing DD/IS-specific contracts remain authoritative for their own semantics.

## 7. Replaceable Capability and Provider Seams

IS-4 through IS-13 already define bounded shared capabilities/provider seams. PBC-1 makes their implementation replaceability an explicit Version 1 portability constraint:

- consuming domains/application responsibilities depend on the owning AppManager-oriented capability contract;
- concrete Node/tool/SDK/provider types remain encapsulated where the owning IS already requires that boundary;
- the composition root selects the concrete Version 1 implementation;
- replacing a concrete implementation shall not require redefinition of command/domain semantics when the replacement satisfies the same owning contract.

This applies equally to interaction adapters: GUI, TUI and Headless depend on the IS-1 application contract rather than domain/provider implementations.

## 8. Future Cross-Language / WebStorm Compatibility

Version 1 does not implement a WebStorm plugin and does not select a future cross-language transport.

The implementation shall nevertheless avoid coupling application/domain semantics to concrete Node-only provider objects or UI libraries across defined architectural boundaries. A future WebStorm/JetBrains integration may use a bridge, alternate implementation, IPC/RPC boundary or other mechanism selected at that time.

Native TypeScript contracts remain the Version 1 implementation contracts. They are not required to be wire schemas. Future language interoperability shall adapt the semantic boundary rather than forcing Version 1 to implement speculative transport infrastructure.

## 9. Required Conformance Delta

In addition to existing IS-22/IS-23 tests, the corrected Version 1 implementation shall verify at minimum:

1. TUI, GUI and Headless all use the same IS-1 application port;
2. GUI does not call domains/capabilities/providers directly;
3. GUI discovery derives from IS-1 rather than a competing catalogue;
4. equivalent canonical intent across TUI/GUI/Headless preserves application semantics;
5. GUI confirmation/preview/progress/outcome presentation does not create competing semantics;
6. GUI framework dependencies remain isolated to the adapter/presentation boundary;
7. IS-23 explicitly composes the GUI adapter alongside TUI and Headless;
8. the composition root can substitute implementations at owning replaceable contracts for conformance tests;
9. provider-native types do not leak across the owning capability boundaries;
10. no WebStorm/JVM/RPC dependency is required for Version 1 conformance.

## 10. Current-Implementation Disposition Delta

The absence of a current GUI implementation is migration evidence, not authority to omit the Version 1 GUI. A new `app/adapters/gui/` implementation is required as part of the target Version 1 implementation.

Existing TUI/Headless migration dispositions remain valid except where they describe their pair as the complete Version 1 adapter set.

## 11. Integration

A direct-edit work package shall fold this local implementation delta into IS-22 and IS-23 and use references rather than propagating the portability rule throughout IS-1 through IS-21. Individual IS documents should be changed only where they contain a conflicting concrete-coupling statement or require a genuine local implementation delta.

Once the corrected implementation requirements are fully reachable from the primary IS documents, this clarification may be retired under normal clarification lifecycle rules.