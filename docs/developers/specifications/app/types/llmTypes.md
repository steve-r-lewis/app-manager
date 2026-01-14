# Part 1: Operational & Design Specification

## 1. Component Overview

* **Purpose:** This component serves as the **Domain Definition Layer** for the AI & Large Language Model functionality within the `app-manager` project. It strictly defines the data structures, configuration schemas, and communication contracts required to manage a "Model Registry" and execute runtime status checks for various AI providers.
* **Role in System:**
* **Type System / Data Contracts:** It acts as the foundational shared definition file. It does not contain executable logic but enforces strict typing for the Configuration Service (loading `llmRegistry.json`) and the AI Service (handling chat requests and responses).
* **Interoperability Standard:** It normalizes the interface between the internal application and external providers (e.g., OpenAI, Ollama) by defining generic adapters like `LLMProviderConfig`.



## 2. Architecture & Patterns

* **Design Patterns:**
* **Data Transfer Object (DTO):** The interfaces `LLMMessage`, `LLMResponse`, and `ChatOptions` function as DTOs, strictly defining how data is passed between the UI, the backend service, and external APIs.
* **Registry Pattern:** The `LLMRegistry` and `LLMProviderConfig` interfaces structure the application's capability to dynamically load and manage multiple AI strategies (providers) via configuration rather than hard-coding.


* **State Management:**
* **Stateless:** This component defines *types* only. It holds no state itself. However, the `LLMProviderStatus` interface is designed to represent the ephemeral runtime state (availability) of specific providers.


* **Complexity Assessment:** **Low**.
* The file contains no control flow, conditional logic, or recursion. It is a declarative definition file.



## 3. Dependency Graph

* **Internal Dependencies:**
* **None.** This file is a leaf node in the dependency graph. It imports no other files.


* **External Dependencies:**
* **None.** It relies on standard TypeScript primitives.


* **Coupling Analysis:**
* **Loose Coupling:** By isolating type definitions in a separate file, the application decouples the *shape* of the data from the *processing* of the data. This allows the `LLMService` to change its implementation without breaking the data contract, provided these interfaces remain stable.



## 4. Data Types & Interfaces

The following interfaces constitute the public API of this module.

### Configuration Interfaces

* **`LLMRegistry`**: The root structure for the `llmRegistry.json` configuration file.
* Property: `records` (Array of `LLMProviderConfig`).


* **`LLMProviderConfig`**: The core configuration object for a specific AI provider.
* **Key Fields:**
* `id` (string): Unique identifier (e.g., "ollama").
* `apiKeyEnv` (string): Link to environment variable storage.
* `baseUrl` (string | undefined): API endpoint override.
* `type` (string | undefined): Logic adapter selection (e.g., "openai-compatible").
* `timeOut` (number | null): Request timeout in milliseconds.




* **`LLMResponseMapping`**: Defines JSON paths for extracting content and usage data from non-standard API responses.
* Fields: `content` (string), `tokens` (optional string).



### Runtime Interfaces

* **`LLMServiceConfig`**: A flattened configuration object expected by the service at runtime, resolving env vars to actual values.
* **`LLMProviderStatus`**: Describes the health/reachability of a provider.
* Fields: `available` (boolean), `reason` (optional string).


* **`ChatOptions`**: Runtime flags for chat requests (e.g., `jsonMode`).

### Exchange Interfaces

* **`LLMMessage`**: Standardizes the chat history format.
* `role`: Union type `'system' | 'user' | 'assistant'`.
* `content`: String payload.


* **`LLMResponse`**: Standardized return object to the UI.

## 5. Functional Logic Specification

*Note: As this is a Type Definition (`.ts`) file containing only interfaces, there are no executable methods to analyze for logic flow. The "logic" here refers to the data contracts enforced by these types.*

### **Contract 1: Provider Configuration**

* **Signature:** `LLMProviderConfig`
* **Logic Enforced:**
* **Mandatory:** `id`, `apiKeyEnv`, `model`.
* **Optional:** `baseUrl` (allows for local LLM proxies like Ollama), `timeOut` (allows handling slow inference models), `mapping` (allows custom response parsing).


* **Side Effects:** None.
* **Error Handling:** N/A (Compile-time check).

### **Contract 2: Status Reporting**

* **Signature:** `LLMProviderStatus`
* **Logic Enforced:**
* Used to filter the list of usable models in the UI. If `available` is false, the `reason` field provides feedback (e.g., "Missing API Key").



---

# Part 2: Appendix - Testing Reference

## 1. Mocking Strategy

Since this file contains only interfaces, it does not need to be mocked. Instead, **these interfaces define the shape of the mocks** used when testing the `LLMService` or `ConfigService`.

* **Services to Mock:** None.
* **Mock Behaviour (For dependent services):**
* When testing `LLMService`, create mock objects that strictly implement `LLMProviderConfig` to simulate different provider setups (e.g., one with a timeout, one without).



## 2. Test Scenarios

These scenarios describe how to validate objects claiming to be of these types (e.g., using a schema validator like Zod in the consuming service).

| Category | Scenario | Description | Expected Outcome |
| --- | --- | --- | --- |
| **Happy Path** | **Valid Registry Load** | Load a JSON object containing all required fields for `LLMProviderConfig` (id, apiKeyEnv, model). | Typescript validation passes. |
| **Happy Path** | **Local Provider Config** | specific config with `baseUrl` set to `http://localhost:11434` and `type` set to `ollama`. | Valid `LLMProviderConfig`. |
| **Edge Case** | **Optional Fields** | Configuration object omitting `label`, `timeOut`, and `mapping`. | Valid. Interfaces mark these as optional `?`. |
| **Edge Case** | **Null Timeout** | `timeOut` set explicitly to `null`. | Valid. Type definition allows `number |
| **Error State** | **Invalid Role** | `LLMMessage` with role set to "moderator". | **TypeScript Error**. Role is restricted to `'system' | 'user' | 'assistant'`. |
| **Error State** | **Missing Critical Config** | Object missing `apiKeyEnv`. | **TypeScript Error**. Property is mandatory. |

## 3. Test Data Requirements

Use the following JSON structure to mock the `LLMRegistry` for unit tests.

```json
{
  "records": [
    {
      "id": "gemini-flash",
      "apiKeyEnv": "API_KEY_GEMINI",
      "model": "gemini-1.5-flash",
      "label": "Gemini 1.5 Flash",
      "timeOut": 5000,
      "type": "google"
    },
    {
      "id": "local-ollama",
      "apiKeyEnv": "API_KEY_OLLAMA",
      "model": "llama3",
      "baseUrl": "http://localhost:11434/v1",
      "type": "ollama",
      "mapping": {
        "content": "response",
        "tokens": "eval_count"
      }
    }
  ]
}

```

### **Standard Message Fixture (`LLMMessage[]`)**

```json
[
  {
    "role": "system",
    "content": "You are a helpful assistant."
  },
  {
    "role": "user",
    "content": "Explain quantum entanglement."
  }
]

```

### **Next Steps**

Would you like me to generate a **Zod Schema validation file** based on these interfaces to ensure runtime data integrity for `llmRegistry.json`?