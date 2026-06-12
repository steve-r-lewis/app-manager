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
 * V1.0.0, 20251218-22:03
 * Initial creation and release of index.ts
 *
 * ================================================================================
 */

export * from './baseCommandTypes.js';    // --- Infrastructure Domains ---
export * from './codeServiceTypes.js';    // --- Infrastructure Domains ---
export * from './configServiceTypes.js';  // --- Core ---
export * from './fileServiceTypes.js';    // --- Core ---
export * from './githubServiceTypes.js';  // --- Infrastructure Domains ---
export * from './gitTypes.js';            // --- Feature Domains ---
export * from './llmServiceTypes.js';     // --- Infrastructure Domains ---
export * from './loggerServiceTypes.js';  // --- Core ---
export * from './nuxtTypes.js';           // --- Feature Domains ---
export * from './processServiceTypes.js'; // --- Infrastructure Domains ---
export * from './templateTypes.js';       // --- Feature Domains ---
export * from './utilsTypes.js';          // --- Feature Domains ---

export * from './baseScannerTypes.js';
export * from './characterStreamServiceTypes.js';
export * from './cssLanguageTypes.js';
export * from './htmlLanguageTypes.js';
export * from './jsLanguageTypes.js';
export * from './jsonLanguageTypes.js';
export * from './tsLanguageTypes.js';
export * from './sfcTypes.js';
export * from './tokenTypes.js';
