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
 *
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

// import { vi, afterEach } from 'vitest';
//
// // 1. Hoist Prompts
// const { mockConfirm, mockSelect, mockMultiselect, mockText, mockIsCancel } = vi.hoisted(() => {
// 	return {
// 		mockConfirm: vi.fn(),
// 		mockSelect: vi.fn(),
// 		mockMultiselect: vi.fn(),
// 		mockText: vi.fn(),
// 		mockIsCancel: vi.fn()
// 	};
// });
//
// // 2. Global Mock for @clack/prompts
// vi.mock('@clack/prompts', async (importOriginal) => {
// 	const actual = await importOriginal<typeof import('@clack/prompts')>();
// 	return {
// 		...actual,
// 		confirm: mockConfirm,
// 		select: mockSelect,
// 		multiselect: mockMultiselect,
// 		text: mockText,
// 		isCancel: mockIsCancel,
// 		intro: vi.fn(),
// 		outro: vi.fn(),
// 		spinner: () => ({ start: vi.fn(), stop: vi.fn(), message: vi.fn() }),
// 	};
// });
//
// // 3. Global Mock for Consola (The Fix for 'addReporter' crash)
// vi.mock('consola', () => {
// 	const mockFn = vi.fn().mockReturnThis();
// 	return {
// 		consola: {
// 			info: mockFn,
// 			warn: mockFn,
// 			error: mockFn,
// 			success: mockFn,
// 			start: mockFn,
// 			ready: mockFn,
// 			box: mockFn,
// 			debug: mockFn,
// 			trace: mockFn,
// 			// Critical methods
// 			addReporter: vi.fn(),
// 			create: vi.fn().mockReturnThis(),
// 			withTag: vi.fn().mockReturnThis(),
// 			withDefaults: vi.fn().mockReturnThis(),
// 		}
// 	};
// });
//
// globalThis.mockConfirm = mockConfirm;
// globalThis.mockSelect = mockSelect;
// globalThis.mockMultiselect = mockMultiselect;
// globalThis.mockText = mockText;
//
// afterEach(() => {
// 	vi.clearAllMocks();
// });