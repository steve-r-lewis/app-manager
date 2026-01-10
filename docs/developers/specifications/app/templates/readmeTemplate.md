Based on the analysis of the provided source file `readmeTemplate.ts`, here is the detailed Technical Specification and Test Strategy.

### Part 1: Operational & Design Specification

#### 1. Component Overview

* **Purpose:** The `readmeTemplate` component is a functional utility designed to generate a standardized `README.md` file string. It dynamically structures documentation based on the specific context of the project being generated (e.g., a root application vs. a reusable layer).
* **Role in System:** This component functions as a **Template Generator** within the scaffolding/boilerplate generation layer of the `app-manager` project. It acts as the "View" logic in a typical MVC scaffolding architecture, transforming configuration data into a finalized string artifact.

#### 2. Architecture & Patterns

* **Design Patterns:**
* **Template Method / Functional:** The component exports a pure function (`readmeTemplate`) that accepts a context object and returns a result string.
* **Strategy (Implicit):** The logic implements a branching strategy based on `ctx.target` ('root' vs. 'layer') to determine whether to render "Setup/Dev/Build" instructions or "Installation/Extends" instructions.


* **State Management:**
* **Stateless:** The component is purely functional and deterministic (mostly, excluding `new Date()` fallback). It retains no internal state between executions.


* **Complexity Assessment:** **Low**.
* The control flow is linear with a single major logical branch (Line 47 and 81).
* String manipulation is handled via standard template literals.



#### 3. Dependency Graph

* **Internal Dependencies:**
* `../types/index`: Imports `ReadmeContext` and `TemplateFunction` interfaces.


* **External Dependencies:**
* **None:** The file uses standard JavaScript/TypeScript APIs. It does not rely on Node.js built-ins (like `fs`) or third-party packages (like `lodash`).


* **Coupling Analysis:**
* **Loosely Coupled:** The function is decoupled from the file system. It does not write the file; it only returns the string content. This makes it highly portable and testable.



#### 4. Data Types & Interfaces

* **Key Interfaces:**
* `ReadmeContext`: Inferred from usage, this object must contain:
* `target`: 'root' | 'layer' (string)
* `projectName`: string
* `description`: string (optional)
* `year`: string (optional)
* `author`: string (optional)
* `features`: string[] (optional)
* `requirements`: string[] (optional)


* `TemplateFunction<T, R>`: A generic function type definition.


* **Return Types:**
* `readmeTemplate`: Explicitly typed to return `string` via the `TemplateFunction` generic signature.



#### 5. Functional Logic Specification

**Method:** `readmeTemplate(ctx: ReadmeContext): string`

* **Logic Flow:**
1. **Context Analysis:** Determines if the target is root (`isRoot = ctx.target === 'root'`).
2. **Scope Normalization:**
* If `isRoot` is true, use `ctx.projectName` as is.
* If `isRoot` is false (Layer mode), check if `projectName` starts with `@monorepo/`. If not, prepend it. This enforces naming conventions for layers.


3. **Variable Initialization:** Sets defaults for description, year (current system year), and author ('Maintainer').
4. **Header Generation:** Appends H1 title and description.
5. **Features Section (Conditional):** Iterates `ctx.features` to create a bulleted list if the array exists and is not empty.
6. **Prerequisites Section:** Iterates `ctx.requirements`. If `ctx.requirements` is missing, defaults to `['Node.js >= 20.0.0', 'pnpm >= 9.0.0']`.
7. **Instructions Section (Branching):**
* **Case A (Root):** Generates H2 sections for "Setup", "Development", and "Build" with bash code blocks for `pnpm` commands.
* **Case B (Layer):** Generates H2 "Installation" section explaining how to add the layer to the `extends` array in `nuxt.config.ts`.


8. **Footer Generation:** Appends License information including the year and author.
9. **Return:** Returns the concatenated markdown string.


* **Side Effects:**
* None. This is a read-only operation.


* **Error Handling:**
* **Implicit:** If `ctx` is null/undefined, the function will throw a runtime JS error.
* **Type Safety:** Relies on TypeScript interfaces to ensure properties like `ctx.projectName` exist.



---

### Part 2: Appendix - Testing Reference

#### 1. Mocking Strategy

* **Services to Mock:**
* Since this is a pure function, **no external services** need mocking.
* **System Time:** The function uses `new Date().getFullYear()`. For snapshot testing consistency, the system time should be mocked (e.g., using `vi.setSystemTime` in Vitest or `jest.useFakeTimers`) unless the test explicitly provides a `ctx.year`.


* **Mock Behaviour:**
* Set System Year to "2026" to ensure the License footer output is deterministic if `ctx.year` is omitted.



#### 2. Test Scenarios

| Category | Scenario ID | Description | Expected Outcome |
| --- | --- | --- | --- |
| **Happy Path** | **HP-01** | **Root Project Generation**<br>

<br>Input: `target: 'root'`, `projectName: 'my-app'`. | Output contains "Setup", "Development", "Build" sections. Header is `# my-app`. |
| **Happy Path** | **HP-02** | **Layer Project Generation (Scoped)**<br>

<br>Input: `target: 'layer'`, `projectName: '@monorepo/auth'`. | Output contains "Installation" section with `extends: ["@monorepo/auth"]`. |
| **Happy Path** | **HP-03** | **Layer Project Generation (Unscoped)**<br>

<br>Input: `target: 'layer'`, `projectName: 'ui-kit'`. | Output auto-scopes name to `@monorepo/ui-kit`. |
| **Edge Case** | **EC-01** | **Defaults Fallback**<br>

<br>Input: Minimal context (no author, year, description, requirements). | Output uses "No description provided", "Maintainer", current year, and default Node/pnpm requirements. |
| **Edge Case** | **EC-02** | **Feature List Rendering**<br>

<br>Input: `features: ['Auth', 'Logging']`. | Output includes `## Features` section with bullet points. |
| **Edge Case** | **EC-03** | **Empty Feature List**<br>

<br>Input: `features: []`. | Output **excludes** the `## Features` section entirely. |

#### 3. Test Data Requirements

The following JSON objects simulate the `ReadmeContext` needed for unit tests.

**Scenario HP-01: Root Application Context**

```json
{
  "target": "root",
  "projectName": "dashboard-app",
  "description": "Main administrative dashboard.",
  "author": "Dev Team",
  "year": "2026",
  "features": ["SSO", "Analytics"],
  "requirements": ["Node >= 22"]
}

```

**Scenario HP-03: Layer Auto-Scoping Context**

```json
{
  "target": "layer",
  "projectName": "billing",
  "description": "Shared billing components.",
  "year": "2026"
  // Intentionally missing 'author' to test default
  // Intentionally missing 'requirements' to test default
}

```

**Scenario EC-03: Empty Features Context**

```json
{
  "target": "root",
  "projectName": "minimal-app",
  "features": []
}

```

### Next Steps

Would you like me to generate the **Vitest/Jest unit test file** corresponding to this strategy to ensure immediate coverage?