# Technical Specification Document

**Component:** Templates Layer — Corrections & Genuine Additions
**Files:** `~/app/templates/**`
**Project:** `app-manager`
**Language:** TypeScript (Node.js runtime)

*Phase 5 (Implementation Roadmap §7). This document opens with a correction to the roadmap's own premise for this phase, found only by reading the actual files rather than trusting their docstrings — worth reading in full before assuming Phase 5 is "template completions" in the sense originally planned.*

---

## 0. Major Correction: Most "Stub" Templates Are Not Stubs

The original architecture audit and the roadmap both classified eight template files as `TODO` stubs, based on their file-header docstring literally saying `@description: TODO: Create description here`. **Checking the actual exported function bodies of all eight shows this was the wrong signal to classify by** — the docstring being unfinished says nothing reliable about whether the function itself is implemented. Concretely:

| File | Docstring says | Actual implementation |
|---|---|---|
| `pnpmWorkspaceTemplate.ts` | `TODO` | **Complete** — returns a real, working `pnpm-workspace.yaml` body |
| `editorconfigTemplate.ts` | `TODO` | **Complete** — a real, standard `.editorconfig` |
| `npmrcTemplate.ts` | `TODO` | **Complete** — `shamefully-hoist=true` |
| `nuxtrcTemplate.ts` | `TODO` | **Complete** — `typescript.includeWorkspace = true` |
| `gitmodulesTemplate.ts` | `TODO` | **Complete, but with a real bug** — see §1 |
| `vitestConfigTemplate.ts` | `TODO` | **Complete**, aside from the already-known `app-monitor` path rename — see §2 |
| `vitestSetupTemplate.ts` | `TODO` | **Complete** — a genuinely sophisticated `@clack/prompts` mocking harness for the test suite |
| `envTemplate.ts` | `TODO` | **Complete, but with hardcoded personal identity** — see §3 |

**None of these eight files need "implementing."** Five of them (`pnpmWorkspace`, `editorconfig`, `npmrc`, `nuxtrc`, `vitestSetup`) need **no changes of any kind** — confirmed by reading their full output, not just their existence. This means Phase 5's actual scope is much smaller than planned: one real bug fix, one path rename, one identity-hardcoding fix (matching a pattern already fixed elsewhere), plus the two pieces of genuinely new work that were correctly identified as needed (`packageJsonTemplate`'s standalone mode, and the new `netlifyTomlTemplate.ts`).

**One thing that *is* confirmed, and matters:** none of these eight templates — complete or not — are called from anywhere in `app/commands/` or `app/services/` today. This is the third confirmed instance of the same pattern found earlier in this audit (the Strategies/`codeService` stack; the LLM and repository registries): real, working infrastructure built ahead of the commands meant to consume it. `app.setup` and `nuxt.createLayer` are what will finally call these, once built (Phase 6).

---

## 1. `gitmodulesTemplate.ts` — Real Bug: Dangerous Default Parameters

**Current signature:**
```ts
export function getGitmodulesTemplate(
	path: string = 'layers/themes',
	url: string = 'https://github.com/steve-r-lewis/nuxt4-holistic-therapy-clinic.git'
): string
```

**The bug:** calling this function with no arguments — which is exactly what would happen if a caller assumed "no submodules yet, generate an empty file" — silently produces a `.gitmodules` file registering a specific, real-looking private repository under a specific individual's account. This isn't a generic placeholder value (like `example.com` or `your-repo-here`); it's what appears to be an actual project URL, which is a materially worse default than "no default at all" — a caller relying on the default gets a *wrong, misleading* file rather than an obviously-empty one that would prompt them to check they'd passed the right arguments.

**Fix:** remove the defaults entirely, and change the function to accept a **list** of modules (matching `GitModulesContext`'s already-existing shape in `templateTypes.ts` — `{ modules: { name, path, url }[] }` — which this function's current single-module signature doesn't even match):

```ts
export function getGitmodulesTemplate(context: GitModulesContext): string {
	if (context.modules.length === 0) return ''; // genuinely empty — no submodules registered yet
	return context.modules
		.map(m => `[submodule "${m.path}"]\n\tpath = ${m.path}\n\turl = "${m.url}"\n`)
		.join('\n');
}
```

This also fixes a second, smaller issue: the current signature can only ever describe **one** submodule per call, but a real monorepo will have several — the existing `GitModulesContext` type already anticipated this with its `modules[]` array; the implementation just never matched it.

### 1.1 Test Scenarios

| ID | Scenario | Expected Outcome |
|---|---|---|
| GM-01 | Zero modules | Returns `''` — no file content implying a submodule exists when none does |
| GM-02 | One module | Output matches the single-entry format exactly (byte-for-byte with the current implementation's format, just parameterized) |
| GM-03 | Three modules | All three entries present, correctly separated |

---

## 2. `vitestConfigTemplate.ts` — Path Rename (Confirmed, Already Flagged)

Two literal `app-monitor` references need updating to `app-manager`, per the directory restructure (Implementation Roadmap §1.4):

```diff
- '**/app-monitor/test-logs/**',
+ '**/app-manager/test-logs/**',
```
```diff
- json: `./app-monitor/test-logs/test-report-${dateStr}.json`
+ json: `./app-manager/test-logs/test-report-${dateStr}.json`
```

No other change to this file — everything else in its `defineConfig` (pool strategy, coverage settings, timeouts) is unrelated to the restructure and stays exactly as-is.

---

## 3. `envTemplate.ts` — Hardcoded Personal Identity

**Current content** hardcodes, as literal `.env.example` values rather than placeholders:
```
AUTHOR_NAME="Steve R Lewis"
AUTHOR_EMAIL="me@steve-lewis.uk"
AUTHOR_URL="https://www.steve-lewis.uk"
REPO_URL="https://github.com/steve-r-lewis/nuxt4-monorepo-base-app.git"
BUGS_URL="https://github.com/steve-r-lewis/nuxt4-monorepo-base-app/issues"
```

This is the exact same pattern already fixed in the `githubService`/`headerTemplate` specs (Phase 2, §5) — a specific individual's identity hardcoded into general-purpose scaffolding. Since a real settings layer now exists (Phases 2–3), this is fixable properly rather than left as a known issue.

**Fix:** parameterize the function to accept resolved values, falling back to genuinely generic placeholders (not a real person's data) if none are supplied:

```ts
export interface EnvExampleContext {
	authorName?: string;
	authorEmail?: string;
	authorUrl?: string;
	repoUrl?: string;
	bugsUrl?: string;
}

export function getEnvExampleTemplate(ctx: EnvExampleContext = {}): string {
	return `...
AUTHOR_NAME="${ctx.authorName ?? 'Your Name'}"
AUTHOR_EMAIL="${ctx.authorEmail ?? 'you@example.com'}"
AUTHOR_URL="${ctx.authorUrl ?? ''}"

# Repository Defaults
REPO_URL="${ctx.repoUrl ?? ''}"
BUGS_URL="${ctx.bugsUrl ?? ''}"
...`;
}
```

The rest of the file — the AI provider key placeholders (`API_KEY_CLAUDE=NULL`, etc.) and `GITHUB_TOKEN`/`GITLAB_TOKEN` lines — needs **no change**; those are already generic placeholder patterns, not real credentials, and already correctly match the live `llmRegistry.json`/`repositoryRegistry.json` env var names.

**Call-site responsibility (not this file's job):** `app.setup`/`nuxt.createLayer` (Phase 6) resolve `author.name`/`author.email` via `resolveOrPrompt` (Phase 2) before calling this template — this file's only job is to accept whatever it's given and fall back to a generic placeholder, never to resolve anything itself. Consistent with every other template in this codebase being a pure function of its input.

### 3.1 Test Scenarios

| ID | Scenario | Expected Outcome |
|---|---|---|
| EV-01 | No context provided | Output contains `Your Name`/`you@example.com`, **not** any specific individual's real data |
| EV-02 | Full context provided | Output reflects the supplied values exactly |
| EV-03 | AI/GitHub/GitLab placeholder lines | Unchanged from current output in every scenario — this fix touches only the author/repo block |

---

## 4. `headerTemplate.ts` — Default Fallback Correction

**Current:** `author = 'Steve R Lewis'` as the function parameter's default value (confirmed from direct reading in an earlier phase of this project).

**Fix:** change the ultimate fallback (used only when no `author` is passed **and** the calling command's own `resolveOrPrompt`/settings resolution also came up empty — an edge case that shouldn't normally occur once Phase 6 wires callers up correctly, but should still degrade sensibly if it does) to a generic placeholder, not a specific person's name:

```ts
author = 'Unknown', // was: 'Steve R Lewis'
```

This mirrors the pattern the *root-mode* `packageJsonTemplate.ts` already gets right today (`ctx.author || "Unknown"`) — worth noting as an existing internal inconsistency within the templates layer itself: one template already does the correct generic-fallback thing, while this one and `envTemplate.ts` did not, for no apparent reason beyond having been written at different times.

**No other change to this file.** Its actual header-generation logic (date/time formatting, shebang detection) is unrelated and unaffected.

---

## 5. `packageJsonTemplate.ts` (Layer Mode) — Standalone Extension

**Status:** Genuinely new work — confirmed necessary by reading the current layer-mode output directly, which produces **empty** `scripts`, `dependencies`, and `devDependencies` objects "as they rely on the host application" (per the file's own comment). `nuxt.createLayer`'s standalone-runnable requirement (command specs §5.1) needs the opposite — a layer that can `pnpm install && pnpm dev` with nothing else present.

**Fix:** add an orthogonal `standalone?: boolean` flag to `PackageJsonContext` (not a third `target` value — a standalone layer is still shaped like a layer for naming/`exports` purposes, it just also needs to be independently runnable, which is a separate axis):

```ts
export interface PackageJsonContext extends TargetedTemplateContext {
	// ...existing fields unchanged...
	standalone?: boolean; // new — only meaningful when target === 'layer'
}
```

**Logic change**, layer branch only:
```ts
if (isRoot) { /* unchanged */ }

// Layer branch
const layerBase = {
	...base,
	main: "./nuxt.config.ts",
	exports: { ".": { "types": "./tsconfig.json", "import": "./nuxt.config.ts" } }
};

if (!ctx.standalone) {
	// Unchanged existing behavior — consumed by a host, empty scripts/deps
	return { ...layerBase, scripts: {}, dependencies: {}, devDependencies: {} };
}

// New — standalone: reuses the exact same dependency set the root-mode branch
// already hardcodes, since a standalone layer needs to run Nuxt independently,
// which is the same requirement the root config already has.
return {
	...layerBase,
	scripts: { "dev": "nuxt dev --force", "build": "nuxt build" },
	dependencies: { /* identical to the root branch's existing dependencies object */ },
	devDependencies: { /* identical to the root branch's existing devDependencies object */ }
};
```

**Deliberately reuses the root branch's already-hardcoded dependency versions** rather than maintaining a second, separately-versioned dependency list — if a version needs bumping later, there's still only one place in this file that says `"nuxt": "^4.2.2"`. (Worth extracting both into a shared local constant within this file during implementation, purely to avoid the two branches drifting apart — not a design decision this spec needs to mandate, just a note for whoever implements it.)

### 5.1 Test Scenarios

| ID | Scenario | Expected Outcome |
|---|---|---|
| PJ-01 | `target: 'layer'`, `standalone` omitted | **Unchanged** from current behavior — empty scripts/deps. Confirms this change is additive, not a behavior change to the existing, presumably-still-wanted "consumed by a host" mode. |
| PJ-02 | `target: 'layer'`, `standalone: true` | `scripts.dev`/`scripts.build` present; `dependencies`/`devDependencies` non-empty and identical in content to what the root branch would produce |
| PJ-03 | `target: 'root'`, `standalone` present (nonsensical combination) | `standalone` is silently ignored — root mode's behavior is completely unaffected by this field, since it's documented as "only meaningful when target === 'layer'" |

---

## 6. `netlifyTomlTemplate.ts` — New Template

**Status:** New, backing `nuxt.addFile` (command specs §5.2). First entry in the new `app/templates/deployment/` category.

```ts
export interface NetlifyTomlContext {
	buildCommand?: string;   // default: 'pnpm build'
	publishDirectory?: string; // default: '.output/public'
	nodeVersion?: string;    // default: '20'
}

export function getNetlifyTomlTemplate(ctx: NetlifyTomlContext = {}): string {
	return `[build]
  command = "${ctx.buildCommand ?? 'pnpm build'}"
  publish = "${ctx.publishDirectory ?? '.output/public'}"

[build.environment]
  NODE_VERSION = "${ctx.nodeVersion ?? '20'}"
`;
}
```

Follows the same "every field optional, generic sensible default, pure function of its input" shape as every other template in this codebase — deliberately minimal for a first entry in a new category rather than trying to anticipate every Netlify configuration option a real deployment might eventually need.

### 6.1 Test Scenarios

| ID | Scenario | Expected Outcome |
|---|---|---|
| NF-01 | No context | Output uses all three defaults |
| NF-02 | Full context override | Output reflects supplied values |

---

## 7. `.gitignore` Templates — Confirmed Change, Both Files

Checked both `frameworks/nuxt/project/gitignoreTemplate.ts` and `frameworks/nuxt/layer/gitignoreTemplate.ts` directly — **identical structure in both**, same line, same surrounding context (a "Package manager debug logs" block):

```
# Package manager debug logs
**/app-monitor
**/npm-debug.log*
```

**Fix, applied identically to both files** (per Implementation Roadmap §1.4 — restated here with the exact surrounding context now confirmed, since the roadmap described the change but hadn't shown precisely where it lands in the file):

```diff
# Package manager debug logs
- **/app-monitor
+ app-manager/logs/
+ app-manager/test-logs/
**/npm-debug.log*
```

Note the changed pattern shape, not just the renamed word: `**/app-monitor` (a wildcard-anywhere blanket match) becomes two **non-wildcarded, path-rooted** entries — this is the deliberate fix from the roadmap, not an incidental change. A blanket `**/app-manager` here would re-introduce the exact problem the restructure was meant to solve (hiding `app-manager/settings.json`'s committable `project-shared` section along with the logs it sits next to).

---

## Final Architectural Notes

- §0's correction is the single most important thing in this document. Treating a `TODO` docstring as equivalent to an unimplemented function was an assumption carried from the very first architecture audit through the roadmap and into this phase's initial scoping — it took actually opening eight files to find it was wrong for all but one and a half of them. Worth remembering for any future phase: **a stub classification based on file headers alone should be treated as a hypothesis to verify, not a fact to build a phase plan on.**
- The real Phase 5 scope, once corrected: one bug fix (§1), one path rename (§2), one identity-hardcoding fix matching an already-established pattern (§3), one small default-value correction (§4), one genuine extension (§5), one genuine new file (§6), and one two-file gitignore fix (§7) — considerably less work than "complete eight stub templates" implied, and worth updating the roadmap's own language to reflect that this phase was smaller than planned, not that it was skipped.
- Per the roadmap, **Phase 6 is next** — the Nuxt domain (`nuxt.createLayer`'s standalone project, `nuxt.addFile`, `nuxt.extractDocs`, `nuxt.manageEnv`, `app.setup`, `app.run`'s lifecycle extension) — now genuinely unblocked, since every template it depends on is either already working or specified above.
