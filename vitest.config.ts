/**
 * ================================================================================
 *
 * @project:    app-manager
 * @file:       ~/vitest.config.ts
 * @version:    V1.0.0
 * @createDate: 2025 Dec 10
 * @createTime: 11:57
 * @author:     Steve R Lewis
 *
 * ================================================================================
 *
 * @description:
 * Configurations for Vitest unit testing.
 *
 * ================================================================================
 *
 * @notes: Revision History
 *
 * V1.0.0, 20251210-11:57
 * Initial creation and release of vitest.config.ts
 *
 * ================================================================================
 */

import { defineConfig } from 'vitest/config';

export default defineConfig({
	test: {
		// Ensure we scan the root tests AND the layer tests
		include: [
			'./tests/**/*.test.ts'
		],
		// Clean up mocks after each test
		restoreMocks: true,
	}
});