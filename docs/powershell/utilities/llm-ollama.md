# Ollama AI Utility

**File:** `~/scripts/powershell/utilities/ollama.ps1`
**Version:** V1.1.0

A wrapper for the local Ollama API, designed as a drop-in alternative to the Gemini utility. It handles connection testing, JSON enforcement, and model selection.

---

## 📋 Prerequisites

1.  **Install Ollama:** [Download here](https://ollama.com).
2.  **Pull Model:** Ensure you have the target model installed (Default: `llama3:8b`).
    ```bash
    ollama pull llama3:8b
    ```
3.  **Start Server:** Ensure `ollama serve` is running.

---

## 🛠 Functions

### `Invoke-Ollama`
Sends a generation request to the local API endpoint (`/api/generate`).

* **Parameters:** Matches `Invoke-Gemini` signature (`Prompt`, `SystemPrompt`, `JsonMode`, `Temperature`).
* **Behavior:**
    * Automatically strips Markdown code blocks (```json ... ```) if `JsonMode` is enabled, as local models are prone to wrapping output.
    * Respects `OLLAMA_TIMEOUT` to prevent hanging on slow hardware.

```powershell
# Direct usage (bypass gateway)
Invoke-Ollama -Prompt "Why is the sky blue?" -ModelOverride "mistral"
```

### `Get-OllamaConfig`

Internal helper that resolves configuration from environment variables or defaults.

---
