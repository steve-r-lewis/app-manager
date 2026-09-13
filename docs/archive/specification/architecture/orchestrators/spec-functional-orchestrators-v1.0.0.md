# AppManager Orchestrators — Architectural Purpose and Functional Specification

## 1. Purpose

An **Orchestrator** in AppManager is an application-layer component responsible for coordinating a complete **multi-step domain operation or workflow** across lower-level architectural components.

An orchestrator does not normally implement the primitive operation itself. Instead, it determines:

- what operations must occur;
- in what order they must occur;
- which services, strategies, templates, resolvers, scanners, or subordinate orchestrators must perform them;
- what contextual state must pass between those operations;
- what preconditions and postconditions apply;
- how partial failure is handled;
- whether execution may continue after a non-fatal failure;
- how rollback or compensation should occur where appropriate;
- and what structured result represents the outcome of the complete workflow.

In architectural terms:

**Commands express intent.  
Orchestrators execute workflows.  
Services perform capabilities.  
Resolvers determine configuration or missing input.  
Strategies understand and modify existing code.  
Scanners tokenize source languages.  
Templates create new content.**

An orchestrator is therefore the application's **workflow composition layer**.

---

# 2. Position Within the Architecture

The intended runtime dependency direction should be:

```text
User / CI
    │
    ▼
Interactive Mode / Headless Mode
    │
    ▼
Command
    │
    ▼
Orchestrator
    │
    ├──► Resolver
    │
    ├──► Service
    │
    ├──► CodeService
    │       │
    │       └──► Strategy
    │               │
    │               └──► Scanner
    │
    ├──► Template
    │
    └──► subordinate Orchestrator
```

The command layer should remain comparatively thin.

A command should be concerned primarily with:

1. receiving the requested operation;
2. translating CLI/TUI arguments into a typed request;
3. invoking the appropriate orchestrator;
4. presenting the resulting status to the user;
5. mapping workflow failure to the appropriate process exit behaviour.

The command should not itself become the place where a ten-step application workflow is implemented.

---

# 3. Architectural Definition

An AppManager component should be classified as an **orchestrator** when the following are substantially true:

1. The operation represents a meaningful application or domain workflow rather than a single technical capability.
2. Completion requires multiple lower-level operations.
3. Those operations have sequencing or dependency relationships.
4. State produced by one step affects subsequent steps.
5. Multiple architectural components or services are coordinated.
6. The workflow has an overall success/failure/result contract independent of individual service calls.

For example:

```text
Create Nuxt Layer
```

is an orchestration problem because it could require:

```text
resolve requested configuration
        ↓
validate target
        ↓
create directory structure
        ↓
render templates
        ↓
write files
        ↓
initialise Git repository
        ↓
create remote repository
        ↓
register submodule
        ↓
update workspace configuration
        ↓
install dependencies
        ↓
validate generated project
        ↓
return workflow result
```

No single service should own that entire operation.

---

# 4. What an Orchestrator Is Not

An orchestrator must not become a generic location for miscellaneous business logic.

## 4.1 Not a Service

A **service** encapsulates a reusable technical capability.

Examples include:

- reading and writing files;
- executing processes;
- interacting with Git;
- interacting with GitHub;
- invoking an LLM;
- logging;
- reading configuration.

A service answers questions such as:

```text
Can you create this directory?
Can you execute this process?
Can you create this Git commit?
Can you create this repository?
Can you read this file?
```

An orchestrator answers:

```text
What combination of those capabilities is required to complete this domain operation?
```

A `GitHubService` may create a repository.

A `NuxtLayerOrchestrator` may decide that creating a repository is step 7 of creating a new Nuxt layer.

---

## 4.2 Not a Strategy

A **strategy** provides file-format-specific behaviour behind a common interface.

Current examples include:

- `TypescriptStrategy`
- `JavascriptStrategy`
- `CssStrategy`
- `HtmlStrategy`
- `JsonStrategy`

The existing strategy registry resolves a strategy from a file extension and exposes a common code-intelligence contract.

A strategy answers:

```text
How do I inspect or modify this particular kind of file?
```

An orchestrator answers:

```text
What application workflow needs to happen across potentially many files and systems?
```

---

## 4.3 Not a Scanner

A **scanner** performs lexical analysis.

Its job is to turn source text into structured lexical information such as tokens, positions, comments, operators, literals, and regions.

A scanner should not:

- create repositories;
- prompt users;
- modify global settings;
- install dependencies;
- coordinate workflows;
- determine application-level execution order.

---

## 4.4 Not a Template

A **template** is a content generator.

For example:

```text
NuxtLayerOrchestrator
        │
        ├── packageJsonTemplate()
        ├── nuxtConfigTemplate()
        ├── tsconfigTemplate()
        └── gitignoreTemplate()
```

The templates know how to render files.

The orchestrator decides:

- which files are required;
- where they are written;
- which parameters are passed;
- which are optional;
- whether existing files may be overwritten;
- and what happens after generation.

---

## 4.5 Not a Resolver

A **resolver** determines an effective value or configuration from one or more sources.

Typical resolution precedence may be:

```text
explicit command argument
        ↓
project configuration
        ↓
tool configuration
        ↓
environment
        ↓
interactive prompt
        ↓
default
```

The resolver determines **what value should be used**.

The orchestrator determines **what happens using that value**.

---

## 4.6 Not a Command

Commands constitute the application's public action surface.

A command should not duplicate a workflow merely because the workflow can be invoked interactively and headlessly.

For example, both:

```text
am nuxt create-layer
```

and an interactive menu option:

```text
Nuxt
 └── Create Layer
```

should ultimately call the same orchestrator.

This guarantees behavioural parity between interactive and CI/CD execution.

---

# 5. Existing `VueStrategy` and the Meaning of “Orchestrator”

The repository currently contains:

```text
app/orchestrators/vue/vueOrchestrator.ts
```

but that file exports:

```text
VueStrategy
```

and implements:

```text
ICodeStrategy
```

Its behaviour is:

```text
.vue source
    │
    ▼
extract <script> region
    │
    ▼
delegate to TypescriptStrategy
    │
    ▼
adjust source offsets
    │
    ▼
splice modified region back into .vue source
```

That is legitimate **composition**, but it belongs to the code-strategy abstraction.

It should therefore be described as a:

> **Composite Strategy**

rather than an application workflow orchestrator.

The recommended architectural home is consequently:

```text
app/
└── strategies/
    └── vue/
        └── vueStrategy.ts
```

rather than:

```text
app/
└── orchestrators/
    └── vue/
        └── vueOrchestrator.ts
```

This preserves the useful design while making architectural terminology precise.

---

# 6. Two Different Forms of Composition

The distinction is important because AppManager contains two fundamentally different forms of composition.

## 6.1 Code Composition

Example:

```text
VueStrategy
    │
    ├── extracts Vue SFC script region
    └── delegates syntax-specific work to TypescriptStrategy
```

This is **strategy composition**.

It answers:

> How should this composite source format be interpreted?

---

## 6.2 Workflow Composition

Example:

```text
NuxtLayerOrchestrator
    │
    ├── SettingsResolver
    ├── FileService
    ├── GitHubService
    ├── ProcessService
    ├── packageJsonTemplate
    ├── nuxtConfigTemplate
    └── QualityOrchestrator
```

This is **application orchestration**.

It answers:

> How do all necessary application capabilities cooperate to complete this user-requested operation?

These concepts should not share the same architectural category.

---

# 7. Core Responsibilities of an Orchestrator

Every orchestrator may perform some or all of the following functions.

## 7.1 Workflow Sequencing

The orchestrator defines the ordering of operations.

For example:

```text
validate
  ↓
resolve
  ↓
prepare
  ↓
execute
  ↓
verify
  ↓
finalise
```

The sequence itself is business/application knowledge and therefore belongs to the orchestrator.

---

## 7.2 Dependency Coordination

An orchestrator coordinates several abstractions without assuming their internal implementations.

For example:

```ts
settingsResolver.resolve(...)
fileService.exists(...)
fileService.write(...)
githubService.createRepository(...)
processService.run(...)
```

The orchestrator should consume their public contracts rather than reproducing their internals.

---

## 7.3 Context Propagation

Complex workflows frequently discover information as they execute.

For example:

```text
resolved project name
        ↓
filesystem path
        ↓
package name
        ↓
Git repository name
        ↓
remote URL
        ↓
submodule entry
```

The orchestrator owns the workflow context carrying these values between steps.

A useful model is:

```ts
interface CreateLayerContext {
  targetRoot: string;
  layerName: string;
  layerPath: string;
  packageName: string;
  repositoryName?: string;
  repositoryUrl?: string;
}
```

---

# 8. Preconditions

An orchestrator should explicitly validate conditions that must hold before mutating state.

Examples include:

- target project exists;
- target directory does not already exist;
- package manager is available;
- project is a valid Git repository;
- required configuration has resolved;
- remote credentials are available;
- requested layer name is valid;
- destructive operations have been authorised.

Precondition checking should happen as early as practical.

A workflow should not create four files and only then discover that its fifth mandatory requirement cannot be satisfied.

---

# 9. Postconditions

Successful orchestration should guarantee a defined final state.

For a create-layer workflow, a postcondition may state that:

- the layer directory exists;
- mandatory files exist;
- generated configuration validates;
- workspace registration exists;
- Git state is valid;
- optional repository integration succeeded where requested.

The orchestration result should represent those guarantees explicitly.

---

# 10. Workflow Results

Orchestrators should return structured values rather than relying exclusively on logs.

For example:

```ts
interface OrchestrationResult<T> {
  success: boolean;
  data?: T;
  warnings: OrchestrationWarning[];
  completedSteps: string[];
}
```

A more rigorous implementation may use:

```ts
type OrchestrationResult<T> =
  | {
      ok: true;
      value: T;
      warnings: OrchestrationWarning[];
    }
  | {
      ok: false;
      error: OrchestrationError;
      completedSteps: string[];
    };
```

This makes the same workflow usable by:

- the interactive TUI;
- headless CLI execution;
- automated tests;
- CI/CD;
- future API interfaces;
- future GUI interfaces.

---

# 11. Error Responsibility

Errors should be handled at the layer that has enough context to make a meaningful decision.

A service can report:

```text
git push failed
```

but only the orchestrator knows whether that means:

```text
abort immediately
```

or:

```text
record failure for this repository and continue with the remaining repositories
```

or:

```text
retry
```

or:

```text
perform a compensation operation
```

Therefore:

- **services detect capability failures;**
- **orchestrators interpret workflow consequences;**
- **commands determine user/process presentation.**

---

# 12. Fail-Fast Versus Continue-on-Error

The orchestrator defines whether a step is:

### Mandatory

Failure prevents the workflow from remaining valid.

Example:

```text
write mandatory package.json
```

Failure should terminate creation.

### Optional

Failure reduces functionality but does not invalidate the primary outcome.

Example:

```text
create optional remote GitHub repository
```

Depending on the command contract, local layer creation may still be successful.

### Best-effort

The orchestrator may attempt all targets and report aggregate success.

Example:

```text
push project to multiple configured remotes
```

A failure for `backup` need not necessarily prevent a push to `origin`.

This policy belongs to orchestration rather than to the underlying service.

---

# 13. Rollback and Compensation

Not every workflow needs transactional semantics, but workflows that mutate several independent systems should define their failure behaviour.

Suppose layer creation performs:

```text
1. create directory
2. write files
3. initialise repository
4. create GitHub repository
5. add root submodule
```

If step 5 fails, the application must know whether to:

- retain everything already created;
- delete the remote repository;
- remove the local directory;
- leave the state intact but report manual remediation;
- or offer explicit cleanup.

Traditional database rollback may be impossible because several external systems are involved.

The appropriate model is often **compensating actions**.

For example:

```text
create remote repository
        │
        └── compensation → delete remote repository

create local directory
        │
        └── compensation → remove generated directory
```

Compensation should be owned by the orchestrator because only it understands the workflow-wide state.

---

# 14. Idempotency

Where practical, orchestrators should be designed so repeated execution is predictable.

A rerun should distinguish between:

```text
resource does not exist → create it
resource already correct → leave it unchanged
resource exists but differs → resolve according to policy
```

This is particularly important for:

- project setup;
- configuration repair;
- documentation generation;
- Git synchronisation;
- environment setup;
- CI/CD execution.

An orchestrator should not blindly reproduce side effects simply because its command was invoked twice.

---

# 15. Interactive Versus Headless Execution

Orchestrators should normally remain independent of the UI mode.

The same workflow should be callable from:

```text
interactiveMode
```

and:

```text
headlessMode
```

without duplicating core logic.

The distinction belongs primarily in **resolution**.

Example:

```text
CreateLayerCommand
        │
        ▼
resolver.resolveLayerName()
        │
        ├── command argument
        ├── configuration
        ├── prompt, if interactive
        └── error, if headless and unresolved
        │
        ▼
NuxtLayerOrchestrator.create(...)
```

Once resolution is complete, the orchestrator receives a complete typed request.

This makes orchestration deterministic and straightforward to test.

---

# 16. Orchestrators Should Generally Not Prompt

Direct prompting inside orchestrators should be avoided.

Doing so would bind application workflows to the interactive TUI and undermine headless execution.

Preferred design:

```text
Command / Resolver
        │
        └── obtains all required decisions
                  │
                  ▼
             Orchestrator
```

The orchestrator may identify that additional information is required, but resolution should preferably occur through a resolver abstraction rather than directly importing `@clack/prompts`.

---

# 17. Orchestrators Should Generally Not Perform Raw I/O

The orchestrator should not normally contain:

```ts
fs.writeFile(...)
exec(...)
fetch(...)
simpleGit(...)
```

Those belong behind services.

Prefer:

```ts
fileService.write(...)
processService.run(...)
githubService.push(...)
```

This keeps orchestration concerned with **policy and sequencing**, not implementation mechanics.

---

# 18. Orchestrators and `CodeService`

`codeService` is currently described as the central coordinator for code intelligence.

It performs high-level operations such as:

```text
inspect(filePath)
updateHeader(filePath, header)
generateDocFor(filePath, functionName)
```

and resolves the appropriate strategy internally.

This should remain distinct from application orchestration.

For example:

```text
AutoDocumentationOrchestrator
        │
        ├── discover files
        │
        ├── for each supported file:
        │       └── codeService.inspect()
        │
        ├── determine missing documentation
        │
        ├── codeService.generateDocFor()
        │
        └── produce project-wide report
```

`codeService` understands how to manipulate one supported source file.

The orchestrator understands how to perform a project-wide documentation workflow.

---

# 19. Orchestrators and Strategies

The preferred boundary is:

```text
Orchestrator
    │
    ▼
CodeService
    │
    ▼
Strategy Registry
    │
    ▼
ICodeStrategy
```

Application orchestrators generally should not need to know whether a file uses:

```text
TypescriptStrategy
VueStrategy
JsonStrategy
CssStrategy
HtmlStrategy
```

That decision belongs to the code-intelligence layer.

This maintains the Open/Closed Principle: supporting a new language or composite source format should not require changing every orchestrator using code intelligence.

---

# 20. Recommended Orchestrator Categories

As AppManager develops, the orchestrator layer can be organised by domain.

A possible structure is:

```text
app/
└── orchestrators/
    ├── app/
    │   ├── appSetupOrchestrator.ts
    │   └── appLifecycleOrchestrator.ts
    │
    ├── docs/
    │   └── documentationOrchestrator.ts
    │
    ├── git/
    │   ├── repositorySyncOrchestrator.ts
    │   ├── projectSyncOrchestrator.ts
    │   └── multiRemotePushOrchestrator.ts
    │
    ├── nuxt/
    │   ├── createProjectOrchestrator.ts
    │   ├── createLayerOrchestrator.ts
    │   └── nuxtConfigOrchestrator.ts
    │
    ├── quality/
    │   └── qualityOrchestrator.ts
    │
    ├── settings/
    │   └── settingsOrchestrator.ts
    │
    └── utils/
        ├── autoDocumentationOrchestrator.ts
        ├── autoVersionOrchestrator.ts
        └── headerMaintenanceOrchestrator.ts
```

Not every command requires an orchestrator.

A command that performs exactly one simple service call does not need an artificial orchestration layer.

Orchestrators should be introduced where genuine workflow composition exists.

---

# 21. Nuxt Domain Orchestration

The Nuxt domain is likely to make the heaviest use of orchestration because creating and maintaining a Nuxt layer-based monorepo crosses several subsystem boundaries.

## 21.1 Create Project

A future `CreateProjectOrchestrator` might coordinate:

```text
resolve project settings
      ↓
validate destination
      ↓
create project structure
      ↓
render project templates
      ↓
write generated files
      ↓
initialise package manager
      ↓
initialise Git
      ↓
create remote repository
      ↓
configure AppManager metadata
      ↓
run Nuxt post-install preparation
      ↓
run validation
```

---

## 21.2 Create Layer

A future `CreateLayerOrchestrator` could coordinate:

```text
NuxtCreateLayerRequest
          │
          ▼
validate name and target
          │
          ▼
resolve defaults
          │
          ▼
create layer directory
          │
          ▼
render layer templates
          │
          ▼
write files
          │
          ▼
create/initialise Git repository
          │
          ▼
optionally provision remote
          │
          ▼
register layer as submodule
          │
          ▼
update workspace configuration
          │
          ▼
validate layer
          │
          ▼
CreateLayerResult
```

This is precisely the type of operation that should not be implemented directly inside `createLayer.ts`.

---

# 22. Git Domain Orchestration

Git operations also divide naturally into primitive services and workflows.

A service operation may be:

```text
pull repository
```

An orchestration may be:

```text
Synchronise Project
    │
    ├── inspect root repository
    ├── pull root repository
    ├── determine registered layers
    ├── initialise missing submodules
    ├── synchronise selected layers
    ├── detect drift
    └── produce aggregate result
```

Likewise, multi-remote push is orchestration because the application must determine aggregate success policy across several independent remote operations.

---

# 23. Documentation Orchestration

The planned documentation functionality is a natural consumer of several architectural layers.

Example:

```text
DocumentationOrchestrator
        │
        ├── FileService
        │      └── discover supported files
        │
        ├── CodeService
        │      └── inspect source
        │
        ├── LlmService
        │      └── generate documentation where required
        │
        ├── Template functions
        │      └── generate report/document shells
        │
        └── FileService
               └── write resulting documentation
```

The orchestrator controls project-wide scope, ordering, filtering, error policy, and reporting.

---

# 24. Quality Orchestration

A quality workflow may combine several checks:

```text
typecheck
   ↓
lint
   ↓
unit tests
   ↓
integration tests
   ↓
coverage
   ↓
build verification
```

Whether all checks should always run or execution should terminate on first failure is workflow policy.

`processService` should execute each process.

`QualityOrchestrator` should determine what constitutes overall quality success.

---

# 25. Application Setup Orchestration

The proposed setup workflow is also a clear orchestration candidate.

For example:

```text
AppSetupOrchestrator
        │
        ├── inspect environment
        ├── initialise .env
        ├── install dependencies
        ├── synchronise Git/submodules
        ├── initialise editor configuration
        ├── initialise AppManager configuration
        └── validate completed setup
```

The current command specifications already describe this as a multi-stage workflow. Moving coordination into an orchestrator would allow the same setup logic to be invoked from TUI, headless CLI, tests, or a future GUI.

---

# 26. Orchestrator Composition

An orchestrator may call another orchestrator when a domain workflow contains a meaningful subordinate workflow.

Example:

```text
CreateProjectOrchestrator
        │
        ├── CreateLayerOrchestrator
        ├── RepositorySetupOrchestrator
        └── QualityOrchestrator
```

This should not become arbitrary nesting.

A subordinate orchestrator should represent a reusable workflow with its own independent contract.

---

# 27. State Ownership

Orchestrators may maintain transient workflow state for the duration of one operation.

They should generally not become long-lived global state stores.

Persistent configuration belongs to:

```text
ConfigService / settings storage
```

Persistent filesystem state belongs to:

```text
FileService
```

Persistent remote state belongs to the appropriate external service abstraction.

The orchestrator owns only the **execution context** needed to coordinate those systems.

---

# 28. Dependency Injection

The current repository relies heavily on module-level singleton imports.

For simple services this is workable, but orchestrators will become significantly easier to test if their dependencies are injectable.

Preferred pattern:

```ts
export class CreateLayerOrchestrator {
  constructor(
    private readonly files: FileService,
    private readonly github: GitHubService,
    private readonly processes: ProcessService,
    private readonly settings: SettingsResolver,
  ) {}
}
```

The production application may still instantiate a singleton:

```ts
export const createLayerOrchestrator =
  new CreateLayerOrchestrator(
    fileService,
    githubService,
    processService,
    settingsResolver,
  );
```

This preserves convenience while allowing isolated unit testing.

---

# 29. Testing

Orchestrator tests should focus primarily on **workflow semantics**, not the internal correctness of dependencies.

Given mocked services, tests should verify:

- correct execution order;
- correct parameters passed between steps;
- mandatory-step failure aborts;
- optional-step failure behaviour;
- compensation behaviour;
- handling of partially completed workflows;
- propagation of resolved configuration;
- aggregate result construction;
- idempotent behaviour where promised;
- no unintended operations occur after terminal failure.

Service tests should separately validate actual Git, filesystem, process, or API behaviour.

This separation prevents orchestration tests from becoming slow end-to-end tests.

---

# 30. Observability

All substantial workflows should expose enough information to diagnose execution.

Useful concepts include:

```ts
interface OrchestrationStepResult {
  step: string;
  status: 'completed' | 'skipped' | 'failed';
  durationMs?: number;
  message?: string;
}
```

The orchestrator may emit lifecycle events or structured logging such as:

```text
orchestration.started
orchestration.step.started
orchestration.step.completed
orchestration.step.failed
orchestration.compensation.started
orchestration.completed
```

This will become particularly useful for headless CI/CD execution.

---

# 31. Cancellation

Interactive operations may eventually support cancellation.

Cancellation should be propagated through workflow boundaries rather than implemented independently by every service.

The orchestrator is the appropriate component to determine whether cancellation:

- stops before the next step;
- terminates a running subprocess;
- invokes compensation;
- leaves partial state;
- or returns a cancelled workflow result.

---

# 32. Dry-Run Support

Many AppManager workflows would benefit from an orchestration-level dry-run mode.

For example:

```text
am nuxt create-layer auth --dry-run
```

could report:

```text
would create layers/auth/
would write package.json
would write nuxt.config.ts
would initialise git repository
would create GitHub repository
would register submodule
```

A dry run concerns the **workflow as a whole**, so its primary semantics belong to the orchestrator even though individual services may provide dry-run primitives.

---

# 33. Planning Versus Execution

As workflow complexity grows, some orchestrators may benefit from separating:

```text
plan()
```

from:

```text
execute()
```

Example:

```ts
const plan = await orchestrator.plan(request);
const result = await orchestrator.execute(plan);
```

The plan could contain:

```ts
interface OrchestrationPlan {
  steps: PlannedStep[];
  warnings: string[];
  destructiveActions: PlannedAction[];
}
```

This would support:

- interactive previews;
- dry runs;
- CI validation;
- confirmation of destructive actions;
- reproducible execution.

This is not mandatory for simple workflows but is a useful architectural extension point.

---

# 34. Security Boundary

Orchestrators should not directly handle secrets beyond passing already-resolved credentials or references to appropriate services.

Secrets should remain inside dedicated configuration or integration services wherever practical.

This allows an orchestrator to express:

```text
create repository using configured GitHub identity
```

without knowing the underlying token.

The same principle will become increasingly important if AppManager later controls deployment infrastructure, Cloudflare, remote systems, or other external environments.

---

# 35. Naming Convention

Recommended convention:

```text
<domain><operation>Orchestrator.ts
```

or, where directory scope already establishes the domain:

```text
app/orchestrators/nuxt/createLayerOrchestrator.ts
```

with exported class:

```ts
CreateLayerOrchestrator
```

Prefer names that identify a **workflow**, not a technology.

Good:

```text
CreateLayerOrchestrator
ProjectSyncOrchestrator
DocumentationOrchestrator
HeaderMaintenanceOrchestrator
```

Less useful:

```text
NuxtOrchestrator
GitOrchestrator
MainOrchestrator
GeneralOrchestrator
```

Broad “god orchestrators” should be avoided.

---

# 36. Recommended Base Contract

A universal abstract base class is not mandatory.

Orchestrators may have strongly typed domain-specific APIs such as:

```ts
create(request: CreateLayerRequest): Promise<CreateLayerResult>
```

or:

```ts
sync(request: ProjectSyncRequest): Promise<ProjectSyncResult>
```

This is generally preferable to forcing every workflow into an artificial:

```ts
execute(options: any)
```

shape.

A lightweight shared result vocabulary may still be useful.

For example:

```ts
export interface OrchestrationWarning {
  code: string;
  message: string;
}

export interface OrchestrationFailure {
  code: string;
  message: string;
  cause?: unknown;
}
```

---

# 37. Boundary Rule

The most useful architectural test is:

> **Does this component know how to perform a capability, or does it know how multiple capabilities must cooperate to achieve an application outcome?**

If it knows **how to perform a capability**, it is probably a service, strategy, scanner, template, or resolver.

If it knows **how several capabilities cooperate to achieve a meaningful application outcome**, it is an orchestrator.

---

# 38. Recommended Architectural Refactor

The repository should eventually make the following distinction explicit.

## 38.1 Composite code strategies

```text
app/strategies/
├── typescript/
├── javascript/
├── css/
├── html/
├── json/
└── vue/
    └── vueStrategy.ts
```

`VueStrategy` remains responsible for Vue SFC composition and may internally delegate to TypeScript, HTML, and CSS strategies/scanners.

---

## 38.2 Application orchestrators

```text
app/orchestrators/
├── app/
├── docs/
├── git/
├── nuxt/
├── quality/
├── settings/
└── utils/
```

These components coordinate domain workflows.

This gives `orchestrators/` a clear architectural purpose rather than making it a special home for one file format.

---

# 39. Relationship to Current Repository State

At present, AppManager has substantial infrastructure but comparatively little command-to-infrastructure wiring.

The existing architecture contains:

```text
Services
Scanners
Strategies
Templates
CodeService
Resolvers (early/incomplete)
Commands
```

but many planned commands remain stubs and the code-intelligence stack has not yet been wired into the command surface.

Introducing true application orchestrators provides the missing layer for that integration.

Instead of:

```text
Command
  └── manually imports six services and contains entire workflow
```

the target architecture should become:

```text
Command
  │
  └── Orchestrator
        ├── Resolver
        ├── Service
        ├── CodeService
        ├── Template
        └── subordinate workflows
```

This creates a clean path from the application's existing primitives to the larger behaviour described by the design specifications.

---

# 40. Architectural Principle

Within AppManager, an orchestrator should be understood as:

> **A domain-aware application component that converts a resolved user intention into a controlled, observable, testable sequence of lower-level operations, coordinating the application's services and specialist components without absorbing their implementation responsibilities.**

Its purpose is not merely to call several functions.

Its purpose is to own the **workflow semantics** that make those calls collectively represent a valid AppManager operation.