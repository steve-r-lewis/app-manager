/**
 * ================================================================================
 *
 * @project:    app-manager
 * @file:       ~/app/handlers/fileHandlerCode.ts
 * @version:    1.0.1
 * @createDate: 2025 Dec 31
 * @createTime: 23:52
 * @author:     Steve R Lewis
 *
 * ================================================================================
 *
 * @description:
 * The Code File Handler Implementation.
 *
 * This handler manages the physical read/write operations for source code files
 * (e.g., .ts, .js, .vue, .html).
 *
 * Architectural Note:
 * Unlike the JSON or Text handlers, this class acts primarily as a reliable I/O
 * passthrough. It does NOT attempt to "Update" or "Merge" code directly, as
 * safely modifying source code requires Abstract Syntax Tree (AST) analysis.
 *
 * Key Behaviors:
 * 1. Read: Returns the raw source string.
 * 2. Write: Overwrites the file with the provided source string.
 * 3. Update: DELIBERATELY UNIMPLEMENTED. The FileService Orchestrator detects
 * this absence and prevents unsafe "text appending" to source code files,
 * forcing the system to use the specialized CodeService for refactoring.
 *
 * ================================================================================
 *
 * @notes: Revision History
 *
 * V1.0.1, 20260101-01:56
 * Refactored to dedicated 'handlers' directory.
 *
 * V1.0.0, 20251231-23:52
 * Initial creation and release of fileHandlerCode.ts
 *
 * ================================================================================
 */

import fs from 'fs';
import { consola } from 'consola';
import type { IFileHandler } from '../types/index';

export class FileHandlerCode implements IFileHandler {
	/**
	 * Reads a source code file from disk.
	 * @param filePath - Absolute path to the file.
	 * @returns The raw source string or null if missing.
	 */
	read(filePath: string): string | null {
		if (!fs.existsSync(filePath)) return null;
		return fs.readFileSync(filePath, 'utf-8');
	}
	
	/**
	 * Writes source code to disk.
	 * @param filePath - Absolute path to the file.
	 * @param content - The source code string to write.
	 */
	write(filePath: string, content: string): void {
		try {
			fs.writeFileSync(filePath, content);
		} catch (e) {
			consola.error(`Error writing code to ${filePath}`, e);
			throw e;
		}
	}
	
	// NOTE: 'update' is intentionally omitted.
	// Code manipulation is too complex for a generic handler and is delegated
	// to the CodeService logic strategies (AST parsers).
}
