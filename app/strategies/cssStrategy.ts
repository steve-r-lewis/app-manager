/**
 * ================================================================================
 *
 * @project:    app-manager
 * @file:       ~/app/strategies/cssStrategy.ts
 * @version:    1.0.0
 * @createDate: 2026 Jan 11
 * @createTime: 15:04
 * @author:     Steve R Lewis
 *
 * ================================================================================
 *
 * @description:
 * Strategy for parsing and manipulating CSS files.
 *
 * ================================================================================
 *
 * @notes: Revision History
 *
 * V1.0.0, 20260111-15:04
 * Initial creation and release of cssStrategy.ts
 *
 * ================================================================================
 */

import type { ICodeStrategy, CodeFileMetadata, CodeBlock } from '../types/index.js';

export class CssStrategy implements ICodeStrategy {
	
	public parseMetadata(content: string): CodeFileMetadata {
		const metadata: CodeFileMetadata = {};
		
		const extract = (tag: string): string | undefined => {
			// Match optional colon, optional whitespace, then capture until @, *, or newline
			const regex = new RegExp(
				`@${tag}\\s*:??\\s*([^@*\\n\\r]+)`,
				'i'
			);
			const match = content.match(regex);
			// Trim to remove accidental leading/trailing whitespace
			return match?.[1].replace(/^[:\s]+/, '').trim();
		};
		
		metadata.version = extract('version');
		metadata.author = extract('author');
		
		const descMatch = content.match(
			/@description\s*:??\s*([\s\S]*?)(?=\n\s*\*?\s*@|\*\/)/i
		);
		
		if (descMatch?.[1]) {
			metadata.description = descMatch[1]
				.replace(/\n\s*\*\s*/g, ' ')
				.trim();
		}
		
		return metadata;
	}
	
	public injectHeader(content: string, headerText: string): string {
		let finalContent = content;
		let charsetLine = '';
		
		// 1. Preserve @charset (Must be first line)
		const charsetMatch = content.match(/^@charset\s+["'][^"']+["'];?\s*/i);
		if (charsetMatch) {
			charsetLine = charsetMatch[0].trim();
			finalContent = finalContent.substring(charsetMatch[0].length);
		}
		
		const cleanHeaderText = headerText.replace(/^\/\*|\*\/$/g, '').trim();
		const formattedHeader = `/*\n${cleanHeaderText.split('\n').map(l => ' * ' + l).join('\n')}\n */`;
		
		finalContent = finalContent.replace(/^\s*\/\*[\s\S]*?\*\/\s*/, '');
		
		const prefix = charsetLine ? `${charsetLine}\n\n` : '';
		return `${prefix}${formattedHeader}\n\n${finalContent.trimStart()}`;
	}
	
	public findDocumentableBlocks(content: string): CodeBlock[] {
		const blocks: CodeBlock[] = [];
		const lines = content.split('\n');
		
		let buffer = '';
		let bufferStartLine = 0;
		
		for (let i = 0; i < lines.length; i++) {
			const rawLine = lines[i];
			const line = rawLine.trim();
			
			// Skip empty lines and comment-only lines
			if (!line || line.startsWith('/*')) continue;
			
			// Start buffering if this is a new selector
			if (!buffer) bufferStartLine = i;
			
			buffer += (buffer ? ' ' : '') + line;
			
			// Detect block start
			if (line.includes('{')) {
				let selectorPart: string;
				
				// Special handling for @keyframes:
				// We MUST stop at the FIRST `{`, not the last,
				// otherwise inner frames ("from {") pollute the name.
				if (buffer.startsWith('@keyframes')) {
					selectorPart = buffer.substring(0, buffer.indexOf('{')).trim();
				} else {
					// Normal selectors may legally contain spaces and commas
					selectorPart = buffer.substring(0, buffer.lastIndexOf('{')).trim();
				}
				
				// Validate selector
				const isAtRule = selectorPart.startsWith('@');
				const isKeyframes = selectorPart.startsWith('@keyframes');
				
				// Ignore container at-rules but allow @keyframes
				if (!isAtRule || isKeyframes) {
					// Detect preceding documentation block
					let hasDoc = false;
					for (let j = bufferStartLine - 1; j >= 0; j--) {
						const prev = lines[j].trim();
						if (!prev) continue;
						if (prev.endsWith('*/')) hasDoc = true;
						break;
					}
					
					blocks.push({
						name: selectorPart,
						type: 'variable',
						startLine: bufferStartLine,
						endLine: i,
						signature: selectorPart,
						hasDoc
					});
				}
				
				// Reset buffer — body contents are irrelevant
				buffer = '';
				continue;
			}
			
			// Safety: clear buffer if a block closes unexpectedly
			if (line.includes('}')) {
				buffer = '';
			}
		}
		
		return blocks;
	}
	
	public injectFunctionDoc(content: string, functionName: string, docBlock: string): string {
		const lines = content.split('\n');
		
		const targetIdx = lines.findIndex(l => {
			const trimmed = l.trim();
			if (trimmed === `${functionName} {`) return true;
			if (trimmed.replace(/\s+/g, ' ') === `${functionName} {`) return true;
			return false;
		});
		
		if (targetIdx === -1) return content;
		
		const indentation = lines[targetIdx].match(/^\s*/)?.[0] || '';
		let cleanDoc = docBlock.trim();
		if (!cleanDoc.startsWith('/*')) cleanDoc = `/* ${cleanDoc} */`;
		
		const indentedDoc = cleanDoc
			.split('\n')
			.map(line => indentation + line)
			.join('\n');
		
		lines.splice(targetIdx, 0, indentedDoc);
		return lines.join('\n');
	}
}