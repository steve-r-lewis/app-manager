/**
 * ================================================================================
 *
 * @project:    app-manager
 * @file:       ~/tests/unit/handlers/fileHandlerText.test.ts
 * @version:    1.0.0
 * @createDate: 2026 Jan 01
 * @createTime: 02:07
 * @author:     Steve R Lewis
 *
 * ================================================================================
 *
 * @description:
 * Unit Test Suite for the Text File Handler.
 *
 * This suite verifies the specific I/O logic for unstructured text files:
 * 1. Read/Write: Basic passthrough verification.
 * 2. Smart Append: The critical logic that ensures configuration lines (like in
 * .gitignore or .env) are only added if they don't already exist.
 * 3. Formatting: Ensures that appended lines are correctly separated by newlines.
 *
 * ================================================================================
 *
 * @notes: Revision History
 *
 * V1.0.0, 20260101-02:07
 * Initial creation and release of fileHandlerText.test.ts
 *
 * ================================================================================
 */

import { describe, it, expect, vi, afterEach } from 'vitest';
import { FileHandlerText } from '../../../app/handlers/fileHandlerText';
import fs from 'fs';

// --------------------------------------------------------------------------------
// 1. Mocks
// --------------------------------------------------------------------------------

vi.mock('fs', () => ({
	default: {
		existsSync: vi.fn(),
		readFileSync: vi.fn(),
		writeFileSync: vi.fn(),
	}
}));

vi.mock('consola', () => ({
	consola: {
		error: vi.fn(),
	}
}));

// --------------------------------------------------------------------------------
// 2. Test Suite
// --------------------------------------------------------------------------------

describe('FileHandlerText', () => {
	const handler = new FileHandlerText();
	
	afterEach(() => {
		vi.clearAllMocks();
	});
	
	describe('read()', () => {
		it('should return raw string content if file exists', () => {
			const mockPath = '/test/.env';
			const mockContent = 'FOO=BAR';
			
			vi.mocked(fs.existsSync).mockReturnValue(true);
			vi.mocked(fs.readFileSync).mockReturnValue(mockContent);
			
			const result = handler.read(mockPath);
			
			expect(result).toBe(mockContent);
		});
		
		it('should return null if file does not exist', () => {
			vi.mocked(fs.existsSync).mockReturnValue(false);
			
			const result = handler.read('/test/missing.txt');
			
			expect(result).toBeNull();
		});
	});
	
	describe('write()', () => {
		it('should overwrite file with provided string', () => {
			const mockPath = '/test/notes.txt';
			const content = 'New Content';
			
			handler.write(mockPath, content);
			
			expect(fs.writeFileSync).toHaveBeenCalledWith(mockPath, content);
		});
	});
	
	describe('update()', () => {
		it('should append content if it is missing', () => {
			const mockPath = '/test/.gitignore';
			// File exists but does NOT contain "dist"
			const currentContent = 'node_modules\n';
			
			vi.mocked(fs.existsSync).mockReturnValue(true);
			vi.mocked(fs.readFileSync).mockReturnValue(currentContent);
			
			handler.update(mockPath, 'dist');
			
			// Expect: Old Content + Newline + New Content + Newline
			expect(fs.writeFileSync).toHaveBeenCalledWith(
				mockPath,
				'node_modules\ndist\n'
			);
		});
		
		it('should handle missing newlines gracefully', () => {
			const mockPath = '/test/list.txt';
			// File exists but lacks trailing newline
			const currentContent = 'item1';
			
			vi.mocked(fs.existsSync).mockReturnValue(true);
			vi.mocked(fs.readFileSync).mockReturnValue(currentContent);
			
			handler.update(mockPath, 'item2');
			
			// Expect handler to insert the separator safely
			expect(fs.writeFileSync).toHaveBeenCalledWith(
				mockPath,
				'item1\nitem2\n'
			);
		});
		
		it('should NOT write if content already exists (Idempotency)', () => {
			const mockPath = '/test/.gitignore';
			const currentContent = 'node_modules\ndist\n';
			
			vi.mocked(fs.existsSync).mockReturnValue(true);
			vi.mocked(fs.readFileSync).mockReturnValue(currentContent);
			
			// Try to add 'dist' again
			handler.update(mockPath, 'dist');
			
			// Should do nothing
			expect(fs.writeFileSync).not.toHaveBeenCalled();
		});
		
		it('should create new file with content if file does not exist', () => {
			const mockPath = '/test/new.txt';
			
			vi.mocked(fs.existsSync).mockReturnValue(false);
			
			handler.update(mockPath, 'First Line');
			
			expect(fs.writeFileSync).toHaveBeenCalledWith(
				mockPath,
				'First Line\n' // Should act as empty string + content + newline
			);
		});
	});
});