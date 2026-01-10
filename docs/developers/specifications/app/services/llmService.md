Here is the Technical Specification and Test Strategy generated from the analysis of `llmService.ts`.

---

# Technical Specification Document: LLM Service

**File:** `~/app/services/llmService.ts`
**Version:** 1.0.1
**Audited Date:** 2026-01-10

---

## Part 1: Operational & Design Specification

### 1. Component Overview

* **Purpose:**
The `LLMService` acts as a unified Gateway/Adapter to external Large Language Model providers (e.g., OpenAI, Ollama). It standardizes HTTP communication, payload formatting, error handling, and response parsing, abstracting vendor-specific API differences away from the core application logic.
* **Role in System:**
**Infrastructure/Service Layer.** It is the sole egress point for AI-related network traffic. It consumes configuration data to dynamically switch between providers without code changes.

### 2. Architecture & Patterns

* **Design Patterns:**
* **Singleton:** The module exports an instantiated object (`const llmService = new LLMService()`), ensuring a single point of configuration state across the application.
* **Adapter/Facade:** Provides a simplified `chat()` interface that wraps complex, vendor-specific HTTP REST calls.
* **Strategy (Data-Driven):** provider behavior (URLs, parsing paths, model names) is dictated by injected JSON configuration (`llmRegistry.json`) rather than hard-coded switch statements.


* **State Management:**
* **Stateful.** The service maintains `activeConfig` (the currently selected provider). This means the service is temporal; `configure()` must be called (or auto-initialized) before `chat()` can be used.


* **Complexity Assessment:**
* **Medium.** While the core logic is a REST wrapper, the inclusion of dynamic object path resolution (`resolvePath`), manual token truncation (`sanitizeContext`), and abort-signal timeout logic adds cyclomatic complexity that requires careful testing.



### 3. Dependency Graph

* **Internal Dependencies:**
* `../../config/llmRegistry.json`: Source of truth for provider configurations.
* `../types/index`: Interface definitions (`LLMRegistry`, `LLMProviderConfig`, etc.).


* **External Dependencies:**
* `fetch`: Relies on the global `fetch` API (Node 18+ or polyfill).
* `AbortController`: Native global for handling request timeouts.
* `process.env`: Direct access to environment variables for API keys and default settings.


* **Coupling Analysis:**
* **Loosely Coupled (Logic):** The service is agnostic to the specific AI provider due to the configuration-driven approach.
* **Tightly Coupled (Config):** It is heavily dependent on the specific schema of `registryData`. Changes to the JSON structure without updating the `resolvePath` logic will break the service.



### 4. Data Types & Interfaces

* **Key Interfaces:**
* `LLMMessage`: `{ role: string, content: string }`
* `LLMResponse`: `{ content: string, usage: { totalTokens: number } }`
* `LLMProviderConfig`: Structure defining URL, headers, and parsing paths.
* `ChatOptions`: `{ jsonMode?: boolean }`


* **Return Types:**
* `checkAvailability(): LLMProviderStatus[]`
* `configure(providerId: string): void`
* `sanitizeContext(input: string, maxLength: number): string`
* `generate(prompt: string, options?: ChatOptions): Promise<string>`
* `chat(messages: LLMMessage[], options?: ChatOptions): Promise<LLMResponse>`


* **Type Safety Warnings:**
* `resolvePath`: Accepts `obj: any` and returns `any`. This bypasses TypeScript safety during JSON parsing.
* `chat`: The `body` variable is typed as `any`.



### 5. Functional Logic Specification

#### `initializeDefault()` (Private)

* **Logic Flow:**
1. Reads `process.env.API_MODEL_DEFAULT`.
2. If present, attempts to call `configure()` with that ID.
3. If that fails, attempts to lowercase the ID and call `configure()` again.
4. Catches and suppresses errors if both attempts fail (allowing the app to start even if the default model is misconfigured).



#### `checkAvailability(): LLMProviderStatus[]`

* **Logic Flow:**
1. Iterates through `registry.records`.
2. Checks `process.env` for the existence of the specific `apiKeyEnv` string defined in the record.
3. Maps results to a status object indicating `available: true/false` and a reason string if missing.


* **Side Effects:** None. Reading ENV vars only.

#### `configure(providerId: string): void`

* **Logic Flow:**
1. Searches `registry.records` for a strict ID match.
2. **Error Handling:** Throws `Error: Provider '...' not found` if no match.
3. Sets `this.activeConfig` to the matched record.


* **Side Effects:** Mutates class state (`activeConfig`).

#### `sanitizeContext(input: string, maxLength: number): string`

* **Logic Flow:**
1. Checks if `input` length is less than `maxLength` (default 4000). Returns as-is if so.
2. Calculates `half` length.
3. Slices the **head** (start -> half) and the **tail** (end - half -> end).
4. Returns a string joining Head + " ... [TRUNCATED] ... " + Tail.


* **Note:** This logic preserves the beginning and end of a file (useful for code diffs) but loses the middle.

#### `generate(prompt: string, options?: ChatOptions): Promise<string>`

* **Logic Flow:**
1. Constructs a generic User message object: `[{ role: 'user', content: prompt }]`.
2. Calls `this.chat()` with this message.
3. Returns only the `content` string from the result.



#### `chat(messages: LLMMessage[], options?: ChatOptions): Promise<LLMResponse>`

* **Logic Flow:**
1. **Validation:** Throws if `activeConfig` is null.
2. **Setup:** Resolves API Key from ENV. Defaults URL to OpenAI if missing.
3. **Body Construction:** Builds JSON body including `model`, `messages`, and strict `json_object` format if `options.jsonMode` is true.
4. **Timeout:** Sets up `AbortController`. Starts a timer based on config (or defaults).
5. **Network Request:** Executes `fetch` POST.
6. **Response Handling:**
* Checks `response.ok`. Throws if non-200.
* Parses JSON.
* **Dynamic Parsing:** Uses `resolvePath` to extract content and token usage based on paths defined in `activeConfig` (e.g., `choices.0.message.content`).


7. **Error Handling:**
* Catches `AbortError` specifically to throw a clean "Timed Out" error.
* Catches parsing errors if resolved paths return undefined.


8. **Cleanup:** Clears the timeout timer.



---

## Part 2: Appendix - Testing Reference

### 1. Mocking Strategy

To test this unit in isolation, the following must be mocked:

* **Global `fetch`:**
* Must be mocked to intercept HTTP requests.
* **Behavior:** Must simulate network latency (for timeout tests) and return mock `Response` objects (both `ok: true` and `ok: false`).


* **`process.env`:**
* Must be mocked to inject `API_MODEL_DEFAULT` and specific API keys (e.g., `OPENAI_API_KEY`).


* **Registry Data (Optional):**
* While `registryData` is imported, mocking the module `../../config/llmRegistry.json` allows testing the logic with a controlled set of providers without relying on the actual config file.



### 2. Test Scenarios

| Category | Scenario | Description | Expected Outcome |
| --- | --- | --- | --- |
| **Happy Path** | **Configure & Chat** | Set env vars, call `configure('openai')`, call `chat()` with valid message. | Returns `LLMResponse` object with content and usage data. |
| **Happy Path** | **Sanitize Context** | Input string length > 4000 chars. | Returns string length ~4000 + truncation marker. Head and Tail preserved. |
| **Edge Case** | **Auto-Init Case Insensitive** | `API_MODEL_DEFAULT` is set to "OpenAI" (mixed case). | `activeConfig` is set correctly on load (via fallback logic). |
| **Edge Case** | **JSON Mode** | Call `chat` with `{ jsonMode: true }`. | Request body includes `response_format: { type: 'json_object' }`. |
| **Error State** | **Network Timeout** | `config.timeOut` is 100ms. Mock `fetch` takes 200ms. | Throws `Error: LLM Request Timed Out...` |
| **Error State** | **Provider Not Configured** | Call `chat()` without calling `configure()` or setting default env. | Throws `Error: LLM Service not configured.` |
| **Error State** | **API Failure (500)** | Mock `fetch` returns `status: 500`. | Throws `Error: API Error: 500...` |
| **Error State** | **Path Resolution Fail** | Mock `fetch` returns JSON that does not match `config.mapping` paths. | Throws `Error: Failed to parse content using path...` |
| **Error State** | **Missing ENV Key** | Config exists, but `process.env[key]` is undefined. | `checkAvailability` reports false; `chat` might fail or use 'ollama' fallback string (logic check required). |

### 3. Test Data Requirements

**A. Mock Registry Record (for configuration):**

```json
{
  "id": "test-provider",
  "label": "Test GPT",
  "model": "gpt-test",
  "baseUrl": "https://api.test.com/v1",
  "apiKeyEnv": "TEST_API_KEY",
  "timeOut": 500,
  "mapping": {
    "content": "data.result",
    "tokens": "meta.usage"
  }
}

```

**B. Mock API Response (Success - Matching above mapping):**

```json
{
  "data": {
    "result": "Hello, this is a test response."
  },
  "meta": {
    "usage": 150
  }
}

```

**C. Mock API Response (Standard OpenAI format):**

```json
{
  "choices": [
    {
      "message": {
        "role": "assistant",
        "content": "Standard response content"
      }
    }
  ],
  "usage": {
    "total_tokens": 42
  }
}

```