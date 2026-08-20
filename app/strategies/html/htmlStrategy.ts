/**
 * ================================================================================
 *
 * @project:    app-manager
 * @file:       ~/app/strategies/html/htmlStrategy.ts
 * @version:    1.2.0
 * @createDate: 2026 Jan 11
 * @createTime: 15:05
 * @author:     Steve R Lewis
 *
 * ================================================================================
 *
 * @description:
 * Strategy for parsing and manipulating HTML files.
 *
 * ================================================================================
 *
 * @notes: Revision History
 *
 * V1.2.0, 20260820
 * Fixed readonly metadata mutation: build a new object instead of assigning
 * to CodeFileMetadata's readonly fields.
 *
 * V1.1.0, 20260112-00:30
 * Fixed regex patterns for parseMetadata and injectHeader to properly handle
 * HTML comments with @version and @author tags.
 *
 * V1.0.0, 20260111-15:05
 * Initial creation and release of htmlStrategy.ts
 *
 * ================================================================================
 */

import type { ICodeStrategy, CodeFileMetadata, CodeBlock } from '../../types/index.js';

export class HtmlStrategy implements ICodeStrategy {

	public parseMetadata(content: string): CodeFileMetadata {
		// Match only HTML comments at the top or anywhere
		const commentRegex = /<!--([\s\S]*?)-->/g;
		const match = commentRegex.exec(content);

		if (!match) {
			return {};
		}

		const commentBody = match[1];

		const versionMatch = commentBody.match(/@version\s*:\s*([^\n\r]+)/i);
		const authorMatch = commentBody.match(/@author\s*:\s*([^\n\r]+)/i);

		// Build the object in one shot instead of mutating readonly fields.
		const metadata: CodeFileMetadata = {
			version: versionMatch ? versionMatch[1].trim() : undefined,
			author: authorMatch ? authorMatch[1].trim() : undefined
		};

		return metadata;
	}

	public injectHeader(content: string, headerText: string): string {
		const header = `<!--\n${headerText.trim()}\n-->`;

		// Match leading whitespace + an HTML comment
		const topCommentRegex = /^\s*<!--[\s\S]*?-->/;

		if (topCommentRegex.test(content)) {
			// Replace existing top comment
			return content.replace(topCommentRegex, header);
		}

		// Otherwise prepend
		return `${header}\n\n${content}`;
	}

	public findDocumentableBlocks(_: string): CodeBlock[] {
		return [];
	}

	public injectFunctionDoc(content: string): string {
		return content;
	}
}
