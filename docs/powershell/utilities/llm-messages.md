# LLM Messages Utility (Prompt Engineering)

**File:** `~/scripts/powershell/utilities/llm-messages.ps1`
**Version:** V1.1.0

A "Persona Library" that abstracts prompt engineering away from logic scripts. It transforms raw data (like Git Diffs) into structured, provider-agnostic AI prompts.

---

## 🧠 Concept

This utility sits between your Orchestrator scripts (e.g., `gitManageCommits`) and the `llm.ps1` gateway. It ensures that regardless of whether you use Gemini or Llama 3, the **System Instructions** remain consistent and effective.

---

## 🛠 Functions

### `Get-LLM-CommitMessage`
Analyzes a git diff and generates a Conventional Commit message.
* **Persona:** "Git Commit Generator" (Strict, concise, no quotes).
* **Calls:** `Invoke-LLM` (Gateway).

```powershell
$msg = Get-LLM-CommitMessage -Diff $gitDiffString
````

### `Get-LLM-VersionAnalysis`

Analyzes code changes to determine Semantic Versioning impact.

* **Persona:** "Semantic Versioning Expert".
* **Returns:** JSON Object `{ increment: "Major|Minor|Patch", note: "..." }`.

<!-- end list -->

```powershell
$analysis = Get-LLM-VersionAnalysis -Diff $gitDiffString
```

---
