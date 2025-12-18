/**
 * ================================================================================
 *
 * @project:    app-manager
 * @file:       ~/app/types/llm.types.ts
 * @version:    1.0.0
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
}

export interface LLMRegistry {
	records: LLMProviderConfig[];
}