Based on the analysis of the provided `project.ps1` file, here is the comprehensive Technical Specification and Test Strategy.

---

# Technical Specification: Project Context & Safety Utilities

## Part 1: Operational & Design Specification

### 1. Component Overview

* **Purpose:** This component serves as a **DevOps/Infrastructure Utility** designed to enforce execution context safety and resolve project scoping within a Monorepo environment.
* **Role in System:** It functions as a **Scripting Helper Module**. It is not part of the runtime Node.js application but is invoked during build, scaffold, or maintenance routines to ensure scripts run from the correct directory and to dynamically identify which "layer" (sub-project) a file belongs to.

### 2. Architecture & Patterns

* **Design Patterns:**
* **Functional/Procedural:** The component is a collection of standalone stateless functions.
* **Guard Clause Pattern:** Used in `Test-ProjectRoot` to fail fast if preconditions are not met.


* **State Management:**
* **Stateless:** The functions do not maintain internal state between invocations. They rely entirely on arguments and the current filesystem state.


* **Complexity Assessment:** **Low**.
* *Justification:* The logic relies on simple boolean checks (`Test-Path`) and standard Regular Expressions. There is no recursion, complex data transformation, or asynchronous handling.



### 3. Dependency Graph

* **Internal Dependencies:** None. (This is a base utility script).
* **External Dependencies:**
* **PowerShell Core Runtime:** specifically `Microsoft.PowerShell.Management` (for `Test-Path`) and `Microsoft.PowerShell.Utility` (for `Write-Host`).


* **Coupling Analysis:**
* **Loose Coupling:** The code is logically decoupled from specific application logic.
* **Structural Coupling:** High coupling to the specific directory structure of the monorepo (specifically the existence of `package.json` at root and a `/layers/` directory convention).



### 4. Data Types & Interfaces

**Key Interfaces (PowerShell Parameters):**

| Function | Parameter | Type | Required | Description |
| --- | --- | --- | --- | --- |
| `Get-FileProjectContext` | `$FilePath` | `[string]` | Yes | Absolute or relative path to a file. |
| `Get-FileProjectContext` | `$RootProjectName` | `[string]` | Yes | Fallback name if file is not in a layer. |

**Return Types:**

* **`Test-ProjectRoot`**: `void`
* *Warning:* Implicitly returns specific exit codes to the shell context on failure (`exit 1`).


* **`Get-FileProjectContext`**: `string`
* Returns a formatted string (e.g., `@monorepo/billing`) or the input `$RootProjectName`.



### 5. Functional Logic Specification

#### Method: `Test-ProjectRoot`

* **Signature:** `Test-ProjectRoot(): void`
* **Logic Flow:**
1. Invoke `Test-Path -LiteralPath ".\package.json"`.
2. **IF** path does not exist:
* Write FATAL log message (Red).
* Write instructional message (Gray).
* Terminate script execution immediately via `exit 1`.


3. **ELSE**: Continue execution (implicit return).


* **Side Effects:**
* Writes to Standard Output (Console).
* Terminates process on failure.


* **Error Handling:**
* Does not throw PowerShell Exceptions (`throw`). Instead, utilizes **Terminal Exit** strategy to halt pipeline execution.



#### Method: `Get-FileProjectContext`

* **Signature:** `Get-FileProjectContext(FilePath: string, RootProjectName: string): string`
* **Logic Flow:**
1. Accept `$FilePath` and `$RootProjectName`.
2. Apply Regex Match: `[\\/]layers[\\/]([^\\/]+)[\\/]` against `$FilePath`.
* *Regex Explanation:* Looks for a directory separator, literally "layers", another separator, captures the immediate subdirectory name (Layer Name), followed by a closing separator.


3. **IF** Match Found:
* Extract capture group 1 (the layer name).
* Construct string: `"@monorepo/" + Match[1]`.
* Return constructed string.


4. **ELSE**:
* Return `$RootProjectName`.




* **Side Effects:** None.
* **Error Handling:** None. Returns default value on regex mismatch.

---

## Part 2: Appendix - Testing Reference

### 1. Mocking Strategy

Since this is a PowerShell script, testing typically requires a framework like **Pester**.

* **Services to Mock:**
* **`Test-Path`**: Crucial for `Test-ProjectRoot`. We must not rely on the actual filesystem of the build agent/developer machine.
* **`Write-Host`**: Mock this to verify error messages are displayed without cluttering the test runner output.
* **`exit`**: **Critical.** In PowerShell, `exit` terminates the test runner. You must run `Test-ProjectRoot` inside a generic `ScriptBlock` or mock the `exit` keyword if the test framework supports it (otherwise, verify the side-effect of the script stopping).


* **Mock Behavior:**
* **Scenario A (Root Valid):** `Mock "Test-Path" { return $true }`
* **Scenario B (Root Invalid):** `Mock "Test-Path" { return $false }`



### 2. Test Scenarios

#### Component: `Test-ProjectRoot`

| Scenario ID | Category | Description | Input State | Expected Outcome |
| --- | --- | --- | --- | --- |
| **TPR-01** | Happy Path | `package.json` exists | `Test-Path` returns `$true` | Function completes silently; No exit. |
| **TPR-02** | Error State | `package.json` missing | `Test-Path` returns `$false` | `Write-Host` called with "FATAL"; Script exits with Code 1. |

#### Component: `Get-FileProjectContext`

| Scenario ID | Category | Description | Input (`FilePath`) | Input (`RootName`) | Expected Output |
| --- | --- | --- | --- | --- | --- |
| **GPC-01** | Happy Path | File inside a layer (Linux path) | `~/layers/billing/nuxt.config.ts` | `my-app` | `@monorepo/billing` |
| **GPC-02** | Happy Path | File inside a layer (Windows path) | `C:\projects\layers\auth\index.ts` | `my-app` | `@monorepo/auth` |
| **GPC-03** | Happy Path | File in root application | `~/app/components/Header.vue` | `my-app` | `my-app` |
| **GPC-04** | Edge Case | File in 'layers' but deeper nested | `~/layers/billing/utils/calc.ts` | `my-app` | `@monorepo/billing` |
| **GPC-05** | Edge Case | Folder named similar to layers (False positive check) | `~/players/stats.ts` | `my-app` | `my-app` |
| **GPC-06** | Edge Case | Empty File Path | `""` | `my-app` | `my-app` |

### 3. Test Data Requirements

To support the scenarios above, the following data variables are required for the test harness:

```json
{
  "testPaths": {
    "validLayerUnix": "/home/user/project/layers/inventory/server/api.ts",
    "validLayerWin": "C:\\Users\\Dev\\project\\layers\\inventory\\server\\api.ts",
    "rootPathUnix": "/home/user/project/app.vue",
    "ambiguousPath": "/home/user/project/bricklayers/job.ts"
  },
  "constants": {
    "rootProjectName": "nuxt4-base"
  }
}

```

### Next Steps for the User

Would you like me to generate a **Pester Test Script (`project.tests.ps1`)** that implements these mocks and scenarios to ensure this utility is fully covered?