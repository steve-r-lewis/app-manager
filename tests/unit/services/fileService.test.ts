/**
 * ================================================================================
 *
 * @project:    app-manager
 * @file:       ~/tests/unit/services/fileService.test.ts
 * @version:    1.0.1
 * @createDate: 2025 Dec 31
 * @createTime: 21:10
 * @author:     Steve R Lewis
 *
 * ================================================================================
 *
 * @description:
 * Unit Test Suite for the File Service Orchestrator.
 *
 * This suite verifies the core logic of the FileService class, ensuring it correctly:
 * 1. Routes requests to the appropriate handler (JSON vs Text) based on file extension.
 * 2. Handle I/O errors gracefully (e.g., returning null for missing files).
 * 3. Enforces safety mechanisms (e.g., creating missing directories before writing).
 * 4. Executes "Smart Updates" correctly (merging JSON objects vs appending text lines).
 *
 * Methodology:
 * - Uses 'vi.mock' to abstract the Node.js 'fs' module, preventing actual disk writes.
 * - Uses 'vi.mock' to suppress 'consola' logging during test execution.
 *
 * ================================================================================
 *
 * @notes: Revision History
 *
 * V1.1.0, 20260105-01:26
 * Extended the test suite coverage to test all file types.
 *
 * V1.0.1, 20260101-01:30
 * Added comprehensive documentation and inline comments.
 *
 * V1.0.0, 20251231-21:10
 * Initial creation and release of fileService.test.ts
 *
 * ================================================================================
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import fs from 'node:fs/promises';
import { z } from 'zod';
import { fileService } from '../../../app/services/fileService.js';
import { logger } from '../../../app/services/loggerService.js';

vi.mock('node:fs/promises');
vi.mock('../../../app/services/loggerService.js', () => ({
	logger: { error: vi.fn(), warn: vi.fn(), info: vi.fn() }
}));

describe('FileService (Complete)', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});
	
	describe('read() [Schema & JSONC Boundary]', () => {
		const TestSchema = z.object({ version: z.string() });
		
		it('should parse and validate JSON successfully', async () => {
			vi.mocked(fs.readFile).mockResolvedValueOnce('{"version": "1.0.0"}');
			const result = await fileService.read('test.json', TestSchema);
			expect(result).toStrictEqual({ version: '1.0.0' });
		});
		
		it('should safely reject invalid JSONC syntax using the AST parser', async () => {
			// jsonc-parser handles trailing commas, but breaks on malformed objects
			vi.mocked(fs.readFile).mockResolvedValueOnce('{ "version": ');
			const result = await fileService.read('test.json', TestSchema);
			
			expect(result).toBeNull();
			expect(logger.error).toHaveBeenCalledWith(expect.stringContaining('Invalid JSONC syntax'));
		});
	});
	
	describe('readText() [Permissions Boundary]', () => {
		it('should trigger security log on EACCES permission denied', async () => {
			const accessError = Object.assign(new Error('EACCES'), { code: 'EACCES' });
			vi.mocked(fs.readFile).mockRejectedValueOnce(accessError);
			
			await expect(fileService.readText('locked.txt')).rejects.toThrow();
			expect(logger.error).toHaveBeenCalledWith(expect.stringContaining('Permission denied'));
		});
	});
	
	describe('write() [Atomic Boundary]', () => {
		it('should execute an atomic write pattern for files', async () => {
			vi.mocked(fs.mkdir).mockResolvedValue(undefined);
			vi.mocked(fs.writeFile).mockResolvedValue(undefined);
			vi.mocked(fs.rename).mockResolvedValue(undefined);
			
			await fileService.write('output.json', { a: 1 });
			
			expect(fs.writeFile).toHaveBeenCalledWith(expect.stringContaining('.tmp.'), '{\n  "a": 1\n}', 'utf-8');
			expect(fs.rename).toHaveBeenCalledWith(expect.stringContaining('.tmp.'), 'output.json');
		});
	});
	
	describe('update() [AST Modification Boundary]', () => {
		it('should modify JSON AST and save via atomic write', async () => {
			// Mock exists to return true
			vi.mocked(fs.access).mockResolvedValue(undefined);
			vi.mocked(fs.readFile).mockResolvedValueOnce('{"version": "1.0.0"}');
			
			await fileService.update('config.json', { target: "node" });
			
			// Verify AST parser injected the new property
			expect(fs.writeFile).toHaveBeenCalledWith(
				expect.stringContaining('.tmp.'),
				expect.stringContaining('"target": "node"'),
				'utf-8'
			);
		});
		
		it('should cleanly append to text files using memory swap', async () => {
			vi.mocked(fs.access).mockResolvedValue(undefined);
			vi.mocked(fs.readFile).mockResolvedValueOnce('LINE 1\n');
			
			await fileService.update('.env', 'LINE 2');
			
			// Verify it read, appended in memory, and wrote atomically
			expect(fs.writeFile).toHaveBeenCalledWith(
				expect.stringContaining('.tmp.'),
				'LINE 1\nLINE 2\n',
				'utf-8'
			);
		});
	});
	
	describe('delete() & exists()', () => {
		it('should safely confirm existence', async () => {
			vi.mocked(fs.access).mockResolvedValueOnce(undefined);
			expect(await fileService.exists('file.txt')).toBe(true);
		});
		
		it('should safely suppress ENOENT during delete', async () => {
			const noEntryError = Object.assign(new Error('ENOENT'), { code: 'ENOENT' });
			vi.mocked(fs.unlink).mockRejectedValueOnce(noEntryError);
			
			await expect(fileService.delete('missing.txt')).resolves.not.toThrow();
		});
	});
});