/**
 * ================================================================================
 *
 * @project:    app-manager
 * @file:       ~/app/strategies/javascript/javascriptStrategy.ts
 * @version:    2.0.0
 * @createDate: 2026 Jan 11
 * @createTime: 01:01
 * @author:     Steve R Lewis
 *
 * ================================================================================
 *
 * @description:
 * Strategy for parsing and manipulating JavaScript files.
 *
 * For everything this strategy actually does — locating exported
 * functions/classes/consts/interfaces for documentation purposes, and
 * managing file headers — TypeScript and JavaScript are indistinguishable.
 * This class exists as an explicit extension point rather than a full
 * duplicate: it inherits 100% of TypescriptStrategy's behavior today, and
 * is the place to override individual methods if genuine JS-specific
 * behavior is ever needed (e.g. flagging 'interface'/'type'/'enum'
 * declarations as invalid in a .js file, or handling .jsx/.mjs variants
 * differently).
 *
 * ================================================================================
 *
 * @notes: Revision History
 *
 * V2.0.0, 20260820
 * Replaced the full byte-for-byte duplicate of TypescriptStrategy with a
 * thin subclass. Deduplication decision: see chat history — TS/JS diverge
 * only at the type-annotation level, which this strategy's regex-based
 * export scanning doesn't currently touch, so there's no behavior to
 * preserve separately yet.
 *
 * V1.0.0, 20260111-01:01
 * Initial creation and release of javascriptStrategy.ts
 *
 * ================================================================================
 */

import { TypescriptStrategy } from '../typescript/typescriptStrategy.js';

export class JavascriptStrategy extends TypescriptStrategy {
	// Intentionally empty. Inherits parseMetadata, injectHeader,
	// findDocumentableBlocks, and injectFunctionDoc unchanged from
	// TypescriptStrategy. Override a method here when JS-specific
	// behavior is actually needed — don't re-copy the class.
}

