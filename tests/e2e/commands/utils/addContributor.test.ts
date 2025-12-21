/**
 * ================================================================================
 *
 * @project:    app-manager
 * @file:       ~/tests/e2e/commands/utils/addContributor.test.ts
 * @version:    1.0.0
 * @createDate: 2025 Dec 19
 * @createTime: 23:44
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
 * V1.0.0, 20251219-23:44
 * Initial creation and release of addContributor.test.ts
 *
 * ================================================================================
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import fs from 'fs';
import path from 'path';
import { exec } from 'child_process';
import { promisify } from 'util';
import { setupTestContext } from '../../../utils/test-context';

const execPromise = promisify(exec);
const CLI_ENTRY = path.resolve(__dirname, '../../../../index.ts');

describe('E2E: Add Contributor (Black Box)', () => {
	let ctx: ReturnType<typeof setupTestContext>;
	
	beforeEach(() => {
		ctx = setupTestContext();
	});
	
	afterEach(() => {
		ctx.restore();
	});
	
	it('should add a contributor to package.json via CLI args', async () => {
		// 1. Setup Environment
		const pkgPath = path.join(ctx.targetRoot, 'package.json');
		const initialPkg = {
			name: 'test-project',
			version: '1.0.0',
			contributors: []
		};
		fs.writeFileSync(pkgPath, JSON.stringify(initialPkg, null, 2));
		
		// 2. Run CLI Command
		try {
			await execPromise(`npx tsx ${CLI_ENTRY} utils contributor "John Doe" "john@example.com"`, {
				cwd: ctx.targetRoot,
				env: {
					...process.env,
					// Enable the debug file writer in app.ts specifically for this test run
					AM_DEBUG_ARGS: 'true'
				},
				timeout: 5000 // Force kill if it prompts for input
			});
		} catch (error: any) {
			// DEBUG: Read the args file the app wrote (if any)
			const debugFile = path.join(ctx.targetRoot, 'debug_args.json');
			
			console.log('\n\n========== DEBUG REPORT ==========');
			if (fs.existsSync(debugFile)) {
				console.log('✅ debug_args.json content:');
				console.log(fs.readFileSync(debugFile, 'utf-8'));
			} else {
				console.log('❌ No debug_args.json found. The app likely crashed before main() or main() wasn\'t called.');
			}
			console.log('----------------------------------');
			console.log('CLI Error Output:', error.message);
			console.log('==================================\n\n');
			
			throw error; // Fail the test
		}
		
		// 3. Verify Artifacts
		const pkgContent = JSON.parse(fs.readFileSync(pkgPath, 'utf-8'));
		
		expect(pkgContent.contributors).toHaveLength(1);
		expect(pkgContent.contributors[0]).toEqual({
			name: 'John Doe',
			email: 'john@example.com'
		});
	});
	
	it('should fail gracefully if arguments are missing', async () => {
		try {
			await execPromise(`npx tsx ${CLI_ENTRY} utils contributor`, {
				cwd: ctx.targetRoot
			});
			throw new Error('Should have failed');
		} catch (error: any) {
			expect(error.code).toBe(1);
			expect(error.stderr).toContain('Usage:');
		}
	});
});