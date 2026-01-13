/**
 * ================================================================================
 *
 * @project:    app-manager
 * @file:       ~/app/scanners/htmlScanner.ts
 * @version:    1.0.5
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
 * V1.0.5, 20260113
 * Complete refactor to fix ReferenceErrors and logic bugs.
 * - Fixed BaseScanner API usage (removed non-existent 'current/match(string)').
 * - Added support for Unquoted Attribute Values.
 * - Fixed off-by-one error in Text scanning.
 *
 * V1.0.4, 20260113
 * Complete refactor to fix ReferenceErrors and logic bugs.
 * - Fixed BaseScanner API usage (removed non-existent 'current/match(string)').
 * - Added support for Unquoted Attribute Values.
 * - Fixed off-by-one error in Text scanning.
 *
 * V1.0.3, 20260113
 * Fixed critical corruption in scan() loop.
 *
 * V1.0.2, 20260113
 * Fixed corruption in scan() loop where comment logic was misplaced.
 *
 * V1.0.1, 20260113
 * Fixed corruption in scan() method causing ReferenceError.
 *
 * V1.0.0, 20260112-23:20
 * Initial creation and release of htmlScanner.ts
 *
 * ================================================================================
 */

/**
 * ================================================================================
 *
 * @project:    app-manager
 * @file:       ~/app/scanners/htmlScanner.ts
 * @version:    1.0.6
 * @author:     Steve R Lewis
 *
 * ================================================================================
 *
 * @description:
 * The HTML Token Scanner.
 *
 * Responsibilities:
 * - Tokenizes HTML content into semantic units (Tags, Attributes, Text, Comments).
 * - Robustly handles "Raw Text" elements (script, style, textarea).
 * - Correctly handles self-closing tags, boolean attributes, and unquoted values.
 *
 * ================================================================================
 *
 * @notes: Revision History
 *
 * V1.0.6, 20260113
 * Complete refactor to fix ReferenceErrors and logic bugs.
 * - Removed hallucinatory 'value +=' logic from main scan loop.
 * - Fixed BaseScanner API usage (replaced invalid 'match(string)' with 'check(string)').
 * - Standardized attribute scanning for quoted/unquoted/boolean values.
 *
 * V1.0.0, 20260112
 * Initial creation.
 *
 * ================================================================================
 */

import { BaseScanner } from './baseScanner';
import type { Token, SourceLocation, HtmlTokenType } from '../types/index';

const RAW_TEXT_TAGS = new Set(['script', 'style', 'textarea', 'title']);

export class HtmlScanner extends BaseScanner<HtmlTokenType> {
	
	public scan(): Token<HtmlTokenType>[] {
		const tokens: Token<HtmlTokenType>[] = [];
		
		while (!this.isAtEnd()) {
			const start = this.getCurrentLocation();
			const char = this.peek();
			
			// 1. Tags (<...)
			if (char === '<') {
				// Comment ')) {
				value += '-->';
				this.advance(); this.advance(); this.advance();
				break;
			}
			value += this.advance();
		}
		return this.createToken('Comment', value, start);
	}
	
	private scanDoctype(start: SourceLocation): Token<HtmlTokenType> {
		let value = '';
		while (!this.isAtEnd() && this.peek() !== '>') {
			value += this.advance();
		}
		if (!this.isAtEnd()) {
			value += this.advance(); // >
		}
		return this.createToken('Doctype', value, start);
	}
	
	private scanTagEnd(tokens: Token<HtmlTokenType>[]) {
		while (!this.isAtEnd() && this.peek() !== '>') {
			this.advance();
		}
		if (!this.isAtEnd()) {
			tokens.push(this.createToken('TagClose', '>', this.getCurrentLocation()));
			this.advance();
		}
	}
	
	// --- Helpers ---
	
	private isWhitespace(char: string): boolean {
		return /\s/.test(char);
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