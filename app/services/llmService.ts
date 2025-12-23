/**
 * ================================================================================
 *
 * @project:    app-manager
 * @file:       ~/app/services/llmService.ts
 * @version:    2.0.0
 * @createDate: 2025 Dec 17
 * @createTime: 01:19
 * @author:     Steve R Lewis
 *
 * ================================================================================
 *
 * @description:
 * Service for interacting with LLM providers (Ollama, Gemini).
 * Switches implementation strategy based on the provider 'type' in the registry.
 *
 *
 * Service for interacting with LLM providers.
 * Features:
 * 1. Multi-Provider Support (Ollama via Fetch, Gemini via SDK).
 * 2. Health Checks: Verifies connectivity at startup.
 * 3. Dynamic Switching: Allows commands to select provider at runtime.
 *
 * ================================================================================
 *
 * @notes: Revision History
 *
 * V2.0.0, 20251222-21:13
 * Updated to be multi-select provider
 *
 * V1.0.0, 20251217-01:19
 * Initial creation and release of llmService.ts
 *
 * ================================================================================
 */

import { GoogleGenerativeAI } from '@google/generative-ai';
import { consola } from 'consola';
import { configService } from './configService';
import type { LLMProviderConfig } from '../types/index.js';

export interface LLMProviderStatus {
	id: string;
	available: boolean;
	name: string;
	reason?: string;
}

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
	 * Runs connection tests on all configured providers.
	 * Returns a list of available provider IDs.
	 */
	async checkAvailability(): Promise<LLMProviderStatus[]> {
		if (!configService.llmConfig) return [];
		
		const results: LLMProviderStatus[] = [];
		
		for (const record of configService.llmConfig.records) {
			// 1. Check Env Vars (Static Check)
			const apiKey = process.env[record.apiKeyEnv];
			// Ollama might not need a key, but others do
			if (record.type !== 'ollama' && !apiKey) {
				results.push({ id: record.id, name: record.model, available: false, reason: 'Missing API Key' });
				continue;
			}
			
			// 2. Ping Check (Dynamic Check)
			try {
				const isAlive = await this.pingProvider(record);
				if (isAlive) {
					this._availableProviders.add(record.id);
					results.push({ id: record.id, name: record.label || record.id, available: true });
				} else {
					results.push({ id: record.id, name: record.label || record.id, available: false, reason: 'Unreachable' });
				}
			} catch (error: any) {
				results.push({ id: record.id, name: record.label || record.id, available: false, reason: error.message });
			}
		}
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
			// Or we could try a lightweight listModels call if using REST,
			// but for SDK, let's trust the key presence + basic instantiation.
			return true;
		}
		
		return false; // Unknown type
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