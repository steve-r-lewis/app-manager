# AppManager Application Outcome and Diagnostic Ownership Clarification

> **Document type:** Detailed Design clarification
>
> **Clarifies:** DD-1.1, DD-1.2

> **Status:** Version 1 Detailed Design clarification
>
> **Clarifies:** [DD-1.1 — Application Invocation](../dd-1-1-application-invocation-detailed-design-v01.md) and [DD-1.2 — Execution Outcomes](../dd-1-2-execution-outcomes-detailed-design-v01.md)
>
> **Reconciliation source:** [docs/project_management/dd2-independent-review-reconciliation-v01.md](../../project_management/dd2-independent-review-reconciliation-v01.md), R-01 and R-02
>
> **Normative effect:** This clarification resolves ownership ambiguity between existing DD-1 contracts. It does not introduce a new outcome model or a second diagnostic taxonomy.

## 1. Purpose

The existing DD-1.1 Application Invocation and DD-1.2 Execution Outcomes specifications both describe application-facing outcome and diagnostic structures. Their intended layering is compatible, but the current wording can be read as defining two independently authoritative shared outcome envelopes and two independently authoritative shared diagnostic taxonomies.

This clarification establishes one semantic owner and one projection relationship so implementations do not create parallel contracts.

The governing rule is:

> **DD-1.2 Execution Outcomes owns canonical AppManager outcome, diagnostic, warning, effect, cancellation and subordinate-result semantics. DD-1.1 Application Invocation owns how those semantics cross the invocation boundary.**

## 2. Canonical Outcome Ownership

[DD-1.2 — Execution Outcomes](../dd-1-2-execution-outcomes-detailed-design-v01.md) is the canonical Detailed Design owner of the shared AppManager outcome model.

Its outcome contract owns the common meanings of:

- terminal status;
- application result payload placement;
- diagnostics and warnings;
- known and proposed effects;
- subordinate/child results;
- cancellation information;
- bounded execution-evidence references;
- recovery guidance;
- timing and correlation metadata where applicable.

Domain and use-case result payloads extend this model by composition and shall not redefine these shared meanings.

### DD-OUTCLAR-001 — One canonical semantic outcome

AppManager shall have one canonical shared semantic outcome contract. A subsystem, capability, domain or adapter shall not create a competing common outcome envelope merely because it needs to expose a subset or projection of the canonical information.

## 3. Invocation Outcome Is a Projection Boundary

The `Invocation Outcome Contract` in DD-1.1 shall be interpreted as the invocation-facing projection/delivery contract for the canonical DD-1.2 outcome, not as a second semantic owner.

DD-1.1 may determine which canonical information must be available to an invocation caller and may add invocation-boundary representation concerns such as safe caller correlation. It shall not independently redefine shared status, diagnostic, warning, effect, cancellation, recovery or subordinate-result semantics.

The conceptual relationship is:

```text
capability/provider evidence
        -> owning use-case interpretation
        -> canonical DD-1.2 AppManager outcome
        -> DD-1.1 invocation-facing projection
        -> interaction adapter / caller representation
```

### DD-OUTCLAR-002 — Projection is not duplication

An invocation-facing representation may omit information that is not caller-relevant, reshape it for an approved serialization boundary, or expose an approved invocation-specific view. Such projection shall remain semantically traceable to the canonical DD-1.2 outcome and shall not introduce contradictory lifecycle states or meanings.

### DD-OUTCLAR-003 — Invocation-specific characteristics

Invocation-specific characteristics such as whether execution was previewed or rejected before consequential execution may be exposed through the invocation projection where useful. Where the characteristic affects canonical application semantics, its meaning shall be represented by or mapped explicitly to DD-1.2 rather than maintained as an independent competing state model.

## 4. Canonical Diagnostic Ownership

The diagnostic model and broad application taxonomy in [DD-1.2 — Execution Outcomes](../dd-1-2-execution-outcomes-detailed-design-v01.md) are the canonical DD-1 diagnostic semantics.

The category list in DD-1.1 §21.2 shall therefore be interpreted as an invocation-relevant subset/view of the DD-1.2 taxonomy, not as a separate shared taxonomy.

### DD-OUTCLAR-004 — One application taxonomy

Only DD-1.2 owns the shared cross-application diagnostic taxonomy at Detailed Design level.

DD-1.1, domains and DD-2 capabilities may define local categories only as:

1. a direct use of a canonical category;
2. a documented refinement/subcategory of a canonical category; or
3. specialist technical evidence that is mapped to an AppManager diagnostic during application interpretation.

They shall not define a second application-wide taxonomy with overlapping but divergent meanings.

## 5. Capability and Domain Diagnostic Refinement

Capability-specific failure vocabularies remain useful because Process Execution, Repository, Source Intelligence, AI, Quality, Documentation, Nuxt and other capabilities observe different technical conditions.

Those vocabularies are subordinate evidence models unless explicitly promoted through the canonical AppManager diagnostic contract.

For example:

```text
provider-native error/status
        -> capability-specific normalized technical evidence
        -> owning use-case interpretation
        -> canonical AppManager diagnostic category/code
        -> invocation-facing projection
```

### DD-OUTCLAR-005 — Provider categories are not application categories

Provider-native exception classes, exit reasons, API codes, parser states or tool-specific findings shall not become canonical AppManager diagnostic categories merely by being preserved as evidence.

### DD-OUTCLAR-006 — Domain refinement preserves parent meaning

A domain-specific diagnostic code or subcategory may add precision but shall retain an explicit mapping to the relevant canonical DD-1.2 category where cross-domain handling depends on that category.

## 6. Severity and Warning Semantics

DD-1.2 owns shared severity and warning semantics. Invocation may project warnings separately for caller convenience, but this separation does not create a second warning model.

Severity alone does not determine final application outcome. The owning use case applies acceptance policy as already required by DD-1.2.

## 7. Compatibility and Migration

This clarification is intentionally topology-independent. It does not require:

- one TypeScript interface for every representation;
- one physical module;
- inheritance between domain result types;
- one serialized wire format;
- removal of capability-specific evidence types.

It requires semantic single ownership and explicit mapping.

An implementation may use separate internal and transport types where justified, provided tests can demonstrate that their shared meanings conform to DD-1.2 and that DD-1.1 is a projection rather than a competing source of truth.

## 8. Boilerplate Reduction Rule

This clarification also applies the reconciliation three-layer rule.

Future specifications should not reproduce the full outcome or diagnostic model merely to show conformance. They should:

1. bind explicitly to DD-1.2 as canonical owner;
2. state only the locally important authority/safety distinction; and
3. define the capability/domain-specific delta.

This preserves local comprehensibility while reducing semantic duplication and drift.

## 9. Conformance Criteria

R-01 and R-02 are conformant with this clarification only if:

1. DD-1.2 is treated as the single semantic owner of the shared outcome contract;
2. DD-1.1 is treated as the invocation-facing projection/delivery boundary;
3. no implementation introduces independently evolving common outcome semantics in both layers;
4. DD-1.2 is the single owner of the shared diagnostic taxonomy;
5. DD-1.1 diagnostic categories are treated as an invocation-relevant view/subset;
6. capability/provider failure categories remain technical evidence or explicit refinements rather than competing application categories;
7. domain-specific diagnostic refinements preserve an explicit canonical mapping where cross-domain interpretation requires it;
8. shared warning/severity semantics remain DD-1.2-owned;
9. provider-native data remains below the application-facing contract; and
10. future Detailed Designs use binding-plus-local-delta rather than reproducing the full shared models.

## 10. Required Propagation

The next documentation-maintenance pass shall update the affected existing Detailed Designs so this relationship is discoverable without locating this clarification by accident.

At minimum:

- DD-1.1 shall identify DD-1.2 as canonical owner for outcome and diagnostic semantics and replace wording that calls its local diagnostic list an independently shared taxonomy;
- DD-1.2 shall identify DD-1.1 as the invocation-facing projection boundary;
- DD-2 capability specifications shall be checked for local diagnostic language that could be mistaken for a second application taxonomy;
- future DD-3/4 domain designs shall compose the DD-1.2 model rather than recreate common envelopes.

Until that propagation is completed and verified, R-01 and R-02 are architecturally resolved by this clarification but remain open as documentation-reconciliation items.
