# AppManager Resolvers — Architectural Purpose and Functional Specification

## 1. Purpose

A **Resolver** in AppManager is an application-layer component responsible for transforming incomplete, ambiguous, layered, or context-dependent input into a single **effective value, target, configuration, resource, or decision** that another component can safely consume.

Resolvers exist because AppManager frequently has several possible sources for the same piece of information.

For example, the effective Git branch might potentially come from:

```text
explicit command argument
        ↓
project-local setting
        ↓
project-shared setting
        ↓
tool-level setting
        ↓
detected repository state
        ↓
safe built-in default
```

Likewise, an author name could come from:

```text
explicit value
        ↓
project setting
        ↓
tool setting
        ↓
local Git identity
        ↓
interactive user input
```

The resolver's responsibility is to apply the application's precedence and fallback rules consistently and return the value that should actually be used.

In architectural terms:

**Commands express intent.  
Resolvers remove ambiguity.  
Orchestrators coordinate workflows.  
Services perform capabilities.  
Strategies understand source formats.  
Scanners tokenize source.  
Templates generate content.**

---

# 2. Position Within the Architecture

The preferred dependency direction is:

```text
User / CI
    │
    ▼
Interactive Mode / Headless Mode
    │
    ▼
Command
    │
    ├──► Resolver
    │       │
    │       ├──► ConfigService
    │       ├──► environment/runtime state
    │       ├──► capability-detection services
    │       └──► optional interaction adapter
    │
    ▼
Orchestrator
    │
    ├──► Resolver
    ├──► Service
    ├──► CodeService
    ├──► Template
    └──► subordinate Orchestrator
```

Resolvers may therefore be consumed from either:

- commands, before invoking an orchestrator; or
- orchestrators, when resolution depends on state discovered during the workflow.

The deciding factor is not *who calls it*, but whether its responsibility is **resolution rather than execution**.

---

# 3. Architectural Definition

A component should be classified as a resolver when its primary responsibility is:

> Given a value that may be absent, ambiguous, layered, aliased, inferred, or context-dependent, determine the single effective value that the application should use according to explicit precedence and validation rules.

Typical resolver outputs include:

- a settings value;
- a Git branch;
- a repository;
- a filesystem target;
- a package manager;
- an LLM provider;
- a Nuxt layer;
- a template;
- a licence;
- an author identity;
- an environment configuration;
- a command execution scope.

Resolvers convert **possibilities** into **decisions**.

---

# 4. What a Resolver Is Not

Resolvers should not become a generic dumping ground for convenience helpers.

## 4.1 Not a Service

A service performs a capability.

For example:

```text
ConfigService
    → load settings
    → read persisted values
    → write persisted values

GitHubService
    → inspect repository state
    → create repository
    → read Git identity

FileService
    → read/write files
```

A resolver consumes those capabilities to answer:

```text
Which value should be used?
Which repository is the target?
Which provider is effective?
Which configuration wins?
```

A service exposes facts and operations.

A resolver interprets those facts according to application policy.

---

## 4.2 Not an Orchestrator

An orchestrator coordinates a sequence of operations that collectively achieve a domain outcome.

A resolver should normally terminate once a decision has been made.

For example:

```text
LayerResolver
    → resolves which layer the user means
```

versus:

```text
CreateLayerOrchestrator
    → creates directories
    → renders templates
    → writes files
    → creates Git repository
    → registers submodule
    → validates result
```

The resolver decides **which layer**.

The orchestrator decides **what happens to it**.

---

## 4.3 Not a Command

Commands are user-facing actions.

A resolver is reusable application logic.

Several commands may need the same effective author identity, default Git branch, LLM provider, repository selection, or project scope.

That policy should not be reimplemented inside each command.

---

## 4.4 Not a Prompt

A prompt is one possible source of information.

It is not itself resolution.

The architectural distinction should be:

```text
Resolver
    │
    ├── explicit input
    ├── persisted settings
    ├── detected environment
    ├── built-in default
    └── interaction source
```

The prompt supplies a candidate value.

The resolver decides when that source is consulted and whether its result is valid.

---

## 4.5 Not a Validator

Validation answers:

```text
Is this candidate value acceptable?
```

Resolution answers:

```text
Which acceptable candidate should be used?
```

A resolver will often call or embed validation rules, but validation alone is not resolution.

---

# 5. Core Resolver Responsibilities

Resolvers generally perform five kinds of work.

## 5.1 Candidate Collection

Gather possible values from approved sources.

Example:

```text
requestedBranch
configuredBranch
currentGitBranch
builtInDefault
```

---

## 5.2 Precedence

Apply an explicit ordering.

For settings, AppManager already specifies:

```text
project-local
    ↓
project-shared
    ↓
app-manager/tool
```

Higher-priority valid values win.

Precedence must be centralized rather than duplicated throughout commands.

---

## 5.3 Validation

Reject candidates that are:

- malformed;
- unsupported;
- unavailable;
- inaccessible;
- unsafe;
- incompatible with current execution mode.

---

## 5.4 Fallback

Move to the next acceptable source when a preferred source is absent or unusable.

---

## 5.5 Result Classification

Return not merely the value when useful, but also where it came from.

For example:

```ts
interface Resolution<T> {
  value: T;
  source: ResolutionSource;
}
```

This allows commands such as settings inspection tools to report:

```text
github.defaultBranch = main
source: project-shared
```

without independently reconstructing the precedence chain.

---

# 6. Determinism

Resolvers should be deterministic whenever their inputs and environmental observations are the same.

Given:

```text
same explicit input
same settings
same repository state
same environment
same execution mode
```

the resolver should produce the same result.

This property is important for:

- CI/CD;
- unit testing;
- dry-run plans;
- reproducibility;
- debugging.

Interactive prompting is inherently external input, so it should be treated as a distinct candidate provider rather than allowing the resolver architecture itself to become UI-dependent.

---

# 7. Pure Resolution Versus Interactive Completion

AppManager needs both.

They should be distinguished explicitly.

## 7.1 Pure Resolution

Pure resolution uses already-available sources.

Example:

```ts
settingsResolver.resolve('github.defaultBranch')
```

Potential result:

```ts
{
  value: 'develop',
  source: 'project-local'
}
```

No prompt and no persistence occur.

---

## 7.2 Required Resolution

Some consumers need a guaranteed value.

For example:

```ts
settingsResolver.require('github.defaultBranch')
```

This returns a real value or throws a typed resolution error.

---

## 7.3 Interactive Completion

When no value can be resolved and the execution mode permits interaction, the application may ask the user.

That should preferably be represented as an interaction adapter or candidate provider.

Conceptually:

```text
Resolver
    │
    ├── configured sources
    ├── environmental sources
    ├── defaults
    └── InteractionProvider
            └── prompt user
```

This preserves the resolver's architectural meaning while still supporting the existing `resolveOrPrompt` use case.

---

# 8. Persistence Is Separate from Resolution

The existing `resolveOrPrompt` specification says a prompted value should immediately be written through `configService.setSetting()`.

That may be useful behaviour, but persistence should be treated as an explicit policy.

These are distinct operations:

```text
resolve value
```

and:

```text
persist value for future resolution
```

A user may legitimately provide a one-off value without wanting to alter configuration.

Therefore a resolution request should be able to express policy such as:

```ts
interface ResolutionPolicy {
  allowPrompt: boolean;
  persistPromptedValue: boolean;
  persistSection?: SettingsFileSectionName;
}
```

This prevents “asking for a value” from silently meaning “modify project configuration”.

---

# 9. Resolution Sources

A consistent vocabulary should be used across resolver implementations.

Possible source categories include:

```ts
type ResolutionSource =
  | 'explicit'
  | 'project-local'
  | 'project-shared'
  | 'tool'
  | 'environment'
  | 'detected'
  | 'built-in'
  | 'interactive';
```

Individual resolvers may define more specific variants.

For example:

```ts
type AuthorResolutionSource =
  | 'explicit'
  | 'project-local'
  | 'project-shared'
  | 'tool'
  | 'git-local'
  | 'git-global'
  | 'interactive';
```

---

# 10. Resolution Results

A useful general contract is:

```ts
export interface Resolution<T, S extends string = ResolutionSource> {
  value: T;
  source: S;
}
```

For cases where failure is expected:

```ts
export type ResolutionResult<T> =
  | {
      ok: true;
      value: T;
      source: ResolutionSource;
    }
  | {
      ok: false;
      reason: ResolutionFailure;
    };
```

A throwing `require()` API can then be built on top of a non-throwing `tryResolve()` implementation.

---

# 11. Typed Resolution Errors

Headless execution should not receive vague errors such as:

```text
Missing configuration.
```

Prefer a structured error:

```ts
export class ResolutionError extends Error {
  constructor(
    public readonly key: string,
    public readonly reason: ResolutionFailureCode,
    message: string,
  ) {
    super(message);
  }
}
```

Possible reasons:

```ts
type ResolutionFailureCode =
  | 'missing'
  | 'invalid'
  | 'ambiguous'
  | 'unavailable'
  | 'cancelled'
  | 'interaction-required'
  | 'unsupported';
```

This allows the command layer to map errors consistently to:

- user-facing text;
- exit codes;
- remediation guidance.

---

# 12. Headless Behaviour

Resolvers must never accidentally block waiting for input in headless execution.

A resolver invoked with interaction disabled must either:

1. resolve from non-interactive sources; or
2. fail immediately and clearly.

For example:

```text
Unable to resolve 'github.defaultOrg'.

Checked:
- project-local settings
- project-shared settings
- tool settings

No default is defined.

Provide:
  am app-config set github.defaultOrg <value>
or pass an explicit --org option.
```

Headless operation should remain deterministic.

---

# 13. Interactive Behaviour

When interaction is permitted, the resolver may delegate to an interaction provider.

Example:

```ts
interface ResolutionInteraction {
  requestText(options: TextResolutionPrompt): Promise<string>;
  requestSelection<T>(
    options: SelectionResolutionPrompt<T>
  ): Promise<T>;
}
```

The resolver should not need to know that the implementation uses `@clack/prompts`.

This makes the architecture usable by:

- the existing TUI;
- tests;
- a future GUI;
- a future remote interface.

---

# 14. Cancellation

Cancellation is not a valid resolved value.

If the user cancels an interactive resolution, the resolver should produce a typed cancellation outcome or throw a `ResolutionError` with reason:

```text
cancelled
```

It must not:

- persist the cancellation token;
- return an empty string unless the schema genuinely permits it;
- silently fall through to an unsafe default.

---

# 15. Built-In Defaults

Built-in defaults should only exist where the application has a genuinely safe universal choice.

The existing settings specification identifies examples such as:

```text
llm.enabled               → true
github.defaultVisibility  → private
github.defaultBranch      → main
```

A default should not be created merely to avoid prompting.

For example, automatically inventing:

```text
github.defaultOrg
```

would be incorrect because no universal safe organisation exists.

Resolver defaults should therefore be deliberate architectural policy.

---

# 16. Null, Undefined, and Empty Values

Resolvers must distinguish these carefully.

Recommended semantics:

```text
undefined → source did not provide a candidate
null      → explicitly unset / no usable configured value
''        → actual string candidate; validate according to field rules
```

For required settings, `null` should normally continue the fallback chain.

For optional settings, `null` may be a legitimate final result.

This distinction should be encoded in resolver-specific types rather than handled ad hoc.

---

# 17. Settings Resolution

The settings resolver is the first concrete resolver required by AppManager.

Its precedence should remain:

```text
project-local
    ↓
project-shared
    ↓
app-manager
```

followed, where applicable, by:

```text
contextual/detected fallback
    ↓
built-in default
    ↓
interactive completion
```

The exact later stages depend on the setting.

For example:

```text
author.name
```

may resolve through:

```text
project-local
    ↓
project-shared
    ↓
tool
    ↓
Git identity
    ↓
interactive input
```

while:

```text
github.defaultBranch
```

may resolve through:

```text
project-local
    ↓
project-shared
    ↓
tool
    ↓
built-in 'main'
```

No prompt is necessary because a safe default exists.

---

# 18. ConfigService Versus SettingsResolver

This boundary should be explicit.

## ConfigService

Owns:

- loading settings files;
- validating settings files;
- reading values from each tier;
- writing values;
- removing values;
- reporting persisted source sections.

It is infrastructure.

It should not decide application-specific contextual fallbacks such as:

```text
if author.name isn't configured,
try Git identity.
```

---

## SettingsResolver

Owns:

- application precedence beyond raw persisted tiers;
- built-in defaults;
- contextual fallback rules;
- required-versus-optional semantics;
- optional interactive completion policy.

It consumes ConfigService.

Conceptually:

```text
SettingsResolver
        │
        ├── ConfigService
        ├── Git identity provider
        ├── LLM availability provider
        └── optional InteractionProvider
```

---

# 19. Recommended Settings Resolver API

A stronger API than one large `resolveOrPrompt()` function would be:

```ts
export interface ResolveSettingsOptions {
  targetRoot?: string;
  allowInteraction?: boolean;
  persistInteractiveValue?: boolean;
  persistSection?: SettingsFileSectionName;
}

export interface SettingsResolution<K extends SettingsKey> {
  key: K;
  value: SettingsValueMap[K];
  source: SettingsResolutionSource;
}

export class SettingsResolver {
  tryResolve<K extends SettingsKey>(
    key: K,
    options?: ResolveSettingsOptions,
  ): Promise<SettingsResolution<K> | null>;

  require<K extends SettingsKey>(
    key: K,
    options?: ResolveSettingsOptions,
  ): Promise<SettingsResolution<K>>;
}
```

`resolveOrPrompt()` could remain as a convenience facade if desired:

```ts
resolveOrPrompt(key, options)
```

but it should delegate to the resolver rather than define the entire architectural concept.

---

# 20. Provider Resolution

LLM selection is another natural resolver.

A provider resolver may consider:

```text
explicit --provider
    ↓
project-local default
    ↓
project-shared default
    ↓
tool default
    ↓
configured fallback provider
    ↓
first available provider
    ↓
none
```

Availability should be obtained from `llmService`.

The resolver decides **which provider should be used**.

`llmService` remains responsible for:

- checking provider availability;
- invoking the provider;
- handling provider API mechanics.

---

# 21. Repository Resolution

Many Git commands may operate against:

- the project root;
- the current submodule;
- every registered repository;
- a named layer;
- a selected set of repositories.

This merits a repository resolver.

Example:

```ts
repositoryResolver.resolveScope({
  targetRoot,
  cwd,
  requestedScope,
  repositoryName,
});
```

Possible output:

```ts
{
  scope: 'selected',
  repositories: [...]
}
```

The Git orchestrator then operates on those repositories.

---

# 22. Layer Resolution

Nuxt commands will frequently need to resolve a layer.

Potential sources include:

```text
explicit layer name
    ↓
current working directory
    ↓
registered layer metadata
    ↓
interactive selection
```

A `LayerResolver` should return a canonical object:

```ts
interface ResolvedLayer {
  name: string;
  path: string;
  packageName?: string;
  repository?: string;
}
```

Commands and orchestrators should not each independently rediscover layer paths.

---

# 23. Package Manager Resolution

Package-manager detection already appears in command-level logic.

This is a strong resolver candidate.

Possible precedence:

```text
explicit package-manager option
    ↓
configured preference
    ↓
packageManager field in package.json
    ↓
lockfile detection
    ↓
safe fallback
```

Result:

```ts
type PackageManager = 'pnpm' | 'npm' | 'yarn' | 'bun';
```

The resolver decides which package manager applies.

`processService` then executes it.

This eliminates duplicated `detectPM` logic across commands.

---

# 24. Template Resolution

As templates become configurable, commands may need to determine:

```text
Which template should be used?
```

Potential sources:

```text
explicit template ID
    ↓
project template override
    ↓
tool template registry
    ↓
built-in template
```

A template resolver should return a canonical template descriptor.

It should not render the template itself.

---

# 25. Licence Resolution

A licence workflow may require determining:

```text
explicit licence selection
    ↓
project setting
    ↓
tool default
    ↓
licence registry match
    ↓
interactive selection
```

The resolver returns the selected licence model.

The licence service or template engine performs generation.

---

# 26. Environment Resolution

Environment-related commands may need to resolve:

- environment name;
- env-file path;
- variable source;
- secret/non-secret scope;
- local versus project-shared configuration.

An environment resolver can centralize this policy instead of embedding it in `manageEnv` or setup commands.

---

# 27. File Resolution

Commands such as:

```text
Document File
Validate Header
Repair Header
```

may need to resolve a target file.

Possible inputs include:

```text
explicit path
    ↓
current working directory context
    ↓
repository-relative path
    ↓
interactive file selection
```

A file resolver should normalize:

- absolute path;
- project-relative path;
- supported file type;
- existence;
- scope membership.

It should not read or modify file contents.

---

# 28. Scope Resolution

Several AppManager operations conceptually work at multiple scopes:

```text
file
layer
project
all layers
repository
all repositories
```

Rather than letting every command invent its own flags and semantics, a `ScopeResolver` may eventually normalize requested scope into a typed object.

Example:

```ts
type ProjectScope =
  | { kind: 'project' }
  | { kind: 'layer'; layer: ResolvedLayer }
  | { kind: 'all-layers'; layers: ResolvedLayer[] };
```

This would be particularly useful across:

- documentation;
- quality;
- Git;
- header validation;
- versioning.

---

# 29. Resolver Composition

Resolvers may call other resolvers when one decision depends on another.

Example:

```text
RepositoryResolver
    │
    └── LayerResolver
            │
            └── SettingsResolver
```

However, composition should remain shallow and purposeful.

A resolver should not evolve into an orchestrator by executing a long sequence of side-effecting operations.

---

# 30. Side Effects

Resolvers should minimize side effects.

Acceptable side effects may include:

- querying Git state;
- checking provider availability;
- reading already-loaded configuration;
- optionally persisting a user-approved resolved value.

Resolvers should generally not:

- create files;
- delete files;
- create Git repositories;
- run builds;
- perform commits;
- push remotes;
- generate documentation.

Those are execution concerns.

---

# 31. Caching

Resolver outputs may be cached only where the underlying source is stable for the required duration.

Examples:

Safe for short-lived caching:

```text
LLM provider availability during one selection flow
registered template catalogue
```

Potentially unsafe:

```text
current Git branch
filesystem existence
environment variables changed during execution
```

Caching policy should therefore remain resolver-specific.

---

# 32. Context Objects

Resolvers should accept explicit context rather than reaching broadly into process-global state.

Prefer:

```ts
interface ResolutionContext {
  toolRoot: string;
  targetRoot: string;
  cwd: string;
  mode: 'interactive' | 'headless';
}
```

over repeatedly reading:

```ts
process.cwd()
process.argv
process.stdin.isTTY
```

inside resolver implementations.

This improves testability and makes the same resolver usable from future non-CLI interfaces.

---

# 33. Dependency Injection

Resolvers benefit substantially from dependency injection because their purpose is largely policy over external facts.

Example:

```ts
export class SettingsResolver {
  constructor(
    private readonly config: ConfigService,
    private readonly gitIdentity: GitIdentityProvider,
    private readonly interaction?: ResolutionInteraction,
  ) {}
}
```

Production may still export a singleton instance.

Tests can provide deterministic substitutes.

---

# 34. Testing

Resolver tests should focus on the resolution matrix.

For every resolver, test:

- each candidate source independently;
- precedence when several candidates exist;
- invalid higher-priority candidate fallback;
- missing values;
- safe built-in defaults;
- headless failure;
- interactive completion;
- cancellation;
- persistence policy;
- source reporting;
- contextual fallback;
- ambiguous selection.

For settings specifically:

```text
project-local wins over project-shared
project-shared wins over tool
tool wins over detected fallback
detected fallback wins over prompt
safe default wins over prompt
headless unresolved throws
interactive unresolved prompts
cancel does not persist
```

---

# 35. Resolution Matrices

Resolvers should be documented using explicit matrices wherever precedence is non-trivial.

Example:

| Priority | Source | `author.name` | `github.defaultBranch` |
|---|---|---:|---:|
| 1 | explicit command argument | if supplied | if supplied |
| 2 | project-local | yes | yes |
| 3 | project-shared | yes | yes |
| 4 | tool settings | yes | yes |
| 5 | detected context | Git identity | none |
| 6 | built-in default | none | `main` |
| 7 | interactive input | yes | unnecessary |
| 8 | unresolved | error | never expected |

This makes resolver behaviour auditable.

---

# 36. Resolution Provenance

For debugging and configuration visibility, AppManager should retain provenance.

Instead of returning merely:

```ts
'main'
```

return:

```ts
{
  value: 'main',
  source: 'built-in'
}
```

This is especially valuable for settings commands, where users need to understand why a value is active.

It also helps diagnose unexpected project-local overrides.

---

# 37. Explainability

More advanced resolvers may expose an explanation trace.

Example:

```ts
{
  value: 'openai',
  source: 'fallback-provider',
  checked: [
    { source: 'explicit', outcome: 'missing' },
    { source: 'project-local', outcome: 'missing' },
    { source: 'tool', outcome: 'unavailable' },
    { source: 'fallback-provider', outcome: 'selected' }
  ]
}
```

This should not be required for every simple resolver, but the architecture should not prevent it.

---

# 38. Security

Resolvers must avoid leaking sensitive candidate values through logs or error messages.

Particularly:

- environment variables;
- API keys;
- tokens;
- private repository credentials.

A resolver may report:

```text
credential source: environment
```

without exposing the credential.

---

# 39. Recommended Directory Structure

As the layer grows:

```text
app/
└── resolvers/
    ├── settings/
    │   └── settingsResolver.ts
    ├── llm/
    │   └── providerResolver.ts
    ├── git/
    │   ├── repositoryResolver.ts
    │   └── branchResolver.ts
    ├── nuxt/
    │   └── layerResolver.ts
    ├── app/
    │   └── packageManagerResolver.ts
    ├── templates/
    │   └── templateResolver.ts
    └── shared/
        └── resolutionTypes.ts
```

A flat directory is acceptable while only one or two resolvers exist.

Subdirectories become useful once domain-specific resolver families appear.

---

# 40. Naming Convention

Preferred:

```text
SettingsResolver
ProviderResolver
RepositoryResolver
LayerResolver
PackageManagerResolver
TemplateResolver
ScopeResolver
```

Method names should describe the strength of the contract.

Examples:

```text
tryResolve()
resolve()
require()
resolveAll()
```

Useful semantics:

```text
tryResolve → may return no result
resolve    → returns the best available result according to policy
require    → must return a result or throw
```

Avoid ambiguous helpers such as:

```text
getThing()
findThing()
handleThing()
```

when resolution semantics are important.

---

# 41. `resolveOrPrompt` Reassessment

The existing planned function:

```ts
resolveOrPrompt(...)
```

is useful, but it represents a **specific settings-resolution interaction workflow**, not the complete architectural definition of resolvers.

Its responsibilities currently include:

```text
persisted settings lookup
built-in defaults
Git identity fallback
headless behaviour
prompt construction
LLM availability lookup
user interaction
persistence
```

That is workable for an initial implementation but comparatively broad.

A more maintainable decomposition is:

```text
SettingsResolver
    │
    ├── ConfigService
    ├── GitIdentityResolver/provider
    └── built-in defaults
            │
            ▼
      ResolutionResult
            │
            ▼
ResolutionInteraction
    │
    └── prompt only if required
            │
            ▼
optional ConfigService persistence
```

`resolveOrPrompt()` may remain as a facade over these pieces.

---

# 42. Relationship to Commands

Commands should use resolvers to normalize user input before starting significant execution.

For example:

```text
CreateLayerCommand
        │
        ├── LayerNameResolver
        ├── SettingsResolver
        └── RepositoryVisibilityResolver
                 │
                 ▼
          CreateLayerRequest
                 │
                 ▼
       CreateLayerOrchestrator
```

The orchestrator therefore receives a well-defined request rather than a bag of partially missing CLI options.

---

# 43. Relationship to Orchestrators

Resolvers and orchestrators complement each other.

A resolver answers:

> What should be used?

An orchestrator answers:

> What should happen, and in what order?

Example:

```text
PackageManagerResolver
        │
        └── pnpm
              │
              ▼
AppSetupOrchestrator
        │
        └── ProcessService.run('pnpm install')
```

The resolver does not execute `pnpm`.

The orchestrator does not independently re-detect the package manager.

---

# 44. Relationship to Services

Services expose capabilities and observed state.

Resolver example:

```text
BranchResolver
    │
    ├── ConfigService → configured default branch
    └── GitHubService → current repository branch
```

It evaluates those candidates.

The underlying services remain unaware of precedence policy.

---

# 45. Relationship to Modes

`interactiveMode.ts` and `headlessMode.ts` determine the execution environment.

Resolvers should receive that mode explicitly when it affects behaviour.

Prefer:

```ts
resolver.require(key, {
  mode: 'headless'
})
```

rather than:

```ts
if (process.stdin.isTTY)
```

inside the resolver.

This prevents environment detection from being duplicated or misinterpreted.

---

# 46. Recommended Shared Resolution Types

A small shared type module would be useful:

```ts
export type ExecutionMode =
  | 'interactive'
  | 'headless';

export type ResolutionSource =
  | 'explicit'
  | 'project-local'
  | 'project-shared'
  | 'tool'
  | 'environment'
  | 'detected'
  | 'built-in'
  | 'interactive';

export interface Resolution<T> {
  value: T;
  source: ResolutionSource;
}

export type ResolutionFailureCode =
  | 'missing'
  | 'invalid'
  | 'ambiguous'
  | 'unavailable'
  | 'cancelled'
  | 'interaction-required';
```

Resolver-specific contracts can extend these.

---

# 47. Recommended Initial Resolver Set

The first resolver implementation should remain:

```text
SettingsResolver
```

because many planned commands depend on persisted configuration.

The next highest-value candidates are:

```text
PackageManagerResolver
ProviderResolver
RepositoryResolver
LayerResolver
ScopeResolver
```

These address policy currently duplicated or likely to be duplicated across multiple command domains.

---

# 48. Migration Strategy

The resolver architecture can be introduced incrementally.

## Phase 1

Implement the existing settings resolution requirements.

```text
SettingsResolver
ConfigService settings extension
```

## Phase 2

Extract duplicated candidate-selection logic from commands.

Likely first target:

```text
package-manager detection
```

## Phase 3

Introduce domain resolvers as orchestrated workflows are implemented.

Examples:

```text
LayerResolver
RepositoryResolver
ScopeResolver
ProviderResolver
```

No large-scale rewrite is required.

---

# 49. Architectural Boundary Rule

The simplest classification test is:

> **Is this component determining which value/resource/configuration should be used, or is it performing work with that value?**

If it determines:

```text
which branch
which layer
which provider
which repository
which setting
which template
which package manager
```

it is probably a resolver.

If it:

```text
pushes the branch
creates the layer
calls the provider
modifies the repository
writes the setting
renders the template
runs the package manager
```

it belongs elsewhere.

---

# 50. Architectural Principle

Within AppManager, a resolver should be understood as:

> **A deterministic policy component that converts incomplete, layered, inferred, or ambiguous application input into a validated canonical value or resource, while preserving provenance and applying consistent precedence, fallback, and execution-mode rules.**

Its purpose is not merely to retrieve configuration.

Its purpose is to ensure that every part of AppManager reaches the **same decision from the same context**, without duplicating decision logic across commands and workflows.