# AppManager – Scanner Suite & Type System Master Specification

## 1. Overview

The **AppManager** application provides comprehensive tooling to **manage multi-language projects**, including **Nuxt 4 monorepo structures with layers**. Central to its functionality is the **Scanner Suite**, which delivers **language-agnostic and language-specific tokenization**, enabling structured analysis, strategy-driven transformations, and LLM-assisted review.

### Core Purpose of Scanner Services

* Convert **raw source files** (TypeScript/JavaScript, HTML, Vue SFCs, CSS/SCSS, JSON/JSONC) into structured **token streams** or **SFC blocks**.
* Enable **robust structural and semantic analysis** through tokenized representations.
* Serve as **engines for strategy-based transformations** and **LLM-assisted code review**.
* Operate **downstream of FileService** and provide outputs **upstream to StrategyService**.
* Work in parallel with **LLMService** for enrichment and automated metadata management.
* Invoked by **command-level tools**, which orchestrate workflow execution.
* **Independent of TemplateService**, which handles scaffolding and file creation without relying on scanners.

### Key Services in AppManager

| Service              | Role                                                                                                           |
| -------------------- | -------------------------------------------------------------------------------------------------------------- |
| **FileService**      | Performs all raw file I/O (read/write). Stateless.                                                             |
| **Scanner Services** | Tokenize source files. Stateless per invocation. Provide structured token streams for strategy services.       |
| **StrategyService**  | Implements transformations, editing, and code maintenance logic. Consumes token streams from Scanner Services. |
| **TemplateService**  | Provides file scaffolding and templating. Independent; not driven by Scanner Services.                         |
| **LLMService**       | Integrates with a Large Language Model to review code, generate documentation, and maintain metadata headers.  |
| **Command Tools**    | Orchestrate actions by invoking the above services based on user input or CLI commands.                        |

### Typical Workflow

```text
[Command Tool / Action]
          │
          ├─> FileService → read source files
          │
          ├─> Scanner Services → produce token streams or SFC blocks
          │
          ├─> StrategyService → perform structured edits, refactorings
          │
          ├─> LLMService → optionally review, comment, and enrich metadata
          │
          └─> TemplateService → scaffold or create new files (independent)
```

*Scanners are stateless from an orchestration perspective; command tools handle flow management.*

---

## 2. Type System

### 2.1 Barrel Loader (`~/app/types/index.ts`)

The **Type Aggregator** centralizes type exports for AppManager:

* **Domains:**

  * **Infrastructure:** `baseCommandTypes`, `codeServiceTypes`, `fileServiceTypes`, `processTypes`, `utilsTypes`, `scannerTypes`
  * **Core:** `configTypes`, `loggerServiceTypes`
  * **Feature:** `githubTypes`, `gitTypes`, `llmTypes`, `nuxtTypes`
  * **Template Engine:** `templateTypes`

* **Benefits:**

  * Centralized import path for all services.
  * Maintains strong TypeScript typing across domains.
  * Separates domains for maintainability.
  * Decouples consumers from module path changes.

### 2.2 Scanner Types (`scannerTypes.ts`)

Defines all types/interfaces used by the Scanner Suite:

* **Token Types:** Language-specific (`HtmlTokenType`, `TsTokenType`, `CssTokenType`, `JsonTokenType`)
* **Core Interfaces:**

```ts
interface Token<T = string> {
  type: T;
  value: string;
  start: SourceLocation;
  end: SourceLocation;
}

interface SourceLocation {
  line: number;
  column: number;
  index: number;
}

interface SfcBlock {
  type: 'script' | 'template' | 'style' | 'custom';
  content: string;
  start: number;
  end: number;
  tagStart: number;
  tagEnd: number;
  attributes: Record<string, string | boolean>;
  loc: { start: SourceLocation; end: SourceLocation };
}
```

* **Return Types:**

  * `scan(): Token<TType>[]` — Returns typed tokens.
  * `scanSfcBlocks(): SfcBlock[]` — VueScanner returns structured SFC blocks with attributes.

* **Notes:**

  * `TType` is strongly typed per language.
  * Token end locations use `BaseScanner.getCurrentLocation()`.

---

## 3. Scanner Suite Architecture

### 3.1 Design Patterns

* **Strategy Pattern (implicit):** Concrete scanners (`TypescriptScanner`, `HtmlScanner`, `VueScanner`, `CssScanner`, `JsonScanner`) implement language-specific parsing via `BaseScanner`.
* **Template Method Pattern:** `BaseScanner` defines traversal and cursor logic; concrete scanners implement `scan()`.
* **Stateful Iteration:** Scanners track **line, column, and index** for precise source mapping.
* **Token Stream Pipeline:** All scanners produce **linear, strongly typed token streams** suitable for downstream processing.

### 3.2 State Management

* **BaseScanner:** Tracks cursor (`index`, `line`, `column`) and source string.
* **Concrete Scanners:** Track contextual parsing state (e.g., raw text mode in HTML/Vue, regex detection in TypeScript).
* **System-level orchestration:** Stateless; scanners act as engines invoked per file.

### 3.3 Complexity Assessment

| Scanner             | Complexity | Justification                                                                        |
| ------------------- | ---------- | ------------------------------------------------------------------------------------ |
| `BaseScanner`       | Low        | Linear traversal and utility functions.                                              |
| `HtmlScanner`       | Medium     | Multiple modes (Data, Raw Text), token differentiation (tags, attributes, comments). |
| `VueScanner`        | Medium     | Leverages HtmlScanner, parses SFC blocks, handles attributes.                        |
| `TypescriptScanner` | High       | Regex detection, string/comment handling, operator/keyword classification.           |
| `CssScanner`        | Medium     | Nested blocks, at-rules, functions, string/comment parsing.                          |
| `JsonScanner`       | Medium     | Handles JSON/JSONC, including comments, numbers, strings, booleans.                  |

### 3.4 Dependency Graph

#### Internal Dependencies

* `scannerTypes.ts` — token types and interfaces.
* `baseScanner.ts` — traversal, cursor state, helper functions.

#### Concrete Scanners

| File                   | Extends / Uses                |
| ---------------------- | ----------------------------- |
| `vueScanner.ts`        | `HtmlScanner` → `BaseScanner` |
| `htmlScanner.ts`       | `BaseScanner`                 |
| `typescriptScanner.ts` | `BaseScanner`                 |
| `cssScanner.ts`        | `BaseScanner`                 |
| `jsonScanner.ts`       | `BaseScanner`                 |

#### External Dependencies

* None; all scanners rely on built-in TypeScript/JavaScript.

#### Coupling Analysis

* **Loosely coupled system-level:** Only depends on `BaseScanner` and types.
* **Moderate internal coupling:** Concrete scanners rely on `BaseScanner`.
* **Independent** from `FileService`, `StrategyService`, `TemplateService`, and `LLMService`.

---

## 4. Concrete Scanners

### 4.1 BaseScanner (`baseScanner.ts`)

* **Responsibilities:**

  * Cursor management (`index`, `line`, `column`).
  * Source slicing (`slice()`), lookahead (`peek()`), advancement (`advance()`), checks (`check()`, `match()`).
  * Location reporting (`getCurrentLocation()`).
  * Whitespace skipping.

* **Error Handling:** Minimal; concrete scanners handle language-specific validation.

### 4.2 HTML Scanner (`htmlScanner.ts`)

* **Tokens:** `TagOpen`, `TagClose`, `TagSelfClose`, `TagName`, `AttributeName`, `AttributeValue`, `Text`, `Comment`, `Doctype`.
* **Modes:** Data (default) and Raw Text (`script`, `style`, `textarea`, `title`).
* **Logic:** Character-by-character scanning, differentiates tags from text, handles comments and raw text.

### 4.3 Vue Scanner (`vueScanner.ts`)

* **Extends:** `HtmlScanner`.

* **Functionality:** Extracts **SFC blocks** (`<script>`, `<template>`, `<style>`, `<custom>`).

* **Attributes:** Parses boolean, quoted, and unquoted attributes.

* **Delegation:**

  * `<script>` → `TypescriptScanner`
  * `<template>` → `HtmlScanner`
  * `<style>` → `CssScanner`

* **Return:** `SfcBlock[]` with full content, indices, and locations.

### 4.4 TypeScript Scanner (`typescriptScanner.ts`)

* **Tokens:** Keyword, Identifier, String, Regex, Comment, Operator, Punctuation, BlockStart/End, Whitespace, Unknown.
* **Logic Flow:**

  * Detects strings (`'`, `"`, `` ` ``) and comments (`//`, `/* */`).
  * Context-aware regex detection (`isRegexStart()` + `scanRegex()`).
  * Sequential parsing of operators, keywords, identifiers.
* **Side Effects:** None; pure tokenization.
* **Edge Cases:** Regex inside block braces, multi-character operators, template literals.

### 4.5 CSS Scanner (`cssScanner.ts`)

* **Tokens:** AtKeyword, BlockStart/End, Identifier, String, Comment, Colon, Semicolon, Comma, Function, Parenthesis, Operator, Whitespace, Unknown.
* **Logic:** Handles nested blocks, at-rules (`@media`, `@import`), strings, comments, function calls (`url()`, `var()`).

### 4.6 JSON Scanner (`jsonScanner.ts`)

* **Tokens:** BraceOpen/Close, BracketOpen/Close, Colon, Comma, String, Number, Boolean, Null, Comment, Whitespace, Unknown.
* **Logic:** Handles JSONC comments, numbers (integers, decimals, exponents), strings with escapes, keywords (`true`, `false`, `null`).

---

## 5. Scanner Suite Interfaces & Contracts

* **Input:** Source string from `FileService`.

* **Output:** Array of `Token<TTokenType>` or `SfcBlock[]`.

* **Responsibilities:**

  * Tokenize all language constructs fully.
  * Maintain accurate **line, column, and index tracking**.
  * Respect content integrity (handle escaped characters, raw text, multi-line strings).

* **Constraints:**

  * Must **not perform transformations**.
  * Stateless beyond cursor/location tracking.
  * Each scan is **isolated** per file invocation.

---

## 6. Integration with AppManager Services

| Service              | Interaction with Scanner Suite                                                                             |
| -------------------- | ---------------------------------------------------------------------------------------------------------- |
| **FileService**      | Reads file content → passes raw string to scanners.                                                        |
| **Scanner Services** | Consumes raw content → produces token streams. Stateless per scan.                                         |
| **StrategyService**  | Consumes token streams to analyze, refactor, or transform code.                                            |
| **TemplateService**  | Independent; provides scaffolding and file creation.                                                       |
| **LLMService**       | Optionally consumes token streams and file content for code review, metadata enrichment, or documentation. |

### Conceptual Orchestration Flow

```text
[FileService]  -> reads file content
     |
     v
[Scanner Services] -> tokenizes content
     |
     v
[StrategyService] -> edits / refactors / maintains project code
     |
     v
[LLMService] -> analyzes and enriches metadata / generates comments
```

*Note: TemplateService operates independently from scanning.*

---

## 7. Key Design Principles

1. **Separation of Concerns**

   * Scanners tokenize; strategy services transform; template services scaffold.

2. **Domain-Driven Type System**

   * Strongly typed token streams via centralized `scannerTypes.ts`.
   * Type barrel `index.ts` ensures single source of truth.

3. **Extensibility**

   * New language scanners extend `BaseScanner<T>` and implement `scan()`.
   * Integrates seamlessly with StrategyService for new language rules.

4. **Testability**

   * Each scanner is fully testable in isolation.
   * Tokens can be validated for structure, attributes, and positions.

5. **Consistency**

   * Unified line, column, and index tracking across all scanners.
   * Vue SFC blocks maintain start/end indices and location objects for precise referencing.

---

## 8. Recommendations & Future Enhancements

* **Add Linting/Validation tokens** to detect code errors early during scanning.
* **Extend JSON scanner** to support YAML for configuration-heavy projects.
* **Integrate LLMService hooks** at scanning stage for semantic token enrichment.
* **Add SCSS/Less-specific tokens** for improved CSS strategy operations.
* **Provide scan metrics**: token count, types, duration for performance monitoring.
* **Support new languages** by extending BaseScanner and defining token unions in `scannerTypes.ts`.

---