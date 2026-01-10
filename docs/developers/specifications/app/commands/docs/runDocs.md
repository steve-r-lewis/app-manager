Based on the analysis of the provided source code `runDocs.ts.old`, here is the formal Technical Specification Document and Test Strategy Appendix.

---

# Part 1: Operational & Design Specification

## 1. Component Overview

* 
**Purpose:** This module acts as an orchestration utility for documentation workflows. It serves a dual purpose: managing internal documentation for the "App Manager" tool and providing an interface to build, serve, or preview documentation for a target Nuxt monorepo.


* **Role in System:** The component functions as a **CLI Command Module** (Utility Layer). It sits between the user (via interactive prompts) and the system shell (via `child_process`), acting as a context-aware task runner that abstracts package manager differences.



## 2. Architecture & Patterns

* **Design Patterns:**
* 
**Facade Pattern:** The module provides a simplified interactive interface (`clack/prompts`) over complex underlying shell commands (`vitepress dev/build/preview`).


* 
**Strategy Pattern (Rudimentary):** The `detectPM` helper implements a logic strategy to select the execution context (`npm`, `pnpm`, `yarn`, or `bun`) based on the presence of lock files.




* **State Management:**
* **Stateless:** The component is procedural. It reads the file system state at the moment of execution, performs an action, and terminates. It does not maintain persistence or sessions.


* **Complexity Assessment:** **Low to Medium**.
* The control flow is linear with a single branching menu structure.
* Complexity arises primarily from the `detectPM` logic and the conditional construction of the menu options based on the `targetRoot` analysis.





## 3. Dependency Graph

* **Internal Dependencies:**
* 
`node:fs` (File System) – Used to check for lock files and read `package.json`.


* 
`node:path` – Used for path resolution.


* 
`node:child_process` – Used to spawn shell commands.




* **External Dependencies:**
* 
`@clack/prompts`: Interactive CLI menus (`select`, `isCancel`).


* 
`consola`: structured logging.


* 
`picocolors`: Terminal string styling.




* **Coupling Analysis:**
* 
**High Coupling to File System:** The logic hardcodes checks for specific filenames (`pnpm-lock.yaml`, `package.json`) and specific dependency names (`vitepress`).


* 
**Loose Coupling to Package Managers:** By abstracting the executable choice via `detectPM`, the code is not tightly coupled to a single package manager, allowing it to adapt to `bun`, `yarn`, `pnpm`, or `npm` dynamically.





## 4. Data Types & Interfaces

* **Key Interfaces:**
* No explicit TypeScript interfaces are defined for the internal data structures.
* *Implicit Interface (Menu Option):*
```typescript
{ value: string; label: string; hint?: string }

```




* **Return Types:**
* `detectPM(root: string): string` – Returns `'pnpm' | 'yarn' | 'bun' | [cite_start]'npm'` (Implicit string).


* 
`runScript(cmd, args, cwd): Promise<void>` – Returns a void Promise upon process completion.


* 
`runDocs(targetRoot, toolRoot): Promise<void>` – The main export is an async void function.





## 5. Functional Logic Specification

### 5.1 Helper: `detectPM(root: string)`

* **Logic Flow:**
1. Receives a root directory path.
2. Checks for existence of `pnpm-lock.yaml`. If found, returns `'pnpm'`.


3. Checks for existence of `yarn.lock`. If found, returns `'yarn'`.


4. Checks for existence of `bun.lockb`. If found, returns `'bun'`.


5. Default fallback: returns `'npm'`.





### 5.2 Helper: `runScript(cmd, args, cwd)`

* **Logic Flow:**
1. Logs the intended command using `consola` and `picocolors`.


2. Returns a `Promise`.
3. Invokes `spawn` with `stdio: 'inherit'` to allow user interaction directly in the shell.


4. Listens for `close`. Resolves if code is 0; Rejects with Error if code is non-zero.
5. Listens for `error`. Rejects on spawn failure.





### 5.3 Main Export: `runDocs(targetRoot, toolRoot)`

* **Logic Flow:**
1. **Analyze Context:**
* Constructs path to `targetRoot/package.json`.


* Defaults `projectPM` to `'npm'`.
* If `package.json` exists, it parses the content. It checks `dependencies` and `devDependencies` for the key `vitepress`.


* If `vitepress` is found, `hasProjectDocs` becomes `true`, and `projectPM` is determined via `detectPM`.




2. **Analyze Tool:**
* Determines `toolPM` via `detectPM(toolRoot)`.




3. **Build Menu:**
* Initializes options with "Start App Manager Docs" (Tool Root).


* 
**Conditional:** If `hasProjectDocs` is true, appends options for "Start Project Docs", "Build Project Docs", and "Preview Project Docs".


* Appends "Go Back".




4. **User Selection:**
* Awaits user input via `select`. If canceled or 'back', returns immediately.




5. **Execution:**
* **Case `tool:dev`:** Runs `vitepress dev` in `toolRoot`. If PM is `npm`, creates command `npx vitepress dev`. Otherwise, uses PM binary directly (e.g., `pnpm vitepress dev`).


* 
**Case `project:dev`:** Runs `vitepress dev` in `targetRoot` using `projectPM`.


* 
**Case `project:build`:** Runs `vitepress build` in `targetRoot` using `projectPM`.


* 
**Case `project:preview`:** Runs `vitepress preview` in `targetRoot` using `projectPM`.






* **Error Handling:**
* Catches generic errors during execution and logs via `consola.error`.


* *Warning:* The generic catch block `catch (err: any)` suppresses stack traces, outputting only the message.



---

# Part 2: Appendix - Testing Reference

## 1. Mocking Strategy

To achieve unit isolation, the following mocks are required. The module relies heavily on filesystem side effects and shell execution.

| Dependency | Mock Requirement | Purpose |
| --- | --- | --- |
| `fs` | `existsSync(path)` | Control detection of lock files (to test PM selection) and `package.json` existence. |
| `fs` | `readFileSync(path)` | Inject mock `package.json` content to test `vitepress` dependency detection. |
| `child_process` | `spawn` | Prevent actual shell commands. Must return a mock ChildProcess object emitting `close` (code 0 or 1) and `error` events. |
| `@clack/prompts` | `select` | Simulate user menu selection. |
| `@clack/prompts` | `isCancel` | Simulate user cancellation (Ctrl+C). |

## 2. Test Scenarios

### Happy Path Scenarios

| ID | Scenario | Pre-conditions | User Action | Expected Outcome |
| --- | --- | --- | --- | --- |
| **HP-01** | **Run Tool Docs (npm)** | `toolRoot` has no lockfile (defaults npm). | Select `tool:dev` | `spawn` called with `npx vitepress dev` in `toolRoot`. |
| **HP-02** | **Run Tool Docs (pnpm)** | `toolRoot` has `pnpm-lock.yaml`. | Select `tool:dev` | `spawn` called with `pnpm vitepress dev` in `toolRoot`. |
| **HP-03** | **Detect Target Docs** | `targetRoot` `package.json` contains `vitepress`. | N/A (Menu Build) | Menu options include Project Dev, Build, and Preview. |
| **HP-04** | **Run Project Build** | `targetRoot` has `vitepress` and `bun.lockb`. | Select `project:build` | `spawn` called with `bun vitepress build` in `targetRoot`. |

### Edge Cases

| ID | Scenario | Pre-conditions | User Action | Expected Outcome |
| --- | --- | --- | --- | --- |
| **EC-01** | **No Target Docs** | `targetRoot` `package.json` missing `vitepress`. | N/A (Menu Build) | Menu only shows "Start App Manager Docs" and "Back". |
| **EC-02** | **Malformed JSON** | `targetRoot` `package.json` is invalid JSON. | N/A (Menu Build) | `JSON.parse` throws internally (caught); treats as no docs found; loads fallback menu. |
| **EC-03** | **User Cancel** | N/A | User presses `Ctrl+C` | Function returns without calling `spawn`. |

### Error States

| ID | Scenario | Pre-conditions | Expected Outcome |
| --- | --- | --- | --- |
| **ER-01** | **Process Failure** | `spawn` child process emits code `1`. | `runScript` promise rejects; `runDocs` catches and logs `Docs Command Failed`. |
| **ER-02** | **Spawn Error** | `spawn` emits `error` event. | `runScript` promise rejects; `runDocs` catches and logs error message. |

## 3. Test Data Requirements

**A. Mock `package.json` (With Vitepress)**

```json
{
  "name": "target-project",
  "devDependencies": {
    "vitepress": "^1.0.0"
  }
}

```

**B. Mock `package.json` (Without Vitepress)**

```json
{
  "name": "target-project",
  "dependencies": {
    "nuxt": "^3.0.0"
  }
}

```

**C. Path Constants**

* `MOCK_TOOL_ROOT`: `"/usr/local/tool"`
* `MOCK_TARGET_ROOT`: `"/Users/dev/my-project"`