Here is the comprehensive Technical Specification and Test Strategy based on the provided source code.

---

# Technical Specification: GitHub Service

**Document Version:** 1.0
**Date:** January 10, 2026
**Source:** `app/services/githubService.ts`
**Author:** Analysis based on code by Steve R Lewis

## Part 1: Operational & Design Specification

### 1. Component Overview

* **Purpose:** The `GithubService` acts as a facade layer, providing a high-level abstraction for Version Control System (VCS) operations. It unifies local Git CLI command execution (via `simple-git`) and remote GitHub API interactions (via `fetch`) into a single service class.
* **Role in System:** This is an **Infrastructure/Utility Service**. It bridges the application's business logic with the underlying file system (for `.git` management) and external HTTP services (GitHub API).

### 2. Architecture & Patterns

* **Design Patterns:**
* **Singleton:** The class is instantiated once and exported as `githubService`, ensuring a single entry point for imports.
* **Facade:** It hides the complexity of `simple-git` configuration and the raw `fetch` API implementation details from the consumer.
* **Factory Method (Internal):** The private `git(cwd)` method acts as a factory to generate fresh `SimpleGit` instances scoped to specific directories.


* **State Management:**
* **Stateless:** The service itself holds no internal state variables (properties). Every method call generates a new Git instance based on the passed `cwd` (Current Working Directory). This makes the service thread-safe and suitable for concurrent operations across different repositories.


* **Complexity Assessment:** **Low-Medium**.
* Most logic delegates directly to `simple-git`.
* Complexity arises in the `syncRepo` method (handling output streams) and the API methods (manual header/error handling).
* **Discrepancy Note:** The JSDoc claims usage of `ProcessService`, but the implementation uses `simple-git` directly. This indicates documentation drift.



### 3. Dependency Graph

* **Internal Dependencies:**
* `./loggerService` (Imported, but **Dead Code**: variable `logger` is never used within the class).
* `../types/index`: `GitInitOptions`, `GitSubmoduleOptions`, `GitStatusResult`, `GitCommitOptions`.


* **External Dependencies:**
* `simple-git`: Core library for Git CLI interactions.
* `process.env`: Relies on `GITHUB_TOKEN` for API authentication.
* `fetch`: Uses the global Node.js fetch API.


* **Coupling Analysis:**
* **Tightly Coupled:** To the `simple-git` library. Replacing this library would require rewriting every local operation method.
* **Loosely Coupled:** To the consumer, via the exported `githubService` instance.



### 4. Data Types & Interfaces

**Key Interfaces (Imported):**

* `GitInitOptions`: `{ cwd, defaultBranch, userName, userEmail }`
* `GitSubmoduleOptions`: `{ cwd, url, path, branch }`
* `GitStatusResult`: Standardized status object.

**Method Return Types:**

| Method | Return Type | Warning |
| --- | --- | --- |
| `initRepo` | `Promise<void>` |  |
| `getStatus` | `Promise<GitStatusResult>` |  |
| `createCommit` | `Promise<void>` |  |
| `push` | `Promise<void>` |  |
| `syncRepo` | `Promise<void>` |  |
| `addSubmodule` | `Promise<void>` |  |
| `getRemotes` | `Promise<any[]>` | **Critical:** Returns `any`. Should be typed. |
| `getStagedDiff` | `Promise<string>` |  |
| `deleteRemoteRepo` | `Promise<void>` |  |
| `listRemoteRepos` | `Promise<any[]>` | **Critical:** Returns `any`. Should be typed. |

### 5. Functional Logic Specification

#### A. Local Git Operations

**1. `initRepo(options: GitInitOptions): Promise<void>**`

* **Logic:**
1. Initializes git in `cwd`.
2. Checks current branch name. If it differs from `defaultBranch`, renames it using `-M`.
3. If `userName` or `userEmail` are provided, sets them in local config (`.git/config`).


* **Side Effects:** Creates `.git` directory; modifies `.git/config`.

**2. `getStatus(cwd: string): Promise<GitStatusResult>**`

* **Logic:** Retrieves status and maps `simple-git` response to a simplified object including `branch`, `isDirty`, `modified`, `staged`, `ahead`, and `behind` counts.

**3. `syncRepo(cwd: string, silent: boolean): Promise<void>**`

* **Logic:**
1. Instantiates git.
2. **Stream Handling:** If `silent` is `false`, attaches an output handler to pipe `stdout` and `stderr` to the parent process.
3. Executes `git pull`.
4. Executes `git submodule update --init --recursive` to ensure monorepo layers are synced.



**4. `addSubmodule(options: GitSubmoduleOptions): Promise<void>**`

* **Logic:** Constructs a raw argument array. Adds `-b <branch>` if specified, followed by `url` and `path`. Executes `git submodule add`.

#### B. Remote API Operations

**5. `getAuthHeader(): object` (Private)**

* **Logic:** Reads `process.env.GITHUB_TOKEN`.
* **Error Handling:** Throws generic `Error('Missing GITHUB_TOKEN')` if undefined.

**6. `deleteRemoteRepo(owner: string, repo: string): Promise<void>**`

* **Logic:** Sends HTTP DELETE to `https://api.github.com/repos/${owner}/${repo}`.
* **Error Handling:** Throws Error if response status is not OK (200-299).

**7. `listRemoteRepos(org?: string): Promise<any[]>**`

* **Logic:**
* If `org` provided: GET `.../orgs/${org}/repos`.
* If no `org`: GET `.../user/repos` (Personal repos).


* **Return:** Returns JSON array on success, or empty array `[]` on failure (swallows errors).

---

## Part 2: Appendix - Testing Reference

### 1. Mocking Strategy

To achieve 100% unit test coverage, the following must be mocked:

* **`simple-git` Library:**
* **Challenge:** The service calls `simpleGit(cwd)` inside every method.
* **Strategy:** Mock the default export of `simple-git` to return a "Mock Git Instance" object containing spies for `init`, `branchLocal`, `branch`, `addConfig`, `status`, `add`, `commit`, `push`, `pull`, `submoduleUpdate`, `submodule`, `getRemotes`, and `diff`.


* **`global.fetch`:**
* Must be mocked to intercept calls to `api.github.com`.
* Needs to simulate 204 (Success/Delete), 200 (Success/List), and 400/403 (Failures).


* **`process.env`:**
* Inject `GITHUB_TOKEN` for positive tests.
* Unset `GITHUB_TOKEN` to test `getAuthHeader` validation.



### 2. Test Scenarios

| Category | ID | Scenario | Setup / Input | Expected Outcome |
| --- | --- | --- | --- | --- |
| **Init** | T1.1 | Happy Path: Init & Rename | `defaultBranch: 'main'`, current is `master` | Calls `git.init`, `git.branch(['-M', 'main'])`. |
|  | T1.2 | Config Setup | `userName` & `userEmail` provided | Calls `git.addConfig` twice. |
| **Status** | T2.1 | Dirty State | Mock `status()` returns `files` array | Returns `isDirty: true`, correct `modified` count. |
| **Sync** | T3.1 | Headless Mode | `silent: true` | `outputHandler` is **NOT** attached. |
|  | T3.2 | Interactive Mode | `silent: false` | `outputHandler` is attached to pipe output. |
| **Remote** | T4.1 | Delete Repo (Success) | Valid Token, Valid Repo | `fetch` called with DELETE; resolves void. |
|  | T4.2 | Delete Repo (Fail) | API returns 404 | Throws Error: "Failed to delete repo..." |
| **Auth** | T5.1 | Missing Token | `process.env.GITHUB_TOKEN = undefined` | `deleteRemoteRepo` throws "Missing GITHUB_TOKEN". |

### 3. Test Data Requirements

**A. Mock Git Status Object (`simple-git` response)**

```json
{
  "current": "feature/login",
  "files": [
    { "path": "src/index.ts", "index": "M", "working_dir": " " }
  ],
  "isClean": () => false,
  "modified": ["src/index.ts"],
  "staged": [],
  "ahead": 1,
  "behind": 0
}

```

**B. Git Init Options**

```json
{
  "cwd": "/tmp/test-repo",
  "defaultBranch": "main",
  "userName": "Test User",
  "userEmail": "test@example.com"
}

```

**C. Remote API Response (List Repos)**

```json
[
  {
    "id": 12345,
    "name": "app-manager",
    "full_name": "steve-lewis/app-manager",
    "private": true
  }
]

```

### Next Step for User

Would you like me to generate the **Jest unit test file** (`githubService.test.ts`) utilizing the mocking strategy described above?