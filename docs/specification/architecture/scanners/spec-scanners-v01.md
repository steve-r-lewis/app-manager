# Technical Specification Document

**Component:** Scanners Layer — `BaseScanner` + Four Concrete Scanners
**Files:** `~/app/scanners/baseScanner.ts`, `~/app/scanners/typescript/typescriptScanner.ts`, `~/app/scanners/css/cssScanner.ts`, `~/app/scanners/html/htmlScanner.ts`, `~/app/scanners/json/jsonScanner.ts`
**Project:** `app-manager`
**Language:** TypeScript (Node.js runtime)

*Written retroactively, closing the gap between the narrative architecture description given in `app-manager-comprehensive-specification.md` Part II and the Part 1/Part 2 "Technical Specification Document" format every service and command has received since. All five files re-read in full for this document — three (`CssScanner`, `HtmlScanner`, `JsonScanner`) had previously only been described from their docstrings, not their actual method bodies. That closer read found one genuine, reproducible bug, documented in §5.3.*

---

## Part 1: Operational & Design Specification

### 1. Component Overview

#### 1.1 Purpose

A family of hand-written tokenizers, one per supported language (TypeScript, CSS, HTML, JSON), all extending one shared, language-agnostic `BaseScanner<TTokenType>`. Each converts raw source text into a flat, ordered stream of typed `Token` objects — the layer immediately below the Strategies (documented separately, `spec-strategies.md`), though as of this audit **no strategy actually consumes its matching scanner** — every strategy currently uses plain regex against raw text instead (§ Final Architectural Notes).

#### 1.2 Role in System

**Architectural Role:** Lexical Analysis Layer, sitting beneath Strategies in the code-intelligence stack described in the original architecture audit. Provides the mechanics (cursor advancement, line/column tracking, lookahead) that any future strategy rewrite could use to replace today's regex-based parsing with genuine tokenization.

### 2. Architecture & Patterns

#### 2.1 Design Patterns

| Pattern | Usage |
|---|---|
| **Template Method** | `BaseScanner` implements every generic mechanic (cursor, lookahead, classification helpers) and declares `scan()` abstract — each concrete scanner supplies only its language-specific tokenization loop. |
| **Immutable Token Factory** | `BaseScanner.token()` (and each concrete scanner's own `createToken()` helper) always constructs a fresh token object rather than mutating one — tokens are treated as immutable once created. |

#### 2.2 State Management

**Statefulness:** Each scanner instance is stateful for the duration of one `scan()` call — `BaseScanner` holds private cursor state (`_index`, `_line`, `_column`) mutated by `advance()`/`match()`. State does not persist between separate `scan()` invocations on different instances; a new scanner is constructed per file, per `getStrategyForFile()`-style dispatch (in practice, no current strategy actually instantiates a scanner at all — see Final Architectural Notes). `HtmlScanner` additionally holds two pieces of scanner-specific state beyond the base class: `rawTextMode`/`rawTagName`, tracking whether the cursor is currently inside a `<script>`/`<style>` element's raw-text body.

#### 2.3 Complexity Assessment

**Rating:** Medium. `BaseScanner` itself is low-complexity (linear cursor mechanics). `TypescriptScanner` is the most complex concrete scanner, correctly handling a genuine three-way ambiguity problem (regex-literal vs. division operator, resolved via `isRegexStart()`'s check of the preceding significant token). `HtmlScanner` is the second-most complex, and — per §5.3 — has a real, unresolved correctness defect in exactly the part of its logic handling quoted attribute values, which is also its most delicate piece of state tracking.

### 3. Dependency Graph

#### 3.1 Internal Dependencies

| Dependency | Purpose |
|---|---|
| `~/app/types/scanners/baseScannerTypes.ts` (`Token`, `SourceLocation`) | Shared token/location shapes used by every scanner. |
| `~/app/types/index.ts` (per-language token type unions: `TsTokenType`, `CssTokenType`, `HtmlTokenType`, `JsonTokenType`) | Each concrete scanner is generic over its own closed token-type union, giving compile-time exhaustiveness for that language's token kinds. |

#### 3.2 External Dependencies

None. Every scanner is pure TypeScript with no third-party parsing library — the entire point of this layer is to be a from-scratch, dependency-free tokenizer.

#### 3.3 Coupling Analysis

**Coupling Level:** Very low. `BaseScanner` depends on nothing but its own type definitions; each concrete scanner depends only on `BaseScanner` and its own token-type union. No scanner depends on any other scanner, on any strategy, or on any service — this is the most cleanly isolated layer in the entire codebase.

### 4. Data Types & Interfaces

#### 4.1 `Token<TTokenType>` and `SourceLocation` (Existing, Shared)

```ts
export interface SourceLocation {
	line: number;
	column: number;
	index: number;
}

export interface Token<TTokenType extends string> {
	type: TTokenType;
	value: string;
	start: SourceLocation;
	end: SourceLocation;
}
```

#### 4.2 Per-Language Token Type Unions (Existing)

| Scanner | Token type union (representative members, not exhaustive) |
|---|---|
| `TypescriptScanner` | `'BlockStart' \| 'BlockEnd' \| 'Punctuation' \| 'String' \| 'Comment' \| 'Operator' \| 'Regex' \| 'Keyword' \| 'Identifier' \| 'Unknown'` |
| `CssScanner` | `'BlockStart' \| 'BlockEnd' \| 'Colon' \| 'Semicolon' \| 'Comma' \| 'Parenthesis' \| 'Operator' \| 'Comment' \| 'String' \| 'AtKeyword' \| 'Function' \| 'Identifier' \| 'Unknown'` |
| `HtmlScanner` | `'TagName' \| 'TagSelfClose' \| 'TagClose' \| 'AttributeName' \| 'AttributeValue' \| 'Text' \| 'Comment'` |
| `JsonScanner` | `'BraceOpen' \| 'BraceClose' \| 'BracketOpen' \| 'BracketClose' \| 'Colon' \| 'Comma' \| 'String' \| 'Number' \| 'Boolean' \| 'Null' \| 'Comment' \| 'Unknown'` |

### 5. Functional Logic Specification

#### 5.1 `BaseScanner<TTokenType>` — Confirmed Correct, No Changes

Re-verified in full: cursor mechanics (`advance`, `peek`, `check`, `match`), CRLF normalization (a `\r\n` pair advances the line counter exactly once, not twice), classification helpers (`isWhitespace`/`isDigit`/`isAlpha`/`isAlphaNumeric`), and the `consumeWhile`/`consumeUntil`/`consumeUntilSequence` declarative helpers all behave exactly as the original architecture audit described. No defects found. Every concrete scanner correctly relies on this class's `protected` methods rather than redeclaring them — confirmed by each scanner's own revision history explicitly recording the *removal* of earlier private redeclarations that had become dead code and type-checking conflicts once `BaseScanner` exposed the same methods as `protected`.

#### 5.2 `TypescriptScanner` — Confirmed Correct, No Changes

Re-verified the regex-vs-division disambiguation (`isRegexStart()`): correctly returns `true` (regex literal follows) after a keyword, an operator, or a block-start `{`; correctly returns `false` (division follows) after a closing bracket `)`/`]`, an identifier, a string, a number, or a block-end `}`. String scanning correctly handles backslash-escapes for all three quote styles (`'`, `"`, `` ` ``) without prematurely terminating on an escaped quote character. Comment scanning (`//` and `/* */`) is correctly excluded from `lastSignificantToken` tracking, so a comment appearing immediately before a `/` does not incorrectly influence the regex/division decision for that following `/`. No defects found.

#### 5.3 `HtmlScanner` — Real Defect Found: Attribute-Value Quote Over-Consumption

**The defect, precisely:** in `consumeAttributes()`'s quoted-value branch, the cursor is advanced **one character too many** at both the start and the end of a quoted attribute value:

```ts
if (quote === '"' || quote === "'") {
	this.advance();
	const valStart = this.currentLocation();
	this.advance(); // opening quote      <-- BUG: the opening quote was already consumed by the line above; this consumes the value's first character instead
	
	this.consumeWhile(c => c !== quote);
	
	const valEnd = this.currentLocation();
	this.advance(); // opening quote      <-- mislabeled comment; this one correctly consumes the closing quote
	
	this.advance(); // closing quote      <-- BUG: extra; consumes whatever character immediately follows the closing quote
	
	this.tokens.push(this.token('AttributeValue', valStart, valEnd));
}
```

**Why the captured token *value* is nonetheless correct, and why that makes this defect easy to miss on inspection:** `this.token()` computes a token's `value` by slicing the original source string between two `SourceLocation` snapshots (`valStart`/`valEnd`), not by accumulating characters as the cursor advances. Because `valStart` is snapshotted *before* the erroneous extra `advance()` and `valEnd` is snapshotted *before* the second erroneous pair, the slice itself lands on the correct boundaries — `AttributeValue` tokens report the right text. **The defect is entirely in cursor position, not in any single token's reported value**, which is exactly why a test asserting only on token *values* would pass while the scanner is still broken.

**The actual, reproducible consequence:** empirically verified with a minimal standalone reproduction of the exact cursor arithmetic. For input `src="a.png">` (an attribute value immediately followed by a tag-closing `>`, with no intervening whitespace — an extremely common real-world pattern, e.g. every void element and every last-attribute-before-close), the `AttributeValue` token correctly reports `"a.png"`, but **the cursor ends up positioned past the `>` character**, having silently consumed it as the spurious final `advance()`. The calling method's own subsequent check (`scanOpenOrSelfClosingTag()`'s `if (this.peek() === '>') this.advance();`) then finds nothing there — the tag is never correctly marked as closed, and every token produced for the remainder of the document is offset from where it should be.

**When this defect is masked vs. exposed:** if a quoted attribute is followed by at least one whitespace character before the next attribute name (the common, but not universal, formatting convention), the spurious extra `advance()` consumes that whitespace — which is harmless, since `consumeAttributes()`'s own loop unconditionally skips leading whitespace at the start of its next iteration regardless. The defect is **only visibly destructive** when a quoted value is followed immediately by `>` or `/` with zero intervening characters — but that is an entirely valid, common HTML pattern, not an edge case worth deprioritizing.

**Recommended fix:** remove exactly the two erroneous `advance()` calls (the one immediately after `valStart` is captured, and the one immediately after `valEnd` is captured) — the opening and closing quotes are each already consumed exactly once by the two `advance()` calls that remain.

```ts
// Corrected
if (quote === '"' || quote === "'") {
	this.advance(); // consume opening quote
	const valStart = this.currentLocation();
	this.consumeWhile(c => c !== quote);
	const valEnd = this.currentLocation();
	this.advance(); // consume closing quote
	this.tokens.push(this.token('AttributeValue', valStart, valEnd));
}
```

**Everything else in `HtmlScanner`** — tag name scanning, self-closing tag detection, close-tag scanning, text-node scanning, comment scanning, and the raw-text-mode tracking for `<script>`/`<style>` — was traced and found correct. This defect is isolated to the quoted-attribute-value branch specifically.

#### 5.4 `JsonScanner` — Confirmed Correct, No Changes

Re-verified string scanning (correct backslash-escape handling, matching `TypescriptScanner`'s approach), number scanning (correctly handles the integer/fraction/exponent grammar, including the JSON-specific requirement that a fractional part must be followed by at least one digit — `this.peek(1)` is checked before consuming the `.`, preventing `1.` with no trailing digits from being mis-scanned), keyword scanning (`true`/`false`/`null`, with anything else correctly falling through to an `Unknown` token rather than being silently accepted), and JSONC comment support (both `//` and `/* */`, needed for `tsconfig.json`-style files). No defects found.

---

## Part 2: Appendix — Testing Reference

### 1. Mocking Strategy

No mocking required for any scanner — every `scan()` method is a pure function of its constructor-supplied source string, with no I/O, no service dependencies, and no randomness. Tests are plain input-string-in, token-array-out assertions.

### 2. Test Scenarios

#### 2.1 `BaseScanner` (via a minimal test subclass)

| ID | Scenario | Expected Outcome |
|---|---|---|
| BS-01 | `\r\n` line ending | Line counter increments exactly once, not twice |
| BS-02 | `peek(offset)` past end of source | Returns `'\0'`, does not throw |
| BS-03 | `reset()` after `currentLocation()` snapshot | Cursor state exactly restored |

#### 2.2 `TypescriptScanner`

| ID | Scenario | Expected Outcome |
|---|---|---|
| TS-01 | `return /abc/;` | `/` tokenized as `Regex`, not `Operator` |
| TS-02 | `(a + b) / 2` | `/` tokenized as `Operator` (division), not `Regex` |
| TS-03 | `` `template ${x}` `` | Tokenized as a single `String` token including the interpolation syntax as literal text (this scanner does not parse template-literal interpolation as separate tokens — confirmed as current, accepted scope, not a defect: no consumer needs interpolation-aware tokenization today) |
| TS-04 | `// comment containing /` followed by real code with a `/` | The comment's internal `/` does not affect `isRegexStart()`'s decision for the later, real `/` |

#### 2.3 `CssScanner`

| ID | Scenario | Expected Outcome |
|---|---|---|
| CS-01 | `.my-class { color: red; }` | `BlockStart`/`BlockEnd` correctly bound the rule body |
| CS-02 | `@media (min-width: 768px) { ... }` | `@media` tokenized as `AtKeyword` |
| CS-03 | `url("image.png")` | Tokenized as `Function`, per the `(` -immediately-following-identifier check |
| CS-04 | Non-ASCII identifier (e.g. a CSS custom property using a non-Latin character) | Correctly accepted per the `charCodeAt(0) >= 0x00A0` allowance |

#### 2.4 `HtmlScanner`

| ID | Scenario | Expected Outcome | Status |
|---|---|---|---|
| HS-01 | `<div class="a">text</div>` | Correct `TagName`/`AttributeName`/`AttributeValue`/`Text`/`TagClose` sequence | Passes today (whitespace after the attribute masks the defect) |
| HS-02 | `<img src="a.png">` (attribute immediately followed by `>`, **no space**) | Cursor should land exactly after `>`, ready to scan the next token | **Fails today** — reproduces §5.3's defect directly; this must be the regression test written alongside the fix |
| HS-03 | `<br/>` (self-closing, no attributes) | Unaffected by §5.3's defect (no quoted attribute present) — included as a control case to confirm the fix doesn't regress the no-attribute path |
| HS-04 | `<script>const x = 1;</script>` | Raw-text mode correctly prevents `<`/`>` inside the script body from being mis-tokenized as tags |
| HS-05 | `<!-- comment -->` | Tokenized as a single `Comment` token |

### 3. Test Data Requirements

**Minimal reproduction fixture for HS-02** (the defect's regression test):
```html
<img src="a.png">
```
Assert: after tokenizing, either (a) a `TagSelfClose`/`TagClose`-equivalent token exists correctly bounding the `>`, or (b) whatever token immediately follows in the full document (e.g. a subsequent sibling element's `TagName`) is **not** missing its leading `<` character — either assertion directly catches the defect if it regresses.

---

## Final Architectural Notes

- §5.3 is the first genuine, reproducible **bug** found in this codebase's scanner/strategy/template layers across the entire span of this project — everything else found in prior phases was either a missing capability (a method that needed adding), a type/data mismatch, or a design decision needing to be made, but never an existing method that produces the wrong result on a common, valid input. Worth treating with commensurate priority: this is the one item in this whole body of specification work that represents actual broken behavior sitting in the repository today, not a gap or an open design question.
- **Confirmed, still true after this closer read:** no strategy currently instantiates or calls any scanner. `TypescriptStrategy`, `CssStrategy`, `HtmlStrategy`, and `JsonStrategy` all use plain regex or (for JSON) `jsonc-parser` directly against raw source text — never `TypescriptScanner`/`CssScanner`/`HtmlScanner`/`JsonScanner`. This means §5.3's defect, despite being real, is currently **latent** — it cannot corrupt anything in the live application today, because nothing calls the code path it lives in. It would only become consequential if `HtmlStrategy` (or `VueStrategy`'s eventual template-block handling, per the JSX/TSX discussion's mention of the same scanner) were rewritten to actually use `HtmlScanner`. Recommend fixing it regardless, precisely because it's cheap to fix now and will be much harder to notice once something depends on it.
- See `spec-strategies.md` (companion document) for the corresponding audit of the layer that was supposed to consume these scanners but doesn't yet.
