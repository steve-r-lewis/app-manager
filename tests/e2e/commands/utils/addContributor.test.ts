/**
 * ================================================================================
 *
 * @project:    app-manager
 * @file:       ~/tests/e2e/commands/utils/addContributor.test.ts
 * @version:    1.0.2
 * @createDate: 2025 Dec 19
 * @createTime: 23:44
 * @author:     Steve R Lewis
 *
 * ================================================================================
 *
 * @description:
 * E2E Test for 'addContributor' command.
 * Verifies package.json modification via CLI.
 *
 * ================================================================================
 *
 * @notes: Revision History
 * V1.0.2, 20251226-1913
 * Refactored logic.
 *
 * V1.0.1, 20251222-23:45
 * Fixed typo in error message assertion.
 *
 * V1.0.0, 20251219-23:44
 * Initial creation and release of addContributor.test.ts
 *
 * ================================================================================
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { addContributor } from '../../../../app/commands/utils/addContributor';
import { setupTestContext } from '../../../helpers/testContext';
import * as prompts from '@clack/prompts';
import fs from 'fs';
import path from 'path';

// Mock Prompts
vi.mock('@clack/prompts', async (importOriginal) => {
	const actual = await importOriginal();
	return {
		...(actual as any),
		intro: vi.fn(),
		outro: vi.fn(),
		text: vi.fn(),
		isCancel: vi.fn(() => false),
	};
});

describe('Integration: Add Contributor', () => {
	let ctx: ReturnType<typeof setupTestContext>;
	
	beforeEach(() => {
		ctx = setupTestContext();
		vi.clearAllMocks();
		fs.writeFileSync(path.join(ctx.targetRoot, 'package.json'), JSON.stringify({ contributors: [] }));
	});
	
	afterEach(() => {
		ctx.restore();
	});
	
	it('should add a contributor via arguments (Headless)', async () => {
		await addContributor(ctx.targetRoot, {
			name: 'John Doe',
			email: 'john@example.com'
		});
		
		const pkg = JSON.parse(fs.readFileSync(path.join(ctx.targetRoot, 'package.json'), 'utf-8'));
		expect(pkg.contributors).toHaveLength(1);
		// Adjusted expectation: checks for subset match
		expect(pkg.contributors[0]).toMatchObject({
			name: 'John Doe',
			email: 'john@example.com'
		});
	});
	
	it('should prompt for missing details if arguments are missing', async () => {
		// Mock Interactive Input
		(prompts.text as any)
			.mockResolvedValueOnce('Jane Doe')   // Name
			.mockResolvedValueOnce('jane@doe.com') // Email
			.mockResolvedValueOnce('');          // URL (Optional)
		
		// Call without args
		await addContributor(ctx.targetRoot, {});
		
		const pkg = JSON.parse(fs.readFileSync(path.join(ctx.targetRoot, 'package.json'), 'utf-8'));
		expect(pkg.contributors).toHaveLength(1);
		expect(pkg.contributors[0].name).toBe('Jane Doe');
		
		expect(prompts.text).toHaveBeenCalledTimes(3);
	});
});