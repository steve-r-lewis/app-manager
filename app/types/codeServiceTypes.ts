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
 * TODO: Create description here
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

export interface CodeFileMetadata {
	version?: string;
	description?: string;
	author?: string;
	createdDate?: string;
	notes?: string[];
}

export interface CodeBlock {
	name: string;
	type: 'function' | 'method' | 'class';
	startLine: number;
	endLine: number;
	signature: string;
	hasDoc: boolean;
	content: string;
}

export interface ICodeStrategy {
	parseMetadata(content: string): CodeFileMetadata;
	updateMetadata(content: string, metadata: Partial<CodeFileMetadata>): string;
	findDocumentableBlocks(content: string): CodeBlock[];
	injectFunctionDoc(content: string, functionName: string, docBlock: string): string;
}