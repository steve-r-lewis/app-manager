/**
 * ================================================================================
 *
 * @project:    app-manager
 * @file:       ~/tests/types/vitestGlobals.d.ts
 * @version:    1.0.1
 * @createDate: 2025 Dec 19
 * @createTime: 23:26
 * @author:     Steve R Lewis
 *
 * ================================================================================
 *
 * @description:
 * Defines global mock objects used specifically in the test environment (Vitest).
 * These match the implementations in vitest.setup.ts.
 *
 * ================================================================================
 *
 * @notes: Revision History
 * V1.0.1, 20251226-1913
 * Refactored logic.
 *
 * V1.0.0, 20251219-23:26
 * Initial creation and release of vitestGlobals.d.ts
 *
 * ================================================================================
 */

/* eslint-disable no-var */
import { Mock } from 'vitest';

declare global {
	var mockConfirm: Mock;
	var mockSelect: Mock;
	var mockMultiselect: Mock;
	var mockText: Mock;
}

export {};