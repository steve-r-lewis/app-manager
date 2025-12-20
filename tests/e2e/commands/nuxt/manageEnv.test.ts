/**
 * ================================================================================
 *
 * @project:    app-manager
 * @file:       ~/tests/e2e/commands/nuxt/manageEnv.test.ts
 * @version:    1.0.0
 * @createDate: 2025 Dec 19
 * @createTime: 23:43
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
 * V1.0.0, 20251219-23:43
 * Initial creation and release of manageEnv.test.ts
 *
 * ================================================================================
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import fs from 'fs';
import path from 'path';
import os from 'os';
// Correct import path (4 levels up)
import { manageEnv } from '../../../../app/commands/nuxt/manageEnv';

describe('E2E: Manage Env', () => {
	let tempDir: string;
	
	beforeEach(() => {
		tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'am-e2e-env-'));
	});
	
	afterEach(() => {
		try { fs.rmSync(tempDir, { recursive: true, force: true }); } catch {}
	});
	
	it('should physically delete build artifacts', async () => {
		const dirs = ['node_modules', '.nuxt', '.output', 'dist'];
		dirs.forEach(d => fs.mkdirSync(path.join(tempDir, d), { recursive: true }));
		
		globalThis.mockSelect.mockResolvedValue('clean');
		globalThis.mockMultiselect.mockResolvedValue(dirs);
		globalThis.mockConfirm.mockResolvedValue(true);
		
		// FIX: Pass tempDir explicitly
		await manageEnv(tempDir);
		
		dirs.forEach(d => {
			expect(fs.existsSync(path.join(tempDir, d))).toBe(false);
		});
	});
});