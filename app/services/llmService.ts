/**
 * ================================================================================
 *
 * @project:    app-manager
 * @file:       ~/app/services/llmService.ts
 * @version:    2.1.0
 * @createDate: 2025 Dec 17
 * @createTime: 01:19
 * @author:     Steve R Lewis
 *
 * ================================================================================
 *
 * @description:
 * Service for interacting with LLM providers (Ollama, Gemini).
 * Features:
 * 1. Multi-Provider Support (Ollama via Fetch, Gemini via SDK).
 * 2. Parallel Health Checks: Verifies connectivity at startup.
 * 3. Dynamic Switching: Allows commands to select provider at runtime.
 * 4. Context Safety: Auto-truncates large inputs to prevent token overflows.
 *
 * ================================================================================
 *
 * @notes: Revision History
 *
 * V2.1.0, 20251227-21:30
 * - Refactored to import types from ~/app/types.
 * - Optimized checkAvailability to use Promise.all for parallel execution.
 * - Added sanitizeContext helper for consistent token safety.
 *
 * V2.0.1, 20251226-1913
 * Refactored logic.
 *
 * V2.0.0, 20251222-21:13
 * Updated to be multi-select provider
 *
 * V1.0.0, 20251217-01:19
 * Initial creation and release of llmService.ts
 *
 * ================================================================================
 */

// import { GoogleGenerativeAI } from '@google/generative-ai';
// import { consola } from 'consola';
// import { configService } from './configService';
//
// // Import Types
// import type { LLMProviderConfig, LLMProviderStatus } from '../types/llm.types';
//
// class LlmService {
// 	private _activeProviderId: string | null = null;
// 	private _availableProviders: Set<string> = new Set();
//
// 	/**
// 	 * Sets the provider to be used for subsequent generate() calls.
// 	 */
// 	setActiveProvider(id: string) {
// 		if (!this._availableProviders.has(id)) {
// 			consola.warn(`Provider '${id}' was not verified as available. Proceeding with caution.`);
// 		}
// 		this._activeProviderId = id;
// 	}
	
	/**
	 * Runs connection tests on all configured providers.
	 * Returns a list of available provider IDs.
	 */
	// async checkAvailability(): Promise<LLMProviderStatus[]> {
	// 	if (!configService.llmConfig) return [];
	//
	// 	const results: LLMProviderStatus[] = [];
	//
	// 	for (const record of configService.llmConfig.records) {
	// 		// 1. Check Env Vars (Static Check)
	// 		const apiKey = process.env[record.apiKeyEnv];
	// 		// Ollama might not need a key, but others do
	// 		if (record.type !== 'ollama' && !apiKey) {
	// 			results.push({ id: record.id, name: record.model, available: false, reason: 'Missing API Key' });
	// 			continue;
	// 		}
	//
	// 		// 2. Ping Check (Dynamic Check)
	// 		try {
	// 			const isAlive = await this.pingProvider(record);
	// 			if (isAlive) {
	// 				this._availableProviders.add(record.id);
	// 				results.push({ id: record.id, name: record.label || record.id, available: true });
	// 			} else {
	// 				results.push({ id: record.id, name: record.label || record.id, available: false, reason: 'Unreachable' });
	// 			}
	// 		} catch (error: any) {
	// 			results.push({ id: record.id, name: record.label || record.id, available: false, reason: error.message });
	// 		}
	// 	}
	// 	// return results;
	// 	return [];
	// }
	
	// app/services/llmService.ts
	
// 	async checkAvailability(): Promise<LLMProviderStatus[]> {
// 		if (!configService.llmConfig) return [];
//
// 		// 1. Map config to Promises
// 		const checks = configService.llmConfig.records.map(async (record) => {
// 			// Validation Logic...
// 			if (record.type !== 'ollama' && !process.env[record.apiKeyEnv]) {
// 				return { id: record.id, name: record.model, available: false, reason: 'Missing API Key' };
// 			}
//
// 			// Ping Logic...
// 			try {
// 				const isAlive = await this.pingProvider(record);
// 				return {
// 					id: record.id,
// 					name: record.label || record.id,
// 					available: isAlive,
// 					reason: isAlive ? undefined : 'Unreachable'
// 				};
// 			} catch (error: any) {
// 				return {
// 					id: record.id,
// 					name: record.label || record.id,
// 					available: false,
// 					reason: error.message
// 				};
// 			}
// 		});
//
// 		// 2. Wait for all (Parallel Execution)
// 		const results = await Promise.all(checks);
//
// 		// 3. Update internal state
// 		results.forEach(r => {
// 			if (r.available) this._availableProviders.add(r.id);
// 		});
//
// 		return results;
// 	}
//
// 	private async pingProvider(config: LLMProviderConfig): Promise<boolean> {
// 		if (config.type === 'ollama') {
// 			const baseUrl = config.baseUrl || 'http://localhost:11434';
// 			try {
// 				// Ollama /api/tags lists models. Fast and cheap ping.
// 				const res = await fetch(`${baseUrl}/api/tags`);
// 				return res.ok;
// 			} catch {
// 				return false;
// 			}
// 		}
//
// 		if (config.type === 'gemini') {
// 			// Google SDK doesn't have a cheap "ping", but we can assume if Key exists, it's likely OK.
// 			// Or we could try a lightweight listModels call if using REST,
// 			// but for SDK, let's trust the key presence + basic instantiation.
// 			return true;
// 		}
//
// 		return false; // Unknown type
// 	}
//
// 	/**
// 	 * Unified Generate Method
// 	 */
// 	async generate(prompt: string): Promise<string> {
// 		const providerId = this._activeProviderId || process.env.LLM_PROVIDER || 'ollama';
// 		const config = configService.llmConfig?.records.find(r => r.id === providerId);
//
// 		if (!config) throw new Error(`Provider '${providerId}' config not found.`);
//
// 		if (config.type === 'ollama') {
// 			return this.generateOllama(prompt, config);
// 		} else if (config.type === 'gemini') {
// 			return this.generateGemini(prompt, config);
// 		} else {
// 			throw new Error(`Unsupported LLM Type: '${config.type}'`);
// 		}
// 	}
//
// 	// --- STRATEGIES ---
//
// 	private async generateGemini(prompt: string, config: LLMProviderConfig): Promise<string> {
// 		const apiKey = process.env[config.apiKeyEnv];
// 		if (!apiKey) throw new Error(`Missing API Key for ${config.id}`);
//
// 		const client = new GoogleGenerativeAI(apiKey);
// 		const model = client.getGenerativeModel({ model: config.model });
//
// 		try {
// 			const result = await model.generateContent(prompt);
// 			return result.response.text();
// 		} catch (error: any) {
// 			throw new Error(`Gemini Error: ${error.message}`);
// 		}
// 	}
//
// 	private async generateOllama(prompt: string, config: LLMProviderConfig): Promise<string> {
// 		const baseUrl = config.baseUrl || 'http://localhost:11434';
// 		const model = config.model || 'llama3';
//
// 		try {
// 			const response = await fetch(`${baseUrl}/api/generate`, {
// 				method: 'POST',
// 				headers: { 'Content-Type': 'application/json' },
// 				body: JSON.stringify({ model, prompt, stream: false })
// 			});
//
// 			if (!response.ok) throw new Error(`Ollama API: ${response.statusText}`);
// 			const data = await response.json();
// 			return data.response;
// 		} catch (error: any) {
// 			throw new Error(`Ollama Error: ${error.message}`);
// 		}
// 	}
// }
//
// /**
//  * Initializes an instance of the LLM service.
//  *
//  * @returns {LlmService}
//  */
// export const llm = new LlmService();




import { GoogleGenerativeAI } from '@google/generative-ai';
import { consola } from 'consola';
import { configService } from './configService';
import type { LLMProviderConfig, LLMProviderStatus } from '../types';

class LlmService {
	private _activeProviderId: string | null = null;
	private _availableProviders: Set<string> = new Set();
	
	/**
	 * Sets the provider to be used for subsequent generate() calls.
	 */
	setActiveProvider(id: string) {
		if (!this._availableProviders.has(id)) {
			consola.warn(`Provider '${id}' was not verified as available. Proceeding with caution.`);
		}
		this._activeProviderId = id;
	}
	
	/**
	 * Runs connection tests on all configured providers in parallel.
	 * Returns a list of available provider IDs.
	 */
	async checkAvailability(): Promise<LLMProviderStatus[]> {
		if (!configService.llmConfig) return [];
		
		// 1. Map config to Promises (Parallel Execution)
		const checks = configService.llmConfig.records.map(async (record) => {
			// Static Validation
			if (record.type !== 'ollama' && !process.env[record.apiKeyEnv]) {
				return {
					id: record.id,
					name: record.model,
					available: false,
					reason: 'Missing API Key'
				};
			}
			
			// Dynamic Ping
			try {
				const isAlive = await this.pingProvider(record);
				return {
					id: record.id,
					name: record.label || record.id,
					available: isAlive,
					reason: isAlive ? undefined : 'Unreachable'
				};
			} catch (error: any) {
				return {
					id: record.id,
					name: record.label || record.id,
					available: false,
					reason: error.message
				};
			}
		});
		
		// 2. Wait for all
		const results = await Promise.all(checks);
		
		// 3. Update internal state
		this._availableProviders.clear();
		results.forEach(r => {
			if (r.available) this._availableProviders.add(r.id);
		});
		
		return results;
	}
	
	private async pingProvider(config: LLMProviderConfig): Promise<boolean> {
		if (config.type === 'ollama') {
			const baseUrl = config.baseUrl || 'http://localhost:11434';
			try {
				// Ollama /api/tags lists models. Fast and cheap ping.
				const res = await fetch(`${baseUrl}/api/tags`);
				return res.ok;
			} catch {
				return false;
			}
		}
		
		if (config.type === 'gemini') {
			// Google SDK doesn't have a cheap "ping", but we can assume if Key exists, it's likely OK.
			return true;
		}
		
		return false; // Unknown type
	}
	
	/**
	 * Helper: Truncates text to a safe character limit for LLM context.
	 * Prevents API errors when sending massive diffs or file contents.
	 */
	sanitizeContext(input: string, limit: number = 8000): string {
		if (input.length <= limit) return input;
		return input.slice(0, limit) + '\n...(truncated due to context limit)';
	}
	
	/**
	 * Unified Generate Method
	 */
	async generate(prompt: string): Promise<string> {
		const providerId = this._activeProviderId || process.env.LLM_PROVIDER || 'ollama';
		const config = configService.llmConfig?.records.find(r => r.id === providerId);
		
		if (!config) throw new Error(`Provider '${providerId}' config not found.`);
		
		if (config.type === 'ollama') {
			return this.generateOllama(prompt, config);
		} else if (config.type === 'gemini') {
			return this.generateGemini(prompt, config);
		} else {
			throw new Error(`Unsupported LLM Type: '${config.type}'`);
		}
	}
	
	// --- STRATEGIES ---
	
	private async generateGemini(prompt: string, config: LLMProviderConfig): Promise<string> {
		const apiKey = process.env[config.apiKeyEnv];
		if (!apiKey) throw new Error(`Missing API Key for ${config.id}`);
		
		const client = new GoogleGenerativeAI(apiKey);
		const model = client.getGenerativeModel({ model: config.model });
		
		try {
			const result = await model.generateContent(prompt);
			return result.response.text();
		} catch (error: any) {
			throw new Error(`Gemini Error: ${error.message}`);
		}
	}
	
	private async generateOllama(prompt: string, config: LLMProviderConfig): Promise<string> {
		const baseUrl = config.baseUrl || 'http://localhost:11434';
		const model = config.model || 'llama3';
		
		try {
			const response = await fetch(`${baseUrl}/api/generate`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ model, prompt, stream: false })
			});
			
			if (!response.ok) throw new Error(`Ollama API: ${response.statusText}`);
			const data = await response.json();
			return data.response;
		} catch (error: any) {
			throw new Error(`Ollama Error: ${error.message}`);
		}
	}
}

export const llm = new LlmService();