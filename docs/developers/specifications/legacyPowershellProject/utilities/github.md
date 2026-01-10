Based on the analysis of the provided file `github.ps1`, here is the Technical Specification Document and Test Strategy Appendix.

---

# Part 1: Operational & Design Specification

## 1. Component Overview

* **Purpose:** This component serves as a reusable utility library for interacting with the GitHub REST API. Its primary function is to handle authentication, API invocation with retry logic, and repository lifecycle management (specifically ensuring a repository exists).
* **Role in System:**
* **Infrastructure Utility:** It acts as an infrastructure automation layer, likely used within CI/CD pipelines or setup scripts to bootstrap the development environment.
* **API Wrapper:** It abstracts the complexity of `Invoke-RestMethod` and GitHub authentication headers.



## 2. Architecture & Patterns

* **Design Patterns:**
* **Facade Pattern:** `Invoke-GitHubApi` provides a simplified interface to the complex `Invoke-RestMethod` cmdlet, encapsulating header construction and error handling.
* **Retry Pattern:** Implemented within `Invoke-GitHubApi` to handle transient network failures with an exponential backoff strategy.
* **Guard Clause:** Used strictly for environment validation (checking `$env:GITHUB_TOKEN`).


* **State Management:**
* **Stateless:** The functions themselves do not maintain internal state between executions. However, they rely on **Global State** via `$global:DebugMode` and `$global:AccountType`.


* **Complexity Assessment:** **Medium**.
* While the logic is linear, the coupling with global scope variables and the conditional retry logic (handling 404s differently than other errors) adds control flow complexity.



## 3. Dependency Graph

### Internal Dependencies (Implicit)

These functions are called within the script but are not defined in the provided file, indicating a dependency on a parent scope or module:

* `Log-Error`
* `Log-Debug`
* `Log-Warning`
* `Log-Info`
* `Log-Success`
* `$global:DebugMode` (Boolean flag)
* `$global:AccountType` (String: "Organization" or "User")

### External Dependencies

* **Runtime:** PowerShell Core (implied by syntax).
* **Environment:** `$env:GITHUB_TOKEN` (Mandatory).
* **Network:** `Invoke-RestMethod` (Standard PowerShell Cmdlet).
* **Service:** GitHub REST API (`api.github.com`).

### Coupling Analysis

* **High Coupling:** The script is tightly coupled to the custom logging implementation and specific global variables (`AccountType`). This reduces portability unless the logging module is also present.

## 4. Data Types & Interfaces

### Key Interfaces (Implied)

* **Repository Creation Payload (Hashtable):**
```powershell
@{
    name = [string]
    private = [bool]
    visibility = "private"
}

```



### Return Types

* **`Invoke-GitHubApi`**: returns `PSCustomObject` (The parsed JSON response from GitHub).
* **`Ensure-GitHubRepo`**: returns `[string]` (The HTTPS Git URL, e.g., `https://github.com/Org/Repo.git`).

## 5. Functional Logic Specification

### Function: `Invoke-GitHubApi`

* **Method Signature:**
`Invoke-GitHubApi -Method [string] -Url [string] -Body [hashtable] : [PSCustomObject]`
* **Logic Flow:**
1. **Validation:** Checks if `$env:GITHUB_TOKEN` exists. Throws "Missing GITHUB_TOKEN" if false.
2. **Header Construction:** Creates a hashtable with Authorization (Bearer), User-Agent, and Accept headers.
3. **Retry Loop:** Enters a loop allowing up to 3 attempts.
* **Execution:** Converts `$Body` to JSON (if present) and executes `Invoke-RestMethod`.
* **Success Logging:** If `$global:DebugMode` is true, logs a summary (ID and HTML URL), explicitly avoiding full JSON dumps to reduce noise.
* **Return:** Returns the API response immediately on success.


4. **Error Handling (Catch Block):**
* **404 Optimization:** If the error message contains "404" or "Not Found", the loop is broken immediately, and the error is re-thrown. This optimization prevents unnecessary retries for checks like "Does repo exist?".
* **Transient Errors:** For other errors, calculates backoff sleep: `Start-Sleep -Seconds (2 * $attempt)`.
* **Failure:** If the 3rd attempt fails, the error is re-thrown.





### Function: `Ensure-GitHubRepo`

* **Method Signature:**
`Ensure-GitHubRepo -RepoName [string] -GitHubOrgParam [string] : [string]`
* **Logic Flow:**
1. **Check Existence:** Constructs the GitHub API URL (`.../repos/$GitHubOrgParam/$RepoName`) and calls `Invoke-GitHubApi` with `GET`.
* **If Found:** Logs a warning that the repo exists and returns the Git URL.


2. **Handle Missing Repo:** If the GET call fails (catch block):
* Logs information that the repo is being created.
* Constructs the payload (`private = $true`).


3. **Determine Scope:** Checks `$global:AccountType`.
* **Organization:** Targets `https://api.github.com/orgs/$GitHubOrgLocal/repos`.
* **User:** Targets `https://api.github.com/user/repos`.


4. **Creation:** Calls `Invoke-GitHubApi` with `POST`.
* On success: Logs success message.
* On failure: Logs error and throws exception.


5. **Return:** Returns the constructed HTTPS Git URL.



---

# Part 2: Appendix - Testing Reference

## 1. Mocking Strategy

To achieve unit isolation, the following must be mocked (specifically using a framework like Pester):

* **System Cmdlets:**
* `Invoke-RestMethod`: Must be mocked to return different HTTP status codes and JSON payloads.
* `Start-Sleep`: Mock to prevent actual delays during test execution.


* **Environment:**
* `$env:GITHUB_TOKEN`: Mock with a dummy string "test-token".


* **Global Variables:**
* `$global:DebugMode`: Toggle between `$true` and `$false`.
* `$global:AccountType`: Toggle between "Organization" and "User".


* **Logging Functions:**
* `Log-Error`, `Log-Debug`, etc., must be mocked to verify they are called with the expected messages, or stubbed to prevent runtime errors.



## 2. Test Scenarios

| Category | Scenario Name | Description | Expected Outcome |
| --- | --- | --- | --- |
| **Happy Path** | `Invoke-GitHubApi` Success | Call API with valid inputs. | Returns Object. Logs Debug summary if enabled. |
| **Happy Path** | `Ensure-GitHubRepo` Exists | Call Ensure for existing repo. | Returns Git URL. Logs "already exists". |
| **Happy Path** | `Ensure-GitHubRepo` Create Org | Call Ensure for missing repo (`AccountType='Organization'`). | Calls POST to `/orgs/...`. Returns Git URL. |
| **Happy Path** | `Ensure-GitHubRepo` Create User | Call Ensure for missing repo (`AccountType='User'`). | Calls POST to `/user/...`. Returns Git URL. |
| **Edge Case** | Missing Token | `$env:GITHUB_TOKEN` is null/empty. | Throws "Missing GITHUB_TOKEN" immediately. |
| **Error State** | API 404 (Not Found) | `Invoke-GitHubApi` receives 404. | Throws error immediately (No Retry). |
| **Error State** | API 500 (Transient) | `Invoke-GitHubApi` receives 500. | Retries 3 times (Sleeps 2s, 4s). Throws on 3rd fail. |
| **Error State** | Creation Failure | `Ensure-GitHubRepo` POST fails. | Logs Error. Re-throws exception. |

## 3. Test Data Requirements

**Scenario: Repo Exists Response (Mock `Invoke-RestMethod` Output)**

```json
{
    "id": 123456,
    "name": "nuxt4-monorepo-base-app",
    "html_url": "https://github.com/MyOrg/nuxt4-monorepo-base-app",
    "private": true
}

```

**Scenario: Repo Creation Payload (Expected Input Validation)**

```json
{
    "name": "test-repo",
    "private": true,
    "visibility": "private"
}

```

**Scenario: 404 Error Object (Mock Exception)**

```powershell
# In PowerShell Pester mock:
throw [System.Net.WebException]::new("The remote server returned an error: (404) Not Found.")

```

**Scenario: Generic Error Object (Mock Exception)**

```powershell
# In PowerShell Pester mock:
throw [System.Net.WebException]::new("The remote server returned an error: (500) Internal Server Error.")

```

### Next Steps

Would you like me to generate a **Pester Test Script** (.ps1) based on this strategy to verify the `github.ps1` file?