# Part 1: Operational & Design Specification

## 1. Component Overview

* **Purpose:** `nuxtManager.ps1` serves as an interactive CLI orchestration utility designed to automate the maintenance lifecycle of a Nuxt 4 monorepo. Its primary functions are to sanitize the development environment (cleaning build artifacts and caches) and bootstrap the project (installing dependencies via `pnpm`).
* **Role in System:**
* **DevOps Utility:** It operates outside the runtime application logic, serving as a developer experience (DX) tool and CI/CD helper.
* **Orchestrator:** It acts as a central entry point that delegates specific low-level tasks (logging, file system manipulation, project scanning) to shared utility modules.



## 2. Architecture & Patterns

* **Design Patterns:**
* **Module Pattern:** The script relies on importing external logic blocks (`.ps1` files) from a `utilities` directory, promoting code reuse.
* **Facade Pattern:** It provides a simplified user interface (menu system) that abstracts complex underlying file system operations and shell commands.
* **Procedural Execution with Functional Blocks:** The script is primarily procedural but encapsulates distinct workflows (`Clean`, `Reset`, `CleanCache`) into isolated functions.


* **State Management:**
* **Semi-Stateful:** The script utilizes Global Scope modification (`$global:DebugMode`, `$global:LogMode`) to persist configuration choices made in the menu across the lifecycle of the script execution and into imported modules.
* **FileSystem State:** It directly mutates the state of the file system (deletion of directories/files).


* **Complexity Assessment:** **Low to Medium**
* The control flow is linear (Setup → Menu → Switch → Execute → Teardown).
* Complexity is introduced via the dependency on external utility scripts and the requirement to handle PowerShell's dynamic array unrolling behavior (specifically addressed in `Invoke-Clean` and `Invoke-CleanCache`).



## 3. Dependency Graph

### Internal Dependencies

The script strictly requires the following files to exist in a `./utilities/` subdirectory relative to the script root:

1. **`logger.ps1`**: Handles output formatting (Info, Debug, Success, Error) and file logging.
2. **`showMenu.ps1`**: Renders interactive CLI menus.
3. **`fileSystem.ps1`**: Wraps file deletion logic (`Remove-FileOrFolder`).
4. **`project.ps1`**: specific logic for identifying project artifacts (`Get-ProjectArtifacts`, `Test-ProjectRoot`).

### External Dependencies

1. **PowerShell Core (pwsh):** The runtime environment.
2. **pnpm:** The Node.js package manager is explicitly required for the `Invoke-Reset` function.
3. **System.IO:** Implicit .NET usage via PowerShell cmdlets (`Get-ChildItem`, `Test-Path`).

### Coupling Analysis

* **Tightly Coupled:** The script is tightly coupled to the `utilities` folder structure. If the `utilities` folder or its contents are missing, the script executes a "FATAL" exit immediately.
* **Tool Coupled:** It has a hard dependency on `pnpm`. Replacing the package manager would require code changes in `Invoke-Reset`.

## 4. Data Types & Interfaces

While PowerShell is dynamically typed, the script enforces strict mode (`Set-StrictMode -Version Latest`).

### Key Interfaces (Implicit Signatures)

The script expects the imported utilities to provide specific cmdlets.

| Function | Expected Parameters | Expected Return Type |
| --- | --- | --- |
| `Get-ProjectArtifacts` | `-RootPath <String>`, `-ArtifactDirs <Array>`, `-ArtifactFiles <Array>` | `System.IO.FileSystemInfo[]` (File/Directory Objects) |
| `Remove-FileOrFolder` | `-Path <String>` | `void` (Output is piped to Null) |
| `Show-Menu` | `-Title <String>`, `-Options <Array>`, `-MultiSelect <Bool>` | `String` or `Array<String>` |
| `Initialize-Logger` | `-LogToFile <Bool>`, `-DebugMode <Bool>` | `void` |

### Return Types

* **`Invoke-Clean`**: `void` (Side effect: Filesystem deletion, Console Output).
* **`Invoke-Reset`**: `void` (Side effect: Shell execution, Console Output).
* **`Invoke-CleanCache`**: `void` (Side effect: Filesystem deletion, Console Output).
* **Main Script**: Returns Exit Code `0` (Success) or `1` (Failure).

## 5. Functional Logic Specification

### 5.1 `Invoke-Clean`

* **Signature:** `Invoke-Clean(): void`
* **Logic Flow:**
1. Logs start of operation.
2. Calls `Get-ProjectArtifacts` with the current root path.
3. **Critical Logic:** Wraps the result in `@(...)` to ensure a scalar result (single file found) is treated as an array.
4. Checks count; if 0, returns early.
5. Iterates through artifacts and calls `Remove-FileOrFolder` for each.
6. Logs success count.


* **Side Effects:** Permanently deletes files/folders identified as artifacts.
* **Error Handling:** Relies on `$ErrorActionPreference = "Stop"` to halt on filesystem permission errors.

### 5.2 `Invoke-CleanCache`

* **Signature:** `Invoke-CleanCache(): void`
* **Logic Flow:**
1. Calls `Get-ProjectArtifacts` specifically targeting `.nuxt` directories only.
2. Performs a manual `Get-ChildItem` recursive scan for directories named `.cache` inside `node_modules`.
3. Combines both result sets into a single array `$allTargets`.
4. Iterates and calls `Remove-FileOrFolder`.


* **Side Effects:** Deletes `.nuxt` folders and `node_modules/.cache` folders.

### 5.3 `Invoke-Reset`

* **Signature:** `Invoke-Reset(): void`
* **Logic Flow:**
1. **Prerequisite Check:** Uses `Get-Command` to verify `pnpm` exists. Throws if missing.
2. Executes `& pnpm install`.
3. Checks `$LASTEXITCODE`. If not `0`, throws an exception.


* **Side Effects:** Modifies `node_modules` via pnpm.
* **Error Handling:** Catches execution errors and re-throws them for the main `catch` block to handle.

### 5.4 Main Execution

* **Logic Flow:**
1. **Import:** Validates existence of utility scripts. Exits `1` if missing.
2. **Safety:** Calls `Test-ProjectRoot` (External utility) to ensure the script is running in a valid location.
3. **Configuration (Interactive):**
* If `$SkipMenu` is False: Displays configuration menu (Log/Debug). Updates global variables.
* Displays Action menu (Clean, Reset, etc.).


4. **Configuration (Automated):** If `$SkipMenu` is True, defaults to "Clean & Reset".
5. **Initialization:** Starts the Logger.
6. **Switch Dispatch:** Executes the function corresponding to the user selection.
7. **Teardown:** Stops the logger in the `finally` block.



---

# Part 2: Appendix - Testing Reference

## 1. Mocking Strategy

Since this is a PowerShell script, testing requires a framework like **Pester**. The following dependencies must be mocked to isolate the logic of `nuxtManager.ps1`.

### Services to Mock

| Dependency | Purpose of Mock | Mock Behavior Requirements |
| --- | --- | --- |
| **`Get-ProjectArtifacts`** | Simulate finding build artifacts. | Return an empty array ` @()` for "Clean" state.<br>

<br>Return `@(Item1, Item2)` for "Dirty" state.<br>

<br>Return a single item object to test scalar wrapping. |
| **`Remove-FileOrFolder`** | Prevent actual file deletion. | Should accept input and simply return `$true` or `void`. |
| **`Show-Menu`** | Bypass UI interaction. | Return specific strings based on the test case (e.g., return "Clean (Remove artifacts)"). |
| **`Test-ProjectRoot`** | Bypass root validation. | Return `$true` (or void) to allow script to proceed.<br>

<br>Throw error to test safety check failure. |
| **`Get-Command`** | Mock `pnpm` detection. | Return an object to simulate `pnpm` installed.<br>

<br>Throw/Return null to simulate `pnpm` missing. |
| **`& pnpm`** | Mock the external process. | Mock the alias/function `pnpm` to return `$null` and set `$LASTEXITCODE` to `0` (success) or `1` (fail). |

## 2. Test Scenarios

### Happy Path

| Scenario ID | Description | Inputs / Mock Data | Expected Result |
| --- | --- | --- | --- |
| **HP-01** | **Clean & Reset (Auto)** | `$SkipMenu = $true` | `Invoke-Clean` runs.<br>

<br>`Invoke-Reset` runs.<br>

<br>Exit Code: 0. |
| **HP-02** | **Manual Clean Selection** | User selects "Clean (Remove artifacts)" | `Invoke-Clean` runs.<br>

<br>`Invoke-Reset` is skipped.<br>

<br>Artifacts deleted. |
| **HP-03** | **Manual Config Toggle** | User selects "Enable Debug Mode", then "Quit" | Global `$DebugMode` is set to `$true`.<br>

<br>Script exits gracefully. |

### Edge Cases

| Scenario ID | Description | Inputs / Mock Data | Expected Result |
| --- | --- | --- | --- |
| **EC-01** | **Single Artifact Found** | `Get-ProjectArtifacts` returns 1 object (Scalar) | The script must successfully wrap it in an array and process it (reproducing the V1.2.1 fix). |
| **EC-02** | **No Artifacts Found** | `Get-ProjectArtifacts` returns `@()` | Script logs "System already clean" and does not attempt deletion. |
| **EC-03** | **No Cache Found** | No `.nuxt` or `.cache` folders exist | Script logs "No cache directories found". |

### Error States

| Scenario ID | Description | Inputs / Mock Data | Expected Result |
| --- | --- | --- | --- |
| **ER-01** | **Missing Utilities** | File `utilities/logger.ps1` deleted | Script prints "FATAL: Missing utility" and exits with Code 1. |
| **ER-02** | **PNPM Missing** | `Get-Command pnpm` throws error | `Invoke-Reset` throws "pnpm not found".<br>

<br>Main catch block logs error.<br>

<br>Exit Code 1. |
| **ER-03** | **PNPM Install Fails** | `pnpm install` sets `$LASTEXITCODE = 1` | `Invoke-Reset` throws exception.<br>

<br>Logger records fatal error.<br>

<br>Exit Code 1. |
| **ER-04** | **Safety Check Fail** | `Test-ProjectRoot` throws error | Script terminates immediately before menu or logic. |

## 3. Test Data Requirements

To simulate the filesystem objects expected by `Get-ProjectArtifacts` and `Get-ChildItem`, use `PSCustomObject` mocks in Pester:

```powershell
# Mock Data: File System Artifact
$MockArtifact = [PSCustomObject]@{
    FullName = "C:\Projects\Monorepo\.output"
    Name     = ".output"
}

# Mock Data: Node Modules Cache
$MockCacheDir = [PSCustomObject]@{
    FullName = "C:\Projects\Monorepo\node_modules\.cache"
    Name     = ".cache"
}

# Mock Data: Menu Selection
$MockMenuSelection_Clean = "Clean (Remove artifacts)"
$MockMenuSelection_Reset = "Reset (pnpm install)"

```