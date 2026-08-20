/**
 * ================================================================================
 *
 * @project:    app-manager
 * @file:       ~/app/types/characterStreamServiceTypes.ts
 * @version:    1.0.0
 * @createDate: 2026 Jun 11
 * @createTime: 23:03
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
 * V1.0.0, 20260611-23:03
 * Initial creation and release of characterStreamServiceTypes.ts
 *
 * ================================================================================
 */

export interface StreamPosition {
	readonly line: number;
	readonly column: number;
	readonly index: number;
}

export interface StreamMark extends StreamPosition {}

export interface CharacterStream {
	peek(offset?: number): string;
	advance(count?: number): string;
	
	eof(): boolean;
	
	position(): StreamPosition;
	
	mark(): StreamMark;
	reset(mark: StreamMark): void;
	
	slice(start: number, end: number): string;
	
	match(value: string): boolean;
}

