# Part 1: Operational & Design Specification

#### 1. Component Overview

* **Purpose:** The `addCodeDocumentation.ps1` script is an AI-driven automation utility designed to autonomously add Enterprise Standard JSDoc comments and inline documentation to source code files.
* **Role in System:** It serves as a **Developer Productivity Tool** within the `nuxt4-monorepo-base-app`. It bridges the gap between raw code and standardized documentation by leveraging a Local or Remote LLM (Large Language Model).
* **Modes of Operation:**
* **Single File Mode:** Processes a specific target file.
* **Batch Directory Mode:** Recursively scans a folder, prompts the user for specific file types to include, and processes them in bulk.



#### 2. Architecture & Patterns

* **Design Pattern:**
* **Procedural Controller:** The script operates as a linear controller that orchestrates filesystem operations, user interaction, and API calls to the LLM.
* **Pipeline Processing:** The `Document-File` function acts as a pipeline: `Read`  `Backup`  `AI Transformation`  `Sanitization`  `Write`.


* **Dependency Injection:**
* The script relies on a suite of utility scripts located in the `utilities/` subdirectory: `logger.ps1`, `llm.ps1`, `fileSystem.ps1`, `project.ps1`, `showMenu.ps1`, and `paths.ps1`.
* **Critical Dependency:** `llm.ps1` (specifically `Invoke-LLM`) is the core engine for the documentation generation.



#### 3. Data Types & Interfaces

* **Inputs (Parameters):**
* `$Target` (String, Optional): The path to a file or directory. If omitted, the script enters an interactive entry loop.
* `$Debug`, `$Log`, `$NoBackup` (Switch): Configuration flags for verbosity, logging to disk, and skipping safety backups.


* **Data Structures:**
* **Prompt Engineering:** The script constructs a composite prompt consisting of a `System Prompt` (defining the "Senior Technical Writer" persona and rules) and a `User Prompt` (containing the filename and raw code).


* **Outputs:**
* **File Mutation:** The script overwrites the target file with the documented version.
* **Backup:** A copy of the original file is saved to `~/scripts/backup/` preserving the relative path structure.



#### 4. Functional Logic Specification

**A. Initialization & Configuration**

* Sets Strict Mode and Error Action to "Stop".
* Dynamically loads required utilities and validates their existence; exits with a FATAL error if any are missing.
* Initializes the Logger and the LLM engine.

**B. Core Function: `Create-Backup**`

* **Inputs:** Source Path, Project Root.
* **Logic:**
1. Calculates the relative path of the file from the project root.
2. Constructs a destination path inside `scripts/backup/`.
3. Creates the destination directory if it does not exist.
4. Copies the file using `Copy-Item -Force`.



**C. Core Function: `Document-File**`

* **Inputs:** File Path, Root Path.
* **Logic:**
1. **Backup:** Calls `Create-Backup` immediately (unless `$NoBackup` is set).
2. **Read:** Ingests the raw content of the file.
3. **AI Request:**
* Sets strict rules: "DO NOT change any logic," "Add JSDoc blocks," "Output ONLY valid code".
* Calls `Invoke-LLM` with a temperature of **0.2** (low creativity, high precision).


4. **Sanitization:** If the AI returns code wrapped in Markdown blocks (e.g., ```typescript), regex is used to strip the fences to prevent syntax errors.
5. **Write:** Updates the file using `Set-ContentAtomic` (implied from `fileSystem` utility).



**D. Main Execution Flow**

* **Target Resolution:**
* If `$Target` is provided, it is validated and resolved.
* If missing, the user is prompted in a loop until a valid path is entered.


* **Directory Handling (Batch):**
* If the target is a container, `Show-Menu` is triggered to ask the user which extensions to process (e.g., `.ts`, `.vue`).
* Filters files recursively based on selection and iterates through them calling `Document-File`.


* **Single File Handling:**
* Directly calls `Document-File` on the target.



---

### Part 2: Appendix - Testing Reference

#### 1. Mocking Strategy

To test this script safely without consuming LLM tokens or corrupting actual source files, extensive mocking is required.

* **Mock `Invoke-LLM`:**
* **Why:** To prevent network calls and ensure deterministic output.
* **Behavior:** Should return a pre-defined string containing the "documented" version of the input code.


* **Mock `Show-Menu`:**
* **Why:** To bypass the interactive TUI during automated testing.
* **Behavior:** Should return a pre-defined array of extensions (e.g., `(".ts")`) for the batch mode test.


* **Mock Filesystem (`Get-Item`, `Test-Path`, `Get-Content`, `Set-Content`):**
* **Why:** To avoid IO operations on the real disk.
* **Behavior:** Use Pester's `Mock` to simulate file existence and content reading/writing.



#### 2. Test Scenarios

| Scenario ID | Category | Description | Inputs | Expected Outcome |
| --- | --- | --- | --- | --- |
| **TS-01** | Happy Path | Single File Documentation | `$Target = "./src/api.ts"` | `Invoke-LLM` is called once; `Set-Content` writes the mocked response. |
| **TS-02** | Happy Path | Batch Directory Scan | `$Target = "./src/"` | `Show-Menu` is called; script iterates over matching files; `Document-File` runs multiple times. |
| **TS-03** | Safety | Backup Creation | Default params | `Copy-Item` is triggered targeting `~/scripts/backup/...` before `Invoke-LLM`. |
| **TS-04** | Logic | Markdown Sanitization | LLM returns ````ts <code> ```` | The file is written with `<code>` only; fences are stripped. |
| **TS-05** | Edge Case | Empty AI Response | LLM returns `$null` or empty string | `Set-Content` is **not** called (file is not overwritten); Error logged. |
| **TS-06** | Configuration | No Backup Switch | `-NoBackup` switch present | `Copy-Item` is **never** called. |

#### 3. Test Data Requirements

**Sample "Raw" Code (Input):**

```typescript
function add(a, b) { return a + b; }

```

**Sample "Documented" Code (Mocked LLM Output):**

```typescript
/**
 * Adds two numbers.
 * @param a First number
 * @param b Second number
 * @returns The sum
 */
function add(a, b) { return a + b; }

```

**Next Step:** Would you like me to generate a **Pester Test File** (`addCodeDocumentation.Tests.ps1`) that mocks the LLM and Filesystem to verify the logic described above?