### Part 1: Operational & Design Specification

**1. Component Overview**

* **Purpose:** The `CodeService` acts as a "Code Intelligence" engine designed to parse, analyze, and manipulate source code files programmatically. Its primary capabilities include extracting metadata, identifying documentable code blocks (functions, classes), and injecting automated documentation (File Headers and JSDoc).
* **Role in System:** This is a **Service Layer** component. It functions as a middleware between the File System (data persistence) and the LLM Service (generative content), orchestrating the read-modify-write cycle required for automated code documentation tools.

**2. Architecture & Patterns**

* **Design Patterns:**
* **Strategy Pattern:** This is the core architectural pattern. The service defines an interface `ICodeStrategy` and implements specific strategies for different file types: `TypescriptStrategy` (Base) and `VueStrategy` (Composed).
* **Singleton Pattern:** The service is instantiated and exported as a singleton (`export const codeService = new CodeService();`), ensuring a single entry point for code manipulation logic across the application.
* **Composition:** The `VueStrategy` composes an instance of `TypescriptStrategy` to delegate script parsing logic, adding a layer of offset calculation for Vue Single File Components (SFCs).


* **State Management:**
* **Stateless Execution:** The service methods are largely stateless; they operate on the inputs provided (file paths) and do not retain state between method calls.
* **Immutable Configuration:** The `strategies` map is populated in the constructor and remains immutable during the application lifecycle.


* **Complexity Assessment:** **High**.
* *Justification:* While the control flow is straightforward, the implementation relies heavily on **Regular Expressions** to emulate AST (Abstract Syntax Tree) parsing. Regex-based parsing for code is inherently fragile and prone to edge-case failures (e.g., nested braces, complex export syntaxes), making the logic sensitive to syntax variations.



**3. Dependency Graph**

* **Internal Dependencies:**
* `fileService`: Handles I/O operations (reading/writing source files).
* `llmService`: Provides the generative AI capabilities to create JSDoc strings.
* `logger`: Provides standardized logging for success/info states.
* `../types/index`: Source of truth for shared interfaces.


* **External Dependencies:**
* Standard Node.js/Runtime libraries (implied by usage of `RegExp`, `String` manipulation).


* **Coupling Analysis:**
* **Tightly Coupled (Implementation):** The service directly imports specific instances (`fileService`, `llmService`). It does not use Dependency Injection via constructor arguments, making unit testing difficult without module-level mocking/spying.
* **Loosely Coupled (Logic):** The logic is decoupled from file extensions via the `ICodeStrategy` interface, allowing easy addition of new languages (e.g., Python or Java) in the future without modifying the core `inspect` logic.



**4. Data Types & Interfaces**

* **Key Interfaces (Implemented):**
* `ICodeStrategy`: Defines `parseMetadata`, `injectHeader`, `findDocumentableBlocks`, and `injectFunctionDoc`.


* **Return Types:**
* `inspect(filePath: string): CodeBlock[]` - Returns an array of identified code blocks (start/end lines, types, signatures).
* `updateHeader(filePath: string, newHeader: string): void` - Performs side-effects only.
* `generateDocFor(filePath: string, functionName: string): Promise<void>` - Async operation performing side-effects only.



**5. Functional Logic Specification**

**Method: `inspect**`

* **Signature:** `public inspect(filePath: string): CodeBlock[]`
* **Logic Flow:**
1. Reads raw content using `fileService.read`.
2. Resolves the appropriate strategy based on file extension (`.ts`, `.js`, `.vue`).
3. Delegates parsing to `strategy.findDocumentableBlocks`.
4. **Vue Specifics:** If Vue, extracts `<script>`, parses it, and adds the line number offset of the script tag to the results.


* **Error Handling:** Throws `Error` if the file is not found or if the file extension is unsupported.

**Method: `updateHeader**`

* **Signature:** `public updateHeader(filePath: string, newHeader: string): void`
* **Logic Flow:**
1. Reads file content.
2. Resolves strategy.
3. Calls `strategy.injectHeader`.
* *TS Strategy:* Replaces existing top-level JSDoc or prepends new text.
* *Vue Strategy:* Locates `<script setup>` (priority) or `<script>`, reconstructs the tag content with the header injected inside the script block.


4. Writes updated content using `fileService.write`.
5. Logs success.



**Method: `generateDocFor**`

* **Signature:** `public async generateDocFor(filePath: string, functionName: string): Promise<void>`
* **Logic Flow:**
1. Reads file content and resolves strategy.
2. Calls `findDocumentableBlocks` to locate the target function (by name) and retrieve its signature.
3. **LLM Call:** Sends the function signature to `llmService.generate` with a prompt to create JSDoc.
4. **Injection:** Calls `strategy.injectFunctionDoc`.
* Calculates indentation of the target function.
* Matches indentation for the new JSDoc block.
* Splices the comment into the file lines array immediately before the function definition.


5. Writes file and logs success.


* **Side Effects:**
* File System Write.
* Network call (implied by LLM service).


* **Error Handling:** Throws `Error` if `functionName` is not found in the file logic.

---

### Part 2: Appendix - Testing Reference

**1. Mocking Strategy**

To achieve 100% coverage, the following dependencies must be mocked. Since the service uses direct imports, use a library like `jest.mock` or `sinon` to intercept module loading.

* **`fileService`**:
* `read(path)`: Must return varying string templates (Empty, Standard TS, Vue Setup, Vue Standard).
* `write(path, content)`: Spy on this to verify the *content* argument contains the injected strings.


* **`llmService`**:
* `generate(prompt)`: Mock to return a predictable string, e.g., `/** Mock Generated Doc */`.


* **`logger`**:
* `info`, `success`: Spy to ensure correct process flow logging.



**2. Test Scenarios**

| Category | Scenario | Expectation |
| --- | --- | --- |
| **Happy Path** | **Inspect .ts file** | Should identify `export const` and `export function` correctly. |
| **Happy Path** | **Inspect .vue (Script Setup)** | Should identify functions inside `<script setup>` and apply correct line offsets. |
| **Happy Path** | **Generate Doc (TS)** | Should call LLM, receive doc, and inject it *before* the function with matching indentation. |
| **Happy Path** | **Update Header (Vue)** | Should inject header comment *inside* the opening `<script>` tag, not at the top of the `.vue` file. |
| **Edge Case** | **Existing JSDoc (Header)** | `updateHeader` should replace the existing top-level JSDoc block rather than duplicating it. |
| **Edge Case** | **Existing JSDoc (Function)** | `inspect` should mark `hasDoc: true` if a block already has documentation. |
| **Error State** | **Unsupported Extension** | `inspect('test.txt')` should throw `Error: Unsupported file type: .txt`. |
| **Error State** | **File Not Found** | `inspect` or `updateHeader` should throw specific file not found errors. |
| **Error State** | **Function Not Found** | `generateDocFor` should throw if the requested function name does not exist in the AST. |

**3. Test Data Requirements**

* **Sample TS File Content:**
```typescript
/** Existing Header */
import foo from 'bar';
export const myVar = 10;
export function myFunction() { return true; }

```


* **Sample Vue File (Script Setup):**
```vue
<template><div></div></template>
<script setup lang="ts">
import { ref } from 'vue';
export const useLogic = () => { return true; }
</script>

```


* **Sample Vue File (Standard):**
```vue
<script>
export default {
  setup() { return {}; }
}
</script>

```


* **Indentation Test Case:**
```typescript
class MyClass {
    export async function indentedMethod() {
        // logic
    }
}

```


*(Note: The current regex strategy looks for `export` at the start of the match, but allows whitespace. This data ensures the indentation logic in `injectFunctionDoc` works correctly).*