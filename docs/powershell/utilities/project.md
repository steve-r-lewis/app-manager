# Project Context Utilities

**File:** `~/scripts/powershell/utilities/project.ps1`
**Version:** V1.0.0

Helper functions to ensure scripts run in the correct context and identify Monorepo structures.

---

## 🛠 Functions

### `Test-ProjectRoot`
Verifies that the script is running from the root of the project (checks for `package.json`). If not found, it logs a fatal error and exits.

```powershell
# Place at top of script
Test-ProjectRoot
```

### `Get-FileProjectContext`

Determines if a file belongs to the **Root App** or a specific **Layer** based on its path.

* **Input:** `D:\Repo\layers\billing\components\Test.vue` -\> **Output:** `@monorepo/billing`
* **Input:** `D:\Repo\app.vue` -\> **Output:** `nuxt4-monorepo-base-app`

```powershell
$context = Get-FileProjectContext -FilePath $file.FullName -RootProjectName "my-app"
```

---
