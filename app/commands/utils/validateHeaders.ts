/**
 * ================================================================================
 *
 * @project:    app-manager
 * @file:       ~/app/commands/utils/validateHeaders.ts
 * @version:    2.0.0
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
import { spinner } from '@clack/prompts';
import { consola } from 'consola';
import pc from 'picocolors';
import { simpleGit } from 'simple-git';

// --- Configuration ---
const EXTENSIONS = new Set(['.ts', '.vue', '.js', '.tsx', '.jsx']);
const EXCLUDE_DIRS = new Set(['node_modules', '.git', '.nuxt', '.output', 'dist', 'coverage']);

// Regex Patterns
const RX_PROJECT = /(@project:\s*)(.+)/;
const RX_FILE = /(@file:\s*)(.+)/;
// Global flag to find ALL author lines
const RX_AUTHOR_GLOBAL = /(@author:\s*)(.+)/g;
// Single flag for extraction
const RX_AUTHOR = /(@author:\s*)(.+)/;
const RX_VERSION_TAG = /(@version:\s*)(\S+)/;
const RX_HISTORY_VER = /[Vv](\d+\.\d+\.\d+)/g;

// Helper: Anchors to insert new fields if missing
const RX_CREATE_TIME = /(@createTime:.+)/;
const RX_HEADER_START = /(\/\*\*)/;

async function getGitAuthor(root: string): Promise<string> {
	try {
		const git = simpleGit(root);
		const name = await git.raw(['config', 'user.name']);
		return name.trim() || 'App Manager';
	} catch {
		return 'App Manager';
	}
}

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
			if (EXTENSIONS.has(path.extname(file.name))) {
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

async function processFile(filePath: string, targetRoot: string, gitAuthor: string) {
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
	
	// 3. Update @author (Multi-Author Support)
	const authorMatches = [...newContent.matchAll(RX_AUTHOR_GLOBAL)];
	const existingAuthors = authorMatches.map(m => m[2].trim());
	
	if (existingAuthors.length === 0) {
		// No author field exists? Insert one.
		// Try to insert after @createTime, or just inside the block start
		if (RX_CREATE_TIME.test(newContent)) {
			newContent = newContent.replace(RX_CREATE_TIME, `$1\n * @author:     ${gitAuthor}`);
			changes.push('Author (New)');
		}
	} else {
		// Authors exist. Check if Git User is present.
		if (!existingAuthors.includes(gitAuthor)) {
			// Append new author after the LAST author found
			const lastMatch = authorMatches[authorMatches.length - 1];
			const lastAuthorString = lastMatch[0]; // e.g. " * @author:     Steve"
			
			// Reconstruct padding based on previous line
			const prefix = lastMatch[1]; // " * @author:     "
			
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
		const changes = await processFile(file, targetRoot, author);
		if (changes) {
			const name = path.basename(file);
			s.message(pc.dim(`Updated ${name}: ${changes.join(', ')}`));
			updatedCount++;
		}
	}
	
	s.stop(`Validation Complete. Checked ${files.length} files. Updated ${updatedCount}.`);
}