### Part 1: Operational & Design Specification

#### 1. Component Overview

* **Purpose:** The `VueStrategy` class is a specialized parsing utility designed to handle Vue Single File Components (SFCs). Its primary function is to extract the `<script>` or `<script setup>` block from a `.vue` file and manipulate its content (metadata extraction, header injection, JSDoc generation) while preserving the surrounding HTML/template structure.
* **Role in System:** It functions as a **Strategy** within the `app-manager` architecture. It acts as a bridge/adapter, isolating the specific structure of Vue files so the system can apply standard TypeScript logic to the embedded script content without parsing the entire UI template.

#### 2. Architecture & Patterns

* **Design Patterns:**
* **Strategy Pattern:** The class implements `ICodeStrategy`, allowing the application to switch parsing logic dynamically based on file type (specifically for `.vue` files).
* **Composition & Delegation:** The class possesses a private instance of `TypescriptStrategy`. It delegates the actual code analysis (parsing metadata, finding blocks) to this instance, acting effectively as a wrapper or decorator for the TypeScript strategy.


* **State Management:**
* **Stateless:** The class does not maintain state between method calls. The `tsStrategy` property is immutable after instantiation. All methods rely on the `content` string passed as an argument.


* **Complexity Assessment:** **Medium**.
* While the logic delegates complex AST parsing to `TypescriptStrategy`, the `VueStrategy` introduces complexity regarding Regex string matching, content slicing, and crucially, **line number offset calculations**. Incorrect offsets would break documentation pointers.



#### 3. Dependency Graph

* **Internal Dependencies:**
* `../types/index`: Imports `ICodeStrategy`, `CodeFileMetadata`, `CodeBlock`.
* `./typescriptStrategy`: Imports and instantiates `TypescriptStrategy`.


* **External Dependencies:**
* Standard Node.js/JavaScript `RegExp` engine (no external npm packages required for this specific file).


* **Coupling Analysis:**
* **High Coupling:** The class is tightly coupled to `TypescriptStrategy` via direct instantiation (`new TypescriptStrategy()`). This makes unit testing the `VueStrategy` in isolation difficult without mocking the internal dependency construct.



#### 4. Data Types & Interfaces

* **Key Interfaces:**
* `ICodeStrategy` (Implements the contract for code manipulation strategies).


* **Return Types:**
* `extractScript`: `{ text: string; startLine: number; tag: string } | null` (Private helper).
* `parseMetadata(content: string)`: `CodeFileMetadata`.
* `injectHeader(content: string, headerText: string)`: `string`.
* `findDocumentableBlocks(content: string)`: `CodeBlock[]`.
* `injectFunctionDoc(content: string, functionName: string, docBlock: string)`: `string`.



#### 5. Functional Logic Specification

**5.1. Private Helper: `extractScript**`

* **Signature:** `private extractScript(content: string): Object | null`
* **Logic Flow:**
1. Attempts to match `<script setup>` using Regex (Priority 1).
2. If found, calculates `startLine` by counting newlines inside the substring preceding the match. Returns the script body, start line, and full tag.
3. If not found, attempts to match standard `<script>` (Priority 2) and performs the same calculation.
4. Returns `null` if no script tag is found.



**5.2. `parseMetadata**`

* **Signature:** `parseMetadata(content: string): CodeFileMetadata`
* **Logic Flow:**
1. Calls `extractScript`. If `null`, returns empty object `{}`.
2. Delegates the parsing of the script text to `this.tsStrategy.parseMetadata`.


* **Error Handling:** Implicitly relies on `tsStrategy` error handling.

**5.3. `injectHeader**`

* **Signature:** `injectHeader(content: string, headerText: string): string`
* **Logic Flow:**
1. Calls `extractScript`.
2. **Path A (Script found):**
* Delegates injection to `tsStrategy.injectHeader` passing only the script text.
* Re-matches the script tag in the original content (using Regex) to locate the replacement range.
* Replaces the old script block with the new script block (containing the header).


3. **Path B (No script):**
* Prepends `headerText` to the very top of the file content.





**5.4. `findDocumentableBlocks**`

* **Signature:** `findDocumentableBlocks(content: string): CodeBlock[]`
* **Logic Flow:**
1. Calls `extractScript`. Returns empty array `[]` if null.
2. Delegates to `this.tsStrategy.findDocumentableBlocks` to get blocks relative to the script fragment.
3. **Offset Calculation:** Iterates through resulting blocks and adds `script.startLine` to both `startLine` and `endLine` properties. This ensures line numbers map to the actual `.vue` file, not just the isolated script string.



**5.5. `injectFunctionDoc**`

* **Signature:** `injectFunctionDoc(content: string, functionName: string, docBlock: string): string`
* **Logic Flow:**
1. Calls `extractScript`. Returns original `content` if null.
2. Delegates to `this.tsStrategy.injectFunctionDoc` to modify the script text.
3. Re-matches the script tag in the original content.
4. Replaces the old script block with the modified block.



---

### Part 2: Appendix - Testing Reference

#### 1. Mocking Strategy

Because `TypescriptStrategy` is instantiated internally, standard Dependency Injection mocking is not possible.

* **Services to Mock:** `TypescriptStrategy`.
* **Mock Approach:** Use `jest.spyOn(TypescriptStrategy.prototype, 'methodName')` to intercept calls made by the `VueStrategy`.
* **Mock Behavior:**
* **Parse Metadata:** Return a static `CodeFileMetadata` object to verify the Vue strategy passes the extracted string correctly.
* **Find Documentable Blocks:** Return a block with `startLine: 1`. If the Vue script starts on line 10, the test should expect the result to be line 11.
* **Inject Header:** Return a modified string "MOCKED_HEADER + CONTENT" to verify the regex replacement logic in `VueStrategy` works correctly.



#### 2. Test Scenarios

| Scenario ID | Category | Description | Expected Outcome |
| --- | --- | --- | --- |
| **TS-VUE-01** | Happy Path | `<script setup>` exists in file. | Metadata extracted; offsets calculated correctly. |
| **TS-VUE-02** | Happy Path | Standard `<script>` (Legacy) exists. | Metadata extracted; fallback regex works. |
| **TS-VUE-03** | Edge Case | File contains HTML/CSS but **no** `<script>` tag. | `injectHeader` prepends to top of file; other methods return empty/original. |
| **TS-VUE-04** | Edge Case | `<script>` tag has attributes (e.g., `<script lang="ts">`). | Regex matches correctly and attributes are preserved in the replacement. |
| **TS-VUE-05** | Logic | Line Offset Calculation. | `tsStrategy` returns line 5. `extractScript` finds start at line 20. Result should be 25. |
| **TS-VUE-06** | Logic | Header Injection Placement. | Header is placed *inside* the script tag, not before the template. |
| **TS-VUE-07** | Error State | `tsStrategy` throws an exception. | Exception bubbles up (unless handled by wrapper - currently unhandled). |

#### 3. Test Data Requirements

**A. Sample Vue File (Setup API)**

```html
<template>
  <div>Hello</div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
const count = ref(0);
</script>

<style>
div { color: red; }
</style>

```

**B. Sample Vue File (Legacy API)**

```html
<template>
  <h1>Title</h1>
</template>
<script>
export default {
  data() { return { x: 1 } }
}
</script>

```

**C. Expected Block Output (for Offset Test)**

* **Input from TS Strategy:** `{ name: 'count', startLine: 2, endLine: 2 }`
* **Script Start Line in File:** `5` (Example)
* **Expected Result:** `{ name: 'count', startLine: 7, endLine: 7 }`