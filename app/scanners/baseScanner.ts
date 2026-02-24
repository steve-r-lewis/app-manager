/**
 * ================================================================================
 *
 * @project:    app-manager
 * @file:       ~/app/scanners/baseScanner.ts
 * @version:    1.0.1
 * @createDate: 2026 Jan 12
 * @createTime: 22:59
 * @author:     Steve R Lewis
 *
 * ================================================================================
 *
 * @description:
 * The Abstract Base Scanner.
 * Implements the "Token Scanner Paradigm" defined in regexAndTokenScanning.md.
 * Provides O(n) traversal, line/column tracking, and lookahead capabilities.
 *
 * This class is "dumb" - it knows nothing of specific languages.
 * Concrete implementations (TypescriptScanner, VueScanner) must extend this.
 *
 * ================================================================================
 *
 * @notes: Revision History
 *
 * V1.0.1, 20260115
 * Fixed missing 'isWhitespace' implementation and visibility of 'skipWhitespace'.
 * Added missing imports.
 *
 * V1.0.0, 20260112-22:59
 * Initial creation and release of baseScanner.ts
 *
 * ================================================================================
 */

import type { Token, SourceLocation } from '../types/index.js';

export abstract class BaseScanner<TTokenType> {
	protected readonly source: string;
	protected readonly length: number;
	
	// Cursor State
	protected index: number = 0;
	protected line: number = 1;
	protected column: number = 1;
	
	constructor(source: string) {
		this.source = source;
		this.length = source.length;
	}
	
	/**
	 * The main loop. Concrete classes implement the specific state machine here.
	 */
	public abstract scan(): Token<TTokenType>[];
	
	// --- Navigation ---
	
	protected isAtEnd(): boolean {
		return this.index >= this.length;
	}
	
	protected advance(): string {
		if (this.isAtEnd()) return '\0';
		
		const char = this.source[this.index];
		this.index++;
		
		if (char === '\n') {
			this.line++;
			this.column = 1;
		} else {
			this.column++;
		}
		
		return char;
	}
	
	protected peek(offset: number = 0): string {
		if (this.index + offset >= this.length) return '\0';
		return this.source[this.index + offset];
	}
	
	protected match(expected: string): boolean {
		if (this.isAtEnd()) return false;
		if (this.source[this.index] !== expected) return false;
		
		this.advance();
		return true;
	}
	
	/**
	 * Lookahead for a string sequence without advancing
	 */
	protected check(sequence: string): boolean {
		if (this.index + sequence.length > this.length) return false;
		return this.source.substring(this.index, this.index + sequence.length) === sequence;
	}
	
	// --- State Helpers ---
	
	protected getCurrentLocation(): SourceLocation {
		return {
			line: this.line,
			column: this.column,
			index: this.index
		};
	}
	
	/**
	 * Captures a slice of source code between two indices
	 */
	protected slice(start: number, end: number): string {
		return this.source.substring(start, end);
	}
	
	/**
	 * Advances the cursor past any whitespace characters.
	 */
	protected skipWhitespace(): void {
		while (!this.isAtEnd() && this.isWhitespace(this.peek())) {
			this.advance();
		}
	}
	
	/**
	 * Determines if a character is a whitespace character.
	 */
	protected isWhitespace(char: string): boolean {
		return /\s/.test(char);
	}
}