# AppManager DD-2 Independent Review Reconciliation

> **Status:** Active project-management reconciliation record
>
> **Baseline:** `master` at `32549f694839af0c55f900707607763beb7e1df5`, the merge commit for PR #85
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

**External finding:** Application Invocation and Execution Outcomes appear to define overlapping invocation/final outcome envelopes with non-identical field families.

**Required decision:** establish one canonical semantic owner and define any invocation-facing representation explicitly as a projection/envelope of that canonical model rather than a second independently evolving outcome contract.

**Presumptive owner:** DD-1.2 Execution Outcomes for shared application outcome semantics; DD-1.1 Invocation for transport-facing delivery/projection only.

### R-02 — Diagnostic taxonomy

**External finding:** DD-1.1 and DD-1.2 use divergent shared diagnostic categories, while multiple DD-2 capabilities also enumerate local diagnostic/failure categories.

**Required decision:** distinguish:

- canonical cross-application diagnostic categories;
- capability-specific technical failure categories/evidence;
- domain-specific semantic findings.

Capability vocabularies may specialise the canonical model, but shall not become competing application taxonomies.

### R-03 — Nuxt scaffold licence and README ownership

**External finding:** Nuxt layer creation includes licence and README/introduction artefacts while Registry/Templates and Documentation boundaries describe separate ownership constraints.

**Required decision:** distinguish **use-case orchestration ownership** from **artefact semantic/content ownership** and **persistence authority**.

The reconciliation shall not assume that including an artefact in a Nuxt layer profile transfers licence/documentation semantics to Nuxt Capability.

### R-04 — Bootstrap configuration / managed-project sequence

**External finding:** the dedicated bootstrap clarification is not fully propagated into the documents and diagrams whose sequencing it refines.

**Required decision:** make the clarification discoverable from all affected Detailed Designs and ensure diagrams/lifecycle prose agree with the staged semantic sequence.

### R-05 — Structural fact model

**External finding:** Source Intelligence, Documentation Capability and Nuxt Capability describe similar structural/domain fact records independently.

**Required decision:** establish whether downstream models are true specialisations/compositions of Source Intelligence facts or intentionally distinct semantic records. If shared semantics exist, define the common base contract once and preserve domain-specific extensions explicitly.

### R-06 — Repository / Source Intelligence relationship

**External finding:** Repository Capability states constraints on Source Intelligence without reciprocal acknowledgement.

**Required decision:** ensure dependency direction is explicit and one-sided assertions cannot silently become undocumented obligations.

### R-07 — App / Settings environment-file ownership

**External finding:** reported overlap between `FR-APP-016`–`018` and `FR-SET-058`–`061` for creation of local environment configuration from an example resource.

**Status:** must be verified directly before classification.

### R-08 — stale forward references and project-management records

**External findings:** possible stale "future/forthcoming" references plus known project-management references to removed archive material and previously fixed defects.

**Required decision:** verify individually and correct active project-management guidance so a new session can operate solely from the live tree.

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

### 4.4 Target outcome

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
7. **Coupling:** Does one capability need knowledge of another capability's internal provider/model, or only its AppManager-oriented contract?
8. **Cycle safety:** Are mutual dependencies staged or mediated explicitly rather than left circular?
9. **Mutation control:** Is consequential mutation centralized behind an explicit authorised boundary?
10. **Outcome control:** Does technical completion remain subordinate to owning-use-case interpretation?

A PASS should require these properties to be apparent from the design, not merely reconstructable by a reviewer already familiar with the architecture.

---

## 6. Process Changes Adopted for Reconciliation

Before DD-3 resumes:

- perform horizontal cross-document comparison in addition to vertical authority-chain conformance;
- verify all external-review findings against current live documents before editing normative specifications;
- use focused corrective PRs for confirmed normative defects;
- keep the reconciliation record separate from normative design authority;
- add a dependency-cycle check;
- add a single-semantic-owner check;
- add an ADR-trigger check;
- add a related-document/backlink check when one normative document corrects/refines another;
- include boilerplate/duplication review as a maintainability check, not merely editorial polish.

---

## 7. Current Gate State

The merged PR #85 audit remains historical evidence of the initial review, but its clean PASS is **not currently sufficient evidence to begin DD-3**.

Current project-management gate state:

> **DD-2 RECONCILIATION ACTIVE — DD-3 PAUSED**

The gate may return to PASS only when all material R-01 through R-08 findings are classified, confirmed defects/clarifications are resolved, and the final cross-document audit explicitly records the resulting state.
