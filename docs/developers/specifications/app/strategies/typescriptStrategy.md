# Technical Specification: TypescriptStrategy

## Part 1: Operational & Design Specification

### 1. Component Overview

* **Purpose:** This component parses, analyzes, and manipulates string content representing TypeScript or JavaScript source code. It is responsible for extracting metadata (version/author), managing file headers (copyright/licenses), and identifying or injecting documentation into code blocks.
* **Role in System:**
* **Strategy Layer:** It functions as a concrete implementation of a Strategy pattern, specifically designed to handle `.ts` and `.js` syntax nuances.
* **Utility/Parser:** It acts as a text processing engine that sits between the file system reading layer and the documentation generation logic.



### 2. Architecture & Patterns

* **Design Patterns:**
* **Strategy Pattern:** The class `TypescriptStrategy` implements the `ICodeStrategy` interface, allowing the application to swap parsing logic based on file type.
* **Stateless Component:** The class does not maintain instance properties or internal state between method calls. All methods operate purely on the input parameters provided.


* **Complexity Assessment:** **Medium**.
* While the control flow is primarily linear, the logic relies heavily on Regular Expressions (`RegExp`) for parsing syntax. This introduces "hidden" complexity regarding edge cases in string matching (e.g., whitespace variations, indentation, and distinct export patterns).



### 3. Dependency Graph

* **Internal Dependencies:**
* `../types/index`: Imports `ICodeStrategy`, `CodeFileMetadata`, `CodeBlock`, and `CodeBlockType` interfaces.


* **External Dependencies:**
* **None:** The module relies solely on the standard Node.js/JavaScript runtime (specifically `String` and `RegExp` prototypes). It has zero 3rd-party runtime dependencies.


* **Coupling Analysis:** **Loosely Coupled**. The class is decoupled from the file system (it accepts string content, not file paths) and logic is encapsulated behind the `ICodeStrategy` interface.

### 4. Data Types & Interfaces

* **Key Interfaces Used:**
* `ICodeStrategy`: The contract this class satisfies.
* `CodeBlock`: Represents a unit of code (function/class) to be documented.
* `CodeBlockType`: Union type literal `'function' | 'method' | 'class' | 'interface' | 'variable' | 'const'`.


* **Public Method Signatures & Return Types:**
* `parseMetadata(content: string)`: Returns `{ version?: string; author?: string }`.
* `injectHeader(content: string, header: string)`: Returns `string`.
* `findDocumentableBlocks(content: string)`: Returns `CodeBlock[]`.
* `injectFunctionDoc(content: string, functionName: string, docBlock: string)`: Returns `string`.



### 5. Functional Logic Specification

#### 5.1 `parseMetadata`

* **Signature:** `parseMetadata(content: string): { version?: string; author?: string }`
* **Logic Flow:**
1. Initializes an empty metadata object.
2. Executes a Regex match for `@version` followed by optional colons and whitespace, capturing the subsequent non-whitespace characters.
3. Executes a Regex match for `@author` followed by optional colons, capturing the rest of the line (trimmed).
4. Returns the populated object.


* **Error Handling:** Safe execution; returns an empty object if regex matches fail.

#### 5.2 `injectHeader`

* **Signature:** `injectHeader(content: string, header: string): string`
* **Logic Flow:**
1. **Shebang Detection:** Checks if content starts with `#!`. If true, extracts the first line (Shebang) and separates it from the rest of the content to preserve executability.
2. **Strip Existing Header:** Uses Regex `^\s*\/\*\*[\s\S]*?\*\/\s*` to locate and remove any existing top-level JSDoc block at the start of the (post-Shebang) content.
3. **Reconstruction:** Concatenates `Shebang` + `New Header` + `\n\n` + `Trimmed Content`.


* **Edge Cases:** Handles files with *only* a Shebang, or files with no existing header.

#### 5.3 `findDocumentableBlocks`

* **Signature:** `findDocumentableBlocks(content: string): CodeBlock[]`
* **Logic Flow:**
1. Splits content by newline `\n`.
2. Uses a global Regex loop to find `export` statements involving `default`, `async`, `const`, `function`, `class`, or `interface`.
3. **Normalization:** Converts found type `const` to `variable` for internal consistency.
4. **Doc Check:** loops backwards from the definition line to check if the immediately preceding non-empty line ends with `*/`, indicating existing documentation.
5. **Validation:** Validates the type using the `isCodeBlockType` type guard before adding to the results array.


* **Return:** An array of `CodeBlock` objects containing name, type, start line, signature, and documentation status.

#### 5.4 `injectFunctionDoc`

* **Signature:** `injectFunctionDoc(content: string, functionName: string, docBlock: string): string`
* **Logic Flow:**
1. Splits content by newline.
2. Finds the target line index using a Regex that looks for the specific `export ... functionName` pattern.
3. **Indentation Matching:** Extracts leading whitespace from the target code line.
4. **Formatting:** Applies the extracted indentation to every line of the incoming `docBlock`.
5. **Injection:** Slices the array to insert the formatted doc block *before* the target line.
6. Joins the array back into a single string.


* **Error Handling:** Returns the original content unmodified if the `functionName` is not found.

---

## Part 2: Appendix - Testing Reference

### 1. Mocking Strategy

As this is a pure logic class dealing with string manipulation, **no external service mocks** are required. The strategy relies on **Test Data Fixtures** (string inputs).

* **Internal Helpers:** The helper function `isCodeBlockType` is not exported, so it must be tested implicitly via `findDocumentableBlocks`.

### 2. Test Scenarios

| Category | ID | Scenario | Input Description | Expected Outcome |
| --- | --- | --- | --- | --- |
| **Happy Path** | HP-01 | Parse standard Metadata | String with `/** @version 1.0 @author Me */` | Returns `{ version: '1.0', author: 'Me' }`. |
|  | HP-02 | Inject Header (Clean) | Code with no header. | Header prepended followed by one blank line. |
|  | HP-03 | Find Exports | String with `export function test() {}` | Returns 1 `CodeBlock` of type 'function'. |
| **Edge Cases** | EC-01 | Shebang Preservation | String starting with `#!/usr/bin/env node` | Header inserted *after* Shebang line. |
|  | EC-02 | Whitespace Metadata | `@version   1.0 ` (messy spaces) | Version extracted correctly as `1.0`. |
|  | EC-03 | Replace Header | Code with existing JSDoc header. | Old header removed, new header inserted. |
|  | EC-04 | Async/Default Exports | `export default async function foo()` | Regex correctly identifies `foo` and ignores modifiers. |
| **Error States** | ES-01 | Target Not Found | `injectFunctionDoc` for non-existent func. | Returns original content exactly. |
|  | ES-02 | Malformed Export | `export function ()` (no name). | Regex should not match; returns empty block list. |

### 3. Test Data Requirements

**Fixture A: Shebang File (`shebang.ts`)**

```typescript
#!/usr/bin/env node
console.log('Hello');

```

**Fixture B: Complex Exports (`complex.ts`)**

```typescript
/** Existing Doc */
export const myVar = 10;
export async function run() {}
export default class Runner {}
export interface IConfig {}

```

**Fixture C: Indented Code (`indented.ts`)**

```typescript
namespace Core {
    export function inner() {
        return true;
    }
}

```

*(Note: Current Regex implementation in `injectFunctionDoc` may fail on indented exports if the regex anchors to start of line or doesn't account for leading whitespace in the search pattern. This requires specific verification testing).*

### 4. Code Quality & Refactoring Opportunities (Audit Findings)

* **Regex Fragility:** The `injectFunctionDoc` uses `new RegExp(...)`. If `functionName` contains special regex characters, it will crash. *Recommendation:* Escape `functionName` before creating RegExp.
* **Regex Performance:** `findDocumentableBlocks` creates a new split array `content.substring(0, index).split('\n')` inside a loop. For large files, this is  performance. *Recommendation:* Calculate line numbers by counting newlines incrementally.
* **Indentation Logic:** `injectHeader` performs `finalContent.trimStart()`. If the file was intentionally indented at the top (rare but possible), this formatting is lost.

---

