/**
 * ================================================================================
 *
 * @project:    app-manager
 * @file:       ~/app/templates/languages/readmeTemplate.ts
 * @version:    1.0.1
 * @createDate: 2026 Jan 01
 * @createTime: 21:28
 * @author:     Steve R Lewis
 *
 * ================================================================================
 *
 * @description:
 * The README.md Template Generator.
 *
 * This template produces the primary documentation file for projects. It
 * intelligently adapts the content based on the project type (root vs. layer).
 *
 * ================================================================================
 *
 * @notes: Revision History
 *
 * V1.0.1, 20260820
 * No code changes needed here — this file already imports ReadmeContext
 * correctly. The compile error ('description' does not exist on
 * ReadmeContext) is fixed upstream by adding 'description?: string' to
 * ReadmeContext in templateTypes.ts — see the small patch note I gave
 * separately.
 *
 * V1.0.0, 20260101-21:28
 * Initial creation and release of readmeTemplate.ts
 *
 * ================================================================================
 */

import type { ReadmeContext, TemplateFunction } from '../../types/index.js';

/**
 * Generates a formatted Markdown string for README.md.
 */
export const readmeTemplate: TemplateFunction<ReadmeContext, string> = (ctx) => {
	const isRoot = ctx.target === 'root';

	// 1. Calculate Name (Scope logic) - consistent with packageJsonTemplate
	const packageName = isRoot
		? ctx.projectName
		: ctx.projectName.startsWith('@monorepo/')
			? ctx.projectName
			: `@monorepo/${ctx.projectName}`;

	const description = ctx.description || 'No description provided.';
	const year = ctx.year || new Date().getFullYear().toString();
	const author = ctx.author || 'Maintainer';

	// --------------------------------------------------------------------------
	// Section: Header
	// --------------------------------------------------------------------------
	let content = `# ${packageName}\n\n${description}\n\n`;

	// --------------------------------------------------------------------------
	// Section: Features (Optional)
	// --------------------------------------------------------------------------
	if (ctx.features && ctx.features.length > 0) {
		content += `## Features\n\n`;
		content += ctx.features.map(f => `- ${f}`).join('\n') + '\n\n';
	}

	// --------------------------------------------------------------------------
	// Section: Requirements / Prerequisites
	// --------------------------------------------------------------------------
	const requirements = ctx.requirements || ['Node.js >= 20.0.0', 'pnpm >= 9.0.0'];
	content += `## Prerequisites\n\n`;
	content += requirements.map(r => `- ${r}`).join('\n') + '\n\n';

	// --------------------------------------------------------------------------
	// Section: Instructions (Context Aware)
	// --------------------------------------------------------------------------
	if (isRoot) {
		content += `## Setup\n\n`;
		content += `Make sure to install the dependencies:\n\n`;
		content += `\`\`\`bash\n# Install dependencies\npnpm install\n\`\`\`\n\n`;

		content += `## Development\n\n`;
		content += `Start the development server on \`http://localhost:3000\`:\n\n`;
		content += `\`\`\`bash\npnpm dev\n\`\`\`\n\n`;

		content += `## Build\n\n`;
		content += `Build the application for production:\n\n`;
		content += `\`\`\`bash\npnpm build\n\`\`\`\n\n`;
	} else {
		content += `## Installation\n\n`;
		content += `To use this layer in your Nuxt application, add it to your \`nuxt.config.ts\`:\n\n`;
		content += `\`\`\`typescript\nexport default defineNuxtConfig({\n  extends: [\n    "${packageName}"\n  ]\n})\n\`\`\`\n\n`;
	}

	// --------------------------------------------------------------------------
	// Section: Footer
	// --------------------------------------------------------------------------
	content += `## License\n\n`;
	content += `[MIT](./LICENSE) License © ${year}-PRESENT ${author}`;

	return content;
};
