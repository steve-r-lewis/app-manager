# AppManager Design Specification

## Document Purpose

This document is the root Design Specification for AppManager.

It defines the intended system at the highest project-design level beneath the `project-documentation-guide-v01.md` documentation authority. It establishes AppManager's purpose, scope, conceptual architecture, interaction model, major subsystems, functional domains, configuration model, managed-project model, core workflows, design principles, architectural invariants, and extensibility model.

This document describes what AppManager is intended to be. It is not an implementation audit and should remain substantially independent of transient source-code structure, implementation status, temporary migration work, or individual method signatures.

Detailed behaviour belongs in Functional Specifications. Component and command internals belong in Detailed Design Specifications. Concrete source-level wiring and implementation status belong in Implementation Specifications.

---

## 1. Purpose and Scope

### 1.1 Purpose

AppManager is a domain-oriented application for managing the lifecycle, structure, configuration, quality, documentation, source control, automation, and evolution of Nuxt monorepo applications and their constituent layers.

Its purpose is to provide a coherent management plane above the individual tools normally used to develop and maintain a complex Nuxt application.

Rather than requiring users or automation systems to coordinate package-manager commands, Git operations, repository relationships, configuration files, documentation tooling, quality checks, code transformation, templates, and AI-assisted workflows independently, AppManager provides a unified application model through which those capabilities can be invoked, governed, and coordinated consistently. [§6.2](#_6-2-application-engine-authority) defines the authority governing that coordination.

AppManager is intended to support both day-to-day development operations and repeatable project-management workflows while preserving user control over the underlying project and repositories.

### 1.2 Scope

AppManager's design scope includes:

- application lifecycle management;
- Nuxt application and layer management;
- Git and repository management;
- project and application configuration;
- documentation generation and maintenance;
- code inspection and controlled source transformation;
- quality assurance and test execution;
- reusable project and file generation;
- licensing support;
- AI-assisted project workflows;
- bounded project-maintenance operations;
- interactive and automated operation;
- structured programmatic invocation for interaction adapters and external integrations;
- coordination of ecosystem-native capabilities through defined application boundaries;
- extensibility through commands, interaction adapters, capability providers, and cooperating architectural subsystems.

### 1.3 System Boundary

AppManager operates as a management application around a target project.

It coordinates Nuxt, Git, package managers, test frameworks, operating-system resources and external providers as described in [§6.6](#_6-6-capability-boundaries-and-providers). Those tools remain responsible for their specialist functions.

AppManager should preserve a clear distinction between:

- the AppManager application itself;
- AppManager application semantics and policy;
- AppManager-owned configuration, state, templates, and logs;
- specialised capabilities delegated to external tools, services, or capability providers;
- the target project being managed;
- external tools and services used by AppManager;
- remote repositories and external providers.

### 1.4 Non-Goals

AppManager does not replace Nuxt's framework responsibilities or the underlying source-control system, and must not conceal project structure behind an opaque proprietary representation. Core functionality must remain usable without a graphical interface.

The constraints governing automation, authority, provider representations, consequential changes and AI use are defined at [§4.3](#_4-3-headless-mode), [§6.2](#_6-2-application-engine-authority), [§6.6](#_6-6-capability-boundaries-and-providers), [§9.9](#_9-9-non-destructive-ownership-and-unmanaged-content) and [§11.10](#_11-10-ai-assisted-workflow).

---

## 2. System Vision and Objectives

### 2.1 Vision

AppManager should provide a dependable, extensible, and progressively automatable control surface for sophisticated Nuxt monorepo development.

The application should allow a project to be managed as a coherent system rather than as a loose collection of scripts and unrelated development tools.

The capability model in [§6](#_6-application-architecture) supports that product vision.

### 2.2 Primary Objectives

The product objectives are to make routine development and project-management work accessible, predictable and progressively automatable. The following sections develop those objectives at their owning locations:

- interaction and invocation: [§4](#_4-operating-context-and-interaction-modes) and [§5](#_5-command-model);
- application responsibilities and licensing support: [§6](#_6-application-architecture) and [§13.4](#_13-4-engine-registry-and-declarative-resource-pattern);
- source understanding and change: [§7](#_7-code-intelligence-and-transformation-architecture);
- configuration and project understanding: [§8](#_8-configuration-and-state-architecture) and [§9](#_9-managed-project-and-project-context-model);
- product operations and their coordination: [§10](#_10-functional-domains) and [§11](#_11-core-system-workflows);
- future growth: [§13](#_13-extensibility-model).

Project ownership, transparency and reversibility should be preserved wherever practical.

### 2.3 Design Priorities

When design choices conflict, AppManager should generally favour:

- correctness over convenience;
- explicit behaviour over hidden behaviour;
- non-destructive operations over destructive shortcuts;
- shared capabilities over duplicated implementations;
- defined architectural boundaries over incidental implementation coupling;
- application-level semantics over implementation-specific representations;
- delegated capability execution without delegated application authority;
- structured transformation over unbounded textual mutation;
- configuration resolution over hard-coded assumptions;
- reusable capabilities and abstractions over command-specific or adapter-specific duplication;
- observable operations over silent side effects;
- deterministic automation over interaction-dependent behaviour;
- documented architectural responsibility over accidental coupling.

---

## 3. Terminology and Naming Conventions

### 3.1 Application Name

The application name and project naming conventions follow the [Project Documentation Guide §3](project-documentation-guide-v01.md#_3-project-naming-conventions).

### 3.2 Target Project

The **target project** is the project currently being managed by AppManager.

It may contain a root Nuxt application, one or more Nuxt layers, project-owned configuration, tests, documentation, repositories, and related development assets.

### 3.3 Tool Root

The **tool root** is the AppManager application environment from which global AppManager resources and defaults may be resolved.

### 3.4 Project Root

The **project root** is the root directory of the target project being managed.

### 3.5 Managed Layer

A **managed layer** is a Nuxt layer recognised by AppManager as part of the target project's managed application structure.

Its relationship to the root application is defined in [§9.3](#_9-3-root-application-and-managed-layers).

### 3.6 Command

A **command** represents an invokable AppManager application capability within a functional domain.

Command responsibilities are defined in [§5.3](#_5-3-command-responsibilities).

### 3.7 Interaction Mode

A user-facing or automation-facing way of operating AppManager. [§4](#_4-operating-context-and-interaction-modes) defines the supported provisions and their relationship.

### 3.8 Interaction Adapter

The application-boundary component connecting a caller or host to AppManager. Its responsibilities are defined in [§4.6](#_4-6-presentation-independence).

### 3.9 Application Invocation Contract

The caller/application boundary defined in [§5.2](#_5-2-application-invocation-contract).

### 3.10 Application Engine

The application responsibility whose authority is defined in [§6.2](#_6-2-application-engine-authority).

### 3.11 Application Capability

A coherent function available to realise an application use case or support another responsibility; [§6.3](#_6-3-application-capabilities-and-architectural-subsystems) explains its architectural placement.

### 3.12 Capability Boundary

The separation between application semantics and specialist mechanics defined in [§6.6](#_6-6-capability-boundaries-and-providers).

### 3.13 Capability Provider

An implementation supplying specialist work through a [capability boundary (§6.6)](#_6-6-capability-boundaries-and-providers).

### 3.14 External Provider

An **external provider** is a service or platform outside AppManager's architectural ownership that AppManager may use to realise or support a capability, such as an AI service or repository-hosting service.

External providers are distinct from the AppManager capability-provider abstraction: an AppManager capability provider may encapsulate access to one or more external providers while preserving AppManager-oriented semantics and boundaries.

### 3.15 Architectural Subsystem

An **architectural subsystem** is a coherent family of responsibilities that contributes to AppManager's application capabilities.

[§6.3](#_6-3-application-capabilities-and-architectural-subsystems) explains their collaboration model.

---

## 4. Operating Context and Interaction Modes

### 4.1 Operating Model

Version 1 shall provide three first-class end-user provisions: an interactive terminal TUI, a graphical/WYSIWYG GUI, and a deterministic non-interactive Headless command-line/automation interface. [§4.6](#_4-6-presentation-independence) governs their relationship to the application.

The following explanatory diagram locates interaction adapters between callers and the application.

The interaction model is conceptually:

```text
                          AppManager

             interaction modes / host integrations

       tui      headless      gui      ide / tools
        |          |           |            |
        +----------+-----------+------------+
                           |
                           v
                 interaction adapters
                           |
                           v
              application invocation contract
                           |
                           v
                   application engine
```

This diagram intentionally stops at the Application Engine boundary. Section 5 defines the command and use-case model within that boundary, while Section 6 defines the internal application architecture through which capabilities are coordinated and realised.

The adapters shown here are governed by [§4.6](#_4-6-presentation-independence).

### 4.2 TUI

The Text User Interface is an interactive terminal mode realised through a terminal-facing interaction adapter.

It should support:

- command discovery;
- interactive selection;
- prompts where required information is not already resolvable;
- status and progress feedback;
- confirmation of consequential operations;
- human-readable results and errors.

The TUI binds these interactions to [§5.2](#_5-2-application-invocation-contract).

### 4.3 Headless Mode

Headless mode provides deterministic non-interactive operation suitable for:

- scripts;
- automation;
- CI/CD;
- scheduled operations;
- repeatable development workflows;
- integration with other tools.

The caller supplies intent through automation inputs and resolved context; [FR-INV-020–022](functional/application-invocation-functional-specification-v01.md#fr-inv-020) defines the observable non-interactive contract.

Headless operation uses the structured boundary in [§5.2](#_5-2-application-invocation-contract).

Headless operation and the Application Invocation Contract are related but distinct concerns. Headless mode defines non-interactive operation; the invocation contract defines the structured application boundary through which callers express command intent and receive execution information.

### 4.4 GUI

The GUI is the graphical/WYSIWYG counterpart to the TUI. It may use persistent navigation, forms, selectors, structured editors, previews, project/state views, progress displays and graphical confirmation. It need not reproduce terminal layout.

Its observable catalogue access, graphical input, preview and parity obligations are defined in [Application Invocation §9.4](functional/application-invocation-functional-specification-v01.md#_9-4-version-1-graphical-interaction). The shared adapter boundary is [§4.6](#_4-6-presentation-independence).

### 4.5 IDE and Host-Tool Integrations

A JetBrains WebStorm plugin is the first proposed Version 2/future IDE integration, outside Version 1 delivery. It would contribute context such as the current project, selected file/directory, active editor, layer or repository through the adapter model in [§4.6](#_4-6-presentation-independence).

Version 1 shall support future host evolution without requiring domain semantics, application policy or capability contracts to be rewritten solely for a different host or implementation language. [§6.10](#_6-10-modular-typescript-and-future-host-portability) defines the corresponding architectural seams. This creates no Version 1 JetBrains SDK, JVM, plugin SDK, network service, separate-process or predetermined cross-language transport requirement.

### 4.6 Presentation Independence

Interaction adapters own presentation, host lifecycle integration, context acquisition and permitted input/confirmation collection. They translate those concerns into the shared invocation boundary and render structured application information; they should remain thin where practical.

Commands and application capabilities must not inherently depend on a presentation mode or host. Adapters shall not reproduce, bypass or redefine domain policy, workflow semantics, canonical command catalogues, configuration or repository policy, code-intelligence policy, safety, managed scope or application-level outcomes. Their presentation and interaction capabilities may differ without changing application meaning.

The Functional consequence is specified by [FR-INV-017–019](functional/application-invocation-functional-specification-v01.md#_9-interaction-modes-and-functional-equivalence).

---

## 5. Command Model

### 5.1 Domain-Oriented Command Model

Within the Application Engine, AppManager is organised around functional domains containing commands that represent application use cases.

The command model is the primary expression of command identity and use-case intent behind the invocation boundary. [§5.3](#_5-3-command-responsibilities) defines the responsibilities illustrated below.

Conceptually:

```text
      application invocation contract
                 |
                 v
          application engine
                 |
                 v
      command discovery and dispatch
                 |
                 v
          functional domain
                 |
                 v
          command / use case
                 |
                 v
  application capability coordination
```

The command model defines application intent and authority, not the internal topology of the capabilities that realise an operation. Section 6 defines those architectural responsibilities and boundaries.

### 5.2 Application Invocation Contract

The Application Invocation Contract provides the common structured boundary between interaction adapters or external integrations and the Application Engine command model.

At the Design Specification level, the contract must be capable of representing:

- command identity;
- invocation context and scope;
- caller-supplied inputs and options;
- resolved project context where relevant;
- structured success and failure outcomes;
- diagnostics and machine-consumable result information;
- progress or execution events where a use case requires them;
- cancellation where supported by the underlying operation;
- deterministic behaviour suitable for automation;
- evolution of the contract without requiring presentation-specific command implementations.

The contract carries intent and execution information under [§6.2](#_6-2-application-engine-authority).

Human-readable presentation is an adapter responsibility and must not be the only representation of an operation's outcome where structured invocation is supported.

This specification deliberately does not prescribe whether the contract is realised through process standard input/output, an in-process interface, IPC, RPC, HTTP, sockets, or another transport. Serialization, transport, versioning mechanics, schemas, and concrete execution protocols belong in lower-level specifications.

### 5.3 Command Responsibilities

A command should represent coherent user/automation intent, receive or resolve sufficient context, validate the request and coordinate the capabilities needed by that use case. It binds that intent to [§6.2](#_6-2-application-engine-authority), its project targets to [§9.7](#_9-7-managed-scope-and-operation-targeting), its inputs to [§8.2](#_8-2-configuration-resolution-and-effective-configuration), and its results to [§11.11](#_11-11-workflow-results-failure-and-acceptance).

Presentation and provider relationships are governed by [§4.6](#_4-6-presentation-independence) and [§6.6](#_6-6-capability-boundaries-and-providers). Detailed command contracts, algorithms and component interactions belong below Design.

### 5.4 Command Discovery

The Application Engine should provide a central mechanism through which its available commands and functional domains can be discovered and dispatched.

Command discovery should be available through the Application Invocation Contract so interaction modes and integrations do not need to encode domain behaviour independently. The discoverable command surface should represent the authoritative AppManager command model rather than an adapter-specific or capability-provider-specific view of the system.

The detailed registry contract, command metadata, discovery implementation, and machine-readable discovery schema belong to lower-level specifications.

### 5.5 Shared Execution Semantics

A command is available to different callers through the adapter boundary in [§4.6](#_4-6-presentation-independence). Interactive inputs, explicit automation inputs and host-supplied context enter the invocation model of [§5.2](#_5-2-application-invocation-contract). Specialist execution follows [§6.2](#_6-2-application-engine-authority) and [§6.6](#_6-6-capability-boundaries-and-providers).

### 5.6 Relationship to Application Architecture

[§6](#_6-application-architecture) explains the cooperating responsibilities that realise commands. [§11](#_11-core-system-workflows) illustrates their coordination where it matters to system design.

---

## 6. Application Architecture

### 6.1 Architectural Model

AppManager is organised around an authoritative **Application Engine** that owns application-level semantics while coordinating both AppManager-owned capabilities and specialised capabilities supplied through defined boundaries.

[§6.2](#_6-2-application-engine-authority) defines the Application Engine responsibility. The diagram below is an explanatory view of its collaboration with capabilities.

The conceptual architecture is:

```text
                 application invocation contract
                              |
                              v
                    +-------------------+
                    | Application Engine |
                    |                   |
                    | command / use-case|
                    | coordination      |
                    | policy / safety   |
                    | outcome authority |
                    +---------+---------+
                              |
               application capability coordination
                              |
              +---------------+---------------+
              |                               |
              v                               v
   AppManager-owned capabilities       capability boundaries
              |                               |
              |                               v
              |                       capability providers
              |                       / external tools
              |                               |
              +---------------+---------------+
                              |
                              v
                   managed project / providers
```

This is an explanatory responsibility diagram. Implementation topology is governed by [§6.6](#_6-6-capability-boundaries-and-providers); architectural responsibilities do not inherently prescribe packages, modules or source-tree arrangements.

### 6.2 Application Engine Authority

The Application Engine is responsible for preserving one coherent AppManager application model across commands, architectural subsystems, capability providers, external providers, and interaction adapters.

It owns or governs, at the application level:

- command and use-case semantics;
- application policy;
- workflow coordination and sequencing;
- scope and context interpretation;
- safety and non-destructive-operation constraints;
- interpretation of capability results;
- final application-level success, failure, and diagnostic outcomes.

Delegating work does not delegate these responsibilities. A specialised subsystem or provider may determine how to perform its bounded task, but it must not independently redefine whether an AppManager operation is allowed, what the operation means, how it participates in a wider workflow, or what the final AppManager outcome represents.

### 6.3 Application Capabilities and Architectural Subsystems

Application capabilities are the coherent functions through which the Application Engine realises commands and workflows.

A capability may be provided by an AppManager-owned architectural subsystem, by shared operational infrastructure, or through a capability boundary to a specialised provider. The architecture should classify capabilities by responsibility rather than forcing them into equivalent tiers.

Services, domain engines, resolvers, generation, registries, and code-intelligence components therefore represent different responsibility families and collaboration patterns. They may cooperate within one use case without implying a uniform stack or mandatory dependency sequence.

Subsystem consumers use the contract model in [§6.6](#_6-6-capability-boundaries-and-providers).

### 6.4 Services

Services provide reusable operational capabilities required by commands, domain engines, and other subsystems.

Service responsibilities may include:

- filesystem operations;
- structured configuration access;
- Git operations;
- process execution;
- logging;
- AI-provider access;
- code coordination;
- other cross-cutting application capabilities.

Services must keep specialised domain behaviour with its owner when reused. Their consumer boundary follows [§6.6](#_6-6-capability-boundaries-and-providers) and presentation independence follows [§4.6](#_4-6-presentation-independence).

### 6.5 Domain Engines

Domain engines encapsulate cohesive specialised application responsibilities that have their own rules, concepts, policy, or coordination requirements within the authority of the Application Engine.

A domain engine may coordinate services, resolvers, registries, configuration, templates, capability providers, and other shared infrastructure while retaining responsibility for its domain-specific application behaviour.

Examples may include licensing, repository-management capabilities, or other sufficiently cohesive concerns identified as AppManager evolves.

Generation and code intelligence may collaborate with domain engines but are not assumed to be domain engines merely because they are specialised. Their architectural classification should follow the responsibility they actually own.

Domain-engine interfaces follow [§6.6](#_6-6-capability-boundaries-and-providers).

### 6.6 Capability Boundaries and Providers

Where AppManager depends on specialised ecosystem-native, provider-specific, external-tool, or otherwise implementation-specific mechanics, those mechanics should be encapsulated behind an appropriate capability boundary.

Consumers shall interact with capabilities in AppManager-oriented terms. Providers own bounded specialist execution mechanics, including external tools or providers, subject to [§6.2](#_6-2-application-engine-authority). Native parser, compiler, framework, host and provider representations stay encapsulated from commands, adapters and unrelated subsystems; a lower-level design may expose them only for a bounded internal purpose.

Capability boundaries should be sufficiently explicit that specialised implementations can evolve without requiring command semantics or interaction adapters to inherit their internal representations.

A capability boundary does not by itself require a separate runtime, process, protocol, transport, or deployment unit. Concrete interfaces, schemas, lifecycle rules, process relationships, and communication mechanisms belong in lower-level specifications.

### 6.7 Resolvers

Resolvers determine context-dependent values or resources from available project state, configuration, registries, environment information, provider availability, or user-supplied input.

Resolvers are particularly important where AppManager must separate the question of **what value is required** from **where that value comes from**.

Resolution participates in AppManager application semantics when the selected value affects command meaning, policy, scope, or safety. The mechanism used to obtain a candidate value may itself depend on a specialised capability provider.

Configuration resolution and permitted interactive completion are described in [§8.2–8.4](#_8-2-configuration-resolution-and-effective-configuration).

### 6.8 Generation and Templates

The generation subsystem is responsible for producing new project artefacts from controlled generators or templates and resolved project data.

Templates are intended for creation and scaffolding. A generator must not acquire unrestricted authority to rewrite existing user-authored source merely because it can produce similar content.

Generation consumes resolved configuration under [§8.2](#_8-2-configuration-resolution-and-effective-configuration).

Generation of new artefacts remains conceptually distinct from inspection and mutation of existing source. Code-intelligence capabilities may support either internal or delegated specialised mechanics as described in Section 7; the distinction between generation and mutation is based on responsibility, not implementation technology.

### 6.9 Registries

Registries provide discoverable mappings of configured or supported resources used across AppManager subsystems and capability boundaries.

Potential registry concerns include:

- commands;
- repositories;
- external providers;
- capability providers;
- templates;
- strategies;
- other extensible resource families.

A registry should define identity and discovery rather than assume operational authority. Commands, services, domain engines, resolvers, capability providers, or other responsible subsystems should own the behaviour associated with registered resources.

Registry consumers follow [§6.6](#_6-6-capability-boundaries-and-providers).

### 6.10 Modular TypeScript and Future-Host Portability

The finished publishable Version 1 codebase shall be modular, interface-driven TypeScript with explicit types and dependency direction at architectural boundaries. It shall separate interaction adapters from application semantics, Application Core from domain policy/orchestration, domains from shared capabilities, capability contracts from providers, AppManager contracts from provider-native representations, and runtime composition from the responsibilities composed.

Concrete dependencies shall be supplied through explicit composition, constructors, factories or equivalent typed registration seams, not hidden semantic singletons or import-time authority. Consumers of deliberately replaceable responsibilities shall depend on AppManager-oriented typed contracts. Domains shall not depend on interaction adapters; domains and capabilities shall not import GUI/TUI libraries to implement application semantics.

Replaceability is required at deliberate seams, not universally. Providers may use Node.js/TypeScript mechanisms internally. Version 1 shall use strong native TypeScript contracts, including explicit interfaces/types, discriminated result/state models and readonly/immutable intent where appropriate; each internal interface need not become a wire protocol. A future host may replace an implementation or adapt the same semantic contract across a runtime/language/transport boundary when needed, under [§6.2](#_6-2-application-engine-authority) and [§6.6](#_6-6-capability-boundaries-and-providers).

---

## 7. Code-Intelligence and Transformation Architecture

### 7.1 Purpose

AppManager requires controlled inspection, understanding, documentation, and modification of existing source files for capabilities such as documentation, metadata maintenance, header management, configuration manipulation, and future code-aware automation.

Code intelligence supplies the inspection and change responsibilities below through [§6.6](#_6-6-capability-boundaries-and-providers).

New-artefact creation is covered by [§6.8](#_6-8-generation-and-templates).

### 7.2 Architectural Position and Capability Boundary

Code-intelligence capabilities may be realised through AppManager-owned components, specialised capability providers, external parsers or language tooling, or a combination of those mechanisms.

Source-aware providers apply [§6.6](#_6-6-capability-boundaries-and-providers) to parser trees, compiler models, symbols, nodes and language-service objects.

Code-intelligence capabilities should expose AppManager-oriented information such as:

- structural facts about supported source;
- diagnostics and validation information;
- identified documentable or manageable regions;
- bounded transformation plans;
- transformation outcomes;
- validation results.

Consumers interpret those results under [§6.2](#_6-2-application-engine-authority).

### 7.3 Conceptual Pipeline

The code-intelligence architecture is conceptually:

```text
AppManager transformation / inspection intent
                    |
                    v
          code-intelligence capability
                    |
                    v
       source recognition / inspection
                    |
                    v
             structural facts
                    |
          +---------+---------+
          |                   |
          v                   v
   inspection result   transformation strategy
                              |
                              v
                 bounded transformation plan
                              |
                              v
                 transformation mechanism
                              |
                              v
                    source-level validation
          |                   |
          +---------+---------+
                    |
                    v
       AppManager-oriented result
                    |
                    v
             Application Engine
                    |
                    v
          application-level acceptance
```

Within a code-intelligence implementation, scanners or ecosystem-native parsers may recognise structure; strategies may produce bounded transformation plans; transformation mechanisms may execute approved edits; validators may verify transformed source; and orchestrators may compose these responsibilities where required. Not every supported source type or operation must use every mechanism.

### 7.4 Scanners

Scanners provide lexical or structural recognition of supported source formats where AppManager requires controlled understanding of existing files.

Their purpose is to convert source text into structural information that higher-level code-intelligence components can reason about safely.

A scanner supplies recognition evidence within the separation defined in [§7.9](#_7-9-inspection-and-mutation-separation).

Scanners are not intended to be general-purpose compiler replacements. Where a compiler, parser, or language service provides the appropriate specialist understanding, a scanner may delegate or be unnecessary.

### 7.5 Strategies and Transformation Plans

Strategies encapsulate source-type-specific transformation policy and planning.

A strategy consumes the structural understanding required by a use case and determines how an AppManager transformation intent can be represented as a safe, bounded **transformation plan** for the relevant source type.

A transformation plan describes the intended bounded source change before mutation occurs. At the Design Specification level it represents the scope, structural target, intended change, and constraints necessary for the transformation mechanism and subsequent validation without prescribing a concrete schema or data structure.

Transformation plans should be sufficiently explicit to support review, dry-run or preview behaviour, controlled execution, and post-transformation validation where those capabilities are required.

Strategies allow AppManager to add source-aware transformation behaviour without embedding format-specific policy throughout the command model.

A strategy does not need to execute the resulting edit itself. Transformation execution is a distinct responsibility, allowing the same transformation policy to be realised through different appropriate mechanisms where necessary.

Strategy consumers use [§6.6](#_6-6-capability-boundaries-and-providers).

### 7.6 Transformation Mechanisms

A transformation mechanism applies an approved bounded transformation plan to the target source.

It owns accurate edit mechanics within the supplied scope under [§6.2](#_6-2-application-engine-authority).

Transformation mechanisms may use direct structural editing, ecosystem-native parser or compiler facilities, specialised capability providers, or other source-aware techniques appropriate to the source type and transformation.

The mechanism returns edit evidence for [§7.7 validation](#_7-7-validation) through the boundary in [§6.6](#_6-6-capability-boundaries-and-providers).

Transformation is therefore a code-intelligence responsibility rather than, by default, a generic application service. A transformation mechanism may itself depend on reusable services or capability providers where those are appropriate to its implementation.

### 7.7 Validation

Validation determines whether inspected or transformed source satisfies the structural, syntactic, semantic, or transformation-specific constraints relevant to the code-intelligence operation.

Validation may involve re-inspection, structural comparison, parsing, compilation, type or schema checking, language-service analysis, or other appropriate source-aware mechanisms. The exact validation technique belongs in lower-level specifications and may differ by source type and transformation.

Validation results use [§6.6](#_6-6-capability-boundaries-and-providers).

Source-level validation and application-level acceptance are distinct responsibilities:

- **source-level validation** belongs to the code-intelligence capability and determines whether the resulting source is valid with respect to the relevant structural and transformation constraints;
- **application-level acceptance** consumes that validation result under [§11.11](#_11-11-workflow-results-failure-and-acceptance).

Validation is a code-intelligence responsibility rather than, by default, a generic application service. Validators may depend on shared services, capability providers, parsers, compilers, language services, or external tooling where appropriate.

### 7.8 Orchestrators

Orchestrators coordinate multiple lower-level code-intelligence capabilities where a file, artefact, or workflow spans more than one specialised representation or operation.

They should compose recognition, strategy, transformation planning, transformation execution, validation, and other existing capabilities rather than duplicate them, and should preserve AppManager-oriented semantics across the composed operation.

Orchestration here is bounded code-intelligence composition under [§6.2](#_6-2-application-engine-authority).

### 7.9 Inspection and Mutation Separation

Where practical, AppManager should distinguish between:

- inspecting and recognising existing source;
- determining transformation intent and producing a bounded transformation plan;
- approving and applying the planned change;
- validating the resulting source;
- evaluating the validated result at the application level.

This separation supports safer automation, structured diagnostics, reviewable transformation intent, independent validation, future preview or dry-run capabilities, and clear application-level outcome handling.

The approval stage binds source-changing intent to [§6.2](#_6-2-application-engine-authority).

### 7.10 Non-Destructive Transformation

For user-content and configuration protection, source transformation applies [§9.9](#_9-9-non-destructive-ownership-and-unmanaged-content). It should also preserve unaffected formatting and comments wherever practical.

AppManager should avoid full-file regeneration when a bounded structural edit can safely achieve the intended result.

Transformation delegation follows [§6.2](#_6-2-application-engine-authority).

### 7.11 Structured Formats

Structured configuration formats should be modified through structure-aware mechanisms where available rather than through unrestricted textual replacement.

Its representation boundary follows [§6.6](#_6-6-capability-boundaries-and-providers).

### 7.12 Composite Source Files

Where a source file contains multiple embedded languages or structural regions, AppManager should favour extraction, delegation, and controlled recomposition over creating monolithic format-specific logic.

Different specialised recognition, transformation, and validation mechanisms may therefore participate in one code-intelligence operation, provided that their results are coordinated through a coherent capability and unrelated source content remains protected.

### 7.13 Ecosystem-Native and External Parsing

Code intelligence may rely on ecosystem-native parsers, compilers, language services, or other external parsing mechanisms where they provide more reliable understanding, transformation support, or validation than AppManager-owned lexical analysis.

These mechanisms are providers under [§6.6](#_6-6-capability-boundaries-and-providers).

### 7.14 Future Language Support

Additional language/source-format support is an extension of this architecture under [§13.7](#_13-7-source-type-and-code-intelligence-extensibility).

---

## 8. Configuration and State Architecture

### 8.1 Configuration Model

AppManager configuration should be treated as an application-level model assembled from one or more configuration sources rather than as the direct contents of any single file, environment, adapter, or provider.

The conceptual model includes configuration sources at scopes such as:

- tool-level configuration and reusable defaults;
- target-project configuration and overrides;
- explicitly supplied invocation values and options;
- environment-derived values where supported;
- provider-derived or externally supplied values where an AppManager capability legitimately depends on them.

A configuration source supplies candidate values. It does not become an independent authority over AppManager configuration semantics merely because a value originates there.

### 8.2 Configuration Resolution and Effective Configuration

AppManager must resolve candidate values through defined, deterministic configuration semantics to produce the **effective configuration** used by the Application Engine and application capabilities for a particular scope or operation.

Conceptually:

```text
configuration sources
        |
        +-- tool-level defaults
        +-- project configuration
        +-- invocation-supplied values
        +-- environment / external sources
        |
        v
configuration resolution
        |
        v
 effective configuration
        |
        v
Application Engine / capabilities
```

Resolution should determine precedence, applicability, scope, validity, and provenance according to AppManager rules rather than through ad hoc reads from unrelated storage locations.

Where useful, AppManager should be able to identify the configuration source from which an effective value originated. User-, project-, repository-, provider- and environment-specific values should be resolved from appropriate configuration/context rather than embedded in reusable application logic or templates.

The exact precedence chain, configuration schema, persistence format, and resolution algorithm belong in Functional and Detailed Design Specifications. This Design Specification requires only that resolution be deterministic, explainable where practical, and independent of presentation-specific behaviour.

### 8.3 Configuration Authority and Resolution Responsibilities

Configuration consumption is governed by [§6.2](#_6-2-application-engine-authority).

Resolvers may determine candidate or effective values from available configuration sources, project state, invocation context, registries, provider availability, or environment information. Services or capability providers may supply access to those sources.

Source participation follows [§8.1](#_8-1-configuration-model), and physical representation follows [§8.9](#_8-9-configuration-independence-from-physical-representation).

### 8.4 Separation of Resolution and Interaction

Configuration resolution must remain usable without a user interface.

If a required value cannot be resolved and an interactive mode permits prompting, an interaction adapter may obtain additional user input and return that value through the normal invocation or resolution flow.

The acquired value returns through the candidate model in [§8.1](#_8-1-configuration-model).

Unresolved configuration in Headless operation follows [§4.3](#_4-3-headless-mode) and [Configuration FR-CONFIG-039–042](functional/configuration-functional-specification-v01.md#_11-headless-and-automation-behaviour).

### 8.5 AppManager-Owned Management Area

AppManager may maintain a recognisable application-owned management area within the tool environment and managed project for AppManager-owned resources.

The current design uses the directory name:

```text
app_manager/
```

This management area may contain resources such as durable configuration, registries, templates, operational state, logs, reports, and other AppManager-owned data appropriate to its scope.

The existence of one recognisable management area does not imply that every resource within it has the same lifecycle, authority, sensitivity, portability, or source-control policy. The precise internal structure and physical storage mechanisms belong in lower-level specifications.

### 8.6 Configuration Categories

The supported configuration concerns are defined by [FR-CONFIG-062](functional/configuration-functional-specification-v01.md#fr-config-062). Configuration values should be classified according to scope, authority, sensitivity and expected portability rather than treated as one uniform data set.

### 8.7 Sensitive Configuration

Sensitive configuration includes secrets, credentials, tokens, private keys, or other values whose disclosure would create security or privacy risk.

Sensitive configuration should remain logically distinct from ordinary shareable project configuration even where both participate in producing effective configuration.

Sensitive configuration and private project information should be exposed only to components, providers, logs, diagnostics, reports, results and presentation surfaces that legitimately require them. AppManager should avoid unnecessary propagation across capability boundaries or into durable, shareable or source-controlled artefacts.

The concrete secret-storage technology, encryption mechanism, credential provider, and platform integration belong in lower-level specifications.

### 8.8 Configuration, State, Reports, and Logs

AppManager-managed information must distinguish at least the following conceptual categories:

- **durable configuration** — intended settings or metadata that may influence future AppManager behaviour;
- **sensitive configuration** — protected configuration requiring stricter handling than ordinary shared settings;
- **operational state** — machine-maintained information describing or supporting current or prior AppManager operations;
- **generated reports and derived artefacts** — outputs produced from project or operational information rather than authoritative configuration inputs;
- **logs and diagnostics** — observational records intended to explain execution behaviour and failures.

These categories may have different persistence, portability, retention, sharing, source-control, and security requirements. They should not acquire configuration authority merely because they are stored near configuration data or under the same AppManager-owned management area.

Caches and machine-local observations follow the same distinction, including when reused by later operations.

### 8.9 Configuration Independence from Physical Representation

AppManager application semantics should depend on resolved configuration meaning rather than on a particular physical storage representation.

Configuration may ultimately be persisted in files, environment facilities, host-managed settings, secure stores, provider-backed mechanisms, or other appropriate sources, but those mechanisms should remain subordinate to AppManager configuration semantics.

Concrete file names, schemas, serializers, secret stores, environment-variable conventions, caches, persistence APIs, and storage layouts belong in lower-level specifications unless an enduring architectural decision explicitly elevates one of them into the target-system design.

---

## 9. Managed Project and Project Context Model

### 9.1 Managed Project Model

AppManager treats the target project as a structured application system whose relevant resources and relationships are resolved into an AppManager **managed project context** for the operation being performed.

A managed project is not defined merely by the current working directory, a single Git repository, or the presence of one framework file. It is the AppManager-oriented model of the target project's relevant application structure, management metadata, repository relationships, and operation scope.

A managed project may include:

- a root Nuxt application;
- one or more managed Nuxt layers;
- source code, tests, and documentation;
- package and Nuxt configuration;
- one or more Git repositories or repository relationships;
- AppManager-owned configuration, state, registries, templates, reports, and other management resources;
- generated artefacts and other resources relevant to supported AppManager capabilities.

The exact physical layout of those resources may vary. AppManager should reason from their project meaning and relationships rather than assuming that all managed resources form one uniform directory or repository tree.

### 9.2 Managed Project Context

The **managed project context** is the resolved AppManager view of the target project that is relevant to a particular invocation or operation.

Conceptually:

```text
invocation / host context / configuration / project metadata
                         |
                         v
             project discovery and resolution
                         |
                         v
               managed project context
                         |
                         v
             Application Engine / capabilities
```

The managed project context must make the relevant project identity, root application, managed layers, repository relationships, configuration scope, and operation targets available in AppManager-oriented terms without requiring commands or adapters to infer them independently.

Context interpretation follows [§6.2](#_6-2-application-engine-authority).

### 9.3 Root Application and Managed Layers

The root Nuxt application and its managed layers are distinct but related project entities.

AppManager should be able to address the root application, all managed layers, or a selected subset of those entities where the relevant use case supports such scope.

A managed layer may have its own source structure, package metadata, configuration, documentation, tests, repository relationship, and lifecycle operations. The fact that a layer is structurally part of the Nuxt application does not require it to share the same repository, configuration origin, or management lifecycle as the root application.

Likewise, repository boundaries must not be used as a substitute for Nuxt application structure. Project topology and repository topology are related but distinct concerns.

### 9.4 Project Topology and Resource Relationships

AppManager must model the relationships among root application, managed layers, repositories, AppManager-owned management resources, and other managed project entities explicitly enough for commands to operate on the intended targets without reconstructing those relationships independently.

This conceptual **project topology** should express AppManager-relevant relationships rather than expose incidental filesystem or provider-specific implementation details as the authoritative project model.

A physical directory hierarchy may contribute evidence to project discovery, but directory containment alone should not define every semantic relationship within the managed project.

### 9.5 Repository Relationships

A managed project may span one repository, multiple repositories, nested repository relationships, or other supported source-control arrangements.

Repository relationships should therefore be represented as properties and relationships of managed project entities rather than treated as the identity of the managed project itself.

AppManager must be able to determine which repository or repositories are relevant to a project-wide, root-application, layer-specific, or otherwise scoped operation without assuming that every managed entity belongs to one repository.

The detailed repository model, Git-worktree handling, submodule behaviour, remote topology, synchronisation rules, and repository discovery algorithms belong in lower-level specifications.

### 9.6 Project Discovery and Context Resolution

AppManager should be capable of discovering or resolving the relevant target project context from appropriate evidence such as:

- explicit invocation context or supplied target information;
- invocation location;
- host-tool context;
- effective configuration;
- AppManager-owned project metadata;
- recognised Nuxt application or layer structure;
- repository information where relevant.

Discovery inputs provide candidate project information. They do not independently become authoritative merely because they were supplied by an adapter, filesystem location, repository, or host tool.

Project discovery and context resolution must produce one coherent AppManager managed project context before a command depends on project identity or scope. Ambiguous, conflicting, or insufficient context should be handled explicitly rather than resolved through hidden assumptions.

Project disambiguation uses the interaction model in [§4](#_4-operating-context-and-interaction-modes); its observable rules are [Managed Project FR-PROJ-030–036](functional/managed-project-functional-specification-v01.md#_11-2-deterministic-resolution).

Detailed discovery precedence, markers, filesystem traversal, metadata formats, and validation algorithms belong in Functional and Detailed Design Specifications.

### 9.7 Managed Scope and Operation Targeting

The **managed scope** of an operation is the resolved set of project entities to which that operation is intended to apply.

Depending on the command, scope may include the complete managed project, the root application, all managed layers, selected layers, selected repositories, selected files or directories, or another bounded set of project entities.

Consequential operations must resolve and make their managed scope clear before mutation or external side effects occur. A project-wide operation must still respect the command's semantics, exclusions, safety rules, and ownership boundaries rather than assuming that every discoverable resource is an eligible target.

Scope selection may be informed by interaction or host context, but the meaning and permitted effect of that scope remain AppManager application responsibilities.

### 9.8 AppManager-Owned Management Area and Project Coexistence

The AppManager-owned management area defined in Section 8 is part of the management context associated with a target project; it is not a replacement for the target project's own structure.

AppManager-owned configuration, state, registries, templates, reports, and other management resources should coexist with user-authored project resources without requiring the project to be reorganised around AppManager internals.

The presence of AppManager-owned data does not grant AppManager ownership of adjacent project files, directories, repositories, or framework resources.

### 9.9 Non-Destructive Ownership and Unmanaged Content

Recognition, discovery, repository membership, directory containment or inclusion in a managed project context does not by itself grant AppManager authority to modify a resource.

AppManager must distinguish AppManager-owned management data from user-authored or externally owned resources where ownership affects an operation. It must also distinguish between understanding a resource, including it within project context, targeting it for a supported operation, and owning AppManager-generated or AppManager-maintained data.

Resources outside resolved managed scope must not be modified merely because they are technically accessible. Operations must preserve unrelated user-authored content, unmanaged resources and project structure wherever practical. Destructive, history-changing, overwriting, remote-mutating or otherwise consequential effects must be explicit, appropriately safeguarded and bounded by [§9.7](#_9-7-managed-scope-and-operation-targeting).

### 9.10 Independence from Incidental Physical Layout

AppManager should support the enduring structural concepts of a Nuxt application, managed layers, repositories, and AppManager-owned management resources without making command semantics depend on incidental source-tree arrangements that are not part of those concepts.

Concrete directory names other than explicitly adopted architectural conventions, path-search algorithms, workspace layouts, repository markers, project-discovery heuristics, and source-tree assumptions belong in lower-level specifications.

---

## 10. Functional Domains

### 10.1 Functional-Domain Model

AppManager's user-facing command surface is organised into **functional domains**: coherent product-facing groupings of related commands and use cases within the Application Engine command model.

A functional domain describes **what family of AppManager operations is exposed**. It does not prescribe the internal component, service, provider, process, package, or source-code module that realises those operations.

Functional domains and architectural subsystems are therefore distinct concepts:

```text
functional domain
(product / use-case organisation)
        |
        v
commands / use cases
        |
        v
application capability coordination
        |
        +---------------------------+
        |                           |
        v                           v
AppManager-owned capabilities   capability boundaries
                                    |
                                    v
                            capability providers
```

Commands in different domains may reuse the same application capabilities, services, resolvers, code-intelligence mechanisms, generation facilities, domain engines, registries, or capability providers. A shared mechanism should not be duplicated merely because several domains expose use cases that depend on it. Reuse must not erase meaningful responsibility boundaries or move a concern into a generic utility abstraction merely because several consumers need it.

The domain list may evolve, but the following domains represent the current intended product surface.

### 10.2 Cross-Domain Invariants

Domain commands bind their product intent to [§5](#_5-command-model), their collaboration to [§6](#_6-application-architecture), and their project targeting to [§9](#_9-managed-project-and-project-context-model). The invariant index in [§12](#_12-design-principles-and-architectural-invariants) provides direct navigation to shared constraints.

A domain's coordination of several responsibilities does not make those responsibilities domain-private infrastructure.

### 10.3 App Domain

The `app` domain owns simple root-application lifecycle intent. Routine operations should be accessible without requiring the caller to understand managed-layer, repository or Nuxt-composition topology. Nuxt-aware structure/composition belongs to [§10.7](#_10-7-nuxt-domain); quality intent belongs to [§10.8](#_10-8-quality-domain), including when Nuxt tooling supplies execution.

The eight canonical commands and their lifecycle obligations are defined in [App §4.6](functional/app-functional-specification-v01.md#_4-6-canonical-version-1-command-surface). Package scripts, direct Nuxt execution and package-manager/framework invocations are possible mechanisms under [§6.6](#_6-6-capability-boundaries-and-providers), not additional product intents.

### 10.4 Docs Domain

The `docs` domain owns documentation intent across the managed application: application source, layers, tests, selected files and project metadata. Its thirteen-command surface and observable target model are defined in [Docs](functional/docs-functional-specification-v01.md#_4-documentation-target-model).

One documentation intent may resolve multiple semantic targets and independently planned artefacts; it is not an arbitrary filesystem bulk-write facility. Documentation modelling, aggregation, rendering, tooling and documentation-oriented validation belong to the Documentation capability; source facts, new-resource persistence and existing-source changes use their respective shared capabilities. [§11.6](#_11-6-documentation-workflow) explains the collaboration, and [Docs §10.1](functional/docs-functional-specification-v01.md#_10-1-coordinated-artefact-production) owns the per-artefact behaviour.

### 10.5 Git Domain

The `git` domain owns source-control and repository-management intent: repository inspection/configuration, initialisation, commits, remotes, managed repository relationships, synchronisation, push and deliberately authorised remote lifecycle operations. It consumes the repository relationships in [§9.5](#_9-5-repository-relationships).

One commit intent may coordinate independently evaluated repository commits over an explicitly selected repository, selected set or all eligible managed repositories. This remains the existing `git.commit` identity in the eight-command Git surface. [Git §8](functional/git-functional-specification-v01.md#_8-commit) owns scope, staging, message acceptance, continuation and commit outcomes; [§11.5](#_11-5-repository-synchronisation-workflow) describes synchronisation coordination. Bounded repository facts and already-authorised repository primitives belong to the Repository capability.

### 10.6 AI Domain

The `ai` domain owns the project-side AI development environment: resources that configure, instruct, extend or constrain supported AI development agents and environments. The shared AI Capability supplies bounded inference/generation to any owning domain; its use does not transfer primary product intent to AI.

The environment comprises instructions (persistent scoped guidance), prompts (reusable user-invoked tasks), named specialist agent definitions, skills (knowledge/capability packages), tool/data integrations and AI-specific context/tool/execution/access policy. Rules/scoped guidance are scoped instructions unless a later approved requirement establishes another resource class. Prompt templates are instantiation mechanisms unless a separately meaningful resource is established. MCP is a supported tool representation/protocol, not the semantic identity of every tool integration.

Resources may reference each other and provider representations may be incomplete; [AI §4.1](functional/ai-functional-specification-v01.md#_4-1-project-side-environment-resources) defines observable graph, representation, scope and credential constraints. Concrete files, directories, schemas and protocols represent these concepts rather than define them.

The 22 canonical operations are defined in [AI §2.3](functional/ai-functional-specification-v01.md#_2-3-canonical-version-1-command-surface). AI remains optional where practical and must not become an implicit dependency of unrelated core operations. Generated-output acceptance is governed by [§11.10](#_11-10-ai-assisted-workflow).

### 10.7 Nuxt Domain

The `nuxt` domain owns Nuxt-aware structural, compositional and advanced framework intent: root/layer inspection, configuration, framework scaffolding, module addition, upgrades, bundle analysis, Nuxt-generated-state cleanup, and layer creation/integration/detachment. The thirteen canonical commands and observable obligations are defined in [Nuxt §4.6](functional/nuxt-functional-specification-v01.md#_4-6-canonical-version-1-command-surface).

Nuxt capability supplies bounded framework recognition/tooling under [§6.6](#_6-6-capability-boundaries-and-providers). Layer creation establishes a Nuxt layer; root-application creation belongs to [§10.3](#_10-3-app-domain). Framework tool availability alone does not create an AppManager command.

### 10.8 Quality Domain

The `quality` domain manages verification, assurance and quality-control intent for the managed project. A quality workflow evaluates selected checks and, where applicable, a quality gate; the observable operation families are defined in [Quality §§5–13](functional/quality-functional-specification-v01.md#_5-test-execution).

Quality consumes managed targeting under [§9.7](#_9-7-managed-scope-and-operation-targeting) and result handling under [§11.11](#_11-11-workflow-results-failure-and-acceptance). Test runners, linters, type checkers, process execution, compiler integrations and similar tooling remain shared or delegated capabilities rather than Quality-domain-private implementations.

### 10.9 Maintenance Domain

The canonical domain is **`maintenance`**, not `utils`. Maintenance owns explicit project-maintenance intent over non-semantic/regenerable state for which no stronger product domain owns the semantic object, policy or postcondition. It is not a miscellaneous fallback namespace.

The stronger-owner rule applies regardless of verbs such as clean, reset, upgrade, update, remove, delete, repair or validate. App lifecycle, Nuxt framework state, Git repositories, Docs content, Quality evaluation, Settings resources and AI resources keep their respective owners. Technical filesystem, process and transformation mechanisms remain capabilities.

The four Maintenance commands cover managed source-header validation/repair, source-version maintenance and narrowly classified disposable-artefact cleanup; their canonical surface and compatibility binding are in [Maintenance §2.1](functional/utils-functional-specification-v01.md#_2-1-canonical-version-1-command-surface). Operation-supported cardinality may include one resource, a selected set, a semantic managed unit or complete eligible scope. Maintenance adds classification, bounded plans, continuation and postconditions to the managed-scope model; [Maintenance §11.1](functional/utils-functional-specification-v01.md#_11-1-coordinated-resource-operations) defines observable per-resource behaviour. No generic recursive repair/delete facility is implied.

### 10.10 Settings Domain

The `settings` domain provides user-facing and automation-facing use cases for inspecting and managing AppManager configuration. Its workflows cover project metadata, environment definitions and governed declarative resources; [Settings §§4–11](functional/settings-functional-specification-v01.md#_4-settings-scope-and-identity) defines the supported settings concerns and persisted-resource behaviours.

Settings management uses the configuration architecture in [§8](#_8-configuration-and-state-architecture) and the effective-value contract in [Configuration](functional/configuration-functional-specification-v01.md#_6-precedence-and-effective-configuration).

### 10.11 Cross-Domain Workflows

A single AppManager workflow may involve commands or capabilities associated with more than one functional domain.

For example, an application-lifecycle operation may require repository, quality, documentation, configuration, generation, or AI-assisted capabilities. Such collaboration does not require one functional domain to become the architectural owner of another domain's commands or of the shared mechanisms they use.

Cross-domain coordination remains an Application Engine responsibility. Domains organise the command surface; they do not form an independent chain of authority or a mandatory execution stack.

Detailed command placement, domain boundaries, command identifiers, behavioural requirements, and cross-domain workflow rules belong in Functional Specifications where they require greater precision.

---

## 11. Core System Workflows

### 11.1 Workflow Model and Authority

Core workflows describe how AppManager coordinates application intent, context, policy, capabilities, external effects, validation, and results across the major use-case families defined by the command model.

Workflow coordination uses the authority in [§6.2](#_6-2-application-engine-authority) and delegation boundaries in [§6.6](#_6-6-capability-boundaries-and-providers). The diagrams in this section are explanatory examples of those responsibilities, not additional normative statements or mandatory implementation sequences.

At the Design Specification level, workflows therefore express enduring coordination responsibilities and decision boundaries rather than concrete call sequences, classes, process topology, transaction APIs, or implementation-specific control flow.

### 11.2 Command Invocation Workflow

A normal AppManager command invocation is conceptually:

```text
user / automation / host tool
       |
       v
interaction adapter
       |
       v
Application Invocation Contract
       |
       v
Application Engine
       |
       +--> command discovery / dispatch
       |
       +--> managed project context resolution
       |
       +--> effective configuration resolution
       |
       +--> managed scope / policy / safety evaluation
       |
       v
command / use case
       |
       v
application capability coordination
       |
       +-----------------------------+
       |                             |
       v                             v
AppManager-owned capabilities   capability boundaries
                                     |
                                     v
                             capability providers /
                             external tools/providers
       |                             |
       +-------------+---------------+
                     |
                     v
          AppManager-oriented results
                     |
                     v
            Application Engine
                     |
                     v
         application-level acceptance
                     |
                     v
 structured result / diagnostics / events
                     |
                     v
       interaction-adapter presentation
```

The exchange shown here is defined in [§5.2](#_5-2-application-invocation-contract).

Project context, effective configuration, and managed scope need not always be resolved as isolated sequential steps. They may be interdependent, but they must converge on an explicit, coherent invocation context before a consequential operation depends upon them.

Result interpretation is defined in [§11.11](#_11-11-workflow-results-failure-and-acceptance).

### 11.3 Common Workflow Invariants

Workflows use the constraints indexed in [§12](#_12-design-principles-and-architectural-invariants). Each begins with an identifiable command/use-case intent and applies the relevant context, configuration and capability responsibilities before reporting its result.

Functional and lower-level specifications define operation-specific transaction boundaries, retries, partial failure, cancellation, recovery, concurrency, ordering and result structures. [Application Invocation](functional/application-invocation-functional-specification-v01.md) owns their common observable contract.

### 11.4 Application Lifecycle Workflow

Application lifecycle workflows may coordinate project context, effective configuration, package-management capabilities, process execution, generation, cleanup, validation, quality operations, and repository capabilities according to the requested command.

A conceptual lifecycle flow is:

```text
lifecycle intent
      |
      v
resolve project context / scope / configuration
      |
      v
apply lifecycle policy and safety constraints
      |
      v
coordinate required capabilities
      |
      v
perform bounded lifecycle effects
      |
      v
validate relevant resulting state
      |
      v
application-level acceptance
      |
      v
structured outcome
```

[App §§11–13](functional/app-functional-specification-v01.md#_11-clean-regenerable-application-state) defines clean/reset classification and lifecycle composition for this flow.

### 11.5 Repository Synchronisation Workflow

Repository synchronisation operates over repository relationships represented by the managed project context rather than assuming a one-project/one-repository topology.

A conceptual synchronisation workflow is:

```text
synchronisation intent
       |
       v
resolve managed project context
       |
       v
resolve managed scope
       |
       v
identify relevant repository relationships
       |
       v
apply repository policy and safeguards
       |
       v
coordinate bounded Git / provider operations
       |
       v
collect per-repository outcomes
       |
       v
application-level acceptance
       |
       v
structured project-level result
```

The supported repository scope is defined in [Git §4.2](functional/git-functional-specification-v01.md#_4-2-repository-scope), using [§9.7](#_9-7-managed-scope-and-operation-targeting).

Where a workflow affects multiple repositories, lower-level specifications must define partial-failure, ordering, retry, rollback or recovery semantics appropriate to the operation rather than relying on accidental tool behaviour.

### 11.6 Documentation Workflow

Documentation workflows may inspect project structure, source, tests, configuration, metadata, or other managed information and may either generate new documentation artefacts or update existing documentation-bearing source.

Documentation output planning uses the generation boundary in [§6.8](#_6-8-generation-and-templates).

Conceptually:

```text
documentation intent
        |
        v
resolve project context and managed scope
        |
        v
discover relevant documentation targets
        |
        v
inspect project / source structure as required
        |
        +-----------------------------+
        |                             |
        v                             v
new documentation artefact     existing source update
        |                             |
        v                             v
generation capability       transformation strategy
        |                             |
        |                             v
        |                  bounded transformation plan
        |                             |
        |                  application policy / approval
        |                             |
        |                             v
        |                  transformation mechanism
        |                             |
        |                             v
        |                  source-level validation
        |                             |
        +-------------+---------------+
                      |
                      v
            AppManager-oriented result
                      |
                      v
             application-level acceptance
```

Where documentation depends on code understanding, source recognition and structural facts should be supplied through code-intelligence capabilities rather than duplicated inside documentation commands.

Existing-source updates follow [§7](#_7-code-intelligence-and-transformation-architecture). Optional content enrichment uses [§11.10](#_11-10-ai-assisted-workflow).

### 11.7 Source Transformation Workflow

Where AppManager modifies existing source, the workflow should preserve the explicit responsibility boundaries established by the code-intelligence architecture.

Conceptually:

```text
AppManager transformation intent
            |
            v
resolve target / project context / managed scope
            |
            v
source recognition / inspection
            |
            v
structural facts
            |
            v
transformation strategy
            |
            v
bounded transformation plan
            |
            v
Application Engine policy / safety / approval decision
            |
            v
transformation mechanism
            |
            v
source-level validation
            |
            v
AppManager-oriented transformation result
            |
            v
Application Engine application-level acceptance
            |
            v
structured outcome / diagnostics
```

The responsibilities shown are defined in [§7.4–7.10](#_7-4-scanners). [Source Transformation §§9–10](functional/source-transformation-functional-specification-v01.md#_9-preview-dry-run-and-reviewability) defines the observable preview and approval contract.

### 11.8 Generation Workflow

The following example applies [§6.8](#_6-8-generation-and-templates) to a creation workflow.

A conceptual generation workflow is:

```text
generation intent
      |
      v
resolve project context / destination scope
      |
      v
resolve effective configuration and required values
      |
      v
select generator / template
      |
      v
produce proposed artefact
      |
      v
validate destination / overwrite / ownership safety
      |
      v
write approved artefact
      |
      v
validate or inspect result where required
      |
      v
application-level acceptance
      |
      v
structured outcome
```

Destination validation must distinguish creation of a new AppManager-managed artefact from overwriting or restructuring existing user-authored content. Overwrite, merge, replacement, or collision behaviour must be explicit rather than an accidental consequence of the generator or filesystem mechanism.

The corresponding Functional boundary is [FR-XFORM-044–047](functional/source-transformation-functional-specification-v01.md#_13-generation-versus-mutation).

### 11.9 Quality Workflow

Quality workflows verify a resolved managed scope using one or more testing, linting, type-checking, coverage, validation, or other assurance capabilities.

Conceptually:

```text
quality intent
      |
      v
resolve project context / managed scope / configuration
      |
      v
select required quality capabilities
      |
      v
execute bounded checks
      |
      v
collect structured check results / diagnostics
      |
      v
apply quality policy / gates where applicable
      |
      v
application-level acceptance
      |
      v
structured outcome
```

[Quality §§11–14](functional/quality-functional-specification-v01.md#_11-quality-gates) defines gate interpretation, composition and observable results for this workflow.

### 11.10 AI-Assisted Workflow

AI-assisted workflows use an AI capability as a bounded contributor to an AppManager command rather than as an independent workflow authority.

A conceptual AI-assisted flow is:

```text
AppManager command intent
        |
        v
resolve project context / managed scope / configuration
        |
        v
determine bounded AI task and permitted context
        |
        v
resolve AI capability / configured provider
        |
        v
request candidate result
        |
        v
constrain / inspect / validate candidate result as appropriate
        |
        v
apply AppManager policy and command-specific acceptance
        |
        v
approved use, fallback, rejection, or failure
        |
        v
structured outcome
```

AI-provider selection, credentials, model APIs, transport mechanics, and provider-specific representations remain behind appropriate configuration, service, or capability boundaries.

Project context supplied to an AI capability should be bounded to what the use case requires and should respect sensitive-configuration and project-ownership constraints.

AI-generated output is non-authoritative proposal data. It may become accepted application input only through the owning use case under policy resolved before the result exists. Acceptance may require human review or may be automatic when a previously authorised owning use case defines deterministic acceptance criteria suitable for automation/Headless operation. No provider or generated result may accept/authorise itself, broaden scope, create consequential authority, or bypass owning-domain validation and final Application Engine acceptance.

[AI §7.1](functional/ai-functional-specification-v01.md#_7-1-generated-output-acceptance) defines the shared observable acceptance/failure contract. Git and Docs bind it to their own message/artefact requirements.

Where AI is optional for a workflow, deterministic non-AI behaviour, explicit unavailability, or another defined fallback should be preferred over hidden degradation or unexpected interactive resolution.

### 11.11 Workflow Results, Failure, and Acceptance

Technical/provider completion is evidence, not application success. The Application Engine evaluates that evidence under [§6.2](#_6-2-application-engine-authority); a technically successful result may still fail application acceptance.

A core workflow may involve multiple capabilities, targets, repositories, generated artefacts, transformations, checks, or external providers. The Application Engine should interpret their AppManager-oriented results together with command intent, managed scope, effective configuration, application policy, and safety constraints before determining the final application-level outcome.

The observable result-information contract is defined by [Application Invocation §§14–17](functional/application-invocation-functional-specification-v01.md#_14-structured-outcomes). That owner governs status, affected targets, delegated evidence, diagnostics, consequential effects and recovery information; the architectural acceptance responsibility remains here. Event streams, cancellation protocols, transaction semantics and concrete representations are refined below Design.

---

## 12. Design Principles and Architectural Invariants

Section 12 is a navigation index to canonical constraints in their subject sections. It introduces no duplicate normative statements. Stable subsection locators remain available to existing traceability references.

These invariants describe enduring architectural obligations rather than particular classes, packages, processes, libraries, protocols, or source-tree arrangements.

### 12.1 Single Application Authority

The canonical constraint is in [§6.2 Application Engine Authority](#_6-2-application-engine-authority).

### 12.2 Presentation Independence

The canonical constraint is in [§4.6 Presentation Independence](#_4-6-presentation-independence).

### 12.3 Structured Invocation Boundary

The canonical constraint is in [§5.2 Application Invocation Contract](#_5-2-application-invocation-contract).

### 12.4 Functional Domains and Architectural Responsibility

The canonical constraint is in [§10.1 Functional-Domain Model](#_10-1-functional-domain-model).

### 12.5 Capability Boundaries and Representation Encapsulation

The canonical constraint is in [§6.6 Capability Boundaries and Providers](#_6-6-capability-boundaries-and-providers).

### 12.6 Delegated Execution Without Delegated Authority

The canonical constraint is in [§6.2 Application Engine Authority](#_6-2-application-engine-authority).

### 12.7 Managed Project Context

The canonical constraint is in [§9.6 Project Discovery and Context Resolution](#_9-6-project-discovery-and-context-resolution).

### 12.8 Explicit Managed Scope

The canonical constraint is in [§9.7 Managed Scope and Operation Targeting](#_9-7-managed-scope-and-operation-targeting).

### 12.9 Effective Configuration and Configuration Authority

The canonical constraint is in [§8.2 Configuration Resolution and Effective Configuration](#_8-2-configuration-resolution-and-effective-configuration).

### 12.10 Authoritative, Derived, and Operational Information

The canonical constraint is in [§8.8 Configuration, State, Reports, and Logs](#_8-8-configuration-state-reports-and-logs).

### 12.11 Non-Destructive Operation and Ownership

The canonical constraint is in [§9.9 Non-Destructive Ownership and Unmanaged Content](#_9-9-non-destructive-ownership-and-unmanaged-content).

### 12.12 Structured Source Modification

The canonical constraint is in [§7.10 Non-Destructive Transformation](#_7-10-non-destructive-transformation).

### 12.13 Generation and Mutation Separation

The canonical constraint is in [§6.8 Generation and Templates](#_6-8-generation-and-templates).

### 12.14 Validation and Application-Level Acceptance

The canonical constraint is in [§11.11 Workflow Results, Failure, and Acceptance](#_11-11-workflow-results-failure-and-acceptance).

### 12.15 Structured Outcomes and Observability

The canonical constraint is in [§11.11 Workflow Results, Failure, and Acceptance](#_11-11-workflow-results-failure-and-acceptance).

### 12.16 Deterministic Headless Operation

The operating model is in [§4.3 Headless Mode](#_4-3-headless-mode); the canonical observable constraint is [FR-INV-020](functional/application-invocation-functional-specification-v01.md#fr-inv-020).

### 12.17 Shared Capability Reuse

The canonical constraint is in [§10.1 Functional-Domain Model](#_10-1-functional-domain-model).

### 12.18 Extensible Discovery with Stable Semantics

The canonical constraint is in [§13.14 Registry and Discovery Extensibility](#_13-14-registry-and-discovery-extensibility).

### 12.19 External Providers and AI as Bounded Capabilities

The canonical constraint is in [§10.6 AI Domain](#_10-6-ai-domain).

### 12.20 Sensitive Information Minimisation

The canonical constraint is in [§8.7 Sensitive Configuration](#_8-7-sensitive-configuration).

### 12.21 Architectural Responsibility Model

The canonical constraint is in [§6.3 Application Capabilities and Architectural Subsystems](#_6-3-application-capabilities-and-architectural-subsystems).

### 12.22 Independence from Incidental Implementation Topology

The canonical constraint is in [§6.1 Architectural Model](#_6-1-architectural-model).

### 12.23 Design Authority and Specification Compliance

The canonical constraint is in [§14.10 Conflict Resolution and Change Propagation](#_14-10-conflict-resolution-and-change-propagation).

### 12.24 Nuxt Layer Terminology

Because `layer` has a specific meaning within Nuxt, architectural documentation should avoid using the term ambiguously when `subsystem`, `component family`, `stage`, `boundary`, or `adapter` is more accurate.

---

## 13. Extensibility Model

### 13.1 Extensibility Contract

AppManager should be extensible by adding or substituting commands, functional domains, source-aware capabilities, generators, templates, configuration or context sources, interaction adapters, capability providers, external-provider integrations, domain engines, declarative resources, and other architectural responsibilities where the product requires them.

Extensions bind to the existing architecture at the seam they extend. [§13.16](#_13-16-extension-acceptance-and-compatibility) defines their acceptance obligations.

Conceptually:

```text
new or substituted extension
           |
           v
 discovery / resolution
           |
           v
established AppManager boundary
           |
           v
Application Engine coordinated use
           |
           v
AppManager-oriented result / acceptance
```

The existence of an extension point does not by itself prescribe a general executable plugin framework, dynamic code loading mechanism, package format, runtime boundary, process model, automatic discovery algorithm, or third-party extension marketplace. Those choices belong in lower-level specifications or separate architectural decisions where they become significant.

The [§12 index](#_12-design-principles-and-architectural-invariants) locates the applicable constraints.

### 13.2 Extension Classes

AppManager should distinguish at least three materially different forms of extensibility:

```text
AppManager extensions
        |
        +-- declarative / resource-driven extensions
        |      licence definitions, templates, profiles,
        |      and other engine-owned specifications
        |
        +-- capability implementation extensions
        |      specialised providers or ecosystem-native
        |      implementations behind capability boundaries
        |
        +-- application-surface extensions
               commands, functional domains,
               interaction adapters, and subsystems
```

These extension classes differ in authority, trust, compatibility, lifecycle, and security implications and should not be forced through one universal plugin mechanism merely because each can extend system behaviour.

A **declarative extension** contributes validated data, metadata, rules, content, or bounded instructions interpreted by an existing AppManager engine or subsystem. A **capability implementation extension** supplies executable mechanics behind an established capability boundary. An **application-surface extension** changes the discoverable AppManager command, domain, interaction, or subsystem surface.

The term **plugin** should be reserved for a concrete executable-extension mechanism if AppManager later adopts one. Declarative resources such as licence definitions and templates are extensions, but they are not executable plugins merely because they can be added without rebuilding AppManager.

### 13.3 Declarative and Resource-Driven Extensibility

Where an AppManager engine or subsystem is designed to be resource-driven, new supported resources should be addable without application source-code changes.

A declarative extension should normally be:

- interpreted through an owning engine or subsystem rather than executed as arbitrary application code;
- discoverable through an extensible registry, catalogue, or equivalent resource model;
- validated before use according to the semantics of the owning engine;
- subject to [§13.16 extension acceptance](#_13-16-extension-acceptance-and-compatibility);
- limited to the bounded semantics intentionally exposed by the owning engine;
- bound to [§4.6 presentation independence](#_4-6-presentation-independence).

Resource discovery is an architectural requirement where resource-driven extensibility is supported, but the physical discovery mechanism is not prescribed here. A lower-level design may use explicit registries, configured locations, generated catalogues, embedded resources, filesystem discovery, provider-backed catalogues, or another suitable mechanism provided the AppManager-level semantics remain stable.

The distinction between runtime resource loading and runtime executable code loading must remain explicit:

```text
runtime resource extension
        !=
runtime executable plugin loading
```

A declarative format that evolves to permit arbitrary executable code, unrestricted hooks, direct application-capability access, or equivalent unconstrained behaviour has crossed the architectural boundary into executable extensibility. Such a change must be treated as an executable-extension design problem with corresponding trust, compatibility, security, isolation, lifecycle, and architectural-decision requirements.

### 13.4 Engine, Registry, and Declarative-Resource Pattern

Specialised engines and subsystems may intentionally combine stable executable behaviour with extensible declarative resources.

Conceptually:

```text
Application Engine
        |
        v
specialised engine / subsystem
        |
        +-- registry / catalogue
        |
        +-- declarative resource definitions
        |
        +-- validation / interpretation
        |
        v
AppManager-oriented capability result
```

The **License Engine** is an example of this pattern. Licensing rules and rendering behaviour belong to the engine, while individual licence definitions should be representable as validated resources that can be added to the licence catalogue without requiring changes to the AppManager codebase where the licence falls within the supported licence-definition model.

Likewise, the template/generation architecture should support templates as validated declarative resources interpreted by the generation subsystem or template engine. A new template specification should be capable of extending the artefacts AppManager can generate without requiring unrelated command or application code changes where the requested template behaviour falls within the supported template model.

These examples apply the resource authority model in [§13.3](#_13-3-declarative-and-resource-driven-extensibility).

This pattern may be reused by other cohesive subsystems where data-driven extension is appropriate, but adopting it for one engine does not require all AppManager extensibility to use the same resource format, registry, or loading mechanism.

### 13.5 Command Extensibility

New application use cases should be introducible as commands within an appropriate functional domain, using [§5.3](#_5-3-command-responsibilities). Command registration, metadata, identifier rules, discovery schemas and implementation wiring belong below Design. Central discovery does not imply automatic filesystem discovery or runtime plugin loading.

### 13.6 Functional-Domain Extensibility

New functional domains may be introduced where a coherent family of product-facing use cases cannot be represented cleanly within existing domains.

A domain should correspond to meaningful user or automation intent rather than to a source-code package, external provider, technical library, host environment, or incidental implementation boundary.

New domains apply [§10.1](#_10-1-functional-domain-model).

### 13.7 Source-Type and Code-Intelligence Extensibility

New source formats, language variants, embedded-language regions, and source-aware operations should be supportable without redesigning the command system or Application Engine.

Source-type support may extend the code-intelligence responsibility through suitable recognition, strategies, transformation plans, transformation mechanisms, validation, orchestration, parser or compiler integrations, or specialised capability providers. Not every source type is required to use every mechanism.

New source support must preserve the separation in [§7.9](#_7-9-inspection-and-mutation-separation).

New source support applies [§6.6](#_6-6-capability-boundaries-and-providers) and [§7.2](#_7-2-architectural-position-and-capability-boundary).

### 13.8 Capability-Provider and External-Provider Extensibility

Capability providers and external providers are distinct extension concerns.

AppManager should support provider introduction/substitution at the seams defined by [§6.6](#_6-6-capability-boundaries-and-providers) and [§6.10](#_6-10-modular-typescript-and-future-host-portability).

External-platform integration uses the provider relationship in [§3.14](#_3-14-external-provider).

Provider selection and availability may be resolved from effective configuration, context, registries, or other defined sources. Exact provider contracts, compatibility rules, fallback behaviour, retry policy, selection algorithms, and whether implementations are statically linked, configured, or dynamically loadable belong in lower-level specifications unless an architectural decision elevates them into the enduring design.

### 13.9 Generation and Template Extensibility

New generators and templates should be introducible without embedding generated content or generator-specific behaviour into unrelated command logic.

Template addition follows [§13.4](#_13-4-engine-registry-and-declarative-resource-pattern). A generator introducing new executable semantics is a different extension class and may require a new capability implementation or subsystem design.

New generators/templates apply [§6.8](#_6-8-generation-and-templates) and [§11.8](#_11-8-generation-workflow).

Concrete template formats, generator interfaces, template metadata, registry structures, rendering technologies, and resource-loading mechanisms belong in lower-level specifications.

### 13.10 Resolver and Configuration-Source Extensibility

New sources of configuration, context, provider availability, project metadata, or other resolvable values should be incorporable without requiring presentation-specific access or ad hoc reads throughout the application.

New sources and resolvers apply [§8.1–8.4](#_8-1-configuration-model).

Detailed precedence, resolver contracts, source formats, credential-store integrations, and persistence mechanisms belong in lower-level specifications.

### 13.11 Managed-Project and Topology Extensibility

AppManager should be able to evolve its understanding of supported project structures, Nuxt layer arrangements, repository relationships, managed metadata, and other project-topology evidence without requiring each command or adapter to reconstruct those structures independently.

New evidence and topology representations apply [§9.6–9.9](#_9-6-project-discovery-and-context-resolution).

Concrete discovery markers, traversal rules, workspace handling, repository mechanisms, and topology data structures belong in lower-level specifications.

### 13.12 Interaction and Host-Integration Extensibility

The interaction architecture should permit additional interaction modes and host-tool adapters when future requirements justify them.

Prospective adapters include IDE plugins, editor extensions, CI integrations, AI agents and automation systems.

Adapter responsibilities and future WebStorm scope are defined in [§4.5–4.6](#_4-5-ide-and-host-tool-integrations).

### 13.13 Application Invocation Contract Evolution

The Application Invocation Contract should be capable of evolving as commands, adapters, automation requirements, structured outcomes, diagnostics, events, and cancellation needs evolve while preserving coherent AppManager command identity and application semantics.

Evolution preserves the boundary in [§5.2](#_5-2-application-invocation-contract).

Concrete compatibility guarantees, schema versions, transport bindings, protocol negotiation, deprecation rules, and migration mechanics belong in Functional and Detailed Design Specifications unless an architectural decision elevates a particular constraint into the target design.

### 13.14 Registry and Discovery Extensibility

Registries and discovery mechanisms should support extensible families such as commands, repositories, strategies, templates, licence definitions, declarative resources, capability providers, and external providers without widespread conditional logic or adapter-specific copies of the same catalogue.

Registry authority is defined in [§6.9](#_6-9-registries). Discovery shall not bypass the consuming operation's selection, resolution, scope, authorisation or validation requirements.

Where a subsystem explicitly supports declarative/resource-driven extensibility, resource discovery is part of its required extensibility model. This Design Specification does not, however, mandate automatic filesystem scanning, reflection, convention-based code registration, dynamic executable plugin loading, or any other single physical discovery mechanism.

### 13.15 Domain-Engine and Architectural-Subsystem Extensibility

New domain engines or other architectural subsystems may be introduced when a concern has sufficiently cohesive rules, concepts, policy, state, or coordination responsibilities to justify a distinct architectural responsibility.

New subsystems apply [§6.3](#_6-3-application-capabilities-and-architectural-subsystems).

A domain engine may itself be designed around a stable executable engine plus extensible declarative resources, as described in Sections 13.3 and 13.4. That pattern supports codebase-independent addition of new resource definitions without implying that the engine itself is dynamically replaceable or that AppManager has adopted a general executable plugin framework.

Not every new feature requires a new subsystem. Architectural decomposition should follow enduring responsibility and cohesion rather than feature count, directory structure, implementation language, or organisational convenience.

### 13.16 Extension Acceptance and Compatibility

Being loadable, discoverable, configured, parsed, or technically callable does not by itself make an extension acceptable for use in an AppManager workflow.

An extension must preserve the applicable constraints indexed in [§12](#_12-design-principles-and-architectural-invariants).

Declarative resources must additionally satisfy the validation and bounded-semantics requirements of their owning engine. Executable extensions or plugin mechanisms must additionally address trust, compatibility, security, failure isolation, lifecycle, and any permissions required to access AppManager capabilities or managed project resources.

Compatibility should be evaluated at the AppManager semantic boundary, not solely by whether an implementation or resource can be loaded or invoked. A technically compatible provider, adapter, parser, generator, declarative resource, or other extension may still be rejected when its behaviour cannot satisfy required AppManager policy, safety, scope, observability, or information-handling constraints.

Detailed extension compatibility matrices, version negotiation, trust policy, packaging, installation, enablement, isolation, sandboxing, lifecycle, and failure-recovery mechanisms belong in lower-level specifications. A proposed executable plugin mechanism or other extension mechanism that materially changes AppManager's architectural boundaries or technology commitments should be evaluated through the governed architectural-decision process before becoming authoritative design.

---

## 14. Specification Hierarchy, Decision Provenance, and Traceability

### 14.1 Documentation Authority and Normative Hierarchy

This specification applies the [Project Documentation Guide §2](project-documentation-guide-v01.md#_2-documentation-authority) for authority and hierarchy. This stable locator supports existing Design/Functional navigation.

### 14.2 Decision Provenance: Architecture Reviews and ADRs

This specification applies the [Project Documentation Guide §4](project-documentation-guide-v01.md#_4-1-architecture-decision-governance) for decision provenance. This stable locator supports existing Design/Functional navigation.

### 14.3 Root Design Specification Responsibility

This specification applies the [Project Documentation Guide §5](project-documentation-guide-v01.md#_5-level-1-design-specification) for root Design allocation. This stable locator supports existing Design/Functional navigation.

### 14.4 Functional Specification Responsibility

This specification applies the [Project Documentation Guide §6](project-documentation-guide-v01.md#_6-level-2-functional-specification) for Functional allocation. This stable locator supports existing Design/Functional navigation.

### 14.5 Detailed Design Specification Responsibility

This specification applies the [Project Documentation Guide §7](project-documentation-guide-v01.md#_7-level-3-detailed-design-specification) for Detailed Design allocation. This stable locator supports existing Design/Functional navigation.

### 14.6 Implementation Specification Responsibility

This specification applies the [Project Documentation Guide §8](project-documentation-guide-v01.md#_8-level-4-implementation-specification) for Implementation allocation. This stable locator supports existing Design/Functional navigation.

### 14.7 Project Management, Migration, and Implementation Status

This specification applies the [Project Documentation Guide §20](project-documentation-guide-v01.md#_20-design-and-implementation-separation) for project-management and migration allocation. This stable locator supports existing Design/Functional navigation.

### 14.8 Information Allocation and Abstraction Rules

This specification applies the [Project Documentation Guide §16](project-documentation-guide-v01.md#_16-avoiding-duplication) for information allocation and deduplication. This stable locator supports existing Design/Functional navigation.

### 14.9 Traceability

This specification applies the [Project Documentation Guide §9](project-documentation-guide-v01.md#_9-traceability) for traceability. This stable locator supports existing Design/Functional navigation.

### 14.10 Conflict Resolution and Change Propagation

This specification applies the [Project Documentation Guide §17](project-documentation-guide-v01.md#_17-conflict-resolution) for conflict resolution and propagation. This stable locator supports existing Design/Functional navigation.

### 14.11 Specification Evolution and Compliance

This specification applies the [Project Documentation Guide §14](project-documentation-guide-v01.md#_14-document-versioning) for specification evolution. This stable locator supports existing Design/Functional navigation.

---

## 15. Glossary and Appendices

### 15.1 Glossary

Terms are defined at their subject owners: [§3](#_3-terminology-and-naming-conventions) for application terminology; [§4](#_4-operating-context-and-interaction-modes) for modes; [§6](#_6-application-architecture) for capabilities; [§7](#_7-code-intelligence-and-transformation-architecture) for source responsibilities; [§8](#_8-configuration-and-state-architecture) for configuration; [§9](#_9-managed-project-and-project-context-model) for project context; and [§13.2](#_13-2-extension-classes) for extension classes. Decision terminology is defined by the [Project Documentation Guide §4.1](project-documentation-guide-v01.md#_4-1-architecture-decision-governance).

### 15.2 Conceptual System Summary

This non-normative overview illustrates the relationships defined in §§4–11; it is not an additional statement of their contracts.

```text
                                   AppManager
                                       |
                   interaction modes / host integrations
                                       |
            +--------------------------+--------------------------+
            |              |               |                    |
           TUI          Headless           GUI              IDE / tools
            |              |               |                    |
            +--------------+---------------+--------------------+
                                       |
                                       v
                             interaction adapters
                                       |
                                       v
                        Application Invocation Contract
                                       |
                                       v
                              Application Engine
                     command / workflow / policy authority
                                       |
                   +-------------------+-------------------+
                   |                                       |
                   v                                       v
         command discovery / use cases          context and configuration
                   |                            resolution responsibilities
                   |                                       |
                   |                           +-----------+-----------+
                   |                           |                       |
                   |                           v                       v
                   |                 managed project context   effective configuration
                   |                           |
                   |                           v
                   |                     managed scope
                   |                           |
                   +---------------------------+-------------------+
                                       |
                                       v
                         application capability coordination
                                       |
             +-------------------------+-------------------------+
             |                                                   |
             v                                                   v
   AppManager-owned capabilities                         capability boundaries
             |                                                   |
   +---------+----------+---------+---------+                     v
   |         |          |         |         |             capability providers /
services  domain     resolvers  generation  registries    external tools/providers
          engines              and templates                      |
   |         |          |         |         |                      |
   +---------+----------+---------+---------+----------------------+
                                       |
                          +------------+-------------+
                          |                          |
                          v                          v
                 code-intelligence             managed project
                    capability                     context
                          |                          |
                 recognition / facts       +--------+---------+
                          |                 |        |         |
                 strategy / bounded      root app  layers  repositories
                 transformation plan                |
                          |                         other managed
                 transformation mechanism          resources
                          |
                 source-level validation
                          |
                          v
                AppManager-oriented results
                          |
                          v
                   Application Engine
                          |
                          v
                application-level acceptance
                          |
                          v
           structured outcome / diagnostics / events
                          |
                          v
               interaction-adapter presentation
```

Implementation-topology freedom is defined in [§6.6](#_6-6-capability-boundaries-and-providers).

### 15.3 Design Specification Structure

This root Design Specification is intentionally organised around the following responsibilities:

1. Purpose and Scope
2. System Vision and Objectives
3. Terminology and Naming Conventions
4. Operating Context and Interaction Modes
5. Command Model
6. Application Architecture
7. Code-Intelligence and Transformation Architecture
8. Configuration and State Architecture
9. Managed Project and Project Context Model
10. Functional Domains
11. Core System Workflows
12. Design Principles and Architectural Invariants
13. Extensibility Model
14. Specification Hierarchy, Decision Provenance, and Traceability
15. Glossary and Appendices

This structure should remain relatively stable. Detailed capability growth should normally occur in lower-level specifications rather than causing the root Design Specification to expand into component or implementation documentation.

### 15.4 Relationship to Legacy Design Documents

Historical material is interpreted through the [Project Documentation Guide §§17–18](project-documentation-guide-v01.md#_18-documentation-lifecycle-archiving-and-retirement). The current specification, rather than historical implementation, is the product-design entry point.

### 15.5 Version 1 Baseline

This is the Version 1 root Design baseline. It defines the target system; completion of downstream specifications and implementation is tracked separately in [project management](project_management/README.md).


---

# Appendix A — Version 1 Detailed Design Navigation Index

This appendix incorporates the Version 1 Detailed Design navigation index into the root design document as a navigation aid. Its original status and normative effect are preserved: it does not acquire Design Specification authority by inclusion here, and the authority hierarchy stated within the index continues to apply.

# AppManager Detailed Design

> **Document type:** Documentation navigation index
>
> **Status:** Version 1 navigation aid
>
> **Normative effect:** None. This page provides rendered navigation to the approved Detailed Design structure. Product semantics remain governed by the Project Documentation Guide, Design Specification, Functional Specifications, accepted ADRs/active clarifications, and the owning Detailed Designs. Current Detailed Design identity/lifecycle state is recorded by the Detailed Design Register.

## Detailed Design Structure

AppManager Version 1 Detailed Design is organised into four families within Level 3 Detailed Design:

1. **DD-1 — Application Core**
2. **DD-2 — Shared Capabilities**
3. **DD-3 — High-Coupling Domains**
4. **DD-4 — Policy and Resource Domains**

The family number is an organisational identity, not an additional specification level or independent authority tier.

## DD-1 — Application Core

| ID | Detailed Design | Status |
|---|---|---|
| DD-1.1 | [Application Invocation](./dd_1_application_core/dd-1-1-application-invocation-detailed-design-v01.md) | Complete |
| DD-1.2 | [Execution Outcomes](./dd_1_application_core/dd-1-2-execution-outcomes-detailed-design-v01.md) | Complete |
| DD-1.3 | [Managed Project](./dd_1_application_core/dd-1-3-managed-project-detailed-design-v01.md) | Complete |
| DD-1.4 | [Configuration Resolution](./dd_1_application_core/dd-1-4-configuration-resolution-detailed-design-v01.md) | Complete |
| DD-1.5 | [Application Engine](./dd_1_application_core/dd-1-5-application-engine-detailed-design-v01.md) | Complete |

## DD-2 — Shared Capabilities

| ID | Detailed Design | Status |
|---|---|---|
| DD-2.1 | [Resource Access](./dd_2_shared_capabilities/dd-2-1-resource-access-detailed-design-v01.md) | Complete |
| DD-2.2 | [Process Execution](./dd_2_shared_capabilities/dd-2-2-process-execution-detailed-design-v01.md) | Complete |
| DD-2.3 | [Repository Capability](./dd_2_shared_capabilities/dd-2-3-repository-capability-detailed-design-v01.md) | Complete |
| DD-2.4 | [Source Intelligence](./dd_2_shared_capabilities/dd-2-4-source-intelligence-detailed-design-v01.md) | Complete |
| DD-2.5 | [Source Transformation](./dd_2_shared_capabilities/dd-2-5-source-transformation-detailed-design-v01.md) | Complete |
| DD-2.6 | [Resource Registry and Template](./dd_2_shared_capabilities/dd-2-6-resource-registry-and-template-detailed-design-v01.md) | Complete |
| DD-2.7 | [AI Capability](./dd_2_shared_capabilities/dd-2-7-ai-capability-detailed-design-v01.md) | Complete |
| DD-2.8 | [Quality Capability](./dd_2_shared_capabilities/dd-2-8-quality-capability-detailed-design-v01.md) | Complete |
| DD-2.9 | [Documentation Capability](./dd_2_shared_capabilities/dd-2-9-documentation-capability-detailed-design-v01.md) | Complete |
| DD-2.10 | [Nuxt Capability](./dd_2_shared_capabilities/dd-2-10-nuxt-capability-detailed-design-v01.md) | Complete |

## DD-3 — High-Coupling Domains

| ID | Detailed Design | Status |
|---|---|---|
| DD-3.1 | [App Domain](./dd_3_high_coupling_domains/dd-3-1-app-domain-detailed-design-v01.md) | Complete |
| DD-3.2 | [Git Domain](./dd_3_high_coupling_domains/dd-3-2-git-domain-detailed-design-v01.md) | Complete |
| DD-3.3 | [Nuxt Domain](./dd_3_high_coupling_domains/dd-3-3-nuxt-domain-detailed-design-v01.md) | Complete |
| DD-3.4 | [Docs Domain](./dd_3_high_coupling_domains/dd-3-4-docs-domain-detailed-design-v01.md) | Complete |

## DD-4 — Policy and Resource Domains

| ID | Detailed Design | Status |
|---|---|---|
| DD-4.1 | [Quality Domain](./dd_4_policy_and_resource_domains/dd-4-1-quality-domain-detailed-design-v01.md) | Complete |
| DD-4.2 | [Settings Domain](./dd_4_policy_and_resource_domains/dd-4-2-settings-domain-detailed-design-v01.md) | Complete |
| DD-4.3 | [AI Domain](./dd_4_policy_and_resource_domains/dd-4-3-ai-domain-detailed-design-v01.md) | Complete |
| DD-4.4 | [Maintenance Domain](./dd_4_policy_and_resource_domains/dd-4-4-maintenance-domain-detailed-design-v01.md) | Complete |

All Version 1 primary Detailed Design documents are authored. NCR-2 reduction is in progress; the seventeen former DD clarification vehicles have been integrated into primary owners and retired. The active register records their canonical identities and paths; completed decomposition/audit programmes are retained as project history rather than current design authority.

## Governing Navigation Sources

- [Project Documentation Guide](./project-documentation-guide-v01.md)
- [Detailed Design Register](./project_management/detailed-design-register-v01.md)
- [Domain Detailed Design Authoring Guide v02](./project_management/domain-detailed-design-authoring-guide-v02.md)
- [Documentation Assurance Guide](./project_management/documentation-assurance-guide-v01.md)
- [Project Management Library](./project_management/README.md)

When this navigation index and a normative source disagree, the normative source governs.