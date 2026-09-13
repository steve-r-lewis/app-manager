# DD-2.4 — AppManager Source Intelligence Detailed Design

> **Detailed Design ID:** DD-2.4
>
> **Design family:** DD-2 — Shared Capabilities

> **Status:** Version 1 Detailed Design Specification
>
> **Detailed Design authority:** This document defines the permanent shared contracts for read-only source recognition, structural analysis and normalized source facts beneath AppManager application and transformation authority. It refines, but does not override, the root Design Specification, Functional Specifications, accepted ADRs, or the DD-1 Application Core Detailed Designs.
>
> **Governing sources:** [Project Documentation Guide](../project-documentation-guide-v01.md), [AppManager Design Specification](../appmanager-design-specification-v01.md), [Detailed Design Decomposition Plan and Canonical Register](../project_management/detailed-design-decomposition-plan-v01.md), [ADR-0001 — Primary Application Runtime](../project_management/decisions/adr-0001-primary-application-runtime.md)
>
> **Related Detailed Design authorities:** [DD-1.1 — Application Invocation](../dd_1_application_core/dd-1-1-application-invocation-detailed-design-v01.md), [DD-1.2 — Execution Outcomes](../dd_1_application_core/dd-1-2-execution-outcomes-detailed-design-v01.md), [DD-1.3 — Managed Project](../dd_1_application_core/dd-1-3-managed-project-detailed-design-v01.md), [DD-1.4 — Configuration Resolution](../dd_1_application_core/dd-1-4-configuration-resolution-detailed-design-v01.md), [DD-1.5 — Application Engine](../dd_1_application_core/dd-1-5-application-engine-detailed-design-v01.md), [DD-2.1 — Resource Access](dd-2-1-resource-access-detailed-design-v01.md), [DD-2.2 — Process Execution](dd-2-2-process-execution-detailed-design-v01.md), [DD-2.3 — Repository Capability](dd-2-3-repository-capability-detailed-design-v01.md)
>
> **Primary Functional authority:** [docs/functional/source-transformation-functional-specification-v01.md](../functional/source-transformation-functional-specification-v01.md)
>
> **Related domain Functional authorities:** App, Docs, Nuxt, Quality, AI, Settings and Utils where those domains consume source facts or request later source transformation.

---

## 1. Purpose

This specification defines the permanent internal contracts, responsibilities, state distinctions and evidence model by which AppManager obtains read-only intelligence about source resources.

The governing rule is:

> **Source Intelligence observes and describes source; it does not decide or apply source mutation.**

A second rule follows:

> **Recognition produces evidence about source structure. Recognition does not grant application authority, managed scope, target eligibility or transformation approval.**

A third rule is:

> **Provider-native parser, scanner, compiler or language-service representations remain below the Source Intelligence boundary. Shared consumers receive AppManager-oriented structural facts.**

Source Intelligence therefore forms the read-only analytical stage between bounded resource access and source-aware planning, transformation, documentation, quality, Nuxt and other application capabilities.

---

## 2. Scope

This design owns permanent internal contracts for:

- source references and source snapshots used for analysis;
- file/source-kind and language recognition;
- supported, unsupported and ambiguous source representation;
- recognition confidence and provenance where useful;
- normalized structural facts;
- structural regions and source locations;
- declarations and documentable blocks;
- metadata/header recognition;
- documentation-presence facts;
- configuration-structure recognition;
- comments and other semantically relevant source regions where required;
- nested or composite source regions;
- syntax/recognition diagnostics;
- incomplete or partially recognized source representation;
- provider selection for read-only analysis;
- provider-native result normalization;
- stale-source/revision evidence for downstream consumers;
- deterministic analysis expectations;
- bounded caching where safe;
- cancellation for expensive analysis where applicable;
- provider isolation and testability.

This design defines a capability boundary. It does not prescribe one scanner family, parser, compiler API, AST/CST model, regular-expression strategy, class hierarchy, package layout or TypeScript interface.

---

## 3. Explicit Non-Ownership

Source Intelligence shall not own:

- canonical AppManager command or use-case identity;
- managed-project identity or managed-scope authority;
- resource mutation mechanics;
- transformation intent;
- transformation strategy selection;
- transformation plans or edit plans;
- application confirmation or authorization;
- source write/delete/move authority;
- formatting policy merely because formatting can be inferred;
- documentation-generation policy;
- Nuxt-domain workflow semantics;
- Quality acceptance;
- AI prompt or response authority;
- configuration-source precedence;
- repository workflow semantics;
- final AppManager success, failure, partial-success or cancellation acceptance.

Source Intelligence may determine that a requested analytical operation is unsupported, ambiguous, invalid or technically unsuccessful. Such a result remains analysis evidence for the owning use case.

---

## 4. Architectural Position

The permanent dependency direction is:

```text
Application Engine / owning use case
        |
        +--> Managed Project / operation scope
        +--> effective configuration
        +--> requested analytical purpose
        |
        v
bounded source reference / snapshot
        |
        v
+------------------------------------------+
| Source Intelligence capability           |
|                                          |
| recognize source kind / language         |
| select bounded analysis provider         |
| inspect source read-only                 |
| derive structural facts                  |
| normalize ambiguity / diagnostics        |
| attach source revision evidence          |
+--------------------+---------------------+
                     |
                     v
       scanner / parser / compiler / other
       read-only recognition provider
                     |
                     v
         normalized Source Intelligence
                     |
          +----------+-----------+
          |                      |
          v                      v
 Source Transformation      other consumers
 planning/validation         Docs/Nuxt/etc.
```

### 4.1 Relationship to Resource Access

Resource Access owns bounded resource acquisition and resource-level snapshots. Source Intelligence consumes source content and revision evidence supplied through an approved resource path.

**DD-SINT-001 — Analysis does not imply resource authority**  
The ability to read or analyze a resource shall not be interpreted as authority to mutate it.

### 4.2 Relationship to Source Transformation

Source Intelligence supplies facts. Source Transformation consumes those facts to derive or validate bounded transformation work under its own Detailed Design.

**DD-SINT-002 — Recognition/transformation separation**  
No Source Intelligence operation shall apply an edit merely because it can identify where an edit could occur.

### 4.3 Relationship to the Application Engine

The Engine or owning use case determines why source is being inspected, which project/scope applies, and what application decision follows from the returned facts.

Source Intelligence determines what can be observed about the supplied source under its analytical contract.

---

## 5. Responsibility Model

Source Intelligence is decomposed into logical responsibilities:

1. **Analysis Request Contract** — identifies the source and bounded analytical purpose.
2. **Source Recognition Coordinator** — establishes supported source/language candidates.
3. **Provider Resolver** — chooses an eligible analysis provider without granting it application authority.
4. **Structural Analyzer** — derives provider-level source observations.
5. **Fact Normalizer** — converts observations into AppManager-oriented structural facts.
6. **Ambiguity Coordinator** — preserves material uncertainty/conflict instead of guessing.
7. **Revision Coordinator** — associates facts with the analyzed source state.
8. **Diagnostic Normalizer** — produces bounded diagnostics for unsupported, malformed or partial analysis.
9. **Analysis Cache** — optionally reuses immutable facts when revision identity proves them applicable.

These are logical responsibilities, not mandatory classes or processes.

---

## 6. Analysis Request Contract

A bounded Source Intelligence request shall be capable of carrying, where relevant:

- source reference;
- source snapshot or content reference;
- source revision/freshness evidence;
- caller-supplied source-kind hint;
- caller-supplied language hint;
- requested fact classes;
- requested structural region or bounded sub-source;
- effective configuration inputs relevant to recognition;
- cancellation context;
- correlation/invocation identity;
- sensitivity classification where applicable.

**DD-SINT-003 — Bounded analytical purpose**  
A request shall identify sufficient analytical purpose to avoid unnecessary broad analysis where a narrower fact request is adequate.

**DD-SINT-004 — Hints are not unquestionable truth**  
Filename extensions, caller hints, MIME-like labels or conventional paths may contribute recognition evidence but shall not silently override materially contradictory source evidence where correctness or safety depends on the distinction.

**DD-SINT-005 — Read-only request**  
The Source Intelligence request contract shall contain no implicit authority to write the analyzed resource.

---

## 7. Source Reference and Snapshot Semantics

### 7.1 Source reference

A source reference identifies the logical source being analyzed sufficiently for diagnostics, correlation and downstream stale-state checks.

It may refer to a whole resource or an explicitly bounded embedded region.

### 7.2 Snapshot identity

Analysis facts describe a particular observed source state.

**DD-SINT-006 — Facts are snapshot-bound**  
Where downstream correctness depends on source stability, Source Intelligence shall associate facts with revision, digest, version or equivalent evidence sufficient to detect material source change before consequential use.

### 7.3 Content ownership

Source Intelligence does not own source persistence. It consumes source content through Resource Access or another explicitly governed source provider.

**DD-SINT-007 — No hidden reread authority**  
An analysis provider shall not silently bypass governed Resource Access and reread arbitrary project files merely for convenience when doing so could alter scope, freshness or security semantics.

---

## 8. Source-Kind and Language Recognition

### 8.1 Recognition model

Recognition may consider bounded evidence such as:

- explicit source-kind/language hints;
- file extension or filename convention;
- source syntax/lexical evidence;
- embedded-language markers;
- structured-format markers;
- effective configuration relevant to supported formats.

### 8.2 Recognition result

A normalized recognition result should be capable of representing:

- recognized source kind;
- recognized language/format;
- provider capability used;
- support status;
- confidence/certainty where useful;
- alternative plausible interpretations;
- provenance/evidence;
- diagnostics.

**DD-SINT-008 — Recognition is explicit evidence**  
Recognition shall produce a distinguishable result rather than hiding source-kind assumptions inside a later parser call.

**DD-SINT-009 — Extension is not universal truth**  
File extension alone shall not be treated as sufficient authority where the requested analysis requires stronger structural certainty.

**DD-SINT-010 — Unsupported is first-class**  
A source kind for which AppManager lacks the required analytical capability shall be represented as unsupported rather than coerced through an unrelated provider.

### 8.3 Ambiguous recognition

**DD-SINT-011 — Ambiguity is preserved**  
When multiple materially different interpretations remain plausible and choosing one could affect downstream correctness, the result shall remain ambiguous or require permitted disambiguation rather than selecting according to incidental provider order.

---

## 9. Supported Source Kinds

Version 1 must support the source kinds required by approved functional use cases. Existing implementation evidence includes TypeScript, JavaScript, Vue, CSS, HTML and JSON-family analysis, but the exact implementation set does not by itself define permanent architecture.

**DD-SINT-012 — Capability-driven support**  
Supported source kinds shall be discoverable through the Source Intelligence capability contract rather than hard-coded independently by each consuming domain.

**DD-SINT-013 — Support is fact-class specific**  
A provider may support some analytical facts for a source kind without supporting every possible fact. For example, metadata recognition may be available even when declaration extraction is not.

**DD-SINT-014 — No false completeness**  
A source shall not be described as fully supported merely because one narrow inspection operation succeeds.

---

## 10. Structural Fact Model

### 10.1 Purpose

Structural facts are AppManager-oriented observations derived from source without exposing provider-native object graphs as the shared contract.

A fact should be capable of carrying, where useful:

- fact kind;
- normalized identity/name;
- structural category;
- source location/range;
- parent/containing region identity;
- relevant attributes;
- documentation-presence state;
- provenance/provider;
- confidence/certainty;
- source revision identity;
- diagnostics.

### 10.2 Facts versus provider objects

**DD-SINT-015 — Provider-model isolation**  
AST nodes, CST nodes, compiler symbols, scanner tokens, parser cursors, regex match objects and language-service SDK objects shall not become the general Source Intelligence contract.

A provider-specific representation may remain available behind the capability boundary for a tightly coupled provider operation, but shared consumers shall depend on normalized facts.

### 10.3 Fact granularity

**DD-SINT-016 — Least sufficient structural detail**  
Source Intelligence should expose the least structural detail sufficient for AppManager consumers rather than universalizing a complete language model for every supported source kind.

---

## 11. Source Locations and Structural Regions

A structural region represents a bounded part of the source that has meaning to an AppManager consumer.

Regions may include:

- whole document;
- metadata/header region;
- declaration;
- block;
- configuration object/property;
- comment/documentation region;
- embedded language region;
- other recognized bounded structures.

A location/range model should support offsets and, where useful, human-readable line/column positions.

**DD-SINT-017 — Stable range semantics**  
Range endpoints and inclusion/exclusion semantics shall be defined consistently so downstream planning does not depend on provider-specific cursor conventions.

**DD-SINT-018 — Location is not edit authority**  
A recognized source range identifies where a fact was observed; it does not authorize replacement of that range.

---

## 12. Declarations and Blocks

Source Intelligence shall be capable of identifying declarations or documentable blocks required by approved consumers.

Normalized declaration/block facts may include:

- name/identity;
- declaration category;
- exported/public relevance where knowable;
- containing region;
- source range;
- documentation-presence state;
- bounded signature/descriptor facts where required;
- provider certainty.

**DD-SINT-019 — Declaration identity is structural evidence**  
A recognized declaration name or block does not by itself define a transformation target; the owning transformation/use case must establish target intent and eligibility.

**DD-SINT-020 — Empty block set can be valid**  
A supported source kind may legitimately expose no documentable block concept. An empty result shall be distinguishable from failed or unsupported analysis where that distinction matters.

---

## 13. Metadata and Header Recognition

Source Intelligence may recognize existing file metadata/header structures used by documentation, versioning, validation or other AppManager use cases.

Normalized metadata facts may include:

- metadata/header presence;
- recognized schema/kind;
- known fields such as version, author or description where relevant;
- source range/provenance;
- missing expected fields;
- conflicting or duplicate metadata;
- schema ambiguity;
- source revision.

**DD-SINT-021 — Metadata recognition is schema-aware**  
The existence of a field or object with a familiar name shall not automatically establish that it follows an unrelated recognized schema.

**DD-SINT-022 — No metadata injection**  
Source Intelligence shall not insert, repair or normalize a header while recognizing it. Such change belongs to Source Transformation or generation capability as applicable.

---

## 14. Documentation-Presence Facts

Source Intelligence may report whether recognized declarations/blocks already have associated documentation.

Documentation presence should be capable of distinguishing, where required:

- documentation present;
- documentation absent;
- association ambiguous;
- unsupported association analysis;
- malformed documentation region.

**DD-SINT-023 — Presence is not quality**  
The fact that documentation exists does not imply that it is complete, correct, current or application-accepted unless a higher-level capability explicitly evaluates those properties.

---

## 15. Configuration-Structure Recognition

Source Intelligence shall support read-only recognition of configuration structures required by AppManager consumers without acquiring Configuration Resolution authority.

Facts may include:

- object/property/key presence;
- nested path presence;
- value kind/type evidence;
- duplicate/conflicting entries where the format permits them;
- comments/trivia preservation relevance where knowable;
- schema/kind evidence;
- structural ranges.

**DD-SINT-024 — Configuration structure is not effective configuration**  
Recognizing a setting in a source file does not determine its effective AppManager value or precedence. DD-1.4 Configuration Resolution retains that authority.

**DD-SINT-025 — Schema distinction**  
Different configuration schemas that happen to use similar field names shall remain distinguishable when their semantics differ.

---

## 16. Composite and Embedded Source

Some resources contain multiple source regions, such as Vue single-file components or HTML with embedded script/style content.

Source Intelligence may represent:

- outer source kind;
- embedded region kind/language;
- region boundaries;
- parent-child relationships;
- region-local structural facts mapped to whole-resource coordinates.

**DD-SINT-026 — Composite source preserves containment**  
Facts derived from an embedded region shall preserve sufficient containment and coordinate information to identify their location in the original source resource.

**DD-SINT-027 — Embedded analysis is bounded**  
Recognition of an embedded region shall not imply permission to inspect arbitrary external dependencies referenced by that region.

---

## 17. Lexical Tokens and Scanner Evidence

Existing AppManager implementation includes hand-written token scanners for several source kinds. Tokens can be useful provider-level evidence, but tokenization is not itself the permanent shared Source Intelligence abstraction.

**DD-SINT-028 — Tokens remain provider-level unless required**  
A normalized consumer contract shall not require all providers to expose the current scanner token model merely because one implementation uses it.

**DD-SINT-029 — Token location correctness is provider conformance**  
Where a provider uses tokens to derive structural facts, token range/location correctness is part of provider correctness and must be testable independently.

**DD-SINT-030 — Scanner availability does not imply semantic completeness**  
Successful lexical tokenization shall not be treated as proof that higher-level structural facts are available or correct.

---

## 18. Parser, Compiler and Strategy Providers

Source Intelligence may be implemented by one or more mechanisms, including:

- hand-written scanner/tokenizer;
- parser;
- compiler API;
- language service;
- CST/AST library;
- bounded regular-expression recognizer where sufficiently safe for the requested fact;
- structured-data parser;
- composite/orchestrating recognizer.

**DD-SINT-031 — Provider choice follows required semantics**  
Provider selection shall be based on the fact class and source kind required, not on a universal preference for scanner, regex, AST or compiler technology.

**DD-SINT-032 — Provider sophistication is not authority**  
A more sophisticated parser/compiler provider does not acquire application or transformation authority merely because it has richer semantic knowledge.

**DD-SINT-033 — Bounded regex use is permissible**  
Regular-expression recognition is not prohibited where it can safely and deterministically establish the requested fact. It shall not be represented as stronger structural certainty than it actually provides.

---

## 19. Unsupported, Malformed, Ambiguous and Partial Analysis

These states shall remain distinguishable:

- **supported and recognized** — requested facts obtained with sufficient certainty;
- **supported but absent** — source is understood and requested structure is not present;
- **unsupported source kind** — no eligible provider for the required fact;
- **unsupported fact class** — source kind recognized but requested analysis unavailable;
- **malformed source** — provider recognizes the kind but syntax/structure prevents required analysis;
- **ambiguous recognition** — multiple interpretations remain material;
- **partial analysis** — some requested facts are reliable while others are unavailable or uncertain;
- **provider failure** — eligible provider failed technically;
- **cancelled** — analysis stopped under cancellation semantics.

**DD-SINT-034 — Absence is not failure**  
A supported analysis that proves a declaration, metadata field or documentation region absent shall not be collapsed into provider failure.

**DD-SINT-035 — Partial truth is preserved**  
Where reliable facts can be returned despite another requested fact failing, the result may preserve those facts with explicit partial diagnostics rather than discarding all evidence.

---

## 20. Ambiguity and Conflicting Recognition

Material ambiguity may arise from:

- conflicting file extension and syntax;
- multiple plausible metadata schemas;
- duplicate declarations where uniqueness was expected;
- multiple structural regions matching a bounded query;
- provider disagreement;
- malformed source that admits more than one recovery interpretation.

**DD-SINT-036 — No arbitrary first-match authority**  
Incidental provider order, filesystem order, regex match order or registry insertion order shall not silently resolve material ambiguity where the choice could affect consequential downstream behavior.

**DD-SINT-037 — Conflict provenance**  
Where provider interpretations conflict materially, diagnostics should preserve enough provenance to explain the competing interpretations without leaking provider-native object graphs.

---

## 21. Syntax and Recognition Diagnostics

Normalized diagnostics should distinguish, where useful:

- unsupported source kind;
- unsupported fact class;
- malformed syntax/structure;
- ambiguous recognition;
- conflicting provider evidence;
- incomplete/partial analysis;
- provider unavailable;
- provider internal failure;
- source unreadable through upstream Resource Access;
- stale/revision mismatch;
- cancellation;
- sensitive-content restriction.

Diagnostics may include source ranges where safe and meaningful.

**DD-SINT-038 — Diagnostics are evidence**  
Recognition diagnostics shall not independently determine final AppManager outcome.

**DD-SINT-039 — Provider detail is subordinate**  
Raw parser exceptions, stack traces, compiler objects and SDK-specific diagnostics shall be normalized or bounded before crossing the capability boundary.

---

## 22. Determinism

**DD-SINT-040 — Equivalent-source determinism**  
Given materially equivalent source content, analysis request, effective configuration and provider capability, Source Intelligence should produce materially equivalent normalized facts independent of TUI, Headless or host adapter.

**DD-SINT-041 — No presentation-dependent recognition**  
Recognition shall not depend on an interactive prompt or terminal-only choice. If disambiguation requires caller input, the ambiguity must be representable through the invocation/application model.

---

## 23. Caching and Reuse

Source Intelligence may cache analysis results for performance, but cache identity must preserve correctness.

**DD-SINT-042 — Cache is revision-bound**  
Cached facts shall only be reused when the implementation can establish that the relevant source state and analysis inputs remain materially equivalent.

**DD-SINT-043 — Cache is not authority**  
Cached recognition does not override stronger current evidence that the source changed.

**DD-SINT-044 — Cache invisibility**  
Use of a cache shall not change application semantics or cause different facts to be reported solely because one interaction mode has warmed a cache.

---

## 24. Cancellation and Expensive Analysis

Most Version 1 source inspection may be local and short-lived, but the capability contract shall not preclude expensive parser/language-service operations.

**DD-SINT-045 — Cancellation propagation**  
Where analysis is cancellable, Source Intelligence shall observe the DD-1 cancellation context and propagate cancellation to providers that support it.

**DD-SINT-046 — Cancellation does not fabricate facts**  
Facts not reliably established before cancellation shall not be reported as complete merely to provide a terminal result.

---

## 25. Sensitive and Untrusted Source

Project source is input data and may be malformed, adversarial or sensitive.

**DD-SINT-047 — Analysis does not execute source**  
Ordinary Source Intelligence shall not execute analyzed project code merely to understand its structure unless a separately governed capability explicitly requires execution.

**DD-SINT-048 — No implicit dependency loading**  
A provider shall not automatically import/execute project modules or arbitrary plugins as part of read-only recognition where a non-executing analysis path is required by the contract.

**DD-SINT-049 — Sensitive fact minimization**  
Normalized results and diagnostics shall avoid unnecessarily copying secrets or large sensitive source fragments when structural identity/range evidence is sufficient.

**DD-SINT-050 — Untrusted provider input**  
Provider implementations shall treat project-authored source as untrusted input and bound recursion, resource use or other parser risks where materially applicable.

---

## 26. Relationship to Managed Project and Scope

Managed Project may consume Source Intelligence evidence during project understanding, and Source Intelligence may consume managed context to constrain requested analysis. Neither relationship transfers authority.

**DD-SINT-051 — Recognition does not establish managed scope**  
Finding a Nuxt configuration declaration, layer-like source structure or project metadata marker may contribute evidence to project resolution but does not itself establish managed-project identity or mutation scope.

**DD-SINT-052 — Scope constrains analysis where required**  
When the owning use case supplies a bounded source scope, Source Intelligence shall not silently broaden analysis to unrelated project resources.

---

## 27. Relationship to Configuration Resolution

Effective configuration may determine:

- enabled source providers;
- source-kind support policy;
- bounded parser settings;
- limits;
- optional recognition behavior.

**DD-SINT-053 — No private configuration precedence**  
Source Intelligence shall consume governed effective configuration rather than independently rereading arbitrary settings/environment sources to establish competing policy.

Recognized configuration source remains structural evidence and is not itself the operation's effective configuration.

---

## 28. Relationship to Execution Outcomes

Source Intelligence results are capability evidence compatible with DD-1.2.

A result should be capable of representing:

- technical analysis status;
- source recognition/support status;
- normalized facts;
- ambiguity/partial-state evidence;
- diagnostics;
- source revision evidence;
- provider availability;
- timing where useful;
- cancellation evidence.

**DD-SINT-054 — Analysis success is not application success**  
Successful structural analysis shall not by itself establish that the owning AppManager use case succeeded.

**DD-SINT-055 — No Boolean collapse**  
Unsupported, absent, ambiguous, malformed, partial and provider-failed states shall not be collapsed into one Boolean where the distinction affects downstream behavior.

---

## 29. Relationship to Source Transformation

DD-2.5 Source Transformation is the primary downstream consumer of Source Intelligence for source-changing workflows.

The intended sequence is:

```text
Resource Access snapshot
        -> Source Intelligence recognition/facts
        -> transformation intent (owned upstream)
        -> Source Transformation strategy/plan
        -> Application Engine scope/policy/approval
        -> bounded mutation
        -> source-level validation
        -> application acceptance
```

**DD-SINT-056 — Facts may inform plans, not authorize them**  
Source Intelligence may identify a declaration, metadata region or configuration path suitable for a requested change, but Source Transformation and the owning use case establish the plan and authority to change it.

**DD-SINT-057 — Reanalysis may validate source state**  
Source Transformation may request Source Intelligence again after mutation to establish source-level structural facts. That validation remains distinct from final application acceptance.

---

## 30. Relationship to Documentation Capability

Documentation Capability may consume:

- declaration/block facts;
- documentation-presence facts;
- metadata/header facts;
- source ranges;
- source-kind recognition.

**DD-SINT-058 — Documentation semantics remain downstream**  
Source Intelligence identifies documentation-relevant structures; it does not decide what documentation should be generated, whether existing documentation is adequate, or whether generated documentation is accepted.

---

## 31. Relationship to Nuxt Capability

Nuxt Capability may consume Source Intelligence for Nuxt/Vue/configuration recognition.

**DD-SINT-059 — Generic source facts do not replace Nuxt semantics**  
Recognizing a Vue region, TypeScript declaration or configuration property does not by itself establish Nuxt-layer identity, Nuxt configuration semantics or Nuxt-domain workflow acceptance.

---

## 32. Relationship to Quality Capability

Quality may consume source facts for discovery or contextual diagnostics.

**DD-SINT-060 — Inspection is not quality acceptance**  
Source Intelligence may report malformed source or structural facts but shall not become the owner of lint, typecheck, test or quality-gate acceptance.

---

## 33. Relationship to AI Capability

AI workflows may consume bounded structural facts or source excerpts selected under AI policy.

**DD-SINT-061 — Intelligence output is not automatic AI context**  
The existence of a Source Intelligence fact or source range does not automatically authorize sending its underlying source content to an AI provider. AI context construction and sensitive-data policy remain under the AI capability/application authority.

---

## 34. Provider Availability and Capability Discovery

Source Intelligence should support capability discovery sufficient to answer whether a requested source kind/fact class can be analyzed.

**DD-SINT-062 — Availability is fact-specific**  
Provider availability for one language or fact class shall not imply availability for all source analysis.

**DD-SINT-063 — No silent provider fallback with weaker semantics**  
A provider may only be substituted when it satisfies the required Source Intelligence contract. Falling from structural parsing to a materially weaker heuristic shall be explicit in evidence where certainty changes.

---

## 35. Provider Replaceability

Version 1 may use TypeScript/Node-native implementations, hand-written scanners, regular expressions and `jsonc-parser`. These are implementation choices, not permanent architecture unless explicitly elevated.

**DD-SINT-064 — Semantic provider boundary**  
A replacement provider shall preserve the normalized fact semantics promised by this design or explicitly report unsupported/partial capability.

**DD-SINT-065 — No speculative transport abstraction**  
Provider replaceability does not require a separate worker process, RPC protocol, language-neutral schema or plugin runtime in Version 1 unless a concrete architectural requirement later justifies one.

---

## 36. Current Implementation Reconciliation

Current implementation and historical technical specifications are evidence, not normative authority.

### 36.1 Useful concepts retained

The existing scanner/strategy implementation demonstrates useful concepts that fit this design:

- isolated source-kind recognizers;
- source locations/ranges;
- language-specific lexical handling;
- metadata/header inspection;
- documentable-block discovery;
- documentation-presence detection;
- Vue embedded-script handling;
- structured JSON/JSONC analysis;
- stateless or bounded per-source analysis;
- pure-function-style testability for many providers.

### 36.2 Incidental structures not promoted

The following are not automatically permanent architecture:

- `BaseScanner<TTokenType>` as the universal source model;
- the current token unions;
- one scanner per language;
- extension-keyed `getStrategyForFile()` as the permanent provider resolver;
- singleton strategy instances;
- `ICodeStrategy` as the final Source Intelligence contract;
- regex as the universal structural parser;
- `jsonc-parser` as the permanent structured-data provider;
- JavaScript inheriting TypeScript strategy behavior forever;
- Vue analysis being limited permanently to `<script>` regions;
- the exact existing TypeScript/CSS/HTML/JSON scanner support set.

### 36.3 Scanner/strategy separation observed in current code

Historical documentation confirms that the current strategies generally analyze raw text directly rather than consuming the existing token scanners. This implementation fact must not force the permanent architecture either to preserve two parallel layers or to merge them prematurely.

**DD-SINT-066 — Implementation reconciliation occurs later**  
Implementation Specification shall decide how current scanners, strategies and services are adapted to this approved capability contract.

### 36.4 Known scanner defect

Historical scanner review identified an HTML quoted-attribute cursor over-consumption defect. That finding is implementation/provider evidence, not a reason to encode the defective cursor behavior into the Source Intelligence contract.

**DD-SINT-067 — Known provider defects remain provider defects**  
A known implementation defect shall be corrected and regression-tested during implementation work; normative Detailed Design shall specify the required correct semantics rather than preserve the defect.

---

## 37. Testability Requirements

Source Intelligence shall permit deterministic provider substitution or fixtures for tests covering at least:

- recognized supported source;
- unsupported source kind;
- supported source with absent requested structure;
- malformed source;
- ambiguous source kind;
- conflicting provider evidence;
- partial analysis;
- declarations/blocks;
- metadata/header presence and schema distinction;
- documentation presence/absence;
- configuration structure;
- composite/embedded regions and coordinate mapping;
- source ranges;
- source revision/stale cache handling;
- cancellation where supported;
- provider unavailable/failure;
- sensitive diagnostic minimization;
- provider normalization.

Provider-specific lexical/parser correctness shall be tested below the capability contract. Application acceptance remains tested above it.

**DD-SINT-068 — No real project mutation required for analysis tests**  
Core Source Intelligence conformance tests should operate against immutable source fixtures/snapshots and shall not require consequential project mutation.

---

## 38. Conformance Invariants

A conforming DD-2.4 implementation shall preserve all of the following:

1. Source Intelligence is read-only with respect to analyzed source.
2. Recognition does not grant mutation authority.
3. Recognition does not establish managed scope.
4. Structural facts are bound to the analyzed source state where freshness matters.
5. File extension is evidence, not universal semantic truth.
6. Unsupported source is explicit.
7. Unsupported fact class is distinguishable from unsupported source kind where material.
8. Absence of a requested structure is distinguishable from analysis failure.
9. Ambiguity is not silently resolved by incidental provider order.
10. Partial reliable facts are not automatically discarded.
11. Provider-native AST/CST/token/compiler objects remain below the shared boundary.
12. Scanner tokenization is not the universal Source Intelligence contract.
13. Structural location does not grant edit authority.
14. Metadata recognition does not inject or repair metadata.
15. Configuration structure does not define effective configuration precedence.
16. Documentation presence does not imply documentation quality or acceptance.
17. Composite source preserves embedded-region containment and coordinates.
18. Ordinary analysis does not execute project source.
19. Analysis does not silently broaden to arbitrary external resources/dependencies.
20. Cached facts are revision-bound.
21. Equivalent Headless/TUI intent receives equivalent analysis semantics.
22. Provider success is evidence, not final application success.
23. Source Intelligence remains distinct from Source Transformation.
24. Source Intelligence remains distinct from Documentation, Nuxt, Quality and AI application semantics.
25. Known implementation limitations/defects do not become normative architecture.
26. The capability boundary does not require one class, package, parser, process or runtime topology.

---

## 39. Traceability Summary

| Detailed Design concern | Primary authority |
|---|---|
| read-only recognition | `FR-XFORM-004`–`010`; DD-2 decomposition §7.4 |
| structural facts | `FR-XFORM-006`–`007` |
| unsupported/ambiguous source | `FR-XFORM-008`–`010` |
| recognition versus mutation | `FR-XFORM-005`, `FR-XFORM-023`; root Design source-intelligence pipeline |
| source snapshot/freshness | `FR-XFORM-020`; DD-2.1 Resource Access |
| managed-scope separation | `FR-XFORM-021`–`025`; DD-1.3 Managed Project |
| provider boundedness | `FR-XFORM-002`; DD-1.5 Application Engine; DD-2 guardrail ACG-004 |
| application acceptance separation | `FR-XFORM-003`; DD-1.2 Execution Outcomes |
| declarations/blocks, metadata, documentation, configuration recognition | DD-2 decomposition §7.4; legacy scanner/strategy evidence |
| provider replaceability | ADR-0001; root Design implementation-topology independence |

---

## 40. Downstream Detailed Design Dependencies

### 40.1 DD-2.5 Source Transformation

DD-2.5 shall consume this design's normalized source facts, source ranges, support/ambiguity states and revision evidence while defining transformation intent, strategy selection, plans, edits, validation and application acceptance boundaries separately.

It shall not redefine recognition as mutation authority.

### 40.2 Later shared capabilities

Documentation, Nuxt, Quality and AI capability designs may consume Source Intelligence where appropriate but shall retain their own capability semantics and authority boundaries.

### 40.3 Implementation Specification

Implementation planning shall reconcile the current scanner, strategy, code-service and structured-data implementations against this design without treating current source topology as normative architecture.

---

## 41. Final Design Position

The permanent Version 1 position is:

> **Source Intelligence owns read-only recognition and normalized structural facts about source. It does not own transformation intent, source mutation, managed scope or application acceptance.**

This preserves the root architecture's staged source model:

```text
recognition
    -> structural facts
    -> transformation strategy/planning
    -> bounded transformation
    -> source-level validation
    -> application acceptance
```

The next shared capability, DD-2.5 Source Transformation, may therefore rely on a stable analytical boundary without inheriting scanner-, parser-, regex-, AST- or implementation-specific authority.