/**
 * ================================================================================
 *
 * @project:    app-manager
 * @file:       ~/app/commands/utils/validateHeaders.ts
 * @version:    1.0.0
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
const RX_AUTHOR = /(@author:\s*)(.+)/;
const RX_VERSION_TAG = /(@version:\s*)(\S+)/;
// Matches "V1.0.0" or "v1.0.0" in history blocks
const RX_HISTORY_VER = /[Vv](\d+\.\d+\.\d+)/g;

/**
 * Get current git user to use as Author default.
 */
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
 * Recursive file walker.
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
			if (EXTENSIONS.has(path.extname(file.name))) {
				fileList.push(fullPath);
			}
		}
	}
	return fileList;
}

/**
 * STRICT Project Name Resolution based on Directory Structure.
 * * Rule 1: layers/{name}/* -> @monorepo/{name}
 * Rule 2: anything else   -> {rootDirectoryName}
 */
function resolveProjectName(filePath: string, targetRoot: string): string {
	const rootName = path.basename(targetRoot);
	
	// Get path relative to the target root
	// e.g., "layers/billing/components/Button.vue"
	// e.g., "app/utils/helper.ts"
	const relPath = path.relative(targetRoot, filePath);
	
	// Split by separator (handle Windows \ or POSIX /)
	const segments = relPath.split(path.sep);
	
	// Check if it is inside 'layers' directory
	if (segments[0] === 'layers' && segments.length > 1) {
		const layerName = segments[1];
		return `@monorepo/${layerName}`;
	}
	
	// Default to Root Directory Name
	return rootName;
}

/**
 * Processes a single file to validate/update headers.
 */
async function processFile(filePath: string, targetRoot: string, authorName: string) {
	let content = fs.readFileSync(filePath, 'utf-8');
	let newContent = content;
	const changes: string[] = [];
	
	// Calculate standardized relative path (e.g. ~/app/utils.ts)
	// Force forward slashes for documentation consistency
	const relPath = '~/' + path.relative(targetRoot, filePath).replace(/\\/g, '/');
	
	// Resolve Project Name (Strict Directory Logic)
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
	if (RX_AUTHOR.test(newContent)) {
		const current = newContent.match(RX_AUTHOR)?.[2];
		if (current?.trim() !== authorName) {
			newContent = newContent.replace(RX_AUTHOR, `$1${authorName}`);
			changes.push('Author');
		}
	}
	
	// 4. Sync @version with Revision History
	const historyMatches = [...newContent.matchAll(RX_HISTORY_VER)];
	if (historyMatches.length > 0) {
		// Extract version strings (e.g. "1.0.0")
		const versions = historyMatches.map(m => m[1]);
		
		// Sort to find the highest version (Simple semantic sort)
		const latest = versions.sort((a, b) => {
			const pa = a.split('.').map(Number);
			const pb = b.split('.').map(Number);
			for (let i = 0; i < 3; i++) {
				if (pa[i] > pb[i]) return -1;
				if (pa[i] < pb[i]) return 1;
			}
			return 0;
		})[0]; // Descending sort, take first
		
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