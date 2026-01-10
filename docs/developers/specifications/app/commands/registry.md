Here is the technical analysis and specification derived from the `registry.ts` source code.

# Technical Specification: Command Registry Service

## Part 1: Operational & Design Specification

### 1. Component Overview

* **Purpose:** The `CommandRegistry` serves as a centralized in-memory repository for storing, retrieving, and organizing executable command instances (`BaseCommand`) within the application.
* **Role in System:** Core Infrastructure / Middleware. It acts as the directory service that decouples the Command Line Interface (CLI) or Text User Interface (TUI) inputs from the execution logic. It allows the application to dynamically look up functionality based on user input (strings) without hard-coding references.

### 2. Architecture & Patterns

* **Design Patterns:**
* **Singleton:** The module exports a single instantiated object (`export const registry = new CommandRegistry();`), ensuring a single source of truth for all registered commands throughout the application lifecycle.
* **Registry:** Implements the classic Registry pattern to manage a collection of objects (Commands) accessible by a unique identifier.


* **State Management:** **Stateful**. The class maintains a private internal state (`this.commands`) using a `Map<string, BaseCommand>`. This state persists as long as the Node.js process is running.
* **Complexity Assessment:** **Low**. The logic primarily consists of basic collection manipulation (Map/Set operations) and array filtering.

### 3. Dependency Graph

* **Internal Dependencies:**
* `BaseCommand` (from `./baseCommand`): Defines the contract/shape of objects stored in the registry.
* `logger` (from `../services/loggerService`): Used for observability, specifically warning about duplicate command registrations.


* **External Dependencies:**
* None. The file relies solely on the Node.js standard runtime.


* **Coupling Analysis:** **Loosely Coupled**. The registry does not know about specific command implementations (e.g., a "GitCommit" class). It only relies on the generic `BaseCommand` abstraction.

### 4. Data Types & Interfaces

* **Key Interfaces:**
* `BaseCommand`: While imported, the code reveals it requires a `metadata` property containing:
* `id` (string): Unique key for the Map.
* `domain` (string): Grouping category (e.g., 'git').
* `name` (string): Specific action (e.g., 'commit').
* `hidden` (boolean): Visibility flag.




* **Return Types:**
* `void`: `register()`
* `BaseCommand | undefined`: `get()`
* `BaseCommand[]`: `getByDomain()`, `getAll()`
* `string[]`: `getDomains()`



### 5. Functional Logic Specification

#### `register(command: BaseCommand): void`

* **Logic Flow:**
1. Accepts a `BaseCommand` object.
2. Checks if the command's unique ID (`command.metadata.id`) already exists in the internal Map.
3. **Branch (Duplicate):** If it exists, logs a warning using `logger.warn`.
4. **Action:** Adds or updates the command in the `this.commands` Map using the ID as the key.


* **Side Effects:** Modifies internal memory state. Writes to stdout/log file if duplicate detected.
* **Error Handling:** No exceptions thrown. Duplicates are handled gracefully via logging and overwriting.

#### `get(domain: string, name: string): BaseCommand | undefined`

* **Logic Flow:**
1. Converts Map values to an Array.
2. Performs a linear search (`find`) to locate a command where `metadata.domain` equals the `domain` argument AND `metadata.name` equals the `name` argument.


* **Side Effects:** None (Read-only).
* **Error Handling:** Returns `undefined` if no match is found.

#### `getByDomain(domain: string): BaseCommand[]`

* **Logic Flow:**
1. Converts Map values to an Array.
2. Filters the array to find commands where `metadata.domain` matches the argument.
3. **Filter Condition:** Explicitly excludes commands where `metadata.hidden` is `true`.


* **Side Effects:** None.
* **Error Handling:** Returns an empty array `[]` if no commands match the domain.

#### `getDomains(): string[]`

* **Logic Flow:**
1. Maps all stored commands to their `metadata.domain` strings.
2. Instantiates a `Set` to automatically filter duplicates.
3. Converts the Set back to an Array.
4. Sorts the array alphabetically.


* **Side Effects:** None.

#### `getAll(): BaseCommand[]`

* **Logic Flow:**
1. Returns all values from the internal Map as an array.


* **Side Effects:** None.

---

## Part 2: Appendix - Testing Reference

### 1. Mocking Strategy

To verify this component in isolation, dependencies must be mocked to avoid side effects or relying on external file structures.

* **Services to Mock:**
* **`loggerService`**: Must be mocked to verify that `logger.warn` is called during duplicate registration scenarios.
* **`BaseCommand`**: Do not mock the class logic, but create **Stub Objects** that adhere to the `BaseCommand` shape. The registry only interacts with the data properties (`metadata`), not the methods.


* **Mock Behaviour:**
* `logger.warn`: Spy on this method. It should accept a string containing "Overwriting command".



### 2. Test Scenarios

| Category | Scenario Name | Description | Expected Outcome |
| --- | --- | --- | --- |
| **Happy Path** | Register & Retrieve | Register a valid command and retrieve it via `get()`. | Object returned matches input. |
| **Happy Path** | Domain Retrieval | Register 3 commands (2 in 'git', 1 in 'app'). Call `getByDomain('git')`. | Returns array length of 2. |
| **Happy Path** | Domain Listing | Register commands in 'git', 'app', 'system'. Call `getDomains()`. | Returns `['app', 'git', 'system']` (Sorted). |
| **Edge Case** | Overwrite Warning | Register a command with ID `git.status` twice. | `logger.warn` is called. Map contains the *second* instance. |
| **Edge Case** | Hidden Filtering | Register a command with `hidden: true`. Call `getByDomain()`. | The hidden command is **not** in the returned array. |
| **Edge Case** | Hidden Retrieval | Register a command with `hidden: true`. Call `get()` (direct lookup). | The command **is** returned (direct lookup ignores hidden flag). |
| **Error State** | Not Found | Call `get()` for non-existent domain/name. | Returns `undefined`. |
| **Error State** | Empty Registry | Call `getAll()` on new instance. | Returns `[]`. |

### 3. Test Data Requirements

Use the following JSON structures to stub the `BaseCommand` inputs for testing.

**Stub A (Standard):**

```json
{
  "metadata": {
    "id": "git.status",
    "domain": "git",
    "name": "status",
    "hidden": false
  }
}

```

**Stub B (Same Domain, Different Name):**

```json
{
  "metadata": {
    "id": "git.commit",
    "domain": "git",
    "name": "commit",
    "hidden": false
  }
}

```

**Stub C (Hidden Command):**

```json
{
  "metadata": {
    "id": "system.debug",
    "domain": "system",
    "name": "debug",
    "hidden": true
  }
}

```

**Stub D (Overwrite Candidate):**

```json
{
  "metadata": {
    "id": "git.status",
    "domain": "git",
    "name": "status",
    "description": "Updated version" 
  }
}

```

### 4. Next Step

Would you like me to generate the **Unit Test Suite (Jest/Vitest)** code based on this strategy?