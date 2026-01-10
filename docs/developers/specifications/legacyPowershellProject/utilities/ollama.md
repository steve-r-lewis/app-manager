Based on the analysis of the provided source code, here is the Technical Specification Document and Test Strategy Appendix.

---

# Technical Specification Document: Ollama API Integration Utility

## Part 1: Operational & Design Specification

### 1. Component Overview

* **Purpose:** This component acts as a PowerShell-based API wrapper for the Ollama Local Large Language Model (LLM) server. It facilitates configuration retrieval, connection health checks, and text/JSON generation requests.
* **Role in System:**
* **Utility/Infrastructure:** It resides in `~/scripts/powershell/utilities/` and serves as a plug-and-play alternative to `gemini.ps1`, adhering to the project's LLM Gateway standards.
* **Interface:** It bridges local development scripts with the Ollama REST API running on the host machine.



### 2. Architecture & Patterns

* **Design Patterns:**
* **Service Facade:** The script exposes simplified functions (`Invoke-Ollama`, `Test-OllamaConnection`) that abstract the underlying HTTP REST complexity.
* **Configuration Provider:** Centralizes configuration logic via `Get-OllamaConfig` to decouple hardcoded values from logic.
* **Polymorphism (Ad-hoc):** The code is explicitly refactored to match the `Invoke-Gemini` signature, allowing interchangeable use within the broader "LLM Gateway" context.


* **State Management:**
* **Stateless:** The component does not maintain internal state between executions. Configuration is re-evaluated via environment variables or defaults during every function call.


* **Complexity Assessment:** **Low**.
* The control flow is linear, consisting primarily of HTTP request construction, execution, and basic string manipulation for response parsing.



### 3. Dependency Graph

* **Internal Dependencies (Project Scope):**
* `Log-Debug`: A global project logging function used for tracing execution flow.
* `Log-Error`: A global project logging function used for exception reporting.


* **External Dependencies:**
* **PowerShell Core Cmdlets:** `Invoke-RestMethod`, `ConvertTo-Json`.
* **Ollama Service:** Requires an active Ollama instance (defaulting to port 11434).


* **Coupling Analysis:**
* **Loose Coupling:** The script relies on Environment Variables for configuration, allowing it to adapt to different environments (CI/CD vs. Local) without code changes.



### 4. Data Types & Interfaces

The script utilizes PowerShell's dynamic typing but enforces strict types on function parameters.

**Key Interfaces (Implicit via Hashtables):**

* **Config Object:**
```powershell
@{
    BaseUrl = [string]
    Model   = [string]
    Timeout = [int]
}

```


* **Connection Status:**
```powershell
@{
    available = [bool]
    url       = [string]
}

```



**Method Return Types:**

| Method | Return Type | Notes |
| --- | --- | --- |
| `Get-OllamaConfig` | `Hashtable` | Contains BaseUrl, Model, and Timeout. |
| `Test-OllamaConnection` | `Hashtable` | Contains availability boolean and URL. |
| `Invoke-Ollama` | `String` | `$null` |

### 5. Functional Logic Specification

#### A. `Get-OllamaConfig`

* **Signature:** `Get-OllamaConfig()`
* **Logic Flow:**
1. Initialize default variables (`http://localhost:11434`, `llama3:8b`, `200` seconds).
2. Check Environment Variables (`OLLAMA_BASE_URL`, `OLLAMA_MODEL`, `OLLAMA_TIMEOUT`) and override defaults if present.
3. Return a Hashtable containing the final configuration.



#### B. `Test-OllamaConnection`

* **Signature:** `Test-OllamaConnection()`
* **Logic Flow:**
1. Retrieve configuration via `Get-OllamaConfig`.
2. Log a debug message indicating the target URL.
3. Execute `Invoke-RestMethod` (GET) against the Base URL with a hardcoded **5-second timeout**.
4. Evaluate Response:
* If response matches "Ollama is running", return `@{ available = $true; url = $url }`.
* Else, return `@{ available = $false; url = $url }`.


5. **Error Handling:** Catch exceptions, log the failure via `Log-Debug`, and return `available = $false`.



#### C. `Invoke-Ollama`

* **Signature:** `Invoke-Ollama([string]$Prompt, [string]$SystemPrompt, [double]$Temperature, [switch]$JsonMode, [string]$ModelOverride)`
* **Logic Flow:**
1. **Configuration:** Retrieve config and determine model (use `ModelOverride` if provided, otherwise config default).
2. **Payload Construction:** Build a Hashtable (`$body`) with `model`, `prompt`, `stream: false`, and `options: { temperature }`.
3. **System Prompt Injection:** If `$SystemPrompt` is provided, add it to the body.
4. **JSON Mode Handling:**
* Set `$body.format = "json"`.
* Append warning "`n`nIMPORTANT: Output ONLY valid JSON." to the user prompt.


5. **Serialization:** Convert `$body` to JSON (Depth 5).
6. **Execution:** Call `Invoke-RestMethod` (POST) to `/api/generate` with the configured timeout.
7. **Response Processing:**
* Extract `response` field from the return object.
* If `$JsonMode` is active, use Regex to strip Markdown code blocks (````json ... ````).
* Return the cleaned content string.




* **Error Handling:**
* If the API returns an empty response, log "Ollama returned an empty response" and return `$null`.
* Catches exceptions (e.g., HTTP errors), logs "Ollama API Request Failed: [Error]", and returns `$null`.



---

## Part 2: Appendix - Testing Reference

### 1. Mocking Strategy

To verify this script without a live LLM server, the following dependencies must be mocked using Pester (PowerShell Testing Framework).

* **`Invoke-RestMethod`**: This is the critical external boundary.
* *Mock Behavior (Health Check):* Return "Ollama is running" string for GET requests to the base URL.
* *Mock Behavior (Generation):* Return a PSCustomObject `@{ response = "Generated Text" }` for POST requests to `/api/generate`.
* *Mock Behavior (Timeout/Failure):* Throw an exception to test error handling blocks.


* **`Log-Debug` & `Log-Error**`:
* *Mock Behavior:* Mock these to validate that correct diagnostic messages are sent to the logger, specifically during error conditions.


* **Environment Variables (`$env:OLLAMA_...`)**:
* *Mock Behavior:* Set these temporarily within a `Describe`/`Context` block to ensure `Get-OllamaConfig` prioritizes them over defaults.



### 2. Test Scenarios

| Category | Scenario | Input / Condition | Expected Outcome |
| --- | --- | --- | --- |
| **Happy Path** | **Default Config** | Call `Get-OllamaConfig` with no env vars. | Returns default URL `http://localhost:11434` and model `llama3:8b`. |
| **Happy Path** | **Env Var Config** | Set `$env:OLLAMA_MODEL = "mistral"`. | `Get-OllamaConfig` returns Model `mistral`. |
| **Happy Path** | **Connection Success** | `Invoke-RestMethod` returns "Ollama is running". | `Test-OllamaConnection` returns `available = $true`. |
| **Happy Path** | **Text Gen** | `Invoke-Ollama -Prompt "Hi"` | Calls API with correct JSON body; Returns content string. |
| **Happy Path** | **JSON Gen** | `Invoke-Ollama -JsonMode` | Request body includes `format: "json"`; prompt includes "Output ONLY valid JSON". |
| **Edge Case** | **Model Override** | `Invoke-Ollama -ModelOverride "gpt4"` | Request body uses "gpt4" instead of configured default. |
| **Edge Case** | **Markdown Strip** | API returns ````json { "key": "val" } ````. | `Invoke-Ollama` with `-JsonMode` returns clean `{ "key": "val" }`. |
| **Error State** | **Connection Fail** | `Invoke-RestMethod` throws Exception. | `Test-OllamaConnection` returns `available = $false`; Logs Debug message. |
| **Error State** | **API Timeout** | `Invoke-RestMethod` exceeds timeout. | `Invoke-Ollama` catches error; Logs "API Request Failed"; returns `$null`. |
| **Error State** | **Empty Response** | API returns object with null `response` prop. | `Invoke-Ollama` logs "returned an empty response"; returns `$null`. |

### 3. Test Data Requirements

**A. API Response Object (Standard Generation)**

```json
{
  "model": "llama3:8b",
  "created_at": "2023-08-04T19:22:45.499127Z",
  "response": "The quick brown fox jumps over the lazy dog.",
  "done": true,
  "context": [1, 2, 3],
  "total_duration": 5589157167,
  "load_duration": 3020514,
  "prompt_eval_count": 26,
  "prompt_eval_duration": 325953000,
  "eval_count": 290,
  "eval_duration": 5259567000
}

```

**B. API Response Object (JSON Mode with Markdown artifact)**

```json
{
  "model": "llama3:8b",
  "response": "```json\n{\n  \"status\": \"success\"\n}\n```",
  "done": true
}

```

**C. Health Check Response**

* **Content:** "Ollama is running" (Plain text string).