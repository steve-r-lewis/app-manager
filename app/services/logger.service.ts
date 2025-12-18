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

import { consola, type LogObject } from 'consola';
import fs from 'fs';
import path from 'path';
import pc from 'picocolors';

const ANSI_REGEX = /[\u001b\u009b][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-ORZcf-nqry=><]/g;

class LoggerService {
	private targetRoot: string = '';
	private sessionStream: fs.WriteStream | null = null;
	private errorStream: fs.WriteStream | null = null;
	private isInitialized = false;
	
	init(targetRoot: string) {
		this.close(); // Force close previous handles
		this.targetRoot = targetRoot;
		
		try {
			const monitorDir = path.resolve(targetRoot, 'app-monitor');
			const logsDir = path.join(monitorDir, 'logs');
			const reportsDir = path.join(monitorDir, 'reports');
			
			// Recursive true ensures parent folders are created too
			if (!fs.existsSync(logsDir)) fs.mkdirSync(logsDir, { recursive: true });
			if (!fs.existsSync(reportsDir)) fs.mkdirSync(reportsDir, { recursive: true });
			
			const errorFile = path.join(logsDir, 'app-manager-error.log');
			this.errorStream = fs.createWriteStream(errorFile, { flags: 'a' });
			
			if (!this.isInitialized) {
				consola.addReporter({
					log: (logObj: LogObject) => {
						this.handleLog(logObj);
					},
				});
				this.isInitialized = true;
			}
			
		} catch (error) {
			console.error('FATAL: Could not initialize Logger Service', error);
		}
	}
	
	enableSessionLogging() {
		if (!this.targetRoot) return;
		
		if (this.sessionStream) {
			this.sessionStream.destroy(); // Force close old stream
		}
		
		const dateStr = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
		const logFile = path.join(this.targetRoot, 'app-monitor/logs', `session-${dateStr}.log`);
		
		this.sessionStream = fs.createWriteStream(logFile, { flags: 'a' });
		consola.success(pc.dim(`📝 Session logging enabled: ${logFile}`));
	}
	
	close() {
		// destroy() releases the file handle immediately, unlike end()
		if (this.sessionStream) {
			this.sessionStream.destroy();
			this.sessionStream = null;
		}
		if (this.errorStream) {
			this.errorStream.destroy();
			this.errorStream = null;
		}
	}
	
	private handleLog(logObj: LogObject) {
		// If streams are closed (testing cleanup), do nothing
		if (!this.errorStream && !this.sessionStream) return;
		
		const line = this.formatLogLine(logObj);
		
		// Safe write: check if stream is writable
		if (this.sessionStream && !this.sessionStream.destroyed) {
			this.sessionStream.write(line);
		}
		
		if (logObj.level <= 1 && this.errorStream && !this.errorStream.destroyed) {
			this.errorStream.write(line);
		}
	}
	
	private formatLogLine(logObj: LogObject): string {
		const args = logObj.args.map(arg => {
			if (arg instanceof Error) return `${arg.message}\n${arg.stack}`;
			if (typeof arg === 'object') return JSON.stringify(arg);
			return String(arg);
		}).join(' ');
		
		const cleanMessage = args.replace(ANSI_REGEX, '');
		// Pad to ensure alignment, e.g. "ERROR  "
		const type = (logObj.type || 'INFO').toUpperCase().padEnd(7);
		const time = new Date().toISOString();
		
		return `[${time}] [${type}] ${cleanMessage}\n`;
	}
}

export const logger = new LoggerService();