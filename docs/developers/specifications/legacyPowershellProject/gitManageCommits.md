# Technical Specification: Git Commit Automation Manager

## Part 1: Operational & Design Specification

### 1. Component Overview

* **Purpose:** `gitManageCommits.ps1` is a PowerShell automation utility designed to streamline the version control workflow within a Nuxt4 Monorepo architecture. It automates the detection of changes, staging of files, semantic commit message generation via an LLM (Large Language Model) provider, and upstream synchronization.
* **Role in System:**
* **DevOps Utility:** It acts as an interactive CLI wrapper around standard Git commands.
* **Workflow Enforcer:** It standardizes commit practices across the Root application and isolated "Layers" by leveraging AI for consistency in commit messages.



### 2. Architecture & Patterns

* **Design Patterns:**
* **Procedural Pipeline:** The script follows a linear execution flow: Configuration  Initialization  Execution Loop (Root + Layers).
* **Facade Pattern:** It abstracts complex Git command sequences (add, diff, commit, push) and API interactions into simple high-level functions (`Process-Repo`).
* **Strategy Pattern (Implied):** via `Initialize-LLM`, the script prepares to use interchangeable AI providers (Gemini/Ollama) without hardcoding logic in the main execution block.


* **State Management:**
* **Stateful:** The script modifies the state of the file system (Git Index) and relies on global scope variables (`$global:DebugMode`, `$global:LogMode`) for cross-function configuration.


* **Complexity Assessment:** **Medium**.
* While the logic flow is linear, the script handles external process execution (Git), string manipulation (Diff parsing), remote API latency (Throttling), and interactive user branching.



### 3. Dependency Graph

**3.1 Internal Dependencies (Utility Scripts)**
The script strictly requires the presence of the following utilities in a sibling `utilities/` directory:

* `logger.ps1`: Standardized output formatting.
* `llm.ps1`: Gateway for LLM provider initialization.
* `llm-messages.ps1`: Specific logic for generating commit messages from diffs.
* `showMenu.ps1`: Interactive CLI UI rendering.
* `project.ps1`: Monorepo path validation.

**3.2 External Dependencies**

* **PowerShell Core (`pwsh`):** Runtime environment.
* **Git CLI:** Must be installed and accessible via `$env:PATH`.
* **LLM Provider:** Access to an external API (Google Gemini) or local server (Ollama), handled by `llm.ps1`.

**3.3 Coupling Analysis**

* **High Coupling:** The script is tightly coupled to the specific directory structure of the project (`~/scripts/utilities` and `layers/`). It is not portable without the accompanying utility library.

### 4. Data Types & Interfaces

**4.1 Script Parameters**
| Parameter | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| `Debug` | `[switch]` | No | Enables verbose debug logging. |
| `Log` | `[switch]` | No | Enables writing logs to a file. |
| `SkipMenu` | `[switch]` | No | Bypasses the initial configuration menu (useful for CI/headless). |

**4.2 Internal Helper Functions**

**Function:** `Process-Repo`

* **Input:**
* `$RepoPath` (`[string]`): The absolute file path to the repository root.


* **Return:** `[void]` (Performs I/O operations and writes to host).

### 5. Functional Logic Specification

#### 5.1 Initialization Phase

1. **Strict Mode:** Enforces `Set-StrictMode -Version Latest` to prevent uninitialized variable usage.
2. **Import Verification:** Iterates through `$requiredScripts`. If any file is missing, the script terminates with exit code `1`.
3. **Interactive Configuration:** Unless `-SkipMenu` is passed, `Show-Menu` prompts the user to toggle Logging or Debug modes.
4. **Service Init:**
* `Initialize-Logger`: Sets up log files/streams.
* `Initialize-LLM`: Configures the AI provider context.



#### 5.2 Helper: `Process-Repo($RepoPath)`

* **Context:** Runs inside a specific repository directory.
* **Logic Flow:**
1. **Directory Switch:** `Push-Location` to target `$RepoPath`.
2. **Change Detection:** Executes `git status --porcelain`. If empty, logs "Clean" and exits function.
3. **Staging:** Executes `git add -A` (stages all changes).
4. **Diff Capture & Sanitization:**
* Executes `git diff --staged`.
* **Edge Case Handling:** Explicitly converts the output to `[string]`. If Git returns an array of lines, it joins them with `\n` to prevent `Substring` errors.
* **Validation:** If the diff is empty (common with binary-only changes), returns early.
* **Truncation:** If diff length > 6000 characters, it truncates and appends `...(truncated)` to prevent LLM token overflow.


5. **AI Generation:**
* **Throttling:** Sleeps for 2 seconds (API rate limit protection).
* Calls `Get-LLM-CommitMessage -Diff $diff`.


6. **Interactive Review:** Presents a menu via `Show-Menu` with the AI suggestion.
* **Accept & Push:** Commits with AI message  Pushes  Logs Success.
* **Enter Custom Message:** Prompts `Read-Host`. If valid, Commits  Pushes.
* **Skip:** Logs info and performs no Git actions.


7. **Cleanup:** `Pop-Location` to return to previous directory.



#### 5.3 Main Execution Loop

1. **Validation:** Calls `Test-ProjectRoot` to ensure execution within the valid Monorepo root.
2. **Root Processing:** Calls `Process-Repo` on the current root (`$rootPath`).
3. **Layer Processing:**
* Scans `$rootPath/layers` for subdirectories.
* Checks if a `.git` folder exists within the subdirectory.
* If a git repo is found, calls `Process-Repo`.



---

## Part 2: Appendix - Testing Reference

### 1. Mocking Strategy

To verify this script without performing actual Git operations or incurring LLM costs, the following mocks are required using Pester (PowerShell Testing Framework).

**1.1 Command/Function Mocks**

* **`Get-Location`**: Mock to return a fixture path (e.g., `C:\Test\Monorepo`).
* **`Push-Location` / `Pop-Location**`: Mock to track directory navigation without actual filesystem movement.
* **`git`**: Crucial mock.
* `git status --porcelain`: Mock to return strings (dirty) or `$null` (clean).
* `git diff --staged`: Mock to return a sample diff string.
* `git add`, `git commit`, `git push`: Mock to return `$true` (or throw errors for negative testing).


* **`Get-LLM-CommitMessage`**: Mock to return "feat: Added AI generated feature".
* **`Initialize-LLM` / `Initialize-Logger**`: Mock to prevent actual setup overhead.
* **`Show-Menu`**: Mock to return specific strings (e.g., "Accept & Push") to drive logic flow.

**1.2 External Utility Mocks**
Since the script dot-sources files (`. $scriptPath`), the test environment must ensure these functions are defined in the session *before* the script runs, or the script must be refactored to allow dependency injection of the script paths.

### 2. Test Scenarios

| Category | Scenario ID | Description | Input State | Mock Behavior | Expected Outcome |
| --- | --- | --- | --- | --- | --- |
| **Happy Path** | HP-01 | Root Repo Clean | Root: Clean | `git status` returns $null | Log "Clean", No API call. |
| **Happy Path** | HP-02 | Root Dirty, AI Accept | Root: Dirty | `git status` returns "M file.txt"<br>

<br>`Show-Menu` returns "Accept & Push" | `git add`, `git commit`, `git push` called. |
| **Happy Path** | HP-03 | Layer Repo Processing | Layers: 1 found | `Get-ChildItem` returns 1 dir with .git | `Process-Repo` called twice (Root + Layer). |
| **Edge Case** | EC-01 | Huge Diff Truncation | Diff > 6000 chars | `git diff` returns 10k chars | `Get-LLM-CommitMessage` receives truncated string. |
| **Edge Case** | EC-02 | Binary File (Empty Diff) | Staged binary | `git diff` returns "" or whitespace | Log warning "Staged changes are empty", Return early. |
| **Edge Case** | EC-03 | Diff as Array | Diff is multi-line | `git diff` returns `String[]` | Script joins array to string, no crash on `Substring`. |
| **Interactive** | INT-01 | User Custom Message | AI suggests garbage | `Show-Menu` returns "Enter Custom Message"<br>

<br>`Read-Host` input "fix: manual" | Commit uses "fix: manual", not AI message. |
| **Error State** | ERR-01 | Utility Missing | `logger.ps1` missing | `Test-Path` returns `$false` | Script exits with code 1. |

### 3. Test Data Requirements

**3.1 Sample Diff Object (String)**

```text
diff --git a/src/app.ts b/src/app.ts
index 83db48f..bf3219a 100644
--- a/src/app.ts
+++ b/src/app.ts
@@ -10,4 +10,5 @@
+ console.log('New Feature Init');

```

**3.2 Directory Structure Fixture**

```text
/MockRepo
    /layers
        /auth-layer
            /.git
            /package.json
        /ui-layer
            (no .git folder) -> Should be ignored
    package.json
    .git

```