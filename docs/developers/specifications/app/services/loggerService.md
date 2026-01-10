Based on the analysis of the provided source code, here is the comprehensive Technical Specification and Testing Strategy.

---

# Technical Specification: Logger Service

## Part 1: Operational & Design Specification

### 1. Component Overview

* **Purpose:** The `LoggerService` acts as a centralized facade for application output. It wraps standard console capabilities (via the `consola` library) to provide standardized logging levels, visual formatting, and optional file-system persistence.
* **Role in System:** This is a low-level **Infrastructure/Utility** component. It is intended to be consumed globally by other services to ensure consistent logging formats and error reporting.

### 2. Architecture & Patterns

* **Design Patterns:**
* **Singleton:** The class is instantiated immediately upon export (`export const logger = new LoggerService();`), ensuring a single instance manages the log stream throughout the application lifecycle.
* **Adapter/Wrapper:** It wraps the `consola` library and Node's native `console` object, providing a unified API while abstracting the underlying logging mechanism.


* **State Management:** **Stateful**. The service maintains internal state for the project root (`_root`), the active file stream (`_logStream`), and the internal console instance (`_console`).
* **Complexity Assessment:** **Medium**. While the logging logic is straightforward, the component manages side effects (File I/O), conditional environment logic, and error object parsing, raising the complexity beyond a simple wrapper.

### 3. Dependency Graph

* **Internal Dependencies:**
* None (No other application files are imported).


* **External Dependencies:**
* `consola` (Third-party logging utility).
* `fs` (Node.js File System module).
* `path` (Node.js Path module).


* **Coupling Analysis:**
* **High Coupling:** The service is tightly coupled to `consola` and the Node.js runtime (due to `process` and `fs` usage).



### 4. Data Types & Interfaces

* **Key Interfaces:**
* `ILogger`: The comments mention implementing an `ILogger` interface, but this interface is **not imported or strictly implemented** in the class definition, representing a potential type safety gap.


* **Return Types & Type Safety Warnings:**
* **Critical Warning:** The public API relies heavily on `any`.
* `init(targetRoot: string): void`
* `info(message: any, ...args: any[]): void`
* `success(message: any, ...args: any[]): void`
* `warn(message: any, ...args: any[]): void`
* `debug(message: any, ...args: any[]): void`
* `error(message: string | Error, ...args: any[]): void`
* `box(message: string): void`



### 5. Functional Logic Specification

#### 5.1 Initialization

* **Method:** `init(targetRoot: string): void`
* **Logic Flow:**
1. Updates the internal `_root` property.
2. Checks `process.env.LOG_TO_FILE`. If `'true'`, calls `_enableFileLogging()`.


* **Side Effects:** May trigger directory creation and file stream opening.

#### 5.2 File Logging (Internal)

* **Method:** `_enableFileLogging(): void`
* **Logic Flow:**
1. Constructs path: `{root}/app-monitor/logs`.
2. Checks existence via `fs.existsSync`; creates recursively via `fs.mkdirSync` if missing.
3. Generates filename using ISO date (sanitized).
4. Opens a write stream (`flags: 'a'`) and assigns to `_logStream`.


* **Error Handling:** Catches FS errors and logs them via `_console.warn` to prevent application crash during logger init.

#### 5.3 Standard Logging (`info`, `success`, `warn`)

* **Method:** `methodName(message, ...args)`
* **Logic Flow:**
1. Calls the corresponding method on the internal `_console` (consola) instance.
2. Calls `_writeToFile` to append the log to the file stream if it exists.



#### 5.4 Conditional Debugging

* **Method:** `debug(message, ...args)`
* **Logic Flow:**
1. Checks `process.env.DEBUG` OR `process.env.VERBOSE`.
2. If truthy, proceeds to log to console and file. Otherwise, silently ignores.



#### 5.5 Error Handling

* **Method:** `error(message: string | Error, ...args)`
* **Logic Flow:**
1. **Branch A (Input is Error):**
* Logs `✖ {message.message}` to standard `console.error`.
* Logs stack trace to standard `console.error` if present.
* Writes to file with level 'error', passing stack trace in args.


2. **Branch B (Input is String):**
* Logs `✖ {message}` to standard `console.error`.
* Writes to file with level 'error'.





#### 5.6 Visual Boxing

* **Method:** `box(message: string)`
* **Logic Flow:**
1. Splits message by newline.
2. Calculates max width and generates a border using ASCII characters (┌, ─, ┐, etc.).
3. Outputs directly via `console.log`.


* **Inconsistency Note:** This method **does not** write to the file stream, unlike other methods.

---

## Part 2: Appendix - Testing Reference

### 1. Mocking Strategy

To verify this service without generating real log files or polluting test output, the following mocks are required:

* **`fs` (Node File System):**
* **Mock `existsSync`:** Toggle return between `true`/`false` to test directory creation logic.
* **Mock `mkdirSync`:** Spy to verify recursive directory creation arguments.
* **Mock `createWriteStream`:** Must return a mock object with a `write` method to verify file output formatting.


* **`consola` / `_console`:**
* The service assigns `private _console = consola`. This private property should be intercepted or `consola` mocked globally to verify `info`, `success`, and `warn` calls.


* **Global `console`:**
* The `error` and `box` methods call native `console.error` and `console.log`. These must be spies.


* **`process.env`:**
* Must be mutable during tests to check `LOG_TO_FILE` and `DEBUG` flags.



### 2. Test Scenarios

| Category | Scenario Description | Expected Outcome |
| --- | --- | --- |
| **Happy Path** | Call `init` with env `LOG_TO_FILE='true'`. | Directory created (if missing), stream opened, "File logging enabled" logged. |
| **Happy Path** | Call `info('test', {a:1})`. | Consola info called; `_logStream.write` called with timestamp and JSON stringified object. |
| **Happy Path** | Call `error` with `new Error('Fail')`. | `console.error` logs message + stack; File writes stack trace. |
| **Edge Case** | `debug` called without env vars. | No console output, no file write. |
| **Edge Case** | `init` called *without* env var. | `_logStream` remains null; subsequent logs do not crash but skip file writing. |
| **Edge Case** | `_writeToFile` with circular JSON object. | `JSON.stringify` inside map might throw; needs verification if `try/catch` exists (Code analysis: **No try/catch in `_writeToFile**`, risk of crash). |
| **Error State** | `fs.mkdirSync` throws permission error. | `init` catches error, logs warning via `_console.warn`, application continues without file logging. |

### 3. Test Data Requirements

**Scenario: Error Object Logging**

```typescript
const mockError = new Error("Database Connection Failed");
mockError.stack = "Error: Database Connection Failed\n at Database.connect (db.ts:10:5)";
// Used to test: logger.error(mockError);

```

**Scenario: Complex Argument Logging**

```typescript
const complexMeta = {
    userId: 101,
    roles: ["admin", "editor"],
    metadata: { valid: true }
};
// Used to test: logger.info("User login", complexMeta);
// Expect file output: ... [INFO] User login {"userId":101,"roles":["admin","editor"],"metadata":{"valid":true}}

```

---

### Next Step

Would you like me to generate a **Jest unit test suite** specifically targeting the `_writeToFile` method to verify safety against circular JSON structures, which was identified as a risk in the Edge Cases?