/**
 * ================================================================================
 *
 * @project:    app-manager
 * @file:       ~/app/services/llm.service.ts
 * @version:    1.0.0
 * @createDate: 2025 Dec 17
 * @createTime: 01:19
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
 * V1.0.0, 20251217-01:19
 * Initial creation and release of llm.service.ts
 *
 * ================================================================================
 */

import { GoogleGenerativeAI } from '@google/generative-ai';
import { consola } from 'consola';
import { configService } from './config.service.js';

class LLMService {
	private _client: GoogleGenerativeAI | null = null;
	
	/**
	 * Retrieves the configuration record for the active provider.
	 * Defaults to 'gemini' if LLM_PROVIDER is not set.
	 */
	private get providerConfig() {
		const providerId = process.env.LLM_PROVIDER || 'gemini';
		
		// Ensure registry is loaded (safe to call multiple times)
		if (!configService.llmConfig) {
			throw new Error('LLM Registry not loaded. Has configService.init() run?');
		}
		
		const record = configService.llmConfig.records.find(r => r.id === providerId);
		
		if (!record) {
			throw new Error(`LLM Provider '${providerId}' not found in registry.`);
		}
		return record;
	}
	
	/**
	 * Lazy-loads the Gemini Client.
	 * Only throws errors when we actually try to USE the AI, not on app start.
	 */
	private get client(): GoogleGenerativeAI {
		if (this._client) return this._client;
		
		const config = this.providerConfig;
		
		// Dynamic Key Lookup:
		// 1. Registry says: apiKeyEnv = "GEMINI_API_CREDENTIALS"
		// 2. We look up process.env["GEMINI_API_CREDENTIALS"]
		const apiKey = process.env[config.apiKeyEnv];
		
		if (!apiKey) {
			throw new Error(
				`Missing API Key. Provider '${config.id}' expects environment variable '${config.apiKeyEnv}' to be set.`
			);
		}
		
		this._client = new GoogleGenerativeAI(apiKey);
		return this._client;
	}
	
	/**
	 * Generates content using the configured model.
	 */
	async generate(prompt: string): Promise<string> {
		try {
			// 1. Get Client & Config
			const client = this.client;
			const modelName = this.providerConfig.model;
			
			// 2. Initialize Model
			const model = client.getGenerativeModel({ model: modelName });
			
			// 3. Generate
			const result = await model.generateContent(prompt);
			const response = result.response;
			
			return response.text();
			
		} catch (error) {
			consola.error('LLM Generation Failed:', error);
			throw error;
		}
	}
}

export const llm = new LLMService();