/**
 * ================================================================================
 *
 * @project:    app-manager
 * @file:       ~/tests/helpers/testContext.ts
 * @version:    1.0.0
 * @createDate: 2025 Dec 18
 * @createTime: 17:59
 * @author:     Steve R Lewis
 *
 * ================================================================================
 *
 * @description:
 * Provides a sandboxed environment for E2E tests. It creates temporary
 * directories and mocks the current working directory (cwd) to ensure
 * tests do not affect the actual file system or other tests.
 *
 * ================================================================================
 *
 * @notes: Revision History
 *
 * V1.0.0, 20251218-17:59
 * Initial creation and release of testContext.ts
 *
 * ================================================================================
 */

import path from 'path';
import fs from 'fs';
import crypto from 'crypto';
import { vi } from 'vitest';

// Define paths relative to this helper file
export const BASE_FIXTURE_PATH = path.resolve(__dirname, '../fixtures');
// Tool root is 3 levels up from tests/helpers (tests -> helpers -> file)
export const REAL_TOOL_ROOT = path.resolve(__dirname, '../../');

export interface TestContext {
	targetRoot: string;
	toolRoot: string;
	restore: () => void;
}

/**
 * Cleans up old mock directories (older than 5 minutes) to prevent disk clutter
 * from aborted tests.
 */
function cleanupOldFixtures() {
	if (!fs.existsSync(BASE_FIXTURE_PATH)) return;
	
	const files = fs.readdirSync(BASE_FIXTURE_PATH);
	const now = Date.now();
	
	files.forEach(file => {
		if (file.startsWith('mock-')) {
			const fullPath = path.join(BASE_FIXTURE_PATH, file);
			try {
				if (now - fs.statSync(fullPath).mtimeMs > 5 * 60 * 1000) {
					fs.rmSync(fullPath, { recursive: true, force: true });
				}
			} catch (e) {
				// Ignore cleanup errors
			}
		}
	});
}

export function setupTestContext(): TestContext {
	cleanupOldFixtures();
	
	const uniqueId = crypto.randomBytes(4).toString('hex');
	const mockTargetRoot = path.join(BASE_FIXTURE_PATH, `mock-${uniqueId}`);
	
	if (!fs.existsSync(mockTargetRoot)) {
		fs.mkdirSync(mockTargetRoot, { recursive: true });
	}
	
	// Spy on process.cwd to return our sandbox
	const spy = vi.spyOn(process, 'cwd').mockReturnValue(mockTargetRoot);
	
	return {
		targetRoot: mockTargetRoot,
		toolRoot: REAL_TOOL_ROOT,
		restore: () => {
			spy.mockRestore();
			// Optional: Clean up immediate test artifacts if desired
			// fs.rmSync(mockTargetRoot, { recursive: true, force: true });
		}
	};
}