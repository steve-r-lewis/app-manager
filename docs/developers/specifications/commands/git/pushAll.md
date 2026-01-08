# 📋 Feature 3: Mass Push (`git.pushAll`)

**Legacy Reference:** `pushAll.ts.old` 

## 1. User Story

As a Lead Developer managing a monorepo with multiple sub-packages (Layers), I want to scan *all* repositories (Root and Layers) for unpushed commits and push them all in one go, so I don't have to manually navigate to 10 different folders.

## 2. Inputs & Configuration

* **Target Root:** The monorepo root.
* **Options:** None (implicitly interactive, or we can add `--force` for CI).

## 3. Functional Requirements

1. **Discovery Phase:**

	* Must verify Root is a Git repo.
	* Must scan `layers/` directory for sub-directories.
	* Must check each directory: Is it a Git repo? Is it `ahead` of remote?

2. **Report Phase:**

	* If no repos are ahead, log success and exit.
	* If repos are ahead, display a list: `Repo Name | Branch | Commits Ahead`.

3. **Execution Phase (Interactive):**

	* Prompt user: "Push these X repositories?".
	* If Yes: Iterate through the list and execute `git push` for each.
	* Must capture Success/Failure for each push (resilience).

4. **Output:**

	* Final Summary: "Successfully pushed: A, B. Failed: C."

## 4. Architecture Design

* **New Command:** `app/commands/git/pushAllCommand.ts`
* **Service Needs:** `githubService` needs a method `scanForUnpushed(root: string): Promise<RepoStatus[]>` to keep the command clean.




### **1. Helper Function: `getRepoStatus**`

#### **Overview**

This internal asynchronous helper function determines if a specific Git repository at a given path has local commits that need to be pushed to its remote.

#### **Specification**

* **Signature:** `async function getRepoStatus(repoPath: string, name: string): Promise<RepoStatus | null>`
* **Parameters:**
* `repoPath` (string): The absolute file path to the repository directory.
* `name` (string): A display label for the repository (e.g., "ROOT (App)" or "Layer: auth").
* **Return Value:** `Promise<RepoStatus | null>`
* Returns an object implementing the `RepoStatus` interface if the repo is ahead of remote.
* Returns `null` if the repo is up-to-date, invalid, or encounters an error.
* **Logic:**
	1. Initializes `simple-git` at `repoPath`.
	2. Fetches status using `git.status()`.
	3. Checks the `ahead` property. If greater than 0, it constructs and returns the status object containing the name, path, commit count (`ahead`), and current branch.
	4. Catches and suppresses errors (returning `null`), which handles cases where the directory is not a valid git repo.

---

### **2. Main Function: `pushAll**`

#### **Overview**

This is the primary export. It acts as a "Mass Push" command that orchestrates the discovery, reporting, and execution of `git push` operations across the main project root and all submodule "layers".

#### **Specification**

* **Signature:** `export async function pushAll(targetRoot: string): Promise<void>`
* **Parameters:**
* `targetRoot` (string): The absolute file path to the root directory of the project.
* **Return Value:** `Promise<void>` (Side effects only).

#### **Operational Workflow**

**Phase 1: Discovery**

	1. **UI Start:** Displays the "Git Mass Push" header and starts a spinner.

	2. **Scan Root:** Checks the `targetRoot` repo status using the helper function.

	3. **Scan Layers:**

		* Checks for the existence of a `layers` directory.
		* Iterates through subdirectories in `layers`.
		* Validates if each subdirectory contains a `.git` folder.
		* Checks the status of each valid layer using the helper function.

	4. **Queue Build:** Accumulates all repositories that are "ahead" into the `pushQueue` array.  

**Phase 2: Reporting**

	1. **Empty Check:** If the queue is empty, it logs a success message that all repos are up to date and exits.
	2. **Display Status:** Logs a list of repositories needing a push, detailing the number of commits and the active branch for each.
	3. **Confirmation:** Prompts the user via `confirm` to proceed with pushing the listed repositories. If cancelled, the function exits.  

**Phase 3: Execution**

	1. **Push Loop:** Iterates through the confirmed `pushQueue`.
	2. **Git Push:** Executes `git push` for each repository using `simple-git`.
	3. **Error Handling:** Catches individual failures (e.g., network issues, permission errors) and stores the error message without stopping the entire process.  

**Phase 4: Summary**

	1. **Success Report:** Logs the names of all successfully pushed repositories.
	2. **Failure Report:** Logs detailed error messages for any failed pushes.
	3. **Completion:** Displays a final "Done" message.  

#### **Dependencies**

The function relies on the following external and internal modules:

* **`simple-git`:** Used for checking git status (`ahead` count) and executing the `push` command.
* **`@clack/prompts`:** Used for the CLI UI (`intro`, `outro`, `spinner`, `confirm`, `isCancel`).
* **`../../services/loggerService`:** Custom logger for consistent application messaging.
* **`picocolors`:** Used for coloring console output (cyan for names, yellow for commit counts, green for branches).
* **`fs` & `path` (Node.js built-ins):** Used for directory traversal and path construction.

---

### **Usage Example**

```typescript
import { pushAll } from './path/to/pushAll';

// Execute the Mass Push command on the current directory
await pushAll(process.cwd());
```

### **Possible next steps**

* Add a flag to support `git push --force` for specific workflows?
* Refactor the discovery phase to run in parallel using `Promise.all` for faster scanning?
* Add a "Dry Run" mode to simulate the push without actually sending data?




