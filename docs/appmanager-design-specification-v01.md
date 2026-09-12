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

AppManager is organised around functional domains containing commands that represent application use cases.

The command model provides a stable application boundary beneath the Application Invocation Contract and above the shared application capabilities that realise each use case.

Conceptually:

```text
interaction adapter / external integration
                 |
                 v
      application invocation contract
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
     shared application capability
```

The architectural subsystems through which commands realise application capabilities are defined in Section 6. The command model does not prescribe their internal structure.

### 5.2 Application Invocation Contract

The Application Invocation Contract provides a common structured boundary between callers and the command model.

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

Human-readable presentation is an adapter responsibility and must not be the only representation of an operation's outcome where structured invocation is supported.

This specification deliberately does not prescribe whether the contract is realised through process standard input/output, an in-process interface, IPC, RPC, HTTP, sockets, or another transport. Serialization, transport, versioning mechanics, schemas, and concrete execution protocols belong in lower-level specifications.

### 5.3 Command Responsibilities

A command should:

- represent a coherent user or automation intent;
- receive, validate, or resolve sufficient context for the requested use case;
- invoke the application capabilities required to realise that use case;
- remain independent of presentation-specific and host-specific behaviour;
- provide meaningful structured success or failure outcomes;
- respect application-wide safety, configuration, scope, and non-destructive-operation principles.

Commands define application intent and invocation semantics. Detailed command contracts, internal coordination, algorithms, and component interactions belong in lower-level specifications.

### 5.4 Command Discovery

AppManager should provide a central mechanism through which available commands and their functional domains can be discovered and dispatched.

Command discovery should be available through the Application Invocation Contract so interaction modes and integrations do not need to encode domain behaviour independently.

The detailed registry contract, command metadata, discovery implementation, and machine-readable discovery schema belong to lower-level specifications.

### 5.5 Shared Execution Semantics

A command's application meaning should remain consistent across every interaction mode or integration through which that command is exposed.

TUI, Headless, GUI, IDE, and other adapters may differ in how they gather inputs, derive host context, request confirmation, present progress, or display results, but they should not redefine the underlying use case.

Inputs supplied interactively, explicitly, through automation, or by a host tool should ultimately be expressed through the same invocation and command semantics.

### 5.6 Relationship to Application Architecture

Commands may require capabilities owned by multiple architectural subsystems, but the command model does not define those subsystem relationships or their internal coordination.

Section 6 defines the cooperating architectural responsibilities through which application capabilities are realised. Section 11 describes principal system workflows where coordination across those responsibilities is significant at the system-design level.

This separation keeps invocation and command intent independent from architectural implementation while allowing the same command semantics to be reused across interaction modes and integrations.

---

## 6. Application Architecture

### 6.1 Architectural Model

AppManager is a domain-oriented command application composed of multiple cooperating architectural subsystems.

These subsystems have distinct responsibilities and interact through defined application capabilities. They form a conceptual responsibility model rather than a rigid architectural stack or mandatory source-directory structure.

The major conceptual areas are:

```text
                       interaction adapters
              tui   headless   gui   ide / tools
                              |
                              v
                 application invocation contract
                              |
                              v
                      command / use cases
                              |
           +------------------+------------------+
           |                  |                  |
           v                  v                  v
    application services   domain engines   code intelligence
           |                  |                  |
           +----------+-------+-------+----------+
                      |               |
                      v               v
                  resolvers       generation
                                  and templates
                      \               /
                       +-------------+
                              |
                              v
                       managed project
```

The diagram expresses architectural responsibility and collaboration. It does not prescribe a one-to-one source-directory structure or require every capability to pass through every conceptual area.

The Application Invocation Contract is an application-boundary responsibility rather than a domain engine or presentation implementation. It standardises how adapters reach the command model without dictating how application subsystems collaborate after invocation.

### 6.2 Services

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

### 6.3 Domain Engines

Domain engines encapsulate cohesive, specialised application capabilities that have their own rules, concepts, or internal coordination requirements.

A domain engine may coordinate services, resolvers, registries, configuration, templates, and other shared infrastructure while retaining responsibility for the behaviour of its domain.

Examples may include licensing, repository-management capabilities, generation, code intelligence, or other sufficiently cohesive concerns identified as AppManager evolves.

Domain engines should expose reusable application capabilities rather than presentation-specific workflows.

### 6.4 Resolvers

Resolvers determine context-dependent values or resources from available project state, configuration, registries, environment information, or user-supplied input.

Resolvers are particularly important where AppManager must separate the question of **what value is required** from **where that value comes from**.

Resolution should be deterministic in Headless operation and may be augmented by interactive prompting in presentation modes that permit it.

### 6.5 Generation and Templates

The generation subsystem is responsible for producing new project artefacts from controlled generators or templates and resolved project data.

Templates are intended primarily for creation and scaffolding rather than arbitrary mutation of existing source files.

Generation should avoid hard-coded user-specific or environment-specific assumptions where those values can be resolved through configuration.

Generation of new artefacts remains conceptually distinct from inspection and mutation of existing source, which belongs to the code-intelligence subsystem.

### 6.6 Registries

Registries provide discoverable mappings of configured or supported resources used across AppManager subsystems.

Potential registry concerns include:

- commands;
- repositories;
- AI providers;
- templates;
- strategies;
- other extensible resource families.

A registry should define identity and discovery. Specialised services, resolvers, domain engines, or other responsible subsystems should own operational behaviour.

---

## 7. Code-Intelligence and Transformation Architecture

### 7.1 Purpose

AppManager requires controlled inspection and modification of existing source files for capabilities such as documentation, metadata maintenance, header management, configuration manipulation, and future code-aware automation.

This responsibility is distinct from generating new files from templates.

### 7.2 Conceptual Pipeline

The code-intelligence subsystem is conceptually:

```text
existing source
      |
      v
   scanner
      |
      v
 file strategy
      |
      +-----------> inspection / metadata
      |
      +-----------> documentable regions
      |
      +-----------> controlled mutation
      |
      v
 orchestrator where composition is required
      |
      v
 validated source output
```

Not every supported file type must use every stage.

### 7.3 Scanners

Scanners provide lexical or structural recognition of supported source formats where AppManager requires controlled understanding of existing files.

Their purpose is to convert source text into information that higher-level code-intelligence components can reason about safely.

Scanners are not intended to be general-purpose compiler replacements.

### 7.4 Strategies

Strategies encapsulate file-type-specific inspection and mutation behaviour.

A strategy should understand the relevant structural conventions of the source type it manages and expose a consistent conceptual interface to higher-level code operations.

Strategies allow AppManager to add support for new file types without embedding format-specific behaviour throughout the command model.

### 7.5 Orchestrators

Orchestrators coordinate multiple lower-level code-intelligence capabilities where a file, artefact, or workflow spans more than one specialised representation.

They should compose existing capabilities rather than duplicate them.

### 7.6 Inspection and Mutation Separation

Where practical, AppManager should distinguish between:

- inspecting existing source;
- identifying a proposed change;
- applying the change;
- validating the resulting source.

This separation supports safer automation and future preview or dry-run capabilities.

### 7.7 Non-Destructive Transformation

Source transformation should preserve unrelated user content, formatting, comments, and configuration wherever practical.

AppManager should avoid full-file regeneration when a bounded structural edit can safely achieve the intended result.

### 7.8 Structured Formats

Structured configuration formats should be modified through structure-aware mechanisms where available rather than through unrestricted textual replacement.

### 7.9 Composite Source Files

Where a source file contains multiple embedded languages or structural regions, AppManager should favour extraction, delegation, and controlled recomposition over creating monolithic format-specific logic.

### 7.10 Future Language Support

The architecture should allow additional source formats and language variants to be introduced through appropriate scanners, strategies, orchestrators, or external parser integrations without redesigning the command system.

---

## 8. Configuration and State Architecture

### 8.1 Configuration Model

AppManager should support configuration at more than one scope so that reusable defaults can coexist with target-project-specific settings.

At a minimum, the conceptual model includes:

- tool-level configuration and defaults;
- project-level configuration and overrides;
- runtime or explicitly supplied values where applicable.

### 8.2 Resolution

Configuration should be resolved through defined precedence rather than through ad hoc access to unrelated files.

The exact precedence chain is a Functional and Detailed Design concern, but the design must support deterministic identification of the effective value.

Where useful, AppManager should also be able to identify the source from which a resolved value originated.

### 8.3 Separation of Resolution and Interaction

Configuration services and resolvers should remain usable without a user interface.

If a value cannot be resolved and an interactive mode permits prompting, the presentation or interaction adapter may request the missing value through an appropriate resolution workflow.

Headless operation must fail clearly or use an explicitly defined fallback rather than unexpectedly prompting.

### 8.4 AppManager-Owned Project Data

AppManager may maintain an application-owned directory within both the tool environment and managed project.

The current design uses the directory name:

```text
app_manager/
```

This directory may contain configuration, registries, templates, logs, reports, and other AppManager-owned resources appropriate to its scope.

The precise contents may evolve through lower-level design work while preserving the principle of a recognisable AppManager-owned management area.

### 8.5 Configuration Categories

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

Sensitive values should be separated from ordinary shared project configuration where appropriate.

### 8.6 State and Logs

Operational state, generated reports, and logs should be distinguishable from durable project configuration.

Generated or machine-local state should not become source-controlled project authority accidentally.

---

## 9. Managed Project and Directory Model

### 9.1 Managed Project

AppManager treats the target project as a structured application system rather than an arbitrary working directory.

A managed project may contain:

- a root Nuxt application;
- Nuxt layers;
- source code;
- tests;
- documentation;
- package configuration;
- Nuxt configuration;
- Git repositories or repository relationships;
- AppManager-owned configuration and state;
- generated artefacts.

### 9.2 Root Application and Layers

The root application and its layers should be manageable individually and collectively where the relevant operation supports both scopes.

This is particularly important for:

- repository synchronisation;
- dependency management;
- documentation;
- testing;
- quality operations;
- project generation;
- versioning;
- configuration.

### 9.3 Repository Relationships

A managed project may span multiple Git repositories.

AppManager should therefore model repository relationships explicitly enough to support root-project and layer-level operations without assuming that every project is a single repository.

### 9.4 Project Discovery

AppManager should be capable of discovering or resolving the relevant target project context from invocation location, supplied arguments, configuration, or managed-project metadata.

The detailed discovery rules belong in lower-level specifications.

### 9.5 Non-Destructive Ownership

AppManager-owned management data should coexist with the target project without unnecessarily restructuring or taking ownership of unrelated project files.

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

Templates generate new artefacts. Source-aware strategies and related code-intelligence components inspect or modify existing artefacts.

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

New file types should be supportable through appropriate scanner, strategy, orchestrator, or parser integration.

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

They define command contracts, invocation schemas and protocols, services, strategies, scanners, orchestrators, resolvers, interfaces, algorithms, data structures, and subsystem interactions.

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
| service | A reusable operational capability used by commands or other subsystems. |
| domain engine | A cohesive specialised subsystem that owns domain-specific rules, concepts, or coordination. |
| scanner | A component that recognises lexical or structural information in supported source text. |
| strategy | A component encapsulating file-type-specific inspection and mutation behaviour. |
| orchestrator | A component that composes multiple specialised capabilities for a composite operation or artefact. |
| resolver | A component responsible for determining a context-dependent value or resource. |
| generation subsystem | The subsystem responsible for generating new artefacts from generators or templates and resolved data. |
| registry | A discoverable mapping of configured or supported resources. |
| code intelligence | AppManager capabilities for structured inspection, understanding, documentation, and controlled transformation of existing source. |

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
9. Managed Project and Directory Model
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