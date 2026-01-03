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
 * defines the foundation of a file access abstraction layer for the app-manager
 * project. Its purpose is to centralise file system operations (read, write,
 * update, existence checks) behind a service-oriented API that can later support
 * multiple file formats (e.g. JSON, text) via pluggable handlers.
 *
 * Key characteristics:
 * - Service-oriented design: A FileService class provides a unified interface for
 *   file operations.
 * - Strategy pattern (planned): File handling is delegated to handler classes
 *   implementing IFileHandler, enabling format-specific logic.
 * - Stub-based, TDD-friendly structure: Placeholder handler implementations
 *   indicate a Red/Green/Refactor workflow.
 * - Node.js environment: Uses fs and path, indicating server-side or CLI usage.
 * - Extensibility-first: Logging (consola) and handler registration are prepared
 *   but not yet implemented.
 *
 * At present, this file serves as a scaffold rather than a functional
 * implementation.
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

import path from 'path';
import fs from 'fs';
import { consola } from 'consola';
import type { IFileHandler } from '../types/index';

// REFACTOR: Imports now point to the 'handlers' directory
import { FileHandlerJson } from '../handlers/fileHandlerJson';
import { FileHandlerText } from '../handlers/fileHandlerText';
import { FileHandlerCode } from '../handlers/fileHandlerCode';

class FileService {
	private handlers = new Map<string, IFileHandler>();
	private defaultHandler = new FileHandlerText();
	
	constructor() {
		this.initializeHandlers();
	}
	
	private initializeHandlers() {
		// Instantiate the handlers from their new location
		const json = new FileHandlerJson();
		const text = new FileHandlerText();
		const code = new FileHandlerCode();
		
		// 1. JSON-like Files
		this.register(['.json', '.webmanifest'], json);
		
		// 2. Code Files
		this.register(['.ts', '.js', '.vue', '.html'], code);
		
		// 3. Configuration / Dotfiles
		this.registerFilename('package.json', json);
		this.registerFilename('tsconfig.json', json);
		
		this.registerFilename('.env', text);
		this.registerFilename('.gitignore', text);
		this.registerFilename('.npmrc', text);
		this.registerFilename('.nuxtrc', text);
		this.registerFilename('.editorconfig', text);
		this.registerFilename('LICENSE', text);
		this.registerFilename('README.md', text);
		this.registerFilename('pnpm-workspace.yaml', text);
		this.registerFilename('.gitmodules', text);
		this.registerFilename('.idea', text);
	}
	
	private register(extensions: string[], handler: IFileHandler) {
		extensions.forEach(ext => this.handlers.set(ext, handler));
	}
	
	private registerFilename(filename: string, handler: IFileHandler) {
		this.handlers.set(filename, handler);
	}
	
	private getHandler(filePath: string): IFileHandler {
		const filename = path.basename(filePath);
		const ext = path.extname(filePath);
		
		if (this.handlers.has(filename)) return this.handlers.get(filename)!;
		if (this.handlers.has(ext)) return this.handlers.get(ext)!;
		
		return this.defaultHandler;
	}
	
	// --- Public API ---
	
	public ensureDir(dirPath: string): void {
		if (!fs.existsSync(dirPath)) {
			fs.mkdirSync(dirPath, { recursive: true });
		}
	}
	
	public read(filePath: string): any {
		return this.getHandler(filePath).read(filePath);
	}
	
	public write(filePath: string, content: any): void {
		this.ensureDir(path.dirname(filePath));
		this.getHandler(filePath).write(filePath, content);
	}
	
	public update(filePath: string, content: any): void {
		const handler = this.getHandler(filePath);
		if (handler.update) {
			handler.update(filePath, content);
		} else {
			consola.warn(`Update not supported for ${path.basename(filePath)}. Overwriting.`);
			this.write(filePath, content);
		}
	}
	
	public exists(filePath: string): boolean {
		return fs.existsSync(filePath);
	}
}

export const fileService = new FileService();