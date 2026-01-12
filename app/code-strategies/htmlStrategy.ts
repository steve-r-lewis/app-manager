/**
 * ================================================================================
 *
 * @project:    app-manager
 * @file:       ~/app/code-strategies/htmlStrategy.ts
 * @version:    1.1.0
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
 * V1.1.0, 20260112-00:30
 * Fixed regex patterns for parseMetadata and injectHeader to properly handle
 * HTML comments with @version and @author tags.
 *
 * V1.0.0, 20260111-15:05
 * Initial creation and release of htmlStrategy.ts
 *
 * ================================================================================
 */

import type { ICodeStrategy, CodeFileMetadata, CodeBlock } from '../types/index';

export class HtmlStrategy implements ICodeStrategy {
	
	public parseMetadata(content: string): CodeFileMetadata {
		const metadata: CodeFileMetadata = {};
		
		// Match only HTML comments at the top or anywhere
		const commentRegex = /<!--([\s\S]*?)-->/g;
		const match = commentRegex.exec(content);
		
		if (!match) {
			return metadata;
		}
		
		const commentBody = match[1];
		
		const versionMatch = commentBody.match(/@version\s*:\s*([^\n\r]+)/i);
		const authorMatch = commentBody.match(/@author\s*:\s*([^\n\r]+)/i);
		
		if (versionMatch) {
			metadata.version = versionMatch[1].trim();
		}
		
		if (authorMatch) {
			metadata.author = authorMatch[1].trim();
		}
		
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
