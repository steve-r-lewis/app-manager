/**
 * ================================================================================
 *
 * @project:    app-manager
 * @file:       ~/tests/unit/handlers/fileHandlerJson.test.ts
 * @version:    1.0.0
 * @createDate: 2026 Jan 01
 * @createTime: 02:06
 * @author:     Steve R Lewis
 *
 * ================================================================================
 *
 * @description:
 * Unit Test Suite for the JSON File Handler.
 *
 * This suite verifies the specific "Mechanism" logic for JSON files:
 * 1. Safe Parsing: Ensures invalid JSON doesn't crash the app, but returns null.
 * 2. Formatting: Verifies that writes use standard indentation (2 spaces).
 * 3. Shallow Merging: Confirms that updates merge keys rather than replacing the
 * entire file object.
 *
 * ================================================================================
 *
 * @notes: Revision History
 *
 * V1.0.0, 20260101-02:06
 * Initial creation and release of fileHandlerJson.test.ts
 *
 * ================================================================================
 */

import { describe, it, expect, vi, afterEach } from 'vitest';
import { FileHandlerJson } from '../../../app/handlers/fileHandlerJson';
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

// Mock consola to suppress error logs during "Invalid JSON" tests
vi.mock('consola', () => ({
	consola: {
		error: vi.fn(),
	}
}));

// --------------------------------------------------------------------------------
// 2. Test Suite
// --------------------------------------------------------------------------------

describe('FileHandlerJson', () => {
	const handler = new FileHandlerJson();
	
	afterEach(() => {
		vi.clearAllMocks();
	});
	
	describe('read()', () => {
		it('should parse valid JSON and return an object', () => {
			const mockPath = '/test/valid.json';
			const mockContent = '{"key": "value"}';
			
			vi.mocked(fs.existsSync).mockReturnValue(true);
			vi.mocked(fs.readFileSync).mockReturnValue(mockContent);
			
			const result = handler.read(mockPath);
			
			expect(result).toEqual({ key: 'value' });
		});
		
		it('should return null if file does not exist', () => {
			vi.mocked(fs.existsSync).mockReturnValue(false);
			
			const result = handler.read('/test/missing.json');
			
			expect(result).toBeNull();
		});
		
		it('should return null and log error if JSON is malformed', () => {
			const mockPath = '/test/bad.json';
			const mockContent = '{ bad json }'; // Syntax error
			
			vi.mocked(fs.existsSync).mockReturnValue(true);
			vi.mocked(fs.readFileSync).mockReturnValue(mockContent);
			
			const result = handler.read(mockPath);
			
			// Should fail gracefully, not throw
			expect(result).toBeNull();
		});
	});
	
	describe('write()', () => {
		it('should serialize objects with 2-space indentation', () => {
			const mockPath = '/test/output.json';
			const data = { a: 1, b: 2 };
			
			handler.write(mockPath, data);
			
			// Expected string structure
			const expectedOutput = JSON.stringify(data, null, 2);
			
			expect(fs.writeFileSync).toHaveBeenCalledWith(mockPath, expectedOutput);
		});
	});
	
	describe('update()', () => {
		it('should perform a shallow merge on existing data', () => {
			const mockPath = '/test/config.json';
			// Existing state
			const currentContent = JSON.stringify({ theme: 'dark', version: 1 });
			
			vi.mocked(fs.existsSync).mockReturnValue(true);
			vi.mocked(fs.readFileSync).mockReturnValue(currentContent);
			
			// Action: Update 'version', add 'debug'
			handler.update(mockPath, { version: 2, debug: true });
			
			// Expect: theme (preserved), version (updated), debug (added)
			const expectedObject = { theme: 'dark', version: 2, debug: true };
			const expectedString = JSON.stringify(expectedObject, null, 2);
			
			expect(fs.writeFileSync).toHaveBeenCalledWith(mockPath, expectedString);
		});
		
		it('should create new file with updates if original is missing', () => {
			const mockPath = '/test/new.json';
			
			// Simulate file missing
			vi.mocked(fs.existsSync).mockReturnValue(false);
			
			handler.update(mockPath, { created: true });
			
			// Expect write with just the new data
			const expectedString = JSON.stringify({ created: true }, null, 2);
			expect(fs.writeFileSync).toHaveBeenCalledWith(mockPath, expectedString);
		});
	});
});