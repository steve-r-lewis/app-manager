# Message generator API notes;

## @description:
* Set persistent environment variables for Ollama LLM integration.
* Run these commands in PowerShell as Administrator.
* Close and reopen your terminal after execution.

---

## Select LLM provider: "ollama" (local) or "gemini" (cloud). Default: ollama
setx LLM_PROVIDER "ollama"

## Model to use (e.g., llama2, mistral, codellama). Default: llama2
setx OLLAMA_MODEL "llama2"

## Ollama server URL (change if using remote server). Default: http://localhost:11434
setx OLLAMA_BASE_URL "http://localhost:11434"

## Request timeout in seconds. Default: 120
setx OLLAMA_TIMEOUT "120"

# Quick Setup (copy-paste as Administrator):
setx LLM_PROVIDER "ollama" && setx OLLAMA_MODEL "llama2" && setx OLLAMA_BASE_URL "http://localhost:11434" && setx OLLAMA_TIMEOUT "120"

## Verify settings in a NEW terminal session:
$env:LLM_PROVIDER; $env:OLLAMA_MODEL; $env:OLLAMA_BASE_URL; $env:OLLAMA_TIMEOUT
