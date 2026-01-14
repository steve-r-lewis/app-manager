# Technical Specification Document – `CssScanner`

**Component:** `CssScanner`
**File:** `~/app/scanners/cssScanner.ts`
**Language:** TypeScript (Node.js)

---

## Part 1: Operational & Design Specification

---

### 1. Component Overview

**Purpose:**
The `CssScanner` is a **linear lexical scanner for CSS/SCSS/Less source code**. It tokenizes style sheets into a **stream of semantic and structural tokens** for downstream parsing or analysis.

Responsibilities:

* Tokenizes CSS into **structural units**: blocks, selectors, properties, functions, at-rules, operators
* Captures nesting through `BlockStart` / `BlockEnd` tokens, supporting `@media` queries and SCSS-style nesting
* Safely handles **comments** (`/* ... */`) and **strings** (`'...'`, `"..."`) to prevent misinterpretation of CSS structure
* Provides the foundational token stream for `CssStrategy` or the style block portion of `VueStrategy`

**Role in System:**

* Serves as a **low-level tokenizer for the style layer**
* Supports **structural analysis and higher-level CSS transformations**
* Works independently of the full document context

---

### 2. Architecture & Patterns

**Design Patterns:**

| Pattern                              | Usage                                                                           |
| ------------------------------------ | ------------------------------------------------------------------------------- |
| Template Method                      | Inherits from `BaseScanner` and implements `scan()`                             |
| Finite State Machine (implicit)      | Cursor-based scanning with branching for comments, strings, blocks, identifiers |
| Greedy Token Recognition             | Functions like `url(`, `var(` captured in one token                             |
| Context-Aware Identifier Recognition | CSS identifiers include `.`, `#`, hyphen, underscore, non-ASCII chars           |

**State Management:**

* **Stateful via BaseScanner**:

  * `index`, `line`, `column` track current position in source
* Local loop state: `char`, `start` (token start location), `tokens[]` array
* Stateless outside of `scan()`

**Complexity Assessment:** Medium

* Mostly linear scanning with nested block detection
* Multi-character token handling (`@media`, functions) introduces additional control flow
* Single-pass O(n) traversal

---

### 3. Dependency Graph

**Internal Dependencies:**

| Module                      | Role                                                                                 |
| --------------------------- | ------------------------------------------------------------------------------------ |
| `BaseScanner<CssTokenType>` | Provides cursor mechanics (`advance()`, `peek()`, `match()`, `getCurrentLocation()`) |
| `Token<CssTokenType>`       | Token data structure                                                                 |
| `SourceLocation`            | Metadata for token positions                                                         |
| `CssTokenType`              | Enumeration of allowed token types                                                   |

**External Dependencies:** None

**Coupling Analysis:**

* **Loosely coupled** to external systems; only depends on `BaseScanner` and type definitions
* Operates fully in memory

---

### 4. Data Types & Interfaces

**Primary Interfaces / Types Used:**

| Type                  | Purpose                                             |            |          |            |        |         |       |           |       |          |             |          |            |          |
| --------------------- | --------------------------------------------------- | ---------- | -------- | ---------- | ------ | ------- | ----- | --------- | ----- | -------- | ----------- | -------- | ---------- | -------- |
| `Token<CssTokenType>` | Core token structure                                |            |          |            |        |         |       |           |       |          |             |          |            |          |
| `SourceLocation`      | Holds `{ line, column, index }` for token start/end |            |          |            |        |         |       |           |       |          |             |          |            |          |
| `CssTokenType`        | Union of: `AtKeyword                                | BlockStart | BlockEnd | Identifier | String | Comment | Colon | Semicolon | Comma | Function | Parenthesis | Operator | Whitespace | Unknown` |

**Return Types:**

| Method                       | Return Type             | Notes                                          |
| ---------------------------- | ----------------------- | ---------------------------------------------- |
| `scan()`                     | `Token<CssTokenType>[]` | Main scanning method                           |
| `scanComment()`              | `Token<CssTokenType>`   | Multi-line CSS comments `/* ... */`            |
| `scanString()`               | `Token<CssTokenType>`   | Handles `'...'` and `"..."`                    |
| `scanAtKeyword()`            | `Token<CssTokenType>`   | Handles at-rules like `@media`, `@import`      |
| `scanIdentifierOrFunction()` | `Token<CssTokenType>`   | CSS identifiers, functions like `url(`, `var(` |

No `any` types present; fully typed.

---

### 5. Functional Logic Specification

#### 5.1 Main Scan Loop (`scan()`)

**Signature:**

```ts
scan(): Token<CssTokenType>[]
```

**Logic Flow (Step-by-Step):**

1. Initialize empty `tokens[]`
2. While not at end of source:

   1. Capture `start` location
   2. Advance one character: `char = advance()`
   3. Branch by `char`:

| Case                                   | Logic                                                                |
| -------------------------------------- | -------------------------------------------------------------------- |
| Whitespace                             | Skip (`isWhitespace`)                                                |
| `/*`                                   | Call `scanComment()` → emits `Comment`                               |
| `{`                                    | Emit `BlockStart` token                                              |
| `}`                                    | Emit `BlockEnd` token                                                |
| `'` or `"`                             | Call `scanString()` → emits `String`                                 |
| `@`                                    | Call `scanAtKeyword()` → emits `AtKeyword`                           |
| `:`                                    | Emit `Colon`                                                         |
| `;`                                    | Emit `Semicolon`                                                     |
| `,`                                    | Emit `Comma`                                                         |
| `)`                                    | Emit `Parenthesis`                                                   |
| `>`, `+`, `~`, `*`                     | Emit `Operator`                                                      |
| Identifier start (`isIdentifierStart`) | Call `scanIdentifierOrFunction()` → emits `Identifier` or `Function` |
| Otherwise                              | Emit `Unknown` token                                                 |

---

#### 5.2 Scan Comment (`scanComment()`)

* Input: start location of `/*`
* Loop until `*/` detected
* Escape sequences are not needed in CSS comments
* Emits `Comment` token

---

#### 5.3 Scan String (`scanString()`)

* Input: quote character (`'` or `"`)
* Loops until matching closing quote
* Handles escape sequences `\`
* Emits `String` token

---

#### 5.4 Scan At-Rule (`scanAtKeyword()`)

* Input: `@` character
* Loops while next char is valid identifier character (`isIdentifierChar`)
* Emits `AtKeyword` token

---

#### 5.5 Scan Identifier or Function (`scanIdentifierOrFunction()`)

* Input: first character
* Loops while `isIdentifierChar`
* If next character is `(` → function token (`Function`)
* Else → `Identifier` token

---

#### 5.6 Helpers

| Method                            | Purpose                                          |
| --------------------------------- | ------------------------------------------------ |
| `isWhitespace()`                  | Checks `\s`                                      |
| `isIdentifierStart()`             | `[a-zA-Z0-9_\-\.#]` or non-ASCII ≥ 0x00A0        |
| `isIdentifierChar()`              | Same as `isIdentifierStart()`                    |
| `createToken(type, value, start)` | Returns `Token<CssTokenType>` with current `end` |

---

### 6. Side Effects

* Cursor state updated (`index`, `line`, `column`)
* Source string is **not mutated**
* Produces **token array** only

---

### 7. Error Handling

* Unclosed comment → consumes until EOF
* Unclosed string → consumes until EOF
* Invalid characters → emitted as `Unknown`
* No exceptions thrown

---

## Part 2: Appendix – Testing Reference

---

### 1. Mocking Strategy

* No external dependencies; fully memory-based
* Source string is test input

---

### 2. Test Scenarios

| Scenario                             | Expected Token Output                                                                                      |
| ------------------------------------ | ---------------------------------------------------------------------------------------------------------- |
| `body { color: red; }`               | `Identifier(body)`, `BlockStart`, `Identifier(color)`, `Colon`, `Identifier(red)`, `Semicolon`, `BlockEnd` |
| Strings `"font-family"` or `'hello'` | `String` token with escapes handled                                                                        |
| Comments `/* comment */`             | `Comment` token                                                                                            |
| At-rules `@media`, `@import`         | `AtKeyword` token                                                                                          |
| Operators `> + ~ *`                  | `Operator` token                                                                                           |
| Functions `url(`, `var(`             | `Function` token                                                                                           |
| Nested blocks (`@media { ... }`)     | `BlockStart` / `BlockEnd` tokens correctly                                                                 |
| Invalid characters                   | `Unknown` token                                                                                            |
| Edge: non-ASCII identifiers          | Correctly recognized as `Identifier`                                                                       |
| Edge: unclosed string/comment        | Token ends at EOF                                                                                          |

---

### 3. Complexity & Coupling

* **Time Complexity:** O(n), n = length of CSS source string
* **Coupling:** Loosely coupled; depends only on `BaseScanner` and type definitions
* **Integration:** Feeds token stream to `CssStrategy` or Vue style parser

---