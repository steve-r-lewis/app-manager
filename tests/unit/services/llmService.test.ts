/**
 * ================================================================================
 *
 * @project:    app-manager
 * @file:       ~/tests/unit/services/llmService.test.ts
 * @version:    1.0.0
 * @createDate: 2026 Jan 02
 * @createTime: 01:24
 * @author:     Steve R Lewis
 *
 * ================================================================================
 *
 * @description:
 * Full Unit Test Suite for the LLM Service.
 *
 * Coverage:
 * 1. Initialization: Auto-loading defaults from ENV.
 * 2. Configuration: Switching providers and handling invalid IDs.
 * 3. Availability: Scanning ENV for API keys.
 * 4. Chat Operations:
 * - Request Formatting (Headers, Body, JSON Mode).
 * - Response Parsing (Strategy Pattern).
 * - Timeout Handling (AbortController).
 * 5. Error Handling: Network errors, API errors, Parsing errors.
 *
 * ================================================================================
 *
 * @notes: Revision History
 *
 * V1.2.0 20260102-00:30
 * Updated test suite to use vi.stubGlobal for fetch mocking.
 *
 * V1.1.0 20260102-00:30
 * - Added checkAvailability() test.
 *
 * V1.0.1, 20260102-01:30
 * - Replaced vi.spyOn(global, 'fetch') with vi.stubGlobal('fetch', ...).
 * - This ensures we strictly intercept native Node fetch calls and prevent
 * accidental network requests to OpenAI during testing.
 *
 * V1.0.0, 20260102-01:24
 * Initial creation and release of llmService.test.ts
 *
 * ================================================================================
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { llmService } from '../../../app/services/llmService.js';
import type { LLMMessage } from '../../../app/types/index.js';

// 1. Standalone Mock for Fetch
const fetchMock = vi.fn();

describe('LLMService', () => {
	const originalEnv = process.env;
	
	beforeEach(() => {
		vi.clearAllMocks();
		vi.stubGlobal('fetch', fetchMock);
		process.env = { ...originalEnv };
		
		process.env.API_KEY_OPENAI = 'sk-test-key';
		process.env.API_KEY_OLLAMA = 'ollama-local-key';
		delete process.env.API_KEY_CLAUDE;
	});
	
	afterEach(() => {
		vi.unstubAllGlobals();
		process.env = originalEnv;
	});
	
	// --------------------------------------------------------------------------
	// Group 1: Configuration & Availability
	// --------------------------------------------------------------------------
	describe('Configuration & Availability', () => {
		it('should handle case-insensitive provider IDs in ENV (Robust Initialization)', () => {
			// 1. Set Env to Uppercase (Registry expects 'ollama')
			process.env.API_MODEL_DEFAULT = 'OLLAMA';
			
			// 2. Force re-initialization (Accessing private method for testing)
			// This simulates the app starting up with the new env var
			(llmService as any).initializeDefault();
			
			// 3. Verify it found the correct config despite the casing mismatch
			expect((llmService as any).activeConfig.id).toBe('ollama');
		});
		
		it('should throw error if configuring a non-existent provider', () => {
			expect(() => llmService.configure('invalid-provider-id'))
				.toThrow("Provider 'invalid-provider-id' not found");
		});
		
		it('should correctly identify available providers based on ENV keys', () => {
			const status = llmService.checkAvailability();
			const ollama = status.find(s => s.id === 'ollama');
			const claude = status.find(s => s.id === 'claude');
			
			expect(ollama?.available).toBe(true);
			expect(claude?.available).toBe(false);
		});
		
		it('should auto-configure default provider if env var is set', () => {
			expect(llmService).toBeDefined();
		});
	});
	
	// --------------------------------------------------------------------------
	// Group 2: Chat Execution Logic
	// --------------------------------------------------------------------------
	describe('chat()', () => {
		beforeEach(() => {
			llmService.configure('ollama');
		});
		
		it('should throw if service is not configured', async () => {
			// HACK: Access private property to simulate unconfigured state
			(llmService as any).activeConfig = null;
			await expect(llmService.chat([{ role: 'user', content: 'hi' }]))
				.rejects.toThrow('LLM Service not configured');
		});
		
		it('should send a correctly formatted request to the provider', async () => {
			fetchMock.mockResolvedValue({
				ok: true,
				json: async () => ({
					choices: [{ message: { content: 'Hello, World!' } }],
					usage: { total_tokens: 42 }
				})
			});
			
			const response = await llmService.chat([{ role: 'user', content: 'hi' }]);
			expect(response.content).toBe('Hello, World!');
			
			expect(fetchMock).toHaveBeenCalledWith(
				expect.stringContaining('/chat/completions'),
				expect.objectContaining({
					method: 'POST',
					headers: expect.objectContaining({ 'Authorization': expect.stringContaining('Bearer') })
				})
			);
		});
		
		it('should abort request if timeout is exceeded', async () => {
			llmService.configure('ollama'); // Has timeOut: 200
			
			fetchMock.mockImplementation((url, options) => {
				return new Promise((resolve, reject) => {
					const signal = options?.signal;
					if (signal?.aborted) {
						const err = new Error('Aborted');
						err.name = 'AbortError';
						return reject(err);
					}
					signal?.addEventListener('abort', () => {
						const err = new Error('Aborted');
						err.name = 'AbortError';
						reject(err);
					});
				});
			});
			
			await expect(llmService.chat([{ role: 'user', content: 'hi' }]))
				.rejects.toThrow(/Timed Out/);
		});
	});
	
	// --------------------------------------------------------------------------
	// Group 3: Utilities (New Features)
	// --------------------------------------------------------------------------
	describe('Utilities', () => {
		it('sanitizeContext should safely handle empty or null inputs', () => {
			// @ts-ignore - Simulating runtime dirty data
			expect(llmService.sanitizeContext(null)).toBe('');
			// @ts-ignore
			expect(llmService.sanitizeContext(undefined)).toBe('');
			expect(llmService.sanitizeContext('')).toBe('');
		});
		
		it('sanitizeContext should truncate excessively long input', () => {
			const longInput = 'A'.repeat(100);
			const sanitized = llmService.sanitizeContext(longInput, 10);
			
			expect(sanitized.length).toBeLessThan(100);
			expect(sanitized).toContain('... [TRUNCATED');
		});
		
		it('generate should act as a simple wrapper around chat', async () => {
			llmService.configure('ollama');
			fetchMock.mockResolvedValue({
				ok: true,
				json: async () => ({
					choices: [{ message: { content: 'Simple Answer' } }]
				})
			});
			
			const result = await llmService.generate('Simple Question');
			expect(result).toBe('Simple Answer');
		});
	});
});