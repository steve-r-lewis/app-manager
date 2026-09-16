# Functional Traceability Authority Vocabulary Clarification

> **Status:** Active Functional clarification
>
> **Clarifies:** Functional-specification traceability tables that use architectural subsystem/capability labels as `current authority`
>
> **Normative scope:** Functional-level traceability and authority vocabulary only

## 1. Purpose

Several Functional traceability tables use capitalized architectural labels such as `Repository Capability`, `Source Intelligence`, `Resource Registry and Template`, `Process Execution boundary`, `Quality boundary` or similar terms in columns labelled `Current authority` or `Primary current authority`.

Those labels correspond to lower-level architectural decomposition and must not be read as if a Detailed Design subsystem were an upstream Functional authority.

## 2. Functional Authority Rule

At Functional level, normative authority comes from:

- the root Design Specification for approved architectural constraints and domain model;
- the applicable Functional Specification itself for its observable behaviour;
- other Functional Specifications where an explicit cross-functional contract is consumed.

Detailed Design names may appear in Functional documents only as downstream traceability/orientation. They do not define or override Functional meaning.

## 3. Reading of Existing Traceability Tables

Until DR-6 folds this clarification into the primary Functional corpus:

- `Repository Capability` in a Functional traceability table means the Functional repository/Git concern is expected to receive a downstream repository-capability refinement; it is **not** an upstream authority over `FR-GIT-*`;
- `Source Intelligence` or `Source Intelligence boundary` means downstream read-only source-inspection/structural-evidence refinement of already stated Functional inspection requirements;
- `Resource Registry and Template` means downstream declarative registry/template refinement of Functional generation/resource requirements;
- `Process Execution boundary` means downstream executable-tool/process refinement beneath the owning Functional use case;
- `Quality boundary`, `Documentation boundary`, `Git boundary`, `Nuxt boundary`, `Settings boundary`, `App boundary` and equivalent labels identify architectural refinement seams, not additional Functional authorities.

Where a table also cites `FR-*`, Root Design, Managed Project, Configuration, Application Invocation, Source Transformation or another actual Functional source, that upstream source retains its normal authority.

## 4. Required Fold-Forward

DR-6 shall revise affected Functional traceability tables so their headings and entries distinguish at least:

```text
upstream / same-level normative authority
from
downstream refinement destination
```

A single column shall not label a lower-level DD subsystem as `current authority`.

The fold-forward must preserve all useful traceability information; this clarification does not authorize deleting downstream architectural trace links merely because they are not Functional authorities.

## 5. Non-Effect

This clarification changes no `FR-*` obligation, functional-domain ownership, Detailed Design capability boundary or implementation contract. It corrects hierarchy vocabulary and prevents downward references from being mistaken for upward authority.