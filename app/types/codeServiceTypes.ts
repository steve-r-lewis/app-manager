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

import type { BaseTemplateContext } from './templateTypes.js';

/**
 * Strict union type for supported code entities.
 */
export type CodeBlockType = 'function' | 'method' | 'class' | 'interface' | 'variable';

/**
 * Represents the high-level metadata extracted from a file header.
 */
export interface CodeFileMetadata {
	readonly version?: string;
	readonly description?: string;
	readonly author?: string;
	readonly createdDate?: string;
	readonly notes?: ReadonlyArray<string>;
}

/**
 * Represents a specific unit of code found within a file.
 */
export interface CodeBlock {
	readonly id: string;
	readonly name: string;
	readonly type: CodeBlockType;
	readonly startLine: number;
	readonly endLine: number;
	readonly range: readonly [number, number];
	readonly signature: string;
	readonly hasDoc: boolean;
	readonly docBlock?: string;
	readonly content: string;
}

/**
 * The Strategy Contract.
 * Implementations handle language-specific parsing and injection logic.
 * (e.g., TypescriptStrategy, VueStrategy)
 */
export interface ICodeStrategy {
	// 1. ANALYSIS: Used by Command to prepare context for LLM
	scan(content: string): CodeBlock[];
	
	// 2. MANIPULATION: Used by Command to apply LLM results
	// Returns the new full file content
	patch(content: string, blockId: string, newText: string): string;
	
	// 3. GENERATION: Used by Command to create new files
	// (Delegates to your Template functions)
	generate<TContext extends BaseTemplateContext>(templateData: TContext): string;
	
	// 4. UTILITIES
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