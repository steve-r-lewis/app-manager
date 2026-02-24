To initialize and install the **App Manager** application, you can use the following methods based on your current workspace and desired mode of operation:

### 1. Initialization and Installation

Before running the application, ensure you have the dependencies installed:

* **Install Dependencies:** Run `pnpm install` in the root of the `app-manager` codebase.
* **Global Link (Optional):** To use the `am` shorthand globally, run `pnpm link --global` from within the `app-manager` directory.

---

### 2. Calling from WITHIN the App-Manager Codebase

When you are working directly inside the `app-manager` repository, use `tsx` to execute the entry point.

| Mode | Command |
| --- | --- |
| **Interactive** | `npx tsx index.ts` |
| **Headless** | `npx tsx index.ts <domain> <command>` (e.g., `npx tsx index.ts git sync`) |

---

### 3. Calling from an EXTERNAL Codebase

When you are in a different project directory (the "Target Root") and want to use the tool to manage that project, use the following methods:

#### Method A: Using the Global Alias (`am`)

This requires you to have previously run `pnpm link --global`.

| Mode | Command |
| --- | --- |
| **Interactive** | `am` |
| **Headless** | `am <domain> <command>` (e.g., `am git push`) |

#### Method B: Using `npx` (if not linked globally)

You can point `tsx` to the absolute path of the App Manager's `index.ts`.

| Mode | Command |
| --- | --- |
| **Interactive** | `npx tsx /path/to/app-manager/index.ts` |
| **Headless** | `npx tsx /path/to/app-manager/index.ts <domain> <command>` |

---

### Summary of Modes

* **Interactive Mode:** Launches a TUI powered by `@clack/prompts`, providing a guided menu system for day-to-day development. It is triggered by running the application **without arguments**.
* **Headless Mode:** Designed for CI/CD and automation. It is triggered by **passing specific arguments** (e.g., `git sync`), which routes logic directly to the underlying services.