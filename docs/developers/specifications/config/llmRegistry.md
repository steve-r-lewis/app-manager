# Part 1: Operational & Design Specification

#### 1. Component Overview

* **Purpose:** The `llmRegistry.json` functions as the definitive configuration repository for the application's AI Service layer. It registers supported AI providers, endpoints, authentication pointers, and response parsing strategies.
* **Role in System:**
* **Data Layer / Configuration:** It acts as the static "Source of Truth" for the application.
* **Middleware Enabler:** It provides the necessary metadata (Base URLs, Model IDs) to route requests dynamically to different providers like Anthropic, DeepSeek, Google Gemini, and local Ollama instances.



#### 2. Architecture & Patterns

* **Design Patterns:**
* **Registry Pattern:** The file implements a commandRegistry where providers are indexed by unique IDs (e.g., `claude`, `deepseek`, `ollama`).
* **Strategy Pattern (Implied):** The `type` field (predominantly "openai-compatible") and the `mapping` object imply that the consuming service uses a Strategy pattern to select the correct HTTP client or response parser based on the configuration.
* **Adapter Pattern (Implied):** The `mapping` field defines how to adapt distinct vendor JSON responses (e.g., `content.0.text` for Claude vs `choices.0.message.content` for others) into a unified application format.


* **State Management:**
* **Stateless:** The file itself is static. However, it manages the *definition* of state for the application (version "2.0.0").


* **Complexity Assessment:** **Low**. The structure is flat and relational (Records array), though the `mapping` logic introduces slight complexity for the consumer.

#### 3. Dependency Graph

* **Internal Dependencies:**
* The file references a relative target path: `~/config/llmRegistry.json`.


* **External Dependencies (Implied environment):**
* **Environment Variables:** The commandRegistry relies heavily on the runtime environment to provide secrets. It maps specific configuration keys to environment variables: `API_KEY_CLAUDE`, `API_KEY_DEEPSEEK`, `API_KEY_GEMINI`, `API_KEY_GROK`, `API_KEY_KIMI`, `API_KEY_META`, `API_KEY_OLLAMA`, `API_KEY_OPENROUTER`, `API_KEY_HUGGINGFACE`.
* **Network:** Requires HTTP/HTTPS access to `api.anthropic.com`, `generativelanguage.googleapis.com`, `localhost` (for Ollama), etc..


* **Coupling Analysis:** **Loosely Coupled**. The application logic is decoupled from specific provider implementation details. Adding a new provider requires only a JSON entry, not a code change, provided the generic `openai-compatible` type is sufficient.

#### 4. Data Types & Interfaces

To enforce strict typing in the TypeScript application consuming this file, the following interfaces are derived from the schema:

```typescript
// Derived from "metadataEntity"
interface RegistryMetadata {
  description: string;
  targetFile: string;
  currentVersion: string; // e.g., "2.0.0"
  createdAt: string;      // ISO 8601 Date
  revisionHistory: Revision[];
}

// Derived from "revisionHistory"
interface Revision {
  schemaVersion: string;
  archivedAt: string;
  revisionNote: string;
}

// Derived from "mapping" object in records
interface ResponseMapping {
  content: string; // Dot-notation path to answer, e.g., "choices.0.message.content"
  tokens: string;  // Dot-notation path to usage, e.g., "usage.total_tokens"
}

// Derived from "records" array
interface LLMProviderRecord {
  id: string;              // e.g., "claude", "deepseek"
  label: string;           // Display name
  type: "openai-compatible" | string;
  model: string;           // Model identifier sent to API
  baseUrl: string;         // API Endpoint
  timeOut: number | null;  // Request timeout in ms
  apiKeyEnv: string;       // Name of the process.env key
  mapping: ResponseMapping;
}

// Root Interface
interface LLMRegistryConfig {
  metadataEntity: RegistryMetadata;
  records: LLMProviderRecord[];
}

```

#### 5. Functional Logic Specification (Data Logic)

While the file is not executable code, it dictates the following logic flows for the consuming service:

* **1. Provider Resolution Logic:**
* **Input:** Provider `id` (e.g., "ollama").
* **Logic:** The system must scan `records` to find the matching `id`.
* **Side Effects:** None.
* **Error Handling:** If `id` is missing, the system should throw a `ProviderNotFoundException`.


* **2. Authentication Resolution Logic:**
* **Input:** A selected record (e.g., `deepseek`).
* **Logic:** Extract `apiKeyEnv` value ("API_KEY_DEEPSEEK") and read `process.env["API_KEY_DEEPSEEK"]`.
* **Error Handling:** If the environment variable is undefined, the system must block the request before network transmission.


* **3. Response Parsing Logic (The `mapping` Field):**
* **Input:** Raw JSON response from the 3rd party API.
* **Logic:**
* For **Claude**: Traverse `response['content'][0]['text']`.
* For **Gemini/Others**: Traverse `response['choices'][0]['message']['content']`.


* **Implication:** The consumer must implement a deep-access utility function (e.g., `lodash.get` or a custom generic parser) utilizing these dot-notation strings.



---

### Part 2: Appendix - Testing Reference

#### 1. Mocking Strategy

* **Services to Mock:**
* **Configuration Loader:** Since this is a file on disk, mock `fs.readFileSync` or the Node.js `require` module to return this JSON structure without hitting the disk.
* **Environment Variables:** `process.env` must be mocked to populate the keys defined in `apiKeyEnv` (e.g., `API_KEY_OLLAMA`).


* **Mock Behaviour:**
* **Valid Config:** Return the exact content of `llmRegistry.json`.
* **Invalid Config:** Return JSON with missing required fields (e.g., missing `baseUrl`) to test schema validation.



#### 2. Test Scenarios

| Scenario Type | Scenario ID | Description | Expected Outcome | Source |
| --- | --- | --- | --- | --- |
| **Happy Path** | **HP-01** | Load Generic Provider (DeepSeek) | `baseUrl` parses as `https://api.deepseek.com`. `apiKeyEnv` resolves to `API_KEY_DEEPSEEK`. |  |
| **Happy Path** | **HP-02** | Load Local Provider (Ollama) | `baseUrl` is `http://localhost:11434/v1`. `timeOut` is enforced at `200`ms. |  |
| **Happy Path** | **HP-03** | Resolve Mapping (Anthropic) | `mapping.content` correctly identifies `content.0.text` path structure. |  |
| **Edge Case** | **EC-01** | Null Timeout | Verify that providers like `grok` or `gemini` with `timeOut: null` default to the system default (e.g., 30s or 60s). |  |
| **Edge Case** | **EC-02** | HTTP vs HTTPS | Verify the network client handles the protocol difference between Ollama (`http`) and others (`https`). |  |
| **Error State** | **ES-01** | Missing Env Var | Attempt to initialize `meta` provider without `API_KEY_META` in `process.env`. | Throw `ConfigurationError: Missing API Key`. |
| **Error State** | **ES-02** | Schema Version Mismatch | Load commandRegistry with `metadataEntity.currentVersion` != "2.0.0". | Warn or Throw depending on strictness. |

#### 3. Test Data Requirements

To run the tests defined above, the test suite requires a fixture object matching the schema.

**Fixture: `mockRegistry.json**`

```json
{
  "metadataEntity": {
    "currentVersion": "2.0.0"
  },
  "records": [
    {
      "id": "test-provider",
      "type": "openai-compatible",
      "apiKeyEnv": "API_KEY_TEST",
      "baseUrl": "https://test.api/v1",
      "timeOut": 5000,
      "mapping": {
        "content": "data.result",
        "tokens": "meta.usage"
      }
    }
  ]
}

```

**Fixture: `process.env` setup**

```typescript
process.env.API_KEY_CLAUDE = "sk-ant-test-key";
process.env.API_KEY_OLLAMA = "ollama"; // Often empty but key must exist
process.env.API_KEY_DEEPSEEK = "sk-deepseek-test";

```

**Next Step:** Would you like me to generate the **TypeScript Zod Schema** definition to enforce runtime validation of this JSON file?