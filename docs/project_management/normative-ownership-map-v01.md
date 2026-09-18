# AppManager Normative Ownership Map

> **Document type:** Project-management normative-ownership index
>
> **Version:** 01
>
> **Status:** Active — canonical Design/Functional ownership index
>
> **Normative product effect:** None. This map identifies existing canonical owners; it does not create product semantics.

## 1. Purpose

This map identifies the canonical Design/Functional owner for recurrent Version 1 invariants so downstream DR packages can replace duplicate prose with precise references without changing meaning.

The governing rule is:

> **A recurrent proposition is rationalised by reference to its actual normative owner, not by promoting the most repeated wording into a new authority.**

Where a cluster contains both an architectural invariant and an observable Functional consequence, the Design Specification owns the architectural invariant and the named Functional Specification owns the testable Functional refinement.

## 2. Ownership Map

| Cluster | Canonical Design owner | Canonical Functional owner/refinement | Downstream local delta that must remain |
|---|---|---|---|
| Delegated execution vs application authority | Design §§6.6, 11.1–11.3 | Application Invocation FR-INV-001–002 | capability/domain-specific mechanics, evidence and interpretation |
| Recognition/reachability vs mutation/operation authority | Design §§9.6–9.7, 11.3 | Managed Project FR-PROJ-037–049, especially FR-PROJ-043–048 | command-specific eligibility, authorisation and exclusions |
| Technical/provider success vs application success | Design §§7.7, 11.1–11.3 | Application Invocation FR-INV-001–002 plus owning domain result requirements | domain interpretation and operation-specific acceptance |
| Evidence vs interpretation | Design §§7.2, 9.6, 11.1–11.3 | Managed Project FR-PROJ-002 and Application Invocation FR-INV-002 | evidence schema/classification and owning-domain interpretation |
| Generation vs transformation | Design §§6.8, 7.1, 7.9–7.10 | Source Transformation FR-XFORM-044–045 and related transformation requirements | domain-specific generated artefact set, collision/update policy and validation |
| AI output vs application authority | Design §10.6 and §§11.1–11.3 | AI FR-AI-002–005; Source Transformation FR-XFORM-059 where source changes are proposed | consuming-domain acceptance, disclosure/context and output contract |
| Managed scope vs filesystem/repository reachability | Design §§9.4–9.7 | Managed Project FR-PROJ-037–049, 059–060 | command-specific scope forms and consequential target rules |
| Settings persistence vs effective-configuration precedence | Design §§8.1–8.4, 10.10 | Configuration FR-CONFIG-001–008; Settings FR-SET-001–005 | setting/resource CRUD semantics and concern-specific precedence rules |
| Domain intent/policy/orchestration vs capability mechanics | Design §§6.5–6.6, 10.11, 11.1 | Application Invocation FR-INV-001–002 plus each domain Functional Specification's owned/non-owned behaviour | domain-specific policy/orchestration and capability-specific bounded mechanics |

## 3. Cluster Bindings

### 3.1 Delegated execution and application authority

The Design Specification establishes that capability providers own bounded specialist mechanics while AppManager retains application policy and outcome authority. Application Invocation makes this observable across every invocation path through FR-INV-001 and FR-INV-002.

Downstream documents therefore need only state the local delegated responsibility, the evidence returned, and the owning domain/use-case interpretation. They should not recreate a general Application Engine authority essay.

### 3.2 Recognition, reachability and mutation authority

Managed Project is the primary Functional owner of target identity, managed scope, targetability, ownership-sensitive behaviour and unmanaged-resource protection. Recognition, directory containment, repository association, host selection or technical access are evidence/conditions; they are not permission to mutate.

A downstream capability may still define technical containment or preconditions for its own operation, and a domain must still define command-specific target eligibility. Neither duplicates the general managed-scope rule.

### 3.3 Technical success, evidence and application success

The Design Specification distinguishes specialist validation/execution from application-level acceptance. Application Invocation owns the common application-authority consequence. Provider/capability completion is therefore evidence, not an alternate final-success taxonomy.

Owning domains retain the unique rule that interprets evidence for their use case. DD-1/Level 4 may refine canonical outcome structures without moving this general authority to providers.

### 3.4 Generation and transformation

Design distinguishes creation of new artefacts from modification of existing source. Source Transformation FR-XFORM-044–045 is the canonical Functional expression of that cross-domain distinction.

Domain Functional Specifications may retain unique generation requirements and explicit collision/update consequences, but should reference Source Transformation rather than restate the generic rule that an existing artefact requiring semantic modification enters governed transformation semantics.

### 3.5 AI output and authority

The Design AI boundary states that external model output does not become project, configuration, source or application authority merely because it participates in a command. AI FR-AI-002–005 provides the general Functional binding; FR-XFORM-059 provides the source-change specialization.

A consuming domain retains its own intent and acceptance. AI-specific context, disclosure, provider availability and output constraints remain valid local AI semantics rather than generic Application Engine restatement.

### 3.6 Settings persistence and effective configuration

Design §8 owns the architectural distinction between configuration sources/candidates, deterministic resolution and effective configuration. Configuration Functional owns candidate applicability, validation, precedence and effective-value semantics. Settings Functional owns user/automation-facing persistence and resource-management intent and explicitly disclaims precedence authority.

A durable Settings write therefore changes persisted state; whether and when that value becomes effective is governed by Configuration and the consuming workflow.

### 3.7 Domain intent and capability mechanics

Design distinguishes cohesive domain responsibilities from specialised capability/provider mechanics. Application Invocation preserves one application authority. Each domain Functional Specification owns its primary observable intent; shared capability mechanics do not acquire that intent by delegation.

Downstream domain DDs retain policy, orchestration and evidence interpretation specific to the domain. Capability DDs retain bounded specialist contracts. Neither should duplicate the other's semantic contract.

## 4. Use by Later DR Packages

DR-4 through DR-7 shall use this map as an editorial/traceability index only. Before replacing text with a reference, the package must verify that the cited canonical owner actually contains every meaningful proposition being removed.

If a downstream statement contains a unique exception, safety condition, pre/postcondition, failure semantic, provider constraint, state transition, command-specific acceptance rule or other local delta, that delta remains local.

If later review proves that this map assigns an owner incorrectly, the owning normative specification—not this project-management map—must be corrected first.

## 5. Non-Goals

This map does not create a generic invariant framework, new specification level, new runtime component, new authority layer, or substitute for the normative documents it indexes.