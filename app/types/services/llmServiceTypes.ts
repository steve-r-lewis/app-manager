/**
 * ================================================================================
 *
 * @project:    app-manager
 * @file:       ~/app/types/llmServiceTypes.ts
 * @version:    1.0.1
 * @createDate: 2025 Dec 31
 * @createTime: 01:07
 * @author:     Steve R Lewis
 *
 * ================================================================================
 *
 * @description:
 * Type definitions for the AI & Large Language Model Domain.
 *
 * These interfaces define the structure for the "Model Registry" (configuration)
 * and the runtime status checks used to determine which AI providers are
 * available for a given session.
 *
 * ================================================================================
 *
 * @notes: Revision History
 *
 * V1.1.0, 20260102-01:07
 * Added support for custom API endpoints and timeouts.
 *
 * V1.0.1, 20251231-01:43
 * Refactored comments and ensured consistent property documentation.
 *
 * V1.0.0, 20251231-01:07
 * Initial creation and release of llmServiceTypes.ts
 *
 * ================================================================================
 */

export interface LLMResponseMapping {
	readonly content: string; // Path to text (e.g. "choices.0.message.content")
	readonly tokens?: string; // Path to usage (e.g. "usage.total_tokens")
}

/**
 * Represents the configuration for a single AI Provider entry.
 * Maps directly to records in `llmRegistry.json`.
 */
export interface LLMProviderConfig {
	/** Unique internal identifier (e.g. "gemini", "ollama", "deepseek") */
	readonly id: string;
	/** The name of the environment variable that holds the API key (e.g. "API_KEY_GEMINI") */
	readonly apiKeyEnv: string;
	/** The specific model string to send in API requests (e.g. "gemini-1.5-flash") */
	readonly model: string;
	/** Optional: Overrides the default API endpoint (crucial for Ollama or local proxies) */
	readonly baseUrl?: string;
	/** The logic adapter to use (e.g. "ollama" for local, "openai-compatible" for generic REST) */
	readonly type?: string;
	/** Human-readable display name for UI prompts */
	readonly label?: string | null;
	/** Request timeout in milliseconds (useful for slower local models) */
	readonly timeOut?: number | null;
	readonly mapping?: LLMResponseMapping;
}

// Define the shape of the config the service expects at runtime
export interface LLMServiceConfig {
	readonly provider: string;
	readonly apiKey: string;
	readonly model: string;
	readonly baseUrl?: string;
}

/**
 * Structure of the JSON file used to store AI provider configurations.
 */
export interface LLMRegistry {
	readonly records: LLMProviderConfig[];
}


/**
 * Represents the runtime availability status of a provider.
 * Used by the App Service to filter the list of usable models.
 */
export interface LLMProviderStatus {
	/** Matches the ID in LLMProviderConfig */
	readonly id: string;
	/** True if the API key exists in env or the service is reachable */
	readonly available: boolean;
	/** Display name for the selection menu */
	readonly name: string;
	/** Optional: Why the provider is unavailable (e.g. "Missing API Key") */
	readonly reason?: string;
}

/**
 * Options for the chat request.
 */
export interface ChatOptions {
	readonly jsonMode?: boolean;
}


/**
 * Standardized response format returned to the application.
 */
export interface LLMResponse {
	readonly content: string;
	readonly usage?: {
		readonly totalTokens: number;
	};
}

/**
 * Standard OpenAI-compatible message format.
 */
export interface LLMMessage {
	readonly role: 'system' | 'user' | 'assistant';
	readonly content: string;
}

/**
 * The core architectural contract for the AI Service.
 */
export interface ILLMService {
	checkAvailability(): LLMProviderStatus[];
	configure(providerId: string): void;
	sanitizeContext(input: string, maxLength?: number): string;
	generate(prompt: string, options?: ChatOptions): Promise<string>;
	chat(messages: LLMMessage[], options?: ChatOptions): Promise<LLMResponse>;
}