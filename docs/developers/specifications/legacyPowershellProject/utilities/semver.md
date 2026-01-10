This document provides a formal Technical Specification and Test Strategy for the `semver.ps1` utility script.

### File Metadata

* **Project:** `nuxt4-monorepo-base-app`
* **Path:** `~/scripts/powershell/utilities/semver.ps1`
* **Version:** 1.0.0
* **Language:** PowerShell Core

---

## Part 1: Operational & Design Specification

### 1. Component Overview

* **Purpose:**
The `semver.ps1` script defines a utility function, `Get-NextVersion`, designed to parse a Semantic Versioning (SemVer) string (e.g., `V1.0.0`) and calculate the next version number based on a specified increment scope (Major, Minor, or Patch).
* **Role in System:**
**DevOps/Utility.** This component serves as a helper script, likely invoked by CI/CD pipelines (e.g., GitHub Actions, Azure DevOps) or local build scripts to automate version bumping before tagging releases or publishing artifacts.

### 2. Architecture & Patterns

* **Design Patterns:**
* **Functional Utility:** The component is implemented as a stateless, pure function. It accepts input and returns a deterministic output without modifying external system state (excluding the logging side effect).


* **State Management:**
* **Stateless:** The function does not persist data or maintain state between invocations.


* **Complexity Assessment:** **Low**
* The logic relies on basic string manipulation (`Split`, `Replace`) and arithmetic operations.
* Cyclomatic complexity is low, driven primarily by a single `switch` statement.



### 3. Dependency Graph

* **Internal Dependencies (Implicit):**
* `Log-Warning`: The script calls this command, but it is **not defined** within the file. This implies an expectation that a global utility module or profile is loaded prior to this script's execution.


* **External Dependencies:**
* None. Relies on standard PowerShell Core libraries.


* **Coupling Analysis:**
* **Medium Coupling:** While the logic is standalone, the reliance on an external, unimported `Log-Warning` function creates an implicit runtime coupling. If run in isolation, this script will fail on invalid inputs due to the missing command.



### 4. Data Types & Interfaces

#### Key Interfaces (Parameters)

| Parameter | Type | Required | Description |
| --- | --- | --- | --- |
| `$CurrentVersion` | `[string]` | Yes | The current version string (e.g., "1.0.0", "V2.1.5"). |
| `$IncrementType` | `[string]` | Yes | The scope of change: "Major", "Minor", or "Patch". |

#### Return Types

* **Success:** `[string]` formatted as `V{Major}.{Minor}.{Patch}`.
* **Failure (Graceful):** `[string]` hardcoded to `"V1.0.0"` (on structure validation failure).

> **Architectural Warning:** The return type is technically an implicit `System.Object` (PowerShell default), though it returns strings. Strict typing is recommended.

### 5. Functional Logic Specification

#### Method: `Get-NextVersion`

**Signature:**


**Logic Flow:**

1. **Normalization:** A regular expression `^[vV]` is used to strip the version prefix from `$CurrentVersion`.
2. **Tokenization:** The string is split by the delimiter `.` into an array `$parts`.
3. **Validation:**
* Check: If `$parts.Count < 3`.
* Action: Invoke `Log-Warning` and return `"V1.0.0"` (Hard reset).


4. **Casting:**
* The first three elements of `$parts` are cast to `[int]`.


5. **Increment Logic:**
* A `switch` statement evaluates `$IncrementType` (converted to lowercase):
* **major:** , , 
* **minor:** , 
* **patch:** 
* **default:**  (Treats unknown types as Patch).




6. **Formatting:**
* Constructs and returns the string using string interpolation: `"V$major.$minor.$patch"`.



**Side Effects:**

* **Console Output:** usage of `Log-Warning` writes to the output stream if validation fails.

**Error Handling:**

* **Structure Validation:** Handles missing version parts by resetting to V1.0.0.
* **Type Safety (Critical Gap):** The script casts `$parts[x]` directly to `[int]`. If a version part contains non-numeric characters (e.g., `1.0.0-beta`), PowerShell will throw a `System.Management.Automation.RuntimeException`. This is currently unhandled.

---

## Part 2: Appendix - Testing Reference

### 1. Mocking Strategy

Because the script relies on an undefined function `Log-Warning`, this dependency **must** be mocked for the unit tests to pass in an isolated environment.

* **Services to Mock:** `Log-Warning`
* **Mock Behavior:**
* Define an empty function or an alias `function Log-Warning { param($Message) Write-Host "MOCK WARNING: $Message" }` within the test setup block.



### 2. Test Scenarios

The following scenarios utilize Pester (PowerShell testing framework) logic.

#### A. Happy Path

| ID | Description | Input (`$CurrentVersion`) | Input (`$IncrementType`) | Expected Output |
| --- | --- | --- | --- | --- |
| HP-01 | Increment Patch | `1.0.0` | `Patch` | `V1.0.1` |
| HP-02 | Increment Minor | `1.2.3` | `Minor` | `V1.3.0` |
| HP-03 | Increment Major | `1.5.9` | `Major` | `V2.0.0` |
| HP-04 | Handle 'V' prefix | `V1.0.0` | `Patch` | `V1.0.1` |
| HP-05 | Handle 'v' prefix | `v1.0.0` | `Patch` | `V1.0.1` |

#### B. Edge Cases & Logic Defaults

| ID | Description | Input (`$CurrentVersion`) | Input (`$IncrementType`) | Expected Output | Note |
| --- | --- | --- | --- | --- | --- |
| EC-01 | Case Insensitivity | `1.0.0` | `mAjOr` | `V2.0.0` | Ensures `.ToLower()` works |
| EC-02 | Unknown Type | `1.0.0` | `Hotfix` | `V1.0.1` | Verify default switch case |
| EC-03 | Large Numbers | `100.200.300` | `Patch` | `V100.200.301` | Integer overflow check |

#### C. Error States

| ID | Description | Input (`$CurrentVersion`) | Input (`$IncrementType`) | Expected Output | Behavior |
| --- | --- | --- | --- | --- | --- |
| ER-01 | Invalid Format | `1.0` | `Patch` | `V1.0.0` | Triggers `Log-Warning` logic |
| ER-02 | Non-Numeric* | `1.0.alpha` | `Patch` | **EXCEPTION** | *Currently fails. Needs fix.* |

### 3. Test Data Requirements

To support data-driven testing (e.g., via Pester's `-TestCases`), use the following data structure:

```json
[
  {
    "description": "Standard Patch Increment",
    "current": "1.0.0",
    "type": "Patch",
    "expected": "V1.0.1"
  },
  {
    "description": "Standard Minor Increment",
    "current": "V2.1.5",
    "type": "Minor",
    "expected": "V2.2.0"
  },
  {
    "description": "Standard Major Increment",
    "current": "v0.9.9",
    "type": "Major",
    "expected": "V1.0.0"
  },
  {
    "description": "Malformed Version Reset",
    "current": "InvalidVer",
    "type": "Patch",
    "expected": "V1.0.0"
  }
]

```

### 4. Recommended Next Steps (Architectural)

Would you like me to:

1. **Refactor the script** to include the missing `Log-Warning` definition or remove the dependency?
2. **Add Try/Catch blocks** to handle non-numeric version parts safely?
3. **Generate the Pester (`.Tests.ps1`) file** based on the scenarios above?