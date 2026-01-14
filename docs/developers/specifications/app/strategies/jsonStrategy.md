# Technical Specification Document: JSON Strategy

## Part 1: Operational & Design Specification

### 1. Component Overview

* **Purpose:** The `JsonStrategy` class provides a mechanism to parse, analyze, and manipulate JSON and JSONC (JSON with Comments) files. It is specifically engineered to perform "surgical edits," modifying specific values within a file while rigorously preserving existing formatting, whitespace, and comments.
* **Role in System:** This component acts as a specific **Strategy** implementation within the application's file manipulation layer. It fulfills the `ICodeStrategy` contract, allowing the system to handle JSON files interchangeably with other file types (like TypeScript or YAML) without changing the consuming service's logic.

### 2. Architecture & Patterns

* **Design Patterns:**
* **Strategy Pattern:** The class implements the `ICodeStrategy` interface, allowing it to be swapped into a context that expects generic code file manipulation.
* **Stateless Utility:** The class does not maintain internal state between method calls. All methods are pure transformations (Input String  Output String) or extractions.


* **State Management:** **Stateless**. The class does not hold references to file handles or previous operations. Every method execution is independent.
* **Complexity Assessment:** **Medium**.
* *Justification:* While standard JSON parsing is trivial, this component utilizes Concrete Syntax Tree (CST) manipulation via `jsonc-parser`. It includes conditional logic to detect different schema types ("Standard" vs "App Manager") and implements "Deep Path Creation" logic to auto-generate missing nested objects (specifically for the `development` node), increasing control flow complexity.



### 3. Dependency Graph

* **Internal Dependencies:**
* `../types/index`: Imports `ICodeStrategy`, `CodeFileMetadata`, and `CodeBlock` interfaces.


* **External Dependencies:**
* `jsonc-parser`: Critical dependency used for AST/CST generation (`parse`), calculating edits (`modify`), and applying changes (`applyEdits`).


* **Coupling Analysis:** **Loosely Coupled**. The class relies strictly on the `ICodeStrategy` interface. It does not import file system modules (`fs`) or other system services, making it highly portable and easy to test in isolation.

### 4. Data Types & Interfaces

* **Key Interfaces:**
* `ICodeStrategy`: The governing contract (public methods match this interface).
* `CodeFileMetadata`: Structure for returning parsed header info (`version`, `description`, `author`).
* `ParseError` (from `jsonc-parser`): Used for internal validation.


* **Return Types:**
* `parseMetadata(content: string)`: Returns `CodeFileMetadata`.
* `injectHeader(content: string, headerText: string)`: Returns `string` (the modified file content).
* `findDocumentableBlocks(content: string)`: Returns `CodeBlock[]`.
* `injectFunctionDoc(...)`: Returns `string`.



### 5. Functional Logic Specification

#### Method: `parseMetadata`

* **Signature:** `public parseMetadata(content: string): CodeFileMetadata`
* **Logic Flow:**
1. Parses the raw content string using `jsonc-parser`.
2. **Schema Detection**:
* **Case A (App Manager Schema):** Checks for the existence of `json.metadataEntity`. If present, extracts `version` from `metadataEntity.development.schemaVersion`. Extracts `description` and `author` from `metadataEntity`.
* **Case B (Standard JSON):** If `metadataEntity` is absent, falls back to standard root-level property access (e.g., `json.version`, `json.description`) typical of `package.json` files.


3. Returns the populated `CodeFileMetadata` object.


* **Error Handling:** Returns an empty object `{}` if the parse result is null/undefined.

#### Method: `injectHeader`

* **Signature:** `public injectHeader(content: string, headerText: string): string`
* **Logic Flow:**
1. **Validation:** Parses content to check for validity. If the content is non-empty but contains parse errors, it returns the original content immediately to prevent corrupting a malformed file.
2. **Preparation:** Parses the `headerText` into a key-value map and determines formatting options (defaulting to spaces, tab size 2).
3. **Iteration:** Loops through every key found in the header text.
4. **Schema Logic:**
* It re-parses the JSON on every iteration to ensure the AST is current (essential for the Deep Path Creation logic).
* **Complex Schema (`metadataEntity` exists):** Maps fields to `metadataEntity.*`.
* *Deep Creation Logic:* If updating `version`, it checks if `metadataEntity.development` exists. If not, it creates this object first before attempting to set `schemaVersion`.


* **Standard Schema:** Maps fields to root level keys.


5. **Execution:** Uses `modify` to calculate the required edits and `applyEdits` to generate the new string.


* **Side Effects:** None (Pure string manipulation).

#### Method: `parseHeaderText` (Private)

* **Signature:** `private parseHeaderText(headerText: string): Record<string, string>`
* **Logic Flow:**
1. Splits input by newline `\n`.
2. Splits lines by the first colon `:`.
3. Cleans Keys: Removes `@` and `*` characters (handling JSDoc style formatting) and converts to lowercase.
4. Returns a dictionary of updates.



#### Method: `findDocumentableBlocks` & `injectFunctionDoc`

* **Status:** **Unimplemented**.
* **Logic:** `findDocumentableBlocks` returns an empty array. `injectFunctionDoc` returns the original content unaltered. These are placeholders for interface compliance.

---

## Part 2: Appendix - Testing Reference

### 1. Mocking Strategy

Since `JsonStrategy` is a logic-only class with no I/O side effects, **mocks are generally not required** for unit testing, as the `jsonc-parser` library can be used directly. However, to strictly isolate the unit:

* **Services to Mock:** `jsonc-parser`.
* **Mock Behaviour:**
* **Scenario: Malformed File:** Mock `parse` to return `undefined` and populate the `errors` array to test the guard clause in `injectHeader`.
* **Scenario: Deep Creation:** Mock `modify` to verify that correct `JSONPath` arguments (e.g., `['metadataEntity', 'development']`) are generated when the intermediate node is missing.



### 2. Test Scenarios

| Category | Scenario Name | Description | Expected Outcome |
| --- | --- | --- | --- |
| **Happy Path** | Standard JSON Update | Inject header into a standard `package.json`. | Root keys (`version`, `author`) are updated. Comments/formatting preserved. |
| **Happy Path** | App Schema Update | Inject header into a file with `metadataEntity`. | Keys map to `metadataEntity` fields. |
| **Edge Case** | Deep Path Creation | Inject `version` into an App Schema file where `development` object is missing. | The `development` object is created, then `schemaVersion` is set inside it. |
| **Edge Case** | JSDoc Header parsing | `headerText` contains `* @Version: 1.0.0`. | Parser strips `* @` and correctly identifies key as `version`. |
| **Edge Case** | Comments Preservation | Input JSON contains `// TODO` comments. | Output JSON retains comments in exact locations. |
| **Error State** | Malformed Input | Input string is `{ "key": "val" ` (missing brace). | Method returns original string unmodified (Safety Guard). |
| **Error State** | Empty Input | Input string is empty. | `parseMetadata` returns empty object. |

### 3. Test Data Requirements

**A. App Manager Schema (Complex)**

```json
{
  "metadataEntity": {
    "description": "Old Desc",
    "author": "Old Author",
    // "development" object intentionally missing for Deep Path test
  }
}

```

**B. Standard Schema (Simple)**

```jsonc
{
  // This is a comment
  "name": "my-app",
  "version": "0.0.1",
  "description": "Old Desc"
}

```

**C. Header Text Input**

```text
@Version: 2.0.0
@Author: Jane Doe
@Description: Updated description via Strategy

```

### 4. Next Step for the User