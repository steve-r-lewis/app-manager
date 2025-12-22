/**
 * ================================================================================
 *
 * @project:    app-manager
 * @file:       ~/app/services/configService.ts
 * @version:    1.0.0
 * @createDate: 2025 Dec 18
 * @createTime: 16:20
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
 * V1.0.0, 20251218-16:20
 * Initial creation and release of configService.ts
 *
 * ================================================================================
 */

import path from 'path';
import fs from 'fs';
import dotenv from 'dotenv';
import pc from 'picocolors';
import { logger } from './loggerService';
import type { LLMRegistry, RepoRegistry } from '../types/index.js';

class ConfigService {
	private toolRoot: string = '';
	public llmConfig: LLMRegistry | null = null;
	public repoConfig: RepoRegistry | null = null;
	
	init(toolRoot: string) {
		this.toolRoot = toolRoot;
		this.loadEnv();
		this.loadRegistries();
		this.validateEnvironment();
	}
	
	// Helper to determine where to look for config files
	private get configDir(): string {
		// Allows tests to override the location of the config folder
		return process.env.APP_CONFIG_DIR || path.resolve(this.toolRoot, 'config');
	}
	
	private loadEnv() {
		const envPath = path.resolve(this.toolRoot, '.env');
		if (fs.existsSync(envPath)) {
			dotenv.config({ path: envPath });
			if (process.env.DEBUG) logger.success(pc.dim('Loaded .env configuration'));
		} else {
			logger.warn(pc.yellow('No .env file found in tool root. AI features may fail.'));
		}
	}
	
	private loadRegistries() {
		try {
			// Use the getter here
			const llmPath = path.resolve(this.configDir, 'llmRegistry.json');
			
			if (fs.existsSync(llmPath)) {
				this.llmConfig = JSON.parse(fs.readFileSync(llmPath, 'utf-8'));
				if (process.env.DEBUG) logger.success(pc.dim(`Loaded ${this.llmConfig?.records.length} LLM providers`));
			} else {
				logger.warn('llmRegistry.json not found.');
			}
			
			// Use the getter here
			const repoPath = path.resolve(this.configDir, 'repositoryRegistry.json');
			
			if (fs.existsSync(repoPath)) {
				this.repoConfig = JSON.parse(fs.readFileSync(repoPath, 'utf-8'));
				if (process.env.DEBUG) logger.success(pc.dim(`Loaded ${this.repoConfig?.records.length} Repository configs`));
			} else {
				logger.warn('repositoryRegistry.json not found.');
			}
			
		} catch (error) {
			logger.error('Failed to parse Configuration Registries:', error);
			process.exit(1);
		}
	}
	
	private validateEnvironment() {
		const defaultProvider = process.env.LLM_PROVIDER || 'gemini';
		if (process.env.DEBUG) {
			logger.info(pc.dim(`Active LLM Provider: ${defaultProvider}`));
		}
	}
}

export const configService = new ConfigService();