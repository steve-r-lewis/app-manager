# AppManager Technology Architecture Review

> **Status:** Architecture Review — Revised Recommendation for Decision
>
> **Authority:** Non-normative project-management investigation conducted under [Architecture Decision Governance](decisions/architecture-decision-governance-v01.md). This review provides evidence and a recommendation. It does not itself approve a technology architecture or override the AppManager Design Specification.
>
> **Decision target:** A subsequent Architecture Decision Record should record the approved near-term development technology direction and the conditions under which the application-engine technology should be reviewed again.

## 1. Purpose

This review evaluates the primary implementation technology architecture for AppManager before further design and implementation harden around the existing Node.js/TypeScript codebase.

The review compares three principal technology routes:

1. **Option 1 — Node.js/TypeScript throughout:** retain Node.js and TypeScript as the implementation technology for the AppManager application and its ecosystem-facing functionality.
2. **Option 2 — Kotlin/JVM application:** migrate the primary AppManager application to Kotlin/JVM and implement the principal application and ecosystem-facing capabilities there wherever practical.
3. **Option 3 — Kotlin/JVM application engine with a bounded Node.js/TypeScript ecosystem capability provider:** make Kotlin/JVM the authoritative AppManager application technology while retaining Node.js/TypeScript as a subordinate provider of explicitly bounded ecosystem-native capabilities.

The initial review leaned toward Option 3 as the strongest eventual architectural fit. Further review produced a more important conclusion: **the architectural boundaries exposed by Option 3 should be designed now, but the runtime migration should not be performed before AppManager v1 has validated those boundaries through a complete working TypeScript implementation.**

The revised recommendation is therefore:

> **Continue AppManager v1 in Node.js/TypeScript, but structure v1 around a distinct Application Engine, Application Invocation Contract, and Ecosystem Capability Boundary so that the application engine can later be retained in TypeScript or replaced by Kotlin/JVM without redefining AppManager's conceptual architecture.**

Option 3 remains a strong strategic candidate for a future major-version architecture, but it is no longer recommended as the immediate implementation route.

## 2. Governing Context

The Architecture Decision Governance requires project-wide language, runtime, framework, platform, communication, deployment, and packaging choices to be evaluated deliberately against project requirements rather than inherited automatically from historical implementation.

The AppManager documentation hierarchy additionally requires the root Design Specification to describe enduring target-system architecture rather than migration mechanics or temporary implementation state. Technology reviews and migration planning remain non-normative until deliberately approved and propagated into the appropriate specification levels.

The root AppManager Design Specification establishes several constraints that materially affect this technology decision:

- AppManager is a domain-oriented management application for Nuxt monorepos and Nuxt layers;
- commands and application capabilities must remain independent of presentation modes and host-tool integrations;
- TUI, Headless, GUI, IDE, and other adapters should reuse shared application capabilities;
- the Application Invocation Contract provides a stable structured boundary between callers and the command model without prescribing transport or process topology;
- code inspection and controlled source transformation should use structured code-intelligence mechanisms rather than fragile global text replacement;
- generation is conceptually distinct from mutation of existing source;
- AppManager must remain extensible as commands, file types, providers, project structures, interaction modes, and host-tool integrations evolve;
- a WebStorm plugin is the first proposed IDE integration, but the application architecture must not become dependent upon WebStorm or JetBrains tooling.

The technology architecture must therefore optimise the whole AppManager system rather than merely the current CLI implementation or the proposed WebStorm plugin.

## 3. Evaluation Criteria

The options are evaluated against the criteria established by ADR governance and the specific requirements of AppManager:

- architectural fit and responsibility separation;
- fit with the Nuxt, Vue, JavaScript, and TypeScript ecosystems;
- command/domain modelling and type safety;
- Application Invocation Contract implementation;
- TUI and Headless operation;
- GUI and host-tool extensibility;
- WebStorm and broader JetBrains integration;
- portability across supported development environments;
- distribution and installation;
- runtime and process model;
- startup characteristics and resource use;
- reliability and failure isolation;
- security and attack surface;
- code-intelligence and source-transformation capability;
- ecosystem and library suitability;
- testing and observability;
- build-system and dependency complexity;
- maintainability and architectural evolvability;
- contributor and AI-assisted development accessibility;
- migration cost and preservation of existing work;
- reversibility and technology lock-in;
- long-term project risk;
- quality of evidence available at the time a technology decision is made.

Developer familiarity is not treated as a decisive criterion. LLM-assisted development reduces the importance of selecting a language solely because it is already familiar. It does not remove the engineering significance of runtime behaviour, build systems, dependency management, packaging, process topology, framework evolution, or operational complexity.

## 4. Current External Technology Context

As of September 2026, Kotlin/JVM is a stable platform and Kotlin 2.4.20 is the current released Kotlin version. Kotlin's standard JVM runtime, coroutines, serialization support, and Gradle tooling are stable components.

JetBrains continues to recommend the IntelliJ Platform Gradle Plugin for IntelliJ-platform plugin development. WebStorm is an IntelliJ-platform product, and plugin development can use Kotlin while integrating with actions, services, tool windows, project context, editor context, and other IDE APIs. Kotlin/JVM is therefore a natural technology for a native WebStorm adapter, although this does not require the whole AppManager application to execute inside the IDE.

The JetBrains platform evolves independently. API compatibility remains an ongoing maintenance concern. AppManager's application architecture should therefore not become unnecessarily coupled to IntelliJ APIs merely because Kotlin may be selected for a future application engine.

Nuxt 4 remains fundamentally a JavaScript/TypeScript ecosystem. Nuxt modules are defined in JavaScript/TypeScript and interact with Nuxt through Nuxt Kit and the Nuxt runtime/build context. Nuxt also generates TypeScript configuration and declaration information for tooling. Direct access to ecosystem-native parsers, compilers, AST tooling, Vue tooling, package metadata, and Nuxt-specific libraries is materially easier from JavaScript/TypeScript than from a JVM-only process.

This creates a genuine architectural tension rather than a simple language preference: Kotlin/JVM remains attractive for a durable application engine and JetBrains integration, while Node.js/TypeScript has privileged access to the ecosystem AppManager exists to manage.

The revised direction recognises a second consideration: **AppManager has not yet produced enough mature operational evidence to justify paying the full complexity cost of a dual-runtime architecture now.**

## 5. Option 1 — Node.js/TypeScript Throughout

### 5.1 Architecture

Under a naive interpretation of Option 1, AppManager would simply remain a Node.js application written in TypeScript and allow application policy, command logic, ecosystem tooling, presentation concerns, and source transformation to evolve within the same runtime without strong internal boundaries.

That interpretation is **not** the revised recommendation.

For AppManager v1, Option 1 should instead be implemented as a deliberately partitioned single-runtime architecture:

```text
                    AppManager v1

interaction adapters
        |
        v
Application Invocation Contract
        |
        v
TypeScript AppManager Application Engine
        |
        v
Ecosystem Capability Contract
        |
        v
Node.js/TypeScript Ecosystem Capabilities
        |
        v
managed Nuxt project
```

The two lower boxes may execute in the same Node.js process and may initially bind through normal in-process calls. The architectural separation is semantic rather than process-driven.

### 5.2 Strengths

Option 1 has the lowest migration cost because it preserves the current implementation technology and maximises reuse of existing TypeScript work.

It provides direct access to the Nuxt/Vue/JavaScript/TypeScript ecosystem. Code intelligence, AST processing, Nuxt configuration inspection, package management, generated Nuxt types, Vue single-file-component tooling, and ecosystem libraries can be consumed without crossing a runtime boundary.

A single runtime substantially simplifies local development, package management, testing, dependency management, debugging, CI, release engineering, and distribution during the stage in which AppManager's functional surface and true subsystem boundaries are still being discovered.

TypeScript is capable of expressing the required command, service, resolver, registry, invocation-contract, capability-contract, and domain models. Nothing in the current Design Specification inherently requires the JVM.

Most importantly, v1 can validate architectural seams through real use before those seams become cross-runtime contracts that are expensive to change.

### 5.3 Weaknesses

The principal weakness is architectural complacency. Because application logic and ecosystem-native tooling can coexist in one runtime, there is little technical friction preventing accidental coupling.

Without explicit controls, application policy could begin depending directly on TypeScript compiler objects, Nuxt implementation details, Vue AST structures, process-specific assumptions, terminal output, or arbitrary script behaviour. Such coupling would make any later runtime substitution much more expensive.

A WebStorm plugin would also introduce Kotlin/JVM as a second ecosystem even if AppManager itself remains TypeScript. If the application boundary is poorly defined, pressure could arise to duplicate domain behaviour in the plugin or to expose internal Node implementation details to the IDE.

### 5.4 Revised Assessment

Option 1 is now the preferred **v1 implementation route**, but only if it is accompanied by strong architectural boundary discipline.

The aim is not to defer architecture until v2. The aim is to establish the correct architecture in v1 while deferring the runtime split until evidence demonstrates that the split provides sufficient benefit.

## 6. Option 2 — Kotlin/JVM Application

### 6.1 Architecture

Under Option 2, the AppManager application engine and most or all ecosystem-facing capabilities migrate to Kotlin/JVM.

```text
interaction adapters
        |
        v
Application Invocation Contract
        |
        v
Kotlin/JVM command/domain/application engine
        |
        +--------------------+
        |                    |
        v                    v
services / repositories   JVM code intelligence
        |                    |
        +---------+----------+
                  |
                  v
           managed Nuxt project
```

Node.js would be treated primarily as an external tool required by managed Nuxt projects rather than as an AppManager implementation runtime.

### 6.2 Strengths

Kotlin provides a strong statically typed language for modelling commands, domain concepts, results, configuration, state, asynchronous workflows, and application boundaries. Kotlin/JVM is stable and benefits from mature JVM tooling, testing, concurrency, serialization, filesystem, process, networking, and packaging ecosystems.

The WebStorm plugin can share language, build tooling, and potentially selected non-IDE modules with the AppManager engine. This reduces conceptual impedance between a native JetBrains adapter and the application it invokes.

A Kotlin engine also creates a natural separation from the managed TypeScript project. AppManager's own application model is less likely to become accidentally entangled with Nuxt implementation details merely because both execute in Node.

### 6.3 Weaknesses

The decisive weakness is ecosystem impedance.

AppManager is intended to understand and manipulate Nuxt, Vue, JavaScript, and TypeScript projects. Reimplementing ecosystem-native analysis and transformation on the JVM would require alternative JVM parsers and models, direct use of IDE-specific PSI, external Node subprocesses hidden behind individual features, or custom compatibility work.

Using IntelliJ PSI as the general AppManager code-intelligence engine would make core functionality depend upon JetBrains platform availability, undermine Headless portability, and violate the requirement that WebStorm remain a host integration rather than the owner of AppManager behaviour.

A JVM-only design would therefore either accept reduced ecosystem fidelity or gradually recreate a Node bridge anyway.

### 6.4 Assessment

Option 2 is not recommended. It optimises runtime uniformity at the cost of direct participation in the ecosystem AppManager must inspect and transform.

## 7. Option 3 — Kotlin/JVM Application Engine with Node.js/TypeScript Capability Provider

### 7.1 Architecture

Option 3 is intentionally asymmetric. It does not propose two peer application runtimes.

Kotlin/JVM becomes the authoritative AppManager **Application Engine** and owns application-level semantics, policy, lifecycle, command/use-case coordination, and orchestration. Node.js/TypeScript is a subordinate **Ecosystem Capability Provider** that performs explicitly requested operations whose correctness or maintainability materially benefits from direct participation in the Nuxt/Vue/JavaScript/TypeScript ecosystem.

```text
                 interaction adapters
      tui   headless   gui   webstorm / tools
                      |
                      v
         Application Invocation Contract
                      |
                      v
        Kotlin/JVM AppManager Application Engine
                      |
                      v
        internal Ecosystem Capability Contract
                      |
                      v
      Node.js/TypeScript Capability Provider
                      |
                      v
               managed project
```

The dependency and control direction is deliberate:

```text
Kotlin AppManager Application Engine
              |
              v
    requested specialist capability
              |
              v
Node.js/TypeScript Capability Provider
```

The Node provider is an implementation resource of the AppManager engine, not a second application authority.

### 7.2 Responsibility and Authority Allocation

If Option 3 is adopted later, the Kotlin/JVM Application Engine should own responsibilities whose semantics belong to AppManager rather than to the managed JavaScript ecosystem, including:

- application bootstrap and lifecycle;
- command identity, discovery, dispatch, and use-case coordination;
- domain models and domain engines whose rules are not intrinsically JavaScript-runtime dependent;
- project and layer management semantics;
- configuration-resolution policy;
- repository-management policy and coordination;
- safety, confirmation, dry-run, and non-destructive-operation policy;
- Application Invocation Contract semantics;
- structured application-level result, diagnostic, progress, and cancellation models;
- orchestration and ordering across application capabilities;
- permission and scope decisions for capability invocations;
- timeouts, retries, cancellation, and failure interpretation at application level;
- mutation approval, transaction coordination, preview, commit, and rollback policy where applicable;
- presentation-independent use cases;
- host-integration contracts;
- general application infrastructure where JVM implementation is advantageous.

The Node.js/TypeScript capability provider should own computation whose correctness or maintainability materially benefits from direct ecosystem access, such as:

- TypeScript AST parsing and transformation;
- Vue single-file-component parsing and transformation;
- Nuxt-native project or configuration inspection where ecosystem libraries provide authoritative behaviour;
- JavaScript/TypeScript module-resolution tasks where ecosystem semantics matter;
- scanners and strategies tightly coupled to ecosystem ASTs or compiler models;
- transformations using ecosystem-native libraries;
- extraction of structured code-intelligence facts for consumption by the Application Engine.

The distinction is between **application decision authority** and **ecosystem-native computation**.

> The Node.js/TypeScript provider may perform ecosystem-native computation, but it must not own AppManager application policy or workflow authority.

### 7.3 Internal Ecosystem Capability Contract

The public Application Invocation Contract and internal Ecosystem Capability Contract are separate boundaries:

```text
external caller
      |
      v
Application Invocation Contract
      |
      v
AppManager Application Engine
      |
      v
Ecosystem Capability Contract
      |
      v
Ecosystem Capability Provider
```

The first boundary expresses AppManager commands and use cases. The second expresses narrowly scoped ecosystem operations required to realise those use cases.

Capability inputs and outputs may eventually include structured records, JSON-like documents, blobs, streams, diagnostics, progress events, cancellation signals, or other typed data. A capability may be realised by a short-lived Node process, long-lived capability host, or another binding. Those choices are Detailed Design and Implementation concerns, not high-level architectural requirements.

### 7.4 Capability Granularity and Data Ownership

The capability boundary should remain coarse-grained.

A poor design would expose compiler implementation details across the boundary:

```text
get AST node
get child
get symbol
get parent
replace node
```

A stronger design requests meaningful ecosystem operations:

```text
inspect Nuxt project
analyse imports
find layer references
inspect component dependencies
propose import rewrite
apply defined transformation
```

Compiler-native objects should remain within the ecosystem provider where practical. The Application Engine should consume stable AppManager-oriented facts, diagnostics, plans, or outcomes rather than remotely traversing a TypeScript or Vue compiler model.

### 7.5 WebStorm Integration

A future WebStorm plugin can be a native Kotlin IntelliJ-platform adapter gathering IDE-specific context such as project, selected file, selected directory, active editor, repository, or selected layer.

It should invoke the same AppManager application semantics used by other adapters. It must not become the owner of repository policy, configuration rules, command semantics, layer lifecycle, or source-transformation policy.

The plugin should not need to understand whether an AppManager capability is implemented directly by the engine or delegated to an ecosystem provider.

> WebStorm is a first-class AppManager interaction environment, not the AppManager runtime itself.

### 7.6 Strengths

Option 3 aligns technology boundaries with responsibility boundaries rather than forcing one language to be optimal for unrelated concerns.

It preserves high-fidelity Nuxt/Vue/TypeScript tooling while allowing the durable AppManager engine to be implemented independently of Node framework conventions.

It makes control delegation unambiguous: Kotlin owns application decisions; Node performs specialist ecosystem computation.

It improves fault-isolation possibilities, supports future provider replacement, fits native WebStorm integration, and remains extensible to other adapters and specialist runtimes.

### 7.7 Weaknesses and Costs

Option 3 is the most operationally complex option.

It introduces two implementation ecosystems, dependency graphs, build toolchains, and potentially runtime processes. Packaging, version compatibility, local development, CI, release engineering, diagnostics, debugging, lifecycle management, cancellation, and testing all become more complex.

The internal capability contract becomes a critical architectural surface. If introduced too early, before real AppManager workflows validate its granularity, it may encode incorrect assumptions and become expensive to change.

This is the principal reason Option 3 is now deferred rather than rejected.

## 8. Comparative Assessment

| Criterion | Option 1: disciplined TypeScript v1 | Option 2: Kotlin/JVM only | Option 3: Kotlin engine + Node provider |
|---|---|---|---|
| Nuxt/Vue/TypeScript ecosystem fidelity | Very Strong | Weak | Very Strong |
| Durable command/domain modelling | Strong | Very Strong | Very Strong |
| WebStorm native integration | Moderate | Very Strong | Very Strong |
| IDE-independent Headless code intelligence | Very Strong | Moderate | Very Strong |
| Architectural isolation of ecosystem concerns | Strong if explicitly enforced | Strong | Very Strong |
| Single-runtime simplicity | Very Strong | Very Strong | Weak |
| Build/dependency simplicity | Very Strong | Strong | Weak |
| Distribution simplicity | Very Strong | Strong | Moderate/Weak |
| Fault-isolation potential | Moderate | Moderate | Strong |
| Existing-code reuse | Very Strong | Weak | Strong |
| Near-term migration cost | Very Strong | Weak | Moderate/Weak |
| Multi-host extensibility | Strong | Strong | Very Strong |
| Risk of ecosystem reimplementation | Very Low | High | Very Low |
| Risk of duplicated application logic | Low if v1 boundaries are enforced | Moderate | Low if authority boundary is enforced |
| Quality of evidence available today | High | Moderate | Moderate |
| Long-term architectural potential | Strong | Moderate/Strong | Very Strong |

The revised comparison separates **best immediate development route** from **best plausible mature architecture**.

Option 1 now wins the v1 decision because it combines ecosystem fidelity, existing-code reuse, development speed, low operational complexity, and the ability to validate boundaries in-process.

Option 3 remains the strongest candidate if later evidence shows that AppManager benefits materially from replacing the TypeScript Application Engine with Kotlin/JVM.

## 9. Architectural Boundaries Required in v1

The most important output of this review is not a language choice. It is a set of architectural boundaries that v1 should establish regardless of whether a Kotlin migration ever occurs.

### 9.1 Application Engine

AppManager should have a clearly identifiable **Application Engine** responsibility that owns:

- command and use-case coordination;
- application policy;
- domain semantics;
- repository and project coordination;
- safety rules;
- mutation policy;
- application-level diagnostics and outcomes;
- orchestration across lower-level capabilities.

For v1 this engine is implemented in TypeScript.

### 9.2 Application Invocation Contract

Interaction adapters should invoke shared AppManager semantics through a structured Application Invocation Contract rather than depending on human-oriented CLI output or presentation-specific behaviour.

This boundary should remain independent of whether the engine is implemented in TypeScript or Kotlin.

### 9.3 Ecosystem Capability Boundary

Nuxt/Vue/JavaScript/TypeScript ecosystem-native mechanics should be encapsulated behind a capability-oriented boundary even while both sides execute in the same Node.js process.

The application engine should not depend directly on compiler-specific AST object graphs or presentation output from ecosystem tooling.

### 9.4 Structured Results and Diagnostics

Capabilities should return structured facts, diagnostics, transformation plans, results, or other machine-consumable information. Human formatting belongs to an adapter or presentation layer.

### 9.5 Presentation Independence

TUI, Headless, GUI, WebStorm, CI, and future integrations should not become independent implementations of AppManager business logic.

### 9.6 Testing at Contract Boundaries

Tests should increasingly validate use-case semantics and contract behaviour rather than incidental source wiring. This makes a future engine substitution materially safer.

## 10. Why Deferring Kotlin Reduces Risk

Moving to Kotlin immediately would require AppManager to solve two large problems at once:

1. determine the complete, correct functional and architectural shape of AppManager; and
2. determine the correct cross-runtime partition and operational mechanics of a Kotlin/Node application.

The first problem is still evolving. Therefore the second currently lacks sufficient empirical evidence.

A mature TypeScript v1 can reveal:

- which application responsibilities remain stable across features;
- which capabilities genuinely require ecosystem-native execution;
- the natural granularity of code-intelligence operations;
- actual performance and startup bottlenecks;
- concurrency and cancellation needs;
- the real value of WebStorm and other host integrations;
- how much application policy genuinely sits outside the JS ecosystem;
- whether TypeScript creates a material maintainability limitation in the engine at all.

A later technology review can therefore compare the cost of Kotlin against evidence rather than architectural expectation.

## 11. Development and Migration Direction

### 11.1 v1 Development Direction

AppManager v1 should continue in Node.js/TypeScript.

Development should not, however, continue as an undifferentiated TypeScript application. Existing and new code should be rationalised according to responsibility:

```text
existing / new TypeScript capability
          |
          +--> AppManager application/domain responsibility
          |        |
          |        v
          |   TypeScript Application Engine
          |
          +--> Nuxt/Vue/JS/TS ecosystem-native responsibility
          |        |
          |        v
          |   Ecosystem Capability implementation
          |
          +--> obsolete / superseded / accidental structure
                   |
                   v
              retire rather than preserve
```

The goal is a complete, coherent, tested v1 architecture in which the seam between application authority and ecosystem-native mechanics is explicit even though no process boundary is required.

### 11.2 Future Major-Version Review

Kotlin/JVM should be treated as a **strategic candidate for a future major-version Application Engine**, not as a pre-committed migration.

The project should perform a new architecture review after v1 has reached sufficient functional maturity to provide evidence. That review should ask at least:

- Is the TypeScript Application Engine materially limiting maintainability, correctness, modelling, concurrency, integration, or extensibility?
- Does WebStorm or broader JetBrains integration create enough value to justify a Kotlin engine?
- Are the application/capability boundaries proven stable enough to cross a runtime boundary?
- Can the distribution and lifecycle costs of two runtimes be justified?
- Would retaining the TypeScript engine provide equivalent value at lower complexity?

A major-version boundary such as `2.0.0` would be a natural opportunity for such a change if compatibility and distribution consequences warrant it, but **Kotlin must not be promised merely because a future major version exists**.

Semantic versioning should describe compatibility; it should not force a technology migration.

### 11.3 If Kotlin Is Later Adopted

If future evidence supports Option 3, the desired transition is conceptually:

```text
                 v1

Application Invocation Contract
        |
        v
TypeScript Application Engine
        |
        v
Ecosystem Capability Contract
        |
        v
TypeScript Ecosystem Capabilities

                 |
                 | engine substitution
                 v

             future architecture

Application Invocation Contract
        |
        v
Kotlin/JVM Application Engine
        |
        v
Ecosystem Capability Contract
        |
        v
Node.js/TypeScript Ecosystem Capabilities
```

The intent is therefore not a wholesale rewrite of AppManager. It is, if warranted, a substitution of the Application Engine implementation behind already-validated boundaries.

Exact component migration order, implementation waves, temporary compatibility arrangements, and progress tracking belong to Implementation Specifications and project-management planning, not the root Design Specification or permanent Detailed Design.

## 12. Security and Reliability Considerations

The v1 single-runtime approach reduces operational attack surface relative to introducing another managed runtime immediately, but the same architectural safety principles should be established now.

Ecosystem capabilities should operate only within explicitly resolved project scope and should not receive unrestricted application authority.

Nuxt inspection can involve executing project-controlled JavaScript. Functional and Detailed Design should distinguish static inspection from execution-capable inspection and make trust boundaries explicit.

The Application Engine should remain the authority for safety and mutation coordination. Ecosystem-native code should report facts, plans, diagnostics, and outcomes rather than independently determining project-wide safety policy.

If a future Node capability provider becomes out-of-process, the same boundary can be extended with explicit lifecycle, timeout, cancellation, integrity, and failure-isolation semantics.

## 13. Distribution and Packaging Considerations

For v1, remaining in Node.js/TypeScript avoids prematurely introducing dual-runtime installation and packaging complexity.

If Option 3 is reconsidered later, the review must evaluate:

- whether users install supported JVM and Node.js runtimes independently;
- whether one or both runtimes should be bundled or provisioned;
- platform-specific packaging for Windows, macOS, and Linux where supported;
- version compatibility between engine and provider;
- upgrade and rollback behaviour;
- WebStorm plugin-to-engine discovery;
- offline operation where practical;
- CI installation and caching;
- integrity verification of bundled runtime components.

These costs should be measured against the demonstrated benefits of a Kotlin engine rather than assumed acceptable in advance.

## 14. Reversibility

The revised direction maximises reversibility.

If the v1 boundaries are correctly designed, the project retains at least two future choices:

```text
complete TypeScript v1
        |
        +--> retain and continue improving TypeScript Application Engine
        |
        +--> replace Application Engine with Kotlin/JVM
                 while preserving ecosystem capabilities
```

The architecture should make both routes legitimate.

A decision to remain in TypeScript after v1 should not be treated as failure to execute a previous Kotlin plan. It may instead be the evidence-based conclusion that the additional runtime no longer provides sufficient value.

Likewise, if Kotlin becomes justified, the established Invocation and Capability boundaries should reduce migration cost substantially.

## 15. Revised Recommendation

### 15.1 Immediate Development Route

This review now recommends **Option 1 for AppManager v1: continue development in Node.js/TypeScript**.

This recommendation is conditional on adopting the architectural boundary discipline exposed by the Option 3 analysis.

The project should not interpret Option 1 as permission to merge application policy, presentation logic, compiler-specific objects, and ecosystem-native transformations indiscriminately within the same code paths.

### 15.2 Required v1 Architectural Direction

The v1 architecture should establish, at minimum:

- a distinct AppManager Application Engine responsibility;
- a presentation-independent Application Invocation Contract;
- a distinct Ecosystem Capability Boundary;
- capability-oriented, structured operations rather than arbitrary process output or script escape hatches;
- stable AppManager-oriented facts, diagnostics, plans, and outcomes at the capability boundary;
- clear separation between application decision authority and ecosystem-native computation;
- test coverage that validates contract and use-case behaviour;
- thin interaction adapters, including any future WebStorm integration.

### 15.3 Strategic Technology Position

Kotlin/JVM remains the leading candidate for a future alternative Application Engine if later evidence demonstrates sufficient architectural or operational benefit.

The project should **re-evaluate**, not pre-commit to, Option 3 at an appropriate future major-version architecture review.

### 15.4 Proposed ADR Decision Statement

The subsequent ADR should consider recording the following decision in substance:

> AppManager v1 will continue to use Node.js/TypeScript as its implementation technology. The v1 architecture will establish explicit separation between the AppManager Application Engine, the public Application Invocation Contract, and bounded ecosystem-native capabilities. Ecosystem-specific Nuxt/Vue/JavaScript/TypeScript mechanics will be encapsulated behind structured capability boundaries rather than allowed to define application policy. Kotlin/JVM will remain a strategic candidate for a future Application Engine and will be reconsidered only after v1 provides sufficient operational evidence to evaluate the benefit of a runtime split. No future Kotlin migration is mandated by this decision.

## 16. Rejected Simplifications

The revised recommendation rejects the following interpretations:

- **"Stay in TypeScript and worry about architecture later."** The runtime stays; the architectural rationalisation happens now.
- **"Kotlin is the decided v2 implementation."** It is a candidate, not a promise.
- **"The current TypeScript source tree defines the future architecture."** Existing code is evidence and migration material, not automatic design authority.
- **"Kotlin because WebStorm uses Kotlin."** A WebStorm plugin alone does not justify replacing the application engine.
- **"Keep everything TypeScript because Nuxt is TypeScript."** Ecosystem affinity does not justify coupling all application responsibilities to ecosystem-native mechanisms.
- **"Use IntelliJ PSI as AppManager's general code-intelligence engine."** Portable Headless capabilities must not depend on a running JetBrains IDE.
- **"Call arbitrary scripts from the application engine."** Ecosystem operations should be governed capabilities with structured semantics.
- **"Expose compiler ASTs as application-domain objects."** Compiler-native implementation models should remain behind the ecosystem boundary where practical.
- **"Rewrite all TypeScript into Kotlin when v2 starts."** Any future migration should be responsibility-driven and evidence-based, not mechanical.

## 17. Downstream Design Questions

The architecture review does not need to settle every lower-level mechanism before the near-term technology decision.

### 17.1 v1 Functional and Detailed Design Questions

The project should define or refine:

- Application Engine responsibilities and boundaries;
- Application Invocation Contract behaviour;
- Ecosystem Capability Contract semantics;
- capability granularity;
- structured diagnostics and application results;
- progress and cancellation semantics where required;
- source-transformation safety and transaction models;
- Headless and presentation parity;
- optional IDE-host capability semantics where justified;
- contract-oriented testing strategy.

### 17.2 v1 Implementation Questions

Implementation work should decide:

- concrete TypeScript module/package structure;
- actual interfaces and symbols;
- in-process binding between engine and ecosystem capabilities;
- concrete libraries and parser/compiler integrations;
- source and build wiring;
- migration mechanics for current modules;
- component conversion order and implementation sequencing.

### 17.3 Future Option 3 Questions

Only if Kotlin/JVM is reconsidered later will the project need to settle matters such as:

- JVM baseline and Kotlin version policy;
- Gradle module structure;
- Kotlin-to-Node serialization and transport binding;
- process topology and capability-provider lifecycle;
- capability discovery and version negotiation;
- cross-runtime concurrency, backpressure, progress, and cancellation;
- dual-runtime packaging and bundling;
- distributed logging and diagnostic correlation;
- WebStorm plugin compatibility policy and supported versions.

These questions should not burden v1 unless a real requirement independently makes them necessary.

## 18. Decision Readiness

The review is now sufficiently mature to support an ADR for the near-term technology direction.

The original analysis established that Option 3 offers a compelling possible mature architecture. The subsequent review established that adopting its **boundaries** now is more valuable than adopting its **runtime split** now.

The decisive reasoning is:

1. TypeScript currently provides the strongest ecosystem fit and maximum reuse.
2. AppManager's functional surface and internal capability granularity are still being validated.
3. Cross-runtime contracts are materially more expensive to change than in-process TypeScript boundaries.
4. A disciplined TypeScript v1 can validate those boundaries using real application behaviour.
5. Once validated, the Application Engine can be retained or replaced without redefining the rest of the system.
6. A later Kotlin decision can then be based on measured architectural benefit rather than anticipation.

The next governance step should therefore be a **Proposed ADR for the v1 application technology direction and future technology-review strategy**.

Acceptance of such an ADR should result in only the enduring architectural consequences being incorporated into the root Design Specification. Functional and Detailed Design specifications should then define the required Invocation and Capability boundaries. Concrete TypeScript module structure and current-code migration belong to Implementation Specifications and project-management planning.

## 19. References

Project sources:

- [Project Documentation Guide](../project-documentation-guide-v01.md)
- [AppManager Design Specification](../appmanager-design-specification-v01.md)
- [Architecture Decision Governance](decisions/architecture-decision-governance-v01.md)
- [ADR Template](decisions/adr-template.md)

External evidence consulted for this review:

- Kotlin release and component-stability documentation;
- JetBrains IntelliJ Platform Plugin SDK documentation, including plugin-development and compatibility guidance;
- Nuxt 4 documentation covering modules and ecosystem integration.

External references are supporting evidence only. The eventual project decision derives its authority from the approved ADR and resulting AppManager specifications.