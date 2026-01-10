# Technical Specification Document

**Subject:** Code Intelligence Domain Type Definitions
**Version:** 1.0.0
**Source File:** `codeServiceTypes.ts`

## Part 1: Operational & Design Specification

### 1. Component Overview

* **Purpose:** This component serves as the **Contract Definition Layer** for the Code Intelligence domain. It defines the data structures (`CodeFileMetadata`, `CodeBlock`) and the behavioral contract (`ICodeStrategy`) required to parse, analyze, and manipulate source code files programmatically.
* **Role in System:** The file acts as a **Polymorphic Interface**. It sits between the core application logic (which consumes code intelligence) and the specific implementation strategies (which perform the parsing for specific languages like TypeScript, JSON, or Vue).

### 2. Architecture & Patterns

* **Design Patterns:**
* **Strategy Pattern:** The `ICodeStrategy` interface is the explicit definition of the Strategy pattern. It allows the system to switch parsing algorithms (Strategies) based on file type without altering the consumer code.
* **Data Transfer Object (DTO) Definitions:** `CodeFileMetadata` and `CodeBlock` act as DTOs, standardizing how code data is passed around the application.


* **State Management:**
* **Stateless:** The interfaces defined are pure contracts. Any class implementing `ICodeStrategy` is expected to process inputs (content strings) and return outputs without retaining internal state regarding the file processing.


* **Complexity Assessment:**
* **Rating:** **Low**
* **Justification:** The file contains only type definitions and interfaces. There is no control flow, cyclomatic complexity, or executable logic.



### 3. Dependency Graph

* **Internal Dependencies:** None. This file is a leaf node in the dependency graph.
* **External Dependencies:** None. It utilizes standard TypeScript primitives.
* **Coupling Analysis:**
* **Loosely Coupled:** This file promotes loose coupling by decoupling the "what" (the interface) from the "how" (the parsing logic). Services depending on `ICodeStrategy` do not need to know about specific language parsers.



### 4. Data Types & Interfaces

#### Key Interfaces

| Interface Name | Purpose |
| --- | --- |
| **`CodeFileMetadata`** | Defines high-level header information (Author, Version, etc.) extracted from file comments or configuration. |
| **`CodeBlock`** | Defines a discrete unit of code (function, class, variable) including its location and signature. |
| **`ICodeStrategy`** | The contract that language-specific parsers must implement. |

#### Return Types & Typing Analysis

* **Implicit `any` Warning:** None. All types are strictly defined.
* **Method Return Types (`ICodeStrategy`):**
* `parseMetadata`: Returns `CodeFileMetadata`.
* `updateMetadata`: Returns `string` (the modified file content).
* `findDocumentableBlocks`: Returns `CodeBlock[]`.
* `injectFunctionDoc`: Returns `string` (the modified file content).



### 5. Functional Logic Specification (Contract Definitions)

As this is an interface file, this section defines the *required* logic for any class implementing `ICodeStrategy`.

#### 5.1. Method: `parseMetadata`

* **Signature:** `parseMetadata(content: string): CodeFileMetadata`
* **Required Logic:** The implementation must parse the raw string content (e.g., using Regex or AST) to extract JSDoc-style header comments (e.g., `@author`, `@version`) or JSON fields.
* **Side Effects:** None permitted.
* **Error Handling:** Should handle files with missing headers gracefully (likely returning a partial or empty object).

#### 5.2. Method: `updateMetadata`

* **Signature:** `updateMetadata(content: string, metadata: Partial<CodeFileMetadata>): string`
* **Required Logic:** The implementation must locate the existing header in `content`, update the fields provided in `metadata`, and return the **full** reconstructed file string.
* **Side Effects:** Pure transformation (String in -> String out).
* **Error Handling:** Must define behavior if the header does not exist (e.g., create a new one).

#### 5.3. Method: `findDocumentableBlocks`

* **Signature:** `findDocumentableBlocks(content: string): CodeBlock[]`
* **Required Logic:** Scans the code to identify entities such as functions, classes, or methods. It must populate `startLine`, `endLine`, `signature`, and `hasDoc` boolean.
* **Side Effects:** None.
* **Error Handling:** Should return an empty array `[]` if no blocks are found, rather than throwing.

#### 5.4. Method: `injectFunctionDoc`

* **Signature:** `injectFunctionDoc(content: string, functionName: string, docBlock: string): string`
* **Required Logic:** Locates a specific function by `functionName` and inserts (or updates) the provided `docBlock` string immediately above the function signature.
* **Side Effects:** Pure transformation (String in -> String out).

---

## Part 2: Appendix - Testing Reference

**Note:** Since `codeServiceTypes.ts` contains only interfaces, these tests apply to any **Concrete Strategy** (e.g., `TypeScriptStrategy`, `JsonStrategy`) that implements these interfaces.

### 1. Mocking Strategy

When testing services that *consume* `ICodeStrategy`, the strategy itself should be mocked.

* **Services to Mock:** `ICodeStrategy` implementation.
* **Mock Behaviour Examples:**
* **Scenario: File has no headers.**
* Mock `parseMetadata` to return `{}`.


* **Scenario: File has complex functions.**
* Mock `findDocumentableBlocks` to return:
```typescript
[{ name: 'init', type: 'function', startLine: 10, endLine: 15, hasDoc: false }]

```




* **Scenario: Injection fails.**
* Mock `injectFunctionDoc` to throw a custom `FunctionNotFoundException` to test error handling in the consumer.





### 2. Test Scenarios (For Implementations)

| ID | Scenario | Type | Description |
| --- | --- | --- | --- |
| **TS-01** | **Parse Metadata (Happy Path)** | Happy Path | Input a string with standard JSDoc `@author` and `@version`. Verify returned object matches values. |
| **TS-02** | **Parse Metadata (Empty)** | Edge Case | Input a string with no comments. Verify returns empty object (not null/undefined). |
| **TS-03** | **Find Blocks (Single)** | Happy Path | Input code with one function. Verify `CodeBlock` array length is 1 and line numbers are correct. |
| **TS-04** | **Find Blocks (Nested)** | Edge Case | Input code with a method inside a class. Verify type is identified as `'method'` vs `'function'`. |
| **TS-05** | **Update Metadata (Partial)** | Happy Path | Call `updateMetadata` changing only `@version`. Verify other fields (e.g., `@author`) remain in the output string. |
| **TS-06** | **Inject Doc (New)** | Happy Path | Inject docblock above a function that currently has no docs. Verify output string contains the docblock at correct index. |
| **TS-07** | **Inject Doc (Overwrite)** | Edge Case | Inject docblock above a function that *already* has docs. Verify old docs are replaced, not duplicated. |

### 3. Test Data Requirements

To validate the `CodeBlock` extraction, the following JSON structure mimics the expected output from `findDocumentableBlocks`:

```json
// Expected Mock Data for "findDocumentableBlocks"
[
  {
    "name": "calculateTax",
    "type": "function",
    "startLine": 12,
    "endLine": 24,
    "signature": "calculateTax(amount: number): number",
    "hasDoc": false,
    "content": "function calculateTax(amount: number): number { ... }"
  },
  {
    "name": "User",
    "type": "class",
    "startLine": 30,
    "endLine": 100,
    "signature": "class User",
    "hasDoc": true,
    "content": "class User { ... }"
  }
]

```

To validate `CodeFileMetadata` parsing:

```json
// Expected Mock Data for "parseMetadata"
{
  "version": "1.0.0",
  "author": "Steve R Lewis",
  "createdDate": "2025 Dec 31",
  "notes": [
    "V1.0.0 - Initial creation"
  ]
}

```

### Next Steps

Would you like me to generate a **stub implementation** of a `TypeScriptStrategy` that fulfills this `ICodeStrategy` contract to help jumpstart the development?