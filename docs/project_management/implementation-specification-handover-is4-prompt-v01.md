# Fresh-Session Prompt — Continue AppManager Implementation Specifications at IS-4

Copy the prompt below into a new ChatGPT conversation with GitHub access.

---

We are continuing the AppManager Version 1 Implementation Specification programme from the repository handover.

First ingest:

`docs/project_management/implementation-specification-handover-is4-v01.md`

Treat that handover as project-management navigation/state, not normative design authority. Follow its authoritative reading order and verify the current repository state rather than relying on historical branch, commit or pull-request assumptions recorded in the handover.

Confirm that the handover PR is merged and verify the exact current `master` baseline. Do not edit `master` directly. Before making any change, create a fresh session branch from current `master`, using a suitable name such as:

`ai/is4-resource-access`

The next objective is **IS-4 — Resource Access**.

Perform a read-first analysis before editing. Read the Implementation Specification register and plan, IS-23, DD-2.1 Resource Access, ADR-0001 and any upstream DD-1 contracts materially referenced by DD-2.1. Then inspect the current Resource Access implementation horizontally, including `app/services/fileService.ts`, its interface/types, direct callers, tests, path/resource helpers and higher-level consumers of its JSON/JSONC/update behaviour.

Apply the approved legacy disposition method at responsibility level: `RETAIN`, `ADAPT`, `SPLIT / RELOCATE`, or `REPLACE`. Preserve good legacy implementation where it conforms. Do not treat the current `FileService` class or the historical `services/` directory as target architectural authority.

Author:

`docs/implementation/is-4-resource-access-implementation-specification-v01.md`

Make IS-4 concrete enough to implement in Node.js/TypeScript. Resolve the Resource Access interfaces/provider boundary, resource/path representation, normalization and containment, filesystem primitives, atomic and best-effort mutation mechanics, stale-state/precondition handling, relevant symlink/traversal safety, metadata evidence, text/binary/encoding responsibility, normalized technical failures, material concurrency/cancellation behaviour, dependency wiring, tests and legacy migration.

Preserve the established architecture: Application Engine retains final application authority; managed scope is explicit; technical filesystem reachability does not grant mutation authority; Configuration Resolution owns precedence; canonical outcomes remain DD-1-owned; evidence remains evidence until interpreted; existing-source semantic mutation belongs to Source Transformation; provider/native filesystem errors must not become application semantics; and IS-4 must not absorb Settings, templates, Utils or domain intent.

Do not invent a generic storage framework, cloud/object-store support or other abstractions merely because they could be generalized from filesystem access. Specify the approved Version 1 responsibility.

IS-23 is already the settled build/runtime foundation. Do not casually reopen its Node.js/TypeScript, ESM/NodeNext, pnpm, compiled `dist/`, thin-launcher or composition-root decisions.

When the specification is complete, compare the session branch against the verified base, ensure the change is focused, open a pull request against `master`, and leave it unmerged for user review. Report the branch, exact base/head commits, changed files/statistics, key implementation decisions, legacy dispositions and PR link.

The planned next specification after IS-4 is **IS-5 — Process Execution**.