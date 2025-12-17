# PowerShell Menu Utility

**File:** `~/scripts/powershell/utilities/showMenu.ps1`
**Version:** V1.0.0

A robust, interactive CLI menu system for PowerShell. It supports keyboard navigation (Arrow Keys), single selection, and multiple selections (Checkboxes).

---

## 🚀 Usage

### Single Selection
Returns the string value of the selected option.

```powershell
$options = @("Clean", "Build", "Deploy", "Quit")
$choice = Show-Menu -Title "Select Action" -Options $options -MultiSelect $false

if ($choice -eq "Quit") { exit }
```

### Multi-Selection

Returns an array of selected string values. Toggled via the Spacebar.

```powershell
$opts = @("Enable Logging", "Enable Debug", "Verbose Mode")
$selections = Show-Menu -Title "Configuration" -Options $opts -MultiSelect $true

if ($selections -contains "Enable Logging") { 
    Write-Host "Logging Enabled" 
}
```

---

## ⚙️ Parameters

| Parameter | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| **`Title`** | `string` | *Mandatory* | The header text displayed above the menu. |
| **`Options`** | `array` | *Mandatory* | List of strings to choose from. |
| **`MultiSelect`** | `bool` | `$false` | If true, enables checkboxes `[x]`. |
| **`ClearScreen`** | `bool` | `$true` | If true, clears the console before rendering. |

---

## 🎮 Controls

* **UP / DOWN**: Navigate options.
* **SPACE**: Toggle selection (Multi-mode) or Confirm (Single-mode).
* **ENTER**: Confirm selection(s).
* **Q**: Quit (Single-mode only).

---
