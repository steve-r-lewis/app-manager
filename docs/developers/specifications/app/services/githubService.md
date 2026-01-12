# Technical Specification Document

**Subject:** GitHub Service (`githubService.ts`)
**Version:** 1.4.0 (Analysis Derived)
**Date:** January 10, 2026

## Part 1: Operational & Design Specification

### 1. Component Overview

* **Purpose:** The `GithubService` functions as a unified interface for Version Control System (VCS) operations. It standardizes interactions between the local file system (using the `simple-git` CLI wrapper) and the remote GitHub REST API.
* **Role in System:** It acts as a core **Infrastructure Service**, bridging the application's business logic (Command Controllers) with operational resources (Git binary and GitHub Cloud).

### 2. Architecture & Patterns

* **Design Patterns:**
* **Singleton:** The class is instantiated once and exported directly, providing a single global entry point.
* **Facade:** It abstracts the complexities of `simple-git` configuration, stream management, and raw HTTP headers behind semantic methods (e.g., `syncRepo`).
* **Adapter:** It adapts raw API and CLI outputs into typed application DTOs.
* **Factory Method (Internal):** A private `git(cwd)` method generates fresh `SimpleGit` instances scoped to specific directories on demand.


* **State Management:**
* **Stateless:** The service does not retain repository paths or configuration between calls. Context (such as `cwd`) is passed into every public method to ensure thread safety.


* **Complexity Assessment:**
* **Rating:** Medium.
* **Justification:** The service manages mixed concerns including CLI execution, HTTP API calls, and manual stream piping (`stdout`/`stderr`) for verbose operations.



### 3. Dependency Graph

* **Internal Dependencies:**
* `./loggerService`: For structured logging (Info, Debug, Error, Warn).
* `../types/index`: Imports shared DTOs like `GitInitOptions`, `GitStatusResult`, and `GithubRepo`.


* **External Dependencies:**
* `simple-git`: Core engine for local Git operations.
* `global.fetch`: Native Node.js API for remote GitHub interactions.
* `process.env`: Relies on `GITHUB_TOKEN` for API authentication.
* `process.stdout` / `process.stderr`: Accessed directly for stream piping during sync operations.


* **Coupling Analysis:**
* **High (Implementation):** Tightly coupled to `simple-git` and GitHub API response structures.
* **Low (Interface):** Consumers interact via strict TypeScript interfaces, decoupling them from raw command strings.



### 4. Data Types & Interfaces

**Key Interfaces:**
The service relies on strict typing for inputs and outputs. Key interfaces include `GitInitOptions`, `GitCloneOptions`, `GitSubmoduleOptions`, `GitCommitOptions`, `GitStatusResult`, `GithubRepo`, and `GitRemote`.

**Public Method Signatures:**

| Method | Signature | Return Type |
| --- | --- | --- |
| `initRepo` | `(options: GitInitOptions)` | `Promise<void>` |
| `cloneRepo` | `(options: GitCloneOptions)` | `Promise<void>` |
| `getStatus` | `(cwd: string)` | `Promise<GitStatusResult>` |
| `createCommit` | `(cwd: string, message: string, files?: string[])` | `Promise<void>` |
| `push` | `(cwd: string, remote?: string, branch?: string)` | `Promise<void>` |
| `syncRepo` | `(cwd: string, silent?: boolean)` | `Promise<void>` |
| `addSubmodule` | `(options: GitSubmoduleOptions)` | `Promise<void>` |
| `getRemotes` | `(cwd: string)` | `Promise<GitRemote[]>` |
| `getStagedDiff` | `(cwd: string)` | `Promise<string>` |
| `deleteRemoteRepo` | `(owner: string, repo: string)` | `Promise<void>` |
| `listRemoteRepos` | `(org?: string)` | `Promise<GithubRepo[]>` |

### 5. Functional Logic Specification

#### 5.1 Local Git Operations

**`initRepo(options)`**

* **Logic Flow:** Initializes a repository at the specified `cwd`. It checks if the current branch matches the default (usually 'main') and renames it if necessary. It conditionally sets `user.name` and `user.email` if provided.
* **Side Effects:** Creates `.git` directory, modifies git config, potentially renames branches.

**`cloneRepo(options)`**

* **Logic Flow:** Utilizes a global `simpleGit()` instance to clone a repository URL to a specific destination. It dynamically constructs arguments to handle optional flags like `--branch` and `--depth`.
* **Error Handling:** Catches failures, logs them via `loggerService`, and re-throws a descriptive error.

**`getStatus(cwd)`**

* **Logic Flow:** Executes `git status`. It maps the raw result to a `GitStatusResult` object, determining `isDirty` status and extracting ahead/behind counts.
* **Logging:** Uses distinct `debug` level logging to prevent noise.

**`syncRepo(cwd, silent)`**

* **Logic Flow:**
1. Configures the `simple-git` output handler.
2. If `!silent`, pipes `stdout` and `stderr` directly to the parent process.
3. Executes `git pull` followed by `git submodule update --init --recursive`.



**`getRemotes(cwd)`**

* **Logic Flow:** Calls `getRemotes(true)` to retrieve the full fetch and push URLs, returning them as a typed array.

#### 5.2 Remote API Operations

**`getAuthHeader()` (Private)**

* **Logic Flow:** Retrieves `GITHUB_TOKEN` from environment variables. Throws an error if missing. Returns a headers object containing the Bearer token.

**`deleteRemoteRepo(owner, repo)`**

* **Logic Flow:** Sends a `DELETE` HTTP request to the GitHub API.
* **Safety:** Logs a specific warning before execution.
* **Error Handling:** Throws an exception if the response status is not OK.

**`listRemoteRepos(org?)`**

* **Logic Flow:** Determines the target endpoint based on whether an `org` is provided (`orgs/${org}/repos` vs `user/repos`). Sends a `GET` request and returns an array of `GithubRepo` objects.

---

## Part 2: Appendix - Testing Reference

### 1. Mocking Strategy

To isolate the unit under test, the following external boundaries must be intercepted:

* **`simple-git`:**
* **Mock Implementation:** Must mock the exported factory function to return a "Mock Git Instance".
* **Instance Methods:** Crucial methods to mock include `init`, `addConfig`, `clone`, `status`, `pull`, `submoduleUpdate`, and `outputHandler`.
* **Behavior:** The `outputHandler` mock is specifically required to verify `syncRepo` piping logic.


* **`global.fetch`:**
* **Mock Implementation:** Must simulate GitHub API responses.
* **Response Structure:** Mock objects must provide `.ok`, `.status`, `.statusText`, and a `.json()` promise.


* **`loggerService`:**
* **Mock Implementation:** Mock `info`, `debug`, `error`, and `warn` methods to verify log output without polluting the test runner output.



### 2. Test Scenarios

The following scenarios constitute the acceptance criteria for this service.

| ID | Scenario | Input / Setup | Expected Behavior |
| --- | --- | --- | --- |
| **TS-01** | **Init Repo (Standard)** | `GitInitOptions` (cwd only) | Calls `init` and ensures branch is renamed to 'main'. |
| **TS-02** | **Init Repo (Config)** | `GitInitOptions` (with userName) | Verifies `addConfig` is called for user settings. |
| **TS-03** | **Clone Repo (Happy Path)** | Valid `GitCloneOptions` | Calls `clone` with correct URL, destination, and argument array. |
| **TS-04** | **Clone Repo (Error)** | `simpleGit.clone` throws Error | Service captures error, logs it, and re-throws wrapped Error. |
| **TS-05** | **Get Status (Dirty)** | `simpleGit.status` returns dirty | Returns `GitStatusResult` with `isDirty: true` and modified files list. |
| **TS-06** | **Sync Repo (Verbose)** | `syncRepo(cwd, false)` | Verifies `outputHandler` is attached to pipe streams, then calls pull/update. |
| **TS-07** | **Remote List (User)** | `listRemoteRepos(undefined)` | `fetch` calls `.../user/repos`; returns parsed JSON. |
| **TS-08** | **Remote List (Org)** | `listRemoteRepos("my-org")` | `fetch` calls `.../orgs/my-org/repos`. |
| **TS-09** | **Remote Auth Failure** | `process.env.GITHUB_TOKEN` is null | API methods immediately throw "Missing GITHUB_TOKEN". |
| **TS-10** | **Delete Remote** | `deleteRemoteRepo("user", "repo")` | `fetch` calls `DELETE`; throws if response is not OK. |

### 3. Test Data Requirements

**A. Mock Simple-Git Status Response**
Used to simulate the output of `git status` inside `simple-git`.

```json
{
  "current": "feature/dev",
  "isClean": false,
  "modified": ["src/app.ts"],
  "staged": [],
  "ahead": 2,
  "behind": 0,
  "conflicted": []
}

```

**B. Mock GitHub API Repository List**
Used to simulate the JSON response from `GET /user/repos`.

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
Used as input for `cloneRepo` tests.

```json
{
  "url": "https://github.com/test/repo.git",
  "destination": "./workspace/repo",
  "branch": "develop",
  "depth": 1
}

```

---

**Next Step:** Would you like me to generate the **Jest Unit Test file** (`githubService.test.ts`) utilizing these mocks and data structures?