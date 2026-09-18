# DD-2.4 — AppManager Source Intelligence Detailed Design

> **Detailed Design ID:** DD-2.4
>
> **Design family:** DD-2 — Shared Capabilities

> **Status:** Version 1 Detailed Design Specification
>
> **Detailed Design authority:** This document defines the permanent shared contracts for read-only source recognition, structural analysis and normalized source facts beneath AppManager application and transformation authority. It refines, but does not override, the root Design Specification, Functional Specifications, accepted ADRs, or the DD-1 Application Core Detailed Designs.
>
> **Sources and navigation:** [Project Documentation Guide](../project-documentation-guide-v01.md), [AppManager Design Specification](../appmanager-design-specification-v01.md), [Detailed Design Register](../project_management/detailed-design-register-v01.md), [ADR-0001 — Primary Application Runtime](../project_management/decisions/adr-0001-primary-application-runtime.md)
>
> **Related Detailed Design authorities:** [DD-1.1 — Application Invocation](../dd_1_application_core/dd-1-1-application-invocation-detailed-design-v01.md), [DD-1.2 — Execution Outcomes](../dd_1_application_core/dd-1-2-execution-outcomes-detailed-design-v01.md), [DD-1.3 — Managed Project](../dd_1_application_core/dd-1-3-managed-project-detailed-design-v01.md), [DD-1.4 — Configuration Resolution](../dd_1_application_core/dd-1-4-configuration-resolution-detailed-design-v01.md), [DD-1.5 — Application Engine](../dd_1_application_core/dd-1-5-application-engine-detailed-design-v01.md), [DD-2.1 — Resource Access](dd-2-1-resource-access-detailed-design-v01.md), [DD-2.2 — Process Execution](dd-2-2-process-execution-detailed-design-v01.md), [DD-2.3 — Repository Capability](dd-2-3-repository-capability-detailed-design-v01.md)
>
> **Primary Functional authority:** [docs/functional/source-transformation-functional-specification-v01.md](../functional/source-transformation-functional-specification-v01.md)
>
> **Related domain Functional authorities:** App, Docs, Nuxt, Quality, AI, Settings and Maintenance where those domains consume source facts or request later source transformation.

---

## 1. Purpose

Source Intelligence provides snapshot-bound, read-only source analysis between resource acquisition and the consumers that need structural facts. Its requests specify analytical purpose; its results retain locations, support, ambiguity and provenance so transformation, documentation and domain workflows can use exactly the evidence established. Repository context has the optional composition defined in §7.4.

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

<a id="dd-sint-001"></a>

**DD-SINT-001 — Analysis does not imply resource authority**

Read/analyze ability applies [Design](../appmanager-design-specification-v01.md#_9-9-non-destructive-ownership-and-unmanaged-content).

### 4.2 Relationship to Source Transformation

Source Intelligence supplies facts. Source Transformation consumes those facts to derive or validate bounded transformation work under its own Detailed Design.

<a id="dd-sint-002"></a>

**DD-SINT-002 — Recognition/transformation separation**

Analysis side effects follows [FR-XFORM-005](../functional/source-transformation-functional-specification-v01.md#fr-xform-005).

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

<a id="dd-sint-003"></a>

**DD-SINT-003 — Bounded analytical purpose**  
A request shall identify sufficient analytical purpose to avoid unnecessary broad analysis where a narrower fact request is adequate.

<a id="dd-sint-004"></a>

**DD-SINT-004 — Hints are not unquestionable truth**  
Filename extensions, caller hints, MIME-like labels or conventional paths may contribute recognition evidence but shall not silently override materially contradictory source evidence where correctness or safety depends on the distinction.

<a id="dd-sint-005"></a>

**DD-SINT-005 — Read-only request**

Analysis-request write authority follows [FR-XFORM-005](../functional/source-transformation-functional-specification-v01.md#fr-xform-005).


---

## 7. Source Reference and Snapshot Semantics

### 7.1 Source reference

A source reference identifies the logical source being analyzed sufficiently for diagnostics, correlation and downstream stale-state checks.

It may refer to a whole resource or an explicitly bounded embedded region.

### 7.2 Snapshot identity

Analysis facts describe a particular observed source state.

<a id="dd-sint-006"></a>

**DD-SINT-006 — Facts are snapshot-bound**  
Where downstream correctness depends on source stability, Source Intelligence shall associate facts with revision, digest, version or equivalent evidence sufficient to detect material source change before consequential use.

### 7.3 Content ownership

Source Intelligence does not own source persistence. It consumes source content through Resource Access or another explicitly governed source provider.

<a id="dd-sint-007"></a>

**DD-SINT-007 — No hidden reread authority**  
An analysis provider shall not silently bypass governed Resource Access and reread arbitrary project files merely for convenience when doing so could alter scope, freshness or security semantics.

---

### 7.4 Optional repository context {#repository-context}

The caller may accompany a source snapshot with bounded [Repository Capability](dd-2-3-repository-capability-detailed-design-v01.md) evidence for provenance, freshness or analytical context. That evidence is optional unless the owning use case requires it; a resource's location inside a repository alone does not require a Repository Capability dependency. Source Intelligence continues to determine recognition and structure from its source snapshot.

Repository revisions, refs, status, staging and diff/change records describe repository state. They neither substitute for structural analysis nor determine source confidence or recognition. A workflow needing both kinds of evidence composes the capability results explicitly through its owning use case or another documented capability boundary; neither sibling imposes native identities or a provider model on the other.

Repository revision and source snapshot evidence can correlate without being identical. An uncommitted worktree, an in-memory snapshot, an embedded region or a resource outside a repository needs the freshness evidence appropriate to the actual source fact. Consumers retain that evidence under DD-SINT-006 rather than coercing it into a universal repository revision type.

This composition does not require either capability to call the other, a shared service/provider abstraction, a shared revision type or a particular package/process topology. Repository workflow intent, staging/commit selection and mutation remain outside Source Intelligence's read-only contract; source analysis does not reinterpret refs/remotes/diff semantics or expand the supplied scope.

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

<a id="dd-sint-008"></a>

**DD-SINT-008 — Recognition is explicit evidence**  
Recognition shall produce a distinguishable result rather than hiding source-kind assumptions inside a later parser call.

<a id="dd-sint-009"></a>

**DD-SINT-009 — Extension is not universal truth**

Extension evidence where stronger structural certainty is required follows [DD-SINT-004](#dd-sint-004).

<a id="dd-sint-010"></a>

**DD-SINT-010 — Unsupported is first-class**  
A source kind for which AppManager lacks the required analytical capability shall be represented as unsupported rather than coerced through an unrelated provider.

### 8.3 Ambiguous recognition

<a id="dd-sint-011"></a>

**DD-SINT-011 — Ambiguity is preserved**

Recognition ambiguity follows [FR-XFORM-009](../functional/source-transformation-functional-specification-v01.md#fr-xform-009).


---

## 9. Supported Source Kinds

Version 1 must support the source kinds required by approved functional use cases. Existing implementation evidence includes TypeScript, JavaScript, Vue, CSS, HTML and JSON-family analysis, but the exact implementation set does not by itself define permanent architecture.

<a id="dd-sint-012"></a>

**DD-SINT-012 — Capability-driven support**  
Supported source kinds shall be discoverable through the Source Intelligence capability contract rather than hard-coded independently by each consuming domain.

<a id="dd-sint-013"></a>

**DD-SINT-013 — Support is fact-class specific**  
A provider may support some analytical facts for a source kind without supporting every possible fact. For example, metadata recognition may be available even when declaration extraction is not.

<a id="dd-sint-014"></a>

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

<a id="dd-sint-015"></a>

**DD-SINT-015 — Provider-model isolation**  
AST nodes, CST nodes, compiler symbols, scanner tokens, parser cursors, regex match objects and language-service SDK objects shall not become the general Source Intelligence contract.

A provider-specific representation may remain available behind the capability boundary for a tightly coupled provider operation, but shared consumers shall depend on normalized facts.

### 10.3 Fact granularity

<a id="dd-sint-016"></a>

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

<a id="dd-sint-017"></a>

**DD-SINT-017 — Stable range semantics**  
Range endpoints and inclusion/exclusion semantics shall be defined consistently so downstream planning does not depend on provider-specific cursor conventions.

<a id="dd-sint-018"></a>

**DD-SINT-018 — Location is not edit authority**

Observed source ranges applies [Design](../appmanager-design-specification-v01.md#_9-9-non-destructive-ownership-and-unmanaged-content).


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

<a id="dd-sint-019"></a>

**DD-SINT-019 — Declaration identity is structural evidence**

Declaration/block facts used in transformation planning applies [Design](../appmanager-design-specification-v01.md#_7-5-strategies-and-transformation-plans).

<a id="dd-sint-020"></a>

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

<a id="dd-sint-021"></a>

**DD-SINT-021 — Metadata recognition is schema-aware**  
The existence of a field or object with a familiar name shall not automatically establish that it follows an unrelated recognized schema.

<a id="dd-sint-022"></a>

**DD-SINT-022 — No metadata injection**

Header recognition follows [FR-XFORM-005](../functional/source-transformation-functional-specification-v01.md#fr-xform-005).


---

## 14. Documentation-Presence Facts

Source Intelligence may report whether recognized declarations/blocks already have associated documentation.

Documentation presence should be capable of distinguishing, where required:

- documentation present;
- documentation absent;
- association ambiguous;
- unsupported association analysis;
- malformed documentation region.

<a id="dd-sint-023"></a>

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

<a id="dd-sint-024"></a>

**DD-SINT-024 — Configuration structure is not effective configuration**

Recognized settings are structural inputs to [DD-1.4 resolution](../dd_1_application_core/dd-1-4-configuration-resolution-detailed-design-v01.md#_15-resolution-result).

<a id="dd-sint-025"></a>

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

<a id="dd-sint-026"></a>

**DD-SINT-026 — Composite source preserves containment**  
Facts derived from an embedded region shall preserve sufficient containment and coordinate information to identify their location in the original source resource.

<a id="dd-sint-027"></a>

**DD-SINT-027 — Embedded analysis is bounded**  
Recognition of an embedded region shall not imply permission to inspect arbitrary external dependencies referenced by that region.

---

## 17. Lexical Tokens and Scanner Evidence

Existing AppManager implementation includes hand-written token scanners for several source kinds. Tokens can be useful provider-level evidence, but tokenization is not itself the permanent shared Source Intelligence abstraction.

<a id="dd-sint-028"></a>

**DD-SINT-028 — Tokens remain provider-level unless required**

Scanner-token implementation representations follows [DD-SINT-015](#dd-sint-015).

<a id="dd-sint-029"></a>

**DD-SINT-029 — Token location correctness is provider conformance**  
Where a provider uses tokens to derive structural facts, token range/location correctness is part of provider correctness and must be testable independently.

<a id="dd-sint-030"></a>

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

<a id="dd-sint-031"></a>

**DD-SINT-031 — Provider choice follows required semantics**  
Provider selection shall be based on the fact class and source kind required, not on a universal preference for scanner, regex, AST or compiler technology.

<a id="dd-sint-032"></a>

**DD-SINT-032 — Provider sophistication is not authority**

Richer parser/compiler evidence applies [Design](../appmanager-design-specification-v01.md#_6-6-capability-boundaries-and-providers).

<a id="dd-sint-033"></a>

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

<a id="dd-sint-034"></a>

**DD-SINT-034 — Absence is not failure**  
A supported analysis that proves a declaration, metadata field or documentation region absent shall not be collapsed into provider failure.

<a id="dd-sint-035"></a>

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

<a id="dd-sint-036"></a>

**DD-SINT-036 — No arbitrary first-match authority**

Material choices based on incidental provider, filesystem, match or registry order follows [FR-XFORM-009](../functional/source-transformation-functional-specification-v01.md#fr-xform-009).

<a id="dd-sint-037"></a>

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

<a id="dd-sint-038"></a>

**DD-SINT-038 — Diagnostics are evidence**

Recognition diagnostics follows [DD-1.2](../dd_1_application_core/dd-1-2-execution-outcomes-detailed-design-v01.md#_19-application-level-interpretation).

<a id="dd-sint-039"></a>

**DD-SINT-039 — Provider detail is subordinate**

Parser/compiler exceptions and object graphs follows [DD-1.2](../dd_1_application_core/dd-1-2-execution-outcomes-detailed-design-v01.md#_18-provider-result-normalization).


---

## 22. Determinism

<a id="dd-sint-040"></a>

**DD-SINT-040 — Equivalent-source determinism**  
Given materially equivalent source content, analysis request, effective configuration and provider capability, Source Intelligence should produce materially equivalent normalized facts independent of TUI, Headless or host adapter.

<a id="dd-sint-041"></a>

**DD-SINT-041 — No presentation-dependent recognition**  
Recognition shall not depend on an interactive prompt or terminal-only choice. If disambiguation requires caller input, the ambiguity must be representable through the invocation/application model.

---

## 23. Caching and Reuse

Source Intelligence may cache analysis results for performance, but cache identity must preserve correctness.

<a id="dd-sint-042"></a>

**DD-SINT-042 — Cache is revision-bound**  
Cached facts shall only be reused when the implementation can establish that the relevant source state and analysis inputs remain materially equivalent.

<a id="dd-sint-043"></a>

**DD-SINT-043 — Cache is not authority**

Cache reuse when current evidence shows changed source follows [DD-SINT-042](#dd-sint-042).

<a id="dd-sint-044"></a>

**DD-SINT-044 — Cache invisibility**

Facts after mode-specific cache warming follows [DD-SINT-040](#dd-sint-040).


---

## 24. Cancellation and Expensive Analysis

Most Version 1 source inspection may be local and short-lived, but the capability contract shall not preclude expensive parser/language-service operations.

<a id="dd-sint-045"></a>

**DD-SINT-045 — Cancellation propagation**

Cancellable analysis propagates the [DD-1.2](../dd_1_application_core/dd-1-2-execution-outcomes-detailed-design-v01.md#_17-cancellation-model) context to supported providers.

<a id="dd-sint-046"></a>

**DD-SINT-046 — Cancellation does not fabricate facts**  
Facts not reliably established before cancellation shall not be reported as complete merely to provide a terminal result.

---

## 25. Sensitive and Untrusted Source

Project source is input data and may be malformed, adversarial or sensitive.

<a id="dd-sint-047"></a>

**DD-SINT-047 — Analysis does not execute source**  
Ordinary Source Intelligence shall not execute analyzed project code merely to understand its structure unless a separately governed capability explicitly requires execution.

<a id="dd-sint-048"></a>

**DD-SINT-048 — No implicit dependency loading**

Provider import/execution of project modules or plugins follows [DD-SINT-047](#dd-sint-047).

<a id="dd-sint-049"></a>

**DD-SINT-049 — Sensitive fact minimization**

Source fragments in evidence; identity/ranges suffice where content is unnecessary follows [DD-1.2](../dd_1_application_core/dd-1-2-execution-outcomes-detailed-design-v01.md#_24-sensitive-information-and-redaction).

<a id="dd-sint-050"></a>

**DD-SINT-050 — Untrusted provider input**  
Provider implementations shall treat project-authored source as untrusted input and bound recursion, resource use or other parser risks where materially applicable.

---

## 26. Relationship to Managed Project and Scope

Managed Project may consume Source Intelligence evidence during project understanding, and Source Intelligence may consume managed context to constrain requested analysis. Neither relationship transfers authority.

<a id="dd-sint-051"></a>

**DD-SINT-051 — Recognition does not establish managed scope**

Nuxt declarations, layer-like structure and metadata markers applies [Design](../appmanager-design-specification-v01.md#_9-6-project-discovery-and-context-resolution).

<a id="dd-sint-052"></a>

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

<a id="dd-sint-053"></a>

**DD-SINT-053 — No private configuration precedence**

Analysis consumes [DD-1.4 effective values](../dd_1_application_core/dd-1-4-configuration-resolution-detailed-design-v01.md#_15-resolution-result); recognized configuration remains a separate structural input.


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

<a id="dd-sint-054"></a>

**DD-SINT-054 — Analysis success is not application success**

Structural-analysis completion applies [Design](../appmanager-design-specification-v01.md#_11-11-workflow-results-failure-and-acceptance).

<a id="dd-sint-055"></a>

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

<a id="dd-sint-056"></a>

**DD-SINT-056 — Facts may inform plans, not authorize them**

Source-fact handoff to transformation intent/planning applies [Design](../appmanager-design-specification-v01.md#_7-5-strategies-and-transformation-plans).

<a id="dd-sint-057"></a>

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

<a id="dd-sint-058"></a>

**DD-SINT-058 — Documentation semantics remain downstream**

Documentation-relevant structures feed [Documentation Capability](dd-2-9-documentation-capability-detailed-design-v01.md); its model and the Docs workflow determine documentation adequacy and acceptance.


---

## 31. Relationship to Nuxt Capability

Nuxt Capability may consume Source Intelligence for Nuxt/Vue/configuration recognition.

<a id="dd-sint-059"></a>

**DD-SINT-059 — Generic source facts do not replace Nuxt semantics**

Vue/TypeScript/configuration facts feed [Nuxt Capability](dd-2-10-nuxt-capability-detailed-design-v01.md) for Nuxt meaning and [Managed Project](../dd_1_application_core/dd-1-3-managed-project-detailed-design-v01.md) for layer identity.


---

## 32. Relationship to Quality Capability

Quality may consume source facts for discovery or contextual diagnostics.

<a id="dd-sint-060"></a>

**DD-SINT-060 — Inspection is not quality acceptance**

Malformed-source facts are inputs to the [Quality Domain](../dd_4_policy_and_resource_domains/dd-4-1-quality-domain-detailed-design-v01.md) when a quality use case consumes them.


---

## 33. Relationship to AI Capability

AI workflows may consume bounded structural facts or source excerpts selected under AI policy.

<a id="dd-sint-061"></a>

**DD-SINT-061 — Intelligence output is not automatic AI context**

Disclosure of source underlying a fact/range uses [AI Capability context policy](dd-2-7-ai-capability-detailed-design-v01.md); recognition alone is not a disclosure request.


---

## 34. Provider Availability and Capability Discovery

Source Intelligence should support capability discovery sufficient to answer whether a requested source kind/fact class can be analyzed.

<a id="dd-sint-062"></a>

**DD-SINT-062 — Availability is fact-specific**

Fact-class/source-kind provider availability follows [DD-SINT-013](#dd-sint-013).

<a id="dd-sint-063"></a>

**DD-SINT-063 — No silent provider fallback with weaker semantics**  
A provider may only be substituted when it satisfies the required Source Intelligence contract. Falling from structural parsing to a materially weaker heuristic shall be explicit in evidence where certainty changes.

---

## 35. Provider Replaceability

Version 1 may use TypeScript/Node-native implementations, hand-written scanners, regular expressions and `jsonc-parser`. These are implementation choices, not permanent architecture unless explicitly elevated.

<a id="dd-sint-064"></a>

**DD-SINT-064 — Semantic provider boundary**  
A replacement provider shall preserve the normalized fact semantics promised by this design or explicitly report unsupported/partial capability.

<a id="dd-sint-065"></a>

**DD-SINT-065 — No speculative transport abstraction**

Source analysis topology follows the [Documentation Guide](../project-documentation-guide-v01.md#_8-level-4-implementation-specification); no worker, RPC, language-neutral schema or plugin runtime is required.


---

## 36. Current Implementation Reconciliation

This section is historical implementation evidence under the [Documentation Guide reading conventions](../project-documentation-guide-v01.md#detailed-design-reading-conventions), not permanent product authority.

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

<a id="dd-sint-066"></a>

**DD-SINT-066 — Implementation reconciliation occurs later**

Current scanner/strategy/service adaptation belongs to [Implementation Specification](../project-documentation-guide-v01.md#_8-level-4-implementation-specification).

### 36.4 Known scanner defect

Historical scanner review identified an HTML quoted-attribute cursor over-consumption defect. That finding is implementation/provider evidence, not a reason to encode the defective cursor behavior into the Source Intelligence contract.

<a id="dd-sint-067"></a>

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

<a id="dd-sint-068"></a>

**DD-SINT-068 — No real project mutation required for analysis tests**  
Core Source Intelligence conformance tests should operate against immutable source fixtures/snapshots and shall not require consequential project mutation.

---

## 38. Conformance Invariants

Request/snapshot/recognition contracts (§§6–9), structural and embedded facts (§§10–17), provider/ambiguity behavior (§§18–20), and cache/security/collaboration contracts supply the conformance obligations. The testability section exercises them without consequential project mutation.

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

## 40. Contract Consumers and Implementation Dependencies {#_40-downstream-detailed-design-dependencies}

### 40.1 DD-2.5 Source Transformation

[Source Transformation](dd-2-5-source-transformation-detailed-design-v01.md) consumes the normalized facts, source ranges, support/ambiguity states and revision evidence defined here when constructing its plans. Recognition feeds the [Design §7.9](../appmanager-design-specification-v01.md#_7-9-inspection-and-mutation-separation) boundary.

### 40.2 Consumers

[Documentation](dd-2-9-documentation-capability-detailed-design-v01.md), [Nuxt](dd-2-10-nuxt-capability-detailed-design-v01.md), [Quality](dd-2-8-quality-capability-detailed-design-v01.md) and [AI](dd-2-7-ai-capability-detailed-design-v01.md) interpret relevant source evidence through their respective specialist models.

### 40.3 Implementation Specification

Implementation planning shall reconcile the current scanner, strategy, code-service and structured-data implementations against this design without treating current source topology as normative architecture.

---

## 41. Final Design Position

The [architectural position](#_4-architectural-position) provides the collaboration map. The local models and workflows above, together with their direct upstream bindings, define the Version 1 contract; the conformance and testability sections provide the review route.
