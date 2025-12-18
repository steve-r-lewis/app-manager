# Scripts Library & Automation Utilities

## Overview

This directory serves as the automation engine for the **Nuxt 4 Monorepo**. It contains a suite of cross-platform tools designed to standardize development workflows, infrastructure provisioning, and project maintenance.

The library allows developers to perform complex tasks—such as deep cleaning the monorepo, resetting environments, or provisioning an entire network of GitHub repositories—with single commands.

## 🧩 Architecture

The tools are built on a **Hybrid Wrapper Architecture**:

1.  **TypeScript Wrappers** (`/typescript/*.ts`):
    * Serve as the entry point for `npm`/`pnpm` scripts.
    * **OS Agnostic**: Automatically detect Windows vs. macOS/Linux.
    * **Configuration**: Handle path resolution and apply necessary flags (like `-ExecutionPolicy Bypass` for Windows).

2.  **PowerShell Core** (`/powershell/*.ps1`):
    * Contains the core business logic.
    * Utilizes shared modules for UI, Logging, and API interactions.
    * Ensures identical behavior across all operating systems.

## 📂 Directory Structure

```text
scripts/
├── guides/              # Detailed documentation for specific tools
│   └── README-GIT-INITIALISE.md
├── logs/                # Runtime transcripts (auto-generated, gitignored)
├── output/              # Temporary scratchpad for script outputs
├── powershell/          # Core logic engines
│   ├── utilities/       # Shared modules
│   │   ├── github.ps1   # GitHub API handling (Auth, Retry, Creation)
│   │   ├── logger.ps1   # Standardized logging (Console + File)
│   │   └── showMenu.ps1 # Interactive CLI Menu UI
│   ├── gitInitialise.ps1
│   └── nuxtManager.ps1
└── typescript/          # Node.js Wrappers (Entry Points)
    ├── gitInitialise.ts
    └── nuxtManager.ts
```

## 🛠 Available Tools

### 1\. Nuxt Manager

**Entry Point:** `npm run nuxt:manager`
**Source:** `typescript/nuxtManager.ts` -\> `powershell/nuxtManager.ps1`

An interactive utility for maintaining the development environment.

* **Clean**: Deep cleaning of `node_modules`, lockfiles, and `.nuxt` artifacts.
* **Reset**: Automated reinstall of dependencies.
* **Clean Cache**: A lightweight reset targeting only cache folders.

### 2\. Git Initialisation

**Entry Point:** `npm run git:initialise`
**Source:** `typescript/gitInitialise.ts` -\> `powershell/gitInitialise.ps1`
**Documentation:** [Read the Full Guide](https://www.google.com/search?q=./guides/README-GIT-INITIALISE.md)

A heavy-lifting automation tool for repository architecture.

* **Provisioning**: Checks/Creates GitHub repositories for the Root and all Layers.
* **Linking**: Automates `git submodule add` operations.
* **Sync**: Pushes all local branches and tags to remote.

## ⚙️ Manual Execution & PowerShell Policies

*Note: The provided NPM scripts (`npm run ...`) handle execution policies automatically via the wrapper. You generally do not need to change system settings to use these tools.*

However, if you wish to run the `.ps1` scripts **directly** in a PowerShell terminal during development, you may encounter Execution Policy restrictions on Windows.

### Safe Single-Run (Recommended)

You can bypass the policy for a single command without changing global settings. This is what our wrappers do internally:

```powershell
pwsh -ExecutionPolicy Bypass -File .\powershell\nuxtManager.ps1
```

### Changing User Policy (Developer Mode)

If you frequently write and run your own scripts manually, you may want to relax the policy for your user account:

```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

* **`RemoteSigned`**: Scripts created locally run freely. Downloaded scripts must be digitally signed.
* **`Scope CurrentUser`**: Affects only your account, not the entire system.

To revert to default security:

```powershell
Set-ExecutionPolicy -ExecutionPolicy Restricted -Scope CurrentUser
```
