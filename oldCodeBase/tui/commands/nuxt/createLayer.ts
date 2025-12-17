/**
 * ================================================================================
 *
 * @project:    nuxt4-data-generator
 * @file:       ~/scripts/tui/commands/nuxt/createLayer.ts
 * @version:    1.0.0
 * @createDate: 2025 Dec 17
 * @createTime: 01:27
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
 * V1.0.0, 20251217-01:27
 * Initial creation and release of createLayer.ts
 *
 * ================================================================================
 */

// scripts/tui/commands/nuxt/createLayer.ts
import { text, spinner, isCancel } from '@clack/prompts';
import path from 'path';
import fs from 'fs/promises';
import { existsSync } from 'fs';
import { llm } from '../../services/llm.service';
import { consola } from 'consola';
import pc from 'picocolors';

export async function createLayer() {
  // 1. Inputs
  const layerName = await text({
    message: 'Enter Layer Name (e.g. "billing")',
    placeholder: 'billing',
    validate(value) {
      if (!value) return 'Layer name is required';
      if (/[^a-z0-9-]/.test(value)) return 'Use only lowercase letters, numbers, and hyphens.';
      if (existsSync(path.resolve(process.cwd(), 'layers', value))) return 'Directory already exists.';
    },
  });

  if (isCancel(layerName)) return;

  const purpose = await text({
    message: 'Describe the purpose (for AI context)',
    placeholder: `Utility layer for ${layerName}`,
    initialValue: `Utility layer for ${layerName}`
  });

  if (isCancel(purpose)) return;

  // 2. AI Generation
  const s = spinner();
  s.start('Consulting AI for layer metadata...');

  const sysPrompt = "You are a code scaffolding assistant for a Nuxt 4 Monorepo.";
  const userPrompt = `
    Context: Generating a layer named '@monorepo/${layerName}'.
    User Purpose: "${purpose}".
    Task: Return a raw JSON object with 3 keys:
    1. "readme": A 2 to 3 paragraph technical description.
    2. "jsdoc": A single paragraph (approx 60 words) describing the config file. Start with "This configuration file defines...".
    3. "pkgJson": A short summary (max 20 words).
  `;

  let metadata = {
    readme: `The @monorepo/${layerName} layer.\nPurpose: ${purpose}`,
    jsdoc: `Configuration for ${layerName}.`,
    pkgJson: `Layer for ${purpose}`
  };

  try {
    const jsonStr = await llm.invoke({
      systemPrompt: sysPrompt,
      userPrompt: userPrompt,
      jsonMode: true
    });
    metadata = JSON.parse(jsonStr);
  } catch (error) {
    consola.warn("AI Generation failed. Using defaults.");
  }

  s.stop('AI Metadata generated.');

  // 3. Scaffolding
  const fullPackageName = `@monorepo/${layerName}`;
  const targetDir = path.resolve(process.cwd(), 'layers', layerName as string);
  const author = "Steve R Lewis"; // You could pull this from git config if desired

  // Date Helpers
  const now = new Date();
  const dateStr = now.toLocaleDateString('en-CA', { year: 'numeric', month: 'short', day: '2-digit' }).replace(/ /g, ' '); // YYYY MMM DD
  const timeStr = now.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
  const year = now.getFullYear();
  const revCode = now.toISOString().replace(/[-:T]/g, '').slice(0, 8) + '-' + timeStr.replace(':', '');

  // JSDoc Wrapper Helper
  const wrapText = (text: string, maxLen = 75, prefix = ' * ') => {
    const words = text.split(' ');
    let line = prefix;
    let result = '';
    for (const word of words) {
      if ((line + word).length > maxLen) {
        result += line + '\n';
        line = prefix + word + ' ';
      } else {
        line += word + ' ';
      }
    }
    return result + line.trimEnd();
  };

  const jsDocBlock = wrapText(metadata.jsdoc);

  try {
    await fs.mkdir(targetDir, { recursive: true });

    // --- Template: package.json ---
    const pkgJson = {
      name: fullPackageName,
      version: "1.0.0",
      description: metadata.pkgJson,
      private: true,
      type: "module",
      main: "./nuxt.config.ts",
      exports: {
        ".": {
          types: "./tsconfig.json",
          import: "./nuxt.config.ts"
        }
      }
    };

    // --- Template: nuxt.config.ts ---
    const nuxtConfig = `/**
 * ================================================================================
 * @project:    ${fullPackageName}
 * @file:       ~/layers/${layerName}/nuxt.config.ts
 * @version:    1.0.0
 * @createDate: ${dateStr}
 * @createTime: ${timeStr}
 * @author:     ${author}
 * ================================================================================
 * @description:
${jsDocBlock}
 * ================================================================================
 * @notes: Revision History
 * V1.0.0, ${revCode}
 * Initial creation and release of nuxt.config.ts
 * ================================================================================
 */
export default defineNuxtConfig({
  compatibilityDate: "2025-10-08",
  devtools: { enabled: true },
  extends: []
})
`;

    // --- Template: LICENSE ---
    const license = `Copyright ${year} ${author}

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files...
(The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.)
THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED...`;

    // --- Template: README.md ---
    const readme = `# ${fullPackageName}

${metadata.readme}
`;

    // --- Template: tsconfig.json ---
    const tsconfig = `{
  "extends": "../../.nuxt/tsconfig.json"
}`;

    // --- Template: .gitignore ---
    const gitignore = `# =============================================
# 1. Package Managers & Dependency Stores
# =============================================
**/.git
**/node_modules/
`;

    // Write Files
    await fs.writeFile(path.join(targetDir, 'package.json'), JSON.stringify(pkgJson, null, 2));
    await fs.writeFile(path.join(targetDir, 'nuxt.config.ts'), nuxtConfig);
    await fs.writeFile(path.join(targetDir, 'LICENSE'), license);
    await fs.writeFile(path.join(targetDir, 'README.md'), readme);
    await fs.writeFile(path.join(targetDir, 'tsconfig.json'), tsconfig);
    await fs.writeFile(path.join(targetDir, '.gitignore'), gitignore);

    consola.success(`Layer created successfully at: ${pc.cyan(targetDir)}`);

  } catch (err: any) {
    consola.error(`Scaffolding failed: ${err.message}`);
  }
}
