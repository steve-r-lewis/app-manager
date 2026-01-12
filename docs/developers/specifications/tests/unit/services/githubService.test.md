# Part 1: Operational & Design Specification

## 1. Component Overview

* **Purpose:** The `GithubService` acts as a high-level facade for Git version control operations and GitHub remote API interactions. It abstracts complex command-line Git arguments and REST API calls into semantic, application-specific methods.
* **Role in System:** It functions as a **Service Layer** component. It sits between the application's business logic (e.g., App Manager) and the external systems (File System/Git binary and GitHub API). It facilitates repo initialization, synchronization, and remote management.

## 2. Architecture & Patterns

* **Design Patterns:**
* **Singleton:** The import usage `import { githubService }` suggests the module exports a single instantiated class or object.
* **Facade:** It wraps the `simple-git` library, simplifying the interface for the specific needs of the `app-manager` (e.g., `initRepo` handles branching and config in one step).
* **Adapter:** It adapts the native `fetch` API to interact with GitHub's REST endpoints using a unified interface (`listRemoteRepos`, `deleteRemoteRepo`).


* **State Management:**
* **Stateless (Service Logic):** The service itself appears stateless between calls; it does not seem to hold persistent references to a specific repository instance across different methods. Instead, methods like `initRepo` or `getStatus` accept a `cwd` (current working directory) path, instantiating a scoped git instance for that operation.


* **Complexity Assessment:** **Medium**.
* While individual methods are wrappers, the service manages dual-interfaces (CLI Git and REST API), handles conditional logic (silent vs. interactive sync), and performs error transformation.



## 3. Dependency Graph

* **Internal Dependencies:**
* `LoggerService` (`logger`): Used for observability, logging info, debug, and error states.


* **External Dependencies:**
* `simple-git`: The primary driver for local git operations.
* `fetch` (Global): Used for HTTP requests to `api.github.com`.
* `process.env`: Relies on `GITHUB_TOKEN` for authentication.


* **Coupling Analysis:**
* **Loosely Coupled:** The service uses dependency injection patterns (verified via mocking in tests) for the Logger.
* **Tight Coupling:** It is tightly coupled to `simple-git`'s specific API structure (e.g., `outputHandler`, `submoduleUpdate`).



## 4. Data Types & Interfaces

Based on the test inputs and expectations, the following interfaces are defined:

### Key Interfaces

```typescript
// Derived from initRepo test inputs
interface InitRepoOptions {
    cwd: string;
    userName?: string;
    userEmail?: string;
}

// Derived from cloneRepo test inputs
interface CloneRepoOptions {
    url: string;
    destination: string;
    branch?: string;
    depth?: number;
}

// Derived from addSubmodule test inputs
interface SubmoduleOptions {
    cwd: string;
    url: string;
    path: string;
    branch: string;
}

// Derived from getStatus test result mapping
interface GitStatusResult {
    branch: string;
    isDirty: boolean;
    modified: string[];
    staged: string[];
    ahead: number;
    behind: number;
}

```

### Return Types

* `initRepo`: `Promise<void>`
* `cloneRepo`: `Promise<void>`
* `getStatus`: `Promise<GitStatusResult>`
* `getStagedDiff`: `Promise<string>`
* `createCommit`: `Promise<void>` (or `CommitResult`)
* `push`: `Promise<void>`
* `syncRepo`: `Promise<void>`
* `addSubmodule`: `Promise<void>` (or `string`)
* `getRemotes`: `Promise<GetRemoteFilesResult[]>` (Typed Array)
* `listRemoteRepos`: `Promise<any[]>` (Ideally typed to `GitHubRepo[]`)
* `deleteRemoteRepo`: `Promise<void>`

## 5. Functional Logic Specification

### Initialization & Cloning

#### `initRepo(options: InitRepoOptions)`

* **Logic Flow:**
1. Initialize git in `options.cwd`.
2. Check the local branch name; if not 'main', rename it (`-M main`).
3. If `userName` or `userEmail` are provided, apply them via `git config`.


* **Side Effects:** Modifies `.git` directory in `cwd`.
* **Error Handling:** Relies on `simple-git` throwing errors; caught by caller or global handler.

#### `cloneRepo(options: CloneRepoOptions)`

* **Logic Flow:**
1. Constructs arguments array.
2. If `branch` exists, adds `['--branch', value]`.
3. If `depth` exists, adds `['--depth', value]`.
4. Calls `git clone` with URL, destination, and args.


* **Error Handling:** Catches errors, logs them via `logger.error`, and re-throws.

### Status & Diffs

#### `getStatus(cwd: string)`

* **Logic Flow:**
1. Calls `git.status()`.
2. Maps the raw result:
* `isDirty` becomes boolean.
* `current` becomes `branch`.




* **Return:** Standardized `GitStatusResult` object.

#### `getStagedDiff(cwd: string)`

* **Logic Flow:** Executes `git diff --cached` to return changes ready for commit.

### Operations

#### `createCommit(cwd: string, message: string, files: string[])`

* **Logic Flow:**
1. Calls `git.add(files)`.
2. Calls `git.commit(message)`.



#### `syncRepo(cwd: string, silent: boolean)`

* **Logic Flow:**
1. If `silent` is `false`, attaches an `outputHandler` to stream git output.
2. Executes `git pull`.
3. If silent, executes `submoduleUpdate(['--init', '--recursive'])` explicitly.



#### `getRemotes(cwd: string)`

* **Logic Flow:** Wraps `git.getRemotes()`. Logs the count of remotes found.

### Remote API (GitHub)

#### `listRemoteRepos(org?: string)`

* **Logic Flow:**
1. Checks for `GITHUB_TOKEN`.
2. If `org` is provided, fetches `https://api.github.com/orgs/${org}/repos`.
3. If no `org`, fetches `https://api.github.com/user/repos`.


* **Error Handling:** Throws if status is not OK (e.g., 401).

#### `deleteRemoteRepo(owner: string, repo: string)`

* **Logic Flow:**
1. Sends `DELETE` request to `https://api.github.com/repos/${owner}/${repo}`.
2. Includes `Authorization` header.


* **Error Handling:** Throws if response `ok` is false.

---

# Part 2: Appendix - Testing Reference

## 1. Mocking Strategy

### Services to Mock

1. **`simple-git` Library:**
* **Reason:** Do not perform actual FS operations or network calls to Git servers during unit tests.
* **Configuration:** Must mock the *factory function* `simpleGit()` to return a persistent `mockGitInstance` object containing spies for all used methods (`init`, `clone`, `status`, etc.).


2. **`loggerService`:**
* **Reason:** Verify that operations are logged correctly without polluting the test runner output.


3. **`global.fetch`:**
* **Reason:** Intercept HTTP calls to GitHub API.


4. **`process.env`:**
* **Reason:** Inject `GITHUB_TOKEN` safely during `beforeEach` and cleanup in `afterEach`.



### Mock Behaviour Requirements

* **`branchLocal`:** Must return `{ current: 'master' }` to test branch renaming logic.
* **`status`:** Must return a complex object with `isClean()`, `modified[]`, `ahead`, etc.
* **`fetch`:**
* Success: `{ ok: true, json: async () => [...] }`
* Failure: `{ ok: false, status: 401, statusText: 'Unauthorized' }`



## 2. Test Scenarios

| Category | Scenario | Expected Outcome |
| --- | --- | --- |
| **Happy Path** | `initRepo` with defaults | Git init called; branch renamed to 'main'. |
| **Happy Path** | `cloneRepo` with basic args | Git clone called with URL and Dest. |
| **Happy Path** | `cloneRepo` with Branch/Depth | Git clone called with `--branch` and `--depth`. |
| **Happy Path** | `getStatus` on dirty repo | Returns object with `isDirty: true` and file lists. |
| **Happy Path** | `deleteRemoteRepo` success | Fetch called with `DELETE` method; success log. |
| **Happy Path** | `syncRepo` (Silent) | No output handler; submodules updated recursively. |
| **Edge Case** | `syncRepo` (Interactive) | Output handler attached; pull executed. |
| **Error State** | `cloneRepo` fails | Error logged; exception re-thrown. |
| **Error State** | `listRemoteRepos` (No Token) | Throws "Missing GITHUB_TOKEN" immediately. |
| **Error State** | `listRemoteRepos` (401 API) | Throws "GitHub API Error (401)"; error logged. |
| **Error State** | `deleteRemoteRepo` (404 API) | Throws "Failed to delete repo"; error logged. |

## 3. Test Data Requirements

**Status Object (Mock Return):**

```json
{
  "current": "feature/login",
  "isClean": "Function<Boolean>", 
  "modified": ["file1.ts"],
  "staged": ["file2.ts"],
  "ahead": 1,
  "behind": 2
}

```

**Remote Repo List (API Response):**

```json
[
  {
    "id": 123456,
    "name": "repo-1",
    "full_name": "user/repo-1",
    "private": false,
    "html_url": "https://github.com/user/repo-1"
  }
]

```

**Clone Options:**

```json
{
  "url": "https://github.com/test/repo.git",
  "destination": "/tmp/repo",
  "branch": "develop",
  "depth": 1
}

```

---

**Next Step:** Would you like me to generate the implementation code (`githubService.ts`) based on this specification to ensure it passes all the tests provided?