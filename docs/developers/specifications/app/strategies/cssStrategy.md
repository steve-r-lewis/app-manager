# Technical Specification: CSS Strategy Module

## Part 1: Operational & Design Specification

### 1. Component Overview

* **Purpose:** The `CssStrategy` class provides a specialized implementation of the `ICodeStrategy` interface designed specifically for parsing, analyzing, and manipulating CSS (Cascading Style Sheets) source code. Its primary functions include extracting file metadata, identifying documentable code blocks (selectors/keyframes), and injecting file headers or JSDoc-style comments.
* **Role in System:** This component acts as a **Utility/Strategy Layer**. It is likely used by a generic "App Manager" or "Documentation Generator" service that delegates file parsing to specific strategies based on file extension (in this case, `.css`).

### 2. Architecture & Patterns

* **Design Patterns:**
* **Strategy Pattern:** The class implements `ICodeStrategy`, allowing the consuming system to swap this logic with other strategies (e.g., `TsStrategy`, `JsStrategy`) interchangeably.
* **Stateless Component:** The class contains no instance properties. All methods are pure functions of their inputs, ensuring thread safety and predictability.


* **Complexity Assessment:** **Medium**.
* While `parseMetadata` and `injectHeader` are straightforward string manipulations, `findDocumentableBlocks` contains non-trivial logic involving line buffering, look-behaves, and specific handling for CSS syntax quirks (like `@keyframes` vs. standard selectors).



### 3. Dependency Graph

* **Internal Dependencies:**
* `../types/index`: Imports `ICodeStrategy`, `CodeFileMetadata`, and `CodeBlock` interfaces.


* **External Dependencies:**
* **None.** The module relies solely on the Node.js/JavaScript standard library (`String`, `RegExp`, `Array`).


* **Coupling Analysis:**
* **Loosely Coupled.** The class has no concrete dependencies on other classes, only on data interfaces. This makes it highly portable and easy to test.



### 4. Data Types & Interfaces

* **Key Interfaces:**
* `ICodeStrategy` (Implements)
* `CodeFileMetadata` (Return object for metadata)
* `CodeBlock` (Return object for structural analysis)


* **Method Return Types:**

| Method | Return Type | Type strictness |
| --- | --- | --- |
| `parseMetadata` | `CodeFileMetadata` | Strict |
| `injectHeader` | `string` | Strict |
| `findDocumentableBlocks` | `CodeBlock[]` | Strict |
| `injectFunctionDoc` | `string` | Strict |

### 5. Functional Logic Specification

#### 5.1 `parseMetadata(content: string): CodeFileMetadata`

* **Logic Flow:**
1. Initializes an empty metadata object.
2. Defines an internal helper `extract(tag)` utilizing Regex `new RegExp('@${tag}\\s*:??\\s*([^@*\\n\\r]+)', 'i')` to capture values after `@tag`. It handles optional colons and trims whitespace.
3. Extracts `@version` and `@author` using the helper.
4. Extracts `@description` using a specific multi-line Regex lookahead to capture text until the next tag or end of comment block.
5. Cleans the description by removing asterisk indentation (`*`).


* **Error Handling:** Returns partial or empty object if tags are missing; does not throw.

#### 5.2 `injectHeader(content: string, headerText: string): string`

* **Logic Flow:**
1. **Charset Preservation:** Scans for `@charset` rule at the very start of the file. If found, it is extracted to be re-appended *after* the header logic to ensure CSS validity.
2. **Formatting:** Formats the input `headerText` into a CSS block comment style (`/* ... */`), ensuring every line starts with `*`.
3. **Cleanup:** Removes any existing top-level block comment at the start of the `content`.
4. **Reassembly:** Returns string in order: `@charset` (if existed) + New Header + Content (trimmed).


* **Side Effects:** None (pure string transformation).

#### 5.3 `findDocumentableBlocks(content: string): CodeBlock[]`

* **Logic Flow:**
1. Splits content by newline.
2. Iterates through lines, buffering content to handle multi-line selectors.
3. **Detection:**
* Triggers when a `{` is detected in the buffer.
* **Keyframe Handling:** If buffer starts with `@keyframes`, it grabs text up to the *first* `{`.
* **Standard Selector:** Grabs text up to the *last* `{` (handling potential spacing issues).


4. **Filtering:**
* Checks if the selector is an "At-Rule" (starts with `@`).
* **Rule:** Ignores At-Rules *unless* they are `@keyframes`.


5. **Doc Detection:** Looks backward from the block start line to see if a comment block (`*/`) immediately precedes it.
6. **Yield:** Pushes a `CodeBlock` object (type: 'variable') to the array.
7. **Reset:** Clears buffer on `{` or `}` detection.



#### 5.4 `injectFunctionDoc(content: string, functionName: string, docBlock: string): string`

* **Logic Flow:**
1. Splits content into lines.
2. **Search:** Finds the line index where the `functionName` matches the CSS selector syntax (checking for `Selector {` with optional whitespace normalization).
3. **Formatting:** Detects indentation of the target line. Wraps `docBlock` in `/* */` if not already present, and applies target indentation.
4. **Injection:** Inserts the formatted doc block immediately before the target line.


* **Edge Case:** If selector is not found, returns original content.

---

## Part 2: Appendix - Testing Reference

### 1. Mocking Strategy

Since `CssStrategy` has **zero external runtime dependencies**, no complex mocking (e.g., `jest.mock`) is required for the strategy itself.

* **Unit Test Approach:** direct instantiation. `const strategy = new CssStrategy();`

### 2. Test Scenarios

#### Group A: Metadata Parsing (`parseMetadata`)

| Scenario | Description | Expected Outcome |
| --- | --- | --- |
| **Happy Path** | Standard Header with Author, Version, Description | All fields populated correctly. |
| **Edge Case** | Description spans multiple lines with `*` prefix | Description is concatenated into a single string; `*` are removed. |
| **Edge Case** | Header uses `:` separators (`@author: Name`) | Regex handles optional colon; extracts name correctly. |
| **Empty State** | File has no comments | Returns empty object `{}`. |

#### Group B: Header Injection (`injectHeader`)

| Scenario | Description | Expected Outcome |
| --- | --- | --- |
| **Happy Path** | Inject header into plain CSS | Header appears at top. |
| **Critical Edge Case** | File contains `@charset "UTF-8";` | **Pass:** `@charset` remains line 1; Header is line 2+. **Fail:** Header is line 1 (CSS breaks). |
| **Replacement** | File already has a header comment | Old header is removed; new header is inserted. |

#### Group C: Block Analysis (`findDocumentableBlocks`)

| Scenario | Description | Expected Outcome |
| --- | --- | --- |
| **Happy Path** | Standard `.class { ... }` | Returns block with `name: '.class'`. |
| **Logic Check** | `@keyframes bounce { ... }` | Returns block with `name: '@keyframes bounce'`. |
| **Logic Check** | `@media screen { ... }` | **Ignored** (starts with `@` and is not keyframes). |
| **Complex Syntax** | Multi-line selector: `.a,\n.b {` | Returns combined selector name. |
| **Documentation** | Selector preceded by `/* doc */` | `hasDoc` property is `true`. |

#### Group D: Doc Injection (`injectFunctionDoc`)

| Scenario | Description | Expected Outcome |
| --- | --- | --- |
| **Happy Path** | Inject doc above `.container` | Doc inserted; previous content shifted down. |
| **Edge Case** | Target selector not found | Content remains unchanged. |
| **Formatting** | Input doc lacks `/* */` wrappers | Wrappers added automatically. |
| **Indentation** | Nested selector `  .child {` | Doc block matches indentation of `.child`. |

### 3. Test Data Requirements

**Input: CSS with Charset (Strict Parsing)**

```css
@charset "UTF-8";
/* Existing Header */
body {
    background: #fff;
}

```

**Input: Complex Selectors**

```css
/*
 * Documentation for header
 */
.header,
.nav-bar {
    display: flex;
}

@keyframes slideIn {
    from { margin-left: 100%; }
    to { margin-left: 0%; }
}

@media (max-width: 600px) {
    .hide-mobile { display: none; }
}

```

**Input: Metadata Block**

```css
/**
 * @version 1.0.0
 * @author Test User
 * @description
 * This is a multi-line
 * description test.
 */

```