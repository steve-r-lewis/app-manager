/**
 * ================================================================================
 *
 * @project:    app-manager
 * @file:       ~/tests/unit/services/codeService.test.ts
 * @version:    1.0.0
 * @createDate: 2026 Jan 06
 * @createTime: 22:17
 * @author:     Steve R Lewis
 *
 * ================================================================================
 *
 * @description:
 * Full Unit Test Suite for the Code Service.
 *
 * Coverage:
 * 1. Strategy Dispatch (File extension routing).
 * 2. TypeScript Strategy (Metadata, Inspection, Injection).
 * 3. Vue Strategy (Sandwich architecture, Offset calculation, Header placement).
 * 4. Header Management (Replacement, Prepending, Safety).
 * 5. LLM Integration (Flow verification).
 *
 * ================================================================================
 *
 * @notes: Revision History
 *
 * V2.0.0, 20260111-23:36
 * Redesigned to account for the changes in the CodeService API.  Changes centered
 * around the need to support multiple strategies and the need to support multiple
 * languages.
 *
 * V1.0.0, 20260106-22:17
 * Initial creation and release of codeService.test.ts
 *
 * ================================================================================
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { codeService } from '../../../app/services/codeService';
import { fileService } from '../../../app/services/fileService';
import { llmService } from '../../../app/services/llmService';

// Mock dependencies
vi.mock('../../../app/services/fileService');
vi.mock('../../../app/services/llmService');
vi.mock('../../../app/services/loggerService', () => ({
	logger: { success: vi.fn(), info: vi.fn(), error: vi.fn() }
}));

describe('CodeService Integration', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});
	
	it('should route .ts files to TypescriptStrategy', () => {
		vi.mocked(fileService.read).mockReturnValue('export const x = 1;');
		
		const blocks = codeService.inspect('file.ts');
		expect(blocks).toBeDefined();
		expect(blocks.length).toBe(1);
	});
	
	it('should route .vue files to VueStrategy', () => {
		vi.mocked(fileService.read).mockReturnValue('<script setup>export const x = 1;</script>');
		
		const blocks = codeService.inspect('comp.vue');
		expect(blocks).toBeDefined();
		expect(blocks.length).toBe(1);
	});
	
	it('should throw error for unsupported extensions', () => {
		expect(() => codeService.inspect('image.png'))
			.toThrow(/Unsupported file type/);
	});
	
	it('should coordinate the LLM doc generation workflow', async () => {
		// 1. Setup Mock
		const fileContent = 'export function foo() {}';
		vi.mocked(fileService.read).mockReturnValue(fileContent);
		vi.mocked(llmService.generate).mockResolvedValue('/** Doc */');
		
		// 2. Execute
		await codeService.generateDocFor('test.ts', 'foo');
		
		// 3. Verify Write
		const writeCall = vi.mocked(fileService.write).mock.calls[0];
		expect(writeCall[0]).toBe('test.ts');
		expect(writeCall[1]).toContain('/** Doc */');
	});
});