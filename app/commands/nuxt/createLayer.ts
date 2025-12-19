/**
 * ================================================================================
 *
 * @project:    app-manager
 * @file:       ~/app/commands/nuxt/createLayer.ts
 * @version:    1.0.0
 * @createDate: 2025 Dec 17
 * @createTime: 01:27
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
 * V1.0.0, 20251217-01:27
 * Initial creation and release of createLayer.ts
 *
 * ================================================================================
 */

/**
 * ================================================================================
 * @project:    app-manager
 * @file:       app/commands/nuxt/createLayer.ts
 * ================================================================================
 */

import { text, spinner, isCancel, confirm, select } from '@clack/prompts';
import path from 'path';
import fs from 'fs';
import { llm } from '../../services/llm.service';
import { consola } from 'consola';
import pc from 'picocolors';
import { simpleGit } from 'simple-git';

// Helper to sanitize JSON from LLM response (removes Markdown backticks)
function sanitizeJson(str: string): string {
	return str.replace(/```json/g, '').replace(/```/g, '').trim();
}

// Helper to get Git Author
async function getGitAuthor(root: string): Promise<string> {
	try {
		const git = simpleGit(root);
		const name = await git.raw(['config', 'user.name']);
		return name.trim() || 'Nuxt Monorepo User';
	} catch {
		return 'Nuxt Monorepo User';
	}
}

export async function createLayer(targetRoot: string) {
	const layersDir = path.join(targetRoot, 'layers');
	
	// 1. Inputs
	const layerName = await text({
		message: 'Enter Layer Name (e.g. "billing")',
		placeholder: 'billing',
		validate(value) {
			if (!value) return 'Layer name is required';
			if (/[^a-z0-9-]/.test(value)) return 'Use only lowercase letters, numbers, and hyphens.';
		},
	});
	
	if (isCancel(layerName)) return;
	
	const targetDir = path.join(layersDir, layerName as string);
	
	if (fs.existsSync(targetDir)) {
		const overwrite = await confirm({
			message: `Layer "${layerName}" already exists. Overwrite?`
		});
		if (isCancel(overwrite) || !overwrite) return;
	}
	
	const purpose = await text({
		message: 'Describe the purpose (for AI context)',
		placeholder: `Utility layer for ${layerName}`,
		initialValue: `Utility layer for ${layerName}`
	});
	
	if (isCancel(purpose)) return;
	
	// 2. AI Generation
	const s = spinner();
	s.start('Consulting AI for layer metadata...');
	
	const prompt = `
    You are a code scaffolding assistant.
    Context: Generating a Nuxt 4 layer named '@monorepo/${layerName}'.
    User Purpose: "${purpose}".
    
    Task: Return a raw JSON object (NO markdown formatting) with these keys:
    1. "readme": A professional 2-paragraph description.
    2. "jsdoc": A concise description (max 40 words) for the config file header.
    3. "pkgJson": A short summary (max 15 words) for package.json.
    
    Output JSON only.
    `;
	
	let metadata = {
		readme: `The @monorepo/${layerName} layer.\nPurpose: ${purpose}`,
		jsdoc: `Configuration for ${layerName}.`,
		pkgJson: `Layer for ${purpose}`
	};
	
	try {
		// Using new llm.generate() API
		const response = await llm.generate(prompt);
		const cleanJson = sanitizeJson(response);
		metadata = JSON.parse(cleanJson);
	} catch (error) {
		consola.warn("AI Generation failed/parsed poorly. Using defaults.");
	}
	
	s.stop('Metadata ready.');
	
	// 3. Scaffolding
	const author = await getGitAuthor(targetRoot);
	const dateStr = new Date().toISOString().split('T')[0];
	const fullPackageName = `@monorepo/${layerName}`;
	
	// Structure Definition
	const files = {
		'package.json': JSON.stringify({
			name: fullPackageName,
			version: "0.0.0",
			description: metadata.pkgJson,
			private: true,
			type: "module",
			main: "./nuxt.config.ts",
			scripts: { "dev": "nuxi dev", "build": "nuxi build" },
			dependencies: {},
			devDependencies: {}
		}, null, 2),
		
		'tsconfig.json': JSON.stringify({
			"extends": "../../.nuxt/tsconfig.json"
		}, null, 2),
		
		'nuxt.config.ts': `/**
 * @project: ${fullPackageName}
 * @author:  ${author}
 * @date:    ${dateStr}
 * @desc:    ${metadata.jsdoc}
 */
export default defineNuxtConfig({
  devtools: { enabled: true }
})`,
		
		'README.md': `# ${fullPackageName}\n\n${metadata.readme}`,
		
		'.gitignore': 'node_modules/\n.nuxt/\n.output/\n'
	};
	
	const folders = [
		'components',
		'composables',
		'utils',
		'server/api',
		'pages',
		'public'
	];
	
	try {
		// Create Folders
		fs.mkdirSync(targetDir, { recursive: true });
		
		folders.forEach(f => {
			fs.mkdirSync(path.join(targetDir, f), { recursive: true });
			// Add .gitkeep so empty folders are tracked
			fs.writeFileSync(path.join(targetDir, f, '.gitkeep'), '');
		});
		
		// Write Files
		Object.entries(files).forEach(([name, content]) => {
			fs.writeFileSync(path.join(targetDir, name), content);
		});
		
		consola.success(pc.green(`Layer '${layerName}' created successfully.`));
		
	} catch (err: any) {
		consola.error(`Scaffolding failed: ${err.message}`);
	}
}