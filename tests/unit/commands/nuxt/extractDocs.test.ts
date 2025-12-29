/**
 * ================================================================================
 *
 * @project:    app-manager
 * @file:       ~/tests/unit/commands/nuxt/extractDocs.test.ts
 * @version:    1.0.1
 * @createDate: 2025 Dec 19
 * @createTime: 00:26
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
 * V1.0.1, 20251226-1913
 * Refactored logic.
 *
 * V1.0.0, 20251219-00:26
 * Initial creation and release of extractDocs.test.ts
 *
 * ================================================================================
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { extractDocs } from '../../../../app/commands/nuxt/extractDocs';
import { setupTestContext } from '../../../helpers/testContext';
import { llm } from '../../../../app/services/llmService';
import fs from 'fs';
import path from 'path';
import * as prompts from '@clack/prompts';

// Mock Dependencies
vi.mock('../../../../app/services/llmService', () => ({
	llm: { generate: vi.fn() }
}));

vi.mock('@clack/prompts', async (importOriginal) => ({
	...(await importOriginal<typeof import('@clack/prompts')>()),
	multiselect: vi.fn(),
	spinner: () => ({ start: vi.fn(), stop: vi.fn(), message: vi.fn() })
}));

describe('Command: extractDocs', () => {
	let ctx: ReturnType<typeof setupTestContext>;
	const mockMulti = prompts.multiselect as unknown as ReturnType<typeof vi.fn>;
	
	beforeEach(() => {
		ctx = setupTestContext();
		vi.clearAllMocks();
		
		// Mock LLM to return a predictable summary
		(llm.generate as any).mockResolvedValue('Calculates user taxes.');
	});
	
	afterEach(() => {
		ctx.restore();
	});
	
	it('should generate a report for selected files', async () => {
		// 1. Setup Filesystem
		const layerPath = path.join(ctx.targetRoot, 'layers', 'billing');
		fs.mkdirSync(layerPath, { recursive: true });
		
		// package.json
		fs.writeFileSync(path.join(layerPath, 'package.json'), JSON.stringify({ description: "Billing Layer" }));
		// README.md
		fs.writeFileSync(path.join(layerPath, 'README.md'), "# Billing Docs\nInfo.");
		// Code file
		fs.writeFileSync(path.join(layerPath, 'helpers.ts'), "export const tax = () => 10;");
		
		// 2. Mock User Input
		mockMulti.mockResolvedValue(['package.json', 'README.md', '.ts']);
		
		// 3. Execute
		await extractDocs(ctx.targetRoot);
		
		// 4. Verify Output
		const reportsDir = path.join(ctx.targetRoot, 'docs', 'reports');
		expect(fs.existsSync(reportsDir)).toBe(true);
		
		const files = fs.readdirSync(reportsDir);
		expect(files.length).toBe(1);
		
		const content = fs.readFileSync(path.join(reportsDir, files[0]), 'utf-8');
		
		// Check TOC
		expect(content).toContain('- [@monorepo/billing](#billing)');
		
		// Check JSON extraction
		expect(content).toContain('> Billing Layer');
		
		// Check Markdown extraction
		expect(content).toContain('# Billing Docs');
		
		// Check AI Summary
		expect(content).toContain('**AI Summary:** Calculates user taxes.');
	});
	
	it('should recursively find files', async () => {
		const layerPath = path.join(ctx.targetRoot, 'layers', 'ui');
		fs.mkdirSync(path.join(layerPath, 'components'), { recursive: true });
		
		// Nested file
		fs.writeFileSync(path.join(layerPath, 'components', 'Button.vue'), '<template></template>');
		
		mockMulti.mockResolvedValue(['.vue']);
		
		await extractDocs(ctx.targetRoot);
		
		const reportsDir = path.join(ctx.targetRoot, 'docs', 'reports');
		const files = fs.readdirSync(reportsDir);
		const content = fs.readFileSync(path.join(reportsDir, files[0]), 'utf-8');
		
		// FIX: Use path.join to ensure OS-specific separators match (e.g. \ on Windows)
		expect(content).toContain(path.join('components', 'Button.vue'));
	});
	
	it('should handle AI failures gracefully', async () => {
		const layerPath = path.join(ctx.targetRoot, 'layers', 'api');
		fs.mkdirSync(layerPath, { recursive: true });
		fs.writeFileSync(path.join(layerPath, 'server.ts'), 'console.log("hi")');
		
		mockMulti.mockResolvedValue(['.ts']);
		
		// AI Fails
		(llm.generate as any).mockRejectedValue(new Error('Rate Limit'));
		
		await extractDocs(ctx.targetRoot);
		
		const reportsDir = path.join(ctx.targetRoot, 'docs', 'reports');
		const files = fs.readdirSync(reportsDir);
		const content = fs.readFileSync(path.join(reportsDir, files[0]), 'utf-8');
		
		expect(content).toContain('(AI Summarization failed');
	});
	
	it('should abort if no layers directory exists', async () => {
		// No layers created
		mockMulti.mockResolvedValue(['package.json']);
		
		await extractDocs(ctx.targetRoot);
		
		// Should not create report
		const reportsDir = path.join(ctx.targetRoot, 'docs', 'reports');
		expect(fs.existsSync(reportsDir)).toBe(false);
	});
});