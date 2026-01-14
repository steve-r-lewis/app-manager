# baseScanner - Technical Specification Document

**Component:** `BaseScanner<TTokenType>`
**File:** `~/app/scanners/baseScanner.ts`
**Language:** TypeScript (Node.js)

---

## Part 1: Operational & Design Specification

---

## 1. Component Overview

### 1.1 Purpose

`BaseScanner<TTokenType>` is an **abstract, language-agnostic lexical scanning base class** that provides the core mechanics required to tokenize source text into structured tokens. It implements the foundational mechanics of the project’s **Token Scanner Paradigm**, including:

* Linear (O(n)) traversal of a source string
* Cursor management with precise line, column, and index tracking
* Safe lookahead and conditional consumption primitives
* Source slicing and location snapshotting for token metadata

The class deliberately contains **no language rules**, enabling it to be reused across multiple scanners (TypeScript, Vue SFC, HTML, CSS, JSON, etc.) while enforcing consistent scanning semantics.

---

### 1.2 Role in System

**Architectural Role:**
Core **Infrastructure / Parsing Utility**

**System Placement:**

* Base of the scanner inheritance hierarchy
* Extended by concrete language scanners implementing `scan()`
* Supplies standardized cursor and location logic to all token emitters

**Downstream Consumers:**

* Token streams for syntax parsing
* Static analysis and validation tools
* Safe-regex and security scanning
* Vue SFC block processing

This component is **foundational**: correctness here directly affects all higher-level parsing behavior.

---

## 2. Architecture & Patterns

---

### 2.1 Design Patterns

| Pattern                   | Description                                                                                                                           |
| ------------------------- | ------------------------------------------------------------------------------------------------------------------------------------- |
| **Template Method**       | `scan()` is abstract; traversal and cursor mechanics are fixed in the base class, while tokenization logic is supplied by subclasses. |
| **Framework Base Class**  | Establishes a contract and shared implementation for all scanners in the system.                                                      |
| **Stateful Iterator**     | Internally maintains cursor state while iterating through a character stream.                                                         |
| **Strategy (Structural)** | Each concrete scanner represents a different scanning strategy operating on the same traversal API.                                   |

**Explicitly not used (by design):**

* Singleton
* Factory
* Observer
* Dependency Injection

---

### 2.2 State Management

**Stateful Component**

The scanner maintains mutable internal state across the scanning lifecycle:

* `index` – absolute position in source string
* `line` – 1-based line number
* `column` – 1-based column number

State is:

* Monotonically advancing
* Reset only via instantiation
* Intended for **single-use per source**

**Concurrency:**
Not thread-safe. Instances must not be shared across concurrent scans.

---

### 2.3 Complexity Assessment

**Complexity Rating:** **Low (Structural), High (Criticality)**

**Rationale:**

* Control flow is simple and linear
* No branching or nested state machines
* However, this class underpins all scanners, making it **architecturally critical**
* Errors here propagate system-wide

---

## 3. Dependency Graph

---

### 3.1 Internal Dependencies

**Shared Domain Types (previously provided):**

* `Token<TTokenType>` — from `scannerTypes.ts`
* `SourceLocation` — from `scannerTypes.ts`

These are valid, well-defined shared types within the codebase.

**Design Note:**
This file assumes access to shared domain types, either via:

* Explicit imports (recommended for clarity), or
* A centralized type aggregation strategy

This is an **explicitness and maintainability consideration**, not a functional defect.

---

### 3.2 External Dependencies

**None**

* No Node.js APIs
* No third-party libraries
* No runtime coupling

---

### 3.3 Coupling Analysis

| Dimension             | Assessment                  |
| --------------------- | --------------------------- |
| Runtime Coupling      | None                        |
| Compile-time Coupling | Low                         |
| Inheritance Coupling  | Intentional and appropriate |
| Test Isolation        | High                        |

The class is cleanly isolated and easily testable with a minimal subclass.

---

## 4. Data Types & Interfaces

---

### 4.1 Key Interfaces Used

| Interface           | Origin            | Purpose                                  |
| ------------------- | ----------------- | ---------------------------------------- |
| `Token<TTokenType>` | `scannerTypes.ts` | Represents a scanned token with metadata |
| `SourceLocation`    | `scannerTypes.ts` | Captures cursor position                 |

These interfaces are correctly designed for immutable token emission and precise diagnostics.

---

### 4.2 Public API & Return Types

| Method                        | Visibility        | Return Type           |
| ----------------------------- | ----------------- | --------------------- |
| `constructor(source: string)` | public            | `void`                |
| `scan()`                      | public (abstract) | `Token<TTokenType>[]` |

**Type Safety Assessment:**

* No `any`
* Generic token typing enforced
* No implicit return types

---

## 5. Functional Logic Specification

---

### 5.1 Constructor

**Signature**

```ts
constructor(source: string)
```

**Logic Flow**

1. Stores the source string
2. Caches its length
3. Initializes cursor state:

   * `index = 0`
   * `line = 1`
   * `column = 1`

**Side Effects**

* Internal state initialization only

**Error Handling**

* No validation required
* Empty input is a valid case

---

### 5.2 `scan()`

**Signature**

```ts
public abstract scan(): Token<TTokenType>[]
```

**Responsibilities**

* Implement tokenization state machine
* Drive cursor advancement
* Emit `Token<TTokenType>` instances

**Contract Expectations**

* Must terminate
* Must respect cursor helpers
* Must not mutate source directly

---

### 5.3 Cursor & Navigation Helpers

#### `isAtEnd(): boolean`

* Checks for end-of-input

#### `advance(): string`

* Consumes one character
* Updates line/column state
* Returns `'\0'` at EOF

#### `peek(offset = 0): string`

* Lookahead without mutation
* Safe beyond bounds

#### `match(expected: string): boolean`

* Conditional consume
* Advances only on success

#### `check(sequence: string): boolean`

* Multi-character lookahead
* Zero side effects

---

### 5.4 Location & Source Utilities

#### `getCurrentLocation(): SourceLocation`

* Returns immutable snapshot of cursor state

#### `slice(start, end): string`

* Extracts raw source substring

---

### 5.5 `skipWhitespace()`

**Signature**

```ts
private skipWhitespace(): void
```

**Behavior**

* Advances cursor while whitespace is detected

**Design Constraint**

* Relies on `isWhitespace()` being available in scope

**Architectural Note**

* `isWhitespace()` must be:

  * Implemented in this class, or
  * Declared abstract, or
  * Supplied via a shared utility

This is a **real completeness requirement**, not merely stylistic.

---

## Part 2: Appendix – Testing Reference

---

## 1. Mocking Strategy

### 1.1 Services to Mock

**None**

The component has:

* No I/O
* No external dependencies
* No injected services

---

### 1.2 Test Harness Requirements

A minimal concrete implementation is required for testing:

```ts
class TestScanner extends BaseScanner<string> {
  scan() {
    return [];
  }
}
```

---

## 2. Test Scenarios

---

### 2.1 Happy Path

* Cursor advances correctly
* Line/column tracking across newlines
* Lookahead functions do not mutate state
* `match()` consumes only on success

---

### 2.2 Edge Cases

* Empty input
* Single-character input
* Multiple newlines
* End-of-file peeking and advancing
* Unicode characters (JS code unit semantics)

---

### 2.3 Error & Misuse Scenarios

| Scenario                 | Expected Outcome          |
| ------------------------ | ------------------------- |
| Missing `isWhitespace()` | Compile-time failure      |
| Faulty subclass `scan()` | Infinite loop risk        |
| Incorrect cursor usage   | Token boundary corruption |

---

## Final Assessment

**Overall Quality:** High
**Architectural Soundness:** Strong
**Reusability:** Excellent
**Primary Risk:** Incomplete whitespace abstraction

---


