/**
 * ================================================================================
 *
 * @project:    app-manager
 * @file:       ~/tests/e2e/commands/git/addSubmodules.test.ts
 * @version:    1.0.0
 * @createDate: 2025 Dec 28
 * @createTime: 23:30
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
 * V1.0.0, 20251228-23:30
 * Initial creation and release of addSubmodules.test.ts
 *
 * ================================================================================
 */

import { describe, it, expect, vi, beforeEach, afterEach, beforeAll } from 'vitest';
import fs from 'fs';
import path from 'path';
import { addSubmodules } from '../../../../app/commands/git/addSubmodules';
import { simpleGit } from 'simple-git';
import * as prompts from '@clack/prompts';
import { configService } from '../../../../app/services/configService';
import { consola } from 'consola';

// --- Mocks ---
vi.mock('simple-git');
vi.mock('@clack/prompts');
vi.mock('consola');

const TEST_ROOT = path.resolve(__dirname, '../../../fixtures/temp_add_submodules');

describe('addSubmodules (E2E - Mocked Git)', () => {
	let gitMock: any;
	
	beforeAll(() => {
		if (fs.existsSync(TEST_ROOT)) {
			fs.rmSync(TEST_ROOT, { recursive: true, force: true });
		}
		fs.mkdirSync(TEST_ROOT, { recursive: true });
	});
	
	beforeEach(() => {
		vi.clearAllMocks();
		
		// 1. Mock Git
		gitMock = {
			submoduleAdd: vi.fn().mockResolvedValue(''),
			status: vi.fn().mockResolvedValue({ isClean: () => true })
		};
		vi.mocked(simpleGit).mockReturnValue(gitMock);
		
		// 2. Mock Prompts
		vi.mocked(prompts.spinner).mockReturnValue({
			start: vi.fn(),
			stop: vi.fn(),
			message: vi.fn()
		} as any);
		
		// 3. Inject Fake Config directly into configService
		// We can't mock the service module entirely because we need its logic,
		// but we can overwrite the property if it's accessible or mock the getter.
		// Since configService is a singleton instance, we can spy on the getter if defined,
		// or simpler: mock the loadConfig method if your architecture calls for it.
		// FOR THIS TEST: We will assume configService.loadConfig is called or we mock the registry property.
		
		// Actually, let's just mock the 'records' accessor if possible, or Mock the entire configService for this test file.
		// Since we didn't mock configService at the top, let's use a Spy or Object.defineProperty if it's a getter.
		// However, a safer bet for E2E is to write a fake repositoryRegistry.json to disk.
		
		const fakeRegistry = {
			records: [
				{ repositoryName: "billing", githubToken: "abc", githubOrg: "monorepo" },
				{ repositoryName: "auth", githubToken: "123", githubOrg: "monorepo" }
			]
		};
		
		// Create a config directory in our test root and write the file
		const configDir = path.join(TEST_ROOT, 'config');
		if (!fs.existsSync(configDir)) fs.mkdirSync(configDir);
		fs.writeFileSync(path.join(configDir, 'repositoryRegistry.json'), JSON.stringify(fakeRegistry));
		
		// IMPORTANT: We need to tell configService to look at OUR test root, or we mock the data directly.
		// Since changing the config path dynamically might be hard without DI, let's spy on the property.
		vi.spyOn(configService, 'repoConfig', 'get').mockReturnValue(fakeRegistry as any);
	});
	
	afterEach(() => {
		if (fs.existsSync(TEST_ROOT)) {
			fs.rmSync(TEST_ROOT, { recursive: true, force: true });
			fs.mkdirSync(TEST_ROOT);
		}
	});
	
	it('should add selected submodules', async () => {
		// 1. User selects "billing"
		// The command maps options to config records.
		vi.mocked(prompts.multiselect).mockResolvedValue([
			{ repositoryName: "billing", githubToken: "abc", githubOrg: "monorepo" }
		] as any);
		
		// 2. Execute
		await addSubmodules(TEST_ROOT);
		
		// 3. Verify Git Call
		// Expect: git submodule add <url> <path>
		// The logic typically constructs URL: https://<token>@github.com/<org>/<name>.git
		const expectedUrl = 'https://abc@github.com/monorepo/billing.git';
		const expectedPath = 'layers/billing';
		
		expect(gitMock.submoduleAdd).toHaveBeenCalledWith(expectedUrl, expectedPath);
		expect(consola.success).toHaveBeenCalledWith(expect.stringContaining('billing'));
	});
	
	it('should handle user cancellation', async () => {
		// User cancels the selection
		vi.mocked(prompts.multiselect).mockReturnValue(Promise.resolve(Symbol('clack:cancel')) as any);
		vi.mocked(prompts.isCancel).mockReturnValue(true);
		
		await addSubmodules(TEST_ROOT);
		
		expect(gitMock.submoduleAdd).not.toHaveBeenCalled();
		expect(prompts.outro).toHaveBeenCalledWith(expect.stringContaining('cancelled'));
	});
	
	it('should skip if no submodules selected', async () => {
		// User selects nothing
		vi.mocked(prompts.multiselect).mockResolvedValue([]);
		
		await addSubmodules(TEST_ROOT);
		
		expect(gitMock.submoduleAdd).not.toHaveBeenCalled();
	});
});