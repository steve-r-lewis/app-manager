/**
 * ================================================================================
 *
 * @project:    app-manager
 * @file:       ~/tests/e2e/cli/startup.test.ts
 * @version:    1.0.0
 * @createDate: 2025 Dec 20
 * @createTime: 17:37
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
 * V1.0.0, 20251220-17:37
 * Initial creation and release of startup.test.ts
 *
 * ================================================================================
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import fs from 'fs';
import path from 'path';
import { exec } from 'child_process';
import { promisify } from 'util';
import { setupTestContext } from '../../utils/test-context';

const execPromise = promisify(exec);

// Use dist/index.js if built, or tsx for dev.
// Using npx tsx is safer for dev environments.
const CLI_ENTRY = path.resolve(__dirname, '../../../index.ts');

describe('E2E: CLI Startup & Resilience', () => {
	let ctx: ReturnType<typeof setupTestContext>;
	
	beforeEach(() => {
		ctx = setupTestContext();
	});
	
	afterEach(() => {
		ctx.restore();
	});
	
	it('should crash safely and write error.log when config is broken', async () => {
		// 1. Setup the Temp Config Directory
		const configDir = path.join(ctx.targetRoot, 'config');
		fs.mkdirSync(configDir, { recursive: true });
		
		// 2. Create the BROKEN file in the temp dir
		fs.writeFileSync(path.join(configDir, 'llmRegistry.json'), '{ "broken": ...');
		
		try {
			// 3. Run the CLI with the Override Environment Variable
			await execPromise(`npx tsx ${CLI_ENTRY}`, {
				cwd: ctx.targetRoot,
				env: {
					...process.env,
					LOG_TO_FILE: 'true',
					DEBUG: 'true',
					// CRITICAL: Force the app to look in our temp directory
					APP_CONFIG_DIR: configDir
				},
				// Add a timeout significantly shorter than the test timeout
				timeout: 5000
			});
			
			throw new Error('CLI should have failed with exit code 1');
			
		} catch (error: any) {
			// We expect it to fail. If it timed out (killed), that's also a failure of the test logic.
			// But here we expect code 1.
			expect(error.code).toBe(1);
		}
		
		// 4. Verify the log file exists in the temp directory
		const errorLogPath = path.join(ctx.targetRoot, 'app-monitor', 'error-logs', 'error.log');
		
		expect(fs.existsSync(errorLogPath), 'Error log should exist').toBe(true);
		
		const content = fs.readFileSync(errorLogPath, 'utf-8');
		expect(content).toContain('Failed to parse Configuration Registries');
	});
});