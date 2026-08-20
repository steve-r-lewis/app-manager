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
	
	/** Explicitly define if the shell should be used. Essential for security boundaries. */
	shell?: boolean | string;
}

export interface ProcessResult {
	stdout: string;   /** The standard output string (trimmed) */
	stderr: string;   /** The standard error string (trimmed) */
	exitCode: number; /** The process exit code (0 usually indicates success) */
}

/**
 * The core contract for the Process Service Domain.
 */
export interface IProcessService {
	execute(command: string, options?: ProcessExecuteOptions): Promise<ProcessResult>;
	spawn(command: string, args: string[], options?: ProcessExecuteOptions): Promise<number>;
}