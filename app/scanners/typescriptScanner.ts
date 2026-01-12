/**
 * ================================================================================
 *
 * @project:    app-manager
 * @file:       ~/app/scanners/typescriptScanner.ts
 * @version:    1.0.0
 * @createDate: 2026 Jan 12
 * @createTime: 23:06
 * @author:     Steve R Lewis
 *
 * ================================================================================
 *
 * @description:
 * The TypeScript Token Scanner.
 *
 * Responsibilities:
 * - Accurately tokenizes TS/JS source code into a linear stream.
 * - Categorizes structural boundaries ({ }) and semantic units.
 * - robustly handles strings (', ", `) and comments (//, /*) to ensure
 * structure is never inferred from non-code text.
 *
 * It does NOT build an AST. It provides the reliable token stream for the
 * TypescriptStrategy to interpret.
 *
 * ================================================================================
 *
 * @notes: Revision History
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
	'extends', 'implements'
]);

export class TypescriptScanner extends BaseScanner<TsTokenType> {
	
	/**
	 * Main scan loop.
	 * Iterates through the source and produces a complete token stream.
	 */
	public scan(): Token<TsTokenType>[] {
		const tokens: Token<TsTokenType>[] = [];
		
		while (!this.isAtEnd()) {
			const start = this.getCurrentLocation();
			const char = this.advance();
			
			// 1. Whitespace
			if (this.isWhitespace(char)) {
				// We generally skip whitespace in the token stream for this use case,
				// but we could emit it if formatting preservation was required.
				// For now, we skip to keep the stream clean for the Strategy.
				continue;
			}
			
			// 2. Structural Blocks
			if (char === '{') {
				tokens.push(this.createToken('BlockStart', char, start));
				continue;
			}
			if (char === '}') {
				tokens.push(this.createToken('BlockEnd', char, start));
				continue;
			}
			
			// 3. Punctuation
			if (['(', ')', '[', ']', ';', ',', '.', ':'].includes(char)) {
				tokens.push(this.createToken('Punctuation', char, start));
				continue;
			}
			
			// 4. Strings
			if (char === "'" || char === '"' || char === '`') {
				tokens.push(this.scanString(char, start));
				continue;
			}
			
			// 5. Comments or Division
			if (char === '/') {
				if (this.match('/')) {
					tokens.push(this.scanLineComment(start));
					continue;
				} else if (this.match('*')) {
					tokens.push(this.scanBlockComment(start));
					continue;
				} else {
					tokens.push(this.createToken('Operator', char, start));
					continue;
				}
			}
			
			// 6. Operators (Simplified)
			if (['=', '+', '-', '*', '%', '&', '|', '!', '^', '~', '<', '>', '?'].includes(char)) {
				// Greedy match for potential multi-char operators like =>, ===, !=
				// For our purpose, single char operators are often enough, but let's be safe for Arrows
				if (char === '=' && this.match('>')) {
					tokens.push(this.createToken('Operator', '=>', start));
				} else {
					tokens.push(this.createToken('Operator', char, start));
				}
				continue;
			}
			
			// 7. Identifiers & Keywords
			if (this.isAlpha(char)) {
				tokens.push(this.scanIdentifier(char, start));
				continue;
			}
			
			// 8. Fallback
			tokens.push(this.createToken('Unknown', char, start));
		}
		
		return tokens;
	}
	
	// --- Specific Scanners ---
	
	private scanString(quote: string, start: SourceLocation): Token<TsTokenType> {
		let value = quote;
		
		while (!this.isAtEnd()) {
			const char = this.advance();
			value += char;
			
			if (char === '\\' && !this.isAtEnd()) {
				// Consume escaped character immediately
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
				value += this.advance(); // *
				value += this.advance(); // /
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