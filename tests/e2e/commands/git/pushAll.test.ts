/**
 * ================================================================================
 *
 * @project:    app-manager
 * @file:       ~/tests/e2e/commands/git/pushAll.test.ts
 * @version:    1.0.0
 * @createDate: 2025 Dec 28
 * @createTime: 23:39
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
 * V1.0.0, 20251228-23:39
 * Initial creation and release of pushAll.test.ts
 *
 * ================================================================================
 */

import { describe, it, expect, vi, beforeEach, afterEach, beforeAll } from 'vitest';
import fs from 'fs';
import path from 'path';
import { pushAll } from '../../../../app/commands/git/pushAll';
import { simpleGit } from 'simple-git';
import * as prompts from '@clack/prompts';
import { logger } from '../../../../app/services/loggerService';

// --- Mocks ---
vi.mock('simple-git');
vi.mock('@clack/prompts');
// We spy on logger to verify output without mocking it entirely (so it doesn't break)
vi.spyOn(logger, 'success');
vi.spyOn(logger, 'log');

const TEST_ROOT = path.resolve(__dirname, '../../../fixtures/temp_push_all');

describe('pushAll (E2E - File System Scan)', () => {
	let gitMock: any;
	
	beforeAll(() => {
		if (fs.existsSync(TEST_ROOT)) {
			fs.rmSync(TEST_ROOT, { recursive: true, force: true });
		}
		fs.mkdirSync(TEST_ROOT, { recursive: true });
	});
	
	beforeEach(() => {
		vi.clearAllMocks();
		
		// 1. Setup Mock Git
		gitMock = {
			status: vi.fn(),
			push: vi.fn(),
		};
		// When simpleGit(path) is called, return the mock
		vi.mocked(simpleGit).mockReturnValue(gitMock);
		
		// 2. Setup Prompts
		vi.mocked(prompts.confirm).mockResolvedValue(true); // Always say Yes
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
	
	it('should find root and layer repos and attempt push', async () => {
		// 1. Setup File System
		// Create a 'layers' folder with two subfolders
		const layersDir = path.join(TEST_ROOT, 'layers');
		fs.mkdirSync(layersDir);
		fs.mkdirSync(path.join(layersDir, 'billing')); // Valid Repo
		fs.mkdirSync(path.join(layersDir, 'auth'));    // Valid Repo
		fs.mkdirSync(path.join(layersDir, 'ignored')); // Folder but not a git repo
		
		// Create .git markers so our scanner thinks they are repos
		fs.mkdirSync(path.join(TEST_ROOT, '.git'));
		fs.mkdirSync(path.join(layersDir, 'billing', '.git'));
		fs.mkdirSync(path.join(layersDir, 'auth', '.git'));
		// 'ignored' gets no .git folder
		
		// 2. Configure Git Mock Responses
		// We need to return different statuses based on WHICH repo is being checked.
		// simple-git returns a function that returns the instance. We mocked the instance above.
		// But status() needs to change behavior.
		
		gitMock.status
			.mockResolvedValueOnce({ ahead: 1, current: 'main' }) // Root
			.mockResolvedValueOnce({ ahead: 2, current: 'dev' })  // Billing
			.mockResolvedValueOnce({ ahead: 0, current: 'main' }); // Auth (Clean)
		
		// 3. Execute
		await pushAll(TEST_ROOT);
		
		// 4. Assertions
		
		// Discovery Logic Verification
		// Should have logged Root and Billing (Ahead > 0)
		expect(logger.log).toHaveBeenCalledWith(expect.stringContaining('ROOT (App)'));
		expect(logger.log).toHaveBeenCalledWith(expect.stringContaining('billing'));
		
		// Should NOT log Auth (Ahead == 0)
		expect(logger.log).not.toHaveBeenCalledWith(expect.stringContaining('auth'));
		
		// Push Execution Verification
		// Should have called push twice (Root + Billing)
		expect(gitMock.push).toHaveBeenCalledTimes(2);
		expect(logger.success).toHaveBeenCalledWith(expect.stringContaining('Successfully pushed'));
	});
});