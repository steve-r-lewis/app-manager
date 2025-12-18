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

import simpleGit, { SimpleGit } from 'simple-git';
import path from 'path';
import fs from 'fs/promises';
import { existsSync } from 'fs';
import { consola } from 'consola';
import pc from 'picocolors';
import { spinner } from '@clack/prompts';
import { github } from '../../services/github.service';
import { llm } from '../../services/llm.service';

// --- Helper: Auto-commit if dirty (AI Powered) ---
async function ensureCleanRepo(git: SimpleGit, label: string) {
  const status = await git.status();
  if (status.isClean()) return;

  consola.info(`[${label}] Changes detected. Auto-committing...`);
  await git.add('.');

  // Get Diff for AI
  const diff = await git.diff(['--staged']);
  let message = "WIP: Auto-commit during sync";

  if (diff && diff.length < 6000) {
    try {
      // Use standard concatenation to avoid template literal parser issues
      const promptText = "Generate a commit message for:\n" + diff;

      const aiResponse = await llm.invoke({
        systemPrompt: "You are a git commit message generator. Output ONLY the message. Max 50 chars.",
        userPrompt: promptText
      });
      message = aiResponse;
    } catch (e) {
      consola.warn(`[${label}] AI Commit Gen failed, using default.`);
    }
  }

  await git.commit(message.trim());
  consola.success(`[${label}] Committed: "${message.trim()}"`);
}

// --- Helper: Ensure Remote & Push ---
async function ensureRemoteAndPush(git: SimpleGit, repoName: string, label: string) {
  // 1. Ensure GitHub Repo Exists (Idempotent)
  const remoteUrl = await github.ensureRepoExists(repoName);

  // 2. Configure Local Remote
  const remotes = await git.getRemotes(true);
  const origin = remotes.find(r => r.name === 'origin');

  if (!origin) {
    await git.addRemote('origin', remoteUrl);
    consola.info(`[${label}] Added remote: ${remoteUrl}`);
  } else if (origin.refs.push !== remoteUrl) {
    await git.removeRemote('origin');
    await git.addRemote('origin', remoteUrl);
    consola.warn(`[${label}] Updated remote URL.`);
  }

  // 3. Push
  try {
    // Push master and set upstream. If it fails, try HEAD.
    await git.push('origin', 'master', { '-u': null });
  } catch (e) {
    try {
      await git.push(['-u', 'origin', 'HEAD']);
    } catch (err: any) {
      consola.warn(`[${label}] Push failed (is the repo empty?): ${err.message}`);
    }
  }
}

export async function syncRepos() {
  const s = spinner();
  s.start('Initializing Sync...');

  const rootPath = process.cwd();
  const rootGit = simpleGit(rootPath);
  const rootName = path.basename(rootPath);
  // Default to a safe placeholder if ENV is missing
  const org = process.env.GITHUB_ORG || 'steve-r-lewis';

  // ---------------------------------------------------------
  // 1. Process ROOT Repository
  // ---------------------------------------------------------
  s.message(`Processing Root: ${rootName}`);

  if (!await rootGit.checkIsRepo()) {
    await rootGit.init();
    await rootGit.add('.');
    await rootGit.commit('Initial commit');
  }

  await ensureCleanRepo(rootGit, 'ROOT');
  await ensureRemoteAndPush(rootGit, rootName, 'ROOT');

  // ---------------------------------------------------------
  // 2. Process LAYER Repositories
  // ---------------------------------------------------------
  const layersDir = path.resolve(rootPath, 'layers');
  if (!existsSync(layersDir)) await fs.mkdir(layersDir);

  const entries = await fs.readdir(layersDir, { withFileTypes: true });
  const layerFolders = entries.filter(e => e.isDirectory());

  for (const folder of layerFolders) {
    const layerName = folder.name;
    const layerPath = path.join(layersDir, layerName);
    const layerGit = simpleGit(layerPath);

    // Naming convention: nuxt4-layer-<name>
    // Sanitized without regex inside template literal
    const sanitized = layerName.toLowerCase().replace(/[^a-z0-9-]/g, '-');
    const repoName = `nuxt4-layer-${sanitized}`;
    const label = `LAYER:${layerName}`;

    s.message(`Processing Layer: ${layerName}`);

    // A. Init & Commit
    if (!await layerGit.checkIsRepo()) {
      await layerGit.init();
    }
    await ensureCleanRepo(layerGit, label);

    // B. Sync Remote
    await ensureRemoteAndPush(layerGit, repoName, label);

    // C. Ensure Submodule Link in Root
    // We need the remote URL to add it as a submodule
    const remoteUrl = `https://github.com/${org}/${repoName}.git`;
    const relPath = `layers/${layerName}`;

    // Check if already registered in .gitmodules
    // We use a raw call to ls-files to see if the path is tracked
    const submoduleStatus = await rootGit.raw(['ls-files', '--stage', relPath]);

    if (!submoduleStatus) {
      consola.info(`Linking submodule: ${layerName}...`);
      try {
        await rootGit.submoduleAdd(remoteUrl, relPath);
        await rootGit.commit(`chore: link submodule ${layerName}`);
        await rootGit.push(); // Push root immediately to save the link
      } catch (e: any) {
        consola.error(`Failed to link submodule ${layerName}: ${e.message}`);
      }
    }
  }

  s.stop('Repository Sync Complete.');
  consola.success(pc.green('All repositories synced and submodules linked.'));
}
