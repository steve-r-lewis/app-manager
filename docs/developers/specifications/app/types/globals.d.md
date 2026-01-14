# Part 1: Operational & Design Specification

**1. Component Overview**

* **Purpose:** This component serves as the **Global Type Definition** for the application's runtime environment. It utilizes TypeScript's declaration merging to strictly type the `process.env` object, ensuring that all environment variables used for core configuration, AI services, and version control integrations are explicitly defined and type-checked.
* **Role in System:** **Infrastructure/Type Safety Layer.** It acts as a compile-time contract across the entire application. It does not contain runtime logic but serves as the foundational truth for what configuration inputs the application accepts from the underlying OS or `.env` files.

**2. Architecture & Patterns**

* **Design Patterns:**
* **Declaration Merging:** The file uses TypeScript’s specific ability to extend existing interfaces (`NodeJS.ProcessEnv`) without overwriting them.
* **Global Scope Augmentation:** Uses `declare global` to inject types into the global namespace, making them available everywhere without imports.


* **State Management:** **Stateless.** This file is purely declarative and contains no values or state; it only defines the *shape* that the global state (`process.env`) must adhere to.
* **Complexity Assessment:** **Low.** The file contains no control flow, loops, or conditional logic. It is a pure data structure definition.

**3. Dependency Graph**

* **Internal Dependencies:** None. This file is a root dependency for other files.
* **External Dependencies:**
* **Node.js Type Definitions (`@types/node`):** Implicitly depends on the existence of the `NodeJS` namespace to extend it.


* **Coupling Analysis:** **Loosely Coupled** implementation, but **High Impact**. While the file itself has no dependencies, the rest of the application is tightly coupled to *it*. Changing a variable name here (e.g., `API_KEY_GEMINI`) requires refactoring every usage of that variable throughout the codebase.

**4. Data Types & Interfaces**

* **Key Interfaces:**
* `NodeJS.ProcessEnv`: The primary interface being extended.


* **Return Types:**
* N/A. This file contains no functions or methods.


* **Data Types Defined:**
* **Union String Literals:** Used for strict flags (e.g., `'true' | 'false'`, `'development' | 'production' | 'test'`). This is a best practice compared to generic `string` types to prevent configuration drift.
* **Strings:** Used for API keys and paths (e.g., `API_KEY_CLAUDE`, `APP_CONFIG_DIR`).



**5. Functional Logic Specification**

*Note: As this is a Declaration File (`.d.ts`), there are no executable methods. The "logic" consists of the structural constraints imposed on the environment variables.*

**Constraints & Definitions:**

1. **Core Application Flags**
* `NODE_ENV`: Restricted to `'development' | 'production' | 'test'`.
* `DEBUG`, `LOG_TO_FILE`, `CI`: Restricted to `'true' | 'false'`.
* *Logic:* Prevents typo-based errors (e.g., setting `DEBUG=yes` will cause a type error if checked against this interface).


2. **Configuration Overrides**
* `APP_CONFIG_DIR`: `string` (Optional). Used to redirect config loading (likely for testing).
* `AM_DEBUG_ARGS`: `'true' | 'false'` (Optional). Logic flag for E2E debugging.


3. **AI & LLM Services**
* `LLM_PROVIDER`: `string`. Acts as the switch for the active AI driver.
* *Registry Keys:* Defines specific slots for `API_KEY_CLAUDE`, `API_KEY_DEEPSEEK`, `API_KEY_GEMINI`, etc.
* *Legacy Keys:* Includes `NUXT_HUB_AI_API_KEY` and `OPENAI_API_KEY` for backward compatibility or Nuxt integration.


4. **Git & GitHub**
* `GITHUB_TOKEN`: `string`. Defined as a Fine-grained PAT.
* `GITHUB_ORG`: `string`.



---

### Part 2: Appendix - Testing Reference

**1. Mocking Strategy**

Since this file defines types for `process.env`, "testing" it involves verifying that the application handles these environment variables correctly.

* **Services to Mock:**
* **`process.env`**: You cannot strictly "mock" the global definition in a unit test runner, but you *override* the values.


* **Mock Behaviour:**
* Tests should dynamically assign values to `process.env` to trigger logic in *other* components (e.g., the ConfigService).
* **Example:**
```typescript
// To test Debug logic
process.env.DEBUG = 'true';
// To test CI logic
process.env.CI = 'false';

```





**2. Test Scenarios**

These scenarios apply to the **Configuration Service** or **Startup Logic** which consumes these types.

| Category | Scenario | Expected Behavior |
| --- | --- | --- |
| **Happy Path** | `NODE_ENV` set to 'production' | App initializes with production optimization; no verbose logging. |
| **Happy Path** | `LLM_PROVIDER` set to 'gemini' and `API_KEY_GEMINI` provided | LLM Factory instantiates the Gemini provider successfully. |
| **Edge Case** | `LOG_TO_FILE` is undefined | App defaults to stdout only (assuming default logic handles undefined). |
| **Edge Case** | `APP_CONFIG_DIR` set to a temp path | Config loader reads from the temp path instead of default. |
| **Error State** | `LLM_PROVIDER` is 'claude' but `API_KEY_CLAUDE` is missing | Validation logic (in consuming service) throws `MissingCredentialsError`. |
| **Error State** | `GITHUB_TOKEN` is missing during Repo Operation | GitService throws `AuthenticationError`. |

**3. Test Data Requirements**

**A. Valid Environment Object (JSON Representation)**
Use this object structure to seed test environments:

```json
{
  "NODE_ENV": "test",
  "DEBUG": "true",
  "CI": "true",
  "APP_CONFIG_DIR": "./tests/fixtures/config",
  "LLM_PROVIDER": "ollama",
  "API_KEY_OLLAMA": "ollama-mock-key-123",
  "AM_DEBUG_ARGS": "true"
}

```

**B. Type Compliance Check (Static Analysis)**
To verify this file works as intended, a TypeScript check (like `tsc --noEmit`) must pass with the following code snippet:

```typescript
// valid-env-check.ts
if (process.env.NODE_ENV === 'development') {
    // Should pass
}

// The following should trigger a TS2367 error if strict typing is working
// if (process.env.DEBUG === 'yes') { ... } 

```

**C. Invalid Data (For Runtime Validation Tests)**
Logic consuming these globals should be tested against:

* `LLM_PROVIDER`: Empty string `""`.
* `GITHUB_ORG`: Special characters.

---

**Next Steps for User:**
Would you like me to generate a **Zod schema** or a **ConfigService** class implementation that validates these environment variables at runtime based on these type definitions?