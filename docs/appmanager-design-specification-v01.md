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

Rather than requiring users or automation systems to coordinate package-manager commands, Git operations, repository relationships, configuration files, documentation tooling, quality checks, code transformation, templates, and AI-assisted workflows independently, AppManager provides a unified application model through which those capabilities can be invoked, governed, and coordinated consistently. AppManager retains application-level authority over the policies, workflows, safety constraints, and outcomes through which those capabilities participate in managed operations.

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
- utility and maintenance operations;
- interactive and automated operation;
- structured programmatic invocation for interaction adapters and external integrations;
- coordination of ecosystem-native capabilities through defined application boundaries;
- extensibility through commands, interaction adapters, capability providers, and cooperating architectural subsystems.

### 1.3 System Boundary

AppManager operates as a management application around a target project.

It does not replace Nuxt, Git, the package manager, the test framework, the operating system, source repositories, AI providers, or other underlying development tools. Instead, it coordinates and augments those systems through defined application capabilities and boundaries. The delegation of specialised work to an external tool, service, provider, or ecosystem-native capability does not transfer ownership of AppManager application policy or workflow authority to that dependency.

AppManager should preserve a clear distinction between:

- the AppManager application itself;
- AppManager application semantics and policy;
- AppManager-owned configuration, state, templates, and logs;
- specialised capabilities delegated to external tools, services, or capability providers;
- the target project being managed;
- external tools and services used by AppManager;
- remote repositories and external providers.

### 1.4 Non-Goals

AppManager is not intended to:

- replace the underlying source-control system;
- replace Nuxt's own framework responsibilities;
- conceal project structure behind an opaque proprietary representation;
- require a graphical interface for core functionality;
- require interactive operation for automatable workflows;
- duplicate application policy or business logic independently across interaction modes, integrations, or capability providers;
- couple application-level semantics to a particular interaction adapter, host environment, or ecosystem-specific implementation mechanism;
- expose ecosystem-specific implementation representations as the general AppManager application model;
- make uncontrolled destructive changes to managed projects;
- make AI-generated output authoritative without validation and project control;
- impose a rigid architectural structure where responsibilities do not require one.

---

## 2. System Vision and Objectives

### 2.1 Vision

AppManager should provide a dependable, extensible, and progressively automatable control surface for sophisticated Nuxt monorepo development.

The application should allow a project to be managed as a coherent system rather than as a loose collection of scripts and unrelated development tools.

AppManager should remain a coherent application system even where its capabilities depend on specialised subsystems, ecosystem-native mechanisms, external tools, or providers. Such capabilities should participate through defined architectural boundaries without fragmenting application policy, workflow authority, or the user-facing application model.

### 2.2 Primary Objectives

AppManager should:

1. provide one coherent command and use-case model for project-management operations;
2. support interactive, automated, graphical, and tool-integrated presentation modes over shared application capabilities;
3. provide a stable structured invocation boundary through which machine-oriented adapters and integrations can invoke commands without depending on human-oriented terminal output;
4. maintain a single coherent application authority for command semantics, application policy, workflow coordination, safety constraints, and application-level outcomes;
5. separate application-level semantics from specialised ecosystem-native mechanisms through defined capability boundaries;
6. prevent interaction adapters, host integrations, external providers, and specialist capability implementations from becoming independent owners of AppManager business logic;
7. understand the structure and relationships of a managed Nuxt monorepo;
8. coordinate operations across the root application and managed layers;
9. provide safe and predictable Git and repository workflows;
10. centralise project-management configuration while supporting project-specific overrides;
11. inspect and modify supported source files through structured code-intelligence mechanisms rather than fragile global text replacement;
12. generate new project artefacts from reusable templates;
13. support repeatable documentation and quality workflows;
14. provide controlled integration with AI services where those services add value;
15. support licensing and other domain-specific project-management capabilities through dedicated subsystems;
16. remain extensible as new commands, file types, capability providers, external providers, project structures, interaction modes, and host-tool integrations are introduced;
17. preserve project ownership, transparency, and reversibility wherever practical.

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

The canonical application name is **AppManager**.

The naming and filesystem conventions governing directories, filenames, identifiers, and documentation are defined by `project-documentation-guide-v01.md` and apply throughout this specification hierarchy.

### 3.2 Target Project

The **target project** is the project currently being managed by AppManager.

It may contain a root Nuxt application, one or more Nuxt layers, project-owned configuration, tests, documentation, repositories, and related development assets.

### 3.3 Tool Root

The **tool root** is the AppManager application environment from which global AppManager resources and defaults may be resolved.

### 3.4 Project Root

The **project root** is the root directory of the target project being managed.

### 3.5 Managed Layer

A **managed layer** is a Nuxt layer recognised by AppManager as part of the target project's managed application structure.

A managed layer may have its own package metadata, source structure, configuration, repository relationship, documentation, tests, and lifecycle operations.

### 3.6 Command

A **command** represents an invokable AppManager application capability within a functional domain.

Commands should express application use cases rather than presentation-specific behaviour.

### 3.7 Interaction Mode

An **interaction mode** is a user-facing or automation-facing mode in which AppManager is operated, such as TUI, Headless, or GUI operation.

Interaction modes expose shared AppManager application semantics and must not define independent application policy or business logic.

### 3.8 Interaction Adapter

An **interaction adapter** is an application-boundary component or integration that translates user, automation, or host-tool interaction into AppManager invocation semantics and translates structured AppManager execution information into an appropriate presentation or host representation.

An interaction adapter may realise an interaction mode or integrate AppManager into a host tool. It should contribute presentation, context acquisition, and host-specific integration behaviour without becoming the owner of AppManager application policy or workflow authority.

### 3.9 Application Invocation Contract

The **Application Invocation Contract** is the stable structured boundary through which interaction adapters and external integrations invoke AppManager commands and receive machine-consumable execution information.

The contract defines the conceptual exchange between callers and the command model without prescribing a particular transport, serialization format, network protocol, or process topology.

### 3.10 Application Engine

The **Application Engine** is the authoritative application-level responsibility that owns AppManager command and use-case coordination, application policy, workflow orchestration, safety constraints, and interpretation of application-level outcomes.

The Application Engine may use specialised subsystems and capability providers to perform delegated work while retaining authority over how that work participates in an AppManager operation. The term describes an architectural responsibility and does not prescribe an implementation language, process boundary, module structure, or deployment topology.

### 3.11 Application Capability

An **application capability** is a coherent function available to AppManager for realising an application use case or supporting another application responsibility.

A capability may be implemented directly within AppManager or delegated to a specialised subsystem, capability provider, external tool, or external provider. Its use within an AppManager workflow remains governed by AppManager application semantics, policy, scope, and safety requirements.

### 3.12 Capability Boundary

A **capability boundary** is a defined architectural separation between AppManager application-level semantics and authority and the specialised mechanisms used to realise a capability.

A capability boundary allows implementation-specific, ecosystem-native, or provider-specific mechanics to remain encapsulated while AppManager consumes stable application-oriented behaviour. The existence of such a boundary does not imply a separate process, network protocol, serialization format, or other particular implementation mechanism.

### 3.13 Capability Provider

A **capability provider** is a component, subsystem, integration, or other bounded mechanism that supplies one or more specialised capabilities to AppManager through an appropriate capability boundary.

A capability provider owns the specialist mechanics required to perform its delegated work but does not thereby acquire authority over AppManager command semantics, application policy, workflow coordination, safety decisions, or final application-level outcomes.

### 3.14 External Provider

An **external provider** is a service or platform outside AppManager's architectural ownership that AppManager may use to realise or support a capability, such as an AI service or repository-hosting service.

External providers are distinct from the AppManager capability-provider abstraction: an AppManager capability provider may encapsulate access to one or more external providers while preserving AppManager-oriented semantics and boundaries.

### 3.15 Architectural Subsystem

An **architectural subsystem** is a coherent family of responsibilities that contributes to AppManager's application capabilities.

Architectural subsystems may differ substantially in scope, internal structure, and collaboration patterns. Their responsibilities and relationships are defined by the application architecture rather than by treating them as equivalent tiers.

---

## 4. Operating Context and Interaction Modes

### 4.1 Operating Model

AppManager should expose one coherent set of application semantics through multiple interaction modes and host-tool integrations.

Interaction modes and host integrations are realised through interaction adapters at the application boundary. Those adapters translate user, automation, or host context into AppManager invocation semantics and translate structured execution information back into the representation appropriate to the caller.

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

Interaction adapters may differ in presentation, input collection, contextual information, and host integration, but they must not become independent owners of AppManager command semantics, application policy, workflow authority, safety rules, or application-level outcomes.

### 4.2 TUI

The Text User Interface is an interactive terminal mode realised through a terminal-facing interaction adapter.

It should support:

- command discovery;
- interactive selection;
- prompts where required information is not already resolvable;
- status and progress feedback;
- confirmation of consequential operations;
- human-readable results and errors.

The TUI may gather information and confirmations interactively, but the resulting operation must use the same AppManager invocation and application semantics as other interaction modes.

### 4.3 Headless Mode

Headless mode provides deterministic non-interactive operation suitable for:

- scripts;
- automation;
- CI/CD;
- scheduled operations;
- repeatable development workflows;
- integration with other tools.

A capability intended for Headless operation must not depend upon interactive prompts to complete normal execution. Required information must instead be supplied explicitly or resolved from configuration and context.

Headless operation should expose structured invocation and execution information suitable for machine consumption without requiring callers to interpret human-oriented presentation.

Headless operation and the Application Invocation Contract are related but distinct concerns. Headless mode defines non-interactive operation; the invocation contract defines the structured application boundary through which callers express command intent and receive execution information.

### 4.4 GUI

A Graphical User Interface is proposed as a first-class interaction mode.

The GUI should expose the same AppManager invocation and application semantics rather than creating a separate application architecture or independent business-logic implementation.

The GUI may provide richer visualisation, navigation, configuration management, status reporting, project inspection, and workflow composition while delegating application behaviour through the shared invocation boundary to the Application Engine.

### 4.5 IDE and Host-Tool Integrations

AppManager may be integrated into development environments and other host tools through dedicated interaction adapters.

A WebStorm plugin is proposed as the first IDE integration. Its purpose would be to expose AppManager capabilities using host context such as the current project, selected file or directory, active editor, selected Nuxt layer, or repository while delegating application behaviour to AppManager.

IDE and host-tool adapters should remain thin where practical. Host-specific presentation, context acquisition, and lifecycle integration belong in the adapter. Host-derived context should be translated into AppManager invocation context rather than becoming an alternative application model.

An IDE or host-tool integration must not reproduce, bypass, or redefine AppManager command semantics, application policy, repository policy, configuration semantics, code-intelligence policy, safety constraints, or workflow authority in the host environment.

### 4.6 Presentation Independence

A core invariant is:

> Interaction adapters may vary in presentation, context acquisition, and host integration, but AppManager application semantics and authority remain independent of those adapters.

Commands and application capabilities must not inherently depend upon a particular presentation mode or host-tool integration. Presentation-specific and host-specific concerns should remain at the application boundary wherever practical.

---

## 5. Command Model

### 5.1 Domain-Oriented Command Model

Within the Application Engine, AppManager is organised around functional domains containing commands that represent application use cases.

The command model is the primary expression of AppManager command identity, use-case semantics, and application intent. It sits behind the Application Invocation Contract and coordinates the application capabilities required to realise each use case without exposing presentation-specific or provider-specific mechanics as command semantics.

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

The contract carries invocation intent and structured execution information, but it does not become the owner of application policy, workflow coordination, safety decisions, or capability-specific implementation mechanics.

Human-readable presentation is an adapter responsibility and must not be the only representation of an operation's outcome where structured invocation is supported.

This specification deliberately does not prescribe whether the contract is realised through process standard input/output, an in-process interface, IPC, RPC, HTTP, sockets, or another transport. Serialization, transport, versioning mechanics, schemas, and concrete execution protocols belong in lower-level specifications.

### 5.3 Command Responsibilities

A command should:

- represent a coherent user or automation intent;
- receive, validate, or resolve sufficient context for the requested use case;
- apply or participate in the AppManager application policy, safety, and scope rules relevant to the use case;
- coordinate the application capabilities required to realise that use case;
- remain independent of presentation-specific and host-specific behaviour;
- avoid making provider-specific or ecosystem-specific implementation representations part of its general application semantics;
- provide meaningful structured success or failure outcomes;
- respect application-wide configuration, non-destructive-operation, and observability principles.

Commands define application intent and invocation semantics within the authority of the Application Engine. Detailed command contracts, internal coordination, algorithms, capability interfaces, and component interactions belong in lower-level specifications.

### 5.4 Command Discovery

The Application Engine should provide a central mechanism through which its available commands and functional domains can be discovered and dispatched.

Command discovery should be available through the Application Invocation Contract so interaction modes and integrations do not need to encode domain behaviour independently. The discoverable command surface should represent the authoritative AppManager command model rather than an adapter-specific or capability-provider-specific view of the system.

The detailed registry contract, command metadata, discovery implementation, and machine-readable discovery schema belong to lower-level specifications.

### 5.5 Shared Execution Semantics

A command's application meaning and application-level outcome semantics should remain consistent across every interaction mode or integration through which that command is exposed.

TUI, Headless, GUI, IDE, and other adapters may differ in how they gather inputs, derive host context, request confirmation, present progress, or display results, but they must not redefine the underlying use case.

Similarly, a specialised subsystem, capability provider, external provider, or other delegated mechanism may vary in how work is performed, but it must not redefine the command's AppManager-level meaning, policy, safety constraints, or final application outcome.

Inputs supplied interactively, explicitly, through automation, or by a host tool should ultimately be expressed through the same invocation and command semantics.

### 5.6 Relationship to Application Architecture

The command model is an Application Engine responsibility. Commands may coordinate capabilities owned by multiple architectural subsystems or supplied through capability boundaries, but command semantics must remain expressed in AppManager application terms.

Section 6 defines the cooperating architectural responsibilities, capability boundaries, and collaboration model through which application capabilities are realised. Section 11 describes principal system workflows where coordination across those responsibilities is significant at the system-design level.

This separation keeps invocation and command intent independent from architectural implementation and provider-specific representations while allowing the same command semantics to be reused across interaction modes, integrations, and capability implementations.

---

## 6. Application Architecture

### 6.1 Architectural Model

AppManager is organised around an authoritative **Application Engine** that owns application-level semantics while coordinating both AppManager-owned capabilities and specialised capabilities supplied through defined boundaries.

The Application Engine is a responsibility boundary rather than a prescribed process, package, module, runtime, or deployment unit. Its purpose is to keep command semantics, application policy, workflow coordination, safety constraints, scope, and final application-level outcomes under one coherent authority even when specialised work is delegated.

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

This diagram expresses authority, responsibility, and delegation rather than implementation topology. A capability boundary may be realised within the same runtime and process as the Application Engine or through another mechanism; that choice belongs in lower-level design and implementation specifications.

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

An architectural subsystem should expose AppManager-oriented capability semantics appropriate to its responsibility and should avoid leaking unrelated implementation-specific representations into the command model.

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

Services should expose coherent reusable capabilities, avoid unnecessary presentation dependencies, and should not absorb specialised domain behaviour merely because multiple commands require it.

Where a service encapsulates ecosystem-specific, provider-specific, or external mechanics, those mechanics should remain behind an appropriate capability boundary rather than becoming part of AppManager's general application model.

### 6.5 Domain Engines

Domain engines encapsulate cohesive specialised application responsibilities that have their own rules, concepts, policy, or coordination requirements within the authority of the Application Engine.

A domain engine may coordinate services, resolvers, registries, configuration, templates, capability providers, and other shared infrastructure while retaining responsibility for its domain-specific application behaviour.

Examples may include licensing, repository-management capabilities, or other sufficiently cohesive concerns identified as AppManager evolves.

Generation and code intelligence may collaborate with domain engines but are not assumed to be domain engines merely because they are specialised. Their architectural classification should follow the responsibility they actually own.

Domain engines should expose reusable AppManager-oriented capabilities rather than presentation-specific workflows or provider-specific representations.

### 6.6 Capability Boundaries and Providers

Where AppManager depends on specialised ecosystem-native, provider-specific, external-tool, or otherwise implementation-specific mechanics, those mechanics should be encapsulated behind an appropriate capability boundary.

The Application Engine should interact with such capabilities in AppManager-oriented terms. A capability provider may own specialist execution mechanics, including use of external tools or external providers, while AppManager retains application policy and outcome authority.

Capability boundaries should be sufficiently explicit that specialised implementations can evolve without requiring command semantics or interaction adapters to inherit their internal representations.

A capability boundary does not by itself require a separate runtime, process, protocol, transport, or deployment unit. Concrete interfaces, schemas, lifecycle rules, process relationships, and communication mechanisms belong in lower-level specifications.

### 6.7 Resolvers

Resolvers determine context-dependent values or resources from available project state, configuration, registries, environment information, provider availability, or user-supplied input.

Resolvers are particularly important where AppManager must separate the question of **what value is required** from **where that value comes from**.

Resolution participates in AppManager application semantics when the selected value affects command meaning, policy, scope, or safety. The mechanism used to obtain a candidate value may itself depend on a specialised capability provider.

Resolution should be deterministic in Headless operation and may be augmented by interactive prompting in presentation modes that permit it.

### 6.8 Generation and Templates

The generation subsystem is responsible for producing new project artefacts from controlled generators or templates and resolved project data.

Templates are intended primarily for creation and scaffolding rather than arbitrary mutation of existing source files.

Generation should avoid hard-coded user-specific or environment-specific assumptions where those values can be resolved through configuration.

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

Registries should not cause provider-specific representations or implementation topology to become part of the authoritative AppManager application model.

---

## 7. Code-Intelligence and Transformation Architecture

### 7.1 Purpose

AppManager requires controlled inspection, understanding, documentation, and modification of existing source files for capabilities such as documentation, metadata maintenance, header management, configuration manipulation, and future code-aware automation.

Code intelligence is a specialised application capability used by the Application Engine and other AppManager responsibilities. It does not own command semantics, application policy, workflow authority, or final application-level outcomes.

This responsibility is distinct from generating new files from templates.

### 7.2 Architectural Position and Capability Boundary

Code-intelligence capabilities may be realised through AppManager-owned components, specialised capability providers, external parsers or language tooling, or a combination of those mechanisms.

Where code intelligence depends on ecosystem-native or implementation-specific representations such as parser trees, compiler models, symbols, nodes, or language-service objects, those representations should remain encapsulated behind an appropriate capability boundary rather than becoming part of AppManager's general application model.

Code-intelligence capabilities should expose AppManager-oriented information such as:

- structural facts about supported source;
- diagnostics and validation information;
- identified documentable or manageable regions;
- bounded transformation plans;
- transformation outcomes;
- validation results.

The Application Engine and consuming AppManager subsystems remain responsible for deciding how those results participate in a command, workflow, policy decision, or final application outcome.

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

A scanner recognises and describes source structure. It should not, merely by virtue of recognition, own transformation policy or apply source mutations.

Scanners are not intended to be general-purpose compiler replacements. Where a compiler, parser, or language service provides the appropriate specialist understanding, a scanner may delegate or be unnecessary.

### 7.5 Strategies and Transformation Plans

Strategies encapsulate source-type-specific transformation policy and planning.

A strategy consumes the structural understanding required by a use case and determines how an AppManager transformation intent can be represented as a safe, bounded **transformation plan** for the relevant source type.

A transformation plan describes the intended bounded source change before mutation occurs. At the Design Specification level it represents the scope, structural target, intended change, and constraints necessary for the transformation mechanism and subsequent validation without prescribing a concrete schema or data structure.

Transformation plans should be sufficiently explicit to support review, dry-run or preview behaviour, controlled execution, and post-transformation validation where those capabilities are required.

Strategies allow AppManager to add source-aware transformation behaviour without embedding format-specific policy throughout the command model.

A strategy does not need to execute the resulting edit itself. Transformation execution is a distinct responsibility, allowing the same transformation policy to be realised through different appropriate mechanisms where necessary.

A strategy should not require commands or interaction adapters to understand parser-specific, compiler-specific, or provider-specific internal representations.

### 7.6 Transformation Mechanisms

A transformation mechanism applies an approved bounded transformation plan to the target source.

It owns the mechanics of performing the edit accurately within the supplied scope, but it does not independently determine AppManager application policy, transformation intent, or whether a consequential change is permitted.

Transformation mechanisms may use direct structural editing, ecosystem-native parser or compiler facilities, specialised capability providers, or other source-aware techniques appropriate to the source type and transformation.

The mechanism should return sufficient structured information for the resulting source and transformation outcome to be validated without requiring higher-level AppManager consumers to depend on its internal representation.

Transformation is therefore a code-intelligence responsibility rather than, by default, a generic application service. A transformation mechanism may itself depend on reusable services or capability providers where those are appropriate to its implementation.

### 7.7 Validation

Validation determines whether inspected or transformed source satisfies the structural, syntactic, semantic, or transformation-specific constraints relevant to the code-intelligence operation.

Validation may involve re-inspection, structural comparison, parsing, compilation, type or schema checking, language-service analysis, or other appropriate source-aware mechanisms. The exact validation technique belongs in lower-level specifications and may differ by source type and transformation.

Validation should produce AppManager-oriented results and diagnostics rather than require higher-level consumers to interpret implementation-specific parser, compiler, or provider representations.

Source-level validation and application-level acceptance are distinct responsibilities:

- **source-level validation** belongs to the code-intelligence capability and determines whether the resulting source is valid with respect to the relevant structural and transformation constraints;
- **application-level acceptance** belongs to the Application Engine and determines whether the validated result satisfies the command intent, application policy, scope, safety requirements, and overall workflow outcome.

A technically valid source transformation may therefore still be rejected or treated as unsuccessful at the application level.

Validation is a code-intelligence responsibility rather than, by default, a generic application service. Validators may depend on shared services, capability providers, parsers, compilers, language services, or external tooling where appropriate.

### 7.8 Orchestrators

Orchestrators coordinate multiple lower-level code-intelligence capabilities where a file, artefact, or workflow spans more than one specialised representation or operation.

They should compose recognition, strategy, transformation planning, transformation execution, validation, and other existing capabilities rather than duplicate them, and should preserve AppManager-oriented semantics across the composed operation.

An orchestrator is a code-intelligence composition responsibility; it does not thereby become the owner of application-level workflow policy outside that bounded capability.

### 7.9 Inspection and Mutation Separation

Where practical, AppManager should distinguish between:

- inspecting and recognising existing source;
- determining transformation intent and producing a bounded transformation plan;
- approving and applying the planned change;
- validating the resulting source;
- evaluating the validated result at the application level.

This separation supports safer automation, structured diagnostics, reviewable transformation intent, independent validation, future preview or dry-run capabilities, and clear application-level outcome handling.

The decision to apply a consequential transformation remains subject to AppManager application policy and safety constraints rather than being implicit in the inspection, strategy, transformation mechanism, or validator.

### 7.10 Non-Destructive Transformation

Source transformation should preserve unrelated user content, formatting, comments, and configuration wherever practical.

AppManager should avoid full-file regeneration when a bounded structural edit can safely achieve the intended result.

A specialised transformation mechanism or provider may determine the mechanics of a bounded edit, but AppManager retains authority over transformation intent, permitted scope, and acceptance of the resulting application-level outcome.

### 7.11 Structured Formats

Structured configuration formats should be modified through structure-aware mechanisms where available rather than through unrestricted textual replacement.

The use of a structure-aware mechanism does not require its native representation to escape the code-intelligence capability boundary. AppManager-level consumers should depend on the structural meaning required by the use case rather than on a particular parser or library object model.

### 7.12 Composite Source Files

Where a source file contains multiple embedded languages or structural regions, AppManager should favour extraction, delegation, and controlled recomposition over creating monolithic format-specific logic.

Different specialised recognition, transformation, and validation mechanisms may therefore participate in one code-intelligence operation, provided that their results are coordinated through a coherent capability and unrelated source content remains protected.

### 7.13 Ecosystem-Native and External Parsing

Code intelligence may rely on ecosystem-native parsers, compilers, language services, or other external parsing mechanisms where they provide more reliable understanding, transformation support, or validation than AppManager-owned lexical analysis.

Such mechanisms should be treated as specialised capability implementations or dependencies rather than as the authoritative AppManager application model. Their native trees, symbols, handles, or other implementation representations should remain encapsulated unless a lower-level design explicitly requires a bounded internal use of them.

This allows AppManager to use the most appropriate source-aware tooling without coupling command semantics, transformation policy, validation semantics, interaction adapters, or unrelated subsystems to a particular parser ecosystem.

### 7.14 Future Language Support

The architecture should allow additional source formats and language variants to be introduced through appropriate scanners, strategies, transformation mechanisms, validators, orchestrators, capability providers, or parser integrations without redesigning the command system or Application Engine.

New language support should preserve the same architectural separation between recognition, transformation policy and planning, transformation execution, source-level validation, application-level acceptance, AppManager-oriented code-intelligence semantics, and language-specific implementation representations.

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

AppManager should resolve candidate values through defined, deterministic configuration semantics to produce the **effective configuration** used by the Application Engine and application capabilities for a particular scope or operation.

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

Where useful, AppManager should be able to identify the configuration source from which an effective value originated.

The exact precedence chain, configuration schema, persistence format, and resolution algorithm belong in Functional and Detailed Design Specifications. This Design Specification requires only that resolution be deterministic, explainable where practical, and independent of presentation-specific behaviour.

### 8.3 Configuration Authority and Resolution Responsibilities

The Application Engine retains application-level authority over how effective configuration influences command semantics, policy, workflow coordination, safety, and outcomes.

Resolvers may determine candidate or effective values from available configuration sources, project state, invocation context, registries, provider availability, or environment information. Services or capability providers may supply access to those sources.

Neither a configuration source, resolver, service, interaction adapter, external provider, nor capability provider should independently redefine AppManager configuration policy merely because it participates in obtaining a value.

This separation allows configuration storage and retrieval mechanisms to evolve without making their representation or location part of the authoritative AppManager application model.

### 8.4 Separation of Resolution and Interaction

Configuration resolution must remain usable without a user interface.

If a required value cannot be resolved and an interactive mode permits prompting, an interaction adapter may obtain additional user input and return that value through the normal invocation or resolution flow.

The adapter supplies information; it does not acquire authority over configuration precedence, validity, or application policy.

Headless operation must resolve required values deterministically, use an explicitly defined fallback where permitted, or fail clearly. It must not unexpectedly require interactive input.

### 8.5 AppManager-Owned Management Area

AppManager may maintain a recognisable application-owned management area within the tool environment and managed project for AppManager-owned resources.

The current design uses the directory name:

```text
app_manager/
```

This management area may contain resources such as durable configuration, registries, templates, operational state, logs, reports, and other AppManager-owned data appropriate to its scope.

The existence of one recognisable management area does not imply that every resource within it has the same lifecycle, authority, sensitivity, portability, or source-control policy. The precise internal structure and physical storage mechanisms belong in lower-level specifications.

### 8.6 Configuration Categories

Configuration may include concerns such as:

- application metadata;
- author and contributor defaults;
- repository configuration;
- AI-provider configuration;
- template selection;
- licensing preferences;
- documentation settings;
- quality settings;
- command defaults;
- environment-related values.

Configuration values should be classified according to their scope, authority, sensitivity, and expected portability rather than treated as one uniform data set.

### 8.7 Sensitive Configuration

Sensitive configuration includes secrets, credentials, tokens, private keys, or other values whose disclosure would create security or privacy risk.

Sensitive configuration should remain logically distinct from ordinary shareable project configuration even where both participate in producing effective configuration.

AppManager should avoid making sensitive values part of source-controlled project authority or exposing them unnecessarily through logs, diagnostics, generated reports, structured results, or presentation surfaces.

The concrete secret-storage technology, encryption mechanism, credential provider, and platform integration belong in lower-level specifications.

### 8.8 Configuration, State, Reports, and Logs

AppManager-managed information should distinguish at least the following conceptual categories:

- **durable configuration** — intended settings or metadata that may influence future AppManager behaviour;
- **sensitive configuration** — protected configuration requiring stricter handling than ordinary shared settings;
- **operational state** — machine-maintained information describing or supporting current or prior AppManager operations;
- **generated reports and derived artefacts** — outputs produced from project or operational information rather than authoritative configuration inputs;
- **logs and diagnostics** — observational records intended to explain execution behaviour and failures.

These categories may have different persistence, portability, retention, sharing, source-control, and security requirements. They should not acquire configuration authority merely because they are stored near configuration data or under the same AppManager-owned management area.

Operational state, generated reports, derived artefacts, logs, and machine-local data should not accidentally become durable or source-controlled project authority.

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

The managed project context should make the relevant project identity, root application, managed layers, repository relationships, configuration scope, and operation targets available in AppManager-oriented terms without requiring commands or adapters to infer them independently.

The Application Engine remains responsible for interpreting that context according to command semantics, policy, scope, and safety requirements.

### 9.3 Root Application and Managed Layers

The root Nuxt application and its managed layers are distinct but related project entities.

AppManager should be able to address the root application, all managed layers, or a selected subset of those entities where the relevant use case supports such scope.

A managed layer may have its own source structure, package metadata, configuration, documentation, tests, repository relationship, and lifecycle operations. The fact that a layer is structurally part of the Nuxt application does not require it to share the same repository, configuration origin, or management lifecycle as the root application.

Likewise, repository boundaries must not be used as a substitute for Nuxt application structure. Project topology and repository topology are related but distinct concerns.

### 9.4 Project Topology and Resource Relationships

AppManager should model the relationships among root application, managed layers, repositories, AppManager-owned management resources, and other managed project entities explicitly enough for commands to operate on the intended targets without reconstructing those relationships independently.

This conceptual **project topology** should express AppManager-relevant relationships rather than expose incidental filesystem or provider-specific implementation details as the authoritative project model.

A physical directory hierarchy may contribute evidence to project discovery, but directory containment alone should not define every semantic relationship within the managed project.

### 9.5 Repository Relationships

A managed project may span one repository, multiple repositories, nested repository relationships, or other supported source-control arrangements.

Repository relationships should therefore be represented as properties and relationships of managed project entities rather than treated as the identity of the managed project itself.

AppManager should be able to determine which repository or repositories are relevant to a project-wide, root-application, layer-specific, or otherwise scoped operation without assuming that every managed entity belongs to one repository.

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

Project discovery and context resolution should produce one coherent AppManager managed project context before a command depends on project identity or scope. Ambiguous, conflicting, or insufficient context should be handled explicitly rather than resolved through hidden assumptions.

Headless operation must resolve project context deterministically or fail clearly. Interactive adapters may help a user disambiguate candidate context, but they must not redefine AppManager project semantics.

Detailed discovery precedence, markers, filesystem traversal, metadata formats, and validation algorithms belong in Functional and Detailed Design Specifications.

### 9.7 Managed Scope and Operation Targeting

The **managed scope** of an operation is the resolved set of project entities to which that operation is intended to apply.

Depending on the command, scope may include the complete managed project, the root application, all managed layers, selected layers, selected repositories, selected files, or another bounded set of project entities.

Consequential operations should resolve and make their managed scope clear before mutation or external side effects occur. A project-wide operation must still respect the command's semantics, exclusions, safety rules, and ownership boundaries rather than assuming that every discoverable resource is an eligible target.

Scope selection may be informed by interaction or host context, but the meaning and permitted effect of that scope remain AppManager application responsibilities.

### 9.8 AppManager-Owned Management Area and Project Coexistence

The AppManager-owned management area defined in Section 8 is part of the management context associated with a target project; it is not a replacement for the target project's own structure.

AppManager-owned configuration, state, registries, templates, reports, and other management resources should coexist with user-authored project resources without requiring the project to be reorganised around AppManager internals.

The presence of AppManager-owned data does not grant AppManager ownership of adjacent project files, directories, repositories, or framework resources.

### 9.9 Non-Destructive Ownership and Unmanaged Content

Recognition, discovery, or inclusion in a managed project context does not by itself grant AppManager authority to modify a resource.

AppManager should distinguish between understanding a resource, including it within project context, targeting it for a supported operation, and owning AppManager-generated or AppManager-maintained data.

Operations must preserve unrelated user-authored content and unmanaged resources wherever practical and should modify only resources permitted by the command's resolved managed scope, application policy, and safety constraints.

### 9.10 Independence from Incidental Physical Layout

AppManager should support the enduring structural concepts of a Nuxt application, managed layers, repositories, and AppManager-owned management resources without making command semantics depend on incidental source-tree arrangements that are not part of those concepts.

Concrete directory names other than explicitly adopted architectural conventions, path-search algorithms, workspace layouts, repository markers, project-discovery heuristics, and source-tree assumptions belong in lower-level specifications.

---

## 10. Functional Domains

AppManager's user-facing capabilities are organised into functional domains.

The domain list may evolve, but the following domains represent the current intended product surface.

### 10.1 App Domain

The `app` domain manages application lifecycle operations.

Its responsibilities may include:

- environment initialisation;
- dependency installation;
- build;
- preview;
- local development execution;
- cleaning generated state;
- controlled emptying or reset operations;
- reinitialisation;
- creation of new applications;
- creation of new layers.

### 10.2 Docs Domain

The `docs` domain manages project documentation operations.

Its responsibilities may include documenting:

- the complete application;
- application source;
- all layers;
- a selected layer;
- tests;
- selected files;
- code structures identified through the code-intelligence subsystem.

### 10.3 Git Domain

The `git` domain manages source-control and repository workflows.

Its responsibilities may include:

- repository initialisation;
- configuration inspection;
- commits;
- AI-assisted commit generation;
- commit management;
- remote management;
- submodule or managed-repository relationships;
- layer repository initialisation;
- repository synchronisation;
- scoped synchronisation;
- pushing to one or more remotes;
- project-wide repository operations;
- controlled remote-repository lifecycle operations.

Destructive Git or remote operations must receive appropriate safeguards.

### 10.4 AI Domain

The `ai` domain manages AI-related project capabilities.

Its responsibilities may include:

- AI-provider selection and resolution;
- project AI instruction documents;
- AI-assisted documentation;
- AI-assisted commits;
- future AI-supported development workflows.

AI integration must remain optional where practical and must not make an external model the source of project authority.

### 10.5 Nuxt Domain

The `nuxt` domain manages Nuxt-specific project concerns.

Its responsibilities may include:

- Nuxt application creation;
- layer creation and management;
- Nuxt configuration inspection;
- configuration addition and removal;
- layer-aware project operations;
- other framework-specific management capabilities.

### 10.6 Quality Domain

The `quality` domain manages verification and quality-control workflows.

Its responsibilities may include:

- complete test-suite execution;
- unit tests;
- end-to-end tests;
- coverage;
- test user interfaces;
- future linting, type checking, validation, and quality gates.

Quality operations should be reusable in both interactive and automated workflows.

### 10.7 Utils Domain

The `utils` domain contains cross-project maintenance operations that do not warrant a more specific functional domain.

Its responsibilities may include:

- source-header inspection;
- source-header repair;
- contributor maintenance;
- automated documentation operations;
- automated versioning operations;
- log maintenance;
- header validation;
- other bounded maintenance utilities.

The domain should not become a dumping ground for capabilities that have a clearer architectural owner.

### 10.8 Settings Domain

The `settings` domain provides user-facing management of AppManager configuration.

Its responsibilities may include:

- application defaults;
- author information;
- funding information;
- issue-reporting metadata;
- repository metadata;
- application metadata;
- licensing defaults;
- keywords;
- environment variables;
- contributors;
- templates;
- other configurable AppManager behaviour.

Configuration storage and resolution remain subsystem responsibilities; the Settings domain provides use cases for managing them.

---

## 11. Core System Workflows

### 11.1 Command Invocation

A normal AppManager workflow is conceptually:

```text
user / automation / host tool
       |
       v
interaction adapter
       |
       v
application invocation contract
       |
       v
command discovery and dispatch
       |
       v
context and configuration resolution
       |
       v
application capability coordination
       |
       v
services / subsystems / domain engines
       |
       v
managed project or external provider
       |
       v
structured result and diagnostics
       |
       v
adapter-specific presentation
```

The Application Invocation Contract should preserve command intent, scope, structured outcomes, and relevant execution information independently of how a particular adapter presents them.

### 11.2 Application Lifecycle Workflow

Application lifecycle commands may coordinate package-manager execution, project cleanup, generation, configuration, and validation.

Consequential cleanup or reset operations must distinguish recoverable generated state from user-authored project content.

### 11.3 Repository Synchronisation Workflow

Repository synchronisation should support the fact that a managed project may contain multiple repositories.

The workflow may operate at project-wide, local, selected, or otherwise explicitly defined scope.

The system should favour safe, comprehensible defaults and make the selected scope observable to the user or automation caller.

### 11.4 Documentation Workflow

Documentation workflows should use structural code understanding where documentation depends on existing source.

A conceptual flow is:

```text
select scope
    |
    v
discover files
    |
    v
select appropriate strategy
    |
    v
inspect documentable structures
    |
    v
generate documentation content
    |
    v
apply controlled updates
    |
    v
validate and report
```

### 11.5 Source Transformation Workflow

Where AppManager modifies existing source, it should:

1. identify the target and transformation intent;
2. select the appropriate source-aware mechanism;
3. inspect the existing structure;
4. calculate bounded changes;
5. apply changes in an order that avoids invalidating later targets;
6. preserve unrelated source content;
7. validate or re-inspect the result where practical;
8. report the outcome.

### 11.6 Generation Workflow

Where AppManager creates a new artefact, it should:

1. determine the requested artefact type;
2. resolve required project and user values;
3. select the appropriate template or generator;
4. render the new content;
5. validate destination safety;
6. write the artefact;
7. report the result.

Generation of new content and mutation of existing content should remain conceptually distinct.

### 11.7 Quality Workflow

Quality commands should delegate process execution through shared application capabilities and produce results that can be consumed both by humans and automated environments.

### 11.8 AI-Assisted Workflow

AI-assisted workflows should:

- resolve an available configured provider;
- construct bounded project context;
- request a clearly defined result;
- validate or constrain the result where practical;
- provide deterministic fallback behaviour where the capability supports it;
- avoid treating model output as authoritative project truth without review or validation.

---

## 12. Design Principles and Architectural Invariants

### 12.1 Presentation Independence

Application capabilities must not inherently depend on TUI, Headless, GUI, IDE, or other host-tool presentation.

### 12.2 Structured Invocation Boundary

Machine-oriented interaction adapters and integrations should invoke commands through a stable structured Application Invocation Contract rather than depend on parsing human-oriented presentation output.

The contract must remain conceptually independent of any single transport or host environment.

### 12.3 Domain Responsibility

Capabilities should reside in the domain or subsystem that owns their responsibility rather than being duplicated across unrelated commands.

### 12.4 Non-Destructive Operation

AppManager should preserve user-authored content and project structure wherever practical.

Destructive operations must be explicit, scoped, and appropriately safeguarded.

### 12.5 Structured Modification

Existing structured files should be modified through structure-aware mechanisms wherever practical.

### 12.6 Generation and Mutation Separation

Templates generate new artefacts. Source-aware strategies, transformation mechanisms, validators, and related code-intelligence components inspect, plan, modify, or validate existing artefacts.

These responsibilities should not be conflated.

### 12.7 Configuration over Hard-Coding

User, project, repository, provider, and environment-specific values should be resolved from configuration or context rather than embedded into reusable application logic or templates.

### 12.8 Deterministic Headless Operation

Headless workflows must not unexpectedly require interactive input.

### 12.9 Observable Operations

Significant operations should produce sufficient logging, diagnostics, or structured results to explain what occurred and why a failure occurred.

### 12.10 Shared Infrastructure

Cross-cutting capabilities such as filesystem access, process execution, Git operations, logging, and configuration should be reusable rather than independently reimplemented by commands.

### 12.11 Explicit Scope

Operations spanning root projects, layers, repositories, files, or environments should have a clearly defined scope.

### 12.12 Extensible Discovery

Where the system supports multiple commands, strategies, providers, repositories, templates, or similar resources, discovery should be designed to accommodate extension without widespread conditional logic.

### 12.13 AI as an Optional Capability

AI services may enhance AppManager workflows but must not become an implicit requirement for unrelated core operations.

### 12.14 Design Authority

Implementation must follow approved design and functional requirements. Current source behaviour does not automatically redefine the intended system.

### 12.15 Architectural Responsibility Model

Services, domain engines, code-intelligence components, resolvers, generators, templates, registries, invocation boundaries, and adapters represent distinct responsibilities and collaboration patterns rather than equivalent tiers in a uniform stack.

### 12.16 Nuxt Layer Terminology

Because `layer` has a specific meaning within Nuxt, architectural documentation should avoid using the term ambiguously when `subsystem`, `component family`, `stage`, or `adapter` is more accurate.

---

## 13. Extensibility Model

### 13.1 Command Extensibility

New application capabilities should be introducible as commands within an appropriate functional domain without requiring presentation-specific reimplementation.

### 13.2 Domain Extensibility

New functional domains may be introduced where a coherent family of use cases cannot be represented cleanly within existing domains.

Domains should remain meaningful product concepts rather than arbitrary source-code groupings.

### 13.3 Source-Type Extensibility

New file types should be supportable through appropriate scanner, strategy, transformation mechanism, validator, orchestrator, or parser integration.

### 13.4 Provider Extensibility

External providers, particularly AI providers and repository-related services, should be abstracted sufficiently that support can evolve without rewriting commands that depend only on their common capabilities.

### 13.5 Template Extensibility

New templates and generators should be introducible without embedding generated content directly into unrelated command logic.

### 13.6 Resolver Extensibility

New sources of configuration or contextual values should be incorporable through resolution mechanisms without requiring presentation-specific access throughout the application.

### 13.7 Interaction and Integration Extensibility

The interaction and invocation model should permit additional adapters beyond TUI, Headless, and GUI when future requirements justify them.

IDE plugins, editor extensions, CI integrations, AI agents, and other development-tool integrations should be able to supply host-specific context and consume structured AppManager results through the Application Invocation Contract without reproducing AppManager domain behaviour.

WebStorm is the first proposed IDE adapter, but the architecture must not make the invocation contract WebStorm-specific or JetBrains-specific.

### 13.8 Invocation Contract Extensibility

The Application Invocation Contract should be capable of evolving as new adapters and automation requirements emerge while preserving stable command identity and semantics.

Concrete compatibility, schema-versioning, transport, and protocol rules belong in lower-level specifications.

### 13.9 Domain Engine Extensibility

Specialised concerns such as licensing may be implemented as dedicated domain engines where they require coherent rules, data, templates, or validation beyond ordinary service responsibilities.

---

## 14. Specification Hierarchy and Traceability

### 14.1 Documentation Authority

The project documentation hierarchy is governed by `project-documentation-guide-v01.md`.

The hierarchy is:

```text
project documentation guide
          |
          v
design specification
          |
          v
functional specification
          |
          v
detailed design specification
          |
          v
implementation specification
```

This document occupies the Design Specification level.

### 14.2 Design Specification Responsibility

This document answers:

> What is AppManager intended to be?

It defines system intent and architecture without attempting to specify every command, component, method, or implementation path.

### 14.3 Functional Specification Responsibility

Functional Specifications answer:

> What must AppManager do?

They refine the domains and capabilities defined here into behavioural requirements, inputs, outputs, validation, failure behaviour, and user-visible workflows.

### 14.4 Detailed Design Specification Responsibility

Detailed Design Specifications answer:

> How should AppManager realise that functionality internally?

They define command contracts, invocation schemas and protocols, services, strategies, scanners, transformation mechanisms, validators, orchestrators, resolvers, interfaces, algorithms, data structures, and subsystem interactions.

### 14.5 Implementation Specification Responsibility

Implementation Specifications answer:

> How does the current codebase realise the approved design?

They contain source paths, concrete symbols, dependencies, wiring, implementation status, migration requirements, and code-specific constraints.

### 14.6 Traceability

Specifications should support useful traceability from system intent through implementation.

Example:

```text
Design
  repository management
       |
       v
Functional
  synchronise managed repositories
       |
       v
Detailed Design
  sync command
  repository resolver
  git service
       |
       v
Implementation
  concrete command, resolver and service modules
```

Lower-level specifications should reference the higher-level requirement or design responsibility they refine where that relationship would otherwise be unclear.

### 14.7 Implementation Status

Statements about incomplete wiring, stubs, unused components, temporary source paths, migration work, or current implementation coverage do not belong in this root Design Specification unless they materially constrain the intended design.

Such information should be captured by Implementation Specifications, implementation audits, roadmaps, or issue tracking as appropriate.

---

## 15. Glossary and Appendices

### 15.1 Glossary

| Term | Meaning |
|---|---|
| AppManager | The canonical name of the application defined by this specification. |
| target project | The Nuxt project currently being managed by AppManager. |
| project root | The root directory of the target project. |
| tool root | The AppManager application environment from which global resources and defaults may be resolved. |
| managed layer | A Nuxt layer recognised by AppManager as part of the managed project. |
| managed project context | The resolved AppManager view of the target project relevant to a particular invocation or operation, including the project entities, relationships, configuration scope, and operation targets needed by that use case. |
| project topology | The AppManager-relevant relationships among the root application, managed layers, repositories, AppManager-owned management resources, and other managed project entities. |
| managed scope | The resolved set of project entities to which a particular AppManager operation is intended and permitted to apply. |
| command | An invokable AppManager use case within a functional domain. |
| functional domain | A coherent family of user-facing AppManager capabilities. |
| interaction mode | A user-facing or automation-facing mode in which AppManager is operated, such as TUI, Headless, or GUI. |
| interaction adapter | An application-boundary component or integration that translates user, automation, or host-tool interaction into AppManager invocation semantics and structured execution information into an appropriate presentation or host representation. |
| Application Invocation Contract | The stable structured boundary through which interaction adapters and external integrations invoke commands and receive machine-consumable execution information. |
| Application Engine | The authoritative application-level responsibility that owns command and use-case coordination, application policy, workflow orchestration, safety constraints, and interpretation of application-level outcomes. |
| application capability | A coherent function available to AppManager for realising an application use case or supporting another application responsibility. |
| capability boundary | A defined architectural separation between AppManager application-level semantics and authority and the specialised mechanisms used to realise a capability. |
| capability provider | A bounded component, subsystem, integration, or mechanism that supplies specialised capabilities to AppManager without acquiring AppManager application policy or workflow authority. |
| external provider | A service or platform outside AppManager's architectural ownership that AppManager may use to realise or support a capability. |
| architectural subsystem | A coherent family of responsibilities that contributes to AppManager's application capabilities. |
| TUI | Text User Interface. |
| Headless | Non-interactive AppManager operation for automation and scripted use. |
| GUI | Proposed Graphical User Interface over shared AppManager capabilities. |
| IDE adapter | A host-tool interaction adapter that contributes IDE-specific presentation and context while delegating application behaviour to AppManager. |
| service | A reusable operational capability used by commands or other subsystems; transformation and validation responsibilities are not services merely by virtue of being reusable. |
| domain engine | A cohesive specialised subsystem that owns domain-specific rules, concepts, or coordination. |
| scanner | A component that recognises lexical or structural information in supported source text without inherently owning transformation policy or mutation. |
| strategy | A component that encapsulates source-type-specific transformation policy and planning. |
| transformation plan | A bounded source-aware description of an intended change, its structural target, scope, and relevant constraints before mutation is executed. |
| transformation mechanism | A component or delegated capability that applies an approved bounded transformation plan to source without independently owning AppManager transformation policy. |
| validation | The code-intelligence responsibility that determines whether inspected or transformed source satisfies the relevant structural, syntactic, semantic, or transformation-specific constraints. |
| application-level acceptance | The Application Engine responsibility that determines whether a validated capability result satisfies command intent, application policy, scope, safety requirements, and the overall workflow outcome. |
| orchestrator | A component that composes multiple specialised capabilities for a composite operation or artefact. |
| resolver | A component responsible for determining a context-dependent value or resource. |
| configuration source | A source that supplies candidate configuration values to AppManager resolution without independently owning configuration policy or authority. |
| effective configuration | The resolved AppManager configuration produced from applicable candidate values according to defined configuration semantics for a particular scope or operation. |
| sensitive configuration | Configuration such as secrets, credentials, tokens, or private keys requiring stricter handling than ordinary shareable settings. |
| operational state | Machine-maintained information describing or supporting current or prior AppManager operations, distinct from durable configuration authority. |
| generation subsystem | The subsystem responsible for generating new artefacts from generators or templates and resolved data. |
| registry | A discoverable mapping of configured or supported resources. |
| code intelligence | AppManager capabilities for structured inspection, understanding, documentation, controlled transformation, and source-level validation of existing source. |

### 15.2 Conceptual System Summary

```text
                                  AppManager
                                      |
              +-----------------------+-----------------------+
              |               |               |              |
             tui           headless           gui       ide / tools
              |               |               |              |
              +---------------+---------------+--------------+
                                      |
                                      v
                         application invocation contract
                                      |
                                      v
                             command / use cases
                                      |
                 +--------------------+--------------------+
                 |                    |                    |
                 v                    v                    v
           application services   domain engines     code intelligence
                 |                    |                    |
                 |                    |          scanners / strategies /
                 |                    |              orchestrators
                 |                    |                    |
                 +-------------+------+--------------------+
                               |      |
                               v      v
                           resolvers  generation
                                      and templates
                               |      |
                               +--+---+
                                  |
                                  v
                           managed project
                                  |
                     +------------+------------+
                     |            |            |
                  root app      layers     repositories
```

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
14. Specification Hierarchy and Traceability
15. Glossary and Appendices

This structure should remain relatively stable. Detailed capability growth should normally occur in lower-level specifications rather than causing the root Design Specification to expand into component or implementation documentation.

### 15.4 Relationship to Legacy Design Documents

Earlier AppManager design, architecture, command, roadmap, and implementation-audit documents remain useful source material during documentation rationalisation.

They should not be retired until their unique information has been classified and either:

- incorporated into this Design Specification where it represents durable system intent;
- transferred into a Functional Specification;
- transferred into a Detailed Design Specification;
- transferred into an Implementation Specification or implementation audit;
- recorded as an explicit proposal or unresolved design question;
- deliberately rejected as obsolete.

Once that accounting is complete, superseded documents should be clearly retired so that the project has one authoritative specification for each responsibility.