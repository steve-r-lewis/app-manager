Based on the analysis of the provided source code `createLayer.ts.old`, here is the formal Technical Specification and Test Strategy.

---

### Part 1: Operational & Design Specification

#### 1. Component Overview

* **Purpose:** The `createLayer` component is a CLI automation utility designed to provision a new Nuxt layer structure. It standardizes the creation of filesystem artifacts (configuration, documentation, licenses) and enriches the metadata using GenAI based on user input.


* **Role in System:**
* **Scaffolding Utility:** Acts as a generator module within the application's command interface (CLI).
* **Orchestrator:** Coordinates user input (interactive or headless), AI service calls, and filesystem operations to produce a ready-to-use directory structure.



#### 2. Architecture & Patterns

* **Design Patterns:**
* **Procedural Scripting:** The component functions as a linear script execution rather than a class-based object.
* 
**Singleton Consumption:** Consumes `logger` and `llm` as singleton instances imported from service modules.


* 
**Fallback Strategy:** Implements a resilience pattern for the AI generation, falling back to default hardcoded strings if the LLM service fails.




* **State Management:**
* **Stateless:** The function is pure in terms of application state; it relies entirely on arguments (`options`) and ephemeral local variables (`aiData`, `layerName`) during execution.


* **Complexity Assessment:** **Medium**.
* While the control flow is linear, the complexity arises from the integration of asynchronous external services (LLM), interactive CLI prompts with cancellation logic, and robust filesystem error handling.



#### 3. Dependency Graph

* **Internal Dependencies:**
* 
`../../services/loggerService`: Used for system logging (info, success, error).


* 
`../../services/llmService`: Used to generate natural language descriptions for metadata.


* 
`../../types/nuxtTypes`: provides the `CreateLayerOptions` interface.




* **External Dependencies:**
* 
`@clack/prompts`: Handles interactive CLI elements (spinners, text inputs, intros/outros).


* `fs` (Node.js): Synchronous file system operations (`mkdirSync`, `writeFileSync`, `existsSync`).
* `path` (Node.js): Path manipulation.


* **Coupling Analysis:**
* **Tight Coupling:** The component is tightly coupled to `@clack/prompts` for UI and `fs` for I/O.
* 
**Hardcoded Values:** Contains specific hardcoded author names ("Steve R Lewis") and license types, increasing logical coupling to a specific owner entity.





#### 4. Data Types & Interfaces

* **Key Interfaces:**
* `CreateLayerOptions`: Defined in `nuxtTypes`. Contains optional fields `name` (string) and `purpose` (string).




* **Return Types:**
* `createLayer(...)`: **`Promise<void>`**.
* 
**Warning:** The error handling block uses `error: any`. This should be strictly typed (e.g., `Error` or `NodeJS.ErrnoException`).





#### 5. Functional Logic Specification

**Method:** `createLayer(targetRoot: string, options: CreateLayerOptions = {})`

1. **Headless vs Interactive Check:**
* *Logic:* Checks if `options.name` is provided. If yes, logs via `logger.info`. If no, initializes `@clack/prompts` intro.




2. **Directory Initialization:**
* *Logic:* Resolves the `layers` subdirectory inside `targetRoot`. Ensures it exists using `mkdirSync`.




3. **Input Resolution (Layer Name):**
* *Logic:* If `options.name` is missing, prompts user via `text()`. Validates input is not empty.
* *Normalization:* Trims and lowercases the input.
* 
*Early Exit:* If user cancels prompt, returns immediately.


* *Validation:* Checks if the target layer directory already exists. If yes, logs error and returns.




4. **Input Resolution (Purpose):**
* *Logic:* Checks `options.purpose`. If missing, prompts user. Defaults to `Utility layer for ${layerName}` if skipped.
* 
*Early Exit:* Handles prompt cancellation.




5. **AI Generation:**
* *Logic:* Initializes a `spinner`. Sets default `aiData` values.
* 
*External Call:* Sends a prompt to `llm.generate` requesting a JSON object with `readme`, `jsdoc`, and `pkgJson` keys.


* 
*Parsing:* Uses Regex (`/\{[\s\S]*\}/`) to extract JSON from the LLM response and `JSON.parse` it.


* 
*Fallback:* If JSON parsing or the API call fails, the catch block silently stops the spinner and proceeds using the default values.




6. **Formatting:**
* 
*Logic:* Word-wraps the JSDoc description to ensure lines do not exceed ~75 characters. Generates current date/time strings (en-GB locale).




7. **Scaffolding (Side Effects - File I/O):**
* *Action:* Creates the specific layer directory.
* 
*Write:* `package.json` (includes AI description).


* 
*Write:* `tsconfig.json` (extends root config).


* 
*Write:* `.gitignore`.


* 
*Write:* `LICENSE` (Hardcoded MIT License).


* 
*Write:* `README.md` (includes AI content).


* 
*Write:* `nuxt.config.ts` (includes generated JSDoc header).




8. **Completion:**
* *Logic:* Logs success via `logger`. Calls `outro` only if running interactively.


* *Error Handling:* Wraps file operations in a `try/catch`. Logs `Scaffolding failed` on error.





---

### Part 2: Appendix - Testing Reference

#### 1. Mocking Strategy

To achieve unit isolation, the following dependencies must be mocked using a framework like Jest or Vitest.

* **`fs` (Node Native):**
* `existsSync`: Mock to return `false` (to allow creation) or `true` (to test collision logic).
* `mkdirSync`: Spy to verify directory creation arguments.
* `writeFileSync`: Spy to capture file paths and content written (crucial for verifying AI content insertion).


* **`@clack/prompts`:**
* `intro`, `outro`, `spinner`: Mock as no-ops.
* `text`: Mock to return specific strings (e.g., "billing") or the `isCancel` symbol.
* `isCancel`: Mock to return `true` when triggered.


* **`../../services/llmService`:**
* `generate`: Mock to return a valid JSON string wrapped in text to test the Regex parser, or throw an error to test fallback logic.


* **`../../services/loggerService`:**
* `info`, `success`, `error`: Spy to assert correct logging calls.



#### 2. Test Scenarios

| Category | Scenario | Description | Key Mock Behavior |
| --- | --- | --- | --- |
| **Happy Path** | **Headless Creation** | User provides `name` and `purpose` via options. | `fs.existsSync` -> `false`. `llm.generate` -> Valid JSON. |
| **Happy Path** | **Interactive Flow** | User runs without options, answers prompts. | `clack.text` -> returns "auth", then "auth logic". |
| **Edge Case** | **Existing Layer** | User tries to create a layer that exists. | `fs.existsSync` (for layer dir) -> `true`. Verify `logger.error` is called. |
| **Edge Case** | **User Cancellation** | User hits Ctrl+C at name prompt. | `clack.text` -> returns `Symbol(clack:cancel)`. Verify early return. |
| **Error State** | **AI Failure** | LLM service goes down or returns garbage. | `llm.generate` -> throws Error OR returns "I can't do that". Verify default content in `writeFileSync`. |
| **Error State** | **File Permission** | Disk write fails during scaffolding. | `fs.mkdirSync` -> throws `EACCES`. Verify `logger.error("Scaffolding failed...")`. |
| **Logic** | **JSDoc Wrapping** | AI returns a very long description string. | `llm.generate` -> returns 200 word string. Verify `nuxt.config.ts` content contains newlines in header. |

#### 3. Test Data Requirements

**A. Input Options Object:**

```json
{
  "name": "notifications",
  "purpose": "Handle email and push notifications"
}

```

**B. Mocked LLM Response (Valid):**

```text
Here is your JSON:
{
  "readme": "The notifications layer handles all outbound messaging.",
  "jsdoc": "Configuration for the notification service.",
  "pkgJson": "Notification layer logic"
}

```

**C. Expected `package.json` Output:**

```json
{
  "name": "@monorepo/notifications",
  "version": "1.0.0",
  "description": "Notification layer logic",
  "private": true,
  "type": "module",
  "main": "./nuxt.config.ts"
}

```