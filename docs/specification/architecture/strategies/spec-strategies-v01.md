# Technical Specification Document

**Component:** Strategies Layer — Registry + Six Strategy Implementations
**Files:** `~/app/strategies/baseStrategy.ts`, `~/app/strategies/typescript/typescriptStrategy.ts`, `~/app/strategies/javascript/javascriptStrategy.ts`, `~/app/strategies/css/cssStrategy.ts`, `~/app/strategies/html/htmlStrategy.ts`, `~/app/strategies/json/jsonStrategy.ts`, `~/app/orchestrators/vue/vueOrchestrator.ts` (`VueStrategy`)
**Project:** `app-manager`
**Language:** TypeScript (Node.js runtime)

*Companion to `spec-scanners.md`. Written retroactively for the same reason. Re-reading three strategies in full for the first time (`CssStrategy`, `HtmlStrategy`, `JsonStrategy` — previously only excerpted) surfaced one real correction to an explanatory claim made in an earlier document (`spec-configService-settings.md`), detailed in §5.5 and fixed in that document by this spec.*

---

## Part 1: Operational & Design Specification

### 1. Component Overview

#### 1.1 Purpose

Six implementations of one shared interface, `ICodeStrategy`, dispatched by file extension via a small registry (`baseStrategy.ts`). Each strategy answers the same four questions for its language — what metadata does this file's header carry, how do I inject/replace that header, what code blocks in this file could be documented, and how do I inject documentation for one named block — behind one uniform call shape, so `codeService` (and everything built on top of it in Phases 6–7: `nuxt.extractDocs`, `utils.autoDoc`, `utils.autoVersion`, `utils.validateHeaders`) never needs to know which language it's touching.

#### 1.2 Role in System

**Architectural Role:** Code Intelligence / Strategy Pattern Layer, sitting between `codeService` (above) and the Scanners layer (below, `spec-scanners.md`) — though, as confirmed in that companion document, no strategy currently calls its matching scanner; every strategy parses raw text directly via regex (or, for JSON, via `jsonc-parser`).

### 2. Architecture & Patterns

#### 2.1 Design Patterns

| Pattern | Usage |
|---|---|
| **Strategy Pattern** | The textbook case — one interface (`ICodeStrategy`), six interchangeable implementations, selected by `getStrategyForFile()`'s extension-keyed registry lookup. `codeService` (and every consumer above it) is written entirely against the interface, never against a concrete class. |
| **Inheritance-as-Extension-Point** | `JavascriptStrategy extends TypescriptStrategy` with a deliberately empty body — not because JS and TS are the same, but as a documented, named seam for future JS-specific divergence (e.g. `.jsx`/`.mjs` handling) without ever touching `TypescriptStrategy` itself. |
| **Delegation/Composition** | `VueStrategy` composes a private `TypescriptStrategy` instance, extracting the `<script>`/`<script setup>` region, delegating every operation to the composed strategy, then splicing the (possibly modified) result back into the surrounding markup. |
| **Deliberate No-Op** | `HtmlStrategy`/`JsonStrategy`'s `findDocumentableBlocks()` both return `[]` unconditionally, and their `injectFunctionDoc()` both return the input unchanged — not incomplete implementations, but a correct reflection that HTML and (most) JSON have no "exportable code block" concept the way TS/JS/CSS selectors do. Confirmed intentional by both files' consistent, matching treatment of the same two methods.

#### 2.2 State Management

**Statefulness:** Every strategy is stateless except `VueStrategy`, which holds one piece of genuinely immutable state — a `private tsStrategy = new TypescriptStrategy();` instance constructed once per `VueStrategy` instance and never reassigned. `baseStrategy.ts`'s registry holds six singleton instances, one per strategy, constructed once at module load.

#### 2.3 Complexity Assessment

**Rating:** Medium overall, concentrated unevenly. `TypescriptStrategy` and `VueStrategy` (via composition) carry the most real logic. `CssStrategy.findDocumentableBlocks()` is a genuinely non-trivial state machine (buffering lines until a selector's `{` is found, with special-cased handling for `@keyframes` needing its *first* `{`, not its last). `HtmlStrategy`/`JsonStrategy`'s "code block" methods are trivial by design (§2.1). `JavascriptStrategy` has zero complexity of its own — it is, by design, entirely inherited.

### 3. Dependency Graph

#### 3.1 Internal Dependencies

| Dependency | Purpose |
|---|---|
| `~/app/types/index.ts` (`ICodeStrategy`, `CodeFileMetadata`, `CodeBlock`, `CodeBlockType`) | The shared interface and data shapes every strategy implements against. |
| `TypescriptStrategy` (imported by `JavascriptStrategy` and `VueStrategy`) | The one strategy every other TS/JS-adjacent strategy either extends or composes — the de facto reference implementation. |
| `jsonc-parser` (`JsonStrategy` only) | CST-based parsing and surgical edits — see §5.6 for the precise, and previously mis-described, shape of what this strategy's "complex schema" handling actually targets. |

#### 3.2 Coupling Analysis

**Coupling Level:** Low between strategies themselves (only `JavascriptStrategy`/`VueStrategy` depend on `TypescriptStrategy`, both deliberately). Medium coupling from `codeService` to this whole layer, entirely mediated through the `ICodeStrategy` interface — the correct shape of coupling for a Strategy pattern.

### 4. Data Types & Interfaces

#### 4.1 `ICodeStrategy` (Existing, Governing Interface)

```ts
export interface ICodeStrategy {
	parseMetadata(content: string): CodeFileMetadata;
	injectHeader(content: string, header: string): string;
	findDocumentableBlocks(content: string): CodeBlock[];
	injectFunctionDoc(content: string, functionName: string, docBlock: string): string;
}
```

#### 4.2 `baseStrategy.ts`'s Registry (Existing)

```ts
const strategyMap = new Map<string, ICodeStrategy>();
strategyMap.set('.ts', tsStrategy);
strategyMap.set('.js', jsStrategy);
strategyMap.set('.vue', vueStrategy);
strategyMap.set('.css', cssStrategy);
strategyMap.set('.html', htmlStrategy);
strategyMap.set('.json', jsonStrategy);

export function getStrategyForFile(filePath: string): ICodeStrategy {
	const ext = filePath.substring(filePath.lastIndexOf('.'));
	const strategy = strategyMap.get(ext);
	if (!strategy) throw new Error(`Unsupported file type: ${ext}`);
	return strategy;
}
```

### 5. Functional Logic Specification

#### 5.1 `TypescriptStrategy` — Confirmed Correct, No Changes

Re-verified `parseMetadata()` (tolerant `@version`/`@author` regex extraction, handling messy whitespace/tabs), `injectHeader()` (shebang preservation, existing-JSDoc-block stripping, correct reconstruction order), `findDocumentableBlocks()` (regex-based export matching, correct `const`→`variable` normalization, correct preceding-line `*/` check for `hasDoc`), and `injectFunctionDoc()` (confirmed in Phase 7 to be safe for repeated sequential calls, since it re-searches by name against whatever content it's given rather than a cached index — see `spec-utils-domain-commands.md` §1.3 for the full trace). No defects found.

#### 5.2 `JavascriptStrategy` — Confirmed Exactly as Documented

```ts
export class JavascriptStrategy extends TypescriptStrategy {
	// Intentionally empty.
}
```
The file's own revision history records that this replaced an earlier byte-for-byte duplicate of `TypescriptStrategy` — a deliberate deduplication, not an oversight. No changes needed; this is the correct shape for an extension point that currently has nothing to extend.

#### 5.3 `CssStrategy` — Confirmed Correct, One Minor Scope Limitation Noted

`findDocumentableBlocks()`'s line-buffering approach correctly handles the `@keyframes`-needs-first-brace special case. `injectFunctionDoc()`'s target-matching, however, requires the **entire selector to appear on a single line**, exactly matching the whitespace-normalized form `findDocumentableBlocks()` would have buffered it into (`trimmed === '${functionName} {'`, with one fallback for internal-whitespace normalization). A multi-line selector (e.g. a long comma-separated selector list split across several lines) would be found correctly by `findDocumentableBlocks()` (which buffers across lines) but could fail to be re-located by `injectFunctionDoc()`'s single-line match — a real but narrow scope limitation, not a defect on the scale of `spec-scanners.md` §5.3's `HtmlScanner` finding, since single-line selectors are the overwhelmingly common case and the failure mode here is "documentation injection silently does nothing" (the method's existing `if (targetIdx === -1) return content;` guard), not corrupted output.

#### 5.4 `HtmlStrategy` — Confirmed Correct, Deliberate No-Ops Verified

`parseMetadata()`/`injectHeader()` correctly operate on the first HTML comment found (`<!--...-->`), with `injectHeader()`'s existing-top-comment detection anchored to the start of the file (`^\s*<!--...`) so it doesn't accidentally replace an unrelated comment appearing later in the document. `findDocumentableBlocks()` returning `[]` and `injectFunctionDoc()` returning its input unchanged are both confirmed **intentional** — verified by their exact, matching treatment in `JsonStrategy` (§5.5), which is strong evidence this is a deliberate pattern for "file types with no code-block concept," not two independent oversights that happen to look the same.

**Consequence for `nuxt.extractDocs` (Phase 6), worth restating here since it was specified before this file was read in full:** calling `codeService.inspect()` on an `.html` file will always return an empty block list. This is correct, expected behavior — `extractDocs`'s report will show "(no documentable blocks found)" for HTML files, which is an accurate reflection of the file type, not a bug in either component.

#### 5.5 `JsonStrategy` — Confirmed Correct, But More Sophisticated (and More Narrowly Scoped) Than Previously Described

`findDocumentableBlocks()`/`injectFunctionDoc()` are no-ops, matching `HtmlStrategy` (§5.4) — confirmed intentional.

**`parseMetadata()`/`injectHeader()`, however, are more sophisticated than this project's earlier description of them, in a way that narrows exactly which files benefit from them.** Both methods branch on whether the parsed JSON has a truthy top-level `metadataEntity` key:

- **If present** ("complex schema"): targets `metadataEntity.development.schemaVersion` for version, `metadataEntity.description` for description, `metadataEntity.author` for author — and `injectHeader()` will even **auto-create** the `development` object if it's missing, specifically for the version field. This exact `metadataEntity.development.schemaVersion` shape matches `jsonTemplate.ts`'s output (`metadataEntity: { description, environment, development: { ..., schemaVersion }, production: {...} }`, per the Phase 5 templates review) — a data-catalog-style schema, not the flat shape used elsewhere.
- **If absent** ("standard schema"): targets plain top-level `version`/`description`/`author` keys — the shape most ordinary `package.json`-style files would have.

**The correction this requires to an earlier document:** `app-manager-command-specs.md` §10.4 stated that the settings files' `metadataEntity` envelope "is already a recognized schema in this codebase's file-handling layer, so both settings files get CST-preserving surgical edits... essentially for free" — citing `JsonStrategy`'s schema recognition as the mechanism. **Having now read `JsonStrategy` in full, this citation was inaccurate.** `llmRegistry.json`, `repositoryRegistry.json`, and the new `app-manager/settings.json` all use a **flat** `metadataEntity` shape (`{ description, targetFile, currentVersion, createdAt, revisionHistory }`) — not the `development.schemaVersion` nested shape `JsonStrategy` specifically detects. If `JsonStrategy.injectHeader()` were ever called against a settings file, it would see a truthy `metadataEntity`, take the "complex schema" branch, and attempt to write to `metadataEntity.development.schemaVersion` — a path that doesn't exist in the settings schema, incorrectly creating a stray `development` substructure that has no meaning there.

**Why this correction doesn't require any functional change, only a corrected explanation:** checked against `ConfigService`'s actual specified design (`spec-configService-settings.md` §5.4) — `setSetting()`/`unsetSetting()` never call `JsonStrategy` at all. They go through `fileService.update()` directly, which does its own independent `jsonc-parser` `modify()`/`applyEdits()` calls, entirely bypassing `JsonStrategy`. So the *design* was always correct; only the *stated reasoning* for why it was safe was wrong, having been written before this file was read in full. **The corrected claim:** the settings files' surgical-edit behavior comes from `fileService.update()`'s own direct `jsonc-parser` usage (§5.4/§5.7 of `spec-fileService.md`), not from any `JsonStrategy` schema recognition — `JsonStrategy` and `ConfigService`/`fileService` are two entirely separate consumers of `jsonc-parser`, coincidentally both using it, never calling into each other.

#### 5.6 `VueStrategy` — Confirmed Correct, No Changes

Re-verified `extractScript()` (correctly prioritizes `<script setup>` over legacy `<script>`), every method's delegate-to-`TypescriptStrategy`-then-splice-back pattern, and `findDocumentableBlocks()`'s line-offset correction (adding the script block's own starting line to every returned block's `startLine`/`endLine`, so callers see line numbers correct for the whole `.vue` file rather than just the extracted fragment). No defects found. Confirmed, per the earlier architecture audit, that `<template>`/`<style>` blocks remain completely untouched by every method — this strategy only ever operates on the `<script>` region, exactly as documented.

---

## Part 2: Appendix — Testing Reference

### 1. Mocking Strategy

No mocking required for any strategy — every method is a pure function of its input string(s), identical in testability posture to the Scanners layer. `JsonStrategy` is the only one with an external dependency (`jsonc-parser`), and its `parse`/`modify`/`applyEdits` functions are themselves pure, so even that strategy needs no mocks — only realistic input strings.

### 2. Test Scenarios

#### 2.1 `getStrategyForFile()` (Registry)

| ID | Scenario | Expected Outcome |
|---|---|---|
| SF-01 | `.ts`/`.js`/`.vue`/`.css`/`.html`/`.json` each | Correct, distinct strategy instance returned for each |
| SF-02 | Unsupported extension (e.g. `.py`) | Throws `Unsupported file type: .py` |
| SF-03 | Same extension requested twice | Returns the exact same singleton instance both times (not a new instance per call) |

#### 2.2 `CssStrategy`

| ID | Scenario | Expected Outcome |
|---|---|---|
| CSS-01 | `@keyframes fade { from { opacity: 0; } to { opacity: 1; } }` | Block name is `@keyframes fade` — confirms the first-`{`-not-last-`{` special case |
| CSS-02 | Multi-line selector, then `injectFunctionDoc()` called with the exact multi-line-joined name | Fails to find the target (per §5.3's documented limitation) — this is the regression test proving the limitation is real and currently unaddressed, not a hypothetical |
| CSS-03 | Container at-rule (e.g. `@media (...) { .a { color: red; } }`) | The `@media` wrapper itself is **not** added as a block (`isAtRule && !isKeyframes` exclusion); the nested `.a` selector is still found on its own line |

#### 2.3 `HtmlStrategy`/`JsonStrategy` No-Op Confirmation

| ID | Scenario | Expected Outcome |
|---|---|---|
| NO-01 | `HtmlStrategy.findDocumentableBlocks()` on any non-empty HTML | Always `[]` |
| NO-02 | `JsonStrategy.findDocumentableBlocks()` on any non-empty JSON | Always `[]` |
| NO-03 | Either strategy's `injectFunctionDoc()` called with any arguments | Returns the input `content` completely unchanged |

#### 2.4 `JsonStrategy` Schema Branching (§5.5)

| ID | Scenario | Expected Outcome |
|---|---|---|
| JS-01 | `injectHeader()` on a plain `package.json`-shaped file (no `metadataEntity`) | Targets top-level `version`/`description`/`author` — the "standard schema" branch |
| JS-02 | `injectHeader()` on a `jsonTemplate.ts`-shaped file (`metadataEntity.development.schemaVersion` already present) | Correctly targets the nested path |
| JS-03 | `injectHeader()` on a file with `metadataEntity` present but `development` missing | `development` object auto-created, containing the new `schemaVersion` |
| JS-04 | **New — the corrective test this finding requires:** `injectHeader()` called on a flat-`metadataEntity`-shaped file (e.g. matching `app-manager/settings.json`'s actual shape — `metadataEntity.currentVersion`, no `development` key) | Takes the "complex schema" branch (since `metadataEntity` is truthy) and writes to `metadataEntity.development.schemaVersion`, **creating an incorrect stray field** — this test exists specifically to document that `JsonStrategy.injectHeader()` must never be called against a settings file, confirming by demonstration why `ConfigService`'s design correctly avoids it |

### 3. Test Data Requirements

**Flat-schema fixture, for JS-04:**
```json
{
  "metadataEntity": {
    "description": "App Manager settings",
    "targetFile": "~/app-manager/settings.json",
    "currentVersion": "1.0.0",
    "createdAt": "2026-01-01T00:00:00.000Z",
    "revisionHistory": []
  },
  "app-manager": {}
}
```

---

## Final Architectural Notes

- §5.5's correction is the most valuable finding in this document, and it's worth being precise about its actual severity: **it is a documentation correction, not a functional bug.** `ConfigService`'s real, specified, and already-fully-tested design (`spec-configService-settings.md`/`spec-fileService.md`) never calls `JsonStrategy` at all — the settings persistence layer was always safe. What was wrong was the *stated reason* it was safe, written before this file had been read past its docstring. This is exactly the risk of citing a component's behavior from its description rather than its implementation — the same category of error, on a smaller scale, as the Phase 5 false-stub-classification problem.
- Combined with `spec-scanners.md`, this pair of documents closes the last remaining gap in specification coverage identified across this entire project — every service, every command, and now every layer of the code-intelligence stack (scanners, strategies; templates covered separately in `spec-templates.md`) has a Part 1/Part 2 technical specification.
- **Confirmed, unchanged from the original architecture audit:** the entire Strategies layer remains uncalled by any command in `app/commands/` today, exactly as documented at the very start of this project — `codeService` (their sole consumer) only gained real callers starting in Phase 6. This document's corrections and the one scope limitation found (§5.3) apply to code that is fully specified and ready, but — like the Scanners layer beneath it — still latent until Phase 6/7's commands are actually implemented.
