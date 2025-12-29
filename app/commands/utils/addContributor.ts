/**
 * ================================================================================
 *
 * @project:    app-manager
 * @file:       ~/app/commands/utils/addContributor.ts
 * @version:    1.0.1
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
 * V1.0.1, 20251226-1912
 * Refactored logic.
 *
 * V1.0.0, 20251219-19:28
 * Initial creation and release of addContributor.ts
 *
 * ================================================================================
 */

import { text, isCancel } from '@clack/prompts';
import fs from 'fs';
import path from 'path';
import { logger } from '../../services/loggerService';
// Import Type
import type { ContributorOptions } from '../../types/utils.types';

export async function addContributor(targetRoot: string, options: ContributorOptions = {}) {
	// 🔍 DEBUG LOG: Proof of Life
	console.log('[DEBUG] addContributor called with options:', JSON.stringify(options));
	
	const pkgPath = path.resolve(targetRoot, 'package.json');
	
	if (!fs.existsSync(pkgPath)) {
		logger.error('package.json not found');
		return;
	}
	
	// 1. Determine Name (Arg or Prompt)
	let name = options.name;
	if (!name) {
		console.log('[DEBUG] No name provided, entering prompt...'); // Trace prompt entry
		const nameInput = await text({
			message: 'Contributor Name:',
			placeholder: 'Steve R Lewis',
			validate: (val) => !val ? 'Name is required' : undefined
		});
		if (isCancel(nameInput)) return;
		name = nameInput as string;
	}
	
	// 2. Determine Email (Arg or Prompt)
	let email = options.email;
	if (!email) {
		const emailInput = await text({
			message: 'Contributor Email:',
			placeholder: 'steve@example.com',
			validate: (val) => !val ? 'Email is required' : undefined
		});
		if (isCancel(emailInput)) return;
		email = emailInput as string;
	}
	
	// 3. Determine URL (Arg or Prompt)
	let url = options.url;
	if (!url) {
		// Only prompt for URL if we are NOT in headless mode (heuristic: if name was provided via args, skip optional prompts)
		// Or strictly: Only use arg if present. If missing in args, prompt.
		// For headless automation, usually we skip optional prompts if primary args are present.
		// Let's keep it simple: If name/email came from args, assume headless and skip URL prompt if missing.
		if (options.name && options.email) {
			url = ''; // Skip prompt in headless mode
		} else {
			const urlInput = await text({
				message: 'Contributor URL (Optional):',
				placeholder: 'https://github.com/SteveRLewis',
				initialValue: ''
			});
			if (isCancel(urlInput)) return;
			url = urlInput as string;
		}
	}
	
	// 4. Update package.json
	try {
		const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf-8'));
		
		// Initialize contributors array if missing
		if (!pkg.contributors) pkg.contributors = [];
		
		// Check for duplicates
		const exists = pkg.contributors.find((c: any) => c.email === email);
		if (exists) {
			logger.warn(`Contributor ${email} already exists.`);
			return;
		}
		
		const newContributor: any = { name, email };
		if (url) newContributor.url = url;
		
		pkg.contributors.push(newContributor);
		
		fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2));
		logger.success(`Added ${name} to package.json contributors`);
		
	} catch (error) {
		logger.error('Failed to update package.json', error);
	}
}