/**
 * ================================================================================
 *
 * @project:    app-manager
 * @file:       ~/tests/global.d.ts
 * @version:    1.0.0
 * @createDate: 2025 Dec 19
 * @createTime: 23:26
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
 * V1.0.0, 20251219-23:26
 * Initial creation and release of global.d.ts
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