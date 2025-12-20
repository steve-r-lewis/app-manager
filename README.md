# Nuxt 4 Monorepo Manager

![Version](https://img.shields.io/badge/version-1.0.1-blue.svg) ![Tests](https://img.shields.io/badge/tests-75%20passing-brightgreen.svg)

**App Manager** is a domain-driven CLI tool designed to orchestrate complex workflows in Nuxt 4 monorepos. It unifies Git synchronization, layer management, code quality gates, and AI-assisted documentation into a single interactive terminal interface.

## 🚀 Features at a Glance

* **🧠 Context Aware**: Automatically detects if it's running against itself (Tool Root) or your project (Target Root).
* **🤖 AI Powered**: Uses Gemini/LLM to generate commit messages, write JSDoc headers, and version code.
* **⚡ Nuxt Native**: Specialized commands to manage Layers, clean caches, and scaffold directories.
* **🛡️ Quality First**: Integrated wrappers for Vitest (with UI), ESLint, and Typechecks.
* **📦 Git Automation**: Sync submodules, manage remotes, and initialize layer repositories effortlessly.

## 🛠️ Installation

### Prerequisites
* Node.js v18+
* pnpm (recommended)
* Git

### Setup
1.  **Clone the Repository**:
    ```bash
    git clone [https://github.com/your-org/app-manager.git](https://github.com/your-org/app-manager.git)
    cd app-manager
    ```
2.  **Install Dependencies**:
    ```bash
    pnpm install
    ```
3.  **Build the Project**:
    ```bash
    pnpm build
    ```
4.  **Configure Environment**:
    Copy `.env.example` to `.env` and add your keys:
    ```ini
    MY_TEST_KEY=your_gemini_api_key_here
    DEBUG=false
    ```

## 🔌 Wiring Up Your Project

You can run App Manager in two modes: **Standalone** or **Integrated**.

### Mode A: Run on a Target Project (Recommended)
To manage a different monorepo using this tool:

1.  Open your terminal.
2.  Run the built CLI and pass the path to your target project:
    ```bash
    node path/to/app-manager/dist/index.js ./my-nuxt-monorepo
    ```
    *Tip: Alias this in your shell profile (e.g., `alias am="node ~/tools/app-manager/dist/index.js"`).*

### Mode B: Development Mode
To work on the App Manager itself:

1.  Run the start script from the root:
    ```bash
    pnpm start
    ```

## 📚 Documentation

Detailed documentation is available in the `docs/` directory:

* **[User Guide](./docs/user-guide/index.md)**: Detailed breakdown of every command and domain.
* **[Developer Guide](./docs/developer-guide/index.md)**: Architecture, contributing guidelines, and code tours.

## 📄 License
[MIT](./LICENSE)



