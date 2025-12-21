/**
 * ================================================================================
 *
 * @project:    app-manager
 * @file:       ~/app/commands/nuxt/createLayer.ts
 * @version:    1.1.0
 * @createDate: 2025 Dec 17
 * @createTime: 01:27
 * @author:     Steve R Lewis
 *
 * ================================================================================
 *
 * @description:
 * Provisions a new Nuxt layer with AI-generated descriptions.
 * Scaffolds structure, README, LICENSE, and Config.
 *
 * ================================================================================
 *
 * @notes: Revision History
 *
 * V1.1.0, 20251221-21:55
 * Added JSDoc word-wrapping and LICENSE generation to match PowerShell parity.
 *
 * V1.0.0, 20251217-01:27
 * Initial creation and release of createLayer.ts
 *
 * ================================================================================
 */

import { intro, outro, text, isCancel } from '@clack/prompts';
import { logger } from '../../services/logger.service.js';
import { llm } from '../../services/llm.service.js';
import fs from 'fs';
import path from 'path';

export interface CreateLayerOptions {
	name?: string;
	purpose?: string;
}

export async function createLayer(targetRoot: string, options: CreateLayerOptions = {}) {
	// --- HEADLESS SETUP ---
	if (!options.name) {
		intro('🧩  Create Nuxt Layer');
	} else {
		logger.info(`Headless: Creating layer '${options.name}'...`);
	}
	
	const layersDir = path.join(targetRoot, 'layers');
	if (!fs.existsSync(layersDir)) {
		fs.mkdirSync(layersDir, { recursive: true });
	}
	
	// 1. Get Inputs
	let layerName = options.name;
	if (!layerName) {
		const input = await text({
			message: 'Enter Layer Name (e.g. billing):',
			validate: (val) => !val ? 'Name is required' : undefined
		});
		if (isCancel(input)) { outro('Cancelled'); return; }
		layerName = (input as string).toLowerCase().trim();
	}
	
	const targetDir = path.join(layersDir, layerName!);
	if (fs.existsSync(targetDir)) {
		logger.error(`Layer '${layerName}' already exists.`);
		return;
	}
	
	let purpose = options.purpose;
	if (!purpose && !options.name) {
		const input = await text({
			message: 'Enter purpose (for AI context):',
			placeholder: `Utility layer for ${layerName}`
		});
		if (isCancel(input)) { outro('Cancelled'); return; }
		purpose = (input as string) || `Utility layer for ${layerName}`;
	} else if (!purpose) {
		purpose = `Utility layer for ${layerName}`;
	}
	
	// 2. AI Generation
	const loader = logger.loader('Generating Metadata via AI...');
	let aiData = {
		readme: `The @monorepo/${layerName} layer. Purpose: ${purpose}`,
		jsdoc: `Configuration for ${layerName}.`,
		pkgJson: `Layer for ${purpose}`
	};
	
	try {
		const prompt = `
        Context: Generating a Nuxt layer named '@monorepo/${layerName}'.
        User Purpose: "${purpose}".
        Task: Return a raw JSON object with 3 keys:
        1. "readme": A 2-3 paragraph technical description.
        2. "jsdoc": A single paragraph (approx 60 words) describing the config file.
        3. "pkgJson": A short summary (max 20 words).
        Return ONLY valid JSON.
        `;
		
		const response = await llm.generate(prompt);
		
		// Extract JSON if wrapped in markdown blocks
		const jsonMatch = response.match(/\{[\s\S]*\}/);
		if (jsonMatch) {
			const parsed = JSON.parse(jsonMatch[0]);
			aiData = { ...aiData, ...parsed };
		}
	} catch (e) {
		logger.warn('AI generation failed, using defaults.');
	} finally {
		loader.stop();
	}
	
	// 3. Formatting Logic (PowerShell Parity)
	// Word Wrap JSDoc at 75 chars
	const words = aiData.jsdoc.split(' ');
	let jsDocBlock = '';
	let line = ' *';
	for (const word of words) {
		if (line.length + word.length > 75) {
			jsDocBlock += `${line}\n`;
			line = ` * ${word}`;
		} else {
			line += ` ${word}`;
		}
	}
	jsDocBlock += line;
	
	// Dates
	const now = new Date();
	const dateStr = now.toLocaleDateString('en-GB', { year: 'numeric', month: 'short', day: '2-digit' });
	const timeStr = now.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
	const year = now.getFullYear();
	
	// 4. Scaffolding
	try {
		fs.mkdirSync(targetDir, { recursive: true });
		
		// -- package.json --
		const pkgJson = {
			name: `@monorepo/${layerName}`,
			version: "1.0.0",
			description: aiData.pkgJson,
			private: true,
			type: "module",
			main: "./nuxt.config.ts"
		};
		fs.writeFileSync(path.join(targetDir, 'package.json'), JSON.stringify(pkgJson, null, 2));
		
		// -- tsconfig.json --
		const tsConfig = { extends: "../../.nuxt/tsconfig.json" };
		fs.writeFileSync(path.join(targetDir, 'tsconfig.json'), JSON.stringify(tsConfig, null, 2));
		
		// -- .gitignore --
		const gitIgnore = `# Package Managers\n.git\nnode_modules/\n`;
		fs.writeFileSync(path.join(targetDir, '.gitignore'), gitIgnore);
		
		// -- LICENSE --
		const licenseContent = `Copyright ${year} Steve R Lewis\n\nPermission is hereby granted, free of charge... (Standard MIT/Proprietary Text)`;
		fs.writeFileSync(path.join(targetDir, 'LICENSE'), licenseContent);
		
		// -- README.md --
		const readmeContent = `# @monorepo/${layerName}\n\n${aiData.readme}\n`;
		fs.writeFileSync(path.join(targetDir, 'README.md'), readmeContent);
		
		// -- nuxt.config.ts --
		const nuxtConfigContent = `/**
 * ================================================================================
 * @project:    @monorepo/${layerName}
 * @file:       ~/layers/${layerName}/nuxt.config.ts
 * @version:    1.0.0
 * @createDate: ${dateStr}
 * @createTime: ${timeStr}
 * @author:     Steve R Lewis
 * ================================================================================
 * @description:
${jsDocBlock}
 * ================================================================================
 */
export default defineNuxtConfig({
  devtools: { enabled: true }
})
`;
		fs.writeFileSync(path.join(targetDir, 'nuxt.config.ts'), nuxtConfigContent);
		
		logger.success(`Layer provisioned: ${targetDir}`);
	} catch (error: any) {
		logger.error(`Scaffolding failed: ${error.message}`);
	}
	
	if (!options.name) outro('Done');
}