/**
 * ================================================================================
 *
 * @project:    app-manager
 * @file:       ~/app/strategies/css/cssStrategy.ts
 * @version:    1.1.0
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
 * V1.1.0, 20260820
 * - Fixed readonly metadata mutation: build a new object instead of assigning
 *   to CodeFileMetadata's readonly fields.
 * - Added required 'id', 'range', and 'content' fields to CodeBlock objects
 *   pushed from findDocumentableBlocks (CodeBlock requires them).
 *
 * V1.0.0, 20260111-15:04
 * Initial creation and release of cssStrategy.ts
 *
 * ================================================================================
 */

import type { ICodeStrategy, CodeFileMetadata, CodeBlock } from '../../types/index.js';

export class CssStrategy implements ICodeStrategy {

	public parseMetadata(content: string): CodeFileMetadata {
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

		const descMatch = content.match(
			/@description\s*:??\s*([\s\S]*?)(?=\n\s*\*?\s*@|\*\/)/i
		);

		const description = descMatch?.[1]
			? descMatch[1].replace(/\n\s*\*\s*/g, ' ').trim()
			: undefined;

		// Build the object in one shot instead of mutating readonly fields.
		const metadata: CodeFileMetadata = {
			version: extract('version'),
			author: extract('author'),
			description
		};

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

					const startLine = bufferStartLine;
					const endLine = i;
					const blockContent = lines.slice(startLine, endLine + 1).join('\n');

					blocks.push({
						id: `css:${selectorPart}:${startLine}`,
						name: selectorPart,
						type: 'variable',
						startLine,
						endLine,
						range: [startLine, endLine],
						signature: selectorPart,
						hasDoc,
						content: blockContent
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
