# AI Project Environment Implementation Clarification

> **Status:** Active Implementation clarification
>
> **Clarifies:** `../is-20-ai-domain-implementation-specification-v01.md`
>
> **Primary DD:** DD-4.3 AI Domain

## 1. Purpose

IS-20 shall implement the broader project-side AI development environment rather than only instruction-document lifecycle management. IS-10 remains the shared provider-independent AI execution capability and is not absorbed into IS-20.

## 2. Canonical IDs

IS-20 shall expose exactly these corrected Version 1 AI-domain identities:

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

`ai.instruction.replace` is no longer canonical. A compatibility alias, if migration requires one, may resolve to `ai.instruction.update` but shall not create a second descriptor, policy or outcome identity.

## 3. Implementation Contracts

IS-20 shall provide typed contracts/catalogues/policy/orchestration sufficient for:

- aggregate AI-environment inspection;
- semantic instruction identity and scope;
- prompt resources;
- agent definitions and references;
- skill definitions/packages;
- provider-neutral tool integrations and provider-specific representations such as MCP;
- AI policy including supported context inclusion/exclusion and tool/execution/access restrictions;
- representation support/partial-support state;
- referential-integrity diagnostics across AI resources.

Concrete provider configuration files remain adapters/representations beneath these contracts. No provider-specific file schema becomes the public domain model.

## 4. Capability and Resource Seams

IS-20 shall continue to compose IS-2 managed scope, IS-3 effective configuration, IS-4 resource effects, IS-7 recognition, IS-8 existing-resource transformation, IS-9 declarative registry/template resources and IS-10 AI execution.

Settings/IS-19 owns actual secret/environment values. IS-20 may retain credential-reference metadata but shall not duplicate secret storage or infer secret values.

## 5. Automatic Acceptance Contract

IS-10 output remains proposal evidence. An owning domain may convert proposal evidence to accepted domain input automatically only when:

1. the invocation/effective policy authorises automatic acceptance before generation;
2. the owning domain defines the bounded output contract and deterministic acceptance criteria;
3. validation succeeds;
4. the result cannot broaden target/scope/authority;
5. provenance records AI generation and the acceptance path where required; and
6. IS-1 retains final application acceptance.

IS-10/provider output shall not carry an authority flag that can self-authorise consequential work.

This contract applies equally when IS-15 Git, IS-17 Docs, IS-16 Nuxt, IS-18 Quality or another implementation consumes IS-10. For a Git bulk commit, IS-15 may validate and automatically accept bounded commit-message output under pre-authorised Git policy without per-message human interaction.

Invalid output handling belongs to the owning implementation and may include failure, deterministic fallback, explicitly bounded regeneration or escalation to required human review. IS-10 shall not choose that policy.

## 6. Interaction Equivalence

TUI, GUI and Headless adapters shall expose the same canonical AI operation identities. Interactive presentation may offer resource selection/review; Headless execution must resolve all required inputs and acceptance policy deterministically.

## 7. Non-Ownership

IS-20 does not become a generic AI action runner, autonomous coding-agent executor, arbitrary tool executor, provider SDK layer, secret manager, generic source editor or owner of Git/Docs/Nuxt/Quality intents merely because those domains consume IS-10.

No `ai.prompt.run` command is introduced.

## 8. Cardinality and Lifecycle

The AI domain changes from 4 to 22 canonical commands and the total Version 1 catalogue from 78 to 96 commands, with other domain counts unchanged.

A direct-edit work package shall fold this delta into IS-20 after the governing Design/Functional/DD corrections have been integrated.