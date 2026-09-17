# AppManager App Functional Specification

> **Status:** Version 1 Functional Specification
>
> **Functional authority:** Observable application-level behaviour for AppManager root-application lifecycle operations, managed-project initialisation, project lifecycle execution, environment cleanup and reset, root-application creation, and bounded project-package-script execution.
>
> **Governing authorities:** [Project Documentation Guide](../project-documentation-guide-v01.md), [AppManager Design Specification](../appmanager-design-specification-v01.md)
>
> **Related Functional Specifications:** [application-invocation-functional-specification-v01.md](application-invocation-functional-specification-v01.md), [managed-project-functional-specification-v01.md](managed-project-functional-specification-v01.md), [configuration-functional-specification-v01.md](configuration-functional-specification-v01.md), [source-transformation-functional-specification-v01.md](source-transformation-functional-specification-v01.md)
>
> **Historical planning provenance (non-normative):** [docs/project_management/functional-specification-decomposition-plan-v01.md](../project_management/functional-specification-decomposition-plan-v01.md)

---

## 1. Purpose

This specification defines the observable Version 1 behaviour of the AppManager `app` functional domain.

The `app` domain owns use cases whose primary product identity is the lifecycle of the managed root application or the creation of a new root application. It does not own the shared mechanics by which AppManager resolves invocation semantics, managed-project context, effective configuration, source transformation, Git policy, Nuxt-specific configuration, quality execution, documentation, AI behaviour, or settings management.

The governing question for this document is:

> **What application-lifecycle behaviour must AppManager provide for a managed root application?**

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

The workflows below follow an existing checkout through preparation, development, build/preview, clean/reset and re-preparation, and separately describe new-root creation. Their product placement is defined in [Design §10.3](../appmanager-design-specification-v01.md#_10-3-app-domain).

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

The owning requirements below define the applicable local contract.

### 4.3 Relationship to Nuxt-layer creation

A root creation workflow may recommend or coordinate [Nuxt layer creation](nuxt-functional-specification-v01.md#fr-nuxt-051) as its next step under FR-APP-070 and FR-APP-088.

### 4.4 Relationship to project-package scripts

Declared-script execution supports the lifecycle model under [§4.6](#_4-6-canonical-version-1-command-surface). Its bounded selection and execution contract is in §15.

### 4.5 Cross-cutting authority

The following remain authoritative in their respective cross-cutting specifications:

- invocation, availability, confirmation, cancellation, partial success, structured outcomes, and interaction-mode equivalence: `FR-INV-*`;
- managed-project context, root identity, managed scope, recognition, and mutation authority: `FR-PROJ-*`;
- candidate and effective configuration semantics: `FR-CONFIG-*`;
- generated artefact versus existing-source mutation behaviour, bounded transformation, validation, and application acceptance: `FR-XFORM-*`.

This specification references those behaviours and adds only `app`-specific requirements.

---

### 4.6 Canonical Version 1 Command Surface

| Canonical identity | Behavioural owner |
|---|---|
| `app.create` | §14, new root application |
| `app.prepare` | §6, existing-application readiness |
| `app.develop` | §8, local development |
| `app.build` | §9, build |
| `app.preview` | §10, production-build preview |
| `app.generate` | §10.1, generation/prerender |
| `app.clean` | §11, regenerable cache/build cleanup |
| `app.reset` | §12, broader regenerable installation/build reset |

These eight identities are the App catalogue. `app.initialise` is replaced by `app.prepare`. Post-install behaviour (§7) is a subordinate creation/preparation/dependency stage; `app.post-install` is not a public command. Re-preparation (§13) composes reset and prepare, with build when required by the selected workflow; `app.reinitialise` is not a separate command. A convenience adapter action does not add an identity. Declared-script execution (§15) is supporting functionality, not a canonical `app.run-script` command or a namespace of discovered scripts.

---

## 5. General App-Domain Requirements

<a id="fr-app-001"></a>

### FR-APP-001 — Coherent app-domain semantics
App invocation paths shall apply [Design §4.6](../appmanager-design-specification-v01.md#_4-6-presentation-independence).

<a id="fr-app-002"></a>

### FR-APP-002 — Application Engine authority
App lifecycle orchestration shall conform to [Design §6.2](../appmanager-design-specification-v01.md#_6-2-application-engine-authority), [Design §11.11](../appmanager-design-specification-v01.md#_11-11-workflow-results-failure-and-acceptance).

<a id="fr-app-003"></a>

### FR-APP-003 — Domain operations represent application intent
App lifecycle/root-creation intent shall conform to [Design §5.1](../appmanager-design-specification-v01.md#_5-1-domain-oriented-command-model) and the provider boundary in [Design §6.6](../appmanager-design-specification-v01.md#_6-6-capability-boundaries-and-providers).

<a id="fr-app-004"></a>

### FR-APP-004 — Managed project required for existing-project lifecycle operations
Existing-project lifecycle readiness shall apply [Design §9.6](../appmanager-design-specification-v01.md#_9-6-project-discovery-and-context-resolution).

<a id="fr-app-005"></a>

### FR-APP-005 — Root application targeting

Existing-project lifecycle operations owned by `app` shall target the managed root application unless a use case explicitly defines a narrower valid target.

<a id="fr-app-006"></a>

### FR-APP-006 — No implicit scope expansion
Root-application lifecycle scope shall apply [FR-PROJ-042](managed-project-functional-specification-v01.md#fr-proj-042).

<a id="fr-app-007"></a>

### FR-APP-007 — Capability delegation is subordinate
Package manager, process, filesystem, Git, generation and Nuxt delegation shall conform to [Design §6.2](../appmanager-design-specification-v01.md#_6-2-application-engine-authority), [Design §11.11](../appmanager-design-specification-v01.md#_11-11-workflow-results-failure-and-acceptance).

<a id="fr-app-008"></a>

### FR-APP-008 — Effective configuration consumption
Configurable lifecycle inputs shall apply [FR-CONFIG-020](configuration-functional-specification-v01.md#fr-config-020).

<a id="fr-app-009"></a>

### FR-APP-009 — Availability is use-case specific
Lifecycle availability for the resolved project context shall apply [FR-INV-014](application-invocation-functional-specification-v01.md#fr-inv-014).

<a id="fr-app-010"></a>

### FR-APP-010 — Unavailable is not unknown
Recognised App operations whose preconditions are unmet shall apply [FR-INV-015](application-invocation-functional-specification-v01.md#fr-inv-015).

<a id="fr-app-011"></a>

### FR-APP-011 — Observable precondition failures

When an `app` operation cannot proceed because required project metadata, lifecycle capability, configuration, or target state is absent or invalid, AppManager shall provide structured diagnostics identifying the unmet functional precondition.

<a id="fr-app-012"></a>

### FR-APP-012 — Lower-level success is not automatically app success
Delegated App-stage completion shall apply [FR-INV-034](application-invocation-functional-specification-v01.md#fr-inv-034).

---

## 6. Prepare Existing Application Environment

### 6.1 Purpose

In this specification, existing-project initialisation means the preparation behaviour invoked by `app.prepare`.

It is distinct from creation of a brand-new application.

<a id="fr-app-013"></a>

### FR-APP-013 — Existing-project initialisation use case

AppManager shall provide an `app` use case that initialises an existing managed root application environment.

<a id="fr-app-014"></a>

### FR-APP-014 — Initialisation shall not scaffold over an existing project

Initialisation shall treat the resolved project as an existing application to prepare, not as a target to replace with a newly generated root scaffold.

<a id="fr-app-015"></a>

### FR-APP-015 — Dependency readiness

Where dependency installation or restoration is required to make the managed application development-ready, initialisation shall arrange for that lifecycle step through the appropriate delegated capability.

<a id="fr-app-016"></a>

### FR-APP-016 — Existing environment-example material
Where preparation requires a missing local environment definition from an established project example, App shall coordinate [Settings FR-SET-060](settings-functional-specification-v01.md#fr-set-060). App supplies or resolves the managed project, intended definition and approved example/default source, sequences this step with dependency readiness, and interprets the Settings result for lifecycle completion.

<a id="fr-app-017"></a>

### FR-APP-017 — No secret fabrication

Initialisation shall not invent secret values merely to make an environment artefact appear complete.

Where user-supplied or externally supplied sensitive values remain required, AppManager shall report that requirement without falsely claiming the environment is fully configured.

<a id="fr-app-018"></a>

### FR-APP-018 — Existing environment preservation
Preparation shall consume the existing-definition disposition required by [FR-SET-061](settings-functional-specification-v01.md#fr-set-061); it shall not bypass that protection through an alternate copy path. An explicitly authorised replacement uses the Settings-owned operation.

<a id="fr-app-019"></a>

### FR-APP-019 — Managed repository relationship readiness

Where existing managed repository relationships are required for the application to be development-ready, initialisation may coordinate the appropriate Git-domain behaviour rather than implementing independent repository synchronisation semantics.

<a id="fr-app-020"></a>

### FR-APP-020 — Optional development-environment artefacts

Project-local development-environment artefacts may be provisioned during initialisation only where they are part of an approved AppManager project profile or explicit invocation intent.

They shall not be treated as universal requirements of every managed project.

<a id="fr-app-021"></a>

### FR-APP-021 — Host-tool neutrality

Initialisation shall not require a particular IDE or editor in order for the application to be considered successfully initialised.

<a id="fr-app-022"></a>

### FR-APP-022 — Initialisation completion criteria

A successful initialisation outcome shall identify the lifecycle preparation steps that completed and any remaining user action required before the application is fully usable.

<a id="fr-app-023"></a>

### FR-APP-023 — Initialisation partial completion
Incomplete multi-stage preparation shall apply [FR-INV-036](application-invocation-functional-specification-v01.md#fr-inv-036). The result shall identify completed and incomplete preparation stages.

<a id="fr-app-024"></a>

### FR-APP-024 — Idempotent-safe behaviour where practical

Repeated initialisation shall avoid unnecessary destructive replacement of already-valid user-managed artefacts and shall treat previously satisfied preparation steps as already satisfied where the use case permits.

---

## 7. Post-Installation Lifecycle Behaviour

<a id="fr-app-025"></a>

### FR-APP-025 — Post-installation use case
AppManager shall support the managed root application's declared post-installation behaviour as a subordinate preparation, creation or dependency-readiness stage under §4.6.

<a id="fr-app-026"></a>

### FR-APP-026 — Declaration-aware availability

Where no applicable project post-installation action is declared, AppManager shall either make the use case unavailable or report explicitly that no such lifecycle action exists; absence shall not be treated as an opaque process failure.

<a id="fr-app-027"></a>

### FR-APP-027 — Project declaration is the source of action identity

Post-installation execution shall be based on the managed project's declared lifecycle behaviour rather than on an AppManager hard-coded assumption that every project contains the same script or mechanism.

<a id="fr-app-028"></a>

### FR-APP-028 — Structured completion

Post-installation execution shall expose structured success or failure at the `app` use-case level, including delegated execution diagnostics where relevant.

---

## 8. Local Development Execution

<a id="fr-app-029"></a>

### FR-APP-029 — Local development use case

AppManager shall provide an `app` use case for starting the managed root application's local development execution where the project supports such a lifecycle action.

<a id="fr-app-030"></a>

### FR-APP-030 — Long-running operation semantics

Local development execution shall be treated as a potentially long-running lifecycle operation and shall support appropriate progress, execution-state, and cancellation behaviour through the Application Invocation Contract where supported.

<a id="fr-app-031"></a>

### FR-APP-031 — Project-defined lifecycle mapping

The concrete mechanism used to start local development shall be resolved from the managed project and effective configuration rather than being defined by this Functional Specification as a fixed command string.

<a id="fr-app-032"></a>

### FR-APP-032 — Delegated termination interpretation

Termination of the delegated development process shall be interpreted by AppManager as an application-level completion, cancellation, or failure according to the reason and invocation state rather than solely by terminal presentation.

<a id="fr-app-033"></a>

### FR-APP-033 — No interaction-only dependency
Headless local-development invocation shall apply [FR-INV-020](application-invocation-functional-specification-v01.md#fr-inv-020).

---

## 9. Build

<a id="fr-app-034"></a>

### FR-APP-034 — Build use case

AppManager shall provide an `app` use case for building the managed root application where the project supports a build lifecycle action.

<a id="fr-app-035"></a>

### FR-APP-035 — Build availability

A build operation shall be unavailable or shall fail with a specific precondition diagnostic when the managed project does not define or support an applicable build lifecycle.

<a id="fr-app-036"></a>

### FR-APP-036 — Build result

The build outcome shall distinguish at least successful build completion from delegated execution failure and AppManager-level rejection or invalid postcondition where applicable.

<a id="fr-app-037"></a>

### FR-APP-037 — Build artefact assumptions are lower-level

This specification shall not require a universal build-output directory or artefact layout. Any such expectation shall come from project context, effective configuration, Nuxt-specific behaviour, or lower-level specifications.

<a id="fr-app-038"></a>

### FR-APP-038 — Build does not silently mutate unrelated source
AppManager-controlled source changes during build shall apply [FR-XFORM-014](source-transformation-functional-specification-v01.md#fr-xform-014).

---

## 10. Preview

<a id="fr-app-039"></a>

### FR-APP-039 — Preview use case

AppManager shall provide an `app` use case for previewing the managed root application where the project supports an applicable preview lifecycle action.

<a id="fr-app-040"></a>

### FR-APP-040 — Preview prerequisite behaviour

Where preview requires a prior build or another project-specific prerequisite, AppManager shall either validate that prerequisite before execution or allow the delegated lifecycle action to establish the failure, but the chosen behaviour shall be deterministic and documented at the appropriate lower specification level.

<a id="fr-app-041"></a>

### FR-APP-041 — No universal output-layout assumption
Preview build-output assumptions shall apply [FR-APP-037](app-functional-specification-v01.md#fr-app-037).

<a id="fr-app-042"></a>

### FR-APP-042 — Long-running preview semantics
Long-running preview shall apply [FR-APP-030](app-functional-specification-v01.md#fr-app-030), [FR-APP-032](app-functional-specification-v01.md#fr-app-032).

---

### 10.1 Generation / Prerender

<a id="fr-app-116"></a>

**FR-APP-116 — Generate lifecycle use case**

AppManager shall provide `app.generate` for generation/prerender of the managed root application where supported. Its mechanism shall be resolved from project evidence and effective configuration under FR-APP-008 rather than fixed provider syntax. The common lifecycle availability, safety and result requirements apply to this operation.

---

## 11. Clean Regenerable Application State

### 11.1 Purpose

Clean removes regenerable application state that is not intended to represent durable user source or project ownership.

It is intentionally less destructive than reset/empty behaviour.

<a id="fr-app-043"></a>

### FR-APP-043 — Clean use case

AppManager shall provide an `app` use case for cleaning recognised regenerable cache or build state associated with the managed root application.

<a id="fr-app-044"></a>

### FR-APP-044 — Clean target classification

The clean operation shall act only on resource classes classified by AppManager as safely regenerable for that use case.

<a id="fr-app-045"></a>

### FR-APP-045 — Clean shall preserve dependencies and durable source by default

Clean shall not, by default, remove installed dependency state, package-manager lock state, user-authored application source, project metadata, repositories, or other durable resources that belong to the stronger reset/empty or explicitly destructive use cases.

<a id="fr-app-046"></a>

### FR-APP-046 — Clean target resolution

Concrete clean targets shall be resolved through project knowledge and lower-level design rather than encoded in this Functional Specification as a universal path list.

<a id="fr-app-047"></a>

### FR-APP-047 — Missing clean targets are not necessarily failures

A recognised clean target that is already absent may be treated as already clean rather than as an operation failure, provided no contradictory project condition exists.

<a id="fr-app-048"></a>

### FR-APP-048 — Clean shall not escape managed scope
Clean candidates resembling cache/build artefacts outside the approved root scope shall apply [Design §9.9](../appmanager-design-specification-v01.md#_9-9-non-destructive-ownership-and-unmanaged-content).

<a id="fr-app-049"></a>

### FR-APP-049 — Clean outcome

The clean result shall report the resource classes or targets affected, skipped, already absent, or failed sufficiently for the caller to understand the resulting application state.

---

## 12. Reset / Empty Generated Installation and Build State

### 12.1 Purpose

Reset or Empty is a stronger lifecycle operation than Clean. It removes regenerable application state sufficiently broadly that dependency installation and subsequent build preparation may be required again.

<a id="fr-app-050"></a>

### FR-APP-050 — Reset use case

AppManager shall provide a deliberately stronger `app` lifecycle use case for resetting regenerable installation and build state where supported.

<a id="fr-app-051"></a>

### FR-APP-051 — Functional distinction from Clean

Reset shall be functionally distinct from Clean and shall not be presented as merely an alias for the same effect set.

<a id="fr-app-052"></a>

### FR-APP-052 — Reset may remove dependency-installation state

Reset may remove installed dependency state and other regenerable installation artefacts when they are within the approved managed scope and are part of the defined reset policy.

<a id="fr-app-053"></a>

### FR-APP-053 — Lock-state treatment must be explicit

Whether package-manager lock state is retained or removed by Reset shall be an explicit policy decision defined below the Functional level or through effective configuration; AppManager shall not silently treat all lock state as disposable.

<a id="fr-app-054"></a>

### FR-APP-054 — Durable source preservation
Reset of regenerable installation/build state shall apply [Design §9.9](../appmanager-design-specification-v01.md#_9-9-non-destructive-ownership-and-unmanaged-content).

<a id="fr-app-055"></a>

### FR-APP-055 — Consequential-operation confirmation
Reset removing dependency, lock or other materially consequential state shall apply [FR-INV-023](application-invocation-functional-specification-v01.md#fr-inv-023), [FR-INV-022](application-invocation-functional-specification-v01.md#fr-inv-022).

<a id="fr-app-056"></a>

### FR-APP-056 — Reset confirmation must describe effect class

Human-facing confirmation for Reset shall communicate the material classes of state that will be removed rather than using ambiguous wording such as only "clean" or "reset".

<a id="fr-app-057"></a>

### FR-APP-057 — Reset failure state

If Reset partially removes its intended state and then fails, AppManager shall report the resulting partial state rather than claiming that the environment is either unchanged or fully reset.

<a id="fr-app-058"></a>

### FR-APP-058 — No implied universal rollback
Reset rollback claims shall apply [FR-INV-046](application-invocation-functional-specification-v01.md#fr-inv-046).

---

## 13. Reinitialise

### 13.1 Purpose

Reinitialisation is a composed lifecycle use case intended to return the managed root application from an explicitly reset generated environment to a known development/build-ready state.

<a id="fr-app-059"></a>

### FR-APP-059 — Reinitialise use case
AppManager shall support reset followed by preparation as a composition of `app.reset` and `app.prepare`, including approved build behaviour where the selected workflow requires it. The stage requirements below apply without establishing an additional canonical command.

<a id="fr-app-060"></a>

### FR-APP-060 — Defined sequencing

Reinitialisation shall execute its lifecycle stages in a defined order that preserves their functional dependencies.

<a id="fr-app-061"></a>

### FR-APP-061 — No continuation after prerequisite failure
Dependent re-preparation stages shall apply [FR-APP-113](app-functional-specification-v01.md#fr-app-113).

<a id="fr-app-062"></a>

### FR-APP-062 — Reuse shared lifecycle semantics

Reinitialisation shall reuse the same functional semantics as the underlying lifecycle behaviours rather than defining a second independent implementation of reset, installation, or build policy.

<a id="fr-app-063"></a>

### FR-APP-063 — Reinitialisation authorisation

Authorisation for the consequential reset portion of reinitialisation shall be obtained before that effect occurs and shall cover the material reset scope.

<a id="fr-app-064"></a>

### FR-APP-064 — Reinitialisation result composition

The structured result shall identify the status of each lifecycle stage sufficiently to distinguish complete success, failure before consequential mutation, failure after reset, failure during preparation, build failure, cancellation, and partial completion where applicable.

<a id="fr-app-065"></a>

### FR-APP-065 — Existing durable configuration preservation
Durable configuration during re-preparation shall apply [Design §9.9](../appmanager-design-specification-v01.md#_9-9-non-destructive-ownership-and-unmanaged-content).

---

## 14. Create New Root Application

### 14.1 Purpose

Root-application creation scaffolds a brand-new AppManager-oriented root application. It is distinct from initialising an already-existing checkout.

<a id="fr-app-066"></a>

### FR-APP-066 — Root-application creation use case
AppManager shall provide `app.create` to create a new root application suitable for management by AppManager. The creation workflow shall complete the selected profile's ordinary readiness obligations without requiring a second `app.prepare` invocation. Optional/deferred dependency installation remains governed by FR-APP-085–086.

<a id="fr-app-067"></a>

### FR-APP-067 — Creation target identity

Before consequential creation begins, AppManager shall establish the intended target location and application identity sufficiently to prevent accidental creation into an unintended existing project.

<a id="fr-app-068"></a>

### FR-APP-068 — Existing-project protection

AppManager shall not silently scaffold a new root application over an existing recognised project or an existing target that would cause unsafe replacement of user-owned content.

<a id="fr-app-069"></a>

### FR-APP-069 — Non-empty target handling

Where the target already contains content that makes safe creation ambiguous, AppManager shall require an explicitly defined safe mode, disambiguation, or refusal rather than treating the location as an empty scaffold target.

<a id="fr-app-070"></a>

### FR-APP-070 — Root application, not Nuxt layer

The creation use case defined here shall create a root application. Nuxt-layer creation is a distinct `nuxt` domain use case.

<a id="fr-app-071"></a>

### FR-APP-071 — Generated artefact set

Root-application creation shall generate the project artefact classes required by the selected application profile and effective configuration.

The exact filenames, template functions, and file contents belong below the Functional level.

<a id="fr-app-072"></a>

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

<a id="fr-app-073"></a>

### FR-APP-073 — Profile-based creation

Where Version 1 exposes minimal, complete, or custom creation choices, each choice shall correspond to a documented functional project profile rather than merely changing hidden template implementation details.

<a id="fr-app-074"></a>

### FR-APP-074 — Minimal profile

A minimal creation profile, if exposed, shall create only the artefacts and setup necessary to establish a valid supported root application baseline.

<a id="fr-app-075"></a>

### FR-APP-075 — Complete profile

A complete creation profile, if exposed, may include additional approved AppManager project-management resources and development defaults beyond the minimal baseline.

<a id="fr-app-076"></a>

### FR-APP-076 — Custom profile

A custom creation profile, if exposed, shall allow callers to select supported creation capabilities without permitting combinations that AppManager knows to be invalid or internally contradictory.

<a id="fr-app-077"></a>

### FR-APP-077 — Effective configuration during creation
Creation identity, author, licence, repository and package-management inputs shall apply [FR-CONFIG-020](configuration-functional-specification-v01.md#fr-config-020).

<a id="fr-app-078"></a>

### FR-APP-078 — Sensitive configuration during creation

Root-application creation shall not embed secret values into generated shared project artefacts unless the relevant use case explicitly requires that behaviour and the configuration policy permits it.

<a id="fr-app-079"></a>

### FR-APP-079 — Generation is not mutation
Creation destinations, including collisions with existing artefacts shall apply [Design §6.8](../appmanager-design-specification-v01.md#_6-8-generation-and-templates).

<a id="fr-app-080"></a>

### FR-APP-080 — Internal AppManager project resources

Where a selected creation profile includes AppManager-owned project resources, those resources shall be distinguishable from user application source and shall follow the managed-project/configuration ownership model.

<a id="fr-app-081"></a>

### FR-APP-081 — Layers container may be prepared without creating a layer

Root-application creation may prepare project structure intended to contain or reference future Nuxt layers, but it shall not thereby claim that a Nuxt layer has been created.

<a id="fr-app-082"></a>

### FR-APP-082 — No placeholder relationship required without a relationship

AppManager shall not require an empty repository-relationship artefact solely to imply a future layer relationship when the underlying repository model does not require such an artefact until an actual relationship exists.

<a id="fr-app-083"></a>

### FR-APP-083 — Optional local repository initialisation

Root-application creation may offer local repository initialisation as a coordinated follow-on behaviour when requested or enabled by the selected creation profile.

Repository semantics remain owned by the `git` domain.

<a id="fr-app-084"></a>

### FR-APP-084 — Repository initialisation failure isolation

If optional repository initialisation fails after the root scaffold has been created successfully, AppManager shall report the scaffold state and repository failure distinctly rather than misrepresenting the entire target as nonexistent.

<a id="fr-app-085"></a>

### FR-APP-085 — Optional dependency installation

Root-application creation may offer dependency installation as a follow-on lifecycle action.

<a id="fr-app-086"></a>

### FR-APP-086 — Creation does not require dependency installation

A caller may complete root-application scaffolding without immediately installing dependencies where the selected profile and invocation permit that choice.

<a id="fr-app-087"></a>

### FR-APP-087 — Creation postconditions

A successful root-application creation result shall identify the created application, selected profile or relevant creation choices, consequential follow-on actions completed, and any recommended next lifecycle actions.

<a id="fr-app-088"></a>

### FR-APP-088 — Nuxt-layer next-step boundary
Layer-creation recommendations or follow-on steps shall apply [FR-APP-070](app-functional-specification-v01.md#fr-app-070).

<a id="fr-app-089"></a>

### FR-APP-089 — Creation partial failure

If project creation partially succeeds, AppManager shall report what was created and what failed sufficiently to permit safe recovery, cleanup, or continuation.

<a id="fr-app-090"></a>

### FR-APP-090 — No false atomicity claim
Root-scaffolding transactionality claims shall apply [FR-INV-046](application-invocation-functional-specification-v01.md#fr-inv-046).

---

## 15. Declared Project-Package-Script Execution

### 15.1 Purpose

A managed application's package metadata may expose project-defined scripts beyond the named lifecycle operations above. AppManager may execute those scripts as a bounded application capability without becoming a generic shell.

<a id="fr-app-091"></a>

### FR-APP-091 — Declared-script execution use case

AppManager shall support execution of a selected script declared by the managed root application's recognised package metadata where supported by the project profile.

<a id="fr-app-092"></a>

### FR-APP-092 — Script discovery

AppManager shall be able to expose the set of eligible project-declared scripts for discovery or explicit selection.

<a id="fr-app-093"></a>

### FR-APP-093 — Declared scripts only

The generic `app` script-execution use case shall not treat an arbitrary caller-supplied shell command as equivalent to a project-declared package script.

<a id="fr-app-094"></a>

### FR-APP-094 — Script identity validation
A requested script shall be explicitly selected and validated against recognised project declarations and applicable revision evidence before execution. The facility shall use the recognised package-manager/provider boundary. Named lifecycle commands may consume this facility where appropriate.

<a id="fr-app-095"></a>

### FR-APP-095 — Named lifecycle precedence

Where a project script corresponds to an AppManager-owned named lifecycle use case such as build, preview, or local development, callers may invoke that named use case to obtain the richer AppManager lifecycle semantics rather than relying on generic script execution.

<a id="fr-app-096"></a>

### FR-APP-096 — Generic execution does not inherit unrelated lifecycle effects

Executing a declared script generically shall not silently add `app` lifecycle steps such as clean, reset, initialise, build, or repository synchronisation unless those effects are explicitly part of the invoked use case or project-declared script itself.

<a id="fr-app-097"></a>

### FR-APP-097 — Consequential script warning or policy

Where AppManager can determine that a declared project script carries materially consequential effects, applicable confirmation, policy, and diagnostics shall be enforced according to the invocation and managed-scope authorities.

<a id="fr-app-098"></a>

### FR-APP-098 — Project script result

The structured result shall identify the requested project script and its AppManager-level completion state without requiring machine callers to parse terminal output.

---

## 16. Safety and Non-Destructive Behaviour

<a id="fr-app-099"></a>

### FR-APP-099 — Lifecycle safety classification

AppManager shall classify `app` lifecycle operations according to their material effect so that non-destructive, regenerable-state, and consequential reset/create behaviours can receive appropriate policy and confirmation treatment.

<a id="fr-app-100"></a>

### FR-APP-100 — Preserve user ownership
App lifecycle effects shall apply [Design §9.9](../appmanager-design-specification-v01.md#_9-9-non-destructive-ownership-and-unmanaged-content).

<a id="fr-app-101"></a>

### FR-APP-101 — Discovery is not deletion authority
Discovered clean/reset candidates shall apply [Design §9.9](../appmanager-design-specification-v01.md#_9-9-non-destructive-ownership-and-unmanaged-content).

<a id="fr-app-102"></a>

### FR-APP-102 — Root-only lifecycle effects by default

Root-application lifecycle operations shall not automatically apply equivalent clean/reset/build/install effects to every managed layer unless a separate approved use case explicitly defines coordinated multi-target behaviour.

<a id="fr-app-103"></a>

### FR-APP-103 — Destructive ambiguity fails safe

Where AppManager cannot determine whether a candidate clean/reset/create target is safely within the intended managed scope, it shall refuse the consequential effect or require explicit safe disambiguation rather than guessing.

<a id="fr-app-104"></a>

### FR-APP-104 — External resources require domain authority

An `app` lifecycle operation shall not delete or create remote repositories, change remote repository policy, or otherwise mutate external resources except by invoking a separately authorised domain use case whose semantics explicitly require that effect.

---

## 17. Interaction-Mode Behaviour

<a id="fr-app-105"></a>

### FR-APP-105 — Equivalent lifecycle semantics
Lifecycle intent, sequencing and outcomes across all supported modes shall apply [Design §4.6](../appmanager-design-specification-v01.md#_4-6-presentation-independence).

<a id="fr-app-106"></a>

### FR-APP-106 — Interactive menus are presentation

An interactive lifecycle menu may assist selection in TUI or GUI operation but shall not define lifecycle behaviour unavailable to structured Headless invocation.

<a id="fr-app-107"></a>

### FR-APP-107 — Headless completeness
Automatable App use cases shall apply [FR-INV-020](application-invocation-functional-specification-v01.md#fr-inv-020).

<a id="fr-app-108"></a>

### FR-APP-108 — Host context is input, not authority
IDE/host lifecycle context shall apply [FR-PROJ-006](managed-project-functional-specification-v01.md#fr-proj-006).

<a id="fr-app-109"></a>

### FR-APP-109 — Human presentation is not the result contract
Lifecycle outcomes and diagnostics shall apply [FR-INV-021](application-invocation-functional-specification-v01.md#fr-inv-021).

---

## 18. Cancellation, Failure, and Partial Completion

<a id="fr-app-110"></a>

### FR-APP-110 — Cancellation before consequential effect

Where an `app` operation is cancelled before consequential effects begin, AppManager shall not intentionally perform those effects.

<a id="fr-app-111"></a>

### FR-APP-111 — Cancellation after effects begin
Cancellation after lifecycle effects begin shall apply [FR-INV-031](application-invocation-functional-specification-v01.md#fr-inv-031), [FR-INV-032](application-invocation-functional-specification-v01.md#fr-inv-032).

<a id="fr-app-112"></a>

### FR-APP-112 — Lifecycle stage diagnostics

For composed lifecycle operations, diagnostics shall identify the stage at which failure or cancellation occurred where that information materially affects recovery.

<a id="fr-app-113"></a>

### FR-APP-113 — No silent continuation
Composed lifecycle workflows shall not continue to a stage whose functional preconditions were invalidated by an earlier failure. FR-APP-060 defines the dependency-aware stage order.

<a id="fr-app-114"></a>

### FR-APP-114 — No false successful completion

An operation shall not be reported as successful merely because its final attempted delegated process exited successfully when required earlier lifecycle stages failed, were skipped impermissibly, or left invalid postconditions.

<a id="fr-app-115"></a>

### FR-APP-115 — Recovery information
Recoverable lifecycle intermediate states shall apply [FR-INV-047](application-invocation-functional-specification-v01.md#fr-inv-047).

---

## 19. Relationship to Other Functional Domains

### 19.1 `nuxt`

Layer and framework follow-on work consumes [Nuxt §11](nuxt-functional-specification-v01.md#_11-nuxt-layer-creation); FR-APP-070 and FR-APP-088 bind root creation to that owner.

### 19.2 `git`

Optional repository follow-on work consumes [Git §7](git-functional-specification-v01.md#_7-repository-initialisation); FR-APP-083–084 defines its relationship to scaffold completion.

### 19.3 `settings` and configuration

Environment readiness consumes [Settings §8](settings-functional-specification-v01.md#_8-environment-variable-definitions) through FR-APP-016–018. [Configuration §6](configuration-functional-specification-v01.md#_6-precedence-and-effective-configuration) governs consumed values.

### 19.4 `quality`

Build is described in §9. Adjacent verification consumes the [Quality requirements](quality-functional-specification-v01.md#_5-test-execution), following [Design §10.8](../appmanager-design-specification-v01.md#_10-8-quality-domain).

### 19.5 `docs`

A new-root README is a profile artefact under FR-APP-072. Ongoing documentation uses [Docs §10](docs-functional-specification-v01.md#_10-documentation-generation-and-update).

### 19.6 `ai`

AI-assisted lifecycle steps consume [AI §7.1](ai-functional-specification-v01.md#_7-1-generated-output-acceptance) and its context/disclosure requirements in §11.

<a id="_19-7-utils"></a>

### 19.7 `maintenance`

Maintenance placement follows [Design §10.9](../appmanager-design-specification-v01.md#_10-9-maintenance-domain); the root lifecycle remains defined by this specification.

---

## 20. Traceability

| Functional requirement range | Root Design authority | Upstream / same-level authority | Downstream refinement destination |
|---|---|---|---|
| `FR-APP-001`–`FR-APP-012` | Sections 1, 2, 5, 6, 10.1, 12 | This specification; `FR-INV-*`, `FR-PROJ-*`, `FR-CONFIG-*` | Owning domain/shared-contract Detailed Design |
| `FR-APP-013`–`FR-APP-024` | Sections 2, 5, 8, 9, 10.1, 12 | This specification §6; `FR-INV-*`, `FR-PROJ-*`, `FR-CONFIG-*` | Owning domain/shared-contract Detailed Design |
| `FR-APP-025`–`FR-APP-028` | Sections 5, 10.1, 12.9 | This specification §7 | Process Execution boundary |
| `FR-APP-029`–`FR-APP-033` | Sections 4, 5, 10.1, 12.9 | This specification §8; `FR-INV-*` | Owning domain/shared-contract Detailed Design |
| `FR-APP-034`–`FR-APP-038` | Sections 5, 10.1, 12 | This specification §9; `FR-XFORM-*` | Owning domain/shared-contract Detailed Design |
| `FR-APP-039`–`FR-APP-042` | Sections 4, 5, 10.1, 12 | This specification §10; `FR-INV-*` | Owning domain/shared-contract Detailed Design |
| `FR-APP-043`–`FR-APP-049` | Sections 5, 9, 10.1, 12 | This specification §11; `FR-PROJ-*` | Owning domain/shared-contract Detailed Design |
| `FR-APP-050`–`FR-APP-058` | Sections 5, 9, 10.1, 12 | This specification §12; `FR-INV-*`, `FR-PROJ-*` | Owning domain/shared-contract Detailed Design |
| `FR-APP-059`–`FR-APP-065` | Sections 5, 6, 10.1, 12 | This specification §13; Application Engine workflow authority | Owning domain/shared-contract Detailed Design |
| `FR-APP-066`–`FR-APP-090` | Sections 1, 2, 6.7, 8, 9, 10.1, 12.5 | This specification §14; `FR-CONFIG-*`, `FR-XFORM-*`, Git and Nuxt Functional Specifications | Owning domain/shared-contract Detailed Design |
| `FR-APP-091`–`FR-APP-098` | Sections 5, 10.1, 12.9 | This specification §15 | Process Execution boundary |
| `FR-APP-099`–`FR-APP-104` | Sections 2.3, 9, 12 | This specification §16; `FR-PROJ-*`, `FR-XFORM-*` | Owning domain/shared-contract Detailed Design |
| `FR-APP-105`–`FR-APP-109` | Section 4 | This specification §17; `FR-INV-*` | Owning domain/shared-contract Detailed Design |
| `FR-APP-110`–`FR-APP-115` | Sections 5, 11, 12 | This specification §18; `FR-INV-*`; Application Engine workflow authority | Owning domain/shared-contract Detailed Design |
| `FR-APP-116` | Sections 6.6 and 10.3 | This specification §10.1; Configuration and Invocation | App domain and Nuxt/Process capabilities |

ADR-0001 selects Node.js/TypeScript for Version 1 implementation but does not materially alter the technology-independent Functional requirements in this document.

---

## 21. Conformance Criteria

Conformance is assessed against the applicable requirement bodies in this specification and the canonical contracts they reference. The traceability section identifies the requirement groups; this section creates no additional acceptance checklist.

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
