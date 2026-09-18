# AppManager Project Documentation Guide

## 1. Purpose

This document defines the documentation architecture, writing conventions, naming conventions, specification hierarchy, traceability rules, decision-governance rules, and maintenance principles for the AppManager project.

It is the highest-level documentation authority within the `docs/` tree.

All AppManager project documentation should conform to this guide unless a later approved version explicitly supersedes it.

The purpose of this guide is to ensure that project documentation remains:

- coherent across different levels of abstraction;
- precise about intent, behaviour, design, and implementation;
- resistant to duplication and contradiction;
- maintainable as the codebase evolves;
- suitable for both human and AI-assisted development;
- traceable from high-level system intent and significant engineering decisions through to concrete implementation;
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

Significant engineering decisions may additionally require an Architecture Decision Record as defined by this guide and [Architecture Decision Governance](project_management/decisions/architecture-decision-governance-v01.md). Architecture Decision Records preserve decision rationale and provenance but do not replace the normative specification hierarchy.

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

### 4.1 Architecture Decision Governance

Architecture Decision Records, or ADRs, are governed decision-provenance records that operate alongside the four-level specification hierarchy.

They are **not a fifth specification level**.

The governing distinction is:

> An ADR records why a significant decision was made; the specification hierarchy records what the approved system requires as a consequence.

A proposal, investigation, architecture review, Issue, Discussion, Pull Request, experiment, AI conversation, or project-management document may provide evidence or analysis, but none of those sources alone establishes an architectural decision.

Where a decision is sufficiently significant to require an ADR, the normal path is:

```text
proposal / open question
        |
        v
investigation or architecture review
        |
        v
proposed decision
        |
        v
proposed ADR
        |
        v
review and approval
        |
        v
accepted ADR
        |
        v
update affected authoritative specification(s)
        |
        v
detailed design and implementation
```

A decision becomes durable when it is deliberately approved, recorded in an ADR where required, and incorporated into the authoritative specification level or levels affected by the decision.

The detailed ADR lifecycle, required structure, acceptance, supersession, retention, and technology-selection rules are defined by [Architecture Decision Governance](project_management/decisions/architecture-decision-governance-v01.md) under the authority of this guide.

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

### 5.6 Enduring Target-System Test

The root Design Specification must describe the enduring target system rather than the journey from the current or legacy implementation to that target.

A proposed statement belongs in the root Design Specification only when it describes enduring target-system architecture, intent, constraints, principles, or relationships and remains useful and true after the current implementation and any migration required to reach the target architecture have ceased to matter.

The governing test is:

> Would this statement remain useful and true after the current implementation and any migration required to reach the target architecture have ceased to matter?

If the answer is no, the statement does not belong in the root Design Specification. It should instead be placed at the Functional, Detailed Design, Implementation, ADR, or project-management level according to its actual responsibility.

The root Design Specification must therefore not describe migration sequencing, transitional architecture, temporary compatibility arrangements, file-by-file conversion, current-language replacement steps, or other reduction-to-practice detail merely because those matters are necessary to reach the target design.

A technology, runtime, protocol family, subsystem boundary, or other concrete choice may be named in the Design Specification when an accepted decision makes that choice an enduring architectural characteristic or constraint of the target system. The Design Specification should state the resulting architectural consequence, not the historical migration path or implementation mechanics that produced it.

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

### 7.5 Permanent Design Versus Migration Design

A Detailed Design Specification should describe the permanent technical design by which AppManager realises approved Functional and Design requirements.

Migration concerns may legitimately influence Detailed Design when safe transformation to the target architecture imposes a durable design constraint. Examples include preserving a stable subsystem boundary, requiring compatibility at a contract seam, or ensuring that an independently replaceable capability remains isolated.

However, transient migration execution does not become permanent Detailed Design merely because architectural work depends upon it.

The following normally belong below or outside Detailed Design:

- file-by-file or component-by-component conversion order;
- temporary shims that exist only during migration;
- transitional source locations;
- temporary build arrangements;
- implementation work packages;
- milestone sequencing;
- migration progress and status;
- temporary compatibility steps that cease to matter once the target design is established.

Where such information is necessary, the permanent technical constraint should be captured in Detailed Design, while the concrete reduction to practice belongs in Implementation Specifications and transient sequencing, coordination, and progress belong in project-management documentation.

### 7.6 Stable Detailed Design Identification

Every primary normative Detailed Design Specification must have a stable hierarchical identifier of the form:

```text
DD-<family>.<item>
```

Examples include:

```text
DD-1.1
DD-1.3
DD-2.10
DD-3.1
```

The family number identifies the approved Detailed Design family or workstream and the item number identifies the normative document within that family.

`DD-1`, `DD-2`, `DD-3`, `DD-4`, and future equivalent families are **not additional specification levels**. They are subdivisions of **Level 3 — Detailed Design Specification** and do not create an authority hierarchy between one Detailed Design family and another. Authority continues to derive from responsibility ownership and the governing Design/Functional specifications, not from the numerical family value.

The stable Detailed Design identifier must appear in:

- the document H1 title;
- document metadata near the beginning of the document;
- the filename in filesystem-safe form;
- dependency and traceability references where the document is cited;
- project-management indexes or decomposition plans that enumerate Detailed Design work.

Because project-controlled filenames use hyphens and reserve the period for the file-extension separator, the canonical identifier `DD-1.3` is encoded in a filename as `dd-1-3`.

For example:

```text
dd-1-3-managed-project-detailed-design-v01.md
dd-2-10-nuxt-capability-detailed-design-v01.md
dd-3-1-app-domain-detailed-design-v01.md
```

A primary Detailed Design identifier must remain stable for the lifetime of that design responsibility. A later document version retains the same Detailed Design identifier and changes only its normal document-version suffix unless the responsibility itself is deliberately replaced or re-decomposed.

Detailed Design clarifications, reconciliation notes, conformance records, and other supporting documents must not acquire fictitious primary identifiers merely to fit the numbering scheme. A normative clarification should instead identify its document type and explicitly state which Detailed Design identifiers or contracts it clarifies.

### 7.7 Detailed Design Families and Self-Documenting Directories

Active primary Detailed Design Specifications must be grouped into concise, self-documenting top-level directories beneath `docs/` whose names identify the Detailed Design family and its semantic responsibility.

The approved Version 1 family structure is:

```text
docs/dd_1_application_core/
docs/dd_2_shared_capabilities/
docs/dd_3_high_coupling_domains/
docs/dd_4_policy_and_resource_domains/
```

The `dd_` prefix is the canonical directory abbreviation for **Detailed Design**. It is intentionally aligned with the established `DD-<family>.<item>` identifier scheme while avoiding unnecessarily long directory names.

The family number is retained in the directory name so that repository order and the stable Detailed Design identifier scheme remain visibly aligned. The semantic suffix keeps each family understandable without requiring the number alone to carry meaning.

Primary active Detailed Design Specifications should not be placed together in one undifferentiated `docs/detailed_design/` directory once the structured migration is complete. A generic container that requires readers to know the historical drafting sequence is insufficiently self-documenting for the active normative design set.

Supporting clarification documents may be grouped beneath a `clarifications/` subdirectory of the Detailed Design family they principally clarify where that improves navigation. Such placement does not alter their authority or create a new specification level.

Example:

```text
docs/
├── dd_1_application_core/
│   ├── dd-1-1-application-invocation-detailed-design-v01.md
│   ├── dd-1-2-execution-outcomes-detailed-design-v01.md
│   ├── dd-1-3-managed-project-detailed-design-v01.md
│   ├── dd-1-4-configuration-resolution-detailed-design-v01.md
│   ├── dd-1-5-application-engine-detailed-design-v01.md
│   └── clarifications/
├── dd_2_shared_capabilities/
├── dd_3_high_coupling_domains/
└── dd_4_policy_and_resource_domains/
```

The Detailed Design decomposition plan is the canonical project-management register for the assignment of individual documents to family/item identifiers. Filesystem order, alphabetical order, implementation structure, or current source topology must not be used to infer or silently renumber those identifiers.

### 7.8 Detailed Design Document Identity Header

A primary Detailed Design Specification must make its position in the design set immediately visible to a reader who arrives at the file directly through GitHub, search, VitePress, a copied link, or an AI retrieval system.

The preferred opening form is:

```markdown
# DD-3.1 — AppManager App Domain Detailed Design

> **Detailed Design ID:** DD-3.1
>
> **Design family:** DD-3 — High-Coupling Domains
>
> **Status:** Version 1 Detailed Design Specification
```

Additional authority, governing-source, related-design, or planning metadata may follow.

A clarification should instead use explicit clarification metadata, for example:

```markdown
> **Document type:** Detailed Design clarification
>
> **Clarifies:** DD-1.3, DD-1.4, DD-1.5
```

The identity header communicates classification and navigation; it does not replace the document's substantive authority statement.

### 7.9 Navigable Cross-References

References to other repository documentation should use repository-relative Markdown links where practical so that the active documentation set is navigable directly on GitHub and remains usable in local Markdown renderers, VitePress, forks, and non-default branches.

A bare code-formatted pathname may still be used where the literal path itself is the subject of discussion, but it should not be the default form for a dependency or governing-authority reference.

Prefer:

```markdown
[DD-1.5 — Application Engine](../dd_1_application_core/dd-1-5-application-engine-detailed-design-v01.md)
```

rather than:

```markdown
`docs/detailed_design/application-engine-detailed-design-v01.md`
```

Dependency and traceability tables should normally use a linked human-readable document label together with the stable document or requirement identifier.

Repository-relative links are preferred over hard-coded absolute `github.com` URLs for documents in the same repository because relative links remain valid across repository forks, branches, local checkouts, and repository renames where the relative structure is preserved.

Absolute URLs remain appropriate for external sources, cross-repository references, or destinations whose identity is inherently external to the AppManager repository.

---

### 7.10 Detailed Design reading conventions {#detailed-design-reading-conventions}

Item numbering and authoring order, like family numbering, confer no superior authority on a sibling Detailed Design. A specification constrains consumption of its own assigned contract; shared rules derive from their governing Design/Functional owner or the independently owned contract actually consumed. References and concise local bindings identify inherited obligations; local preconditions, models, state distinctions, policies, workflows, safety, failure and recovery refinements remain with their semantic owner.

A generic delegation diagram is explanatory unless a requirement makes a represented relationship normative. Diagrams expressing local ordering, state, safety or evidence refinements must preserve those refinements during editorial reduction.

Historical implementation observations in Detailed Designs are non-normative provenance unless a separate Detailed Design requirement establishes the permanent constraint. Concrete implementation disposition belongs to the corresponding Implementation Specification, subject to upstream conformance; a historical observation cannot override that specification or become a source of product architecture. This does not make Implementation Specifications authority over Detailed Design.

## 8. Level 4 - Implementation Specification

### 8.1 Purpose

The Implementation Specification defines the concrete reduction of approved Detailed Design into the AppManager codebase, build, runtime, and repository artefacts, and may also record the current implementation state where that state is relevant to implementation work.

This is intentionally implementation-specific.

### 8.2 Primary Question

> How does the approved Detailed Design map to concrete code, build, runtime, and repository artefacts, and what is the current implementation state where that matters?

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
- build tasks and concrete build wiring;
- concrete entry points;
- serialisation and transport bindings;
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

Implementation Specifications may therefore be both **prescriptive**, by defining the concrete implementation required to realise approved Detailed Design, and **descriptive**, by recording relevant current implementation state, deviations, migration obligations, or implementation evidence.

### 8.4 Reduction to Practice and Migration Execution

Implementation Specifications own the concrete reduction of approved design into the repository and runtime environment.

Where a migration is required, Implementation Specifications may define the implementation-specific mechanics necessary to move from the current codebase to the approved Detailed Design, including concrete modules, source paths, build changes, compatibility wiring, replacement steps, tests, and retirement of superseded implementation structures.

Implementation Specifications should distinguish permanent implementation requirements from temporary migration mechanics where that distinction affects maintenance or traceability.

Project-management documentation remains the appropriate location for execution order, workstream coordination, milestone planning, progress tracking, handoff state, and other transient management information associated with the migration.

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

Where a significant architectural decision explains why a specification took a particular direction, traceability may additionally include the decision evidence and ADR:

```text
architecture review / evidence
            |
            v
           ADR
            |
            v
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
            |
            v
           code
```

Not every stage is required for every requirement or decision.

Traceability may be expressed through document references, requirement identifiers, ADR identifiers, Detailed Design identifiers, component names, command identifiers, or structured cross-reference tables.

Specifications should reference the relevant ADR where the rationale would otherwise be difficult to discover, and ADRs must identify the specifications materially affected by the decision.

Cross-document traceability should use navigable repository-relative Markdown links as defined in Section 7.9 where the referenced document resides in the same repository.

Traceability should be introduced where it provides engineering value and should not become bureaucratic overhead.

---

## 10. Interaction Modes and Invocation Boundary

AppManager is designed to support multiple presentation modes, invocation modes, and host-tool integrations over the same authoritative application semantics.

The recognised interaction architecture is conceptually:

```text
          interaction modes and host integrations

       tui      headless      gui      ide / tools
        |          |           |           |
        +----------+-----------+-----------+
                   |
                   v
          interaction adapters
                   |
          optional transport binding
                   |
                   v
       Application Invocation Contract
                   |
                   v
           Application Engine
                   |
                   v
            command / use cases
                   |
                   v
     application capability coordination
                   |
          +--------+--------+
          |                 |
          v                 v
 AppManager-owned       capability
   capabilities         boundaries
                            |
                            v
                    capability providers
```

The **Application Engine** is the authoritative application boundary. It owns or governs command and use-case semantics, application policy, workflow coordination, managed-scope interpretation, safety constraints, interpretation of delegated capability results, and final application-level outcomes. Delegating specialist execution through a service, subsystem, domain engine, code-intelligence mechanism, capability boundary, provider, or external tool does not delegate that application authority.

An adapter that operates in-process may invoke the Application Invocation Contract directly. An out-of-process integration may use an appropriate transport or protocol binding that preserves the same invocation semantics. Neither arrangement implies a required process, package, runtime, or deployment topology at the Design level.

The Design Specification defines the architectural roles of the Application Invocation Contract, Application Engine, application capabilities, capability boundaries, and providers. Functional Specifications define required invocation and application behaviour. Detailed Design Specifications define concrete contracts, lifecycle, dependency direction, versioning, events, cancellation, capability discovery, error propagation, provider interaction, or related permanent internal design. Implementation Specifications record exact transports, serialisation formats, modules, packages, libraries, entry points, and wiring.

Headless operation and the Application Invocation Contract are distinct concepts. Headless describes non-interactive operation; the invocation contract defines the structured semantic boundary through which adapters or external integrations invoke AppManager capabilities.

### 10.1 Text User Interface

The TUI provides guided, interactive terminal operation.

### 10.2 Headless Mode

Headless mode provides non-interactive operation for:

- automation;
- scripts;
- CI/CD;
- repeatable command execution;
- machine-controlled workflows.

Headless workflows must not unexpectedly depend upon interactive prompting. Machine-facing structured invocation may be exposed through a transport binding to the Application Invocation Contract rather than by requiring external tools to parse human-oriented terminal output.

### 10.3 Graphical User Interface

The GUI is a proposed first-class interaction mode providing graphical access to AppManager capabilities.

Its introduction must not require duplication of underlying application logic.

### 10.4 IDE and Host-Tool Integrations

AppManager may support integrations with IDEs, editors, CI/CD systems, AI agents, project-management tools, and other host applications.

Such integrations should act as thin adapters over the shared Application Invocation Contract and Application Engine. Host-specific context, navigation, presentation, and lifecycle integration may belong in the adapter, but command semantics, workflow policy, safety rules, managed-scope interpretation, and application outcome authority must not be reimplemented independently merely because the host provides a richer interface.

A WebStorm plugin is the first proposed IDE integration. Its consideration does not make JetBrains products a mandatory dependency of the AppManager architecture or prevent future integrations with other IDEs or tools.

### 10.5 Presentation and Integration Independence

A core architectural principle is:

> Commands and application capabilities must not inherently depend upon a particular presentation mode or host integration.

TUI, Headless, GUI, IDE, and other integration adapters should invoke the shared Application Invocation Contract and Application Engine rather than becoming independent implementations of AppManager domain behaviour.

Application semantics and authority should therefore reside below the interaction boundary wherever practical.

---

## 11. Architectural Terminology

AppManager architecture must be described according to the architectural role and relationship of its constituent concerns rather than by treating component families as equivalent architectural layers.

Architectural concerns may include, but are not limited to:

- the Application Engine as the authoritative application boundary;
- the Application Invocation Contract;
- commands and use cases;
- application capabilities;
- capability boundaries and capability providers;
- services;
- scanners and source-recognition mechanisms;
- transformation strategies and bounded transformation plans;
- transformation mechanisms and source-level validation;
- templates and generation capabilities;
- orchestrators;
- resolvers;
- domain engines, including specialised concerns such as licensing where justified;
- registries;
- configuration infrastructure;
- code-intelligence components;
- presentation, interaction, and host-integration adapters.

Earlier material may refer specifically to a `License Engine`, `Template Engine`, or `command layer`. Those terms remain useful historical or specialised concepts where their meaning is precise, but they must not imply that all such concerns are equivalent architectural tiers or that a rigid layered stack is required.

These concerns may represent different kinds of architectural constructs and must not be assumed to occupy equivalent positions within a layered architecture.

Preferred terminology therefore includes:

- Application Engine;
- Application Invocation Contract;
- application capability;
- capability boundary;
- capability provider;
- architectural subsystem;
- component family;
- application subsystem;
- processing stage;
- command or use-case model;
- presentation adapter;
- integration adapter;
- transport binding;
- domain engine.

The term `layer` should be used only where a genuine layered relationship exists or where it refers specifically to a Nuxt layer.

---

## 12. Documentation Structure

The `docs/` tree should reflect specification responsibility rather than historical generation order.

Directory names should make the documentation level and, where a specification level contains stable families, the family responsibility understandable without requiring knowledge of conversation history or project shorthand.

The target active documentation structure is:

```text
docs/
├── project-documentation-guide-v01.md
├── appmanager-design-specification-v01.md
├── design/
├── functional/
├── dd_1_application_core/
├── dd_2_shared_capabilities/
├── dd_3_high_coupling_domains/
├── dd_4_policy_and_resource_domains/
├── implementation/
├── project_management/
│   └── decisions/
└── archive/
```

The four principal specification levels remain Design, Functional, Detailed Design, and Implementation. The four `dd_*` directories above are separate **families within Level 3**, not additional specification levels.

The use of separate concise Detailed Design family directories is deliberate. The `dd_` prefix carries the specification-level identity, while the family number and semantic suffix make the responsibility visible without imposing excessively long paths.

The active normative Detailed Design set should therefore migrate away from an undifferentiated `docs/detailed_design/` directory. The migration must preserve content, stable Detailed Design identifiers, history where practical, and all active cross-references.

The `project_management/` directory contains project planning, coordination, migration planning and sequencing, migration status, rationalisation, status, handoff, release-planning, architecture investigations and reviews, decision governance, and similar management artefacts. It is outside the normative Design → Functional → Detailed Design → Implementation specification hierarchy. Material recorded there may report on, coordinate, investigate, or reference specification work, but it must not establish product requirements or design authority unless that information is deliberately approved and incorporated into the appropriate authoritative specification.

The `project_management/decisions/` directory contains Architecture Decision Record governance, the ADR template, and durable ADRs. ADRs remain governed decision-provenance records rather than project-management status records; their placement beneath `project_management/` reflects governance and repository organisation, not reduced architectural significance and not inclusion in the normative four-level specification hierarchy.

Temporary migration states, workstream order, milestone sequencing, component-by-component conversion plans, progress, and handoff information belong in project-management documentation unless a permanent system requirement or design constraint is identified and deliberately incorporated into the appropriate normative specification.

The `archive/` tree, when present, is outside the active specification hierarchy. Documents beneath it are non-authoritative regardless of their previous status. Archived decision material may preserve ADR identifiers and provenance where required by the ADR governance rules.

This tree is a target documentation model rather than an instruction to move documents without reconciliation. Structural migrations must be deliberate and must update links and references atomically enough to avoid leaving the active documentation set misleading or unnavigable.

Existing documentation should be rationalised incrementally to avoid information loss.

Within a Detailed Design family directory, subordinate directories should be introduced only for stable document classes that improve navigation, such as `clarifications/`. They should not recreate implementation-shaped directory trees based on services, classes, current source packages, or other topology that belongs below Detailed Design.

Example:

```text
docs/
├── dd_1_application_core/
│   ├── dd-1-1-application-invocation-detailed-design-v01.md
│   ├── dd-1-2-execution-outcomes-detailed-design-v01.md
│   ├── dd-1-3-managed-project-detailed-design-v01.md
│   ├── dd-1-4-configuration-resolution-detailed-design-v01.md
│   ├── dd-1-5-application-engine-detailed-design-v01.md
│   └── clarifications/
├── dd_2_shared_capabilities/
├── dd_3_high_coupling_domains/
└── dd_4_policy_and_resource_domains/
```

The final directory structure should evolve from the current documentation tree through focused, reviewable migrations rather than unreviewed bulk movement.

### 12.1 Repository Documentation and Collaboration Surfaces

AppManager documentation governance extends beyond the `docs/` tree where repository-level documents or collaboration facilities communicate project information, development procedures, contribution requirements, project status, or project decisions.

Repository-level documentation and GitHub collaboration facilities must have clearly defined responsibilities and must not become alternative sources of specification or decision authority.

The governing principle is:

> Repository collaboration and project-management surfaces may propose, discuss, investigate, coordinate, track, summarise, or provide provenance for project work, but approved requirements, architectural decisions, functional behaviour, detailed design, and implementation requirements must be incorporated into the appropriate durable AppManager documentation.

For a significant architectural decision, durable documentation normally means both the appropriate ADR and the affected authoritative specification or specifications. The ADR records why the decision was made; the specification records the normative consequence.

Repository-root documentation may include, where a defined project need exists:

- `README.md` as the primary repository entry point, providing project orientation, concise status, basic usage or getting-started information, and navigation to authoritative documentation;
- `CONTRIBUTING.md` for contributor-facing development, review, testing, documentation, and change-proposal procedures;
- `SECURITY.md` for vulnerability-reporting, security-contact, or responsible-disclosure procedures;
- `CODE_OF_CONDUCT.md` for formal community-participation standards.

These repository-root documents are governed by this guide where applicable but sit outside the Design → Functional → Detailed Design → Implementation specification hierarchy. They must reference authoritative specifications where necessary rather than independently redefining or duplicating them. Their identification here does not require every listed document to exist before a concrete project need arises.

GitHub collaboration facilities may be used according to the following authority boundaries:

- **Issues** may track defects, enhancements, investigations, documentation work, implementation tasks, proposals, ADR work, and specification changes. An Issue is a work-tracking and discussion artefact, not an authoritative specification or accepted architectural decision. Resolution or closure of an Issue does not replace updating affected durable documentation.
- **Projects** may support planning, prioritisation, scheduling, coordination, and progress tracking. Project items are project-management information and do not establish specification or decision authority.
- **Discussions**, if enabled, may support exploratory discussion, questions, proposals, and community consultation. A Discussion may inform a project decision but does not itself establish an authoritative requirement or accepted architectural decision.
- **Wiki** content, if enabled, must not be used as an alternative location for authoritative AppManager specifications or required decision records. It may contain supplementary, explanatory, or community-oriented material where justified, but information required to specify, develop, test, maintain, or govern AppManager must not depend solely upon Wiki content.
- **Gists** may be used for non-authoritative supplementary material such as temporary examples, experiments, demonstrations, or independently useful snippets. A Gist must not be the sole repository of information required to specify, build, operate, test, maintain, or govern AppManager.

Pull Request and AI-assisted repository workflows are governed separately by Section 19. Discussion, review, provenance, or decisions recorded only in a Pull Request must not substitute for durable project documentation when that information is required for the continuing specification, development, maintenance, or governance of AppManager.

Durable project knowledge should be preserved in appropriate version-controlled repository files. Project knowledge required for continuing work must not depend solely upon Issues, Projects, Discussions, Wiki pages, Gists, Pull Request discussions, commit messages, AI conversation history, or other transient or externally maintained discussion records.

These sources may provide valuable context, provenance, discussion, evidence, and project history. When information from them becomes an approved requirement, accepted architectural decision, implementation requirement, governance rule, or otherwise necessary durable project knowledge, it must be incorporated into the appropriate repository-controlled document.

### 12.2 Architecture Decision Records

Active ADRs reside under:

```text
docs/project_management/decisions/
```

The governance document is:

```text
docs/project_management/decisions/architecture-decision-governance-v01.md
```

New ADRs should use:

```text
docs/project_management/decisions/adr-template.md
```

The detailed ADR rules are delegated to the governance document, but this guide establishes the following higher-order constraints:

- ADRs are not a fifth specification level;
- accepted ADRs must not become the sole normative source for required system behaviour or architecture;
- significant project-wide technology and platform choices must be deliberate rather than inherited automatically from historical implementation or developer familiarity;
- architecture investigations and reviews are evidence, not decision authority;
- accepted ADRs preserve historical decision rationale and should be superseded rather than rewritten when the architectural decision changes materially;
- ADR identifiers must remain durable and must not be reused;
- ADR decisions must be traceable to the specifications they materially affect.

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

### 13.2 Architecture Decision Record Filenames

ADRs use a stable sequential identifier and descriptive slug rather than the ordinary normative-document version suffix:

```text
adr-0001-primary-application-runtime.md
adr-0002-example-decision.md
```

ADR numbers must never be reused, including after rejection or supersession.

The ADR identifier is the durable identity of the decision record. Renaming an accepted ADR should be avoided unless necessary to correct a misleading title.

### 13.3 Detailed Design Specification Filenames

Primary Detailed Design Specification filenames must begin with the filesystem-safe encoding of their stable Detailed Design identifier:

```text
dd-<family>-<item>-<descriptive-subject>-detailed-design-v<version>.md
```

Examples:

```text
dd-1-3-managed-project-detailed-design-v01.md
dd-2-4-source-intelligence-detailed-design-v01.md
dd-3-1-app-domain-detailed-design-v01.md
```

The filename prefix `dd-1-3` corresponds exactly to the canonical document identifier `DD-1.3` while remaining compliant with the project filename rule that uses hyphens rather than additional periods.

Clarification and other supporting Detailed Design documents need not use a primary `dd-<family>-<item>` filename prefix unless they themselves have been deliberately assigned a primary Detailed Design identifier by the authoritative decomposition plan.

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

ADRs use sequential decision identifiers rather than ordinary document-version succession. A materially changed accepted architectural decision must normally be represented by a new ADR that supersedes or modifies the earlier ADR instead of rewriting the historical decision to appear current.

A new version of a primary Detailed Design Specification retains its stable `DD-<family>.<item>` identifier unless the design responsibility itself has been deliberately re-decomposed through the documentation-governance process.

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

ADR status terms such as `Proposed`, `Accepted`, `Rejected`, `Deprecated`, and `Superseded` have the specific meanings defined in the architecture-decision governance document and should not be used ambiguously when referring to ADR lifecycle state.

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

Where decision governance applies, documents and discussions should also distinguish among:

- evidence;
- inference;
- proposal;
- recommendation;
- accepted decision;
- normative specification consequence.

A Design Specification should primarily describe intended design.

An Implementation Specification may prescribe the concrete implementation required by approved design and may also describe actual current state, implementation gaps, deviations, and migration obligations where relevant.

An ADR records the decision and rationale but must not substitute for the specification update that makes the consequence normative.

---

## 16. Avoiding Duplication

The project must avoid parallel specifications that independently describe the same responsibility.

Where information belongs to another document:

- reference it;
- summarise only the minimum context necessary;
- do not reproduce its full detail.

For example, the root Design Specification may identify the Git command domain and its purpose, but individual Git command behaviour belongs in the Functional Specification and command-level Detailed Design Specifications.

Likewise, the Detailed Design Specification may define a service interface, while the Implementation Specification records the exact module path and concrete implementation.

Architecture reviews and ADRs should follow the same principle. A review may contain detailed comparative analysis; the ADR should preserve the decision, decisive rationale, consequences, and references rather than copying the entire research report. The affected specification should contain the approved normative consequence rather than reproducing the complete ADR rationale.

Where the referenced document is part of the same repository, use a repository-relative Markdown link as defined in Section 7.9 rather than duplicating content or relying on an unlinked bare filename.

---

## 17. Conflict Resolution

When documentation sources disagree:

1. identify the abstraction level and document type of each source;
2. determine which document has authority for the disputed subject;
3. preserve all meaningful information during investigation;
4. explicitly record unresolved contradictions;
5. resolve the contradiction in the authoritative document;
6. update any affected ADR status, successor relationship, or specification reference where a significant architectural decision changes;
7. update, archive, or retire conflicting lower-authority documents as appropriate;
8. do not silently discard unique design information.

An ADR must not silently override a conflicting higher-authority specification. If an accepted decision requires a specification change, that change must be made deliberately. Where the ADR and specification cannot be updated atomically, the discrepancy must be explicit and short-lived.

During consolidation, historical documents must not be retired until their unique information has been accounted for. Documents may be archived before this point so that they no longer create ambiguity in the active documentation tree.

---

## 18. Documentation Lifecycle, Archiving, and Retirement

The documentation lifecycle must distinguish document authority from document retention.

A document's filesystem location and lifecycle status are related but are not interchangeable. In particular, moving a document into `docs/archive/` removes it from the active authoritative tree but does not by itself mean that its information has been fully migrated or that the document qualifies as retired.

### 18.1 Lifecycle States

The principal lifecycle states for ordinary project documents are:

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

Architecture Decision Records use their own status model under [Architecture Decision Governance](project_management/decisions/architecture-decision-governance-v01.md) because Accepted, Rejected, Deprecated, and Superseded ADRs may remain valuable as durable architectural history.

Archiving may also be applied directly to non-normative historical, audit, roadmap, reconciliation, investigation, or project-management material when it is intentionally removed from the live documentation tree.

### 18.2 Active

An active document resides in the live documentation hierarchy and may carry normative authority according to its specification level and relationship to other active documents.

A document that remains authoritative must not be placed beneath `docs/archive/`.

An accepted ADR may remain active as decision provenance while the normative consequence resides in an authoritative specification.

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
- retained as an explicit ADR, proposal, deferred item, open question, audit finding, project-management record, or historical record;
- deliberately classified as obsolete and no longer required.

A document must not be marked retired while it remains the sole source of information that the project intends to preserve.

When these conditions are satisfied, `-retired` must be appended immediately after the version identifier as defined in Section 13.1.

ADRs are not automatically retired merely because they are Rejected or Superseded. Their retention is governed separately because the rationale and successor relationship may retain durable architectural value.

### 18.5 Superseded Canonical Documents

When an active canonical or otherwise authoritative document is replaced, its successor must be explicitly identifiable.

The superseded document must no longer remain ambiguously active. It should be moved to the appropriate archive location once the successor has assumed authority.

If reconciliation is complete, the superseded document may be marked retired. If lower-level or unique information still requires migration, it must remain archived but not retired until that work is complete.

### 18.6 Archive Structure

The archive should mirror active documentation responsibilities where practical without recreating ambiguity.

For Detailed Design, archived documents should retain enough family information in their archive path or filename to preserve the meaning of their stable Detailed Design identifiers.

An illustrative archive structure is:

```text
docs/
└── archive/
    ├── design/
    ├── functional/
    ├── dd_1_application_core/
    ├── dd_2_shared_capabilities/
    ├── dd_3_high_coupling_domains/
    ├── dd_4_policy_and_resource_domains/
    ├── implementation/
    └── project_management/
        └── decisions/
```

Additional archive categories may be introduced where a stable need exists, but the archive must not become an undifferentiated holding directory.

Archived design material belongs under `docs/archive/design/`, archived Functional Specifications under `docs/archive/functional/`, and archived project-management artefacts under `docs/archive/project_management/`.

If ADRs are archived in future, `docs/archive/project_management/decisions/` should preserve their identifiers, status, successor relationships, and traceability. Decision history must not be deleted merely because a newer decision exists.

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

ADRs use the status and successor metadata defined by the ADR governance rules rather than the ordinary archived/retired notice as their primary decision status.

### 18.8 References to Archived Material

Active specifications should normally reference other active authoritative documents.

References to archived or retired documents should be limited to purposes such as:

- provenance;
- reconciliation;
- migration history;
- audit evidence;
- historical traceability.

An archived or retired document must not be cited as normative authority for a current requirement or design decision.

Superseded or rejected ADRs may be cited for historical rationale or provenance but must not be cited as current normative authority.

### 18.9 Retirement Procedure

Before a document is retired, the following procedure must be completed:

1. identify the document's previous purpose and authority;
2. identify every meaningful fact, requirement, decision, constraint, example, proposal, implementation observation, and unresolved question that may retain project value;
3. eliminate duplicated information while preserving the most complete form of each unique item;
4. resolve or explicitly preserve contradictions;
5. assign each retained item to its correct destination or explicit disposition, including an ADR where decision rationale warrants durable retention;
6. verify that no information the project intends to preserve exists solely in the document being retired;
7. identify the successor or replacement authority where applicable;
8. move the document beneath the appropriate `docs/archive/` category if it is not already archived;
9. add the `-retired` filename suffix immediately after the version identifier;
10. add or update the document status notice to state that it is retired;
11. update active cross-references so they no longer depend upon the retired document as authority.

Classification alone does not complete retirement when the classified information still needs to be transferred. A reconciliation record may identify where information belongs, but the source document must remain archived and unretired until the information intended for preservation has actually reached its destination or has otherwise been explicitly retained.

### 18.10 Git History and Archive Responsibility

Git history is the ultimate source-control record of prior document states, but it does not replace the project archive or ADR history.

The archive exists to preserve intentionally accessible historical, provenance, reconciliation, and supersession context without forcing readers to reconstruct documentation lineage from repository history.

The archive should therefore retain documents when their continued accessibility provides project value, even when Git could technically recover deleted content.

---

## 19. AI-Assisted Documentation and Development

AppManager explicitly permits AI-assisted engineering, but AI-generated output must remain subordinate to the project's specification hierarchy, decision-governance process, and source-control review process.

### 19.1 Abstraction Discipline

An AI system working on project documentation should be told which specification level or governed document type it is modifying.

It should not silently introduce lower-level implementation assumptions into higher-level documents.

It should not rewrite approved higher-level requirements merely because the current implementation differs.

It should not treat a recommendation, architecture review, or draft ADR as an accepted decision unless the project has deliberately approved it.

When modifying the root Design Specification, an AI system must apply the enduring target-system test in Section 5.6 and exclude migration journey, transitional implementation state, and reduction-to-practice detail unless the information expresses a permanent target-system architectural constraint.

When modifying Detailed Design, an AI system must distinguish permanent internal design from transient migration execution. Permanent constraints required to support safe migration may be designed there, but temporary sequencing, component conversion order, progress, and transitional work arrangements must be placed at the Implementation Specification or project-management level as appropriate.

An AI system modifying a primary Detailed Design Specification must preserve the stable `DD-<family>.<item>` identity, the owning Detailed Design family, and the self-documenting directory/filename conventions defined by Sections 7.6–7.9 and 13.3.

### 19.2 Source Authority

When consolidating information, AI systems should distinguish among:

- approved specifications;
- accepted ADRs;
- architecture reviews and investigations;
- source-code evidence;
- legacy documentation;
- implementation audits;
- proposals;
- inferred behaviour.

These sources do not have equal authority.

An accepted ADR records an approved decision and rationale, but the normative system consequence must still reside in the appropriate authoritative specification. Architecture reviews and investigations are evidence and analysis, not decision authority.

### 19.3 Zero Information Loss During Rationalisation

When consolidating, archiving, retiring, or converting material into ADRs and specifications:

- preserve all unique facts, decisions, requirements, constraints, examples, alternatives, rationale, and unresolved questions until they are deliberately classified;
- consolidate duplication rather than copying repeated material;
- identify contradictions explicitly;
- move information to the correct specification or governance level;
- preserve decision rationale in an ADR where required rather than discarding the alternatives and reasoning after updating a specification;
- use archiving to remove non-authoritative material from the live tree while migration remains incomplete;
- retire obsolete or superseded material only after its continuing value has been fully accounted for.

### 19.4 AI Must Not Become the Source of Authority

An AI-generated statement, recommendation, architecture comparison, or ADR draft is not authoritative merely because it appears detailed or plausible.

Authority comes from:

- approved project specifications;
- deliberate project decisions recorded through the applicable governance process;
- accepted ADRs as decision provenance where required;
- verified implementation evidence where implementation state is relevant;
- reviewed and accepted changes.

AI systems may assist with investigation, comparison, drafting, challenge, synthesis, and traceability, but project approval remains distinct from AI recommendation.

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
7. describe the purpose of the change, the significant files or areas affected, material design, decision-governance, or documentation consequences, and any validation performed in the Pull Request description;
8. leave acceptance and merging of the Pull Request to the user or to an explicitly approved project review or automation process;
9. not merge its own Pull Request unless the user explicitly instructs it to do so;
10. not force-push, rewrite shared history, or directly modify a protected or integration branch unless the user explicitly authorises that specific operation;
11. preserve the reviewability of the change by avoiding unrelated modifications, formatting churn, or incidental file rewrites on the session branch.

An explicit user instruction may override this default workflow for a specific operation, but the departure must be unambiguous. General permission to work on the repository does not constitute permission to commit directly to `master` or another protected or integration branch.

Repository branch protection or rulesets should be used where practical to reinforce this policy technically in addition to documenting it here.

---

## 20. Design and Implementation Separation

The documentation system should preserve a strong distinction between design authority, decision rationale, permanent technical design, implementation reduction to practice, and transient migration management.

The governing separation is:

```text
ADR
  why a significant decision was made
        |
        v
Design Specification
  enduring target-system architecture and constraints
        |
        v
Functional Specification
  required system behaviour
        |
        v
Detailed Design Specification
  permanent technical design that realises those requirements
        |
        v
Implementation Specification
  concrete reduction to practice in the codebase and runtime
```

Project-management documentation operates outside that normative chain and owns transient migration sequencing, coordination, milestones, status, and handoff information.

Examples of Design Specification content:

- AppManager supports repository-management capabilities.
- AppManager supports TUI and Headless operation and proposes GUI operation.
- AppManager supports a presentation- and integration-independent Application Invocation Contract.
- AppManager has one authoritative Application Engine governing command semantics, workflow policy, managed scope, safety, and final application outcomes.
- specialist execution may be delegated through capability boundaries without delegating application authority.
- source mutation should be non-destructive where practical.

Examples of ADR content:

- why one primary runtime, language, framework, protocol family, or packaging approach was selected over credible alternatives;
- which decision drivers were decisive;
- what consequences and migration obligations follow from the accepted decision.

Examples of Detailed Design content:

- the permanent responsibility boundary between two architectural subsystems;
- the concrete contract between the Application Engine and a capability provider;
- a stable internal contract required to keep a specialist runtime independently replaceable;
- lifecycle, cancellation, failure, and compatibility semantics that remain part of the finished architecture.

Examples of Implementation Specification content:

- exact modules, packages, source paths, entry points, build tasks, libraries, and runtime wiring required to realise approved Detailed Design;
- a particular command is currently a stub;
- a service is currently unused;
- an exact method is not yet wired into a command;
- an existing path needs migration;
- a particular library provides Git functionality;
- a concrete module is replaced or rewired as part of migration.

Examples of project-management migration content:

- which component is migrated first;
- the order of migration workstreams;
- temporary milestone dependencies;
- migration completion percentages;
- handoff and execution status;
- temporary sequencing required only while the current implementation is being transformed.

The root Design Specification must describe the target architecture, not the journey from the legacy implementation to that target. Detailed Design must describe the permanent internal design, not a temporary implementation programme. Implementation Specifications define the concrete reduction to practice and may record relevant implementation state, while project-management documentation coordinates the transient execution of that work.

This distinction allows implementation to evolve without making the Design Specification obsolete after every code change while preserving the rationale for consequential architectural choices and preventing temporary migration state from becoming permanent design authority.

---

## 21. Documentation Quality Criteria

Before a normative document is considered complete, it should be checked for:

- correct specification level;
- consistent use of `AppManager`;
- valid naming conventions;
- duplicated requirements;
- contradictions with higher-level specifications;
- accidental implementation leakage into higher-level documents;
- migration or transitional detail placed above its appropriate specification or project-management level;
- confirmation that root Design Specification statements pass the enduring target-system test in Section 5.6;
- confirmation that Detailed Design describes permanent technical design rather than transient migration execution;
- for primary Detailed Design Specifications, a visible stable `DD-<family>.<item>` identity and correct family directory placement;
- navigable repository-relative links for internal document dependencies where practical;
- ambiguous normative language;
- unresolved legacy references;
- obsolete architectural terminology;
- traceability where it is useful;
- relevant ADR references where a significant architectural decision materially explains the document;
- clear lifecycle and authority status;
- coherent headings and section order;
- correct cross-references.

Before an ADR is accepted, it should additionally be checked for:

- a clear problem and decision context;
- explicit decision drivers;
- credible alternatives where meaningful alternatives existed;
- a precise decision statement;
- material positive and negative consequences;
- specification impact;
- references to deeper investigation where appropriate;
- correct status and supersession metadata;
- confirmation that normative consequences are incorporated into, or explicitly scheduled for incorporation into, the appropriate authoritative specification.

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

The `docs/project_management/decisions/` stream is intentionally outside this authoritative root set because ADRs are decision-provenance records rather than a specification level. Its governance document remains subordinate to this Project Documentation Guide.

Project-management documents are intentionally maintained outside the normative specification hierarchy and therefore do not expand this authoritative root set.

Archived documents are intentionally excluded from this authoritative root set.

---

## 23. Relationship to Existing Documentation

The existing AppManager documentation contains valuable design, functional, detailed-design, implementation, audit, roadmap, decision, and project-management information that has accumulated at different times and at different abstraction levels.

That material should be rationalised rather than discarded.

The consolidation process should:

1. identify the purpose and abstraction level of each existing document;
2. extract durable design intent;
3. identify significant architectural decisions and preserve their rationale through ADRs where the decision-governance criteria are met;
4. move functional requirements into Functional Specifications;
5. move component and command design into Detailed Design Specifications;
6. move source-specific observations into Implementation Specifications;
7. move project planning, migration status, coordination, architecture investigation, and handoff information into project-management documentation where appropriate;
8. preserve unresolved decisions as explicit proposals or open questions rather than silently resolving them;
9. eliminate duplication after information has been safely relocated;
10. archive documents that should leave the live tree but still contain information awaiting migration or reconciliation;
11. retire documents only when their continuing information value has been fully dispositioned according to Section 18.

Structural changes should be deliberate, incremental, and justified by improved documentation responsibility rather than cosmetic reorganisation.

Detailed Design restructuring must preserve stable `DD-<family>.<item>` identity, normative content, clarification relationships, and navigable cross-references while migrating documents into the self-documenting family directories defined in Section 7.7.

Moving a superseded or mixed-authority document into `docs/archive/` is an appropriate way to clean the live documentation tree without prematurely declaring its information redundant.

Existing implementation choices, including language, runtime, framework, library, or process topology, are evidence and migration context rather than automatic design authority. When such a choice materially constrains future architecture, it should be evaluated deliberately under the architecture-decision governance process.

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
9. The root Design Specification describes enduring target-system architecture and constraints, not the migration journey or reduction to practice.
10. A root Design Specification statement must remain useful and true after the current implementation and migration to the target architecture have ceased to matter.
11. Detailed Design describes the permanent internal technical design; transient migration execution does not become permanent design authority.
12. Primary Detailed Design Specifications use stable `DD-<family>.<item>` identifiers visible in the title, metadata, filename, and cross-references.
13. Detailed Design families are subdivisions of Level 3, not additional specification levels or authority tiers.
14. Active primary Detailed Design Specifications are grouped in concise self-documenting top-level `dd_<family>_<semantic_name>/` directories rather than one undifferentiated Detailed Design directory.
15. Internal document dependencies should use repository-relative Markdown links where practical so the documentation set is directly navigable.
16. Implementation Specifications own concrete reduction to practice and may record relevant current implementation state; project-management documentation owns migration sequencing, coordination, progress, and temporary states.
17. Duplication should be replaced by cross-reference and traceability.
18. Design intent, decision rationale, current implementation state, and migration state must be clearly distinguished.
19. TUI, Headless, GUI, IDE, and other interaction or host-integration adapters should share the Application Invocation Contract and authoritative Application Engine rather than duplicate domain behaviour.
20. Headless operation and the Application Invocation Contract are distinct architectural concepts.
21. The Application Engine retains application authority when specialist execution is delegated through capabilities, subsystems, providers, or external tools.
22. Architectural subsystems should not be forced into an artificial layer model.
23. Project-management documentation is outside the normative four-level specification hierarchy and must not establish product requirements or design authority.
24. ADRs are governed decision-provenance records and are not a fifth specification level.
25. Active ADRs and ADR governance reside beneath `docs/project_management/decisions/`.
26. Significant architectural decisions should use ADRs where preserving rationale has durable engineering value.
27. Accepted ADRs must not become the sole normative source of required system behaviour or architecture; affected specifications must be updated.
28. Significant project-wide technology and platform choices must be deliberate and must not arise solely from historical implementation, developer familiarity, or convenience.
29. Repository-level documents and collaboration surfaces must not become alternative sources of specification or decision authority; durable approved project knowledge must be incorporated into the appropriate repository-controlled documentation.
30. Archived documents are outside the active specification hierarchy and are non-authoritative.
31. Archiving and retirement are distinct lifecycle operations; archiving does not imply retirement.
32. Historical documentation must not be retired until every meaningful item the project intends to preserve has been dispositioned.
33. A retired document must use the `-retired` suffix immediately after its version identifier.
34. A document must not be retired while it remains the sole source of information the project intends to preserve.
35. Superseded canonical documents must identify their successor or replacement authority.
36. Accepted ADRs should be superseded rather than rewritten when a material architectural decision changes.
37. Active specifications should not rely upon archived or retired documents as normative authority.
38. AI-assisted work must respect specification authority, decision status, abstraction level, evidence quality, target-system permanence, stable Detailed Design identity, navigability, and the archive/retirement lifecycle.
39. Normative documentation should remain stable enough to guide implementation rather than merely describe it.

---

# Appendix A - Documentation Classification Quick Reference

| Documentation Level | Primary Question | Typical Content |
|---|---|---|
| Design Specification | What system are we building? | Enduring target-system vision, scope, architecture, principles, major domains, interaction model |
| Functional Specification | What must it do? | Behaviour, requirements, inputs, outputs, validation, workflows |
| Detailed Design Specification | How should it work internally? | Permanent components, commands, interfaces, algorithms, dependencies, data structures |
| Implementation Specification | How does approved Detailed Design map to concrete implementation? | Paths, symbols, libraries, build/runtime wiring, implementation status, migration mechanics, code-specific constraints |

Project-management documentation and Architecture Decision Records are intentionally excluded from this table because neither is a specification level.

Project-management documentation owns transient migration planning, sequencing, coordination, progress, temporary states, and handoff information.

Architecture Decision Records answer a different question:

> What significant decision was made, why was it made, which alternatives were considered, and what consequences follow from it?

# Appendix B - Naming Quick Reference

| Item | Convention | Example |
|---|---|---|
| Application name in prose | Exact canonical name | `AppManager` |
| Directory | lowercase with underscores | `license_engine/` |
| Detailed Design family directory | `dd_<family>_<semantic_name>/` | `dd_2_shared_capabilities/` |
| Filename | lowercase with hyphens | `project-documentation-guide-v01.md` |
| Detailed Design identifier | `DD-<family>.<item>` | `DD-1.3` |
| Detailed Design filename | `dd-<family>-<item>-<subject>-detailed-design-v<version>.md` | `dd-1-3-managed-project-detailed-design-v01.md` |
| Project-controlled identifier | lowercase, normally underscores | `active_provider` |
| Normative document version | `v` plus two digits | `v01` |
| Retired document | version followed by `-retired` | `document-name-v01-retired.md` |
| ADR | `adr-` plus four-digit sequence and descriptive slug | `adr-0001-primary-application-runtime.md` |

# Appendix C - Interaction and Integration Modes

| Mode or adapter | Role | Principle |
|---|---|---|
| TUI | Guided terminal interaction | Interaction mode presented through an adapter over shared application semantics |
| Headless | Automation, scripts, CI/CD | Non-interactive interaction mode; not itself the machine invocation contract |
| GUI | Proposed graphical interaction | Graphical interaction mode over shared application semantics |
| IDE / host integration | IDEs, editors, CI/CD, AI agents, and other tools | Thin integration adapter; must not duplicate AppManager application authority |
| Application Invocation Contract | Structured semantic invocation boundary | Shared, presentation-independent contract; transport choices belong at lower specification levels |
| Application Engine | Authoritative application boundary | Owns or governs command semantics, policy, workflow coordination, managed scope, safety, and final application outcomes |
| Capability boundary | Boundary for specialist or provider-backed execution | Encapsulates implementation-specific mechanics without transferring application authority |
| Capability provider | Implementation of bounded specialist capability | Performs delegated work in AppManager-oriented terms under Application Engine authority |

# Appendix D - Documentation Lifecycle Quick Reference

| State | Location | Authoritative | Filename treatment | Meaning |
|---|---|---|---|---|
| Active | Live documentation tree | According to hierarchy | Normal versioned filename | Current project documentation |
| Archived | `docs/archive/` | No | Existing filename retained | Removed from live tree; information may still require migration or may be retained for history |
| Retired | `docs/archive/` | No | Append `-retired` after version | Information-disposition process complete; document permanently superseded or obsolete |

ADRs use the separate decision lifecycle defined in the architecture-decision governance document and may remain available after rejection or supersession because the decision history itself can retain engineering value.

# Appendix E - Architecture Decision Quick Reference

| ADR Status | Meaning |
|---|---|
| Proposed | Under consideration; does not redefine an approved specification |
| Accepted | Records an approved significant decision; normative consequences belong in affected specifications |
| Rejected | Records a proposed decision deliberately not adopted where the rationale retains value |
| Deprecated | Accepted decision still relevant to compatibility or implementation but intentionally being phased out |
| Superseded | Historical decision replaced by a newer ADR; successor must be identifiable |

Typical decision flow:

```text
proposal / open question
        |
        v
architecture review / investigation
        |
        v
ADR decision
        |
        v
authoritative specification
        |
        v
detailed design
        |
        v
implementation
```

Architecture reviews may contain detailed comparative analysis, prototypes, benchmarks, risks, migration implications, and recommendations. ADRs preserve the durable decision and rationale. Specifications carry the resulting normative requirements.