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
 * V2.0.0, 20260107-22:30
 * - Updated to use consola instead of native console.
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
import { consola } from 'consola';
import fs from 'fs';
import path from 'path';
import { logger } from '../../../app/services/loggerService.js';

// 1. Mock External Dependencies
vi.mock('fs');
vi.mock('consola', () => ({
	consola: {
		info: vi.fn(),
		success: vi.fn(),
		warn: vi.fn(),
		debug: vi.fn(),
		// We don't mock error here because your implementation uses native console.error
	}
}));

describe('LoggerService', () => {
	let errorSpy: any;
	let logSpy: any;
	
	beforeEach(() => {
		vi.clearAllMocks();
		process.env.LOG_TO_FILE = 'false';
		process.env.DEBUG = 'false';
		
		// 2. Spy on Native Console (used by .error() and .box())
		errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
		logSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
	});
	
	afterEach(() => {
		vi.restoreAllMocks();
	});
	
	// ========================================================================
	// Core Logging (Restored Tests)
	// ========================================================================
	it('should log info messages', () => {
		logger.info('Test Info');
		// Your code uses consola.info for this
		expect(consola.info).toHaveBeenCalledWith('Test Info');
	});
	
	it('should log success messages', () => {
		logger.success('Operation Successful');
		// Your code uses consola.success for this
		expect(consola.success).toHaveBeenCalledWith('Operation Successful');
	});
	
	it('should log warning messages', () => {
		logger.warn('Careful now');
		// Your code uses consola.warn for this
		expect(consola.warn).toHaveBeenCalledWith('Careful now');
	});
	
	it('should log error messages', () => {
		logger.error('Something broke');
		// Your code uses native console.error for this
		expect(errorSpy).toHaveBeenCalledWith(expect.stringContaining('Something broke'));
	});
	
	it('should handle Error objects in error logs', () => {
		const err = new Error('Fatal System Error');
		logger.error(err);
		// Should log the message formatted with X
		expect(errorSpy).toHaveBeenCalledWith(expect.stringContaining('✖ Fatal System Error'));
	});
	
	// ========================================================================
	// Visual Formatting (Restored Tests)
	// ========================================================================
	describe('Visual Formatting', () => {
		it('should render a box with symmetrical padding', () => {
			const message = 'Hello\nWorld';
			logger.box(message);
			
			// Logic Check based on your implementation:
			// "Hello" (5 chars) + 2 padding left + 2 padding right = 9 chars width.
			// Box Width: 9 dashes.
			
			// 1. Check Top Border
			expect(logSpy).toHaveBeenCalledWith(expect.stringContaining('┌─────────┐'));
			
			// 2. Check Content Alignment
			expect(logSpy).toHaveBeenCalledWith(expect.stringContaining('│  Hello  │'));
			expect(logSpy).toHaveBeenCalledWith(expect.stringContaining('│  World  │'));
			
			// 3. Check Bottom Border
			expect(logSpy).toHaveBeenCalledWith(expect.stringContaining('└─────────┘'));
		});
	});
	
	// ========================================================================
	// Initialization & File Logging (New Tests)
	// ========================================================================
	describe('Initialization & File Logging', () => {
		it('should initialize without errors', () => {
			expect(() => logger.init('/test/root')).not.toThrow();
		});
		
		it('should enable file stream when LOG_TO_FILE is true', () => {
			process.env.LOG_TO_FILE = 'true';
			vi.mocked(fs.existsSync).mockReturnValue(false); // Force mkdir
			vi.mocked(fs.createWriteStream).mockReturnValue({ write: vi.fn() } as any);
			
			logger.init('/test/root');
			
			// Verify directory creation
			expect(fs.mkdirSync).toHaveBeenCalledWith(
				expect.stringContaining(path.join('app-monitor', 'logs')),
				{ recursive: true }
			);
			// Verify stream creation
			expect(fs.createWriteStream).toHaveBeenCalled();
		});
		
		it('should write errors to file when file logging is active', () => {
			// Setup File Logging
			const mockStream = { write: vi.fn() };
			(logger as any)._logStream = mockStream; // Inject mock stream directly
			
			// Trigger Error
			logger.error('Database failed');
			
			// Verify it went to console AND file
			expect(errorSpy).toHaveBeenCalledWith(expect.stringContaining('Database failed'));
			expect(mockStream.write).toHaveBeenCalledWith(
				expect.stringContaining('[ERROR] Database failed')
			);
		});
	});
});


























import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { logger } from '../../../app/services/loggerService';
import fs from 'fs';
import path from 'path';

// Mock fs to prevent actual file writing during tests
vi.mock('fs');

describe('LoggerService', () => {
	
	beforeEach(() => {
		vi.clearAllMocks();
		process.env.LOG_TO_FILE = 'false'; // Default to off
		process.env.DEBUG = 'false';
		
		// Spy on native console methods since your implementation uses them
		vi.spyOn(console, 'error').mockImplementation(() => {});
		vi.spyOn(console, 'log').mockImplementation(() => {});
	});
	
	afterEach(() => {
		vi.restoreAllMocks();
	});
	
	it('should initialize without errors', () => {
		expect(() => logger.init('/test/root')).not.toThrow();
	});
	
	it('should enable file stream when LOG_TO_FILE is true', () => {
		process.env.LOG_TO_FILE = 'true';
		vi.mocked(fs.existsSync).mockReturnValue(false); // Force mkdir
		vi.mocked(fs.createWriteStream).mockReturnValue({ write: vi.fn() } as any);
		
		logger.init('/test/root');
		
		// Verify directory creation
		expect(fs.mkdirSync).toHaveBeenCalledWith(
			expect.stringContaining(path.join('app-monitor', 'logs')),
			{ recursive: true }
		);
		expect(fs.createWriteStream).toHaveBeenCalled();
	});
	
	it('should handle Error objects correctly', () => {
		const testError = new Error('Test Crash');
		// Mock the stream to verify file writing
		const mockStream = { write: vi.fn() };
		(logger as any)._logStream = mockStream;
		
		logger.error(testError);
		
		// 1. Verify Console Output (Custom formatting)
		expect(console.error).toHaveBeenCalledWith(expect.stringContaining('✖ Test Crash'));
		
		// 2. Verify File Write (Restored functionality)
		expect(mockStream.write).toHaveBeenCalledWith(
			expect.stringContaining('[ERROR] Test Crash')
		);
	});
	
	it('should handle string errors correctly', () => {
		const mockStream = { write: vi.fn() };
		(logger as any)._logStream = mockStream;
		
		logger.error('Simple failure');
		
		expect(console.error).toHaveBeenCalledWith(expect.stringContaining('✖ Simple failure'));
		expect(mockStream.write).toHaveBeenCalledWith(
			expect.stringContaining('[ERROR] Simple failure')
		);
	});
	
	it('should draw a box without crashing', () => {
		logger.box('Hello\nWorld');
		
		// We just verify it calls console.log multiple times (Top, Middle lines, Bottom)
		expect(console.log).toHaveBeenCalled();
	});
});