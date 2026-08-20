Here is the Technical Specification and Test Strategy Appendix for the `runApp.ts` module, based on the provided source code.

---

# Part 1: Operational & Design Specification

## 1. Component Overview

* **Purpose:**
The `runApp` module serves as an execution engine designed to run target application scripts (such as `dev`, `build`, or `generate`) within a monorepo context. It abstracts the complexity of underlying package managers and ensures consistent execution environments.


* **Role in System:**
**Utility / Execution Layer.**
It acts as a bridge between the App Manager's high-level commands and the operating system's shell. It is responsible for process spawning, input/output inheritance, and package manager detection.



## 2. Architecture & Patterns

* **Design Patterns:**
* 
**Procedural Function:** The component is implemented as a standalone asynchronous function rather than a class.


* 
**Facade/Abstraction:** It abstracts the specific syntax required for different package managers (Bun, pnpm, Yarn, npm) behind a single function call.




* **State Management:**
* **Stateless:** The function does not maintain internal state between executions. It relies entirely on the file system state (`package.json`, lockfiles) at the moment of execution.


* **Complexity Assessment:**
* **Low.** The logic is linear: Validation  Detection  Execution. Control flow is handled via standard `if/else` conditionals and `try/catch` blocks.



## 3. Dependency Graph

* **Internal Dependencies:**
* 
`../../services/loggerService`: Used for logging operational info (e.g., `logger.info`).




* **External Dependencies:**
* 
`child_process`: Specifically uses `execSync` for synchronous shell execution.


* 
`fs`: Used for checking file existence and reading JSON content.


* 
`path`: Used for cross-platform path manipulation.




* **Coupling Analysis:**
* **Tight Coupling (Warning):** The `logger` is imported directly rather than injected. This violates Dependency Injection (DI) principles, making it harder to swap loggers during testing.
* 
**Tight Coupling (Filesystem):** The function is tightly coupled to the physical file system via strict usage of `fs` and `path`.





## 4. Data Types & Interfaces

* **Key Interfaces:**
* No explicit TypeScript interfaces are exported.
* 
*Implicit:* Requires a valid `package.json` structure with a `scripts` object.




* **Return Types:**
* **Current:** `Promise<void>` (Implicit).
* 
**WARNING:** The Revision History for V1.1.0 claims the return type was refactored to `Promise<number>` to expose exit codes. However, the actual code implementation contains **no return statement**, meaning it resolves to `void`. This is a discrepancy between documentation and implementation.





## 5. Functional Logic Specification

### Method: `runApp`

* **Signature:**
```typescript
export async function runApp(targetRoot: string, scriptName: string): Promise<void>

```


* **Logic Flow:**
1. 
**Construct Path:** Combines `targetRoot` and `'package.json'`.


2. 
**Validate File Existence:** Checks if `package.json` exists using `fs.existsSync`.


* *Failure:* Throws Error `'package.json not found in target root.'`.


3. **Validate Script Existence:** Reads and parses `package.json`. Checks if `pkg.scripts[scriptName]` exists.


* *Failure:* Throws Error `Missing script: "${scriptName}"`.


4. 
**Detect Package Manager:** Checks for lockfiles in the following order:


* `bun.lockb`  sets PM to `bun`.
* `pnpm-lock.yaml`  sets PM to `pnpm`.
* `yarn.lock`  sets PM to `yarn`.
* *Default:* `npm` (if no other lockfiles found).


5. 
**Construct Command:** Formats string as `${pm} run ${scriptName}`.


6. 
**Log:** Outputs the command to the logger.


7. 
**Execute:** Runs `execSync(command)` with `stdio: 'inherit'` and `cwd: targetRoot`.




* **Side Effects:**
* **I/O:** Reads from the file system.
* 
**Process:** Spawns a child process that inherits the parent's Standard Input/Output (allowing interactive terminal usage).


* **Logging:** Writes to the application log.


* **Error Handling:**
* **Execution Failure:** Wraps `execSync` in a `try/catch`. If the child process returns a non-zero exit code, it catches the error (typed as `any`) and throws a new `Error` with the message `Script "${scriptName}" failed execution.`.





---

# Part 2: Appendix - Testing Reference

## 1. Mocking Strategy

To achieve high test coverage without executing actual shell commands or reading the physical disk, the following mocks are required:

* **`fs` Module:**
* 
**`existsSync`:** Must be mocked to return `true` or `false` based on the test scenario (e.g., simulating the presence of `package.json` or specific lockfiles like `bun.lockb`).


* 
**`readFileSync`:** Must be mocked to return a JSON string representing `package.json` content (specifically the `scripts` object).




* **`child_process` Module:**
* **`execSync`:** Must be mocked to:
* Return successfully (void/buffer) for happy paths.
* Throw an error to simulate script execution failure.






* **`loggerService`:**
* 
**`logger.info`:** Mock to verify the correct command string is generated and logged.





## 2. Test Scenarios

| Category | Scenario | Mock Setup | Expected Outcome |
| --- | --- | --- | --- |
| **Happy Path** | **Run with npm (Default)** | `fs.existsSync` returns true only for `package.json`. `readFileSync` returns valid script. | `execSync` called with `npm run <script>`. |
| **Happy Path** | **Run with Bun** | `fs.existsSync` returns true for `bun.lockb`. | `execSync` called with `bun run <script>`. |
| **Happy Path** | **Run with pnpm** | `fs.existsSync` returns true for `pnpm-lock.yaml`. | `execSync` called with `pnpm run <script>`. |
| **Happy Path** | **Run with Yarn** | `fs.existsSync` returns true for `yarn.lock`. | `execSync` called with `yarn run <script>`. |
| **Error State** | **Missing package.json** | `fs.existsSync` returns `false` for `package.json`. | Throw Error: `'package.json not found in target root.'`.

 |
| **Error State** | **Missing Script** | `readFileSync` returns JSON without the target script key. | Throw Error: `Missing script: "<scriptName>"`.

 |
| **Error State** | **Execution Failure** | `execSync` throws an error. | Throw Error: `Script "<scriptName>" failed execution.`.

 |
| **Edge Case** | **Script with spaces** | Input `scriptName` as `"build:prod"`. | Command string correctly formats as `npm run build:prod`. |

## 3. Test Data Requirements

**A. Valid `package.json` Mock**

```json
{
  "name": "test-app",
  "scripts": {
    "dev": "nuxt dev",
    "build": "nuxt build",
    "generate": "nuxt generate"
  }
}

```

**B. Invalid `package.json` Mock (Missing Script)**

```json
{
  "name": "test-app",
  "scripts": {
    "test": "jest"
  }
}

```

**C. Lockfile Structures (File Existence Checks)**

* `bun.lockb`: (Content irrelevant, only existence matters)
* `pnpm-lock.yaml`: (Content irrelevant)
* `yarn.lock`: (Content irrelevant)

---

**Next Step for User:**
Would you like me to generate the **Jest unit test suite** specifically refactoring the `logger` import to use Dependency Injection to satisfy the architectural requirements?