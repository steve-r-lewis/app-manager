/**
 * ================================================================================
 *
 * @project:    app-manager
 * @file:       ~/app/types/loggerServiceTypes.ts
 * @version:    1.0.0
 * @createDate: 2026 Jan 02
 * @createTime: 00:33
 * @author:     Steve R Lewis
 *
 * ================================================================================
 *
 * @description:
 * Type definitions for the Logger Service.
 *
 * Defines the contract for application output, ensuring consistent
 * user feedback across all services.
 *
 * ================================================================================
 *
 * @notes: Revision History
 *
 * V1.0.0, 20260102-00:33
 * Initial creation and release of loggerServiceTypes.ts
 *
 * ================================================================================
 */

export type LogLevel = 'info' | 'success' | 'warn' | 'error' | 'debug';

export interface ILogger {
	/**
	 * Asynchronously initializes the logging environment.
	 */
	init(targetRoot: string): Promise<void>;
	
	info(message: string, ...args: unknown[]): void;
	success(message: string, ...args: unknown[]): void;
	warn(message: string, ...args: unknown[]): void;
	error(message: string | Error, ...args: unknown[]): void;
	debug(message: string, ...args: unknown[]): void;
	
	/**
	 * Creates a visual separator in the output.
	 */
	box(message: string): void;
}