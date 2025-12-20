/**
 * ================================================================================
 *
 * @project:    app-manager
 * @file:       ~/tests/unit/commands/utils/cleanLogs.test.ts
 * @version:    1.0.0
 * @createDate: 2025 Dec 19
 * @createTime: 20:19
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
 * V1.0.0, 20251219-20:19
 * Initial creation and release of cleanLogs.test.ts
 *
 * ================================================================================
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { cleanLogs } from '../../../../app/commands/utils/cleanLogs';
import { setupTestContext } from '../../../utils/test-context';
import fs from 'fs';
import path from 'path';
import * as prompts from '@clack/prompts';

// Mock Prompts
vi.mock('@clack/prompts', async (importOriginal) => ({
	...(await importOriginal<typeof import('@clack/prompts')>()),
	confirm: vi.fn(),
	spinner: () => ({ start: vi.fn(), stop: vi.fn() })
}));

describe('Command: cleanLogs', () => {
	let ctx: ReturnType<typeof setupTestContext>;
	const mockConfirm = prompts.confirm as unknown as ReturnType<typeof vi.fn>;
	
	beforeEach(() => {
		ctx = setupTestContext();
		vi.clearAllMocks();
	});
	
	afterEach(() => {
		ctx.restore();
	});
	
	it('should find and delete logs and mock fixtures', async () => {
		// 1. Setup Environment
		const logsDir = path.join(ctx.targetRoot, 'app-monitor', 'test-logs');
		const fixturesDir = path.join(ctx.targetRoot, 'tests', 'fixtures');
		
		fs.mkdirSync(logsDir, { recursive: true });
		fs.mkdirSync(fixturesDir, { recursive: true });
		
		// Create Artifacts
		const logFile = path.join(logsDir, 'test-report-123.json');
		fs.writeFileSync(logFile, '{}');
		
		const mockDir = path.join(fixturesDir, 'mock-abc');
		fs.mkdirSync(mockDir);
		
		// Create a "Safe" fixture (Should NOT be deleted)
		const safeDir = path.join(fixturesDir, 'static-data');
		fs.mkdirSync(safeDir);
		
		// 2. Execute
		mockConfirm.mockResolvedValue(true); // User says Yes
		
		await cleanLogs(ctx.targetRoot);
		
		// 3. Verify
		expect(fs.existsSync(logFile)).toBe(false);        // Deleted
		expect(fs.existsSync(mockDir)).toBe(false);        // Deleted
		expect(fs.existsSync(safeDir)).toBe(true);         // Preserved
	});
	
	it('should abort if user cancels', async () => {
		const logsDir = path.join(ctx.targetRoot, 'app-monitor', 'test-logs');
		fs.mkdirSync(logsDir, { recursive: true });
		const logFile = path.join(logsDir, 'report.json');
		fs.writeFileSync(logFile, '{}');
		
		mockConfirm.mockResolvedValue(false); // User says No
		
		await cleanLogs(ctx.targetRoot);
		
		expect(fs.existsSync(logFile)).toBe(true); // Still there
	});
	
	it('should handle empty directories gracefully', async () => {
		// No logs or fixtures exist
		mockConfirm.mockResolvedValue(true);
		
		await cleanLogs(ctx.targetRoot);
		
		// Should just return without error or prompt
		expect(mockConfirm).not.toHaveBeenCalled();
	});
});