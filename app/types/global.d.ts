/**
 * ================================================================================
 *
 * @project:    app-manager
 * @file:       ~/app/types/global.d.ts
 * @version:    1.0.1
 * @createDate: 2025 Dec 22
 * @createTime: 02:56
 * @author:     Steve R Lewis
 *
 * ================================================================================
 *
 * @description:
 * Global Type Definitions & Environment Variables.
 * This extends the NodeJS ProcessEnv interface to provide type safety for
 * environment variables used across the application.
 *
 * ================================================================================
 *
 * @notes: Revision History
 * V1.0.1, 20251226-1913
 * Added author credit.
 *
 * V1.0.0, 20251222-02:56
 * Initial creation and release of global.d.ts
 *
 * ================================================================================
 */

export {};

declare global {
	namespace NodeJS {
		interface ProcessEnv {
			// --- Core Application ---
			NODE_ENV: 'development' | 'production' | 'test';
			DEBUG?: 'true' | 'false';
			LOG_TO_FILE?: 'true' | 'false';
			CI?: 'true' | 'false';
			
			// --- Configuration ---
			/** Overrides the default config directory (used in tests) */
			APP_CONFIG_DIR?: string;
			/** Dumps parsed arguments to debug_args.json (used in e2e tests) */
			AM_DEBUG_ARGS?: 'true' | 'false';
			
			// --- AI & LLM Services ---
			/** The ID of the active provider (e.g. 'gemini', 'ollama') */
			LLM_PROVIDER?: string;
			
			// Dynamic keys mapped in llmRegistry.json
			API_KEY_CLAUDE?: string;
			API_KEY_DEEPSEEK?: string;
			API_KEY_GEMINI?: string;
			API_KEY_GROK?: string;
			API_KEY_KIMI?: string;
			API_KEY_META?: string;
			API_KEY_OLLAMA?: string;
			API_KEY_OPENROUTER?: string;
			API_KEY_HUGGINGFACE?: string;
			
			// Legacy/Fallback keys detected in app.ts
			NUXT_HUB_AI_API_KEY?: string;
			OPENAI_API_KEY?: string;
			
			// --- Git & GitHub ---
			/** Fine-grained Personal Access Token */
			GITHUB_TOKEN?: string;
			/** Default Organization for repo operations */
			GITHUB_ORG?: string;
			GITLAB_TOKEN?: string;
		}
	}
}