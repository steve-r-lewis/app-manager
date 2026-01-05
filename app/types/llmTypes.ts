/**
 * ================================================================================
 *
 * @project:    app-manager
 * @file:       ~/app/types/llmTypes.ts
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
 * Initial creation and release of llmTypes.ts
 *
 * ================================================================================
 */

export interface LLMResponseMapping {
	content: string; // Path to text (e.g. "choices.0.message.content")
	tokens?: string; // Path to usage (e.g. "usage.total_tokens")
}

/**
 * Represents the configuration for a single AI Provider entry.
 * Maps directly to records in `llmRegistry.json`.
 */
export interface LLMProviderConfig {
	/** Unique internal identifier (e.g. "gemini", "ollama", "deepseek") */
	id: string;
	
	/** The name of the environment variable that holds the API key (e.g. "API_KEY_GEMINI") */
	apiKeyEnv: string;
	
	/** The specific model string to send in API requests (e.g. "gemini-1.5-flash") */
	model: string;
	
	/** Optional: Overrides the default API endpoint (crucial for Ollama or local proxies) */
	baseUrl?: string;
	
	/** The logic adapter to use (e.g. "ollama" for local, "openai-compatible" for generic REST) */
	type?: string;
	
	/** Human-readable display name for UI prompts */
	label?: string | null;
	
	/** Request timeout in milliseconds (useful for slower local models) */
	timeOut?: number | null;
	
	mapping?: LLMResponseMapping;
}

// Define the shape of the config the service expects at runtime
export interface LLMServiceConfig {
	provider: string;
	apiKey: string;
	model: string;
	baseUrl?: string;
}

/**
 * Structure of the JSON file used to store AI provider configurations.
 */
export interface LLMRegistry {
	records: LLMProviderConfig[];
}

/**
 * Represents the runtime availability status of a provider.
 * Used by the App Service to filter the list of usable models.
 */
export interface LLMProviderStatus {
	/** Matches the ID in LLMProviderConfig */
	id: string;
	
	/** True if the API key exists in env or the service is reachable */
	available: boolean;
	
	/** Display name for the selection menu */
	name: string;
	
	/** Optional: Why the provider is unavailable (e.g. "Missing API Key") */
	reason?: string;
}

/**
 * Options for the chat request.
 */
export interface ChatOptions {
	jsonMode?: boolean;
}

/**
 * Standardized response format returned to the application.
 */
export interface LLMResponse {
	content: string;
	usage?: {
		totalTokens: number;
	};
}

/**
 * Standard OpenAI-compatible message format.
 */
export interface LLMMessage {
	role: 'system' | 'user' | 'assistant';
	content: string;
}