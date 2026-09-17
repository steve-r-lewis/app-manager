# Maintenance Domain Reclassification Clarification

> **Document type:** Detailed Design clarification
>
> **Status:** Active — temporary PBC-1 integration vehicle
>
> **Primary Detailed Design:** [DD-4.4 — Utils Domain](../dd-4-4-utils-domain-detailed-design-v01.md)
>
> **Functional binding:** [Maintenance Domain Functional Specification](../../functional/utils-functional-specification-v01.md#_2-1-canonical-version-1-command-surface)

## 1. Purpose

This clarification reclassifies DD-4.4 from Utils Domain to Maintenance Domain while preserving its bounded source-header, source-version and disposable-artefact responsibilities. NCR-2 shall rename/integrate the primary DD-4.4 owner and retire this clarification.

## 2. Domain Identity

The canonical domain identity is `maintenance`, not `utils`. DD-4.4 remains a Policy and Resource Domain, but its purpose is explicit project maintenance rather than miscellaneous utility work.

## 3. Operation Identities

DD-4.4 shall own exactly:

```text
maintenance.headers.validate
maintenance.headers.repair
maintenance.source-version.maintain
maintenance.cleanup
```

No additional operation is created by the rename.

## 4. Stronger-Owner Gate

Before accepting a maintenance intent, DD-4.4 shall determine whether another application domain owns the semantic object/policy. If so, the operation is not Maintenance-owned and remains with that stronger owner under normal Application Engine orchestration. This prevents DD-4.4 from becoming a generic fallback domain.

## 5. Preserved Responsibilities

DD-4.4 continues to own application intent/policy/orchestration for supported managed source-header conformance inspection, bounded repair of recognised source-header defects, supported source-header/file version metadata maintenance, and narrowly classified disposable temporary/test/log artefact cleanup.

Existing-source mutation remains Source Transformation-owned; resource inspection/deletion mechanics remain Resource Access-owned; managed scope/final authority remain Application Core-owned.

## 6. Explicit Non-Ownership

DD-4.4 does not own App clean/reset/prepare, Nuxt cleanup/upgrade, Git maintenance, documentation updates, Quality evaluation, Settings resource lifecycle, AI instruction lifecycle, arbitrary filesystem cleanup, arbitrary source editing or shell/process execution.

## 7. Acceptance

Capability/provider success remains subordinate evidence. DD-4.4 evaluates its operation-specific maintenance postcondition and supplies its domain result to the Application Engine for final application acceptance.