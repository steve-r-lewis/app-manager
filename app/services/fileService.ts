/**
 * ================================================================================
 *
 * @project:    app-manager
 * @file:       ~/app/services/fileService.ts
 * @version:    1.0.0
 * @createDate: 2025 Dec 31
 * @createTime: 16:49
 * @author:     Steve R Lewis
 *
 * ================================================================================
 *
 * @description:
 * Standard File I/O Service.
 *
 * Provides a unified way to read/write files.
 * Refactored to remove legacy "Handler" pattern dependencies in favor of
 * specialized services (CodeService, etc.).
 *
 * ================================================================================
 *
 * @notes: Revision History
 *
 * V1.0.0, 20251231-16:49
 * Initial creation and release of fileService.ts
 *
 * ================================================================================
 */

import fs from 'node:fs';
import path from 'node:path';
import { logger } from './loggerService';

class FileService {
	
	/**
	 * Synchronously reads a file as a UTF-8 string.
	 * Returns null if file does not exist.
	 */
	public read(filePath: string): string | null {
		try {
			if (!fs.existsSync(filePath)) {
				return null;
			}
			return fs.readFileSync(filePath, 'utf-8');
		} catch (error: any) {
			logger.error(`FileService Read Error (${filePath}): ${error.message}`);
			return null;
		}
	}
	
	/**
	 * Synchronously writes content to a file.
	 * Automatically creates missing directories.
	 */
	public write(filePath: string, content: string): void {
		try {
			const dir = path.dirname(filePath);
			if (!fs.existsSync(dir)) {
				fs.mkdirSync(dir, { recursive: true });
			}
			fs.writeFileSync(filePath, content, 'utf-8');
		} catch (error: any) {
			logger.error(`FileService Write Error (${filePath}): ${error.message}`);
			throw error;
		}
	}
	
	/**
	 * Checks if a file exists.
	 */
	public exists(filePath: string): boolean {
		return fs.existsSync(filePath);
	}
	
	/**
	 * Deletes a file if it exists.
	 */
	public delete(filePath: string): void {
		if (fs.existsSync(filePath)) {
			fs.unlinkSync(filePath);
		}
	}
}

export const fileService = new FileService();