/**
 * ================================================================================
 *
 * @project:    app-manager
 * @file:       ~/tests/utils/test-context.ts
 * @version:    1.0.0
 * @createDate: 2025 Dec 18
 * @createTime: 17:59
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
 * V1.0.0, 20251218-17:59
 * Initial creation and release of test-context.ts
 *
 * ================================================================================
 */

import path from 'path';
import fs from 'fs';
import { vi } from 'vitest';
import crypto from 'crypto';

const BASE_FIXTURE_PATH = path.resolve(__dirname, '../fixtures');
export const REAL_TOOL_ROOT = path.resolve(__dirname, '../../');

// Export the interface for use in test files
export interface TestContext {
	targetRoot: string;
	toolRoot: string;
	restore: () => void;
}

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
			} catch (e) {}
		}
	});
}

export function setupTestContext(): TestContext {
	cleanupOldFixtures();
	const envSnapshot = { ...process.env };
	
	const uniqueId = crypto.randomBytes(4).toString('hex');
	const mockTargetRoot = path.join(BASE_FIXTURE_PATH, `mock-${uniqueId}`);
	
	if (!fs.existsSync(mockTargetRoot)) fs.mkdirSync(mockTargetRoot, { recursive: true });
	
	const spy = vi.spyOn(process, 'cwd').mockReturnValue(mockTargetRoot);
	
	return {
		targetRoot: mockTargetRoot,
		toolRoot: REAL_TOOL_ROOT,
		restore: () => {
			spy.mockRestore();
			process.env = envSnapshot;
			try {
				if (fs.existsSync(mockTargetRoot)) {
					// Small delay to allow file handles to release
					setTimeout(() => {
						try { fs.rmSync(mockTargetRoot, { recursive: true, force: true }); } catch (e) {}
					}, 100);
				}
			} catch (e) {}
		}
	};
}