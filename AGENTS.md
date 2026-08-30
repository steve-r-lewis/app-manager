# AppManager — Repository Instructions for AI Agents

## Purpose

This file is the repository-level entry point for AI coding and documentation agents working on AppManager.

It provides operational instructions for working safely within the repository. It does not replace the AppManager specification hierarchy or create an alternative source of project requirements or design authority.

## Authoritative Documentation

Before making substantive changes, read and follow the documentation relevant to the task.

The highest documentation authority within the `docs/` tree is:

- `docs/project-documentation-guide-v01.md`

The canonical system-level Design Specification is:

- `docs/appmanager-design-specification-v01.md`

The normative specification hierarchy is:

```text
Design Specification
        |
        v
Functional Specification
        |
        v
Detailed Design Specification
        |
        v
Implementation Specification
```

Higher-level specifications govern lower-level specifications. Lower-level specifications may refine higher-level requirements but must not silently redefine them.

When implementation evidence conflicts with an approved higher-level specification, do not silently treat the implementation as the new design authority. Identify the discrepancy and revise the appropriate authoritative documentation deliberately if a design change is approved.

## Documentation Discipline

AI agents must:

- preserve zero information loss during documentation rationalisation, consolidation, archiving, and retirement;
- place information at the highest appropriate level of abstraction;
- consolidate duplication rather than create parallel specifications;
- preserve contradictions explicitly until they are deliberately resolved;
- distinguish intended design, approved requirements, proposals, current implementation, legacy behaviour, archived material, and retired material;
- use `AppManager` as the canonical application name in prose and conceptual documentation;
- follow the naming, versioning, lifecycle, archive, retirement, and traceability rules in `docs/project-documentation-guide-v01.md`;
- treat repository collaboration surfaces and AI conversation history as supporting context or provenance rather than substitutes for durable authoritative documentation.

Do not retire an archived document while it remains the sole source of project information that must be preserved.

## Repository and GitHub Workflow

The GitHub workflow defined by `docs/project-documentation-guide-v01.md`, particularly Section 19, is authoritative.

When permitted to modify the repository, an AI agent must by default:

1. establish the current integration branch, currently `master`, and its current head;
2. create or use a dedicated task branch from the appropriate current integration state, normally named `ai/<purpose>`;
3. make changes and commits only on that task branch;
4. keep the change set coherent and avoid unrelated edits or formatting churn;
5. validate the resulting diff and relevant tests or checks;
6. open a Pull Request against the appropriate integration branch when the work is ready for review;
7. describe the purpose, affected areas, material consequences, and validation in the Pull Request;
8. leave acceptance and merging to the user or an explicitly approved review or automation process;
9. never merge the agent's own Pull Request unless the user explicitly instructs it to do so;
10. never force-push, rewrite shared history, or directly modify `master` or another protected/integration branch unless the user explicitly authorises that specific operation.

General permission to work in the repository is not permission to commit directly to `master`.

### AI Commit Attribution

AI-assisted commits should preserve the authenticated human maintainer or contributor as the primary Git author unless the development platform provides and deliberately uses a recognised agent identity as the primary author.

When Codex or ChatGPT materially contributes to a commit and the committing environment permits control of the commit message, include the following trailer:

```text
Co-authored-by: Codex <noreply@openai.com>
```

Use `Codex` for OpenAI repository-development attribution rather than a ChatGPT product name or individual model name. Do not invent alternative OpenAI email addresses or GitHub identities.

The trailer records AI participation; it does not transfer project ownership, approval authority, or responsibility away from the human maintainer. Whether GitHub displays Codex as a separate contributor depends on GitHub's identity association and contribution-indexing behaviour and must not be assumed from the trailer alone.

If a repository integration creates commits through an API that fixes the authenticated user's author identity and does not expose commit-message or author controls sufficient to apply this policy, the agent must not falsify attribution metadata. It should preserve the platform-generated authorship and record the limitation where material.

## Working Method

Before creating, editing, moving, or deleting files:

- inspect the actual current repository state rather than relying on remembered paths or historical documentation;
- read the relevant authoritative specifications and existing implementation;
- identify the correct abstraction level and ownership of the proposed change;
- perform a read-only investigation first for changes that alter architecture, public contracts, subsystem responsibilities, or other non-trivial design decisions;
- stop and surface material scope or contract changes rather than silently widening the task.

Do not change code merely because it differs from a historical document. Determine which source has authority for the subject first.

Do not make opportunistic unrelated fixes during a focused task. Record or raise separate concerns where appropriate.

## Code Changes and Validation

AppManager is a Node/TypeScript project using `pnpm`.

For code changes:

- use `pnpm`, not npm or Yarn equivalents;
- run `pnpm build` after changes to code files and treat a non-zero exit as incomplete work;
- run the relevant scoped tests for the area being changed;
- do not claim a fix is complete based only on source inspection when executable validation is available;
- if existing behaviour is already correct, do not modify it unnecessarily merely to produce a code change.

Testing uses Vitest. Follow the existing test structure and naming conventions under `tests/unit/` when adding or modifying tests.

## Source File Headers

Existing AppManager source files use the project file-header and revision-history convention documented by the repository's established source examples and `CLAUDE.md`.

When creating or meaningfully modifying source files, preserve the established header structure and append revision-history information rather than deleting prior history.

Before copying paths, imports, or headers from another file, verify the actual current directory depth and repository location.

## Agent-Specific Supporting Files

Tool-specific repository instruction files may exist, including `CLAUDE.md`.

Such files may provide useful operational guidance for a particular AI system, but they must remain consistent with this file and with the authoritative project documentation.

Where instructions conflict:

1. explicit user instructions for the current task take precedence where they deliberately override the normal workflow;
2. `docs/project-documentation-guide-v01.md` governs AppManager documentation architecture and repository documentation policy;
3. the applicable authoritative AppManager specifications govern product requirements and design;
4. this `AGENTS.md` governs general repository-level AI working behaviour;
5. tool-specific supporting files such as `CLAUDE.md` provide additional compatible guidance.

An agent must surface a material conflict rather than silently choosing whichever instruction is most convenient.
