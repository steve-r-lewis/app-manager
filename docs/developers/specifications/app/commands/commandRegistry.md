# Technical Specification Document

**Component:** `CommandRegistry`
**File:** `~/app/commands/registry.ts`
**Project:** `app-manager`
**Language:** TypeScript (Node.js runtime)

---

## Part 1: Operational & Design Specification

---

## 1. Component Overview

### 1.1 Purpose

The `CommandRegistry` component provides a centralized in-memory registry for managing, discovering, and enumerating CLI command implementations (`BaseCommand` instances). It acts as the authoritative catalog of all commands available to the application at runtime.

The registry enables:

* Registration of command implementations.
* Lookup of commands by logical identifiers (domain + name).
* Enumeration of commands by domain.
* Discovery of all unique command domains.
* Retrieval of all registered commands.

### 1.2 Role in System

**Architectural Role:**
Application Infrastructure / Command Dispatch Layer

**System Context:**

* Serves both **Headless CLI Mode** (non-interactive execution) and **TUI Mode** (interactive terminal UI).
* Decouples command discovery and execution logic from command definitions themselves.
* Functions as a shared service consumed by:

    * CLI argument parsers
    * Command routers
    * TUI menu builders

The registry is instantiated once and exported as a shared module-level singleton.

---

## 2. Architecture & Patterns

### 2.1 Design Patterns

| Pattern                            | Usage                                                                         |
| ---------------------------------- | ----------------------------------------------------------------------------- |
| **Registry Pattern**               | Centralized storage and retrieval of command objects keyed by metadata.       |
| **Singleton (Module-Level)**       | A single instance (`registry`) is exported and shared across the application. |
| **Dependency Inversion (Partial)** | Depends on an abstract `BaseCommand` contract rather than concrete commands.  |

**Notably Absent Patterns:**

* No formal Dependency Injection container.
* No Factory abstraction for command instantiation.
* No Observer/Event-driven behavior.

### 2.2 State Management

**Statefulness:**
Stateful

**Internal State:**

```ts
private commands = new Map<string, BaseCommand>();
```

* The registry maintains mutable state over the application lifecycle.
* Commands are accumulated via `register()` and persist until process termination.
* No lifecycle reset or eviction logic is provided.

### 2.3 Complexity Assessment

**Rating:** Low

**Justification:**

* Linear control flow.
* No branching beyond basic conditionals.
* No asynchronous behavior.
* Computational complexity limited to `O(n)` searches over command collections.

---

## 3. Dependency Graph

### 3.1 Internal Dependencies

| Dependency                  | Type                       | Purpose                                          |
| --------------------------- | -------------------------- | ------------------------------------------------ |
| `./baseCommand`             | Abstract Class / Base Type | Defines the contract and metadata for commands.  |
| `../services/loggerService` | Service                    | Emits warnings when command IDs are overwritten. |

### 3.2 External Dependencies

| Library      | Usage                                |
| ------------ | ------------------------------------ |
| `Map` (ES6)  | In-memory storage for commands.      |
| `Array.from` | Conversion from iterables to arrays. |
| `Set`        | Deduplication of domain values.      |

No third-party NPM libraries are used in this component.

### 3.3 Coupling Analysis

**Coupling Level:** Medium

**Rationale:**

* Tightly coupled to the structure of `BaseCommand.metadata`.
* Assumes existence and shape of:

    * `metadata.id`
    * `metadata.domain`
    * `metadata.name`
    * `metadata.hidden`
* Loosely coupled to consumers (CLI/TUI) via method contracts.

---

## 4. Data Types & Interfaces

### 4.1 Key Interfaces and Types

#### `BaseCommand` (Imported)

Although not defined in this file, the registry implicitly depends on the following interface shape:

```ts
interface CommandMetadata {
  id: string;
  domain: string;
  name: string;
  hidden?: boolean;
}

abstract class BaseCommand {
  metadata: CommandMetadata;
}
```

**Risk Note:**
No compile-time enforcement is visible here ensuring `metadata` completeness or immutability.

---

### 4.2 Public API & Return Types

| Method        | Signature                                                     | Return Type    | Notes                            |
| ------------- | ------------------------------------------------------------- | -------------- | -------------------------------- |
| `register`    | `register(command: BaseCommand): void`                        | `void`         | Emits log warnings on overwrite. |
| `get`         | `get(domain: string, name: string): BaseCommand \| undefined` | Explicit union | Correctly typed.                 |
| `getByDomain` | `getByDomain(domain: string): BaseCommand[]`                  | Array          | Filters hidden commands.         |
| `getDomains`  | `getDomains(): string[]`                                      | Array          | Sorted alphabetically.           |
| `getAll`      | `getAll(): BaseCommand[]`                                     | Array          | No filtering.                    |

**Type Safety Observations:**

* No `any` types present.
* No implicit return types.
* No null returns; `undefined` is used consistently.

---

## 5. Functional Logic Specification

---

### 5.1 `register`

**Signature:**
`register(command: BaseCommand): void`

**Logic Flow:**

1. Read `command.metadata.id`.
2. Check if an entry with the same ID already exists in the internal `Map`.
3. If present:

    * Emit a warning log indicating overwrite.
4. Insert or overwrite the command instance in the registry.

**Side Effects:**

* Mutates internal registry state.
* Writes warning output via `logger.warn`.

**Error Handling:**

* No explicit error handling.
* Will throw runtime errors if:

    * `command.metadata` is `undefined`.
    * `command.metadata.id` is missing or not a string.

---

### 5.2 `get`

**Signature:**
`get(domain: string, name: string): BaseCommand | undefined`

**Logic Flow:**

1. Convert registry `Map` values into an array.
2. Iterate through commands.
3. Return the first command where:

    * `metadata.domain === domain`
    * `metadata.name === name`
4. If no match is found, return `undefined`.

**Side Effects:**
None.

**Error Handling:**

* No validation of input parameters.
* Safe failure via `undefined` return.

---

### 5.3 `getByDomain`

**Signature:**
`getByDomain(domain: string): BaseCommand[]`

**Logic Flow:**

1. Convert registry values into an array.
2. Filter commands where:

    * `metadata.domain === domain`
    * `metadata.hidden !== true`
3. Return filtered list.

**Side Effects:**
None.

**Error Handling:**

* Commands missing `metadata.hidden` default to visible.
* No defensive checks for malformed metadata.

---

### 5.4 `getDomains`

**Signature:**
`getDomains(): string[]`

**Logic Flow:**

1. Extract `metadata.domain` from each registered command.
2. Insert domains into a `Set` to remove duplicates.
3. Convert set back into an array.
4. Sort alphabetically.
5. Return sorted list.

**Side Effects:**
None.

**Error Handling:**

* Assumes all commands have a valid `metadata.domain`.

---

### 5.5 `getAll`

**Signature:**
`getAll(): BaseCommand[]`

**Logic Flow:**

1. Convert internal `Map` values into an array.
2. Return the array.

**Side Effects:**
None.

**Error Handling:**
None required.

---

## Part 2: Appendix – Testing Reference

---

## 1. Mocking Strategy

### 1.1 Services to Mock

| Dependency      | Reason                                                      |
| --------------- | ----------------------------------------------------------- |
| `loggerService` | Prevent console pollution and assert overwrite warnings.    |
| `BaseCommand`   | Use stub/mock implementations to control metadata behavior. |

### 1.2 Mock Behaviour

| Scenario               | Mock Configuration                          |
| ---------------------- | ------------------------------------------- |
| Duplicate registration | Mock `logger.warn` and assert invocation.   |
| Hidden commands        | Mock `metadata.hidden = true`.              |
| Domain filtering       | Mock multiple commands with same domain.    |
| Missing commands       | Registry left empty or mismatched metadata. |

---

## 2. Test Scenarios

### 2.1 Happy Path

| Scenario           | Expected Outcome                 |
| ------------------ | -------------------------------- |
| Register a command | Command retrievable via `get()`  |
| Retrieve by domain | Correct list returned            |
| Get domains        | Unique, sorted domain list       |
| Get all commands   | All registered commands returned |

---

### 2.2 Edge Cases

| Scenario                       | Expected Outcome                               |
| ------------------------------ | ---------------------------------------------- |
| Empty registry                 | All getters return empty arrays or `undefined` |
| Hidden command                 | Excluded from `getByDomain()`                  |
| Multiple commands, same domain | All returned in domain query                   |
| Duplicate ID registration      | Overwrites previous entry                      |

---

### 2.3 Error States

| Category           | Scenario                   | Expected Behavior   |
| ------------------ | -------------------------- | ------------------- |
| Invalid Input      | `command.metadata` missing | Runtime exception   |
| Invalid Input      | `metadata.id` undefined    | Runtime exception   |
| Dependency Failure | `logger.warn` throws       | Propagated error    |
| Logical Error      | Domain/name mismatch       | Returns `undefined` |

---

## 3. Test Data Requirements

### 3.1 Mock Command Objects

```ts
const mockCommand = {
  metadata: {
    id: 'git.commit',
    domain: 'git',
    name: 'commit',
    hidden: false
  }
} as BaseCommand;
```

### 3.2 Hidden Command Variant

```ts
const hiddenCommand = {
  metadata: {
    id: 'git.secret',
    domain: 'git',
    name: 'secret',
    hidden: true
  }
} as BaseCommand;
```

### 3.3 Multiple Domain Set

```ts
[
  { metadata: { id: 'app.init', domain: 'app', name: 'init' } },
  { metadata: { id: 'git.status', domain: 'git', name: 'status' } },
  { metadata: { id: 'nuxt.build', domain: 'nuxt', name: 'build' } }
]
```

---

## Final Architectural Notes

* The registry is a foundational infrastructure component and should be treated as **critical path**.
* Consider future enhancements:

    * Stronger typing for `CommandMetadata`.
    * Defensive validation during registration.
    * Optional DI container integration.
    * Reset/clear capability for test isolation.
