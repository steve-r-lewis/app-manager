/**
 * ================================================================================
 *
 * @project:    app-manager
 * @file:       ~/tests/e2e/commands/app/setupApp.test.ts
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

import { describe, it, expect, vi, beforeEach, afterEach, beforeAll } from 'vitest';
import fs from 'fs';
import path from 'path';
import { setupApp } from '../../../../app/commands/app/setupApp';
import * as prompts from '@clack/prompts';
import { processService } from '../../../../app/services/processService';
import { syncRepos } from '../../../../app/commands/git/syncRepos';

// --- Mocks for E2E ---
// We mock the "heavy lifters" but keep FS real
vi.mock('@clack/prompts');
vi.mock('../../../../app/services/processService');
vi.mock('../../../../app/commands/git/syncRepos');

const TEST_ROOT = path.resolve(__dirname, '../../../fixtures/temp_setup_app');

describe('setupApp (E2E - File System)', () => {
	
	beforeAll(() => {
		// Clean slate
		if (fs.existsSync(TEST_ROOT)) {
			fs.rmSync(TEST_ROOT, { recursive: true, force: true });
		}
		fs.mkdirSync(TEST_ROOT, { recursive: true });
	});
	
	beforeEach(() => {
		vi.clearAllMocks();
		
		// Setup Prompts: Always say YES
		vi.mocked(prompts.confirm).mockResolvedValue(true);
		vi.mocked(prompts.spinner).mockReturnValue({
			start: vi.fn(),
			stop: vi.fn(),
			message: vi.fn()
		} as any);
	});
	
	afterEach(() => {
		// Cleanup after each test
		if (fs.existsSync(TEST_ROOT)) {
			fs.rmSync(TEST_ROOT, { recursive: true, force: true });
			fs.mkdirSync(TEST_ROOT);
		}
	});
	
	it('should replicate the Zero-to-Hero flow on real disk', async () => {
		// 1. Setup Fixtures
		// Create a dummy .env.example
		fs.writeFileSync(path.join(TEST_ROOT, '.env.example'), 'API_KEY=example');
		
		// Ensure .vscode does not exist yet
		const vscodeDir = path.join(TEST_ROOT, '.vscode');
		if (fs.existsSync(vscodeDir)) fs.rmSync(vscodeDir, { recursive: true });
		
		// 2. Execute Command
		await setupApp(TEST_ROOT);
		
		// 3. Verify Side Effects
		
		// A. Check .env creation
		const envPath = path.join(TEST_ROOT, '.env');
		expect(fs.existsSync(envPath)).toBe(true);
		const envContent = fs.readFileSync(envPath, 'utf-8');
		expect(envContent).toBe('API_KEY=example');
		
		// B. Check VS Code Settings creation
		const settingsPath = path.join(TEST_ROOT, '.vscode', 'settings.json');
		expect(fs.existsSync(settingsPath)).toBe(true);
		const settingsContent = JSON.parse(fs.readFileSync(settingsPath, 'utf-8'));
		expect(settingsContent['editor.formatOnSave']).toBe(true);
		
		// C. Verify Service Calls (Mocked execution)
		expect(processService.run).toHaveBeenCalled();
		expect(syncRepos).toHaveBeenCalledWith(TEST_ROOT);
	});
	
	it('should not overwrite existing configuration', async () => {
		// 1. Setup Fixtures
		// Create PRE-EXISTING .env and .vscode
		fs.writeFileSync(path.join(TEST_ROOT, '.env'), 'API_KEY=REAL_SECRET');
		fs.mkdirSync(path.join(TEST_ROOT, '.vscode'));
		fs.writeFileSync(path.join(TEST_ROOT, '.vscode', 'settings.json'), '{"custom": true}');
		
		// 2. Execute
		await setupApp(TEST_ROOT);
		
		// 3. Verify Preservation
		const envContent = fs.readFileSync(path.join(TEST_ROOT, '.env'), 'utf-8');
		expect(envContent).toBe('API_KEY=REAL_SECRET'); // Should NOT become 'example'
		
		const settingsContent = fs.readFileSync(path.join(TEST_ROOT, '.vscode', 'settings.json'), 'utf-8');
		expect(settingsContent).toBe('{"custom": true}'); // Should NOT be overwritten
	});
});