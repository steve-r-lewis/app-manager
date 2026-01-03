/**
 * ================================================================================
 *
 * @project:    app-manager
 * @file:       ~/app/services/llmService.ts
 * @version:    1.0.1
 * @createDate: 2026 Jan 02
 * @createTime: 01:24
 * @author:     Steve R Lewis
 *
 * ================================================================================
 *
 * @description:
 * The Large Language Model (LLM) Service.
 *
 * Handles interactions with AI providers (OpenAI, Anthropic, etc.).
 * It abstracts the HTTP requests and response parsing, providing a unified
 * 'chat' interface for the rest of the application.
 *
 * Features:
 * - Dynamic Provider Switching (OpenAI supported initially)
 * - JSON Mode enforcement
 * - Error handling and Logging
 *
 * ================================================================================
 *
 * @notes: Revision History
 *
 * V1.0.0, 20260102-01:24
 * Initial creation and release of llmService.ts
 *
 * ================================================================================
 */

import { consola } from 'consola';
import registryData from '../../config/llmRegistry.json';
import type { LLMRegistry, LLMProviderConfig, LLMMessage, LLMResponse } from '../types/index';

class LLMService {
	private activeConfig: LLMProviderConfig | null = null;
	private registry: LLMRegistry = registryData as LLMRegistry;
	
	constructor() {
		this.initializeDefault();
	}
	
	private initializeDefault() {
		const defaultId = process.env.API_MODEL_DEFAULT;
		if (defaultId) this.configure(defaultId);
	}
	
	configure(providerId: string) {
		const record = this.registry.records.find(r => r.id === providerId);
		if (!record) throw new Error(`Provider '${providerId}' not found.`);
		this.activeConfig = record;
	}
	
	/**
	 * Generic Helper: Drills down into an object using a dot-notation string.
	 * Example: resolvePath(data, "choices.0.message.content")
	 */
	private resolvePath(obj: any, path: string): any {
		return path.split('.').reduce((acc, part) => {
			// Handle array indices (e.g., "0") automatically if acc is an array
			return acc && acc[part] !== undefined ? acc[part] : undefined;
		}, obj);
	}
	
	async chat(messages: LLMMessage[]): Promise<LLMResponse> {
		if (!this.activeConfig) throw new Error('LLM Service not configured.');
		
		const config = this.activeConfig;
		const apiKey = process.env[config.apiKeyEnv];
		
		// 1. Prepare Request (Standardized to OpenAI format for 99% of cases)
		const baseUrl = config.baseUrl?.replace(/\/$/, '') || 'https://api.openai.com/v1';
		// Note: You can also move "/chat/completions" to the config if endpoints vary wildly
		const endpoint = `${baseUrl}/chat/completions`;
		
		const response = await fetch(endpoint, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'Authorization': `Bearer ${apiKey || 'ollama'}`
			},
			body: JSON.stringify({
				model: config.model,
				messages: messages,
				stream: false
			})
		});
		
		if (!response.ok) {
			throw new Error(`API Error: ${response.status} ${response.statusText}`);
		}
		
		const rawData = await response.json();
		
		// 2. GENERIC PARSING LOGIC
		// Default to OpenAI paths if no mapping is provided
		const contentPath = config.mapping?.content || 'choices.0.message.content';
		const tokenPath = config.mapping?.tokens || 'usage.total_tokens';
		
		const content = this.resolvePath(rawData, contentPath);
		const tokens = this.resolvePath(rawData, tokenPath);
		
		if (!content) {
			throw new Error(`Failed to parse content from response using path: '${contentPath}'`);
		}
		
		return {
			content: content,
			usage: { totalTokens: Number(tokens) || 0 }
		};
	}
}

export const llmService = new LLMService();