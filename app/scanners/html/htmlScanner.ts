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
 * V1.0.0, 20260112-23:20
 * Initial creation and release of htmlScanner.ts
 *
 * ================================================================================
 */

import { BaseScanner } from './baseScanner.js';
import type { Token, HtmlTokenType } from '../types/index.js';

export class HtmlScanner extends BaseScanner<HtmlTokenType> {
	private tokens: Token<HtmlTokenType>[] = [];
	private rawTextMode = false;
	private rawTagName: string | null = null;
	
	constructor(source: string) {
		super(source);
	}
	
	public scan(): Token<HtmlTokenType>[] {
		while (!this.isAtEnd()) {
			this.consumeWhile(c => this.isWhitespace(c));
			
			if (this.isAtEnd()) break;
			
			if (this.peek() === '<') {
				if (this.peek(1) === '/') {
					this.scanCloseTag();
				} else if (this.peek(1) === '!') {
					this.scanComment();
				} else {
					this.scanOpenOrSelfClosingTag();
				}
			} else {
				this.scanText();
			}
		}
		
		return this.tokens;
	}
	
	private scanOpenOrSelfClosingTag(): void {
		const start = this.currentLocation();
		
		this.advance(); // '<'
		
		const tagStart = this.currentLocation();
		this.consumeWhile(c => this.isTagNameChar(c));
		const tagEnd = this.currentLocation();
		
		const tagName = this.source.slice(tagStart.index, tagEnd.index);
		
		this.tokens.push(this.token('TagName', start, tagEnd));
		
		this.consumeAttributes();
		
		if (this.peek() === '/') {
			this.advance();
			if (this.peek() === '>') this.advance();
			
			this.tokens.push(this.token('TagSelfClose', this.currentLocation(), this.currentLocation()));
			return;
		}
		
		if (this.peek() === '>') this.advance();
		
		// raw text mode (script/style)
		if (tagName === 'script' || tagName === 'style') {
			this.rawTextMode = true;
			this.rawTagName = tagName;
		}
	}
	
	private scanCloseTag(): void {
		const start = this.currentLocation();
		
		this.advance(); // <
		this.advance(); // /
		
		const tagStart = this.currentLocation();
		this.consumeWhile(c => this.isTagNameChar(c));
		const tagEnd = this.currentLocation();
		
		this.consumeWhile(c => c !== '>');
		
		if (this.peek() === '>') this.advance();
		
		const value = this.source.slice(start.index, this.currentLocation().index);
		
		this.tokens.push(this.token('TagClose', start, this.currentLocation()));
	}
	
	private scanText(): void {
		const start = this.currentLocation();
		
		this.consumeWhile(c => c !== '<');
		
		const end = this.currentLocation();
		
		const value = this.source.slice(start.index, end.index);
		
		this.tokens.push(this.token('Text', start, end));
	}
	
	private scanComment(): void {
		const start = this.currentLocation();
		
		// assumes <!-- already detected
		this.advance();
		this.advance();
		
		this.consumeUntilSequence('-->');
		
		if (this.match('-->')) {
			// consume closing safely
		}
		
		this.tokens.push(this.token('Comment', start, this.currentLocation()));
	}
	
	private consumeAttributes(): void {
		while (!this.isAtEnd()) {
			this.consumeWhile(c => this.isWhitespace(c));
			
			if (this.peek() === '>' || this.peek() === '/') break;
			
			// attribute name
			const nameStart = this.currentLocation();
			this.consumeWhile(c => this.isTagNameChar(c));
			const nameEnd = this.currentLocation();
			
			const attrName = this.source.slice(nameStart.index, nameEnd.index);
			
			this.tokens.push(this.token('AttributeName', nameStart, nameEnd));
			
			this.consumeWhile(c => this.isWhitespace(c));
			
			// boolean attribute
			if (this.peek() !== '=') continue;
			
			this.advance(); // '='
			
			this.consumeWhile(c => this.isWhitespace(c));
			
			const quote = this.peek();
			
			if (quote === '"' || quote === "'") {
				this.advance();
				const valStart = this.currentLocation();
				this.advance(); // opening quote
				
				this.consumeWhile(c => c !== quote);
				
				const valEnd = this.currentLocation();
				this.advance(); // opening quote
				
				this.advance(); // closing quote
				
				this.tokens.push(this.token('AttributeValue', valStart, valEnd));
			}
		}
	}
	
	private isTagNameChar(char: string): boolean {
		return this.isAlphaNumeric(char) || char === '-' || char === '_' || char === ':';
	}
}