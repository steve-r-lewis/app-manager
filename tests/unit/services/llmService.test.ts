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
 * Unit Test Suite for the LLM Service.
 *
 * Verifies that the service:
 * 1. Initializes with correct configuration (matching your llmTypes.ts).
 * 2. Formats messages correctly for the provider.
 * 3. Handles network/API errors gracefully.
 *
 * ================================================================================
 *
 * @notes: Revision History
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
import { llmService } from '../../../app/services/llmService';
import type { LLMMessage } from '../../../app/types/index';

// Create a standalone mock function
const fetchMock = vi.fn();

describe('LLMService', () => {
	
	beforeEach(() => {
		vi.clearAllMocks();
		
		// FORCE replace the global fetch with our mock
		vi.stubGlobal('fetch', fetchMock);
		
		llmService.configure({
			provider: 'openai',
			apiKey: 'test-key',
			model: 'gpt-4-turbo'
		});
	});
	
	afterEach(() => {
		// cleanup globals
		vi.unstubAllGlobals();
	});
	
	it('should send a correctly formatted request to the provider', async () => {
		// Mock a successful API response
		fetchMock.mockResolvedValue({
			ok: true,
			json: async () => ({
				choices: [{ message: { content: 'Hello, World!' } }],
				usage: { prompt_tokens: 10, completion_tokens: 5, total_tokens: 15 }
			})
		});
		
		const messages: LLMMessage[] = [
			{ role: 'system', content: 'You are helpful.' },
			{ role: 'user', content: 'Say hello.' }
		];
		
		const response = await llmService.chat(messages);
		
		expect(response.content).toBe('Hello, World!');
		expect(response.usage?.totalTokens).toBe(15);
		
		// Verify fetch was called with correct headers/body for OpenAI
		expect(fetchMock).toHaveBeenCalledWith(
			expect.stringContaining('api.openai.com'),
			expect.objectContaining({
				method: 'POST',
				headers: expect.objectContaining({
					'Authorization': 'Bearer test-key',
					'Content-Type': 'application/json'
				})
			})
		);
	});
	
	it('should handle API errors gracefully', async () => {
		// Mock an error response (e.g., 401 Unauthorized)
		fetchMock.mockResolvedValue({
			ok: false,
			status: 401,
			statusText: 'Unauthorized',
			text: async () => 'Unauthorized Request'
		});
		
		const messages: LLMMessage[] = [{ role: 'user', content: 'test' }];
		
		await expect(llmService.chat(messages)).rejects.toThrow('LLM Provider Error: 401 Unauthorized');
	});
	
	it('should support JSON mode if requested', async () => {
		fetchMock.mockResolvedValue({
			ok: true,
			json: async () => ({ choices: [{ message: { content: '{}' } }] })
		});
		
		await llmService.chat([{ role: 'user', content: 'json' }], { jsonMode: true });
		
		expect(fetchMock).toHaveBeenCalledWith(
			expect.any(String),
			expect.objectContaining({
				body: expect.stringContaining('"response_format":{"type":"json_object"}')
			})
		);
	});
});