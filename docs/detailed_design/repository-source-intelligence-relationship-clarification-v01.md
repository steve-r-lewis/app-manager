# AppManager Repository / Source Intelligence Relationship Clarification

> **Status:** Version 1 Detailed Design clarification
>
> **Purpose:** Clarify the permanent relationship between DD-2.3 Repository Capability and DD-2.4 Source Intelligence without creating a new subsystem, shared provider model or authority transfer.
>
> **Normative scope:** This document refines the relationship between `repository-capability-detailed-design-v01.md` and `source-intelligence-detailed-design-v01.md`. It does not replace either capability's owning contracts or the DD-1 Application Core authorities.

---

## 1. Clarified Architectural Relationship

Repository Capability and Source Intelligence are **sibling shared capabilities with distinct semantic ownership**.

Repository Capability owns repository-oriented facts and bounded repository primitives, including repository identity, revisions, refs, status, staging state, remotes and diff/change evidence.

Source Intelligence owns read-only source recognition and normalized structural facts derived from a bounded source snapshot.

Neither capability is the semantic parent of the other, and neither may impose provider-native models or application authority on the other.

The governing distinction is:

```text
repository state / revision / diff evidence
        != source snapshot / structural facts
        != transformation intent or authority
```

Repository evidence may help an owning use case establish context, freshness, changed-resource selection or diagnostic provenance. Where actual source structure must be understood, the owning use case or another explicitly owning capability supplies a bounded source snapshot/reference to Source Intelligence under DD-2.4.

---

## 2. Dependency Direction

The canonical composition is:

```text
Application Engine / owning use case
        |
        +--> Managed Project / governed scope
        +--> Resource Access / bounded resource state
        +--> Repository Capability, where repository evidence is required
        +--> Source Intelligence, where source-structure evidence is required
        |
        v
owning-use-case interpretation / later authorised work
```

A workflow may consume both capability results, but that composition does not create a mandatory Repository Capability -> Source Intelligence implementation dependency or the reverse.

If repository evidence is supplied alongside a Source Intelligence request, it remains caller-supplied contextual/provenance evidence. Source Intelligence determines source recognition and structural facts under its own contract.

If a Repository Capability consumer requires source-aware interpretation of changed content, Repository Capability does not acquire parsing/structural-analysis semantics. The owning use case composes DD-2.3 evidence with DD-2.4 analysis explicitly.

---

## 3. Repository Capability Boundary

The DD-2.3 statement that Source Intelligence may consume repository/resource context where needed is a **permitted composition statement**, not authority for Repository Capability to define Source Intelligence behavior.

Repository Capability shall therefore not:

- require Source Intelligence to consume repository status for ordinary analysis;
- redefine DD-2.4 source snapshot, recognition, structural fact, confidence or provider contracts;
- treat repository diff/change records as normalized source-structural facts merely because they identify changed lines or resources;
- infer transformation intent or authorization from repository status;
- require Source Intelligence to use repository-native identities when DD-2.4's bounded source/revision identity is sufficient.

Repository status, revision and diff evidence remain repository evidence until an owning use case deliberately composes them with source analysis.

---

## 4. Source Intelligence Boundary

Source Intelligence may consume bounded repository evidence when it materially contributes to provenance, freshness or caller-selected analytical context, but it remains optional unless the owning use case requires that evidence.

Source Intelligence shall therefore not:

- infer repository workflow intent, staging intent, commit scope, synchronization policy or repository mutation authority from source analysis;
- reinterpret repository refs, branches, remotes, staging state or diff semantics as source-structure authority;
- require Repository Capability merely because a source resource happens to be located inside a repository;
- treat repository revision identity as a universal substitute for DD-2.4 source snapshot/revision evidence when finer-grained or non-repository source identity is required;
- bypass Managed Project, Resource Access or the owning use case in order to expand repository or filesystem scope.

---

## 5. Evidence and Freshness

Repository revision evidence and Source Intelligence snapshot evidence may correlate, but they are not universally identical.

Examples include:

- an uncommitted worktree source snapshot whose content differs from the current commit;
- a source resource outside a repository;
- an embedded source region whose structural coordinates are meaningful below repository-file granularity;
- a repository revision that establishes repository history but not the exact in-memory/resource snapshot analyzed by Source Intelligence.

Where correctness depends on freshness, the consuming workflow shall retain the evidence appropriate to the fact being relied upon rather than coercing both capabilities into one revision model.

---

## 6. Authority and Mutation

Neither repository recognition nor source recognition grants mutation authority.

The permanent direction remains:

```text
technical evidence
        -> owning-use-case interpretation
        -> explicit intent / policy / scope / authorization
        -> bounded repository or source-transformation execution
        -> validation
        -> AppManager acceptance
```

Repository Capability may execute an already-authorized repository primitive under DD-2.3. Source Intelligence remains read-only. Existing-source mutation remains governed by DD-2.5 Source Transformation and application authority above it.

---

## 7. Replaceability and Implementation Independence

This clarification does not require:

- one shared Repository/Source Intelligence service;
- a common provider abstraction;
- a shared revision type for all repository and source facts;
- Repository Capability to invoke Source Intelligence internally;
- Source Intelligence to invoke Repository Capability internally;
- one class, package, process or runtime boundary.

Providers remain independently replaceable behind their AppManager-oriented contracts. Composition occurs at the owning-use-case/capability level where actual semantics require it.

---

## 8. Conformance Rules

A conforming Version 1 design shall preserve all of the following:

1. repository facts and source-structural facts remain distinct semantic evidence;
2. neither capability silently imposes provider or internal-model obligations on the other;
3. repository evidence may be supplied to source analysis only as bounded contextual/provenance evidence unless a higher-level use case explicitly requires more;
4. source analysis does not acquire repository workflow or mutation authority;
5. repository diff/status evidence does not become source-structural interpretation by implication;
6. repository revision and source snapshot identity remain distinguishable where their semantics differ;
7. any workflow requiring both capabilities composes them explicitly under an owning use case or another documented capability boundary;
8. delegated specialist execution does not transfer application authority;
9. implementation topology remains unconstrained by this relationship clarification.
