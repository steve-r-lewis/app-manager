/**
 * ================================================================================
 *
 * @project:    app-manager
 * @file:       ~/tests/unit/services/loggerService.test.ts
 * @version:    1.0.0
 * @createDate: 2025 Dec 28
 * @createTime: 21:44
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
 * V1.0.0, 20251228-21:44
 * Initial creation and release of loggerService.test.ts
 *
 * ================================================================================
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { logger } from '../../../app/services/loggerService';
import { consola } from 'consola';

// Mock Consola
vi.mock('consola', () => ({
	consola: {
		info: vi.fn(),
		success: vi.fn(),
		warn: vi.fn(),
		error: vi.fn(),
		log: vi.fn(),
		box: vi.fn(),
	}
}));

describe('LoggerService (Unit)', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});
	
	it('should delegate "info" to consola.info', () => {
		logger.info('Test Info');
		expect(consola.info).toHaveBeenCalledWith(expect.stringContaining('Test Info'));
	});
	
	it('should delegate "success" to consola.success', () => {
		logger.success('Test Success');
		expect(consola.success).toHaveBeenCalledWith(expect.stringContaining('Test Success'));
	});
	
	it('should delegate "warn" to consola.warn', () => {
		logger.warn('Test Warn');
		expect(consola.warn).toHaveBeenCalledWith(expect.stringContaining('Test Warn'));
	});
	
	it('should delegate "error" to consola.error', () => {
		logger.error('Test Error');
		expect(consola.error).toHaveBeenCalledWith(expect.stringContaining('Test Error'));
	});
});