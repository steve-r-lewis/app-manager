/**
 * ================================================================================
 *
 * @project:    app-manager
 * @file:       ~/app/scanners/typescriptScanner.ts
 * @version:    1.1.0
 * @createDate: 2026 Jan 12
 * @createTime: 23:06
 * @author:     Steve R Lewis
 *
 * ================================================================================
 *
 * @description:
 *
 * It does NOT build an AST. It provides the reliable token stream for the
 * TypescriptStrategy to interpret.
 * The TypeScript Token Scanner.
 *
 * Responsibilities:
 * - Accurately tokenizes TS/JS source code into a linear stream.
 * - Categorizes structural boundaries ({ }) and semantic units.
 * - Robustly handles strings (', ", `) and comments (//, /*).
 * - Implements "Regex Trap" avoidance by detecting Context-Aware Regex Literals.
 *
 * ================================================================================
 *
 * @notes: Revision History
 *
 * V1.1.0, 20260113
 * Added scanRegex() and isRegexStart() logic to fix structural errors caused
 * by braces inside regex literals (e.g., / { /).
 *
 * V1.0.0, 20260112-23:06
 * Initial creation and release of typescriptScanner.ts
 *
 * ================================================================================
 */

import { BaseScanner } from './baseScanner';
import type { Token, SourceLocation, TsTokenType } from '../types/index';

// Keywords relevant to structural analysis
const KEYWORDS = new Set([
	'export', 'default', 'import', 'from', 'as',
	'function', 'class', 'interface', 'type', 'enum',
	'const', 'var', 'let', 'async', 'await', 'return',
	'if', 'else', 'for', 'while', 'switch', 'case', 'break',
	'try', 'catch', 'finally', 'throw', 'new', 'this',
	'public', 'private', 'protected', 'readonly', 'static',
	'extends', 'implements', 'typeof', 'void', 'delete', 'in', 'instanceof'
]);

export class TypescriptScanner extends BaseScanner<TsTokenType> {
	
	public scan(): Token<TsTokenType>[] {
		const tokens: Token<TsTokenType>[] = [];
		let lastSignificantToken: Token<TsTokenType> | null = null;
		
		while (!this.isAtEnd()) {
			const start = this.getCurrentLocation();
			const char = this.advance();
			
			// 1. Whitespace
			if (this.isWhitespace(char)) {
				continue;
			}
			
			// 2. Structural Blocks
			if (char === '{') {
				const t = this.createToken('BlockStart', char, start);
				tokens.push(t);
				lastSignificantToken = t;
				continue;
			}
			if (char === '}') {
				const t = this.createToken('BlockEnd', char, start);
				tokens.push(t);
				lastSignificantToken = t;
				continue;
			}
			
			// 3. Punctuation
			if (['(', ')', '[', ']', ';', ',', '.', ':'].includes(char)) {
				const t = this.createToken('Punctuation', char, start);
				tokens.push(t);
				lastSignificantToken = t;
				continue;
			}
			
			// 4. Strings
			if (char === "'" || char === '"' || char === '`') {
				const t = this.scanString(char, start);
				tokens.push(t);
				lastSignificantToken = t;
				continue;
			}
			
			// 5. Comments, Division, OR Regex
			if (char === '/') {
				if (this.match('/')) {
					// Line comment (ignored for structural tracking)
					tokens.push(this.scanLineComment(start));
					continue;
				} else if (this.match('*')) {
					// Block comment (ignored for structural tracking)
					tokens.push(this.scanBlockComment(start));
					continue;
				} else {
					// Context Check: Is this a Regex Literal or a Division Operator?
					if (this.isRegexStart(lastSignificantToken)) {
						const t = this.scanRegex(start);
						tokens.push(t);
						lastSignificantToken = t;
					} else {
						const t = this.createToken('Operator', char, start);
						tokens.push(t);
						lastSignificantToken = t;
					}
					continue;
				}
			}
			
			// 6. Operators
			if (['=', '+', '-', '*', '%', '&', '|', '!', '^', '~', '<', '>', '?'].includes(char)) {
				// Greedy match for potential multi-char operators
				let value = char;
				if (char === '=' && this.match('>')) {
					value = '=>';
				}
				// Basic check for other common multi-char ops to keep stream clean
				else if (['=', '+', '-', '&', '|'].includes(char) && this.match(char)) {
					value += char; // ==, ++, --, &&, ||
				}
				
				const t = this.createToken('Operator', value, start);
				tokens.push(t);
				lastSignificantToken = t;
				continue;
			}
			
			// 7. Identifiers & Keywords
			if (this.isAlpha(char)) {
				const t = this.scanIdentifier(char, start);
				tokens.push(t);
				lastSignificantToken = t;
				continue;
			}
			
			// 8. Fallback
			const t = this.createToken('Unknown', char, start);
			tokens.push(t);
			// Numbers often fall here in this simplified scanner, treated as significant
			if (this.isDigit(char)) lastSignificantToken = t;
		}
		
		return tokens;
	}
	
	// --- Regex Logic ---
	
	/**
	 * Determines if a '/' character indicates the start of a Regex literal.
	 * Based on the previous significant token.
	 */
	private isRegexStart(lastToken: Token<TsTokenType> | null): boolean {
		if (!lastToken) return true; // Start of file
		
		const { type, value } = lastToken;
		
		if (type === 'Keyword') return true; // return /abc/;
		if (type === 'Operator') return true; // = /abc/;
		if (type === 'BlockStart') return true; // { /abc/ }
		
		if (type === 'Punctuation') {
			// Closing brackets usually mean division: (a + b) / 2 or array[0] / 2
			if (value === ')' || value === ']') return false;
			return true; // ( /abc/, [ /abc/, : /abc/
		}
		
		// Identifier, String, Number, BlockEnd usually mean Division
		// x / 2, "str" / 2, 5 / 2, } / 2
		return false;
	}
	
	private scanRegex(start: SourceLocation): Token<TsTokenType> {
		let value = '/';
		let inClass = false; // Are we inside [...]
		
		while (!this.isAtEnd()) {
			const char = this.advance();
			value += char;
			
			// Escape sequence: consume next char blindly (even if it's / or ])
			if (char === '\\' && !this.isAtEnd()) {
				value += this.advance();
				continue;
			}
			
			if (inClass) {
				if (char === ']') inClass = false;
			} else {
				if (char === '[') {
					inClass = true;
				} else if (char === '/') {
					// End of Regex body
					break;
				}
			}
		}
		
		// Consume flags (g, i, m, s, u, y, d)
		while (!this.isAtEnd() && this.isAlpha(this.peek())) {
			value += this.advance();
		}
		
		return this.createToken('Regex', value, start);
	}
	
	// --- Specific Scanners ---
	
	private scanString(quote: string, start: SourceLocation): Token<TsTokenType> {
		let value = quote;
		
		while (!this.isAtEnd()) {
			const char = this.advance();
			value += char;
			
			if (char === '\\' && !this.isAtEnd()) {
				value += this.advance();
				continue;
			}
			
			if (char === quote) {
				break;
			}
		}
		
		return this.createToken('String', value, start);
	}
	
	private scanLineComment(start: SourceLocation): Token<TsTokenType> {
		let value = '//';
		while (!this.isAtEnd() && this.peek() !== '\n') {
			value += this.advance();
		}
		return this.createToken('Comment', value, start);
	}
	
	private scanBlockComment(start: SourceLocation): Token<TsTokenType> {
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
	
	private scanIdentifier(firstChar: string, start: SourceLocation): Token<TsTokenType> {
		let value = firstChar;
		while (!this.isAtEnd() && (this.isAlphaNumeric(this.peek()) || this.peek() === '_')) {
			value += this.advance();
		}
		
		const type: TsTokenType = KEYWORDS.has(value) ? 'Keyword' : 'Identifier';
		return this.createToken(type, value, start);
	}
	
	// --- Helpers ---
	
	private isWhitespace(char: string): boolean {
		return /\s/.test(char);
	}
	
	private isDigit(char: string): boolean {
		return /[0-9]/.test(char);
	}
	
	private isAlpha(char: string): boolean {
		return /[a-zA-Z_]/.test(char);
	}
	
	private isAlphaNumeric(char: string): boolean {
		return /[a-zA-Z0-9_]/.test(char);
	}
	
	private createToken(type: TsTokenType, value: string, start: SourceLocation): Token<TsTokenType> {
		return {
			type,
			value,
			start,
			end: this.getCurrentLocation()
		};
	}
}