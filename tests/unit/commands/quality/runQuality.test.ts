/**
 * ================================================================================
 *
 * @project:    app-manager
 * @file:       ~/tests/unit/commands/quality/runQuality.test.ts
 * @version:    1.0.1
 * @createDate: 2025 Dec 19
 * @createTime: 00:46
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
 * V1.0.1, 20251226-1913
 * Added author attribution.
 *
 * V1.0.0, 20251219-00:46
 * Initial creation and release of runQuality.test.ts
 *
 * ================================================================================
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { runQuality } from '../../../../app/commands/quality/runQuality';
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

// Use vi.hoisted for spawn mock
const { mockSpawn } = vi.hoisted(() => {
	return { mockSpawn: vi.fn() };
});

vi.mock('child_process', () => ({
	spawn: mockSpawn
}));

describe('Command: runQuality', () => {
	let ctx: ReturnType<typeof setupTestContext>;
	const mockSelect = prompts.select as unknown as ReturnType<typeof vi.fn>;
	const toolRoot = '/mock/tool/root';
	
	beforeEach(() => {
		ctx = setupTestContext();
		vi.clearAllMocks();
		
		// Setup successful spawn mock
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
	
	it('should run lint script in TARGET scope', async () => {
		fs.writeFileSync(path.join(ctx.targetRoot, 'package.json'), JSON.stringify({
			scripts: { lint: "eslint ." }
		}));
		
		mockSelect
			.mockResolvedValueOnce('target')
			.mockResolvedValueOnce('lint');
		
		await runQuality(ctx.targetRoot, toolRoot);
		
		expect(mockSpawn).toHaveBeenCalledWith(
			'npm',
			['run', 'lint'],
			expect.objectContaining({ cwd: ctx.targetRoot })
		);
	});
	
	// NEW TEST: Restore count to 75
	it('should run typecheck script', async () => {
		fs.writeFileSync(path.join(ctx.targetRoot, 'package.json'), JSON.stringify({
			scripts: { typecheck: "vue-tsc --noEmit" }
		}));
		
		mockSelect
			.mockResolvedValueOnce('target')
			.mockResolvedValueOnce('typecheck');
		
		await runQuality(ctx.targetRoot, toolRoot);
		
		expect(mockSpawn).toHaveBeenCalledWith(
			'npm',
			['run', 'typecheck'],
			expect.objectContaining({ cwd: ctx.targetRoot })
		);
	});
	
	it('should run Vitest UI in TOOL scope', async () => {
		const fakeToolRoot = ctx.targetRoot;
		fs.writeFileSync(path.join(fakeToolRoot, 'package.json'), JSON.stringify({
			devDependencies: { vitest: "^1.0.0" }
		}));
		
		mockSelect
			.mockResolvedValueOnce('tool')
			.mockResolvedValueOnce('vitest:ui');
		
		await runQuality(ctx.targetRoot, fakeToolRoot);
		
		expect(mockSpawn).toHaveBeenCalledWith(
			'npx',
			['vitest', '--ui'],
			expect.objectContaining({ cwd: fakeToolRoot })
		);
	});
	
	it('should prioritize package.json scripts over direct execution', async () => {
		fs.writeFileSync(path.join(ctx.targetRoot, 'package.json'), JSON.stringify({
			scripts: { test: "jest" },
			devDependencies: { vitest: "^1.0.0" }
		}));
		
		mockSelect.mockResolvedValueOnce('target');
		
		await runQuality(ctx.targetRoot, toolRoot);
		
		const calls = mockSelect.mock.calls;
		const actionOptions = calls[1][0].options;
		
		expect(actionOptions.find((o: any) => o.value === 'test')).toBeDefined();
		expect(actionOptions.find((o: any) => o.value === 'vitest')).toBeUndefined();
	});
});