# IS-23 — Build and Runtime Assembly Implementation Specification

> **Document type:** Level 4 Implementation Specification
>
> **Status:** Version 1 implementation baseline — horizontally reconciled
>
> **Implementation ID:** IS-23
>
> **Primary decision input:** [ADR-0001 — Primary Application Runtime](../project_management/decisions/adr-0001-primary-application-runtime.md)
>
> **Register:** [AppManager Implementation Specification](implementation-specification-v01.md)
>
> **Governing plan:** [Implementation Specification Plan](../project_management/implementation-specification-plan-v01.md)
>
> **Reconciliation record:** [Implementation Specification Conformance and Reconciliation](../project_management/implementation-specification-conformance-reconciliation-v01.md)

## 1. Purpose

IS-23 defines the concrete package, build, executable and process-assembly foundation for AppManager Version 1. It makes the approved Node.js/TypeScript implementation runnable and buildable without deciding module responsibilities owned by IS-1 through IS-22.

> **Build and runtime assembly may connect approved implementation responsibilities, but it must not acquire their application authority or collapse their boundaries merely because Version 1 runs them in one Node.js process.**

---

## 2. Scope

IS-23 owns the Version 1 Node.js/TypeScript runtime baseline; package-manager and root package metadata relevant to build/execution; ESM execution; production build output; installed executable and launcher boundary; composition root; root build/type-check/test commands; package-level dependency classification; process startup/shutdown wiring; and assembly-level conformance tests.

It does not own Application Invocation Contract semantics, dispatch or canonical outcomes (IS-1); managed-project/configuration resolution (IS-2/IS-3); filesystem semantics (IS-4); child-process semantics (IS-5); capability-provider behaviour (IS-6 through IS-13); domain policy/workflows (IS-14 through IS-21); or TUI/Headless adapter behaviour (IS-22).

Root installation of a dependency never transfers its semantic ownership to IS-23.

---

## 3. Governing Runtime Constraints

ADR-0001 selects Node.js and TypeScript. Version 1 therefore uses a single primary Node.js application process by default; process separation is not required to preserve semantic boundaries.

The assembly shall preserve these constraints:

1. boundaries are explicit TypeScript contracts and dependency direction, not process topology;
2. provider-native objects do not cross general AppManager boundaries;
3. the launcher is thin and contains no domain workflow;
4. composition uses explicit construction/registration, not import-time global registration;
5. `process.argv`, `process.cwd()`, `process.env`, signals and exit status are translated at controlled boundaries;
6. build/provider/process success is technical evidence only, not an AppManager outcome;
7. the selected IS-22 adapter is the interaction entry into IS-1; the launcher is not a third adapter.

---

## 4. Runtime and Package Baseline

Version 1 uses Node.js, TypeScript, ESM (`"type": "module"`), NodeNext module semantics and `pnpm`. The existing Node `>=20.0.0`, pnpm `11.5.2`, TypeScript `5.9.x`, NodeNext and ES2022 settings are retained initially unless implementation testing demonstrates incompatibility.

The root `packageManager` identifies the exact pnpm release; the committed lockfile is authoritative dependency resolution for a source revision; CI/install uses it without silent regeneration. The root package remains private unless a later distribution decision changes that status. The package exposes application-level scripts and the `app-manager` executable without forcing all implementation responsibilities into one source directory.

---

## 5. Source and Build Layout

The Version 1 application source root remains `app/`. Historical folders such as `services/`, `commands/`, `scanners/` and `strategies/` are not architectural requirements.

Production execution uses compiled JavaScript. TypeScript emits to `dist/`; the package `bin` points to the compiled launcher, not `.ts`. `tsx` may remain a development convenience but is not required for production execution and should not remain a production dependency solely to run TypeScript source.

Production compilation includes application source and launcher, excludes test source, fails on TypeScript errors and does not depend on generated Nuxt `.nuxt` state. Type checking and production emission remain separate root commands.

---

## 6. Executable, Adapter and Composition Root

### 6.1 Installed executable

The root package exposes one primary command: `app-manager`.

The reconciled Version 1 process path is:

```text
thin launcher
    |
    v
IS-23 composition root
    |
    v
selected IS-22 adapter (TUI or Headless)
    |
    v
IS-1 AppManagerApplication
    |
    v
canonical application outcome
    |
    v
IS-22 transport/presentation projection
    |
    v
launcher process exitCode / orderly shutdown
```

The launcher may identify installation/runtime location, capture cwd as an input fact, obtain raw CLI arguments, establish process-level signal linkage, construct the composition root, select/launch the appropriate already-composed IS-22 adapter according to host invocation mechanics, receive the adapter's terminal lifecycle result, set final process exit status and perform infrastructure shutdown.

The launcher shall **not** invoke IS-1 directly for normal TUI/Headless operation, implement command parsing/prompting, become a third invocation adapter, register domain workflows, decide application authorization/policy, resolve configuration precedence, or interpret provider evidence.

The selected IS-22 adapter alone translates host interaction into `AppManagerApplication.discover/invoke/cancel` semantics and projects canonical outcomes for its transport. IS-1 remains final application authority.

### 6.2 Composition root

A dedicated composition-root module is the single normal place where concrete Version 1 implementations are constructed and connected. It constructs runtime infrastructure, approved providers behind owning contracts, domain implementations, IS-1 and the IS-22 adapters.

Provider selection at assembly time never permits provider-native types to cross owning capability boundaries. Construction dependencies are explicit through constructors, factories or owning registration APIs. Module-level singletons may exist only as documented migration state; they are not the target assembly mechanism.

### 6.3 Import-time side effects

Importing modules must not establish workflow state, register commands/use cases implicitly, start the application or install uncontrolled process listeners. Registration is explicit through IS-1/domain composition; process listeners belong to launcher/composition lifetime.

---

## 7. Process Globals and Environment

The Node process is an implementation boundary, not an application configuration store. `process.argv` is interaction input; `process.cwd()` is invocation evidence, never managed-scope authority; `process.env` feeds IS-3 bootstrap/provider configuration; exit status projects an already-determined canonical outcome; signals become cancellation input; uncaught errors are last-resort runtime failures.

Domain/capability code does not independently read globals where values belong to managed configuration or invocation context. `.env` loading, if retained, feeds IS-3 rather than defining parallel precedence. `.env.example` contains placeholders only.

---

## 8. Logging and Runtime Observability

Existing `loggerService.ts` mechanisms such as `consola` encapsulation, optional file logging, redaction and orderly stream closure may be retained/adapted where conforming. Logging is infrastructure, never canonical diagnostics/outcomes.

Target assembly injects observability dependencies rather than relying on a global authority singleton. Logging policy comes from resolved configuration; process listener ownership moves to runtime assembly; storage/retention comes from owning policy; cleanup uses IS-4/IS-21 responsibilities; redaction applies before terminal or persistent disclosure, including structured material.

---

## 9. Reconciled Dependency Classification

All primary IS documents now exist. No dependency disposition remains provisional merely pending a later IS review.

| Dependency | Owning responsibility | Reconciled disposition |
|---|---|---|
| `@clack/prompts` | IS-22 TUI | **RETAIN** for TUI presentation/input only |
| `picocolors` | IS-22 TUI | **RETAIN** for presentation only |
| `simple-git` | IS-6 Repository Capability | **REPLACE / REMOVE from target provider path**; IS-6 selects direct Git CLI execution through IS-5 and does not retain `simple-git` as the Version 1 local Git provider mechanism |
| `jsonc-parser` | IS-7 / IS-8 | **RETAIN** where selected for JSON/JSONC inspection/transformation; provider objects stay inside owning boundaries |
| `@google/generative-ai` | IS-10 provider implementation | **REVIEW / REMOVE if unused**; it is not an architectural dependency and remains only if an explicitly implemented provider adapter requires it |
| `consola` | runtime observability | **RETAIN** as logging mechanism only, not outcome/diagnostic semantics |
| `dotenv` | IS-3 bootstrap input | **ADAPT** as candidate-input mechanism only |
| `zod` | owning contracts | **RETAIN where selected**; package presence creates no cross-domain validation authority |
| `tsx` | development execution | **RELOCATE** to development dependency if retained |
| `typescript` | build/tooling | **RETAIN** |
| `vitest`, `@vitest/ui` | test tooling | **RETAIN** |
| `vite-tsconfig-paths` | test/build tooling | **REVIEW / ADAPT** only if final layout requires it |
| `vitepress` | IS-12 / IS-17 documentation tooling | **RETAIN** as development dependency |
| `cross-env` | development/test portability | **REVIEW**; remove if unused |

Package location does not redefine semantic ownership. Where this assembly-level dependency inventory names a dependency owned by another Implementation Specification, the owning specification's explicit provider decision governs its target use.

---

## 10. Root Commands

The root package provides stable non-overlapping commands at minimum:

```text
build       compile production TypeScript to dist/
typecheck   type-check without production emission
test        run the default automated test suite
test:unit   run unit tests
test:e2e    run end-to-end/assembly tests
```

Watch, coverage and UI commands may remain as development conveniences. Existing runner-specific aliases may bridge migration but do not replace stable project-facing commands.

---

## 11. Assembly Conformance Tests

Automated assembly checks verify at minimum that:

1. a clean production build emits launcher/application modules under `dist/`;
2. the package `bin` target exists and starts under supported Node;
3. production execution needs neither `tsx` nor TypeScript source;
4. importing internal modules does not register workflows/start the application;
5. the composition root accepts test doubles where owning contracts permit replacement;
6. raw argv/environment/cwd facts are translated at boundaries;
7. the launcher reaches IS-1 through the selected IS-22 adapter for normal TUI/Headless execution;
8. IS-22, not the launcher, owns host input translation and canonical-outcome presentation/serialization;
9. process exit projection occurs only after canonical outcome projection;
10. shutdown closes owned resources without deep `process.exit()` calls;
11. tests are absent from production build output;
12. build does not depend on generated Nuxt state;
13. provider-native types do not leak across capability boundaries;
14. TUI and Headless share the same IS-1 application semantics.

Vitest remains the Version 1 runner unless a later approved decision replaces it.

---

## 12. Legacy Implementation Disposition

| Current artefact / responsibility | Disposition | Target | Required treatment |
|---|---|---|---|
| `package.json` ESM/pnpm/Node/TS baseline | RETAIN / ADAPT | root / IS-23 | compiled `bin`, production/dev dependency split, stable scripts |
| `tsx` production dependency | SPLIT / RELOCATE | dev tooling | built app must not depend on it |
| `tsconfig.json` NodeNext/ES2022 | RETAIN / ADAPT | compiler | narrow production inputs; remove `.nuxt` coupling; separate test typing as needed |
| root `index.ts` | ADAPT | launcher / IS-23 | thin host lifecycle; select composed IS-22 adapter; no direct IS-1 invocation for normal adapter operation |
| `app/index.ts` bootstrap | SPLIT / RELOCATE | IS-1 + IS-23 + IS-22 | eliminate duplicate executable path/import registration; adapter selection belongs to reconciled interaction path |
| `loggerService.ts` mechanics | RETAIN / ADAPT | observability | inject/configure; controlled listeners; owning path/retention policy; stronger redaction |
| `configService.ts` bootstrap use | SPLIT / RELOCATE | IS-3 | no global application-state authority |
| Vitest configuration/isolation | RETAIN / ADAPT | IS-23 / IS-11 | align categories/report paths; reduce global concrete coupling |
| global Clack/Consola mocks | ADAPT | test support | prefer injected adapter/logger doubles |
| `.npmrc` hoisting | REVIEW / REPLACE if unnecessary | package config | retain only with demonstrated need |
| workspace build allow-list | RETAIN / ADAPT | package config | keep only required build-script permissions |
| `.env.example` | ADAPT | IS-3 docs/input | placeholders only, approved names |
| `app_manager/` runtime/config/template tree | SPLIT / RELOCATE | owning IS-3/9/19 etc. | historical tree is not a universal runtime-data authority |

Conforming legacy mechanisms are preserved/adapted; replacement is justified by approved boundaries or risk, never by age alone.

---

## 13. Target Assembly Shape

```text
package executable / thin launcher
          |
          v
IS-23 composition root
          |
          +--> runtime infrastructure
          +--> concrete providers behind owning contracts
          +--> domain implementations
          +--> IS-1 AppManagerApplication
          +--> IS-22 TUI adapter
          +--> IS-22 Headless adapter
          |
          v
selected IS-22 adapter
          |
          v
IS-1 Application Runtime and Invocation
```

Composition connects responsibilities but never transfers authority.

---

## 14. Migration Sequence

1. Establish production compiler output under `dist/` without tests/`.nuxt` coupling.
2. Point `app-manager` at compiled JavaScript and move `tsx` to explicit development use if retained.
3. Add stable build/typecheck/test commands.
4. Introduce explicit composition and provider construction.
5. Collapse duplicate bootstrap paths into one launcher/composition path.
6. Implement the reconciled launcher -> selected IS-22 adapter -> IS-1 lifecycle.
7. Remove import-time command registration and deep process lifecycle control.
8. Adapt logging to explicit assembly.
9. Apply final dependency dispositions from §9, including removing `simple-git` from the target local Git provider path in accordance with IS-6 and removing `@google/generative-ai` if no implemented provider adapter requires it.
10. Add assembly conformance tests and make clean build/typecheck/test a release prerequisite.

No remaining migration step is labelled pending an unauthored primary IS; all owning Level 4 contracts now exist.

---

## 15. Traceability

| Decision | Governing source |
|---|---|
| Node.js/TypeScript runtime | ADR-0001 |
| single-process default without boundary collapse | ADR-0001; complete DD dependency model |
| thin launcher | DD-1.1; ADR-0001 |
| launcher -> IS-22 adapter -> IS-1 | IS-22; IS-1; Level 4 reconciliation |
| Application Engine final authority | DD-1.5; IS-1 |
| provider/process evidence not canonical outcome | DD-1.2; capability IS set |
| explicit context/config rather than ambient globals | DD-1.3; DD-1.4; bootstrap clarification; IS-2; IS-3 |
| provider replaceability | ADR-0001; IS-6 through IS-13 |
| TUI/Headless same application semantics | DD-1.1; IS-22 |
| conforming legacy code retained/adapted | ADR-0001; Implementation Specification Plan §9 |

---

## 16. Conformance Rules

An implementation conforms only if the supported application runs compiled JavaScript under the declared Node baseline; pnpm/lockfile define reproducible installation; one thin launcher enters one explicit composition path; normal TUI/Headless execution passes through the selected IS-22 adapter before IS-1; the launcher is not a third adapter; launcher/composition contain no domain workflow policy; import-time side effects do not establish use-case state; production inputs exclude tests/accidental Nuxt state; `tsx` is unnecessary in production; process globals are translated at controlled boundaries; observability remains subordinate infrastructure; providers remain replaceable and do not leak native semantics; and legacy implementation is retained/adapted where conforming.

---

## 17. Level 4 Reconciliation State

IS-23 is reconciled against the completed IS-1 through IS-22 corpus. The former provisional dependency dispositions and pre-IS-22 direct-launcher wording are retired.

No additional primary Implementation Specification is implied by this document. Implementation proceeds against the complete reconciled Level 4 baseline and normal change control.