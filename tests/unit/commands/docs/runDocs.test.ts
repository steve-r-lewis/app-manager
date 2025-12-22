/**
 * ================================================================================
 *
 * @project:    app-manager
 * @file:       ~/tests/unit/commands/docs/runDocs.test.ts
 * @version:    1.0.0
 * @createDate: 2025 Dec 18
 * @createTime: 22:55
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
 * V1.0.0, 20251218-22:55
 * Initial creation and release of runDocs.test.ts
 *
 * ================================================================================
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { runDocs } from '../../../../app/commands/docs/runDocs';
import { setupTestContext } from '../../../helpers/testContext';
import fs from 'fs';
import path from 'path';
import * as prompts from '@clack/prompts';

// Mock Prompts
vi.mock('@clack/prompts', async (importOriginal) => ({
	...(await importOriginal<typeof import('@clack/prompts')>()),
	select: vi.fn(),
	isCancel: vi.fn()
}));

// Use vi.hoisted for variables needed in vi.mock
const { mockSpawn } = vi.hoisted(() => {
	return { mockSpawn: vi.fn() };
});

vi.mock('child_process', () => ({
	spawn: mockSpawn
}));

describe('Command: runDocs', () => {
	let ctx: ReturnType<typeof setupTestContext>;
	const mockSelect = prompts.select as unknown as ReturnType<typeof vi.fn>;
	const toolRoot = '/mock/tool/root';
	
	beforeEach(() => {
		ctx = setupTestContext();
		vi.clearAllMocks();
		
		// Setup spawn mock behavior
		mockSpawn.mockReturnValue({
			on: (event: string, cb: Function) => {
				if (event === 'close') cb(0); // Exit code 0
			},
			stdout: { on: vi.fn() },
			stderr: { on: vi.fn() }
		});
	});
	
	afterEach(() => {
		ctx.restore();
	});
	
	it('should show ONLY Tool Docs option if target has no vitepress', async () => {
		const pkgPath = path.join(ctx.targetRoot, 'package.json');
		fs.writeFileSync(pkgPath, JSON.stringify({ dependencies: {} }));
		
		mockSelect.mockResolvedValue('back');
		
		await runDocs(ctx.targetRoot, toolRoot);
		
		const calls = mockSelect.mock.calls[0][0];
		const options = calls.options;
		
		expect(options).toHaveLength(2);
		expect(options[0].label).toContain('App Manager Docs');
	});
	
	it('should show Project Docs options if vitepress is installed', async () => {
		const pkgPath = path.join(ctx.targetRoot, 'package.json');
		fs.writeFileSync(pkgPath, JSON.stringify({
			devDependencies: { vitepress: "^1.0.0" }
		}));
		
		mockSelect.mockResolvedValue('back');
		
		await runDocs(ctx.targetRoot, toolRoot);
		
		const calls = mockSelect.mock.calls[0][0];
		const options = calls.options;
		
		expect(options.length).toBeGreaterThan(3);
		expect(options.some((o: any) => o.value === 'project:dev')).toBe(true);
	});
	
	it('should spawn vitepress dev for Project', async () => {
		const pkgPath = path.join(ctx.targetRoot, 'package.json');
		fs.writeFileSync(pkgPath, JSON.stringify({ devDependencies: { vitepress: "1.0" } }));
		
		mockSelect.mockResolvedValue('project:dev');
		
		await runDocs(ctx.targetRoot, toolRoot);
		
		expect(mockSpawn).toHaveBeenCalledWith(
			'npx',
			['vitepress', 'dev'],
			expect.objectContaining({ cwd: ctx.targetRoot })
		);
	});
	
	// NEW TEST CASE: Restore count to 74
	it('should spawn vitepress build for Project', async () => {
		const pkgPath = path.join(ctx.targetRoot, 'package.json');
		fs.writeFileSync(pkgPath, JSON.stringify({ devDependencies: { vitepress: "1.0" } }));
		
		mockSelect.mockResolvedValue('project:build');
		
		await runDocs(ctx.targetRoot, toolRoot);
		
		expect(mockSpawn).toHaveBeenCalledWith(
			'npx',
			['vitepress', 'build'],
			expect.objectContaining({ cwd: ctx.targetRoot })
		);
	});
	
	it('should spawn vitepress dev for Tool', async () => {
		const pkgPath = path.join(ctx.targetRoot, 'package.json');
		fs.writeFileSync(pkgPath, '{}');
		
		mockSelect.mockResolvedValue('tool:dev');
		
		await runDocs(ctx.targetRoot, toolRoot);
		
		expect(mockSpawn).toHaveBeenCalledWith(
			expect.any(String),
			['vitepress', 'dev'],
			expect.objectContaining({ cwd: toolRoot })
		);
	});
});