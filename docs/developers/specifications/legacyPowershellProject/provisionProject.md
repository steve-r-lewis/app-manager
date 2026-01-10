# Technical Specification: Nuxt 4 Monorepo Provisioning Orchestrator

## Part 1: Operational & Design Specification

### 1. Component Overview

* **Purpose:** `provisionProject.ps1` serves as the "Zero to Hero" bootstrapping agent for the Nuxt 4 Monorepo. Its primary function is to transform a freshly cloned repository into a fully functional development environment by validating system requirements, hydrating dependencies, and configuring local environment secrets.
* **Role in System:** **DevOps Orchestrator**. It sits at the root of the developer workflow, acting as the entry point for environment setup. It delegates specific tasks (dependency installation, git initialization) to specialized sub-scripts while managing the high-level flow and error reporting.

### 2. Architecture & Patterns

* **Design Patterns:**
* **Orchestrator Pattern:** The script does not implement the logic for git management or package installation directly; instead, it coordinates the execution of `nuxtManager.ps1` and `gitManageRepos.ps1`.
* **Fail-Fast Strategy:** Utilizes `$ErrorActionPreference = "Stop"` and `Set-StrictMode` to ensure that any unhandled exception or uninitialized variable immediately halts execution to prevent inconsistent states.
* **Idempotency (Partial):** The logic checks for the existence of files (e.g., `.env`, `.vscode/settings.json`) before attempting creation, allowing the script to be re-run safely without overwriting existing local configurations.


* **State Management:**
* **Stateless Execution:** The script itself does not maintain session state between runs.
* **File System State:** It modifies the file system state (creates config files, installs node modules).


* **Complexity Assessment:** **Medium**. While the control flow is linear, the complexity arises from the extensive environmental coupling (Node versions, Global NPM modules, Sub-process execution) and interactive menu logic.

### 3. Dependency Graph

* **Internal Dependencies (Utilities):**
* `utilities/logger.ps1` (Logging and output formatting)
* `utilities/showMenu.ps1` (Interactive CLI menus)
* `utilities/fileSystem.ps1` (File I/O operations)
* `nuxtManager.ps1` (Sub-process: Dependency hydration)
* `gitManageRepos.ps1` (Sub-process: Git submodule/hook setup)


* **External Dependencies (System):**
* **PowerShell Core (pwsh):** Runtime environment.
* **Node.js:** Required version >= 20.0.0.
* **Git:** Required for version control operations.
* **PNPM:** Package manager (auto-installed via NPM if missing).


* **Coupling Analysis:** **High Coupling**. The script is tightly coupled to the specific file structure of the repository (hardcoded relative paths to utilities and sub-scripts) and specific versions of external tools (e.g., `pnpm@10.24.0`).

### 4. Data Types & Interfaces

* **Key Parameters (Inputs):**
* `[switch]$Debug`: Enables verbose output.
* `[switch]$Log`: Enables file-based logging.
* `[switch]$SkipMenu`: Bypasses interactive configuration prompts (CI/CD friendly).


* **Global Variables:**
* `$global:DebugMode`: Boolean flag for system-wide debug tracing.
* `$global:LogMode`: Boolean flag for disk logging.



### 5. Functional Logic Specification

#### `Test-Command`

* **Signature:** `Test-Command(string $Name): boolean`
* **Logic Flow:** Uses `Get-Command` to verify if a binary exists in the system `$env:PATH`.
* **Returns:** `$true` if found, `$false` otherwise.

#### `Check-Prerequisites`

* **Signature:** `Check-Prerequisites(): void`
* **Logic Flow:**
1. **Node Check:** Verifies `node` exists. Parses `node -v` output. Throws error if version is `< 20.0.0`.
2. **Git Check:** verifies `git` exists. Throws error if missing.
3. **PNPM Check:** Verifies `pnpm` exists. If missing, attempts `npm install -g pnpm@10.24.0`.


* **Side Effects:** May install global NPM packages.
* **Error Handling:** Throws "Prerequisite Check Failed" if critical tools are missing or incompatible.

#### `Setup-Environment`

* **Signature:** `Setup-Environment(): void`
* **Logic Flow:**
1. **Template Copying:** Checks for `.env`. If missing, copies `.env.example`. If example missing, writes a hardcoded fallback string.
2. **Credential Hydration:** Checks specifically for `GEMINI_API_CREDENTIALS`.
3. **Interactive Setup:** If credentials missing and `!$SkipMenu`, prompts user for API key via `Show-Menu` and `Read-Host`.
4. **Persistence:** Appends constructed JSON credential string to `.env`.


* **Side Effects:** Creates/Modifies `.env` file.

#### `Setup-VSCode`

* **Signature:** `Setup-VSCode(): void`
* **Logic Flow:**
1. Checks `.vscode` directory.
2. Copies `extensions.json.example` to `extensions.json` if target is missing.
3. Copies `settings.json.example` to `settings.json` if target is missing.


* **Side Effects:** Creates user-specific VS Code configuration files.

#### Main Execution Block

* **Logic Flow:**
1. Imports utilities.
2. Initializes Logger.
3. Executes `Check-Prerequisites`.
4. Executes `Setup-Environment`.
5. **Delegation:** Invokes `nuxtManager.ps1` using the call operator `&`.
6. **Delegation:** Invokes `gitManageRepos.ps1` with `-Push:$false`.
7. Executes `Setup-VSCode`.


* **Error Handling:** Wrapped in a global `try/catch`. Catches any stopping error, logs it via `Log-Error`, records a "Fatal" report entry, and exits with code `1`.

---

## Part 2: Appendix - Testing Reference

### 1. Mocking Strategy

To unit test this PowerShell script without altering the actual system state, the following Pester (PowerShell Testing Framework) mocks are required:

* **Utility Imports:** Mock the dot-sourcing of `logger.ps1`, `showMenu.ps1`, and `fileSystem.ps1`.
* **Command Execution (`Get-Command`, `Invoke-Expression`, `&`):**
* Mock `Get-Command` to simulate the presence/absence of Node, Git, and PNPM.
* Mock the `&` call operator to verify `nuxtManager.ps1` and `gitManageRepos.ps1` are called with correct parameters without actually running them.


* **File System (`Test-Path`, `Copy-Item`, `Get-Content`, `Set-Content`):**
* Mock `Test-Path` to simulate scenarios where `.env` or `.vscode` files do or do not exist.
* Mock `Copy-Item` to verify file creation logic.


* **User Input (`Read-Host`):**
* Mock `Read-Host` to inject API keys during the interactive environment setup tests.



### 2. Test Scenarios

| Category | Scenario Name | Description | Mock Behavior |
| --- | --- | --- | --- |
| **Happy Path** | **Full Provision Run** | User runs script, all tools exist, `.env` created from example, sub-scripts called. | `Test-Path` returns `$true` for examples. `Get-Command` returns valid objects. |
| **Edge Case** | **Existing Env** | User runs script where `.env` and `.vscode` configs already exist. | `Test-Path` returns `$true` for target files. Ensure `Copy-Item` is **NOT** called. |
| **Edge Case** | **No Example Files** | Repository is missing `.env.example`. | `Test-Path` returns `$false` for example. Verify `Set-Content` writes the fallback hardcoded config. |
| **Edge Case** | **CI/CD Mode** | Run with `-SkipMenu`. | Verify `Show-Menu` is never called. Verify interactive API setup is skipped. |
| **Error State** | **Old Node Version** | Node version is 18.x. | Mock `node -v` to return "v18.1.0". Verify script throws "Prerequisite Check Failed". |
| **Error State** | **Missing Git** | Git binary missing from PATH. | Mock `Get-Command git` to return `$null`. Verify script throws. |
| **Error State** | **Sub-script Failure** | `nuxtManager.ps1` throws an error. | Mock `&` for nuxtManager to `throw "Install Failed"`. Verify global `catch` block handles it and exits 1. |
| **Error State** | **Missing Utility** | Utility script (e.g., `logger.ps1`) is missing. | Mock `Test-Path` for utility to return `$false`. Verify immediate fatal exit. |

### 3. Test Data Requirements

**Mock Node Version Outputs:**

```powershell
# Passing
$NodeVerPass = "v20.10.0"

# Failing
$NodeVerFail = "v18.17.0"

```

**Mock Environment File Content:**

```text
# .env.example content
GEMINI_API_CREDENTIALS=''
GITHUB_TOKEN=''

```

**Mock Gemini API Input:**

```json
{
  "APIKey": "AIzaSyD-TestKey12345",
  "Model": "gemini-2.0-flash"
}

```