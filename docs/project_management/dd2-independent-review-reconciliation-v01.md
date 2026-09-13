# AppManager DD-2 Independent Review Reconciliation

> **Status:** Active project-management reconciliation record
>
> **Initial reconciliation baseline:** `master` at `32549f694839af0c55f900707607763beb7e1df5`, the merge commit for PR #85
>
> **Control record established:** PR #86, merge commit `e0f78771ef4c6efb80c5c76967c89b8b5b5181c3`
>
> **Normative effect:** None. This record suspends reliance on the earlier project-management PASS while independent review findings are checked against the live normative documents. Normative Design, Functional and Detailed Design authority remains in their owning documents.

---

## 1. Purpose

PR #85 recorded a DD-2 Shared Capability conformance PASS. After that audit was merged, an independent horizontal review of the complete live documentation corpus reported cross-document inconsistencies that the original vertically-oriented audit did not identify.

This reconciliation therefore reopens the **project-management conclusion**, not the architecture by assumption.

The project shall distinguish three outcomes for every challenged finding:

1. **confirmed defect** — live normative documents materially conflict, duplicate semantic ownership, or leave a load-bearing contract ambiguous;
2. **clarification required** — the intended architecture is coherent but its ownership/delegation relationship is not stated precisely enough for independent implementation;
3. **not sustained** — the documents describe compatible specialisations/projections, or the reported issue is stale/incorrect.

Until the material findings are resolved and the audit result is reissued, DD-3 domain Detailed Design is paused.

---

## 2. Architectural Quality Objective

This reconciliation is not limited to textual contradiction checking.

A core project objective is that AppManager should exhibit:

- high modularity;
- low semantic coupling;
- explicit interfaces/contracts;
- single semantic ownership where responsibility is shared;
- delegation without authority leakage;
- independently testable capability boundaries;
- provider and implementation replaceability;
- maintainability without requiring readers or implementers to reconstruct authority from duplicated prose.

The review concern that the current documentation does not always make these properties *obvious* is therefore treated as architectural evidence, not merely an editorial complaint.

A design that is technically separable but requires repeated prose negotiation to determine who owns a contract is not yet expressing modularity as clearly as intended.

---

## 3. Reconciliation Worklist

### R-01 — Shared outcome contract

**External finding:** Application Invocation and Execution Outcomes appeared to define overlapping invocation/final outcome envelopes with non-identical field families.

**Classification:** confirmed semantic-ownership ambiguity.

**Decision:** DD-1.2 Execution Outcomes is the single canonical semantic owner of the shared AppManager outcome model. DD-1.1 Application Invocation owns caller-facing invocation mechanics and projection/delivery of the accepted DD-1.2 outcome; it does not own a second semantic result envelope.

**Resolution evidence:**

- PR #87 added `application-outcome-and-diagnostic-ownership-clarification-v01.md`;
- PR #88 propagated the correction into DD-1.1 and DD-1.2;
- DD-1.1 now defines an **Invocation Outcome Projection Contract** rather than a competing final semantic envelope;
- DD-1.2 now explicitly owns the canonical outcome field-family model;
- final horizontal verification after PR #88 found no remaining material DD-2 capability conflict with this ownership direction.

```text
capability/provider evidence
        -> owning-use-case interpretation
        -> canonical DD-1.2 AppManager outcome
        -> DD-1.1 invocation projection/delivery
        -> caller
```

**Current status:** **resolved**.

### R-02 — Diagnostic taxonomy

**External finding:** DD-1.1 and DD-1.2 used divergent shared diagnostic categories, while multiple DD-2 capabilities also enumerate local diagnostic/failure categories.

**Classification:** confirmed semantic-ownership ambiguity between DD-1.1 and DD-1.2; DD-2 local failure vocabularies are not independently defective where they are explicitly technical/capability evidence.

**Decision:**

- DD-1.2 owns the canonical broad cross-application diagnostic taxonomy;
- DD-1.1 projects canonical diagnostics and may add narrower invocation codes/subcategories only by mapping them to DD-1.2;
- capability/provider failure classes remain technical evidence until mapped into application-facing DD-1.2 diagnostics;
- domain/capability refinements shall not describe themselves as alternative shared taxonomies.

**Resolution evidence:**

- PR #87 established the canonical ownership rule;
- PR #88 propagated it into DD-1.1 and DD-1.2;
- the DD-2 family was horizontally rechecked after merge and material capability documents already describe local provider/failure vocabularies as capability evidence and/or feed them into DD-1.2/Application Engine interpretation;
- no broad repetitive DD-2 rewrite was required because the canonical mapping rule now exists once in DD-1.2.

**Current status:** **resolved**.

### R-03 — Nuxt scaffold licence and README ownership

**External finding:** Nuxt layer creation includes licence and README/introduction artefacts while Registry/Templates, Documentation and Settings/application boundaries retain separate ownership constraints.

**Classification:** clarification required rather than removal of those artefact classes from the Nuxt layer profile.

**Decision:** distinguish five separate ownership dimensions:

1. Nuxt layer-creation **orchestration/profile ownership**;
2. artefact **semantic/content ownership**;
3. declarative resource/template **resolution/rendering ownership**;
4. project-resource **persistence/mutation ownership**;
5. final Nuxt layer-creation **application acceptance**.

The intended dependency direction is:

```text
Nuxt layer-creation use case / selected profile
        |
        +--> Nuxt-owned semantics where genuinely Nuxt-specific
        +--> Documentation Capability where documentation semantics are required
        +--> Settings/application licence semantics where licence management is required
        +--> DD-2.6 Registry/Templates for declarative resource resolution/rendering
        +--> DD-2.1 Resource Access for authorized new-resource creation
        +--> DD-2.5 Source Transformation for authorized existing-resource modification
        |
        v
Nuxt-specific scaffold validation
        |
        v
Application Engine / Nuxt-use-case acceptance
```

**Resolution evidence:**

- PR #89 added `docs/detailed_design/nuxt-layer-scaffold-artefact-ownership-clarification-v01.md`;
- the primary Nuxt Functional Specification now states that inclusion of an artefact class in a layer profile creates Nuxt baseline/orchestration intent rather than transferring semantic ownership;
- DD-2.10 now distinguishes scaffold orchestration from cross-owned artefact semantics, rendering and persistence/mutation;
- DD-2.10 explicitly binds README/documentation semantics to DD-2.9 where required, licence/settings semantics outside Nuxt, DD-2.6 to reusable resource/template resolution and rendering, DD-2.1 to authorized creation, and DD-2.5 to existing-resource modification;
- horizontal verification against DD-2.6, DD-2.9, DD-2.1 and Settings found compatible existing ownership statements and no remaining normative contradiction.

**Current status:** **resolved**.

### R-04 — Bootstrap configuration / managed-project sequence

**External finding:** the dedicated bootstrap clarification was not fully propagated into the documents and diagrams whose sequencing it refines.

**Classification:** confirmed propagation defect, now resolved.

The canonical staged dependency is:

```text
invocation / host context
        -> context-independent configuration candidates
        -> bootstrap effective configuration
        -> target-project / managed-project resolution
        -> managed-project context
        -> project/scope-dependent configuration resolution
        -> operation effective-configuration snapshot
        -> managed scope / policy / use-case execution
```

**Resolution evidence:**

- PR #91 corrected DD-1.5 Application Engine so its architectural flow, execution-context rules, orchestration lifecycle, dependency direction and conformance invariants express the staged dependency rather than the stale universal `managed scope -> effective configuration` ordering;
- `application-core-bootstrap-resolution-clarification-v01.md` is the canonical cross-contract sequencing authority and now states that managed scope does not universally precede project/scope-aware configuration;
- DD-1.3 Managed Project now backlinks the clarification and DD-1.4/DD-1.5 directly, distinguishes bootstrap configuration from later project/scope-aware configuration, and shows the staged relationship in its architectural diagram;
- DD-1.3 now makes explicit that project-resolution configuration evidence is limited to the bootstrap subset until sufficient Managed Project Context exists, while operation-effective configuration may feed managed-scope/exclusion decisions without acquiring scope authority;
- DD-1.4 Configuration Resolution now backlinks the clarification and DD-1.5, explicitly models bootstrap and project/scope-aware stages under the same configuration authority, and states that staging changes available context rather than creating a second resolver or configuration subsystem;
- DD-1.4 remains the sole owner of candidate applicability, validation, precedence, fallback, provenance and effective-value construction in both stages;
- DD-1.3 remains the owner of project identity, managed context, managed scope and targetability;
- DD-1.5 remains the owner of staged application coordination and bounded re-resolution decisions.

**Horizontal verification:** the bootstrap clarification, DD-1.3, DD-1.4 and DD-1.5 now agree on the same dependency direction and authority split. Irrelevant stages may be omitted, but no document requires project-dependent configuration before sufficient project context, no document requires managed scope to universally precede all project-aware configuration, and no document permits unrestricted recursive project/configuration/scope resolution.

No new subsystem or implementation topology was introduced. The correction makes the DD-1.3/DD-1.4 interface explicit while preserving independent responsibility and replaceability.

**Current status:** **resolved**.

### R-05 — Structural fact model

**External finding:** Source Intelligence, Documentation Capability and Nuxt Capability describe similar structural/domain fact records independently.

**Classification:** **not sustained as duplicate semantic ownership; clarification not required for correctness.**

**Horizontal comparison:**

| Model | Semantic subject | Producer authority | Evidence / interpretation class | Provenance / lifecycle | Primary consumers | Relationship to the other models |
| --- | --- | --- | --- | --- | --- | --- |
| DD-2.4 Source Intelligence structural facts | observed structure of a bounded source snapshot: source kind/language, regions, declarations, metadata/header structure, documentation presence and configuration structure | Source Intelligence | read-only source observation/evidence; never application intent, targetability, mutation authority or domain acceptance | explicitly snapshot-bound; source revision/digest/version evidence and provider provenance are part of the contract | Source Transformation, Documentation, Nuxt, Quality and other source-aware consumers | canonical AppManager-oriented source-structure evidence; downstream capabilities consume or interpret these facts rather than recreate provider-native parser models |
| DD-2.9 Documentation facts/model | information selected for documentation, including source facts, Nuxt/domain facts, test facts, existing authored documentation, generated summaries/prose and documentation-specific subjects/values | Documentation Capability for documentation-model composition only; semantic authority remains with each input owner | documentation-oriented projection/composition and rendered-information model; explicitly distinguishes authoritative facts from generated prose and contextual evidence | retains input provenance, confidence/support, target association and revision/snapshot evidence where material; aggregation must preserve provenance and omission/partial evidence | Docs-domain and other approved documentation workflows/renderers | consumes Source Intelligence facts and Nuxt/domain-authoritative facts; does not redefine either source structure or Nuxt semantics |
| DD-2.10 Nuxt facts / configuration semantic representation | Nuxt-specific identity, layer/root relationships, Nuxt composition, configuration meaning, manageability and Nuxt-specific validity | Nuxt Capability | domain interpretation derived from bounded Managed Project, Source Intelligence, Resource Access and provider evidence; still evidence until owning use-case acceptance | retains source/revision provenance and observed-vs-inferred/generated distinction where material; lifecycle follows the contributing project/configuration state rather than a generic source-fact lifecycle | Nuxt use cases, Documentation and other approved Nuxt-aware consumers | consumes source-structural evidence where useful and enriches/interprets it into Nuxt semantics; it is not a subtype of the generic source structural-fact record |

**Decision:** the records are deliberately **similarly shaped but semantically distinct**, with two explicit composition/projection seams:

```text
bounded source snapshot
        -> DD-2.4 Source Intelligence structural facts
        -> DD-2.10 Nuxt interpretation where Nuxt meaning is required
        -> owning use-case interpretation / acceptance
```

and:

```text
DD-2.4 source facts -----+
DD-2.10 Nuxt facts ------+--> DD-2.9 documentation input/model composition
other authoritative facts+        |
existing authored docs --+        v
AI/generated prose -------+   proposed documentation
```

The field-shape overlap (`kind`, identity/subject, provenance, confidence/support, revision/snapshot evidence, diagnostics) reflects recurring evidence metadata, not one shared semantic payload. Their meanings are contextual and not sufficiently identical to justify a new universal `StructuralFact` base contract, inheritance hierarchy or cross-capability framework.

**Evidence:**

- `source-intelligence-detailed-design-v01.md` §10 defines structural facts specifically as AppManager-oriented **observations derived from source**, keeps provider-native AST/CST/compiler/scanner objects below DD-2.4, and binds facts to source revision evidence;
- `documentation-capability-detailed-design-v01.md` §§5–9 explicitly permits a normalized Source Intelligence fact set and a Nuxt/domain-authoritative fact set as separate inputs, requires their provenance to remain distinguishable, and states that source-derived documentation consumes DD-2.4 rather than recreating parsing/recognition while Nuxt facts remain Nuxt-owned;
- `nuxt-capability-detailed-design-v01.md` §§6–8 states that Nuxt recognition consumes Managed Project, Source Intelligence and Resource Access evidence and then exposes Nuxt-specific identity/configuration/composition meaning, including manageability and equivalent/conflicting-entry semantics not owned by Source Intelligence;
- `source-transformation-functional-specification-v01.md` `FR-XFORM-006` requires AppManager-oriented source structural facts, while `nuxt-functional-specification-v01.md` `FR-NUXT-013`–`031` separately requires Nuxt-specific facts and semantic configuration views;
- `docs-functional-specification-v01.md` `FR-DOCS-043`, `FR-DOCS-055` and `FR-DOCS-058` distinguish source structural facts from Nuxt-owned layer/integration facts and permit Docs to consume both without acquiring their semantic authority.

**Modularity/coupling assessment:**

- **single owner:** satisfied — source structure is DD-2.4-owned, documentation composition is DD-2.9-owned, Nuxt semantics are DD-2.10-owned;
- **explicit consumer:** satisfied — DD-2.9 explicitly consumes DD-2.4 and DD-2.10 facts; DD-2.10 explicitly consumes DD-2.4 evidence;
- **authority boundary:** satisfied — all three retain evidence-versus-application-acceptance separation and none gains mutation authority merely by recognizing facts;
- **interface visibility:** sufficient — each model identifies its subject, provenance/evidence expectations and downstream relationship without requiring a concrete TypeScript topology;
- **replaceability:** preserved — parser/provider objects remain below DD-2.4, Nuxt-provider objects remain below DD-2.10, and documentation renderers remain below DD-2.9;
- **coupling:** no unsafe shared internal-model coupling was found; introducing a common base contract would add coupling without resolving a demonstrated semantic contradiction;
- **cycle safety:** dependency direction is acyclic for this concern: Source Intelligence may feed Nuxt and Documentation; Nuxt may feed Documentation; Documentation does not become a prerequisite for Source Intelligence or Nuxt recognition.

**Normative-change decision:** no normative edit is justified. The live Detailed Designs already state the ownership and consumption relationships needed to disambiguate the models. Creating a generic structural-fact framework would be speculative architecture driven by naming/shape similarity rather than shared semantics.

**Current status:** **resolved — not sustained**.

### R-06 — Repository / Source Intelligence relationship

**External finding:** Repository Capability states constraints on Source Intelligence without reciprocal acknowledgement.

**Required decision:** ensure dependency direction is explicit and one-sided assertions cannot silently become undocumented obligations.

**Current status:** open.

### R-07 — App / Settings environment-file ownership

**External finding:** overlap between `FR-APP-016`–`018` and `FR-SET-058`–`061` for creation of local environment configuration from an example resource.

**Classification:** clarification required rather than proven duplicate use-case ownership.

**Current evidence:** App owns the higher-level existing-application initialisation intent; Settings owns persisted environment-definition CRUD. The missing contract is the delegation seam by which App initialisation requests the Settings-owned environment operation rather than implementing an independent environment-definition authority.

**Current status:** open pending normative clarification.

### R-08 — stale forward references and project-management records

**External findings:** possible stale "future/forthcoming" references plus known project-management references to removed archive material and previously fixed defects.

**Classification:** mixed.

- the reported stale future/forthcoming references in the cited Managed Project/Configuration sections were not sustained against the current live text;
- stale project-management references to removed `docs/archive/` material and already-fixed defects are confirmed and require cleanup.

**Current status:** partially classified; project-management cleanup remains open.

---

## 4. Boilerplate and Repetition Review

The independent review also identifies substantial repetition of cross-cutting invariants. This is material to maintainability because duplication increases the number of places in which a supposedly single architectural rule can drift.

The objective is **not** maximal deduplication. Some local restatement is valuable because critical safety and authority boundaries should be visible at the point of use.

### 4.1 Three-layer rule for repeated architectural text

Repeated material shall be classified into three layers.

#### Layer A — canonical invariant

A rule with architecture-wide meaning shall have exactly one canonical normative owner, normally the root Design Specification or the owning shared Detailed Design.

Examples:

- delegated execution does not transfer application authority;
- recognition/discovery does not grant mutation authority;
- process/provider completion is not AppManager application success;
- cancellation does not imply rollback;
- managed scope and effective configuration remain governed inputs.

#### Layer B — local binding statement

A consuming specification may restate the invariant in **one concise sentence** where omission would make its boundary easy to misunderstand.

The local statement shall either cite or name the canonical owner and shall not independently redefine the rule.

Example pattern:

> In accordance with DD-1.2, cancellation preserves known effects and does not imply rollback; this capability adds only the following capability-specific cancellation semantics: ...

#### Layer C — domain/capability delta

Only the local refinement, exception, additional state, or specialised evidence belongs in the consuming document in detail.

Long re-explanations of the canonical rule should be removed unless they materially alter its application.

### 4.2 Material that should usually be consolidated

Candidates for consolidation include:

- repeated explanations of Application Engine authority;
- repeated "not one class/package/process" disclaimers;
- repeated generic Headless-equivalence prose;
- repeated cancellation/no-rollback explanations;
- repeated provider-result-versus-application-outcome explanations;
- repeated generic implementation-topology disclaimers;
- repeated relationship sections that state no capability-specific information.

### 4.3 Material that should remain local

Do **not** remove local statements where they prevent a plausible authority leak or destructive interpretation, including:

- Resource Access accessibility versus managed scope;
- Source Intelligence recognition versus mutation;
- Source Transformation approval versus execution;
- AI generated action/request inertness;
- Quality autofix versus Source Transformation;
- Nuxt composition versus repository relationship;
- Registry rendering versus persistence.

These should become concise binding statements plus the local delta, not disappear behind links alone.

### 4.4 First applied example — R-01/R-02

The R-01/R-02 propagation is the first deliberate application of the three-layer rule:

- DD-1.2 retains the canonical detailed outcome, diagnostic, effect and cancellation semantics;
- DD-1.1 retains concise local binding statements and only the invocation-specific request/control/projection delta;
- repeated DD-1.1 outcome tables, diagnostic taxonomy and generic partial/effect explanations are replaced by canonical-reference plus projection obligations;
- DD-2 capability failure vocabularies remain local evidence because they describe specialist execution facts rather than competing application semantics.

This is the preferred pattern for later boilerplate consolidation.

### 4.5 R-03 modularity example

R-03 applies the same rule across composed artefacts:

- Documentation Capability retains documentation semantics rather than having those semantics copied into Nuxt;
- Settings/application licence contracts and DD-2.6 retain licence semantics rather than having licence management copied into Nuxt;
- DD-2.6 retains declarative resource/template rendering semantics;
- DD-2.1/DD-2.5 retain persistence/mutation mechanics;
- DD-2.10 retains the Nuxt-specific profile/orchestration delta and concise bindings to those owners.

This separates reasons to change: documentation changes do not require redesigning Nuxt semantics, licence-resource policy changes do not require changing the Nuxt provider contract, and filesystem/transformation mechanics remain independently replaceable.

### 4.6 R-04 modularity example

R-04 preserves separate reasons to change while removing a false ordering dependency:

- DD-1.3 continues to own project identity, managed context, managed scope and targetability;
- DD-1.4 continues to own configuration candidate applicability, precedence and effective-value construction;
- DD-1.5 owns coordination of the staged dependency sequence;
- the bootstrap clarification owns the cross-contract sequencing rule required to avoid circular authority.

This is deliberately not solved by merging Managed Project and Configuration Resolution into one subsystem. The correction makes their interface explicit while keeping both replaceable behind their AppManager-oriented contracts.

The R-04 closeout also applies the boilerplate rule directly: the full cycle-breaking semantics remain in the existing bootstrap clarification, while DD-1.3 receives only the binding and Managed-Project-specific delta. No second DD-1.4 addendum was created merely to duplicate the same contract.

### 4.7 Target outcome

The target is a corpus in which:

- each architectural concept has one semantic owner;
- consuming documents are locally understandable;
- duplicated prose cannot evolve into competing contracts;
- genuinely capability-specific behavior is easier to locate;
- Detailed Design documents expose their interfaces, state distinctions, dependencies and delegation seams more clearly than their shared boilerplate.

No percentage reduction is mandated in advance. Information density and semantic ownership are the acceptance criteria.

---

## 5. Modularity and Coupling Review Criteria

Each challenged Detailed Design and every future DD-3 document shall be checked against the following questions:

1. **Single owner:** Is each shared semantic contract owned once?
2. **Explicit consumer:** Does a consumer reference/refine that contract rather than recreate it?
3. **Authority boundary:** Can the delegated component technically perform more than it is semantically authorised to decide, and is that difference explicit?
4. **Interface visibility:** Can an implementer identify inputs, outputs, states, failure evidence and dependency direction without inferring them from prose scattered across documents?
5. **Replaceability:** Can the provider/implementation be replaced without changing caller semantics?
6. **Cohesion:** Are responsibilities grouped by one durable reason to change rather than historical/service naming?
7. **Coupling:** Does one capability need knowledge of another capability's provider-native/internal model, or only its AppManager-oriented contract?
8. **Dependency-cycle safety:** Do cross-capability relationships form a coherent directed dependency rather than recursive authority?
9. **Mutation control:** Does recognition, generation, planning or provider execution remain distinct from authorization to mutate?
10. **Outcome control:** Does application-level acceptance remain outside specialist provider completion?

These checks are architectural, not implementation-topology mandates. A document may satisfy them with stable semantic contracts without defining one class/interface per responsibility.

---

## 6. Gate

The reconciliation gate remains:

> **DD-2 RECONCILIATION ACTIVE — DD-3 PAUSED**

R-01 through R-05 are resolved. R-06 through R-08 remain open or partially open. DD-3 shall not resume until the remaining material findings are classified/resolved and the final horizontal reconciliation audit records the resulting state.
