# Technical Specification Document

**Project:** app-manager
**Component:** Remote GitHub Domain Type Definitions (`githubServiceTypes.ts`)
**Version:** 1.2.0
**Date:** 2026-01-10

## Part 1: Operational & Design Specification

### 1. Component Overview

* **Purpose:**
This file serves as the centralized **Domain Definition** layer for the application's interaction with the GitHub ecosystem. It provides strict TypeScript interfaces to model configuration files (`commandRegistry`), Data Transfer Objects (DTOs) for the GitHub REST API, and error handling structures.
* **Role in System:**
* **Data Layer / Type Safety:** It acts as the foundational contract for the Data Layer. It ensures that any service consuming GitHub APIs or reading local configuration files adheres to a strict schema, preventing runtime errors caused by mismatched property access.
* **Interoperability:** It standardizes the data shape between the local application logic (CamelCase convention) and external GitHub API responses (Snake_Case convention).



### 2. Architecture & Patterns

* **Design Patterns:**
* **Data Transfer Object (DTO):** The interfaces `GithubRepo`, `GithubUser`, and `GithubOrg` implement the DTO pattern, mirroring the external API's JSON structure exactly to facilitate direct serialization/deserialization.
* **Config Object:** `GithubRegistry` and `GithubRepositoryConfig` follow a structural pattern for configuration management.


* **State Management:**
* **Stateless:** This component is purely declarative. It contains no runtime logic, state, or side effects.


* **Complexity Assessment:**
* **Rating:** **Low**
* **Justification:** The file consists exclusively of TypeScript `interface` definitions. There is no control flow, cyclomatic complexity, or algorithm implementation.
* **QA Flag:** *Discrepancy Detected.* The header comments for V1.2.0 claim the addition of a `GitStatusResult` interface, but this interface is **missing** from the provided code body. This represents a documentation/implementation mismatch.



### 3. Dependency Graph

* **Internal Dependencies:** None. (This file is a leaf node in the dependency graph).
* **External Dependencies:** None.
* **Coupling Analysis:**
* **Loose Coupling:** The file does not import any other modules.
* **High Cohesion:** The file contains *only* types related to the GitHub domain, ensuring a single responsibility.



### 4. Data Types & Interfaces

The following interfaces are exported for system-wide use.

#### Configuration Types

| Interface | Usage |
| --- | --- |
| **`GithubRepositoryConfig`** | Defines the schema for a single entry in the local commandRegistry JSON file. Note the optional `githubOrg` which acts as an override. |
| **`GithubRegistry`** | Defines the root structure of the commandRegistry file, containing an array of records. |

#### API Response Types (DTOs)

| Interface | Usage |
| --- | --- |
| **`GithubUser`** | Models the `owner` object in API responses. Discriminated by `type` ('User' vs 'Organization'). |
| **`GithubRepo`** | Models the repository details. **Strictly enforces snake_case** to match the raw API JSON. |
| **`GithubOrg`** | Models organization details. |
| **`GithubApiError`** | Standardized structure for catching and typing HTTP errors from the GitHub API. |

### 5. Functional Logic Specification

*Note: As this is a Type Definition file, it contains no executable methods. However, it dictates the Logic Flow of services that import it.*

#### Implicit Contract Rules

While there are no methods to specify, the interfaces enforce the following logic on consuming services:

1. **Registry Parsing:** Any service reading the commandRegistry file **MUST** validate that the JSON root object contains a `records` array, and each item in that array contains `repositoryName` and `githubToken`.
2. **API Consumption:** Services fetching data from GitHub **MUST** expect `snake_case` properties (e.g., `html_url`, `clone_url`). Mapping to `camelCase` for internal app use must happen *after* the raw response is typed against `GithubRepo`.
3. **Nullable Fields:** The `GithubRepo` interface defines `description` as `string | null`. Logic consuming this property **MUST** handle null checks to avoid rendering errors.

---

## Part 2: Appendix - Testing Reference

Since this file contains only interfaces (which are erased at runtime), you cannot "Unit Test" this file directly. However, these types are the "Source of Truth" for testing the **Services** that use them.

The following strategies ensure the types accurately reflect reality.

### 1. Mocking Strategy

When testing services (e.g., `GithubService.ts` or `ConfigLoader.ts`) that import these types, use the following Mock Objects.

* **Target:** `GithubRepositoryConfig`
* **Scenario:** Testing config loading logic.
* **Mock Behavior:** Create valid and invalid JSON objects to test schema validation.


* **Target:** `GithubRepo` (API Response)
* **Scenario:** Testing the method that fetches repo details.
* **Mock Behavior:** Mock the HTTP Client (e.g., Axios/Fetch) to return a JSON object that strictly matches `GithubRepo`.



### 2. Test Scenarios (For Consuming Services)

These scenarios validate that the application handles the data structures defined in `githubServiceTypes.ts` correctly.

| Scenario Category | Scenario ID | Description | Expected Outcome |
| --- | --- | --- | --- |
| **Happy Path** | `TC-CONF-01` | Load `GithubRegistry` with valid records. | System parses `repositoryName` and `githubToken` correctly. |
| **Happy Path** | `TC-API-01` | Receive `GithubRepo` from API with `owner` type "Organization". | System correctly identifies `owner.login` and access `ssh_url`. |
| **Edge Case** | `TC-API-02` | Receive `GithubRepo` with `description: null`. | UI/Log displays "No description provided" (or empty) without crashing. |
| **Edge Case** | `TC-CONF-02` | `GithubRepositoryConfig` missing optional `githubOrg`. | System defaults to User scope logic. |
| **Error State** | `TC-API-ERR` | API returns 404. | Service maps response to `GithubApiError` and reads `message`. |

### 3. Test Data Requirements (Fixtures)

Use these JSON snippets as fixtures in your test suite. They conform strictly to the interfaces in `githubServiceTypes.ts`.

#### Fixture A: Valid Repository Config (`GithubRepositoryConfig`)

```json
{
  "repositoryName": "app-manager",
  "githubToken": "ghp_1234567890abcdef",
  "githubOrg": "TechCorp"
}

```

#### Fixture B: Valid API Response (`GithubRepo`)

*Note the snake_case keys as defined in the interface.*

```json
{
  "id": 123456,
  "node_id": "MDEwOlJlcG9zaXRvcnkxMjM0NTY=",
  "name": "app-manager",
  "full_name": "TechCorp/app-manager",
  "private": true,
  "owner": {
    "login": "TechCorp",
    "id": 98765,
    "avatar_url": "https://avatars.githubusercontent.com/u/98765?v=4",
    "html_url": "https://github.com/TechCorp",
    "type": "Organization"
  },
  "html_url": "https://github.com/TechCorp/app-manager",
  "description": "Central management tool",
  "fork": false,
  "url": "https://api.github.com/repos/TechCorp/app-manager",
  "created_at": "2025-01-01T00:00:00Z",
  "updated_at": "2025-01-02T00:00:00Z",
  "pushed_at": "2025-01-03T00:00:00Z",
  "git_url": "git://github.com/TechCorp/app-manager.git",
  "ssh_url": "git@github.com:TechCorp/app-manager.git",
  "clone_url": "https://github.com/TechCorp/app-manager.git",
  "default_branch": "main"
}

```

---

### Next Steps

Would you like me to generate a **Zod** schema or **io-ts** validator based on these interfaces? This would allow you to enforce these types at runtime (validating actual API responses against these definitions).