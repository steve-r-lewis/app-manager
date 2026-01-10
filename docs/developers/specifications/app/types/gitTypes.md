# Technical Specification Document

**Subject:** Git Operations Domain Type Definitions (`gitTypes.ts`)
**Version:** 1.2.0
**Date:** 2026-01-10

## Part 1: Operational & Design Specification

### 1. Component Overview

* **Purpose:** This component serves as the **Data Contract Layer** for the application's Git Domain. It does not contain runtime logic but defines the strict structures (TypeScript Interfaces) required for input arguments (Options) and output payloads (Results) for version control operations.
* **Role in System:**
* **Shared Definitions:** Acts as the central source of truth for data shapes passed between the UI/Controller layer and the underlying Git Service layer.
* **Type Safety Enforcer:** Ensures that commands like `init`, `commit`, `push`, and `clone` receive correctly typed arguments, specifically facilitating features like AI-assisted commits and repository bootstrapping.



### 2. Architecture & Patterns

* **Design Patterns:**
* **Data Transfer Object (DTO) Definitions:** The interfaces (e.g., `GitCommitOptions`, `GitStatusResult`) effectively function as DTO definitions, strictly defining how data moves across system boundaries.
* **Interface Segregation:** Each Git command has a specific, decoupled configuration interface (e.g., `GitDeleteRepoOptions` is distinct from `GitInitOptions`), preventing "god objects" for configuration.


* **State Management:** **Stateless**. This file contains only type definitions and no runtime state storage.
* **Complexity Assessment:** **Low**. The file contains no control flow, logic, or algorithmic complexity. It is purely declarative.

### 3. Dependency Graph

* **Internal Dependencies:**
* `LLMProviderStatus` (imported from `./llmTypes`): Used to define the availability of AI providers within `GitCommitOptions`.


* **External Dependencies:**
* **Implicit:** While no runtime libraries are imported, the data shapes `GitStatusResult` and `GitRemote` match the return structures commonly associated with the `simple-git` library, suggesting a strict typing wrapper around that external dependency.


* **Coupling Analysis:** **Loosely Coupled**. This module is a dependency *provider*. It does not depend on logic from other parts of the system, only on one other type definition file (`llmTypes`).

### 4. Data Types & Interfaces

The file defines the following key interfaces. Note that strictly speaking, there are no "methods" or "return types" in this file, only property definitions.

* **Command Option Interfaces (Inputs):**
* `GitDeleteRepoOptions`: Requires `repo` (string) and `confirm` (string).
* `GitInitOptions`: Defines project initialization including `cwd`, `defaultBranch`, `userName`, `userEmail`, and `force` (boolean).
* `GitSubmoduleOptions`: configurations for `cwd`, `url`, `path`, and `branch`.
* `GitCommitOptions`: Configures commit messages and AI provider status (`availableLLMs`).
* `GitPushOptions`: Configures remote targets (`remote`, `branch`).
* `GitSyncOptions`: Configures sync behavior, specifically `force` (headless mode).
* `GitCloneOptions`: **(New in V1.2.0)** Configures cloning via `url`, `destination`, `branch`, and `depth`.


* **Data Model Interfaces (Outputs/Structures):**
* `GitRemoteConfig`: Simple name/url pair.
* `GitRemote`: Detailed remote structure with `refs` (fetch/push URLs).
* `GitStatusResult`: Comprehensive status object (`branch`, `isDirty`, `modified`, `staged`, `ahead`, `behind`).



### 5. Functional Logic Specification

*Note: As this is a Type Definition file, it contains no executable methods. The following analyzes the logical intent enforced by these types.*

**A. Logic: Repository Initialization (`GitInitOptions`)**

* **Intent:** Defines the parameters required to bootstrap a new git repository.
* **Logic Implication:** The presence of `force?: boolean` implies logic elsewhere that checks for existing `.git` directories and conditionally overwrites them. The `userName` and `userEmail` fields imply logic that configures local git config specifically for this repo.

**B. Logic: AI-Assisted Commits (`GitCommitOptions`)**

* **Intent:** Facilitates manual or AI-generated commit messages.
* **Logic Implication:** The `message?: string` is optional. If missing, the consuming service is expected to use the `availableLLMs` array to trigger an AI generation flow. If present, the AI flow is bypassed.

**C. Logic: Shallow Cloning (`GitCloneOptions`)**

* **Intent:** optimizing bandwidth/storage for CI/CD or bootstrap scenarios.
* **Logic Implication:** The inclusion of `depth?: number` indicates support for "shallow clones" (e.g., `--depth 1`), useful for environments where full history is unnecessary.

**D. Logic: Safety Mechanisms (`GitDeleteRepoOptions`)**

* **Intent:** Prevention of accidental data loss.
* **Logic Implication:** The `confirm?: string` field suggests a "Safety Valve" pattern where the backend logic must verify this string matches a specific constant (e.g., "DELETE") before executing the destruction logic.

---

## Part 2: Appendix - Testing Reference

Since this is a types file, "testing" it directly is not applicable. However, these types strictly define the **Test Data** and **Mock Objects** required for testing the *Git Service* that consumes them.

### 1. Mocking Strategy

When unit testing the `GitService` or `GitController`, the following mock structures must be created based on `gitTypes.ts`:

* **Service:** `GitStatusService` (Hypothetical consumer)
* **Mock Behavior:** When `getStatus()` is called, it must return a standard `GitStatusResult` object.
* **Type Enforcement:** The mock return value must strictly adhere to the `GitStatusResult` interface defined in this file.


* **Service:** `GitInitService` (Hypothetical consumer)
* **Mock Behavior:** Input validation tests must use `GitInitOptions`.
* **Scenario:** Mocking a "re-init" scenario requires passing an object matching `GitInitOptions` with `{ force: true }`.



### 2. Test Scenarios (For Consuming Services)

The following scenarios are derived from the capabilities exposed by the types:

| Scenario ID | Type Context | Scenario Description | Expected Data / State |
| --- | --- | --- | --- |
| **TS-GIT-01** | `GitInitOptions` | **Happy Path:** Initialize new repo with user config. | Input: `{ cwd: '/app', userName: 'Bot', userEmail: 'bot@test.com' }` |
| **TS-GIT-02** | `GitInitOptions` | **Edge Case:** Force re-init of existing repo. | Input: `{ cwd: '/app', force: true }` |
| **TS-GIT-03** | `GitDeleteRepo` | **Error State:** Delete without confirmation string. | Input: `{ repo: 'owner/repo' }` <br>

<br> **Result:** Error/Rejection. |
| **TS-GIT-04** | `GitDeleteRepo` | **Happy Path:** Delete with valid confirmation. | Input: `{ repo: 'owner/repo', confirm: 'DELETE' }` |
| **TS-GIT-05** | `GitCloneOptions` | **Happy Path:** Shallow clone (CI mode). | Input: `{ url: '...', destination: './src', depth: 1 }` |
| **TS-GIT-06** | `GitCommitOptions` | **Edge Case:** Manual message overrides AI. | Input: `{ message: 'WIP', availableLLMs: [...] }` <br>

<br> **Logic:** AI generation skipped. |

### 3. Test Data Requirements

Below are JSON snippets representing valid objects based on the interfaces in `gitTypes.ts`. These should be used as fixtures in the test suite.

**A. Mock Status Result (`GitStatusResult`)**

```json
{
  "branch": "feature/upgrade-types",
  "isDirty": true,
  "modified": ["src/types/gitTypes.ts"],
  "staged": [],
  "ahead": 0,
  "behind": 2
}

```

**B. Mock Remote Config (`GitRemote`)**

```json
{
  "name": "origin",
  "refs": {
    "fetch": "https://github.com/org/app-manager.git",
    "push": "https://github.com/org/app-manager.git"
  }
}

```

**C. Mock Clone Payload (`GitCloneOptions`)**

```json
{
  "url": "git@github.com:user/repo.git",
  "destination": "/var/www/project",
  "branch": "develop",
  "depth": 1
}

```

**D. Mock Init Options (`GitInitOptions`)**

```json
{
  "cwd": "./new-project",
  "defaultBranch": "main",
  "userName": "Test User",
  "userEmail": "test@example.com",
  "force": false
}

```