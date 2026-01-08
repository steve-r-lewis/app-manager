/**
 * ================================================================================
 *
 * @project:    app-manager
 * @file:       ~/app/services/loggerService.ts
 * @version:    2.0.0
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
import fs from 'fs';
import path from 'path';

class LoggerService {
	private _root: string = process.cwd();
	private _logStream: fs.WriteStream | null = null;
	// Maintain strict compatibility with existing tests by using consola instance
	private _console = consola;
	
	/**
	 * Initializes the logger with the target project root.
	 * This fixes the "logger.init is not a function" error.
	 */
	public init(targetRoot: string) {
		this._root = targetRoot;
		
		// Check environment variable to enable file logging (set by app/index.ts)
		if (process.env.LOG_TO_FILE === 'true') {
			this._enableFileLogging();
		}
	}
	
	private _enableFileLogging() {
		try {
			const monitorDir = path.join(this._root, 'app-monitor', 'logs');
			if (!fs.existsSync(monitorDir)) {
				fs.mkdirSync(monitorDir, { recursive: true });
			}
			
			// Create unique session log file
			const filename = `session-${new Date().toISOString().replace(/[:.]/g, '-')}.log`;
			const logPath = path.join(monitorDir, filename);
			
			this._logStream = fs.createWriteStream(logPath, { flags: 'a' });
			this.info(`File logging enabled. Writing to: ${logPath}`);
		} catch (error) {
			this._console.warn('Failed to initialize file logging', error);
		}
	}
	
	private _writeToFile(level: string, message: any, args: any[]) {
		if (!this._logStream) return;
		
		const timestamp = new Date().toISOString();
		// safe stringify for objects
		const formattedArgs = args.map(a =>
			typeof a === 'object' ? JSON.stringify(a) : a
		).join(' ');
		
		this._logStream.write(`[${timestamp}] [${level.toUpperCase()}] ${message} ${formattedArgs}\n`);
	}
	
	// --- Public API (Preserves existing interface) ---
	
	public info(message: any, ...args: any[]) {
		this._console.info(message, ...args);
		this._writeToFile('info', message, args);
	}
	
	public success(message: any, ...args: any[]) {
		this._console.success(message, ...args);
		this._writeToFile('success', message, args);
	}
	
	public warn(message: any, ...args: any[]) {
		this._console.warn(message, ...args);
		this._writeToFile('warn', message, args);
	}
	
	public debug(message: any, ...args: any[]) {
		// Only log debug if explicitly enabled
		if (process.env.DEBUG || process.env.VERBOSE) {
			this._console.debug(message, ...args);
			this._writeToFile('debug', message, args);
		}
	}
	
	public error(message: string | Error, ...args: any[]): void {
		// 1. Console Output (Your Custom Logic)
		if (message instanceof Error) {
			console.error(`✖ ${message.message}`);
			if (message.stack) {
				console.error(message.stack);
			}
			// 2. File Logging (Restored)
			this._writeToFile('error', message.message, [message.stack, ...args]);
		} else {
			console.error(`✖ ${message}`, ...args);
			// 2. File Logging (Restored)
			this._writeToFile('error', message, args);
		}
	}
	
	public box(message: string): void {
		const lines = message.split('\n');
		const maxLength = Math.max(...lines.map(l => l.length));
		const padding = 2;
		const width = maxLength + (padding * 2);
		
		const top = '┌' + '─'.repeat(width) + '┐';
		const bottom = '└' + '─'.repeat(width) + '┘';
		
		console.log(top);
		lines.forEach(line => {
			// Explicitly calculate Left Padding to ensure symmetry
			const leftPad = ' '.repeat(padding);
			const rightPad = ' '.repeat(width - line.length - padding);
			
			console.log(`│${leftPad}${line}${rightPad}│`);
		});
		console.log(bottom);
	}
}

export const logger = new LoggerService();