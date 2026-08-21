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

import { describe, it, expect, vi, beforeEach, afterEach, type MockInstance } from 'vitest';
import { consola } from 'consola';
import fsp from 'node:fs/promises';
import fs from 'node:fs';
import path from 'node:path';
import { logger } from '../../../app/services/loggerService.js';

// 1. Mock Dependencies
vi.mock('node:fs/promises');
vi.mock('node:fs');
vi.mock('consola', () => ({
	consola: {
		info: vi.fn(),
		success: vi.fn(),
		warn: vi.fn(),
		debug: vi.fn(),
		error: vi.fn(),
		box: vi.fn()
	}
}));

describe('LoggerService', () => {
	beforeEach(() => {
		vi.clearAllMocks();
		process.env.LOG_TO_FILE = 'false';
		process.env.DEBUG = 'false';
		process.env.VERBOSE = 'false';
	});
	
	afterEach(() => {
		vi.restoreAllMocks();
	});
	
	describe('Core Logging Methods', () => {
		it('should route info messages to consola', () => {
			logger.info('Test Info');
			expect(consola.info).toHaveBeenCalledWith('Test Info');
		});
		
		it('should route success messages to consola', () => {
			logger.success('Operation Successful');
			expect(consola.success).toHaveBeenCalledWith('Operation Successful');
		});
		
		it('should route warning messages to consola', () => {
			logger.warn('Careful now');
			expect(consola.warn).toHaveBeenCalledWith('Careful now');
		});
		
		it('should route error strings to consola', () => {
			logger.error('Something broke');
			expect(consola.error).toHaveBeenCalledWith('Something broke');
		});
		
		it('should extract strings from Error objects for secure consola routing', () => {
			const err = new Error('Fatal System Error');
			logger.error(err);
			
			// The new architecture extracts the message string so it can be safely redacted
			expect(consola.error).toHaveBeenCalledWith('Fatal System Error');
			// (The stack trace is safely routed to the file stream, which is tested elsewhere)
		});
		
		it('should draw a box using consola', () => {
			logger.box('Hello\nWorld');
			expect(consola.box).toHaveBeenCalledWith('Hello\nWorld');
		});
	});
	
	describe('Initialization & File Logging', () => {
		it('should initialize asynchronously without errors', async () => {
			await expect(logger.init('/test/root')).resolves.not.toThrow();
		});
		
		it('should enable file stream when LOG_TO_FILE is true', async () => {
			process.env.LOG_TO_FILE = 'true';
			vi.mocked(fsp.mkdir).mockResolvedValue(undefined);
			vi.mocked(fs.createWriteStream).mockReturnValue({ write: vi.fn() } as unknown as fs.WriteStream);
			
			await logger.init('/test/root');
			
			expect(fsp.mkdir).toHaveBeenCalledWith(
				expect.stringContaining(path.join('app-monitor', 'logs')),
				{ recursive: true }
			);
			expect(fs.createWriteStream).toHaveBeenCalled();
		});
		
		it('should safely serialize complex objects without crashing', async () => {
			const mockStream = { write: vi.fn() };
			// Inject mock stream directly for testing
			(logger as unknown as { _logStream: unknown })._logStream = mockStream;
			
			// Create a circular reference that breaks JSON.stringify
			const circularObj: Record<string, unknown> = {};
			circularObj.self = circularObj;
			
			// This would throw a TypeError in the old implementation
			expect(() => logger.info('Circular Payload', circularObj)).not.toThrow();
			
			// Verify it was safely formatted by util.inspect
			expect(mockStream.write).toHaveBeenCalledWith(
				expect.stringContaining('[INFO] Circular Payload')
			);
		});

		it('should write box content to the log file, consistent with other log methods', () => {
			const mockStream = { write: vi.fn() };
			(logger as unknown as { _logStream: unknown })._logStream = mockStream;

			logger.box('Hello\nWorld');

			expect(mockStream.write).toHaveBeenCalledWith(
				expect.stringContaining('[BOX] Hello\nWorld')
			);
		});
	});
	
	describe('Security Edge Cases (Redaction)', () => {
		it('should redact GitHub Personal Access Tokens', () => {
			const secretMsg = 'Cloning repo with token ghp_1234567890abcdef1234567890abcdef1234';
			logger.info(secretMsg);
			
			expect(consola.info).toHaveBeenCalledWith('Cloning repo with token [REDACTED]');
		});
		
		it('should redact OpenAI API Keys', () => {
			const secretMsg = 'Connected via sk-1234567890abcdef1234567890abcdef';
			logger.error(secretMsg);
			
			expect(consola.error).toHaveBeenCalledWith('Connected via [REDACTED]');
		});
		
		it('should redact generic Bearer tokens', () => {
			const secretMsg = 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...';
			logger.warn(secretMsg);

			expect(consola.warn).toHaveBeenCalledWith('Authorization: Bearer [REDACTED]');
		});

		it('should redact secrets passed via ...args, not just the message string', () => {
			const secretArg = 'token: ghp_1234567890abcdef1234567890abcdef1234';
			logger.info('Safe message', secretArg);

			expect(consola.info).toHaveBeenCalledWith('Safe message', 'token: [REDACTED]');
		});
	});
	
	describe('Stream Lifecycle Edge Cases', () => {
		it('should gracefully close the log stream on command', async () => {
			process.env.LOG_TO_FILE = 'true';
			const mockStream = { write: vi.fn(), end: vi.fn() };
			vi.mocked(fs.createWriteStream).mockReturnValue(mockStream as unknown as fs.WriteStream);

			await logger.init('/test/root');
			logger.close();

			expect(mockStream.end).toHaveBeenCalled();
		});

		it('should not register a duplicate exit listener when init() is called more than once', async () => {
			// The logger is a singleton, so earlier tests in this file may already
			// have registered its exit listener. Reset both the real listener list
			// and the singleton's internal guard to get a clean baseline.
			process.removeAllListeners('exit');
			(logger as unknown as { _exitListenerRegistered: boolean })._exitListenerRegistered = false;

			const before = process.listenerCount('exit');

			await logger.init('/test/root');
			const afterFirst = process.listenerCount('exit');

			await logger.init('/test/root');
			const afterSecond = process.listenerCount('exit');

			expect(afterFirst - before).toBe(1);
			expect(afterSecond - afterFirst).toBe(0);
		});
	});

	describe('Log Cleanup (_cleanupOldLogs)', () => {
		const FOURTEEN_DAYS_MS = 14 * 24 * 60 * 60 * 1000;

		beforeEach(() => {
			process.env.LOG_TO_FILE = 'true';
			vi.mocked(fsp.mkdir).mockResolvedValue(undefined);
			vi.mocked(fs.createWriteStream).mockReturnValue({ write: vi.fn() } as unknown as fs.WriteStream);
			vi.mocked(fsp.unlink).mockResolvedValue(undefined);
		});

		it('should delete a log file older than 14 days', async () => {
			vi.mocked(fsp.readdir).mockResolvedValue(['session-old.log'] as unknown as fs.Dirent[]);
			vi.mocked(fsp.stat).mockResolvedValue({
				mtimeMs: Date.now() - FOURTEEN_DAYS_MS - 1000
			} as fs.Stats);

			await logger.init('/test/root');

			expect(fsp.unlink).toHaveBeenCalledWith(
				expect.stringContaining(path.join('app-monitor', 'logs', 'session-old.log'))
			);
		});

		it('should NOT delete a log file newer than 14 days', async () => {
			vi.mocked(fsp.readdir).mockResolvedValue(['session-new.log'] as unknown as fs.Dirent[]);
			vi.mocked(fsp.stat).mockResolvedValue({
				mtimeMs: Date.now() - 1000
			} as fs.Stats);

			await logger.init('/test/root');

			expect(fsp.unlink).not.toHaveBeenCalled();
		});

		it('should ignore files that do not match the session- naming pattern, even if old', async () => {
			vi.mocked(fsp.readdir).mockResolvedValue(['other-file.log'] as unknown as fs.Dirent[]);
			vi.mocked(fsp.stat).mockResolvedValue({
				mtimeMs: Date.now() - FOURTEEN_DAYS_MS - 1000
			} as fs.Stats);

			await logger.init('/test/root');

			expect(fsp.unlink).not.toHaveBeenCalled();
			expect(fsp.stat).not.toHaveBeenCalled();
		});

		it('should fail gracefully if the log directory cannot be read', async () => {
			vi.mocked(fsp.readdir).mockRejectedValue(new Error('ENOENT: no such directory'));

			await expect(logger.init('/test/root')).resolves.not.toThrow();
			expect(fsp.unlink).not.toHaveBeenCalled();
		});
	});
});