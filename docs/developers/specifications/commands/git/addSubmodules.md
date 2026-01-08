# 📋 Feature 5: Link Submodules (`git.addSubmodules`)

**Legacy Reference:** `addSubmodules.ts.old` 

## 1. User Story

As a developer, I want to convert my local Git repositories in `layers/` into official **Submodules** of the Root repository, ensuring they are tracked correctly.

## 2. Inputs & Configuration

* **Target Root:** The monorepo root.

## 3. Functional Requirements

1. **Validation:**

  * Root must be a repo.
  * `layers/` must exist.

2. **Candidate Selection (The "Brain"):**

  * Scan `layers/`.
  * **Rule 1:** Must be a Git Repo.
  * **Rule 2:** Must **NOT** already be tracked in Root (check `git ls-files --stage`).
  * **Rule 3 (Critical):** Must have an `origin` remote URL (required for `submodule add`).

3. **Interaction:**

  * Show valid candidates in a `multiselect` list.
  * Label format: `LayerName (RemoteURL)`.

4. **Execution:**

  * For selected items, run `git submodule add <url> <relativePath>`.
  * Log success/failure.
  * Remind user to commit the Root repo changes.

## 4. Architecture Design

* **New Command:** `app/commands/git/addSubmodulesCommand.ts`
* **Service Needs:** This logic is quite specific. It might live in the Command or a dedicated `SubmoduleService` if it grows. For now, `githubService` can house a `getUntrackedSubmodules()` method.


## **Function Analysis: `addSubmodules**`

### **1. Overview**

This is an asynchronous function designed to automate the discovery and registration of existing Git repositories within a specific subdirectory (`layers`) as official Git submodules of the root project. It scans for repositories that are present on the file system but not yet tracked by the root project's Git index, prompts the user to select which ones to link, and executes the `git submodule add` command for the selected items.

### **2. Function Specification**

* **Signature:** `export async function addSubmodules(targetRoot: string): Promise<void>`
* **Parameters:**
* `targetRoot` (string): The absolute file path to the root directory of the main project.


* **Return Value:** `Promise<void>` (The function performs side effects—console output and Git operations—without returning a value).

### **3. Operational Workflow**

The function operates in three distinct phases:

**Phase 1: Validation & Discovery**

  1. **Initialize Git Client:** Creates a `simple-git` instance for the `targetRoot`.
  2. **Root Check:** Verifies if the `targetRoot` is a valid Git repository. If not, it logs an error and exits.
  3. **Directory Check:** Checks if a `layers` directory exists within `targetRoot`. If not, it logs a warning and exits.
  4. **Identify Tracked Files:** Retrieves the current Git index (using `ls-files --stage`) to identify paths that are already tracked, preventing duplicate submodule additions.
  5. **Scan Candidates:**
    * Reads the `layers` directory.
    * Iterates through each subdirectory.
    * Initializes a new `simple-git` instance for the subdirectory.
    * Checks if the subdirectory is a valid Git repo and is *not* currently tracked by the root Git.
    * Retrieves remote URLs, specifically looking for a remote named `origin`.
    * **Result:** Builds a list of `candidates` containing the name, remote URL, and relative path for eligible repositories. If no `origin` is found, a warning is logged.

**Phase 2: User Selection**

  1. **Check Empty State:** If no candidates are found, it logs an info message and exits.
  2. **Prompt:** Uses `multiselect` to present the list of candidates to the user.
  3. **Cancellation:** If the user cancels or selects nothing, the function exits.

**Phase 3: Execution**

  1. **Processing:** Iterates through the user-selected targets.
  2. **Git Submodule Add:** Executes `git submodule add <url> <path>` for each target using the root Git instance.
  3. **Feedback:** Logs success or failure messages for each operation.
  4. **Completion:** Stops the spinner and reminds the user to commit the changes.

### **4. Dependencies**

The function relies on the following external libraries:

* **`simple-git`:** Used for all Git operations (checking repo status, getting remotes, adding submodules).
* **`@clack/prompts`:** Used for the CLI user interface (spinners, cancellation checks, and multi-select menus).
* **`consola`:** Used for styled console logging (info, success, error, warn).
* **`picocolors`:** Used for coloring strings in console output (e.g., green for success, red for errors).
* **`fs` (Node.js built-in):** Used for file system operations (checking existence, reading directories).
* **`path` (Node.js built-in):** Used for manipulating file paths.

## **Usage Example**

```typescript
import { addSubmodules } from './path/to/addSubmodules';
import path from 'path';

// Execute the function on the current working directory
await addSubmodules(process.cwd());
```

---

## **Possible next steps**

* Refactor this code to include better error handling (e.g., checking for write permissions)?
* Create a unit test suite for this function?
* Convert the `git submodule add` logic to handle cases where the local folder needs to be temporarily moved (a common issue when adding existing folders as submodules)?