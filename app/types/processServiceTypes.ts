/**
 * ================================================================================
 *
 * @project:    app-manager
 * @file:       ~/app/types/processServiceTypes.ts
 * @version:    1.0.1
 * @createDate: 2025 Dec 31
 * @createTime: 01:04
 * @author:     Steve R Lewis
 *
 * ================================================================================
 *
 * @description:
 * Type definitions for the Process Execution Domain.
 * These interfaces define the contract for interacting with the operating system,
 * including defining supported package managers and standardizing the inputs/outputs
 * for shell command execution (child_process wrappers).
 *
 * ================================================================================
 *
 * @notes: Revision History
 *
 * V1.0.1, 20251231-01:48
 * Refactored to namespaced types (ProcessPrefix) and added execution interfaces.
 *
 * V1.0.0, 20251231-01:04
 * Initial creation and release of processServiceTypes.ts
 *
 * ================================================================================
 */

/**
 * Supported Node.js package managers for command execution.
 */
export type ProcessPackageManager = 'npm' | 'pnpm' | 'yarn' | 'bun';

/**
 * Options to configure the execution of a shell command.
 */
export interface ProcessExecuteOptions {
	/** The directory to execute the command in (defaults to process.cwd()) */
	cwd?: string;
	
	/** Environment variable overrides for this specific process */
	env?: Record<string, string>;
	
	/** If true, suppresses stdout/stderr logging to the console */
	silent?: boolean;
	
	/** Execution timeout in milliseconds */
	timeout?: number;
}

/**
 * The standardized result object returned after a command finishes.
 */
export interface ProcessResult {
	/** The standard output string (trimmed) */
	stdout: string;
	
	/** The standard error string (trimmed) */
	stderr: string;
	
	/** The process exit code (0 usually indicates success) */
	exitCode: number;
}
