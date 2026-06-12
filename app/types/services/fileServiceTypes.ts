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

import type { ZodSchema, z } from 'zod';

/**
 * The core contract for the Central File I/O Orchestrator.
 */
export interface IFileService {
	read<T = unknown>(filePath: string, schema?: ZodSchema<T>): Promise<T | null>;
	readText(filePath: string): Promise<string | null>;
	write(filePath: string, content: unknown): Promise<void>;
	update(filePath: string, content: unknown): Promise<void>;
	exists(filePath: string): Promise<boolean>;
	delete(filePath: string): Promise<void>;
}

/**
 * The core contract that any specific file handler must implement.
 * Enforces asynchronous, non-blocking I/O and strict type boundaries.
 */
export interface IFileHandler {
	/**
	 * Asynchronously reads file content from disk.
	 * @template T - The expected return type.
	 * @param filePath - The path to the file.
	 * @param schema - Optional Zod schema to enforce runtime shape validation.
	 * @returns A Promise resolving to the validated object, raw text, or null.
	 */
	read<T = unknown>(filePath: string, schema?: ZodSchema<T>): Promise<T | null>;
	
	/**
	 * Asynchronously reads a file strictly as a UTF-8 string.
	 * @param filePath - The path to the file.
	 * @returns A Promise resolving to the string content, or null if missing.
	 */
	readText(filePath: string): Promise<string | null>;
	
	/**
	 * Asynchronously writes content to a file, overwriting existing content.
	 * Must handle directory creation automatically.
	 * @param filePath - The path to the file.
	 * @param content - The untrusted content to write (enforced as unknown).
	 */
	write(filePath: string, content: unknown): Promise<void>;
	
	/**
	 * Asynchronously and intelligently updates existing content without destroying it.
	 * @param filePath - The path to the file.
	 * @param content - The partial content to merge or append.
	 */
	update?(filePath: string, content: unknown): Promise<void>;
	
	/**
	 * Asynchronously checks if a file exists without throwing errors.
	 */
	exists(filePath: string): Promise<boolean>;
	
	/**
	 * Asynchronously deletes a file if it exists.
	 */
	delete(filePath: string): Promise<void>;
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
