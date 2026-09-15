# AppManager Level 4 Implementation Specification Conformance and Reconciliation

> **Status:** Version 1 reconciliation audit — corrections required before closeout
>
> **Audit scope:** Complete Version 1 Level 4 corpus: implementation register plus IS-1 through IS-23
>
> **Verified baseline:** `master` at `6649a6890d2c1749b2283f5b71c93e319898b341`, merge commit for PR #150
>
> **Normative effect:** None. This project-management document records horizontal conformance evidence and required corrections. Normative authority remains in the Project Documentation Guide, Design Specification, Functional Specifications, accepted ADRs, Detailed Designs and owning Implementation Specifications.

---

## 1. Purpose

This audit performs the first complete horizontal conformance/reconciliation pass across the authored Version 1 Implementation Specification set after IS-22 merged and all 23 primary Level 4 specifications became available together.

The pass is deliberately broader than checking whether each IS is locally plausible. It asks whether the complete implementation contract can be reduced to code without relying on contradictory ownership, duplicate semantic contracts, stale authoring assumptions, hidden authority transfer, provider leakage, incompatible runtime composition, or interaction-mode drift.

The governing question is:

> **Does the complete Level 4 corpus form one coherent implementation baseline that preserves the approved Level 1–3 architecture and can now govern implementation without unresolved horizontal contradiction?**

---

## 2. Authority and Method

The audit applies the documented hierarchy:

1. `docs/project-documentation-guide-v01.md`;
2. `docs/appmanager-design-specification-v01.md`;
3. current Functional Specifications under `docs/functional/`;
4. accepted ADRs;
5. current Detailed Designs and accepted clarifications;
6. `docs/implementation/implementation-specification-v01.md`;
7. IS-1 through IS-23.

The implementation plan/map and this audit are project-management evidence, not normative architecture.

Current source code is used only as migration evidence. It is not used to infer architecture where normative specifications exist.

The pass checks:

- register completeness and document lifecycle state;
- Level 4 path/identity structure;
- DD/Functional/ADR traceability;
- Application Engine authority;
- managed-project and configuration ownership;
- canonical outcome/diagnostic ownership;
- capability/domain separation;
- evidence-versus-interpretation boundaries;
- mutation authority and stale-state controls;
- AI non-authority and disclosure boundaries;
- provider replaceability;
- interaction-mode equivalence;
- runtime/composition consistency;
- responsibility-level legacy disposition;
- cross-IS dependency direction;
- provisional language that became stale as later IS documents were authored.

---

## 3. Structural Inventory

### 3.1 Primary set

The Version 1 register defines exactly 23 primary IS identities:

```text
IS-1   Application Runtime and Invocation
IS-2   Managed Project Resolution
IS-3   Configuration Resolution
IS-4   Resource Access
IS-5   Process Execution
IS-6   Repository Capability
IS-7   Source Intelligence
IS-8   Source Transformation
IS-9   Resource Registry and Template
IS-10  AI Capability
IS-11  Quality Capability
IS-12  Documentation Capability
IS-13  Nuxt Capability
IS-14  App Domain
IS-15  Git Domain
IS-16  Nuxt Domain
IS-17  Docs Domain
IS-18  Quality Domain
IS-19  Settings Domain
IS-20  AI Domain
IS-21  Utils Domain
IS-22  Interaction Adapters
IS-23  Build and Runtime Assembly
```

All 23 corresponding Version 1 files are present under the single active flat Level 4 location `docs/implementation/`.

No additional primary IS identity is required by the completed DD set, and no authored primary IS falls outside the register.

### 3.2 Identity result

**PASS.** No duplicate primary IS identity, missing registered primary specification, or unregistered authored primary specification was identified.

### 3.3 Layout result

**PASS.** The active Level 4 corpus conforms to the flat `docs/implementation/` layout and `is-<number>-<subject>-implementation-specification-v01.md` naming convention.

---

## 4. Horizontal Architectural Result

### 4.1 Application authority

**PASS.** IS-1 remains the implementation owner of invocation, authoritative catalogue/dispatch, canonical application outcome construction/projection and final Application Engine acceptance. Domain and capability specifications consistently return domain/capability evidence to that path rather than creating parallel application engines.

IS-22 correctly treats TUI and Headless as projections over IS-1 rather than independent command systems.

### 4.2 Managed Project and Configuration

**PASS.** IS-2 and IS-3 preserve the staged bootstrap model and separate project identity/scope from configuration applicability/precedence. Recognition, repository reachability, cwd and framework evidence do not become mutation authority.

The effective sequence remains:

```text
bootstrap/context-independent configuration
 -> managed-project resolution
 -> project/scope-dependent configuration
 -> operation configuration snapshot
 -> managed scope / authorization / use-case execution
```

No domain or capability IS establishes a competing configuration precedence or managed-scope authority.

### 4.3 Canonical outcomes and diagnostics

**PASS.** Capability/provider results remain evidence. Domain results remain subordinate to final IS-1 acceptance. IS-22 renders/serializes canonical outcome projections and does not recalculate success from prose, colour, spinner state or provider exit codes.

No competing cross-application `success: boolean` contract is required by the reconciled design.

### 4.4 Capability/domain pairs

**PASS.** The corpus preserves the required pairs:

```text
IS-6  Repository Capability      <-> IS-15 Git Domain
IS-10 AI Capability              <-> IS-20 AI Domain
IS-11 Quality Capability         <-> IS-18 Quality Domain
IS-12 Documentation Capability   <-> IS-17 Docs Domain
IS-13 Nuxt Capability            <-> IS-16 Nuxt Domain
```

Technical capability does not become application intent/policy/orchestration.

### 4.5 Source evidence and mutation

**PASS.** IS-7 remains read-only structural evidence. IS-8 owns approved bounded existing-source transformation. IS-4 owns bounded resource mechanics. Owning use cases/IS-1 retain scope, authorization and final acceptance.

No universal `StructuralFact` framework is required; similarly shaped records remain capability-specific where their semantics differ.

### 4.6 Repository/Git separation

**PASS.** IS-6 supplies bounded repository facts/primitives while IS-15 owns Git intent, policy and orchestration. Repository capability does not stage implicitly, invent force semantics, choose application continuation, or determine final Git-domain acceptance.

### 4.7 AI boundary

**PASS.** IS-10 owns bounded provider/model execution, disclosure validation and response normalization; IS-20 owns AI-domain project-resource/instruction intent. AI output remains proposal/evidence and cannot choose targets, broaden scope, authorize effects, execute generated tools or establish application truth.

### 4.8 Documentation boundary

**PASS.** IS-12 remains a shared documentation mechanism while IS-17 owns documentation use-case intent, target/profile/output/update policy and acceptance. Existing-source semantic mutation routes through IS-8; new-resource creation routes through the owning use case and IS-4.

### 4.9 Quality boundary

**PASS.** IS-11 invokes/normalizes technical checks while IS-18 owns quality intent, operation-specific policy and gate composition. Tool completion does not become application success.

### 4.10 Nuxt boundary

**PASS.** IS-13 owns Nuxt technical recognition/mechanisms while IS-16 owns Nuxt application intent/profile/layer/config orchestration. Documentation, Settings/licence and Git semantics remain outside Nuxt ownership.

### 4.11 Settings and Utils containment

**PASS.** IS-19 owns explicit persisted settings/metadata intent without taking over IS-3 effective-configuration precedence. IS-21 is deliberately narrow and does not recreate a generic helper authority; responsibilities with an established domain owner are delegated/reclassified rather than retained under Utils for historical convenience.

### 4.12 Interaction adapters

**PASS.** IS-22 provides one TUI/Headless adapter boundary over the same IS-1 catalogue/invocation contracts. Headless remains non-interactive and deterministic. TUI prompting acquires permitted input/authorization evidence but cannot decide application policy or safety.

### 4.13 Runtime/provider topology

**PASS at architectural level.** IS-23 preserves one Node.js/TypeScript process by default, explicit composition, ESM/NodeNext, compiled `dist`, thin launcher semantics and provider isolation. No capability boundary depends on process separation or provider-native objects crossing general AppManager contracts.

---

## 5. Reconciliation Findings

The horizontal architecture is coherent, but the audit identified three documentary/Level 4 integration defects that must be corrected before the corpus can be declared closed.

### R-01 — Implementation register lifecycle state

**Classification:** CONFIRMED — correction required.

`docs/implementation/implementation-specification-v01.md` still describes the register as “approved for authoring; individual specifications not yet authored”, marks every IS as `Planned`, calls the complete file list “Planned Files”, and identifies authoring IS-23 as the next step.

That state is now false. All 23 primary IS documents are authored and merged.

**Required correction:**

- change the register status to the completed Version 1 implementation-specification baseline;
- change all 23 entries from `Planned` to `Authored` or the project-standard equivalent;
- change future-tense authoring language where it now misstates current state;
- rename/reframe “Planned Files” as the canonical Version 1 files;
- replace the obsolete “Next Step” authoring instruction with the Level 4 reconciliation/implementation transition state;
- preserve the existing IS identities, selection rationale, boundaries and cross-cutting rules.

This is a project-state/documentation defect, not evidence that the 23-way decomposition is wrong.

### R-02 — IS-23 launcher/adapter integration

**Classification:** CONFIRMED — normative horizontal correction required.

IS-23 was authored before IS-22. Its executable section currently says the launcher constructs the composition root, invokes the IS-1 application boundary, and projects the canonical outcome using IS-1/IS-22 semantics.

IS-22 later makes the concrete adapter lifecycle explicit: IS-23 constructs the complete application and the selected TUI/Headless adapter; the adapter calls `AppManagerApplication.discover/invoke/cancel`; the launcher owns only process selection/signal/final-exit lifecycle.

These positions are close but not identical. If implemented literally, IS-23 can be read as allowing the launcher to bypass the selected adapter and invoke IS-1 directly.

**Required correction:** IS-23 shall state the concrete Version 1 process path as:

```text
thin launcher
 -> IS-23 composition root
 -> selected IS-22 adapter
 -> IS-1 AppManagerApplication
 -> canonical outcome
 -> IS-22 transport/presentation projection
 -> launcher process exitCode / shutdown
```

The launcher may pass raw process facts and signals to the adapter/application composition, but it shall not become a third invocation adapter.

### R-03 — IS-23 provisional dependency dispositions

**Classification:** CONFIRMED — correction required.

IS-23's dependency table contains provisional phrases such as `pending IS-22 review`, `pending IS-10 review`, `pending owning IS review` and `pending IS-6 review`. Those owning specifications now exist, so the provisional state is stale.

The reconciled dispositions are:

| Dependency | Reconciled Level 4 position |
|---|---|
| `@clack/prompts` | **RETAIN** under IS-22 TUI presentation/input only. |
| `picocolors` | **RETAIN** under IS-22 TUI presentation only. |
| `simple-git` | **RETAIN / ADAPT** as the IS-6 Git CLI/provider mechanism behind AppManager repository contracts. |
| `jsonc-parser` | **RETAIN** where selected by IS-7/IS-8 for JSON/JSONC inspection/transformation; provider objects do not escape owning boundaries. |
| `@google/generative-ai` | **REVIEW / REMOVE if unused by an explicitly implemented provider adapter.** IS-10 selects a provider-independent boundary and permits Node `fetch` for verified compatible HTTP providers; the historical SDK is not an architectural dependency. |
| `consola` | **RETAIN** only as runtime logging/observability mechanism; it is not IS-22 outcome/diagnostic semantics. |
| `dotenv` | **ADAPT** as an IS-3 bootstrap candidate-input mechanism only. |
| `zod` | **RETAIN where an owning contract selects it**; package presence does not establish cross-domain validation authority. |
| `vitepress` | **RETAIN** as documentation tooling below IS-12/IS-17. |

IS-23 shall remove “pending later IS” wording and defer semantic ownership to the now-authored owning specifications.

---

## 6. Allegations Not Sustained

The pass specifically looked for, but did not sustain, the following potential defects:

- a second application outcome model in IS-22;
- a generic structural-fact abstraction spanning Source Intelligence, Nuxt and Documentation;
- Repository Capability absorbing Git-domain orchestration;
- Documentation Capability absorbing Docs-domain policy;
- Quality Capability deciding Quality-domain/application acceptance;
- AI provider output acquiring mutation/tool authority;
- Settings persistence becoming effective-configuration precedence;
- Utils becoming a generic fallback/helper domain;
- TUI and Headless implementing separate business workflows;
- cwd becoming authoritative managed scope;
- provider-native exit/error semantics becoming canonical application semantics;
- Source Intelligence acquiring existing-source mutation authority;
- a requirement for separate runtime processes merely to preserve capability boundaries.

---

## 7. Correction Programme

The Level 4 reconciliation shall close through three bounded correction items:

```text
R-01  Register lifecycle/state correction
R-02  IS-23 launcher <-> IS-22 adapter integration correction
R-03  IS-23 dependency-disposition finalisation
        |
        v
final Level 4 reconciliation verification
        |
        v
Version 1 Implementation Specification baseline closed
        |
        v
implementation may proceed against reconciled Level 4 authority
```

R-02 and R-03 should be performed together if convenient because both modify IS-23 and neither changes higher-level architecture.

No new primary IS identity, DD clarification or ADR is presently required.

---

## 8. Implementation Entry Guardrails

Until the corrections above are merged, implementation work shall treat the owning IS documents as authoritative over stale provisional wording in the register/IS-23 dependency table and shall preserve these invariants:

1. one IS-1 Application Engine/invocation authority;
2. IS-2 managed scope and IS-3 effective configuration remain distinct;
3. delegated specialist execution never transfers application authority;
4. capability evidence is interpreted by the owning use case before final acceptance;
5. Source Intelligence remains read-only;
6. existing-source semantic mutation routes through IS-8;
7. provider/native objects and errors remain behind owning capability boundaries;
8. AI output remains non-authoritative proposal/evidence;
9. TUI/Headless use the same IS-1 semantics through IS-22;
10. IS-23 composes responsibilities but does not absorb them;
11. no implementation shall infer architecture from the legacy source topology where Level 4 specifies a target boundary;
12. responsibility-level RETAIN/ADAPT/SPLIT/RELOCATE/REPLACE dispositions govern migration rather than whole-file preservation/replacement assumptions.

---

## 9. Audit Decision

**PASS WITH REQUIRED RECONCILIATION CORRECTIONS.**

The complete IS-1 through IS-23 architecture is horizontally coherent. The audit found no reason to reopen the approved DD decomposition, no missing primary implementation responsibility and no blocking semantic contradiction between the domain/capability/application boundaries.

The Level 4 programme is **not yet closed**, because R-01 through R-03 are confirmed live-document defects. They are bounded reconciliation corrections rather than architectural redesign.

The next authorised action is:

> **Apply R-01, then R-02/R-03, then perform a final live-master verification and issue the Level 4 reconciliation closeout.**
