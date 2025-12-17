# LLM Gateway Utility

**File:** `~/scripts/powershell/utilities/llm.ps1`
**Version:** V1.0.0

A central gateway that routes AI requests to either **Google Gemini** (Cloud) or **Ollama** (Local Llama 3) based on configuration. It decouples consumer scripts from specific providers, allowing seamless switching without code changes.

---

## 🚀 Configuration

The gateway determines the active provider using the following priority:

1.  **Environment Variable** (`$env:LLM_PROVIDER`) - Best for CI/CD or persistent user preference.
2.  **Interactive Menu** - If no variable is set, it asks the user at runtime.
3.  **Fallback** - Defaults to "Gemini" if running non-interactively without config.

### Environment Variables

| Variable | Value | Description |
| :--- | :--- | :--- |
| `LLM_PROVIDER` | `gemini` \| `ollama` | Sets the active AI backend. |
| `GEMINI_API_CREDENTIALS` | JSON String | `{ "APIKey": "...", "Model": "gemini-2.0-flash" }` |
| `OLLAMA_BASE_URL` | URL | Default: `http://localhost:11434` |
| `OLLAMA_MODEL` | String | Default: `llama3:8b` |

---

## 🛠 Functions

### `Initialize-LLM`
Bootstraps the AI environment. Checks variables or prompts the user to select a provider.

* **Parameters:** `-SkipMenu` (Switch) - Forces default behavior for CI/CD.

```powershell
Initialize-LLM -SkipMenu:$false
````

### `Invoke-LLM`

The generic entry point for all AI operations. Routes the request to `Invoke-Gemini` or `Invoke-Ollama`.

* **Parameters:**
  * `-Prompt` (String, Mandatory): The user query.
  * `-SystemPrompt` (String): The AI persona/instructions.
  * `-JsonMode` (Switch): Forces valid JSON output.
  * `-Temperature` (Double): Creativity (0.0 - 1.0).

```powershell
$response = Invoke-LLM -SystemPrompt "You are a poet" -Prompt "Write about code"
```

---
