### Part 1: Operational & Design Specification

#### 1. Component Overview

* **Purpose:** The `nuxtCreateLayer.ps1` script acts as an intelligent scaffolding agent designed to automate the provisioning of new "Layers" within a Nuxt 4 monorepo architecture.
* **Role in System:** It functions as a **DevOps Infrastructure Utility**. It resides outside the runtime application logic, serving as a developer tool to enforce consistent directory structures and generate boilerplate configuration files populated with context-aware content via an LLM.

#### 2. Architecture & Patterns

* **Design Patterns:**
* **Template Method:** The script utilizes raw string templates (`$TemplatePkgJson`, `$TemplateNuxtConfig`, etc.) acting as skeletons, which are hydrated with specific data during execution.
* **Service Locator (File-based):** Dependencies are resolved dynamically by locating and dot-sourcing utility scripts (`logger.ps1`, `llm.ps1`) from a relative path.
* **Fall-back Strategy:** The `Generate-LayerMetadata` function implements a resilience pattern; if the AI generation fails or returns invalid JSON, it defaults to hardcoded values to ensure the scaffolding process completes.


* **State Management:**
* **Session-Scoped State:** The script maintains global state variables `$global:DebugMode` and `$global:LogMode` to control verbosity throughout the execution session.
* **Transient State:** Data such as `$LayerName`, `$Purpose`, and `$AI` (metadata) exist only during the runtime of the script.


* **Complexity Assessment:** **Low**.
* The control flow is primarily linear: Initialize  Input  Generate  Write.
* Complexity is localized within the generic `Invoke-LLM` call (abstracted away) and the JSON parsing logic.



#### 3. Dependency Graph

* **Internal Dependencies (Utility Scripts):**
* `utilities/logger.ps1`: Handles formatted output and logging.
* `utilities/llm.ps1`: Gateway for AI/LLM interactions (replaces legacy `Invoke-Gemini`).
* `utilities/fileSystem.ps1`: Provides `Set-ContentAtomic` for safe file writing.
* `utilities/showMenu.ps1`: Provides the interactive CLI UI.


* **External Dependencies:**
* **PowerShell Core (pwsh):** The runtime environment.
* **LLM Provider:** Implicit dependency via `llm.ps1` (Gemini or Ollama).


* **Coupling Analysis:**
* **Tight Coupling:** The script is tightly coupled to the specific monorepo folder structure, specifically expecting a `../../layers` directory relative to the script location.
* **Loose Coupling (AI):** The switch to `Invoke-LLM` decouples the script from a specific AI provider (Gemini vs Ollama), allowing the utility script to handle the implementation details.



#### 4. Data Types & Interfaces

While PowerShell is dynamically typed, the script enforces specific data structures.

**Key Interfaces (Implicit):**

1. **AI Response Object:**
Expected structure returned from `Invoke-LLM` (JsonMode):
```json
{
  "readme": "string (2-3 paragraphs)",
  "jsdoc": "string (approx 60 words)",
  "pkgJson": "string (max 20 words)"
}

```



**Function Signatures & Return Types:**

* `Generate-LayerMetadata`:
* **Params:** `$LayerName` (string), `$Purpose` (string).
* **Returns:** `PSCustomObject` (Parsed JSON from AI or Default Fallback Hashtable).


* `Write-TemplateFile`:
* **Params:** `$TargetDir` (string), `$FileName` (string), `$Template` (string), `$Replacements` (Hashtable).
* **Returns:** `void` (Side effect: Writes file to disk).



#### 5. Functional Logic Specification

**A. Initialization & Configuration**

* **Logic:** Sets strict mode. Resolves the path to the `utilities` directory. Loops through required scripts (`logger.ps1`, `llm.ps1`, etc.) and dot-sources them.
* **Error Handling:** If a utility script is missing (`Test-Path` fails), the script terminates immediately with exit code 1.

**B. Interactive Menu**

* **Logic:** Checks if `$SkipMenu`, `$Log`, or `$Debug` are false. If so, invokes `Show-Menu` to allow the user to toggle Logging and Debugging flags interactively. Initializes the Logger and LLM utilities based on these selections.

**C. `Generate-LayerMetadata**`

* **Signature:** `Generate-LayerMetadata($LayerName, $Purpose)`
* **Logic Flow:**
1. Constructs a System Prompt defining the AI as a "code scaffolding assistant".
2. Constructs a User Prompt including the layer name, user purpose, and strict JSON schema requirements.
3. Calls `Invoke-LLM -JsonMode`.
4. **Try/Catch:** Attempts to convert the resulting string from JSON.
5. **Fallback:** If conversion fails or string is empty, returns a default Hashtable to prevent script failure.


* **Side Effects:** Network call via `Invoke-LLM`.

**D. Main Scaffolding Logic**

* **Logic Flow:**
1. **Input:** Prompts user via `Read-Host` for Layer Name and Purpose.
2. **Validation:** Checks if Layer Name is empty or if the directory already exists.
3. **Data Prep:** Generates timestamps (`yyyy MMM dd`) and revisions. Word-wraps the AI-generated JSDoc text to 75 characters per line.
4. **Execution:** Creates the directory. Iterates through 6 predefined templates (`package.json`, `tsconfig.json`, `.gitignore`, `LICENSE`, `README.md`, `nuxt.config.ts`), performs token replacement, and writes them using `Write-TemplateFile`.


* **Side Effects:** Creates a directory; creates 6 files on the file system.

---

### Part 2: Appendix - Testing Reference

#### 1. Mocking Strategy

To unit test this script (using Pester), the following dependencies must be mocked to avoid side effects and non-determinism.

* **`Read-Host`:** Must be mocked to inject the `$LayerName` and `$Purpose` without user intervention.
* **`Invoke-LLM`:**
* *Mock Behavior 1 (Success):* Return a valid JSON string matching the interface defined in Section 4.
* *Mock Behavior 2 (Failure):* Return `$null` or invalid JSON to test the `Generate-LayerMetadata` fallback logic.


* **`Set-ContentAtomic`:** Mock to verify it is called with the correct path and content, preventing actual disk writes.
* **`New-Item`:** Mock to simulate directory creation.
* **`Test-Path`:**
* *Mock Behavior 1:* Return `$false` (Target directory does not exist).
* *Mock Behavior 2:* Return `$true` (Target directory exists) to test the abort logic.


* **`Show-Menu`:** Mock to bypass UI during automated testing.

#### 2. Test Scenarios

| Category | Scenario Name | Description | Key Mock/Input | Expected Outcome |
| --- | --- | --- | --- | --- |
| **Happy Path** | **Standard Creation** | User provides valid name/purpose; AI returns valid JSON. | `Invoke-LLM` returns valid JSON. `Test-Path` returns `$false`. | Directory created; 6 files written; specific strings from AI present in `README.md`. |
| **Edge Case** | **AI Failure Fallback** | AI service is down or returns malformed data. | `Invoke-LLM` returns garbage string or `$null`. | Script proceeds; `README.md` contains default "The @monorepo/..." text instead of AI content. |
| **Edge Case** | **JSDoc Wrapping** | AI returns a very long JSDoc string. | `Invoke-LLM` returns 200-word `jsdoc` string. | `nuxt.config.ts` content shows `*` prefixes and line breaks every ~75 chars. |
| **Error State** | **Dir Exists** | User tries to create a layer that already exists. | `Test-Path` returns `$true` for the target dir. | Script logs "Directory already exists" and exits with code 1. |
| **Error State** | **Missing Utility** | A required utility script is deleted. | `Test-Path` returns `$false` for `llm.ps1`. | Script prints "FATAL: Missing utility" and exits before user input. |
| **Error State** | **Empty Input** | User provides empty layer name. | `Read-Host` returns `""` or `"  "`. | Script logs "Layer name is required" and exits with code 1. |

#### 3. Test Data Requirements

**Scenario 1: AI Success JSON (Mock Return for `Invoke-LLM`)**

```json
{
    "readme": "This layer handles all recurring billing logic and Stripe webhooks. It isolates payment processing from the core application.",
    "jsdoc": "This configuration file defines the billing module boundaries, including middleware for subscription validation.",
    "pkgJson": "Billing and Subscription Logic"
}

```

**Scenario 2: Template Replacements (Verification Data)**
When testing `Write-TemplateFile` for `package.json`:

```powershell
$ExpectedContent = '{
    "name": "@monorepo/billing",
    "version": "1.0.0",
    "description": "Billing and Subscription Logic",
    ...
}'

```

**Scenario 3: Date/Time Mocks**
Since the script uses `Get-Date`, tests should mock `Get-Date` to return a fixed timestamp (e.g., `2025-01-01 12:00:00`) to ensure file content assertions (Copyright year, creation headers) are deterministic.

---

**Next Step:** Would you like me to generate a Pester test script (`nuxtCreateLayer.Tests.ps1`) implementing these mocks and scenarios?