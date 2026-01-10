Here is the comprehensive Technical Specification Document and Test Strategy Appendix based on the provided source code.

### Part 1: Operational & Design Specification

#### 1. Component Overview

* **Purpose:** The `runQuality` component is a CLI command designed to facilitate software quality assurance workflows. It dynamically detects the package manager and available quality scripts (linting, testing, type-checking) within a specified project root and provides an interactive menu to execute them.


* **Role in System:** This component acts as an **Interactive Task Runner / Orchestrator**. It sits within the "Commands" layer of the application, interfacing between the user (via CLI prompts) and the system's shell (via `child_process`) to execute standard development tasks.



#### 2. Architecture & Patterns

* **Design Patterns:**
* 
**Façade Pattern:** The component acts as a simplified interface over the complex underlying command-line arguments required to run tools like Vitest or ESLint.


* 
**Strategy Pattern (Implicit):** The `detectPM` function determines the execution strategy (npm, pnpm, yarn, bun) based on environmental artifacts (lockfiles).




* **State Management:**
* **Stateless:** The component is functionally stateless. It relies on immediate file system reads to determine the current context (`package.json`, lockfiles) at the moment of execution.




* **Complexity Assessment:** **Medium**.
* 
*Justification:* While the core logic is linear, the control flow relies heavily on conditional branching based on external file system states (presence of scripts, dependencies, lockfiles) and user input.





#### 3. Dependency Graph

* **Internal Dependencies:**
* None. The file uses standard library imports or external packages.




* **External Dependencies:**
* 
`@clack/prompts`: Used for interactive CLI menus (`select`, `isCancel`).


* 
`consola`: Used for logging info, warnings, and errors.


* 
`picocolors`: Used for styling terminal output.


* **Node.js Built-ins:**
* 
`child_process` (`spawn`): For executing shell commands.


* 
`fs`: For synchronous file system checks and reads.


* 
`path`: For file path manipulation.






* **Coupling Analysis:** **Loosely Coupled**.
* The function accepts `targetRoot` and `toolRoot` as arguments, making it independent of hardcoded paths. However, it is tightly coupled to the structure of `package.json` and specific naming conventions of lockfiles.





#### 4. Data Types & Interfaces

* **Key Interfaces (Implicit):**
* 
`PackageJson`: The code assumes an object structure with optional `scripts` (Record<string, string>), `dependencies`, and `devDependencies`.


* 
`SelectOption`: Used for the prompts, containing `value`, `label`, and `hint`.




* **Return Types:**
* 
`detectPM(root: string): string` — Explicitly returns 'pnpm', 'yarn', 'bun', or 'npm'.


* 
`runScript(cmd: string, args: string[], cwd: string): Promise<void>` — Explicitly typed promise wrapper for shell execution.


* 
`runQuality(targetRoot: string, toolRoot: string): Promise<void>` — Implicit async return.





#### 5. Functional Logic Specification

**A. `detectPM(root: string): string**`

* **Logic Flow:**
1. Checks for `pnpm-lock.yaml` → Returns 'pnpm'.


2. Checks for `yarn.lock` → Returns 'yarn'.


3. Checks for `bun.lockb` → Returns 'bun'.


4. Default → Returns 'npm'.





**B. `runScript(cmd: string, args: string[], cwd: string): Promise<void>**`

* **Logic Flow:**
1. Logs the command being executed using `consola` and `picocolors`.


2. Spawns a child process with `stdio: 'inherit'` to pipe output directly to the terminal.


3. Resolves the Promise on exit code 0; Rejects with an Error on non-zero codes or process errors.





**C. `runQuality(targetRoot: string, toolRoot: string)**`

* **Logic Flow:**
1. **Scope Selection:** Prompts user to select between 'target' or 'tool' scope. Terminates if cancelled.


2. 
**Context Resolution:** Sets `activeRoot` and detects the package manager via `detectPM`.


3. **Capability Analysis:**
* Reads `package.json` from `activeRoot`.


* Checks `scripts` object for standard keys (`lint`, `test`, `typecheck`).


* Scans dependencies for `vitest` to enable direct execution capabilities.


* 
*Error Handling:* Silently ignores JSON parse errors or missing files.




4. **Menu Construction:**
* Dynamically pushes options to an array based on analysis.
* Adds `vitest:ui` if `hasVitest` is true.


* Terminates with a warning if no quality scripts are found.




5. **Execution:**
* Prompts user for an action.


* Matches the action string (`lint`, `typecheck`, `test`, `vitest`, `vitest:ui`) to specific `runScript` calls .


* For `vitest` actions, handles the runner distinction (invoking `npx` if PM is npm).






* **Side Effects:**
* Executes shell commands that may modify files (e.g., if a fix flag were passed, though none are hardcoded here) or generate reports.


* **Error Handling:**
* Catches execution errors (from `runScript`) and logs them via `consola.error`.


* Uses explicit `any` casting in the catch block `catch (e: any)`, which violates strict typing rules.





---

### Part 2: Appendix - Testing Reference

#### 1. Mocking Strategy

To achieve unit test isolation, the following node modules and external libraries must be mocked.

* **`fs` (FileSystem):**
* **Mock Behavior:**
* 
`existsSync`: Must return `true`/`false` to simulate the presence of `package.json` and lockfiles (`yarn.lock`, etc.) to test `detectPM`.


* 
`readFileSync`: Must return a stringified JSON to simulate `package.json` content (scripts and dependencies).






* **`child_process`:**
* **Mock Behavior:**
* 
`spawn`: Must return a mock ChildProcess object that emits `close` (with code 0 or 1) and `error` events to test `runScript` success/failure paths.






* **`@clack/prompts`:**
* **Mock Behavior:**
* 
`select`: Must return pre-defined values ('target', 'lint', 'vitest:ui', etc.) to simulate user navigation through the menus.


* 
`isCancel`: Must return `true` or `false` to test the exit conditions.







#### 2. Test Scenarios

| Category | Scenario Name | Description | Key Mock Data |
| --- | --- | --- | --- |
| **Happy Path** | **Detect NPM & Run Lint** | Detects NPM lockfile, finds lint script, user selects lint, executes successfully. | `fs.existsSync` (package-lock.json): true<br>

<br>`pkg.scripts.lint`: "eslint ." |
| **Happy Path** | **Detect Vitest UI** | Detects `vitest` in devDependencies, offers UI option, executes `npx vitest --ui`. | `pkg.devDependencies.vitest`: "1.0.0"<br>

<br>`select`: "vitest:ui" |
| **Edge Case** | **No Package JSON** | `activeRoot` has no `package.json`. Should warn and exit gracefully. | `fs.existsSync` (package.json): false |
| **Edge Case** | **No Quality Scripts** | `package.json` exists but has no test/lint scripts and no vitest dependency. | `pkg.scripts`: {}<br>

<br>`pkg.dependencies`: {} |
| **Edge Case** | **Cancellation** | User selects "Go Back" or presses Ctrl+C at the Scope selection. | `select`: symbol(clack:cancel) or "back" |
| **Error State** | **Corrupt Package JSON** | `package.json` exists but contains invalid JSON. Should catch error and proceed (empty scripts). | `fs.readFileSync`: "INVALID JSON" |
| **Error State** | **Execution Failure** | The spawned process returns exit code 1. Should log error. | `spawn` emits 'close' with code 1 |

#### 3. Test Data Requirements

**A. Standard Package JSON (Vitest & Lint enabled)**

```json
{
  "name": "test-project",
  "scripts": {
    "lint": "eslint .",
    "test": "vitest run",
    "typecheck": "tsc --noEmit"
  },
  "devDependencies": {
    "vitest": "^1.0.0"
  }
}

```

**B. Minimal Package JSON (No scripts)**

```json
{
  "name": "legacy-project",
  "dependencies": {
    "lodash": "^4.0.0"
  }
}

```

**C. Corrupt Data**

* String content: `"{ name: 'broken-json' ... "` (Missing closing brace or invalid format).

**D. Path Mock Data**

* `targetRoot`: `/usr/local/dev/my-app`
* `toolRoot`: `/usr/local/lib/app-manager`