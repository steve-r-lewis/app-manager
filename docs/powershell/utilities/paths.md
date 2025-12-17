# Path Utilities

**File:** `~/scripts/powershell/utilities/paths.ps1`
**Version:** V1.0.0

Utilities for string manipulation regarding file paths.

---

## 🛠 Functions

### `Get-RelativePath`
Calculates a clean, readable relative path from the project root for logging purposes.
* **Converts:** `D:\Projects\Repo\layers\billing\nuxt.config.ts`
* **To:** `~/layers/billing/nuxt.config.ts`

```powershell
$cleanPath = Get-RelativePath -FullPath $item.FullName -RootPath $root
Log-Info "Processing $cleanPath"
````

---
