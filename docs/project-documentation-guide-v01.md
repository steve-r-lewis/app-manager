# AppManager Project Documentation Guide

## 1. Purpose

This document defines the documentation architecture, writing conventions, naming conventions, specification hierarchy, traceability rules, and maintenance principles for the AppManager project.

It is the highest-level documentation authority within the `docs/` tree.

All AppManager project documentation should conform to this guide unless a later approved version explicitly supersedes it.

The purpose of this guide is to ensure that project documentation remains:

- coherent across different levels of abstraction;
- precise about intent, behaviour, design, and implementation;
- resistant to duplication and contradiction;
- maintainable as the codebase evolves;
- suitable for both human and AI-assisted development;
- traceable from high-level system intent through to concrete implementation;
- consistent in terminology, naming, structure, and style.

---

## 2. Documentation Authority

The AppManager documentation hierarchy is normative.

Higher-level documents define intent and constraints that lower-level documents refine.

Lower-level documents may add detail, but they must not silently redefine or contradict higher-level documents.

If implementation work reveals that a higher-level requirement or design decision is incorrect, incomplete, or impractical, the higher-level document must be deliberately revised before the lower-level implementation specification is treated as authoritative.

The governing principle is:

> Information must be recorded at the highest appropriate level of abstraction and must not be duplicated into lower or higher specification levels unless required for context or traceability.

A second governing principle is:

> Lower-level specifications may refine higher-level requirements but must not silently redefine them.

---

## 3. Project Naming Conventions

### 3.1 Application Name

The canonical application name is:

**AppManager**

All prose, headings, diagrams, user-facing labels, architectural descriptions, and conceptual references to the application must use `AppManager`.

Alternative prose forms such as the following should not be used as names for the application:

- `App Manager`
- `app-manager`
- `app_manager`
- `Appmanager`

Machine-facing identifiers may use other forms only where required by the relevant naming convention or external system.

Examples include repository names, package names, filenames, command names, URLs, environment variables, and filesystem paths.

### 3.2 General Naming Character Rules

Unless a specific external format imposes different requirements, project-controlled names must use only:

- lowercase letters `a-z`;
- numbers `0-9`;
- underscore `_` where directory or identifier conventions require it;
- hyphen `-` where filename conventions require it.

No other special characters should be used in project-controlled naming schemes.

Spaces must not be used in project-controlled directory names, filenames, or identifiers.

Uppercase letters must not be used in project-controlled directory names, filenames, or identifiers unless an external format explicitly requires them.

### 3.3 Directory Names

Directory names must:

- use lowercase letters;
- use numbers where useful;
- use underscores as word delimiters;
- not use hyphens as word delimiters;
- not use spaces;
- not use other special characters.

Examples:

```text
license_engine/
template_engine/
project_config/
test_reports/
architecture_v2/
```

Incorrect examples:

```text
license-engine/
TemplateEngine/
project config/
project.config/
```

### 3.4 Filenames

Filenames must:

- use lowercase letters;
- use numbers where useful;
- use hyphens as word delimiters;
- not use underscores as word delimiters;
- not use spaces;
- not use other special characters except the required extension separator.

Examples:

```text
project-documentation-guide-v01.md
appmanager-design-specification-v01.md
config-service-detailed-design-v02.md
git-sync-command-v01.md
```

The file extension separator is the unavoidable format delimiter and is not treated as part of the project naming scheme.

### 3.5 Identifiers and Named Project Items

Where AppManager defines a machine-readable identifier, key, slug, registry item, or similar project-controlled name, the preferred delimiter is underscore unless the surrounding format defines a stronger convention.

Examples:

```text
license_engine
project_root
active_provider
repository_registry
```

Externally defined conventions should not be rewritten merely to conform to AppManager naming rules. Examples include npm package names, Git command syntax, environment variable conventions, URLs, JSON standards, TypeScript identifiers, and third-party API fields.

---

## 4. Documentation Hierarchy

AppManager documentation is divided into four principal specification levels.

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

Each level answers a different engineering question and must remain within its intended level of abstraction.

---

## 5. Level 1 - Design Specification

### 5.1 Purpose

The Design Specification defines what AppManager is intended to be.

It is the system-level design authority.

### 5.2 Primary Question

> What system are we building, and what architectural intent governs it?

### 5.3 Appropriate Content

The Design Specification may define:

- system purpose;
- scope and boundaries;
- goals and non-goals;
- system vision;
- conceptual architecture;
- major subsystems;
- interaction modes;
- command domains;
- configuration model;
- managed-project model;
- principal workflows;
- design principles;
- architectural invariants;
- extensibility principles;
- terminology;
- naming conventions where project-wide;
- relationships among major architectural concepts;
- high-level security, safety, consistency, and non-destructive-operation principles.

### 5.4 Inappropriate Content

The Design Specification should normally avoid:

- exact source file paths;
- line numbers;
- transient implementation status;
- statements such as `currently unused`, `stub`, or `not yet wired` unless they are themselves part of an explicit design constraint;
- specific implementation-library calls;
- concrete method signatures;
- implementation migration steps;
- temporary refactoring notes;
- detailed test procedures.

### 5.5 Root Design Specification

The primary AppManager Design Specification should act as the root design authority beneath this documentation guide.

Its purpose is to describe the intended AppManager system rather than to audit the current source tree.

---

## 6. Level 2 - Functional Specification

### 6.1 Purpose

The Functional Specification defines what AppManager must do.

It translates system intent into precise functional behaviour without unnecessarily prescribing implementation.

### 6.2 Primary Question

> What behaviour and capabilities must the system provide?

### 6.3 Appropriate Content

Functional Specifications may define:

- user-visible capabilities;
- command behaviour;
- functional requirements;
- inputs and outputs;
- preconditions;
- postconditions;
- validation rules;
- error and failure behaviour;
- user interaction flows;
- headless behaviour;
- functional equivalence across presentation modes;
- configuration behaviour;
- repository-management behaviour;
- project and layer lifecycle behaviour;
- documentation behaviour;
- quality-control behaviour;
- safety requirements for destructive operations.

### 6.4 Example

Appropriate functional statement:

> AppManager shall allow the user to synchronise the root repository and its managed layer repositories.

Inappropriate implementation-specific statement:

> `githubService.syncRepo()` shall call `simple-git.submoduleUpdate()`.

The latter belongs at a lower specification level.

---

## 7. Level 3 - Detailed Design Specification

### 7.1 Purpose

The Detailed Design Specification defines how AppManager functionality is designed internally.

This is the component, command, interface, and subsystem design level.

### 7.2 Primary Question

> How should the system realise the required functionality internally?

### 7.3 Appropriate Content

Detailed Design Specifications may define:

- commands;
- services;
- scanners;
- strategies;
- orchestrators;
- resolvers;
- template engine components;
- license engine components;
- registries;
- interfaces;
- type contracts;
- component responsibilities;
- dependencies;
- data structures;
- algorithms;
- state transitions;
- component interactions;
- command orchestration;
- internal error contracts;
- internal extension points;
- component-level test requirements where useful to the design.

### 7.4 Example

Functional Specification:

> AppManager shall resolve a setting from the applicable configuration sources according to the configured precedence rules.

Detailed Design Specification:

> `config_service` owns configuration loading, while a settings resolver applies precedence rules and returns the resolved value together with its source.

The exact implementation paths and concrete wiring remain the responsibility of the Implementation Specification.

---

## 8. Level 4 - Implementation Specification

### 8.1 Purpose

The Implementation Specification records how the approved design is realised in the actual AppManager codebase.

This is intentionally implementation-specific.

### 8.2 Primary Question

> How does the current codebase implement the approved design?

### 8.3 Appropriate Content

Implementation Specifications may define or record:

- exact source paths;
- module names;
- exported symbols;
- concrete function and method signatures;
- third-party packages;
- bootstrap and registration wiring;
- configuration file locations;
- runtime paths;
- migration steps;
- source-level dependencies;
- implementation constraints;
- implementation status;
- implemented, deferred, replaced, or retired features;
- deviations from approved design;
- compatibility notes;
- concrete test mappings;
- source audit findings;
- technical debt that is specifically tied to current implementation.

Statements such as the following belong at this level:

> `code_service` is not currently consumed by the command layer.

> `repository_registry.json` has no runtime consumer in the present implementation.

These are useful implementation observations but should not pollute the system Design Specification.

---

## 9. Traceability

Documentation should support traceability in both directions.

A high-level requirement should be traceable to the functionality, components, and implementation that realise it.

An implementation component should be traceable back to the design intent and functional requirement that justify its existence.

Example:

```text
Design Specification
  repository management
        |
        v
Functional Specification
  synchronise managed repositories
        |
        v
Detailed Design Specification
  sync command
  repository resolver
  git service
        |
        v
Implementation Specification
  command modules
  resolver modules
  service modules
```

Traceability may be expressed through document references, requirement identifiers, component names, command identifiers, or structured cross-reference tables.

Traceability should be introduced where it provides engineering value and should not become bureaucratic overhead.

---

## 10. Interaction Modes

AppManager is designed to support multiple presentation and interaction modes over the same underlying application capabilities.

The recognised interaction model is:

```text
                 AppManager

       presentation and interaction

       tui      headless      gui
        |          |           |
        +----------+-----------+
                   |
                   v
          command and use-case layer
                   |
                   v
          application subsystems
```

### 10.1 Text User Interface

The TUI provides guided, interactive terminal operation.

### 10.2 Headless Mode

Headless mode provides non-interactive operation for:

- automation;
- scripts;
- CI/CD;
- repeatable command execution;
- machine-controlled workflows.

### 10.3 Graphical User Interface

The GUI is a proposed first-class interaction mode providing graphical access to AppManager capabilities.

Its introduction must not require duplication of underlying application logic.

### 10.4 Presentation Independence

A core architectural principle is:

> Commands and application capabilities must not inherently depend upon a particular presentation mode.

TUI, Headless, and GUI interfaces should act as adapters into shared application capabilities rather than becoming independent implementations of those capabilities.

Business logic should therefore reside below the presentation layer whenever practical.

---

## 11. Architectural Terminology

AppManager architecture must be described according to the architectural role and relationship of its constituent concerns rather than by treating component families as equivalent architectural layers.

Architectural concerns may include, but are not limited to:

* services;
* scanners;
* strategies;
* templates;
* orchestrators;
* resolvers;
* License Engine;
* Template Engine;
* command infrastructure;
* configuration infrastructure;
* presentation and interaction adapters.

These concerns may represent different kinds of architectural constructs and must not be assumed to occupy equivalent positions within a layered architecture.

The preferred terminology is therefore:

* architectural subsystem;
* component family;
* application subsystem;
* processing stage;
* command layer;
* presentation adapter;
* domain engine.

The term `layer` should be used only where a genuine layered relationship exists or where it refers specifically to a Nuxt layer.

---

## 12. Documentation Structure

The `docs/` tree should reflect specification responsibility rather than historical generation order.

The documentation root should contain the highest-level governing documents, the specification hierarchy, project-management records, and the archive, including:

```text
docs/
├── project-documentation-guide-v01.md
├── appmanager-design-specification-v01.md
├── design/
├── functional/
├── detailed_design/
├── implementation/
├── project_management/
└── archive/
    ├── design/
    ├── functional/
    ├── detailed_design/
    ├── implementation/
    └── project_management/
```

The four principal specification levels are represented by `design/`, `functional/`, `detailed_design/`, and `implementation/` together with the root Design Specification where applicable.

The `project_management/` directory contains project planning, coordination, migration, rationalisation, status, handoff, release-planning, and similar management artefacts. It is outside the normative Design → Functional → Detailed Design → Implementation specification hierarchy. Material recorded there may report on, coordinate, or reference specification work, but it must not establish product requirements or design authority unless that information is deliberately incorporated into the appropriate authoritative specification.

The `archive/` tree is outside the active specification hierarchy. Documents beneath it are non-authoritative regardless of their previous status.

This tree is a target documentation model rather than an instruction to immediately move every existing document.

Existing documentation should be rationalised incrementally to avoid information loss.

Lower-level directories may be subdivided according to stable architectural or functional concerns.

Example:

```text
docs/
└── detailed_design/
    ├── architecture/
    │   ├── services/
    │   ├── scanners/
    │   ├── strategies/
    │   ├── orchestrators/
    │   ├── resolvers/
    │   ├── template_engine/
    │   └── license_engine/
    └── commands/
        ├── app/
        ├── git/
        ├── nuxt/
        ├── docs/
        ├── quality/
        ├── utils/
        ├── ai/
        └── settings/
```

The final directory structure should evolve from the current documentation tree rather than being replaced without analysis.

---

## 13. Document Naming

Documentation filenames should communicate:

1. subject;
2. specification or document type where useful;
3. version.

Examples:

```text
project-documentation-guide-v01.md
appmanager-design-specification-v01.md
git-functional-specification-v01.md
config-service-detailed-design-v01.md
git-sync-command-detailed-design-v01.md
appmanager-implementation-specification-v01.md
```

Dates should not normally be used as the primary identity of a normative specification document.

Date-prefixed names may be appropriate for:

- meeting notes;
- investigation records;
- one-time audits;
- migration snapshots;
- historical analysis;
- temporary planning artefacts.

Normative documents should have stable semantic names and explicit versions.

### 13.1 Retired Document Filenames

A document must receive the `-retired` lifecycle suffix only when it satisfies the retirement criteria defined in Section 18.

The suffix must appear immediately after the document version and before the file extension:

```text
<document-name>-v<version>-retired.md
```

Examples:

```text
app-manager-design-specification-overview-v01-retired.md
appmanager-design-specification-v02-retired.md
```

Archiving alone must not add the `-retired` suffix. An archived document that has not completed retirement retains its existing filename.

---

## 14. Document Versioning

Normative documents should use explicit version suffixes.

Preferred form:

```text
-v01
-v02
-v03
```

A version change should represent a meaningful revision to the document's content or authority.

Minor wording corrections need not automatically create a new document version if normal source-control history provides sufficient auditability.

When a new document version supersedes an old one, the older version must be made unambiguously non-authoritative when it leaves active use. It may first be archived while reconciliation remains incomplete and subsequently marked retired when the retirement criteria in Section 18 have been satisfied.

The project should avoid multiple apparently current specifications covering the same responsibility.

---

## 15. Writing Style

AppManager specifications should use clear, technical, declarative language.

### 15.1 Preferred Characteristics

Documentation should be:

- precise;
- concise without omitting important detail;
- explicit about normative requirements;
- consistent in terminology;
- structured logically rather than historically;
- written in a unified technical voice;
- clear about the difference between current implementation and intended design.

### 15.2 Normative Language

Use terms deliberately:

- `must` for mandatory requirements;
- `must not` for prohibited behaviour;
- `should` for strong recommendations that may have justified exceptions;
- `should not` for discouraged behaviour;
- `may` for permitted optional behaviour;
- `proposed` for design ideas that are not yet approved requirements;
- `deferred` for approved scope intentionally postponed;
- `deprecated` for functionality still present but scheduled for replacement;
- `archived` for documentation removed from the active documentation tree and retained as non-authoritative source or historical material;
- `retired` for documentation whose continuing information value has been fully dispositioned and which is permanently non-authoritative.

Avoid using `will` where `must`, `should`, or `may` would more precisely express the requirement.

### 15.3 Current State Versus Intended State

Documents must distinguish clearly among:

- intended design;
- approved requirement;
- proposed future work;
- current implementation;
- legacy behaviour;
- deprecated behaviour;
- archived documentation;
- retired documentation.

A Design Specification should primarily describe intended design.

An Implementation Specification may describe actual current state and implementation gaps.

---

## 16. Avoiding Duplication

The project must avoid parallel specifications that independently describe the same responsibility.

Where information belongs to another document:

- reference it;
- summarise only the minimum context necessary;
- do not reproduce its full detail.

For example, the root Design Specification may identify the Git command domain and its purpose, but individual Git command behaviour belongs in the Functional Specification and command-level Detailed Design Specifications.

Likewise, the Detailed Design Specification may define a service interface, while the Implementation Specification records the exact module path and concrete implementation.

---

## 17. Conflict Resolution

When documentation sources disagree:

1. identify the abstraction level of each source;
2. determine which document has authority for the disputed subject;
3. preserve all meaningful information during investigation;
4. explicitly record unresolved contradictions;
5. resolve the contradiction in the authoritative document;
6. update, archive, or retire conflicting lower-authority documents as appropriate;
7. do not silently discard unique design information.

During consolidation, historical documents must not be retired until their unique information has been accounted for. Documents may be archived before this point so that they no longer create ambiguity in the active documentation tree.

---

## 18. Documentation Lifecycle, Archiving, and Retirement

The documentation lifecycle must distinguish document authority from document retention.

A document's filesystem location and lifecycle status are related but are not interchangeable. In particular, moving a document into `docs/archive/` removes it from the active authoritative tree but does not by itself mean that its information has been fully migrated or that the document qualifies as retired.

### 18.1 Lifecycle States

The principal lifecycle states are:

```text
proposed
   |
   v
approved
   |
   v
active
   |
   +------> superseded
   |             |
   |             v
   |          archived
   |             |
   |             v
   |           retired
   |
   +------> deprecated
                 |
                 v
              archived
                 |
                 v
               retired
```

Archiving may also be applied directly to non-normative historical, audit, roadmap, reconciliation, or project-management material when it is intentionally removed from the live documentation tree.

### 18.2 Active

An active document resides in the live documentation hierarchy and may carry normative authority according to its specification level and relationship to other active documents.

A document that remains authoritative must not be placed beneath `docs/archive/`.

### 18.3 Archived

An archived document:

- resides beneath `docs/archive/`;
- is no longer authoritative;
- may still contain unique information awaiting migration or reconciliation;
- may be retained as historical, audit, provenance, or traceability evidence;
- must retain its existing filename unless and until it satisfies the retirement criteria;
- must not be treated as part of the active specification hierarchy.

Archiving is therefore the correct state for a document that must leave the live tree to remove ambiguity but cannot yet be declared fully redundant.

### 18.4 Retired

A retired document is permanently non-authoritative and has completed the information-disposition process.

A document may be marked retired only when every meaningful piece of information that the project intends to preserve has been explicitly accounted for by one or more of the following dispositions:

- incorporated into an active authoritative specification;
- moved to the appropriate Functional Specification;
- moved to the appropriate Detailed Design Specification;
- moved to the appropriate Implementation Specification;
- retained as an explicit proposal, deferred item, open question, audit finding, project-management record, or historical record;
- deliberately classified as obsolete and no longer required.

A document must not be marked retired while it remains the sole source of information that the project intends to preserve.

When these conditions are satisfied, `-retired` must be appended immediately after the version identifier as defined in Section 13.1.

### 18.5 Superseded Canonical Documents

When an active canonical or otherwise authoritative document is replaced, its successor must be explicitly identifiable.

The superseded document must no longer remain ambiguously active. It should be moved to the appropriate archive location once the successor has assumed authority.

If reconciliation is complete, the superseded document may be marked retired. If lower-level or unique information still requires migration, it must remain archived but not retired until that work is complete.

### 18.6 Archive Structure

The archive should mirror the active documentation categories where practical:

```text
docs/
└── archive/
    ├── design/
    ├── functional/
    ├── detailed_design/
    ├── implementation/
    └── project_management/
```

Additional archive categories may be introduced where a stable need exists, but the archive must not become an undifferentiated holding directory.

Archived design material belongs under `docs/archive/design/`, archived Functional Specifications under `docs/archive/functional/`, and archived project-management artefacts under `docs/archive/project_management/`.

### 18.7 Status Notices

Archived and retired documents should contain a clear status notice near the beginning of the document.

An archived document should identify at least:

- `Status: Archived`;
- that it is no longer authoritative;
- why it is retained where useful;
- its successor, if one exists.

A retired document should identify at least:

- `Status: Retired`;
- that it is no longer authoritative;
- that retained information has been dispositioned;
- its successor or replacement authority where applicable.

A suitable archived notice is:

```text
> **Status:** Archived
>
> This document is no longer part of the active specification hierarchy and is not authoritative.
> It is retained for documentation reconciliation, traceability, or historical reference.
```

A suitable retired notice is:

```text
> **Status:** Retired
>
> This document has been superseded and is no longer authoritative.
> All information that remains relevant to the project has been dispositioned within the current documentation hierarchy or explicitly retained as historical material.
```

### 18.8 References to Archived Material

Active specifications should normally reference other active authoritative documents.

References to archived or retired documents should be limited to purposes such as:

- provenance;
- reconciliation;
- migration history;
- audit evidence;
- historical traceability.

An archived or retired document must not be cited as normative authority for a current requirement or design decision.

### 18.9 Retirement Procedure

Before a document is retired, the following procedure must be completed:

1. identify the document's previous purpose and authority;
2. identify every meaningful fact, requirement, decision, constraint, example, proposal, implementation observation, and unresolved question that may retain project value;
3. eliminate duplicated information while preserving the most complete form of each unique item;
4. resolve or explicitly preserve contradictions;
5. assign each retained item to its correct destination or explicit disposition;
6. verify that no information the project intends to preserve exists solely in the document being retired;
7. identify the successor or replacement authority where applicable;
8. move the document beneath the appropriate `docs/archive/` category if it is not already archived;
9. add the `-retired` filename suffix immediately after the version identifier;
10. add or update the document status notice to state that it is retired;
11. update active cross-references so they no longer depend upon the retired document as authority.

Classification alone does not complete retirement when the classified information still needs to be transferred. A reconciliation record may identify where information belongs, but the source document must remain archived and unretired until the information intended for preservation has actually reached its destination or has otherwise been explicitly retained.

### 18.10 Git History and Archive Responsibility

Git history is the ultimate source-control record of prior document states, but it does not replace the project archive.

The archive exists to preserve intentionally accessible historical, provenance, reconciliation, and supersession context without forcing readers to reconstruct documentation lineage from repository history.

The archive should therefore retain documents when their continued accessibility provides project value, even when Git could technically recover deleted content.

---

## 19. AI-Assisted Documentation and Development

AppManager explicitly permits AI-assisted engineering, but AI-generated output must remain subordinate to the project's specification hierarchy and source-control review process.

### 19.1 Abstraction Discipline

An AI system working on project documentation should be told which specification level it is modifying.

It should not silently introduce lower-level implementation assumptions into higher-level documents.

It should not rewrite approved higher-level requirements merely because the current implementation differs.

### 19.2 Source Authority

When consolidating information, AI systems should distinguish among:

- approved specifications;
- source-code evidence;
- legacy documentation;
- implementation audits;
- proposals;
- inferred behaviour.

These sources do not have equal authority.

### 19.3 Zero Information Loss During Rationalisation

When consolidating, archiving, or retiring documents:

- preserve all unique facts, decisions, requirements, constraints, examples, and unresolved questions until they are deliberately classified;
- consolidate duplication rather than copying repeated material;
- identify contradictions explicitly;
- move information to the correct specification level;
- use archiving to remove non-authoritative material from the live tree while migration remains incomplete;
- retire obsolete or superseded material only after its continuing value has been fully accounted for.

### 19.4 AI Must Not Become the Source of Authority

An AI-generated statement is not authoritative merely because it appears detailed or plausible.

Authority comes from:

- approved project specifications;
- deliberate project decisions;
- verified implementation evidence where implementation state is relevant;
- reviewed and accepted changes.

### 19.5 AI GitHub Branch and Pull Request Workflow

When an AI system is permitted to modify the AppManager GitHub repository, it must use a reviewable branch-and-pull-request workflow by default.

The repository's default or protected integration branch, currently `master`, must be treated as an integration target rather than an AI working branch.

Unless the user explicitly authorises a specific direct integration-branch operation, an AI system must:

1. establish the current target integration branch and create a dedicated session or task branch from its current head before making repository changes;
2. make all AI-generated file changes and commits on that session or task branch;
3. use a branch name that identifies the AI workflow and the purpose of the work, normally in the form `ai/<purpose>`, for example `ai/documentation-github-workflow`;
4. keep related changes for the same coherent task on the same branch and Pull Request where practical rather than creating unnecessary branches or Pull Requests for individual edits;
5. create a new branch and Pull Request when beginning a materially separate unit of work;
6. open a Pull Request targeting the appropriate integration branch when the proposed work is ready for review;
7. describe the purpose of the change, the significant files or areas affected, material design or documentation consequences, and any validation performed in the Pull Request description;
8. leave acceptance and merging of the Pull Request to the user or to an explicitly approved project review or automation process;
9. not merge its own Pull Request unless the user explicitly instructs it to do so;
10. not force-push, rewrite shared history, or directly modify a protected or integration branch unless the user explicitly authorises that specific operation;
11. preserve the reviewability of the change by avoiding unrelated modifications, formatting churn, or incidental file rewrites on the session branch.

An explicit user instruction may override this default workflow for a specific operation, but the departure must be unambiguous. General permission to work on the repository does not constitute permission to commit directly to `master` or another protected or integration branch.

Repository branch protection or rulesets should be used where practical to reinforce this policy technically in addition to documenting it here.

---

## 20. Design and Implementation Separation

The documentation system should preserve a strong distinction between design authority and implementation observation.

Examples of Design Specification content:

- AppManager supports repository-management capabilities.
- AppManager supports TUI and Headless operation and proposes GUI operation.
- presentation modes share common application capabilities.
- source mutation should be non-destructive where practical.

Examples of Implementation Specification content:

- a particular command is currently a stub;
- a service is currently unused;
- an exact method is not yet wired into a command;
- an existing path needs migration;
- a particular library provides Git functionality.

This distinction allows implementation to evolve without making the Design Specification obsolete after every code change.

---

## 21. Documentation Quality Criteria

Before a normative document is considered complete, it should be checked for:

- correct specification level;
- consistent use of `AppManager`;
- valid naming conventions;
- duplicated requirements;
- contradictions with higher-level specifications;
- accidental implementation leakage into higher-level documents;
- ambiguous normative language;
- unresolved legacy references;
- obsolete architectural terminology;
- traceability where it is useful;
- clear lifecycle and authority status;
- coherent headings and section order;
- correct cross-references.

Before an archived document is marked retired, it must additionally be checked against the retirement procedure in Section 18.9.

---

## 22. Recommended Root Documentation Set

The intended top of the documentation hierarchy should remain small and authoritative.

Recommended root documents are:

```text
docs/
├── project-documentation-guide-v01.md
└── appmanager-design-specification-v01.md
```

The first document governs how the documentation system itself works.

The second defines what AppManager is intended to be.

All other project specifications should refine one of the responsibilities established by those two documents.

Project-management documents are intentionally maintained outside the normative specification hierarchy and therefore do not expand this authoritative root set.

Archived documents are intentionally excluded from this authoritative root set.

---

## 23. Relationship to Existing Documentation

The existing AppManager documentation contains valuable design, functional, detailed-design, implementation, audit, roadmap, and project-management information that has accumulated at different times and at different abstraction levels.

That material should be rationalised rather than discarded.

The consolidation process should:

1. identify the purpose and abstraction level of each existing document;
2. extract durable design intent;
3. move functional requirements into Functional Specifications;
4. move component and command design into Detailed Design Specifications;
5. move source-specific observations into Implementation Specifications;
6. move project planning, migration status, coordination, and handoff information into project-management documentation where appropriate;
7. preserve unresolved decisions as explicit proposals or open questions;
8. eliminate duplication after information has been safely relocated;
9. archive documents that should leave the live tree but still contain information awaiting migration or reconciliation;
10. retire documents only when their continuing information value has been fully dispositioned according to Section 18.

Structural changes should be deliberate, incremental, and justified by improved documentation responsibility rather than cosmetic reorganisation.

Moving a superseded or mixed-authority document into `docs/archive/` is an appropriate way to clean the live documentation tree without prematurely declaring its information redundant.

---

## 24. Summary of Governing Rules

The AppManager documentation system is governed by the following core rules:

1. The application is always named `AppManager` in prose and conceptual documentation.
2. Project-controlled directory names use lowercase letters, numbers, and underscores only.
3. Project-controlled filenames use lowercase letters, numbers, and hyphens only, excluding the required extension separator.
4. Other project-controlled machine identifiers use lowercase letters, numbers, and the delimiter appropriate to their defined naming convention.
5. Documentation is divided into Design, Functional, Detailed Design, and Implementation Specifications.
6. Higher-level specifications govern lower-level specifications.
7. Lower-level documents refine but do not silently redefine higher-level documents.
8. Information belongs at the highest appropriate level of abstraction.
9. Duplication should be replaced by cross-reference and traceability.
10. Design intent and current implementation state must be clearly separated.
11. TUI, Headless, and GUI interaction modes should share common application capabilities.
12. Architectural subsystems should not be forced into an artificial layer model.
13. Project-management documentation is outside the normative four-level specification hierarchy and must not establish product requirements or design authority.
14. Archived documents are outside the active specification hierarchy and are non-authoritative.
15. Archiving and retirement are distinct lifecycle operations; archiving does not imply retirement.
16. Historical documentation must not be retired until every meaningful item the project intends to preserve has been dispositioned.
17. A retired document must use the `-retired` suffix immediately after its version identifier.
18. A document must not be retired while it remains the sole source of information the project intends to preserve.
19. Superseded canonical documents must identify their successor or replacement authority.
20. Active specifications should not rely upon archived or retired documents as normative authority.
21. AI-assisted work must respect specification authority, abstraction level, evidence quality, and the archive/retirement lifecycle.
22. Normative documentation should remain stable enough to guide implementation rather than merely describe it.

---

# Appendix A - Documentation Classification Quick Reference

| Documentation Level | Primary Question | Typical Content |
|---|---|---|
| Design Specification | What system are we building? | Vision, scope, architecture, principles, major domains, interaction model |
| Functional Specification | What must it do? | Behaviour, requirements, inputs, outputs, validation, workflows |
| Detailed Design Specification | How should it work internally? | Components, commands, interfaces, algorithms, dependencies, data structures |
| Implementation Specification | How is it implemented here? | Paths, symbols, libraries, wiring, status, migrations, code-specific constraints |

Project-management documentation is intentionally excluded from this table because it is not a specification level.

# Appendix B - Naming Quick Reference

| Item | Convention | Example |
|---|---|---|
| Application name in prose | Exact canonical name | `AppManager` |
| Directory | lowercase with underscores | `license_engine/` |
| Filename | lowercase with hyphens | `project-documentation-guide-v01.md` |
| Project-controlled identifier | lowercase, normally underscores | `active_provider` |
| Normative document version | `v` plus two digits | `v01` |
| Retired document | version followed by `-retired` | `document-name-v01-retired.md` |

# Appendix C - Interaction Modes

| Mode | Role | Principle |
|---|---|---|
| TUI | Guided terminal interaction | Presentation adapter over shared capabilities |
| Headless | Automation, scripts, CI/CD | Non-interactive adapter over shared capabilities |
| GUI | Proposed graphical interaction | Graphical adapter over shared capabilities |

# Appendix D - Documentation Lifecycle Quick Reference

| State | Location | Authoritative | Filename treatment | Meaning |
|---|---|---|---|---|
| Active | Live documentation tree | According to hierarchy | Normal versioned filename | Current project documentation |
| Archived | `docs/archive/` | No | Existing filename retained | Removed from live tree; information may still require migration or may be retained for history |
| Retired | `docs/archive/` | No | Append `-retired` after version | Information-disposition process complete; document permanently superseded or obsolete |
