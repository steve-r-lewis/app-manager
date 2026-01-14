/**
 * ================================================================================
 *
 * @project:    app-manager
 * @file:       ~/app/commands/commandRegistry.ts
 * @version:    1.0.0
 * @createDate: 2026 Jan 07
 * @createTime: 01:05
 * @author:     Steve R Lewis
 *
 * ================================================================================
 *
 * @description:
 * The CommandRegistry module provides a centralized in-memory registry for managing
 * all CLI command implementations (BaseCommand instances) within the application.
 *
 * It supports:
 * - Registration of commands, with warnings on duplicate IDs.
 * - Lookup of commands by domain and name for Headless CLI execution.
 * - Retrieval of commands by domain for Interactive TUI menus.
 * - Enumeration of all unique command domains.
 * - Retrieval of all registered commands.
 *
 * This module is exported as a singleton, ensuring a single authoritative registry
 * instance across the application lifecycle.
 *
 * ================================================================================
 *
 * @notes: Revision History
 *
 * V1.0.0, 20260107-01:05
 * Initial creation and release of commandRegistry.ts
 *
 * ================================================================================
 */

import { BaseCommand } from './baseCommand';
import { logger } from '../services/loggerService';

class CommandRegistry {
	private commands = new Map<string, BaseCommand>();
	
	/**
	 * Registers a command instance.
	 */
	public register(command: BaseCommand): void {
		if (this.commands.has(command.metadata.id)) {
			logger.warn(`Overwriting command: ${command.metadata.id}`);
		}
		this.commands.set(command.metadata.id, command);
	}
	
	/**
	 * Finds a command by Domain and Name (e.g., 'git', 'commit').
	 * Used by Headless CLI Mode logic.
	 */
	public get(domain: string, name: string): BaseCommand | undefined {
		return Array.from(this.commands.values()).find(
			c => c.metadata.domain === domain && c.metadata.name === name
		);
	}
	
	/**
	 * Returns all commands for a specific domain (e.g., 'git').
	 * Used by Interactive TUI Mode menus.
	 */
	public getByDomain(domain: string): BaseCommand[] {
		return Array.from(this.commands.values())
			.filter(c => c.metadata.domain === domain && !c.metadata.hidden);
	}
	
	/**
	 * Returns all unique domains registered (e.g., ['app', 'git', 'nuxt']).
	 */
	public getDomains(): string[] {
		const domains = new Set(Array.from(this.commands.values()).map(c => c.metadata.domain));
		return Array.from(domains).sort();
	}
	
	/**
	 * Returns all registered commands.
	 */
	public getAll(): BaseCommand[] {
		return Array.from(this.commands.values());
	}
}

export const commandRegistry = new CommandRegistry();