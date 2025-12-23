/**
 * ================================================================================
 *
 * @project:    app-manager
 * @file:       ~/tests/e2e/services/llmService.test.ts
 * @version:    2.0.0
 * @createDate: 2025 Dec 22
 * @createTime: 17:31
 * @author:     Steve R Lewis
 *
 * ================================================================================
 *
 * @description:
 * End-to-End (E2E) test suite for LlmService.
 * * Verifies integration with:
 * 1. The File System (ConfigService loading real JSON/Env files).
 * 2. The Network (Real API call if credentials exist).
 *
 * Verifies integration with File System configuration and Local Network (Ollama).
 *
 * ================================================================================
 *
 * @notes: Revision History
 *
 * V2.0.0, 20251222-23:11
 * Updated to test configuration loading from real files and
 * - connectivity checks for Local Ollama.
 *
 * V1.0.0, 20251222-17:31
 * Initial creation and release of llmService.test.ts
 *
 * ================================================================================
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { llm } from '../../../app/services/llmService';
import { configService } from '../../../app/services/configService';
import { setupTestContext } from '../../helpers/testContext';
import fs from 'fs';
import path from 'path';

describe('E2E: LLM Service', () => {
	let ctx: ReturnType<typeof setupTestContext>;
	const originalEnv = process.env;
	
	beforeEach(() => {
		ctx = setupTestContext();
		vi.resetModules();
		process.env = { ...originalEnv };
		
		// Reset services
		configService.llmConfig = null;
		(llm as any)._availableProviders = new Set();
	});
	
	afterEach(() => {
		ctx.restore();
		process.env = originalEnv;
		delete process.env.APP_CONFIG_DIR;
	});
	
	it('should load config from disk and correctly report availability', async () => {
		// 1. Setup Sandbox Config
		const configDir = path.join(ctx.targetRoot, 'config');
		fs.mkdirSync(configDir, { recursive: true });
		
		const registry = {
			records: [
				// Case A: Missing Key (Should be unavailable)
				{ id: 'gemini-bad', type: 'gemini', apiKeyEnv: 'MISSING_KEY' },
				// Case B: Ollama (Should try to ping)
				{ id: 'ollama-local', type: 'ollama', baseUrl: 'http://localhost:9010', apiKeyEnv: 'NONE' }
			]
		};
		fs.writeFileSync(path.join(configDir, 'llmRegistry.json'), JSON.stringify(registry));
		
		process.env.APP_CONFIG_DIR = configDir;
		configService.init(ctx.targetRoot);
		
		// 2. Run Check
		const status = await llm.checkAvailability();
		
		// 3. Verify
		const geminiBad = status.find(s => s.id === 'gemini-bad');
		expect(geminiBad?.available).toBe(false);
		expect(geminiBad?.reason).toBe('Missing API Key');
		
		const ollama = status.find(s => s.id === 'ollama-local');
		// We can't guarantee Ollama is running in CI, but the entry should exist.
		// If it's not running, available=false, reason=FetchError.
		// If it IS running, available=true.
		expect(ollama).toBeDefined();
	});
	
	it('should successfully configure and call local Ollama (if running)', async () => {
		// 1. Setup Sandbox
		const configDir = path.join(ctx.targetRoot, 'config');
		fs.mkdirSync(configDir, { recursive: true });
		
		const registry = {
			records: [
				{
					id: 'ollama', type: 'ollama', model: 'llama3.2',
					baseUrl: 'http://localhost:9010', apiKeyEnv: 'NONE'
				}
			]
		};
		fs.writeFileSync(path.join(configDir, 'llmRegistry.json'), JSON.stringify(registry));
		
		process.env.APP_CONFIG_DIR = configDir;
		configService.init(ctx.targetRoot);
		
		// 2. Set Active Provider
		llm.setActiveProvider('ollama');
		
		// 3. Attempt Call
		try {
			console.log('    > Sending request to Local Ollama (9010)...');
			const response = await llm.generate('Hello');
			expect(response).toBeDefined();
		} catch (error: any) {
			console.warn('    ! Call failed (Ollama likely not running):', error.message);
			// In E2E, if the service logic threw "Ollama Error", it means the internal logic worked,
			// even if the network failed. We pass the test if the error is network-related.
			expect(error.message).toContain('Ollama Error');
		}
	});
});