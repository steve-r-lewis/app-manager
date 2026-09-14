# IS-23 — Build and Runtime Assembly Implementation Specification

> **Document type:** Level 4 Implementation Specification
>
> **Status:** Version 1 implementation baseline
>
> **Implementation ID:** IS-23
>
> **Primary decision input:** [ADR-0001 — Primary Application Runtime](../project_management/decisions/adr-0001-primary-application-runtime.md)
>
> **Register:** [AppManager Implementation Specification](implementation-specification-v01.md)
>
> **Governing plan:** [Implementation Specification Plan](../project_management/implementation-specification-plan-v01.md)

## 1. Purpose

IS-23 defines the concrete package, build, executable and process-assembly foundation for AppManager Version 1.

Its job is to make the approved Node.js/TypeScript implementation runnable and buildable without deciding the internal module boundaries owned by IS-1 through IS-22.

The governing rule is:

> **Build and runtime assembly may connect approved implementation responsibilities, but it must not acquire their application authority or collapse their boundaries merely because Version 1 runs them in one Node.js process.**

---

## 2. Scope

IS-23 owns the concrete implementation of:

- the Version 1 Node.js and TypeScript runtime baseline;
- package-manager selection and root package metadata relevant to execution and build;
- ECMAScript module execution;
- the production build output contract;
- the installed executable entry point and launcher boundary;
- the composition root that constructs and connects the implementations defined by the other `IS-*` documents;
- root build, type-check and test commands required to verify an assembled application;
- dependency classification at package level;
- process-level startup and shutdown wiring that is infrastructure rather than application semantics;
- assembly-level conformance tests.

IS-23 does **not** own:

- Application Invocation Contract semantics, dispatch or canonical outcomes — IS-1;
- managed-project or configuration resolution — IS-2 and IS-3;
- filesystem/resource semantics — IS-4;
- child-process execution semantics — IS-5;
- capability-provider behaviour — IS-6 through IS-13;
- domain workflow or policy — IS-14 through IS-21;
- TUI, Headless or future host-adapter behaviour — IS-22.

A package dependency being installed at the root does not transfer ownership of that dependency's semantics to IS-23.

---

## 3. Governing Decisions and Constraints

ADR-0001 selects Node.js and TypeScript as the Version 1 primary application implementation technology. It also requires the Application Engine, Application Invocation Contract and capability boundaries to remain semantically distinct even when implemented in one process.

IS-23 therefore fixes the Version 1 deployment shape as a **single primary Node.js application process by default**. No separate capability process, executable, package or deployment unit is required unless another approved Implementation Specification demonstrates a concrete need for one.

The following constraints apply:

1. Application and capability boundaries are represented by explicit TypeScript contracts and dependency direction, not by requiring process separation.
2. Provider-native objects must not be exposed across general AppManager boundaries merely because all code shares one runtime.
3. The executable launcher must remain thin. It may collect process facts, initialize infrastructure and invoke the application boundary; it must not contain domain workflows.
4. Runtime assembly must use explicit dependency construction/registration. Import-time global registration must not be the mechanism by which application semantics are established.
5. Process globals such as `process.argv`, `process.cwd()`, `process.env`, process signals and exit status are read or written at controlled boundaries and translated before entering application semantics.
6. A successful build, provider load or process start is technical evidence only; it is not an AppManager operation outcome.

---

## 4. Runtime and Package Baseline

### 4.1 Runtime

Version 1 shall use:

- Node.js as the primary runtime;
- TypeScript as the primary implementation language;
- ECMAScript modules (`"type": "module"`);
- NodeNext module semantics for compiled TypeScript;
- `pnpm` as the canonical package manager.

The current repository declares Node.js `>=20.0.0`, pnpm `11.5.2`, TypeScript `5.9.x`, `module: NodeNext`, `moduleResolution: NodeNext` and target `ES2022`. These are compatible with ADR-0001 and are retained as the initial Version 1 baseline unless implementation testing demonstrates a concrete incompatibility.

The package shall declare the Node.js minimum supported version. An npm engine requirement is not part of the target package contract because npm is not the canonical package manager.

### 4.2 Package manager

The root `packageManager` field shall identify the exact pnpm release used for reproducible development and CI installation.

The lockfile shall be committed and treated as the authoritative dependency resolution for a given source revision.

Installation and CI shall use the lockfile without silently regenerating dependency versions.

### 4.3 Root package

Version 1 remains a private root package unless a later distribution decision explicitly changes that status.

The root package owns application-level scripts and the installed `app-manager` executable mapping. It must not become a reason to place all implementation responsibilities in one source directory.

---

## 5. Source and Build Layout

### 5.1 Source root

The Version 1 application source root remains:

```text
app/
```

The existing `app/` tree may be reorganized by later Implementation Specifications. IS-23 does not preserve historical folders such as `services/`, `commands/`, `scanners/` or `strategies/` as architectural requirements.

The root-level executable source shall remain separate from the internal application source so the launcher can stay thin.

### 5.2 Build output

Production execution shall use compiled JavaScript, not on-the-fly TypeScript transpilation.

The TypeScript build shall emit to:

```text
dist/
```

with source-relative structure sufficient to provide a compiled launcher and compiled application modules.

The supported production executable shall resolve to compiled JavaScript under `dist/`. The package `bin` field must therefore point to the compiled launcher, not to a `.ts` source file.

`tsx` may remain a development convenience where useful, but it shall not be required to run the built Version 1 application and shall not be a production runtime dependency solely to execute TypeScript source.

### 5.3 Compiler boundary

The production TypeScript configuration shall compile application source and the launcher. Test source shall not be emitted as production application output.

Test type-checking may use a separate TypeScript configuration or Vitest/Vite-aware configuration where required. Nuxt-generated aliases such as `.nuxt/imports.d.ts` shall not be part of the AppManager production compiler contract unless an approved implementation responsibility genuinely requires them.

The build must fail on TypeScript compilation errors. Type checking and production emission must remain available as separate root commands so CI can diagnose them independently.

---

## 6. Executable and Composition Root

### 6.1 Installed executable

The root package shall expose one primary Version 1 command:

```text
app-manager
```

The launcher shall be a small executable module whose responsibilities are limited to process/runtime concerns such as:

- identifying the tool installation/runtime location where required;
- capturing the caller's current working directory as an input fact;
- obtaining raw command-line arguments;
- establishing process-level cancellation/signal linkage;
- constructing the application composition root;
- invoking the IS-1 application boundary;
- projecting the returned canonical application outcome to process exit status and terminal/process-level diagnostics as defined by IS-1 and IS-22;
- performing orderly infrastructure shutdown.

It shall not directly register Git/App/Nuxt/etc. workflows, select interactive versus Headless application semantics, resolve application configuration precedence, or interpret provider results.

### 6.2 Composition root

A dedicated TypeScript composition-root module shall be the single normal place where concrete Version 1 implementations are constructed and connected.

The composition root may select concrete providers approved by their owning Implementation Specifications, for example a `simple-git` repository provider or a `consola`-backed logging sink. Provider selection at assembly time does not allow provider-native types to cross the owning capability boundary.

The composition root shall make dependency direction visible. Construction-time dependencies are passed explicitly through constructors, factory functions or registration APIs defined by the owning specifications.

Module-level singleton exports may be retained temporarily where a later IS records an explicit migration, but they are not the target assembly mechanism for responsibilities whose lifecycle or replacement must be controlled by the application.

### 6.3 Import-time side effects

Importing a module must not silently establish application workflow state.

In particular, command/use-case registration shall occur through explicit application composition owned by IS-1 and the domain specifications rather than top-level `register(...)` calls that execute as a side effect of importing `app/index.ts` or equivalent modules.

Infrastructure modules should also avoid registering process listeners at import time. Process listeners belong at the launcher/composition boundary and must be removable or have a defined application lifetime.

---

## 7. Process Globals and Environment

The Node.js process is an implementation boundary, not an application configuration store.

Raw access to the following shall be concentrated at the appropriate boundary:

- `process.argv` — executable/interaction input;
- `process.cwd()` — invocation fact used when constructing the request/context;
- `process.env` — bootstrap configuration/provider credential input to IS-3 or a provider-specific configuration binding;
- `process.exitCode` / process exit — projection of an already-determined canonical outcome;
- process signals — cancellation input;
- uncaught process errors — last-resort runtime failure handling.

General domain and capability code shall not independently read process globals when the value belongs to managed configuration, invocation context or another approved contract.

`.env` loading, if retained for local development, shall feed Configuration Resolution rather than create a parallel precedence system. `.env.example` remains documentation/example material and must contain placeholders only, never usable credentials or secrets.

---

## 8. Logging and Runtime Observability

The existing `loggerService.ts` contains useful implementation mechanisms: `consola` encapsulation, optional file logging, secret redaction and orderly stream closure. These mechanisms should be preserved where they conform.

Logging remains infrastructure. It is not the canonical AppManager diagnostic or execution-outcome model.

The target assembly shall therefore provide a logging/observability dependency to components that need it rather than treating a module-level logger singleton as application authority.

The following existing behaviours require adaptation:

- logger initialization must not depend on every consumer importing one global singleton;
- direct `process.env` reads for logging policy shall be supplied through resolved bootstrap/runtime configuration where applicable;
- process exit-listener ownership shall move to controlled runtime assembly;
- log storage paths and retention policy shall be supplied by their owning configuration/policy responsibility rather than hard-coded as `app_manager/logs/test` and 14 days;
- cleanup/deletion mechanics shall use the appropriate Resource Access/Utils responsibilities when those specifications are implemented;
- secret redaction shall apply to serialized non-string diagnostic material as well as obvious string arguments before persistent or terminal disclosure.

IS-23 specifies how logging infrastructure is assembled. It does not define the full logging API or domain diagnostic semantics.

---

## 9. Dependency Classification

Root dependencies shall be classified by the implementation responsibility that uses them. Root installation does not imply shared architectural ownership.

The current dependencies are provisionally treated as follows:

| Dependency | Target responsibility | IS-23 disposition |
|---|---|---|
| `@clack/prompts` | IS-22 Interaction Adapters | RETAIN pending IS-22 review |
| `@google/generative-ai` | IS-10 AI Capability provider | RETAIN/ADAPT pending IS-10 review |
| `consola` | runtime logging/IS-22 presentation support | RETAIN |
| `dotenv` | IS-3 bootstrap configuration input | ADAPT |
| `jsonc-parser` | IS-8 / configuration-resource implementation | RETAIN pending owning IS review |
| `picocolors` | IS-22 presentation | RETAIN pending IS-22 review |
| `simple-git` | IS-6 Repository Capability provider | RETAIN pending IS-6 review |
| `tsx` | development execution only | RELOCATE to development dependency if retained |
| `zod` | contract/configuration validation across approved boundaries | RETAIN |
| `typescript` | build/tooling | RETAIN |
| `vitest` and `@vitest/ui` | test tooling | RETAIN |
| `vite-tsconfig-paths` | test/build tooling only if required by final compiler/test layout | REVIEW/ADAPT |
| `vitepress` | documentation build tooling | RETAIN as development dependency |
| `cross-env` | development/test script portability if actually used | REVIEW; remove if unused |

Each later IS remains responsible for confirming its provider/library choice. IS-23 only establishes where the dependency is assembled and whether it belongs in production or development installation.

---

## 10. Root Commands

The root package shall provide clear, non-overlapping commands for the supported build/test lifecycle.

At minimum:

```text
build       compile production TypeScript to dist/
typecheck   type-check without production emission
test        run the default automated test suite
test:unit   run unit tests
test:e2e    run end-to-end/assembly tests
```

Additional watch, coverage and UI commands may remain for development convenience.

Script names should describe their purpose rather than expose a particular test runner unnecessarily. Existing `vitest:*` aliases may be retained during migration but the stable project-facing commands above shall exist.

The production build must not require a Nuxt application to have generated `.nuxt` state merely to compile AppManager itself.

---

## 11. Testing and Assembly Conformance

IS-23 requires tests that verify the application can be assembled and started without bypassing the approved boundaries.

At minimum, automated checks shall verify:

1. a clean production build emits the compiled launcher and application modules under `dist/`;
2. the package `bin` target exists after build and can start under a supported Node.js version;
3. production execution does not require `tsx` or TypeScript source files;
4. importing internal application modules does not itself register workflows or start the application;
5. the composition root can be constructed with test doubles for replaceable providers where their owning contracts permit replacement;
6. raw process arguments/environment/current-directory facts are translated at boundaries rather than read independently throughout domain code;
7. process exit projection occurs only after the application returns an approved canonical outcome;
8. shutdown closes owned runtime resources without domain code calling `process.exit()`;
9. unit/test sources are not part of production build output;
10. the build does not depend on generated Nuxt project state.

Vitest remains the Version 1 test runner unless a later approved implementation decision establishes a material reason to replace it.

The current Vitest use of isolated fork workers is useful test infrastructure and may be retained. Global mocks that couple all tests to concrete presentation/logging libraries should be reduced as explicit dependency seams become available.

---

## 12. Legacy Implementation Disposition

The current build/runtime code contains substantial reusable work, but its launcher and bootstrap responsibilities are duplicated and partly coupled to application semantics.

| Current artefact / responsibility | Disposition | Target owner/location | Preserved value | Required change |
|---|---|---|---|---|
| `package.json` ESM, pnpm, Node/TS baseline | RETAIN / ADAPT | root package / IS-23 | established package and toolchain baseline | point `bin`/execution at compiled output; separate production/development dependencies; add stable project-facing scripts; remove npm engine requirement |
| `package.json` `tsx` production dependency | SPLIT / RELOCATE | development tooling / IS-23 | convenient TypeScript development execution | move out of production dependency set; built app must not depend on it |
| `tsconfig.json` strict NodeNext/ES2022 baseline | RETAIN / ADAPT | production compiler config / IS-23 | strict TS and Node ESM configuration | narrow production inputs; remove accidental `.nuxt` dependency; separate test typing where needed |
| root `index.ts` launcher | ADAPT | executable launcher / IS-23 | thin-launcher intent, tool/target-root discovery, fatal boundary | remove duplicate initialization and direct application policy; invoke composition root and IS-1 boundary; compile before production use |
| `app/index.ts` bootstrap | SPLIT / RELOCATE | IS-1 plus IS-23 composition | existing dispatch/bootstrap experience | move command registration and interaction selection to owning boundaries; eliminate import-time registration and second executable path |
| `app/services/loggerService.ts` logging mechanics | RETAIN / ADAPT | runtime observability assembled by IS-23 | consola wrapper, file logging, redaction, close lifecycle | inject/configure explicitly; move process listener to assembly; remove hard-coded policy/path; strengthen redaction boundary |
| `app/services/configService.ts` bootstrap use | SPLIT / RELOCATE | IS-3 Configuration Resolution | schema validation and immutable-copy instincts | launcher/composition must not treat it as global application state; configuration lifecycle defined by IS-3 |
| `vitest.config.ts` test runner and isolation | RETAIN / ADAPT | test tooling / IS-23 and IS-11 | Vitest 4 configuration, fork isolation, coverage/reporting | align report paths and test categories with approved resource/config boundaries; reduce concrete global coupling |
| `vitest.setup.ts` global Clack/Consola mocks | ADAPT | test support for IS-22/runtime | prevents interactive hangs and noisy output | prefer injected adapter/logger doubles as target seams are implemented |
| `.npmrc` `shamefully-hoist=true` | REVIEW / REPLACE if unnecessary | package manager configuration / IS-23 | possible legacy compatibility | retain only if a demonstrated dependency requires hoisting; otherwise remove |
| `pnpm-workspace.yaml` build allow-list | RETAIN / ADAPT | package manager configuration / IS-23 | explicit native/build-script control for `esbuild` | keep only dependencies actually requiring build-script permission; workspace file need not imply a multi-package AppManager architecture |
| `.env.example` | ADAPT | IS-3/configuration documentation | inventory of expected external values | placeholders only; align names with approved configuration model; no realistic token-shaped example values |
| `app_manager/` runtime/config/template tree | SPLIT / RELOCATE | IS-3, IS-9, IS-19 and other owning specs | existing persisted resource concepts | IS-23 does not bless the historical tree as a universal runtime-data root; each owning IS defines its resource paths |

No item is replaced merely because it is legacy. Replacement is required only where the retained mechanism cannot meet an approved boundary or creates unnecessary runtime/build risk.

---

## 13. Target Assembly Shape

The concrete Version 1 assembly shall follow this dependency direction:

```text
package executable / launcher
          |
          v
composition root
          |
          +--> runtime infrastructure
          |
          +--> concrete capability providers
          |       behind owning IS contracts
          |
          +--> domain implementations
          |
          v
IS-1 Application Runtime and Invocation
          |
          v
Application Invocation Contract
```

Interaction adapters connect to the Application Invocation Contract as specified by IS-22. They do not become application owners because the composition root constructs them in the same process.

The exact internal source paths for Application Engine, capabilities and domains are deliberately left to their owning Implementation Specifications.

---

## 14. Migration Sequence

IS-23 shall be implemented incrementally so later specifications can reuse the foundation without forcing a wholesale rewrite.

1. Establish a production compiler configuration that emits the root launcher and `app/` source to `dist/` without test or `.nuxt` coupling.
2. Change package execution so `app-manager` targets compiled JavaScript; retain `tsx` only for explicit development workflows if still useful.
3. Add stable root `test`, `test:unit` and `test:e2e` commands while preserving useful existing Vitest aliases during transition.
4. Introduce the composition-root module and move process-level construction/lifecycle into it as IS-1, IS-3 and the capability specifications define their concrete contracts.
5. Collapse the two current bootstrap paths into one installed launcher plus one application invocation path.
6. Move import-time command registration and interaction-mode dispatch out of assembly as IS-1/IS-22 are authored.
7. Adapt logging to explicit runtime assembly while retaining its useful implementation mechanisms.
8. Reclassify production/development dependencies and remove package-manager workarounds only after their consumers are verified.
9. Add assembly conformance tests and make the clean build/typecheck/test sequence a release prerequisite.

Steps that depend on not-yet-authored IS contracts may be recorded as pending rather than guessed. IS-23 defines the destination and assembly constraints; it does not invent those contracts on their behalf.

---

## 15. Traceability

| IS-23 implementation decision | Governing source |
|---|---|
| Node.js/TypeScript Version 1 runtime | ADR-0001 |
| single-process default without boundary collapse | ADR-0001; complete DD dependency model |
| thin interaction-independent executable boundary | DD-1.1; ADR-0001 |
| Application Engine retains application authority | DD-1.5; DD conformance guardrails |
| process/provider results do not become canonical outcomes | DD-1.2; DD-2 capability designs |
| explicit managed/configuration inputs rather than ambient process state | DD-1.3; DD-1.4; bootstrap clarification |
| provider replaceability despite in-process implementation | ADR-0001; DD-2 capability designs |
| interaction adapters remain outside application authority | DD-1.1; interaction-mode requirements; IS-22 register boundary |
| legacy code preserved where conforming | ADR-0001; Implementation Specification Plan §9 |

---

## 16. Conformance Rules

An implementation conforms to IS-23 only if all of the following are true:

- the supported application runs from compiled JavaScript under the declared Node.js baseline;
- `pnpm` and the committed lockfile define reproducible package installation;
- one thin executable launcher enters one explicit composition/application path;
- the launcher and composition root do not contain domain workflow policy;
- import-time side effects do not establish application command/use-case state;
- production build inputs exclude tests and accidental Nuxt-generated state;
- `tsx` is not required for production execution;
- process globals are translated at controlled boundaries rather than used as hidden application dependencies;
- logging/observability is subordinate infrastructure and does not replace canonical diagnostics/outcomes;
- concrete providers can remain in-process without leaking provider-native semantics across their approved boundaries;
- good legacy implementation is retained or adapted where it conforms, with replacement justified rather than assumed;
- later `IS-*` documents can change their internal module topology without requiring IS-23 to be rewritten unless the package/build/runtime assembly contract itself changes.

---

## 17. Next Implementation Specification

With the common runtime/build foundation specified, the next dependency-aware documents are:

1. **IS-4 — Resource Access**;
2. **IS-5 — Process Execution**.

Resource Access should be authored first because runtime logging, configuration persistence, templates and several later capabilities depend on safe concrete resource mechanics.