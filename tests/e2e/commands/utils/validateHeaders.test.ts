/**
 * ================================================================================
 *
 * @project:    app-manager
 * @file:       ~/tests/e2e/commands/utils/validateHeaders.test.ts
 * @version:    1.0.0
 * @createDate: 2025 Dec 19
 * @createTime: 23:45
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
 * V1.0.0, 20251219-23:45
 * Initial creation and release of validateHeaders.test.ts
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
// Point to the entry file
const CLI_ENTRY = path.resolve(__dirname, '../../../../index.ts');

describe('E2E: Validate Headers (Black Box)', () => {
	let ctx: ReturnType<typeof setupTestContext>;
	
	beforeEach(() => {
		ctx = setupTestContext();
	});
	
	afterEach(() => {
		ctx.restore();
	});
	
	it('should update headers when running "am utils headers"', async () => {
		// 1. Setup Environment
		const filePath = path.join(ctx.targetRoot, 'utils.ts');
		
		// Fix: Add a WRONG @file tag so we can prove the tool fixes it
		const initialContent = `/**
 * @project:    old-name
 * @file:       wrong/path.ts
 * @createTime: 2025-01-01
 */
export const a = 1;`;
		
		fs.writeFileSync(filePath, initialContent);
		
		// 2. Run CLI via Child Process
		await execPromise(`npx tsx ${CLI_ENTRY} utils headers`, {
			cwd: ctx.targetRoot,
			env: { ...process.env }
		});
		
		// 3. Verify Artifacts
		const content = fs.readFileSync(filePath, 'utf-8');
		const rootName = path.basename(ctx.targetRoot);
		
		// FIX: Use Regex to match "@project:" followed by ANY amount of whitespace
		// This handles "@project: name" and "@project:    name" equally well.
		expect(content).toMatch(new RegExp(`@project:\\s+${rootName}`));
		
		// Check for File Path Update
		expect(content).toMatch(/@file:\s+~\/utils.ts/);
		
		// Check for Author Insertion
		expect(content).toMatch(/@author:/);
	});
});