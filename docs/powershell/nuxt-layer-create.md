# Nuxt 4 Layer Creator (AI-Powered)

**Wrapper:** `~/scripts/typescript/nuxtCreateLayer.ts`  
**Core Logic:** `~/scripts/powershell/nuxtCreateLayer.ps1`

This tool automates the scaffolding of new Nuxt 4 Monorepo Layers. It combines standard file generation with **AI (Gemini or Ollama)** to intelligently write the `README.md`, `package.json` description, and JSDoc headers based on a simple "purpose" prompt you provide.

---

## 🚀 Setup

### 1. Configure AI Provider
This tool requires access to an LLM. You can choose between Google Gemini (Cloud) or Ollama (Local).

**Option A: Google Gemini**
Set the credentials in your environment:
```powershell
$env:GEMINI_API_CREDENTIALS = '{"APIKey": "YOUR_KEY", "Model": "gemini-2.0-flash"}'
````

**Option B: Ollama (Local)**
Ensure Ollama is running (`ollama serve`) and set the provider:

```powershell
$env:LLM_PROVIDER = "ollama"
# Optional: $env:OLLAMA_MODEL = "llama3:8b"
```

---

### 2. Update package.json

Add the following script entry to your project root `package.json`.

```json
{
  "scripts": {
    "nuxt:createLayer": "node ./scripts/typescript/nuxtCreateLayer.ts"
  }
}
```

---

## 📖 Usage

### Interactive Mode (Recommended)

Run the script using your package manager. You will be guided through a wizard.

```bash
npm run nuxt:createLayer
```

**The Workflow:**

1.  **Configuration Menu:** Option to enable File Logging or Debug Mode.
2.  **Provider Selection:** If no provider is set in env vars, you will be asked to choose between Gemini and Ollama.
3.  **Layer Name:** Enter the directory name (e.g., `billing`).
4.  **Purpose:** Enter a plain-English description.
5.  **Generation:** The AI generates documentation and the script scaffolds the files.

### CLI Flags

You can bypass the configuration menu by passing flags:

```bash
# Run with logging enabled, skipping the menu
node ./scripts/typescript/nuxtCreateLayer.ts -Log -SkipMenu
```

---

## ⚙️ Architecture

### The TypeScript Wrapper

The command `npm run nuxt:createLayer` invokes `nuxtCreateLayer.ts`. This wrapper ensures cross-platform stability:

1.  **Execution Policy:** On Windows, it automatically applies `-ExecutionPolicy Bypass` so you don't need to change global system settings.
2.  **Path Resolution:** It robustly locates the PowerShell script whether you are running from the root, the scripts folder, or a nested directory.
3.  **Stdio Inheritance:** It pipes standard input/output directly to the shell, ensuring that interactive prompts (like `Read-Host` and the `Show-Menu` UI) function correctly.

### AI [Integration
The underlying PowerShell script uses `utilities/llm.ps1` as a gateway.

* **Input:** Layer Name + User Purpose.
* **Prompting:** Uses a "Code Scaffolding Persona" via `Invoke-LLM`.
* **Output:** Strict JSON is requested to populate templates programmatically.

---

## 📂 Scaffolding Output

The tool creates the following structure in `~/layers/<layer-name>/`:

| File | Content Source |
| :--- | :--- |
| **`package.json`** | Name `@monorepo/<layer>`, AI-generated description. |
| **`nuxt.config.ts`** | Standard config with AI-generated JSDoc header. |
| **`README.md`** | AI-generated technical documentation draft. |
| **`tsconfig.json`** | Extends root `.nuxt/tsconfig.json`. |
| **`.gitignore`** | Standard Node/Nuxt ignore patterns. |
| **`LICENSE`** | MIT License with current year and Author. |

---

## 🛠 Troubleshooting

* **"Missing Configuration" / "Environment variable missing"**: Ensure `$env:GEMINI_API_CREDENTIALS` is set in your current terminal session.
* **AI Generation Failed**: If the API is unreachable or the key is invalid, the script will fallback to default generic text (e.g., "Layer for \<purpose\>") and continue scaffolding.
* **"Directory already exists"**: The script prevents overwriting existing layers. Delete the target folder or choose a different name.

---
