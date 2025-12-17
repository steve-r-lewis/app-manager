# Nuxt 4 Layer Description Extractor

**Wrapper:** `~/scripts/typescript/nuxtExtractLayerDescriptions.ts`  
**Core Logic:** `~/scripts/powershell/nuxtExtractLayerDescriptions.ps1`  

This tool automates the documentation of your Monorepo Layers. It scans every layer in the `~/layers` directory, extracts metadata from configured files (including components and composables), and compiles them into a single, timestamped Markdown report.

---

## 🚀 Setup

### 1. Configure AI Provider
This tool uses AI to summarize code file contents. Ensure `LLM_PROVIDER` is set or select it at runtime.

### 2\. Update package.json

```json
{
  "scripts": {
    "nuxt:getLayerDoc": "node ./scripts/typescript/nuxtExtractLayerDescriptions.ts"
  }
}
```

---

## 📖 Usage

### Interactive Run

```bash
npm run nuxt:getLayerDoc
```

**Steps:**

1.  **Configuration**: Enable Logging/Debug.
2.  **Provider Selection**: Choose Gemini or Ollama.
3.  **File Selection**: Choose file types to scan.

-----

## ⚙️ How It Works

**Data Extraction Logic:**

| Source File | Method |
| :--- | :--- |
| **`package.json`** | JSON parsing (`description` field). |
| **`README.md`** | First 30 lines. |
| **`*.ts`, `*.vue`** | **AI Analysis**: Sends file content to `Invoke-LLM` with a "Summarize this code" prompt. |

### **The Wrapper Architecture**

We use a TypeScript wrapper (`.ts`) to ensure the script runs reliably across different operating systems (Windows, macOS, Linux) without requiring the user to manually handle shell contexts.

1.  **Entry Point**: You run `npm run nuxt:getLayerDoc`.
2.  **TS Wrapper**: `nuxtExtractLayerDescriptions.ts` executes via `ts-node`.
* It resolves the absolute path of the PowerShell script.
* It detects the Operating System.
* **Windows**: It adds `-ExecutionPolicy Bypass` to ensure the script runs despite local restrictions.
* **macOS/Linux**: It invokes `pwsh` directly.

3.  **Core Execution**: The wrapper spawns a child process to run `nuxtExtractLayerDescriptions.ps1`.
4.  **IO Inheritance**: The wrapper pipes `stdio` (Standard Input/Output) so that interactive menus (`Read-Host` / `Show-Menu`) work perfectly in your terminal.

### **Data Extraction Logic**

The script iterates through every folder in `~/layers/` and scans for the files you selected. It extracts metadata based on the file type:

| Source File | Extracted Data |
| :--- | :--- |
| **`package.json`** | The `"description"` field. |
| **`*.ts`, `*.js`, `*.vue`** | Any text found after a `@description:` tag in comments (JSDoc or HTML comments). |
| **`README.md`** | The first 30 lines of the file (to provide a quick summary). |

---

## 📂 Output
Reports are generated in `scripts/output/` with a timestamped filename.

**Filename Format:** `monorepo-layer-descriptions-{YYYYMMDD-HHmm}.md`

**Example Content:**

# Layer Descriptions (Generated: 20251206-2000)
Search Patterns: package.json, *.vue

## Table of Contents
- [@monorepo/billing](#monorepobilling)
- [@monorepo/ui](#monorepoui)

---

# Nuxt4 Layer: @monorepo/billing

## package.json
"Handles Stripe integration and invoicing."

## PaymentForm.vue
@description:
 * Renders the credit card input fields using Stripe Elements.
 * Emits 'payment-success' on completion.

---

## 🛠 Troubleshooting

* **"PowerShell script not found"**: Ensure `nuxtExtractLayerDescriptions.ps1` is located in `scripts/powershell/`.
* **"pwsh not found"**: Ensure PowerShell 7+ is installed and added to your system PATH.
* **Empty Report**: Ensure your layers contain files matching your selection and that code files use the `@description:` tag.

---
