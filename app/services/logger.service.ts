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
	
	constructor() {
		this.root = process.cwd();
		this.logger = consola.create({});
	}
	
	init() {
		const monitorRoot = path.join(this.root, 'app-monitor');
		
		// Define your new structure
		this.paths.error = path.join(monitorRoot, 'error-logs');
		this.paths.process = path.join(monitorRoot, 'process-logs');
		this.paths.session = path.join(monitorRoot, 'session-logs');
		
		// Ensure all exist
		[this.paths.error, this.paths.process, this.paths.session].forEach(dir => {
			if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
		});
		
		// Add Reporter to hook into Consola calls
		this.logger.addReporter({
			log: (logObj) => {
				this.handleLogDispatch(logObj);
			}
		});
	}
	
	// Toggle for the "Process" logs (user flag)
	enableProcessLogging() {
		this.isProcessLogging = true;
		this.process('Process logging enabled');
	}
	
	// Central Dispatcher
	private handleLogDispatch(logObj: any) {
		const args = logObj.args || [];
		const msg = args.map((a: any) => (typeof a === 'object' ? JSON.stringify(a) : String(a))).join(' ');
		const timestamp = new Date().toISOString();
		const logLine = `[${timestamp}] [${logObj.type.toUpperCase()}] ${msg}\n`;
		
		// 1. Session Logs (Audit Trail - High Level)
		// We log "info" and "success" types here automatically
		if (['info', 'success', 'start'].includes(logObj.type)) {
			const dateStr = timestamp.split('T')[0];
			const file = path.join(this.paths.session, `session-${dateStr}.log`);
			fs.appendFileSync(file, logLine);
		}
		
		// 2. Error Logs (Catch blocks)
		if (logObj.type === 'error' || logObj.level === 0) {
			const file = path.join(this.paths.error, 'errors.log'); // Rotates or Appends
			fs.appendFileSync(file, logLine);
		}
		
		// 3. Process Logs (Verbose/Debug) - ONLY if enabled
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
	
	// Explicit "Process" log that might not show in console but goes to file
	process(...args: any[]) {
		if (this.isProcessLogging) {
			// Log to file via reporter
			this.logger.debug(...args);
		}
	}
	
	close() {
		// Cleanup if needed
	}
}

export const logger = new LoggerService();