# AppManager Version 1 AI Project Environment Clarification

> **Status:** Active Design clarification
>
> **Scope:** PBC-1 correction of the Version 1 AI-domain product boundary before NCR
>
> **Lifecycle:** Temporary integration vehicle; NCR-1 shall fold this Design delta into the canonical Design owner and retire this clarification.

## 1. Purpose

The original Version 1 requirement is broader than AI instruction-document lifecycle management. AppManager shall manage the **project-side AI development environment** while preserving the separate shared AI Capability used internally by AppManager domains.

The governing distinction is:

> **The AI Domain manages project-side resources that configure, instruct, extend or constrain supported AI development agents and AI-assisted development environments. The AI Capability performs bounded AI inference/generation for any owning AppManager domain.**

Use of the AI Capability does not transfer primary application intent to the AI Domain.

## 2. AI Project Environment

The Version 1 semantic model includes these project-side concerns:

- **Instructions** — persistent project/scope guidance for AI development agents;
- **Prompts** — reusable user-invoked AI task/request resources;
- **Agents** — named specialist AI worker/configuration definitions;
- **Skills** — reusable specialist knowledge/capability packages;
- **Tools** — project-side external AI tool/data integrations, with MCP treated as a supported representation/protocol rather than the application semantic identity;
- **Policy** — AI-specific restrictions governing context visibility, tool use, execution/access and related constraints;
- **Environment/provider representations** — provider/tool-specific project resources used to realise the preceding AppManager concepts.

Rules/scoped guidance are modelled as scoped instructions unless a future approved requirement demonstrates a semantically distinct resource class. Prompt templates are mechanisms for instantiating prompt or other AI resources unless a separately meaningful template resource is demonstrated.

## 3. Provider-Neutral Resource Graph

AI project resources may reference one another. An agent may reference instructions, skills, tools and policy; a prompt may target an agent; tool configuration may reference Settings-owned credentials. AppManager shall preserve referential integrity and unsupported/partial provider representation rather than claiming false equivalence between AI environments.

Concrete files, directories, provider schemas and protocols are representations of AppManager semantic resources, not the semantic contract itself.

## 4. Authority and Security Boundaries

AI policy may narrow AI-visible or AI-operable scope but shall never broaden DD-1 managed scope, mutation authority or application authority.

The AI Domain may own a credential requirement/reference for an AI tool integration, but Settings retains ownership of the actual secret/environment value and applicable disclosure semantics.

Configuring an AI tool integration does not by itself authorise an agent to exercise every consequential capability exposed by that tool.

## 5. Generated Output and Automatic Acceptance

AI-generated output is non-authoritative proposal data. It may become accepted application input only through the owning AppManager use case under policy resolved before the generated result exists.

Acceptance may be:

- human-reviewed where the invocation/policy requires review; or
- automatic where the authorised owning use case defines deterministic acceptance criteria suitable for automation or Headless execution.

An AI provider or generated result shall never accept or authorise itself, expand scope, create application authority, or bypass owning-domain validation and final Application Engine acceptance.

For example, a user-authorised bulk Git commit may permit the Git Domain to request commit-message proposals from the AI Capability, validate them against Git-owned constraints and automatically accept valid messages without per-message human confirmation. Git remains the owning domain and commit authority.

## 6. Canonical AI Command Surface

The corrected Version 1 AI command candidates accepted by this clarification are:

```text
ai.inspect

ai.instruction.list
ai.instruction.create
ai.instruction.update
ai.instruction.delete

ai.prompt.list
ai.prompt.create
ai.prompt.update
ai.prompt.delete

ai.agent.list
ai.agent.create
ai.agent.update
ai.agent.delete

ai.skill.list
ai.skill.add
ai.skill.remove

ai.tool.list
ai.tool.add
ai.tool.update
ai.tool.remove

ai.policy.inspect
ai.policy.configure
```

This is **22 canonical AI commands**. `ai.instruction.update` replaces `ai.instruction.replace`; update is the user intent while physical replacement may be an implementation effect.

`ai.inspect` provides aggregate inspection of the project's recognised AI development environment. Family-specific `list` commands remain independently useful for deterministic automation and targeted interaction.

No `ai.prompt.run` command is established: using a prompt to perform Docs, Git, Nuxt, Quality or another domain operation does not transfer that primary intent to AI. No generic AI action/execution command is created.

## 7. Catalogue Impact

The AI domain changes from 4 to 22 canonical commands: **+18**. The Version 1 catalogue therefore changes from 78 to **96 canonical commands**, assuming all other domain counts remain unchanged.

This cardinality is an output of the restored product semantics, not a target.

## 8. NCR Integration

NCR-1 shall integrate the Design/Functional portions of this correction into their primary owners. NCR-2 shall integrate the DD-4.3 delta, and NCR-3 shall integrate the IS-20 delta. Temporary clarifications shall then be retired according to the existing clarification lifecycle rule.