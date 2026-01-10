Here is the Technical Specification and Test Strategy document based on the provided source code.

---

# Technical Specification: Git Commit Command Component

## Part 1: Operational & Design Specification

### 1. Component Overview

* **Purpose:** To provide an interactive CLI command that automates the git commit process. It handles staging validation, allows for manual message entry, and integrates an AI service to generate commit messages based on diff analysis.
* **Role in System:** This component acts as a **Controller/Command Layer**. It serves as the glue between the User Interface (`@clack/prompts`), the Git data layer (`githubService`), and the AI processing layer (`llmService`).

### 2. Architecture & Patterns

* **Design Patterns:**
* **Command Pattern:** The class extends `BaseCommand`, encapsulating the request as an object with standard `isEnabled` and `execute` methods.
* **Singleton Consumption:** It consumes singleton instances of services (`githubService`, `llmService`, `logger`) rather than receiving them via Dependency Injection (DI) in the constructor.
* **Facade Pattern:** It simplifies complex git operations and AI generation into a linear user flow.


* **State Management:**
* **Stateless:** The class itself does not maintain state between executions. All necessary state (target root, options) is passed as arguments to the `execute` method.


* **Complexity Assessment:** **Medium**.
* While the logic is linear, it handles multiple asynchronous I/O operations, complex branching logic based on git status (dirty/staged), and includes interactive UI loops (AI generation, review, fallback to manual).



### 3. Dependency Graph

* **Internal Dependencies (Project Modules):**
* `../baseCommand`: Base class for inheritance.
* `../../services/githubService`: Handles git operations (status, diff, commit).
* `../../services/llmService`: Handles AI text generation.
* `../../services/loggerService`: Handles terminal output logging.
* `../../types/index`: Type definitions (`CommandOptions`).


* **External Dependencies (Libraries):**
* `@clack/prompts`: User input handling (confirm, text, spinner).
* `picocolors`: Terminal text formatting.


* **Coupling Analysis:**
* **High Coupling:** The services are imported directly (e.g., `import { githubService }...`). This makes unit testing difficult without mocking the module loading system or the specific import paths, violating Inversion of Control (IoC) principles.



### 4. Data Types & Interfaces

* **Key Interfaces:**
* `CommandOptions`: Used to pass flags like `--yes` or `--message`.


* **Return Types:**
* `isEnabled`: `Promise<boolean>`.
* `execute`: `Promise<void>`.



### 5. Functional Logic Specification

#### Method: `constructor()`

* **Logic:** Initializes the command metadata.
* **Attributes Set:** `id` ('git.commit'), `domain` ('git'), `name` ('commit'), `label`, `description`.

#### Method: `isEnabled(targetRoot: string): Promise<boolean>`

* **Logic Flow:**
1. Calls `githubService.getStatus(targetRoot)`.
2. Checks if a `branch` exists on the status object.
3. Returns `true` if successful, `false` if an error occurs (catch block).



#### Method: `execute(targetRoot: string, options: CommandOptions): Promise<void>`

**Step 1: Status Check & Staging**

1. **Retrieve Status:** Calls `githubService.getStatus`.
2. **Unstaged Handling:**
* Condition: `isDirty` is true AND `staged.length` is 0.
* Action: Checks `options.yes`. If false, prompts user to "Stage ALL changes?".
* Abort: If user declines, logs warning and returns.
* Execution: Calls `githubService.createCommit(targetRoot, 'temp', ['.'])`. *Note: The code implies this is a workaround to trigger `git add .`, but the method name `createCommit` suggests a commit is created immediately*.


3. **Clean Handling:**
* Condition: `!isDirty`.
* Action: Logs success and returns immediately.



**Step 2: Message Determination**

1. **Check Options:** Checks if `options.message` is already provided.
2. **AI Flow (if no message):**
* Prompts user: "Generate commit message with AI?"
* If **Yes**:
* Retrieves diff via `githubService.getStagedDiff`.
* Validation: If diff is empty, warns and falls back.
* Generation: Calls `llmService.generate` with a prompt requesting Conventional Commits compliance.
* Review: Prompts user to confirm the generated message.
* Rejection: If user rejects, `message` is reset to empty string.


* Error Handling: Catches AI errors, logs them, and falls back to manual entry.


3. **Manual Fallback:**
* Condition: If `message` is still empty (due to no AI, rejected AI, or manual preference).
* Action: Prompts `text` input.
* Validation: Requires message length > 0.



**Step 3: Commit Execution**

1. Condition: If a valid `message` exists.
2. Action: Starts spinner.
3. Execution: Calls `githubService.createCommit(targetRoot, message)`.
4. Output: Logs success with the commit message.

---

## Part 2: Appendix - Testing Reference

### 1. Mocking Strategy

To achieve unit test isolation, the following dependencies must be mocked. Since Dependency Injection is not used, `jest.mock` (or equivalent) must be used on the module paths.

* **`@clack/prompts`**:
* `confirm`: Mock to return `true`/`false`/`isCancel`.
* `text`: Mock to return string/`isCancel`.
* `spinner`: Mock `start` and `stop` methods.
* `isCancel`: Mock to return boolean based on input.


* **`../../services/githubService`**:
* `getStatus`: Return `{ branch: string, isDirty: boolean, staged: string[] }`.
* `getStagedDiff`: Return a diff string or empty string.
* `createCommit`: Mock to verify arguments (root, message, files).


* **`../../services/llmService`**:
* `generate`: Mock to return a string (e.g., "feat: mock ai message").



### 2. Test Scenarios

| Scenario ID | Category | Description | Mock Behavior | Expected Outcome |
| --- | --- | --- | --- | --- |
| **TS-01** | Happy Path | Clean Directory | `getStatus` returns `isDirty: false` | Log "Working directory is clean" and exit. |
| **TS-02** | Happy Path | Manual Commit (Staged) | `getStatus` returns `isDirty: true`, `staged: ['file.ts']`<br>

<br>`options.message`: "feat: manual" | Call `createCommit` with "feat: manual". |
| **TS-03** | Happy Path | AI Commit Flow | `getStatus` returns staged changes.<br>

<br>`confirm` (AI): true.<br>

<br>`llmService`: returns "feat: ai".<br>

<br>`confirm` (Review): true. | Call `getStagedDiff`, call `llmService.generate`, call `createCommit` with "feat: ai". |
| **TS-04** | Edge Case | Unstaged Changes -> Stage All | `getStatus` returns `isDirty: true`, `staged: []`.<br>

<br>`confirm` (Stage): true. | Call `createCommit` with "temp" and `['.']` (per logic in lines 74-78). |
| **TS-05** | Edge Case | Unstaged Changes -> Abort | `getStatus` returns `isDirty: true`, `staged: []`.<br>

<br>`confirm` (Stage): false. | Log "Commit aborted" and return. |
| **TS-06** | Error State | AI Generation Fails | `llmService.generate` throws Error.<br>

<br>`text` input: "fix: fallback". | Log error, Prompt for manual text, Call `createCommit` with "fix: fallback". |
| **TS-07** | Error State | AI Message Rejected | `llmService` returns message.<br>

<br>`confirm` (Review): false.<br>

<br>`text` input: "fix: manual override". | Prompt for manual text after rejection, Call `createCommit` with "fix: manual override". |

### 3. Test Data Requirements

**Status Object (Clean)**

```json
{
  "branch": "main",
  "isDirty": false,
  "staged": []
}

```

**Status Object (Dirty & Staged)**

```json
{
  "branch": "feature/login",
  "isDirty": true,
  "staged": ["src/auth.ts"]
}

```

**Diff String (Mock)**

```text
diff --git a/src/auth.ts b/src/auth.ts
index 83a02..29b12 100644
--- a/src/auth.ts
+++ b/src/auth.ts
@@ -1,3 +1,3 @@
- console.log('hello');
+ console.log('secure login');

```





# **Functional and Design Specification: `CommitCommand**`

## **1. Overview**

The `CommitCommand` class standardizes the "Smart Commit" workflow. It encapsulates the logic for staging changes, generating commit messages (manually or via AI), and executing the commit within the application's command architecture. It replaces the legacy `manageCommits` function.

## **2. File Information**

* **File Path:** `~/app/commands/git/commitCommand.ts`
* **Class Name:** `CommitCommand`
* **Extends:** `BaseCommand`
* **Legacy Source:** `manageCommits.ts.old`
* **Dependencies:**
* `simple-git`: For Git operations (status, diff, add, commit).
* `@clack/prompts`: For interactive TUI (spinners, confirms, text inputs).
* `../../services/llmService`: For AI message generation.
* `../../services/loggerService`: For standardized output.

## **3. Functional Requirements**

**3.1. Command Metadata**
The command must register with the following identity:

* **ID:** `git.commit`
* **Domain:** `git`
* **Name:** `commit`
* **Label:** `📝 Smart Commit (AI)`
* **Description:** `Stages and commits changes, optionally using AI to write the message.`

**3.2. Enablement Check (`isEnabled`)**

* **Input:** `targetRoot` (string).
* **Logic:** Returns `true` only if `targetRoot` is a valid Git repository (contains a `.git` folder or is part of a worktree).

**3.3. Execution Logic (`execute`)**

* **Phase 1: Status & Staging**
* Check repository status.
* If **Clean**: Log success ("Nothing to commit") and exit.
* If **Dirty but Nothing Staged**: Prompt user: *"Stage ALL changes?"*
* *Yes:* execute `git add .` and proceed.
* *No/Cancel:* Abort operation.

* **Phase 2: Message Generation**
* If a message is provided in `options`, use it.
* If no message, Prompt: *"Generate commit message with AI?"*
* **AI Path:**
1. Retrieve staged diff.
2. If diff is empty, warn and fallback to manual.
3. Send diff to `llmService.generate` with a Conventional Commits prompt.
4. Display generated message.
5. Prompt: *"Use this message?"* (Yes/No).
6. If rejected, force manual entry.

* **Manual Path:**
1. Display text input prompt.
2. Validate input is not empty.

* **Phase 3: Execution**
* Execute `git commit -m <message>`.
* Display success spinner and log the final commit message.

## **4. Design Specification**

**4.1. Class Definition**

```typescript
import { BaseCommand } from '../baseCommand';
import { githubService } from '../../services/githubService'; // or simple-git directly
import { llmService } from '../../services/llmService';

export class CommitCommand extends BaseCommand {
    constructor() {
        super({
            id: 'git.commit',
            domain: 'git',
            name: 'commit',
            label: '📝 Smart Commit (AI)',
            description: 'Stages and commits changes, optionally using AI to write the message.'
        });
    }
    // ... methods
}
```

**4.2. Key Methods**

* **`isEnabled(targetRoot: string): Promise<boolean>`**
* Wraps `simple-git.checkIsRepo()` or similar status check. Returns `false` on error.

* **`execute(targetRoot: string, options: CommandOptions): Promise<void>`**
* Implements the three phases defined in functional requirements.
* Uses `spinner` for all async operations (analysis, staging, committing).
* Wraps all logic in `try/catch` to log errors via `logger.error` without crashing the app.

---

# **5. Test Suite Specification**

The following test suite ensures reliability across standard workflows and edge cases.

## **5.1. Test Setup**

* **File:** `~/app/commands/git/__tests__/commitCommand.test.ts`
* **Mocks Required:**
* `simple-git` (or `githubService`): Mock `status`, `add`, `diff`, `commit`.
* `@clack/prompts`: Mock `confirm`, `text`, `spinner`, `isCancel`.
* `llmService`: Mock `generate`.

## **5.2. Test Cases**

**A. Enablement (`isEnabled`)**

1. **Should return `true**` when `git.checkIsRepo` resolves true.
2. **Should return `false**` when `git.checkIsRepo` throws or returns false.

**B. Phase 1: Status & Staging**
3.  **Clean Repo:** Call execute with clean status. Expect: Logger success message, no prompts, no commit calls.
4.  **Dirty/Unstaged (User Accepts):** Status shows modified files but 0 staged. Mock `confirm` returns `true`. Expect: `git.add` called, flow proceeds to message generation.
5.  **Dirty/Unstaged (User Rejects):** Status shows modified files. Mock `confirm` returns `false`. Expect: Logger warning, immediate return.
6.  **Dirty/Staged:** Status shows staged files. Expect: No "Stage all" prompt, flow proceeds to message generation.

**C. Phase 2: Message Generation**
7.  **Option Message:** Call execute with `{ message: "cli-msg" }`. Expect: No AI prompts, `git.commit` called with "cli-msg".
8.  **Manual Flow:** User selects "No" for AI. Mock `text` returns "manual-msg". Expect: `git.commit` called with "manual-msg".
9.  **AI Flow (Success):** User selects "Yes" for AI. `llmService.generate` returns "feat: ai-msg". User accepts. Expect: `git.commit` called with "feat: ai-msg".
10. **AI Flow (Reject & Edit):** User selects "Yes" for AI. AI returns "feat: bad". User rejects. Code loops to manual input. User enters "feat: fixed". Expect: `git.commit` called with "feat: fixed".

**D. Edge Cases & Error Handling**
11. **Empty Diff for AI:** User selects AI, but `git diff` returns empty string (rare race condition). Expect: Warning log, fallback to manual input or abort.
12. **AI Service Failure:** `llmService.generate` throws error. Expect: Spinner stops, error logged, fallback to manual input (do not crash).
13. **Commit Failure:** `git.commit` throws error (e.g., gpg signing fail). Expect: Error logged via `logger.error`, app remains stable.
14. **User Cancellation:** User presses `Ctrl+C` (returns `isCancel`) at "Stage all", "Use AI", or "Manual Input" prompts. Expect: Immediate return, no git operations executed.

---


### 4. Next Step

Would you like me to generate a **Jest test file** (`commitCommand.test.ts`) that implements these mocks and scenarios to ensure the refactoring maintains existing functionality?



