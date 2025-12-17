# PowerShell Logger Utility

**File:** `~/scripts/powershell/utilities/logger.ps1`  
**Version:** V1.2.0  

A standardized, robust logging utility designed for the Nuxt 4 Monorepo toolset. It handles console output with color coding, conditional debug messaging, and automatic file transcription.

---

## 🚀 Getting Started

### Import the Utility
To use the logger in your scripts, source it at the top of your file:

```powershell
$utilitiesPath = Join-Path $PSScriptRoot "utilities"
. (Join-Path $utilitiesPath "logger.ps1")
````

### Initialization

Before logging any messages, you must initialize the logger. This sets up the global state and opens the transcript file (if requested).

```powershell
Initialize-Logger -LogToFile $true -DebugMode $true -LogNamePrefix "myToolName"
```

| Parameter | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| **`LogToFile`** | `bool` | `$false` | If true, creates a log file in `../../logs/`. |
| **`DebugMode`** | `bool` | `$false` | If true, enables `Log-Debug` output. |
| **`LogNamePrefix`** | `string` | `"script"` | Prefix for the log filename (e.g., `nuxtManager_2025...`). |

-----

## 📝 Logging Functions

All standard logging functions automatically timestamp messages `[HH:mm:ss]`.

### Standard Levels

| Function | Default Color | Description |
| :--- | :--- | :--- |
| **`Log-Info "Msg"`** | Cyan | Standard informational messages. |
| **`Log-Success "Msg"`** | Green | Successful operations or completion status. |
| **`Log-Warning "Msg"`** | Yellow | Non-fatal issues or alerts. |
| **`Log-Error "Msg"`** | Red | Critical errors or exceptions. |

### Debugging

Debug messages are only displayed (and logged) if `Initialize-Logger` was called with `-DebugMode $true`.

```powershell
Log-Debug "Scanning directory: $dir" # Output: [DEBUG] Scanning directory...
```

### Custom Colors

All logging functions support a `-Color` override parameter:

```powershell
Log-Info "This is a special notice" -Color Magenta
Log-Warning "Low disk space" -Color Red
```

-----

## 🎨 Formatting & Layout (New in v1.2.0)

Use these helpers to structure your output visually without timestamps or log levels.

### `Log-Empty`

Prints a blank line to create vertical whitespace.

```powershell
Log-Empty
```

### `Log-Divider`

Prints a horizontal rule. Default length is 50 characters.

```powershell
Log-Divider                 # Prints --------------------------------------------------
Log-Divider -Char "="       # Prints ==================================================
Log-Divider -Length 20      # Prints --------------------
```

### `Log-Raw`

Prints text exactly as provided, with no timestamp prefix. Useful for ASCII art or tables.

```powershell
Log-Raw "  Option 1: Clean" -Color White
Log-Raw "  Option 2: Build" -Color White
```

-----

## 🛑 cleanup

Always ensure you stop the logger at the end of your script, usually within a `finally` block. This closes the file transcript properly.

```powershell
try {
    # Script logic...
} finally {
    Stop-Logger
}
```

-----

## 💡 Usage Example

Here is a complete example of how to implement the logger in a tool:

```powershell
# 1. Import
. "$PSScriptRoot/utilities/logger.ps1"

# 2. Initialize
Initialize-Logger -LogToFile $true -DebugMode $true -LogNamePrefix "demoTool"

try {
    Log-Info "Starting operation..."
    
    # Visual separation
    Log-Empty
    Log-Divider -Char "="
    Log-Raw "   PHASE 1: PREPARATION" -Color Yellow
    Log-Divider -Char "="
    Log-Empty

    # Work logic
    $items = @("file1", "file2")
    foreach ($item in $items) {
        Log-Info "Processing $item..."
        Log-Debug "File size: 24kb" 
    }

    Log-Success "Operation complete!"

} catch {
    Log-Error "Fatal error: $_"
} finally {
    # 3. Cleanup
    Stop-Logger
}
```
