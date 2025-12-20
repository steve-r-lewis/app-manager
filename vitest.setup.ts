/**
 * ================================================================================
 *
 * @project:    app-manager
 * @file:       ~/vitest.setup.ts
 * @version:    1.0.0
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
 *
 * V1.0.0, 20251219-23:22
 * Initial creation and release of vitest.setup.ts
 *
 * ================================================================================
 */

import { vi, beforeAll, afterEach } from 'vitest';

// 1. Hoist the mock functions so they are available before imports
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
		// We mock intro/outro/spinner to keep test output clean
		intro: vi.fn(),
		outro: vi.fn(),
		spinner: () => ({ start: vi.fn(), stop: vi.fn(), message: vi.fn() }),
		log: {
			message: vi.fn(),
			info: vi.fn(),
			success: vi.fn(),
			warn: vi.fn(),
			error: vi.fn()
		}
	};
});

// 3. Reset mocks after each test to ensure isolation
afterEach(() => {
	vi.clearAllMocks();
});

// 4. Attach mocks to the global object so tests can control them
// (Typescript might complain without a .d.ts, but this works for runtime)
globalThis.mockConfirm = mockConfirm;
globalThis.mockSelect = mockSelect;
globalThis.mockMultiselect = mockMultiselect;
globalThis.mockText = mockText;