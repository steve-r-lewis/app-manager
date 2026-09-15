# IS-5 — Process Execution Implementation Specification

> **Document type:** Level 4 Implementation Specification
>
> **Status:** Version 1 implementation baseline
>
> **Implementation ID:** IS-5
>
> **Primary Detailed Design:** [DD-2.2 — Process Execution](../dd_2_shared_capabilities/dd-2-2-process-execution-detailed-design-v01.md)
>
> **Related Detailed Design:** [DD-2.1 — Resource Access](../dd_2_shared_capabilities/dd-2-1-resource-access-detailed-design-v01.md)
>
> **Runtime decision:** [ADR-0001 — Primary Application Runtime](../project_management/decisions/adr-0001-primary-application-runtime.md)
>
> **Register:** [AppManager Implementation Specification](implementation-specification-v01.md)
>
> **Governing plan:** [Implementation Specification Plan](../project_management/implementation-specification-plan-v01.md)

## 1. Purpose

IS-5 defines the concrete Node.js/TypeScript implementation of the Version 1 Process Execution capability.

Its job is to launch and observe explicitly bounded external processes, normalize their technical lifecycle and I/O evidence, and propagate timeout/cancellation/termination requests without acquiring application or domain authority.

The governing implementation rule is:

> **Process Execution executes an already-authorized technical invocation and reports what technically happened; the owning capability or Application Engine decides what that evidence means for AppManager.**

Version 1 uses Node.js child-process primitives behind an AppManager-owned capability/provider seam. It does not introduce a process daemon, worker service, command framework, generic task runner or shell-command application API.

---

## 2. Scope and Non-Ownership

IS-5 owns the concrete implementation of:

- explicit direct-executable and explicitly authorized shell-mediated requests;
- ordered argument transport;
- explicit working-directory handling;
- inherited, modified or isolated child environments;
- bounded stdin modes;
- captured, streamed, inherited and discarded stdout/stderr modes;
- process launch/start/exit/signal evidence;
- output-size limits and truncation evidence;
- timeout observation and permitted termination escalation;
- `AbortSignal` cancellation propagation;
- bounded descendant/process-tree termination semantics where supported;
- normalized process/provider failures;
- process timing and correlation evidence;
- provider substitution and real Node child-process integration tests;
- migration of conforming mechanics out of the legacy `ProcessService` boundary.

IS-5 does **not** own:

- canonical AppManager command identity or use-case dispatch;
- managed-project identity, managed scope, targetability or authorization;
- configuration precedence or independent environment-file loading;
- executable/tool selection policy for Git, package managers, Quality, Nuxt, Docs or AI;
- Git/repository semantics;
- package-script eligibility;
- quality findings or pass/fail interpretation;
- readiness semantics for development/preview servers;
- retry/fallback policy;
- complete knowledge of filesystem, repository, network or remote effects caused by a child process;
- final DD-1.2 application outcomes;
- OS/container sandboxing.

A process running with a particular `cwd`, environment or OS identity is not thereby confined to managed scope. IS-5 does not claim filesystem/network/credential isolation that Node child processes do not actually provide.

---

## 3. Concrete Module Boundary

The target Version 1 source layout is:

```text
app/
└── capabilities/
    └── process_execution/
        ├── process-execution.ts
        ├── process-types.ts
        ├── process-errors.ts
        ├── environment-policy.ts
        ├── output-coordinator.ts
        └── node-process-provider.ts
```

This layout expresses one implementation responsibility. It does not require one object per DD-2.2 logical responsibility.

### 3.1 AppManager-facing contract

`process-execution.ts` shall export the `ProcessExecution` capability contract. General callers depend on AppManager-owned request/evidence types rather than `ChildProcess`, `SpawnOptions`, `ExecException`, Node event emitters or provider-native exceptions.

The Version 1 contract shall be structurally equivalent to:

```ts
export interface ProcessExecution {
  run(request: ProcessExecutionRequest): Promise<ProcessExecutionResult>;
}
```

One bounded `run()` contract replaces the historical semantic split between `execute(commandString)` and `spawn(command, args)`. Invocation form, I/O mode, timeout and termination policy are explicit request data rather than method-name side effects.

### 3.2 Provider boundary

`node-process-provider.ts` implements an internal `ProcessProvider` contract responsible for Node child-process mechanics only. The production provider shall use `node:child_process` `spawn()` as the primary primitive.

`exec()` is not the target generic primitive because it is intrinsically shell-mediated, buffers output by default and encourages command-string semantics. Shell execution remains possible, but only through an explicit shell request translated deliberately by the provider.

Provider-native process handles remain internal. The provider may expose a narrow internal handle to the capability implementation for kill/stream/lifecycle coordination, but it shall never cross the public Process Execution boundary.

Version 1 ships one production provider: the Node local-process provider. Tests use a deterministic fake provider. This seam exists for isolation and conformance testing, not dynamic provider discovery.

---

## 4. Execution Request Model

The public request shall be a discriminated union so direct and shell execution cannot be confused accidentally.

```ts
export type ProcessExecutionRequest =
  | DirectProcessRequest
  | ShellProcessRequest;

export interface DirectProcessRequest extends ProcessRequestCommon {
  readonly invocation: 'direct';
  readonly executable: string;
  readonly args: readonly string[];
}

export interface ShellProcessRequest extends ProcessRequestCommon {
  readonly invocation: 'shell';
  readonly command: string;
  readonly shell?: string;
}
```

`ProcessRequestCommon` carries only technical execution constraints:

```ts
interface ProcessRequestCommon {
  readonly cwd?: string;
  readonly environment?: ProcessEnvironmentRequest;
  readonly stdin?: ProcessStdinRequest;
  readonly stdout?: ProcessOutputRequest;
  readonly stderr?: ProcessOutputRequest;
  readonly timeoutMs?: number;
  readonly termination?: ProcessTerminationPolicy;
  readonly signal?: AbortSignal;
  readonly sensitivity?: ProcessSensitivity;
  readonly correlation?: ProcessCorrelation;
}
```

A request does not carry permission to invent another executable, add domain-significant arguments, change working directory or select fallback tooling.

### 4.1 Direct execution

Direct execution is the default and preferred form. The provider calls Node `spawn(executable, args, { shell: false, ... })` and preserves the ordered argument vector.

There is no platform-dependent automatic switch to `shell: true`. In particular, Windows does not receive blanket shell escalation merely because the host platform is `win32`.

Where a selected Windows tool is represented by a `.cmd`/`.bat` launcher and direct execution cannot faithfully launch it, the **owning tool-selection implementation** must deliberately construct an approved shell request or resolve a directly executable alternative. Process Execution shall not infer that policy from the executable name.

### 4.2 Shell execution

Shell execution is explicit. `command` is a shell-language string already authorized/constructed by the owning caller. Process Execution does not interpolate additional application values into it.

When `shell` is omitted, the Node provider may use the platform default shell as the requested provider behaviour. When a concrete shell path/name is supplied, it is passed as the explicit Node shell selection.

The result records that shell mediation was used. Diagnostics/logging do not need to reproduce the full command when it is sensitive.

### 4.3 Validation

Before provider launch, Process Execution rejects:

- empty executable identity for direct requests;
- empty shell command for shell requests;
- NUL-containing executable, argument, `cwd` or environment key/value data that Node cannot safely represent;
- negative/non-finite timeout or output limits;
- unsupported I/O/termination combinations;
- already-aborted requests before launch;
- malformed environment-removal/override instructions.

Invalid requests return normalized capability failure rather than relying on Node argument-validation exceptions as the public contract.

---

## 5. Working Directory and Resource Relationship

`cwd` is optional only when the owning invocation is genuinely independent of working location. If omitted, the Node provider inherits the host process working directory as a **technical provider default only**; the result records that the working context was inherited.

Application/domain code whose semantics depend on project location shall supply the resolved working directory explicitly. Process Execution shall never interpret inherited `process.cwd()` as managed-project identity.

Where the caller requires pre-launch evidence that a working directory exists, is a directory or is inside managed bounds, that evidence is obtained through IS-4/IS-2 or another owning boundary before constructing the request. IS-5 may still normalize a provider launch failure caused by an invalid/missing `cwd`; it does not independently derive managed scope.

IS-5 does not create missing working directories.

---

## 6. Environment Construction

The environment request is explicit:

```ts
export type ProcessEnvironmentRequest =
  | { readonly mode: 'inherit'; readonly set?: Readonly<Record<string, string>>; readonly remove?: readonly string[] }
  | { readonly mode: 'isolated'; readonly values: Readonly<Record<string, string>> };
```

`inherit` begins with a snapshot of `process.env` at request execution time, applies removals, then applies explicit values. `isolated` starts empty and includes only supplied values.

This is technical environment construction, not DD-1.4 configuration resolution. Process Execution shall not load `.env`, inspect package configuration or read AppManager settings to decide values.

Node permits inherited environment entries to be absent/undefined. Before spawn, the provider constructs a `NodeJS.ProcessEnv` containing only concrete string values.

Environment variable names and values marked sensitive by the caller are never reproduced in general diagnostics/events. The evidence may safely report mode and variable names only where sensitivity policy permits; values are omitted by default.

On Windows, environment-key case behavior is provider-native. Process Execution shall avoid creating duplicate case-variant keys when applying overrides/removals and shall test the chosen normalization on supported Windows CI. It shall not generalize Windows case folding into application configuration semantics.

---

## 7. Standard Input

Version 1 supports these stdin modes:

```ts
type ProcessStdinRequest =
  | { readonly mode: 'closed' }
  | { readonly mode: 'inherit' }
  | { readonly mode: 'text'; readonly value: string; readonly sensitive?: boolean }
  | { readonly mode: 'bytes'; readonly value: Uint8Array; readonly sensitive?: boolean };
```

`closed` is the default for deterministic/headless execution. This prevents an external tool from unexpectedly waiting on inherited interactive input.

`inherit` is permitted only when an owning interaction/use-case contract explicitly wants terminal interaction. It does not make Process Execution responsible for TUI semantics.

Supplied text is UTF-8 encoded by Node when written to the child's stdin. Byte input is written faithfully. The provider closes stdin after bounded supplied input is written.

Version 1 does not expose a general caller-managed writable stream or PTY/TTY abstraction. If an approved long-running interactive use case later requires a PTY, it requires a focused extension rather than pretending ordinary pipes provide terminal semantics.

---

## 8. Standard Output and Error

stdout and stderr are configured independently and remain distinct when Node exposes distinct channels.

```ts
type ProcessOutputRequest =
  | { readonly mode: 'capture'; readonly maxBytes?: number }
  | { readonly mode: 'stream'; readonly maxBytes?: number; readonly capture?: boolean }
  | { readonly mode: 'inherit' }
  | { readonly mode: 'discard' };
```

The default for both channels is bounded `capture` so Headless/domain consumers receive machine-usable evidence without terminal scraping.

### 8.1 Capture

Captured data is accumulated as bytes up to the effective per-channel limit and decoded as UTF-8 for the Version 1 text result. Resource limits come from request data or resolved capability configuration supplied through DD-1.4.

Output is **not trimmed**. Process Execution preserves observed text, including trailing newlines, because formatting may be tool evidence owned by the consumer.

If the limit is reached, the capability marks the channel truncated and stops retaining additional bytes. It shall continue draining/discarding the underlying pipe so the child cannot deadlock merely because capture reached its memory limit.

### 8.2 Stream events

`stream` publishes normalized events through an injected process-event sink/callback supplied by the caller/composition boundary. Each event carries:

- execution/correlation identity;
- channel (`stdout` or `stderr`);
- monotonically increasing per-execution sequence number assigned when the capability observes the chunk;
- timestamp where available;
- chunk text/bytes according to the event contract;
- sensitivity marker where supplied.

The sequence records observation order in AppManager; it does not claim a stronger OS-global ordering guarantee than Node provides between separate pipes.

When `capture: true`, streaming and bounded capture occur together. Event-delivery failure does not replace terminal process evidence; the event sink is best-effort unless an owning contract explicitly elevates delivery requirements.

### 8.3 Inherited/discarded output

`inherit` connects the child channel to the host descriptor for deliberate interactive/passthrough use. It produces no canonical captured content. `discard` uses an ignored descriptor.

Presentation passthrough is not canonical result evidence and shall never require a consumer to scrape the terminal.

---

## 9. Result and Lifecycle Evidence

The terminal capability result shall preserve launch, execution and termination distinctions:

```ts
export interface ProcessExecutionResult {
  readonly ok: boolean;
  readonly execution: ProcessExecutionEvidence;
  readonly failure?: ProcessFailure;
}
```

`ok` means the bounded Process Execution request itself reached a technically observed terminal state that the capability can represent. It does **not** mean exit code zero or AppManager application success. Launch/provider failures use `ok: false`; a normally observed non-zero process exit remains valid process evidence and may use `ok: true` with `termination.kind: 'exit'` and its actual code.

`ProcessExecutionEvidence` includes, as applicable:

- requested invocation form;
- safe executable/shell identity evidence;
- working-context mode/path where non-sensitive;
- launch attempted;
- started;
- provider process identifier only as bounded diagnostic evidence, never application identity;
- start/end timestamps and duration;
- termination evidence;
- timeout/cancellation participation;
- stdout/stderr evidence and truncation state;
- termination attempts;
- normalized diagnostics;
- correlation data;
- provider detail safe for diagnostics.

Termination is a discriminated union:

```ts
type ProcessTermination =
  | { readonly kind: 'exit'; readonly exitCode: number }
  | { readonly kind: 'signal'; readonly signal: string }
  | { readonly kind: 'indeterminate' };
```

A signal-terminated process never receives a fabricated fallback exit code such as `1` or `0`. Exit code and signal evidence remain semantically distinct.

The owning Git/Quality/Nuxt/Docs/App/etc. implementation interprets exit codes and output according to its tool semantics. IS-5 never universally maps exit code zero to final success or non-zero to final failure.

---

## 10. Failure Model

Expected capability/provider failures are normalized:

```ts
type ProcessFailureCode =
  | 'invalid_request'
  | 'executable_unavailable'
  | 'invalid_working_context'
  | 'environment_failure'
  | 'unsupported_invocation'
  | 'unsupported_io_mode'
  | 'launch_failure'
  | 'argument_limit'
  | 'io_failure'
  | 'output_limit'
  | 'timeout'
  | 'termination_failure'
  | 'cancelled_before_start'
  | 'observation_lost'
  | 'provider_failure';
```

Provider errors may retain safe bounded detail such as Node error `code`, `syscall` and platform, but callers shall not need to parse raw `Error`, `ErrnoException` or OS prose.

The Node provider shall normalize common launch conditions including `ENOENT`, `EACCES`/`EPERM`, invalid `cwd`, argument-size failures such as `E2BIG` where surfaced, and synchronous spawn validation failures.

A process that starts and exits non-zero does not become `launch_failure`; its exit remains termination evidence. Similarly, signal termination is lifecycle evidence unless a separate capability failure (for example termination failure/observation loss) occurred.

Programmer/invariant defects may throw. Expected process/provider states cross the capability boundary as normalized result/evidence.

---

## 11. Timeout

`timeoutMs` is optional. No hidden default timeout is imposed by IS-5; owning specifications or resolved capability configuration may supply one where appropriate.

When configured, Process Execution starts a monotonic-duration timer after launch is initiated. On expiry it records `timeoutReached`, then applies only the termination actions permitted by `ProcessTerminationPolicy`.

Timeout evidence distinguishes:

1. deadline reached;
2. graceful termination requested;
3. graceful termination observed or not observed;
4. stronger termination requested if permitted;
5. final observed termination or indeterminate state.

A timeout never implies rollback of external effects and is not proof that descendants stopped.

Timers are cleared when terminal state is known. Timer callbacks are invocation-local and shall not affect another execution.

---

## 12. Cancellation and Termination

Cancellation is linked through caller-supplied `AbortSignal`.

If the signal is already aborted before launch, Process Execution returns `cancelled_before_start` without spawning a process.

After start, cancellation records the observation and applies the request's termination policy. The default policy is intentionally conservative:

```ts
interface ProcessTerminationPolicy {
  readonly onCancel?: 'none' | 'graceful' | 'graceful_then_force';
  readonly onTimeout?: 'none' | 'graceful' | 'graceful_then_force';
  readonly gracefulSignal?: string;
  readonly forceSignal?: string;
  readonly gracePeriodMs?: number;
  readonly descendants?: 'none' | 'provider_supported_tree';
}
```

The composition/owning contract must deliberately permit stronger escalation. Process Execution shall not invent `SIGKILL`, `taskkill`, process-group or descendant-kill policy merely because cancellation occurred.

For the initial Node provider, ordinary direct process termination uses `child.kill()` with the requested supported signal. Platform/provider limitations are recorded honestly.

### 12.1 Process-tree semantics

Version 1 does not claim portable complete descendant termination by default. `descendants: 'none'` is the baseline.

`provider_supported_tree` may be implemented only where a concrete, tested Node/OS mechanism can provide the promised semantics. If unavailable on the current platform, the request fails validation as unsupported rather than silently degrading to immediate-child termination.

No detached/background mode is exposed in the initial public contract. An owning use case that genuinely requires a surviving child process must extend IS-5 deliberately with lifecycle-ownership semantics.

### 12.2 Cancellation race

If normal exit is observed before the cancellation callback obtains termination authority, the normal terminal evidence is preserved. If cancellation/termination was requested first but the process then exits naturally, both facts are preserved. The Application Engine/owner decides final application cancellation semantics.

Failure of `kill()` or inability to establish terminal state produces explicit termination/indeterminate evidence; cancellation is never treated as proof of death.

---

## 13. Concurrency and Isolation

Each `run()` invocation owns independent:

- provider handle;
- timers;
- abort listener;
- output buffers;
- sequence counter;
- correlation data;
- termination state.

Listeners/timers are removed on terminal completion to avoid leaks or cross-invocation callbacks.

IS-5 imposes no global serialization. If a resolved technical concurrency limit is later supplied for runtime protection, it may queue starts without changing caller ordering/acceptance semantics and must remain distinguishable from application concurrency policy.

Repository locks, build conflicts and domain-level mutual exclusion remain above IS-5.

---

## 14. Sensitive Data and Observability

Process requests may classify executable labels, individual arguments, environment variables, stdin and output channels/chunks as sensitive.

The capability shall never require reconstruction of a copy-pasteable command line for logs. Safe observability uses structured fields such as execution identity, executable basename/opaque label, argument count, invocation form, `cwd` classification, lifecycle state and duration.

Sensitive argument values, environment values and stdin are omitted/redacted. Captured output is returned only to the authorized caller under the request contract and is not automatically copied into generic logs.

An injected subordinate observability dependency may receive safe lifecycle events. Structured Process Execution evidence remains authoritative; logger strings do not become machine semantics. The target implementation shall not import the legacy logger singleton.

---

## 15. Configuration and Dependency Wiring

Process Execution consumes already-resolved technical configuration through construction/request data. It shall not read `.env`, AppManager settings or competing environment configuration directly.

An initial capability configuration may be:

```ts
interface ProcessExecutionConfig {
  readonly defaultMaxStdoutBytes: number;
  readonly defaultMaxStderrBytes: number;
}
```

IS-23's composition root constructs:

```text
NodeProcessProvider
        |
        v
DefaultProcessExecution
        |
        v
approved capability/domain/application consumers
```

The public interface is injected into consumers. No module-level singleton or service locator is required.

IS-23 remains authoritative for the Node.js/TypeScript, ESM/NodeNext, pnpm, compiled `dist/`, launcher and composition-root decisions. IS-5 does not reopen them.

---

## 16. Domain and Capability Composition

IS-5 is intentionally generic about tool meaning.

Repository Capability may construct direct Git invocations or use another repository provider under IS-6. If it uses IS-5, Git exit/output interpretation remains IS-6/domain-owned.

App lifecycle may invoke the package manager or approved project-declared scripts. The owning App implementation selects the package manager, determines script eligibility and interprets lifecycle acceptance before constructing the bounded process request.

Quality, Documentation and Nuxt capabilities similarly own tool selection, readiness/findings/acceptance and any tool-specific exit-code semantics.

An AI implementation may invoke a local CLI through IS-5, but model/provider semantics and response validation remain IS-10/owning use case concerns.

Two consumers using the same executable do not acquire shared semantic ownership merely because IS-5 provides the same process mechanism.

---

## 17. Testing and Conformance

Vitest remains the Version 1 test runner under IS-23.

### 17.1 Provider-independent tests

A deterministic fake provider shall verify:

1. direct execution preserves executable and ordered arguments;
2. direct execution never silently enables a shell;
3. shell execution requires the shell request variant;
4. invalid requests fail before launch;
5. explicit `cwd` is preserved and inherited `cwd` is labelled as technical inheritance only;
6. inherited/isolated environment construction and removal/override semantics;
7. sensitive environment/argument/stdin data is excluded from diagnostics;
8. stdin defaults closed and supplied input closes after write;
9. stdout/stderr remain distinct;
10. captured output is not trimmed;
11. output truncation is explicit and pipes continue draining;
12. streaming events are correlated/sequenced without becoming terminal result authority;
13. launch failure differs from non-zero exit;
14. zero and non-zero exits preserve exact exit code;
15. signal termination has no fabricated exit code;
16. already-aborted requests do not launch;
17. cancellation during execution applies only permitted termination policy;
18. timeout and cancellation participation remain distinct;
19. escalation occurs only when explicitly permitted;
20. termination failure/indeterminate state is explicit;
21. completion/cancellation races preserve observed evidence;
22. concurrent invocations do not share handles, buffers, timers or correlation;
23. provider errors are normalized without leaking native exceptions;
24. no implicit retry or fallback executable occurs.

### 17.2 Real Node process integration tests

Real-provider tests shall launch controlled Node fixture processes rather than relying on arbitrary host-installed tools. Fixtures under the test tree shall support deterministic behaviours such as:

- print distinct stdout/stderr and exit zero;
- exit with a selected non-zero code;
- echo supplied argv/environment/stdin safely;
- wait until terminated;
- ignore or delay graceful termination where the platform permits;
- emit output beyond configured capture limits.

Integration tests verify:

- actual `spawn()` direct argument transport;
- actual environment/cwd handling;
- actual pipe capture and streaming;
- timeout/cancellation lifecycle;
- signal evidence on supported platforms;
- executable-unavailable normalization;
- cleanup of timers/listeners/handles;
- Windows/POSIX differences without asserting provider-native error prose.

Platform-specific expectations shall be conditional and test the AppManager contract, not incidental OS wording.

### 17.3 Application acceptance tests remain above

IS-5 tests do not assert that `exitCode === 0` means an AppManager use case succeeded. Tool-specific interpretation belongs to the owning IS and final acceptance to IS-1/DD-1.5.

---

## 18. Legacy Implementation Disposition

The current implementation contains useful process experience but its method shapes and defaults are not target architecture.

| Current artefact / responsibility | Disposition | Target owner/location | Preserved value | Required change |
|---|---|---|---|---|
| `app/services/processService.ts` use of async Node child processes | RETAIN / ADAPT | IS-5 Node provider | non-blocking process lifecycle | move behind provider seam and normalized request/result model |
| `spawn(command, args)` ordered argument transport | RETAIN / ADAPT | IS-5 direct execution | correct structured argv concept | make direct execution explicit and always `shell: false`; add I/O/lifecycle/cancellation evidence |
| `execute(command)` via `exec()` | SPLIT / REPLACE | explicit shell request in IS-5 | demonstrates shell-command need | remove generic command-string method; use `spawn` provider primitive and explicit shell-mediated variant |
| rejection of `execute(..., { shell: false })` | RETAIN as invariant / REPLACE shape | request validation | correctly refuses impossible guarantee | discriminated request makes impossible state unrepresentable instead of runtime method mismatch |
| Unix default `shell: false` | RETAIN | IS-5 direct execution | safe direct execution | becomes platform-independent direct default |
| Windows automatic `shell: true` | REPLACE | owning tool selection + explicit shell request | historical operability evidence | no blanket shell escalation; caller deliberately requests shell when selected Windows tool requires it |
| `ProcessExecuteOptions.cwd || process.cwd()` | ADAPT | IS-5 working context | supports explicit cwd | distinguish explicit vs inherited technical context; never managed-project authority |
| `{ ...process.env, ...options.env }` | RETAIN / ADAPT | environment policy | useful inherited-env merge | add isolated mode, removals, sensitivity, concrete string filtering and Windows key handling |
| `timeout` passed to `exec()` only | REPLACE | IS-5 timeout coordinator | timeout need is valid | uniform timeout semantics for all invocations with explicit termination evidence/escalation |
| `spawn()` `stdio: 'inherit'` | REPLACE as default / RETAIN as explicit mode | output/stdin coordinator | interactive passthrough remains useful | default to closed stdin + bounded capture; inherit only when explicitly requested |
| `execute()` stdout/stderr trimming | REPLACE | output coordinator | none as generic evidence rule | preserve observed output exactly; interpretation/normalization belongs to consumer |
| `spawn()` signal fix | RETAIN / STRENGTHEN | lifecycle normalizer | correctly distinguishes signal termination | represent signal as discriminated termination with no fabricated exit code |
| `spawn()` error Promise rejection | ADAPT | normalized failure model | launch errors remain distinct | convert expected provider failures to stable `ProcessFailure` evidence |
| logger debug command reconstruction | REPLACE / ADAPT | subordinate observability | lifecycle logging useful | structured safe logging; no required full command/secret exposure; no logger singleton |
| module-level `processService` singleton | REPLACE | IS-23 composition root | simple legacy access | explicit construction/injection |
| `ProcessPackageManager` in process-service types | SPLIT / RELOCATE | App/tool-selection owning implementation | package-manager vocabulary may be useful | package-manager policy is not Process Execution responsibility |
| `ProcessResult { stdout, stderr, exitCode, signal }` | RETAIN / REPLACE | IS-5 evidence types | useful core observations | add launch/start/timing/truncation/cancel/timeout/failure distinctions; exit/signal discriminated |
| `tests/unit/services/processService.test.ts` | SPLIT / RELOCATE | IS-5 unit/integration suites | good regression evidence for shell boundary, env/cwd and signals | rewrite around provider seam and DD-2.2 invariants; remove Windows implicit-shell expectation |
| Git/other consumers that directly depend on process wrapper semantics | ADAPT as encountered | owning IS-6+ implementations | evidence of reusable execution need | inject Process Execution only where chosen provider needs it; keep tool/domain interpretation above IS-5 |

No production source is changed merely by approving IS-5. The migration is performed during implementation and coordinated with downstream owning specifications.

---

## 19. Migration Sequence

Implementation should proceed in this order:

1. add Process Execution request/result/failure types and fake-provider contract;
2. implement validation and environment construction;
3. implement output coordinator with bounded capture/draining and event sequencing;
4. implement Node `spawn()` provider for direct execution;
5. add explicit shell-mediated provider translation;
6. implement lifecycle normalization with exact exit-versus-signal evidence;
7. implement timeout, `AbortSignal` cancellation and permitted termination escalation;
8. add deterministic fixture-process integration tests on supported platforms;
9. wire `DefaultProcessExecution` through the IS-23 composition root;
10. migrate downstream consumers as IS-6 through IS-21 specify their tool/provider semantics;
11. remove `IProcessService`, `ProcessExecuteOptions`, the singleton and legacy tests after all callers migrate.

A transitional adapter may exist while consumers migrate, but it must not be used to preserve automatic Windows shell escalation, command-string authority, implicit interactive I/O, output trimming or Boolean/exit-code application semantics in the new capability.

---

## 20. Traceability

| DD-2.2 area | IS-5 implementation |
|---|---|
| DD-PROC-001–004 | discriminated bounded request with common technical constraints and correlation only |
| DD-PROC-005–008 | explicit executable identity, caller-owned resolution and safe launched-tool evidence |
| DD-PROC-009–013 | direct/shell request union, no silent shell escalation and explicit provider shell selection |
| DD-PROC-014–017 | ordered argv, no reinterpretation, sensitivity and normalized argument-limit failure |
| DD-PROC-018–021 | explicit/inherited working-context distinction; no project/sandbox authority |
| DD-PROC-022–027 | inherited/isolated environment policy, removals/overrides and secret minimization |
| DD-PROC-028–030 | closed/inherited/text/bytes stdin with explicit interactivity and sensitivity |
| DD-PROC-031–037 | distinct stdout/stderr, bounded capture, streaming, inheritance/discard and truncation evidence |
| DD-PROC-038–045 | launch/start/exit/signal/indeterminate lifecycle and provider-native isolation |
| DD-PROC-046–049 | executable-unavailable/unsupported invocation evidence and no substitution |
| DD-PROC-050–054 | explicit timeout timer, termination path and honest descendant/effect limits |
| DD-PROC-055–061 | `AbortSignal`, explicit graceful/force policy, race preservation and termination failure |
| DD-PROC-062–068 | no default tree guarantee/detached mode; explicit interactive I/O; readiness remains upstream |
| DD-PROC-069–071 | correlated sequenced stream/lifecycle events independent of terminal evidence |
| DD-PROC-072–077 | stable failure codes, safe provider detail and no implicit retry/fallback |
| DD-PROC-078–081 | invocation-local handles/buffers/timers and no universal application serialization |
| DD-PROC-082–086 | direct execution preference, no command reconstruction, sensitive minimization and no sandbox claim |
| DD-PROC-087–089 | process evidence distinct from DD-1.2 final outcome/effect interpretation |
| DD-PROC-090–093 | owning App/domain tool and package-manager policy before bounded execution |
| DD-PROC-094–098 | AppManager provider seam over Node `spawn()` without speculative transport/framework |
| DD-PROC-099–101 | fake-provider deterministic tests plus controlled real Node fixture-process tests |

IS-5 also conforms to DD-1.2 by returning technical evidence rather than final application outcomes, DD-1.3 by not deriving managed scope from `cwd`, DD-1.4 by consuming resolved technical configuration, DD-1.5 by leaving policy/retry/final acceptance above the capability, IS-4 by not treating filesystem reachability as execution authority, ADR-0001 by isolating Node-native representations, and IS-23 by using the settled Node.js/TypeScript runtime and explicit composition root.

---

## 21. Version 1 Implementation Baseline

The Version 1 Process Execution implementation is:

```text
Application Engine / owning capability
  resolves intent, scope, tool selection, policy and authorization
        |
        v
bounded direct or shell ProcessExecutionRequest
        |
        v
DefaultProcessExecution
  validate -> environment/I/O -> launch -> observe -> timeout/cancel -> normalize
        |
        v
NodeProcessProvider
  node:child_process spawn + bounded process mechanics
        |
        v
ProcessExecutionEvidence / ProcessFailure / output events
        |
        v
owning capability / Application Engine interpretation
```

The non-drift rule is:

> **Version 1 Process Execution is a bounded external-process mechanism and evidence boundary, not a shell-command authority, tool-selection service, package-manager policy, sandbox or application outcome engine.**
