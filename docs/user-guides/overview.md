# App Manager User Guide

Welcome to the User Guide. This tool is organized into **Domains**. When you launch the app, you will be presented with a main menu allowing you to select a domain.

## Table of Contents
1.  [App Domain](#1-app-domain)
2.  [Nuxt Operations](#2-nuxt-operations)
3.  [Git Operations](#3-git-operations)
4.  [Quality Gates](#4-quality-gates)
5.  [Utilities (AI)](#5-utilities)
6.  [Documentation](#6-documentation)

---

## 1. App Domain
**Context**: General application lifecycle.

* **Run App**: Launches the main application logic. Useful for verifying the build stability of the target project.

## 2. Nuxt Operations
**Context**: Managing the Nuxt 4 specific architecture.

* **Manage Env**: A cleanup utility.
    * *Clean*: Removes `.nuxt`, `dist`, `.output`, and `node_modules` to fix cache issues.
    * *Reset*: Performs a clean install of dependencies after cleaning.
* **Create Layer**: Scaffolds a new Nuxt Layer.
    * Prompts for a Layer Name.
    * Creates the directory structure (`components`, `composables`, `pages`, `nuxt.config.ts`).
    * Initializes a `package.json` for the layer.
* **Extract Docs**: Generates a Markdown report of your project structure, useful for feeding into LLMs or documentation sites.

## 3. Git Operations
**Context**: Monorepo synchronization and version control.

* **Sync Repos**: The "Magic Button" for monorepos.
    * Fetches origin for the Root.
    * Iterates through all Submodules/Layers and pulls the latest changes.
* **Smart Commit (AI)**:
    * Stages your changes.
    * Analyzes the `git diff` using Gemini.
    * Generates a Semantic Commit Message (e.g., `feat: add new auth layer`).
* **Init Layers**: Scans your `layers/` directory. If a folder is not a git repo, it initializes it and asks if you want to add a remote.
* **Link Submodules**: Checks for git repositories inside `layers/` that are not yet registered in `.gitmodules` and links them.
* **Push to Remote**: Pushes commits to the configured remote. Includes safety checks for authentication.

## 4. Quality Gates
**Context**: Testing and Linting.

* **Select Scope**: You will be asked to run checks on the **Target Project** (your monorepo) or the **App Manager** (this tool).
* **Lint**: Runs `eslint`.
* **Typecheck**: Runs `vue-tsc` to verify TypeScript types.
* **Run Tests**: Executes standard unit tests.
* **🧪 Test UI**: Launches the **Vitest UI** in your default browser. This provides a visual graph of your tests and dependencies.

## 5. Utilities
**Context**: Maintenance and AI Helpers.

* **Validate Headers**: Scans all `.ts` and `.vue` files.
    * Ensures `@project`, `@author`, and `@file` JSDoc headers are present.
    * **Additive**: It will add you as an author without removing existing contributors.
* **Auto Version**:
    * Analyzes code changes in git.
    * Uses AI to determine if the change is Major, Minor, or Patch.
    * Updates the `@version` tag in file headers automatically.
* **Auto Doc**:
    * Finds exported functions/classes that lack documentation.
    * Uses AI to write concise JSDoc comments for them.
* **Add Contributor**:
    * Adds a new person to the `contributors` array in `package.json`.
    * Optionally scans source files and adds `@author: Name` to headers.
* **Clean Logs**: Safely deletes the `tests/logs` and `tests/fixtures` directories to free up space.

## 6. Documentation
* **Start App Manager Docs**: View the internal documentation for this tool.
* **Start Project Docs**: If your target project has `vitepress` installed, this launches the dev server.