# Master Technical Specification – `HtmlScanner`

**Component:** `HtmlScanner`
**File:** `~/app/scanners/htmlScanner.ts`
**Language:** TypeScript (Node.js)

---

## Part 1: Component Overview

**Purpose:**
`HtmlScanner` is a **low-level, general-purpose HTML tokenizer** designed to convert HTML or Vue `<template>` content into a sequential stream of typed tokens. It acts as the **base tokenizer** for downstream parsers, including `VueScanner`.

**Responsibilities:**

* Tokenize tags (`<div>`, `</div>`, `<br/>`)
* Tokenize attributes (quoted, unquoted, boolean)
* Parse text nodes (`Text`)
* Parse comments (`<!-- ... -->`)
* Parse doctype declarations (`<!DOCTYPE html>`)
* Parse raw text blocks (`<script>`, `<style>`, `<textarea>`, `<title>`)
* Maintain source location metadata (`line`, `column`, `index`) for each token

**Role in System:**

* Serves as the **foundation** for HTML parsing strategies
* Provides input for Vue SFC scanning
* Operates **without semantic knowledge** of HTML; purely token-based

---

## Part 2: Architecture & Design Patterns

**Design Patterns:**

| Pattern                         | Usage                                                              |
| ------------------------------- | ------------------------------------------------------------------ |
| Template Method                 | Overrides `scan()` from `BaseScanner` with HTML-specific scanning  |
| Finite State Machine (implicit) | Supports two modes: Data Mode and Raw Text Mode                    |
| Stateless Helpers               | `isWhitespace()`, `isAlpha()`, `isAlphaNumeric()`, `createToken()` |
| Cursor Tracking / Windowing     | Tracks start and end positions with `SourceLocation`               |

**State Management:**

* Uses `BaseScanner` cursor (`index`, `line`, `column`)
* Local temporary variables for scanning loops (`tagName`, `attrName`, `attrValue`, `value`)
* Stateless between method calls; **not thread-safe**

**Complexity:** Medium – single-pass scan with multiple branches and special handling for raw text blocks, attributes, and self-closing tags.

---

## Part 3: Dependencies

**Internal Dependencies:**

| Dependency                   | Role                                                                  |
| ---------------------------- | --------------------------------------------------------------------- |
| `BaseScanner<HtmlTokenType>` | Provides cursor movement, line/column tracking, `peek()`, `advance()` |
| `Token`                      | Typed token output                                                    |
| `SourceLocation`             | Metadata for start/end positions                                      |
| `HtmlTokenType`              | Enumeration of all HTML token types                                   |

**External Dependencies:** None

**Coupling Analysis:**

* Loosely coupled to `BaseScanner` for cursor mechanics
* Strongly coupled to token type definitions and raw text tag set (`RAW_TEXT_TAGS`)
* No runtime I/O or external libraries

---

## Part 4: Token Types

`HtmlScanner` supports the following token types:

* `TagOpen` (`<div`)
* `TagClose` (`>`)
* `TagSelfClose` (`/>`)
* `TagEnd` (`</div>`)
* `TagName`
* `AttributeName`
* `AttributeValue` (quoted/unquoted/boolean)
* `Text`
* `Comment`
* `Doctype`
* `Whitespace`
* `Unknown`

All tokens include:

* `type: HtmlTokenType`
* `value: string`
* `start: SourceLocation`
* `end: SourceLocation`

---

## Part 5: State Machine

| Mode              | Trigger                                        | Behavior                                      | Exit                                                                    |
| ----------------- | ---------------------------------------------- | --------------------------------------------- | ----------------------------------------------------------------------- |
| **Data Mode**     | Default                                        | Scan tags, attributes, comments, text         | Enter Raw Text Mode for `<script>`, `<style>`, `<textarea>`, `<title>`  |
| **Raw Text Mode** | `<script>`, `<style>`, `<textarea>`, `<title>` | Consume all characters as single `Text` token | Detect exact closing tag, emit `Text` + `TagClose`, return to Data Mode |

**Crucial Behavior:**

* `<template>` is treated like any other tag; scanning remains in Data Mode for children
* Raw Text Mode consumes everything literally until closing tag

---

## Part 6: Functional Specification

### 6.1 Main Scan Algorithm

**Pseudocode:**

```ts
while not at end:
    start = getCurrentLocation()
    char = peek()

    if char == '<':
        if check("<!--"):
            emit scanComment()
        else if check("<!DOCTYPE") or check("<!doctype"):
            emit scanDoctype()
        else if check("</"):
            emit scanClosingTag()
        else:
            emit scanOpeningTag()
            if tagName in RAW_TEXT_TAGS:
                emit scanRawText(tagName)
    else:
        emit scanText()
```

---

### 6.2 Tag Scanning

**Opening Tag (`scanOpeningTag()`):**

* Emit `TagOpen` token
* Parse `TagName` token
* Parse attributes:

  * Quoted (`"..."` / `'...'`)
  * Unquoted (`attr=value`)
  * Boolean (`checked` → `AttributeValue = true`)
* Handle tag close: `>` → `TagClose`, `/>` → `TagSelfClose`
* Enter Raw Text Mode if tag is a raw text tag

**Closing Tag (`scanClosingTag()`):**

* Consume `</`
* Parse `TagName`
* Emit `TagClose`

---

### 6.3 Raw Text Mode (`scanRawText(tagName: string)`)

* Consume all characters until exact closing tag `</tagName>`
* Emit single `Text` token containing full raw content
* Return to Data Mode

---

### 6.4 Comment Scanning (`scanComment()`)

* Consume `<!--`
* Collect content until `-->`
* Emit `Comment` token

---

### 6.5 Doctype Scanning (`scanDoctype()`)

* Consume `<!DOCTYPE ...>` until `>`
* Emit `Doctype` token

---

### 6.6 Text Nodes (`scanText()`)

* Consume characters until `<` or EOF
* Emit `Text` token

---

### 6.7 Attribute Parsing

* Skip whitespace
* Parse `AttributeName` until `=` or whitespace
* If `=` found:

  * Quoted value → `"..."` or `'...'`
  * Unquoted value → until whitespace or `>`
* Boolean attribute (no `=`) → `AttributeValue = true`

---

### 6.8 Helper Methods

* `skipWhitespace()` – advances cursor over spaces, tabs, line breaks
* `isAlpha(char)` – returns `true` if A-Z/a-z
* `isAlphaNumeric(char)` – returns `true` if A-Z/a-z/0-9
* `createToken(type, value, start)` – constructs fully typed token with start/end metadata

---

## Part 7: Public API

```ts
class HtmlScanner extends BaseScanner<HtmlTokenType> {
    public scan(): Token<HtmlTokenType>[]

    private scanOpeningTag(): Token<HtmlTokenType>[]
    private scanClosingTag(): Token<HtmlTokenType>
    private scanRawText(tagName: string): Token<HtmlTokenType>
    private scanComment(): Token<HtmlTokenType>
    private scanDoctype(): Token<HtmlTokenType>
    private scanText(): Token<HtmlTokenType>
    private scanAttributes(): Record<string, string | boolean>
}
```

* Fully typed, returns `Token<HtmlTokenType>[]`
* All tokens include `SourceLocation`
* Private methods handle low-level parsing; public API is `scan()`

---

## Part 8: Error Handling & Edge Cases

* **Malformed HTML:** Emits tokens as best-effort
* **Unclosed tags:** Raw Text Mode consumes until EOF
* **Invalid attributes:** Boolean by default; unquoted values tolerated
* **EOF in raw text:** Entire remaining content emitted as single `Text` token
* **No exceptions thrown**

---

## Part 9: Test Strategy

### 9.1 Mocking

* No external dependencies
* Controlled source strings for each token type

### 9.2 Test Scenarios

| Scenario                                        | Expected Result                                                    |
| ----------------------------------------------- | ------------------------------------------------------------------ |
| Normal tags with attributes                     | `TagOpen`, `TagName`, `AttributeName`/`AttributeValue`, `TagClose` |
| Self-closing tags                               | `TagSelfClose` emitted correctly                                   |
| Raw text blocks (`script/style/textarea/title`) | Single `Text` token containing content                             |
| Comments                                        | `Comment` token correctly parsed                                   |
| Doctype                                         | `Doctype` token correctly parsed                                   |
| Text nodes                                      | Continuous `Text` tokens between tags                              |
| Boolean attributes                              | Value set to `true`                                                |
| Unquoted attribute values                       | Parsed correctly                                                   |
| EOF inside raw text                             | Token contains full remaining content                              |
| Mixed HTML                                      | Sequential tokens reflect source faithfully                        |

---

## Part 10: Complexity & Coupling

* **Time Complexity:** O(n), n = length of source string
* **Coupling:**

  * Tightly coupled to `BaseScanner` and `HtmlTokenType`
  * Loosely coupled to external code, no runtime dependencies

---

## Part 11: Key Corrected Features

1. Dual-mode scanning: **Data Mode** and **Raw Text Mode**
2. Full token coverage: `TagOpen`, `TagName`, `TagClose`, `TagSelfClose`, `AttributeName`, `AttributeValue`, `Text`, `Comment`, `Doctype`
3. Attribute parsing supports quoted, unquoted, and boolean attributes
4. Self-closing tag detection implemented
5. Comment and Doctype scanning corrected
6. All tokens include accurate **start/end line, column, and index**
7. Compatible with **Vue SFC template scanning**
8. Corrected main scan loop and branching logic

---


