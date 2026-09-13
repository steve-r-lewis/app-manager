# AppManager App Functional Specification

> **Status:** Version 1 Functional Specification
>
> **Functional authority:** Observable application-level behaviour for AppManager root-application lifecycle operations, managed-project initialisation, project lifecycle execution, environment cleanup and reset, root-application creation, and bounded project-package-script execution.
>
> **Governing authorities:** `docs/project-documentation-guide-v01.md`, `docs/appmanager-design-specification-v01.md`
>
> **Related Functional Specifications:** `application-invocation-functional-specification-v01.md`, `managed-project-functional-specification-v01.md`, `configuration-functional-specification-v01.md`, `source-transformation-functional-specification-v01.md`
>
> **Planning source:** `docs/project_management/functional-specification-decomposition-plan-v01.md`

---

## 1. Purpose

This specification defines the observable Version 1 behaviour of the AppManager `app` functional domain.

The `app` domain owns use cases whose primary product identity is the lifecycle of the managed root application or the creation of a new root application. It does not own the shared mechanics by which AppManager resolves invocation semantics, managed-project context, effective configuration, source transformation, Git policy, Nuxt-specific configuration, quality execution, documentation, AI behaviour, or settings management.

The governing question for this document is:

> **What application-lifecycle behaviour must AppManager provide for a managed root application?**

The central functional boundary is:

> **The `app` domain owns root-application lifecycle intent. It does not own the implementation mechanics of package managers, process execution, Git, Nuxt, source transformation, templates, or host tools used to realise that intent.**

This distinction is essential to prevent lifecycle commands from becoming duplicated wrappers around lower-level mechanisms.

---

## 2. Scope

This specification owns functional behaviour for:

- identifying and exposing supported root-application lifecycle operations;
- initialising an existing managed application environment;
- executing project-declared post-installation lifecycle behaviour;
- starting local development execution;
- building the managed root application;
- previewing a built application;
- cleaning regenerable application state;
- resetting regenerable installation/build state;
- reinitialising an application through a defined lifecycle composition;
- creating a new AppManager-oriented root application;
- creation profiles or choices such as minimal, complete, or custom where supported;
- optional follow-on actions that are part of root-application creation;
- executing a selected package-defined project script as a bounded application use case;
- lifecycle operation availability, preconditions, domain-specific outcomes, and domain-specific safety semantics;
- composition of delegated capabilities while retaining application-level authority.

---

## 3. Explicitly Out of Scope

This specification does not define:

- concrete command classes, filenames, registries, or TypeScript interfaces;
- process-spawning APIs, shell construction, standard-I/O handling, or child-process libraries;
- exact package-manager command strings;
- package-manager detection algorithms or lockfile priority rules;
- exact filesystem paths to caches, build outputs, dependencies, or lockfiles;
- exact template functions, template filenames, or template implementations;
- concrete Git commands, Git library calls, remote-provider APIs, or repository-hosting behaviour;
- Nuxt configuration mutation mechanics;
- Nuxt-layer creation or provisioning;
- source scanner, parser, strategy, AST, or transformation implementations;
- exact rollback, temporary-directory, staging-directory, or transactional-write implementations;
- GUI, TUI, IDE, or Headless presentation details;
- editor-specific project configuration as a universal application requirement;
- concrete test framework behaviour;
- concrete source paths, module layout, dependency injection, or service topology.

Those concerns belong to other Functional Specifications, Detailed Design Specifications, or Implementation Specifications according to their abstraction level.

---

## 4. Domain Boundary and Functional Model

### 4.1 Root-application lifecycle ownership

`app` is the functional home for user and automation intents that concern the managed root application's lifecycle as an application.

Examples include making an existing checkout ready for development, running the application locally, building it, previewing it, cleaning regenerable state, resetting its generated environment, reinitialising it, and creating a new root application.

### 4.2 Delegated capabilities

An `app` use case may delegate specialist work to capabilities responsible for areas such as:

- process execution;
- package-manager interaction;
- filesystem operations;
- project generation;
- Git operations;
- configuration resolution;
- source transformation;
- Nuxt-aware operations;
- logging and diagnostics.

Delegation does not transfer ownership of the application lifecycle use case.

### 4.3 Relationship to Nuxt-layer creation

Version 1 assigns Nuxt-layer creation singularly to the `nuxt` domain:

> **Creation or provisioning of a Nuxt layer is owned by the `nuxt` domain because the identity and validity of that use case are intrinsically Nuxt-specific.**

The `app` domain may expose a successful root-application creation outcome that recommends or enables a subsequent Nuxt-layer creation use case, but it shall not duplicate the Nuxt-layer creation behaviour.

### 4.4 Relationship to project-package scripts

Executing a package-defined script remains an `app` domain use case where the intent is to operate the managed application through a script that the project itself declares.

This is not authority for arbitrary shell execution. The distinction is:

- **declared project script:** bounded AppManager application operation;
- **arbitrary command or shell string:** not an `app` functional requirement.

### 4.5 Cross-cutting authority

The following remain authoritative in their respective cross-cutting specifications:

- invocation, availability, confirmation, cancellation, partial success, structured outcomes, and interaction-mode equivalence: `FR-INV-*`;
- managed-project context, root identity, managed scope, recognition, and mutation authority: `FR-PROJ-*`;
- candidate and effective configuration semantics: `FR-CONFIG-*`;
- generated artefact versus existing-source mutation behaviour, bounded transformation, validation, and application acceptance: `FR-XFORM-*`.

This specification references those behaviours and adds only `app`-specific requirements.

---

## 5. General App-Domain Requirements

### FR-APP-001 — Coherent app-domain semantics

AppManager shall provide one coherent set of `app` domain semantics across supported interaction modes and host integrations.

### FR-APP-002 — Application Engine authority

The Application Engine shall retain authority over `app` use-case intent, lifecycle sequencing, application policy, safety decisions, delegated-result interpretation, and final application-level outcomes.

### FR-APP-003 — Domain operations represent application intent

An `app` operation shall represent a coherent application-lifecycle or root-application-creation intent rather than exposing a lower-level tool mechanism as the primary product abstraction.

### FR-APP-004 — Managed project required for existing-project lifecycle operations

An existing-project lifecycle operation shall require a valid managed-project context sufficient for that operation before consequential effects begin.

### FR-APP-005 — Root application targeting

Existing-project lifecycle operations owned by `app` shall target the managed root application unless a use case explicitly defines a narrower valid target.

### FR-APP-006 — No implicit scope expansion

An `app` lifecycle operation shall not silently expand from the root application's approved managed scope into unrelated layers, repositories, directories, or external resources merely because they are discoverable.

### FR-APP-007 — Capability delegation is subordinate

A package manager, process runner, filesystem mechanism, Git capability, generator, Nuxt capability, or other delegated provider shall not redefine `app` command intent, sequencing, safety, or success criteria.

### FR-APP-008 — Effective configuration consumption

Where an `app` use case depends on configurable values, it shall consume effective configuration according to the Configuration Functional Specification rather than independently interpreting arbitrary raw configuration sources.

### FR-APP-009 — Availability is use-case specific

AppManager shall distinguish whether an `app` use case is available for the resolved project context instead of assuming that every lifecycle operation is valid for every project.

### FR-APP-010 — Unavailable is not unknown

Where a recognised `app` operation exists but its preconditions are not met, AppManager shall report it as unavailable or inapplicable rather than as an unknown operation.

### FR-APP-011 — Observable precondition failures

When an `app` operation cannot proceed because required project metadata, lifecycle capability, configuration, or target state is absent or invalid, AppManager shall provide structured diagnostics identifying the unmet functional precondition.

### FR-APP-012 — Lower-level success is not automatically app success

Successful completion of a delegated process, generation step, filesystem operation, or provider call shall not by itself establish successful completion of the `app` use case.

---

## 6. Initialise Existing Application Environment

### 6.1 Purpose

Initialisation prepares an already-existing managed root application for normal development or subsequent AppManager lifecycle operations.

It is distinct from creation of a brand-new application.

### FR-APP-013 — Existing-project initialisation use case

AppManager shall provide an `app` use case that initialises an existing managed root application environment.

### FR-APP-014 — Initialisation shall not scaffold over an existing project

Initialisation shall treat the resolved project as an existing application to prepare, not as a target to replace with a newly generated root scaffold.

### FR-APP-015 — Dependency readiness

Where dependency installation or restoration is required to make the managed application development-ready, initialisation shall arrange for that lifecycle step through the appropriate delegated capability.

### FR-APP-016 — Existing environment-example material

Where the project provides an established environment-example artefact and the corresponding local environment artefact is absent, initialisation may create the local artefact from the project-provided example according to applicable configuration, transformation, generation, and sensitive-information rules.

### FR-APP-017 — No secret fabrication

Initialisation shall not invent secret values merely to make an environment artefact appear complete.

Where user-supplied or externally supplied sensitive values remain required, AppManager shall report that requirement without falsely claiming the environment is fully configured.

### FR-APP-018 — Existing environment preservation

Initialisation shall not overwrite an already-existing user-managed environment artefact merely because an environment-example artefact also exists, unless an explicitly authorised replacement use case requires that behaviour.

### FR-APP-019 — Managed repository relationship readiness

Where existing managed repository relationships are required for the application to be development-ready, initialisation may coordinate the appropriate Git-domain behaviour rather than implementing independent repository synchronisation semantics.

### FR-APP-020 — Optional development-environment artefacts

Project-local development-environment artefacts may be provisioned during initialisation only where they are part of an approved AppManager project profile or explicit invocation intent.

They shall not be treated as universal requirements of every managed project.

### FR-APP-021 — Host-tool neutrality

Initialisation shall not require a particular IDE or editor in order for the application to be considered successfully initialised.

### FR-APP-022 — Initialisation completion criteria

A successful initialisation outcome shall identify the lifecycle preparation steps that completed and any remaining user action required before the application is fully usable.

### FR-APP-023 — Initialisation partial completion

If initialisation consists of multiple consequential steps and only some complete, AppManager shall report the operation as partial or failed according to the invocation specification and identify which lifecycle preparation steps did and did not complete.

### FR-APP-024 — Idempotent-safe behaviour where practical

Repeated initialisation shall avoid unnecessary destructive replacement of already-valid user-managed artefacts and shall treat previously satisfied preparation steps as already satisfied where the use case permits.

---

## 7. Post-Installation Lifecycle Behaviour

### FR-APP-025 — Post-installation use case

AppManager shall support project post-installation behaviour as an `app` lifecycle use case when the managed root application declares an applicable post-installation lifecycle action.

### FR-APP-026 — Declaration-aware availability

Where no applicable project post-installation action is declared, AppManager shall either make the use case unavailable or report explicitly that no such lifecycle action exists; absence shall not be treated as an opaque process failure.

### FR-APP-027 — Project declaration is the source of action identity

Post-installation execution shall be based on the managed project's declared lifecycle behaviour rather than on an AppManager hard-coded assumption that every project contains the same script or mechanism.

### FR-APP-028 — Structured completion

Post-installation execution shall expose structured success or failure at the `app` use-case level, including delegated execution diagnostics where relevant.

---

## 8. Local Development Execution

### FR-APP-029 — Local development use case

AppManager shall provide an `app` use case for starting the managed root application's local development execution where the project supports such a lifecycle action.

### FR-APP-030 — Long-running operation semantics

Local development execution shall be treated as a potentially long-running lifecycle operation and shall support appropriate progress, execution-state, and cancellation behaviour through the Application Invocation Contract where supported.

### FR-APP-031 — Project-defined lifecycle mapping

The concrete mechanism used to start local development shall be resolved from the managed project and effective configuration rather than being defined by this Functional Specification as a fixed command string.

### FR-APP-032 — Delegated termination interpretation

Termination of the delegated development process shall be interpreted by AppManager as an application-level completion, cancellation, or failure according to the reason and invocation state rather than solely by terminal presentation.

### FR-APP-033 — No interaction-only dependency

Headless callers shall be able to invoke local development execution without depending on an interactive menu when all required invocation data is supplied or resolvable.

---

## 9. Build

### FR-APP-034 — Build use case

AppManager shall provide an `app` use case for building the managed root application where the project supports a build lifecycle action.

### FR-APP-035 — Build availability

A build operation shall be unavailable or shall fail with a specific precondition diagnostic when the managed project does not define or support an applicable build lifecycle.

### FR-APP-036 — Build result

The build outcome shall distinguish at least successful build completion from delegated execution failure and AppManager-level rejection or invalid postcondition where applicable.

### FR-APP-037 — Build artefact assumptions are lower-level

This specification shall not require a universal build-output directory or artefact layout. Any such expectation shall come from project context, effective configuration, Nuxt-specific behaviour, or lower-level specifications.

### FR-APP-038 — Build does not silently mutate unrelated source

A build use case shall not acquire authority to rewrite unrelated user source merely because an underlying tool is capable of doing so. AppManager-controlled source changes remain governed by the Source Transformation Functional Specification.

---

## 10. Preview

### FR-APP-039 — Preview use case

AppManager shall provide an `app` use case for previewing the managed root application where the project supports an applicable preview lifecycle action.

### FR-APP-040 — Preview prerequisite behaviour

Where preview requires a prior build or another project-specific prerequisite, AppManager shall either validate that prerequisite before execution or allow the delegated lifecycle action to establish the failure, but the chosen behaviour shall be deterministic and documented at the appropriate lower specification level.

### FR-APP-041 — No universal output-layout assumption

Preview shall not infer a universal build-output location at the Functional level.

### FR-APP-042 — Long-running preview semantics

Where preview is long-running, its execution, cancellation, and termination shall follow the same structured invocation principles as other long-running `app` lifecycle operations.

---

## 11. Clean Regenerable Application State

### 11.1 Purpose

Clean removes regenerable application state that is not intended to represent durable user source or project ownership.

It is intentionally less destructive than reset/empty behaviour.

### FR-APP-043 — Clean use case

AppManager shall provide an `app` use case for cleaning recognised regenerable cache or build state associated with the managed root application.

### FR-APP-044 — Clean target classification

The clean operation shall act only on resource classes classified by AppManager as safely regenerable for that use case.

### FR-APP-045 — Clean shall preserve dependencies and durable source by default

Clean shall not, by default, remove installed dependency state, package-manager lock state, user-authored application source, project metadata, repositories, or other durable resources that belong to the stronger reset/empty or explicitly destructive use cases.

### FR-APP-046 — Clean target resolution

Concrete clean targets shall be resolved through project knowledge and lower-level design rather than encoded in this Functional Specification as a universal path list.

### FR-APP-047 — Missing clean targets are not necessarily failures

A recognised clean target that is already absent may be treated as already clean rather than as an operation failure, provided no contradictory project condition exists.

### FR-APP-048 — Clean shall not escape managed scope

Clean shall not remove resources outside the approved root-application managed scope even if those resources resemble known cache or build artefacts.

### FR-APP-049 — Clean outcome

The clean result shall report the resource classes or targets affected, skipped, already absent, or failed sufficiently for the caller to understand the resulting application state.

---

## 12. Reset / Empty Generated Installation and Build State

### 12.1 Purpose

Reset or Empty is a stronger lifecycle operation than Clean. It removes regenerable application state sufficiently broadly that dependency installation and subsequent build preparation may be required again.

### FR-APP-050 — Reset use case

AppManager shall provide a deliberately stronger `app` lifecycle use case for resetting regenerable installation and build state where supported.

### FR-APP-051 — Functional distinction from Clean

Reset shall be functionally distinct from Clean and shall not be presented as merely an alias for the same effect set.

### FR-APP-052 — Reset may remove dependency-installation state

Reset may remove installed dependency state and other regenerable installation artefacts when they are within the approved managed scope and are part of the defined reset policy.

### FR-APP-053 — Lock-state treatment must be explicit

Whether package-manager lock state is retained or removed by Reset shall be an explicit policy decision defined below the Functional level or through effective configuration; AppManager shall not silently treat all lock state as disposable.

### FR-APP-054 — Durable source preservation

Reset shall preserve user-authored application source, durable project metadata, and unrelated project resources unless the use case explicitly and safely defines otherwise.

### FR-APP-055 — Consequential-operation confirmation

Where Reset removes dependency state, lock state, or other materially consequential resources, AppManager shall require the confirmation or explicit non-interactive authorisation mandated by the Application Invocation Functional Specification.

### FR-APP-056 — Reset confirmation must describe effect class

Human-facing confirmation for Reset shall communicate the material classes of state that will be removed rather than using ambiguous wording such as only "clean" or "reset".

### FR-APP-057 — Reset failure state

If Reset partially removes its intended state and then fails, AppManager shall report the resulting partial state rather than claiming that the environment is either unchanged or fully reset.

### FR-APP-058 — No implied universal rollback

Reset does not imply a universal rollback guarantee. Where atomicity or rollback is required, it shall be deliberately defined by lower-level specifications and surfaced through the invocation outcome.

---

## 13. Reinitialise

### 13.1 Purpose

Reinitialisation is a composed lifecycle use case intended to return the managed root application from an explicitly reset generated environment to a known development/build-ready state.

### FR-APP-059 — Reinitialise use case

AppManager shall provide a reinitialisation use case composed from approved reset, initialisation/install, and build lifecycle behaviour.

### FR-APP-060 — Defined sequencing

Reinitialisation shall execute its lifecycle stages in a defined order that preserves their functional dependencies.

### FR-APP-061 — No continuation after prerequisite failure

If a reinitialisation stage fails and a later stage depends on its successful completion, AppManager shall not silently continue to the dependent stage.

### FR-APP-062 — Reuse shared lifecycle semantics

Reinitialisation shall reuse the same functional semantics as the underlying lifecycle behaviours rather than defining a second independent implementation of reset, installation, or build policy.

### FR-APP-063 — Reinitialisation authorisation

Authorisation for the consequential reset portion of reinitialisation shall be obtained before that effect occurs and shall cover the material reset scope.

### FR-APP-064 — Reinitialisation result composition

The structured result shall identify the status of each lifecycle stage sufficiently to distinguish complete success, failure before consequential mutation, failure after reset, failure during preparation, build failure, cancellation, and partial completion where applicable.

### FR-APP-065 — Existing durable configuration preservation

Reinitialisation shall not recreate or overwrite durable user-managed project configuration merely because the operation resets generated installation/build state, unless an explicit underlying lifecycle requirement requires that change.

---

## 14. Create New Root Application

### 14.1 Purpose

Root-application creation scaffolds a brand-new AppManager-oriented root application. It is distinct from initialising an already-existing checkout.

### FR-APP-066 — Root-application creation use case

AppManager shall provide an `app` use case for creating a new root application suitable for subsequent management by AppManager.

### FR-APP-067 — Creation target identity

Before consequential creation begins, AppManager shall establish the intended target location and application identity sufficiently to prevent accidental creation into an unintended existing project.

### FR-APP-068 — Existing-project protection

AppManager shall not silently scaffold a new root application over an existing recognised project or an existing target that would cause unsafe replacement of user-owned content.

### FR-APP-069 — Non-empty target handling

Where the target already contains content that makes safe creation ambiguous, AppManager shall require an explicitly defined safe mode, disambiguation, or refusal rather than treating the location as an empty scaffold target.

### FR-APP-070 — Root application, not Nuxt layer

The creation use case defined here shall create a root application. Nuxt-layer creation is a distinct `nuxt` domain use case.

### FR-APP-071 — Generated artefact set

Root-application creation shall generate the project artefact classes required by the selected application profile and effective configuration.

The exact filenames, template functions, and file contents belong below the Functional level.

### FR-APP-072 — Version 1 generated artefact catalogue

AppManager shall be capable, where applicable to the selected profile, of generating project artefact classes including:

- package metadata;
- Nuxt configuration;
- TypeScript configuration;
- ignore rules;
- workspace configuration;
- environment/example configuration;
- licence content;
- README or introductory project documentation;
- other explicitly selected AppManager project-profile artefacts.

This catalogue describes functional capability classes and does not mandate a single fixed file set for every profile.

### FR-APP-073 — Profile-based creation

Where Version 1 exposes minimal, complete, or custom creation choices, each choice shall correspond to a documented functional project profile rather than merely changing hidden template implementation details.

### FR-APP-074 — Minimal profile

A minimal creation profile, if exposed, shall create only the artefacts and setup necessary to establish a valid supported root application baseline.

### FR-APP-075 — Complete profile

A complete creation profile, if exposed, may include additional approved AppManager project-management resources and development defaults beyond the minimal baseline.

### FR-APP-076 — Custom profile

A custom creation profile, if exposed, shall allow callers to select supported creation capabilities without permitting combinations that AppManager knows to be invalid or internally contradictory.

### FR-APP-077 — Effective configuration during creation

Project identity, author information, licence choice, repository defaults, package-management preferences, or similar configurable creation inputs shall use effective configuration or explicit invocation values according to Configuration Functional Specification semantics.

### FR-APP-078 — Sensitive configuration during creation

Root-application creation shall not embed secret values into generated shared project artefacts unless the relevant use case explicitly requires that behaviour and the configuration policy permits it.

### FR-APP-079 — Generation is not mutation

Creating new artefacts in a valid creation target shall follow generation semantics. If the creation workflow encounters an existing artefact that requires modification or replacement, that action becomes subject to the Source Transformation Functional Specification and applicable safety policy.

### FR-APP-080 — Internal AppManager project resources

Where a selected creation profile includes AppManager-owned project resources, those resources shall be distinguishable from user application source and shall follow the managed-project/configuration ownership model.

### FR-APP-081 — Layers container may be prepared without creating a layer

Root-application creation may prepare project structure intended to contain or reference future Nuxt layers, but it shall not thereby claim that a Nuxt layer has been created.

### FR-APP-082 — No placeholder relationship required without a relationship

AppManager shall not require an empty repository-relationship artefact solely to imply a future layer relationship when the underlying repository model does not require such an artefact until an actual relationship exists.

### FR-APP-083 — Optional local repository initialisation

Root-application creation may offer local repository initialisation as a coordinated follow-on behaviour when requested or enabled by the selected creation profile.

Repository semantics remain owned by the `git` domain.

### FR-APP-084 — Repository initialisation failure isolation

If optional repository initialisation fails after the root scaffold has been created successfully, AppManager shall report the scaffold state and repository failure distinctly rather than misrepresenting the entire target as nonexistent.

### FR-APP-085 — Optional dependency installation

Root-application creation may offer dependency installation as a follow-on lifecycle action.

### FR-APP-086 — Creation does not require dependency installation

A caller may complete root-application scaffolding without immediately installing dependencies where the selected profile and invocation permit that choice.

### FR-APP-087 — Creation postconditions

A successful root-application creation result shall identify the created application, selected profile or relevant creation choices, consequential follow-on actions completed, and any recommended next lifecycle actions.

### FR-APP-088 — Nuxt-layer next-step boundary

Where appropriate, AppManager may identify Nuxt-layer creation as a logical subsequent operation, but shall invoke or recommend the `nuxt` domain use case rather than embedding a separate layer-creation implementation in `app`.

### FR-APP-089 — Creation partial failure

If project creation partially succeeds, AppManager shall report what was created and what failed sufficiently to permit safe recovery, cleanup, or continuation.

### FR-APP-090 — No false atomicity claim

Unless lower-level specifications deliberately provide transactional creation, AppManager shall not imply that all project scaffolding is universally atomic.

---

## 15. Declared Project-Package-Script Execution

### 15.1 Purpose

A managed application's package metadata may expose project-defined scripts beyond the named lifecycle operations above. AppManager may execute those scripts as a bounded application capability without becoming a generic shell.

### FR-APP-091 — Declared-script execution use case

AppManager shall support execution of a selected script declared by the managed root application's recognised package metadata where supported by the project profile.

### FR-APP-092 — Script discovery

AppManager shall be able to expose the set of eligible project-declared scripts for discovery or explicit selection.

### FR-APP-093 — Declared scripts only

The generic `app` script-execution use case shall not treat an arbitrary caller-supplied shell command as equivalent to a project-declared package script.

### FR-APP-094 — Script identity validation

A requested script identity shall be validated against the managed project's recognised script declarations before execution.

### FR-APP-095 — Named lifecycle precedence

Where a project script corresponds to an AppManager-owned named lifecycle use case such as build, preview, or local development, callers may invoke that named use case to obtain the richer AppManager lifecycle semantics rather than relying on generic script execution.

### FR-APP-096 — Generic execution does not inherit unrelated lifecycle effects

Executing a declared script generically shall not silently add `app` lifecycle steps such as clean, reset, initialise, build, or repository synchronisation unless those effects are explicitly part of the invoked use case or project-declared script itself.

### FR-APP-097 — Consequential script warning or policy

Where AppManager can determine that a declared project script carries materially consequential effects, applicable confirmation, policy, and diagnostics shall be enforced according to the invocation and managed-scope authorities.

### FR-APP-098 — Project script result

The structured result shall identify the requested project script and its AppManager-level completion state without requiring machine callers to parse terminal output.

---

## 16. Safety and Non-Destructive Behaviour

### FR-APP-099 — Lifecycle safety classification

AppManager shall classify `app` lifecycle operations according to their material effect so that non-destructive, regenerable-state, and consequential reset/create behaviours can receive appropriate policy and confirmation treatment.

### FR-APP-100 — Preserve user ownership

`app` operations shall preserve unrelated user-authored source, project configuration, repository state, and external resources unless the invoked use case explicitly grants authority over those resources.

### FR-APP-101 — Discovery is not deletion authority

Discovery of caches, dependencies, build outputs, package files, repositories, layers, or other project resources shall not itself grant an `app` clean/reset operation authority to remove them.

### FR-APP-102 — Root-only lifecycle effects by default

Root-application lifecycle operations shall not automatically apply equivalent clean/reset/build/install effects to every managed layer unless a separate approved use case explicitly defines coordinated multi-target behaviour.

### FR-APP-103 — Destructive ambiguity fails safe

Where AppManager cannot determine whether a candidate clean/reset/create target is safely within the intended managed scope, it shall refuse the consequential effect or require explicit safe disambiguation rather than guessing.

### FR-APP-104 — External resources require domain authority

An `app` lifecycle operation shall not delete or create remote repositories, change remote repository policy, or otherwise mutate external resources except by invoking a separately authorised domain use case whose semantics explicitly require that effect.

---

## 17. Interaction-Mode Behaviour

### FR-APP-105 — Equivalent lifecycle semantics

TUI, Headless, GUI, IDE, CI, automation, and future interaction modes shall expose equivalent `app` lifecycle intent, validation, scope, safety, sequencing, and application-level outcome semantics.

### FR-APP-106 — Interactive menus are presentation

An interactive lifecycle menu may assist selection in TUI or GUI operation but shall not define lifecycle behaviour unavailable to structured Headless invocation.

### FR-APP-107 — Headless completeness

Every `app` use case intended for automation shall be invokable non-interactively when all required input, configuration, scope, and authorisation can be supplied or resolved without prompting.

### FR-APP-108 — Host context is input, not authority

An IDE or host-tool adapter may provide project location, selection, or other invocation context, but host context shall remain subject to AppManager project resolution and lifecycle validation.

### FR-APP-109 — Human presentation is not the result contract

Lifecycle success, failure, partial completion, cancellation, and diagnostics shall be available through structured invocation outcomes and shall not exist only as terminal text.

---

## 18. Cancellation, Failure, and Partial Completion

### FR-APP-110 — Cancellation before consequential effect

Where an `app` operation is cancelled before consequential effects begin, AppManager shall not intentionally perform those effects.

### FR-APP-111 — Cancellation after effects begin

Where cancellation occurs after lifecycle effects have begun, AppManager shall report the actual resulting state according to the applicable invocation and partial-completion semantics.

### FR-APP-112 — Lifecycle stage diagnostics

For composed lifecycle operations, diagnostics shall identify the stage at which failure or cancellation occurred where that information materially affects recovery.

### FR-APP-113 — No silent continuation

A composed `app` workflow shall not silently continue through stages whose functional preconditions have been invalidated by an earlier failure.

### FR-APP-114 — No false successful completion

An operation shall not be reported as successful merely because its final attempted delegated process exited successfully when required earlier lifecycle stages failed, were skipped impermissibly, or left invalid postconditions.

### FR-APP-115 — Recovery information

Where an `app` lifecycle failure leaves a recoverable intermediate state, AppManager should expose sufficient structured information for a caller to determine an appropriate retry, continuation, or repair action without implying that automatic recovery is always possible.

---

## 19. Relationship to Other Functional Domains

### 19.1 `nuxt`

The `nuxt` domain owns Nuxt-specific management use cases, including Nuxt-layer creation/provisioning and Nuxt-configuration behaviour. `app` may coordinate or recommend those operations but shall not duplicate them.

### 19.2 `git`

The `git` domain owns repository initialisation, repository relationships, commit semantics, remote operations, push, synchronisation, and destructive repository actions. `app` may include optional Git follow-on steps in a lifecycle workflow only by delegating to `git` semantics.

### 19.3 `settings` and configuration

The `settings` domain owns user-facing inspection and mutation of settings. The Configuration Functional Specification owns candidate-to-effective resolution. `app` consumes effective configuration and shall not create its own precedence model.

### 19.4 `quality`

Build is an application lifecycle use case and therefore remains in `app`. Tests, linting, type checking, coverage, and quality gates belong to `quality` even when they are commonly run near a build.

### 19.5 `docs`

README or introductory project documentation generated as part of a new-project scaffold may be a creation artefact. Ongoing documentation generation and maintenance belong to `docs`.

### 19.6 `ai`

AI may assist creation or lifecycle workflows only as a delegated capability and shall remain non-authoritative. AI-specific user-facing operations belong to `ai`.

### 19.7 `utils`

Generic lifecycle execution, cleaning, reset, or project-package-script execution shall not be moved into `utils` merely because they use reusable low-level mechanisms. Their product identity remains `app`.

---

## 20. Traceability

| Functional requirement range | Root Design authority | Current cross-cutting authority |
|---|---|---|
| `FR-APP-001`–`FR-APP-012` | Sections 1, 2, 5, 6, 10.1, 12 | `FR-INV-*`, `FR-PROJ-*`, `FR-CONFIG-*`; decomposition plan §5.1 |
| `FR-APP-013`–`FR-APP-024` | Sections 2, 5, 8, 9, 10.1, 12 | This specification §6; `FR-INV-*`, `FR-PROJ-*`, `FR-CONFIG-*` |
| `FR-APP-025`–`FR-APP-028` | Sections 5, 10.1, 12.9 | This specification §7; Process Execution boundary |
| `FR-APP-029`–`FR-APP-033` | Sections 4, 5, 10.1, 12.9 | This specification §8; `FR-INV-*` |
| `FR-APP-034`–`FR-APP-038` | Sections 5, 10.1, 12 | This specification §9; `FR-XFORM-*` |
| `FR-APP-039`–`FR-APP-042` | Sections 4, 5, 10.1, 12 | This specification §10; `FR-INV-*` |
| `FR-APP-043`–`FR-APP-049` | Sections 5, 9, 10.1, 12 | This specification §11; `FR-PROJ-*` |
| `FR-APP-050`–`FR-APP-058` | Sections 5, 9, 10.1, 12 | This specification §12; `FR-INV-*`, `FR-PROJ-*` |
| `FR-APP-059`–`FR-APP-065` | Sections 5, 6, 10.1, 12 | This specification §13; Application Engine workflow authority |
| `FR-APP-066`–`FR-APP-090` | Sections 1, 2, 6.7, 8, 9, 10.1, 12.5 | This specification §14; `FR-CONFIG-*`, `FR-XFORM-*`, Git/Nuxt ownership boundaries |
| `FR-APP-091`–`FR-APP-098` | Sections 5, 10.1, 12.9 | This specification §15; Process Execution boundary |
| `FR-APP-099`–`FR-APP-104` | Sections 2.3, 9, 12 | This specification §16; `FR-PROJ-*`, `FR-XFORM-*` |
| `FR-APP-105`–`FR-APP-109` | Section 4 | This specification §17; `FR-INV-*` |
| `FR-APP-110`–`FR-APP-115` | Sections 5, 11, 12 | This specification §18; `FR-INV-*`; Application Engine workflow authority |

ADR-0001 selects Node.js/TypeScript for Version 1 implementation but does not materially alter the technology-independent Functional requirements in this document.

---

## 21. Conformance Criteria

An implementation conforms to this Functional Specification only if it satisfies all applicable requirements and, at minimum, demonstrates that:

1. `app` use cases represent root-application lifecycle intent rather than exposing implementation mechanisms as product semantics;
2. existing-project initialisation is distinct from new-project creation;
3. initialisation preserves existing user-managed environment material and does not fabricate secrets;
4. development, build, preview, and post-install operations are based on recognised project lifecycle capability rather than universal hard-coded command assumptions at the Functional level;
5. Clean is materially less destructive than Reset/Empty;
6. clean/reset targets cannot escape managed scope merely because matching resources are discoverable;
7. Reset/Empty receives appropriate authorisation and reports partial state accurately;
8. Reinitialise composes existing lifecycle semantics and aborts dependent stages after prerequisite failure;
9. root-application creation refuses unsafe overwrite of an existing project or ambiguous non-empty target;
10. minimal/complete/custom choices, if exposed, are coherent project profiles rather than arbitrary hidden implementation switches;
11. root creation can generate the required project artefact classes without prescribing a single universal file set at the Functional level;
12. generation of new artefacts is distinguished from mutation/replacement of existing source;
13. optional Git initialisation delegates repository semantics to the Git domain;
14. root creation does not duplicate Nuxt-layer creation;
15. project-package-script execution is limited to recognised declared scripts rather than arbitrary shell execution;
16. lifecycle operations preserve unrelated user-authored source and project resources;
17. layer/repository discovery does not cause root lifecycle operations to expand their scope implicitly;
18. Headless callers can invoke supported `app` use cases deterministically without interaction-only business logic;
19. structured outcomes distinguish application-level success, failure, cancellation, and partial completion without requiring terminal-output parsing;
20. delegated providers do not acquire authority over AppManager lifecycle policy or final outcomes.

---

## 22. Downstream Detailed Design Requirements

Detailed Design Specifications derived from this Functional Specification may define, among other matters:

- canonical command identities and command metadata for `app` use cases;
- lifecycle action models and internal composition contracts;
- package-manager capability boundaries;
- project-script discovery and validation contracts;
- process execution contracts and long-running process lifecycle handling;
- clean/reset target-class resolution;
- lock-state policy and configurability;
- initialisation step composition and idempotence mechanisms;
- environment-example copy behaviour and sensitive-data safeguards;
- root project profile schemas;
- generation-plan models;
- generated artefact inventories per profile;
- template/resource provider contracts;
- staging, transactional creation, rollback, or recovery design where adopted;
- optional Git-domain coordination contracts;
- delegated Nuxt-domain follow-on contracts;
- lifecycle progress-event models;
- failure and partial-result models;
- concurrency protections where lifecycle operations could conflict.

Detailed Design shall preserve the authority boundaries in this document rather than collapsing lifecycle intent into low-level service ownership.

---

## 23. Downstream Implementation Specification Requirements

Implementation Specifications may map the approved Detailed Design to concrete Version 1 technology, including:

- Node.js/TypeScript modules and package structure;
- concrete command files and registries;
- package-manager detection and invocation implementation;
- child-process APIs;
- exact clean/reset filesystem targets;
- concrete lockfile handling;
- concrete Nuxt build/dev/preview script mappings;
- template source files and functions;
- generated filenames;
- Git libraries and APIs;
- current source wiring;
- tests and fixtures;
- logging and diagnostics implementations.

Those implementation choices shall satisfy this Functional Specification rather than redefining it.