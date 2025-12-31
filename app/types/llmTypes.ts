/**
 * ================================================================================
 *
 * @project:    app-manager
 * @file:       ~/app/types/llmTypes.ts
 * @version:    1.0.0
 * @createDate: 2025 Dec 31
 * @createTime: 01:07
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
 *
 * V1.0.0, 20251231-01:07
 * Initial creation and release of llmTypes.ts
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

export interface LLMRegistry {
	records: LLMProviderConfig[];
}

export interface LLMProviderStatus {
	id: string;
	available: boolean;
	name: string;
	reason?: string;
}