Based on the analysis of the provided source code file `nuxtConfigTemplate.ts`, here is the Technical Specification Document and Test Strategy Appendix.

---

### Part 1: Operational & Design Specification

#### 1. Component Overview

* **Purpose:** The `nuxtConfigTemplate` component serves as a **source code generator**. Its specific purpose is to programmatically construct the content of a `nuxt.config.ts` file as a raw TypeScript string. It dynamically adjusts the configuration content based on whether the target application is a "Root" application or a "Layer".
* **Role in System:**
* **Role:** Scaffold/Template Generator.
* **System placement:** This component resides in the "Templates" layer (`~/app/templates`) of the `app-manager` project. It functions as a utility used during project initialization or reconfiguration logic to enforce standard architectural settings (like HMR ports and Tailwind setup).



#### 2. Architecture & Patterns

* **Design Patterns:**
* **Strategy Pattern (Simplified):** The component uses a conditional strategy based on the `ctx.target` ('root' vs 'layer') to determine which "Micro-Templates" (chunks of configuration) to inject.
* **Pure Functional:** The component is implemented as a pure function. It takes a context object as input and returns a deterministic string output without side effects.


* **State Management:**
* **Stateless:** The component maintains no internal state. It relies entirely on the passed `ctx` object.


* **Complexity Assessment:** **Low**.
* **Justification:** The control flow is linear with simple binary branching (Root vs. Layer). There are no recursive algorithms, asynchronous operations, or complex data transformations.



#### 3. Dependency Graph

* **Internal Dependencies:**
* `../types/index`: Imports `BaseTemplateContext` and `TemplateFunction` for type safety.


* **External Dependencies:**
* **Runtime:** None (The file relies on standard JavaScript/TypeScript string manipulation).
* **Generated Code Dependencies:** The *output* string implies the existence of:
* `nuxt` (specifically `nuxt/config`)
* `@tailwindcss/vite`
* `@pinia/nuxt`
* `@nuxt/icon`




* **Coupling Analysis:**
* **Loosely Coupled:** The function is decoupled from the file system or the actual build process. It accepts a generic context object and returns a string, making it highly portable and easy to unit test.



#### 4. Data Types & Interfaces

* **Key Interfaces:**
* `NuxtConfigContext`: While not explicitly defined in this file (it is passed as a generic), the usage implies the following structure based on property access:
```typescript
interface NuxtConfigContext {
    target: 'root' | 'layer' | string;
    layers?: string[];
    port?: number;
    compatibilityDate?: string;
}

```


* `TemplateFunction<T, R>`: A generic function type definition imported from types/index.


* **Return Types:**
* `string`: The function explicitly returns a string representing the TypeScript source code.



#### 5. Functional Logic Specification

**Method:** `nuxtConfigTemplate(ctx)`

* **Signature:** `(ctx: NuxtConfigContext) => string`
* **Logic Flow:**
1. **Context Extraction:** Variables are extracted with default fallbacks:
* `isRoot`: Checked against `ctx.target === 'root'`.
* `port`: Defaults to `11500` if undefined.
* `compatDate`: Defaults to `'2025-10-08'` if undefined.
* `layers`: Defaults to empty array `[]` if undefined.


2. **Import Generation:**
* If **Root**: Adds imports for `defineNuxtConfig` and `tailwindcss`.
* If **Layer**: Adds import for `defineNuxtConfig` only.


3. **Module Configuration (Root Only):**
* Injects an array containing `'@pinia/nuxt'` and `'@nuxt/icon'`.


4. **Vite Configuration (Root Only):**
* Injects `vite` block with `tailwindcss()` plugin.
* **HMR Locking:** Configures strict HMR settings: `port` (11500), `host` ('127.0.0.1'), `protocol` ('ws'), `timeout` (30000), `overlay` (true).
* Enables CSS sourcemaps and CSS minification.


5. **Nitro Configuration (Root Only):**
* Injects `nitro: { dev: true }`.


6. **Extends Configuration:**
* Maps the `layers` string array into a formatted TypeScript string array (e.g., `["layer1", "layer2"]`).


7. **Assembly:**
* Concatenates all blocks into the final `export default defineNuxtConfig({ ... })` string.




* **Side Effects:** None.
* **Error Handling:**
* The function does not throw errors explicitly. Undefined inputs fall back to safe defaults (e.g., standard ports and empty layer arrays).



---

### Part 2: Appendix - Testing Reference

#### 1. Mocking Strategy

* **Services to Mock:**
* **None Required.** As this is a pure function without external I/O (file system, network) or complex class dependencies, no mocks, spies, or stubs are required. Testing should be performed via direct input injection.



#### 2. Test Scenarios

| Category | Scenario Name | Description | Expected Outcome |
| --- | --- | --- | --- |
| **Happy Path** | **Generate Root Config** | Input `target: 'root'` with no overrides. | String includes `tailwindcss` import, `modules` block (Pinia/Icon), and Vite HMR settings locked to port 11500. |
| **Happy Path** | **Generate Layer Config** | Input `target: 'layer'`, `layers: ['base-layer']`. | String includes only `defineNuxtConfig` import, `extends: ["base-layer"]`, and **omits** `vite`, `nitro`, and `modules` blocks. |
| **Edge Case** | **Custom Port** | Input `target: 'root'`, `port: 3000`. | Vite HMR block should explicitly contain `port: 3000`. |
| **Edge Case** | **Empty Layers** | Input `layers: []` or `undefined`. | `extends` property should render as `[]`. |
| **Edge Case** | **Custom Compat Date** | Input `compatibilityDate: '2026-01-01'`. | `compatibilityDate` property in string matches input. |
| **Edge Case** | **Invalid Target** | Input `target: 'unknown'`. | Should behave like 'Layer' mode (omitting root-specific configurations) due to `const isRoot = ctx.target === 'root'` logic. |

#### 3. Test Data Requirements

**Scenario A: Root Application (Standard)**

```json
{
  "target": "root",
  "layers": [],
  "port": 11500,
  "compatibilityDate": "2025-10-08"
}

```

**Scenario B: Layer Application with Extensions**

```json
{
  "target": "layer",
  "layers": ["@my-org/base-ui", "@my-org/auth"],
  "compatibilityDate": "2025-12-01"
}

```

**Scenario C: Minimal Context (Defaults Test)**

```json
{
  "target": "root"
  // Tests internal defaults for port (11500) and date ('2025-10-08')
}

```