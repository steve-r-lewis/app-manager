Here is the comprehensive Technical Specification and Test Strategy document based on the reverse engineering of `validateHeaders.ts`.

---

# Technical Specification Document: Header & Manifest Validation Service

**Date:** 2026-01-10
**Version:** 2.1.0 (Derived)
**Subject:** `validateHeaders.ts` Analysis & Refactoring Guide

## Part 1: Operational & Design Specification

### 1. Component Overview

* **Purpose:** This component serves as a CLI-driven utility to enforce coding standards across the repository. It scans source files to ensure file headers (Project, File, Author, Version) match current Git metadata and directory structure. Additionally, it validates `package.json` naming conventions against the monorepo folder structure, offering interactive fix capabilities including AI-generated descriptions.


* **Role in System:** **CLI / Infrastructure Utility**. It functions as a maintenance script, likely invoked via a command-line interface (e.g., `npm run validate`) to ensure codebase hygiene before commits or builds.



### 2. Architecture & Patterns

* **Design Patterns:**
* 
**Procedural Execution:** The logic is primarily function-based rather than class-based.


* 
**Interactive CLI Pattern:** Uses a "Check-Pause-Prompt-Act" cycle, pausing execution when user input is required via `@clack/prompts`.


* 
**Strategy Pattern (Ad-hoc):** The validation logic switches strategies based on file type (Manifest JSON vs. Source Code).




* **State Management:**
* **Stateless logic:** The functions do not maintain state between executions.
* 
**Transient State:** The `walk` function maintains a recursive stack for directory traversal.




* **Complexity Assessment:** **Medium-High**.
* While the file manipulation is standard, the complexity stems from the **Interactive Interrupts** inside the main loop and the integration of **LLM services** for dynamic content generation, which introduces asynchronous non-determinism.





### 3. Dependency Graph

* **Internal Dependencies:**
* 
`../../services/llmService`: Used for generating `package.json` descriptions via AI.




* **External Dependencies:**
* 
`fs` (Node.js): File system read/write.


* 
`path` (Node.js): Path resolution and manipulation.


* 
`simple-git`: Fetching Git user configuration.


* 
`@clack/prompts`: Interactive CLI UI (spinner, select, text).


* 
`consola`: Logging and formatted output.


* 
`picocolors`: Terminal text coloring.




* **Coupling Analysis:** **Tightly Coupled**.
* The service is directly coupled to the file system structure (specifically `layers` folder logic)  and the specific implementation of `llmService`. It does not use Dependency Injection, making unit testing difficult without mocking module imports.





### 4. Data Types & Interfaces

**Critical Audit:** The code lacks explicit interfaces for parsed data, relying on `any` (implicit) types from `JSON.parse`.

* **Key Interfaces (Implicit):**
* 
*PackageJSON:* `{ name: string, description?: string }` (Derived from usage).


* 
*AIResponse:* `{ name: string, description: string }`.




* **Return Types:**
* 
`getGitAuthor(root)`: `Promise<string>`.


* 
`walk(dir, fileList)`: `string[]`.


* 
`resolveProjectName(filePath, targetRoot)`: `string`.


* 
`validatePackageManifest(filePath, targetRoot)`: `Promise<string[] | null>` (Returns `null` or a tuple array `['MISMATCH_NAME', expected, current]`).


* 
`processSourceFile(...)`: `Promise<string[] | null>` (Returns changes list or null).


* 
`validateHeaders(targetRoot)`: `Promise<void>`.





### 5. Functional Logic Specification

#### A. `walk(dir, fileList)`

* **Logic:** Recursive DFS (Depth First Search). Reads directory, ignores `EXCLUDE_DIRS` (`node_modules`, `.git`, etc.). Collects files matching `EXTENSIONS` or `package.json`.


* **Side Effects:** None (Read-only).

#### B. `processSourceFile(filePath, targetRoot, gitAuthor)`

* **Logic:**
1. Reads file content.
2. 
**Project:** Updates `@project` tag based on folder structure.


3. 
**Path:** Updates `@file` tag with relative path.


4. **Author:**
* If no author exists: Adds `@author` block with creation time.


* If authors exist but current Git user is missing: Appends current user to the list.




5. 
**Version:** Scans for regex `V(\d.\d.\d)` in comments (history) to find the "latest" version number and updates the main `@version` tag.




* 
**Side Effects:** Overwrites file content if changes are detected.



#### C. `validateHeaders(targetRoot)` (Main Entry)

* **Logic:**
1. Starts spinner and retrieves Git Author.


2. Iterates through all files found by `walk`.
3. **For `package.json**`:
* Checks name validity. If invalid (`MISMATCH_NAME`), pauses spinner.


* Prompts user: Auto, Manual, AI, or Skip.


* 
**AI Path:** Constructs prompt with context, calls `llm.generate`, parses JSON response, applies name/description .




4. **For Source Files**: Calls `processSourceFile`.
5. Logs total updates.




* **Error Handling:**
* Catches JSON parse errors in manifest validation (returns `['Invalid JSON']`).


* Catches AI generation failures and falls back to standard behavior.





---

## Part 2: Appendix - Test Strategy

### 1. Mocking Strategy

To enable unit testing, the following dependencies must be mocked via a framework (e.g., Vitest/Jest).

* **`fs` (Node Native):**
* *Mocking:* Use `memfs` or `vi.spyOn(fs, ...)` to simulate directory structures and file contents without touching the disk.
* *Behavior:* `readdirSync` must return specific structures to test recursion in `walk`.


* **`simple-git`:**
* *Mocking:* Mock the instance and the `raw` method.
* 
*Behavior:* Return "Test User" to verify author injection logic.




* **`@clack/prompts`:**
* *Mocking:* Critical. The test cannot hang on await `select(...)`.
* 
*Behavior:* Pre-program responses (e.g., mock `select` to resolve to 'ai' immediately) to test interactive flows headless.




* **`../../services/llmService`:**
* *Mocking:* Mock `llm.generate`.
* 
*Behavior:* Return a deterministic JSON string: `"{ \"name\": \"@monorepo/test\", \"description\": \"AI Desc\" }"`.





### 2. Test Scenarios

| Category | ID | Scenario Description | Expected Outcome |
| --- | --- | --- | --- |
| **Happy Path** | HP-01 | Source file with correct headers. | No changes, returns `null`. |
| **Happy Path** | HP-02 | `package.json` with correct name. | No changes, returns `null`. |
| **Logic** | LG-01 | File missing `@project` tag entirely. | Tag is **not** added (Code only updates *existing* tags).

 |
| **Logic** | LG-02 | `@version` tag is `1.0.0` but history shows `V2.0.0`. | <br>`@version` updates to `2.0.0`.

 |
| **Logic** | LG-03 | New author edits file. | New author appended to `@author` list.

 |
| **Interactive** | IA-01 | `package.json` name mismatch -> User selects 'Auto'. | Name updates to folder name automatically. |
| **Interactive** | IA-02 | `package.json` name mismatch -> User selects 'AI'. | Name & Description update from Mock LLM. |
| **Edge Case** | EC-01 | `package.json` contains invalid JSON. | Function returns `['Invalid JSON']` and skips safely.

 |
| **Edge Case** | EC-02 | AI Service throws error / times out. | Fallback logs error, file not updated with AI data.

 |
| **Edge Case** | EC-03 | File inside `node_modules`. | File is ignored by `walk`.

 |

### 3. Test Data Requirements

**A. Mock Source File (Pre-execution):**

```typescript
/**
 * @project:    old-name
 * @file:       wrong/path/file.ts
 * @author:     Original Dev
 * @version:    1.0.0
 *
 * History:
 * V2.0.0 2025-01-01 Refactor
 */
export const a = 1;

```

**B. Mock Package.json (Pre-execution):**

```json
{
  "name": "wrong-name",
  "version": "0.0.1"
}

```

**C. Mock LLM Response (String):**

```json
{
  "name": "@monorepo/auth",
  "description": "Handles user authentication and session management."
}

```