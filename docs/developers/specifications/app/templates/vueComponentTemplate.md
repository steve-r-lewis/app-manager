Here is the comprehensive technical specification and test strategy based on the analysis of `vueComponentTemplate.ts`.

---

# Technical Specification: Vue Component Template Generator

**Document Version:** 1.0.0
**Subject:** `app/templates/vueComponentTemplate.ts`
**Role:** Template Generation Utility

---

## Part 1: Operational & Design Specification

### 1. Component Overview

* **Purpose:** This module exports a pure function designed to generate the source code content for a Vue.js 3 Single File Component (SFC). It utilizes the Composition API (`<script setup lang="ts">`) and enforces a standardized file header structure.
* **Role in System:**
* **Layer:** Utility / Code Generation.
* **Function:** It serves as a scaffolding engine, likely invoked by a CLI or an `app-manager` service to create new `.vue` files programmatically. It transforms a configuration context object into a formatted string ready for file system writing.



### 2. Architecture & Patterns

* **Design Patterns:**
* **Template Method:** It uses a template literal to define the skeleton of a Vue component and interpolates dynamic data into specific slots.
* **Functional Strategy:** Implemented as a functional constant rather than a class-based service, aligning with modern functional TypeScript patterns.


* **State Management:**
* **Stateless:** The component maintains no internal state between executions.
* **Impure Dependency:** It accesses Global State via `new Date()`, making output non-deterministic regarding time unless the system clock is mocked.


* **Complexity Assessment:** **Low**.
* **Justification:** The control flow is linear with no branching logic (if/else), loops, or recursion. Complexity arises solely from string interpolation and ensuring the input context satisfies the type definition.



### 3. Dependency Graph

* **Internal Dependencies:**
* `../types/index`: Imports `BaseTemplateContext` (implied by usage) and `TemplateFunction`.
* `VueComponentContext`: An ambient or imported type definition describing the input object.


* **External Dependencies:**
* **Standard Library:** `Date` (for timestamp generation).


* **Coupling Analysis:**
* **Loosely Coupled:** The function is completely decoupled from the file system, network, or UI. It relies solely on a data contract (`VueComponentContext`). This makes it highly portable.



### 4. Data Types & Interfaces

* **Key Interfaces:**
* `TemplateFunction<T, R>`: A generic function type definition.
* `VueComponentContext`: The input context object. Based on usage analysis, strictly requires:
* `projectName` (string)
* `name` (string)
* `year` (number | undefined)
* `author` (string | undefined)
* `description` (string | undefined)




* **Return Types:**
* **Explicit:** `string`
* **Analysis:** The function explicitly returns a string representing the file content. There are no `any` types visible in the file logic, assuming strict typing in `../types/index`.



### 5. Functional Logic Specification

#### Method: `vueComponentTemplate`

* **Signature:** `(ctx: VueComponentContext) => string`
* **Logic Flow:**
1. **Time Resolution:** Captures the current system date and time.
* `dateStr`: Derived from `toISOString()` (UTC).
* `timeStr`: Derived from `toTimeString()` (Local System Time). **Warning:** Mixing UTC date with Local time may cause inconsistencies near date boundaries.


2. **Default Value Resolution:**
* `year`: Uses `ctx.year` if provided; otherwise, defaults to current system year.
* `author`: Uses `ctx.author` if provided; otherwise, defaults to literal `'Maintainer'`.


3. **Template Construction:**
* Constructs a string containing a Standard File Header block inside a `<script setup>` tag.
* Injects metadata (`project`, `file`, `version`, `createDate`, etc.).
* Generates a boilerplate `<template>` section with a root `div` using the component name (lowercased) as a class.
* Generates a placeholder `<style scoped>` section.


4. **Return:** Returns the complete string.


* **Side Effects:**
* None. This is a read-only operation.


* **Error Handling:**
* **Runtime:** No explicit try/catch blocks.
* **Failure Modes:**
* If `ctx` is `null` or undefined, JS runtime will throw `TypeError`.
* If `ctx.name` is undefined, calling `.toLowerCase()` will throw.
* *Note:* Strict TypeScript settings should catch these at compile time.





---

## Part 2: Appendix - Testing Reference

### 1. Mocking Strategy

To ensure deterministic testing (snapshot testing), the `Date` object must be intercepted.

* **Services to Mock:**
* `Global.Date`: The standard JavaScript Date object.


* **Mock Behaviour:**
* **Scenario:** Testing output formatting.
* **Action:** Freeze system time to a specific timestamp (e.g., `2026-01-01T12:00:00Z`).
* **Tooling:** Use `jest.useFakeTimers().setSystemTime(...)` or `vi.setSystemTime(...)`.



### 2. Test Scenarios

| Scenario ID | Category | Description | Expected Outcome |
| --- | --- | --- | --- |
| **TC-001** | Happy Path | Call with fully populated `ctx`. | Returns string containing provided author, year, and description. |
| **TC-002** | Happy Path | Call with minimal `ctx` (missing optional fields). | Returns string using default 'Maintainer', current year, and 'TODO' description. |
| **TC-003** | Edge Case | `ctx.name` contains uppercase characters. | Class name in `<template>` should be converted to lowercase (e.g., `MyComponent` -> `mycomponent`). |
| **TC-004** | Data Integrity | Check specific CSS class generation. | Ensure the `div` class matches `ctx.name.toLowerCase()`. |
| **TC-005** | Formatting | Validate indentation. | Snapshot test to ensure template literal whitespace is preserved correctly. |

### 3. Test Data Requirements

**Data Object: Full Context (TC-001)**

```json
{
  "projectName": "app-manager",
  "name": "UserProfile",
  "year": 2025,
  "author": "Jane Doe",
  "description": "Displays user profile details."
}

```

**Data Object: Minimal Context (TC-002)**

```json
{
  "projectName": "app-manager",
  "name": "SidebarNav"
  // year, author, and description are omitted to test defaults
}

```

---

### Next Step

Would you like me to generate the **Jest/Vitest unit test file** (`vueComponentTemplate.spec.ts`) implementing the strategies defined above?