# GitHub API Utilities

**File:** `~/scripts/powershell/utilities/github.ps1`
**Version:** V1.1.0

Wrappers for the GitHub REST API to automate repository management.

---

## 📋 Prerequisites
* **Environment Variable:** `$env:GITHUB_TOKEN` must be set with a valid Personal Access Token (PAT).

---

## 🛠 Functions

### `Ensure-GitHubRepo`
Idempotent function. Checks if a repository exists; if not, creates it.
* **Parameters:** `-RepoName`, `-GitHubOrgParam`.
* **Returns:** The HTTPS clone URL of the repo.
* **Context:** Uses `$global:AccountType` ("User" or "Organization") to determine the endpoint.

```powershell
$remoteUrl = Ensure-GitHubRepo -RepoName "my-layer" -GitHubOrgParam "my-org"
```

### `Invoke-GitHubApi`

Low-level wrapper for `Invoke-RestMethod`. Handles headers, authentication, and error retries (3 attempts).

```powershell
Invoke-GitHubApi -Method GET -Url "[https://api.github.com/user](https://api.github.com/user)"
```

---
