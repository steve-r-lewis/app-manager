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

export interface LLMRegistry {
	records: Array<{
		id: string;
		apiKeyEnv: string;
		model: string;
	}>;
}

export interface RepoRegistry {
	records: Array<{
		repositoryName: string;
		githubToken: string;
	}>;
}

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
			// Load LLM Registry
			const llmPath = path.resolve(this.toolRoot, 'config/llmRegistry.json');
			if (fs.existsSync(llmPath)) {
				const raw = fs.readFileSync(llmPath, 'utf-8');
				this.llmConfig = JSON.parse(raw);
				if (process.env.DEBUG) consola.success(pc.dim(`Loaded ${this.llmConfig?.records.length} LLM providers`));
			} else {
				consola.warn('llmRegistry.json not found.');
			}
			
			// Load Repo Registry
			const repoPath = path.resolve(this.toolRoot, 'config/repositoryRegistry.json');
			if (fs.existsSync(repoPath)) {
				const raw = fs.readFileSync(repoPath, 'utf-8');
				this.repoConfig = JSON.parse(raw);
				if (process.env.DEBUG) consola.success(pc.dim(`Loaded ${this.repoConfig?.records.length} Repository configs`));
			} else {
				consola.warn('repositoryRegistry.json not found.');
			}
			
		} catch (error) {
			consola.error('Failed to parse Configuration Registries:', error);
			process.exit(1); // Fatal error if config is corrupt
		}
	}
	
	private validateEnvironment() {
		// Example: Check if the Default Provider's key is present
		const defaultProvider = process.env.LLM_PROVIDER || 'gemini';
		
		// This is a basic check. In the future, we can cross-reference
		// this.llmConfig.records to ensure the specific apiKeyEnv exists.
		if (process.env.DEBUG) {
			consola.info(pc.dim(`Active LLM Provider: ${defaultProvider}`));
		}
	}
}

export const configService = new ConfigService();