/**
 * ================================================================================
 *
 * @project:    app-manager
 * @file:       ~/app/commands/nuxt/extractDocs.ts
 * @version:    1.0.1
 * @createDate: 2025 Dec 17
 * @createTime: 01:34
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
 * V1.0.0, 20251217-01:34
 * Initial creation and release of extractDocs.ts
 *
 * ================================================================================
 */

import fs from 'fs';
import path from 'path';
import { multiselect, spinner, isCancel } from '@clack/prompts';
import { consola } from 'consola';
import pc from 'picocolors';
import { llm } from '../../services/llmService';

// --- Types ---
interface FileResult {
	file: string;
	content: string;
}

// --- Helper: Recursive File Scanner ---
function scanFiles(dir: string, extension: string, fileList: string[] = []) {
	if (!fs.existsSync(dir)) return fileList;
	
	const files = fs.readdirSync(dir, { withFileTypes: true });
	for (const file of files) {
		const fullPath = path.join(dir, file.name);
		if (file.isDirectory() && file.name !== 'node_modules' && file.name !== '.git') {
			scanFiles(fullPath, extension, fileList);
		} else if (file.isFile()) {
			if (extension === '*' || file.name.endsWith(extension) || file.name === extension) {
				fileList.push(fullPath);
			}
		}
	}
	return fileList;
}

// --- Helper: Content Extractor ---
async function processFile(filePath: string, layerPath: string): Promise<string> {
	const filename = path.basename(filePath);
	const relPath = path.relative(layerPath, filePath);
	const ext = path.extname(filePath);
	
	try {
		const content = fs.readFileSync(filePath, 'utf-8');
		
		// 1. JSON: Description only
		if (filename === 'package.json') {
			try {
				const json = JSON.parse(content);
				return json.description ? `> ${json.description}` : '(No description in package.json)';
			} catch {
				return '(Invalid JSON)';
			}
		}
		
		// 2. Markdown: Truncate
		if (ext === '.md') {
			const lines = content.split('\n');
			return lines.slice(0, 20).join('\n') + (lines.length > 20 ? '\n... (truncated)' : '');
		}
		
		// 3. Code: AI Summary
		if (['.ts', '.js', '.vue'].includes(ext)) {
			try {
				const prompt = `
                    You are a technical documentation assistant.
                    Summarize the responsibility of this Nuxt code file in one concise sentence.
                    File: ${relPath}
                    Code:
                    ${content.substring(0, 2000)}
                `;
				const summary = await llm.generate(prompt);
				return `**AI Summary:** ${summary.trim()}`;
			} catch (error) {
				return '(AI Summarization failed due to API limit or network)';
			}
		}
		
		return '(Binary or unsupported file type)';
	} catch (e: any) {
		return `Error reading file: ${e.message}`;
	}
}

export async function extractDocs(targetRoot: string) {
	const layersDir = path.join(targetRoot, 'layers');
	const reportsDir = path.join(targetRoot, 'docs', 'reports');
	
	// 1. Validation
	if (!fs.existsSync(layersDir)) {
		consola.warn(`No 'layers' directory found at ${layersDir}`);
		return;
	}
	
	// 2. Selection
	const patterns = await multiselect({
		message: 'Select files to scan per layer:',
		options: [
			{ value: 'package.json', label: 'package.json', hint: 'Manifest' },
			{ value: 'nuxt.config.ts', label: 'nuxt.config.ts', hint: 'Config' },
			{ value: 'README.md', label: 'README.md', hint: 'Docs' },
			{ value: '.vue', label: 'Vue Components (*.vue)', hint: 'Recursive AI Summary' },
			{ value: '.ts', label: 'TypeScript (*.ts)', hint: 'Recursive AI Summary' }
		],
		initialValues: ['package.json', 'README.md'],
		required: true
	});
	
	if (isCancel(patterns)) return;
	const searchExtensions = patterns as string[];
	
	// 3. Preparation
	const s = spinner();
	s.start('Initializing documentation agent...');
	
	if (!fs.existsSync(reportsDir)) {
		fs.mkdirSync(reportsDir, { recursive: true });
	}
	
	const timestamp = new Date().toISOString().replace(/[-:T]/g, '').slice(0, 12);
	const outputFile = path.join(reportsDir, `layer-report-${timestamp}.md`);
	
	let markdownBody = '';
	const toc: string[] = [];
	
	// 4. Processing Layers
	const layerFolders = fs.readdirSync(layersDir, { withFileTypes: true })
		.filter(d => d.isDirectory())
		.map(d => d.name);
	
	for (const layerName of layerFolders) {
		s.message(`Analyzing layer: ${layerName}...`);
		
		const layerPath = path.join(layersDir, layerName);
		const fullLayerName = `@monorepo/${layerName}`;
		const anchor = layerName.toLowerCase();
		
		toc.push(`- [${fullLayerName}](#${anchor})`);
		markdownBody += `\n---\n## <a id="${anchor}"></a>${fullLayerName}\n\n`;
		
		// Gather all matching files recursively
		let layerFiles: string[] = [];
		for (const ext of searchExtensions) {
			// If pattern is specific name (package.json) or extension (.vue)
			const matches = scanFiles(layerPath, ext);
			layerFiles = [...layerFiles, ...matches];
		}
		
		// Deduplicate
		layerFiles = [...new Set(layerFiles)].sort();
		
		if (layerFiles.length === 0) {
			markdownBody += `*No matching files found.*\n`;
			continue;
		}
		
		// Process files in parallel for this layer
		const filePromises = layerFiles.map(async (fullPath) => {
			const relPath = path.relative(layerPath, fullPath);
			const content = await processFile(fullPath, layerPath);
			return { relPath, content };
		});
		
		const results = await Promise.all(filePromises);
		
		for (const res of results) {
			markdownBody += `### \`${res.relPath}\`\n\n${res.content}\n\n`;
		}
	}
	
	// 5. Finalize
	const finalDoc = `# Monorepo Layer Documentation
**Generated:** ${new Date().toLocaleString()}
**Scope:** ${searchExtensions.join(', ')}

## Table of Contents
${toc.join('\n')}

${markdownBody}`;
	
	fs.writeFileSync(outputFile, finalDoc, 'utf-8');
	
	s.stop('Report generated.');
	consola.success(pc.green(`Documentation saved to: ${outputFile}`));
}