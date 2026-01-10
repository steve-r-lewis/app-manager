Here is the comprehensive Technical Specification and Test Strategy based on the analysis of the provided source code.

### Part 1: Operational & Design Specification

#### 1. Component Overview

* **Purpose:** The `codeService` module is designed to automate code introspection and documentation management. It provides capabilities to parse source code files (TypeScript, JavaScript, and Vue), extract metadata, manage file headers, and generate JSDoc comments using an LLM integration.
* **Role in System:** This component acts as a **Tooling/Utility Service**. It bridges the gap between raw file storage (`fileService`) and AI generation capabilities (`llmService`) to perform structural code modifications.

#### 2. Architecture & Patterns

* **Design Patterns:**
* **Strategy Pattern:** The service utilizes the Strategy pattern to handle different file types. It defines an `ICodeStrategy` interface and implements concrete strategies: `TypescriptStrategy` and `VueStrategy`.
* **Singleton Pattern:** The class `CodeService` is instantiated immediately upon export (`export const codeService = new CodeService();`), ensuring a single instance manages the strategy registry.
* **Composition:** The `VueStrategy` composes an instance of `TypescriptStrategy` to delegate parsing logic after extracting script content.


* **State Management:**
* **Quasi-Stateless:** The service maintains a `strategies` Map initialized in the constructor. It does not maintain state regarding the files being processed between method calls; each method call is an independent transaction requiring a file path.


* **Complexity Assessment:** **Medium**.
* While the control flow is straightforward, the complexity arises from the **Regular Expression (Regex)** logic used to identify code blocks, manage indentation, and parse Vue SFC (Single File Component) structures.
* **Architectural Note:** There is a logic leak in `updateHeader`. While parsing is delegated to strategies, the logic to update headers for Vue files is hardcoded within the main `CodeService` class rather than being delegated to the `VueStrategy`, breaking the encapsulation of the Strategy pattern.



#### 3. Dependency Graph

* **Internal Dependencies:**
* `fileService`: Handles physical I/O (read/write operations).
* `llmService`: Provides the interface for generating documentation via AI.
* `logger`: Provides logging capabilities.


* **External Dependencies:**
* No direct third-party imports are listed in the file headers. It relies on standard Node.js/JavaScript runtime features (Regex, String manipulation).


* **Coupling Analysis:**
* **Tight Coupling:** The service directly imports instances of `fileService`, `llmService`, and `logger`. This makes unit testing difficult without module-level mocking/spying, as dependencies are not injected via the constructor.



#### 4. Data Types & Interfaces

* **Key Interfaces (Implemented):**
* `ICodeStrategy`: Defines the contract for parsing metadata, updating metadata, finding blocks, and injecting docs.


* **Return Types:**
* `inspect(filePath: string): CodeBlock[]`.
* `updateHeader(filePath: string, newHeader: string): void`.
* `generateDocFor(filePath: string, functionName: string): Promise<void>`.


* **Type Warnings:**
* In `TypescriptStrategy.findDocumentableBlocks`, the `type` property is cast as `any` (`type: match[2] as any`), which bypasses strict type safety.



#### 5. Functional Logic Specification

**Method: `inspect**`

* **Signature:** `inspect(filePath: string): CodeBlock[]`
* **Logic Flow:**
1. Reads file content using `fileService.read`. Throws Error if file is null.
2. Resolves strategy based on file extension (`.ts`, `.js`, or `.vue`) via `getStrategy`.
3. Calls `strategy.findDocumentableBlocks(content)` to return an array of code blocks.


* **Error Handling:** Throws "File not found" or "Unsupported file type" errors.

**Method: `updateHeader**`

* **Signature:** `updateHeader(filePath: string, newHeader: string): void`
* **Logic Flow:**
1. Reads file content.
2. **Conditional Logic (Vue vs. TS/JS):**
* **If Vue:** Searches for `<script setup>` or `<script>`. If found, checks if body starts with `/**`. Replaces existing JSDoc or prepends the new header to the script body. If no script tag, prepends to file.
* **If TS/JS:** Checks if file starts with `/**`. Replaces existing JSDoc block or prepends new header + newlines.


3. Writes updated content via `fileService.write`.
4. Logs success.


* **Side Effects:** Modifies file content on disk.

**Method: `generateDocFor**`

* **Signature:** `generateDocFor(filePath: string, functionName: string): Promise<void>`
* **Logic Flow:**
1. Reads file content.
2. Uses `strategy.findDocumentableBlocks` to locate the block matching `functionName`.
3. **Constraint:** If `target` is not found, throws Error `Function '${functionName}' not found`.
4. Constructs a prompt: `Generate a JSDoc comment for this code:\n${target.signature}`.
5. Awaits `llmService.generate(prompt)`.
6. Calls `strategy.injectFunctionDoc` to merge the generated doc into the content.
7. Writes the new content to disk.


* **Side Effects:** API call to LLM, file write operation.

---

### Part 2: Appendix - Testing Reference

#### 1. Mocking Strategy

To test `CodeService` in isolation, the following dependencies must be intercepted.

| Service | Method | Mock Behaviour | Purpose |
| --- | --- | --- | --- |
| **fileService** | `read` | Return string content | Simulate existing source files. |
| **fileService** | `read` | Return `null` | Test "File not found" error handling. |
| **fileService** | `write` | `jest.fn()` (Spy) | Verify that the correct updated content is written to disk. |
| **llmService** | `generate` | Return string (JSDoc) | Simulate AI response without making network calls. |
| **logger** | `info/success` | No-op / Spy | Prevent console clutter and verify operation steps. |

#### 2. Test Scenarios

**Group A: File Inspection (`inspect`)**

| ID | Scenario | Input | Expected Outcome |
| --- | --- | --- | --- |
| A1 | **Happy Path TS** | `.ts` file with 1 function | Return 1 `CodeBlock` with correct line numbers. |
| A2 | **Happy Path Vue** | `.vue` with `<script setup>` | Return `CodeBlock` with line numbers offset by script tag position. |
| A3 | **Doc Detection** | Function with `*/` above it | `CodeBlock.hasDoc` should be `true`. |
| A4 | **Unsupported** | `.css` file | Throw Error: "Unsupported file type". |
| A5 | **Missing File** | Non-existent path | Throw Error: "File not found". |

**Group B: Header Management (`updateHeader`)**

| ID | Scenario | Input | Expected Outcome |
| --- | --- | --- | --- |
| B1 | **New Header TS** | TS file (no header) | Header string prepended to top of file. |
| B2 | **Replace Header TS** | TS file (existing header) | Old header removed, new header inserted. |
| B3 | **Update Vue Setup** | Vue file `<script setup>` | Header inserted *inside* the script tag, not at file top. |
| B4 | **Update Vue Legacy** | Vue file `<script>` | Header inserted inside legacy script tag. |

**Group C: Doc Generation (`generateDocFor`)**

| ID | Scenario | Input | Expected Outcome |
| --- | --- | --- | --- |
| C1 | **Happy Path** | Valid function name | `llmService` called; `fileService.write` called with injected JSDoc. |
| C2 | **Indentation** | Function indented 2 tabs | Injected JSDoc respects 2 tab indentation. |
| C3 | **Missing Func** | Invalid function name | Throw Error: "Function ... not found". |
| C4 | **LLM Failure** | `llmService` throws | Propagate error, no file write. |

#### 3. Test Data Requirements

**Data 1: Simple TypeScript File**

```typescript
export const simpleTsContent = `
export function calculate(a: number, b: number) {
    return a + b;
}
`;

```

**Data 2: Vue Component (Script Setup)**

```typescript
export const vueSetupContent = `
<template>
  <div>Hello</div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

export const count = ref(0);

export function increment() {
  count.value++;
}
</script>
`;

```

**Data 3: Complex Class (Regex Torture Test)**

```typescript
export const complexClassContent = `
export default class UserManager {
    /**
     * Existing doc
     */
    public async findUser(id: string) {
        return true;
    }
}
`;

```