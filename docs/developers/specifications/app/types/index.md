# AppManager – Type Aggregator (Barrel File) Master Specification

**Project:** `app-manager`
**Component:** Type Aggregator (Barrel File)
**Version:** 1.1.0
**Author:** Steve R Lewis

---

## 1. Overview

The `index.ts` file located at `~/app/types/index.ts` serves as the **Type Aggregator** for the AppManager application. It is a **barrel file**, centralizing exports of domain-specific TypeScript types and interfaces for consumption throughout the codebase.

### Purpose

* Provides a **single import entry point** for all type definitions used across AppManager.
* Simplifies imports in other modules by **reducing path complexity**.
* Segregates type definitions into **Infrastructure**, **Core**, **Feature**, and **Template Engine** domains.
* Maintains consistency in type usage across services such as **scannerService, strategyService, templateService, llmService, and fileService**.
* Supports **modular growth**, allowing new type domains to be added without modifying consumer imports.

### Role in System

* **Architecture Layer:** Cross-Cutting / Utility
* **Function:** Acts as a **Facade** for the type system, exposing multiple type definitions through a single, clean import path (e.g., `import { IConfig, IGit } from '@/types'`).

---

## 2. Responsibilities

### 2.1 Type Re-Exports

* Re-exports all types and interfaces from domain-specific modules to a **single central location**.
* Allows other modules to consume types without knowing the exact module file location.

**Example Import:**

```ts
import {
  Token,
  SfcBlock,
  FileMeta,
  TemplateConfig,
  LlmResponse,
} from '~/app/types';
```

### 2.2 Domain Categorization

Each exported module is associated with a domain and purpose:

| Module               | Domain          | Description                                                            |
| -------------------- | --------------- | ---------------------------------------------------------------------- |
| `configTypes`        | Core            | Application configuration interfaces.                                  |
| `loggerServiceTypes` | Core            | Logging levels and transport interfaces.                               |
| `baseCommandTypes`   | Infrastructure  | CLI command abstractions and abstract base classes for commands.       |
| `codeServiceTypes`   | Infrastructure  | Types for code intelligence, token streams, and code transformations.  |
| `fileServiceTypes`   | Infrastructure  | File system operation signatures (read/write/exists).                  |
| `processTypes`       | Infrastructure  | Process execution, child processes, and CLI hooks.                     |
| `utilsTypes`         | Infrastructure  | General utility types.                                                 |
| `scannerTypes`       | Infrastructure  | Token, SourceLocation, SfcBlock, and language-specific token types.    |
| `githubTypes`        | Feature         | GitHub-specific types.                                                 |
| `gitTypes`           | Feature         | Git repository interaction types (commit, push, status).               |
| `llmTypes`           | Feature         | Large Language Model interaction types (prompts, responses, metadata). |
| `nuxtTypes`          | Feature         | Nuxt project structure, layers, and configuration types.               |
| `templateTypes`      | Template Engine | Template configuration and generation logic.                           |

### 2.3 Ambient Modules Exclusion

* Ambient TypeScript modules (e.g., `globals.d.ts`) are **explicitly excluded**.
* These files are automatically loaded by TypeScript and should not be re-exported.

---

## 3. Architecture & Design Patterns

### 3.1 Patterns Implemented

* **Barrel Pattern:** Aggregates modules from a directory to simplify imports.
* **Facade Pattern (Static):** Provides a simplified interface to a complex system of type definitions.

### 3.2 State Management

* **Stateless:** Purely declarative.
* Contains no runtime logic, variables, or memory allocation. Exists solely for the TypeScript Compiler.

### 3.3 Complexity Assessment

* **Rating:** Low
* **Justification:** Contains zero control flow, loops, or conditional logic. Linear list of re-export statements.

### 3.4 Coupling Analysis

* **Afferent Coupling (Incoming):** High — widely imported across the application.
* **Efferent Coupling (Outgoing):** High — depends on 12 sibling type definition files.
* **Impact:** Renaming or relocating any aggregated module requires updates in the barrel file.

---

## 4. Dependency Graph

### 4.1 Internal Dependencies

Aggregated local definition files:

**Core:**

* `configTypes`
* `loggerServiceTypes`

**Infrastructure Domains:**

* `baseCommandTypes`
* `codeServiceTypes`
* `fileServiceTypes`
* `processTypes`
* `utilsTypes`
* `scannerTypes`

**Feature Domains:**

* `githubTypes`
* `gitTypes`
* `llmTypes`
* `nuxtTypes`

**Template Engine:**

* `templateTypes`

### 4.2 External Dependencies

* **None.** Does not import from `node_modules`.
* Ambient module `globals.d.ts` is excluded by design.

---

## 5. Functional Logic Specification

* **Runtime Methods:** N/A — purely a type re-exporter.
* **Logic Flow (Compile-Time):**

  1. Compiler encounters `import { X } from './types'`.
  2. Compiler parses `index.ts`.
  3. Resolves relative paths (e.g., `./baseCommandTypes`).
  4. Locates named exports in the target file.
  5. Makes the type available to the consumer.

### 5.1 Side Effects

* None.

### 5.2 Error Handling

* **Compilation Error:** Missing or renamed files result in `TS2307: Cannot find module`.
* **Naming Collisions:** If two source files export an identical interface name (e.g., `gitTypes` vs `githubTypes`), the compiler may force `as` syntax or throw an error.

---

## 6. Usage Across AppManager

* **Scanner Services:** Use `scannerTypes` for token and location definitions.
* **Strategy Services:** Consume aggregated types for safe processing of scanner outputs.
* **Template Service:** Uses `templateTypes` for scaffolding and generation logic.
* **File Service:** Leverages `fileServiceTypes` for type-safe file operations.
* **LLM Service:** Uses `llmTypes` for structured prompts, responses, and metadata.
* **Command Tools:** Import multiple domains from this single barrel to orchestrate operations.

---

## 7. Testing Reference & QA Considerations

### 7.1 Unit Testing

* Traditional runtime unit tests (Jest/Mocha) are **not applicable**.
* `index.ts` produces no runtime JavaScript; testing focuses on **static analysis** and **integration integrity**.

### 7.2 Mocking Strategy

* **Services to Mock:** None
* **Recommendation:** Do not write a spec file (`index.spec.ts`). Exclude barrel file from coverage (`**/types/index.ts`) to prevent false negatives.

### 7.3 Test Scenarios

| Category    | Scenario                                                            | Expected Outcome                                   |
| ----------- | ------------------------------------------------------------------- | -------------------------------------------------- |
| Happy Path  | Import a type via the barrel file                                   | Build succeeds, IntelliSense works                 |
| Edge Case   | Circular dependency (e.g., `gitTypes` imports back from `index.ts`) | Linter (`import/no-cycle`) or compiler flags error |
| Edge Case   | Naming collision (`IRepo` in `gitTypes` and `githubTypes`)          | Compiler warning/error; may require `as` syntax    |
| Error State | File listed in `export *` deleted                                   | Build failure, TS2307                              |
| Error State | Attempt to export `globals.d.ts`                                    | Linter or manual review catches violation          |

### 7.4 Test Data Requirements

* No runtime JSON required.
* Linting and architecture rules:

```json
{
  "rules": {
    "import/no-cycle": "error",
    "import/no-unresolved": "error",
    "no-restricted-imports": [
      "error",
      {
        "patterns": ["../*", "./*"],
        "paths": [
          {
            "name": "./globals.d.ts",
            "message": "Do not export ambient modules in the barrel file."
          }
        ]
      }
    ]
  }
}
```

### 7.5 QA/Dev Next Steps

* Verify `tsconfig.json` path aliases for `~/app/types/*`.
* Run circular dependency check (e.g., `madge`) to ensure sub-files remain cleanly separated.

---

## 8. Design Considerations

* **Single Source of Truth:** Centralizes all types to reduce duplication and improve maintainability.
* **Domain Organization:** Supports modular growth by logically grouping types.
* **Forward Compatibility:** Consumers remain decoupled from module path changes.
* **Strong Typing:** Enforces TypeScript type safety across all services.

---

## 9. Constraints

* Must **not include ambient type files** (`globals.d.ts`).
* Consumers should import exclusively from `~/app/types`.
* Barrel should remain **minimal**, only re-exporting named types/interfaces.

---

## 10. Revision History

| Version | Date       | Description                                                  |
| ------- | ---------- | ------------------------------------------------------------ |
| V1.0.0  | 2025-12-18 | Initial creation and release.                                |
| V1.1.0  | 2025-12-31 | Added exports for FileService and Code Intelligence domains. |
| V1.2.0  | 2026-01-01 | Added exports for Template Engine types.                     |

---

## 11. Summary

The **Type Aggregator (`index.ts`)** acts as the **central hub for all type definitions** in AppManager. It:

* **Decouples consumers** from module path changes.
* **Categorizes types** by domain (Core, Infrastructure, Feature, Template Engine).
* **Supports all services** including scannerServices, strategyService, templateService, llmService, and fileService.
* Ensures **strong typing, maintainability, and clear domain separation**.
* Enforces compile-time validation and prevents runtime errors related to missing or ambiguous type exports.

---
