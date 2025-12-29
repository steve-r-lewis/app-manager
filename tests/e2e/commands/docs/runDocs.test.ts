/**
 * ================================================================================
 *
 * @project:    app-manager
 * @file:       ~/tests/e2e/commands/docs/runDocs.test.ts
 * @version:    1.0.0
 * @createDate: 2025 Dec 28
 * @createTime: 23:06
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
 * V1.0.0, 20251228-23:06
 * Initial creation and release of runDocs.test.ts
 *
 * ================================================================================
 */

import { describe, it, expect, vi, beforeEach, afterEach, beforeAll } from 'vitest';
import fs from 'fs';
import path from 'path';
import { runDocs } from '../../../../app/commands/docs/runDocs';
import { processService } from '../../../../app/services/processService';
import * as prompts from '@clack/prompts';
import { consola } from 'consola';

// --- Mocks ---
// We mock process execution to prevent actually spinning up a local server
vi.mock('../../../../app/services/processService');
vi.mock('@clack/prompts');
vi.mock('consola');

const TEST_ROOT = path.resolve(__dirname, '../../../fixtures/temp_run_docs');

describe('runDocs (E2E - File System)', () => {
	
	beforeAll(() => {
		if (fs.existsSync(TEST_ROOT)) {
			fs.rmSync(TEST_ROOT, { recursive: true, force: true });
		}
		fs.mkdirSync(TEST_ROOT, { recursive: true });
	});
	
	beforeEach(() => {
		vi.clearAllMocks();
		
		// Default: User selects 'dev' if prompted
		vi.mocked(prompts.select).mockResolvedValue('dev');
		vi.mocked(prompts.spinner).mockReturnValue({
			start: vi.fn(),
			stop: vi.fn(),
			message: vi.fn()
		} as any);
		
		// Default: Assume pnpm
		vi.mocked(processService.detectPackageManager).mockReturnValue('pnpm');
	});
	
	afterEach(() => {
		// Cleanup
		if (fs.existsSync(TEST_ROOT)) {
			fs.rmSync(TEST_ROOT, { recursive: true, force: true });
			fs.mkdirSync(TEST_ROOT);
		}
	});
	
	it('should identify "docs:dev" script and run it', async () => {
		// 1. Setup Fixture
		const pkgJson = {
			scripts: {
				"docs:dev": "vitepress dev docs",
				"docs:build": "vitepress build docs"
			}
		};
		fs.writeFileSync(path.join(TEST_ROOT, 'package.json'), JSON.stringify(pkgJson));
		
		// 2. Execute
		// Assuming runDocs defaults to prompt, we mocked 'dev' above
		await runDocs(TEST_ROOT);
		
		// 3. Verify
		// Should look for package manager
		expect(processService.detectPackageManager).toHaveBeenCalledWith(TEST_ROOT);
		
		// Should execute the command
		expect(processService.run).toHaveBeenCalledWith(
			'pnpm',
			['run', 'docs:dev'],
			TEST_ROOT
		);
	});
	
	it('should handle missing scripts gracefully', async () => {
		// 1. Setup Fixture (No docs scripts)
		const pkgJson = {
			scripts: {
				"test": "vitest"
			}
		};
		fs.writeFileSync(path.join(TEST_ROOT, 'package.json'), JSON.stringify(pkgJson));
		
		// 2. Execute
		await runDocs(TEST_ROOT);
		
		// 3. Verify
		// Should NOT run any process
		expect(processService.run).not.toHaveBeenCalled();
		
		// Should alert user
		expect(consola.warn).toHaveBeenCalledWith(expect.stringContaining('No documentation scripts found'));
	});
	
	it('should execute build command if user selects "build"', async () => {
		// 1. Setup Fixture
		const pkgJson = {
			scripts: {
				"docs:dev": "vitepress dev",
				"docs:build": "vitepress build"
			}
		};
		fs.writeFileSync(path.join(TEST_ROOT, 'package.json'), JSON.stringify(pkgJson));
		
		// 2. User Interaction: Select 'build'
		vi.mocked(prompts.select).mockResolvedValue('build');
		
		// 3. Execute
		await runDocs(TEST_ROOT);
		
		// 4. Verify
		expect(processService.run).toHaveBeenCalledWith(
			'pnpm',
			['run', 'docs:build'],
			TEST_ROOT
		);
	});
});