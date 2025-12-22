/**
 * ================================================================================
 *
 * @project:    app-manager
 * @file:       ~/tests/e2e/services/processService.test.ts
 * @version:    1.0.0
 * @createDate: 2025 Dec 22
 * @createTime: 02:12
 * @author:     Steve R Lewis
 *
 * ================================================================================
 *
 * @description:
 * E2E test for ProcessService. Verifies real file system detection and
 * actual OS process execution using the service.
 *
 * ================================================================================
 *
 * @notes: Revision History
 *
 * V1.0.0, 20251222-02:12
 * Initial creation and release of processService.test.ts
 *
 * ================================================================================
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { processService } from '../../../app/services/processService';
import { setupTestContext } from '../../helpers/testContext';
import fs from 'fs';
import path from 'path';

describe('E2E: ProcessService (Black Box)', () => {
	let ctx: ReturnType<typeof setupTestContext>;
	
	beforeEach(() => {
		ctx = setupTestContext();
	});
	
	afterEach(() => {
		ctx.restore();
	});
	
	it('should correctly detect package managers from real files', () => {
		// 1. Create a fake pnpm-lock.yaml
		fs.writeFileSync(path.join(ctx.targetRoot, 'pnpm-lock.yaml'), '');
		expect(processService.detectPackageManager(ctx.targetRoot)).toBe('pnpm');
		
		// 2. Remove it and add bun.lockb
		fs.rmSync(path.join(ctx.targetRoot, 'pnpm-lock.yaml'));
		fs.writeFileSync(path.join(ctx.targetRoot, 'bun.lockb'), '');
		expect(processService.detectPackageManager(ctx.targetRoot)).toBe('bun');
		
		// 3. Clean and verify default
		fs.rmSync(path.join(ctx.targetRoot, 'bun.lockb'));
		expect(processService.detectPackageManager(ctx.targetRoot)).toBe('npm');
	});
	
	it('should execute a real shell command and return exit code 0', async () => {
		// We use 'node -v' as it is guaranteed to exist in this environment
		const code = await processService.run('node', ['-v'], ctx.targetRoot, { silent: true });
		expect(code).toBe(0);
	});
	
	it('should return non-zero exit code for invalid commands', async () => {
		// Attempt to run a command that definitely doesn't exist
		const code = await processService.run('invalid-command-xyz', [], ctx.targetRoot, { silent: true });
		expect(code).not.toBe(0);
	});
});