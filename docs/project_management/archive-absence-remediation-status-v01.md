# AppManager Archive-Absence Remediation Status

> **Status:** In progress
>
> **Authority:** Non-normative project-management record. This document tracks corrective work arising from the archive-absence conformance audit; it does not create product requirements or architectural authority.
>
> **Baseline:** `master` at `455eef92030466cfcf042fad0815c612471e25a4`, after merge of PR #67.

## 1. Purpose

PR #67 established the audit and identified the remaining conformance defects. This record tracks their remediation before DD-2.7 begins.

The acceptance criterion remains:

> **If `docs/archive/` were unavailable, the current live documentation must remain sufficient to understand the approved AppManager architecture, functional requirements, detailed design, decision authority, and implementation obligations defined so far.**

## 2. Remediation Order

1. Functional Specifications with direct archive dependencies.
2. Functional Specifications retaining historical reconciliation/disposition narrative without direct archive links.
3. Completed Detailed Design Specifications containing implementation/historical reconciliation narrative.
4. Root Design, Documentation Guide, ADRs, README, AGENTS and live project-management interpretation.
5. Implementation-adjacent metadata, especially `app_manager/templates/template-repository.json`.
6. Repository-wide final conformance search and semantic review.

## 3. Change Discipline

Corrective edits shall:

- preserve every current FR/DD requirement and enduring architectural boundary;
- move or remove historical provenance rather than silently dropping the requirement it originally justified;
- replace historical-source traceability with current authority where traceability remains useful;
- avoid changing runtime behaviour while correcting documentation or descriptive metadata;
- keep historical evidence in non-normative project-management/audit records where useful;
- treat archive absence as a semantic test, not merely a broken-link test.

## 4. Current State

**IN PROGRESS.** The first corrective pass targets the Functional Specification layer identified by the PR #67 audit. DD-2.7 remains blocked until this remediation record reaches a final conformance result.
