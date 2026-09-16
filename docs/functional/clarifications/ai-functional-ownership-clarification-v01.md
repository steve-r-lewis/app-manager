# AI Functional Ownership Clarification

> **Status:** Active Functional clarification
>
> **Clarifies:** AI Functional Specification
>
> **Related downstream refinements:** DD-2.7 AI Capability; DD-4.3 AI Domain
>
> **Normative scope:** Functional ownership of observable AI behaviour and cross-domain AI use only

## 1. Purpose

This clarification states the Functional-level ownership of observable AI behaviour without using a Functional document to interpret or govern Detailed Design documents.

The Functional hierarchy remains top-down: this clarification constrains downstream Detailed Design; it does not derive its meaning from DD-2.7 or DD-4.3 and does not assign authority between same-level Detailed Designs.

## 2. Functional Ownership

The AI Functional Specification is the primary observable-behaviour authority for the **AI functional domain**.

At Functional level:

- AI-domain use cases own AI-specific application intent and observable acceptance requirements;
- applicable `FR-AI-*` requirements govern safe and observable AI use wherever another functional domain delegates bounded AI work;
- use of AI by another functional domain does not transfer that domain's primary product intent or acceptance responsibility to the `ai` domain;
- provider completion or generated content does not by itself establish application success or authority;
- final application authority remains governed by the root Design and Application Invocation functional contract.

## 3. Cross-Domain AI Use

When Git, Docs, Nuxt, Quality, Settings or another functional domain uses AI assistance:

- the consuming domain's Functional Specification remains authoritative for its primary application intent and domain-specific acceptance requirements;
- applicable `FR-AI-*` requirements constrain disclosure, context, generated output and observable AI behaviour;
- AI-generated proposals remain non-authoritative until accepted through the owning functional workflow;
- AI use shall not silently broaden managed scope, mutation authority or consequential effects.

## 4. Downstream Refinement Boundary

Detailed Design may refine these Functional requirements into separate domain-orchestration and shared-capability contracts where the architecture requires that separation.

Any such Detailed Design decomposition must preserve the Functional ownership stated here. The allocation of responsibility between DD-2.7 and DD-4.3 is therefore a downstream Detailed Design concern and is not normatively established by this Functional clarification.

A separate Detailed Design clarification records the current DD-2.7/DD-4.3 refinement relationship so that same-level architectural allocation is governed at the correct level.

## 5. Non-Effect

This clarification introduces no new AI feature, provider, model, mutation authority, autonomous action, implementation topology or new functional command. It corrects authority direction only.