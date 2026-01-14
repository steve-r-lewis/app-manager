# AppManager – Execution Model & Mode-Oriented Orchestration Specification

---

## 1. Architectural Position of Execution Modes

AppManager is a **command-driven application framework** that supports **multiple execution modes** over a single, shared operational core.

Execution modes are:

* **Pure orchestration layers**
* **UI / invocation specific**
* **Stateless with respect to business logic**

They do **not**:

* Contain domain logic
* Directly manipulate files
* Invoke scanners or strategies
* Encode project knowledge

Instead, they coordinate **command selection, parameter acquisition, and execution timing**.

---

## 2. Entry Point Contract (`app/index.ts`)

The root entry point is intentionally minimal and declarative.

### Responsibilities

The entry point performs **exactly four duties**:

1. **Initialize global infrastructure services**
2. **Register all available commands**
3. **Determine execution mode**
4. **Delegate control**

It explicitly does **not**:

* Execute commands itself
* Interpret arguments
* Handle UI logic
* Perform error recovery beyond fatal termination

---

### Lifecycle Summary

```text
Bootstrap
  ↓
Service Initialization
  ↓
Command Registration
  ↓
Mode Selection
  ↓
Delegation
```

---

### Key Architectural Rule

> **The entry point must remain mode-agnostic and command-agnostic.**

This ensures:

* Predictable startup behavior
* Clean testing boundaries
* Extensibility (future modes)

---

## 3. Command Registration & Registry Role

Commands are registered **once**, at startup, into a central registry.

```ts
registry.register(new CommitCommand());
registry.register(new PushCommand());
registry.register(new SyncCommand());
```

### Registry Responsibilities

The registry acts as:

* A **command index**
* A **metadata provider**
* A **lookup service**

It is the **single source of truth** for:

* Domains
* Available actions
* Command metadata
* Command instances

Both execution modes rely exclusively on the registry.

---

## 4. Execution Modes Overview

AppManager provides **two mutually exclusive execution modes**:

| Mode                       | Intent                                   | Primary Use             |
| -------------------------- | ---------------------------------------- | ----------------------- |
| **Headless Mode**          | Deterministic, non-interactive execution | CI, scripts, automation |
| **Interactive (TUI) Mode** | Guided, exploratory execution            | Human operators         |

Both modes:

* Execute the same commands
* Use the same services
* Produce the same side effects

They differ only in **how intent is expressed and resolved**.

---

## 5. Headless Mode Specification

### 5.1 Purpose

Headless mode exists to support:

* CLI invocation
* Automation pipelines
* Scriptable workflows
* Deterministic execution

---

### Operational Characteristics

* Argument-driven
* Single-command execution
* No prompting
* Immediate termination on error
* Machine-readable logging

---

### Responsibilities (`runHeadless`)

Headless mode performs the following steps:

1. **Parse CLI arguments**

   * Domain
   * Action
   * Flags (`--verbose`, `--debug`, etc.)
   * Positional arguments

2. **Configure runtime flags**

   * Updates `configService`
   * Enables logging modes

3. **Resolve command**

   * Uses registry lookup
   * Fails fast if command is missing

4. **Validate availability**

   * Calls `command.isEnabled(...)`

5. **Execute command**

   * Passes resolved options and arguments
   * Handles fatal errors and exit codes

---

### Explicit Non-Responsibilities

Headless mode does **not**:

* Validate domain semantics
* Modify command behavior
* Perform retries
* Interpret command output

---

## 6. Interactive (TUI) Mode Specification

### Purpose

Interactive mode exists to:

* Guide users through complex systems
* Reduce configuration errors
* Surface discoverability
* Support exploratory workflows

It is a **presentation and coordination layer**, not a logic layer.

---

### Operational Characteristics

* Stateful per session
* Menu-driven
* User-confirmed actions
* Graceful exits
* Rich feedback

---

### Responsibilities (`runInteractive`)

Interactive mode is responsible for:

#### A. Session Configuration

* Collecting runtime preferences (verbose (screen), file logging (disk file))
* Mutating `configService` and logger behavior
* Preparing execution environment

#### B. External Service Health Checks

* Probing LLM availability
* Reporting degraded capabilities
* Never blocking core functionality

#### C. Command Discovery

* Querying registry domains
* Enumerating commands per domain
* Displaying metadata-driven menus

#### D. Command Execution

* Resolving selected command
* Calling `isEnabled(...)`
* Executing command with structured input
* Handling recoverable errors gracefully

---

### Explicit Non-Responsibilities

Interactive mode does **not**:

* Interpret project structure
* Execute scanners directly
* Encode business rules
* Alter command semantics

---

## 7. Command Layer as the Execution Core

Commands are the **primary execution units** in AppManager.

They:

* Represent user intent
* Coordinate service calls
* Define operational boundaries

### Critical Invariant

> **Commands must be completely unaware of the execution mode.**

This ensures:

* Identical behavior across modes
* No duplication of logic
* Predictable automation outcomes

---

## 8. Relationship to Core Services

### FileService

* Performs all disk IO
* Used by commands and strategies
* Never accessed by modes directly

### Scanner Services

* Operate on in-memory source text
* Invoked by strategies
* Provide token streams
* Entirely mode-agnostic

### Strategy Services

* Consume tokens
* Perform edits, refactors, analysis
* Deterministic and testable

### TemplateService

* Used to provision new files
* Independent of scanners
* Command-driven, not mode-driven

### LLMService

* Optional enhancement layer
* Used for:

  * Code review
  * Metadata generation
  * Documentation enrichment
* Availability detected by modes
* Invocation controlled by commands

---

## 9. Error Handling Model

| Layer       | Responsibility                        |
| ----------- | ------------------------------------- |
| Services    | Throw precise, domain errors          |
| Commands    | Contextualize failures                |
| Modes       | Decide presentation and exit strategy |
| Entry Point | Ensure clean termination              |

This separation allows:

* Fail-fast automation
* Graceful TUI recovery
* Consistent logging semantics

---

## 10. Architectural Outcome

With the explicit inclusion of execution modes, AppManager is now clearly defined as:

> **A mode-flexible, command-driven orchestration framework built on deterministic scanner and strategy services, supporting both automated and interactive workflows without duplicating logic.**

This is a **strong, professional-grade design** that scales well as:

* New commands are added
* New languages are supported
* New execution modes emerge (e.g., daemon, API, remote agent)
