# Technical Specification Document

**Component:** Settings Domain — Project Metadata, Environment, Contributors, Templates
**Files:** `~/app/commands/settings/*.ts` (new directory)
**Project:** `app-manager`
**Language:** TypeScript (Node.js runtime)

*New domain. Distinct from the already-built `app-config` domain (`app-manager-command-specs-v02.md` §10) — that domain persists **App Manager's own** tool/project preferences (commit identity, LLM provider, GitHub org) in `settings.json`. This domain edits **the target project's own `package.json`, `.env`, and template registries** directly. The two are easy to conflate by name; §1.1 addresses that explicitly.*

---

## 1. Shared Context

### 1.1 Naming Collision With `app-config` — Must Be Resolved Before Build

The already-shipped `app-config` domain persists `author.name`/`author.email` (§10.3/10.4 of the master spec) — used as git-commit identity and as the fallback author for generated file headers (JSDoc blocks, `nuxt.createLayer` scaffolding). This domain's **Application Defaults → Authors Name/Email** writes to a *completely different* value: `package.json`'s `author` field — the published project owner, shown on npm/GitHub, potentially a different person/entity than whoever is running the CLI (e.g. a company name).

These are genuinely different data with an unfortunate name collision. **Recommendation:** label the menu entries distinctly in the UI to avoid the user picking the wrong one by habit — e.g. `app-config`'s stays **"Author Name (commit identity)"**, this domain's is **"Project Author Name (package.json)"**. No schema/data change needed, just a labeling discipline decided once, here, rather than left to whoever builds the menu strings.

### 1.2 Application Defaults Is a Direct `package.json` Editor, Not a `configService` Extension

Per the decision already made: this reuses `fileService`'s JSONC-aware read/write — the same primitive `utils.addContributor` (already specced, `spec-utils-domain-commands-v02.md` §5) already uses for the same file. No new service method required; `configService`'s schema is not extended to cover project metadata.

```ts
const pkg = await fileService.read(path.join(targetRoot, 'package.json'));
pkg.description = newValue;
await fileService.write(path.join(targetRoot, 'package.json'), pkg);
```

Applies identically to every field in §2's table below.

### 1.3 `.env` Needs a New Small Capability: an Env-File Parser

None of the existing services parse `KEY=value` env-file format — `fileService`'s smart read is JSON/JSONC-only. This is a genuinely new, small piece of infrastructure, flagged the same way every other addendum in this project has been (`getFileDiff`, `spawnChecked`, etc.):

```ts
// New — either app/services/envFileService.ts, or a small addition to fileService (see open question below)
export interface EnvFileService {
	read(path: string): Promise<Record<string, string>>;   // parses KEY=value lines, ignores comments/blank lines
	write(path: string, vars: Record<string, string>): Promise<void>;  // preserves comment lines and ordering where practical
	setVar(path: string, key: string, value: string): Promise<void>;
	unsetVar(path: string, key: string): Promise<void>;
}
```

**Open question:** does this live as a new standalone `envFileService`, or as three or four new methods on the existing `fileService`? Given `fileService` is already the home for every other "structured text file" concern (JSON/JSONC), and `.env` is a comparably small structured-text format, **recommend adding it to `fileService`** rather than a new service — but flagging as a decision, not assuming.

### 1.4 Manage Contributors — List Is New, Add Already Exists

`utils.addContributor` (already fully specced) is the write side. This domain should not reimplement it — **Settings → Manage Contributors → Add Contributors is the same command, surfaced in a second menu location**, not a second implementation. Only **List Contributors** is genuinely new here, and it's a trivial read using the exact same `fileService.read()` call `addContributor` already makes.

### 1.5 Manage Templates — Three Separate Registries, Not One

By current design, license templates (`licenseRegistry`, `spec-templates-license-v01.md`), deployment/CI file templates (`nuxt.addFile`'s registry), and AI-doc templates (`spec-ai-domain-commands-v01.md` §1.1) are three independent registries, each scoped to its own domain. **Settings → Manage Templates → List Templates** is proposed as a read-only aggregate view across all three (a genuine "see everything registered" convenience) — but **Add Template / Delete Template must target one specific registry**, since there is no unified template shape across licenses/deployment-files/AI-docs (different context types, different write locations). The command needs a `--registry <license|deployment|ai-doc>` selector (or an interactive first-step picker) rather than a single undifferentiated "add a template" flow.

---

## 2. `settings.appDefaults` — Application Defaults (`package.json` Editor)

**File:** `app/commands/settings/appDefaults.ts`

**Purpose:** Read/write `package.json` metadata fields for the target project.

**CLI Usage:**
```
am settings app-defaults                    # interactive: grouped menu, same shape as app-config's
am settings app-defaults get <field>
am settings app-defaults set <field> <value>
```

**Field → `package.json` path mapping:**

| Menu item | `package.json` field |
|---|---|
| Authors Name / Email / URL | `author.name` / `author.email` / `author.url` |
| Authors Telephone | `author.phone` *(non-standard field — npm doesn't define this; confirm you actually want it written, since tooling that reads `author` may not expect it)* |
| Funding Type / URL | `funding.type` / `funding.url` |
| Bug Reporting | `bugs.url` |
| Repository Type / URL | `repository.type` / `repository.url` |
| Application Version | `version` — **overlaps with `utils.autoVersion`, which already bumps this from git diffs.** Recommend this stays a manual-override path (for hand-correcting after `autoVersion`, or setting the very first version), not the primary way version gets changed day to day. |
| Application Description | `description` |
| Application Privacy Type | `private` (boolean) |
| Application Type | `type` (`module` / `commonjs`) |
| Keyword List | `keywords` (array — add/remove, not free-text replace, to avoid accidental full-list overwrites) |

**License Type** is deliberately **not** in this table — it's covered by `settings.templates` (§5) since setting a license also generates/overwrites the `LICENSE` file, not just a `package.json` field.

**Behavior:** Grouped interactive menu (mirrors `app-config`'s grouped-by-category shape) or direct `get`/`set` per field. Each `set` is a single-field `fileService.read()` → mutate → `fileService.write()` round trip (§1.2) — no batch-write across multiple fields in one call, to keep failure isolated to the one field being changed.

**Consumes:** `fileService`.

### Test Scenarios
| ID | Scenario | Expected Outcome |
|---|---|---|
| SD-01 | Set `description`, headless | `package.json`'s `description` updated, everything else in the file untouched |
| SD-02 | Set `keywords`, one new keyword | Appended, existing keywords preserved, no duplicates |
| SD-03 | `package.json` missing entirely | Clear error, no crash — same posture as `utils.addContributor`'s AC-03 |
| SD-04 | Get `author.name` | Displays current `package.json` author name — **not** `app-config`'s commit-identity author, confirming §1.1's distinction holds in practice |

---

## 3. `settings.env` — Manage `.env` File

**File:** `app/commands/settings/manageEnvFile.ts` *(naming note: deliberately not `manageEnv.ts` — that name is already taken by the specced `nuxt.manageEnv`, which cleans caches/reinstalls deps, an unrelated operation)*

**Purpose:** Create, read, and edit the target project's `.env` file.

**CLI Usage:**
```
am settings env create        # copy .env.example -> .env if missing
am settings env read          # display current vars, redacting secret-looking values
am settings env set KEY VALUE
am settings env unset KEY
```

**Behavior:**
1. **Create:** if `.env` already exists, refuse (point at `set`/`unset` instead); else copy `.env.example` → `.env` if one exists, or write an empty file with a comment header if not. *(This overlaps with `app.run → Initialise`'s existing `.env.example` copy step — recommend `Initialise` calls this command's create logic rather than duplicating the copy, the same "one routine, multiple callers" pattern already used for `app.run`'s Clean/Empty and `nuxt.manageEnv`.)*
2. **Read:** parse via §1.3's env-file capability; print `KEY=value` lines, but redact any value where the key name matches a secret-looking pattern (`*_KEY`, `*_SECRET`, `*_TOKEN`, `*_PASSWORD` — the same redaction intent already implemented in `loggerService` for log output, reused here rather than reinvented).
3. **Set/Unset:** thin wrappers over §1.3's `setVar`/`unsetVar`.

**Consumes:** `fileService` (or new `envFileService`, per §1.3's open question), `loggerService`'s existing secret-pattern list (reused, not duplicated).

**Side Effects:** Writes/modifies `.env` — a file that typically holds real secrets; never logged in full unredacted form by this command.

### Test Scenarios
| ID | Scenario | Expected Outcome |
|---|---|---|
| SE-01 | `.env` doesn't exist, `.env.example` does | Copied |
| SE-02 | `.env` already exists, `create` called | Refused, nothing overwritten |
| SE-03 | `read`, one var named `API_SECRET` | Value redacted in output |
| SE-04 | `set NEW_VAR value` | Added, other vars/comments preserved |
| SE-05 | `unset` a var that doesn't exist | No-op, reported clearly (same posture as `app-config unset`'s U-04) |

---

## 4. `settings.contributors` — Manage Contributors

**File:** `app/commands/settings/manageContributors.ts` *(thin — delegates to `utils.addContributor` for the write path per §1.4)*

**Purpose:** List and add `package.json` contributors from one menu location.

**CLI Usage:**
```
am settings contributors list
am settings contributors add          # delegates directly to utils.addContributor
```

**Behavior:**
- `list`: `fileService.read()` on `package.json`, print the `contributors` array (name/email/url per row), or "No contributors listed" if empty/absent.
- `add`: invokes `utils.addContributor`'s existing command logic directly — **not** a reimplementation.

**Consumes:** `fileService`; `utils.addContributor` (existing).

### Test Scenarios
| ID | Scenario | Expected Outcome |
|---|---|---|
| SC-01 | `list`, contributors present | All rows printed |
| SC-02 | `list`, none present | "No contributors listed", no crash |
| SC-03 | `add` | Behaves identically to invoking `utils.addContributor` directly — confirms delegation, not duplication |

---

## 5. `settings.templates` — Manage Templates

**File:** `app/commands/settings/manageTemplates.ts`

**Purpose:** Cross-registry template management — license, deployment/CI files, AI docs.

**CLI Usage:**
```
am settings templates list                              # aggregate, read-only, all registries
am settings templates create-license                     # = settings.appDefaults's License Type action
am settings templates delete-license
am settings templates add --registry deployment           # interactive template-add for one named registry
am settings templates delete --registry deployment <id>
```

**Behavior:**
1. **List:** iterate `licenseRegistry`, `nuxt.addFile`'s deployment registry, and `aiDocRegistry` (§1.1 of `spec-ai-domain-commands-v01.md`); print each as `[registry] id — label`. Read-only, no mutation.
2. **Create License / Delete License:** same operation as `settings.appDefaults`'s License Type action (§2) — generates/overwrites `LICENSE` from `licenseRegistry` and updates `package.json`'s `license` field to the entry's `spdxId`; delete removes the `LICENSE` file and resets `license` to `UNLICENSED`. **One implementation, two menu entry points** (here and under Application Defaults) — same delegation posture as §4's `add`.
3. **Add/Delete (deployment or AI-doc registries):** requires `--registry` (or an interactive first-step picker) since these are structurally different registries — dispatches to the matching domain's existing add/delete command (`nuxt.addFile` for deployment, `ai.create`/`ai.delete` for AI docs) rather than reimplementing either.

**Consumes:** `licenseRegistry`, `nuxt.addFile`'s registry, `aiDocRegistry`; delegates execution to each domain's own existing command.

**Open Question:** is a fourth, genuinely generic "arbitrary custom template" registry wanted (for cases *outside* license/deployment/AI-doc — e.g. a `CONTRIBUTING.md` template, a PR template), or is "Manage Templates" meant to stay a pure aggregator over the three that already exist? The command specced above assumes the latter (aggregator only) — confirm before scoping a fourth registry.

### Test Scenarios
| ID | Scenario | Expected Outcome |
|---|---|---|
| ST-01 | `list` | Every entry from all three registries shown, correctly labeled by source registry |
| ST-02 | `create-license mit` | Identical result to `settings.appDefaults`'s License Type → MIT |
| ST-03 | `add` with no `--registry` and no interactive selection made | Refused with a clear "which registry?" prompt, not a guess |
| ST-04 | `add --registry deployment` | Delegates to `nuxt.addFile`'s existing add flow |

---

## Final Architectural Notes

- The one real "new infrastructure" item this domain needs is §1.3's env-file read/write capability — everything else (§2, §4, §5) is wiring against services and registries that already exist or are already specced elsewhere, following the same "don't build a second implementation of something that already exists" discipline the git/utils domains established.
- §1.1's naming collision with `app-config` is the one item that actively risks user confusion if left unaddressed — resolved here via UI labeling only, no schema change, but worth confirming the exact label wording before implementation rather than after.
- Two open questions remain before this is fully build-ready: §1.3 (new service vs. `fileService` extension) and §5's "is a fourth generic template registry wanted." Neither blocks starting the other, already-resolved parts of this domain.
- Also carried forward from the surrounding conversation, not specific to this domain but recorded here since there's no other natural home for it yet: `nuxt.config`'s Add/Delete actions (from the original command list's `nuxt` section) are **deliberately deferred**, not specced. `codeService`'s TS-file handling only supports targeted find-by-name patching today (`parseMetadata`, `injectHeader`, `injectFunctionDoc`) — never general rewriting of an arbitrary object literal's structure — and per the project's own bottom-up build order, `codeService` itself isn't built yet. Revisit once that tier exists; deciding the AST-vs-string-patch design now would be guessing ahead of a real caller, the same trap already flagged and avoided for `configService.setCwd()`. `nuxt.config`'s **List** action has no such dependency (read-only) and could be specced independently whenever it's next in line.
