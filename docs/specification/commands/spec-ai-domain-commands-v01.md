# Technical Specification Document

**Component:** AI Domain — Three Commands
**Files:** `~/app/commands/ai/*.ts` (new directory), `~/app/templates/aiDocs/*.ts` (new template category)
**Project:** `app-manager`
**Language:** TypeScript (Node.js runtime)

*New domain — not present in the original nine-phase roadmap (`app-manager-command-specs-v02.md`). Modeled directly on the already-specced `nuxt.addFile` registry pattern (§5.2 of that document) and the license registry (`spec-templates-license-v01.md` §1) rather than inventing a third registry mechanism — "add/remove a known, named file from a small extensible catalog" is exactly the same shape of problem both of those already solved.*

---

## 1. Shared Context

### 1.1 Registry Pattern

```ts
export interface AiDocRegistryEntry {
	id: string;            // e.g. 'claude'
	filename: string;      // e.g. 'CLAUDE.md'
	label: string;         // e.g. 'Claude (Anthropic)'
	description: string;   // shown in list/select menus
	template: TemplateFunction<AiDocContext, string>;
}

export const aiDocRegistry: Record<string, AiDocRegistryEntry> = {
	claude: { id: 'claude', filename: 'CLAUDE.md', label: 'Claude (Anthropic)', description: 'Project notes for Claude Code', template: claudeDocTemplate },
	gemini: { id: 'gemini', filename: 'GEMINI.md', label: 'Gemini (Google)', description: 'Project notes for Gemini', template: geminiDocTemplate },
	agents: { id: 'agents', filename: 'AGENTS.md', label: 'Agents.md (generic)', description: 'Provider-agnostic agent instructions', template: agentsDocTemplate },
};
```

**Open question — initial registry set:** the three above cover the common cases at time of writing, same posture as the license registry's "proposed initial set of eight" — easy to extend later (one new file + one new registry entry), not a decision that needs to be exhaustive up front. Confirm before build whether `.cursorrules`/`.windsurfrules`-style tool-specific files belong in this registry too, or are out of scope for v1.

### 1.2 Template Content Is Plain Markdown — No Source-File Header Block

Every `.ts`/`.vue` source file in this codebase carries the `@project`/`@file`/`@version` header block (this project's own `CLAUDE.md` convention). AI docs are **not** source files and do not get that header — confirmed directly against this project's own `CLAUDE.md`, which has no such block. Each template function generates a plain Markdown doc (title, a short "What this is" section seeded from `package.json`'s `name`/`description` if present, empty section headers for the user to fill in) — not a call to `headerTemplate.ts`.

### 1.3 AI-Assisted Content Is Optional, Not Required

`llmService.isAvailable()` gates an *optional* enrichment step only (asking the LLM to draft a starting "What this is" paragraph from `package.json` + a directory scan) — never a hard dependency. Every template must produce a valid, useful skeleton with zero AI calls, consistent with the fallback-on-AI-failure posture used everywhere else in this app (`nuxt.createLayer`, `utils.autoVersion`, etc.).

---

## 2. `ai.list` — List AI Doc's

**File:** `app/commands/ai/listAiDocs.ts`

**Purpose:** Report which known AI-assistant doc types exist in the project root, and flag anything present that isn't in the registry.

**CLI Usage:** `am ai list`

**Behavior:**
1. For each `aiDocRegistry` entry, `fileService.exists(path.join(targetRoot, entry.filename))`.
2. Print a table: ✅ present / — not present, per entry.
3. Separately scan `targetRoot` for other `*.md` files at the root that look like AI-instruction docs by name convention (e.g. anything matching `/^[A-Z]+\.md$/` not already in the registry) and list them under "Unregistered docs found" — informational only, not an error.

**Consumes:** `fileService`.

**Side Effects:** None (read-only).

### Test Scenarios
| ID | Scenario | Expected Outcome |
|---|---|---|
| AL-01 | `CLAUDE.md` exists, others don't | Table shows CLAUDE.md ✅, others — |
| AL-02 | No AI docs at all | All entries show —, no unregistered docs section |
| AL-03 | A `NOTES.md` at root | Listed under "Unregistered docs found", registry table unaffected |

---

## 3. `ai.create` — Create New Project AI Doc

**File:** `app/commands/ai/createAiDoc.ts`

**Purpose:** Scaffold a new AI-assistant doc from the registry.

**CLI Usage:**
```
am ai create claude          # headless: create by registry id
am ai create                 # interactive: select from registry
```

**Options:**
| Flag | Meaning |
|---|---|
| `--force` | overwrite if the file already exists (default: refuse and warn — same collision posture as `nuxt.addFile`) |

**Behavior:**
1. Resolve `id` from the positional arg or an interactive `select()` over the registry.
2. Reject an unknown id headlessly, listing valid ids (mirrors `nuxt.addFile`'s behavior).
3. Check `targetRoot/<entry.filename>` existence; refuse unless `--force`.
4. If `llmService.isAvailable()`, offer (interactive) or default-on (headless) the AI-drafted opening section (§1.3); on failure or if declined, fall back to the plain skeleton.
5. Write via `fileService.write()`.
6. Log success and the path written.

**Consumes:** `aiDocRegistry`, `fileService`, `llmService` (optional).

**Side Effects:** Writes one new file at the project root.

**Error Handling:** Existing-file collision without `--force` → warn and abort, no overwrite. AI failure → silent fallback to skeleton, not a hard error.

### Test Scenarios
| ID | Scenario | Expected Outcome |
|---|---|---|
| AC-01 | Create `CLAUDE.md`, doesn't exist yet | File written with skeleton content |
| AC-02 | File already exists, no `--force` | Refused, nothing written |
| AC-03 | `--force` over an existing file | Overwritten |
| AC-04 | AI unavailable | Skeleton written with no AI call attempted |
| AC-05 | AI available but throws | Falls back to skeleton, same as AI unavailable — no crash |

---

## 4. `ai.delete` — Delete Project AI Doc

**File:** `app/commands/ai/deleteAiDoc.ts`

**Purpose:** Remove a selected AI doc.

**CLI Usage:**
```
am ai delete claude          # headless: delete by registry id
am ai delete                 # interactive: select from docs that currently exist
```

**Behavior:**
1. Build the candidate list from registry entries whose file **actually exists** (reuses `ai.list`'s existence check) — never offer to delete something not present.
2. If none exist, log info and exit — no menu shown.
3. Confirm (default `false`), then `fileService.delete()`.

**Consumes:** `fileService`.

**Side Effects:** Deletes one file.

**Error Handling:** Standard catch/log; a missing file at delete-time (race/already removed) is not an error — treat as already-done.

### Test Scenarios
| ID | Scenario | Expected Outcome |
|---|---|---|
| AD-01 | `CLAUDE.md` exists, selected and confirmed | Deleted |
| AD-02 | No AI docs exist at all | Logs info, no menu, no prompt |
| AD-03 | Confirmation declined | Not deleted |

---

## Final Architectural Notes

- This domain needed zero new service capability beyond a new template category (§1.1) — the same "thin command, registry does the work" shape as `nuxt.addFile`, confirming that pattern generalizes cleanly to a second, unrelated use case.
- The open question from §1.1 (initial registry set) is the only thing blocking this from being fully build-ready — small, easy to close in one conversation.
