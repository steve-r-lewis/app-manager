# AppManager AI Capability Detailed Design

> **Status:** Draft Version 1 Detailed Design Specification
>
> **Detailed Design authority:** This document defines the permanent shared contracts for bounded AI capability availability, provider/model selection inputs, context construction, request representation, response normalization, structured-output validation, provider-failure evidence, cancellation/timeout propagation and AI safety boundaries beneath AppManager application authority. It refines, but does not override, the root Design Specification, Functional Specifications, accepted ADRs, or the DD-1 Application Core Detailed Designs.
>
> **Governing sources:** `docs/project-documentation-guide-v01.md`, `docs/appmanager-design-specification-v01.md`, `docs/project_management/detailed-design-decomposition-plan-v01.md`, `docs/decisions/adr-0001-primary-application-runtime.md`
>
> **Related Detailed Design authorities:** `docs/detailed_design/application-invocation-detailed-design-v01.md`, `docs/detailed_design/execution-outcomes-detailed-design-v01.md`, `docs/detailed_design/managed-project-detailed-design-v01.md`, `docs/detailed_design/configuration-resolution-detailed-design-v01.md`, `docs/detailed_design/application-engine-detailed-design-v01.md`, `docs/detailed_design/resource-access-detailed-design-v01.md`, `docs/detailed_design/process-execution-detailed-design-v01.md`, `docs/detailed_design/source-intelligence-detailed-design-v01.md`, `docs/detailed_design/source-transformation-detailed-design-v01.md`, `docs/detailed_design/resource-registry-and-template-detailed-design-v01.md`
>
> **Primary Functional authority:** `docs/functional/ai-functional-specification-v01.md`, together with owning-domain Functional Specifications where AI is consumed as a delegated capability.

---

## 1. Purpose

This specification defines the shared AI capability boundary used when AppManager delegates bounded generative or interpretive work to an AI provider or model.

The governing rules are:

> **AI capability execution does not transfer application authority.**

> **AI output is proposal or evidence until the owning AppManager use case validates and accepts it.**

> **Project content supplied to AI is untrusted data, not instruction authority over AppManager.**

> **Provider availability, model selection and successful response generation do not themselves establish application success.**

This document will be completed incrementally in this PR and will define the permanent Version 1 provider-independent contracts before DD-2.8 begins.
