/**
 * ================================================================================
 *
 * @project:    app-manager
 * @file:       ~/tests/unit/commands/helpers/validateHeaders.test.ts
 * @version:    2.0.0
 * @createDate: 2025 Dec 19
 * @createTime: 01:06
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
 * V2.0.0, 20251219-19:11
 * Added support for multi-author headers.
 *
 * V1.0.0, 20251219-01:06
 * Initial creation and release of validateHeaders.test.ts
 *
 * ================================================================================
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { validateHeaders } from '../../../../app/commands/utils/validateHeaders';
import { setupTestContext } from '../../../helpers/testContext';
import fs from 'fs';
import path from 'path';

// Mock Dependencies
vi.mock('simple-git', () => ({
	simpleGit: () => ({
		raw: vi.fn().mockResolvedValue('New Contributor') // Simulate Git User
	})
}));

vi.mock('@clack/prompts', async (importOriginal) => ({
	...(await importOriginal<typeof import('@clack/prompts')>()),
	spinner: () => ({ start: vi.fn(), stop: vi.fn(), message: vi.fn() })
}));

describe('Command: validateHeaders', () => {
	let ctx: ReturnType<typeof setupTestContext>;
	
	beforeEach(() => {
		ctx = setupTestContext();
		vi.clearAllMocks();
	});
	
	afterEach(() => {
		ctx.restore();
	});
	
	it('should append current git user to existing authors list', async () => {
		const filePath = path.join(ctx.targetRoot, 'collab.ts');
		
		// File already has 'Original Author'
		const initialContent = `
/**
 * @project: Test
 * @file: ~/collab.ts
 * @author: Original Author
 */
        `.trim();
		fs.writeFileSync(filePath, initialContent);
		
		await validateHeaders(ctx.targetRoot);
		
		const updated = fs.readFileSync(filePath, 'utf-8');
		
		// Assert BOTH authors exist
		expect(updated).toContain('@author: Original Author');
		expect(updated).toContain('@author: New Contributor');
	});
	
	it('should not duplicate the author if already present', async () => {
		const filePath = path.join(ctx.targetRoot, 'solo.ts');
		// File already has 'New Contributor'
		const initialContent = `
/**
 * @author: New Contributor
 */
        `.trim();
		fs.writeFileSync(filePath, initialContent);
		
		await validateHeaders(ctx.targetRoot);
		
		const updated = fs.readFileSync(filePath, 'utf-8');
		// Count occurrences
		const matches = updated.match(/@author:\s+New Contributor/g);
		expect(matches?.length).toBe(1);
	});
	
	it('should set @project to root directory name for root files', async () => {
		const filePath = path.join(ctx.targetRoot, 'app.vue');
		// Setup with strict single space
		fs.writeFileSync(filePath, `/** @project: Wrong */`);
		
		await validateHeaders(ctx.targetRoot);
		
		const updated = fs.readFileSync(filePath, 'utf-8');
		const rootName = path.basename(ctx.targetRoot);
		
		// Expect single space preservation
		expect(updated).toContain(`@project: ${rootName}`);
	});
	
	it('should set @project to @monorepo/{layer} for layer files', async () => {
		const layerDir = path.join(ctx.targetRoot, 'layers', 'auth');
		fs.mkdirSync(layerDir, { recursive: true });
		const filePath = path.join(layerDir, 'user.ts');
		
		// Setup with strict single space
		fs.writeFileSync(filePath, `/** @project: Unknown */`);
		
		await validateHeaders(ctx.targetRoot);
		
		const updated = fs.readFileSync(filePath, 'utf-8');
		
		// Expect single space preservation
		expect(updated).toContain(`@project: @monorepo/auth`);
	});
});