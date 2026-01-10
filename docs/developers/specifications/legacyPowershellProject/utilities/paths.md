Here is the comprehensive technical specification and test strategy for the provided PowerShell utility script.

---

# Technical Specification Document

**Subject:** `paths.ps1` Utility
**Version:** 1.0.0
**Date:** January 9, 2026
**Authoring Role:** Senior Technical Architect

---

## Part 1: Operational & Design Specification

### 1. Component Overview

* **Purpose:** `paths.ps1` serves as a filesystem utility module designed to normalize absolute file paths into project-relative paths using tilde notation (e.g., converting `C:\Projects\App\src\index.ts` to `~/src/index.ts`).
* **Role in System:**
* **DevOps/Utility Layer:** This component sits outside the core Node.js/TypeScript runtime application. It functions as a support script, likely used during build processes, scaffolding, or local development CLI tools to provide standardized output for logs or configuration files.



### 2. Architecture & Patterns

* **Design Patterns:**
* **Functional/Procedural:** The script defines a standalone function (`Get-RelativePath`) rather than an object-oriented class structure.
* **Pure Function (Intent):** The function aims to be deterministic (same input = same output), though its default parameter relies on the environment state (`Get-Location`).


* **State Management:**
* **Stateless:** The function does not maintain variables between executions or modify global scope. It operates strictly on the parameters provided.


* **Complexity Assessment:** **Low**
* The logic relies on string manipulation (regex replacement and substring operations). There is no recursion, complex branching, or asynchronous operations.



### 3. Dependency Graph

* **Internal Dependencies:**
* None. This is a self-contained utility script.


* **External Dependencies:**
* **PowerShell Runtime:** Specifically `Microsoft.PowerShell.Management\Get-Location` used for default parameter resolution.
* **.NET Framework / Core:** Implicit reliance on System.String methods (`.Replace`).


* **Coupling Analysis:**
* **Loosely Coupled:** The function accepts primitive types (`string`) and returns a primitive. It does not depend on specific project file structures or other custom modules.



### 4. Data Types & Interfaces

* **Key Interfaces:**
* N/A (PowerShell Script).


* **Parameters:**
* `$FullPath` (Type: `[string]`) - Mandatory.
* `$RootPath` (Type: `[string]`) - Optional. Defaults to Current Working Directory.


* **Return Types:**
* **Implicit String:** The function returns a `System.String`.
* **Architectural Warning:** The function lacks the `[OutputType([string])]` attribute, which hinders static analysis and strict typing enforcement recommended for the audit.



### 5. Functional Logic Specification

#### Method: `Get-RelativePath`

* **Method Signature:**
`Get-RelativePath -FullPath <string> [-RootPath <string>] : string`
* **Logic Flow:**
1. **Normalization:**
* Accepts `$FullPath` and `$RootPath`.
* Sanitizes both paths by replacing all backslashes (`\`) with forward slashes (`/`) to ensure cross-platform consistency (Windows vs. Linux/macOS).


2. **Relative Calculation:**
* Performs a direct string replacement on `$stdFull`, removing the `$stdRoot` segment.


3. **Formatting:**
* Checks if the resulting string starts with `/`. If not (and the string is not empty), it prepends `/`.


4. **Prefixing:**
* Prepends the tilde character `~`.


5. **Return:**
* Returns the final formatted string (e.g., `~/app/test.ts`).




* **Side Effects:**
* None. No file system writes or global state modifications occur.


* **Error Handling:**
* **Implicit:** The script relies on PowerShell's native runtime errors.
* **Deficiency:** There is no validation to ensure `$FullPath` actually contains `$RootPath`. If a path *outside* the root is provided, the replacement will fail silently, resulting in `~` prepended to the absolute path (e.g., `~/C:/Other/Path`), which is malformed.



---

## Part 2: Appendix - Testing Reference

### 1. Mocking Strategy

Since this is a PowerShell script, testing typically utilizes Pester.

* **Services to Mock:**
* **`Get-Location`:** If testing reliance on the default parameter.


* **Mock Behaviour:**
* Mock `Get-Location` to return a fixed, known path (e.g., `C:\Test\Project`) to ensure tests run consistently regardless of the machine they are executed on.



### 2. Test Scenarios

The following scenarios assume the testing framework is Pester.

| Category | Scenario Name | Input Description | Expected Output | Rationale |
| --- | --- | --- | --- | --- |
| **Happy Path** | Standard Nested File | Full: `C:\Project\src\main.ts`<br>

<br>Root: `C:\Project` | `~/src/main.ts` | Validates basic stripping and formatting. |
| **Happy Path** | Root File | Full: `C:\Project\readme.md`<br>

<br>Root: `C:\Project` | `~/readme.md` | Validates files at the immediate root level. |
| **Happy Path** | Mixed Slashes | Full: `C:\Project/src\utils/log.ts`<br>

<br>Root: `C:\Project` | `~/src/utils/log.ts` | Validates normalization logic (`-replace '\\', '/'`). |
| **Edge Case** | Trailing Slash in Root | Full: `C:\Project\src\file.ts`<br>

<br>Root: `C:\Project\` | `~/src/file.ts` | Ensures trailing slashes in root don't cause double slashes in output. |
| **Edge Case** | Case Sensitivity (Win) | Full: `c:\project\src\FILE.TS`<br>

<br>Root: `C:\Project` | `~/src/FILE.TS` | PowerShell replacement is case-insensitive by default; verify this behavior is desired. |
| **Error State** | Path Outside Root | Full: `D:\Other\file.txt`<br>

<br>Root: `C:\Project` | *Warning:* Current logic returns `~/D:/Other/file.txt` | **CRITICAL:** Identify this logic gap. Ideally, should throw error or handle gracefully. |
| **Error State** | Empty Strings | Full: `""`<br>

<br>Root: `C:\Project` | `~/` | Verify behavior with empty inputs. |

### 3. Test Data Requirements

No complex JSON objects are required as the input types are primitives. However, for a test suite, variables should be defined to simulate file system structures.

**PowerShell Test Variables (Pester):**

```powershell
# Test Data Setup
$MockRoot = "C:/Users/Dev/repo"
$StandardFile = "C:\Users\Dev\repo\src\components\Button.ts"
$DeepFile = "C:/Users/Dev/repo/src/utils/helpers/math.ts"
$ExternalFile = "C:\Windows\System32\drivers\etc\hosts"

# Execution Example
Get-RelativePath -FullPath $StandardFile -RootPath $MockRoot
# Expected: "~/src/components/Button.ts"

```

### 4. Recommendations for Refactoring (QA & Arch Note)

To meet the "Strict Typing" and "High Standards" audit:

1. **Add Output Attribute:** Add `[OutputType([string])]` to the function metadata.
2. **Add Validation:** Add logic to verify `$FullPath` starts with `$RootPath` before attempting replacement.
3. **Use .NET Path Classes:** Instead of string replacement, use `[System.IO.Path]::GetRelativePath($RootPath, $FullPath)` (available in PowerShell Core 6+) for robust, OS-aware path handling.

**Next Step:** Would you like me to refactor this script to use `.NET` libraries for robust path handling and add the Pester unit tests?