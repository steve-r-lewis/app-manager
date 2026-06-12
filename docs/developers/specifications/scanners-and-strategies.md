# App Manager — Lexical Analysis & Scanning Infrastructure Specification

## Project Context

The project is evolving from a collection of utility scanners into a structured compiler-grade lexical analysis platform capable of:

* multi-language tokenization
* composite file scanning
* embedded language delegation
* future parser integration
* semantic analysis
* tooling/LSP integration
* incremental analysis support

The architecture must support:

* HTML
* CSS
* TypeScript/JavaScript
* JSON
* Vue SFC
* future composite formats (Astro, Svelte, JSX/TSX, Markdown hybrids)

The system must prioritize:

* explicit architectural boundaries
* deterministic scanning
* extensibility
* composability
* low coupling
* infrastructure reuse
* predictable state-machine behavior
* testability

---

# 1. Architectural Principles

---

## 1.1 Layered Compiler Architecture

The system SHALL follow strict dependency direction.

```text id="v67fx2"
Source Text
    ↓
Character Stream Infrastructure
    ↓
Scanner Infrastructure
    ↓
Language Scanners
    ↓
Composite Scanners
    ↓
Parsers
    ↓
Semantic Analysis
    ↓
Tooling / LSP / Refactoring
```

Dependencies MUST only flow downward.

Upper layers MUST NOT be referenced by lower layers.

---

## 1.2 Separation of Concerns

The following concerns MUST remain isolated:

| Concern                | Responsibility                  |
| ---------------------- | ------------------------------- |
| SourceText             | Immutable source ownership      |
| CharacterStream        | Cursor traversal                |
| Token Infrastructure   | Token contracts                 |
| Scanner Infrastructure | Generic scanning lifecycle      |
| Language Scanner       | Language-specific state machine |
| Composite Scanner      | Embedded-language orchestration |
| Parser                 | AST generation                  |
| Semantic Layer         | Validation/refactoring          |

---

## 1.3 Explicit State Machines

All production scanners SHALL use explicit finite state machines.

Recursive helper-style scanners SHALL NOT be used for complex grammars.

Each scanner state MUST:

* consume input
  OR
* transition state
  OR
* terminate

No scanner state may idle indefinitely.

---

# 2. Directory Structure

---

## 2.1 Canonical Layout

```text"
app-manager/
├── app/
│   ├── scanners/
│   │   ├── BaseScanner.ts
│   │   ├── TokenFactory.ts
│   │   └── ScannerDiagnostics.ts
│   ├── services/
│   │   ├── 
│   │   └── 
│   └── types/
│       ├── baseCommandTypes.ts
│       ├── baseScannerTypes.ts
│       ├── characterStreamServiceTypes.ts
│       ├── codeServiceTypes.ts
│       ├── configServiceTypes.ts
│       ├── cssLanguageTypes.ts
│       ├── fileServiceTypes.ts
│       ├── githubServiceTypes.ts
│       ├── gitTypes.ts
│       ├── globals.d.ts
│       ├── htmlLanguageTypes.ts
│       ├── index.ts
│       ├── jsLanguageTypes.ts
│       ├── jsonLanguageTypes.ts
│       ├── llmServiceTypes.ts
│       ├── loggerServiceTypes.ts
│       ├── nuxtTypes.ts
│       ├── processServiceTypes.ts
│       ├── sfcTypes.ts
│       ├── templateTypes.ts
│       ├── tokenTypes.ts
│       ├── tsLanguageTypes.ts
│       └── utilsTypes.ts
└── tests/
    └── unit/



│   ├── core/
│   │   ├── tokenTypes.ts
│   │   ├── characterStreamTypes.ts
│   │   ├── baseScannerTypes.ts
│   │   └── diagnosticTypes.ts
│   │
│   ├── tokens/
│   │   ├── htmlTokenTypes.ts
│   │   ├── cssTokenTypes.ts
│   │   ├── tsTokenTypes.ts
│   │   └── jsonTokenTypes.ts
│   │
│   └── composite/
│       └── sfcTypes.ts





├── infrastructure/
│   ├── source/
│   │   ├── SourceText.ts
│   │   └── CharacterStream.ts
│   │
│   ├── scanners/
│   │   ├── BaseScanner.ts
│   │   ├── TokenFactory.ts
│   │   └── ScannerDiagnostics.ts
│   │
│   └── parsers/
│
├── scanners/
│   ├── html/
│   │   ├── HtmlScanner.ts
│   │   ├── HtmlScannerStates.ts
│   │   └── HtmlScannerModes.ts
│   │
│   ├── css/
│   │   ├── CssScanner.ts
│   │   └── CssScannerStates.ts
│   │
│   ├── ts/
│   │   ├── TsScanner.ts
│   │   └── TsScannerStates.ts
│   │
│   ├── json/
│   │   └── JsonScanner.ts
│   │
│   └── composite/
│       ├── VueScanner.ts
│       ├── AstroScanner.ts
│       └── SvelteScanner.ts
│
├── types/
│
└── tests/
    ├── infrastructure/
    ├── scanners/
    └── composite/
	

└── types

	
	
	
	
.
├── commands
│   ├── app
│   │   ├── runApp.ts
│   │   └── setupApp.ts
│   ├── baseCommand.ts
│   ├── commandRegistry.ts
│   ├── docs
│   │   └── runDocs.ts
│   ├── git
│   │   ├── addSubmodules.ts
│   │   ├── commitCommand.ts
│   │   ├── deleteRemoteRepos.ts
│   │   ├── initLayers.ts
│   │   ├── manageCommits.ts
│   │   ├── pushAll.ts
│   │   ├── pushCommand.ts
│   │   ├── pushToRemote.ts
│   │   ├── syncCommand.ts
│   │   ├── syncReposAll.ts
│   │   └── syncRepo.ts
│   ├── nuxt
│   │   ├── createLayer.ts
│   │   ├── extractDocs.ts
│   │   └── manageEnv.ts
│   ├── quality
│   │   └── runQuality.ts
│   └── utils
│       ├── addContributor.ts
│       ├── autoDoc.ts
│       ├── autoVersion.ts
│       ├── cleanLogs.ts
│       └── validateHeaders.ts
├── index.ts
├── modes
│   ├── headlessMode.ts
│   └── interactiveMode.ts
├── scanners
│   ├── baseScanner.ts
│   ├── cssScanner.ts
│   ├── htmlScanner.ts
│   ├── jsonScanner.ts
│   ├── typescriptScanner.ts
│   └── vueScanner.ts
├── services
│   ├── characterStreamService.ts
│   ├── codeService.ts
│   ├── configService.ts
│   ├── fileService.ts
│   ├── githubService.ts
│   ├── llmService.ts
│   ├── loggerService.ts
│   └── processService.ts
├── strategies
│   ├── cssStrategy.ts
│   ├── htmlStrategy.ts
│   ├── index.ts
│   ├── jsonStrategy.ts
│   ├── typescriptStrategy.ts
│   └── vueStrategy.ts
├── templates
│   ├── appConfigTemplate.ts
│   ├── contentConfigTemplate.ts
│   ├── editorconfigTemplate.ts
│   ├── envTemplate.ts
│   ├── gitignoreTemplate.ts
│   ├── gitmodulesTemplate.ts
│   ├── headerBlockTemplate.ts
│   ├── jsonTemplate.ts
│   ├── licenseTemplate.ts
│   ├── npmrcTemplate.ts
│   ├── nuxtConfigTemplate.ts
│   ├── nuxtrcTemplate.ts
│   ├── packageJsonTemplate.ts
│   ├── pnpmWorkspaceTemplate.ts
│   ├── readmeTemplate.ts
│   ├── rootConfigTemplate.ts
│   ├── tsconfigTemplate.ts
│   ├── typescriptTemplate.ts
│   ├── vitestConfigTemplate.ts
│   ├── vitestSetupTemplate.ts
│   └── vueComponentTemplate.ts
```

---

# 3. Core Infrastructure Specification

---

# 3.1 SourceText

## Responsibility

Immutable ownership of source content.

## Requirements

* MUST be immutable
* MUST preserve original source exactly
* MAY include metadata
* MUST NOT contain scanning logic

## Interface

```ts id="ijc7ol"
export class SourceText {
    readonly text: string;
    readonly fileName?: string;
}
```

---

# 3.2 CharacterStream

## Responsibility

Low-level traversal engine.

This is the foundational lexical infrastructure layer.

---

## Requirements

CharacterStream MUST support:

| Capability             | Required |
| ---------------------- | -------- |
| Lookahead              | YES      |
| Rewind                 | YES      |
| EOF detection          | YES      |
| Unicode-safe traversal | YES      |
| Line/column tracking   | YES      |
| CRLF handling          | YES      |
| Slice extraction       | YES      |
| Safe bounds handling   | YES      |
| Marker checkpoints     | YES      |

---

## Interface

```ts id="ig2zmy"
export interface CharacterStream {
    peek(offset?: number): string;

    advance(count?: number): string;

    eof(): boolean;

    position(): StreamPosition;

    mark(): StreamMark;

    reset(mark: StreamMark): void;

    match(value: string): boolean;

    slice(start: number, end: number): string;
}
```

---

## Constraints

CharacterStream MUST NOT:

* know token types
* emit tokens
* know languages
* know scanners
* know HTML/CSS/TS semantics

---

# 3.3 Token Infrastructure

---

## SourceLocation

```ts id="3buvxy"
export interface SourceLocation {
    readonly line: number;
    readonly column: number;
    readonly index: number;
}
```

---

## Token

```ts id="4q25mn"
export interface Token<TType extends string> {
    readonly type: TType;
    readonly value: string;
    readonly start: SourceLocation;
    readonly end: SourceLocation;
}
```

---

## TokenFactory

Responsible ONLY for token creation.

```ts id="80h5be"
export class TokenFactory<TType extends string> {
    create(
        type: TType,
        start: SourceLocation,
        end: SourceLocation,
        value: string
    ): Token<TType>;
}
```

---

# 4. Scanner Infrastructure

---

# 4.1 BaseScanner

## Responsibility

Minimal scanner lifecycle abstraction.

---

## Requirements

BaseScanner MUST:

* own stream reference
* own token collection
* expose scan contract

BaseScanner MUST NOT:

* contain language semantics
* contain HTML logic
* contain CSS logic
* contain parser logic

---

## Interface

```ts id="z38h8y"
export abstract class BaseScanner<TToken extends string> {
    protected readonly stream: CharacterStream;

    protected readonly tokens: Token<TToken>[];

    abstract scan(): readonly Token<TToken>[];
}
```

---

# 4.2 Scanner State Machines

All scanners SHALL implement explicit state transitions.

Example:

```ts id="t4dx5w"
enum HtmlScannerState {
    Data,
    TagOpen,
    TagName,
    AttributeName,
    AttributeValue,
    Comment,
    RawText
}
```

---

# 5. Language Scanner Specifications

---

# 5.1 HTML Scanner

---

## Responsibilities

The HTML scanner MUST:

* tokenize structural HTML syntax
* support raw-text elements
* preserve positional accuracy
* support embedded language delegation

---

## Supported Token Types

```ts id="i4x9mv"
export type HtmlTokenType =
    | 'TagOpen'
    | 'TagClose'
    | 'TagSelfClose'
    | 'TagName'
    | 'AttributeName'
    | 'AttributeValue'
    | 'Equals'
    | 'Text'
    | 'Comment'
    | 'Doctype'
    | 'Whitespace'
    | 'Unknown';
```

---

## Required States

| State          | Purpose               |
| -------------- | --------------------- |
| Data           | Default text mode     |
| TagOpen        | `<` handling          |
| TagName        | Tag scanning          |
| AttributeName  | Attribute key         |
| AttributeValue | Attribute parsing     |
| Comment        | `<!-- -->`            |
| RawText        | `<script>`, `<style>` |

---

## Raw Text Rules

Inside:

* `<script>`
* `<style>`

scanner MUST:

* suspend HTML parsing
* treat content as opaque text
* terminate ONLY on matching close tag

---

# 5.2 CSS Scanner

MUST support:

* selectors
* at-rules
* comments
* strings
* operators
* functions
* nested blocks

---

# 5.3 TypeScript Scanner

MUST support:

* keywords
* identifiers
* strings
* template literals
* regex literals
* comments
* operators
* punctuation
* blocks

Future JSX/TSX support SHALL be anticipated.

---

# 5.4 JSON Scanner

MUST support:

* strict JSON
* optional relaxed comments mode

---

# 6. Composite Scanner Architecture

---

# 6.1 Composite Scanners

Composite scanners coordinate multiple language scanners.

They MUST NOT directly lex all languages themselves.

---

# 6.2 Vue Scanner

Vue scanner SHALL delegate:

| Block        | Scanner     |
| ------------ | ----------- |
| `<template>` | HtmlScanner |
| `<script>`   | TsScanner   |
| `<style>`    | CssScanner  |

---

## Example

```html id="2c2u1r"
<template>
<div>Hello</div>
</template>

<script lang="ts">
const x = 1;
</script>
```

MUST produce independent delegated scanning regions.

---

# 6.3 SFC Block Contract

```ts id="j5v0gt"
export interface SfcBlock {
    readonly type: 'script' | 'template' | 'style' | 'custom';

    readonly content: string;

    readonly start: number;
    readonly end: number;

    readonly tagStart: number;
    readonly tagEnd: number;

    readonly attributes: Readonly<Record<string, string | boolean>>;
}
```

---

# 7. Error Handling & Diagnostics

---

# 7.1 Scanner Diagnostics

Scanners SHALL support non-fatal diagnostics.

Examples:

* unterminated string
* malformed tag
* invalid attribute
* unexpected EOF

---

## Diagnostic Interface

```ts id="p1j82d"
export interface ScannerDiagnostic {
    readonly severity: 'error' | 'warning';

    readonly message: string;

    readonly start: SourceLocation;

    readonly end: SourceLocation;
}
```

---

# 8. Testing Requirements

---

# 8.1 CharacterStream Tests

MUST test:

* line tracking
* column tracking
* CRLF normalization
* EOF handling
* rewind
* lookahead
* slicing
* Unicode safety

---

# 8.2 Scanner Contract Tests

Every scanner MUST test:

| Capability               | Required |
| ------------------------ | -------- |
| Ordering                 | YES      |
| Token integrity          | YES      |
| State transitions        | YES      |
| Invalid syntax recovery  | YES      |
| EOF safety               | YES      |
| Infinite loop prevention | YES      |

---

# 8.3 Composite Scanner Tests

MUST verify:

* region delegation
* embedded language boundaries
* nested scanner coordination

---

# 9. Performance Constraints

---

## Requirements

Scanners SHOULD:

* avoid unnecessary allocations
* minimize string copying
* prefer slicing over concatenation
* support large files safely

---

## Infinite Loop Protection

All scanner loops MUST guarantee progress.

Example invariant:

```text id="zvz6ln"
Every iteration MUST:
- consume characters
OR
- transition state
OR
- terminate
```

---

# 10. Future Extensions

Architecture MUST anticipate:

| Capability          | Planned |
| ------------------- | ------- |
| AST generation      | YES     |
| Incremental parsing | YES     |
| Syntax highlighting | YES     |
| LSP integration     | YES     |
| Semantic analysis   | YES     |
| Refactoring engine  | YES     |
| Formatter           | YES     |
| Source maps         | YES     |

---

# 11. Barrel File Policy

---

# Allowed

Boundary-facing barrels.

Example:

```ts id="k2ysu4"
types/index.ts
```

---

# Discouraged

Infrastructure internals importing mega-barrels.

Prefer:

```ts id="x5e8ub"
import type { Token } from '../types/core/tokenTypes.js';
```

NOT:

```ts id="wjfe9y"
import { Token } from '../types/index.js';
```

---

# 12. Architectural Constraints

---

## MUST NOT

* mix scanner logic into stream layer
* mix parsing into scanning
* embed language logic into BaseScanner
* allow circular dependencies
* create monolithic composite scanners

---

## MUST

* preserve explicit layering
* isolate language domains
* use explicit scanner states
* support delegated composite scanning
* preserve source accuracy

---

# 13. Final Architectural Position

This project SHALL be treated as:

```text id="glkmrf"
compiler infrastructure
```

NOT:

```text id="jmv2m9"
utility token parsing
```

All future design decisions MUST prioritize:

* scalability
* determinism
* composability
* maintainability
* language isolation
* tooling extensibility
* parser readiness
