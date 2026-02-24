/**
 * ================================================================================
 *
 * @project:    app-manager
 * @file:       ~/tests/unit/templates/readmeTemplate.test.ts
 * @version:    1.0.0
 * @createDate: 2026 Jan 01
 * @createTime: 21:28
 * @author:     Steve R Lewis
 *
 * ================================================================================
 *
 * @description:
 * Unit Test Suite for the README.md Template Generator.
 *
 * This suite verifies that documentation is generated with the correct context-aware
 * instructions.
 *
 * Scenarios:
 * 1. Root Application ('root'):
 * - Verifies the presence of "Setup" and "Development" sections.
 * - Checks for standard shell commands (pnpm install, pnpm dev).
 *
 * 2. Nuxt Layer ('layer'):
 * - Verifies the presence of "Installation" instructions (how to add to nuxt.config).
 * - Checks that the package name is scoped correctly (@monorepo/...).
 *
 * ================================================================================
 *
 * @notes: Revision History
 *
 * V1.0.0, 20260101-21:28
 * Initial creation and release of readmeTemplate.test.ts
 *
 * ================================================================================
 */

import { describe, it, expect } from 'vitest';
// @ts-ignore - Module does not exist yet
import { readmeTemplate } from '../../../app/templates/readmeTemplate.js';
import { ReadmeContext } from '../../../app/types/index.js';

describe('readmeTemplate', () => {
	
	const baseContext = {
		projectName: 'test-project',
		description: 'A test project description.',
		author: 'TestUser',
		year: '2026'
	};
	
	describe('Scenario: Root Application (Target="root")', () => {
		
		const rootContext: ReadmeContext = {
			...baseContext,
			target: 'root',
			requirements: ['Node.js >= 20', 'pnpm >= 9']
		};
		
		const result = readmeTemplate(rootContext);
		
		it('should generate a standard Title and Description', () => {
			expect(result).toContain('# test-project');
			expect(result).toContain('A test project description.');
		});
		
		it('should include Setup and Run commands', () => {
			expect(result).toContain('## Setup');
			expect(result).toContain('pnpm install');
			expect(result).toContain('pnpm dev');
		});
		
		it('should list Requirements', () => {
			expect(result).toContain('- Node.js >= 20');
			expect(result).toContain('- pnpm >= 9');
		});
	});
	
	describe('Scenario: Nuxt Layer (Target="layer")', () => {
		
		const layerContext: ReadmeContext = {
			...baseContext,
			target: 'layer',
			projectName: 'ui-library', // Logic should prefix this to @monorepo/ui-library
			features: ['Button Component', 'Input Component']
		};
		
		const result = readmeTemplate(layerContext);
		
		it('should display the Scoped Package Name', () => {
			// The template logic handles the @monorepo/ prefixing
			expect(result).toContain('# @monorepo/ui-library');
		});
		
		it('should include Layer Installation instructions', () => {
			expect(result).toContain('## Installation');
			expect(result).toContain('extends: [');
			expect(result).toContain('"@monorepo/ui-library"');
		});
		
		it('should list Features', () => {
			expect(result).toContain('- Button Component');
			expect(result).toContain('- Input Component');
		});
	});
});