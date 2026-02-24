/**
 * ================================================================================
 *
 * @project:    app-manager
 * @file:       ~/app/scanners/vueScanner.ts
 * @version:    1.0.3
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
 * V1.0.3, 20260115-21:18
 * Final strict implementation based on Master Specification and Tool Kit architecture.
 * - Decomposed logic into flat, atomic tools (isRootTagStart, extractBlock).
 * - Fixed: Correctly handles HtmlScanner's token emission for closing tags (TagOpen '</').
 * - Fixed: Implemented strict type guards and attribute parsing as per spec.
 * - Added support for self-closing root blocks (e.g. <script ... />).
 *
 * V1.0.2, 20260115-20:20
 * Refactored to "Tool Kit" pattern (reduced cyclomatic complexity).*
 *
 * V1.0.1, 20260115
 * Refactored to fix parsing logic flaws.
 * - Added depth tracking to support nested <template> tags.
 * - Added support for self-closing root blocks (e.g., <script src="..." />).
 * - Fixed attribute scanning loop to recognize TagSelfClose.
 * - Improved type safety for SfcBlock.type.
 *
 * V1.0.0, 20260112-23:42
 * Initial creation and release of vueScanner.ts
 *
 * ================================================================================
 */

import { HtmlScanner } from './htmlScanner.js';
import type { Token, SfcBlock, HtmlTokenType } from '../types/index.js';

// Strict type definition for root tags as per Spec 4.2 Recommendation
type SfcRootType = 'script' | 'template' | 'style';
const ROOT_TAGS = new Set<string>(['script', 'template', 'style']);

export class VueScanner extends HtmlScanner {
	
	/**
	 * Primary Tool: Scans the Vue file and returns the high-level SFC blocks.
	 * This orchestrates the smaller tools to produce the structural map.
	 */
	public scanSfcBlocks(): SfcBlock[] {
		// Phase 1: Tokenization (Inherited)
		const tokens = this.scan();
		const blocks: SfcBlock[] = [];
		
		// Phase 2: Iterative Block Detection
		for (let i = 0; i < tokens.length; i++) {
			const token = tokens[i];
			
			// A. Detect Opening Tag
			if (!this.isRootTagStart(token, tokens, i)) {
				continue;
			}
			
			// Extract the full block using the Tool Kit
			const blockResult = this.extractBlock(tokens, i);
			
			if (blockResult) {
				blocks.push(blockResult.block);
				// Fast-forward to the end of this block to resume scanning
				i = blockResult.endIndex;
			}
		}
		
		return blocks;
	}
	
	// --- Identification Tools ---
	
	/**
	 * Tool: Checks if the current token is the start of a valid root block.
	 * Corresponds to Spec Phase 2.A.
	 */
	private isRootTagStart(token: Token<HtmlTokenType>, tokens: Token<HtmlTokenType>[], index: number): boolean {
		if (token.type !== 'TagOpen') return false;
		
		// Look ahead for the TagName
		const nextToken = tokens[index + 1];
		if (!nextToken || nextToken.type !== 'TagName') return false;
		
		return ROOT_TAGS.has(nextToken.value.toLowerCase());
	}
	
	// --- Extraction Tools ---
	
	/**
	 * Tool: Extracts a single SFC block starting at the given index.
	 * Orchestrates attribute scanning and content boundary detection.
	 * Returns the block and the index where the block ends.
	 */
	private extractBlock(tokens: Token<HtmlTokenType>[], startIndex: number): { block: SfcBlock, endIndex: number } | null {
		// 1. Identify Block Identity
		const nameToken = tokens[startIndex + 1];
		const blockType = nameToken.value.toLowerCase() as SfcRootType;
		const tagStartIndex = tokens[startIndex].start.index;
		
		// 2. Extract Attributes (Spec Phase 2.B)
		const { attributes, contentStartTokenIndex, isSelfClosing } = this.scanBlockAttributes(tokens, startIndex + 2);
		
		// Handle Self-Closing (e.g., <script src="..." />)
		if (isSelfClosing) {
			const closeToken = tokens[contentStartTokenIndex]; // The /> or > token
			const closeIndex = closeToken.end.index;
			
			return {
				block: this.createBlock(
					blockType,
					'', // Empty content
					tagStartIndex,
					closeIndex,
					attributes,
					closeToken.start.index, // "Point" content
					closeToken.start.index
				),
				endIndex: contentStartTokenIndex
			};
		}
		
		// 3. Mark Content Start (Spec Phase 2.C)
		const contentStartToken = tokens[contentStartTokenIndex]; // The > token
		if (!contentStartToken) return null; // EOF safety
		
		const contentStartIndex = contentStartToken.end.index;
		// Spec: loc.start is "Opening tag end" (which is contentStartIndex)
		
		// 4. Find Matching Closing Tag (Spec Phase 2.D)
		const closingIndex = this.findMatchingClosingTag(tokens, contentStartTokenIndex + 1, blockType);
		if (closingIndex === -1) return null; // Malformed/Unclosed block
		
		const closingTokenStart = tokens[closingIndex]; // The </ token
		const contentEndIndex = closingTokenStart.start.index;
		
		// 5. Construct Block
		// Find the actual end of the closing tag (>) for the window 'tagEnd'
		const closingTagEndIndex = this.findTagEndIndex(tokens, closingIndex);
		const content = this.source.substring(contentStartIndex, contentEndIndex);
		
		return {
			block: this.createBlock(
				blockType,
				content,
				tagStartIndex,
				closingTagEndIndex,
				attributes,
				contentStartIndex,
				contentEndIndex
			),
			endIndex: closingTagEndIndex // Resume main loop after this block
		};
	}
	
	/**
	 * Tool: Scans attributes until the tag closes.
	 * Implements Spec Phase 2.B: "Collect AttributeName... Detect optional ="
	 */
	private scanBlockAttributes(tokens: Token<HtmlTokenType>[], startIndex: number): { attributes: Record<string, string | boolean>, contentStartTokenIndex: number, isSelfClosing: boolean } {
		const attributes: Record<string, string | boolean> = {};
		let i = startIndex;
		
		while (i < tokens.length) {
			const t = tokens[i];
			
			// Boundary checks
			if (t.type === 'TagClose') { // >
				return { attributes, contentStartTokenIndex: i, isSelfClosing: false };
			}
			if (t.type === 'TagSelfClose') { // />
				return { attributes, contentStartTokenIndex: i, isSelfClosing: true };
			}
			
			if (t.type === 'AttributeName') {
				const name = t.value;
				let value: string | boolean = true; // Default to true (boolean attribute)
				
				// Lookahead for Equals and Value
				if (tokens[i + 1]?.type === 'Equals' && tokens[i + 2]?.type === 'AttributeValue') {
					// Spec: "string for valued attributes"
					value = this.stripQuotes(tokens[i + 2].value);
					i += 2; // Consume = and Value
				}
				
				attributes[name] = value;
			}
			i++;
		}
		
		return { attributes, contentStartTokenIndex: i, isSelfClosing: false };
	}
	
	/**
	 * Tool: Locates the matching closing tag.
	 * Implements Spec Phase 2.D with nested depth tracking for <template>.
	 */
	private findMatchingClosingTag(tokens: Token<HtmlTokenType>[], startIndex: number, tagName: string): number {
		let depth = 0;
		
		for (let i = startIndex; i < tokens.length; i++) {
			const t = tokens[i];
			
			// Nested <template> check (Spec 2.3 implied/Structure requirement)
			if (tagName === 'template' && t.type === 'TagOpen' && t.value !== '</') {
				if (tokens[i + 1]?.type === 'TagName' && tokens[i + 1].value.toLowerCase() === 'template') {
					depth++;
				}
			}
			
			// Detect Closing Tag: TagOpen with value '</'
			// (Note: HtmlScanner emits TagOpen '</' for closing tags, not TagClose type)
			if (t.type === 'TagOpen' && t.value === '</') {
				if (tokens[i + 1]?.type === 'TagName' && tokens[i + 1].value.toLowerCase() === tagName) {
					if (depth === 0) {
						return i; // Found our closing tag
					}
					depth--;
				}
			}
		}
		
		return -1;
	}
	
	/**
	 * Tool: Scans forward from the start of a closing tag (</) to find the end (>).
	 */
	private findTagEndIndex(tokens: Token<HtmlTokenType>[], closingTagStartIndex: number): number {
		for (let i = closingTagStartIndex; i < tokens.length; i++) {
			if (tokens[i].type === 'TagClose') {
				return tokens[i].end.index;
			}
		}
		return tokens[closingTagStartIndex].end.index; // Fallback
	}
	
	// --- Helpers ---
	
	private createBlock(
		type: SfcRootType,
		content: string,
		tagStart: number,
		tagEnd: number,
		attributes: Record<string, string | boolean>,
		contentStart: number,
		contentEnd: number
	): SfcBlock {
		return {
			type,
			content,
			start: contentStart,
			end: contentEnd,
			tagStart,
			tagEnd,
			attributes,
			loc: {
				// Approximate SourceLocation reconstruction based on indices
				// In a full implementation, we would extract exact line/col from tokens
				start: { line: 0, column: 0, index: contentStart },
				end: { line: 0, column: 0, index: contentEnd }
			}
		};
	}
	
	private stripQuotes(value: string): string {
		if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
			return value.slice(1, -1);
		}
		return value;
	}
}