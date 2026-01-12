/**
 * ================================================================================
 *
 * @project:    app-manager
 * @file:       ~/app/scanners/jsonScanner.ts
 * @version:    1.0.0
 * @createDate: 2026 Jan 12
 * @createTime: 23:20
 * @author:     Steve R Lewis
 *
 * ================================================================================
 *
 * @description:
 * TODO: Create description here
 *
 * ================================================================================
 *
 * @notes: Revision History
 *
 * V1.0.0, 20260112-23:20
 * Initial creation and release of jsonScanner.ts
 *
 * ================================================================================
 */

/**
 * ================================================================================
 *
 * @project:    app-manager
 * @file:       ~/app/scanners/jsonScanner.ts
 * @version:    1.0.0
 * @createDate: 2026 Jan 12
 * @author:     Steve R Lewis
 *
 * ================================================================================
 *
 * @description:
 * The JSON Token Scanner.
 *
 * Responsibilities:
 * - Tokenizes JSON content into structural units (Objects, Arrays, Properties).
 * - Supports JSONC (Comments) as this is required for tsconfig.json and other
 * tooling configuration files.
 * - robustly handles strings (including escapes) and numbers.
 *
 * It provides the foundation for the JsonStrategy to perform precise edits without
 * destroying formatting or comments.
 *
 * ================================================================================
 *
 * @notes: Revision History
 *
 * V1.0.0, 20260112
 * Initial creation and release of jsonScanner.ts
 *
 * ================================================================================
 */

import { BaseScanner } from './baseScanner';
import type { Token, SourceLocation, JsonTokenType } from '../types/index';

export class JsonScanner extends BaseScanner<JsonTokenType> {
	
	public scan(): Token<JsonTokenType>[] {
		const tokens: Token<JsonTokenType>[] = [];
		
		while (!this.isAtEnd()) {
			const start = this.getCurrentLocation();
			const char = this.advance();
			
			// 1. Whitespace
			if (this.isWhitespace(char)) {
				continue;
			}
			
			// 2. Structural Characters
			if (char === '{') {
				tokens.push(this.createToken('BraceOpen', char, start));
				continue;
			}
			if (char === '}') {
				tokens.push(this.createToken('BraceClose', char, start));
				continue;
			}
			if (char === '[') {
				tokens.push(this.createToken('BracketOpen', char, start));
				continue;
			}
			if (char === ']') {
				tokens.push(this.createToken('BracketClose', char, start));
				continue;
			}
			if (char === ':') {
				tokens.push(this.createToken('Colon', char, start));
				continue;
			}
			if (char === ',') {
				tokens.push(this.createToken('Comma', char, start));
				continue;
			}
			
			// 3. Comments (JSONC Support)
			if (char === '/') {
				if (this.match('/')) {
					tokens.push(this.scanLineComment(start));
					continue;
				} else if (this.match('*')) {
					tokens.push(this.scanBlockComment(start));
					continue;
				} else {
					tokens.push(this.createToken('Unknown', char, start));
					continue;
				}
			}
			
			// 4. Strings
			if (char === '"') {
				tokens.push(this.scanString(start));
				continue;
			}
			
			// 5. Numbers
			if (this.isDigit(char) || char === '-') {
				tokens.push(this.scanNumber(char, start));
				continue;
			}
			
			// 6. Keywords (true, false, null)
			if (this.isAlpha(char)) {
				tokens.push(this.scanKeyword(char, start));
				continue;
			}
			
			// Fallback
			tokens.push(this.createToken('Unknown', char, start));
		}
		
		return tokens;
	}
	
	// --- Specific Scanners ---
	
	private scanString(start: SourceLocation): Token<JsonTokenType> {
		let value = '"';
		
		while (!this.isAtEnd()) {
			const char = this.advance();
			value += char;
			
			if (char === '\\' && !this.isAtEnd()) {
				value += this.advance(); // consume escaped char
				continue;
			}
			
			if (char === '"') {
				break;
			}
		}
		
		return this.createToken('String', value, start);
	}
	
	private scanNumber(firstChar: string, start: SourceLocation): Token<JsonTokenType> {
		let value = firstChar;
		
		// Integer part
		while (!this.isAtEnd() && this.isDigit(this.peek())) {
			value += this.advance();
		}
		
		// Fraction part
		if (this.peek() === '.' && this.isDigit(this.peek(1))) {
			value += this.advance(); // consume .
			while (!this.isAtEnd() && this.isDigit(this.peek())) {
				value += this.advance();
			}
		}
		
		// Exponent part
		if (this.peek() === 'e' || this.peek() === 'E') {
			value += this.advance(); // consume e
			if (this.peek() === '+' || this.peek() === '-') {
				value += this.advance(); // consume sign
			}
			while (!this.isAtEnd() && this.isDigit(this.peek())) {
				value += this.advance();
			}
		}
		
		return this.createToken('Number', value, start);
	}
	
	private scanKeyword(firstChar: string, start: SourceLocation): Token<JsonTokenType> {
		let value = firstChar;
		while (!this.isAtEnd() && this.isAlpha(this.peek())) {
			value += this.advance();
		}
		
		switch (value) {
			case 'true':
			case 'false':
				return this.createToken('Boolean', value, start);
			case 'null':
				return this.createToken('Null', value, start);
			default:
				// In strict JSON, unquoted text that isn't true/false/null is invalid.
				// We tokenise it as Unknown or String-like for error handling purposes.
				return this.createToken('Unknown', value, start);
		}
	}
	
	private scanLineComment(start: SourceLocation): Token<JsonTokenType> {
		let value = '//';
		while (!this.isAtEnd() && this.peek() !== '\n') {
			value += this.advance();
		}
		return this.createToken('Comment', value, start);
	}
	
	private scanBlockComment(start: SourceLocation): Token<JsonTokenType> {
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
	
	// --- Helpers ---
	
	private isWhitespace(char: string): boolean {
		return /\s/.test(char);
	}
	
	private isDigit(char: string): boolean {
		return /[0-9]/.test(char);
	}
	
	private isAlpha(char: string): boolean {
		return /[a-zA-Z]/.test(char);
	}
	
	private createToken(type: JsonTokenType, value: string, start: SourceLocation): Token<JsonTokenType> {
		return {
			type,
			value,
			start,
			end: this.getCurrentLocation()
		};
	}
}