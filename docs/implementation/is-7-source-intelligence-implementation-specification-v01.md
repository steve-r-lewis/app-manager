# IS-7 — Source Intelligence Implementation Specification

> **Document type:** Level 4 Implementation Specification
>
> **Status:** Version 1 implementation baseline
>
> **Implementation ID:** IS-7
>
> **Primary Detailed Design:** [DD-2.4 — Source Intelligence](../dd_2_shared_capabilities/dd-2-4-source-intelligence-detailed-design-v01.md)
>
> **Related Detailed Designs:** [DD-2.1 — Resource Access](../dd_2_shared_capabilities/dd-2-1-resource-access-detailed-design-v01.md), [DD-2.5 — Source Transformation](../dd_2_shared_capabilities/dd-2-5-source-transformation-detailed-design-v01.md), [DD-1.3 — Managed Project](../dd_1_application_core/dd-1-3-managed-project-detailed-design-v01.md), [DD-1.4 — Configuration Resolution](../dd_1_application_core/dd-1-4-configuration-resolution-detailed-design-v01.md), [DD-1.5 — Application Engine](../dd_1_application_core/dd-1-5-application-engine-detailed-design-v01.md)
>
> **Primary Functional authority:** [Source Transformation Functional Specification](../functional/source-transformation-functional-specification-v01.md)
>
> **Runtime decision:** [ADR-0001 — Primary Application Runtime](../project_management/decisions/adr-0001-primary-application-runtime.md)
>
> **Register:** [AppManager Implementation Specification](implementation-specification-v01.md)
>
> **Governing plan:** [Implementation Specification Plan](../project_management/implementation-specification-plan-v01.md)

## 1. Purpose

IS-7 defines the concrete Node.js/TypeScript implementation of the Version 1 Source Intelligence capability.

Its job is to recognize bounded source, obtain read-only structural evidence through suitable providers, and normalize that evidence into AppManager-owned source facts without acquiring transformation, domain, managed-scope or final application authority.

The governing implementation rule is:

> **Source Intelligence observes a supplied source snapshot and returns snapshot-bound structural evidence; it does not decide what AppManager should change, authorize or accept.**

Version 1 preserves useful scanner, strategy, JSON/JSONC and Vue-recognition work from the current repository where those mechanisms can satisfy the approved read-only contracts. It does not promote the current token model, `ICodeStrategy`, extension-only dispatch, regex techniques or current source directory topology into permanent application semantics.

---

## 2. Scope and Non-Ownership

IS-7 owns concrete implementation for:

- explicit source references and immutable analysis snapshots;
- source-kind and language recognition;
- fact-class-specific capability discovery;
- bounded provider selection;
- normalized source locations and structural regions;
- declaration and documentable-block facts;
- metadata/header facts;
- documentation-presence facts;
- configuration-structure facts;
- composite and embedded-source regions;
- normalized recognition confidence, provenance and diagnostics;
- supported, absent, unsupported, malformed, ambiguous, partial, cancelled and provider-failed analysis states;
- source-revision binding and stale-evidence representation;
- optional revision-bound analysis caching;
- cancellation propagation to providers that support it;
- sensitive-source minimization;
- deterministic provider doubles and immutable-fixture conformance tests;
- migration of conforming read-only mechanics from the current scanner, strategy and `CodeService` implementation.

IS-7 does **not** own:

- application command/use-case identity or dispatch;
- Managed Project identity, topology, scope or target eligibility;
- effective-configuration precedence;
- filesystem mutation or arbitrary filesystem discovery;
- transformation intent, edit planning, mutation or source-level transformation acceptance;
- header, JSDoc or configuration injection;
- documentation-generation policy or documentation quality acceptance;
- Nuxt-layer/project semantics;
- Quality gate semantics;
- AI context disclosure or provider authority;
- repository workflow semantics;
- final DD-1.2/DD-1.5 application outcomes.

A recognized declaration, configuration path, metadata region or Vue block is evidence only. Recognition never makes the observed region mutable.

---

## 3. Concrete Module Boundary

The target Version 1 layout is:

```text
app/
└── capabilities/
    └── source_intelligence/
        ├── source-intelligence.ts
        ├── contracts/
        │   ├── source-reference.ts
        │   ├── source-snapshot.ts
        │   ├── source-recognition.ts
        │   ├── source-facts.ts
        │   ├── source-regions.ts
        │   ├── source-diagnostics.ts
        │   └── source-results.ts
        ├── provider-resolver.ts
        ├── fact-normalizer.ts
        ├── analysis-cache.ts
        └── providers/
            ├── lexical/
            ├── structured/
            └── composite/
```

The `contracts/` directory is capability-local deliberately. Placement reflects semantic ownership, not consumer count. Source Intelligence contracts remain owned and versioned by IS-7 even when Documentation, Nuxt, Quality, AI, Source Transformation or several domains consume them. A contract moves to an application-wide shared location only when its semantic ownership is genuinely application-wide under another approved authority.

The provider subdirectories describe implementation mechanism families, not public source-kind taxonomies. Version 1 may reorganize them if a simpler layout proves clearer during coding without changing the public IS-7 contract.

### 3.1 Public capability shape

`source-intelligence.ts` shall expose an AppManager-facing capability structurally equivalent to:

```ts
export interface SourceIntelligence {
  capabilities(request: SourceCapabilityRequest): SourceCapabilityResult;
  recognize(request: SourceRecognitionRequest): Promise<SourceAnalysisResult<SourceRecognition>>;
  analyze(request: SourceAnalysisRequest): Promise<SourceAnalysisResult<SourceAnalysis>>;
}
```

`recognize()` establishes source-kind/language/support evidence without hiding recognition assumptions inside structural analysis.

`analyze()` accepts requested fact classes and returns only the facts needed for the bounded analytical purpose. It shall not expose a generic parser/AST object or an unrestricted provider callback.

`capabilities()` reports configured Version 1 support by source kind, language/format and fact class. Capability availability does not imply managed scope or mutation eligibility.

### 3.2 Internal provider contract

Providers implement a narrow internal contract such as:

```ts
interface SourceAnalysisProvider {
  readonly id: SourceProviderId;
  describeCapabilities(): readonly SourceProviderCapability[];
  recognize(request: ProviderRecognitionRequest): Promise<ProviderRecognitionEvidence>;
  analyze(request: ProviderAnalysisRequest): Promise<ProviderAnalysisEvidence>;
}
```

Provider requests contain immutable source content/snapshot data, hints, requested fact classes, bounded region and cancellation context. They do not receive arbitrary project roots merely so they can discover more files.

Provider results are internal evidence. `fact-normalizer.ts` converts them to AppManager-owned facts before general consumers receive them.

There is no public `getScannerForFile()`, `getStrategyForFile()`, `parseAst()` or `scanTokens()` escape hatch.

---

## 4. Source References and Immutable Snapshots

### 4.1 Source reference

IS-7 shall distinguish logical source identity from source content:

```ts
export interface SourceRef {
  readonly kind: 'source';
  readonly resource: FileResourceRef;
  readonly logicalId?: string;
  readonly region?: SourceRegionRef;
}
```

`FileResourceRef` is the IS-4 resource identity supplied by an owning caller. IS-7 does not derive Managed Project identity from it.

A bounded embedded region may be referenced only when its coordinates are tied to the containing snapshot.

### 4.2 Snapshot

The normal analysis input is an immutable source snapshot:

```ts
export interface SourceSnapshot {
  readonly source: SourceRef;
  readonly content: string;
  readonly revision: ResourceRevision;
  readonly mediaHint?: string;
  readonly sensitivity?: SourceSensitivity;
}
```

The exact IS-4 revision type may be imported or adapted according to the final IS-4 code contract. IS-7 shall not invent a competing filesystem revision authority.

The snapshot is the unit against which facts are true. Every returned analysis result carries the analyzed revision or equivalent snapshot identity.

### 4.3 Acquisition

The preferred boundary is that the owning use case or an injected IS-7 coordinator obtains content through IS-4 and passes the resulting immutable snapshot into analysis. If `DefaultSourceIntelligence` is configured to acquire a supplied `SourceRef` itself, it may do so only through injected IS-4 Resource Access using the exact supplied reference and constraints.

Providers themselves shall not call `node:fs`, `fileService`, `process.cwd()` or arbitrary project traversal APIs to refresh or broaden the source.

This preserves one authoritative acquisition path and prevents provider convenience rereads from changing scope or freshness semantics.

---

## 5. Analysis Requests and Fact Classes

A Source Intelligence analysis request shall be explicit about the requested evidence:

```ts
export interface SourceAnalysisRequest {
  readonly snapshot: SourceSnapshot;
  readonly hints?: SourceRecognitionHints;
  readonly facts: ReadonlySet<SourceFactClass>;
  readonly region?: SourceRegionRef;
  readonly configuration?: SourceIntelligenceConfiguration;
  readonly signal?: AbortSignal;
  readonly correlationId?: string;
}
```

Version 1 fact classes shall include at least the categories required by approved consumers:

- `source_kind`;
- `structural_regions`;
- `declarations`;
- `metadata`;
- `documentation_presence`;
- `configuration_structure`.

Additional narrowly defined fact classes may be added when a registered consumer demonstrates a requirement. Provider-native token streams, complete syntax trees and arbitrary query languages are not fact classes merely because a provider can expose them.

The resolver shall request the least provider work sufficient for the supplied fact classes. A request for metadata shall not automatically perform full declaration extraction when it is unnecessary.

---

## 6. Source-Kind and Language Recognition

Recognition shall combine available bounded evidence rather than treating filename extension as authority.

`SourceRecognition` shall be capable of representing:

```ts
export interface SourceRecognition {
  readonly status: 'recognized' | 'ambiguous' | 'unsupported' | 'malformed' | 'indeterminate';
  readonly sourceKind?: SourceKind;
  readonly language?: SourceLanguage;
  readonly alternatives?: readonly SourceRecognitionCandidate[];
  readonly support: readonly SourceFactSupport[];
  readonly provenance: readonly SourceProvenance[];
  readonly diagnostics: readonly SourceDiagnostic[];
}
```

Recognition evidence may include:

- caller hints;
- filename/extension convention;
- lexical/syntactic markers;
- composite-container markers;
- structured-format parse evidence;
- configured provider support.

Rules:

1. extension evidence may narrow provider candidates but does not by itself establish strong structural certainty where stronger evidence is required;
2. contradictory strong evidence is preserved as ambiguity or diagnostic evidence;
3. provider registration order never resolves material ambiguity;
4. unsupported source and unsupported requested fact class remain distinguishable;
5. a source may be recognized while only a subset of fact classes is supported.

The current extension map in `app/strategies/baseStrategy.ts` is therefore not the target recognition contract.

---

## 7. Provider Resolution and Capability Discovery

`provider-resolver.ts` shall resolve eligible providers by the tuple of:

```text
recognized/hinted source kind
+ language/format where material
+ requested fact class
+ configured provider availability
```

Resolution is deterministic for equivalent inputs.

The resolver may choose one provider, compose complementary providers, or preserve a material conflict. Composition is permitted only when the resulting facts can be normalized without pretending that weaker evidence has stronger certainty.

Provider precedence may be configured only as governed effective configuration from IS-3. It shall not be an undocumented `Map` insertion-order policy.

A fallback from a structural provider to a heuristic provider is permitted only when the requested contract allows the weaker semantics. Any material certainty reduction is represented in provenance/confidence/diagnostics.

Version 1 does not introduce dynamic third-party parser plugins, RPC workers or a language-neutral provider protocol. Providers are TypeScript implementations wired explicitly by IS-23.

---

## 8. Structural Fact Model

### 8.1 Capability-owned contracts

Source facts are discriminated AppManager-owned records. They are not a single universal `StructuralFact` bag and are not shared merely because several capabilities have records with similar fields.

A common internal base may carry genuinely common Source Intelligence evidence:

```ts
interface SourceFactEvidence {
  readonly factId: string;
  readonly source: SourceRef;
  readonly revision: ResourceRevision;
  readonly region?: SourceRange;
  readonly provenance: readonly SourceProvenance[];
  readonly certainty?: SourceCertainty;
  readonly diagnostics?: readonly SourceDiagnostic[];
}
```

Concrete facts retain their own semantics, for example:

```ts
export type SourceFact =
  | DeclarationFact
  | MetadataFact
  | DocumentationPresenceFact
  | ConfigurationStructureFact
  | StructuralRegionFact;
```

This common base is an IS-7 implementation convenience and semantic evidence contract. It shall not be promoted into a generic cross-capability `StructuralFact` framework without a separate demonstrated authority and reconciliation.

### 8.2 Declaration facts

`DeclarationFact` shall carry only structural information required by consumers, such as:

- normalized declaration identity/name;
- declaration category;
- export/public relevance where reliably knowable;
- containing region;
- exact source range;
- bounded signature/descriptor where requested;
- documentation-presence relation where established;
- provenance/certainty.

A declaration fact does not identify an approved transformation target.

### 8.3 Metadata facts

Metadata facts preserve recognized schema identity and distinguish fields that happen to share names across different schemas. They may report field presence/value-kind and bounded values where the fact contract requires them, but shall not infer effective AppManager configuration.

### 8.4 Documentation-presence facts

Documentation association states shall include at least:

```text
present
absent
ambiguous
unsupported
malformed
```

`present` is not a Quality or Documentation-capability judgement about adequacy, correctness or currency.

### 8.5 Configuration-structure facts

Configuration facts describe source structure such as object/property paths, value kinds, duplicates/conflicts and source ranges. They do not resolve configuration precedence or applicability.

---

## 9. Source Locations and Range Semantics

IS-7 shall use one normalized range convention for public facts:

```ts
export interface SourcePosition {
  readonly offset: number;
  readonly line: number;
  readonly column: number;
}

export interface SourceRange {
  readonly start: SourcePosition;
  readonly end: SourcePosition;
}
```

Public ranges are zero-based offsets with **half-open** semantics `[start.offset, end.offset)`. Line and column numbering shall be defined once in the contract and normalized from providers; Version 1 shall use one-based line and column values for human-facing correlation while offsets remain zero-based.

Providers may use different native conventions internally, but normalization tests must prove correct conversion.

Ranges identify where evidence was observed. They are not edit instructions.

The existing `SourceLocation` cursor mechanics are useful implementation material, but current scanner line/index behaviour is not automatically the public range contract.

---

## 10. Composite and Embedded Source

Version 1 shall support composite-source representation required for Vue single-file components and may use the same model for later embedded-source formats.

A normalized region shall preserve:

- outer source identity;
- region kind such as script/template/style/custom;
- embedded language/format when recognized;
- opening/closing/container range where relevant;
- content range;
- parent region identity;
- attributes needed for recognition;
- mapping from region-local provider coordinates to whole-source coordinates.

Provider analysis of an embedded region operates on the bounded region content and maps resulting facts back to whole-resource coordinates before they cross the capability boundary.

Vue analysis shall not permanently assume that only `<script>` matters. The requested fact class determines which Vue regions require analysis.

The current `VueStrategy` offset logic is useful evidence but requires adaptation because it adjusts line numbers without establishing one complete offset/range mapping contract.

---

## 11. Version 1 Provider Mechanisms

### 11.1 General rule

Provider technology follows the semantics required by the fact class. Version 1 deliberately permits more than one analysis mechanism.

The production composition may include:

- retained/adapted hand-written lexical scanners for bounded lexical facts;
- bounded regex recognizers where tests establish sufficient semantics;
- `jsonc-parser` for JSON/JSONC structure where comments and malformed-input diagnostics matter;
- composite Vue region recognition;
- TypeScript compiler APIs only where a required fact cannot be established safely by the retained bounded mechanisms.

IS-7 does not require introducing a compiler API merely because TypeScript source exists, and it does not prohibit one where concrete fact requirements justify it.

### 11.2 Lexical scanners

`BaseScanner` and language-specific scanners may be retained as internal provider utilities where their token streams materially help derive required facts.

Their tokens remain provider-native. General consumers shall not depend on `Token<TTokenType>`, current token unions or scanner classes.

Scanner correctness includes exact source ranges, string/comment handling, malformed-input termination and bounded resource use.

### 11.3 Current strategies

Read-only portions of TypeScript/JavaScript/CSS/HTML/JSON/Vue strategies may be adapted into IS-7 providers or fact extractors.

Mutation methods such as `injectHeader()` and `injectFunctionDoc()` are not IS-7 operations and move to IS-8 Source Transformation or another owning transformation implementation.

A class that currently contains both read and mutation methods may be split rather than retained as one target class.

### 11.4 JSON and JSONC

`jsonc-parser` is retained initially as a suitable Version 1 structured provider for JSON/JSONC recognition because it can provide tolerant parse/structure evidence without executing source. Its public objects, `ParseError` values and edit APIs do not cross IS-7.

IS-7 uses only read/recognition functionality. `modify()` and `applyEdits()` belong to IS-8 if retained for transformation.

### 11.5 JavaScript and TypeScript

JavaScript and TypeScript may share implementation utilities where their requested structural semantics are genuinely equivalent. JavaScript shall nevertheless have an explicit recognition identity; inheritance or provider reuse is an implementation choice, not a claim that the languages are semantically identical.

---

## 12. Unsupported, Absent, Malformed, Ambiguous and Partial Results

`SourceAnalysisResult<T>` shall not collapse materially different states into exceptions or Booleans.

The normalized result shall be structurally equivalent to:

```ts
export interface SourceAnalysisResult<T> {
  readonly status:
    | 'complete'
    | 'partial'
    | 'unsupported_source'
    | 'unsupported_fact'
    | 'malformed'
    | 'ambiguous'
    | 'provider_unavailable'
    | 'provider_failure'
    | 'cancelled';
  readonly value?: T;
  readonly revision: ResourceRevision;
  readonly diagnostics: readonly SourceDiagnostic[];
  readonly providerEvidence: readonly SourceProviderEvidence[];
}
```

A requested fact that is reliably absent is represented inside a successful complete/partial analysis as an explicit absence fact where the fact contract requires it. It is not `provider_failure`.

Partial results retain reliable facts and identify which requested fact classes remain unresolved. Consumers shall not infer completeness merely because `value` exists.

Provider exceptions are caught at the capability boundary and normalized. Raw parser/compiler/scanner exceptions and stack traces do not become general Source Intelligence diagnostics.

---

## 13. Provenance, Confidence and Conflicting Evidence

Each fact class shall preserve enough provenance to explain how the fact was established when that matters to downstream correctness.

`SourceProvenance` may include:

- provider identifier and provider version where useful;
- evidence mechanism class such as lexical, structured, composite or heuristic;
- supplied hint contribution;
- bounded source region;
- normalization version where useful.

Confidence shall not be invented as arbitrary pseudo-precision. Version 1 should prefer semantic certainty categories such as:

```text
certain
strong
heuristic
ambiguous
```

where a consumer genuinely needs the distinction.

If providers materially disagree, the resolver/normalizer shall preserve the conflict rather than choose the first result. A consumer receives an ambiguous/partial result with competing normalized evidence sufficient for application-level handling.

---

## 14. Diagnostics and Failure Normalization

Stable diagnostic codes shall include at least:

```text
unsupported_source_kind
unsupported_fact_class
malformed_source
ambiguous_source_kind
ambiguous_structure
conflicting_evidence
partial_analysis
provider_unavailable
provider_failure
source_unreadable
stale_snapshot
analysis_cancelled
sensitive_content_restricted
resource_limit_exceeded
```

Diagnostics may include normalized source ranges and bounded provider detail. They shall not include entire source files, secret-bearing values, provider stack traces or arbitrary parser object serialization.

A diagnostic is capability evidence. It does not choose the final AppManager outcome.

---

## 15. Determinism and Interaction-Mode Independence

Equivalent source snapshot, requested facts, effective configuration and provider set shall produce materially equivalent normalized facts regardless of whether the caller originated from TUI, Headless or a future host adapter.

IS-7 contains no interactive prompts.

When recognition is materially ambiguous, IS-7 returns ambiguity. Any permitted user or automation disambiguation occurs through the owning invocation/use-case path and may result in a new explicit analysis request.

Provider iteration order, object property enumeration order, filesystem order and prior cache warming shall not alter semantic results.

---

## 16. Revision Binding, Caching and Stale Evidence

Every result is bound to the supplied source revision/snapshot identity.

IS-7 does not claim that an old fact remains current after the source changes. Consequential downstream consumers such as IS-8 shall compare the fact/snapshot revision with the source state required by their own preconditions before applying a change.

An optional in-memory `analysis-cache.ts` may cache immutable analysis by a key including at least:

```text
source revision/digest
+ bounded region identity
+ requested fact classes
+ recognition-relevant configuration
+ provider/normalizer semantic version
```

Caching is an optimization, not authority. Cache misses and cache hits are semantically invisible to callers except optional diagnostic/telemetry data.

Version 1 does not require persistent cross-process analysis caching.

---

## 17. Cancellation and Resource Bounds

`AbortSignal` from the owning operation shall be checked before provider selection, before expensive analysis stages and at provider-supported safe points.

Cancellation returns `cancelled` with only facts reliably established before cancellation and explicitly marked partial where returned. IS-7 shall not fabricate completion.

Providers processing untrusted source shall use practical bounds appropriate to their mechanism, including where relevant:

- maximum source size inherited from the bounded Resource Access request/configuration;
- bounded recursion/nesting;
- bounded diagnostic count;
- no unbounded catastrophic regular expressions;
- no uncontrolled dependency traversal;
- no source execution.

A resource-bound failure is normalized rather than represented as malformed source unless the evidence genuinely establishes malformed structure.

---

## 18. Security and Untrusted Source

Ordinary Source Intelligence is non-executing analysis.

Providers shall not:

- import analyzed project modules;
- run source to discover exports/configuration;
- invoke project-authored parser plugins automatically;
- resolve and execute arbitrary dependencies referenced by source;
- broaden from a supplied snapshot to unrelated resources without a separately governed request.

Source content, comments, metadata and configuration values may contain secrets. Public facts should prefer identity, type, range and presence evidence over copying raw values. Bounded source excerpts are returned only where a fact contract explicitly requires them and sensitivity policy permits them.

The existence of a source fact never authorizes disclosure to an AI provider.

---

## 19. Configuration and Composition

IS-7 consumes an immutable resolved technical configuration supplied through the IS-3 path. It shall not read environment variables, settings files or project configuration independently to establish provider precedence.

A Version 1 technical configuration may contain:

```ts
export interface SourceIntelligenceConfiguration {
  readonly enabledProviders?: readonly SourceProviderId[];
  readonly maxSourceBytes: number;
  readonly maxDiagnostics: number;
  readonly cacheEnabled: boolean;
  readonly providerOptions?: Readonly<Record<string, unknown>>;
}
```

Provider-specific options shall be validated at provider construction/configuration boundaries and shall not become an untyped public policy escape hatch.

IS-23 composition shall construct the selected providers, resolver, normalizer and optional cache, then construct `DefaultSourceIntelligence` and inject it into approved consumers. No module-level singleton is the target architecture.

---

## 20. Relationship to Source Transformation

IS-8 Source Transformation is the primary mutation consumer of IS-7 facts.

The concrete dependency direction is:

```text
IS-4 immutable source snapshot
        |
        v
IS-7 recognition + structural facts + revision evidence
        |
        v
owning use case supplies transformation intent / scope / policy
        |
        v
IS-8 plan / approved bounded mutation / source-level validation
        |
        v
owning use case / Application Engine acceptance
```

IS-7 may identify an exact declaration or metadata range, but it never returns an `approvedEdit`, performs `injectHeader()`, stages transformed content or writes through IS-4 as a consequence of recognition.

Where IS-8 re-runs IS-7 after mutation for validation, the new analysis is bound to the new source snapshot and remains source evidence rather than final acceptance.

---

## 21. Relationship to Documentation, Nuxt, Quality and AI Capabilities

Documentation Capability may consume declaration, documentation-presence, metadata and range facts. It decides documentation semantics separately.

Nuxt Capability may consume Vue/configuration/source-kind facts. Generic source recognition does not establish Nuxt application/layer identity, Nuxt configuration meaning or Nuxt-domain applicability.

Quality Capability may consume malformed-source or structural context. IS-7 does not own lint, type-check, test or quality-gate acceptance.

AI Capability may consume selected normalized facts or explicitly authorized source excerpts. IS-7 does not construct AI disclosure policy or automatically expose underlying source.

These consumers may define their own specialized records by composition or translation. Similar field shapes do not require a generic cross-capability fact hierarchy.

---

## 22. Current Implementation Reconciliation

### 22.1 Scanner family

The current `app/scanners/` family contains useful bounded lexical machinery for CSS, HTML, JSON and TypeScript. `BaseScanner` supplies traversal, line/column tracking, lookahead and token creation. These mechanisms are potentially reusable below IS-7.

They are not the public capability contract. Current `Token<T>` and language token unions remain provider-local unless a specific normalized fact requires equivalent information.

The scanner and strategy families currently operate largely in parallel: the strategies generally inspect raw text rather than consuming scanner token streams. IS-7 shall not preserve this duplication merely because both implementations exist, and shall not delete either family before fact-by-fact migration proves which mechanism is useful.

### 22.2 Strategy family

Current strategies contain a useful mix of metadata recognition, documentable-block discovery, documentation-presence detection, Vue script-region handling and JSON/JSONC parsing. They also contain mutation methods.

IS-7 therefore splits their responsibilities:

- read-only recognition/extraction may be retained and adapted into IS-7 providers;
- mutation/injection methods move to IS-8;
- source-kind dispatch moves from extension-only `getStrategyForFile()` to fact-aware provider resolution;
- singleton strategy instances are replaced by explicit composition.

### 22.3 CodeService

`app/services/codeService.ts` currently combines Resource Access, Source Intelligence, Source Transformation, AI and presentation/logging concerns.

Its `inspect()` intent is useful evidence for IS-7, but its file acquisition becomes IS-4-governed and its returned `CodeBlock[]` becomes normalized IS-7 facts/results.

`updateHeader()` and `generateDocFor()` are not IS-7 responsibilities. They split across IS-8 Source Transformation, IS-10 AI Capability, IS-12 Documentation Capability and the owning Docs/domain workflow as appropriate.

### 22.4 Current type storage

`app/types/` is a declaration-storage directory, not an architectural owner. IS-7 target contracts therefore live with `app/capabilities/source_intelligence/contracts/` rather than in a global shared types directory merely because multiple consumers import them.

Existing `SourceLocation`, `SfcBlock`, `RegionOfInterest`, `CodeBlock` and metadata types are migration evidence. Useful fields are retained where they satisfy the normalized contracts, but ownership and range semantics are corrected at the capability boundary.

---

## 23. Known Current Defects and Corrective Requirements

The current HTML scanner contains the quoted-attribute cursor defect already identified by DD-2.4: after detecting a quote it advances more than once before scanning the value and advances multiple times after finding the closing quote. This can skip content and produce incorrect ranges.

The target implementation shall correct this logic before the HTML scanner is relied upon as an IS-7 provider and shall add regression tests for:

- empty quoted values;
- one-character values;
- single- and double-quoted values;
- adjacent attributes;
- whitespace after values;
- Vue-style/directive attributes;
- source offsets and line/column endpoints after quoted values.

Other current-provider behaviour is preserved only when tests demonstrate conformance. A known provider defect shall never be normalized into the public contract for compatibility.

---

## 24. Testing and Conformance

### 24.1 Capability tests

Vitest capability tests shall use deterministic fake providers and immutable snapshots to verify at least:

1. explicit recognition before structural analysis;
2. extension hints do not override contradictory strong evidence silently;
3. unsupported source and unsupported fact class remain distinct;
4. supported absence is not provider failure;
5. requested fact classes bound provider work;
6. provider registration order does not resolve material ambiguity;
7. partial reliable facts survive another fact-class failure;
8. provider-native objects/exceptions never cross the capability boundary;
9. facts carry the analyzed revision;
10. declaration, metadata, documentation and configuration facts retain distinct semantics;
11. range normalization uses the documented half-open offset convention;
12. embedded-region facts map to whole-resource coordinates;
13. cache reuse requires equivalent revision/request/provider semantics;
14. cancellation does not fabricate complete facts;
15. sensitive diagnostics do not reproduce whole source or secrets;
16. provider fallback cannot silently weaken required certainty;
17. interaction mode is absent from recognition semantics;
18. no analysis operation mutates the snapshot/resource.

### 24.2 Provider tests

Provider-specific tests shall cover lexical/parser correctness below the capability boundary. Existing scanner tests should be retained/adapted where they prove useful mechanics.

The suite shall include:

- TypeScript/JavaScript strings, comments, regex literals and structural boundaries;
- CSS comments/strings/blocks relevant to retained facts;
- HTML tags, comments, raw-text regions and corrected attribute cursor/ranges;
- JSON and JSONC valid, commented, malformed and partial structures;
- Vue script/template/style/custom-region containment and coordinate mapping;
- metadata schema distinction;
- documentation association presence/absence/ambiguity;
- malformed-input termination and resource bounds.

### 24.3 Integration tests

IS-7 integration tests use immutable source fixtures and, where acquisition is under test, temporary files through an injected IS-4 implementation. They do not mutate real projects and do not require network access, AI providers or interactive prompts.

Tests assert AppManager facts/diagnostics, not incidental regex match objects, `jsonc-parser` DTOs or scanner token arrays except in provider-unit tests.

---

## 25. Legacy Implementation Disposition

The current source-analysis implementation contains valuable provider mechanics but mixes read-only analysis with mutation, AI, resource access and presentation concerns. Disposition is responsibility-specific.

| Current artefact / responsibility | Disposition | Target owner/location | Preserved value | Required change |
|---|---|---|---|---|
| `app/scanners/baseScanner.ts` traversal/location mechanics | RETAIN / ADAPT | IS-7 lexical provider utilities | bounded traversal, lookahead, source-location tracking, immutable token creation | correct/publicly normalize range semantics; keep scanner model provider-local |
| `app/scanners/typescript/typescriptScanner.ts` | RETAIN / ADAPT | IS-7 TypeScript/JavaScript lexical provider | string/comment/regex-aware tokenization and structural evidence | prove fact requirements, bounds and ranges; tokens do not become public contract |
| CSS scanner | RETAIN / ADAPT | IS-7 CSS lexical provider | language-specific lexical handling | retain only where it derives approved fact classes; provider-local tokens |
| HTML scanner | RETAIN / ADAPT with defect correction | IS-7 HTML/composite provider | tags/comments/raw-text/attribute recognition | fix quoted-attribute cursor defect; strengthen malformed/range tests |
| JSON scanner | RETAIN / REVIEW | IS-7 lexical provider if required | JSON lexical evidence | do not retain parallel tokenization unless an approved fact needs it beyond structured provider |
| `app/types/scanners/baseScannerTypes.ts` | ADAPT / RELOCATE | IS-7 provider-local types + normalized contracts | location concept | remove empty diagnostic shell; normalize public positions/ranges under IS-7 ownership |
| `app/types/scanners/tokenTypes.ts` and language token unions | RETAIN internally / RELOCATE | IS-7 provider-local types | useful strict lexical typing | remove from global `app/types` public barrel where no external owner requires it |
| `app/types/scanners/sfcTypes.ts` | RETAIN / ADAPT / RELOCATE | IS-7 composite contracts/provider | region identity, attributes and source locations | distinguish normalized public region from provider-local SFC details; complete coordinate mapping |
| `app/strategies/baseStrategy.ts` extension registry | REPLACE as capability resolver | IS-7 `provider-resolver.ts` | explicit source/provider mapping concept | resolve by recognition + fact class + configuration; no incidental map-order/extension authority/singletons |
| `TypescriptStrategy.parseMetadata()` | RETAIN / ADAPT | IS-7 metadata provider | useful bounded metadata extraction | normalize schema/provenance/ranges; regex certainty represented honestly |
| `TypescriptStrategy.findDocumentableBlocks()` | RETAIN / ADAPT or REPLACE mechanism if tests require | IS-7 declaration provider | useful declaration/documentation-presence intent | correct range/signature semantics, broader supported forms only as required; no mutation methods |
| `JavascriptStrategy` reuse of TypeScript strategy | RETAIN / ADAPT | IS-7 JS provider composition | implementation reuse | explicit JS recognition/capability identity; reuse does not equate language semantics |
| CSS/HTML strategy read-only methods | RETAIN / ADAPT | IS-7 source-specific fact providers | metadata/block recognition experience | normalize facts/provenance; separate mutation methods |
| `app/strategies/json/jsonStrategy.ts` `parseMetadata()` | RETAIN / ADAPT | IS-7 structured provider | `jsonc-parser` experience and schema-aware metadata reading | normalize parse diagnostics/schema identity; no raw parser objects |
| `JsonStrategy.injectHeader()` / `jsonc-parser modify/applyEdits` | SPLIT / RELOCATE | IS-8 Source Transformation | comment/format-preserving edit technique | remove from IS-7 provider; planning/mutation/stale protection under IS-8 |
| Vue strategy/orchestrator read-only region extraction | RETAIN / ADAPT | IS-7 composite provider | `<script setup>`/script recognition, TS delegation and line-offset concept | general normalized SFC regions, full coordinate mapping, requested-fact-driven region analysis |
| Vue `injectHeader()` / `injectFunctionDoc()` | SPLIT / RELOCATE | IS-8 Source Transformation | embedded-region mutation experience | execute only approved transformation plans; not Source Intelligence |
| `app/types/services/codeServiceTypes.ts` `CodeBlock`/metadata | RETAIN concepts / REPLACE public shape | IS-7 capability contracts | declaration identity, metadata and documentation-presence fields | snapshot-bound provenance/ranges/status; remove raw content by default; capability-local ownership |
| `ICodeStrategy` mixed read/write contract | SPLIT / REPLACE | IS-7 provider contracts + IS-8 transformation contracts | useful operation inventory | no interface that grants analysis provider mutation methods by default |
| `app/services/codeService.ts` `inspect()` | RETAIN intent / ADAPT / RELOCATE | IS-7 `SourceIntelligence.analyze()` | central read-only inspection use case | injected IS-4/snapshot input, normalized results, no singleton/logger semantics |
| `CodeService.updateHeader()` | SPLIT / RELOCATE | IS-8 plus owning documentation/domain workflow | existing header-update behaviour | approved plan, stale protection and mutation below correct authority |
| `CodeService.generateDocFor()` | SPLIT / RELOCATE | IS-10 AI + IS-12 Documentation + IS-8 + owning domain | useful inspect/generate/inject workflow evidence | AI output non-authoritative; source mutation only through approved transformation path |
| `app/types/index.ts` scanner/code-service barrel exports | ADAPT | owning capability/domain public entry points | convenient imports | stop making provider-local tokens and mixed contracts globally authoritative |
| scanner/strategy unit tests | RETAIN / SPLIT / RELOCATE | IS-7 provider/capability tests and IS-8 mutation tests | substantial lexical/regression evidence | separate read-only fact conformance from mutation behaviour; assert normalized contracts at capability level |
| `tests/unit/services/codeService.test.ts` | SPLIT / RELOCATE | IS-7/IS-8/IS-10/IS-12 tests | service workflow regression evidence | await async contracts correctly; test each authority boundary independently |
| module-level `codeService` and strategy singletons | REPLACE | IS-23 composition root | simple legacy access | explicit provider/capability construction and dependency injection |
| direct logger calls in analysis path | ADAPT | subordinate observability | useful development diagnostics | normalized result/diagnostic is authoritative; redact sensitive source |

No production source is changed merely by approving IS-7. Migration occurs when the capability and its consumers are implemented under their owning specifications.

---

## 26. Migration Sequence

Implementation should proceed in this order:

1. add capability-local Source Intelligence references, snapshot, recognition, fact, range, diagnostic and result contracts;
2. add fake provider/resolver/normalizer tests covering support, ambiguity, absence, partial results and revision binding;
3. implement explicit provider resolution and capability discovery without extension-only authority;
4. adapt retained lexical scanner utilities behind provider-local contracts and correct the HTML quoted-attribute defect;
5. implement normalized metadata, declaration/documentation and configuration-structure facts from the minimum suitable provider mechanisms;
6. implement JSON/JSONC read-only structured analysis with normalized diagnostics;
7. implement Vue composite-region recognition and whole-source coordinate mapping;
8. implement sensitive diagnostic minimization, cancellation/resource bounds and optional revision-bound cache;
9. wire `DefaultSourceIntelligence` through the IS-23 composition root;
10. migrate `CodeService.inspect()` consumers to IS-7 as their owning capability/domain specifications are implemented;
11. relocate strategy mutation methods and JSONC edit mechanics to IS-8 rather than carrying them into IS-7;
12. relocate AI/documentation workflow concerns to IS-10/IS-12/domain implementations;
13. remove the mixed `ICodeStrategy`, extension-only strategy registry, global provider-local type exports and `codeService` singleton only after target consumers have migrated.

A temporary compatibility adapter may expose selected legacy read-only inspection shapes while migration is incomplete, but it must not expose mutation through IS-7, hide unsupported/ambiguous states, discard revision evidence, or make extension-only dispatch the new semantic boundary.

---

## 27. Traceability

| DD-2.4 area | IS-7 implementation |
|---|---|
| DD-SINT-001–002 | immutable read-only analysis boundary; explicit separation from IS-4 authority and IS-8 mutation |
| DD-SINT-003–005 | bounded analysis request, hints as evidence and no write authority |
| DD-SINT-006–007 | snapshot/revision-bound facts and no provider bypass of governed acquisition |
| DD-SINT-008–011 | explicit recognition result, extension not authority, unsupported/ambiguous states preserved |
| DD-SINT-012–014 | fact-class-specific capability discovery and no false completeness |
| DD-SINT-015–016 | AppManager-owned discriminated facts; provider AST/CST/token objects remain internal; least sufficient detail |
| DD-SINT-017–018 | normalized half-open ranges and location evidence without edit authority |
| DD-SINT-019–020 | declaration/block facts and explicit valid empty/absent state |
| DD-SINT-021–022 | schema-aware metadata facts; all injection relocated to IS-8 |
| DD-SINT-023 | explicit documentation-presence states without quality/acceptance claim |
| DD-SINT-024–025 | configuration-structure facts distinct from effective configuration and schema identity preserved |
| DD-SINT-026–027 | composite-region containment/coordinate mapping and bounded embedded analysis |
| DD-SINT-028–030 | retained tokens remain provider-local and lexical success never claims structural completeness |
| DD-SINT-031–033 | provider mechanism selected by required semantics; bounded regex permitted with honest certainty |
| DD-SINT-034–035 | absence distinct from failure and reliable partial facts preserved |
| DD-SINT-036–037 | no first-match ambiguity resolution; conflicting evidence preserves provenance |
| DD-SINT-038–039 | stable normalized diagnostics as evidence; raw provider failures remain subordinate |
| DD-SINT-040–041 | deterministic interaction-mode-independent analysis with no prompts |
| DD-SINT-042–044 | optional revision/request/provider-bound cache with semantic invisibility |
| DD-SINT-045–046 | `AbortSignal` propagation and no fabricated completion after cancellation |
| DD-SINT-047–050 | non-executing untrusted-source analysis, no implicit dependency loading, sensitive minimization and resource bounds |
| DD-SINT-051–052 | source recognition does not establish Managed Project scope and supplied bounds are not broadened |
| DD-SINT-053 | resolved IS-3 technical configuration only; no private precedence |
| DD-SINT-054–055 | normalized capability evidence with non-Boolean material states; no final application success claim |
| DD-SINT-056–057 | facts inform IS-8 plans/reanalysis but never authorize mutation or final acceptance |
| DD-SINT-058–061 | Documentation/Nuxt/Quality/AI consume bounded facts without transfer of their semantics or authority |
| DD-SINT-062–065 | fact-specific provider discovery/replaceability with no silent weaker fallback or speculative plugin/RPC architecture |
| DD-SINT-066–067 | scanner/strategy/service reconciliation at implementation level and HTML provider defect corrected/regression-tested |
| DD-SINT-068 | immutable fixture/fake-provider tests; no consequential project mutation required |

IS-7 also conforms to FR-XFORM-004–010 by providing read-only inspection, normalized structural facts, bounded regions and explicit unsupported/ambiguous/conflicting states; to IS-4 by consuming governed source snapshots rather than recreating filesystem semantics; to IS-23 by using explicit composition/injection; to DD-1.3 by consuming rather than deriving managed scope; to DD-1.4 by consuming resolved technical configuration; and to DD-1.5 by returning evidence for owning-use-case/Application Engine interpretation.

---

## 28. Version 1 Implementation Baseline

The Version 1 Source Intelligence implementation is:

```text
Application Engine / owning use case
  resolves purpose, managed scope and effective configuration
        |
        v
IS-4 bounded source reference / immutable snapshot / revision
        |
        v
DefaultSourceIntelligence
  recognize -> resolve provider(s) -> analyze requested facts -> normalize
        |
        +------------------+-------------------+
        |                  |                   |
        v                  v                   v
 lexical providers    structured provider   composite provider
 scanners/regex       JSON/JSONC            Vue regions
        |                  |                   |
        +------------------+-------------------+
                           v
          normalized snapshot-bound source facts
          provenance / ambiguity / diagnostics
                           |
             +-------------+-------------+
             |                           |
             v                           v
      IS-8 Source Transformation    other approved consumers
      planning/validation           Docs/Nuxt/Quality/AI
             |                           |
             +-------------+-------------+
                           v
              owning use case / Application Engine
                    interpretation / acceptance
```

The non-drift rule is:

> **Version 1 Source Intelligence is a read-only, snapshot-bound source-recognition and structural-evidence capability, not a source editor, transformation planner, generic parser framework, Managed Project resolver, documentation authority, Nuxt semantic engine, Quality gate or AI disclosure authority.**
