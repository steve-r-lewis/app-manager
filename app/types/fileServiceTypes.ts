/**
 * ================================================================================
 *
 * @project:    app-manager
 * @file:       ~/app/types/fileServiceTypes.ts
 * @version:    1.0.0
 * @createDate: 2025 Dec 31
 * @createTime: 01:10
 * @author:     Steve R Lewis
 *
 * ================================================================================
 *
 * @description:
 * Type definitions for the File Service Domain.
 *
 * These interfaces define the contract for the "Mechanism" layer of the application,
 * abstracting low-level filesystem (fs) operations into a unified API.
 *
 * It enables the creation of specialized handlers (JSON, Text, Code) that allow
 * the core application to read/write/update files without knowing the underlying
 * parsing logic or file extension requirements.
 *
 * ================================================================================
 *
 * @notes: Revision History
 *
 * V1.0.0, 20251231-01:10
 * Initial creation and release of fileServiceTypes.ts
 *
 * ================================================================================
 */

/**
 * The core contract that any specific file handler (JSON, Text, Code) must implement.
 */
export interface IFileHandler {
	/**
	 * Reads file content from disk.
	 * Returns null if the file does not exist, preventing try/catch bloat in consumers.
	 * @template T - The expected return type (e.g. string for text, object for JSON).
	 */
	read<T = any>(filePath: string): T | null;
	
	/**
	 * Writes content to a file, overwriting existing content.
	 * Should handle directory creation automatically if the service layer requires it.
	 */
	write(filePath: string, content: any): void;
	
	/**
	 * Optional: Intelligently updates existing content without destroying it.
	 * - For JSON: Performs a shallow merge.
	 * - For Text: Appends content if unique.
	 * - For Code: (Often unimplemented or delegates to AST logic).
	 */
	update?(filePath: string, content: any): void;
}

/**
 * Defines the operational context in which a file is being manipulated.
 * Used to determine strictness or specific formatting rules.
 */
export type FileHandlerContext = 'provisioning' | 'layer' | 'edit';

/**
 * Configuration options specific to JSON file handling.
 */
export interface FileHandlerJsonOptions {
	/** Number of spaces for indentation (defaults to 2) */
	spaces?: number;
}