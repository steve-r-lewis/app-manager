# Technical Specification Document: Repository Registry Configuration

## Part 1: Operational & Design Specification

### 1. Component Overview

* **Purpose:** This file acts as a persistent **Configuration Registry**. It serves as the single source of truth for defining remote repository connection parameters (specifically GitHub), API credential placeholders, and configuration metadata.
* **Role in System:**
* **Data Layer / Configuration:** It sits at the foundation of the application's infrastructure layer.
* **Target Location:** The system expects this file to reside at `~/config/repositoryRegistry.json`.
* **Consumer:** It is likely consumed by a `RepositoryService` or `ConfigManager` to authenticate and interact with remote version control systems.



### 2. Architecture & Patterns

* **Design Patterns:**
* **Data Transfer Object (DTO):** The file structure represents a specific schema used to transfer configuration state from disk to memory.
* **Registry Pattern:** It maintains a list of available resources (`records`) indexed by logical names (e.g., "GitHub").


* **State Management:**
* **Stateful (Persisted):** This file represents the persisted state of repository configurations. The consuming service will likely need to hydrate this state into memory on startup.


* **Complexity Assessment:** **Low**.
* *Justification:* The structure is hierarchical but shallow. It contains no executable logic, circular references, or complex polymorphism.



### 3. Dependency Graph

* **Internal Dependencies:** None. This is a standalone data file.
* **External Dependencies:** None directly. However, the schema implies a dependency on **GitHub APIs** via the `baseURL`: `https://api.github.com`.
* **Coupling Analysis:**
* **Tight Data Coupling:** Any service consuming this file is tightly coupled to this specific JSON schema (Version 1.0.0). A change in schema requires a change in the parser.



### 4. Data Types & Interfaces

To enforce the "Strict Typing" requirement mentioned in the context, the following TypeScript interfaces are derived from this JSON structure.

* **Key Interfaces:**

```typescript
// Derived from 'metadataEntity'
export interface IMetadataEntity {
  description: string;
  targetFile: string;
  currentVersion: string;
  createdAt: string; // ISO 8601 Date String
  revisionHistory: IRevision[];
}

// Derived from 'revisionHistory'
export interface IRevision {
  schemaVersion: string;
  archivedAt: string; // ISO 8601 Date String
  revisionNote: string;
}

// Derived from 'records' array
export interface IRepositoryRecord {
  repositoryName: string; // e.g., "GitHub"
  tokenType: 'github' | string; // Literal union type suggested based on usage
  baseURL: string;
  githubToken: string; // WARNING: Currently holds a placeholder "GITHUB_TOKEN"
  githubOrg: string;   // WARNING: Currently holds a placeholder "GITHUB_ORG"
}

// Root Interface
export interface IRepositoryRegistry {
  metadataEntity: IMetadataEntity;
  records: IRepositoryRecord[];
}

```

* **Return Types:**
* The file does not contain methods. However, a loader for this file should return `Promise<IRepositoryRegistry>`.
* **Warning:** The fields `githubToken` and `githubOrg` currently contain uppercase placeholders ("GITHUB_TOKEN", "GITHUB_ORG"). This implies the consuming service must perform **Environment Variable Substitution** (e.g., `process.env[record.githubToken]`) rather than using the values literally.



### 5. Functional Logic Specification (Data Contract)

Since this is a JSON file, "Functional Logic" refers to the **Validation Rules** that the consuming service must apply when reading this file.

* **Method Signature:** `validateSchema(json: unknown): IRepositoryRegistry`
* **Logic Flow (Implied):**
1. **Parse JSON:** Read file from disk.
2. **Version Check:** Validate `metadataEntity.currentVersion` matches the parser's supported version (1.0.0).
3. **Record Iteration:** Iterate through `records`.
4. **Credential Resolution:** Detect if `githubToken` is a placeholder (starts with `GITHUB_` or uppercase). If so, resolve against System Environment Variables.


* **Side Effects:** None (Passive file).
* **Error Handling (Requirements):**
* The consuming service **must** throw a `ConfigurationError` if `records` is empty or if `baseURL` is malformed.



---

## Part 2: Appendix - Testing Reference

### 1. Mocking Strategy

To test the application code that consumes this file, you must mock the Node.js File System (`fs`) module.

* **Services to Mock:** `fs/promises` or `fs`.
* **Mock Behaviour:**
* **Scenario A (Success):** Mock `fs.readFile` to return a stringified version of the valid JSON provided below.
* **Scenario B (File Not Found):** Mock `fs.readFile` to throw an `ENOENT` error to test the application's fallback or error logging.
* **Scenario C (Corrupt Config):** Mock `fs.readFile` to return invalid JSON (e.g., missing closing braces) to test the `JSON.parse` error handling.



### 2. Test Scenarios

The following scenarios apply to the **Loader Service** responsible for reading this file.

| ID | Scenario | Description | Expected Outcome |
| --- | --- | --- | --- |
| **TS-01** | **Happy Path** | Valid JSON with one GitHub record. | Object parses to `IRepositoryRegistry`; `records.length` is 1. |
| **TS-02** | **Edge Case** | `records` array is empty `[]`. | System handles gracefully (warns "No repositories configured") or throws Config Error depending on business logic. |
| **TS-03** | **Edge Case** | `revisionHistory` is empty. | Valid. Logic should not depend on history presence. |
| **TS-04** | **Data Integrity** | `githubToken` is missing from a record. | Validation fails; Service throws `InvalidSchemaError`. |
| **TS-05** | **Logic Check** | `baseURL` contains an invalid URL string. | Validation fails or HTTP client throws error downstream. |

### 3. Test Data Requirements

Use the following strict-typed JSON fixtures for Unit Tests.

**Fixture 1: Valid Configuration (Based on Source)**

```json
{
  "metadataEntity": {
    "description": "Unit Test Config",
    "targetFile": "test/config.json",
    "currentVersion": "1.0.0",
    "createdAt": "2025-01-01T00:00:00Z",
    "revisionHistory": []
  },
  "records": [
    {
      "repositoryName": "TestHub",
      "tokenType": "github",
      "baseURL": "https://api.test.com",
      "githubToken": "TEST_ENV_VAR",
      "githubOrg": "TEST_ORG"
    }
  ]
}

```

**Fixture 2: Invalid Type Schema (For Negative Testing)**

```json
{
  "metadataEntity": {
     "currentVersion": 100 
  },
  "records": "This should be an array, not a string"
}

```

*(Note: In Fixture 2, `currentVersion` is a number, violating the string requirement in the source).*

---

**Next Step:** Would you like me to generate the **Zod schema** or **TypeScript interfaces** definition file (`.d.ts`) corresponding to this JSON structure to immediately enforce type safety in your project?