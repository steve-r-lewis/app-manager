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

// THE JANITOR: deletes old mock folders to keep your disk clean
function cleanupOldFixtures() {
	if (!fs.existsSync(BASE_FIXTURE_PATH)) return;
	
	const files = fs.readdirSync(BASE_FIXTURE_PATH);
	const now = Date.now();
	
	files.forEach(file => {
		const fullPath = path.join(BASE_FIXTURE_PATH, file);
		// Only touch folders starting with 'mock-'
		if (file.startsWith('mock-')) {
			try {
				const stats = fs.statSync(fullPath);
				// If folder is older than 5 minutes, delete it
				if (now - stats.mtimeMs > 5 * 60 * 1000) {
					fs.rmSync(fullPath, { recursive: true, force: true });
				}
			} catch (e) {
				// If locked, skip it. We'll get it next time.
			}
		}
	});
}

export function setupTestContext() {
	// 1. Run the Janitor
	cleanupOldFixtures();
	
	// 2. Snapshot Environment
	const envSnapshot = { ...process.env };
	
	// 3. Create Unique Sandbox
	const uniqueId = crypto.randomBytes(4).toString('hex');
	const mockTargetRoot = path.join(BASE_FIXTURE_PATH, `mock-${uniqueId}`);
	
	if (!fs.existsSync(mockTargetRoot)) {
		fs.mkdirSync(mockTargetRoot, { recursive: true });
	}
	
	// 4. Mock CWD
	const spy = vi.spyOn(process, 'cwd').mockReturnValue(mockTargetRoot);
	
	return {
		targetRoot: mockTargetRoot,
		toolRoot: REAL_TOOL_ROOT,
		restore: () => {
			// A. Restore CWD Mock
			spy.mockRestore();
			
			// B. Restore Environment Variables
			process.env = envSnapshot;
			
			// C. Try to delete the sandbox (Best Effort)
			try {
				if (fs.existsSync(mockTargetRoot)) {
					// Retry logic often helps Windows release locks
					setTimeout(() => {
						try {
							fs.rmSync(mockTargetRoot, { recursive: true, force: true });
						} catch(e) {}
					}, 100);
				}
			} catch (e) {
				// Ignore. The Janitor will get it in the next run.
			}
		}
	};
}