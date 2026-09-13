# Technical Specification Document

**Component:** `FileService`
**File:** `~/app/services/fileService.ts`
**Related Types:** `~/app/types/services/fileServiceTypes.ts`
**Project:** `app-manager`
**Language:** TypeScript (Node.js runtime)

*Standalone spec created retroactively, matching the treatment already given to `ConfigService`, `LLMService`, and `GithubService`. Documents the service's full current API — six pre-existing methods, confirmed directly against the real source, plus the two new methods (`deleteDir`, `listFilesRecursive`) first identified as needed while specifying `nuxt.extractDocs`/`nuxt.manageEnv` (Phase 6), following the same addendum discipline established for `GithubService`'s later-surfaced methods.*

---

## Part 1: Operational & Design Specification

### 1. Component Overview

#### 1.1 Purpose

The central, and only sanctioned, point of file I/O for the entire application. Every other service and command reads, writes, or checks files through this one class rather than calling `node:fs` directly — confirmed as a genuinely-held convention by checking that no other service file in this codebase imports `fs` for anything beyond `FileService` itself and the narrow, justified exceptions in `LoggerService` (its own dedicated log-file stream) and the new `ProcessService.detectPackageManager()` (a synchronous lockfile existence check, specified in its own document).

#### 1.2 Role in System

**Architectural Role:** Infrastructure / I/O Abstraction Layer.

**System Context:** Provides two tiers of capability — "dumb" byte/string I/O (`readText`, `write`, `exists`, `delete`) and "smart," format-aware I/O (`read`/`update`'s JSONC handling via `jsonc-parser`, giving comment- and formatting-preserving reads and surgical writes). `ConfigService`'s settings persistence (Phase 2), every template-writing command, and the new `deleteDir`/`listFilesRecursive` methods (§5.5–5.6) all sit on top of this one service.

### 2. Architecture & Patterns

#### 2.1 Design Patterns

| Pattern | Usage |
|---|---|
| **Facade** | Hides `jsonc-parser`'s AST-based modification API, atomic-write-via-temp-file-and-rename, and raw `node:fs/promises` calls behind six (now eight) simple methods. |
| **Singleton** | One `fileService` instance, exported at module load, consistent with every other service in this codebase. |
| **Atomic Write** | `write()`/`update()` never write directly to the target path — both go through a private `atomicWrite()` helper that writes to a uniquely-named temp file first, then `fs.rename()`s it into place, guaranteeing a reader never observes a partially-written file. |

#### 2.2 State Management

**Statefulness:** Stateless. The class holds only a reference to the `logger` singleton (`private logger: ILogger = logger`) — no instance state persists between calls, and every method's behavior is fully determined by its arguments and the actual filesystem state at call time.

#### 2.3 Complexity Assessment

**Rating:** Low–Medium. Individual methods are short and linear; the concentrated complexity is in `update()`'s three-way branch (JSON surgical-edit path vs. text-append path vs. unsupported-extension full-overwrite fallback) and in getting `atomicWrite()`'s cleanup-on-failure right (§5, `write`).

### 3. Dependency Graph

#### 3.1 Internal Dependencies

| Dependency | Purpose |
|---|---|
| `./loggerService.js` (`logger`) | Every method logs errors/warnings through this rather than `console`, matching every other service's convention. |

#### 3.2 External Dependencies

| Library | Usage |
|---|---|
| `node:fs/promises` | All actual disk I/O — note this file imports the **promise-based** `fs` module directly as `fs` (not aliased as `fsp` the way `LoggerService` does alongside a separate synchronous import), so every call site in this file is already `await`-based with no callback wrapping needed. |
| `node:path` | Path manipulation (`dirname`, `basename`, `extname`, `join`). |
| `jsonc-parser` (`modify`, `applyEdits`, `parse`) | JSONC-aware parsing and AST-based surgical edits — this is what makes `update()` able to patch one key of a JSON file without disturbing comments, formatting, or unrelated keys elsewhere in the same file. |
| `zod` (`ZodSchema` type only) | `read()`'s optional runtime schema validation. |

#### 3.3 Coupling Analysis

**Coupling Level:** Low. No service-to-service coupling beyond `logger`. Every consumer depends on this service, but this service depends on nothing beyond the logger and its external libraries — the correct shape for a foundational infrastructure component.

### 4. Data Types & Interfaces

#### 4.1 `IFileService` (Existing, Extended)

```ts
export interface IFileService {
	read<T = unknown>(filePath: string, schema?: ZodSchema<T>): Promise<T | null>;
	readText(filePath: string): Promise<string | null>;
	write(filePath: string, content: unknown): Promise<void>;
	update(filePath: string, content: unknown): Promise<void>;
	exists(filePath: string): Promise<boolean>;
	delete(filePath: string): Promise<void>;
	// New — added by this spec, §5.7–5.8
	deleteDir(dirPath: string): Promise<void>;
	listFilesRecursive(dir: string, options?: ListFilesOptions): Promise<string[]>;
}

// New — supporting type for listFilesRecursive
export interface ListFilesOptions {
	extensions?: string[]; // e.g. ['.ts', '.vue'] — matched by suffix
	exclude?: string[];    // directory/file names to skip entirely, e.g. ['node_modules', '.git']
}
```

#### 4.2 Public API & Return Types (Full, Current)

| Method | Signature | Status |
|---|---|---|
| `read` | `<T>(filePath: string, schema?: ZodSchema<T>) => Promise<T \| null>` | Existing |
| `readText` | `(filePath: string) => Promise<string \| null>` | Existing |
| `write` | `(filePath: string, content: unknown) => Promise<void>` | Existing |
| `update` | `(filePath: string, content: unknown) => Promise<void>` | Existing |
| `exists` | `(filePath: string) => Promise<boolean>` | Existing |
| `delete` | `(filePath: string) => Promise<void>` | Existing |
| `deleteDir` | `(dirPath: string) => Promise<void>` | **New** |
| `listFilesRecursive` | `(dir: string, options?: ListFilesOptions) => Promise<string[]>` | **New** |

### 5. Functional Logic Specification

#### 5.1 `read<T>(filePath, schema?)` — Existing, Unchanged

Delegates to `readText()`; if the file exists and its extension is `.json`/`.jsonc` (per the private `isJsonFile()` check), parses via `jsonc-parser`'s `parse()` with `{ allowTrailingComma: true }`. A JSONC syntax error logs and returns `null` (does **not** throw). If a `schema` is supplied, runs `schema.safeParse()` — on failure, this path **does** throw (`Schema validation failed for ${filePath}`), a materially different failure mode from the syntax-error case just above it, and one that every caller supplying a schema must be prepared to catch (as `ConfigService.loadSettings()`, Phase 2, already does).

#### 5.2 `readText(filePath)` — Existing, Unchanged

Raw UTF-8 read. `ENOENT` → `null`. `EACCES` → logs specifically, then still rethrows (escalates rather than swallowing a permissions problem). Any other error → logs and rethrows.

#### 5.3 `write(filePath, content)` — Existing, Unchanged

Ensures the parent directory exists (`fs.mkdir(..., { recursive: true })`), serializes `content` based on its **runtime type** (`string` → as-is; `object` → `JSON.stringify(content, null, 2)`; anything else → `String(content)`) — deliberately **not** based on file extension, per this file's own revision history, which records that extension-based branching previously caused non-`.json` object content to be corrupted into the literal string `"[object Object]"`. Writes via `atomicWrite()` (§5.6).

#### 5.4 `update(filePath, content)` — Existing, Unchanged

If the target doesn't exist, delegates to `write()` entirely. Otherwise, three-way branch by extension:
1. **JSON/JSONC:** `content` must be a plain object; iterates its top-level keys and applies each as a separate `jsonc-parser` `modify()`/`applyEdits()` surgical edit — **only ever patches keys present at the top level of `content`**, one `modify()` call per key, meaning a nested path cannot be surgically targeted in one call (this exact constraint is what shaped `ConfigService.setSetting()`'s read-mutate-write-whole-section design in Phase 2 — worth restating here since it's a fact about *this* method, not something specific to that consumer).
2. **Text files** (`.txt`, `.md`, or the bare filenames `.env`/`.gitignore`/`.npmrc`, per `isTextFile()`): appends `content` as a new line, but **only if it isn't already present** in the current file (a simple `includes()` check) — an idempotent-append, not a blind append.
3. **Anything else:** logs a warning that update isn't supported for this file type, then falls back to a full `write()`.

#### 5.5 `exists`/`delete` — Existing, Unchanged

`exists()`: `fs.access()`, boolean success/failure, never throws. `delete()`: `fs.unlink()`, silently succeeds on `ENOENT` (deleting something already gone isn't an error), rethrows anything else. **`delete()` is file-only** — this is precisely the gap `deleteDir()` (§5.7) exists to close, since `fs.unlink()` cannot remove a directory.

#### 5.6 `atomicWrite(filePath, data)` — Existing, Private, Unchanged

Writes to `${filePath}.tmp.${pid}-${timestamp}-${random}` first, then `fs.rename()`s over the real path — an OS-level atomic operation, so a reader can never observe a half-written file. On failure, attempts to clean up the orphaned temp file (`fs.unlink(tempPath).catch(() => {})` — a deliberately silent best-effort cleanup, since failing to delete a temp file is not itself worth surfacing as a second error on top of whatever the original write failure was) before rethrowing the original error.

#### 5.7 `deleteDir(dirPath: string): Promise<void>` — New, Addendum

**Origin:** surfaced while specifying `nuxt.manageEnv`'s cache/`node_modules` cleanup (`spec-nuxt-domain-app-setup.md` §1.1) — `delete()` cannot remove a directory with contents, and nothing else in this file could either.

```ts
public async deleteDir(dirPath: string): Promise<void> {
	try {
		await fs.rm(dirPath, { recursive: true, force: true });
	} catch (error: unknown) {
		const errMsg = error instanceof Error ? error.message : String(error);
		this.logger.error(`FileService DeleteDir Error (${dirPath}): ${errMsg}`);
		throw error;
	}
}
```

`{ force: true }` means a non-existent directory is a silent no-op, not an error — matching `delete()`'s own `ENOENT`-is-fine posture, for consistency between the two removal methods rather than having one be forgiving of a missing target and the other not.

**Side Effects:** Recursively and permanently removes the target directory and everything in it.

**Error Handling:** Logs and rethrows on genuine failures (e.g. a permissions error) — this is a destructive operation, and every caller (`nuxt.manageEnv`'s `executeClean`, `utils.cleanLogs`) needs to know if it didn't actually happen.

#### 5.8 `listFilesRecursive(dir: string, options?: ListFilesOptions): Promise<string[]>` — New, Addendum

**Origin:** surfaced while specifying `nuxt.extractDocs` (`spec-nuxt-domain-app-setup.md` §1.1) — no directory-walking capability existed anywhere in the service layer. Subsequently confirmed also needed by `utils.autoDoc` and `utils.validateHeaders` (Phase 7), and confirmed **not** needed by `utils.autoVersion`, which uses git-diff-based discovery instead (`spec-utils-domain-commands.md` §1.1) — built once, here, specifically so it wouldn't be rebuilt as a bespoke `walk()` helper inside three separate command files, which is what each of their originating legacy specs did independently.

```ts
public async listFilesRecursive(dir: string, options: ListFilesOptions = {}): Promise<string[]> {
	const { extensions, exclude = [] } = options;
	const results: string[] = [];

	let entries;
	try {
		entries = await fs.readdir(dir, { withFileTypes: true });
	} catch {
		return results; // missing directory is an empty result, not an error — matches deleteDir's forgiving posture
	}

	for (const entry of entries) {
		if (exclude.includes(entry.name)) continue;
		const fullPath = path.join(dir, entry.name);

		if (entry.isDirectory()) {
			results.push(...await this.listFilesRecursive(fullPath, options));
		} else if (!extensions || extensions.some(ext => entry.name.endsWith(ext))) {
			results.push(fullPath);
		}
	}

	return results;
}
```

**Design notes:**
- A missing `dir` returns `[]`, deliberately not an error — every consumer (`nuxt.extractDocs`, `utils.autoDoc`, `utils.validateHeaders`) already separately validates that its target directory exists before calling this, so a defensive empty-result fallback here is a safety net, not the primary validation path.
- `exclude` is checked against `entry.name` (the bare directory/file name, e.g. `'node_modules'`), not the full path — meaning an excluded name is skipped **anywhere** in the tree, not just at the top level, which is the intended behavior (skip *every* `node_modules`, however deeply nested, not just one at the root).
- `extensions` matching is a simple suffix check (`endsWith`), not a full glob — sufficient for every current consumer's needs (`.ts`, `.vue`, etc.) without pulling in a globbing dependency for a requirement this narrow.

**Side Effects:** None — read-only.

**Error Handling:** Per-directory read failures during recursion (e.g. a permissions-denied subdirectory encountered partway through a deep walk) are **not** individually caught inside the loop — only the top-level `dir` argument's initial `readdir()` call is guarded. A permission error on a nested subdirectory will propagate up and abort the whole call. This is a deliberate scope limit for this first version, not an oversight left unexamined: every current consumer operates on directories fully owned by the current user (a project's own `layers/` tree), where a nested permissions failure would be a genuinely exceptional, worth-surfacing condition rather than a routine case to silently skip past.

---

## Part 2: Appendix — Testing Reference

### 1. Mocking Strategy

| Dependency | Mock Target | Behavior |
|---|---|---|
| `node:fs/promises` | `readFile`, `writeFile`, `rename`, `unlink`, `access`, `mkdir`, `readdir`, `rm` | Standard per-method configurable mocks — this file's existing tests (implied by its detailed revision history, which references specific prior test fixes) presumably already establish the pattern; the two new methods (`deleteDir`, `listFilesRecursive`) extend the same mock set with `rm`/`readdir`. |
| `jsonc-parser` | `parse`, `modify`, `applyEdits` | Configurable to simulate valid JSONC, syntax-error JSONC, and to verify `modify()` is called once per top-level key in `update()`'s JSON branch. |

### 2. Test Scenarios (New Methods Only — Existing Methods' Behavior Is Restated, Not Retested, Above)

| ID | Scenario | Expected Outcome |
|---|---|---|
| DD-01 | `deleteDir()` on an existing directory with contents | `fs.rm` called with `{ recursive: true, force: true }` on the exact path given |
| DD-02 | `deleteDir()` on a non-existent path | No error — `{ force: true }` makes this a silent no-op |
| DD-03 | `deleteDir()` genuine failure (e.g. `EACCES`) | Logged and rethrown |
| LF-01 | Flat directory, extension filter | Only matching files returned, non-matching files excluded, no subdirectories to recurse into |
| LF-02 | Nested directories, one excluded by name | Files inside the excluded directory never appear in the result, at any depth |
| LF-03 | Target directory doesn't exist | Returns `[]`, does not throw |
| LF-04 | No `extensions` option supplied | Every file at every depth returned, regardless of name |
| LF-05 | Deeply nested structure (3+ levels) | Recursion correctly reaches and returns files at every level, not just the first |

### 3. Test Data Requirements

**Mock directory tree for LF-02/LF-05:**
```
root/
  a.ts
  node_modules/
    pkg/index.ts        <- must NOT appear in results when 'node_modules' is excluded
  layers/
    auth/
      service.ts
      deep/
        util.ts          <- proves multi-level recursion
```

---

## Final Architectural Notes

- This service's design — "smart" JSONC handling as the default for `.json`/`.jsonc`, atomic writes everywhere, no direct `fs` access anywhere else in the codebase — was already solid before this spec existed; nothing here changes any of its six original methods' behavior. The two additions are pure extensions, following the shape the rest of the file already established (try/catch, log-then-rethrow on genuine failure, forgiving of a missing target where forgiveness is the sensible default).
- §5.4's restated constraint (`update()` only patches **top-level** keys per call) is worth keeping visible here even though it was first written up as a `ConfigService`-specific design consequence in Phase 2 — it's a fact about this method, and any future consumer needing to patch a JSON file should read it here first, not rediscover it independently the way `ConfigService.setSetting()`'s design had to.
