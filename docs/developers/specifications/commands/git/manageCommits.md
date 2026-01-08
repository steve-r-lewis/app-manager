# 📋 Feature 6: Smart Commit (`git.commit`)

**Legacy Reference:** `manageCommits.ts.old` 

## 1. User Story

As a developer, I want to commit my changes with a semantic message. If I am feeling lazy or stuck, I want the AI to analyze my staged changes and write a "Conventional Commits" compliant message for me, optionally allowing me to choose which AI model to use.

## 2. Inputs & Configuration

* **Target Root:** The repository path.
* **Options:**
* `--message` or `-m` (String): Direct message (bypasses AI).
* `availableLLMs` (Array): List of healthy AI providers (passed from the Health Check in `index.ts`).

## 3. Functional Requirements

1. **Staging Logic:**

  * Check `git status`.
  * **Clean Tree:** If clean, exit with "Nothing to commit".
  * **Unstaged Changes:** If changes exist but nothing is staged, prompt: "Stage all changes?".
  * *Action:* If yes, run `git add .`.

2. **Message Generation Strategy:**

  * **Direct:** If `--message` is provided, use it immediately.
  * **Interactive:** If no message:
  * Check availability of AI providers.
  * **Provider Selection (Gap):** If multiple AIs are active (e.g., Gemini + OpenAI), prompt user to select one.
  * **Manual Fallback:** Always offer "Manual Entry" as an option.

3. **AI Workflow:**

  * Fetch `git diff --cached`.
  * **Safety Check:** If diff is > 6000 chars, warn user or truncate (Legacy sanitized it).
  * **Prompting:** Send diff to LLM with instructions for "Conventional Commits" format.
  * **Review:** Display generated message. Allow user to **Confirm** or **Edit**.

4. **Execution:**

  * Run `git commit -m "<message>"`.
  * Log success.

## 4. Gap Analysis (Old vs. New)

* **Provider Selection:** The legacy file `manageCommits.ts.old`  explicitly allowed selecting a provider (`options.availableLLMs`). Our current `CommitCommand` assumes the `llmService` picks a default. We should restore this selection menu to give users control over which model writes their history.
* **Context Sanitization:** The legacy file called `llm.sanitizeContext(diff, 6000)`. We need to ensure our new `llmService` handles this, or add it back to the command.



### **Function Analysis: `manageCommits**`

#### **1. Overview**

This is an asynchronous function designed to streamline the Git commit process. It acts as a "Smart Commit Manager" that handles the staging of files and the generation of commit messages. It integrates with an LLM service to automatically generate semantic, "Conventional Commit" style messages based on the actual file diffs, while offering the user the ability to review, edit, or manually enter messages.

#### **2. Function Specification**

* **Signature:** `export async function manageCommits(targetRoot: string, options: CommitOptions = {}): Promise<void>`
* **Parameters:**
* `targetRoot` (string): The absolute file path to the root directory of the Git repository.
* `options` (optional): An object of type `CommitOptions` containing:
* `message` (string, optional): A pre-defined commit message. If provided, the generation/prompting steps are skipped.
* `availableLLMs` (array, optional): A list of available LLM providers used to determine if AI generation is possible.
* **Return Value:** `Promise<void>` (The function performs side effects—Git operations and UI prompts—without returning a value).

#### **3. Operational Workflow**

**Phase 1: Status Check & Staging**

1. 
**Initialization:** Sets up the `simple-git` instance for the target root and starts a spinner.

2. **Status Check:** Fetches the current repository status.
  * If the working tree is clean (no modified or staged files), it logs a message and exits.

3. **Smart Staging:**
  * It checks if there are modified/untracked files but **nothing currently staged**.
  * If so, it prompts the user: "No changes staged. Stage all changes?"
  * If confirmed, it runs `git add .` to stage all changes.
  * If cancelled, the function exits.

**Phase 2: Message Generation**
If a message was not passed in `options`, the function determines how to create one:

1. **Strategy Selection:**
  * It checks `options.availableLLMs` to see if AI providers are available.
  * If AI is available, it prompts the user to choose a strategy: "AI Generated (Smart)" or "Manual Entry".

2. **AI Generation Path:**
  * **Context Retrieval:** Fetches the `git diff --cached`.
  * **Sanitization:** Passes the diff to `llm.sanitizeContext` to ensure it fits within token limits (truncating at 6000 chars).

  * **Prompting:** Sends a specific prompt to the LLM to generate a "Conventional Commit" formatted message based on the diff.
  * **Review/Edit:** Presents the generated message to the user inside a text input field (`initialValue`). This allows the user to simply press Enter to accept it, or type to edit/rewrite it completely.
  * **Fallback:** If AI generation fails (error caught), it falls back to a manual text prompt.

3. **Manual Path:**
  * Simply prompts the user to type the commit message manually via a text input.

**Phase 3: Execution**

1. **Commit:** If a valid `commitMessage` exists, it executes `git commit -m "message"`.
2. **Feedback:** Logs a success message with the committed text.
3. **Error Handling:** Wraps the entire process in a try-catch block to handle Git errors gracefully.

#### **4. Dependencies**

The function relies on the following external and internal modules:

* **`@clack/prompts`:** Used for the interactive CLI UI (`intro`, `outro`, `text`, `confirm`, `select`, `isCancel`, `spinner`).
* **`simple-git`:** Used for all Git operations (`status`, `add`, `diff`, `commit`).
* **`picocolors`:** Used for coloring console output (cyan for header, green for success).
* **`../../services/loggerService`:** Custom logger for success/error messages.
* **`../../services/llmService`:** Custom service for interacting with LLMs (`sanitizeContext`, `generate`).
* **`../../types`:** Type definition for `CommitOptions`.

### **Usage Example**

```typescript
import { manageCommits } from './path/to/manageCommits';

// Standard interactive usage (will detect AI availability from options)
await manageCommits(process.cwd(), {
    availableLLMs: [{ id: 'gpt-4', name: 'GPT-4', available: true }]
});

// Headless/Pre-defined usage (skips prompts if message is provided)
await manageCommits(process.cwd(), {
    message: 'chore: automated update'
});
```

---

### **Possible next steps**

* Create the `llmService` mock referenced in the dependencies?
* Add a logic branch to support `git commit --amend` if the user wants to update the previous commit?
* Refactor the prompt to include specific project context or style guidelines for the LLM?



