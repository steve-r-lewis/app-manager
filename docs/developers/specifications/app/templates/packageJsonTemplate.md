Here is the comprehensive Technical Specification Document and Test Strategy Appendix based on the analysis of `packageJsonTemplate.ts`.

---

# Technical Specification Document: Package.json Generator Template

## Part 1: Operational & Design Specification

### 1. Component Overview

* **Purpose:** The `packageJsonTemplate` component serves as a configuration generator. Its specific purpose is to programmatically construct a valid `package.json` object for Node.js projects within the `app-manager` ecosystem.
* **Role in System:**
* **Scaffolding/Templating:** It functions as a Logic/Template layer. It does not perform I/O operations itself; rather, it transforms context data into a structured configuration object to be consumed by a file writer or build system.
* **Standardization Enforcer:** It acts as the "Single Source of Truth" for dependency versions (e.g., Nuxt 4.2+, Tailwind 4) and script definitions across the monorepo.



### 2. Architecture & Patterns

* **Design Patterns:**
* **Functional Strategy:** The component is implemented as a pure function. It utilizes a **Discriminated Union** strategy based on the `ctx.target` property ('root' vs 'layer') to return distinct configuration structures.
* **Template Method:** It defines a skeleton of operations (Base Structure calculation) and defers specific implementation steps to conditional branches based on the target type.


* **State Management:**
* **Stateless:** The component is purely functional and referentially transparent. It maintains no internal state; the output depends solely on the provided `ctx` argument.


* **Complexity Assessment:**
* **Low:** The control flow is linear with a single major bifurcation (`isRoot`). There are no loops, recursion, or asynchronous operations.



### 3. Dependency Graph

* **Internal Dependencies:**
* `../types/index`: Imports `BaseTemplateContext` and `TemplateFunction` interfaces.


* **External Dependencies:**
* **None:** The file itself does not import any third-party runtime libraries (e.g., `fs`, `path`).
* *Note on Generated Dependencies:* While the file *imports* nothing, it *defines* hardcoded dependencies for the generated project (e.g., `nuxt`, `vue`, `pinia`, `tailwindcss`).


* **Coupling Analysis:**
* **Loosely Coupled:** The function is decoupled from the file system and the CLI framework. It is coupled only to the Data Transfer Object (DTO) structure defined in `PackageJsonContext`.



### 4. Data Types & Interfaces

* **Key Interfaces:**
* `TemplateFunction<Context, ReturnType>`: A generic functional interface defining the contract for template generators.
* `PackageJsonContext`: The input context object. Based on usage, it must include properties: `target`, `name`, `version`, `description`, `isPrivate`, `authors`, `repository`, `bugs`, `funding`.


* **Return Types:**
* `Record<string, any>`: **WARNING:** The return type uses an explicit `any` for the value side of the record. While common for JSON structures, strict typing (e.g., `PackageJson` interface from `type-fest`) would be preferred to ensure the output conforms to the official Node.js spec.



### 5. Functional Logic Specification

**Method:** `packageJsonTemplate`

* **Signature:** `(ctx: PackageJsonContext) => Record<string, any>`
* **Logic Flow:**
1. **Target Evaluation:** Determines the generation mode by checking if `ctx.target === 'root'`.
2. **Scope Calculation:**
* If `root`: Uses `ctx.name` as is.
* If `layer`: Prefixes the name with `@monorepo/`.


3. **Base Object Construction:** Constructs a common object containing metadata (`version`, `license`, `authors`, etc.).
4. **Branch: Root Mode:**
* Extends the base object.
* Sets `main` to "nuxt.config.ts".
* Injects `packageManager` (pnpm@10.25.0) and `engines`.
* Injects operational scripts (`dev`, `build`, `appTools`).
* Injects the "Gold Standard" dependency sets (Nuxt 4, Tailwind 4, Pinia, etc.).


5. **Branch: Layer Mode:**
* Extends the base object.
* Sets `main` to "./nuxt.config.ts".
* Defines `exports` map for Nuxt layer discovery (`.` -> `import` & `types`).
* Explicitly sets `scripts`, `dependencies`, and `devDependencies` to empty objects (relying on host app).




* **Side Effects:** None. The function is pure and returns a new object.
* **Error Handling:**
* **Implicit:** There is no explicit error handling (try/catch) within the function. It relies on TypeScript compile-time checks for `ctx` validity. Runtime undefined values in `ctx` (if not caught by TS) will propagate into the JSON object as `undefined` or cause issues downstream.



---

## Part 2: Appendix - Testing Reference

### 1. Mocking Strategy

Since this is a pure function with no external imports or side effects, **no service mocking is required**. Testing requires only the injection of a mock Context Object (`ctx`).

### 2. Test Scenarios

| Category | Scenario | Description | Expected Outcome |
| --- | --- | --- | --- |
| **Happy Path** | **Generate Root Config** | Input `ctx.target` as `'root'`. | Object contains `scripts.dev`, `dependencies.nuxt`, and `packageManager`. Name matches `ctx.name`. |
| **Happy Path** | **Generate Layer Config** | Input `ctx.target` as `'layer'`. | Object name is `@monorepo/{name}`. `exports` key exists. `dependencies` is empty. |
| **Edge Case** | **Private Flag Handling** | Input `ctx.isPrivate` as `false`. | Result `private` field should be `false`. (Default logic checks `?? true`). |
| **Edge Case** | **Default Author** | Input `ctx.authors` as undefined. | Result `authors` should default to array containing `[{ name: ctx.author |
| **Validation** | **Dependency Versions** | Verify specific hardcoded versions. | `vue` must equal `^3.5.25`; `typescript` must equal `^5.9.3`. |
| **Validation** | **Script correctness** | Verify Root script paths. | `appTools` must equal `tsx scripts/tui/app.ts`. |

### 3. Test Data Requirements

To execute the tests above, the following JSON structures (Mock Contexts) are required:

**A. Root Context Mock (`mockRootContext`):**

```json
{
  "target": "root",
  "name": "my-app",
  "version": "1.0.0",
  "description": "A root app",
  "isPrivate": true,
  "authors": [{ "name": "Tester" }],
  "repository": { "type": "git", "url": "git+ssh://git@github.com/test.git" },
  "bugs": { "url": "issues.com" },
  "funding": { "type": "opencollective" }
}

```

**B. Layer Context Mock (`mockLayerContext`):**

```json
{
  "target": "layer",
  "name": "ui-kit",
  "description": "A component library",
  "author": "Steve",
  "isPrivate": false
}

```

**C. Minimal Context Mock (to test defaults):**

```json
{
  "target": "root",
  "name": "minimal-app"
}

```

### 4. Next Steps

Would you like me to generate the **Vitest unit test file (`packageJsonTemplate.test.ts`)** implementing these scenarios?