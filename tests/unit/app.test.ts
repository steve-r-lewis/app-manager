/**
 * ================================================================================
 *
 * @project:    app-manager
 * @file:       ~/tests/unit/app.test.ts
 * @version:    1.0.0
 * @createDate: 2025 Dec 20
 * @createTime: 16:40
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
 * V1.0.0, 20251220-16:40
 * Initial creation and release of app.test.ts
 *
 * ================================================================================
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { main } from '../../app/app';
import { setupTestContext } from '../utils/test-context';
import * as prompts from '@clack/prompts';

// 1. Hoist the logging mock so it is available before vi.mock runs
const { mockEnableLogging } = vi.hoisted(() => {
	return { mockEnableLogging: vi.fn() };
});

// 2. Mock All Command Dependencies
vi.mock('../../app/commands/app/runApp', () => ({ runApp: vi.fn() }));
vi.mock('../../app/commands/docs/runDocs', () => ({ runDocs: vi.fn() }));
vi.mock('../../app/commands/git/syncRepos', () => ({ syncRepos: vi.fn() }));
vi.mock('../../app/commands/git/manageCommits', () => ({ manageCommits: vi.fn() }));
vi.mock('../../app/commands/git/pushToRemote', () => ({ pushToRemote: vi.fn() }));
vi.mock('../../app/commands/git/initLayers', () => ({ initLayers: vi.fn() }));
vi.mock('../../app/commands/git/addSubmodules', () => ({ addSubmodules: vi.fn() }));
vi.mock('../../app/commands/git/deleteRemoteRepos', () => ({ deleteRemoteRepos: vi.fn() }));
vi.mock('../../app/commands/nuxt/createLayer', () => ({ createLayer: vi.fn() }));
vi.mock('../../app/commands/nuxt/extractDocs', () => ({ extractDocs: vi.fn() }));
vi.mock('../../app/commands/nuxt/manageEnv', () => ({ manageEnv: vi.fn() }));
vi.mock('../../app/commands/quality/runQuality', () => ({ runQuality: vi.fn() }));
vi.mock('../../app/commands/utils/autoVersion', () => ({ autoVersion: vi.fn() }));
vi.mock('../../app/commands/utils/validateHeaders', () => ({ validateHeaders: vi.fn() }));
vi.mock('../../app/commands/utils/autoDoc', () => ({ autoDoc: vi.fn() }));
vi.mock('../../app/commands/utils/addContributor', () => ({ addContributor: vi.fn() }));
vi.mock('../../app/commands/utils/cleanLogs', () => ({ cleanLogs: vi.fn() }));

// 3. Mock Services using the hoisted variable
vi.mock('../../app/services/logger.service', () => ({
	logger: {
		init: vi.fn(),
		enableSessionLogging: mockEnableLogging
	}
}));
vi.mock('../../app/services/config.service', () => ({
	configService: { init: vi.fn() }
}));

// 4. Mock Prompts
vi.mock('@clack/prompts', async (importOriginal) => ({
	...(await importOriginal<typeof import('@clack/prompts')>()),
	intro: vi.fn(),
	outro: vi.fn(),
	select: vi.fn(),
	multiselect: vi.fn(),
	isCancel: vi.fn(),
}));

// Import mocks for assertion
import { runApp } from '../../app/commands/app/runApp';
import { runDocs } from '../../app/commands/docs/runDocs';
import { runQuality } from '../../app/commands/quality/runQuality';
import { cleanLogs } from '../../app/commands/utils/cleanLogs';
import { manageEnv } from '../../app/commands/nuxt/manageEnv';
import { createLayer } from '../../app/commands/nuxt/createLayer';
import { extractDocs } from '../../app/commands/nuxt/extractDocs';
import { manageCommits } from '../../app/commands/git/manageCommits';
import { pushToRemote } from '../../app/commands/git/pushToRemote';
import { syncRepos } from '../../app/commands/git/syncRepos';
import { initLayers } from '../../app/commands/git/initLayers';
import { addSubmodules } from '../../app/commands/git/addSubmodules';
import { deleteRemoteRepos } from '../../app/commands/git/deleteRemoteRepos';
import { validateHeaders } from '../../app/commands/utils/validateHeaders';
import { autoVersion } from '../../app/commands/utils/autoVersion';
import { autoDoc } from '../../app/commands/utils/autoDoc';
import { addContributor } from '../../app/commands/utils/addContributor';

describe('Integration: Main App Menu (Full Coverage)', () => {
	let ctx: ReturnType<typeof setupTestContext>;
	const mockSelect = prompts.select as unknown as ReturnType<typeof vi.fn>;
	const mockMultiselect = prompts.multiselect as unknown as ReturnType<typeof vi.fn>;
	const mockIsCancel = prompts.isCancel as unknown as ReturnType<typeof vi.fn>;
	
	beforeEach(() => {
		ctx = setupTestContext();
		vi.clearAllMocks();
		mockIsCancel.mockReturnValue(false);
		// Default Config: No special flags
		mockMultiselect.mockResolvedValue([]);
	});
	
	afterEach(() => {
		ctx.restore();
		delete process.env.DEBUG;
		delete process.env.LOG_TO_FILE;
	});
	
	// --- 1. Session Configuration Tests ---
	
	it('should handle session cancellation', async () => {
		mockMultiselect.mockResolvedValue(Symbol('cancel'));
		mockIsCancel.mockReturnValue(true);
		
		await main(ctx.targetRoot, ctx.toolRoot);
		
		expect(prompts.outro).toHaveBeenCalledWith('Operation Cancelled');
		expect(mockSelect).not.toHaveBeenCalled();
	});
	
	it('should enable Debug Mode', async () => {
		mockMultiselect.mockResolvedValue(['debug']);
		mockSelect.mockResolvedValue('exit');
		
		await main(ctx.targetRoot, ctx.toolRoot);
		
		expect(process.env.DEBUG).toBe('true');
	});
	
	it('should enable File Logging', async () => {
		mockMultiselect.mockResolvedValue(['logging']);
		mockSelect.mockResolvedValue('exit');
		
		await main(ctx.targetRoot, ctx.toolRoot);
		
		expect(process.env.LOG_TO_FILE).toBe('true');
		expect(mockEnableLogging).toHaveBeenCalled();
	});
	
	// --- 2. Top-Level Domain Tests ---
	
	it('should run App Domain', async () => {
		mockSelect
			.mockResolvedValueOnce('app')
			.mockResolvedValueOnce('exit');
		
		await main(ctx.targetRoot, ctx.toolRoot);
		expect(runApp).toHaveBeenCalledWith(ctx.targetRoot);
	});
	
	it('should run Quality Domain', async () => {
		mockSelect
			.mockResolvedValueOnce('quality')
			.mockResolvedValueOnce('exit');
		
		await main(ctx.targetRoot, ctx.toolRoot);
		expect(runQuality).toHaveBeenCalledWith(ctx.targetRoot, ctx.toolRoot);
	});
	
	it('should run Docs Domain', async () => {
		mockSelect
			.mockResolvedValueOnce('docs')
			.mockResolvedValueOnce('exit');
		
		await main(ctx.targetRoot, ctx.toolRoot);
		expect(runDocs).toHaveBeenCalledWith(ctx.targetRoot, ctx.toolRoot);
	});
	
	it('should run Clean Domain', async () => {
		mockSelect
			.mockResolvedValueOnce('clean')
			.mockResolvedValueOnce('exit');
		
		await main(ctx.targetRoot, ctx.toolRoot);
		expect(cleanLogs).toHaveBeenCalledWith(ctx.targetRoot);
	});
	
	// --- 3. Nuxt Domain Sub-Commands ---
	
	it('should execute all Nuxt actions', async () => {
		mockSelect
			.mockResolvedValueOnce('nuxt').mockResolvedValueOnce('env')
			.mockResolvedValueOnce('nuxt').mockResolvedValueOnce('create')
			.mockResolvedValueOnce('nuxt').mockResolvedValueOnce('docs')
			.mockResolvedValueOnce('nuxt').mockResolvedValueOnce('back') // Test navigation
			.mockResolvedValueOnce('exit');
		
		await main(ctx.targetRoot, ctx.toolRoot);
		
		expect(manageEnv).toHaveBeenCalledWith(ctx.targetRoot);
		expect(createLayer).toHaveBeenCalledWith(ctx.targetRoot);
		expect(extractDocs).toHaveBeenCalledWith(ctx.targetRoot);
	});
	
	// --- 4. Git Domain Sub-Commands ---
	
	it('should execute all Git actions', async () => {
		mockSelect
			.mockResolvedValueOnce('git').mockResolvedValueOnce('commit')
			.mockResolvedValueOnce('git').mockResolvedValueOnce('push')
			.mockResolvedValueOnce('git').mockResolvedValueOnce('sync')
			.mockResolvedValueOnce('git').mockResolvedValueOnce('init')
			.mockResolvedValueOnce('git').mockResolvedValueOnce('submodules')
			.mockResolvedValueOnce('git').mockResolvedValueOnce('delete')
			.mockResolvedValueOnce('git').mockResolvedValueOnce('back') // Test navigation
			.mockResolvedValueOnce('exit');
		
		await main(ctx.targetRoot, ctx.toolRoot);
		
		expect(manageCommits).toHaveBeenCalledWith(ctx.targetRoot);
		expect(pushToRemote).toHaveBeenCalledWith(ctx.targetRoot);
		expect(syncRepos).toHaveBeenCalledWith(ctx.targetRoot);
		expect(initLayers).toHaveBeenCalledWith(ctx.targetRoot);
		expect(addSubmodules).toHaveBeenCalledWith(ctx.targetRoot);
		expect(deleteRemoteRepos).toHaveBeenCalled();
	});
	
	// --- 5. Utils Domain Sub-Commands ---
	
	it('should execute all Utils actions', async () => {
		mockSelect
			.mockResolvedValueOnce('utils').mockResolvedValueOnce('headers')
			.mockResolvedValueOnce('utils').mockResolvedValueOnce('version')
			.mockResolvedValueOnce('utils').mockResolvedValueOnce('doc')
			.mockResolvedValueOnce('utils').mockResolvedValueOnce('contributor+')
			.mockResolvedValueOnce('utils').mockResolvedValueOnce('back') // Test navigation
			.mockResolvedValueOnce('exit');
		
		await main(ctx.targetRoot, ctx.toolRoot);
		
		expect(validateHeaders).toHaveBeenCalledWith(ctx.targetRoot);
		expect(autoVersion).toHaveBeenCalledWith(ctx.targetRoot);
		expect(autoDoc).toHaveBeenCalledWith(ctx.targetRoot);
		expect(addContributor).toHaveBeenCalledWith(ctx.targetRoot);
	});
});