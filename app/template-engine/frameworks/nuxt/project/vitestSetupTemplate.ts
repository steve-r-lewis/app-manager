/**
 * ================================================================================
 *
 * @project:    app-manager
 * @file:       ~/app/templates/vitestSetupTemplate.ts
 * @version:    1.0.0
 * @createDate: 2026 Feb 26
 * @createTime: 00:05
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
 * V1.0.0, 20260226-00:05
 * Initial creation and release of vitestSetupTemplate.ts
 *
 * ================================================================================
 */

export function getVitestSetupTemplate(): string {
	return `import { vi, afterEach } from 'vitest';

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

vi.mock('@clack/prompts', async (importOriginal) => {
	const actual = await importOriginal<typeof import('@clack/prompts')>();
	return {
		...actual,
		confirm: mockConfirm,
		select: mockSelect,
		multiselect: mockMultiselect,
		text: mockText,
		password: mockPassword,
		isCancel: actual.isCancel,
		intro: vi.fn(),
		outro: vi.fn(),
		cancel: vi.fn(),
		note: vi.fn(),
		group: vi.fn(),
		spinner: () => ({ start: vi.fn(), stop: vi.fn(), message: vi.fn() }),
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
globalThis.mockPassword = mockPassword;

afterEach(() => {
	vi.clearAllMocks();
});
`;
}