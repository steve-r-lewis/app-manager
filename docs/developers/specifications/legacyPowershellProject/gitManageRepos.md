Based on the analysis of the provided PowerShell script `gitManageRepos.ps1`, here is the comprehensive Technical Specification and Test Strategy.

**Note:** While the context provided mentions a Node.js/TypeScript environment, this specific artifact is a **PowerShell Core (pwsh)** automation script. The following specification treats the PowerShell script as the subject under audit, applying strict architectural standards appropriate for DevOps automation.

---

# Part 1: Operational & Design Specification

## 1. Component Overview

* **Name:** `gitManageRepos.ps1`
* **Purpose:** To orchestrate the initialization, synchronization, and structural integrity of the Nuxt 4 Monorepo (Root and Layers). It acts as an idempotent configuration manager for the local Git environment and remote GitHub repositories.
* **Role in System:** **DevOps Utility / Infrastructure as Code**. It bridges the gap between the local file system structure and the remote version control system, automating the "Monorepo with Submodules" pattern. It sits above the Git CLI and GitHub API.

## 2. Architecture & Patterns

* **Design Patterns:**
* **Idempotency:** The script checks the state (`Test-Path`, `git status`) before attempting mutations. It is designed to run safely multiple times without destructive side effects on a healthy repo.
* **Procedural Pipeline:** Execution flows linearly: Initialization -> Root Handling -> Layer Iteration -> Reporting.
* **Rollback Strategy:** Implements a specific rollback mechanism (`Remove-FailedSubmodule`) to ensure atomicity during submodule addition failures.
* **Facade/Wrapper:** Wraps complex Git CLI chains and GitHub API interactions into high-level semantic functions (`Ensure-GitRepo`, `Ensure-Submodule`).


* **State Management:**
* **Stateful:** The script heavily relies on and modifies the state of the File System and the Git Index (`.git`).
* **Global Context:** Uses `$global:` scope for flags (`PushEnabled`, `DebugMode`) and reporting (`OperationReport`), which increases coupling within the script runtime.


* **Complexity Assessment:** **Medium**.
* While the logic flow is linear, the error handling, rollback logic, and integration with AI (LLM) for dynamic commit generation introduce significant branching and external failure points.



## 3. Dependency Graph

### 3.1 Internal Dependencies (Local Modules)

The script relies on a custom utility library located in `./utilities/`:

1. `showMenu.ps1`: Interactive UI rendering.
2. `logger.ps1`: Standardized logging and transcript handling.
3. `github.ps1`: Wrapper for GitHub API interactions (Repo creation/checking).
4. `project.ps1`: Project root validation (`Test-ProjectRoot`).
5. `llm.ps1`: AI Service initialization.
6. `llm-messages.ps1`: AI prompt generation for commit messages.

### 3.2 External Dependencies (System & runtime)

1. **PowerShell Core (pwsh):** Runtime environment.
2. **Git CLI (`git`):** Must be installed and available in `$env:PATH`.
3. **GitHub API:** Accessed via `github.ps1` (likely requires `gh` CLI or REST wrappers).
4. **LLM Provider:** Used for semantic commit message generation.

### 3.3 Coupling Analysis

* **Tightly Coupled:** The script is tightly coupled to the specific folder structure of the Nuxt 4 project (expects a `layers` directory).
* **Tightly Coupled:** Directly dependent on the interface of the `utilities/*.ps1` scripts.

## 4. Data Types & Interfaces

PowerShell utilizes dynamic typing, but the script enforces specific types on parameters.

### Key Data Structures

**1. Operation Report Object (`PSCustomObject`)**
Used to track the status of operations for the final summary.

```powershell
[PSCustomObject]@{
    "Layer/Repo" = [string] # Name of the repo or layer
    "Status"     = [string] # "Success", "Failed", "Fatal"
    "Details"    = [string] # Error message or success note
}

```

**2. Script Parameters**

* `Push`: `[switch]` (Boolean)
* `Debug`: `[switch]` (Boolean)
* `Log`: `[switch]` (Boolean)
* `SkipMenu`: `[switch]` (Boolean)
* `GitHubOrg`: `[string]` (Default: "steve-r-lewis")

## 5. Functional Logic Specification

### 5.1 Helper: `Sanitize-RepoToken`

* **Signature:** `Sanitize-RepoToken([string]$name): [string]`
* **Logic Flow:**
1. Accepts a raw name (e.g., "My Layer Name").
2. Converts to lowercase.
3. Replaces whitespace with hyphens.
4. Removes non-alphanumeric characters (except hyphens).
5. Dedupes hyphens and trims leading/trailing hyphens.


* **Return:** A clean kebab-case string suitable for URLs/Repo names.

### 5.2 Helper: `Remove-FailedSubmodule`

* **Signature:** `Remove-FailedSubmodule([string]$Path): [void]`
* **Logic Flow:**
1. **De-init:** Runs `git submodule deinit -f`.
2. **Remove from Index:** Runs `git rm -f`.
3. **Clean .git modules:** Deletes the specific module configuration from `.git/modules/`.
4. **Clean FS:** Force deletes the directory at `$Path`.


* **Side Effects:** Destructive file system changes (deletion).

### 5.3 Function: `Ensure-GitRepo`

* **Signature:** `Ensure-GitRepo([string]$Path): [void]`
* **Logic Flow:**
1. Checks if `.git` directory exists.
2. **If Missing (Fresh):**
* Runs `git init -b master`.
* Runs `git add -A`.
* Commits with message "Initial commit".


3. **If Exists (Existing):**
* Checks `git status --porcelain` for changes.
* **If Dirty:**
* Stages all changes (`git add -A`).
* Fetches diff (`git diff --staged`).
* **AI Integration:** Calls `Get-LLM-CommitMessage` with the diff to generate a semantic message.
* Commits changes with the generated message.






* **Side Effects:** Modifies `.git` directory, creates commits.
* **Warning:** Implicit return of `git` command outputs if not piped to `Out-Null`.

### 5.4 Function: `Ensure-Remote-And-Push`

* **Signature:** `Ensure-Remote-And-Push([string]$Path, [string]$RemoteUrl): [void]`
* **Logic Flow:**
1. Checks existing remotes.
2. **Case 1:** Remote `origin` exists. Updates URL to `$RemoteUrl` if different.
3. **Case 2:** No remote. Adds `origin` with `$RemoteUrl`.
4. **Push:** If `$global:PushEnabled` is true, executes `git push -u origin --all`.


* **Error Handling:** Catches Git errors and re-throws them to the main loop.

### 5.5 Function: `Ensure-Submodule`

* **Signature:** `Ensure-Submodule([string]$RootPath, [string]$LayerDirName, [string]$LayerRemoteUrl): [void]`
* **Logic Flow:**
1. Calculates relative path: `layers/$LayerDirName`.
2. **Idempotency Check:** Uses `git ls-files --error-unmatch` to see if submodule is already tracked. If yes, returns immediately.
3. **Action:** Executes `git submodule add $LayerRemoteUrl $layerPath`.
4. **Commit:** Commits the `.gitmodules` change ("Add $LayerDirName as submodule").
5. **Push:** Pushes root repo changes (if Push Enabled).


* **Error Handling:**
* Catches failure during `submodule add`.
* **Triggers Rollback:** Calls `Remove-FailedSubmodule`.
* Throws exception to upstream.



---

# Part 2: Appendix - Testing Reference

## 1. Mocking Strategy

Since this is a PowerShell script, testing requires mocking the Commandlets and external binaries. The **Pester** framework is assumed.

### 1.1 External Binaries to Mock

* **`git`:** This is the most critical mock.
* *Mock Behavior:* Must return specific strings based on arguments.
* *Example:* `git status --porcelain` should return an empty string for "Clean" scenarios and a file list string for "Dirty" scenarios.
* *Example:* `git remote get-url origin` must return the expected URL string.



### 1.2 Utility Functions (Dependencies) to Mock

* **`Ensure-GitHubRepo`:**
* *Behavior:* Should return a valid HTTPS Git URL string (e.g., `https://github.com/org/repo.git`) without actually calling GitHub API.


* **`Get-LLM-CommitMessage`:**
* *Behavior:* Return a static string "Feat: Mocked AI Commit" to avoid API costs/latency during tests.


* **`Show-Menu`:**
* *Behavior:* Must be mocked to return a specific selection string (e.g., "Manage & Push (Default)") to allow headless testing of interactive paths.



## 2. Test Scenarios

| Category | Scenario Name | Description | Mock Requirements |
| --- | --- | --- | --- |
| **Happy Path** | **Fresh Initialization** | Run on a folder with no `.git` folder. | `Test-Path .git` returns `$false`. `git init` mocked to succeed. |
| **Happy Path** | **Idempotent Run (Clean)** | Run on an existing clean repo. | `Test-Path .git` returns `$true`. `git status --porcelain` returns `""` (empty). |
| **Happy Path** | **Dirty Repo Auto-Commit** | Run on existing repo with changes. | `git status` returns filenames. `Get-LLM-CommitMessage` returns string. |
| **Happy Path** | **Layer Processing** | Iterates through `layers/` and syncs them. | `Get-ChildItem` returns 2 mock DirectoryInfo objects. |
| **Edge Case** | **Remote URL Update** | Existing origin URL differs from target. | `git remote get-url` returns `old-url`. Verifies `git remote set-url` is called. |
| **Edge Case** | **Submodule Already Exists** | Layer exists and is already a submodule. | `git ls-files` returns exit code 0. Verifies `git submodule add` is **NOT** called. |
| **Error State** | **Submodule Add Failure** | `git submodule add` fails (e.g., auth). | `git submodule add` throws error. Verify `Remove-FailedSubmodule` logic is triggered. |
| **Error State** | **Utility Missing** | Dependent script missing. | `Test-Path` for `utilities/github.ps1` returns `$false`. Script should `exit 1`. |

## 3. Test Data Requirements

### 3.1 Mock File System Structure

Tests should set up a temporary drive or mocked `Get-ChildItem` response representing:

```text
/Root
  ├── .git/ (Optional based on test)
  ├── package.json
  └── layers/
      ├── auth-layer/  (Directory)
      └── ui-layer/    (Directory)

```

### 3.2 Mock Git Status Output (Dirty State)

When mocking `git status --porcelain`, return:

```text
M  package.json
?? layers/new-feature/

```

### 3.3 Mock Diff Output (For AI)

When mocking `git diff --staged`, return:

```diff
diff --git a/package.json b/package.json
index 8932..2394 100644
--- a/package.json
+++ b/package.json
@@ -1,4 +1,4 @@
 {
-  "version": "1.0.0"
+  "version": "1.0.1"
 }

```