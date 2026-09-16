# DD-2 Sibling Authority Clarification

> **Status:** Active Detailed Design clarification
>
> **Clarifies:** DD-2.1 through DD-2.8 sections titled `Conformance Rules for Later DD-2 Designs` and equivalent sibling-directed wording
>
> **Normative scope:** Same-level DD-2 authority and cross-capability consumption only

## 1. Purpose

Several DD-2 documents were authored sequentially and contain sections phrased as `Conformance Rules for Later DD-2 Designs`. That wording can incorrectly imply that a lower-numbered Detailed Design has authority over a higher-numbered sibling.

DD family/item numbering is organisational identity, not an authority hierarchy. No DD-2 sibling acquires superior normative rank because it was authored earlier or has a lower number.

## 2. Correct Same-Level Reading

Each DD-2 document is authoritative only for the capability contract assigned to it by the upstream Design and Functional hierarchy.

A DD-2 document may define constraints on **consumption of its own contract**. For example, Resource Access may state what a caller must supply to use Resource Access safely and what Resource Access will or will not do. It may not, merely as DD-2.1, define unrelated policy for Process Execution, Repository Capability, Source Intelligence or another sibling capability.

Accordingly, sibling-directed conformance sections shall be read as cross-capability consumption/boundary statements only where the statement follows from the capability contract owned by the document containing it.

## 3. Cross-Capability Rules

A rule genuinely shared across multiple capabilities must derive from an upstream owner or from the independently authoritative contract of the concern being consumed. Typical upstream owners include:

- root Design architectural invariants;
- applicable Functional requirements;
- DD-1 Application Core contracts for invocation, outcomes, managed scope, configuration and final Application Engine authority.

A same-level sibling may be referenced as the owner of its specialist contract, but it does not become a governing layer over the consuming sibling.

## 4. Numbering and Authoring Order

The following implications are invalid:

```text
DD-2.1 < DD-2.2 < ... < DD-2.10
therefore DD-2.1 governs DD-2.2 through DD-2.10
```

and:

```text
authored earlier
therefore normatively superior
```

The valid relationship is contract-based:

```text
upstream Design / Functional / DD-1 authority
        |
        +--> DD-2 capability A
        +--> DD-2 capability B
        +--> DD-2 capability C

capability B consumes capability A contract where required
without becoming subordinate to A as a specification level
```

## 5. Fold-Forward

DR-4 shall rationalise the affected DD-2 primary sections. It may remove the authoring-order framing, retain valid owner-contract consumption constraints, and relocate genuinely cross-capability invariants to their canonical upstream owner/reference.

Until that fold-forward occurs, no `Conformance Rules for Later DD-2 Designs` section shall be interpreted as establishing authority from DD numbering alone.

## 6. Non-Effect

This clarification does not weaken valid Resource Access, Process Execution, Repository, Source Intelligence, Source Transformation, Registry/Template, AI, Quality, Documentation or Nuxt capability boundaries. It corrects only the source and direction of normative authority.