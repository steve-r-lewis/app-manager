/**
 * ================================================================================
 *
 * @project:    nuxt4-data-generator
 * @file:       ~/scripts/tui/commands/nuxt/extractDocs.ts
 * @version:    1.0.0
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
 *
 * V1.0.0, 20251217-01:34
 * Initial creation and release of extractDocs.ts
 *
 * ================================================================================
 */

// scripts/tui/commands/nuxt/extractDocs.ts
import fs from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';
import { multiselect, spinner, isCancel } from '@clack/prompts';
import { consola } from 'consola';
import pc from 'picocolors';
import { llm } from '../../services/llm.service';

// --- Helper: Content Extractor ---
async function extractContent(filePath: string): Promise<string[]> {
  const filename = path.basename(filePath);
  const ext = path.extname(filePath);

  try {
    const content = await fs.readFile(filePath, 'utf-8');

    // 1. Handle JSON (package.json)
    if (filename === 'package.json') {
      const json = JSON.parse(content);
      return json.description ? [json.description] : ['(No description found)'];
    }

    // 2. Handle Markdown
    if (ext === '.md') {
      const lines = content.split('\n');
      // Return first 30 lines, truncated
      return lines.slice(0, 30);
    }

    // 3. Handle Code Files (AI Summarization)
    if (['.ts', '.js', '.vue'].includes(ext)) {
      try {
        const summary = await llm.invoke({
          systemPrompt: "You are a tech lead. Summarize this code file in 1 sentence. Focus on responsibility.",
          userPrompt: content,
          temperature: 0.3 // Low temp for factual summaries
        });
        return [`@ai-summary: ${summary.trim()}`];
      } catch (error) {
        return ['(AI summarization failed)'];
      }
    }

    return [];
  } catch (e) {
    return [`Error reading file: ${e}`];
  }
}

export async function extractDocs() {
  const rootPath = process.cwd();
  const layersDir = path.resolve(rootPath, 'layers');
  const reportsDir = path.resolve(rootPath, 'app-monitor/reports');

  // 1. Select File Types
  const patterns = await multiselect({
    message: 'Select files to scan per layer:',
    options: [
      { value: 'package.json', label: 'package.json', hint: 'Description' },
      { value: 'nuxt.config.ts', label: 'nuxt.config.ts', hint: 'Config Summary' },
      { value: 'README.md', label: 'README.md', hint: 'Documentation' },
      { value: '*.vue', label: 'Vue Components', hint: 'AI Summary' },
      { value: '*.ts', label: 'TypeScript Files', hint: 'AI Summary' }
    ],
    initialValues: ['package.json', 'nuxt.config.ts', 'README.md'],
    required: true
  });

  if (isCancel(patterns)) return;
  const searchPatterns = patterns as string[];

  // 2. Prep Output
  const s = spinner();
  s.start('Scanning layers...');

  if (!existsSync(reportsDir)) await fs.mkdir(reportsDir, { recursive: true });

  const timestamp = new Date().toISOString().replace(/[-:T]/g, '').slice(0, 12); // YYYYMMDDHHMM
  const outputFile = path.join(reportsDir, `monorepo-layer-descriptions-${timestamp}.md`);

  let markdownBody = '';
  const toc: string[] = [];

  // 3. Iterate Layers
  if (!existsSync(layersDir)) {
    s.stop('No layers directory found.');
    return;
  }

  const layerFolders = (await fs.readdir(layersDir, { withFileTypes: true }))
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name)
    .sort();

  for (const layerName of layerFolders) {
    s.message(`Processing @monorepo/${layerName}...`);

    const fullLayerName = `@monorepo/${layerName}`;
    const anchor = fullLayerName.replace(/[@/]/g, '').toLowerCase();

    // Add to TOC
    toc.push(`- [${fullLayerName}](#${anchor})`);

    // Add Header
    markdownBody += `\n---\n# ${fullLayerName}\n\n`;

    // Scan for files
    const layerPath = path.join(layersDir, layerName);
    const allFiles = await fs.readdir(layerPath);

    for (const pattern of searchPatterns) {
      // Simple glob-like matching
      const isWildcard = pattern.startsWith('*.');
      const targetExt = isWildcard ? pattern.substring(1) : null;

      const matchingFiles = allFiles.filter(f => {
        if (isWildcard) return f.endsWith(targetExt!);
        return f === pattern;
      }).sort();

      for (const file of matchingFiles) {
        const fullPath = path.join(layerPath, file);

        // Extract content (might call AI)
        const lines = await extractContent(fullPath);

        if (lines.length > 0) {
          markdownBody += `## ${file}\n\`\`\`\n`;
          markdownBody += lines.join('\n');
          markdownBody += `\n\`\`\`\n\n`;
        }
      }
    }
  }

  // 4. Write Report
  const finalContent = `# Layer Descriptions (Generated: ${timestamp})
Search Patterns: ${searchPatterns.join(', ')}

## Table of Contents
${toc.join('\n')}

${markdownBody}`;

  await fs.writeFile(outputFile, finalContent, 'utf-8');

  s.stop('Report Generation Complete.');
  consola.success(`Report saved to: ${pc.cyan(outputFile)}`);
}
