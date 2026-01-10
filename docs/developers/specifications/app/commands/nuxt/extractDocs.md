Based on the source code provided in `extractDocs.ts.old`, here is the detailed Technical Specification and Test Strategy.

---

# Part 1: Operational & Design Specification

## 1. Component Overview

* **Purpose:** This component acts as a Command Line Interface (CLI) utility designed to automatically generate documentation for a Nuxt monorepo. It scans a specific directory structure (`layers`), aggregates file content based on user selection, generates AI summaries for code files, and outputs a formatted Markdown report.


* **Role in System:**
* **Utility/Tooling:** It is a developer-experience tool intended to be run manually or via CI scripts.
* 
**Documentation Generator:** It bridges the gap between raw source code and readable documentation by leveraging static analysis (JSON/Markdown parsing) and Generative AI (LLM).





## 2. Architecture & Patterns

* **Design Patterns:**
* **Script/Procedural:** The file exports a main function (`extractDocs`) that orchestrates a linear flow of execution rather than utilizing a class-based Object-Oriented structure.
* 
**Recursion:** Used in the `scanFiles` helper to traverse directory trees.


* 
**Strategy (Implicit):** The `processFile` function implements primitive strategy logic via conditional statements to handle different file types (`.json`, `.md`, `.ts`) differently.




* **State Management:**
* **Stateless:** The component does not maintain persistent state between executions.
* 
**Transient State:** State is held strictly within the execution scope of `extractDocs` (e.g., `markdownBody`, `toc`, `layerFiles`).




* **Complexity Assessment:** **Medium**
* **Justification:** While the control flow is linear, the complexity arises from:
* Recursive file scanning logic.


* Asynchronous parallel processing (`Promise.all`) for AI summarization.


* Interactive CLI prompts impacting flow control.







## 3. Dependency Graph

* **Internal Dependencies:**
* 
`../../services/llmService`: Used for generating AI summaries of code files.




* **External Dependencies:**
* 
`fs` (Node.js): File system read/write/stat operations.


* 
`path` (Node.js): Path resolution and manipulation.


* 
`@clack/prompts`: Interactive CLI UI (multiselect, spinner, isCancel).


* 
`consola`: Enhanced console logging.


* 
`picocolors`: Terminal text color formatting.




* **Coupling Analysis:** **High/Tight**
* The code is tightly coupled to the file system structure (specifically looking for a `layers` folder).


* It imports a concrete implementation of `llm` rather than using Dependency Injection, making unit testing difficult without module-level mocking.





## 4. Data Types & Interfaces

* **Key Interfaces:**
* `FileResult`: Defines the structure for processed file data.
```typescript
interface FileResult {
    file: string;
    content: string;
}

```






* **Return Types:**
* 
`scanFiles`: Returns `string[]` (Implicitly typed).


* 
`processFile`: Returns `Promise<string>`.


* 
`extractDocs`: Returns `Promise<void>` (Async function with no return value, or returns undefined on early exit).




* **Type Warnings:**
* 
**Explicit `any`:** `catch (e: any)` in `processFile` bypasses type safety for error handling.


* 
**Implicit Types:** `scanFiles` defaults `fileList` to `[]` without explicit typing in the signature, relying on inference.





## 5. Functional Logic Specification

### Helper: `scanFiles`

* 
**Signature:** `scanFiles(dir: string, extension: string, fileList: string[] = []): string[]` 


* **Logic Flow:**
1. Check if directory exists; if not, return list.


2. Read directory contents with file types.


3. Iterate through files:
* 
**If Directory:** Recurse if not `node_modules` or `.git`.


* **If File:** Check if `extension` matches `*`, ends with extension, or matches exact name. Push full path to list.




4. Return `fileList`.





### Helper: `processFile`

* 
**Signature:** `processFile(filePath: string, layerPath: string): Promise<string>` 


* **Logic Flow:**
1. Derive filename, relative path, and extension.


2. Read file content (UTF-8).


3. **Strategy 1 (package.json):** Parse JSON. Return `description` formatted as blockquote or fallback text. Return "(Invalid JSON)" on parse error.


4. **Strategy 2 (.md):** Split by newline. Return first 20 lines. Append "... (truncated)" if longer.


5. **Strategy 3 (.ts, .js, .vue):**
* Construct prompt with relative path and first 2000 chars of code.


* Call `llm.generate(prompt)`.


* Return `**AI Summary:**` + result.
* Catch errors and return failure message.




6. 
**Default:** Return "(Binary or unsupported file type)".




* 
**Error Handling:** Catches generic errors (`e: any`) and returns a string starting with "Error reading file:".



### Main: `extractDocs`

* 
**Signature:** `extractDocs(targetRoot: string): Promise<void>` 


* **Logic Flow:**
1. **Validate:** Check if `layers` directory exists. Log warning and exit if missing.


2. 
**Select:** Prompt user via `multiselect` for file patterns (`package.json`, `.vue`, etc.). Handle cancellation.


3. **Prepare:** Start spinner. Ensure `docs/reports` directory exists. Generate timestamped filename.


4. **Iterate Layers:**
* Read subdirectories of `layers`.


* Update spinner message and Markdown TOC/Headers.


* 
**Scan:** For each selected extension, call `scanFiles` and merge results.


* 
**Deduplicate:** Filter unique paths.


* 
**Process:** Parallel execution (`Promise.all`) of `processFile` for all found files.


* Append results to `markdownBody`.




5. **Finalize:** Construct final Markdown string (Header + TOC + Body). Write to disk. Stop spinner. Log success.




* **Side Effects:**
* Creates directories (`docs/reports`).
* Writes a file to disk (`layer-report-*.md`).
* Console output (Logs and Spinner).



---

# Part 2: Appendix - Testing Reference

## 1. Mocking Strategy

To achieve high test coverage without relying on the actual file system or incurring LLM costs, the following mocks are required:

* **`fs` (Node Module):**
* 
`existsSync`: Mock to return `true`/`false` to test validation logic.


* 
`readdirSync`: Mock to return virtual directory structures (e.g., `['layer1']`, `['file.ts']`).


* 
`readFileSync`: Mock to return sample content based on filename (JSON, Markdown, or Code strings).


* 
`writeFileSync`: Spy to verify correct report generation.


* 
`mkdirSync`: Spy to ensure report directory creation.




* **`@clack/prompts`:**
* 
`multiselect`: Mock to return a fixed array of strings (e.g., `['.ts', 'package.json']`) to bypass UI.


* 
`spinner`: Mock to return an object with no-op `start`, `message`, and `stop` functions.


* 
`isCancel`: Mock to return `false` (for happy path) or `true` (to test exit).




* **`../../services/llmService`:**
* 
`llm.generate`: Mock to return a predictable string (e.g., "Mocked AI Summary") to verify integration without API calls.





## 2. Test Scenarios

| Category | Scenario Name | Description | Expected Outcome |
| --- | --- | --- | --- |
| **Happy Path** | **Full Generation** | `layers` dir exists, contains 1 layer with `package.json` and `test.ts`. User selects both. | Report file written. `package.json` has description. `.ts` has "Mocked AI Summary". |
| **Happy Path** | **Recursive Scan** | A layer contains a nested directory with a matching file. | Nested file is found, processed, and added to the report. |
| **Edge Case** | **Empty Layer** | `layers` dir exists but a specific layer folder is empty. | Report generated containing "No matching files found" for that layer.

 |
| **Edge Case** | **Invalid JSON** | `package.json` contains malformed syntax. | Output contains "(Invalid JSON)".

 |
| **Edge Case** | **Large Markdown** | `.md` file has 50 lines. | Output contains first 20 lines followed by "... (truncated)".

 |
| **Error State** | **Missing Root** | `layers` directory does not exist. | `consola.warn` called. Function returns early. No file written.

 |
| **Error State** | **User Cancel** | User presses Cancel at `multiselect`. | Function returns early. No file written.

 |
| **Error State** | **LLM Failure** | `llm.generate` throws an error. | Output contains "(AI Summarization failed due to API limit or network)".

 |

## 3. Test Data Requirements

**Virtual File System (Mock Data for `fs.readdirSync` and `fs.readFileSync`):**

```typescript
// Mock Directory Structure
const mockStructure = {
  'root/layers': ['auth-layer', 'ui-layer'],
  'root/layers/auth-layer': ['package.json', 'server'],
  'root/layers/auth-layer/server': ['middleware.ts'],
  'root/layers/ui-layer': ['README.md']
};

// Mock File Contents
const mockFileContents = {
  'package.json': JSON.stringify({ description: "Auth Layer Logic" }),
  'middleware.ts': "export default defineEventHandler(() => { return 'auth'; })",
  'README.md': Array(25).fill("Line of text").join("\n"), // To test truncation
  'malformed.json': "{ 'invalid': " // To test JSON error handling
};

```

**Mock User Input (`multiselect`):**

```typescript
const userSelection = ['package.json', '.ts', '.md'];

```