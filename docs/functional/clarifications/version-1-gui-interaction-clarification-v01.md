# Version 1 GUI Interaction Functional Clarification

> **Document type:** Functional clarification
>
> **Status:** Active — Pre-NCR Baseline Correction PBC-1
>
> **Clarifies:** [Application Invocation Functional Specification](../application-invocation-functional-specification-v01.md), principally FR-INV-001, FR-INV-003–005, FR-INV-008, FR-INV-016–019, FR-INV-023–031 and shared outcome behaviour
>
> **Governing Design:** [AppManager Design Specification](../../appmanager-design-specification-v01.md) as clarified by [AppManager Version 1 Interaction and Portability Clarification](../../appmanager-version-1-interaction-and-portability-clarification-v01.md)

## 1. Purpose

The Application Invocation Functional Specification already includes GUI in the cross-mode equivalence contract. This clarification restores the missing Version 1 lifecycle binding: GUI is a concrete Version 1 interaction provision, not merely a future adapter.

It adds only GUI-specific observable functional delta. The shared invocation requirements remain owned by the Application Invocation Functional Specification and are not restated here.

## 2. Version 1 GUI Availability

**FR-INV-GUI-001 — Concrete Version 1 provision**  
AppManager Version 1 shall provide a graphical user interface capable of discovering and invoking the authoritative Version 1 AppManager command/use-case catalogue through the shared Application Invocation semantics.

**FR-INV-GUI-002 — No GUI command model**  
The GUI shall not maintain an independent command catalogue or alternative application workflow implementation. GUI command availability and identity shall be projections of the authoritative application model.

## 3. WYSIWYG Interaction

**FR-INV-GUI-003 — Graphical interaction projection**  
For application information that can be represented graphically, the GUI shall present suitable graphical controls or views for acquiring permitted input and presenting application state, proposed effects, progress, diagnostics and outcomes without requiring the user to interpret terminal formatting or Headless output syntax.

**FR-INV-GUI-004 — Semantic rather than layout equivalence**  
A GUI operation expressing materially equivalent canonical intent and authoritative context to TUI or Headless invocation shall preserve the same validation, policy, managed-scope, safety, authorization and application-outcome semantics. The graphical interaction flow and layout may differ.

**FR-INV-GUI-005 — Structured input provenance**  
Values acquired through GUI forms, selectors, editors or other controls shall enter the same structured invocation and validation path as equivalent caller-supplied values from other adapters. Widget identity, visual position or selected display label shall not become semantic command identity.

## 4. Confirmation, Preview and Progress

**FR-INV-GUI-006 — Graphical authorization acquisition**  
Where an operation requires explicit authorization or confirmation, the GUI may acquire it through a graphical control, but the resulting evidence shall remain subject to the same invocation/effect binding and stale-authorization rules as other interaction modes.

**FR-INV-GUI-007 — WYSIWYG preview**  
Where a use case exposes preview/proposed effects or structured proposed content, the GUI shall be capable of presenting that information graphically without representing proposed effects as already applied.

**FR-INV-GUI-008 — Graphical progress and outcome**  
The GUI may render progress persistently or graphically, but intermediate visual completion shall not determine application success. Final state, diagnostics, partial/cancelled state, effects and recovery information shall derive from canonical application events/outcomes.

## 5. Interaction Capability Differences

**FR-INV-GUI-009 — Interactive capability**  
The GUI is an interactive adapter and may acquire use-case-permitted missing input, explicit authorization and cancellation requests. Possessing those interaction capabilities shall not grant application authority or weaken validation/safety requirements.

**FR-INV-GUI-010 — TUI/GUI parity without presentation duplication**  
A Version 1 use case exposed interactively through the TUI shall be exposable through the GUI when its authoritative availability permits it. A presentation limitation shall not silently redefine the application catalogue; any deliberate adapter projection/subset shall be identified as such.

## 6. Future IDE/Plugin Scope

IDE/host-tool equivalence requirements already present in the Application Invocation Functional Specification remain future-host compatibility requirements. PBC-1 does not make a WebStorm plugin a Version 1 deliverable.

## 7. NCR Handoff

NCR-1 shall integrate these GUI-specific requirements into the canonical Application Invocation Functional Specification, preserving their identities or an explicitly traceable equivalent disposition, and retire this clarification once the requirements are fully reachable from the primary Functional authority.