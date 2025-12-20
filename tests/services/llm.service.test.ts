/**
 * ================================================================================
 *
 * @project:    app-manager
 * @file:       ~/tests/services/llm.service.test.ts
 * @version:    1.0.0
 * @createDate: 2025 Dec 18
 * @createTime: 21:40
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
 * V1.0.0, 20251218-21:40
 * Initial creation and release of llm.service.test.ts
 *
 * ================================================================================
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { llm } from '../../app/services/llm.service';
import { configService } from '../../app/services/config.service';

// 1. Mock the External Library
const mockGenerateContent = vi.fn();
const mockGetGenerativeModel = vi.fn();

vi.mock('@google/generative-ai', () => {
	return {
		// FIX: Use a class to guarantee 'new GoogleGenerativeAI()' works
		GoogleGenerativeAI: class {
			constructor() {
				// Optional: You can spy on the constructor here if needed
			}
			getGenerativeModel = mockGetGenerativeModel;
		}
	};
});

describe('LLM Service', () => {
	const originalEnv = process.env;
	
	beforeEach(() => {
		vi.resetModules();
		process.env = { ...originalEnv, LLM_PROVIDER: 'gemini', MY_TEST_KEY: 'fake-key-123' };
		
		// 2. Reset Mocks
		mockGenerateContent.mockResolvedValue({
			response: { text: () => 'Mocked AI Response' }
		});
		mockGetGenerativeModel.mockReturnValue({
			generateContent: mockGenerateContent
		});
		
		// 3. Mock Config Service Registry
		configService.llmConfig = {
			records: [
				{ id: 'gemini', model: 'gemini-1.5-flash', apiKeyEnv: 'MY_TEST_KEY' }
			]
		};
		
		// Force private client reset
		(llm as any)._client = null;
	});
	
	afterEach(() => {
		process.env = originalEnv;
		vi.restoreAllMocks();
	});
	
	it('should throw if registry is not loaded', async () => {
		configService.llmConfig = null;
		await expect(llm.generate('test')).rejects.toThrow('LLM Registry not loaded');
	});
	
	it('should throw if API key is missing in environment', async () => {
		delete process.env.MY_TEST_KEY;
		await expect(llm.generate('test')).rejects.toThrow('Missing API Key');
	});
	
	it('should initialize GoogleAI with correct key and generate text', async () => {
		const response = await llm.generate('Hello AI');
		
		expect(response).toBe('Mocked AI Response');
		
		// Verify it used the model from the registry
		expect(mockGetGenerativeModel).toHaveBeenCalledWith({ model: 'gemini-1.5-flash' });
		expect(mockGenerateContent).toHaveBeenCalledWith('Hello AI');
	});
	
	it('should handle provider switching (Mock Scenario)', async () => {
		process.env.LLM_PROVIDER = 'ollama';
		process.env.OLLAMA_KEY = 'ollama-fake';
		
		configService.llmConfig = {
			records: [
				{ id: 'ollama', model: 'llama3', apiKeyEnv: 'OLLAMA_KEY' }
			]
		};
		
		await llm.generate('Switch Test');
		
		expect(mockGetGenerativeModel).toHaveBeenCalledWith({ model: 'llama3' });
	});
});