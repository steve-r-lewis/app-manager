/**
 * ================================================================================
 *
 * @project:    app-manager
 * @file:       ~/app/strategies/baseStrategy.ts
 * @version:    1.0.0
 * @createDate: 2026 Jan 11
 * @createTime: 00:57
 * @author:     Steve R Lewis
 *
 * ================================================================================
 *
 * @description:
 * Central Registry for Code Intelligence Strategies.
 *
 * ================================================================================
 *
 * @notes: Revision History
 *
 * V1.0.0, 20260111-00:57
 * Initial creation and release of baseStrategy.ts
 *
 * ================================================================================
 */

import type { ICodeStrategy } from '../types/index.js';

import { TypescriptStrategy } from '../strategies/typescript/typescriptStrategy.js';
import { CssStrategy } from '../strategies/css/cssStrategy.js';
import { HtmlStrategy } from '../strategies/html/htmlStrategy.js';
import { JsonStrategy } from '../strategies/json/jsonStrategy.js';

import { VueStrategy } from '../orchestrators/vue/vueOrchestrator.js';

// Singleton Instances
const tsStrategy = new TypescriptStrategy();
const vueStrategy = new VueStrategy();
const cssStrategy = new CssStrategy();
const htmlStrategy = new HtmlStrategy();
const jsonStrategy = new JsonStrategy();

const strategyMap = new Map<string, ICodeStrategy>();

// Register defaults
strategyMap.set('.ts', tsStrategy);
strategyMap.set('.js', tsStrategy);
strategyMap.set('.vue', vueStrategy);
strategyMap.set('.css', cssStrategy);
strategyMap.set('.html', htmlStrategy);
strategyMap.set('.json', jsonStrategy);

/**
 * Retrieves the appropriate strategy for a given file path.
 * Throws if no strategy supports the extension.
 */
export function getStrategyForFile(filePath: string): ICodeStrategy {
	const ext = filePath.substring(filePath.lastIndexOf('.'));
	const strategy = strategyMap.get(ext);
	
	if (!strategy) {
		throw new Error(`Unsupported file type: ${ext}`);
	}
	return strategy;
}