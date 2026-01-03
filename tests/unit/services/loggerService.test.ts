/**
 * ================================================================================
 *
 * @project:    app-manager
 * @file:       ~/tests/unit/services/loggerService.test.ts
 * @version:    1.0.0
 * @createDate: 2026 Jan 02
 * @createTime: 00:39
 * @author:     Steve R Lewis
 *
 * ================================================================================
 *
 * @description:
 * Unit Test Suite for the Logger Service.
 *
 * Verifies that the logger correctly handles different message levels
 * and formatting requirements.
 *
 * ================================================================================
 *
 * @notes: Revision History
 *
 * V1.0.1, 20260102-01:00
 * - Moved spy initialization to beforeEach() to ensure proper interception
 * of the global console object.
 * - Added explicit vi.restoreAllMocks() to clean up after tests.
 *
 * V1.0.0, 20260102-00:39
 * Initial creation and release of loggerService.test.ts
 *
 * ================================================================================
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { logger } from '../../../app/services/loggerService';

describe('LoggerService', () => {
	
	// Declare spies types (inferred mostly, but kept loose for simplicity)
	let logSpy: any;
	let warnSpy: any;
	let errorSpy: any;
	
	beforeEach(() => {
		// Initialize spies BEFORE every test runs.
		// .mockImplementation(() => {}) silences the console output during tests
		logSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
		warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
		errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
	});
	
	afterEach(() => {
		// Restore original console methods so other tests aren't affected
		vi.restoreAllMocks();
	});
	
	it('should log info messages', () => {
		logger.info('Test Info');
		expect(logSpy).toHaveBeenCalledWith(expect.stringContaining('Test Info'));
	});
	
	it('should log success messages', () => {
		logger.success('Operation Successful');
		// Success uses console.log under the hood
		expect(logSpy).toHaveBeenCalledWith(expect.stringContaining('Operation Successful'));
	});
	
	it('should log warning messages', () => {
		logger.warn('Careful now');
		expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining('Careful now'));
	});
	
	it('should log error messages', () => {
		logger.error('Something broke');
		expect(errorSpy).toHaveBeenCalledWith(expect.stringContaining('Something broke'));
	});
	
	it('should handle Error objects in error logs', () => {
		const err = new Error('Fatal System Error');
		logger.error(err);
		// We verify that console.error was called.
		// Depending on implementation, it might be called with the message or the stack.
		expect(errorSpy).toHaveBeenCalled();
	});
});