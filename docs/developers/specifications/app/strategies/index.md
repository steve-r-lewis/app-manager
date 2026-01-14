# Technical Specification: Code Intelligence Strategy Registry

**Version:** 1.0.0
**Date:** 2026-01-14
**Author:** System Architect (AI)
**Source File:** `~/app/strategies/index.ts`

## Part 1: Operational & Design Specification

### 1. Component Overview

* **Purpose:** This component serves as a **Centralized Registry and Factory** for code intelligence strategies. It maps file extensions (e.g., `.ts`, `.vue`) to specific implementations of the `ICodeStrategy` interface.
* **Role in System:**
* **Role:** Utility / Core Service Factory.
* **Function:** It acts as a middleware layer between the file system iteration logic and the language-specific analysis logic. It ensures that the rest of the application interacts with a uniform interface (`ICodeStrategy`) regardless of the underlying file type.



### 2. Architecture & Patterns

* **Design Patterns:**
* **Strategy Pattern:** The core intent of the file. It allows the runtime selection of an algorithm (parsing/analysis) based on context (file extension).
* **Registry Pattern:** Uses a `Map` to store associations between identifiers (extensions) and strategy instances.
* **Module-Level Singleton:** The strategies (`tsStrategy`, `vueStrategy`, etc.) are instantiated as `const` at the module level. This means the same instance is reused across the application lifecycle (State is shared if the strategies are stateful).
* **Simple Factory:** The `getStrategyForFile` function acts as a factory method.


* **State Management:**
* **Stateless (Registry):** The registry map is populated at load time and is immutable thereafter.
* **Instance Reusability:** Strategy instances are created once. If the underlying strategy classes (`TypescriptStrategy`, etc.) maintain state, that state will persist across calls. *Architectural Note: This assumes underlying strategies are stateless parsers.*


* **Complexity Assessment:** **Low**.
* **Justification:** The logic is linear (substring extraction -> map lookup -> return). There is no recursion, asynchronous logic, or complex control flow.



### 3. Dependency Graph

* **Internal Dependencies (Project Modules):**
* `../types/codeServiceTypes`: Imports `ICodeStrategy` interface.
* `./typescriptStrategy`: Imports concrete class `TypescriptStrategy`.
* `./vueStrategy`: Imports concrete class `VueStrategy`.
* `./cssStrategy`: Imports concrete class `CssStrategy`.
* `./htmlStrategy`: Imports concrete class `HtmlStrategy`.
* `./jsonStrategy`: Imports concrete class `JsonStrategy`.


* **External Dependencies:**
* **None.** (Uses standard JavaScript `Map` and `String` methods).


* **Coupling Analysis:**
* **High Coupling (Creation):** This file is tightly coupled to the concrete implementations of the strategies. It instantiates them directly (`new TypescriptStrategy()`). This violates strict Dependency Injection (DI) principles, making it harder to swap implementations without modifying this file.
* **Low Coupling (Consumption):** It promotes loose coupling for *consumers* of this file, who only interact with the `ICodeStrategy` interface.



### 4. Data Types & Interfaces

* **Key Interfaces:**
* `ICodeStrategy`: The contract that all returned objects adhere to.


* **Public Methods & Return Types:**
* `getStrategyForFile(filePath: string): ICodeStrategy`
* *Note:* No `any` types were detected. Strict typing is enforced via the interface return type.



### 5. Functional Logic Specification

#### Method: `getStrategyForFile`

* **Signature:** `getStrategyForFile(filePath: string): ICodeStrategy`
* **Logic Flow:**
1. **Extension Extraction:** Extracts the substring starting from the *last* index of the character `.` in `filePath`.
* *Warning:* If `filePath` contains no `.`, `lastIndexOf` returns `-1`. `substring(-1)` behaves like `substring(0)` in standard environments, returning the whole string.


2. **Lookup:** Queries the `strategyMap` using the extracted extension key.
3. **Validation:** Checks if the retrieved strategy is `undefined`.
4. **Error Handling:** If undefined, throws `Error: Unsupported file type: {ext}`.
5. **Return:** Returns the matching `ICodeStrategy` instance.


* **Side Effects:**
* None. This is a read-only operation.


* **Error Handling:**
* **Throws:** `Error` (Generic).
* **Condition:** Thrown when the file extension is not explicitly registered in the `strategyMap`.



---

## Part 2: Appendix - Testing Reference

### 1. Mocking Strategy

Because this file directly instantiates classes (e.g., `new VueStrategy()`), standard dependency injection testing is impossible. You must use module interception (e.g., `jest.mock`) to test this unit in isolation.

* **Services to Mock:**
* `./typescriptStrategy`
* `./vueStrategy`
* `./cssStrategy`
* `./htmlStrategy`
* `./jsonStrategy`


* **Mock Behaviour:**
* Each mock should return a unique object or class instance that implements a dummy `ICodeStrategy`. This allows validation that `getStrategyForFile` returns exactly the expected instance for a given extension.



### 2. Test Scenarios

| Category | Scenario Description | Input (`filePath`) | Expected Output | Notes |
| --- | --- | --- | --- | --- |
| **Happy Path** | Typescript File | `src/app/main.ts` | Instance of `TypescriptStrategy` |  |
| **Happy Path** | JavaScript File (Mapped to TS) | `legacy/script.js` | Instance of `TypescriptStrategy` | Verify shared instance. |
| **Happy Path** | Vue Component | `components/Header.vue` | Instance of `VueStrategy` |  |
| **Happy Path** | CSS Stylesheet | `assets/style.css` | Instance of `CssStrategy` |  |
| **Edge Case** | Multiple dots in filename | `app.spec.ts` | Instance of `TypescriptStrategy` | Ensures `lastIndexOf` is used. |
| **Edge Case** | File inside hidden folder | `.github/action.ts` | Instance of `TypescriptStrategy` |  |
| **Edge Case** | Absolute Path | `/usr/local/bin/app.json` | Instance of `JsonStrategy` |  |
| **Error State** | Unknown Extension | `image.png` | **Throw Error:** `Unsupported file type: .png` |  |
| **Error State** | No Extension | `Dockerfile` | **Throw Error:** `Unsupported file type: Dockerfile` | Logic yields whole string as ext. |
| **Error State** | Case Sensitivity Issue | `Index.TS` | **Throw Error:** `Unsupported file type: .TS` | *Critical:* Code does not normalize case. |

### 3. Test Data Requirements

To verify the "Identity" of the returned strategies without relying on the real strategy logic, use the following mock implementations in the test setup:

```typescript
// Jest Mock Setup Example
const mockTsStrategy = { name: 'MOCK_TS' };
const mockVueStrategy = { name: 'MOCK_VUE' };

jest.mock('./typescriptStrategy', () => ({
  TypescriptStrategy: jest.fn().mockImplementation(() => mockTsStrategy)
}));
jest.mock('./vueStrategy', () => ({
  VueStrategy: jest.fn().mockImplementation(() => mockVueStrategy)
}));
// ... repeat for others

```

### 4. Implementation Recommendations (Audit Findings)

1. **Case Normalization:** The current implementation is case-sensitive. `file.TS` will crash.
* *Remediation:* Update line 57 to: `const ext = filePath.substring(filePath.lastIndexOf('.')).toLowerCase();`


2. **Singleton Injection:** The file creates hard instances.
* *Remediation:* Consider exporting the `strategyMap` population logic as a setup function or using a Dependency Injection container to register these strategies, making the system more testable and modular.

---

