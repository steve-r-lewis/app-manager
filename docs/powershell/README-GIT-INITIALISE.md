# Initialise Git & GitHub for Nuxt4 Monorepo

## Automated Root & Layer Repo Creation with Submodules

### PowerShell + Node.js Wrapper

This guide documents the full setup, behaviour, and usage of the automated Git initialisation system for the **Nuxt4 monorepo architecture**.
It covers:

* **What the scripts do**: A complete breakdown of the automated workflow.
* **How repo naming works**: Rules for consistent naming across your architecture.
* **How layers become independent GitHub repos**: Understanding the separation of concerns.
* **How root + layer repos are kept consistent**: Ensuring synchronization between local and remote states.
* **How submodules are added**: The mechanism for linking independent layers back to the root.
* **How logging, debugging and remote validation works**: Tools for observability and troubleshooting.
* **How to run everything via npm or directly**: Instructions for executing the scripts.

This document applies to the following structure:

```text
nuxt4-monorepo-base-app/
├── package.json
├── layers/                     # Each folder here becomes a separate repo
│   ├── api/
│   ├── authentication/
│   ├── authorisation/
│   └── ui-library/
└── scripts/
    ├── guides/
    │   └── README-GIT-INITIALISE.md
    ├── logs/
    ├── output/
    ├── powershell/
    │    └── gitInitialise.ps1   # The Core Logic
    │    └── utilities/
    │        ├── github.ps1      # API Interactions
    │        ├── logger.ps1      # Logging Logic
    │        └── showMenu.ps1    # UI Logic
    └── typescript/
        └── gitInitialise.ts    # The Node.js Wrapper
````

---

# 1. What This System Does

Running the initialise script performs a series of automated checks and actions to set up your version control environment.

**For the Root Repository:**
✅ Ensures the **root repository** is a valid Git repo.
✅ Creates the **root GitHub repo** if missing (Private by default).
✅ Verifies or replaces the existing `origin` remote.
✅ Pushes all local branches and tags (`git push --all`, `git push --tags`).

**For every layer directory under `./layers/`:**

  * **Creates a GitHub repo** for that layer (if missing, Private by default).
  * Ensures the **local layer folder** is a Git repo (initializes with `master` branch).
  * Ensures the **remote is valid** (replaces incorrect remotes automatically).
  * **Pushes the layer repo** to GitHub (all branches and tags).
  * Adds the layer as a **Git submodule** in the root repo.

---

# 2. Layer Repository Naming Rules

Each directory inside `~/layers/` becomes an **independent GitHub repository**.

### Example

Layer directory:

```
~/layers/authentication
```

GitHub repository:

```
[https://github.com/](https://github.com/)<org>/nuxt4-layer-authentication.git
```

### Naming rules applied to the directory name:

1.  Lowercase
2.  Spaces → `-`
3.  Invalid characters → `-`
4.  Multiple hyphens collapse → `-`
5.  Leading/trailing hyphens removed
6.  Always prefixed with: `nuxt4-layer-`

### More examples:

| Layer dir name | Repo name | GitHub URL (example) |
| :--- | :--- | :--- |
| `authentication` | `nuxt4-layer-authentication` | `https://github.com/steve-r-lewis/nuxt4-layer-authentication.git` |
| `user-profile` | `nuxt4-layer-user-profile` | `https://github.com/steve-r-lewis/nuxt4-layer-user-profile.git` |
| `UI Components` | `nuxt4-layer-ui-components` | `https://github.com/steve-r-lewis/nuxt4-layer-ui-components.git` |
| `layer-api` | `nuxt4-layer-layer-api` | `https://github.com/steve-r-lewis/nuxt4-layer-layer-api.git` |

---

# 3. Required Environment Setup

## 3.1 GitHub Token

You must create a GitHub **Fine-Grained Personal Access Token (PAT)** and export it as `GITHUB_TOKEN`.

**Required Permissions:**
| Category | Permission |
| :--- | :--- |
| Repository → Metadata | Read |
| Repository → Contents | Read & Write |
| Repository → Administration | Read & Write |

**Setting the Token:**

```bash
# macOS / Linux
export GITHUB_TOKEN="github_pat_..."

# Windows PowerShell
$env:GITHUB_TOKEN="github_pat_..."
```

---

# 4. Script Locations

```text
scripts/
├── typescript/
│   └── gitInitialise.ts         # Cross-platform wrapper (Node.js)
├── powershell/
│   ├── gitInitialise.ps1        # Core automation script
│   └── utilities/               # Shared helper modules
│       ├── github.ps1           # API logic
│       ├── logger.ps1           # Logging logic
│       └── showMenu.ps1         # Interactive UI
├── logs/                        # Transcript logs created when -Log is used
└── guides/
    └── README-GIT-INITIALISE.md # This guide
```

---

# 5. Behaviour Summary

## 5.1 Root Repo Behaviour

When you run the script:

1.  The root folder is checked for `.git`.
2.  If missing → Git repo is initialised (default branch `master`).
3.  GitHub repo is created if needed (Private).
      * *Tries Organization endpoint first, falls back to User endpoint.*
4.  Remote `origin` is validated.
      * If invalid / unreachable → replaced.
      * If missing → added.
5.  All local branches and tags are pushed to the remote.

## 5.2 Layer Repo Behaviour

For each folder inside `~/layers/`:

1.  Repo name generated: `nuxt4-layer-<sanitised-name>`.
2.  Local `git init` run if missing (default branch `master`).
3.  GitHub repo is created if needed (Private).
4.  Remote `origin` validated or replaced.
5.  All local branches and tags pushed.
6.  Added to root repo as submodule at `layers/<layer-dir>`.
      * *If submodule already exists in the index, this step is skipped.*

The script **does not rename directories** — only the GitHub repo name changes.

---

# 6. Automatic Remote Validation

The script checks existing remotes:

  * If `origin` exists and **ls-remote works** → keep it.
  * If `origin` exists but is **unreachable** → delete + recreate it.
  * If `origin` does not exist → create it.

This prevents stale or incorrect remotes causing errors during the push process.

---

# 7. Logging and Debugging

## `-Log`

Enables full PowerShell transcript logging. Creates logs at:
`scripts/logs/gitInitialise_YYYYMMDD_HHMMSS.log`

## `-Debug`

Shows verbose GitHub API responses and internal debug messages in the console (and log file).

## Summary Report

At the end of execution, a table summary is displayed (and logged) showing the status of every layer processed.

---

# 8. Running the Scripts

## 8.1 Via npm (recommended)

Add to your `package.json`:

```json
"scripts": {
  "git:initialise": "node ./scripts/typescript/gitInitialise.ts"
}
```

### Interactive Mode

Run the command to launch the wizard:

```bash
pnpm run git:initialise
```

1.  **Select Mode**:
      * **Initialise & Push (Default)**: Full automation.
      * **Initialise Local Only**: Skips network operations.
2.  **Select Account Type** (If pushing):
      * **Personal User**: Creates repos under your username.
      * **Organization**: Prompts for the Org name.
3.  **Configuration**:
      * Toggle **Debug Mode** or **Enable Logging**.

### CI/CD & Non-Interactive Mode

You can bypass the menus by passing flags directly.

```bash
# Full init and push with logging, no menu
pnpm run git:initialise -- -SkipMenu -Log

# Local init only, with debug output
pnpm run git:initialise -- -SkipMenu -Debug -Push:$false
```

---

# 9. GitHub Repository Creation Rules

The script uses the GitHub API to:

  * Test whether the repo already exists.
  * Create it if missing.
  * **Privacy**: All new repositories are created as **Private**.
  * **Target**:
      * If **Organization** is selected: POSTs to `/orgs/{org}/repos`.
      * If **User** is selected (or Org fails): POSTs to `/user/repos`.

---

# 10. Submodule Behaviour

Each layer is added to the root repo as a Git submodule:

```bash
git submodule add <layer-remote-url> layers/<layer-dir>
```

**Safety Check**: The script checks `git ls-files` before adding. If the path is already tracked in the index, it logs a warning and skips the `add` command to prevent "already exists in the index" fatal errors.

---

# 11. Safety Features

### ✔ **Project Root Validation**: Ensures script runs only from the project root.

### ✔ **Repo creation**: Idempotent (checks existence first).

### ✔ **Push operations**: Retried 3 times with exponential backoff.

### ✔ **Remote validation**: Automatically repairs broken remotes.

### ✔ **Strict Mode**: PowerShell logic uses `Set-StrictMode` to catch errors early.

---

# 12. Recommended Workflow

1.  Create your layers in the `layers/` directory.
2.  Set your `GITHUB_TOKEN`.
3.  Run:
    ```bash
    pnpm run git:initialise
    ```
4.  Follow the interactive prompts to select your target account (User vs Org).
5.  Review the **Initialisation Summary** table at the end.
6.  Your root repository will now contain submodules pointing to each layer’s GitHub repo.
7.  Each layer is fully independent, version-controlled, and shareable.

---

# 13. Troubleshooting

| Problem | Solution |
| :--- | :--- |
| **Missing `GITHUB_TOKEN`** | Export the token in your shell before running. |
| **404 Not Found (API)** | Usually means token lacks permissions. Script auto-falls back from Org to User endpoint. |
| **Remote unreachable** | Script auto-replaces invalid remotes; check network connectivity. |
| **Submodule already exists** | Script detects this via the git index and skips the operation safely. |
| **Command not found: pwsh** | Install PowerShell Core (required for Linux/macOS). |

---

# 14. Quick Commands Cheat Sheet

```bash
# Run interactive wizard
pnpm run git:initialise

# Run non-interactive (CI/CD)
pnpm run git:initialise -- -SkipMenu -Log

# Check root repo status
git status
git remote -v

# Check layer repo status
cd layers/authentication
git status
git remote -v

# Update all submodules
git submodule update --remote
```