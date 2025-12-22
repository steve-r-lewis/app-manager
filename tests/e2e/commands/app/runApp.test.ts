/**
 * ================================================================================
 *
 * @project:    app-manager
 * @file:       ~/tests/e2e/commands/app/runApp.test.ts
 * @version:    1.1.1
 * @createDate: 2025 Dec 22
 * @createTime: 01:14
 * @author:     Steve R Lewis
 *
 * ================================================================================
 *
 * @description:
 * E2E "Black Box" test for the 'app' domain headless routing.
 * It verifies that the CLI correctly parses arguments (e.g., 'am app dev'),
 * detects the project package manager, and executes the target script
 * without requiring interactive menu selection.
 *
 * ================================================================================
 *
 * @notes: Revision History
 *
 * V1.1.1, 20251222-01:38
 * Fixed assertion string in error handling test to match actual npm output casing
 * and formatting (Missing script: "build").
 *
 * V1.1.0, 20251222-01:34
 * Implements strict black-box testing via shell execution
 * to verify headless routing and exit code propagation.
 *
 * V1.0.0, 20251222-01:14
 * Initial creation and release of runApp.test.ts
 *
 * ================================================================================
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import path from 'path';
import fs from 'fs';
import { exec } from 'child_process';
import { promisify } from 'util';
import { setupTestContext } from '../../../utils/test-context';

const execPromise = promisify(exec);
// Resolve path to the CLI entry point
const CLI_ENTRY = path.resolve(__dirname, '../../../../index.ts');

describe('E2E: Run App (Headless Routing)', () => {
	let ctx: ReturnType<typeof setupTestContext>;
	
	beforeEach(() => {
		ctx = setupTestContext();
	});
	
	afterEach(() => {
		ctx.restore();
	});
	
	it('should route "am app dev" correctly and execute the script via npm', async () => {
		// 1. Setup: Create a dummy package.json with a "dev" script
		// We write to a side-effect file "proof.txt" to confirm execution
		const pkgPath = path.join(ctx.targetRoot, 'package.json');
		const proofFile = path.join(ctx.targetRoot, 'proof.txt');
		const uniqueToken = 'HEADLESS_ROUTE_SUCCESS';
		
		fs.writeFileSync(pkgPath, JSON.stringify({
			name: 'e2e-dummy-app',
			scripts: {
				// Use shell echo to verify the command actually ran
				dev: `echo "${uniqueToken}" > proof.txt`
			}
		}, null, 2));
		
		// 2. Execute: Run the CLI via shell (True Black Box)
		// We pass 'app' (domain) and 'dev' (command) arguments
		await execPromise(`npx tsx ${CLI_ENTRY} app dev`, {
			cwd: ctx.targetRoot,
			env: {
				...process.env,
				// Ensure we don't accidentally trigger interactive mode
				CI: 'true',
				DEBUG: 'true'
			},
			timeout: 30000
		});
		
		// 3. Verify: Check if proof.txt exists and contains our token
		expect(fs.existsSync(proofFile), 'proof.txt should be created by the dev script').toBe(true);
		
		const content = fs.readFileSync(proofFile, 'utf-8').trim();
		expect(content).toContain(uniqueToken);
	});
	
	it('should fail gracefully if the target script does not exist', async () => {
		const pkgPath = path.join(ctx.targetRoot, 'package.json');
		fs.writeFileSync(pkgPath, JSON.stringify({
			name: 'e2e-dummy-app',
			scripts: {} // No scripts defined
		}, null, 2));
		
		try {
			// Attempt to run a non-existent script 'build'
			await execPromise(`npx tsx ${CLI_ENTRY} app build`, {
				cwd: ctx.targetRoot,
				timeout: 20000
			});
			// If execPromise doesn't throw, the test should fail
			throw new Error('CLI should have exited with non-zero code');
		} catch (error: any) {
			// Verify that the CLI passed the error code back up
			expect(error.code).not.toBe(0);
			// Verify the package manager complained (npm ERR! or similar)
			const output = (error.stdout || '') + (error.stderr || '');
			
			// FIX: Updated expectation to match actual npm output: 'Missing script: "build"'
			// We check for "Missing script" to be robust.
			expect(output).toContain('Missing script: "build"');
		}
	});
});