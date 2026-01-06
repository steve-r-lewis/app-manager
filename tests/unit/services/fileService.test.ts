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

import { describe, it, expect, vi, afterEach } from 'vitest';
import { fileService } from '../../../app/services/fileService';
import fs from 'fs';
import path from 'path';
import { consola } from 'consola'; // Import consola to spy on it

// --------------------------------------------------------------------------------
// 1. Mocks & Stubs
// --------------------------------------------------------------------------------

// Mock the file system to prevent side effects on the actual disk
vi.mock('fs', () => ({
	default: {
		existsSync: vi.fn(),
		readFileSync: vi.fn(),
		writeFileSync: vi.fn(),
		mkdirSync: vi.fn(),
	}
}));

// Mock consola to keep the test output clean and suppress logs during tests
vi.mock('consola', () => ({
	consola: {
		error: vi.fn(),
		warn: vi.fn(),
		success: vi.fn(),
	}
}));

// --------------------------------------------------------------------------------
// 2. Test Suite
// --------------------------------------------------------------------------------

describe('FileService', () => {
	
	// Clean up mocks after every test to ensure isolation
	afterEach(() => {
		vi.clearAllMocks();
	});
	
	// ... [Previous read/write tests remain unchanged] ...
	
	describe('read()', () => {
		it('should return null if file does not exist', () => {
			// Simulate file missing
			vi.mocked(fs.existsSync).mockReturnValue(false);
			
			const result = fileService.read('missing.txt');
			
			expect(result).toBeNull();
			// Ensure we didn't try to read a non-existent file
			expect(fs.readFileSync).not.toHaveBeenCalled();
		});
		
		it('should auto-parse .json files', () => {
			const mockPath = '/app/package.json';
			const mockContent = JSON.stringify({ name: "test-app" });
			
			// Simulate file exists + return JSON string
			vi.mocked(fs.existsSync).mockReturnValue(true);
			vi.mocked(fs.readFileSync).mockReturnValue(mockContent);
			
			const result = fileService.read(mockPath);
			
			// Assert parsing happened automatically
			expect(result).toEqual({ name: "test-app" });
		});
		
		it('should return raw string for .txt/.env files', () => {
			const mockPath = '/app/.env';
			const mockContent = 'KEY=VALUE';
			
			vi.mocked(fs.existsSync).mockReturnValue(true);
			vi.mocked(fs.readFileSync).mockReturnValue(mockContent);
			
			const result = fileService.read(mockPath);
			
			// Assert no parsing happened
			expect(result).toBe('KEY=VALUE');
		});
		
		it('should fallback to Text Handler for unknown extensions', () => {
			const mockPath = '/app/unknown.xyz';
			const mockContent = 'raw data';
			
			vi.mocked(fs.existsSync).mockReturnValue(true);
			vi.mocked(fs.readFileSync).mockReturnValue(mockContent);
			
			const result = fileService.read(mockPath);
			expect(result).toBe('raw data');
		});
	});
	
	describe('write()', () => {
		it('should write objects as formatted JSON string for .json files', () => {
			const mockPath = '/app/config.json';
			const data = { valid: true };
			
			fileService.write(mockPath, data);
			
			// Expect JSON.stringify with 2 spaces indentation
			expect(fs.writeFileSync).toHaveBeenCalledWith(
				mockPath,
				JSON.stringify(data, null, 2)
			);
		});
		
		it('should write raw strings for text files', () => {
			const mockPath = '/app/notes.txt';
			fileService.write(mockPath, 'Hello World');
			
			expect(fs.writeFileSync).toHaveBeenCalledWith(mockPath, 'Hello World');
		});
		
		it('should create directories recursively if they do not exist', () => {
			const mockPath = '/app/deep/nested/file.txt';
			
			// Simulate directory check fails (folder doesn't exist yet)
			vi.mocked(fs.existsSync).mockReturnValue(false);
			
			fileService.write(mockPath, 'content');
			
			// Expect mkdirSync to be called for the parent directory
			expect(fs.mkdirSync).toHaveBeenCalledWith('/app/deep/nested', { recursive: true });
		});
	});
	
	describe('update()', () => {
		it('should merge JSON objects (Patch Strategy)', () => {
			const mockPath = '/app/data.json';
			const current = JSON.stringify({ a: 1, b: 2 });
			
			vi.mocked(fs.existsSync).mockReturnValue(true);
			vi.mocked(fs.readFileSync).mockReturnValue(current);
			
			// Update only 'b', add 'c'
			fileService.update(mockPath, { b: 99, c: 3 });
			
			// Expected: { a: 1 (kept), b: 99 (updated), c: 3 (added) }
			const expectedWrite = JSON.stringify({ a: 1, b: 99, c: 3 }, null, 2);
			expect(fs.writeFileSync).toHaveBeenCalledWith(mockPath, expectedWrite);
		});
		
		it('should append text if it does not exist (Append Strategy)', () => {
			const mockPath = '/app/.gitignore';
			const current = 'node_modules\n';
			
			vi.mocked(fs.existsSync).mockReturnValue(true);
			vi.mocked(fs.readFileSync).mockReturnValue(current);
			
			fileService.update(mockPath, '.env');
			
			// Expect newline + new content
			expect(fs.writeFileSync).toHaveBeenCalledWith(mockPath, 'node_modules\n.env\n');
		});
		
		it('should NOT append text if it already exists (Idempotency)', () => {
			const mockPath = '/app/.gitignore';
			const current = 'node_modules\n.env\n';
			
			vi.mocked(fs.existsSync).mockReturnValue(true);
			vi.mocked(fs.readFileSync).mockReturnValue(current);
			
			fileService.update(mockPath, '.env');
			
			// Should do nothing because .env is already there
			expect(fs.writeFileSync).not.toHaveBeenCalled();
		});
		
		it('should warn and fall back to overwrite for Code files (Unsupported Update)', () => {
			const mockPath = '/app/script.ts'; // .ts uses FileHandlerCode (no update method)
			const content = 'console.log("overwrite");';
			
			// Mock file existence
			vi.mocked(fs.existsSync).mockReturnValue(true);
			
			fileService.update(mockPath, content);
			
			// 1. Verify Warning was logged
			expect(consola.warn).toHaveBeenCalledWith(
				expect.stringContaining('Update not supported for script.ts')
			);
			
			// 2. Verify it fell back to Overwrite (Safety Net)
			expect(fs.writeFileSync).toHaveBeenCalledWith(mockPath, content);
		});
	});
});
