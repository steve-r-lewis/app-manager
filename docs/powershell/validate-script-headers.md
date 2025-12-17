# Validate Script Headers & Package Names

**Automated Code Standardization Tool for Nuxt 4 Monorepo**

This utility enforces consistency across the monorepo by validating and automatically updating file headers and metadata in source files. It ensures that author attribution, file paths, project context, and version numbers are always accurate.

It also validates `package.json` names to ensure strict adherence to the project's naming conventions (e.g., `@monorepo/{layer-name}` for layers).

## 🚀 Features

* **Header Standardization**: Automatically updates `@project`, `@file`, and `@author` tags in standard file headers.
* **Version Sync**: Scans the `@notes: Revision History` block in a file and updates the `@version` tag to match the latest entry found.
* **Package Naming**: Enforces naming conventions for `package.json` files.
* **Cross-Platform**: Runs seamlessly on Windows, macOS, and Linux via a smart wrapper.
* **Observability**: Detailed logging to both console (Debug mode) and file transcripts.

## 📦 Installation & Prerequisites

### 1. Project Structure
Ensure your project matches this layout for automatic path resolution:

```text
nuxt4-monorepo-base-app/
├── package.json
├── layers/                     # Each folder here is a separate project scope
│   ├── authentication/
│   └── ...
└── scripts/
    ├── typescript/
    │   └── validateScriptHeaders.ts    # The Node.js Wrapper
    └── powershell/
        ├── validateScriptHeaders.ps1   # The Core Logic
        └── utilities/
            └── logger.ps1              # Shared Logging Utility
````

### 2\. npm Script

Add the following to your `package.json`:

```json
"scripts": {
  "validate:headers": "node ./scripts/typescript/validateScriptHeaders.ts"
}
```

## 🛠 Usage

### Via npm (Recommended)

Run the standard validation command:

```bash
pnpm run validate:headers
```

This will:

1.  Scan the Root, App, Server, and Layer directories.
2.  Validate `package.json` names.
3.  Update header blocks in `.ts`, `.vue`, and `nuxt.config.ts` files.
4.  Sync version numbers from revision history.

### CLI Flags

You can pass standard flags to the script for better observability:

| Flag | Description |
| :--- | :--- |
| `-Debug` | Prints detailed processing info (e.g., every file scanned) to the console. |
| `-Log` | Saves a full transcript of the operation to `scripts/logs/`. |

**Example:**

```bash
pnpm run validate:headers -- -Debug -Log
```

## 🔍 Validation Logic

### 1\. File Headers

The script scans `.ts`, `.vue`, and `nuxt.config.ts` files. It looks for a standard header block and updates the following fields:

  * **`@project`**:
      * `nuxt4-monorepo-base-app` (for root/app/server files)
      * `@monorepo/{layer-name}` (for files inside `layers/`)
  * **`@file`**: The relative path to the file from the project root (e.g., `~/layers/auth/nuxt.config.ts`).
  * **`@author`**: Enforces "Steve R Lewis".

### 2\. Versioning

It searches for a revision history block pattern (e.g., `V1.0.0`). It takes the first version number found in the history list (assuming top-down ordering) and ensures the `@version` tag at the top of the file matches it.

### 3\. Package.json Validation

It reads `package.json` files and enforces the `name` field:

  * **Root**: Must match the root directory name.
  * **Layers**: Must follow the format `@monorepo/<layer-folder-name>`.

## 🧩 Architecture

### 1\. The Wrapper (`validateScriptHeaders.ts`)

  * **Role**: Entry point.
  * **Function**:
      * Detects the OS.
      * Resolves the absolute path to `validateScriptHeaders.ps1`.
      * Constructs the `pwsh` command with `-ExecutionPolicy Bypass` (Windows only).
      * Spawns the PowerShell process with inherited stdio.

### 2\. The Core Script (`validateScriptHeaders.ps1`)

  * **Role**: Logic Engine.
  * **Function**:
      * Uses `Get-ChildItem` to recursively scan target directories.
      * Implements regex-based replacement for header fields.
      * Implements JSON parsing/writing for `package.json` updates.
      * Uses `logger.ps1` for consistent output formatting.

## ⚠️ Troubleshooting

| Issue | Solution |
| :--- | :--- |
| **Header fields not updated** | Ensure the file starts with a recognizable JSDoc-style header block (`/** ... */`). |
| **Version not syncing** | Ensure your revision history uses the format `V1.0.0, YYYYMMDD-HH:MM`. |
| **Log files not created** | Verify the `scripts/logs/` folder exists or is writable. |
| **"Command not found: pwsh"** | Install PowerShell Core (required for Linux/macOS). |

## 📝 Quick Commands

```bash
# Normal run
pnpm run validate:headers

# Debug mode (verbose output)
pnpm run validate:headers -- -Debug

# Logging mode (save to file)
pnpm run validate:headers -- -Log

# Full debug & logging
pnpm run validate:headers -- -Debug -Log
```