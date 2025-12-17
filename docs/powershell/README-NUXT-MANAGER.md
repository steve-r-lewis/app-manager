# Nuxt Manager Utility

**Nuxt Manager** is a robust, cross-platform CLI tool designed to streamline the maintenance of Nuxt 4 monorepos. It automates repetitive tasks like deep cleaning, dependency resetting, and environment verification, wrapping powerful PowerShell logic in a Node.js interface for seamless integration with `npm`/`pnpm` scripts.

---

## 🚀 Features

* **Interactive Menus**: Navigate options using arrow keys and select via Space/Enter.
* **Cross-Platform**: Automatically handles Windows Execution Policies (`Bypass`) and path resolution. Designed to run identical logic on Windows, macOS, and Linux. The wrapper handles OS-specific nuances (like Execution Policies on Windows) automatically.
* **Deep Cleaning**: Recursively removes `node_modules`, lockfiles, and `.nuxt` artifacts.
* **Smart Caching**: "Clean Cache" mode for a lightweight reset without deleting dependencies.
* **Safety Checks**: Prevents execution if not run from the project root (`package.json` check).
* **Robust Logging**: Optional file-based logging and verbose debug output.
* **Modular Architecture**: Logic is split into reusable utilities (`logger`, `menu`) for easy extension.

---

## 📦 Installation & Setup

Ensure your project structure matches the following layout for automatic path resolution:

```text
/
├── package.json
├── scripts/
│   ├── guides/                    # Guide scripts are ignored by default/
│   │   └── README-NUXT-MANAGER.md # nuxtManager script documentation.
│   ├── logs/                      # Logs are written here by default/
│   ├── typescript/                # Typescript wrapper scripts root directory.
│   │   └── nuxtManager.ts         # The Node.js Wrapper
│   └── powershell/                # PowerShell scripts root directory.
│       ├── nuxtManager.ps1        # The Core Logic
│       └── utilities/             # PowerShell Utilities directory.
│           ├── logger.ps1         # Logging Utility
│           └── showMenu.ps1       # Menu UI Utility
```

### Prerequisites
This tool relies on **PowerShell Core** to execute logic across all platforms.

* **Windows**: Native support (no action required).
* **macOS / Linux**: You must install PowerShell Core (`pwsh`).
* **macOS**: `brew install powershell/tap/powershell`
* **Linux**: [Install instructions](https://learn.microsoft.com/en-us/powershell/scripting/install/installing-powershell-on-linux)

### package.json Configuration

Add the following script to your `package.json` to enable the CLI command:

```json
"scripts": {
  "nuxt:manager": "node ./scripts/typescript/nuxtManager.ts"
}
```

*Note: The wrapper script uses `#!/usr/bin/env ts-node` but can be run via standard `node` in modern environments.*

---

## 🛠 Usage

### Interactive Mode

Run the tool without arguments to launch the interactive menu system:

```bash
pnpm run nuxt:manager
```

You will be presented with the **Process Menu**:

1.  **Clean**: Removes artifacts, lockfiles, and dependencies.
2.  **Reset**: Installs dependencies (`pnpm install`).
3.  **Clean & Reset**: Performs a deep clean followed immediately by an install.
4.  **Clean Cache**: Removes only `.nuxt` and `node_modules/.cache` (Reset Light).

Followed by the **Configuration Menu** (unless skipped via flags):

* **[ ] Debug Mode**: Shows verbose file deletion logs in the console.
* **[ ] Enable Logging**: Saves a transcript of the session to `scripts/powershell/logs/`.

### CLI Flags (Non-Interactive / CI)

You can bypass the menus by passing flags directly. This is useful for CI/CD pipelines.

| Flag | Description |
| :--- | :--- |
| `-Debug` | Enables verbose console output. |
| `-Log` | Enables file logging to `../logs/`. |
| `-SkipMenu` | Skips menus and defaults to **Clean & Reset**. |

**Example:**

```bash
# Run a full reset with debug output, skipping the menu
pnpm run nuxt:manager -- -Debug -SkipMenu
```
---

## 🧩 Architecture
The tool uses a **"Wrapper Pattern"** to ensure OS Agnostic behavior:

### 1\. The Wrapper (`nuxtManager.ts`)

* **Role**: Entry point.
* **Role**: The Bridge.
* **Why it's needed**: It abstracts away the differences in how operating systems call scripts.
* **Function**:
  * Detects the OS (Windows vs Linux/Mac).
  * Resolves the absolute path to `nuxtManager.ps1` (checking multiple fallback locations).
  * Constructs the `pwsh` command, adding `-ExecutionPolicy Bypass` on Windows.
  * Spawns the PowerShell process with `stdio: 'inherit'` to preserve interactive keystrokes.
  * **Path Normalization**: Uses Node.js `path` module to ensure file paths work on both Windows (`\`) and Unix (`/`).
  * **Execution Policy**: Automatically adds `-ExecutionPolicy Bypass` only when running on Windows (where it is required), keeping the command clean on Linux/macOS.
  * **Process Spawning**: Uses `spawnSync` with `stdio: 'inherit'` to allow the PowerShell script to capture interactive keyboard input from your terminal, regardless of the OS shell.


### 2\. The Core Script (`nuxtManager.ps1`)

* **Role**: Orchestrator.
* **Function**:
  * Validates the execution environment (`Test-ProjectRoot`).
  * Imports utilities.
  * Defines core logic functions (`Invoke-Clean`, `Invoke-Reset`, etc.).
  * Manages the execution flow based on menu selection.

### 3\. Utilities (`/utilities/`)

* **`showMenu.ps1`**:
  * Implements a raw UI loop using `[Console]::ReadKey`.
  * Supports single-select and multi-select (checkbox) modes.
  * Handles cursor visibility and screen clearing.
* **`logger.ps1`**:
  * Provides standardized logging functions: `Log-Info`, `Log-Success`, `Log-Warning`, `Log-Error`, `Log-Debug`.
  * Manages `Start-Transcript` for file logging.
  * Filters `Log-Debug` calls based on the global debug flag.

---

## 🔌 Extending the Tool

### Adding a New Process

To add a new function (e.g., "Docker Reset"):

1.  **Open `nuxtManager.ps1`**.
2.  **Define the Logic**: Create a new function `Invoke-DockerReset`.
    ```powershell
    function Invoke-DockerReset {
        Log-Info "Resetting Docker containers..."
        docker-compose down --volumes
        Log-Success "Docker reset complete."
    }
    ```
3.  **Update the Menu**: Add the option to the `$processOptions` array.
    ```powershell
    $processOptions = @("Clean", "Reset", "Clean & Reset", "Clean Cache", "Docker Reset", "Quit")
    ```
4.  **Update the Switch**: Add the case to the main execution block.
    ```powershell
    "Docker Reset" { Invoke-DockerReset }
    ```

### Adding New Utilities

1.  Create the script in `scripts/powershell/utilities/`.
2.  Import it at the top of `nuxtManager.ps1` using the `Test-Path` / `. $script` pattern used for the logger.

---

## ⚠️ Troubleshooting

### **"The system cannot find the path specified"** during deletion:

* This usually happens when deleting nested `node_modules`. The script handles this by checking `Test-Path` before every deletion and silencing standard error for `rmdir`. It is a cosmetic race condition and can be ignored.

### **"File not found" error in the wrapper:**

* The wrapper looks for the PowerShell script in `../../scripts/powershell/` and `../../powershell/scripts/`. Ensure your folder structure matches one of these patterns relative to the `.ts` file.

### **"Pnpm failed"**:

* The `Invoke-Reset` function throws a fatal error if `pnpm install` returns a non-zero exit code. Check your `package.json` for errors or network connectivity.

### **"Command not found: pwsh" on Linux/macOS:**

* This means PowerShell Core is not installed. Please refer to the **Prerequisites** section above.

---
