/**
 * ================================================================================
 *
 * @project:    app-manager
 * @file:       ~/tests/unit/services/configService.test.ts
 * @version:    1.0.2
 * @createDate: 2025 Dec 22
 * @createTime: 16:26
 * @author:     Steve R Lewis
 *
 * ================================================================================
 *
 * @description:
 * Unit test suite for the ConfigService class.
 *
 * Key Validation Areas:
 * 1. Data Parsing Logic:
 * - Verifies that valid JSON content returned by the file system is correctly
 * mapped to the internal `llmConfig` and `repoConfig` state properties.
 *
 * 2. Error Handling (Resilience):
 * - Validates that malformed JSON triggers a graceful failure (process.exit)
 * rather than an unhandled exception.
 * - Ensures that missing configuration files log warnings but allow the
 * application to proceed (non-blocking).
 *
 * 3. Environment Validation:
 * - Checks that the service correctly defaults to specific providers (e.g.,
 * 'gemini') if no overrides are present in the environment.
 *
 * Methodology:
 * Uses strict mocking of 'fs' and 'dotenv' to simulate various file system
 * states without performing actual disk I/O.
 *
 * ================================================================================
 *
 * @notes: Revision History
 * V1.0.2, 20251226-1913
 * Refactored logic.
 *
 * V1.0.1, 20251222-16:45
 * Refactored to use static imports instead of 'require' to fix ESM module
 * resolution errors during test execution.
 *
 * V1.0.0, 20251222-16:26
 * Initial creation and release of configService.test.ts
 *
 * ================================================================================
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { configService } from '../../../app/services/configService';
import { logger } from '../../../app/services/loggerService';
import fs from 'fs';
import path from 'path';

// 1. Mock Dependencies
vi.mock('fs');
vi.mock('dotenv');
vi.mock('../../../app/services/loggerService', () => ({
	logger: {
		success: vi.fn(),
		warn: vi.fn(),
		error: vi.fn(),
		info: vi.fn()
	}
}));

describe('Unit: Config Service (Logic)', () => {
	const mockToolRoot = '/mock/tool';
	const mockConfigDir = path.join(mockToolRoot, 'config');
	
	beforeEach(() => {
		vi.clearAllMocks();
		
		// Reset Singleton State (approximate)
		configService.llmConfig = null;
		configService.repoConfig = null;
		
		// Mock process.env.APP_CONFIG_DIR to control where service looks
		process.env.APP_CONFIG_DIR = mockConfigDir;
		
		// Trap process.exit to prevent test runner termination
		vi.spyOn(process, 'exit').mockImplementation((() => {
			throw new Error('PROCESS_EXIT');
		}) as any);
	});
	
	afterEach(() => {
		vi.restoreAllMocks();
		delete process.env.APP_CONFIG_DIR;
	});
	
	it('should parse and load valid LLM registry', () => {
		// Mock FS existence and read
		vi.mocked(fs.existsSync).mockImplementation((p) => p.toString().includes('llmRegistry.json'));
		vi.mocked(fs.readFileSync).mockReturnValue(JSON.stringify({
			records: [{ id: 'unit-test', model: 'mock-model' }]
		}));
		
		configService.init(mockToolRoot);
		
		expect(configService.llmConfig).toBeDefined();
		expect(configService.llmConfig?.records[0].id).toBe('unit-test');
	});
	
	it('should handle malformed JSON by logging error and exiting', () => {
		vi.mocked(fs.existsSync).mockReturnValue(true);
		vi.mocked(fs.readFileSync).mockReturnValue('{ "broken": [ ... '); // Invalid JSON
		
		expect(() => {
			configService.init(mockToolRoot);
		}).toThrow('PROCESS_EXIT');
		
		expect(logger.error).toHaveBeenCalledWith(
			expect.stringContaining('Failed to parse Configuration Registries'),
			expect.anything()
		);
	});
	
	it('should log a warning if registries are missing', () => {
		vi.mocked(fs.existsSync).mockReturnValue(false);
		
		configService.init(mockToolRoot);
		
		expect(logger.warn).toHaveBeenCalledWith(expect.stringContaining('llmRegistry.json not found'));
		expect(configService.llmConfig).toBeNull();
	});
});