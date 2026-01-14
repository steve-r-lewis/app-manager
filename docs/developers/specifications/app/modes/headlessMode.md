Here is the comprehensive Technical Specification and Test Strategy based on the analysis of `headlessMode.ts`.

### Part 1: Operational & Design Specification

#### 1. Component Overview

* **Purpose:** The `headlessMode.ts` module serves as the command-line interface (CLI) entry point for the `app-manager` application. It acts as a dispatcher that interprets raw string arguments, configures the runtime environment, and delegates execution to specific command logic without a graphical user interface.
* **Role in System:**
* **Controller / Dispatcher:** It sits between the Node.js process arguments and the internal Command Registry.
* **Configuration Bridge:** It translates CLI flags (e.g., `--verbose`) into application-wide configuration settings via the `configService`.



#### 2. Architecture & Patterns

* **Design Patterns:**
* **Command Pattern:** The module consumes a `commandRegistry` to retrieve command objects, adhering to an interface that presumably includes `execute` and `isEnabled` methods.
* **Facade:** `runHeadless` abstracts the complexity of argument parsing and error handling, providing a simple interface for the application entry point.
* **Singleton Consumer:** It relies on singleton instances of `logger`, `configService`, and `commandRegistry`.


* **State Management:**
* **Stateless Logic:** The function `runHeadless` itself does not maintain persistent internal state between runs (as it is likely a one-off execution per process).
* **Global State Mutation:** It explicitly mutates global state by calling `configService.setFlag`, affecting the shared application context.


* **Complexity Assessment:** **Medium**
* **Justification:** While the control flow is linear, the manual argument parsing loop () involves conditional logic to distinguish between boolean flags, key-value pairs, and positional arguments. This custom parsing increases the risk of edge-case bugs compared to using a standard library like `yargs` or `commander`.



#### 3. Dependency Graph

* **Internal Dependencies:**
* `../services/loggerService`: Used for operational logging and error reporting.
* `../services/configService`: Used to set runtime flags based on CLI arguments.
* `../commands/commandRegistry`: The central repository for looking up executable commands.


* **External Dependencies:**
* **Node.js Process:** Implicit dependency on `process.exit` for flow control.


* **Coupling Analysis:**
* **High Coupling:** The module is tightly coupled to the specific implementation of the `commandRegistry`. It assumes the objects returned by `commandRegistry.get()` strictly implement `isEnabled` and `execute`.



#### 4. Data Types & Interfaces

* **Key Interfaces (Inferred):**
Since strict interfaces are not imported, the code relies on the following implicit interface for a Command:
```typescript
interface ICommand {
    isEnabled(targetRoot: string): Promise<boolean>;
    execute(targetRoot: string, options: Record<string, any>, ...args: string[]): Promise<void>;
}

```


* **Return Types:**
* `runHeadless`: `Promise<void>` (Async function with no return value).


* **Typing Audit & Warnings:**
* **CRITICAL:** `const options: Record<string, any> = {};` uses `any`. This bypasses type safety for configuration options.
* **CRITICAL:** `catch (error: any)` uses explicit `any`, masking potential type issues with error objects.
* **WARNING:** The rest arguments passed to `command.execute` (`...cleanArgs`) are strings, but the command implementation might expect specific types, leading to potential runtime errors if not validated inside the command.



#### 5. Functional Logic Specification

**Method:** `runHeadless(targetRoot: string, args: string[])`

1. **Argument Destructuring:**
* Extracts `domain` (arg[0]), `action` (arg[1]), and `rest` (remaining args).


2. **Custom Argument Parsing (Loop):**
* Iterates through `rest` array.
* **Detection:** Checks if a string starts with `--`.
* **Key-Value Logic:** If a flag is found (`--key`), it checks the *next* index. If the next index exists and is *not* a flag, it assigns `options[key] = value`.
* **Boolean Logic:** If the next index *is* a flag or does not exist, it assigns `options[key] = true`.
* **Positional Logic:** Non-flag strings are pushed to `cleanArgs`.


3. **Environment Configuration:**
* Checks `options.verbose` or `options.debug`. If present, sets the global `verbose` flag in `configService`.


4. **Command Lookup & Validation:**
* Queries `commandRegistry.get(domain, action)`.
* **Guard Clause:** If no command is found, logs `Unknown command` and executes `process.exit(1)`.


5. **Execution Guard:**
* Awaits `command.isEnabled(targetRoot)`.
* If `false`, logs availability error and executes `process.exit(1)`.


6. **Command Execution:**
* Awaits `command.execute(targetRoot, options, ...cleanArgs)`.


7. **Error Handling:**
* Wraps steps 5-6 in a `try/catch`.
* On error, logs `Execution failed: ${error.message}` and executes `process.exit(1)`.



---

### Part 2: Appendix - Testing Reference

#### 1. Mocking Strategy

To achieve 100% unit test coverage without side effects, the following mocks are required:

* **`process.exit` (Crucial):** Must be mocked (spy) to prevent the test runner from terminating when `runHeadless` encounters an error or validation failure.
* **`commandRegistry`:**
* Method: `get(domain, action)`
* **Mock Behavior A:** Return `undefined` (to test "Unknown command").
* **Mock Behavior B:** Return a `MockCommand` object (defined below).


* **`MockCommand` Object:**
* Method: `isEnabled(root)`
* Test `true` (Happy Path).
* Test `false` (Disabled context).


* Method: `execute(root, opts, args)`
* Test `Resolve` (Success).
* Test `Reject` (Runtime error).




* **`configService`:**
* Method: `setFlag` (Spy to verify verbosity toggling).


* **`logger`:**
* Methods: `info`, `error` (Spies to verify output messages).



#### 2. Test Scenarios

| Category | ID | Scenario Description | Input `args` | Expected Outcome |
| --- | --- | --- | --- | --- |
| **Happy Path** | HP-01 | **Standard Execution**<br>

<br>Valid domain/action, no flags. | `['user', 'create', 'john_doe']` | `commandRegistry.get` called.<br>

<br>`command.execute` called with arg `john_doe`. |
| **Happy Path** | HP-02 | **Flag Parsing (Boolean)**<br>

<br>Flag sets option to true. | `['build', 'run', '--verbose']` | `configService.setFlag` called.<br>

<br>`options.verbose` is `true`. |
| **Happy Path** | HP-03 | **Flag Parsing (Value)**<br>

<br>Flag sets option to string. | `['db', 'migrate', '--env', 'prod']` | `options.env` is `'prod'`.<br>

<br>`cleanArgs` is empty. |
| **Happy Path** | HP-04 | **Mixed Parsing**<br>

<br>Interleaved flags and args. | `['test', 'run', '--watch', 'spec.ts']` | `options.watch` is `true`.<br>

<br>`cleanArgs` contains `['spec.ts']`. |
| **Edge Case** | EC-01 | **Trailing Flag**<br>

<br>Flag at the very end of array. | `['sys', 'check', '--force']` | `options.force` is `true`. |
| **Edge Case** | EC-02 | **Double Flag**<br>

<br>Two boolean flags in sequence. | `['sys', 'check', '--a', '--b']` | `options.a` is `true`, `options.b` is `true`. |
| **Error State** | ER-01 | **Unknown Command**<br>

<br>Registry returns null. | `['fake', 'cmd']` | Logger: "Unknown command".<br>

<br>`process.exit(1)` called. |
| **Error State** | ER-02 | **Command Disabled**<br>

<br>`isEnabled` returns false. | `['db', 'drop']` | Logger: "not available in this context".<br>

<br>`process.exit(1)` called. |
| **Error State** | ER-03 | **Execution Failure**<br>

<br>`execute` throws error. | `['user', 'create']` | Logger: "Execution failed".<br>

<br>`process.exit(1)` called. |

#### 3. Test Data Requirements

**Mock Command Interface (TypeScript):**

```typescript
const mockCommand = {
    isEnabled: jest.fn().mockResolvedValue(true),
    execute: jest.fn().mockResolvedValue(void 0)
};

```

**Complex Argument Injection:**

```typescript
// For Scenario HP-03/HP-04
const targetRoot = '/var/www/project';
const complexArgs = [
    'deploy',       // domain
    'start',        // action
    '--dry-run',    // boolean flag
    '--region',     // value flag key
    'us-east-1',    // value flag value
    'service-A'     // cleanArg[0]
];

```

**Expected Options Output:**

```json
{
    "dry-run": true,
    "region": "us-east-1"
}

```

### Next Steps

Would you like me to generate the **Jest unit test file** (`headlessMode.test.ts`) utilizing the scenarios and mocking strategy defined above?