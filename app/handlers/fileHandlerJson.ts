/**
 * ================================================================================
 *
 * @project:    app-manager
 * @file:       ~/app/handlers/fileHandlerJson.ts
 * @version:    1.0.1
 * @createDate: 2025 Dec 31
 * @createTime: 23:38
 * @author:     Steve R Lewis
 *
 * ================================================================================
 *
 * @description:
 * The JSON File Handler Implementation.
 *
 * This handler is responsible for all interactions with .json and JSON-like files
 * (e.g., .webmanifest, .eslintrc).
 *
 * Key Behaviors:
 * 1. Read: Automatically parses JSON strings into JavaScript objects. Returns null
 * on parsing errors to prevent application crashes.
 * 2. Write: Enforces a standard 2-space indentation for all generated JSON files,
 * ensuring human readability.
 * 3. Update: Performs a "Shallow Merge" strategy. It reads the existing file,
 * overwrites only the keys provided in the update object, and preserves the rest.
 *
 * ================================================================================
 *
 * @notes: Revision History
 *
 * V1.0.1, 20260101-01:35
 * Refactored to dedicated 'handlers' directory.
 *
 * V1.0.0, 20251231-23:38
 * Initial creation and release of fileHandlerJson.ts
 *
 * ================================================================================
 */

import fs from 'fs';
import { consola } from 'consola';
import type { IFileHandler } from '../types/index';

export class FileHandlerJson implements IFileHandler {
	/**
	 * Reads and parses a JSON file.
	 * @param filePath - Absolute path to the file.
	 * @returns The parsed object <T> or null if missing/invalid.
	 */
	read<T = any>(filePath: string): T | null {
		if (!fs.existsSync(filePath)) return null;
		try {
			return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
		} catch (e) {
			consola.error(`JSON Parse Error at ${filePath}:`, e);
			return null;
		}
	}
	
	/**
	 * Writes an object to disk as a formatted JSON string.
	 * @param filePath - Absolute path to the file.
	 * @param data - The object to serialize.
	 */
	write(filePath: string, data: any): void {
		try {
			// Enforce standard 2-space indentation
			const content = JSON.stringify(data, null, 2);
			fs.writeFileSync(filePath, content);
		} catch (e) {
			consola.error(`Error writing JSON to ${filePath}`, e);
			throw e;
		}
	}
	
	/**
	 * Updates an existing JSON file by merging new data into it.
	 * Uses a shallow merge strategy ({ ...old, ...new }).
	 * @param filePath - Absolute path to the file.
	 * @param updates - Partial object containing keys to update.
	 */
	update(filePath: string, updates: Record<string, any>): void {
		const current = this.read(filePath) || {};
		const merged = { ...current, ...updates };
		this.write(filePath, merged);
	}
}