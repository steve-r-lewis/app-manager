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