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
 * V1.1.0, 20260102-01:24
 * Updated LLM listing and timeout.
 *
 * V1.0.0, 20260102-01:24
 * Initial creation and release of llmService.ts
 *
 * ================================================================================
 */

import registryData from '../../config/llmRegistry.json';
import { logger } from './loggerService.js';
import type {
	LLMRegistry,
	LLMProviderConfig,
	LLMMessage,
	LLMResponse,
	LLMProviderStatus,
	ChatOptions,
	ILLMService
} from '../types/index.js';

class LLMService implements ILLMService {
	
	private activeConfig: LLMProviderConfig | null = null;
	private registry: LLMRegistry = registryData as LLMRegistry;
	
	constructor() {
		this.initializeDefault();
	}
	
	private initializeDefault() {
		const defaultId = process.env.API_MODEL_DEFAULT;
		if (defaultId) {
			try {
				this.configure(defaultId);
			} catch (error) {
				try {
					this.configure(defaultId.toLowerCase());
				} catch (e) {
					// Wait for manual user selection
				}
			}
		}
	}
	
	public checkAvailability(): LLMProviderStatus[] {
		return this.registry.records.map(record => {
			const hasKey = !!process.env[record.apiKeyEnv];
			return {
				id: record.id,
				name: record.label || record.id,
				available: hasKey,
				reason: hasKey ? undefined : `Missing ${record.apiKeyEnv}`
			};
		});
	}
	
	public configure(providerId: string) {
		const record = this.registry.records.find(r => r.id === providerId);
		if (!record) throw new Error(`Provider '${providerId}' not found.`);
		this.activeConfig = record;
	}
	
	// Strictly typed dynamic path resolver
	private resolvePath(obj: unknown, path: string): unknown {
		return path.split('.').reduce((acc: unknown, part: string) => {
			if (acc && typeof acc === 'object' && part in acc) {
				return (acc as Record<string, unknown>)[part];
			}
			return undefined;
		}, obj);
	}
	
	public sanitizeContext(input: string, maxLength: number = 4000): string {
		if (!input || input.length <= maxLength) return input || '';
		
		const half = Math.floor(maxLength / 2);
		const head = input.substring(0, half);
		const tail = input.substring(input.length - half);
		
		return `${head}\n\n... [TRUNCATED ${input.length - maxLength} CHARS] ...\n\n${tail}`;
	}
	
	public async generate(prompt: string, options?: ChatOptions): Promise<string> {
		const response = await this.chat([{ role: 'user', content: prompt }], options);
		return response.content;
	}
	
	public async chat(messages: LLMMessage[], options?: ChatOptions): Promise<LLMResponse> {
		if (!this.activeConfig) throw new Error('LLM Service not configured.');
		
		const config = this.activeConfig;
		const apiKey = process.env[config.apiKeyEnv];
		
		const baseUrl = config.baseUrl?.replace(/\/$/, '') || 'https://api.openai.com/v1';
		const endpoint = `${baseUrl}/chat/completions`;
		
		// Strictly typed request body
		const body: Record<string, unknown> = {
			model: config.model,
			messages: messages,
			stream: false
		};
		
		if (options?.jsonMode) {
			body.response_format = { type: 'json_object' };
		}
		
		const controller = new AbortController();
		const timeoutId = config.timeOut
			? setTimeout(() => controller.abort(), config.timeOut)
			: null;
		
		try {
			const response = await fetch(endpoint, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					'Authorization': `Bearer ${apiKey || 'ollama'}`
				},
				body: JSON.stringify(body),
				signal: controller.signal
			});
			
			// 1. Trap 502/503 HTML Crash Responses safely
			let rawData: unknown;
			try {
				rawData = await response.json();
			} catch (parseError) {
				throw new Error(`API Error (${response.status}): Provider returned invalid JSON (Possible Gateway Timeout).`);
			}
			
			// 2. Evaluate Network Success & Rate Limits
			if (!response.ok) {
				if (response.status === 429) {
					throw new Error('LLM Rate Limit Exceeded (HTTP 429). Please slow down or check your provider quota.');
				}
				
				// Attempt to extract provider-specific error message
				const errorObj = this.resolvePath(rawData, 'error.message') as string;
				throw new Error(`API Error (${response.status}): ${errorObj || response.statusText}`);
			}
			
			// 3. Apply Strategy Extraction
			const contentPath = config.mapping?.content || 'choices.0.message.content';
			const tokenPath = config.mapping?.tokens || 'usage.total_tokens';
			
			const content = this.resolvePath(rawData, contentPath) as string;
			const tokens = this.resolvePath(rawData, tokenPath) as number;
			
			if (!content) {
				throw new Error(`Failed to parse content using path: '${contentPath}'`);
			}
			
			return {
				content: content,
				usage: { totalTokens: Number(tokens) || 0 }
			};
			
		} catch (error: unknown) {
			const errMsg = error instanceof Error ? error.message : String(error);
			
			if (error instanceof Error && error.name === 'AbortError') {
				const toMsg = `LLM Request Timed Out after ${config.timeOut}ms`;
				logger.error(toMsg);
				throw new Error(toMsg);
			}
			
			logger.error(errMsg);
			throw error;
		} finally {
			if (timeoutId) clearTimeout(timeoutId);
		}
	}
}

export const llmService = new LLMService();