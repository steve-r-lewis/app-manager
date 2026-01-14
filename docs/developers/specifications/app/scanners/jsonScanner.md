# Technical Specification Document – `JsonScanner`

**Component:** `JsonScanner`
**File:** `~/app/scanners/jsonScanner.ts`
**Language:** TypeScript (Node.js)

---

## Part 1: Operational & Design Specification

---

### 1. Component Overview

**Purpose:**
The `JsonScanner` is a **lexical tokenizer for JSON/JSONC content**. Its role is to produce a **linear token stream** representing all structural and semantic elements in a JSON document, including optional comments.

Responsibilities:

* Tokenizes JSON into structural units: **objects (`{}`), arrays (`[]`), properties (`:`), separators (`,`), strings, numbers, booleans, nulls**
* Supports **JSONC** (commented JSON) using `//` and `/* */` syntax for configuration files like `tsconfig.json`
* Accurately handles **strings** (including escape sequences) and **numbers** (including fractional and exponent forms)
* Provides a foundation for **JsonStrategy** to safely edit JSON without losing formatting or comments

**Role in System:**

* Forms the **low-level lexical layer** of JSON parsing
* Enables higher-level operations such as **structural validation, formatting, and transformations**
* Fully independent; can operate on partial or full JSON documents

---

### 2. Architecture & Patterns

**Design Patterns:**

| Pattern                            | Usage                                                            |
| ---------------------------------- | ---------------------------------------------------------------- |
| Template Method                    | Extends `BaseScanner` and implements `scan()`                    |
| Finite State Machine               | Cursor-driven scanning with branching based on character types   |
| Context-Aware Token Recognition    | Numbers, strings, keywords, comments recognized based on context |
| Greedy Multi-Character Consumption | Scans entire strings, numbers, and comments in a single token    |

**State Management:**

* **Stateful via `BaseScanner`**: tracks `index`, `line`, `column`
* Local scan state: `tokens[]` array, `char`, `start` position
* **Single-pass scan**, no recursion

**Complexity Assessment:** Medium

* Linear scan O(n)
* Handles multiple token types with branching logic
* Escaped sequences in strings, numbers with fractions/exponents, and comments increase complexity

---

### 3. Dependency Graph

**Internal Dependencies:**

| Module                       | Role                                                                                                                                                                  |
| ---------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `BaseScanner<JsonTokenType>` | Provides cursor movement and location tracking                                                                                                                        |
| `Token<JsonTokenType>`       | Token structure interface                                                                                                                                             |
| `SourceLocation`             | Start/end position for tokens                                                                                                                                         |
| `JsonTokenType`              | Enumerated JSON token types (`BraceOpen`, `BraceClose`, `BracketOpen`, `BracketClose`, `Colon`, `Comma`, `String`, `Number`, `Boolean`, `Null`, `Comment`, `Unknown`) |

**External Dependencies:** None

**Coupling Analysis:** Loosely coupled

* Fully self-contained
* No file system, network, or external library dependencies

---

### 4. Data Types & Interfaces

**Primary Interfaces / Types Used:**

| Type                   | Purpose                                               |            |             |              |       |       |        |        |         |      |         |          |
| ---------------------- | ----------------------------------------------------- | ---------- | ----------- | ------------ | ----- | ----- | ------ | ------ | ------- | ---- | ------- | -------- |
| `Token<JsonTokenType>` | Token container with type, value, start/end locations |            |             |              |       |       |        |        |         |      |         |          |
| `SourceLocation`       | `{ line, column, index }` for token positions         |            |             |              |       |       |        |        |         |      |         |          |
| `JsonTokenType`        | `BraceOpen                                            | BraceClose | BracketOpen | BracketClose | Colon | Comma | String | Number | Boolean | Null | Comment | Unknown` |

**Return Types:**

| Method               | Return Type              | Notes                                           |
| -------------------- | ------------------------ | ----------------------------------------------- |
| `scan()`             | `Token<JsonTokenType>[]` | Main scanning entry                             |
| `scanString()`       | `Token<JsonTokenType>`   | Strings with escaped characters                 |
| `scanNumber()`       | `Token<JsonTokenType>`   | Numbers with optional fractional/exponent parts |
| `scanKeyword()`      | `Token<JsonTokenType>`   | Keywords: `true`, `false`, `null`               |
| `scanLineComment()`  | `Token<JsonTokenType>`   | Line comment `// ...`                           |
| `scanBlockComment()` | `Token<JsonTokenType>`   | Block comment `/* ... */`                       |

---

### 5. Functional Logic Specification

#### 5.1 Main Scan Loop (`scan()`)

**Signature:**

```ts
scan(): Token<JsonTokenType>[]
```

**Step-by-Step Flow:**

1. Initialize empty `tokens[]`
2. Loop until end of source:

   1. Capture `start` location
   2. `char = advance()`
   3. Branch by `char`:

| Case                               | Logic                                                                                        |
| ---------------------------------- | -------------------------------------------------------------------------------------------- |
| Whitespace (`\s`)                  | Skip                                                                                         |
| `{`                                | Emit `BraceOpen`                                                                             |
| `}`                                | Emit `BraceClose`                                                                            |
| `[`                                | Emit `BracketOpen`                                                                           |
| `]`                                | Emit `BracketClose`                                                                          |
| `:`                                | Emit `Colon`                                                                                 |
| `,`                                | Emit `Comma`                                                                                 |
| `/`                                | Check next char: if `/` → `scanLineComment()`, if `*` → `scanBlockComment()`, else `Unknown` |
| `"`                                | Call `scanString()`                                                                          |
| Digit or `-`                       | Call `scanNumber()`                                                                          |
| Alphabetic (`true`/`false`/`null`) | Call `scanKeyword()`                                                                         |
| Otherwise                          | Emit `Unknown`                                                                               |

---

#### 5.2 Scan String (`scanString()`)

* Input: opening `"`
* Loop until closing `"` or EOF
* Escaped characters handled via `\`
* Emit `String` token

---

#### 5.3 Scan Number (`scanNumber()`)

* Input: first digit or `-`
* Consumes integer part
* Optional fraction if `.` followed by digit
* Optional exponent if `e`/`E` followed by optional `+`/`-` and digits
* Emit `Number` token

---

#### 5.4 Scan Keyword (`scanKeyword()`)

* Input: first alphabetic char
* Loop while alphabetic characters
* Emit token based on value:

| Value            | Token Type |
| ---------------- | ---------- |
| `true` / `false` | `Boolean`  |
| `null`           | `Null`     |
| Others           | `Unknown`  |

---

#### 5.5 Scan Comments

* **Line comment** `// ...` → consumes until newline → `Comment`
* **Block comment** `/* ... */` → consumes until `*/` → `Comment`

---

### 6. Helpers

| Method                            | Purpose                                         |
| --------------------------------- | ----------------------------------------------- |
| `isWhitespace()`                  | `/\s/`                                          |
| `isDigit()`                       | `/[0-9]/`                                       |
| `isAlpha()`                       | `/[a-zA-Z]/`                                    |
| `createToken(type, value, start)` | Returns `Token<JsonTokenType>` with current end |

---

### 7. Side Effects

* Updates `index`, `line`, `column`
* Source is **read-only**
* Returns **token array** only

---

### 8. Error Handling

* Unclosed string → token ends at EOF
* Unclosed comment → token ends at EOF
* Invalid characters → `Unknown` token
* No exceptions thrown

---

## Part 2: Appendix – Testing Reference

---

### 1. Mocking Strategy

* No external dependencies; input string only
* All scanning is deterministic

---

### 2. Test Scenarios

| Scenario                             | Expected Tokens                                                                        |
| ------------------------------------ | -------------------------------------------------------------------------------------- |
| `{ "key": "value" }`                 | `BraceOpen`, `String(key)`, `Colon`, `String(value)`, `BraceClose`                     |
| `[1,2,3]`                            | `BracketOpen`, `Number(1)`, `Comma`, `Number(2)`, `Comma`, `Number(3)`, `BracketClose` |
| Numbers `-123`, `3.14`, `1e+5`       | `Number` token correctly formed                                                        |
| Keywords `true`, `false`, `null`     | Correct token types (`Boolean` / `Null`)                                               |
| Comments `// comment`, `/* block */` | `Comment` tokens                                                                       |
| Invalid tokens                       | `Unknown` token                                                                        |
| Mixed content with JSONC             | All token types interleaved                                                            |
| Edge: escaped strings `\"`           | Included correctly in `String`                                                         |
| Edge: EOF during string/comment      | Token ends at EOF, no exception                                                        |

---

### 3. Complexity & Coupling

* **Time Complexity:** O(n), n = length of JSON source
* **Coupling:** Loosely coupled; only depends on `BaseScanner`
* **Integration:** Provides token stream to `JsonStrategy`

---