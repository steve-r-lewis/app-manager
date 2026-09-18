# IS-22 — Interaction Adapters Implementation Specification

> **Document type:** Level 4 Implementation Specification
>
> **Status:** Version 1 implementation baseline
>
> **Implementation ID:** IS-22
>
> **Primary Detailed Design:** [DD-1.1 — Application Invocation](../dd_1_application_core/dd-1-1-application-invocation-detailed-design-v01.md)
>
> **Primary Functional authority:** [Application Invocation Functional Specification](../functional/application-invocation-functional-specification-v01.md)
>
> **Related Detailed Design authorities:** [DD-1.2 — Execution Outcomes](../dd_1_application_core/dd-1-2-execution-outcomes-detailed-design-v01.md), [DD-1.3 — Managed Project](../dd_1_application_core/dd-1-3-managed-project-detailed-design-v01.md), [DD-1.4 — Configuration Resolution](../dd_1_application_core/dd-1-4-configuration-resolution-detailed-design-v01.md), [DD-1.5 — Application Engine](../dd_1_application_core/dd-1-5-application-engine-detailed-design-v01.md)
>
> **Primary runtime implementation:** [IS-1 — Application Runtime and Invocation](is-1-application-runtime-and-invocation-implementation-specification-v01.md)
>
> **Domain implementations:** [IS-14 — App Domain](is-14-app-domain-implementation-specification-v01.md), [IS-15 — Git Domain](is-15-git-domain-implementation-specification-v01.md), [IS-16 — Nuxt Domain](is-16-nuxt-domain-implementation-specification-v01.md), [IS-17 — Docs Domain](is-17-docs-domain-implementation-specification-v01.md), [IS-18 — Quality Domain](is-18-quality-domain-implementation-specification-v01.md), [IS-19 — Settings Domain](is-19-settings-domain-implementation-specification-v01.md), [IS-20 — AI Domain](is-20-ai-domain-implementation-specification-v01.md), [IS-21 — Maintenance Domain](is-21-utils-domain-implementation-specification-v01.md)
>
> **Build/runtime:** [IS-23 — Build and Runtime Assembly](is-23-build-and-runtime-assembly-implementation-specification-v01.md)
>
> **Runtime decision:** [ADR-0001 — Primary Application Runtime](../project_management/decisions/adr-0001-primary-application-runtime.md)
>
> **Register:** [AppManager Implementation Specification](implementation-specification-v01.md)
>
> **Governing plan:** [Implementation Specification Plan](../project_management/implementation-specification-plan-v01.md)
>
> **Related clarification:** [Version 1 GUI and Portability Implementation Clarification — Retired](../archive/implementation/version-1-gui-and-portability-implementation-clarification-v01-retired.md) (its corrected three-adapter Version 1 set is now applied directly in §1, §3 and §§19.1–19.3)

## 1. Purpose

IS-22 defines the concrete Node.js/TypeScript interaction adapters by which human users, shell/automation callers and future hosts discover and invoke AppManager through the single IS-1 Application Invocation boundary.

Version 1 provides three concrete interaction paths:

- an interactive terminal user interface (TUI);
- a graphical/WYSIWYG GUI (§§19.1–19.3);
- a deterministic Headless command-line/automation adapter.

All three use only the IS-1 `AppManagerApplication` public surface for discovery/invocation/cancellation/event/outcome semantics (Design §4.6).

The governing rules are:

> **Adapters acquire and present intent; they do not own the meaning, availability, validation, policy, scope, authorization sufficiency, execution workflow, diagnostics or final outcome of that intent.**

> **TUI, GUI and Headless are three projections of one AppManager command/use-case model, not three applications.**

> **The authoritative catalogue is discovered from IS-1. No adapter-owned registry, menu tree or CLI table may become a competing source of command truth.**

> **Human-readable output is a projection of structured application state. Spinner completion, console text, colour and process exit are never substitutes for the canonical application outcome.**

---

## 2. Scope

IS-22 owns concrete implementation of:

- TUI startup, navigation, input acquisition and presentation;
- GUI shell/window lifecycle, navigation, forms/selectors, graphical confirmation and result/progress views (§19.2);
- Headless argument parsing and machine-oriented projection;
- mapping raw adapter input to IS-1 `InvocationRequest` values;
- discovery projection from the authoritative IS-1 catalogue;
- adapter capability declarations;
- host-context hints without authority transfer;
- interactive acquisition of use-case-permitted missing values;
- explicit confirmation/authorization evidence acquisition when requested by application semantics;
- preview/dry-run request projection;
- progress/event rendering;
- cancellation request wiring;
- canonical diagnostic/warning/outcome rendering;
- stable Headless exit-status mapping;
- optional structured JSON output;
- legacy command aliases during migration;
- presentation-safe error handling and redaction.

IS-22 does not own:

- command/use-case identity, catalogue truth, availability, validation or dispatch — IS-1;
- project identity, topology or managed scope — IS-2;
- configuration precedence/effective values — IS-3;
- domain intent/policy/orchestration — IS-14 through IS-21;
- capability/provider mechanics — IS-4 through IS-13;
- final application acceptance or canonical outcome semantics — IS-1/DD-1.2;
- build/executable/composition-root authority — IS-23.

---

## 3. Concrete Module Boundary

```text
app/
└── adapters/
    ├── shared/
    │   ├── adapter-capabilities.ts
    │   ├── invocation-request-builder.ts
    │   ├── discovery-projection.ts
    │   ├── outcome-projection.ts
    │   ├── diagnostic-projection.ts
    │   ├── event-subscription.ts
    │   ├── authorization-evidence.ts
    │   └── legacy-command-aliases.ts
    ├── tui/
    │   ├── tui-adapter.ts
    │   ├── tui-navigation.ts
    │   ├── tui-input.ts
    │   ├── tui-confirmation.ts
    │   ├── tui-progress.ts
    │   └── tui-renderer.ts
    ├── gui/
    │   ├── gui-adapter.ts
    │   ├── gui-shell.ts
    │   ├── gui-navigation.ts
    │   ├── gui-forms.ts
    │   ├── gui-confirmation.ts
    │   ├── gui-progress.ts
    │   └── gui-renderer.ts
    └── headless/
        ├── headless-adapter.ts
        ├── cli-parser.ts
        ├── cli-schema.ts
        ├── headless-output.ts
        └── exit-status.ts
```

This is an implementation responsibility boundary. Domain-specific prompt definitions may be represented as declarative input metadata/contracts exposed through IS-1/use-case interfaces, but domain workflows do not move into `app/adapters/`. The GUI framework/library remains an implementation choice resolved during implementation without changing application semantics (§19.3); no domain/capability/Application Core module imports it.

---

## 4. Adapter Port

```ts
export interface InteractionAdapter {
  readonly id: InteractionAdapterId;
  readonly capabilities: AdapterCapabilities;
  run(application: AppManagerApplication, signal: AbortSignal): Promise<AdapterTermination>;
}
```

The adapter receives the already composed IS-1 application from IS-23. It does not construct domain services or capabilities itself.

---

## 5. Adapter Capabilities

```ts
export interface AdapterCapabilities {
  readonly interactiveInput: boolean;
  readonly explicitConfirmation: boolean;
  readonly progressEvents: boolean;
  readonly cancellation: boolean;
  readonly structuredResults: boolean;
  readonly humanDiagnostics: boolean;
}
```

Version 1 TUI and GUI each declare interactive input/confirmation/progress/cancellation/human diagnostics, where the host supports them. Headless declares structured results and cancellation where the host signal permits it, but never interactive prompting.

`AdapterCapabilities` is adapter-local presentation/host capability description. It is distinct from the IS-1 `InteractionCapabilities` request contract (IS-1 §10) and shall not share that name or be assumed structurally interchangeable with it.

`invocation-request-builder.ts` is responsible for projecting `AdapterCapabilities` onto the IS-1 `InteractionCapabilities` contract before an invocation request is submitted:

| Adapter-local capability | IS-1 request capability |
|---|---|
| `interactiveInput` | `canRequestAdditionalInput` |
| `explicitConfirmation` | `canAcquireAuthorization` |
| `progressEvents` | `canConsumeEvents` |
| `cancellation` | `canRequestCancellation` |
| `structuredResults` | `canConsumeStructuredOutcome` |
| `humanDiagnostics` | no IS-1 capability field; presentation only |

This is capability projection, not authority acquisition. `explicitConfirmation: true` means the adapter can acquire and return authorization evidence when requested; it does not mean the adapter may decide authorization sufficiency.

Capability declarations describe what an adapter can do. They never grant application authority or weaken required authorization.

---

## 6. Single Invocation Path

Both adapters use only the IS-1 public application surface:

```text
adapter raw input
 -> adapter normalization
 -> AppManagerApplication.discover(...) or invoke(...)
 -> IS-1 authoritative execution
 -> canonical events/outcome
 -> adapter projection
```

Adapters do not call domain use cases, capability services, repositories, scanners, transformations, AI providers or process providers directly.

---

## 7. Authoritative Discovery

The TUI builds menus and Headless discovery/help builds command listings from `AppManagerApplication.discover(...)`.

An adapter may group, sort, filter or label returned descriptors for presentation, but it cannot:

- invent commands;
- remove a command and then represent the remainder as the complete application catalogue without identifying the projection;
- change canonical IDs;
- decide availability;
- promote provider operations/package scripts to AppManager commands.

Unknown and recognized-but-unavailable remain distinct.

---

## 8. Canonical Command Identity

IS-22 consumes the canonical `<domain>.<name>` IDs established by IS-1 and the domain Implementation Specifications. `<name>` is a single verb for a leaf operation (for example `cleanup`) or a dotted `<resource>.<verb>` path where the owning domain's canonical operation identities distinguish resources (for example `headers.validate`, `environment.create`). Segment depth is established per identity by the owning domain's Functional Specification, not by a fixed IS-22 schema; IS-22 treats the full dotted string after the domain as one opaque name.

TUI menu values and Headless positional/option syntax map to those IDs. Display labels, aliases and menu positions are never persisted or passed as semantic command identity.

Legacy aliases are translated exactly once at the adapter boundary and recorded as compatibility provenance.

---

## 9. Invocation Request Builder

```ts
export interface AdapterInvocationInput {
  readonly commandId: CommandId;
  readonly explicitInputs: Readonly<Record<string, unknown>>;
  readonly explicitOptions: Readonly<Record<string, unknown>>;
  readonly targetHints?: readonly HostContextHint[];
  readonly requestedScope?: RequestedScopeInput;
  readonly configurationOverrides?: Readonly<Record<string, unknown>>;
  readonly authorizationEvidence?: readonly AuthorizationEvidenceInput[];
  readonly preview?: boolean;
  readonly callerCorrelation?: Readonly<Record<string, string>>;
}
```

`invocation-request-builder.ts` converts this into the IS-1 request contract without resolving project scope, configuration precedence, domain defaults or safety policy.

---

## 10. Explicit Inputs and Provenance

Adapter-supplied values remain explicitly caller-supplied values. Host-derived context is carried separately as hints.

The TUI must not convert an omitted optional input into a consequential default merely because a menu has a preselected item. Headless omission likewise remains omission unless the application contract defines a default.

---

## 11. Host Context

Version 1 may pass an explicitly established target path/reference from the launcher as a host-context hint. It must not treat `process.cwd()` as authoritative managed scope.

IS-2 remains responsible for resolving whether the hinted location belongs to a recognized/managed project and what scope is targetable/mutable.

The adapter never recursively discovers project authority itself.

---

## 12. TUI Navigation

The TUI navigation loop is presentation only:

```text
intro
 -> discover catalogue
 -> present domain/group projection
 -> present command projection
 -> acquire permitted inputs
 -> build invocation
 -> invoke IS-1
 -> render events/outcome
 -> return to discovery/navigation
```

Returning “back”, changing menu pages or cancelling before invocation has no application effect.

The TUI refreshes context-sensitive discovery after material operations rather than assuming prior availability remains current.

---

## 13. TUI Library

Version 1 retains `@clack/prompts` for terminal input/navigation and `picocolors` for optional terminal styling because the current implementation already uses them and they are presentation-only mechanisms.

They are isolated under `app/adapters/tui/`; no domain/capability/Application Core module imports them.

Replacing either library must not alter application semantics.

---

## 14. TUI Input Acquisition

Interactive input is acquired only for fields the selected use case permits callers to supply.

Input acquisition follows application-provided descriptor/schema information where available. The adapter may perform immediate presentation-level checks such as non-empty text or syntactic option parsing, but authoritative validation remains IS-1/owning-domain responsibility.

A prompt result is never accepted solely because the prompt library returned it successfully.

---

## 15. Confirmation and Authorization

The TUI may present confirmation only when IS-1/use-case semantics require or permit explicit authorization evidence.

Authorization evidence is bound to the invocation/proposed consequential intent as required by IS-1. A generic “yes” cached across operations is forbidden.

If target, scope or proposed effects materially change, stale authorization is not silently reused.

The TUI does not decide that an operation is safe enough to skip required confirmation.

---

## 16. Preview and Dry Run

TUI controls and Headless `--preview`/`--dry-run` compatibility syntax map to the same IS-1 preview intent.

The adapter renders a preview as proposed/not-applied. It never changes a canonical preview outcome into applied success.

A later apply operation is a new/continued authorized invocation according to IS-1 semantics, not a presentation toggle that mutates the prior result.

---

## 17. TUI Progress

`@clack/prompts` spinners or other progress UI consume IS-1 execution events.

A spinner starts/stops because an event stream/stage changes; spinner success text never establishes application success.

Warnings, partial effects, cancellation and failures remain renderable even if an individual delegated stage previously displayed completion.

---

## 18. TUI Cancellation

Prompt cancellation before invocation exits/backs out without invoking the use case.

During execution, Ctrl-C or another supported cancellation action requests cancellation through IS-1's cancellation channel/`AbortController` linkage.

The TUI does not call `process.exit()` while an invocation is active merely to simulate cancellation. It allows IS-1 to publish the truthful cancelled/partial/indeterminate outcome where possible.

A second termination signal may be handled by the launcher as forced process termination; that is not represented as graceful application cancellation.

---

## 19. TUI Outcome Rendering

`tui-renderer.ts` receives the canonical IS-1 outcome projection and renders:

- final state;
- application diagnostics/warnings;
- meaningful result payload summaries;
- applied/proposed effects;
- partial/cancelled state;
- recovery information where present.

It does not reinterpret raw provider exceptions or invent success/failure based on message severity.

### 19.1 GUI Adapter Contract

GUI implements the same `InteractionAdapter` port (§4) as TUI/Headless rather than a parallel application API. At minimum the GUI implementation must be able to declare and exercise, where supported by the host, interactive input, explicit confirmation, progress/event consumption, cancellation, structured results and human diagnostics (§5). Capability declaration remains descriptive; it does not grant application authority.

GUI discovery/navigation is built from `AppManagerApplication.discover(...)` (§7), following the same authoritative-discovery rules as TUI. GUI invocation maps graphical input to the shared adapter invocation/request builder (§9) and calls `AppManagerApplication.invoke(...)`. GUI progress/state consumes IS-1 events (§29) the same way TUI progress does (§17), and GUI final presentation projects the canonical application outcome (§19) the same way `tui-renderer.ts` does.

### 19.2 GUI Presentation Boundary

GUI-specific modules may own:

- graphical application shell/window lifecycle;
- navigation and command grouping;
- forms, selectors and structured input controls;
- graphical confirmation controls;
- preview/proposed-effect views;
- progress/event views;
- structured result, diagnostic, effect and recovery views;
- presentation-local state that does not become application policy.

They do not own domain workflows, command existence, availability decisions, managed scope, configuration precedence, authorization sufficiency, provider interpretation or final application acceptance — the same non-ownership boundary §2 already establishes for TUI and Headless.

### 19.3 GUI Framework Choice

The exact GUI framework/library remains an implementation choice to be resolved during implementation without changing application semantics. GUI framework objects remain inside the GUI adapter/presentation boundary (§3) and do not become domain/capability contracts; no domain/capability/Application Core module imports the selected GUI framework to implement application semantics (Design §6.6).

---

## 20. Headless Syntax

Version 1 Headless supports a stable direct invocation form:

```text
app-manager <domain> <command> [inputs/options]
```

and may additionally accept the canonical ID explicitly:

```text
app-manager --command <domain>.<name> [inputs/options]
```

The parser converts syntax into structured values. It does not execute commands, mutate configuration or resolve managed scope.

---

## 21. Headless Parser

`cli-parser.ts` uses an explicit schema rather than the current untyped “every `--x` becomes boolean/string” loop.

The implementation may use Node-native parsing (`node:util` `parseArgs`) for common global options and command-specific schema validation supplied through discovery metadata/contracts. No CLI framework is required for Version 1.

Unknown options are rejected rather than silently added to an arbitrary options bag when they cannot be represented by the selected invocation contract.

Repeated/multi-value options preserve their declared cardinality.

---

## 22. Headless Global Options

The adapter reserves only interaction-level options, such as:

```text
--command <id>
--json
--preview
--correlation-id <value>
--help
--version
```

Logging verbosity or configuration override syntax may be supported only by mapping to approved IS-1/IS-3 invocation fields. The adapter does not mutate a configuration singleton.

Domain-specific inputs remain use-case inputs, not global adapter policy.

---

## 23. Headless Determinism

Headless never prompts.

When required information is missing, the same application path may resolve it deterministically under approved semantics; otherwise the invocation fails with structured diagnostics.

The adapter never chooses the first menu-equivalent value, assumes “yes”, picks a project from cwd, selects an AI result or applies an undocumented default to keep execution moving.

---

## 24. Machine-Consumable Output

`--json` writes one final structured JSON document representing the IS-1 outcome projection to standard output.

Human progress/prose does not contaminate JSON stdout. Diagnostics intended for human observation may use stderr when not represented solely in the final JSON, but machine-significant meaning remains in the structured outcome.

The JSON schema is an adapter projection of canonical outcome fields, not a second semantic outcome model.

---

## 25. Human Headless Output

Without `--json`, Headless may render concise human-readable progress/diagnostics/outcome text.

Colour is enabled only when appropriate to the output environment and never carries unique meaning. Plain output preserves all significant status distinctions.

No caller must parse prose to determine final status when structured mode is requested.

---

## 26. Exit Status

The Headless process maps the canonical final outcome to stable process status only after IS-1 completes:

```text
0  accepted success or accepted no-op
1  application failure/rejection
2  invocation/usage error before valid execution
3  cancelled
4  partial/indeterminate consequential completion requiring caller attention
```

The exact status is an adapter transport projection. It does not alter the canonical outcome, and detailed meaning remains available in structured output.

Provider exit codes are never propagated directly as AppManager process exit status.

---

## 27. Help and Discovery

`--help` uses static adapter syntax help plus authoritative IS-1 discovery for command-specific command/description/availability information where application bootstrap is available.

Help generation does not maintain a manually duplicated domain/command table.

If contextual availability cannot be evaluated, help says it is not evaluated rather than labelling the command unavailable.

---

## 28. Version Projection

`--version` reports the assembled application/package version supplied by IS-23 build/runtime metadata. It does not query Settings application metadata and does not infer a project version.

---

## 29. Events and Streams

Adapters subscribe to the IS-1 invocation event stream by invocation identity.

TUI may render progress dynamically. Headless human mode may emit concise progress. JSON final-output mode defaults to no interleaved stdout events; future streaming JSON/NDJSON requires an explicit adapter mode and does not change event semantics.

Events remain intermediate evidence/state, not final outcomes.

---

## 30. Diagnostics

Adapters render canonical diagnostic code/severity/message-safe-fields from IS-1. Provider-native exceptions, stack traces, tokens, prompts, environment values and private source content are not displayed by default.

A development/debug presentation mode may expose additional sanitized technical details when approved configuration permits it, but never secrets.

---

## 31. Unexpected Adapter Faults

Parsing/rendering/terminal faults are adapter faults. They are not converted into domain failures.

Before an invocation begins, a fatal adapter fault terminates with a usage/adapter failure projection. After invocation starts, if outcome delivery fails, the adapter preserves invocation identity and emits the safest available terminal diagnostic without inventing a different canonical outcome.

Expected application rejection remains a normal IS-1 outcome, not a thrown adapter exception.

---

## 32. Configuration Boundary

Adapters do not call `configService.setFlag`, write environment variables or establish private precedence.

Explicit caller configuration overrides are represented in the invocation request and resolved by IS-3 according to allowed keys/provenance.

Presentation preferences that do not affect application semantics (for example colour enablement) may remain adapter-local.

---

## 33. AI Availability Boundary

The TUI does not perform an unconditional startup AI provider health check.

AI availability is evaluated by the authoritative command/use-case/capability path when relevant and may be surfaced through discovery/availability evidence. This avoids making AI a global prerequisite or letting the TUI define application availability.

---

## 34. Logging and Observability Boundary

Adapters may emit adapter lifecycle observability through the IS-1 logging/event facilities assembled by IS-23, but they do not initialize/reinitialize a global logger against a target root.

Invocation identity/correlation is preserved. Sensitive explicit inputs and authorization evidence are not logged wholesale.

---

## 35. Process Lifecycle

Adapters return `AdapterTermination` to the thin launcher/composition runtime. Normal menu exit, usage failure and completed Headless execution do not call `process.exit()` from deep adapter functions.

The executable launcher owns final `process.exitCode` projection after adapter/application cleanup.

This preserves event flushing, cleanup and testability.

---

## 36. Legacy Alias Mapping

During migration, legacy command spellings may map to canonical IDs through `legacy-command-aliases.ts`.

Examples established by prior domain specifications include Utils-labelled automatic documentation delegating to IS-17 Docs semantics and Utils-labelled contributor management delegating to IS-19 Settings semantics.

Aliases:

- are exact and deterministic;
- emit compatibility/deprecation provenance where useful;
- do not create duplicate catalogue entries unless deliberately shown as deprecated aliases;
- never add adapter-specific domain semantics;
- are removable after migration.

---

## 37. Interaction-Mode Equivalence

For the same canonical invocation intent and materially equivalent authoritative context, TUI, GUI and Headless must reach materially equivalent application validation, policy, scope, safety, execution and final outcome semantics.

Differences permitted at IS-22 are limited to input acquisition, presentation, progress rendering, confirmation mechanism, structured transport projection and host lifecycle.

---

## 38. Future Adapters

GUI is a Version 1 adapter (§19.1–19.3), not a future one. IDE, CI, automation-agent, RPC or other genuinely future adapters must use the same IS-1 contracts.

Version 1 does not implement a WebStorm/JetBrains plugin and does not select a future cross-language transport. The implementation nevertheless avoids coupling application/domain semantics to concrete Node-only provider objects or UI libraries across defined architectural boundaries, so a future WebStorm/JetBrains integration may use a bridge, alternate implementation, IPC/RPC boundary or other mechanism selected at that time without forcing Version 1 to implement speculative transport infrastructure now. Native TypeScript contracts remain the Version 1 implementation contracts; they are not required to be wire schemas.

IS-22 does not define a generic network protocol or plugin framework. A future transport requiring stable wire compatibility, authentication or remote lifecycle semantics requires its own implementation work/decision rather than overloading the Version 1 TUI/GUI/Headless abstraction.

---

## 39. Composition

IS-23 constructs:

1. the complete IS-1 `AppManagerApplication` and its catalogue;
2. shared adapter projection/request-builder components;
3. TUI renderer/input/navigation components;
4. GUI renderer/shell/navigation/forms components (§19.1–19.3);
5. Headless parser/output components;
6. the selected adapter from launcher arguments/environment that are strictly runtime/transport concerns;
7. cancellation signal linkage;
8. the thin executable lifecycle.

Adapters receive dependencies explicitly. They do not import mutable singletons for command registry, configuration, logger or AI.

---

## 40. Testing Requirements

Core conformance tests cover at least:

1. TUI, GUI and Headless use the same IS-1 application port;
2. neither adapter calls a domain directly;
3. neither adapter calls a capability directly;
4. authoritative discovery comes from IS-1;
5. menu construction cannot invent command existence;
6. canonical IDs survive presentation labels;
7. unknown and unavailable remain distinct;
8. legacy aliases map deterministically;
9. alias does not create new semantic authority;
10. explicit inputs remain explicit provenance;
11. host hints remain distinct from explicit inputs;
12. cwd is not managed-scope authority;
13. adapter cannot resolve config precedence;
14. adapter cannot mutate config singleton;
15. omitted input remains omitted;
16. TUI may acquire only permitted missing input;
17. TUI-acquired value receives normal validation;
18. Headless never prompts;
19. Headless missing required value fails/deterministically resolves through application;
20. interaction capability does not grant authorization;
21. TUI confirmation produces explicit evidence;
22. confirmation evidence is invocation/plan bound;
23. stale confirmation is not reused;
24. Headless absence of confirmation never means yes;
25. preview maps to shared preview intent;
26. preview rendered as not applied;
27. TUI progress consumes IS-1 events;
28. spinner completion does not determine success;
29. prompt cancellation before invocation has no application effect;
30. active TUI cancellation requests IS-1 cancellation;
31. cancellation does not imply rollback;
32. TUI renders partial effects;
33. TUI renders recovery information;
34. TUI renderer does not parse provider exceptions for semantics;
35. `@clack/prompts` isolated to TUI adapter;
36. `picocolors` isolated to presentation;
37. Headless parser uses explicit schema;
38. unknown CLI option rejected;
39. repeated values preserve declared cardinality;
40. command-specific inputs do not become global policy;
41. `--json` stdout contains final structured document only;
42. JSON projection preserves canonical final state;
43. JSON projection preserves diagnostics;
44. JSON projection preserves effects/partial state;
45. human output does not require colour for meaning;
46. exit 0 maps only accepted success/no-op;
47. application failure maps to exit 1;
48. usage error maps to exit 2;
49. cancellation maps to exit 3;
50. partial/indeterminate maps to exit 4;
51. provider exit code never leaks directly;
52. help derives command truth from discovery;
53. contextual help does not invent availability;
54. version comes from IS-23 application metadata;
55. event stream correlates by invocation identity;
56. events are not final outcome;
57. sensitive diagnostic values redacted;
58. adapter faults remain distinct from application rejection;
59. outcome delivery failure does not invent domain failure;
60. no unconditional TUI AI health check;
61. AI availability remains application/capability evidence;
62. adapter does not initialize global logger against project root;
63. adapter does not set process environment for semantic config;
64. adapter functions do not call process.exit for normal flow;
65. launcher owns final process exitCode;
66. normal TUI exit permits cleanup;
67. Ctrl-C signal propagation is testable;
68. TUI refreshes context-sensitive discovery after material effects;
69. same canonical request yields equivalent TUI/GUI/Headless application semantics;
70. presentation differences do not alter request intent;
71. adapter capability differences do not weaken safety;
72. direct command registry singleton absent;
73. direct config service singleton absent;
74. direct AI service singleton absent;
75. direct domain service imports absent;
76. future adapter can reuse shared request/outcome projections without TUI dependency;
77. shared adapter code contains no domain policy;
78. IS-23 explicit composition supplies dependencies;
79. canonical outcome remains IS-1-owned;
80. adapter never publishes a competing success Boolean;
81. GUI does not call domains/capabilities/providers directly;
82. GUI discovery derives from IS-1 rather than a competing catalogue;
83. GUI confirmation/preview/progress/outcome presentation does not create competing semantics;
84. GUI framework dependencies remain isolated to the adapter/presentation boundary;
85. IS-23 explicitly composes the GUI adapter alongside TUI and Headless;
86. the composition root can substitute implementations at owning replaceable contracts for conformance tests;
87. provider-native types do not leak across the owning capability boundaries;
88. no WebStorm/JVM/RPC dependency is required for Version 1 conformance.

Integration tests run all three adapters against the same controlled `AppManagerApplication` substitute and then against the composed application for representative read-only, consequential, preview, unavailable, invalid, partial, cancelled and no-op use cases.

---

## 41. Current Implementation Disposition

The live implementation has `app/modes/interactiveMode.ts`, `app/modes/headlessMode.ts` and `app/index.ts`. These contain useful presentation/dispatch mechanisms but also currently cross the approved authority boundaries.

The absence of a current GUI implementation is migration evidence, not authority to omit the Version 1 GUI: a new `app/adapters/gui/` implementation is required as part of the target Version 1 implementation. Existing TUI/Headless migration dispositions below remain valid except where they describe their pair as the complete Version 1 adapter set.

| Current artefact/responsibility | Disposition | Target owner/location | Preserved value | Required change |
|---|---|---|---|---|
| absence of a GUI implementation | **ADD** | `app/adapters/gui/` | none required | implement per §19.1–19.3; not an optional/future adapter for Version 1. |
| `app/modes/interactiveMode.ts` terminal navigation | **RETAIN / ADAPT** | `app/adapters/tui/` | Clack-based interactive menu/navigation mechanism | Build menus from IS-1 discovery; invoke only IS-1; remove domain/service authority. |
| `interactiveMode.ts` `@clack/prompts` usage | **RETAIN** | TUI adapter | suitable terminal interaction mechanism | isolate to presentation modules. |
| `interactiveMode.ts` `picocolors` usage | **RETAIN** | TUI renderer | optional terminal styling | ensure colour never carries unique semantics. |
| `interactiveMode.ts` `commandRegistry` access | **REPLACE** | IS-1 discovery/invocation | none required | remove competing adapter registry lookup/execution. |
| `interactiveMode.ts` `configService.setFlag` | **RELOCATE / REPLACE** | IS-3 through invocation; adapter-local presentation preferences | user intent to request verbosity may be preserved | no direct semantic configuration mutation. |
| `interactiveMode.ts` `process.env.LOG_TO_FILE` | **REPLACE** | governed config/runtime observability | user preference concept if still approved | no environment mutation from adapter. |
| `interactiveMode.ts` logger initialization | **RELOCATE** | IS-23/IS-1 observability | human messages | adapter renders/observes; composition initializes logging. |
| `interactiveMode.ts` unconditional `llmService.checkAvailability()` | **REPLACE** | IS-10/IS-20/owning use-case availability | optional user visibility of AI availability | no global startup AI prerequisite/check. |
| `interactiveMode.ts` direct `selectedCmd.isEnabled/execute` | **REPLACE** | IS-1 | selection flow | use canonical discovery + invocation only. |
| `interactiveMode.ts` `process.exit()` normal/cancel flow | **ADAPT** | launcher lifecycle | explicit exit behavior | return termination/request cancellation; launcher owns exit status. |
| `app/modes/headlessMode.ts` single-command mode | **RETAIN / ADAPT** | `app/adapters/headless/` | deterministic one-shot interaction shape | map parsed input to IS-1 invocation. |
| `headlessMode.ts` option loop | **REPLACE** | `cli-parser.ts` | simple positional UX may remain | typed/schema-aware parsing; reject unknown/malformed values. |
| `headlessMode.ts` `commandRegistry` lookup | **REPLACE** | IS-1 | domain/action UX may remain | canonical ID/discovery/invoke. |
| `headlessMode.ts` direct `configService.setFlag` | **RELOCATE / REPLACE** | IS-3 invocation overrides / presentation preference | verbosity intent | no singleton mutation. |
| `headlessMode.ts` direct `command.isEnabled/execute` | **REPLACE** | IS-1 | none beyond requested command | authoritative availability/validation/dispatch. |
| `headlessMode.ts` prose-only result/error logging | **SPLIT / ADAPT** | Headless output projection | useful human presentation | add canonical structured JSON output; derive prose from outcome. |
| `headlessMode.ts` `process.exit()` | **ADAPT** | launcher exit projection | non-zero shell status | map canonical outcome to stable exit status after cleanup. |
| `app/index.ts` mode selection | **RETAIN / ADAPT** | IS-23 launcher/composition | thin selection between interactive/headless modes | select constructed adapter; no application semantics. |
| `app/index.ts` direct command registration | **RELOCATE / REPLACE** | IS-23 composition + IS-1 catalogue | explicit composition concept | register complete canonical use-case set, not ad hoc commands in launcher. |
| `app/index.ts` direct logger/config singleton initialization | **RELOCATE** | IS-23 composition | startup ordering intent | explicit dependency construction. |
| `app/index.ts` `process.cwd()` target authority | **REPLACE** | host hint to IS-2 | convenient initial host location | cwd may be hint only, never managed-scope authority. |
| `app/index.ts` `process.argv` reading | **RETAIN / ADAPT** | thin executable/Headless selection | Node CLI input source | launcher passes args to adapter without semantic parsing. |

The classification is responsibility-level. Useful interaction mechanics are preserved while direct service/domain/registry authority is removed.

---

## 42. Migration Sequence

1. add shared adapter capability/request/outcome projection contracts;
2. add TUI, GUI and Headless adapter module boundaries;
3. expose/use the IS-1 application port from IS-23 composition;
4. replace TUI `commandRegistry` menus with IS-1 discovery projections;
5. move existing Clack navigation/input mechanics into TUI modules;
6. isolate `picocolors` in renderer only;
7. remove TUI direct config/environment/logger initialization;
8. remove unconditional TUI AI health check;
9. map TUI selected canonical IDs/inputs to IS-1 requests;
10. implement application-requested confirmation evidence acquisition;
11. wire IS-1 events to TUI progress;
12. wire cancellation signals without deep `process.exit()`;
13. render canonical outcomes/diagnostics/effects/recovery;
14. replace Headless free-form option loop with explicit parser/schema;
15. preserve `<domain> <command>` compatibility while mapping to canonical IDs;
16. add explicit `--command <domain>.<name>` form;
17. add `--json` structured final projection;
18. implement stable canonical-outcome-to-exit-status mapping;
19. derive Headless help from authoritative discovery;
20. remove Headless direct config/registry/command execution;
21. move normal process lifecycle/exitCode to IS-23 launcher;
22. implement exact legacy alias table for approved migrated commands;
23. adapt `app/index.ts` into thin adapter selection over explicit composition;
24. implement the GUI adapter over the selected framework (§19.1–19.3), mapping discovery/invocation/events/outcome through the same shared components as TUI;
25. isolate GUI framework dependencies to `app/adapters/gui/`;
26. add IS-23 explicit composition of the GUI adapter alongside TUI/Headless;
27. run cross-mode (TUI/GUI/Headless) equivalence and safety tests;
28. remove/deprecate old `app/modes/` modules once callers/tests use `app/adapters/`.

---

## 43. Traceability

| Implementation concern | Governing authority |
|---|---|
| single application semantics / adapter non-authority | FR-INV-001–002; DD-1.1 Sections 1, 4–5; IS-1 |
| canonical identity/discovery | FR-INV-003–006; DD-1.1 Sections 8–9; IS-1 |
| structured explicit invocation | FR-INV-007–010; DD-1.1 Sections 6, 10–11 |
| validation/availability | FR-INV-011–016; DD-1.1 Sections 12–13; IS-1 |
| cross-mode equivalence | FR-INV-017–019 and domain interaction-equivalence requirements |
| GUI adapter (§19.1–19.3) | FR-INV-GUI-001–010; Design §§4, 4.4, 4.6, 6.10 |
| deterministic Headless | FR-INV-020–022; DD-1.1 interaction capability contract |
| confirmation/authorization/preview | FR-INV-023–026; DD-1.1 Section 14; IS-1 |
| progress/events | FR-INV-027–029; DD-1.1 event contract; IS-1 |
| cancellation | FR-INV-030–032; DD-1.1 cancellation contract; IS-1 |
| canonical outcomes | FR-INV-033–037; DD-1.2; IS-1 |
| diagnostics/warnings/sensitivity | FR-INV-038–040; DD-1.2; IS-1 |
| delegated result interpretation | FR-INV-041–043; DD-1.5; IS-1 |
| failure/effects/recovery | FR-INV-044–047; DD-1.2; IS-1 |
| managed scope | DD-1.3; IS-2 |
| effective configuration | DD-1.4; IS-3 |
| executable/composition lifecycle | ADR-0001; IS-23 |

---

## 44. Version 1 Non-Drift Baseline

```text
human / shell / automation
          |
          +----------------+----------------+
          |                |                |
          v                v                v
      TUI adapter     GUI adapter     Headless adapter
          |                |                |
          +--------+-------+----------------+
                   |
                   v
          structured IS-1 request
                    |
                    v
        AppManagerApplication
        discover / invoke / cancel
                    |
                    v
           Application Engine
                    |
          owning domain/use case
                    |
          delegated capabilities
                    |
                    v
          canonical IS-1 outcome
                    |
          +---------+---------+----------+
          |                   |          |
          v                   v          v
   TUI presentation    GUI presentation   human/JSON + exit
```

The non-drift rule is:

> **Version 1 interaction adapters remain thin transport/presentation boundaries. They may discover, acquire explicit caller input, carry host hints, request application-required confirmation, submit preview intent, render progress, request cancellation and project canonical outcomes, but they never own a competing command registry, choose application availability, resolve managed scope or configuration precedence, call domain/capability/provider implementations directly, treat cwd as authority, perform startup AI policy, infer authorization, turn menu defaults into consequential intent, use spinner/colour/prose/provider exit codes as application semantics, let the GUI framework leak into domain/capability contracts, publish a competing success model, or create different TUI, GUI and Headless workflows for the same AppManager use case.**