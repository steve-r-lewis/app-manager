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
		
		watchExclude: [
			'**/node_modules/**',
			'**/dist/**',
			'**/.nuxt/**',
			'**/.output/**',
			'**/tests/logs/**',
			'**/app-monitor/test-logs/**',
			'**/tests/fixtures/**'
		],
		
		reporters: ['default', 'json'],
		outputFile: {
			json: `./app-monitor/test-logs/test-report-${dateStr}.json`
		}
	}
});