Based on the analysis of the provided source code, here is the Technical Specification and Test Strategy.

### Part 1: Operational & Design Specification

**1. Component Overview**

* **Purpose:** The `interactiveMode.ts` module serves as the **Presentation Layer** for the CLI application's interactive mode. It provides a Terminal User Interface (TUI) that allows users to configure the session, view available command domains, and execute specific commands dynamically.
* **Role in System:** It acts as the **Controller** and **Entry Point** for manual user interaction. It mediates between the user's terminal input and the underlying business logic provided by the `registry`, `llmService`, and `configService`.

**2. Architecture & Patterns**

* **Design Patterns:**
* **Command Pattern:** The module retrieves command objects from a `registry` and invokes an `execute()` method on them, decoupling the invoker (TUI) from the receiver (Command logic).
* **Facade:** It aggregates various backend services (`logger`, `config`, `llm`) behind a unified user interface.
* **Game Loop / Event Loop:** It utilizes an infinite `while (true)` loop to maintain the application state until the user explicitly chooses to exit.


* **State Management:** The function itself is technically **stateful** regarding the execution flow (it maintains the loop), but it delegates application state persistence to the singleton `configService` and `loggerService`.
* **Complexity Assessment:** **Medium**. While the logic is procedural, the complexity arises from the nested asynchronous prompts (`await select`), the handling of cancellation tokens (`isCancel`), and the integration of dynamic registry data within an infinite loop.

**3. Dependency Graph**

* **Internal Dependencies:**
* `../services/loggerService`: Used for operational logging and initialization.
* `../services/configService`: Used to store session flags (verbose mode).
* `../services/llmService`: Used to verify AI provider availability.
* `../commands/registry`: Used to fetch available domains and commands.


* **External Dependencies:**
* `@clack/prompts`: Core library for TUI components (intro, outro, select, multiselect, spinner).
* `picocolors`: Used for terminal string styling (e.g., `pc.cyan`, `pc.green`).
* Node.js `process`: Used for environment variables and exit codes.


* **Coupling Analysis:**
* **Tightly Coupled:** To `@clack/prompts` (UI implementation) and the internal Singletons (`logger`, `config`).
* **Loosely Coupled:** To specific commands. The module iterates over `registry` data, meaning new commands can be added to the system without modifying this file.



**4. Data Types & Interfaces**

* **Key Interfaces (Implicit):**
* **Registry Command:** The code assumes objects returned by `registry.getByDomain` possess:
* `metadata`: `{ id: string, label: string, description: string }`
* `isEnabled(root: string): Promise<boolean>`
* `execute(root: string, args: object): Promise<void>`




* **Return Types:**
* `runInteractive(targetRoot: string): Promise<void>`
* *Warning:* The `catch (error: any)` block uses the `any` type, which bypasses type safety for error handling.
* *Warning:* The `sessionConfig` result is cast `as string[]` without verifying it isn't a symbol (though `isCancel` checks precede it, strict type guards are safer).



**5. Functional Logic Specification**

* **Method:** `runInteractive(targetRoot: string): Promise<void>`
* **1. Initialization & Config:**
* **Logic:** Clears console and prints intro. Prompts user via `multiselect` for 'verbose' or 'file' logging options.
* **Side Effects:**
* Calls `configService.setFlag('verbose', true)` if selected.
* Sets `process.env.LOG_TO_FILE = 'true'` and calls `logger.init` if 'file' is selected.


* **Flow Control:** If the user cancels the prompt, the process exits immediately with code 0.


* **2. AI Health Check:**
* **Logic:** Initiates a spinner. Awaits `llmService.checkAvailability()`.
* **Error Handling:** Wraps in a `try/catch`. If successful, spinner stops with "AI Online". On failure, spinner stops with "AI Offline" (non-blocking).


* **3. Main Execution Loop:**
* **Logic:** Enters `while(true)`.
* **Step A (Domain Selection):** Fetches domains from `registry`. If empty, warns and prompts exit. Otherwise, displays domains via `select`.
* **Step B (Action Selection):** Fetches commands for the chosen domain. Displays commands via `select` (mapped to labels/hints). Includes a "Back" option.
* **Step C (Execution):**
* Checks `command.isEnabled(targetRoot)`.
* If enabled, awaits `command.execute(targetRoot, {})`.
* If disabled, logs a warning.


* **Error Handling:** Command execution is wrapped in `try/catch`. Errors are logged via `logger.error` but do not crash the application.





---

### Part 2: Appendix - Testing Reference

**1. Mocking Strategy**

To achieve high test coverage, the following dependencies must be mocked. The interactions with `@clack/prompts` are purely side-effects and must be intercepted.

* **`@clack/prompts`:**
* `intro`, `outro`, `isCancel`: Mock as spies.
* `spinner`: Mock to return an object with `{ start: fn, stop: fn }`.
* `multiselect`: Mock to return `['verbose']`, `[]`, or `Symbol('clack:cancel')`.
* `select`: Mock to return domain strings, command IDs, 'back', 'exit', or `Symbol('clack:cancel')`.


* **Internal Services:**
* `registry`: Mock `getDomains` and `getByDomain` to return controlled test data.
* `llmService`: Mock `checkAvailability` to resolve or reject.
* `logger` & `configService`: Mock methods to verify calls.



**2. Test Scenarios**

| Scenario Category | Scenario Description | Mock Setup Requirements | Expected Outcome |
| --- | --- | --- | --- |
| **Happy Path** | Full execution flow: Config -> Domain -> Command. | `multiselect` returns `[]`; `llm` resolves; `select` returns Domain then CommandID. | Command `execute` method is called; Loop continues (requires mock `select` to eventually return 'exit'). |
| **Happy Path** | Enable Logging Options. | `multiselect` returns `['verbose', 'file']`. | `configService.setFlag` called; `logger.init` called; `process.env` updated. |
| **Edge Case** | User cancels at Config. | `multiselect` returns `isCancel(true)`. | `process.exit(0)` called; `outro` called. |
| **Edge Case** | Empty Registry. | `registry.getDomains` returns `[]`. | Warning logged; prompt with "System Empty" -> "Exit" appears. |
| **Flow Control** | "Back" navigation. | Domain `select` returns Valid; Action `select` returns `'back'`. | Loop restarts at Domain selection; Command `execute` is NOT called. |
| **Error State** | AI Service Down. | `llmService.checkAvailability` rejects. | Spinner stops with yellow warning; App proceeds to Main Loop (does not crash). |
| **Error State** | Command Execution Failure. | Command `execute` throws Error. | `logger.error` called with message; App proceeds to Main Loop. |
| **Error State** | Command Disabled. | Command `isEnabled` returns `false`. | `logger.warn` called; `execute` is NOT called. |

**3. Test Data Requirements**

**Dummy Registry Command Object:**

```typescript
const mockCommand = {
    metadata: {
        id: 'test-cmd',
        label: 'Test Command',
        description: 'A test description'
    },
    isEnabled: jest.fn().mockResolvedValue(true), // Toggle for Disabled test
    execute: jest.fn().mockResolvedValue(undefined) // Toggle for Error test
};

```

**Dummy Registry Response:**

```typescript
const mockDomains = ['utils', 'core'];
// registry.getDomains() returns mockDomains
// registry.getByDomain('utils') returns [mockCommand]

```

**Next Step:** Would you like me to generate the **Jest unit test file** (`interactiveMode.test.ts`) implementing the mocking strategy defined above?