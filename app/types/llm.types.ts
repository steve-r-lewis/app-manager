/**
 * ================================================================================
 *
 * @project:    app-manager
 * @file:       ~/app/types/llm.types.ts
 * @version:    1.0.1
 * @createDate: 2025 Dec 18
 * @createTime: 22:01
 * @author:     Steve R Lewis
 *
 * ================================================================================
 *
 * @description:
 * TODO: Create description here
 *
 * ================================================================================
 *
 * @notes: Revision History
 * V1.0.1, 20251226-1913
 * Refactored logic.
 *
 * V1.0.0, 20251218-22:01
 * Initial creation and release of llm.types.ts
 *
 * ================================================================================
 */

export interface LLMProviderConfig {
	id: string;          // e.g. "gemini", "ollama"
	apiKeyEnv: string;   // e.g. "GEMINI_API_CREDENTIALS"
	model: string;       // e.g. "gemini-1.5-flash"
	baseUrl?: string;    // Optional override for Ollama/OpenAI-compat
	type?: string;       // e.g. "ollama", "gemini"
	label?: string | null;
	timeOut?: number | null;
}

/**
 * Interface representing a registry of Large Language Model providers.
 *
 * @interface
 * @name LLMRegistry
 */

export interface LLMRegistry {
	records: LLMProviderConfig[];
}

export interface LLMProviderStatus {
	id: string;
	available: boolean;
	name: string;
	reason?: string;
}