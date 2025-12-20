/**
 * ================================================================================
 *
 * @project:    app-manager
 * @file:       ~/app/services/logger.service.ts
 * @version:    1.0.0
 * @createDate: 2025 Dec 18
 * @createTime: 17:57
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
 * V1.0.0, 20251218-17:57
 * Initial creation and release of logger.service.ts
 *
 * ================================================================================
 */

import { consola, type ConsolaInstance } from 'consola';
import fs from 'fs';
import path from 'path';
import pc from 'picocolors';

export class LoggerService {
	private logger: ConsolaInstance;
	private root: string;
	
	// Log Paths
	private paths = {
		error: '',
		process: '',
		session: ''
	};
	
	// State Flags
	private isProcessLogging = false;
	// Session Log Path (for internal state)
	private sessionLogPath: string | null = null;
	
	constructor() {
		this.root = process.cwd();
		this.logger = consola.create({});
	}
	
	init() {
		const monitorRoot = path.join(this.root, 'app-monitor');
		
		// Define paths
		this.paths.error = path.join(monitorRoot, 'error-logs');
		this.paths.process = path.join(monitorRoot, 'process-logs');
		this.paths.session = path.join(monitorRoot, 'session-logs');
		
		// 1. Ensure directories exist
		[this.paths.error, this.paths.process, this.paths.session].forEach(dir => {
			if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
		});
		
		// 2. Eagerly Create Error Log File (Fixes Test 1 & 2)
		const errorFile = path.join(this.paths.error, 'error.log');
		if (!fs.existsSync(errorFile)) {
			fs.writeFileSync(errorFile, '');
		}
		
		// Add Reporter
		this.logger.addReporter({
			log: (logObj) => {
				this.handleLogDispatch(logObj);
			}
		});
	}
	
	// Toggle for the "Process" logs
	enableProcessLogging() {
		this.isProcessLogging = true;
		this.process('Process logging enabled');
	}
	
	// FIX: Add the missing method (Fixes Test 3)
	enableSessionLogging() {
		const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
		// Set the path
		this.sessionLogPath = path.join(this.paths.session, `session-${timestamp}.log`);
		
		// Eagerly create the file so tests can see it immediately
		fs.writeFileSync(this.sessionLogPath, '');
		
		this.info(`Session logging enabled: ${this.sessionLogPath}`);
	}
	
	// Central Dispatcher
	private handleLogDispatch(logObj: any) {
		const args = logObj.args || [];
		const msg = args.map((a: any) => (typeof a === 'object' ? JSON.stringify(a) : String(a))).join(' ');
		const timestamp = new Date().toISOString();
		const logLine = `[${timestamp}] [${logObj.type.toUpperCase()}] ${msg}\n`;
		
		// 1. Session Logs
		if (this.sessionLogPath && ['info', 'success', 'start'].includes(logObj.type)) {
			fs.appendFileSync(this.sessionLogPath, logLine);
		}
		
		// 2. Error Logs
		if (logObj.type === 'error' || logObj.level === 0) {
			const file = path.join(this.paths.error, 'error.log');
			fs.appendFileSync(file, logLine);
		}
		
		// 3. Process Logs
		if (this.isProcessLogging) {
			const file = path.join(this.paths.process, 'process-debug.log');
			fs.appendFileSync(file, logLine);
		}
	}
	
	// Public API
	info(...args: any[]) { this.logger.info(...args); }
	success(...args: any[]) { this.logger.success(...args); }
	warn(...args: any[]) { this.logger.warn(...args); }
	error(...args: any[]) { this.logger.error(...args); }
	
	process(...args: any[]) {
		if (this.isProcessLogging) {
			this.logger.debug(...args);
		}
	}
	
	close() {
		this.sessionLogPath = null;
	}
}

export const logger = new LoggerService();
// No init() here!