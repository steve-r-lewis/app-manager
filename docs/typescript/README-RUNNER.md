# Universal Script Runner

**File:** `~/scripts/typescript/run-script.ts`  
**Version:** V1.0.0

The Universal Script Runner is a single, unified TypeScript wrapper designed to execute **any** PowerShell script in the project's utility suite. It replaces the need for maintaining individual `.ts` wrapper files for every new tool.

---

## 🎯 Why use this?

1.  **Don't Repeat Yourself (DRY):** Eliminates duplicate boilerplate code (path resolution, execution policy handling) found in individual wrappers.
2.  **Cross-Platform:** Automatically handles Windows Execution Policies (`Bypass`) and OS-specific path separators.
3.  **Interactive Support:** Pipes standard input/output (`stdio`) directly, ensuring menus (`Show-Menu`) and prompts (`Read-Host`) work natively in the terminal.
4.  **Auto-Discovery:** Smartly looks for PowerShell scripts in standard locations (`scripts/powershell/` or `powershell/scripts/`).

---

## 📖 Usage

The runner takes the **Script Name** (without extension) as the first argument, followed by any **Flags** you want to pass to that script.

**Syntax:**
```bash
ts-node ./scripts/typescript/run-script.ts <ScriptName> [Flags]
```

### Examples

**Run the Nuxt Manager:**

```bash
# Runs: scripts/powershell/nuxtManager.ps1
ts-node ./scripts/typescript/run-script.ts nuxtManager
```

**Run Git Init with Logging:**

```bash
# Runs: scripts/powershell/gitManageRepos.ps1 -Log
ts-node ./scripts/typescript/run-script.ts gitInitialise -Log
```

**Run Auto-Versioning in Debug Mode:**

```bash
# Runs: scripts/powershell/updateFileVersion.ps1 -Debug
ts-node ./scripts/typescript/run-script.ts updateFileVersion -Debug
```

---

## ⚙️ Configuration (package.json)

To adopt this runner, update the `scripts` section of your project root `package.json`.

**Migration Table:**

| Script | Old Command | **New Command** |
| :--- | :--- | :--- |
| `nuxt:env` | `node .../nuxtManager.ts` | `ts-node ./scripts/typescript/run-script.ts nuxtManager` |
| `git:init` | `node .../gitInitialise.ts` | `ts-node ./scripts/typescript/run-script.ts gitInitialise` |
| `git:commits` | `node .../gitManageCommits.ts` | `ts-node ./scripts/typescript/run-script.ts gitManageCommits` |
| `nuxt:createLayer` | `node .../nuxtCreateLayer.ts` | `ts-node ./scripts/typescript/run-script.ts nuxtCreateLayer` |
| `version:auto` | `node .../updateFileVersion.ts` | `ts-node ./scripts/typescript/run-script.ts updateFileVersion` |
| `nuxt:getLayerDoc` | `node .../nuxtExtract...ts` | `ts-node ./scripts/typescript/run-script.ts nuxtExtractLayerDescriptions` |
| `validate:headers` | `node .../validateScriptHeaders.ts` | `ts-node ./scripts/typescript/run-script.ts validateScriptHeaders` |

> **Note:** We use `ts-node` directly for cleaner execution during development. If you prefer compiling to JS first, simply replace `ts-node` with `node` and point to the compiled output location.

---

## 🛠 Path Resolution Logic

The runner automatically searches for your PowerShell script in the following order:

1.  `../powershell/<Script>.ps1` (Relative to the runner)
2.  `../../scripts/powershell/<Script>.ps1` (Standard Monorepo structure)
3.  `../../powershell/scripts/<Script>.ps1` (Legacy structure)

This ensures that if you reorganize your folders, you only need to update the resolution logic in **one file** (`run-script.ts`) rather than updating ten different wrappers.

---
