/**
 * ================================================================================
 *
 * @project:    app-manager
 * @file:       ~/app/types/codeServiceTypes.ts
 * @version:    1.0.0
 * @createDate: 2025 Dec 31
 * @createTime: 01:11
 * @author:     Steve R Lewis
 *
 * ================================================================================
 *
 * @description:
 * Type definitions for the Code Intelligence Domain.
 *
 * These interfaces define the contract for "understanding" source code files,
 * enabling the extraction of metadata (headers) and the identification of
 * code blocks (functions/methods) for automated documentation generation.
 *
 * ================================================================================
 *
 * @notes: Revision History
 *
 * V1.0.0, 20251231-01:11
 * Initial creation and release of codeServiceTypes.ts
 *
 * ================================================================================
 */

/**
 * Represents the high-level metadata extracted from a file header or package configuration.
 */
export interface CodeFileMetadata {
	version?: string;
	description?: string;
	author?: string;
	createdDate?: string;
	createTime?: string;
	notes?: string[]; // Array of history notes/changelogs
}

/**
 * Represents a specific unit of code (function, class, method) found within a file.
 */
export interface CodeBlock {
	name: string;       // e.g. "initApp"
	type: 'function' | 'method' | 'class' | 'interface' | 'variable';
	startLine: number;  // 0-based index
	endLine: number;
	signature: string;  // e.g. "initApp(root: string)"
	hasDoc: boolean;    // true if JSDoc/Comment exists above it
	content: string;    // The actual code of the function/block
}

/**
 * The Strategy Contract.
 * Any service attempting to parse a specific language (TS, JSON, Vue) must implement this.
 */
export interface ICodeStrategy {
	/**
	 * Extracts top-level metadata (Header comments or JSON fields).
	 *
	 * Reads header comments like @author, @version
	 */
	parseMetadata(content: string): CodeFileMetadata;
	
	/**
	 * Updates specific metadata fields safely without destroying the rest of the file.
	 * Returns the full new file content string.
	 *
	 * Updates header comments safely
	 */
	updateMetadata(content: string, metadata: Partial<CodeFileMetadata>): string;
	
	/**
	 * Scans the code to find documentable entities (functions/classes).
	 *
	 * Returns a list of functions/classes and their line numbers
	 */
	findDocumentableBlocks(content: string): CodeBlock[];
	
	/**
	 * Injects a docblock string above a specific function.
	 * Returns the full new file content string.
	 *
	 * Inserts a docstring above a specific function signature
	 */
	injectFunctionDoc(content: string, functionName: string, docBlock: string): string;
}