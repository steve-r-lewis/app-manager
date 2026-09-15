# IS-4 — Resource Access Implementation Specification

> **Document type:** Level 4 Implementation Specification
>
> **Status:** Version 1 implementation baseline
>
> **Implementation ID:** IS-4
>
> **Primary Detailed Design:** [DD-2.1 — Resource Access](../dd_2_shared_capabilities/dd-2-1-resource-access-detailed-design-v01.md)
>
> **Runtime decision:** [ADR-0001 — Primary Application Runtime](../project_management/decisions/adr-0001-primary-application-runtime.md)
>
> **Register:** [AppManager Implementation Specification](implementation-specification-v01.md)
>
> **Governing plan:** [Implementation Specification Plan](../project_management/implementation-specification-plan-v01.md)

## 1. Purpose

IS-4 defines the concrete Node.js/TypeScript implementation of the Version 1 Resource Access capability.

Its job is to provide bounded local-filesystem inspection, reading, enumeration and mutation beneath authoritative callers while preserving DD-2.1's distinction between technical filesystem access and application authority.

The governing implementation rule is:

> **Resource Access receives an explicit bounded technical request, performs only that request under its supplied constraints, and returns normalized technical evidence. It does not decide whether AppManager should target or accept the resource operation.**

Version 1 therefore uses the Node.js filesystem directly behind an AppManager-owned capability/provider seam. It does not introduce a generic storage framework, cloud/object-store support, dynamic provider plugins or a filesystem-shaped application service.

---

## 2. Scope and Non-Ownership

IS-4 owns the concrete implementation of:

- AppManager resource references for local filesystem targets;
- explicit path bases and caller-supplied containment roots;
- path normalization and effective-target containment verification;
- file, directory, symbolic-link and unsupported-kind inspection;
- bounded text and byte reads;
- bounded directory enumeration;
- explicit create, replace, delete and move operations;
- explicit directory creation and directory deletion;
- mutation preconditions and stale-state checks;
- same-directory staged replacement for requested atomic file replacement;
- normalized filesystem failure/evidence models;
- resource effects returned as technical evidence;
- cancellation observation at safe filesystem-operation boundaries;
- deterministic provider doubles and real-filesystem conformance tests;
- migration of conforming mechanics out of the legacy `FileService` boundary.

IS-4 does **not** own:

- Managed Project identity, managed scope, targetability or authorization;
- configuration precedence or persistence semantics;
- JSON/JSONC parsing, Zod validation or structured merge/update policy;
- source parsing, transformation planning or format-preserving source edits;
- template identity/rendering or registry semantics;
- Settings-domain CRUD semantics;
- repository, Nuxt, documentation, quality, AI or domain intent;
- application retry, final acceptance or canonical application outcomes;
- a generic Utils/helper authority.

The composition root established by IS-23 constructs the concrete Resource Access implementation and supplies it to approved consumers. Importing a Resource Access module shall not create application-semantic global state.

---

## 3. Concrete Module Boundary

The target Version 1 source layout is:

```text
app/
└── capabilities/
    └── resource_access/
        ├── resource-access.ts
        ├── resource-types.ts
        ├── resource-errors.ts
        ├── path-policy.ts
        └── node-filesystem-provider.ts
```

This is one implementation responsibility, not a requirement for one class per DD-2.1 logical responsibility.

### 3.1 Public capability contract

`resource-access.ts` shall export the AppManager-facing `ResourceAccess` interface and a concrete implementation assembled over a provider. General callers depend on `ResourceAccess`, not on `node:fs`, `Dirent`, `Stats`, Node error classes or provider-specific path objects.

The Version 1 interface shall be structurally equivalent to:

```ts
export interface ResourceAccess {
  inspect(request: InspectResourceRequest): Promise<ResourceResult<ResourceInspection>>;
  read(request: ReadResourceRequest): Promise<ResourceResult<ResourceRead>>;
  enumerate(request: EnumerateResourceRequest): Promise<ResourceResult<ResourceEnumeration>>;
  create(request: CreateResourceRequest): Promise<ResourceResult<ResourceEffectEvidence>>;
  replace(request: ReplaceResourceRequest): Promise<ResourceResult<ResourceEffectEvidence>>;
  delete(request: DeleteResourceRequest): Promise<ResourceResult<ResourceEffectEvidence>>;
  move(request: MoveResourceRequest): Promise<ResourceResult<ResourceEffectEvidence>>;
  createDirectory(request: CreateDirectoryRequest): Promise<ResourceResult<ResourceEffectEvidence>>;
  deleteDirectory(request: DeleteDirectoryRequest): Promise<ResourceResult<ResourceEffectEvidence>>;
}
```

There is deliberately no generic `update(path, unknown)` operation. DD-2.1 requires callers that understand structure or transformation semantics to produce final bounded content and then request `create` or `replace` with explicit preconditions.

### 3.2 Provider contract

`node-filesystem-provider.ts` implements a narrow internal `ResourceProvider` contract used by Resource Access. The provider owns Node filesystem mechanics only: `lstat`/`stat`, `realpath`, `readFile`, `readdir`, `mkdir`, `writeFile`, `rename`, `unlink`, `rm` where explicitly requested, and temporary/staging mechanics.

The provider contract shall use AppManager-owned request/result records. Node `Stats`, `Dirent`, `Buffer` implementation details and `NodeJS.ErrnoException` shall be converted before crossing the provider boundary.

Version 1 ships one production provider: the local Node filesystem provider. A deterministic fake provider exists for tests. This seam is replaceability for testing and architectural isolation, not a runtime provider marketplace.

---

## 4. Resource References and Paths

### 4.1 Resource reference

A filesystem resource reference shall use an explicit record rather than an unqualified path string:

```ts
export interface FileResourceRef {
  readonly kind: 'file_system';
  readonly path: string;
  readonly base?: string;
  readonly logicalId?: string;
  readonly sensitivity?: ResourceSensitivity;
}
```

`path` is caller-supplied location information, not AppManager project identity. Relative `path` values are valid only when `base` is explicitly supplied. Resource Access shall never substitute `process.cwd()` as an implicit base.

`logicalId` is opaque correlation supplied by an upstream owner; Resource Access does not derive or reinterpret it.

### 4.2 Containment

Operations whose request requires containment carry one or more explicit absolute containment roots. Mutation requests shall require a containment root unless an upstream contract explicitly marks the target as intentionally uncontained for a narrowly approved technical reason. Ordinary AppManager project mutation shall always be contained.

`path-policy.ts` shall:

1. resolve the supplied path against its explicit base when relative;
2. apply `path.resolve()`/`path.normalize()` lexical normalization;
3. reject NUL-containing or otherwise invalid Node filesystem paths;
4. compare path components using `path.relative()` semantics rather than string-prefix matching;
5. obtain effective existing-target/ancestor paths with `realpath()` when indirection can affect containment;
6. verify both lexical and effective containment as required by the request's link policy.

Containment comparison must not use `startsWith(root)` because `/project-other` is not contained by `/project`.

### 4.3 Link policy

The request shall use an explicit link policy:

```ts
type ResourceLinkPolicy =
  | 'reject_links'
  | 'allow_links_within_containment';
```

Version 1 does not provide a general `allow_external_links` mode for ordinary project operations.

`reject_links` rejects a target or traversed existing path component when the operation would act through symbolic-link indirection. `allow_links_within_containment` permits indirection only after the effective target is established and remains inside the supplied containment root.

For a new target whose final path does not yet exist, Resource Access shall resolve the nearest existing ancestor, verify that ancestor's effective location, then validate the remaining lexical suffix beneath it. This prevents a symlinked parent from silently escaping containment.

Windows junction/reparse-point behaviour shall be treated conservatively as indirection where Node exposes equivalent effective-path evidence. If the implementation cannot establish the required effective containment safely, the request fails closed with `indirection_violation` or `containment_violation` evidence.

---

## 5. Resource Kind, Inspection and Revision Evidence

The provider-independent kind model is:

```ts
type ResourceKind =
  | 'file'
  | 'directory'
  | 'symbolic_link'
  | 'other'
  | 'missing'
  | 'unknown';
```

`inspect()` returns structured evidence rather than a Boolean existence result. At minimum `ResourceInspection` carries:

- supplied reference;
- normalized absolute path;
- effective path when safely determinable;
- resource kind;
- accessibility state;
- byte size when available;
- modification time in milliseconds when available;
- link/indirection evidence;
- revision evidence;
- sensitivity classification carried from the request.

The Version 1 revision token shall be an opaque AppManager string produced from provider metadata sufficient for compare-before-mutation. For the Node provider the initial token is derived from stable serialized `dev`, `ino`, `size`, `mtimeMs` and `ctimeMs` metadata when available. Callers must treat it as opaque and equality-only.

The token is stale-state evidence, not a cryptographic content identity. A higher-level transformation that requires stronger content identity may additionally retain the bytes/text it read or request a content fingerprint from its own implementation. IS-4 shall not make whole-file hashing mandatory for every inspection.

Missing, inaccessible and wrong-kind states shall remain distinguishable. The legacy `exists(): boolean` contract is not part of the target capability.

---

## 6. Read and Enumeration

### 6.1 Content modes

A read request explicitly selects:

```ts
type ResourceReadMode =
  | { readonly kind: 'text'; readonly encoding?: 'utf8' }
  | { readonly kind: 'bytes' };
```

UTF-8 is the only text decoding required for Version 1. Callers needing another encoding must either request bytes and own decoding above Resource Access or introduce a later approved requirement. Resource Access shall not infer JSON, JSONC, Markdown, source-code or configuration semantics from extension.

Text reads return a string exactly as decoded; byte reads return `Uint8Array`. Resource Access does not normalize newlines, trim content, parse structure or validate schemas.

### 6.2 Bounded reads

`ReadResourceRequest` shall permit an explicit `maxBytes`. A resolved capability configuration may supply a default read limit through DD-1.4; Resource Access shall not read environment variables or settings directly.

Before an in-memory read, known file size is compared with the effective limit. If size is unknown, the provider must still enforce the limit during acquisition or fail with `resource_too_large`. Version 1 does not require a public streaming API because no approved Version 1 consumer currently requires streamed filesystem content. A future streaming need may extend IS-4 without changing DD-2.1 semantics.

### 6.3 Enumeration

Enumeration begins from one explicit directory reference and supports:

- recursive true/false;
- optional maximum depth;
- optional maximum result count;
- kind filters;
- caller-supplied relative-path exclusions;
- link policy.

Results are AppManager resource-entry evidence containing normalized child references and kinds. Enumeration shall not infer managed scope or mutability.

Traversal uses iterative/asynchronous Node filesystem calls and stops before exceeding requested depth/result bounds. Exclusions are normalized relative to the enumeration root and cannot re-enter through permitted indirection.

---

## 7. Mutation Requests and Preconditions

All mutations use explicit operation-specific requests. The common mutation fields are structurally equivalent to:

```ts
interface ResourceMutationConstraints {
  readonly containmentRoot: string;
  readonly linkPolicy: ResourceLinkPolicy;
  readonly expected?: ResourcePrecondition;
  readonly createParents?: boolean;
  readonly signal?: AbortSignal;
  readonly correlationId?: string;
}
```

`AbortSignal` is supplied by the caller/application cancellation chain; Resource Access never creates an independent application cancellation policy.

Supported preconditions include:

```ts
interface ResourcePrecondition {
  readonly existence?: 'must_exist' | 'must_not_exist' | 'any';
  readonly kind?: 'file' | 'directory';
  readonly revision?: string;
}
```

Destination operations may carry an independent destination precondition.

Immediately before the first consequential provider operation, Resource Access re-inspects the target as needed and evaluates supplied preconditions. A revision mismatch produces `stale_state`; create collision produces `already_exists`; wrong kind remains `wrong_kind`.

No stale-state mismatch is automatically retried. The owning use case decides whether to refresh, re-plan or retry.

### 7.1 Parent creation

`createParents` defaults to `false`. When true, Resource Access may create only the missing parent chain required for the explicit target and only inside the validated containment root. Parent creation effects shall be reportable when materially consequential.

### 7.2 Create

`create()` requires `must_not_exist` semantics. It shall not silently replace an existing target. File content is supplied explicitly as text or bytes.

### 7.3 Replace

`replace()` requires an existing regular-file target unless the caller explicitly uses a separately modelled create-or-replace request added by a later owning specification. Version 1 generic Resource Access does not collapse create and replace.

A replacement may request:

```ts
type ReplacementGuarantee = 'atomic_single_file' | 'best_effort';
```

`atomic_single_file` uses the staging mechanics in Section 8. If the provider cannot support the requested guarantee for the target, Resource Access returns `unsupported_guarantee` rather than silently weakening it.

`best_effort` may use direct provider replacement mechanics but must report the guarantee actually achieved.

### 7.4 Delete

File deletion is distinct from directory deletion. `delete()` targets one file/link according to link policy and carries explicit missing-target semantics through the precondition. Absence is not globally success or failure.

### 7.5 Directory deletion

`deleteDirectory()` carries an explicit `recursive` flag. It defaults to `false`; non-empty deletion with `recursive: false` fails. Recursive deletion is never inferred from a generic delete request.

### 7.6 Move

`move()` validates source and destination independently, including containment, link policy, source revision and destination collision policy. Version 1 uses provider rename semantics only when source and destination are on a compatible local-filesystem boundary.

If Node reports a cross-device move (`EXDEV`), Resource Access returns `unsupported_operation`/`move_failure` evidence. It shall not silently convert the operation to copy-plus-delete.

---

## 8. Atomic Replacement and Staging

The useful legacy temporary-file-plus-rename mechanism is retained and strengthened.

For `atomic_single_file` replacement, the Node provider shall:

1. validate target and preconditions before staging;
2. create the staging file in the **same directory** as the target so rename remains on the same filesystem boundary;
3. use an unpredictable collision-resistant staging name, preferably `crypto.randomUUID()` or `randomBytes()`, rather than application semantics derived from the filename;
4. open/create the staging file with exclusive creation so an existing path is never reused;
5. write the supplied bytes/text faithfully;
6. preserve or deliberately apply target mode metadata where required by the request/implementation contract;
7. rename the staging file to the target only after the complete staging write succeeds;
8. attempt staging cleanup after pre-rename failure;
9. return secondary cleanup evidence if cleanup fails materially.

The guarantee is limited to one local filesystem resource and the observable provider rename semantics. IS-4 does not claim crash-proof durability to physical media, multi-file transactions or rollback. `fsync` of file/directory metadata is not required for the Version 1 default guarantee unless later durability requirements explicitly demand it.

For sensitive targets, staging inherits equivalent restrictive access posture as far as Node/provider mechanics permit. Temporary content is never logged.

---

## 9. Failure and Result Model

Expected technical failures are returned as normalized Resource Access evidence. Callers shall not need to catch and classify Node errno values for ordinary resource states.

The capability result is:

```ts
type ResourceResult<T> =
  | { readonly ok: true; readonly value: T; readonly evidence: ResourceExecutionEvidence }
  | { readonly ok: false; readonly failure: ResourceFailure; readonly evidence: ResourceExecutionEvidence };
```

`ResourceFailure` shall use stable AppManager-oriented codes including:

```ts
type ResourceFailureCode =
  | 'invalid_reference'
  | 'not_found'
  | 'already_exists'
  | 'wrong_kind'
  | 'inaccessible'
  | 'containment_violation'
  | 'indirection_violation'
  | 'stale_state'
  | 'unsupported_operation'
  | 'unsupported_guarantee'
  | 'encoding_failure'
  | 'resource_too_large'
  | 'read_failure'
  | 'write_failure'
  | 'delete_failure'
  | 'move_failure'
  | 'staging_failure'
  | 'cancelled'
  | 'provider_failure';
```

A failure carries safe resource/correlation context, retryability evidence where technically knowable, and bounded provider detail such as an errno code where useful. It does not expose arbitrary native exception objects as the contract.

The Node provider shall centrally map common errno conditions, including at least `ENOENT`, `EEXIST`, `EACCES`/`EPERM`, `ENOTDIR`, `EISDIR`, `ENOTEMPTY`, `EXDEV`, `ELOOP`, `ENAMETOOLONG` and unsupported-operation conditions, to the AppManager failure vocabulary. Unknown provider errors become `provider_failure` with safe bounded detail.

Programmer errors/invariant violations inside Resource Access may still throw. Expected filesystem state and provider failures shall use `ResourceResult`.

Resource Access results are DD-1.2-compatible technical evidence, not final `ExecutionOutcome` values. The Application Engine/use case performs application interpretation.

---

## 10. Effects, Evidence and Sensitivity

Successful mutations return resource effect evidence using the DD-1.2 effect vocabulary: created, replaced/updated, deleted, moved/renamed, directory created or directory deleted.

Effects carry logical identity when supplied, normalized location, pre/post revision evidence where available, and certainty. If provider failure leaves final state uncertain, the result records uncertainty rather than asserting rollback.

Inspection/read evidence may include resource metadata and byte length but shall not include content in generic diagnostics, logs or tracing.

Sensitivity supplied on a resource reference is propagated through evidence and failures. Sensitive locations should be minimized or redacted in human-facing detail; secret content, tokens, private keys and resource bytes/text shall never be included in routine log messages.

Resource Access may receive an injected subordinate observability dependency for implementation telemetry. Logging is optional to correctness and shall not replace structured results. The capability shall not import the legacy global logger singleton as its target design.

---

## 11. Concurrency and Cancellation

Resource Access does not introduce a universal lock manager.

Within one `ResourceAccess` instance, each request is independently asynchronous. Correctness for concurrent writers is obtained through explicit preconditions and latest-safe-point reinspection rather than a process-local mutex that would provide false protection against other processes.

Callers that require stronger application serialization coordinate it through IS-1/DD-1.5. A provider may use narrowly scoped internal synchronization only where necessary to protect its own staging bookkeeping; such synchronization must not become application retry or target-selection policy.

Cancellation uses `AbortSignal`:

- inspect/read/enumeration check before starting and between material traversal/read stages;
- mutations check before precondition evaluation and immediately before the consequential effect;
- if cancellation arrives after a non-interruptible rename/unlink has begun, the provider lets that bounded primitive settle and reports the known effect;
- multi-target callers stop scheduling further Resource Access requests; Resource Access itself does not infer compensation.

Node filesystem calls that support `AbortSignal` may receive it directly where semantics are safe. Unsupported cancellation of a provider primitive is represented by the safe-boundary behaviour above, not by claiming rollback.

---

## 12. Configuration and Dependency Wiring

Resource Access receives resolved technical configuration through construction or request parameters. It shall not read `process.env`, project settings files or global configuration singletons directly.

The initial configuration record may contain:

```ts
interface ResourceAccessConfig {
  readonly defaultMaxReadBytes: number;
}
```

Any future configuration concern must be approved by its owning specification and supplied as DD-1.4 effective configuration.

IS-23's composition root constructs:

```text
NodeFilesystemProvider
        |
        v
DefaultResourceAccess
        |
        v
approved capability/domain/application consumers
```

Consumers receive the AppManager-facing interface. Tests may inject a fake provider. No service locator or import-time singleton is required.

---

## 13. Structured Resource Composition

The current `FileService.read()` and `update()` combine filesystem mechanics with structured-resource semantics. IS-4 deliberately separates them.

The target structured-read composition is:

```text
ResourceAccess.read(text)
    -> owning JSON/JSONC/config/source parser
    -> owning schema/semantic validation
```

The target structured-mutation composition is:

```text
ResourceAccess.read(text + revision)
    -> Source Intelligence / structured handler
    -> Source Transformation or owning resource policy
    -> approved replacement text/bytes
    -> ResourceAccess.replace(expected revision)
```

Accordingly:

- `jsonc-parser` remains available to IS-8 or other approved structured-resource owners, not IS-4;
- Zod schema validation remains with the owner of the structured contract;
- append-if-not-present, key merging, formatting preservation and unsupported-extension overwrite fallback are not Resource Access behaviours;
- callers that currently use `fileService.write()` after reading source must migrate to explicit replacement with stale-state evidence where source preservation matters.

---

## 14. Testing and Conformance

Vitest remains the Version 1 test runner under IS-23.

### 14.1 Provider-independent unit tests

Tests against a deterministic fake provider shall verify:

1. relative paths require an explicit base;
2. lexical traversal outside containment is rejected;
3. string-prefix containment mistakes are impossible;
4. symlink/indirection escape is rejected;
5. permitted links remain inside containment;
6. kind evidence distinguishes file, directory, link, other, missing and unknown;
7. read/inspect/enumerate cause no intentional mutation;
8. text and byte reads preserve supplied content semantics;
9. read limits produce `resource_too_large`;
10. create rejects collisions;
11. replace rejects missing/wrong-kind targets;
12. parent creation occurs only when explicitly permitted;
13. revision mismatch produces `stale_state` before effect;
14. file delete and directory delete remain distinct;
15. recursive directory deletion requires explicit request;
16. move validates source and destination and rejects collisions;
17. cancellation before effect prevents mutation;
18. provider-native failures are normalized;
19. sensitive failures do not include content;
20. applied/uncertain effects remain represented after failure.

### 14.2 Real Node filesystem integration tests

Tests using temporary directories shall verify Node-specific semantics that mocks cannot establish reliably:

- same-directory staging and rename replacement;
- staging cleanup on failed replacement where reproducible;
- actual symlink containment behaviour on supported CI platforms;
- permission failures where the platform permits deterministic testing;
- `EXDEV` mapping where practical or provider-level simulation where not;
- directory non-empty deletion behaviour;
- real metadata/revision changes after replacement;
- path behaviour on supported Windows and POSIX CI environments.

Tests must not assert OS-specific prose. They assert AppManager failure codes/evidence.

### 14.3 Legacy tests

Existing `tests/unit/services/fileService.test.ts` tests are migration evidence, not the target suite. Tests for asynchronous reads, atomic replacement and error propagation should be adapted into Resource Access tests. Tests for JSONC parsing, Zod validation, JSON merge/update and text append move with their owning structured/transformation implementations.

---

## 15. Legacy Implementation Disposition

The legacy implementation contains good low-level mechanics but combines them with responsibilities that DD-2.1 assigns elsewhere.

| Current artefact / responsibility | Disposition | Target owner/location | Preserved value | Required change |
|---|---|---|---|---|
| `app/services/fileService.ts` asynchronous `node:fs/promises` mechanics | RETAIN / ADAPT | IS-4 Node filesystem provider | non-blocking filesystem access | move behind provider seam; use bounded requests/results; remove global singleton dependency |
| `fileService.ts` temporary-file + rename replacement | RETAIN / ADAPT | IS-4 staging/replacement | proven whole-file replacement pattern and cleanup attempt | same-directory exclusive staging; collision-resistant name; explicit guarantee; normalized cleanup evidence; no false durability claim |
| `fileService.ts` `readText()` UTF-8 acquisition | RETAIN / ADAPT | IS-4 read | simple asynchronous text read | explicit reference/base/containment, text mode, size limit, metadata/revision evidence, normalized failures |
| `fileService.ts` `exists()` Boolean | REPLACE | IS-4 inspection | convenient missing-state check | replace with structured kind/access/revision inspection; do not swallow every provider error as `false` |
| `fileService.ts` `delete()` ENOENT suppression | ADAPT | IS-4 delete | idempotent-delete mechanism can be useful | missing-target semantics become caller precondition; normalize other failures and return effect evidence |
| `fileService.ts` implicit recursive parent creation | ADAPT | IS-4 create/replace | useful `mkdir({recursive:true})` mechanism | parent creation must be explicit and contained rather than automatic for every write |
| `fileService.ts` JSON/JSONC parsing | SPLIT / RELOCATE | IS-7/IS-8, IS-3/IS-19 or owning structured-resource adapter | working `jsonc-parser` experience | Resource Access returns text/bytes only; parser/schema owner performs interpretation |
| `fileService.ts` Zod schema validation | SPLIT / RELOCATE | owning structured contract | useful runtime validation pattern | remove from generic resource reads |
| `fileService.ts` JSON key merge/comment-preserving update | SPLIT / RELOCATE | IS-8 Source Transformation or owning structured-resource implementation | useful surgical-edit mechanics | transformation owner plans edits; IS-4 applies bounded replacement with stale precondition |
| `fileService.ts` text append-if-not-present | SPLIT / RELOCATE | owning use case/transformation | useful historical behaviour for some resources | no generic extension-based append policy |
| `fileService.ts` unsupported-extension overwrite fallback | REPLACE | explicit caller create/replace semantics | none as a generic safety default | never infer destructive overwrite from unsupported format |
| `fileService.ts` extension-based `isJsonFile`/`isTextFile` policy | REPLACE in IS-4 | structured owners above IS-4 | extension recognition may remain useful to owners | Resource Access content mode is explicit and extension-neutral |
| `app/types/services/fileServiceTypes.ts` `IFileService` | REPLACE | `resource-types.ts` / `resource-access.ts` | asynchronous interface intent | replace path-string/unknown-content smart service with operation-specific bounded contracts |
| `app/types/services/fileServiceTypes.ts` `IFileHandler` and handler context/options | SPLIT / RELOCATE / REVIEW | structured-resource owners | evidence of handler abstraction needs | do not retain as generic Resource Access contract unless an owning IS demonstrates the semantic need |
| `app/services/codeService.ts` direct `fileService.read/write` | ADAPT / SPLIT | IS-7/IS-8/IS-12 plus IS-4 | asynchronous sequencing now correct | inject Resource Access/owning capabilities; read as evidence; transformation produces content; replace with revision precondition |
| `app/strategies/json/jsonStrategy.ts` JSONC surgical edits | RETAIN / ADAPT outside IS-4 | IS-8 or owning structured-resource implementation | comment/format-preserving edit technique | consume Resource Access text and return planned transformed text/edits; no direct filesystem authority |
| `tests/unit/services/fileService.test.ts` filesystem safety tests | SPLIT / RELOCATE | IS-4 tests plus owning structured-resource tests | useful coverage of async I/O, replacement and failures | rewrite around bounded contracts; move JSONC/schema/update-policy assertions to their owners |
| module-level `export const fileService = new FileService()` | REPLACE | IS-23 composition root | simple legacy access | explicit construction/injection; no import-time singleton as target architecture |
| direct legacy logger use in `FileService` | ADAPT | subordinate observability | useful diagnostics during development | structured result is authoritative; inject optional observability; no provider error prose as application semantics |

No production code is changed merely by approving IS-4. Migration occurs when implementation begins, allowing dependent IS work to move callers deliberately rather than creating an unreviewed compatibility layer that preserves the old semantic boundary indefinitely.

---

## 16. Migration Sequence

Implementation should proceed in this order:

1. add `resource-types.ts`, normalized failures and provider contract;
2. implement path normalization, containment and inspection against a fake provider;
3. implement the Node filesystem provider and real-provider inspection/read tests;
4. implement create/replace and strengthened same-directory staging;
5. implement delete, directory operations and move;
6. add enumeration, cancellation checks and provider-independent conformance tests;
7. wire `DefaultResourceAccess` in the IS-23 composition root;
8. migrate consumers as their owning Implementation Specifications are authored;
9. relocate JSON/JSONC and transformation behaviour to the owning implementations;
10. remove `IFileService`, the `FileService` singleton and legacy tests only after all callers have migrated.

A temporary adapter from selected legacy `IFileService` methods to Resource Access may be used during implementation if necessary to keep the branch buildable, but it is transitional only. It must not reintroduce implicit CWD authority, extension-based update policy or unbounded mutation into the new capability.

---

## 17. Traceability

| DD-2.1 area | IS-4 implementation |
|---|---|
| DD-RES-001–009 | explicit `FileResourceRef`, operation-specific bounded request types and least-authority mutation constraints |
| DD-RES-010–016 | `path-policy.ts`, explicit base, lexical/effective containment and link policy |
| DD-RES-017–022 | structured inspection, explicit text/bytes mode, UTF-8 baseline and bounded reads |
| DD-RES-023–026 | bounded enumeration root/depth/result/exclusion mechanics |
| DD-RES-027–033 | explicit preconditions, opaque revision token, latest-safe-point compare, no implicit retry/lock authority |
| DD-RES-034–042 | explicit parent creation, faithful content, create/replace split, staged same-directory replacement and honest guarantee reporting |
| DD-RES-043–050 | exact file/directory delete and source/destination move contracts; no hidden recursion/copy-delete |
| DD-RES-051–054 | propagated sensitivity, content minimization and sensitive staging posture |
| DD-RES-055–058 | `AbortSignal` observation at safe boundaries and known-effect reporting |
| DD-RES-059–063 | `ResourceResult`, stable failure codes and resource effect evidence |
| DD-RES-064–068 | resolved configuration injection, Node provider seam and no plugin framework |
| DD-RES-069–071 | JSON/JSONC/schema/transformation semantics relocated above Resource Access |
| DD-RES-072–080 | caller-supplied containment, no scope authority, deterministic operation preconditions and no retry policy |
| DD-RES-081–082 | fake-provider conformance tests plus real Node filesystem integration tests |
| DD-RES-083–090 | fail-closed containment, no hidden overwrite/recursive destruction, sensitive minimization and preservation of known effects |

IS-4 also conforms to DD-1.2 by returning technical evidence rather than final application outcomes, DD-1.3 by consuming rather than deriving managed bounds, DD-1.4 by consuming resolved technical configuration, DD-1.5 by leaving application policy/retry/acceptance above the capability, ADR-0001 by isolating Node-native representations, and IS-23 by using explicit composition in the settled Node.js/TypeScript runtime.

---

## 18. Version 1 Implementation Baseline

The Version 1 Resource Access implementation is therefore:

```text
Application Engine / owning use case
  resolves intent, project, scope, policy and authorization
        |
        v
explicit FileResourceRef + bounded request + preconditions
        |
        v
DefaultResourceAccess
  normalize -> contain -> inspect/precondition -> execute -> normalize evidence
        |
        v
NodeFilesystemProvider
  node:fs/promises + node:path + bounded staging mechanics
        |
        v
ResourceResult / metadata / effects / failures
        |
        v
owning use case / Application Engine interpretation
```

The non-drift rule is:

> **Version 1 Resource Access is a bounded local-filesystem capability, not a smart file editor, project-scope resolver, configuration system, transformation engine or generic storage framework.**
