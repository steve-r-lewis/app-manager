Here is the comprehensive Technical Specification and Test Strategy based on the provided source code.

### Part 1: Operational & Design Specification

**1. Component Overview**

* 
**Purpose:** The `deleteRemoteRepos` component serves as a CLI command execution unit designed to permanently remove a remote repository from GitHub. It supports both "headless" execution (via arguments) and interactive execution (via UI prompts).


* **Role in System:** This component acts as a **Command Module** within the application's CLI layer. It functions as an orchestration layer, bridging user input (via `@clack/prompts`) with business logic (via `githubService`).



**2. Architecture & Patterns**

* **Design Patterns:**
* 
**Facade Pattern:** The component relies on `githubService` to abstract the complexities of the GitHub REST API interactions.


* 
**Procedural Execution:** The function follows a strict linear procedural flow: Input Resolution  Confirmation  Execution.




* **State Management:**
* **Stateless:** The component does not maintain internal persistence between executions. It relies entirely on arguments passed at runtime (`options`) or transient user input collected during the session.




* **Complexity Assessment:**
* **Rating:** **Medium**
* **Justification:** While the business logic is straightforward, the control flow complexity is elevated by the dual-mode operation (Headless vs. Interactive). The component handles branching logic for argument parsing, interactive list selection, cancellation handling, and input validation within a single function scope.





**3. Dependency Graph**

* **Internal Dependencies:**
* 
`../../services/loggerService`: Used for operational feedback (info, warn, error).


* 
`../../services/githubService`: Used for fetching repository lists and executing the deletion command.


* 
`../../types/gitTypes`: Provides type definitions for command options.




* **External Dependencies:**
* 
`@clack/prompts`: Handles CLI UI elements (intro, outro, select, text, isCancel).


* 
`picocolors`: Handles terminal string styling.


* 
`process.env`: Accesses environment variables (specifically `GITHUB_ORG`).




* **Coupling Analysis:**
* 
**High Coupling:** The component is tightly coupled to the `@clack/prompts` library, making it difficult to test or reuse outside of a CLI context without mocking the UI layer.





**4. Data Types & Interfaces**

* **Key Interfaces:**
* 
`DeleteRepoOptions`: An object containing optional properties `repo` (string) and `confirm` (string).




* **Return Types:**
* `Promise<void>`: The function is async but returns nothing.
* 
**Warning:** The code utilizes `any` casting when mapping repositories (`repos.map((r: any) => ...)`), which bypasses type safety and should be refactored.





**5. Functional Logic Specification**

* 
**Method:** `deleteRemoteRepos(options: DeleteRepoOptions = {})` 


* **Logic Flow:**
1. 
**Initialization:** Displays a UI header if not running in headless mode (no `options.repo` provided).


2. **Target Resolution:**
* *Scenario A (Headless):* If `options.repo` exists, it parses the string. It splits by `/` to separate owner/name. If no owner is present, it defaults to `process.env.GITHUB_ORG` or a hardcoded fallback.


* *Scenario B (Interactive):* Calls `github.listRepos()`. If the list is empty, logs a warning and exits. Otherwise, presents a `select` menu. If the user cancels, it exits. It then parses the selected object to determine owner/name.




3. **Confirmation:**
* 
*Scenario A (Headless):* Uses `options.confirm` if provided.


* *Scenario B (Interactive):* If no confirmation arg is present, prompts the user via `text` input to type "DELETE". Validates that the input strictly matches "DELETE" (case-insensitive in logic, but validation message implies strictness). Handles cancellation.




4. **Execution:**
* Checks if the final confirmation string is `'DELETE'` (case-insensitive).


* 
**Try:** Awaits `github.deleteRepo(owner, name)`.


* 
**Catch:** Logs an error if the API call fails.


* 
**Else:** If confirmation mismatches, logs a warning.






* **Side Effects:**
* 
**Destructive:** Permanently deletes a remote GitHub repository.


* 
**I/O:** Writes to `stdout` via `logger` and `clack`.




* **Error Handling:**
* Catches exceptions during the API deletion call and logs them via `logger.error`.


* Validates user input in the confirmation prompt, preventing progress on empty or invalid strings.







---

### Part 2: Appendix - Testing Reference

**1. Mocking Strategy**

To achieve unit isolation, the following modules must be mocked:

* **`@clack/prompts`**:
* `intro`, `outro`: Mock as no-op spies.
* `isCancel`: Mock to return `true` or `false` based on scenario.
* `select`: Mock to return a promise resolving to a Repo Object (Happy Path) or a Cancel Symbol (Cancellation).
* `text`: Mock to return a promise resolving to "DELETE" (Happy Path) or invalid strings.


* **`../../services/githubService`**:
* `listRepos`: Mock to return an array of repository objects or an empty array.
* `deleteRepo`: Mock to resolve (success) or reject (API failure).


* **`../../services/loggerService`**:
* `info`, `warn`, `error`: Mock as spies to verify output messages.



**2. Test Scenarios**

| Category | Scenario Name | Description | Mock Behavior | Expected Outcome |
| --- | --- | --- | --- | --- |
| **Happy Path** | **Headless Deletion** | Call with `repo: "owner/repo"` and `confirm: "DELETE"`. | `deleteRepo` resolves. | `deleteRepo` called with specific args. |
| **Happy Path** | **Interactive Deletion** | No args. Select repo, type "DELETE". | `listRepos` returns data. `select` returns repo. `text` returns "DELETE". | `deleteRepo` called. |
| **Edge Case** | **No Repos Found** | Interactive mode, API returns empty list. | `listRepos` returns `[]`. | Log warning "No repositories found". Stop execution.

 |
| **Edge Case** | **Short Repo Name** | Headless mode, `repo` has no slash (e.g., "my-repo"). | N/A | Owner defaults to Env/Fallback. `deleteRepo` called with derived owner.

 |
| **Error State** | **User Cancel Selection** | Interactive mode, user cancels repo selection. | `select` returns Cancel Symbol. `isCancel` returns `true`. | Outro "Operation Cancelled". Stop execution.

 |
| **Error State** | **User Cancel Confirm** | Interactive mode, user cancels confirmation text. | `text` returns Cancel Symbol. `isCancel` returns `true`. | Outro "Operation Cancelled". Stop execution.

 |
| **Error State** | **Wrong Confirmation** | Interactive mode, user types "del" instead of "DELETE". | `text` returns "del". | Log warning "Confirmation mismatch". No delete call.

 |
| **Error State** | **API Failure** | Deletion API fails. | `deleteRepo` rejects with Error. | Log error "Failed to delete...".

 |

**3. Test Data Requirements**

**Mock Repository List (JSON):**

```json
[
  {
    "name": "test-repo",
    "full_name": "steve-r-lewis/test-repo",
    "private": true,
    "owner": {
      "login": "steve-r-lewis"
    }
  },
  {
    "name": "public-repo",
    "full_name": "other-org/public-repo",
    "private": false,
    "owner": {
      "login": "other-org"
    }
  }
]

```

**Mock Options Objects:**

```typescript
// Headless
const optionsHeadless = { repo: 'steve-r-lewis/test-repo', confirm: 'DELETE' };

// Headless (Partial Name)
const optionsPartial = { repo: 'test-repo', confirm: 'DELETE' };

```









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






**Next Step:** Would you like me to generate the **Jest unit test file** (`deleteRemoteRepos.test.ts`) implementing these mocks and scenarios?



## **Possible next steps**

* Create the `githubService` mock or implementation that is referenced in this file?
* Refactor the confirmation logic to be case-insensitive or require the exact repository name for higher security?
* Add a logic branch to also delete the local directory if the remote deletion is successful?
