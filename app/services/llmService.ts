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
import type {
	LLMRegistry,
	LLMProviderConfig,
	LLMMessage,
	LLMResponse,
	LLMProviderStatus,
	ChatOptions
} from '../types/index';

class LLMService {
	
	private activeConfig: LLMProviderConfig | null = null;
	private registry: LLMRegistry = registryData as LLMRegistry;
	
	constructor() {
		this.initializeDefault();
	}
	
	private initializeDefault() {
		const defaultId = process.env.API_MODEL_DEFAULT;
		if (defaultId) {
			// Attempt configuration, handling case sensitivity and errors gracefully
			// so we don't crash the application/tests at module load time.
			try {
				this.configure(defaultId);
			} catch (error) {
				try {
					// Fallback: try lowercase
					this.configure(defaultId.toLowerCase());
				} catch (e) {
					// Silently fail if default is invalid; waiting for user manual selection
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
		// Strict ID matching first
		const record = this.registry.records.find(r => r.id === providerId);
		if (!record) throw new Error(`Provider '${providerId}' not found.`);
		this.activeConfig = record;
	}
	
	private resolvePath(obj: any, path: string): any {
		return path.split('.').reduce((acc, part) => {
			return acc && acc[part] !== undefined ? acc[part] : undefined;
		}, obj);
	}
	
	/**
	 * Sanitizes input text (like Git Diffs) to prevent token overflows.
	 * Truncates from the middle to preserve headers and footers.
	 */
	public sanitizeContext(input: string, maxLength: number = 4000): string {
		if (!input || input.length <= maxLength) return input || '';
		
		const half = Math.floor(maxLength / 2);
		const head = input.substring(0, half);
		const tail = input.substring(input.length - half);
		
		return `${head}\n\n... [TRUNCATED ${input.length - maxLength} CHARS] ...\n\n${tail}`;
	}
	
	/**
	 * Convenience wrapper for simple prompt-response interactions.
	 * Used by Smart Commit and AutoDoc commands.
	 */
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
		
		const body: any = {
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
			
			if (!response.ok) {
				throw new Error(`API Error: ${response.status} ${response.statusText}`);
			}
			
			const rawData = await response.json();
			
			const contentPath = config.mapping?.content || 'choices.0.message.content';
			const tokenPath = config.mapping?.tokens || 'usage.total_tokens';
			
			const content = this.resolvePath(rawData, contentPath);
			const tokens = this.resolvePath(rawData, tokenPath);
			
			if (!content) {
				throw new Error(`Failed to parse content using path: '${contentPath}'`);
			}
			
			return {
				content: content,
				usage: { totalTokens: Number(tokens) || 0 }
			};
		} catch (error: unknown) {
			if (error instanceof Error && error.name === 'AbortError') {
				throw new Error(`LLM Request Timed Out after ${config.timeOut}ms`);
			}
			throw error;
		} finally {
			if (timeoutId) clearTimeout(timeoutId);
		}
	}
}

export const llmService = new LLMService();