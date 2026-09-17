# Version 1 AI Command Model Review

> **Document type:** Project-management working evidence
>
> **Status:** Active for final PBC-1 AI correction
>
> **Normative product effect:** None. Normative effect is carried by the level-appropriate AI project-environment clarifications and later primary owners through NCR.

## 1. Review Basis

The final human-readable command review identified that the four-command AI surface represented only AI instruction-document lifecycle management, while the original AppManager requirement is broader project-side configuration of AI development agents.

The corrected model was derived resource-first rather than by CRUD symmetry. Candidate operations were tested for distinct user intent, provider-neutral meaning, independent value and separation from implementation mechanics.

## 2. Semantic Resource Families

| Family | Meaning |
|---|---|
| Instructions | Persistent project/scope guidance; scoped rules are instructions unless separately demonstrated otherwise. |
| Prompts | Reusable user-invoked AI task/request resources; prompt execution does not transfer the resulting application intent to AI. |
| Agents | Named specialist AI worker/configuration definitions. |
| Skills | Reusable specialist knowledge/capability packages. |
| Tools | Provider-neutral external AI tool/data integrations; MCP is a representation/protocol. |
| Policy | AI-specific context inclusion/exclusion, tool, execution/access and related restrictions. |
| Environment/provider representations | Concrete provider/tool project resources implementing the semantic model; not a separate CRUD family. |

Templates remain instantiation mechanisms unless independently meaningful resource semantics are demonstrated. Actual secrets/environment values remain Settings-owned.

## 3. Final Command Review

| Command | Human intent | Disposition |
|---|---|---|
| `ai.inspect` | inspect the recognised project-side AI development environment across resource families | ADD |
| `ai.instruction.list` | list recognised instruction resources and scope/representation | RETAIN |
| `ai.instruction.create` | create a supported instruction resource | RETAIN |
| `ai.instruction.update` | semantically update an existing instruction resource | REPLACE IDENTITY (`ai.instruction.replace`) |
| `ai.instruction.delete` | delete an explicitly selected instruction resource | RETAIN |
| `ai.prompt.list` | list reusable project prompt resources | ADD |
| `ai.prompt.create` | create a reusable prompt resource | ADD |
| `ai.prompt.update` | update an existing prompt resource | ADD |
| `ai.prompt.delete` | delete an explicitly selected prompt resource | ADD |
| `ai.agent.list` | list project specialist agent definitions | ADD |
| `ai.agent.create` | create a supported agent definition | ADD |
| `ai.agent.update` | update an existing agent definition | ADD |
| `ai.agent.delete` | delete an explicitly selected agent definition | ADD |
| `ai.skill.list` | list project skills available to supported AI environments | ADD |
| `ai.skill.add` | add/install a supported project skill | ADD |
| `ai.skill.remove` | remove an explicitly selected project skill | ADD |
| `ai.tool.list` | list configured/recognised project AI tool integrations | ADD |
| `ai.tool.add` | add/configure a supported tool integration | ADD |
| `ai.tool.update` | update non-secret configuration of an existing integration | ADD |
| `ai.tool.remove` | remove an explicitly selected tool integration | ADD |
| `ai.policy.inspect` | inspect recognised AI-specific context/tool/execution/access policy | ADD |
| `ai.policy.configure` | configure supported AI policy semantically across representations | ADD |

No `ai.prompt.run`, generic `ai.run`, `ai.mcp.*`, `ai.rule.*`, `ai.template.*`, provider CRUD or generic autonomous-agent execution command is established.

## 4. Automatic Acceptance Finding

The earlier phrase “AI-generated content remains proposed until accepted” is refined as follows:

> AI-generated output is non-authoritative proposal data. Acceptance may be human-reviewed or automatic, but automatic acceptance must be performed by the owning AppManager use case under policy resolved before generation and deterministic owning-domain validation. The provider/result cannot accept itself, expand scope or create application authority.

This supports authorised bulk/headless operations. A Git-owned bulk commit may generate per-repository commit-message proposals through the shared AI Capability and automatically accept valid messages under Git policy without per-message human confirmation. Git remains the owner of commit intent and acceptance.

## 5. Quantified Result

The AI domain changes from 4 to 22 canonical identities. Three old instruction identities are retained, `ai.instruction.replace` is replaced by `ai.instruction.update`, and 18 additional identities are added. Net command growth is +18.

With other domains unchanged:

| Domain | Commands |
|---|---:|
| App | 8 |
| Git | 8 |
| Nuxt | 13 |
| Docs | 13 |
| Quality | 10 |
| Settings | 18 |
| AI | 22 |
| Maintenance | 4 |
| **Total** | **96** |

## 6. Conclusion

The 22-command AI surface is the result of restoring the broader project-side AI development-environment requirement. The shared AI Capability remains separate and may be consumed by any owning domain. The final Version 1 command catalogue is therefore 96 commands, subject to merge verification and subsequent NCR consolidation.