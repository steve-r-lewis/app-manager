# Technical Specification Document

**Subject:** GitHub Service (`githubService.ts`)
**Version:** 1.4.0
**Date:** January 10, 2026
**Author:** Analysis based on source code by Steve R Lewis

## Part 1: Operational & Design Specification

### 1. Component Overview

* **Purpose:**
  The `GithubService` acts as a **Facade** and **Adapter** layer for the application's Version Control System (VCS). It standardizes interactions with the local file system (via the `simple-git` CLI wrapper) and the remote GitHub REST API (via `fetch`). It encapsulates complex Git command arguments and authentication logic into a unified, high-level API.
* **Role in System:**
  It serves as a core **Infrastructure Service**. It connects the application's business logic (Command Controllers) to the underlying operational resources (Git binary and GitHub Cloud), providing a simplified interface for tasks like "sync," "clone," or "delete repo."


### 2. Architecture & Patterns

* **Design Patterns:**
* **Singleton:** The class is instantiated once (`new GithubService()`) and exported directly, ensuring a single global entry point.
* **Facade:** It hides the complexity of `simple-git` configuration, output stream management, and raw HTTP fetch headers behind semantic methods like `syncRepo` or `listRemoteRepos`.
* **Factory Method (Internal):** The private `git(cwd)` method acts as a transient factory, generating fresh `SimpleGit` instances scoped to specific directories on demand.

* **State Management:**
* **Stateless:** The service is designed to be **stateless**. It does not retain repository paths or configuration between calls. Every public method requires context (like `cwd`) to be passed in, ensuring thread safety and support for managing multiple repositories simultaneously.

* **Complexity Assessment:**
* **Rating:** **Medium**.
* **Justification:** While individual Git commands are simple, the service handles mixed concerns:
* **Hybrid Operations:** Combines CLI execution with HTTP API calls.
* **Stream Management:** The `syncRepo` method manually pipes child process streams (`stdout`/`stderr`) to the main process in verbose modes.
* **Conditionals:** `initRepo` contains branching logic for renaming default branches and conditional user config.


### 3. Dependency Graph

* **Internal Dependencies:**
* `./loggerService`: Used for structured logging (Info/Debug/Error/Warn).
* `../types/index`: Imports shared DTOs (`GitInitOptions`, `GitCloneOptions`, `GitStatusResult`, `GithubRepo`, etc.).


* **External Dependencies:**
* `simple-git`: The core engine for local Git operations.
* `global.fetch`: Native Node.js fetch API for remote GitHub interactions.
* `process.env`: Implicit dependency on `GITHUB_TOKEN` for authentication.
* `process.stdout` / `process.stderr`: Accessed directly during `syncRepo`.


* **Coupling Analysis:**
* **High (Implementation):** Tightly coupled to `simple-git` and the specific structure of GitHub API responses.
* **Low (Interface):** Loosely coupled to consumers. Consumers interact with strict TypeScript interfaces (`GitInitOptions`) rather than raw command strings.


### 4. Data Types & Interfaces

**Key Interfaces (Imported):**

* `GitInitOptions`, `GitCloneOptions`, `GitSubmoduleOptions`, `GitCommitOptions`
* `GitStatusResult`
* `GithubRepo`, `GitRemote`

**Public Method Signatures & Return Types:**

| Method | Signature | Return Type | Notes |
| --- | --- | --- | --- |
| **initRepo** | `(options: GitInitOptions)` | `Promise<void>` |  |
| **cloneRepo** | `(options: GitCloneOptions)` | `Promise<void>` | **New in V1.4.0** |
| **getStatus** | `(cwd: string)` | `Promise<GitStatusResult>` | Maps raw status to structured object. |
| **createCommit** | `(cwd: string, message: string, files?: string[])` | `Promise<void>` | Defaults to adding `.` |
| **push** | `(cwd: string, remote?: string, branch?: string)` | `Promise<void>` |  |
| **syncRepo** | `(cwd: string, silent?: boolean)` | `Promise<void>` | Handles stream piping. |
| **addSubmodule** | `(options: GitSubmoduleOptions)` | `Promise<void>` |  |
| **getRemotes** | `(cwd: string)` | `Promise<GitRemote[]>` |  |
| **getStagedDiff** | `(cwd: string)` | `Promise<string>` | Used for LLM context. |
| **deleteRemoteRepo** | `(owner: string, repo: string)` | `Promise<void>` | **Destructive** |
| **listRemoteRepos** | `(org?: string)` | `Promise<GithubRepo[]>` |  |

### 5. Functional Logic Specification

#### 5.1 Local Git Operations

**`initRepo(options)`**

* **Logic:** Initializes a repo at `cwd`. Checks if the current branch matches `defaultBranch` (default 'main'); if not, renames it (`-M`). Conditionally sets `user.name` and `user.email` if provided in options.
* **Logging:** Logs operation start and configuration changes.

**`cloneRepo(options)`**

* **Logic:** Uses a global `simpleGit()` instance (not bound to CWD) to clone `url` to `destination`.
* **Arguments:** Constructs a dynamic args array to handle optional `--branch` and `--depth`.
* **Error Handling:** Catches failures, logs them as errors, and re-throws with a descriptive message.

**`getStatus(cwd)`**

* **Logic:** Runs `git status`. Maps the result to `GitStatusResult`.
* **Specifics:** Determines `isDirty` by checking `!status.isClean()`. Extracts `ahead`/`behind` counts.
* **Logging:** distinct `debug` level logging to prevent noise during polling.

**`syncRepo(cwd, silent)`**

* **Logic:**
1. Configures `simple-git` output handler. If `!silent`, pipes `stdout` and `stderr` to the parent process.
2. Executes `git pull`.
3. Executes `git submodule update --init --recursive`.


* **Side Effects:** Modifies local disk (pull/update). visible console output if not silent.

**`getRemotes(cwd)`**

* **Logic:** calls `getRemotes(true)` to retrieve full fetch/push URLs.
* **Return:** Returns typed `GitRemote[]`.

#### 5.2 Remote API Operations

**`getAuthHeader()` (Private)**

* **Logic:** Retrieves `GITHUB_TOKEN`. Throws Error if missing. Returns headers object with Bearer token and Accept definition.

**`deleteRemoteRepo(owner, repo)`**

* **Logic:** Sends `DELETE` request to GitHub API.
* **Safety:** Logs a specific warning before execution.
* **Error Handling:** Throws if response status is not OK.

**`listRemoteRepos(org?)`**

* **Logic:** Determines endpoint: `orgs/${org}/repos` vs `user/repos`. Sends `GET` request.
* **Return:** Returns array of `GithubRepo`.
* **Error Handling:** Throws on non-200 responses.

---

## Part 2: Appendix - Testing Reference

### 1. Mocking Strategy

To unit test `githubService.ts`, we must intercept calls to the file system (via `simple-git`) and the network (via `fetch`).

* **Mock `simple-git`:**
* The module exports a factory function. We must mock this factory to return a **Mock Git Instance**.
* **Mock Instance Methods:** `init`, `branchLocal`, `branch`, `addConfig`, `clone`, `status`, `add`, `commit`, `push`, `pull`, `submoduleUpdate`, `submodule`, `getRemotes`, `diff`.
* **Special Handling:** `outputHandler` needs to be mocked to capture callbacks for `syncRepo` tests.


* **Mock `global.fetch`:**
* Must be mocked to simulate GitHub API responses.
* **Response Objects:** Must provide `.ok` (boolean), `.status` (number), `.statusText` (string), and `.json()` (Promise).


* **Mock `loggerService`:**
* Mock `logger.info`, `logger.debug`, `logger.error`, `logger.warn` to verify log output without cluttering test results.



### 2. Test Scenarios

| ID | Scenario | Input / Setup | Expected Behavior |
| --- | --- | --- | --- |
| **TS-01** | **Init Repo (Standard)** | `GitInitOptions` with `cwd` only. | Calls `init`. Checks branch (if not 'main', calls `branch -M main`). |
| **TS-02** | **Init Repo (Config)** | `GitInitOptions` with `userName`. | Calls `addConfig('user.name', ...)` |
| **TS-03** | **Clone Repo (Success)** | `GitCloneOptions` { url, dest, branch }. | Calls `clone(url, dest, ['--branch', ...])`. |
| **TS-04** | **Clone Repo (Fail)** | `simpleGit.clone` throws error. | Service catches, logs error, re-throws wrapped Error. |
| **TS-05** | **Get Status** | `simpleGit.status` returns dirty state. | Returns object with `isDirty: true`, maps `modified` files. |
| **TS-06** | **Sync Repo (Verbose)** | `syncRepo(cwd, false)` | Calls `outputHandler` to attach pipes. Calls `pull` and `submoduleUpdate`. |
| **TS-07** | **Remote List (User)** | `listRemoteRepos(undefined)` | Fetch calls `.../user/repos`. Returns JSON list. |
| **TS-08** | **Remote List (Org)** | `listRemoteRepos("my-org")` | Fetch calls `.../orgs/my-org/repos`. |
| **TS-09** | **Remote Auth Fail** | `process.env.GITHUB_TOKEN` is null. | API methods throw "Missing GITHUB_TOKEN" immediately. |
| **TS-10** | **Delete Remote** | `deleteRemoteRepo("user", "repo")` | Fetch calls `DELETE`. Throws if response `!ok`. |

### 3. Test Data Requirements

**A. Mock Simple-Git Status Response**

```json
{
  "current": "feature/dev",
  "isClean": false, // Mock function returning false
  "modified": ["src/app.ts"],
  "staged": [],
  "ahead": 2,
  "behind": 0,
  "conflicted": []
}

```

**B. Mock GitHub API Repository List**

```json
[
  {
    "id": 101,
    "name": "project-alpha",
    "full_name": "org/project-alpha",
    "private": true,
    "html_url": "https://github.com/org/project-alpha",
    "owner": { "login": "org" }
  }
]

```

**C. Mock Clone Options**

```json
{
  "url": "https://github.com/test/repo.git",
  "destination": "./workspace/repo",
  "branch": "develop",
  "depth": 1
}

```