/**
 * ================================================================================
 *
 * @project:    app-manager
 * @file:       ~/app/types/codeServiceTypes.ts
 * @version:    1.1.0
 * @createDate: 2025 Dec 31
 * @createTime: 01:11
 * @author:     Steve R Lewis
 *
 * ================================================================================
 *
 * @description:
 * Type definitions for the Code Intelligence Domain.
 * Defines the contract for parsing, analyzing, and modifying source code
 * structures.
 *
 * ================================================================================
 *
 * @notes: Revision History
 *
 * V1.1.0, 20260111-00:22
 * Added CodeBlockType enum.
 *
 * V1.0.0, 20251231-01:11
 * Initial creation and release of codeServiceTypes.ts
 *
 * ================================================================================
 */

/**
 * Strict union type for supported code entities.
 */
export type CodeBlockType = 'function' | 'method' | 'class' | 'interface' | 'variable';

/**
 * Represents the high-level metadata extracted from a file header.
 */
export interface CodeFileMetadata {
	version?: string;
	description?: string;
	author?: string;
	createdDate?: string;
	notes?: string[];
}

/**
 * Represents a specific unit of code found within a file.
 */
export interface CodeBlock {
	name: string;
	type: CodeBlockType;
	startLine: number; // 0-based index
	endLine: number;
	signature: string; // The function signature (e.g., "export function foo()")
	hasDoc: boolean;   // True if a JSDoc block already exists
}

/**
 * The Strategy Contract.
 * Implementations handle language-specific parsing and injection logic.
 * (e.g., TypescriptStrategy, VueStrategy)
 */
export interface ICodeStrategy {
	/**
	 * Extracts metadata from the file header comments.
	 */
	parseMetadata(content: string): CodeFileMetadata;
	
	/**
	 * Replaces or prepends the file header comment block.
	 * Handles placement logic (e.g., top of file vs inside <script setup>).
	 */
	injectHeader(content: string, headerText: string): string;
	
	/**
	 * Scans the code to find documentable entities.
	 */
	findDocumentableBlocks(content: string): CodeBlock[];
	
	/**
	 * Injects a docblock string above a specific function/entity.
	 * Must handle indentation and newlines correctly.
	 */
	injectFunctionDoc(content: string, functionName: string, docBlock: string): string;
}