# AI Functional Ownership Clarification

> **Status:** Active Functional clarification
>
> **Clarifies:** AI Functional Specification, DD-2.7 AI Capability, DD-4.3 AI Domain
>
> **Normative scope:** Functional ownership and refinement relationship only

## 1. Purpose

This clarification removes an ownership ambiguity created by both DD-2.7 and DD-4.3 treating the AI Functional Specification as a primary authority while serving different architectural roles.

## 2. Functional Ownership

The AI Functional Specification is the primary observable-behaviour authority for the **AI functional domain**. DD-4.3 is the primary Detailed Design owner for AI-domain application intent, including supported AI instruction-document/resource use cases and AI-domain acceptance.

DD-2.7 is a **shared capability Detailed Design**. It refines the provider-independent AI execution, context, safety, normalization and provider-evidence semantics required to support the AI domain and any other owning domain that delegates bounded AI work. It does not acquire ownership of another domain's use case merely because that use case is constrained by `FR-AI-*` cross-cutting AI requirements.

## 3. Cross-Domain AI Use

When Git, Docs, Nuxt, Quality, Settings or another domain invokes DD-2.7:

- the consuming domain's Functional Specification remains the authority for primary application intent and domain acceptance;
- applicable `FR-AI-*` requirements constrain safe/observable AI use;
- DD-2.7 owns bounded AI capability semantics;
- DD-4.3 does not become the owner of the consuming domain's use case;
- DD-1 Application Engine retains final application authority.

## 4. Interpretation of Existing Documents

The DD-2.7 metadata phrase `Primary Functional authority: AI Functional Specification` shall be read as identifying the principal source of functional constraints on the shared AI capability, **not** as assigning the entire AI functional domain to DD-2.7.

DD-4.3's binding of `FR-AI-001`–`FR-AI-105` remains domain-level refinement. Where a requirement concerns provider-independent execution mechanics, DD-4.3 consumes DD-2.7 rather than duplicating or superseding its capability contract.

This clarification introduces no new AI feature, provider, model, mutation authority, autonomous action, or implementation topology.
