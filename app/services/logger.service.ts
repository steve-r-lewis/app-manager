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
	private sessionLogPath: string | null = null;
	private errorLogPath: string | null = null;
	
	constructor() {
		this.root = process.cwd();
		this.logger = consola.create({});
	}
	
	// NEW: Safe cleanup hook
	close() {
		this.sessionLogPath = null;
		this.errorLogPath = null;
	}
	
	init() {
		const monitorDir = path.join(this.root, 'app-monitor');
		const processDir = path.join(monitorDir, 'process-logs');
		const sessionDir = path.join(monitorDir, 'session-logs');
		const errorDir = path.join(monitorDir, 'error-logs');
		const fixtureDir = path.join(monitorDir, 'test-fixtures');
		const testDir = path.join(monitorDir, 'test-logs');
		
		[monitorDir, sessionDir, errorDir].forEach(dir => {
			if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
		});
		
		this.errorLogPath = path.join(errorDir, 'error.log');
		if (!fs.existsSync(this.errorLogPath)) {
			fs.writeFileSync(this.errorLogPath, '');
		}
		
		this.logger.addReporter({
			log: (logObj) => {
				if (logObj.type === 'error' || logObj.level === 0) {
					this.writeToErrorLog(logObj.args);
				}
				if (this.sessionLogPath) {
					this.writeToSessionLog(logObj);
				}
			}
		});
	}
	
	enableSessionLogging() {
		const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
		this.sessionLogPath = path.join(this.root, 'app-monitor', 'session-logs', `session-${timestamp}.log`);
		
		// FIX: Eagerly create the file immediately so tests can see it
		fs.writeFileSync(this.sessionLogPath, '');
		
		this.info(`Session logging enabled: ${this.sessionLogPath}`);
	}
	
	private writeToErrorLog(args: any[]) {
		if (!this.errorLogPath) return;
		const message = args.map(a => (typeof a === 'object' ? JSON.stringify(a) : String(a))).join(' ');
		const entry = `[${new Date().toISOString()}] ERROR: ${message}\n`;
		fs.appendFileSync(this.errorLogPath, entry);
	}
	
	private writeToSessionLog(logObj: any) {
		if (!this.sessionLogPath) return;
		const args = logObj.args || [];
		const message = args.map((a: any) => (typeof a === 'object' ? JSON.stringify(a) : String(a))).join(' ');
		const entry = `[${new Date().toISOString()}] ${logObj.type.toUpperCase()}: ${message}\n`;
		fs.appendFileSync(this.sessionLogPath, entry);
	}
	
	info(...args: any[]) { this.logger.info(...args); }
	success(...args: any[]) { this.logger.success(...args); }
	warn(...args: any[]) { this.logger.warn(...args); }
	error(...args: any[]) { this.logger.error(...args); }
	box(message: string) { this.logger.box(message); }
}

export const logger = new LoggerService();
// REMOVED: logger.init(); <-- This was causing issues by running on import