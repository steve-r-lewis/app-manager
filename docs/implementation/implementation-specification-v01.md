# AppManager Implementation Specification

> **Document type:** Level 4 Implementation Specification overview and register
>
> **Status:** Version 1 implementation-specification baseline authored and reconciled
>
> **Governing plan:** [Implementation Specification Plan](../project_management/implementation-specification-plan-v01.md)
>
> **Selection method:** [Implementation Specification Map](../project_management/implementation-specification-map-v01.md)
>
> **Reconciliation record:** [Implementation Specification Conformance and Reconciliation](../project_management/implementation-specification-conformance-reconciliation-v01.md)

## 1. Purpose

This document is the entry point and canonical register for the Version 1 AppManager Implementation Specifications.

It records the concrete implementation responsibilities that have their own specification before the approved Detailed Design is reduced to code. All 23 primary Version 1 specifications are authored under `docs/implementation/` and together form the reconciled Level 4 implementation baseline.

The register is based on the completed Detailed Design set, the Implementation Specification selection test, and read-first comparison with the repository. Current source remains migration evidence only; it does not define target implementation where it conflicts with normative specifications.

---

## 2. Register Rules

A primary Implementation Specification has a stable identifier of the form `IS-<number>`. The number is an identity, not an authority level and not a guarantee of implementation order.

Each primary specification is stored under `docs/implementation/` using `is-<number>-<subject>-implementation-specification-v01.md`.

The register does not imply one Implementation Specification per source file, service, class, command or Detailed Design document. Version 1 contains 23 primary specifications because the selection test was applied independently:

- DD-1.1, DD-1.2 and DD-1.5 are combined in one application-runtime implementation specification;
- DD-1.3 and DD-1.4 remain separate because their concrete resolution mechanisms and tests are independently meaningful;
- each DD-2 capability remains separately specified because each has a distinct technical boundary, provider/mechanism surface or safety model;
- each DD-3/DD-4 domain remains separately specified because each owns distinct use-case orchestration or policy that must not be collapsed into another domain;
- interaction adapters and runtime/build assembly add two concrete Level 4 responsibilities without creating new Detailed Design authorities.

---

## 3. Version 1 Implementation Specification Register

| ID | Subject | Principal Detailed Design input | Status |
|---|---|---|---|
| `IS-1` | Application Runtime and Invocation | DD-1.1, DD-1.2, DD-1.5 | Authored |
| `IS-2` | Managed Project Resolution | DD-1.3, DD-1.5 | Authored |
| `IS-3` | Configuration Resolution | DD-1.4 and [DD-1.5 staged lifecycle](../dd_1_application_core/dd-1-5-application-engine-detailed-design-v01.md#_8-orchestration-lifecycle) | Authored |
| `IS-4` | Resource Access | DD-2.1 | Authored |
| `IS-5` | Process Execution | DD-2.2 | Authored |
| `IS-6` | Repository Capability | DD-2.3 | Authored |
| `IS-7` | Source Intelligence | DD-2.4 | Authored |
| `IS-8` | Source Transformation | DD-2.5 | Authored |
| `IS-9` | Resource Registry and Template | DD-2.6 | Authored |
| `IS-10` | AI Capability | DD-2.7 | Authored |
| `IS-11` | Quality Capability | DD-2.8 | Authored |
| `IS-12` | Documentation Capability | DD-2.9 | Authored |
| `IS-13` | Nuxt Capability | DD-2.10 | Authored |
| `IS-14` | App Domain | DD-3.1 | Authored |
| `IS-15` | Git Domain | DD-3.2 | Authored |
| `IS-16` | Nuxt Domain | DD-3.3 | Authored |
| `IS-17` | Docs Domain | DD-3.4 | Authored |
| `IS-18` | Quality Domain | DD-4.1 | Authored |
| `IS-19` | Settings Domain | DD-4.2 | Authored |
| `IS-20` | AI Domain | DD-4.3 | Authored |
| `IS-21` | Maintenance Domain | DD-4.4 | Authored |
| `IS-22` | Interaction Adapters | DD-1.1 plus interaction-mode requirements carried through the DD set | Authored |
| `IS-23` | Build and Runtime Assembly | ADR-0001 and the complete DD dependency model | Authored |

---

## 4. Boundary Selection Rationale

### 4.1 Application Core

IS-1 combines Application Invocation, Execution Outcomes and Application Engine implementation concerns because their concrete runtime wiring is inseparable at application entry and dispatch. It defines bootstrap, use-case registration, request handling, execution-context construction, dispatch, cancellation linkage, canonical outcome construction/projection and application-level interpretation while preserving final Application Engine authority.

IS-2 remains separate because project identity, topology, managed entities, repository relationships and operation-specific managed scope are independently testable and must not be conflated with configuration loading.

IS-3 remains separate because precedence, applicability, provenance, staged bootstrap resolution, sensitive values and immutable operation snapshots are a coherent responsibility distinct from project topology. The accepted order remains:

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

### 4.2 Shared capabilities

IS-4 Resource Access and IS-5 Process Execution remain split because filesystem/path containment, stale-state and resource mutation have materially different APIs, failure models and tests from executable invocation, environment handling, streaming, exit normalization, cancellation and timeout.

IS-6 separately wraps repository/Git mechanisms behind AppManager facts and bounded primitives without acquiring Git-domain policy.

IS-7 Source Intelligence and IS-8 Source Transformation remain separate: Source Intelligence is read-only recognition/evidence, while Source Transformation applies approved bounded transformations and therefore owns mutation, stale-source, preservation and validation mechanics.

IS-9 keeps registry identity, template identity, validation, parameter binding, rendering and provenance in one declarative-resource boundary and does not create an executable plugin framework.

IS-10 remains the replaceable AI provider/model execution and disclosure boundary; IS-11 separately normalizes quality-tool execution without deciding Quality-domain/application acceptance; IS-12 provides shared documentation mechanisms distinct from Docs-domain intent; IS-13 encapsulates framework-specific Nuxt recognition/mechanisms distinct from Nuxt-domain orchestration.

### 4.3 Domain implementations

IS-14 through IS-21 remain separate because each owns independently reviewable orchestration/policy:

- App — root application lifecycle and creation intent;
- Git — repository-management use cases and repository policy;
- Nuxt — Nuxt application/layer use cases and applicability policy;
- Docs — documentation use cases and profile/output policy;
- Quality — quality intent, operation-specific quality policy and gate composition;
- Settings — explicit persisted settings and metadata-management intent;
- AI — AI-specific project-resource/instruction intent;
- Utils — narrowly bounded otherwise-unowned maintenance intent.

Individual commands do not receive primary IS identities by default; they are concrete artefacts specified by their owning domain IS.

### 4.4 Interaction and assembly

IS-22 separately specifies TUI, GUI and Headless adapters because all three must translate into/out of the same IS-1 Application Invocation Contract without acquiring application authority.

IS-23 separately specifies package/workspace configuration, executable entry, TypeScript build, runtime composition, root scripts, dependency assembly, production assumptions and integration-level assembly tests. It connects approved responsibilities without absorbing them.

---

## 5. Current Repository Interpretation

Historical groupings such as `app/commands/`, `app/license_engine/`, `app/modes/`, `app/orchestrators/`, `app/resolvers/`, `app/scanners/`, `app/services/`, `app/strategies/` and `app/types/` do not become Implementation Specification boundaries automatically.

In particular, `app/services/` combines unrelated responsibilities; scanner/strategy families contribute to IS-7/IS-8 rather than defining one IS per language; commands contribute to domains and IS-1 rather than one IS per command; `app/license_engine/` is reconciled through Settings rather than preserved as an architectural engine merely because it exists; and `app/types/` is declaration storage rather than an implementation responsibility.

---

## 6. Cross-Cutting Implementation Rules

Every primary Implementation Specification preserves these rules where applicable:

1. **Application authority stays with the Application Engine.** Specialist execution does not acquire final application authority.
2. **Managed scope is explicit.** Discovery, recognition or provider capability does not create mutation authority.
3. **Configuration resolution is centralized.** Persistence does not define precedence and consumers do not invent private precedence rules.
4. **Canonical outcomes remain canonical.** Provider responses, exceptions and exit codes are normalized rather than leaked as application semantics.
5. **Evidence remains evidence until interpreted.** Repository, source, AI, Quality, Documentation and Nuxt capability results do not decide owning-domain acceptance by themselves.
6. **Source Intelligence stays read-only.** Existing-source mutation follows Source Transformation semantics.
7. **AI remains non-authoritative.** AI output is proposal/evidence until accepted by the owning use case.
8. **Capability/domain pairs stay distinct.** Shared technical execution does not absorb domain intent or policy.
9. **Provider replaceability is preserved.** Selected providers do not leak native models into general AppManager contracts unless an accepted ADR deliberately changes that rule.
10. **Implementation structure does not recreate a generic Utils/helper authority.** Helpers remain subordinate to the responsibility they serve.

---

## 7. Authored Baseline and Implementation Order

The dependency-aware authoring programme is complete. Its sequencing remains useful as implementation dependency guidance, not as outstanding documentation work:

```text
IS-23  Build and Runtime Assembly foundations
  |
  +--> IS-4 / IS-5 infrastructure
  |
  v
IS-1 Application Runtime and Invocation
  |
  +--> IS-2 / IS-3 Application Core resolution
  +--> IS-6 .. IS-13 shared capabilities
  |
  v
IS-14 .. IS-21 domain implementations
  |
  v
IS-22 Interaction Adapters
```

Implementation may proceed dependency-aware rather than by IS number. No implementation may redefine an approved upstream contract for convenience.

---

## 8. Canonical Version 1 Files

The complete Version 1 primary set is:

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

---

## 9. Change Control

The `IS-*` identities are the reconciled Version 1 Level 4 baseline. A proposed split, merge or retirement must explain which responsibility changed, affected DD contracts, why the existing boundary is no longer coherent, how traceability is preserved and whether any accepted ADR or higher-level specification is affected. Routine source refactoring inside a registered responsibility does not change its identity.

---

## 10. Lifecycle State

The primary Level 4 authoring and horizontal reconciliation programme is complete. The register no longer authorizes additional primary Version 1 IS authoring by default.

Implementation may now proceed against the reconciled IS-1 through IS-23 baseline, subject to normal change control. Any implementation discovery that exposes a genuine normative contradiction must be escalated through the documented hierarchy rather than silently changing an owning contract.