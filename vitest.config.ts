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

// Generate a timestamp for this specific run (e.g., test-report-2025-12-18-10-30-00.json)
const dateStr = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);

export default defineConfig({
	test: {
		
		setupFiles: ['./vitest.setup.ts'],
		testTimeout: 20000, // Increased timeout for E2E
		
		// 1. Force tests to run one by one (Fixes OOM & Race Conditions)
		fileParallelism: false,
		
		// STOP THE LOOP: Ignore these folders when watching for changes
		watchExclude: [
			'**/node_modules/**',
			'**/dist/**',
			'**/.nuxt/**',
			'**/.output/**',
			'**/tests/logs/**',      // <--- Critical
			'**/tests/fixtures/**'   // <--- Critical
		],
		
		// Ensure we scan the root tests AND the layer tests
		include: [
			'./tests/**/*.test.ts'
		],
		
		// Clean up mocks after each test
		restoreMocks: true,
		
		// Reporters:
		// 'default' = Standard console output (Green/Red text)
		// 'json'    = Structured JSON file output
		reporters: ['default', 'json'],
		
		// Output Configuration
		// We map the 'json' reporter to a dynamic file path
		outputFile: {
			json: `./tests/logs/test-report-${dateStr}.json`
		},
	}
});