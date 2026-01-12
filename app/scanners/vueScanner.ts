/**
 * ================================================================================
 *
 * @project:    app-manager
 * @file:       ~/app/scanners/vueScanner.ts
 * @version:    1.0.0
 * @createDate: 2026 Jan 12
 * @createTime: 23:42
 * @author:     Steve R Lewis
 *
 * ================================================================================
 *
 * @description:
 * The Vue SFC (Single File Component) Scanner.
 *
 * Responsibilities:
 * - Extends the HtmlScanner to parse the high-level structure of .vue files.
 * - Identifies and extracts the three primary Root Blocks: <script>, <template>, <style>.
 * - Parses block attributes (e.g., 'setup', 'lang', 'scoped') into a usable structure.
 * - Returns 'SfcBlock' objects that define the "Window" for other scanners to operate on.
 *
 * This allows the VueStrategy to easily delegate:
 * - <script> content -> TypescriptScanner
 * - <style> content -> CssScanner
 * - <template> content -> HtmlScanner (for analyzing structure)
 *
 * ================================================================================
 *
 * @notes: Revision History
 *
 * V1.0.0, 20260112-23:42
 * Initial creation and release of vueScanner.ts
 *
 * ================================================================================
 */

import { HtmlScanner } from './htmlScanner';
import type { Token, SourceLocation, SfcBlock } from '../types/index';

export class VueScanner extends HtmlScanner {
	
	/**
	 * Scans the Vue file and returns the high-level SFC blocks.
	 * This is the primary entry point for the VueStrategy.
	 */
	public scanSfcBlocks(): SfcBlock[] {
		const tokens = this.scan();
		const blocks: SfcBlock[] = [];
		
		let currentTag: string | null = null;
		let currentAttributes: Record<string, string | boolean> = {};
		let tagStartIndex: number = 0;
		let contentStartIndex: number = 0;
		let contentStartLoc: SourceLocation | null = null;
		
		// Iterate tokens to assemble blocks
		for (let i = 0; i < tokens.length; i++) {
			const token = tokens[i];
			
			// 1. Detect Block Start
			if (token.type === 'TagOpen') {
				// Look ahead for the TagName
				if (i + 1 < tokens.length && tokens[i + 1].type === 'TagName') {
					const tagNameToken = tokens[i + 1];
					const tagName = tagNameToken.value.toLowerCase();
					
					// We only care about top-level blocks
					if (['script', 'template', 'style'].includes(tagName)) {
						currentTag = tagName;
						tagStartIndex = token.start.index;
						currentAttributes = {};
						
						// Collect Attributes until we hit the closing '>' of the opening tag
						let j = i + 2;
						while (j < tokens.length && tokens[j].type !== 'TagClose') {
							if (tokens[j].type === 'AttributeName') {
								const attrName = tokens[j].value;
								let attrValue: string | boolean = true;
								
								// Check if next token is =, then Value
								if (j + 2 < tokens.length && tokens[j + 1].type === 'Equals') {
									if (tokens[j + 2].type === 'AttributeValue') {
										attrValue = tokens[j + 2].value;
										j += 2; // Skip = and Value
									}
								}
								currentAttributes[attrName] = attrValue;
							}
							j++;
						}
						
						// Move main loop index to the end of the opening tag
						i = j;
						
						// The content starts immediately after the >
						if (tokens[i].type === 'TagClose') {
							contentStartIndex = tokens[i].end.index;
							contentStartLoc = tokens[i].end; // Approximate, but good enough for block tracking
						}
					}
				}
				continue;
			}
			
			// 2. Capture Content (Text)
			// The HtmlScanner emits "Text" tokens for the body of script/style/template
			if (currentTag && token.type === 'Text') {
				// We defer content capture until the closing tag to ensure we get the full range
				continue;
			}
			
			// 3. Detect Block End
			if (currentTag && token.type === 'TagClose' && token.value === '</') {
				// Check if this closing tag matches our current block
				if (i + 1 < tokens.length && tokens[i + 1].type === 'TagName') {
					if (tokens[i + 1].value.toLowerCase() === currentTag) {
						
						// Found the closing tag for our active block
						const closingTagStart = token.start.index;
						const contentEndIndex = closingTagStart;
						
						// Extract the full raw content from source
						const content = this.source.substring(contentStartIndex, contentEndIndex);
						
						blocks.push({
							type: currentTag as any,
							content: content,
							start: contentStartIndex,
							end: contentEndIndex,
							tagStart: tagStartIndex,
							tagEnd: tokens[i + 2]?.end.index || closingTagStart, // approximate end of >
							attributes: currentAttributes,
							loc: {
								start: contentStartLoc || token.start,
								end: token.start
							}
						});
						
						// Reset
						currentTag = null;
						currentAttributes = {};
					}
				}
			}
		}
		
		return blocks;
	}
}