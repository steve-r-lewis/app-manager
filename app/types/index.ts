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
 
 /*
 * Root
 *
 * ./globals.d.ts
 * ./index.ts
 *
 */
//export * from './`
//export * from './`

 /*
 * Commands
 */
export * from './commands/baseCommandTypes.ts`;            // --- Infrastructure Domains ---
export * from './commands/gitTypes.ts`;                    // --- Feature Domains ---

 /*
 * Modes
 */
//export * from './modes/`

 /*
 * Orchestrators
 */
export * from './orchestrators/nuxtTypes.ts`;              // --- Feature Domains ---

 /*
 * Scanners
 */
export * from './scanners/baseScannerTypes.ts`;
export * from './scanners/sfcTypes.ts`;
export * from './scanners/tokenTypes.ts`;
export * from './scanners/css/cssLanguageTypes.ts`;
export * from './scanners/html/htmlLanguageTypes.ts`;
export * from './scanners/javascript/jsLanguageTypes.ts`;
export * from './scanners/json/jsonLanguageTypes.ts`;
export * from './scanners/typescript/tsLanguageTypes.ts`;

 /*
 * Services
 */
export * from './services/characterStreamServiceTypes.ts`
export * from './services/codeServiceTypes.ts`;            // --- Infrastructure Domains ---
export * from './services/configServiceTypes.ts`;          // --- Core ---
export * from './services/fileServiceTypes.ts`;            // --- Core ---
export * from './services/githubServiceTypes.ts`;          // --- Infrastructure Domains ---
export * from './services/llmServiceTypes.ts`;             // --- Infrastructure Domains ---
export * from './services/loggerServiceTypes.ts`;          // --- Core ---
export * from './services/processServiceTypes.ts`;         // --- Infrastructure Domains ---

 /*
 * Strategies
 */
//export * from './strategies/`;
//export * from './strategies/css`;
//export * from './strategies/html`;
//export * from './strategies/javascript`;
//export * from './strategies/json`;
//export * from './strategies/typescript`;

 /*
 * Templates
 */
export * from './templates/templateTypes.ts`;               // --- Feature Domains ---
export * from './templates/utilsTypes.ts`;                  // --- Feature Domains ---