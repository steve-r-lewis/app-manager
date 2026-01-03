/**
 * ================================================================================
 *
 * @project:    app-manager
 * @file:       ~/app/types/index.ts
 * @version:    1.1.0
 * @createDate: 2025 Dec 31
 * @createTime: 01:11
 * @author:     Steve R Lewis
 *
 * ================================================================================
 *
 * @description:
 * The Type Aggregator (Barrel File).
 *
 * This file re-exports all named interfaces and types from the domain-specific
 * definition files.
 *
 * NOTE: 'globals.d.ts' is NOT exported here because it is an Ambient Module
 * automatically loaded by the TypeScript compiler.
 *
 * ================================================================================
 *
 * @notes: Revision History
 *
 * V1.2.0, 20260101-17:15
 * Added export for Template Engine types.
 *
 * V1.1.0, 20251231-01:40
 * Added exports for new File and Code Intelligence domains.
 *
 * V1.0.0, 20251218-22:03
 * Initial creation and release of index.ts
 *
 * ================================================================================
 */

export * from './codeServiceTypes'; // --- Infrastructure Domains ---
export * from './configTypes'; // --- Core ---
export * from './fileServiceTypes'; // --- Infrastructure Domains ---
export * from './githubTypes'; // --- Feature Domains ---
export * from './gitTypes'; // --- Feature Domains ---
export * from './llmTypes'; // --- Feature Domains ---
export * from './loggerServiceTypes'; // --- Core ---
export * from './nuxtTypes'; // --- Feature Domains ---
export * from './processTypes'; // --- Infrastructure Domains ---
export * from './utilsTypes'; // --- Infrastructure Domains ---
export * from './templateTypes'; // --- Template Engine ---
