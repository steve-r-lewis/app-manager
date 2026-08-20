/**
 * ================================================================================
 *
 * @project:    app-manager
 * @file:       ~/app/templates/vitestConfigTemplate.ts
 * @version:    1.0.0
 * @createDate: 2026 Feb 26
 * @createTime: 00:04
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
 * V1.0.0, 20260226-00:04
 * Initial creation and release of vitestConfigTemplate.ts
 *
 * ================================================================================
 */

export function getVitestConfigTemplate(): string {
	return `import { defineConfig } from 'vitest/config';

const dateStr = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);

export default defineConfig({
	test: {
		setupFiles: ['./vitest.setup.ts'],
		pool: 'forks',
		fileParallelism: true,
		restoreMocks: true,
		include: ['tests/**/*.{test,spec}.ts'],
		environment: 'node',
		testTimeout: 30000,
		coverage: {
			provider: 'v8',
			reporter: ['text', 'json', 'html'],
			include: ['app/**/*.ts'],
			exclude: ['**/*.d.ts', 'tests/**']
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
			json: \`./app-monitor/test-logs/test-report-\${dateStr}.json\`
		}
	}
});
`;
}