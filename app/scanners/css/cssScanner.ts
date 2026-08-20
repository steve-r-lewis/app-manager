/**
 * ================================================================================
 *
 * @project:    app-manager
 * @file:       ~/app/scanners/css/cssScanner.ts
 * @version:    1.1.0
 * @createDate: 2026 Jan 12
 * @createTime: 23:20
 * @author:     Steve R Lewis
 *
 * ================================================================================
 *
 * @description:
 * The CSS Token Scanner.
 *
 * Responsibilities:
 * - Tokenizes CSS source code into structural units (Selectors, Blocks, Properties).
 * - Accurately tracks nesting (though CSS is mostly flat, SCSS/Less or @media
 * nesting is supported via BlockStart/End tokens).
 * - Safely handles comments and strings to prevent false positives in structural
 * analysis.
 *
 * It provides the foundation for the CssStrategy and the style-block portion of
 * the VueStrategy.
 *
 * ================================================================================
 *
 * @notes: Revision History
 *
 * V1.1.0, 20260820
 * - Renamed calls from the old 'getCurrentLocation()' to the current base-class
 *   method 'currentLocation()'.
 * - Removed the private 'isWhitespace()' override; BaseScanner already exposes
 *   this as 'protected', so the private redeclaration was both dead code and a
 *   type-checking conflict.
 *
 * V1.0.0, 20260112
 * Initial creation and release of cssScanner.ts
 *
 * ================================================================================
 */

import { BaseScanner } from '../baseScanner.js';
import type { Token, SourceLocation, CssTokenType } from '../../types/index.js';

export class CssScanner extends BaseScanner<CssTokenType> {

	public scan(): Token<CssTokenType>[] {
		const tokens: Token<CssTokenType>[] = [];

		while (!this.isAtEnd()) {
			const start = this.currentLocation();
			const char = this.advance();

			// 1. Whitespace
			if (this.isWhitespace(char)) {
				continue;
			}

			// 2. Comments /* ... */
			if (char === '/' && this.match('*')) {
				tokens.push(this.scanComment(start));
				continue;
			}

			// 3. Structural Blocks
			if (char === '{') {
				tokens.push(this.createToken('BlockStart', char, start));
				continue;
			}
			if (char === '}') {
				tokens.push(this.createToken('BlockEnd', char, start));
				continue;
			}

			// 4. Strings
			if (char === '"' || char === "'") {
				tokens.push(this.scanString(char, start));
				continue;
			}

			// 5. At-Rules (@media, @import)
			if (char === '@') {
				tokens.push(this.scanAtKeyword(start));
				continue;
			}

			// 6. Punctuation
			if (char === ':') {
				tokens.push(this.createToken('Colon', char, start));
				continue;
			}
			if (char === ';') {
				tokens.push(this.createToken('Semicolon', char, start));
				continue;
			}
			if (char === ',') {
				tokens.push(this.createToken('Comma', char, start));
				continue;
			}
			if (char === ')') {
				tokens.push(this.createToken('Parenthesis', char, start));
				continue;
			}

			// 7. Operators
			if (['>', '+', '~', '*'].includes(char)) {
				tokens.push(this.createToken('Operator', char, start));
				continue;
			}

			// 8. Identifiers & Functions
			if (this.isIdentifierStart(char)) {
				tokens.push(this.scanIdentifierOrFunction(char, start));
				continue;
			}

			// Fallback
			tokens.push(this.createToken('Unknown', char, start));
		}

		return tokens;
	}

	// --- Specific Scanners ---

	private scanComment(start: SourceLocation): Token<CssTokenType> {
		let value = '/*';
		while (!this.isAtEnd()) {
			if (this.check('*/')) {
				value += '*/';
				this.advance(); // *
				this.advance(); // /
				break;
			}
			value += this.advance();
		}
		return this.createToken('Comment', value, start);
	}

	private scanString(quote: string, start: SourceLocation): Token<CssTokenType> {
		let value = quote;
		while (!this.isAtEnd()) {
			const char = this.advance();
			value += char;

			if (char === '\\' && !this.isAtEnd()) {
				value += this.advance(); // consume escaped char
				continue;
			}

			if (char === quote) {
				break;
			}
		}
		return this.createToken('String', value, start);
	}

	private scanAtKeyword(start: SourceLocation): Token<CssTokenType> {
		let value = '@';
		while (!this.isAtEnd() && this.isIdentifierChar(this.peek())) {
			value += this.advance();
		}
		return this.createToken('AtKeyword', value, start);
	}

	private scanIdentifierOrFunction(firstChar: string, start: SourceLocation): Token<CssTokenType> {
		let value = firstChar;

		while (!this.isAtEnd() && this.isIdentifierChar(this.peek())) {
			value += this.advance();
		}

		// Check if it's a function call like url( or var(
		if (this.peek() === '(') {
			value += this.advance();
			return this.createToken('Function', value, start);
		}

		return this.createToken('Identifier', value, start);
	}

	// --- Helpers ---

	/**
	 * CSS Identifiers are permissive:
	 * Alphanumeric, hyphen, underscore, non-ascii.
	 * Also includes '.' and '#' for Class/ID selectors to simplify basic tokenization.
	 */
	private isIdentifierStart(char: string): boolean {
		return /[a-zA-Z0-9_\-\.#]/.test(char) || char.charCodeAt(0) >= 0x00A0; // non-ascii
	}

	private isIdentifierChar(char: string): boolean {
		return /[a-zA-Z0-9_\-\.#]/.test(char) || char.charCodeAt(0) >= 0x00A0;
	}

	private createToken(type: CssTokenType, value: string, start: SourceLocation): Token<CssTokenType> {
		return {
			type,
			value,
			start,
			end: this.currentLocation()
		};
	}
}
