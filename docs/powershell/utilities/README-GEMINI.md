# Gemini AI API Utility

**File:** `~/scripts/powershell/utilities/gemini.ps1`
**Version:** V1.0.0

A centralized wrapper for the Google Gemini 2.0 API. It handles authentication, JSON payload construction, and response parsing.

---

## 🔐 Configuration

This utility requires an Environment Variable to be set before execution. **Do not hardcode keys.**

```powershell
$env:GEMINI_API_CREDENTIALS = '{ "APIKey": "YOUR_KEY_HERE", "Model": "gemini-2.0-flash" }'
```

---

## 🤖 Usage

### `Invoke-Gemini`

Sends a prompt to the AI and returns the text response.

| Parameter | Description |
| :--- | :--- |
| **`Prompt`** | The main user input. |
| **`SystemPrompt`** | (Optional) Sets the persona/context. |
| **`JsonMode`** | (Switch) Forces the AI to return strict JSON. |
| **`Temperature`** | (Double) Creativity (0.0 - 1.0). Default `0.7`. |

**Example 1: General Text**

```powershell
$response = Invoke-Gemini -SystemPrompt "You are a poet." -Prompt "Write a poem about Nuxt."
```

**Example 2: JSON Scaffolding**

```powershell
$jsonString = Invoke-Gemini -Prompt "Create package.json for 'billing'" -JsonMode
$data = $jsonString | ConvertFrom-Json
```

---
