# Maintenance Domain Functional Clarification

> **Document type:** Functional clarification
>
> **Status:** Active — temporary PBC-1 integration vehicle
>
> **Design binding:** [Version 1 Maintenance Domain Clarification](../../appmanager-version-1-maintenance-domain-clarification-v01.md)
>
> **Review evidence:** [Version 1 Canonical Command Ownership Review](../../project_management/command-ownership-review-v01.md)

## 1. Purpose

This clarification reclassifies the existing Utils functional responsibility as Maintenance and binds the four renamed canonical identities. Existing observable header/version/cleanup behaviour remains in force except that `utils` is no longer the canonical domain namespace.

NCR-1 shall fold these deltas into the canonical Functional owner and retire this temporary clarification.

## 2. Canonical Identities

```text
maintenance.headers.validate
maintenance.headers.repair
maintenance.source-version.maintain
maintenance.cleanup
```

Any historical `utils.*` spelling is transitional compatibility vocabulary only.

## 3. Functional Boundary

### PBC-FR-MAINT-001 — Primary maintenance intent
A Maintenance command shall represent explicit project-maintenance intent over a bounded recognised maintenance concern for which no stronger product domain owns the semantic object/policy.

### PBC-FR-MAINT-002 — Stronger-owner exclusion
Maintenance shall not absorb App, Git, Nuxt, Docs, Quality, Settings or AI operations merely because they clean, reset, upgrade, update, remove, delete, repair or validate domain-owned state.

### PBC-FR-MAINT-003 — No generic utility authority
Maintenance shall not accept arbitrary paths, shell commands, transformations or unspecified "fix" requests as a generic utility/repair surface.

### PBC-FR-MAINT-004 — Managed scope
Maintenance targets shall remain within authoritative managed scope and operation-specific eligible resource classes. Discovery/reachability shall not grant mutation authority.

## 4. Header Validation and Repair

`maintenance.headers.validate` shall inspect supported managed source headers and report conformance/diagnostics without mutating source.

`maintenance.headers.repair` shall repair only recognised supported header defects for explicitly eligible managed source resources. It shall preserve unrelated source semantics and shall use the established source-transformation boundary for existing-source mutation.

Header validation is maintenance-specific conformance and does not replace Quality-domain test/lint/type/gate semantics.

## 5. Source-Version Maintenance

`maintenance.source-version.maintain` shall maintain the supported source-header/file version metadata according to explicit maintenance policy and recognised current state. It shall not become general package, application, Nuxt, documentation or repository version management.

## 6. Cleanup

`maintenance.cleanup` shall remove only explicitly recognised disposable maintenance artefact classes, including narrowly classified temporary/test/log artefacts where supported.

It shall not acquire App-owned root lifecycle clean/reset semantics, Nuxt-owned generated/cache cleanup, repository deletion, Settings resource deletion, Docs content deletion or arbitrary recursive filesystem cleanup.

## 7. Cardinality

The domain reclassification preserves four commands. The complete 78-command review found no command in another domain whose primary intent should be relocated to Maintenance and introduced no new aggregate Maintenance command.