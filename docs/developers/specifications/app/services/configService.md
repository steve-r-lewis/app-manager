# Technical Specification Document: Configuration Service

## Part 1: Operational & Design Specification

### 1. Component Overview

* **Purpose:** The `ConfigService` serves as the centralized repository for the application's runtime configuration. It manages global state regarding the user's identity, directory context, and operational flags (e.g., verbosity, dry-run modes).
* **Role in System:** Core Infrastructure / State Management. It acts as the "Single Source of Truth" for the application, accessed by other services to determine operational behavior.

### 2. Architecture & Patterns

* **Design Pattern:**
* **Singleton:** The class is instantiated internally and exported as a constant `configService`. This ensures only one instance of the configuration state exists throughout the application lifecycle.
* **Accessor/Mutator:** Encapsulates state behind specific getter (`getConfig`, `isVerbose`) and setter (`setFlag`, `setGitUser`) methods.


* **State Management:**
* **Stateful:** The component retains data in memory via the `private config` and `private _toolRoot` properties.
* **Mutable:** State is modified via public methods, though the retrieval method returns a `Readonly` type to discourage external mutation.


* **Complexity Assessment:** **Low**. The logic consists primarily of variable assignment, object merging, and property retrieval. There is no complex algorithmic processing or asynchronous control flow.

### 3. Dependency Graph

* **Internal Dependencies:**
* `../types/index`: Imports `AppConfig` and `GitUserConfig` interfaces.


* **External Dependencies:**
* `process`: Uses the Node.js global `process.cwd()` to initialize the working directory.


* **Coupling Analysis:**
* **Loose Coupling:** The service has zero dependencies on other logic services (like FileSystem or Git wrappers). It depends only on pure data structures (Types).



### 4. Data Types & Interfaces

**Key Interfaces (Inferred from usage):**

* **`AppConfig`**: The root state object containing `cwd`, `gitUser`, and `flags`.
* **`GitUserConfig`**: `{ name: string, email: string }`.
* **`Flags`**: `{ verbose: boolean, dryRun: boolean }`.

**Method Return Types:**

| Method | Return Type | Warning |
| --- | --- | --- |
| `init` | `void` | None |
| `toolRoot` (getter) | `string` | None |
| `reset` | `void` | None |
| `getDefaults` | `AppConfig` | Private method |
| `getConfig` | `Readonly<AppConfig>` | Shallow copy (nested objects share references) |
| `setGitUser` | `void` | None |
| `setFlag` | `void` | None |
| `isVerbose` | `boolean` | None |

### 5. Functional Logic Specification

#### 5.1 `init(toolRoot: string): void`

* **Logic Flow:** Assigns the provided `toolRoot` path to the private `_toolRoot` variable.
* **Side Effects:** Mutates internal `_toolRoot` state.
* **Error Handling:** None. Replaces existing value if called multiple times.

#### 5.2 `reset(): void`

* **Logic Flow:**
1. Invokes `getDefaults()` to generate a fresh configuration object.
2. Overwrites `this.config` with the new default object.
3. Resets `_toolRoot` to an empty string.


* **Side Effects:** Destroys all current runtime settings (User ID, Flags) and reverts to startup state.
* **Use Case:** Primarily used for test teardown to ensure isolation between tests.

#### 5.3 `getConfig(): Readonly<AppConfig>`

* **Logic Flow:** Returns a shallow copy of the configuration object using the spread syntax `{ ...this.config }`.
* **Side Effects:** None.
* **Note:** While the return type is `Readonly`, strictly speaking, the nested objects (like `gitUser`) are referenced. However, the TypeScript `Readonly` utility helps prevent compile-time mutation.

#### 5.4 `setGitUser(user: GitUserConfig): void`

* **Logic Flow:** Accepts a user object and assigns a copy of it (`{ ...user }`) to `this.config.gitUser`.
* **Side Effects:** Updates the `gitUser` portion of the global state.

#### 5.5 `setFlag(key: keyof AppConfig['flags'], value: boolean): void`

* **Logic Flow:** Accesses `this.config.flags` using the provided `key` and assigns the boolean `value`.
* **Side Effects:** Immediately alters application behavior logic (e.g., enabling verbose logging).

#### 5.6 `getDefaults(): AppConfig` (Private)

* **Logic Flow:** Constructs the initial state object:
* `cwd`: Resolved via `process.cwd()`.
* `gitUser`: Initialized to empty strings.
* `flags`: Initialized to `false`.



---

## Part 2: Appendix - Testing Reference

### 1. Mocking Strategy

Since `configService` is a Singleton, unit testing requires strict state management to prevent test pollution.

* **Services to Mock:**
* **`process.cwd()`**: The private `getDefaults` method calls this system method.


* **Mock Behavior:**
* *Scenario A (Standard):* Mock `process.cwd()` to return `/mock/path/to/project`.
* *Scenario B (Reset):* Ensure `reset()` is called in the `afterEach` hook of the test suite.



### 2. Test Scenarios

| Category | Scenario Name | Description | Expected Outcome |
| --- | --- | --- | --- |
| **Happy Path** | **Initial State Integrity** | Verify that upon instantiation, flags are `false` and gitUser is empty. | `isVerbose()` is `false`, `toolRoot` is `''`. |
| **Happy Path** | **Lifecycle Init** | Call `init('/usr/local/bin')` and retrieve via getter. | `toolRoot` returns `'/usr/local/bin'`. |
| **Happy Path** | **Flag Toggling** | Call `setFlag('verbose', true)`. | `isVerbose()` returns `true`; `getConfig().flags.verbose` is `true`. |
| **Happy Path** | **User Configuration** | Call `setGitUser` with valid data. | `getConfig().gitUser` matches input data. |
| **Edge Case** | **State Reset** | Modify state, then call `reset()`. | State reverts to defaults; `toolRoot` becomes empty string. |
| **Edge Case** | **Shallow Copy Check** | Retrieve config via `getConfig()`, attempt to mutate local variable, check service state. | Service state should remain unchanged (dependent on deep/shallow copy limitations). |
| **Error State** | **Type Safety (TS)** | Attempt to pass invalid flag key (e.g., 'invalidFlag'). | **Compile Error** (Logic handles this via Typescript constraints). |

### 3. Test Data Requirements

**Input: Git User Configuration**

```json
{
  "name": "Test User",
  "email": "test.user@example.com"
}

```

**Expected Default State (JSON Representation)**

```json
{
  "cwd": "/current/working/directory", 
  "gitUser": {
    "name": "",
    "email": ""
  },
  "flags": {
    "verbose": false,
    "dryRun": false
  }
}

```