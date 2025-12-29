/**
 * ================================================================================
 *
 * @project:    app-manager
 * @file:       ~/tests/unit/commands/app/setupApp.test.ts
 * @version:    1.0.0
 * @createDate: 2025 Dec 28
 * @createTime: 23:00
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
 * V1.0.0, 20251228-23:00
 * Initial creation and release of setupApp.test.ts
 *
 * ================================================================================
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import fs from 'fs';
import path from 'path';
import { setupApp } from '../../../../app/commands/app/setupApp';
import * as prompts from '@clack/prompts';
import { processService } from '../../../../app/services/processService';
import { syncRepos } from '../../../../app/commands/git/syncRepos';
import { consola } from 'consola';

// --- Mocks ---
vi.mock('fs');
vi.mock('consola');
vi.mock('@clack/prompts');
vi.mock('../../../../app/services/processService');
vi.mock('../../../../app/commands/git/syncRepos');

describe('setupApp (Unit)', () => {
	const mockRoot = '/mock/root';
	const mockEnvPath = path.join(mockRoot, '.env');
	const mockExamplePath = path.join(mockRoot, '.env.example');
	let confirmSpy: any;
	
	beforeEach(() => {
		vi.clearAllMocks();
		
		// Default Prompts
		vi.mocked(prompts.spinner).mockReturnValue({
			start: vi.fn(),
			stop: vi.fn(),
			message: vi.fn()
		} as any);
		
		confirmSpy = vi.mocked(prompts.confirm);
	});
	
	afterEach(() => {
		vi.resetAllMocks();
	});
	
	it('should copy .env.example to .env if user confirms', async () => {
		// Setup: .env missing, example exists
		vi.mocked(fs.existsSync).mockImplementation((p) => {
			if (p === mockEnvPath) return false;
			if (p === mockExamplePath) return true;
			return false;
		});
		
		confirmSpy.mockResolvedValue(true); // User says YES
		
		await setupApp(mockRoot);
		
		expect(fs.copyFileSync).toHaveBeenCalledWith(mockExamplePath, mockEnvPath);
		expect(consola.success).toHaveBeenCalledWith(expect.stringContaining('Created .env'));
	});
	
	it('should skip .env creation if .env already exists', async () => {
		vi.mocked(fs.existsSync).mockReturnValue(true); // .env exists
		
		await setupApp(mockRoot);
		
		expect(fs.copyFileSync).not.toHaveBeenCalled();
		expect(consola.info).toHaveBeenCalledWith(expect.stringContaining('already exists'));
	});
	
	it('should run install and syncRepos if user confirms', async () => {
		// Skip env check for brevity
		vi.mocked(fs.existsSync).mockReturnValue(true);
		confirmSpy.mockResolvedValue(true); // Accept Install & Sync
		
		vi.mocked(processService.detectPackageManager).mockReturnValue('pnpm');
		
		await setupApp(mockRoot);
		
		// Install called?
		expect(processService.run).toHaveBeenCalledWith('pnpm', ['install'], mockRoot, expect.any(Object));
		// Sync called?
		expect(syncRepos).toHaveBeenCalledWith(mockRoot);
	});
	
	it('should generate vscode settings if missing', async () => {
		vi.mocked(fs.existsSync).mockReturnValue(true); // Skip env
		confirmSpy.mockResolvedValue(true);
		
		// Simulate missing vscode settings
		const vscodePath = path.join(mockRoot, '.vscode/settings.json');
		vi.mocked(fs.existsSync).mockImplementation((p) => p !== vscodePath);
		
		await setupApp(mockRoot);
		
		expect(fs.writeFileSync).toHaveBeenCalledWith(
			vscodePath,
			expect.stringContaining('editor.formatOnSave')
		);
	});
});