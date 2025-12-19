/**
 * ================================================================================
 *
 * @project:    app-manager
 * @file:       ~/app/commands/git/syncRepos.ts
 * @version:    1.0.0
 * @createDate: 2025 Dec 17
 * @createTime: 01:29
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
 * V1.0.0, 20251217-01:29
 * Initial creation and release of syncRepos.ts
 *
 * ================================================================================
 */

import { simpleGit, SimpleGit } from 'simple-git';
import { spinner } from '@clack/prompts';
import { consola } from 'consola';
import pc from 'picocolors';
import fs from 'fs';
import path from 'path';

async function syncSingleRepo(repoPath: string, name: string) {
	const git: SimpleGit = simpleGit(repoPath);
	if (!await git.checkIsRepo()) {
		return { name, status: 'skipped', msg: 'Not a git repo' };
	}
	try {
		await git.pull(['--rebase']);
		return { name, status: 'success' };
	} catch (error: any) {
		return { name, status: 'error', msg: error.message };
	}
}

export async function syncRepos(targetRoot: string) {
	const s = spinner();
	const results: Array<{ name: string, status: string, msg?: string }> = [];
	
	// 1. Root Sync
	s.start('Syncing Root Repository...');
	const rootResult = await syncSingleRepo(targetRoot, 'ROOT');
	results.push(rootResult);
	
	// 2. Submodule Update (Root context)
	if (rootResult.status === 'success') {
		const git = simpleGit(targetRoot);
		try {
			await git.submoduleUpdate(['--init', '--recursive']);
		} catch (e) {
			consola.warn('Submodule update warning (continuing...)');
		}
	}
	
	// 3. Layer Discovery & Sync
	const layersDir = path.join(targetRoot, 'layers');
	if (fs.existsSync(layersDir)) {
		s.message('Scanning layers...');
		const entries = fs.readdirSync(layersDir, { withFileTypes: true });
		for (const entry of entries) {
			if (entry.isDirectory()) {
				const layerPath = path.join(layersDir, entry.name);
				s.message(`Syncing Layer: ${entry.name}`);
				results.push(await syncSingleRepo(layerPath, `LAYER:${entry.name}`));
			}
		}
	}
	
	s.stop('Sync Operations Complete');
	
	// Report
	results.forEach(res => {
		if (res.status === 'success') consola.success(pc.green(`✅ Synced ${res.name}`));
		else if (res.status === 'error') consola.error(pc.red(`❌ Failed ${res.name}: ${res.msg}`));
		else consola.info(pc.dim(`ℹ️  Skipped ${res.name}`));
	});
}