/**
 * ================================================================================
 *
 * @project:    app-manager
 * @file:       ~/app/types/fileServiceTypes.ts
 * @version:    1.0.0
 * @createDate: 2025 Dec 31
 * @createTime: 01:10
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
 * V1.0.0, 20251231-01:10
 * Initial creation and release of fileServiceTypes.ts
 *
 * ================================================================================
 */

export interface IFileHandler {
	read<T = any>(filePath: string): T | null;
	write(filePath: string, content: any): void;
	update?(filePath: string, content: any): void;
}

export type FileHandlerContext = 'provisioning' | 'layer' | 'edit';

export interface FileHandlerJsonOptions {
	spaces?: number;
}