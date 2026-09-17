# Maintenance Domain Implementation Clarification

> **Document type:** Implementation clarification
>
> **Status:** Active — temporary PBC-1 integration vehicle
>
> **Primary implementation:** [IS-21 — Utils Domain](../is-21-utils-domain-implementation-specification-v01.md)
>
> **DD binding:** Maintenance Domain Reclassification Clarification (DD-4.4 clarification)

## 1. Purpose

This clarification reclassifies IS-21 as the Maintenance Domain implementation and replaces the four `utils.*` canonical IDs with `maintenance.*`. Existing bounded implementation responsibilities remain otherwise intact. NCR-3 shall rename/integrate IS-21 and retire this clarification.

## 2. Canonical Catalogue

IS-21 shall register exactly:

```text
maintenance.headers.validate
maintenance.headers.repair
maintenance.source-version.maintain
maintenance.cleanup
```

The following cease to be canonical identities:

```text
utils.headers.validate
utils.headers.repair
utils.source-version.maintain
utils.cleanup
```

IS-22 may support temporary `utils.*` aliases if migration compatibility is required, but aliases resolve to the Maintenance identities and never create separate descriptors, policy or outcomes.

## 3. Module Boundary

The normative implementation topology shall use Maintenance naming, for example:

```text
app/domains/maintenance/
  contracts/
  catalogue/
  policy/
  orchestration/
  use-cases/
```

No `utils` catch-all module is introduced alongside it. Generic technical helpers, if any, remain ordinary implementation details and do not constitute a product domain.

## 4. Stronger-Owner Enforcement

IS-21 shall preserve the existing stronger-owner gate as an explicit Maintenance invariant. Command registration and use-case applicability shall not permit Maintenance to absorb operations whose semantic owner is App, Git, Nuxt, Docs, Quality, Settings or AI.

## 5. Use-Case Mapping

The four existing use-case responsibilities map one-for-one:

```text
validate headers       -> maintenance.headers.validate
repair headers         -> maintenance.headers.repair
maintain source version -> maintenance.source-version.maintain
cleanup                 -> maintenance.cleanup
```

Header repair and source-version mutation continue through IS-8 Source Transformation where existing source is changed. Cleanup deletion mechanics continue through IS-4 Resource Access. Process/provider mechanics, if required, remain behind their established capability seams.

## 6. Interaction and Composition

TUI, GUI and Headless shall discover the same Maintenance descriptors through the canonical IS-1 catalogue/IS-22 projection. IS-23 shall compose Maintenance as a normal injected application domain; no adapter-specific Utils command list or maintenance policy is permitted.

## 7. Cardinality and Compatibility

The implementation catalogue remains four commands for this domain and 78 commands overall after the PBC-1 App/Nuxt corrections. Compatibility aliases, if implemented, are not counted as canonical commands.