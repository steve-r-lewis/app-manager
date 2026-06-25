/**
 * ================================================================================
 *
 * @project:    app-manager
 * @file:       ~/app/strategies/typescriptStrategy.ts
 * @version:    1.0.0
 * @createDate: 2026 Jan 11
 * @createTime: 01:01
 * @author:     Steve R Lewis
 *
 * ================================================================================
 *
 * @description:
 * Strategy for parsing and manipulating TypeScript/JavaScript files.
 *
 * ================================================================================
 *
 * @notes: Revision History
 *
 * V1.0.0, 20260111-01:01
 * Initial creation and release of typescriptStrategy.ts
 *
 * ================================================================================
 */

import type { ICodeStrategy, CodeFileMetadata, CodeBlock, CodeBlockType } from '../types/index.js';

// Type Guard for validation
function isCodeBlockType(value: string): value is CodeBlockType {
	return ['function', 'method', 'class', 'interface', 'variable', 'const'].includes(value);
}

export class TypescriptStrategy implements ICodeStrategy {
	
	/**
	 * Extracts metadata like version and author from JSDoc comments.
	 * Fixes: Now handles messy whitespace, tabs, and alignment asterisks.
	 */
	parseMetadata(content: string): { version?: string; author?: string } {
		const metadata: { version?: string; author?: string } = {};
		
		const versionMatch = content.match(/@version\s*:?\s*([^\s*]+)/i);
		if (versionMatch) {
			metadata.version = versionMatch[1];
		}
		
		const authorMatch = content.match(/@author\s*:?\s*(.+)/i);
		if (authorMatch) {
			metadata.author = authorMatch[1].trim();
		}
		
		return metadata;
	}
	
	/**
	 * Injects or replaces the file header.
	 * Fixes: Detects Shebang (#!...) lines and inserts header AFTER them.
	 */
	injectHeader(content: string, header: string): string {
		let finalContent = content;
		let shebang = '';
		
		// 1. Check for Shebang (must be the very first chars)
		if (content.startsWith('#!')) {
			const firstNewlineIndex = content.indexOf('\n');
			if (firstNewlineIndex !== -1) {
				// Extract the shebang line (including the newline)
				shebang = content.substring(0, firstNewlineIndex + 1);
				// Remove shebang from the content we are about to process
				finalContent = content.substring(firstNewlineIndex + 1);
			}
		}
		
		// 2. Remove existing top-level JSDoc header if it exists
		// This regex looks for a comment block at the start of the (potentially stripped) content
		// \s* eats up any empty lines between the old header and code
		finalContent = finalContent.replace(/^\s*\/\*\*[\s\S]*?\*\/\s*/, '');
		
		// 3. Reconstruct: Shebang + Header + Code
		// Ensure exactly one newline after header
		// return `${shebang}${header}\n${finalContent}`;
		
		return `${shebang}${header}\n\n${finalContent.trimStart()}`;
		
	}
	
	public findDocumentableBlocks(content: string): CodeBlock[] {
		const blocks: CodeBlock[] = [];
		const lines = content.split('\n');
		
		// Regex: export [async] [type] [name]
		const regex = /export\s+((?:default\s+|async\s+)*)(const|function|class|interface)\s+(\w+)/g;
		
		let match;
		while ((match = regex.exec(content)) !== null) {
			const index = match.index;
			const lineNum = content.substring(0, index).split('\n').length - 1;
			const rawType = match[2];
			
			// Normalise 'const' to 'variable'
			const type: CodeBlockType = rawType === 'const' ? 'variable' : (rawType as CodeBlockType);
			
			// Check for existing docs
			let hasDoc = false;
			for (let i = lineNum - 1; i >= 0; i--) {
				const line = lines[i].trim();
				if (!line) continue;
				if (line.endsWith('*/')) { hasDoc = true; break; }
				break;
			}
			
			if (isCodeBlockType(type) || rawType === 'const') {
				blocks.push({
					name: match[3],
					type: type,
					startLine: lineNum,
					endLine: lineNum,
					signature: match[0],
					hasDoc
				});
			}
		}
		return blocks;
	}
	
	public injectFunctionDoc(content: string, functionName: string, docBlock: string): string {
		const lines = content.split('\n');
		
		const targetIdx = lines.findIndex(l =>
			l.match(new RegExp(`export\\s+(?:(?:default|async)\\s+)*(?:const|function|class|interface)\\s+${functionName}\\b`))
		);
		
		if (targetIdx === -1) return content;
		
		// Match indentation
		const targetLine = lines[targetIdx];
		const indentation = targetLine.match(/^\s*/)?.[0] || '';
		
		const indentedDoc = docBlock
			.split('\n')
			.map(line => indentation + line)
			.join('\n');
		
		lines.splice(targetIdx, 0, indentedDoc);
		return lines.join('\n');
	}
}