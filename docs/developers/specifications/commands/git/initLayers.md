# 📋 Feature 4: Initialize Layers (`git.initLayers`)

**Legacy Reference:** `initLayers.ts.old` 

## 1. User Story

As a developer adding new folders to `layers/`, I want to automatically turn them into Git repositories so I can manage them as submodules later.

## 2. Inputs & Configuration

* **Target Root:** The monorepo root.
* **Options:**
* `--force` (Boolean): Skip confirmation prompts (CI mode).

## 3. Functional Requirements

1. **Discovery:**

	* Scan `layers/` for directories.
	* Filter out directories that *already* have a `.git` folder.
	* If no uninitialized layers found, exit with success.

2. **Interactive Mode:**

	* List the candidates (e.g., "Found: auth-layer, ui-layer").
	* Prompt: "Initialize git in these layers?".

3. **Headless Mode (`--force`):**

	* Skip prompt, immediately initialize all candidates.

4. **Execution:**

	* Run `git init` in each target folder.
	* Log output for each.

## 4. Architecture Design

* **New Command:** `app/commands/git/initLayersCommand.ts`
* **Service Needs:** `fileService` or `githubService` helper to `isGitRepo(path)`.











### **Function Analysis: `initLayers**`

#### **1. Overview**

This is an asynchronous function designed to automate the Git initialization of modular sub-projects (specifically "layers") within a monorepo structure. It scans a dedicated `layers` directory, identifies subdirectories that are not yet Git repositories (missing a `.git` folder), and initializes them. It supports two modes: an interactive mode for user confirmation and a "headless" (forced) mode for automated environments like CI/CD.

#### **2. Function Specification**

* **Signature:** `export async function initLayers(targetRoot: string, options: InitOptions = {}): Promise<void>` 
* **Parameters:**
	* `targetRoot` (string): The absolute file path to the root directory of the project.
	* `options` (optional): An object of type `InitOptions` containing:
	* `force` (boolean, implied): A flag to bypass interactive prompts and force initialization.
* **Return Value:** `Promise<void>` (The function performs side effects—logging, file system checks, and Git operations—without returning a value).

#### **3. Operational Workflow**

**Phase 1: Setup & Validation**

1. **Intro:** Displays a cyan-colored introductory header "📦 Initialize Layers".
2. **Directory Check:**
	* Constructs the path to the `layers` directory (`targetRoot/layers`).
	* Verifies if this directory exists. If not, it logs a warning, displays an "Skipped" outro, and exits.

**Phase 2: Discovery**

1. **Scan:** Reads the contents of the `layers` directory using `fs.readdirSync` with file types enabled.
2. **Filter:** Identifies "uninitialized" candidates by filtering for:
	* Entries that are directories.
	* Entries that generally *do not* contain a `.git` subdirectory.
3. **Empty State:** If no uninitialized layers are found, it logs a success message ("All layers are already initialized git repositories."), displays a "Done" outro, and exits.

**Phase 3: User Confirmation**

1. **Log Count:** Logs the number of uninitialized layers found.
2. **Prompt (Interactive Mode only):**
	* Checks if `options.force` is false (default).
	* Prompts the user via `confirm` to initialize the listed layers.
	* **Cancellation:** If the user cancels or selects "No", it displays an "Operation cancelled" outro and exits.  

**Phase 4: Execution**

1. **Start Spinner:** Initiates a spinner with the message "Initializing repositories...".
2. **Iterate & Init:** Loops through each uninitialized layer:
	* Constructs the full path to the layer.
	* Uses `simpleGit(layerPath).init()` to run `git init` in that directory.
	* Updates the spinner message for each successful initialization.
	* **Error Handling:** Catches any errors during initialization and logs them via `logger.error`. 
3. **Completion:** Stops the spinner, logs "Initialization complete," and displays a green "✅ Done" outro.

#### **4. Dependencies**

The function relies on the following external and internal modules:

* **`@clack/prompts`:** Used for the CLI user interface (`intro`, `outro`, `confirm`, `isCancel`, `spinner`).
* **`simple-git`:** Used to programmatically execute the `git init` command.
* **`fs` (Node.js built-in):** Used for file system operations (checking existence, reading directories).
* **`path` (Node.js built-in):** Used for constructing file paths.
* **`picocolors`:** Used for coloring console output (cyan for intro, green for success).
* **`../../services/loggerService`:** A custom wrapper for standard logging (`logger`).
* **`../../types`:** Imports the `InitOptions` type definition.

### **Usage Example**

```typescript
import { initLayers } from './path/to/initLayers';

// Interactive usage (prompts user to initialize found layers)
await initLayers(process.cwd());

// Headless usage (forces initialization without prompts)
await initLayers(process.cwd(), { force: true });
```

---

### **Possible next steps**

* Create a unit test to verify that the `force` option correctly bypasses the prompt?
* Add logic to create a default `.gitignore` file in the newly initialized layers?
* Refactor the `fs.readdirSync` logic to be asynchronous (`fs.promises.readdir`) for better non-blocking performance?









