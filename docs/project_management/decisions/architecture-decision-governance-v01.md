# AppManager Architecture Decision Governance

> **Status:** Active
>
> **Authority:** This document operates under `project-documentation-guide-v01.md` and governs the creation, review, acceptance, traceability, supersession, and retention of AppManager Architecture Decision Records (ADRs). It does not create a fifth specification level and must not contradict the Project Documentation Guide or an authoritative specification.

## 1. Purpose

AppManager uses Architecture Decision Records to preserve the rationale and consequences of significant engineering decisions whose context would otherwise be lost when the resulting requirement is incorporated into the specification hierarchy.

An ADR answers:

> What significant decision was made, why was it made, which alternatives were considered, and what consequences follow from it?

ADRs complement the Design, Functional, Detailed Design, and Implementation Specifications. They do not replace them.

## 2. Governance Model

The normal decision path is:

```text
proposal / open question
        |
        v
investigation or architecture review
        |
        v
proposed decision
        |
        v
proposed ADR
        |
        v
review and approval
        |
        v
accepted ADR
        |
        v
update affected authoritative specification(s)
        |
        v
detailed design and implementation
```

A proposal, investigation, Issue, Discussion, Pull Request, experiment, AI conversation, or project-management document may provide evidence or analysis, but none of those sources alone establishes an architectural decision.

A decision becomes durable when it is deliberately approved, recorded in an ADR where this governance requires one, and incorporated into the authoritative specification level or levels that the decision affects.

## 3. Relationship to the Specification Hierarchy

The normative specification hierarchy remains:

```text
Design Specification
        |
        v
Functional Specification
        |
        v
Detailed Design Specification
        |
        v
Implementation Specification
```

ADRs are orthogonal decision-provenance records, not a fifth level.

An ADR may constrain or explain one or more specification levels, but the resulting system requirement, behaviour, design, or implementation constraint must be incorporated into the specification that owns that responsibility.

The governing principle is:

> An ADR records why a significant decision was made; the specification hierarchy records what the approved system requires as a consequence.

An ADR must not become the sole normative source for behaviour or architecture required to build, test, operate, or maintain AppManager.

## 4. When an ADR Is Required

An ADR should be created when a decision is materially significant and one or more of the following apply:

- it establishes or changes a system-wide architectural direction;
- it selects a primary language, runtime, framework, platform, persistence mechanism, communication mechanism, deployment model, packaging model, or similarly consequential technology;
- it creates or materially changes a boundary between major subsystems or runtimes;
- it introduces a constraint that affects multiple specification areas or implementation workstreams;
- it is expensive or disruptive to reverse;
- meaningful alternatives exist and the reason for choosing among them is likely to matter later;
- it resolves a contentious, ambiguous, or repeatedly revisited architectural question;
- future maintainers would reasonably ask why the system was designed this way.

An ADR is normally unnecessary for:

- routine implementation choices local to one component;
- dependency updates that do not alter architecture or approved constraints;
- refactoring that preserves approved behaviour and architecture;
- formatting, naming, or editorial changes already governed elsewhere;
- temporary experiments that have not become approved design decisions.

When uncertain, the deciding factor should be whether preserving the rationale has durable engineering value.

## 5. Technology and Platform Selection

Project-wide technology choices must not arise merely from historical implementation, developer familiarity, convenience, or the current codebase.

Where a language, runtime, framework, platform, storage mechanism, protocol family, deployment model, packaging approach, or other technology materially constrains AppManager architecture or future development, it must be evaluated deliberately against project requirements.

A technology architecture review should consider, as applicable:

- architectural fit;
- functional requirements;
- portability and supported operating environments;
- distribution and installation;
- runtime and process model;
- performance and startup characteristics;
- reliability and failure isolation;
- security and attack surface;
- ecosystem and library suitability;
- integration with managed technologies such as Nuxt, Vue, JavaScript, and TypeScript;
- IDE, editor, CI/CD, AI-agent, and external-tool integration;
- testing and observability;
- dependency and build-system complexity;
- maintainability and evolvability;
- contributor and tooling accessibility;
- migration cost and compatibility with existing work;
- reversibility and lock-in;
- long-term project risk.

Existing implementation is evidence and migration context, not automatic authority for retaining the current technology.

## 6. Investigation and Architecture Reviews

An investigation or architecture review explores the problem before the project commits to a decision.

Such a review may contain:

- problem definition;
- requirements and constraints;
- candidate approaches;
- evaluation criteria;
- comparative analysis;
- prototypes or experiments;
- benchmarks where useful;
- risks and uncertainties;
- migration implications;
- recommendation.

Investigation and review documents are non-normative project-management artefacts unless deliberately incorporated into an authoritative specification. They should normally reside under `docs/project_management/` or another explicitly governed non-normative investigation location.

The ADR should summarise the evidence necessary to understand the decision and reference the review where deeper analysis is useful. It should not duplicate an entire research report.

## 7. ADR Identity and Location

Active ADRs reside under:

```text
docs/decisions/
```

ADR filenames use a stable sequential identifier and descriptive slug:

```text
adr-0001-primary-application-runtime.md
adr-0002-example-decision.md
```

ADR numbers are never reused, including after rejection or supersession.

The identifier is the durable identity of the decision record. Renaming an accepted ADR should be avoided unless necessary to correct a misleading title.

## 8. Required ADR Structure

Each ADR must contain at least:

```text
# ADR-NNNN: Decision Title

Status
Date
Decision owners or approval authority where useful
Related specifications
Supersedes / Superseded by where applicable

## Context
## Decision Drivers
## Considered Options
## Decision
## Consequences
## Specification Impact
## References
```

The record should be concise enough to remain useful while preserving enough context that a future maintainer can understand the decision without reconstructing it from Pull Requests or conversation history.

## 9. ADR Status Model

The principal ADR states are:

```text
Proposed
   |
   +------> Rejected
   |
   v
Accepted
   |
   +------> Deprecated
   |
   v
Superseded
```

### 9.1 Proposed

A Proposed ADR is under consideration and has no authority to redefine an approved specification.

### 9.2 Accepted

An Accepted ADR records an approved significant decision. Any normative consequences must be incorporated into the appropriate authoritative specification or specifications.

### 9.3 Rejected

A Rejected ADR records an option or proposed decision that was deliberately not adopted. It may be retained where the rationale has continuing value or helps prevent repeated investigation of the same unsuitable approach.

### 9.4 Deprecated

A Deprecated ADR records an accepted decision that remains relevant to current implementation or compatibility but is intentionally being phased out.

### 9.5 Superseded

A Superseded ADR remains part of the architectural history but no longer represents the current decision. It must identify the ADR that supersedes it.

## 10. Immutability and Supersession

Accepted ADRs are historical decision records and should not be rewritten to make an old decision appear as though the project always held a newer position.

After acceptance, edits should normally be limited to:

- correcting factual or typographical errors;
- improving references;
- adding explicit links to specifications or successor ADRs;
- recording status changes without altering the historical decision.

A material change to an accepted architectural decision requires a new ADR that supersedes or modifies the previous decision.

## 11. Approval and Specification Update

Acceptance of an ADR and incorporation of its consequences into authoritative specifications are related but distinct actions.

Before implementation proceeds on a significant architectural decision, the project should verify that:

1. the decision has been reviewed at an appropriate level;
2. the ADR status accurately records the decision;
3. affected Design, Functional, Detailed Design, or Implementation Specifications have been identified;
4. normative consequences have been incorporated into the highest appropriate specification level;
5. contradictions with existing specifications have been resolved deliberately;
6. implementation work is traceable to the resulting approved specification.

Where the ADR and specification cannot be updated atomically, the discrepancy must be explicit and short-lived. An ADR must not silently override a conflicting higher-authority specification.

## 12. Traceability

Where an ADR materially explains a specification decision, traceability should support movement in both directions:

```text
architecture review / evidence
            |
            v
           ADR
            |
            v
   Design Specification
            |
            v
 Functional Specification
            |
            v
Detailed Design Specification
            |
            v
Implementation Specification
            |
            v
           code
```

Not every stage is required for every decision.

Specifications should reference the relevant ADR where the rationale would otherwise be difficult to discover. ADRs must identify the specifications materially affected by the decision.

Traceability should preserve engineering value without becoming administrative overhead.

## 13. Repository and AI-Assisted Decision Making

Issues, Projects, Discussions, Pull Requests, commit messages, AI conversations, code-assistant output, experiments, and external research may contribute evidence, alternatives, review, and provenance.

They must not become the sole durable source of an accepted architectural decision.

AI systems may assist with investigation, comparison, drafting, challenge, and synthesis, but an AI-generated recommendation is not an accepted project decision merely because it is detailed or plausible.

When AI-assisted work identifies a significant architectural question, it should preserve the distinction among:

- evidence;
- inference;
- proposal;
- recommendation;
- approved decision;
- normative specification consequence.

AI repository changes concerning ADRs must follow the branch-and-Pull-Request workflow established by `project-documentation-guide-v01.md`.

## 14. Archiving and Retention

Accepted, Rejected, Deprecated, and Superseded ADRs may retain durable historical value and should normally remain available as decision provenance.

Superseded or rejected ADRs must not be cited as current normative authority.

If ADRs are moved to an archive in future, the archive must preserve their identifiers, status, successor relationships, and traceability. The project must not delete decision history merely because a newer decision exists.

## 15. ADR Template

New ADRs should use `docs/decisions/adr-template.md` as the starting structure unless the decision requires justified additional sections.

The template is procedural scaffolding only. The accepted ADR content and its specification consequences determine the value of the record.

## 16. Initial Application

The proposed review of AppManager's primary technology architecture is the first intended use of this governance process.

The review should compare at least:

- retaining Node.js and TypeScript as the primary application technology;
- adopting Kotlin/JVM as the primary application technology;
- adopting a hybrid architecture in which Kotlin/JVM owns the primary application core while Node.js/TypeScript remains responsible for ecosystem-native capabilities where materially advantageous.

Other credible candidates may be included where investigation shows that they could materially outperform these options against AppManager's requirements.

No technology option is approved by this section. The architecture review must precede the first technology-selection ADR.