# AppManager Version 1 Implementation Specification Handover — IS-4

> **Document type:** Project-management handover
>
> **Status:** Current handover for continuation in a fresh working session
>
> **Date:** 2026-09-15
>
> **Next primary objective:** `IS-4 — Resource Access`

## 1. Purpose

This handover provides navigation, verified project state, settled implementation-planning decisions and continuation instructions for the AppManager Version 1 Implementation Specification programme.

It is project-management navigation and state, not normative design authority. The underlying Design, Functional, Detailed Design, ADR and Implementation Specification documents remain authoritative.

The next session must verify live repository state before acting. Branch, pull-request and commit state recorded here describes the handover point and must not be assumed to remain current.

## 2. Verified Handover State

The Design, Functional and Detailed Design work required for implementation planning is complete. The final Detailed Design conformance audit passed without blocking, major or minor normative defects. The Implementation Specification plan, selection map and 23-document Version 1 register are established. The legacy implementation disposition method is approved and merged.

`IS-23 — Build and Runtime Assembly` is authored and merged. PR #127 was verified merged, with merge commit `3a185b2e2d3058e4e19effaf7452a78222ae4fd4`. Live `master` was verified at that commit before this handover branch was created.

The next dependency-aware specification is `IS-4 — Resource Access`. `IS-5 — Process Execution` follows IS-4.

The next session must verify current `master`, then create a fresh session branch from that exact baseline before editing.

## 3. Authoritative Reading Order

Before writing IS-4, read:

1. this handover — navigation/state only;
2. `docs/project-documentation-guide-v01.md`;
3. `docs/implementation/implementation-specification-v01.md`;
4. `docs/project_management/implementation-specification-plan-v01.md`;
5. `docs/project_management/implementation-specification-map-v01.md`;
6. `docs/implementation/is-23-build-and-runtime-assembly-implementation-specification-v01.md`;
7. `docs/dd_2_shared_capabilities/dd-2-1-resource-access-detailed-design-v01.md`;
8. relevant DD-1 contracts referenced by DD-2.1;
9. `docs/project_management/decisions/adr-0001-primary-application-runtime.md`;
10. current source and tests relevant to Resource Access, beginning with `app/services/fileService.ts` and its interfaces, types, callers and tests.

Follow normative references from DD-2.1 where they materially constrain implementation. Do not substitute this handover summary for normative text.

## 4. Authority and Implementation Rules

The normative chain is:

```text
Design -> Functional -> Detailed Design -> Implementation Specification -> code
```

Project-management documents coordinate work but do not establish design authority. Current source is implementation evidence and migration material, not target authority. Archive material is non-authoritative unless incorporated by an active normative specification.

Implementation must preserve these settled constraints where applicable:

- Application authority remains with the Application Engine; delegated specialist execution does not transfer final authority.
- Managed scope is explicit; discovery, recognition or technical reachability does not grant mutation authority.
- Configuration resolution is centralized; persistence is not precedence.
- Canonical outcomes remain DD-1-owned; technical/provider results must be normalized.
- Evidence remains evidence until interpreted by its owner.
- Source Intelligence is read-only; existing-source mutation follows Source Transformation semantics.
- AI remains non-authoritative.
- Capability/domain pairs remain distinct.
- Provider replaceability is preserved unless an accepted ADR changes it.
- Do not recreate a generic Utils/helper authority.
- Do not infer target architecture from historical folder, class or service names.
- Do not create one class/module per DD merely because the DD exists.

## 5. Implementation Specification Sequence

```text
IS-23  Build and Runtime Assembly       COMPLETE / MERGED
  |
  +--> IS-4   Resource Access           NEXT
  +--> IS-5   Process Execution
  |
  v
IS-1   Application Runtime and Invocation
  |
  +--> IS-2   Managed Project Resolution
  +--> IS-3   Configuration Resolution
  +--> IS-6 .. IS-13  shared capabilities
  |
  v
IS-14 .. IS-21  domain implementations
  |
  v
IS-22  Interaction Adapters
```

The IS number is identity, not writing-order or authority rank.

## 6. Legacy Implementation Disposition

The project rejects rewrite-by-default. Each primary IS assesses relevant current implementation at responsibility level using `RETAIN`, `ADAPT`, `SPLIT / RELOCATE`, or `REPLACE`.

The governing rule is:

> **Preserve conforming code and good implementation mechanisms by default; refactor, split or replace only to satisfy an approved contract or produce a materially clearer and safer implementation boundary.**

A single legacy file may receive several dispositions for different responsibilities.

## 7. IS-23 Settled Foundation

IS-23 establishes Node.js + TypeScript, ESM/NodeNext, pnpm, compiled production JavaScript under `dist/`, a thin installed `app-manager` launcher, an explicit composition root, controlled translation of process globals, explicit construction rather than import-time application-semantic registration, production/test compiler separation, subordinate logging infrastructure, assembly conformance tests, and preservation/adaptation of good legacy runtime mechanisms.

IS-4 must conform to this foundation and must not casually reopen it.

## 8. IS-4 Objective

The next normative document is:

`docs/implementation/is-4-resource-access-implementation-specification-v01.md`

Its principal Detailed Design is:

`docs/dd_2_shared_capabilities/dd-2-1-resource-access-detailed-design-v01.md`

The implementation question is:

> **Which concrete Node.js/TypeScript interfaces, providers, result/error models and safety mechanics realise bounded resource access without allowing filesystem reachability to become application intent, scope, transformation policy or final acceptance?**

IS-4 must be implementation-ready but must not absorb responsibilities belonging to Configuration Resolution, Source Transformation, Settings, Utils, templates or domain use cases.

## 9. Required Read-First Legacy Analysis

Inspect Resource Access horizontally rather than treating `fileService.ts` as the target boundary. Inspect the service, its interface and related types, direct callers, file-operation tests, path assumptions, logging/configuration dependencies, source-transformation callers, and settings/templates/resource-registry persistence that uses filesystem mechanics.

Classify individual responsibilities rather than the whole file.

Investigation hypotheses include: asynchronous file mechanics and atomic temporary-file/rename mechanics are likely preservation candidates; filesystem error normalization is valuable but must conform to DD-2.1; JSON/JSONC structural editing may belong partly above Resource Access; extension-specific update policy is likely above the boundary; and containment, stale-state and mutation-safety requirements may need stronger mechanics than the current service provides.

These are hypotheses to verify, not approved implementation decisions.

## 10. Boundary Questions for IS-4

Resolve concrete resource/path representation; normalization and containment; required read/write/create/delete/move/replace primitives; atomic replacement and best-effort mutation guarantees; stale-state/precondition checks; symlink/traversal handling where relevant; filesystem metadata evidence; encoding and text-versus-binary responsibility; normalized technical errors/results; material cancellation/concurrency behaviour; logging/configuration dependencies; provider abstraction only where justified; tests; and legacy migration/disposition.

Do not invent cloud/object-store/network support merely because a generic interface could theoretically accommodate it. Specify approved Version 1 needs.

## 11. Known Good Legacy Work

`loggerService.ts` contains useful logging/redaction/lifecycle mechanisms and is principally RETAIN/ADAPT. `fileService.ts` contains useful asynchronous filesystem, atomic-write and error-handling mechanics expected to be split between IS-4 and higher-level owners where necessary. `githubService.ts` contains useful Git/GitHub provider mechanics that will later be separated between Repository Capability, Git Domain workflow policy and any concrete hosting-provider boundary.

These examples establish the preservation method, not automatic approval of every line.

## 12. Repository Workflow

For each new work item: verify the preceding PR is merged; fetch current `master` and record its exact SHA; create a fresh session branch; perform read-first analysis; make focused changes only on that branch; compare it with the verified base; open a focused PR against `master`; and leave merge authority with the user unless explicitly instructed otherwise.

Do not rely on temporary branch or PR state recorded by a previous session.

## 13. Recent Milestones

The final DD conformance audit passed, its project-management register correction was merged, the Implementation Specification Plan and selection map were merged, the 23-document Version 1 register was merged, the legacy disposition rule was merged in PR #126, and IS-23 was authored in PR #127 and verified merged at this handover point.

The next session must nevertheless verify live repository state before continuing.

## 14. Editorial and Engineering Style

Use specialist terminology only where it names a real technical distinction. Use ordinary English for project activity. Implementation Specifications should be concrete and implementation-ready without becoming ceremonial templates.

Do not create abstractions from naming or structural similarity alone. A generic framework must be justified by an actual shared semantic contract and Version 1 need.

## 15. Completion Criteria for the Next Session

The next session should verify the handover PR and current `master`, create a fresh branch, read DD-2.1 and relevant upstream normative material, inspect current Resource Access code/callers/tests, complete responsibility-level legacy disposition, author IS-4 with concrete Node.js/TypeScript decisions, verify it does not absorb neighbouring authorities, compare the branch against its base, and open a focused unmerged PR.

After successful IS-4 approval, proceed to `IS-5 — Process Execution`.

## 16. Fresh-Session Prompt

The ready-to-use prompt is stored alongside this handover at:

`docs/project_management/implementation-specification-handover-is4-prompt-v01.md`