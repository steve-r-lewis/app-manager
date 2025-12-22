/**
 * ================================================================================
 *
 * @project:    app-manager
 * @file:       ~/tests/commands/utils/autoVersion.test.ts
 * @version:    1.0.0
 * @createDate: 2025 Dec 19
 * @createTime: 01:12
 * @author:     Steve R Lewis
 *
 * ================================================================================
 *
 * @description:
 * TODO: Create description here
 *
 * ================================================================================
 *
 * @notes: Revision History
 *
 * V1.0.0, 20251219-01:12
 * Initial creation and release of autoVersion.test.ts
 *
 * ================================================================================
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { autoVersion } from '../../../../app/commands/utils/autoVersion';
import { setupTestContext } from '../../../helpers/testContext';
import { llm } from '../../../../app/services/llmService';
import fs from 'fs';
import path from 'path';
import * as prompts from '@clack/prompts';

// Mock Dependencies
const mockGit = {
	diff: vi.fn(),
};

vi.mock('simple-git', () => ({
	simpleGit: () => mockGit
}));

vi.mock('../../../../app/services/llmService', () => ({
	llm: { generate: vi.fn() }
}));

vi.mock('@clack/prompts', async (importOriginal) => ({
	...(await importOriginal<typeof import('@clack/prompts')>()),
	confirm: vi.fn(),
	spinner: () => ({ start: vi.fn(), stop: vi.fn() })
}));

describe('Command: autoVersion', () => {
	let ctx: ReturnType<typeof setupTestContext>;
	const mockConfirm = prompts.confirm as unknown as ReturnType<typeof vi.fn>;
	
	beforeEach(() => {
		ctx = setupTestContext();
		vi.clearAllMocks();
		mockConfirm.mockResolvedValue(true); // Always say yes
	});
	
	afterEach(() => {
		ctx.restore();
	});
	
	it('should increment version and add history based on AI analysis', async () => {
		// 1. Setup File
		const filePath = path.join(ctx.targetRoot, 'logic.ts');
		const content = `
/**
 * @version:    1.0.0
 * @notes: Revision History
 * V1.0.0 Init
 */
export const a = 1;
        `.trim();
		fs.writeFileSync(filePath, content);
		
		// 2. Mock Git Diff
		// First call: List files
		mockGit.diff.mockResolvedValueOnce('logic.ts');
		// Second call: File content diff
		mockGit.diff.mockResolvedValueOnce('diff content');
		
		// 3. Mock AI
		(llm.generate as any).mockResolvedValue(JSON.stringify({
			increment: 'Minor',
			note: 'Added feature X'
		}));
		
		// 4. Run
		await autoVersion(ctx.targetRoot);
		
		// 5. Verify
		const updated = fs.readFileSync(filePath, 'utf-8');
		
		// Check Version Bump (1.0.0 -> 1.1.0)
		expect(updated).toContain('@version:    1.1.0');
		
		// Check History Insertion
		expect(updated).toContain('* V1.1.0,');
		expect(updated).toContain('* Added feature X');
	});
	
	it('should skip files without headers', async () => {
		const filePath = path.join(ctx.targetRoot, 'plain.ts');
		fs.writeFileSync(filePath, 'console.log("no headers");');
		
		mockGit.diff.mockResolvedValueOnce('plain.ts');
		
		await autoVersion(ctx.targetRoot);
		
		// File should remain untouched
		expect(fs.readFileSync(filePath, 'utf-8')).toBe('console.log("no headers");');
		// Should not call AI
		expect(llm.generate).not.toHaveBeenCalled();
	});
	
	it('should handle AI failure gracefully (default to Patch)', async () => {
		const filePath = path.join(ctx.targetRoot, 'bug.ts');
		const content = `
/**
 * @version:    1.0.0
 * @notes: Revision History
 */
        `.trim();
		fs.writeFileSync(filePath, content);
		
		mockGit.diff.mockResolvedValueOnce('bug.ts');
		mockGit.diff.mockResolvedValueOnce('fix bug');
		
		(llm.generate as any).mockRejectedValue(new Error('AI Down'));
		
		await autoVersion(ctx.targetRoot);
		
		const updated = fs.readFileSync(filePath, 'utf-8');
		// Default Patch increment: 1.0.0 -> 1.0.1
		expect(updated).toContain('@version:    1.0.1');
	});
});