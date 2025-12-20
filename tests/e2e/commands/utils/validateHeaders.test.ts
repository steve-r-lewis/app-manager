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
import os from 'os';
import { validateHeaders } from '../../../../app/commands/utils/validateHeaders';

describe('E2E: Validate Headers', () => {
	let tempDir: string;
	
	beforeEach(() => {
		tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'am-e2e-headers-'));
	});
	
	afterEach(() => {
		try { fs.rmSync(tempDir, { recursive: true, force: true }); } catch {}
	});
	
	it('should update existing headers in typescript files', async () => {
		const filePath = path.join(tempDir, 'utils.ts');
		
		// FIX: Provide a partial header. The tool looks for @createTime to insert author.
		const initialContent = `/**
 * @project:    old-name
 * @file:       wrong/path.ts
 * @createTime: 2020-01-01
 */
export const a = 1;`;
		
		fs.writeFileSync(filePath, initialContent);
		
		await validateHeaders(tempDir);
		
		const content = fs.readFileSync(filePath, 'utf-8');
		
		// 1. It should correct the file path to '~/utils.ts'
		expect(content).toContain('@file:       ~/utils.ts');
		
		// 2. It should append the author because @createTime existed
		expect(content).toContain('@author:');
	});
});