/**
 * ================================================================================
 *
 * @project:    app-manager
 * @file:       ~/app/services/config.service.ts
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
 * Initial creation and release of config.service.ts
 *
 * ================================================================================
 */

import path from 'path';
import fs from 'fs';
import dotenv from 'dotenv';
import { consola } from 'consola';
import pc from 'picocolors';
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
	
	private loadEnv() {
		const envPath = path.resolve(this.toolRoot, '.env');
		if (fs.existsSync(envPath)) {
			dotenv.config({ path: envPath });
			if (process.env.DEBUG) consola.success(pc.dim('Loaded .env configuration'));
		} else {
			consola.warn(pc.yellow('No .env file found in tool root. AI features may fail.'));
		}
	}
	
	private loadRegistries() {
		try {
			const llmPath = path.resolve(this.toolRoot, 'config/llmRegistry.json');
			if (fs.existsSync(llmPath)) {
				this.llmConfig = JSON.parse(fs.readFileSync(llmPath, 'utf-8'));
				if (process.env.DEBUG) consola.success(pc.dim(`Loaded ${this.llmConfig?.records.length} LLM providers`));
			} else {
				consola.warn('llmRegistry.json not found.');
			}
			
			const repoPath = path.resolve(this.toolRoot, 'config/repositoryRegistry.json');
			if (fs.existsSync(repoPath)) {
				this.repoConfig = JSON.parse(fs.readFileSync(repoPath, 'utf-8'));
				if (process.env.DEBUG) consola.success(pc.dim(`Loaded ${this.repoConfig?.records.length} Repository configs`));
			} else {
				consola.warn('repositoryRegistry.json not found.');
			}
			
		} catch (error) {
			consola.error('Failed to parse Configuration Registries:', error);
			process.exit(1);
		}
	}
	
	private validateEnvironment() {
		const defaultProvider = process.env.LLM_PROVIDER || 'gemini';
		if (process.env.DEBUG) {
			consola.info(pc.dim(`Active LLM Provider: ${defaultProvider}`));
		}
	}
}

export const configService = new ConfigService();