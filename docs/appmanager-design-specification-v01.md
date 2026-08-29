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

Rather than requiring users or automation systems to coordinate package-manager commands, Git operations, repository relationships, configuration files, documentation tooling, quality checks, code transformation, templates, and AI-assisted workflows independently, AppManager provides a unified application model through which those capabilities can be orchestrated consistently.

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
- extensibility through commands, services, strategies, resolvers, templates, domain engines, and related architectural components.

### 1.3 System Boundary

AppManager operates as a management application around a target project.

It does not replace Nuxt, Git, the package manager, the test framework, the operating system, source repositories, AI providers, or other underlying development tools. Instead, it coordinates and augments those systems through defined application capabilities.

AppManager should preserve a clear distinction between:

- the AppManager application itself;
- AppManager-owned configuration, state, templates, and logs;
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
- duplicate business logic independently across TUI, Headless, and GUI modes;
- make uncontrolled destructive changes to managed projects;
- make AI-generated output authoritative without validation and project control;
- force all architectural components into a single artificial layered model.

---

## 2. System Vision and Objectives

### 2.1 Vision

AppManager should provide a dependable, extensible, and progressively automatable control surface for sophisticated Nuxt monorepo development.

The application should allow a project to be managed as a coherent system rather than as a loose collection of scripts and unrelated development tools.

### 2.2 Primary Objectives

AppManager should:

1. provide one coherent command and use-case model for project-management operations;
2. support interactive, automated, and graphical presentation modes over shared application capabilities;
3. understand the structure and relationships of a managed Nuxt monorepo;
4. coordinate operations across the root application and managed layers;
5. provide safe and predictable Git and repository workflows;
6. centralise project-management configuration while supporting project-specific overrides;
7. inspect and modify supported source files through structured code-intelligence mechanisms rather than fragile global text replacement;
8. generate new project artefacts from reusable templates;
9. support repeatable documentation and quality workflows;
10. provide controlled integration with AI services where those services add value;
11. support licensing and other domain-specific project-management capabilities through dedicated subsystems;
12. remain extensible as new commands, file types, providers, project structures, and interaction modes are introduced;
13. preserve project ownership, transparency, and reversibility wherever practical.

### 2.3 Design Priorities

When design choices conflict, AppManager should generally favour:

- correctness over convenience;
- explicit behaviour over hidden behaviour;
- non-destructive operations over destructive shortcuts;
- shared capabilities over duplicated implementations;
- structured transformation over unbounded textual mutation;
- configuration resolution over hard-coded assumptions;
- reusable abstractions over command-specific duplication;
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

An **interaction mode** is a presentation or invocation adapter through which a user or external automation invokes shared AppManager capabilities.

### 3.8 Architectural Subsystem

An **architectural subsystem** is a coherent family of responsibilities within AppManager, such as services, code intelligence, configuration resolution, templates, licensing, or repository management.

The term does not imply that all subsystems occupy equivalent architectural layers.

---

## 4. Operating Context and Interaction Modes

### 4.1 Operating Model

AppManager should support the same underlying application capabilities through multiple interaction modes.

The interaction architecture is conceptually:

```text
                 AppManager

       presentation and interaction

       tui      headless      gui
        |          |           |
        +----------+-----------+
                   |
                   v
          command and use-case layer
                   |
                   v
          application subsystems
                   |
                   v
        target project and providers
```

Presentation modes must not become independent implementations of AppManager business logic.

### 4.2 TUI

The Text User Interface provides guided interactive terminal operation.

It should support:

- command discovery;
- interactive selection;
- prompts where required information is not already resolvable;
- status and progress feedback;
- confirmation of consequential operations;
- human-readable results and errors.

### 4.3 Headless Mode

Headless mode provides deterministic non-interactive invocation suitable for:

- scripts;
- automation;
- CI/CD;
- scheduled operations;
- repeatable development workflows;
- integration with other tools.

A capability intended for Headless operation must not depend upon interactive prompts to complete normal execution. Required information must instead be supplied explicitly or resolved from configuration and context.

### 4.4 GUI

A Graphical User Interface is proposed as a first-class interaction mode.

The GUI should expose the same command and application capabilities rather than creating a separate application architecture.

The GUI may provide richer visualisation, navigation, configuration management, status reporting, project inspection, and workflow composition while delegating domain operations to shared application components.

### 4.5 Presentation Independence

A core invariant is:

> Commands and application capabilities must not inherently depend upon a particular presentation mode.

Presentation-specific concerns should remain at the application boundary wherever practical.

---

## 5. Command and Application Model

### 5.1 Domain-Oriented Command Model

AppManager is organised around functional domains containing commands that represent application use cases.

Conceptually:

```text
interaction adapter
       |
       v
command selection and dispatch
       |
       v
application command / use case
       |
       +-------------------+
       |                   |
       v                   v
application services   domain subsystems
       |                   |
       +---------+---------+
                 |
                 v
             target project
```

### 5.2 Command Responsibilities

A command should:

- represent a coherent user or automation intent;
- validate or resolve the context required for the operation;
- coordinate appropriate application capabilities;
- avoid embedding presentation-specific behaviour in domain logic;
- provide meaningful success or failure outcomes;
- respect safety, configuration, and non-destructive-operation principles.

### 5.3 Command Discovery

AppManager should provide a central mechanism through which available commands and their domains can be discovered and dispatched.

The detailed registry contract and implementation belong to lower-level specifications.

### 5.4 Shared Execution Semantics

Where a command is available through multiple interaction modes, its domain behaviour should remain consistent.

TUI, Headless, and GUI modes may differ in how they gather inputs or display results, but they should not redefine the underlying operation.

### 5.5 Command Composition

Commands may coordinate multiple subsystems when a use case spans several concerns.

For example, a project synchronisation operation may require repository discovery, configuration resolution, Git operations, logging, validation, and result reporting.

The command layer should orchestrate these capabilities without absorbing their specialised responsibilities.

---

## 6. Application Architecture

### 6.1 Architectural Model

AppManager should be described as a domain-oriented command application with multiple cooperating architectural subsystems.

It should not be described as a fixed five-layer architecture.

The major conceptual areas are:

```text
                    interaction adapters
                  tui   headless   gui
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

This is a conceptual responsibility model rather than a mandatory source-directory map.

### 6.2 Services

Services provide reusable operational capabilities required by commands and other subsystems.

Service responsibilities may include:

- filesystem operations;
- structured configuration access;
- Git operations;
- process execution;
- logging;
- AI-provider access;
- code coordination;
- licensing support;
- other cross-cutting application capabilities.

Services should expose coherent capabilities and avoid unnecessary presentation dependencies.

### 6.3 Scanners

Scanners provide lexical or structural recognition of supported source formats where AppManager requires controlled understanding of existing files.

Their purpose is to convert source text into information that higher-level code-intelligence components can reason about safely.

Scanners are not intended to be general-purpose compiler replacements.

### 6.4 Strategies

Strategies encapsulate file-type-specific inspection and mutation behaviour.

A strategy should understand the relevant structural conventions of the source type it manages and expose a consistent conceptual interface to higher-level code operations.

Strategies allow AppManager to add support for new file types without embedding format-specific behaviour throughout the command layer.

### 6.5 Orchestrators

Orchestrators coordinate multiple lower-level code-intelligence capabilities where a file, artefact, or workflow spans more than one specialised representation.

They should compose existing capabilities rather than duplicate them.

### 6.6 Resolvers

Resolvers determine context-dependent values or resources from available project state, configuration, registries, environment information, or user-supplied input.

Resolvers are particularly important where AppManager must separate the question of **what value is required** from **where that value comes from**.

Resolution should be deterministic in Headless operation and may be augmented by interactive prompting in presentation modes that permit it.

### 6.7 Template Engine

The Template Engine is responsible for producing new project artefacts from controlled templates and resolved project data.

Templates are intended primarily for creation and scaffolding rather than arbitrary mutation of existing source files.

Template generation should avoid hard-coded user-specific or environment-specific assumptions where those values can be resolved through configuration.

### 6.8 License Engine

The License Engine is a dedicated domain subsystem responsible for licensing-related project capabilities.

Its design may include:

- license metadata;
- license templates;
- license selection and resolution;
- project license generation;
- validation or compatibility capabilities where subsequently specified.

Detailed licensing behaviour belongs in lower-level specifications.

### 6.9 Registries

Registries provide discoverable mappings of configured or supported resources.

Potential registry concerns include:

- commands;
- repositories;
- AI providers;
- templates;
- strategies;
- other extensible resource families.

A registry should define identity and discovery, while specialised services or resolvers should own operational behaviour.

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

### 7.3 Inspection and Mutation Separation

Where practical, AppManager should distinguish between:

- inspecting existing source;
- identifying a proposed change;
- applying the change;
- validating the resulting source.

This separation supports safer automation and future preview or dry-run capabilities.

### 7.4 Non-Destructive Transformation

Source transformation should preserve unrelated user content, formatting, comments, and configuration wherever practical.

AppManager should avoid full-file regeneration when a bounded structural edit can safely achieve the intended result.

### 7.5 Structured Formats

Structured configuration formats should be modified through structure-aware mechanisms where available rather than through unrestricted textual replacement.

### 7.6 Composite Source Files

Where a source file contains multiple embedded languages or structural regions, AppManager should favour extraction, delegation, and controlled recomposition over creating monolithic format-specific logic.

### 7.7 Future Language Support

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

If a value cannot be resolved and an interactive mode permits prompting, the presentation or interaction layer may request the missing value through an appropriate resolution workflow.

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
user / automation
       |
       v
interaction adapter
       |
       v
command discovery and dispatch
       |
       v
context and configuration resolution
       |
       v
command orchestration
       |
       v
services / subsystems / domain engines
       |
       v
managed project or external provider
       |
       v
result and diagnostics
```

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

Application capabilities must not inherently depend on TUI, Headless, or GUI presentation.

### 12.2 Domain Responsibility

Capabilities should reside in the domain or subsystem that owns their responsibility rather than being duplicated across unrelated commands.

### 12.3 Non-Destructive Operation

AppManager should preserve user-authored content and project structure wherever practical.

Destructive operations must be explicit, scoped, and appropriately safeguarded.

### 12.4 Structured Modification

Existing structured files should be modified through structure-aware mechanisms wherever practical.

### 12.5 Generation and Mutation Separation

Templates generate new artefacts. Source-aware strategies and related code-intelligence components inspect or modify existing artefacts.

These responsibilities should not be conflated.

### 12.6 Configuration over Hard-Coding

User, project, repository, provider, and environment-specific values should be resolved from configuration or context rather than embedded into reusable application logic or templates.

### 12.7 Deterministic Headless Operation

Headless workflows must not unexpectedly require interactive input.

### 12.8 Observable Operations

Significant operations should produce sufficient logging, diagnostics, or structured results to explain what occurred and why a failure occurred.

### 12.9 Shared Infrastructure

Cross-cutting capabilities such as filesystem access, process execution, Git operations, logging, and configuration should be reusable rather than independently reimplemented by commands.

### 12.10 Explicit Scope

Operations spanning root projects, layers, repositories, files, or environments should have a clearly defined scope.

### 12.11 Extensible Discovery

Where the system supports multiple commands, strategies, providers, repositories, templates, or similar resources, discovery should be designed to accommodate extension without widespread conditional logic.

### 12.12 AI as an Optional Capability

AI services may enhance AppManager workflows but must not become an implicit requirement for unrelated core operations.

### 12.13 Design Authority

Implementation must follow approved design and functional requirements. Current source behaviour does not automatically redefine the intended system.

### 12.14 No Artificial Layer Model

Services, scanners, strategies, orchestrators, resolvers, templates, registries, and domain engines are not to be described as equivalent layers merely for diagrammatic convenience.

### 12.15 Nuxt Layer Terminology

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

### 13.7 Interaction Extensibility

The command and application model should permit additional interaction adapters beyond TUI, Headless, and GUI if future requirements justify them.

### 13.8 Domain Engine Extensibility

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

They define command contracts, services, strategies, scanners, orchestrators, resolvers, interfaces, algorithms, data structures, and subsystem interactions.

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
| interaction mode | An adapter through which a user or automation invokes AppManager capabilities. |
| TUI | Text User Interface. |
| Headless | Non-interactive AppManager operation for automation and scripted use. |
| GUI | Proposed Graphical User Interface over shared AppManager capabilities. |
| service | A reusable operational capability used by commands or other subsystems. |
| scanner | A component that recognises lexical or structural information in supported source text. |
| strategy | A component encapsulating file-type-specific inspection and mutation behaviour. |
| orchestrator | A component that composes multiple specialised capabilities for a composite operation or artefact. |
| resolver | A component responsible for determining a context-dependent value or resource. |
| template engine | The subsystem responsible for generating new artefacts from templates and resolved data. |
| license engine | The specialised subsystem responsible for licensing-related capabilities. |
| registry | A discoverable mapping of configured or supported resources. |
| code intelligence | AppManager capabilities for structured inspection, understanding, documentation, and controlled transformation of existing source. |

### 15.2 Conceptual System Summary

```text
                              AppManager
                                  |
                  +---------------+---------------+
                  |               |               |
                 tui           headless           gui
                  |               |               |
                  +---------------+---------------+
                                  |
                                  v
                         command / use cases
                                  |
             +--------------------+--------------------+
             |                    |                    |
             v                    v                    v
       application services   domain engines     code intelligence
             |                    |                    |
             |                license engine     scanners
             |                                     |
             |                                  strategies
             |                                     |
             |                                orchestrators
             |                                        |
             +-------------+------+---------------------+
                           |      |
                           v      v
                       resolvers  template engine
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
5. Command and Application Model
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
