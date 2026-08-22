/**
 * ================================================================================
 *
 * @project:    app-manager
 * @file:       ~/app/services/fileService.ts
 * @version:    2.0.3
 * @createDate: 2025 Dec 31
 * @createTime: 16:49
 * @author:     Steve R Lewis
 *
 * ================================================================================
 *
 * @description:
 *
 * The Central File I/O Orchestrator. (Strict Asynchronous Implementation)
 *
 * FEATURES:
 * - Smart Read: Auto-detects and parses JSONC, returning strictly validated schemas.
 * - Smart Update: Uses 'jsonc-parser' for non-destructive, AST-based JSON updates.
 * - Safety: Non-blocking async I/O. Schema-enforced type guarantees.
 *
 * ================================================================================
 *
 * @notes: Revision History
 *
 * V2.0.3, 20260822-02:00
 * read() and update() now recognize '.jsonc' as well as '.json' (new
 * private isJsonFile() helper), so JSONC files actually get parsed/
 * surgically-updated via jsonc-parser instead of falling through to raw-
 * text handling — the class doc comment's "Smart Read: Auto-detects and
 * parses JSONC" claim was previously untrue for anything but '.json'.
 * read()'s parse() call now also passes { allowTrailingComma: true },
 * since jsonc-parser defaults that option to false — trailing commas were
 * being rejected even for '.json' despite the JSONC-support claim. write()
 * needed no change (it already branches on typeof content, not extension).
 * modify()'s ModificationOptions has no equivalent trailing-comma option,
 * so update()'s surgical-edit path is unaffected by this.
 *
 * V2.0.2, 20260822-01:33
 * delete()'s catch block now rethrows any non-ENOENT error unconditionally
 * (matching readText()'s posture) instead of only when the error shape has
 * a 'code' property — a plain Error or non-standard thrown value is no
 * longer silently swallowed. update()'s unsupported-extension fallback now
 * logs via the injected this.logger.warn() instead of calling consola
 * directly, matching every other log call site in this class; the now-
 * unused 'consola' import was removed.
 *
 * V2.0.1, 20260822-01:30
 * write() now decides JSON.stringify vs raw string based on the actual
 * type of `content`, not the file extension — fixes object content being
 * written as the literal string "[object Object]" for any non-.json path
 * (and the same corruption via update()'s unsupported-extension fallback,
 * which calls write()). atomicWrite()'s temp filename now includes the
 * process pid and a random suffix alongside Date.now() to remove the
 * (unlikely) millisecond-collision risk on concurrent writes to the same
 * path.
 *
 * V2.0.0, 20260112-18:15
 * Refactored to implement "Smart" logic directly.
 * - Added 'jsonc-parser' for surgical JSON updates (Token Scanner).
 * - Implemented auto-parsing for .json files.
 * - Added 'readText' for raw string access (AST/CodeService support).
 *
 * V1.0.0, 20251231-16:49
 * Initial creation and release of fileService.ts
 *
 * ================================================================================
 */

import fs from 'node:fs/promises';
import path from 'node:path';
import { modify, applyEdits, parse } from 'jsonc-parser';
import type { ZodSchema } from 'zod';
import { logger } from './loggerService.js';
import type { IFileService, ILogger } from '../types/index.js';

export class FileService implements IFileService {
	private logger: ILogger = logger;
	
	public async read<T = unknown>(filePath: string, schema?: ZodSchema<T>): Promise<T | null> {
		const content = await this.readText(filePath);
		if (content === null) return null;
		
		if (this.isJsonFile(filePath)) {
			const errors: any[] = [];
			// Your brilliant AST-based parser prevents native JSON.parse crashes
			const parsed = parse(content, errors, { allowTrailingComma: true });
			
			if (errors.length > 0) {
				this.logger.error(`FileService Read Error (${filePath}): Invalid JSONC syntax detected.`);
				return null;
			}
			
			if (schema) {
				const result = schema.safeParse(parsed);
				if (!result.success) {
					this.logger.error(`FileService Schema Error (${filePath}): ${result.error.message}`);
					throw new Error(`Schema validation failed for ${filePath}`);
				}
				return result.data;
			}
			
			return parsed as T;
		}
		
		return content as unknown as T;
	}
	
	public async readText(filePath: string): Promise<string | null> {
		try {
			return await fs.readFile(filePath, 'utf-8');
		} catch (error: unknown) {
			if (error instanceof Error && 'code' in error) {
				const osError = error as NodeJS.ErrnoException;
				if (osError.code === 'ENOENT') return null;
				if (osError.code === 'EACCES') {
					this.logger.error(`OS Permission denied. Cannot read file: ${filePath}`);
				}
			}
			const errMsg = error instanceof Error ? error.message : String(error);
			this.logger.error(`FileService ReadText Error (${filePath}): ${errMsg}`);
			throw error; // Escalate permission errors
		}
	}
	
	public async write(filePath: string, content: unknown): Promise<void> {
		try {
			await this.ensureDir(filePath);
			
			let dataToWrite: string;

			if (typeof content === 'string') {
				dataToWrite = content;
			} else if (typeof content === 'object' && content !== null) {
				dataToWrite = JSON.stringify(content, null, 2);
			} else {
				dataToWrite = String(content);
			}
			
			// Replaced fs.writeFile with atomic helper
			await this.atomicWrite(filePath, dataToWrite);
		} catch (error: unknown) {
			const errMsg = error instanceof Error ? error.message : String(error);
			this.logger.error(`FileService Write Error (${filePath}): ${errMsg}`);
			throw error;
		}
	}
	
	public async update(filePath: string, content: unknown): Promise<void> {
		const fileExists = await this.exists(filePath);
		
		if (!fileExists) {
			await this.write(filePath, content);
			return;
		}
		
		try {
			if (this.isJsonFile(filePath)) {
				if (typeof content !== 'object' || content === null) {
					throw new TypeError('Update content for JSON must be a non-null object.');
				}
				
				let rawText = await fs.readFile(filePath, 'utf-8');
				
				for (const [key, value] of Object.entries(content as Record<string, unknown>)) {
					const edits = modify(rawText, [key], value, {
						formattingOptions: { insertSpaces: true, tabSize: 2 }
					});
					rawText = applyEdits(rawText, edits);
				}
				
				// Replaced fs.writeFile with atomic helper
				await this.atomicWrite(filePath, rawText);
				return;
			}
			
			if (this.isTextFile(filePath)) {
				const currentContent = await fs.readFile(filePath, 'utf-8');
				const newContent = String(content);
				
				if (!currentContent.includes(newContent)) {
					const separator = currentContent.endsWith('\n') ? '' : '\n';
					// Replaced non-atomic fs.appendFile with atomic in-memory swap
					await this.atomicWrite(filePath, `${currentContent}${separator}${newContent}\n`);
				}
				return;
			}
			
			this.logger.warn(`Update logic not supported for ${path.basename(filePath)}. Overwriting entirely.`);
			await this.write(filePath, content);
			
		} catch (error: unknown) {
			const errMsg = error instanceof Error ? error.message : String(error);
			this.logger.error(`FileService Update Error (${filePath}): ${errMsg}`);
			throw error;
		}
	}
	
	public async exists(filePath: string): Promise<boolean> {
		try {
			await fs.access(filePath);
			return true;
		} catch {
			return false;
		}
	}
	
	public async delete(filePath: string): Promise<void> {
		try {
			await fs.unlink(filePath);
		} catch (error: unknown) {
			if (error instanceof Error && 'code' in error && (error as NodeJS.ErrnoException).code === 'ENOENT') {
				return;
			}
			throw error;
		}
	}
	
	// --- Private Helpers ---
	
	private async ensureDir(filePath: string): Promise<void> {
		const dir = path.dirname(filePath);
		await fs.mkdir(dir, { recursive: true });
	}
	
	private isJsonFile(filePath: string): boolean {
		return filePath.endsWith('.json') || filePath.endsWith('.jsonc');
	}

	private isTextFile(filePath: string): boolean {
		const base = path.basename(filePath).toLowerCase();
		const ext = path.extname(filePath).toLowerCase();
		
		// .txt and .md are standard extensions. .env and .gitignore are base filenames.
		return ['.txt', '.md'].includes(ext) || ['.env', '.gitignore', '.npmrc'].includes(base);
	}
	
	/**
	 * Guarantees zero file corruption by writing to a temporary file
	 * and executing an OS-level atomic rename operation.
	 */
	private async atomicWrite(filePath: string, data: string): Promise<void> {
		const uniqueSuffix = `${process.pid}-${Date.now()}-${Math.random().toString(36).slice(2)}`;
		const tempPath = `${filePath}.tmp.${uniqueSuffix}`;
		try {
			await fs.writeFile(tempPath, data, 'utf-8');
			await fs.rename(tempPath, filePath);
		} catch (error) {
			await fs.unlink(tempPath).catch(() => {}); // Clean up orphan
			throw error;
		}
	}
}

export const fileService = new FileService();