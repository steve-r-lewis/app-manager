/**
 * ================================================================================
 *
 * @project:    app-manager
 * @file:       ~/app/services/loggerService.ts
 * @version:    2.0.1
 * @createDate: 2026 Jan 02
 * @createTime: 00:39
 * @author:     Steve R Lewis
 *
 * ================================================================================
 *
 * @description:
 * The Logger Service.
 *
 * Centralizes all application output.
 * Currently wraps the standard Console API but can be easily upgraded to use
 * libraries like 'consola' or 'chalk' without breaking the rest of the app.
 *
 * ================================================================================
 *
 * @notes: Revision History
 *
 * V2.0.1, 20260821-23:15
 * box() now writes its (redacted) content to the log file, consistent with
 * the other log methods (info/success/warn/error/debug).
 *
 * V2.0.0, 20260107-22:04
 * Refactored to to provide an init function for file logging.
 *
 * V1.0.0, 20260102-00:39
 * Initial creation and release of loggerService.ts
 * Initial migration. Implements ILogger interface using native console methods.
 *
 * ================================================================================
 */

import { consola } from 'consola';
import fs from 'node:fs';
import fsp from 'node:fs/promises';
import path from 'node:path';
import { inspect } from 'node:util';
import type { ILogger } from '../types/index.js';

class LoggerService implements ILogger {
	private _root: string = process.cwd();
	private _logStream: fs.WriteStream | null = null;
	private _console = consola;
	private _exitListenerRegistered = false;
	
	// Regex patterns for common secrets (GitHub tokens, OpenAI keys, generic Bearer tokens)
	private readonly SECRET_PATTERNS = [
		/(gh[pousr]_[A-Za-z0-9_]{36,})/g, // GitHub Tokens
		/(sk-[A-Za-z0-9_-]{32,})/g,       // Standard Secret Keys (OpenAI, etc.)
		/(Bearer\s+)[A-Za-z0-9\-._~+/]+/g // Generic Bearer Tokens
	];
	
	public async init(targetRoot: string): Promise<void> {
		this._root = targetRoot;
		
		if (process.env.LOG_TO_FILE === 'true') {
			await this._enableFileLogging();
			await this._cleanupOldLogs();
		}
		
		// Ensure buffer is flushed if process exits abruptly
		if (!this._exitListenerRegistered) {
			process.on('exit', () => this.close());
			this._exitListenerRegistered = true;
		}
	}
	
	private async _enableFileLogging(): Promise<void> {
		try {
			const monitorDir = path.join(this._root, 'app-monitor', 'logs');
			await fsp.mkdir(monitorDir, { recursive: true });
			
			const filename = `session-${new Date().toISOString().replace(/[:.]/g, '-')}.log`;
			const logPath = path.join(monitorDir, filename);
			
			this._logStream = fs.createWriteStream(logPath, { flags: 'a' });
			this.info(`File logging enabled. Writing to: ${logPath}`);
		} catch (error: unknown) {
			this._console.warn('Failed to initialize file logging', error);
		}
	}
	
	/**
	 * Deletes logs older than 14 days to prevent disk bloat.
	 */
	private async _cleanupOldLogs(): Promise<void> {
		try {
			const monitorDir = path.join(this._root, 'app-monitor', 'logs');
			const files = await fsp.readdir(monitorDir);
			const cutoffDate = Date.now() - (14 * 24 * 60 * 60 * 1000); // 14 days ago
			
			for (const file of files) {
				if (!file.startsWith('session-')) continue;
				const filePath = path.join(monitorDir, file);
				const stats = await fsp.stat(filePath);
				
				if (stats.mtimeMs < cutoffDate) {
					await fsp.unlink(filePath).catch(() => {}); // Fire and forget
				}
			}
		} catch {
			// Silently fail if directory doesn't exist or permissions prevent cleanup
		}
	}
	
	/**
	 * Redacts sensitive tokens from strings to prevent secret leakage.
	 */
	private _redact(input: string): string {
		let redacted = input;
		for (const pattern of this.SECRET_PATTERNS) {
			// If it's a bearer token, keep the "Bearer " prefix but mask the token
			redacted = redacted.replace(pattern, (match, p1) => {
				return p1.trim() === 'Bearer' ? 'Bearer [REDACTED]' : '[REDACTED]';
			});
		}
		return redacted;
	}
	
	/**
	 * Redacts any string entries within a variadic args array, leaving
	 * non-string args (objects, errors, etc.) untouched.
	 */
	private _redactArgs(args: unknown[]): unknown[] {
		return args.map(arg => typeof arg === 'string' ? this._redact(arg) : arg);
	}

	private _writeToFile(level: string, message: string, args: unknown[]): void {
		if (!this._logStream) return;
		
		const timestamp = new Date().toISOString();
		
		const formattedArgs = args.length > 0
			? ' ' + args.map(a => typeof a === 'string' ? a : inspect(a, { depth: 3 })).join(' ')
			: '';
		
		const finalOutput = this._redact(`[${timestamp}] [${level.toUpperCase()}] ${message}${formattedArgs}`);
		this._logStream.write(finalOutput + '\n');
	}
	
	/**
	 * Synchronously flushes and closes the stream.
	 */
	public close(): void {
		if (this._logStream) {
			this._logStream.end();
			this._logStream = null;
		}
	}
	
	// --- Public API ---
	
	public info(message: string, ...args: unknown[]): void {
		this._console.info(this._redact(message), ...this._redactArgs(args));
		this._writeToFile('info', message, args);
	}

	public success(message: string, ...args: unknown[]): void {
		this._console.success(this._redact(message), ...this._redactArgs(args));
		this._writeToFile('success', message, args);
	}

	public warn(message: string, ...args: unknown[]): void {
		this._console.warn(this._redact(message), ...this._redactArgs(args));
		this._writeToFile('warn', message, args);
	}

	public debug(message: string, ...args: unknown[]): void {
		if (process.env.DEBUG === 'true' || process.env.VERBOSE === 'true') {
			this._console.debug(this._redact(message), ...this._redactArgs(args));
			this._writeToFile('debug', message, args);
		}
	}

	public error(message: string | Error, ...args: unknown[]): void {
		const errMsg = message instanceof Error ? message.message : message;
		const errObj = message instanceof Error ? message : undefined;

		const redactedMsg = this._redact(errMsg);
		const redactedArgs = this._redactArgs(args);

		if (errObj) {
			// Note: We don't modify the Error object directly to preserve its stack trace in memory,
			// but we ensure the console output and file stream receive the redacted string.
			this._console.error(redactedMsg, ...redactedArgs);
			this._writeToFile('error', errMsg, [errObj.stack, ...args]);
		} else {
			this._console.error(redactedMsg, ...redactedArgs);
			this._writeToFile('error', errMsg, args);
		}
	}
	
	public box(message: string): void {
		this._console.box(this._redact(message));
		this._writeToFile('box', message, []);
	}
}

export const logger = new LoggerService();