Based on the analysis of the uploaded file `llm-messages.ps1`, here is the comprehensive Technical Specification and Test Strategy.

> **Architectural Note:** The context provided in the prompt mentions a "Node.js/TypeScript application." However, the file provided (`llm-messages.ps1`) is a **PowerShell script** intended for DevOps/Utility automation. The following specification is derived strictly from the actual code provided (PowerShell), though it fits within the broader "nuwx4-monorepo-base-app" ecosystem.

---

## Part 1: Operational & Design Specification

### 1. Component Overview

* **Purpose:** `llm-messages.ps1` serves as a **Provider-Agnostic Prompt Engineering Library**. Its primary function is to abstract the complexity of constructing AI prompts. It transforms raw input (specifically Git Diffs) into structured contexts (System and User prompts) and delegates the actual API interaction to a central gateway command (`Invoke-LLM`).
* **Role in System:**
* **Layer:** Utility / DevOps Scripting Layer.
* **Function:** It acts as a **Facade** for the `Invoke-LLM` gateway, exposing task-specific functions (`CommitMessage`, `VersionAnalysis`) so calling scripts do not need to manage prompt text or provider specifics.



### 2. Architecture & Patterns

* **Design Patterns:**
* **Facade Pattern:** The script simplifies the interface for generating AI content. Clients call `Get-LLM-CommitMessage` rather than configuring raw HTTP requests or raw text prompts.
* **Delegation:** It does not perform the AI inference itself; it delegates execution entirely to `Invoke-LLM`.


* **State Management:**
* **Stateless:** The functions are pure procedural functions. They take input (`$Diff`), process it, and return output without maintaining internal state between calls.


* **Complexity Assessment:** **Low**.
* **Justification:** The control flow is linear. There is minimal logic branching (only checking if the result is null or catching JSON parsing errors). The complexity lies in the prompt engineering (strings), not the code logic.



### 3. Dependency Graph

* **Internal Dependencies (Implicit/Environmental):**
* `Invoke-LLM`: The central gateway command (presumably defined in a parent scope or module) used to communicate with the AI provider (Gemini/Ollama).
* `Log-Error`: A logging utility for error reporting.
* `Log-Debug`: A logging utility for troubleshooting (specifically for failed JSON parsing).


* **External Dependencies:**
* **PowerShell Runtime:** Requires a PowerShell environment (likely Core/7+ given the cross-platform nature of the repo name).


* **Coupling Analysis:**
* **High Coupling:** The script is tightly coupled to the signature of `Invoke-LLM`. It assumes `Invoke-LLM` accepts `-SystemPrompt`, `-Prompt`, and `-JsonMode`. Any change to the `Invoke-LLM` signature will break this component.



### 4. Data Types & Interfaces

While PowerShell is dynamically typed, the script uses type constraints in parameters.

* **Key Interfaces (Input):**
* `$Diff` (String): Raw text representation of a Git difference.


* **Return Types:**

| Function Name | Return Type | Warning / Note |
| --- | --- | --- |
| `Get-LLM-CommitMessage` | `System.String` or `$null` | Returns a trimmed string on success. |
| `Get-LLM-VersionAnalysis` | `PSCustomObject` or `$null` | Implicit return type via `ConvertFrom-Json`. Returns a standard PowerShell object parsed from JSON. |

### 5. Functional Logic Specification

#### Method 1: `Get-LLM-CommitMessage`

* **Method Signature:** `Get-LLM-CommitMessage([string]$Diff)`
* **Logic Flow:**
1. **Define System Prompt:** Sets strict rules ("Output ONLY the commit message", "No quotes", "Max 50 chars").
2. **Define User Prompt:** Wraps the provided `$Diff` variable with an instruction to generate a message.
3. **Gateway Call:** Executes `Invoke-LLM` passing both prompts.
4. **Validation:** Checks if the result `$msg` is not null/empty.
5. **Return:** Trims whitespace and returns the string; otherwise returns `$null`.


* **Side Effects:** None (Read-only operation).
* **Error Handling:** Implicit. If `Invoke-LLM` fails or returns nothing, this function returns `$null`.

#### Method 2: `Get-LLM-VersionAnalysis`

* **Method Signature:** `Get-LLM-VersionAnalysis([string]$Diff)`
* **Logic Flow:**
1. **Define System Prompt:** establishes the persona (Semantic Versioning expert).
2. **Define User Prompt:**
* Outlines Task 1 (Determine SemVer increment: Patch/Minor/Major).
* Outlines Task 2 (Write technical revision note).
* **Constraint:** Enforces a specific JSON schema output.
* Injects the `$Diff`.


3. **Gateway Call:** Executes `Invoke-LLM` with the switch `-JsonMode`.
4. **Parsing:**
* Enters a `try` block.
* Pipes the resulting string `$jsonStr` to `ConvertFrom-Json`.


5. **Return:** Returns the parsed object.


* **Side Effects:** Calls `Log-Error` and `Log-Debug` on failure.
* **Error Handling:**
* **Catch Block:** Captures JSON parsing exceptions (e.g., if the LLM hallucinates non-JSON text).
* **Action:** Logs a generic error message and logs the raw invalid JSON string for debugging. Returns `$null`.



---

## Part 2: Appendix - Testing Reference

### 1. Mocking Strategy

Since this script relies on external commands (`Invoke-LLM`, `Log-*`), these must be mocked to test unit logic in isolation (e.g., using Pester).

* **Services to Mock:**
* `Invoke-LLM`: The critical dependency.
* `Log-Error` & `Log-Debug`: To verify error handling paths.


* **Mock Behaviour:**
* **Mock `Invoke-LLM` (Scenario A - Commit Msg):** Return a simple string: `"feat: update documentation"`.
* **Mock `Invoke-LLM` (Scenario B - JSON):** Return a valid JSON string: `'{ "increment": "Patch", "note": "Fix bug" }'`.
* **Mock `Invoke-LLM` (Scenario C - Bad JSON):** Return invalid string: `"Here is your JSON: { ... }"` (triggers catch block).
* **Mock `Invoke-LLM` (Scenario D - Null):** Return `$null` or empty string (simulates network failure).



### 2. Test Scenarios

| Category | ID | Scenario Name | Input Data | Mock Setup | Expected Outcome |
| --- | --- | --- | --- | --- | --- |
| **Happy Path** | HP-01 | **Generate Commit Message** | Valid Diff String | `Invoke-LLM` returns string "fix: bug" | Returns string "fix: bug" |
| **Happy Path** | HP-02 | **Analyze Version (Patch)** | Valid Diff String | `Invoke-LLM` returns valid JSON | Returns Object with `.increment` = "Patch" |
| **Edge Case** | EC-01 | **Empty Diff** | Empty String `""` | `Invoke-LLM` returns generated text based on empty input | Should still attempt call (Prompt engineering handles the rest) |
| **Error State** | ER-01 | **Gateway Failure (Null)** | Valid Diff | `Invoke-LLM` returns `$null` | Returns `$null` |
| **Error State** | ER-02 | **Invalid JSON Response** | Valid Diff | `Invoke-LLM` returns non-JSON text | Calls `Log-Error`, calls `Log-Debug`, returns `$null` |
| **Formatting** | FMT-01 | **Whitespace Trimming** | Valid Diff | `Invoke-LLM` returns " fix: bug " | Returns "fix: bug" (trimmed) |

### 3. Test Data Requirements

**A. Input Sample (Diff Snippet)**

```text
diff --git a/src/app.ts b/src/app.ts
index 83db48f..bf3d432 100644
--- a/src/app.ts
+++ b/src/app.ts
@@ -10,1 +10,1 @@
- const version = "1.0.0";
+ const version = "1.0.1";

```

**B. Mock Response (Valid JSON for `Get-LLM-VersionAnalysis`)**

```json
{
    "increment": "Patch",
    "note": "Updated version constant in app.ts"
}

```

**C. Mock Response (Invalid JSON for Error Testing)**

```text
Sure, here is the analysis:
{
    "increment": "Patch"
}

```

*(Note: The introductory text "Sure..." breaks `ConvertFrom-Json`)*

---

**Next Step:** Would you like me to generate a Pester test script (`llm-messages.tests.ps1`) based on this strategy to immediately validate the logic?