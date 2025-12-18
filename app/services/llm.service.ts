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
import type { LLMProviderConfig } from '../types/index.js';

class LLMService {
	private _client: GoogleGenerativeAI | null = null;
	
	private get providerConfig(): LLMProviderConfig {
		const providerId = process.env.LLM_PROVIDER || 'gemini';
		
		if (!configService.llmConfig) {
			throw new Error('LLM Registry not loaded. Has configService.init() run?');
		}
		
		const record = configService.llmConfig.records.find(r => r.id === providerId);
		
		if (!record) {
			throw new Error(`LLM Provider '${providerId}' not found in registry.`);
		}
		return record;
	}
	
	private get client(): GoogleGenerativeAI {
		if (this._client) return this._client;
		
		const config = this.providerConfig;
		const apiKey = process.env[config.apiKeyEnv];
		
		if (!apiKey) {
			throw new Error(
				`Missing API Key. Provider '${config.id}' expects environment variable '${config.apiKeyEnv}' to be set.`
			);
		}
		
		this._client = new GoogleGenerativeAI(apiKey);
		return this._client;
	}
	
	async generate(prompt: string): Promise<string> {
		try {
			const client = this.client;
			const modelName = this.providerConfig.model;
			const model = client.getGenerativeModel({ model: modelName });
			
			const result = await model.generateContent(prompt);
			return result.response.text();
			
		} catch (error) {
			consola.error('LLM Generation Failed:', error);
			throw error;
		}
	}
}

export const llm = new LLMService();