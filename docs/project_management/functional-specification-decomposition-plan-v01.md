# AppManager Functional Specification Decomposition Plan

> **Status:** Planning proposal for Version 1 Functional Specification derivation
>
> **Authority:** Non-normative project-management planning document. It proposes how the approved root Design Specification should be reduced into Functional Specifications. It does not itself create functional requirements.
>
> **Governing sources:** `docs/project-documentation-guide-v01.md`, `docs/appmanager-design-specification-v01.md`, `docs/decisions/adr-0001-primary-application-runtime.md`

## 1. Purpose

This document defines the proposed architecture and decomposition of the AppManager Version 1 Functional Specification set before individual Functional Specifications are written.

The objective is to ensure that:

- every Design-level responsibility has a Functional destination where behavioural refinement is required;
- cross-cutting behaviour has one authoritative Functional home;
- the eight approved functional domains do not duplicate shared semantics;
- Functional Specifications remain implementation-independent;
- legacy behavioural requirements are preserved and dispositioned under the project's zero-information-loss principle;
- downstream Detailed Design work can proceed without guessing product behaviour.

The governing Functional question is:

> What observable behaviour must AppManager provide?

This planning document deliberately does not answer lower-level questions such as concrete class structure, TypeScript APIs, package layout, transport bindings, source paths, libraries, or migration sequencing.

---

## 2. Governing Constraints

The Functional Specification set must preserve the following approved Design constraints.

### 2.1 One application authority

The Application Engine remains authoritative for command and use-case semantics, application policy, workflow coordination, managed-scope interpretation, safety constraints, interpretation of delegated results, and final application-level outcomes.

Functional Specifications must describe observable application behaviour without assigning those behaviours directly to implementation components.

### 2.2 Shared invocation semantics

TUI, Headless, GUI, IDE, CI, automation-agent, and future host integrations must expose common AppManager semantics through the Application Invocation Contract.

Functional equivalence does not require identical presentation. It requires equivalent application intent, policy, validation, scope, safety, and outcome semantics.

### 2.3 Managed context and managed scope are distinct

Recognition or discovery of a resource does not automatically grant mutation authority over it.

Functional Specifications must distinguish:

- resolving the managed project context;
- selecting or deriving the managed scope for an operation;
- validating whether an operation is permitted to act on the resolved scope.

### 2.4 Configuration sources are not configuration authority

Configuration sources provide candidate values. AppManager behaviour depends on an effective configuration resolved according to approved semantics.

The user-facing `settings` domain must therefore be separated from the cross-cutting behaviour by which configuration is resolved and consumed.

### 2.5 Delegated execution does not delegate application authority

Functional Specifications may require specialist capabilities, but they must describe AppManager-visible behaviour and results rather than provider-specific mechanics.

### 2.6 Functional Specifications remain technology-independent

ADR-0001 selects Node.js/TypeScript for Version 1 implementation, but that decision normally belongs below the Functional level unless a user-visible requirement genuinely depends upon the runtime.

---

## 3. Proposed Functional Specification Architecture

The recommended Version 1 Functional Specification set consists of four cross-cutting specifications and eight domain specifications.

```text
docs/functional/
├── application-invocation-functional-specification-v01.md
├── managed-project-functional-specification-v01.md
├── configuration-functional-specification-v01.md
├── source-transformation-functional-specification-v01.md
├── app-functional-specification-v01.md
├── docs-functional-specification-v01.md
├── git-functional-specification-v01.md
├── ai-functional-specification-v01.md
├── nuxt-functional-specification-v01.md
├── quality-functional-specification-v01.md
├── utils-functional-specification-v01.md
└── settings-functional-specification-v01.md
```

This decomposition is intentionally not equivalent to a component architecture. Functional documents own behavioural requirements. Detailed Design will later determine the permanent internal technical realisation.

---

## 4. Cross-Cutting Functional Specifications

## 4.1 Application Invocation Functional Specification

### Purpose

Define the common observable behaviour by which AppManager commands and use cases are discovered, invoked, validated, executed, observed, completed, failed, or cancelled across interaction modes and integrations.

### Functional ownership

This specification should own shared requirements for:

- command identity and discovery behaviour;
- invocation inputs, options, and invocation context;
- required-input validation;
- deterministic non-interactive Headless behaviour;
- interaction-mode functional equivalence;
- confirmation requirements where functionally required;
- dry-run or preview behaviour where required by a use case;
- structured success outcomes;
- structured failure outcomes;
- diagnostics;
- warnings;
- progress or execution events where functionally significant;
- cancellation where supported and functionally significant;
- partial-success semantics;
- command availability or enablement where product behaviour requires it;
- machine-consumable results independent of human presentation;
- human-presentation independence;
- behaviour when required information cannot be resolved non-interactively;
- application-level acceptance or rejection of delegated results.

### Explicit non-ownership

This document should not define:

- transport protocols;
- serialization formats;
- TypeScript interfaces;
- concrete command registries;
- process topology;
- TUI libraries;
- concrete cancellation primitives;
- source modules or package structure.

Those belong to Detailed Design or Implementation Specifications.

---

## 4.2 Managed Project Functional Specification

### Purpose

Define the observable behaviour by which AppManager recognises, resolves, validates, and scopes the project it manages.

### Functional ownership

This specification should own shared requirements for:

- target-project identification;
- project-root resolution;
- managed-project-context resolution;
- root Nuxt application recognition;
- managed layer recognition;
- repository and repository-relationship recognition;
- AppManager-owned resource recognition;
- context validation;
- explicit managed-scope resolution for consequential operations;
- inclusion and exclusion behaviour;
- distinction between recognised resources and mutable resources;
- operation-specific scope narrowing;
- invalid, ambiguous, incomplete, or unsupported project-context behaviour;
- behaviour when resources lie outside approved managed scope;
- cross-repository and cross-layer scope semantics;
- context information exposed to commands and callers where functionally relevant.

### Rationale

Managed project and managed scope semantics are consumed by several domains, especially `app`, `git`, `nuxt`, `docs`, `quality`, and `utils`. Duplicating these rules in each domain would create conflicting authority.

---

## 4.3 Configuration Functional Specification

### Purpose

Define how AppManager obtains effective configuration for application behaviour independent of the user-facing commands used to inspect or modify settings.

### Functional ownership

This specification should own shared requirements for:

- recognised configuration-source classes at the functional level;
- candidate-value resolution;
- effective-configuration resolution;
- precedence behaviour;
- explicit invocation-supplied overrides where allowed;
- project-specific overrides;
- defaults;
- validation of resolved configuration;
- missing-value behaviour;
- invalid-value behaviour;
- provenance of resolved values where this is observable or diagnostically useful;
- secret-sensitive configuration behaviour where functionally required;
- deterministic configuration resolution in Headless operation;
- effect of configuration changes on subsequent invocations;
- separation between configuration resolution and user-facing settings management.

### Relationship to `settings`

The `settings` domain specification should define what users or automation can inspect, create, update, or delete.

This cross-cutting configuration specification should define how candidate configuration becomes effective application configuration.

The two documents must cross-reference rather than duplicate each other.

---

## 4.4 Source Transformation Functional Specification

### Purpose

Define shared observable requirements for inspection, proposed mutation, controlled transformation, generation, validation, and acceptance of source or generated artefacts.

### Functional ownership

This specification should own shared requirements for:

- distinction between inspection and mutation;
- distinction between generation of new artefacts and mutation of existing source;
- structure-aware inspection and transformation where supported;
- bounded transformation intent;
- managed-scope enforcement for mutation;
- preview or proposed-change behaviour where required;
- confirmation for consequential source changes where functionally required;
- preservation of unaffected content where practical;
- source-level validation after transformation;
- application-level acceptance after source-level validation;
- behaviour when a technically valid change violates command intent, scope, policy, or safety constraints;
- atomicity or partial-change reporting where functionally required;
- diagnostics for unsupported or ambiguous source structures;
- non-destructive-operation expectations;
- AI-generated transformation output remaining non-authoritative until validated and accepted.

### Rationale

Source inspection and mutation are used by multiple domains and by several legacy command families. The functional rules governing safe transformation should therefore have one shared authority rather than being redefined independently by `docs`, `nuxt`, `utils`, `app`, or `ai`.

---

## 5. Domain Functional Specifications

Each domain specification should define the commands and use cases whose product identity belongs to that domain. Each domain document should reference the cross-cutting specifications for shared invocation, project-context, configuration, and transformation behaviour.

## 5.1 `app`

Primary behavioural scope:

- initialise an AppManager-managed application environment;
- post-installation operations where retained as a product use case;
- build;
- preview;
- local development execution;
- clean generated caches or state;
- reset generated installation/build state where supported;
- reinitialise through an approved composition of reset, install, and build behaviour;
- create a new application;
- support minimal, complete, or custom creation choices where retained;
- create or provision a Nuxt layer where the use-case identity belongs to application lifecycle rather than Nuxt configuration management;
- execute selected project package scripts where retained as an AppManager application use case.

Boundary questions requiring resolution during drafting:

- whether Nuxt-layer creation belongs to `app` or `nuxt`;
- whether generic package-script execution is a first-class `app` use case or a bounded utility capability;
- which reset or clean operations are sufficiently safe and coherent to retain in Version 1.

## 5.2 `docs`

Primary behavioural scope:

- document the complete application;
- document application source;
- document all managed layers;
- document a selected layer;
- document tests;
- document a selected file;
- select documentation targets interactively in TUI without making interactivity part of the underlying use-case semantics;
- automatic documentation behaviour where retained;
- generation versus injection behaviour subject to the shared source-transformation rules.

## 5.3 `git`

Primary behavioural scope:

- inspect Git configuration relevant to AppManager-managed repositories;
- initialise repositories;
- commit;
- manage commits where retained;
- add managed repository relationships or submodules where supported;
- initialise layer repositories;
- push all relevant repositories;
- push a selected repository or remote;
- synchronise a repository;
- synchronise the managed project;
- perform scoped synchronisation;
- remote-repository deletion only if retained after explicit safety review.

This domain must depend heavily on managed-scope and shared safety semantics.

## 5.4 `ai`

Primary behavioural scope already identified in legacy material:

- list project AI instruction documents;
- create a project AI instruction document;
- delete a project AI instruction document.

Additional AI-assisted workflows should only enter this specification when AI capability is itself the primary subject of the use case. AI used internally by another domain does not automatically make that behaviour an `ai` domain command.

Examples such as `CLAUDE.md` and `GEMINI.md` may be retained as examples, not as exclusive supported formats unless deliberately specified.

## 5.5 `nuxt`

Primary behavioural scope:

- inspect and manage Nuxt configuration;
- list configuration entries;
- add configuration;
- remove configuration;
- manage supported Nuxt-layer lifecycle behaviour where product identity is Nuxt-specific;
- expose Nuxt-specific project facts where required by approved use cases.

Concrete mutation mechanisms belong below the Functional level.

## 5.6 `quality`

Primary behavioural scope:

- run all tests;
- run unit tests;
- run end-to-end tests;
- run coverage;
- run test UI where this remains a supported product behaviour;
- linting;
- type checking;
- validation and quality-gate behaviour required by the root Design;
- structured quality outcomes suitable for Headless automation.

Exact test-runner commands, timeouts, and package scripts belong to lower specification levels unless intentionally made functional configuration.

## 5.7 `utils`

Primary behavioural scope identified in legacy material:

- check headers;
- repair headers;
- manage contributors where this does not belong to settings metadata management;
- automatic documentation where not owned by `docs`;
- automatic versioning;
- clean logs;
- validate headers.

This domain requires particular scrutiny because `utils` must remain a bounded home for genuinely miscellaneous product operations rather than becoming a catch-all for poorly classified use cases.

During drafting, any use case with a clearer domain owner should be moved there.

## 5.8 `settings`

Primary behavioural scope:

- inspect and manage user-facing or automation-facing AppManager settings;
- manage author metadata;
- manage funding metadata;
- manage bug-reporting metadata;
- manage repository metadata;
- manage application metadata such as version, description, privacy, type, licence, and keywords where AppManager owns those behaviours;
- create, read, update, and delete environment-variable definitions where retained;
- list and manage contributors where settings ownership is appropriate;
- create and delete licences where these are settings/resource-management operations;
- list, add, and delete templates where these are settings/resource-management operations.

This document must not redefine configuration precedence or effective-configuration resolution, which belong to the cross-cutting Configuration Functional Specification.

---

## 6. Shared Functional Requirement Model

Each Functional Specification should use a consistent behavioural structure.

For each command, use case, or shared behaviour, define where applicable:

1. **Purpose / user intent**
2. **Inputs**
3. **Preconditions**
4. **Project context requirements**
5. **Managed scope**
6. **Configuration dependencies**
7. **Validation rules**
8. **Required confirmations or explicit authorisation**
9. **Behaviour / observable effects**
10. **Postconditions**
11. **Structured result**
12. **Diagnostics and warnings**
13. **Failure behaviour**
14. **Partial-success behaviour**
15. **Cancellation behaviour where applicable**
16. **Headless behaviour**
17. **Interaction-mode equivalence requirements**
18. **Safety and non-destructive-operation requirements**
19. **Traceability to Design requirements and relevant ADRs**
20. **Legacy requirement provenance where a requirement is migrated from non-authoritative material**

Not every heading must be mechanically repeated when it adds no value, but every applicable concern must be covered.

---

## 7. Traceability Model

Functional requirements should receive stable identifiers so they can later be referenced by Detailed Design and Implementation Specifications.

A recommended pattern is:

```text
FR-INV-001
FR-PROJ-001
FR-CONFIG-001
FR-XFORM-001
FR-APP-001
FR-DOCS-001
FR-GIT-001
FR-AI-001
FR-NUXT-001
FR-QUAL-001
FR-UTIL-001
FR-SET-001
```

The identifier denotes Functional ownership, not implementation ownership.

Each specification should contain a traceability table mapping at least:

```text
Functional requirement
        |
        +--> root Design section / invariant
        |
        +--> relevant ADR where rationale matters
        |
        +--> legacy source item where migrated
```

Detailed Design will later extend this chain downward.

---

## 8. Legacy Functional Information Requiring Migration

The existing Design Reconciliation Audit already identifies substantial behavioural material that must be preserved during Functional derivation.

Important categories include:

- package-script invocation;
- command availability or enablement behaviour;
- app lifecycle and creation commands;
- documentation commands;
- repository and synchronisation commands;
- AI instruction-document commands;
- Nuxt configuration commands;
- quality/test commands;
- utility/header/versioning/log commands;
- settings and metadata management;
- generated artefact catalogue;
- functional aspects of resolver behaviour;
- safety and confirmation behaviour mixed into legacy command specifications.

Existing documents labelled as Functional Specifications for the Licence Engine, Template Engine, Resolvers, Orchestrators, or similar architectural concerns must not automatically be accepted as correctly placed Functional authorities. Their content should be decomposed by abstraction level:

- observable product behaviour -> Functional Specification;
- permanent component responsibility or contract -> Detailed Design;
- concrete runtime/source/library information -> Implementation Specification;
- obsolete architecture -> do not propagate;
- unresolved ideas -> preserve as proposals.

---

## 9. Known Classification Questions

The following questions should be resolved during drafting rather than hidden by document structure.

### 9.1 Layer creation ownership

Determine whether creation/provisioning of a Nuxt layer is primarily:

- an `app` lifecycle use case;
- a `nuxt` domain use case;
- or two distinct use cases with different semantics.

### 9.2 Contributor management ownership

Legacy material places contributor operations in both utility-like and settings-like contexts. Functional ownership should be singular and based on product intent.

### 9.3 Automatic documentation ownership

If automatic documentation is simply another Docs-domain workflow, it should not remain duplicated in `utils`.

### 9.4 Template and licence management

Differentiate:

- user-facing management of template/licence resources;
- generation or licence application use cases;
- internal Template Engine or Licence Engine design.

The first may belong to `settings`; the second to the most appropriate product domain; the third belongs to Detailed Design.

### 9.5 Destructive Git operations

Remote-repository deletion and similarly consequential operations require explicit functional safety review before they are carried forward as Version 1 requirements.

Legacy presence alone is not approval.

---

## 10. Recommended Drafting Sequence

The Functional Specifications should be drafted in dependency order rather than alphabetically.

### Phase 1 — Shared behavioural foundation

1. `application-invocation-functional-specification-v01.md`
2. `managed-project-functional-specification-v01.md`
3. `configuration-functional-specification-v01.md`
4. `source-transformation-functional-specification-v01.md`

These documents establish the common semantics that domain specifications can reference.

### Phase 2 — High-dependency domains

5. `app-functional-specification-v01.md`
6. `git-functional-specification-v01.md`
7. `nuxt-functional-specification-v01.md`
8. `docs-functional-specification-v01.md`

### Phase 3 — Remaining domains

9. `quality-functional-specification-v01.md`
10. `settings-functional-specification-v01.md`
11. `ai-functional-specification-v01.md`
12. `utils-functional-specification-v01.md`

The `utils` document should be drafted last so that use cases with a more appropriate domain owner are not accidentally stranded there.

---

## 11. Functional Phase Completion Criteria

The Version 1 Functional Specification phase is complete only when:

- every relevant root Design responsibility has a Functional destination or an explicit determination that no further Functional refinement is required;
- every retained legacy behavioural requirement has been migrated, rejected, marked obsolete, or preserved as a proposal with an explicit disposition;
- every cross-domain behaviour has one authoritative Functional home;
- no domain specification duplicates shared invocation, project-context, configuration, transformation, safety, or outcome semantics;
- Headless deterministic behaviour is defined;
- interaction-mode functional equivalence is defined;
- structured outcomes, diagnostics, failure, cancellation, and partial-success semantics are defined where applicable;
- managed project context and managed scope are defined;
- consequential-operation safety semantics are defined;
- configuration resolution behaviour is defined independently from settings-management commands;
- source mutation and generation behaviour is functionally separated;
- all Functional requirements are traceable upward to approved Design intent;
- downstream Detailed Design can proceed without guessing product behaviour.

---

## 12. Immediate Next Action

The next document to draft should be:

```text
docs/functional/application-invocation-functional-specification-v01.md
```

Before that draft is treated as complete, the relevant legacy command-infrastructure and invocation material should be reviewed for unique behavioural requirements and reconciled against the root Design Specification.

No Detailed Design or implementation restructuring should begin as a substitute for this Functional work.
