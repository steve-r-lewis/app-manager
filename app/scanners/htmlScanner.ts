/**
 * ================================================================================
 *
 * @project:    app-manager
 * @file:       ~/app/scanners/htmlScanner.ts
 * @version:    1.0.8
 * @createDate: 2026 Jan 12
 * @createTime: 23:20
 * @author:     Steve R Lewis
 *
 * ================================================================================
 *
 * @description:
 * The HTML Token Scanner.
 *
 * Responsibilities:
 * - Tokenizes HTML content into semantic units (Tags, Attributes, Text, Comments).
 * - Robustly handles "Raw Text" elements (script, style, textarea) where
 * content must be treated as text rather than nested tags.
 * - Provides the foundation for the HtmlStrategy and the template portion of the
 * VueStrategy.
 *
 * ================================================================================
 *
 * @notes: Revision History
 *
 * V1.0.8, 20260115
 * Strict refactor based on architectural review.
 * - Fixed: Moved all helper methods out of scan() to class level.
 * - Fixed: scan() loop properly dispatches to void handlers or token pushers.
 * - Logic: Implemented explicit Raw Text state handling for script/style.
 * - Logic: Added robust attribute scanning (Boolean, Unquoted, Quoted).
 *
 * V1.0.7, 20260115
 * Complete rewrite to fix corruption.
 * - Implemented correct scan loop for Tags, Comments, and Text.
 * - Added correct Raw Text handling for Script/Style tags.
 * - Fixed TS compilation errors (SourceLocation, Token types).
 *
 * V1.0.6, 20260113-00:35
 * Complete refactor to fix ReferenceErrors and logic bugs.
 * - Removed hallucinatory 'value +=' logic from main scan loop.
 * - Fixed BaseScanner API usage (replaced invalid 'match(string)' with 'check(string)').
 * - Standardized attribute scanning for quoted/unquoted/boolean values.
 *
 * V1.0.5, 20260113-00:30
 * Complete refactor to fix ReferenceErrors and logic bugs.
 * - Fixed BaseScanner API usage (removed non-existent 'current/match(string)').
 * - Added support for Unquoted Attribute Values.
 * - Fixed off-by-one error in Text scanning.
 *
 * V1.0.4, 20260113-00:25
 * Complete refactor to fix ReferenceErrors and logic bugs.
 * - Fixed BaseScanner API usage (removed non-existent 'current/match(string)').
 * - Added support for Unquoted Attribute Values.
 * - Fixed off-by-one error in Text scanning.
 *
 * V1.0.3, 20260113-00:20
 * Fixed critical corruption in scan() loop.
 *
 * V1.0.2, 20260113-00:15
 * Fixed corruption in scan() loop where comment logic was misplaced.
 *
 * V1.0.1, 20260113-00:05
 * Fixed corruption in scan() method causing ReferenceError.
 *
 * V1.0.0, 20260112-23:20
 * Initial creation and release of htmlScanner.ts
 *
 * ================================================================================
 */

import { BaseScanner } from './baseScanner.js';
import type { Token, SourceLocation, HtmlTokenType } from '../types/index.js';

const RAW_TEXT_TAGS = new Set(['script', 'style', 'textarea', 'title']);

export class HtmlScanner extends BaseScanner<HtmlTokenType> {
	
	private tokens: Token<HtmlTokenType>[] = [];
	
	/**
	 * Main execution method.
	 * Scans the entire source string and returns a stream of typed tokens.
	 */
	public scan(): Token<HtmlTokenType>[] {
		this.tokens = [];
		
		while (!this.isAtEnd()) {
			const char = this.peek();
			
			if (char === '<') {
				// 1. Comments: if (this.check('')) {
				value += this.advance();
			}
			
			if (this.check('-->')) {
				value += '-->';
				this.advance(); this.advance(); this.advance();
			}
			
			this.tokens.push(this.createToken('Comment', value, start));
		}
	
	private scanDoctype(): void {
		const start = this.getCurrentLocation();
		let value = '';
		
		// Consume until >
		while (!this.isAtEnd() && this.peek() !== '>') {
			value += this.advance();
		}
	
		if (this.peek() === '>') {
			value += this.advance();
		}
		
		// Falling back to Comment as Doctype is not active in types
		this.tokens.push(this.createToken('Comment' as HtmlTokenType, value, start));
	}
	
	private scanText(): void {
		const start = this.getCurrentLocation();
		let value = '';
		
		while (!this.isAtEnd() && this.peek() !== '<') {
			value += this.advance();
		}
		
		if (value.length > 0) {
			this.tokens.push(this.createToken('Text', value, start));
		}
	}
	
	// --- Helpers ---
	
	private checkClosingTagRaw(tagName: string): boolean {
		// We want to check for </tagName> or </tagName whitespace
		if (this.index + 2 + tagName.length > this.length) return false;
		
		// 1. Check </
		if (this.source.substring(this.index, this.index + 2) !== '</') return false;
		
		// 2. Check tagName (case insensitive logic needed? Spec says HTML5. Let's assume standard)
		const potentialName = this.source.substring(this.index + 2, this.index + 2 + tagName.length);
		if (potentialName.toLowerCase() !== tagName) return false;
		
		// 3. Check what follows: should be > or whitespace or /
		const nextChar = this.source[this.index + 2 + tagName.length];
		return nextChar === '>' || nextChar === '/' || /\s/.test(nextChar);
	}
	
	private isAlpha(char: string): boolean {
		return /[a-zA-Z]/.test(char);
	}
	
	private isAlphaNumeric(char: string): boolean {
		return /[a-zA-Z0-9]/.test(char);
	}
	
	private createToken(type: HtmlTokenType, value: string, start: SourceLocation): Token<HtmlTokenType> {
		return {
		  type,
			value,
			start,
			end: this.getCurrentLocation()
		};
	}
}