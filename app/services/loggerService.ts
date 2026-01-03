/**
 * ================================================================================
 *
 * @project:    app-manager
 * @file:       ~/app/services/loggerService.ts
 * @version:    1.0.0
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
 * V1.0.0, 20260102-00:39
 * Initial creation and release of loggerService.ts
 * Initial migration. Implements ILogger interface using native console methods.
 *
 * ================================================================================
 */

import type { ILogger } from '../types/index';

class LoggerService implements ILogger {
	
	/**
	 * Standard informational messages.
	 */
	public info(message: string, ...args: any[]): void {
		console.log(message, ...args);
	}
	
	/**
	 * Success messages (Operations completed).
	 */
	public success(message: string, ...args: any[]): void {
		// Future: Add green color formatting here
		console.log(`✔ ${message}`, ...args);
	}
	
	/**
	 * Warning messages (Non-fatal issues).
	 */
	public warn(message: string, ...args: any[]): void {
		// Future: Add yellow color formatting here
		console.warn(`⚠ ${message}`, ...args);
	}
	
	/**
	 * Error messages (Fatal or logic errors).
	 */
	public error(message: string | Error, ...args: any[]): void {
		// Future: Add red color formatting here
		if (message instanceof Error) {
			console.error(`✖ ${message.message}`);
			if (message.stack) {
				console.error(message.stack);
			}
		} else {
			console.error(`✖ ${message}`, ...args);
		}
	}
	
	/**
	 * Debug messages (Verbose output).
	 */
	public debug(message: string, ...args: any[]): void {
		// We could check ConfigService.flags.verbose here if we wanted strictly coupled logic,
		// but typically the caller decides when to call debug.
		console.debug(`[DEBUG] ${message}`, ...args);
	}
	
	/**
	 * Renders a visual box around a message.
	 * Useful for section headers or major announcements.
	 */
	public box(message: string): void {
		const lines = message.split('\n');
		const maxLength = Math.max(...lines.map(l => l.length));
		const padding = 2;
		const width = maxLength + (padding * 2);
		
		const top = '┌' + '─'.repeat(width) + '┐';
		const bottom = '└' + '─'.repeat(width) + '┘';
		
		console.log(top);
		lines.forEach(line => {
			const spaces = ' '.repeat(width - line.length - padding);
			console.log(`│ ${line}${spaces} │`);
		});
		console.log(bottom);
	}
}

// Export as Singleton
export const logger = new LoggerService();