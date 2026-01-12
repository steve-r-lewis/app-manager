# Technical Specification Document

**Subject:** Git Operations Domain Type Definitions (`gitTypes.ts`)
**Version:** 1.2.0
**Date:** 2026-01-10

## Part 1: Operational & Design Specification

### 1. Component Overview

* **Purpose:** This component functions as the **Data Contract Layer** for the application's Git Domain. It serves as the central source of truth for data shapes exchanged between the UI/Controller layer and the underlying Git Service layer.
* **Role in System:**
* **Type Safety Enforcer:** It ensures strict typing for version control operations (e.g., `init`, `commit`, `push`, `clone`), facilitating features like AI-assisted commits and repository bootstrapping.
* **Dependency Provider:** It acts as a shared definition provider that does not contain runtime logic but defines input arguments (Options) and output payloads (Results).



### 2. Architecture & Patterns

* **Design Patterns:**
* **Data Transfer Object (DTO) Definitions:** The interfaces (e.g., `GitCommitOptions`, `GitStatusResult`) are designed as DTOs to strictly define how data moves across system boundaries.
* **Interface Segregation:** Each Git command utilizes a specific, decoupled configuration interface (e.g., `GitDeleteRepoOptions` is distinct from `GitInitOptions`) to avoid "god objects".


* **State Management:** **Stateless**. This file contains only type definitions and no runtime state storage.
* **Complexity Assessment:** **Low**. The file is purely declarative with no control flow, logic, or algorithmic complexity.

### 3. Dependency Graph

* **Internal Dependencies:**
* `LLMProviderStatus` (imported from `./llmTypes`): Used within `GitCommitOptions` to define the availability of AI providers.


* **External Dependencies:**
* **Implicit:** The data shapes `GitStatusResult` and `GitRemote` correspond to return structures associated with the `simple-git` library, acting as a strict typing wrapper around this external dependency.


* **Coupling Analysis:** **Loosely Coupled**. This module is a dependency *provider*. It depends only on one other type definition file (`llmTypes`) and does not rely on logic from other parts of the system.

### 4. Data Types & Interfaces

The component defines the following primary public interfaces. **Note:** As a type definition file, there are no methods or return types, only property definitions.

* **Key Interfaces (Command Inputs):**
* `GitDeleteRepoOptions`: Configuration for repository deletion.
* `GitInitOptions`: Configuration for project bootstrapping.
* `GitSubmoduleOptions`: Configuration for submodule management.
* `GitCommitOptions`: Configuration for commit messages and AI generation.
* `GitPushOptions`: Configuration for remote targets.
* `GitSyncOptions`: Configuration for synchronization behavior.
* `GitCloneOptions`: Configuration for cloning operations.


* **Data Model Interfaces (Outputs):**
* `GitRemoteConfig`: Defines a simple name/URL pair.
* `GitRemote`: Defines detailed remote structures including fetch/push URLs.
* `GitStatusResult`: Defines comprehensive repository status (modified, staged, ahead/behind counts).



### 5. Functional Logic Specification

*Note: This file contains no executable methods. The following specification details the logical intent and constraints enforced by the defined types.*

**A. Logic: Repository Initialization**

* **Interface:** `GitInitOptions`
* **Logic Implication:**
* **Overwrite Safety:** The presence of `force?: boolean` implies logic elsewhere that checks for existing `.git` directories and conditionally overwrites them.
* **User Config:** Fields `userName` and `userEmail` imply logic that configures local git config specifically for the new repository.



**B. Logic: AI-Assisted Commits**

* **Interface:** `GitCommitOptions`
* **Logic Implication:**
* **Conditional Generation:** The `message?: string` is optional. Logic dictates that if this is missing, the consuming service must use `availableLLMs` to trigger an AI generation flow. If present, the AI flow is bypassed.



**C. Logic: Shallow Cloning**

* **Interface:** `GitCloneOptions`
* **Logic Implication:**
* **Optimization:** The inclusion of `depth?: number` enforces support for "shallow clones" (e.g., `--depth 1`), intended for bandwidth optimization in CI/CD or bootstrap scenarios.



**D. Logic: Deletion Safety**

* **Interface:** `GitDeleteRepoOptions`
* **Logic Implication:**
* **Safety Valve:** The `confirm?: string` field supports a pattern where backend logic verifies this string matches a specific constant (e.g., "DELETE") before executing destruction logic.



---

## Part 2: Appendix - Testing Reference

### 1. Mocking Strategy

Since `gitTypes.ts` contains only definitions, the following strategy applies to the **consuming services** (e.g., `GitService`) that implement these types.

* **Services to Mock:**
* **`GitStatusService` (Hypothetical):** Responsible for retrieving repo status.
* **`GitInitService` (Hypothetical):** Responsible for repo initialization.


* **Mock Behaviour:**
* **Status Retrieval:** When `getStatus()` is called, the mock must return a valid `GitStatusResult` object.
* **Initialization Validation:** Input validation tests must accept objects matching `GitInitOptions`. To mock a "re-init" scenario, the mock must handle inputs where `{ force: true }`.



### 2. Test Scenarios

The following scenarios validate the logic paths enforced by the types:

| Scenario ID | Type Context | Scenario Description | Expected Data / State |
| --- | --- | --- | --- |
| **TS-GIT-01** | `GitInitOptions` | **Happy Path:** Initialize new repo with user config. | **Input:** `{ cwd: '/app', userName: 'Bot', userEmail: 'bot@test.com' }` |
| **TS-GIT-02** | `GitInitOptions` | **Edge Case:** Force re-init of existing repo. | **Input:** `{ cwd: '/app', force: true }` |
| **TS-GIT-03** | `GitDeleteRepo` | **Error State:** Delete without confirmation string. | **Input:** `{ repo: 'owner/repo' }`<br>

<br>**Result:** Error/Rejection. |
| **TS-GIT-04** | `GitDeleteRepo` | **Happy Path:** Delete with valid confirmation. | **Input:** `{ repo: 'owner/repo', confirm: 'DELETE' }` |
| **TS-GIT-05** | `GitCloneOptions` | **Happy Path:** Shallow clone (CI mode). | **Input:** `{ url: '...', destination: './src', depth: 1 }` |
| **TS-GIT-06** | `GitCommitOptions` | **Edge Case:** Manual message overrides AI. | **Input:** `{ message: 'WIP', availableLLMs: [...] }`<br>

<br>**Logic:** AI generation skipped. |

### 3. Test Data Requirements

The following JSON structures represent valid fixtures based on `gitTypes.ts`.

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

---