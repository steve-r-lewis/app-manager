# Nuxt 4 Monorepo Manager

## Overview

The **App Manager** is a centralized, standalone CLI tool designed to orchestrate the development, maintenance, and quality assurance of Nuxt 4 Monorepos.

Unlike legacy automation scripts that must be copied into every project, App Manager runs as an **external binary**. It operates *on* your project rather than living *inside* it. This ensures that all your projects share the same up-to-date tooling without code duplication.

## 🧩 Architecture

The tool is built as a pure **TypeScript Application** that provides a Terminal User Interface (TUI).

* **Runtime**: Node.js (via `tsx` execution).
* **Interface**: Interactive menus powered by `@clack/prompts`.
* **Context Awareness**:
* **Tool Root**: Where the CLI code lives (loads its own AI configurations).
* **Target Root**: The project you are currently working on (where commands are executed).


* **Services**:
* **AI Service**: Integreates Gemini/Ollama for intelligent commit messages and documentation.
* **Git Service**: Manages complex monorepo syncs and submodule linking.



## 📦 Installation & Setup

### 1. Prerequisites

* **Node.js**: v20.0.0 or higher.
* **PNPM**: Recommended package manager.
* **Git**: Must be installed and accessible in PATH.

### 2. Linking the Tool (Development Mode)

Since the tool is managed in a separate repository, use `pnpm link` to make it available globally.

**In the `app-manager` directory:**

```bash
# Register as a global executable
pnpm link --global

```

**In your target project (e.g., `nuxt4-project`):**

```bash
# Link the tool to your project
pnpm link --global app-manager

```

### 3. Configuration (package.json)

Add a script to your project's `package.json` to launch the tool easily:

```json
"scripts": {
  "appTools": "app-manager"
}

```

## 🛠 Usage

To start the manager, run the following command from the root of your Nuxt project:

```bash
npm run appTools

```

You will be presented with the **Main Domain Menu**:

### 🟢 1. App Domain

Commands for running the application lifecycle.

* **Dev**: Starts the development server (`nuxt dev --force`).
* **Build**: Compiles the application for production (`nuxt build`).
* **Generate**: Pre-renders static pages (`nuxt generate`).

### 🟠 2. Nuxt Operations

Tools for managing the Nuxt environment and layers.

* **Manage Env**: Deep cleaning of `node_modules`, `.nuxt` artifacts, and cache resetting.
* **Create Layer**: AI-assisted scaffolding for new monorepo layers. Generates `package.json`, `nuxt.config.ts`, and `README.md` automatically.
* **Extract Docs**: Scans all layers to generate a centralized Markdown report of your architecture.

### 🔴 3. Git Operations

Advanced version control automation.

* **Smart Commit (AI)**: Scans your staged changes and uses AI to generate a semantic commit message.
* **Sync Repos**: Automates the complex process of initializing git submodules, syncing remotes, and pushing changes across multiple repositories (Root + Layers).

### 🔵 4. Quality

Code quality and testing suite.

* **Lint**: Runs ESLint (with optional auto-fix).
* **Typecheck**: Runs `vue-tsc` / Nuxt type checking.
* **Test**: Executes Vitest unit tests.

### 🟣 5. Utilities

Helper scripts for code maintenance.

* **Validate Headers**: Enforces file header standards (`@author`, `@project`) across source files.
* **Auto Version**: Analyzes code changes to automatically increment Semantic Versions (`Patch`, `Minor`, `Major`) in file headers.
* **Auto Document**: Uses AI to write JSDoc comments for existing source code.

## 🔑 AI Configuration

To use the AI features (Smart Commits, Layer Scaffolding), you must configure the **Tool's** environment.

Create a `.env` file in the **`app-manager` root directory** (not your target project):

```ini
# AI Provider Selection (gemini | ollama)
LLM_PROVIDER=gemini

# Google Gemini Credentials
GEMINI_API_CREDENTIALS={"APIKey": "YOUR_KEY_HERE", "Model": "gemini-2.0-flash"}

# Ollama (Local) Configuration
OLLAMA_BASE_URL=http://localhost:11434
OLLAMA_MODEL=llama3:8b

```

## ⚠️ Troubleshooting

**"Command not found: app-manager"**

* Ensure you ran `pnpm link --global` in the app-manager directory.
* Verify `app-manager/package.json` has a `"bin"` entry pointing to `./appManager.ts`.

**"ERR_MODULE_NOT_FOUND"**

* Ensure you have run `pnpm install` inside the `app-manager` directory to install its dependencies (`consola`, `tsx`, etc.).

**AI Commands Failing**

* Verify the `.env` file exists in the `app-manager` directory.
* Check your API keys or ensure Ollama is running (`ollama serve`) if using local AI.