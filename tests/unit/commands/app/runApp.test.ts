/**
 * ================================================================================
 *
 * @project:    app-manager
 * @file:       ~/tests/unit/commands/app/runApp.test.ts
 * @version:    1.0.0
 * @createDate: 2025 Dec 18
 * @createTime: 22:37
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
 * V1.0.0, 20251218-22:37
 * Initial creation and release of runApp.test.ts
 *
 * ================================================================================
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { runApp } from '../../../../app/commands/app/runApp';
import { setupTestContext } from '../../../utils/test-context';
import fs from 'fs';
import path from 'path';
import { consola } from 'consola';
import * as prompts from '@clack/prompts';
import { spawn } from 'child_process';

// 1. Mock External Dependencies
vi.mock('child_process', () => ({
	spawn: vi.fn()
}));

vi.mock('@clack/prompts', async (importOriginal) => {
	return {
		...(await importOriginal<typeof import('@clack/prompts')>()),
		select: vi.fn(),
		isCancel: vi.fn(),
	};
});

describe('Command: runApp', () => {
	let ctx: ReturnType<typeof setupTestContext>;
	const mockSpawn = spawn as unknown as ReturnType<typeof vi.fn>;
	const mockSelect = prompts.select as unknown as ReturnType<typeof vi.fn>;
	
	// Helper to simulate child_process behavior
	const setupSpawnMock = (exitCode = 0, error?: Error) => {
		mockSpawn.mockImplementation(() => ({
			on: (event: string, callback: any) => {
				if (event === 'close') callback(exitCode);
				if (event === 'error' && error) callback(error);
			},
			stdout: { on: vi.fn() },
			stderr: { on: vi.fn() }
		}));
	};
	
	beforeEach(() => {
		ctx = setupTestContext();
		vi.clearAllMocks();
		// Default happy path for spawn
		setupSpawnMock(0);
		// Default happy path for prompts
		mockSelect.mockResolvedValue('dev');
	});
	
	afterEach(() => {
		ctx.restore();
		vi.restoreAllMocks();
	});
	
	it('should exit early if package.json is missing', async () => {
		// No files created in ctx.targetRoot
		await runApp(ctx.targetRoot);
		
		// Should not prompt user
		expect(mockSelect).not.toHaveBeenCalled();
	});
	
	it('should warn if package.json has no scripts', async () => {
		// Create empty package.json
		fs.writeFileSync(path.join(ctx.targetRoot, 'package.json'), JSON.stringify({}));
		
		await runApp(ctx.targetRoot);
		
		expect(mockSelect).not.toHaveBeenCalled();
	});
	
	it('should detect pnpm from lockfile and run selected script', async () => {
		// Setup Files
		fs.writeFileSync(path.join(ctx.targetRoot, 'package.json'), JSON.stringify({
			scripts: { dev: 'nuxt dev' }
		}));
		fs.writeFileSync(path.join(ctx.targetRoot, 'pnpm-lock.yaml'), ''); // Signal pnpm
		
		// Setup User Choice
		mockSelect.mockResolvedValue('dev');
		
		await runApp(ctx.targetRoot);
		
		// Verify Detection & Execution
		expect(mockSpawn).toHaveBeenCalledWith(
			'pnpm',
			['run', 'dev'],
			expect.objectContaining({ stdio: 'inherit' })
		);
	});
	
	it('should detect yarn from lockfile', async () => {
		fs.writeFileSync(path.join(ctx.targetRoot, 'package.json'), JSON.stringify({
			scripts: { build: 'nuxt build' }
		}));
		fs.writeFileSync(path.join(ctx.targetRoot, 'yarn.lock'), '');
		
		mockSelect.mockResolvedValue('build');
		
		await runApp(ctx.targetRoot);
		
		expect(mockSpawn).toHaveBeenCalledWith('yarn', ['run', 'build'], expect.any(Object));
	});
	
	it('should default to npm if no lockfile exists', async () => {
		fs.writeFileSync(path.join(ctx.targetRoot, 'package.json'), JSON.stringify({
			scripts: { start: 'node index.js' }
		}));
		
		mockSelect.mockResolvedValue('start');
		
		await runApp(ctx.targetRoot);
		
		expect(mockSpawn).toHaveBeenCalledWith('npm', ['run', 'start'], expect.any(Object));
	});
	
	it('should handle script execution failure (non-zero exit code)', async () => {
		fs.writeFileSync(path.join(ctx.targetRoot, 'package.json'), JSON.stringify({
			scripts: { test: 'vitest' }
		}));
		
		mockSelect.mockResolvedValue('test');
		
		// Simulate Failure
		setupSpawnMock(1);
		
		// Spy on logger
		const errorSpy = vi.spyOn(consola, 'error');
		
		await runApp(ctx.targetRoot);
		
		expect(errorSpy).toHaveBeenCalledWith(
			expect.stringContaining('Exit Code: 1')
		);
	});
	
	it('should do nothing if user cancels selection', async () => {
		fs.writeFileSync(path.join(ctx.targetRoot, 'package.json'), JSON.stringify({
			scripts: { dev: 'nuxt dev' }
		}));
		
		// Mock Cancel
		mockSelect.mockResolvedValue(Symbol('cancel'));
		(prompts.isCancel as any).mockReturnValue(true);
		
		await runApp(ctx.targetRoot);
		
		expect(mockSpawn).not.toHaveBeenCalled();
	});
});