# Auto-Versioning Utility (AI-Powered)

**Wrapper:** `~/scripts/typescript/run-script.ts updateFileVersion`  
**Core Logic:** `~/scripts/powershell/updateFileVersion.ps1`

This tool automates Semantic Versioning. It uses **AI (Gemini/Ollama)** to analyze code changes, determine the correct version increment (Patch, Minor, or Major), and write a technical changelog entry.

---

## 🚀 Setup

### 1. Configure AI Provider
Ensure your AI environment is configured.

```powershell
# For local LLM
$env:LLM_PROVIDER = "ollama"
```






### 2\. Update package.json

```json
{
  "scripts": {
    "version:auto": "node ./scripts/typescript/run-script.ts updateFileVersion"
  }
}
```

---

## 📖 Usage

### Interactive Mode

Run the script. It will scan for modified files and present a review menu.

```bash
npm run version:auto
```

**The Workflow:**

1.  **Scan:** Detects modified `.ts` and `.vue` files.
2.  **Analyze:** Sends diff to AI via `Get-LLM-VersionAnalysis`.
3.  **Review:** Shows proposed change (e.g., `1.0.0 -> 1.0.1`).
4.  **Apply:** Updates the file header and history log.

---

## ⚙️ Header Requirements

For this script to work, your source files **must** contain a standard JSDoc header block with specific tags.

**Required Tags:**

* `@version:` The current Semantic Version (e.g., `V1.0.0`).
* `@notes: Revision History`: The anchor point where new logs are inserted.

**Example File Header:**

```typescript
/**
 * ================================================================================
 * @project:    nuxt4-monorepo-base-app
 * @file:       ~/layers/billing/composables/useInvoice.ts
 * @version:    V1.0.0  <-- Script reads/updates this
 * @author:     Steve R Lewis
 * ================================================================================
 * @notes: Revision History
 *
 * V1.0.0, 20251204-1200
 * Initial creation.
 * ================================================================================
 */
```

**After AI Update:**

```typescript
/**
 * ...
 * @version:    V1.0.1  <-- Updated
 * ...
 * @notes: Revision History
 *
 * V1.0.1, 20251205-1430
 * Fixed null reference error in invoice calculation logic.  <-- AI Generated
 *
 * V1.0.0, 20251204-1200
 * Initial creation.
 * ...
 */
```

---

## 🧠 AI Logic

The script uses `utilities/llm-messages.ps1` to instruct the AI.

1.  **Diff Analysis**: Reads git diff.
2.  **SemVer Decision**:

<!-- end list -->

* **Patch**: Bug fixes, refactoring.
* **Minor**: New features.
* **Major**: Breaking API changes.

<!-- end list -->

3.  **Note Generation**: Writes a max 15-word technical summary.

---

## 🛠 Troubleshooting

* **"No diff found for..."**: The file might be **Untracked** (New). The script currently only works on files that are already tracked by Git (Modified). Stage the file first (`git add`) if you want to force detection, though usually new files start at V1.0.0 manually.
* **"Could not find @version header"**: The file is missing the standard header block shown above. Run `validateScriptHeaders` to potentially fix structure, or add the header manually.
* **"Could not find Revision History block"**: The `@notes: Revision History` text is missing. The version number will update, but no log entry will be written.

---
