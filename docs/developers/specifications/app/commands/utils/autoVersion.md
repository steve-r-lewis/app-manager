Based on the analysis of the provided source code, here is the detailed Technical Specification Document and Test Strategy.

### Part 1: Operational & Design Specification

#### 1. Component Overview

* 
**Purpose:** The `autoVersion` module is a CLI-based utility designed to automate the Semantic Versioning (SemVer) of source code files (`.ts` and `.vue`). It analyzes Git diffs to detect changes, utilizes an LLM (Large Language Model) to determine the appropriate version increment (Major, Minor, or Patch) and generate a commit note, and automatically updates the file header with the new version and history log.


* 
**Role in System:** This component functions as a **DevOps/Maintenance Utility** within the `app-manager` project. It sits above the file system and Git layer, interacting with the `llmService` to inject intelligence into the versioning process.



#### 2. Architecture & Patterns

* **Design Patterns:**
* 
**Facade Pattern:** The module uses `simple-git` as a facade to interact with the underlying Git binary.


* 
**Adapter/Wrapper:** The `llmService` is used to abstract the complexity of the AI provider.


* **Procedural Execution:** The logic is primarily script-based, executing a linear sequence of checks, prompts, and file operations.


* **State Management:**
* **Stateless Logic:** The functions themselves do not maintain memory state between executions.
* 
**Stateful Side-Effects:** The component heavily modifies the external state (File System content and Git status implicitly).




* **Complexity Assessment:** **Medium**.
* While the control flow is linear, the complexity arises from the integration of asynchronous I/O (`fs`, `git`), User Interface (`clack/prompts`), and external non-deterministic services (`llmService`).
* Error handling logic relies on try-catch blocks within loops, which requires careful testing to prevent silent failures.





#### 3. Dependency Graph

* **Internal Dependencies:**
* 
`../../services/llmService`: Used for generating semantic analysis of code changes.




* **External Dependencies:**
* 
`simple-git`: For Git diff and status operations.


* 
`fs` (Node.js): For synchronous file reading and writing.


* 
`path` (Node.js): For resolving file paths.


* 
`@clack/prompts`: For interactive CLI elements (spinners, confirmation dialogs).


* 
`consola`: For structured logging.


* 
`picocolors`: For terminal string styling.




* **Coupling Analysis:** **Tightly Coupled**.
* The module is tightly coupled to a specific file header format (JSDoc style with `@version` and `@notes` tags) defined by regex constants. It cannot operate on files lacking this specific metadata structure.





#### 4. Data Types & Interfaces

* **Key Interfaces:**
* `VersionAnalysis`: Defines the structure of the LLM response.
```typescript
interface VersionAnalysis {
    increment: 'Major' | 'Minor' | 'Patch';
    note: string;
}

```







* **Return Types:**
* 
`incrementVersion(version: string, type: 'Major' | 'Minor' | 'Patch'): string`.


* 
`sanitizeJson(str: string): string`.


* 
`autoVersion(targetRoot: string): Promise<void>` (Implicit return type based on async function structure).





#### 5. Functional Logic Specification

**A. Helper: `incrementVersion**`

* **Signature:** `(version: string, type: 'Major' | 'Minor' | 'Patch') => string`
* **Logic Flow:**
1. Strips leading 'v' or 'V' from the input string.


2. Splits string by `.` and maps to numbers.


3. 
**Validation:** If parts are NaN or length < 3, returns original version (Fail-safe).


4. **Increment:**
* 
**Major:** Increments index 0; resets 1 and 2 to 0.


* 
**Minor:** Increments index 1; resets 2 to 0.


* 
**Patch:** Increments index 2.




5. 
**Return:** Joins parts with `.`.





**B. Main: `autoVersion**`

* **Signature:** `async (targetRoot: string) => Promise<void>`
* **Logic Flow:**
1. 
**Git Initialization:** Instantiates `simpleGit` at `targetRoot`.


2. 
**Discovery:** Fetches list of modified files matching `.ts` or `.vue` extension.


* 
*Exit:* If no files found, logs info and returns.




3. **User Confirmation:** Prompts user to proceed. Exits on cancel/rejection.


4. 
**Iteration:** Loops through candidate files.


* **Read:** Reads file content. Catches read errors and continues to next file.


* **Header Check:** Validates existence of `@version` and `@notes` regex matches. Skips if missing.


* 
**Diff extraction:** Retrieves specific git diff for the file.


* **LLM Analysis:**
* Constructs prompt with diff .


* Calls `llm.generate`. Parses JSON output.


* 
*Fallback:* On JSON parse or API error, defaults to `increment: 'Patch'`.




* 
**Computation:** Calculates `newVer` and generates timestamped `historyEntry` .


* 
**Modification:** Performs string replacement on content to update version and append history.


* 
**Write:** Writes updated content back to disk using `fs.writeFileSync`.




5. 
**Completion:** Logs total count of updated files.




* **Side Effects:**
* Modifies file contents on disk (destructive write).


* Consumes LLM API tokens.


* Outputs to stdout via `consola` and `@clack/prompts`.


* **Error Handling:**
* **File Read/Write:** Wrapped in `try/catch`. Failures result in skipping the file (Read) or are unhandled (Write - `writeFileSync` is not in a try-block in source 25, though the surrounding loop has logic). Note: The source code shows `try/catch` around `readFileSync` and `llm.generate` , but `writeFileSync`  appears outside the specific try/catch blocks shown in the snippet.





---

### Part 2: Appendix - Testing Reference

#### 1. Mocking Strategy

To achieve high unit test coverage, the following dependencies must be mocked/stubbed:

* **`simple-git`:**
* Mock `diff` to return strings of file names or diff content.
* Mock `status` if utilized in future logic.


* **`fs`:**
* Mock `readFileSync` to return prepared file strings (with and without valid headers).
* Mock `writeFileSync` to verify the output without writing to the actual disk.


* **`@clack/prompts`:**
* Mock `confirm` to return `true` (proceed) or `false` (cancel).
* Mock `spinner` methods (`start`, `stop`) to avoid cluttering test output.


* **`../../services/llmService`:**
* Mock `llm.generate` to return specific JSON strings (e.g., `{"increment": "Minor", "note": "Added feature"}`).
* Mock it to throw errors to test fallback logic.



#### 2. Test Scenarios

| Category | Scenario Name | Description | Expected Outcome |
| --- | --- | --- | --- |
| **Happy Path** | Standard Minor Update | User confirms; File has valid header; LLM returns "Minor". | File version bumps `1.0.0` -> `1.1.0`; History appended; Write invoked. |
| **Happy Path** | Patch Update | User confirms; LLM returns "Patch". | File version bumps `1.0.1` -> `1.0.2`. |
| **Happy Path** | Major Update | User confirms; LLM returns "Major". | File version bumps `1.2.3` -> `2.0.0`. |
| **Edge Case** | No Files Changed | `git diff` returns empty string. | Log "No modified... found"; Function exits early. |
| **Edge Case** | User Cancellation | User selects "No" at confirmation prompt. | Function exits without modifying files. |
| **Edge Case** | Invalid Header | File content missing `@version` or `@notes`. | File skipped; Loop continues to next file. |
| **Edge Case** | No Git Diff | File exists but `git diff` returns empty for specific file. | File skipped. |
| **Error State** | LLM Failure | `llm.generate` throws error or returns malformed JSON. | Logs warning; Defaults to **Patch** increment; File updates. |
| **Error State** | File Read Error | `fs.readFileSync` throws error (e.g., permission). | Error caught; File skipped. |
| **Error State** | Write Error | `fs.writeFileSync` throws error (e.g., read-only). | Exception propagates (Function fails for that file). |

#### 3. Test Data Requirements

**A. Sample Source File Content (Valid)**

```typescript
/**
 * @file:       test.ts
 * @version:    1.2.3
 * @notes: Revision History
 * V1.2.3, 20250101-1200
 * Previous note.
 */
export const a = 1;

```

**B. Sample LLM Response (JSON)**

```json
{
  "increment": "Minor",
  "note": "Added validation logic."
}

```

**C. Sample Git Diff Output**

```diff
diff --git a/test.ts b/test.ts
index 83db48f..f735c32 100644
--- a/test.ts
+++ b/test.ts
@@ -10,4 +10,5 @@
+ export const newFeature = () => { return true; }

```