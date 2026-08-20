Here is the comprehensive Technical Specification and Test Strategy based on the analysis of `autoDoc.ts`.

---

# Part 1: Operational & Design Specification

## 1. Component Overview

* **Purpose:** `autoDoc` is a command-line utility designed to automate the documentation of TypeScript/JavaScript codebases. It scans a target directory for exported members (functions, constants, classes, types) that lack JSDoc comments and utilizes a Large Language Model (LLM) to generate and inject appropriate documentation.


* **Role in System:** This component functions as a **DevOps/Developer Experience Utility**. It operates outside the runtime application logic, serving as a maintenance tool to enforce code documentation standards.

## 2. Architecture & Patterns

* **Design Patterns:**
* 
**Procedural/Script:** The file exports a standalone async function (`autoDoc`) rather than a class-based service.


* 
**Recursive Visitor:** The `walk` function implements a recursive strategy to traverse directory trees.


* 
**Adapter/Wrapper:** It acts as a client wrapper around the `llm` service to specialize generic text generation for JSDoc creation.




* **State Management:**
* **Stateless Execution:** The component does not maintain persistent state across executions. It builds transient state (`fileList`, `candidates`) during a single run.




* **Complexity Assessment:** **Medium**.
* While the logic flow is linear, the complexity arises from string manipulation (regex, slicing), file system recursion, and asynchronous coordination with an external AI service. The "bottom-up" insertion logic  indicates attention to index stability, adding slight algorithmic nuance.





## 3. Dependency Graph

* **Internal Dependencies:**
* 
`../../services/llmService`: Used for generating text content via an LLM.




* **External Dependencies:**
* 
`fs` (Node Built-in): Synchronous file system operations.


* 
`path` (Node Built-in): Path manipulation.


* 
`@clack/prompts`: Interactive CLI UI (spinners, confirmation dialogs).


* 
`consola`: Logging and formatted console output.


* 
`picocolors`: Terminal color formatting.




* **Coupling Analysis:**
* 
**High Coupling to File System:** The code relies heavily on `fs.readdirSync`, `readFileSync`, and `writeFileSync`.


* **Loose Coupling to LLM:** It relies on an imported `llm` object. If `llmService` changes its interface (`.generate`), this utility breaks.



## 4. Data Types & Interfaces

### Key Interfaces

**`DocCandidate`** 
Internal interface representing an undocumented export found in the source code.

```typescript
interface DocCandidate {
    file: string;   // Absolute path to the file
    index: number;  // Character index where the export begins
    name: string;   // Name of the exported member
    snippet: string;// Contextual code snippet for the LLM
}

```

### Return Types

* 
**`walk`**: `string[]` (Array of file paths).


* 
**`isDocumented`**: `boolean`.


* 
**`autoDoc`**: `Promise<void>` (Implicit Promise due to `async`, returns nothing).



## 5. Functional Logic Specification

### 5.1 Helper: `walk(dir, fileList)`

* **Logic Flow:**
1. Checks if `dir` exists; returns list if not.
2. Reads directory contents with file types.


3. Iterates through files:
* **If Directory:** Checks against `SKIP_DIRS` (e.g., `node_modules`). If valid, recursively calls `walk`.


* **If File:** Checks extension against `TARGET_EXTS` (e.g., `.ts`, `.vue`) and explicitly excludes `.d.ts`. If valid, adds to `fileList`.






* **Side Effects:** None (Read-only).

### 5.2 Helper: `isDocumented(content, matchIndex)`

* **Logic Flow:**
1. Extracts a substring of 500 characters preceding the `matchIndex`.


2. Trims whitespace from the end of the substring.
3. Returns `true` if the trimmed string ends with the block comment closure token `*/`.





### 5.3 Main: `autoDoc(targetRoot)`

* **Logic Flow:**
1. 
**Initialization:** Starts a UI spinner and defines regex/exclusion configs.


2. **Discovery:**
* Calls `walk(targetRoot)` to get all source files.
* Reads every file. Uses `RX_EXPORT` to find exports.


* Checks `isDocumented`. If false, extracts a 300-char context snippet and pushes to `candidates`.




3. **Confirmation:**
* If no candidates, logs success and exits.


* Prompts user to proceed using `confirm`. If canceled, exits.




4. **Generation & Injection:**
* Iterates over unique files in `candidates`.
* **Crucial Step:** Sorts candidates within a file by `index` in **descending order** (bottom-up). This ensures that injecting text earlier in the file does not invalidate the indices of subsequent insertion points.


* For each candidate:
* Constructs an LLM prompt containing the candidate `name` and `snippet`.


* Awaits `llm.generate`. Sanitizes backticks from response.


* Validates response starts with `/**` and ends with `*/`.
* Injects the JSDoc string into the file content via string slicing.




* Writes the modified content back to disk.




5. 
**Completion:** updates spinner and logs success.




* **Side Effects:**
* 
**File Writes:** Modifies source code files in place.


* 
**API Usage:** Consumes LLM tokens.




* **Error Handling:**
* Captures errors during LLM generation/injection per candidate.
* Logs a warning via `consola.warn` but **does not stop** execution for other candidates.





---

# Part 2: Appendix - Testing Reference

## 1. Mocking Strategy

To achieve unit isolation, the following modules must be mocked. This is critical because the utility interacts with the file system and paid/remote APIs.

| Dependency | Mock Requirement | Behavior/Return Value Strategy |
| --- | --- | --- |
| `fs` | **MANDATORY** | Mock `readdirSync` to return a controlled file structure.<br>

<br>Mock `readFileSync` to return test strings (code w/ and w/o docs).<br>

<br>Mock `writeFileSync` to spy on arguments (verify injection). |
| `../../services/llmService` | **MANDATORY** | Mock `.generate()` method. Return a fixed string: `/** Generated Docs */`. Avoid real network calls. |
| `@clack/prompts` | **RECOMMENDED** | Mock `confirm` to return `true` (pass) or `false` (cancel).<br>

<br>Mock `spinner` to avoid cluttering test logs. |
| `path` | OPTIONAL | Usually safe to use real `path`, but mocking ensures cross-OS consistency if path separators become an issue. |

## 2. Test Scenarios

### Happy Path

| Scenario ID | Description | Input Conditions | Expected Outcome |
| --- | --- | --- | --- |
| **HP-01** | Document Single Function | File with `export function add(a,b) {}` (undocumented). User confirms. | `llm.generate` called. File updated with `/** Generated Docs */\nexport function...`. |
| **HP-02** | Ignore Existing Docs | File with `/** existing */ export const x = 1;`. | Candidate list is empty. No LLM calls. |
| **HP-03** | Recursive Scan | Nested directory structure. `src/utils/helper.ts`. | `walk` finds nested file. Docs generated. |
| **HP-04** | Multiple Exports | File with 2 undocumented exports. | Both documented. **Verify bottom-up insertion** (lower index processed last). |

### Edge Cases

| Scenario ID | Description | Input Conditions | Expected Outcome |
| --- | --- | --- | --- |
| **EC-01** | Ignored Directories | Export inside `node_modules/pkg/index.ts`. | File skipped by `walk`.

 |
| **EC-02** | Ignored Extensions | File is `schema.d.ts` or `script.py`. | File skipped.

 |
| **EC-03** | Bad LLM Response | LLM returns generic text (no `/**`). | Injection skipped for that candidate. Content unchanged.

 |
| **EC-04** | User Cancellation | User selects "No" at prompt. | Process aborts immediately. No files written.

 |

### Error States

| Scenario ID | Description | Input Conditions | Expected Outcome |
| --- | --- | --- | --- |
| **ERR-01** | LLM Failure | `llm.generate` throws Error. | <br>`consola.warn` logged. Process continues to next candidate.

 |
| **ERR-02** | File Write Permission | `fs.writeFileSync` throws EACCES. | Exception propagates (or verify if `try/catch` block covers the *write* operation—code review shows `write` is **outside** the try/catch, so this will crash the process).

 |

## 3. Test Data Requirements

**Sample Undocumented File (`mock-fs` setup):**

```typescript
// /src/math.ts
export function calculateTax(amount: number) {
    return amount * 1.2;
}

export const VERSION = "1.0.0";

```

**Sample Documented File (`mock-fs` setup):**

```typescript
// /src/logger.ts
/**
 * Logs a message
 */
export function log(msg: string) {
    console.log(msg);
}

```

**Mock LLM Response:**

```javascript
// Return value for llm.generate()
`/**
 * Calculates sales tax.
 * @param amount - The total amount
 * @returns Total with tax
 */`

```