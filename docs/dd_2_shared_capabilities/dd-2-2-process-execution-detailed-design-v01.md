# DD-2.2 — AppManager Process Execution Detailed Design

> **Detailed Design ID:** DD-2.2
>
> **Design family:** DD-2 — Shared Capabilities

> **Status:** Version 1 Detailed Design Specification
>
> **Detailed Design authority:** This document defines the permanent shared contracts for bounded execution and observation of external processes and command-line tools. It refines, but does not override, the root Design Specification, Functional Specifications, accepted ADRs, or the DD-1 Application Core Detailed Designs.
>
> **Governing sources:** [Project Documentation Guide](../project-documentation-guide-v01.md), [AppManager Design Specification](../appmanager-design-specification-v01.md), [Detailed Design Register](../project_management/detailed-design-register-v01.md), [ADR-0001 — Primary Application Runtime](../project_management/decisions/adr-0001-primary-application-runtime.md)
>
> **Related Detailed Design authorities:** [DD-1.1 — Application Invocation](../dd_1_application_core/dd-1-1-application-invocation-detailed-design-v01.md), [DD-1.2 — Execution Outcomes](../dd_1_application_core/dd-1-2-execution-outcomes-detailed-design-v01.md), [DD-1.3 — Managed Project](../dd_1_application_core/dd-1-3-managed-project-detailed-design-v01.md), [DD-1.4 — Configuration Resolution](../dd_1_application_core/dd-1-4-configuration-resolution-detailed-design-v01.md), [Application Core Bootstrap Resolution](../dd_1_application_core/dd-1-5-application-engine-detailed-design-v01.md#_8-orchestration-lifecycle), [DD-1.5 — Application Engine](../dd_1_application_core/dd-1-5-application-engine-detailed-design-v01.md), [DD-2.1 — Resource Access](dd-2-1-resource-access-detailed-design-v01.md)
>
> **Primary Functional authorities:** [docs/functional/application-invocation-functional-specification-v01.md](../functional/application-invocation-functional-specification-v01.md), [docs/functional/managed-project-functional-specification-v01.md](../functional/managed-project-functional-specification-v01.md), [docs/functional/configuration-functional-specification-v01.md](../functional/configuration-functional-specification-v01.md)
>
> **Related domain Functional authorities:** App, Docs, Git, Nuxt, Quality, AI, Settings and Maintenance Functional Specifications where those domains delegate bounded external-tool execution.

## 1. Purpose

Process Execution delegates bounded external-tool launches and observes their lifecycle. The request separates executable identity, structured arguments and explicit direct/shell form; the evidence distinguishes launch, output, termination, timeout and uncertainty. These distinctions let consuming domains interpret tool behavior without depending on a process API.

Application interpretation follows [DD-1.2 §19](../dd_1_application_core/dd-1-2-execution-outcomes-detailed-design-v01.md#_19-application-level-interpretation); the local contracts below define what the process boundary can observe and guarantee.

## 2. Scope

This design owns permanent internal contracts for:

- executable/tool invocation requests;
- executable identity and invocation form;
- argument transport;
- working execution context;
- environment construction and sensitive-value handling;
- standard input, output and error-channel modes;
- structured streaming output/events;
- captured output evidence;
- process start, running and termination state;
- exit-code and signal/termination normalization;
- launch/spawn failure representation;
- cancellation propagation and observation;
- graceful and stronger termination semantics;
- timeout/deadline semantics;
- non-shell versus shell execution boundaries;
- provider/tool unavailability evidence;
- bounded process-tree/descendant termination semantics where required;
- output limits and truncation evidence;
- timing evidence;
- provider-native process-result normalization into DD-1.2 evidence and diagnostics;
- invocation correlation;
- capability-level concurrency/isolation concerns;
- provider isolation and testability.

This design defines a capability contract. It does not prescribe one class, package, process library, operating-system API, event library, terminal library or concrete TypeScript interface.

---

## 3. Explicit Non-Ownership

Process Execution shall not own:

- canonical AppManager command/use-case identity;
- domain workflow semantics;
- managed-project identity or topology;
- managed-scope derivation;
- targetability or mutation authority;
- application confirmation/authorization policy;
- configuration-source precedence or effective-configuration resolution;
- package-manager selection policy merely because package managers are executable tools;
- project-script eligibility merely because a script can be invoked;
- repository semantics merely because Git is executable as a process;
- quality acceptance merely because a linter/test/typecheck process exits;
- documentation acceptance merely because a documentation tool exits;
- Nuxt application semantics merely because Nuxt tooling executes;
- AI acceptance merely because a local/external CLI returns output;
- retry, fallback or continuation policy unless explicitly delegated by an owning higher-level contract;
- final AppManager success, failure, cancellation or partial-success acceptance.

Process Execution may reject a technically invalid, unsafe or unsupported execution request within its own contract. That rejection supplements rather than replaces higher-level application policy.

---

## 4. Architectural Position

The permanent dependency direction is:

```text
Application Engine / owning use case
        |
        +--> managed project / managed scope
        +--> effective configuration
        +--> policy / safety / authorization
        +--> domain/capability planning
        |
        v
bounded Process Execution request
        |
        v
+----------------------------------------+
| Process Execution capability           |
|                                        |
| validate execution form                |
| establish bounded working context      |
| construct bounded environment          |
| launch provider/tool                   |
| observe I/O and lifecycle              |
| propagate cancellation / timeout       |
| normalize termination evidence         |
+-------------------+--------------------+
                    |
                    v
          OS process / external tool
                    |
                    v
       normalized execution evidence
                    |
                    v
Application Engine / owning use case
       interpretation / acceptance
```

### 4.1 Capability boundary

The Process Execution seam applies [Design §6.6](../appmanager-design-specification-v01.md#_6-6-capability-boundaries-and-providers) to native child-process objects, event emitters, platform status codes, exceptions and library result objects. The request and lifecycle models below provide its consumer-facing representation.

### 4.2 Relationship to Resource Access

Resource Access owns bounded resource mechanics. Process Execution owns bounded external-process mechanics.

A working directory, executable path, response file, generated configuration file or output artefact may require Resource Access evidence or constraints, but Process Execution shall not independently derive managed scope from filesystem accessibility.

### 4.3 Relationship to Application Engine

The [Engine delegation contract](../dd_1_application_core/dd-1-5-application-engine-detailed-design-v01.md#dd-eng-035) supplies the bounded request. The local launch, lifecycle and result models describe what Process Execution can observe for [application interpretation](../dd_1_application_core/dd-1-2-execution-outcomes-detailed-design-v01.md#_19-application-level-interpretation).

## 5. Responsibility Model

Process Execution is decomposed into logical responsibilities:

1. **Execution Request Contract** — describes the bounded executable invocation and constraints.
2. **Execution Form Validator** — validates direct-executable versus shell-mediated invocation semantics.
3. **Working Context Coordinator** — establishes the supplied working directory and other bounded process context without deriving project authority.
4. **Environment Builder** — constructs the child environment from caller-approved inputs while preserving sensitive-value constraints.
5. **Process Launcher** — delegates to the concrete operating-system/runtime provider.
6. **I/O Coordinator** — manages configured stdin/stdout/stderr modes and normalized output events.
7. **Lifecycle Observer** — observes start, running, exit, signal and launch-failure evidence.
8. **Cancellation/Termination Coordinator** — propagates cancellation and requested termination according to the request contract.
9. **Timeout Coordinator** — observes deadlines/timeouts and initiates the configured termination path where applicable.
10. **Process Evidence Normalizer** — converts provider-native results into DD-1.2-compatible evidence and diagnostics.
11. **Provider Adapter** — isolates the concrete runtime/OS process API.

These are permanent responsibility distinctions, not a requirement for one implementation object per item.

---

## 6. Process Execution Request Contract

<a id="dd-proc-001"></a>

### DD-PROC-001 — Bounded execution request

Every process launch shall be represented by a bounded Process Execution request before consequential execution begins.

The request shall be capable of representing, where relevant:

- executable/tool identity;
- argument sequence;
- invocation form;
- working directory/context;
- environment additions/overrides/removals;
- stdin mode;
- stdout/stderr mode;
- output limits;
- timeout/deadline;
- cancellation linkage;
- termination policy permitted to the capability;
- sensitivity/redaction metadata;
- correlation metadata;
- provider/capability configuration already resolved through DD-1.4.

Exact field names and language-level types belong to Implementation Specification.

<a id="dd-proc-002"></a>

### DD-PROC-002 — No command-string authority

An arbitrary command string shall not be treated as sufficient application authority merely because Process Execution can pass it to a shell or process API.

<a id="dd-proc-003"></a>

### DD-PROC-003 — Least execution authority

A request shall carry only the technical execution authority needed for the delegated operation. Process Execution shall not broaden executable identity, arguments, environment, working context or termination authority for convenience.

<a id="dd-proc-004"></a>

### DD-PROC-004 — Caller intent remains upstream

The request may carry correlation or semantic labels supplied by the caller, but Process Execution shall not reinterpret those labels as permission to change the invocation.

---

## 7. Executable and Tool Identity

### 7.1 Identity model

Process Execution shall distinguish the executable/tool selected by an upstream authority from the provider-specific mechanism used to locate and launch it.

<a id="dd-proc-005"></a>

### DD-PROC-005 — Explicit executable identity

Direct execution shall identify the executable/tool separately from its argument sequence.

<a id="dd-proc-006"></a>

### DD-PROC-006 — Tool resolution is bounded

Where provider search-path resolution is permitted, the request or effective capability policy shall make that fact explicit enough for callers to understand that an executable may be resolved indirectly.

Process Execution shall not perform broad project scanning to guess which tool the application intended.

<a id="dd-proc-007"></a>

### DD-PROC-007 — Executability is not application eligibility

The fact that a binary, script or command can be located and launched does not make it an approved AppManager operation.

For example, package-script eligibility, Git operation policy and quality-tool selection remain with their owning semantics.

<a id="dd-proc-008"></a>

### DD-PROC-008 — Resolved executable evidence

Where technically available and materially useful, Process Execution should return safe evidence of the executable/provider actually launched without requiring callers to inspect provider-native process objects.

---

## 8. Direct Execution and Shell Boundary

### 8.1 Direct execution

Direct execution invokes an executable with an argument vector without intentionally asking a command shell to parse a composed command line.

### 8.2 Shell-mediated execution

Shell-mediated execution intentionally delegates command parsing, expansion or composition to a shell/provider command interpreter.

<a id="dd-proc-009"></a>

### DD-PROC-009 — Invocation form is explicit

The Process Execution request shall distinguish direct execution from shell-mediated execution.

<a id="dd-proc-010"></a>

### DD-PROC-010 — No silent shell escalation

A request for direct execution shall not silently be converted into shell-mediated execution merely to simplify quoting, platform compatibility or provider implementation.

If the requested form cannot be honored, the capability shall report unsupported/invalid execution rather than weaken the contract silently.

<a id="dd-proc-011"></a>

### DD-PROC-011 — Shell execution requires upstream permission

Shell-mediated execution shall occur only when the caller has supplied or authorized a shell execution form consistent with the owning use-case policy.

<a id="dd-proc-012"></a>

### DD-PROC-012 — Shell syntax remains provider-bounded

Shell operators, interpolation, pipelines, redirection, command substitution and platform-specific quoting are provider/shell semantics. Higher application contracts shall not depend on their incidental representation where an AppManager-oriented contract can express the intended operation directly.

<a id="dd-proc-013"></a>

### DD-PROC-013 — Platform adaptation cannot change intent

Provider-specific adaptation needed to launch a supported executable on a platform may occur only when it preserves the request's security and semantic guarantees. A platform constraint shall not justify silently introducing a more permissive shell interpretation.

---

## 9. Arguments

<a id="dd-proc-014"></a>

### DD-PROC-014 — Argument sequence preservation

For direct execution, arguments shall remain a structured ordered sequence through the capability boundary rather than being flattened into a shell-parsed string.

<a id="dd-proc-015"></a>

### DD-PROC-015 — No argument reinterpretation

Process Execution shall not independently add, remove, reorder or reinterpret application-significant arguments except for provider-level adaptation explicitly permitted by the request contract.

<a id="dd-proc-016"></a>

### DD-PROC-016 — Sensitive arguments

Apply [DD-PROC-084](#dd-proc-084) and [DD-1.2 redaction](../dd_1_application_core/dd-1-2-execution-outcomes-detailed-design-v01.md#_24-sensitive-information-and-redaction) to arguments classified sensitive by the caller, retaining safe diagnostic context.

<a id="dd-proc-017"></a>

### DD-PROC-017 — Argument limits and provider rejection

Provider/OS argument-size or representation limits shall be normalized as technical execution evidence rather than exposed solely as raw provider exceptions.

---

## 10. Working Context

### 10.1 Working directory

A process request may identify a working directory or equivalent provider context.

<a id="dd-proc-018"></a>

### DD-PROC-018 — Working context is explicit where material

Where process behavior depends on working location, the request shall identify the intended working context rather than allowing incidental host process state to determine application semantics.

<a id="dd-proc-019"></a>

### DD-PROC-019 — Current working directory is not project authority

A deliberately supplied working directory is a bounded request input; managed identity/scope follows [Design](../appmanager-design-specification-v01.md#_9-6-project-discovery-and-context-resolution).

<a id="dd-proc-020"></a>

### DD-PROC-020 — Working context validation

Process Execution shall detect and normalize technical failures such as missing, inaccessible or invalid working context where they prevent launch.

It shall not broaden the working context to another directory in an attempt to make execution succeed unless an upstream contract explicitly permits fallback.

<a id="dd-proc-021"></a>

### DD-PROC-021 — Working context does not grant resource authority

A process running inside a directory may technically access resources beyond it. Process Execution shall not interpret the working directory as a sandbox, ownership boundary or managed-scope guarantee unless a separately specified isolation mechanism actually provides that guarantee.

---

## 11. Environment Contract

### 11.1 Environment construction

The process environment is an execution input and shall be constructed according to caller-approved semantics.

<a id="dd-proc-022"></a>

### DD-PROC-022 — Explicit environment policy

The request shall distinguish inherited environment, supplied additions/overrides, removed variables and isolated/minimal environment modes where those distinctions are required by the owning use case.

<a id="dd-proc-023"></a>

### DD-PROC-023 — No private configuration precedence

Construct the process environment from [DD-1.4 effective values](../dd_1_application_core/dd-1-4-configuration-resolution-detailed-design-v01.md#_15-resolution-result) or resolved environment instructions, under its configuration authority.

<a id="dd-proc-024"></a>

### DD-PROC-024 — Environment inheritance is not authority

Inherited host environment values are technical inputs, not automatically authoritative AppManager configuration.

<a id="dd-proc-025"></a>

### DD-PROC-025 — Sensitive environment handling

Sensitive environment values follow [DD-PROC-084](#dd-proc-084) and [DD-1.2 redaction](../dd_1_application_core/dd-1-2-execution-outcomes-detailed-design-v01.md#_24-sensitive-information-and-redaction).

<a id="dd-proc-026"></a>

### DD-PROC-026 — Environment minimization

Where a use case requires a restricted environment, Process Execution shall be capable of launching with a bounded environment rather than always inheriting the complete host environment.

<a id="dd-proc-027"></a>

### DD-PROC-027 — Environment evidence

Environment evidence may retain safe characteristics under [DD-1.2 redaction](../dd_1_application_core/dd-1-2-execution-outcomes-detailed-design-v01.md#_24-sensitive-information-and-redaction).


---

## 12. Standard Input Contract

Process Execution shall support explicit stdin semantics sufficient for the delegated operation.

Potential modes include:

- no input / closed input;
- inherited host input where explicitly permitted;
- bounded supplied content;
- caller-managed stream/channel;
- provider-specific interactive mode where deliberately supported.

<a id="dd-proc-028"></a>

### DD-PROC-028 — No accidental interactivity

A Headless or automation-safe request shall not unexpectedly become dependent on inherited interactive stdin merely because the external tool chooses to prompt.

<a id="dd-proc-029"></a>

### DD-PROC-029 — Input mode is execution semantics

Where input behavior can affect determinism, cancellation or safety, the requested input mode shall be explicit.

<a id="dd-proc-030"></a>

### DD-PROC-030 — Sensitive stdin

Sensitive stdin uses the channel constraint [DD-PROC-084](#dd-proc-084) and [DD-1.2 redaction](../dd_1_application_core/dd-1-2-execution-outcomes-detailed-design-v01.md#_24-sensitive-information-and-redaction).


---

## 13. Standard Output and Error Contract

### 13.1 Output modes

The capability shall support output handling modes sufficient for consumers to choose among, where applicable:

- captured output;
- normalized streaming output/events;
- inherited/passthrough presentation I/O;
- discarded output;
- combined provider output only where the distinction is not required;
- bounded combinations of capture and streaming where supported.

<a id="dd-proc-031"></a>

### DD-PROC-031 — stdout and stderr remain distinguishable

Where the provider exposes distinct stdout and stderr channels and the distinction is material, Process Execution shall preserve it rather than flattening all output into presentation text.

<a id="dd-proc-032"></a>

### DD-PROC-032 — Output is evidence, not status

Text written to stdout or stderr shall not independently establish success or failure.

A tool may emit warnings on stderr and succeed, or emit error-looking text and still exit normally; interpretation belongs to the owning capability/use case where tool-specific semantics require it.

<a id="dd-proc-033"></a>

### DD-PROC-033 — Streaming is structured

Where streaming output is exposed beyond raw passthrough, events shall carry correlation, channel and ordering information sufficient for machine consumers without parsing terminal decoration.

<a id="dd-proc-034"></a>

### DD-PROC-034 — Presentation passthrough is not canonical evidence

Inherited terminal output may be useful for interactive tools, but a caller shall not be required to scrape that presentation stream to determine the normalized process result.

<a id="dd-proc-035"></a>

### DD-PROC-035 — Output limits

Captured or buffered output shall support bounded-size handling where required to prevent unbounded memory/resource consumption.

<a id="dd-proc-036"></a>

### DD-PROC-036 — Truncation is explicit

If output is truncated, dropped or unavailable because of configured limits/provider behavior, that fact shall be represented explicitly in technical evidence.

<a id="dd-proc-037"></a>

### DD-PROC-037 — Sensitive output minimization

Known sensitive output shall be redacted, withheld or otherwise bounded before propagation to general logs/events/outcomes where the capability has sufficient classification information to do so.

Process Execution is not required to infer every secret from arbitrary tool output.

---

## 14. Process Lifecycle State

The capability shall preserve meaningful distinctions among process lifecycle states.

A conceptual model is:

```text
request accepted
    -> launch attempted
        -> launch failed
        OR
        -> started
            -> running
                -> normal exit
                -> signalled/terminated
                -> timeout termination path
                -> cancellation termination path
                -> observation lost/indeterminate
```

<a id="dd-proc-038"></a>

### DD-PROC-038 — Launch failure differs from process failure

Failure to create/start a process shall remain distinguishable from a process that started and later exited unsuccessfully.

<a id="dd-proc-039"></a>

### DD-PROC-039 — Started state is evidence

Where meaningful, the capability shall be able to report that the process actually started before later failure/cancellation.

<a id="dd-proc-040"></a>

### DD-PROC-040 — Exit and signal remain distinct

A normal exit code and signal/forced termination evidence shall not be silently collapsed into one provider-specific numeric code where that loses material meaning.

<a id="dd-proc-041"></a>

### DD-PROC-041 — Unknown termination is explicit

If the provider cannot determine how or whether execution terminated, the result shall preserve indeterminate/unknown evidence rather than guessing success.

---

## 15. Exit and Termination Evidence

### 15.1 Technical completion model

Process Execution shall return normalized technical evidence capable of representing at least:

- launch status;
- started/not-started state;
- normal exit code where available;
- signal/termination cause where available;
- cancellation relationship;
- timeout relationship;
- stdout/stderr capture metadata;
- timing information where available;
- provider/tool availability state;
- normalized diagnostics;
- bounded provider detail where useful.

<a id="dd-proc-042"></a>

### DD-PROC-042 — Exit zero is not AppManager success

Interpret a zero exit code through [DD-1.2 application interpretation](../dd_1_application_core/dd-1-2-execution-outcomes-detailed-design-v01.md#_19-application-level-interpretation).

<a id="dd-proc-043"></a>

### DD-PROC-043 — Non-zero exit is not universally fatal

A non-zero exit code shall be reported accurately, but Process Execution shall not universally decide that every non-zero exit must fail the parent AppManager use case.

Some tools use non-zero codes to represent findings or other tool-specific states whose meaning belongs to the consuming capability.

<a id="dd-proc-044"></a>

### DD-PROC-044 — Signal termination is not successful exit

A process terminated by signal/forced termination shall not be normalized as an ordinary successful zero exit merely because no numeric exit code is available.

<a id="dd-proc-045"></a>

### DD-PROC-045 — Raw provider result isolation

The process-provider representation follows [DD-1.2 normalization](../dd_1_application_core/dd-1-2-execution-outcomes-detailed-design-v01.md#_18-provider-result-normalization); callers consume the process evidence defined here.


---

## 16. Provider and Tool Availability

<a id="dd-proc-046"></a>

### DD-PROC-046 — Availability is explicit

The capability shall distinguish inability to launch because the requested executable/tool/provider is unavailable from a process that launched and returned a failing result.

<a id="dd-proc-047"></a>

### DD-PROC-047 — Unsupported invocation form

A provider that cannot honor a requested shell mode, I/O mode, cancellation guarantee or other material execution property shall report that limitation rather than silently weakening the request.

<a id="dd-proc-048"></a>

### DD-PROC-048 — No implicit substitute tool

Process Execution shall not silently substitute another executable, package manager, shell, runtime or tool because the requested one is unavailable.

Fallback selection belongs to the owning capability/use case or an explicitly delegated provider-selection contract.

<a id="dd-proc-049"></a>

### DD-PROC-049 — Availability discovery is not application availability

Executable presence feeds [DD-1.1 command availability](../dd_1_application_core/dd-1-1-application-invocation-detailed-design-v01.md); domain availability is not decided by this capability.


---

## 17. Timeout Semantics

### 17.1 Timeout model

A timeout/deadline is a request to constrain execution duration. It is not itself proof that the process has stopped.

<a id="dd-proc-050"></a>

### DD-PROC-050 — Timeout is explicit

Where a timeout applies, the request shall carry the applicable duration/deadline semantics rather than relying on an undocumented provider default.

<a id="dd-proc-051"></a>

### DD-PROC-051 — Timeout observation versus termination

The capability shall distinguish:

- deadline reached;
- termination requested because of timeout;
- termination observed;
- stronger termination attempted where permitted;
- terminal process state.

<a id="dd-proc-052"></a>

### DD-PROC-052 — Timeout does not imply rollback

Timeout effects follow [DD-1.2 consequential effects](../dd_1_application_core/dd-1-2-execution-outcomes-detailed-design-v01.md#_12-consequential-effects).

<a id="dd-proc-053"></a>

### DD-PROC-053 — Timeout evidence

The normalized result shall identify timeout participation separately from ordinary process failure where known.

<a id="dd-proc-054"></a>

### DD-PROC-054 — Provider timeout limitations

If a provider timeout mechanism cannot guarantee termination of descendants or external effects, the capability shall not claim such a guarantee.

---

## 18. Cancellation and Termination

### 18.1 Cancellation relationship

Process Execution consumes cancellation intent propagated from DD-1 invocation/Engine coordination.

<a id="dd-proc-055"></a>

### DD-PROC-055 — Cancellation is cooperative at application level

A cancellation request shall not be reported as terminal cancellation until the relevant execution state is sufficiently known for the owning use case to interpret it.

<a id="dd-proc-056"></a>

### DD-PROC-056 — Cancellation propagation

When cancellation is requested and the execution contract supports termination, Process Execution shall propagate an appropriate termination request to the active process/provider.

<a id="dd-proc-057"></a>

### DD-PROC-057 — Graceful versus stronger termination

Where the provider supports multiple termination strengths, the contract shall distinguish graceful/requested termination from stronger/forced termination sufficiently to avoid implying they are equivalent.

<a id="dd-proc-058"></a>

### DD-PROC-058 — Escalation requires permission

Escalating from graceful termination to stronger termination shall occur only when the request/capability policy permits it. The capability shall not invent an application-level kill policy.

<a id="dd-proc-059"></a>

### DD-PROC-059 — Cancellation race

If the process completes concurrently with cancellation, the capability shall preserve the observed ordering/evidence as far as reasonably possible and shall not rewrite a completed result solely because cancellation was requested nearby in time.

The owning use case determines final application status.

<a id="dd-proc-060"></a>

### DD-PROC-060 — Termination failure

Failure to terminate a process shall be represented explicitly. A cancellation request is not proof that the process stopped.

<a id="dd-proc-061"></a>

### DD-PROC-061 — Effects remain external

Process Execution generally cannot know all filesystem, repository, network or remote effects produced by the tool it launches. It shall not fabricate effect completeness from process termination evidence.

Known higher-level effects are accumulated by the owning capability/use case through DD-1.2 semantics.

---

## 19. Descendant and Process-Tree Semantics

External tools may create child/descendant processes. Terminating the immediate process does not universally guarantee that descendants have stopped.

<a id="dd-proc-062"></a>

### DD-PROC-062 — No false tree-termination guarantee

The capability shall not claim complete process-tree termination unless the selected provider/mechanism deliberately provides and verifies that guarantee to the required level.

<a id="dd-proc-063"></a>

### DD-PROC-063 — Descendant policy is explicit where required

Where a use case requires descendant termination behavior, that requirement shall be expressed in the bounded request/capability contract rather than inferred from generic cancellation.

<a id="dd-proc-064"></a>

### DD-PROC-064 — Detached/background behavior

A request that deliberately permits detached/background execution shall make the lifecycle ownership and observation boundary explicit enough that AppManager does not later misrepresent an intentionally surviving process as a leaked cancellation failure.

Version 1 need not expose detached execution unless an owning use case requires it.

---

## 20. Interactive and Long-Running Processes

<a id="dd-proc-065"></a>

### DD-PROC-065 — Interactive execution is explicit

Processes requiring terminal interaction, prompts, TTY behavior or inherited streams shall use an execution mode that explicitly permits those characteristics.

<a id="dd-proc-066"></a>

### DD-PROC-066 — Interactive presentation does not own semantics

Interactive terminal transport binds to [Design](../appmanager-design-specification-v01.md#_4-6-presentation-independence); the explicit I/O contract carries its local differences.

<a id="dd-proc-067"></a>

### DD-PROC-067 — Long-running readiness is not process start

For development servers, preview servers or other long-running tools, successful process start does not necessarily establish application readiness.

If readiness matters, the owning capability/use case shall define the readiness evidence/check rather than Process Execution universally equating `started` with `ready`.

<a id="dd-proc-068"></a>

### DD-PROC-068 — Long-running terminal outcome

A long-running process may remain active beyond an initial start event. The consuming contract shall distinguish start/readiness evidence from eventual termination where both matter.

---

## 21. Output and Progress Events

Process Execution may publish normalized events through DD-1.2-compatible progress/event channels.

Useful process-level event classes may include:

- launch attempted;
- process started;
- stdout chunk/line;
- stderr chunk/line;
- timeout reached;
- cancellation observed;
- termination requested;
- stronger termination attempted;
- process exited;
- launch failed;
- output truncated.

<a id="dd-proc-069"></a>

### DD-PROC-069 — Correlated events

Process events use [DD-1.2 correlation](../dd_1_application_core/dd-1-2-execution-outcomes-detailed-design-v01.md#_25-correlation-and-causality) for invocation, stage/target and process request.

<a id="dd-proc-070"></a>

### DD-PROC-070 — Event ordering

Where stdout/stderr interleaving or lifecycle ordering is material, the event model shall preserve sequence/ordering evidence to the extent provided by the execution mechanism without claiming stronger global ordering than the provider can guarantee.

<a id="dd-proc-071"></a>

### DD-PROC-071 — Event loss does not redefine result

Best-effort progress/output-event loss shall not silently change the normalized terminal process evidence. Information required for final application interpretation shall be preserved separately where the contract requires it.

---

## 22. Diagnostics

Process Execution diagnostics shall use DD-1.2-compatible structured categories/codes rather than requiring callers to parse raw OS/runtime exceptions.

Capability-level diagnostics should distinguish, where meaningful:

- executable/tool unavailable;
- invalid executable identity;
- unsupported execution form;
- invalid/missing working context;
- environment construction failure;
- launch/spawn failure;
- permission/authorization failure reported by the execution provider;
- argument/provider limit failure;
- non-zero exit evidence;
- signal/forced termination;
- timeout;
- cancellation/termination failure;
- output limit/truncation;
- I/O failure;
- observation lost/indeterminate state;
- provider/runtime failure.

<a id="dd-proc-072"></a>

### DD-PROC-072 — Provider detail is subordinate

Process-provider codes/messages use [DD-1.2 normalization](../dd_1_application_core/dd-1-2-execution-outcomes-detailed-design-v01.md#_18-provider-result-normalization) as bounded detail.

<a id="dd-proc-073"></a>

### DD-PROC-073 — Diagnostic redaction

Process diagnostics apply [DD-1.2 redaction](../dd_1_application_core/dd-1-2-execution-outcomes-detailed-design-v01.md#_24-sensitive-information-and-redaction) to arguments, environment, stdin and output.


---

## 23. Retry, Repetition and Fallback

<a id="dd-proc-074"></a>

### DD-PROC-074 — No implicit application retry

Process Execution shall not silently repeat a consequential process invocation merely because launch or execution failed.

<a id="dd-proc-075"></a>

### DD-PROC-075 — Technical retry evidence

Report process transience/retryability under [DD-1.2 retry evidence](../dd_1_application_core/dd-1-2-execution-outcomes-detailed-design-v01.md#_22-retryability-and-repetition-evidence).

<a id="dd-proc-076"></a>

### DD-PROC-076 — Launch retry versus operation retry

Even a failure before confirmed process start shall not automatically authorize retry if provider uncertainty means the launch state is indeterminate.

<a id="dd-proc-077"></a>

### DD-PROC-077 — No implicit fallback

Tool/shell/provider substitution applies the selection boundary [DD-PROC-048](#dd-proc-048), including a change of execution mode.


---

## 24. Concurrency and Isolation

<a id="dd-proc-078"></a>

### DD-PROC-078 — Invocation isolation

Mutable execution state, cancellation handles, output streams and correlation data for one process request shall not leak into an unrelated invocation.

<a id="dd-proc-079"></a>

### DD-PROC-079 — No universal serialization

Process Execution shall not impose one global serialization rule on all external processes. Application-level conflicts remain coordinated by DD-1.5.

<a id="dd-proc-080"></a>

### DD-PROC-080 — Shared technical limits

The capability may enforce bounded technical concurrency/resource limits where required for runtime safety, provided those limits do not silently redefine application ordering or acceptance semantics.

<a id="dd-proc-081"></a>

### DD-PROC-081 — Conflict evidence remains upstream

If concurrent processes create resource/repository/domain conflicts, the owning use case/capability shall interpret those conflicts using the relevant semantic authority. Process Execution reports the technical evidence it can observe.

---

## 25. Security and Sensitive Information

<a id="dd-proc-082"></a>

### DD-PROC-082 — Shell minimization

Direct execution should be preferred where it can faithfully express the approved technical invocation. Shell-mediated execution shall not be used merely as a convenience for argument composition.

<a id="dd-proc-083"></a>

### DD-PROC-083 — No log-as-command reconstruction requirement

Logging/diagnostics shall not require reconstructing a copy-pasteable command line when doing so would expose secrets or create misleading quoting semantics.

<a id="dd-proc-084"></a>

### DD-PROC-084 — Sensitive-channel minimization

Sensitive values shall be propagated only through the execution channels required by the delegated operation and shall be minimized in persistent/shared evidence.

<a id="dd-proc-085"></a>

### DD-PROC-085 — Provider inheritance boundaries

Process Execution shall not assume that inherited descriptors, environment, terminal state or other host process capabilities are safe for every child invocation. The request/provider contract shall bound them where material.

<a id="dd-proc-086"></a>

### DD-PROC-086 — Process capability is not sandboxing

Ordinary process execution uses the isolation limitation [DD-PROC-021](#dd-proc-021). Stronger filesystem, network, credential or OS isolation needs an explicit approved design; it is not provided by this contract.


---

## 26. Relationship to DD-1.2 Execution Outcomes

The [technical completion model](#_15-1-technical-completion-model), [events](#_21-output-and-progress-events) and [local diagnostics](#_22-diagnostics) feed [DD-1.2 evidence normalization](../dd_1_application_core/dd-1-2-execution-outcomes-detailed-design-v01.md#_18-provider-result-normalization). Consumers can use launch/exit state, output metadata, timing, availability and cancellation/timeout evidence when interpreting a tool run.

<a id="dd-proc-087"></a>

### DD-PROC-087 — Process result is capability evidence

The normalized process result composes [DD-1.2 evidence/status layers](../dd_1_application_core/dd-1-2-execution-outcomes-detailed-design-v01.md#_6-core-status-model).

<a id="dd-proc-088"></a>

### DD-PROC-088 — No Boolean collapse

Process evidence shall not be reduced to a Boolean when exit, signal, launch, timeout, cancellation, output or uncertainty distinctions are required for correct interpretation.

<a id="dd-proc-089"></a>

### DD-PROC-089 — Effect claims remain bounded

For external-tool effect completeness apply [DD-PROC-061](#dd-proc-061). Execution/termination evidence describes only what this capability observed.


---

## 27. Domain and Capability Integration

### 27.1 App lifecycle

App lifecycle use cases may delegate dependency installation, development, build, preview, post-installation and approved project-declared script execution to Process Execution.

The App domain/use case remains responsible for lifecycle sequencing, script eligibility, prerequisites, managed scope, acceptance criteria and composed outcomes.

<a id="dd-proc-090"></a>

### DD-PROC-090 — Declared project scripts remain application-bounded

The App script collaborator follows [DD-3.1 declared-script selection](../dd_3_high_coupling_domains/dd-3-1-app-domain-detailed-design-v01.md#dd-app-009); Process Execution supplies its bounded launch mechanics.

### 27.2 Quality

Quality capabilities may run test, lint, typecheck, coverage or related tools through Process Execution.

A tool exit/result is evidence; Quality owns tool-specific interpretation and quality-policy acceptance before the Engine determines the application outcome.

### 27.3 Documentation

Documentation development/build/preview tooling may delegate process mechanics here. Documentation semantics and acceptance remain with the Docs use case/capability.

### 27.4 Nuxt

Nuxt tooling may delegate external-process execution here. Nuxt-specific recognition, lifecycle and acceptance remain outside Process Execution.

### 27.5 Repository

Repository Capability may use a Git CLI provider through Process Execution, but Process Execution does not thereby own repository primitives, status interpretation, branch policy, commit semantics or remote operations.

### 27.6 AI

An AI capability may invoke a local CLI/tool through Process Execution. Provider/model semantics, context policy, response validation and AI acceptance remain with AI capability/application semantics.

<a id="dd-proc-091"></a>

### DD-PROC-091 — Tool reuse does not merge capability ownership

Two capabilities using the same executable/process mechanism shall not be merged into one semantic authority merely because their technical execution path is shared.

---

## 28. Package Managers and Tool Selection

Package-manager recognition and selection are implementation and owning-use-case concerns, not Process Execution authority merely because package managers are executable tools.

<a id="dd-proc-092"></a>

### DD-PROC-092 — Process Execution does not own package-manager policy by default

Package-manager recognition/selection belongs to the capability or use-case semantics that know why a package manager is needed, unless a later approved shared capability explicitly owns that concern.

Process Execution may launch the selected package manager but shall not infer application policy from lockfiles or silently choose a fallback package manager merely because it can execute one.

<a id="dd-proc-093"></a>

### DD-PROC-093 — Tool selection precedes bounded execution

Where package-manager, runtime or tool selection is required, the selected executable and relevant arguments shall be resolved before or as part of constructing the bounded Process Execution request under the owning semantic authority.

---

## 29. Provider Model and Replaceability

<a id="dd-proc-094"></a>

### DD-PROC-094 — Provider-neutral capability semantics

The process-provider contract applies [Design](../appmanager-design-specification-v01.md#_6-6-capability-boundaries-and-providers) independently of the selected Node.js API.

<a id="dd-proc-095"></a>

### DD-PROC-095 — No speculative transport

Apply [Documentation Guide §7.5](../project-documentation-guide-v01.md#_7-5-permanent-design-versus-migration-design) to process representation; no RPC protocol, worker or out-of-process service is mandated.

<a id="dd-proc-096"></a>

### DD-PROC-096 — Provider replacement preserves semantics

A replacement provider shall preserve the requested invocation form, working context, environment, I/O, timeout, cancellation and evidence semantics to the level promised by the capability contract or report unsupported behavior explicitly.

<a id="dd-proc-097"></a>

### DD-PROC-097 — Provider-native extensions are bounded

Provider-specific features may be exposed only as bounded capability detail where they do not force general application semantics to depend on the provider representation.

---

## 30. Implementation Boundary

The Detailed Design defines the permanent Process Execution contract independently of incidental implementation structure.

The design requires:

- centralizing process mechanics behind a shared capability;
- explicit working-directory control;
- environment construction;
- captured versus inherited/live output needs;
- shell/non-shell distinction;
- exit-code evidence;
- signal evidence;
- avoiding false zero exit for signal-killed processes.

The following are implementation choices rather than permanent architecture:

- one singleton Process Execution service class;
- any particular `execute()` / `spawn()` / checked-wrapper method split;
- a particular Node.js child-process API as the permanent provider API;
- inherited standard I/O as the universal streaming model;
- automatic shell use on a particular operating system;
- a particular environment-map representation;
- treating non-zero exit as an exception in a generic checked wrapper;
- package-manager detection as a Process Execution responsibility;
- synchronous lockfile checks;
- direct logger calls as the canonical event/diagnostic contract.

<a id="dd-proc-098"></a>

### DD-PROC-098 — Implementation conforms to the approved contract

Concrete process code is specified under the [Documentation Guide Level 4 boundary](../project-documentation-guide-v01.md#_8-level-4-implementation-specification), preserving this DD contract.


---

## 31. Testability

Process Execution shall be testable independently of full application/domain orchestration.

<a id="dd-proc-099"></a>

### DD-PROC-099 — Provider substitution

Tests shall be able to substitute or simulate the process provider sufficiently to exercise request validation, lifecycle normalization, output handling, cancellation, timeout and failure classification without launching real external tools for every test.

<a id="dd-proc-100"></a>

### DD-PROC-100 — Deterministic lifecycle tests

The contract shall support deterministic testing of at least:

- launch success and launch failure;
- zero and non-zero normal exit;
- signal/forced termination;
- stdout/stderr capture and streaming distinctions;
- output truncation;
- missing/invalid working context;
- environment construction;
- direct versus shell invocation;
- unsupported invocation form;
- cancellation before start, during execution and racing with completion;
- timeout and termination escalation;
- termination failure;
- executable/tool unavailable;
- indeterminate provider state;
- sensitive-value redaction;
- concurrent invocation isolation.

<a id="dd-proc-101"></a>

### DD-PROC-101 — Application acceptance tests remain above

Capability tests may establish that normalized technical evidence is correct. Tests for whether that evidence means AppManager application success belong to the owning capability/use case and Engine acceptance layer.

---

## 32. Conformance Invariants

Conformance is assessed through the request and invocation-form contracts (§§6–9), context/environment/I/O (§§10–13), lifecycle and availability (§§14–16), timeout/cancellation/descendants (§§17–19), interactive readiness (§20), events/diagnostics/retry/concurrency (§§21–24), security and outcome boundaries (§§25–26), and provider/test obligations. The test scenarios in DD-PROC-100 exercise these contracts; this index adds no second requirement set.

## 33. Traceability

This Detailed Design realizes the process-execution portion of the Version 1 architecture and provides shared technical support for requirements including:

- `FR-INV-030`–`FR-INV-032` — cancellation capability and outcome semantics;
- `FR-INV-033`–`FR-INV-043` — structured outcomes and delegated-result interpretation;
- `FR-INV-045`–`FR-INV-049` — effect/recovery and retry boundaries;
- `FR-APP-091`–`FR-APP-098` — bounded declared project-package-script execution;
- `FR-APP-110`–`FR-APP-115` — cancellation, failure and lifecycle result interpretation;
- Docs, Quality and Nuxt Functional requirements that delegate external tooling while retaining domain acceptance authority;
- DD-1.2 provider normalization, progress, cancellation and timing semantics;
- DD-1.5 capability delegation, cancellation coordination, application interpretation and final acceptance;
- DD-2 guardrail ACG-002 — Process Execution may report technical completion, termination, output and timing; DD-1.2/DD-1.5 determine application acceptance.

Where a domain Functional Specification assigns tool-specific meaning to exit codes, output, readiness or findings, that domain/capability contract remains authoritative for interpretation above this generic process layer.

---

## 34. Contract Consumers and Implementation Dependencies {#_34-downstream-detailed-design-requirements}

The consumer map below connects this process contract to specialist interpretation under the [Documentation Guide reading conventions](../project-documentation-guide-v01.md#detailed-design-reading-conventions).

### 34.1 Repository Capability

[Repository Capability](dd-2-3-repository-capability-detailed-design-v01.md) may consume process evidence through a CLI provider; its normalized repository primitives remain the consumer seam.

### 34.2 Quality Capability

[Quality Capability](dd-2-8-quality-capability-detailed-design-v01.md) consumes process evidence for its check/result and criterion-evaluation contracts.

### 34.3 Documentation Capability

[Documentation Capability](dd-2-9-documentation-capability-detailed-design-v01.md) consumes process readiness and completion evidence for documentation tooling.

### 34.4 Nuxt Capability

[Nuxt Capability](dd-2-10-nuxt-capability-detailed-design-v01.md) supplies the technical Nuxt interpretation of delegated tooling.

### 34.5 AI Capability

[AI Capability](dd-2-7-ai-capability-detailed-design-v01.md) interprets local CLI provider responses through its provider/model contract.

## 35. Final Design Position

The request and lifecycle sections define bounded process execution; normalized technical evidence is consumed through [DD-1.2](../dd_1_application_core/dd-1-2-execution-outcomes-detailed-design-v01.md). The local distinctions between launch, readiness, termination and uncertain effects are the basis for domain interpretation.
