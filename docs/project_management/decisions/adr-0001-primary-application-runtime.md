# ADR-0001: Primary Application Runtime for AppManager Version 1

> **Status:** Accepted
> **Date:** 2026-09-12
> **Related specifications:** [AppManager Design Specification](../../appmanager-design-specification-v01.md); future AppManager Functional, Detailed Design, and Implementation Specifications affected by runtime or ecosystem-capability implementation
> **Supersedes:** None
> **Superseded by:** None

## Context

AppManager is being developed to manage Nuxt monorepos and Nuxt layers while remaining independent of any one interaction mode or host integration. Its Version 1 root Design Specification establishes an authoritative Application Engine, a presentation-independent Application Invocation Contract, application capability coordination, and capability boundaries through which specialist or ecosystem-native work may be delegated without transferring AppManager application authority.

The existing implementation is Node.js/TypeScript. That historical fact is not sufficient by itself to make Node.js/TypeScript an approved architectural choice. AppManager's decision governance requires significant project-wide language and runtime choices to be evaluated deliberately rather than inherited from implementation history or developer familiarity.

A technology architecture review therefore evaluated whether AppManager should continue in Node.js/TypeScript, migrate the primary application to Kotlin/JVM, or adopt a hybrid architecture with a Kotlin/JVM Application Engine and a bounded Node.js/TypeScript ecosystem capability provider.

The review found a genuine architectural tension. Kotlin/JVM offers strong application modelling and natural alignment with a future native JetBrains/WebStorm adapter, while Node.js/TypeScript provides direct access to the Nuxt, Vue, JavaScript, and TypeScript ecosystem that AppManager must inspect, understand, and transform.

It also found that AppManager has not yet accumulated enough mature operational evidence to justify the additional build, packaging, process, compatibility, testing, debugging, and release complexity of a dual-runtime architecture for Version 1.

A durable decision is required before Functional, Detailed Design, and Implementation Specifications begin reducing the Version 1 architecture to concrete technology choices.

## Decision Drivers

The material decision drivers are:

- direct and high-fidelity access to Nuxt, Vue, JavaScript, and TypeScript ecosystem tooling;
- preservation of the Version 1 Application Engine and Application Invocation Contract architecture;
- prevention of accidental coupling between AppManager application policy and ecosystem-native implementation representations;
- ability to support TUI, Headless, GUI, IDE, and host-tool adapters without duplicating application semantics;
- code-intelligence and source-transformation requirements;
- development, testing, packaging, CI, debugging, and distribution complexity;
- preservation and reuse of existing TypeScript implementation work where consistent with approved design;
- reversibility and avoidance of unnecessary technology lock-in;
- ability to introduce a future Kotlin/JVM Application Engine without redefining AppManager's conceptual architecture;
- insufficient current evidence to justify the operational cost of a dual-runtime Version 1 implementation.

## Considered Options

### Option 1 — Node.js/TypeScript throughout

Continue using Node.js/TypeScript for the AppManager application and ecosystem-facing capabilities.

A naive form of this option, in which application policy, presentation concerns, ecosystem tooling, and source transformation are allowed to couple freely because they share one runtime, was rejected.

The viable form of this option deliberately preserves semantic architectural boundaries even when those boundaries are implemented in-process within one Node.js runtime.

### Option 2 — Kotlin/JVM application

Move the primary AppManager application and most ecosystem-facing functionality to Kotlin/JVM.

This provides a strong application language and good JetBrains alignment, but creates substantial impedance with the Nuxt/Vue/JavaScript/TypeScript ecosystem. A JVM-only approach would either reduce ecosystem fidelity, introduce JetBrains-platform coupling into core capabilities, or gradually recreate a Node bridge through individual features.

### Option 3 — Kotlin/JVM Application Engine with Node.js/TypeScript ecosystem capability provider

Use Kotlin/JVM for the authoritative Application Engine and retain Node.js/TypeScript as a subordinate provider of bounded ecosystem-native capabilities.

This remains architecturally credible and may become advantageous in a future major version. For Version 1, however, it introduces a second implementation ecosystem and makes the internal capability contract a cross-runtime boundary before real AppManager workflows have sufficiently validated its required granularity and semantics.

The detailed comparative analysis is retained in [docs/project_management/technology-architecture-review-v01.md](../technology-architecture-review-v01.md).

## Decision

AppManager Version 1 will use **Node.js and TypeScript as its primary application implementation technology**.

This decision does **not** approve an undifferentiated TypeScript architecture. Version 1 must preserve the architectural boundaries established by the root Design Specification:

```text
interaction adapters
        |
        v
Application Invocation Contract
        |
        v
TypeScript Application Engine
        |
        v
application capability coordination
        |
        +---------------------------+
        |                           |
        v                           v
AppManager-owned capabilities   capability boundaries
                                    |
                                    v
                            capability providers
```

Where ecosystem-native capabilities are implemented in Node.js/TypeScript, sharing the same runtime or process with the Application Engine must not collapse the semantic boundary between AppManager application authority and specialist ecosystem computation.

Application policy, command and use-case semantics, workflow coordination, managed-scope interpretation, safety rules, and final application outcomes remain responsibilities of the Application Engine. Ecosystem-native parsers, compiler objects, framework representations, provider SDKs, or similar implementation details must not become general AppManager application semantics merely because the Version 1 implementation can access them directly.

The Version 1 architecture should therefore validate stable AppManager-oriented capability seams through real use before any future decision turns those seams into cross-runtime contracts.

Kotlin/JVM is **not selected for the Version 1 Application Engine**. It remains a credible future candidate rather than a promised migration target.

A future move to Kotlin/JVM, a hybrid runtime, or another primary application technology requires a new architecture review where appropriate and a new ADR that supersedes this decision. Semantic-versioning or major-version boundaries may provide an opportunity for such reconsideration, but do not themselves require a runtime change.

## Consequences

### Positive consequences

- Version 1 retains direct access to the Nuxt/Vue/JavaScript/TypeScript ecosystem.
- Existing TypeScript implementation work can be reused where it conforms to approved specifications.
- AppManager avoids premature dual-runtime build, packaging, process, testing, debugging, and distribution complexity.
- Architectural seams can be validated against real workflows before becoming expensive cross-runtime contracts.
- The Application Engine and capability-boundary architecture remains independent of the fact that Version 1 uses one primary runtime.
- A future Kotlin/JVM or hybrid architecture remains possible without redefining AppManager's conceptual authority model.

### Negative consequences and risks

- A single TypeScript runtime creates little technical friction against accidental coupling, so architectural discipline must be enforced deliberately.
- Application code may be tempted to depend directly on TypeScript compiler, Vue, Nuxt, Node process, or other ecosystem-native representations.
- A future native WebStorm adapter is likely to introduce Kotlin/JVM into the wider system even while the Application Engine remains TypeScript.
- If a later runtime split is justified, implementation work will still be required to formalise and transport capability contracts that Version 1 may initially realise in-process.

### Required architectural discipline

Detailed Design and Implementation work must:

- preserve the Application Engine as the authoritative application boundary;
- preserve the Application Invocation Contract as the shared semantic invocation boundary;
- keep specialist ecosystem mechanics behind AppManager-oriented capability responsibilities where appropriate;
- avoid leaking compiler-native, framework-native, provider-native, or transport-native representations into general application semantics;
- keep interaction adapters thin and prevent host integrations from duplicating AppManager business logic;
- treat any future process or runtime separation as a lower-level realisation of established semantic boundaries rather than as the source of those boundaries.

## Specification Impact

The principal high-level architectural consequences are already represented in [AppManager Design Specification](../../appmanager-design-specification-v01.md), which deliberately defines the Application Engine, Application Invocation Contract, capability boundaries, provider delegation, and topology independence without making Node.js/TypeScript itself an enduring conceptual requirement of AppManager.

This ADR provides the decision provenance for using Node.js/TypeScript when the Version 1 architecture is reduced to concrete technical design and implementation.

Future specifications should apply the decision at the appropriate level:

- **Functional Specifications** should normally remain technology-independent unless a user-visible requirement genuinely depends on the runtime decision.
- **Detailed Design Specifications** may define permanent contracts, dependency boundaries, lifecycle semantics, and provider abstractions necessary to preserve the architectural separation established by the root Design Specification.
- **Implementation Specifications** may prescribe the concrete Node.js/TypeScript modules, packages, libraries, build wiring, entry points, source locations, and in-process or other bindings used to realise the approved Detailed Design.

This ADR does not mandate a Node.js/TypeScript ecosystem capability provider as a separate process, package, executable, or deployment unit. Any such topology is a Detailed Design and Implementation decision unless a later architectural decision elevates it.

## References

- [docs/project_management/technology-architecture-review-v01.md](../technology-architecture-review-v01.md) — comparative architecture review and revised recommendation.
- [AppManager Design Specification](../../appmanager-design-specification-v01.md) — authoritative Version 1 root Design Specification.
- [Project Documentation Guide](../../project-documentation-guide-v01.md) — documentation hierarchy and decision-governance authority.
- [Architecture Decision Governance](architecture-decision-governance-v01.md) — ADR lifecycle and technology-selection governance.
