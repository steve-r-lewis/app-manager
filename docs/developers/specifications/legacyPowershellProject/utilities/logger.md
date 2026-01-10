Based on the analysis of the provided PowerShell script `logger.ps1`, here is the comprehensive Technical Specification and Test Strategy.

---

# Part 1: Operational & Design Specification

## 1. Component Overview

* **Purpose:** `logger.ps1` serves as a reusable operational logging utility designed to standardize console output and manage file-based transcription for automation scripts.
* **Role in System:**
* **Utility / Infrastructure Layer:** It acts as a supporting library for DevOps, build, or deployment scripts (likely within the `nuxt4-monorepo-base-app` context).
* **Cross-Cutting Concern:** It handles observability (logging, debugging, output formatting) for consuming scripts.



## 2. Architecture & Patterns

* **Design Patterns:**
* **Module/Library Pattern:** The file is structured as a library of functions to be dot-sourced (`. ./logger.ps1`), rather than a class-based object.
* **Global Singleton State:** It relies on global variables (`$global:DebugMode`) to maintain state across the execution session, effectively acting as a Singleton configuration once initialized.


* **State Management:**
* **Stateful:** The component maintains state via:
* `$global:DebugMode`: Determines if debug logs are visible.
* `$script:LoggingActive`: Tracks whether a file transcript is currently running.




* **Complexity Assessment:** **Low**. The logic is primarily conditional wrapping around standard PowerShell output and file system cmdlets.

## 3. Dependency Graph

* **Internal Dependencies:**
* **Standard PowerShell Cmdlets:** `Join-Path`, `Test-Path`, `New-Item`, `Resolve-Path`, `Get-Date`, `Start-Transcript`, `Stop-Transcript`, `Write-Host`, `Out-Null`.


* **External Dependencies:**
* None (No dependencies on third-party PowerShell modules or binary DLLs).


* **Coupling Analysis:**
* **Tight Coupling (FileSystem):** The script is tightly coupled to a specific directory structure. It hardcodes the log path relative to `$PSScriptRoot`: `../../../app-monitor/logs`. This reduces portability.



## 4. Data Types & Interfaces

While PowerShell is dynamically typed, the script uses explicit casting in parameters.

**Key Interfaces (Implicit):**

| Parameter | Data Type | Description |
| --- | --- | --- |
| `$LogToFile` | `[bool]` | Switch to enable file transcription. |
| `$DebugMode` | `[bool]` | Switch to enable verbose/debug output. |
| `$LogNamePrefix` | `[string]` | Prefix for the generated log filename. |
| `$Message` | `[string]` | The content to be logged. |
| `$Color` | `[ConsoleColor]` | The specific console color for the message. |

**Return Types:**

* **All Public Methods:** Effectively `void`. They output to the Host console or File System. They do not write objects to the pipeline (standard output is suppressed via `Out-Null` or `Write-Host` usage).

## 5. Functional Logic Specification

### `Initialize-Logger`

* **Signature:** `Initialize-Logger([bool]$LogToFile, [bool]$DebugMode, [string]$LogNamePrefix)`
* **Logic Flow:**
1. Sets `$global:DebugMode` to the provided `$DebugMode` value.
2. Initializes `$script:LoggingActive` to `$false`.
3. **If** `$LogToFile` is true:
* Calculates relative path: `../../../app-monitor/logs`.
* **If** directory is missing, creates it using `New-Item`.
* Generates filename using `yyyyMMdd_HHmmss` timestamp format.
* Starts transcription via `Start-Transcript -Append`.
* Sets `$script:LoggingActive` to `$true`.




* **Side Effects:** Creates directory on disk; Creates/Appends to a log file; Modifies global scope variables.
* **Error Handling:** Implicit PowerShell error handling. If `New-Item` or `Start-Transcript` fails (e.g., permissions), script execution may halt or throw standard PS exceptions depending on `$ErrorActionPreference`.

### `Stop-Logger`

* **Signature:** `Stop-Logger`
* **Logic Flow:**
1. Checks if `$script:LoggingActive` is true.
2. If true, calls `Stop-Transcript` and sets `$script:LoggingActive` to `$false`.


* **Side Effects:** Closes the file handle for the log file.

### `Write-LogEntry` (Private)

* **Signature:** `Write-LogEntry([string]$Message, [string]$Level, [ConsoleColor]$Color)`
* **Logic Flow:**
1. Captures current time (`HH:mm:ss`).
2. Formats string: `[$time] [$Level] $Message`.
3. Outputs to console using `Write-Host` with specified `$Color`.



### Standard Log Wrappers (`Log-Info`, `Log-Success`, `Log-Warning`, `Log-Error`)

* **Signature:** `Log-*( [string]$Message, [ConsoleColor]$Color )`
* **Logic Flow:**
* Calls `Write-LogEntry` with a hardcoded `Level` string (e.g., "INFO", "SUCCESS", "WARN", "ERROR") and a default color (Cyan, Green, Yellow, Red).
* Allows overriding the default color via optional parameter.



### `Log-Debug`

* **Signature:** `Log-Debug([string]$Message, [ConsoleColor]$Color)`
* **Logic Flow:**
1. Checks `$global:DebugMode`.
2. **Only if true:** Calls `Write-LogEntry` with level "DEBUG" and default color Magenta.



### Formatting Helpers (`Log-Empty`, `Log-Divider`, `Log-Raw`)

* **Log-Empty:** Prints an empty string via `Write-Host`.
* **Log-Divider:** Generates a repeated string (default `-`, length 50) and prints it.
* **Log-Raw:** Prints message without timestamp/level formatting.

---

# Part 2: Appendix - Testing Reference

**Note:** As this is a PowerShell script, testing is best performed using **Pester**, the standard testing framework for PowerShell.

## 1. Mocking Strategy

* **Services to Mock:**
* `Join-Path` / `Resolve-Path`: To ensure tests run independently of the actual file system structure.
* `Test-Path` / `New-Item`: To simulate directory existence or absence without modifying the build agent's disk.
* `Start-Transcript` / `Stop-Transcript`: Critical to mock because these lock files and write to disk.
* `Get-Date`: To ensure deterministic timestamps in log output assertions.


* **Mock Behaviour:**
* **Mock `Start-Transcript`:** Should return valid status or null, but *not* actually create a file during unit tests.
* **Mock `Test-Path`:**
* Return `$true` to simulate existing log directory.
* Return `$false` to verify `New-Item` (directory creation) logic is triggered.


* **Mock `Get-Date`:** Return a fixed DateTime object (e.g., `2025-01-01 12:00:00`) to validate timestamp string formatting.



## 2. Test Scenarios

| Scenario ID | Category | Description | Input State | Expected Outcome |
| --- | --- | --- | --- | --- |
| **TS-01** | Happy Path | Initialize Logging (Console Only) | `Initialize-Logger -LogToFile $false` | `$global:DebugMode` is set; No transcript starts. |
| **TS-02** | Happy Path | Initialize Logging (With File) | `Initialize-Logger -LogToFile $true` | Directory checked; Transcript starts; `$script:LoggingActive` is `$true`. |
| **TS-03** | Logic | Debug Logic - Enabled | `Initialize-Logger -DebugMode $true`<br>

<br>`Log-Debug "Test"` | "Test" appears in output. |
| **TS-04** | Logic | Debug Logic - Disabled | `Initialize-Logger -DebugMode $false`<br>

<br>`Log-Debug "Test"` | Output is empty/null. |
| **TS-05** | Formatting | Log Levels | `Log-Error "Fail"` | Output contains "[ERROR]" and is Red. |
| **TS-06** | Edge Case | Directory Creation | `LogToFile $true`<br>

<br>Mock `Test-Path` returns `$false` | `New-Item -ItemType Directory` is called. |
| **TS-07** | State | Stop Logger Safety | Call `Stop-Logger` when not active | `Stop-Transcript` is **not** called (no error thrown). |
| **TS-08** | Edge Case | Path Traversal | Execute in root directory | Verify relative path calculation `../../../` does not throw generic error (requires Path mocking). |

## 3. Test Data Requirements

**Variable Mocks (Pester):**

```powershell
# Context: Mocking $PSScriptRoot to a known safe location
$mockScriptRoot = "C:\Build\Scripts\Utilities"

# Context: Date Mock
$mockDate = [DateTime]::new(2025, 12, 03, 23, 26, 00)

```

**Directory Structure Assertion:**
The test runner must anticipate the script attempting to resolve:
`$mockScriptRoot/../../../app-monitor/logs`

If `$mockScriptRoot` is `C:/A/B/C/D`, the calculated path is `C:/A/app-monitor/logs`. The test validation must ensure this path resolution string matches expectations.