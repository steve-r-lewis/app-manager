# Part 1: Operational & Design Specification

## 1. Component Overview

* **Purpose:** `updateFileVersion.ps1` is an automated DevOps utility designed to enforce Semantic Versioning (SemVer) on source files. It leverages an active Large Language Model (LLM) to analyze Git diffs, determine the nature of changes (Patch/Minor/Major), and automatically update file headers with the new version and a timestamped revision history entry.
* **Role in System:**
* **Category:** DevOps/Build Tooling (Local Development Context).
* **Function:** Acts as an Orchestrator. It bridges the gap between Version Control (Git), Generative AI (LLM Service), and the File System to standardize documentation and versioning across the monorepo.



## 2. Architecture & Patterns

* **Design Patterns:**
* **Module Pattern:** Utilizes dot-sourcing (`. $scriptPath`) to import specialized functionality (Logger, LLM, FileSystem, SemVer).
* **Orchestrator Pattern:** The script functions as a central controller, delegating specific business logic (diff analysis, version calculation, file writing) to helper modules while managing the overall workflow.
* **Interactive CLI:** Implements a user-interactive loop for confirmation steps (unless bypassed via flags).


* **State Management:**
* **Stateful (Execution Context):** Maintains global flags (`$global:DebugMode`, `$global:LogMode`) for the duration of the script execution.
* **Stateless (File Processing):** The `Process-File` function processes files independently; no state is shared between file iterations other than the logger.


* **Complexity Assessment:** **Medium**.
* *Justification:* While the control flow is linear, the script manages external process execution (Git), asynchronous API concepts (LLM throttling/calls), and complex string manipulation (Regex injection), requiring careful error handling and atomic file operations.



## 3. Dependency Graph

### Internal Dependencies (Utilities)

The script relies on the following custom modules located in `~/scripts/powershell/utilities/`:

1. `logger.ps1`: Standardized logging output.
2. `llm.ps1`: Core LLM API interaction logic.
3. `llm-messages.ps1`: Message formatting for the LLM.
4. `fileSystem.ps1`: Handles atomic file writes (`Set-ContentAtomic`).
5. `semver.ps1`: Logic for incrementing versions (`Get-NextVersion`).
6. `showMenu.ps1`: UI for interactive console selection.
7. `project.ps1`: Validates project root context (`Test-ProjectRoot`).

### External Dependencies

1. **Git:** Required for `git diff` commands to fetch code changes.
2. **PowerShell Core (pwsh):** The runtime environment.

### Coupling Analysis

* **Tight Coupling:** The script is tightly coupled to a specific file header format. It explicitly parses `@version:` and `@notes: Revision History`. If the source file header format changes, this script will fail.
* **Loose Coupling:** The specific LLM implementation is abstracted behind `Get-LLM-VersionAnalysis` and `Initialize-LLM`, allowing the provider to change without refactoring this script.

## 4. Data Types & Interfaces

As a PowerShell script, types are often dynamic. Below are the implicit interfaces enforced by the logic.

### Key Interfaces (Implicit)

**1. LLM Analysis Result**

* *Source:* Returned by `Get-LLM-VersionAnalysis`
* *Structure:*
```powershell
@{
    increment = [string] # "patch", "minor", or "major"
    note      = [string] # Summary of changes for the changelog
}

```



**2. Script Parameters**

* `$Debug` [Switch]: Enables verbose output.
* `$Log` [Switch]: Enables file-based logging.
* `$SkipMenu` [Switch]: Bypasses initial configuration menu.
* `$All` [Switch]: Bypasses per-file confirmation prompts.

### Return Types & Warnings

| Method / Function | Return Type | Warning |
| --- | --- | --- |
| `Process-File` | `void` | Relies on side effects (File I/O). Returns implicit `null` on early exit. |
| `Main Execution` | `void` | `exit 1` on initialization failure. |

## 5. Functional Logic Specification

### Function: `Process-File`

* **Signature:** `Process-File -FilePath <String>`
* **Logic Flow:**
1. **Extract Name:** Derives leaf filename.
2. **Diff Extraction:** Executes `git diff HEAD -- $FilePath`.
* *Check:* If diff is empty, log warning and **return**.


3. **AI Analysis:**
* Throttles execution (`Start-Sleep 500ms`).
* Calls `Get-LLM-VersionAnalysis -Diff $diff`.
* *Check:* If analysis is null, log error and **return**.


4. **File Read:** Reads content as UTF8 raw string.
5. **Version parsing:**
* Regex match using pattern `(@version:\s*)([vV]?\d+\.\d+\.\d+)`.
* *Check:* If no match, log error and **return**.


6. **Version Calculation:** Calls `Get-NextVersion` using the current version and the AI-suggested increment type.
7. **User Approval (Interactive):**
* If `$All` is False, invoke `Show-Menu`.
* Options: "Apply Update", "Skip", "Quit".


8. **Content Modification:**
* **Header:** Regex replace current version with new version.
* **History:** Generate timestamped string (`V1.1.0, 20251208-00:10 \n - Note`).
* Regex replace `@notes: Revision History` to inject new entry immediately after match.


9. **Atomic Save:** Calls `Set-ContentAtomic` if content changed.


* **Side Effects:**
* Modifies file content on disk.
* Consumes LLM API quota.


* **Error Handling:**
* Silent returns on missing regex matches (logs error).
* Stops execution on FileSystem errors (via `$ErrorActionPreference = "Stop"`).



### Main Execution Block

* **Logic Flow:**
1. **Setup:** Imports utilities, sets global debug/log flags.
2. **Initialization:** Runs `Initialize-Logger` and `Initialize-LLM`.
3. **Git Scan:** Runs `git diff --name-only ... HEAD` filtering for `.ts` and `.vue` files.
4. **Loop:** Iterates through `modifiedFiles` and calls `Process-File`.
5. **Cleanup:** Calls `Stop-Logger`.



---

# Part 2: Appendix - Testing Reference

## 1. Mocking Strategy

To unit test this script without side effects (modifying files or calling paid APIs), the following dependencies must be mocked.

| Dependency / Command | Mock Behavior |
| --- | --- |
| **`git`** | **Mandatory.** Must return specific strings for `diff` commands. <br>

<br> 1. `git diff HEAD -- file.ts`: Return a standard diff string. <br>

<br> 2. `git diff --name-only...`: Return a list of file paths. |
| **`Get-LLM-VersionAnalysis`** | **Mandatory.** Mock to return a valid Hashtable: `@{ increment = "minor"; note = "Fixed bug" }` to avoid calling actual AI. |
| **`Get-NextVersion`** | Mock to ensure version math is isolated. Example: Input `1.0.0` + `minor` returns `1.1.0`. |
| **`Show-Menu`** | Mock to bypass interactivity during automated testing. Return "Apply Update" or "Skip" depending on test case. |
| **`Get-Content`** | Mock to return a "Virtual File" string containing valid headers (`@version`, `@notes`). |
| **`Set-ContentAtomic`** | Mock to verify it was called with the expected transformed string. |
| **`Test-ProjectRoot`** | Mock to return `$true` so tests run outside actual project root. |

## 2. Test Scenarios

### A. Happy Path

| ID | Scenario | Description | Expected Outcome |
| --- | --- | --- | --- |
| **HP-01** | **Standard Update** | - File exists and is modified.<br>

<br>- Header present.<br>

<br>- LLM returns "patch".<br>

<br>- User selects "Apply". | - `@version` increments.<br>

<br>- Revision history updated.<br>

<br>- `Set-ContentAtomic` called. |
| **HP-02** | **Batch Mode** | - Argument `-All` is passed.<br>

<br>- Multiple modified files. | - All files processed without `Show-Menu` prompting.<br>

<br>- All files saved. |

### B. Edge Cases

| ID | Scenario | Description | Expected Outcome |
| --- | --- | --- | --- |
| **EC-01** | **New/Untracked File** | `git diff` returns empty string (new file staged but not committed previously, or untracked). | Log "No diff found". Function returns early. No file write. |
| **EC-02** | **Missing Version Header** | File content lacks `@version: x.x.x`. | Log Error "Could not find @version". No file write. |
| **EC-03** | **Missing History Block** | File has `@version` but lacks `@notes: Revision History`. | Version updates, but history injection logs Warning and is skipped. File saves with version update only. |
| **EC-04** | **No TS/Vue Changes** | `git diff --name-only` returns `.md` or `.json` files only. | Script exits with "No modified TypeScript or Vue files found." |

### C. Error States

| ID | Scenario | Description | Expected Outcome |
| --- | --- | --- | --- |
| **ERR-01** | **LLM Failure** | `Get-LLM-VersionAnalysis` returns `$null` (API down/timeout). | Log Error "AI Analysis failed". File is not modified. |
| **ERR-02** | **Utility Missing** | One of the utility scripts in `utilities/` is deleted. | Script exits immediately with `FATAL: Missing utility...` (exit code 1). |

## 3. Test Data Requirements

**1. Mock File Content (Input)**

```typescript
/**
 * @file:       ~/src/components/Test.vue
 * @version:    1.0.0
 * @author:     Dev
 *
 * @notes: Revision History
 * V1.0.0, 20250101-1200
 * Initial release
 */
export const test = () => {};

```

**2. Mock Git Diff (Input)**

```diff
diff --git a/src/components/Test.vue b/src/components/Test.vue
index 8234...9234 100644
--- a/src/components/Test.vue
+++ b/src/components/Test.vue
@@ -10,1 +10,1 @@
- export const test = () => {};
+ export const test = (name: string) => { console.log(name); };

```

**3. Mock LLM Response (Input)**

```powershell
@{
    increment = "minor"
    note      = "Added name parameter to test function for better logging."
}

```

**4. Expected File Content (Output)**
*Note: Date will vary based on execution time.*

```typescript
/**
 * @file:       ~/src/components/Test.vue
 * @version:    1.1.0
 * @author:     Dev
 *
 * @notes: Revision History
 * V1.1.0, 20260109-2330
 * Added name parameter to test function for better logging.
 *
 * V1.0.0, 20250101-1200
 * Initial release
 */
export const test = (name: string) => { console.log(name); };

```