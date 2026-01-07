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
// STRATEGY 1: TypeScript (Enhanced)
// ============================================================================
class TypescriptStrategy implements ICodeStrategy {
	
	parseMetadata(content: string): CodeFileMetadata {
		const metadata: CodeFileMetadata = {};
		const version = content.match(/@version:\s*(.*)/);
		const author = content.match(/@author:\s*(.*)/);
		
		if (version) metadata.version = version[1].trim();
		if (author) metadata.author = author[1].trim();
		
		return metadata;
	}
	
	updateMetadata(content: string, metadata: Partial<CodeFileMetadata>): string {
		return content;
	}
	
	findDocumentableBlocks(content: string): CodeBlock[] {
		const blocks: CodeBlock[] = [];
		const lines = content.split('\n');
		
		// ENHANCED REGEX:
		// Matches: export [default] [async] function|class|const|interface name
		// Captures: 1=keywords, 2=type, 3=name
		const regex = /export\s+((?:default\s+|async\s+)*)(const|function|class|interface)\s+(\w+)/g;
		
		let match;
		while ((match = regex.exec(content)) !== null) {
			const index = match.index;
			const lineNum = content.substring(0, index).split('\n').length - 1;
			
			let hasDoc = false;
			for (let i = lineNum - 1; i >= 0; i--) {
				const line = lines[i].trim();
				if (!line) continue;
				if (line.endsWith('*/')) { hasDoc = true; break; }
				break;
			}
			
			blocks.push({
				name: match[3], // The function name
				type: match[2] as any,
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
		
		// Find line with more flexible regex (async/default support)
		const targetIdx = lines.findIndex(l =>
			l.match(new RegExp(`export\\s+(?:(?:default|async)\\s+)*(?:const|function|class|interface)\\s+${functionName}\\b`))
		);
		
		if (targetIdx === -1) return content;
		
		// SMART INDENTATION:
		// Capture whitespace from the start of the target line
		const targetLine = lines[targetIdx];
		const indentation = targetLine.match(/^\s*/)?.[0] || '';
		
		// Apply indentation to every line of the docBlock
		const indentedDoc = docBlock
			.split('\n')
			.map(line => indentation + line)
			.join('\n');
		
		lines.splice(targetIdx, 0, indentedDoc);
		return lines.join('\n');
	}
}

// ============================================================================
// STRATEGY 2: Vue SFC (Setup Priority)
// ============================================================================
class VueStrategy implements ICodeStrategy {
	private tsStrategy = new TypescriptStrategy();
	
	private extractScript(content: string): { text: string; startLine: number } | null {
		// PRIORITY: Try <script setup> first (Modern Nuxt)
		let match = content.match(/<script\s+setup[^>]*>([\s\S]*?)<\/script>/);
		
		// FALLBACK: Try normal <script>
		if (!match) {
			match = content.match(/<script[^>]*>([\s\S]*?)<\/script>/);
		}
		
		if (!match) return null;
		
		const startLine = content.substring(0, match.index!).split('\n').length - 1;
		return { text: match[1], startLine };
	}
	
	parseMetadata(content: string): CodeFileMetadata {
		const script = this.extractScript(content);
		if (!script) return {};
		return this.tsStrategy.parseMetadata(script.text);
	}
	
	updateMetadata(content: string, metadata: Partial<CodeFileMetadata>): string {
		return content;
	}
	
	findDocumentableBlocks(content: string): CodeBlock[] {
		const script = this.extractScript(content);
		if (!script) return [];
		
		const innerBlocks = this.tsStrategy.findDocumentableBlocks(script.text);
		
		return innerBlocks.map(b => ({
			...b,
			startLine: b.startLine + script.startLine,
			endLine: b.endLine + script.startLine
		}));
	}
	
	injectFunctionDoc(content: string, functionName: string, docBlock: string): string {
		// Logic: Re-match the specific script tag used during extraction
		// Note: For absolute safety, we should really cache which script tag matched,
		// but checking setup first again is consistent with find().
		
		let match = content.match(/(<script\s+setup[^>]*>)([\s\S]*?)(<\/script>)/);
		if (!match) {
			match = content.match(/(<script[^>]*>)([\s\S]*?)(<\/script>)/);
		}
		
		if (!match) return content;
		
		const [full, open, scriptText, close] = match;
		const newScript = this.tsStrategy.injectFunctionDoc(scriptText, functionName, docBlock);
		
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
	
	public updateHeader(filePath: string, newHeader: string): void {
		const content = fileService.read(filePath);
		if (!content) throw new Error(`File not found: ${filePath}`);
		
		let updated = '';
		
		if (filePath.endsWith('.vue')) {
			// Vue Logic: Target <script setup> first
			let match = content.match(/(<script\s+setup[^>]*>)([\s\S]*?)(<\/script>)/);
			if (!match) match = content.match(/(<script[^>]*>)([\s\S]*?)(<\/script>)/);
			
			if (match) {
				const [full, open, body, close] = match;
				let newBody = body;
				
				if (body.trim().startsWith('/**')) {
					newBody = body.replace(/^\s*\/\*\*[\s\S]*?\*\//, '\n' + newHeader.trim());
				} else {
					newBody = '\n' + newHeader.trim() + '\n\n' + body;
				}
				updated = content.replace(full, `${open}${newBody}${close}`);
			} else {
				updated = newHeader + '\n' + content;
			}
		} else {
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
		
		logger.info(`Generating docs for ${functionName}...`);
		const prompt = `Generate a JSDoc comment for this code:\n${target.signature}`;
		const jsDoc = await llmService.generate(prompt);
		
		const newContent = strategy.injectFunctionDoc(content, functionName, jsDoc);
		fileService.write(filePath, newContent);
		logger.success(`Injected docs for ${functionName}`);
	}
}

export const codeService = new CodeService();