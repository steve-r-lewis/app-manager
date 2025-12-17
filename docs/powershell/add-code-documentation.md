### ✨ New Features

1.  **Smart Input:** If you don't provide a path, it asks for one.
2.  **Mode Detection:** Automatically detects if you provided a **File** (single mode) or a **Directory** (batch mode).
3.  **Batch Processing:** If you target a directory, it launches a **Checkbox Menu** to let you select which file types to process (`.ts`, `.vue`, etc.).
4.  **Centralized Backups:** It mirrors your project structure into `~/scripts/backup/`, ensuring you never lose code (e.g., `~/layers/auth/index.ts` backs up to `~/scripts/backup/layers/auth/index.ts`).

# Auto-Documentation Tool (AI-Powered)

**Wrapper:** `~/scripts/typescript/run-script.ts addCodeDocumentation`
**Core Logic:** `~/scripts/powershell/addCodeDocumentation.ps1`
**Version:** 2.0.0

This tool uses **AI (Gemini or Ollama)** to rewrite code with professional JSDoc comments and inline explanations. It supports single-file targeting or recursive directory scanning.

---

## 🚀 Setup

### 1. Update package.json

```json
{
  "scripts": {
    "doc": "ts-node ./scripts/typescript/run-script.ts addCodeDocumentation"
  }
}
```

---

## 📖 Usage

### Interactive Mode (Wizard)

Run without arguments to start the wizard. You can enter a file path or a directory path.

```bash
npm run doc
```

### Single File Mode

Target a specific file.

```bash
npm run doc layers/authentication/composables/useAuth.ts
```

### Batch Mode (Directory)

Target a directory. The tool will prompt you to select file types (e.g., `[x] .ts`, `[ ] .vue`).

```bash
npm run doc layers/authentication
```

---

## 🛡️ Safety & Backups

This tool is **non-destructive** by default.

Before modifying any file, it creates a mirror backup in `~/scripts/backup/`.

* **Source:** `~/layers/auth/index.ts`
* **Backup:** `~/scripts/backup/layers/auth/index.ts`

If the AI output is incorrect, simply copy the file from the backup folder to restore it.

---
