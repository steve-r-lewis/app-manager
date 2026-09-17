# AppManager Version 1 Maintenance Domain Clarification

> **Document type:** Design clarification
>
> **Status:** Active — temporary PBC-1 integration vehicle
>
> **Scope:** Reclassification of Version 1 `utils` as `maintenance`
>
> **Governing authority:** [AppManager Design Specification](appmanager-design-specification-v01.md)
>
> **Review evidence:** [Version 1 Canonical Command Ownership Review](project_management/command-ownership-review-v01.md)

## 1. Purpose

This clarification replaces the ambiguous Version 1 `utils` product-domain identity with the semantically bounded `maintenance` domain. It follows a complete 78-command stronger-owner review and does not change total command cardinality.

NCR-1 shall fold the Design-level propositions into the canonical Design owner and retire this temporary clarification.

## 2. Domain Definition

Maintenance owns explicit project-maintenance intent that preserves, repairs, refreshes or removes non-semantic/regenerable project state and for which no stronger product domain owns the primary semantic object or policy being maintained.

Maintenance is not a miscellaneous utility namespace and shall not become a fallback for commands that are difficult to classify.

## 3. Stronger-Owner Rule

A maintenance-like operation remains with another domain when that domain owns the semantic object, policy or postcondition being maintained. Verbs such as `clean`, `reset`, `upgrade`, `update`, `delete`, `remove`, `repair` and `validate` do not determine domain ownership.

Consequently App lifecycle maintenance remains App-owned; Nuxt framework maintenance remains Nuxt-owned; Git repository maintenance remains Git-owned; documentation maintenance remains Docs-owned; Quality evaluation remains Quality-owned; Settings resource lifecycle remains Settings-owned; and AI instruction-resource lifecycle remains AI-owned.

Technical filesystem, process and source-transformation mechanisms remain capability/provider concerns rather than Maintenance commands.

## 4. Canonical Maintenance Surface

The Version 1 Maintenance domain shall expose exactly four canonical identities:

```text
maintenance.headers.validate
maintenance.headers.repair
maintenance.source-version.maintain
maintenance.cleanup
```

These replace, respectively:

```text
utils.headers.validate
utils.headers.repair
utils.source-version.maintain
utils.cleanup
```

`utils` shall cease to be a canonical Version 1 domain identifier. Transitional interaction aliases may exist only for compatibility and shall not create competing semantics.

## 5. Command Intent

`maintenance.headers.validate` validates AppManager-managed source-header conformance without acquiring general Quality-domain authority.

`maintenance.headers.repair` repairs recognised non-conforming managed source headers under bounded header-maintenance policy.

`maintenance.source-version.maintain` maintains source-header/file version metadata according to the defined source-version maintenance policy.

`maintenance.cleanup` removes only narrowly classified disposable project artefacts such as explicitly supported temporary/test/log artefacts. It is not App clean/reset and is not Nuxt generated/cache cleanup.

## 6. Quantified Ownership Result

The PBC-1 command ownership review assessed all 78 canonical identities: App 8, Git 8, Nuxt 13, Docs 13, Quality 10, Settings 18, AI 4 and Utils/Maintenance 4. The result is 78/78 accounted, 0 cross-domain relocations, 0 added commands, 0 removed commands and 4 canonical identity renames under one domain rename.

No generic `maintenance.inspect`, `maintenance.check` or aggregate `maintenance.repair` command is introduced.

## 7. NCR Integration

NCR-1 shall integrate the Design/Functional naming and boundary; NCR-2 shall integrate the Maintenance Domain Detailed Design; NCR-3 shall integrate IS-21 and interaction/catalogue references. The temporary PBC-1 clarification layer shall then be retired.