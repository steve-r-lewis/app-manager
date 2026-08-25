# Nuxt 4+ Monorepo Manager

**App Manager** is a domain-driven CLI tool designed to orchestrate complex workflows in Nuxt 4 monorepos. It abstracts Git synchronization, layer management, code quality gates, and AI-assisted documentation into a unified interface, simplifying the management of multi-repository architectures.

---

## 🚀 Core Architecture

The application utilizes a **Dual-Routing System** to serve both automated pipelines and developer workflows:

* **Headless Mode:** Direct CLI command execution optimized for CI/CD pipelines and automation scripts (e.g., `am git sync`).
* **Interactive Mode:** A menu-driven Text User Interface (TUI) powered by `@clack/prompts` for day-to-day operations, offering guided workflows and AI assistance.

## ✨ Key Features

* **🧠 Context Aware:** Intelligently distinguishes between the "Tool Root" (the CLI itself) and the "Target Root" (your project), enabling safe execution anywhere.
* **🤖 AI Integrated:** Leverages LLMs to intelligently generate semantic commit messages, write JSDoc documentation, and analyze codebase health.
* **⚡ Nuxt Specialized:** Native commands to scaffold Nuxt Layers, synchronize environment variables across layers, and manage builds.
* **🛡️ Quality Gates:** Unified wrappers for Vitest, ESLint, and type-checking ensure code standards are maintained across the monorepo.
* **📦 Git Orchestration:** robust tools to synchronize multiple repositories, manage remote upstreams, initialize layer repositories, and handle submodules.

---

## 🛠️ Installation & Usage

**1. Development (via `tsx`)**
The most direct method for contributors and local testing.

```bash
# Interactive Menu
npx tsx index.ts

# Headless Command Examples
npx tsx index.ts app dev
npx tsx index.ts git status
```

**2. Standard Usage (via Package Scripts)**
If using the provided `package.json` scripts:

```bash
pnpm dev   # Starts the interactive TUI
# OR
pnpm start
```

**3. Global Simulation (Simulating `am`)**
To run commands using the shorthand `am` binary as referenced in documentation:

```bash
pnpm link --global
am           # Launches Interactive Mode
am app dev   # Launches Headless Mode
```
---

## Modes of Operation

**App Manager** operates in two distinct modes designed to suit different workflows. **Interactive Mode** is the default experience for developers; running the application without arguments launches a rich Text User Interface (TUI) powered by `@clack/prompts`. This mode guides you through complex workflows with menus, interactive forms, and AI assistance, making it ideal for day-to-day development tasks where discovery and guidance are helpful.

**Headless Mode** serves as the automation layer for CI/CD pipelines and scripting. By passing specific arguments directly to the `am` command, the application bypasses the interactive UI entirely and routes the instruction straight to the underlying service logic. This allows for instant, non-blocking execution of core tasks, enabling you to integrate App Manager's capabilities directly into your build scripts or GitHub Actions.

---

## ❓ What is "headless" mode (am)?

**"am"** is the command-line abstraction and interface for **App Manager**. It serves as the specific utility that exposes the App Manager's core logic to the terminal, allowing developers to execute workflows for the specific use case of managing Nuxt 4 monorepos.

It allows you to interact with the App Manager system in two ways:

* **Headless Abstraction:** Passing arguments directly to `am` (e.g., `am git sync`) pipes commands straight to the underlying service logic, optimized for automation and CI/CD.
* **Interactive Abstraction:** Running `am` without arguments launches the TUI, abstracting complex domain logic behind a user-friendly menu system.

### Core Capabilities

Through the `am` interface, you access the App Manager's structured domains:

* **🚀 App Domain:** Lifecycle management (`dev`, `build`).
* **🐙 Git Domain:** Version control orchestration (`sync`, `push`, `smart commit`).
* **💚 Nuxt Domain:** Framework-specific tooling (`create layer`, `manage env`).
* **💎 Quality Domain:** Code health enforcement (`run tests/lint`).
* **🛠️ Utils Domain:** Maintenance scripts (`clean`, `headers`, `autodoc`).

---

## ⌨️ CLI Command Reference

Below are the specific commands available in **Headless Mode**. These commands can be executed using `npx tsx index.ts <command>` or via the global `am` alias if configured.

### App Commands

* `am app dev`
  Starts the Nuxt development server in the target root.
* `am app build`
  Compiles the application for production.

### Git Commands

* `am git sync`
  Synchronizes all tracked repositories by pulling changes from their configured remotes.
* `am git push`
  Push committed changes to the remote repository.
* `am git commit "<message>"`
  Stages changes and creates a commit with the provided message string.
* `am git init [FORCE]`
  Initializes Git repositories for local layers. Append `FORCE` to re-initialize existing ones.
* `am git delete <repo_name>`
  **Dangerous:** Deletes the specified repository from the remote GitHub account.

### Utility Commands

* `am utils headers`
  Scans source files and validates/updates copyright headers.
* `am utils clean`
  Removes temporary log files from the `app_manager` directory.
* `am utils contributor <name> <email>`
  Adds a new contributor entry to the project's `package.json`.

---

## Text User Interface (TUI)

### 📂 Domain Reference

The application is organized into specific **Domains**, each handling a distinct set of responsibilities.

### 🚀 App Domain

Manages the execution and build processes of the target application.

* **`dev`**: Starts the Nuxt development server for the target application.
* **`build`**: Compiles the application for production deployment.

### 🐙 Git Domain

Handles version control operations across the monorepo and its sub-repositories.

* **`commit`**: runs an AI-assisted "Smart Commit" flow that analyzes staged changes and generates semantic commit messages.
* **`sync`**: Synchronizes all tracked repositories by pulling the latest changes from remotes.
* **`push`**: Pushes committed changes to the configured remote repository.
* **`init`**: Initializes Git repositories for Nuxt layers that are currently just local directories.
* **`submodules`**: scans the project and registers any nested repositories as Git submodules.
* **`delete`**: (Dangerous) Deletes a specified remote repository from GitHub.

### 💚 Nuxt Domain

Provides tools specific to Nuxt 4 architecture and Layer management.

* **`create`**: Scaffolds a new Nuxt Layer with a standard directory structure.
* **`env`**: Manages `.env` files, allowing secure synchronization or updates across layers.
* **`docs`**: Extracts inline documentation from Nuxt components and composables.

### 💎 Quality Domain

Enforces code standards.

* **`run`**: Executes the full suite of linters, formatters, and unit tests.

### 📚 Docs Domain

* **`generate`**: Builds static documentation sites or READMEs from source.

### 🛠️ Utils Domain

General-purpose maintenance and system hygiene tools.

* **`clean`**: Wipes log directories (`app_manager/`) to free up space clearing logs and temporary caches.
* **`headers`**: Validates and updates standard file headers (copyright/license) across source files.
* **`autodoc`**: Uses AI to automatically write JSDoc comments for functions and classes.
* **`autoversion`**: Bumps package versions based on recent commit history (Semantic Versioning).
* **`contributor`**: Adds a new contributor to the `package.json` file.

---


