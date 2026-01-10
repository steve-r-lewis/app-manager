Based on the provided PowerShell source code (`gemini.ps1`), here is the comprehensive Technical Specification and Test Strategy.

**Note to Auditor:** While the prompt references a Node.js/TypeScript context, the provided file is a **PowerShell** utility script. The following analysis treats the code in its native language (PowerShell Core / 7+) while maintaining the architectural rigor requested.

---

# Part 1: Operational & Design Specification

## 1. Component Overview

* **Purpose:** This component serves as a centralized API wrapper for the Google Gemini 2.0 Generative AI service. It abstracts authentication, payload construction, error handling, and rate-limiting logic, exposing a simplified interface for other automation scripts.
* **Role in System:** **Utility / Infrastructure Layer.** It functions as a standalone helper script likely invoked by CI/CD pipelines or developer tooling within the `nuxt4-monorepo-base-app`.

## 2. Architecture & Patterns

* **Design Patterns:**
* **Wrapper/Adapter Pattern:** Encapsulates the complexity of raw HTTP REST calls to `generativelanguage.googleapis.com`.
* **Retry Pattern (Exponential Backoff):** Implements logic to handle transient failures (specifically HTTP 429) by waiting and retrying with increasing delays.
* **Configuration Injection:** Relies on environment variables for credentials, adhering to 12-Factor App principles.


* **State Management:** **Stateless.** The component does not maintain persistence between invocations. Every call to `Invoke-Gemini` is independent, though it does utilize a transient `while` loop for retries.
* **Complexity Assessment:** **Medium.**
* *Justification:* While the core logic is a simple REST call, the inclusion of custom exponential backoff logic, stream-based error reading for PowerShell Core compatibility, and JSON mode pre/post-processing elevates the complexity beyond a simple script.



## 3. Dependency Graph

### Internal Dependencies (Implicit)

* **Logging Functions:** The script calls `Log-Error`, `Log-Debug`, and `Log-Warning`.
* *Critical Audit Note:* These functions are **not defined** within `gemini.ps1`. They are expected to be present in the global scope (likely dot-sourced from a `logger.ps1` or profile script before this script is run).



### External Dependencies (Standard Libraries & APIs)

* **Microsoft.PowerShell.Utility:** specifically `ConvertFrom-Json`, `ConvertTo-Json`.
* **Microsoft.PowerShell.Management:** specifically `Invoke-RestMethod`, `Start-Sleep`.
* **System.Math:** Used for exponential backoff calculation (`[math]::Pow`).
* **System.IO.StreamReader:** Used for reading error streams from WebExceptions.
* **Google Gemini API:** `https://generativelanguage.googleapis.com/v1beta/models/`.

### Coupling Analysis

* **Loose Coupling:** The script is loosely coupled to the specific model version (defaults to `gemini-2.0-flash` but accepts overrides). It is decoupled from hardcoded credentials via the `GEMINI_API_CREDENTIALS` environment variable.

## 4. Data Types & Interfaces

Since PowerShell is dynamically typed, the following describes the *implicit* contracts enforced by the code.

### Configuration Interface (JSON via Env Var)

The `$env:GEMINI_API_CREDENTIALS` variable MUST conform to:

```json
{
  "APIKey": "string (required)",
  "Model": "string (optional, default: gemini-2.0-flash)"
}

```

### Public Function: `Invoke-Gemini`

* **Parameters:**
* `Prompt` (String, Mandatory): The user query.
* `SystemPrompt` (String, Optional): Context setting instructions.
* `Temperature` (Double, Optional, Default: 0.7): Creativity setting.
* `JsonMode` (Switch, Optional): Forces JSON MIME type and strips Markdown fencing.
* `ModelOverride` (String, Optional): Specific model version.


* **Return Type:** `String | $null`
* Returns the generated text content on success.
* Returns `$null` on failure or empty candidate response.



## 5. Functional Logic Specification

### 5.1 Function: `Get-GeminiConfig`

* **Signature:** `Get-GeminiConfig()` -> `PSCustomObject`
* **Logic Flow:**
1. Check if `$env:GEMINI_API_CREDENTIALS` exists.
2. If missing, Log Error and **Throw** "Missing Configuration".
3. Attempt to parse JSON (`ConvertFrom-Json`).
4. Verify `APIKey` property exists on the object.
5. If invalid/missing key, **Throw** "Configuration Error".
6. Return parsed configuration object.



### 5.2 Function: `Invoke-Gemini`

* **Signature:** `Invoke-Gemini -Prompt <string> ...` -> `string`
* **Logic Flow:**
1. **Config Load:** Call `Get-GeminiConfig`.
2. **Model Selection:** Priority: `ModelOverride` > Config JSON > Default (`gemini-2.0-flash`).
3. **Prompt Construction:** Concatenate `SystemPrompt` + `Prompt`. If `$JsonMode` is true, append instruction: "IMPORTANT: Output ONLY valid JSON...".
4. **Payload Build:** Construct nested hashtable matching Gemini API schema. If `$JsonMode`, set `responseMimeType` to `application/json`. Convert to JSON.
5. **Retry Loop (Max 3 attempts):**
* Execute `Invoke-RestMethod` (POST).
* *If Success:* Break loop.
* *If Failure (Catch):* Check HTTP Status Code.
* If **429 (Too Many Requests)**: Calculate delay (), Log Warning, Sleep, and Retry.
* Other Errors: Break loop immediately.




6. **Error Handling (Post-Loop):**
* If request failed, attempt to read `Exception.Response.GetResponseStream()` (necessary for detailed error messages in PS Core/7).
* Log specific API error details or generic exception.
* Return `$null`.


7. **Response Processing:**
* Check if `candidates` array exists in response.
* Extract text from `candidates[0].content.parts[0].text`.
* If `$JsonMode`, Regex replace `^```json` and ````$` to return raw JSON string.
* Return Content.





---

# Part 2: Appendix - Testing Reference

## 1. Mocking Strategy

To test this script without incurring API costs or requiring live credentials, the following Pester (PowerShell Testing Framework) mocks are required.

### 1.1 External Commands (Cmdlets)

* **`Invoke-RestMethod`**: The primary mock.
* *Happy Path:* Return a PSCustomObject mimicking the Google API JSON response.
* *429 Scenario:* Throw a `WebException` with a Response object containing StatusCode 429 for the first 2 calls, then success on the 3rd.
* *500 Scenario:* Throw a generic exception.


* **`Get-Content` / `ConvertFrom-Json**`: (Optional) Only if testing the configuration loading logic in isolation, though usually testing via Environment Variable injection is cleaner.

### 1.2 Implicit Dependencies

* **`Log-Error`, `Log-Debug`, `Log-Warning**`: These **MUST** be mocked. If the test runner does not define these, the script will crash with "CommandNotFoundException".
* *Mock Behavior:* Write to `Write-Host` or do nothing.



## 2. Test Scenarios

| Category | Scenario Name | Inputs | Expected Outcome |
| --- | --- | --- | --- |
| **Happy Path** | **Standard Prompt** | Prompt: "Hello", Model: Default | Returns string "AI Response". API URL contains `gemini-2.0-flash`. |
| **Happy Path** | **JSON Mode** | Prompt: "Data", Switch: `-JsonMode` | Returns clean JSON string (Markdown fences removed). Payload config includes `responseMimeType`. |
| **Config** | **Missing Env Var** | `$env:GEMINI_API_CREDENTIALS = $null` | Script throws "Missing Configuration". |
| **Config** | **Invalid JSON** | `$env:GEMINI_API_CREDENTIALS = "{bad"` | Script throws "Configuration Error". |
| **Edge Case** | **Model Override** | `-ModelOverride "gemini-1.5-pro"` | API URL contains `gemini-1.5-pro`. |
| **Error State** | **Rate Limit (429)** | Mock `Invoke-RestMethod` to fail 429 twice, then succeed. | Script retries twice (waiting 2s, then 4s), then returns content. Logs Warnings. |
| **Error State** | **Hard Failure (500)** | Mock `Invoke-RestMethod` to fail 500. | Script logs Error details (stream read) and returns `$null`. |
| **Error State** | **Empty Candidates** | Mock API returns `{ candidates: [] }` | Script logs Warning "Empty Response" and returns `$null`. |

## 3. Test Data Requirements

### 3.1 Google API Success Response (Mock Object)

When mocking `Invoke-RestMethod`, return a PowerShell object structure matching this JSON:

```json
{
  "candidates": [
    {
      "content": {
        "parts": [
          {
            "text": "This is the generated response text."
          }
        ],
        "role": "model"
      },
      "finishReason": "STOP",
      "index": 0,
      "safetyRatings": []
    }
  ],
  "usageMetadata": {
    "promptTokenCount": 10,
    "candidatesTokenCount": 10,
    "totalTokenCount": 20
  }
}

```

### 3.2 JSON Mode Response (Raw Text from API)

For the JSON Mode test, the `candidates[0].content.parts[0].text` property should contain:

```markdown
```json
{
  "key": "value"
}

```

```
*Purpose:* To verify the Regex replacement logic correctly strips the backticks and `json` identifier.

### 3.3 Rate Limit Exception Object (Mock)
To simulate the 429 error in PowerShell, the mock Exception object must look like:
```powershell
@{
    Exception = @{
        Response = @{
            StatusCode = 429 # [System.Net.HttpStatusCode]::TooManyRequests
        }
    }
}

```