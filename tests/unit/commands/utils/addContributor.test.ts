/**
 * ================================================================================
 *
 * @project:    app-manager
 * @file:       ~/tests/unit/commands/utils/addContributor.test.ts
 * @version:    1.0.0
 * @createDate: 2025 Dec 19
 * @createTime: 19:30
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
 * V1.0.0, 20251219-19:30
 * Initial creation and release of addContributor.test.ts
 *
 * ================================================================================
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { addContributor } from '../../../../app/commands/utils/addContributor';
import { setupTestContext } from '../../../utils/test-context';
import fs from 'fs';
import path from 'path';

// Mock Consola
vi.mock('consola', () => ({
	consola: {
		info: vi.fn(),
		warn: vi.fn(),
		error: vi.fn(),
		success: vi.fn()
	}
}));

describe('Command: addContributor', () => {
	let ctx: ReturnType<typeof setupTestContext>;
	
	beforeEach(() => {
		ctx = setupTestContext();
		vi.clearAllMocks();
	});
	
	afterEach(() => {
		ctx.restore();
	});
	
	it('should add contributor to package.json', async () => {
		fs.writeFileSync(path.join(ctx.targetRoot, 'package.json'), JSON.stringify({ contributors: [] }));
		
		globalThis.mockText
			.mockResolvedValueOnce('Steve')
			.mockResolvedValueOnce('steve@example.com');
		
		globalThis.mockConfirm.mockResolvedValue(false);
		
		await addContributor(ctx.targetRoot);
		
		const pkg = JSON.parse(fs.readFileSync(path.join(ctx.targetRoot, 'package.json'), 'utf-8'));
		expect(pkg.contributors).toHaveLength(1);
		expect(pkg.contributors[0]).toEqual({ name: 'Steve', email: 'steve@example.com' });
	});
	
	it('should add attribution to selected files', async () => {
		fs.writeFileSync(path.join(ctx.targetRoot, 'package.json'), JSON.stringify({}));
		
		const srcFile = path.join(ctx.targetRoot, 'app.ts');
		const initialContent = `/**\n * @author: Steve\n */\nconsole.log('hello');`;
		fs.writeFileSync(srcFile, initialContent);
		
		globalThis.mockText
			.mockResolvedValueOnce('Gemini')
			.mockResolvedValueOnce('ai@google.com');
		
		globalThis.mockConfirm.mockResolvedValue(true);
		
		await addContributor(ctx.targetRoot);
		
		const content = fs.readFileSync(srcFile, 'utf-8');
		expect(content).toContain('@author: Steve');
		// Flexible Regex match for variable spaces
		expect(content).toMatch(/@author:\s+Gemini/);
	});
});