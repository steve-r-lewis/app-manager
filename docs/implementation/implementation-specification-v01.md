# AppManager Implementation Specification

> **Document type:** Level 4 Implementation Specification overview and register
>
> **Status:** Version 1 register approved for authoring; individual specifications not yet authored
>
> **Governing plan:** [Implementation Specification Plan](../project_management/implementation-specification-plan-v01.md)
>
> **Selection method:** [Implementation Specification Map](../project_management/implementation-specification-map-v01.md)

## 1. Purpose

This document is the entry point and canonical register for the Version 1 AppManager Implementation Specifications.

It answers a simple question:

> **Which concrete implementation responsibilities need their own specification before the approved Detailed Design is reduced to code?**

The register is based on the completed Detailed Design set, the Implementation Specification selection test, and a read-first comparison with the current repository.

The current source tree is evidence of the starting state. It does not define the target implementation where it conflicts with the approved Detailed Design.

---

## 2. Register Rules

A primary Implementation Specification has a stable identifier of the form:

```text
IS-<number>
```

The number is an identity, not an authority level and not a guarantee of implementation order.

Each primary specification will be stored under:

```text
docs/implementation/
```

using the filename form:

```text
is-<number>-<subject>-implementation-specification-v01.md
```

The register does not imply one Implementation Specification per source file, service, class, command or Detailed Design document.

The Version 1 list below happens to contain 23 primary specifications. That is **not** because Version 1 has 23 Detailed Designs. The number results from applying the selection test independently:

- DD-1.1, DD-1.2 and DD-1.5 are combined in one application-runtime implementation specification;
- DD-1.3 and DD-1.4 remain separate because their concrete resolution mechanisms and tests are independently meaningful;
- each DD-2 capability remains separately specified because each has a distinct technical boundary, provider/mechanism surface or safety model;
- each DD-3/DD-4 domain remains separately specified because each owns distinct use-case orchestration or policy that must not be collapsed into another domain;
- interaction adapters and runtime/build assembly add two implementation concerns that are concrete Level 4 responsibilities but are not themselves new Detailed Design authorities.

---

## 3. Version 1 Implementation Specification Register

| ID | Subject | Principal Detailed Design input | Status |
|---|---|---|---|
| `IS-1` | Application Runtime and Invocation | DD-1.1, DD-1.2, DD-1.5 | Planned |
| `IS-2` | Managed Project Resolution | DD-1.3, DD-1.5 | Planned |
| `IS-3` | Configuration Resolution | DD-1.4, DD-1.5 and bootstrap clarification | Planned |
| `IS-4` | Resource Access | DD-2.1 | Planned |
| `IS-5` | Process Execution | DD-2.2 | Planned |
| `IS-6` | Repository Capability | DD-2.3 | Planned |
| `IS-7` | Source Intelligence | DD-2.4 | Planned |
| `IS-8` | Source Transformation | DD-2.5 | Planned |
| `IS-9` | Resource Registry and Template | DD-2.6 | Planned |
| `IS-10` | AI Capability | DD-2.7 | Planned |
| `IS-11` | Quality Capability | DD-2.8 | Planned |
| `IS-12` | Documentation Capability | DD-2.9 | Planned |
| `IS-13` | Nuxt Capability | DD-2.10 | Planned |
| `IS-14` | App Domain | DD-3.1 | Planned |
| `IS-15` | Git Domain | DD-3.2 | Planned |
| `IS-16` | Nuxt Domain | DD-3.3 | Planned |
| `IS-17` | Docs Domain | DD-3.4 | Planned |
| `IS-18` | Quality Domain | DD-4.1 | Planned |
| `IS-19` | Settings Domain | DD-4.2 | Planned |
| `IS-20` | AI Domain | DD-4.3 | Planned |
| `IS-21` | Utils Domain | DD-4.4 | Planned |
| `IS-22` | Interaction Adapters | DD-1.1 plus interaction-mode requirements carried through the DD set | Planned |
| `IS-23` | Build and Runtime Assembly | ADR-0001 and the complete DD dependency model | Planned |

---

## 4. Why These Boundaries Were Chosen

### 4.1 IS-1 — Application Runtime and Invocation

This specification combines Application Invocation, Execution Outcomes and Application Engine implementation concerns because their concrete runtime wiring is inseparable at the application entry and dispatch boundary.

It will define the concrete TypeScript modules and interfaces for:

- application bootstrap;
- command/use-case registration;
- invocation request handling;
- execution-context construction;
- dispatch;
- cancellation linkage;
- canonical outcome construction and projection;
- application-level interpretation of delegated results.

It must preserve the rule that the Application Engine retains final application authority.

Current repository evidence includes `app/index.ts`, `app/commands/baseCommand.ts` and `app/commands/commandRegistry.ts`, but their present shapes are not presumed to be the target design.

### 4.2 IS-2 — Managed Project Resolution

Managed Project remains separate from Configuration Resolution because it owns a different concrete problem: resolving project identity, topology, managed entities, repository relationships and operation-specific managed scope.

Its implementation must be independently testable without turning configuration loading into project discovery or treating discovery as mutation authority.

### 4.3 IS-3 — Configuration Resolution

Configuration Resolution remains separate because precedence, applicability, provenance, staged bootstrap resolution, sensitive values and immutable operation snapshots form a coherent implementation responsibility independent of project-topology discovery.

The accepted bootstrap order must be preserved:

```text
context-independent/bootstrap configuration
        |
        v
managed-project resolution
        |
        v
project/scope-dependent configuration
        |
        v
operation configuration snapshot
```

The current `configService.ts` and `settingsResolver.ts` are starting-state evidence only.

### 4.4 IS-4 and IS-5 — Resource Access and Process Execution

These candidates are **split**, not merged.

Resource Access has filesystem/path containment, stale-state, atomic/best-effort mutation and resource-safety concerns.

Process Execution has executable invocation, environment handling, output streaming, exit normalization, cancellation, termination and timeout concerns.

They may both be infrastructure, but their APIs, failure models, tests and external boundaries are materially different. The current `fileService.ts` and `processService.ts` reinforce that they can be implemented and tested independently.

### 4.5 IS-6 — Repository Capability

Repository Capability warrants its own specification because it wraps concrete Git/repository mechanisms behind AppManager-oriented facts and primitives.

The implementation must prevent provider-native Git details or `simple-git` behaviour from becoming Git-domain policy or final application outcomes.

### 4.6 IS-7 and IS-8 — Source Intelligence and Source Transformation

These candidates remain **separate** despite sharing source models and possible parser infrastructure.

Source Intelligence is read-only recognition and structural evidence.

Source Transformation applies approved bounded transformation plans and therefore has mutation, stale-source, preservation and validation obligations that require separate review.

The current scanner and strategy families are evidence for these implementation areas but must not be copied mechanically into the target architecture.

### 4.7 IS-9 — Resource Registry and Template

Registry and template mechanics remain one specification because registry identity, template identity, validation, parameter binding, rendering and provenance form one coherent declarative-resource implementation boundary.

This specification must not create a generic executable plugin framework.

### 4.8 IS-10 — AI Capability

AI Capability remains independent because provider/model adapters, disclosure controls, request/context construction, response normalization and structured-output validation form a replaceable external-provider boundary.

The current `llmService.ts` and Google Generative AI dependency are evidence, not architectural authority.

### 4.9 IS-11 — Quality Capability

Quality Capability warrants its own implementation specification because test, coverage, lint, type-check and validation tools must be invoked and normalized without allowing tool completion to become Quality-domain or application acceptance.

### 4.10 IS-12 — Documentation Capability

Documentation Capability remains independent because shared documentation inspection, modeling, rendering, generation and validation are technical mechanisms distinct from Docs-domain application intent.

### 4.11 IS-13 — Nuxt Capability

Nuxt Capability remains independent because framework-specific recognition, configuration inspection and bounded Nuxt mechanisms should be encapsulated behind a technical boundary rather than spread through Nuxt-domain orchestration.

### 4.12 IS-14 through IS-21 — Domain Implementations

The eight domain specifications remain separate after applying the selection test.

This is not because there are eight domain Detailed Designs. It is because each domain has a separately reviewable concrete orchestration/policy responsibility:

- App — root application lifecycle and creation intent;
- Git — repository-management use cases and repository policy;
- Nuxt — Nuxt application/layer use cases and applicability policy;
- Docs — documentation use cases and profile/output policy;
- Quality — quality intent, operation-specific quality policy and gate composition;
- Settings — explicit settings and metadata-management intent;
- AI — AI-specific project-resource/instruction intent;
- Utils — narrowly bounded otherwise-unowned maintenance intent.

Combining these into one "domain implementation" specification would obscure authority boundaries, make traceability poor and create an oversized document whose parts could change independently.

Individual commands within those domains do **not** receive primary IS identities by default. They are concrete artefacts specified by their owning domain IS.

### 4.13 IS-22 — Interaction Adapters

Interaction adapters warrant a separate specification because the TUI/interactive and Headless implementations must translate into and out of the same Application Invocation Contract without acquiring application authority.

The present `app/modes/interactiveMode.ts` and `app/modes/headlessMode.ts` demonstrate a concrete implementation surface, but the target specification will decide their final module structure.

TUI and Headless remain in one primary IS unless authoring reveals materially separate transports or host lifecycles that satisfy the split test independently.

### 4.14 IS-23 — Build and Runtime Assembly

Build and Runtime Assembly is a concrete implementation responsibility because it turns the separately specified modules into one working Node.js/TypeScript application.

It will cover matters such as:

- package and workspace configuration;
- executable entry point;
- TypeScript build configuration;
- runtime composition/root wiring;
- package scripts that form part of supported development/build behaviour;
- dependency assembly;
- production execution assumptions;
- integration-level tests of application assembly.

It must not become a miscellaneous document for implementation details owned by another IS.

---

## 5. Current Repository Interpretation

The current repository contains historical implementation groupings including:

```text
app/commands/
app/license_engine/
app/modes/
app/orchestrators/
app/resolvers/
app/scanners/
app/services/
app/strategies/
app/types/
```

These directories do not become Implementation Specification boundaries automatically.

Examples:

- `app/services/` contains unrelated responsibilities such as resource access, configuration, repository access, AI and process execution, so it cannot map to one `Services` IS;
- `app/scanners/` and `app/strategies/` contribute to Source Intelligence and Source Transformation but do not independently justify one IS per language or strategy;
- `app/commands/` contributes primarily to the domain specifications and Application Runtime, rather than defining one specification per command file;
- `app/license_engine/` must be reconciled through the Settings implementation rather than being preserved as an architectural engine merely because the directory exists;
- `app/types/` is a storage location for TypeScript declarations, not an implementation responsibility of its own.

---

## 6. Cross-Cutting Implementation Rules

Every primary Implementation Specification must preserve the following rules where applicable:

1. **Application authority stays with the Application Engine.** Specialist execution does not acquire final application authority.
2. **Managed scope is explicit.** Discovery, recognition or provider capability does not create mutation authority.
3. **Configuration resolution is centralized.** Persistence does not define precedence, and consumers must not invent private precedence rules.
4. **Canonical outcomes remain canonical.** Provider responses, exceptions and exit codes must be normalized rather than leaked as application semantics.
5. **Evidence remains evidence until interpreted.** Repository, source, AI, Quality, Documentation and Nuxt capability results do not decide owning-domain acceptance by themselves.
6. **Source Intelligence stays read-only.** Existing-source mutation must follow Source Transformation semantics.
7. **AI remains non-authoritative.** AI output is proposal/evidence until accepted by the owning use case.
8. **Capability/domain pairs stay distinct.** Shared technical execution must not absorb domain intent or policy.
9. **Provider replaceability is preserved.** A selected Version 1 provider must not leak its native model into general AppManager contracts unless an accepted ADR deliberately changes that rule.
10. **Implementation structure must not recreate a generic Utils/helper authority.** Helpers remain subordinate to the responsibility they serve.

---

## 7. Authoring Order

The register number is not the writing order. The recommended first-pass writing sequence follows implementation dependency:

```text
IS-23  Build and Runtime Assembly foundations
  |
  +--> IS-4   Resource Access
  +--> IS-5   Process Execution
  |
  v
IS-1   Application Runtime and Invocation
  |
  +--> IS-2   Managed Project Resolution
  +--> IS-3   Configuration Resolution
  |
  +--> IS-6   Repository Capability
  +--> IS-7   Source Intelligence
  +--> IS-8   Source Transformation
  +--> IS-9   Resource Registry and Template
  +--> IS-10  AI Capability
  +--> IS-11  Quality Capability
  +--> IS-12  Documentation Capability
  +--> IS-13  Nuxt Capability
  |
  v
IS-14 .. IS-21  Domain implementations
  |
  v
IS-22  Interaction Adapters
```

This sequence is pragmatic rather than normative. An individual specification may be written earlier where its dependencies are sufficiently understood, but no implementation document may redefine an approved upstream contract for convenience.

A practical starting order is:

1. `IS-23` — Build and Runtime Assembly, limited initially to the build/package/runtime constraints needed by all implementation work;
2. `IS-4` — Resource Access;
3. `IS-5` — Process Execution;
4. `IS-1` — Application Runtime and Invocation;
5. `IS-2` and `IS-3` — Managed Project and Configuration Resolution;
6. `IS-6` through `IS-13` — shared capability implementations;
7. `IS-14` through `IS-21` — domain implementations;
8. `IS-22` — Interaction Adapters after the invocation/application path is concrete.

The initial portion of `IS-23` must not prematurely prescribe the internal module topology that the later specifications are responsible for deciding.

---

## 8. Planned Files

The Version 1 primary Implementation Specifications are registered at the following paths:

```text
docs/implementation/is-1-application-runtime-and-invocation-implementation-specification-v01.md
docs/implementation/is-2-managed-project-resolution-implementation-specification-v01.md
docs/implementation/is-3-configuration-resolution-implementation-specification-v01.md
docs/implementation/is-4-resource-access-implementation-specification-v01.md
docs/implementation/is-5-process-execution-implementation-specification-v01.md
docs/implementation/is-6-repository-capability-implementation-specification-v01.md
docs/implementation/is-7-source-intelligence-implementation-specification-v01.md
docs/implementation/is-8-source-transformation-implementation-specification-v01.md
docs/implementation/is-9-resource-registry-and-template-implementation-specification-v01.md
docs/implementation/is-10-ai-capability-implementation-specification-v01.md
docs/implementation/is-11-quality-capability-implementation-specification-v01.md
docs/implementation/is-12-documentation-capability-implementation-specification-v01.md
docs/implementation/is-13-nuxt-capability-implementation-specification-v01.md
docs/implementation/is-14-app-domain-implementation-specification-v01.md
docs/implementation/is-15-git-domain-implementation-specification-v01.md
docs/implementation/is-16-nuxt-domain-implementation-specification-v01.md
docs/implementation/is-17-docs-domain-implementation-specification-v01.md
docs/implementation/is-18-quality-domain-implementation-specification-v01.md
docs/implementation/is-19-settings-domain-implementation-specification-v01.md
docs/implementation/is-20-ai-domain-implementation-specification-v01.md
docs/implementation/is-21-utils-domain-implementation-specification-v01.md
docs/implementation/is-22-interaction-adapters-implementation-specification-v01.md
docs/implementation/is-23-build-and-runtime-assembly-implementation-specification-v01.md
```

The files should be created as they are authored rather than as empty placeholders.

---

## 9. Change Control

The `IS-*` identities in this register are now the Version 1 planning baseline.

They may be deliberately changed if implementation authoring exposes a genuine boundary problem, but they must not drift casually because a current class, directory or helper is renamed.

A proposed split, merge or retirement of a registered primary IS must explain:

- which implementation responsibility changed;
- which DD contracts are affected;
- why the existing boundary is no longer coherent;
- how traceability will be preserved;
- whether any accepted ADR or higher-level specification is affected.

Routine source refactoring inside a registered responsibility does not require changing its `IS-*` identity.

---

## 10. Next Step

The Version 1 primary Implementation Specification set is now identified.

The next task is to author the first specification in dependency-aware order while keeping its scope narrow enough not to pre-empt later implementation decisions.

The recommended first document is:

> **IS-23 — Build and Runtime Assembly**, beginning with the concrete Node.js/TypeScript package, build, executable and composition constraints that every subsequent implementation specification must work within.

After that foundation is explicit, Resource Access and Process Execution can be specified against a stable runtime/build environment.
