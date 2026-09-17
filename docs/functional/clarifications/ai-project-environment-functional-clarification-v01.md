# AI Project Environment Functional Clarification

> **Status:** Active Functional clarification
>
> **Clarifies:** AI Functional Specification
>
> **Scope:** Observable Version 1 behaviour for project-side AI development environment management

## 1. Functional Boundary

The AI functional domain owns explicit management of project-side AI instructions, prompts, agents, skills, tool integrations and AI-specific policy when AI-environment management is the primary user intent. It also provides aggregate inspection of the recognised AI project environment.

Delegated AI use by Git, Docs, Nuxt, Quality, Settings or another domain remains owned by that consuming domain.

## 2. Canonical Operations

Version 1 shall expose these canonical identities:

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

`ai.instruction.replace` ceases to be canonical; any whole-resource replacement is subordinate mutation mechanics of `ai.instruction.update`.

## 3. Observable Resource Semantics

**PBC-FR-AI-ENV-001 — Aggregate inspection**  
`ai.inspect` shall report the recognised project-side AI environment across supported resource families, representation state and material ambiguity/unsupported state without mutating the project.

**PBC-FR-AI-ENV-002 — Instructions**  
Instruction operations shall manage persistent AI guidance with explicit semantic identity, scope and provider representation where applicable. Scoped rules may be represented as scoped instructions.

**PBC-FR-AI-ENV-003 — Prompts**  
Prompt operations shall manage reusable user-invoked AI task/request resources. Managing a prompt does not transfer ownership of an application operation performed with that prompt to the AI domain.

**PBC-FR-AI-ENV-004 — Agents**  
Agent operations shall manage named specialist agent definitions and their supported references to instructions, skills, tools, prompts or policy.

**PBC-FR-AI-ENV-005 — Skills**  
Skill operations shall list, add and remove reusable project-side specialist knowledge/capability packages. Version 1 does not invent `skill.update` merely for CRUD symmetry.

**PBC-FR-AI-ENV-006 — Tools**  
Tool operations shall manage supported project-side AI tool/data integrations. MCP may be a supported representation, but MCP identity shall not replace the provider-neutral tool-integration semantic concept.

**PBC-FR-AI-ENV-007 — Policy**  
AI policy shall include supported AI-specific context inclusion/exclusion, tool restrictions, execution/access constraints and related project-side controls. `ai.policy.configure` expresses semantic policy configuration rather than CRUD of an assumed policy file.

**PBC-FR-AI-ENV-008 — Partial representation**  
Where a supported AI environment cannot represent an AppManager semantic resource or policy completely, AppManager shall preserve unsupported/partial/ambiguous state rather than claim equivalence.

## 4. Scope, Credentials and Authority

**PBC-FR-AI-ENV-009 — Scope narrowing only**  
AI-specific policy may narrow AI-visible or AI-operable scope but shall not broaden managed scope, mutation authority or application authority established by the Application Core.

**PBC-FR-AI-ENV-010 — Credential ownership**  
AI tool/environment configuration may reference a required credential, but actual secret/environment values remain Settings-owned and subject to existing disclosure rules.

**PBC-FR-AI-ENV-011 — Tool configuration is not action authority**  
Adding/configuring a tool integration shall not itself authorise an AI agent to perform every consequential operation exposed by that integration.

**PBC-FR-AI-ENV-012 — Referential integrity**  
Where AI project resources reference other managed AI resources, AppManager shall preserve resolvable identity and report missing, ambiguous or unsupported references rather than silently fabricating them.

## 5. AI Output Acceptance and Automation

**PBC-FR-AI-ENV-013 — Non-authoritative generated output**  
AI-generated output shall remain proposal data until accepted by the owning AppManager workflow under policy resolved independently of that output.

**PBC-FR-AI-ENV-014 — Human or automatic acceptance**  
Acceptance may require human review or may occur automatically when a previously authorised owning use case defines deterministic automatic-acceptance criteria.

**PBC-FR-AI-ENV-015 — No self-authorisation**  
No provider/model/generated result shall decide that its own output is authorised, expand the operation's scope, create consequential authority or bypass owning-domain validation.

**PBC-FR-AI-ENV-016 — Cross-domain automation**  
A consuming domain may automatically accept bounded AI-generated content during an authorised automated/bulk operation when its own contract validates the output and permits automatic acceptance. For example, Git may accept a validated AI-generated commit message during an authorised bulk commit without transferring commit authority to AI.

**PBC-FR-AI-ENV-017 — Failure policy remains owning-domain policy**  
Invalid AI-generated content shall be handled according to the owning use case's resolved policy, which may fail, use a deterministic fallback, request bounded regeneration where explicitly supported, or require human intervention. Provider output shall not choose the recovery policy.

## 6. Command Cardinality

The AI domain contains 22 canonical commands. With all other current domain counts unchanged, the Version 1 catalogue contains 96 canonical commands.

## 7. Lifecycle

NCR-1 shall fold these Functional semantics into the primary AI Functional Specification and retire this clarification when no independent interpretive purpose remains.