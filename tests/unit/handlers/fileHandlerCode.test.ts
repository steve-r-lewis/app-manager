/**
 * ================================================================================
 *
 * @project:    app-manager
 * @file:       ~/tests/unit/handlers/fileHandlerCode.test.ts
 * @version:    1.0.0
 * @createDate: 2026 Jan 01
 * @createTime: 02:08
 * @author:     Steve R Lewis
 *
 * ================================================================================
 *
 * @description:
 * Unit Test Suite for the Code File Handler.
 *
 * This suite verifies the I/O logic for source code files (.ts, .js, .vue, etc.).
 *
 * Key Verifications:
 * 1. Read: Ensures raw source code is read correctly as a string.
 * 2. Write: Ensures source code is written to disk (overwrite strategy).
 * 3. Update (Absence): Confirms that this handler intentionally DOES NOT
 * implement an 'update' method. This is a critical architectural guardrail
 * ensuring that complex code refactoring is routed to the AST-based
 * CodeService, rather than being treated as simple text appending.
 *
 * ================================================================================
 *
 * @notes: Revision History
 *
 * V1.0.0, 20260101-02:08
 * Initial creation and release of fileHandlerCode.test.ts
 *
 * ================================================================================
 */

import { describe, it, expect, vi, afterEach } from 'vitest';
import { FileHandlerCode } from '../../../app/handlers/fileHandlerCode';
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

describe('FileHandlerCode', () => {
	const handler = new FileHandlerCode();
	
	afterEach(() => {
		vi.clearAllMocks();
	});
	
	describe('read()', () => {
		it('should return raw source code string if file exists', () => {
			const mockPath = '/src/app.ts';
			const mockContent = 'export const app = {};';
			
			vi.mocked(fs.existsSync).mockReturnValue(true);
			vi.mocked(fs.readFileSync).mockReturnValue(mockContent);
			
			const result = handler.read(mockPath);
			
			expect(result).toBe(mockContent);
		});
		
		it('should return null if file does not exist', () => {
			vi.mocked(fs.existsSync).mockReturnValue(false);
			
			const result = handler.read('/src/missing.ts');
			
			expect(result).toBeNull();
		});
	});
	
	describe('write()', () => {
		it('should overwrite file with provided source string', () => {
			const mockPath = '/src/components/Button.vue';
			const content = '<template><button/></template>';
			
			handler.write(mockPath, content);
			
			expect(fs.writeFileSync).toHaveBeenCalledWith(mockPath, content);
		});
	});
	
	describe('Architectural Integrity', () => {
		it('should NOT implement an update method', () => {
			// This test ensures we don't accidentally add "text appending" logic
			// to source code files in the future.
			expect((handler as any).update).toBeUndefined();
		});
	});
});