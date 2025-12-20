/**
 * ================================================================================
 *
 * @project:    app-manager
 * @file:       ~/tests/unit/commands/nuxt/manageEnv.test.ts
 * @version:    1.0.0
 * @createDate: 2025 Dec 19
 * @createTime: 00:40
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
 * V1.0.0, 20251219-00:40
 * Initial creation and release of manageEnv.test.ts
 *
 * ================================================================================
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { manageEnv } from '../../../../app/commands/nuxt/manageEnv';
import { setupTestContext } from '../../../utils/test-context';
import fs from 'fs';
import path from 'path';

// 1. Mock Consola
vi.mock('consola', () => ({
	consola: {
		info: vi.fn(),
		warn: vi.fn(),
		error: vi.fn(),
		success: vi.fn()
	}
}));

// 2. Mock Child Process
const { mockSpawn } = vi.hoisted(() => {
	return { mockSpawn: vi.fn() };
});
vi.mock('child_process', () => ({ spawn: mockSpawn }));

describe('Command: manageEnv', () => {
	let ctx: ReturnType<typeof setupTestContext>;
	
	beforeEach(() => {
		ctx = setupTestContext();
		vi.clearAllMocks();
		
		mockSpawn.mockReturnValue({
			on: (event: string, cb: Function) => {
				if (event === 'close') cb(0);
			},
			stdout: { on: vi.fn() },
			stderr: { on: vi.fn() }
		});
	});
	
	afterEach(() => {
		ctx.restore();
	});
	
	it('should recursively clean artifacts', async () => {
		const layerDir = path.join(ctx.targetRoot, 'layers', 'billing');
		const dirs = ['.nuxt', '.output', 'dist', '.cache', 'node_modules'];
		
		dirs.forEach(d => {
			fs.mkdirSync(path.join(ctx.targetRoot, d), { recursive: true });
			fs.mkdirSync(path.join(layerDir, d), { recursive: true });
		});
		
		// Use 'Once' to ensure clean state
		globalThis.mockSelect.mockResolvedValueOnce('clean');
		globalThis.mockMultiselect.mockResolvedValueOnce(dirs);
		globalThis.mockConfirm.mockResolvedValueOnce(true);
		
		await manageEnv(ctx.targetRoot);
		
		dirs.forEach(d => {
			expect(fs.existsSync(path.join(ctx.targetRoot, d))).toBe(false);
		});
	});
	
	it('should detect package manager and install', async () => {
		fs.writeFileSync(path.join(ctx.targetRoot, 'yarn.lock'), '');
		
		// Precise Sequence:
		// 1. Select 'reinstall'
		globalThis.mockSelect.mockResolvedValueOnce('reinstall');
		// 2. Select 'node_modules' to delete (must return array > 0)
		globalThis.mockMultiselect.mockResolvedValueOnce(['node_modules']);
		// 3. Confirm deletion
		globalThis.mockConfirm.mockResolvedValueOnce(true);
		
		await manageEnv(ctx.targetRoot);
		
		// Verification
		expect(mockSpawn).toHaveBeenCalledWith(
			'yarn',
			['install'],
			expect.objectContaining({ cwd: ctx.targetRoot })
		);
	});
	
	it('should abort destructive actions if not confirmed', async () => {
		const dist = path.join(ctx.targetRoot, 'dist');
		fs.mkdirSync(dist);
		
		globalThis.mockSelect.mockResolvedValueOnce('clean');
		globalThis.mockMultiselect.mockResolvedValueOnce(['dist']);
		globalThis.mockConfirm.mockResolvedValueOnce(false); // User says No
		
		await manageEnv(ctx.targetRoot);
		
		expect(fs.existsSync(dist)).toBe(true);
	});
});