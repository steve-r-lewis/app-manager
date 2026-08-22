/**
 * ================================================================================
 *
 * @project:    app-manager
 * @file:       ~/tests/unit/services/fileService.test.ts
 * @version:    1.2.0
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
 * V1.2.0, 20260822-02:15
 * Coverage-only pass: added tests for previously-untested paths on the
 * existing implementation (no production code changed) — read()'s schema-
 * validation-failure throw, non-JSON passthrough, and ENOENT-to-null
 * propagation; readText()'s ENOENT-to-null and generic-error-rethrow
 * branches; write()'s failure-logs-and-rethrows path and string-content-
 * verbatim-to-a-.json-path case; update()'s exists()-false delegation to
 * write(), non-object-content TypeError, unsupported-extension write-
 * through, and already-present skip-append no-op; exists()'s false case.
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

		it('should parse .jsonc files with comments, same as .json', async () => {
			vi.mocked(fs.readFile).mockResolvedValueOnce('{\n  // leading comment\n  "version": "1.0.0"\n}');
			const result = await fileService.read('test.jsonc', TestSchema);
			expect(result).toStrictEqual({ version: '1.0.0' });
		});

		it('should tolerate trailing commas in .json content', async () => {
			vi.mocked(fs.readFile).mockResolvedValueOnce('{"version": "1.0.0",}');
			const result = await fileService.read('test.json', TestSchema);
			expect(result).toStrictEqual({ version: '1.0.0' });
		});

		it('should tolerate trailing commas in .jsonc content', async () => {
			vi.mocked(fs.readFile).mockResolvedValueOnce('{"version": "1.0.0",}');
			const result = await fileService.read('test.jsonc', TestSchema);
			expect(result).toStrictEqual({ version: '1.0.0' });
		});

		it('should throw when the parsed content fails schema validation', async () => {
			vi.mocked(fs.readFile).mockResolvedValueOnce('{"version": 123}');
			await expect(fileService.read('test.json', TestSchema)).rejects.toThrow(
				'Schema validation failed for test.json'
			);
			expect(logger.error).toHaveBeenCalledWith(expect.stringContaining('FileService Schema Error'));
		});

		it('should return raw text content unparsed for non-JSON file types', async () => {
			vi.mocked(fs.readFile).mockResolvedValueOnce('hello world');
			const result = await fileService.read('notes.txt');
			expect(result).toBe('hello world');
		});

		it('should return null when the underlying file does not exist', async () => {
			const enoentError = Object.assign(new Error('ENOENT'), { code: 'ENOENT' });
			vi.mocked(fs.readFile).mockRejectedValueOnce(enoentError);
			const result = await fileService.read('missing.json', TestSchema);
			expect(result).toBeNull();
		});
	});
	
	describe('readText() [Permissions Boundary]', () => {
		it('should trigger security log on EACCES permission denied', async () => {
			const accessError = Object.assign(new Error('EACCES'), { code: 'EACCES' });
			vi.mocked(fs.readFile).mockRejectedValueOnce(accessError);

			await expect(fileService.readText('locked.txt')).rejects.toThrow();
			expect(logger.error).toHaveBeenCalledWith(expect.stringContaining('Permission denied'));
		});

		it('should return null for ENOENT without throwing', async () => {
			const enoentError = Object.assign(new Error('ENOENT'), { code: 'ENOENT' });
			vi.mocked(fs.readFile).mockRejectedValueOnce(enoentError);

			const result = await fileService.readText('missing.txt');
			expect(result).toBeNull();
		});

		it('should log and rethrow a generic error that is not ENOENT/EACCES', async () => {
			const genericError = new Error('disk exploded');
			vi.mocked(fs.readFile).mockRejectedValueOnce(genericError);

			await expect(fileService.readText('file.txt')).rejects.toThrow('disk exploded');
			expect(logger.error).toHaveBeenCalledWith(expect.stringContaining('FileService ReadText Error'));
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

		it('should serialize object content to valid JSON even for non-.json paths', async () => {
			vi.mocked(fs.mkdir).mockResolvedValue(undefined);
			vi.mocked(fs.writeFile).mockResolvedValue(undefined);
			vi.mocked(fs.rename).mockResolvedValue(undefined);

			await fileService.write('output.jsonc', { a: 1 });

			const [, writtenData] = vi.mocked(fs.writeFile).mock.calls[0];
			expect(() => JSON.parse(writtenData as string)).not.toThrow();
			expect(JSON.parse(writtenData as string)).toStrictEqual({ a: 1 });
		});

		it('should write plain string content as-is regardless of extension', async () => {
			vi.mocked(fs.mkdir).mockResolvedValue(undefined);
			vi.mocked(fs.writeFile).mockResolvedValue(undefined);
			vi.mocked(fs.rename).mockResolvedValue(undefined);

			await fileService.write('notes.txt', 'hello world');

			expect(fs.writeFile).toHaveBeenCalledWith(expect.stringContaining('.tmp.'), 'hello world', 'utf-8');
		});

		it('should write plain string content verbatim even to a .json path, not JSON-stringified', async () => {
			vi.mocked(fs.mkdir).mockResolvedValue(undefined);
			vi.mocked(fs.writeFile).mockResolvedValue(undefined);
			vi.mocked(fs.rename).mockResolvedValue(undefined);

			await fileService.write('output.json', 'raw string value');

			expect(fs.writeFile).toHaveBeenCalledWith(
				expect.stringContaining('.tmp.'),
				'raw string value',
				'utf-8'
			);
		});

		it('should log and rethrow when the underlying write fails', async () => {
			vi.mocked(fs.mkdir).mockResolvedValue(undefined);
			const writeError = new Error('disk full');
			vi.mocked(fs.writeFile).mockRejectedValueOnce(writeError);
			vi.mocked(fs.unlink).mockResolvedValue(undefined);

			await expect(fileService.write('output.json', { a: 1 })).rejects.toThrow('disk full');
			expect(logger.error).toHaveBeenCalledWith(expect.stringContaining('FileService Write Error'));
		});
	});
	
	describe('update() [AST Modification Boundary]', () => {
		it('should delegate to write() when the target file does not exist', async () => {
			vi.mocked(fs.access).mockRejectedValueOnce(new Error('ENOENT'));
			vi.mocked(fs.mkdir).mockResolvedValue(undefined);
			vi.mocked(fs.writeFile).mockResolvedValue(undefined);
			vi.mocked(fs.rename).mockResolvedValue(undefined);

			await fileService.update('new-file.json', { a: 1 });

			expect(fs.readFile).not.toHaveBeenCalled();
			expect(fs.writeFile).toHaveBeenCalledWith(expect.stringContaining('.tmp.'), '{\n  "a": 1\n}', 'utf-8');
			expect(fs.rename).toHaveBeenCalledWith(expect.stringContaining('.tmp.'), 'new-file.json');
		});

		it('should throw a TypeError when JSON update content is not a non-null object', async () => {
			vi.mocked(fs.access).mockResolvedValue(undefined);

			await expect(fileService.update('config.json', 'not-an-object')).rejects.toThrow(TypeError);
			expect(logger.error).toHaveBeenCalledWith(expect.stringContaining('FileService Update Error'));
		});

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
		
		it('should surgically modify .jsonc files via the AST parser, preserving comments', async () => {
			vi.mocked(fs.access).mockResolvedValue(undefined);
			vi.mocked(fs.readFile).mockResolvedValueOnce('{\n  // keep me\n  "version": "1.0.0"\n}');

			await fileService.update('config.jsonc', { target: 'node' });

			expect(logger.warn).not.toHaveBeenCalled();
			expect(fs.writeFile).toHaveBeenCalledWith(
				expect.stringContaining('.tmp.'),
				expect.stringContaining('// keep me'),
				'utf-8'
			);
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

		it('should log the unsupported-extension fallback via the injected logger, not consola', async () => {
			vi.mocked(fs.access).mockResolvedValue(undefined);
			vi.mocked(fs.mkdir).mockResolvedValue(undefined);
			vi.mocked(fs.writeFile).mockResolvedValue(undefined);
			vi.mocked(fs.rename).mockResolvedValue(undefined);

			await fileService.update('config.yaml', { a: 1 });

			expect(logger.warn).toHaveBeenCalledWith(expect.stringContaining('Update logic not supported'));
		});

		it('should overwrite the whole file via write() for the unsupported-extension fallback', async () => {
			vi.mocked(fs.access).mockResolvedValue(undefined);
			vi.mocked(fs.mkdir).mockResolvedValue(undefined);
			vi.mocked(fs.writeFile).mockResolvedValue(undefined);
			vi.mocked(fs.rename).mockResolvedValue(undefined);

			await fileService.update('config.yaml', { a: 1 });

			expect(fs.writeFile).toHaveBeenCalledWith(expect.stringContaining('.tmp.'), '{\n  "a": 1\n}', 'utf-8');
			expect(fs.rename).toHaveBeenCalledWith(expect.stringContaining('.tmp.'), 'config.yaml');
		});

		it('should skip appending when the content is already present in the text file', async () => {
			vi.mocked(fs.access).mockResolvedValue(undefined);
			vi.mocked(fs.readFile).mockResolvedValueOnce('LINE 1\nLINE 2\n');

			await fileService.update('.env', 'LINE 2');

			expect(fs.writeFile).not.toHaveBeenCalled();
			expect(fs.rename).not.toHaveBeenCalled();
		});
	});
	
	describe('delete() & exists()', () => {
		it('should safely confirm existence', async () => {
			vi.mocked(fs.access).mockResolvedValueOnce(undefined);
			expect(await fileService.exists('file.txt')).toBe(true);
		});

		it('should safely report non-existence', async () => {
			vi.mocked(fs.access).mockRejectedValueOnce(new Error('ENOENT'));
			expect(await fileService.exists('missing.txt')).toBe(false);
		});
		
		it('should safely suppress ENOENT during delete', async () => {
			const noEntryError = Object.assign(new Error('ENOENT'), { code: 'ENOENT' });
			vi.mocked(fs.unlink).mockRejectedValueOnce(noEntryError);

			await expect(fileService.delete('missing.txt')).resolves.not.toThrow();
		});

		it('should rethrow a non-ENOENT error even when it has no code property', async () => {
			const weirdError = new Error('disk exploded');
			vi.mocked(fs.unlink).mockRejectedValueOnce(weirdError);

			await expect(fileService.delete('file.txt')).rejects.toThrow('disk exploded');
		});
	});
});