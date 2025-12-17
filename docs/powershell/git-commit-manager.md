# Git Commit Manager (AI-Powered)

**Wrapper:** `~/scripts/typescript/gitManageCommits.ts`  
**Core Logic:** `~/scripts/powershell/gitManageCommits.ps1`  

This tool automates the tedious process of writing commit messages across a multi-repo environment (Monorepo Root + Layers). It scans for changes, stages them, sends the diff to **Gemini 2.0 AI**, and proposes a semantic commit message for your review.

---

## 🚀 Setup

### 1. Configure the API Key
This tool requires access to the Gemini API. You must set a JSON-formatted Environment Variable. **Do not hardcode keys in scripts.**

**PowerShell:**
```powershell
$env:GEMINI_API_CREDENTIALS = '{"APIKey": "YOUR_KEY_HERE", "Model": "gemini-2.0-flash"}'
```

**Bash/Zsh:**

```bash
export GEMINI_API_CREDENTIALS='{"APIKey": "YOUR_KEY_HERE", "Model": "gemini-2.0-flash"}'
```

### 2\. Update package.json

Add the following script entry to your project root `package.json` to enable easy execution.

```json
{
  "scripts": {
    "git:commits": "node ./scripts/typescript/gitManageCommits.ts"
  }
}
```

---

## 📖 Usage

### Interactive Workflow (Recommended)

Run the script using your package manager.

```bash
npm run git:commits
```

**The Workflow:**

1.  **Scan:** The script iterates through the Root repo and all Layer repos.
2.  **Detect:** If changes are found, it automatically stages them (`git add -A`).
3.  **Analyze:** It sends the `git diff` to Gemini 2.0 (truncated to 6000 chars if necessary).
4.  **Review Menu:** You are presented with the proposed message and three options:
  * **Accept & Push**: Commits with the AI message and pushes immediately.
  * **Enter Custom Message**: Allows you to override the AI and type your own.
  * **Skip**: Leaves changes staged but does not commit/push.

### CLI Flags

You can pass flags to the wrapper to control logging levels:

```bash
# Run with Debugging enabled (shows API responses and raw diffs)
node ./scripts/typescript/gitManageCommits.ts -Debug
```

---

## ⚙️ Architecture

### The TypeScript Wrapper

The command `npm run git:commits` invokes `gitManageCommits.ts`. This wrapper ensures cross-platform stability:

1.  **Execution Policy:** On Windows, it automatically applies `-ExecutionPolicy Bypass`.
2.  **Path Resolution:** It robustly locates the PowerShell script using absolute paths relative to the wrapper's location.
3.  **Stdio Inheritance:** It pipes standard input/output directly to the shell, ensuring that the interactive menu (`Show-Menu`) functions correctly.

### AI & Logic Integration

The underlying PowerShell script leverages the utility suite:

* **`utilities/gemini.ps1`**: Handles the API interaction. It includes error handling for rate limits (429) and standardizes the system prompt to ensure the AI returns *only* the commit message (no conversational filler).
* **Throttling**: The script includes a `Start-Sleep -Milliseconds 500` delay between repositories to prevents hitting API rate limits when scanning 40+ layers in rapid succession.
* **Diff Handling**: Large diffs are truncated to prevent token limit errors. Diffs returned as arrays are forcibly joined into strings to prevent logic errors.

---

## 🛠 Troubleshooting

* **"Gemini API Request Failed"**:
  * Check your internet connection.
  * Verify `$env:GEMINI_API_CREDENTIALS` is set and valid JSON.
  * If you see "429", wait a moment and try again (Rate Limit).
* **"Method invocation failed... GetResponseStream"**: This indicates an API failure caught by the legacy error handler. Ensure you are using the latest version of `utilities/gemini.ps1` which supports PowerShell Core error objects.
* **"Staged changes are empty"**: The tool skips repositories where changes exist but are effectively empty (e.g., binary file changes that don't show up in a text diff, or file permission changes only).

---

















# Git Commit Manager (AI-Powered)

**Wrapper:** `~/scripts/typescript/gitManageCommits.ts`  
**Core Logic:** `~/scripts/powershell/gitManageCommits.ps1`  

This tool automates the process of writing commit messages across the Monorepo. It scans for changes, stages them, sends the diff to **Gemini 2.0 or Ollama**, and proposes a semantic commit message.

---

## 🚀 Setup

### 1. Configure AI Provider
Select your backend by setting environment variables.

**Gemini:**
```powershell
$env:GEMINI_API_CREDENTIALS = '{"APIKey": "YOUR_KEY", "Model": "gemini-2.0-flash"}'
````

**Ollama:**

```powershell
$env:LLM_PROVIDER = "ollama"
```

### 2\. Update package.json

```json
{
  "scripts": {
    "git:commits": "node ./scripts/typescript/gitManageCommits.ts"
  }
}
```

-----

## 📖 Usage

### Interactive Workflow

```bash
npm run git:commits
```

**The Workflow:**

1.  **Scan:** Iterates through Root and Layer repos.
2.  **Detect & Stage:** Automatically stages changes (`git add -A`).
3.  **Analyze:** Sends the diff to the active AI provider via `llm-messages.ps1`.
4.  **Review Menu:**

<!-- end list -->

* **Accept & Push**: Commits with the AI message and pushes.
* **Enter Custom Message**: Override the AI.
* **Skip**: Leaves changes staged but does not commit.

-----

## ⚙️ Architecture

The script uses `utilities/llm.ps1` to route requests.

* **Diff Handling:** Large diffs are truncated (6000 chars) to respect token limits.
* **Throttling:** A 2-second delay is added between repositories to prevent API rate limits on cloud providers.
* **System Prompt:** "Git Commit Generator" persona ensures concise, conventional commit format.

---
