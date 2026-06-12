/**
 * ================================================================================
 *
 * @project:    app-manager
 * @file:       ~/tests/unit/scanners/baseScanner.test.ts
 * @version:    1.0.0
 * @createDate: 2026 Jun 11
 * @createTime: 01:52
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
 * V1.0.0, 20260611-01:52
 * Initial creation and release of baseScanner.test.ts
 *
 * ================================================================================
 */

import { describe, it, expect } from 'vitest';
import { BaseScanner } from '../../../app/scanners/baseScanner.js';
import type { Token, SourceLocation } from '../../../app/types/index.js';

type MockTokenType = 'Identifier' | 'Number' | 'Text' | 'EOF';

/**
 * Diagnostic concrete implementation designed strictly to expose
 * protected BaseScanner primitives for isolated boundary testing.
 */
class DiagnosticScanner extends BaseScanner<MockTokenType> {
	constructor(source: string) {
		super(source);
	}
	
	public scan(): Token<MockTokenType>[] { return []; }
	
	// Expose properties securely for state verification
	public get _index() { return this.index; }
	public get _line() { return this.line; }
	public get _column() { return this.column; }
	
	// Expose primitives
	public exAdvance() { return this.advance(); }
	public exPeek(offset = 0) { return this.peek(offset); }
	public exCheck(seq: string) { return this.check(seq); }
	public exMatch(seq: string) { return this.match(seq); }
	
	public exConsumeWhile(pred: (char: string) => boolean) { this.consumeWhile(pred); }
	public exConsumeUntil(char: string) { this.consumeUntil(char); }
	public exConsumeUntilSequence(seq: string) { this.consumeUntilSequence(seq); }
	
	public exIsAlphaNumeric(char: string) { return this.isAlphaNumeric(char); }
	public exLocation() { return this.currentLocation(); }
	public exToken(type: MockTokenType, start: SourceLocation, end: SourceLocation) {
		return this.token(type, start, end);
	}
}

describe('Enterprise BaseScanner Architecture', () => {
	
	describe('Cursor Navigation & State', () => {
		it('should initialize with correct default pointer coordinates', () => {
			const scanner = new DiagnosticScanner('const x = 1;');
			expect(scanner._index).toBe(0);
			expect(scanner._line).toBe(1);
			expect(scanner._column).toBe(1);
		});
		
		it('should strictly return null-byte \\0 at EOF bounds', () => {
			const scanner = new DiagnosticScanner('a');
			scanner.exAdvance(); // Consume 'a'
			expect(scanner.exAdvance()).toBe('\0');
			expect(scanner.exPeek()).toBe('\0');
			expect(scanner.exPeek(5)).toBe('\0');
		});
		
		it('should maintain spatial coordinates accurately across standard LF line breaks', () => {
			const scanner = new DiagnosticScanner('a\nb');
			scanner.exAdvance(); // 'a'
			expect(scanner._column).toBe(2);
			scanner.exAdvance(); // '\n'
			expect(scanner._line).toBe(2);
			expect(scanner._column).toBe(1);
			scanner.exAdvance(); // 'b'
			expect(scanner._column).toBe(2);
		});
		
		it('should normalize Windows CRLF sequences into a single logical newline', () => {
			const scanner = new DiagnosticScanner('a\r\nb');
			
			scanner.exAdvance(); // 'a'
			expect(scanner._line).toBe(1);
			expect(scanner._column).toBe(2);
			
			scanner.exAdvance(); // '\r\n' normalized
			expect(scanner._line).toBe(2);
			expect(scanner._column).toBe(1);
			
			scanner.exAdvance(); // 'b'
			expect(scanner._line).toBe(2);
			expect(scanner._column).toBe(2);
			
			expect(scanner._index).toBe(4);
		});
	});
	
	describe('Sequence Lookahead & Validation', () => {
		it('should peek arbitrary offsets safely without mutating pointer state', () => {
			const scanner = new DiagnosticScanner('target');
			expect(scanner.exPeek(0)).toBe('t');
			expect(scanner.exPeek(3)).toBe('g');
			expect(scanner._index).toBe(0); // State mutation guard
		});
		
		it('should reject check/match evaluations that exceed remaining buffer length', () => {
			const scanner = new DiagnosticScanner('var');
			expect(scanner.exCheck('vars')).toBe(false);
			expect(scanner.exMatch('vars')).toBe(false);
			expect(scanner._index).toBe(0); // Match should not consume on failure
		});
		
		it('should consume characters atomically only when match() succeeds', () => {
			const scanner = new DiagnosticScanner('import { ref }');
			expect(scanner.exMatch('import')).toBe(true);
			expect(scanner._index).toBe(6);
			expect(scanner._column).toBe(7);
		});
	});
	
	describe('Void-Return Consumption Primitives', () => {
		it('should consume block segments safely via consumeWhile', () => {
			const scanner = new DiagnosticScanner('alpha123 beta');
			scanner.exConsumeWhile((char) => scanner.exIsAlphaNumeric(char));
			expect(scanner._index).toBe(8); // Stops exactly at the space
			expect(scanner.exPeek()).toBe(' ');
		});
		
		it('should consume layout gaps cleanly via consumeUntil', () => {
			const scanner = new DiagnosticScanner('start_block; end_block;');
			scanner.exConsumeUntil(';');
			expect(scanner.exPeek()).toBe(';');
			expect(scanner._index).toBe(11);
		});
		
		it('should consume complex structural spans via consumeUntilSequence', () => {
			const scanner = new DiagnosticScanner('/* complex comment */ const');
			scanner.exConsumeUntilSequence('*/');
			expect(scanner.exPeek(0)).toBe('*');
			expect(scanner.exPeek(1)).toBe('/');
		});
		
		it('should safeguard consumption loops against missing terminal targets (EOF trap)', () => {
			const scanner = new DiagnosticScanner('unterminated string');
			scanner.exConsumeUntil('"'); // Target does not exist
			expect(scanner.exPeek()).toBe('\0'); // Should safely hit EOF without infinite looping
		});
	});
	
	describe('Token Generation Pipeline', () => {
		it('should assemble immutable structural tokens flawlessly', () => {
			const scanner = new DiagnosticScanner('let count = 0;');
			const start = scanner.exLocation();
			scanner.exMatch('let');
			const end = scanner.exLocation();
			
			const token = scanner.exToken('Identifier', start, end);
			
			expect(token.type).toBe('Identifier');
			expect(token.value).toBe('let');
			expect(token.start.index).toBe(0);
			expect(token.end.index).toBe(3);
		});
	});
});