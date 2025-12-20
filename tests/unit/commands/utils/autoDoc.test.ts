/**
 * ================================================================================
 *
 * @project:    app-manager
 * @file:       ~/tests/unit/commands/utils/autoDoc.test.ts
 * @version:    1.0.0
 * @createDate: 2025 Dec 19
 * @createTime: 01:19
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
 * V1.0.0, 20251219-01:19
 * Initial creation and release of autoDoc.test.ts
 *
 * ================================================================================
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { autoDoc } from '../../../../app/commands/utils/autoDoc';
import { setupTestContext } from '../../../utils/test-context';
import { llm } from '../../../../app/services/llm.service';
import fs from 'fs';
import path from 'path';
import * as prompts from '@clack/prompts';

// Mock Dependencies
vi.mock('../../../../app/services/llm.service', () => ({
	llm: { generate: vi.fn() }
}));

vi.mock('@clack/prompts', async (importOriginal) => ({
	...(await importOriginal<typeof import('@clack/prompts')>()),
	confirm: vi.fn(),
	spinner: () => ({ start: vi.fn(), stop: vi.fn(), message: vi.fn() })
}));

describe('Command: autoDoc', () => {
	let ctx: ReturnType<typeof setupTestContext>;
	const mockConfirm = prompts.confirm as unknown as ReturnType<typeof vi.fn>;
	
	beforeEach(() => {
		ctx = setupTestContext();
		vi.clearAllMocks();
		mockConfirm.mockResolvedValue(true);
		// Default AI response
		(llm.generate as any).mockResolvedValue('/** Docs */');
	});
	
	afterEach(() => {
		ctx.restore();
	});
	
	it('should find undocumented functions and add JSDoc', async () => {
		const filePath = path.join(ctx.targetRoot, 'utils.ts');
		const content = `
import fs from 'fs';

export function add(a: number, b: number) {
    return a + b;
}
        `.trim();
		fs.writeFileSync(filePath, content);
		
		await autoDoc(ctx.targetRoot);
		
		const updated = fs.readFileSync(filePath, 'utf-8');
		// Expect JSDoc inserted before export function
		expect(updated).toContain('/** Docs */\nexport function add');
		// Ensure content is preserved
		expect(updated).toContain('return a + b;');
	});
	
	it('should ignore already documented functions', async () => {
		const filePath = path.join(ctx.targetRoot, 'safe.ts');
		const content = `
/**
 * Existing Docs
 */
export function sub(a, b) { return a - b; }
        `.trim();
		fs.writeFileSync(filePath, content);
		
		await autoDoc(ctx.targetRoot);
		
		// Should not call AI
		expect(llm.generate).not.toHaveBeenCalled();
		
		const updated = fs.readFileSync(filePath, 'utf-8');
		// Should not duplicate docs (count of '/**' should remain 1)
		const matches = updated.match(/\/\*\*/g);
		expect(matches?.length).toBe(1);
	});
	
	it('should process multiple exports in one file correctly (Bottom-Up)', async () => {
		const filePath = path.join(ctx.targetRoot, 'multi.ts');
		// Two undocumented functions
		const content = `
export const first = 1;

export const second = 2;
        `.trim();
		fs.writeFileSync(filePath, content);
		
		// FIX: The code processes files Bottom-Up.
		// So it encounters 'second' first, then 'first'.
		(llm.generate as any)
			.mockResolvedValueOnce('/** Second */')
			.mockResolvedValueOnce('/** First */');
		
		await autoDoc(ctx.targetRoot);
		
		const updated = fs.readFileSync(filePath, 'utf-8');
		
		expect(updated).toContain('/** First */\nexport const first');
		expect(updated).toContain('/** Second */\nexport const second');
	});
	
	it('should handle AI failures gracefully', async () => {
		const filePath = path.join(ctx.targetRoot, 'broken.ts');
		fs.writeFileSync(filePath, 'export class MyClass {}');
		
		(llm.generate as any).mockRejectedValue(new Error('AI Error'));
		
		await autoDoc(ctx.targetRoot);
		
		// File should not be modified if AI fails
		const updated = fs.readFileSync(filePath, 'utf-8');
		expect(updated).toBe('export class MyClass {}');
	});
});