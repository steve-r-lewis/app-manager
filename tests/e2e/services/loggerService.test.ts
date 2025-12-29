/**
 * ================================================================================
 *
 * @project:    app-manager
 * @file:       ~/tests/e2e/services/loggerService.test.ts
 * @version:    1.0.0
 * @createDate: 2025 Dec 28
 * @createTime: 21:46
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
 * V1.0.0, 20251228-21:46
 * Initial creation and release of loggerService.test.ts
 *
 * ================================================================================
 */

import { describe, it, expect, afterEach, beforeAll } from 'vitest';
import fs from 'fs';
import path from 'path';
import { logger } from '../../../app/services/loggerService';

const TEST_LOG_DIR = path.resolve(__dirname, '../../fixtures/logs');

describe('LoggerService (E2E - File System)', () => {
	
	beforeAll(() => {
		// Ensure clean slate
		if (fs.existsSync(TEST_LOG_DIR)) {
			fs.rmSync(TEST_LOG_DIR, { recursive: true, force: true });
		}
		fs.mkdirSync(TEST_LOG_DIR, { recursive: true });
	});
	
	afterEach(() => {
		// Cleanup logs after test
		if (fs.existsSync(TEST_LOG_DIR)) {
			fs.rmSync(TEST_LOG_DIR, { recursive: true, force: true });
		}
	});
	
	it('should write logs to file when initialized', () => {
		// 1. Initialize Logger with File Output
		logger.init({
			logToFile: true,
			logPath: TEST_LOG_DIR,
			debug: true
		});
		
		// 2. Perform Logging
		const uniqueMessage = `E2E Log Entry ${Date.now()}`;
		logger.info(uniqueMessage);
		logger.error('Critical E2E Failure Test');
		
		// 3. Verify File Creation
		const files = fs.readdirSync(TEST_LOG_DIR);
		expect(files.length).toBeGreaterThan(0);
		
		const logFile = files.find(f => f.endsWith('.log'));
		expect(logFile).toBeDefined();
		
		// 4. Verify Content
		const content = fs.readFileSync(path.join(TEST_LOG_DIR, logFile!), 'utf-8');
		expect(content).toContain(uniqueMessage);
		expect(content).toContain('Critical E2E Failure Test');
	});
});