# Technical Specification Document

**Component:** `BaseCommand`
**File:** `~/app/commands/baseCommand.ts`
**Project:** `app-manager`
**Language:** TypeScript (Node.js runtime)

---

## Part 1: Operational & Design Specification

---

## 1. Component Overview

### 1.1 Purpose

`BaseCommand` defines the **abstract contract** for all CLI commands in the system. It ensures consistent metadata management and enforces implementation of an `execute()` method while providing optional helper hooks for conditional availability.

It is intended to be **subclassed** by concrete command implementations (e.g., `GitCommitCommand`, `NuxtBuildCommand`) that encapsulate domain-specific logic.

### 1.2 Role in System

**Architectural Role:**
Command Abstraction Layer / Base Class

**System Context:**

* All CLI and TUI commands in the system extend `BaseCommand`.
* Provides the standard interface consumed by the `CommandRegistry` for registration, discovery, and execution.
* Guarantees consistent metadata access (`CommandMetadata`) across all commands.
* Allows optional contextual availability checks via `isEnabled()`.

---

## 2. Architecture & Patterns

### 2.1 Design Patterns

| Pattern                | Usage                                                                                          |
| ---------------------- | ---------------------------------------------------------------------------------------------- |
| **Template Method**    | Defines the `execute()` method as abstract, forcing subclasses to implement the core behavior. |
| **Strategy / Hook**    | Optional `isEnabled()` hook allows subclasses to override contextual validation logic.         |
| **Immutable Metadata** | `metadata` is readonly, preventing mutation after instantiation.                               |

### 2.2 State Management

**Statefulness:** Stateless (except metadata)

* `BaseCommand` instances are **immutable** except for potentially inherited state in subclasses.
* `metadata` is readonly; no other internal state is maintained.

### 2.3 Complexity Assessment

**Rating:** Low

* No branching or control flow in the base class.
* All complexity is deferred to subclasses.
* `isEnabled()` is asynchronous but simple by default.

---

## 3. Dependency Graph

### 3.1 Internal Dependencies

| Dependency       | Type             | Purpose                                                                  |
| ---------------- | ---------------- | ------------------------------------------------------------------------ |
| `../types/index` | Type Definitions | Provides `CommandMetadata` and `CommandOptions` types for strong typing. |

### 3.2 External Dependencies

* None (no Node.js built-ins or third-party libraries).

### 3.3 Coupling Analysis

**Coupling Level:** Low

* Loosely coupled to the rest of the system.
* Depends only on type definitions.
* Concrete commands implement `execute()` and may introduce tighter coupling individually.

---

## 4. Data Types & Interfaces

### 4.1 Key Interfaces and Types

#### `CommandMetadata` (Imported)

Expected shape:

```ts
interface CommandMetadata {
  id: string;
  domain: string;
  name: string;
  hidden?: boolean;
}
```

#### `CommandOptions` (Imported)

* Arbitrary key-value object representing parsed CLI flags.
* Example: `{ force: true, verbose: false }`

---

### 4.2 Public API & Return Types

| Method        | Signature                                                                                         | Return Type        | Notes                                                            |
| ------------- | ------------------------------------------------------------------------------------------------- | ------------------ | ---------------------------------------------------------------- |
| `constructor` | `constructor(metadata: CommandMetadata)`                                                          | `BaseCommand`      | Immutable metadata stored in `readonly metadata`.                |
| `execute`     | `abstract execute(targetRoot: string, options: CommandOptions, ...args: string[]): Promise<void>` | `Promise<void>`    | Must be implemented by subclasses.                               |
| `isEnabled`   | `async isEnabled(targetRoot: string): Promise<boolean>`                                           | `Promise<boolean>` | Default implementation always returns `true`; optional override. |

**Type Safety Observations:**

* All methods are strongly typed.
* Abstract method ensures compile-time enforcement of implementation.
* No `any` types.

---

## 5. Functional Logic Specification

---

### 5.1 `constructor`

**Signature:**
`constructor(metadata: CommandMetadata)`

**Logic Flow:**

1. Accepts a `CommandMetadata` object.
2. Stores it in the `readonly metadata` property.

**Side Effects:**
None beyond property assignment.

**Error Handling:**
No validation; runtime errors possible if invalid metadata is passed.

---

### 5.2 `execute`

**Signature:**
`abstract execute(targetRoot: string, options: CommandOptions, ...args: string[]): Promise<void>`

**Logic Flow:**

* No implementation in the base class.
* Subclasses must implement command-specific behavior.
* Designed for asynchronous execution.

**Side Effects:**

* Defined by subclass (e.g., file system changes, API calls, logging).

**Error Handling:**

* Left to subclass implementation.

---

### 5.3 `isEnabled`

**Signature:**
`async isEnabled(targetRoot: string): Promise<boolean>`

**Logic Flow:**

1. By default, always returns `true`.
2. Intended to be overridden by subclasses to determine runtime availability based on:

    * Presence of required files (e.g., `.git` folder)
    * Environment constraints
    * Project type or configuration

**Side Effects:** None by default.

**Error Handling:**

* No explicit error handling.
* Subclass overrides may include validation and exceptions.

---

## Part 2: Appendix – Testing Reference

---

## 1. Mocking Strategy

### 1.1 Services / Dependencies to Mock

* None at the base class level.
* Concrete subclasses may depend on services such as:

    * File system access
    * Network requests
    * Logger services

### 1.2 Mock Behaviour

* For unit tests, create stub implementations of `BaseCommand`:

    * Provide predictable `metadata`.
    * Override `execute` with a no-op or test-specific behavior.
    * Optionally override `isEnabled` to simulate enabled/disabled states.

---

## 2. Test Scenarios

### 2.1 Happy Path

| Scenario                           | Expected Outcome                                                    |
| ---------------------------------- | ------------------------------------------------------------------- |
| Instantiate a concrete command     | `metadata` is correctly assigned                                    |
| Call `isEnabled()` on base class   | Returns `true`                                                      |
| Call `execute()` on abstract class | Compile-time error if called directly (cannot instantiate abstract) |

---

### 2.2 Edge Cases

| Scenario                                         | Expected Outcome                            |
| ------------------------------------------------ | ------------------------------------------- |
| Metadata with optional `hidden` property missing | No runtime errors                           |
| Metadata with empty strings                      | Metadata stored as provided; no enforcement |

---

### 2.3 Error States

| Category                              | Scenario                                               | Expected Behavior                    |
| ------------------------------------- | ------------------------------------------------------ | ------------------------------------ |
| Invalid Metadata                      | Pass `null` or incomplete metadata                     | Runtime exception on property access |
| Override `execute` with invalid logic | Dependent on subclass implementation; may throw errors |                                      |

---

## 3. Test Data Requirements

### 3.1 Sample Metadata

```ts
const sampleMetadata = {
  id: 'git.commit',
  domain: 'git',
  name: 'commit',
  hidden: false
};
```

### 3.2 Sample Command Subclass

```ts
class TestCommand extends BaseCommand {
  async execute(targetRoot: string, options: CommandOptions, ...args: string[]) {
    // no-op for testing
    return;
  }

  async isEnabled(targetRoot: string) {
    return true;
  }
}
```

---

## Final Architectural Notes

* `BaseCommand` is **the foundation for all CLI command implementations**.
* Strongly typed metadata and enforced `execute()` contracts promote consistency.
* Future enhancements could include:

    * Validation of `metadata` during construction.
    * Optional pre/post execution hooks for cross-cutting concerns (logging, telemetry, error handling).

---

