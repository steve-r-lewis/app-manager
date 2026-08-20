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
 * V1.0.0, 20260112-22:59
 * Initial creation and release of baseScanner.ts
 *
 * ================================================================================
 */

import type { Token, SourceLocation } from '../types/index.js';

export abstract class BaseScanner<TTokenType extends string> {
	protected readonly source: string;
	protected readonly length: number;
	
	private _index = 0;
	private _line = 1;
	private _column = 1;
	
	protected constructor(source: string) {
		this.source = source;
		this.length = source.length;
	}
	
	public abstract scan(): Token<TTokenType>[];
	
	// =========================================================================
	// Cursor State
	// =========================================================================
	
	protected get index(): number {
		return this._index;
	}
	
	protected get line(): number {
		return this._line;
	}
	
	protected get column(): number {
		return this._column;
	}
	
	// =========================================================================
	// Navigation
	// =========================================================================
	
	protected isAtEnd(): boolean {
		return this._index >= this.length;
	}
	
	protected peek(offset = 0): string {
		const target = this._index + offset;
		
		if (target < 0 || target >= this.length) {
			return '\0';
		}
		
		return this.source[target];
	}
	
	protected check(sequence: string): boolean {
		const seqLen = sequence.length;
		
		if (this._index + seqLen > this.length) {
			return false;
		}
		
		for (let i = 0; i < seqLen; i++) {
			if (this.source[this._index + i] !== sequence[i]) {
				return false;
			}
		}
		
		return true;
	}
	
	protected match(sequence: string): boolean {
		if (!this.check(sequence)) {
			return false;
		}
		
		const seqLen = sequence.length;
		
		for (let i = 0; i < seqLen; i++) {
			this.advance();
		}
		
		return true;
	}
	
	protected advance(): string {
		if (this.isAtEnd()) {
			return '\0';
		}
		
		const char = this.source[this._index++];
		
		// ================================================================
		// Windows CRLF Normalization
		// ================================================================
		
		if (char === '\r') {
			if (!this.isAtEnd() && this.peek() === '\n') {
				this._index++;
			}
			
			this._line++;
			this._column = 1;
			
			return '\n';
		}
		
		// ================================================================
		// Unix LF Handling
		// ================================================================
		
		if (char === '\n') {
			this._line++;
			this._column = 1;
			
			return '\n';
		}
		
		this._column++;
		
		return char;
	}
	
	// =========================================================================
	// Consumption Helpers
	// =========================================================================
	
	protected consumeWhile(predicate: (char: string) => boolean): void {
		while (!this.isAtEnd() && predicate(this.peek())) {
			this.advance();
		}
	}
	
	protected consumeUntil(char: string): void {
		while (!this.isAtEnd() && this.peek() !== char) {
			this.advance();
		}
	}
	
	protected consumeUntilSequence(sequence: string): void {
		while (!this.isAtEnd() && !this.check(sequence)) {
			this.advance();
		}
	}
	
	// =========================================================================
	// Character Classification
	// =========================================================================
	
	protected isWhitespace(char: string): boolean {
		return (
			char === ' ' ||
			char === '\t' ||
			char === '\n' ||
			char === '\r'
		);
	}
	
	protected isDigit(char: string): boolean {
		return char >= '0' && char <= '9';
	}
	
	protected isAlpha(char: string): boolean {
		return (
			(char >= 'a' && char <= 'z') ||
			(char >= 'A' && char <= 'Z')
		);
	}
	
	protected isAlphaNumeric(char: string): boolean {
		return this.isAlpha(char) || this.isDigit(char);
	}
	
	// =========================================================================
	// Source Location Helpers
	// =========================================================================
	
	protected currentLocation(): SourceLocation {
		return {
			line: this._line,
			column: this._column,
			index: this._index
		};
	}
	
	protected reset(location: SourceLocation): void {
		this._index = location.index;
		this._line = location.line;
		this._column = location.column;
	}
	
	protected slice(start: number, end: number): string {
		return this.source.substring(start, end);
	}
	
	// =========================================================================
	// Immutable Token Factory
	// =========================================================================
	
	protected token(
		type: TTokenType,
		start: SourceLocation,
		end: SourceLocation
	): Token<TTokenType> {
		return {
			type,
			value: this.slice(start.index, end.index),
			start,
			end
		};
	}
}