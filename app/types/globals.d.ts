/**
 * ================================================================================
 *
 * @project:    app-manager
 * @file:       ~/app/types/globals.d.ts
 * @version:    1.0.0
 * @createDate: 2025 Dec 31
 * @createTime: 01:13
 * @author:     Steve R Lewis
 *
 * ================================================================================
 *
 * @description:
 * Global Type Definitions & Environment Variables.
 *
 * This file uses TypeScript's Declaration Merging to extend the global
 * NodeJS.ProcessEnv interface. It provides strict typing for all environment
 * variables used within the application, ensuring type safety for:
 *
 * - Core Application Flags (CI, Debug, Logging)
 * - AI Service Credentials (API Keys, Providers)
 * - Git & GitHub Authentication Tokens
 *
 * ================================================================================
 *
 * @notes: Revision History
 *
 * V1.0.0, 20251231-01:13
 * Initial creation and release of globals.d.ts
 *
 * ================================================================================
 */

export {};

declare global {
	namespace NodeJS {
		interface ProcessEnv {
			// --- Core Application ---
			/** The execution environment mode */
			NODE_ENV: 'development' | 'production' | 'test';
			/** Enable verbose debug logging */
			DEBUG?: 'true' | 'false';
			/** Write logs to the file system instead of/in addition to stdout */
			LOG_TO_FILE?: 'true' | 'false';
			/** Indicates if running in a Continuous Integration environment */
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
			/** Fine-grained Personal Access Token for GitHub API access */
			GITHUB_TOKEN?: string;
			/** Default Organization for repo operations */
			GITHUB_ORG?: string;
			/** Personal Access Token for GitLab operations */
			GITLAB_TOKEN?: string;
		}
	}
}
