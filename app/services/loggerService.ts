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
	
	public info(message: string, ...args: any[]): void {
		console.log(message, ...args);
	}
	
	public success(message: string, ...args: any[]): void {
		console.log(`✔ ${message}`, ...args);
	}
	
	public warn(message: string, ...args: any[]): void {
		console.warn(`⚠ ${message}`, ...args);
	}
	
	public error(message: string | Error, ...args: any[]): void {
		if (message instanceof Error) {
			console.error(`✖ ${message.message}`);
			if (message.stack) {
				console.error(message.stack);
			}
		} else {
			console.error(`✖ ${message}`, ...args);
		}
	}
	
	public debug(message: string, ...args: any[]): void {
		console.debug(`[DEBUG] ${message}`, ...args);
	}
	
	/**
	 * Renders a visual box around a message.
	 * Enforces symmetrical padding (2 spaces) on both sides.
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
			// Explicitly calculate Left Padding to ensure symmetry
			const leftPad = ' '.repeat(padding);
			const rightPad = ' '.repeat(width - line.length - padding);
			
			console.log(`│${leftPad}${line}${rightPad}│`);
		});
		console.log(bottom);
	}
}

export const logger = new LoggerService();
