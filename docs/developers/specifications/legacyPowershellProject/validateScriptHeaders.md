Based on the provided source code, here is the comprehensive Technical Specification and Test Strategy.

# Technical Specification: `validateScriptHeaders.ps1`

## Part 1: Operational & Design Specification

### 1. Component Overview

* **Purpose:** This component is a DevOps utility script designed to standardize source code documentation headers across a TypeScript/Vue monorepo. It ensures consistency in metadata (Project, File Path, Author, Version) and validates configuration file naming.
* **Role in System:** It functions as a **Maintenance & Compliance Tool**, likely intended to be run manually by developers or automatically via CI/CD pipelines (e.g., pre-commit hooks) before code is merged. It operates on the file system layer, modifying source files in place.

### 2. Architecture & Patterns

* **Design Patterns:**
* **Modular Scripting:** The script strictly separates concerns by importing external logic libraries (`logger`, `paths`, `fileSystem`, etc.).
* **Pipeline Processing:** It follows a sequential extract-transform-load (ETL) pattern: Discover Files  Parse Content  Transform Headers  Atomic Write.
* **Global State (Reporting):** It uses a global accumulator (`$global:OperationReport`) to collect execution metrics across iterations.


* **State Management:**
* **Transient/Stateful Execution:** The script is technically stateful during execution, maintaining configuration flags (`$Debug`, `$Log`) and the reporting queue. It does not persist state to disk other than log files.


* **Complexity Assessment:** **Medium**.
* *Justification:* While the control flow is linear, the script utilizes compiled Regular Expressions for multi-line parsing and relies on dynamic path resolution logic. It also handles atomic file operations to prevent data corruption.



### 3. Dependency Graph

* **Internal Dependencies (Custom Utilities):**
The script explicitly sources the following siblings from the `utilities/` directory:
* `logger.ps1` (Logging abstraction)
* `showMenu.ps1` (Interactive UI)
* `paths.ps1` (Path calculation logic)
* `fileSystem.ps1` (Atomic IO operations, file discovery)
* `project.ps1` (Project context logic).


* **External Dependencies:**
* **PowerShell Core (pwsh):** The runtime environment.
* **.NET Framework:** Specifically `System.Text.RegularExpressions.Regex` for parsing.


* **Coupling Analysis:**
* **Tight Coupling:** The script is tightly coupled to the specific regex format of the header blocks. Any change in the header standard requires a code change here. It is also tightly coupled to the `utilities` folder structure.



### 4. Data Types & Interfaces

Since PowerShell is dynamically typed, the following are the implied types and contracts used.

* **Key Data Structures:**
* **`FileItem`**: A `.NET` `System.IO.FileInfo` object representing source files.
* **`OperationReport` Entry**:
```powershell
[PSCustomObject]@{
    "File"    = [string] # Relative path
    "Action"  = [string] # e.g., "Updated", "Error"
    "Details" = [string] # Description of change
}

```




* **Public/Script Parameters:**
* `Log` (`[switch]`): Boolean flag for file logging.
* `Debug` (`[switch]`): Boolean flag for verbose output.
* `SkipMenu` (`[switch]`): Boolean flag for headless execution.



### 5. Functional Logic Specification

#### `Process-SourceFile`

* **Signature:** `Process-SourceFile(fileItem: FileInfo, projectName: string, rootPath: string): void`
* **Logic Flow:**
1. Calculates the relative path of the file for display/header insertion.
2. Reads raw file content (UTF8).
3. **Regex Replacement (Header Fields):**
* Finds `@project:` tag and updates the value to `projectName`.
* Finds `@file:` tag and updates it to the calculated relative path.
* Finds `@author:` tag and forces the value to `"Steve R Lewis"` (**Warning:** Hardcoded logic).


4. **Version Logic:**
* Scans the history block for patterns matching `V\d+\.\d+\.\d+` (e.g., `V1.2.0`).
* Extracts the *first* match (assumed to be the latest entry).
* Compares this against the `@version:` tag. If they differ, updates the tag.


5. **Atomic Write:**
* If any changes occurred, calls `Set-ContentAtomic` to save the file.
* Logs the update and adds an entry to the global report.




* **Side Effects:** Modifies file content on disk.
* **Error Handling:** Catches IO exceptions, logs them via `Log-Error`, and adds an "Error" entry to the report.

#### `Validate-PackageJson`

* **Signature:** `Validate-PackageJson(path: string, expectedName: string, rootPath: string): void`
* **Logic Flow:**
1. Reads and parses `package.json` as a JSON object.
2. Checks if the `name` property matches the `expectedName` derived from the folder structure.
3. If mismatch: updates the property, re-serializes to JSON (Depth 10), and performs an atomic write.


* **Side Effects:** Modifies `package.json`.
* **Error Handling:** Catches JSON parsing errors, logs them, and reports "JSON Invalid".

#### `Main Execution Block`

* **Logic Flow:**
1. Imports utilities; halts execution if any are missing.
2. Compiles Regex objects (Optimization).
3. Shows interactive menu (unless `$SkipMenu` is set) to toggle Logging/Debug.
4. Initializes Logger.
5. Scans for project files (extensions `.ts`, `.vue`) excluding `node_modules`.
6. Iterates through files:
* Determines project context (`@monorepo/layer` vs `root-app`).
* Dispatches to `Validate-PackageJson` or `Process-SourceFile`.


7. Displays summary table and stops logger.



---

## Part 2: Appendix - Testing Reference

### 1. Mocking Strategy

To unit test this script using Pester, the following dependencies must be mocked to avoid touching the actual file system.

* **FileSystem Mocks:**
* `Get-Content`: Must mock returning file contents with various header states.
* `Set-ContentAtomic` (Utility): Mock to verify it is called with the *correct transformed content*.
* `Get-ProjectSourceFiles` (Utility): Mock to return a controlled list of `FileInfo` objects.
* `Test-Path`: Mock to simulate existence of utility scripts.


* **Utility Mocks:**
* `Get-RelativePath`: Stub to return deterministic paths (e.g., `src/utils/test.ts`).
* `Get-FileProjectContext`: Stub to return specific project names (e.g., `nuxt-app`).


* **Environment Variables:**
* `$PSScriptRoot`: Must be mocked to point to a test fixture directory.



### 2. Test Scenarios

| Category | Scenario | Input Condition | Expected Result |
| --- | --- | --- | --- |
| **Happy Path** | **Header Update** | File has old path and old version in header. History block has new version `V1.1.0`. | Script updates `@file` and `@version`. `Set-ContentAtomic` is called. |
| **Happy Path** | **No Change** | File header matches path, project, and latest history version. | Script detects no changes. `Set-ContentAtomic` is **not** called. |
| **Happy Path** | **Package JSON** | `package.json` name matches expected folder context. | No write operation. |
| **Edge Case** | **Author Override** | File contains `@author: John Doe`. | Script overwrites with `Steve R Lewis` (as per current hardcoding). |
| **Edge Case** | **No History** | Header exists, but no `V#.#.#` entries in comments. | Version logic skips update (does not crash). |
| **Edge Case** | **Empty File** | File is 0 bytes. | Script returns early, no errors. |
| **Error State** | **Invalid JSON** | `package.json` contains syntax error (comma missing). | `Validate-PackageJson` catches error, logs "JSON Invalid" to report. |
| **Error State** | **Write Lock** | File is locked by another process during `Set-ContentAtomic`. | Exception caught, logged as "Error" in summary. |
| **Error State** | **Missing Util** | `utilities/logger.ps1` is missing. | Script exits with Exit Code 1. |

### 3. Test Data Requirements

**A. Sample TypeScript Content (Before)**

```typescript
/**
 * @project:    old-project-name
 * @file:       wrong/path/file.ts
 * @version:    1.0.0
 * @author:     Jane Doe
 *
 * V1.2.0, 20251203
 * Added new feature.
 */
export const x = 1;

```

**B. Sample TypeScript Content (Expected After)**

```typescript
/**
 * @project:    nuxt4-monorepo-base-app
 * @file:       src/actual/file.ts
 * @version:    1.2.0
 * @author:     Steve R Lewis
 *
 * V1.2.0, 20251203
 * Added new feature.
 */
export const x = 1;

```

**C. Invalid Package JSON**

```json
{
  "name": "wrong-name"
  "version": "1.0.0" 
}
// Missing comma after name

```