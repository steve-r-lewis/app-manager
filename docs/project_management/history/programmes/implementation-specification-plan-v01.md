# AppManager Implementation Specification Plan

> **Document type:** Project-management specification plan
>
> **Status:** Version 1 planning baseline
>
> **Governing specification level:** Level 4 — Implementation Specification
>
> **Normative implementation location:** `docs/implementation/`

## 1. Purpose

This document decides how the Version 1 Implementation Specification set enters the AppManager documentation tree and establishes the minimum planning rules needed before individual Implementation Specifications are written.

It deliberately uses ordinary project language. Its job is straightforward:

1. decide where Implementation Specifications live;
2. decide how they are identified and named;
3. decide how the completed Detailed Designs are mapped into implementation documents;
4. decide the order in which those documents should be written;
5. keep planning information separate from normative implementation requirements.

This document is project-management material. It does not itself prescribe source modules, classes, packages, libraries or runtime wiring.

---

## 2. Governing Documentation Structure

The [Project Documentation Guide](../project-documentation-guide-v01.md) defines four principal specification levels:

```text
Design Specification
        |
        v
Functional Specification
        |
        v
Detailed Design Specification
        |
        v
Implementation Specification
```

It already reserves the following active documentation location for Level 4:

```text
docs/implementation/
```

That directory shall therefore be the single top-level home for active normative Implementation Specifications.

Implementation Specifications shall **not** be placed under:

- `docs/project_management/`;
- any `docs/dd_*` Detailed Design family directory;
- `docs/design/`;
- `docs/functional/`;
- a source-code directory;
- `docs/archive/` while active.

Planning, writing order, implementation progress, migration sequencing, handovers and audits remain under `docs/project_management/`.

The resulting distinction is:

```text
docs/
├── implementation/                         # normative Level 4 specifications
│   ├── implementation-specification-v01.md # Level 4 overview and index
│   └── <individual implementation specifications>
│
└── project_management/
    └── implementation-specification-plan-v01.md # this planning document
```

---

## 3. Why One Implementation Directory

Detailed Design needed four family directories because the project deliberately established stable DD families with stable `DD-<family>.<item>` identities.

No equivalent Implementation Specification families have been approved, and they should not be invented merely to mirror DD-1 through DD-4.

Implementation Specifications describe the concrete reduction of approved design into code, build, runtime and repository artefacts. A useful implementation unit may therefore realise contracts from several Detailed Designs, while one Detailed Design may contribute requirements to several implementation units.

Consequently:

> **The Implementation Specification tree shall follow real implementation responsibility, not mechanically reproduce the Detailed Design tree.**

The initial structure shall remain flat under `docs/implementation/`. Subdirectories should be introduced only if the completed implementation map demonstrates a stable grouping that materially improves navigation.

A directory must not be created merely because a source package, current service, historical folder or DD family happens to exist.

---

## 4. Implementation Specification Identity

Primary Implementation Specifications require stable identities so that Detailed Design contracts, source code, tests, reviews and later implementation changes can refer to them unambiguously.

The Version 1 identifier form shall be:

```text
IS-<number>
```

Examples:

```text
IS-1
IS-2
IS-12
```

The number identifies a primary Implementation Specification. It does not imply architectural authority or dependency order.

The filename shall encode the identifier using the existing project filename convention:

```text
is-1-<subject>-implementation-specification-v01.md
is-2-<subject>-implementation-specification-v01.md
```

The subject must describe the concrete implementation responsibility in plain technical language.

Identifiers shall be assigned only after the implementation map establishes that the proposed document has a coherent implementation responsibility. We shall not pre-allocate one IS number for every DD document.

Supporting implementation clarifications, audits, migration records and handovers shall not receive fictitious primary `IS-*` identifiers.

---

## 5. Implementation Specification Overview

The active Level 4 set has a human-readable entry point:

```text
docs/implementation/implementation-specification-v01.md
```

This overview shall:

- explain the purpose and authority of Level 4;
- list every approved primary `IS-*` document;
- link to each document;
- state its implementation responsibility in one concise sentence;
- identify the principal Detailed Designs it implements;
- show its current document status;
- provide navigation to the governing Design, Functional and Detailed Design documentation.

The overview is an index and orientation document. It must not become a second copy of the individual specifications.

---

## 6. Deciding the Individual Implementation Specifications

The completed Detailed Design set was compared with the actual repository implementation surface before the Version 1 `IS-*` register was assigned.

For each proposed implementation unit, the planning work must answer five practical questions:

1. **What concrete code or runtime responsibility is being specified?**
2. **Which Detailed Design contracts require it?**
3. **Which source modules, packages, configuration, build or runtime artefacts will realise it?**
4. **Can it be implemented and tested as a coherent unit without duplicating another specification?**
5. **Would combining or splitting it make the implementation easier to understand and maintain?**

The mapping is many-to-many by default:

```text
Detailed Design contracts
          |
          | many-to-many
          v
Implementation Specifications
          |
          v
source / tests / build / runtime artefacts
```

This avoids two opposite errors:

- creating one Implementation Specification per Detailed Design regardless of the code architecture;
- creating one enormous AppManager implementation document that becomes difficult to review and maintain.

The approved Version 1 register is maintained in [Implementation Specification Overview](../implementation/implementation-specification-v01.md).

---

## 7. Required Content of a Primary Implementation Specification

Each primary `IS-*` document should contain only sections that materially help implement and verify its responsibility. A rigid large template is not required.

At minimum, each document shall make the following clear:

- identity, subject and status;
- purpose and scope;
- governing Detailed Design contracts and relevant ADRs;
- concrete source/module/package responsibility;
- public and internal interfaces where relevant;
- concrete dependencies and selected libraries where relevant;
- runtime, bootstrap or registration wiring where relevant;
- configuration and persistence bindings where relevant;
- error, cancellation, concurrency and safety mechanics where relevant;
- concrete tests and conformance checks;
- legacy implementation disposition and migration work from the current repository;
- traceability from implementation artefacts back to the Detailed Design contracts they realise.

Sections should be omitted when they add no information. The Implementation Specification set should favour precision over ceremonial completeness.

---

## 8. Relationship to Current Code

The current repository is evidence and starting material, not design authority.

Implementation planning must inspect the existing source tree because Level 4 is specifically concerned with concrete code and migration. However:

> **Existing code does not become correct merely because it exists.**

Equally:

> **Existing code does not become disposable merely because a new design has been approved.**

Where current code conflicts with an approved Detailed Design contract, the Implementation Specification shall describe the target implementation and, where necessary, the concrete migration from the current state.

Where current code already conforms, or contains sound implementation mechanisms that can conform after bounded changes, the specification should preserve that work rather than require an unnecessary rewrite.

The objective is to preserve good engineering while removing accidental responsibility coupling and bringing the surviving implementation under the approved contracts.

---

## 9. Legacy Implementation Disposition

Every primary Implementation Specification shall explicitly assess relevant existing implementation before prescribing replacement code.

The assessment shall classify existing artefacts using four dispositions.

### 9.1 RETAIN

Use **RETAIN** where the existing implementation substantially conforms to the approved responsibility and can remain without material architectural change.

Retention may still permit ordinary maintenance such as naming cleanup, tests, dependency updates or stronger typing.

### 9.2 ADAPT

Use **ADAPT** where the implementation mechanism is sound but its interface, configuration access, result model, error handling, lifecycle, dependency wiring or other boundary detail must change to conform.

The specification shall identify what is preserved and what must change.

### 9.3 SPLIT / RELOCATE

Use **SPLIT / RELOCATE** where useful implementation currently combines responsibilities that the approved architecture assigns to different owners.

The code or algorithm should be preserved where practical, but moved behind the correct implementation boundary. A split must not be treated as evidence that the original implementation was poor; it may simply reflect a more precise responsibility model.

Typical examples include:

- filesystem mechanics mixed with source-transformation policy;
- repository primitives mixed with Git-domain workflow policy;
- provider mechanics mixed with application authorization or acceptance;
- interaction output mixed with canonical application diagnostics.

### 9.4 REPLACE

Use **REPLACE** only where the current implementation materially conflicts with approved requirements, cannot be safely adapted, duplicates an authority that must not exist, or would cost more to untangle than to implement correctly.

Replacement requires a stated technical reason. “Legacy”, “old”, or “not part of the new structure” is not sufficient justification.

### 9.5 Required disposition record

Each Implementation Specification shall include a concise table or equivalent record covering the relevant current artefacts:

| Current artefact | Disposition | Target owner/location | Preserved value | Required change |
|---|---|---|---|---|
| `path/to/current.ts` | RETAIN / ADAPT / SPLIT / RELOCATE / REPLACE | owning IS/component | useful implementation to preserve | bounded migration required |

The classification applies to implementation responsibility, not merely whole files. Different parts of one legacy file may receive different dispositions.

For example, a service may contain:

- a provider wrapper worth retaining;
- workflow policy that must move to a domain implementation;
- direct environment-variable access that must be adapted to governed configuration;
- error strings that must be normalized into approved outcome semantics.

The Implementation Specification shall preserve those distinctions rather than force a single all-or-nothing judgement on the file.

### 9.6 No rewrite-by-default policy

The Version 1 implementation programme is therefore governed by this rule:

> **Preserve conforming code and good implementation mechanisms by default; refactor, split or replace only to satisfy an approved contract or produce a materially clearer and safer implementation boundary.**

This rule does not allow current code to override the Design, Functional or Detailed Design specifications. It governs how the approved design is reduced to practice efficiently and with minimum unnecessary loss of good engineering work.

---

## 10. Writing Order

The Implementation Specifications shall be written in dependency-aware order, but the order is a project-management concern rather than an authority hierarchy.

The Version 1 register now establishes the primary implementation set. Writing order should account for:

- foundational runtime and application wiring needed by many later units;
- shared implementation mechanisms needed by several domains;
- domain implementation units that depend on those foundations;
- policy/resource implementation units that depend on the established core;
- adapters and integration wiring whose concrete design depends on the authoritative application path.

The order may be refined if implementation evidence demonstrates that a different sequence reduces rework without changing specification authority.

---

## 11. Navigation

Once the first primary Implementation Specification is approved, VitePress shall expose **Implementation** as a first-class documentation section alongside Detailed Design.

The navigation entry point shall be:

```text
/implementation/implementation-specification-v01
```

The sidebar shall list the primary `IS-*` specifications from the overview/register.

Planning documents under `project_management/` do not need to appear as primary specification navigation merely because they coordinate Implementation Specification work.

---

## 12. Plain-Language Rule

Implementation documentation should use technical terminology when the terminology names a real implementation concept, API, language construct, protocol, package, runtime mechanism or architectural distinction.

Project activity should be described in ordinary English.

Prefer:

- `Implementation Specification Plan` over `Implementation Specification decomposition and authoring planning`;
- `writing order` over `authoring sequence` where no stronger distinction is intended;
- `map the design to code` over `perform downward decomposition`;
- `decide the modules and dependencies` over `establish implementation topology` when the concrete meaning is simply modules and dependencies.

A term should earn its place by making a technical distinction clearer. Terminology that merely makes a simple activity sound more formal should be removed.

---

## 13. Immediate Next Work

The Version 1 Implementation Specification map and register are complete.

The next task is:

> **Author IS-23 — Build and Runtime Assembly, using the legacy disposition method in Section 9 before prescribing migration or replacement of existing build/runtime code.**

IS-23 shall remain narrowly scoped to the concrete Node.js/TypeScript package, build, executable and composition foundations required by the approved design. It shall not pre-empt the module-level implementation decisions owned by later Implementation Specifications.

---

## 14. Decision Summary

The Version 1 Implementation Specification documentation enters the project tree as follows:

```text
docs/
├── implementation/
│   ├── implementation-specification-v01.md
│   ├── is-1-<subject>-implementation-specification-v01.md
│   ├── is-2-<subject>-implementation-specification-v01.md
│   └── ...
│
└── project_management/
    └── implementation-specification-plan-v01.md
```

The governing rules are:

1. `docs/implementation/` is the single active Level 4 specification location.
2. `docs/project_management/` holds planning, sequencing, audits and handovers, not normative implementation requirements.
3. Primary Implementation Specifications use stable `IS-<number>` identities.
4. The IS set is derived from real implementation responsibilities and DD traceability, not one-for-one from DD numbering.
5. The initial Implementation directory remains flat until a demonstrated need for stable subgroups exists.
6. `implementation-specification-v01.md` is the Level 4 overview and register.
7. Every primary IS assesses relevant current code using RETAIN, ADAPT, SPLIT / RELOCATE, or REPLACE before prescribing migration.
8. Existing code is evidence and reusable implementation material, not design authority.
9. Good implementation should be preserved unless an approved contract or materially safer/clearer boundary requires change.
10. VitePress gains a first-class Implementation section when the first primary IS is approved.
11. Plain English is preferred for project activity; specialist terminology is retained only where it conveys a real technical distinction.
