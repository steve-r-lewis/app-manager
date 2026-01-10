Based on the analysis of the provided file `llm.ps1`, here is the **Technical Specification Document** and **Test Strategy Appendix**.

**Note on Context:** While the broader application context is Node.js/TypeScript, this specific file is a **PowerShell Automation Utility**. It functions as a DevOps or scaffolding tool, likely used by developers to generate code or documentation via LLMs within the command-line environment. The analysis reflects its nature as a scripting component.

---

# Part 1: Operational & Design Specification

## 1. Component Overview

* **Purpose:** The `llm.ps1` script acts as a **Centralized Gateway (Router)** for Large Language Model (LLM) interactions within the project's automation suite. It abstracts specific provider implementations, allowing the system to switch between cloud-based (Gemini) and local (Ollama) inference engines dynamically.
* **Role in System:** **Infrastructure Utility / Adapter Layer**. It sits between the consumer (e.g., a scaffolding script or developer CLI tool) and the external AI services. It is responsible for initialization, configuration, and request dispatching.

## 2. Architecture & Patterns

* **Design Patterns:**
* **Strategy Pattern:** The primary pattern. The script defines a common interface (`Invoke-LLM`) and swaps the underlying "strategy" (Gemini vs. Ollama) based on configuration.
* **Singleton (Scoped):** The `$script:ActiveProvider` variable maintains the state of the selected provider for the duration of the PowerShell session.
* **Facade:** `Invoke-LLM` provides a simplified interface that hides the complexity of parameter mapping for different providers.


* **State Management:** **Stateful**.
* The script maintains state via the `$script:ActiveProvider` variable.
* *Risk:* State is mutable and persists for the lifecycle of the PowerShell session, which could lead to side effects if the script is dot-sourced multiple times with conflicting configurations.


* **Complexity Assessment:** **Low**.
* Control flow is linear with simple conditional branching (`if/else`) based on environment variables or menu selection. There is no complex recursion or data transformation logic within this specific file.



## 3. Dependency Graph

* **Internal Dependencies (Dynamic Imports):**
* `./gemini.ps1`: Concrete implementation for Google Gemini.
* `./ollama.ps1`: Concrete implementation for Local Ollama.
* `./showMenu.ps1`: Utility for interactive CLI selection (conditionally loaded if `Show-Menu` is not present).


* **External Dependencies:**
* **PowerShell Host:** Relies on `Write-Host` (implied via custom logging wrappers like `Log-Info`) and interactive console capabilities.
* **Environment Variables:** `$env:LLM_PROVIDER`.


* **Coupling Analysis:** **Medium-High**.
* The script is tightly coupled to the physical file structure (`Join-Path $currentDir`). Moving `gemini.ps1` or `ollama.ps1` would break this router immediately.
* It assumes specific function signatures exist in the imported files (`Invoke-Gemini`, `Invoke-Ollama`, `Test-OllamaConnection`).



## 4. Data Types & Interfaces

As PowerShell is dynamically typed, interfaces are implied.

* **Key Interfaces (Implied Contracts):**
* **Provider Invocation Contract:**
```powershell
Invoke-{Provider}(
    [string]$Prompt,
    [string]$SystemPrompt,
    [double]$Temperature,
    [switch]$JsonMode,
    [string]$ModelOverride
)

```




* **Return Types:**
* `Initialize-LLM`: `void` (Side effect: modifies `$script:ActiveProvider`).
* `Invoke-LLM`: `Object` | `String`.
* *Warning:* The return type is implicit. It returns whatever `Invoke-Gemini` or `Invoke-Ollama` returns. Ideally, this should be standardized to a specific custom object (PSCustomObject) containing `.Content` and `.Metadata` to ensure strict typing.





## 5. Functional Logic Specification

### 5.1 Function: `Initialize-LLM`

* **Method Signature:** `Initialize-LLM([switch]$SkipMenu): void`
* **Logic Flow:**
1. **Environment Check:** Checks if `$env:LLM_PROVIDER` exists. If yes, sets `$script:ActiveProvider` to the lowercase value and returns immediately.
2. **Non-Interactive Check:** If `$SkipMenu` switch is passed, logs a warning, defaults to "gemini", and returns.
3. **Interactive Selection:**
* Defines options: "Ollama (Local - Llama3)" and "Gemini (Cloud - Google)".
* Calls `Show-Menu` with `ClearScreen $true`.


4. **Configuration:**
* **If Ollama selected:** Sets provider to "ollama". Calls `Test-OllamaConnection`. Logs warning if connection fails (does *not* halt execution).
* **If Gemini selected:** Sets provider to "gemini".


5. **Logging:** Logs the active provider.


* **Side Effects:**
* Modifies script-scope variable `$script:ActiveProvider`.
* Writes to Console (Logging).


* **Error Handling:**
* Soft error handling for Ollama availability (logs warning only).
* No validation is performed on `$env:LLM_PROVIDER` input (e.g., if set to "ChatGPT", the script sets the variable but subsequent `Invoke-LLM` calls will fail silently or behave unpredictably).



### 5.2 Function: `Invoke-LLM`

* **Method Signature:**
```powershell
Invoke-LLM(
    [string]$Prompt (Mandatory),
    [string]$SystemPrompt,
    [double]$Temperature = 0.7,
    [switch]$JsonMode,
    [string]$ModelOverride
): Object

```


* **Logic Flow:**
1. Checks `$script:ActiveProvider`.
2. **Branch A (Ollama):** Calls `Invoke-Ollama` passing all parameters strictly.
3. **Branch B (Else/Gemini):** Calls `Invoke-Gemini` passing all parameters strictly.


* **Side Effects:** Triggers network requests via the delegate functions.
* **Error Handling:**
* None internal to this function. Errors thrown by the concrete implementations propagate up to the caller.



---

# Part 2: Appendix - Testing Reference

## 1. Mocking Strategy

Since this is a router script, unit tests must verify the *routing logic*, not the actual LLM calls. Pester (PowerShell Testing Framework) is assumed.

* **Services to Mock:**
* `Invoke-Gemini`: Mock to return a dummy string "Gemini Response".
* `Invoke-Ollama`: Mock to return a dummy string "Ollama Response".
* `Test-OllamaConnection`: Mock to return `@{ available = $true; url = "http://localhost:11434" }`.
* `Show-Menu`: Mock to return string selections ("Ollama..." or "Gemini...").
* `Write-Host` / `Log-Info` / `Log-Warning`: Mock to verify output messages without cluttering test console.


* **Mock Behaviour:**
* *Scenario: Provider Routing:* Mock `Invoke-Gemini` to verify it was called when `$script:ActiveProvider` is "gemini".
* *Scenario: Connection Failure:* Mock `Test-OllamaConnection` to return `@{ available = $false }` to verify the warning log appears.



## 2. Test Scenarios

| Category | Scenario | Input Data | Expected Result |
| --- | --- | --- | --- |
| **Happy Path** | **Env Var Initialization** | `$env:LLM_PROVIDER = "ollama"`, Call `Initialize-LLM` | `$script:ActiveProvider` is "ollama". Menu is NOT shown. |
| **Happy Path** | **Skip Menu Fallback** | `$env:LLM_PROVIDER = $null`, Call `Initialize-LLM -SkipMenu` | `$script:ActiveProvider` is "gemini". Warning logged. |
| **Happy Path** | **Interactive Selection** | Mock `Show-Menu` returns "Ollama...", Call `Initialize-LLM` | `$script:ActiveProvider` is "ollama". `Test-OllamaConnection` is called. |
| **Happy Path** | **Routing Gemini** | `$script:ActiveProvider = "gemini"`, Call `Invoke-LLM -Prompt "Hi"` | `Invoke-Gemini` is called. Result matches mock. |
| **Edge Case** | **Case Insensitivity** | `$env:LLM_PROVIDER = "GeMiNi"`, Call `Initialize-LLM` | `$script:ActiveProvider` becomes "gemini" (lowercase). |
| **Edge Case** | **Model Override** | Call `Invoke-LLM -ModelOverride "gpt-4"` | Verify `ModelOverride` param is passed to the delegate function. |
| **Error State** | **Ollama Offline** | `Show-Menu` returns "Ollama", Mock `Test-OllamaConnection` returns available=$false | Warning logged: "Ollama server not detected...". execution continues (provider remains ollama). |
| **Error State** | **Unknown Env Var** | `$env:LLM\_PROVIDER = "InvalidProvider"` , Call  `Initialize-LLM` | `$script:ActiveProvider`set to "invalidprovider". *Note: This reveals a bug in the spec;`Invoke-LLM\` will default to Gemini (Else block) or fail if logic changes.* |

## 3. Test Data Requirements

**Prompt Object:**

```json
{
  "Prompt": "Refactor this code to use Singleton pattern",
  "SystemPrompt": "You are a Senior Architect",
  "Temperature": 0.2,
  "JsonMode": true
}

```

**Mock Connection Status (Ollama):**

```powershell
# Success
@{ available = $true; url = "http://localhost:11434" }

# Failure
@{ available = $false; url = "http://localhost:11434" }

```

**Next Step for User:**
Would you like me to generate the **Pester Unit Test script** (`llm.tests.ps1`) based on this strategy to immediately audit the routing logic?