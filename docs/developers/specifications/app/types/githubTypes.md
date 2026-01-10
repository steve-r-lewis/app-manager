# **`githubTypes.ts`**

**Note:** As this file consists exclusively of TypeScript **interfaces** and contains no executable code (functions, classes, or runtime logic), the specification focuses on the **Data Contract** and **Schema Definitions** rather than control flow.

---

# Part 1: Operational & Design Specification

## 1. Component Overview

* **Purpose:** This file acts as the **Central Domain Model** for the application's GitHub interactions. It defines the strict data contracts for Git status reporting, repository configuration (registry), and external GitHub REST API responses.
* **Role in System:** **Data Layer / Type Definitions**. It serves as a foundational dependency for the `GithubService`, configuration loaders, and UI components, ensuring type safety across the architectural boundaries of the application.

## 2. Architecture & Patterns

* **Design Patterns:**
* **Data Transfer Object (DTO) Definitions:** The interfaces (specifically `GithubUser`, `GithubRepo`, `GithubOrg`) act as DTO definitions for API responses.
* **Configuration Schema:** `GithubRegistry` and `GithubRepositoryConfig` define the schema for the application's persistence layer (`repositoryRegistry.json`).


* **State Management:** **Stateless**. This file contains only type definitions which are erased at runtime.
* **Complexity Assessment:** **Low**. The file is purely declarative. Complexity lies only in the correct mapping of external API fields to these interfaces.

## 3. Dependency Graph

* **Internal Dependencies:** **None**. This file is a leaf node in the dependency tree.
* **External Dependencies:** **None**. It relies on standard TypeScript primitives.
* **Coupling Analysis:**
* **Inbound Coupling (Afferent):** **High**. Many services (e.g., `GithubService`, `GitService`, configuration utilities) likely import these types.
* **Outbound Coupling (Efferent):** **Zero**. This file imports nothing.



## 4. Data Types & Interfaces

This section details the specific contracts enforced by this file.

### A. Local Git Status

**Interface:** `GitStatusResult`

* **Purpose:** Represents the state of a local git repository on the disk.
* **Fields:**
* `branch` (string): Current active branch.
* `isDirty` (boolean): Flag indicating uncommitted changes.
* `modified` (string[]): List of modified file paths.
* `staged` (string[]): List of staged file paths.
* `ahead` (number, optional): Commits ahead of remote.
* `behind` (number, optional): Commits behind remote.



### B. Configuration (Registry)

**Interface:** `GithubRepositoryConfig`

* **Purpose:** Schema for a single entry in `repositoryRegistry.json`.
* **Fields:**
* `repositoryName` (string): The identifier.
* `githubToken` (string): Auth token (likely a PAT).
* `githubOrg` (string, optional): The organization name. Note: Marked as required for `githubService` usage in comments, but optional in type definition (`?`).



**Interface:** `GithubRegistry`

* **Purpose:** Root structure of the registry JSON file.
* **Fields:**
* `records`: Array of `GithubRepositoryConfig`.



### C. External API Responses

**Interface:** `GithubUser`

* **Purpose:** Subset of GitHub API User object.
* **Fields:** `login`, `id`, `avatar_url`, `html_url`.

**Interface:** `GithubRepo`

* **Purpose:** Subset of GitHub API Repository object.
* **Fields:** `id`, `name`, `full_name`, `private`, `html_url`, `description` (nullable), `fork`, `created_at`, `updated_at`, `default_branch`, `clone_url` (optional), `owner` (optional `GithubUser`).

**Interface:** `GithubOrg`

* **Purpose:** Subset of GitHub API Organization object.
* **Fields:** `login`, `id`, `url`, `repos_url`.
* **Type Safety Audit:**
* **Implicit Any:** None.
* **Nullable Types:** `description` is explicitly `string | null`.
* **Optional Properties:** `ahead`, `behind`, `githubOrg`, `clone_url`, `owner` are correctly marked optional (`?`).



## 5. Functional Logic Specification

*Since this file contains no executable methods, this section outlines the validation logic implied by the types.*

### 5.1 Interface: `GitStatusResult`

* **Logic Implication:** Any service returning this object must calculate `isDirty` based on the presence of files in `modified` or `staged`, though the interface allows them to be decoupled.
* **Side Effects:** None.

### 5.2 Interface: `GithubRepositoryConfig`

* **Logic Implication:** Consumers of this type must handle the case where `githubOrg` is undefined, potentially falling back to the authenticated user's context or throwing a configuration error if strict organization scoping is required.

---

# Part 2: Appendix - Testing Reference

**Note:** You cannot "unit test" this file directly as it disappears at compilation. The strategy below details how to use these types to facilitate testing of *dependent* services (e.g., `GithubService`).

## 1. Mocking Strategy

When testing services that consume these types, use these definitions to generate strictly typed mocks.

* **Services to Mock:** None (this file has no dependencies).
* **Mock Behaviour (For Consumers):**
* **Mocking `GitStatusResult`:** Create mocks with `isDirty: true` to test "commit required" logic in consumers. Create mocks with `behind: 5` to test "pull required" logic.
* **Mocking `GithubRepo`:** Create mocks with `private: true` vs `private: false` to test visibility logic.



## 2. Test Scenarios (Integration/Type Compliance)

These scenarios apply to the **consumers** of `githubTypes.ts`.

| Scenario Category | Scenario Description | Expected Outcome |
| --- | --- | --- |
| **Happy Path** | Load `repositoryRegistry.json` and cast to `GithubRegistry`. | The JSON structure matches the interface strictly. |
| **Happy Path** | API Service maps a raw `axios` response to `GithubRepo`. | All required fields (`id`, `name`, `full_name`) are present. |
| **Edge Case** | `GithubRepo` response has `description: null`. | Type system allows it; UI/Logic should handle `null` gracefully. |
| **Edge Case** | `GitStatusResult` has `ahead: undefined`. | Logic should assume 0 or "unknown" without crashing. |
| **Error State** | `GithubRepositoryConfig` missing `repositoryName`. | TypeScript compiler throws error during development; Runtime validation (Zod/Joi) should fail. |

## 3. Test Data Requirements

Use the following JSON fixtures in your test suites. They are guaranteed to satisfy the interfaces defined in `githubTypes.ts`.

### Fixture A: `mockGitStatus.json` (Satisfies `GitStatusResult`)

```json
{
  "branch": "feature/upgrade-types",
  "isDirty": true,
  "modified": ["src/app.ts", "package.json"],
  "staged": ["src/types.ts"],
  "ahead": 1,
  "behind": 0
}

```

### Fixture B: `mockRegistry.json` (Satisfies `GithubRegistry`)

```json
{
  "records": [
    {
      "repositoryName": "app-manager",
      "githubToken": "ghp_SECRET_TOKEN_123",
      "githubOrg": "AcmeCorp"
    },
    {
      "repositoryName": "legacy-system",
      "githubToken": "ghp_SECRET_TOKEN_456"
    }
  ]
}

```

### Fixture C: `mockGithubRepo.json` (Satisfies `GithubRepo`)

```json
{
  "id": 12345678,
  "name": "app-manager",
  "full_name": "SteveRLewis/app-manager",
  "private": true,
  "html_url": "https://github.com/SteveRLewis/app-manager",
  "description": "Central application manager",
  "fork": false,
  "created_at": "2025-12-31T01:08:00Z",
  "updated_at": "2025-12-31T01:30:00Z",
  "default_branch": "main",
  "clone_url": "https://github.com/SteveRLewis/app-manager.git",
  "owner": {
    "login": "SteveRLewis",
    "id": 999,
    "avatar_url": "https://avatars.githubusercontent.com/u/999?v=4",
    "html_url": "https://github.com/SteveRLewis"
  }
}

```