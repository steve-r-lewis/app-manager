# 📋 Feature 7: Delete Remote Repository (`git.delete`)

**Legacy Reference:** `deleteRemoteRepos.ts.old` 

## 1. User Story

As an administrator cleaning up old projects, I want to delete a remote GitHub repository directly from the CLI, but with strict safety checks to prevent accidental data loss.

## 2. Inputs & Configuration

* **Options:**
* `--repo` (String): Format `owner/name` or just `name`.
* `--confirm` (String): The magic word "DELETE" to bypass the prompt.

## 3. Functional Requirements

  1. **Target Selection:**
    * **Headless:** Parse `--repo`. Handle both `name` (use current user/org) and `owner/name` formats .
    * **Interactive:** Fetch list via `github.listRepos()`.
    * Show detailed list with Private/Public hints.

  2. **Safety Confirmation (Critical):**
    * **Requirement:** The user MUST input the string "DELETE" (case-insensitive in legacy, but strictly enforced in prompt text).
    * **Prompt:** `Type "DELETE" to confirm destruction of ${owner}/${name}`.
    * **Validation:** If input is not "DELETE", abort operation.

  3. **Execution:**
    * Call `github.deleteRepo(owner, name)`.
    * Log success or failure.

## 4. Gap Analysis

* **Strict Typos:** The legacy code allows case-insensitive check (`value.toUpperCase() !== 'DELETE'`), but the prompt implies strictness. We should maintain the "Type DELETE" pattern as it is a standard safety pattern in cloud CLIs.
* **List Fetching:** Requires `githubService` to expose `listRepos()`.

---

## **Function Analysis: `deleteRemoteRepos**`

### **1. Overview**

This is an asynchronous function designed to permanently delete a remote GitHub repository. It is built to support two modes of operation:

1. **Headless/CLI Mode:** Where arguments for the repository name and confirmation string are passed directly (useful for scripts).
2. **Interactive Mode:** Where the user selects a repository from a fetched list and must manually type a confirmation phrase to proceed.

### **2. Function Specification**

* **Signature:** `export async function deleteRemoteRepos(options: DeleteRepoOptions = {}): Promise<void>` 
* **Parameters:**
  * `options` (optional): An object of type `DeleteRepoOptions` containing:
  * `repo` (string, optional): The repository identifier (e.g., "owner/repo" or just "repo").
  * `confirm` (string, optional): A confirmation string (e.g., "DELETE") to bypass the interactive safety prompt.
* **Return Value:** `Promise<void>` (The function performs side effects—API calls and logging—without returning a value).

### **3. Operational Workflow**

**Phase 1: Repository Identification**

  1. **Default Owner:** Initializes the default owner using the `GITHUB_ORG` environment variable, falling back to `'steve-r-lewis'` if not set.

  2. **Argument Check:**
    * If `options.repo` is provided, it parses the string. If a slash (`/`) is present, it splits the string into `owner` and `name`. Otherwise, it assumes the default owner.

  3. **Interactive Selection (Fallback):**
    * If no repository argument is provided, it fetches a list of repositories using `github.listRepos()`.
    * If the list is empty, it warns the user and exits.
    * It presents a selectable list of repositories using `select`, displaying the full name and visibility (Public/Private).
    * It parses the selected object to extract the correct `owner` and `name`.
    * If the user cancels the selection, the function exits.

**Phase 2: Safety Confirmation**

  1. **Check Argument:** It checks if `options.confirm` was passed.
  2. **Interactive Prompt:**
    * If no confirmation argument exists, it prompts the user to type "DELETE" using `text`.
    * It validates that the input strictly equals "DELETE" (case-insensitive in logic, but the prompt asks for uppercase).
    * If the user cancels the prompt, the function exits.

**Phase 3: Execution**

  1. **Final Verification:** It checks if the final confirmation string matches `'DELETE'`.
  2. **API Call:** It attempts to call `github.deleteRepo(owner, name)`.
  3. **Error Handling:** It wraps the call in a try-catch block to log an error if the API request fails.
  4. **Mismatch Warning:** If the confirmation string did not match, it logs a warning that the deletion was cancelled.

### **4. Dependencies**

The function relies on the following internal and external modules:

* **`@clack/prompts`:** Used for the interactive CLI elements (`intro`, `outro`, `select`, `text`, `isCancel`).
* **`../../services/loggerService`:** A custom wrapper for logging info, warnings, and errors (`logger`).
* **`../../services/githubService`:** A custom service handling GitHub API logic (`listRepos`, `deleteRepo`).
* **`picocolors`:** Used to color the confirmation prompt text red for emphasis (`pc.red`).
* **`../../types/gitTypes`:** Provides the type definition for `DeleteRepoOptions`.

---

## **Usage Example**

```typescript
import { deleteRemoteRepos } from './path/to/deleteRemoteRepos';

// Interactive usage (will prompt for selection and confirmation)
await deleteRemoteRepos();

// Headless usage (will delete 'steve-r-lewis/my-app' without prompts)
await deleteRemoteRepos({ 
    repo: 'steve-r-lewis/my-app', 
    confirm: 'DELETE' 
});
```

---

## **Possible next steps**

* Create the `githubService` mock or implementation that is referenced in this file?
* Refactor the confirmation logic to be case-insensitive or require the exact repository name for higher security?
* Add a logic branch to also delete the local directory if the remote deletion is successful?
