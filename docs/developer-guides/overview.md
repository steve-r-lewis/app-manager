# Developer Guide

This guide is for developers contributing to the **App Manager** codebase. It covers architecture, testing strategies, and how to extend the CLI.

## 🏗️ Architecture

The application follows a **Domain-Driven Design (DDD)** pattern, wrapped in a CLI interface.

### Directory Structure
```text
app/
├── commands/           # Business logic grouped by Domain (Git, Nuxt, Quality...)
├── services/           # Singleton Infrastructure Services
│   ├── config.service.ts   # Env & Registry management
│   ├── llm.service.ts      # AI Interface (Gemini)
│   ├── logger.service.ts   # Consola wrapper
│   └── github.service.ts   # Octokit/Git wrapper
├── index.ts            # Entry Point & Menu Router
└── app.ts              # Main Application Logic

```

### Key Concepts

1. **Target Root vs. Tool Root**:
* **Tool Root**: Where the App Manager code lives.
* **Target Root**: The directory the user wants to manage (passed as CLI arg).
* *Rule*: All commands must accept `targetRoot` as an argument to ensure operations happen in the correct place.


2. **Service Pattern**:
* We do not import `process.env` directly in commands. Use `ConfigService`.
* We do not `console.log` directly. Use `LoggerService` or `consola`.



## 🧪 Testing Strategy

We use **Vitest** for all testing. We maintain a high standard of coverage (currently 100% / 75 tests).

* **Unit Tests**: Located in `tests/commands/`. Mock all side effects (fs, git, child_process).
* **E2E Tests**: Located in `tests/e2e/`. Use real temporary directories to verify disk operations.
* **Test Context**: Use the `setupTestContext()` helper in `tests/utils/` to automatically scaffold temp environments for tests.

Run tests:

```bash
pnpm test

```

## 📚 Further Reading

* [Contributing Guidelines](https://www.google.com/search?q=./CONTRIBUTING.md)
* [Raising Issues](https://www.google.com/search?q=./ISSUES.md)

