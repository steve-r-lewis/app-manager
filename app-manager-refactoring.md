Yes, I fully understand the architectural pivot. We are moving from an **in-project "Hybrid Wrapper"** pattern (Source 1: Legacy PowerShell mixed with TS wrappers inside `~/scripts/`) to a **standalone "External Tool"** pattern (Source 12: Pure TypeScript `app-manager` running externally).

The goal is to delete the `~/script/` directory from your projects (like `nuxt4-project-framework`) and instead manage them using this single, centralized `app-manager` CLI.

Here is the assessment of the current state and the strategic plan to finalize the refactoring.

### 1. Current State Assessment

We have successfully ported the core domain logic from PowerShell to TypeScript. The new architecture uses `consola` for logging, `@clack/prompts` for UI, and `simple-git` for VCS operations.

| Domain | Feature | PS Legacy State (To be Removed) | TS New State (Current Status) |
| --- | --- | --- | --- |
| **Architecture** | **Execution Model** | **Internal:** Scripts copied into every target project. | **External:** Standalone CLI. Uses `process.cwd()` to target the active project. |
| **Core** | **Configuration** | Environment variables + hardcoded paths. | Uses `toolRoot` for its own config (.env) and `targetRoot` for the project. |
| **Git** | **Sync & Init** | `gitManageRepos.ps1`: Idempotent repo creation & submodules. | `syncRepos.ts`: Handles init, submodules, and remote sync. **Stable.** |
| **Git** | **Commits** | `gitManageCommits.ps1`: AI-generated messages. | `manageCommits.ts`: Fully ported with LLM service integration. **Stable.** |
| **Nuxt** | **Maintenance** | `nuxtManager.ps1`: Deep clean & reset. | `manageEnv.ts`: Handles cleaning artifacts and `pnpm install`. **Stable.** |
| **Nuxt** | **Layers** | `nuxtCreateLayer.ps1`: Templated scaffolding. | `createLayer.ts`: TS-based templating and AI metadata generation. **Stable.** |
| **Utils** | **Provisioning** | `provisionProject.ps1`: Checks Node/PNPM versions, VSCode config. | **MISSING.** `runApp.ts` handles running the app, but not the "Zero-to-Hero" machine setup. |
| **Services** | **AI / LLM** | `llm.ps1`: Gateway for Gemini/Ollama. | `llm.service.ts`: Robust service with retry logic & provider switching. **Superior.** |

---

### 2. The Refactoring Plan

To complete the transition and safely delete the legacy `~/script/` folder, we must execute the following 4-Phase Plan.

#### Phase 1: Architectural Hardening (Path Safety)

The most critical risk in an "external tool" is path resolution. We must ensure the tool never accidentally deletes files in its own directory (`toolRoot`) instead of the target project (`targetRoot`).

* 
**Audit `process.cwd()` usage:** Verify every command (Clean, Git, Docs) explicitly operates on `targetRoot` passed from `appManager.ts`.


* 
**Registry Integration:** The `llmRegistry.json` and `repositoryRegistry.json`  exist in config but aren't fully utilized in the services yet. We need to wire these up to allow dynamic model switching without code changes.



#### Phase 2: Feature Parity (The Missing "Provision" Command)

The PowerShell system had a "Zero-to-Hero" script (`provisionProject.ps1`)  that checked Node versions, installed PNPM, and setup VSCode settings. This is currently missing in the TS version.

* **Action:** Create `app/commands/app/provisionProject.ts`.
* 
**Logic:** Port the prerequisite checks (Node version, Git, PNPM) and VSCode config copying from the PS logic.



#### Phase 3: Configuration & Environment Strategy

In the old system, the `.env` file was inside the project. In the new system, we have two contexts:

1. **Tool Config:** The App Manager needs the LLM API Keys (Gemini/Ollama).
2. **Project Config:** The Target Project needs its own runtime keys.

* 
**Action:** Ensure `appManager.ts` correctly loads the *Tool's* `.env` for AI operations, but respects the *Target's* environment for running Nuxt commands.



#### Phase 4: Distribution & Linking

To allow `nuxt4-project-framework` to call this tool, we need to expose the binary.

* **Action:** Update `package.json` in `app-manager` to include a `bin` entry:
```json
"bin": {
  "app-manager": "./appManager.ts"
}

```


* 
**Action:** Verify `shebang` (`#!/usr/bin/env -S npx tsx`) compatibility.



### 3. Immediate Next Step

We should start by **creating the missing Provisioning Logic**. This is the safety net that ensures a developer can clone a fresh project and get it running immediately using your tool.

**Shall I proceed with implementing `app/commands/app/provisionProject.ts` to replicate the "Zero-to-Hero" logic from `provisionProject.ps1`?**


This is a wise strategic choice. "Stabilize before you optimize" is the correct engineering approach. We need to trust the foundation before adding weight to it.

Here is the strategic plan to stabilize, fix, and test the current `app-manager` codebase.

### **Phase 1: Environment & Context Integrity**

Before testing specific commands, we must verify the "Execution Context." Since this tool runs *outside* the target project, it must never confuse "where the tool lives" (`toolRoot`) with "where the work happens" (`targetRoot`).

* **Task 1.1: Verify `appManager.ts` Context:**
* Confirm `toolRoot` accurately resolves to the script's location (Source 15).
* Confirm `targetRoot` accurately resolves to `process.cwd()` (Source 16).
* **Action:** Add a "Diagnostic Mode" (triggered by `--debug`) that prints these paths clearly on startup before any menu loads.


* **Task 1.2: Environment Variable Isolation:**
* The tool loads `.env` from `toolRoot` (Source 17). We need to ensure it *also* gracefully handles the absence of a `.env` in the `targetRoot` if a command relies on project-specific secrets (though currently, it mostly relies on its own keys for AI).
* **Test:** Run the tool from a directory *without* a `.env` to ensure it doesn't crash on startup.



### **Phase 2: Domain Verification & Test Creation**

We will tackle each domain, manual-check its logic, fix obvious issues, and then write a Vitest spec for it.

#### **Domain A: Services (The Foundation)**

* **Task 2.1: `llm.service.ts**`
* **Audit:** The service currently defaults to `process.env.LLM_PROVIDER` or 'gemini' (Source 283).
* **Fix:** Ensure it correctly parses the JSON credentials from `process.env.GEMINI_API_CREDENTIALS` (Source 293).
* **Test:** Create `tests/services/llm.service.test.ts`. Mock the `GoogleGenerativeAI` and `fetch` calls to verify it constructs requests correctly without actually hitting the API.


* **Task 2.2: `github.service.ts**`
* **Audit:** It reads `GITHUB_TOKEN` from process.env (Source 271).
* **Test:** Create `tests/services/github.service.test.ts`. Mock `fetch` to verify it handles 404s (repo missing) vs 200s (repo exists) correctly.



#### **Domain B: Utils (Safe/Low Risk)**

* **Task 2.3: `validateHeaders.ts` (Source 244)**
* **Audit:** Check the regex logic for replacing `@author` and `@project`.
* **Test:** Create `tests/commands/utils/validateHeaders.test.ts`. Provide a dummy file string, run the processing function, and assert the output string has the corrected headers.


* **Task 2.4: `autoVersion.ts` (Source 223)**
* **Audit:** Verify the semver increment logic (`incrementVersion` function) handles Major/Minor/Patch correctly.
* **Test:** Create `tests/commands/utils/autoVersion.test.ts` to unit test the `incrementVersion` pure function (Source 225).



#### **Domain C: Nuxt Operations (Medium Risk)**

* **Task 2.5: `manageEnv.ts` (Source 175)**
* **Audit:** This deletes files (`rm`). We must verify it uses `path.resolve(targetRoot, ...)` and not just relative paths that might drift.
* **Fix:** Ensure `process.cwd()` is strictly passed or used consistently.
* **Test:** *Do not integration test deletion.* Instead, unit test the path resolution logic to ensure it targets the expected folders.


* **Task 2.6: `createLayer.ts` (Source 112)**
* **Audit:** Verify template string replacement.
* **Test:** Create `tests/commands/nuxt/createLayer.test.ts` to verify the JSON template generation logic behaves as expected given mock AI input.



#### **Domain D: Git Operations (High Risk)**

* **Task 2.7: `syncRepos.ts` (Source 79)**
* **Audit:** This performs `git push` and `submodule add`.
* **Fix:** Add a "Dry Run" flag that logs git commands without executing them. This is crucial for manual verification.
* **Test:** Create `tests/commands/git/syncRepos.test.ts`. Mock `simple-git` to ensure the correct sequence of git commands is queued (e.g., `init` -> `add` -> `commit`).



### **Phase 3: Integration & Cleanup**

* **Task 3.1: Global Error Handling:**
* Ensure that if a subcommand fails (throws), the main app catches it, logs it with `consola`, and exits gracefully without leaving the TUI in a hung state (Source 19).


* **Task 3.2: Remove Legacy Code:**
* Once the tests pass, delete the old `scripts/` directory from the repository to prevent confusion.



---

### **Next Step**

I recommend we start with **Task 1.1 (Context Verification)** and **Task 2.1 (LLM Service Tests)**. The LLM service is the brain of your automation; if that fails, the "Smart" features (Commit, Docs, Layers) all fail.

**Shall I create the `tests/services/llm.service.test.ts` file and a debug script to verify the context?**