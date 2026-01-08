# 📋 Feature 1: Sync Repository (`git.sync`)

**Legacy Reference:** `syncRepos.ts.old` 

## 1. User Story

As a developer or CI pipeline, I want to pull the latest changes for the root repository and recursively update all submodules so that my local environment matches the remote state.

## 2. Inputs & Configuration

* **Target Root:** The directory path of the repository.
* **Options (Flags):**
* `--force` (Boolean): Headless mode. Skips UI prompts/intro.


## 3. Functional Requirements

1. **Headless Mode (`--force`):**

	* Must execute `git pull` with `stdio: inherit` (logs visible).
	* Must execute `git submodule update --init --recursive` with `stdio: inherit`.
	* Must not show Intro/Outro banners.  


2. **Interactive Mode (Default):**

	* Must show "Sync Repositories" Intro.
	* Must use a Spinner (`s.start`) to indicate progress.
	* Must execute `git pull` silently (stdio ignored).
	* Must execute `git submodule update --init --recursive` silently.
	* Must show success/failure via Logger.  


3. **Error Handling:**

	* If Git fails, catch the error, stop the spinner (if interactive), and log a failure message.  

## 4. Gap Analysis (Old vs New)

* *Current New Implementation:* Uses `githubService.syncRepo`.
* *Requirement:* Ensure `githubService` actually performs the **Submodule Update**. The legacy code explicitly runs `git submodule update --init --recursive`. We must ensure our service layer does exactly this.





## **Function Analysis: `syncRepos**`

### **1. Overview**

This is an asynchronous function designed to synchronize the local project with its remote counterparts. It performs a "full update" by first pulling the latest changes for the root repository and then recursively initializing and updating all registered submodules. This ensures the entire monorepo structure is aligned with the remote state in a single command.

### **2. Function Specification**

* **Signature:** `export async function syncRepos(targetRoot: string, options: SyncOptions = {}): Promise<void>`
* **Parameters:**
* `targetRoot` (string): The absolute file path to the root directory of the Git repository.
* `options` (optional): An object of type `SyncOptions`.
* *Note: In the active implementation, this parameter is accepted for signature consistency but is not currently utilized (unlike the legacy code which checked for a `force` flag).*
* **Return Value:** `Promise<void>` (The function performs side effects—Git operations and console logging—without returning a value).

### **3. Operational Workflow**

**Phase 1: Initialization**

	1. **UI Setup:** Displays a cyan-colored header "🔄 Syncing Repositories" and initializes a CLI spinner.

	2. **Git Client:** Creates a `simple-git` instance targeted at the `targetRoot`.

**Phase 2: Execution**

	1. **Pull Root:**

		* Starts the spinner with the message "Pulling root repository...".
		* Executes `git.pull()` to fetch and merge changes from the configured upstream remote.

	2. **Update Submodules:**

		* Updates the spinner message to "Root pulled. Updating submodules...".
		* Executes `git.submoduleUpdate(['--init', '--recursive'])`.
		* `--init`: Initializes any submodules recorded in the index that were not previously set up.
		* `--recursive`: Ensures nested submodules inside other submodules are also updated.

**Phase 3: Completion & Error Handling**

	1. **Success:**

		* Stops the spinner with "Sync complete.".
		* Logs a success message indicating both Root and Submodules are up to date.

	2. **Failure:**

		* Catches any errors thrown during the git operations.
		* Stops the spinner with "Sync Failed.".
		* Logs the specific error message via the logger service.

	3. **Exit:** Displays a green "✅ Done" outro message.

### **4. Dependencies**

The function relies on the following external and internal modules:

* **`@clack/prompts`:** Used for the CLI user interface (`intro`, `outro`, `spinner`).
* **`simple-git`:** Used for executing `pull` and `submodule update` commands programmatically.
* **`picocolors`:** Used for coloring the console output (cyan for header, green for success).
* **`../../services/loggerService`:** Custom wrapper for standard application logging.
* **`../../types`:** Imports the `SyncOptions` type definition.

---

### **Usage Example**

```typescript
import { syncRepos } from './path/to/syncRepos';

// Execute the sync operation on the current working directory
await syncRepos(process.cwd());
```

### **Possible next steps**

* Add a "stash" step before pulling to safely handle local changes?
* Update the logic to accept a specific branch or remote via `options`?
* Add a check to verify internet connectivity before attempting the pull?
