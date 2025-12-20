/**
 * ================================================================================
 *
 * @project:    app-manager
 * @file:       ~/tests/e2e/commands/git/real-git.test.ts
 * @version:    1.0.0
 * @createDate: 2025 Dec 19
 * @createTime: 21:41
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
 * V1.0.0, 20251219-21:41
 * Initial creation and release of real-git.test.ts
 *
 * ================================================================================
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import fs from 'fs';
import path from 'path';
import os from 'os';
import { initLayers } from '../../../../app/commands/git/initLayers';

// No more vi.mock imports needed here!

describe('E2E: Git Initialization', () => {
	let tempDir: string;
	
	beforeEach(() => {
		tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'app-manager-e2e-'));
	});
	
	afterEach(() => {
		fs.rmSync(tempDir, { recursive: true, force: true });
	});
	
	it('should initialize a git repo in a layer', async () => {
		// 1. Setup Real Files
		const layerName = 'payment-service';
		const layerPath = path.join(tempDir, 'layers', layerName);
		fs.mkdirSync(layerPath, { recursive: true });
		
		// 2. Control User Input (using global mocks)
		globalThis.mockMultiselect.mockResolvedValue([layerName]); // Select 'payment-service'
		globalThis.mockConfirm.mockResolvedValue(true);            // Confirm 'Yes'
		
		// 3. Run Command
		await initLayers(tempDir);
		
		// 4. Verify Disk
		expect(fs.existsSync(path.join(layerPath, '.git'))).toBe(true);
	});
});