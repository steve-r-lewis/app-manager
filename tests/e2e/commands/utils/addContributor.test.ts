/**
 * ================================================================================
 *
 * @project:    app-manager
 * @file:       ~/tests/e2e/commands/utils/addContributor.test.ts
 * @version:    1.0.0
 * @createDate: 2025 Dec 19
 * @createTime: 23:44
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
 * V1.0.0, 20251219-23:44
 * Initial creation and release of addContributor.test.ts
 *
 * ================================================================================
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import fs from 'fs';
import path from 'path';
import os from 'os';
import { addContributor } from '../../../../app/commands/utils/addContributor';

describe('E2E: Add Contributor', () => {
	let tempDir: string;
	
	beforeEach(() => {
		tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'am-e2e-contrib-'));
	});
	
	afterEach(() => {
		try { fs.rmSync(tempDir, { recursive: true, force: true }); } catch {}
	});
	
	it('should update package.json and file headers', async () => {
		// 1. Setup
		const pkgPath = path.join(tempDir, 'package.json');
		fs.writeFileSync(pkgPath, JSON.stringify({ contributors: [] }));
		
		const srcPath = path.join(tempDir, 'app.ts');
		fs.writeFileSync(srcPath, '/**\n * @author: Old Dev\n */\nconsole.log("hi");');
		
		// 2. Mock Inputs
		globalThis.mockText
			.mockResolvedValueOnce('New Dev')         // Name
			.mockResolvedValueOnce('new@dev.com');    // Email
		
		globalThis.mockConfirm.mockResolvedValue(true); // "Update source headers?" -> Yes
		
		// 3. Execute
		await addContributor(tempDir);
		
		// 4. Verify package.json
		const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf-8'));
		expect(pkg.contributors).toContainEqual({ name: 'New Dev', email: 'new@dev.com' });
		
		// 5. Verify Source File
		const srcContent = fs.readFileSync(srcPath, 'utf-8');
		expect(srcContent).toContain('* @author:     New Dev');
		expect(srcContent).toContain('* @author: Old Dev'); // Should preserve old
	});
});