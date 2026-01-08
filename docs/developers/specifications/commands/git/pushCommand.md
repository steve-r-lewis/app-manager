# 📋 Feature 2: Push to Remote (`git.push`)

**Legacy Reference:** `pushToRemote.ts.old` 

## 1. User Story

As a developer, I want to push my current branch to a specific remote (e.g., `origin` or `upstream`), supporting both automated pipelines and an interactive selection menu.

## 2. Inputs & Configuration

* **Target Root:** The directory path.
* **Options (Flags):**
* `--remote` (String): The target remote (e.g., 'origin').
* `--branch` (String): The target branch (e.g., 'main').

## 3. Functional Requirements

1. **Headless Mode (Arguments Provided):**

	* **Trigger:** If both `--remote` and `--branch` are provided.
	* **Action:** Execute `git push <remote> <branch>` with `stdio: inherit`.
	* **Output:** Log success or failure.

2. **Interactive Mode (Default):**

	* **Discovery:** Run `git remote` to find available remotes.
	* **Empty State:** If no remotes exist, warn and exit.
	* **Selection:** Prompt user to select *one or more* remotes via `multiselect`.
	* **Branch Detection:** Detect current branch via `git branch --show-current`.
	* **Action:** Iterate through selected remotes and push the current branch to each.

3. **Error Handling:**

	* Handle cases where the repository has no remotes.
	* Handle "Push Cancelled" by user.
	* Catch generic execution errors per remote.

## 4. Gap Analysis (Old vs New)

* *Current New Implementation:* Just runs `git.push()`.
* *Requirement:* The new command **MUST** support the `multiselect` of remotes. The legacy tool allowed pushing to multiple remotes (e.g., `origin` and `backup`) in one go. We cannot lose this functionality.





## **Function Analysis: `pushToRemote**`

### **1. Overview**

This is an asynchronous function designed to streamline the standard `git push` operation. Unlike the commented-out legacy version which supported selecting specific remotes and branches interactively, the active implementation focuses on simplicity: it pushes the current branch to its configured upstream remote. It includes error handling to catch common issues (like missing upstreams) and provides visual feedback via a CLI spinner.

### **2. Function Specification**

* **Signature:** `export async function pushToRemote(targetRoot: string, options: PushOptions = {}): Promise<void>` 
* **Parameters:**
* `targetRoot` (string): The absolute file path to the root directory of the Git repository.
* `options` (optional): An object of type `PushOptions`.
* *Note: In the current active implementation, this parameter is accepted but not utilized, as the function defaults to a standard `git push` behavior.*
* **Return Value:** `Promise<void>` (The function performs side effects—Git operations and UI logging—without returning a value).

### **3. Operational Workflow**

**Phase 1: Initialization & Validation**

1. **UI Setup:** Displays a cyan-colored introductory header "⬆️ Pushing to Remote"	and initializes a spinner instance.
2. **Git Client:** Initializes a `simple-git` instance targeting the `targetRoot`.
3. **Remote Check:**
	* Fetches the list of configured remotes using `git.getRemotes()`.
	* If no remotes are found, it logs an error ("No remotes configured."), displays an "Aborted" outro, and exits.

**Phase 2: Execution**

1. **Start Process:** Starts the spinner with the message "Pushing changes...".
2. **Push:** Executes `git.push()`.
	* This command performs a standard push, typically sending the current local branch to its corresponding upstream tracking branch.
3. **Success Handler:**
	* Stops the spinner with "Push successful."
	* Logs a success message via the logger service.  

**Phase 3: Error Handling & Completion**

1. **Failure Handler:** If the push fails (e.g., rejected updates, network issues, or no upstream set), it catches the error.
	* Stops the spinner with "Push Failed."
	* Logs the specific Git error message.
	* Logs a helpful tip suggesting the user might need to set the upstream branch manually.  
2. **Exit:** Displays a green "✅ Done" outro regardless of the outcome (if not aborted early).  

### **4. Dependencies**

The function relies on the following external and internal modules:

* **`@clack/prompts`:** Used for the CLI user interface (`intro`, `outro`, `spinner`).
* **`simple-git`:** Used for executing the push command and checking remote configurations.
* **`picocolors`:** Used for coloring console output (cyan for header, green for completion).
* **`../../services/loggerService`:** Custom wrapper for standard logging (`logger`).
* **`../../types`:** Imports the `PushOptions` type definition (though currently unused in logic).

---

## **Usage Example**

```typescript
import { pushToRemote } from './path/to/pushToRemote';

// Execute the function on the current working directory
await pushToRemote(process.cwd());
```

---

### **Possible next steps**

* Restore the functionality from the commented-out code that allowed selecting specific remotes (e.g., `origin` vs `upstream`)?
* Update the logic to handle the `options` parameter, allowing a headless mode where the branch and remote are passed in manually?
* Add logic to automatically detect if the upstream is missing and prompt the user to set it (e.g., `git push --set-upstream origin <branch>`)?








