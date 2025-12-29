/**
 * ================================================================================
 *
 * @project:    app-manager
 * @file:       ~/tests/e2e/services/configService.test.ts
 * @version:    1.0.1
 * @createDate: 2025 Dec 22
 * @createTime: 16:27
 * @author:     Steve R Lewis
 *
 * ================================================================================
 *
 * @description:
 * End-to-End (E2E) test suite for the ConfigService.
 *
 * This suite verifies the integration between the service and the physical
 * file system. It creates actual configuration files in a sandboxed test
 * environment and asserts that the service correctly discovers, reads, and
 * loads them into memory.
 *
 * Scenarios:
 * 1. Full Initialization:
 * - Creates `config/llmRegistry.json`, `config/repositoryRegistry.json`,
 * and `.env` in the test context.
 * - Runs `configService.init()`.
 * - Asserts that all properties are populated correctly.
 *
 * 2. Environment Loading:
 * - Verifies that environment variables defined in the sandboxed `.env`
 * file are accessible via `process.env`.
 *
 * ================================================================================
 *
 * @notes: Revision History
 * V1.0.1, 20251226-1913
 * Refactored logic.
 *
 * V1.0.0, 20251222-16:27
 * Initial creation and release of configService.test.ts
 *
 * ================================================================================
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { configService } from '../../../app/services/configService';
import { setupTestContext } from '../../helpers/testContext';
import fs from 'fs';
import path from 'path';

// We do NOT mock fs here. We want real disk interaction.
// We DO mock logger to keep console clean.
vi.mock('../../../app/services/loggerService', () => ({
	logger: {
		success: vi.fn(),
		warn: vi.fn(),
		error: vi.fn(),
		info: vi.fn(),
		init: vi.fn() // E2E setup might call this
	}
}));

describe('E2E: Config Service (Real File System)', () => {
	let ctx: ReturnType<typeof setupTestContext>;
	
	beforeEach(() => {
		ctx = setupTestContext();
		vi.clearAllMocks();
		
		// Reset Service State
		configService.llmConfig = null;
		configService.repoConfig = null;
	});
	
	afterEach(() => {
		ctx.restore();
		delete process.env.APP_CONFIG_DIR;
	});
	
	it('should load real configuration files from disk', () => {
		// 1. Setup Sandbox Structure
		const configDir = path.join(ctx.targetRoot, 'config');
		fs.mkdirSync(configDir, { recursive: true });
		
		// 2. Create Real Files
		const llmConfig = {
			records: [{ id: 'e2e-provider', model: 'gpt-4', apiKeyEnv: 'TEST_KEY' }]
		};
		fs.writeFileSync(
			path.join(configDir, 'llmRegistry.json'),
			JSON.stringify(llmConfig)
		);
		
		const repoConfig = {
			records: [{ repositoryName: 'e2e-repo', githubToken: 'GH_TOKEN' }]
		};
		fs.writeFileSync(
			path.join(configDir, 'repositoryRegistry.json'),
			JSON.stringify(repoConfig)
		);
		
		const envPath = path.join(ctx.targetRoot, '.env');
		fs.writeFileSync(envPath, 'TEST_KEY=secret-123');
		
		// 3. Configure Service to look in Sandbox
		// We simulate "Tool Root" being the sandbox for this test
		process.env.APP_CONFIG_DIR = configDir;
		
		// 4. Initialize
		configService.init(ctx.targetRoot);
		
		// 5. Verify State
		expect(configService.llmConfig).toEqual(llmConfig);
		expect(configService.repoConfig).toEqual(repoConfig);
		
		// Verify .env loading (Dotenv loads into process.env)
		expect(process.env.TEST_KEY).toBe('secret-123');
	});
});