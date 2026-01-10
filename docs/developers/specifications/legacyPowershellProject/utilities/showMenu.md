Based on the analysis of the provided `showMenu.ps1` file, here is the comprehensive Technical Specification and Test Strategy.

### Part 1: Operational & Design Specification

#### 1. Component Overview

* **Purpose:** The `Show-Menu` function is a PowerShell utility designed to render an interactive, text-based user interface (TUI) within the console. It allows users to navigate a list of options using keyboard arrows and make selections.
* **Role in System:** This script functions as a **DevOps Utility** or **CLI Interaction Layer**. It is likely used by automation scripts within the `nuxt4-monorepo-base-app` to query developers for configuration choices or actions during setup, build, or deployment processes.

#### 2. Architecture & Patterns

* **Design Patterns:**
* **Game Loop / Render Loop:** The component utilizes an infinite `while ($true)` loop that continuously clears the screen, renders the current state (View), and waits for blocking user input (Controller).
* **Procedural Utility:** The code is structured as a standalone function rather than a class-based object, typical for PowerShell scripting modules.


* **State Management:**
* **Stateful:** The function maintains internal state for the UI cursor (`$selectedIndex`) and the selection status of items in multi-select mode (`$checkedState`).


* **Complexity Assessment:** **Medium**.
* While the logic is linear, the direct manipulation of the Console UI (`RawUI`, `CursorVisible`, `Clear-Host`) and manual index wrapping logic introduces complexity regarding cross-platform terminal compatibility and ghosting artifacts.



#### 3. Dependency Graph

* **Internal Dependencies:**
* The script appears to be self-contained within the function `Show-Menu`.


* **External Dependencies:**
* **PowerShell Host UI (`$host.UI.RawUI`):** Used to capture keystrokes without echoing them to the console (`ReadKey`).
* **System.Console:** Used to manipulate cursor visibility (`[Console]::CursorVisible`).


* **Coupling Analysis:**
* **Tightly Coupled to Interactive Host:** The reliance on `ReadKey` and `Clear-Host` means this function will fail or behave unpredictably in non-interactive environments (e.g., CI/CD pipelines without a TTY) or ISEs that do not support RawUI fully.



#### 4. Data Types & Interfaces

* **Key Parameters (Inputs):**
* `$Title` (`[string]`): Header text for the menu.
* `$Options` (`[array]`): List of strings to display as selectable items.
* `$MultiSelect` (`[bool]`, default `$false`): Toggles between single-item return and array return.
* `$ClearScreen` (`[bool]`, default `$true`): Controls screen refreshing.


* **Return Types:**
* **Single Select Mode:** Returns a `System.String` (the selected option text) or string "Quit".
* **Multi-Select Mode:** Returns a `System.Array` (collection of selected strings).
* **Warning:** The return type is polymorphic (String vs. Array) based on the `$MultiSelect` flag. Strict typing consumers must check the type of the returned object.



#### 5. Functional Logic Specification

**Method:** `Show-Menu`

* **Signature:**
`Show-Menu -Title <string> -Options <string[]> [-MultiSelect <bool>] [-ClearScreen <bool>]`
* **Logic Flow:**
1. **Initialization:**
* Sets `$selectedIndex` to 0.
* Initializes `$checkedState` array with `false` values matching the length of `$Options`.
* Attempts to hide the console cursor to improve UI aesthetics.


2. **Render Loop (`while ($true)`):**
* **Clear:** Executes `Clear-Host` to wipe the terminal.
* **Draw Header:** Outputs the title and instruction footer using `Write-Host` with specific colors (Cyan/White).
* **Draw Options:** Iterates through `$Options`.
* Calculates prefix: `> ` for the current cursor position, `      ` otherwise.
* Calculates checkbox: `[x] ` or `[ ] ` if `$MultiSelect` is active.
* **Highlighting:** If the item is the current selection, renders with `Black` text on `Cyan` background. Otherwise, renders `White` (or `Green` if checked).




3. **Input Handling:**
* Waits for a key press using `$host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")`.


4. **Key Processing:**
* **UP (38):** Decrements `$selectedIndex`. If index , wraps to last index ().
* **DOWN (40):** Increments `$selectedIndex`. If index , wraps to 0.
* **SPACE (32):**
* *MultiSelect:* Toggles the boolean at `$checkedState[$selectedIndex]`.
* *Single:* Restores cursor and returns `$Options[$selectedIndex]`.


* **ENTER (13):**
* Restores cursor.
* *MultiSelect:* Filters `$Options` based on `$checkedState` and returns an array of selected items.
* *Single:* Returns `$Options[$selectedIndex]`.


* **Q (81):**
* *Single Only:* Restores cursor and returns "Quit".






* **Side Effects:**
* Modifies Console Cursor Visibility.
* Clears the entire Console Buffer (destructive to previous terminal output).


* **Error Handling:**
* Input handling is wrapped in implicit shell error handling.
* `try...catch` blocks are used specifically around `[Console]::CursorVisible` modification to prevent crashes in environments where the console handle is unavailable.



---

### Part 2: Appendix - Testing Reference

#### 1. Mocking Strategy

To unit test this script using a framework like **Pester**, specific mocks are required because the script relies on interactive hardware interrupts.

* **`$host.UI.RawUI.ReadKey`:**
* **Challenge:** The script halts execution waiting for user input.
* **Mock Behavior:** Must simulate a sequence of `KeyInfo` objects.
* **Scenario Example:** To test selecting the second item:
1. Mock first call returns `{ VirtualKeyCode: 40 }` (Down).
2. Mock second call returns `{ VirtualKeyCode: 13 }` (Enter).




* **`Clear-Host`:**
* **Mock Behavior:** Should be mocked to perform no-op or log a call count to verify the screen is refreshing.


* **`Write-Host`:**
* **Mock Behavior:** Mock to capture output strings to verify correct rendering of menu items and "selected" state formatting.



#### 2. Test Scenarios

| Scenario ID | Category | Description | Inputs | Expected Outcome |
| --- | --- | --- | --- | --- |
| **TS-01** | Happy Path | Single select, default choice | Title: "Test", Options: `["A","B"]` | Function returns "A" immediately upon `Enter`. |
| **TS-02** | Happy Path | Navigation and selection | Title: "Test", Options: `["A","B"]` | User presses `Down`, `Enter`. Returns "B". |
| **TS-03** | Happy Path | Multi-select toggle | Title: "Test", Options: `["A","B"]`, Multi: `$true` | User presses `Space` (on A), `Down`, `Space` (on B), `Enter`. Returns `["A", "B"]`. |
| **TS-04** | Edge Case | Navigation Wrapping (Top) | Title: "Test", Options: `["A","B"]` | User presses `Up`. Cursor moves to "B". |
| **TS-05** | Edge Case | Navigation Wrapping (Bottom) | Title: "Test", Options: `["A","B"]` | User presses `Down` (to B), `Down`. Cursor moves to "A". |
| **TS-06** | Edge Case | Quit Command | Title: "Test", Options: `["A","B"]`, Multi: `$false` | User presses `Q`. Returns string "Quit". |
| **TS-07** | Error State | Non-Interactive Host | Environment: Headless CI/CD | `[Console]::CursorVisible` throws exception (caught silently). |

#### 3. Test Data Requirements

For automated Pester tests, the following data structures are required to simulate the parameters:

**Basic Options Array:**

```powershell
$testOptions = @("Deploy to Dev", "Deploy to Stage", "Deploy to Prod")

```

**Key Simulation Object (Pester Mock):**

```powershell
# Simulating the Enter Key object structure
$EnterKey = [pscustomobject]@{
    VirtualKeyCode = 13
    Character      = [char]13
    ControlKeyState= 0
    KeyDown        = $true
}

# Simulating the Down Arrow object structure
$DownKey = [pscustomobject]@{
    VirtualKeyCode = 40
    Character      = 0
    ControlKeyState= 0
    KeyDown        = $true
}

```

**Next Step:** Would you like me to generate a **Pester test file** (`showMenu.Tests.ps1`) implementing the mocking strategy described above to verify this script?