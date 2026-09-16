# AppManager Detailed Design Conformance Audit v01

> **Status:** Version 1 project-management conformance audit
>
> **Audit scope:** Complete Version 1 Detailed Design baseline — DD-1 through DD-4
>
> **Audited baseline:** `master` at merge commit `e88803289a78065bc7b15380bf65aa07506bd691`
>
> **Normative effect:** None. This document records verification evidence, residual project-management corrections and downstream guardrails. It does not create, amend or replace Design, Functional, Detailed Design, ADR or Implementation Specification authority.

---

## 1. Purpose

This audit verifies the complete AppManager Version 1 Detailed Design baseline after completion of DD-4.4 and before Implementation Specification work begins.

The audit determines whether the four Detailed Design families collectively provide a coherent, traceable and implementation-independent technical contract system capable of being reduced to concrete Node.js/TypeScript implementation specifications without redistributing approved application authority.

The principal audit question is:

> **Can AppManager proceed from Detailed Design to Implementation Specification using the completed DD-1, DD-2, DD-3 and DD-4 contracts as a coherent permanent architecture, without first reopening functional ownership, duplicating shared semantics, or inferring implementation topology from current code?**

The answer is **yes, subject to one non-normative project-management register correction** recorded in this audit.

---

## 2. Governing Authorities

This audit is subordinate to the live documentation hierarchy:

1. `docs/project-documentation-guide-v01.md`;
2. `docs/appmanager-design-specification-v01.md`;
3. the Version 1 Functional Specifications under `docs/functional/`;
4. accepted ADRs, including ADR-0001 — Primary Application Runtime;
5. accepted Functional clarifications;
6. the DD-1 Application Core Detailed Designs and accepted clarifications;
7. the DD-2 Shared Capability Detailed Designs and accepted clarifications;
8. the DD-3 High-Coupling Domain Detailed Designs;
9. the DD-4 Policy and Resource Domain Detailed Designs.

The following project-management evidence was also considered:

- `functional-specification-conformance-audit-v01.md`;
- `application-core-detailed-design-conformance-audit-v01.md`;
- `shared-capability-detailed-design-conformance-audit-v01.md`;
- `dd2-independent-review-reconciliation-v01.md`;
- `dd2-final-horizontal-reconciliation-conformance-closeout-v01.md`;
- `detailed-design-decomposition-plan-v01.md`;
- `domain-detailed-design-authoring-guide-v01.md`;
- the Detailed Design structure-migration/reconciliation records.

Historical paths quoted by earlier project-management audits remain historical evidence only. Current normative authority resides at the canonical active paths.

The governing architecture remains:

> **Delegated execution does not mean delegated application authority.**

---

## 3. Audited Detailed Design Set

The current Version 1 primary Detailed Design baseline contains **23 primary Detailed Design Specifications** across four families.

### 3.1 DD-1 — Application Core

1. DD-1.1 — Application Invocation
2. DD-1.2 — Execution Outcomes
3. DD-1.3 — Managed Project
4. DD-1.4 — Configuration Resolution
5. DD-1.5 — Application Engine

Accepted DD-1 clarifications include:

- Application Core Bootstrap Resolution;
- Application Outcome and Diagnostic Ownership.

### 3.2 DD-2 — Shared Capabilities

6. DD-2.1 — Resource Access
7. DD-2.2 — Process Execution
8. DD-2.3 — Repository Capability
9. DD-2.4 — Source Intelligence
10. DD-2.5 — Source Transformation
11. DD-2.6 — Resource Registry and Template
12. DD-2.7 — AI Capability
13. DD-2.8 — Quality Capability
14. DD-2.9 — Documentation Capability
15. DD-2.10 — Nuxt Capability

Accepted DD-2 clarifications include:

- Repository / Source Intelligence Relationship;
- Nuxt Layer Scaffold Artefact Ownership.

### 3.3 DD-3 — High-Coupling Domains

16. DD-3.1 — App Domain
17. DD-3.2 — Git Domain
18. DD-3.3 — Nuxt Domain
19. DD-3.4 — Docs Domain

### 3.4 DD-4 — Policy and Resource Domains

20. DD-4.1 — Quality Domain
21. DD-4.2 — Settings Domain
22. DD-4.3 — AI Domain
23. DD-4.4 — Utils Domain

No planned Version 1 primary Detailed Design is absent from the active repository structure.

---

## 4. Audit Criteria

The complete Detailed Design set was evaluated against the following criteria.

### 4.1 Decomposition Completeness

Every approved permanent responsibility identified by the decomposition plan must have one canonical primary Detailed Design owner or an explicit subordinate relationship to one.

### 4.2 Singular Authority

The Detailed Design set must preserve singular ownership for:

- invocation semantics;
- canonical outcomes;
- managed-project context and managed scope;
- effective configuration resolution;
- final Application Engine authority;
- shared capability semantics;
- domain-specific application intent.

Similar names, record shapes or provider mechanisms must not create duplicate authority.

### 4.3 DD-1 / DD-2 / Domain Separation

Domain Detailed Designs must compose DD-1 and DD-2 contracts rather than recreate them.

Shared capabilities must remain specialist evidence/execution boundaries and must not acquire owning-domain or final application authority.

### 4.4 Evidence versus Interpretation

Technical completion, provider output, recognized facts and validation evidence must remain distinguishable from domain interpretation and final application acceptance.

### 4.5 Managed-Scope and Mutation Safety

Discovery, recognition, repository membership, source presence and resource visibility must not imply target eligibility, mutation authority or deletion authority.

Consequential effects must remain explicitly bounded and authorized.

### 4.6 Configuration and Policy Separation

DD-1.4 must remain authoritative for effective configuration construction and precedence. Domains may interpret effective values but must not independently recreate precedence.

### 4.7 Outcome Ownership

DD-1.2 must remain authoritative for canonical success, failure, warning, partial-success, cancellation, diagnostic and effect semantics.

Domains and capabilities may provide subordinate evidence and domain-specific result payloads without creating competing generic outcome models.

### 4.8 Interaction-Mode Equivalence

TUI, Headless and future adapters must preserve equivalent application semantics. Headless operation must fail safely where required information or authorization is absent rather than substituting prompts or guesses.

### 4.9 Provider Replaceability

Provider SDKs, parsers, compilers, Git libraries, AI providers, quality tools, Nuxt tools and filesystem/process implementations must remain below AppManager-oriented contracts unless separately approved as permanent architecture.

### 4.10 Implementation-Topology Independence

Detailed Design must define permanent responsibility, contracts, state and policy without prescribing the concrete TypeScript module tree, class/service topology, package layout, process topology or source paths that belong to Implementation Specifications.

### 4.11 Functional Traceability

Domain Detailed Designs must identify the Functional requirements they realise and retain sufficient cross-authority traceability for later Implementation Specifications and conformance testing.

### 4.12 Horizontal Coherence

The completed set must remain coherent across the principal seams identified during DD-1/DD-2 reconciliation and domain authoring.

---

## 5. Executive Result

### 5.1 Overall Decision

**PASS — SUITABLE TO PROCEED TO IMPLEMENTATION SPECIFICATION PLANNING, SUBJECT TO ONE PROJECT-MANAGEMENT REGISTER CORRECTION.**

No blocking, major or minor normative Detailed Design defect was identified in the completed Version 1 baseline.

The one residual issue is not architectural: the canonical project-management register in `detailed-design-decomposition-plan-v01.md` still reports DD-3.2 onward as planned even though those documents are now complete and merged. That stale planning state must be reconciled before the register is used as the source of Implementation Specification sequencing/status.

### 5.2 Finding Summary

| Classification | Count | Result |
|---|---:|---|
| Blocking normative defect | 0 | None identified |
| Major normative defect | 0 | None identified |
| Minor normative correction | 0 | None identified |
| Project-management corrective | 1 | PM-001 — stale canonical register status |
| Implementation-phase guardrails | 12 | Carry forward |

### 5.3 Phase-Gate Decision

The completed Detailed Design set is sufficiently coherent to close Version 1 Detailed Design authoring as a primary design activity.

Implementation Specification planning may begin after PM-001 is corrected. The correction does not require reopening any normative DD contract.

---

## 6. DD-1 Application Core Conformance

### 6.1 Result

**PASS**

The prior Application Core conformance audit identified one minor bootstrap sequencing ambiguity, MC-001. That finding is now closed by the accepted Application Core Bootstrap Resolution clarification and its local bindings.

The resulting staged dependency remains:

```text
context-independent/bootstrap configuration
    -> managed-project resolution
    -> project/scope-dependent configuration
    -> operation snapshot
    -> managed-scope/policy/use-case execution
```

### 6.2 Authority Boundary

The Application Core remains coherent:

- DD-1.1 owns the invocation boundary and transport-independent application intent representation;
- DD-1.2 owns canonical outcomes, diagnostics, warnings, effects and cancellation semantics;
- DD-1.3 owns managed-project identity, topology, managed entities, managed scope and targetability context;
- DD-1.4 owns configuration-candidate resolution, precedence, provenance and effective configuration;
- DD-1.5 owns application-level coordination, authority and final acceptance.

No domain or shared capability reviewed by this audit requires a competing Application Core contract.

### 6.3 Outcome/Invocation Clarification

The accepted ownership distinction remains coherent:

> DD-1.2 owns canonical AppManager outcome semantics; DD-1.1 owns how those semantics cross the invocation boundary.

No later domain Detailed Design was found to require a duplicate generic outcome envelope.

---

## 7. DD-2 Shared Capability Conformance

### 7.1 Result

**PASS**

The prior DD-2 family conformance audit and subsequent independent horizontal reconciliation established the shared-capability baseline. The complete domain set does not expose a need to reopen that decomposition.

### 7.2 Capability Boundaries Remain Stable

The completed domain designs preserve the key capability seams:

- Resource Access provides bounded resource mechanics, not application intent or managed scope;
- Process Execution provides technical execution evidence, not application success;
- Repository Capability provides repository facts and bounded primitives, not Git-domain workflow authority;
- Source Intelligence provides read-only normalized structural facts, not mutation intent;
- Source Transformation applies approved bounded plans, not application authorization;
- Resource Registry and Template owns declarative resource/template mechanics, not consuming-domain intent;
- AI Capability provides provider-independent AI execution/evidence, not owning-domain authority;
- Quality Capability provides quality technical evidence and bounded criterion evaluation, not complete Quality-domain policy;
- Documentation Capability provides documentation technical semantics, not Docs-domain application authority;
- Nuxt Capability provides Nuxt-specific technical semantics, not Nuxt-domain application authority.

### 7.3 Horizontal Reconciliation Remains Valid

The final domain designs preserve the previously reconciled DD-2 conclusions:

- repository diff/change evidence is not source-structural fact by implication;
- similarly shaped structural records do not justify a generic StructuralFact authority;
- rendering is not persistence;
- recognition is not transformation approval;
- provider completion is not application acceptance;
- source-valid is not automatically application-accepted;
- capability composition does not merge permanent semantic ownership.

No later domain design creates evidence requiring those decisions to be reversed.

---

## 8. DD-3 High-Coupling Domain Conformance

### 8.1 DD-3.1 — App Domain

**PASS**

App correctly owns root-application lifecycle and creation intent while composing DD-1/DD-2 and subordinate domain behavior.

It does not absorb:

- persisted environment-definition CRUD from Settings;
- Git repository policy;
- Nuxt layer semantics;
- source-transformation mechanics;
- canonical outcome authority.

The accepted App/Settings clarification preserves lifecycle intent versus persisted environment-definition ownership.

### 8.2 DD-3.2 — Git Domain

**PASS**

Git correctly owns repository-management intent, operation-specific repository policy and multi-repository orchestration while DD-2.3 retains repository facts/primitives.

The design preserves:

- repository evidence versus Git-domain decision;
- managed repository scope versus discovery;
- optional AI commit-message proposal versus commit-message acceptance;
- Git-domain acceptance versus DD-1 final application acceptance.

No Git provider, hosting provider or repository primitive acquires application authority.

### 8.3 DD-3.3 — Nuxt Domain

**PASS**

Nuxt correctly owns Nuxt application intent, target/applicability policy and composed Nuxt use-case acceptance while DD-2.10 owns bounded Nuxt technical semantics.

Nuxt orchestration does not absorb:

- repository/Git ownership;
- source-transformation ownership;
- documentation ownership;
- quality ownership;
- AI ownership;
- template/resource ownership.

The domain remains defined by Nuxt intent/postconditions rather than parser, template, command or provider topology.

### 8.4 DD-3.4 — Docs Domain

**PASS**

Docs correctly owns documentation intent, documentation target/profile policy, orchestration and Docs-domain acceptance while DD-2.9 retains bounded documentation technical semantics.

The design preserves provenance-sensitive documentation truth and does not treat documentation of another domain's facts as ownership transfer.

Documentation rendering, persistence, source transformation, AI enrichment, quality evidence and Nuxt facts remain composed according to their owning contracts.

---

## 9. DD-4 Policy and Resource Domain Conformance

### 9.1 DD-4.1 — Quality Domain

**PASS**

Quality correctly owns quality-assurance intent, operation-specific quality policy, quality-scope interpretation, gate composition and Quality-domain acceptance.

DD-2.8 remains authoritative for bounded quality capability recognition/execution/normalization and explicit criterion evaluation.

The design retains the distinctions:

```text
provider completed
    != quality check passed
    != quality gate passed
    != application operation accepted
```

Ordinary Quality behavior does not acquire source mutation authority merely because providers may support autofix.

### 9.2 DD-4.2 — Settings Domain

**PASS**

Settings correctly owns explicit settings and metadata-management intent, semantic setting/resource scope, operation-specific validation and Settings-domain acceptance.

The central boundaries remain intact:

- persistence is not precedence;
- Configuration Resolution remains DD-1.4-owned;
- resource management is not resource execution;
- project metadata does not transfer Git or other domain authority;
- manual application-version metadata remains distinct from Utils source-file version maintenance.

### 9.3 DD-4.3 — AI Domain

**PASS**

AI correctly owns AI-specific project-resource and instruction-document intent while DD-2.7 remains the shared provider-independent AI execution authority.

The design preserves:

- deterministic baseline generation versus optional AI enrichment;
- generated content as proposal until accepted;
- project content as untrusted data;
- external-provider submission as a disclosure event;
- generated action suggestions as inert;
- primary-intent ownership when other domains use AI.

No generic autonomous-agent, executable-plugin or provider-specific architecture has been introduced.

### 9.4 DD-4.4 — Utils Domain

**PASS**

Utils correctly remains a bounded home for genuine cross-cutting maintenance intent rather than a residual catch-all.

The design preserves stronger ownership for:

- Docs automatic documentation;
- Settings contributor/general metadata management;
- Git repository workflow;
- App clean/reset;
- Quality gates;
- AI provider mechanics.

Header inspection, header repair, source-file version maintenance and bounded temporary/test/log cleanup remain differentiated by semantic intent and do not form a generic utility/plugin framework merely because their records or workflows can look similar.

---

## 10. Horizontal Authority Findings

### 10.1 Application Authority

**PASS**

All four families preserve DD-1.5 final application authority. Domain-specific acceptance exists below final application acceptance and delegated providers/capabilities remain subordinate.

### 10.2 Managed Scope

**PASS**

Managed scope remains DD-1.3-owned. Repository membership, source recognition, template discovery, documentation recognition, Nuxt recognition, quality availability and cleanup discovery do not independently grant mutation authority.

### 10.3 Configuration Resolution

**PASS**

Domains consume effective configuration and may interpret it for domain policy. No completed domain introduces a competing candidate-precedence system.

### 10.4 Outcomes and Diagnostics

**PASS**

Canonical outcomes remain DD-1.2-owned. Domain-specific result models remain subordinate payload/evidence rather than competing generic application-result contracts.

### 10.5 Source Recognition and Transformation

**PASS**

The staged distinction remains stable:

```text
resource/source evidence
    -> source recognition / structural facts
    -> domain intent
    -> bounded transformation plan
    -> authorization / freshness
    -> mutation
    -> source-level validation
    -> domain interpretation
    -> application acceptance
```

### 10.6 Repository versus Source Intelligence

**PASS**

Repository facts and source-structural facts remain sibling evidence domains. Repository revision identity and source snapshot identity are not assumed identical, and neither recognition path grants mutation authority.

### 10.7 AI versus Owning Domains

**PASS**

AI assistance remains subordinate to the domain whose primary application intent is being realised. DD-4.3 does not become the owner of Git commit messaging, Docs generation, Nuxt generation, Quality explanation or Utils classification merely because AI Capability is used.

### 10.8 Quality Capability versus Quality Domain

**PASS**

DD-2.8 technical evidence/criterion evaluation and DD-4.1 quality policy/gate composition remain distinct.

### 10.9 Documentation Capability versus Docs Domain

**PASS**

DD-2.9 documentation technical semantics and DD-3.4 Docs application intent remain distinct.

### 10.10 Nuxt Capability versus Nuxt Domain

**PASS**

DD-2.10 Nuxt technical semantics and DD-3.3 Nuxt application intent remain distinct.

### 10.11 Settings versus Configuration Resolution

**PASS**

Persisted setting/resource management and effective configuration construction remain distinct authorities.

### 10.12 Utils Residual-Ownership Risk

**PASS**

The final domain design explicitly proves stronger-owner precedence and does not restore behavior removed from Utils during Functional reconciliation.

---

## 11. Safety, Failure and Interaction Conformance

### 11.1 Discovery Is Not Authority

**PASS**

The complete DD set consistently distinguishes observation from authorization. This applies to source files, repositories, layers, documentation resources, AI documents, settings resources and cleanup artefacts.

### 11.2 No False Atomicity

**PASS**

Multi-resource, multi-repository and provider-mediated workflows preserve completed effects, partial completion and indeterminate state rather than implying rollback not guaranteed by the underlying mechanisms.

### 11.3 Cancellation

**PASS**

Cancellation consistently stops future work as safely practical while preserving completed-effect evidence. Provider cancellation capability is not confused with application-level cancellation interpretation.

### 11.4 Stale-State / Concurrent Modification

**PASS**

Consequential source/resource operations preserve freshness/precondition concepts and require deliberate handling of detectable stale state rather than silent overwrite.

### 11.5 Headless Equivalence

**PASS**

Domain designs consistently treat Headless as the same application semantics without prompting. Missing ambiguity resolution, target information or consequential authorization results in deterministic failure/no-op/diagnostic handling according to the use case rather than guessed interaction behavior.

### 11.6 Sensitive Information

**PASS**

The designs preserve bounded disclosure, diagnostic minimization and sensitive-value separation. AI use in particular retains explicit disclosure boundaries and treats project-provided content as untrusted data.

---

## 12. Abstraction-Level and ADR-0001 Conformance

### 12.1 Detailed Design versus Implementation Specification

**PASS**

The active Detailed Design baseline defines permanent responsibilities, normalized records, lifecycle/state distinctions, dependency direction, provider boundaries, orchestration semantics and conformance requirements without requiring a one-to-one mapping to concrete code.

### 12.2 Node.js / TypeScript

**PASS**

ADR-0001 establishes Node.js + TypeScript as the primary Version 1 implementation technology. The Detailed Designs are compatible with that choice without treating the architecture as a mandated collection of TypeScript classes/services/modules.

Concrete implementation reduction — module paths, package structure, interfaces, libraries, dependency injection, source files and bindings — remains an Implementation Specification responsibility.

### 12.3 Provider Representations

**PASS**

Provider-native parser/compiler/Git/AI/quality/Nuxt representations remain below AppManager-oriented semantic boundaries.

---

## 13. Traceability and Implementation Readiness

### 13.1 Functional-to-Detailed-Design Traceability

**PASS**

The domain Detailed Designs explicitly bind their Functional requirement surfaces and identify consumed DD-1/DD-2 authorities.

The DD-1/DD-2 families provide the shared contract base required for Implementation Specifications to trace concrete components back to permanent semantic ownership.

### 13.2 Implementation-Specification Entry Condition

The architectural entry condition is satisfied:

- application authority is singular;
- capability authority is bounded;
- domain ownership is explicit;
- cross-domain seams are documented;
- outcome/scope/configuration semantics are shared rather than duplicated;
- provider replaceability is preserved;
- implementation topology has intentionally not yet been frozen.

The remaining PM-001 register correction is administrative sequencing/state reconciliation rather than an architectural prerequisite.

---

## 14. Corrective Finding

### PM-001 — Canonical Detailed Design Register Status Is Stale

**Classification:** Project-management corrective — non-normative

**Affected document:** `docs/project_management/detailed-design-decomposition-plan-v01.md`

**Finding:** The canonical register accurately identifies all 23 Version 1 primary Detailed Design IDs and canonical paths, but its drafting-status fields remain stale from the earlier authoring sequence. DD-3.2, DD-3.3, DD-3.4 and DD-4.1 through DD-4.4 are still shown as planned despite their canonical specifications being complete and merged.

**Risk:** The stale status does not alter Detailed Design authority, but it can mislead subsequent Implementation Specification planning, handover material or automated navigation that treats the canonical register as current project state.

**Required correction:** Update the project-management register to show DD-3.2 through DD-4.4 as `Complete` and use canonical links consistently with the completed entries. Do not change Detailed Design IDs, subjects, paths or normative contents as part of that correction.

**Disposition:** Required before the decomposition register is used as the authoritative project-management baseline for Implementation Specification sequencing.

---

## 15. Implementation-Phase Guardrails

These findings are not Detailed Design defects. They are mandatory constraints for Implementation Specification work.

### ISG-001 — Do Not Turn Responsibility Boundaries into One-Class-Per-DD Architecture

A DD responsibility does not imply one class, service, package or source module. Implementation Specifications shall choose code topology according to cohesion, dependency direction and testability while preserving semantic ownership.

### ISG-002 — Preserve the Application Engine Authority Boundary

Concrete dispatchers, coordinators, handlers and providers shall not acquire final application authority merely because implementation wiring delegates execution to them.

### ISG-003 — Preserve Managed Scope as an Explicit Input

Concrete scanners, filesystem services, repository libraries and source tools shall not derive mutation authority from discovered paths or current working directory.

### ISG-004 — Preserve Effective Configuration Provenance

Concrete settings stores and configuration readers shall not bypass DD-1.4 by exposing raw persisted/environment values as if they were already effective configuration.

### ISG-005 — Preserve Canonical Outcome Ownership

Implementation-specific exceptions, exit codes, provider responses and Boolean returns shall be normalized into subordinate evidence before canonical DD-1.2 outcome construction.

### ISG-006 — Preserve Evidence versus Interpretation

Repository status, source facts, quality findings, AI output, documentation evidence and Nuxt evidence shall remain technical evidence until the owning use case interprets them.

### ISG-007 — Keep Source Intelligence Read-Only

Concrete parser/scanner/compiler adapters shall not silently perform fixes or write source as part of recognition.

### ISG-008 — Route Existing-Source Mutation through Source Transformation Semantics

Domain implementations shall not bypass DD-2.5 with ad hoc direct edits merely because a file change appears small.

### ISG-009 — Keep AI Non-Authoritative

AI provider adapters and generated tool/action suggestions shall not directly mutate project state or decide application success without owning-use-case validation and authorization.

### ISG-010 — Preserve Capability/Domain Pairs

Quality Capability/Quality Domain, Documentation Capability/Docs Domain, Nuxt Capability/Nuxt Domain and AI Capability/AI-owning-use-case boundaries shall remain explicit in implementation architecture.

### ISG-011 — Do Not Recreate Utils as a Generic Helper Namespace

Generic implementation helpers may exist where technically appropriate, but the semantic `Utils` domain shall not become the dumping ground for behavior with a stronger domain owner.

### ISG-012 — Preserve Provider Replaceability Unless an Accepted Decision Changes It

Implementation Specifications may select concrete Version 1 libraries/providers, but their use shall remain behind the established AppManager-oriented contracts unless a later accepted ADR deliberately changes the architectural boundary.

---

## 16. Detailed Design Phase Closeout

### 16.1 Completed Baseline

The complete Version 1 Detailed Design phase has produced:

- 5 DD-1 Application Core specifications;
- 10 DD-2 Shared Capability specifications;
- 4 DD-3 High-Coupling Domain specifications;
- 4 DD-4 Policy and Resource Domain specifications;
- accepted clarifications where cross-contract ambiguity required explicit closure;
- family-level DD-1 and DD-2 conformance/reconciliation evidence;
- this final horizontal conformance audit.

### 16.2 Final Decision

**The Version 1 Detailed Design architecture is accepted by this audit as coherent and ready for Implementation Specification planning.**

PM-001 shall be corrected as a project-management state reconciliation before the canonical register is used to drive the next decomposition sequence.

No finding in this audit requires reopening the current Functional Specifications, DD-1, DD-2, DD-3 or DD-4 normative designs.

### 16.3 Next Scheduled Activity

After PM-001 is closed, the next project phase should define the **Implementation Specification decomposition and authoring plan** under the Project Documentation Guide, using the completed Detailed Design baseline as the permanent architectural source and ADR-0001 as the Version 1 implementation-technology decision.

Implementation planning shall determine concrete Node.js/TypeScript reduction to practice without treating current source topology as normative where it conflicts with the approved Detailed Design contracts.
