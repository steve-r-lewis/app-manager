# IS-19 — Settings Domain Implementation Specification

> **Document type:** Level 4 Implementation Specification
>
> **Status:** Version 1 implementation baseline
>
> **Implementation ID:** IS-19
>
> **Primary Detailed Design:** [DD-4.2 — Settings Domain](../dd_4_policy_and_resource_domains/dd-4-2-settings-domain-detailed-design-v01.md)
>
> **Primary Functional authority:** [Settings Functional Specification](../functional/settings-functional-specification-v01.md)
>
> **Binding clarification:** [App / Settings Environment-Definition Ownership Clarification](../functional/app-settings-environment-definition-ownership-clarification-v01.md)
>
> **Application Core:** [IS-1 — Application Runtime and Invocation](is-1-application-runtime-and-invocation-implementation-specification-v01.md), [IS-2 — Managed Project Resolution](is-2-managed-project-resolution-implementation-specification-v01.md), [IS-3 — Configuration Resolution](is-3-configuration-resolution-implementation-specification-v01.md)
>
> **Principal shared implementations:** [IS-4 — Resource Access](is-4-resource-access-implementation-specification-v01.md), [IS-7 — Source Intelligence](is-7-source-intelligence-implementation-specification-v01.md), [IS-8 — Source Transformation](is-8-source-transformation-implementation-specification-v01.md), [IS-9 — Resource Registry and Template](is-9-resource-registry-and-template-implementation-specification-v01.md)
>
> **Related domain implementations:** [IS-14 — App Domain](is-14-app-domain-implementation-specification-v01.md), [IS-15 — Git Domain](is-15-git-domain-implementation-specification-v01.md), [IS-16 — Nuxt Domain](is-16-nuxt-domain-implementation-specification-v01.md), [IS-17 — Docs Domain](is-17-docs-domain-implementation-specification-v01.md), [IS-18 — Quality Domain](is-18-quality-domain-implementation-specification-v01.md), IS-20 AI Domain, IS-21 Utils Domain, IS-22 Interaction Adapters, [IS-23 — Build and Runtime Assembly](is-23-build-and-runtime-assembly-implementation-specification-v01.md)
>
> **Runtime decision:** [ADR-0001 — Primary Application Runtime](../project_management/decisions/adr-0001-primary-application-runtime.md)
>
> **Register:** [AppManager Implementation Specification](implementation-specification-v01.md)
>
> **Governing plan:** [Implementation Specification Plan](../project_management/implementation-specification-plan-v01.md)

## 1. Purpose

IS-19 defines the concrete Node.js/TypeScript implementation of AppManager's Settings domain.

Settings owns explicit inspection and management intent for supported AppManager settings, managed-project metadata, persisted environment definitions, contributors, licence resources and declarative template resources. It establishes semantic scope, validates Settings-owned values/resources, determines collision/replacement/preservation policy, delegates bounded persistence/transformation mechanics and interprets Settings-domain postconditions.

The governing implementation rules are:

> **Settings owns persisted settings/resource-management intent; IS-3 owns how configuration candidates become effective values; IS-1 retains final application authority.**

> **Persistence is not precedence. A durable write does not retroactively change an already-resolved effective-configuration snapshot.**

> **Metadata is not operational authority. Repository, licence, version or other metadata does not transfer the associated operational domain into Settings.**

> **Resource management is not resource execution. Registering or persisting a declarative resource does not authorize the domain action that later consumes it.**

> **AppManager operator identity, project author/contributor metadata and managed resources remain distinct semantic scopes even when their record shapes overlap.**

---

## 2. Scope and Non-Ownership

IS-19 implements:

- semantic Settings operation identity;
- AppManager/user setting inspection and explicit mutation;
- managed-project author, funding, bug, repository and application metadata management;
- persisted/effective value distinction;
- environment-definition create/read/set/unset/delete;
- contributor list/add/remove;
- licence catalogue selection, resource create/delete and explicitly coupled metadata synchronization;
- declarative template-resource list/add/delete;
- field/resource validation, no-op, collision and replacement policy;
- preservation policy supplied to IS-8;
- sensitive-value redaction/projection;
- stale-write, cancellation, concurrency, partial-effect and recovery interpretation;
- deterministic Headless Settings behavior;
- Settings-domain result payloads beneath IS-1 outcomes.

IS-19 does not own:

- configuration candidate applicability/precedence/provenance/effective-value construction — IS-3;
- managed-project identity/scope/targetability — IS-2;
- final application acceptance/outcome — IS-1;
- generic filesystem persistence — IS-4;
- generic source recognition/transformation — IS-7/IS-8;
- registry/template mechanics — IS-9;
- repository operational semantics — IS-15/IS-6;
- App lifecycle — IS-14;
- Nuxt/Docs/Quality/AI semantics;
- automatic version derivation owned by another use case;
- legal suitability/advice for licences;
- arbitrary executable plugins/templates;
- mutation of an already-running process environment;
- presentation/prompts — IS-22.

---

## 3. Concrete Module Boundary

```text
app/
└── domains/
    └── settings/
        ├── contracts/
        │   ├── settings-use-case.ts
        │   ├── settings-scope.ts
        │   ├── settings-target.ts
        │   ├── settings-value.ts
        │   ├── settings-mutation.ts
        │   ├── settings-result.ts
        │   ├── settings-effect.ts
        │   ├── settings-recovery.ts
        │   └── settings-diagnostic.ts
        ├── catalogue/
        │   ├── settings-use-case-catalogue.ts
        │   ├── setting-definition-catalogue.ts
        │   └── metadata-definition-catalogue.ts
        ├── policy/
        │   ├── settings-scope-resolver.ts
        │   ├── settings-validator.ts
        │   ├── replacement-policy.ts
        │   ├── preservation-policy.ts
        │   └── sensitive-value-policy.ts
        ├── metadata/
        │   ├── project-metadata-reader.ts
        │   ├── project-metadata-planner.ts
        │   └── metadata-normalizer.ts
        ├── environment/
        │   ├── environment-definition-reader.ts
        │   ├── environment-definition-planner.ts
        │   └── environment-value-classifier.ts
        ├── contributors/
        │   └── contributor-planner.ts
        ├── licences/
        │   └── licence-resource-planner.ts
        ├── templates/
        │   └── template-resource-planner.ts
        ├── orchestration/
        │   ├── settings-effect-runner.ts
        │   ├── settings-acceptance.ts
        │   └── settings-recovery-builder.ts
        └── use-cases/
            ├── inspect-setting.ts
            ├── set-setting.ts
            ├── unset-setting.ts
            ├── inspect-project-metadata.ts
            ├── update-project-metadata.ts
            ├── create-environment-definition.ts
            ├── read-environment-definition.ts
            ├── set-environment-entry.ts
            ├── unset-environment-entry.ts
            ├── delete-environment-definition.ts
            ├── list-contributors.ts
            ├── add-contributor.ts
            ├── remove-contributor.ts
            ├── create-licence-resource.ts
            ├── delete-licence-resource.ts
            ├── list-template-resources.ts
            ├── add-template-resource.ts
            └── delete-template-resource.ts
```

Storage representation remains behind planners/capabilities. This topology does not create a universal Settings document schema.

---

## 4. Public Use-Case Contract

```ts
export interface SettingsUseCase<TInput, TPayload> {
  readonly descriptor: SettingsUseCaseDescriptor;
  availability(context: ApplicationExecutionContext, input: TInput): Promise<SettingsAvailability>;
  validate(context: ApplicationExecutionContext, input: TInput): Promise<SettingsValidation>;
  execute(context: ApplicationExecutionContext, input: TInput): Promise<SettingsDomainResult<TPayload>>;
}
```

All Settings use cases participate in the IS-1 availability/validate/execute seam. `SettingsDomainResult` nests within the canonical application outcome and does not define a second generic `success` Boolean.

---

## 5. Canonical Operation Identities

Version 1 canonical IDs are:

```text
settings.inspect
settings.set
settings.unset
settings.project-metadata.inspect
settings.project-metadata.update
settings.environment.create
settings.environment.read
settings.environment.set
settings.environment.unset
settings.environment.delete
settings.contributor.list
settings.contributor.add
settings.contributor.remove
settings.licence.create
settings.licence.delete
settings.template.list
settings.template.add
settings.template.delete
```

Metadata field identity and resource identity remain structured inputs rather than multiplying command IDs for every field/template/licence.

Adapter aliases are presentation compatibility only.

---

## 6. Semantic Scope

```ts
export type SettingsScope =
  | { readonly kind: 'appmanager_user'; readonly owner: AppManagerUserIdentity }
  | { readonly kind: 'managed_project_setting'; readonly project: ManagedProjectIdentity }
  | { readonly kind: 'managed_project_metadata'; readonly project: ManagedProjectIdentity }
  | { readonly kind: 'environment_definition'; readonly project: ManagedProjectIdentity; readonly source: EnvironmentDefinitionIdentity }
  | { readonly kind: 'managed_resource'; readonly project: ManagedProjectIdentity; readonly resourceClass: SettingsResourceClass };
```

Every consequential operation resolves one unambiguous semantic scope before mutation.

`name`, `email` and `url` fields in AppManager operator identity, project author metadata and contributor metadata are not interchangeable contracts.

Project-scoped operations consume IS-2 context and never infer authority from cwd/resource visibility.

---

## 7. Persisted versus Effective Values

```ts
export interface SettingInspection {
  readonly persisted: SettingPersistedState;
  readonly effective?: EffectiveConfigurationReference;
  readonly effectiveProvenance?: ConfigurationProvenanceReference;
}
```

IS-19 may inspect a durable value it owns. When current effective configuration is requested, the value/provenance comes from IS-3.

After a Settings write, IS-19 reports the persisted after-state. It does not claim the current invocation's immutable IS-3 snapshot changed.

Future operations resolve configuration normally through IS-3.

---

## 8. Setting Definition Catalogue

IS-23 constructs an immutable catalogue of deliberately exposed settings:

```ts
export interface SettingDefinition<T> {
  readonly id: SettingId;
  readonly scope: SettingScopeClass;
  readonly sensitivity: 'public' | 'sensitive' | 'secret';
  readonly mutable: boolean;
  readonly unsettable: boolean;
  readonly validator: SettingValidator<T>;
  readonly persistence: SettingPersistenceDescriptor;
}
```

Catalogue membership establishes supported Settings behavior, not configuration precedence.

No arbitrary JSON key/path mutation is exposed.

---

## 9. Common Mutation Plan

```ts
export interface SettingsMutationPlan {
  readonly operation: SettingsOperationId;
  readonly target: SettingsTarget;
  readonly beforeRevision: ResourceRevisionEvidence;
  readonly effects: readonly SettingsPlannedEffect[];
  readonly preservation: SettingsPreservationPolicy;
  readonly replacement: SettingsReplacementPolicy;
  readonly authorizationCoverage: AuthorizationEvidenceReference;
  readonly postconditions: readonly SettingsPostcondition[];
}
```

Plans are immutable after authorization. Any material change in target/effect set invalidates the plan and requires revalidation/authorization.

---

## 10. Common Mutation Flow

A consequential operation performs:

1. normalize invocation through IS-1;
2. resolve project/scope through IS-2 where applicable;
3. consume IS-3 policy where needed;
4. acquire fresh bounded current-state evidence;
5. validate semantic value/resource identity;
6. determine no-op/collision/replacement state;
7. construct complete effect plan;
8. verify authorization covers those effects;
9. delegate new-resource mechanics to IS-4 or existing structured mutation to IS-8;
10. verify postconditions/current state;
11. interpret no-op/complete/partial/conflict/indeterminate Settings state;
12. return subordinate result to IS-1.

Read/list operations terminate before step 7 and never repair discovered content implicitly.

---

## 11. AppManager/User Settings

`settings.inspect`, `settings.set` and `settings.unset` operate only on catalogue-approved AppManager/user settings.

A durable preference write is prospective. It may influence later IS-3 resolution according to Configuration rules but does not mutate the already-resolved current invocation snapshot.

Operator/commit identity is a Settings scope where explicitly exposed, but Git repository operations remain IS-15-owned.

Sensitive settings are redacted/omitted by policy; Version 1 provides no generic reveal-secret operation.

---

## 12. Managed-Project Metadata Model

Supported semantic metadata classes include:

- author: name, email, telephone, URL;
- funding: type and URL;
- bugs: URL and supported related fields;
- repository: type and URL;
- application: version, description, privacy, application/module type, licence, keywords;
- contributors: separate collection semantics in §18.

The concrete storage representation may initially be package metadata where authoritative for the managed project, but storage keys do not define semantic ownership.

---

## 13. Metadata Inspection and Update

`settings.project-metadata.inspect` returns supported semantic fields and absent/unsupported distinctions.

`settings.project-metadata.update` accepts a bounded field or explicitly selected collection operation. It never normalizes the whole metadata document merely because a parser can serialize it.

Existing structured resources route through IS-8 with preservation constraints and revision binding. Unrelated supported content is preserved.

Invalid values fail before intended mutation.

---

## 14. Author Metadata

Author fields are independently addressable where the underlying convention supports them.

Email and URL values undergo semantic structural validation before persistence. Telephone remains declarative project metadata; no communication/identity semantics are inferred.

Absent project author data remains absent. IS-19 never silently copies AppManager operator identity into project author metadata unless a separately explicit initialization operation is approved.

Non-standard fields are represented only through an approved extension definition, never silently as standard metadata.

---

## 15. Funding, Bugs and Repository Metadata

Funding and bug-reporting metadata are validated against their supported semantic representations.

Repository metadata remains declarative. Updating it cannot initialize a repository, alter remotes, commit, push, fetch or synchronize.

Where policy requests consistency checking, IS-19 may consume normalized IS-6/IS-15 repository facts supplied through an approved read-only seam. A mismatch produces warning/rejection according to policy; Settings does not repair repository state.

A syntactically valid URL is not reported as reachable/existing without approved external evidence.

---

## 16. Application Metadata

Application metadata supports bounded inspection/update of version, description, privacy, application/module type, licence and keywords where applicable.

Manual version setting validates the project's supported representation but does not absorb automatic versioning/release policy from another domain.

Keyword add/remove preserves unrelated entries and normalizes materially equivalent duplicates. Whole-list replacement is explicit and distinct.

Application/module type uses an approved semantic enumeration, not arbitrary strings.

---

## 17. Licence Metadata Coherence

A direct metadata-only licence update and a licence-resource operation are distinct intents.

Where `settings.licence.create` explicitly includes synchronization of declared project licence metadata, both effects are planned before authorization:

```text
resolve licence identity
 -> render/resolve approved licence resource through IS-9
 -> create protected licence resource through IS-4
 -> update declared metadata through IS-8 when selected
 -> verify both effects
 -> report complete/partial coherence
```

Failure of one effect never permits IS-19 to claim coherent licence state. Completed effects are preserved and reported; no rollback is invented.

IS-19 never determines legal suitability of a licence.

---

## 18. Contributors

Contributor identity is a structured combination of supported fields sufficient to identify an entry unambiguously.

`settings.contributor.list` is read-only and reports an empty collection as valid state.

`settings.contributor.add` validates fields, detects materially equivalent duplicates and preserves unrelated contributors.

`settings.contributor.remove` requires an unambiguous match and removes only that entry. Ambiguous identity fails without mutation.

IS-21 Utils may delegate a convenience contributor operation to IS-19 but cannot create a second contributor authority.

---

## 19. Environment Definition Identity

```ts
export interface EnvironmentDefinitionIdentity {
  readonly id: EnvironmentDefinitionId;
  readonly project: ManagedProjectIdentity;
  readonly resource: ResourceReference;
  readonly representation: EnvironmentRepresentationId;
}
```

The selected persisted source is explicit. Discovery of multiple `.env`-like resources never authorizes mutation of all of them or guessing one.

Filename conventions are recognition evidence/configuration, not semantic authority.

---

## 20. Create Environment Definition

`settings.environment.create` requires an absent selected target and one explicit creation mode:

- approved example/default source;
- approved template/resource;
- explicit supplied entries/content conforming to policy.

An existing definition returns collision/already-exists and is never overwritten by create.

Creation from an example/default does not copy values from uncontrolled ambient `process.env` and does not fabricate missing secrets.

New-resource persistence uses IS-4 no-overwrite preconditions. IS-9 may render approved declarative content where applicable.

---

## 21. App Initialisation Environment Seam

IS-14 App owns the lifecycle decision that environment readiness is needed during existing-application initialisation. It supplies managed project, selected environment definition and approved example/default context to IS-19.

IS-19 executes its canonical `settings.environment.create` semantics, including validation, source selection, existing-definition protection, syntax and sensitive-value policy.

IS-14 consumes the Settings result as one lifecycle stage. Settings success does not establish App initialisation success.

There is no direct App file-copy bypass and no generic shared `EnvironmentService` authority.

---

## 22. Read Environment Definition

`settings.environment.read` may return recognized key identities, presence state and safe metadata.

Values classified or reasonably recognized as sensitive are redacted/omitted from normal payloads, diagnostics, events and logs.

Version 1 has no generic reveal-secret operation.

Malformed/unsupported syntax returns diagnostic/indeterminate evidence; read does not repair it.

---

## 23. Set/Unset Environment Entry

`settings.environment.set` identifies exactly one source, key and supplied value. `settings.environment.unset` identifies exactly one source/key.

Existing definitions use IS-8 semantic transformation with revision preconditions and preservation requirements for unrelated entries/comments/ordering where the representation supports preservation.

Unsetting an absent key returns unchanged/no-op rather than claiming deletion.

Malformed or unsupported syntax fails before mutation unless a separately explicit repair/migration use case is introduced.

Persisted mutation never claims to alter an already-running process environment or current IS-3 snapshot.

---

## 24. Delete Environment Definition

`settings.environment.delete` is an explicit consequential operation against one selected persisted definition.

Deletion requires authorization coverage and fresh resource preconditions. It never deletes every discovered environment source.

Already-absent behavior is an explicit no-op/not-found interpretation according to operation policy.

Deletion does not scrub process memory, external secret stores or unrelated environment files.

---

## 25. Sensitive Value Classification

```ts
export type SettingsSensitivity = 'public' | 'sensitive' | 'secret';
```

Classification derives from setting/resource definitions plus bounded defense-in-depth recognition for credential-shaped environment keys/content.

Secret material is not placed in diagnostics, semantic events, default structured results or logs. Before/after state for sensitive values records presence/change/fingerprint evidence where safe, not plaintext.

Redaction does not prevent the owning persistence capability from receiving an authorized value required for the write.

---

## 26. Licence Resources

`settings.licence.create` resolves an unambiguous licence-class item through IS-9. Catalogue identity/provenance is preserved.

IS-9 provides approved proposed licence content; IS-19 establishes target/resource intent and authorization; IS-4 creates the new resource with no-overwrite protection.

Existing licence resource replacement is not implied by create. A future replacement operation must be separately explicit.

`settings.licence.delete` removes only the selected managed licence resource after authorization. Metadata synchronization occurs only when explicitly included in the operation plan.

---

## 27. Declarative Template Resources

Settings manages registry membership/content for approved declarative template classes through IS-9 contracts.

`settings.template.list` is read-only.

`settings.template.add` validates class, item identity, provenance/trust/compatibility and declarative constraints before persistence/registration.

`settings.template.delete` removes the selected managed declarative resource according to class/source policy.

Adding a template does not execute/render/apply it to a project. Deleting it does not delete resources previously produced from it.

No executable code, hook, command, unrestricted URL fetch or plugin loading is introduced through template management.

---

## 28. Resource-Class Preservation

Licence and template resources share registry infrastructure but remain materially different classes with class-specific validation/policy.

IS-19 does not introduce a generic `ManagedResource<any>` contract that erases class semantics.

New classes require explicit semantic ownership and class policy, not merely JSON shape compatibility.

---

## 29. No-Op Semantics

No-op is explicit evidence, not generic success shorthand. Examples include:

- setting materially equivalent value;
- unsetting already-absent optional setting/key;
- adding materially duplicate contributor where policy treats it as unchanged;
- listing empty contributors/templates;
- a requested metadata value already being present.

No-op must be distinguished from unsupported, unavailable, invalid, ambiguous and failed.

---

## 30. Collision and Replacement

Create/add operations default to protection against existing conflicting targets.

Replacement requires an operation whose semantics explicitly permit replacement plus authorization covering replacement effects.

A generic `force: true` Boolean cannot bypass semantic collision policy, stale-write protection or scope authority.

---

## 31. Stale-Write Protection

Existing-resource mutation plans bind to IS-4/IS-8 revision evidence.

Before consequential execution, IS-19 verifies the target/effect set still matches the authorized plan. Revision change returns conflict/stale evidence unless a deliberate re-read/replan/re-authorize path occurs.

No blind retry follows stale conflict.

---

## 32. Multi-Effect Operations

Some Settings operations legitimately have multiple effects, especially licence resource + metadata synchronization.

```ts
export interface SettingsEffectResult {
  readonly effect: SettingsEffectIdentity;
  readonly state: 'applied' | 'unchanged' | 'failed' | 'cancelled' | 'indeterminate' | 'not_attempted';
  readonly evidence: readonly SettingsEvidenceReference[];
}
```

Each effect remains individually visible. A later failure does not erase an earlier completed effect.

IS-19 reports partial domain state/recovery evidence; IS-1 owns canonical partial-success classification.

---

## 33. Cancellation

Cancellation propagates from IS-1 into IS-4/IS-8/IS-9 operations where supported.

IS-19 stops future effects as soon as safely practical, preserves completed effects and identifies not-attempted/indeterminate work.

Cancellation is not rollback.

---

## 34. Concurrency

Conflict keys are semantic/resource-relative, for example:

```text
settings:<scope>:<setting-id>
metadata:<project-id>:<resource-id>
environment:<project-id>:<definition-id>
registry:<class-id>:<item-id>
```

Independent Settings operations may run concurrently. Operations targeting the same mutable resource are coordinated/rejected according to revision/conflict policy.

No global Settings mutex is introduced.

---

## 35. Retry

IS-19 performs no hidden retry after conflict, ambiguous state, cancellation or indeterminate effect.

A deliberate retry re-acquires current state, revalidates semantic policy, rebuilds the effect plan and obtains authorization when material effects changed.

---

## 36. Settings-Domain Acceptance

Acceptance is operation-specific:

- inspect/list: requested supported state was read without mutation and represented truthfully;
- set/update/add/remove/unset: selected semantic target changed or validly no-op'd as requested while preservation/postconditions hold;
- create: selected absent target was created with required identity/content and no overwrite;
- delete: selected target was removed or validly interpreted as already absent under policy;
- environment operations: exact source/key semantics, preservation and sensitive projection hold;
- licence coupled operation: all required effects and coherence conditions are individually known;
- template management: intended registry resource membership changed without executing the resource.

Delegated write/render/parse completion alone never establishes Settings acceptance. IS-1 retains final application acceptance.

---

## 37. Domain Result

```ts
export interface SettingsDomainPayload {
  readonly operation: SettingsOperationId;
  readonly scope: SettingsScopeIdentity;
  readonly target: SettingsTargetIdentity;
  readonly before?: SettingsSafeStateEvidence;
  readonly requested: SettingsRequestedStateEvidence;
  readonly validation: SettingsValidationDecision;
  readonly effects: readonly SettingsEffectResult[];
  readonly after?: SettingsSafeStateEvidence;
  readonly noOp?: SettingsNoOpReason;
  readonly diagnostics: readonly SettingsDomainDiagnostic[];
  readonly sensitivity: SettingsSensitivityProjection;
  readonly recovery?: SettingsRecoveryPosition;
}
```

The payload has no competing generic `success` field.

---

## 38. Recovery

```ts
export interface SettingsRecoveryPosition {
  readonly completedEffects: readonly SettingsEffectIdentity[];
  readonly unresolvedEffects: readonly SettingsEffectIdentity[];
  readonly currentStateKnown: boolean;
  readonly revalidation: readonly SettingsRevalidationRequirement[];
  readonly dispositions: readonly ('retry' | 'reconcile' | 'manual_intervention')[];
}
```

Recovery is informational. Version 1 does not implement generic transactional rollback or persisted workflow resumption.

---

## 39. Diagnostics

Initial stable codes include:

```text
SETTINGS_OPERATION_UNAVAILABLE
SETTINGS_SCOPE_REQUIRED
SETTINGS_SCOPE_AMBIGUOUS
SETTINGS_SCOPE_NOT_MANAGED
SETTINGS_SETTING_UNSUPPORTED
SETTINGS_SETTING_READ_ONLY
SETTINGS_VALUE_INVALID
SETTINGS_VALUE_SENSITIVE
SETTINGS_TARGET_ALREADY_EXISTS
SETTINGS_TARGET_NOT_FOUND
SETTINGS_REPLACEMENT_NOT_AUTHORIZED
SETTINGS_MUTATION_STALE
SETTINGS_MUTATION_CONFLICT
SETTINGS_METADATA_UNSUPPORTED
SETTINGS_REPOSITORY_METADATA_CONFLICT
SETTINGS_ENVIRONMENT_SOURCE_REQUIRED
SETTINGS_ENVIRONMENT_SOURCE_AMBIGUOUS
SETTINGS_ENVIRONMENT_MALFORMED
SETTINGS_ENVIRONMENT_KEY_INVALID
SETTINGS_ENVIRONMENT_KEY_ABSENT
SETTINGS_CONTRIBUTOR_DUPLICATE
SETTINGS_CONTRIBUTOR_AMBIGUOUS
SETTINGS_LICENCE_AMBIGUOUS
SETTINGS_LICENCE_PARTIAL
SETTINGS_TEMPLATE_CLASS_UNSUPPORTED
SETTINGS_TEMPLATE_CONFLICT
SETTINGS_TEMPLATE_UNTRUSTED
SETTINGS_PARTIAL_EFFECT
SETTINGS_CANCELLED
SETTINGS_EFFECT_INDETERMINATE
SETTINGS_RECOVERY_REVALIDATION_REQUIRED
```

Diagnostics contain safe semantic identities/evidence references and never secret plaintext.

---

## 40. Headless and Interaction Semantics

Headless callers provide or deterministically resolve operation, scope, target/resource identity, requested value and required authorization. Missing/ambiguous required input returns a structured decision requirement/failure rather than prompting or guessing.

IS-22 may present settings menus, field editors, confirmations and redacted values but maps them to the same canonical use cases.

No IS-19 module imports prompt libraries, terminal colours, spinners or IDE APIs.

---

## 41. Events and Observability

Semantic events may include:

```text
settings.target.resolved
settings.validation.completed
settings.plan.ready
settings.effect.started
settings.effect.applied
settings.effect.failed
settings.effect.cancelled
settings.operation.unchanged
settings.operation.partial
settings.recovery.available
```

Events expose safe IDs, state and effect evidence. Sensitive values, raw environment content and protected configuration are excluded.

---

## 42. Security

Settings input is structured; no arbitrary executable/shell/template code surface exists.

Resource paths are bounded references supplied/validated through IS-2/IS-4, not caller-controlled unrestricted paths.

Environment values are treated as sensitive according to classification. No ambient secret copying, generic reveal operation or diagnostic leakage is permitted.

Registry/template additions remain declarative and cannot load executable modules.

External URLs are data unless an approved capability separately establishes reachability/trust.

---

## 43. App Domain Relationship

IS-14 may delegate persisted environment-definition creation to IS-19 during existing-application initialisation.

App owns lifecycle need, sequencing and App acceptance; Settings owns environment source/CRUD/protection/preservation/sensitivity semantics.

No App direct-copy fallback is allowed when the canonical Settings operation is unavailable/fails.

---

## 44. Git Domain Relationship

Repository metadata is declarative Settings state. IS-15 owns repository operations.

IS-19 may consume repository facts to detect a metadata inconsistency, but it cannot alter remotes/init/commit/push to make metadata match.

Operator/commit identity management in Settings likewise does not itself perform a Git operation.

---

## 45. Nuxt, Docs, Quality and AI Relationships

Nuxt configuration semantics remain IS-16/IS-13-owned even when a setting/template influences them.

Docs generation remains IS-17/IS-12-owned; managing a documentation template does not generate documentation.

Quality policy/evaluation remains IS-18-owned; storing a threshold/preference does not evaluate a gate.

AI template/instruction resources may be Settings-managed declarative resources, but IS-20/IS-10 retain AI context/disclosure/execution/acceptance semantics.

---

## 46. Utils Relationship

IS-21 Utils may expose convenience compatibility operations that delegate to Settings-owned semantics, including contributor management where retained.

A convenience entry point cannot bypass Settings validation, scope, authorization, preservation or acceptance.

---

## 47. Composition

IS-23 constructs:

1. immutable setting/metadata definition catalogues;
2. Settings validators/policies;
3. metadata/environment/contributor/licence/template planners;
4. injected IS-4/IS-7/IS-8/IS-9 collaborators;
5. optional read-only repository-fact collaborator;
6. Settings effect runner/acceptance/recovery components;
7. eighteen canonical Settings use cases;
8. immutable Settings use-case catalogue;
9. IS-1 registrations.

No import-time Settings singleton, mutable global config state, direct `process.cwd()`, direct `process.env` configuration authority or service locator exists.

---

## 48. Testing Requirements

Core tests cover at least:

1. eighteen canonical IDs;
2. storage keys/files do not define operation identity;
3. AppManager/user scope distinct from project metadata;
4. author/contributor identity scopes distinct;
5. IS-2 project scope required;
6. no cwd-derived project authority;
7. persisted/effective distinction;
8. effective provenance comes from IS-3;
9. write does not mutate current effective snapshot;
10. catalogue rejects unsupported setting;
11. read-only setting rejects mutation;
12. invalid value fails before write;
13. equivalent set is no-op;
14. sensitive inspect redacts;
15. no generic secret reveal;
16. metadata field-bounded update;
17. unrelated metadata preserved;
18. absent author not synthesized from operator;
19. invalid author email rejected;
20. invalid author URL rejected;
21. non-standard author field not silently standard;
22. funding validation;
23. bug URL validation;
24. repository metadata does not mutate Git;
25. repository fact conflict warning/rejection;
26. valid URL not claimed reachable without evidence;
27. manual version validation;
28. manual version does not absorb automatic versioning;
29. privacy semantic Boolean;
30. application/module type enumeration;
31. keyword add preserves entries;
32. duplicate keyword normalization;
33. keyword replace explicit;
34. licence metadata/resource intents distinct;
35. coupled licence effects preplanned;
36. licence partial effect retained;
37. no legal suitability claim;
38. contributor empty list valid;
39. contributor add validation;
40. contributor duplicate handling;
41. contributor preservation;
42. contributor remove unambiguous;
43. Utils delegation does not create authority;
44. environment source explicit;
45. multiple environment sources ambiguous;
46. create protects existing definition;
47. create from approved example;
48. create does not copy ambient process secrets;
49. create does not fabricate secrets;
50. App delegation uses canonical Settings create;
51. Settings success not App success;
52. environment read redacts secrets;
53. malformed environment read does not repair;
54. set changes one key;
55. set preserves unrelated entries;
56. unset removes one key;
57. unset absent key no-op;
58. comments/order preservation where supported;
59. persisted environment does not mutate process env;
60. persisted environment does not mutate current IS-3 snapshot;
61. environment delete exact source only;
62. licence identity unambiguous;
63. licence content comes from IS-9;
64. licence create no-overwrite;
65. licence delete exact resource;
66. template list read-only;
67. template add class-aware;
68. template provenance/trust validation;
69. template add cannot introduce executable plugin;
70. template add does not apply template;
71. template delete does not delete rendered outputs;
72. resource classes not collapsed into generic schema;
73. no-op distinct from unsupported/failure;
74. create collision fails safe;
75. generic force cannot bypass policy;
76. stale revision blocks write;
77. stale conflict not blindly retried;
78. multi-effect results preserve each effect;
79. completed effect survives later failure;
80. cancellation stops future effects;
81. cancellation is not rollback;
82. independent settings can run concurrently;
83. same-resource conflicts coordinated;
84. no global Settings mutex;
85. retry revalidates/replans;
86. delegated persistence not sufficient for acceptance;
87. no competing success Boolean;
88. recovery informational only;
89. no generic transaction/rollback fiction;
90. structured Headless missing-input behavior;
91. interactive adapter equivalence;
92. no prompts/colors in domain;
93. semantic events redact sensitive values;
94. arbitrary path input rejected/bounded;
95. arbitrary executable template rejected;
96. external URL remains data absent evidence;
97. App lifecycle ownership preserved;
98. Git operational ownership preserved;
99. Nuxt semantics preserved;
100. Docs semantics preserved;
101. Quality semantics preserved;
102. AI semantics preserved;
103. explicit IS-23 composition;
104. no singleton/global mutable config;
105. capability/provider substitution does not change Settings policy;
106. final acceptance remains IS-1-owned.

Integration tests use controlled IS-4/IS-7/IS-8/IS-9 substitutes and fixtures for AppManager settings, package/project metadata, environment definitions, contributor collections, licence resources, declarative registries, stale revisions, partial multi-effects, cancellation and Headless ambiguity.

---

## 49. Current Implementation Disposition

| Current artefact/responsibility | Disposition | Version 1 treatment |
|---|---|---|
| absent `app/commands/settings/` surface | **ADD** | Introduce IS-22 adapter registrations for the canonical IS-19 use cases rather than one generic settings command. |
| `app/services/configService.ts` mutable runtime state | **SPLIT / REPLACE / RELOCATE** | Separate persisted Settings intent from IS-3 effective configuration/runtime context. Do not retain as a Settings authority. |
| `configService` “Single Source of Truth” claim | **REPLACE** | IS-3/IS-1 own effective configuration/runtime authority; Settings owns only explicit persisted management semantics. |
| `configService.getDefaults()` `process.cwd()` | **REPLACE** | IS-2/IS-1 supply project/invocation context; no Settings cwd authority. |
| `configService` `gitUser` state | **ADAPT / RELOCATE** | May inform an AppManager/operator identity setting definition if retained; it must remain distinct from project author/contributor metadata. |
| `configService` verbose/dryRun flags | **ADAPT / SPLIT** | Persisted preference, invocation override and effective value are distinct; IS-3 defines effective resolution. |
| `configService` Zod validation mechanics | **RETAIN / ADAPT** | Runtime schema validation is useful but schemas move to semantically owned setting/metadata definitions. |
| `configService` exported singleton | **REPLACE** | Explicit IS-23 construction/injection; no global mutable Settings authority. |
| `app/services/fileService.ts` persistence mechanics | **RELOCATE / REPLACE by IS-4 seam** | Generic resource mechanics remain shared capability implementation. |
| `app/services/codeService.ts` structured mutation mechanics | **RELOCATE / REPLACE by IS-7/IS-8 seams** | Settings supplies semantic mutation intent/preservation only. |
| template repository/catalogue data | **RETAIN / ADAPT through IS-9** | Preserve approved declarative content/identity; class-specific validation/provenance remains IS-9. |
| future direct `.env.example` copy from App | **REJECT** | App delegates to canonical IS-19 environment create under the binding clarification. |
| future direct Git mutation for repository metadata | **REJECT** | Repository metadata remains declarative; Git effects remain IS-15. |
| future template execution from Settings | **REJECT** | Settings manages declarative resource; consuming domain owns application. |
| future secret reveal/logging convenience | **REJECT for Version 1** | Redacted/omitted normal presentation; no generic reveal operation. |
| prompts/colors/logging presentation in Settings | **RELOCATE** | IS-22/IS-1 presentation and semantic events. |

The current implementation has no Settings command directory and the legacy `configService` explicitly conflates cwd, Git user and runtime flags as a mutable global “Single Source of Truth”. That topology is implementation evidence to reconcile, not normative Settings architecture.

---

## 50. Migration Sequence

1. add Settings contracts and semantic scope model;
2. add immutable setting/metadata definition catalogues;
3. split persisted preference semantics from legacy `configService` runtime/effective state;
4. remove cwd-derived Settings/project authority;
5. add IS-3-backed persisted/effective inspection projection;
6. add project metadata reader/planner over IS-7/IS-8;
7. implement author/funding/bugs/repository/application metadata validation;
8. implement bounded keyword/list operations;
9. implement contributor list/add/remove;
10. implement environment-definition identity/recognition;
11. implement environment create with existing-target protection;
12. implement App -> Settings environment creation seam;
13. implement environment read/redaction;
14. implement environment set/unset through IS-8 preservation/stale-write semantics;
15. implement environment delete through IS-4;
16. implement licence class resolution/rendering through IS-9;
17. implement licence create/delete and explicit metadata synchronization;
18. implement declarative template list/add/delete through IS-9;
19. implement multi-effect acceptance/partial recovery;
20. implement cancellation/concurrency/stale/retry handling;
21. add eighteen IS-22 adapter registrations;
22. remove direct persistence/parser/provider access from Settings domain paths;
23. remove legacy singleton/global mutable Settings authority as IS-23 composition lands;
24. run scope, persistence-vs-precedence, environment ownership, sensitive-data, preservation, resource-execution, partial-effect and Headless conformance suites.

---

## 51. Traceability

| Implementation concern | Governing authority |
|---|---|
| domain boundary | DD-SET-001–005; FR-SET-001–005 |
| invocation/validation/authorization/preservation | DD-SET-006–023; FR-SET-006–021 |
| semantic scope/persisted-effective distinction | DD-SET-017–021; FR-SET-022–030 |
| author metadata | DD-4.2 metadata design; FR-SET-031–037 |
| funding/bugs/repository metadata | DD-SET-025–026; FR-SET-038–044 |
| application metadata | DD-4.2 application-metadata design; FR-SET-045–057 |
| environment definitions | DD-SET-027–031; FR-SET-058–071; FCL-APPSET-001–007 |
| contributors | DD-SET-032 onward contributor design; FR-SET-072–080 |
| licences | DD-4.2 licence composition; FR-SET-081–090 |
| declarative templates | DD-SET resource-management design; FR-SET-091–100 |
| cross-domain coordination | DD-SET-004–016; FR-SET-101–107 |
| results/failure/safety | DD-4.2 result/safety design; FR-SET-108–116 |
| persistence mechanics | DD-2.1/DD-2.5; IS-4/IS-8 |
| registry/template mechanics | DD-2.6; IS-9 |
| effective configuration | DD-1.4; IS-3 |
| final application acceptance | DD-1.5; IS-1 |

---

## 52. Version 1 Non-Drift Baseline

```text
IS-22 adapter / Headless caller / owning domain
                |
                v
        IS-1 invocation/authority
                |
                +--> IS-2 managed project/scope
                +--> IS-3 effective policy/provenance
                |
                v
          IS-19 Settings Domain
                |
                +--> semantic setting/resource scope
                +--> validation/collision/preservation policy
                +--> metadata/environment/resource orchestration
                +--> sensitive projection/acceptance/recovery
                |
                +--> IS-7 read/recognition evidence
                +--> IS-9 registry/template evidence/proposed content
                +--> IS-4 new-resource/delete mechanics
                +--> IS-8 existing structured mutation
                |
                v
          IS-19 Settings acceptance
                |
                v
          IS-1 final acceptance
                |
                v
        canonical AppManager outcome
```

The non-drift rule is:

> **Version 1 Settings Domain owns explicit persisted settings, metadata and declarative-resource management intent, semantic scope, validation, collision/replacement/preservation policy, sensitive projection and Settings-domain acceptance. It never reconstructs managed-project authority from cwd, turns persistence into configuration precedence, conflates operator identity with project author/contributor metadata, turns repository metadata into Git authority, mutates every discovered environment source, overwrites an existing environment definition through create, fabricates or reveals secrets, turns template registration into template execution, claims legal licence suitability, hides partial multi-effect state, introduces generic rollback fiction, or publishes a competing final AppManager outcome.**