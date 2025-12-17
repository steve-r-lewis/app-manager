# Project Provisioning Tool (Zero-to-Hero)

**Wrapper:** `~/scripts/typescript/run-script.ts provisionProject`
**Core Logic:** `~/scripts/powershell/provisionProject.ps1`
**Version:** V1.0.0

The **Provisioning Tool** is the entry point for all new developers joining the project. It automates the "Zero to Hero" onboarding process, taking a freshly cloned repository and turning it into a fully configured, dependency-hydrated, and ready-to-code environment with a single command.

---

## 🚀 Setup

### 1. Prerequisites
Before running the provisioner, ensure your machine has the basics:
* **Node.js**: v20.0.0 or higher.
* **Git**: Installed and accessible in your PATH.
* **PowerShell**:
    * **Windows**: Native (Pre-installed).
    * **macOS/Linux**: Install PowerShell Core (`pwsh`).

### 2. Update package.json
Ensure your `package.json` has the runner script configured:

```json
{
  "scripts": {
    "provision": "ts-node ./scripts/typescript/run-script.ts provisionProject"
  }
}
```

---

## 📖 Usage

Run the tool using your package manager.

```bash
npm run provision
# OR
pnpm run provision
```

### CLI Flags

You can bypass interactive menus for CI/CD environments:

```bash
# Run non-interactively with logging enabled
npm run provision -- -SkipMenu -Log
```

---

## ⚙️ The Provisioning Workflow

The script performs five distinct phases of setup:

### **Phase 1: System Health Check**

* **Node.js**: Verifies the version matches `engines` in `package.json` (\>=20.0.0).
* **PNPM**: Checks for `pnpm`. If missing or outdated, it attempts to auto-install `pnpm@10.24.0` via npm.
* **Git**: Verifies git is installed.

### **Phase 2: Environment Configuration**

* **Secrets**: Checks for a `.env` file.
  * If missing, it copies `.env.example` to `.env`.
  * If no example exists, it creates a safe blank template.
* **API Keys**: Interactively asks for your **Gemini API Key**.
  * If provided, it validates the key and appends it to `.env` automatically.
  * This enables the AI features in `nuxtCreateLayer` and `gitManageCommits`.

### **Phase 3: Dependency Hydration**

* **Delegation**: Calls `nuxtManager.ps1` in "Reset" mode.
* **Actions**:
  * Runs `pnpm install` (respecting `.npmrc` hoisting rules).
  * Runs `nuxt prepare` to generate type stubs (`.nuxt/`).

### **Phase 4: Version Control Setup**

* **Delegation**: Calls `gitInitialise.ps1` in "Local" mode (`-Push:$false`).
* **Actions**:
  * Initializes the root git repository if missing.
  * Syncs and initializes all Layer submodules defined in `.gitmodules`.
  * Ensures the local git configuration is correct.

### **Phase 5: Editor Configuration**

* **VS Code**:
  * Copies `.vscode/extensions.json.example` -\> `extensions.json` (Prompting you to install recommended plugins like Volar, ESLint).
  * Copies `.vscode/settings.json.example` -\> `settings.json` (Applying project-specific workspace settings).

---

## 🧩 Architecture

This script acts as a **Grand Orchestrator**. It does not duplicate logic; instead, it calls the other specialized tools in your suite:

1.  **`run-script.ts`**: The cross-platform entry point.
2.  **`provisionProject.ps1`**: The main logic controller.
3.  **`nuxtManager.ps1`**: Called for installation logic.
4.  **`gitInitialise.ps1`**: Called for repository logic.
5.  **`logger.ps1`**: Used for consistent UI and file logging.

---

## 🛠 Troubleshooting

* **"Node.js version is too old"**: You must upgrade Node.js manually. The script will not attempt to upgrade Node.js to avoid breaking other system projects.
* **"Failed to install PNPM"**: If the auto-install fails (permissions errors), run `npm install -g pnpm@10.24.0` manually and re-run the provisioner.
* **"Gemini API Request Failed"**: If you entered an invalid key during setup, edit your `.env` file manually to correct `GEMINI_API_CREDENTIALS`.
