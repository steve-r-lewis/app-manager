/**
 * ================================================================================
 *
 * @project:    app-manager
 * @file:       ~/app/services/codeService.ts
 * @version:    3.1.0
 * @createDate: 2026 Jan 06
 * @createTime: 22:16
 * @author:     Steve R Lewis
 *
 * ================================================================================
 *
 * @description:
 * The Code Intelligence Service.
 *
 * Provides AST-like manipulation capabilities using Regex-based Strategies.
 * Supports:
 * - TypeScript/JavaScript parsing
 * - Vue SFC parsing (Smartly handling <script setup>)
 * - Automated Documentation Injection (Header & JSDoc)
 *
 * Pattern: Strategy Pattern (Context: CodeService, Strategies: Typescript/Vue)
 *
 * ================================================================================
 *
 * @notes: Revision History
 *
 * V3.1.0, 20260820
 * fileService.read()/write() are async (they return Promises). This service
 * was calling them without 'await', which passed unresolved Promises into
 * strategy methods expecting plain strings. Made 'inspect' and 'updateHeader'
 * async and added the missing 'await' calls throughout, including inside
 * 'generateDocFor' which was already async but wasn't awaiting the read.
 * NOTE: any caller of codeService.inspect() or codeService.updateHeader()
 * elsewhere in the app (likely in app/commands/*) will now need 'await' added
 * at the call site too, since these methods now return Promises instead of
 * resolving synchronously.
 *
 * V3.0.0, 20260111-15:16
 * Added support for Vue SFC parsing. Made the service a "dumb" coordinator that
 * delegates everything to the Registry using a strategy pattern.
 *
 * V2.0.0, 20260111-00:58
 * Introduced the strategy pattern for code parsing.
 *
 * V1.0.0, 20260106-22:16
 * Initial creation and release of codeService.ts
 *
 * ================================================================================
 */

import { fileService } from './fileService.js';
import { llmService } from './llmService.js';
import { logger } from './loggerService.js';
import { getStrategyForFile } from '../strategies/baseStrategy.js';
import type { CodeBlock } from '../types/index.js';

class CodeService {

	/**
	 * Inspects a file and returns a list of documentable code blocks.
	 * Delegates to the specific strategy for the file type.
	 */
	public async inspect(filePath: string): Promise<CodeBlock[]> {
		const content = await fileService.read(filePath);
		if (!content) throw new Error(`File not found: ${filePath}`);

		// 1. Get Strategy (e.g., VueStrategy, TypescriptStrategy)
		// 2. Delegate Parsing
		return getStrategyForFile(filePath).findDocumentableBlocks(content as string);
	}

	/**
	 * Updates or injects the file header comment.
	 */
	public async updateHeader(filePath: string, newHeader: string): Promise<void> {
		const content = await fileService.read(filePath);
		if (!content) throw new Error(`File not found: ${filePath}`);

		// Delegate Injection Logic (e.g. VueStrategy knows to put it inside <script>)
		const updatedContent = getStrategyForFile(filePath).injectHeader(content as string, newHeader);

		await fileService.write(filePath, updatedContent);
		logger.success(`Updated header for ${filePath}`);
	}

	/**
	 * Generates and injects JSDoc for a specific function using LLM.
	 */
	public async generateDocFor(filePath: string, functionName: string): Promise<void> {
		const content = await fileService.read(filePath);
		if (!content) throw new Error(`File not found: ${filePath}`);

		const strategy = getStrategyForFile(filePath);

		// 1. Find the block to document
		const blocks = strategy.findDocumentableBlocks(content as string);
		const target = blocks.find((b: CodeBlock) => b.name === functionName);

		if (!target) throw new Error(`Function '${functionName}' not found in ${filePath}`);

		// 2. Generate Content
		logger.info(`Generating docs for ${functionName}...`);
		const prompt = `Generate a JSDoc comment for this code. Return ONLY the comment block:\n${target.signature}`;

		const jsDoc = await llmService.generate(prompt);

		// 3. Inject back into file
		const newContent = strategy.injectFunctionDoc(content as string, functionName, jsDoc);
		await fileService.write(filePath, newContent);
		logger.success(`Injected docs for ${functionName}`);
	}
}

export const codeService = new CodeService();
