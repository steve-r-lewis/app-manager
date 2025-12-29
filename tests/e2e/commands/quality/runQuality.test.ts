/**
 * ================================================================================
 *
 * @project:    app-manager
 * @file:       ~/tests/e2e/commands/quality/runQuality.test.ts
 * @version:    1.0.0
 * @createDate: 2025 Dec 29
 * @createTime: 00:00
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
 * V1.0.0, 20251229-00:00
 * Initial creation and release of runQuality.test.ts
 *
 * ================================================================================
 */

import { describe, it, expect, vi, beforeEach, afterEach, beforeAll } from 'vitest';
import fs from 'fs';
import path from 'path';
import { runQuality } from '../../../../app/commands/quality/runQuality';
import { processService } from '../../../../app/services/processService';
import * as prompts from '@clack/prompts';
import { consola } from 'consola';

// --- Mocks ---
// Mock execution to prevent running actual linters
vi.mock('../../../../app/services/processService');
vi.mock('@clack/prompts');
vi.mock('consola');

const TEST_ROOT = path.resolve(__dirname, '../../../fixtures/temp_run_quality');

describe('runQuality (E2E - Pipeline)', () => {
	
	beforeAll(() => {
		if (fs.existsSync(TEST_ROOT)) {
			fs.rmSync(TEST_ROOT, { recursive: true, force: true });
		}
		fs.mkdirSync(TEST_ROOT, { recursive: true });
	});
	
	beforeEach(() => {
		vi.clearAllMocks();
		
		// Default: PM is pnpm
		vi.mocked(processService.detectPackageManager).mockReturnValue('pnpm');
		
		// Default: Process succeeds (exit code 0)
		vi.mocked(processService.run).mockResolvedValue(0);
		
		// Default: Spinner mocks
		vi.mocked(prompts.spinner).mockReturnValue({
			start: vi.fn(),
			stop: vi.fn(),
			message: vi.fn()
		} as any);
	});
	
	afterEach(() => {
		if (fs.existsSync(TEST_ROOT)) {
			fs.rmSync(TEST_ROOT, { recursive: true, force: true });
			fs.mkdirSync(TEST_ROOT);
		}
	});
	
	it('should run all quality checks if scripts exist', async () => {
		// 1. Setup Fixture
		const pkgJson = {
			scripts: {
				"lint": "eslint .",
				"typecheck": "tsc --noEmit",
				"test": "vitest"
			}
		};
		fs.writeFileSync(path.join(TEST_ROOT, 'package.json'), JSON.stringify(pkgJson));
		
		// 2. Execute
		await runQuality(TEST_ROOT);
		
		// 3. Verify Sequence
		// Should detect pnpm
		expect(processService.detectPackageManager).toHaveBeenCalledWith(TEST_ROOT);
		
		// Should run Lint
		expect(processService.run).toHaveBeenCalledWith('pnpm', ['run', 'lint'], TEST_ROOT);
		// Should run Typecheck
		expect(processService.run).toHaveBeenCalledWith('pnpm', ['run', 'typecheck'], TEST_ROOT);
		// Should run Test
		expect(processService.run).toHaveBeenCalledWith('pnpm', ['run', 'test'], TEST_ROOT);
		
		expect(consola.success).toHaveBeenCalledWith(expect.stringContaining('All checks passed'));
	});
	
	it('should gracefully skip missing scripts', async () => {
		// 1. Setup Fixture (Only Lint available)
		const pkgJson = {
			scripts: {
				"lint": "eslint ."
				// No test, no typecheck
			}
		};
		fs.writeFileSync(path.join(TEST_ROOT, 'package.json'), JSON.stringify(pkgJson));
		
		// 2. Execute
		await runQuality(TEST_ROOT);
		
		// 3. Verify
		// Should run Lint
		expect(processService.run).toHaveBeenCalledWith('pnpm', ['run', 'lint'], TEST_ROOT);
		
		// Should NOT run Typecheck/Test
		expect(processService.run).not.toHaveBeenCalledWith('pnpm', ['run', 'typecheck'], TEST_ROOT);
		expect(processService.run).not.toHaveBeenCalledWith('pnpm', ['run', 'test'], TEST_ROOT);
	});
	
	it('should halt immediately if a check fails', async () => {
		// 1. Setup Fixture
		const pkgJson = {
			scripts: {
				"lint": "eslint .",
				"test": "vitest"
			}
		};
		fs.writeFileSync(path.join(TEST_ROOT, 'package.json'), JSON.stringify(pkgJson));
		
		// 2. Mock Failure
		// First call (Lint) returns 1 (Error)
		vi.mocked(processService.run).mockResolvedValueOnce(1);
		
		// 3. Execute
		await runQuality(TEST_ROOT);
		
		// 4. Verify
		// Lint ran
		expect(processService.run).toHaveBeenCalledWith('pnpm', ['run', 'lint'], TEST_ROOT);
		
		// Test should NOT run because Lint failed
		expect(processService.run).not.toHaveBeenCalledWith('pnpm', ['run', 'test'], TEST_ROOT);
		
		expect(consola.error).toHaveBeenCalledWith(expect.stringContaining('failed'));
	});
});