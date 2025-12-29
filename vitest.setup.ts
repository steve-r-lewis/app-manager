/**
 * ================================================================================
 *
 * @project:    app-manager
 * @file:       ~/vitest.setup.ts
 * @version:    1.0.1
 * @createDate: 2025 Dec 19
 * @createTime: 23:22
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
 * V1.0.1, 20251226-1913
 * Authorship update.
 *
 * V1.0.0, 20251219-23:22
 * Initial creation and release of vitest.setup.ts
 *
 * ================================================================================
 */

import { vi, afterEach } from 'vitest';

// 1. Hoist Prompts
const { mockConfirm, mockSelect, mockMultiselect, mockText, mockIsCancel } = vi.hoisted(() => {
	return {
		mockConfirm: vi.fn(),
		mockSelect: vi.fn(),
		mockMultiselect: vi.fn(),
		mockText: vi.fn(),
		mockIsCancel: vi.fn()
	};
});

// 2. Global Mock for @clack/prompts
vi.mock('@clack/prompts', async (importOriginal) => {
	const actual = await importOriginal<typeof import('@clack/prompts')>();
	return {
		...actual,
		confirm: mockConfirm,
		select: mockSelect,
		multiselect: mockMultiselect,
		text: mockText,
		isCancel: mockIsCancel,
		intro: vi.fn(),
		outro: vi.fn(),
		spinner: () => ({ start: vi.fn(), stop: vi.fn(), message: vi.fn() }),
	};
});

// 3. Global Mock for Consola (The Fix for 'addReporter' crash)
vi.mock('consola', () => {
	const mockFn = vi.fn().mockReturnThis();
	return {
		consola: {
			info: mockFn,
			warn: mockFn,
			error: mockFn,
			success: mockFn,
			start: mockFn,
			ready: mockFn,
			box: mockFn,
			debug: mockFn,
			trace: mockFn,
			// Critical methods
			addReporter: vi.fn(),
			create: vi.fn().mockReturnThis(),
			withTag: vi.fn().mockReturnThis(),
			withDefaults: vi.fn().mockReturnThis(),
		}
	};
});

globalThis.mockConfirm = mockConfirm;
globalThis.mockSelect = mockSelect;
globalThis.mockMultiselect = mockMultiselect;
globalThis.mockText = mockText;

afterEach(() => {
	vi.clearAllMocks();
});