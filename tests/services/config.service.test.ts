/**
 * ================================================================================
 *
 * @project:    app-manager
 * @file:       ~/tests/services/config.service.test.ts
 * @version:    1.0.0
 * @createDate: 2025 Dec 18
 * @createTime: 18:01
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
 * V1.0.0, 20251218-18:01
 * Initial creation and release of config.service.test.ts
 *
 * ================================================================================
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { configService } from '../../app/services/config.service';
import { logger } from '../../app/services/logger.service';
import { setupTestContext } from '../utils/test-context';
import path from 'path';
import fs from 'fs';

// 1. Mock Logger to prevent disk writes during Unit Tests
vi.mock('../../app/services/logger.service', () => ({
	logger: {
		init: vi.fn(),
		error: vi.fn(),
		warn: vi.fn(),
		success: vi.fn(),
		info: vi.fn()
	}
}));

describe('Config Service', () => {
	const REAL_TOOL_ROOT = path.resolve(__dirname, '../../');
	let ctx: ReturnType<typeof setupTestContext>;
	
	beforeEach(() => {
		ctx = setupTestContext();
		vi.clearAllMocks();
		
		// 2. FORCE the process.exit mock inside beforeEach
		// This ensures our custom error overrides Vitest's default behavior
		vi.spyOn(process, 'exit').mockImplementation((code) => {
			throw new Error(`Process.exit(${code})`);
		});
	});
	
	afterEach(() => {
		ctx.restore();
		vi.restoreAllMocks();
	});
	
	// --- Happy Path ---
	
	it('should load the LLM Registry correctly', () => {
		configService.init(REAL_TOOL_ROOT);
		expect(configService.llmConfig).toBeDefined();
		expect(configService.llmConfig?.records).toBeInstanceOf(Array);
	});
	
	it('should load the Repository Registry correctly', () => {
		configService.init(REAL_TOOL_ROOT);
		expect(configService.repoConfig).toBeDefined();
		expect(configService.repoConfig?.records).toBeInstanceOf(Array);
	});
	
	it('should not throw when initialized multiple times', () => {
		expect(() => configService.init(REAL_TOOL_ROOT)).not.toThrow();
	});
	
	// --- Resilience Tests ---
	
	it('should exit gracefully if llmRegistry.json is malformed', () => {
		const mockToolRoot = ctx.targetRoot;
		const configDir = path.join(mockToolRoot, 'config');
		fs.mkdirSync(configDir, { recursive: true });
		
		// Malformed JSON
		const badJsonPath = path.join(configDir, 'llmRegistry.json');
		fs.writeFileSync(badJsonPath, '{ "records": [ ... broken ...');
		
		// Expect our CUSTOM error message
		expect(() => {
			configService.init(mockToolRoot);
		}).toThrow('Process.exit(1)');
		
		expect(logger.error).toHaveBeenCalledWith(
			'Failed to parse Configuration Registries:',
			expect.anything()
		);
	});
	
	it('should exit gracefully if repositoryRegistry.json is malformed', () => {
		const mockToolRoot = ctx.targetRoot;
		const configDir = path.join(mockToolRoot, 'config');
		fs.mkdirSync(configDir, { recursive: true });
		
		// Valid LLM
		fs.writeFileSync(
			path.join(configDir, 'llmRegistry.json'),
			JSON.stringify({ records: [] })
		);
		
		// Invalid Repo Registry
		const badRepoPath = path.join(configDir, 'repositoryRegistry.json');
		fs.writeFileSync(badRepoPath, 'NOT JSON');
		
		expect(() => {
			configService.init(mockToolRoot);
		}).toThrow('Process.exit(1)');
	});
	
	it('should warn but continue if registries are missing completely', () => {
		const mockToolRoot = ctx.targetRoot;
		expect(() => configService.init(mockToolRoot)).not.toThrow();
		expect(logger.warn).toHaveBeenCalledWith(expect.stringContaining('llmRegistry.json not found'));
	});
});