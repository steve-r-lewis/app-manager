/**
 * ================================================================================
 *
 * @project:    app-manager
 * @file:       ~/app/handlers/fileHandlerText.ts
 * @version:    1.0.1
 * @createDate: 2025 Dec 31
 * @createTime: 23:49
 * @author:     Steve R Lewis
 *
 * ================================================================================
 *
 * @description:
 * The Text File Handler Implementation.
 *
 * This handler manages interactions with plain text and configuration files
 * (e.g., .env, .gitignore, .npmrc, LICENSE, README.md).
 *
 * Key Behaviors:
 * 1. Read: Returns the raw string content of the file. Returns null if the
 * file does not exist.
 * 2. Write: Overwrites the target file with the provided string content.
 * 3. Update: Implements an "Append if Unique" strategy. This is critical for
 * list-based config files (like .gitignore). It checks if the specific
 * content/line already exists; if not, it appends it on a new line.
 *
 * ================================================================================
 *
 * @notes: Revision History
 *
 * V1.0.1, 20260101-01:53
 * Refactored to dedicated 'handlers' directory.
 *
 * V1.0.0, 20251231-23:49
 * Initial creation and release of fileHandlerText.ts
 *
 * ================================================================================
 */

import fs from 'fs';
import { consola } from 'consola';
import type { IFileHandler } from '../types/index';

export class FileHandlerText implements IFileHandler {
	/**
	 * Reads a text file from disk.
	 * @param filePath - Absolute path to the file.
	 * @returns The raw string content or null if missing.
	 */
	read(filePath: string): string | null {
		if (!fs.existsSync(filePath)) return null;
		return fs.readFileSync(filePath, 'utf-8');
	}
	
	/**
	 * Writes a string to disk, completely overwriting existing content.
	 * @param filePath - Absolute path to the file.
	 * @param content - The string to write.
	 */
	write(filePath: string, content: string): void {
		try {
			fs.writeFileSync(filePath, content);
		} catch (e) {
			consola.error(`Error writing text to ${filePath}`, e);
			throw e;
		}
	}
	
	/**
	 * Updates a text file by appending content if it is missing.
	 * Useful for ensuring a line exists in .env or .gitignore without duplication.
	 *
	 * @param filePath - Absolute path to the file.
	 * @param content - The string (or line) to ensure exists in the file.
	 */
	update(filePath: string, content: string): void {
		const current = this.read(filePath) || '';
		
		// Check if the content is already present (simple inclusion check)
		if (!current.includes(content.trim())) {
			// Ensure we append on a new line if the file isn't empty or ending in newline
			const separator = current.endsWith('\n') || current === '' ? '' : '\n';
			this.write(filePath, current + separator + content + '\n');
		}
	}
}