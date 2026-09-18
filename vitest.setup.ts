/**
 * ================================================================================
 *
 * @project:    app-manager
 * @file:       ~/vitest.setup.ts
 * @version:    1.1.0
 * @createDate: 2025 Dec 19
 * @createTime: 23:22
 * @author:     Steve R Lewis
 *
 * ================================================================================
 *
 * @description:
 * Global Vitest setup. Mocks @clack/prompts and consola, and exposes the
 * prompt mocks on globalThis for convenient access from individual test files.
 *
 * ================================================================================
 *
 * @notes: Revision History
 *
 * V1.1.0, 20260820
 * Added a 'declare global' block so TypeScript recognizes the mock properties
 * assigned to globalThis (mockConfirm, mockSelect, etc.) without needing
 * 'any' casts or index-signature errors at every call site.
 *
 * V1.0.1, 20251226-1913
 * Authorship update.
 *
 * V1.0.0, 20251219-23:22
 * Initial creation and release of vitest.setup.ts
 *
 * ================================================================================
 */

import { vi, afterEach, type Mock } from 'vitest';

declare global {
	// eslint-disable-next-line no-var
	var mockConfirm: Mock;
	// eslint-disable-next-line no-var
	var mockSelect: Mock;
	// eslint-disable-next-line no-var
	var mockMultiselect: Mock;
	// eslint-disable-next-line no-var
	var mockText: Mock;
	// eslint-disable-next-line no-var
	var mockPassword: Mock;
}

// 1. Hoist Prompts
// We hoist these so they can be referenced inside the vi.mock factory below.
const {
	mockConfirm,
	mockSelect,
	mockMultiselect,
	mockText,
	mockPassword
} = vi.hoisted(() => {
	return {
		mockConfirm: vi.fn(),
		mockSelect: vi.fn(),
		mockMultiselect: vi.fn(),
		mockText: vi.fn(),
		mockPassword: vi.fn(),
	};
});

// 2. Global Mock for @clack/prompts
vi.mock('@clack/prompts', async (importOriginal) => {
	// Import the actual module to keep utilities we don't want to mock
	const actual = await importOriginal<typeof import('@clack/prompts')>();

	return {
		...actual,
		// Interactive Prompts (Mocked to prevent hanging)
		confirm: mockConfirm,
		select: mockSelect,
		multiselect: mockMultiselect,
		text: mockText,
		password: mockPassword,

		// Flow Control
		// We use the REAL isCancel so logic checks (if (isCancel(val))) work correctly
		isCancel: actual.isCancel,

		// UI Wrappers (Mocked to silence output)
		intro: vi.fn(),
		outro: vi.fn(),
		cancel: vi.fn(),
		note: vi.fn(),
		group: vi.fn(), // Prevent grouped prompts from running real code

		spinner: () => ({ start: vi.fn(), stop: vi.fn(), message: vi.fn() }),

		// Mock the log object to keep test reports clean
		log: {
			message: vi.fn(),
			info: vi.fn(),
			success: vi.fn(),
			step: vi.fn(),
			warn: vi.fn(),
			error: vi.fn(),
		}
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

// 4. Expose Mocks to Global Scope
// This allows you to use `mockConfirm.mockResolvedValue(true)` in your tests
// without importing them explicitly.
globalThis.mockConfirm = mockConfirm;
globalThis.mockSelect = mockSelect;
globalThis.mockMultiselect = mockMultiselect;
globalThis.mockText = mockText;
globalThis.mockPassword = mockPassword;

afterEach(() => {
	vi.clearAllMocks();
});
