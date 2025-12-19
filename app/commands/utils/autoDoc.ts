/**
 * ================================================================================
 *
 * @project:    app-manager
 * @file:       ~/app/commands/utils/autoDoc.ts
 * @version:    1.0.0
 * @createDate: 2025 Dec 17
 * @createTime: 01:48
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
 * V1.0.0, 20251217-01:48
 * Initial creation and release of autoDoc.ts
 *
 * ================================================================================
 */

import fs from 'fs';
import path from 'path';
import { spinner, confirm, isCancel } from '@clack/prompts';
import { consola } from 'consola';
import pc from 'picocolors';
import { llm } from '../../services/llm.service';

// --- Configuration ---
const SKIP_DIRS = new Set(['node_modules', '.git', '.nuxt', '.output', 'dist', 'coverage']);
const TARGET_EXTS = new Set(['.ts', '.js', '.vue']);

// Regex to find exported members.
const RX_EXPORT = /export\s+(function|const|class|type|interface)\s+([a-zA-Z0-9_]+)/g;

interface DocCandidate {
	file: string;
	index: number;
	name: string;
	snippet: string;
}

/**
 * Recursive file walker
 */
function walk(dir: string, fileList: string[] = []) {
	if (!fs.existsSync(dir)) return fileList;
	const files = fs.readdirSync(dir, { withFileTypes: true });
	
	for (const file of files) {
		const fullPath = path.join(dir, file.name);
		if (file.isDirectory()) {
			if (!SKIP_DIRS.has(file.name)) walk(fullPath, fileList);
		} else {
			if (TARGET_EXTS.has(path.extname(file.name)) && !file.name.endsWith('.d.ts')) {
				fileList.push(fullPath);
			}
		}
	}
	return fileList;
}

/**
 * Checks if an export match is already documented.
 * Looks backwards from the match index for the end-comment token.
 */
function isDocumented(content: string, matchIndex: number): boolean {
	// Look at the 500 chars preceding the match
	const preceding = content.substring(Math.max(0, matchIndex - 500), matchIndex).trimEnd();
	return preceding.endsWith('*/');
}

export async function autoDoc(targetRoot: string) {
	const s = spinner();
	s.start('Scanning for undocumented code...');
	
	const files = walk(targetRoot);
	const candidates: DocCandidate[] = [];
	
	// 1. Discovery Phase
	for (const file of files) {
		const content = fs.readFileSync(file, 'utf-8');
		
		// Find all exports
		let match;
		while ((match = RX_EXPORT.exec(content)) !== null) {
			if (!isDocumented(content, match.index)) {
				// Extract context snippet (up to 300 chars or next newline)
				const snippet = content.substring(match.index, match.index + 300);
				candidates.push({
					file,
					index: match.index,
					name: match[2],
					snippet
				});
			}
		}
	}
	
	s.stop(`Found ${candidates.length} undocumented exported members.`);
	
	if (candidates.length === 0) {
		consola.success("Codebase is fully documented! 🎉");
		return;
	}
	
	// 2. Confirmation
	const proceed = await confirm({
		message: `Generate JSDoc for ${candidates.length} items? (This calls the LLM)`
	});
	
	if (isCancel(proceed) || !proceed) return;
	
	// 3. Generation & Injection
	const filesToUpdate = [...new Set(candidates.map(c => c.file))];
	let processedFiles = 0;
	
	for (const filePath of filesToUpdate) {
		let content = fs.readFileSync(filePath, 'utf-8');
		
		// Sort descending by index to insert bottom-up
		const fileCandidates = candidates
			.filter(c => c.file === filePath)
			.sort((a, b) => b.index - a.index);
		
		for (const candidate of fileCandidates) {
			s.message(`Documenting ${path.basename(filePath)}: ${candidate.name}`);
			
			try {
				const prompt = `
                    Generate a concise JSDoc comment for this TypeScript/JS export.
                    Name: ${candidate.name}
                    Code Context:
                    ${candidate.snippet}
                    
                    Return ONLY the JSDoc block (starting with /** and ending with */). No markdown.
                `;
				
				const response = await llm.generate(prompt);
				const jsDoc = response.replace(/```/g, '').trim();
				
				if (jsDoc.startsWith('/**') && jsDoc.endsWith('*/')) {
					// Inject before the export
					content = content.slice(0, candidate.index) + jsDoc + '\n' + content.slice(candidate.index);
				}
			} catch (e) {
				consola.warn(`Failed to generate doc for ${candidate.name}`);
			}
		}
		
		fs.writeFileSync(filePath, content, 'utf-8');
		processedFiles++;
	}
	
	s.stop(`Documentation complete. Updated ${processedFiles} files.`);
	consola.success(pc.green('Codebase documentation updated.'));
}