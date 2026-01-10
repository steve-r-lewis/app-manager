# Prompt
I've had a thought about the sync command.  Currently the sync command does a full sync for the whole project, that is for the main root .git configuration as well as the .git submodule configurations.

I think it would be useful to have a sync command that either lets the user choose which .git repository configuration to sync or sync's just the current .git repository configuration of the current directory?

This probably needs a little thought about how best to achieve this for both the CLI and the TUI portals for the AppManager.

Please think hard about this proposal and discuss the benefits and pitfalls of this proposal.

# Response
This is a sophisticated workflow question that moves the tool from a "blunt instrument" (always sync everything) to a "precision tool" (sync exactly what I need).

Here is a breakdown of the proposal, analysing the benefits, pitfalls, and a recommended architectural approach.

### 1. The Analysis

#### The Benefits (Pros)

* **Speed & Bandwidth:** In a large monorepo with many layers (some potentially large), syncing *everything* when you only care about the specific layer you are working on is inefficient.
* **Context Safety:** If a developer is working inside `packages/ui-layer`, they often expect standard Git commands to apply only to that directory. "Least Surprise" principle suggests `sync` should respect the current working directory (CWD) context.
* **Conflict Avoidance:** Pulling the entire project might trigger merge conflicts in a layer you aren't currently touching. Isolating the sync to your active module allows you to ignore unrelated upstream instability until you are ready.

#### The Pitfalls (Cons)

* **"Monorepo Drift":** The primary danger. If the Root repository expects `Layer A` to be at `v2.0` (commit hash X), but you only sync `Layer A` to `v2.1` (commit hash Y) without updating the Root's reference to it, the Monorepo state becomes inconsistent ("Dirty Root").
* **Complexity:** The TUI currently has a simple "Press Enter to Sync" flow. Adding selection logic requires a UI state change (e.g., fetching a list of all submodules -> displaying a Multi-Select Menu).
* **Ambiguity:** If I run `am git sync` from the Root, does it sync *just* the root (ignoring submodules) or *everything*? We need clear defaults.

---

### 2. Proposed Solution: "Scoped Sync"

I recommend evolving the command to support **Scopes**.

#### A. The Logic Change

We modify the `SyncCommand` to determine the "Scope" of operation:

1. **Global (Default for Root):** Updates Root + Recurses into ALL submodules.
2. **Local (Context Aware):** Updates ONLY the repository at `process.cwd()`.
3. **Selective (Interactive):** User picks which modules to update.

#### B. The CLI / Headless Experience

We introduce a flag or argument to control this explicitly:

* `am git sync` → Defaults to **Smart Context**:
* If at Root: Asks user (Interactive) or Syncs All (Headless).
* If in Submodule: Syncs only that submodule.


* `am git sync --all` → Forces full recursive sync (what we have now).
* `am git sync --root-only` → Syncs root, ignores submodules.

#### C. The TUI Experience

When running in Interactive Mode at the **Root**, we can present a choice:

```text
? How would you like to sync?
> ◉ Full Sync (Root + All Submodules)
  ○ Root Only
  ○ Select Specific Layers...

```

### 3. Implementation Plan

To achieve this, we would need to refactor `githubService.ts` to separate the "Pull" from the "Submodule Update".

**Current Code:**

```typescript
public async syncRepo(cwd: string, silent: boolean = true): Promise<void> {
    // ... setup ...
    await git.pull(); // 1. Updates Current
    await git.submoduleUpdate(['--init', '--recursive']); // 2. Updates Children
}

```

**Refactored Service:**

```typescript
// githubService.ts

// 1. Just pull the current repo (context agnostic)
public async pull(cwd: string, silent: boolean): Promise<void> { ... }

// 2. Update child submodules (only relevant if cwd is Root)
public async updateSubmodules(cwd: string, silent: boolean): Promise<void> { ... }

// 3. Orchestrator (legacy support)
public async syncFull(cwd: string, silent: boolean) {
    await this.pull(cwd, silent);
    await this.updateSubmodules(cwd, silent);
}

```

**Refactored Command (`syncCommand.ts`):**

```typescript
// Inside execute()
// 1. Detect if we are in the Project Root or a Submodule
const isRoot = await fileService.isProjectRoot(targetRoot);

if (!isRoot) {
    // We are inside a submodule. Just pull this specific one.
    logger.info('Syncing current layer only...');
    await githubService.pull(targetRoot, silent);
} else {
    // We are at root. Ask user or check flags.
    if (options.current) {
         await githubService.pull(targetRoot, silent);
    } else {
         // Default to Full Sync for safety
         await githubService.syncFull(targetRoot, silent);
    }
}

```

### Conclusion

I believe this is a **high-value improvement** for v1.1 or v1.2.
For v1.0, the current "Full Sync" is the safer, more robust default because it guarantees the Monorepo is consistent. Allowing users to partially sync layers introduces the risk of "Drift" which might generate bug reports that are actually just user-state issues.

**My recommendation:** Keep the current "Full Sync" for the initial release to ensure stability, but document "Scoped Sync" as a fast-follow feature.