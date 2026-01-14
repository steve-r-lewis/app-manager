# Technical Specification: HTML Strategy Module

**Project:** `app-manager`
**Component:** `HtmlStrategy`
**Version:** 1.1.0
**Date:** 2026-01-14
**Author:** System Architect (AI)

---

## Part 1: Operational & Design Specification

### 1. Component Overview

* **Purpose:** The `HtmlStrategy` class is a specialized text processing utility designed to parse, analyze, and manipulate HTML source files. Its primary functions are to extract metadata (versioning and authorship) from comments and to standardise file headers.
* **Role in System:** This component acts as a **Strategy Implementation** within the application's file processing layer. It is likely one of several strategies (alongside TypeScript, JSON, etc.) used by a context manager to handle file-type-specific logic.

### 2. Architecture & Patterns

* **Design Patterns:**
* **Strategy Pattern:** The class implements the `ICodeStrategy` interface, allowing the consuming service to switch parsing logic dynamically based on file extension (`.html`) without altering the core workflow.


* **State Management:**
* **Stateless:** The class contains no instance properties. All methods are pure functions that rely solely on their input parameters to produce output.


* **Complexity Assessment:** **Low**
* **Justification:** The logic relies primarily on Regular Expressions for string matching and replacement. There is no complex recursion, asynchronous I/O, or heavy computational logic.



### 3. Dependency Graph

* **Internal Dependencies:**
* `../types/index`: Imports type definitions (`ICodeStrategy`, `CodeFileMetadata`, `CodeBlock`).


* **External Dependencies:**
* **None:** The class utilizes standard JavaScript/TypeScript string and RegExp libraries.


* **Coupling Analysis:**
* **Loosely Coupled:** The component has zero dependencies on concrete classes. It relies strictly on the `ICodeStrategy` interface contract.



### 4. Data Types & Interfaces

* **Key Interfaces:**
* `ICodeStrategy`: The contract this class satisfies.


* **Return Types:**

| Method | Return Type | Notes |
| --- | --- | --- |
| `parseMetadata` | `CodeFileMetadata` | Returns an object containing optional `version` and `author`. |
| `injectHeader` | `string` | Returns the full file content with the header injected/replaced. |
| `findDocumentableBlocks` | `CodeBlock[]` | **Warning:** Returns an empty array (Not implemented for HTML). |
| `injectFunctionDoc` | `string` | **Warning:** Returns input string unmodified (No-op). |

### 5. Functional Logic Specification

#### 5.1 `parseMetadata(content: string): CodeFileMetadata`

* **Logic Flow:**
1. Initialize an empty `metadata` object.
2. Execute a regex search (`//g`) to find the **first** HTML comment block in the content.
3. **Guard Clause:** If no comment is found, return the empty object.
4. Extract the body of the comment (group 1 of the regex match).
5. Scan the comment body for specific tags:
* `@version`: Matches case-insensitive, captures text after the colon until a newline.
* `@author`: Matches case-insensitive, captures text after the colon until a newline.


6. If matches are found, trim whitespace and assign to `metadata.version` and `metadata.author`.
7. Return the `metadata` object.


* **Side Effects:** None.
* **Error Handling:** Returns partial or empty objects if tags/comments are missing. Does not throw errors.

#### 5.2 `injectHeader(content: string, headerText: string): string`

* **Logic Flow:**
1. Format the provided `headerText` into an HTML comment block (``).
2. Check if the file currently starts with an HTML comment using regex `^\s*`. This allows for leading whitespace.
3. **Branch A (Update):** If a top-level comment exists, replace the entire comment block with the new formatted header.
4. **Branch B (Insert):** If no top-level comment exists, prepend the new formatted header followed by two newline characters to the original content.
5. Return the modified content string.


* **Side Effects:** None.
* **Error Handling:** None implicit. Assumes valid string inputs.

#### 5.3 `findDocumentableBlocks(_: string): CodeBlock[]`

* **Logic Flow:** Immediately returns an empty array `[]`.
* **Notes:** HTML logic for identifying "functions" or documentable blocks is currently undefined in this version.

#### 5.4 `injectFunctionDoc(content: string): string`

* **Logic Flow:** Immediately returns the `content` parameter.
* **Notes:** No-op.

---

## Part 2: Appendix - Testing Reference

### 1. Mocking Strategy

* **Services to Mock:** None.
* **Justification:** This class is a **pure unit**. It has no external I/O (filesystem, network) or complex object dependencies. It can be tested entirely by instantiating `new HtmlStrategy()` and passing strings.

### 2. Test Scenarios

#### Group A: `parseMetadata`

| Scenario | Input Description | Expected Outcome |
| --- | --- | --- |
| **Happy Path** | HTML with a standard top-comment containing `@version` and `@author`. | Object: `{ version: "...", author: "..." }` |
| **Partial Data** | HTML comment containing only `@author`. | Object: `{ author: "..." }`. Version is undefined. |
| **Format Variation** | Tags are case-insensitive or have extra spaces (e.g., `@AUTHOR : me`). | Correctly parses due to regex flexibility. |
| **No Comment** | Plain HTML with no comments. | Empty Object `{}`. |
| **Deep Comment** | Comment exists but is not at the top (e.g., inside `<body>`). | The regex finds the *first* comment regardless of position. |
| **Multiline Value** | **Edge Case:** Tag value spans multiple lines. | Regex `[^\n\r]+` will stops at the newline. Only first line is captured. |

#### Group B: `injectHeader`

| Scenario | Input Description | Expected Outcome |
| --- | --- | --- |
| **Happy Path (Insert)** | HTML file without an existing header comment. | Header is prepended with `\n\n`. |
| **Happy Path (Replace)** | HTML file starts with ` . | "Old Header" comment is replaced by new header. Rest of file remains. |
| **False Positive** | File starts with `<!DOCTYPE html>`. | Should **not** be treated as a comment. Header should be prepended. |

#### Group C: `findDocumentableBlocks` & `injectFunctionDoc`

| Scenario | Input Description | Expected Outcome |
| --- | --- | --- |
| **Verification** | Any string input. | `findDocumentableBlocks` returns `[]`. `injectFunctionDoc` returns input string exactly. |

### 3. Test Data Requirements

**Variable: `mockHtmlWithHeader**`

```html
<!DOCTYPE html>
<html>
<body>
    <h1>Hello World</h1>
</body>
</html>

```

**Variable: `mockHtmlClean**`

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <title>Test</title>
</head>
<body>
    <div>Content</div>
</body>
</html>

```

**Variable: `targetHeaderContent**`

```text
@project: new-project
@version: 2.0.0
@author: Admin

```