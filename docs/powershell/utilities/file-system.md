# **README-FILESYSTEM.md**

# File System Utilities

**File:** `~/scripts/powershell/utilities/fileSystem.ps1`
**Version:** V1.1.0

A collection of safe, atomic, and optimized file system operations designed for the Nuxt monorepo structure.

---

## 🛠 Functions

### `Set-ContentAtomic`
Writes file content safely using a "write-temp-then-swap" strategy to prevent data corruption during crashes.
* **Parameters:** `-Path` (Destination), `-Value` (Content), `-Encoding` (Default: UTF8).
* **Note:** Handles special characters in filenames (e.g., `[id].ts`) correctly.

```powershell
Set-ContentAtomic -Path "nuxt.config.ts" -Value $newContent
```

### `Get-ProjectSourceFiles`

Scans the repository for source code, automatically excluding build artifacts (`node_modules`, `.nuxt`, `dist`, etc.).

* **Parameters:** `-RootPath`.
* **Returns:** Array of FileInfo objects (`.ts`, `.vue`, `.json`).

```powershell
$files = Get-ProjectSourceFiles -RootPath $PSScriptRoot
```

### `Get-ProjectArtifacts`

**Optimized** scanner for build artifacts. It identifies heavy folders (like `node_modules`) and stops recursion immediately to prevent logging thousands of child files.

* **Parameters:** `-RootPath`.
* **Returns:** Array of DirectoryInfo objects to be deleted.

```powershell
$artifacts = Get-ProjectArtifacts -RootPath $PSScriptRoot
```

### `Remove-FileOrFolder`

Robust deletion utility. On Windows, it uses `cmd /c rmdir` for rapid removal of deep directory structures, bypassing standard PowerShell recursion limits/slowness.

* **Parameters:** `-Path`.

```powershell
Remove-FileOrFolder -Path "./node_modules"
```
