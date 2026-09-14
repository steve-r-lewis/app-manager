# DD-3.4 — AppManager Docs Domain Detailed Design

> **Detailed Design ID:** DD-3.4
>
> **Design family:** DD-3 — High-Coupling Domains
>
> **Status:** Version 1 Detailed Design Specification
>
> **Detailed Design authority:** This document defines the permanent Docs-domain orchestration, documentation-target policy, decision, state and result contracts by which AppManager realises documentation inspection, derivation, generation, update, aggregation and documentation-tooling use cases through the DD-1 Application Core and DD-2 Shared Capability contracts.
>
> **Governing sources:** [Project Documentation Guide](../project-documentation-guide-v01.md), [AppManager Design Specification](../appmanager-design-specification-v01.md), [docs/functional/docs-functional-specification-v01.md](../functional/docs-functional-specification-v01.md), accepted ADRs, and the normative DD-1/DD-2 Detailed Designs and active clarifications.
>
> **Authoring controls:** [Detailed Design Decomposition Plan and Canonical Register](../project_management/detailed-design-decomposition-plan-v01.md), [Domain Detailed Design Authoring Guide](../project_management/domain-detailed-design-authoring-guide-v01.md), [Nuxt Layer Scaffold Artefact Ownership Clarification](../dd_2_shared_capabilities/clarifications/nuxt-layer-scaffold-artefact-ownership-clarification-v01.md)

---

## 1. Purpose

This specification defines the permanent internal Docs-domain design for documentation-oriented application intent across AppManager managed projects.

The Docs domain composes authoritative Application Core context with DD-2.9 Documentation Capability and other bounded specialist capabilities to document complete managed applications, application source, managed layers, tests and selected files; to generate or update documentation artefacts; to aggregate documentation from approved facts; and to operate supported documentation development, build and preview workflows.

The governing rule is:

> **The Docs domain owns documentation application intent, target/profile policy, orchestration and domain acceptance; DD-2.9 Documentation Capability owns bounded documentation inspection, modeling, aggregation, rendering, tooling and validation semantics; the Application Engine retains final application authority.**

A second rule is:

> **Documentation intent does not transfer source, Nuxt, Quality, AI, process, template, persistence or managed-project authority into the Docs domain merely because those concerns contribute evidence or execution.**

A third rule is:

> **Documentation truth is provenance-sensitive: reliably recognized structural or domain facts, existing authored documentation and generated explanatory prose shall not be collapsed into one undifferentiated authority source.**

---

## 2. Scope

### 2.1 In Scope

This design owns permanent Docs-domain contracts for:

- Docs-domain operation identity and applicability;
- documentation target classes and target-selection policy over DD-1.3 managed-project context;
- documentation profiles and domain-level completeness expectations;
- complete-application documentation orchestration;
- application-source documentation orchestration;
- all-managed-layers and selected-layer documentation orchestration;
- test documentation orchestration without acquiring test-execution authority;
- selected-file documentation and eligibility policy;
- documentation fact-selection and provenance policy above bounded capability facts;
- generation versus update intent and output-scope policy;
- documentation output collision, replacement and preservation policy;
- optional AI-enrichment policy and acceptance;
- documentation development, build and preview use-case orchestration;
- extraction and aggregation selection policy;
- coverage, omission, unsupported-target and freshness interpretation;
- multi-target and multi-artefact continuation policy;
- documentation-specific partial-effect and recovery interpretation;
- cancellation and long-running tooling interpretation;
- deterministic Headless target resolution;
- documentation-specific security and sensitive-information policy;
- interpretation of DD-2 capability evidence against Docs-domain postconditions.

### 2.2 Out of Scope

This design does not own or redefine:

- invocation identity, caller authorization evidence, cancellation linkage or interaction-mode semantics owned by DD-1.1;
- canonical success, failure, partial-success, cancellation, diagnostics, warnings or effects owned by DD-1.2;
- managed-project identity, root/layer topology, managed scope or mutation authority owned by DD-1.3;
- configuration precedence, provenance or effective-value construction owned by DD-1.4;
- application-wide dispatch, final authority, final acceptance or outcome publication owned by DD-1.5;
- filesystem/resource mechanics owned by DD-2.1;
- external-process mechanics owned by DD-2.2;
- repository semantics owned by DD-2.3 and DD-3.2;
- generic source recognition owned by DD-2.4;
- source/document transformation planning, preservation, stale-write handling and mutation mechanics owned by DD-2.5;
- declarative resource identity, parameter binding or template rendering substrate owned by DD-2.6;
- AI provider/model execution, disclosure safety or structured-output mechanics owned by DD-2.7;
- independent test/lint/typecheck/coverage/gate semantics owned by DD-2.8 and the Quality domain;
- bounded documentation modeling, rendering, aggregation and tooling mechanics owned by DD-2.9;
- Nuxt recognition, configuration, layer or integration semantics owned by DD-2.10 and DD-3.3;
- App lifecycle semantics;
- Settings or licence-management semantics;
- governance of AppManager's own specification/documentation repository, which remains governed by the Project Documentation Guide;
- exact Markdown/VitePress syntax, templates, package commands, TypeScript interfaces, classes, services, source paths, package topology, parser libraries, renderers or provider wiring.

---

## 3. Governing Requirements and Authorities

### 3.1 Functional ownership

The Docs domain owns `FR-DOCS-001` through `FR-DOCS-119` from [docs/functional/docs-functional-specification-v01.md](../functional/docs-functional-specification-v01.md).

| Functional range | Docs-domain concern |
|---|---|
| `FR-DOCS-001`–`005` | domain boundary, read-only default and delegated-authority rules |
| `FR-DOCS-006`–`018` | invocation, project context, scope, cancellation and retry |
| `FR-DOCS-019`–`030` | documentation target model |
| `FR-DOCS-031`–`040` | complete-application documentation |
| `FR-DOCS-041`–`050` | application-source documentation |
| `FR-DOCS-051`–`060` | managed-layer documentation |
| `FR-DOCS-061`–`066` | test documentation |
| `FR-DOCS-067`–`072` | selected-file documentation |
| `FR-DOCS-073`–`083` | generation, update, preservation and partial writes |
| `FR-DOCS-084`–`090` | optional AI-assisted documentation |
| `FR-DOCS-091`–`099` | documentation tooling workflows |
| `FR-DOCS-100`–`105` | extraction and aggregation |
| `FR-DOCS-106`–`113` | results, diagnostics and acceptance |
| `FR-DOCS-114`–`119` | safety and non-destructive behavior |

### 3.2 Application Core authorities

DD-3.4 consumes DD-1.1 Application Invocation, DD-1.2 Execution Outcomes, DD-1.3 Managed Project, DD-1.4 Configuration Resolution and DD-1.5 Application Engine. It also remains governed by the Application Core bootstrap-resolution and outcome/diagnostic-ownership clarifications.

### 3.3 Shared capability authorities

The principal specialist is [DD-2.9 — Documentation Capability](../dd_2_shared_capabilities/dd-2-9-documentation-capability-detailed-design-v01.md). Docs supplies application intent, target/profile selection, managed-scope binding, policy, authorization and acceptance conditions; DD-2.9 supplies bounded documentation facts/models, aggregation, proposed outputs, tooling evidence and documentation-oriented validation.

Supporting authorities include DD-2.1 Resource Access, DD-2.2 Process Execution, DD-2.4 Source Intelligence, DD-2.5 Source Transformation, DD-2.6 Resource Registry and Template, DD-2.7 AI Capability, DD-2.8 Quality Capability and DD-2.10 Nuxt Capability where an approved Docs use case requires their evidence or execution.

### 3.4 Cross-domain authorities

DD-3.3 remains authoritative for Nuxt-domain facts and relationships; DD-3.2 remains authoritative for Git-domain intent; DD-3.1 remains authoritative for application lifecycle. Docs may consume their accepted facts without absorbing their semantics.

### 3.5 Runtime decision

ADR-0001 permits Node.js/TypeScript for Version 1 implementation but does not prescribe the implementation topology of this design.

---

## 4. Domain Responsibility and Authority Boundary

The Docs domain owns:

- semantic identity of Docs use cases;
- documentation-target and documentation-profile policy;
- operation-specific documentability/eligibility decisions;
- selection and exclusion policy over authoritative managed scope;
- generation versus update intent;
- output-destination and collision/replacement policy;
- interpretation of provenance, omissions, unsupported inputs and coverage against the requested documentation intent;
- acceptance of optional AI enrichment into documentation output;
- documentation-tool operation intent and target selection;
- multi-target ordering/continuation policy where application-visible;
- Docs-specific per-target/per-artefact result payloads and recovery information.

| Concern | Authoritative owner | Docs-domain relationship |
|---|---|---|
| invocation semantics | DD-1.1 | consumes normalized Docs intent, choices, preview/authorization and cancellation context |
| canonical outcomes | DD-1.2 | supplies Docs-specific payload/evidence without redefining outcome taxonomy |
| project topology/scope | DD-1.3 | consumes root/layer/resource identities and operation scope |
| effective configuration | DD-1.4 | consumes immutable operation-effective values |
| final application authority | DD-1.5 | returns Docs interpretation for final acceptance |
| documentation model/render/tool evidence | DD-2.9 | delegates bounded documentation mechanics |
| source facts | DD-2.4 | consumes structural evidence without redefining source truth |
| source/document mutation | DD-2.5 | delegates bounded transformations |
| Nuxt facts | DD-2.10 / DD-3.3 | consumes accepted Nuxt evidence |
| AI execution | DD-2.7 | requests bounded proposed enrichment |
| Quality semantics | DD-2.8 / DD-4.1 | consumes facts where relevant; does not execute/own gates |

```text
normalized invocation
        |
        v
Application Engine authority
        |
        +--> DD-1.3 managed project / operation scope
        +--> DD-1.4 effective configuration
        +--> DD-1.1 authorization / cancellation context
        |
        v
Docs-domain intent / target / profile / policy
        |
        +--> DD-2.9 documentation modeling/rendering/tooling evidence
        +--> DD-2.4 source facts
        +--> DD-2.10 / DD-3.3 Nuxt facts where required
        +--> DD-2.7 AI proposal where permitted
        +--> DD-2.1 / DD-2.5 persistence or transformation after authorization
        |
        v
Docs-domain interpretation / coverage / per-target result
        |
        v
Application Engine acceptance -> canonical DD-1.2 outcome
```

The diagram describes semantic authority, not a mandatory call graph.

---

## 5. Consumed DD-1 Application Core Contracts

| DD-1 contract | Docs-domain use |
|---|---|
| Application Invocation | receives canonical Docs intent, explicit selectors, output/update choices, preview intent, authorization evidence and cancellation linkage |
| Execution Outcomes | records target/artefact diagnostics, effects, warnings, subordinate results and partial completion |
| Managed Project | supplies root/layer/resource identities, managed scope and targetability constraints |
| Configuration Resolution | supplies operation-effective documentation, provider, template, AI and tooling policy values |
| Application Engine | supplies authoritative execution context and performs final acceptance |

### DD-DOCS-001 — No local reconstruction of Application Core authority

The Docs domain shall not reconstruct managed scope, effective configuration, invocation authorization or canonical outcome semantics from current working directory, recursive discovery, raw configuration, provider state or presentation choices.

---

## 6. Consumed DD-2 Shared Capabilities

### DD-DOCS-002 — Documentation Capability is the principal specialist boundary

DD-3.4 shall consume DD-2.9 for bounded documentation inspection/modeling, aggregation, rendering, proposed documentation outputs, documentation-tool capability evidence and documentation-oriented validation rather than duplicating those mechanics.

### DD-DOCS-003 — Capability success remains subordinate evidence

A successful scan, model, render, AI response, transformation, resource write, process launch or documentation build shall not by itself establish Docs-domain success.

### DD-DOCS-004 — Capability composition preserves specialist authority

Coordinating DD-2 capabilities shall not transfer their permanent semantic authority into Docs or permit Docs to bypass their safety contracts.

---

## 7. Domain Contract Model

### 7.1 Docs operation identity

**DD-DOCS-005 — Stable operation identities**  
Docs-domain intent shall distinguish at least complete-application documentation, application-source documentation, all-layers documentation, selected-layer documentation, tests documentation, selected-file documentation, documentation generation/update and supported documentation development/build/preview operations where applicable.

### 7.2 Documentation target

**DD-DOCS-006 — Semantic target identity**  
A Docs target shall identify its target class and authoritative managed-project/resource identity rather than relying on path or current working directory alone.

Supported target classes include complete managed application, application source, all eligible managed layers, selected managed layer, recognized tests and one selected eligible file.

**DD-DOCS-007 — Root/layer distinction is preserved**  
The root application, each managed layer and aggregate layer scopes shall remain distinguishable throughout orchestration and results.

**DD-DOCS-008 — Duplicate target normalization**  
Overlapping scopes that reach the same logical resource shall not cause accidental duplicate documentation in one logical operation unless explicitly requested by the profile.

### 7.3 Documentation eligibility decision

**DD-DOCS-009 — Eligibility is operation-relative**  
Managed membership or filesystem presence alone shall not establish documentability. Eligibility may depend on target class, supported recognition, documentation policy, selected profile, sensitivity and requested operation.

A decision should distinguish `eligible`, `ineligible`, `unsupported`, `ambiguous` and `indeterminate` with evidence and diagnostics.

### 7.4 Documentation profile

**DD-DOCS-010 — Profile is semantic, not renderer topology**  
A documentation profile may express requested information categories, exclusions, output kind, detail, aggregation/grouping, required/optional enrichment and completeness expectations without requiring one template, renderer or file layout.

**DD-DOCS-011 — Profile may narrow but not broaden managed scope**  
Profile selection shall not create target authority beyond DD-1.3 scope.

### 7.5 Documentation output intent

**DD-DOCS-012 — Generation and update are distinct intents**  
Creating a new documentation artefact and changing an existing artefact shall remain semantically distinct because they have different collision, preservation, authorization and transformation requirements.

**DD-DOCS-013 — Output destination is explicit before writes**  
Consequential documentation work shall resolve the intended output target/scope unambiguously before persistence or transformation.

### 7.6 Coverage and result payload

**DD-DOCS-014 — Coverage is profile-relative**  
Docs completeness shall be evaluated only against the approved target/profile, including required, optional, unsupported, omitted, failed and empty-but-valid categories.

**DD-DOCS-015 — Domain payload composes DD-1.2**  
Docs-specific target, artefact, coverage, freshness and tooling evidence shall extend canonical DD-1.2 semantics rather than create a competing application outcome envelope.

---

## 8. Use-Case Orchestration

### 8.1 Common flow

A Docs use case shall conceptually:

1. receive normalized intent and authoritative DD-1 context;
2. resolve the semantic Docs target and profile;
3. establish operation-specific eligibility and exclusions;
4. acquire fresh bounded source/domain/documentation evidence;
5. construct/aggregate documentation evidence through DD-2.9;
6. obtain optional enrichment only where policy permits;
7. render or inspect according to the selected intent;
8. for consequential output, resolve destination/collision/update policy and authorization;
9. delegate authorized creation or transformation through the proper capability;
10. validate relevant documentation postconditions;
11. interpret coverage, freshness, omissions, effects and subordinate failures;
12. return Docs-domain evidence for Application Engine acceptance.

**DD-DOCS-016 — Read-only inspection does not cross the mutation boundary**  
Inspection, extraction or derivation shall not create/update resources or start documentation tooling unless that consequential effect is explicitly part of the selected use case.

### 8.2 Complete-application documentation

**DD-DOCS-017 — Complete application means managed composition**  
Complete-application documentation shall derive its target set from the resolved managed project and profile rather than an unbounded recursive filesystem scan.

**DD-DOCS-018 — Partial coverage remains truthful**  
Failure or unsupported status for one required component shall remain attributable and shall prevent a false claim of complete coverage.

**DD-DOCS-019 — Empty optional categories are not failures**  
A project with no managed layers, tests or another optional category may still satisfy a profile that permits that category to be empty.

### 8.3 Application-source documentation

**DD-DOCS-020 — Source facts remain recognition evidence**  
Docs shall consume supported DD-2.4 structural facts and shall not promote unsupported textual inference to confirmed source structure.

**DD-DOCS-021 — Documentation injection is a separate consequential path**  
When documentation is inserted into existing source, Docs supplies documentation intent/content while DD-2.5 owns bounded edit planning, preservation, stale-state checks, application and source-level validation.

### 8.4 Layer documentation

**DD-DOCS-022 — Layer documentation consumes authoritative Nuxt facts**  
Nuxt layer/configuration/integration facts shall be obtained from DD-2.10/DD-3.3 or another approved authority; Docs shall not recreate Nuxt recognition.

**DD-DOCS-023 — Repository topology does not determine documentability**  
A layer's repository relationship, shared repository or absence of independent repository identity shall not by itself determine whether the managed layer is documentable.

**DD-DOCS-024 — All-layers continuation is explicit**  
A failure for one layer may permit safe continuation to remaining eligible layers according to Docs policy, while preserving per-layer truth and final partial completion.

### 8.5 Test documentation

**DD-DOCS-025 — Documentation of tests is not test execution**  
Docs may describe recognized test structures and reliable test/source relationships without acquiring Quality execution or gate authority.

**DD-DOCS-026 — Unresolved test relationships remain unresolved**  
Docs shall not invent a test-to-source relationship when approved evidence cannot establish it.

### 8.6 Selected-file documentation

**DD-DOCS-027 — Selected file resolves exactly one eligible resource**  
A selected-file use case shall fail safely on ambiguity, unsupported/binary input or out-of-scope target rather than silently choosing or treating it as documentable text.

### 8.7 Generation and update

**DD-DOCS-028 — Proposed content precedes persistence**  
Rendering/generation through DD-2.9 produces proposed documentation; persistence remains a separately authorized stage.

**DD-DOCS-029 — Existing-output collision is not overwrite authority**  
An existing destination shall trigger the applicable update/replacement/collision policy rather than silent replacement.

**DD-DOCS-030 — Narrow update is preferred where semantically supported**  
Where an existing documentation artefact has a recognized bounded update region, Docs shall prefer the approved bounded transformation path over unnecessary whole-document replacement.

**DD-DOCS-031 — Substantial replacement is explicit**  
Replacement or material restructuring of existing authored documentation requires explicit applicable policy and authorization/confirmation evidence where required.

### 8.8 AI-assisted documentation

**DD-DOCS-032 — AI is optional where deterministic baseline exists**  
Failure or absence of optional AI enrichment shall not make deterministic documentation unavailable where the requested baseline can be produced without AI.

**DD-DOCS-033 — AI output is proposed documentation evidence**  
AI-generated prose shall retain generated provenance and shall be accepted or rejected by Docs policy before it contributes to an accepted output.

**DD-DOCS-034 — Reliable facts dominate contradictory generated claims**  
Docs shall not knowingly accept AI prose that contradicts higher-authority structural or domain facts without explicit conflict handling.

### 8.9 Documentation tooling

**DD-DOCS-035 — Tooling target is explicit**  
Development, build or preview shall identify the documentation project/target unambiguously and shall not silently choose between AppManager's own documentation and a managed project's documentation.

**DD-DOCS-036 — Tool launch/build evidence is not Docs acceptance**  
Provider launch, process success, server start or build completion remains subordinate evidence interpreted against the requested Docs tooling intent.

**DD-DOCS-037 — Long-running tooling state remains explicit**  
Development/preview operations may remain running; their result/state model shall not falsely represent them as completed generation operations.

### 8.10 Extraction and aggregation

**DD-DOCS-038 — Aggregation follows bounded selection policy**  
Aggregation shall use approved targets, managed scope, profile and exclusions rather than an unbounded recursive scan.

**DD-DOCS-039 — Provenance survives aggregation**  
Important facts, omissions, unsupported inputs and failures shall remain attributable after multi-file/multi-layer aggregation.

---

## 9. Domain State and State Transitions

**DD-DOCS-040 — Conceptual domain states**  
A Docs operation may progress through `context_resolved`, `target_resolved`, `eligibility_established`, `evidence_acquired`, `model_composed`, `proposal_ready`, `authorization_satisfied`, `persisting_or_tooling`, `validating`, `interpreting`, and terminal domain positions such as `accepted`, `rejected`, `partially_completed`, `cancelled` or `indeterminate`.

These states are semantic checkpoints, not required classes or persistence records.

**DD-DOCS-041 — Read-only operations terminate before persistence**  
Inspection/extraction operations may move from model/evidence interpretation directly to acceptance without passing through mutation/tooling states.

**DD-DOCS-042 — Multi-target state is per target/artefact**  
Coordinated documentation shall retain each target/artefact's semantic position rather than deriving all state from one aggregate provider status.

**DD-DOCS-043 — State progression does not manufacture authority**  
Reaching a later state does not retroactively authorize an earlier ambiguous target, unsupported input or unapproved effect.

---

## 10. Domain Policy and Decision Rules

**DD-DOCS-044 — Current working directory is context, not target authority**  
Working directory may contribute invocation context but shall not be the sole semantic documentation selector.

**DD-DOCS-045 — Discovery never broadens scope**  
Recognition of extra files, layers, tests, documentation or tooling shall not automatically add them to the approved documentation target set.

**DD-DOCS-046 — Unsupported does not count as documented**  
Unsupported or failed required inputs shall not be counted toward complete documentation coverage merely because other outputs were produced.

**DD-DOCS-047 — Existing documentation is contextual evidence**  
Existing authored documentation may contribute context but shall not automatically override fresher authoritative source/domain facts or grant rewrite authority.

**DD-DOCS-048 — No false freshness**  
Docs shall not claim refreshed/synchronized documentation when required inputs could not be refreshed, became materially stale, or a required update failed.

**DD-DOCS-049 — Retry/fallback is governed**  
A provider/capability failure shall not silently authorize changed targets, changed providers or changed semantics unless effective policy permits that retry/fallback.

**DD-DOCS-050 — Tool availability is target-relative**  
Recognition of a documentation provider/tool for one target shall not imply availability for all documentation targets.

---

## 11. Safety, Mutation, and Authorization

**DD-DOCS-051 — Documentation recognition is not mutation authority**  
Recognition of a documentable target, declaration, documentation region, existing artefact or output path shall not authorize a write.

**DD-DOCS-052 — Mutation authority is output-bounded**  
A Docs write/update shall be limited to the explicitly approved documentation output or bounded documentation region and shall not silently extend to unrelated source/configuration.

**DD-DOCS-053 — New creation and existing-resource mutation use different effect paths**  
New authorized documentation resources use the approved Resource Access creation path; existing-resource changes use Source Transformation where transformation semantics apply.

**DD-DOCS-054 — Symlink/indirection escape is prohibited**  
Target/output resolution shall preserve DD-1.3/DD-2.1 scope safety and shall not allow indirection to escape approved documentation scope.

**DD-DOCS-055 — No implicit deletion**  
Generation/update shall not delete unrelated existing documentation merely because it is absent from a newly generated set.

**DD-DOCS-056 — Tooling effects are explicit**  
Starting servers, processes or builds shall be consequential Docs intents and shall not occur as hidden side effects of read-only inspection.

---

## 12. Failure, Cancellation, and Partial Effects

**DD-DOCS-057 — Failure remains target/stage attributable**  
Target-resolution, inspection, modeling, enrichment, rendering, persistence, transformation, tooling and acceptance failures shall remain distinguishable where material.

**DD-DOCS-058 — Partial completion is first-class**  
Multi-target/multi-artefact operations shall preserve successful, unchanged, skipped, unsupported, failed and not-attempted states rather than collapse mixed outcomes.

**DD-DOCS-059 — No universal rollback claim**  
Docs shall not imply transactional rollback across generated files, transformations, external AI usage or documentation-tool effects unless the owning lower-level contract guarantees it.

**DD-DOCS-060 — Cancellation stops future work when safely observed**  
Cancellation shall stop new stages/targets and propagate to active delegates where supported while preserving already completed effects/evidence.

**DD-DOCS-061 — Cancellation does not erase completed effects**  
Written/updated artefacts, AI disclosures, generated tooling outputs and process effects that already occurred remain truthful in the result.

**DD-DOCS-062 — Indeterminate effects require verification**  
Where persistence/tooling completion is uncertain, Docs shall preserve indeterminate state and require verification/recovery rather than fabricate success or failure.

---

## 13. Headless and Interaction Independence

**DD-DOCS-063 — One semantic model across adapters**  
TUI, Headless, IDE, GUI, CI and future adapters shall express equivalent Docs intent, target/profile policy, safety and acceptance semantics.

**DD-DOCS-064 — Interactive selection is presentation only**  
Menus/file pickers may help choose among eligible targets but shall resolve to the same semantic target contracts available to non-interactive callers.

**DD-DOCS-065 — Headless ambiguity fails safely**  
Missing or ambiguous required target, output destination, overwrite/replacement intent or consequential tooling selection shall produce structured failure rather than prompting or guessing.

**DD-DOCS-066 — Results are machine-consumable**  
Automation shall be able to identify requested scope, target/artefact states, coverage, warnings, effects and failures without parsing human UI text or provider stdout/stderr.

---

## 14. Concurrency, Idempotency, and Conflict Behaviour

**DD-DOCS-067 — Consequential preconditions are revalidated**  
Output existence, target revision, relevant source facts and other material preconditions shall be revalidated before applying a previously prepared consequential action where staleness could matter.

**DD-DOCS-068 — Deterministic generation is semantically repeatable**  
Given materially equivalent authoritative facts, profile and effective configuration, deterministic documentation generation should produce semantically equivalent output.

**DD-DOCS-069 — AI enrichment does not create deterministic identity**  
Where AI enrichment is explicitly non-deterministic, repeatability claims shall distinguish deterministic baseline content from optional generated prose.

**DD-DOCS-070 — Concurrent change is not silently overwritten**  
If an existing documentation/source target materially changes after inspection/planning, Docs shall revalidate/replan or fail according to DD-2.5 rather than blindly apply stale content.

**DD-DOCS-071 — Already-satisfied output is explicit**  
Where requested documentation already satisfies the accepted postcondition, Docs may report unchanged/already-satisfied evidence rather than manufacture a write.

---

## 15. Security and Sensitive Information

**DD-DOCS-072 — Accessible does not mean documentable**  
Credentials, secrets, protected environment/configuration values and sensitive source content shall not be included merely because they are accessible within managed scope.

**DD-DOCS-073 — External disclosure is separately governed**  
Context supplied to AI or external documentation providers shall follow DD-2.7 and effective disclosure policy, including minimization and sensitivity constraints.

**DD-DOCS-074 — Generated/provider content is untrusted data**  
Existing docs, templates, renderer output, AI prose and provider diagnostics shall not redefine AppManager policy, scope, configuration or command authority.

**DD-DOCS-075 — Diagnostics minimize sensitive content**  
Docs diagnostics shall identify useful target/stage failure information without unnecessarily reproducing protected source, prompts, configuration or credentials.

**DD-DOCS-076 — Generated references remain data until validated**  
Paths, links, include directives, frontmatter or provider-specific references generated in documentation shall not independently authorize filesystem, process or application actions.

---

## 16. Extensibility and Replaceability

**DD-DOCS-077 — Documentation providers are replaceable behind DD-2.9**  
Docs-domain semantics shall not require VitePress, one Markdown parser/renderer, one static-site tool or one provider-native model.

**DD-DOCS-078 — Source recognition remains replaceable behind DD-2.4**  
Changing source-recognition providers shall not require changing Docs target/profile/acceptance semantics where equivalent facts are supplied.

**DD-DOCS-079 — AI providers remain replaceable and subordinate**  
Changing or removing an AI provider shall not transfer documentation authority or eliminate deterministic documentation paths that do not semantically require AI.

**DD-DOCS-080 — No generic domain framework from workflow similarity**  
Similarity between Docs, Nuxt, Git or other domain orchestration shall not create a generic domain workflow/request/result framework unless genuinely shared semantics not already owned by DD-1/DD-2 are separately approved.

**DD-DOCS-081 — Implementation topology remains open**  
No contract in DD-3.4 requires a particular TypeScript service, class, package, process, source path or provider wiring.

---

## 17. Testability and Conformance Requirements

Conformance testing shall cover at least:

- target resolution for complete application, source, all layers, selected layer, tests and selected file;
- ambiguous/out-of-scope/unsupported target handling;
- duplicate target normalization;
- managed scope versus discovery;
- authoritative facts versus authored/generated prose;
- complete versus partial coverage;
- empty optional categories;
- source facts consumed without duplicate parsing authority;
- Nuxt facts consumed without Docs redefining Nuxt semantics;
- test documentation without test execution authority;
- generation versus update distinction;
- output collision and substantial replacement policy;
- bounded existing-document/source transformation;
- stale update rejection/replanning;
- deterministic baseline with AI unavailable;
- contradictory AI proposal rejection/conflict handling;
- sensitive-context exclusion;
- all-layer/multi-target continuation and partial completion;
- documentation tooling target selection;
- development/preview long-running state;
- build/process success versus Docs acceptance;
- cancellation before and after consequential effects;
- provider substitution without changing domain semantics;
- deterministic Headless ambiguity handling.

**DD-DOCS-082 — Domain policy is testable with capability substitutes**  
Core Docs target/profile policy, orchestration and evidence interpretation shall be testable with deterministic substitutes for DD-2.9 and supporting capabilities rather than requiring concrete providers.

**DD-DOCS-083 — Concrete-provider tests do not define the contract**  
VitePress, Markdown, parser, AI, process or template integration tests may verify provider mechanics but shall not redefine DD-3.4 semantics.

**DD-DOCS-084 — Ownership-boundary tests are mandatory design evidence**  
Tests shall demonstrate that rendering, AI, transformation, process, Nuxt, source-recognition or persistence success does not independently establish Docs-domain success when Docs acceptance conditions are unsatisfied.

---

## 18. Traceability

| Detailed Design contract(s) | Functional requirement(s) | Principal related DD authority |
|---|---|---|
| `DD-DOCS-001`–`004` | `FR-DOCS-001`–`018` | DD-1.1–1.5; DD-2.9 |
| `DD-DOCS-005`–`015` | `FR-DOCS-019`–`030`, `FR-DOCS-106`–`113` | DD-1.2; DD-1.3; DD-2.9 |
| `DD-DOCS-017`–`019` | `FR-DOCS-031`–`040` | DD-1.3; DD-2.9 |
| `DD-DOCS-020`–`021` | `FR-DOCS-041`–`050` | DD-2.4; DD-2.5; DD-2.9 |
| `DD-DOCS-022`–`024` | `FR-DOCS-051`–`060` | DD-1.3; DD-2.10; DD-3.3 |
| `DD-DOCS-025`–`026` | `FR-DOCS-061`–`066` | DD-2.4; DD-2.8 |
| `DD-DOCS-027` | `FR-DOCS-067`–`072` | DD-1.3; DD-2.4; DD-2.9 |
| `DD-DOCS-012`–`013`, `DD-DOCS-028`–`031`, `DD-DOCS-067`–`071` | `FR-DOCS-073`–`083`, `FR-DOCS-114`–`119` | DD-2.1; DD-2.5; DD-2.9 |
| `DD-DOCS-032`–`034`, `DD-DOCS-072`–`075` | `FR-DOCS-084`–`090`, `FR-DOCS-110` | DD-2.7; DD-2.9 |
| `DD-DOCS-035`–`037`, `DD-DOCS-050`, `DD-DOCS-056` | `FR-DOCS-091`–`099`, `FR-DOCS-118` | DD-2.2; DD-2.9 |
| `DD-DOCS-038`–`039`, `DD-DOCS-045`–`048` | `FR-DOCS-100`–`105` | DD-1.3; DD-2.4; DD-2.9 |
| `DD-DOCS-057`–`066` | `FR-DOCS-006`–`018`, `FR-DOCS-106`–`113` | DD-1.1; DD-1.2; DD-2.9 |
| `DD-DOCS-077`–`081` | provider/capability subordination across `FR-DOCS-*` | DD-2.4; DD-2.7; DD-2.9; ADR-0001 |
| `DD-DOCS-082`–`084` | design-level conformance across `FR-DOCS-*` | Domain DD Authoring Guide; DD-1/DD-2 contracts |

This grouped traceability expresses semantic contract families and does not imply one implementation component per Functional requirement.

---

## 19. Conformance Invariants

### DD-DOCS-CI-001 — Application authority remains DD-1-owned

Docs shall not independently redefine managed scope, effective configuration, canonical outcomes, invocation semantics or final Application Engine acceptance.

### DD-DOCS-CI-002 — DD-2.9 remains the bounded Documentation Capability

Docs application intent, target/profile policy and orchestration shall remain distinct from DD-2.9 documentation modeling, rendering, aggregation, tooling and bounded validation semantics.

### DD-DOCS-CI-003 — Documentation recognition does not authorize mutation

Discovery of source, documentation, layers, tests, files, tooling or output destinations shall not independently grant write/process authority.

### DD-DOCS-CI-004 — Documentation truth remains provenance-sensitive

Reliable structural/domain facts, existing authored documentation and generated/AI prose shall remain distinguishable where their authority affects acceptance.

### DD-DOCS-CI-005 — Source mutation remains DD-2.5-owned

Existing documentation/source updates shall not bypass Source Transformation preservation, stale-state and validation contracts for implementation convenience.

### DD-DOCS-CI-006 — Domain facts remain with their owners

Nuxt, Quality, Git, App and other domain semantics consumed by Docs shall not transfer into Docs merely because they are documented.

### DD-DOCS-CI-007 — Technical success is subordinate evidence

Renderer, parser, AI, process, build, transformation or persistence success shall not independently constitute Docs-domain or AppManager application success.

### DD-DOCS-CI-008 — Completeness and freshness are truthful

Unsupported/failed required inputs shall not count as documented, and stale/failed refreshes shall not be represented as synchronized documentation.

### DD-DOCS-CI-009 — Partial effects remain truthful

Failure/cancellation shall preserve completed documentation writes, transformations, AI disclosures and tooling effects; DD-3.4 shall not imply universal rollback.

### DD-DOCS-CI-010 — Headless and interactive semantics remain equivalent

Presentation mechanisms may collect target choices but shall not redefine Docs target, profile, safety, authorization or acceptance semantics.

### DD-DOCS-CI-011 — Provider independence is preserved

VitePress, Markdown/parser/renderer types, AI providers, template engines and process implementations shall remain below stable AppManager-oriented contracts unless separately made normative.

### DD-DOCS-CI-012 — Detailed Design remains topology-independent

No responsibility in this document requires a particular TypeScript module, class, service, package, directory, process or provider topology.

---

This Version 1 baseline is intentionally implementation-topology independent. Later Implementation Specifications may reduce these contracts to concrete Node.js/TypeScript modules, provider bindings, libraries, commands, source locations and tests under ADR-0001, but shall preserve the authority, target/profile, provenance, safety, evidence and provider-independence boundaries defined here.
