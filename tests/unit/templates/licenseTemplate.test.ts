/**
 * ================================================================================
 *
 * @project:    app-manager
 * @file:       ~/tests/unit/templates/licenseTemplate.test.ts
 * @version:    1.0.1
 * @createDate: 2026 Jan 01
 * @createTime: 22:47
 * @author:     Steve R Lewis
 *
 * ================================================================================
 *
 * @description:
 * Unit Test Suite for the LICENSE Template Generator.
 *
 * This suite verifies the generation of legal text files. It ensures that:
 * 1. The Permissive (MIT) license matches the user's uploaded standard.
 * 2. The Restrictive (GPLv3) license contains the correct Copyleft clauses.
 * 3. Copyright headers are formatted correctly (Year + Holder + Email).
 *
 * ================================================================================
 *
 * @notes: Revision History
 *
 * v1.0.1, 20260101-23:15
 * - Updated GPLv3 assertion strings to match the actual legal text.
 *
 * V1.0.0, 20260101-22:47
 * Initial creation and release of licenseTemplate.test.ts
 *
 * ================================================================================
 */

import { describe, it, expect } from 'vitest';
// @ts-ignore - Module does not exist yet
import { licenseTemplate } from '../../../app/templates/licenseTemplate';
import type { LicenseContext } from '../../../app/types/index';

describe('licenseTemplate', () => {
	
	const baseContext = {
		projectName: 'test-project',
		author: 'Steve R. Lewis',
		email: 'me@steve-lewis.uk',
		year: '2025'
	};
	
	describe('Scenario: MIT License (Permissive)', () => {
		
		const mitContext: LicenseContext = {
			...baseContext,
			target: 'root',
			licenseType: 'MIT'
		};
		
		const result = licenseTemplate(mitContext);
		
		it('should format the Copyright Header correctly', () => {
			expect(result).toContain('Copyright 2025 Steve R. Lewis, me@steve-lewis.uk');
		});
		
		it('should contain the standard MIT permissions', () => {
			expect(result).toContain('Permission is hereby granted, free of charge');
			expect(result).toContain('to deal in the Software without restriction');
		});
		
		it('should contain the standard MIT disclaimer', () => {
			expect(result).toContain('THE SOFTWARE IS PROVIDED “AS IS”, WITHOUT WARRANTY OF ANY KIND');
		});
	});
	
	describe('Scenario: GPLv3 License (Strong Copyleft)', () => {
		
		const gplContext: LicenseContext = {
			...baseContext,
			target: 'layer',
			licenseType: 'GPLv3'
		};
		
		const result = licenseTemplate(gplContext);
		
		it('should contain the GPL Preamble', () => {
			expect(result).toContain('GNU GENERAL PUBLIC LICENSE');
			expect(result).toContain('Version 3, 29 June 2007');
		});
		
		it('should contain the Copyleft clause', () => {
			expect(result).toContain('freedom to share and change the works');
			expect(result).toContain('convey a work based on the Program');
		});
		
		it('should format the Copyright Header', () => {
			// FIX: Construct the email string dynamically to prevent
			// the IDE/Interpreter from confusing '<...>' with XML/Generics tags.
			const emailPart = '<' + 'me@steve-lewis.uk' + '>';
			
			expect(result).toContain('Copyright (C) 2025 Steve R. Lewis ' + emailPart);
		});
	});
});