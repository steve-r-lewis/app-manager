/**
 * ================================================================================
 *
 * @project:    app-manager
 * @file:       ~/tests/unit/commands/nuxt/createLayer.test.ts
 * @version:    1.0.0
 * @createDate: 2025 Dec 19
 * @createTime: 00:21
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
 * V1.0.0, 20251219-00:21
 * Initial creation and release of createLayer.test.ts
 *
 * ================================================================================
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { createLayer } from '../../../../app/commands/nuxt/createLayer';
import { setupTestContext } from '../../../utils/test-context';
import { llm } from '../../../../app/services/llm.service';
import fs from 'fs';
import path from 'path';
import * as prompts from '@clack/prompts';

// Mock External Services
vi.mock('../../../../app/services/llm.service', () => ({
	llm: { generate: vi.fn() }
}));

vi.mock('simple-git', () => ({
	simpleGit: () => ({
		raw: vi.fn().mockResolvedValue('Test User')
	})
}));

vi.mock('@clack/prompts', async (importOriginal) => ({
	...(await importOriginal<typeof import('@clack/prompts')>()),
	text: vi.fn(),
	confirm: vi.fn(),
	spinner: () => ({ start: vi.fn(), stop: vi.fn() })
}));

describe('Command: createLayer', () => {
	let ctx: ReturnType<typeof setupTestContext>;
	const mockText = prompts.text as unknown as ReturnType<typeof vi.fn>;
	const mockConfirm = prompts.confirm as unknown as ReturnType<typeof vi.fn>;
	
	beforeEach(() => {
		ctx = setupTestContext();
		vi.clearAllMocks();
		
		// Mock LLM Response
		(llm.generate as any).mockResolvedValue(JSON.stringify({
			readme: "Test Readme",
			jsdoc: "Test JSDoc",
			pkgJson: "Test Desc"
		}));
	});
	
	afterEach(() => {
		ctx.restore();
	});
	
	it('should scaffold a new layer structure', async () => {
		// User Inputs
		mockText
			.mockResolvedValueOnce('my-feature') // Name
			.mockResolvedValueOnce('Testing feature'); // Purpose
		
		await createLayer(ctx.targetRoot);
		
		const targetDir = path.join(ctx.targetRoot, 'layers', 'my-feature');
		
		// Check Files
		expect(fs.existsSync(path.join(targetDir, 'package.json'))).toBe(true);
		expect(fs.existsSync(path.join(targetDir, 'nuxt.config.ts'))).toBe(true);
		expect(fs.existsSync(path.join(targetDir, 'README.md'))).toBe(true);
		
		// Check Folders
		expect(fs.existsSync(path.join(targetDir, 'components/.gitkeep'))).toBe(true);
		expect(fs.existsSync(path.join(targetDir, 'server/api/.gitkeep'))).toBe(true);
		
		// Check Content (AI Injection)
		const pkg = JSON.parse(fs.readFileSync(path.join(targetDir, 'package.json'), 'utf-8'));
		expect(pkg.name).toBe('@monorepo/my-feature');
		expect(pkg.description).toBe('Test Desc');
	});
	
	it('should prompt before overwriting existing layer', async () => {
		// Create "existing" layer
		const targetDir = path.join(ctx.targetRoot, 'layers', 'existing');
		fs.mkdirSync(targetDir, { recursive: true });
		
		mockText.mockResolvedValueOnce('existing');
		mockConfirm.mockResolvedValue(false); // Do not overwrite
		
		await createLayer(ctx.targetRoot);
		
		// Should abort before prompting for purpose
		expect(mockText).toHaveBeenCalledTimes(1);
	});
	
	it('should handle LLM failure gracefully', async () => {
		(llm.generate as any).mockRejectedValue(new Error('AI Offline'));
		
		mockText
			.mockResolvedValueOnce('offline-layer')
			.mockResolvedValueOnce('Purpose');
		
		await createLayer(ctx.targetRoot);
		
		// Should still succeed with defaults
		const targetDir = path.join(ctx.targetRoot, 'layers', 'offline-layer');
		expect(fs.existsSync(path.join(targetDir, 'package.json'))).toBe(true);
		
		const readme = fs.readFileSync(path.join(targetDir, 'README.md'), 'utf-8');
		expect(readme).toContain('Purpose: Purpose'); // Fallback used
	});
});