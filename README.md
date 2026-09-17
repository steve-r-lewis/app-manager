# AppManager

AppManager is a management application for complex Nuxt monorepo projects and their constituent Nuxt layers.

It provides a coherent application model for coordinating lifecycle operations, project and repository management, configuration, documentation, quality workflows, source-aware transformation, generation, licensing, AI-assisted workflows, and future host-tool integrations without requiring each interface or integration to reimplement the same application behaviour.

> **Project status:** the **Version 1 root Design Specification is complete** and is the authoritative high-level description of the target AppManager architecture. The current TypeScript implementation predates parts of that architecture and is being progressively reconciled with the specification. Existing source structure or behaviour should therefore not be treated as authoritative where it conflicts with the approved design.

---

## What AppManager Is

AppManager is intended to act as a management plane above the individual tools normally used to maintain a Nuxt monorepo.

Rather than making developers or automation coordinate package-manager commands, Git repositories, Nuxt layers, configuration files, documentation tooling, quality checks, code transformation, templates, and AI services independently, AppManager provides one application-level command and workflow model through which those capabilities can be invoked consistently.

AppManager does **not** replace Nuxt, Git, the package manager, test tooling, the operating system, external providers, or repository hosts. It coordinates those systems while retaining AppManager-level authority over command semantics, workflow policy, managed scope, safety constraints, and final application outcomes.

---

## Architectural Model

The Version 1 architecture is centred on a single authoritative **Application Engine**.

```text
interaction modes / host integrations
                |
                v
       interaction adapters
                |
                v
 Application Invocation Contract
                |
                v
       Application Engine
                |
                v
       commands / use cases
                |
                v
 application capability coordination
                |
        +-------+-------+
        |               |
        v               v
 AppManager-owned   capability
 capabilities       boundaries
                        |
                        v
                 capability providers
                        |
                        v
             external/ecosystem mechanics
```

The important architectural rule is:

> **Delegated execution does not mean delegated application authority.**

A service, domain engine, parser, generator, external tool, AI provider, repository provider, or other specialist capability may perform bounded work, but the Application Engine retains authority over what an AppManager operation means, what it may affect, and whether its result is accepted as successful.

The diagram expresses responsibility and authority, not a required process, package, deployment, or runtime topology.

---

## Interaction Modes and Integrations

AppManager is designed so that multiple interaction modes can expose the same underlying application semantics.

### TUI

The Text User Interface provides guided interactive operation for developers. It may collect input, request confirmation, present progress, and display human-readable results, but it must not own a separate implementation of AppManager business logic.

### Headless

Headless operation provides deterministic non-interactive invocation suitable for scripts, CI/CD, scheduled workflows, and automation. It uses the same command and application semantics as interactive operation and must not depend on unexpected prompts.

### GUI

A graphical interface is a proposed first-class interaction mode over the same application architecture rather than a separate application implementation.

### IDE and Host Tools

AppManager is designed to support thin adapters for IDEs, editors, CI systems, automation agents, and other host tools. A WebStorm integration is the first proposed IDE adapter.

All interaction modes and integrations should ultimately invoke AppManager through the shared **Application Invocation Contract** and receive structured results without parsing presentation-oriented terminal output.

---

## Managed Projects

AppManager treats a Nuxt project as a structured managed system rather than merely a current working directory or one Git repository.

A managed project may contain:

- a root Nuxt application;
- one or more managed Nuxt layers;
- source code, tests, and documentation;
- project and package configuration;
- one or more Git repositories and repository relationships;
- AppManager-owned configuration, state, registries, templates, reports, and logs;
- generated artefacts and other resources relevant to supported workflows.

For each operation, AppManager resolves a **managed project context** and an explicit **managed scope**. Discovering or understanding a resource does not automatically grant AppManager permission to modify it.

This is a core safety principle of the architecture.

---

## Functional Domains

The AppManager command surface is organised into **functional domains**. Domains group related product-facing commands and use cases; they are not independent architectural subsystems or implementation stacks.

The current intended Version 1 domains are:

- **`app`** — application lifecycle, build, development, cleanup, initialisation, and creation workflows;
- **`docs`** — documentation generation and maintenance;
- **`git`** — source-control and multi-repository workflows;
- **`ai`** — workflows where AI capability is itself the primary subject;
- **`nuxt`** — Nuxt application, layer, and framework-specific management;
- **`quality`** — tests, coverage, linting, type checking, validation, and quality gates;
- **`utils`** — bounded maintenance tasks that do not justify a more specific product domain;
- **`settings`** — user-facing and automation-facing AppManager configuration management.

A command in one domain may reuse capabilities supplied by several architectural subsystems. Shared capabilities should not be duplicated simply because multiple domains depend on them.

---

## Code Intelligence and Safe Transformation

AppManager is intended to inspect and modify supported source through structure-aware mechanisms rather than unrestricted global text replacement.

The conceptual transformation flow is:

```text
recognition / inspection
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
 Application Engine policy / approval
        |
        v
 transformation mechanism
        |
        v
 source-level validation
        |
        v
 application-level acceptance
```

Source-level technical validity and AppManager-level acceptance are deliberately separate. A technically valid edit can still be rejected if it violates command intent, managed scope, application policy, or safety constraints.

Generation of new artefacts from templates is likewise kept conceptually separate from mutation of existing user-authored source.

---

## Extensibility

AppManager distinguishes between several different forms of extension rather than forcing all extensibility through one generic plugin mechanism.

### Declarative and Resource-Driven Extensions

Resources such as licence definitions and templates can be added to an owning engine or subsystem without changing unrelated AppManager source code where the required behaviour fits the supported declarative model.

For example:

```text
License Engine
    |
    +-- licence catalogue
    +-- validated licence definitions
```

and:

```text
Generation / Template Engine
    |
    +-- template catalogue
    +-- validated template specifications
```

These are extensions, but they are not arbitrary executable plugins.

### Capability Implementations

Specialised provider or ecosystem-native implementations may sit behind stable capability boundaries. They can change how bounded work is performed without redefining AppManager command semantics or application authority.

### Application-Surface Extensions

New commands, functional domains, interaction adapters, and architectural subsystems may extend the product surface while still participating in the same Application Engine, invocation, safety, scope, and outcome model.

A general executable plugin framework, runtime code loading model, sandbox, marketplace, or package format is **not** mandated by the Version 1 root design.

---

## AI

AI is a bounded, optional capability where practical.

AI services may assist documentation, commit preparation, analysis, and future development workflows, but model output does not become authoritative project state, source code, configuration, documentation, or repository history merely because a model produced it.

Consequential use of AI-generated output remains subject to AppManager policy, validation, managed scope, safety constraints, and application-level acceptance.

---

## Current Implementation Status

The repository currently contains an evolving **Node.js / TypeScript** implementation.

The present entry point still reflects the earlier implementation architecture: it initialises services, registers a limited set of commands, and dispatches between interactive and Headless execution. That code remains useful implementation material, but it is being reconciled with the Version 1 target architecture rather than defining that architecture itself.

The current package metadata declares:

- Node.js `>=20`;
- pnpm `11.5.2`;
- TypeScript;
- Vitest;
- `app/index.ts` as the application entry point;
- `app-manager` as the currently declared package binary name.

The executable interface and command surface may change as the implementation is brought into line with the Functional, Detailed Design, and Implementation Specifications.

---

## Development Setup

### Requirements

- Node.js 20 or later;
- pnpm 11.x.

Install dependencies:

```bash
pnpm install
```

### Run the current development entry point

The current repository is development-oriented. The TypeScript entry point can be run directly with `tsx`:

```bash
npx tsx app/index.ts
```

With no command arguments, the current implementation launches its interactive mode.

The current Headless dispatcher uses the general form:

```bash
npx tsx app/index.ts <domain> <action> [arguments] [--options]
```

Only commands actually registered by the current implementation are available. The Version 1 domain and capability descriptions in this README describe the approved target product architecture and should not be interpreted as evidence that every command has already been implemented.

### Build and validation

```bash
pnpm build
pnpm typecheck
pnpm vitest:run
```

Additional test scripts are defined in `package.json` for unit tests, end-to-end tests, coverage, watch mode, and the Vitest UI.

---

## Documentation

The root README is an orientation document. It is **not** the authoritative architectural or behavioural specification.

The project documentation hierarchy is governed by [`docs/project-documentation-guide-v01.md`](docs/project-documentation-guide-v01.md).

The principal specification chain is:

```text
Project Documentation Guide
            |
            v
Root Design Specification
            |
            v
Functional Specifications
            |
            v
Detailed Design Specifications
            |
            v
Implementation Specifications
            |
            v
Implementation
```

The authoritative Version 1 architectural baseline is:

- [`docs/appmanager-design-specification-v01.md`](docs/appmanager-design-specification-v01.md) — what AppManager is intended to be;
- [`docs/project-documentation-guide-v01.md`](docs/project-documentation-guide-v01.md) — documentation authority, hierarchy, governance, and placement rules.

Significant architectural decisions may additionally be supported by Architecture Reviews and recorded through ADRs. Those decision records preserve rationale; the resulting requirements remain authoritative through the appropriate specification level.

---

## Project Governance and Contributions

AppManager is being developed specification-first from the approved Version 1 root design.

Changes should respect the repository documentation hierarchy and should not silently treat current implementation behaviour as authority over approved design.

Repository changes are developed through dedicated branches and pull requests rather than direct edits to `master` unless explicitly authorised.

As the Functional Specifications are developed, they will define the authoritative observable behaviour of domains, commands, workflows, validation, structured outcomes, and failure semantics. Detailed Design and Implementation Specifications will then refine those requirements into technical contracts and concrete source-level implementation.

---

## Licence

This repository is licensed under the **MIT License**.
