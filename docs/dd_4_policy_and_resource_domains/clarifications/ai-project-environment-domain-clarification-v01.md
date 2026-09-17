# DD-4.3 AI Project Environment Domain Clarification

> **Status:** Active Detailed Design clarification
>
> **Clarifies:** `../dd-4-3-ai-domain-detailed-design-v01.md`
>
> **Scope:** PBC-1 expansion from instruction-document management to project-side AI development environment management

## 1. Corrected Domain Model

DD-4.3 shall own domain orchestration, policy, semantic identity and acceptance for AI project resources whose primary intent is project-side AI development-environment management.

The domain resource graph includes:

- `InstructionResource` — persistent/scoped guidance;
- `PromptResource` — reusable user-invoked request definitions;
- `AgentDefinition` — specialist agent definitions;
- `SkillDefinition` — reusable specialist knowledge/capability packages;
- `ToolIntegration` — provider-neutral external tool/data integrations;
- `AiPolicy` — context, tool, execution/access and related AI-specific restrictions;
- provider/environment representation mappings for those semantic resources.

Rules are scoped instructions unless separately demonstrated otherwise. MCP is a tool-integration representation/protocol, not the domain semantic identity. Templates remain declarative instantiation mechanisms unless independently meaningful resource semantics are established.

## 2. Resource Graph and Representation

AI resources may reference other AI resources. DD-4.3 owns semantic validation of those references and shall preserve missing, ambiguous, unsupported and partially representable states.

Provider-specific files/directories/configuration schemas are representation evidence. Similar shape or naming does not establish semantic equivalence across providers.

## 3. Authority Composition

Existing authority boundaries remain:

- DD-1.3 owns managed scope;
- DD-1.4 owns effective configuration;
- DD-1.5 owns final application acceptance;
- DD-2.1 owns bounded resource mechanics;
- DD-2.4 owns bounded source recognition evidence;
- DD-2.5 owns existing-resource semantic transformation mechanics;
- DD-2.6 owns declarative registry/template mechanics;
- DD-2.7 owns provider-independent AI execution;
- DD-4.2 Settings owns actual secret/environment values.

DD-4.3 AI policy may narrow AI-visible/operable scope but cannot broaden DD-1 authority. Tool configuration may reference Settings-owned credentials but cannot acquire or disclose those credentials merely from the reference.

## 4. Acceptance Model

AI provider output is always non-authoritative proposal evidence at the DD-2.7 boundary. The owning domain converts proposal evidence into accepted domain input only under policy resolved before the result exists.

Two acceptance paths are permitted:

```text
proposal -> owning-domain validation -> human review -> domain acceptance
proposal -> owning-domain validation -> pre-authorised automatic policy -> domain acceptance
```

Automatic acceptance does not transfer authority to DD-2.7. The provider/result cannot select acceptance mode, broaden scope or authorise consequential work.

A cross-domain example is a Git-owned bulk commit: DD-3.2 may request bounded commit-message proposals from DD-2.7, validate them under Git policy and automatically accept valid messages where the invocation has already authorised that mode. Git retains commit intent and acceptance; DD-1.5 retains final application authority.

## 5. Canonical Operation Families

DD-4.3 shall refine these 22 identities:

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

`ai.instruction.update` owns semantic update intent; DD-2.5 may realise that update through targeted transformation or whole-resource replacement according to its plan. No `ai.prompt.run` or generic AI execution command is introduced.

## 6. Result/State Requirements

Domain results may carry semantic resource identity, resolved representation, scope/applicability, references, provider/tool association, presence, support/partial-representation state, revision evidence, policy state, proposed/accepted content provenance, effect evidence and recovery guidance beneath DD-1.2 outcomes.

Provider completion, successful template rendering, source recognition or tool configuration alone shall not establish AI-domain/application success.

## 7. Lifecycle

NCR-2 shall fold this clarification into DD-4.3 after NCR-1 has integrated the governing Design/Functional correction.