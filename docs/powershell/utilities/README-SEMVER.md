# Semantic Versioning Utility

**File:** `~/scripts/powershell/utilities/semver.ps1`
**Version:** V1.0.0

A lightweight math utility for parsing, validating, and incrementing version strings that follow the `V{Major}.{Minor}.{Patch}` format.

---

## 🔢 Logic
This utility adheres to strict Semantic Versioning rules regarding resets:
* **Patch:** Increments Patch (`1.0.1` -> `1.0.2`).
* **Minor:** Increments Minor, **Resets Patch** (`1.2.5` -> `1.3.0`).
* **Major:** Increments Major, **Resets Minor & Patch** (`1.5.9` -> `2.0.0`).

---

## 🛠 Functions

### `Get-NextVersion`
Calculates the next version number based on the increment type.
* **Parameters:**
  * `-CurrentVersion`: The string to parse (e.g., `"V1.0.5"` or `"1.0.5"`).
  * `-IncrementType`: `"Major"`, `"Minor"`, or `"Patch"`.
* **Returns:** A string formatted as `V{x}.{y}.{z}`.

```powershell
$newVer = Get-NextVersion -CurrentVersion "V2.1.4" -IncrementType "Minor"
# Result: "V2.2.0"
````

---

## 💡 Usage Example

Used typically in conjunction with AI analysis or manual selection menus:

```powershell
# 1. Import
. "$PSScriptRoot/utilities/semver.ps1"

# 2. Current State
$current = "V1.0.1"

# 3. Calculate
$nextPatch = Get-NextVersion -CurrentVersion $current -IncrementType "Patch" # V1.0.2
$nextMinor = Get-NextVersion -CurrentVersion $current -IncrementType "Minor" # V1.1.0
$nextMajor = Get-NextVersion -CurrentVersion $current -IncrementType "Major" # V2.0.0
```

---
