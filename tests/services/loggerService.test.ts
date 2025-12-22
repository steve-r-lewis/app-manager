/**
 * ================================================================================
 *
 * @project:    app-manager
 * @file:       ~/tests/services/loggerService.test.ts
 * @version:    1.0.0
 * @createDate: 2025 Dec 18
 * @createTime: 19:55
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
 * V1.0.0, 20251218-19:55
 * Initial creation and release of loggerService.test.ts
 *
 * ================================================================================
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import fs from 'fs';
import path from 'path';
import { LoggerService } from '../../app/services/loggerService';

// 1. Hoist reporters
const { reporters } = vi.hoisted(() => {
	return { reporters: [] as any[] };
});

// 2. Mock Consola INLINE
vi.mock('consola', () => {
	const fakeInstance = {
		addReporter: (r: any) => reporters.push(r),
		info: (...args: any[]) => reporters.forEach(r => r.log({ type: 'info', args, level: 3 })),
		error: (...args: any[]) => reporters.forEach(r => r.log({ type: 'error', args, level: 0 })),
		warn: (...args: any[]) => reporters.forEach(r => r.log({ type: 'warn', args, level: 2 })),
		success: (...args: any[]) => reporters.forEach(r => r.log({ type: 'success', args, level: 3 })),
		withTag: vi.fn().mockReturnThis(),
		box: vi.fn(),
		debug: vi.fn(), // Needed for .process() calls
		create: vi.fn().mockReturnThis(),
	};
	
	return {
		consola: {
			...fakeInstance,
			create: vi.fn().mockReturnValue(fakeInstance),
		}
	};
});

describe('Logger Service', () => {
	const testLogDir = path.join(__dirname, '../fixtures/logs');
	let logger: LoggerService;
	
	beforeEach(() => {
		vi.clearAllMocks();
		reporters.length = 0;
		
		if (fs.existsSync(testLogDir)) {
			fs.rmSync(testLogDir, { recursive: true, force: true });
		}
		process.env.LOG_TO_FILE = 'true';
		
		logger = new LoggerService();
		(logger as any).root = testLogDir;
		logger.init();
	});
	
	afterEach(() => {
		logger?.close();
		if (fs.existsSync(testLogDir)) {
			fs.rmSync(testLogDir, { recursive: true, force: true });
		}
	});
	
	it('should automatically create the app-monitor directory structure', () => {
		expect(fs.existsSync(path.join(testLogDir, 'app-monitor'))).toBe(true);
		expect(fs.existsSync(path.join(testLogDir, 'app-monitor/session-logs'))).toBe(true);
		expect(fs.existsSync(path.join(testLogDir, 'app-monitor/error-logs'))).toBe(true);
		expect(fs.existsSync(path.join(testLogDir, 'app-monitor/process-logs'))).toBe(true);
	});
	
	it('should automatically create the error log file', () => {
		const errorFile = path.join(testLogDir, 'app-monitor/error-logs/error.log');
		expect(fs.existsSync(errorFile)).toBe(true);
	});
	
	it('should write errors to the error log', () => {
		const errorFile = path.join(testLogDir, 'app-monitor/error-logs/error.log');
		
		logger.error('Test Error Message');
		
		const content = fs.readFileSync(errorFile, 'utf-8');
		expect(content).toContain('Test Error Message');
	});
	
	it('should NOT create session log by default', () => {
		const l = new LoggerService();
		(l as any).root = testLogDir;
		l.init();
		
		const sessionDir = path.join(testLogDir, 'app-monitor/session-logs');
		const files = fs.readdirSync(sessionDir);
		expect(files.length).toBe(0);
	});
	
	it('should create session log when enabled', () => {
		logger.enableSessionLogging(); // This method now exists!
		
		const sessionDir = path.join(testLogDir, 'app-monitor/session-logs');
		const files = fs.readdirSync(sessionDir);
		expect(files.length).toBeGreaterThan(0);
	});
});