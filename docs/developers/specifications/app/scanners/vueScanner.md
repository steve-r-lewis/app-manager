# Technical Specification Document

**Component:** `VueScanner`
**File:** `~/app/scanners/vueScanner.ts`
**Language:** TypeScript (Node.js)

---

## Part 1: Operational & Design Specification

---

## 1. Component Overview

### 1.1 Purpose

`VueScanner` is a **Vue Single File Component (SFC) structural scanner** responsible for identifying, extracting, and describing the **top-level root blocks** of a `.vue` file:

* `<script>`
* `<template>`
* `<style>`

Rather than performing deep language tokenization itself, this scanner:

* Operates at the **structural / orchestration layer**
* Converts a flat HTML token stream into **semantic SFC block windows**
* Produces `SfcBlock` objects that downstream scanners can consume safely and independently

---

### 1.2 Role in System

**Architectural Role:**
High-level **Parsing Orchestrator / Structural Analyzer**

**System Placement:**

* Extends `HtmlScanner`
* Serves as the entry point for Vue-specific scanning logic
* Bridges raw HTML tokenization and language-specific scanners

**Delegation Model:**

* `<script>` → `TypescriptScanner`
* `<style>` → `CssScanner`
* `<template>` → `HtmlScanner` (structural analysis)

This component defines the **segmentation contract** for all Vue SFC processing.

---

## 2. Architecture & Patterns

---

### 2.1 Design Patterns

| Pattern                         | Description                                                                          |
| ------------------------------- | ------------------------------------------------------------------------------------ |
| **Template Method (Inherited)** | Inherits `scan()` from `HtmlScanner`, reusing its tokenization logic.                |
| **Orchestrator Pattern**        | Coordinates and segments content for downstream scanners without owning their logic. |
| **Single-Pass Token Analysis**  | Performs a linear scan over the HTML token stream.                                   |
| **Windowing Pattern**           | Defines bounded “windows” (`SfcBlock`) over a shared source string.                  |

**Explicitly not used:**

* Visitor
* AST construction
* Dependency Injection
* Stateful backtracking

---

### 2.2 State Management

**Stateful (Method-Local)**

All state is:

* Confined to `scanSfcBlocks()`
* Reset per invocation
* Not retained on the instance

Tracked state includes:

* `currentTag`
* `currentAttributes`
* `tagStartIndex`
* `contentStartIndex`
* `contentStartLoc`

**Thread Safety:**
Safe per invocation. The instance should not be reused concurrently due to inherited scanner state.

---

### 2.3 Complexity Assessment

**Complexity Rating:** **Medium**

**Justification:**

* Single-pass algorithm
* Multiple nested conditional checks
* Manual token lookahead
* State transitions between “outside block” and “inside block”

While not algorithmically complex, correctness depends on **tight coupling to HtmlScanner token semantics**.

---

## 3. Dependency Graph

---

### 3.1 Internal Dependencies

| Dependency       | Role                                       |
| ---------------- | ------------------------------------------ |
| `HtmlScanner`    | Provides HTML tokenization                 |
| `Token`          | Represents tokens emitted by `HtmlScanner` |
| `SourceLocation` | Used for block location metadata           |
| `SfcBlock`       | Output data structure                      |

These dependencies are explicit and appropriate.

---

### 3.2 External Dependencies

**None**

* No Node.js APIs
* No third-party libraries

---

### 3.3 Coupling Analysis

| Dimension               | Assessment             |
| ----------------------- | ---------------------- |
| Coupling to HtmlScanner | **High (intentional)** |
| Coupling to Token Shape | **High (structural)**  |
| Runtime Coupling        | Low                    |
| Replaceability          | Moderate               |

**Key Observation:**
This scanner is tightly coupled to:

* Specific `HtmlTokenType` values
* Token ordering guarantees

Any change in `HtmlScanner` token semantics is a breaking change here.

---

## 4. Data Types & Interfaces

---

### 4.1 Key Interfaces Used

| Interface        | Purpose                         |
| ---------------- | ------------------------------- |
| `Token`          | Input token stream              |
| `SourceLocation` | Block boundary metadata         |
| `SfcBlock`       | Output contract for VueStrategy |

---

### 4.2 Public API & Return Types

| Method            | Visibility | Return Type  |
| ----------------- | ---------- | ------------ |
| `scanSfcBlocks()` | public     | `SfcBlock[]` |

**Type Safety Observations:**

* Fully typed return value
* One explicit `as any` cast (see Findings)

---

## 5. Functional Logic Specification

---

## 5.1 `scanSfcBlocks()`

### Method Signature

```ts
public scanSfcBlocks(): SfcBlock[]
```

---

### Logic Flow (Step-by-Step)

#### Phase 1: Tokenization

1. Calls inherited `scan()` from `HtmlScanner`
2. Receives a flat array of HTML tokens

---

#### Phase 2: Iterative Block Detection

Iterates sequentially over tokens:

---

##### A. Detect Opening Tag

Trigger:

```ts
token.type === 'TagOpen'
```

Actions:

1. Look ahead for a `TagName`
2. Normalize tag name to lowercase
3. Check if tag is one of:

   * `script`
   * `template`
   * `style`
4. Record:

   * Opening tag start index
   * Reset attributes map
   * Set `currentTag`

---

##### B. Parse Attributes

While scanning tokens until `TagClose` (`>`):

* Collect `AttributeName`
* Detect optional `= AttributeValue`
* Store attributes as:

  * `true` for valueless attributes
  * `string` for valued attributes

Example:

```html
<script setup lang="ts">
```

Becomes:

```ts
{
  setup: true,
  lang: "ts"
}
```

---

##### C. Mark Content Start

When `TagClose` is reached:

* Record `contentStartIndex`
* Capture approximate `SourceLocation`

---

##### D. Detect Closing Tag

Trigger:

```ts
token.type === 'TagClose' && token.value === '</'
```

Validation:

* Next token is `TagName`
* Matches `currentTag`

Actions:

1. Compute content end index
2. Slice raw source content
3. Construct `SfcBlock`
4. Reset internal state

---

### SfcBlock Construction Details

| Field           | Source                                   |
| --------------- | ---------------------------------------- |
| `type`          | Tag name (`script`, `template`, `style`) |
| `content`       | Raw substring from source                |
| `start` / `end` | Absolute indices                         |
| `tagStart`      | Opening tag index                        |
| `tagEnd`        | Approximate closing `>`                  |
| `attributes`    | Parsed attribute map                     |
| `loc.start`     | Opening tag end                          |
| `loc.end`       | Closing tag start                        |

---

### Side Effects

* Reads from inherited `this.source`
* No mutation of shared state beyond local variables

---

### Error Handling

**None explicit**

* Assumes:

  * Well-formed Vue SFC structure
  * Valid HTML token stream
* Malformed input results in:

  * Silent block omission
  * Partial extraction
  * No thrown errors

---

## Architectural & QA Findings

---

### 1. Explicit Type Escape (`as any`)

```ts
type: currentTag as any
```

**Impact:**

* Bypasses strict typing on `SfcBlock.type`
* Weakens compile-time guarantees

**Recommendation:**
Define a union type:

```ts
type SfcRootTag = 'script' | 'template' | 'style';
```

---

### 2. Attribute Parsing Assumptions

* Assumes fixed token ordering:

  * `AttributeName` → `Equals` → `AttributeValue`
* Does not validate malformed attributes
* Ignores duplicate attributes

Acceptable for structural scanning, but should be documented.

---

### 3. Tag Boundary Approximation

* `tagEnd` is computed heuristically
* `loc.start` is approximate

This is acceptable given the scanner’s **windowing role**, but downstream consumers must not assume precise AST-level accuracy.

---

## Part 2: Appendix – Testing Reference

---

## 1. Mocking Strategy

### 1.1 Services to Mock

| Dependency           | Strategy                                  |
| -------------------- | ----------------------------------------- |
| `HtmlScanner.scan()` | Stub to return controlled token sequences |

This allows deterministic testing of block assembly logic.

---

### 1.2 Mock Token Fixtures

Prepare token streams representing:

* Valid Vue SFC
* Missing blocks
* Nested tags
* Attributes with and without values

---

## 2. Test Scenarios

---

### 2.1 Happy Path

| Scenario           | Expected Result       |
| ------------------ | --------------------- |
| Script-only SFC    | One `SfcBlock`        |
| All three blocks   | Three `SfcBlock`s     |
| Attributes present | Correct attribute map |
| Setup script       | `setup: true`         |

---

### 2.2 Edge Cases

| Scenario            | Expected Behavior        |
| ------------------- | ------------------------ |
| Missing closing tag | Block not emitted        |
| Duplicate blocks    | Multiple blocks returned |
| Uppercase tags      | Normalized correctly     |
| Empty content       | Empty `content` string   |

---

### 2.3 Error & Robustness Scenarios

| Scenario               | Outcome          |
| ---------------------- | ---------------- |
| Malformed HTML tokens  | Silent failure   |
| Unexpected token order | Attribute loss   |
| Nested root blocks     | First-level only |

---

## Final Assessment

**Architectural Quality:** High
**Responsibility Boundaries:** Clear
**Performance:** O(n) over token stream
**Primary Risks:**

* Tight coupling to HtmlScanner token semantics
* One explicit type escape
* Silent failure on malformed input

