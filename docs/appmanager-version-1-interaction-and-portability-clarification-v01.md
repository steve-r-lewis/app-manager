# AppManager Version 1 Interaction and Portability Clarification

> **Document type:** Design-level clarification
>
> **Status:** Active — Pre-NCR Baseline Correction PBC-1
>
> **Clarifies:** [AppManager Design Specification](appmanager-design-specification-v01.md), principally Sections 1.4, 2.2, 3.7–3.12, 4, 5 and 6
>
> **Authority:** This clarification restores previously agreed Version 1 Design criteria that were incompletely carried into the reconciled corpus. It does not create a new documentation-hierarchy level. Where the Design Specification uses provisional language inconsistent with this clarification, this clarification supplies the binding Version 1 interpretation until NCR-1 folds the criteria into the canonical Design owner.

## 1. Purpose

The Design Specification already establishes a shared application model, graphical and tool-integrated interaction, an Application Invocation Contract, presentation independence, capability boundaries and implementation-topology independence. During later decomposition, however, two intended Version 1 criteria were not preserved consistently: the GUI became described as merely proposed/future in some documents, and future IDE/plugin portability was not carried through as an explicit implementation-architecture constraint.

PBC-1 restores those criteria before physical normative-corpus reduction begins.

## 2. Version 1 Interaction Provisions

AppManager Version 1 shall provide three first-class end-user interaction provisions:

1. **TUI** — an interactive terminal user interface;
2. **GUI** — a graphical user interface providing the graphical/WYSIWYG interaction counterpart to the TUI; and
3. **Headless** — a deterministic non-interactive command-line/automation interface.

These are three projections of one AppManager application and one authoritative command/use-case model. They shall not maintain independent domain policy, workflow semantics, command catalogues, safety rules, managed-scope rules or application-level outcome semantics.

The Design Specification Section 4.4 phrase “A Graphical User Interface is proposed” is therefore interpreted for Version 1 as **“A Graphical User Interface is a required first-class Version 1 interaction mode.”**

## 3. GUI Design Intent

The GUI shall expose the same canonical AppManager command identities, discovery, validation, availability, authorization, preview, progress/event and outcome semantics available through the shared Application Invocation boundary.

“WYSIWYG counterpart to the TUI” means that graphical controls may provide richer direct manipulation and representation of the same application intent—for example persistent navigation, forms, selectors, structured editors, previews, project/state views, progress displays and graphical confirmation—without moving application semantics into graphical components.

The GUI is not required to reproduce terminal layout literally. Semantic equivalence is required; presentation equivalence is not.

A command that is part of the Version 1 application catalogue is not a different command because it is selected from a TUI menu, GUI control or Headless syntax. Adapter capability differences may affect how permitted input or authorization is acquired and how results are presented, but shall not create different application meaning.

## 4. Version 2 IDE / WebStorm Direction

A JetBrains WebStorm plugin is **not** a Version 1 deliverable. It remains a Version 2/future-host direction.

Version 1 shall nevertheless be architected so that future IDE/plugin hosting or integration does not require AppManager domain semantics, application policy or capability contracts to be rewritten merely because a different host or implementation language is required.

The Design Specification Section 4.5 statement that a WebStorm plugin is proposed is therefore retained only as future product direction, not as Version 1 scope.

No Version 1 requirement is created for a JetBrains SDK dependency, JVM implementation, language-neutral RPC system, plugin SDK, network service, separate process or predetermined cross-language transport.

## 5. Modular TypeScript Architecture

The finished publishable Version 1 codebase shall be a modular, interface-driven TypeScript application with explicit types and dependency direction at architectural boundaries.

Version 1 shall preserve clear separation between:

- interaction adapters and application semantics;
- Application Core and domain policy/orchestration;
- domains and shared capabilities;
- capability contracts and concrete provider implementations;
- AppManager-oriented contracts and provider-native/ecosystem-native representations;
- runtime composition and the responsibilities it composes.

Concrete dependencies shall be supplied through explicit composition, constructors, factories or equivalent typed registration seams rather than becoming hidden semantic singletons or import-time authority.

Where an architectural responsibility is deliberately replaceable, consuming code shall depend on its AppManager-oriented typed contract rather than on the concrete implementation mechanism.

## 6. Replaceability and Cross-Language Portability

Replaceability is required at deliberate architectural seams; universal pluggability is not.

A capability or provider implementation may use Node.js/TypeScript-specific mechanisms internally in Version 1. Its consumers shall not depend on those mechanisms where the governing architecture defines an AppManager-oriented boundary.

A future host may therefore replace an implementation, bridge to another runtime/language, or adapt the same semantic contract through an appropriate future transport without transferring application authority or redefining the owning domain/capability semantics.

This requirement does **not** require every internal TypeScript interface to be a wire protocol. Version 1 shall use strong native TypeScript contracts—including explicit interfaces/types, discriminated result/state models and readonly/immutable intent where appropriate. A future cross-language boundary may adapt those semantic contracts when such a boundary is actually required.

## 7. Composition and Dependency Direction

The target dependency direction is conceptually:

```text
TUI       GUI       Headless       future host
 |         |           |               |
 +---------+-----------+---------------+
                   |
          Application Invocation
                   |
            Application Core
                   |
        domain policy/orchestration
                   |
          typed capability seams
                   |
          typed provider seams
                   |
       concrete V1 implementations
```

The Version 1 GUI, TUI and Headless adapters shall depend on the application boundary. Domains shall not depend on those adapters. Domains/capabilities shall not import GUI/TUI libraries to implement application semantics. Concrete providers shall not become the public semantic model merely because the composition root selects them.

## 8. PBC-1 Downstream Binding

The existing Application Invocation Functional Specification already requires cross-mode equivalence for TUI, Headless, GUI and future host-tool paths, and DD-1.1 already defines a transport/topology-independent invocation boundary. Those requirements remain valid.

PBC-1 adds the missing binding that **GUI is a concrete Version 1 provision**, while IDE/WebStorm remains future scope, and that Version 1 implementation must preserve modular typed replaceability sufficient for future-host evolution.

The Functional and Implementation clarifications created by PBC-1 refine these restored Design criteria without duplicating ownership.

## 9. NCR Handoff

This clarification is intentionally temporary as a separate clarification. NCR-1 shall fold Sections 2–7 into their canonical Design locations, replace downstream restatement with references/local deltas, and retire this clarification once its semantic content is fully reachable from the canonical Design Specification.

NCR shall not reinterpret the restored criteria as optional merely because they were absent from portions of the pre-PBC corpus.