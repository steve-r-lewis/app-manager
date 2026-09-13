# AppManager DD-2 Independent Review Reconciliation

> **Status:** Active project-management reconciliation record
>
> **Initial reconciliation baseline:** `master` at `32549f694839af0c55f900707607763beb7e1df5`, the merge commit for PR #85
>
> **Control record established:** PR #86, merge commit `e0f78771ef4c6efb80c5c76967c89b8b5b5181c3`
>
> **Current R-08 baseline:** `master` at `497400e816e2a0990554b2bcf1e90b333c21ddc9`, the merge commit for PR #97
>
> **Normative effect:** None. Normative Design, Functional and Detailed Design authority remains in the owning documents. This record classifies and tracks the independent horizontal review findings.

---

## 1. Purpose

PR #85 recorded a DD-2 Shared Capability conformance PASS. A subsequent independent horizontal review reported cross-document ownership, dependency and project-management consistency concerns that were not fully exposed by the earlier vertically-oriented audit.

This reconciliation reopens the **project-management conclusion**, not the architecture by assumption.

Each challenged finding is classified as one of:

1. **confirmed defect** — live normative documents materially conflict, duplicate semantic ownership, or leave a load-bearing contract ambiguous;
2. **clarification required** — the intended architecture is coherent but its ownership/delegation relationship is not stated precisely enough for independent implementation;
3. **not sustained** — the alleged issue is stale/incorrect or the documents describe compatible specialisations/projections.

Repository state and normative text must be verified before a classification or corrective edit is made.

---

## 2. Architectural Quality Objective

The reconciliation checks more than textual contradiction. AppManager should exhibit:

- high modularity;
- low semantic coupling;
- explicit interfaces/contracts;
- single semantic ownership where responsibility is shared;
- delegation without authority leakage;
- independently testable capability boundaries;
- provider and implementation replaceability;
- maintainability without requiring readers to reconstruct authority from duplicated prose.

A design that is technically separable but requires repeated prose negotiation to determine ownership is not expressing modularity clearly enough.

---

## 3. Reconciliation Worklist

### R-01 — Shared outcome contract

**External finding:** Application Invocation and Execution Outcomes appeared to define overlapping invocation/final outcome envelopes with non-identical field families.

**Classification:** confirmed semantic-ownership ambiguity.

**Decision:** DD-1.2 Execution Outcomes is the single canonical semantic owner of the shared AppManager outcome model. DD-1.1 Application Invocation owns caller-facing invocation mechanics and projection/delivery of the accepted DD-1.2 outcome; it does not own a second semantic result envelope.

```text
capability/provider evidence
        -> owning-use-case interpretation
        -> canonical DD-1.2 AppManager outcome
        -> DD-1.1 invocation projection/delivery
        -> caller
```

**Resolution evidence:** PRs #87 and #88 established and propagated the canonical ownership rule.

**Current status:** **resolved**.

### R-02 — Diagnostic taxonomy

**External finding:** DD-1.1 and DD-1.2 used divergent shared diagnostic categories while DD-2 capabilities also described local failure vocabularies.

**Classification:** confirmed semantic-ownership ambiguity between DD-1.1 and DD-1.2; local DD-2 provider/capability evidence is not independently defective.

**Decision:**

- DD-1.2 owns the canonical broad cross-application diagnostic taxonomy;
- DD-1.1 projects canonical diagnostics and may refine invocation-specific codes only through a DD-1.2 mapping;
- capability/provider failure classes remain technical evidence until mapped into application-facing diagnostics.

**Current status:** **resolved**.

### R-03 — Nuxt scaffold licence and README ownership

**External finding:** Nuxt layer creation includes licence and README/introduction artefacts while Registry/Templates, Documentation and Settings/application boundaries retain separate ownership constraints.

**Classification:** clarification required.

**Decision:** distinguish:

1. Nuxt layer-creation orchestration/profile ownership;
2. artefact semantic/content ownership;
3. declarative resource/template resolution/rendering ownership;
4. project-resource persistence/mutation ownership;
5. final Nuxt layer-creation application acceptance.

```text
Nuxt layer-creation use case / selected profile
        |
        +--> Nuxt semantics where Nuxt-specific
        +--> Documentation Capability for documentation semantics
        +--> Settings/application licence semantics where applicable
        +--> DD-2.6 Registry/Templates for resource resolution/rendering
        +--> DD-2.1 Resource Access for authorized new-resource creation
        +--> DD-2.5 Source Transformation for authorized existing-resource mutation
        |
        v
Nuxt-specific scaffold validation
        -> Application Engine / Nuxt-use-case acceptance
```

**Resolution evidence:** PR #89 added the focused scaffold artefact ownership clarification and propagated the relationship into the relevant normative documents.

**Current status:** **resolved**.

### R-04 — Bootstrap configuration / managed-project sequence

**External finding:** the bootstrap clarification was not fully propagated into the documents/diagrams whose sequencing it refined.

**Classification:** confirmed propagation defect.

**Decision:** the canonical staged dependency is:

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

Ownership remains separate:

- DD-1.3 owns project identity, managed-project context, managed scope and targetability;
- DD-1.4 owns configuration applicability, validation, precedence, fallback, provenance and effective-value construction in both stages;
- DD-1.5 owns coordination of the staged sequence;
- `application-core-bootstrap-resolution-clarification-v01.md` owns the cross-contract sequencing clarification.

**Current status:** **resolved**.

### R-05 — Structural fact model

**External finding:** Source Intelligence, Documentation Capability and Nuxt Capability describe similar structural/domain fact records independently.

**Classification:** **not sustained as duplicate semantic ownership; clarification not required for correctness.**

**Decision:** the models are similarly shaped but semantically distinct:

- DD-2.4 Source Intelligence owns normalized observations of bounded source snapshots;
- DD-2.10 Nuxt Capability owns Nuxt-specific interpretation and semantic representation;
- DD-2.9 Documentation Capability owns documentation-model composition/projection while preserving the authority/provenance of its inputs.

```text
bounded source snapshot
        -> DD-2.4 Source Intelligence facts
        -> DD-2.10 Nuxt interpretation where Nuxt meaning is required
        -> owning use-case interpretation / acceptance
```

Documentation may consume source facts, Nuxt/domain facts, other authoritative facts, existing authored documentation and generated prose without converting them into one universal semantic fact type.

The shared-looking fields (`kind`, identity/subject, provenance, confidence/support, revision/snapshot evidence, diagnostics) are recurring evidence metadata, not sufficient justification for a generic `StructuralFact` inheritance hierarchy or common provider framework.

**Current status:** **resolved — not sustained**.

### R-06 — Repository / Source Intelligence relationship

**External finding:** Repository Capability stated a constraint on Source Intelligence without making the dependency relationship sufficiently explicit.

**Classification:** **clarification required; no duplicate ownership or required direct capability dependency.**

**Decision:** Repository Capability and Source Intelligence are sibling capabilities:

```text
Application Engine / owning use case
        |
        +--> Repository Capability, where repository evidence is required
        +--> Source Intelligence, where source-structure evidence is required
        |
        v
owning-use-case composition / interpretation
```

Repository Capability owns repository identity/status/revision/ref/diff facts and bounded repository primitives. Source Intelligence owns read-only source recognition and normalized structural facts from bounded source snapshots.

Repository evidence may be deliberately supplied as contextual/provenance/freshness evidence where an owning use case requires it, but neither capability is a mandatory implementation dependency of the other. Repository revision identity and Source Intelligence snapshot/revision identity remain distinguishable where their semantics differ.

**Normative resolution:** `docs/detailed_design/repository-source-intelligence-relationship-clarification-v01.md`, merged through PR #96.

**Current status:** **resolved — clarification applied**.

### R-07 — App / Settings environment-file ownership

**External finding:** overlap between `FR-APP-016`–`018` and `FR-SET-058`–`061` for creation of local environment configuration from an example resource.

**Classification:** **clarification required; no duplicate use-case ownership.**

**Verified live evidence:**

- App owns existing-application initialisation intent and may require environment readiness as one lifecycle preparation step;
- Settings owns retained create/read/update/delete behaviour for managed-project environment-variable definitions, including creation from an approved example/default source and existing-definition protection;
- Configuration remains authoritative for candidate applicability, precedence, provenance and effective-value construction;
- generic persistence, template and source-transformation mechanics remain with their shared capability owners.

**Decision:**

```text
App existing-application initialisation
        -> Settings-owned environment-definition operation
        -> Settings result/evidence
        -> App initialisation interpretation / aggregation
        -> final App outcome
```

`FR-APP-016` is an orchestration requirement, not a second environment-definition CRUD authority. App decides whether environment readiness is required for the lifecycle use case and interprets the delegated result. Settings owns the persisted environment-definition operation itself.

`FR-APP-018` and `FR-SET-061` express the same protection outcome at different semantic levels; App must not bypass Settings protection through an alternate copy/write path.

**Normative resolution:** `docs/functional/app-settings-environment-definition-ownership-clarification-v01.md`, merged through PR #97.

**Modularity/coupling assessment:**

- **single owner:** satisfied — lifecycle orchestration remains App-owned; environment-definition CRUD remains Settings-owned;
- **explicit consumer/dependency:** satisfied — App may delegate the environment-definition step to Settings;
- **authority boundary:** satisfied — Settings completion does not independently determine App initialisation success;
- **replaceability:** preserved — no generic `EnvironmentService`, file format, parser, serializer or concrete persistence provider is mandated;
- **coupling:** reduced — App no longer needs an implied private environment-definition write path.

**Current status:** **resolved — clarification applied**.

### R-08 — stale forward references and project-management records

**External findings:** possible stale "future/forthcoming" references plus known project-management references to removed archive material and previously fixed defects.

**Classification:** **mixed: normative allegation not sustained; project-management staleness confirmed.**

**Verified live evidence:**

- the alleged stale future/forthcoming references in the cited Managed Project/Configuration normative material are not present in the current live text in the form alleged by the independent review;
- `docs/archive/` is absent from the live repository;
- `documentation-rationalisation-status-v01.md` nevertheless still described archive files as current reconciliation sources, directed new sessions to a removed archive path, described PR #7 and its old task branch as current work, carried obsolete Functional/Detailed Design migration backlogs, and listed an already-corrected control-character defect as open;
- `dd2-reconciliation-handover-v01.md` still described R-05 as next and R-06 through R-08 as open despite R-05/R-06/R-07 having subsequently been resolved;
- this control record itself still described R-07 as open after PR #97 merged.

**Decision:** R-08 is a project-management-state correction. It does not justify changes to the current normative Managed Project or Configuration Detailed Designs.

The cleanup shall:

- treat removed archive paths as historical provenance only, never current required reading;
- remove obsolete continuation instructions tied to old branches/PRs;
- remove or close already-fixed defect claims;
- replace superseded Functional/Detailed Design migration backlogs with the current DD state;
- update R-07/R-08 and the DD-2 reconciliation handover/gate to match verified live repository state;
- preserve dedicated archive-absence audit records where `docs/archive/` is intentionally named as the subject of the historical audit rather than as a current dependency.

One non-project-management occurrence remains in `app_manager/templates/template-repository.json`: a historical note cites a removed archive template specification. That file is implementation/data state rather than a project-management control record and is not used here as architecture authority. It should be handled through the applicable implementation/template rationalisation work rather than silently rewritten under R-08 without a verified replacement normative source.

**Current status:** **resolved by project-management cleanup, subject to merge of the R-08 PR**.

---

## 4. Boilerplate and Repetition Rule

The independent review also identified repeated cross-cutting invariants. The objective is not maximal deduplication; critical safety and authority boundaries must remain visible at their point of use.

Use three layers:

1. **Canonical invariant** — one normative semantic owner for architecture-wide meaning.
2. **Local binding statement** — a concise consuming-document statement that names/references the canonical owner without redefining it.
3. **Domain/capability delta** — detailed local refinement, exception, state or specialised evidence.

Material commonly suited to canonical ownership includes Application Engine authority, cancellation/no-rollback semantics, provider-result-versus-application-outcome semantics and generic implementation-topology disclaimers.

Material that should remain locally visible where necessary includes Resource Access accessibility versus managed scope, Source Intelligence recognition versus mutation, Source Transformation approval versus execution, AI action/request inertness, Quality autofix versus Source Transformation, Nuxt composition versus repository relationship, and Registry rendering versus persistence.

---

## 5. Modularity and Coupling Review Criteria

Each challenged design and every future DD-3 document shall be checked for:

1. **Single owner** — each shared semantic contract is owned once.
2. **Explicit consumer** — consumers reference/refine rather than recreate the contract.
3. **Authority boundary** — technical capability is distinguished from semantic authority.
4. **Interface visibility** — inputs, outputs, states, failure evidence and dependency direction are identifiable.
5. **Replaceability** — provider/implementation replacement does not change caller semantics.
6. **Cohesion** — responsibilities group by durable reason to change.
7. **Coupling** — consumers depend on AppManager-oriented contracts, not provider-native internals.
8. **Dependency-cycle safety** — cross-capability relationships form coherent directed dependencies rather than recursive authority.
9. **Mutation control** — recognition, generation, planning and execution remain distinct from mutation authorization.
10. **Outcome control** — application-level acceptance remains outside specialist provider completion.

These are architectural criteria, not mandates for one class/interface/package/process per responsibility.

---

## 6. Gate

All identified reconciliation items R-01 through R-08 are now classified and resolved, subject to merge of the R-08 project-management cleanup.

The gate remains temporarily:

> **DD-2 RECONCILIATION CLOSEOUT PENDING — DD-3 PAUSED**

DD-3 shall not resume merely because R-08 has been edited. After the R-08 PR is merged, the final horizontal reconciliation/conformance closeout must verify the resulting live `master` state and explicitly record whether the DD-2 gate can be lifted.