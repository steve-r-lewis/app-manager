# Technical Specification Document – `TypescriptScanner`

**Component:** `TypescriptScanner`
**File:** `~/app/scanners/typescriptScanner.ts`
**Language:** TypeScript (Node.js)

---

## Part 1: Operational & Design Specification

---

### 1. Component Overview

**Purpose:**
The `TypescriptScanner` is a **linear token scanner for TypeScript and JavaScript source code**. It does **not build an AST** but produces a **reliable token stream** for higher-level strategies (`TypescriptStrategy`) to interpret.

Responsibilities:

* Tokenizes TypeScript/JavaScript into a **linear, ordered stream of tokens**
* Detects structural boundaries: `{ }`
* Captures semantic units: keywords, identifiers, strings, operators, comments
* Handles strings (`'`, `"`, `` ` ``) and comments (`//`, `/* ... */`) robustly
* Implements **context-aware regex literal detection** to avoid misclassification

**Role in System:**

* Serves as a **low-level lexical analyzer** for the TypeScript processing strategy
* Provides the source of truth for downstream token-based transformations, analysis, or code generation
* Operates independently of file structure (no AST, no semantic analysis)

---

### 2. Architecture & Patterns

**Design Patterns:**

| Pattern                         | Usage                                                                          |
| ------------------------------- | ------------------------------------------------------------------------------ |
| Template Method                 | Inherits from `BaseScanner` and implements `scan()`                            |
| Finite State Machine (implicit) | Cursor-based scanning; different paths for strings, comments, regex, operators |
| Greedy Token Recognition        | Multi-character operators (`==`, `=>`, `++`) handled in a single token         |
| Context-aware Detection         | Regex literals are detected based on **last significant token**                |

**State Management:**

* **Stateful via `BaseScanner` cursor:**

  * `index` → current position in source
  * `line` and `column` → current line/column tracking
* **Local temporary state per loop:**

  * `lastSignificantToken` → used for regex literal detection
  * `char`, `value` → current character and token value
* **Stateless outside scan loop**

**Complexity Assessment:** Medium–High

* Multiple conditional branches for string types, comment types, operators, identifiers
* Context-dependent regex detection introduces additional control flow
* Single-pass O(n) traversal

---

### 3. Dependency Graph

**Internal Dependencies:**

| Module                     | Role                                                                                 |
| -------------------------- | ------------------------------------------------------------------------------------ |
| `BaseScanner<TsTokenType>` | Provides cursor mechanics (`advance()`, `peek()`, `match()`, `getCurrentLocation()`) |
| `Token<TsTokenType>`       | Token data structure                                                                 |
| `SourceLocation`           | Metadata for token positions                                                         |
| `TsTokenType`              | Enumeration of allowed token types                                                   |

**External Dependencies:** None

**Coupling Analysis:**

* **Loosely coupled** to external systems: no file I/O or network access
* **Tightly coupled** to `BaseScanner` and `TsTokenType` definitions
* Can operate independently in memory

---

### 4. Data Types & Interfaces

**Primary Interfaces / Types Used:**

| Type                 | Purpose                                             |            |        |       |         |             |            |          |          |            |          |
| -------------------- | --------------------------------------------------- | ---------- | ------ | ----- | ------- | ----------- | ---------- | -------- | -------- | ---------- | -------- |
| `Token<TsTokenType>` | Core token structure                                |            |        |       |         |             |            |          |          |            |          |
| `SourceLocation`     | Holds `{ line, column, index }` for token start/end |            |        |       |         |             |            |          |          |            |          |
| `TsTokenType`        | Union of: `Keyword                                  | Identifier | String | Regex | Comment | Punctuation | BlockStart | BlockEnd | Operator | Whitespace | Unknown` |

**Return Types:**

| Method               | Return Type            | Notes                                           |
| -------------------- | ---------------------- | ----------------------------------------------- |
| `scan()`             | `Token<TsTokenType>[]` | Main scanning method                            |
| `scanString()`       | `Token<TsTokenType>`   | Handles `'`, `"`, `` ` `` strings               |
| `scanLineComment()`  | `Token<TsTokenType>`   | `//` comments                                   |
| `scanBlockComment()` | `Token<TsTokenType>`   | `/* ... */` comments                            |
| `scanRegex()`        | `Token<TsTokenType>`   | Regex literals, context-aware                   |
| `scanIdentifier()`   | `Token<TsTokenType>`   | Keywords vs identifiers based on `KEYWORDS` set |

No `any` types present; fully typed.

---

### 5. Functional Logic Specification

#### 5.1 Main Scan Loop (`scan()`)

**Signature:**

```ts
scan(): Token<TsTokenType>[]
```

**Logic Flow (Step-by-Step):**

1. Initialize empty `tokens[]` and `lastSignificantToken = null`
2. While not at end of source:

   1. Capture `start` location
   2. Advance one character: `char = advance()`
   3. Branch by `char`:

| Case                                             | Logic                                                                                                       |                                                                                                        |
| ------------------------------------------------ | ----------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------ |
| Whitespace                                       | skip (no token)                                                                                             |                                                                                                        |
| `{`                                              | `BlockStart` token; update `lastSignificantToken`                                                           |                                                                                                        |
| `}`                                              | `BlockEnd` token; update `lastSignificantToken`                                                             |                                                                                                        |
| Punctuation (`()[];,.:`)                         | `Punctuation` token; update `lastSignificantToken`                                                          |                                                                                                        |
| `'`, `"`, `` ` ``                                | Call `scanString()`; update `lastSignificantToken`                                                          |                                                                                                        |
| `/`                                              | Branch:                                                                                                     |                                                                                                        |
| `//`                                             | Call `scanLineComment()`; no `lastSignificantToken` update                                                  |                                                                                                        |
| `/*`                                             | Call `scanBlockComment()`; no `lastSignificantToken` update                                                 |                                                                                                        |
| Regex (context)                                  | Call `scanRegex()` if `isRegexStart(lastSignificantToken)`; update `lastSignificantToken`                   |                                                                                                        |
| Division                                         | Otherwise, emit `Operator` `/`; update `lastSignificantToken`                                               |                                                                                                        |
| Other operators (`=`, `+`, `-`, `*`, `%`, `&`, ` | `, `!`, `^`, `~`, `<`, `>`, `?`)                                                                            | Handle greedy multi-character (`==`, `++`, `--`, `=>`); emit `Operator`; update `lastSignificantToken` |
| Alpha / underscore                               | Call `scanIdentifier()`; emits `Keyword` if in `KEYWORDS`, else `Identifier`; update `lastSignificantToken` |                                                                                                        |
| Digit                                            | Fallback handled as `Unknown`; may update `lastSignificantToken`                                            |                                                                                                        |
| Otherwise                                        | Emit `Unknown` token                                                                                        |                                                                                                        |

---

#### 5.2 Regex Detection (`isRegexStart()`)

* Returns `true` if `/` is start of a regex literal
* Depends on `lastSignificantToken`:

| Last Token Type                      | Regex Allowed?                      |
| ------------------------------------ | ----------------------------------- |
| null (start of file)                 | yes                                 |
| Keyword                              | yes                                 |
| Operator                             | yes                                 |
| BlockStart (`{`)                     | yes                                 |
| Punctuation                          | yes unless `)` or `]`               |
| Identifier, String, Number, BlockEnd | no → treat `/` as division operator |

---

#### 5.3 Scan Regex (`scanRegex()`)

* Tracks `/` delimited regex
* Handles character classes `[ ... ]`
* Handles escapes `\`
* Consumes trailing flags (`g`, `i`, `m`, `s`, `u`, `y`, `d`)
* Emits `Regex` token

---

#### 5.4 Scan Strings (`scanString()`)

* Input: quote character (`'`, `"`, `` ` ``)
* Advances until matching closing quote
* Handles escaped characters `\`
* Emits `String` token

---

#### 5.5 Scan Comments

* Line comment `// ...` → `Comment`
* Block comment `/* ... */` → `Comment`
* Does not update `lastSignificantToken`

---

#### 5.6 Scan Identifiers (`scanIdentifier()`)

* Consumes `[a-zA-Z0-9_]`
* Checks against `KEYWORDS` set → emits `Keyword` or `Identifier`
* Updates `lastSignificantToken`

---

#### 5.7 Helpers

* `isWhitespace()` → `\s`
* `isAlpha()` → `[a-zA-Z_]`
* `isDigit()` → `[0-9]`
* `isAlphaNumeric()` → `[a-zA-Z0-9_]`
* `createToken(type, value, start)` → returns `Token<TsTokenType>`

---

### 6. Side Effects

* **Cursor state updated** (`index`, `line`, `column`)
* **No source mutation**
* Produces **token array** only

---

### 7. Error Handling

* Malformed code (unclosed string, regex, comment) → token captures as-is until EOF
* No exceptions thrown; best-effort tokenization
* Ensures **linear token stream integrity**

---

## Part 2: Appendix – Testing Reference

---

### 1. Mocking Strategy

* No external services to mock
* Source string provided per test case
* Test lastSignificantToken behavior for regex context

---

### 2. Test Scenarios

| Scenario                                | Expected Token Output                                                 |
| --------------------------------------- | --------------------------------------------------------------------- |
| `const x = 5;`                          | `Keyword`, `Identifier`, `Operator`, `Unknown (5)`, `Punctuation (;)` |
| Strings                                 | Correct `String` token with escapes handled                           |
| Regex `/abc/i` after `return`           | `Regex` token                                                         |
| Regex `/abc/` after `x +`               | `Regex` token                                                         |
| Division `x / y`                        | `Operator /` token                                                    |
| Line comment `// ...`                   | `Comment` token                                                       |
| Block comment `/* ... */`               | `Comment` token                                                       |
| Nested blocks `{ { } }`                 | `BlockStart` / `BlockEnd` tokens correct                              |
| Operators (`==`, `=>`, `++`, `--`)      | Multi-char `Operator` token                                           |
| Keywords                                | Identified correctly from `KEYWORDS` set                              |
| Identifiers                             | Anything else alpha/underscore                                        |
| Numbers                                 | `Unknown` in this simplified scanner                                  |
| Edge: regex with `[ ... ]` and escapes  | Correct token emitted                                                 |
| Edge: unclosed string / regex / comment | Token ends at EOF                                                     |

---

### 3. Complexity & Coupling

* **Time Complexity:** O(n) with n = source string length
* **Coupling:** Tightly coupled to BaseScanner and token type definitions
* **Integration:** Provides sequential token stream to higher-level TypeScript strategies

---