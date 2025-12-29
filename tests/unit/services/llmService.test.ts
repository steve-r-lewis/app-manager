/**
 * ================================================================================
 *
 * @project:    app-manager
 * @file:       ~/tests/unit/services/llmService.test.ts
 * @version:    2.0.2
 * @createDate: 2025 Dec 22
 * @createTime: 17:31
 * @author:     Steve R Lewis
 *
 * ================================================================================
 *
 * @description:
 * Unit test suite for LlmService.
 * strictly mocks external dependencies (ConfigService, GoogleGenerativeAI)
 * to verify internal logic, error handling, and provider lookup mechanics.
 *
 * ================================================================================
 *
 * @notes: Revision History
 * V2.0.2, 20251226-1913
 * Updated author metadata.
 *
 * V2.0.1, 20251222-23:16
 * Fixed assertion for offline provider reason (expect 'Unreachable').
 *
 * V2.0.0, 20251222-23:11
 * Added tests for Health Checks (checkAvailability) and
 *  * Multi-Provider Routing (Ollama vs Gemini).
 *
 * V1.1.0, 20251222-22:53
 * - Added test for Ollama provider
 *
 * V1.0.0, 20251222-17:31
 * Initial creation and release of llmService.test.ts
 *
 * ================================================================================
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { llm } from '../../../app/services/llmService';
import { configService } from '../../../app/services/configService';

// 1. Mock Google SDK
const mockGenerateContent = vi.fn();
const mockGetGenerativeModel = vi.fn();
vi.mock('@google/generative-ai', () => ({
	GoogleGenerativeAI: class {
		getGenerativeModel = mockGetGenerativeModel;
	}
}));

// 2. Mock Global Fetch (for Ollama)
global.fetch = vi.fn();

describe('Unit: LLM Service', () => {
	const originalEnv = process.env;
	
	beforeEach(() => {
		vi.clearAllMocks();
		process.env = { ...originalEnv };
		
		// Reset Service Internal State
		(llm as any)._activeProviderId = null;
		(llm as any)._availableProviders = new Set();
		
		// Default Google Mock Response
		mockGenerateContent.mockResolvedValue({ response: { text: () => 'Gemini Response' } });
		mockGetGenerativeModel.mockReturnValue({ generateContent: mockGenerateContent });
	});
	
	afterEach(() => {
		process.env = originalEnv;
	});
	
	// --- SECTION 1: HEALTH CHECKS ---
	describe('checkAvailability()', () => {
		it('should mark Ollama as available if fetch succeeds', async () => {
			// Setup Config
			configService.llmConfig = {
				records: [{ id: 'ollama', type: 'ollama', baseUrl: 'http://loc:114', apiKeyEnv: 'NONE' }]
			} as any;
			
			// Mock Successful Ping
			(global.fetch as any).mockResolvedValue({ ok: true });
			
			const status = await llm.checkAvailability();
			
			expect(global.fetch).toHaveBeenCalledWith('http://loc:114/api/tags');
			expect(status[0].available).toBe(true);
			expect(status[0].id).toBe('ollama');
		});
		
		it('should mark Ollama as unavailable if fetch fails', async () => {
			configService.llmConfig = {
				records: [{ id: 'ollama', type: 'ollama', baseUrl: 'http://loc:114', apiKeyEnv: 'NONE' }]
			} as any;
			
			// Mock Network Error
			(global.fetch as any).mockRejectedValue(new Error('Conn Refused'));
			
			const status = await llm.checkAvailability();
			
			expect(status[0].available).toBe(false);
			// The service catches the error and returns generic 'Unreachable'
			expect(status[0].reason).toBe('Unreachable');
		});
		
		it('should mark Gemini as available if API Key exists (Optimistic check)', async () => {
			process.env.TEST_KEY = 'valid-key';
			configService.llmConfig = {
				records: [{ id: 'gemini', type: 'gemini', apiKeyEnv: 'TEST_KEY', model: 'flash' }]
			} as any;
			
			const status = await llm.checkAvailability();
			
			expect(status[0].available).toBe(true);
		});
		
		it('should mark Gemini as unavailable if API Key is missing', async () => {
			delete process.env.TEST_KEY;
			configService.llmConfig = {
				records: [{ id: 'gemini', type: 'gemini', apiKeyEnv: 'TEST_KEY', model: 'flash' }]
			} as any;
			
			const status = await llm.checkAvailability();
			
			expect(status[0].available).toBe(false);
			expect(status[0].reason).toBe('Missing API Key');
		});
	});
	
	// --- SECTION 2: GENERATION LOGIC ---
	describe('generate()', () => {
		it('should route to Google SDK when provider type is "gemini"', async () => {
			process.env.GEMINI_KEY = 'xyz';
			configService.llmConfig = {
				records: [{ id: 'gemini', type: 'gemini', model: 'flash', apiKeyEnv: 'GEMINI_KEY' }]
			} as any;
			
			// Manually set active
			llm.setActiveProvider('gemini');
			
			const res = await llm.generate('Hi');
			
			expect(res).toBe('Gemini Response');
			expect(mockGetGenerativeModel).toHaveBeenCalled();
		});
		
		it('should route to Fetch when provider type is "ollama"', async () => {
			configService.llmConfig = {
				records: [{
					id: 'ollama', type: 'ollama', model: 'llama3',
					baseUrl: 'http://localhost:9999', apiKeyEnv: 'NONE'
				}]
			} as any;
			
			llm.setActiveProvider('ollama');
			
			// Mock Generation Response
			(global.fetch as any).mockResolvedValue({
				ok: true,
				json: async () => ({ response: 'Ollama Response' })
			});
			
			const res = await llm.generate('Hi');
			
			expect(res).toBe('Ollama Response');
			expect(global.fetch).toHaveBeenCalledWith(
				'http://localhost:9999/api/generate',
				expect.anything()
			);
		});
	});
});