/**
 * ================================================================================
 *
 * @project:    app-manager
 * @file:       ~/app/commands/utils/validateHeaders.ts
 * @version:    2.1.0
 * @createDate: 2025 Dec 17
 * @createTime: 01:46
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
 * V2.1.0, 20251226-22:45
 * Added package.json validation logic.
 * Implemented Interactive Fix menu with Manual and AI-Generated options.
 *
 * V2.0.1, 20251226-1912
 * Refactored logic.
 *
 * V2.0.0, 20251219-19:11
 * Added support for multi-author headers.
 *
 * V1.0.0, 20251217-01:46
 * Initial creation and release of validateHeaders.ts
 *
 * ================================================================================
 */

import fs from 'fs';
import path from 'path';
import { spinner, select, text, isCancel } from '@clack/prompts';
import { consola } from 'consola';
import pc from 'picocolors';
import { simpleGit } from 'simple-git';
import { llm } from '../../services/llmService';

// --- Configuration ---
const EXTENSIONS = new Set(['.ts', '.vue', '.js', '.tsx', '.jsx']);
const EXCLUDE_DIRS = new Set(['node_modules', '.git', '.nuxt', '.output', 'dist', 'coverage']);

// Regex Patterns
const RX_PROJECT = /(@project:\s*)(.+)/;
const RX_FILE = /(@file:\s*)(.+)/;
const RX_AUTHOR_GLOBAL = /(@author:\s*)(.+)/g;
const RX_CREATE_TIME = /(@createTime:.+)/;
const RX_VERSION_TAG = /(@version:\s*)(\S+)/;
const RX_HISTORY_VER = /[Vv](\d+\.\d+\.\d+)/g;

async function getGitAuthor(root: string): Promise<string> {
	try {
		const git = simpleGit(root);
		const name = await git.raw(['config', 'user.name']);
		return name.trim() || 'App Manager';
	} catch {
		return 'App Manager';
	}
}

/**
 * Recursive scanner that includes package.json
 */
function walk(dir: string, fileList: string[] = []) {
	if (!fs.existsSync(dir)) return fileList;
	const files = fs.readdirSync(dir, { withFileTypes: true });
	
	for (const file of files) {
		const fullPath = path.join(dir, file.name);
		if (file.isDirectory()) {
			if (!EXCLUDE_DIRS.has(file.name)) {
				walk(fullPath, fileList);
			}
		} else {
			// Scan Source Files OR package.json
			if (EXTENSIONS.has(path.extname(file.name)) || file.name === 'package.json') {
				fileList.push(fullPath);
			}
		}
	}
	return fileList;
}

function resolveProjectName(filePath: string, targetRoot: string): string {
	const rootName = path.basename(targetRoot);
	const relPath = path.relative(targetRoot, filePath);
	const segments = relPath.split(path.sep);
	
	if (segments[0] === 'layers' && segments.length > 1) {
		return `@monorepo/${segments[1]}`;
	}
	return rootName;
}

/**
 * Validates and Fixes package.json naming
 */
async function validatePackageManifest(filePath: string, targetRoot: string): Promise<string[] | null> {
	const content = fs.readFileSync(filePath, 'utf-8');
	let pkg;
	try {
		pkg = JSON.parse(content);
	} catch {
		return ['Invalid JSON'];
	}
	
	const expectedName = resolveProjectName(filePath, targetRoot);
	// We only strictly enforce naming for layers, not the root
	if (expectedName === path.basename(targetRoot)) return null;
	
	if (pkg.name !== expectedName) {
		// --- Interactive Fix Flow ---
		// We return a special signal to the main loop to pause spinner and prompt
		return ['MISMATCH_NAME', expectedName, pkg.name];
	}
	
	return null;
}

/**
 * Processes Source Code Headers
 */
async function processSourceFile(filePath: string, targetRoot: string, gitAuthor: string) {
	let content = fs.readFileSync(filePath, 'utf-8');
	let newContent = content;
	const changes: string[] = [];
	
	const relPath = '~/' + path.relative(targetRoot, filePath).replace(/\\/g, '/');
	const projectName = resolveProjectName(filePath, targetRoot);
	
	// 1. Update @project
	if (RX_PROJECT.test(newContent)) {
		const current = newContent.match(RX_PROJECT)?.[2];
		if (current?.trim() !== projectName) {
			newContent = newContent.replace(RX_PROJECT, `$1${projectName}`);
			changes.push('Project');
		}
	}
	
	// 2. Update @file
	if (RX_FILE.test(newContent)) {
		const current = newContent.match(RX_FILE)?.[2];
		if (current?.trim() !== relPath) {
			newContent = newContent.replace(RX_FILE, `$1${relPath}`);
			changes.push('Path');
		}
	}
	
	// 3. Update @author
	const authorMatches = [...newContent.matchAll(RX_AUTHOR_GLOBAL)];
	const existingAuthors = authorMatches.map(m => m[2].trim());
	
	if (existingAuthors.length === 0) {
		if (RX_CREATE_TIME.test(newContent)) {
			newContent = newContent.replace(RX_CREATE_TIME, `$1\n * @author:     ${gitAuthor}`);
			changes.push('Author (New)');
		}
	} else {
		if (!existingAuthors.includes(gitAuthor)) {
			const lastMatch = authorMatches[authorMatches.length - 1];
			const lastAuthorString = lastMatch[0];
			const prefix = lastMatch[1];
			newContent = newContent.replace(
				lastAuthorString,
				`${lastAuthorString}\n${prefix}${gitAuthor}`
			);
			changes.push('Author (Append)');
		}
	}
	
	// 4. Sync @version
	const historyMatches = [...newContent.matchAll(RX_HISTORY_VER)];
	if (historyMatches.length > 0) {
		const versions = historyMatches.map(m => m[1]);
		const latest = versions.sort((a, b) => {
			const pa = a.split('.').map(Number);
			const pb = b.split('.').map(Number);
			for (let i = 0; i < 3; i++) {
				if (pa[i] > pb[i]) return -1;
				if (pa[i] < pb[i]) return 1;
			}
			return 0;
		})[0];
		
		const verMatch = newContent.match(RX_VERSION_TAG);
		if (verMatch && verMatch[2] !== latest) {
			newContent = newContent.replace(RX_VERSION_TAG, `$1${latest}`);
			changes.push(`Ver->${latest}`);
		}
	}
	
	if (newContent !== content) {
		fs.writeFileSync(filePath, newContent, 'utf-8');
		return changes;
	}
	return null;
}

export async function validateHeaders(targetRoot: string) {
	const s = spinner();
	s.start('Scanning source files...');
	
	const files = walk(targetRoot);
	const author = await getGitAuthor(targetRoot);
	
	let updatedCount = 0;
	
	for (const file of files) {
		const fileName = path.basename(file);
		
		// Handle package.json specially
		if (fileName === 'package.json') {
			const result = await validatePackageManifest(file, targetRoot);
			
			if (result && result[0] === 'MISMATCH_NAME') {
				s.stop('Validation Paused');
				const [_, expected, current] = result;
				
				consola.warn(`Naming Mismatch in ${pc.bold(path.relative(targetRoot, file))}`);
				consola.info(`Current: ${pc.red(current)}`);
				consola.info(`Expected: ${pc.green(expected)}`);
				
				const action = await select({
					message: 'How would you like to fix this?',
					options: [
						{ value: 'auto', label: `✅ Use Expected (${expected})` },
						{ value: 'manual', label: '✏️  Manual Entry' },
						{ value: 'ai', label: '🤖 AI Smart Fix (Name & Description)' },
						{ value: 'skip', label: '❌ Skip' }
					]
				});
				
				if (isCancel(action) || action === 'skip') {
					s.start('Resuming scan...');
					continue;
				}
				
				let newName = expected;
				let newDesc = null;
				
				if (action === 'manual') {
					const input = await text({
						message: 'Enter new package name:',
						initialValue: expected,
						validate: (val) => !val ? 'Name is required' : undefined
					});
					if (isCancel(input)) continue;
					newName = input as string;
				}
				
				if (action === 'ai') {
					s.start('Consulting AI...');
					try {
						const prompt = `
							Context: A package.json file at "${path.relative(targetRoot, file)}".
							Current Name: "${current}"
							Expected Convention: "${expected}"
							
							Task:
							1. Confirm if "${expected}" is appropriate.
							2. Generate a professional 'description' string for this layer.
							
							Return JSON ONLY: { "name": "...", "description": "..." }
						`;
						const raw = await llm.generate(prompt);
						const aiData = JSON.parse(raw.replace(/```json/g, '').replace(/```/g, '').trim());
						newName = aiData.name || expected;
						newDesc = aiData.description;
						s.stop('AI Suggestion Ready');
					} catch (e) {
						s.stop('AI Failed');
						consola.error('Could not generate AI suggestion. Falling back to standard.');
					}
				}
				
				// Apply Fix
				const content = JSON.parse(fs.readFileSync(file, 'utf-8'));
				content.name = newName;
				if (newDesc) content.description = newDesc;
				
				fs.writeFileSync(file, JSON.stringify(content, null, 2));
				consola.success(`Updated package.json: ${newName}`);
				updatedCount++;
				
				s.start('Resuming scan...');
			}
		}
		// Handle Source Code Headers
		else {
			const changes = await processSourceFile(file, targetRoot, author);
			if (changes) {
				s.message(pc.dim(`Updated ${fileName}: ${changes.join(', ')}`));
				updatedCount++;
			}
		}
	}
	
	s.stop(`Validation Complete. Checked ${files.length} files. Updated ${updatedCount}.`);
}