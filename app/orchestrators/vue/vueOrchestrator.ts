/**
 * ================================================================================
 *
 * @project:    app-manager
 * @file:       ~/app/orchestrators/vue/vueOrchestrator.ts
 * @version:    1.0.0
 * @createDate: 2026 Jan 11
 * @createTime: 00:59
 * @author:     Steve R Lewis
 *
 * ================================================================================
 *
 * @description:
 * Strategy for parsing Vue Single File Components (SFC).
 * Handles <script setup> blocks and delegates to TypescriptStrategy.
 *
 * ================================================================================
 *
 * @notes: Revision History
 *
 * V1.1.0, 20260820
 * Moved from app/orchestrators/vue/vueOrchestrator.ts to
 * app/strategies/vue/vueStrategy.ts, to match the folder/naming pattern
 * every other strategy (css, html, json, typescript) already follows.
 * No logic changed — only this file's own location and its relative
 * import path to TypescriptStrategy (one level shallower from here).
 * baseStrategy.ts's import of VueStrategy was updated to match.
 *
 * V1.0.0, 20260111-00:59
 * Initial creation and release of vueStrategy.ts
 *
 * ================================================================================
 */

import type { ICodeStrategy, CodeFileMetadata, CodeBlock } from '../../types/index.js';
import { TypescriptStrategy } from '../../strategies/typescript/typescriptStrategy.js';

export class VueStrategy implements ICodeStrategy {
	// Composition: We strictly reuse the TS strategy for the script block
	private tsStrategy = new TypescriptStrategy();

	// --- Helper: Extract script content and its location ---
	private extractScript(content: string): { text: string; startLine: number; tag: string } | null {
		// Priority 1: <script setup> (Modern Vue)
		let match = content.match(/(<script\s+setup[^>]*>)([\s\S]*?)(<\/script>)/);
		if (match) {
			const startLine = content.substring(0, match.index!).split('\n').length - 1;
			return { text: match[2], startLine, tag: match[0] };
		}

		// Priority 2: Standard <script> (Legacy/Options API)
		match = content.match(/(<script[^>]*>)([\s\S]*?)(<\/script>)/);
		if (match) {
			const startLine = content.substring(0, match.index!).split('\n').length - 1;
			return { text: match[2], startLine, tag: match[0] };
		}

		return null;
	}

	/**
	 * Extracts metadata by checking inside the <script> tag.
	 */
	public parseMetadata(content: string): CodeFileMetadata {
		const script = this.extractScript(content);
		if (!script) return {};
		// Delegate to TS Strategy
		return this.tsStrategy.parseMetadata(script.text);
	}

	/**
	 * Injects the header comment.
	 * Smart Placement: Puts it INSIDE the <script> tag, not at the top of the file.
	 */
	public injectHeader(content: string, headerText: string): string {
		const script = this.extractScript(content);

		if (script) {
			// 1. Let TS Strategy handle the comment injection logic on the script text
			const newScriptBody = this.tsStrategy.injectHeader(script.text, headerText);

			// 2. Re-match the tag to replace the body cleanly
			let match = content.match(/(<script\s+setup[^>]*>)([\s\S]*?)(<\/script>)/);
			if (!match) match = content.match(/(<script[^>]*>)([\s\S]*?)(<\/script>)/);

			if (match) {
				const [fullMatch, openTag, body, closeTag] = match;
				// 3. Replace the original block with the modified block
				return content.replace(fullMatch, `${openTag}${newScriptBody}${closeTag}`);
			}
		}

		// Fallback: If no script tag, prepend to top of file
		return `${headerText.trim()}\n\n${content}`;
	}

	/**
	 * Finds Documentable Blocks (Functions/Vars).
	 * Adjusts line numbers so they match the actual .vue file, not just the script block.
	 */
	public findDocumentableBlocks(content: string): CodeBlock[] {
		const script = this.extractScript(content);
		if (!script) return [];

		// 1. Get blocks from TS Strategy
		const innerBlocks = this.tsStrategy.findDocumentableBlocks(script.text);

		// 2. Apply Offset (Script Start Line)
		return innerBlocks.map(b => ({
			...b,
			startLine: b.startLine + script.startLine,
			endLine: b.endLine + script.startLine
		}));
	}

	/**
	 * Injects JSDoc for a specific function.
	 */
	public injectFunctionDoc(content: string, functionName: string, docBlock: string): string {
		const script = this.extractScript(content);
		if (!script) return content;

		// 1. Delegate injection
		const newBody = this.tsStrategy.injectFunctionDoc(script.text, functionName, docBlock);

		// 2. Re-match and replace
		let match = content.match(/(<script\s+setup[^>]*>)([\s\S]*?)(<\/script>)/);
		if (!match) match = content.match(/(<script[^>]*>)([\s\S]*?)(<\/script>)/);

		if (match) {
			const [fullMatch, openTag, oldBody, closeTag] = match;
			return content.replace(fullMatch, `${openTag}${newBody}${closeTag}`);
		}

		return content;
	}
}
