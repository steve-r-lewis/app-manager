# IS-14 — App Domain Implementation Specification

> **Document type:** Level 4 Implementation Specification
>
> **Status:** Version 1 implementation baseline
>
> **Implementation ID:** IS-14
>
> **Primary Detailed Design:** [DD-3.1 — AppManager App Domain](../dd_3_high_coupling_domains/dd-3-1-app-domain-detailed-design-v01.md)
>
> **Primary Functional authority:** [App Functional Specification](../functional/app-functional-specification-v01.md)
>
> **Environment-definition ownership:** [App / Settings Environment-Definition Ownership — App Functional Specification](../functional/app-functional-specification-v01.md#fr-app-016)
>
> **Application Core:** [IS-1 — Application Runtime and Invocation](is-1-application-runtime-and-invocation-implementation-specification-v01.md), [IS-2 — Managed Project Resolution](is-2-managed-project-resolution-implementation-specification-v01.md), [IS-3 — Configuration Resolution](is-3-configuration-resolution-implementation-specification-v01.md)
>
> **Shared capabilities:** [IS-4 — Resource Access](is-4-resource-access-implementation-specification-v01.md), [IS-5 — Process Execution](is-5-process-execution-implementation-specification-v01.md), [IS-6 — Repository Capability](is-6-repository-capability-implementation-specification-v01.md), [IS-7 — Source Intelligence](is-7-source-intelligence-implementation-specification-v01.md), [IS-8 — Source Transformation](is-8-source-transformation-implementation-specification-v01.md), [IS-9 — Resource Registry and Template](is-9-resource-registry-and-template-implementation-specification-v01.md), [IS-10 — AI Capability](is-10-ai-capability-implementation-specification-v01.md), [IS-11 — Quality Capability](is-11-quality-capability-implementation-specification-v01.md), [IS-12 — Documentation Capability](is-12-documentation-capability-implementation-specification-v01.md), [IS-13 — Nuxt Capability](is-13-nuxt-capability-implementation-specification-v01.md)
>
> **Related domain implementations:** IS-15 Git Domain, IS-16 Nuxt Domain, IS-17 Docs Domain, IS-18 Quality Domain, IS-19 Settings Domain, IS-20 AI Domain, IS-21 Maintenance Domain
>
> **Interaction/runtime:** IS-22 Interaction Adapters, [IS-23 — Build and Runtime Assembly](is-23-build-and-runtime-assembly-implementation-specification-v01.md)
>
> **Runtime decision:** [ADR-0001 — Primary Application Runtime](../project_management/decisions/adr-0001-primary-application-runtime.md)
>
> **Register:** [AppManager Implementation Specification](implementation-specification-v01.md)
>
> **Governing plan:** [Implementation Specification Plan](../project_management/implementation-specification-plan-v01.md)
>
> **Related clarification:** [App Command Model Implementation Clarification — Retired](../archive/implementation/app-command-model-implementation-clarification-v01-retired.md) (its corrected 8-command identity set, `app.generate` and the reset-and-prepare/declared-script-runner dispositions are now applied directly in §5, §17, §21, §24.1, §29 and §44)

## 1. Purpose

IS-14 defines the concrete Node.js/TypeScript implementation of AppManager's App domain: the domain that owns root-application lifecycle intent, root-application creation orchestration, lifecycle-specific policy, stage acceptance and App-domain interpretation.

The governing implementation rules are:

> **App use cases own root-application lifecycle composition; they do not become providers for filesystem, process, Git, Nuxt, Settings, templates, documentation, quality or AI semantics.**

> **The Application Engine supplies authoritative invocation, managed-project, effective-configuration, authorization and final-outcome context. App does not reconstruct it.**

> **A lifecycle stage is accepted by its semantic postcondition, not merely because a delegated command or capability returned successfully.**

> **Completed effects remain facts when a later stage fails or is cancelled.**

> **Current command files and package-manager assumptions are migration evidence, not the App-domain architecture.**

---

## 2. Scope and Non-Ownership

IS-14 implements:

- lifecycle action identities and metadata;
- use-case applicability and validation;
- `create`, `prepare`, `develop`, `build`, `preview`, `generate`, `clean` and `reset` as the eight canonical use cases;
- post-install execution and declared-script discovery/invocation as internal subordinate stages/collaborators, not separate canonical commands;
- reset-and-prepare as an adapter-composed workflow over the canonical `reset` and `prepare` use cases, not a separate canonical command;
- invocation-scoped lifecycle plans/stages/state;
- App-specific stage sequencing and dependency policy;
- App-specific clean/reset resource classification;
- root-creation profile selection and creation-plan composition;
- declared project-script discovery/selection semantics;
- App-domain effect classification and authorization requirements;
- subordinate Settings/Git/Nuxt/capability coordination;
- App-domain stage/result/recovery payloads;
- partial-effect, cancellation, stale-plan and conflict interpretation.

IS-14 does not implement:

- canonical invocation/dispatch/final outcomes — IS-1;
- project identity/scope/targetability — IS-2;
- configuration precedence — IS-3;
- filesystem mechanics — IS-4;
- process spawning/shell semantics — IS-5;
- repository primitives — IS-6;
- source recognition — IS-7;
- existing-source transformation — IS-8;
- template rendering/registry semantics — IS-9;
- AI semantics — IS-10/IS-20;
- Quality semantics — IS-11/IS-18;
- documentation semantics — IS-12/IS-17;
- Nuxt technical semantics — IS-13/IS-16;
- Git-domain policy — IS-15;
- persisted Settings/environment-definition semantics — IS-19;
- presentation/prompts — IS-22;
- process/runtime assembly — IS-23.

---

## 3. Concrete Module Boundary

```text
app/
└── domains/
    └── app/
        ├── contracts/
        │   ├── app-use-case.ts
        │   ├── lifecycle-action.ts
        │   ├── lifecycle-applicability.ts
        │   ├── lifecycle-plan.ts
        │   ├── lifecycle-stage.ts
        │   ├── lifecycle-result.ts
        │   ├── recovery-position.ts
        │   ├── regenerable-resource.ts
        │   ├── creation-profile.ts
        │   ├── creation-plan.ts
        │   ├── declared-script.ts
        │   └── app-diagnostic.ts
        ├── catalogue/
        │   ├── app-use-case-catalogue.ts
        │   ├── lifecycle-action-catalogue.ts
        │   ├── resource-class-catalogue.ts
        │   └── creation-profile-catalogue.ts
        ├── lifecycle/
        │   ├── lifecycle-planner.ts
        │   ├── lifecycle-runner.ts
        │   ├── stage-acceptance.ts
        │   ├── effect-classifier.ts
        │   └── recovery-builder.ts
        ├── use-cases/
        │   ├── create-app.ts
        │   ├── prepare-app.ts
        │   ├── develop-app.ts
        │   ├── build-app.ts
        │   ├── preview-app.ts
        │   ├── generate-app.ts
        │   ├── clean-app.ts
        │   └── reset-app.ts
        └── collaborators/
            ├── declared-script-runner.ts
            ├── project-lifecycle-reader.ts
            ├── app-resource-planner.ts
            ├── settings-domain-port.ts
            ├── git-domain-port.ts
            └── nuxt-domain-port.ts
```

The `collaborators/` ports are App-owned dependency contracts for subordinate domain intent/results. They are not alternate implementations of those domains. `declared-script-runner.ts` is the bounded internal mechanism named lifecycle use cases (Post-Install §21, Develop §22, Build §23, Preview §24) use to invoke a recognized project-declared package script; it is not itself a canonical command (§5, §44).

Named use cases exist only for the eight canonical commands. Post-install (§21) is a subordinate stage reached from Prepare/other lifecycle actions, not a use case of its own; reset-and-prepare (§29) is an adapter-composed workflow over the `reset` and `prepare` use cases, not a ninth use case.

No `AppService` singleton, generic cross-domain workflow base class or domain-global mutable lifecycle state is introduced.

---

## 4. Use-Case Contract

Each App use case conforms to the IS-1 application-use-case seam:

```ts
export interface AppUseCase<TInput, TPayload> {
  readonly descriptor: AppUseCaseDescriptor;
  availability(context: ApplicationExecutionContext, input: TInput): Promise<AppAvailability>;
  validate(context: ApplicationExecutionContext, input: TInput): Promise<AppValidation>;
  execute(context: ApplicationExecutionContext, input: TInput): Promise<AppDomainResult<TPayload>>;
}
```

`AppDomainResult` is domain interpretation/payload evidence for IS-1. It is not a second canonical outcome envelope.

The use case receives the Engine-established context; it does not accept `targetRoot: string` as a substitute for managed project/scope/configuration/authorization.

---

## 5. Canonical App Command Identities

Version 1 command/use-case IDs are:

```text
app.create
app.prepare
app.develop
app.build
app.preview
app.generate
app.clean
app.reset
```

Eight canonical identities. Presentation aliases may map to these IDs but cannot create different semantics. `app.initialise`, `app.post-install`, `app.reinitialise` and `app.run-script` are not registered as canonical Version 1 App commands:

- `app.initialise` is renamed `app.prepare` (§17), preserving the same existing-root readiness and no-scaffold-over-existing-target guarantees;
- `app.post-install` becomes a subordinate stage reached from Prepare and other lifecycle actions (§21), not a standalone command;
- `app.reinitialise` is not registered; an adapter composes the canonical `app.reset` then `app.prepare` intents as an application workflow instead (§29);
- `app.run-script` is not registered; its bounded declared-script discovery/invocation mechanism is retained as the internal `declared-script-runner` collaborator (§3, §44) consumed by named lifecycle use cases, not exposed as its own command.

`app.run` from the current implementation migrates into that internal collaborator; named lifecycle scripts are preferably reached through their richer named use cases (Develop/Build/Preview) rather than generic script invocation.

`setupApp.ts` does not define a permanent `app.setup` semantic identity; its intended responsibilities are split across `app.prepare` and `app.create` according to target intent.

---

## 6. Lifecycle Action Descriptor

```ts
export interface LifecycleActionDescriptor {
  readonly id: LifecycleActionId;
  readonly commandId: AppCommandId;
  readonly targetMode: 'existing_root' | 'new_root';
  readonly effectClass: AppEffectClass;
  readonly longRunning: boolean;
  readonly supportsPreview: boolean;
  readonly requiresManagedProject: boolean;
}
```

Descriptors are immutable code-owned metadata composed by IS-23.

They do not contain executable command strings, filesystem paths or provider instances.

---

## 7. Applicability

```ts
export interface LifecycleApplicability {
  readonly action: LifecycleActionId;
  readonly state: 'available' | 'unavailable' | 'already_satisfied';
  readonly evidence: readonly AppEvidenceReference[];
  readonly unmetPreconditions: readonly AppPrecondition[];
  readonly diagnostics: readonly AppDiagnostic[];
}
```

Applicability is evaluated from authoritative context and bounded project evidence before consequential execution.

`unavailable` is not `unknown_command`.

An `already_satisfied` state is used only for meaningful idempotent semantics such as an already-clean approved target or an already-satisfied preparation stage.

---

## 8. Project Lifecycle Declaration Model

IS-14 uses a normalized package/project lifecycle view rather than parsing package files inside each use case:

```ts
export interface ProjectLifecycleDeclaration {
  readonly project: ProjectEntityId;
  readonly packageManager: PackageManagerEvidence;
  readonly scripts: ReadonlyMap<ProjectScriptId, ProjectScriptDeclaration>;
  readonly lifecycleMappings: ReadonlyMap<LifecycleActionId, ProjectScriptId>;
  readonly revision: ResourceRevisionEvidence;
  readonly provenance: readonly AppEvidenceReference[];
}
```

The initial reader obtains package metadata through bounded IS-4/IS-7 evidence. JSON parsing is data parsing only; no package script is executed during discovery.

Package-manager identity comes from recognized project/effective configuration evidence. IS-14 does not independently impose a universal lockfile priority algorithm.

If package-manager/lifecycle evidence is ambiguous, applicability fails safely rather than defaulting to `npm`.

---

## 9. Declared Script Identity

```ts
export interface ProjectScriptDeclaration {
  readonly id: ProjectScriptId;
  readonly name: string;
  readonly declaredValueFingerprint: string;
  readonly sourceRevision: ResourceRevisionEvidence;
  readonly consequence?: 'unknown' | 'non_destructive' | 'consequential';
}
```

The raw script body is not the public App command identity and need not be projected to callers that only require selection metadata.

A run request supplies `ProjectScriptId`/name and expected declaration revision. It never supplies arbitrary shell text as executable intent.

---

## 10. Package-Manager Invocation Adapter

IS-14 maps a validated declared script to a bounded IS-5 direct execution request through a private adapter:

```ts
export interface PackageScriptInvocationAdapter {
  buildRunRequest(
    declaration: ProjectLifecycleDeclaration,
    script: ProjectScriptDeclaration,
    cwd: ManagedResourceRoot
  ): ProcessExecutionRequest;
}
```

Version 1 supports recognized npm, pnpm, yarn and bun project script invocation where their direct executable/argument forms are explicitly implemented and tested.

The adapter emits executable + argument vector, not a shell string. Shell mode is not used merely because a package script's package metadata internally contains shell syntax; the package manager interprets its own declared script.

The App use case never executes the script declaration value directly.

---

## 11. Lifecycle Plan

```ts
export interface AppLifecyclePlan {
  readonly action: LifecycleActionId;
  readonly target: AppTargetReference;
  readonly contextRevision: AppContextRevision;
  readonly stages: readonly AppLifecycleStage[];
  readonly materialEffects: readonly AppPlannedEffect[];
  readonly authorizationRequirement: AppAuthorizationRequirement;
  readonly diagnostics: readonly AppDiagnostic[];
}
```

Plans are invocation-scoped and immutable after authorization. If material evidence changes, the plan is invalidated/rebuilt rather than silently expanded.

A plan is not persisted as a resumable workflow in Version 1.

---

## 12. Lifecycle Stage

```ts
export interface AppLifecycleStage {
  readonly id: AppStageId;
  readonly purpose: AppStagePurpose;
  readonly prerequisites: readonly AppStageId[];
  readonly delegatedIntent: AppDelegatedIntent;
  readonly effectClass: AppEffectClass;
  readonly acceptance: AppStageAcceptanceRule;
  readonly optional: boolean;
}
```

Stage IDs are semantic (`dependency_readiness`, `environment_readiness`, `build_execution`, `scaffold_application`) rather than command strings.

The lifecycle runner evaluates prerequisites before starting a stage.

---

## 13. Stage State and Result

```ts
export type AppStageState =
  | 'planned'
  | 'ready'
  | 'running'
  | 'satisfied'
  | 'failed'
  | 'cancelled'
  | 'blocked_by_prerequisite';

export interface AppStageResult {
  readonly stage: AppStageId;
  readonly state: AppStageState;
  readonly evidence: readonly AppEvidenceReference[];
  readonly effects: readonly ApplicationEffectEvidence[];
  readonly diagnostics: readonly AppDiagnostic[];
  readonly remainingAction: readonly AppRemainingAction[];
  readonly recoveryRelevant: boolean;
}
```

These states describe workflow position only. IS-1 owns canonical application success/failure/partial/cancelled outcome semantics.

---

## 14. Stage Acceptance

Each stage has an explicit acceptance evaluator.

Examples:

- process lifecycle stage: required process evidence plus any configured App postcondition;
- environment readiness: Settings operation evidence plus explicit remaining-secret state;
- scaffold stage: required artefact-class postconditions, not just successful writes;
- Git follow-on: IS-15 result interpreted only for that optional/required stage;
- Nuxt technical stage: IS-13/IS-16 result interpreted for the requested App postcondition.

No generic rule converts `exitCode === 0`, `write succeeded` or provider `success: true` directly into App lifecycle success.

---

## 15. Effect Classification

```ts
export type AppEffectClass =
  | 'observational'
  | 'process_execution'
  | 'regenerable_cleanup'
  | 'consequential_reset'
  | 'new_target_creation'
  | 'existing_source_transformation'
  | 'cross_domain_consequential';
```

The classifier supplies App-specific material-effect information to IS-1 authorization policy. It does not mint authorization itself.

Material expansion after authorization invalidates the authorization coverage for the new effects and returns control to IS-1 for renewed decision where required.

---

## 16. Conflict Keys

Each mutating App plan declares conflict keys derived from authoritative semantic/resource identities, for example:

```text
app-root:<project-id>:regenerable-state
app-root:<project-id>:installation-state
app-create:<canonical-target-resource-id>
app-root:<project-id>:source:<resource-id>
```

IS-1 owns application-level conflicting invocation coordination.

IS-14 never implements a process-global mutex that serializes unrelated projects.

---

## 17. Prepare Existing Application

`app.prepare` (renamed from the former `app.initialise`; §5) requires an Engine-resolved managed root application.

Its planner derives required stages from project/profile/effective configuration:

```text
assess readiness
 -> dependency readiness, when required
 -> Settings environment-definition readiness, when applicable
 -> Git-domain relationship readiness, when required
 -> approved optional development artefacts
 -> reassess required readiness
```

Already-satisfied stages are represented explicitly and are not destructively repeated.

No root scaffold is invoked over an existing managed project.

---

## 18. Environment Readiness Delegation

When a missing managed environment definition must be created from an approved example/default, IS-14 invokes the IS-19 Settings-domain port:

```ts
export interface SettingsDomainPort {
  createEnvironmentDefinition(
    context: ApplicationExecutionContext,
    request: CreateEnvironmentDefinitionIntent
  ): Promise<SettingsEnvironmentOperationResult>;
}
```

IS-14 supplies governed project/target/source lifecycle context. IS-19 owns target/source validation, existing-definition protection, syntax/persistence semantics and sensitive-value handling.

IS-14 must not implement `copyFile(.env.example, .env)` or equivalent direct persistence.

Successful creation does not imply full readiness when required sensitive values remain missing. Those become structured remaining action.

---

## 19. Dependency Readiness

Dependency readiness is a project-declared/configured lifecycle concern, not a hard-coded `pnpm install` step.

The App planner resolves whether installation/restoration is required and the bounded package-manager operation supported for the project.

The concrete package-manager execution adapter delegates through IS-5 using direct executable/arguments, explicit managed-root cwd, explicit environment policy and cancellation.

Version 1 does not introduce a generic PackageManager shared capability solely because multiple App actions use package-manager execution. The adapter remains private to the App-domain lifecycle implementation unless later specifications establish genuinely shared semantics.

---

## 20. Repository Readiness

Where an approved profile/configuration/invocation makes repository readiness part of initialisation, IS-14 delegates the semantic operation to IS-15 Git Domain.

It does not call IS-6 primitives directly to recreate Git-domain policy.

Git stage success remains subordinate evidence for App initialisation acceptance.

---

## 21. Post-Install (Subordinate Stage)

Post-install is not a canonical command (§5). It is a subordinate lifecycle stage available only when the recognized project declaration maps an applicable post-install action, reached from `app.prepare` and any other lifecycle action whose plan includes it.

The stage, through the declared-script-runner collaborator (§44):

1. validates current declaration revision;
2. maps the declaration through the package-manager invocation adapter;
3. delegates through IS-5;
4. interprets normalized execution evidence;
5. evaluates any declared App postcondition;
6. returns App-domain stage evidence to its calling use case.

No universal `postinstall` script name is assumed by the public/domain contract.

---

## 22. Develop

`app.develop` resolves the project-declared/configured development lifecycle mapping and runs it through IS-5.

The process request uses streaming/inherited or structured streaming modes supported by IS-5 according to adapter requirements, without putting TUI concerns in the domain.

`AbortSignal` propagates to IS-5. Termination is interpreted from invocation cancellation + process termination evidence; process termination alone does not determine App cancellation.

Development is long-running and does not acquire unrelated source-mutation authority.

---

## 23. Build

`app.build` requires recognized build lifecycle support.

Its default plan contains one required build-execution stage plus only postconditions explicitly selected by project/profile/effective configuration.

Quality gates are not silently added merely because IS-11 exists. If an approved App profile composes a Quality gate, the stage remains explicitly represented and Quality-owned.

No universal build output path is embedded in IS-14.

---

## 24. Preview

`app.preview` resolves a deterministic prerequisite policy from effective configuration/project profile:

```ts
export type PreviewPrerequisitePolicy =
  | 'require_valid_build_evidence'
  | 'compose_build_stage'
  | 'delegate_project_preview_prerequisite';
```

The selected policy is part of the lifecycle plan before execution and is independent of interaction mode.

Preview itself is a long-running IS-5-backed lifecycle stage with the same cancellation boundary as Develop.

### 24.1 Generate

`app.generate` (DD-3.1 §8.12) resolves the project-resolved root-application generation/prerender mechanism from recognized project evidence and runs it through the same applicability/stage/acceptance contracts as Develop/Build/Preview (§22–24). The provider command (for example a framework's own generate/prerender executable) is not the application identity; IS-14 resolves which supported mechanism applies from project evidence rather than hard-coding one provider.

Generate's default plan contains one required generation-execution stage plus only the postconditions explicitly selected by project/profile/effective configuration, following the same "no silently added Quality gate" rule as Build (§23).

---

## 25. Regenerable Resource Classes

Clean/Reset use semantic classes rather than arbitrary discovered paths:

```ts
export type AppRegenerableResourceClass =
  | 'build_output'
  | 'framework_cache'
  | 'tool_cache'
  | 'installed_dependencies'
  | 'installation_metadata'
  | 'package_manager_lock_state';
```

Each class has a code-owned descriptor stating whether it is eligible for Clean, eligible for Reset, requires explicit policy, expected scope and a resolver ID.

`package_manager_lock_state` is retained by default and requires explicit effective policy before Reset may include it.

Durable source, user-managed configuration, repository metadata and unrelated resources are not regenerable classes.

---

## 26. Resource-Class Resolvers

A resolver converts one approved semantic class into bounded resource references using managed-project/project-profile evidence:

```ts
export interface AppResourceClassResolver {
  resolve(
    resourceClass: AppRegenerableResourceClass,
    context: ManagedProjectContext,
    configuration: AppEffectiveConfiguration
  ): Promise<AppResolvedResourceClass>;
}
```

Resolvers may use Nuxt/project facts but may not authorize discovered resources merely because their basename resembles `.nuxt`, `node_modules`, `.output` or another common target.

Every candidate must be contained by authoritative root scope and carry provenance/classification evidence.

---

## 27. Clean

`app.clean`:

1. resolves only Clean-eligible resource classes;
2. excludes installed dependencies, lock state, durable source/configuration/repositories by default;
3. constructs a bounded effect plan;
4. validates scope/ambiguity;
5. obtains applicable IS-1 authorization state;
6. delegates authorized deletions to IS-4;
7. records affected/already-absent/skipped/failed classes;
8. re-inspects required postconditions.

Already-absent approved targets are `already_satisfied`, not failures unless a project invariant says otherwise.

No glob-based recursive delete is issued from caller-supplied text.

---

## 28. Reset

`app.reset` uses a distinct policy and plan from Clean.

It may include:

- Clean-eligible state;
- installed dependency state;
- approved installation/build metadata;
- lock state only when explicit policy permits it.

The complete material effect classes/resources are known before the authorization checkpoint.

Deletion is delegated to IS-4 resource references with containment/precondition evidence. Durable source/configuration and unrelated resources remain excluded.

Partial deletions are retained as effect evidence; no rollback fiction is introduced.

---

## 29. Reset-and-Prepare Composition

`app.reinitialise` is not a canonical command and IS-14 registers no such use case (§5). An interaction adapter presenting a convenience operation such as "Reset and prepare again" expresses it as an application workflow over the canonical `app.reset` and `app.prepare` intents:

```text
Reset plan/execute/accept
 -> Prepare plan/execute/accept
```

The adapter invokes these as two ordinary Engine-authorized invocations (or, where a composed-workflow mechanism exists at the Engine/adapter layer, through that mechanism) so canonical authority/context/cancellation/effect tracking are preserved through IS-1 for each. It never calls App implementation services directly and never manufactures `app.reinitialise` as an alternate command ID.

Failure/cancellation of Reset blocks the dependent Prepare step. Each invocation's own result retains its own stage evidence; there is no third, merged "reinitialise result" type.

---

## 30. Root Creation Input

`app.create` receives explicit normalized creation intent:

```ts
export interface CreateAppInput {
  readonly target: ProspectiveProjectTarget;
  readonly profile: AppCreationProfileId;
  readonly choices: AppCreationChoices;
  readonly explicitInputs: AppCreationExplicitInputs;
}
```

IS-1/IS-2/IS-3 establish prospective target/scope/effective creation inputs according to bootstrap/new-project rules. IS-14 does not use current working directory or raw adapter prompts as creation authority.

---

## 31. Creation Profiles

Version 1 uses immutable code-owned profile descriptors composed by IS-23:

```ts
export interface AppCreationProfileDescriptor {
  readonly id: AppCreationProfileId;
  readonly version: string;
  readonly requiredArtefactClasses: readonly AppCreationArtefactRequirement[];
  readonly optionalCapabilities: readonly AppCreationChoiceDescriptor[];
  readonly requiredPostconditions: readonly AppCreationPostcondition[];
}
```

Initial profile IDs are:

```text
app-minimal-v1
app-complete-v1
app-custom-v1
```

`app-custom-v1` is a constrained profile with supported choices; it is not arbitrary file/provider selection.

Profile descriptors reference semantic artefact/resource classes, never source filenames or renderer function names.

---

## 32. Minimal Profile

`app-minimal-v1` establishes only the supported root-application baseline required by authoritative Nuxt/AppManager project semantics.

Its exact artefact inventory is resolved from semantic requirements and effective configuration, but includes only classes required to establish a coherent root project such as package metadata, root Nuxt/configuration baseline, TypeScript/workspace configuration where required and minimal project documentation/licence/ignore material required by governed policy.

It does not create a Nuxt layer.

It does not require Git initialization or dependency installation unless explicitly selected as permitted follow-on choices.

---

## 33. Complete Profile

`app-complete-v1` extends the minimal baseline with approved AppManager project-management/development resources and configured optional capabilities.

Additional resources remain semantic classes with explicit owners. Complete does not mean "generate every known template" and cannot silently add AI/Git/Nuxt-layer/Quality/Docs operations merely because their implementations exist.

---

## 34. Custom Profile

`app-custom-v1` starts from mandatory baseline requirements and permits only catalogue-declared optional choices.

A profile validator rejects:

- missing mandatory baseline classes;
- mutually incompatible choices;
- unsupported provider/resource combinations;
- choice sets that require unavailable specialists;
- hidden scope/effect expansion.

Interactive adapters may help select choices; Headless callers supply the same structured choices directly.

---

## 35. Creation Plan

```ts
export interface AppCreationPlan {
  readonly target: ProspectiveProjectTarget;
  readonly profile: AppCreationProfileDescriptor;
  readonly artefacts: readonly AppCreationArtefactPlan[];
  readonly transformations: readonly AppCreationTransformationPlan[];
  readonly followOns: readonly AppCreationFollowOnPlan[];
  readonly materialEffects: readonly AppPlannedEffect[];
  readonly authorizationRequirement: AppAuthorizationRequirement;
  readonly postconditions: readonly AppCreationPostcondition[];
}
```

The plan is built before consequential creation and is revision/evidence-bound.

Rendered content is subordinate evidence and is not the creation plan.

---

## 36. Creation Target Safety

Before rendering/applying artefacts, `app.create` requires target classification:

```ts
export type CreationTargetState =
  | 'absent'
  | 'empty'
  | 'recognized_existing_project'
  | 'non_empty_unrecognized'
  | 'ambiguous'
  | 'unsafe';
```

Normal Version 1 creation accepts only `absent` or `empty` targets that IS-2/IS-4 classify as within the authorized prospective scope.

Recognized existing projects, non-empty unrecognized targets and ambiguity are refused. Adoption/merge/force-overwrite are not implicit creation modes.

---

## 37. Artefact Ownership and Planning

Each creation artefact records its semantic owner:

```ts
export interface AppCreationArtefactPlan {
  readonly class: AppCreationArtefactClass;
  readonly owner: 'app' | 'nuxt' | 'documentation' | 'settings' | 'quality';
  readonly required: boolean;
  readonly resourceRequest: ResourceRegistryItemRequest;
  readonly proposedTarget: AppProposedResourceTarget;
  readonly validation: AppCreationPostcondition;
}
```

App owns inclusion/sequencing. Specialist semantics remain with the owner.

Nuxt-specific root configuration/baseline requirements use IS-13/IS-16 as applicable. Documentation semantics use IS-12/17 when semantically modeled rather than opaque scaffold text. Licence/Settings policy uses IS-19. Quality-specific content uses IS-11/18.

IS-9 resolves/binds/renders declarative resources after semantic inputs are established.

---

## 38. Generation and Persistence

For an absent target artefact:

```text
semantic requirement
 -> specialist contribution where required
 -> IS-9 resource resolution/render
 -> App validates target/effect remains authorized
 -> IS-4 create with no-overwrite precondition
 -> refreshed evidence/postcondition
```

If an artefact exists unexpectedly, creation does not silently overwrite it. The plan becomes stale/conflicted.

An explicitly approved workflow that modifies an existing source artefact must route through IS-8 and carry preservation/stale-source semantics.

Normal Version 1 creation target policy makes such transformations exceptional rather than a generic merge facility.

---

## 39. Root Nuxt Semantics

Root creation may require Nuxt-specific root-application configuration/baseline evidence. IS-14 delegates that semantic contribution to IS-13/IS-16 rather than constructing `nuxt.config.ts` source itself.

IS-14 may prepare a `layers/`-class container when the selected project profile requires it, but it does not create/provision a layer or fabricate repository relationships.

A successful root creation may expose `nuxt.create-layer` as a recommended next action.

---

## 40. Documentation and Licence Creation Artefacts

A simple deterministic introductory README may be rendered through an approved IS-9 resource when no richer documentation semantics are required. If the profile requires structured documentation composition, IS-12/IS-17 owns that semantic contribution.

Licence selection/policy and persisted Settings-owned metadata remain outside App. IS-14 passes already-governed licence identity/inputs to the appropriate specialist/IS-9 resource and validates only that the required profile artefact was satisfied.

No legal suitability decision is made by App.

---

## 41. Optional Git Follow-On

When selected, local repository initialization is a distinct post-scaffold stage delegated to IS-15.

Scaffold acceptance is recorded before the Git stage.

If Git initialization fails, completed scaffold effects remain completed; IS-14 returns partial domain evidence for IS-1 rather than pretending the target was never created.

Remote repository creation/push is not silently implied by local initialization.

---

## 42. Optional Dependency-Install Follow-On

Dependency installation is a distinct post-scaffold stage when requested/permitted.

It is not mandatory for scaffold acceptance unless the selected profile explicitly defines installation as a required creation postcondition.

Installation failure after accepted scaffold yields partial completion with recovery/next-action evidence.

---

## 43. Creation Acceptance

Required creation acceptance verifies:

- target now has coherent managed-root identity evidence;
- every mandatory artefact class/postcondition for the selected profile is satisfied;
- no required stage is failed/blocked;
- all completed effects are represented;
- optional follow-on failures are represented separately;
- remaining/recommended actions are explicit.

IS-14 returns this interpretation to IS-1; only IS-1 publishes final canonical application outcome.

---

## 44. Declared Script Runner (Internal Collaborator)

`app.run-script` is not a canonical command (§5). The `declared-script-runner` collaborator (§3) is the bounded internal mechanism named lifecycle use cases — Post-Install (§21), Develop (§22), Build (§23), Preview (§24) — use to invoke a recognized project-declared package script:

1. obtains the current `ProjectLifecycleDeclaration`;
2. validates the requested script identity against the current revision;
3. refuses arbitrary script text/not-declared identity;
4. evaluates known consequence policy where available;
5. obtains authorization coverage where required;
6. builds bounded package-manager invocation;
7. executes through IS-5;
8. returns structured selected-script + execution evidence to the calling use case.

The collaborator has no IS-1 use-case descriptor of its own and cannot be invoked directly by an adapter; a caller reaches it only through one of the named lifecycle use cases that consumes it.

## 45. No Arbitrary Shell Surface

The App domain exposes no `command`, `shell`, `argsText`, `exec` or equivalent generic execution field, whether at the use-case boundary or on the internal declared-script-runner collaborator.

Additional caller arguments are not appended to project scripts in Version 1 unless a later approved requirement defines a bounded declared-script argument contract. This avoids the collaborator becoming shell passthrough merely because it moved from a public command to an internal mechanism.

IS-5's shell mode remains unavailable through this domain surface.

---

## 46. Recovery Position

```ts
export interface AppRecoveryPosition {
  readonly action: LifecycleActionId;
  readonly lastAcceptedStage?: AppStageId;
  readonly terminalStage?: AppStageId;
  readonly completedEffects: readonly ApplicationEffectEvidence[];
  readonly blockedStages: readonly AppStageId[];
  readonly nextDisposition: readonly ('retry' | 'continue_after_revalidation' | 'repair' | 'manual_intervention')[];
  readonly revalidation: readonly AppRevalidationRequirement[];
}
```

This is information only. It does not promise automatic resume/rollback.

Retry/continuation always revalidates managed project, effective configuration where material, resource revisions, lifecycle declaration and target state.

---

## 47. Cancellation

`ApplicationExecutionContext.signal` is checked before every stage and propagated to subordinate domain/capability calls.

Cancellation accepted before a consequential stage prevents that stage from starting.

Cancellation during delegated work preserves the collaborator's actual effect/termination evidence. IS-14 never assumes cancellation undid a file deletion, process effect, scaffold creation or repository operation.

Dependent stages are blocked after cancellation.

---

## 48. Partial Completion

The lifecycle runner accumulates immutable stage results/effects in execution order.

A later failure/cancellation cannot remove earlier effect evidence.

Optional independent follow-ons may continue only when the plan explicitly permits it and cancellation has not been accepted.

IS-14 supplies enough evidence for IS-1 to distinguish complete, failed-with-no-effect, partial-success and cancelled-after-effects according to canonical outcome rules.

---

## 49. Stale Plans

Plans carry material evidence/revision fingerprints.

Before each consequential stage, the runner validates the subset material to that stage. Examples include target emptiness, resource revision, declared script revision and regenerable-resource classification.

A changed target/effect set returns `APP_PLAN_STALE`/conflict evidence; the runner does not silently adapt an authorized plan into a broader one.

---

## 50. Sensitive Information

IS-14 never logs/projects:

- secret environment values;
- raw private runtime configuration;
- credentials/tokens;
- full secret-bearing process environments;
- unnecessary raw script bodies;
- provider-native error payloads containing secrets.

Creation/render/process inputs are purpose-bounded projections of effective configuration.

Environment readiness distinguishes missing secret values from values themselves.

---

## 51. Diagnostics

Initial stable App-domain diagnostic codes include:

```text
APP_ACTION_UNAVAILABLE
APP_PRECONDITION_UNSATISFIED
APP_PROJECT_LIFECYCLE_UNRECOGNIZED
APP_PACKAGE_MANAGER_AMBIGUOUS
APP_SCRIPT_NOT_DECLARED
APP_SCRIPT_DECLARATION_STALE
APP_SCRIPT_NAMED_LIFECYCLE_AVAILABLE
APP_STAGE_BLOCKED
APP_STAGE_FAILED
APP_PLAN_STALE
APP_EFFECT_SCOPE_AMBIGUOUS
APP_AUTHORIZATION_INSUFFICIENT
APP_ENVIRONMENT_REMAINING_SECRETS
APP_CLEAN_TARGET_AMBIGUOUS
APP_RESET_LOCK_POLICY_REQUIRED
APP_CREATION_PROFILE_UNAVAILABLE
APP_CREATION_PROFILE_INVALID
APP_CREATION_TARGET_NOT_EMPTY
APP_CREATION_TARGET_UNSAFE
APP_CREATION_ARTEFACT_CONFLICT
APP_REQUIRED_POSTCONDITION_FAILED
APP_OPTIONAL_FOLLOW_ON_FAILED
APP_RECOVERY_REVALIDATION_REQUIRED
APP_CANCELLED
```

Diagnostics identify semantic stage/resource classes and safe provenance, not presentation strings or raw provider exceptions.

---

## 52. Result Payload

```ts
export interface AppLifecyclePayload {
  readonly action: LifecycleActionId;
  readonly target: AppTargetReference;
  readonly stages: readonly AppStageResult[];
  readonly effects: readonly ApplicationEffectEvidence[];
  readonly creationProfile?: AppCreationProfileId;
  readonly selectedScript?: ProjectScriptId;
  readonly remainingActions: readonly AppRemainingAction[];
  readonly recommendedNextActions: readonly ApplicationUseCaseId[];
  readonly recovery?: AppRecoveryPosition;
}
```

The payload nests inside the canonical IS-1 outcome path.

It contains no duplicate `success: boolean` whose meaning could diverge from canonical outcome status.

---

## 53. Progress and Events

IS-14 emits invocation-scoped semantic lifecycle events through IS-1's event seam:

```text
app.plan.ready
app.stage.started
app.stage.satisfied
app.stage.failed
app.stage.cancelled
app.stage.blocked
app.recovery.available
```

Event payloads contain stage/use-case/effect identities and safe evidence references. They do not contain terminal formatting.

IS-22 decides presentation.

---

## 54. Interaction Independence

No use-case implementation imports `@clack/prompts`, `picocolors`, terminal logger presentation or IDE APIs.

Missing profile choice, authorization or disambiguation is represented as structured validation/decision requirement through IS-1. Interactive adapters may gather it; Headless callers supply it directly.

All modes receive the same applicability, policy, stage sequencing and acceptance semantics.

---

## 55. Observability

Structured App observability records:

- invocation/use-case/stage identity;
- target/project identity references;
- stage timing;
- effect classes and safe resource IDs;
- subordinate operation correlation IDs;
- diagnostic codes;
- cancellation/partial/recovery position.

Raw environment values, credentials and unnecessary script contents are redacted/omitted.

Observability is evidence, not an alternate result channel.

---

## 56. Composition and Registration

IS-23 constructs the catalogues, readers/adapters, lifecycle planner/runner, the declared-script-runner collaborator, subordinate domain ports and eight App use-case instances.

IS-1's immutable application command catalogue registers the canonical App use-case descriptors.

No command self-registration occurs at import time.

IS-22 maps CLI/TUI/Headless routes to canonical IDs; it does not instantiate domain policy.

---

## 57. Testing Requirements

Core unit/conformance tests cover at least:

1. canonical eight App use-case IDs; `app.initialise`/`app.post-install`/`app.reinitialise`/`app.run-script` are not separately registered;
2. unknown versus unavailable distinction;
3. managed root required for existing lifecycle;
4. no targetRoot/cwd reconstruction;
5. effective configuration consumed, not re-resolved;
6. provider success not App success;
7. lifecycle stages use semantic IDs;
8. prerequisite blocking;
9. optional-stage explicitness;
10. material effect classification;
11. authorization before consequential effect;
12. effect expansion invalidates authorization;
13. conflict keys do not globally serialize unrelated projects;
14. preparation never scaffolds existing project;
15. already-satisfied preparation stage;
16. dependency readiness via bounded adapter/IS-5;
17. environment creation delegated to Settings;
18. no direct `.env` copy;
19. existing environment protection inherited from Settings;
20. missing secrets remain remaining action;
21. Git readiness delegated to IS-15;
22. post-install absent declaration is unavailable;
23. post-install declaration revision validation;
24. develop long-running cancellation;
25. build declaration unavailable;
26. build does not silently add Quality;
27. preview prerequisite policy deterministic;
28. preview long-running cancellation;
29. Clean classes exclude dependencies/lock/source/repository;
30. Clean already-absent no-op;
31. Clean out-of-scope candidate refused;
32. Reset broader than Clean;
33. lock state retained by default;
34. explicit lock-removal policy;
35. Reset complete effect plan before authorization;
36. Reset partial deletion evidence;
37. `app.reinitialise` is not registered as a canonical command;
38. Reset failure blocks a dependent adapter-composed Prepare step;
39. Reset and Prepare invoked back-to-back each return independent, non-merged stage evidence;
40. generate declaration unavailable fails safely without inventing a provider;
41. creation profile stable identity/version;
42. minimal profile baseline only;
43. complete profile not all-known-templates;
44. custom profile rejects incoherent choices;
45. creation absent target;
46. creation empty target;
47. creation recognized existing project refused;
48. creation non-empty unrecognized refused;
49. creation ambiguous target refused;
50. creation plan before effects;
51. artefact semantic ownership preserved;
52. Nuxt root contribution delegated;
53. no implicit Nuxt layer creation;
54. README simple-template versus Docs semantic seam;
55. licence semantics not App-owned;
56. absent artefact uses IS-4 no-overwrite creation;
57. unexpected existing artefact invalidates plan;
58. existing-source modification routes IS-8;
59. scaffold accepted before optional Git stage;
60. Git follow-on failure preserves scaffold effects;
61. dependency-install follow-on optional;
62. installation failure yields partial evidence;
63. creation required postconditions evaluated;
64. recommended Nuxt layer next action does not invoke it implicitly;
65. declared script discovery from recognized metadata;
66. arbitrary shell input rejected;
67. direct package-manager executable/argv mapping;
68. ambiguous package manager fails safe;
69. script revision stale;
70. declared-script-runner has no independent use-case descriptor and is unreachable except through a named lifecycle use case;
71. no arbitrary caller script arguments;
72. process exit zero alone not App success;
73. cancellation before effect prevents effect;
74. cancellation during delegated work preserves effects;
75. completed effects survive later failure;
76. recovery position identifies last accepted/terminal stage;
77. retry requires revalidation;
78. no rollback/resume fiction;
79. stale clean/reset/create plan refused;
80. sensitive environment data omitted;
81. structured diagnostic codes;
82. payload has no competing success Boolean;
83. semantic events have no presentation formatting;
84. no prompts/colors in domain;
85. Headless equivalent decisions;
86. IS-23 explicit composition/no singleton;
87. generate resolves its provider mechanism from project evidence rather than one hard-coded command.

Integration tests additionally cover IS-1 context/outcome integration, IS-19 environment delegation, IS-15 Git port substitution, IS-13/16 Nuxt creation contribution, IS-9 rendering, IS-4/8 mutation boundaries and IS-5 long-running process/cancellation behaviour.

---

## 58. Current Implementation Disposition

| Current artefact/responsibility | Disposition | Version 1 treatment |
|---|---|---|
| `app/commands/app/runApp.ts` declared-script intent | **RETAIN / ADAPT / RELOCATE** | Preserve bounded declared-script product intent as the internal `declared-script-runner` collaborator (§3, §44), not a standalone use case. |
| `RunAppCommand` command object | **REPLACE** | IS-1 catalogue descriptors + IS-14 use cases; no BaseCommand business-logic object; no `app.run-script` command is registered. |
| `app.run` ID | **REMOVE IDENTITY / RETAIN MECHANISM** | Not a canonical Version 1 identity; its mechanism becomes the internal declared-script-runner consumed by named lifecycle use cases (§5). |
| `isEnabled(targetRoot)` package check | **REPLACE** | IS-14 applicability consumes IS-2 managed root + recognized lifecycle declaration. |
| direct `node:fs` package/lockfile inspection | **RELOCATE / REPLACE** | Bounded IS-4/IS-7 project lifecycle reader; no use-case-local filesystem authority. |
| direct `JSON.parse(package.json)` | **RETAIN mechanic / RELOCATE** | Bounded project metadata reader may parse JSON data with revision/provenance validation. |
| interactive `@clack/prompts` script selection | **RELOCATE** | IS-22 presentation; IS-14 accepts structured script identity. |
| `picocolors` formatting | **RELOCATE** | IS-22 presentation only. |
| direct logger presentation | **ADAPT / RELOCATE** | Structured diagnostics/events; presentation logger remains adapter/observability concern. |
| lockfile package-manager detection with npm default | **REPLACE** | Recognized project/effective configuration evidence; ambiguity fails safe, no universal npm fallback. |
| `${pm} run ${scriptName}` shell string | **REPLACE** | Explicit executable + argv adapter to IS-5 direct mode. |
| `execSync(..., stdio:'inherit')` | **REPLACE / RELOCATE** | IS-5 async/cancellable process execution; adapter chooses bounded I/O mode. |
| swallowed/caught execution error + `void` result | **REPLACE** | Structured App stage/result evidence integrated with IS-1 canonical outcomes. |
| `app/commands/app/setupApp.ts` TODO | **SPLIT / REPLACE** | Responsibilities become explicit `app.prepare` and `app.create`; no ambiguous setup use case. |
| missing named lifecycle commands | **ADD** | Implement `app.prepare`/`app.develop`/`app.build`/`app.preview`/`app.generate`/`app.clean`/`app.reset` use cases and the subordinate post-install stage; no `app.reinitialise` use case (§29 adapter composition instead). |
| missing creation profile implementation | **ADD** | Immutable minimal/complete/custom profile catalogue and plan model. |
| current template repository/project templates | **RETAIN useful data / ADAPT** | IS-9-owned resources selected by semantic creation artefact classes; no sourceFile/template-function authority. |
| current Nuxt-oriented templates | **RETAIN useful data / RELOCATE semantics** | Nuxt semantic inputs owned by IS-13/16; IS-9 rendering. |
| any future direct `.env.example` copy in App | **REJECT** | Delegate persisted environment-definition creation to IS-19. |
| any future direct simple-git/GitHub call in App | **REJECT** | Delegate Git policy to IS-15. |
| any future direct Nuxt config edit in App | **REJECT** | Delegate Nuxt semantics to IS-13/16 and mutation to IS-8. |
| generic cross-domain workflow superclass | **REJECT** | App lifecycle runner remains domain-specific; DD-1 supplies shared application orchestration authority. |
| global mutable App lifecycle singleton | **REJECT** | Invocation-scoped state and explicit IS-23 composition. |

---

## 59. Migration Sequence

1. add capability/domain-local App contracts and canonical IDs;
2. add App use-case/lifecycle/resource/profile catalogues;
3. implement normalized project lifecycle reader over IS-4/IS-7 evidence;
4. implement package-manager direct invocation adapter to IS-5;
5. implement lifecycle planner/runner/stage acceptance/recovery builder;
6. migrate `runApp.ts` declared-script intent to the internal `declared-script-runner` collaborator (no `app.run-script` command) and remove prompt/fs/exec business logic;
7. implement Develop/Build/Preview/Generate over project lifecycle declarations, with Post-Install as a subordinate stage reached from Prepare and other applicable actions;
8. implement regenerable resource catalogue/resolvers;
9. implement Clean with bounded IS-4 resource deletion;
10. implement Reset with explicit lock-state/effect/authorization policy;
11. implement IS-19 Settings port and existing-app Prepare stages;
12. implement IS-15 Git-domain port for repository readiness/follow-ons;
13. confirm reset-and-prepare composition is expressed as two adapter-level invocations over `app.reset`/`app.prepare` (§29), with no `app.reinitialise` use case in IS-14;
14. implement immutable minimal/complete/custom root creation profiles;
15. implement prospective target safety and creation-plan builder;
16. connect IS-13/16, IS-12/17, IS-19 and IS-11/18 semantic contributors only where profile requirements demand them;
17. connect IS-9 rendering and IS-4 no-overwrite creation;
18. route any approved existing-source creation transformation through IS-8;
19. add optional Git/dependency-install follow-on stages and partial-effect semantics;
20. replace/retire ambiguous `setupApp.ts` stub;
21. register the eight canonical descriptors/use cases through IS-23/IS-1;
22. move all App interaction/presentation to IS-22;
23. run cross-domain authority, stale-plan, cancellation and partial-effect conformance tests.

---

## 60. Traceability

| Implementation concern | Governing authority |
|---|---|
| use-case identities/applicability/contracts | DD-APP-001–005, 011–015; FR-APP-001–012 |
| prepare (formerly initialise) | DD-APP-016–021; FR-APP-013–024; FCL-APPSET-001–007 |
| post-install (subordinate stage) | DD-APP-022–023; FR-APP-025–028 |
| develop | DD-APP-024–025; FR-APP-029–033 |
| build | DD-APP-026–028; FR-APP-034–038 |
| preview | DD-APP-029–030; FR-APP-039–042 |
| generate | DD-3.1 §8.12; FR-APP-116 |
| clean | DD-APP-031–033; FR-APP-043–049 |
| reset | DD-APP-034–037; FR-APP-050–058 |
| reset-and-prepare composition (adapter workflow, not a use case) | DD-APP-038–041; FR-APP-059–065 |
| root creation | DD-APP-006–007, 042–049; FR-APP-066–090 |
| declared-script-runner (internal collaborator) | DD-APP-009, 050–054; FR-APP-091–098 |
| invocation-scoped state | DD-APP-055–057; FR-APP-110–115 |
| effect/preservation/cross-domain policy | DD-APP-058–069; FR-APP-099–104 |
| cancellation/recovery | DD-APP-010, 070–075; FR-APP-110–115 |
| interaction independence | DD-APP-076–078; FR-APP-105–109; IS-22 |
| concurrency/idempotency | DD-APP-079–084; IS-1/2/4/8 |
| sensitive information | DD-APP-085–088; IS-3/19 |
| extensibility/replaceability | DD-APP-089–092; IS-23 |
| canonical final outcome | DD-APP-CI-002, CI-012–013; IS-1 |

---

## 61. Version 1 Non-Drift Baseline

```text
IS-22 adapter -> IS-1 canonical invocation
                     |
                     +--> IS-2 managed/prospective project context
                     +--> IS-3 operation-effective configuration
                     +--> authorization / cancellation / events
                     |
                     v
                 IS-14 App use case
                     |
                     +--> semantic lifecycle plan/stages/policy
                     |
                     +--> IS-19 Settings domain where environment persistence is required
                     +--> IS-15 Git domain where repository policy is required
                     +--> IS-16/IS-13 Nuxt semantics where required
                     +--> IS-12/17 Docs semantics where required
                     +--> IS-11/18 Quality semantics only when explicitly composed
                     +--> IS-9 registry/template rendering
                     +--> IS-4 resource mechanics
                     +--> IS-8 existing-source transformation
                     +--> IS-5 process execution
                     |
                     v
               App stage acceptance
                     |
                     v
            App lifecycle result payload
                     |
                     v
             IS-1 final acceptance
                     |
                     v
        canonical AppManager outcome
```

The non-drift rule is:

> **Version 1 App Domain owns root-application lifecycle intent across its eight canonical commands (create, prepare, develop, build, preview, generate, clean, reset), applicability, lifecycle-stage composition, App-specific safety/effect policy, root-creation profile orchestration and App-domain acceptance/recovery interpretation. It consumes Engine-established scope/configuration/authorization, delegates specialist semantics and mechanics to their owners, preserves completed partial effects, and never turns project scripts into arbitrary shell execution, exposes the declared-script-runner as its own command, manufactures `app.reinitialise` as a command identity rather than an adapter-composed workflow, turns Clean into Reset, Prepare into scaffold replacement, root creation into Nuxt-layer creation, discovery into mutation authority, provider completion into App success, or App-domain interpretation into a competing final application outcome.**