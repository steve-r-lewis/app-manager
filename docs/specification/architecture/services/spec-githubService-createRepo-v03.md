# Technical Specification Document

**Component:** `GithubService` (Repo Creation, Registry Consultation, Sync Split)
**File:** `~/app/services/githubService.ts`
**Related Types:** `~/app/types/services/githubServiceTypes.ts`, `~/app/types/commands/gitTypes.ts`
**Project:** `app-manager`
**Language:** TypeScript (Node.js runtime)

*Third of the Phase 2 component specifications (Implementation Roadmap §7).*

---

## Part 1: Operational & Design Specification

### 1. Component Overview

#### 1.1 Purpose

Three additions to the existing `GithubService`, each addressing a gap found by reading the current implementation directly rather than assumed from the higher-level design discussion:

1. **`createRepo()`** — a genuinely missing capability, needed by `nuxt.createLayer`'s remote-creation step.
2. **Registry consultation** — `repositoryRegistry.json` exists and is versioned but is currently read by **no code at all**; `getAuthHeader()` hardcodes `process.env.GITHUB_TOKEN` directly instead.
3. **Sync method split** — the existing `syncRepo(cwd, silent)` does a combined root-pull-plus-submodule-update; the Scoped Sync design (command specs §1.1, §4.1–4.3) needs a narrower single-repo `pull()` as a separate method.

#### 1.2 Role in System

`createRepo()` is consumed by `nuxt.createLayer`. Registry consultation changes the internal behavior of `getAuthHeader()`/`fetchWithTimeout()`, affecting every existing remote method (`deleteRemoteRepo`, `listRemoteRepos`) as well as the new `createRepo`. `pull()` is consumed by the new `git.syncRepo` command.

### 2. Architecture & Patterns

#### 2.1 Design Patterns

No new patterns introduced — every addition in this spec extends the existing service using its own already-established conventions rather than introducing a new one: `fetchWithTimeout`/`handleApiError` for all remote calls (including the new `createRepo`), `this.git(cwd)` for all local operations (including the new `pull`/`getLocalIdentity`).

#### 2.2 State Management

No change — `GithubService` holds no instance state today (every method is stateless, constructing a fresh `simple-git`/`fetch` call per invocation) and nothing in this spec introduces any.

#### 2.3 Complexity Assessment

**Rating:** Low, for the same reason the existing file already rates Low — each addition here is a short, linear method following an established shape (`createRepo` mirrors `deleteRemoteRepo`'s existing structure; `pull` mirrors half of `syncRepo`; `getLocalIdentity` is a two-line read). The one piece of actual design complexity in this spec is §3.3's decision about which of two competing sources (registry vs. settings) governs org resolution — a judgment call, not an algorithmic one.

### 3. Dependency Graph

#### 3.1 Internal Dependencies (New)

| Dependency | Purpose |
|---|---|
| `../../app-manager/repositoryRegistry.json` (static import, `with { type: 'json' }`) | New. Mirrors exactly how `llmService.ts` already imports `llmRegistry.json` — same pattern, same file-loading mechanism, applied here for the first time. |

#### 3.2 A Real Type/Data Mismatch Found During This Review

`GithubRepositoryConfig` (in `githubServiceTypes.ts`) currently declares:
```ts
export interface GithubRepositoryConfig {
	repositoryName: string;
	githubToken: string;
	githubOrg?: string;
}
```
But the actual `repositoryRegistry.json` content has **two additional fields this interface doesn't declare**:
```json
{
  "repositoryName": "GitHub",
  "tokenType": "github",
  "baseURL": "https://api.github.com",
  "githubToken": "GITHUB_TOKEN",
  "githubOrg": "GITHUB_ORG"
}
```
`tokenType` and `baseURL` are present in the real data but absent from the type. This needs fixing as part of this work — the interface must be extended to `{ repositoryName: string; tokenType?: string; baseURL?: string; githubToken: string; githubOrg?: string; }` before the registry can be safely imported with a type assertion (the same way `llmService.ts` does with `LLMRegistry`), otherwise the assertion either silently drops real data from the type or requires an unsafe cast.

#### 3.3 A Design Decision: `githubOrg` in the Registry Is Superseded by Settings

The registry's `githubOrg` field is an env-var-name pointer, exactly like `apiKeyEnv` in the LLM registry. But a separate, newer mechanism now also exists for "what org should I default to" — the `github.defaultOrg` **setting** (configService, §5 of the settings spec), which has actual UX behind it (tiered resolution, `app-config set`, prompt-and-persist). These are two different answers to the same question, introduced at different points, and they should not both be live.

**Decision:** `github.defaultOrg` (the setting) becomes the sole source of truth for default-org resolution going forward, consumed via `configService.resolve('github.defaultOrg')` by the commands that need it (`nuxt.createLayer`, `git.deleteRemoteRepos`), **not** by `githubService` itself — `githubService`'s methods should accept an explicit `org` parameter from the caller rather than resolving a default internally, keeping the service itself free of a settings-layer dependency (consistent with `githubService` having no such dependency today). The registry's `githubOrg` field is left in the JSON file for now (no destructive change to committed data) but is **not read by any new code** — effectively vestigial. `githubToken` and the new `baseURL`/`tokenType` fields remain genuinely used, since credential-location and API-host configuration are a different, still-needed concern from org preference.

### 4. Data Types & Interfaces

#### 4.1 Type Fix

```ts
// githubServiceTypes.ts — extend existing interface
export interface GithubRepositoryConfig {
	repositoryName: string;
	tokenType?: string;
	baseURL?: string;
	githubToken: string;
	githubOrg?: string; // present in data; intentionally unread by new code — see §3.3
}
```

#### 4.2 New Option Type

```ts
// gitTypes.ts
export interface GitCreateRepoOptions {
	name: string;
	org?: string;
	private?: boolean;      // defaults to true if omitted
	description?: string;
}
```

#### 4.3 Public API & Return Types (New/Changed Methods)

| Method | Signature | Notes |
|---|---|---|
| `createRepo` | `(options: GitCreateRepoOptions) => Promise<GithubRepo>` | New. Returns the API's created-repo response, typed against the existing `GithubRepo` interface — no new response type needed, it's the same shape `listRemoteRepos` already returns per-item. |
| `pull` | `(cwd: string, silent?: boolean) => Promise<void>` | New. Single-repo pull only, no submodule step. |
| `getLocalIdentity` | `(cwd: string) => Promise<{ name?: string; email?: string }>` | New (addendum, §5.6) — read-only local git identity lookup, needed by `resolveOrPrompt`'s author-field fallback-before-prompt behavior. |
| `getTrackedPaths` | `(cwd: string) => Promise<Set<string>>` | New (addendum, §5.7) — needed by `git.addSubmodules` to exclude already-tracked layer paths from its candidate list. |
| `addRemote` | `(cwd: string, name: string, url: string) => Promise<void>` | New (addendum, §5.8) — needed by `nuxt.createLayer` to register a freshly-created remote before the first push. |
| `getFileDiff` | `(cwd: string, filePath: string, staged?: boolean) => Promise<string>` | New (addendum, §5.9) — needed by `utils.autoVersion` for per-file, typically-unstaged diff retrieval. |
| `syncRepo` | *(unchanged signature and behavior)* | Kept exactly as-is to back `git.syncReposAll` — root pull + `git submoduleUpdate(['--init', '--recursive'])`, per the Scoped Sync design's explicit decision not to touch this method's existing behavior. |
| `IGithubService` | Add `createRepo` and `pull` to the interface | Keeps the interface contract in sync with the implementation, matching this file's existing discipline (every public method is listed on `IGithubService`) |

### 5. Functional Logic Specification

#### 5.1 Registry Loading (New Private Helper)

```ts
private getRegistryRecord(): GithubRepositoryConfig | null {
	const record = (repoRegistryData as GithubRegistry).records.find(r => r.repositoryName === 'GitHub');
	return record ?? null;
}
```

**Logic Flow:** A simple lookup against the statically-imported JSON, mirroring `llmService`'s `this.registry.records.find(...)` pattern exactly. Returns `null` if the record is somehow missing (malformed/edited registry file) rather than throwing — every caller of this helper must handle `null` by falling back to the current hardcoded defaults, not by failing.

#### 5.2 `getAuthHeader()` — Changed

**Logic Flow:**
1. Call `getRegistryRecord()`.
2. Resolve the token env var name: `record?.githubToken ?? 'GITHUB_TOKEN'` — falls back to today's hardcoded literal if the registry is missing, so a corrupted/deleted registry file degrades to current behavior rather than breaking every remote call.
3. Read `process.env[tokenEnvVarName]`. If unset, throw exactly as today (`Missing ${tokenEnvVarName} in environment variables` — the error message now correctly reflects the actual configured env var name rather than always saying `GITHUB_TOKEN`, which matters if the registry is ever edited to point at a differently-named variable).

**This is a behavior-preserving change for the default case** (the registry's `githubToken` value today literally is `"GITHUB_TOKEN"`, so nothing observably changes until someone edits the registry) — the value of doing this now is that the registry becomes the actual source of truth going forward, rather than a committed file nobody's code reads.

#### 5.3 Base URL Resolution — Changed

Every remote method (`deleteRemoteRepo`, `listRemoteRepos`, and the new `createRepo`) currently hardcodes `https://api.github.com` inline. Introduce a private `getBaseUrl(): string` following the identical fallback pattern as §5.2 (`getRegistryRecord()?.baseURL ?? 'https://api.github.com'`), and replace every hardcoded occurrence with a call to it. Same behavior-preserving-by-default reasoning as §5.2 — this is preparation for eventual GitHub Enterprise base-URL support, not a functional change today.

#### 5.4 `createRepo(options: GitCreateRepoOptions): Promise<GithubRepo>`

**Logic Flow:**
1. Resolve URL: `options.org` provided → `${getBaseUrl()}/orgs/${options.org}/repos`; else → `${getBaseUrl()}/user/repos`.
2. Build request body: `{ name: options.name, private: options.private ?? true, description: options.description }` — **defaults to private**, matching the `github.defaultVisibility` setting's own default of `'private'` for consistency (the setting itself is resolved by the *caller*, e.g. `nuxt.createLayer`, and passed in here as `options.private` — this method does not consult `configService` itself, per §3.3's decision to keep this service free of a settings dependency).
3. POST via `fetchWithTimeout()` with `getAuthHeader()`'s headers and the JSON body.
4. On `!response.ok`, delegate to the existing `handleApiError()` — reused as-is, no changes needed, since it's already a generic response-status-and-body error extractor.
5. On success, parse and return the JSON body as `GithubRepo`.

**Side Effects:** Creates a real remote repository via the GitHub API — this is a genuinely destructive-in-the-positive-sense, non-idempotent network call (calling it twice with the same name will fail on the second call with a name-collision error from the API itself, which `handleApiError` will surface normally — no special duplicate-detection logic is added here).

**Error Handling:** Identical posture to `deleteRemoteRepo`/`listRemoteRepos` — network/timeout errors bubble from `fetchWithTimeout`, API errors are normalized by `handleApiError`, nothing is caught and swallowed at this level (the calling command, `nuxt.createLayer`, decides how to react to a failure — per that command's own spec, a failed remote-creation step should not roll back an already-successful local scaffold).

#### 5.5 `pull(cwd: string, silent: boolean = true): Promise<void>`

**Logic Flow:** Identical structure to the existing `syncRepo` method's pull portion, with the submodule step removed entirely:
1. `logger.info('Pulling latest changes for: ${cwd}')`.
2. If `!silent`, attach the same `outputHandler` piping `stdout`/`stderr` as `syncRepo` already does.
3. `await git.pull()`.
4. `logger.info('Pull complete.')`.

**Explicitly does not call `git.submoduleUpdate(...)`** — that's the entire point of this method existing separately from `syncRepo`, per the Scoped Sync design.

#### 5.6 `getLocalIdentity(cwd: string): Promise<{ name?: string; email?: string }>` — New, Addendum

**Origin of this addition:** not identified while this file was first specified — surfaced afterward, while writing the `resolveOrPrompt` component spec (`spec-resolveOrPrompt.md` §5.5), which needs a way to check the local git identity *before* prompting for `author.name`/`author.email`. Added here, to this document, rather than left as a note living only in the consuming spec — a capability belongs in the spec of the service that implements it, not just in the spec of whatever first needed it.

**Logic Flow:**
1. `const git = this.git(cwd);`
2. Read both values via `simple-git`'s config getter — mirroring, in reverse, exactly how `initRepo()` already writes these same two keys (`git.addConfig('user.name', ...)`/`git.addConfig('user.email', ...)`): `const name = await git.getConfig('user.name');` / `const email = await git.getConfig('user.email');`.
3. Return `{ name: name.value ?? undefined, email: email.value ?? undefined }` — either or both may be absent (no local git identity configured at all, or only one of the two set), which is exactly why the return type marks both optional rather than requiring the caller to handle a single "found or not" boolean.

**Side Effects:** None — read-only.

**Error Handling:** If `cwd` isn't a git repository at all, `simple-git`'s `getConfig` calls do not throw (they simply return no value, consistent with how a missing config key behaves) — no explicit try/catch is needed here beyond what `simple-git` itself already guarantees. This should be verified against the actual installed `simple-git` version's behavior during implementation, since the spec is written on the reasonable assumption that a missing key resolves quietly rather than throwing, matching every other read-style method in this file.

#### 5.7 `getTrackedPaths(cwd: string): Promise<Set<string>>` — New, Addendum

**Origin of this addition:** not identified while this file was first specified — surfaced while writing the `git.addSubmodules` command spec (`spec-git-domain-commands.md` §1.2), which needs to distinguish an untracked layer folder (a genuine candidate for `submodule add`) from one already committed as a plain directory. Added here for the same reason `getLocalIdentity` (§5.6) was: a capability belongs in the spec of the service that implements it.

**Logic Flow:**
1. `const raw = await this.git(cwd).raw(['ls-files', '--stage']);`
2. Each line of the output has the form `<mode> <hash> <stage>\t<path>` — split on the **last** tab character per line (not the first, in case a path itself legitimately contains a tab, however unlikely) to isolate the path.
3. Return the paths as a `Set<string>` — a set rather than an array, since every caller's use case (`addSubmodules`) is a membership check (`tracked.has(path)`), not iteration order.

**Side Effects:** None — read-only.

**Error Handling:** If `cwd` has no files staged/tracked at all, `raw()` returns an empty string; `''.split('\n').filter(Boolean)` correctly yields an empty array, so this degrades to an empty `Set` rather than throwing — no special-casing needed for a fresh or empty repository.

#### 5.8 `addRemote(cwd: string, name: string, url: string): Promise<void>` — New, Addendum

**Origin of this addition:** surfaced while writing the `nuxt.createLayer` command spec (`spec-nuxt-domain-app-setup.md` §4.1, step 8), which needs to register a freshly-`createRepo()`'d remote's URL before its first `push()` — `push()` (§4.3, existing) assumes a remote already exists in local git config, and nothing in this file could create one.

**Logic Flow:**
```ts
public async addRemote(cwd: string, name: string, url: string): Promise<void> {
	logger.info(`Adding remote '${name}': ${url}`);
	await this.git(cwd).addRemote(name, url);
}
```
A thin, direct wrap of `simple-git`'s own `addRemote()` — no additional logic needed, matching this file's existing convention of keeping simple pass-through operations simple (e.g. `push()` itself is similarly thin).

**Side Effects:** Mutates local git config (`.git/config`), registering the named remote.

**Error Handling:** `simple-git` throws if a remote with the same `name` already exists — not caught here, left to propagate, since `nuxt.createLayer`'s only call site is immediately after a fresh `git init` on a brand-new repository, where an `origin` collision genuinely would indicate something unexpected worth surfacing rather than silently overwriting.

#### 5.9 `getFileDiff(cwd: string, filePath: string, staged?: boolean): Promise<string>` — New, Addendum

**Origin of this addition:** surfaced while writing the `utils.autoVersion` command spec (`spec-utils-domain-commands.md` §1.1), which needs the diff for one **specific, typically unstaged** modified file — a genuinely different operation from the existing `getStagedDiff()` (§4.3, existing), which is both staged-only and has no path filtering at all.

**Logic Flow:**
```ts
public async getFileDiff(cwd: string, filePath: string, staged: boolean = false): Promise<string> {
	const args = staged ? ['--cached', filePath] : [filePath];
	const diff = await this.git(cwd).diff(args);
	logger.debug(`Retrieved diff for ${filePath} (${diff.length} chars)`);
	return diff;
}
```
Defaults to unstaged (`staged = false`), matching the semantics of `GitStatusResult.modified` (§4.3) — the field `utils.autoVersion` actually iterates over — rather than defaulting to match `getStagedDiff()`'s existing staged-only behavior, since the two methods serve different, specific callers with different needs.

**Side Effects:** None — read-only.

**Error Handling:** Consistent with `getStagedDiff()` — no special handling; an invalid `filePath` (not present in the repo) is expected to resolve to an empty diff string via `simple-git`'s own behavior, not to throw.

#### 5.10 Update to `IGithubService`

Add `getTrackedPaths`, `addRemote`, and `getFileDiff` to the interface, alongside `createRepo`, `pull`, and `getLocalIdentity` — keeping every addendum in this file held to the same discipline: **a method is not considered part of this service's real contract until it appears both in this file's Functional Logic Specification and on `IGithubService`.**

---

## Part 2: Appendix — Testing Reference

### 1. Mocking Strategy

| Dependency | Mock Target | Behavior |
|---|---|---|
| `repoRegistryData` (the static JSON import) | Module-level mock | Configurable per test to simulate: a normal, valid registry (current real content); a registry missing the `GitHub` record entirely (tests the `null` fallback path in §5.1–5.3); a registry with a custom `githubToken`/`baseURL` value (tests that the resolved values are actually used, not just the fallback). |
| `fetch` / `fetchWithTimeout` | Global or method-level spy | Standard mock-response pattern already implicit in the existing file's design (`response.ok`, `response.json()`) — `createRepo`'s tests reuse the same mocking shape as the existing `deleteRemoteRepo`/`listRemoteRepos` tests, whatever that established pattern already is in this project's test suite. |
| `simple-git` | `git.pull`, `git.outputHandler`, `git.raw` (§5.7), `git.addRemote` (§5.8), `git.diff` (§5.9, in addition to its existing use in `getStagedDiff`) | Same mocking approach the existing `syncRepo` tests presumably already use — `pull()`'s tests should be near-identical to `syncRepo`'s existing pull-related assertions, minus any submodule-related expectations. The three addenda added after the original `pull()`/`getLocalIdentity` work (§5.7–5.9) all mock further methods on this same `simple-git` instance rather than introducing a new dependency to mock. |

### 2. Test Scenarios

| ID | Scenario | Setup | Expected Outcome |
|---|---|---|---|
| CR-01 | Create repo under an org, defaults otherwise | `options = { name: 'my-layer', org: 'my-org' }` | POST to `.../orgs/my-org/repos` with body `{ name: 'my-layer', private: true, description: undefined }` |
| CR-02 | Create repo without an org (personal account) | `options = { name: 'my-layer' }` | POST to `.../user/repos` |
| CR-03 | Explicit `private: false` | `options = { name: 'my-layer', private: false }` | Body reflects `private: false`, not the default |
| CR-04 | API returns an error (e.g. name collision, 422) | Mocked `fetch` resolves with `ok: false`, status 422, body `{ message: 'name already exists' }` | `handleApiError` throws with that message embedded — no special-casing for this specific status code |
| RG-01 | Registry present, custom token env var name | `repoRegistryData` mocked with `githubToken: 'MY_CUSTOM_TOKEN'`; `process.env.MY_CUSTOM_TOKEN` set | `getAuthHeader()` succeeds using that variable, not `GITHUB_TOKEN` |
| RG-02 | Registry present, custom `baseURL` | `repoRegistryData` mocked with `baseURL: 'https://github.mycompany.com/api/v3'` | `listRemoteRepos()`/`createRepo()` construct URLs against that base, not `api.github.com` |
| RG-03 | Registry record missing entirely | `repoRegistryData.records = []` | `getAuthHeader()` falls back to `GITHUB_TOKEN`; base URL falls back to `https://api.github.com` — proves the fallback path, not just the happy path |
| PL-01 | `pull()`, interactive/silent mode | `silent = true` (default) | `git.outputHandler` **not** called; `git.pull()` called; `git.submoduleUpdate` **not** called |
| PL-02 | `pull()`, headless/raw mode | `silent = false` | `git.outputHandler` called with a handler piping stdout/stderr; `git.submoduleUpdate` **not** called |
| GI-01 | `getLocalIdentity()`, both values configured | `git.getConfig('user.name')`/`'user.email'` mocked to return real values | Returns `{ name, email }` both populated |
| GI-02 | `getLocalIdentity()`, only name configured | `getConfig('user.email')` mocked to return an empty/undefined value | Returns `{ name, email: undefined }` — proves partial identity is handled, not treated as all-or-nothing |
| GI-03 | `getLocalIdentity()`, `cwd` not a git repo / nothing configured | Both `getConfig` calls return no value | Returns `{ name: undefined, email: undefined }`, does not throw |
| TP-01 | `getTrackedPaths()`, repo with several tracked files | `raw(['ls-files', '--stage'])` mocked to return realistic multi-line output | Returned `Set` contains exactly the path portion of each line, correctly split on the last tab |
| TP-02 | `getTrackedPaths()`, empty/fresh repo | `raw()` returns `''` | Returns an empty `Set`, does not throw |
| AR-01 | `addRemote()`, success | `git.addRemote` mocked to resolve | Called with the exact `name`/`url` given |
| AR-02 | `addRemote()`, remote already exists | `git.addRemote` mocked to reject | Error propagates uncaught — not swallowed at this layer |
| FD-01 | `getFileDiff()`, default (unstaged) | `git.diff` mocked | Called with `[filePath]`, not `['--cached', filePath]` |
| FD-02 | `getFileDiff()`, `staged: true` | — | Called with `['--cached', filePath]` |

### 3. Test Data Requirements

**Registry fixture variants**, each a full `GithubRegistry`-shaped object:
```ts
const REAL_REGISTRY = { records: [{ repositoryName: 'GitHub', tokenType: 'github', baseURL: 'https://api.github.com', githubToken: 'GITHUB_TOKEN', githubOrg: 'GITHUB_ORG' }] };
const CUSTOM_TOKEN_REGISTRY = { records: [{ repositoryName: 'GitHub', githubToken: 'MY_CUSTOM_TOKEN' }] };
const EMPTY_REGISTRY = { records: [] };
```

**Sample `createRepo` API response** (matches the existing `GithubRepo` interface exactly, no new fields needed):
```json
{
  "id": 123456,
  "node_id": "R_abc",
  "name": "my-layer",
  "full_name": "my-org/my-layer",
  "private": true,
  "owner": { "login": "my-org", "id": 1, "avatar_url": "", "html_url": "", "type": "Organization" },
  "html_url": "https://github.com/my-org/my-layer",
  "description": null,
  "fork": false,
  "url": "https://api.github.com/repos/my-org/my-layer",
  "created_at": "2026-01-01T00:00:00Z",
  "updated_at": "2026-01-01T00:00:00Z",
  "pushed_at": "2026-01-01T00:00:00Z",
  "git_url": "git://github.com/my-org/my-layer.git",
  "ssh_url": "git@github.com:my-org/my-layer.git",
  "clone_url": "https://github.com/my-org/my-layer.git",
  "default_branch": "main"
}
```

---

## Final Architectural Notes

- The registry-consultation change is deliberately designed to be **behavior-preserving by default** (§5.2, §5.3) — every fallback resolves to today's hardcoded literal, so shipping this change alone, with no registry file edits, produces zero observable difference. The value is entirely in making the registry *actually load-bearing* going forward, rather than in changing anything today.
- §3.3's decision (settings supersede the registry's `githubOrg`) is worth revisiting if a genuine need for a *service-level* default ever emerges (e.g. a command that needs an org but has no natural way to receive it from `configService` itself) — as specified now, `githubService` stays free of any settings-layer dependency, and every caller is responsible for resolving its own org preference before calling in.
- §5.6's `getLocalIdentity()` is the one method in this spec whose need wasn't visible from `githubService`'s own requirements — it only surfaced while specifying a *different* component. Recorded here as a reminder to check, for every future service spec, whether a downstream consumer's spec has quietly asked that service for something it doesn't have yet.
