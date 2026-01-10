Here is the comprehensive Technical Specification and Test Strategy based on the provided PowerShell utility script.

### Part 1: Operational & Design Specification

#### 1. Component Overview

* **Purpose:** `fileSystem.ps1` serves as a high-performance File I/O and filesystem scanning utility library. It is designed to handle atomic file writing, deep recursive scanning for source code, identification of build artifacts, and robust deletion of filesystem objects.
* **Role in System:** **DevOps/Infrastructure Utility**. This component resides in the `scripts/powershell/utilities` layer. It acts as a foundational helper for higher-level build, clean, or maintenance scripts within the `nuxt4-monorepo-base-app` monorepo, bridging the gap between the OS filesystem and the development workflow.

#### 2. Architecture & Patterns

* **Design Patterns:**
* **Atomic Operation:** The `Set-ContentAtomic` function implements the **Swap/Rename Pattern**. It writes to a temporary file first and only replaces the target upon success to prevent data corruption.
* **Recursion with Pruning:** `Get-ProjectArtifacts` uses a recursive closure (`Recurse-Scan`) that implements "pruning"—it stops traversing deeper once a target artifact directory (e.g., `node_modules`) is identified, optimizing performance.
* **Procedural Utility:** The file is structured as a library of standalone functions rather than a Class-based object.


* **State Management:** **Stateless**. The functions do not maintain internal state between invocations; they rely entirely on arguments passed (`$Path`, `$RootPath`) and the current state of the filesystem.
* **Complexity Assessment:** **Medium**.
* While `Set-ContentAtomic` is low complexity, `Get-ProjectSourceFiles` and `Get-ProjectArtifacts` involve nested loops, recursion, and .NET object instantiation (`System.Collections.Generic.List`). The optimization logic (using .NET Lists over PowerShell arrays) increases technical complexity but reduces memory overhead (O(1) additions).

#### 3. Dependency Graph

* **Internal Dependencies:** None. This is a standalone script.
* **External Dependencies:**
* **.NET Framework Core:** Heavily relies on `System.IO.FileInfo`, `System.IO.FileSystemInfo`, and `System.Collections.Generic.List`.
* **PowerShell Host:** Requires a host capable of executing standard cmdlets (`Get-ChildItem`, `Set-Content`, `Remove-Item`).
* **Windows Command Processor (Conditional):** Depends on `cmd /c rmdir` when running on Windows for robust folder deletion.

* **Coupling Analysis:** **Loosely Coupled**. The functions accept generic string paths and standard arrays. They are not tied to specific Nuxt configurations via hardcoded paths, but rather via default parameter values which can be overridden.

#### 4. Data Types & Interfaces

**Note:** PowerShell is dynamically typed, but the author has enforced strong typing via parameter attributes.

* **Key Interfaces (Implied via .NET):**
* `System.IO.FileInfo`: Represents a file returned by scan functions.
* `System.IO.FileSystemInfo`: Represents both files and directories.

* **Method Signatures & Return Types:**

| Function Name | Return Type | Warning |
| --- | --- | --- |
| `Set-ContentAtomic` | `[bool]` (True/False) | Explicitly typed. |
| `Get-ProjectSourceFiles` | `System.Collections.Generic.List[System.IO.FileInfo]` | **High Performance Type**. Not a standard array. |
| `Get-ProjectArtifacts` | `System.Collections.Generic.List[System.IO.FileSystemInfo]` | **High Performance Type**. |
| `Remove-FileOrFolder` | `[bool]` (True/False) | Explicitly typed. |

#### 5. Functional Logic Specification

**5.1 Function: `Set-ContentAtomic**`

* **Signature:** `Set-ContentAtomic([string]$Path, [string]$Value, [string]$Encoding)`
* **Logic Flow:**
1. Define a temporary path `$Path.tmp`.
2. **Try:** Write `$Value` to the temp file using `Set-Content`.
3. If successful, use `Move-Item` to overwrite the destination `$Path` with the temp file.
4. Return `$true`.

* **Error Handling:**
* **Catch:** If writing or moving fails, write an Error to the stream.
* Cleanup: Delete the `.tmp` file if it exists.
* Re-throw the exception to the caller.

**5.2 Function: `Get-ProjectSourceFiles**`

* **Signature:** `Get-ProjectSourceFiles([string]$RootPath, ...)`
* **Logic Flow:**
1. Instantiate a .NET Generic List for `FileInfo` objects.
2. **Pass 1 (Root):** Scan `$RootPath` for files. If extension matches (e.g., `.ts`, `.vue`) or is `package.json`, add to list.
3. **Pass 2 (Subdirs):** Iterate through `$TargetDirs` (default: app, layers, server, scripts).
4. Check if subdirectory exists.
5. Recursively scan subdirectory.
6. **Fast Exclusion:** Check if the file path contains excluded directories (e.g., `node_modules`). If yes, skip.
7. Match file extension or name; add to list if matched.

* **Side Effects:** Read-only access to disk.

**5.3 Function: `Get-ProjectArtifacts**`

* **Signature:** `Get-ProjectArtifacts([string]$RootPath, ...)`
* **Logic Flow:**
1. Instantiate a .NET Generic List for `FileSystemInfo` objects.
2. Define inner function `Recurse-Scan`.
3. **Recursion Logic:**
* Get items in current path.
* If **Directory**:
* If name matches `$ArtifactDirs` (e.g., `.nuxt`): Add to results, **DO NOT recurse** (Pruning optimization).
* Else if name is `.cache` inside `node_modules`: Add to results.
* Else: Recurse deeper (skipping `.git`).

* If **File**:
* If name matches `$ArtifactFiles` (e.g., `package-lock.json`): Add to results.

* **Side Effects:** Read-only access to disk.

**5.4 Function: `Remove-FileOrFolder**`

* **Signature:** `Remove-FileOrFolder([string]$Path)`
* **Logic Flow:**
1. Check if `$Path` exists.
2. **Windows Optimization:** If running on Windows (`$IsWindows`) and item is a container (folder), execute `cmd /c "rmdir /s /q ..."`. This handles deep paths better than standard PowerShell.
3. **Standard:** Otherwise, use `Remove-Item -Recurse -Force`.
4. Return `$true` if successful, `$false` if path didn't exist.

---

### Part 2: Appendix - Testing Reference

#### 1. Mocking Strategy

Since this is a PowerShell script interacting with the OS, we must mock the `Microsoft.PowerShell.Management` cmdlets.

* **Cmdlets to Mock:**
* `Set-Content`: Mock to verify content is written to the `.tmp` path, not the final path.
* `Move-Item`: Mock to verify the atomic swap occurs.
* `Get-ChildItem`: **CRITICAL**. Must return mocked `.NET FileInfo/DirectoryInfo` objects to simulate file trees without creating them on disk.
* `Test-Path`: Mock to simulate existence of directories (e.g., returning `$true` for `app`, `$false` for `layers`).
* `Remove-Item`: Mock to ensure deletion logic is called.
* `Get-Item`: Used in `Remove-FileOrFolder` to determine `PSIsContainer`.


* **Mock Behavior Examples:**
* *For Atomic Write Failure:* Mock `Set-Content` to throw a `System.IO.IOException`. Verify `Remove-Item` is called on the `.tmp` file.
* *For Windows Delete:* Mock `$IsWindows` variable to `$true`. Verify `cmd` is invoked.

#### 2. Test Scenarios

| Category | ID | Scenario | Expected Outcome |
| --- | --- | --- | --- |
| **Happy Path** | HP-01 | `Set-ContentAtomic` writes valid file | Returns `$true`, file exists at target path. |
|  | HP-02 | `Get-ProjectSourceFiles` finds `.ts` in `app/` | List contains the `.ts` file info object. |
|  | HP-03 | `Get-ProjectArtifacts` identifies `node_modules` | List contains `node_modules` folder; contents of `node_modules` are NOT scanned individually. |
|  | HP-04 | `Remove-FileOrFolder` deletes folder | Returns `$true`. |
| **Edge Cases** | EC-01 | `Get-ProjectSourceFiles` scan on empty root | Returns empty list (Count 0). |
|  | EC-02 | `Get-ProjectSourceFiles` with nested `node_modules` in `src` | Should strictly exclude the nested `node_modules` content. |
|  | EC-03 | `Remove-FileOrFolder` on non-existent path | Returns `$false`. |
| **Error States** | ES-01 | `Set-ContentAtomic` permission denied on `.tmp` | Exception thrown, `.tmp` file is cleaned up. |
|  | ES-02 | `Remove-FileOrFolder` fails to delete (locked) | Exceptions suppressed via `SilentlyContinue` (Verify robust wrapper handles this or if it bubbles). |

#### 3. Test Data Requirements

To test the recursive scanners without touching the disk, construct a **Virtual File Tree Object** structure to return from `Get-ChildItem` mocks.

**JSON Representation of Test Data Structure:**

```json
{
  "root": {
    "files": ["package.json", "README.md"],
    "directories": {
      "app": {
        "files": ["app.vue", "router.ts"],
        "directories": {}
      },
      "node_modules": {
        "files": ["dependency.js"],
        "directories": {
           ".cache": { "files": ["cache-file"] }
        }
      },
      ".nuxt": {
        "files": ["nuxt.d.ts"],
        "directories": {}
      }
    }
  }
}

```

**Implementation Note:**
When mocking `Get-ChildItem`, you must return objects that possess `.Name`, `.Extension`, `.FullName`, and `.PSIsContainer` properties to satisfy the script's logic.