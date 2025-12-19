/**
 * ================================================================================
 *
 * @project:    app-manager
 * @file:       ~/app/commands/utils/autoVersion.ts
 * @version:    1.0.0
 * @createDate: 2025 Dec 17
 * @createTime: 01:47
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
 * V1.0.0, 20251217-01:47
 * Initial creation and release of autoVersion.ts
 *
 * ================================================================================
 */

import { simpleGit } from 'simple-git';
import fs from 'fs';
import path from 'path'; // Import path
import { spinner, confirm, isCancel } from '@clack/prompts';
import { llm } from '../../services/llm.service';
import { consola } from 'consola';
import pc from 'picocolors';

// Regex Patterns
const RX_VERSION = /(@version:\s*)([vV]?\d+\.\d+\.\d+)/;
const RX_HISTORY_HEADER = /(@notes: Revision History)/;

interface VersionAnalysis {
	increment: 'Major' | 'Minor' | 'Patch';
	note: string;
}

function incrementVersion(version: string, type: 'Major' | 'Minor' | 'Patch'): string {
	const clean = version.replace(/^[vV]/, '');
	const parts = clean.split('.').map(Number);
	
	// Safety fallback
	if (parts.some(isNaN) || parts.length < 3) return version;
	
	if (type === 'Major') { parts[0]++; parts[1]=0; parts[2]=0; }
	else if (type === 'Minor') { parts[1]++; parts[2]=0; }
	else { parts[2]++; } // Patch
	
	return `${parts.join('.')}`;
}

function sanitizeJson(str: string): string {
	return str.replace(/```json/g, '').replace(/```/g, '').trim();
}

export async function autoVersion(targetRoot: string) {
	const git = simpleGit(targetRoot);
	const s = spinner();
	
	// 1. Find Modified Files
	const status = await git.diff(['--name-only', 'HEAD']);
	const files = status.split('\n')
		.filter(f => f.match(/\.(ts|vue)$/))
		.filter(Boolean);
	
	if (files.length === 0) {
		consola.info("No modified .ts/.vue files found.");
		return;
	}
	
	consola.info(pc.blue(`Found ${files.length} candidate files for versioning.`));
	
	const proceed = await confirm({
		message: `Analyze and version ${files.length} files?`
	});
	if (isCancel(proceed) || !proceed) return;
	
	let updatedCount = 0;
	
	for (const file of files) {
		// FIX: Resolve full path relative to targetRoot
		const fullPath = path.join(targetRoot, file);
		
		let content: string;
		try {
			content = fs.readFileSync(fullPath, 'utf-8');
		} catch (e) {
			continue;
		}
		
		if (!RX_VERSION.test(content) || !RX_HISTORY_HEADER.test(content)) {
			continue;
		}
		
		const diff = await git.diff(['HEAD', '--', file]);
		if (!diff.trim()) continue;
		
		s.start(`Analyzing ${file}...`);
		
		let analysis: VersionAnalysis = { increment: 'Patch', note: 'Update' };
		
		try {
			const prompt = `
                You are a Semantic Versioning expert. Analyze this git diff.
                Tasks:
                1. Determine increment (Patch=fix, Minor=feat, Major=breaking).
                2. Write a single-line technical revision note (max 10 words).
                
                Return JSON ONLY: { "increment": "Patch", "note": "Refactored logic." }
                
                DIFF:
                ${diff.substring(0, 3000)}
            `;
			
			const response = await llm.generate(prompt);
			analysis = JSON.parse(sanitizeJson(response));
		} catch (e) {
			consola.warn(pc.yellow(`AI analysis failed for ${file}, defaulting to Patch.`));
		}
		
		const verMatch = content.match(RX_VERSION);
		if (!verMatch) {
			s.stop(`Skipped ${file} (Header missing)`);
			continue;
		}
		
		const currentVer = verMatch[2];
		const newVer = incrementVersion(currentVer, analysis.increment);
		
		const now = new Date();
		const dateStr = now.toISOString().slice(0, 10).replace(/-/g, '') + '-' +
			now.toTimeString().slice(0, 5).replace(':', '');
		
		const historyEntry = `\n * V${newVer}, ${dateStr}\n * ${analysis.note}`;
		
		let newContent = content.replace(RX_VERSION, `$1${newVer}`);
		newContent = newContent.replace(RX_HISTORY_HEADER, `$1${historyEntry}`);
		
		// FIX: Write to fullPath
		fs.writeFileSync(fullPath, newContent, 'utf-8');
		s.stop(`Updated ${file}: ${currentVer} -> ${newVer}`);
		updatedCount++;
	}
	
	if (updatedCount > 0) {
		consola.success(pc.green(`Successfully auto-versioned ${updatedCount} files.`));
	} else {
		consola.info("No eligible files were updated.");
	}
}