/**
 * ================================================================================
 *
 * @project:    app-manager
 * @file:       ~/tests/commands/utils/addContributor.ts
 * @version:    1.0.0
 * @createDate: 2025 Dec 19
 * @createTime: 19:28
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
 * V1.0.0, 20251219-19:28
 * Initial creation and release of addContributor.ts
 *
 * ================================================================================
 */

/**
 * ================================================================================
 * @project:    app-manager
 * @file:       ~/app/commands/utils/addContributor.ts
 * ================================================================================
 */

import { text, confirm, isCancel, intro, outro } from '@clack/prompts';
import fs from 'fs';
import path from 'path';
import pc from 'picocolors';
import { consola } from 'consola';

// FIX: Add targetRoot parameter
export async function addContributor(targetRoot: string) {
	intro('Add Contributor');
	
	// 1. Get Details
	const name = await text({ message: 'Full Name:', placeholder: 'John Doe' });
	if (isCancel(name)) return;
	
	const email = await text({ message: 'Email:', placeholder: 'john@example.com' });
	if (isCancel(email)) return;
	
	// 2. Update package.json
	// FIX: Use targetRoot
	const pkgPath = path.join(targetRoot, 'package.json');
	if (fs.existsSync(pkgPath)) {
		const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf-8'));
		pkg.contributors = pkg.contributors || [];
		
		// Avoid duplicates
		const exists = pkg.contributors.find((c: any) => c.email === email);
		if (!exists) {
			pkg.contributors.push({ name, email });
			fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2));
			consola.success(pc.green(`Updated package.json`));
		}
	} else {
		consola.warn('No package.json found.');
	}
	
	// 3. Update Headers (Optional)
	const updateHeaders = await confirm({ message: 'Append @author to source file headers?' });
	
	if (updateHeaders && !isCancel(updateHeaders)) {
		// Simple scan of .ts files
		const scanDir = (dir: string) => {
			const files = fs.readdirSync(dir);
			for (const file of files) {
				const fullPath = path.join(dir, file);
				if (file === 'node_modules' || file.startsWith('.')) continue;
				
				if (fs.statSync(fullPath).isDirectory()) {
					scanDir(fullPath);
				} else if (file.endsWith('.ts') || file.endsWith('.vue')) {
					let content = fs.readFileSync(fullPath, 'utf-8');
					// Look for header block
					if (content.includes('/**') && !content.includes(`@author:     ${name}`)) {
						// Insert author after the last author or at end of block
						content = content.replace(/(\s\*\s@author:.*)/, `$1\n * @author:     ${name}`);
						fs.writeFileSync(fullPath, content);
					}
				}
			}
		};
		
		// FIX: Scan targetRoot
		scanDir(targetRoot);
		consola.success('Headers updated.');
	}
	
	outro('Contributor Added');
}