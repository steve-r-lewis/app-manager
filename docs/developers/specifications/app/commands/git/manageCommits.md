Based on the analysis of the active code within the provided file (lines 43–63), here is the comprehensive Technical Specification and Test Strategy.

---

### Part 1: Operational & Design Specification

#### 1. Component Overview

* **Purpose:** The `manageCommits` component orchestrates the entire Git commit workflow within the CLI application. It automates checking repository status, staging files, generating conventional commit messages using AI (with manual fallbacks), and executing the final commit.
* **Role in System:**
* **Workflow Controller:** It acts as a facade over `simple-git` and the `llmService`, managing the control flow based on user input via `@clack/prompts`.
* 
**Interactive Command:** It serves as a direct interface point for the user in the CLI.





#### 2. Architecture & Patterns

* **Design Patterns:**
* 
**Procedural/Script:** The component is a standalone asynchronous function rather than a class-based service.


* **Facade Pattern:** It abstracts the complexity of Git commands and LLM interactions behind a simple user workflow.
* 
**Dependency Injection (Partial):** It accepts `targetRoot` and `options` as arguments, allowing for configuration injection, though services like `logger` and `llm` are imported as Singletons.




* **State Management:**
* **Stateless:** The function itself does not maintain persistent state between executions. It relies on the current state of the file system (Git) and runtime arguments.


* **Complexity Assessment:** **Medium**.
* The logic involves multiple asynchronous decision branches (Staging Y/N, AI vs Manual, Review vs Edit) and error handling wrappers.





#### 3. Dependency Graph

* **Internal Dependencies:**
* 
`../../services/loggerService`: For logging success/error messages.


* 
`../../services/llmService`: For sanitizing diffs and generating commit messages.


* 
`../../types`: For the `CommitOptions` interface definition.




* **External Dependencies:**
* 
`simple-git`: Primary library for Git operations (replacing the legacy `child_process` `execSync` approach).


* 
`@clack/prompts`: For interactive terminal UI (spinners, text inputs, confirmations).


* 
`picocolors`: For terminal string styling.




* **Coupling Analysis:**
* **High Coupling:** The component is tightly coupled to `@clack/prompts` for the UI and `simple-git` for functionality. Changing the UI library would require a total rewrite of this function.



#### 4. Data Types & Interfaces

* **Key Interfaces:**
* `CommitOptions`: Imported from `../../types`. Based on usage, it must contain:
* 
`message?`: string (optional pre-defined message).


* 
`availableLLMs?`: Array of provider objects with an `available` boolean and `label`/`value` properties.






* **Return Types:**
* `Promise<void>`: The function `manageCommits` is async but returns nothing.
* 
**Warning:** The code uses explicit `any` in catch blocks (`catch (error: any)`), which bypasses type safety for error objects.





#### 5. Functional Logic Specification

**Method:** `manageCommits(targetRoot: string, options: CommitOptions = {}): Promise<void>`

**Logic Flow:**

1. **Initialization:**
* Displays intro banner "📝 Smart Commit Manager".


* Initializes `simple-git` instance targeting `targetRoot`.




2. **Status Check:**
* Retrieves git status. If `status.isClean()` returns true, logs "Working tree is clean" and exits.




3. **Staging Logic:**
* Checks if no files are staged but files are modified/untracked.
* 
**Prompt:** asks user "Stage all changes?".


* **Action:** If yes, runs `git.add('.')` wrapped in a spinner. If no/cancel, exits.




4. **Message Generation Strategy:**
* If `options.message` is provided, it is used directly.


* If not, checks `options.availableLLMs`.
* 
**Selection:** If AI is available, prompts user to choose "AI Generated" or "Manual Entry".


* **Path A (AI):**
* Fetches cached diff: `git.diff(['--cached'])`.


* 
**Edge Case:** If diff is empty, warns and falls back to manual entry.


* 
**Processing:** Sanitizes diff (max 6000 chars) via `llm.sanitizeContext`.


* 
**Generation:** Calls `llm.generate` with a specific Conventional Commits prompt.


* **Review:** Prompts user to review the generated message. User can hit Enter to confirm or type to edit.


* 
**Error Handling:** If AI fails, logs error and falls back to manual entry.




* **Path B (Manual):**
* Prompts user for text input. Validates that message is not empty.






5. **Execution:**
* If a `commitMessage` exists, runs `git.commit(commitMessage)` wrapped in a spinner.


* Logs success message.


6. **Global Error Handling:**
* Catches any unhandled errors, stops the spinner, logs the error, and displays "Done".





---

### Part 2: Appendix - Testing Reference

#### 1. Mocking Strategy

To unit test this function without performing actual Git operations or API calls, the following mocks are required:

* **`simple-git`:**
* Must mock the factory function to return a mock object.
* **Mock Methods:** `status()`, `add()`, `diff()`, `commit()`.
* **Behaviors:**
* `status()`: Must return an object with `isClean()`, `staged`, `modified`, and `not_added` arrays.
* `diff()`: Return string (diff content) or empty string.




* **`@clack/prompts`:**
* **Mock Methods:** `intro`, `outro`, `text`, `confirm`, `select`, `isCancel`, `spinner`.
* **Behaviors:**
* `confirm`: Return `true`/`false` to test staging logic.
* `select`: Return `'ai'` or `'manual'` to test branching.
* `text`: Return strings to simulate user input.
* `isCancel`: Return `true` to test exit paths.




* **`../../services/llmService`:**
* **Mock Methods:** `generate()`, `sanitizeContext()`.
* **Behaviors:**
* `generate()`: Return a mock string "feat: test commit".
* `generate()` (Error test): Throw an Error.





#### 2. Test Scenarios

| Scenario ID | Scenario Name | Inputs / State | Mock Behavior | Expected Outcome |
| --- | --- | --- | --- | --- |
| **TS-01** | **Clean Repository** | Git Status: Clean | `status().isClean()` -> `true` | Log "Working tree is clean", return immediately. |
| **TS-02** | **Stage All & Commit (Manual)** | Git Status: Dirty (unstaged) | `status.staged` -> `[]`<br>

<br>`confirm` -> `true`<br>

<br>`select` -> `'manual'`<br>

<br>`text` -> "chore: updates" | Call `git.add('.')`, call `git.commit("chore: updates")`. |
| **TS-03** | **Cancel Staging** | Git Status: Dirty (unstaged) | `status.staged` -> `[]`<br>

<br>`confirm` -> `false` | Log "Operation cancelled", return immediately. |
| **TS-04** | **AI Generation Success** | Git Status: Staged<br>

<br>LLMs Available: Yes | `diff()` -> "diff content"<br>

<br>`select` -> `'ai'`<br>

<br>`llm.generate` -> "feat: ai msg"<br>

<br>`text` (review) -> "feat: ai msg" | Call `llm.generate`, call `git.commit("feat: ai msg")`. |
| **TS-05** | **AI Generation Edit** | Git Status: Staged<br>

<br>LLMs Available: Yes | `diff()` -> "diff content"<br>

<br>`select` -> `'ai'`<br>

<br>`llm.generate` -> "feat: ai msg"<br>

<br>`text` (review) -> "feat: user edited" | Call `git.commit("feat: user edited")`. |
| **TS-06** | **AI Generation Failure** | Git Status: Staged<br>

<br>LLMs Available: Yes | `select` -> `'ai'`<br>

<br>`llm.generate` -> **Throws Error**<br>

<br>`text` (fallback) -> "fix: manual" | Log error, Prompt for manual text, call `git.commit("fix: manual")`. |
| **TS-07** | **Empty Diff Handling** | Git Status: Staged (but empty diff?) | `diff()` -> ""` | Log warning "Empty diff", Prompt for manual text. |

#### 3. Test Data Requirements

**Mock Git Status Object (Dirty State):**

```typescript
const mockDirtyStatus = {
    isClean: () => false,
    staged: [],
    modified: ['file1.ts'],
    not_added: ['file2.ts']
};

```

**Mock LLM Providers (Input Options):**

```typescript
const mockOptions: CommitOptions = {
    availableLLMs: [
        { id: 'openai', name: 'GPT-4', available: true },
        { id: 'anthropic', name: 'Claude', available: false }
    ]
};

```