Based on the analysis of the provided source code `rootConfigTemplate.ts`, here is the comprehensive Technical Specification Document and Test Strategy.

---

# Technical Specification Document: Root Configuration Templates

## Part 1: Operational & Design Specification

### 1. Component Overview

* **Purpose:** This module serves as a collection of functional generators responsible for creating the content of essential root-level configuration files within a Monorepo architecture. It defines the standard configuration for editor settings, package management, git submodules, and testing frameworks.
* **Role in System:** **Utility / Template Layer**. This component operates within the scaffolding or initialization logic of the `app-manager`. It transforms configuration context data into formatted string outputs ready to be written to the file system.

### 2. Architecture & Patterns

* **Design Patterns:**
* **Functional Generator:** The module exports pure functions that accept a context object and return a string.
* **Template Method:** It utilizes a standard `TemplateFunction` signature to ensure consistency across all generators.


* **State Management:** **Stateless**. All functions are pure; they do not maintain internal state, side effects, or persistence. Output is determined solely by the input arguments.
* **Complexity Assessment:** **Low**. The control flow relies primarily on string interpolation, simple array mapping, and basic conditional checks for optional configuration arrays.

### 3. Dependency Graph

* **Internal Dependencies:**
* `../types/index`: Imports type definitions (`BaseTemplateContext`, `PnpmWorkspaceContext`, `GitModulesContext`, `TemplateFunction`).


* **External Dependencies:**
* **None**. The file does not import any third-party runtime libraries (e.g., `fs`, `lodash`).


* **Coupling Analysis:** **Loosely Coupled**. The component depends only on TypeScript interfaces/contracts. It is decoupled from the file system, the CLI runner, or specific framework implementations.

### 4. Data Types & Interfaces

* **Key Interfaces:**
* `BaseTemplateContext`: Generic context containing basic metadata (implied `projectName`, `year`, `author`).
* `PnpmWorkspaceContext`: Extends context to include `packages` (string array) and `builtDependencies` (string array).
* `GitModulesContext`: Extends context to include `modules` (array of objects with `name`, `path`, `url`).
* `TemplateFunction<T, R>`: Defines the signature `(ctx: T) => R`.


* **Return Types:**
* All exported functions explicitly return `string`.
* **Type Safety Assessment:** Strict typing is enforced via the `TemplateFunction<Context, string>` generic. No `any` types or implicit returns were detected.



### 5. Functional Logic Specification

#### A. `editorConfigTemplate`

* **Signature:** `(ctx: BaseTemplateContext): string`
* **Logic Flow:** Returns a static literal string defining `.editorconfig` rules (indentation 2 spaces, utf-8, trim trailing whitespace).
* **Side Effects:** None.
* **Error Handling:** None (Static return).

#### B. `npmrcTemplate`

* **Signature:** `(ctx: BaseTemplateContext): string`
* **Logic Flow:** Returns a static literal string setting `shamefully-hoist=true`.
* **Side Effects:** None.
* **Error Handling:** None (Static return).

#### C. `nuxtrcTemplate`

* **Signature:** `(ctx: BaseTemplateContext): string`
* **Logic Flow:** Returns a static literal string enabling `typescript.includeWorkspace = true`.
* **Side Effects:** None.
* **Error Handling:** None (Static return).

#### D. `pnpmWorkspaceTemplate`

* **Signature:** `(ctx: PnpmWorkspaceContext): string`
* **Logic Flow:**
1. Maps the `ctx.packages` array to a YAML list format (prefixed with `  - '`).
2. Initializes output string with `packages:` header.
3. Checks if `ctx.builtDependencies` exists and has length > 0.
4. If true, appends `onlyBuiltDependencies:` section and maps the dependencies.
5. Returns the concatenated YAML string.


* **Side Effects:** None.
* **Error Handling:** Implicit JavaScript error if `ctx.packages` is undefined (Consumer must ensure type compliance).

#### E. `gitModulesTemplate`

* **Signature:** `(ctx: GitModulesContext): string`
* **Logic Flow:**
1. Checks if `ctx.modules` is falsy or has a length of 0.
2. If true, returns an empty string `''`.
3. If false, maps through `ctx.modules`.
4. Constructs a submodule config block using `name`, `path`, and `url`.
5. Joins blocks with double newlines (`\n\n`).


* **Side Effects:** None.
* **Error Handling:** Handles empty/missing module arrays gracefully by returning empty string.

#### F. `vitestConfigTemplate`

* **Signature:** `(ctx: BaseTemplateContext): string`
* **Logic Flow:**
1. Defines an import block for `defineVitestConfig`.
2. Constructs a file header using `ctx.projectName`, `ctx.year` (defaults to current year), and `ctx.author` (defaults to 'Maintainer').
3. Appends the default export configuration ensuring `include` covers both `tests/**/*.test.ts` and `layers/**/*.test.ts`.
4. Returns the full TypeScript file content string.


* **Side Effects:** Uses `new Date().getFullYear()` if `ctx.year` is not provided.
* **Error Handling:** None.

---

## Part 2: Appendix - Testing Reference

### 1. Mocking Strategy

* **Services to Mock:**
* Since these are pure functions with no external dependencies, **no service mocking (spies/stubs)** is required.
* **Input Data Mocking:** Testing requires constructing compliant JSON objects matching `PnpmWorkspaceContext` and `GitModulesContext` interfaces.



### 2. Test Scenarios

| Template Function | Scenario Category | Description | Expected Outcome |
| --- | --- | --- | --- |
| **pnpmWorkspaceTemplate** | Happy Path | `packages` provided, no `builtDependencies`. | YAML string with `packages` list only. |
| **pnpmWorkspaceTemplate** | Complex Path | `packages` AND `builtDependencies` provided. | YAML string with both `packages` and `onlyBuiltDependencies` sections. |
| **pnpmWorkspaceTemplate** | Edge Case | Empty `packages` array. | YAML string with `packages:` header but no list items. |
| **gitModulesTemplate** | Happy Path | `modules` array contains valid items. | String containing `[submodule "X"]` blocks. |
| **gitModulesTemplate** | Edge Case | `modules` array is empty. | Returns empty string `''`. |
| **gitModulesTemplate** | Edge Case | `modules` is undefined (if type check bypassed). | Should ideally return `''`, but currently relies on type safety. Test ensures logic `!ctx.modules` catches this. |
| **vitestConfigTemplate** | Happy Path | All context fields (`projectName`, `year`, `author`) provided. | Header contains specific values. |
| **vitestConfigTemplate** | Default Values | `year` and `author` omitted. | Header contains current year and 'Maintainer'. |
| **Static Templates** | Integrity | Call `editorConfigTemplate`, `npmrcTemplate`, `nuxtrcTemplate`. | Output matches exact string equality check. |

### 3. Test Data Requirements

**A. PnpmWorkspaceContext Data:**

```typescript
const mockPnpmContext = {
    packages: ['layers/*', 'apps/web', 'packages/ui'],
    builtDependencies: ['sqlite3', 'sharp']
};

const mockPnpmContextSimple = {
    packages: ['layers/*']
};

```

**B. GitModulesContext Data:**

```typescript
const mockGitModulesContext = {
    modules: [
        {
            name: 'deployment-scripts',
            path: 'devops/deploy',
            url: 'git@github.com:org/deploy-scripts.git'
        }
    ]
};

```

**C. BaseTemplateContext Data:**

```typescript
const mockBaseContext = {
    projectName: 'my-super-app',
    year: 2025,
    author: 'Jane Doe'
};

```

### Next Steps

Would you like me to generate the **Unit Test Suite** (using Vitest) based on the strategy defined above?