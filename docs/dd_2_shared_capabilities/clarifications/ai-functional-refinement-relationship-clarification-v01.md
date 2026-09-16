# AI Functional Refinement Relationship Clarification

> **Status:** Active Detailed Design clarification
>
> **Clarifies:** DD-2.7 — AI Capability; DD-4.3 — AI Domain
>
> **Upstream Functional authority:** AI Functional Specification and its active Functional ownership clarification
>
> **Normative scope:** Detailed Design allocation between AI-domain orchestration and the shared AI capability

## 1. Purpose

This clarification records the Detailed Design refinement relationship between DD-2.7 and DD-4.3 at the level where that architectural allocation belongs.

It does not amend the AI Functional Specification. Functional requirements govern this clarification and both Detailed Designs.

## 2. DD-4.3 Domain Responsibility

DD-4.3 is the Detailed Design owner for AI-domain application intent, including supported AI instruction-document/resource use cases, AI-domain policy/orchestration and AI-domain interpretation of subordinate evidence.

Where another domain uses AI assistance, DD-4.3 does not become the owner of that consuming domain's application intent merely because `FR-AI-*` constraints apply.

## 3. DD-2.7 Shared Capability Responsibility

DD-2.7 is the shared capability Detailed Design for provider-independent AI execution, context handling, disclosure/safety constraints, normalization and provider evidence.

DD-2.7 does not acquire ownership of an application use case merely because that use case delegates bounded AI work.

## 4. Refinement Relationship

The required relationship is:

```text
upstream Functional intent / observable requirements
        |
        v
owning domain Detailed Design intent / policy / acceptance
        |
        +--> DD-2.7 bounded AI capability work
        |        |
        |        v
        |   normalized AI evidence / proposal
        |
        v
owning domain interpretation
        |
        v
DD-1 Application Engine final acceptance
```

For the `ai` functional domain itself, DD-4.3 is the owning domain Detailed Design. For Git, Docs, Nuxt, Quality, Settings or another domain, that domain's Detailed Design remains the owning application-intent refinement and may delegate bounded AI work to DD-2.7.

## 5. Reading of Existing Metadata

The DD-2.7 metadata phrase `Primary Functional authority: AI Functional Specification` identifies its principal upstream Functional constraint source. It does not assign the whole AI functional domain to DD-2.7.

DD-4.3's binding to `FR-AI-*` is domain-level refinement. Provider-independent execution mechanics remain delegated to DD-2.7 rather than being duplicated in DD-4.3.

## 6. Authority Boundaries

This clarification introduces no new AI feature, provider, model, mutation authority, autonomous action or implementation topology. It preserves upstream Functional authority, domain intent ownership, shared-capability replaceability and DD-1 final application authority.