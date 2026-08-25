/**
 * ================================================================================
 *
 * @project:    app-manager
 * @file:       ~/vitest.config.ts
 * @version:    1.1.0
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
 * V1.1.0, 20260820
 * Removed 'watchExclude', which is not a valid Vitest 4 InlineConfig option.
 * Replaced with 'exclude', which Vitest 4 uses to control which files/paths
 * it will not scan for tests (applies to both single-run and watch mode).
 *
 * V1.0.1, 20251226-1913
 * Refactored logic.
 *
 * V1.0.0, 20251210-11:57
 * Initial creation and release of vitest.config.ts
 *
 * ================================================================================
 */

import { defineConfig } from 'vitest/config';

const dateStr = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);

export default defineConfig({
	test: {
		setupFiles: ['./vitest.setup.ts'],

		// CRITICAL FIX: Use 'forks' for isolation.
		// This creates a fresh Node process for each file, killing memory leaks.
		pool: 'forks',

		// We can keep this true now because 'forks' makes parallel execution safe.
		fileParallelism: true,

		restoreMocks: true,

		// Global pattern to find all tests
		include: ['tests/**/*.{test,spec}.ts'],

		// Paths Vitest should not scan when discovering/watching test files
		exclude: [
			'**/node_modules/**',
			'**/dist/**',
			'**/.nuxt/**',
			'**/.output/**',
			'**/logs/test/**',
			'**/app_manager/logs/test/**',
			'**/tests/fixtures/**'
		],

		// Default environment is 'node' (perfect for CLI apps)
		environment: 'node',

		// Global timeout (fallback)
		testTimeout: 30000,

		// Coverage settings (optional, but good for Quality checks)
		coverage: {
			provider: 'v8',
			reporter: ['text', 'json', 'html'],
			include: ['app/**/*.ts'], // Only cover source code
			exclude: ['**/*.d.ts', 'tests/**'] // Don't cover tests themselves
		},

		reporters: ['default', 'json'],
		outputFile: {
			json: `./app_manager/logs/test/test-report-${dateStr}.json`
		}
	}
});
