/**
 * ================================================================================
 *
 * @project:    app-manager
 * @file:       ~/app/services/codeService.ts
 * @version:    1.0.0
 * @createDate: 2026 Jan 06
 * @createTime: 22:16
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
 * V1.0.0, 20260106-22:16
 * Initial creation and release of codeService.ts
 *
 * ================================================================================
 */

import { fileService } from './fileService';
import { llmService } from './llmService';
import { logger } from './loggerService';
import type { CodeFileMetadata, CodeBlock, ICodeStrategy } from '../types/index';

// ============================================================================
// STRATEGY 1: TypeScript (The Foundation)
// ============================================================================
class TypescriptStrategy implements ICodeStrategy {
	
	parseMetadata(content: string): CodeFileMetadata {
		const metadata: CodeFileMetadata = {};
		// Look for standard header block tags
		const version = content.match(/@version:\s*(.*)/);
		const author = content.match(/@author:\s*(.*)/);
		
		if (version) metadata.version = version[1].trim();
		if (author) metadata.author = author[1].trim();
		
		return metadata;
	}
	
	updateMetadata(content: string, metadata: Partial<CodeFileMetadata>): string {
		// MVP: We assume the updateHeader method handles the full block replacement
		return content;
	}
	
	findDocumentableBlocks(content: string): CodeBlock[] {
		const blocks: CodeBlock[] = [];
		const lines = content.split('\n');
		
		// Matches: export function|class|const name
		const regex = /export\s+(const|function|class|interface)\s+(\w+)/g;
		
		let match;
		while ((match = regex.exec(content)) !== null) {
			const index = match.index;
			const lineNum = content.substring(0, index).split('\n').length - 1;
			
			// Check for existing Docs (look upwards for '*/')
			let hasDoc = false;
			for (let i = lineNum - 1; i >= 0; i--) {
				const line = lines[i].trim();
				if (!line) continue;
				if (line.endsWith('*/')) { hasDoc = true; break; }
				break;
			}
			
			blocks.push({
				name: match[2],
				type: match[1] as any,
				startLine: lineNum,
				endLine: lineNum,
				signature: match[0],
				hasDoc
			});
		}
		return blocks;
	}
	
	injectFunctionDoc(content: string, functionName: string, docBlock: string): string {
		const lines = content.split('\n');
		const targetIdx = lines.findIndex(l =>
			l.match(new RegExp(`export\\s+(const|function|class|interface)\\s+${functionName}\\b`))
		);
		
		if (targetIdx === -1) return content;
		
		lines.splice(targetIdx, 0, docBlock);
		return lines.join('\n');
	}
}

// ============================================================================
// STRATEGY 2: Vue SFC (Script Setup First)
// ============================================================================
class VueStrategy implements ICodeStrategy {
	private tsStrategy = new TypescriptStrategy();
	
	/**
	 * Helper to extract content inside <script> tags.
	 */
	private extractScript(content: string): { text: string; startLine: number } | null {
		const match = content.match(/<script[^>]*>([\s\S]*?)<\/script>/);
		if (!match) return null;
		
		const startLine = content.substring(0, match.index!).split('\n').length - 1;
		return { text: match[1], startLine };
	}
	
	parseMetadata(content: string): CodeFileMetadata {
		// 1. Extract Script
		const script = this.extractScript(content);
		if (!script) return {}; // No script, no metadata to parse
		
		// 2. Delegate to TS
		return this.tsStrategy.parseMetadata(script.text);
	}
	
	updateMetadata(content: string, metadata: Partial<CodeFileMetadata>): string {
		// Logic handled by main service updateHeader
		return content;
	}
	
	findDocumentableBlocks(content: string): CodeBlock[] {
		const script = this.extractScript(content);
		if (!script) return [];
		
		// Delegate
		const innerBlocks = this.tsStrategy.findDocumentableBlocks(script.text);
		
		// Offset line numbers
		return innerBlocks.map(b => ({
			...b,
			startLine: b.startLine + script.startLine,
			endLine: b.endLine + script.startLine
		}));
	}
	
	injectFunctionDoc(content: string, functionName: string, docBlock: string): string {
		// 1. Find Script tag locations
		const match = content.match(/(<script[^>]*>)([\s\S]*?)(<\/script>)/);
		if (!match) return content;
		
		const [full, open, scriptText, close] = match;
		
		// 2. Delegate Injection
		const newScript = this.tsStrategy.injectFunctionDoc(scriptText, functionName, docBlock);
		
		// 3. Replace only the script part
		return content.replace(full, `${open}${newScript}${close}`);
	}
}

// ============================================================================
// MAIN SERVICE
// ============================================================================
class CodeService {
	private strategies = new Map<string, ICodeStrategy>();
	
	constructor() {
		const ts = new TypescriptStrategy();
		this.strategies.set('.ts', ts);
		this.strategies.set('.js', ts);
		this.strategies.set('.vue', new VueStrategy());
	}
	
	private getStrategy(filePath: string): ICodeStrategy {
		const ext = filePath.substring(filePath.lastIndexOf('.'));
		const strategy = this.strategies.get(ext);
		if (!strategy) throw new Error(`Unsupported file type: ${ext}`);
		return strategy;
	}
	
	public inspect(filePath: string): CodeBlock[] {
		const content = fileService.read(filePath);
		if (!content) throw new Error(`File not found: ${filePath}`);
		return this.getStrategy(filePath).findDocumentableBlocks(content);
	}
	
	/**
	 * Updates the header block.
	 * For Vue files, it ensures the header is placed INSIDE the script tag.
	 */
	public updateHeader(filePath: string, newHeader: string): void {
		const content = fileService.read(filePath);
		if (!content) throw new Error(`File not found: ${filePath}`);
		
		let updated = '';
		
		if (filePath.endsWith('.vue')) {
			// Vue Logic: Inside <script>
			const match = content.match(/(<script[^>]*>)([\s\S]*?)(<\/script>)/);
			if (match) {
				const [full, open, body, close] = match;
				let newBody = body;
				
				// If header exists, replace it
				if (body.trim().startsWith('/**')) {
					newBody = body.replace(/^\s*\/\*\*[\s\S]*?\*\//, '\n' + newHeader.trim());
				} else {
					// Else prepend to script body
					newBody = '\n' + newHeader.trim() + '\n\n' + body;
				}
				updated = content.replace(full, `${open}${newBody}${close}`);
			} else {
				// No script? Just prepend to file (fallback)
				updated = newHeader + '\n' + content;
			}
		} else {
			// TS Logic: Top of file
			if (content.trim().startsWith('/**')) {
				updated = content.replace(/\/\*\*[\s\S]*?\*\//, newHeader.trim());
			} else {
				updated = newHeader.trim() + '\n\n' + content;
			}
		}
		
		fileService.write(filePath, updated);
		logger.success(`Updated header for ${filePath}`);
	}
	
	public async generateDocFor(filePath: string, functionName: string): Promise<void> {
		const content = fileService.read(filePath);
		if (!content) throw new Error(`File not found: ${filePath}`);
		
		const strategy = this.getStrategy(filePath);
		const blocks = strategy.findDocumentableBlocks(content);
		const target = blocks.find(b => b.name === functionName);
		
		if (!target) throw new Error(`Function '${functionName}' not found`);
		
		// Generate
		logger.info(`Generating docs for ${functionName}...`);
		const prompt = `Generate a JSDoc comment for this code:\n${target.signature}`;
		const jsDoc = await llmService.generate(prompt);
		
		// Inject
		const newContent = strategy.injectFunctionDoc(content, functionName, jsDoc);
		fileService.write(filePath, newContent);
		logger.success(`Injected docs for ${functionName}`);
	}
}

export const codeService = new CodeService();