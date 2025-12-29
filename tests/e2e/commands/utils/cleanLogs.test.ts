/**
 * ================================================================================
 *
 * @project:    app-manager
 * @file:       ~/tests/e2e/commands/utils/cleanLogs.test.ts
 * @version:    1.0.0
 * @createDate: 2025 Dec 29
 * @createTime: 00:14
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
 * V1.0.0, 20251229-00:14
 * Initial creation and release of cleanLogs.test.ts
 *
 * ================================================================================
 */

/**
 * ================================================================================
 * @project:    app-manager
 * @file:       ~/tests/e2e/commands/utils/cleanLogs.test.ts
 * ================================================================================
 */

import { describe, it, expect, vi, beforeEach, afterEach, beforeAll } from 'vitest';
import fs from 'fs';
import path from 'path';
import { cleanLogs } from '../../../../app/commands/utils/cleanLogs';
import * as prompts from '@clack/prompts';
import { consola } from 'consola';

// --- Mocks ---
vi.mock('@clack/prompts');
vi.mock('consola');

const TEST_ROOT = path.resolve(__dirname, '../../../fixtures/temp_clean_logs');
const LOG_DIR = path.join(TEST_ROOT, 'logs');

describe('cleanLogs (E2E - File System)', () => {
	
	beforeAll(() => {
		if (fs.existsSync(TEST_ROOT)) {
			fs.rmSync(TEST_ROOT, { recursive: true, force: true });
		}
		fs.mkdirSync(TEST_ROOT, { recursive: true });
	});
	
	beforeEach(() => {
		vi.clearAllMocks();
		
		// Default Spinner
		vi.mocked(prompts.spinner).mockReturnValue({
			start: vi.fn(),
			stop: vi.fn(),
			message: vi.fn()
		} as any);
		
		// Default: User confirms deletion
		vi.mocked(prompts.confirm).mockResolvedValue(true);
	});
	
	afterEach(() => {
		if (fs.existsSync(TEST_ROOT)) {
			fs.rmSync(TEST_ROOT, { recursive: true, force: true });
			fs.mkdirSync(TEST_ROOT);
		}
	});
	
	it('should delete log files older than 7 days', async () => {
		// 1. Setup Fixture
		if (!fs.existsSync(LOG_DIR)) fs.mkdirSync(LOG_DIR);
		
		const now = Date.now();
		const oneDay = 24 * 60 * 60 * 1000;
		
		// File A: 1 day old (Should KEEP)
		const recentFile = path.join(LOG_DIR, 'recent.log');
		fs.writeFileSync(recentFile, 'recent data');
		fs.utimesSync(recentFile, new Date(now - oneDay), new Date(now - oneDay));
		
		// File B: 8 days old (Should DELETE)
		const oldFile = path.join(LOG_DIR, 'old.log');
		fs.writeFileSync(oldFile, 'old data');
		fs.utimesSync(oldFile, new Date(now - (8 * oneDay)), new Date(now - (8 * oneDay)));
		
		// 2. Execute
		// Pass test root so it finds our temp logs folder
		await cleanLogs(TEST_ROOT);
		
		// 3. Verify
		expect(fs.existsSync(recentFile)).toBe(true);
		expect(fs.existsSync(oldFile)).toBe(false);
		
		expect(consola.success).toHaveBeenCalledWith(expect.stringContaining('Deleted 1'));
	});
	
	it('should do nothing if logs directory is missing', async () => {
		// 1. Ensure no logs dir
		if (fs.existsSync(LOG_DIR)) fs.rmSync(LOG_DIR, { recursive: true });
		
		// 2. Execute
		await cleanLogs(TEST_ROOT);
		
		// 3. Verify
		expect(consola.warn).toHaveBeenCalledWith(expect.stringContaining('No logs directory'));
	});
	
	it('should abort if user declines confirmation', async () => {
		// 1. Setup Old File
		if (!fs.existsSync(LOG_DIR)) fs.mkdirSync(LOG_DIR);
		const oldFile = path.join(LOG_DIR, 'to_delete.log');
		fs.writeFileSync(oldFile, 'data');
		// Make it very old
		const oldDate = new Date(Date.now() - (100 * 24 * 60 * 60 * 1000));
		fs.utimesSync(oldFile, oldDate, oldDate);
		
		// 2. User says NO
		vi.mocked(prompts.confirm).mockResolvedValue(false);
		
		// 3. Execute
		await cleanLogs(TEST_ROOT);
		
		// 4. Verify
		expect(fs.existsSync(oldFile)).toBe(true);
		expect(prompts.outro).toHaveBeenCalledWith(expect.stringContaining('cancelled'));
	});
});