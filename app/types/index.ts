/**
 * ================================================================================
 *
 * @project:    app-manager
 * @file:       ~/app/types/index.ts
 * @version:    1.0.0
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
 * NOTE: 'globals.d.js' is NOT exported here because it is an Ambient Module
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
 
 /*
 * Root
 *
 * ./globals.d.ts
 * ./index.ts
 *
 */
//export * from './'

 /*
 * Commands
 */
export * from './commands/baseCommandTypes.js';            // --- Infrastructure Domains ---
export * from './commands/gitTypes.js';                    // --- Feature Domains ---

 /*
 * Modes
 */
//export * from './modes/'

 /*
 * Orchestrators
 */
export * from './orchestrators/nuxt/nuxtTypes.js';         // --- Feature Domains ---

 /*
 * Scanners
 */
export * from './scanners/baseScannerTypes.js';
export * from './scanners/sfcTypes.js';
export * from './scanners/tokenTypes.js';
export * from './scanners/css/cssLanguageTypes.js';
export * from './scanners/html/htmlLanguageTypes.js';
export * from './scanners/javascript/jsLanguageTypes.js';
export * from './scanners/json/jsonLanguageTypes.js';
export * from './scanners/typescript/tsLanguageTypes.js';

 /*
 * Services
 */
export * from './services/characterStreamServiceTypes.js';
export * from './services/codeServiceTypes.js';            // --- Infrastructure Domains ---
export * from './services/configServiceTypes.js';          // --- Core ---
export * from './services/fileServiceTypes.js';            // --- Core ---
export * from './services/githubServiceTypes.js';          // --- Infrastructure Domains ---
export * from './services/llmServiceTypes.js';             // --- Infrastructure Domains ---
export * from './services/loggerServiceTypes.js';          // --- Core ---
export * from './services/processServiceTypes.js';         // --- Infrastructure Domains ---

 /*
 * Strategies
 */
//export * from './strategies/';
//export * from './strategies/css';
//export * from './strategies/html';
//export * from './strategies/javascript';
//export * from './strategies/json';
//export * from './strategies/typescript';

 /*
 * Templates
 */
export * from './templates/templateTypes.js';               // --- Feature Domains ---
export * from './templates/utilsTypes.js';                  // --- Feature Domains ---