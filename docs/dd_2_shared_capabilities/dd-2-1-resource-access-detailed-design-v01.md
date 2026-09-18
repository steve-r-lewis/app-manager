# DD-2.1 — AppManager Resource Access Detailed Design

> **Detailed Design ID:** DD-2.1
>
> **Design family:** DD-2 — Shared Capabilities

> **Status:** Version 1 Detailed Design Specification
>
> **Detailed Design authority:** This document defines the permanent shared contracts for bounded access to filesystem and resource-like project artefacts. It refines, but does not override, the root Design Specification, Functional Specifications, accepted ADRs, or the DD-1 Application Core Detailed Designs.
>
> **Sources and navigation:** [Project Documentation Guide](../project-documentation-guide-v01.md), [AppManager Design Specification](../appmanager-design-specification-v01.md), [Detailed Design Register](../project_management/detailed-design-register-v01.md), [ADR-0001 — Primary Application Runtime](../project_management/decisions/adr-0001-primary-application-runtime.md)
>
> **Related Detailed Design authorities:** [DD-1.1 — Application Invocation](../dd_1_application_core/dd-1-1-application-invocation-detailed-design-v01.md), [DD-1.2 — Execution Outcomes](../dd_1_application_core/dd-1-2-execution-outcomes-detailed-design-v01.md), [DD-1.3 — Managed Project](../dd_1_application_core/dd-1-3-managed-project-detailed-design-v01.md), [DD-1.4 — Configuration Resolution](../dd_1_application_core/dd-1-4-configuration-resolution-detailed-design-v01.md), [Application Core Bootstrap Resolution](../dd_1_application_core/dd-1-5-application-engine-detailed-design-v01.md#_8-orchestration-lifecycle), [DD-1.5 — Application Engine](../dd_1_application_core/dd-1-5-application-engine-detailed-design-v01.md)
>
> **Primary Functional authorities:** [docs/functional/managed-project-functional-specification-v01.md](../functional/managed-project-functional-specification-v01.md), [docs/functional/configuration-functional-specification-v01.md](../functional/configuration-functional-specification-v01.md), [docs/functional/source-transformation-functional-specification-v01.md](../functional/source-transformation-functional-specification-v01.md), [docs/functional/application-invocation-functional-specification-v01.md](../functional/application-invocation-functional-specification-v01.md)
>
> **Related domain Functional authorities:** App, Docs, Git, Nuxt, Settings, AI, Quality and Maintenance Functional Specifications where those domains inspect or mutate project resources.

## 1. Purpose

Resource Access performs bounded reads, inspections, enumeration and mutations of filesystem/resource-like project artefacts. Callers supply target and technical constraints; the capability normalizes references, verifies containment/preconditions and returns resource evidence. Its responsibilities and local operation contracts below explain how this differs from domain intent and source-format interpretation.

Application authority is governed by [Design §6.6](../appmanager-design-specification-v01.md#_6-6-capability-boundaries-and-providers); existing-source semantic change uses [Source Transformation](dd-2-5-source-transformation-detailed-design-v01.md).

## 2. Scope

This design owns permanent internal contracts for:

- resource identity and resource references;
- resource location and resource-kind semantics;
- bounded read, inspect, enumerate, create, replace, update, delete and move requests;
- canonical path/location normalization at the capability boundary;
- caller-supplied containment and target constraints;
- existence, accessibility and metadata evidence;
- text, binary and opaque content transport distinctions where architecturally meaningful;
- resource snapshots, revision evidence and stale-state preconditions;
- mutation preconditions;
- conflict detection inputs and normalized conflict evidence;
- proposed versus applied resource effects;
- safe staging and replacement semantics where required for durable mutation guarantees;
- write, delete and move safety boundaries;
- symbolic-link, filesystem-indirection and containment semantics;
- multi-resource execution evidence;
- cancellation observation boundaries;
- resource-level concurrency and stale-state evidence;
- sensitive-resource classification and data minimization;
- provider/filesystem result normalization into DD-1.2 execution evidence and diagnostics;
- provider isolation and future provider replaceability;
- testability without requiring application-level orchestration.

This design defines a capability contract. It does not prescribe one class, one package, one process, one filesystem library, one operating system API, one virtual filesystem or one concrete TypeScript interface.

## 3. Explicit Non-Ownership

Resource Access shall not own:

- managed-project identity;
- managed-project topology;
- managed-scope derivation;
- targetability policy;
- application authorization or confirmation policy;
- command/use-case semantics;
- configuration-source precedence or effective-configuration resolution;
- source-language recognition or parsing semantics;
- source-transformation strategy or transformation-plan construction;
- repository semantics;
- documentation semantics;
- Nuxt semantics;
- quality policy;
- AI decision authority;
- final application success, failure or partial-success acceptance;
- domain-specific persistence semantics merely because persistence uses files.

Resource Access may reject a technically unsafe or incoherent request within its own contract. Such rejection supplements, but does not replace, the caller's application-level policy and authorization responsibilities.

## 4. Architectural Position

The permanent dependency direction is:

```text
Application Engine / owning use case
        |
        +--> Managed Project / managed scope
        +--> effective configuration
        +--> policy / safety / authorization
        +--> domain / transformation planning
        |
        v
bounded Resource Access request
        |
        v
+--------------------------------------+
| Resource Access capability           |
|                                      |
| normalize resource reference         |
| verify bounded technical constraints |
| inspect / read / enumerate           |
| apply approved mutation              |
| detect technical conflict/staleness  |
| normalize provider evidence          |
+------------------+-------------------+
                   |
                   v
      filesystem / resource provider
                   |
                   v
      normalized resource evidence
                   |
                   v
Application Engine / owning use case
      interpretation / acceptance
```

The caller supplies application-derived constraints. Resource Access enforces those constraints at the technical boundary but does not invent them.

### 4.1 Capability boundary

The Resource Access seam applies [Design §6.6](../appmanager-design-specification-v01.md#_6-6-capability-boundaries-and-providers) to native paths, directory entries, file descriptors, streams and filesystem errors. The normalized resource/request models below are the consumer-facing contract.

### 4.2 Relationship to Managed Project

Managed Project determines which project and operation-specific scope are authoritative.

Resource Access consumes bounded resource references and constraints derived from that model.

The distinction is:

```text
accessible != managed
managed != in operation scope
in operation scope != mutable
mutable != authorized for every effect
```

### 4.3 Relationship to Source Intelligence and Transformation

Resource Access may transport source bytes/text and apply already-approved resource mutations.

It does not determine source structure or transformation intent.

The expected relationship is:

```text
Resource Access read
    -> Source Intelligence facts
    -> Source Transformation plan
    -> Engine/use-case policy + authorization
    -> Resource Access apply bounded effects
    -> Source-level validation
    -> application acceptance
```

## 5. Responsibility Model

Resource Access is decomposed into the following permanent responsibilities:

1. **Resource Reference Contract** — identifies a resource in AppManager-oriented terms suitable for bounded access.
2. **Resource Request Contract** — describes the requested technical operation and caller-supplied constraints.
3. **Resource Reference Normalizer** — converts supported caller representations into a canonical capability-facing reference without deriving managed scope.
4. **Containment Verifier** — evaluates whether the normalized effective target remains within caller-supplied technical containment constraints.
5. **Resource Inspector** — obtains existence, kind, accessibility and metadata evidence without mutating the resource.
6. **Resource Reader** — obtains bounded content without interpreting application meaning.
7. **Resource Enumerator** — enumerates children under explicit bounds and exclusion constraints.
8. **Resource Mutator** — applies approved create, replace, update-as-bounded-content, delete or move effects.
9. **Precondition Evaluator** — evaluates existence, revision, expected-kind and stale-state conditions before mutation.
10. **Staging/Replacement Coordinator** — provides safe replacement mechanics where the requested guarantee requires them.
11. **Provider Adapter** — isolates concrete filesystem/resource APIs and provider-native errors.
12. **Resource Evidence Normalizer** — converts provider-native results into DD-1.2-compatible evidence, diagnostics and effects.

These are logical responsibilities, not mandatory one-class-per-responsibility implementation objects.

## 6. Resource Reference Contract

### 6.1 Purpose

A Resource Reference identifies the resource to which a bounded Resource Access request applies.

It shall be explicit enough to prevent Resource Access from searching broadly for a target merely because a caller supplied an imprecise string.

<a id="dd-res-001"></a>

### DD-RES-001 — Canonical resource reference

Resource Access shall operate on a canonical resource reference derived from caller-supplied target information before consequential access occurs.

### 6.2 Reference properties

A resource reference shall be capable of representing, where relevant:

- logical resource identity supplied by an upstream authority;
- location or location candidate;
- expected resource kind;
- base/anchor context used for normalization;
- caller-supplied containment boundary;
- source scope or managed-entity association as opaque context where useful;
- sensitivity classification where already known;
- correlation metadata;
- revision/snapshot evidence where the request depends on prior observation.

Exact field names and language-level types belong to Implementation Specification.

### 6.3 Resource identity versus location

Logical resource identity and physical/provider location shall remain distinguishable.

A path may change while an AppManager semantic entity remains the same, and two syntactic paths may resolve to the same effective filesystem target.

Resource Access may report normalized/effective location facts but shall not redefine upstream semantic identity.

<a id="dd-res-002"></a>

### DD-RES-002 — Location is not application identity

Resource/provider locations are evidence inputs under [Design](../appmanager-design-specification-v01.md#_9-6-project-discovery-and-context-resolution); canonical resource identity is the local reference defined above.

## 7. Resource Kind Model

Resource Access shall support a minimal provider-independent resource-kind model sufficient for safe technical operation.

At minimum, the model shall distinguish where observable:

- regular file/resource;
- directory/container resource;
- symbolic link or equivalent indirection;
- other/special/unsupported resource;
- missing resource;
- unknown because inspection failed or was not permitted.

<a id="dd-res-003"></a>

### DD-RES-003 — Kind preservation

Resource-kind evidence shall remain explicit and shall not be silently collapsed to `exists`/`does not exist` where kind affects operation safety.

A caller requesting file replacement shall not accidentally operate on a directory, special file or unresolved indirection merely because a provider reports that a path exists.

## 8. Resource Operation Model

Resource Access shall distinguish technical operation classes explicitly.

The shared operation model shall support at least:

- inspect metadata;
- read content;
- enumerate children;
- create new resource;
- replace existing resource;
- write bounded content under explicitly defined create/replace semantics;
- delete resource;
- move/rename resource;
- create container/directory where explicitly requested;
- delete container/directory where explicitly requested.

<a id="dd-res-004"></a>

### DD-RES-004 — Read and mutation distinction

Read/inspection requests and mutation requests shall be distinct in the capability contract.

A caller asking to inspect, read or enumerate shall not trigger resource creation, normalization writes, format repair, cache creation or another consequential mutation as an incidental effect.

<a id="dd-res-005"></a>

### DD-RES-005 — Create versus replace distinction

A request to create a resource shall be distinguishable from a request to replace an existing resource.

The capability shall not silently convert a create collision into replacement unless the caller explicitly requested semantics that permit that outcome.

<a id="dd-res-006"></a>

### DD-RES-006 — Delete versus absence distinction

Deletion semantics shall state whether absence is an accepted no-op precondition or a conflict for the specific request.

Resource Access shall not impose one global rule that missing-delete targets always succeed or always fail.

<a id="dd-res-007"></a>

### DD-RES-007 — Move semantics

A move/rename request shall identify source and destination separately and shall evaluate preconditions for both.

Move shall not silently become copy-plus-delete semantics at the architectural contract level unless a provider-specific implementation requires such mechanics and preserves the requested observable guarantees.

## 9. Bounded Resource Request Contract

### 9.1 Purpose

Every consequential Resource Access operation shall receive a bounded request describing the technical operation and the constraints under which that operation may execute.

<a id="dd-res-008"></a>

### DD-RES-008 — Bounded request required

Resource Access shall not accept an unbounded command such as “write somewhere under this project” or “delete matching files” as sufficient mutation authority.

The request shall identify specific targets or an explicitly bounded enumeration from which targets may be derived according to caller-supplied rules.

### 9.2 Request properties

A bounded request shall be capable of representing:

- operation kind;
- target resource reference or source/destination references;
- requested content where applicable;
- expected current existence state;
- expected current resource kind where applicable;
- revision/snapshot/stale-state preconditions;
- containment root or approved location boundary;
- link/indirection policy supplied by the caller;
- overwrite/collision policy supplied by the caller;
- creation-of-parent/container permission where applicable;
- requested mutation guarantee, such as replacement atomicity expectation;
- sensitivity handling constraints;
- cancellation linkage;
- correlation with invocation/use-case execution;
- optional provider/capability configuration already resolved through DD-1.4.

<a id="dd-res-009"></a>

### DD-RES-009 — Least authority request

The delegated resource request applies [Design](../appmanager-design-specification-v01.md#_6-6-capability-boundaries-and-providers) to its technical authority.

## 10. Path and Location Normalization

### 10.1 Normalization purpose

Path/location normalization creates a stable provider-facing interpretation of the requested location before access.

Normalization may include, as applicable:

- resolving relative syntax against an explicit base;
- removing redundant path segments;
- platform-appropriate separator normalization;
- lexical normalization;
- provider-specific canonicalization that is safe and observable;
- case/case-folding evidence where the provider requires it;
- distinguishing syntactic location from effective resolved target where links or indirection are involved.

<a id="dd-res-010"></a>

### DD-RES-010 — No current-directory authority

Use the caller-supplied base under [DD-RES-001](#dd-res-001); project authority follows [Design](../appmanager-design-specification-v01.md#_9-6-project-discovery-and-context-resolution).

<a id="dd-res-011"></a>

### DD-RES-011 — Normalization does not expand scope

Normalization shall not broaden caller-supplied containment or target constraints.

A syntactically relative path that normalizes outside the approved boundary shall be rejected rather than accepted because the provider can access it.

<a id="dd-res-012"></a>

### DD-RES-012 — Preserve reference provenance

Where material to diagnostics, stale-state checks or caller understanding, Resource Access shall preserve both the supplied reference and the normalized/effective location evidence.

## 11. Containment and Indirection Safety

### 11.1 Containment rule

Containment is a technical safety check against caller-supplied boundaries. It is not Managed Project scope derivation.

<a id="dd-res-013"></a>

### DD-RES-013 — Caller-derived containment

For operations whose safety depends on location containment, Resource Access shall verify the effective target against a containment boundary supplied or derived by an authoritative caller.

### 11.2 Symbolic links and equivalent indirection

Resource Access shall not assume lexical path containment proves effective target containment.

Where symbolic links, junctions, mount indirection, provider aliases or equivalent mechanisms can redirect access, the capability shall expose or enforce indirection semantics sufficient to avoid silent boundary escape.

<a id="dd-res-014"></a>

### DD-RES-014 — Indirection cannot silently escape

A resource request shall not follow indirection outside an approved containment boundary unless the caller's policy explicitly permits that external target and the effective target remains unambiguous.

<a id="dd-res-015"></a>

### DD-RES-015 — Indirection evidence

Inspection shall be capable of reporting whether a requested location is or traverses an indirection where that fact materially affects safety or caller interpretation.

<a id="dd-res-016"></a>

### DD-RES-016 — No ownership by containment

Interpret containment evidence under [Design](../appmanager-design-specification-v01.md#_9-9-non-destructive-ownership-and-unmanaged-content) when the caller decides ownership and permitted effects.

## 12. Resource Inspection and Metadata Evidence

Resource inspection shall provide structured technical facts without mutating the target.

The evidence model shall be capable of representing, where available and relevant:

- existence state;
- resource kind;
- normalized/effective location;
- accessibility state;
- size;
- modification/revision evidence;
- permissions/capability evidence without exposing unnecessary platform-native detail;
- indirection/link evidence;
- directory/container status;
- sensitivity marker carried from caller/context;
- provider-specific detail retained only as bounded evidence.

<a id="dd-res-017"></a>

### DD-RES-017 — Expected failures are structured

Expected resource states such as missing, inaccessible, wrong kind, conflict or stale revision shall be represented through structured evidence/diagnostics rather than requiring callers to classify arbitrary provider exceptions.

<a id="dd-res-018"></a>

### DD-RES-018 — `exists` is insufficient where safety needs more

Consumers shall not rely on a Boolean existence check when the requested operation depends on resource kind, effective target, access mode, revision or containment.

## 13. Read Contract

<a id="dd-res-019"></a>

### DD-RES-019 — Read is content acquisition

A read request shall acquire resource content and associated technical evidence without interpreting application meaning or mutating the resource.

### 13.1 Content distinctions

The Resource Access contract shall support distinctions sufficient for consumers to request or receive:

- text content;
- binary/byte content;
- opaque provider content where justified;
- unsupported/indeterminate content mode.

<a id="dd-res-020"></a>

### DD-RES-020 — No extension-based semantic authority

File extension alone shall not give Resource Access authority to parse, validate or reinterpret content as configuration, source, documentation or another domain model.

Format-aware parsing may be supplied by Source Intelligence, Configuration source adapters, Settings resource handlers or another owning capability above Resource Access.

<a id="dd-res-021"></a>

### DD-RES-021 — Encoding is explicit where material

Where text decoding affects correctness, the requested or detected encoding semantics shall be explicit enough to avoid silently corrupting content.

Concrete supported encodings are Implementation Specification concerns unless later elevated by functional requirements.

<a id="dd-res-022"></a>

### DD-RES-022 — Bounded reads

The capability shall support resource-size or read-mode constraints where required to prevent an operation from unintentionally loading an unbounded resource into memory.

The exact thresholds and streaming mechanics belong to lower-level design unless architecturally significant.

## 14. Enumeration Contract

Enumeration is read-only discovery beneath an explicitly bounded resource/container.

<a id="dd-res-023"></a>

### DD-RES-023 — Explicit enumeration root

Enumeration shall begin from an explicit normalized resource reference and shall not broaden into unrelated filesystem roots merely because traversal is technically possible.

<a id="dd-res-024"></a>

### DD-RES-024 — Enumeration constraints

The request shall be capable of carrying caller-supplied constraints such as:

- recursion permitted or prohibited;
- maximum depth where required;
- resource-kind filters;
- name or path filters;
- explicit exclusions;
- indirection-following policy;
- bounded result/size constraints where needed.

<a id="dd-res-025"></a>

### DD-RES-025 — Exclusions remain effective

Excluded locations shall not re-enter an enumeration through alternate path syntax or indirection where the capability can determine equivalence safely.

<a id="dd-res-026"></a>

### DD-RES-026 — Enumeration is evidence only

Enumeration results bind to [Design](../appmanager-design-specification-v01.md#_9-6-project-discovery-and-context-resolution) as discovery evidence.

## 15. Mutation Preconditions

Consequential resource operations shall evaluate caller-supplied technical preconditions before applying effects.

Supported precondition classes shall include, where relevant:

- must exist;
- must not exist;
- expected resource kind;
- expected revision/snapshot/fingerprint;
- expected content state where represented safely;
- destination must be absent/present;
- parent/container conditions;
- containment and indirection constraints;
- expected accessibility/mutation capability.

<a id="dd-res-027"></a>

### DD-RES-027 — Preconditions before effect

A mutation shall not begin if a required technical precondition is known to be false.

<a id="dd-res-028"></a>

### DD-RES-028 — Preconditions do not authorize

Technical preconditions are inputs to the application authorization boundary in [Design](../appmanager-design-specification-v01.md#_6-2-application-engine-authority).

<a id="dd-res-029"></a>

### DD-RES-029 — Precondition evidence returned

When a mutation is rejected because a technical precondition failed, Resource Access shall return structured conflict/stale-state evidence suitable for DD-1.2 diagnostics and owning-use-case interpretation.

## 16. Stale-State and Concurrency Semantics

### 16.1 Resource-level responsibility

Resource Access detects technical staleness from the revision/preconditions in [§15](#_15-mutation-preconditions). Consumer recovery uses the [Engine stale-state checkpoint](../dd_1_application_core/dd-1-5-application-engine-detailed-design-v01.md#dd-eng-024) and [invocation retry contract](../functional/application-invocation-functional-specification-v01.md#fr-inv-048).

### DD-RES-030 — Compare before consequential mutation

Where a caller supplies expected revision or snapshot evidence, Resource Access shall verify that evidence at the latest safe point before the consequential mutation.

<a id="dd-res-031"></a>

### DD-RES-031 — Stale state is explicit

A detected stale-state mismatch shall be returned as a structured conflict rather than silently applying a mutation to the newer state.

<a id="dd-res-032"></a>

### DD-RES-032 — No implicit retry authority

Resource Access shall not independently retry a failed mutation in a way that could change target, overwrite newer content or bypass caller-visible conflict handling unless the retry is strictly technical, preserves identical semantics and is permitted by the request.

<a id="dd-res-033"></a>

### DD-RES-033 — No universal locking requirement

This design does not require one universal filesystem lock, mutex, lease or transaction mechanism.

Providers may use suitable implementation mechanisms, but application-level concurrency policy remains with DD-1.5.

## 17. Create and Write Semantics

<a id="dd-res-034"></a>

### DD-RES-034 — Parent creation is explicit

Creating missing parent directories/containers shall occur only where the request explicitly permits or requires that behaviour.

A write shall not gain broad directory-creation authority implicitly.

<a id="dd-res-035"></a>

### DD-RES-035 — Content application is bounded

Resource Access may write supplied content to the explicitly identified target under the approved create/replace semantics. It shall not derive unrelated edits, append rules, merge policy or format-specific patch behaviour on its own.

<a id="dd-res-036"></a>

### DD-RES-036 — No implicit append/update policy

Append-if-missing, key merging and whole-file rewrite are content-policy cases of [DD-RES-035](#dd-res-035), routed through the owning transformation/resource handler rather than inferred from an extension or historical convenience method.

<a id="dd-res-037"></a>

### DD-RES-037 — Preserve supplied bytes/text faithfully

Absent an explicitly requested encoding/normalization transformation, Resource Access shall not alter supplied content for formatting, newline normalization, comment removal or schema repair.

## 18. Replacement Atomicity and Staging

### 18.1 Scope of guarantee

Resource Access shall distinguish requested guarantees from best-effort provider behaviour.

A single-resource replacement may request a guarantee such as “target is either the previous complete resource or the new complete resource” where the provider can support it.

<a id="dd-res-038"></a>

### DD-RES-038 — No false atomicity

Replacement and staging guarantees follow [DD-1.2 Consequential Effects](../dd_1_application_core/dd-1-2-execution-outcomes-detailed-design-v01.md#_12-consequential-effects); expose only guarantees verified by the selected resource operation/provider.

<a id="dd-res-039"></a>

### DD-RES-039 — Staging is subordinate

Temporary/staging resources may be used to implement safe replacement, but they remain internal technical artefacts and shall not become application targets or durable managed resources merely because they exist.

<a id="dd-res-040"></a>

### DD-RES-040 — Staging containment

Staging resources used for a bounded mutation shall remain within a location/safety model compatible with the requested operation and shall not silently introduce a broader write surface.

<a id="dd-res-041"></a>

### DD-RES-041 — Staging cleanup evidence

Failure to clean up a temporary/staging artefact shall be reportable as secondary evidence when materially relevant, without replacing the primary mutation failure.

<a id="dd-res-042"></a>

### DD-RES-042 — Multi-resource non-transactionality

Compose multiple mutations as per-resource effects under [DD-1.2 Partial Completion](../dd_1_application_core/dd-1-2-execution-outcomes-detailed-design-v01.md#_14-partial-completion); this contract supplies no cross-resource transaction guarantee.

## 19. Delete Semantics

<a id="dd-res-043"></a>

### DD-RES-043 — Delete target specificity

A delete request shall identify the exact resource or bounded container target to remove and shall not infer recursive deletion from a generic file-delete request.

<a id="dd-res-044"></a>

### DD-RES-044 — Recursive/container deletion is explicit

Recursive directory/container deletion shall require an explicitly distinct request characteristic because its effect surface differs materially from deleting a single file/resource.

<a id="dd-res-045"></a>

### DD-RES-045 — No adjacent deletion

Deleting one approved resource shall not authorize removal of sibling, parent, generated, temporary or related resources unless those targets are separately included in the bounded request.

<a id="dd-res-046"></a>

### DD-RES-046 — Delete effects are reported

Successful deletion shall produce an applied resource effect identifying the deleted target and sufficient known pre-state evidence for caller understanding where available.

## 20. Move and Rename Semantics

<a id="dd-res-047"></a>

### DD-RES-047 — Source and destination containment

Move/rename operations shall validate both source and destination against applicable caller-supplied containment and indirection constraints.

<a id="dd-res-048"></a>

### DD-RES-048 — Destination collision policy

Destination-exists behaviour shall be explicit in the request. Resource Access shall not silently overwrite an existing destination merely because the underlying provider supports replacement rename semantics.

<a id="dd-res-049"></a>

### DD-RES-049 — Move effect evidence

A successful move shall report the original and resulting resource locations as one coherent applied effect where the provider can establish that relationship reliably.

<a id="dd-res-050"></a>

### DD-RES-050 — Cross-provider/cross-boundary move

If a requested move cannot preserve move semantics because source and destination require incompatible provider mechanisms, Resource Access shall reject it or return explicit degraded-operation evidence according to an approved caller request. It shall not silently change semantics into copy/delete.

## 21. Sensitive Resources

Resource Access shall preserve sensitivity classifications supplied by the owning context and shall minimise exposure of resource content and locations in diagnostics and evidence.

<a id="dd-res-051"></a>

### DD-RES-051 — Sensitivity is propagated

A resource classified as sensitive upstream shall remain marked sensitive through Resource Access requests, evidence, diagnostics and effects where that classification remains applicable.

<a id="dd-res-052"></a>

### DD-RES-052 — Diagnostics minimise disclosure

For resource errors apply [DD-1.2 Sensitive Information and Redaction](../dd_1_application_core/dd-1-2-execution-outcomes-detailed-design-v01.md#_24-sensitive-information-and-redaction) using safe resource identity and failure meaning.

<a id="dd-res-053"></a>

### DD-RES-053 — Content does not become telemetry by default

Resource content in logs, tracing or result evidence follows [DD-1.2 Sensitive Information and Redaction](../dd_1_application_core/dd-1-2-execution-outcomes-detailed-design-v01.md#_24-sensitive-information-and-redaction). Reading or writing the bytes is not a disclosure requirement.

<a id="dd-res-054"></a>

### DD-RES-054 — Sensitive staging

Temporary/staging mechanisms used for sensitive resources shall preserve an equivalent sensitivity posture to the target resource as far as the provider contract can support.

## 22. Cancellation

### 22.1 Cancellation boundary

Resource Access shall observe cancellation where an operation is meaningfully cancellable, but cancellation semantics depend on the underlying provider and effect boundary.

<a id="dd-res-055"></a>

### DD-RES-055 — Cancellation before effect

Observe cancellation before starting a resource effect under [DD-1.2 Cancellation Model](../dd_1_application_core/dd-1-2-execution-outcomes-detailed-design-v01.md#_17-cancellation-model).

<a id="dd-res-056"></a>

### DD-RES-056 — Cancellation during non-interruptible effect

If the provider cannot safely interrupt an already-started atomic or critical mutation, Resource Access may allow that bounded effect to reach a safe completion point and shall report what occurred.

<a id="dd-res-057"></a>

### DD-RES-057 — Cancellation does not imply rollback

Report completed resource effects under [DD-1.2 Cancellation Model](../dd_1_application_core/dd-1-2-execution-outcomes-detailed-design-v01.md#_17-cancellation-model); compensation, when separately authorized, is a distinct effect.

<a id="dd-res-058"></a>

### DD-RES-058 — Multi-resource cancellation

For multi-resource work, cancellation shall stop further not-yet-started effects as soon as safely practical and preserve evidence for completed, in-progress, skipped and not-attempted targets.

## 23. Execution Evidence and Diagnostics

Resource Access results shall integrate with DD-1.2 rather than define a competing outcome system.

### 23.1 Technical evidence

Resource Access evidence may include:

- normalized resource reference;
- effective location evidence;
- operation attempted;
- existence/kind/accessibility facts;
- revision/snapshot evidence;
- bytes/content length metadata where safe;
- provider execution state;
- applied resource effects;
- proposed effects where a higher-level capability asked Resource Access only to validate feasibility;
- conflict/stale-state evidence;
- indirection/containment evidence;
- cancellation observation;
- bounded provider detail.

<a id="dd-res-059"></a>

### DD-RES-059 — Provider result normalization

Normalize resource-provider failures through [DD-1.2 Provider Result Normalization](../dd_1_application_core/dd-1-2-execution-outcomes-detailed-design-v01.md#_18-provider-result-normalization).

<a id="dd-res-060"></a>

### DD-RES-060 — Resource diagnostic categories

The capability shall support AppManager-oriented diagnostic categories including, where applicable:

- resource not found;
- already exists/collision;
- wrong resource kind;
- inaccessible/permission denied;
- containment violation;
- indirection/symlink boundary violation;
- invalid resource reference;
- stale state/concurrent modification;
- unsupported operation;
- unsupported resource kind;
- encoding/content-mode failure;
- resource too large/request limit exceeded;
- provider unavailable;
- temporary/staging failure;
- delete failure;
- move failure;
- read failure;
- write/create/replace failure;
- cancellation.

Provider-native codes may be retained as bounded detail but shall not become the primary application diagnostic contract.

<a id="dd-res-061"></a>

### DD-RES-061 — Technical success is not application success

The caller interprets successful resource execution under [Design](../appmanager-design-specification-v01.md#_11-11-workflow-results-failure-and-acceptance).

## 24. Effects

Resource Access shall report consequential mutations using the DD-1.2 effect model.

Applicable resource effects include:

- created;
- updated/replaced;
- deleted;
- moved/renamed;
- container created;
- container deleted;
- temporary/staging artefact created/removed where materially relevant.

<a id="dd-res-062"></a>

### DD-RES-062 — Proposed and applied effects remain distinct

Resource preview, prepared content and staged candidates use [DD-1.2 Proposed Effects and Preview](../dd_1_application_core/dd-1-2-execution-outcomes-detailed-design-v01.md#_13-proposed-effects-and-preview) until an actual target effect is observed.

<a id="dd-res-063"></a>

### DD-RES-063 — Effect certainty

Where provider failure leaves the final resource state uncertain, the effect evidence shall report uncertainty rather than asserting success or rollback without evidence.

## 25. Effective Configuration Consumption

Resource Access may require effective configuration for technical concerns such as provider selection, encoding defaults, read limits, or other approved capability parameters.

<a id="dd-res-064"></a>

### DD-RES-064 — Governed configuration only

AppManager-level resource parameters consume [DD-1.4 effective values](../dd_1_application_core/dd-1-4-configuration-resolution-detailed-design-v01.md#_15-resolution-result); provider-local defaults are bounded by DD-RES-065.

<a id="dd-res-065"></a>

### DD-RES-065 — Provider defaults are bounded

A provider may use intrinsic technical defaults only where the Resource Access contract permits them and those defaults do not redefine AppManager application semantics, scope or safety.

## 26. Provider Contract

A Resource Provider implements concrete access to one resource system such as the local filesystem or a future test/virtual/provider-backed resource store.

<a id="dd-res-066"></a>

### DD-RES-066 — Provider responsibility

A provider owns technical mechanics such as:

- opening/reading/writing;
- metadata acquisition;
- directory/container traversal;
- provider-specific path resolution;
- move/rename primitives;
- temporary resource mechanics;
- provider error capture.

It does not own AppManager project scope, use-case policy or final outcomes.

<a id="dd-res-067"></a>

### DD-RES-067 — Provider replaceability

The Resource Access contract shall be testable and consumable without requiring callers to depend on provider-native types or one particular filesystem API.

<a id="dd-res-068"></a>

### DD-RES-068 — No speculative plugin framework

Resource provider replacement follows [Design](../appmanager-design-specification-v01.md#_6-6-capability-boundaries-and-providers) and the [Documentation Guide implementation boundary](../project-documentation-guide-v01.md#_8-level-4-implementation-specification); no executable plugin system is required.

## 27. Structured Resources and Format-Aware Operations

Historical implementation combines file I/O with JSON/JSONC parsing and update behaviour. That implementation is useful evidence but does not define the permanent capability boundary.

<a id="dd-res-069"></a>

### DD-RES-069 — Resource Access does not own structured merge semantics

Generic Resource Access shall not own schema validation, JSON object merging, JSONC comment-preserving edits, package metadata updates, Nuxt configuration mutation or source-aware transformation policy.

Such behaviour belongs to the capability/domain that understands the structure and shall delegate only the resulting bounded read/write operation to Resource Access.

<a id="dd-res-070"></a>

### DD-RES-070 — Structured read composition

A higher-level component may compose:

```text
Resource Access read
    -> parser / schema / Source Intelligence
    -> AppManager-oriented structured facts
```

without requiring Resource Access itself to become the parser authority.

<a id="dd-res-071"></a>

### DD-RES-071 — Structured mutation composition

A higher-level component may compose:

```text
Resource Access read + revision evidence
    -> structured transformation planning
    -> approval / policy
    -> bounded replacement content + stale precondition
    -> Resource Access replace
```

This preserves comment/format/schema-aware strategies where needed without embedding them into generic I/O semantics.

## 28. Interaction with Managed Project and Scope

<a id="dd-res-072"></a>

### DD-RES-072 — Scope supplied by caller

Supply resource targets under [DD-RES-008](#dd-res-008) and containment under [DD-RES-013](#dd-res-013); managed scope comes from [Design](../appmanager-design-specification-v01.md#_9-6-project-discovery-and-context-resolution).

<a id="dd-res-073"></a>

### DD-RES-073 — Technical rejection of out-of-bound targets

Apply [DD-RES-011](#dd-res-011), [DD-RES-013](#dd-res-013) and the fail-closed rule [DD-RES-084](#dd-res-084) to accessible but out-of-bound targets.

<a id="dd-res-074"></a>

### DD-RES-074 — No upward authority transfer

Writable/existing/contained evidence is consumed under [Design](../appmanager-design-specification-v01.md#_9-9-non-destructive-ownership-and-unmanaged-content) when assessing targetability.

## 29. Multi-Resource Operations

Resource Access may execute a caller-supplied set of bounded resource requests where this provides coherent technical value.

<a id="dd-res-075"></a>

### DD-RES-075 — Per-target evidence

Resource batches compose [DD-1.2 child results](../dd_1_application_core/dd-1-2-execution-outcomes-detailed-design-v01.md#_14-partial-completion) with each resource identity and effect.

<a id="dd-res-076"></a>

### DD-RES-076 — Ordering semantics

Where the caller requires an order, Resource Access shall preserve that order or explicitly report that the provider cannot guarantee it.

<a id="dd-res-077"></a>

### DD-RES-077 — Partial completion

On an interrupted batch, populate [DD-1.2 subordinate results](../dd_1_application_core/dd-1-2-execution-outcomes-detailed-design-v01.md#_14-partial-completion) for completed, failed, skipped and unattempted resources.

<a id="dd-res-078"></a>

### DD-RES-078 — No implicit compensation

Resource Access shall not automatically compensate earlier successful mutations after a later target fails unless compensation was explicitly requested and is supported by a separate approved contract.

## 30. Idempotence and Repeatability

Resource Access shall not assume all operations are idempotent.

<a id="dd-res-079"></a>

### DD-RES-079 — Operation-specific repeat semantics

Create, replace, delete, move and write requests shall define enough precondition/collision semantics for a repeated request to have deterministic technical behaviour.

<a id="dd-res-080"></a>

### DD-RES-080 — No application retry policy

Resource retryability evidence follows [DD-1.2 Retryability and Repetition Evidence](../dd_1_application_core/dd-1-2-execution-outcomes-detailed-design-v01.md#_22-retryability-and-repetition-evidence); mutation-specific retry constraints remain DD-RES-032.

## 31. Testability Requirements

The design shall support capability-level verification independently of full AppManager workflows.

Tests should be able to verify at least:

- reference normalization;
- containment rejection;
- symlink/indirection boundary handling;
- resource-kind distinctions;
- read-only operations produce no intentional mutation;
- create/replace collision semantics;
- explicit parent-creation semantics;
- stale revision rejection;
- destination collision on move;
- recursive-delete explicitness;
- proposed/applied effect distinction;
- partial multi-resource evidence;
- cancellation before and between effects;
- provider error normalization;
- sensitive diagnostic minimization;
- replacement guarantee reporting;
- staging cleanup evidence;
- provider replaceability with a deterministic fake/in-memory provider.

<a id="dd-res-081"></a>

### DD-RES-081 — Provider-independent conformance tests

Core Resource Access conformance tests shall be expressible against a provider contract without depending on Node.js `fs` exception classes or operating-system-specific error text.

<a id="dd-res-082"></a>

### DD-RES-082 — Real-provider tests where semantics differ

Provider-specific tests shall additionally verify behaviours whose guarantees depend on the concrete platform or provider, such as rename/replacement semantics, symlink handling, case behaviour and permission errors.

## 32. Security and Safety Invariants

The following invariants are mandatory:

<a id="dd-res-083"></a>

### DD-RES-083 — Accessibility is not authority

Apply [Design](../appmanager-design-specification-v01.md#_9-9-non-destructive-ownership-and-unmanaged-content) to technical resource accessibility.

<a id="dd-res-084"></a>

### DD-RES-084 — Effective target must be bounded

A consequential operation shall not proceed when the capability cannot establish that the effective target satisfies the request's required containment/indirection constraints.

<a id="dd-res-085"></a>

### DD-RES-085 — Read-only means no intentional mutation

Inspection and metadata access use the read-only request contract [DD-RES-004](#dd-res-004).

<a id="dd-res-086"></a>

### DD-RES-086 — No hidden overwrite

Use the create/replacement collision contract [DD-RES-005](#dd-res-005).

<a id="dd-res-087"></a>

### DD-RES-087 — No hidden recursive destruction

Use the distinct recursive-deletion request in [DD-RES-043](#dd-res-043) and [DD-RES-044](#dd-res-044).

<a id="dd-res-088"></a>

### DD-RES-088 — No provider-native authority

Resource-provider APIs and defaults apply [Design §6.2](../appmanager-design-specification-v01.md#_6-2-application-engine-authority); intrinsic technical defaults use [DD-RES-065](#dd-res-065).

<a id="dd-res-089"></a>

### DD-RES-089 — Sensitive minimization

Resource content propagation applies [DD-1.2 Sensitive Information and Redaction](../dd_1_application_core/dd-1-2-execution-outcomes-detailed-design-v01.md#_24-sensitive-information-and-redaction).

<a id="dd-res-090"></a>

### DD-RES-090 — Known effects survive failure

Resource failures/cancellation preserve effect evidence under [DD-1.2 Consequential Effects](../dd_1_application_core/dd-1-2-execution-outcomes-detailed-design-v01.md#_12-consequential-effects) and [DD-1.2 Cancellation Model](../dd_1_application_core/dd-1-2-execution-outcomes-detailed-design-v01.md#_17-cancellation-model); uncertain resource completion follows DD-RES-063.

## 33. Deferred Implementation Decisions

This Detailed Design intentionally does not choose:

- `node:fs` versus another filesystem library;
- exact TypeScript interfaces, classes or module layout;
- a dependency-injection framework;
- a virtual-filesystem package;
- concrete path-normalization library;
- exact hashing/fingerprinting algorithm;
- exact file-locking mechanism;
- exact temporary-file naming scheme;
- exact atomic-replacement primitive;
- stream versus buffer implementation thresholds;
- exact supported text encodings;
- concrete permission-bit model;
- exact Windows junction/reparse-point implementation;
- exact symlink-resolution algorithm;
- exact watch API;
- exact file descriptor handling;
- concrete cache strategy;
- a universal transaction framework;
- a general resource-provider plugin system;
- migration sequencing from the current `FileService`.

These belong to Implementation Specification, later Detailed Design where a permanent cross-capability contract genuinely requires them, project management where transitional, or ADR where a major architectural decision is introduced.

## 34. Current Implementation Evidence and Reconciliation

This section is historical implementation evidence under the [Documentation Guide reading conventions](../project-documentation-guide-v01.md#detailed-design-reading-conventions), not permanent product authority.

The current TypeScript `FileService` demonstrates useful implementation experience:

- asynchronous file reads and writes;
- existence checks;
- file deletion;
- parent-directory creation;
- JSON/JSONC parsing;
- JSONC-preserving modification;
- text append behaviour;
- whole-file overwrite fallback;
- temporary-file plus rename replacement;
- logging and provider-error handling.

Those behaviours are evidence, not architectural authority.

This Detailed Design deliberately does not preserve the current service boundary unchanged because several current responsibilities belong at different permanent layers:

| Current implementation concern | Permanent architectural placement |
|---|---|
| raw file read/write/delete/existence | Resource Access |
| path/provider mechanics | Resource Access provider |
| temporary-file replacement mechanics | Resource Access provider / staging responsibility |
| JSON/JSONC parsing | structured-resource handler / Source Intelligence / Settings or Configuration adapter as appropriate |
| Zod schema validation | owning structured-resource/configuration concern |
| JSON key merge/update policy | Source Transformation or owning Settings/resource use case |
| text append-if-not-present policy | owning use case/transformation semantics |
| overwrite fallback for unsupported formats | not a generic Resource Access default; requires explicit caller policy |
| application logging strings | Implementation/presentation/diagnostic projection concern |

The architectural conclusion is:

> **Retain proven I/O safety techniques where they satisfy the new contracts, but do not promote historical convenience methods into permanent application semantics.**

## 35. Traceability

### 35.1 Root Design and DD-1 traceability

| Resource Access area | Governing authority |
|---|---|
| application authority and delegated capability boundary | Root Design §§1–6; DD-1.5 |
| scope/targetability separation | Managed Project Functional Specification; DD-1.3 |
| effective configuration consumption | Configuration Functional Specification; [DD-1.4 bootstrap contract](../dd_1_application_core/dd-1-4-configuration-resolution-detailed-design-v01.md#_8-resolution-context) |
| outcomes, diagnostics, effects, partial completion | Application Invocation Functional Specification; DD-1.1; DD-1.2 |
| stale-state/application revalidation | DD-1.5 |
| provider-native isolation | ADR-0001; DD-1.2; DD-1.5 |

### 35.2 Functional traceability

Primary traceability includes:

- FR-PROJ-010, FR-PROJ-013–015, FR-PROJ-037–049, FR-PROJ-053–054;
- FR-CONFIG-017, FR-CONFIG-020–022, FR-CONFIG-053–057;
- FR-XFORM-004–010, FR-XFORM-015–025, FR-XFORM-033–058;
- FR-INV-011–013, FR-INV-022–026, FR-INV-030–047;
- Docs requirements covering target resolution, symlink safety, output collision, partial writes, exclusions, stale-source protection and fail-safe ambiguity;
- Settings requirements covering explicit read/write intent, managed scope, structured-resource preservation and delegated persistence;
- Nuxt, App, Git, AI, Quality and Maintenance requirements wherever bounded resource inspection or mutation is delegated beneath the owning use case.

### 35.3 Downstream traceability

Implementation mapping follows the [Documentation Guide](../project-documentation-guide-v01.md#_8-level-4-implementation-specification), covering the resource/provider seam, path handling, filesystem operations, staging and migration. Consumer collaborations are indexed in §36.

## 36. Contract Consumers and Implementation Dependencies {#_36-conformance-rules-for-later-dd-2-designs}

Consumers bind to the resource request, containment, revision and effect contracts defined here. The [Documentation Guide](../project-documentation-guide-v01.md#detailed-design-reading-conventions) governs same-level authority.

The collaborating contracts are [Process Execution](dd-2-2-process-execution-detailed-design-v01.md) for process effects, [Repository](dd-2-3-repository-capability-detailed-design-v01.md) for repository primitives, [Source Intelligence](dd-2-4-source-intelligence-detailed-design-v01.md) for read-only facts, [Source Transformation](dd-2-5-source-transformation-detailed-design-v01.md) for source plans, and [Registry/Templates](dd-2-6-resource-registry-and-template-detailed-design-v01.md) for rendered proposals. AI, Quality, Documentation and Nuxt consumers supply their locally resolved bounded resources through this contract; their own specifications define specialist intent/evidence.

## 37. Version 1 Resource Access Baseline

The [responsibility model](#_5-responsibility-model), request/reference contracts and operation sections establish the Resource Access baseline. For review, follow a supplied request through normalization, containment/preconditions, bounded provider work and returned evidence. Application interpretation consumes that evidence through [DD-1.2](../dd_1_application_core/dd-1-2-execution-outcomes-detailed-design-v01.md).
