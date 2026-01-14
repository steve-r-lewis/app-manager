# Technical Specification – Scanner Types & Interfaces

**File:** `~/app/types/index.ts` (inferred)
**Language:** TypeScript
**Scope:** Core shared types for all scanners

---

## Part 1: Component Overview

**Purpose:**

* Provide **strongly-typed interfaces and token definitions** for all scanner modules.
* Ensure **consistency of token types, location tracking, and semantic categorization** across HTML, Vue, TypeScript, CSS, and JSON scanners.
* Serve as the **canonical source of truth** for token structure in the scanning/tokenization layer.

**Role in System:**

* Shared type layer between all scanner implementations
* Enables **strict typing, IntelliSense, and validation** in TypeScript for the scanning subsystem
* Facilitates **interoperability** between scanners and strategy layers (HtmlStrategy, VueStrategy, TypescriptStrategy, CssStrategy, JsonStrategy)

---

## Part 2: Core Interfaces

### 2.1 `SourceLocation`

**Definition:**

```ts
interface SourceLocation {
    line: number;   // 1-based line number
    column: number; // 1-based column number
    index: number;  // absolute index in source string
}
```

**Description:**

* Tracks the exact position of a token in the source text
* Used by all scanners for both **start** and **end** of tokens
* Enables **editor features** like highlighting, error reporting, and diffing

**Usage:**

* `start: SourceLocation` and `end: SourceLocation` in all tokens
* Used in **`getCurrentLocation()`** and token creation methods

---

### 2.2 `Token<TTokenType>`

**Definition:**

```ts
interface Token<TTokenType> {
    type: TTokenType;      // Token type (specific to scanner)
    value: string;         // Literal value from source
    start: SourceLocation; // Start location in source
    end: SourceLocation;   // End location in source
}
```

**Description:**

* Generic container for a scanned token
* **Type parameter `TTokenType`** allows scanner-specific token typing
* All scanners produce `Token<T>` arrays as output

**Notes:**

* `start` and `end` are always captured relative to the **source string**
* Ensures **full traceability** from token stream back to original source

---

### 2.3 `SfcBlock` (Specific to VueScanner)

**Definition:**

```ts
interface SfcBlock {
    type: 'script' | 'template' | 'style';
    content: string;                        // Full block content
    start: number;                           // Start index of content
    end: number;                             // End index of content
    tagStart: number;                        // Start index of opening tag
    tagEnd: number;                          // End index of opening tag
    attributes: Record<string, string | boolean>; // Attributes on the tag
    loc: { start: SourceLocation; end: SourceLocation }; // Source positions
}
```

**Description:**

* Represents **high-level root blocks** in Vue SFCs
* Enables **delegation** to other scanners (TS, CSS, HTML) on sub-content
* Captures **attributes** like `setup`, `lang`, or `scoped`
* Ensures **accurate source mapping** for editor tooling or transformations

---

### 2.4 Token Type Enums

Each scanner defines its own set of token types (`TTokenType`) to ensure semantic clarity.

**2.4.1 `HtmlTokenType`**

```ts
type HtmlTokenType =
    'TagOpen' | 'TagClose' | 'TagSelfClose' | 'TagEnd' |
    'AttributeName' | 'AttributeValue' |
    'Text' | 'Comment' | 'Doctype';
```

**2.4.2 `TsTokenType`**

```ts
type TsTokenType =
    'Keyword' | 'Identifier' | 'Operator' | 'BlockStart' | 'BlockEnd' |
    'Punctuation' | 'String' | 'Regex' | 'Comment' | 'Unknown';
```

**2.4.3 `CssTokenType`**

```ts
type CssTokenType =
    'BlockStart' | 'BlockEnd' | 'AtKeyword' | 'Identifier' | 'Function' |
    'String' | 'Comment' | 'Colon' | 'Semicolon' | 'Comma' | 'Parenthesis' |
    'Operator' | 'Unknown';
```

**2.4.4 `JsonTokenType`**

```ts
type JsonTokenType =
    'BraceOpen' | 'BraceClose' | 'BracketOpen' | 'BracketClose' |
    'Colon' | 'Comma' | 'String' | 'Number' | 'Boolean' | 'Null' |
    'Comment' | 'Unknown';
```

**Notes:**

* Strong typing ensures **compile-time correctness** for parser/strategy layers
* Each scanner has **distinct token type space** but same token structure (`Token<T>`)

---

### 2.5 Record Types & Attributes

* **`Record<string, string | boolean>`** used in `SfcBlock.attributes`
* Supports boolean attributes (`scoped`) and string attributes (`lang="ts"`)

---

### 2.6 Integrated View of Tokens Across Scanners

| Scanner           | Token Type Interface            | Key Tokens                                      |
| ----------------- | ------------------------------- | ----------------------------------------------- |
| BaseScanner       | Generic `Token<T>`              | N/A (abstract)                                  |
| HtmlScanner       | `HtmlTokenType`                 | `TagOpen`, `Text`, `Comment`                    |
| VueScanner        | `SfcBlock` + Html/TS/CSS tokens | Root blocks `<script>`, `<style>`, `<template>` |
| TypescriptScanner | `TsTokenType`                   | `BlockStart`, `Operator`, `Regex`, `Keyword`    |
| CssScanner        | `CssTokenType`                  | `BlockStart`, `Identifier`, `Function`          |
| JsonScanner       | `JsonTokenType`                 | `BraceOpen`, `Number`, `Boolean`, `Comment`     |

---

### 2.7 Location & Position Tracking Rules

* All scanners maintain **line/column/index** state via `BaseScanner`
* Tokens always capture **start and end locations**
* Supports multi-line tokens: strings, block comments, and multi-line text blocks

---

### 2.8 Design Patterns for Types

* **Generic Tokens (`Token<TTokenType>`)** → **Template Pattern**
* **SfcBlock** → **Composite Pattern** for block content + nested scanner delegation
* **Enum / Union Types** → Ensures **strict type safety** across scanner streams

---

### 2.9 Error Handling

* All scanners tokenize invalid or unexpected input as `Unknown`
* Location tracking ensures **precise diagnostics** even for invalid content

---

## Part 3: Integration & Usage Notes

**Scanner → Type Flow:**

```
Raw Source
   ↓
BaseScanner (cursor, line/column)
   ↓
Scanner (Html, Vue, TS, CSS, JSON)
   ↓
Token<TTokenType>[] / SfcBlock[]
   ↓
Strategy Layer (Syntax Tree, Formatting, Editor Operations)
```

**Advantages of Integrated Typing:**

* Single source of truth for **token shape and location**
* Facilitates **cross-scanner interoperability**
* Ensures **consistent error reporting** across file types

---

### Part 4: Testing Reference for Types

* All tokens must be **verified for correct type, value, start, end**
* `SfcBlock.attributes` must correctly reflect **boolean and string values**
* Integration tests should check **cross-scanner token flows**:

| Scenario     | Expectation                                                                       |
| ------------ | --------------------------------------------------------------------------------- |
| Vue SFC      | `SfcBlock` contains accurate `start/end`, `type`, `attributes`, and nested tokens |
| JSONC        | `Comment` token recognized and preserves location                                 |
| TS Regex     | `Regex` token captured and last significant token logic applies                   |
| CSS Function | `Function` token correctly includes parentheses                                   |

---

**Conclusion:**

The types/interfaces document provides a **robust, consistent, and strongly-typed foundation** for all scanner modules. It ensures **interoperability** across language scanners and Vue SFC parsing, supports **full location tracking**, and allows strategies to operate on **fully annotated token streams**.

---



